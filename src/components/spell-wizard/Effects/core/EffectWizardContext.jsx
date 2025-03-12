import React, { createContext, useReducer, useContext } from 'react';
import {
  EFFECT_TYPES,
  DAMAGE_TYPES,
  DURATION_TYPES,
  TARGETING_TYPES,
  PRIMARY_STAT_MODIFIERS,
  SECONDARY_STAT_MODIFIERS,
  COMBAT_STAT_MODIFIERS,
  POSITIVE_STATUS_EFFECTS,
  NEGATIVE_STATUS_EFFECTS,
  COMBAT_ADVANTAGES,
  COMBAT_DISADVANTAGES,
  CRITICAL_EFFECT_MODIFIERS,
  UTILITY_EFFECT_TYPES,
  UTILITY_PARAMETERS,
  ABSORPTION_SHIELD_TYPES,
  REFLECTION_DAMAGE_TYPES,
  ENHANCED_HEALING_TYPES,
  SpellEffectUtils,
  ActionPointUtils
} from './effectSystemData';

import {
  parseDiceNotation,
  isValidDiceNotation,
  getAverageRoll,
  getMinRoll,
  getMaxRoll,
  calculateChainedDamage,
  calculateCriticalDamage,
  calculateDotDamage,
  DiceHelpers
} from './DiceRules';

// Initial state for the effect wizard
const initialState = {
  // Navigation
  currentStep: 0,
  
  // Selected effect types
  effectTypes: [],
  
  // Damage configuration
  damageConfig: {
    damageTypes: [],
    diceNotation: '2d6',
    useChainEffect: false,
    chainConfig: {
      targets: 3,
      falloffType: 'percentage',
      falloffRate: 25,
      minimumDamage: null
    },
    useCriticalEffect: false,
    criticalConfig: {
      criticalMultiplier: 2,
      criticalDiceOnly: false,
      extraDice: '',
      effects: []
    }
  },
  
  // Healing configuration
  healingConfig: {
    healingType: 'direct',
    diceNotation: '2d8',
    useAbsorptionShield: false,
    shieldConfig: {
      shieldType: 'standard',
      shieldAmount: '3d8',
      reflectionType: null,
      reflectionAmount: 0
    }
  },
  
  // Buff configuration
  buffConfig: {
    statModifiers: {},
    statusEffects: [],
    combatAdvantages: [],
    effectParameters: {}
  },
  
  // Debuff configuration
  debuffConfig: {
    statModifiers: {},
    statusEffects: [],
    combatDisadvantages: [],
    effectParameters: {}
  },
  
  // Utility configuration
  utilityConfig: {
    utilityType: null,
    utilitySubtype: null,
    parameters: {}
  },
  
  // Duration configuration
  durationConfig: {
    durationType: 'instant',
    durationValue: 1,
    requiresConcentration: false
  },
  
  // Persistent effect configuration (DoT/HoT)
  persistentConfig: {
    isPersistent: false,
    persistentType: 'dot',
    tickFrequency: 'start_of_turn',
    scalingType: 'flat',
    initialMultiplier: 1,
    finalMultiplier: 1
  },
  
  // Targeting configuration
  targetingConfig: {
    targetingType: 'single',
    areaShape: null,
    areaSize: 0
  },
  
  // Action point calculation
  totalActionPointCost: 0,
  
  // Validation errors
  errors: {}
};

// Reducer function for handling state updates
function effectWizardReducer(state, action) {
  switch (action.type) {
    // Navigation
    case 'SET_STEP':
      return {
        ...state,
        currentStep: action.payload
      };
      
    // Effect selection
    case 'SET_EFFECT_TYPES':
      return {
        ...state,
        effectTypes: action.payload,
        totalActionPointCost: calculateTotalCost(action.payload, state)
      };
      
    case 'TOGGLE_EFFECT_TYPE': {
      const effectTypeId = action.payload;
      const newEffectTypes = state.effectTypes.includes(effectTypeId)
        ? state.effectTypes.filter(id => id !== effectTypeId)
        : [...state.effectTypes, effectTypeId];
        
      return {
        ...state,
        effectTypes: newEffectTypes,
        totalActionPointCost: calculateTotalCost(newEffectTypes, state)
      };
    }
    
    // Damage config
    case 'UPDATE_DAMAGE_CONFIG':
      return {
        ...state,
        damageConfig: {
          ...state.damageConfig,
          ...action.payload
        }
      };
      
    case 'SET_DAMAGE_TYPES':
      return {
        ...state,
        damageConfig: {
          ...state.damageConfig,
          damageTypes: action.payload
        }
      };
      
    // Healing config
    case 'UPDATE_HEALING_CONFIG':
      return {
        ...state,
        healingConfig: {
          ...state.healingConfig,
          ...action.payload
        }
      };
      
    // Buff/Debuff config
    case 'TOGGLE_STAT': {
      const { statId, configType } = action.payload;
      const configKey = configType === 'buff' ? 'buffConfig' : 'debuffConfig';
      const newStatModifiers = { ...state[configKey].statModifiers };
      
      if (newStatModifiers[statId] !== undefined) {
        delete newStatModifiers[statId];
      } else {
        newStatModifiers[statId] = 0;
      }
      
      return {
        ...state,
        [configKey]: {
          ...state[configKey],
          statModifiers: newStatModifiers
        }
      };
    }
    
    case 'SET_STAT_VALUE': {
      const { statId, value, configType } = action.payload;
      const configKey = configType === 'buff' ? 'buffConfig' : 'debuffConfig';
      
      return {
        ...state,
        [configKey]: {
          ...state[configKey],
          statModifiers: {
            ...state[configKey].statModifiers,
            [statId]: value
          }
        }
      };
    }
    
    case 'SET_STAT_TYPE':
      return {
        ...state,
        [action.payload.configType]: {
          ...state[action.payload.configType],
          statType: action.payload.statType
        }
      };
      
    // Status effects
    case 'TOGGLE_EFFECT': {
      const { effectId, effectType } = action.payload;
      const configKey = effectType === 'positive' ? 'buffConfig' : 'debuffConfig';
      const statusEffects = state[configKey].statusEffects;
      const newStatusEffects = statusEffects.includes(effectId)
        ? statusEffects.filter(id => id !== effectId)
        : [...statusEffects, effectId];
      
      return {
        ...state,
        [configKey]: {
          ...state[configKey],
          statusEffects: newStatusEffects
        }
      };
    }
    
    case 'SET_EFFECT_VALUE': {
      const { effectId, parameter, value, effectType } = action.payload;
      const configKey = effectType === 'positive' ? 'buffConfig' : 'debuffConfig';
      
      // Create deep copy of effect parameters
      const effectParameters = JSON.parse(JSON.stringify(state[configKey].effectParameters || {}));
      
      // Initialize effect parameters if needed
      if (!effectParameters[effectId]) {
        effectParameters[effectId] = {};
      }
      
      // Set parameter value
      effectParameters[effectId][parameter] = value;
      
      return {
        ...state,
        [configKey]: {
          ...state[configKey],
          effectParameters
        }
      };
    }
    
    // Duration config
    case 'UPDATE_DURATION_CONFIG': {
      const newDurationConfig = {
        ...state.durationConfig,
        ...action.payload
      };
      
      return {
        ...state,
        durationConfig: newDurationConfig,
        totalActionPointCost: calculateTotalCost(state.effectTypes, {
          ...state,
          durationConfig: newDurationConfig
        })
      };
    }
    
    // Persistent effect config
    case 'UPDATE_PERSISTENT_CONFIG': {
      const newPersistentConfig = {
        ...state.persistentConfig,
        ...action.payload
      };
      
      return {
        ...state,
        persistentConfig: newPersistentConfig,
        totalActionPointCost: calculateTotalCost(state.effectTypes, {
          ...state,
          persistentConfig: newPersistentConfig
        })
      };
    }
    
    // Template application
    case 'APPLY_TEMPLATE':
      return {
        ...state,
        ...action.payload,
        totalActionPointCost: calculateTotalCost(
          action.payload.effectTypes || state.effectTypes,
          { ...state, ...action.payload }
        )
      };
      
    default:
      return state;
  }
}

// Helper function to calculate total action point cost
function calculateTotalCost(effectTypes, state) {
  // Base cost from effect types
  let cost = effectTypes.reduce((total, effectId) => {
    const effect = EFFECT_TYPES.find(e => e.id === effectId);
    return total + (effect ? effect.actionPointCost : 0);
  }, 0);
  
  // Add cost from duration
  if (state.durationConfig.durationType !== 'instant') {
    const durationType = DURATION_TYPES.find(d => d.id === state.durationConfig.durationType);
    if (durationType) {
      cost += durationType.actionPointModifier;
    }
  }
  
  // Add cost from targeting
  if (state.targetingConfig.targetingType !== 'single') {
    const targetingType = TARGETING_TYPES.find(t => t.id === state.targetingConfig.targetingType);
    if (targetingType) {
      cost += targetingType.actionPointModifier;
    }
  }
  
  // Add cost for persistent effects
  if (state.persistentConfig.isPersistent) {
    cost += 1;
  }
  
  return Math.max(1, cost); // Minimum cost of 1
}

// Create contexts
const EffectWizardStateContext = createContext();
const EffectWizardDispatchContext = createContext();

// Provider component
export function EffectWizardProvider({ children }) {
  const [state, dispatch] = useReducer(effectWizardReducer, initialState);
  
  return (
    <EffectWizardStateContext.Provider value={state}>
      <EffectWizardDispatchContext.Provider value={dispatch}>
        {children}
      </EffectWizardDispatchContext.Provider>
    </EffectWizardStateContext.Provider>
  );
}

// Custom hooks
export function useEffectWizardState() {
  const context = useContext(EffectWizardStateContext);
  if (context === undefined) {
    throw new Error('useEffectWizardState must be used within an EffectWizardProvider');
  }
  return context;
}

export function useEffectWizardDispatch() {
  const context = useContext(EffectWizardDispatchContext);
  if (context === undefined) {
    throw new Error('useEffectWizardDispatch must be used within an EffectWizardProvider');
  }
  return context;
}

export function useEffectWizard() {
  return [useEffectWizardState(), useEffectWizardDispatch()];
}

// Helper functions for effect wizard integration
export const effectWizardHelpers = {
  // Get effect types by category
  getEffectTypesByCategory: (category = null) => {
    if (!category) return EFFECT_TYPES;
    return EFFECT_TYPES.filter(effect => effect.category === category);
  },
  
  // Get damage types by category
  getDamageTypesByCategory: (category = null) => {
    if (!category) return DAMAGE_TYPES;
    return DAMAGE_TYPES.filter(type => type.category === category);
  },
  
  // Get status effects
  getStatusEffects: (isPositive = true) => {
    return isPositive ? POSITIVE_STATUS_EFFECTS : NEGATIVE_STATUS_EFFECTS;
  },
  
  // Get combat advantages/disadvantages
  getCombatAdvantages: (isAdvantage = true) => {
    return isAdvantage ? COMBAT_ADVANTAGES : COMBAT_DISADVANTAGES;
  },
  
  // Get stat modifiers by type
  getStatModifiers: (statType) => {
    switch (statType) {
      case 'primary':
        return PRIMARY_STAT_MODIFIERS;
      case 'secondary':
        return SECONDARY_STAT_MODIFIERS;
      case 'combat':
        return COMBAT_STAT_MODIFIERS;
      default:
        return [...PRIMARY_STAT_MODIFIERS, ...SECONDARY_STAT_MODIFIERS, ...COMBAT_STAT_MODIFIERS];
    }
  },
  
  // Get utility effect types
  getUtilityEffectTypes: () => UTILITY_EFFECT_TYPES,
  
  // Get utility subtypes
  getUtilitySubtypes: (utilityTypeId) => {
    const utilityType = UTILITY_EFFECT_TYPES.find(type => type.id === utilityTypeId);
    return utilityType ? utilityType.subtypes : [];
  },
  
  // Get utility parameters
  getUtilityParameters: (utilityTypeId, subtypeId) => {
    if (!utilityTypeId || !subtypeId) return {};
    
    const utilityType = UTILITY_EFFECT_TYPES.find(type => type.id === utilityTypeId);
    if (!utilityType) return {};
    
    const subtype = utilityType.subtypes.find(sub => sub.id === subtypeId);
    if (!subtype || !subtype.parameters) return {};
    
    const parameterKeys = subtype.parameters;
    const parameters = {};
    
    parameterKeys.forEach(key => {
      if (UTILITY_PARAMETERS[utilityTypeId] && UTILITY_PARAMETERS[utilityTypeId][key]) {
        parameters[key] = UTILITY_PARAMETERS[utilityTypeId][key];
      }
    });
    
    return parameters;
  },
  
  // Get absorption shield types
  getAbsorptionShieldTypes: () => ABSORPTION_SHIELD_TYPES,
  
  // Get reflection damage types
  getReflectionDamageTypes: () => REFLECTION_DAMAGE_TYPES,
  
  // Get enhanced healing types
  getEnhancedHealingTypes: () => ENHANCED_HEALING_TYPES,
  
  // Calculate chained damage
  calculateChainedDamage: (baseNotation, options) => {
    return calculateChainedDamage(baseNotation, options);
  },
  
  // Calculate critical damage
  calculateCriticalDamage: (baseNotation, options) => {
    return calculateCriticalDamage(baseNotation, options);
  },
  
  // Calculate damage over time
  calculateDotDamage: (baseNotation, options) => {
    return calculateDotDamage(baseNotation, options);
  },
  
  // Calculate average roll
  getAverageRoll: (notation) => {
    return isValidDiceNotation(notation) ? getAverageRoll(notation) : 0;
  },
  
  // Validate dice notation
  validateDiceNotation: (notation) => {
    return isValidDiceNotation(notation);
  },
  
  // Validate the current configuration
  validateConfig: (state) => {
    const errors = {};
    
    // Check if at least one effect type is selected
    if (state.effectTypes.length === 0) {
      errors.effectTypes = 'At least one effect type must be selected';
    }
    
    // Check damage configuration
    if (state.effectTypes.includes('damage')) {
      if (state.damageConfig.damageTypes.length === 0) {
        errors.damageTypes = 'At least one damage type must be selected';
      }
      
      if (!isValidDiceNotation(state.damageConfig.diceNotation)) {
        errors.damageDice = 'Invalid dice notation';
      }
    }
    
    // Check healing configuration
    if (state.effectTypes.includes('healing')) {
      if (!isValidDiceNotation(state.healingConfig.diceNotation)) {
        errors.healingDice = 'Invalid dice notation';
      }
    }
    
    // Check shield configuration
    if (state.healingConfig.useAbsorptionShield) {
      if (!isValidDiceNotation(state.healingConfig.shieldConfig.shieldAmount)) {
        errors.shieldAmount = 'Invalid dice notation for shield amount';
      }
    }
    
    return errors;
  },
  
  // Generate effect summary
  generateEffectSummary: (state) => {
    const summary = {
      effectTypes: [],
      damageInfo: null,
      healingInfo: null,
      buffInfo: null,
      debuffInfo: null,
      utilityInfo: null,
      duration: null,
      persistent: null,
      actionPointCost: state.totalActionPointCost
    };
    
    // Add effect types
    state.effectTypes.forEach(effectId => {
      const effect = EFFECT_TYPES.find(e => e.id === effectId);
      if (effect) {
        summary.effectTypes.push({
          id: effect.id,
          name: effect.name,
          description: effect.description
        });
      }
    });
    
    // Add damage info
    if (state.effectTypes.includes('damage')) {
      summary.damageInfo = {
        damageTypes: state.damageConfig.damageTypes.map(id => {
          const damageType = DAMAGE_TYPES.find(d => d.id === id);
          return damageType ? { id: damageType.id, name: damageType.name } : null;
        }).filter(Boolean),
        diceNotation: state.damageConfig.diceNotation,
        averageDamage: getAverageRoll(state.damageConfig.diceNotation),
        useChainEffect: state.damageConfig.useChainEffect,
        useCriticalEffect: state.damageConfig.useCriticalEffect
      };
    }
    
    // Add healing info
    if (state.effectTypes.includes('healing')) {
      summary.healingInfo = {
        healingType: state.healingConfig.healingType,
        diceNotation: state.healingConfig.diceNotation,
        averageHealing: getAverageRoll(state.healingConfig.diceNotation),
        useAbsorptionShield: state.healingConfig.useAbsorptionShield
      };
    }
    
    // Add buff info
    if (state.effectTypes.includes('buff')) {
      summary.buffInfo = {
        statusEffects: state.buffConfig.statusEffects.map(id => {
          const effect = POSITIVE_STATUS_EFFECTS.find(e => e.id === id);
          return effect ? { id: effect.id, name: effect.name } : null;
        }).filter(Boolean),
        statModifiers: Object.entries(state.buffConfig.statModifiers).map(([id, value]) => {
          const stat = [...PRIMARY_STAT_MODIFIERS, ...SECONDARY_STAT_MODIFIERS, ...COMBAT_STAT_MODIFIERS]
            .find(s => s.id === id);
          return stat ? { id, name: stat.name, value } : null;
        }).filter(Boolean)
      };
    }
    
    // Add debuff info
    if (state.effectTypes.includes('debuff')) {
      summary.debuffInfo = {
        statusEffects: state.debuffConfig.statusEffects.map(id => {
          const effect = NEGATIVE_STATUS_EFFECTS.find(e => e.id === id);
          return effect ? { id: effect.id, name: effect.name } : null;
        }).filter(Boolean),
        statModifiers: Object.entries(state.debuffConfig.statModifiers).map(([id, value]) => {
          const stat = [...PRIMARY_STAT_MODIFIERS, ...SECONDARY_STAT_MODIFIERS, ...COMBAT_STAT_MODIFIERS]
            .find(s => s.id === id);
          return stat ? { id, name: stat.name, value } : null;
        }).filter(Boolean)
      };
    }
    
    // Add utility info
    if (state.effectTypes.includes('utility') && state.utilityConfig.utilityType) {
      const utilityType = UTILITY_EFFECT_TYPES.find(t => t.id === state.utilityConfig.utilityType);
      let subtype = null;
      
      if (utilityType && state.utilityConfig.utilitySubtype) {
        subtype = utilityType.subtypes.find(s => s.id === state.utilityConfig.utilitySubtype);
      }
      
      summary.utilityInfo = {
        type: utilityType ? { id: utilityType.id, name: utilityType.name } : null,
        subtype: subtype ? { id: subtype.id, name: subtype.name } : null,
        parameters: state.utilityConfig.parameters
      };
    }
    
    // Add duration info
    const durationType = DURATION_TYPES.find(d => d.id === state.durationConfig.durationType);
    if (durationType) {
      summary.duration = {
        type: durationType.name,
        value: state.durationConfig.durationValue,
        requiresConcentration: state.durationConfig.requiresConcentration
      };
    }
    
    // Add persistent info
    if (state.persistentConfig.isPersistent) {
      summary.persistent = {
        type: state.persistentConfig.persistentType,
        tickFrequency: state.persistentConfig.tickFrequency,
        scalingType: state.persistentConfig.scalingType
      };
    }
    
    return summary;
  }
};