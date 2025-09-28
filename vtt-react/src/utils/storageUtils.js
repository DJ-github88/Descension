/**
 * Unified Storage Utilities
 * Consolidates localStorage handling patterns used across multiple stores
 * Provides error handling, quota management, and consistent behavior
 */

/**
 * Safe localStorage wrapper with error handling
 */
export const safeStorage = {
  getItem: (name) => {
    try {
      const value = localStorage.getItem(name);
      return value;
    } catch (error) {
      console.error(`Error retrieving ${name} from localStorage:`, error);
      return null;
    }
  },

  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value);
      return true;
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.warn(`Storage quota exceeded for ${name}, attempting cleanup...`);
        handleStorageQuotaExceeded(name, value);
        return false;
      } else {
        console.error(`Error storing ${name} in localStorage:`, error);
        return false;
      }
    }
  },

  removeItem: (name) => {
    try {
      localStorage.removeItem(name);
      return true;
    } catch (error) {
      console.error(`Error removing ${name} from localStorage:`, error);
      return false;
    }
  }
};

/**
 * Handle storage quota exceeded errors
 */
const handleStorageQuotaExceeded = (name, value) => {
  try {
    // Calculate current storage usage
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalSize += localStorage[key].length;
      }
    }

    console.warn(`Storage quota exceeded. Total size: ${totalSize} characters`);

    // Try to clean up other stores first
    const keysToClean = [];
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key !== name) {
        // Clean up old or large entries from other stores
        if (key.includes('temp-') || key.includes('cache-') || key.includes('backup-')) {
          keysToClean.push(key);
        }
      }
    }

    // Remove temporary/cache entries
    keysToClean.forEach(key => {
      localStorage.removeItem(key);
    });

    // Try to store again after cleanup
    try {
      localStorage.setItem(name, value);
      console.log(`Successfully stored ${name} after cleanup`);
    } catch (retryError) {
      console.error(`Still unable to store ${name} after cleanup:`, retryError);
    }
  } catch (cleanupError) {
    console.error('Error during storage cleanup:', cleanupError);
  }
};

/**
 * Create a standardized storage configuration for Zustand persist
 */
export const createStorageConfig = (storeName, options = {}) => {
  const {
    versionCheck = null,
    customSerializer = null,
    customDeserializer = null
  } = options;

  return {
    name: storeName,
    storage: {
      getItem: (name) => {
        const str = safeStorage.getItem(name);
        if (!str) return null;

        try {
          const parsed = JSON.parse(str);

          // Version check if provided
          if (versionCheck && !versionCheck(parsed)) {
            console.log(`${storeName}: Version check failed, resetting store`);
            safeStorage.removeItem(name);
            return null;
          }

          // Custom deserialization if provided
          if (customDeserializer) {
            return customDeserializer(parsed);
          }

          return parsed;
        } catch (error) {
          console.error(`Error parsing ${storeName} data:`, error);
          return null;
        }
      },

      setItem: (name, value) => {
        try {
          // Custom serialization if provided
          const dataToStore = customSerializer ? customSerializer(value) : value;
          const serialized = JSON.stringify(dataToStore);
          safeStorage.setItem(name, serialized);
        } catch (error) {
          console.error(`Error serializing ${storeName} data:`, error);
        }
      },

      removeItem: (name) => {
        safeStorage.removeItem(name);
      }
    }
  };
};

/**
 * Utility for stores that need Set/Map serialization
 */
export const createStorageConfigWithSets = (storeName, setFields = [], mapFields = []) => {
  return createStorageConfig(storeName, {
    customSerializer: (value) => {
      const serialized = { ...value };
      
      // Convert Sets to arrays
      setFields.forEach(field => {
        if (serialized.state && serialized.state[field] instanceof Set) {
          serialized.state[field] = Array.from(serialized.state[field]);
        }
      });

      // Convert Maps to objects
      mapFields.forEach(field => {
        if (serialized.state && serialized.state[field] instanceof Map) {
          serialized.state[field] = Object.fromEntries(serialized.state[field]);
        }
      });

      return serialized;
    },

    customDeserializer: (parsed) => {
      // Convert arrays back to Sets
      setFields.forEach(field => {
        if (parsed.state && Array.isArray(parsed.state[field])) {
          parsed.state[field] = new Set(parsed.state[field]);
        }
      });

      // Convert objects back to Maps
      mapFields.forEach(field => {
        if (parsed.state && typeof parsed.state[field] === 'object' && !Array.isArray(parsed.state[field])) {
          parsed.state[field] = new Map(Object.entries(parsed.state[field]));
        }
      });

      return parsed;
    }
  });
};

/**
 * Emergency storage cleanup utilities
 */
export const emergencyStorageCleanup = {
  clearAllStores: () => {
    const storeKeys = Object.keys(localStorage).filter(key => 
      key.includes('-store') || key.includes('-storage')
    );
    
    storeKeys.forEach(key => {
      safeStorage.removeItem(key);
    });
    

    return storeKeys.length;
  },

  clearTempData: () => {
    const tempKeys = Object.keys(localStorage).filter(key => 
      key.includes('temp-') || key.includes('cache-') || key.includes('backup-')
    );
    
    tempKeys.forEach(key => {
      safeStorage.removeItem(key);
    });
    

    return tempKeys.length;
  },

  getStorageInfo: () => {
    let totalSize = 0;
    const storeInfo = {};
    
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const size = localStorage[key].length;
        totalSize += size;
        storeInfo[key] = size;
      }
    }
    
    return {
      totalSize,
      totalKeys: Object.keys(storeInfo).length,
      stores: storeInfo
    };
  }
};

// Make emergency utilities available globally for debugging
if (typeof window !== 'undefined') {
  window.emergencyStorageCleanup = emergencyStorageCleanup;
  window.getStorageInfo = emergencyStorageCleanup.getStorageInfo;
}
