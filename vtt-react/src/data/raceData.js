/**
 * Race Data Module
 *
 * Aggregates canonical playable races from individual module files
 * and integrates custom user-created lineages from useCustomLineageStore.
 *
 * Exports:
 *   - RACE_DATA object (all canonical races keyed by id)
 *   - Utility functions: getRaceList, getSubraceList, getRaceData, getFullRaceData, applyRacialModifiers
 */

import { ABILITY_SCORES } from '../utils/pointBuySystem';
import useCustomLineageStore from '../store/customLineageStore';

import { myrathil } from './races/myrathil';
import { mimir } from './races/mimir';
import { florae } from './races/florae';
import { groven } from './races/groven';
import { solari } from './races/solari';
import { vreken } from './races/vreken';
import { neth } from './races/neth';
import { astril } from './races/astril';
import { fexrick } from './races/fexrick';
import { human } from './races/human';

export const RACE_DATA = {
    myrathil,
    mimir,
    florae,
    groven,
    solari,
    vreken,
    neth,
    astril,
    fexrick,
    human
};

export const getRaceList = () => {
    return Object.values(RACE_DATA).map(race => ({
        id: race.id,
        name: race.name,
        description: race.description,
        cardFlavor: race.cardFlavor,
        isCustom: false
    }));
};

export const getRaceData = (raceId) => {
    if (RACE_DATA[raceId]) {
        return RACE_DATA[raceId];
    }
    try {
        const custom = useCustomLineageStore.getState().getLineage(raceId);
        if (custom) {
            // Adapt custom lineage to standard race data shape
            return {
                ...custom,
                subraces: Array.isArray(custom.subraces)
                    ? custom.subraces.reduce((acc, sr) => {
                          const sId = sr.id || sr.name.toLowerCase().replace(/\s+/g, '_');
                          acc[sId] = {
                              id: sId,
                              name: sr.name,
                              description: sr.description,
                              statModifiers: custom.abilityModifiers || {},
                              baseTraits: custom.baseTraits || {},
                              traits: (sr.perks || []).map(p => ({ name: p, description: p }))
                          };
                          return acc;
                      }, {})
                    : (custom.subraces || {})
            };
        }
    } catch (e) {
        // Fallback
    }
    return null;
};

export const getSubraceList = (raceId) => {
    const race = getRaceData(raceId);
    if (!race || !race.subraces) return [];

    return Object.values(race.subraces).map(subrace => ({
        id: subrace.id,
        name: subrace.name,
        description: subrace.description
    }));
};

export const getSubraceData = (raceId, subraceId) => {
    const race = getRaceData(raceId);
    if (!race || !race.subraces) return null;
    if (!subraceId) return null;

    // Check direct key match (e.g. 'viridian', 'oken')
    if (race.subraces[subraceId]) {
        return race.subraces[subraceId];
    }

    // Check by id or name
    const normalizedTarget = String(subraceId).toLowerCase().trim();
    const subracesList = Object.values(race.subraces);
    
    // Direct id match (e.g. 'viridian_florae')
    const byId = subracesList.find(sr => sr.id && sr.id.toLowerCase() === normalizedTarget);
    if (byId) return byId;

    // Direct name match (e.g. 'Viridian', 'Oken')
    const byName = subracesList.find(sr => sr.name && sr.name.toLowerCase() === normalizedTarget);
    if (byName) return byName;

    // Subrace alias mapping (e.g. oken_florae <-> florae_unified / oken)
    if ((normalizedTarget === 'oken_florae' || normalizedTarget === 'florae_unified') && race.subraces.oken) {
        return race.subraces.oken;
    }

    // Prefix/fuzzy match by id (e.g. 'viridian' matches 'viridian_florae')
    const byPrefix = subracesList.find(sr => sr.id && (sr.id.toLowerCase().startsWith(normalizedTarget) || normalizedTarget.startsWith(sr.id.toLowerCase())));
    if (byPrefix) return byPrefix;

    // Name prefix/containment match (e.g. 'oken_florae' starts with 'oken', matching 'Oken')
    const byNameFuzzy = subracesList.find(sr => {
        const srName = (sr.name || '').toLowerCase();
        return srName && (normalizedTarget.startsWith(srName) || normalizedTarget.includes(srName));
    });
    if (byNameFuzzy) return byNameFuzzy;

    return null;
};

export const getFullRaceData = (raceId, subraceId) => {
    const race = getRaceData(raceId);
    if (!race) return null;

    const subrace = (subraceId ? getSubraceData(raceId, subraceId) : null) || 
        (race.subraces ? Object.values(race.subraces)[0] : null) || {
            id: 'default',
            name: race.name,
            description: race.description,
            statModifiers: race.abilityModifiers || {},
            baseTraits: race.baseTraits || {}
        };

    // Combine traits from base race (sharedTraits, racialPassives, basePassives) and subrace traits
    const baseRaceTraits = [
        ...(race.sharedTraits || []),
        ...(race.racialPassives || []),
        ...(race.basePassives || [])
    ];
    const subTraits = Array.isArray(subrace.traits) 
        ? subrace.traits 
        : Object.values(subrace.traits || {});

    // Deduplicate by trait ID (or name if no ID)
    const traitMap = new Map();
    baseRaceTraits.forEach(t => {
        if (t) {
            const key = t.id || t.name;
            if (key) traitMap.set(key, t);
        }
    });
    subTraits.forEach(t => {
        if (t) {
            const key = t.id || t.name;
            if (key) traitMap.set(key, t);
        }
    });
    const combinedTraitsList = Array.from(traitMap.values());

    // Merge stat modifiers: start with race.abilityModifiers, then apply subrace.statModifiers
    const mergedStatModifiers = {
        ...(race.abilityModifiers || {}),
        ...(subrace.statModifiers || {})
    };

    // Merge saving throw modifiers
    const mergedSavingThrows = {
        advantage: [
            ...(race.baseTraits?.savingThrowModifiers?.advantage || []),
            ...(subrace.savingThrowModifiers?.advantage || [])
        ],
        disadvantage: [
            ...(race.baseTraits?.savingThrowModifiers?.disadvantage || []),
            ...(subrace.savingThrowModifiers?.disadvantage || [])
        ]
    };

    // Determine speed (subrace speed overrides baseSpeed, default 30)
    let baseSpeed = subrace.speed || race.baseTraits?.baseSpeed || 30;

    return {
        race,
        subrace,
        combinedTraits: {
            ...(race.baseTraits || {}),
            ...(subrace.baseTraits || {}),
            languages: subrace.languages || race.baseTraits?.languages || ['Common'],
            speed: baseSpeed,
            statModifiers: mergedStatModifiers,
            traits: combinedTraitsList,
            baseStats: subrace.baseStats || {},
            savingThrowModifiers: mergedSavingThrows
        }
    };
};

/**
 * Get racial base stats for a race/subrace combination
 * Returns base values for speed, hp, mana, ap, passive perception, etc.
 */
export const getRacialBaseStats = (raceId, subraceId) => {
    const raceData = getFullRaceData(raceId, subraceId);
    if (!raceData) {
        return {
            speed: 30,
            hp: 25,
            mana: 25,
            ap: 3,
            passivePerception: 10,
            swimSpeed: 0,
            climbSpeed: 0,
            visionRange: 60,
            darkvision: 0,
            initiative: 0,
            durability: 0,
            damageReduction: 0
        };
    }

    const subrace = raceData.subrace;
    const baseStats = subrace.baseStats || {};

    return {
        speed: subrace.speed || raceData.race.baseTraits?.baseSpeed || 30,
        hp: baseStats.hp !== undefined ? baseStats.hp : 25,
        mana: baseStats.mana !== undefined ? baseStats.mana : 15,
        ap: baseStats.ap !== undefined ? baseStats.ap : 3,
        passivePerception: baseStats.passivePerception !== undefined ? baseStats.passivePerception : 10,
        swimSpeed: baseStats.swimSpeed !== undefined ? baseStats.swimSpeed : 0,
        climbSpeed: baseStats.climbSpeed !== undefined ? baseStats.climbSpeed : 0,
        visionRange: baseStats.visionRange !== undefined ? baseStats.visionRange : 60,
        darkvision: baseStats.darkvision !== undefined ? baseStats.darkvision : 0,
        initiative: baseStats.initiative !== undefined ? baseStats.initiative : 0,
        durability: baseStats.durability !== undefined ? baseStats.durability : 0,
        damageReduction: baseStats.damageReduction !== undefined ? baseStats.damageReduction : 0
    };
};

/**
 * Get saving throw modifiers (advantages/disadvantages) for a race/subrace
 */
export const getRacialSavingThrowModifiers = (raceId, subraceId) => {
    const raceData = getFullRaceData(raceId, subraceId);
    if (!raceData) return {};
    
    return raceData.combinedTraits.savingThrowModifiers || {};
};

export const applyRacialModifiers = (baseStats, raceId, subraceId) => {
    const raceData = getFullRaceData(raceId, subraceId);
    if (!raceData) return baseStats;

    const modifiedStats = { ...baseStats };
    const modifiers = raceData.combinedTraits.statModifiers || {};

    ABILITY_SCORES.forEach(ability => {
        if (modifiedStats[ability.id] === undefined) {
            modifiedStats[ability.id] = 0;
        }
    });

    Object.keys(modifiers).forEach(stat => {
        if (modifiedStats[stat] !== undefined) {
            modifiedStats[stat] += (modifiers[stat] || 0);
        }
    });

    return modifiedStats;
};