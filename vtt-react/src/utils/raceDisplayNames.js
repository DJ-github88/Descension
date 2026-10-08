/**
 * Race display-name normalization for the heritage naming revision (2026-10-07).
 *
 * Characters saved before the revision (localStorage, IndexedDB, party store,
 * multiplayer presence payloads) still carry legacy display names like
 * "Thalren", "Hallowed Neth" or "Withered" in raceDisplayName. Normalize at
 * display / hydration time so old saves and remote peers render the current
 * canon without mutating stored data.
 *
 * Current canon subraces:
 *   Human: Tallyn · Skald · Tessic · Merryn · Ordu
 *   Myrathil: Corali · Nereid · Ondine
 *   Astril: Lumian · Kordak
 *   Fex: Brasskin · Alchemite
 *   Florae: Oaken · Briaren
 *   Groven: Morgh · Amordjin
 *   Mimir: Arch Mimir · Broken Mimir
 *   Athien: Nethien · Weft · Riven
 *   Solari: Korr · Anhur
 *   Mycellan: Bedel · Cromyx
 */

const LEGACY_RACE_DISPLAY_MAP = {
    // Race-level legacy names
    neth: 'Athien',
    'pale neth': 'Athien',
    'pale nethien': 'Athien',
    vreken: 'Mycellan',
    fexric: 'Fex',
    fexrick: 'Fex',
    // Human bloodlines (once Thalren / Tessen / Ordan)
    thalren: 'Tallyn',
    tessen: 'Tessic',
    ordan: 'Ordu',
    // Myrathil (once Shoreling / Deepling / Riverling)
    shoreling: 'Corali',
    deepling: 'Nereid',
    riverling: 'Ondine',
    // Astril (once Stargazer Astril / Brutish Astril)
    stargazer: 'Lumian',
    'stargazer astril': 'Lumian',
    brutish: 'Kordak',
    'brutish astril': 'Kordak',
    // Fex (once Clockwork Fexric / Caustic Fexric)
    'clockwork fexric': 'Brasskin',
    clockwork: 'Brasskin',
    'caustic fexric': 'Alchemite',
    caustic: 'Alchemite',
    // Florae (once Viridian / Oken)
    viridian: 'Briaren',
    oken: 'Oaken',
    // Groven (once Ithran)
    ithran: 'Amordjin',
    // Solari (once Hollow-Solari / Waste-Solari)
    'hollow-solari': 'Korr',
    'hollow solari': 'Korr',
    sonn: 'Korr',
    'waste-solari': 'Anhur',
    'waste solari': 'Anhur',
    ragnohl: 'Anhur',
    // Mycellan (once Clean / Marked)
    clean: 'Bedel',
    'clean vreken': 'Bedel',
    'clean mycellan': 'Bedel',
    marked: 'Cromyx',
    'marked vreken': 'Cromyx',
    'marked mycellan': 'Cromyx',
    // Athien high bloodline (once High Neth / Velun / interim High Nethien).
    // Bare "Nethien" is current canon (the high bloodline), so it passes through.
    'nethien (nethien)': 'Nethien',
    'nethien (neth)': 'Nethien',
    'high neth': 'Nethien',
    'velun neth': 'Nethien',
    'high nethien': 'Nethien',
    'velun nethien': 'Nethien',
    // Weft bloodline (once Hallowed / Kessen / Veldun / interim Vessel, Veilien)
    'hallowed neth': 'Weft',
    'kessen neth': 'Weft',
    'vessel nethien': 'Weft',
    veilien: 'Weft',
    veldun: 'Weft',
    // Riven bloodline (once Grave / Drun / Withered / interim Graveworn, Dreined)
    'grave neth': 'Riven',
    'drun neth': 'Riven',
    'graveworn nethien': 'Riven',
    dreined: 'Riven',
    withered: 'Riven',
    'withered nethien': 'Riven'
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
 * Athien bloodlines read "<bloodline> Athien" so the people is always clear.
 */
const BLOODLINE_HERITAGE_LABELS = {
    // Human
    tallyn: 'Tallyn (Human)',
    skald: 'Skald (Human)',
    tessic: 'Tessic (Human)',
    merryn: 'Merryn (Human)',
    ordu: 'Ordu (Human)',
    // Athien
    nethien: 'Nethien Athien',
    weft: 'Weft Athien',
    riven: 'Riven Athien'
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
 * "Tallyn (Frostwood Reach)" -> "Tallyn (Human)",
 * "Riven" -> "Riven Athien",
 * "Lumian (Astril)" -> "Lumian".
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
