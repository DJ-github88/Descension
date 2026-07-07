/**
 * Legacy class-name migration helper.
 *
 * Several classes were merged during Phase 1.8-1.10 consolidation:
 *
 *   Phase 1.8:  Bladedancer + Formbender → Shaper
 *   Phase 1.9:  Covenbane + Exorcist     → Inquisitor
 *   Phase 1.10: Deathcaller + Lichborne  → Revenant
 *   (also)      Dreadnaught              → Martyr (Ironclad specialization)
 *   (also)      Titan                    → Warden (Monolith specialization)
 *
 * Older character saves may still carry the pre-merge class name. This helper
 * rewrites those to their live successors so the rest of the pipeline
 * (resource config, talent trees, spell categories, equipment) resolves to
 * the merged class. Idempotent: already-canonical names pass through.
 */

const LEGACY_CLASS_MAP = {
    // Phase 1.8  -  Shaper consolidation
    Bladedancer: 'Shaper',
    Formbender: 'Shaper',
    // Phase 1.9  -  Inquisitor consolidation
    Covenbane: 'Inquisitor',
    Exorcist: 'Inquisitor',
    // Phase 1.10  -  Revenant consolidation
    Deathcaller: 'Revenant',
    Lichborne: 'Revenant',
    // Dreadnaught absorbed into Martyr as the Ironclad specialization
    Dreadnaught: 'Martyr',
    // Titan absorbed into Warden as the Monolith specialization
    Titan: 'Warden',
};

export function migrateLegacyClassName(className) {
    if (!className || typeof className !== 'string') return className;
    return LEGACY_CLASS_MAP[className] || className;
}

export const LEGACY_CLASS_NAMES = Object.keys(LEGACY_CLASS_MAP);
