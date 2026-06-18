import { useState, useEffect } from 'react';
import { useSpellWizardState, useSpellWizardDispatch, ACTION_TYPES } from '../../context/spellWizardContext';
import { triggerCategories } from '../../core/data/triggerData';

export default function useTriggerConfig() {
  const state = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();

  const requiresTriggers = state.spellType === 'REACTION' || state.spellType === 'PASSIVE' || state.spellType === 'TRAP' || state.spellType === 'STATE';

  const [errors, setErrors] = useState([]);

  // Local trigger configuration
  const [triggerConfig, setTriggerConfig] = useState(() => {
    const global = state.triggerConfig?.global || {
      logicType: 'AND',
      compoundTriggers: [],
      enabled: true
    };
    // Ensure enabled is set if not present
    if (global.enabled === undefined) {
      global.enabled = true;
    }
    return global;
  });

  // Effect-specific triggers
  const [effectTriggers, setEffectTriggers] = useState(state.triggerConfig?.effectTriggers || {});

  // Selected effect for effect-specific triggers
  const [selectedEffect, setSelectedEffect] = useState(null);

  // Whether we're editing global triggers or effect-specific triggers
  // Simplified to just 'global' or 'effect' - conditional is now part of effect config
  const [editingMode, setEditingMode] = useState('global'); // 'global' or 'effect'

  // Whether we're configuring triggers or required state
  // 'trigger' = when trigger is met, effect applies / spell activates
  // 'required' = effect/spell only works if trigger is met
  const [triggerMode, setTriggerMode] = useState(() => {
    // Initialize based on existing config - if requiredConditions exist, default to 'required'
    const hasRequiredConditions = state.triggerConfig?.requiredConditions?.enabled && 
                                  state.triggerConfig?.requiredConditions?.conditions?.length > 0;
    return hasRequiredConditions ? 'required' : 'trigger';
  });

  // Required conditions - conditions that must be met before the spell can be cast
  // Now integrated into trigger config instead of separate section
  const [requiredConditions, setRequiredConditions] = useState(() => {
    return state.triggerConfig?.requiredConditions || {
      enabled: false,
      logicType: 'AND',
      conditions: []
    };
  });

  // Conditional effect configuration
  const [conditionalEffects, setConditionalEffects] = useState(() => {
    // Initialize with existing data or create new with default values from effect configs
    const existingConditionalEffects = state.triggerConfig?.conditionalEffects || {};
    const initializedEffects = {};

    // For each effect type, initialize with base formulas and settings from effect configs
    state.effectTypes.forEach(effectType => {
      // Get base formula from the appropriate effect config
      let baseFormula = '';
      let baseSettings = {};

      switch(effectType) {
        case 'damage':
          // Use the actual formula from the damage configuration
          baseFormula = state.damageConfig?.formula || '1d6 + INT';
          baseSettings = {
            damageType: state.damageConfig?.damageType || 'direct',
            elementType: state.damageConfig?.elementType || 'ember'
          };
          break;
        case 'healing':
          // Use the actual formula from the healing configuration
          baseFormula = state.healingConfig?.formula || '2d8 + HEA';
          baseSettings = {
            healingType: state.healingConfig?.healingType || 'direct',
            hasHotEffect: state.healingConfig?.hasHotEffect === true,
            hasShieldEffect: state.healingConfig?.hasShieldEffect === true
          };
          break;
        case 'buff':
          // Use the actual formula from the buff configuration
          // If there are stat modifiers, use the first one's magnitude
          if (state.buffConfig?.statModifiers && state.buffConfig.statModifiers.length > 0) {
            const firstStat = state.buffConfig.statModifiers[0];
            baseFormula = typeof firstStat.magnitude === 'string'
              ? firstStat.magnitude
              : (firstStat.magnitudeType === 'percentage'
                  ? `+${firstStat.magnitude}%`
                  : `+${firstStat.magnitude}`);
          } else {
            baseFormula = state.buffConfig?.formula || '+2';
          }
          baseSettings = {
            duration: state.buffConfig?.duration || 3,
            statAffected: state.buffConfig?.statAffected || 'strength'
          };
          break;
        case 'debuff':
        case 'debuff_stat':
        case 'debuff_control':
          // Use the actual formula from the debuff configuration
          // If there are stat penalties, use the first one's magnitude
          if (state.debuffConfig?.statPenalties && state.debuffConfig.statPenalties.length > 0) {
            const firstStat = state.debuffConfig.statPenalties[0];
            baseFormula = typeof firstStat.magnitude === 'string'
              ? firstStat.magnitude
              : (firstStat.magnitudeType === 'percentage'
                  ? `${firstStat.magnitude}%` // Negative values already have the minus sign
                  : `${firstStat.magnitude}`);
          } else {
            baseFormula = state.debuffConfig?.formula || '-2';
          }
          baseSettings = {
            duration: state.debuffConfig?.duration || 3,
            durationUnit: state.debuffConfig?.durationUnit || 'rounds',
            difficultyClass: state.debuffConfig?.difficultyClass || 15,
            savingThrow: state.debuffConfig?.savingThrow || 'constitution'
          };
          break;
        case 'control':
          baseFormula = '';
          baseSettings = {
            duration: state.controlConfig?.duration || 1,
            savingThrow: state.controlConfig?.savingThrow || 'strength',
            difficultyClass: state.controlConfig?.difficultyClass || 15
          };
          break;
        case 'summon':
          baseFormula = '';
          baseSettings = {
            duration: state.summoningConfig?.duration || 10,
            durationUnit: state.summoningConfig?.durationUnit || 'minutes',
            quantity: state.summoningConfig?.quantity || state.summoningConfig?.count || 1,
            controlType: state.summoningConfig?.controlType || 'verbal',
            controlRange: state.summoningConfig?.controlRange || 60,
            creatures: state.summoningConfig?.creatures || [],
            waitForTrigger: state.summoningConfig?.waitForTrigger || false
          };
          break;
        case 'transform':
          baseFormula = '';
          baseSettings = {
            duration: state.transformationConfig?.duration || 10,
            difficultyClass: state.transformationConfig?.difficultyClass || 15
          };
          break;
        default:
          baseFormula = '';
          baseSettings = {};
      }

      // If there's an existing config, use it, otherwise create a new one
      initializedEffects[effectType] = existingConditionalEffects[effectType] || {
        isConditional: false,
        defaultEnabled: true,
        baseFormula: baseFormula,
        baseSettings: baseSettings,
        conditionalFormulas: {
          'default': baseFormula
        },
        conditionalSettings: {}
      };

      // Ensure the default formula is set if it doesn't exist
      if (!initializedEffects[effectType].conditionalFormulas?.default) {
        initializedEffects[effectType].conditionalFormulas = {
          ...initializedEffects[effectType].conditionalFormulas,
          'default': baseFormula
        };
      }

      // Store the base formula and settings for reference
      initializedEffects[effectType].baseFormula = baseFormula;
      initializedEffects[effectType].baseSettings = baseSettings;
    });

    return initializedEffects;
  });

  const [selectedCategory, setSelectedCategory] = useState(triggerCategories[0].id);

  // Validate the trigger configuration
  const validateTriggerConfig = (config) => {
    const validationErrors = [];

    // For REACTION, PASSIVE, TRAP, or STATE spells, global triggers are required
    if (requiresTriggers && (!config || !config.compoundTriggers || config.compoundTriggers.length === 0)) {
      validationErrors.push('Please add at least one global trigger condition');
    }

    // For compound triggers, validate each trigger
    if (config && config.compoundTriggers && config.compoundTriggers.length > 0) {
      config.compoundTriggers.forEach((trigger, index) => {
        if (!trigger.id || !trigger.category) {
          validationErrors.push(`Trigger #${index + 1} is incomplete`);
        }
      });
    }

    // Validate effect-specific triggers if any are defined
    if (editingMode === 'effect' && selectedEffect && effectTriggers[selectedEffect]) {
      const effectTriggerConfig = effectTriggers[selectedEffect];
      if (effectTriggerConfig.compoundTriggers && effectTriggerConfig.compoundTriggers.length > 0) {
        effectTriggerConfig.compoundTriggers.forEach((trigger, index) => {
          if (!trigger.id || !trigger.category) {
            validationErrors.push(`Effect trigger #${index + 1} is incomplete`);
          }
        });
      }
    }

    setErrors(validationErrors);
    return validationErrors;
  };

  // Update conditional settings for a specific trigger
  const updateConditionalSettings = (effectType, triggerId, settingKey, value) => {
    const newConditionalEffects = { ...conditionalEffects };

    if (!newConditionalEffects[effectType]) {
      // Initialize with base settings
      let baseSettings = {};
      switch(effectType) {
        case 'damage':
        case 'damage_direct':
          baseSettings = {
            damageType: state.damageConfig?.damageType || 'direct',
            elementType: state.damageConfig?.elementType || 'ember'
          };
          break;
        case 'damage_dot':
          baseSettings = {
            damageType: 'dot',
            elementType: state.damageConfig?.elementType || 'ember',
            dotDuration: state.damageConfig?.dotDuration || 3,
            dotDurationUnit: state.damageConfig?.dotDurationUnit || 'rounds',
            duration: state.damageConfig?.dotDuration || 3,
            durationUnit: state.damageConfig?.dotDurationUnit || 'rounds'
          };
          break;
        case 'damage_combined':
          baseSettings = {
            damageType: 'combined',
            elementType: state.damageConfig?.elementType || 'ember',
            dotFormula: state.damageConfig?.dotFormula || '1d4 + INT/2',
            dotDuration: state.damageConfig?.dotDuration || 3,
            dotDurationUnit: state.damageConfig?.dotDurationUnit || 'rounds'
          };
          break;
        case 'healing':
          baseSettings = {
            healingType: state.healingConfig?.healingType || 'direct'
          };
          break;
        case 'control':
          baseSettings = {
            duration: state.controlConfig?.duration || 1,
            savingThrow: state.controlConfig?.savingThrow || 'strength',
            difficultyClass: state.controlConfig?.difficultyClass || 15
          };
          break;
        case 'restoration':
        case 'restoration_resource':
          baseSettings = {
            resourceType: state.restorationConfig?.resourceType || 'mana',
            resolution: state.restorationConfig?.resolution || 'DICE',
            isOverTime: state.restorationConfig?.isOverTime || false,
            overTimeFormula: state.restorationConfig?.overTimeFormula || '1d4 + INT/2',
            overTimeDuration: state.restorationConfig?.overTimeDuration || 3,
            tickFrequency: state.restorationConfig?.tickFrequency || 'round',
            isProgressiveOverTime: state.restorationConfig?.isProgressiveOverTime || false,
            overTimeProgressiveStages: state.restorationConfig?.overTimeProgressiveStages || []
          };
          break;
        default:
          baseSettings = {};
      }

      newConditionalEffects[effectType] = {
        isConditional: true,
        defaultEnabled: true,
        baseSettings: baseSettings,
        conditionalFormulas: {},
        conditionalSettings: {
          [triggerId]: {
            [settingKey]: value
          }
        }
      };
    } else {
      // Make sure conditionalSettings exists
      if (!newConditionalEffects[effectType].conditionalSettings) {
        newConditionalEffects[effectType].conditionalSettings = {};
      }

      // Make sure settings for this trigger exist
      if (!newConditionalEffects[effectType].conditionalSettings[triggerId]) {
        newConditionalEffects[effectType].conditionalSettings[triggerId] = {};
      }

      // Update the specific setting
      newConditionalEffects[effectType].conditionalSettings = {
        ...newConditionalEffects[effectType].conditionalSettings,
        [triggerId]: {
          ...newConditionalEffects[effectType].conditionalSettings[triggerId],
          [settingKey]: value
        }
      };
    }

    // If updating a stat modifier, also update the formula for backward compatibility
    if (settingKey === 'statModifiers' && effectType.startsWith('buff')) {
      // Use the first stat's magnitude as the formula if available
      const firstStat = value[0];
      if (firstStat && firstStat.magnitude !== undefined) {
        const formula = typeof firstStat.magnitude === 'string'
          ? firstStat.magnitude
          : (firstStat.magnitudeType === 'percentage'
              ? `+${firstStat.magnitude}%`
              : `+${firstStat.magnitude}`);

        if (!newConditionalEffects[effectType].conditionalFormulas) {
          newConditionalEffects[effectType].conditionalFormulas = {};
        }

        newConditionalEffects[effectType].conditionalFormulas[triggerId] = formula;
      }
    }

    // If updating a stat penalty, also update the formula for backward compatibility
    if (settingKey === 'statPenalties' && effectType.startsWith('debuff')) {
      // Use the first stat's magnitude as the formula if available
      const firstStat = value[0];
      if (firstStat && firstStat.magnitude !== undefined) {
        const formula = typeof firstStat.magnitude === 'string'
          ? firstStat.magnitude
          : (firstStat.magnitudeType === 'percentage'
              ? `${firstStat.magnitude}%` // Negative values already have the minus sign
              : `${firstStat.magnitude}`);

        if (!newConditionalEffects[effectType].conditionalFormulas) {
          newConditionalEffects[effectType].conditionalFormulas = {};
        }

        newConditionalEffects[effectType].conditionalFormulas[triggerId] = formula;
      }
    }

    setConditionalEffects(newConditionalEffects);
  };

  // Update conditional formula for a specific trigger
  const updateConditionalFormula = (effectType, triggerId, formula) => {
    const newConditionalEffects = { ...conditionalEffects };

    // Get the base formula for this effect type if we need to initialize
    let baseFormula = newConditionalEffects[effectType]?.baseFormula || '';
    let baseSettings = newConditionalEffects[effectType]?.baseSettings || {};

    if (!baseFormula) {
      switch(effectType) {
        case 'damage':
        case 'damage_direct':
        case 'damage_dot':
        case 'damage_combined':
          // Use the actual formula from the damage configuration
          baseFormula = state.damageConfig?.formula || '1d6 + INT';
          break;
        case 'healing':
          // Use the actual formula from the healing configuration
          baseFormula = state.healingConfig?.formula || '2d8 + HEA';
          break;
        case 'buff':
          // Use the actual formula from the buff configuration
          if (state.buffConfig?.statModifiers && state.buffConfig.statModifiers.length > 0) {
            const firstStat = state.buffConfig.statModifiers[0];
            baseFormula = typeof firstStat.magnitude === 'string'
              ? firstStat.magnitude
              : (firstStat.magnitudeType === 'percentage'
                  ? `+${firstStat.magnitude}%`
                  : `+${firstStat.magnitude}`);
          } else {
            baseFormula = state.buffConfig?.formula || '+2';
          }
          break;
        case 'debuff':
        case 'debuff_stat':
        case 'debuff_control':
          // Use the actual formula from the debuff configuration
          if (state.debuffConfig?.statPenalties && state.debuffConfig.statPenalties.length > 0) {
            const firstStat = state.debuffConfig.statPenalties[0];
            baseFormula = typeof firstStat.magnitude === 'string'
              ? firstStat.magnitude
              : (firstStat.magnitudeType === 'percentage'
                  ? `${firstStat.magnitude}%` // Negative values already have the minus sign
                  : `${firstStat.magnitude}`);
          } else {
            baseFormula = state.debuffConfig?.formula || '-2';
          }
          break;
        case 'restoration':
        case 'restoration_resource':
          // Use the actual formula from the restoration configuration
          baseFormula = state.restorationConfig?.formula || '2d6 + INT';
          break;
        default:
          baseFormula = '';
      }
    }

    if (!newConditionalEffects[effectType]) {
      newConditionalEffects[effectType] = {
        isConditional: true,
        defaultEnabled: true,
        baseFormula: baseFormula,
        baseSettings: baseSettings,
        conditionalFormulas: {
          [triggerId]: formula,
          'default': baseFormula
        },
        conditionalSettings: {}
      };
    } else {
      newConditionalEffects[effectType] = {
        ...newConditionalEffects[effectType],
        conditionalFormulas: {
          ...newConditionalEffects[effectType].conditionalFormulas,
          [triggerId]: formula
        }
      };
    }

    setConditionalEffects(newConditionalEffects);
  };

  // Toggle conditional activation for an effect
  const toggleConditionalEffect = (effectType, isConditional) => {
    const newConditionalEffects = { ...conditionalEffects };

    // Get the base formula and settings for this effect type
    let baseFormula = '';
    let baseSettings = {};

    switch(effectType) {
      case 'damage':
      case 'damage_direct':
        // Use the actual formula from the damage configuration
        baseFormula = state.damageConfig?.formula || '1d6 + INT';
        console.log('Using damage formula:', baseFormula);
        baseSettings = {
          damageType: state.damageConfig?.damageType || 'direct',
          elementType: state.damageConfig?.elementType || 'ember'
        };
        break;
      case 'damage_dot':
        // Use the actual formula from the damage configuration
        baseFormula = state.damageConfig?.formula || '1d6 + INT';
        console.log('Using damage_dot formula:', baseFormula);
        baseSettings = {
          damageType: 'dot',
          elementType: state.damageConfig?.elementType || 'ember',
          dotDuration: state.damageConfig?.dotDuration || 3,
          dotDurationUnit: state.damageConfig?.dotDurationUnit || 'rounds',
          duration: state.damageConfig?.dotDuration || 3,
          durationUnit: state.damageConfig?.dotDurationUnit || 'rounds'
        };
        break;
      case 'damage_combined':
        // Use the actual formula from the damage configuration
        baseFormula = state.damageConfig?.formula || '1d6 + INT';
        console.log('Using damage_combined formula:', baseFormula);
        baseSettings = {
          damageType: 'combined',
          elementType: state.damageConfig?.elementType || 'ember',
          dotFormula: state.damageConfig?.dotFormula || '1d4 + INT/2',
          dotDuration: state.damageConfig?.dotDuration || 3,
          dotDurationUnit: state.damageConfig?.dotDurationUnit || 'rounds'
        };
        break;
      case 'healing':
        // Use the actual formula from the healing configuration
        baseFormula = state.healingConfig?.formula || '2d8 + HEA';
        console.log('Using healing formula:', baseFormula);
        baseSettings = {
          healingType: state.healingConfig?.healingType || 'direct',
          hasHotEffect: state.healingConfig?.hasHotEffect === true,
          hasShieldEffect: state.healingConfig?.hasShieldEffect === true
        };
        break;
      case 'buff':
        // Use the actual formula from the buff configuration
        // If there are stat modifiers, use the first one's magnitude
        if (state.buffConfig?.statModifiers && state.buffConfig.statModifiers.length > 0) {
          const firstStat = state.buffConfig.statModifiers[0];
          baseFormula = typeof firstStat.magnitude === 'string'
            ? firstStat.magnitude
            : (firstStat.magnitudeType === 'percentage'
                ? `+${firstStat.magnitude}%`
                : `+${firstStat.magnitude}`);
        } else {
          baseFormula = state.buffConfig?.formula || '+2';
        }
        console.log('Using buff formula:', baseFormula);
        baseSettings = {
          duration: state.buffConfig?.duration || 3,
          durationUnit: state.buffConfig?.durationUnit || 'rounds'
        };

        // If we have stat modifiers, initialize them in the conditional settings
        if (state.buffConfig?.statModifiers && state.buffConfig.statModifiers.length > 0) {
          // Create a deep copy of stat modifiers to avoid modifying the base configuration
          const statModifiersCopy = state.buffConfig.statModifiers.map(stat => ({
            ...stat,
            // Create a new object for each stat modifier
            id: stat.id,
            name: stat.name,
            icon: stat.icon,
            magnitude: stat.magnitude,
            magnitudeType: stat.magnitudeType
          }));

          // Use updateConditionalSettings to set the stat modifiers
          updateConditionalSettings(effectType, 'default', 'statModifiers', statModifiersCopy);
        }
        break;
      case 'debuff':
      case 'debuff_stat':
      case 'debuff_control':
        // Use the actual formula from the debuff configuration
        // If there are stat penalties, use the first one's magnitude
        if (state.debuffConfig?.statPenalties && state.debuffConfig.statPenalties.length > 0) {
          const firstStat = state.debuffConfig.statPenalties[0];
          baseFormula = typeof firstStat.magnitude === 'string'
            ? firstStat.magnitude
            : (firstStat.magnitudeType === 'percentage'
                ? `${firstStat.magnitude}%` // Negative values already have the minus sign
                : `${firstStat.magnitude}`);
        } else {
          baseFormula = state.debuffConfig?.formula || '-2';
        }
        console.log('Using debuff formula:', baseFormula);
        baseSettings = {
          duration: state.debuffConfig?.duration || 3,
          durationUnit: state.debuffConfig?.durationUnit || 'rounds',
          difficultyClass: state.debuffConfig?.difficultyClass || 15,
          savingThrow: state.debuffConfig?.savingThrow || 'constitution' // Default to constitution if not set
        };

        // If we have stat penalties, initialize them in the conditional settings
        if (state.debuffConfig?.statPenalties && state.debuffConfig.statPenalties.length > 0) {
          // Create a deep copy of stat penalties to avoid modifying the base configuration
          const statPenaltiesCopy = state.debuffConfig.statPenalties.map(stat => ({
            ...stat,
            // Create a new object for each stat penalty
            id: stat.id,
            name: stat.name,
            icon: stat.icon,
            magnitude: stat.magnitude,
            magnitudeType: stat.magnitudeType
          }));

          // Use updateConditionalSettings to set the stat penalties
          updateConditionalSettings(effectType, 'default', 'statPenalties', statPenaltiesCopy);
        }

        // For control debuffs, add the control type
        if (effectType === 'debuff_control') {
          baseSettings.controlType = state.debuffConfig?.controlType || 'slow';
        }
        break;
      case 'control':
        baseFormula = '';
        baseSettings = {
          duration: state.controlConfig?.duration || 1,
          durationUnit: state.controlConfig?.durationUnit || 'rounds',
          savingThrow: state.controlConfig?.savingThrow || 'strength',
          difficultyClass: state.controlConfig?.difficultyClass || 15,
          controlType: state.controlConfig?.controlType || 'stun',
          effects: state.controlConfig?.effects || []
        };
        break;
      case 'summon':
        baseFormula = '';
        baseSettings = {
          duration: state.summoningConfig?.duration || 10,
          quantity: state.summoningConfig?.quantity || 1
        };
        break;
      case 'transform':
        baseFormula = '';
        baseSettings = {
          duration: state.transformationConfig?.duration || 10,
          difficultyClass: state.transformationConfig?.difficultyClass || 15
        };
        break;
      case 'restoration':
      case 'restoration_resource':
        // Use the actual formula from the restoration configuration
        baseFormula = state.restorationConfig?.formula || '2d6 + INT';
        console.log('Using restoration formula:', baseFormula);
        baseSettings = {
          resourceType: state.restorationConfig?.resourceType || 'mana',
          resolution: state.restorationConfig?.resolution || 'DICE',
          isOverTime: state.restorationConfig?.isOverTime || false,
          overTimeFormula: state.restorationConfig?.overTimeFormula || '1d4 + INT/2',
          overTimeDuration: state.restorationConfig?.overTimeDuration || 3,
          tickFrequency: state.restorationConfig?.tickFrequency || 'round',
          isProgressiveOverTime: state.restorationConfig?.isProgressiveOverTime || false,
          overTimeProgressiveStages: state.restorationConfig?.overTimeProgressiveStages || []
        };
        break;
      default:
        baseFormula = '';
        baseSettings = {};
    }

    if (isConditional) {
      // Initialize conditional effect if it doesn't exist
      if (!newConditionalEffects[effectType]) {
        newConditionalEffects[effectType] = {
          isConditional: true,
          defaultEnabled: true,
          baseFormula: baseFormula,
          baseSettings: baseSettings,
          conditionalFormulas: {
            'default': baseFormula
          },
          conditionalSettings: {}
        };
      } else {
        newConditionalEffects[effectType] = {
          ...newConditionalEffects[effectType],
          isConditional: true,
          baseFormula: baseFormula,
          baseSettings: baseSettings
        };

        // Make sure default formula exists
        if (!newConditionalEffects[effectType].conditionalFormulas?.default) {
          newConditionalEffects[effectType].conditionalFormulas = {
            ...newConditionalEffects[effectType].conditionalFormulas,
            'default': baseFormula
          };
        }
      }
    } else {
      // If turning off conditional mode, keep the config but mark as not conditional
      if (newConditionalEffects[effectType]) {
        newConditionalEffects[effectType] = {
          ...newConditionalEffects[effectType],
          isConditional: false
        };
      }
    }

    setConditionalEffects(newConditionalEffects);
  };

  // Add a trigger to the configuration
  const addTrigger = (trigger) => {
    // Create a copy of the trigger with default parameter values
    const triggerWithParams = {
      id: trigger.id,
      category: selectedCategory,
      name: trigger.name,
      parameters: {}
    };

    // Initialize parameters with default values
    trigger.params.forEach(param => {
      if (param === 'percentage' || param === 'amount' || param === 'distance' || param === 'threshold_value' || param === 'health_threshold') {
        triggerWithParams.parameters[param] = 50;
      } else if (param === 'comparison') {
        triggerWithParams.parameters[param] = 'less_than';
      } else if (param === 'is_percent' || param === 'is_day') {
        triggerWithParams.parameters[param] = true;
      } else if (param === 'threshold_type') {
        triggerWithParams.parameters[param] = 'percentage'; // Default to percentage, can be changed to 'flat'
      } else if (param === 'resource_type') {
        triggerWithParams.parameters[param] = 'health';
      } else if (param === 'target_type') {
        triggerWithParams.parameters[param] = 'self';
      } else if (param === 'perspective') {
        triggerWithParams.parameters[param] = 'self'; // Default to self, can be changed to 'target', 'ally', 'enemy'
      } else if (param === 'stack_count') {
        triggerWithParams.parameters[param] = 3; // Default stack count
      } else if (param === 'duration') {
        triggerWithParams.parameters[param] = 2; // Default duration in rounds
      } else if (param === 'ability_id') {
        triggerWithParams.parameters[param] = ''; // Will be populated with available abilities
      } else if (param === 'damage_threshold') {
        triggerWithParams.parameters[param] = 10; // Default damage threshold
      } else if (param === 'damage_type' || param === 'type') { // Handle both 'damage_type' and legacy 'type'
        triggerWithParams.parameters[param] = 'any'; // Default to any damage type
      } else {
        triggerWithParams.parameters[param] = '';
      }
    });

    if (editingMode === 'global') {
      if (triggerMode === 'required') {
        // Add to required conditions
        const updatedConditions = [...(requiredConditions.conditions || [])];
        updatedConditions.push(triggerWithParams);
        const newRequiredConditions = {
          ...requiredConditions,
          enabled: true,
          conditions: updatedConditions
        };
        setRequiredConditions(newRequiredConditions);
      } else {
        // Add to global triggers
        const updatedTriggers = [...(triggerConfig.compoundTriggers || [])];
        updatedTriggers.push(triggerWithParams);
        const newConfig = {
          ...triggerConfig,
          compoundTriggers: updatedTriggers
        };

        setTriggerConfig(newConfig);
        validateTriggerConfig(newConfig);
      }
    } else if (editingMode === 'effect' && selectedEffect) {
      // Add to effect-specific triggers
      const newEffectTriggers = { ...effectTriggers };
      if (!newEffectTriggers[selectedEffect]) {
        newEffectTriggers[selectedEffect] = {
          logicType: 'AND',
          compoundTriggers: [triggerWithParams],
          targetingOverride: newEffectTriggers[selectedEffect]?.targetingOverride || null
        };
      } else {
        newEffectTriggers[selectedEffect] = {
          ...newEffectTriggers[selectedEffect],
          compoundTriggers: [...(newEffectTriggers[selectedEffect].compoundTriggers || []), triggerWithParams]
        };
      }
      setEffectTriggers(newEffectTriggers);

      // Update the context with the new effect triggers
      dispatch({
        type: ACTION_TYPES.UPDATE_EFFECT_TRIGGER,
        payload: {
          effectType: selectedEffect,
          triggerConfig: newEffectTriggers[selectedEffect]
        }
      });

      // If this effect is conditional, initialize conditional settings for this trigger
      if (conditionalEffects[selectedEffect]?.isConditional) {
        // For buff effects, initialize with stat modifiers if available
        if (selectedEffect === 'buff' || selectedEffect?.startsWith('buff_')) {
          if (state.buffConfig?.statModifiers && state.buffConfig.statModifiers.length > 0) {
            // Create a deep copy of stat modifiers to avoid modifying the base configuration
            const statModifiersCopy = state.buffConfig.statModifiers.map(stat => ({
              ...stat,
              // Create a new object for each stat modifier
              id: stat.id,
              name: stat.name,
              icon: stat.icon,
              magnitude: stat.magnitude,
              magnitudeType: stat.magnitudeType
            }));

            // Initialize with a copy of the stat modifiers from the base effect
            updateConditionalSettings(selectedEffect, trigger.id, 'statModifiers', statModifiersCopy);

            // Also set the duration - use durationValue as the primary source
            updateConditionalSettings(selectedEffect, trigger.id, 'duration',
              state.buffConfig?.durationValue || state.buffConfig?.duration || 3);

            // For time-based durations, use durationUnit, otherwise map durationType to appropriate unit
            let durationUnit = 'rounds';
            if (state.buffConfig?.durationType === 'time') {
              durationUnit = state.buffConfig?.durationUnit || 'minutes';
            } else if (state.buffConfig?.durationType === 'turns') {
              durationUnit = 'rounds';
            } else if (state.buffConfig?.durationType === 'rest') {
              durationUnit = state.buffConfig?.restType || 'short';
            } else if (state.buffConfig?.durationType === 'permanent') {
              durationUnit = 'permanent';
            }

            updateConditionalSettings(selectedEffect, trigger.id, 'durationUnit', durationUnit);
            updateConditionalSettings(selectedEffect, trigger.id, 'durationType', state.buffConfig?.durationType || 'turns');
          }
        }
        // For debuff effects, initialize with stat penalties if available
        else if (selectedEffect === 'debuff' || selectedEffect?.startsWith('debuff_')) {
          // Initialize with a deep copy of the stat penalties from the base effect
          if (state.debuffConfig?.statPenalties && state.debuffConfig.statPenalties.length > 0) {
            // Create a deep copy of stat penalties to avoid modifying the base configuration
            const statPenaltiesCopy = state.debuffConfig.statPenalties.map(stat => ({
              ...stat,
              // Create a new object for each stat penalty
              id: stat.id,
              name: stat.name,
              icon: stat.icon,
              magnitude: stat.magnitude,
              magnitudeType: stat.magnitudeType
            }));

            updateConditionalSettings(selectedEffect, trigger.id, 'statPenalties', statPenaltiesCopy);
          }

          // Set the duration - use durationValue as the primary source
          updateConditionalSettings(selectedEffect, trigger.id, 'duration',
            state.debuffConfig?.durationValue || state.debuffConfig?.duration || 3);

          // For time-based durations, use durationUnit, otherwise map durationType to appropriate unit
          let durationUnit = 'rounds';
          if (state.debuffConfig?.durationType === 'time') {
            durationUnit = state.debuffConfig?.durationUnit || 'minutes';
          } else if (state.debuffConfig?.durationType === 'turns') {
            durationUnit = 'rounds';
          } else if (state.debuffConfig?.durationType === 'rest') {
            durationUnit = state.debuffConfig?.restType || 'short';
          } else if (state.debuffConfig?.durationType === 'permanent') {
            durationUnit = 'permanent';
          }

          updateConditionalSettings(selectedEffect, trigger.id, 'durationUnit', durationUnit);
          updateConditionalSettings(selectedEffect, trigger.id, 'durationType', state.debuffConfig?.durationType || 'turns');

          // Set the saving throw
          updateConditionalSettings(selectedEffect, trigger.id, 'difficultyClass',
            state.debuffConfig?.difficultyClass || 15);
          updateConditionalSettings(selectedEffect, trigger.id, 'savingThrow',
            state.debuffConfig?.savingThrow || 'constitution'); // Use constitution as default

          // Set control type for debuff_control
          if (selectedEffect === 'debuff_control') {
            updateConditionalSettings(selectedEffect, trigger.id, 'controlType',
              state.debuffConfig?.controlType || 'slow');
          }
        }
        // For damage_dot effects, initialize with type, duration, and formula
        else if (selectedEffect === 'damage_dot') {
          // Initialize the formula
          updateConditionalFormula(selectedEffect, trigger.id, state.damageConfig?.formula || '1d6 + INT');

          // Initialize damage type settings
          updateConditionalSettings(selectedEffect, trigger.id, 'elementType',
            state.damageConfig?.elementType || 'ember');
          updateConditionalSettings(selectedEffect, trigger.id, 'damageType', 'dot');

          // Initialize duration settings
          updateConditionalSettings(selectedEffect, trigger.id, 'dotDuration',
            state.damageConfig?.dotDuration || 3);
          updateConditionalSettings(selectedEffect, trigger.id, 'dotDurationUnit',
            state.damageConfig?.dotDurationUnit || 'rounds');
          updateConditionalSettings(selectedEffect, trigger.id, 'duration',
            state.damageConfig?.dotDuration || 3);
          updateConditionalSettings(selectedEffect, trigger.id, 'durationUnit',
            state.damageConfig?.dotDurationUnit || 'rounds');
        }
        // For other damage effects, initialize with type and formula
        else if (selectedEffect === 'damage' || selectedEffect?.startsWith('damage_')) {
          // Initialize the formula
          updateConditionalFormula(selectedEffect, trigger.id, state.damageConfig?.formula || '1d6 + INT');

          // Initialize damage type settings
          updateConditionalSettings(selectedEffect, trigger.id, 'elementType',
            state.damageConfig?.elementType || 'ember');
          updateConditionalSettings(selectedEffect, trigger.id, 'damageType',
            state.damageConfig?.damageType || 'direct');
        }
        // For summoning effects, initialize with creature and control settings
        else if (selectedEffect === 'summon') {
          // Initialize summoning settings
          if (state.summoningConfig?.creatures && state.summoningConfig.creatures.length > 0) {
            updateConditionalSettings(selectedEffect, trigger.id, 'creatures',
              [...state.summoningConfig.creatures]);
          }

          updateConditionalSettings(selectedEffect, trigger.id, 'duration',
            state.summoningConfig?.duration || 10);
          updateConditionalSettings(selectedEffect, trigger.id, 'durationUnit',
            state.summoningConfig?.durationUnit || 'minutes');
          updateConditionalSettings(selectedEffect, trigger.id, 'quantity',
            state.summoningConfig?.quantity || state.summoningConfig?.count || 1);
          updateConditionalSettings(selectedEffect, trigger.id, 'controlType',
            state.summoningConfig?.controlType || 'verbal');
          updateConditionalSettings(selectedEffect, trigger.id, 'controlRange',
            state.summoningConfig?.controlRange || 60);
        }
        // For control effects, initialize with control settings
        else if (selectedEffect === 'control') {
          // Initialize control settings
          updateConditionalSettings(selectedEffect, trigger.id, 'controlType',
            state.controlConfig?.controlType || 'stun');
          updateConditionalSettings(selectedEffect, trigger.id, 'duration',
            state.controlConfig?.duration || 1);
          updateConditionalSettings(selectedEffect, trigger.id, 'durationUnit',
            state.controlConfig?.durationUnit || 'rounds');
          updateConditionalSettings(selectedEffect, trigger.id, 'savingThrow',
            state.controlConfig?.savingThrow || 'strength');
          updateConditionalSettings(selectedEffect, trigger.id, 'difficultyClass',
            state.controlConfig?.difficultyClass || 15);

          // If there are effects, copy them as well
          if (state.controlConfig?.effects && state.controlConfig.effects.length > 0) {
            updateConditionalSettings(selectedEffect, trigger.id, 'effects',
              [...state.controlConfig.effects]);
          }
        }
        // For restoration effects, initialize with resource type and formula
        else if (selectedEffect === 'restoration' || selectedEffect?.startsWith('restoration_')) {
          // Initialize the formula
          updateConditionalFormula(selectedEffect, trigger.id, state.restorationConfig?.formula || '2d6 + INT');

          // Initialize resource type settings
          updateConditionalSettings(selectedEffect, trigger.id, 'resourceType',
            state.restorationConfig?.resourceType || 'mana');
          updateConditionalSettings(selectedEffect, trigger.id, 'resolution',
            state.restorationConfig?.resolution || 'DICE');

          // Initialize over-time settings if applicable
          if (state.restorationConfig?.isOverTime) {
            updateConditionalSettings(selectedEffect, trigger.id, 'isOverTime', true);
            updateConditionalSettings(selectedEffect, trigger.id, 'overTimeFormula',
              state.restorationConfig?.overTimeFormula || '1d4 + INT/2');
            updateConditionalSettings(selectedEffect, trigger.id, 'overTimeDuration',
              state.restorationConfig?.overTimeDuration || 3);
            updateConditionalSettings(selectedEffect, trigger.id, 'tickFrequency',
              state.restorationConfig?.tickFrequency || 'round');
            updateConditionalSettings(selectedEffect, trigger.id, 'application',
              state.restorationConfig?.application || 'start');
            updateConditionalSettings(selectedEffect, trigger.id, 'overTimeTriggerType',
              state.restorationConfig?.overTimeTriggerType || 'periodic');
          }

          // Initialize progressive stages if applicable
          if (state.restorationConfig?.isProgressiveOverTime &&
              state.restorationConfig?.overTimeProgressiveStages &&
              state.restorationConfig.overTimeProgressiveStages.length > 0) {
            updateConditionalSettings(selectedEffect, trigger.id, 'isProgressiveOverTime', true);
            updateConditionalSettings(selectedEffect, trigger.id, 'overTimeProgressiveStages',
              [...state.restorationConfig.overTimeProgressiveStages]);
          }
        }
        else {
          // For other effects, just initialize the formula
          updateConditionalFormula(selectedEffect, trigger.id, '');
        }
      }
    }
  };

  // Remove a trigger from the configuration
  const removeTrigger = (index) => {
    if (editingMode === 'global') {
      if (triggerMode === 'required') {
        // Remove from required conditions
        const updatedConditions = [...(requiredConditions.conditions || [])];
        updatedConditions.splice(index, 1);
        setRequiredConditions({ ...requiredConditions, conditions: updatedConditions });
      } else {
        // Remove from global triggers
        const updatedTriggers = [...(triggerConfig.compoundTriggers || [])];
        updatedTriggers.splice(index, 1);

        const newConfig = {
          ...triggerConfig,
          compoundTriggers: updatedTriggers
        };

        setTriggerConfig(newConfig);
        validateTriggerConfig(newConfig);
      }
    } else if (editingMode === 'effect' && selectedEffect && effectTriggers[selectedEffect]) {
      // Remove from effect-specific triggers
      const newEffectTriggers = { ...effectTriggers };
      const updatedTriggers = [...(newEffectTriggers[selectedEffect].compoundTriggers || [])];
      updatedTriggers.splice(index, 1);

      newEffectTriggers[selectedEffect] = {
        ...newEffectTriggers[selectedEffect],
        compoundTriggers: updatedTriggers
      };

      setEffectTriggers(newEffectTriggers);

      // Update the context with the new effect triggers
      dispatch({
        type: ACTION_TYPES.UPDATE_EFFECT_TRIGGER,
        payload: {
          effectType: selectedEffect,
          triggerConfig: newEffectTriggers[selectedEffect]
        }
      });
    }
  };

  // Update a trigger parameter
  const updateTriggerParameter = (triggerIndex, paramName, value) => {
    if (editingMode === 'global') {
      // Update global trigger parameter
      const updatedTriggers = [...(triggerConfig.compoundTriggers || [])];
      updatedTriggers[triggerIndex].parameters[paramName] = value;

      const newConfig = {
        ...triggerConfig,
        compoundTriggers: updatedTriggers
      };

      setTriggerConfig(newConfig);
      validateTriggerConfig(newConfig);
    } else if (editingMode === 'effect' && selectedEffect && effectTriggers[selectedEffect]) {
      // Update effect-specific trigger parameter
      const newEffectTriggers = { ...effectTriggers };
      const updatedTriggers = [...(newEffectTriggers[selectedEffect].compoundTriggers || [])];
      updatedTriggers[triggerIndex].parameters[paramName] = value;

      newEffectTriggers[selectedEffect] = {
        ...newEffectTriggers[selectedEffect],
        compoundTriggers: updatedTriggers
      };

      setEffectTriggers(newEffectTriggers);

      // Update the context with the new effect triggers
      dispatch({
        type: ACTION_TYPES.UPDATE_EFFECT_TRIGGER,
        payload: {
          effectType: selectedEffect,
          triggerConfig: newEffectTriggers[selectedEffect]
        }
      });
    }
  };

  // Set the logic type (AND/OR)
  const setLogicType = (logicType) => {
    if (editingMode === 'global') {
      // Set global logic type
      const newConfig = {
        ...triggerConfig,
        logicType
      };

      setTriggerConfig(newConfig);
    } else if (editingMode === 'effect' && selectedEffect) {
      // Set effect-specific logic type
      const newEffectTriggers = { ...effectTriggers };
      if (!newEffectTriggers[selectedEffect]) {
        newEffectTriggers[selectedEffect] = {
          logicType,
          compoundTriggers: [],
          targetingOverride: null
        };
      } else {
        newEffectTriggers[selectedEffect] = {
          ...newEffectTriggers[selectedEffect],
          logicType
        };
      }

      setEffectTriggers(newEffectTriggers);

      // Update the context with the new effect triggers
      dispatch({
        type: ACTION_TYPES.UPDATE_EFFECT_TRIGGER,
        payload: {
          effectType: selectedEffect,
          triggerConfig: newEffectTriggers[selectedEffect]
        }
      });
    }
  };

  // Effect to update context when configuration changes
  useEffect(() => {
    dispatch({
      type: ACTION_TYPES.UPDATE_TRIGGER_CONFIG,
      payload: {
        global: triggerConfig,
        effectTriggers: effectTriggers,
        buffDebuffTriggers: {}, // Remove buffDebuffTriggers - no longer used
        requiredConditions: requiredConditions
      }
    });
  }, [triggerConfig, effectTriggers, requiredConditions, dispatch]);

  // Effect to update trigger role in context - Always CONDITIONAL mode
  useEffect(() => {
    dispatch({
      type: ACTION_TYPES.UPDATE_TRIGGER_ROLE,
      payload: {
        mode: 'CONDITIONAL'
      }
    });
  }, [dispatch]);

  // Effect to update context when conditional effects change
  useEffect(() => {
    // Update the context with conditional effects
    Object.entries(conditionalEffects).forEach(([effectType, config]) => {
      dispatch({
        type: ACTION_TYPES.UPDATE_CONDITIONAL_EFFECT,
        payload: {
          effectType,
          config
        }
      });
    });
  }, [conditionalEffects, dispatch]);

  return {
    errors, setErrors,
    triggerConfig, setTriggerConfig,
    effectTriggers, setEffectTriggers,
    selectedEffect, setSelectedEffect,
    editingMode, setEditingMode,
    triggerMode, setTriggerMode,
    requiredConditions, setRequiredConditions,
    conditionalEffects, setConditionalEffects,
    selectedCategory, setSelectedCategory,
    addTrigger, removeTrigger, updateTriggerParameter, setLogicType,
    toggleConditionalEffect, updateConditionalFormula, updateConditionalSettings,
    validateTriggerConfig,
    requiresTriggers
  };
}
