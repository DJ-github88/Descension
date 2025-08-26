/**
 * Store Validation Utilities
 * Ensures consistent data structures across all Zustand stores
 */

import { safeGet, ensureArray, ensureObject, safeLog } from './prodDevParity';

/**
 * Validate and fix common store data structure issues
 * @param {Object} state - Store state to validate
 * @param {Object} schema - Expected schema
 * @returns {Object} Fixed state
 */
export const validateStoreState = (state, schema) => {
  if (!state || typeof state !== 'object') {
    safeLog('warn', 'Invalid store state, using default');
    return schema.default || {};
  }

  const fixedState = { ...state };

  // Fix array properties
  if (schema.arrays) {
    schema.arrays.forEach(arrayPath => {
      const currentValue = safeGet(fixedState, arrayPath);
      if (!Array.isArray(currentValue)) {
        safeLog('warn', `Fixing non-array property: ${arrayPath}`);
        setNestedProperty(fixedState, arrayPath, ensureArray(currentValue));
      }
    });
  }

  // Fix object properties
  if (schema.objects) {
    schema.objects.forEach(objectPath => {
      const currentValue = safeGet(fixedState, objectPath);
      if (typeof currentValue !== 'object' || Array.isArray(currentValue)) {
        safeLog('warn', `Fixing non-object property: ${objectPath}`);
        setNestedProperty(fixedState, objectPath, ensureObject(currentValue));
      }
    });
  }

  // Fix Set properties (convert from arrays if needed)
  if (schema.sets) {
    schema.sets.forEach(setPath => {
      const currentValue = safeGet(fixedState, setPath);
      if (!(currentValue instanceof Set)) {
        safeLog('warn', `Converting to Set: ${setPath}`);
        setNestedProperty(fixedState, setPath, new Set(ensureArray(currentValue)));
      }
    });
  }

  // Fix Map properties (convert from arrays if needed)
  if (schema.maps) {
    schema.maps.forEach(mapPath => {
      const currentValue = safeGet(fixedState, mapPath);
      if (!(currentValue instanceof Map)) {
        safeLog('warn', `Converting to Map: ${mapPath}`);
        const mapData = Array.isArray(currentValue) ? currentValue : [];
        setNestedProperty(fixedState, mapPath, new Map(mapData));
      }
    });
  }

  return fixedState;
};

/**
 * Set a nested property using dot notation
 * @param {Object} obj - Object to modify
 * @param {string} path - Dot notation path
 * @param {*} value - Value to set
 */
const setNestedProperty = (obj, path, value) => {
  const pathParts = path.split('.');
  let current = obj;

  for (let i = 0; i < pathParts.length - 1; i++) {
    const part = pathParts[i];
    if (!(part in current) || typeof current[part] !== 'object') {
      current[part] = {};
    }
    current = current[part];
  }

  current[pathParts[pathParts.length - 1]] = value;
};

/**
 * Common store schemas
 */
export const STORE_SCHEMAS = {
  gridItems: {
    arrays: ['gridItems'],
    default: { gridItems: [], lastUpdate: Date.now() }
  },
  
  inventory: {
    arrays: ['items'],
    objects: ['filters'],
    default: { items: [], filters: {} }
  },
  
  combat: {
    arrays: ['turnOrder', 'combatLog'],
    sets: ['selectedTokens', 'movementUnlocked'],
    maps: ['turnTimers'],
    default: { 
      turnOrder: [], 
      combatLog: [], 
      selectedTokens: new Set(), 
      movementUnlocked: new Set(),
      turnTimers: new Map()
    }
  },
  
  party: {
    arrays: ['members'],
    objects: ['hudSettings'],
    default: { members: [], hudSettings: {} }
  },
  
  creatures: {
    arrays: ['creatures'],
    default: { creatures: [] }
  },
  
  targeting: {
    arrays: ['selectedTargets'],
    objects: ['currentTarget'],
    default: { selectedTargets: [], currentTarget: null }
  }
};

/**
 * Create a production-safe storage handler for Zustand persist
 * @param {string} storeName - Name of the store for logging
 * @param {Object} schema - Store schema for validation
 * @returns {Object} Storage handler
 */
export const createSafeStorage = (storeName, schema) => ({
  getItem: (name) => {
    try {
      const value = localStorage.getItem(name);
      if (!value) return null;

      const parsed = JSON.parse(value);
      
      // Validate and fix the state
      if (parsed && parsed.state) {
        parsed.state = validateStoreState(parsed.state, schema);
      }

      return JSON.stringify(parsed);
    } catch (error) {
      safeLog('error', `Error retrieving ${storeName} from localStorage:`, error);
      return null;
    }
  },
  
  setItem: (name, value) => {
    try {
      // Validate before storing
      const parsed = JSON.parse(value);
      if (parsed && parsed.state) {
        parsed.state = validateStoreState(parsed.state, schema);
      }
      
      localStorage.setItem(name, JSON.stringify(parsed));
    } catch (error) {
      safeLog('error', `Error storing ${storeName} in localStorage:`, error);
    }
  },
  
  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
    } catch (error) {
      safeLog('error', `Error removing ${storeName} from localStorage:`, error);
    }
  }
});

/**
 * Wrap store actions to ensure safe execution
 * @param {Function} action - Store action to wrap
 * @param {string} actionName - Name for error logging
 * @returns {Function} Wrapped action
 */
export const wrapStoreAction = (action, actionName) => {
  return (...args) => {
    try {
      return action(...args);
    } catch (error) {
      safeLog('error', `Store action "${actionName}" failed:`, error);
      return false; // Safe fallback
    }
  };
};

/**
 * Create a production-safe store creator
 * @param {Function} storeCreator - Original store creator function
 * @param {Object} options - Options including schema and name
 * @returns {Function} Safe store creator
 */
export const createSafeStore = (storeCreator, options = {}) => {
  const { schema, name = 'unknown' } = options;
  
  return (set, get) => {
    const originalStore = storeCreator(set, get);
    
    // Wrap all actions
    const wrappedStore = {};
    for (const [key, value] of Object.entries(originalStore)) {
      if (typeof value === 'function') {
        wrappedStore[key] = wrapStoreAction(value, `${name}.${key}`);
      } else {
        wrappedStore[key] = value;
      }
    }
    
    return wrappedStore;
  };
};
