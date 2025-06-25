import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { CREATURE_SIZES, CREATURE_TYPES } from '../../../store/creatureStore';

// Default stats for a new creature
const DEFAULT_STATS = {
  // Base attributes
  strength: 10,
  agility: 10,
  constitution: 10,
  intelligence: 10,
  spirit: 10,
  charisma: 10,

  // Derived stats
  maxHp: 100,
  currentHp: 100,
  maxMana: 50,
  currentMana: 50,
  maxActionPoints: 6,
  currentActionPoints: 6,
  armorClass: 15,
  initiative: 2,

  // Movement
  speed: 30,
  flying: 0,
  swimming: 15,

  // Vision
  sightRange: 60,
  darkvision: 0,

  // Combat stats
  criticalChance: 5,
  criticalMultiplier: 2,

  // Additional stats
  armor: 0,
  evasion: 0,
  hitChance: 75,
  spellPower: 0,
  healingPower: 0,
  manaRegen: 0,
  healthRegen: 0,

  // Weapon damage modifiers
  piercingDamage: 0,
  slashingDamage: 0,
  bludgeoningDamage: 0,

  // Spell damage modifiers
  fireDamage: 0,
  frostDamage: 0,
  arcaneDamage: 0,
  shadowDamage: 0,
  natureDamage: 0,
  holyDamage: 0
};

// Initial state for the wizard
const initialState = {
  // Basic info
  id: null,
  name: '',
  description: '',
  type: CREATURE_TYPES.HUMANOID,
  size: CREATURE_SIZES.MEDIUM,
  tags: [],
  tokenIcon: 'inv_misc_questionmark',
  tokenBorder: '#ffffff',

  // Statistics
  stats: { ...DEFAULT_STATS },

  // Resistances and vulnerabilities
  resistances: {},
  vulnerabilities: {},

  // Abilities
  abilities: [],

  // Loot table
  lootTable: {
    currency: {
      gold: { min: 0, max: 0 },
      silver: { min: 0, max: 0 },
      copper: { min: 0, max: 0 }
    },
    items: []
  },

  // Wizard state
  currentStep: 1,
  totalSteps: 4,
  isValid: false,
  validationErrors: {},
  editMode: false,
  originalCreatureId: null
};

// Action types
const ACTION_TYPES = {
  SET_BASIC_INFO: 'SET_BASIC_INFO',
  SET_STATS: 'SET_STATS',
  SET_RESISTANCES: 'SET_RESISTANCES',
  SET_VULNERABILITIES: 'SET_VULNERABILITIES',
  ADD_ABILITY: 'ADD_ABILITY',
  UPDATE_ABILITY: 'UPDATE_ABILITY',
  REMOVE_ABILITY: 'REMOVE_ABILITY',
  SET_LOOT_TABLE: 'SET_LOOT_TABLE',
  ADD_LOOT_ITEM: 'ADD_LOOT_ITEM',
  UPDATE_LOOT_ITEM: 'UPDATE_LOOT_ITEM',
  REMOVE_LOOT_ITEM: 'REMOVE_LOOT_ITEM',
  NEXT_STEP: 'NEXT_STEP',
  PREV_STEP: 'PREV_STEP',
  GO_TO_STEP: 'GO_TO_STEP',
  VALIDATE_STEP: 'VALIDATE_STEP',
  RESET_WIZARD: 'RESET_WIZARD',
  LOAD_CREATURE: 'LOAD_CREATURE',
  SET_EDIT_MODE: 'SET_EDIT_MODE'
};

// Reducer function
function creatureWizardReducer(state, action) {
  switch (action.type) {
    case ACTION_TYPES.SET_BASIC_INFO:
      return {
        ...state,
        ...action.payload,
        validationErrors: {
          ...state.validationErrors,
          name: !action.payload.name ? 'Name is required' : null
        }
      };

    case ACTION_TYPES.SET_STATS:
      return {
        ...state,
        stats: {
          ...state.stats,
          ...action.payload
        }
      };

    case ACTION_TYPES.SET_RESISTANCES:
      return {
        ...state,
        resistances: {
          ...state.resistances,
          ...action.payload
        }
      };

    case ACTION_TYPES.SET_VULNERABILITIES:
      return {
        ...state,
        vulnerabilities: {
          ...state.vulnerabilities,
          ...action.payload
        }
      };

    case ACTION_TYPES.ADD_ABILITY:
      return {
        ...state,
        abilities: [...state.abilities, action.payload]
      };

    case ACTION_TYPES.UPDATE_ABILITY:
      return {
        ...state,
        abilities: state.abilities.map(ability =>
          ability.id === action.payload.id ? { ...ability, ...action.payload.updates } : ability
        )
      };

    case ACTION_TYPES.REMOVE_ABILITY:
      return {
        ...state,
        abilities: state.abilities.filter(ability => ability.id !== action.payload)
      };

    case ACTION_TYPES.SET_LOOT_TABLE:
      return {
        ...state,
        lootTable: {
          ...state.lootTable,
          ...action.payload
        }
      };

    case ACTION_TYPES.ADD_LOOT_ITEM:
      return {
        ...state,
        lootTable: {
          ...state.lootTable,
          items: [...state.lootTable.items, action.payload]
        }
      };

    case ACTION_TYPES.UPDATE_LOOT_ITEM:
      return {
        ...state,
        lootTable: {
          ...state.lootTable,
          items: state.lootTable.items.map(item =>
            item.itemId === action.payload.itemId ? { ...item, ...action.payload.updates } : item
          )
        }
      };

    case ACTION_TYPES.REMOVE_LOOT_ITEM:
      return {
        ...state,
        lootTable: {
          ...state.lootTable,
          items: state.lootTable.items.filter(item => item.itemId !== action.payload)
        }
      };

    case ACTION_TYPES.NEXT_STEP:
      return {
        ...state,
        currentStep: Math.min(state.currentStep + 1, state.totalSteps)
      };

    case ACTION_TYPES.PREV_STEP:
      return {
        ...state,
        currentStep: Math.max(state.currentStep - 1, 1)
      };

    case ACTION_TYPES.GO_TO_STEP:
      return {
        ...state,
        currentStep: Math.min(Math.max(action.payload, 1), state.totalSteps)
      };

    case ACTION_TYPES.VALIDATE_STEP:
      // Validation logic for each step
      let isValid = true;
      const validationErrors = { ...state.validationErrors };

      switch (action.payload) {
        case 1: // Basic info
          if (!state.name) {
            validationErrors.name = 'Name is required';
            isValid = false;
          } else {
            validationErrors.name = null;
          }
          break;

        case 2: // Statistics
          // Add validation for stats if needed
          break;

        case 3: // Abilities
          // Add validation for abilities if needed
          break;

        case 4: // Loot table
          // Add validation for loot table if needed
          break;

        default:
          break;
      }

      return {
        ...state,
        isValid,
        validationErrors
      };

    case ACTION_TYPES.RESET_WIZARD:
      return {
        ...initialState
      };

    case ACTION_TYPES.LOAD_CREATURE:
      return {
        ...state,
        ...action.payload,
        currentStep: 1,
        isValid: true,
        validationErrors: {}
      };

    case ACTION_TYPES.SET_EDIT_MODE:
      return {
        ...state,
        editMode: action.payload.editMode,
        originalCreatureId: action.payload.creatureId
      };

    default:
      return state;
  }
}

// Create contexts
const CreatureWizardStateContext = createContext();
const CreatureWizardDispatchContext = createContext();

// Provider component
function CreatureWizardProvider({ children }) {
  const [state, dispatch] = useReducer(creatureWizardReducer, initialState);

  // Validate current step whenever state changes
  useEffect(() => {
    dispatch({ type: ACTION_TYPES.VALIDATE_STEP, payload: state.currentStep });
  }, [state.name, state.type, state.size, state.stats, state.abilities, state.lootTable, state.currentStep]);

  return (
    <CreatureWizardStateContext.Provider value={state}>
      <CreatureWizardDispatchContext.Provider value={dispatch}>
        {children}
      </CreatureWizardDispatchContext.Provider>
    </CreatureWizardStateContext.Provider>
  );
}

// Hook for accessing state
function useCreatureWizard() {
  const context = useContext(CreatureWizardStateContext);
  if (context === undefined) {
    throw new Error('useCreatureWizard must be used within a CreatureWizardProvider');
  }
  return context;
}

// Hook for accessing dispatch
function useCreatureWizardDispatch() {
  const context = useContext(CreatureWizardDispatchContext);
  if (context === undefined) {
    throw new Error('useCreatureWizardDispatch must be used within a CreatureWizardProvider');
  }
  return context;
}

// Action creators
const wizardActionCreators = {
  setBasicInfo: (info) => ({
    type: ACTION_TYPES.SET_BASIC_INFO,
    payload: info
  }),

  setStats: (stats) => ({
    type: ACTION_TYPES.SET_STATS,
    payload: stats
  }),

  setResistances: (resistances) => ({
    type: ACTION_TYPES.SET_RESISTANCES,
    payload: resistances
  }),

  setVulnerabilities: (vulnerabilities) => ({
    type: ACTION_TYPES.SET_VULNERABILITIES,
    payload: vulnerabilities
  }),

  addAbility: (ability) => ({
    type: ACTION_TYPES.ADD_ABILITY,
    payload: ability
  }),

  updateAbility: (id, updates) => ({
    type: ACTION_TYPES.UPDATE_ABILITY,
    payload: { id, updates }
  }),

  removeAbility: (id) => ({
    type: ACTION_TYPES.REMOVE_ABILITY,
    payload: id
  }),

  setLootTable: (lootTable) => ({
    type: ACTION_TYPES.SET_LOOT_TABLE,
    payload: lootTable
  }),

  addLootItem: (item) => ({
    type: ACTION_TYPES.ADD_LOOT_ITEM,
    payload: item
  }),

  updateLootItem: (itemId, updates) => ({
    type: ACTION_TYPES.UPDATE_LOOT_ITEM,
    payload: { itemId, updates }
  }),

  removeLootItem: (itemId) => ({
    type: ACTION_TYPES.REMOVE_LOOT_ITEM,
    payload: itemId
  }),

  nextStep: () => ({
    type: ACTION_TYPES.NEXT_STEP
  }),

  prevStep: () => ({
    type: ACTION_TYPES.PREV_STEP
  }),

  goToStep: (step) => ({
    type: ACTION_TYPES.GO_TO_STEP,
    payload: step
  }),

  validateStep: (step) => ({
    type: ACTION_TYPES.VALIDATE_STEP,
    payload: step
  }),

  resetWizard: () => ({
    type: ACTION_TYPES.RESET_WIZARD
  }),

  loadCreature: (creature) => ({
    type: ACTION_TYPES.LOAD_CREATURE,
    payload: creature
  }),

  setEditMode: (editMode, creatureId) => ({
    type: ACTION_TYPES.SET_EDIT_MODE,
    payload: { editMode, creatureId }
  })
};

export {
  CreatureWizardProvider,
  useCreatureWizard,
  useCreatureWizardDispatch,
  wizardActionCreators,
  ACTION_TYPES
};
