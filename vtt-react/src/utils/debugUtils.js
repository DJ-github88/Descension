/**
 * Debug utilities for conditional logging
 * Helps improve performance by disabling debug logs in production
 */

// Check if we're in development mode
const isDevelopment = process.env.NODE_ENV === 'development';

// Check for debug flags in localStorage (for runtime debugging)
const getDebugFlag = (category) => {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(`debug_${category}`) === 'true';
  } catch {
    return false;
  }
};

// Debug categories
export const DEBUG_CATEGORIES = {
  MULTIPLAYER: 'multiplayer',
  GRID: 'grid',
  NAVIGATION: 'navigation',
  PERFORMANCE: 'performance',
  SOCKET: 'socket',
  TOKENS: 'tokens',
  INVENTORY: 'inventory',
  COMBAT: 'combat'
};

/**
 * Conditional console.log that only logs in development or when debug flag is set
 * @param {string} category - Debug category
 * @param {...any} args - Arguments to log
 */
export const debugLog = (category, ...args) => {
  if (isDevelopment || getDebugFlag(category)) {
    console.log(`[${category.toUpperCase()}]`, ...args);
  }
};

/**
 * Conditional console.warn that only logs in development or when debug flag is set
 * @param {string} category - Debug category
 * @param {...any} args - Arguments to log
 */
export const debugWarn = (category, ...args) => {
  if (isDevelopment || getDebugFlag(category)) {
    console.warn(`[${category.toUpperCase()}]`, ...args);
  }
};

/**
 * Conditional console.error that always logs (errors should always be visible)
 * @param {string} category - Debug category
 * @param {...any} args - Arguments to log
 */
export const debugError = (category, ...args) => {
  console.error(`[${category.toUpperCase()}]`, ...args);
};

/**
 * Performance timing utility
 * @param {string} label - Label for the timing
 * @param {Function} fn - Function to time
 * @returns {any} - Result of the function
 */
export const timeFunction = (label, fn) => {
  if (!isDevelopment && !getDebugFlag(DEBUG_CATEGORIES.PERFORMANCE)) {
    return fn();
  }
  
  const start = performance.now();
  const result = fn();
  const end = performance.now();
  
  debugLog(DEBUG_CATEGORIES.PERFORMANCE, `${label} took ${(end - start).toFixed(2)}ms`);
  return result;
};

/**
 * Enable debug logging for a specific category at runtime
 * @param {string} category - Debug category to enable
 */
export const enableDebug = (category) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`debug_${category}`, 'true');
    console.log(`Debug logging enabled for category: ${category}`);
  }
};

/**
 * Disable debug logging for a specific category at runtime
 * @param {string} category - Debug category to disable
 */
export const disableDebug = (category) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(`debug_${category}`);
    console.log(`Debug logging disabled for category: ${category}`);
  }
};

/**
 * List all available debug categories
 */
export const listDebugCategories = () => {
  console.log('Available debug categories:', Object.values(DEBUG_CATEGORIES));
  console.log('Usage: enableDebug("multiplayer") or disableDebug("multiplayer")');
};

// Make debug utilities available globally for easy runtime debugging
if (typeof window !== 'undefined') {
  window.debugUtils = {
    enableDebug,
    disableDebug,
    listDebugCategories,
    categories: DEBUG_CATEGORIES
  };
}
