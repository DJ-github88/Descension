/**
 * Race Data Module
 *
 * Thin aggregator that imports all playable races from individual module files.
 * Each race lives in its own file under ./races/ for maintainability.
 *
 * Exports the same API as before:
 *   - RACE_DATA object (all races keyed by id)
 *   - Utility functions: getRaceList, getSubraceList, getRaceData, etc.
 */

import { ABILITY_SCORES } from '../utils/pointBuySystem';

import { myrathil } from './races/myrathil';
import { mimir } from './races/mimir';
import { briaran } from './races/briaran';
import { groven } from './races/groven';
import { emberth } from './races/emberth';
import { vreken } from './races/vreken';
import { morthel } from './races/morthel';
import { astril } from './races/astril';
import { fexrick } from './races/fexrick';
import { human } from './races/human';

export const RACE_DATA = {
    myrathil,
    mimir,
    briaran,
    groven,
    emberth,
    vreken,
    morthel,
    astril,
    fexrick,
    human
};

export const getRaceList = () => {
    return Object.values(RACE_DATA).map(race => ({
        id: race.id,
        name: race.name,
        description: race.description,
        cardFlavor: race.cardFlavor
    }));
};

export const getSubraceList = (raceId) => {
    const race = RACE_DATA[raceId];
    if (!race) return [];

    return Object.values(race.subraces).map(subrace => ({
        id: subrace.id,
        name: subrace.name,
        description: subrace.description
    }));
};

export const getRaceData = (raceId) => {
    return RACE_DATA[raceId] || null;
};

export const getSubraceData = (raceId, subraceId) => {
    const race = RACE_DATA[raceId];
    if (!race) return null;

    const subrace = Object.values(race.subraces).find(sr => sr.id === subraceId);
    return subrace || null;
};

export const getFullRaceData = (raceId, subraceId) => {
    const race = getRaceData(raceId);
    const subrace = getSubraceData(raceId, subraceId);

    if (!race || !subrace) return null;

    return {
        race,
        subrace,
        combinedTraits: {
            ...race.baseTraits,
            languages: subrace.languages || race.baseTraits.languages,
            speed: subrace.speed || race.baseTraits.baseSpeed,
            statModifiers: subrace.statModifiers,
            traits: subrace.traits,
            baseStats: subrace.baseStats || {},
            savingThrowModifiers: subrace.savingThrowModifiers || {}
        }
    };
};

/**
 * Get racial base stats for a race/subrace combination
 * Returns base values for armor, speed, hp, mana, ap, passive perception, etc.
 */
export const getRacialBaseStats = (raceId, subraceId) => {
    const raceData = getFullRaceData(raceId, subraceId);
    if (!raceData) {
        return {
            armor: 0,
            speed: 30,
            hp: 25,
            mana: 25,
            ap: 3,
            passivePerception: 10,
            swimSpeed: 0,
            climbSpeed: 0,
            visionRange: 60,
            darkvision: 0,
            initiative: 0
        };
    }

    const subrace = raceData.subrace;
    const baseStats = subrace.baseStats || {};

    return {
        armor: baseStats.armor !== undefined ? baseStats.armor : 0,
        speed: subrace.speed || raceData.race.baseTraits.baseSpeed || 30,
        hp: baseStats.hp !== undefined ? baseStats.hp : 25,
        mana: baseStats.mana !== undefined ? baseStats.mana : 15,
        ap: baseStats.ap !== undefined ? baseStats.ap : 3,
        passivePerception: baseStats.passivePerception !== undefined ? baseStats.passivePerception : 10,
        swimSpeed: baseStats.swimSpeed !== undefined ? baseStats.swimSpeed : 0,
        climbSpeed: baseStats.climbSpeed !== undefined ? baseStats.climbSpeed : 0,
        visionRange: baseStats.visionRange !== undefined ? baseStats.visionRange : 60,
        darkvision: baseStats.darkvision !== undefined ? baseStats.darkvision : 0,
        initiative: baseStats.initiative !== undefined ? baseStats.initiative : 0
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
    const modifiers = raceData.combinedTraits.statModifiers;

    ABILITY_SCORES.forEach(ability => {
        if (modifiedStats[ability.id] === undefined) {
            modifiedStats[ability.id] = 0;
        }
    });

    Object.keys(modifiers).forEach(stat => {
        if (modifiedStats[stat] !== undefined) {
            modifiedStats[stat] += modifiers[stat];
        }
    });

    return modifiedStats;
};