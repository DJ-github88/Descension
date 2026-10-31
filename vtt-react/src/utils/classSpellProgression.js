const asSet = (value) => {
    if (value instanceof Set) return value;
    return new Set(Array.isArray(value) ? value : []);
};

/**
 * Spell IDs explicitly recorded as level-up choices. Starting selections are
 * never written to levelUpHistory, so these are the earned picks that must not
 * count against the creation quota when a character is edited.
 */
export const getEarnedSpellIds = (levelUpHistory = {}) => {
    if (!levelUpHistory || typeof levelUpHistory !== 'object') return new Set();
    return new Set(
        Object.values(levelUpHistory)
            .map(entry => entry?.spellId)
            .filter(Boolean)
    );
};

/**
 * Known starting picks. When a starting pool is supplied, only entries from
 * that pool count; earned level-up picks are excluded even when they came from
 * the same earlier-level pool.
 */
export const getStartingSpellIds = (knownSpells = [], levelUpHistory = {}, startingPool = null) => {
    const known = Array.isArray(knownSpells) ? knownSpells : [];
    const earned = getEarnedSpellIds(levelUpHistory);
    const pool = startingPool == null ? null : asSet(startingPool);
    return known.filter(id => !earned.has(id) && (!pool || pool.has(id)));
};
