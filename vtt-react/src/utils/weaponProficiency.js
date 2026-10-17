/**
 * P11 — per-weapon proficiency ranks (owner of the storage key and resolution).
 *
 * Each weapon type has its own rank in the character's existing `skillRanks` map,
 * under `weaponMastery_<weaponType>` (the same key shape `skillProgress` already
 * uses for per-weapon quest progress). The old single `skillRanks.weaponMastery`
 * value is legacy: it is kept unchanged and never applied implicitly, because
 * nobody can tell which weapon it was meant for.
 *
 * Pure functions only. No combat, roll or budget rules live here.
 */
import { SKILL_RANKS } from '../constants/skillDefinitions';
import { WEAPON_TYPE_META } from '../constants/weaponTypeMeta';

export const WEAPON_MASTERY_SKILL_ID = 'weaponMastery';
export const RANK_ORDER = Object.freeze(Object.keys(SKILL_RANKS));

/** Existing per-weapon quest thresholds (cumulative quests completed); unchanged from the sheet. */
export const WEAPON_MASTERY_QUEST_THRESHOLDS = Object.freeze({
    UNTRAINED: 0,
    NOVICE: 1,
    TRAINED: 3,
    APPRENTICE: 6,
    ADEPT: 9,
    EXPERT: 11,
    MASTER: 12
});

export const isKnownRank = rankKey => typeof rankKey === 'string' && Object.prototype.hasOwnProperty.call(SKILL_RANKS, rankKey);
export const isKnownWeaponType = weaponType => typeof weaponType === 'string' && Object.prototype.hasOwnProperty.call(WEAPON_TYPE_META, weaponType);

/** Storage key for one weapon type's rank, or null for an unknown type. */
export function weaponRankKey(weaponType) {
    return isKnownWeaponType(weaponType) ? `${WEAPON_MASTERY_SKILL_ID}_${weaponType}` : null;
}

export const isWeaponRankKey = key => typeof key === 'string' && key.startsWith(`${WEAPON_MASTERY_SKILL_ID}_`)
    && isKnownWeaponType(key.slice(WEAPON_MASTERY_SKILL_ID.length + 1));

/** The rank stored for exactly this weapon type, or null. */
export function getStoredWeaponRank(skillRanks, weaponType) {
    const key = weaponRankKey(weaponType);
    const value = key && skillRanks ? skillRanks[key] : undefined;
    return isKnownRank(value) ? value : null;
}

/** Rank derived from that weapon type's own quest progress (the pre-P11 fallback). */
export function questDerivedWeaponRank(skillProgress, weaponType) {
    const progress = skillProgress && isKnownWeaponType(weaponType)
        ? skillProgress[`${WEAPON_MASTERY_SKILL_ID}_${weaponType}`] : null;
    const completed = Array.isArray(progress?.completedQuests) ? progress.completedQuests.length : 0;
    for (let i = RANK_ORDER.length - 1; i >= 0; i--) {
        const rankKey = RANK_ORDER[i];
        const required = WEAPON_MASTERY_QUEST_THRESHOLDS[rankKey] ?? SKILL_RANKS[rankKey].questsRequired;
        if (completed >= required) return rankKey;
    }
    return 'UNTRAINED';
}

/**
 * Rank for one weapon type: its own stored rank, else its own quest progress,
 * else Untrained. The legacy shared rank is deliberately not consulted.
 * @returns {{ key: string, source: 'stored'|'quests'|'default' }}
 */
export function resolveWeaponRank({ skillRanks, skillProgress, weaponType }) {
    const stored = getStoredWeaponRank(skillRanks, weaponType);
    if (stored) return { key: stored, source: 'stored' };
    const derived = questDerivedWeaponRank(skillProgress, weaponType);
    return { key: derived, source: derived === 'UNTRAINED' ? 'default' : 'quests' };
}

/**
 * The legacy single Weapon Mastery rank, when it carries information.
 * An Untrained value (the old creation default) is not ambiguous and returns null.
 */
export function getLegacySharedWeaponRank(skillRanks) {
    const value = skillRanks ? skillRanks[WEAPON_MASTERY_SKILL_ID] : undefined;
    return isKnownRank(value) && value !== 'UNTRAINED' ? value : null;
}

/**
 * Returns a new skillRanks map with one weapon type's rank set, or null when the
 * write must be refused (unknown weapon type or rank). Never touches other keys,
 * including the legacy shared rank.
 */
export function withWeaponRank(skillRanks, weaponType, rankKey) {
    const key = weaponRankKey(weaponType);
    if (!key || !isKnownRank(rankKey)) return null;
    return { ...(skillRanks || {}), [key]: rankKey };
}

/** Per-weapon entries above Untrained, in WEAPON_TYPE_META order. */
export function trainedWeaponTypes(skillRanks) {
    return Object.keys(WEAPON_TYPE_META)
        .map(weaponType => ({ weaponType, rank: getStoredWeaponRank(skillRanks, weaponType) }))
        .filter(entry => entry.rank && entry.rank !== 'UNTRAINED');
}
