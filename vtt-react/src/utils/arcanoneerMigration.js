/**
 * Arcanoneer Elemental Spheres — save migration helper.
 *
 * Older saves may contain inconsistent sphere IDs from the 6-way naming schism.
 * The canonical 8 IDs (defined in classResources.js) are:
 *
 *   arcane / divine / blight / ember / rime / primal / storm / wyrd
 *
 * Legacy aliases that need migration:
 *   ember2 → divine (the old duplicate-id fix for d8=2)
 *   holy   → divine
 *   healing → storm (d8=7 was mislabeled "healing", canonical is "storm")
 *   flesh  → storm
 *   nature → primal
 *   chaos  → wyrd
 *   shadow → blight (shadow was a display-name alias)
 *   fire   → ember  (fire was a display-name alias)
 *   ice / frost → rime
 *   light → divine
 *   force → arcane
 *   radiant → divine
 *   heat  → ember
 *   cold  → rime
 *   spark → primal
 *
 * Already-canonical IDs pass through unchanged.
 */

const CANONICAL_IDS = new Set([
    'arcane', 'divine', 'blight', 'ember', 'rime', 'primal', 'storm', 'wyrd'
]);

const LEGACY_TO_CANONICAL = {
    // Direct aliases
    'ember2':  'divine',
    'holy':    'divine',
    'light':   'divine',
    'radiant': 'divine',
    'force':   'arcane',
    'shadow':  'blight',
    'fire':    'ember',
    'heat':    'ember',
    'ice':     'rime',
    'frost':   'rime',
    'cold':    'rime',
    'nature':  'primal',
    'spark':   'primal',
    'healing': 'storm',
    'flesh':   'storm',
    'chaos':   'wyrd',
    // Canonical pass-throughs (for safety)
    'arcane':  'arcane',
    'divine':  'divine',
    'blight':  'blight',
    'ember':   'ember',
    'rime':    'rime',
    'primal':  'primal',
    'storm':   'storm',
    'wyrd':    'wyrd',
};

export function migrateBlockId(legacyId) {
    if (!legacyId || typeof legacyId !== 'string') return legacyId;
    const lower = legacyId.toLowerCase();
    if (CANONICAL_IDS.has(lower)) return lower;
    if (LEGACY_TO_CANONICAL[lower]) return LEGACY_TO_CANONICAL[lower];
    return legacyId;
}

export function migrateArcanoneerClassResource(classResource) {
    if (!classResource || typeof classResource !== 'object') return classResource;
    const isArcanoneer =
        classResource.type === 'elementalSpheres' ||
        Array.isArray(classResource.spheres);
    if (!isArcanoneer) return classResource;

    const spheres = Array.isArray(classResource.spheres) ? classResource.spheres : [];
    if (spheres.length === 0) return classResource;

    const needsMigration = spheres.some(s => !CANONICAL_IDS.has(String(s).toLowerCase()));
    if (!needsMigration) return classResource;

    const newSpheres = spheres.map(migrateBlockId);
    return {
        ...classResource,
        spheres: newSpheres,
        type: 'elementalSpheres',
    };
}
