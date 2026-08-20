/**
 * Utility functions for safe localStorage interaction
 * preventing quota errors and handling server-side rendering
 */

// In-memory fallback cache for when localStorage quota is exceeded or storage is unavailable
const memoryFallbackStore = new Map();

/**
 * Check if an error is a browser storage quota exceeded error
 * @param {Error} error
 * @returns {boolean}
 */
const isQuotaExceededError = (error) => {
    if (!error) return false;
    return (
        error.name === 'QuotaExceededError' ||
        error.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        error.code === 22 ||
        error.code === 1014 ||
        error.number === -2147024882 ||
        (typeof error.message === 'string' && error.message.toLowerCase().includes('quota'))
    );
};

/**
 * Perform an emergency cleanup of non-essential temporary and backup keys to free space
 */
const attemptQuotaCleanup = () => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;

    try {
        if (window.localStorageManager && typeof window.localStorageManager.performEmergencyCleanup === 'function') {
            window.localStorageManager.performEmergencyCleanup();
            return;
        }
    } catch (_) {}

    try {
        const disposablePrefixes = ['mythrill-backup-', 'mythrill-temp-', 'mythrill-cache-', 'mythrill-debug-'];
        const disposableExact = ['mythrill_subregion_polygons', 'mythrill_map_history_backup'];
        const keysToRemove = [];

        for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (!k) continue;
            if (disposablePrefixes.some(p => k.startsWith(p)) || disposableExact.includes(k)) {
                keysToRemove.push(k);
            }
        }

        keysToRemove.forEach(k => {
            try { localStorage.removeItem(k); } catch (_) {}
        });
    } catch (_) {}
};

/**
 * Robust wrapper for localStorage.setItem with quota handling and memory fallback
 * @param {string} key - The key to store
 * @param {string} value - The serialized value to store
 * @returns {{ success: boolean, value?: string, isFallback?: boolean, error?: string }}
 */
const safeLocalStorageItem = (key, value) => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        memoryFallbackStore.set(key, value);
        return { success: true, value, isFallback: true };
    }

    try {
        localStorage.setItem(key, value);
        // Clear any stale memory fallback for this key
        memoryFallbackStore.delete(key);
        return { success: true, value };
    } catch (error) {
        if (isQuotaExceededError(error)) {
            console.warn(`[storageUtils] LocalStorage quota exceeded for key "${key}". Attempting cleanup...`);
            attemptQuotaCleanup();

            try {
                localStorage.setItem(key, value);
                memoryFallbackStore.delete(key);
                return { success: true, value };
            } catch (retryError) {
                console.warn(`[storageUtils] Retry failed for key "${key}". Preserving in memory fallback.`);
                memoryFallbackStore.set(key, value);
                return { success: true, value, isFallback: true, error: 'Quota exceeded (stored in memory fallback)' };
            }
        }

        console.error(`Error setting localStorage key ${key}:`, error);
        memoryFallbackStore.set(key, value);
        return { success: true, value, isFallback: true, error: error.message };
    }
};

/**
 * Get localStorage item with proper error handling and memory fallback
 * @param {string} key - The localStorage key to retrieve
 * @returns {string|null} - The stored value or null
 */
const safeLocalStorageGet = (key) => {
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return memoryFallbackStore.get(key) || null;
    }

    try {
        const val = localStorage.getItem(key);
        if (val !== null && val !== undefined) {
            return val;
        }
    } catch (error) {
        console.error(`Error reading ${key} from localStorage:`, error.message);
    }

    return memoryFallbackStore.get(key) || null;
};

/**
 * Remove localStorage item with proper error handling and memory fallback cleanup
 * @param {string} key - The localStorage key to remove
 * @returns {boolean} - Success status
 */
const safeLocalStorageRemove = (key) => {
    memoryFallbackStore.delete(key);

    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return true;
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
    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return false;
    }

    try {
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.includes(pattern)) {
                keysToRemove.push(key);
            }
        }

        // Remove matching keys
        keysToRemove.forEach(key => {
            memoryFallbackStore.delete(key);
            localStorage.removeItem(key);
        });

        return true;
    } catch (error) {
        console.error('Error clearing localStorage pattern:', error.message);
        return false;
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
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        return {
            accountType: localStorage.getItem('mythrill-last-account-type') || 'guest',
            userId: localStorage.getItem('mythrill-last-user-id') || null
        };
    }
    return { accountType: 'guest', userId: null };
};

/**
 * Create standard storage configuration for Zustand persist middleware
 * Guarantees zero unhandled QuotaExceededError exceptions
 * @param {string} name - Storage key name
 * @param {object} options - Additional options
 */
const createStorageConfig = (name, options = {}) => ({
    name,
    storage: {
        getItem: (key) => {
            const str = safeLocalStorageGet(key);
            if (!str) return null;
            try {
                return JSON.parse(str);
            } catch (error) {
                console.error(`Error parsing stored data for ${key}:`, error);
                return null;
            }
        },
        setItem: (key, value) => {
            try {
                const serialized = typeof value === 'string' ? value : JSON.stringify(value);
                safeLocalStorageItem(key, serialized);
            } catch (error) {
                console.error(`Error stringifying data for ${key}:`, error);
                try {
                    memoryFallbackStore.set(key, JSON.stringify(value));
                } catch (_) {}
            }
        },
        removeItem: (key) => {
            safeLocalStorageRemove(key);
        }
    },
    ...options
});

export {
    safeLocalStorageItem,
    safeLocalStorageGet,
    safeLocalStorageRemove,
    clearLocalStoragePattern,
    markStorageCleared,
    getLastAccountInfo,
    createStorageConfig,
    memoryFallbackStore,
    isQuotaExceededError
};
