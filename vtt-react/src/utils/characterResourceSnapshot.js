import { getEffectiveAttributes } from './attributeProfile';
import { calculateDerivedStats, calculateEquipmentBonuses } from './characterUtils';

const DEFAULT_STATS = {
    strength: 10, agility: 10, constitution: 10,
    intelligence: 10, spirit: 10, charisma: 10
};

const STAT_MAPPING = {
    str: 'strength', con: 'constitution', agi: 'agility',
    int: 'intelligence', spir: 'spirit', cha: 'charisma'
};

const finite = (value, fallback = 0) => (Number.isFinite(Number(value)) ? Number(value) : fallback);

// A saved current value of 0 is real; null/undefined/'' mean "not recorded"
// and must use the effective maximum rather than becoming an empty pool.
const savedCurrent = (value, fallback) => {
    if (value === null || value === undefined || value === '') return fallback;
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
};

/**
 * Sum the explicit health/mana choices recorded by the level-up modal.
 * Attribute gains are already part of `stats`; these two fields are not
 * derived from attributes and must be applied exactly once.
 */
export const getLevelUpResourceBonuses = (levelUpHistory = {}) => {
    let health = 0;
    let mana = 0;
    if (!levelUpHistory || typeof levelUpHistory !== 'object') return { health, mana };
    Object.values(levelUpHistory).forEach(entry => {
        if (!entry || typeof entry !== 'object') return;
        health += finite(entry.healthIncrease, 0);
        mana += finite(entry.manaIncrease, 0);
    });
    return { health, mana };
};

/**
 * Shared source of truth for a character's effective attributes and maximum
 * health/mana. Roster cards, the store's persisted resources and the character
 * view must all go through this function instead of recomposing modifiers.
 *
 * Attribute provenance is passed through unchanged, including ambiguous legacy records.
 */
export const buildCharacterResourceSnapshot = (character = {}) => {
    const stats = character.stats || character.baseStats || DEFAULT_STATS;
    const effectiveStats = getEffectiveAttributes({ ...character, stats });
    const equipmentBonuses = calculateEquipmentBonuses(character.equipment || {});

    const totalStats = { ...effectiveStats };
    Object.entries(STAT_MAPPING).forEach(([shortName, fullName]) => {
        if (equipmentBonuses[shortName]) {
            totalStats[fullName] = finite(totalStats[fullName]) + equipmentBonuses[shortName];
        }
    });

    const derivedStats = calculateDerivedStats(
        totalStats,
        equipmentBonuses,
        {},
        character.inventory?.encumbranceState || character.encumbranceState || 'normal',
        character.exhaustionLevel || 0,
        character.health || null,
        character.race,
        character.subrace,
        {},
        character.ancestry
    );

    const levelUpBonuses = getLevelUpResourceBonuses(character.levelUpHistory);
    const maxHealth = Math.round(finite(derivedStats.maxHealth) + levelUpBonuses.health);
    const maxMana = Math.round(finite(derivedStats.maxMana) + levelUpBonuses.mana);
    const storedHealth = character.health || character.resources?.health || {};
    const storedMana = character.mana || character.resources?.mana || {};

    return {
        effectiveStats,
        totalStats,
        equipmentBonuses,
        derivedStats,
        health: {
            current: Math.min(savedCurrent(storedHealth.current, maxHealth), maxHealth),
            max: maxHealth
        },
        mana: {
            current: Math.min(savedCurrent(storedMana.current, maxMana), maxMana),
            max: maxMana
        }
    };
};
