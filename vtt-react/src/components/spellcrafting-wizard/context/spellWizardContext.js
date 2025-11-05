import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';

// Action types
export const ACTION_TYPES = {
  // Basic information
  SET_NAME: 'SET_NAME',
  SET_DESCRIPTION: 'SET_DESCRIPTION',
  SET_LEVEL: 'SET_LEVEL',
  SET_SCHOOL: 'SET_SCHOOL',
  SET_ICON: 'SET_ICON',

  // Spell type
  SET_SPELL_TYPE: 'SET_SPELL_TYPE',
  UPDATE_TYPE_CONFIG: 'UPDATE_TYPE_CONFIG',

  // Effects
  ADD_EFFECT_TYPE: 'ADD_EFFECT_TYPE',
  REMOVE_EFFECT_TYPE: 'REMOVE_EFFECT_TYPE',
  UPDATE_EFFECTS_MAP: 'UPDATE_EFFECTS_MAP',
  UPDATE_DAMAGE_CONFIG: 'UPDATE_DAMAGE_CONFIG',
  UPDATE_HEALING_CONFIG: 'UPDATE_HEALING_CONFIG',
  UPDATE_BUFF_CONFIG: 'UPDATE_BUFF_CONFIG',
  UPDATE_DEBUFF_CONFIG: 'UPDATE_DEBUFF_CONFIG',
  UPDATE_UTILITY_CONFIG: 'UPDATE_UTILITY_CONFIG',
  UPDATE_CONTROL_CONFIG: 'UPDATE_CONTROL_CONFIG',
  UPDATE_SUMMON_CONFIG: 'UPDATE_SUMMON_CONFIG',
  UPDATE_SUMMONING_CONFIG: 'UPDATE_SUMMONING_CONFIG',
  UPDATE_TRANSFORM_CONFIG: 'UPDATE_TRANSFORM_CONFIG',
  UPDATE_TRANSFORMATION_CONFIG: 'UPDATE_TRANSFORMATION_CONFIG',
  UPDATE_PURIFICATION_CONFIG: 'UPDATE_PURIFICATION_CONFIG',
  UPDATE_RESTORATION_CONFIG: 'UPDATE_RESTORATION_CONFIG',
  UPDATE_ROLLABLE_TABLE: 'UPDATE_ROLLABLE_TABLE',

  // Targeting and propagation
  UPDATE_TARGETING_CONFIG: 'UPDATE_TARGETING_CONFIG',
  UPDATE_TARGETING_TAGS: 'UPDATE_TARGETING_TAGS',
  SET_TARGETING_MODE: 'SET_TARGETING_MODE',
  UPDATE_EFFECT_TARGETING: 'UPDATE_EFFECT_TARGETING',
  UPDATE_DURATION_CONFIG: 'UPDATE_DURATION_CONFIG',
  UPDATE_PERSISTENT_CONFIG: 'UPDATE_PERSISTENT_CONFIG',
  UPDATE_PROPAGATION: 'UPDATE_PROPAGATION',

  // Resources
  UPDATE_RESOURCE_COST: 'UPDATE_RESOURCE_COST',

  // Mechanics
  UPDATE_MECHANICS_CONFIG: 'UPDATE_MECHANICS_CONFIG',

  // Cooldown
  UPDATE_COOLDOWN_CONFIG: 'UPDATE_COOLDOWN_CONFIG',

  // Triggers
  UPDATE_TRIGGER_CONFIG: 'UPDATE_TRIGGER_CONFIG',
  UPDATE_EFFECT_TRIGGER: 'UPDATE_EFFECT_TRIGGER',
  REMOVE_EFFECT_TRIGGER: 'REMOVE_EFFECT_TRIGGER',
  UPDATE_CONDITIONAL_EFFECT: 'UPDATE_CONDITIONAL_EFFECT',
  UPDATE_TRIGGER_ROLE: 'UPDATE_TRIGGER_ROLE',

  // Trap Placement
  UPDATE_TRAP_CONFIG: 'UPDATE_TRAP_CONFIG',

  // Channeling
  UPDATE_CHANNELING_CONFIG: 'UPDATE_CHANNELING_CONFIG',

  // Resolution mechanics for effects
  SET_EFFECT_RESOLUTION: 'SET_EFFECT_RESOLUTION',
  UPDATE_EFFECT_RESOLUTION_CONFIG: 'UPDATE_EFFECT_RESOLUTION_CONFIG',
  UPDATE_EFFECT_RESOLUTIONS: 'UPDATE_EFFECT_RESOLUTIONS',

  // Step mechanics for effects
  UPDATE_EFFECT_MECHANICS_CONFIG: 'UPDATE_EFFECT_MECHANICS_CONFIG',

  // Effects for Mechanics
  ADD_EFFECT_TO_MECHANICS: 'ADD_EFFECT_TO_MECHANICS',
  REMOVE_EFFECT_FROM_MECHANICS: 'REMOVE_EFFECT_FROM_MECHANICS',
  UPDATE_MECHANICS_EFFECTS: 'UPDATE_MECHANICS_EFFECTS',

  // Combined Effects
  CREATE_COMBINED_EFFECT: 'CREATE_COMBINED_EFFECT',
  UPDATE_COMBINED_EFFECT: 'UPDATE_COMBINED_EFFECT',
  DELETE_COMBINED_EFFECT: 'DELETE_COMBINED_EFFECT',
  ADD_COMBINED_EFFECT_TO_MECHANICS: 'ADD_COMBINED_EFFECT_TO_MECHANICS',
  REMOVE_COMBINED_EFFECT_FROM_MECHANICS: 'REMOVE_COMBINED_EFFECT_FROM_MECHANICS',

  // Wizard navigation
  SET_CURRENT_STEP: 'SET_CURRENT_STEP',
  MARK_STEP_COMPLETED: 'MARK_STEP_COMPLETED',
  UPDATE_WIZARD_FLOW: 'UPDATE_WIZARD_FLOW',

  // Validation
  SET_ERRORS: 'SET_ERRORS',
  SET_WARNINGS: 'SET_WARNINGS',
  SET_VALIDATION: 'SET_VALIDATION',
  SET_VALIDITY: 'SET_VALIDITY',

  // Full reset/set
  RESET_STATE: 'RESET_STATE',
  LOAD_SPELL: 'LOAD_SPELL'
};

// Initial state
const initialState = {
  // Basic information
  name: '',
  description: '',
  level: '',
  school: '',
  icon: '',

  // Type configuration
  spellType: '', // ACTION, CHANNELED, PASSIVE, REACTION, TRAP, STATE
  typeConfig: {}, // Type-specific configuration

  // Effects configuration
  effectTypes: [], // Selected effect types
  effectsMap: {}, // Map of effect types to boolean (enabled/disabled)
  damageConfig: null,
  healingConfig: null,
  buffConfig: null,
  debuffConfig: null,
  utilityConfig: null,
  controlConfig: null,
  summonConfig: null,
  transformConfig: null,
  purificationConfig: null,
  restorationConfig: null,
  rollableTable: null, // Rollable table configuration

  // Resolution mechanics for effects
  effectResolutions: {}, // Resolution types for each effect

  // Step mechanics for effects
  effectMechanicsConfigs: {}, // Step mechanics configurations for each effect

  // Effects available for Mechanics
  mechanicsAvailableEffects: [], // Effects made available for class mechanics

  // Combined effects
  combinedEffects: [], // Combined effects
  mechanicsAvailableCombinedEffects: [], // Combined effects available for class mechanics

  // Targeting configuration
  targetingConfig: {},
  targetingMode: 'unified', // 'unified' or 'effect'
  targetingTags: {
    // Example structure:
    // damage: { targetRestrictions: ['enemy'] },
    // healing: { targetRestrictions: ['ally', 'self'] }
  },
  effectTargeting: {
    // Example structure:
    // damage: { targetingType: 'area', aoeShape: 'circle', ... },
    // healing: { targetingType: 'single', ... }
  },

  // Duration configuration
  durationConfig: {},
  persistentConfig: {},

  // Propagation configuration
  propagation: null,

  // Resource configuration
  resourceCost: {
    components: [],
    materialComponents: '',
    actionPoints: 1,
    actionPointsSelected: true, // Whether action points are selected
    resourceTypes: [], // Array of selected resource types
    resourceValues: {}, // Object mapping resource types to values
    resourceFormulas: {}, // Object mapping resource types to formulas
    useFormulas: {} // Object mapping resource types to boolean (use formula or not)
  },

  // Class mechanics
  mechanicsConfig: {
    cards: null,
    combos: null,
    coins: null,
    stateRequirements: [],
    stateOptions: {
      thresholds: []
    }
  },

  // Cooldown configuration
  cooldownConfig: {},

  // Trigger configuration (for REACTION, PASSIVE, or TRAP types)
  triggerConfig: {
    // Global triggers for the entire spell
    global: {
      logicType: 'AND',
      compoundTriggers: []
    },
    // Effect-specific triggers
    effectTriggers: {},
    // Example structure:
    // effectTriggers: {
    //   damage: {
    //     logicType: 'AND',
    //     compoundTriggers: [],
    //     targetingOverride: 'nearest'
    //   }
    // }

    // Track which effects have conditional activation
    conditionalEffects: {},
    // Example structure:
    // conditionalEffects: {
    //   damage: {
    //     isConditional: true,
    //     defaultEnabled: false,
    //     conditionalFormulas: {
    //       'health_below_30': '2d6 + INT',
    //       'default': '1d6 + INT/2'
    //     }
    //   }
    // }

    // Triggers attached to effects created by this spell
    // When a spell creates an effect (buff, debuff, restoration, etc.), triggers can be attached to it
    buffDebuffTriggers: {
      // Map of effect type to trigger configuration
      // Example: { buff: { triggers: [...], triggersEffect: 'restoration' } }
      //           { restoration: { triggers: [...], triggersEffect: null } }
    },

    // Required conditions - conditions that must be met before the spell can be cast
    // Example: "I must have a shield buff" means spell can only be cast if caster has shield
    requiredConditions: {
      enabled: false,
      logicType: 'AND', // 'AND' or 'OR'
      conditions: [] // Array of trigger conditions
    },

    // Trigger role configuration
    triggerRole: {
      mode: 'CONDITIONAL' // Always CONDITIONAL - auto-cast removed
    }
  },

  // Trap placement configuration
  trapConfig: {},

  // Channeling configuration
  channelingConfig: {},

  // Validation results
  errors: {},
  warnings: {},

  // Wizard progress
  currentStep: 1,
  completedSteps: [],
  wizardFlow: [], // Dynamic step sequence

  // Meta information
  lastModified: null,
  isValid: false
};

// Create contexts
const SpellWizardStateContext = createContext();
const SpellWizardDispatchContext = createContext();

// Helper functions

// Determine wizard flow based on current state
function determineWizardFlow(state) {
  // Define standard steps
  const standardSteps = [
    { id: 1, name: 'Basic Info', required: true },
    { id: 2, name: 'Spell Type', required: true },
    { id: 3, name: 'Effects', required: true },
    { id: 4, name: 'Targeting & Propagation', required: true },
    { id: 5, name: 'Resources', required: true },
    { id: 6, name: 'Cooldown', required: true },
    { id: 'rollable-table', name: 'Rollable Table', required: false },
    { id: 'mechanics', name: 'Mechanics', required: false }
  ];

  // For trap spells, we'll skip the targeting step since it's handled in the trap placement step
  if (state.spellType === 'TRAP') {
    standardSteps.splice(3, 1); // Remove the Targeting & Propagation step
  }

  // Add type-specific steps
  let flow = [...standardSteps];

  // Add Trigger step after Spell Type for all spell types
  flow.splice(3, 0, { id: 'triggers', name: 'Triggers', required: state.spellType === 'REACTION' || state.spellType === 'PASSIVE' || state.spellType === 'TRAP' || state.spellType === 'STATE' });


  if (state.spellType === 'TRAP') {
    // Add Trap Placement step after Triggers
    flow.splice(4, 0, { id: 'trap-placement', name: 'Trap Placement', required: true });
  }

  if (state.spellType === 'CHANNELED') {
    // Add Channeling step after Duration
    flow.splice(6, 0, { id: 'channeling', name: 'Channeling', required: true });
  }

  // Always include the Mechanics step at the end if it doesn't exist
  const mechanicsIndex = flow.findIndex(step => step.id === 'mechanics');
  if (mechanicsIndex === -1) {
    // Add the Mechanics step at the end
    flow.push({ id: 'mechanics', name: 'Mechanics', required: false });
  }

  return flow;
}

// Validate effect configurations
function validateEffectConfigurations(state) {
  for (const effectType of state.effectTypes) {
    switch (effectType) {
      case 'damage':
        if (!state.damageConfig) return false;
        break;
      case 'healing':
        if (!state.healingConfig) return false;
        break;
      case 'buff':
        if (!state.buffConfig) return false;
        break;
      case 'debuff':
        if (!state.debuffConfig) return false;
        break;
      case 'utility':
        if (!state.utilityConfig) return false;
        break;
      case 'control':
        if (!state.controlConfig) return false;
        break;
      case 'summon':
        if (!state.summonConfig) return false;
        break;
      case 'transform':
        if (!state.transformConfig) return false;
        break;
      case 'purification':
        if (!state.purificationConfig) return false;
        break;
      case 'restoration':
        if (!state.restorationConfig) return false;
        break;
    }
  }

  return true;
}

// Check if a step is complete
function validateStepCompletion(step, state) {
  switch (step) {
    case 1: // Basic Info
      return !!state.name && !!state.description;

    case 2: // Spell Type
      return !!state.spellType && !!state.typeConfig && Object.keys(state.typeConfig).length > 0;

    case 'triggers': // Triggers (required for REACTION, PASSIVE, TRAP, or STATE, optional for others)
      if (state.spellType === 'REACTION' || state.spellType === 'PASSIVE' || state.spellType === 'TRAP' || state.spellType === 'STATE') {
        return !!state.triggerConfig && !!state.triggerConfig.global && !!state.triggerConfig.global.compoundTriggers && state.triggerConfig.global.compoundTriggers.length > 0;
      } else {
        // For other spell types, the trigger step is always considered complete
        return true;
      }

    case 'trap-placement': // Trap Placement (for TRAP)
      return !!state.trapConfig && Object.keys(state.trapConfig).length > 0;

    case 3: // Effects
      return state.effectTypes && state.effectTypes.length > 0 && validateEffectConfigurations(state);

    case 4: // Targeting & Propagation
      return !!state.targetingConfig && Object.keys(state.targetingConfig).length > 0 && state.propagation !== null;

    case 'channeling': // Channeling (for CHANNELED spells)
      // Check for DoT and HoT effects with channeled trigger type
      const hasDotChanneled = state.damageConfig && state.damageConfig.hasDot && state.damageConfig.dotTriggerType === 'channeled';
      const hasHotChanneled = state.healingConfig && state.healingConfig.hasHot && state.healingConfig.hotTriggerType === 'channeled';

      // If there are channeled DoT or HoT effects, make sure they are configured in the channeling step
      if (hasDotChanneled || hasHotChanneled) {
        return !!state.channelingConfig && Object.keys(state.channelingConfig).length > 0 &&
               (state.channelingConfig.type === 'power_up' ||
                state.channelingConfig.type === 'persistent' ||
                state.channelingConfig.type === 'staged');
      }

      return !!state.channelingConfig && Object.keys(state.channelingConfig).length > 0;

    case 'rollable-table': // Rollable Table
      // If rollable table is enabled, validate it has entries
      if (state.rollableTable && state.rollableTable.enabled) {
        return state.rollableTable.entries && state.rollableTable.entries.length > 0;
      }
      // If not enabled, the step is considered complete
      return true;

    case 'mechanics': // Class Mechanics
      return true; // This would depend on specific validation rules

    case 5: // Resources
      return !!state.resourceCost && Object.keys(state.resourceCost).length > 0;

    case 6: // Cooldown
      return !!state.cooldownConfig && Object.keys(state.cooldownConfig).length > 0;

    case 7: // Review
      return state.isValid;

    default:
      return false;
  }
}

// Determine the next step in the wizard
function determineNextStep(state) {
  const currentStepIndex = state.wizardFlow.findIndex(step => step.id === state.currentStep);

  if (currentStepIndex === -1 || currentStepIndex >= state.wizardFlow.length - 1) {
    return null; // No next step or current step not found
  }

  return state.wizardFlow[currentStepIndex + 1].id;
}

// Get dependencies for a step
function getStepRequirements(step) {
  switch (step) {
    case 1: // Basic Info
      return [];

    case 2: // Spell Type
      return [1];

    case 'trigger': // Triggers
      return [1, 2];

    case 3: // Effects
      return [1, 2];

    case 4: // Targeting & Propagation
      return [1, 2, 3];

    case 'channeling': // Channeling
      return [1, 2, 3, 4];

    case 5: // Resources
      return [1, 2, 3, 4];

    case 6: // Cooldown
      return [1, 2, 3, 4, 5];

    case 'mechanics': // Mechanics Configuration
      return [1, 2, 3, 4, 5, 6];

    case 7: // Review
      return [1, 2, 3, 4, 5, 6, 'mechanics'];

    default:
      return [];
  }
}

// Validation function
function validateState(state) {
  const errors = {};
  const warnings = {};

  // Validate basic information
  if (!state.name) {
    errors.name = 'Spell name is required';
  }

  if (!state.spellType) {
    errors.spellType = 'Spell type is required';
  }

  // Validate effect types
  if (state.effectTypes.length === 0) {
    errors.effectTypes = 'At least one effect type is required';
  }

  // Validate effect configurations based on selected effect types
  if (state.effectTypes.includes('damage') && !state.damageConfig) {
    errors.damageConfig = 'Damage configuration is required';
  }

  if (state.effectTypes.includes('healing') && !state.healingConfig) {
    errors.healingConfig = 'Healing configuration is required';
  }

  if (state.effectTypes.includes('buff') && !state.buffConfig) {
    errors.buffConfig = 'Buff configuration is required';
  }

  if (state.effectTypes.includes('debuff') && !state.debuffConfig) {
    errors.debuffConfig = 'Debuff configuration is required';
  }

  if (state.effectTypes.includes('utility') && !state.utilityConfig) {
    errors.utilityConfig = 'Utility configuration is required';
  }

  if (state.effectTypes.includes('control') && !state.controlConfig) {
    errors.controlConfig = 'Control configuration is required';
  }

  if (state.effectTypes.includes('summon') && !state.summonConfig) {
    errors.summonConfig = 'Summon configuration is required';
  }

  if (state.effectTypes.includes('transform') && !state.transformConfig) {
    errors.transformConfig = 'Transform configuration is required';
  }

  if (state.effectTypes.includes('purification') && !state.purificationConfig) {
    errors.purificationConfig = 'Purification configuration is required';
  }

  if (state.effectTypes.includes('restoration') && !state.restorationConfig) {
    errors.restorationConfig = 'Restoration configuration is required';
  }

  // Validate targeting configuration
  if (!state.targetingConfig || Object.keys(state.targetingConfig).length === 0) {
    errors.targetingConfig = 'Targeting configuration is required';
  }

  // Validate duration configuration
  if (!state.durationConfig || Object.keys(state.durationConfig).length === 0) {
    errors.durationConfig = 'Duration configuration is required';
  }

  // Type-specific validations
  if (state.spellType === 'REACTION' || state.spellType === 'PASSIVE' || state.spellType === 'TRAP' || state.spellType === 'STATE') {
    if (!state.triggerConfig || !state.triggerConfig.global || !state.triggerConfig.global.compoundTriggers || state.triggerConfig.global.compoundTriggers.length === 0) {
      errors.triggerConfig = 'Trigger configuration is required for Reaction/Passive/Trap/State spells';
    }
  } else if (state.triggerConfig && state.triggerConfig.global && state.triggerConfig.global.compoundTriggers && state.triggerConfig.global.compoundTriggers.length > 0) {
    // For other spell types, triggers are optional but valid
  }

  if (state.spellType === 'TRAP') {
    if (!state.trapConfig || Object.keys(state.trapConfig).length === 0) {
      errors.trapConfig = 'Trap placement configuration is required for Trap spells';
    }
  }

  if (state.spellType === 'STATE') {
    // Ensure state spells have proper activation conditions
    if (!state.triggerConfig || !state.triggerConfig.activationCondition) {
      errors.triggerConfig = 'State spells must define an activation condition';
    }
  }

  if (state.spellType === 'CHANNELED') {
    if (!state.channelingConfig || Object.keys(state.channelingConfig).length === 0) {
      errors.channelingConfig = 'Channeling configuration is required for Channeled spells';
    }

    // Check for DoT and HoT effects with channeled trigger type
    const hasDotChanneled = state.damageConfig && state.damageConfig.hasDot && state.damageConfig.dotTriggerType === 'channeled';
    const hasHotChanneled = state.healingConfig && state.healingConfig.hasHot && state.healingConfig.hotTriggerType === 'channeled';

    // If there are channeled DoT or HoT effects, make sure they are configured in the channeling step
    if ((hasDotChanneled || hasHotChanneled) &&
        (!state.channelingConfig ||
         !state.channelingConfig.type ||
         (state.channelingConfig.type !== 'power_up' &&
          state.channelingConfig.type !== 'persistent' &&
          state.channelingConfig.type !== 'staged'))) {
      errors.channelingConfig = 'Channeled DoT/HoT effects require Power Up, Persistent, or Staged channeling type';
    }
  }

  // Warning for high-level spells without appropriate effects
  if (state.level >= 5 && state.effectTypes.length < 2) {
    warnings.level = 'High-level spells typically have multiple effects';
  }

  return { errors, warnings };
}

// Reducer function
function spellWizardReducer(state, action) {
  switch (action.type) {
    // Basic information
    case ACTION_TYPES.SET_NAME:
      return {
        ...state,
        name: action.payload,
        lastModified: new Date()
      };

    case ACTION_TYPES.SET_DESCRIPTION:
      return {
        ...state,
        description: action.payload,
        lastModified: new Date()
      };

    case ACTION_TYPES.SET_LEVEL:
      return {
        ...state,
        level: action.payload,
        lastModified: new Date()
      };

    // Type configuration
    case ACTION_TYPES.SET_SPELL_TYPE:
      // When changing spell type, preserve important configurations like damage types
      return {
        ...state,
        spellType: action.payload,
        typeConfig: {
          // Preserve damage types, icon, school, and tags when changing spell type
          icon: state.typeConfig?.icon,
          school: state.typeConfig?.school, // Primary damage type
          secondaryElement: state.typeConfig?.secondaryElement, // Secondary damage type
          tags: state.typeConfig?.tags
          // Other type-specific configs will be reset and reconfigured for the new type
        },
        // Reset trigger config if changing from REACTION/PASSIVE/STATE to other
        triggerConfig: (action.payload !== 'REACTION' && action.payload !== 'PASSIVE' && action.payload !== 'STATE')
          ? {}
          : state.triggerConfig,
        // Reset channeling config if changing from CHANNELED to other
        channelingConfig: (action.payload !== 'CHANNELED')
          ? {}
          : state.channelingConfig,
        lastModified: new Date(),
        // Update wizard flow based on new spell type
        wizardFlow: determineWizardFlow({...state, spellType: action.payload})
      };

    case ACTION_TYPES.UPDATE_TYPE_CONFIG:
      return {
        ...state,
        typeConfig: {
          ...state.typeConfig,
          ...action.payload
        },
        lastModified: new Date()
      };

    // Effects configuration
    case ACTION_TYPES.SET_EFFECT_TYPES:
      return {
        ...state,
        effectTypes: action.payload,
        lastModified: new Date()
      };

    case ACTION_TYPES.ADD_EFFECT_TYPE:
      return {
        ...state,
        effectTypes: [...state.effectTypes, action.payload],
        lastModified: new Date()
      };

    case ACTION_TYPES.REMOVE_EFFECT_TYPE:
      const newState = {
        ...state,
        effectTypes: state.effectTypes.filter(type => type !== action.payload),
        lastModified: new Date()
      };

      // Clear associated configuration when effect type is removed
      switch (action.payload) {
        case 'damage':
          newState.damageConfig = null;
          break;
        case 'healing':
          newState.healingConfig = null;
          break;
        case 'buff':
          newState.buffConfig = null;
          break;
        case 'debuff':
          newState.debuffConfig = null;
          break;
        case 'utility':
          newState.utilityConfig = null;
          break;
        case 'control':
          newState.controlConfig = null;
          break;
        case 'summoning':
          newState.summonConfig = null;
          break;
        case 'transformation':
          newState.transformConfig = null;
          break;
        case 'purification':
          newState.purificationConfig = null;
          break;
        case 'restoration':
          newState.restorationConfig = null;
          break;
      }

      return newState;

    case ACTION_TYPES.UPDATE_EFFECTS_MAP:
      return {
        ...state,
        effectsMap: action.payload,
        lastModified: new Date()
      };

    case ACTION_TYPES.UPDATE_DAMAGE_CONFIG:
      return {
        ...state,
        damageConfig: {
          ...state.damageConfig,
          ...action.payload,
          // Ensure dotConfig is properly merged
          dotConfig: {
            ...(state.damageConfig?.dotConfig || {}),
            ...(action.payload.dotConfig || {}),
            // Ensure dotFormulas array is properly handled
            dotFormulas: action.payload.dotConfig?.dotFormulas ||
                        state.damageConfig?.dotConfig?.dotFormulas ||
                        [{ round: 1, formula: '1d4' }]
          }
        },
        lastModified: new Date()
      };

    case ACTION_TYPES.UPDATE_HEALING_CONFIG:
      return {
        ...state,
        healingConfig: {
          ...state.healingConfig,
          ...action.payload
        },
        lastModified: new Date()
      };

    case ACTION_TYPES.UPDATE_BUFF_CONFIG:
      return {
        ...state,
        buffConfig: {
          ...state.buffConfig,
          ...action.payload
        },
        lastModified: new Date()
      };

    case ACTION_TYPES.UPDATE_DEBUFF_CONFIG:
      return {
        ...state,
        debuffConfig: {
          ...state.debuffConfig,
          ...action.payload
        },
        lastModified: new Date()
      };

    case ACTION_TYPES.UPDATE_UTILITY_CONFIG:
      return {
        ...state,
        utilityConfig: {
          ...state.utilityConfig,
          ...action.payload
        },
        lastModified: new Date()
      };

    case ACTION_TYPES.UPDATE_CONTROL_CONFIG:
      return {
        ...state,
        controlConfig: {
          ...state.controlConfig,
          ...action.payload
        },
        lastModified: new Date()
      };

    case ACTION_TYPES.UPDATE_SUMMON_CONFIG:
      return {
        ...state,
        summonConfig: {
          ...state.summonConfig,
          ...action.payload
        },
        lastModified: new Date()
      };

    case ACTION_TYPES.UPDATE_TRANSFORM_CONFIG:
      return {
        ...state,
        transformConfig: {
          ...state.transformConfig,
          ...action.payload
        },
        lastModified: new Date()
      };

    case ACTION_TYPES.UPDATE_PURIFICATION_CONFIG:
      return {
        ...state,
        purificationConfig: {
          ...state.purificationConfig,
          ...action.payload
        },
        lastModified: new Date()
      };

    case ACTION_TYPES.UPDATE_RESTORATION_CONFIG:
      return {
        ...state,
        restorationConfig: {
          ...state.restorationConfig,
          ...action.payload
        },
        lastModified: new Date()
      };

    case ACTION_TYPES.UPDATE_ROLLABLE_TABLE:
      return {
        ...state,
        rollableTable: action.payload,
        lastModified: new Date()
      };

    // Resolution mechanics for effects
    case ACTION_TYPES.SET_EFFECT_RESOLUTION:
      return {
        ...state,
        effectResolutions: {
          ...state.effectResolutions,
          [action.payload.effectId]: {
            type: action.payload.resolutionType,
            config: {}  // Initialize empty config
          }
        },
        lastModified: new Date()
      };

    case ACTION_TYPES.UPDATE_EFFECT_RESOLUTION_CONFIG:
      const currentResolution = state.effectResolutions[action.payload.effectId] || {};
      return {
        ...state,
        effectResolutions: {
          ...state.effectResolutions,
          [action.payload.effectId]: {
            ...currentResolution,
            type: currentResolution.type || 'DICE',  // Default to dice if no type set
            config: {
              ...(currentResolution.config || {}),
              ...action.payload.config
            }
          }
        },
        lastModified: new Date()
      };

    case ACTION_TYPES.UPDATE_EFFECT_RESOLUTIONS:
      return {
        ...state,
        effectResolutions: action.payload,
        lastModified: new Date()
      };

    // Step mechanics for effects
    case ACTION_TYPES.UPDATE_EFFECT_MECHANICS_CONFIG:
      return {
        ...state,
        effectMechanicsConfigs: {
          ...state.effectMechanicsConfigs,
          [action.payload.effectId]: action.payload.config
        },
        lastModified: new Date()
      };

    // Effects for Mechanics
    case ACTION_TYPES.ADD_EFFECT_TO_MECHANICS:
      // Check if this effect is already available for mechanics
      if (state.mechanicsAvailableEffects.some(effect => effect.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        mechanicsAvailableEffects: [...state.mechanicsAvailableEffects, action.payload],
        lastModified: new Date()
      };

    case ACTION_TYPES.REMOVE_EFFECT_FROM_MECHANICS:
      return {
        ...state,
        mechanicsAvailableEffects: state.mechanicsAvailableEffects.filter(
          effect => effect.id !== action.payload
        ),
        lastModified: new Date()
      };

    case ACTION_TYPES.UPDATE_MECHANICS_EFFECTS:
      return {
        ...state,
        mechanicsAvailableEffects: action.payload,
        lastModified: new Date()
      };

    // Combined Effects
    case ACTION_TYPES.CREATE_COMBINED_EFFECT:
      return {
        ...state,
        combinedEffects: [...state.combinedEffects, action.payload],
        lastModified: new Date()
      };

    case ACTION_TYPES.UPDATE_COMBINED_EFFECT:
      return {
        ...state,
        combinedEffects: state.combinedEffects.map(effect => effect.id === action.payload.id ? action.payload : effect),
        lastModified: new Date()
      };

    case ACTION_TYPES.DELETE_COMBINED_EFFECT:
      return {
        ...state,
        combinedEffects: state.combinedEffects.filter(effect => effect.id !== action.payload),
        lastModified: new Date()
      };

    case ACTION_TYPES.ADD_COMBINED_EFFECT_TO_MECHANICS:
      // Check if this effect is already available for mechanics
      if (state.mechanicsAvailableCombinedEffects.some(effect => effect.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        mechanicsAvailableCombinedEffects: [...state.mechanicsAvailableCombinedEffects, action.payload],
        lastModified: new Date()
      };

    case ACTION_TYPES.REMOVE_COMBINED_EFFECT_FROM_MECHANICS:
      return {
        ...state,
        mechanicsAvailableCombinedEffects: state.mechanicsAvailableCombinedEffects.filter(
          effect => effect.id !== action.payload
        ),
        lastModified: new Date()
      };

    // Targeting configuration
    case ACTION_TYPES.UPDATE_TARGETING_CONFIG:
      return {
        ...state,
        targetingConfig: {
          ...state.targetingConfig,
          ...action.payload
        },
        lastModified: new Date()
      };

    case ACTION_TYPES.SET_TARGETING_MODE:
      return {
        ...state,
        targetingMode: action.payload,
        lastModified: new Date()
      };

    case ACTION_TYPES.UPDATE_TARGETING_TAGS:
      return {
        ...state,
        targetingTags: {
          ...state.targetingTags,
          ...action.payload
        },
        lastModified: new Date()
      };

    case ACTION_TYPES.UPDATE_EFFECT_TARGETING:
      return {
        ...state,
        effectTargeting: {
          ...state.effectTargeting,
          [action.payload.effectType]: action.payload.config
        },
        lastModified: new Date()
      };

    // Duration configuration
    case ACTION_TYPES.UPDATE_DURATION_CONFIG:
      return {
        ...state,
        durationConfig: {
          ...state.durationConfig,
          ...action.payload
        },
        lastModified: new Date()
      };

    case ACTION_TYPES.UPDATE_PERSISTENT_CONFIG:
      return {
        ...state,
        persistentConfig: {
          ...state.persistentConfig,
          ...action.payload
        },
        lastModified: new Date()
      };

    // Propagation configuration
    case ACTION_TYPES.UPDATE_PROPAGATION:
      return {
        ...state,
        propagation: { ...action.payload },
        lastModified: new Date()
      };

    // Resource configuration
    case ACTION_TYPES.UPDATE_RESOURCE_COST:
      return {
        ...state,
        resourceCost: {
          ...state.resourceCost,
          ...action.payload
        },
        lastModified: new Date()
      };

    // Class mechanics
    case ACTION_TYPES.UPDATE_MECHANICS_CONFIG:
      return {
        ...state,
        mechanicsConfig: {
          ...state.mechanicsConfig,
          ...action.payload
        },
        lastModified: new Date()
      };

    // Cooldown configuration
    case ACTION_TYPES.UPDATE_COOLDOWN_CONFIG:
      return {
        ...state,
        cooldownConfig: {
          ...state.cooldownConfig,
          ...action.payload
        },
        lastModified: new Date()
      };

    // Trigger configuration
    case ACTION_TYPES.UPDATE_TRIGGER_CONFIG:
      return {
        ...state,
        triggerConfig: {
          ...state.triggerConfig,
          global: action.payload.global || state.triggerConfig.global,
          effectTriggers: action.payload.effectTriggers || state.triggerConfig.effectTriggers,
          buffDebuffTriggers: action.payload.buffDebuffTriggers !== undefined
            ? action.payload.buffDebuffTriggers
            : state.triggerConfig.buffDebuffTriggers,
          requiredConditions: action.payload.requiredConditions !== undefined
            ? action.payload.requiredConditions
            : state.triggerConfig.requiredConditions,
          conditionalEffects: state.triggerConfig.conditionalEffects,
          triggerRole: state.triggerConfig.triggerRole
        },
        lastModified: new Date()
      };

    // Update effect-specific trigger
    case ACTION_TYPES.UPDATE_EFFECT_TRIGGER:
      return {
        ...state,
        triggerConfig: {
          ...state.triggerConfig,
          effectTriggers: {
            ...state.triggerConfig.effectTriggers,
            [action.payload.effectType]: action.payload.triggerConfig
          }
        },
        lastModified: new Date()
      };

    // Remove effect-specific trigger
    case ACTION_TYPES.REMOVE_EFFECT_TRIGGER:
      const updatedEffectTriggers = { ...state.triggerConfig.effectTriggers };
      delete updatedEffectTriggers[action.payload.effectType];
      return {
        ...state,
        triggerConfig: {
          ...state.triggerConfig,
          effectTriggers: updatedEffectTriggers
        },
        lastModified: new Date()
      };

    // Update conditional effect configuration
    case ACTION_TYPES.UPDATE_CONDITIONAL_EFFECT:
      return {
        ...state,
        triggerConfig: {
          ...state.triggerConfig,
          conditionalEffects: {
            ...state.triggerConfig.conditionalEffects,
            [action.payload.effectType]: action.payload.config
          }
        },
        lastModified: new Date()
      };

    // Update trigger role configuration
    case ACTION_TYPES.UPDATE_TRIGGER_ROLE:
      return {
        ...state,
        triggerConfig: {
          ...state.triggerConfig,
          triggerRole: {
            ...state.triggerConfig.triggerRole,
            ...action.payload
          }
        },
        lastModified: new Date()
      };

    // Trap placement configuration
    case ACTION_TYPES.UPDATE_TRAP_CONFIG:
      return {
        ...state,
        trapConfig: {
          ...state.trapConfig,
          ...action.payload
        },
        lastModified: new Date()
      };

    // Channeling configuration
    case ACTION_TYPES.UPDATE_CHANNELING_CONFIG:
      return {
        ...state,
        channelingConfig: {
          ...state.channelingConfig,
          ...action.payload
        },
        lastModified: new Date()
      };

    // Wizard navigation
    case ACTION_TYPES.SET_CURRENT_STEP:
      return {
        ...state,
        currentStep: action.payload
      };

    case ACTION_TYPES.MARK_STEP_COMPLETED:
      return {
        ...state,
        completedSteps: state.completedSteps.includes(action.payload)
          ? state.completedSteps
          : [...state.completedSteps, action.payload]
      };

    case ACTION_TYPES.UPDATE_WIZARD_FLOW:
      return {
        ...state,
        wizardFlow: action.payload
      };

    // Validation
    case ACTION_TYPES.SET_ERRORS:
      return {
        ...state,
        errors: action.payload,
        isValid: Object.keys(action.payload).length === 0
      };

    case ACTION_TYPES.SET_WARNINGS:
      return {
        ...state,
        warnings: action.payload
      };

    case ACTION_TYPES.SET_VALIDATION:
      return {
        ...state,
        errors: action.payload.errors,
        warnings: action.payload.warnings,
        isValid: Object.keys(action.payload.errors).length === 0
      };

    case ACTION_TYPES.SET_VALIDITY:
      return {
        ...state,
        isValid: action.payload
      };

    // Full reset/set
    case ACTION_TYPES.RESET_STATE:
      return {
        ...initialState,
        lastModified: new Date()
      };

    case ACTION_TYPES.LOAD_SPELL:
      return {
        ...action.payload,
        lastModified: new Date()
      };

    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

// Provider component
function SpellWizardProvider({ children }) {
  const [state, dispatch] = useReducer(spellWizardReducer, initialState);

  // Add a useEffect to listen for direct update events
  useEffect(() => {
    const handleDirectUpdate = (event) => {
      const { field, value } = event.detail;
      console.log(`SpellWizardProvider received directUpdate event: ${field} = ${value}`);

      switch (field) {
        case 'name':
          dispatch({ type: ACTION_TYPES.SET_NAME, payload: value });
          break;
        case 'description':
          dispatch({ type: ACTION_TYPES.SET_DESCRIPTION, payload: value });
          break;
        default:
          console.warn(`Unknown field: ${field}`);
      }
    };

    window.addEventListener('directUpdateSpellWizard', handleDirectUpdate);

    return () => {
      window.removeEventListener('directUpdateSpellWizard', handleDirectUpdate);
    };
  }, []);

  // Track validation-relevant state in a separate effect
  const validationState = useMemo(() => ({
    name: state.name,
    description: state.description,
    level: state.level,
    spellType: state.spellType,
    effectTypes: state.effectTypes,
    targetingConfig: state.targetingConfig,
    propagation: state.propagation,
    durationConfig: state.durationConfig,
    triggerConfig: state.triggerConfig,
    trapConfig: state.trapConfig,
    damageConfig: state.damageConfig,
    healingConfig: state.healingConfig,
    buffConfig: state.buffConfig,
    debuffConfig: state.debuffConfig,
    utilityConfig: state.utilityConfig,
    controlConfig: state.controlConfig,
    summonConfig: state.summonConfig,
    transformConfig: state.transformConfig,
    purificationConfig: state.purificationConfig,
    restorationConfig: state.restorationConfig,
    channelingConfig: state.channelingConfig
  }), [
    state.name,
    state.description,
    state.level,
    state.spellType,
    state.effectTypes,
    state.targetingConfig,
    state.propagation,
    state.durationConfig,
    state.triggerConfig,
    state.trapConfig,
    state.damageConfig,
    state.healingConfig,
    state.buffConfig,
    state.debuffConfig,
    state.utilityConfig,
    state.controlConfig,
    state.summonConfig,
    state.transformConfig,
    state.purificationConfig,
    state.restorationConfig,
    state.channelingConfig
  ]);

  // Initialize wizard flow once
  useEffect(() => {
    if (!state.wizardFlow || state.wizardFlow.length === 0) {
      const flow = determineWizardFlow(state);
      dispatch({
        type: ACTION_TYPES.UPDATE_WIZARD_FLOW,
        payload: flow
      });
    }
  }, [state.wizardFlow]);

  // Validate state when validation-relevant properties change
  useEffect(() => {
    const { errors, warnings } = validateState(state);

    const errorsChanged = JSON.stringify(errors) !== JSON.stringify(state.errors);
    const warningsChanged = JSON.stringify(warnings) !== JSON.stringify(state.warnings);

    // Only dispatch if there are actual changes to prevent infinite loops
    if (errorsChanged || warningsChanged) {
      // Use a single dispatch to update both errors and warnings
      dispatch({
        type: ACTION_TYPES.SET_VALIDATION,
        payload: { errors, warnings }
      });
    }
  }, [validationState]); // Remove state.errors and state.warnings from dependencies

  return (
    <SpellWizardStateContext.Provider value={state}>
      <SpellWizardDispatchContext.Provider value={dispatch}>
        {children}
      </SpellWizardDispatchContext.Provider>
    </SpellWizardStateContext.Provider>
  );
}

// Hook for accessing state
function useSpellWizardState() {
  const context = useContext(SpellWizardStateContext);
  if (context === undefined) {
    throw new Error('useSpellWizardState must be used within a SpellWizardProvider');
  }
  return context;
}

// Hook for dispatching actions
function useSpellWizardDispatch() {
  const context = useContext(SpellWizardDispatchContext);
  if (context === undefined) {
    throw new Error('useSpellWizardDispatch must be used within a SpellWizardProvider');
  }
  return context;
}

// Helper to create common action creators
const actionCreators = {
  setName: (name) => ({ type: ACTION_TYPES.SET_NAME, payload: name }),
  setDescription: (description) => ({ type: ACTION_TYPES.SET_DESCRIPTION, payload: description }),
  setLevel: (level) => ({ type: ACTION_TYPES.SET_LEVEL, payload: level }),
  setSpellType: (spellType) => ({ type: ACTION_TYPES.SET_SPELL_TYPE, payload: spellType }),
  updateTypeConfig: (config) => ({ type: ACTION_TYPES.UPDATE_TYPE_CONFIG, payload: config }),
  addEffectType: (effectType) => ({ type: ACTION_TYPES.ADD_EFFECT_TYPE, payload: effectType }),
  removeEffectType: (effectType) => ({ type: ACTION_TYPES.REMOVE_EFFECT_TYPE, payload: effectType }),
  updateEffectsMap: (effectsMap) => ({ type: ACTION_TYPES.UPDATE_EFFECTS_MAP, payload: effectsMap }),
  updateDamageConfig: (config) => ({ type: ACTION_TYPES.UPDATE_DAMAGE_CONFIG, payload: config }),
  updateHealingConfig: (config) => ({ type: ACTION_TYPES.UPDATE_HEALING_CONFIG, payload: config }),
  updateBuffConfig: (config) => ({ type: ACTION_TYPES.UPDATE_BUFF_CONFIG, payload: config }),
  updateDebuffConfig: (config) => ({ type: ACTION_TYPES.UPDATE_DEBUFF_CONFIG, payload: config }),
  updateUtilityConfig: (config) => ({ type: ACTION_TYPES.UPDATE_UTILITY_CONFIG, payload: config }),
  updateControlConfig: (config) => ({ type: ACTION_TYPES.UPDATE_CONTROL_CONFIG, payload: config }),
  updateSummonConfig: (config) => ({ type: ACTION_TYPES.UPDATE_SUMMON_CONFIG, payload: config }),
  updateSummoningConfig: (config) => ({ type: ACTION_TYPES.UPDATE_SUMMON_CONFIG, payload: config }),
  updateTransformConfig: (config) => ({ type: ACTION_TYPES.UPDATE_TRANSFORM_CONFIG, payload: config }),
  updateTransformationConfig: (config) => ({ type: ACTION_TYPES.UPDATE_TRANSFORM_CONFIG, payload: config }),
  updatePurificationConfig: (config) => ({ type: ACTION_TYPES.UPDATE_PURIFICATION_CONFIG, payload: config }),
  updateRestorationConfig: (config) => ({ type: ACTION_TYPES.UPDATE_RESTORATION_CONFIG, payload: config }),
  updateRollableTable: (config) => ({ type: ACTION_TYPES.UPDATE_ROLLABLE_TABLE, payload: config }),

  // Resolution mechanics actions
  setEffectResolution: (effectId, resolutionType) => ({
    type: ACTION_TYPES.SET_EFFECT_RESOLUTION,
    payload: { effectId, resolutionType }
  }),
  updateEffectResolutionConfig: (effectId, resolutionConfig) => ({
    type: ACTION_TYPES.UPDATE_EFFECT_RESOLUTION_CONFIG,
    payload: { effectId, config: resolutionConfig }
  }),
  updateEffectResolutions: (resolutions) => ({
    type: ACTION_TYPES.UPDATE_EFFECT_RESOLUTIONS,
    payload: resolutions
  }),

  // Step mechanics actions
  updateEffectMechanicsConfig: (effectId, config) => ({
    type: ACTION_TYPES.UPDATE_EFFECT_MECHANICS_CONFIG,
    payload: { effectId, config }
  }),

  updateTargetingConfig: (config) => ({ type: ACTION_TYPES.UPDATE_TARGETING_CONFIG, payload: config }),
  setTargetingMode: (mode) => ({ type: ACTION_TYPES.SET_TARGETING_MODE, payload: mode }),
  updateTargetingTags: (tags) => ({ type: ACTION_TYPES.UPDATE_TARGETING_TAGS, payload: tags }),
  updateEffectTargeting: (effectType, config) => ({ type: ACTION_TYPES.UPDATE_EFFECT_TARGETING, payload: { effectType, config } }),
  updateDurationConfig: (config) => ({ type: ACTION_TYPES.UPDATE_DURATION_CONFIG, payload: config }),
  updatePersistentConfig: (config) => ({ type: ACTION_TYPES.UPDATE_PERSISTENT_CONFIG, payload: config }),
  updatePropagation: (propagation) => ({ type: ACTION_TYPES.UPDATE_PROPAGATION, payload: propagation }),
  updateResourceCost: (config) => ({ type: ACTION_TYPES.UPDATE_RESOURCE_COST, payload: config }),
  updateMechanicsConfig: (config) => ({ type: ACTION_TYPES.UPDATE_MECHANICS_CONFIG, payload: config }),
  updateCooldownConfig: (config) => ({ type: ACTION_TYPES.UPDATE_COOLDOWN_CONFIG, payload: config }),
  updateTriggerConfig: (config) => ({ type: ACTION_TYPES.UPDATE_TRIGGER_CONFIG, payload: config }),
  updateTriggerRole: (config) => ({ type: ACTION_TYPES.UPDATE_TRIGGER_ROLE, payload: config }),
  updateConditionalEffect: (effectType, config) => ({ type: ACTION_TYPES.UPDATE_CONDITIONAL_EFFECT, payload: { effectType, config } }),
  updateTrapConfig: (config) => ({ type: ACTION_TYPES.UPDATE_TRAP_CONFIG, payload: config }),
  updateChannelingConfig: (config) => ({ type: ACTION_TYPES.UPDATE_CHANNELING_CONFIG, payload: config }),
  setCurrentStep: (step) => ({ type: ACTION_TYPES.SET_CURRENT_STEP, payload: step }),
  markStepCompleted: (step) => ({ type: ACTION_TYPES.MARK_STEP_COMPLETED, payload: step }),
  updateWizardFlow: (flow) => ({ type: ACTION_TYPES.UPDATE_WIZARD_FLOW, payload: flow }),
  resetState: () => ({ type: ACTION_TYPES.RESET_STATE }),
  loadSpell: (spellConfig) => ({ type: ACTION_TYPES.LOAD_SPELL, payload: spellConfig }),
  addEffectToMechanics: (effect) => ({
    type: ACTION_TYPES.ADD_EFFECT_TO_MECHANICS,
    payload: effect
  }),
  removeEffectFromMechanics: (effectId) => ({
    type: ACTION_TYPES.REMOVE_EFFECT_FROM_MECHANICS,
    payload: effectId
  }),
  updateMechanicsEffects: (effects) => ({
    type: ACTION_TYPES.UPDATE_MECHANICS_EFFECTS,
    payload: effects
  }),
  createCombinedEffect: (effect) => ({
    type: ACTION_TYPES.CREATE_COMBINED_EFFECT,
    payload: effect
  }),
  updateCombinedEffect: (effect) => ({
    type: ACTION_TYPES.UPDATE_COMBINED_EFFECT,
    payload: effect
  }),
  deleteCombinedEffect: (effectId) => ({
    type: ACTION_TYPES.DELETE_COMBINED_EFFECT,
    payload: effectId
  }),
  addCombinedEffectToMechanics: (effect) => ({
    type: ACTION_TYPES.ADD_COMBINED_EFFECT_TO_MECHANICS,
    payload: effect
  }),
  removeCombinedEffectFromMechanics: (effectId) => ({
    type: ACTION_TYPES.REMOVE_COMBINED_EFFECT_FROM_MECHANICS,
    payload: effectId
  }),
};

// Combine all exports
export {
  SpellWizardProvider,
  useSpellWizardState,
  useSpellWizardDispatch,
  actionCreators,
  validateStepCompletion,
  determineNextStep,
  getStepRequirements,
  determineWizardFlow
};