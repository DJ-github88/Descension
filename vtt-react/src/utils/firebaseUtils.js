/**
 * Utility functions for Firebase interactions.
 */

/**
 * Recursively walks an object/array and rewrites it so it is safe to send to
 * Firestore. Specifically it:
 *   - Drops `undefined` values (Firestore rejects them)
 *   - Coerces nested arrays (Array<Array<...>>) to a JSON-encoded string at
 *     the leaf level. Firestore rejects Array<Array<...>> documents. We only
 *     stringify the *inner* array so the surrounding array stays a 1D array
 *     of strings, which IS supported.
 *   - Strips non-serializable values (functions, symbols, etc.) gracefully.
 *
 * @param {any} obj - The object to sanitize
 * @param {{depth: number, parentIsArray: boolean}} ctx
 * @returns {any} - The sanitized object
 */
export function sanitizeForFirestore(obj, ctx = { depth: 0, parentIsArray: false }) {
    const { depth, parentIsArray } = ctx;

    // Primitives / null / undefined
    if (obj === undefined) return undefined;
    if (obj === null) return null;
    if (typeof obj === 'function' || typeof obj === 'symbol') return null;

    if (typeof obj !== 'object') {
        return obj;
    }

    // Preserve Date / Firestore sentinel objects as-is
    if (obj instanceof Date) return obj;
    if (typeof obj.toDate === 'function') return obj;
    if (typeof obj._methodName === 'string' && obj._args) return obj;

    if (Array.isArray(obj)) {
        // We are an array. The question is: are we a NESTED array (Array<Array>)?
        // We treat an array as nested when its parent is also an array.
        // That keeps e.g. Array<{a:1, b:[1,2]}> valid, but flattens
        // Array<Array<...>> by JSON-encoding the inner arrays.
        if (parentIsArray) {
            // Try to flatten to a 1D array of primitives/objects. If any element
            // is itself an array, we recursively sanitize and JSON-encode it.
            try {
                const childCtx = { depth: depth + 1, parentIsArray: true };
                return JSON.stringify(
                    obj.map((item) => {
                        if (Array.isArray(item)) {
                            return JSON.stringify(
                                item.map((sub) =>
                                    sanitizeForFirestore(sub, { depth: depth + 2, parentIsArray: true })
                                )
                            );
                        }
                        return sanitizeForFirestore(item, childCtx);
                    })
                );
            } catch (e) {
                console.error('Error stringifying nested array for Firestore:', e);
                return null;
            }
        }

        // Top-level (or non-nested) array. Recurse into each child with
        // parentIsArray = true so any nested arrays get the treatment above.
        return obj
            .map((item) => sanitizeForFirestore(item, { depth: depth + 1, parentIsArray: true }))
            .filter((item) => item !== undefined);
    }

    // Plain object
    const sanitized = {};
    for (const [key, value] of Object.entries(obj)) {
        if (value === undefined) continue;
        sanitized[key] = sanitizeForFirestore(value, {
            depth: depth + 1,
            parentIsArray: false
        });
    }
    return sanitized;
}
