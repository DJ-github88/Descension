/**
 * Utility functions for Firebase interactions.
 */

/**
 * Recursively removes undefined values from an object or array.
 * Firebase Firestore does not accept undefined values.
 * 
 * @param {any} obj - The object to sanitize
 * @returns {any} - The sanitized object
 */
/**
 * Recursively removes undefined values from an object or array.
 * Firebase Firestore does not accept undefined values or nested arrays.
 * 
 * @param {any} obj - The object to sanitize
 * @param {boolean} isWithinArray - Internal flag to detect nested arrays
 * @returns {any} - The sanitized object
 */
export function sanitizeForFirestore(obj, isWithinArray = false) {
    // Handle null, undefined, and non-object types
    if (obj === null || obj === undefined) {
        return null;
    }

    // Handle arrays
    if (Array.isArray(obj)) {
        // Firestore does not support nested arrays.
        // If we're already inside an array, stringify this nested array to preserve data.
        if (isWithinArray) {
            try {
                return JSON.stringify(obj.map(item => sanitizeForFirestore(item, true)));
            } catch (e) {
                console.error('Error stringifying nested array for Firestore:', e);
                return null;
            }
        }

        return obj
            .map(item => sanitizeForFirestore(item, true)) // Mark as within array for children
            .filter(item => item !== undefined);
    }

    // Handle objects (but not Dates or other special objects you want to preserve)
    if (typeof obj === 'object' && !(obj instanceof Date)) {
        const sanitized = {};
        for (const [key, value] of Object.entries(obj)) {
            if (value !== undefined) {
                // When entering an object, we're no longer "directly" within an array's top level,
                // BUT Firestore also doesn't allow arrays-of-objects-where-objects-have-arrays.
                // Wait, actually Firestore DOES allow arrays of objects, and those objects can have arrays.
                // The restriction is specifically: "Nested arrays are not supported" 
                // which usually means Array<Array<...>>.
                // However, some Firebase versions/configs are stricter.
                // Let's stick to the most common interpretation: Array<Array> is forbidden.
                // If the user has an Array<Object<{ nestedArray: [] }>>, that is usually OK.
                // If it turns out that's also an issue, we'd need to reset isWithinArray to false here.
                sanitized[key] = sanitizeForFirestore(value, false);
            }
        }
        return sanitized;
    }

    // Return primitives as-is
    return obj;
}
