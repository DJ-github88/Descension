// Storage utility for managing localStorage with quota awareness
// This helper manages localStorage operations with graceful handling of quota exceeded errors

// CRITICAL FIX: Track account type and user ID to detect when to clear old storage
if (typeof window !== 'undefined') {
  window._lastAccountType = localStorage.getItem('mythrill-last-account-type') || 'guest';
  window._lastUserId = localStorage.getItem('mythrill-last-user-id') || null;
}

/**
 * Safe localStorage item with proper error handling and quota management
 * @param {string} key - The localStorage key
 * @param {any} value - The value to store
 * @param {number} maxSizeKB - Maximum size in KB (default: 5MB per item)
 * @returns {Object} - { success: boolean, error: string|null, value: any }
 */
const safeLocalStorageItem = (key, value, maxSizeKB = 5 * 1024) => {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Window not available' };
  }

  try {
    // CRITICAL FIX: Check if account type or user ID changed, requiring storage cleanup
    const isGuest = window._lastAccountType === 'guest';
    const currentUserId = window._lastUserId;
    const isDevUser = currentUserId?.startsWith('dev-user-');
    
    // Only check for storage cleanup if we're not a guest user
    // Guest users use separate keys by default, so no cleanup needed
    const needsStorageCleanup = !isGuest && currentUserId;

    if (needsStorageCleanup && typeof value === 'string') {
      // Check if new value is a large JSON string (character data)
      // Large strings can be 10-100KB, which could cause quota issues
      const estimatedSize = (value.length * 3) / 4; // Rough UTF-16 byte estimate
      
      if (estimatedSize > 50 * 1024) { // Larger than 50KB
        console.warn(`  Attempting to store large string (${estimatedSize} bytes) to localStorage key: ${key}`);
      }
    }

    localStorage.setItem(key, value);
    return { success: true, value };
  } catch (error) {
    // Check if it's a quota error
    if (error.name && error.name === 'QuotaExceededError') {
      console.error(`L localStorage quota exceeded for key: ${key}`);
      return { success: false, error: 'Storage quota exceeded' };
    }
    
    console.error(`Error storing ${key}:`, error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Get localStorage item with proper error handling
 * @param {string} key - The localStorage key
 * @returns {any} - The stored value or null
 */
const safeLocalStorageGet = (key) => {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const value = localStorage.getItem(key);
    return value;
  } catch (error) {
    console.error(`Error reading ${key}:`, error.message);
    return null;
  }
};

/**
 * Remove localStorage item with proper error handling
 * @param {string} key - The localStorage key to remove
 * @returns {boolean} - Success status
 */
const safeLocalStorageRemove = (key) => {
  if (typeof window === 'undefined') {
    return false;
  }

  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key}:`, error.message);
    return false;
  }
};

/**
 * Clear all localStorage items matching a pattern (for account switching)
 * @param {string} pattern - The pattern to match keys
 */
const clearLocalStoragePattern = (pattern) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    // Get all keys
    const keys = Object.keys(localStorage);
    
    // Remove matching keys
    keys.forEach(key => {
      if (pattern.test(key)) {
        localStorage.removeItem(key);
      }
    });
    
    console.log(`Cleared localStorage keys matching pattern: ${pattern}`);
    return true;
  } catch (error) {
    console.error('Error clearing localStorage pattern:', error.message);
  }
};

/**
 * Mark that storage is being cleared (for account switching)
 * @param {string} accountType - The new account type ('guest', 'authenticated', 'dev')
 * @param {string} userId - The new user ID
 */
const markStorageCleared = (accountType, userId) => {
  if (typeof window !== 'undefined') {
    window._lastAccountType = accountType;
    window._lastUserId = userId;
  }
};

/**
 * Get the last account type and user ID (for detecting account switches)
 */
const getLastAccountInfo = () => {
  if (typeof window !== 'undefined') {
    return {
      accountType: localStorage.getItem('mythrill-last-account-type') || 'guest',
      userId: localStorage.getItem('mythrill-last-user-id') || null
    };
  }
  return {
    safeLocalStorageItem,
    safeLocalStorageGet,
    safeLocalStorageRemove,
    clearLocalStoragePattern,
    markStorageCleared,
    getLastAccountInfo
};