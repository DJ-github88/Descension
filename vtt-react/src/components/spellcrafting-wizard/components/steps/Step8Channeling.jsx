import React, { useState, useEffect } from 'react';
import { useSpellWizardState, useSpellWizardDispatch, ACTION_TYPES, validateStepCompletion } from '../../context/spellWizardContext';
import WizardStep from '../common/WizardStep';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt,
  faArrowsAlt,
  faShieldAlt,
  faMagic,
  faClock,
  faBalanceScale,
  faHandPaper,
  faWalking,
  faChartLine,
  faGem,
  faCoins,
  faCircleXmark,
  faPlus,
  faMinus,
  faInfoCircle,
  faFire,
  faTrash,
  faHeart,
  faExpandAlt,
  faArrowUp,
  faCircle,
  faSquare,
  faPlay,
  faRuler,
  faRulerHorizontal,
  faBomb,
  faLink,
  faWind
} from '@fortawesome/free-solid-svg-icons';
// Pathfinder styles imported via main.css

const Step8Channeling = ({ stepNumber, totalSteps, onNext, onPrevious }) => {
  const state = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();
  const [errors, setErrors] = useState([]);

  // This step should be shown only for CHANNELED spells
  const shouldShowStep = state.spellType === 'CHANNELED';

  const isCompleted = validateStepCompletion('channeling', state);
  const isActive = state.currentStep === 'channeling';

  // Get targeting and propagation data from previous steps
  const targetingConfig = state.targetingConfig || {};
  const propagation = state.propagation || {};
  const effectTypes = state.effectTypes || [];

  // Get DoT and HoT effects from damage and healing steps
  const getDotHotEffects = () => {
    const damageConfig = state.damageConfig || {};
    const healingConfig = state.healingConfig || {};

    const dotEffects = [];
    const hotEffects = [];

    // Check for DoT effects with channeled trigger type
    if ((damageConfig.hasDotEffect || damageConfig.damageType === 'dot') && damageConfig.dotTriggerType === 'channeled') {
      dotEffects.push({
        id: 'dot_damage',
        formula: damageConfig.dotFormula || '1d4',
        damageType: damageConfig.damageType || 'arcane',
        description: 'Damage over time effect'
      });
    }

    // Check for HoT effects with channeled trigger type
    if ((healingConfig.hasHotEffect || healingConfig.healingType === 'hot') && healingConfig.hotTriggerType === 'channeled') {
      console.log("Found HoT effect with channeled trigger type:", healingConfig);
      hotEffects.push({
        id: 'hot_healing',
        formula: healingConfig.hotFormula || '1d4',
        description: 'Healing over time effect'
      });
    }

    console.log("getDotHotEffects result:", { dotEffects, hotEffects });
    return { dotEffects, hotEffects };
  };

  // Calculate a scaled formula based on area expansion
  const calculateScaledFormula = (baseFormula, round, maxRounds, scalingType = 'linear') => {
    // If no base formula, return empty string
    if (!baseFormula) return '';

    // Extract numeric parts and dice notation
    const diceMatch = baseFormula.match(/(\d+)d(\d+)/);
    const flatBonusMatch = baseFormula.match(/\+\s*(\d+)/);

    if (!diceMatch) {
      // If it's just a number, scale it directly
      const numericValue = parseInt(baseFormula);
      if (!isNaN(numericValue)) {
        let scaleFactor;

        if (scalingType === 'linear') {
          // Linear scaling: increases evenly with each round
          scaleFactor = 1 + ((round - 1) / (maxRounds - 1));
        } else if (scalingType === 'exponential') {
          // Exponential scaling: increases more with later rounds
          scaleFactor = Math.pow(1.5, (round - 1) / (maxRounds - 1));
        } else if (scalingType === 'diminishing') {
          // Diminishing returns: increases less with later rounds
          scaleFactor = 1 + (Math.sqrt((round - 1) / (maxRounds - 1)));
        } else {
          scaleFactor = 1;
        }

        return Math.floor(numericValue * scaleFactor).toString();
      }

      // If we can't parse it, return the original formula
      return baseFormula;
    }

    // Extract dice components
    const numDice = parseInt(diceMatch[1]);
    const diceType = parseInt(diceMatch[2]);
    const flatBonus = flatBonusMatch ? parseInt(flatBonusMatch[1]) : 0;

    // Calculate scaling factors based on round
    let diceFactor, bonusFactor;

    if (scalingType === 'linear') {
      // Linear scaling
      diceFactor = 1 + ((round - 1) / (maxRounds - 1));
      bonusFactor = 1 + ((round - 1) / (maxRounds - 1));
    } else if (scalingType === 'exponential') {
      // Exponential scaling
      diceFactor = Math.pow(1.5, (round - 1) / (maxRounds - 1));
      bonusFactor = Math.pow(1.5, (round - 1) / (maxRounds - 1));
    } else if (scalingType === 'diminishing') {
      // Diminishing returns
      diceFactor = 1 + (Math.sqrt((round - 1) / (maxRounds - 1)));
      bonusFactor = 1 + (Math.sqrt((round - 1) / (maxRounds - 1)));
    } else {
      diceFactor = 1;
      bonusFactor = 1;
    }

    // Apply scaling
    const newNumDice = Math.max(1, Math.floor(numDice * diceFactor));
    const newFlatBonus = flatBonus ? Math.floor(flatBonus * bonusFactor) : 0;

    // Construct new formula
    let newFormula = `${newNumDice}d${diceType}`;
    if (newFlatBonus > 0) {
      newFormula += ` + ${newFlatBonus}`;
    }

    return newFormula;
  };

  // Initialize per-round formulas for channeled effects
  const initializePerRoundFormulas = () => {
    const { dotEffects, hotEffects } = getDotHotEffects();
    const maxRounds = channelingConfig.maxDuration || 3; // Use the configured duration instead of hardcoded value
    const perRoundFormulas = {};

    // Determine if we should scale based on area expansion
    const isAreaExpansion = targetingConfig.targetingType === 'area' ||
                           (propagation && propagation.method) ||
                           (targetingConfig.rangeType === 'ranged' && targetingConfig.rangeDistance);

    // Get area expansion settings
    const areaSettings = getInitialAreaSettings();

    // Check if we already have perRoundFormulas in the state
    const existingPerRoundFormulas = state.channelingConfig?.perRoundFormulas || {};

    // Initialize DoT formulas for each round
    dotEffects.forEach(effect => {
      const baseFormula = effect.formula;

      // Check if we already have formulas for this effect
      if (existingPerRoundFormulas[effect.id] && existingPerRoundFormulas[effect.id].length > 0) {
        perRoundFormulas[effect.id] = existingPerRoundFormulas[effect.id];
      } else {
        perRoundFormulas[effect.id] = Array(maxRounds).fill(0).map((_, index) => {
          const round = index + 1;

          // If we have area expansion, scale the formula based on the area
          let scaledFormula = baseFormula;
          if (isAreaExpansion) {
            scaledFormula = calculateScaledFormula(baseFormula, round, maxRounds);
          }

          return {
            round: round,
            formula: scaledFormula,
            description: `Round ${round} ${effect.damageType} damage`,
            // Store area information for reference
            areaInfo: isAreaExpansion ? {
              radius: Math.min(
                areaSettings.initialRadius + ((round - 1) * areaSettings.expansionRate),
                areaSettings.maxRadius
              ),
              isExpanded: round > 1
            } : null
          };
        });
      }
    });

    // Initialize HoT formulas for each round
    hotEffects.forEach(effect => {
      const baseFormula = effect.formula;

      // Check if we already have formulas for this effect
      if (existingPerRoundFormulas[effect.id] && existingPerRoundFormulas[effect.id].length > 0) {
        perRoundFormulas[effect.id] = existingPerRoundFormulas[effect.id];
      } else {
        perRoundFormulas[effect.id] = Array(maxRounds).fill(0).map((_, index) => {
          const round = index + 1;

          // If we have area expansion, scale the formula based on the area
          let scaledFormula = baseFormula;
          if (isAreaExpansion) {
            scaledFormula = calculateScaledFormula(baseFormula, round, maxRounds);
          }

          return {
            round: round,
            formula: scaledFormula,
            description: `Round ${round} healing`,
            // Store area information for reference
            areaInfo: isAreaExpansion ? {
              radius: Math.min(
                areaSettings.initialRadius + ((round - 1) * areaSettings.expansionRate),
                areaSettings.maxRadius
              ),
              isExpanded: round > 1
            } : null
          };
        });
      }
    });

    return perRoundFormulas;
  };

  // Set initial values based on previous step data
  const getInitialAreaSettings = () => {
    // Default values
    const defaults = {
      initialRadius: 5,
      maxRadius: 30,
      expansionRate: 5,
      expansionType: 'linear'
    };

    // If targeting is area-based, use those values from step 4
    if (targetingConfig.targetingType === 'area' && targetingConfig.aoeShape) {
      // Get the appropriate dimension based on shape
      let radius = 10;
      let shapeName = '';

      if (targetingConfig.aoeShape === 'circle' || targetingConfig.aoeShape === 'sphere') {
        radius = targetingConfig.aoeParameters?.radius || 20;
        shapeName = targetingConfig.aoeShape === 'circle' ? 'Circle' : 'Sphere';
      } else if (targetingConfig.aoeShape === 'square' || targetingConfig.aoeShape === 'cube') {
        radius = targetingConfig.aoeParameters?.size || 15;
        shapeName = targetingConfig.aoeShape === 'square' ? 'Square' : 'Cube';
      } else if (targetingConfig.aoeShape === 'cone') {
        radius = targetingConfig.aoeParameters?.range || 15;
        shapeName = 'Cone';
      } else if (targetingConfig.aoeShape === 'line') {
        radius = targetingConfig.aoeParameters?.length || 30;
        shapeName = 'Line';
      }

      console.log("Found AOE in targeting:", targetingConfig.aoeShape, radius);
      return {
        initialRadius: Math.max(1, Math.floor(radius / 2)),
        maxRadius: radius * 2,
        expansionRate: Math.max(1, Math.floor(radius / 3)),
        expansionType: 'linear',
        aoeShape: targetingConfig.aoeShape,
        shapeName: shapeName,
        originalRadius: radius,
        fromTargeting: true,
        targetingDescription: `Expands the ${shapeName.toLowerCase()} from ${Math.max(1, Math.floor(radius / 2))}ft to ${radius * 2}ft`
      };
    }

    // Check for rangeDistance in targeting config
    if (targetingConfig.rangeType === 'ranged' && targetingConfig.rangeDistance) {
      const range = targetingConfig.rangeDistance;
      console.log("Found range in targeting:", range);

      // Calculate reasonable values based on the range
      const initialRadius = Math.max(1, Math.floor(range / 4));
      const maxRadius = Math.min(60, range * 1.5); // Cap at 60ft or 1.5x the range value
      const expansionRate = Math.max(1, Math.floor(range / 6));

      return {
        initialRadius: initialRadius,
        maxRadius: maxRadius,
        expansionRate: expansionRate,
        expansionType: 'linear',
        isRanged: true,
        rangeDistance: range,
        fromTargeting: true,
        targetingDescription: `Creates an expanding area effect from ${initialRadius}ft to ${maxRadius}ft at a range of ${range}ft`
      };
    }

    // If propagation is defined, reference that
    if (propagation && propagation.method) {
      let radius = 10;
      let description = '';

      if (propagation.method === 'explosion' && propagation.parameters?.secondaryRadius) {
        radius = propagation.parameters.secondaryRadius;
        description = `Expands the explosion radius from ${Math.max(1, Math.floor(radius / 2))}ft to ${radius * 2}ft`;
      } else if (propagation.method === 'chain' && propagation.parameters?.range) {
        radius = propagation.parameters.range;
        description = `Increases chain jump range from ${Math.max(1, Math.floor(radius / 2))}ft to ${radius * 1.5}ft`;
      } else if (propagation.method === 'spreading' && propagation.parameters?.spreadRate) {
        radius = propagation.parameters.spreadRate * 5;
        description = `Accelerates spread rate over time`;
      }

      return {
        initialRadius: Math.max(1, Math.floor(radius / 2)),
        maxRadius: radius * 2,
        expansionRate: Math.max(1, Math.floor(radius / 3)),
        expansionType: 'linear',
        fromPropagation: true,
        propagationMethod: propagation.method,
        targetingDescription: description
      };
    }

    return defaults;
  };

  // Removed obsolete getInitialPowerUpSettings function

  // Get defensive settings based on spell configuration
  const getInitialDefensiveSettings = () => {
    // If we have a buff effect, start with higher damage reduction
    if (effectTypes.includes('buff')) {
      return {
        damageReduction: 20,
        maxDamageReduction: 60,
        resistanceType: 'all'
      };
    }

    return {
      damageReduction: 10,
      maxDamageReduction: 50,
      resistanceType: 'physical'
    };
  };

  // Get persistent effect settings based on targeting
  const getInitialPersistentSettings = () => {
    let effectType = 'aura';
    let radius = 10;
    let description = '';

    if (targetingConfig.targetingType === 'area' && targetingConfig.aoeShape) {
      effectType = 'field';

      if (targetingConfig.aoeShape === 'circle' || targetingConfig.aoeShape === 'sphere') {
        radius = targetingConfig.aoeParameters?.radius || 20;
        description = `Creates a persistent ${targetingConfig.aoeShape} field with ${radius}ft radius`;
      } else if (targetingConfig.aoeShape === 'square' || targetingConfig.aoeShape === 'cube') {
        radius = targetingConfig.aoeParameters?.size || 15;
        description = `Creates a persistent ${targetingConfig.aoeShape} field with ${radius}ft size`;
      } else if (targetingConfig.aoeShape === 'cone') {
        radius = targetingConfig.aoeParameters?.range || 15;
        description = `Creates a persistent cone field with ${radius}ft range`;
      } else if (targetingConfig.aoeShape === 'line') {
        radius = targetingConfig.aoeParameters?.length || 30;
        description = `Creates a persistent line field with ${radius}ft length`;
      }
    } else if (targetingConfig.rangeType === 'ranged') {
      effectType = 'beam';
      radius = targetingConfig.rangeDistance || 30;
      description = `Creates a persistent beam with ${radius}ft range`;
    } else {
      description = `Creates a persistent aura with ${radius}ft radius around the caster`;
    }

    return {
      persistentEffectType: effectType,
      persistentRadius: radius,
      persistentDescription: description,
      fromTargeting: true
    };
  };

  // Get DoT and HoT effects
  const { dotEffects, hotEffects } = getDotHotEffects();
  const hasChanneledEffects = dotEffects.length > 0 || hotEffects.length > 0;

  // Local channeling configuration
  const [channelingConfig, setChannelingConfig] = useState(() => {
    console.log("Initializing channeling config with state:", state.channelingConfig);

    // If we already have a channeling config in the state, use it directly
    if (state.channelingConfig) {
      return state.channelingConfig;
    }

    // Otherwise, create a new configuration
    // Get resource type from previous step
    let resourceType = 'mana';

    // First check resourceValues (which includes custom resources)
    if (state.resourceCost?.resourceValues && Object.keys(state.resourceCost.resourceValues).length > 0) {
      resourceType = Object.keys(state.resourceCost.resourceValues)[0].toLowerCase();
    }
    // Fall back to primaryResourceType if no resourceValues
    else if (state.resourceCost?.primaryResourceType) {
      resourceType = state.resourceCost.primaryResourceType.toLowerCase();
    }

    // Calculate a reasonable cost value based on the resource type and existing costs
    const getInitialCostValue = () => {
      // If we already have a resource cost from step 5, use a percentage of it
      if (resourceType === 'mana' && state.resourceCost?.mana) {
        return Math.max(1, Math.floor(state.resourceCost.mana * 0.3)); // 30% of base mana cost per turn
      } else if (resourceType === 'rage' && state.resourceCost?.classResourceCost) {
        return Math.max(5, Math.floor(state.resourceCost.classResourceCost * 0.4)); // 40% of rage cost
      } else if (resourceType === 'energy' && state.resourceCost?.classResourceCost) {
        return Math.max(10, Math.floor(state.resourceCost.classResourceCost * 0.5)); // 50% of energy cost
      } else if (resourceType === 'focus' && state.resourceCost?.classResourceCost) {
        return Math.max(5, Math.floor(state.resourceCost.classResourceCost * 0.3)); // 30% of focus cost
      } else if (resourceType === 'health' && state.resourceCost?.classResourceCost) {
        return Math.max(2, Math.floor(state.resourceCost.classResourceCost * 0.2)); // 20% of health cost (lower to be safer)
      }

      // Default values by resource type if no previous cost exists
      switch (resourceType) {
        case 'mana': return 5;
        case 'rage': return 10;
        case 'energy': return 15;
        case 'focus': return 8;
        case 'health': return 3;
        default: return 1;
      }
    };

    // Removed reference to obsolete getInitialPowerUpSettings function

    // Automatically determine the most appropriate channel type based on previous steps
    let determinedType = '';

    // If it has area targeting or propagation, use area expansion
    if (targetingConfig.targetingType === 'area' ||
        (propagation && propagation.method) ||
        (targetingConfig.rangeType === 'ranged' && targetingConfig.rangeDistance)) {
      determinedType = 'area_expand';
    }
    // If it has buff effects, use defensive
    else if (effectTypes.includes('buff')) {
      determinedType = 'defensive';
    }
    // If it has damage or healing, use power up
    else if (effectTypes.includes('damage') || effectTypes.includes('healing')) {
      determinedType = 'power_up';
    }
    // Default to power up if nothing else matches
    else {
      determinedType = 'power_up';
    }

    // Initialize per-round formulas for channeled effects
    const perRoundFormulas = initializePerRoundFormulas();

    // Base configuration
    const baseConfig = {
      // Use the automatically determined channel type
      type: determinedType,
      maxDuration: 4,
      durationUnit: 'turns',
      interruptible: true,
      movementAllowed: false,
      costValue: getInitialCostValue(),
      costType: resourceType,
      costTrigger: 'per_turn',
      // Removed obsolete power scaling properties
      // Per-round formulas for channeled effects
      perRoundFormulas: perRoundFormulas,

      // Initialize with intelligent defaults based on previous steps
      ...getInitialAreaSettings(),
      // Removed reference to obsolete getInitialPowerUpSettings function
      ...getInitialDefensiveSettings(),
      ...getInitialPersistentSettings(),

      // Staged effect defaults
      stages: [
        { threshold: 1, effect: 'Damage', description: 'Base damage' },
        { threshold: 2, effect: 'Stun', description: 'Adds stun effect' },
        { threshold: 3, effect: 'Dispel', description: 'Adds dispel effect' },
        { threshold: 4, effect: 'Knockback', description: 'Adds knockback effect' }
      ]
    };

    // If there's already a saved configuration, use that instead
    return state.channelingConfig || baseConfig;
  });

  // Effect to update context when configuration changes
  useEffect(() => {
    if (channelingConfig.type) {
      console.log("Updating channeling config:", channelingConfig);

      // Make sure we preserve any existing HoT/DoT formulas
      const updatedConfig = { ...channelingConfig };

      // Ensure perRoundFormulas match the current maxDuration
      if (updatedConfig.perRoundFormulas) {
        Object.keys(updatedConfig.perRoundFormulas).forEach(effectId => {
          const formulas = updatedConfig.perRoundFormulas[effectId];
          if (formulas && Array.isArray(formulas)) {
            // If we have more formulas than maxDuration, trim the excess
            if (formulas.length > updatedConfig.maxDuration) {
              updatedConfig.perRoundFormulas[effectId] = formulas.slice(0, updatedConfig.maxDuration);
            }
            // If we have fewer formulas than maxDuration, add more
            else if (formulas.length < updatedConfig.maxDuration && formulas.length > 0) {
              const baseFormula = formulas[0].formula;
              const areaSettings = getInitialAreaSettings();
              const isAreaExpansion = targetingConfig.targetingType === 'area' ||
                                     (propagation && propagation.method) ||
                                     (targetingConfig.rangeType === 'ranged' && targetingConfig.rangeDistance);

              // Determine if this is a DoT or HoT effect
              const isDot = effectId.includes('dot');

              // Add new rounds
              for (let i = formulas.length; i < updatedConfig.maxDuration; i++) {
                const round = i + 1;
                let scaledFormula = baseFormula;

                if (isAreaExpansion) {
                  scaledFormula = calculateScaledFormula(baseFormula, round, updatedConfig.maxDuration);
                }

                updatedConfig.perRoundFormulas[effectId].push({
                  round: round,
                  formula: scaledFormula,
                  description: isDot ? `Round ${round} damage` : `Round ${round} healing`,
                  areaInfo: isAreaExpansion ? {
                    radius: Math.min(
                      areaSettings.initialRadius + ((round - 1) * areaSettings.expansionRate),
                      areaSettings.maxRadius
                    ),
                    isExpanded: round > 1
                  } : null
                });
              }
            }
          }
        });
      }

      // Check if we have HoT effects with channeled trigger type
      const healingConfig = state.healingConfig || {};
      if ((healingConfig.hasHotEffect || healingConfig.healingType === 'hot') &&
          healingConfig.hotTriggerType === 'channeled') {

        // Ensure we have the hot_healing formulas
        if (!updatedConfig.perRoundFormulas || !updatedConfig.perRoundFormulas.hot_healing) {
          // Create an array of rounds based on maxDuration
          const hotRounds = Array.from({ length: updatedConfig.maxDuration }, (_, i) => ({
            round: i + 1,
            formula: healingConfig.hotFormula || '1d4',
            description: `Round ${i + 1} healing`
          }));

          updatedConfig.perRoundFormulas = {
            ...updatedConfig.perRoundFormulas,
            hot_healing: hotRounds
          };
        }
      }

      // Check if we have DoT effects with channeled trigger type
      const damageConfig = state.damageConfig || {};
      if ((damageConfig.hasDotEffect || damageConfig.damageType === 'dot') &&
          damageConfig.dotTriggerType === 'channeled') {

        // Ensure we have the dot_damage formulas
        if (!updatedConfig.perRoundFormulas || !updatedConfig.perRoundFormulas.dot_damage) {
          // Create an array of rounds based on maxDuration
          const dotRounds = Array.from({ length: updatedConfig.maxDuration }, (_, i) => ({
            round: i + 1,
            formula: damageConfig.dotFormula || '1d4',
            description: `Round ${i + 1} damage`
          }));

          updatedConfig.perRoundFormulas = {
            ...updatedConfig.perRoundFormulas,
            dot_damage: dotRounds
          };
        }
      }

      // Get resource type from previous step
      const resourceCost = state.resourceCost || {};
      if (resourceCost.resourceValues && Object.keys(resourceCost.resourceValues).length > 0) {
        // Use the first resource type from resourceValues
        const resourceType = Object.keys(resourceCost.resourceValues)[0].toLowerCase();
        if (resourceType && resourceType !== 'mana') {
          updatedConfig.costType = resourceType;
        }
      } else if (resourceCost.primaryResourceType) {
        updatedConfig.costType = resourceCost.primaryResourceType.toLowerCase();
      }

      // Only update if there are actual changes to avoid infinite loops
      if (JSON.stringify(updatedConfig) !== JSON.stringify(state.channelingConfig)) {
        console.log("Dispatching updated channeling config:", updatedConfig);
        dispatch({
          type: ACTION_TYPES.UPDATE_CHANNELING_CONFIG,
          payload: updatedConfig
        });
      }
    }
  }, [channelingConfig, dispatch, state.healingConfig, state.damageConfig, state.resourceCost, state.channelingConfig, targetingConfig, propagation, calculateScaledFormula, getInitialAreaSettings]);

  // Handle configuration changes
  const handleChannelingConfigChange = (changes) => {
    console.log("Handling channeling config change:", changes);
    const newConfig = { ...channelingConfig, ...changes };

    // If maxDuration changed, update the per-round formulas
    if (changes.maxDuration && changes.maxDuration !== channelingConfig.maxDuration) {
      const { dotEffects, hotEffects } = getDotHotEffects();
      const perRoundFormulas = { ...newConfig.perRoundFormulas } || {};

      // Update DoT effects
      dotEffects.forEach(effect => {
        if (perRoundFormulas[effect.id]) {
          // If new duration is greater, add more rounds
          if (changes.maxDuration > channelingConfig.maxDuration) {
            const baseFormula = perRoundFormulas[effect.id][0]?.formula || effect.formula;
            const areaSettings = getInitialAreaSettings();
            const isAreaExpansion = targetingConfig.targetingType === 'area' ||
                                   (propagation && propagation.method) ||
                                   (targetingConfig.rangeType === 'ranged' && targetingConfig.rangeDistance);

            // Add new rounds
            for (let i = channelingConfig.maxDuration; i < changes.maxDuration; i++) {
              const round = i + 1;
              let scaledFormula = baseFormula;

              if (isAreaExpansion) {
                scaledFormula = calculateScaledFormula(baseFormula, round, changes.maxDuration);
              }

              perRoundFormulas[effect.id].push({
                round: round,
                formula: scaledFormula,
                description: `Round ${round} ${effect.damageType} damage`,
                areaInfo: isAreaExpansion ? {
                  radius: Math.min(
                    areaSettings.initialRadius + ((round - 1) * areaSettings.expansionRate),
                    areaSettings.maxRadius
                  ),
                  isExpanded: round > 1
                } : null
              });
            }
          }
          // If new duration is less, remove excess rounds
          else if (changes.maxDuration < channelingConfig.maxDuration) {
            perRoundFormulas[effect.id] = perRoundFormulas[effect.id].slice(0, changes.maxDuration);
          }
        }
      });

      // Update HoT effects
      hotEffects.forEach(effect => {
        if (perRoundFormulas[effect.id]) {
          // If new duration is greater, add more rounds
          if (changes.maxDuration > channelingConfig.maxDuration) {
            const baseFormula = perRoundFormulas[effect.id][0]?.formula || effect.formula;
            const areaSettings = getInitialAreaSettings();
            const isAreaExpansion = targetingConfig.targetingType === 'area' ||
                                   (propagation && propagation.method) ||
                                   (targetingConfig.rangeType === 'ranged' && targetingConfig.rangeDistance);

            // Add new rounds
            for (let i = channelingConfig.maxDuration; i < changes.maxDuration; i++) {
              const round = i + 1;
              let scaledFormula = baseFormula;

              if (isAreaExpansion) {
                scaledFormula = calculateScaledFormula(baseFormula, round, changes.maxDuration);
              }

              perRoundFormulas[effect.id].push({
                round: round,
                formula: scaledFormula,
                description: `Round ${round} healing`,
                areaInfo: isAreaExpansion ? {
                  radius: Math.min(
                    areaSettings.initialRadius + ((round - 1) * areaSettings.expansionRate),
                    areaSettings.maxRadius
                  ),
                  isExpanded: round > 1
                } : null
              });
            }
          }
          // If new duration is less, remove excess rounds
          else if (changes.maxDuration < channelingConfig.maxDuration) {
            perRoundFormulas[effect.id] = perRoundFormulas[effect.id].slice(0, changes.maxDuration);
          }
        }
      });

      // Update the perRoundFormulas in the new config
      newConfig.perRoundFormulas = perRoundFormulas;
    }

    // Update local state
    setChannelingConfig(newConfig);

    // Update global state immediately
    dispatch({
      type: ACTION_TYPES.UPDATE_CHANNELING_CONFIG,
      payload: newConfig
    });

    // Validate the new configuration
    validateConfig(newConfig);

    console.log("Updated channeling config:", newConfig);
  };

  // Removed obsolete breakpoint-related functions

  // Update a per-round formula
  const updatePerRoundFormula = (effectId, roundIndex, field, value) => {
    // Make sure perRoundFormulas exists
    const perRoundFormulas = { ...channelingConfig.perRoundFormulas } || {};

    // Make sure the effect array exists
    if (!perRoundFormulas[effectId]) {
      perRoundFormulas[effectId] = [];
    }

    // Get area expansion settings
    const areaSettings = getInitialAreaSettings();

    // Check if we have area info in the first round
    const hasAreaInfo = perRoundFormulas[effectId].length > 0 &&
                       perRoundFormulas[effectId][0].areaInfo;

    // Calculate area info if needed
    let areaInfo = null;
    if (hasAreaInfo) {
      // Calculate the radius based on the expansion rate
      const newRadius = Math.min(
        areaSettings.initialRadius + ((roundIndex) * areaSettings.expansionRate),
        areaSettings.maxRadius
      );

      areaInfo = {
        radius: newRadius,
        isExpanded: roundIndex > 0
      };
    }

    // Make sure the round exists
    if (!perRoundFormulas[effectId][roundIndex]) {
      perRoundFormulas[effectId][roundIndex] = {
        round: roundIndex + 1,
        formula: '',
        description: `Round ${roundIndex + 1}`,
        areaInfo: areaInfo
      };
    }

    // Update the field
    perRoundFormulas[effectId][roundIndex] = {
      ...perRoundFormulas[effectId][roundIndex],
      [field]: value,
      // Preserve area info if it exists
      areaInfo: perRoundFormulas[effectId][roundIndex].areaInfo || areaInfo
    };

    // Update the config
    const newConfig = {
      ...channelingConfig,
      perRoundFormulas
    };

    setChannelingConfig(newConfig);
  };

  // Add a round to a per-round formula
  const addRoundToFormula = (effectId) => {
    // Make sure perRoundFormulas exists
    const perRoundFormulas = { ...channelingConfig.perRoundFormulas } || {};

    // Make sure the effect array exists
    if (!perRoundFormulas[effectId]) {
      perRoundFormulas[effectId] = [];
    }

    // Get the last round
    const lastRound = perRoundFormulas[effectId].length > 0
      ? perRoundFormulas[effectId][perRoundFormulas[effectId].length - 1]
      : null;

    // Get area expansion settings
    const areaSettings = getInitialAreaSettings();

    // Calculate new round number
    const newRoundNumber = perRoundFormulas[effectId].length + 1;

    // Calculate area info if needed
    let areaInfo = null;
    if (lastRound && lastRound.areaInfo) {
      // Calculate the new radius based on the expansion rate
      const newRadius = Math.min(
        areaSettings.initialRadius + ((newRoundNumber - 1) * areaSettings.expansionRate),
        areaSettings.maxRadius
      );

      areaInfo = {
        radius: newRadius,
        isExpanded: newRoundNumber > 1
      };
    }

    // Calculate scaled formula if we have area expansion
    let formula = lastRound ? lastRound.formula : '';
    if (areaInfo && lastRound && lastRound.formula) {
      // Get the base formula from the first round
      const baseFormula = perRoundFormulas[effectId][0].formula;
      // Scale it based on the new round number
      formula = calculateScaledFormula(baseFormula, newRoundNumber, channelingConfig.maxDuration);
    }

    // Add a new round
    const newRound = {
      round: newRoundNumber,
      formula: formula,
      description: `Round ${newRoundNumber}`,
      areaInfo: areaInfo
    };

    perRoundFormulas[effectId].push(newRound);

    // Update the config
    const newConfig = {
      ...channelingConfig,
      perRoundFormulas
    };

    setChannelingConfig(newConfig);
  };

  // Remove a round from a per-round formula
  const removeRoundFromFormula = (effectId, roundIndex) => {
    // Make sure perRoundFormulas exists
    const perRoundFormulas = { ...channelingConfig.perRoundFormulas } || {};

    // Make sure the effect array exists
    if (!perRoundFormulas[effectId]) {
      return;
    }

    // Remove the round
    perRoundFormulas[effectId].splice(roundIndex, 1);

    // Get area expansion settings
    const areaSettings = getInitialAreaSettings();

    // Check if we have area info in the first round
    const hasAreaInfo = perRoundFormulas[effectId].length > 0 &&
                       perRoundFormulas[effectId][0].areaInfo;

    // Get the base formula if we have area expansion
    const baseFormula = hasAreaInfo && perRoundFormulas[effectId].length > 0 ?
                       perRoundFormulas[effectId][0].formula : null;

    // Update the round numbers and area info
    perRoundFormulas[effectId].forEach((round, index) => {
      const newRoundNumber = index + 1;
      round.round = newRoundNumber;
      round.description = `Round ${newRoundNumber}`;

      // Update area info if needed
      if (hasAreaInfo) {
        // Calculate the new radius based on the expansion rate
        const newRadius = Math.min(
          areaSettings.initialRadius + ((newRoundNumber - 1) * areaSettings.expansionRate),
          areaSettings.maxRadius
        );

        round.areaInfo = {
          radius: newRadius,
          isExpanded: newRoundNumber > 1
        };

        // Recalculate formula if not the first round
        if (index > 0 && baseFormula) {
          round.formula = calculateScaledFormula(baseFormula, newRoundNumber, channelingConfig.maxDuration);
        }
      }
    });

    // Update the config
    const newConfig = {
      ...channelingConfig,
      perRoundFormulas
    };

    setChannelingConfig(newConfig);
  };

  // Handle formula change for a specific round
  const handleFormulaChange = (effectId, roundIndex, newFormula) => {
    // Create a copy of the current perRoundFormulas
    const updatedFormulas = { ...channelingConfig.perRoundFormulas } || {};

    // Make sure the effect array exists
    if (!updatedFormulas[effectId]) {
      updatedFormulas[effectId] = [];
    }

    // Make sure the round exists
    if (!updatedFormulas[effectId][roundIndex]) {
      updatedFormulas[effectId][roundIndex] = {
        round: roundIndex + 1,
        formula: '',
        description: `Round ${roundIndex + 1}`
      };
    }

    // Update the formula for the specified round
    updatedFormulas[effectId][roundIndex] = {
      ...updatedFormulas[effectId][roundIndex],
      formula: newFormula
    };

    // Update the state
    const newConfig = {
      ...channelingConfig,
      perRoundFormulas: updatedFormulas
    };

    setChannelingConfig(newConfig);

    // If this is a HoT effect, also update the hotFormula in the healingConfig
    if (effectId === 'hot_healing' && state.healingConfig) {
      // Only update the base formula if this is round 1
      if (roundIndex === 0) {
        dispatch({
          type: ACTION_TYPES.UPDATE_HEALING_CONFIG,
          payload: {
            ...state.healingConfig,
            hotFormula: newFormula
          }
        });
      }
    }

    // If this is a DoT effect, also update the dotFormula in the damageConfig
    if (effectId === 'dot_damage' && state.damageConfig) {
      // Only update the base formula if this is round 1
      if (roundIndex === 0) {
        dispatch({
          type: ACTION_TYPES.UPDATE_DAMAGE_CONFIG,
          payload: {
            ...state.damageConfig,
            dotFormula: newFormula
          }
        });
      }
    }
  };

  // Validate the configuration
  const validateConfig = (config) => {
    const validationErrors = [];

    if (!config.type) {
      validationErrors.push('Please select a channeling type');
    }

    if (config.maxDuration <= 0) {
      validationErrors.push('Maximum duration must be greater than 0');
    }

    if (config.costValue < 0) {
      validationErrors.push('Cost value cannot be negative');
    }

    // Removed obsolete validation for scaling effect breakpoints

    setErrors(validationErrors);
    return validationErrors.length === 0;
  };

  // Skip this step if it shouldn't be shown
  if (!shouldShowStep) {
    return (
      <WizardStep
        title="Channeling Settings"
        stepNumber={stepNumber}
        totalSteps={totalSteps}
        isCompleted={true}
        isActive={isActive}
        onNext={onNext}
        onPrevious={onPrevious}
        disableNext={false}
        hiddenCondition={true}
      >
        <div></div>
      </WizardStep>
    );
  }

  // Step-specific helpful hints
  const hintsList = [
    "Channeled spells gain power or effects over time as they are maintained.",
    "Consider how mobility impacts the spell's balance - allowing movement makes a spell stronger.",
    "Interruptible spells can be stopped by damage or crowd control effects.",
    "Breakpoints create noticeable power increases, giving players something to aim for.",
    "Adding a cost per second creates resource management decisions for players."
  ];

  // We no longer need separate channel types as we're automatically configuring based on previous choices

  return (
    <WizardStep
      title="Channeling Settings"
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      isCompleted={isCompleted}
      isActive={isActive}
      onNext={onNext}
      onPrevious={onPrevious}
      disableNext={errors.length > 0}
      hints={hintsList}
      showHints={true}
    >
      <div className="channeling-container">
        <div className="pf-section">
          <h3 className="pf-section-title">Channeling Configuration</h3>
          <p className="pf-section-description">
            Configure how your channeled spell works. Channeled spells are maintained over time, often growing in power or changing in some way as the channel continues.
          </p>

        {errors.length > 0 && (
          <div className="pf-error-card">
            <div className="pf-error-header">
              <FontAwesomeIcon icon={faCircleXmark} className="pf-error-icon" />
              <div className="pf-error-title">Please fix the following issues:</div>
            </div>
            <ul className="pf-error-list">
              {errors && errors.map((error, index) => (
                <li key={index} className="pf-error-item">{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Channeling Configuration Summary */}
        <div className="pf-info-section">
          <div className="pf-info-card">
            <FontAwesomeIcon icon={faInfoCircle} className="pf-info-icon" />
            <p className="pf-info-text">Your spell's channeling behavior is automatically configured based on your previous choices.</p>
          </div>

          <div className="channeling-summary-card">
            <div className="channeling-summary-header">
              <div className="channeling-summary-icon">
                <FontAwesomeIcon icon={faInfoCircle} />
              </div>
              <div className="channeling-summary-title">
                <h4>Channeling Effects</h4>
                <p>Based on your targeting, effects, and propagation settings</p>
              </div>
            </div>

            <div className="channeling-summary-content">
              <div className="channeling-summary-section">
                <h5 className="channeling-section-title">
                  <FontAwesomeIcon icon={faChartLine} />
                  Effect Scaling
                </h5>
                <p className="channeling-section-description">Your spell's effects will scale in power as you maintain the channel.</p>

                <div className="channeling-effects-list">
                  {effectTypes.includes('damage') && (
                    <div className="channeling-effect-item damage">
                      <FontAwesomeIcon icon={faFire} />
                      <span>Damage increases with each round of channeling</span>
                    </div>
                  )}
                  {effectTypes.includes('healing') && (
                    <div className="channeling-effect-item healing">
                      <FontAwesomeIcon icon={faHeart} />
                      <span>Healing increases with each round of channeling</span>
                    </div>
                  )}
                  {(effectTypes.includes('buff') || effectTypes.includes('debuff')) && (
                    <div className="channeling-effect-item buff">
                      <FontAwesomeIcon icon={faShieldAlt} />
                      <span>Effect potency increases with each round of channeling</span>
                    </div>
                  )}
                </div>
              </div>

              {(targetingConfig.targetingType === 'area' ||
                (propagation && propagation.method) ||
                (targetingConfig.rangeType === 'ranged' && targetingConfig.rangeDistance)) && (
                <div className="channeling-summary-section">
                  <h5 className="channeling-section-title area">
                    <FontAwesomeIcon icon={faArrowsAlt} />
                    Area Expansion
                  </h5>
                  <p className="channeling-section-description">Your spell's area of effect will expand as you maintain the channel.</p>

                  <div className="channeling-effects-list">
                    {targetingConfig.targetingType === 'area' && targetingConfig.aoeShape && (
                      <div className="channeling-effect-item area">
                        <FontAwesomeIcon icon={
                          targetingConfig.aoeShape === 'circle' || targetingConfig.aoeShape === 'sphere' ? faCircle :
                          targetingConfig.aoeShape === 'square' || targetingConfig.aoeShape === 'cube' ? faSquare :
                          targetingConfig.aoeShape === 'cone' ? faPlay :
                          targetingConfig.aoeShape === 'line' ? faRuler : faCircle
                        } />
                        <span>
                          {targetingConfig.aoeShape.charAt(0).toUpperCase() + targetingConfig.aoeShape.slice(1)} expands from {channelingConfig.initialRadius}ft to {channelingConfig.maxRadius}ft
                        </span>
                      </div>
                    )}

                    {propagation && propagation.method && (
                      <div className="channeling-effect-item propagation">
                        <FontAwesomeIcon icon={
                          propagation.method === 'explosion' ? faBomb :
                          propagation.method === 'chain' ? faLink :
                          propagation.method === 'spreading' ? faWind : faBomb
                        } />
                        <span>
                          {propagation.method.charAt(0).toUpperCase() + propagation.method.slice(1)} effect increases in range
                        </span>
                      </div>
                    )}

                    {targetingConfig.rangeType === 'ranged' && targetingConfig.rangeDistance && (
                      <div className="channeling-effect-item range">
                        <FontAwesomeIcon icon={faRulerHorizontal} />
                        <span>
                          Range-based effect expands at {targetingConfig.rangeDistance}ft distance
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pf-section">
          <h3 className="pf-section-title">Channel Duration & Behavior</h3>
          <p className="pf-section-description">Configure how long the spell can be channeled and how it behaves while channeling</p>

          <div className="channeling-config">
            <div className="channeling-config-header">
              <div className="channeling-summary-icon">
                <FontAwesomeIcon icon={faClock} />
              </div>
              <div className="channeling-summary-title">
                <h4>Channeling Behavior</h4>
                <p>Configure duration, interruption, and movement settings</p>
              </div>
            </div>

            <div className="effect-custom-config" style={{ padding: '16px' }}>
              <div className="wow-conditional-settings">
                <div className="channeling-section-title">Duration Settings</div>

                <div className="stat-cards-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '15px',
                  marginBottom: '16px'
                }}>
                  {/* Duration Card */}
                  <div className="wow-effect-button" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '12px',
                    background: 'rgba(30, 30, 46, 0.6)',
                    border: '1px solid #313244',
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '8px',
                      borderBottom: '1px solid rgba(255, 215, 0, 0.2)',
                      paddingBottom: '8px'
                    }}>
                      <FontAwesomeIcon icon={faClock} style={{
                        fontSize: '18px',
                        color: '#ffd700',
                        marginRight: '8px',
                        filter: 'drop-shadow(0 0 2px rgba(255, 215, 0, 0.3))'
                      }} />
                      <div style={{ fontWeight: 'bold', color: '#ffd700' }}>Duration</div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '12px',
                      justifyContent: 'center'
                    }}>
                      <button
                        className="custom-button"
                        onClick={() => handleChannelingConfigChange({ maxDuration: Math.max(1, channelingConfig.maxDuration - 1) })}
                        style={{
                          background: 'rgba(49, 50, 68, 0.6)',
                          border: '1px solid #45475a',
                          borderRadius: '4px',
                          color: '#cdd6f4',
                          width: '30px',
                          height: '30px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <input
                        type="number"
                        min="1"
                        value={channelingConfig.maxDuration}
                        onChange={(e) => handleChannelingConfigChange({ maxDuration: Math.max(1, parseInt(e.target.value) || 1) })}
                        style={{
                          background: 'rgba(49, 50, 68, 0.6)',
                          border: '1px solid #45475a',
                          borderRadius: '4px',
                          color: '#ffd700',
                          padding: '6px 8px',
                          margin: '0 8px',
                          width: '60px',
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}
                      />
                      <button
                        className="custom-button"
                        onClick={() => handleChannelingConfigChange({ maxDuration: channelingConfig.maxDuration + 1 })}
                        style={{
                          background: 'rgba(49, 50, 68, 0.6)',
                          border: '1px solid #45475a',
                          borderRadius: '4px',
                          color: '#cdd6f4',
                          width: '30px',
                          height: '30px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      {[
                        { id: 'turns', label: 'Turns' },
                        { id: 'rounds', label: 'Rounds' }
                      ].map(unit => (
                        <div
                          key={unit.id}
                          onClick={() => handleChannelingConfigChange({ durationUnit: unit.id })}
                          style={{
                            flex: 1,
                            padding: '6px 8px',
                            background: channelingConfig.durationUnit === unit.id ? 'rgba(255, 215, 0, 0.2)' : 'rgba(49, 50, 68, 0.6)',
                            border: channelingConfig.durationUnit === unit.id ? '1px solid #ffd700' : '1px solid #45475a',
                            borderRadius: '4px',
                            textAlign: 'center',
                            cursor: 'pointer',
                            color: channelingConfig.durationUnit === unit.id ? '#ffd700' : '#cdd6f4',
                            fontWeight: channelingConfig.durationUnit === unit.id ? 'bold' : 'normal',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          {unit.label}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interruptible Card */}
                  <div className="wow-effect-button" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '12px',
                    background: 'rgba(30, 30, 46, 0.6)',
                    border: '1px solid #313244',
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '12px',
                      borderBottom: '1px solid rgba(255, 68, 68, 0.2)',
                      paddingBottom: '8px'
                    }}>
                      <FontAwesomeIcon icon={faHandPaper} style={{
                        fontSize: '18px',
                        color: '#ff4444',
                        marginRight: '8px',
                        filter: 'drop-shadow(0 0 2px rgba(255, 68, 68, 0.3))'
                      }} />
                      <div style={{ fontWeight: 'bold', color: '#ff4444' }}>Interruption</div>
                    </div>

                    <div className="pf-checkbox-container channeling-option">
                      <input
                        type="checkbox"
                        className="pf-checkbox"
                        checked={!channelingConfig.interruptible}
                        onChange={() => handleChannelingConfigChange({ interruptible: !channelingConfig.interruptible })}
                      />
                      <label className="pf-checkbox-label">
                        Cannot be interrupted
                      </label>
                    </div>

                    <div style={{
                      fontSize: '12px',
                      color: !channelingConfig.interruptible ? '#ff9999' : '#bac2de',
                      background: 'rgba(0, 0, 0, 0.2)',
                      padding: '8px',
                      borderRadius: '4px',
                      textAlign: 'center',
                      fontStyle: 'italic'
                    }}>
                      {!channelingConfig.interruptible ?
                        "Channel continues even when taking damage" :
                        "Damage will interrupt channeling"}
                    </div>
                  </div>

                  {/* Movement Card */}
                  <div className="wow-effect-button" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '12px',
                    background: 'rgba(30, 30, 46, 0.6)',
                    border: '1px solid #313244',
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '12px',
                      borderBottom: '1px solid rgba(255, 119, 0, 0.2)',
                      paddingBottom: '8px'
                    }}>
                      <FontAwesomeIcon icon={faWalking} style={{
                        fontSize: '18px',
                        color: '#ff7700',
                        marginRight: '8px',
                        filter: 'drop-shadow(0 0 2px rgba(255, 119, 0, 0.3))'
                      }} />
                      <div style={{ fontWeight: 'bold', color: '#ff7700' }}>Movement</div>
                    </div>

                    <div className="pf-checkbox-container channeling-option">
                      <input
                        type="checkbox"
                        className="pf-checkbox"
                        checked={!channelingConfig.movementAllowed}
                        onChange={() => handleChannelingConfigChange({ movementAllowed: !channelingConfig.movementAllowed })}
                      />
                      <label className="pf-checkbox-label">
                        Must stand still
                      </label>
                    </div>

                    <div style={{
                      fontSize: '12px',
                      color: !channelingConfig.movementAllowed ? '#ffaa66' : '#bac2de',
                      background: 'rgba(0, 0, 0, 0.2)',
                      padding: '8px',
                      borderRadius: '4px',
                      textAlign: 'center',
                      fontStyle: 'italic'
                    }}>
                      {!channelingConfig.movementAllowed ?
                        "Caster must remain stationary" :
                        "Caster can move while channeling"}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '12px',
                  borderRadius: '6px',
                  marginTop: '8px',
                  border: '1px solid rgba(102, 204, 255, 0.3)',
                  boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.2)'
                }}>
                  <FontAwesomeIcon icon={faInfoCircle} style={{
                    color: '#66ccff',
                    marginRight: '12px',
                    fontSize: '20px',
                    filter: 'drop-shadow(0 0 3px rgba(102, 204, 255, 0.5))'
                  }} />
                  <div style={{ fontSize: '14px', color: '#cdd6f4', lineHeight: '1.4' }}>
                    <strong style={{ color: '#ffd700' }}>Total Duration:</strong> {channelingConfig.maxDuration} {channelingConfig.durationUnit || 'turns'} &nbsp;|&nbsp;
                    <strong style={{ color: '#ff4444' }}> Interruption:</strong> {!channelingConfig.interruptible ? "Cannot be interrupted" : "Can be interrupted"} &nbsp;|&nbsp;
                    <strong style={{ color: '#ff7700' }}> Movement:</strong> {!channelingConfig.movementAllowed ? "Must stand still" : "Can move"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Channeled Effects Configuration */}
        {hasChanneledEffects && (
          <div className="section" style={{
            background: 'rgba(17, 27, 51, 0.7)',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)',
            border: '1px solid #1a3c6e',
            marginTop: '24px'
          }}>
            <h3 style={{
              color: '#ffcc00',
              textAlign: 'center',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              textShadow: '0 0 5px rgba(255, 204, 0, 0.5)',
              marginBottom: '12px',
              fontSize: '20px',
              fontWeight: 'bold'
            }}>Channeled Effects</h3>
            <p style={{
              color: '#a0b9d9',
              textAlign: 'center',
              fontSize: '14px',
              marginBottom: '20px',
              padding: '0 20px'
            }}>Configure how your channeled effects scale over time</p>

            {/* DoT Effects */}
            {dotEffects.length > 0 && (
              <div className="selected-effect" style={{
                background: 'rgba(30, 40, 60, 0.6)',
                borderRadius: '8px',
                border: '1px solid #2c3e50',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                marginBottom: '16px'
              }}>
                <div className="effect-header" style={{
                  background: 'rgba(44, 62, 80, 0.7)',
                  padding: '12px 16px',
                  borderBottom: '1px solid #34495e',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <div className="effect-icon" style={{
                    background: 'rgba(255, 68, 0, 0.2)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px'
                  }}>
                    <FontAwesomeIcon icon={faFire} style={{ color: '#ff4400', fontSize: '20px' }} />
                  </div>
                  <div className="effect-info">
                    <div className="effect-name" style={{
                      color: '#ff4400',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      marginBottom: '4px'
                    }}>Damage Over Time</div>
                    <div className="effect-description" style={{
                      color: '#a0b9d9',
                      fontSize: '13px'
                    }}>
                      Configure how damage scales with each round of channeling
                    </div>
                  </div>
                </div>

                <div className="effect-custom-config" style={{ padding: '16px' }}>
                  {channelingConfig.perRoundFormulas &&
                   channelingConfig.perRoundFormulas[dotEffects[0].id] &&
                   channelingConfig.perRoundFormulas[dotEffects[0].id].length > 0 ? (
                    <div className="formula-rounds-container">
                      {channelingConfig.perRoundFormulas[dotEffects[0].id].map((round, index) => (
                        <div key={index} className="formula-round-item" style={{
                          background: 'rgba(20, 30, 50, 0.5)',
                          borderRadius: '6px',
                          padding: '12px',
                          marginBottom: '10px',
                          border: '1px solid rgba(255, 68, 0, 0.3)'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '8px',
                            borderBottom: '1px solid rgba(255, 68, 0, 0.2)',
                            paddingBottom: '8px'
                          }}>
                            <div style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(255, 68, 0, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: '8px',
                              fontWeight: 'bold',
                              color: '#ff4400'
                            }}>{round.round}</div>
                            <div style={{ fontWeight: 'bold', color: '#ff4400' }}>Round {round.round}</div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ flex: '0 0 80px', color: '#cdd6f4' }}>Formula:</div>
                            <input
                              type="text"
                              value={round.formula}
                              onChange={(e) => handleFormulaChange(dotEffects[0].id, index, e.target.value)}
                              style={{
                                flex: 1,
                                background: 'rgba(49, 50, 68, 0.6)',
                                border: '1px solid #45475a',
                                borderRadius: '4px',
                                color: '#ffcc00',
                                padding: '6px 10px',
                                fontFamily: 'monospace'
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      padding: '20px',
                      color: '#a0b9d9',
                      fontStyle: 'italic'
                    }}>
                      No DoT formulas configured yet
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* HoT Effects */}
            {hotEffects.length > 0 && (
              <div className="selected-effect" style={{
                background: 'rgba(30, 40, 60, 0.6)',
                borderRadius: '8px',
                border: '1px solid #2c3e50',
                overflow: 'hidden',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                marginBottom: '16px'
              }}>
                <div className="effect-header" style={{
                  background: 'rgba(44, 62, 80, 0.7)',
                  padding: '12px 16px',
                  borderBottom: '1px solid #34495e',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <div className="effect-icon" style={{
                    background: 'rgba(68, 255, 0, 0.2)',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '12px'
                  }}>
                    <FontAwesomeIcon icon={faHeart} style={{ color: '#44ff00', fontSize: '20px' }} />
                  </div>
                  <div className="effect-info">
                    <div className="effect-name" style={{
                      color: '#44ff00',
                      fontSize: '18px',
                      fontWeight: 'bold',
                      marginBottom: '4px'
                    }}>Healing Over Time</div>
                    <div className="effect-description" style={{
                      color: '#a0b9d9',
                      fontSize: '13px'
                    }}>
                      Configure how healing scales with each round of channeling
                    </div>
                  </div>
                </div>

                <div className="effect-custom-config" style={{ padding: '16px' }}>
                  {channelingConfig.perRoundFormulas &&
                   channelingConfig.perRoundFormulas[hotEffects[0].id] &&
                   channelingConfig.perRoundFormulas[hotEffects[0].id].length > 0 ? (
                    <div className="formula-rounds-container">
                      {channelingConfig.perRoundFormulas[hotEffects[0].id].map((round, index) => (
                        <div key={index} className="formula-round-item" style={{
                          background: 'rgba(20, 30, 50, 0.5)',
                          borderRadius: '6px',
                          padding: '12px',
                          marginBottom: '10px',
                          border: '1px solid rgba(68, 255, 0, 0.3)'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            marginBottom: '8px',
                            borderBottom: '1px solid rgba(68, 255, 0, 0.2)',
                            paddingBottom: '8px'
                          }}>
                            <div style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(68, 255, 0, 0.2)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginRight: '8px',
                              fontWeight: 'bold',
                              color: '#44ff00'
                            }}>{round.round}</div>
                            <div style={{ fontWeight: 'bold', color: '#44ff00' }}>Round {round.round}</div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ flex: '0 0 80px', color: '#cdd6f4' }}>Formula:</div>
                            <input
                              type="text"
                              value={round.formula}
                              onChange={(e) => handleFormulaChange(hotEffects[0].id, index, e.target.value)}
                              style={{
                                flex: 1,
                                background: 'rgba(49, 50, 68, 0.6)',
                                border: '1px solid #45475a',
                                borderRadius: '4px',
                                color: '#ffcc00',
                                padding: '6px 10px',
                                fontFamily: 'monospace'
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      textAlign: 'center',
                      padding: '20px',
                      color: '#a0b9d9',
                      fontStyle: 'italic'
                    }}>
                      No HoT formulas configured yet
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="pf-section">
          <h3 className="pf-section-title">Resource Cost</h3>
          <p className="pf-section-description">Configure how resources are consumed while channeling</p>

          <div className="selected-effect" style={{
            background: 'rgba(30, 40, 60, 0.6)',
            borderRadius: '8px',
            border: '1px solid #2c3e50',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
          }}>
            <div className="effect-header" style={{
              background: 'rgba(44, 62, 80, 0.7)',
              padding: '12px 16px',
              borderBottom: '1px solid #34495e',
              display: 'flex',
              alignItems: 'center'
            }}>
              <div className="effect-icon" style={{
                background: 'rgba(255, 204, 0, 0.2)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '12px'
              }}>
                <FontAwesomeIcon icon={faCoins} style={{ color: '#ffcc00', fontSize: '20px' }} />
              </div>
              <div className="effect-info">
                <div className="effect-name" style={{
                  color: '#ffcc00',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  marginBottom: '4px'
                }}>Channeling Resource Cost</div>
                <div className="effect-description" style={{
                  color: '#a0b9d9',
                  fontSize: '13px'
                }}>
                  Configure the ongoing resource cost while maintaining the channel
                </div>
              </div>
            </div>

            <div className="effect-custom-config" style={{ padding: '16px' }}>
              <div className="wow-conditional-settings">
                <div className="wow-conditional-subtitle" style={{
                  color: '#89dceb',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '12px',
                  borderBottom: '1px solid rgba(137, 220, 235, 0.3)',
                  paddingBottom: '8px'
                }}>Resource Settings</div>

                <div className="stat-cards-grid" style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '15px',
                  marginBottom: '16px'
                }}>
                  {/* Cost Value Card */}
                  <div className="wow-effect-button" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '12px',
                    background: 'rgba(30, 30, 46, 0.6)',
                    border: '1px solid #313244',
                    borderRadius: '6px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '8px',
                      borderBottom: '1px solid rgba(255, 204, 0, 0.2)',
                      paddingBottom: '8px'
                    }}>
                      <FontAwesomeIcon icon={faCoins} style={{
                        fontSize: '18px',
                        color: '#ffcc00',
                        marginRight: '8px',
                        filter: 'drop-shadow(0 0 2px rgba(255, 204, 0, 0.3))'
                      }} />
                      <div style={{ fontWeight: 'bold', color: '#ffcc00' }}>Cost Amount</div>
                    </div>

                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginBottom: '12px',
                      justifyContent: 'center'
                    }}>
                      <button
                        className="custom-button"
                        onClick={() => handleChannelingConfigChange({ costValue: Math.max(0, channelingConfig.costValue - 1) })}
                        style={{
                          background: 'rgba(49, 50, 68, 0.6)',
                          border: '1px solid #45475a',
                          borderRadius: '4px',
                          color: '#cdd6f4',
                          width: '30px',
                          height: '30px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <FontAwesomeIcon icon={faMinus} />
                      </button>
                      <input
                        type="number"
                        min="0"
                        value={channelingConfig.costValue}
                        onChange={(e) => handleChannelingConfigChange({ costValue: Math.max(0, parseInt(e.target.value) || 0) })}
                        style={{
                          background: 'rgba(49, 50, 68, 0.6)',
                          border: '1px solid #45475a',
                          borderRadius: '4px',
                          color: '#ffcc00',
                          padding: '6px 8px',
                          margin: '0 8px',
                          width: '60px',
                          textAlign: 'center',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}
                      />
                      <button
                        className="custom-button"
                        onClick={() => handleChannelingConfigChange({ costValue: channelingConfig.costValue + 1 })}
                        style={{
                          background: 'rgba(49, 50, 68, 0.6)',
                          border: '1px solid #45475a',
                          borderRadius: '4px',
                          color: '#cdd6f4',
                          width: '30px',
                          height: '30px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </button>
                    </div>

                    <div style={{
                      fontSize: '12px',
                      color: '#bac2de',
                      background: 'rgba(0, 0, 0, 0.2)',
                      padding: '8px',
                      borderRadius: '4px',
                      textAlign: 'center',
                      boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.2)'
                    }}>
                      <span style={{
                        fontWeight: 'bold',
                        fontSize: '14px',
                        color: channelingConfig.costType === 'mana' ? '#0077ff' :
                               channelingConfig.costType === 'rage' ? '#ff0000' :
                               channelingConfig.costType === 'energy' ? '#ffff00' :
                               channelingConfig.costType === 'focus' ? '#00ff00' :
                               channelingConfig.costType === 'health' ? '#ff3399' : '#ffffff',
                        textShadow: '0 0 3px rgba(0, 0, 0, 0.5)'
                      }}>
                        {channelingConfig.costValue || 0} {channelingConfig.costType || 'mana'}
                      </span>
                      <span style={{ fontStyle: 'italic' }}>
                        {channelingConfig.costTrigger === 'per_second' ? ' per second' :
                         channelingConfig.costTrigger === 'per_turn' ? ' per turn' :
                         ' per round'}
                      </span>
                    </div>
                  </div>

                  {/* Resource Type Options */}
                  <div className="wow-effect-button" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '12px',
                    background: 'rgba(30, 30, 46, 0.6)',
                    border: '1px solid #313244',
                    borderRadius: '6px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <FontAwesomeIcon icon={faGem} style={{ fontSize: '18px', color: '#a335ee', marginRight: '8px' }} />
                      <div style={{ fontWeight: 'bold', color: '#cdd6f4' }}>Resource Type</div>
                    </div>

                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '8px',
                      marginBottom: '8px'
                    }}>
                      {[
                        { type: 'mana', color: '#0077ff', icon: faGem },
                        { type: 'rage', color: '#ff0000', icon: faBolt },
                        { type: 'energy', color: '#ffff00', icon: faChartLine },
                        { type: 'focus', color: '#00ff00', icon: faBalanceScale },
                        { type: 'health', color: '#ff3399', icon: faShieldAlt }
                      ].map(resource => {
                        // Check if this is the resource type from the previous step
                        const isFromPreviousStep = state.resourceCost?.primaryResourceType === resource.type;

                        return (
                          <div
                            key={resource.type}
                            onClick={() => handleChannelingConfigChange({ costType: resource.type })}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              padding: '6px 4px',
                              background: channelingConfig.costType === resource.type ? `rgba(${
                                resource.color === '#0077ff' ? '0, 119, 255' :
                                resource.color === '#ff0000' ? '255, 0, 0' :
                                resource.color === '#ffff00' ? '255, 255, 0' :
                                resource.color === '#00ff00' ? '0, 255, 0' :
                                resource.color === '#ff3399' ? '255, 51, 153' : '255, 255, 255'
                              }, 0.2)` : 'rgba(49, 50, 68, 0.6)',
                              border: channelingConfig.costType === resource.type ? `1px solid ${resource.color}` : '1px solid #45475a',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              boxShadow: channelingConfig.costType === resource.type ? `0 0 5px ${resource.color}` : 'none'
                            }}
                          >
                            <FontAwesomeIcon
                              icon={resource.icon}
                              style={{
                                marginRight: '5px',
                                color: resource.color,
                                fontSize: '14px'
                              }}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <span style={{
                                fontWeight: channelingConfig.costType === resource.type ? 'bold' : 'normal',
                                color: channelingConfig.costType === resource.type ? resource.color : '#cdd6f4'
                              }}>
                                {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                              </span>
                              {isFromPreviousStep && (
                                <span style={{ fontSize: '0.7rem', color: '#66ccff', marginTop: '2px' }}>
                                  (From Resources)
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div style={{
                      fontSize: '12px',
                      color: '#bac2de',
                      background: 'rgba(0, 0, 0, 0.2)',
                      padding: '8px',
                      borderRadius: '4px',
                      textAlign: 'center'
                    }}>
                      {state.resourceCost?.primaryResourceType ?
                        `Using ${state.resourceCost.primaryResourceType} from Resources step` :
                        "Select resource type for channeling"}
                    </div>
                  </div>

                  {/* Cost Trigger Options */}
                  <div className="wow-effect-button" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '12px',
                    background: 'rgba(30, 30, 46, 0.6)',
                    border: '1px solid #313244',
                    borderRadius: '6px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <FontAwesomeIcon icon={faClock} style={{ fontSize: '18px', color: 'var(--pf-brown-medium)', marginRight: '8px' }} />
                      <div style={{ fontWeight: 'bold', color: '#cdd6f4' }}>Cost Frequency</div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '8px' }}>
                      {[
                        { id: 'per_round', label: 'Per Round', icon: faBalanceScale, desc: 'Once per combat round' },
                        { id: 'per_turn', label: 'Per Turn', icon: faClock, desc: 'On each of your turns' }
                      ].map(trigger => (
                        <div
                          key={trigger.id}
                          onClick={() => handleChannelingConfigChange({ costTrigger: trigger.id })}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '8px',
                            background: channelingConfig.costTrigger === trigger.id ? 'var(--pf-gradient-parchment-light)' : 'rgba(49, 50, 68, 0.6)',
                            border: channelingConfig.costTrigger === trigger.id ? '1px solid var(--pf-brown-medium)' : '1px solid #45475a',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          <FontAwesomeIcon
                            icon={trigger.icon}
                            style={{
                              marginRight: '8px',
                              color: 'var(--pf-brown-medium)',
                              fontSize: '16px'
                            }}
                          />
                          <div style={{ textAlign: 'left' }}>
                            <div style={{
                              fontWeight: channelingConfig.costTrigger === trigger.id ? 'bold' : 'normal',
                              color: channelingConfig.costTrigger === trigger.id ? '#89b4fa' : '#cdd6f4'
                            }}>
                              {trigger.label}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#bac2de' }}>{trigger.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{
                      fontSize: '12px',
                      color: '#bac2de',
                      background: 'rgba(0, 0, 0, 0.2)',
                      padding: '8px',
                      borderRadius: '4px',
                      textAlign: 'center'
                    }}>
                      {channelingConfig.costTrigger === 'per_round' ?
                        "Resources consumed once per combat round" :
                        "Resources consumed at the start of each turn"}
                    </div>
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: 'rgba(0, 0, 0, 0.3)',
                  padding: '12px',
                  borderRadius: '6px',
                  marginTop: '8px',
                  border: '1px solid rgba(255, 204, 0, 0.3)',
                  boxShadow: 'inset 0 0 10px rgba(0, 0, 0, 0.2)'
                }}>
                  <FontAwesomeIcon icon={faInfoCircle} style={{
                    color: '#ffcc00',
                    marginRight: '12px',
                    fontSize: '20px',
                    filter: 'drop-shadow(0 0 3px rgba(255, 204, 0, 0.5))'
                  }} />
                  <div style={{ fontSize: '14px', color: '#cdd6f4', lineHeight: '1.4' }}>
                    <strong style={{ color: '#ffcc00' }}>Resource Cost:</strong> <span style={{
                      color: channelingConfig.costType === 'mana' ? '#0077ff' :
                             channelingConfig.costType === 'rage' ? '#ff0000' :
                             channelingConfig.costType === 'energy' ? '#ffff00' :
                             channelingConfig.costType === 'focus' ? '#00ff00' :
                             channelingConfig.costType === 'health' ? '#ff3399' : '#ffffff',
                      fontWeight: 'bold',
                      fontSize: '16px',
                      textShadow: '0 0 3px rgba(0, 0, 0, 0.5)'
                    }}>{channelingConfig.costValue} {channelingConfig.costType}</span>
                    <span style={{
                      color: '#a0b9d9',
                      fontStyle: 'italic'
                    }}>{channelingConfig.costTrigger === 'per_round' ? ' per round' : ' per turn'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>





          {/* Area Expansion Settings - Always visible when applicable */}
          {(targetingConfig.targetingType === 'area' ||
            (propagation && propagation.method) ||
            (targetingConfig.rangeType === 'ranged' && targetingConfig.rangeDistance)) && (
            <div className="selected-effect area-expansion-section">
              <div className="effect-header">
                <div className="effect-icon">
                  <FontAwesomeIcon icon={faArrowsAlt} style={{ color: '#9b59b6' }} />
                </div>
                <div className="effect-info">
                  <div className="effect-name">Area Expansion Settings</div>
                  <div className="effect-description">
                    Configure how the spell's area grows over time
                  </div>
                </div>
              </div>
              <div className="effect-custom-config">
                {/* Source indicator */}
                <div className="area-expansion-source">
                  {targetingConfig.targetingType === 'area' && targetingConfig.aoeShape && (
                    <div className="source-badge targeting-source">
                      <FontAwesomeIcon icon={
                        targetingConfig.aoeShape === 'circle' || targetingConfig.aoeShape === 'sphere' ? faCircle :
                        targetingConfig.aoeShape === 'square' || targetingConfig.aoeShape === 'cube' ? faSquare :
                        targetingConfig.aoeShape === 'cone' ? faPlay :
                        targetingConfig.aoeShape === 'line' ? faRuler : faCircle
                      } />
                      <span>From Targeting: {targetingConfig.aoeShape.charAt(0).toUpperCase() + targetingConfig.aoeShape.slice(1)}</span>
                    </div>
                  )}
                  {propagation && propagation.method && (
                    <div className="source-badge propagation-source">
                      <FontAwesomeIcon icon={
                        propagation.method === 'explosion' ? faBomb :
                        propagation.method === 'chain' ? faLink :
                        propagation.method === 'spreading' ? faWind : faBomb
                      } />
                      <span>From Propagation: {propagation.method.charAt(0).toUpperCase() + propagation.method.slice(1)}</span>
                    </div>
                  )}
                  {targetingConfig.rangeType === 'ranged' && targetingConfig.rangeDistance && (
                    <div className="source-badge range-source">
                      <FontAwesomeIcon icon={faRulerHorizontal} />
                      <span>From Range: {targetingConfig.rangeDistance}ft</span>
                    </div>
                  )}
                </div>

                <div className="custom-config-row">
                  <div className="custom-config-label">Initial Radius:</div>
                  <div className="custom-config-control">
                    <button
                      className="custom-button"
                      onClick={() => handleChannelingConfigChange({ initialRadius: Math.max(1, channelingConfig.initialRadius - 1) })}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={channelingConfig.initialRadius}
                      onChange={(e) => handleChannelingConfigChange({ initialRadius: Math.max(1, parseInt(e.target.value) || 1) })}
                      className="custom-number-input"
                    />
                    <button
                      className="custom-button"
                      onClick={() => handleChannelingConfigChange({ initialRadius: channelingConfig.initialRadius + 1 })}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                    <span className="custom-unit">feet</span>
                  </div>
                </div>
                <div className="custom-config-row">
                  <div className="custom-config-label">Maximum Radius:</div>
                  <div className="custom-config-control">
                    <button
                      className="custom-button"
                      onClick={() => handleChannelingConfigChange({ maxRadius: Math.max(channelingConfig.initialRadius + 5, channelingConfig.maxRadius - 5) })}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <input
                      type="number"
                      min={channelingConfig.initialRadius + 5}
                      value={channelingConfig.maxRadius}
                      onChange={(e) => handleChannelingConfigChange({ maxRadius: Math.max(channelingConfig.initialRadius + 5, parseInt(e.target.value) || channelingConfig.initialRadius + 5) })}
                      className="custom-number-input"
                    />
                    <button
                      className="custom-button"
                      onClick={() => handleChannelingConfigChange({ maxRadius: channelingConfig.maxRadius + 5 })}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                    <span className="custom-unit">feet</span>
                  </div>
                </div>
                <div className="custom-config-row">
                  <div className="custom-config-label">Expansion Rate:</div>
                  <div className="custom-config-control">
                    <button
                      className="custom-button"
                      onClick={() => handleChannelingConfigChange({ expansionRate: Math.max(1, channelingConfig.expansionRate - 1) })}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={channelingConfig.expansionRate}
                      onChange={(e) => handleChannelingConfigChange({ expansionRate: Math.max(1, parseInt(e.target.value) || 1) })}
                      className="custom-number-input"
                    />
                    <button
                      className="custom-button"
                      onClick={() => handleChannelingConfigChange({ expansionRate: channelingConfig.expansionRate + 1 })}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                    <span className="custom-unit">feet/{channelingConfig.durationUnit === 'rounds' ? 'round' : 'turn'}</span>
                  </div>
                </div>
                <div className="custom-hint">
                  Area expands by {channelingConfig.expansionRate} feet each {channelingConfig.durationUnit === 'rounds' ? 'round' : 'turn'}
                </div>

                {channelingConfig.targetingDescription && (
                  <div className="targeting-description">
                    <FontAwesomeIcon icon={faInfoCircle} style={{ marginRight: '8px', color: 'var(--pf-brown-medium)' }} />
                    <span>{channelingConfig.targetingDescription}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Expansion Pattern - Also visible when appropriate targeting/propagation settings are present */}
          {(targetingConfig.targetingType === 'area' ||
            (propagation && propagation.method) ||
            (targetingConfig.rangeType === 'ranged' && targetingConfig.rangeDistance)) && (
            <div className="selected-effect area-expansion-section">
              <div className="effect-header">
                <div className="effect-icon">
                  <FontAwesomeIcon icon={faArrowsAlt} style={{ color: '#9b59b6' }} />
                </div>
                <div className="effect-info">
                  <div className="effect-name">Expansion Pattern</div>
                  <div className="effect-description">
                    How the area expands over time
                  </div>
                </div>
              </div>
              <div className="effect-custom-config">
                <div className="custom-config-row">
                  <div className="custom-config-label">Pattern:</div>
                  <div className="specific-types-grid">
                    {[
                      { id: 'linear', label: 'Linear', desc: 'Steady growth until reaching maximum radius' },
                      { id: 'pulsing', label: 'Pulsing', desc: 'Cycles between expanding and contracting' },
                      { id: 'erratic', label: 'Erratic', desc: 'Unpredictable changes in radius' }
                    ].map(type => (
                      <div
                        key={type.id}
                        className={`specific-type-option ${channelingConfig.expansionType === type.id ? 'selected' : ''}`}
                        onClick={() => handleChannelingConfigChange({ expansionType: type.id })}
                      >
                        <span className="specific-type-name">{type.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="custom-hint">
                  {channelingConfig.expansionType === 'linear' &&
                    "Linear expansion grows at a steady rate until reaching maximum radius"}
                  {channelingConfig.expansionType === 'pulsing' &&
                    "Pulsing expansion cycles between growing and shrinking for tactical timing"}
                  {channelingConfig.expansionType === 'erratic' &&
                    "Erratic expansion changes unpredictably, making it harder to predict or avoid"}
                </div>
              </div>

              {/* Area Expansion Visualization */}
              <div className="targeting-visualization" style={{ marginTop: '16px' }}>
                {/* Center caster */}
                <div className="targeting-caster"></div>

                {/* Target point if ranged */}
                {targetingConfig.rangeType === 'ranged' && targetingConfig.rangeDistance > 5 && (
                  <div className="targeting-target" style={{
                    left: '60%',
                    top: '40%'
                  }}></div>
                )}

                {/* Initial radius circle */}
                <div className="targeting-area" style={{
                  width: `${channelingConfig.initialRadius * 2}px`,
                  height: `${channelingConfig.initialRadius * 2}px`,
                  borderRadius: targetingConfig.aoeShape === 'square' || targetingConfig.aoeShape === 'cube' ? '0' : '50%',
                  border: '1px dashed rgba(41, 128, 185, 0.5)',
                  backgroundColor: 'transparent',
                  opacity: 0.5,
                  position: 'absolute',
                  left: targetingConfig.rangeType === 'ranged' && targetingConfig.rangeDistance > 5 ? '60%' : '50%',
                  top: targetingConfig.rangeType === 'ranged' && targetingConfig.rangeDistance > 5 ? '40%' : '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1
                }}></div>

                {/* Maximum radius circle */}
                <div className="targeting-area" style={{
                  width: `${channelingConfig.maxRadius * 2}px`,
                  height: `${channelingConfig.maxRadius * 2}px`,
                  borderRadius: targetingConfig.aoeShape === 'square' || targetingConfig.aoeShape === 'cube' ? '0' : '50%',
                  border: '1px dashed rgba(231, 76, 60, 0.5)',
                  backgroundColor: 'transparent',
                  opacity: 0.5,
                  position: 'absolute',
                  left: targetingConfig.rangeType === 'ranged' && targetingConfig.rangeDistance > 5 ? '60%' : '50%',
                  top: targetingConfig.rangeType === 'ranged' && targetingConfig.rangeDistance > 5 ? '40%' : '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 1
                }}></div>

                {/* Current radius circle with animation */}
                <div className="targeting-area" style={{
                  width: `${channelingConfig.initialRadius * 2}px`,
                  height: `${channelingConfig.initialRadius * 2}px`,
                  borderRadius: targetingConfig.aoeShape === 'square' || targetingConfig.aoeShape === 'cube' ? '0' :
                               targetingConfig.aoeShape === 'cone' ? '0 50% 50% 50%' : '50%',
                  border: '2px solid rgba(46, 204, 113, 0.7)',
                  backgroundColor: 'rgba(46, 204, 113, 0.2)',
                  position: 'absolute',
                  left: targetingConfig.rangeType === 'ranged' && targetingConfig.rangeDistance > 5 ? '60%' : '50%',
                  top: targetingConfig.rangeType === 'ranged' && targetingConfig.rangeDistance > 5 ? '40%' : '50%',
                  transform: targetingConfig.aoeShape === 'cone' ?
                             'rotate(45deg) translate(0, 0)' : 'translate(-50%, -50%)',
                  zIndex: 2,
                  animation: `${channelingConfig.expansionType === 'linear' ? 'expandLinear' :
                              channelingConfig.expansionType === 'pulsing' ? 'expandPulsing' :
                              'expandErratic'} 4s infinite ${channelingConfig.expansionType === 'pulsing' ? '' : 'alternate'}`,
                  animationTimingFunction: 'ease-in-out'
                }}></div>

                <style jsx>{`
                  @keyframes expandLinear {
                    0% { width: ${channelingConfig.initialRadius * 2}px; height: ${channelingConfig.initialRadius * 2}px; }
                    100% { width: ${channelingConfig.maxRadius * 2}px; height: ${channelingConfig.maxRadius * 2}px; }
                  }
                  @keyframes expandPulsing {
                    0% { width: ${channelingConfig.initialRadius * 2}px; height: ${channelingConfig.initialRadius * 2}px; }
                    50% { width: ${channelingConfig.maxRadius * 2}px; height: ${channelingConfig.maxRadius * 2}px; }
                    100% { width: ${channelingConfig.initialRadius * 2}px; height: ${channelingConfig.initialRadius * 2}px; }
                  }
                  @keyframes expandErratic {
                    0% { width: ${channelingConfig.initialRadius * 2}px; height: ${channelingConfig.initialRadius * 2}px; }
                    20% { width: ${channelingConfig.initialRadius * 3}px; height: ${channelingConfig.initialRadius * 3}px; }
                    40% { width: ${channelingConfig.maxRadius * 0.7 * 2}px; height: ${channelingConfig.maxRadius * 0.7 * 2}px; }
                    60% { width: ${channelingConfig.maxRadius * 0.5 * 2}px; height: ${channelingConfig.maxRadius * 0.5 * 2}px; }
                    80% { width: ${channelingConfig.maxRadius * 0.9 * 2}px; height: ${channelingConfig.maxRadius * 0.9 * 2}px; }
                    100% { width: ${channelingConfig.maxRadius * 2}px; height: ${channelingConfig.maxRadius * 2}px; }
                  }
                `}</style>
              </div>

              <div className="effect-option-description mt-xs" style={{ textAlign: 'center', padding: '0 10px' }}>
                {channelingConfig.targetingDescription ? (
                  <strong>{channelingConfig.targetingDescription}</strong>
                ) : (
                  <span>
                    <strong>Visualization:</strong> Initial radius {channelingConfig.initialRadius}ft expanding to {channelingConfig.maxRadius}ft at {channelingConfig.expansionRate}ft per {channelingConfig.durationUnit === 'rounds' ? 'round' : 'turn'}
                  </span>
                )}
              </div>

              {channelingConfig.fromTargeting && (
                <div className="effect-option-description" style={{ textAlign: 'center', color: 'var(--wizard-primary-light)', fontSize: '12px', padding: '0 10px' }}>
                  <em>Settings based on your targeting configuration from Step 4</em>
                </div>
              )}
            </div>
          )}

          {/* Defensive Settings - Only shown when buff effects are present */}
          {effectTypes.includes('buff') && (
            <div className="selected-effect area-expansion-section">
              <div className="effect-header">
                <div className="effect-icon">
                  <FontAwesomeIcon icon={faShieldAlt} style={{ color: 'var(--pf-brown-medium)' }} />
                </div>
                <div className="effect-info">
                  <div className="effect-name">Defensive Settings</div>
                  <div className="effect-description">
                    Configure damage reduction that scales with channeling
                  </div>
                </div>
              </div>
              <div className="effect-custom-config">
                <div className="custom-config-row">
                  <div className="custom-config-label">Starting Damage Reduction (%):</div>
                  <div className="custom-config-control">
                    <button
                      className="custom-button"
                      onClick={() => handleChannelingConfigChange({ damageReduction: Math.max(1, channelingConfig.damageReduction - 1) })}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <input
                      type="number"
                      min="1"
                      max="90"
                      value={channelingConfig.damageReduction}
                      onChange={(e) => handleChannelingConfigChange({ damageReduction: Math.max(1, Math.min(90, parseInt(e.target.value) || 1)) })}
                      className="custom-number-input"
                    />
                    <button
                      className="custom-button"
                      onClick={() => handleChannelingConfigChange({ damageReduction: Math.min(90, channelingConfig.damageReduction + 1) })}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                    <span className="custom-unit">%</span>
                  </div>
                </div>
                <div className="custom-config-row">
                  <div className="custom-config-label">Maximum Damage Reduction (%):</div>
                  <div className="custom-config-control">
                    <button
                      className="custom-button"
                      onClick={() => handleChannelingConfigChange({ maxDamageReduction: Math.max(channelingConfig.damageReduction, channelingConfig.maxDamageReduction - 1) })}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <input
                      type="number"
                      min={channelingConfig.damageReduction}
                      max="99"
                      value={channelingConfig.maxDamageReduction}
                      onChange={(e) => handleChannelingConfigChange({ maxDamageReduction: Math.max(channelingConfig.damageReduction, Math.min(99, parseInt(e.target.value) || channelingConfig.damageReduction)) })}
                      className="custom-number-input"
                    />
                    <button
                      className="custom-button"
                      onClick={() => handleChannelingConfigChange({ maxDamageReduction: Math.min(99, channelingConfig.maxDamageReduction + 1) })}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                    <span className="custom-unit">%</span>
                  </div>
                </div>
                <div className="custom-config-row">
                  <div className="custom-config-label">Resistance Type:</div>
                  <div className="specific-types-grid">
                    {[
                      { id: 'physical', label: 'Physical' },
                      { id: 'magical', label: 'Magical' },
                      { id: 'elemental', label: 'Elemental' },
                      { id: 'all', label: 'All Damage' }
                    ].map(type => (
                      <div
                        key={type.id}
                        className={`specific-type-option ${channelingConfig.resistanceType === type.id ? 'selected' : ''}`}
                        onClick={() => handleChannelingConfigChange({ resistanceType: type.id })}
                      >
                        <span className="specific-type-name">{type.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="custom-hint">
                  Damage reduction increases from {channelingConfig.damageReduction}% to {channelingConfig.maxDamageReduction}% as the channel continues
                </div>
              </div>
            </div>
          )}

          {/* Mana Burn Specific Options */}
          {channelingConfig.type === 'mana_burn' && (
            <div className="mt-md">
              <div className="section-header">Resource Conversion Settings</div>

              <div className="effect-numeric-input">
                <label>Conversion Rate (%)</label>
                <div className="effect-numeric-controls">
                  <button
                    className="effect-numeric-button"
                    onClick={() => handleChannelingConfigChange({ resourceConversionRate: Math.max(10, channelingConfig.resourceConversionRate - 10) })}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="10"
                    max="200"
                    step="10"
                    value={channelingConfig.resourceConversionRate}
                    onChange={(e) => handleChannelingConfigChange({ resourceConversionRate: Math.max(10, Math.min(200, parseInt(e.target.value) || 10)) })}
                  />
                  <button
                    className="effect-numeric-button"
                    onClick={() => handleChannelingConfigChange({ resourceConversionRate: Math.min(200, channelingConfig.resourceConversionRate + 10) })}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="config-option">
                <label className="effect-option-label">Conversion Effect</label>
                <select
                  className="effect-select"
                  value={channelingConfig.resourceConversionEffect}
                  onChange={(e) => handleChannelingConfigChange({ resourceConversionEffect: e.target.value })}
                >
                  <option value="damage">Damage</option>
                  <option value="healing">Healing</option>
                  <option value="buff">Buff Effect</option>
                  <option value="shield">Shield/Barrier</option>
                </select>
              </div>
            </div>
          )}

          {/* Persistent Effect Specific Options */}
          {channelingConfig.type === 'persistent' && (
            <div className="mt-md">
              <div className="section-header">Persistent Effect Settings</div>

              <div className="targeting-options" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))' }}>
                {/* Effect Type Card */}
                <div className="targeting-option-card">
                  <div className="targeting-option-header">
                    <div className="targeting-option-icon">
                      <FontAwesomeIcon icon={faClock} />
                    </div>
                    <div className="targeting-option-name">Effect Type</div>
                  </div>
                  <div className="targeting-option-description">
                    How the persistent effect manifests
                  </div>
                  <div className="resource-type-buttons" style={{ marginTop: '10px', display: 'flex', flexWrap: 'wrap', gap: '5px', justifyContent: 'center' }}>
                    {[
                      { id: 'aura', label: 'Aura' },
                      { id: 'field', label: 'Field' },
                      { id: 'beam', label: 'Beam' }
                    ].map(type => (
                      <button
                        key={type.id}
                        className={`resource-type-button ${channelingConfig.persistentEffectType === type.id ? 'selected' : ''}`}
                        style={{
                          padding: '5px 10px',
                          borderRadius: '4px',
                          border: channelingConfig.persistentEffectType === type.id ? '1px solid var(--wizard-primary)' : '1px solid var(--wizard-border)',
                          background: channelingConfig.persistentEffectType === type.id ? 'rgba(0, 116, 224, 0.1)' : 'rgba(0, 0, 0, 0.2)',
                          color: 'var(--wizard-text)',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleChannelingConfigChange({ persistentEffectType: type.id })}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Radius Card */}
                <div className="targeting-option-card">
                  <div className="targeting-option-header">
                    <div className="targeting-option-icon">
                      <FontAwesomeIcon icon={faArrowsAlt} />
                    </div>
                    <div className="targeting-option-name">Effect Size</div>
                  </div>
                  <div className="targeting-option-description">
                    Size of the persistent effect area
                  </div>
                  <div className="effect-numeric-input" style={{ marginTop: '10px' }}>
                    <div className="effect-numeric-controls">
                      <button
                        className="effect-numeric-button"
                        onClick={() => handleChannelingConfigChange({ persistentRadius: Math.max(5, channelingConfig.persistentRadius - 5) })}
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="5"
                        step="5"
                        value={channelingConfig.persistentRadius}
                        onChange={(e) => handleChannelingConfigChange({ persistentRadius: Math.max(5, parseInt(e.target.value) || 5) })}
                      />
                      <button
                        className="effect-numeric-button"
                        onClick={() => handleChannelingConfigChange({ persistentRadius: channelingConfig.persistentRadius + 5 })}
                      >
                        +
                      </button>
                    </div>
                    <div className="effect-option-description" style={{ textAlign: 'center', marginTop: '5px' }}>
                      {channelingConfig.persistentRadius} feet
                    </div>
                  </div>
                </div>
              </div>

              {channelingConfig.persistentDescription && (
                <div className="effect-option-description mt-md" style={{ textAlign: 'center', padding: '10px', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: '4px' }}>
                  <strong>{channelingConfig.persistentDescription}</strong>
                </div>
              )}

              {channelingConfig.fromTargeting && (
                <div className="effect-option-description" style={{ textAlign: 'center', color: 'var(--wizard-primary-light)', fontSize: '12px', padding: '5px' }}>
                  <em>Settings based on your targeting configuration from Step 4</em>
                </div>
              )}
            </div>
          )}

          {/* Staged Effect Specific Options */}
          {channelingConfig.type === 'staged' && (
            <div className="mt-md">
              <div className="section-header">Staged Effect Settings</div>

              <div className="selected-stats">
                {channelingConfig.stages && channelingConfig.stages.map((stage, index) => (
                  <div key={index} className="selected-stat">
                    <div className="stat-info">
                      <div className="stat-name">Stage {index + 1}</div>
                      <div className="stat-description">
                        At {stage.threshold} seconds: {stage.effect}
                      </div>
                      <div className="text-muted small">
                        {stage.description}
                      </div>
                    </div>
                    <div className="stat-value-controls">
                      <label>Seconds:</label>
                      <input
                        type="number"
                        min={index === 0 ? 1 : channelingConfig.stages[index-1].threshold + 1}
                        max={channelingConfig.maxDuration}
                        value={stage.threshold}
                        onChange={(e) => {
                          const stages = [...channelingConfig.stages];
                          stages[index].threshold = parseInt(e.target.value) || index + 1;
                          handleChannelingConfigChange({ stages });
                        }}
                        className="hot-input"
                      />
                    </div>
                    <div className="stat-value-controls">
                      <label>Effect:</label>
                      <input
                        type="text"
                        value={stage.effect}
                        onChange={(e) => {
                          const stages = [...channelingConfig.stages];
                          stages[index].effect = e.target.value;
                          handleChannelingConfigChange({ stages });
                        }}
                        className="hot-input"
                      />
                    </div>
                    {index > 0 && (
                      <button
                        className="remove-stat"
                        onClick={() => {
                          const stages = [...channelingConfig.stages];
                          stages.splice(index, 1);
                          handleChannelingConfigChange({ stages });
                        }}
                      >×</button>
                    )}
                  </div>
                ))}

                <button
                  className="pf-button mt-sm"
                  onClick={() => {
                    if (!channelingConfig.stages) {
                      handleChannelingConfigChange({
                        stages: [{ threshold: 1, effect: 'Base Effect', description: 'Initial stage effect' }]
                      });
                    } else {
                      const stages = [...channelingConfig.stages];
                      const lastStage = stages[stages.length - 1];
                      stages.push({
                        threshold: lastStage.threshold + 1,
                        effect: 'New Effect',
                        description: 'Additional stage effect'
                      });
                      handleChannelingConfigChange({ stages });
                    }
                  }}
                  disabled={channelingConfig.stages && channelingConfig.stages.length >= channelingConfig.maxDuration}
                >
                  + Add Stage
                </button>
              </div>
            </div>
          )}

          {/* Removed old scaling effect and power scaling sections */}
        </div>

        {/* Preview */}
        <div className="effect-preview mt-lg" style={{
          background: 'linear-gradient(135deg, rgba(17, 27, 51, 0.9), rgba(20, 30, 45, 0.9))',
          borderRadius: '8px',
          border: '1px solid #1a3c6e',
          overflow: 'hidden',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
        }}>
            <div className="effect-preview-header" style={{
              background: 'linear-gradient(to bottom, rgba(30, 40, 70, 0.8), rgba(25, 35, 60, 0.8))',
              padding: '16px',
              borderBottom: '1px solid var(--pf-brown-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '16px'
            }}>
              <div className="effect-preview-icon" style={{
                width: '48px',
                height: '48px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(255, 215, 0, 0.15)',
                borderRadius: '50%',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                boxShadow: '0 0 10px rgba(255, 215, 0, 0.2)'
              }}>
                <FontAwesomeIcon icon={faClock} style={{
                  fontSize: '24px',
                  color: '#ffd700',
                  filter: 'drop-shadow(0 0 3px rgba(255, 215, 0, 0.5))'
                }} />
              </div>
              <div className="effect-preview-title">
                <h4 style={{
                  margin: '0 0 4px 0',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#66ccff',
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  textShadow: '0 0 5px rgba(102, 204, 255, 0.5)'
                }}>Channeled Spell</h4>
                <div className="effect-preview-subtitle" style={{
                  fontSize: '14px',
                  color: '#a0b9d9'
                }}>
                  Max {channelingConfig.maxDuration} {channelingConfig.durationUnit}
                </div>
              </div>
            </div>

            <div className="effect-preview-description" style={{
              padding: '12px 16px',
              borderBottom: '1px solid var(--pf-brown-light)',
              color: '#a0b9d9',
              fontSize: '14px',
              fontStyle: 'italic',
              background: 'rgba(0, 0, 0, 0.2)'
            }}>
              This spell is maintained over time, with effects that scale as channeling continues.
            </div>

            <div className="effect-preview-details" style={{
              padding: '16px'
            }}>
              <div className="effect-preview-detail" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                padding: '8px 12px',
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '6px',
                border: '1px solid rgba(30, 40, 60, 0.5)'
              }}>
                <div className="detail-label" style={{
                  color: '#a0b9d9',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>Resource Cost:</div>
                <div className="detail-value" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <span style={{
                    fontWeight: 'bold',
                    color: channelingConfig.costType === 'mana' ? '#0077ff' :
                           channelingConfig.costType === 'rage' ? '#ff0000' :
                           channelingConfig.costType === 'energy' ? '#ffff00' :
                           channelingConfig.costType === 'focus' ? '#00ff00' :
                           channelingConfig.costType === 'health' ? '#ff3399' : '#ffffff',
                    fontSize: '16px',
                    textShadow: '0 0 3px rgba(0, 0, 0, 0.5)'
                  }}>
                    {channelingConfig.costValue} {channelingConfig.costType}
                  </span>
                  <span style={{
                    color: '#cdd6f4',
                    fontSize: '14px'
                  }}>
                    {channelingConfig.costTrigger === 'per_second' ? 'per second' :
                     channelingConfig.costTrigger === 'per_turn' ? 'per turn' :
                     'per round'}
                  </span>
                  {state.resourceCost?.primaryResourceType && channelingConfig.costType === state.resourceCost.primaryResourceType && (
                    <span style={{
                      marginLeft: '5px',
                      fontSize: '12px',
                      color: '#66ccff',
                      background: 'rgba(102, 204, 255, 0.1)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: '1px solid rgba(102, 204, 255, 0.3)'
                    }}>(from Resource step)</span>
                  )}
                </div>
              </div>

              {/* Show effect types from previous steps */}
              <div className="effect-preview-detail" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                padding: '8px 12px',
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '6px',
                border: '1px solid rgba(30, 40, 60, 0.5)'
              }}>
                <div className="detail-label" style={{
                  color: '#a0b9d9',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>Effect Types:</div>
                <div className="detail-value">
                  {effectTypes.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                      {effectTypes.map(effect => (
                        <span key={effect} style={{
                          padding: '3px 8px',
                          backgroundColor: 'var(--pf-gradient-parchment-light)',
                          borderRadius: '4px',
                          fontSize: '13px',
                          border: '1px solid var(--pf-brown-light)',
                          color: 'var(--pf-text-primary)',
                          fontWeight: 'bold'
                        }}>
                          {effect.charAt(0).toUpperCase() + effect.slice(1)}
                        </span>
                      ))}
                    </div>
                  ) : 'No effects selected'}
                </div>
              </div>

              {/* Show channeled DoT and HoT effects with per-round formulas */}
              {hasChanneledEffects && (
                <div className="effect-preview-detail" style={{
                  display: 'flex',
                  flexDirection: 'column',
                  marginBottom: '12px',
                  padding: '8px 12px',
                  background: 'rgba(0, 0, 0, 0.2)',
                  borderRadius: '6px',
                  border: '1px solid rgba(30, 40, 60, 0.5)'
                }}>
                  <div className="detail-label" style={{
                    color: '#a0b9d9',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    marginBottom: '8px',
                    borderBottom: '1px solid rgba(102, 204, 255, 0.2)',
                    paddingBottom: '4px'
                  }}>Channeled Effects:</div>
                  <div className="detail-value">
                    {dotEffects.length > 0 && (
                      <div style={{
                        marginBottom: '10px',
                        background: 'rgba(255, 68, 0, 0.1)',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: '1px solid rgba(255, 68, 0, 0.3)'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '6px'
                        }}>
                          <FontAwesomeIcon icon={faFire} style={{
                            color: '#ff4400',
                            marginRight: '8px',
                            filter: 'drop-shadow(0 0 2px rgba(255, 68, 0, 0.5))'
                          }} />
                          <strong style={{
                            color: '#ff4400',
                            fontSize: '14px'
                          }}>DoT ({dotEffects[0].damageType.charAt(0).toUpperCase() + dotEffects[0].damageType.slice(1)}):</strong>
                        </div>
                        {channelingConfig.perRoundFormulas &&
                         channelingConfig.perRoundFormulas[dotEffects[0].id] &&
                         channelingConfig.perRoundFormulas[dotEffects[0].id].length > 0 ? (
                          <ul className="preview-list" style={{
                            listStyle: 'none',
                            padding: '0',
                            margin: '0'
                          }}>
                            {channelingConfig.perRoundFormulas[dotEffects[0].id].map((round, index) => (
                              <li key={index} style={{
                                padding: '4px 8px',
                                marginBottom: '4px',
                                background: 'rgba(0, 0, 0, 0.2)',
                                borderRadius: '4px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}>
                                <strong style={{ color: '#cdd6f4' }}>Round {round.round}:</strong>
                                <span style={{
                                  color: '#ffcc00',
                                  fontFamily: 'monospace',
                                  background: 'rgba(0, 0, 0, 0.3)',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  fontSize: '13px'
                                }}>{round.formula}</span>
                                {round.description && (
                                  <span style={{
                                    color: '#a0b9d9',
                                    fontStyle: 'italic',
                                    fontSize: '12px'
                                  }}>{round.description}</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span style={{
                            color: '#cdd6f4',
                            fontFamily: 'monospace',
                            background: 'rgba(0, 0, 0, 0.3)',
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}>{dotEffects[0].formula} {dotEffects[0].damageType} damage</span>
                        )}
                      </div>
                    )}
                    {hotEffects.length > 0 && (
                      <div style={{
                        background: 'rgba(68, 255, 0, 0.1)',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: '1px solid rgba(68, 255, 0, 0.3)'
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          marginBottom: '6px'
                        }}>
                          <FontAwesomeIcon icon={faHeart} style={{
                            color: '#44ff00',
                            marginRight: '8px',
                            filter: 'drop-shadow(0 0 2px rgba(68, 255, 0, 0.5))'
                          }} />
                          <strong style={{
                            color: '#44ff00',
                            fontSize: '14px'
                          }}>Healing Over Time:</strong>
                        </div>
                        {channelingConfig.perRoundFormulas &&
                         channelingConfig.perRoundFormulas[hotEffects[0].id] &&
                         channelingConfig.perRoundFormulas[hotEffects[0].id].length > 0 ? (
                          <ul className="preview-list" style={{
                            listStyle: 'none',
                            padding: '0',
                            margin: '0'
                          }}>
                            {channelingConfig.perRoundFormulas[hotEffects[0].id].map((round, index) => (
                              <li key={index} style={{
                                padding: '4px 8px',
                                marginBottom: '4px',
                                background: 'rgba(0, 0, 0, 0.2)',
                                borderRadius: '4px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                              }}>
                                <strong style={{ color: '#cdd6f4' }}>Round {round.round}:</strong>
                                <span style={{
                                  color: '#ffcc00',
                                  fontFamily: 'monospace',
                                  background: 'rgba(0, 0, 0, 0.3)',
                                  padding: '2px 6px',
                                  borderRadius: '4px',
                                  fontSize: '13px'
                                }}>{round.formula}</span>
                                {round.description && (
                                  <span style={{
                                    color: '#a0b9d9',
                                    fontStyle: 'italic',
                                    fontSize: '12px'
                                  }}>{round.description}</span>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <span style={{
                            color: '#cdd6f4',
                            fontFamily: 'monospace',
                            background: 'rgba(0, 0, 0, 0.3)',
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}>{hotEffects[0].formula} healing</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Show targeting information from previous steps */}
              <div className="effect-preview-detail" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                padding: '8px 12px',
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '6px',
                border: '1px solid rgba(30, 40, 60, 0.5)'
              }}>
                <div className="detail-label" style={{
                  color: '#a0b9d9',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <FontAwesomeIcon icon={faPlay} style={{
                    color: '#9b59b6',
                    marginRight: '8px',
                    filter: 'drop-shadow(0 0 2px rgba(155, 89, 182, 0.5))'
                  }} />
                  Targeting:
                </div>
                <div className="detail-value" style={{
                  color: '#cdd6f4',
                  fontSize: '14px',
                  fontWeight: 'bold'
                }}>
                  {targetingConfig.targetingType ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      {targetingConfig.targetingType === 'single' && (
                        <span style={{
                          padding: '3px 8px',
                          backgroundColor: 'rgba(155, 89, 182, 0.2)',
                          borderRadius: '4px',
                          border: '1px solid rgba(155, 89, 182, 0.4)',
                          color: '#9b59b6'
                        }}>Single target</span>
                      )}
                      {targetingConfig.targetingType === 'area' && (
                        <span style={{
                          padding: '3px 8px',
                          backgroundColor: 'rgba(155, 89, 182, 0.2)',
                          borderRadius: '4px',
                          border: '1px solid rgba(155, 89, 182, 0.4)',
                          color: '#9b59b6'
                        }}>
                          {targetingConfig.aoeShape && targetingConfig.aoeShape.charAt(0).toUpperCase() + targetingConfig.aoeShape.slice(1)} with
                          {targetingConfig.aoeShape === 'circle' || targetingConfig.aoeShape === 'sphere' ?
                            ` ${targetingConfig.aoeParameters?.radius || 20}ft radius` :
                            targetingConfig.aoeShape === 'square' || targetingConfig.aoeShape === 'cube' ?
                            ` ${targetingConfig.aoeParameters?.size || 15}ft size` :
                            targetingConfig.aoeShape === 'cone' ?
                            ` ${targetingConfig.aoeParameters?.range || 15}ft range` :
                            targetingConfig.aoeShape === 'line' ?
                            ` ${targetingConfig.aoeParameters?.length || 30}ft length` :
                            ''}
                        </span>
                      )}
                      {targetingConfig.rangeType === 'ranged' && (
                        <span style={{
                          padding: '3px 8px',
                          backgroundColor: 'var(--pf-gradient-parchment-light)',
                          borderRadius: '4px',
                          border: '1px solid var(--pf-brown-light)',
                          color: 'var(--pf-text-primary)',
                          fontSize: '13px'
                        }}>
                          {targetingConfig.rangeDistance || 30}ft range
                        </span>
                      )}
                      {targetingConfig.rangeType === 'touch' && (
                        <span style={{
                          padding: '3px 8px',
                          backgroundColor: 'var(--pf-gradient-parchment-light)',
                          borderRadius: '4px',
                          border: '1px solid var(--pf-brown-light)',
                          color: 'var(--pf-text-primary)',
                          fontSize: '13px'
                        }}>Touch</span>
                      )}
                      {targetingConfig.rangeType === 'self' && (
                        <span style={{
                          padding: '3px 8px',
                          backgroundColor: 'var(--pf-gradient-parchment-light)',
                          borderRadius: '4px',
                          border: '1px solid var(--pf-brown-light)',
                          color: 'var(--pf-text-primary)',
                          fontSize: '13px'
                        }}>Self</span>
                      )}
                    </div>
                  ) : (
                    <span style={{
                      padding: '3px 8px',
                      backgroundColor: 'rgba(155, 89, 182, 0.2)',
                      borderRadius: '4px',
                      border: '1px solid rgba(155, 89, 182, 0.4)',
                      color: '#9b59b6'
                    }}>Default targeting</span>
                  )}
                </div>
              </div>

              <div className="effect-preview-detail" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                padding: '8px 12px',
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '6px',
                border: '1px solid rgba(30, 40, 60, 0.5)'
              }}>
                <div className="detail-label" style={{
                  color: '#a0b9d9',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <FontAwesomeIcon icon={faWalking} style={{
                    color: '#2ecc71',
                    marginRight: '8px',
                    filter: 'drop-shadow(0 0 2px rgba(46, 204, 113, 0.5))'
                  }} />
                  Mobility:
                </div>
                <div className="detail-value">
                  <span style={{
                    padding: '3px 8px',
                    backgroundColor: channelingConfig.movementAllowed ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)',
                    borderRadius: '4px',
                    border: channelingConfig.movementAllowed ? '1px solid rgba(46, 204, 113, 0.4)' : '1px solid rgba(231, 76, 60, 0.4)',
                    color: channelingConfig.movementAllowed ? '#2ecc71' : '#e74c3c',
                    fontWeight: 'bold'
                  }}>
                    {channelingConfig.movementAllowed ? 'Can move while channeling' : 'Must stand still'}
                  </span>
                </div>
              </div>

              <div className="effect-preview-detail" style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '12px',
                padding: '8px 12px',
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '6px',
                border: '1px solid rgba(30, 40, 60, 0.5)'
              }}>
                <div className="detail-label" style={{
                  color: '#a0b9d9',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <FontAwesomeIcon icon={faHandPaper} style={{
                    color: '#e67e22',
                    marginRight: '8px',
                    filter: 'drop-shadow(0 0 2px rgba(230, 126, 34, 0.5))'
                  }} />
                  Interruption:
                </div>
                <div className="detail-value">
                  <span style={{
                    padding: '3px 8px',
                    backgroundColor: channelingConfig.interruptible ? 'rgba(231, 76, 60, 0.2)' : 'rgba(46, 204, 113, 0.2)',
                    borderRadius: '4px',
                    border: channelingConfig.interruptible ? '1px solid rgba(231, 76, 60, 0.4)' : '1px solid rgba(46, 204, 113, 0.4)',
                    color: channelingConfig.interruptible ? '#e74c3c' : '#2ecc71',
                    fontWeight: 'bold'
                  }}>
                    {channelingConfig.interruptible ? 'Can be interrupted' : 'Cannot be interrupted'}
                  </span>
                </div>
              </div>

              {/* Area Expansion Preview - Shown when appropriate targeting/propagation settings are present */}
              {(targetingConfig.targetingType === 'area' ||
                (propagation && propagation.method) ||
                (targetingConfig.rangeType === 'ranged' && targetingConfig.rangeDistance)) && (
                <>
                  <div className="effect-preview-detail" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                    padding: '8px 12px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '6px',
                    border: '1px solid rgba(30, 40, 60, 0.5)'
                  }}>
                    <div className="detail-label" style={{
                      color: '#a0b9d9',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <FontAwesomeIcon icon={faExpandAlt} style={{
                        color: '#9b59b6',
                        marginRight: '8px',
                        filter: 'drop-shadow(0 0 2px rgba(155, 89, 182, 0.5))'
                      }} />
                      Area Growth:
                    </div>
                    <div className="detail-value" style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <span style={{
                        padding: '3px 8px',
                        backgroundColor: 'rgba(155, 89, 182, 0.2)',
                        borderRadius: '4px',
                        border: '1px solid rgba(155, 89, 182, 0.4)',
                        color: '#9b59b6',
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span style={{ fontSize: '13px' }}>{channelingConfig.initialRadius}ft</span>
                        <FontAwesomeIcon icon={faArrowUp} style={{ fontSize: '12px' }} />
                        <span style={{ fontSize: '13px' }}>{channelingConfig.maxRadius}ft</span>
                      </span>
                      <span style={{
                        padding: '3px 8px',
                        backgroundColor: 'var(--pf-gradient-parchment-light)',
                        borderRadius: '4px',
                        border: '1px solid var(--pf-brown-light)',
                        color: 'var(--pf-text-primary)',
                        fontSize: '13px'
                      }}>
                        {channelingConfig.expansionRate}ft per {channelingConfig.durationUnit === 'rounds' ? 'round' : 'turn'}
                      </span>
                      {(targetingConfig.targetingType === 'area' ||
                        (propagation && propagation.method)) && (
                        <span style={{
                          fontSize: '12px',
                          color: 'var(--pf-text-secondary)',
                          background: 'var(--pf-gradient-parchment)',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          border: '1px solid var(--pf-brown-light)'
                        }}>(from targeting)</span>
                      )}
                    </div>
                  </div>
                  <div className="effect-preview-detail" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                    padding: '8px 12px',
                    background: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '6px',
                    border: '1px solid rgba(30, 40, 60, 0.5)'
                  }}>
                    <div className="detail-label" style={{
                      color: '#a0b9d9',
                      fontSize: '14px',
                      fontWeight: 'bold',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <FontAwesomeIcon icon={faChartLine} style={{
                        color: '#e67e22',
                        marginRight: '8px',
                        filter: 'drop-shadow(0 0 2px rgba(230, 126, 34, 0.5))'
                      }} />
                      Pattern:
                    </div>
                    <div className="detail-value">
                      <span style={{
                        padding: '3px 8px',
                        backgroundColor: 'rgba(230, 126, 34, 0.2)',
                        borderRadius: '4px',
                        border: '1px solid rgba(230, 126, 34, 0.4)',
                        color: '#e67e22',
                        fontWeight: 'bold'
                      }}>
                        {channelingConfig.expansionType === 'linear' && 'Steady growth to maximum radius'}
                        {channelingConfig.expansionType === 'pulsing' && 'Cycles between expanding and contracting'}
                        {channelingConfig.expansionType === 'erratic' && 'Unpredictable changes in radius'}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* Removed Power Up Specific Preview */}

              {/* Defensive Preview - Only shown when buff effects are present */}
              {effectTypes.includes('buff') && (
                <>
                  <div className="effect-preview-detail">
                    <div className="detail-label">Protection:</div>
                    <div className="detail-value">
                      {channelingConfig.damageReduction}% → {channelingConfig.maxDamageReduction}% reduction vs {
                        channelingConfig.resistanceType === 'physical' ? 'physical damage' :
                        channelingConfig.resistanceType === 'magical' ? 'magical damage' :
                        channelingConfig.resistanceType === 'elemental' ? 'elemental damage' :
                        'all damage types'
                      }
                    </div>
                  </div>
                </>
              )}

              {/* Mana Burn Specific Preview */}
              {channelingConfig.type === 'mana_burn' && (
                <>
                  <div className="effect-preview-detail">
                    <div className="detail-label">Conversion:</div>
                    <div className="detail-value">
                      {channelingConfig.resourceConversionRate}% of consumed resources converted to {
                        channelingConfig.resourceConversionEffect === 'damage' ? 'damage' :
                        channelingConfig.resourceConversionEffect === 'healing' ? 'healing' :
                        channelingConfig.resourceConversionEffect === 'buff' ? 'buff effects' :
                        'shield/barrier'
                      }
                    </div>
                  </div>
                </>
              )}

              {/* Persistent Specific Preview */}
              {channelingConfig.type === 'persistent' && (
                <>
                  <div className="effect-preview-detail">
                    <div className="detail-label">Manifestation:</div>
                    <div className="detail-value">
                      {channelingConfig.persistentEffectType === 'aura' ? 'Aura' :
                       channelingConfig.persistentEffectType === 'field' ? 'Field' :
                       'Beam'} with {channelingConfig.persistentRadius}ft radius
                      {(targetingConfig.targetType === 'AREA' || targetingConfig.targetType === 'AOE' ||
                        targetingConfig.targetType === 'DIRECTIONAL' || targetingConfig.targetType === 'LINE') && (
                        <span className="text-info small ml-xs">(based on targeting)</span>
                      )}
                    </div>
                  </div>
                </>
              )}

              {/* Staged Specific Preview */}
              {channelingConfig.type === 'staged' && channelingConfig.stages && channelingConfig.stages.length > 0 && (
                <>
                  <div className="effect-preview-detail">
                    <div className="detail-label">Progression:</div>
                    <div className="detail-value">
                      <ul className="preview-list">
                        {channelingConfig.stages.map((stage, index) => (
                          <li key={index}>
                            <strong>Stage {index + 1} ({stage.threshold}s):</strong> {stage.effect}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </>
              )}

              {/* Removed old scaling effect and power scaling preview sections */}
            </div>
          </div>
        {/* End of preview card */}


      </div>
    </WizardStep>
  );
};

export default Step8Channeling;
