import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Creature types and sizes
export const CREATURE_TYPES = {
  ABERRATION: 'aberration',
  BEAST: 'beast',
  CELESTIAL: 'celestial',
  CONSTRUCT: 'construct',
  DRAGON: 'dragon',
  ELEMENTAL: 'elemental',
  FEY: 'fey',
  FIEND: 'fiend',
  GIANT: 'giant',
  HUMANOID: 'humanoid',
  MONSTROSITY: 'monstrosity',
  OOZE: 'ooze',
  PLANT: 'plant',
  UNDEAD: 'undead'
};

export const CREATURE_SIZES = {
  TINY: 'tiny',
  SMALL: 'small',
  MEDIUM: 'medium',
  LARGE: 'large',
  HUGE: 'huge',
  GARGANTUAN: 'gargantuan'
};

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
      platinum: { min: 0, max: 0 },
      gold: { min: 0, max: 0 },
      silver: { min: 0, max: 0 },
      copper: { min: 0, max: 0 }
    },
    items: []
  },

  // Shopkeeper properties
  isShopkeeper: false,
  shopInventory: {
    items: [], // Array of { itemId, customPrice: { platinum: 0, gold: 0, silver: 0, copper: 0 }, quantity: 1 }
    restockOnLongRest: false,
    shopName: '',
    shopDescription: '',
    buyRates: {
      default: 30, // Default buy rate as percentage of item value for unlisted categories
      categories: {
        // Standard item type categories (matches the game's item types)
        weapon: 50,
        armor: 50,
        consumable: 50,
        accessory: 45,
        container: 40,
        miscellaneous: 35
      }
    }
  },

  // Wizard state
  currentStep: 1,
  totalSteps: 5,
  isValid: false,
  validationErrors: {},
  editMode: false,
  originalCreatureId: null,
  lastModified: null
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
  SET_SHOPKEEPER_STATUS: 'SET_SHOPKEEPER_STATUS',
  SET_SHOP_INFO: 'SET_SHOP_INFO',
  ADD_SHOP_ITEM: 'ADD_SHOP_ITEM',
  UPDATE_SHOP_ITEM: 'UPDATE_SHOP_ITEM',
  REMOVE_SHOP_ITEM: 'REMOVE_SHOP_ITEM',
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
      const newState = {
        ...state,
        ...action.payload,
        lastModified: new Date()
      };

      // Always validate the name based on the current state
      const currentName = newState.name || '';
      newState.validationErrors = {
        ...state.validationErrors,
        name: currentName.trim().length > 0 ? null : 'Name is required'
      };

      return newState;
      
    case ACTION_TYPES.SET_STATS:
      return {
        ...state,
        stats: {
          ...state.stats,
          ...action.payload
        },
        lastModified: new Date()
      };
      
    case ACTION_TYPES.SET_RESISTANCES:
      return {
        ...state,
        resistances: action.payload
      };
      
    case ACTION_TYPES.SET_VULNERABILITIES:
      return {
        ...state,
        vulnerabilities: action.payload
      };
      
    case ACTION_TYPES.ADD_ABILITY:
      return {
        ...state,
        abilities: [...state.abilities, action.payload],
        lastModified: new Date()
      };
      
    case ACTION_TYPES.UPDATE_ABILITY:
      return {
        ...state,
        abilities: state.abilities.map((ability, index) =>
          index === action.payload.index ? action.payload.ability : ability
        )
      };
      
    case ACTION_TYPES.REMOVE_ABILITY:
      return {
        ...state,
        abilities: state.abilities.filter((_, index) => index !== action.payload)
      };
      
    case ACTION_TYPES.SET_LOOT_TABLE:
      return {
        ...state,
        lootTable: action.payload
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
          items: state.lootTable.items.map((item, index) =>
            index === action.payload.index ? action.payload.item : item
          )
        }
      };
      
    case ACTION_TYPES.REMOVE_LOOT_ITEM:
      return {
        ...state,
        lootTable: {
          ...state.lootTable,
          items: state.lootTable.items.filter((_, index) => index !== action.payload)
        }
      };

    case ACTION_TYPES.SET_SHOPKEEPER_STATUS:
      return {
        ...state,
        isShopkeeper: action.payload
      };

    case ACTION_TYPES.SET_SHOP_INFO:
      return {
        ...state,
        shopInventory: {
          ...state.shopInventory,
          ...action.payload
        }
      };

    case ACTION_TYPES.ADD_SHOP_ITEM:
      return {
        ...state,
        shopInventory: {
          ...state.shopInventory,
          items: [...state.shopInventory.items, action.payload]
        }
      };

    case ACTION_TYPES.UPDATE_SHOP_ITEM:
      return {
        ...state,
        shopInventory: {
          ...state.shopInventory,
          items: state.shopInventory.items.map((item, index) =>
            index === action.payload.index ? action.payload.item : item
          )
        }
      };

    case ACTION_TYPES.REMOVE_SHOP_ITEM:
      return {
        ...state,
        shopInventory: {
          ...state.shopInventory,
          items: state.shopInventory.items.filter((_, index) => index !== action.payload)
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
        currentStep: Math.max(1, Math.min(action.payload, state.totalSteps))
      };
      
    case ACTION_TYPES.VALIDATE_STEP:
      // Validation logic for each step
      let isValid = true;
      const validationErrors = { ...state.validationErrors };
      
      switch (action.payload) {
        case 1: // Basic info
          if (!state.name || state.name.trim().length === 0) {
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

        case 5: // Shop configuration
          // Shop configuration is always valid (optional feature)
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
        ...initialState,
        ...action.payload,
        originalCreatureId: action.payload.id,
        currentStep: 1
      };
      
    case ACTION_TYPES.SET_EDIT_MODE:
      return {
        ...state,
        editMode: action.payload
      };
      
    default:
      return state;
  }
}

// Create contexts
const CreatureWizardStateContext = createContext();
const CreatureWizardDispatchContext = createContext();

// Provider component
export function CreatureWizardProvider({ children }) {
  const [state, dispatch] = useReducer(creatureWizardReducer, initialState);
  
  // Validate current step only when step changes (not on every state change)
  useEffect(() => {
    dispatch({ type: ACTION_TYPES.VALIDATE_STEP, payload: state.currentStep });
  }, [state.currentStep]);
  
  return (
    <CreatureWizardStateContext.Provider value={state}>
      <CreatureWizardDispatchContext.Provider value={dispatch}>
        {children}
      </CreatureWizardDispatchContext.Provider>
    </CreatureWizardStateContext.Provider>
  );
}

// Custom hooks for accessing the context
export const useCreatureWizard = () => {
  const context = useContext(CreatureWizardStateContext);
  if (context === undefined) {
    throw new Error('useCreatureWizard must be used within a CreatureWizardProvider');
  }
  return context;
};

export const useCreatureWizardDispatch = () => {
  const context = useContext(CreatureWizardDispatchContext);
  if (context === undefined) {
    throw new Error('useCreatureWizardDispatch must be used within a CreatureWizardProvider');
  }
  return context;
};

// Action creators
export const wizardActionCreators = {
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
  
  updateAbility: (index, ability) => ({
    type: ACTION_TYPES.UPDATE_ABILITY,
    payload: { index, ability }
  }),
  
  removeAbility: (index) => ({
    type: ACTION_TYPES.REMOVE_ABILITY,
    payload: index
  }),
  
  setLootTable: (lootTable) => ({
    type: ACTION_TYPES.SET_LOOT_TABLE,
    payload: lootTable
  }),
  
  addLootItem: (item) => ({
    type: ACTION_TYPES.ADD_LOOT_ITEM,
    payload: item
  }),
  
  updateLootItem: (index, item) => ({
    type: ACTION_TYPES.UPDATE_LOOT_ITEM,
    payload: { index, item }
  }),
  
  removeLootItem: (index) => ({
    type: ACTION_TYPES.REMOVE_LOOT_ITEM,
    payload: index
  }),

  setShopkeeperStatus: (isShopkeeper) => ({
    type: ACTION_TYPES.SET_SHOPKEEPER_STATUS,
    payload: isShopkeeper
  }),

  setShopInfo: (shopInfo) => ({
    type: ACTION_TYPES.SET_SHOP_INFO,
    payload: shopInfo
  }),

  addShopItem: (item) => ({
    type: ACTION_TYPES.ADD_SHOP_ITEM,
    payload: item
  }),

  updateShopItem: (index, item) => ({
    type: ACTION_TYPES.UPDATE_SHOP_ITEM,
    payload: { index, item }
  }),

  removeShopItem: (index) => ({
    type: ACTION_TYPES.REMOVE_SHOP_ITEM,
    payload: index
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
  
  resetWizard: () => ({
    type: ACTION_TYPES.RESET_WIZARD
  }),
  
  loadCreature: (creature) => ({
    type: ACTION_TYPES.LOAD_CREATURE,
    payload: creature
  }),
  
  setEditMode: (isEditMode) => ({
    type: ACTION_TYPES.SET_EDIT_MODE,
    payload: isEditMode
  })
};
