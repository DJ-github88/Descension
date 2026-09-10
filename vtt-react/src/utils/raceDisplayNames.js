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

export default normalizeRaceDisplayName;
