import React, { useState, useEffect } from 'react';
import { useSpellWizardState, useSpellWizardDispatch, actionCreators } from '../../context/spellWizardContext';
import { LIBRARY_ACTION_TYPES, useSpellLibraryDispatch, libraryActionCreators } from '../../context/SpellLibraryContext';
import UnifiedSpellCard from '../common/UnifiedSpellCard';
import WizardStep from '../common/WizardStep';
import { LIBRARY_SPELLS } from '../../../../data/spellLibraryData';
// Pathfinder styles imported via main.css
import {
  serializeSpell,
  deserializeSpell,
  generateHumanReadable,
  generateGameCode,
  createSpellTemplate
} from '../../core/utils/spellSerializer';
import { extractSpellIcon } from '../../core/utils/previewGenerator';
import { formatFormulaToPlainEnglish } from '../common/SpellCardUtils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faSave,
  faEdit,
  faCheckCircle,
  faExclamationTriangle,
  faBook,
  faArrowLeft,
  faArrowRight,
  faCheck,
  faTimes
} from '@fortawesome/free-solid-svg-icons';

/**
 * Step10Review - Final review step for the spell crafting wizard
 * Displays a complete WoW-style preview of the spell with pagination and allows saving to library
 *
 * This component acts as a bridge between the existing SpellWizardContext and our new SpellContext
 * for the spell preview component.
 */
const Step10Review = ({
  stepNumber,
  totalSteps,
  isActive,
  isCompleted,
  onNext,
  onPrevious,
  onJumpToStep
}) => {
  const spellState = useSpellWizardState();
  const wizardDispatch = useSpellWizardDispatch();
  const libraryDispatch = useSpellLibraryDispatch();

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [validationResults, setValidationResults] = useState({ errors: {}, warnings: {} });
  const [reviewedSections, setReviewedSections] = useState({
    basics: false,
    effects: false,
    targeting: false,
    resources: false,
    mechanics: false
  });

  // Check if all sections are reviewed
  const allSectionsReviewed = Object.values(reviewedSections).every(value => value);

  // Format cast time based on spell state
  const formatCastTime = (spellState) => {
    // If it's not an ACTION spell, return the appropriate label
    if (spellState.spellType === 'CHANNELED') return 'Channeled';
    if (spellState.spellType === 'PASSIVE') return 'Passive';
    if (spellState.spellType === 'REACTION') return 'Reaction';

    // For ACTION spells, check the cast time configuration
    const castTimeType = spellState.typeConfig?.castTimeType || spellState.castingConfig?.castTimeType || 'IMMEDIATE';
    const castTime = spellState.typeConfig?.castTime || spellState.castingConfig?.castTime || 0;

    // Format based on cast time type
    if (castTimeType === 'IMMEDIATE' || castTime === 0) return 'Instant';
    if (castTimeType === 'START_OF_TURN') return `${castTime} turn${castTime > 1 ? 's' : ''} (Start)`;
    if (castTimeType === 'END_OF_TURN') return `${castTime} turn${castTime > 1 ? 's' : ''} (End)`;

    // Default fallback
    return castTime > 0 ? `${castTime} turn${castTime > 1 ? 's' : ''}` : 'Instant';
  };

  // Map wizard state to a format the UnifiedSpellCard can understand
  const mapWizardStateToPreviewState = () => {
    // Extract icon from spell state
    const icon = spellState.typeConfig?.icon || extractSpellIcon(spellState) || 'inv_misc_questionmark';

    // Determine resolution method
    let resolution = 'DICE';

    // Check for resolution in damage or healing config
    if (spellState.damageConfig?.globalResolution) {
      resolution = spellState.damageConfig.globalResolution;
    } else if (spellState.healingConfig?.globalResolution) {
      resolution = spellState.healingConfig.globalResolution;
    } else if (spellState.damageConfig?.resolution) {
      resolution = spellState.damageConfig.resolution;
    } else if (spellState.healingConfig?.resolution) {
      resolution = spellState.healingConfig.resolution;
    }
    // Fallback to tags if no resolution is found
    else if (spellState.tags && spellState.tags.includes('card-based')) {
      resolution = 'CARDS';
    } else if (spellState.tags && spellState.tags.includes('coin-based')) {
      resolution = 'COINS';
    }

    // Determine damage types
    const damageTypes = [];

    // First check if we have a primary type selected in Step 1
    if (spellState.typeConfig?.school) {
      damageTypes.push(spellState.typeConfig.school);
    }

    // Check for secondary type in Step 1
    if (spellState.typeConfig?.secondaryElement) {
      damageTypes.push(spellState.typeConfig.secondaryElement);
    }

    // If no types are set in Step 1, check damage config
    if (damageTypes.length === 0 && spellState.damageConfig?.damageType) {
      // For direct damage
      if (spellState.damageConfig.damageType === 'direct' && spellState.damageConfig.elementType) {
        damageTypes.push(spellState.damageConfig.elementType);
      }
      // For DoT damage
      else if (spellState.damageConfig.damageType === 'dot' && spellState.damageConfig.elementType) {
        damageTypes.push(spellState.damageConfig.elementType);
      }
      // For combined damage (direct + DoT)
      else if (spellState.damageConfig.hasDotEffect && spellState.damageConfig.elementType) {
        damageTypes.push(spellState.damageConfig.elementType);
      }
      // Fallback if elementType is not set
      else if (spellState.damageConfig.elementType) {
        damageTypes.push(spellState.damageConfig.elementType);
      }
    }

    // Check if the triggerConfig has actual triggers
    const hasActualTriggers = hasTriggers(spellState.triggerConfig);

    // Create a properly structured spell object for the library card
    return {
      // Basic Information
      id: 'preview',
      name: spellState.name || 'Unnamed Spell',
      description: spellState.description || '',
      level: spellState.level || 1,
      icon: icon,
      spellType: spellState.spellType || 'ACTION',
      effectType: spellState.effectTypes && spellState.effectTypes.length > 0 ? spellState.effectTypes[0] : 'utility',
      effectTypes: spellState.effectTypes || [],

      // Type configuration
      typeConfig: spellState.typeConfig || {},

      // Casting information
      castTime: formatCastTime(spellState),
      range: spellState.targetingConfig?.rangeDistance ? `${spellState.targetingConfig.rangeDistance} ft` : '30 ft',
      rangeType: spellState.targetingConfig?.rangeType || 'ranged',

      // Targeting information
      targetingMode: spellState.targetingConfig?.targetingType || 'single',
      // Use the first item in the targetRestrictions array, or fall back to the single targetRestriction
      targetRestriction: spellState.targetingConfig?.targetRestrictions && spellState.targetingConfig.targetRestrictions.length > 0 ?
                         spellState.targetingConfig.targetRestrictions[0] :
                         spellState.targetingConfig?.targetRestriction || null,
      // Store the full array as well for multi-restriction support, but don't add 'any' as a default
      targetRestrictions: spellState.targetingConfig?.targetRestrictions && spellState.targetingConfig.targetRestrictions.length > 0 ?
                         spellState.targetingConfig.targetRestrictions :
                         spellState.targetingConfig?.targetRestriction ? [spellState.targetingConfig.targetRestriction] : [],
      maxTargets: spellState.targetingConfig?.maxTargets || 1,
      // Use both selectionMethod and targetSelectionMethod for compatibility
      selectionMethod: spellState.targetingConfig?.selectionMethod ||
                      spellState.targetingConfig?.targetSelectionMethod || 'manual',
      // Also include targetSelectionMethod directly
      targetSelectionMethod: spellState.targetingConfig?.targetSelectionMethod ||
                            spellState.targetingConfig?.selectionMethod || 'manual',
      rangeType: spellState.targetingConfig?.rangeType || 'ranged',
      rangeDistance: spellState.targetingConfig?.rangeDistance || 30,

      // AOE information
      aoeShape: spellState.targetingConfig?.aoeShape || 'circle',
      aoeSize: spellState.targetingConfig?.aoeParameters?.radius ||
               spellState.targetingConfig?.aoeParameters?.size ||
               spellState.targetingConfig?.aoeParameters?.length || 20,

      // Trail information
      aoeParameters: spellState.targetingConfig?.aoeParameters || {},
      movementBehavior: spellState.targetingConfig?.movementBehavior || 'static',
      targetingConfig: spellState.targetingConfig || {},

      // Propagation information
      propagation: spellState.propagation ? {
        method: spellState.propagation.method || 'none',
        behavior: spellState.propagation.behavior || '',
        count: spellState.propagation.parameters?.count || 0,
        range: spellState.propagation.parameters?.range || 0,
        decay: spellState.propagation.parameters?.decay || 0,
        secondaryRadius: spellState.propagation.parameters?.secondaryRadius || 0,
        spreadRate: spellState.propagation.parameters?.spreadRate || 0,
        forkCount: spellState.propagation.parameters?.forkCount || 0,
        // Include all parameters to ensure nothing is missed
        parameters: spellState.propagation.parameters || {}
      } : {
        method: 'none',
        behavior: '',
        parameters: {}
      },

      // Trap configuration
      trapConfig: spellState.trapConfig || null,

      // Trigger configuration
      triggerConfig: hasActualTriggers ? spellState.triggerConfig : null,

      // Damage/Healing information
      primaryDamage: spellState.damageConfig && (
        spellState.damageConfig.formula ||
        spellState.damageConfig.diceNotation ||
        spellState.effectResolutions?.damage?.config?.formula
      ) ? {
        dice: spellState.damageConfig.formula ||
              spellState.damageConfig.diceNotation ||
              spellState.effectResolutions?.damage?.config?.formula,
        flat: spellState.damageConfig.flatBonus || 0,
        type: spellState.damageConfig.elementType || spellState.typeConfig?.school || 'force'
      } : null,

      // Damage types
      damageTypes: spellState.damageConfig?.elementType ? [spellState.damageConfig.elementType] :
                  spellState.typeConfig?.school ? [spellState.typeConfig.school] : ['force'],

      // Saving throw information for damage effects
      damageConfig: {
        ...spellState.damageConfig,
        // Ensure saving throw information is included (backward compatibility)
        savingThrow: spellState.damageConfig?.savingThrow || null,
        savingThrowType: spellState.damageConfig?.savingThrowType || 'agility',
        difficultyClass: spellState.damageConfig?.difficultyClass || 15,
        partialEffect: spellState.damageConfig?.partialEffect || false,
        partialEffectFormula: spellState.damageConfig?.partialEffectFormula || 'damage/2',
        partialEffectType: spellState.damageConfig?.partialEffectType || 'half',
        directDamageFormula: spellState.damageConfig?.directDamageFormula || 'damage/2',
        dotDamageFormula: spellState.damageConfig?.dotDamageFormula || 'dot_damage/2',
        // Include the new savingThrowConfig structure for UnifiedSpellCard
        savingThrowConfig: spellState.damageConfig?.savingThrowConfig || (
          spellState.damageConfig?.savingThrow ? {
            enabled: true,
            savingThrowType: spellState.damageConfig.savingThrowType || 'agility',
            difficultyClass: spellState.damageConfig.difficultyClass || 15,
            partialEffect: spellState.damageConfig.partialEffect || false,
            partialEffectFormula: spellState.damageConfig.partialEffectFormula || 'damage/2'
          } : null
        )
      },

      // Healing configuration
      healingConfig: spellState.healingConfig || null,

      // Resolution type
      resolution: spellState.damageConfig?.resolution || spellState.healingConfig?.resolution || 'DICE',

      // Coin and card configurations
      coinConfig: spellState.damageConfig?.coinConfig || spellState.coinConfig,
      cardConfig: spellState.damageConfig?.cardConfig || spellState.cardConfig,

      // Damage over time configuration
      isDot: spellState.damageConfig?.damageType === 'dot',
      hasDotEffect: spellState.damageConfig?.hasDotEffect || false,
      dotDuration: spellState.damageConfig?.dotDuration || 3,
      dotTick: spellState.damageConfig?.dotFormula || '1d4',
      dotTickType: spellState.damageConfig?.dotTickType || 'round',
      dotApplication: spellState.damageConfig?.dotApplication || 'start',
      dotScalingType: spellState.damageConfig?.dotScalingType || 'flat',

      // Healing over time configuration - only include if healing is enabled
      isHot: spellState.effectTypes?.includes('healing') && spellState.healingConfig?.healingType === 'hot',
      hasHotEffect: spellState.effectTypes?.includes('healing') && (spellState.healingConfig?.hasHotEffect === true),
      hotDuration: spellState.healingConfig?.hotDuration || 3,
      hotTick: spellState.healingConfig?.hotFormula || '1d4',
      hotTickType: spellState.healingConfig?.hotTickType || 'round',
      hotApplication: spellState.healingConfig?.hotApplication || 'start',

      // Healing configurations - only include if healing is enabled
      healing: (spellState.effectTypes?.includes('healing') && spellState.healingConfig && (
        spellState.healingConfig.formula ||
        spellState.healingConfig.diceNotation ||
        spellState.effectResolutions?.healing?.config?.formula
      )) ? {
        dice: spellState.healingConfig.formula ||
              spellState.healingConfig.diceNotation ||
              spellState.effectResolutions?.healing?.config?.formula,
        flat: spellState.healingConfig.flatBonus || 0
      } : null,

      healingCoinConfig: spellState.healingConfig?.coinConfig,
      healingCardConfig: spellState.healingConfig?.cardConfig,
      hotScalingType: spellState.healingConfig?.hotScalingType || 'flat',

      // Shield configuration - only include if healing is enabled
      isShield: spellState.effectTypes?.includes('healing') && spellState.healingConfig?.healingType === 'shield',
      hasShieldEffect: spellState.effectTypes?.includes('healing') && (spellState.healingConfig?.hasShieldEffect === true),
      shieldDuration: spellState.healingConfig?.shieldDuration || 3,
      shieldAmount: spellState.healingConfig?.shieldFormula || '2d6', // Use the shield formula
      shieldDamageTypes: spellState.healingConfig?.shieldDamageTypes || 'all',
      shieldOverflow: spellState.healingConfig?.shieldOverflow || 'dissipate',
      shieldBreakBehavior: spellState.healingConfig?.shieldBreakBehavior || 'fade',
      shieldBreakEffect: spellState.healingConfig?.shieldBreakEffect || null,
      shieldExpireEffect: spellState.healingConfig?.shieldExpireEffect || null,
      healing: spellState.healingConfig && (
        spellState.healingConfig.formula ||
        spellState.healingConfig.diceNotation ||
        spellState.effectResolutions?.healing?.config?.formula
      ) ? {
        dice: spellState.healingConfig.formula ||
              spellState.healingConfig.diceNotation ||
              spellState.effectResolutions?.healing?.config?.formula,
        flat: spellState.healingConfig.flatBonus || 0
      } : null,
      damageTypes: damageTypes,

      // Resolution method
      resolution: resolution,
      // Add formula directly to the spell object for easier access (only if exists)
      formula: spellState.damageConfig?.formula ||
              spellState.healingConfig?.formula ||
              spellState.effectResolutions?.damage?.config?.formula ||
              spellState.effectResolutions?.healing?.config?.formula ||
              spellState.damageConfig?.diceNotation ||
              spellState.healingConfig?.diceNotation ||
              null,
      // Also include in diceConfig for compatibility
      diceConfig: {
        formula: spellState.damageConfig?.formula ||
                spellState.healingConfig?.formula ||
                spellState.effectResolutions?.damage?.config?.formula ||
                spellState.effectResolutions?.healing?.config?.formula ||
                spellState.damageConfig?.diceNotation ||
                spellState.healingConfig?.diceNotation ||
                null
      },
      cardConfig: spellState.cardConfig || {
        drawCount: 3,
        formula: 'CARD_VALUE + FACE_CARD_COUNT * 5'
      },
      coinConfig: spellState.coinConfig || {
        flipCount: 5,
        formula: 'HEADS_COUNT * 8 + (ALL_HEADS ? 15 : 0)'
      },

      // Healing-specific configurations for different resolution methods
      healingCardConfig: spellState.healingConfig?.cardConfig || {
        drawCount: 3,
        formula: 'CARD_VALUE + FACE_CARD_COUNT * 3'
      },
      healingCoinConfig: spellState.healingConfig?.coinConfig || {
        flipCount: 5,
        formula: 'HEADS_COUNT * 7 + (LONGEST_STREAK > 2 ? LONGEST_STREAK * 5 : 0)'
      },

      // Critical hit configuration
      criticalConfig: {
        enabled: spellState.damageConfig?.criticalConfig?.enabled || spellState.healingConfig?.criticalConfig?.enabled || spellState.criticalConfig?.enabled || false,
        critType: spellState.damageConfig?.criticalConfig?.critType || spellState.healingConfig?.criticalConfig?.critType || spellState.criticalConfig?.critType || resolution.toLowerCase(),
        critMultiplier: spellState.damageConfig?.criticalConfig?.critMultiplier || spellState.healingConfig?.criticalConfig?.critMultiplier || spellState.criticalConfig?.critMultiplier || 2,
        explodingDice: spellState.damageConfig?.criticalConfig?.explodingDice || spellState.healingConfig?.criticalConfig?.explodingDice || spellState.criticalConfig?.explodingDice || false,
        extraCardDraw: spellState.damageConfig?.criticalConfig?.extraCardDraw || spellState.healingConfig?.criticalConfig?.extraCardDraw || spellState.criticalConfig?.extraCardDraw || 2,
        extraCoinFlips: spellState.damageConfig?.criticalConfig?.extraCoinFlips || spellState.healingConfig?.criticalConfig?.extraCoinFlips || spellState.criticalConfig?.extraCoinFlips || 3,
        spellEffect: spellState.damageConfig?.criticalConfig?.spellEffect || spellState.healingConfig?.criticalConfig?.spellEffect || spellState.criticalConfig?.spellEffect || null,
        // Add useRollableTable property - check for effectType being 'rollableTable' as well
        useRollableTable:
          spellState.damageConfig?.criticalConfig?.useRollableTable ||
          spellState.healingConfig?.criticalConfig?.useRollableTable ||
          spellState.criticalConfig?.useRollableTable ||
          spellState.damageConfig?.criticalConfig?.effectType === 'rollableTable' ||
          spellState.healingConfig?.criticalConfig?.effectType === 'rollableTable' ||
          spellState.criticalConfig?.effectType === 'rollableTable' ||
          false,
        // Additional details about the triggered spell
        effectType: spellState.damageConfig?.criticalConfig?.effectType || spellState.healingConfig?.criticalConfig?.effectType || spellState.criticalConfig?.effectType || null,
        effectDetails: spellState.damageConfig?.criticalConfig?.effectDetails || spellState.healingConfig?.criticalConfig?.effectDetails || spellState.criticalConfig?.effectDetails || null,
        effectDuration: spellState.damageConfig?.criticalConfig?.effectDuration || spellState.healingConfig?.criticalConfig?.effectDuration || spellState.criticalConfig?.effectDuration || 2,
        effectDurationUnit: spellState.damageConfig?.criticalConfig?.effectDurationUnit || spellState.healingConfig?.criticalConfig?.effectDurationUnit || spellState.criticalConfig?.effectDurationUnit || 'rounds',
        immunityType: spellState.damageConfig?.criticalConfig?.immunityType || spellState.healingConfig?.criticalConfig?.immunityType || spellState.criticalConfig?.immunityType || 'Damage',
        buffType: spellState.damageConfig?.criticalConfig?.buffType || spellState.healingConfig?.criticalConfig?.buffType || spellState.criticalConfig?.buffType || 'Stat Boost',
        debuffType: spellState.damageConfig?.criticalConfig?.debuffType || spellState.healingConfig?.criticalConfig?.debuffType || spellState.criticalConfig?.debuffType || 'Stat Reduction',
        damageAmount: spellState.damageConfig?.criticalConfig?.damageAmount || spellState.healingConfig?.criticalConfig?.damageAmount || spellState.criticalConfig?.damageAmount || '2d6',
        damageType: spellState.damageConfig?.criticalConfig?.damageType || spellState.healingConfig?.criticalConfig?.damageType || spellState.criticalConfig?.damageType || 'Force',
        healAmount: spellState.damageConfig?.criticalConfig?.healAmount || spellState.healingConfig?.criticalConfig?.healAmount || spellState.criticalConfig?.healAmount || '2d6',
        controlType: spellState.damageConfig?.criticalConfig?.controlType || spellState.healingConfig?.criticalConfig?.controlType || spellState.criticalConfig?.controlType || 'Stun'
      },

      // Rollable table configuration - only include if explicitly enabled
      rollableTable: (spellState.rollableTable && spellState.rollableTable.enabled === true) ? spellState.rollableTable : null,

      // Buff/Debuff configuration
      buffConfig: spellState.buffConfig || null,
      debuffConfig: spellState.debuffConfig || null,

      // Control configuration
      controlConfig: spellState.controlConfig || null,

      // Summoning configuration
      summonConfig: spellState.summonConfig || null,
      summoningConfig: spellState.summonConfig || null,

      // Transformation configuration
      transformConfig: spellState.transformConfig || null,
      transformationConfig: spellState.transformConfig || null,

      // Resource configuration
      resourceCost: {
        // Use the formula if useFormulas.mana is true, otherwise use the value
        mana: spellState.resourceCost?.useFormulas?.mana
          ? spellState.resourceCost?.resourceFormulas?.mana || "1d10+2"
          : spellState.resourceCost?.resourceValues?.mana || spellState.resourceCost?.mana || spellState.resourceConfig?.resourceAmount || "1d10+2",
        actionPoints: spellState.resourceCost?.actionPoints || spellState.resourceConfig?.actionPoints || 1,
        primaryResourceType: spellState.resourceCost?.primaryResourceType || spellState.resourceConfig?.resourceType || 'Mana',
        classResourceCost: spellState.resourceCost?.classResourceCost || spellState.resourceConfig?.classResourceCost || 0,
        components: spellState.resourceCost?.components || [],
        materialComponents: spellState.resourceCost?.materialComponents || '',
        // Include formula information
        useFormulas: spellState.resourceCost?.useFormulas || {},
        resourceFormulas: spellState.resourceCost?.resourceFormulas || {},
        resourceValues: spellState.resourceCost?.resourceValues || {}
      },

      // Cooldown configuration
      cooldownConfig: {
        type: spellState.cooldownConfig?.type || 'turn_based',
        value: spellState.cooldownConfig?.value || 1,
        charges: spellState.cooldownConfig?.charges || 1,
        recovery: spellState.cooldownConfig?.recovery || 1,
        sharesCooldown: spellState.cooldownConfig?.sharesCooldown || false,
        cooldownGroup: spellState.cooldownConfig?.cooldownGroup || ''
      },

      // Channeling configuration
      channelingConfig: spellState.spellType === 'CHANNELED' || spellState.spellType === 'channeled' ? {
        type: spellState.channelingConfig?.type || 'power_up',
        maxDuration: spellState.channelingConfig?.maxDuration || 3,
        durationUnit: spellState.channelingConfig?.durationUnit || 'turns',
        interruptible: spellState.channelingConfig?.interruptible !== undefined ? spellState.channelingConfig.interruptible : true,
        movementAllowed: spellState.channelingConfig?.movementAllowed !== undefined ? spellState.channelingConfig.movementAllowed : false,
        costValue: spellState.channelingConfig?.costValue || 1,
        costType: spellState.channelingConfig?.costType ||
                 (spellState.resourceCost?.resourceValues && Object.keys(spellState.resourceCost.resourceValues).length > 0 ?
                  Object.keys(spellState.resourceCost.resourceValues)[0].toLowerCase() :
                  (spellState.resourceCost?.primaryResourceType?.toLowerCase() || 'mana')),
        costTrigger: spellState.channelingConfig?.costTrigger || 'per_turn',
        // Include the per-round formulas for channeled effects
        perRoundFormulas: (() => {
          // Get the existing perRoundFormulas
          const formulas = spellState.channelingConfig?.perRoundFormulas || {};

          // Check if we have a HoT effect with channeled trigger type but no formulas
          if (spellState.healingConfig?.hasHotEffect &&
              spellState.healingConfig?.hotTriggerType === 'channeled' &&
              (!formulas.hot_healing || formulas.hot_healing.length === 0)) {

            // Add default formulas for HoT
            formulas.hot_healing = [
              { round: 1, formula: spellState.healingConfig.hotFormula || '1d4', description: 'Round 1 healing' },
              { round: 2, formula: spellState.healingConfig.hotFormula || '1d4', description: 'Round 2 healing' },
              { round: 3, formula: spellState.healingConfig.hotFormula || '1d4', description: 'Round 3 healing' }
            ];
          }

          // Check if we have a DoT effect with channeled trigger type but no formulas
          if (spellState.damageConfig?.hasDotEffect &&
              spellState.damageConfig?.dotTriggerType === 'channeled' &&
              (!formulas.dot_damage || formulas.dot_damage.length === 0)) {

            // Add default formulas for DoT
            formulas.dot_damage = [
              { round: 1, formula: spellState.damageConfig.dotFormula || '1d4', description: 'Round 1 damage' },
              { round: 2, formula: spellState.damageConfig.dotFormula || '1d4', description: 'Round 2 damage' },
              { round: 3, formula: spellState.damageConfig.dotFormula || '1d4', description: 'Round 3 damage' }
            ];
          }

          return formulas;
        })(),
        // Area expansion properties
        initialRadius: spellState.channelingConfig?.initialRadius || 5,
        maxRadius: spellState.channelingConfig?.maxRadius || 30,
        expansionRate: spellState.channelingConfig?.expansionRate || 5,
        // Defensive properties
        maxDamageReduction: spellState.channelingConfig?.maxDamageReduction || 50,
        // Persistent effect properties
        persistentRadius: spellState.channelingConfig?.persistentRadius || 10,
        persistentEffectType: spellState.channelingConfig?.persistentEffectType || 'aura',
        // Staged effect properties
        stages: spellState.channelingConfig?.stages || []
      } : null,

      // Chance on hit configuration
      procConfig: {
        enabled: spellState.damageConfig?.chanceOnHitConfig?.enabled || spellState.healingConfig?.chanceOnHitConfig?.enabled || spellState.procConfig?.enabled || false,
        procType: spellState.damageConfig?.chanceOnHitConfig?.procType || spellState.healingConfig?.chanceOnHitConfig?.procType || spellState.procConfig?.procType || resolution.toLowerCase(),
        procChance: spellState.damageConfig?.chanceOnHitConfig?.procChance || spellState.healingConfig?.chanceOnHitConfig?.procChance || spellState.procConfig?.procChance || 15,
        diceThreshold: spellState.damageConfig?.chanceOnHitConfig?.diceThreshold || spellState.healingConfig?.chanceOnHitConfig?.diceThreshold || spellState.procConfig?.diceThreshold || 18,
        cardProcRule: spellState.damageConfig?.chanceOnHitConfig?.cardProcRule || spellState.healingConfig?.chanceOnHitConfig?.cardProcRule || spellState.procConfig?.cardProcRule || 'face_cards',
        coinProcRule: spellState.damageConfig?.chanceOnHitConfig?.coinProcRule || spellState.healingConfig?.chanceOnHitConfig?.coinProcRule || spellState.procConfig?.coinProcRule || 'all_heads',
        coinCount: spellState.damageConfig?.chanceOnHitConfig?.coinCount || spellState.healingConfig?.chanceOnHitConfig?.coinCount || spellState.procConfig?.coinCount || 3,
        spellEffect: spellState.damageConfig?.chanceOnHitConfig?.spellEffect || spellState.healingConfig?.chanceOnHitConfig?.spellEffect || spellState.procConfig?.spellEffect || null,
        // Add useRollableTable property - check for effectType being 'rollableTable' as well
        useRollableTable:
          spellState.damageConfig?.chanceOnHitConfig?.useRollableTable ||
          spellState.healingConfig?.chanceOnHitConfig?.useRollableTable ||
          spellState.procConfig?.useRollableTable ||
          spellState.damageConfig?.chanceOnHitConfig?.effectType === 'rollableTable' ||
          spellState.healingConfig?.chanceOnHitConfig?.effectType === 'rollableTable' ||
          spellState.procConfig?.effectType === 'rollableTable' ||
          false,
        // Additional details about the triggered spell
        effectType: spellState.damageConfig?.chanceOnHitConfig?.effectType || spellState.healingConfig?.chanceOnHitConfig?.effectType || spellState.procConfig?.effectType || null,
        effectDetails: spellState.damageConfig?.chanceOnHitConfig?.effectDetails || spellState.healingConfig?.chanceOnHitConfig?.effectDetails || spellState.procConfig?.effectDetails || null,
        effectDuration: spellState.damageConfig?.chanceOnHitConfig?.effectDuration || spellState.healingConfig?.chanceOnHitConfig?.effectDuration || spellState.procConfig?.effectDuration || 2,
        effectDurationUnit: spellState.damageConfig?.chanceOnHitConfig?.effectDurationUnit || spellState.healingConfig?.chanceOnHitConfig?.effectDurationUnit || spellState.procConfig?.effectDurationUnit || 'rounds',
        immunityType: spellState.damageConfig?.chanceOnHitConfig?.immunityType || spellState.healingConfig?.chanceOnHitConfig?.immunityType || spellState.procConfig?.immunityType || 'Damage',
        buffType: spellState.damageConfig?.chanceOnHitConfig?.buffType || spellState.healingConfig?.chanceOnHitConfig?.buffType || spellState.procConfig?.buffType || 'Stat Boost',
        debuffType: spellState.damageConfig?.chanceOnHitConfig?.debuffType || spellState.healingConfig?.chanceOnHitConfig?.debuffType || spellState.procConfig?.debuffType || 'Stat Reduction',
        damageAmount: spellState.damageConfig?.chanceOnHitConfig?.damageAmount || spellState.healingConfig?.chanceOnHitConfig?.damageAmount || spellState.procConfig?.damageAmount || '2d6',
        damageType: spellState.damageConfig?.chanceOnHitConfig?.damageType || spellState.healingConfig?.chanceOnHitConfig?.damageType || spellState.procConfig?.damageType || 'Force',
        healAmount: spellState.damageConfig?.chanceOnHitConfig?.healAmount || spellState.healingConfig?.chanceOnHitConfig?.healAmount || spellState.procConfig?.healAmount || '2d6',
        controlType: spellState.damageConfig?.chanceOnHitConfig?.controlType || spellState.healingConfig?.chanceOnHitConfig?.controlType || spellState.procConfig?.controlType || 'Stun',
        customEffects: spellState.damageConfig?.chanceOnHitConfig?.customEffects || spellState.healingConfig?.chanceOnHitConfig?.customEffects || spellState.procConfig?.customEffects || []
      },

      // Separate effects by type
      damageEffects: formatEffects()
        .filter(effect => effect.effectType === 'damage')
        .map(effect => {
          // Get damage types
          const damageTypes = [];

          // Add the school from typeConfig if available
          if (spellState.typeConfig?.school) {
            damageTypes.push(spellState.typeConfig.school);
          }

          // Add additional damage types if available
          if (spellState.typeConfig?.secondaryElement) {
            damageTypes.push(spellState.typeConfig.secondaryElement);
          }

          // For DoT effects, include full details with formula
          if (effect.effectName === 'Damage over Time' || effect.effectName === 'Trigger-Based Damage over Time') {
            let triggerText = '';
            // For trigger-based DoT, include trigger details
            if (effect.triggerBased && effect.triggerDetails) {
              triggerText = ` ${effect.triggerDetails}`;
            } else if (effect.triggerBased) {
              triggerText = ` per trigger for ${effect.duration}`;
            } else {
              triggerText = ` over ${effect.duration}`;
            }

            // Format damage types with proper capitalization
            let damageTypeText = '';
            if (damageTypes.length > 0) {
              damageTypeText = ' ' + damageTypes.map(type => {
                return type.charAt(0).toUpperCase() + type.slice(1);
              }).join(' & ') + ' damage';
            }

            return `${effect.damageAmount}${triggerText}${damageTypeText}`;
          }
          // For regular damage, include a clear label with formula
          if (effect.effectName === 'Damage') {
            // Format damage types with proper capitalization
            let damageTypeText = '';
            if (damageTypes.length > 0) {
              damageTypeText = ' ' + damageTypes.map(type => {
                return type.charAt(0).toUpperCase() + type.slice(1);
              }).join(' & ') + ' damage';
            }

            return `${effect.damageAmount}${damageTypeText}`;
          }
          // For other damage effects
          return `${effect.effectName}${effect.duration ? ` for ${effect.duration}` : ''}`;
        })
        .filter(Boolean), // Remove null entries

      healingEffects: formatEffects()
        .filter(effect => effect.effectType === 'healing')
        .map(effect => {
          // For HoT effects, include full details with formula
          if (effect.effectName === 'Healing over Time') {
            // If this is a channeled HoT effect, show the channeling info
            if (spellState.healingConfig?.hotTriggerType === 'channeled') {
              // Get the formulas from the channeling config
              const formulas = spellState.channelingConfig?.perRoundFormulas?.hot_healing || [];
              if (formulas.length > 0) {
                // Create a string showing the formulas for each round
                const formulaText = formulas.map((round, index) =>
                  `${round.formula}${index < formulas.length - 1 ? ' → ' : ''}`
                ).join('');

                return `${effect.effectName}: ${formulaText} for ${spellState.channelingConfig?.maxDuration || 3} ${spellState.channelingConfig?.durationUnit || 'turns'}`;
              }
            }
            return `${effect.effectName}: ${effect.healAmount}${effect.duration ? ` for ${effect.duration}` : ''}`;
          }
          // For Shield effects, include full details with formula
          if (effect.effectName === 'Shield') {
            return `${effect.effectName}: ${effect.healAmount}${effect.duration ? ` for ${effect.duration}` : ''}`;
          }
          // For regular healing, include a clear label with formula
          if (effect.effectName === 'Healing') {
            return `${effect.healAmount}${effect.duration ? ` Lasts for ${effect.duration}` : ''}`;
          }
          // For other healing effects
          return `${effect.effectName}${effect.duration ? ` for ${effect.duration}` : ''}`;
        })
        .filter(Boolean), // Remove null entries

      buffEffects: formatEffects()
        .filter(effect => effect.effectType === 'buff')
        .map(effect => {
          // Clean up the effect text
          let effectName = effect.effectName;
          let buffEffect = effect.buffEffect;
          let duration = effect.duration;

          // Format duration based on durationType
          if (spellState.buffConfig?.durationType === 'rest') {
            if (spellState.buffConfig?.restType === 'short') {
              duration = 'until short rest';
            } else if (spellState.buffConfig?.restType === 'long') {
              duration = 'until long rest';
            }
          } else if (spellState.buffConfig?.durationType === 'permanent') {
            duration = 'permanent';
          } else if (duration && duration.toLowerCase().includes('medium rounds')) {
            // Legacy format - replace "medium rounds" with "3 minutes"
            duration = duration.replace(/medium rounds/i, '3 minutes');
          }

          // For progressive buffs, just show the stat name and value
          if (spellState.buffConfig?.isProgressive && spellState.buffConfig?.progressiveStages?.length > 0) {
            // Check if this stat is included in any progressive stage
            const isInProgressiveStages = spellState.buffConfig.progressiveStages.some(stage =>
              stage.statModifiers?.some(mod => mod.name === effectName)
            );

            if (isInProgressiveStages) {
              return `${effectName}: ${buffEffect}`;
            }
          }

          // Check if this effect has conditional triggers
          if (effect.conditionalTriggers && effect.conditionalTriggers.length > 0) {
            // Format the base effect
            let baseEffect = `${effectName}: ${buffEffect}${duration ? ` for ${duration}` : ''}`;

            // Add conditional effects
            effect.conditionalTriggers.forEach(trigger => {
              const triggerName = trigger.triggerName.replace(/_/g, ' ');
              const conditionalValue = `${trigger.magnitude}${trigger.magnitudeType === 'percentage' ? '%' : ''}`;

              // Format parameters for display
              let paramText = '';
              if (trigger.parameters) {
                const params = Object.entries(trigger.parameters)
                  .map(([key, value]) => {
                    // Format the parameter key and value
                    const formattedKey = key.replace(/_/g, ' ');
                    let formattedValue = value;

                    // Special formatting for certain parameter types
                    if (key === 'threshold_value' && trigger.parameters.threshold_type === 'percentage') {
                      formattedValue = `${value}%`;
                    } else if (typeof value === 'boolean') {
                      formattedValue = value ? 'Yes' : 'No';
                    }

                    return `${formattedKey}: ${formattedValue}`;
                  })
                  .join(', ');

                if (paramText) {
                  paramText = ` (${paramText})`;
                }
              }

              baseEffect += `\nWhen ${triggerName}${paramText}: ${conditionalValue} ${effect.effectName.replace(' Boost', '')} increase`;
            });

            return baseEffect;
          }

          // For non-progressive buffs or buffs not in progressive stages
          return `${effectName}: ${buffEffect}${duration ? ` for ${duration}` : ''}`;
        }),

      debuffEffects: formatEffects()
        .filter(effect => effect.effectType === 'debuff')
        .map(effect => {
          // Clean up the effect text
          let effectName = effect.effectName;
          let debuffEffect = effect.debuffEffect;
          let duration = effect.duration;

          // Format duration based on durationType
          if (spellState.debuffConfig?.durationType === 'rest') {
            if (spellState.debuffConfig?.restType === 'short') {
              duration = 'until short rest';
            } else if (spellState.debuffConfig?.restType === 'long') {
              duration = 'until long rest';
            }
          } else if (spellState.debuffConfig?.durationType === 'permanent') {
            duration = 'permanent';
          } else if (duration && duration.toLowerCase().includes('medium rounds')) {
            // Legacy format - replace "medium rounds" with "3 minutes"
            duration = duration.replace(/medium rounds/i, '3 minutes');
          }

          // For progressive debuffs, just show the stat name and value
          if (spellState.debuffConfig?.isProgressive && spellState.debuffConfig?.progressiveStages?.length > 0) {
            // Check if this stat is included in any progressive stage
            const isInProgressiveStages = spellState.debuffConfig.progressiveStages.some(stage =>
              stage.statPenalties?.some(mod => mod.name === effectName)
            );

            if (isInProgressiveStages) {
              return `${effectName}: ${debuffEffect}`;
            }
          }

          // Check if this effect has conditional triggers
          if (effect.conditionalTriggers && effect.conditionalTriggers.length > 0) {
            // Format the base effect
            let baseEffect = `${effectName}: ${debuffEffect}${duration ? ` for ${duration}` : ''}`;

            // Add conditional effects
            effect.conditionalTriggers.forEach(trigger => {
              const triggerName = trigger.triggerName.replace(/_/g, ' ');
              const conditionalValue = `${trigger.magnitude}${trigger.magnitudeType === 'percentage' ? '%' : ''}`;

              // Format parameters for display
              let paramText = '';
              if (trigger.parameters) {
                const params = Object.entries(trigger.parameters)
                  .map(([key, value]) => {
                    // Format the parameter key and value
                    const formattedKey = key.replace(/_/g, ' ');
                    let formattedValue = value;

                    // Special formatting for certain parameter types
                    if (key === 'threshold_value' && trigger.parameters.threshold_type === 'percentage') {
                      formattedValue = `${value}%`;
                    } else if (typeof value === 'boolean') {
                      formattedValue = value ? 'Yes' : 'No';
                    }

                    return `${formattedKey}: ${formattedValue}`;
                  })
                  .join(', ');

                if (paramText) {
                  paramText = ` (${paramText})`;
                }
              }

              baseEffect += `\nWhen ${triggerName}${paramText}: ${conditionalValue} ${effect.effectName.replace(' Reduction', '')} decrease`;
            });

            return baseEffect;
          }

          // For non-progressive debuffs or debuffs not in progressive stages
          return `${effectName}: ${debuffEffect}${duration ? ` for ${duration}` : ''}`;
        }),

      utilityEffects: formatEffects()
        .filter(effect => effect.effectType === 'utility')
        .map(effect => `${effect.effectName}: ${effect.utilityDescription || ''}`),

      controlEffects: formatEffects()
        .filter(effect => effect.effectType === 'control')
        .map(effect => ({
          type: effect.controlEffect || '',
          duration: effect.duration || '',
          savingThrow: effect.savingThrow ?
            `${effect.savingThrow.charAt(0).toUpperCase() + effect.savingThrow.slice(1)} save DC ${effect.difficultyClass || 15}` : '',
          distance: effect.distance ? `${effect.distance} ft` : '',
          concentration: effect.concentration ? 'Concentration required' : '',
          description: effect.description || ''
        })),

      summoningEffects: formatEffects()
        .filter(effect => effect.effectType === 'summoning')
        .map(effect => {
          if (effect.effectName === 'Summoning') {
            return `${effect.summonName || 'Summoned Entity'}: ${effect.summonDetails || ''}${effect.duration ? ` for ${effect.duration}` : ''}`;
          } else if (effect.effectName === 'Summon Ability') {
            return `Ability: ${effect.summonAbility || ''} - ${effect.summonAbilityDescription || ''}`;
          }
          return `${effect.effectName}: ${effect.summonDetails || ''}`;
        }),

      transformationEffects: formatEffects()
        .filter(effect => effect.effectType === 'transformation')
        .map(effect => {
          if (effect.effectName === 'Transformation') {
            return `${effect.transformType || 'Form'}: ${effect.transformDetails || ''}${effect.duration ? ` for ${effect.duration}` : ''}`;
          } else if (effect.effectName === 'Granted Ability') {
            return `Ability: ${effect.abilityName || ''} - ${effect.abilityDescription || ''}`;
          } else if (effect.effectName === 'Stat Change') {
            return `${effect.statName || 'Stat'}: ${effect.statChange || ''}`;
          }
          return `${effect.effectName}: ${effect.transformDetails || ''}`;
        }),

      purificationEffects: formatEffects()
        .filter(effect => effect.effectType === 'purification')
        .map(effect => {
          if (effect.effectName === 'Purification') {
            return `${effect.purificationType || 'Dispel'}: ${effect.purificationDetails || ''}${effect.effectTypes ? ` (${effect.effectTypes})` : ''}`;
          } else if (effect.effectName === 'Specific Effect') {
            return `Purifies: ${effect.specificEffect || ''} - ${effect.specificEffectDescription || ''}`;
          }
          return `${effect.effectName}: ${effect.purificationDetails || ''}`;
        }),

      restorationEffects: formatEffects()
        .filter(effect => effect.effectType === 'restoration')
        .map(effect => {
          if (effect.effectName === 'Restoration') {
            return `${effect.resourceType || 'Resource'} Restoration: ${effect.restorationFormula || ''} - ${effect.restorationDetails || ''}`;
          } else if (effect.effectName === 'Secondary Effect') {
            return `${effect.secondaryEffect || ''}: ${effect.secondaryEffectDescription || ''}`;
          }
          return `${effect.effectName}: ${effect.restorationDetails || ''}`;
        }),

      // Keep a general effects array for backward compatibility
      effects: formatEffects().map(effect => {
        // Format effect based on type
        if (effect.effectType === 'damage') {
          // Get damage types
          const damageTypes = [];

          // Add the school from typeConfig if available
          if (spellState.typeConfig?.school) {
            damageTypes.push(spellState.typeConfig.school);
          }

          // Add additional damage types if available
          if (spellState.typeConfig?.secondaryElement) {
            damageTypes.push(spellState.typeConfig.secondaryElement);
          }

          if (effect.effectName === 'Damage') {
            // Format damage types with proper capitalization
            let damageTypeText = '';
            if (damageTypes.length > 0) {
              damageTypeText = ' ' + damageTypes.map(type => {
                return type.charAt(0).toUpperCase() + type.slice(1);
              }).join(' & ') + ' damage';
            }

            return `${effect.damageAmount}${damageTypeText}`;
          } else if (effect.effectName === 'Damage over Time' || effect.effectName === 'Trigger-Based Damage over Time') {
            // Format damage types with proper capitalization
            let damageTypeText = '';
            if (damageTypes.length > 0) {
              damageTypeText = ' ' + damageTypes.map(type => {
                return type.charAt(0).toUpperCase() + type.slice(1);
              }).join(' & ') + ' damage';
            }

            return `${effect.damageAmount} over ${effect.duration || '3 rounds'}${damageTypeText}`;
          }

          return `${effect.effectName}: ${effect.damageAmount}${effect.duration ? ` for ${effect.duration}` : ''}`;
        } else if (effect.effectType === 'healing') {
          return `${effect.effectName}: ${effect.healAmount}${effect.duration ? ` for ${effect.duration}` : ''}`;
        } else if (effect.effectType === 'buff') {
          // Clean up the effect text
          let effectName = effect.effectName;
          let buffEffect = effect.buffEffect;
          let duration = effect.duration;

          // Format duration based on durationType
          if (spellState.buffConfig?.durationType === 'rest') {
            if (spellState.buffConfig?.restType === 'short') {
              duration = 'until short rest';
            } else if (spellState.buffConfig?.restType === 'long') {
              duration = 'until long rest';
            }
          } else if (spellState.buffConfig?.durationType === 'permanent') {
            duration = 'permanent';
          } else if (duration && duration.toLowerCase().includes('medium rounds')) {
            // Legacy format - replace "medium rounds" with "3 minutes"
            duration = duration.replace(/medium rounds/i, '3 minutes');
          }

          // For progressive buffs, just show the stat name and value
          if (spellState.buffConfig?.isProgressive && spellState.buffConfig?.progressiveStages?.length > 0) {
            // Check if this stat is included in any progressive stage
            const isInProgressiveStages = spellState.buffConfig.progressiveStages.some(stage =>
              stage.statModifiers?.some(mod => mod.name === effectName)
            );

            if (isInProgressiveStages) {
              return `${effectName}: ${buffEffect}`;
            }
          }

          // Check if this effect has conditional triggers
          if (effect.conditionalTriggers && effect.conditionalTriggers.length > 0) {
            // Format the base effect
            let baseEffect = `${effectName}: ${buffEffect}${duration ? ` for ${duration}` : ''}`;

            // Add conditional effects
            effect.conditionalTriggers.forEach(trigger => {
              const triggerName = trigger.triggerName.replace(/_/g, ' ');
              const conditionalValue = `${trigger.magnitude}${trigger.magnitudeType === 'percentage' ? '%' : ''}`;

              // Format parameters for display
              let paramText = '';
              if (trigger.parameters) {
                const params = Object.entries(trigger.parameters)
                  .map(([key, value]) => {
                    // Format the parameter key and value
                    const formattedKey = key.replace(/_/g, ' ');
                    let formattedValue = value;

                    // Special formatting for certain parameter types
                    if (key === 'threshold_value' && trigger.parameters.threshold_type === 'percentage') {
                      formattedValue = `${value}%`;
                    } else if (typeof value === 'boolean') {
                      formattedValue = value ? 'Yes' : 'No';
                    }

                    return `${formattedKey}: ${formattedValue}`;
                  })
                  .join(', ');

                if (paramText) {
                  paramText = ` (${paramText})`;
                }
              }

              baseEffect += `\nWhen ${triggerName}${paramText}: ${conditionalValue} ${effect.effectName.replace(' Boost', '')} increase`;
            });

            return baseEffect;
          }

          // For non-progressive buffs or buffs not in progressive stages
          return `${effectName}: ${buffEffect}${duration ? ` for ${duration}` : ''}`;
        } else if (effect.effectType === 'debuff') {
          // Clean up the effect text
          let effectName = effect.effectName;
          let debuffEffect = effect.debuffEffect;
          let duration = effect.duration;

          // Format duration based on durationType
          if (spellState.debuffConfig?.durationType === 'rest') {
            if (spellState.debuffConfig?.restType === 'short') {
              duration = 'until short rest';
            } else if (spellState.debuffConfig?.restType === 'long') {
              duration = 'until long rest';
            }
          } else if (spellState.debuffConfig?.durationType === 'permanent') {
            duration = 'permanent';
          } else if (duration && duration.toLowerCase().includes('medium rounds')) {
            // Legacy format - replace "medium rounds" with "3 minutes"
            duration = duration.replace(/medium rounds/i, '3 minutes');
          }

          // For progressive debuffs, just show the stat name and value
          if (spellState.debuffConfig?.isProgressive && spellState.debuffConfig?.progressiveStages?.length > 0) {
            // Check if this stat is included in any progressive stage
            const isInProgressiveStages = spellState.debuffConfig.progressiveStages.some(stage =>
              stage.statPenalties?.some(mod => mod.name === effectName)
            );

            if (isInProgressiveStages) {
              return `${effectName}: ${debuffEffect}`;
            }
          }

          // Check if this effect has conditional triggers
          if (effect.conditionalTriggers && effect.conditionalTriggers.length > 0) {
            // Format the base effect
            let baseEffect = `${effectName}: ${debuffEffect}${duration ? ` for ${duration}` : ''}`;

            // Add conditional effects
            effect.conditionalTriggers.forEach(trigger => {
              const triggerName = trigger.triggerName.replace(/_/g, ' ');
              const conditionalValue = `${trigger.magnitude}${trigger.magnitudeType === 'percentage' ? '%' : ''}`;

              // Format parameters for display
              let paramText = '';
              if (trigger.parameters) {
                const params = Object.entries(trigger.parameters)
                  .map(([key, value]) => {
                    // Format the parameter key and value
                    const formattedKey = key.replace(/_/g, ' ');
                    let formattedValue = value;

                    // Special formatting for certain parameter types
                    if (key === 'threshold_value' && trigger.parameters.threshold_type === 'percentage') {
                      formattedValue = `${value}%`;
                    } else if (typeof value === 'boolean') {
                      formattedValue = value ? 'Yes' : 'No';
                    }

                    return `${formattedKey}: ${formattedValue}`;
                  })
                  .join(', ');

                if (paramText) {
                  paramText = ` (${paramText})`;
                }
              }

              baseEffect += `\nWhen ${triggerName}${paramText}: ${conditionalValue} ${effect.effectName.replace(' Reduction', '')} decrease`;
            });

            return baseEffect;
          }

          // For non-progressive debuffs or debuffs not in progressive stages
          return `${effectName}: ${debuffEffect}${duration ? ` for ${duration}` : ''}`;
        } else if (effect.effectType === 'utility') {
          return `${effect.effectName}: ${effect.utilityDescription || ''}`;
        } else if (effect.effectType === 'control') {
          return `${effect.effectName}: ${effect.controlEffect || ''}${effect.duration ? ` for ${effect.duration}` : ''}`;
        } else if (effect.effectType === 'summoning') {
          if (effect.effectName === 'Summoning') {
            return `${effect.summonName || 'Summoned Entity'}: ${effect.summonDetails || ''}${effect.duration ? ` for ${effect.duration}` : ''}`;
          } else {
            return `${effect.effectName}: ${effect.summonAbility || effect.summonDetails || ''}`;
          }
        } else if (effect.effectType === 'transformation') {
          if (effect.effectName === 'Transformation') {
            return `${effect.transformType || 'Form'}: ${effect.transformDetails || ''}${effect.duration ? ` for ${effect.duration}` : ''}`;
          } else if (effect.effectName === 'Granted Ability') {
            return `Ability: ${effect.abilityName || ''} - ${effect.abilityDescription || ''}`;
          } else if (effect.effectName === 'Stat Change') {
            return `${effect.statName || 'Stat'}: ${effect.statChange || ''}`;
          }
          return `${effect.effectName}: ${effect.transformDetails || ''}`;
        } else if (effect.effectType === 'purification') {
          if (effect.effectName === 'Purification') {
            return `${effect.purificationType || 'Dispel'}: ${effect.purificationDetails || ''}${effect.effectTypes ? ` (${effect.effectTypes})` : ''}`;
          } else if (effect.effectName === 'Specific Effect') {
            return `Purifies: ${effect.specificEffect || ''} - ${effect.specificEffectDescription || ''}`;
          }
          return `${effect.effectName}: ${effect.purificationDetails || ''}`;
        } else if (effect.effectType === 'restoration') {
          if (effect.effectName === 'Restoration') {
            return `${effect.resourceType || 'Resource'} Restoration: ${effect.restorationFormula || ''} - ${effect.restorationDetails || ''}`;
          } else if (effect.effectName === 'Secondary Effect') {
            return `${effect.secondaryEffect || ''}: ${effect.secondaryEffectDescription || ''}`;
          }
          return `${effect.effectName}: ${effect.restorationDetails || ''}`;
        } else {
          return effect.effectName;
        }
      }),

      // Other configurations
      tags: [
        // Include tags from typeConfig
        ...(spellState.typeConfig?.tags || []),
        // Add effect-based tags
        ...(spellState.effectTypes || []),
        // Include any tags directly on the spellState
        ...(spellState.tags || [])
      ].filter(Boolean), // Remove null values
      rarity: spellState.rarity || 'common',
      lastModified: new Date().toISOString(),

      // Include trap and trigger configurations
      spellType: spellState.spellType || 'ACTION',
      trapConfig: spellState.trapConfig,
      triggerConfig: hasActualTriggers ? spellState.triggerConfig : null,
      typeConfig: spellState.typeConfig,

      // Include mechanics configuration with state requirements and thresholds
      mechanicsConfig: {
        ...spellState.mechanicsConfig,
        stateRequirements: spellState.mechanicsConfig?.stateRequirements || [],
        stateOptions: {
          ...spellState.mechanicsConfig?.stateOptions,
          thresholds: spellState.mechanicsConfig?.stateOptions?.thresholds || []
        }
      },

      // Include effect-specific mechanics configurations
      effectMechanicsConfigs: spellState.effectMechanicsConfigs || {},

      // Include rollable table data
      rollableTable: spellState.rollableTable || null,

      // Format mechanics data for display
      mechanicsData: formatMechanicsData(spellState)
    };
  };

  // Format mechanics data for display
  const formatMechanicsData = (spellState) => {
    const mechanicsData = [];

    // Process effect-specific mechanics
    if (spellState.effectMechanicsConfigs && Object.keys(spellState.effectMechanicsConfigs).length > 0) {
      Object.entries(spellState.effectMechanicsConfigs).forEach(([effectId, config]) => {
        if (config && config.enabled) {
          // Find the effect name
          let effectName = 'Effect';
          if (effectId === 'effect_damage') effectName = 'Damage';
          else if (effectId === 'effect_healing') effectName = 'Healing';
          else if (effectId === 'effect_buff') effectName = 'Buff';
          else if (effectId === 'effect_debuff') effectName = 'Debuff';
          else if (effectId === 'effect_utility') effectName = 'Utility';
          else if (effectId === 'effect_control') effectName = 'Control';
          else if (effectId === 'effect_summoning') effectName = 'Summoning';
          else if (effectId === 'effect_transformation') effectName = 'Transformation';
          else if (effectId === 'effect_purification') effectName = 'Purification';
          else if (effectId === 'effect_restoration') effectName = 'Restoration';

          // Format based on mechanic system
          const system = config.system;

          // Create a mechanic entry
          const mechanicEntry = {
            effectId,
            effectName,
            system,
            type: config.type,
            details: []
          };

          // Add system-specific details
          if (system === 'COMBO_POINTS') {
            if (config.type === 'builder') {
              mechanicEntry.details.push(`Generates ${config.comboOptions?.generationAmount || 1} combo point(s)`);
            } else if (config.type === 'spender') {
              mechanicEntry.details.push(`Consumes ${config.thresholdValue || 1} combo point(s)`);
              mechanicEntry.details.push(`Consumption rule: ${config.comboOptions?.consumptionRule || 'all'}`);
            }
          } else if (system === 'CHORD_SYSTEM') {
            if (config.type === 'note') {
              mechanicEntry.details.push(`Plays a ${config.chordOptions?.noteType || 'tonic'} note`);
            } else if (config.type === 'chord') {
              // Add recipe details
              mechanicEntry.details.push(`Requires a specific chord recipe`);

              // Add recipe display if available
              if (config.chordOptions?.recipeDisplay && config.chordOptions.recipeDisplay.length > 0) {
                const recipeNames = config.chordOptions.recipeDisplay.map(chord => chord.name).join(', ');
                mechanicEntry.details.push(`Recipe: ${recipeNames}`);
              }

              // Add graduated effects details
              if (config.chordOptions?.graduatedEffects && Object.keys(config.chordOptions.graduatedEffects).length > 0) {
                mechanicEntry.details.push(`Has ${Object.keys(config.chordOptions.graduatedEffects).length} graduated effect levels:`);

                // Sort the graduated effects by level
                const sortedEffects = Object.entries(config.chordOptions.graduatedEffects)
                  .sort(([levelA], [levelB]) => parseInt(levelA) - parseInt(levelB));

                // Add each graduated effect level
                sortedEffects.forEach(([level, effect]) => {
                  const effectType = effect.effectType || 'damage';

                  // Format the effect description with clear separation for parsing in the UI
                  let effectDescription = `  Level ${level}: ${effectType.charAt(0).toUpperCase() + effectType.slice(1)}`;

                  // Add formula if available
                  if (effect.formula) {
                    effectDescription += ` - Formula: ${effect.formula}`;
                  }

                  // Add description if available - use a specific format for partial/full match descriptions
                  if (effect.description) {
                    // Check if this is a partial/full match description
                    if (effect.description.includes('Partial match') || effect.description.includes('Full match')) {
                      effectDescription += ` - ${effect.description}`;
                    } else {
                      effectDescription += ` - ${effect.description}`;
                    }
                  }

                  mechanicEntry.details.push(effectDescription);
                });
              }
            }
          } else if (system === 'STATE_REQUIREMENTS') {
            if (config.stateOptions?.thresholds && config.stateOptions.thresholds.length > 0) {
              config.stateOptions.thresholds.forEach(threshold => {
                mechanicEntry.details.push(`${threshold.resourceType || 'Health'} ${threshold.comparison || '<'} ${threshold.value || 30}${threshold.isPercentage ? '%' : ''}`);
              });
            }
          } else if (system === 'FORM_SYSTEM') {
            mechanicEntry.details.push(`Form: ${config.formOptions?.formType || 'bear_form'}`);
            if (config.formOptions?.requiresForm) {
              mechanicEntry.details.push(`Requires form to cast`);
            }
          } else if (system === 'PROC_SYSTEM') {
            mechanicEntry.details.push(`Proc chance: ${config.procOptions?.procChance || 15}%`);
            if (config.procOptions?.procEffect) {
              mechanicEntry.details.push(`Triggers: ${config.procOptions.procEffect}`);
            }
          } else if (system === 'TOXIC_SYSTEM') {
            if (config.type === 'toxic_applier') {
              const toxicTypes = config.toxicOptions?.selectedToxicTypes || {};
              if (Object.keys(toxicTypes).length > 0) {
                Object.entries(toxicTypes).forEach(([toxicId, count]) => {
                  mechanicEntry.details.push(`Applies ${count}x ${toxicId.replace(/_/g, ' ')}`);
                });
              }
            } else if (config.type === 'toxic_consumer') {
              mechanicEntry.details.push(`Requires specific toxic effects`);

              // Add toxic types to consume if available
              if (config.toxicOptions?.toxicTypesToConsume && Object.keys(config.toxicOptions.toxicTypesToConsume).length > 0) {
                const toxicTypes = Object.entries(config.toxicOptions.toxicTypesToConsume)
                  .filter(([_, value]) => value > 0)
                  .map(([type, count]) => `${count}x ${type.replace(/_/g, ' ')}`)
                  .join(', ');

                mechanicEntry.details.push(`Recipe: ${toxicTypes}`);
              }

              // Add graduated effects details
              if (config.toxicOptions?.toxicEffects && Array.isArray(config.toxicOptions.toxicEffects) && config.toxicOptions.toxicEffects.length > 0) {
                mechanicEntry.details.push(`Has ${config.toxicOptions.toxicEffects.length} consumption effect levels:`);

                // Add each toxic effect level
                config.toxicOptions.toxicEffects.forEach((effect, index) => {
                  // Format the effect description with clear separation for parsing in the UI
                  let effectDescription = `  Level ${index + 1}: `;

                  // Add effect type if available
                  const effectType = effect.effectType || 'damage';
                  if (effectType) {
                    effectDescription += `${effectType.charAt(0).toUpperCase() + effectType.slice(1)}`;
                  }

                  // Add formula if available - this should come before the description for consistent parsing
                  if (effect.formula) {
                    effectDescription += ` - Formula: ${effect.formula}`;
                  }

                  // Add required toxic count as part of the description for better display
                  let descriptionText = '';
                  if (effect.requiredToxicCount) {
                    descriptionText += `Requires ${effect.requiredToxicCount} toxic effects`;
                  }

                  // Add description if available
                  if (effect.description) {
                    if (descriptionText) {
                      descriptionText += ` - ${effect.description}`;
                    } else {
                      descriptionText = effect.description;
                    }
                  }

                  // Add the description text if we have any
                  if (descriptionText) {
                    effectDescription += ` - ${descriptionText}`;
                  }

                  mechanicEntry.details.push(effectDescription);
                });
              } else if (config.toxicOptions?.toxicEffects && typeof config.toxicOptions.toxicEffects === 'object' && Object.keys(config.toxicOptions.toxicEffects).length > 0) {
                // Handle the case where toxicEffects is an object instead of an array
                mechanicEntry.details.push(`Has ${Object.keys(config.toxicOptions.toxicEffects).length} consumption effect levels:`);

                // Convert object to array and sort by keys (assuming keys are numeric levels)
                const sortedEffects = Object.entries(config.toxicOptions.toxicEffects)
                  .sort(([levelA], [levelB]) => parseInt(levelA) - parseInt(levelB));

                // Add each toxic effect level
                sortedEffects.forEach(([level, effect], index) => {
                  // Format the effect description with clear separation for parsing in the UI
                  let effectDescription = `  Level ${level}: `;

                  // Add effect type if available
                  const effectType = effect.effectType || 'damage';
                  if (effectType) {
                    effectDescription += `${effectType.charAt(0).toUpperCase() + effectType.slice(1)}`;
                  }

                  // Add formula if available - this should come before the description for consistent parsing
                  if (effect.formula) {
                    effectDescription += ` - Formula: ${effect.formula}`;
                  }

                  // Add required toxic count as part of the description for better display
                  let descriptionText = '';
                  if (effect.requiredToxicCount) {
                    descriptionText += `Requires ${effect.requiredToxicCount} toxic effects`;
                  }

                  // Add description if available
                  if (effect.description) {
                    if (descriptionText) {
                      descriptionText += ` - ${effect.description}`;
                    } else {
                      descriptionText = effect.description;
                    }
                  }

                  // Add the description text if we have any
                  if (descriptionText) {
                    effectDescription += ` - ${descriptionText}`;
                  }

                  mechanicEntry.details.push(effectDescription);
                });
              }
            }
          }

          // Add the mechanic entry to the array
          mechanicsData.push(mechanicEntry);
        }
      });
    }

    // Process global mechanics
    if (spellState.mechanicsConfig) {
      // State requirements
      if (spellState.mechanicsConfig.stateRequirements && spellState.mechanicsConfig.stateRequirements.length > 0) {
        const stateEntry = {
          effectId: 'global_state',
          effectName: 'Global',
          system: 'STATE_REQUIREMENTS',
          type: 'state_requirement',
          details: []
        };

        spellState.mechanicsConfig.stateRequirements.forEach(req => {
          stateEntry.details.push(`${req.resourceType || 'Health'} ${req.comparison || '<'} ${req.value || 30}${req.isPercentage ? '%' : ''}`);
        });

        mechanicsData.push(stateEntry);
      }

      // Cards
      if (spellState.mechanicsConfig.cards) {
        const cardEntry = {
          effectId: 'global_cards',
          effectName: 'Global',
          system: 'CARD_SYSTEM',
          type: spellState.mechanicsConfig.cards.generatesCards ? 'card_generator' : 'card_consumer',
          details: []
        };

        if (spellState.mechanicsConfig.cards.generatesCards) {
          cardEntry.details.push(`Generates ${spellState.mechanicsConfig.cards.generatesCards} card(s)`);
        }
        if (spellState.mechanicsConfig.cards.requiredCards) {
          cardEntry.details.push(`Requires ${spellState.mechanicsConfig.cards.requiredCards} card(s)`);
        }
        if (spellState.mechanicsConfig.cards.cardTypes && spellState.mechanicsConfig.cards.cardTypes.length > 0) {
          cardEntry.details.push(`Specific card types: ${spellState.mechanicsConfig.cards.cardTypes.join(', ')}`);
        }

        mechanicsData.push(cardEntry);
      }

      // Combos
      if (spellState.mechanicsConfig.combos) {
        const comboEntry = {
          effectId: 'global_combos',
          effectName: 'Global',
          system: 'COMBO_POINTS',
          type: spellState.mechanicsConfig.combos.generatesPoints ? 'builder' : 'spender',
          details: []
        };

        if (spellState.mechanicsConfig.combos.generatesPoints) {
          comboEntry.details.push(`Generates ${spellState.mechanicsConfig.combos.generatesPoints} combo point(s)`);
        }
        if (spellState.mechanicsConfig.combos.requiredPoints) {
          comboEntry.details.push(`Requires ${spellState.mechanicsConfig.combos.requiredPoints} combo point(s)`);
        }

        mechanicsData.push(comboEntry);
      }

      // Coins
      if (spellState.mechanicsConfig.coins) {
        const coinEntry = {
          effectId: 'global_coins',
          effectName: 'Global',
          system: 'COIN_SYSTEM',
          type: 'coin_flipper',
          details: []
        };

        if (spellState.mechanicsConfig.coins.flipCount) {
          coinEntry.details.push(`Flips ${spellState.mechanicsConfig.coins.flipCount} coin(s)`);
        }
        if (spellState.mechanicsConfig.coins.effectOnHeads) {
          coinEntry.details.push(`On heads: ${spellState.mechanicsConfig.coins.effectOnHeads}`);
        }
        if (spellState.mechanicsConfig.coins.effectOnTails) {
          coinEntry.details.push(`On tails: ${spellState.mechanicsConfig.coins.effectOnTails}`);
        }

        mechanicsData.push(coinEntry);
      }
    }

    return mechanicsData;
  };

  // Format effects from spellWizardState to match our SpellPreviewPage expectations
  const formatEffects = () => {
    const effects = [];

    // Determine resolution method
    let resolution = 'DICE';
    if (spellState.damageConfig?.globalResolution) {
      resolution = spellState.damageConfig.globalResolution;
    } else if (spellState.healingConfig?.globalResolution) {
      resolution = spellState.healingConfig.globalResolution;
    } else if (spellState.damageConfig?.resolution) {
      resolution = spellState.damageConfig.resolution;
    } else if (spellState.healingConfig?.resolution) {
      resolution = spellState.healingConfig.resolution;
    }
    // Fallback to tags if no resolution is found
    else if (spellState.tags && spellState.tags.includes('card-based')) {
      resolution = 'CARDS';
    } else if (spellState.tags && spellState.tags.includes('coin-based')) {
      resolution = 'COINS';
    }

    // Process damage effects
    if (spellState.effectTypes?.includes('damage') && spellState.damageConfig) {
      // Only add the specific damage type that was selected
      const damageType = spellState.damageConfig.damageType || 'direct';

      if (damageType === 'dot') {
        // Damage over time
        // Check if this is a trigger-based DoT
        const isTriggerBased = spellState.damageConfig.dotTriggerType === 'trigger';

        // Get trigger details if this is a trigger-based DoT
        let triggerDetails = null;
        if (isTriggerBased && spellState.triggerConfig && spellState.triggerConfig.dotTrigger) {
          const trigger = spellState.triggerConfig.dotTrigger;
          const duration = `${spellState.damageConfig.dotConfig?.duration || 3} ${spellState.damageConfig.dotConfig?.tickFrequency || 'rounds'}`;

          // Format trigger details based on trigger type with more specific information
          if (trigger.triggerId === 'distance_traveled') {
            triggerDetails = `Deals damage each time target moves ${trigger.parameters?.distance || 5} ${trigger.parameters?.unit || 'feet'}`;
          } else if (trigger.triggerId === 'area_entered') {
            triggerDetails = `Deals damage each time target enters an area with radius ${trigger.parameters?.radius || 10} ${trigger.parameters?.unit || 'feet'}`;
          } else if (trigger.triggerId === 'proximity') {
            triggerDetails = `Deals damage each time target comes within ${trigger.parameters?.distance || 5} ${trigger.parameters?.unit || 'feet'} of another entity`;
          } else if (trigger.triggerId === 'movement_start') {
            triggerDetails = `Deals damage each time target starts moving`;
          } else if (trigger.triggerId === 'movement_stop') {
            triggerDetails = `Deals damage each time target stops moving`;
          } else if (trigger.triggerId === 'dot_trigger') {
            // Generic DoT trigger
            triggerDetails = `Deals damage each time the trigger condition is met`;
          }
        }

        effects.push({
          effectType: 'damage',
          effectName: isTriggerBased ? 'Trigger-Based Damage over Time' : 'Damage over Time',
          damageType: spellState.damageConfig.elementType || 'force',
          damageAmount: spellState.damageConfig.dotConfig?.dotFormula ||
                       spellState.damageConfig.dotFormula ||
                       spellState.damageConfig.formula ||
                       spellState.effectResolutions?.damage?.config?.formula || '1d4',
          duration: `${spellState.damageConfig.dotConfig?.duration || 3} ${spellState.damageConfig.dotConfig?.tickFrequency || 'rounds'}`,
          triggerBased: isTriggerBased,
          triggerDescription: isTriggerBased ? 'Activates when trigger condition is met' : null,
          triggerDetails: triggerDetails
        });
      } else {
        // Direct damage
        // For all spells, store the formula in the damage amount for display in the header
        let damageAmount = '';

        if (resolution === 'COINS' && spellState.coinConfig) {
          const flipCount = spellState.coinConfig.flipCount || 5;
          const formula = spellState.coinConfig.formula || 'HEADS_COUNT * 8 + (ALL_HEADS ? 15 : 0)';
          damageAmount = `Flip ${flipCount}: ${formatFormulaToPlainEnglish(formula, 'damage')}`;
        } else if (resolution === 'CARDS' && spellState.cardConfig) {
          const drawCount = spellState.cardConfig.drawCount || 3;
          const formula = spellState.cardConfig.formula || 'CARD_VALUE + FACE_CARD_COUNT * 5';
          damageAmount = `Draw ${drawCount}: ${formatFormulaToPlainEnglish(formula, 'damage')}`;
        } else {
          damageAmount = spellState.damageConfig.formula ||
                        spellState.effectResolutions?.damage?.config?.formula ||
                        spellState.damageConfig.diceNotation || '1d6';
        }

        effects.push({
          effectType: 'damage',
          effectName: 'Damage',
          damageType: spellState.typeConfig?.school || spellState.damageConfig.elementType || 'force',
          damageAmount: damageAmount,
        });
      }

      // Add DoT effects if hasDotEffect is true or if explicitly configured
      if (damageType !== 'dot' &&
          (spellState.damageConfig.hasDotEffect === true || spellState.damageConfig.includeDotEffect === true) &&
          (spellState.damageConfig.dotFormula || (spellState.damageConfig.dotConfig && Object.keys(spellState.damageConfig.dotConfig).length > 0))) {

        // Check if this is a trigger-based DoT
        const isTriggerBased = spellState.damageConfig.dotTriggerType === 'trigger';

        // Get trigger details if this is a trigger-based DoT
        let triggerDetails = null;
        if (isTriggerBased && spellState.triggerConfig && spellState.triggerConfig.dotTrigger) {
          const trigger = spellState.triggerConfig.dotTrigger;
          const duration = `${spellState.damageConfig.dotConfig?.duration || 3} ${spellState.damageConfig.dotConfig?.tickFrequency || 'rounds'}`;

          // Format trigger details based on trigger type with more specific information
          if (trigger.triggerId === 'distance_traveled') {
            triggerDetails = `Deals damage each time target moves ${trigger.parameters?.distance || 5} ${trigger.parameters?.unit || 'feet'}`;
          } else if (trigger.triggerId === 'area_entered') {
            triggerDetails = `Deals damage each time target enters an area with radius ${trigger.parameters?.radius || 10} ${trigger.parameters?.unit || 'feet'}`;
          } else if (trigger.triggerId === 'proximity') {
            triggerDetails = `Deals damage each time target comes within ${trigger.parameters?.distance || 5} ${trigger.parameters?.unit || 'feet'} of another entity`;
          } else if (trigger.triggerId === 'movement_start') {
            triggerDetails = `Deals damage each time target starts moving`;
          } else if (trigger.triggerId === 'movement_stop') {
            triggerDetails = `Deals damage each time target stops moving`;
          } else if (trigger.triggerId === 'dot_trigger') {
            // Generic DoT trigger
            triggerDetails = `Deals damage each time the trigger condition is met`;
          }
        }

        // Create the DoT effect object
        const dotEffect = {
          effectType: 'damage',
          effectName: isTriggerBased ? 'Trigger-Based Damage over Time' : 'Damage over Time',
          damageType: spellState.damageConfig.elementType || 'force',
          damageAmount: spellState.damageConfig.dotConfig?.dotFormula || spellState.damageConfig.dotFormula || '1d4',
          duration: `${spellState.damageConfig.dotConfig?.duration || 3} ${spellState.damageConfig.dotConfig?.tickFrequency || 'rounds'}`,
          scalingType: spellState.damageConfig.dotScalingType || 'flat',
          triggerBased: isTriggerBased,
          triggerDescription: isTriggerBased ? 'Activates when trigger condition is met' : null,
          triggerDetails: triggerDetails
        };

        // Add progressive stages with spell effects if present
        if (spellState.damageConfig.dotProgressiveStages && spellState.damageConfig.dotProgressiveStages.length > 0) {
          dotEffect.progressiveStages = spellState.damageConfig.dotProgressiveStages.map(stage => ({
            triggerAt: stage.triggerAt,
            formula: stage.formula,
            description: stage.description,
            spellEffect: stage.spellEffect
          }));
        }

        effects.push(dotEffect);
      }
    }

    // Process healing effects - only if healing is explicitly enabled in effectTypes
    if (spellState.effectTypes?.includes('healing') && spellState.healingConfig) {
      // Only add the specific healing type that was selected
      const healingType = spellState.healingConfig.healingType || 'direct';

      if (healingType === 'direct') {
        // Direct healing
        // For all spells, store the formula in the heal amount for display in the header
        let healAmount = '';

        if (resolution === 'COINS') {
          const coinConfig = spellState.healingConfig.coinConfig || {
            flipCount: 5,
            formula: 'HEADS_COUNT * 7 + (LONGEST_STREAK > 2 ? LONGEST_STREAK * 5 : 0)'
          };
          const flipCount = coinConfig.flipCount || 5;
          healAmount = `Flip ${flipCount}: ${formatFormulaToPlainEnglish(coinConfig.formula, 'healing')}`;
        } else if (resolution === 'CARDS') {
          const cardConfig = spellState.healingConfig.cardConfig || {
            drawCount: 3,
            formula: 'CARD_VALUE + FACE_CARD_COUNT * 3'
          };
          const drawCount = cardConfig.drawCount || 3;
          healAmount = `Draw ${drawCount}: ${formatFormulaToPlainEnglish(cardConfig.formula, 'healing')}`;
        } else {
          healAmount = spellState.healingConfig.formula ||
                      spellState.effectResolutions?.healing?.config?.formula ||
                      spellState.healingConfig.diceNotation || '1d6';
        }

        effects.push({
          effectType: 'healing',
          effectName: 'Healing',
          healAmount: healAmount,
        });
      } else if (healingType === 'hot') {
        // Healing over time
        // For all spells, store the formula in the heal amount for display in the header
        let healAmount = '';

        // Check if this is a trigger-based HoT
        const isTriggerBased = spellState.healingConfig.hotTriggerType === 'trigger';

        if (resolution === 'COINS') {
          const coinConfig = spellState.healingConfig.hotCoinConfig || spellState.healingConfig.coinConfig || {
            flipCount: 5,
            formula: 'HEADS_COUNT * 7 + (LONGEST_STREAK > 2 ? LONGEST_STREAK * 5 : 0)'
          };
          const flipCount = coinConfig.flipCount || 5;
          healAmount = `Flip ${flipCount}: ${formatFormulaToPlainEnglish(coinConfig.formula, 'healing')}`;
        } else if (resolution === 'CARDS') {
          const cardConfig = spellState.healingConfig.hotCardConfig || spellState.healingConfig.cardConfig || {
            drawCount: 3,
            formula: 'CARD_VALUE + FACE_CARD_COUNT * 3'
          };
          const drawCount = cardConfig.drawCount || 3;
          healAmount = `Draw ${drawCount}: ${formatFormulaToPlainEnglish(cardConfig.formula, 'healing')}`;
        } else {
          healAmount = spellState.healingConfig.hotFormula ||
                      spellState.healingConfig.formula ||
                      spellState.effectResolutions?.healing?.config?.formula || '1d4';
        }

        // Get trigger details if this is a trigger-based HoT
        let triggerDetails = null;
        if (isTriggerBased && spellState.triggerConfig && spellState.triggerConfig.hotTrigger) {
          const trigger = spellState.triggerConfig.hotTrigger;
          const duration = `${spellState.healingConfig.hotDuration || 3} ${spellState.healingConfig.hotTickType || 'rounds'}`;

          // Format trigger details based on trigger type with more specific information
          if (trigger.triggerId === 'distance_traveled') {
            triggerDetails = `Heals each time target moves ${trigger.parameters?.distance || 5} ${trigger.parameters?.unit || 'feet'}`;
          } else if (trigger.triggerId === 'area_entered') {
            triggerDetails = `Heals each time target enters an area with radius ${trigger.parameters?.radius || 10} ${trigger.parameters?.unit || 'feet'}`;
          } else if (trigger.triggerId === 'proximity') {
            triggerDetails = `Heals each time target comes within ${trigger.parameters?.distance || 5} ${trigger.parameters?.unit || 'feet'} of another entity`;
          } else if (trigger.triggerId === 'movement_start') {
            triggerDetails = `Heals each time target starts moving`;
          } else if (trigger.triggerId === 'movement_stop') {
            triggerDetails = `Heals each time target stops moving`;
          } else if (trigger.triggerId === 'hot_trigger') {
            // Generic HoT trigger
            triggerDetails = `Heals each time the trigger condition is met`;
          }
        }

        // Create the HoT effect object
        const hotEffect = {
          effectType: 'healing',
          effectName: isTriggerBased ? 'Trigger-Based Healing over Time' : 'Healing over Time',
          healAmount: healAmount,
          duration: `${spellState.healingConfig.hotDuration || 3} ${spellState.healingConfig.hotTickType || 'rounds'}`,
          scalingType: spellState.healingConfig.hotScalingType || 'flat',
          triggerBased: isTriggerBased,
          triggerDescription: isTriggerBased ? 'Activates when trigger condition is met' : null,
          triggerDetails: triggerDetails
        };

        // Add progressive stages with spell effects if present
        if (spellState.healingConfig.hotProgressiveStages && spellState.healingConfig.hotProgressiveStages.length > 0) {
          hotEffect.progressiveStages = spellState.healingConfig.hotProgressiveStages.map(stage => ({
            triggerAt: stage.triggerAt,
            formula: stage.formula,
            description: stage.description,
            spellEffect: stage.spellEffect
          }));
        }

        effects.push(hotEffect);
      } else if (healingType === 'shield') {
        // Shield
        // For all spells, store the formula in the heal amount for display in the header
        let healAmount = '';

        if (resolution === 'COINS') {
          const coinConfig = spellState.healingConfig.shieldCoinConfig || spellState.healingConfig.coinConfig || {
            flipCount: 5,
            formula: 'HEADS_COUNT * 10 + (ALL_HEADS ? 20 : 0)'
          };
          const flipCount = coinConfig.flipCount || 5;
          healAmount = `Flip ${flipCount}: ${formatFormulaToPlainEnglish(coinConfig.formula, 'healing')}`;
        } else if (resolution === 'CARDS') {
          const cardConfig = spellState.healingConfig.shieldCardConfig || spellState.healingConfig.cardConfig || {
            drawCount: 3,
            formula: 'CARD_VALUE + FACE_CARD_COUNT * 5'
          };
          const drawCount = cardConfig.drawCount || 3;
          healAmount = `Draw ${drawCount}: ${formatFormulaToPlainEnglish(cardConfig.formula, 'healing')}`;
        } else {
          // Use the shield formula
          healAmount = spellState.healingConfig.shieldFormula ||
                      spellState.effectResolutions?.healing?.config?.shieldFormula || '2d6';
        }

        effects.push({
          effectType: 'healing',
          effectName: 'Shield',
          healAmount: healAmount,
          duration: `${spellState.healingConfig.shieldDuration || 3} rounds`,
          damageTypes: spellState.healingConfig.shieldDamageTypes || 'all',
          breakBehavior: spellState.healingConfig.shieldBreakBehavior || 'fade',
          breakEffect: spellState.healingConfig.shieldBreakEffect ?
            LIBRARY_SPELLS.find(s => s.id === spellState.healingConfig.shieldBreakEffect)?.name || 'Unknown Spell' : null,
          expireEffect: spellState.healingConfig.shieldExpireEffect ?
            LIBRARY_SPELLS.find(s => s.id === spellState.healingConfig.shieldExpireEffect)?.name || 'Unknown Spell' : null
        });
      }

      // Add HoT effects if hasHotEffect is true or if explicitly configured
      // Skip adding HoT effects for channeled spells since they're already displayed in the channeling section
      const isChanneledSpell = spellState.spellType === 'channeled' || spellState.spellType === 'CHANNELED';
      const isChanneledHot = isChanneledSpell && spellState.healingConfig?.hotTriggerType === 'channeled';

      if (!isChanneledHot &&
          healingType !== 'hot' &&
          (spellState.healingConfig.hasHotEffect === true || spellState.healingConfig.includeHotEffect === true) &&
          (spellState.healingConfig.hotFormula || spellState.healingConfig.hotCoinConfig || spellState.healingConfig.hotCardConfig)) {
        // For all spells, store the formula in the heal amount for display in the header
        let healAmount = '';

        // Check if this is a trigger-based HoT
        const isTriggerBased = spellState.healingConfig.hotTriggerType === 'trigger';

        if (resolution === 'COINS' && spellState.healingConfig.hotCoinConfig) {
          const flipCount = spellState.healingConfig.hotCoinConfig.flipCount || 5;
          const formula = spellState.healingConfig.hotCoinConfig.formula || 'HEADS_COUNT * 7 + (LONGEST_STREAK > 2 ? LONGEST_STREAK * 5 : 0)';
          healAmount = `Flip ${flipCount}: ${formatFormulaToPlainEnglish(formula, 'healing')}`;
        } else if (resolution === 'CARDS' && spellState.healingConfig.hotCardConfig) {
          const drawCount = spellState.healingConfig.hotCardConfig.drawCount || 3;
          const formula = spellState.healingConfig.hotCardConfig.formula || 'CARD_VALUE + FACE_CARD_COUNT * 3';
          healAmount = `Draw ${drawCount}: ${formatFormulaToPlainEnglish(formula, 'healing')}`;
        } else {
          healAmount = spellState.healingConfig.hotFormula || '1d4';
        }

        // Get trigger details if this is a trigger-based HoT
        let triggerDetails = null;
        if (isTriggerBased && spellState.triggerConfig && spellState.triggerConfig.hotTrigger) {
          const trigger = spellState.triggerConfig.hotTrigger;
          const duration = `${spellState.healingConfig.hotDuration || 3} ${spellState.healingConfig.hotTickType || 'rounds'}`;

          // Format trigger details based on trigger type with more specific information
          if (trigger.triggerId === 'distance_traveled') {
            triggerDetails = `Heals each time target moves ${trigger.parameters?.distance || 5} ${trigger.parameters?.unit || 'feet'}`;
          } else if (trigger.triggerId === 'area_entered') {
            triggerDetails = `Heals each time target enters an area with radius ${trigger.parameters?.radius || 10} ${trigger.parameters?.unit || 'feet'}`;
          } else if (trigger.triggerId === 'proximity') {
            triggerDetails = `Heals each time target comes within ${trigger.parameters?.distance || 5} ${trigger.parameters?.unit || 'feet'} of another entity`;
          } else if (trigger.triggerId === 'movement_start') {
            triggerDetails = `Heals each time target starts moving`;
          } else if (trigger.triggerId === 'movement_stop') {
            triggerDetails = `Heals each time target stops moving`;
          } else if (trigger.triggerId === 'hot_trigger') {
            // Generic HoT trigger
            triggerDetails = `Heals each time the trigger condition is met`;
          }
        }

        effects.push({
          effectType: 'healing',
          effectName: isTriggerBased ? 'Trigger-Based Healing over Time' : 'Healing over Time',
          healAmount: healAmount,
          duration: `${spellState.healingConfig.hotDuration || 3} ${spellState.healingConfig.hotTickType || 'rounds'}`,
          triggerBased: isTriggerBased,
          triggerDescription: isTriggerBased ? 'Activates when trigger condition is met' : null,
          triggerDetails: triggerDetails
        });
      }

      if (healingType !== 'shield' &&
          (spellState.healingConfig.hasShieldEffect === true || spellState.healingConfig.includeShieldEffect === true) &&
          (spellState.healingConfig.shieldFormula || spellState.healingConfig.shieldCoinConfig || spellState.healingConfig.shieldCardConfig)) {
        // For all spells, store the formula in the heal amount for display in the header
        let healAmount = '';

        if (resolution === 'COINS' && spellState.healingConfig.shieldCoinConfig) {
          const flipCount = spellState.healingConfig.shieldCoinConfig.flipCount || 5;
          const formula = spellState.healingConfig.shieldCoinConfig.formula || 'HEADS_COUNT * 10 + (ALL_HEADS ? 20 : 0)';
          healAmount = `Flip ${flipCount}: ${formatFormulaToPlainEnglish(formula, 'healing')}`;
        } else if (resolution === 'CARDS' && spellState.healingConfig.shieldCardConfig) {
          const drawCount = spellState.healingConfig.shieldCardConfig.drawCount || 3;
          const formula = spellState.healingConfig.shieldCardConfig.formula || 'CARD_VALUE + FACE_CARD_COUNT * 5';
          healAmount = `Draw ${drawCount}: ${formatFormulaToPlainEnglish(formula, 'healing')}`;
        } else {
          // Use the shield formula
          healAmount = spellState.healingConfig.shieldFormula || '2d6';
        }

        effects.push({
          effectType: 'healing',
          effectName: 'Shield',
          healAmount: healAmount,
          duration: `${spellState.healingConfig.shieldDuration || 3} rounds`
        });
      }
    }

    // Process buff effects
    if (spellState.effectTypes?.includes('buff') && spellState.buffConfig) {
      // Add main buff effect
      const buffEffect = {
        effectType: 'buff',
        effectName: 'Buff',
        buffEffect: spellState.buffConfig.buffType || 'Enhances target',
      };

      // Set duration based on durationType
      if (spellState.buffConfig.durationType === 'rest') {
        if (spellState.buffConfig.restType === 'short') {
          buffEffect.duration = 'until short rest';
        } else if (spellState.buffConfig.restType === 'long') {
          buffEffect.duration = 'until long rest';
        }
      } else if (spellState.buffConfig.durationType === 'permanent') {
        buffEffect.duration = 'permanent';
      } else if (spellState.buffConfig.durationType === 'time') {
        // Time-based duration (minutes, hours, etc.)
        buffEffect.duration = `${spellState.buffConfig.durationValue || spellState.buffConfig.duration || 3} ${spellState.buffConfig.durationUnit || 'minutes'}`;
      } else {
        // Default to turns/rounds
        buffEffect.duration = `${spellState.buffConfig.durationValue || spellState.buffConfig.duration || 3} ${spellState.buffConfig.durationUnit || 'rounds'}`;
      }

      // Add progressive stages with spell effects if present
      if (spellState.buffConfig.progressiveStages && spellState.buffConfig.progressiveStages.length > 0) {
        buffEffect.progressiveStages = spellState.buffConfig.progressiveStages.map(stage => {
          // Create a new array of stat modifiers with only the necessary properties
          const formattedStatModifiers = stage.statModifiers ? stage.statModifiers.map(modifier => ({
            name: modifier.name || '',
            magnitude: modifier.magnitude || 0,
            magnitudeType: modifier.magnitudeType || 'flat'
          })) : [];

          return {
            triggerAt: stage.triggerAt,
            statModifiers: formattedStatModifiers,
            spellEffect: stage.spellEffect
          };
        });
      }

      effects.push(buffEffect);

      // Add stat modifiers if present
      if (spellState.buffConfig.statModifiers && spellState.buffConfig.statModifiers.length > 0) {
        spellState.buffConfig.statModifiers.forEach(modifier => {
          // Create buff effect with extracted properties (not the whole object)
          const statBuffEffect = {
            effectType: 'buff',
            effectName: `${modifier.name || 'Stat'} Boost`,
            buffEffect: `${modifier.magnitude || 2}${modifier.magnitudeType === 'percentage' ? '%' : ''} ${modifier.name || 'stat'} increase`,
            // Add conditional trigger information
            conditionalTriggers: [],
          };

          // Check if there are conditional effects for this stat
          if (spellState.triggerConfig?.conditionalEffects?.buff) {
            const conditionalSettings = spellState.triggerConfig.conditionalEffects.buff.conditionalSettings || {};

            // Loop through all trigger conditions
            Object.entries(conditionalSettings).forEach(([triggerId, settings]) => {
              // Skip default settings
              if (triggerId === 'default') return;

              // Check if this trigger has settings for this stat
              const statBonuses = settings.statBonuses || [];
              const conditionalStat = statBonuses.find(s => s.id === modifier.id);

              if (conditionalStat) {
                // Find the trigger details
                let trigger = null;

                // Check global triggers first
                if (spellState.triggerConfig.global?.compoundTriggers) {
                  trigger = spellState.triggerConfig.global.compoundTriggers.find(t => t.id === triggerId);
                }

                // If not found in global triggers, check effect-specific triggers
                if (!trigger && spellState.triggerConfig.effectTriggers?.buff?.compoundTriggers) {
                  trigger = spellState.triggerConfig.effectTriggers.buff.compoundTriggers.find(t => t.id === triggerId);
                }

                if (trigger) {
                  // Add to conditional triggers
                  statBuffEffect.conditionalTriggers.push({
                    triggerId,
                    triggerName: trigger.name || trigger.id,
                    magnitude: conditionalStat.magnitude,
                    magnitudeType: conditionalStat.magnitudeType,
                    parameters: trigger.parameters
                  });
                }
              }
            });
          }

          // Set duration based on durationType
          if (spellState.buffConfig.durationType === 'rest') {
            if (spellState.buffConfig.restType === 'short') {
              statBuffEffect.duration = 'until short rest';
            } else if (spellState.buffConfig.restType === 'long') {
              statBuffEffect.duration = 'until long rest';
            }
          } else if (spellState.buffConfig.durationType === 'permanent') {
            statBuffEffect.duration = 'permanent';
          } else if (spellState.buffConfig.durationType === 'time') {
            // Time-based duration (minutes, hours, etc.)
            statBuffEffect.duration = `${spellState.buffConfig.durationValue || spellState.buffConfig.duration || 3} ${spellState.buffConfig.durationUnit || 'minutes'}`;
          } else {
            // Default to turns/rounds
            statBuffEffect.duration = `${spellState.buffConfig.durationValue || spellState.buffConfig.duration || 3} ${spellState.buffConfig.durationUnit || 'rounds'}`;
          }

          effects.push(statBuffEffect);
        });
      }

      // Add status effects if present
      if (spellState.buffConfig.statusEffects && spellState.buffConfig.statusEffects.length > 0) {
        spellState.buffConfig.statusEffects.forEach(effect => {
          // Create status effect
          const statusEffect = {
            effectType: 'buff',
            effectName: effect.name || 'Status Effect',
            buffEffect: effect.description || 'Applies a status effect',
          };

          // Set duration based on durationType
          if (spellState.buffConfig.durationType === 'rest') {
            if (spellState.buffConfig.restType === 'short') {
              statusEffect.duration = 'until short rest';
            } else if (spellState.buffConfig.restType === 'long') {
              statusEffect.duration = 'until long rest';
            }
          } else if (spellState.buffConfig.durationType === 'permanent') {
            statusEffect.duration = 'permanent';
          } else if (spellState.buffConfig.durationType === 'time') {
            // Time-based duration (minutes, hours, etc.)
            statusEffect.duration = `${spellState.buffConfig.durationValue || spellState.buffConfig.duration || 3} ${spellState.buffConfig.durationUnit || 'minutes'}`;
          } else {
            // Default to turns/rounds
            statusEffect.duration = `${spellState.buffConfig.durationValue || spellState.buffConfig.duration || 3} ${spellState.buffConfig.durationUnit || 'rounds'}`;
          }

          effects.push(statusEffect);
        });
      }
    }

    // Process debuff effects
    if (spellState.effectTypes?.includes('debuff') && spellState.debuffConfig) {
      // Add main debuff effect
      const debuffEffect = {
        effectType: 'debuff',
        effectName: 'Debuff',
        debuffEffect: spellState.debuffConfig.debuffType || 'Weakens target',
        // Add saving throw information
        savingThrow: spellState.debuffConfig.savingThrow || 'constitution',
        difficultyClass: spellState.debuffConfig.difficultyClass || 15,
      };

      // Set duration based on durationType
      if (spellState.debuffConfig.durationType === 'rest') {
        if (spellState.debuffConfig.restType === 'short') {
          debuffEffect.duration = 'until short rest';
        } else if (spellState.debuffConfig.restType === 'long') {
          debuffEffect.duration = 'until long rest';
        }
      } else if (spellState.debuffConfig.durationType === 'permanent') {
        debuffEffect.duration = 'permanent';
      } else if (spellState.debuffConfig.durationType === 'time') {
        // Time-based duration (minutes, hours, etc.)
        debuffEffect.duration = `${spellState.debuffConfig.durationValue || spellState.debuffConfig.duration || 3} ${spellState.debuffConfig.durationUnit || 'minutes'}`;
      } else {
        // Default to turns/rounds
        debuffEffect.duration = `${spellState.debuffConfig.durationValue || spellState.debuffConfig.duration || 3} ${spellState.debuffConfig.durationUnit || 'rounds'}`;
      }

      // Add progressive stages with spell effects if present
      if (spellState.debuffConfig.progressiveStages && spellState.debuffConfig.progressiveStages.length > 0) {
        debuffEffect.progressiveStages = spellState.debuffConfig.progressiveStages.map(stage => {
          // Create a new array of stat penalties with only the necessary properties
          const formattedStatPenalties = stage.statPenalties ? stage.statPenalties.map(penalty => ({
            name: penalty.name || '',
            magnitude: penalty.magnitude || 0,
            magnitudeType: penalty.magnitudeType || 'flat'
          })) : [];

          return {
            triggerAt: stage.triggerAt,
            statPenalties: formattedStatPenalties,
            spellEffect: stage.spellEffect,
            // Add saving throw information
            savingThrow: stage.savingThrow || spellState.debuffConfig.savingThrow || 'constitution',
            difficultyClass: stage.difficultyClass || spellState.debuffConfig.difficultyClass || 15
          };
        });
      }

      effects.push(debuffEffect);

      // Add stat penalties if present
      if (spellState.debuffConfig.statPenalties && spellState.debuffConfig.statPenalties.length > 0) {
        spellState.debuffConfig.statPenalties.forEach(penalty => {
          // Create debuff effect with extracted properties (not the whole object)
          const statDebuffEffect = {
            effectType: 'debuff',
            effectName: `${penalty.name || 'Stat'} Reduction`,
            debuffEffect: `${penalty.magnitude || 2}${penalty.magnitudeType === 'percentage' ? '%' : ''} ${penalty.name || 'stat'} decrease`,
            // Add saving throw information
            savingThrow: spellState.debuffConfig.savingThrow || 'constitution',
            difficultyClass: spellState.debuffConfig.difficultyClass || 15,
            // Add conditional trigger information
            conditionalTriggers: [],
          };

          // Check if there are conditional effects for this stat
          if (spellState.triggerConfig?.conditionalEffects?.debuff) {
            const conditionalSettings = spellState.triggerConfig.conditionalEffects.debuff.conditionalSettings || {};

            // Loop through all trigger conditions
            Object.entries(conditionalSettings).forEach(([triggerId, settings]) => {
              // Skip default settings
              if (triggerId === 'default') return;

              // Check if this trigger has settings for this stat
              const statPenalties = settings.statPenalties || [];
              const conditionalStat = statPenalties.find(s => s.id === penalty.id);

              if (conditionalStat) {
                // Find the trigger details
                let trigger = null;

                // Check global triggers first
                if (spellState.triggerConfig.global?.compoundTriggers) {
                  trigger = spellState.triggerConfig.global.compoundTriggers.find(t => t.id === triggerId);
                }

                // If not found in global triggers, check effect-specific triggers
                if (!trigger && spellState.triggerConfig.effectTriggers?.debuff?.compoundTriggers) {
                  trigger = spellState.triggerConfig.effectTriggers.debuff.compoundTriggers.find(t => t.id === triggerId);
                }

                if (trigger) {
                  // Add to conditional triggers
                  statDebuffEffect.conditionalTriggers.push({
                    triggerId,
                    triggerName: trigger.name || trigger.id,
                    magnitude: conditionalStat.magnitude,
                    magnitudeType: conditionalStat.magnitudeType,
                    parameters: trigger.parameters
                  });
                }
              }
            });
          }

          // Set duration based on durationType
          if (spellState.debuffConfig.durationType === 'rest') {
            if (spellState.debuffConfig.restType === 'short') {
              statDebuffEffect.duration = 'until short rest';
            } else if (spellState.debuffConfig.restType === 'long') {
              statDebuffEffect.duration = 'until long rest';
            }
          } else if (spellState.debuffConfig.durationType === 'permanent') {
            statDebuffEffect.duration = 'permanent';
          } else {
            // Default to turns/rounds
            statDebuffEffect.duration = `${spellState.debuffConfig.durationValue || spellState.debuffConfig.duration || 3} ${spellState.debuffConfig.durationUnit || 'rounds'}`;
          }

          effects.push(statDebuffEffect);
        });
      }

      // Add status effects if present
      if (spellState.debuffConfig.statusEffects && spellState.debuffConfig.statusEffects.length > 0) {
        spellState.debuffConfig.statusEffects.forEach(effect => {
          // Create debuff status effect
          const debuffStatusEffect = {
            effectType: 'debuff',
            effectName: effect.name || 'Status Effect',
            debuffEffect: effect.description || 'Applies a negative status effect',
          };

          // Set duration based on durationType
          if (spellState.debuffConfig.durationType === 'rest') {
            if (spellState.debuffConfig.restType === 'short') {
              debuffStatusEffect.duration = 'until short rest';
            } else if (spellState.debuffConfig.restType === 'long') {
              debuffStatusEffect.duration = 'until long rest';
            }
          } else if (spellState.debuffConfig.durationType === 'permanent') {
            debuffStatusEffect.duration = 'permanent';
          } else if (spellState.debuffConfig.durationType === 'time') {
            // Time-based duration (minutes, hours, etc.)
            debuffStatusEffect.duration = `${spellState.debuffConfig.durationValue || spellState.debuffConfig.duration || 3} ${spellState.debuffConfig.durationUnit || 'minutes'}`;
          } else {
            // Default to turns/rounds
            debuffStatusEffect.duration = `${spellState.debuffConfig.durationValue || spellState.debuffConfig.duration || 3} ${spellState.debuffConfig.durationUnit || 'rounds'}`;
          }

          effects.push(debuffStatusEffect);
        });
      }
    }

    // Process utility effects
    if (spellState.effectTypes?.includes('utility') && spellState.utilityConfig) {
      // Add main utility effect
      effects.push({
        effectType: 'utility',
        effectName: 'Utility',
        utilityDescription: spellState.utilityConfig.description || 'Provides utility',
      });

      // Add utility type if present
      if (spellState.utilityConfig.utilityType) {
        effects.push({
          effectType: 'utility',
          effectName: spellState.utilityConfig.utilityType || 'Utility Effect',
          utilityDescription: spellState.utilityConfig.typeDescription || `Provides ${spellState.utilityConfig.utilityType} utility`,
        });
      }

      // Add utility effects if present
      if (spellState.utilityConfig.utilityEffects && spellState.utilityConfig.utilityEffects.length > 0) {
        spellState.utilityConfig.utilityEffects.forEach(effect => {
          effects.push({
            effectType: 'utility',
            effectName: effect.name || 'Utility Effect',
            utilityDescription: effect.description || 'Provides a utility effect',
          });
        });
      }

      // Add environmental effects if present
      if (spellState.utilityConfig.environmentalEffects && spellState.utilityConfig.environmentalEffects.length > 0) {
        spellState.utilityConfig.environmentalEffects.forEach(effect => {
          effects.push({
            effectType: 'utility',
            effectName: 'Environmental Effect',
            utilityDescription: effect.description || 'Affects the environment',
          });
        });
      }
    }

    // Process control effects
    if (spellState.effectTypes?.includes('control') && spellState.controlConfig) {
      // Add main control effect if a control type is selected
      if (spellState.controlConfig.controlType) {
        // Format the control type name for display
        const controlTypeName = spellState.controlConfig.controlType.split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');

        effects.push({
          effectType: 'control',
          effectName: 'Control',
          controlEffect: controlTypeName,
          duration: spellState.controlConfig.duration !== null ?
            `${spellState.controlConfig.duration || 3} ${spellState.controlConfig.durationUnit || 'rounds'}` : '',
          savingThrow: spellState.controlConfig.savingThrow ?
            spellState.controlConfig.savingThrowType : '',
          difficultyClass: spellState.controlConfig.difficultyClass || 15,
          distance: spellState.controlConfig.distance || '',
          concentration: spellState.controlConfig.concentration || false,
          description: ''
        });
      }

      // Add specific control effects if present
      if (spellState.controlConfig.effects && spellState.controlConfig.effects.length > 0) {
        spellState.controlConfig.effects.forEach(effect => {
          effects.push({
            effectType: 'control',
            effectName: effect.name || 'Control Effect',
            controlEffect: effect.name || 'Controls target in some way',
            duration: effect.config?.instant ? 'Instant' :
              `${effect.config?.duration || 2} ${effect.config?.durationUnit || 'rounds'}`,
            savingThrow: effect.config?.savingThrow ? effect.config?.savingThrowType : '',
            difficultyClass: effect.config?.difficultyClass || 15,
            distance: effect.controlType === 'forced_movement' ? spellState.controlConfig.distance : '',
            concentration: effect.config?.concentration || false,
            description: effect.description || ''
          });
        });
      }

      // Add resource check information if present
      if (spellState.controlConfig.resourceCheck) {
        const resourceType = spellState.controlConfig.resourceType || 'Willpower';
        const checkType = spellState.controlConfig.checkType || 'save';
        const difficulty = spellState.controlConfig.difficulty || 'medium';

        effects.push({
          effectType: 'control',
          effectName: 'Resource Check',
          controlEffect: `${resourceType} Check`,
          duration: 'Immediate',
          savingThrow: resourceType,
          difficultyClass: difficulty === 'easy' ? 10 : difficulty === 'medium' ? 15 : 20,
          description: `Target must make a ${resourceType} ${checkType} (${difficulty} difficulty)`
        });
      }
    }

    // Process summoning effects
    if (spellState.effectTypes?.includes('summoning') && spellState.summoningConfig) {
      // Add main summoning effect
      const summonType = spellState.summoningConfig.summonType || 'creature';
      const summonName = spellState.summoningConfig.summonName || 'Summoned Entity';
      const duration = spellState.summoningConfig.duration || 'permanent';
      const durationValue = spellState.summoningConfig.durationValue || 10;
      const durationUnit = spellState.summoningConfig.durationUnit || 'minutes';

      // Format duration string
      let durationStr = '';
      if (duration === 'permanent') {
        durationStr = 'Permanent';
      } else if (duration === 'concentration') {
        durationStr = 'Concentration';
      } else {
        durationStr = `${durationValue} ${durationUnit}`;
      }

      effects.push({
        effectType: 'summoning',
        effectName: 'Summoning',
        summonType: summonType,
        summonName: summonName,
        duration: durationStr,
        controlType: spellState.summoningConfig.controlType || 'direct',
        summonDetails: spellState.summoningConfig.description || `Summons a ${summonType}`
      });

      // Add abilities if present
      if (spellState.summoningConfig.abilities && spellState.summoningConfig.abilities.length > 0) {
        spellState.summoningConfig.abilities.forEach(ability => {
          effects.push({
            effectType: 'summoning',
            effectName: 'Summon Ability',
            summonAbility: ability.name || 'Special Ability',
            summonAbilityDescription: ability.description || 'Grants a special ability',
          });
        });
      }
    }

    // Process transformation effects
    if (spellState.effectTypes?.includes('transformation') && spellState.transformationConfig) {
      // Add main transformation effect
      const transformType = spellState.transformationConfig.transformType || 'beast_form';
      const targetType = spellState.transformationConfig.targetType || 'self';
      const duration = spellState.transformationConfig.duration || 10;
      const durationUnit = spellState.transformationConfig.durationUnit || 'minutes';
      const concentration = spellState.transformationConfig.concentration || false;

      // Format transformation type for display
      const formattedType = transformType.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      effects.push({
        effectType: 'transformation',
        effectName: 'Transformation',
        transformType: formattedType,
        targetType: targetType,
        duration: `${duration} ${durationUnit}${concentration ? ' (Concentration)' : ''}`,
        transformDetails: spellState.transformationConfig.description || `Transforms into ${formattedType}`
      });

      // Add granted abilities if present
      if (spellState.transformationConfig.grantedAbilities && spellState.transformationConfig.grantedAbilities.length > 0) {
        spellState.transformationConfig.grantedAbilities.forEach(ability => {
          effects.push({
            effectType: 'transformation',
            effectName: 'Granted Ability',
            abilityName: ability.name || 'Special Ability',
            abilityDescription: ability.description || 'Grants a special ability',
          });
        });
      }

      // Add stat changes if present
      if (spellState.transformationConfig.statChanges && spellState.transformationConfig.statChanges.length > 0) {
        spellState.transformationConfig.statChanges.forEach(stat => {
          effects.push({
            effectType: 'transformation',
            effectName: 'Stat Change',
            statName: stat.name || 'Stat',
            statChange: `${stat.value > 0 ? '+' : ''}${stat.value} ${stat.name || 'to stat'}`,
          });
        });
      }
    }

    // Process purification effects
    if (spellState.effectTypes?.includes('purification') && spellState.purificationConfig) {
      // Add main purification effect
      const purificationType = spellState.purificationConfig.purificationType || 'dispel';
      const targetType = spellState.purificationConfig.targetType || 'single';
      const effectTypes = spellState.purificationConfig.effectTypes || ['magic'];

      // Format purification type for display
      const formattedType = purificationType.split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      effects.push({
        effectType: 'purification',
        effectName: 'Purification',
        purificationType: formattedType,
        targetType: targetType,
        effectTypes: effectTypes.join(', '),
        purificationDetails: spellState.purificationConfig.description || `${formattedType} ${effectTypes.join(', ')} effects`
      });

      // Add specific effects to be purified if present
      if (spellState.purificationConfig.specificEffects && spellState.purificationConfig.specificEffects.length > 0) {
        spellState.purificationConfig.specificEffects.forEach(effect => {
          effects.push({
            effectType: 'purification',
            effectName: 'Specific Effect',
            specificEffect: effect.name || 'Effect',
            specificEffectDescription: effect.description || 'Purifies a specific effect',
          });
        });
      }
    }

    // Process restoration effects
    if (spellState.effectTypes?.includes('restoration') && spellState.restorationConfig) {
      // Add main restoration effect
      const restorationType = spellState.restorationConfig.restorationType || 'resource';
      const resourceType = spellState.restorationConfig.resourceType || 'mana';

      // Format restoration formula
      let restorationFormula = '';
      if (resolution === 'COINS' && spellState.restorationConfig.coinConfig) {
        const flipCount = spellState.restorationConfig.coinConfig.flipCount || 5;
        const formula = spellState.restorationConfig.coinConfig.formula || 'HEADS_COUNT * 8 + (ALL_HEADS ? 15 : 0)';
        restorationFormula = `Flip ${flipCount}: ${formatFormulaToPlainEnglish(formula, 'restoration')}`;
      } else if (resolution === 'CARDS' && spellState.restorationConfig.cardConfig) {
        const drawCount = spellState.restorationConfig.cardConfig.drawCount || 3;
        const formula = spellState.restorationConfig.cardConfig.formula || 'CARD_VALUE + FACE_CARD_COUNT * 5';
        restorationFormula = `Draw ${drawCount}: ${formatFormulaToPlainEnglish(formula, 'restoration')}`;
      } else {
        restorationFormula = spellState.restorationConfig.formula || '2d6';
      }

      // Format resource type for display
      const formattedResourceType = resourceType.charAt(0).toUpperCase() + resourceType.slice(1);

      effects.push({
        effectType: 'restoration',
        effectName: 'Restoration',
        restorationType: restorationType,
        resourceType: formattedResourceType,
        restorationFormula: restorationFormula,
        restorationDetails: spellState.restorationConfig.description || `Restores ${formattedResourceType}`
      });

      // Add secondary effects if present
      if (spellState.restorationConfig.secondaryEffects && spellState.restorationConfig.secondaryEffects.length > 0) {
        spellState.restorationConfig.secondaryEffects.forEach(effect => {
          effects.push({
            effectType: 'restoration',
            effectName: 'Secondary Effect',
            secondaryEffect: effect.name || 'Effect',
            secondaryEffectDescription: effect.description || 'Provides a secondary effect',
          });
        });
      }
    }

    return effects;
  };

  // Validate the spell when the component loads
  useEffect(() => {
    validateSpell();
  }, [spellState]);

  // Validate spell for completeness and correctness
  const validateSpell = () => {
    const errors = {};
    const warnings = {};

    // Check for required fields
    if (!spellState.name) {
      errors.name = 'Spell name is required';
    }

    if (!spellState.description) {
      warnings.description = 'A description helps others understand your spell';
    }

    if (!spellState.school) {
      warnings.school = 'Specifying a school of magic is recommended';
    }

    // Effect validation
    if (!spellState.effectTypes || spellState.effectTypes.length === 0) {
      warnings.effects = 'Spell has no effects defined';
    }

    // Add more validation rules as needed

    setValidationResults({ errors, warnings });
  };

  // Mark a section as reviewed
  const markSectionReviewed = (section, isReviewed = true) => {
    setReviewedSections(prev => ({
      ...prev,
      [section]: isReviewed
    }));
  };

  // Handle saving the spell to library
  const handleSaveSpell = () => {
    if (Object.keys(validationResults.errors).length > 0) {
      // Don't save if there are errors
      alert('Please fix all errors before saving the spell.');
      return;
    }

    setSaving(true);

    try {
      // Create a complete spell object for the library
      const librarySpell = {
        ...spellState,
        id: generateSpellId(spellState.name),
        dateCreated: new Date().toISOString(),
        lastModified: new Date().toISOString(),
        icon: extractSpellIcon(spellState),
        serializedData: serializeSpell(spellState),
        humanReadable: generateHumanReadable(spellState),
        gameCode: generateGameCode(spellState),
        // Ensure trap and trigger configurations are included
        trapConfig: spellState.trapConfig,
        // Only include triggerConfig if it has actual triggers
        triggerConfig: hasTriggers(spellState.triggerConfig) ? spellState.triggerConfig : null,
        // Ensure we have all the necessary properties for the spell card
        effectType: spellState.effectTypes && spellState.effectTypes.length > 0 ? spellState.effectTypes[0] : 'utility',
        effectTypes: spellState.effectTypes || [],
        damageTypes: spellState.damageTypes || [],
        tags: [
          ...(spellState.typeConfig?.tags || []),
          ...(spellState.effectTypes || []),
          ...(spellState.tags || [])
        ].filter(Boolean),
        // Ensure targeting configuration is included
        targetingConfig: spellState.targetingConfig || {
          targetType: 'single',
          range: 30,
          areaType: 'sphere',
          areaSize: 10
        },
        // Ensure resource configuration is included
        resourceCost: spellState.resourceCost || {
          mana: 0,
          rage: 0,
          energy: 0,
          focus: 0,
          runic: 0
        },
        // Ensure cooldown configuration is included
        cooldownConfig: spellState.cooldownConfig || {
          cooldown: 0,
          charges: 1
        }
      };

      // Log the spell being saved
      console.log('Saving spell to library:', librarySpell);

      // Dispatch to library context using the proper action creator
      libraryDispatch(libraryActionCreators.addSpell(librarySpell));

      // Verify the spell was added to the library
      console.log('Spell saved to library');

      setSaving(false);
      setSaveSuccess(true);

      // Reset success message after delay
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving spell:', error);
      setSaving(false);
      alert('Failed to save spell. Please try again.');
    }
  };

  // Generate a unique ID for the spell based on its name
  const generateSpellId = (name) => {
    const base = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const timestamp = Date.now().toString(36);
    return `${base}-${timestamp}`;
  };

  // Check if the triggerConfig has actual triggers
  const hasTriggers = (triggerConfig) => {
    if (!triggerConfig) return false;

    // Check for global compound triggers
    if (triggerConfig.global &&
        triggerConfig.global.compoundTriggers &&
        triggerConfig.global.compoundTriggers.length > 0) {
      return true;
    }

    // Check for effect-specific triggers
    if (triggerConfig.effectTriggers &&
        Object.keys(triggerConfig.effectTriggers).length > 0) {
      // Check if any effect has compound triggers
      for (const effectType in triggerConfig.effectTriggers) {
        if (triggerConfig.effectTriggers[effectType].compoundTriggers &&
            triggerConfig.effectTriggers[effectType].compoundTriggers.length > 0) {
          return true;
        }
      }
    }

    // Check for legacy compound triggers
    if (triggerConfig.compoundTriggers &&
        Array.isArray(triggerConfig.compoundTriggers) &&
        triggerConfig.compoundTriggers.length > 0) {
      return true;
    }

    // Check for DoT/HoT triggers
    if (triggerConfig.dotTrigger || triggerConfig.hotTrigger) {
      return true;
    }

    return false;
  };

  // Jump to a specific step to edit that section
  const handleEditSection = (sectionStep) => {
    onJumpToStep(sectionStep);
  };

  // Create the mapped spell data for preview
  const previewSpellData = mapWizardStateToPreviewState();

  // Trigger conditions display has been removed from the review step

  return (
    <WizardStep
      title="Review Your Spell"
      description="Review your spell and save it to your library when you're satisfied."
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      isActive={isActive}
      isCompleted={isCompleted}
      onNext={onNext}
      onPrevious={onPrevious}
    >
      <div className="step10-review-container">
        <div className="review-content-wrapper">
          <div className="review-spell-preview">
            {/* Display spell card in wizard style */}
            <UnifiedSpellCard
              spell={previewSpellData}
              variant="wizard"
              showActions={false}
              showDescription={true}
              showStats={true}
              showTags={true}
              rollableTableData={(spellState.rollableTable && spellState.rollableTable.enabled === true) ? {
                enabled: true,
                name: spellState.rollableTable.name || 'Random Effects',
                resolutionType: spellState.rollableTable.resolutionType || 'DICE',
                entries: spellState.rollableTable.entries || []
              } : null}
            />
            {/* Trigger conditions removed from review step */}
          </div>

          <div className="review-validation-panel">
            <div className="review-section-header">
              <h3>
                <FontAwesomeIcon icon={faCheckCircle} className="review-icon" />
                Validation Results
              </h3>
            </div>

            {/* Validation Summary */}
            <div className="validation-summary">
              {Object.keys(validationResults.errors).length > 0 ? (
                <div className="validation-errors">
                  <h4>
                    <FontAwesomeIcon icon={faExclamationTriangle} className="error-icon" />
                    Errors
                  </h4>
                  <ul className="validation-list">
                    {Object.entries(validationResults.errors).map(([key, error]) => (
                      <li key={key} className="validation-item error">
                        <FontAwesomeIcon icon={faTimes} className="list-icon" />
                        <span>{error}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : (
                <div className="validation-success">
                  <FontAwesomeIcon icon={faCheck} className="success-icon" />
                  <span>No errors found!</span>
                </div>
              )}

              {Object.keys(validationResults.warnings).length > 0 && (
                <div className="validation-warnings">
                  <h4>
                    <FontAwesomeIcon icon={faExclamationTriangle} className="warning-icon" />
                    Warnings
                  </h4>
                  <ul className="validation-list">
                    {Object.entries(validationResults.warnings).map(([key, warning]) => (
                      <li key={key} className="validation-item warning">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="list-icon" />
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Review Checklist */}
            <div className="review-checklist">
              <h4>Review Checklist</h4>
              <div className="checklist-items">
                <div className={`checklist-item ${reviewedSections.basics ? 'reviewed' : ''}`}>
                  <button
                    className="review-toggle"
                    onClick={() => markSectionReviewed('basics', !reviewedSections.basics)}
                  >
                    <FontAwesomeIcon
                      icon={reviewedSections.basics ? faCheckCircle : faCircleOutline}
                      className="review-icon"
                    />
                  </button>
                  <span className="checklist-text">Basic Information</span>
                  <button
                    className="edit-section"
                    onClick={() => handleEditSection(1)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="edit-icon" />
                  </button>
                </div>

                <div className={`checklist-item ${reviewedSections.effects ? 'reviewed' : ''}`}>
                  <button
                    className="review-toggle"
                    onClick={() => markSectionReviewed('effects', !reviewedSections.effects)}
                  >
                    <FontAwesomeIcon
                      icon={reviewedSections.effects ? faCheckCircle : faCircleOutline}
                      className="review-icon"
                    />
                  </button>
                  <span className="checklist-text">Effects</span>
                  <button
                    className="edit-section"
                    onClick={() => handleEditSection(3)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="edit-icon" />
                  </button>
                </div>

                <div className={`checklist-item ${reviewedSections.targeting ? 'reviewed' : ''}`}>
                  <button
                    className="review-toggle"
                    onClick={() => markSectionReviewed('targeting', !reviewedSections.targeting)}
                  >
                    <FontAwesomeIcon
                      icon={reviewedSections.targeting ? faCheckCircle : faCircleOutline}
                      className="review-icon"
                    />
                  </button>
                  <span className="checklist-text">Targeting & Area</span>
                  <button
                    className="edit-section"
                    onClick={() => handleEditSection(4)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="edit-icon" />
                  </button>
                </div>

                <div className={`checklist-item ${reviewedSections.resources ? 'reviewed' : ''}`}>
                  <button
                    className="review-toggle"
                    onClick={() => markSectionReviewed('resources', !reviewedSections.resources)}
                  >
                    <FontAwesomeIcon
                      icon={reviewedSections.resources ? faCheckCircle : faCircleOutline}
                      className="review-icon"
                    />
                  </button>
                  <span className="checklist-text">Resources & Cooldowns</span>
                  <button
                    className="edit-section"
                    onClick={() => handleEditSection(5)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="edit-icon" />
                  </button>
                </div>

                <div className={`checklist-item ${reviewedSections.mechanics ? 'reviewed' : ''}`}>
                  <button
                    className="review-toggle"
                    onClick={() => markSectionReviewed('mechanics', !reviewedSections.mechanics)}
                  >
                    <FontAwesomeIcon
                      icon={reviewedSections.mechanics ? faCheckCircle : faCircleOutline}
                      className="review-icon"
                    />
                  </button>
                  <span className="checklist-text">Mechanics</span>
                  <button
                    className="edit-section"
                    onClick={() => handleEditSection(8)}
                  >
                    <FontAwesomeIcon icon={faEdit} className="edit-icon" />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="review-actions">
              <button
                className={`save-button ${saving ? 'saving' : ''} ${saveSuccess ? 'success' : ''}`}
                onClick={handleSaveSpell}
                disabled={saving || Object.keys(validationResults.errors).length > 0}
              >
                <FontAwesomeIcon icon={faSave} className="action-icon" />
                {saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save to Library'}
              </button>

              <button
                className="spellbook-button"
                onClick={() => {/* Navigate to spellbook */}}
              >
                <FontAwesomeIcon icon={faBook} className="action-icon" />
                View Spellbook
              </button>
            </div>
          </div>
        </div>


      </div>
    </WizardStep>
  );
};

// Missing icon definition that wasn't in the imports
const faCircleOutline = {
  prefix: 'fas',
  iconName: 'circle',
  icon: [
    512, 512,
    [],
    'f111',
    'M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200z'
  ]
};

export default Step10Review;