/**
 * Race display-name normalization for the Nethien naming revision.
 *
 * Characters saved before the revision (localStorage, IndexedDB, party store,
 * multiplayer presence payloads) still carry legacy display names like
 * "Grave Neth" or "Hallowed Neth" in raceDisplayName. Normalize at display /
 * hydration time so old saves and remote peers render the current canon
 * without mutating stored data.
 *
 * Canon: Nethien (the people), with three bloodlines:
 *   Nethien (high) · Veldun (spirit-conduits) · Withered (the severed)
 */

const LEGACY_RACE_DISPLAY_MAP = {
    // Race-level legacy names
    neth: 'Nethien',
    'pale neth': 'Nethien',
    'pale nethien': 'Nethien',
    // High bloodline (once High Neth / Velun / interim High Nethien)
    'high neth': 'Nethien',
    'velun neth': 'Nethien',
    'high nethien': 'Nethien',
    'velun nethien': 'Nethien',
    // Spirit-conduit bloodline (once Hallowed / Kessen / interim Vessel, Veilien)
    'hallowed neth': 'Veldun',
    'kessen neth': 'Veldun',
    'vessel nethien': 'Veldun',
    veilien: 'Veldun',
    // Severed bloodline (once Grave / Drun / interim Graveworn, Dreined)
    'grave neth': 'Withered',
    'drun neth': 'Withered',
    'graveworn nethien': 'Withered',
    dreined: 'Withered'
};

/**
 * Convert a legacy race/subrace display name to its current canon form.
 * Unknown or already-current names pass through unchanged.
 *
 * @param {string} name - Display name such as "Hallowed Neth", "Hallowed Neth (Neth)"
 * @returns {string} Canonical display name
 */
export function normalizeRaceDisplayName(name) {
    if (!name || typeof name !== 'string') return name;

    const trimmed = name.trim();
    const fullKey = trimmed.toLowerCase();
    if (LEGACY_RACE_DISPLAY_MAP[fullKey]) return LEGACY_RACE_DISPLAY_MAP[fullKey];

    const stripped = trimmed.replace(/\s*\([^)]*\)\s*$/, '').trim();
    const strippedKey = stripped.toLowerCase();
    if (LEGACY_RACE_DISPLAY_MAP[strippedKey]) return LEGACY_RACE_DISPLAY_MAP[strippedKey];

    return name;
}

/**
 * Bloodline labels for the "of the ..." identity line. Human subraces carry
 * only the bloodline name in race data, so the species is appended;
 * Nethien bloodlines read "<bloodline> Nethien" so the people is always clear.
 */
const BLOODLINE_HERITAGE_LABELS = {
    // Human
    thalren: 'Thalren (Human)',
    skald: 'Skald (Human)',
    tessen: 'Tessen (Human)',
    merryn: 'Merryn (Human)',
    ordan: 'Ordan (Human)',
    // Nethien
    nethien: 'Nethien',
    veldun: 'Veldun Nethien',
    withered: 'Withered Nethien'
};

function stripParentheticalSuffixes(name) {
    let stripped = name.trim();
    let previous;
    do {
        previous = stripped;
        stripped = stripped.replace(/\s*\([^)]*\)\s*$/, '').trim();
    } while (stripped && stripped !== previous);
    return stripped || name.trim();
}

/**
 * Heritage label for the "of the ..." identity line, e.g.
 * "Thalren (Frostwood Reach)" -> "Thalren (Human)",
 * "Withered" -> "Withered Nethien",
 * "Stargazer Astril (Astril)" -> "Stargazer Astril".
 *
 * Legacy/regional suffixes are stripped and legacy bloodline names normalize
 * to current canon, so old saves render correctly without mutating stored data.
 */
export function getRaceHeritageLabel(name) {
    if (!name || typeof name !== 'string') return name;

    const stripped = stripParentheticalSuffixes(name);
    const normalized = normalizeRaceDisplayName(stripped);
    return BLOODLINE_HERITAGE_LABELS[String(normalized).toLowerCase()] || normalized;
}

export default normalizeRaceDisplayName;
