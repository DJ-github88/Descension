/**
 * Shared attribute profile: the single place that decides how a character's
 * attributes are recorded, derived and edited.
 *
 * Representation (statsModel === STATS_MODEL, "base+earned@1"):
 *   baseStats        point-buy allocation chosen in the wizard (explicit provenance)
 *   levelUpHistory   source of the earned level-up gains (`attributes: ['strength', ...]`)
 *   stats            CURRENT pre-modifier attributes = baseStats + earned gains (+ any
 *                    later manual adjustment). Earned gains are already inside `stats`;
 *                    they are never added a second time.
 *   effective        stats + heritage modifiers + origin (background) modifiers,
 *                    each applied exactly once, here and nowhere else.
 *
 * Legacy records (no baseStats, no marker) have no recorded base. Their values are
 * preserved untouched and play keeps today's arithmetic (stats + heritage). The base
 * is never guessed; `needsCorrection` exposes that an explicit correction is wanted.
 *
 * Consumers (wizard, summary, save payload, roster, view, play, inspection, combat
 * modifiers) must call these helpers instead of composing modifiers themselves.
 */
import { applyRacialModifiers } from '../data/raceData';
import { getBackgroundStatModifiers } from '../data/backgroundData';
import { ABILITY_SCORES } from './pointBuySystem';

export const STATS_MODEL = 'base+earned@1';
export const ATTRIBUTE_IDS = ABILITY_SCORES.map((ability) => ability.id);

const isRecord = (value) => !!value && typeof value === 'object' && !Array.isArray(value);
const num = (value) => (Number.isFinite(Number(value)) ? Number(value) : 0);

const pickAttributes = (source) => {
    const out = {};
    ATTRIBUTE_IDS.forEach((id) => { out[id] = 0; });
    if (isRecord(source)) {
        Object.keys(source).forEach((id) => { if (id in out) out[id] = num(source[id]); });
    }
    return out;
};

/** Heritage (race/subrace) attribute modifiers: { strength: n, ... } (all ids present). */
export const getHeritageModifiers = (race, subrace) => {
    if (!race || !subrace) return pickAttributes({});
    return pickAttributes(applyRacialModifiers({}, race, subrace));
};

/** Origin (background) attribute modifiers: { strength: n, ... } (all ids present). */
export const getOriginModifiers = (background) =>
    pickAttributes(background ? getBackgroundStatModifiers(background) : {});

/** Earned level-up attribute gains recorded in levelUpHistory (old single `attribute` form included). */
export const sumEarnedAttributes = (levelUpHistory) => {
    const earned = pickAttributes({});
    if (!isRecord(levelUpHistory)) return earned;
    Object.values(levelUpHistory).forEach((entry) => {
        if (!isRecord(entry)) return;
        const picks = Array.isArray(entry.attributes) ? entry.attributes : (entry.attribute ? [entry.attribute] : []);
        picks.forEach((id) => { if (id in earned) earned[id] += 1; });
    });
    return earned;
};

/** STATS_MODEL when the record carries explicit base provenance, otherwise null (legacy). */
export const resolveStatsModel = (source) => {
    if (!isRecord(source)) return null;
    if (source.statsModel === STATS_MODEL) return STATS_MODEL;
    return isRecord(source.baseStats) ? STATS_MODEL : null;
};

const looksWizardAuthored = (source) =>
    Array.isArray(source.selectedSkills) || isRecord(source.lore) || !!source.class_spells;

/**
 * Resolve everything the app needs to know about a character's attributes.
 * Pure; never mutates `source`. Accepts a character record or store state.
 */
export const resolveAttributeProfile = (source) => {
    const src = isRecord(source) ? source : {};
    const model = resolveStatsModel(src);
    const explicit = model === STATS_MODEL;
    const current = isRecord(src.stats) ? { ...src.stats } : {};
    const heritage = getHeritageModifiers(src.race, src.subrace);
    const origin = explicit ? getOriginModifiers(src.background) : pickAttributes({});
    const earned = sumEarnedAttributes(src.levelUpHistory);

    // Heritage keeps the historical raceData arithmetic; origin is added once on top.
    const withHeritage = src.race && src.subrace
        ? applyRacialModifiers(current, src.race, src.subrace)
        : { ...current };
    const effective = { ...withHeritage };
    if (explicit) {
        ATTRIBUTE_IDS.forEach((id) => {
            if (effective[id] !== undefined && origin[id]) effective[id] += origin[id];
        });
    }

    const reasons = [];
    let needsCorrection = false;
    let needsReview = false;
    let base = null;
    if (explicit) {
        base = { ...pickAttributes({}), ...pickAttributes(src.baseStats) };
        const drift = ATTRIBUTE_IDS.some((id) => current[id] !== undefined &&
            num(current[id]) !== base[id] + earned[id]);
        if (drift) {
            needsReview = true;
            reasons.push('current attributes differ from base plus recorded level-up gains (manual adjustment or an earlier edit-save)');
        }
    } else if (isRecord(src.stats) && looksWizardAuthored(src)) {
        needsCorrection = true;
        reasons.push('this older record stores attributes without a recorded base; they may already include heritage or origin modifiers');
    }

    return {
        model: explicit ? STATS_MODEL : null,
        explicit,
        base,
        earned,
        current,
        heritage,
        origin,
        effective,
        needsCorrection,
        needsReview,
        reasons
    };
};

/** Effective attributes for play and display (heritage + origin applied once). */
export const getEffectiveAttributes = (source) => resolveAttributeProfile(source).effective;

/**
 * Wizard preview from an explicit base allocation: base + heritage + origin.
 * Uses the same modifier sources as `getEffectiveAttributes`.
 */
export const composeAttributes = (baseStats, race, subrace, background) => {
    const base = isRecord(baseStats) ? baseStats : {};
    const heritage = getHeritageModifiers(race, subrace);
    const origin = getOriginModifiers(background);
    const out = { ...base };
    Object.keys(base).forEach((id) => {
        out[id] = num(base[id]) + (heritage[id] || 0) + (origin[id] || 0);
    });
    return out;
};

/** Plain-language description of an open correction, or null. */
export const describeAttributeCorrection = (profile) => {
    if (!profile || (!profile.needsCorrection && !profile.needsReview)) return null;
    if (profile.needsCorrection) {
        return 'This older record has no recorded base attributes. Its current values are kept as they are. Set the base allocation below to record it explicitly; earned level-up gains are added automatically.';
    }
    return 'Current attributes differ from the recorded base plus level-up gains. They are kept as they are.';
};

const sameAttributes = (a, b) => ATTRIBUTE_IDS.every((id) => num(a?.[id]) === num(b?.[id]));

/**
 * Plan what an edit-save writes into the attribute fields.
 *
 * @param {object|null} existing  the stored character being edited (null = create)
 * @param {object} baseStats      the wizard's base allocation at save time
 * @param {object|null} loaded    { status: 'explicit'|'legacy', base } captured when the edit loaded
 * @returns {object} patch for { stats, baseStats, statsModel }; `{}` leaves a legacy record untouched
 */
export const planAttributeSave = (existing, baseStats, loaded = null) => {
    const nextBase = { ...baseStats };
    if (!existing) {
        return { stats: { ...nextBase }, baseStats: { ...nextBase }, statsModel: STATS_MODEL };
    }
    const existingModel = resolveStatsModel(existing);
    const oldBase = existingModel === STATS_MODEL
        ? { ...pickAttributes(existing.baseStats) }
        : (loaded?.base || existing.stats || {});
    if (existingModel === STATS_MODEL) {
        // Apply only the wizard's change to the base; earned gains and adjustments stay inside stats.
        const stats = { ...(isRecord(existing.stats) ? existing.stats : {}) };
        const earned = sumEarnedAttributes(existing.levelUpHistory);
        ATTRIBUTE_IDS.forEach((id) => {
            const delta = num(nextBase[id]) - num(oldBase[id]);
            if (stats[id] === undefined) stats[id] = num(oldBase[id]) + earned[id];
            if (delta !== 0) stats[id] = num(stats[id]) + delta;
        });
        return { stats, baseStats: { ...nextBase }, statsModel: STATS_MODEL };
    }
    // Legacy record: untouched attributes stay exactly as stored (no inference, no rewrite).
    if (sameAttributes(nextBase, oldBase)) return {};
    // Explicit correction: the user supplied the base; earned gains are added once from history.
    const earned = sumEarnedAttributes(existing.levelUpHistory);
    const stats = {};
    ATTRIBUTE_IDS.forEach((id) => { stats[id] = num(nextBase[id]) + earned[id]; });
    return { stats: { ...(isRecord(existing.stats) ? existing.stats : {}), ...stats }, baseStats: { ...nextBase }, statsModel: STATS_MODEL };
};

/** True when a legacy edit has not changed the loaded attributes (stat validation is waived). */
export const isLegacyAttributesUntouched = (loaded, baseStats) =>
    !!loaded && loaded.status === 'legacy' && sameAttributes(baseStats, loaded.base);
