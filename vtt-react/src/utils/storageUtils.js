/**
 * Utility functions for safe localStorage interaction
 * preventing quota errors and handling server-side rendering
 */

// Simple robust wrapper for localStorage.setItem with quota handling
const safeLocalStorageItem = (key, value) => {
    if (typeof window === 'undefined') {
        return { success: false, error: 'Window not defined' };
    }

    try {
        localStorage.setItem(key, value);
        return { success: true, value };
    } catch (error) {
        if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            console.error(`LocalStorage quota exceeded for key: ${key}`);
            return { success: false, error: 'Quota exceeded' };
        }
        console.error(`Error setting localStorage key ${key}:`, error);
        return { success: false, error: error.message };
    }
};

/**
 * Get localStorage item with proper error handling
 * @param {string} key - The localStorage key to retrieve
 * @returns {any} - The stored value or null
 */
const safeLocalStorageGet = (key) => {
    if (typeof window === 'undefined') {
        return null;
    }

    try {
        return localStorage.getItem(key);
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
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.includes(pattern)) {
                keysToRemove.push(key);
            }
        }

        // Remove matching keys
        keysToRemove.forEach(key => {
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
    if (typeof window !== 'undefined') {
        return {
            accountType: localStorage.getItem('mythrill-last-account-type') || 'guest',
            userId: localStorage.getItem('mythrill-last-user-id') || null
        };
    }
    return { accountType: 'guest', userId: null };
};

/**
 * Create standard storage configuration for Zustand persist middleware
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
                const result = safeLocalStorageItem(key, JSON.stringify(value));
                if (!result.success) {
                    console.error(`Failed to save ${key}:`, result.error);
                }
            } catch (error) {
                console.error(`Error stringifying data for ${key}:`, error);
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
    createStorageConfig
};
