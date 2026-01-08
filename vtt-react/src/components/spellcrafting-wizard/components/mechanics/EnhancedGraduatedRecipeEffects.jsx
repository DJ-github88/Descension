import React, { useState, useEffect, useCallback, memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTrash, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { FaFire, FaHeart, FaWandMagic, FaSkull, FaGauge, FaHandSparkles, FaDragon, FaVirus } from 'react-icons/fa6';
import { useSpellWizardState } from '../../context/spellWizardContext';
import { getIconUrl } from '../../utils/iconUtils';
import '../../styles/GraduatedRecipeEffects.css';

/**
 * Enhanced component for configuring graduated effects based on partial recipe matches
 * Allows accessing and modifying all configured spell effects
 */
const EnhancedGraduatedRecipeEffects = ({
  recipeLength,
  graduatedEffects,
  onGraduatedEffectsChange,
  effectType = 'damage', // 'damage', 'healing', 'buff', etc.
  selectedToxicTypes = {}, // Pass selected toxic types from parent
  onToxicTooltipEnter = null, // Tooltip handler from parent
  onToxicTooltipLeave = null, // Tooltip handler from parent
  onToxicTooltipMove = null, // Tooltip handler from parent
  isChordSystem = false // Whether this is being used in the chord system
}) => {
  // Access the spell wizard state to get all configured effects
  const spellWizardState = useSpellWizardState();

  // Get default formula based on effect type
  const getDefaultFormula = (type, subType = null) => {
    switch(type) {
      case 'damage':
        if (subType === 'dot') {
          return spellWizardState.damageConfig?.dotFormula || '1d6 + INT/2';
        } else if (subType === 'direct') {
          return spellWizardState.damageConfig?.formula || '2d6 + INT';
        }
        return spellWizardState.damageConfig?.formula || '2d6 + INT';
      case 'healing':
        if (subType === 'hot') {
          return spellWizardState.healingConfig?.hotFormula || '1d6 + HEA/2';
        } else if (subType === 'shield') {
          return spellWizardState.healingConfig?.shieldFormula || '3d6 + HEA';
        } else {
          return spellWizardState.healingConfig?.formula || '2d8 + HEA';
        }
      case 'buff':
        // For buffs, we don't have a single formula, but we can return a placeholder
        return '1d6';
      case 'debuff':
        // For debuffs, we don't have a single formula, but we can return a placeholder
        return '1d6';
      default:
        return '1d6';
    }
  };

  // Get default effect configuration based on effect type
  const getDefaultEffectConfig = (type) => {
    switch(type) {
      case 'damage':
        return spellWizardState.damageConfig ? { ...spellWizardState.damageConfig } : null;
      case 'healing':
        return spellWizardState.healingConfig ? { ...spellWizardState.healingConfig } : null;
      case 'buff':
        return spellWizardState.buffConfig ? { ...spellWizardState.buffConfig } : null;
      case 'debuff':
        return spellWizardState.debuffConfig ? { ...spellWizardState.debuffConfig } : null;
      default:
        return null;
    }
  };

  // Initialize with default graduated effects if none provided
  const [effects, setEffects] = useState(() => {
    if (graduatedEffects && Object.keys(graduatedEffects).length > 0) {
      // Make sure each effect has the necessary properties based on its type
      const enhancedEffects = {};

      Object.entries(graduatedEffects).forEach(([level, effect]) => {
        enhancedEffects[level] = {
          ...effect,
          // Make sure effectType is set
          effectType: effect.effectType || effectType,
          // Make sure effectReferences is set
          effectReferences: effect.effectReferences || {
            damage: spellWizardState.damageConfig ? true : false,
            healing: spellWizardState.healingConfig ? true : false,
            buff: spellWizardState.buffConfig ? true : false,
            debuff: spellWizardState.debuffConfig ? true : false,
            control: spellWizardState.controlConfig ? true : false,
            summoning: spellWizardState.summonConfig ? true : false
          },
          // For buff effects, make sure statModifiers is set
          ...(effect.effectType === 'buff' && !effect.statModifiers && spellWizardState.buffConfig ? {
            statModifiers: [...(spellWizardState.buffConfig.statModifiers || [])],
            statusEffects: [...(spellWizardState.buffConfig.statusEffects || [])],
            duration: spellWizardState.buffConfig.duration,
            durationValue: spellWizardState.buffConfig.durationValue,
            durationType: spellWizardState.buffConfig.durationType,
            durationUnit: spellWizardState.buffConfig.durationUnit,
          } : {}),
          // For debuff effects, make sure statPenalties is set
          ...(effect.effectType === 'debuff' && !effect.statPenalties && spellWizardState.debuffConfig ? {
            statPenalties: [...(spellWizardState.debuffConfig.statPenalties || [])],
            statusEffects: [...(spellWizardState.debuffConfig.statusEffects || [])],
            duration: spellWizardState.debuffConfig.duration,
            durationValue: spellWizardState.debuffConfig.durationValue,
            durationType: spellWizardState.debuffConfig.durationType,
            durationUnit: spellWizardState.debuffConfig.durationUnit,
          } : {})
        };
      });

      return enhancedEffects;
    }

    // Default to at least one effect for the full recipe match
    const defaults = {};
    if (recipeLength > 0) {
      // Get the default effect configuration for the current effect type
      const defaultConfig = getDefaultEffectConfig(effectType);

      defaults[recipeLength] = {
        formula: getDefaultFormula(effectType),
        description: isChordSystem ? `Full match (${recipeLength} chord functions)` : `Full match (${recipeLength} toxic types)`,
        effectType: effectType,
        // Add references to the original effect configurations
        effectReferences: {
          damage: spellWizardState.damageConfig ? true : false,
          healing: spellWizardState.healingConfig ? true : false,
          buff: spellWizardState.buffConfig ? true : false,
          debuff: spellWizardState.debuffConfig ? true : false,
          control: spellWizardState.controlConfig ? true : false,
          summoning: spellWizardState.summonConfig ? true : false
        },
        // Include the full effect configuration
        effectConfig: defaultConfig,
        // For buff and debuff, include specific properties
        ...(effectType === 'buff' && spellWizardState.buffConfig ? {
          statModifiers: [...(spellWizardState.buffConfig.statModifiers || [])],
          statusEffects: [...(spellWizardState.buffConfig.statusEffects || [])],
          duration: spellWizardState.buffConfig.duration,
          durationValue: spellWizardState.buffConfig.durationValue,
          durationType: spellWizardState.buffConfig.durationType,
          durationUnit: spellWizardState.buffConfig.durationUnit,
        } : {}),
        ...(effectType === 'debuff' && spellWizardState.debuffConfig ? {
          statPenalties: [...(spellWizardState.debuffConfig.statPenalties || [])],
          statusEffects: [...(spellWizardState.debuffConfig.statusEffects || [])],
          duration: spellWizardState.debuffConfig.duration,
          durationValue: spellWizardState.debuffConfig.durationValue,
          durationType: spellWizardState.debuffConfig.durationType,
          durationUnit: spellWizardState.debuffConfig.durationUnit,
        } : {}),
        // For damage and healing, include critical hit and chance-on-hit configurations
        ...(effectType === 'damage' && spellWizardState.damageConfig ? {
          criticalConfig: spellWizardState.damageConfig.criticalConfig,
          chanceOnHitConfig: spellWizardState.damageConfig.chanceOnHitConfig
        } : {}),
        ...(effectType === 'healing' && spellWizardState.healingConfig ? {
          criticalConfig: spellWizardState.healingConfig.criticalConfig,
          chanceOnHitConfig: spellWizardState.healingConfig.chanceOnHitConfig,
          healingType: spellWizardState.healingConfig.healingType || 'direct',
          // Store direct healing formula
          directFormula: spellWizardState.healingConfig.formula || getDefaultFormula('healing', 'direct'),
          // Only add HoT properties if HoT is selected
          ...(spellWizardState.healingConfig.healingType === 'hot' || spellWizardState.healingConfig.hasHotEffect ? {
            hasHotEffect: true,
            hotFormula: spellWizardState.healingConfig.hotFormula || getDefaultFormula('healing', 'hot'),
            hotDuration: spellWizardState.healingConfig.hotDuration || 3,
            hotTickType: spellWizardState.healingConfig.hotTickType || 'round',
            hotApplication: spellWizardState.healingConfig.hotApplication || 'standard',
            hotScalingType: spellWizardState.healingConfig.hotScalingType || 'linear',
            hotTriggerType: spellWizardState.healingConfig.hotTriggerType || 'round'
          } : { hasHotEffect: false }),
          // Only add Shield properties if Shield is selected
          ...(spellWizardState.healingConfig.healingType === 'shield' || spellWizardState.healingConfig.hasShieldEffect ? {
            hasShieldEffect: true,
            shieldFormula: spellWizardState.healingConfig.shieldFormula || getDefaultFormula('healing', 'shield'),
            shieldDuration: spellWizardState.healingConfig.shieldDuration || 3,
            shieldDamageTypes: spellWizardState.healingConfig.shieldDamageTypes || 'all',
            shieldOverflow: spellWizardState.healingConfig.shieldOverflow || false,
            shieldBreakBehavior: spellWizardState.healingConfig.shieldBreakBehavior || 'fade'
          } : { hasShieldEffect: false })
        } : {}),
        // For control effects, include control-specific properties
        ...(effectType === 'control' && spellWizardState.controlConfig ? {
          effects: [...(spellWizardState.controlConfig.effects || [])],
          duration: spellWizardState.controlConfig.duration,
          durationUnit: spellWizardState.controlConfig.durationUnit,
          savingThrow: spellWizardState.controlConfig.savingThrow,
          savingThrowType: spellWizardState.controlConfig.savingThrowType,
          difficultyClass: spellWizardState.controlConfig.difficultyClass,
          concentration: spellWizardState.controlConfig.concentration
        } : {}),
        // For summoning effects, include summoning-specific properties
        ...(effectType === 'summoning' && spellWizardState.summonConfig ? {
          summonType: spellWizardState.summonConfig.summonType,
          creatures: [...(spellWizardState.summonConfig.creatures || [])],
          duration: spellWizardState.summonConfig.duration,
          durationUnit: spellWizardState.summonConfig.durationUnit,
          hasDuration: spellWizardState.summonConfig.hasDuration,
          concentration: spellWizardState.summonConfig.concentration,
          quantity: spellWizardState.summonConfig.quantity,
          maxQuantity: spellWizardState.summonConfig.maxQuantity,
          controlRange: spellWizardState.summonConfig.controlRange,
          controlType: spellWizardState.summonConfig.controlType,
          difficultyLevel: spellWizardState.summonConfig.difficultyLevel
        } : {})
      };
    }
    return defaults;
  });

  // Get all available effect types from the spell wizard state
  const getAvailableEffectTypes = () => {
    const availableEffects = [];
    const effectsMap = spellWizardState.effectsMap || {};

    // Ensure all React Icons are available
    if (!FaFire || !FaHeart || !FaWandMagic || !FaSkull || !FaHandSparkles || !FaDragon || !FaGauge) {
      console.warn('Some React Icons are not available, using fallback');
      return [{
        id: 'damage',
        name: 'Damage',
        icon: FaFire || (() => null),
        formula: '2d6 + INT'
      }];
    }

    // Always include the current effect type even if not configured
    const hasCurrentEffectType = [
      'damage', 'healing', 'buff', 'debuff', 'control', 'summoning', 'utility'
    ].includes(effectType);

    // Only add damage if it's configured in the spell wizard state
    if (spellWizardState.damageConfig && effectsMap.damage) {
      // Check if this is a DoT or combined damage type
      if (spellWizardState.damageConfig.damageType === 'dot' || spellWizardState.damageConfig.hasDotEffect) {
        // For DoT or combined damage, add appropriate effect
        if (spellWizardState.damageConfig.damageType === 'dot') {
          // Pure DoT effect
          availableEffects.push({
            id: 'damage',
            name: 'Damage Over Time',
            icon: FaFire,
            formula: spellWizardState.damageConfig.dotFormula || spellWizardState.damageConfig.formula,
            damageType: 'dot',
            dotDuration: spellWizardState.damageConfig.dotDuration,
            dotTickType: spellWizardState.damageConfig.dotTickType,
            dotScalingType: spellWizardState.damageConfig.dotScalingType,
            dotTriggerType: spellWizardState.damageConfig.dotTriggerType,
            elementType: spellWizardState.damageConfig.elementType
          });
        } else if (spellWizardState.damageConfig.hasDotEffect) {
          // Combined damage (direct + DoT)
          availableEffects.push({
            id: 'damage',
            name: 'Combined Damage',
            icon: FaFire,
            formula: spellWizardState.damageConfig.formula,
            damageType: 'direct',
            hasDotEffect: true,
            dotFormula: spellWizardState.damageConfig.dotFormula,
            dotDuration: spellWizardState.damageConfig.dotDuration,
            dotTickType: spellWizardState.damageConfig.dotTickType,
            dotScalingType: spellWizardState.damageConfig.dotScalingType,
            dotTriggerType: spellWizardState.damageConfig.dotTriggerType,
            elementType: spellWizardState.damageConfig.elementType
          });
        }
      } else {
        // Regular direct damage
        availableEffects.push({
          id: 'damage',
          name: 'Damage',
          icon: FaFire,
          formula: spellWizardState.damageConfig.formula,
          damageType: 'direct',
          elementType: spellWizardState.damageConfig.elementType
        });
      }
    } else if (effectType === 'damage' && !hasCurrentEffectType) {
      availableEffects.push({
        id: 'damage',
        name: 'Damage',
        icon: FaFire,
        formula: '2d6 + INT'
      });
    }

    // Only add healing if it's configured in the spell wizard state
    if (spellWizardState.healingConfig && effectsMap.healing) {
      // Check healing type and add appropriate effect
      if (spellWizardState.healingConfig.healingType === 'hot' ||
          spellWizardState.healingConfig.healingType === 'shield' ||
          spellWizardState.healingConfig.hasHotEffect ||
          spellWizardState.healingConfig.hasShieldEffect) {

        // Pure HoT effect
        if (spellWizardState.healingConfig.healingType === 'hot') {
          availableEffects.push({
            id: 'healing',
            name: 'Healing Over Time',
            icon: FaHeart,
            formula: spellWizardState.healingConfig.hotFormula || spellWizardState.healingConfig.formula,
            healingType: 'hot',
            hotDuration: spellWizardState.healingConfig.hotDuration,
            hotTickType: spellWizardState.healingConfig.hotTickType,
            hotApplication: spellWizardState.healingConfig.hotApplication,
            hotScalingType: spellWizardState.healingConfig.hotScalingType,
            hotTriggerType: spellWizardState.healingConfig.hotTriggerType
          });
        }
        // Pure Shield effect
        else if (spellWizardState.healingConfig.healingType === 'shield') {
          availableEffects.push({
            id: 'healing',
            name: 'Absorption Shield',
            icon: FaHeart,
            formula: spellWizardState.healingConfig.shieldFormula || spellWizardState.healingConfig.formula,
            healingType: 'shield',
            shieldDuration: spellWizardState.healingConfig.shieldDuration,
            shieldDamageTypes: spellWizardState.healingConfig.shieldDamageTypes,
            shieldOverflow: spellWizardState.healingConfig.shieldOverflow,
            shieldBreakBehavior: spellWizardState.healingConfig.shieldBreakBehavior
          });
        }
        // Direct healing + HoT
        else if (spellWizardState.healingConfig.healingType === 'direct' && spellWizardState.healingConfig.hasHotEffect) {
          availableEffects.push({
            id: 'healing',
            name: 'Combined Healing',
            icon: FaHeart,
            formula: spellWizardState.healingConfig.formula,
            healingType: 'direct',
            hasHotEffect: true,
            hotFormula: spellWizardState.healingConfig.hotFormula,
            hotDuration: spellWizardState.healingConfig.hotDuration,
            hotTickType: spellWizardState.healingConfig.hotTickType,
            hotApplication: spellWizardState.healingConfig.hotApplication,
            hotScalingType: spellWizardState.healingConfig.hotScalingType,
            hotTriggerType: spellWizardState.healingConfig.hotTriggerType
          });
        }
        // Direct healing + Shield
        else if (spellWizardState.healingConfig.healingType === 'direct' && spellWizardState.healingConfig.hasShieldEffect) {
          availableEffects.push({
            id: 'healing',
            name: 'Healing with Shield',
            icon: FaHeart,
            formula: spellWizardState.healingConfig.formula,
            healingType: 'direct',
            hasShieldEffect: true,
            shieldFormula: spellWizardState.healingConfig.shieldFormula,
            shieldDuration: spellWizardState.healingConfig.shieldDuration,
            shieldDamageTypes: spellWizardState.healingConfig.shieldDamageTypes,
            shieldOverflow: spellWizardState.healingConfig.shieldOverflow,
            shieldBreakBehavior: spellWizardState.healingConfig.shieldBreakBehavior
          });
        }
        // HoT + Shield
        else if (spellWizardState.healingConfig.healingType === 'hot' && spellWizardState.healingConfig.hasShieldEffect) {
          availableEffects.push({
            id: 'healing',
            name: 'HoT with Shield',
            icon: FaHeart,
            formula: spellWizardState.healingConfig.hotFormula,
            healingType: 'hot',
            hasShieldEffect: true,
            hotDuration: spellWizardState.healingConfig.hotDuration,
            hotTickType: spellWizardState.healingConfig.hotTickType,
            hotApplication: spellWizardState.healingConfig.hotApplication,
            hotScalingType: spellWizardState.healingConfig.hotScalingType,
            hotTriggerType: spellWizardState.healingConfig.hotTriggerType,
            shieldFormula: spellWizardState.healingConfig.shieldFormula,
            shieldDuration: spellWizardState.healingConfig.shieldDuration,
            shieldDamageTypes: spellWizardState.healingConfig.shieldDamageTypes,
            shieldOverflow: spellWizardState.healingConfig.shieldOverflow,
            shieldBreakBehavior: spellWizardState.healingConfig.shieldBreakBehavior
          });
        }
      } else {
        // Regular direct healing
        availableEffects.push({
          id: 'healing',
          name: 'Healing',
          icon: FaHeart,
          formula: spellWizardState.healingConfig.formula,
          healingType: 'direct'
        });
      }
    } else if (effectType === 'healing' && !hasCurrentEffectType) {
      availableEffects.push({
        id: 'healing',
        name: 'Healing',
        icon: FaHeart,
        formula: '2d8 + HEA'
      });
    }

    // Only add buff if it's configured in the spell wizard state
    if (spellWizardState.buffConfig && effectsMap.buff) {
      // For buffs, we need to check if there are stat modifiers
      const statModifiersDescription = spellWizardState.buffConfig.statModifiers &&
                                      spellWizardState.buffConfig.statModifiers.length > 0 ?
                                      `(${spellWizardState.buffConfig.statModifiers.length} stats)` : '';

      availableEffects.push({
        id: 'buff',
        name: 'Buff',
        icon: FaWandMagic,
        formula: statModifiersDescription || 'Buff Effects',
        statModifiers: spellWizardState.buffConfig.statModifiers || []
      });
    } else if (effectType === 'buff' && !hasCurrentEffectType) {
      availableEffects.push({
        id: 'buff',
        name: 'Buff',
        icon: FaWandMagic,
        formula: 'Buff Effects',
        statModifiers: []
      });
    }

    // Only add debuff if it's configured in the spell wizard state
    if (spellWizardState.debuffConfig && effectsMap.debuff) {
      // For debuffs, we need to check if there are stat penalties
      const statPenaltiesDescription = spellWizardState.debuffConfig.statPenalties &&
                                      spellWizardState.debuffConfig.statPenalties.length > 0 ?
                                      `(${spellWizardState.debuffConfig.statPenalties.length} stats)` : '';

      availableEffects.push({
        id: 'debuff',
        name: 'Debuff',
        icon: FaSkull,
        formula: statPenaltiesDescription || 'Debuff Effects',
        statPenalties: spellWizardState.debuffConfig.statPenalties || []
      });
    } else if (effectType === 'debuff' && !hasCurrentEffectType) {
      availableEffects.push({
        id: 'debuff',
        name: 'Debuff',
        icon: FaSkull,
        formula: 'Debuff Effects',
        statPenalties: []
      });
    }

    // Only add control if it's configured in the spell wizard state
    if (spellWizardState.controlConfig && effectsMap.control) {
      // For control effects, check if there are control effects configured
      const controlEffectsDescription = spellWizardState.controlConfig.effects &&
                                      spellWizardState.controlConfig.effects.length > 0 ?
                                      `(${spellWizardState.controlConfig.effects.length} effects)` : '';

      availableEffects.push({
        id: 'control',
        name: 'Control',
        icon: FaHandSparkles,
        formula: controlEffectsDescription || 'Control Effects',
        effects: spellWizardState.controlConfig.effects || []
      });
    } else if (effectType === 'control' && !hasCurrentEffectType) {
      availableEffects.push({
        id: 'control',
        name: 'Control',
        icon: FaHandSparkles,
        formula: 'Control Effects',
        effects: []
      });
    }

    // Only add summoning if it's configured in the spell wizard state
    if (spellWizardState.summonConfig && effectsMap.summoning) {
      // For summoning effects, check if there are creatures configured
      const summoningDescription = spellWizardState.summonConfig.creatures &&
                                  spellWizardState.summonConfig.creatures.length > 0 ?
                                  `(${spellWizardState.summonConfig.creatures.length} creatures)` : '';

      availableEffects.push({
        id: 'summoning',
        name: 'Summoning',
        icon: FaDragon,
        formula: summoningDescription || 'Summoning Effects',
        creatures: spellWizardState.summonConfig.creatures || []
      });
    } else if (effectType === 'summoning' && !hasCurrentEffectType) {
      availableEffects.push({
        id: 'summoning',
        name: 'Summoning',
        icon: FaDragon,
        formula: 'Summoning Effects',
        creatures: []
      });
    }

    // Only add utility if it's configured in the spell wizard state
    if (spellWizardState.utilityConfig && effectsMap.utility) {
      // For utility effects, check if there are selected effects configured
      const utilityDescription = spellWizardState.utilityConfig.selectedEffects &&
                                spellWizardState.utilityConfig.selectedEffects.length > 0 ?
                                `(${spellWizardState.utilityConfig.selectedEffects.length} effects)` : '';

      availableEffects.push({
        id: 'utility',
        name: 'Utility',
        icon: FaGauge,
        formula: utilityDescription || 'Utility Effects',
        selectedEffects: spellWizardState.utilityConfig.selectedEffects || []
      });
    } else if (effectType === 'utility' && !hasCurrentEffectType) {
      availableEffects.push({
        id: 'utility',
        name: 'Utility',
        icon: FaGauge,
        formula: 'Utility Effects',
        selectedEffects: []
      });
    }

    // If no effects are available, add a default one based on the current effect type
    if (availableEffects.length === 0) {
      availableEffects.push({
        id: 'damage',
        name: 'Damage',
        icon: FaFire,
        formula: '2d6 + INT'
      });
    }

    return availableEffects;
  };

  // Update parent when effects change - but only if effects actually changed
  useEffect(() => {
    if (Object.keys(effects).length > 0) {
      onGraduatedEffectsChange(effects);
    }
  }, [effects, onGraduatedEffectsChange]);

  // Update when recipe length changes
  useEffect(() => {
    if (recipeLength > 0 && Object.keys(effects).length === 0) {
      // Get the default effect configuration for the current effect type
      const defaultConfig = getDefaultEffectConfig(effectType);

      setEffects({
        [recipeLength]: {
          formula: getDefaultFormula(effectType),
          description: isChordSystem ? `Full match (${recipeLength} chord functions)` : `Full match (${recipeLength} toxic types)`,
          effectType: effectType,
          // Add references to the original effect configurations
          effectReferences: {
            damage: spellWizardState.damageConfig ? true : false,
            healing: spellWizardState.healingConfig ? true : false,
            buff: spellWizardState.buffConfig ? true : false,
            debuff: spellWizardState.debuffConfig ? true : false,
            control: spellWizardState.controlConfig ? true : false,
            summoning: spellWizardState.summonConfig ? true : false,
            utility: spellWizardState.utilityConfig ? true : false
          },
          // Include the full effect configuration
          effectConfig: defaultConfig,
          // For buff and debuff, include specific properties
          ...(effectType === 'buff' && spellWizardState.buffConfig ? {
            statModifiers: [...(spellWizardState.buffConfig.statModifiers || [])],
            statusEffects: [...(spellWizardState.buffConfig.statusEffects || [])],
            duration: spellWizardState.buffConfig.duration,
            durationValue: spellWizardState.buffConfig.durationValue,
            durationType: spellWizardState.buffConfig.durationType,
            durationUnit: spellWizardState.buffConfig.durationUnit,
          } : {}),
          ...(effectType === 'debuff' && spellWizardState.debuffConfig ? {
            statPenalties: [...(spellWizardState.debuffConfig.statPenalties || [])],
            statusEffects: [...(spellWizardState.debuffConfig.statusEffects || [])],
            duration: spellWizardState.debuffConfig.duration,
            durationValue: spellWizardState.debuffConfig.durationValue,
            durationType: spellWizardState.debuffConfig.durationType,
            durationUnit: spellWizardState.debuffConfig.durationUnit,
          } : {}),
          // For damage, include damage-specific properties based on damage type
          ...(effectType === 'damage' && spellWizardState.damageConfig ? {
            criticalConfig: spellWizardState.damageConfig.criticalConfig,
            chanceOnHitConfig: spellWizardState.damageConfig.chanceOnHitConfig,
            elementType: spellWizardState.damageConfig.elementType,
            // Handle different damage types
            ...(spellWizardState.damageConfig.damageType === 'dot' ? {
              damageType: 'dot',
              formula: spellWizardState.damageConfig.dotFormula || spellWizardState.damageConfig.formula,
              dotDuration: spellWizardState.damageConfig.dotDuration,
              dotTickType: spellWizardState.damageConfig.dotTickType,
              dotScalingType: spellWizardState.damageConfig.dotScalingType,
              dotTriggerType: spellWizardState.damageConfig.dotTriggerType
            } : {}),
            // Handle combined damage (direct + DoT)
            ...(spellWizardState.damageConfig.damageType === 'direct' && spellWizardState.damageConfig.hasDotEffect ? {
              damageType: 'direct',
              hasDotEffect: true,
              formula: spellWizardState.damageConfig.formula,
              dotFormula: spellWizardState.damageConfig.dotFormula,
              dotDuration: spellWizardState.damageConfig.dotDuration,
              dotTickType: spellWizardState.damageConfig.dotTickType,
              dotScalingType: spellWizardState.damageConfig.dotScalingType,
              dotTriggerType: spellWizardState.damageConfig.dotTriggerType
            } : {}),
            // Handle direct damage
            ...(spellWizardState.damageConfig.damageType === 'direct' && !spellWizardState.damageConfig.hasDotEffect ? {
              damageType: 'direct',
              formula: spellWizardState.damageConfig.formula
            } : {})
          } : {}),
          // For healing, include healing-specific properties based on healing type
          ...(effectType === 'healing' && spellWizardState.healingConfig ? {
            criticalConfig: spellWizardState.healingConfig.criticalConfig,
            chanceOnHitConfig: spellWizardState.healingConfig.chanceOnHitConfig,
            // Handle different healing types
            // Pure HoT effect
            ...(spellWizardState.healingConfig.healingType === 'hot' ? {
              healingType: 'hot',
              formula: spellWizardState.healingConfig.hotFormula || spellWizardState.healingConfig.formula,
              hotDuration: spellWizardState.healingConfig.hotDuration,
              hotTickType: spellWizardState.healingConfig.hotTickType,
              hotApplication: spellWizardState.healingConfig.hotApplication,
              hotScalingType: spellWizardState.healingConfig.hotScalingType,
              hotTriggerType: spellWizardState.healingConfig.hotTriggerType,
              // Include shield effect if present
              ...(spellWizardState.healingConfig.hasShieldEffect ? {
                hasShieldEffect: true,
                shieldFormula: spellWizardState.healingConfig.shieldFormula,
                shieldDuration: spellWizardState.healingConfig.shieldDuration,
                shieldDamageTypes: spellWizardState.healingConfig.shieldDamageTypes,
                shieldOverflow: spellWizardState.healingConfig.shieldOverflow,
                shieldBreakBehavior: spellWizardState.healingConfig.shieldBreakBehavior
              } : {})
            } : {}),
            // Pure Shield effect
            ...(spellWizardState.healingConfig.healingType === 'shield' ? {
              healingType: 'shield',
              formula: spellWizardState.healingConfig.shieldFormula || spellWizardState.healingConfig.formula,
              shieldDuration: spellWizardState.healingConfig.shieldDuration,
              shieldDamageTypes: spellWizardState.healingConfig.shieldDamageTypes,
              shieldOverflow: spellWizardState.healingConfig.shieldOverflow,
              shieldBreakBehavior: spellWizardState.healingConfig.shieldBreakBehavior,
              // Include HoT effect if present
              ...(spellWizardState.healingConfig.hasHotEffect ? {
                hasHotEffect: true,
                hotFormula: spellWizardState.healingConfig.hotFormula,
                hotDuration: spellWizardState.healingConfig.hotDuration,
                hotTickType: spellWizardState.healingConfig.hotTickType,
                hotApplication: spellWizardState.healingConfig.hotApplication,
                hotScalingType: spellWizardState.healingConfig.hotScalingType,
                hotTriggerType: spellWizardState.healingConfig.hotTriggerType
              } : {})
            } : {}),
            // Direct healing with possible HoT or Shield effects
            ...(spellWizardState.healingConfig.healingType === 'direct' ? {
              healingType: 'direct',
              formula: spellWizardState.healingConfig.formula,
              // Include HoT effect if present
              ...(spellWizardState.healingConfig.hasHotEffect ? {
                hasHotEffect: true,
                hotFormula: spellWizardState.healingConfig.hotFormula,
                hotDuration: spellWizardState.healingConfig.hotDuration,
                hotTickType: spellWizardState.healingConfig.hotTickType,
                hotApplication: spellWizardState.healingConfig.hotApplication,
                hotScalingType: spellWizardState.healingConfig.hotScalingType,
                hotTriggerType: spellWizardState.healingConfig.hotTriggerType
              } : {}),
              // Include shield effect if present
              ...(spellWizardState.healingConfig.hasShieldEffect ? {
                hasShieldEffect: true,
                shieldFormula: spellWizardState.healingConfig.shieldFormula,
                shieldDuration: spellWizardState.healingConfig.shieldDuration,
                shieldDamageTypes: spellWizardState.healingConfig.shieldDamageTypes,
                shieldOverflow: spellWizardState.healingConfig.shieldOverflow,
                shieldBreakBehavior: spellWizardState.healingConfig.shieldBreakBehavior
              } : {})
            } : {})
          } : {}),
          // For control effects, include control-specific properties
          ...(effectType === 'control' && spellWizardState.controlConfig ? {
            effects: [...(spellWizardState.controlConfig.effects || [])],
            duration: spellWizardState.controlConfig.duration,
            durationUnit: spellWizardState.controlConfig.durationUnit,
            savingThrow: spellWizardState.controlConfig.savingThrow,
            savingThrowType: spellWizardState.controlConfig.savingThrowType,
            difficultyClass: spellWizardState.controlConfig.difficultyClass,
            concentration: spellWizardState.controlConfig.concentration
          } : {}),
          // For summoning effects, include summoning-specific properties
          ...(effectType === 'summoning' && spellWizardState.summonConfig ? {
            summonType: spellWizardState.summonConfig.summonType,
            creatures: [...(spellWizardState.summonConfig.creatures || [])],
            duration: spellWizardState.summonConfig.duration,
            durationUnit: spellWizardState.summonConfig.durationUnit,
            hasDuration: spellWizardState.summonConfig.hasDuration,
            concentration: spellWizardState.summonConfig.concentration,
            quantity: spellWizardState.summonConfig.quantity,
            maxQuantity: spellWizardState.summonConfig.maxQuantity,
            controlRange: spellWizardState.summonConfig.controlRange,
            controlType: spellWizardState.summonConfig.controlType,
            difficultyLevel: spellWizardState.summonConfig.difficultyLevel
          } : {}),
          // For utility effects, include utility-specific properties
          ...(effectType === 'utility' && spellWizardState.utilityConfig ? {
            utilityType: spellWizardState.utilityConfig.utilityType,
            selectedEffects: [...(spellWizardState.utilityConfig.selectedEffects || [])],
            duration: spellWizardState.utilityConfig.duration,
            durationUnit: spellWizardState.utilityConfig.durationUnit,
            concentration: spellWizardState.utilityConfig.concentration,
            difficultyClass: spellWizardState.utilityConfig.difficultyClass,
            abilitySave: spellWizardState.utilityConfig.abilitySave,
            difficulty: spellWizardState.utilityConfig.difficulty
          } : {})
        }
      });
    }
  }, [recipeLength, effectType, effects]);

  // Add a new graduated effect level
  const addEffectLevel = useCallback(() => {
    // Find the next available level
    const existingLevels = Object.keys(effects).map(Number).sort((a, b) => a - b);

    // If there are no existing levels, start with level 1
    if (existingLevels.length === 0) {
      return addEffectLevelWithNumber(1);
    }

    // Find the first gap or use the next number after the highest
    let newLevel = 1;
    for (let i = 0; i < existingLevels.length; i++) {
      if (existingLevels[i] !== i + 1) {
        newLevel = i + 1;
        break;
      }
      if (i === existingLevels.length - 1) {
        newLevel = existingLevels[i] + 1;
      }
    }

    return addEffectLevelWithNumber(newLevel);
  }, [effects, recipeLength]);

  // Helper function to add an effect level with a specific number
  const addEffectLevelWithNumber = (newLevel) => {

    // Allow adding levels regardless of recipe length
    // if (newLevel > recipeLength) {
    //   return;
    // }

    // The actual effect will be added in the setEffects call below

    // Create a scaled formula based on the level
    const scaleFactor = newLevel / recipeLength;
    let baseFormula = getDefaultFormula(effectType);

    // Try to scale the formula based on the effect type
    if (effectType === 'damage' && spellWizardState.damageConfig) {
      const originalFormula = spellWizardState.damageConfig.formula;
      if (originalFormula && originalFormula.includes('d')) {
        // Extract dice part and try to scale it
        const diceMatch = originalFormula.match(/(\d+)d(\d+)/);
        if (diceMatch) {
          const diceCount = Math.max(1, Math.floor(parseInt(diceMatch[1]) * scaleFactor));
          baseFormula = originalFormula.replace(/\d+d\d+/, `${diceCount}d${diceMatch[2]}`);
        }
      }
    } else if (effectType === 'healing' && spellWizardState.healingConfig) {
      // Get the appropriate formula based on healing type
      let originalFormula;
      if (spellWizardState.healingConfig.healingType === 'direct') {
        originalFormula = spellWizardState.healingConfig.formula;
      } else if (spellWizardState.healingConfig.healingType === 'hot') {
        originalFormula = spellWizardState.healingConfig.hotFormula;
      } else if (spellWizardState.healingConfig.healingType === 'shield') {
        originalFormula = spellWizardState.healingConfig.shieldFormula;
      }

      // Scale the formula if it contains dice
      if (originalFormula && originalFormula.includes('d')) {
        const diceMatch = originalFormula.match(/(\d+)d(\d+)/);
        if (diceMatch) {
          const diceCount = Math.max(1, Math.floor(parseInt(diceMatch[1]) * scaleFactor));
          baseFormula = originalFormula.replace(/\d+d\d+/, `${diceCount}d${diceMatch[2]}`);
        } else {
          baseFormula = originalFormula;
        }
      } else if (originalFormula) {
        baseFormula = originalFormula;
      }
    }

    // Get the default effect configuration for the current effect type
    const defaultConfig = getDefaultEffectConfig(effectType);

    // Create a scaled version of the configuration based on the level
    const scaledConfig = { ...defaultConfig };

    // Create a healing config with all necessary properties
    let healingScaledConfig = {};

    if (effectType === 'healing' && spellWizardState.healingConfig) {
      // Start with the basic healing properties
      healingScaledConfig = {
        healingType: spellWizardState.healingConfig.healingType || 'direct',
        formula: baseFormula,
        resolution: spellWizardState.healingConfig.resolution,
        criticalConfig: spellWizardState.healingConfig.criticalConfig,
        chanceOnHitConfig: spellWizardState.healingConfig.chanceOnHitConfig
      };

      // Add HoT properties if they exist
      if (spellWizardState.healingConfig.hasHotEffect || spellWizardState.healingConfig.healingType === 'hot') {
        const originalHotFormula = spellWizardState.healingConfig.hotFormula;
        let scaledHotFormula = originalHotFormula;

        if (originalHotFormula && originalHotFormula.includes('d')) {
          const diceMatch = originalHotFormula.match(/(\d+)d(\d+)/);
          if (diceMatch) {
            const diceCount = Math.max(1, Math.floor(parseInt(diceMatch[1]) * scaleFactor));
            scaledHotFormula = originalHotFormula.replace(/\d+d\d+/, `${diceCount}d${diceMatch[2]}`);
          }
        }

        healingScaledConfig.hasHotEffect = true;
        healingScaledConfig.hotFormula = scaledHotFormula;
        healingScaledConfig.hotDuration = spellWizardState.healingConfig.hotDuration;
        healingScaledConfig.hotTickType = spellWizardState.healingConfig.hotTickType;
        healingScaledConfig.hotApplication = spellWizardState.healingConfig.hotApplication;
        healingScaledConfig.hotScalingType = spellWizardState.healingConfig.hotScalingType;
        healingScaledConfig.hotTriggerType = spellWizardState.healingConfig.hotTriggerType;
      }

      // Add shield properties if they exist
      if (spellWizardState.healingConfig.hasShieldEffect || spellWizardState.healingConfig.healingType === 'shield') {
        const originalShieldFormula = spellWizardState.healingConfig.shieldFormula;
        let scaledShieldFormula = originalShieldFormula;

        if (originalShieldFormula && originalShieldFormula.includes('d')) {
          const diceMatch = originalShieldFormula.match(/(\d+)d(\d+)/);
          if (diceMatch) {
            const diceCount = Math.max(1, Math.floor(parseInt(diceMatch[1]) * scaleFactor));
            scaledShieldFormula = originalShieldFormula.replace(/\d+d\d+/, `${diceCount}d${diceMatch[2]}`);
          }
        }

        healingScaledConfig.hasShieldEffect = true;
        healingScaledConfig.shieldFormula = scaledShieldFormula;
        healingScaledConfig.shieldDuration = spellWizardState.healingConfig.shieldDuration;
        healingScaledConfig.shieldDamageTypes = spellWizardState.healingConfig.shieldDamageTypes;
        healingScaledConfig.shieldOverflow = spellWizardState.healingConfig.shieldOverflow;
        healingScaledConfig.shieldBreakBehavior = spellWizardState.healingConfig.shieldBreakBehavior;
      }
    }

    // Scale specific properties based on effect type
    if (effectType === 'buff' && spellWizardState.buffConfig) {
      // Scale buff stat modifiers if they exist
      if (spellWizardState.buffConfig.statModifiers && spellWizardState.buffConfig.statModifiers.length > 0) {
        scaledConfig.statModifiers = spellWizardState.buffConfig.statModifiers.map(mod => {
          // If the magnitude is a number, scale it based on the level
          if (typeof mod.magnitude === 'number') {
            return {
              ...mod,
              magnitude: Math.max(1, Math.floor(mod.magnitude * scaleFactor))
            };
          }
          // If it's a formula, try to scale the dice part
          else if (typeof mod.magnitude === 'string' && mod.magnitude.includes('d')) {
            const diceMatch = mod.magnitude.match(/(\d+)d(\d+)/);
            if (diceMatch) {
              const diceCount = Math.max(1, Math.floor(parseInt(diceMatch[1]) * scaleFactor));
              return {
                ...mod,
                magnitude: mod.magnitude.replace(/\d+d\d+/, `${diceCount}d${diceMatch[2]}`)
              };
            }
          }
          return mod;
        });
      }
    }
    else if (effectType === 'debuff' && spellWizardState.debuffConfig) {
      // Scale debuff stat penalties if they exist
      if (spellWizardState.debuffConfig.statPenalties && spellWizardState.debuffConfig.statPenalties.length > 0) {
        scaledConfig.statPenalties = spellWizardState.debuffConfig.statPenalties.map(pen => {
          // If the magnitude is a number, scale it based on the level
          if (typeof pen.magnitude === 'number') {
            return {
              ...pen,
              magnitude: Math.max(1, Math.floor(pen.magnitude * scaleFactor))
            };
          }
          // If it's a formula, try to scale the dice part
          else if (typeof pen.magnitude === 'string' && pen.magnitude.includes('d')) {
            const diceMatch = pen.magnitude.match(/(\d+)d(\d+)/);
            if (diceMatch) {
              const diceCount = Math.max(1, Math.floor(parseInt(diceMatch[1]) * scaleFactor));
              return {
                ...pen,
                magnitude: pen.magnitude.replace(/\d+d\d+/, `${diceCount}d${diceMatch[2]}`)
              };
            }
          }
          return pen;
        });
      }
    }

    setEffects(prev => ({
      ...prev,
      [newLevel]: {
        formula: baseFormula,
        description: isChordSystem
          ? (newLevel === recipeLength
              ? `Full match (${newLevel} chord functions)`
              : `Partial match (${newLevel} of ${recipeLength} chord functions)`)
          : (newLevel === recipeLength
              ? `Full match (${newLevel} toxic types)`
              : `Partial match (${newLevel} of ${recipeLength} toxic types)`),
        effectType: effectType,
        // Add references to the original effect configurations
        effectReferences: {
          damage: spellWizardState.damageConfig ? true : false,
          healing: spellWizardState.healingConfig ? true : false,
          buff: spellWizardState.buffConfig ? true : false,
          debuff: spellWizardState.debuffConfig ? true : false,
          control: spellWizardState.controlConfig ? true : false,
          summoning: spellWizardState.summonConfig ? true : false,
          utility: spellWizardState.utilityConfig ? true : false
        },
        // Include the full effect configuration
        effectConfig: scaledConfig,
        // For buff and debuff, include specific properties
        ...(effectType === 'buff' && spellWizardState.buffConfig ? {
          statModifiers: scaledConfig.statModifiers || [],
          statusEffects: [...(spellWizardState.buffConfig.statusEffects || [])],
          duration: spellWizardState.buffConfig.duration,
          durationValue: spellWizardState.buffConfig.durationValue,
          durationType: spellWizardState.buffConfig.durationType,
          durationUnit: spellWizardState.buffConfig.durationUnit,
        } : {}),
        ...(effectType === 'debuff' && spellWizardState.debuffConfig ? {
          statPenalties: scaledConfig.statPenalties || [],
          statusEffects: [...(spellWizardState.debuffConfig.statusEffects || [])],
          duration: spellWizardState.debuffConfig.duration,
          durationValue: spellWizardState.debuffConfig.durationValue,
          durationType: spellWizardState.debuffConfig.durationType,
          durationUnit: spellWizardState.debuffConfig.durationUnit,
        } : {}),
        // For damage, include damage-specific properties based on damage type
        ...(effectType === 'damage' && spellWizardState.damageConfig ? {
          criticalConfig: spellWizardState.damageConfig.criticalConfig,
          chanceOnHitConfig: spellWizardState.damageConfig.chanceOnHitConfig,
          elementType: spellWizardState.damageConfig.elementType,
          // Handle different damage types
          ...(spellWizardState.damageConfig.damageType === 'dot' ? {
            damageType: 'dot',
            formula: spellWizardState.damageConfig.dotFormula || spellWizardState.damageConfig.formula,
            dotDuration: spellWizardState.damageConfig.dotDuration,
            dotTickType: spellWizardState.damageConfig.dotTickType,
            dotScalingType: spellWizardState.damageConfig.dotScalingType,
            dotTriggerType: spellWizardState.damageConfig.dotTriggerType
          } : {}),
          // Handle combined damage (direct + DoT)
          ...(spellWizardState.damageConfig.damageType === 'direct' && spellWizardState.damageConfig.hasDotEffect ? {
            damageType: 'direct',
            hasDotEffect: true,
            formula: spellWizardState.damageConfig.formula,
            dotFormula: spellWizardState.damageConfig.dotFormula,
            dotDuration: spellWizardState.damageConfig.dotDuration,
            dotTickType: spellWizardState.damageConfig.dotTickType,
            dotScalingType: spellWizardState.damageConfig.dotScalingType,
            dotTriggerType: spellWizardState.damageConfig.dotTriggerType
          } : {}),
          // Handle direct damage
          ...(spellWizardState.damageConfig.damageType === 'direct' && !spellWizardState.damageConfig.hasDotEffect ? {
            damageType: 'direct',
            formula: spellWizardState.damageConfig.formula
          } : {})
        } : {}),
        // For healing, include healing-specific properties based on healing type
        ...(effectType === 'healing' && spellWizardState.healingConfig ? {
          ...healingScaledConfig
        } : {}),
        // For control effects, include control-specific properties
        ...(effectType === 'control' && spellWizardState.controlConfig ? {
          effects: [...(spellWizardState.controlConfig.effects || [])],
          duration: spellWizardState.controlConfig.duration,
          durationUnit: spellWizardState.controlConfig.durationUnit,
          savingThrow: spellWizardState.controlConfig.savingThrow,
          savingThrowType: spellWizardState.controlConfig.savingThrowType,
          difficultyClass: spellWizardState.controlConfig.difficultyClass,
          concentration: spellWizardState.controlConfig.concentration
        } : {}),
        // For summoning effects, include summoning-specific properties
        ...(effectType === 'summoning' && spellWizardState.summonConfig ? {
          summonType: spellWizardState.summonConfig.summonType,
          creatures: [...(spellWizardState.summonConfig.creatures || [])],
          duration: spellWizardState.summonConfig.duration,
          durationUnit: spellWizardState.summonConfig.durationUnit,
          hasDuration: spellWizardState.summonConfig.hasDuration,
          concentration: spellWizardState.summonConfig.concentration,
          quantity: spellWizardState.summonConfig.quantity,
          maxQuantity: spellWizardState.summonConfig.maxQuantity,
          controlRange: spellWizardState.summonConfig.controlRange,
          controlType: spellWizardState.summonConfig.controlType,
          difficultyLevel: spellWizardState.summonConfig.difficultyLevel
        } : {}),
        // For utility effects, include utility-specific properties
        ...(effectType === 'utility' && spellWizardState.utilityConfig ? {
          utilityType: spellWizardState.utilityConfig.utilityType,
          selectedEffects: [...(spellWizardState.utilityConfig.selectedEffects || [])],
          duration: spellWizardState.utilityConfig.duration,
          durationUnit: spellWizardState.utilityConfig.durationUnit,
          concentration: spellWizardState.utilityConfig.concentration,
          difficultyClass: spellWizardState.utilityConfig.difficultyClass,
          abilitySave: spellWizardState.utilityConfig.abilitySave,
          difficulty: spellWizardState.utilityConfig.difficulty
        } : {})
      }
    }));

    // Update the parent component with the new effects immediately
    onGraduatedEffectsChange({ ...effects });
  };

  // Remove a graduated effect level
  const removeEffectLevel = useCallback((level) => {
    // Create a copy of the current effects to work with
    const currentEffects = { ...effects };
    delete currentEffects[level];

    // If this was the last effect, add a new level 1 effect
    if (Object.keys(currentEffects).length === 0) {
      // Update state and parent immediately
      setEffects({});
      onGraduatedEffectsChange({});

      // Add a new level 1 effect immediately
      addEffectLevelWithNumber(1);
    } else {
      // Update local state and parent immediately
      setEffects(currentEffects);
      onGraduatedEffectsChange(currentEffects);
    }
  }, [effects, onGraduatedEffectsChange, addEffectLevelWithNumber]);

  // Update a specific effect level
  const updateEffectLevel = (level, field, value) => {
    setEffects(prev => {
      const newEffects = {
        ...prev,
        [level]: {
          ...prev[level],
          [field]: value
        }
      };

      // Update the parent component immediately
      onGraduatedEffectsChange(newEffects);

      return newEffects;
    });
  };

  // Update the effect type for a specific level
  const updateEffectType = (level, newEffectType) => {
    setEffects(prev => {
      // Store the updated effects to pass to the parent component
      // Make sure the level exists
      if (!prev[level]) {
        return prev;
      }

      // Get the default formula for the new effect type
      const newFormula = getDefaultFormula(newEffectType);

      // Get the default effect configuration for the new effect type
      const defaultConfig = getDefaultEffectConfig(newEffectType);

      // Update the description if it follows the standard pattern
      let newDescription = prev[level].description || '';
      if (newDescription.includes('match')) {
        newDescription = newDescription.replace(
          /^(.*?)\(/,
          `${newEffectType.charAt(0).toUpperCase() + newEffectType.slice(1)} effect (`
        );
      }

      // Create a new effect object with the updated type
      const newEffect = {
        ...prev[level],
        effectType: newEffectType,
        formula: newFormula,
        description: newDescription,
        // Include the full effect configuration
        effectConfig: defaultConfig,
        // Update effect references to include the new effect type
        effectReferences: {
          ...(prev[level].effectReferences || {}),
          [newEffectType]: true
        }
      };

      // Add specific properties based on the new effect type
      if (newEffectType === 'buff' && spellWizardState.buffConfig) {
        newEffect.statModifiers = [...(spellWizardState.buffConfig.statModifiers || [])];
        newEffect.statusEffects = [...(spellWizardState.buffConfig.statusEffects || [])];
        newEffect.duration = spellWizardState.buffConfig.duration;
        newEffect.durationValue = spellWizardState.buffConfig.durationValue;
        newEffect.durationType = spellWizardState.buffConfig.durationType;
        newEffect.durationUnit = spellWizardState.buffConfig.durationUnit;
      } else if (newEffectType === 'debuff' && spellWizardState.debuffConfig) {
        newEffect.statPenalties = [...(spellWizardState.debuffConfig.statPenalties || [])];
        newEffect.statusEffects = [...(spellWizardState.debuffConfig.statusEffects || [])];
        newEffect.duration = spellWizardState.debuffConfig.duration;
        newEffect.durationValue = spellWizardState.debuffConfig.durationValue;
        newEffect.durationType = spellWizardState.debuffConfig.durationType;
        newEffect.durationUnit = spellWizardState.debuffConfig.durationUnit;
      } else if (newEffectType === 'damage' && spellWizardState.damageConfig) {
        // Create a complete damage configuration
        const damageConfig = {
          criticalConfig: spellWizardState.damageConfig.criticalConfig,
          chanceOnHitConfig: spellWizardState.damageConfig.chanceOnHitConfig,
          // Add DoT properties
          damageType: spellWizardState.damageConfig.damageType || 'direct',
          hasDotEffect: spellWizardState.damageConfig.hasDotEffect || false,
          // Store formulas for each damage type
          directFormula: spellWizardState.damageConfig.formula || getDefaultFormula('damage', 'direct'),
          dotFormula: spellWizardState.damageConfig.dotFormula || getDefaultFormula('damage', 'dot'),
          dotDuration: spellWizardState.damageConfig.dotDuration || 3,
          dotTickType: spellWizardState.damageConfig.dotTickType || 'round',
          dotScalingType: spellWizardState.damageConfig.dotScalingType || 'linear',
          dotTriggerType: spellWizardState.damageConfig.dotTriggerType || 'round',
          elementType: spellWizardState.damageConfig.elementType
        };

        // Set the formula based on the damage type
        if (damageConfig.damageType === 'dot') {
          damageConfig.formula = damageConfig.dotFormula;
        } else {
          damageConfig.formula = damageConfig.directFormula;
        }

        // Add all properties to the new effect
        Object.assign(newEffect, damageConfig);
      } else if (newEffectType === 'healing' && spellWizardState.healingConfig) {
        // Create a complete healing configuration based on what's actually selected
        const healingConfig = {
          healingType: spellWizardState.healingConfig.healingType || 'direct',
          formula: spellWizardState.healingConfig.formula,
          resolution: spellWizardState.healingConfig.resolution,
          criticalConfig: spellWizardState.healingConfig.criticalConfig,
          chanceOnHitConfig: spellWizardState.healingConfig.chanceOnHitConfig,
          // Store direct healing formula
          directFormula: spellWizardState.healingConfig.formula || getDefaultFormula('healing', 'direct'),
        };

        // Only add HoT properties if HoT is selected
        if (spellWizardState.healingConfig.healingType === 'hot' || spellWizardState.healingConfig.hasHotEffect) {
          healingConfig.hasHotEffect = true;
          healingConfig.hotFormula = spellWizardState.healingConfig.hotFormula || getDefaultFormula('healing', 'hot');
          healingConfig.hotDuration = spellWizardState.healingConfig.hotDuration || 3;
          healingConfig.hotTickType = spellWizardState.healingConfig.hotTickType || 'round';
          healingConfig.hotApplication = spellWizardState.healingConfig.hotApplication || 'standard';
          healingConfig.hotScalingType = spellWizardState.healingConfig.hotScalingType || 'linear';
          healingConfig.hotTriggerType = spellWizardState.healingConfig.hotTriggerType || 'round';
        } else {
          healingConfig.hasHotEffect = false;
        }

        // Only add Shield properties if Shield is selected
        if (spellWizardState.healingConfig.healingType === 'shield' || spellWizardState.healingConfig.hasShieldEffect) {
          healingConfig.hasShieldEffect = true;
          healingConfig.shieldFormula = spellWizardState.healingConfig.shieldFormula || getDefaultFormula('healing', 'shield');
          healingConfig.shieldDuration = spellWizardState.healingConfig.shieldDuration || 3;
          healingConfig.shieldDamageTypes = spellWizardState.healingConfig.shieldDamageTypes || 'all';
          healingConfig.shieldOverflow = spellWizardState.healingConfig.shieldOverflow || false;
          healingConfig.shieldBreakBehavior = spellWizardState.healingConfig.shieldBreakBehavior || 'fade';
        } else {
          healingConfig.hasShieldEffect = false;
        }

        // Set the formula based on the healing type
        if (healingConfig.healingType === 'hot') {
          healingConfig.formula = healingConfig.hotFormula;
        } else if (healingConfig.healingType === 'shield') {
          healingConfig.formula = healingConfig.shieldFormula;
        } else {
          healingConfig.formula = healingConfig.directFormula;
        }

        // Add HoT properties if they exist
        if (spellWizardState.healingConfig.hasHotEffect || spellWizardState.healingConfig.healingType === 'hot') {
          healingConfig.hasHotEffect = true;
          healingConfig.hotFormula = spellWizardState.healingConfig.hotFormula;
          healingConfig.hotDuration = spellWizardState.healingConfig.hotDuration;
          healingConfig.hotTickType = spellWizardState.healingConfig.hotTickType;
          healingConfig.hotApplication = spellWizardState.healingConfig.hotApplication;
          healingConfig.hotScalingType = spellWizardState.healingConfig.hotScalingType;
          healingConfig.hotTriggerType = spellWizardState.healingConfig.hotTriggerType;
        }

        // Add shield properties if they exist
        if (spellWizardState.healingConfig.hasShieldEffect || spellWizardState.healingConfig.healingType === 'shield') {
          healingConfig.hasShieldEffect = true;
          healingConfig.shieldFormula = spellWizardState.healingConfig.shieldFormula;
          healingConfig.shieldDuration = spellWizardState.healingConfig.shieldDuration;
          healingConfig.shieldDamageTypes = spellWizardState.healingConfig.shieldDamageTypes;
          healingConfig.shieldOverflow = spellWizardState.healingConfig.shieldOverflow;
          healingConfig.shieldBreakBehavior = spellWizardState.healingConfig.shieldBreakBehavior;
        }

        // Add all healing properties to the new effect
        Object.assign(newEffect, healingConfig);
      } else if (newEffectType === 'control' && spellWizardState.controlConfig) {
        newEffect.effects = [...(spellWizardState.controlConfig.effects || [])];
        newEffect.duration = spellWizardState.controlConfig.duration;
        newEffect.durationUnit = spellWizardState.controlConfig.durationUnit;
        newEffect.savingThrow = spellWizardState.controlConfig.savingThrow;
        newEffect.savingThrowType = spellWizardState.controlConfig.savingThrowType;
        newEffect.difficultyClass = spellWizardState.controlConfig.difficultyClass;
        newEffect.concentration = spellWizardState.controlConfig.concentration;
      } else if (newEffectType === 'summoning' && spellWizardState.summonConfig) {
        newEffect.summonType = spellWizardState.summonConfig.summonType;
        newEffect.creatures = [...(spellWizardState.summonConfig.creatures || [])];
        newEffect.duration = spellWizardState.summonConfig.duration;
        newEffect.durationUnit = spellWizardState.summonConfig.durationUnit;
        newEffect.hasDuration = spellWizardState.summonConfig.hasDuration;
        newEffect.concentration = spellWizardState.summonConfig.concentration;
        newEffect.quantity = spellWizardState.summonConfig.quantity;
        newEffect.maxQuantity = spellWizardState.summonConfig.maxQuantity;
        newEffect.controlRange = spellWizardState.summonConfig.controlRange;
        newEffect.controlType = spellWizardState.summonConfig.controlType;
        newEffect.difficultyLevel = spellWizardState.summonConfig.difficultyLevel;
      }

      const updatedEffects = {
        ...prev,
        [level]: newEffect
      };

      // Update the parent component immediately
      onGraduatedEffectsChange(updatedEffects);

      return updatedEffects;
    });
  };

  // Toggle an effect reference
  const toggleEffectReference = (level, effectType) => {
    setEffects(prev => ({
      ...prev,
      [level]: {
        ...prev[level],
        effectReferences: {
          ...prev[level].effectReferences,
          [effectType]: !prev[level].effectReferences[effectType]
        }
      }
    }));
  };

  // Update a stat modifier for a specific level
  const updateStatModifier = (level, statId, magnitude, magnitudeType) => {
    setEffects(prev => {
      // Make a deep copy of the stat modifiers
      const updatedModifiers = prev[level].statModifiers.map(mod => {
        if (mod.id === statId) {
          return {
            ...mod,
            magnitude,
            magnitudeType: magnitudeType || mod.magnitudeType
          };
        }
        return mod;
      });

      return {
        ...prev,
        [level]: {
          ...prev[level],
          statModifiers: updatedModifiers
        }
      };
    });
  };

  // Update a stat penalty for a specific level
  const updateStatPenalty = (level, statId, magnitude, magnitudeType) => {
    setEffects(prev => {
      // Make a deep copy of the stat penalties
      const updatedPenalties = prev[level].statPenalties.map(pen => {
        if (pen.id === statId) {
          return {
            ...pen,
            magnitude,
            magnitudeType: magnitudeType || pen.magnitudeType
          };
        }
        return pen;
      });

      return {
        ...prev,
        [level]: {
          ...prev[level],
          statPenalties: updatedPenalties
        }
      };
    });
  };

  // Update summoning quantity for a specific level
  const updateSummoningQuantity = (level, quantity) => {
    setEffects(prev => ({
      ...prev,
      [level]: {
        ...prev[level],
        quantity
      }
    }));
  };

  // Update summoning duration for a specific level
  const updateSummoningDuration = (level, duration) => {
    setEffects(prev => ({
      ...prev,
      [level]: {
        ...prev[level],
        duration
      }
    }));
  };

  // Update summoning duration unit for a specific level
  const updateSummoningDurationUnit = (level, durationUnit) => {
    setEffects(prev => ({
      ...prev,
      [level]: {
        ...prev[level],
        durationUnit
      }
    }));
  };

  // Toggle summoning duration for a specific level
  const toggleSummoningDuration = (level) => {
    setEffects(prev => ({
      ...prev,
      [level]: {
        ...prev[level],
        hasDuration: !prev[level].hasDuration
      }
    }));
  };

  // Toggle summoning concentration for a specific level
  const toggleSummoningConcentration = (level) => {
    setEffects(prev => ({
      ...prev,
      [level]: {
        ...prev[level],
        concentration: !prev[level].concentration
      }
    }));
  };

  // Update summoning control type for a specific level
  const updateSummoningControlType = (level, controlType) => {
    setEffects(prev => ({
      ...prev,
      [level]: {
        ...prev[level],
        controlType
      }
    }));
  };

  // Update summoning control range for a specific level
  const updateSummoningControlRange = (level, controlRange) => {
    setEffects(prev => ({
      ...prev,
      [level]: {
        ...prev[level],
        controlRange
      }
    }));
  };

  // Update control effect configuration
  const updateControlEffect = (level, effectId, configKey, configValue) => {
    setEffects(prev => {
      // Find the effect to update
      const updatedEffects = prev[level].effects.map(effect => {
        if (effect.id === effectId) {
          // Update the specific config property
          return {
            ...effect,
            config: {
              ...effect.config,
              [configKey]: configValue
            }
          };
        }
        return effect;
      });

      return {
        ...prev,
        [level]: {
          ...prev[level],
          effects: updatedEffects
        }
      };
    });
  };

  // Toggle a boolean control effect configuration value
  const toggleControlEffectConfig = (level, effectId, configKey) => {
    setEffects(prev => {
      // Find the effect to update
      const effect = prev[level].effects.find(e => e.id === effectId);
      if (!effect) return prev;

      const currentValue = effect.config?.[configKey];

      // Update the effects array
      const updatedEffects = prev[level].effects.map(e => {
        if (e.id === effectId) {
          return {
            ...e,
            config: {
              ...e.config,
              [configKey]: !currentValue
            }
          };
        }
        return e;
      });

      return {
        ...prev,
        [level]: {
          ...prev[level],
          effects: updatedEffects
        }
      };
    });
  };

  // Get sorted effect levels
  const sortedLevels = Object.keys(effects).map(Number).sort((a, b) => a - b);

  // Get available effect types
  const availableEffectTypes = getAvailableEffectTypes();

  return (
    <div className="graduated-effects-container">
      <div className="graduated-effects-header">
        <h4>Graduated Recipe Effects</h4>
        <div className="graduated-effects-description">
          <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
          <span>Configure different effects based on how many toxic types are consumed.</span>
        </div>
      </div>

      {sortedLevels.length === 0 ? (
        <div className="graduated-effects-empty">
          <p>No graduated effects configured. Add an effect level to get started.</p>
        </div>
      ) : (
        <div className="graduated-effects-list">
          {sortedLevels.map(level => (
            <div key={level} className="graduated-effect-item">
              <div className="graduated-effect-header">
                <span className="graduated-effect-level">
                  Level {level} - {isChordSystem ? 'Chord' : 'Toxic'} Requirements
                </span>
                <button
                  className="graduated-effect-remove"
                  onClick={() => removeEffectLevel(level)}
                  title="Remove this effect level"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>

              <div className="graduated-effect-inputs">
                {/* Effect Type Selection - Hidden for healing effects */}
                {(effects[level]?.effectType || '') !== 'healing' && (
                  <div className="graduated-effect-type">
                    <label>Effect Type:</label>
                    <div className="effect-type-selector">
                      {availableEffectTypes.map(effect => (
                        <button
                          key={effect.id}
                          className={`effect-type-button ${(effects[level]?.effectType || '') === effect.id ? 'active' : ''}`}
                          onClick={() => updateEffectType(level, effect.id)}
                          title={effect.name}
                        >
                          {effect.icon && typeof effect.icon === 'function' && <effect.icon />}
                          <span>{effect.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Damage Type Display */}
                {(effects[level]?.effectType || '') === 'damage' && spellWizardState.damageConfig && (
                  <div className="graduated-effect-damage-type">
                    <label>Damage Type:</label>
                    <div className="damage-type-selector">
                      {/* Always show Direct damage as it's the base type */}
                      <button
                        className={`damage-type-button ${(effects[level]?.damageType || 'direct') === 'direct' && !(effects[level]?.hasDotEffect) ? 'active' : ''}`}
                        onClick={() => {
                          // Store current formulas before changing type
                          const currentDotFormula = effects[level]?.dotFormula || getDefaultFormula('damage', 'dot');
                          const currentDirectFormula = effects[level]?.directFormula || getDefaultFormula('damage', 'direct');

                          // Update damage type
                          updateEffectLevel(level, 'damageType', 'direct');
                          updateEffectLevel(level, 'hasDotEffect', false);

                          // Store the current formula as the appropriate type formula
                          if (effects[level]?.damageType === 'dot') {
                            updateEffectLevel(level, 'dotFormula', effects[level]?.formula || currentDotFormula);
                          }

                          // Update the main formula to the direct formula
                          updateEffectLevel(level, 'formula', currentDirectFormula);
                          updateEffectLevel(level, 'directFormula', currentDirectFormula);
                        }}
                      >
                        <FaFire />
                        <span>Direct</span>
                      </button>

                      {/* Only show DoT if it was configured in the spell */}
                      {(spellWizardState.damageConfig.damageType === 'dot' || spellWizardState.damageConfig.hasDotEffect) && (
                        <button
                          className={`damage-type-button ${(effects[level]?.damageType || 'direct') === 'dot' ? 'active' : ''}`}
                          onClick={() => {
                            // Store current formulas before changing type
                            const currentDotFormula = effects[level]?.dotFormula || getDefaultFormula('damage', 'dot');
                            const currentDirectFormula = effects[level]?.directFormula || getDefaultFormula('damage', 'direct');

                            // Store the current formula as the appropriate type formula
                            if (effects[level]?.damageType === 'direct') {
                              updateEffectLevel(level, 'directFormula', effects[level]?.formula || currentDirectFormula);
                            }

                            // Update damage type
                            updateEffectLevel(level, 'damageType', 'dot');
                            updateEffectLevel(level, 'hasDotEffect', false);

                            // Update the main formula to the DoT formula
                            updateEffectLevel(level, 'formula', currentDotFormula);
                            updateEffectLevel(level, 'dotFormula', currentDotFormula);
                          }}
                        >
                          <FaSkull />
                          <span>DoT</span>
                        </button>
                      )}

                      {/* Only show Combined if DoT effect was configured in the spell */}
                      {spellWizardState.damageConfig.hasDotEffect && (
                        <button
                          className={`damage-type-button ${(effects[level]?.damageType || 'direct') === 'direct' && (effects[level]?.hasDotEffect) ? 'active' : ''}`}
                          onClick={() => {
                            // Store current formulas before changing type
                            const currentDotFormula = effects[level]?.dotFormula || getDefaultFormula('damage', 'dot');
                            const currentDirectFormula = effects[level]?.directFormula || getDefaultFormula('damage', 'direct');

                            // Store the current formula as the appropriate type formula
                            if (effects[level]?.damageType === 'dot') {
                              updateEffectLevel(level, 'dotFormula', effects[level]?.formula || currentDotFormula);
                            } else if (effects[level]?.damageType === 'direct' && !effects[level]?.hasDotEffect) {
                              updateEffectLevel(level, 'directFormula', effects[level]?.formula || currentDirectFormula);
                            }

                            // Update damage type
                            updateEffectLevel(level, 'damageType', 'direct');
                            updateEffectLevel(level, 'hasDotEffect', true);

                            // Update the main formula to the direct formula
                            updateEffectLevel(level, 'formula', currentDirectFormula);
                            updateEffectLevel(level, 'directFormula', currentDirectFormula);
                          }}
                        >
                          <FaFire />
                          <span>Combined</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Direct Damage Formula Input */}
                {(effects[level]?.effectType || '') === 'damage' &&
                 ((effects[level]?.damageType || 'direct') === 'direct' || (effects[level]?.damageType || 'direct') === 'combined') && (
                  <div className="graduated-effect-formula">
                    <label>Direct Damage Formula:</label>
                    <input
                      type="text"
                      value={effects[level]?.directFormula || effects[level]?.formula || ''}
                      onChange={(e) => {
                        // Update both the direct formula and the main formula
                        updateEffectLevel(level, 'directFormula', e.target.value);

                        // If current damage type is direct, also update the main formula
                        if ((effects[level]?.damageType || 'direct') === 'direct') {
                          updateEffectLevel(level, 'formula', e.target.value);
                        }
                      }}
                      placeholder="Enter formula (e.g., 2d6 + INT)"
                    />

                  </div>
                )}

                {/* Direct Healing Formula Input */}
                {(effects[level]?.effectType || '') === 'healing' &&
                 ((effects[level]?.healingType || 'direct') === 'direct') && (
                  <div className="graduated-effect-formula">
                    <label>Direct Healing Formula:</label>
                    <input
                      type="text"
                      value={effects[level]?.directFormula || effects[level]?.formula || ''}
                      onChange={(e) => {
                        // Update both the direct formula and the main formula
                        updateEffectLevel(level, 'directFormula', e.target.value);

                        // If current healing type is direct, also update the main formula
                        if ((effects[level]?.healingType || 'direct') === 'direct') {
                          updateEffectLevel(level, 'formula', e.target.value);
                        }
                      }}
                      placeholder="Enter formula (e.g., 2d8 + HEA)"
                    />

                  </div>
                )}

                {/* Healing Type Display */}
                {(effects[level]?.effectType || '') === 'healing' && (
                  <div className="graduated-effect-healing-type">
                    <label>Healing Type:</label>
                    <div className="healing-type-selector">
                      {/* Only show healing types that were selected in the healing configuration */}
                      {/* Always show Direct healing as it's the default */}
                      <button
                        className={`healing-type-button ${(effects[level]?.healingType || 'direct') === 'direct' ? 'active' : ''}`}
                        onClick={() => {
                          // Store current formulas before changing type
                          const currentHotFormula = effects[level]?.hotFormula || getDefaultFormula('healing', 'hot');
                          const currentShieldFormula = effects[level]?.shieldFormula || getDefaultFormula('healing', 'shield');
                          const currentDirectFormula = effects[level]?.directFormula || getDefaultFormula('healing', 'direct');

                          // Update healing type
                          updateEffectLevel(level, 'healingType', 'direct');

                          // Store the current formula as the appropriate type formula
                          if (effects[level]?.healingType === 'hot') {
                            updateEffectLevel(level, 'hotFormula', effects[level]?.formula || currentHotFormula);
                          } else if (effects[level]?.healingType === 'shield') {
                            updateEffectLevel(level, 'shieldFormula', effects[level]?.formula || currentShieldFormula);
                          }

                          // Update the main formula to the direct formula
                          updateEffectLevel(level, 'formula', currentDirectFormula);
                          updateEffectLevel(level, 'directFormula', currentDirectFormula);
                        }}
                      >
                        <FaHeart />
                        <span>Direct</span>
                      </button>

                      {/* Only show HoT if it was selected in the healing configuration */}
                      {(spellWizardState.healingConfig?.healingType === 'hot' || spellWizardState.healingConfig?.hasHotEffect) && (
                        <button
                          className={`healing-type-button ${(effects[level]?.healingType || 'direct') === 'hot' ? 'active' : ''}`}
                          onClick={() => {
                            // Store current formulas before changing type
                            const currentHotFormula = effects[level]?.hotFormula || getDefaultFormula('healing', 'hot');
                            const currentShieldFormula = effects[level]?.shieldFormula || getDefaultFormula('healing', 'shield');
                            const currentDirectFormula = effects[level]?.directFormula || getDefaultFormula('healing', 'direct');

                            // Store the current formula as the appropriate type formula
                            if (effects[level]?.healingType === 'direct') {
                              updateEffectLevel(level, 'directFormula', effects[level]?.formula || currentDirectFormula);
                            } else if (effects[level]?.healingType === 'shield') {
                              updateEffectLevel(level, 'shieldFormula', effects[level]?.formula || currentShieldFormula);
                            }

                            // Update healing type
                            updateEffectLevel(level, 'healingType', 'hot');

                            // Update the main formula to the HoT formula
                            updateEffectLevel(level, 'formula', currentHotFormula);
                            updateEffectLevel(level, 'hotFormula', currentHotFormula);
                          }}
                        >
                          <FaHeart />
                          <span>HoT</span>
                        </button>
                      )}

                      {/* Only show Shield if it was selected in the healing configuration */}
                      {(spellWizardState.healingConfig?.healingType === 'shield' || spellWizardState.healingConfig?.hasShieldEffect) && (
                        <button
                          className={`healing-type-button ${(effects[level]?.healingType || 'direct') === 'shield' ? 'active' : ''}`}
                          onClick={() => {
                            // Store current formulas before changing type
                            const currentHotFormula = effects[level]?.hotFormula || getDefaultFormula('healing', 'hot');
                            const currentShieldFormula = effects[level]?.shieldFormula || getDefaultFormula('healing', 'shield');
                            const currentDirectFormula = effects[level]?.directFormula || getDefaultFormula('healing', 'direct');

                            // Store the current formula as the appropriate type formula
                            if (effects[level]?.healingType === 'direct') {
                              updateEffectLevel(level, 'directFormula', effects[level]?.formula || currentDirectFormula);
                            } else if (effects[level]?.healingType === 'hot') {
                              updateEffectLevel(level, 'hotFormula', effects[level]?.formula || currentHotFormula);
                            }

                            // Update healing type
                            updateEffectLevel(level, 'healingType', 'shield');

                            // Update the main formula to the shield formula
                            updateEffectLevel(level, 'formula', currentShieldFormula);
                            updateEffectLevel(level, 'shieldFormula', currentShieldFormula);
                          }}
                        >
                          <FaHeart />
                          <span>Shield</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}

                {/* Damage Over Time (DoT) section */}
                {(effects[level]?.effectType || '') === 'damage' &&
                 ((effects[level]?.damageType === 'dot') || (effects[level]?.hasDotEffect)) && (
                  <div className="graduated-effect-dot">
                    <div className="dot-header">
                      <label>Damage Over Time:</label>
                    </div>
                    <div className="dot-formula">
                      <label>DoT Formula:</label>
                      <input
                        type="text"
                        value={effects[level]?.dotFormula || ''}
                        onChange={(e) => {
                          // Update the DoT formula
                          updateEffectLevel(level, 'dotFormula', e.target.value);

                          // If current damage type is DoT, also update the main formula
                          if ((effects[level]?.damageType || 'direct') === 'dot') {
                            updateEffectLevel(level, 'formula', e.target.value);
                          }
                        }}
                        placeholder="Enter DoT formula (e.g., 1d4 + INT/2)"
                      />
                    </div>
                    <div className="dot-duration">
                      <label>Duration:</label>
                      <div className="dot-duration-controls">
                        <button
                          className="dot-duration-button"
                          onClick={() => updateEffectLevel(level, 'dotDuration', Math.max(1, (effects[level]?.dotDuration || 3) - 1))}
                        >-</button>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={effects[level]?.dotDuration || 3}
                          onChange={(e) => updateEffectLevel(level, 'dotDuration', Math.max(1, parseInt(e.target.value) || 1))}
                        />
                        <button
                          className="dot-duration-button"
                          onClick={() => updateEffectLevel(level, 'dotDuration', Math.min(10, (effects[level]?.dotDuration || 3) + 1))}
                        >+</button>
                      </div>
                      <select
                        value={effects[level]?.dotTickType || 'round'}
                        onChange={(e) => updateEffectLevel(level, 'dotTickType', e.target.value)}
                      >
                        <option value="round">Rounds</option>
                        <option value="minute">Minutes</option>
                        <option value="turn">Turns</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Healing Over Time (HoT) section */}
                {(effects[level]?.effectType || '') === 'healing' &&
                 ((effects[level]?.healingType === 'hot') || (effects[level]?.hasHotEffect)) && (
                  <div className="graduated-effect-hot">
                    <div className="hot-header">
                      <label>Healing Over Time:</label>
                    </div>
                    <div className="hot-formula">
                      <label>HoT Formula:</label>
                      <input
                        type="text"
                        value={effects[level]?.hotFormula || ''}
                        onChange={(e) => {
                          // Update the HoT formula
                          updateEffectLevel(level, 'hotFormula', e.target.value);

                          // If current healing type is HoT, also update the main formula
                          if ((effects[level]?.healingType || 'direct') === 'hot') {
                            updateEffectLevel(level, 'formula', e.target.value);
                          }
                        }}
                        placeholder="Enter HoT formula (e.g., 1d4 + HEA/2)"
                      />
                    </div>
                    <div className="hot-duration">
                      <label>Duration:</label>
                      <div className="hot-duration-controls">
                        <button
                          className="hot-duration-button"
                          onClick={() => updateEffectLevel(level, 'hotDuration', Math.max(1, (effects[level]?.hotDuration || 3) - 1))}
                        >-</button>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={effects[level]?.hotDuration || 3}
                          onChange={(e) => updateEffectLevel(level, 'hotDuration', Math.max(1, parseInt(e.target.value) || 1))}
                        />
                        <button
                          className="hot-duration-button"
                          onClick={() => updateEffectLevel(level, 'hotDuration', Math.min(10, (effects[level]?.hotDuration || 3) + 1))}
                        >+</button>
                      </div>
                      <select
                        value={effects[level]?.hotTickType || 'round'}
                        onChange={(e) => updateEffectLevel(level, 'hotTickType', e.target.value)}
                      >
                        <option value="round">Rounds</option>
                        <option value="minute">Minutes</option>
                        <option value="turn">Turns</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Shield section */}
                {(effects[level]?.effectType || '') === 'healing' &&
                 ((effects[level]?.healingType === 'shield') || (effects[level]?.hasShieldEffect)) && (
                  <div className="graduated-effect-shield">
                    <div className="shield-header">
                      <label>Absorption Shield:</label>
                    </div>
                    <div className="shield-formula">
                      <label>Shield Formula:</label>
                      <input
                        type="text"
                        value={effects[level]?.shieldFormula || ''}
                        onChange={(e) => {
                          // Update the shield formula
                          updateEffectLevel(level, 'shieldFormula', e.target.value);

                          // If current healing type is shield, also update the main formula
                          if ((effects[level]?.healingType || 'direct') === 'shield') {
                            updateEffectLevel(level, 'formula', e.target.value);
                          }
                        }}
                        placeholder="Enter shield formula (e.g., 2d6 + HEA)"
                      />
                    </div>
                    <div className="shield-duration">
                      <label>Duration:</label>
                      <div className="shield-duration-controls">
                        <button
                          className="shield-duration-button"
                          onClick={() => updateEffectLevel(level, 'shieldDuration', Math.max(1, (effects[level]?.shieldDuration || 3) - 1))}
                        >-</button>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={effects[level]?.shieldDuration || 3}
                          onChange={(e) => updateEffectLevel(level, 'shieldDuration', Math.max(1, parseInt(e.target.value) || 1))}
                        />
                        <button
                          className="shield-duration-button"
                          onClick={() => updateEffectLevel(level, 'shieldDuration', Math.min(10, (effects[level]?.shieldDuration || 3) + 1))}
                        >+</button>
                      </div>
                      <select
                        value={effects[level]?.shieldDamageTypes || 'all'}
                        onChange={(e) => updateEffectLevel(level, 'shieldDamageTypes', e.target.value)}
                      >
                        <option value="all">All Damage</option>
                        <option value="physical">Physical Only</option>
                        <option value="magical">Magical Only</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* Stat Modifiers - Only show for buff */}
                {(effects[level]?.effectType || '') === 'buff' && effects[level]?.statModifiers && effects[level]?.statModifiers.length > 0 && (
                  <div className="graduated-effect-stats">
                    <label>Stat Modifiers:</label>
                    <div className="stat-modifiers-list">
                      {effects[level].statModifiers.map((stat, index) => (
                        <div key={stat.id} className="stat-modifier-item">
                          <span className="stat-name">{stat.name}:</span>
                          <div className="stat-value-controls">
                            <input
                              type="text"
                              className={`stat-value-input ${typeof stat.magnitude === 'string' ? 'formula' : (stat.magnitude < 0 ? 'negative' : 'positive')}`}
                              defaultValue={typeof stat.magnitude === 'string' ? stat.magnitude : (stat.magnitudeType === 'percentage' ?
                                `${stat.magnitude >= 0 ? '+' : ''}${stat.magnitude}%` :
                                `${stat.magnitude >= 0 ? '+' : ''}${stat.magnitude}`)}
                              onBlur={(e) => {
                                let value = e.target.value;

                                // Handle empty field
                                if (value === '') {
                                  updateStatModifier(level, stat.id, 0, stat.magnitudeType);
                                  return;
                                }

                                // Remove the % sign and + sign for processing
                                if (stat.magnitudeType === 'percentage') {
                                  value = value.replace(/%/g, '');
                                }
                                value = value.replace(/^\+/, '');

                                // Check if it's a valid number
                                const isNumber = !isNaN(parseFloat(value)) && isFinite(value);

                                // Check if it's a dice formula
                                // Handle 'd6' format (without a number prefix)
                                const diceRegex = /^-?d\d+|^-?\d+d\d+|^-?\d+d\d+k\d+|^-?\d+d\d+k\d+l/;
                                const isDiceFormula = diceRegex.test(value);

                                if (isNumber) {
                                  updateStatModifier(level, stat.id, parseFloat(value), stat.magnitudeType);
                                } else if (isDiceFormula) {
                                  // If it starts with 'd', add '1' prefix
                                  if (value.startsWith('d')) {
                                    value = '1' + value;
                                  } else if (value.startsWith('-d')) {
                                    value = '-1' + value.substring(1);
                                  }
                                  updateStatModifier(level, stat.id, value, stat.magnitudeType);
                                }
                              }}
                              onKeyDown={(e) => {
                                // Handle Enter key
                                if (e.key === 'Enter') {
                                  e.target.blur(); // Trigger the onBlur event
                                }
                              }}
                              placeholder="Enter value or formula"
                              title="Examples: 5, 2d6, d20, -d4, 1d8+2"
                            />
                          </div>
                          <div className="stat-type-toggle">
                            <button
                              className={stat.magnitudeType === 'flat' ? 'active' : ''}
                              onClick={() => updateStatModifier(level, stat.id, stat.magnitude, 'flat')}
                            >
                              Flat
                            </button>
                            <button
                              className={stat.magnitudeType === 'percentage' ? 'active' : ''}
                              onClick={() => updateStatModifier(level, stat.id, stat.magnitude, 'percentage')}
                            >
                              %
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stat Penalties - Only show for debuff */}
                {(effects[level]?.effectType || '') === 'debuff' && effects[level]?.statPenalties && effects[level]?.statPenalties.length > 0 && (
                  <div className="graduated-effect-stats">
                    <label>Stat Penalties:</label>
                    <div className="stat-modifiers-list">
                      {effects[level].statPenalties.map((stat, index) => (
                        <div key={stat.id} className="stat-modifier-item">
                          <span className="stat-name">{stat.name}:</span>
                          <div className="stat-value-controls">
                            <input
                              type="text"
                              className={`stat-value-input ${typeof stat.magnitude === 'string' ? 'formula' : (stat.magnitude < 0 ? 'negative' : 'positive')}`}
                              defaultValue={typeof stat.magnitude === 'string' ? stat.magnitude : (stat.magnitudeType === 'percentage' ?
                                `${stat.magnitude >= 0 ? '+' : ''}${stat.magnitude}%` :
                                `${stat.magnitude >= 0 ? '+' : ''}${stat.magnitude}`)}
                              onBlur={(e) => {
                                let value = e.target.value;

                                // Handle empty field
                                if (value === '') {
                                  updateStatPenalty(level, stat.id, 0, stat.magnitudeType);
                                  return;
                                }

                                // Remove the % sign and + sign for processing
                                if (stat.magnitudeType === 'percentage') {
                                  value = value.replace(/%/g, '');
                                }
                                value = value.replace(/^\+/, '');

                                // Check if it's a valid number
                                const isNumber = !isNaN(parseFloat(value)) && isFinite(value);

                                // Check if it's a dice formula
                                // Handle 'd6' format (without a number prefix)
                                const diceRegex = /^-?d\d+|^-?\d+d\d+|^-?\d+d\d+k\d+|^-?\d+d\d+k\d+l/;
                                const isDiceFormula = diceRegex.test(value);

                                if (isNumber) {
                                  updateStatPenalty(level, stat.id, parseFloat(value), stat.magnitudeType);
                                } else if (isDiceFormula) {
                                  // If it starts with 'd', add '1' prefix
                                  if (value.startsWith('d')) {
                                    value = '1' + value;
                                  } else if (value.startsWith('-d')) {
                                    value = '-1' + value.substring(1);
                                  }
                                  updateStatPenalty(level, stat.id, value, stat.magnitudeType);
                                }
                              }}
                              onKeyDown={(e) => {
                                // Handle Enter key
                                if (e.key === 'Enter') {
                                  e.target.blur(); // Trigger the onBlur event
                                }
                              }}
                              placeholder="Enter value or formula"
                              title="Examples: -5, 2d6, d20, -d4, -1d8+2"
                            />
                          </div>
                          <div className="stat-type-toggle">
                            <button
                              className={stat.magnitudeType === 'flat' ? 'active' : ''}
                              onClick={() => updateStatPenalty(level, stat.id, stat.magnitude, 'flat')}
                            >
                              Flat
                            </button>
                            <button
                              className={stat.magnitudeType === 'percentage' ? 'active' : ''}
                              onClick={() => updateStatPenalty(level, stat.id, stat.magnitude, 'percentage')}
                            >
                              %
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Control Effects - Only show for control */}
                {(effects[level]?.effectType || '') === 'control' && effects[level]?.effects && effects[level]?.effects.length > 0 && (
                  <div className="graduated-effect-controls">
                    <label>Control Effects:</label>
                    <div className="control-effects-list">
                      {effects[level].effects.map((effect, index) => (
                        <div key={effect.id} className="control-effect-item">
                          <div className="control-effect-header">
                            <img src={getIconUrl(effect.icon)} alt={effect.name} className="control-effect-icon" />
                            <span className="control-effect-name">{effect.name}</span>
                          </div>
                          <div className="control-effect-details">
                            <div className="control-effect-type">{effect.controlType}</div>

                            {/* Duration Configuration */}
                            <div className="control-effect-config-section">
                              <div className="control-effect-toggle">
                                <span className="control-effect-toggle-label">Instant Effect</span>
                                <button
                                  className={`control-effect-toggle-button ${effect.config?.instant ? 'active' : ''}`}
                                  onClick={() => toggleControlEffectConfig(level, effect.id, 'instant')}
                                >
                                  <span className="control-effect-toggle-slider"></span>
                                </button>
                              </div>

                              {!effect.config?.instant && (
                                <div className="control-effect-duration-config">
                                  <div className="control-effect-duration-input">
                                    <span>Duration:</span>
                                    <div className="control-effect-numeric-controls">
                                      <button
                                        className="control-effect-numeric-button"
                                        onClick={() => updateControlEffect(level, effect.id, 'duration', Math.max(1, (effect.config?.duration || 2) - 1))}
                                      >-</button>
                                      <input
                                        type="number"
                                        min="1"
                                        max="10"
                                        value={effect.config?.duration || 2}
                                        onChange={(e) => updateControlEffect(level, effect.id, 'duration', Math.max(1, parseInt(e.target.value) || 1))}
                                      />
                                      <button
                                        className="control-effect-numeric-button"
                                        onClick={() => updateControlEffect(level, effect.id, 'duration', Math.min(10, (effect.config?.duration || 2) + 1))}
                                      >+</button>
                                    </div>
                                    <select
                                      value={effect.config?.durationUnit || 'rounds'}
                                      onChange={(e) => updateControlEffect(level, effect.id, 'durationUnit', e.target.value)}
                                    >
                                      <option value="rounds">Rounds</option>
                                      <option value="minutes">Minutes</option>
                                      <option value="hours">Hours</option>
                                    </select>
                                  </div>
                                </div>
                              )}
                            </div>

                            {/* Saving Throw Configuration */}
                            <div className="control-effect-config-section">
                              <div className="control-effect-toggle">
                                <span className="control-effect-toggle-label">Saving Throw</span>
                                <button
                                  className={`control-effect-toggle-button ${effect.config?.savingThrow ? 'active' : ''}`}
                                  onClick={() => toggleControlEffectConfig(level, effect.id, 'savingThrow')}
                                >
                                  <span className="control-effect-toggle-slider"></span>
                                </button>
                              </div>

                              {effect.config?.savingThrow && (
                                <div className="control-effect-save-config">
                                  <div className="control-effect-save-type">
                                    <span>Save Type:</span>
                                    <select
                                      value={effect.config?.savingThrowType || 'strength'}
                                      onChange={(e) => updateControlEffect(level, effect.id, 'savingThrowType', e.target.value)}
                                    >
                                      <option value="strength">Strength</option>
                                      <option value="agility">Agility</option>
                                      <option value="constitution">Constitution</option>
                                      <option value="intelligence">Intelligence</option>
                                      <option value="spirit">Spirit</option>
                                      <option value="charisma">Charisma</option>
                                    </select>
                                  </div>

                                  <div className="control-effect-dc">
                                    <span>DC:</span>
                                    <div className="control-effect-numeric-controls">
                                      <button
                                        className="control-effect-numeric-button"
                                        onClick={() => updateControlEffect(level, effect.id, 'difficultyClass', Math.max(5, (effect.config?.difficultyClass || 15) - 1))}
                                      >-</button>
                                      <input
                                        type="number"
                                        min="5"
                                        max="30"
                                        value={effect.config?.difficultyClass || 15}
                                        onChange={(e) => updateControlEffect(level, effect.id, 'difficultyClass', Math.max(5, parseInt(e.target.value) || 5))}
                                      />
                                      <button
                                        className="control-effect-numeric-button"
                                        onClick={() => updateControlEffect(level, effect.id, 'difficultyClass', Math.min(30, (effect.config?.difficultyClass || 15) + 1))}
                                      >+</button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summoning Effects - Only show for summoning */}
                {(effects[level]?.effectType || '') === 'summoning' && effects[level]?.creatures && effects[level]?.creatures.length > 0 && (
                  <div className="graduated-effect-summons">
                    <label>Summoned Creatures:</label>
                    <div className="summoned-creatures-list">
                      {effects[level].creatures.map((creature, index) => (
                        <div key={creature.id} className="summoned-creature-item">
                          <div className="summoned-creature-header">
                            <img src={getIconUrl(creature.icon)} alt={creature.name} className="summoned-creature-icon" />
                            <span className="summoned-creature-name">{creature.name}</span>
                          </div>
                          <div className="summoned-creature-details">
                            <div className="summoned-creature-type">{creature.summonType}</div>
                            <div className="summoned-creature-cr">CR {creature.cr}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quantity Configuration */}
                    <div className="summoning-config-section">
                      <h4>Quantity</h4>
                      <div className="summoning-config-item">
                        <div className="summoning-config-controls">
                          <button
                            className="summoning-config-button"
                            onClick={() => updateSummoningQuantity(level, Math.max(1, (effects[level].quantity || 1) - 1))}
                          >-</button>
                          <span className="summoning-config-value">{effects[level].quantity || 1}</span>
                          <button
                            className="summoning-config-button"
                            onClick={() => updateSummoningQuantity(level, Math.min(effects[level].maxQuantity || 4, (effects[level].quantity || 1) + 1))}
                          >+</button>
                        </div>
                      </div>
                    </div>

                    {/* Duration Configuration */}
                    <div className="summoning-config-section">
                      <h4>Duration</h4>
                      <div className="summoning-config-toggle">
                        <span className="summoning-config-toggle-label">Has Duration</span>
                        <button
                          className={`summoning-config-toggle-button ${effects[level].hasDuration ? 'active' : ''}`}
                          onClick={() => toggleSummoningDuration(level)}
                        >
                          <span className="summoning-config-toggle-slider"></span>
                        </button>
                      </div>

                      {effects[level].hasDuration && (
                        <div className="summoning-duration-config">
                          <div className="summoning-duration-input">
                            <span>Duration:</span>
                            <div className="summoning-numeric-controls">
                              <button
                                className="summoning-numeric-button"
                                onClick={() => updateSummoningDuration(level, Math.max(1, (effects[level].duration || 10) - 1))}
                              >-</button>
                              <input
                                type="number"
                                min="1"
                                max="60"
                                value={effects[level].duration || 10}
                                onChange={(e) => updateSummoningDuration(level, Math.max(1, parseInt(e.target.value) || 1))}
                              />
                              <button
                                className="summoning-numeric-button"
                                onClick={() => updateSummoningDuration(level, Math.min(60, (effects[level].duration || 10) + 1))}
                              >+</button>
                            </div>
                            <select
                              value={effects[level].durationUnit || 'minutes'}
                              onChange={(e) => updateSummoningDurationUnit(level, e.target.value)}
                            >
                              <option value="rounds">Rounds</option>
                              <option value="minutes">Minutes</option>
                              <option value="hours">Hours</option>
                            </select>
                          </div>

                          <div className="summoning-config-toggle">
                            <span className="summoning-config-toggle-label">Requires Concentration</span>
                            <button
                              className={`summoning-config-toggle-button ${effects[level].concentration ? 'active' : ''}`}
                              onClick={() => toggleSummoningConcentration(level)}
                            >
                              <span className="summoning-config-toggle-slider"></span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Control Configuration */}
                    <div className="summoning-config-section">
                      <h4>Control</h4>
                      <div className="summoning-control-type">
                        <span>Control Type:</span>
                        <select
                          value={effects[level].controlType || 'verbal'}
                          onChange={(e) => updateSummoningControlType(level, e.target.value)}
                        >
                          <option value="verbal">Verbal Commands</option>
                          <option value="mental">Mental Link</option>
                          <option value="autonomous">Autonomous</option>
                        </select>
                      </div>

                      <div className="summoning-control-range">
                        <span>Control Range (ft):</span>
                        <div className="summoning-numeric-controls">
                          <button
                            className="summoning-numeric-button"
                            onClick={() => updateSummoningControlRange(level, Math.max(10, (effects[level].controlRange || 60) - 10))}
                          >-</button>
                          <input
                            type="number"
                            min="10"
                            max="300"
                            step="10"
                            value={effects[level].controlRange || 60}
                            onChange={(e) => updateSummoningControlRange(level, Math.max(10, parseInt(e.target.value) || 10))}
                          />
                          <button
                            className="summoning-numeric-button"
                            onClick={() => updateSummoningControlRange(level, Math.min(300, (effects[level].controlRange || 60) + 10))}
                          >+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Match Type Selection */}
                {isChordSystem && (
                  <div className="graduated-effect-match-type">
                    <div className="match-type-header">
                      <h4>Match Type</h4>
                      <div className="match-type-description">
                        <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                        <span>Choose how this effect level should match chord functions.</span>
                      </div>
                    </div>
                    <div className="match-type-options">
                      <button
                        className={`match-type-option ${(effects[level]?.matchType || 'count') === 'count' ? 'active' : ''}`}
                        onClick={() => updateEffectLevel(level, 'matchType', 'count')}
                      >
                        <div className="match-type-content">
                          <h5>Count-Based</h5>
                          <p>Requires any {level} chord function{level > 1 ? 's' : ''}</p>
                        </div>
                      </button>
                      <button
                        className={`match-type-option ${effects[level]?.matchType === 'specific' ? 'active' : ''}`}
                        onClick={() => updateEffectLevel(level, 'matchType', 'specific')}
                      >
                        <div className="match-type-content">
                          <h5>Function-Specific</h5>
                          <p>Requires specific chord functions</p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}

                {/* Chord/Toxic Requirements */}
                {(effects[level]?.matchType === 'specific' || !isChordSystem) && (
                  <div className="graduated-effect-toxic-requirements">
                    <div className="toxic-requirements-header">
                      <h4>{isChordSystem ? 'Required Chord Functions' : 'Required Toxic Types'}</h4>
                      <div className="toxic-requirements-description">
                        <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                        <span>{isChordSystem ? 'Select which chord functions are required for this effect level. Click to cycle through counts.' : 'Select which toxic types are required for this effect level. Click to cycle through counts.'}</span>
                      </div>
                    </div>
                  <div className="toxic-type-selector">
                    {Object.entries(selectedToxicTypes).length > 0 ? (
                      Object.entries(selectedToxicTypes).map(([toxicId, count]) => {
                        // Find the toxic type definition
                        const toxicType = {
                          id: toxicId,
                          name: toxicId.charAt(0).toUpperCase() + toxicId.slice(1),
                          color: '#8B008B', // Default color
                          wowIcon: null
                        };

                        // Find the matching toxic type from the STEP_MECHANICS_SYSTEMS
                        const toxicTypes = isChordSystem ? [
                          // Chord functions for chord system
                          { id: 'tonic', name: 'Tonic', color: '#FF5555', wowIcon: 'spell_holy_holybolt', theory: 'The tonic is the first note of a scale and represents the key center or home base of a piece of music.' },
                          { id: 'supertonic', name: 'Supertonic', color: '#FF9955', wowIcon: 'spell_holy_sealofwisdom', theory: 'The supertonic is the second degree of the scale, sitting just above the tonic, often creating tension that resolves to the tonic.' },
                          { id: 'mediant', name: 'Mediant', color: '#FFFF55', wowIcon: 'spell_holy_sealofmight', theory: 'The mediant is the third degree of the scale, positioned midway between the tonic and dominant, adding emotional color to progressions.' },
                          { id: 'subdominant', name: 'Subdominant', color: '#55FF55', wowIcon: 'spell_holy_divineillumination', theory: 'The subdominant is the fourth degree of the scale, creating a sense of movement away from the tonic and toward the dominant.' },
                          { id: 'dominant', name: 'Dominant', color: '#55FFFF', wowIcon: 'spell_holy_auraoflight', theory: 'The dominant is the fifth degree of the scale, creating strong tension that typically resolves to the tonic, driving harmonic progression.' },
                          { id: 'submediant', name: 'Submediant', color: '#5555FF', wowIcon: 'spell_holy_blessedrecovery', theory: 'The submediant is the sixth degree of the scale, often used in deceptive cadences and as a substitute for the tonic in minor keys.' },
                          { id: 'leadingtone', name: 'Leading Tone', color: '#FF55FF', wowIcon: 'spell_holy_searinglightpriest', theory: 'The leading tone is the seventh degree of the scale, creating strong tension that pulls toward the tonic, especially in cadences.' }
                        ] : [
                          { id: 'disease', name: 'Disease', color: '#8B008B', wowIcon: 'ability_creature_disease_01' },
                          { id: 'poison', name: 'Poison', color: '#006400', wowIcon: 'ability_creature_poison_06' },
                          { id: 'curse', name: 'Curse', color: '#4B0082', wowIcon: 'spell_shadow_curseofsargeras' },
                          { id: 'venom', name: 'Venom', color: '#006400', wowIcon: 'ability_creature_poison_03' },
                          { id: 'blight', name: 'Blight', color: '#8B4513', wowIcon: 'spell_shadow_creepingplague' },
                          { id: 'plague', name: 'Plague', color: '#2F4F4F', wowIcon: 'spell_shadow_plaguecloud' },
                          { id: 'necrotic', name: 'Necrotic', color: '#8B008B', wowIcon: 'spell_deathknight_necroticplague' },
                          { id: 'toxic', name: 'Toxic', color: '#006400', wowIcon: 'ability_creature_poison_02' },
                          { id: 'corruption', name: 'Corruption', color: '#4B0082', wowIcon: 'spell_shadow_abominationexplosion' },
                          { id: 'contagion', name: 'Contagion', color: '#8B4513', wowIcon: 'spell_shadow_contagion' },
                          { id: 'decay', name: 'Decay', color: '#8B4513', wowIcon: 'ability_creature_disease_02' },
                          { id: 'pestilence', name: 'Pestilence', color: '#2F4F4F', wowIcon: 'spell_nature_nullifydisease' },
                          { id: 'toxin', name: 'Toxin', color: '#006400', wowIcon: 'ability_creature_poison_05' },
                          { id: 'miasma', name: 'Miasma', color: '#4B0082', wowIcon: 'spell_shadow_rainoffire' },
                          { id: 'rot', name: 'Rot', color: '#8B4513', wowIcon: 'ability_creature_disease_03' },
                          { id: 'infection', name: 'Infection', color: '#8B008B', wowIcon: 'inv_misc_herb_plaguebloom' },
                          { id: 'vile', name: 'Vile', color: '#006400', wowIcon: 'spell_shadow_lifedrain02' },
                          { id: 'putrid', name: 'Putrid', color: '#8B4513', wowIcon: 'ability_creature_cursed_04' }
                        ];

                        const matchingType = toxicTypes.find(t => t.id === toxicId);
                        if (matchingType) {
                          Object.assign(toxicType, matchingType);
                        }

                        // Use the parent's tooltip handlers if provided
                        const handleTooltipEnter = (e) => {
                          if (onToxicTooltipEnter) {
                            onToxicTooltipEnter(toxicType, e);
                          }
                        };

                        const handleTooltipLeave = () => {
                          if (onToxicTooltipLeave) {
                            onToxicTooltipLeave();
                          }
                        };

                        const handleTooltipMove = (e) => {
                          if (onToxicTooltipMove) {
                            onToxicTooltipMove(e);
                          }
                        };

                        // Handle toxic type selection
                        const handleToxicTypeSelect = (e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          // Get current required toxic types
                          const requiredToxicTypes = effects[level]?.requiredToxicTypes || {};

                          // Update the count for this toxic type
                          if (requiredToxicTypes[toxicId]) {
                            if (requiredToxicTypes[toxicId] < count) {
                              requiredToxicTypes[toxicId] = requiredToxicTypes[toxicId] + 1;
                            } else {
                              delete requiredToxicTypes[toxicId];
                            }
                          } else {
                            requiredToxicTypes[toxicId] = 1;
                          }

                          // Update the effect level
                          updateEffectLevel(level, 'requiredToxicTypes', requiredToxicTypes);
                        };

                        return (
                          <button
                            key={toxicId}
                            className={`chord-function-button ${effects[level]?.requiredToxicTypes?.[toxicId] ? 'active' : ''}`}
                            onClick={handleToxicTypeSelect}
                            onMouseEnter={handleTooltipEnter}
                            onMouseLeave={handleTooltipLeave}
                            onMouseMove={handleTooltipMove}
                          >
                            <div className="chord-icon-wrapper">
                              {toxicType.name}
                              {effects[level]?.requiredToxicTypes?.[toxicId] && (
                                <div className="toxic-count">{effects[level].requiredToxicTypes[toxicId]}</div>
                              )}
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="no-toxic-types">
                        {isChordSystem
                          ? 'No chord functions selected in the main configuration.'
                          : 'No toxic types selected in the main configuration.'}
                      </div>
                    )}
                  </div>
                  <div className="effect-description">
                    {isChordSystem
                      ? 'Select the chord functions required for this effect level. Click multiple times to increase count.'
                      : 'Select the types of toxic effects required for this effect level. Click multiple times to increase count.'}
                  </div>
                  <button
                    className="clear-toxic-btn"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      updateEffectLevel(level, 'requiredToxicTypes', {});
                    }}
                    disabled={!effects[level]?.requiredToxicTypes || Object.keys(effects[level]?.requiredToxicTypes || {}).length === 0}
                  >
                    {isChordSystem ? 'Clear All Chord Functions' : 'Clear All Selections'}
                  </button>

                </div>
                )}

                {/* Description Input */}
                <div className="graduated-effect-description">
                  <label>Description:</label>
                  <input
                    type="text"
                    value={effects[level]?.description || ''}
                    onChange={(e) => updateEffectLevel(level, 'description', e.target.value)}
                    placeholder="Describe this effect level"
                  />
                </div>

                {/* Effect References */}
                <div className="graduated-effect-references">
                  <label>Include Effects:</label>
                  <div className="effect-references-selector">
                    {availableEffectTypes.map(effect => (
                      <button
                        key={effect.id}
                        className={`effect-reference-button ${effects[level].effectReferences?.[effect.id] ? 'active' : ''}`}
                        onClick={() => toggleEffectReference(level, effect.id)}
                        title={`${effects[level].effectReferences?.[effect.id] ? 'Remove' : 'Add'} ${effect.name} effect`}
                      >
                        {effect.icon && typeof effect.icon === 'function' && <effect.icon />}
                        <span>{effect.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="graduated-effects-actions">
        <button
          className="graduated-effect-add"
          onClick={addEffectLevel}
          disabled={false}
        >
          <FontAwesomeIcon icon={faPlus} /> Add Effect Level
        </button>
      </div>
    </div>
  );
};

export default memo(EnhancedGraduatedRecipeEffects);
