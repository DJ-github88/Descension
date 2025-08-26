/**
 * Production/Development Parity Utilities
 * Ensures consistent behavior between localhost and production builds
 */

/**
 * Safe property access that works consistently in dev and prod
 * @param {Object} obj - Object to access property on
 * @param {string} path - Dot notation path (e.g., 'user.profile.name')
 * @param {*} defaultValue - Default value if property doesn't exist
 * @returns {*} The property value or default
 */
export const safeGet = (obj, path, defaultValue = undefined) => {
  if (!obj || !path) return defaultValue;
  
  try {
    const pathParts = path.split('.');
    let current = obj;
    
    for (const part of pathParts) {
      if (current === null || current === undefined) {
        return defaultValue;
      }
      current = current[part];
    }
    
    return current !== undefined ? current : defaultValue;
  } catch (error) {
    console.warn(`safeGet failed for path "${path}":`, error);
    return defaultValue;
  }
};

/**
 * Safe array operation that ensures we're working with an array
 * @param {*} value - Value that should be an array
 * @param {Array} defaultValue - Default array if value is not an array
 * @returns {Array} Guaranteed array
 */
export const ensureArray = (value, defaultValue = []) => {
  if (Array.isArray(value)) return value;
  if (value === null || value === undefined) return defaultValue;
  return defaultValue;
};

/**
 * Safe object operation that ensures we're working with an object
 * @param {*} value - Value that should be an object
 * @param {Object} defaultValue - Default object if value is not an object
 * @returns {Object} Guaranteed object
 */
export const ensureObject = (value, defaultValue = {}) => {
  if (value && typeof value === 'object' && !Array.isArray(value)) return value;
  return defaultValue;
};

/**
 * Safe number operation that ensures we get a valid number
 * @param {*} value - Value that should be a number
 * @param {number} defaultValue - Default number if value is not a number
 * @returns {number} Guaranteed number
 */
export const ensureNumber = (value, defaultValue = 0) => {
  const num = Number(value);
  return isNaN(num) ? defaultValue : num;
};

/**
 * Safe string operation that ensures we get a valid string
 * @param {*} value - Value that should be a string
 * @param {string} defaultValue - Default string if value is not a string
 * @returns {string} Guaranteed string
 */
export const ensureString = (value, defaultValue = '') => {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return defaultValue;
  return String(value);
};

/**
 * Environment-safe console logging that behaves consistently
 * @param {string} level - Log level ('log', 'warn', 'error')
 * @param {...any} args - Arguments to log
 */
export const safeLog = (level, ...args) => {
  try {
    if (console && typeof console[level] === 'function') {
      console[level](...args);
    }
  } catch (error) {
    // Fallback for environments where console might not be available
    try {
      console.log(`[${level.toUpperCase()}]`, ...args);
    } catch (fallbackError) {
      // Silent fail if console is completely unavailable
    }
  }
};

/**
 * Safe localStorage access that handles quota exceeded and other errors
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if storage fails
 * @returns {*} Stored value or default
 */
export const safeLocalStorageGet = (key, defaultValue = null) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const value = localStorage.getItem(key);
      return value !== null ? JSON.parse(value) : defaultValue;
    }
  } catch (error) {
    safeLog('warn', `localStorage get failed for key "${key}":`, error);
  }
  return defaultValue;
};

/**
 * Safe localStorage set that handles quota exceeded and other errors
 * @param {string} key - Storage key
 * @param {*} value - Value to store
 * @returns {boolean} Success status
 */
export const safeLocalStorageSet = (key, value) => {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    }
  } catch (error) {
    safeLog('warn', `localStorage set failed for key "${key}":`, error);
  }
  return false;
};

/**
 * Safe array method that ensures consistent behavior
 * @param {*} array - Value that should be an array
 * @param {string} method - Array method name
 * @param {...any} args - Method arguments
 * @returns {*} Method result or safe fallback
 */
export const safeArrayMethod = (array, method, ...args) => {
  const safeArray = ensureArray(array);
  
  if (typeof safeArray[method] === 'function') {
    try {
      return safeArray[method](...args);
    } catch (error) {
      safeLog('warn', `Array method "${method}" failed:`, error);
    }
  }
  
  // Fallback for common methods
  switch (method) {
    case 'length':
      return safeArray.length;
    case 'find':
      return safeArray.find(...args);
    case 'filter':
      return safeArray.filter(...args);
    case 'map':
      return safeArray.map(...args);
    case 'includes':
      return safeArray.includes(...args);
    default:
      safeLog('warn', `No fallback for array method "${method}"`);
      return undefined;
  }
};

/**
 * Production-safe error boundary for critical operations
 * @param {Function} operation - Operation to execute safely
 * @param {*} fallback - Fallback value if operation fails
 * @param {string} context - Context for error logging
 * @returns {*} Operation result or fallback
 */
export const safeExecute = (operation, fallback = null, context = 'unknown') => {
  try {
    return operation();
  } catch (error) {
    safeLog('error', `Safe execution failed in context "${context}":`, error);
    return fallback;
  }
};

/**
 * Environment detection utilities
 */
export const isProduction = () => {
  try {
    return process.env.NODE_ENV === 'production';
  } catch {
    return window.location.hostname.includes('netlify') || 
           window.location.hostname.includes('vercel') ||
           !window.location.hostname.includes('localhost');
  }
};

export const isDevelopment = () => !isProduction();

/**
 * Consistent data structure validation
 * @param {*} data - Data to validate
 * @param {Object} schema - Expected structure
 * @returns {Object} Validation result
 */
export const validateDataStructure = (data, schema) => {
  const errors = [];
  
  for (const [key, expectedType] of Object.entries(schema)) {
    const value = safeGet(data, key);
    
    if (expectedType === 'array' && !Array.isArray(value)) {
      errors.push(`Expected ${key} to be array, got ${typeof value}`);
    } else if (expectedType === 'object' && (typeof value !== 'object' || Array.isArray(value))) {
      errors.push(`Expected ${key} to be object, got ${typeof value}`);
    } else if (typeof expectedType === 'string' && typeof value !== expectedType) {
      errors.push(`Expected ${key} to be ${expectedType}, got ${typeof value}`);
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};
