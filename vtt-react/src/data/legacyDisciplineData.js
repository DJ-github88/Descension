/**
 * Legacy Discipline Data — backward-compatibility shim
 *
 * The "disciplines" (mystic, zealot, trickster, harrow, arcanist, hexer,
 * reaver, mercenary, sentinel) were a character-creation axis that was cut.
 * Modern characters use `backgroundData.js` (BACKGROUND_DATA) instead, and the
 * `path` field is no longer assigned during creation.
 *
 * This module exists ONLY to keep save-file continuity for characters created
 * before the cut: it resolves display names, stat modifiers, and point-buy
 * bonuses for the old ids stored on legacy Firebase save documents. It is
 * intentionally minimal — the cut disciplines' abilities/equipment/sub-paths
 * are gone and are not coming back.
 *
 * Function names are preserved (getEnhancedPathData / getCustomBackgroundData /
 * getCustomBackgroundStartingPoints / CUSTOM_BACKGROUNDS) so legacy import
 * sites keep working.
 */

const LEGACY_DISCIPLINES = {
    mystic: {
        name: 'Mystic',
        statModifiers: { intelligence: 2, spirit: 1, charisma: -1 },
        startingPoints: 2
    },

    trickster: {
        name: 'Trickster',
        statModifiers: { agility: 2, intelligence: 1, spirit: -1 },
        startingPoints: 1
    },
    harrow: {
        name: 'Harrow',
        statModifiers: { constitution: 2, spirit: 1, charisma: -1 },
        startingPoints: 0
    },
    arcanist: {
        name: 'Arcanist',
        statModifiers: { intelligence: 2, spirit: 1, constitution: -1 },
        startingPoints: 3
    },
    hexer: {
        name: 'Hexer',
        statModifiers: { intelligence: 1, charisma: 2, spirit: -1 },
        startingPoints: 2
    },
    reaver: {
        name: 'Reaver',
        statModifiers: { strength: 2, constitution: 2, charisma: -1 },
        startingPoints: 0
    },
    mercenary: {
        name: 'Mercenary',
        statModifiers: { strength: 1, agility: 1, intelligence: 1, charisma: -1 },
        startingPoints: 1
    },
    sentinel: {
        name: 'Sentinel',
        statModifiers: { constitution: 1, spirit: 2, agility: -1 },
        startingPoints: 1
    }
};

export const CUSTOM_BACKGROUNDS = LEGACY_DISCIPLINES;

export const getCustomBackgroundData = (backgroundId) => {
    if (!backgroundId) return null;
    const entry = LEGACY_DISCIPLINES[backgroundId];
    return entry ? { id: backgroundId, ...entry } : null;
};

export const getEnhancedPathData = (pathId) => {
    if (!pathId) return null;
    const entry = LEGACY_DISCIPLINES[pathId];
    return entry ? { id: pathId, ...entry } : null;
};

export const getCustomBackgroundStartingPoints = (backgroundId) => {
    const entry = LEGACY_DISCIPLINES[backgroundId];
    return entry ? entry.startingPoints : 0;
};
