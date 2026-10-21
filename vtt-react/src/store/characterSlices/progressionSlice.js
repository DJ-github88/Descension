import { calculateEquipmentBonuses, calculateDerivedStats } from '../../utils/characterUtils';
import { applyRacialModifiers } from '../../data/raceData';
import { getEncumbranceState } from '../characterHelpers';
import { ALL_CLASSES_DATA } from '../../data/classes';
import { ALL_CLASS_SPELLS } from '../../data/classSpellGenerator';
import { checkLevelUp, getXPForLevel } from '../../utils/experienceUtils';
import { TALENT_TREES } from '../../data/talentTreeData';
import { pruneAllocationForLevel } from '../../data/classes/chaosWeaverRules';
import { pruneGamblerTalents, GAMBLER_PROJECTED_SPELLS_BY_ID } from '../../data/classes/gamblerData';
import {
    pruneFateWeaverTalents, FATE_WEAVER_PROJECTED_SPELLS_BY_ID,
    FATE_WEAVER_OPTIONAL_RECORDS, FATE_WEAVER_SPELL_POOLS
} from '../../data/classes/fateWeaverData';
import useSpellbookStore from '../spellbookStore';
import { loadLibraryFromStorage, saveLibraryToStorage } from '../../components/spellcrafting-wizard/core/utils/libraryManager';

// Classes may declare that starter/level-up spells are never randomly
// assigned or topped up (e.g. Chaos Weaver's one explicit optional pick).
const forbidsAutomaticSpellAssignment = (classData) => {
    const policy = classData?.progression?.policy;
    return Boolean(policy && (policy.autoTopUpOnLoad === false || policy.randomizeStartingSpells === false));
};

const classTalentNodes = (className) =>
    Object.values(TALENT_TREES[className] || {}).flat();

const fateOptionalById = Object.fromEntries(
    FATE_WEAVER_OPTIONAL_RECORDS.map(record => [record.id, record])
);

// Reconcile a stored flat talent allocation after a level reduction or class
// switch. Policy classes (Chaos Weaver, Gambler, Fate Weaver) have level-gated
// authored caps; legacy classes keep their previous behaviour.
export const pruneTalentsForChange = (talents, { previousClass, nextClass, level }) => {
    const current = talents && typeof talents === 'object' ? { ...talents } : {};
    if (previousClass && nextClass && previousClass !== nextClass) {
        classTalentNodes(previousClass).forEach(node => { delete current[node.id]; });
    }
    if (ALL_CLASSES_DATA[nextClass]?.progression?.policy && Number.isInteger(level)) {
        if (nextClass === 'Gambler') return pruneGamblerTalents(current, level);
        if (nextClass === 'Fate Weaver') return pruneFateWeaverTalents(current, level);
        return pruneAllocationForLevel({ ranks: current, order: [] }, level).allocation.ranks;
    }
    return current;
};

export const derivedTalentGrantIds = (talents, className) =>
    classTalentNodes(className)
        .filter(node => (node.grantId || node.passiveSpellId) && (talents?.[node.id] || 0) > 0)
        .map(node => node.grantId || node.passiveSpellId);

export const removedTalentGrantIds = (before, after, className) => {
    const remaining = new Set(derivedTalentGrantIds(after, className));
    return derivedTalentGrantIds(before, className).filter(id => !remaining.has(id));
};

export const createProgressionSlice = (set, get) => ({
    // Level-up modal state
    showLevelUpModal: false,
    pendingLevelUpInfo: null, // { newLevel, oldLevel }
    levelUpHistory: {}, // { level: { statChoice, spellId?, attribute?, timestamp } }

    // Initialize character
    initializeCharacter: () => {
        const state = get();

        // Auto-assign spells if character has a class and level but missing spells
        if (state.characterClass && state.level && state.level > 1) {
            const knownSpells = state.class_spells?.known_spells || [];
            const expectedSpellCount = 3 + (state.level - 1); // 3 level 1 + 1 per level after

            if (knownSpells.length < expectedSpellCount) {
                get().assignSpellsForLevel(state.level, state.characterClass);
            }
        }

        // Update race display name if race and subrace are set, or if the name is missing
        if (state.race && state.subrace && !state.raceDisplayName) {
            get().updateRaceDisplayName();
        }

        const equipmentBonuses = calculateEquipmentBonuses(state.equipment);
        // Apply racial modifiers to get effective stats for calculations
        const effectiveStats = state.race && state.subrace
            ? applyRacialModifiers(state.stats, state.race, state.subrace)
            : state.stats;

        // Apply equipment bonuses to stats before calculating derived stats
        const totalStats = { ...effectiveStats };
        const statMapping = {
            str: 'strength',
            con: 'constitution',
            agi: 'agility',
            int: 'intelligence',
            spir: 'spirit',
            cha: 'charisma'
        };

        Object.entries(statMapping).forEach(([shortName, fullName]) => {
            if (equipmentBonuses[shortName]) {
                totalStats[fullName] = (totalStats[fullName] || 0) + equipmentBonuses[shortName];
            }
        });

        const encumbranceState = getEncumbranceState();
        const derivedStats = calculateDerivedStats(totalStats, equipmentBonuses, {}, encumbranceState, state.exhaustionLevel || 0, state.health, state.race, state.subrace, undefined, state.ancestry);

        // Calculate total level-up bonuses from history
        let totalHealthBonus = 0;
        let totalManaBonus = 0;

        if (state.levelUpHistory) {
            Object.values(state.levelUpHistory).forEach(entry => {
                totalHealthBonus += entry.healthIncrease || 0;
                totalManaBonus += entry.manaIncrease || 0;
            });
        }

        // Update health and mana max values based on derived stats + level-up bonuses
        const newMaxHealth = Math.round(derivedStats.maxHealth) + totalHealthBonus;
        const newMaxMana = Math.round(derivedStats.maxMana) + totalManaBonus;

        const newHealth = {
            current: Math.min(state.health.current, newMaxHealth),
            max: newMaxHealth
        };

        const newMana = {
            current: Math.min(state.mana.current, newMaxMana),
            max: newMaxMana
        };



        set({
            equipmentBonuses,
            derivedStats,
            health: newHealth,
            mana: newMana
        });
    },

    // Ensure starter and progression spells are assigned for the given class and level
    // Rule: 3 class spells at level 1, plus +1 spell for each level beyond level 1
    ensureClassStarterSpells: async (className) => {
        const state = get();
        try {
            if (!className || className === 'Class') return false;
            if (forbidsAutomaticSpellAssignment(ALL_CLASSES_DATA[className])) return false;
            const charLevel = Math.max(1, state.level || 1);
            const targetSpellCount = 3 + Math.max(0, charLevel - 1);
            const known = state.class_spells?.known_spells || [];

            // If already have enough spells, no need to auto-assign
            if (known.length >= targetSpellCount) {
                return false;
            }

            const isUnwanted = (s) => {
                const id = s.id?.toLowerCase() || '';
                const name = s.name?.toLowerCase() || '';
                return (
                    id.startsWith('universal_') ||
                    name === 'attack (melee or ranged)' ||
                    id.includes('cast_minor') ||
                    id.includes('cast_major') ||
                    name.includes('cast minor') ||
                    name.includes('cast major')
                );
            };

            const available = (ALL_CLASS_SPELLS[className] || []).filter(s => !isUnwanted(s));
            let eligibleSpells = available.filter(s => (s.level || 1) <= charLevel);

            // Fallback to ALL_CLASSES_DATA if ALL_CLASS_SPELLS is empty
            if (eligibleSpells.length === 0) {
                const classData = ALL_CLASSES_DATA[className];
                const rawList = classData?.spells || classData?.exampleSpells || [];
                eligibleSpells = rawList.filter(s => !isUnwanted(s) && (s.level || 1) <= charLevel);
            }

            if (eligibleSpells.length === 0) {
                console.warn(`No eligible class spells found for ${className} at level ${charLevel}`);
                return false;
            }

            const knownSet = new Set(known);
            const unlearnedEligible = eligibleSpells.filter(s => !knownSet.has(s.id));

            if (unlearnedEligible.length === 0) {
                return false;
            }

            const needed = targetSpellCount - known.length;
            const level1Unlearned = unlearnedEligible.filter(s => (s.level || 1) === 1);
            const higherLevelUnlearned = unlearnedEligible.filter(s => (s.level || 1) > 1);

            const selected = [];

            // 1. Ensure at least 3 Level 1 spells if possible
            const knownLevel1Count = known.filter(id => {
                const sp = eligibleSpells.find(s => s.id === id);
                return sp && (sp.level || 1) === 1;
            }).length;

            const neededLevel1 = Math.max(0, 3 - knownLevel1Count);
            if (neededLevel1 > 0 && level1Unlearned.length > 0) {
                const shuffledL1 = [...level1Unlearned].sort(() => Math.random() - 0.5);
                selected.push(...shuffledL1.slice(0, Math.min(neededLevel1, needed)));
            }

            // 2. Fill remaining needed spells with higher level spells up to character level
            const remainingNeeded = needed - selected.length;
            if (remainingNeeded > 0) {
                const selectedSet = new Set(selected.map(s => s.id));
                const remainingPool = [...higherLevelUnlearned, ...level1Unlearned].filter(s => !selectedSet.has(s.id));
                // Sort by level descending so higher level characters get level-appropriate spells
                const sortedPool = remainingPool.sort((a, b) => (b.level || 1) - (a.level || 1));
                selected.push(...sortedPool.slice(0, remainingNeeded));
            }

            if (selected.length > 0) {
                const newSpellIds = selected.map(s => s.id);
                const updatedKnownSpells = [...known, ...newSpellIds];

                set({
                    class_spells: {
                        ...(state.class_spells || {}),
                        known_spells: updatedKnownSpells
                    }
                });

                if (state.currentCharacterId) {
                    get().updateCharacter(state.currentCharacterId, {
                        class_spells: {
                            ...(state.class_spells || {}),
                            known_spells: updatedKnownSpells
                        }
                    });
                }
                return true;
            }
        } catch (e) {
            console.warn('ensureClassStarterSpells failed:', e);
        }
        return false;
    },

    // Level and experience management with persistence
    updateExperience: (newExperience) => {
        set(state => {
            const oldXP = state.experience || 0;
            const experienceGained = newExperience - oldXP;

            // Record character change for persistence
            if (state.currentCharacterId && experienceGained > 0) {
                get().recordCharacterChange(state.currentCharacterId, 'experience_gain', {
                    amount: experienceGained,
                    newTotal: newExperience,
                    timestamp: new Date()
                });
            }

            // Check for level up
            const levelUpInfo = checkLevelUp(oldXP, newExperience);

            if (levelUpInfo.didLevelUp) {

                // Record level up
                if (state.currentCharacterId) {
                    get().recordCharacterChange(state.currentCharacterId, 'level_up', {
                        oldLevel: levelUpInfo.oldLevel,
                        newLevel: levelUpInfo.newLevel,
                        timestamp: new Date()
                    });
                }

                // Trigger level-up modal instead of auto-applying bonuses
                return {
                    experience: newExperience,
                    level: levelUpInfo.newLevel,
                    showLevelUpModal: true,
                    pendingLevelUpInfo: {
                        newLevel: levelUpInfo.newLevel,
                        oldLevel: levelUpInfo.oldLevel
                    }
                };
            }

            return { experience: newExperience };
        });

        get().debouncedSave();
        get().syncWithMultiplayer();
    },

    // Award experience (adds to current XP, can be negative to remove XP)
    awardExperience: (xpAmount) => {
        const state = get();
        const currentXP = state.experience || 0;
        const newXP = Math.max(0, currentXP + xpAmount); // Don't allow negative XP

        get().updateExperience(newXP);
    },

    // Helper function to get spell IDs for a specific level from class data
    getSpellIdsForLevel: (classData, level) => {
        if (!classData) return [];

        // First try spellPools (if class has spellPools structure)
        if (classData.spellPools && classData.spellPools[level]) {
            return classData.spellPools[level];
        }

        // Fallback: filter spells/exampleSpells array for spells of this level
        const spellsArray = classData.spells || classData.exampleSpells || [];
        if (Array.isArray(spellsArray) && spellsArray.length > 0) {
            return spellsArray
                .filter(spell => (spell.level === level || (level === 1 && !spell.level)))
                .map(spell => spell.id)
                .filter(id => id); // Remove any undefined/null IDs
        }

        return [];
    },

    // Helper function to assign spells based on character level
    assignSpellsForLevel: (targetLevel, characterClass) => {
        const state = get();
        if (!characterClass) return;

        // Helper function to get class data by name
        const getClassData = (name) => (ALL_CLASSES_DATA[name] || null);

        // Import class data dynamically
        const classData = getClassData(characterClass);
        if (!classData) return;
        if (forbidsAutomaticSpellAssignment(classData)) return;

        // Try to get spells from ALL_CLASS_SPELLS first (to ensure IDs match)
        let allClassSpells = [];
        try {
            allClassSpells = ALL_CLASS_SPELLS[characterClass] || [];
        } catch (e) {
            console.warn('Could not load ALL_CLASS_SPELLS, using classData directly:', e);
        }

        const currentKnownSpells = state.class_spells?.known_spells || [];
        let spellsToAdd = [];

        // Always ensure 3 level 1 spells
        if (targetLevel >= 1) {
            // Get level 1 spell IDs from class data
            const level1SpellIds = get().getSpellIdsForLevel(classData, 1);

            // If we have ALL_CLASS_SPELLS, filter to only use IDs that exist there
            const validLevel1SpellIds = allClassSpells.length > 0
                ? level1SpellIds.filter(id => allClassSpells.some(s => s.id === id))
                : level1SpellIds;

            const currentLevel1Spells = currentKnownSpells.filter(spellId =>
                validLevel1SpellIds.includes(spellId)
            );

            if (currentLevel1Spells.length < 3) {
                const availableLevel1Spells = validLevel1SpellIds.filter(id =>
                    !currentKnownSpells.includes(id)
                );
                const shuffled = [...availableLevel1Spells].sort(() => Math.random() - 0.5);
                const needed = Math.min(3 - currentLevel1Spells.length, shuffled.length);
                spellsToAdd.push(...shuffled.slice(0, needed));
            }
        }

        // Add 1 spell from each level 2 to targetLevel
        for (let level = 2; level <= targetLevel; level++) {
            // Get spell IDs for this level
            const levelSpellIds = get().getSpellIdsForLevel(classData, level);

            // If we have ALL_CLASS_SPELLS, filter to only use IDs that exist there
            const validLevelSpellIds = allClassSpells.length > 0
                ? levelSpellIds.filter(id => allClassSpells.some(s => s.id === id))
                : levelSpellIds;

            const currentLevelSpells = currentKnownSpells.filter(spellId =>
                validLevelSpellIds.includes(spellId)
            );

            if (currentLevelSpells.length === 0 && validLevelSpellIds.length > 0) {
                // No spells from this level yet, add one randomly
                const availableSpells = validLevelSpellIds.filter(id =>
                    !currentKnownSpells.includes(id)
                );
                if (availableSpells.length > 0) {
                    const randomSpell = availableSpells[Math.floor(Math.random() * availableSpells.length)];
                    spellsToAdd.push(randomSpell);
                }
            }
        }

        // Add the new spells to known_spells
        if (spellsToAdd.length > 0) {
            const updatedKnownSpells = [...currentKnownSpells, ...spellsToAdd];

            set({
                class_spells: {
                    ...state.class_spells,
                    known_spells: updatedKnownSpells
                }
            });

        }
    },

    // Adjust level directly (adds or removes levels)
    adjustLevel: (levelChange) => {
        const state = get();
        const currentLevel = state.level || 1;
        const newLevel = Math.max(1, Math.min(20, currentLevel + levelChange)); // Clamp between 1-20

        if (newLevel === currentLevel) {
            return;
        }

        // If leveling down, reverse bonuses from lost levels
        if (newLevel < currentLevel) {
            for (let level = currentLevel; level > newLevel; level--) {
                get().reverseLevelUpBonus(level);
            }
        }

        // Get the XP required for the new level
        const newXP = getXPForLevel(newLevel);

        // Update both level and XP
        let removedGrantIds = [];
        set(state => {
            const characterClass = state.class || state.characterClass;
            let talents = state.talents || {};
            if (newLevel < currentLevel && characterClass !== 'Fate Weaver') {
                const pruned = pruneTalentsForChange(talents, {
                    previousClass: characterClass,
                    nextClass: characterClass,
                    level: newLevel
                });
                removedGrantIds = removedTalentGrantIds(talents, pruned, characterClass);
                talents = pruned;
            }
            return newLevel < currentLevel && characterClass !== 'Fate Weaver'
                ? { level: newLevel, talents }
                : { level: newLevel };
        });
        if (removedGrantIds.length > 0) {
            get().removeTalentGrantSpells(removedGrantIds);
        }
        if (newLevel < currentLevel) {
            get().reconcileGamblerTalents();
            get().reconcileFateWeaverTalents();
        }

        // Only trigger updateExperience if leveling up (to avoid triggering modal when manually adjusting)
        if (levelChange > 0) {
            get().updateExperience(newXP);
        } else {
            // Just set XP without triggering level-up check
            set({ experience: newXP });
        }

        // Auto-assign spells based on new level (only when leveling UP " leveling down
        // reverts spells via reverseLevelUpBonus, which already handled them above).
        if (levelChange > 0) {
            const characterClass = state.characterClass;
            if (characterClass) {
                get().assignSpellsForLevel(newLevel, characterClass);
            }
        } else {
            // Leveling down: run a final initializeCharacter to recompute HP/mana/AP
            // from the now-pruned levelUpHistory (reverseLevelUpBonus already removed entries).
            get().initializeCharacter();
        }

        // Record character change for persistence
        if (state.currentCharacterId && newLevel !== currentLevel) {
            get().recordCharacterChange(state.currentCharacterId, 'stat_change', {
                stat: 'level',
                value: newLevel,
                previousValue: currentLevel,
                timestamp: new Date()
            });
        }

        // Save and sync character after level adjustment
        get().debouncedSave();
        get().syncWithMultiplayer();
    },

    // Remove derived talent-granted spells that are no longer granted after a
    // level reduction or class switch. Entries still used by another roster
    // character, authored spells, and unrelated library records stay intact.
    removeTalentGrantSpells: (grantIds) => {
        if (!Array.isArray(grantIds) || grantIds.length === 0) return;
        const state = get();
        const stillNeeded = new Set();
        (state.characters || []).forEach(char => {
            if (char.id === state.currentCharacterId) return;
            derivedTalentGrantIds(char.talents || {}, char.class || char.characterClass)
                .forEach(id => stillNeeded.add(id));
        });
        const removable = grantIds.filter(id => !stillNeeded.has(id));
        if (removable.length === 0) return;

        const currentKnown = state.class_spells?.known_spells || [];
        const known = currentKnown.filter(spellId => !removable.includes(spellId));
        if (known.length !== currentKnown.length) {
            set({ class_spells: { ...(state.class_spells || {}), known_spells: known } });
        }

        const nodeByGrantId = Object.fromEntries(
            Object.values(TALENT_TREES).flatMap(specs => Object.values(specs).flat())
                .filter(node => node.grantId || node.passiveSpellId)
                .map(node => [node.grantId || node.passiveSpellId, node.id])
        );
        const spellbook = useSpellbookStore.getState();
        const library = loadLibraryFromStorage();
        let libraryChanged = false;

        removable.forEach(grantId => {
            const nodeId = nodeByGrantId[grantId];
            const spell = (spellbook.spells || []).find(entry => entry.id === grantId);
            if (!spell || spell.source === 'talent' || spell.talentId === nodeId) {
                spellbook.deleteSpell(grantId);
            }
            if (library && Array.isArray(library.spells)) {
                const before = library.spells.length;
                library.spells = library.spells.filter(entry => !(
                    entry.id === grantId &&
                    (entry.source === 'talent' || entry.talentId === nodeId)
                ));
                if (library.spells.length !== before) libraryChanged = true;
            }
        });

        if (libraryChanged) saveLibraryToStorage(library);
    },

    // G1 has canonical ranked passive identities as well as ACTION grants.
    // Reconcile existing derived copies only; never top up a library on load.
    reconcileGamblerTalents: () => {
        const state = get();
        if ((state.class || state.characterClass) !== 'Gambler') return;
        const ranks = pruneGamblerTalents(state.talents || {}, state.level);
        const removed = removedTalentGrantIds(state.talents, ranks, 'Gambler');
        if (JSON.stringify(ranks) !== JSON.stringify(state.talents)) set({ talents: ranks });
        if (removed.length) get().removeTalentGrantSpells(removed);
        const spellbook = useSpellbookStore.getState();
        const library = loadLibraryFromStorage();
        let changed = false;
        classTalentNodes('Gambler').filter(node => node.passiveSpellId && ranks[node.id]).forEach(node => {
            const rank = ranks[node.id];
            const canonical = GAMBLER_PROJECTED_SPELLS_BY_ID[node.passiveSpellId];
            const view = { ...canonical, source: 'talent', talentId: node.id, talentRank: rank,
                maxRanks: 3, description: node.rankValues[rank - 1].text,
                learnedRankValues: node.rankValues[rank - 1].values };
            const existing = (spellbook.spells || []).find(spell => spell.id === node.passiveSpellId);
            if (existing?.source === 'talent') spellbook.updateSpell(view.id, view);
            const index = library?.spells?.findIndex(spell => spell.id === node.passiveSpellId && spell.source === 'talent') ?? -1;
            if (index >= 0) { library.spells[index] = view; changed = true; }
        });
        if (changed) saveLibraryToStorage(library);
    },

    // Fate Weaver has level-gated talent ranks, optional picks and derived
    // passive copies. Reconcile all three without topping up the library.
    reconcileFateWeaverTalents: () => {
        const state = get();
        if ((state.class || state.characterClass) !== 'Fate Weaver') return;
        const level = Math.max(1, Math.min(10, state.level || 1));
        const currentTalents = state.talents || {};
        const ranks = pruneFateWeaverTalents(currentTalents, level);
        const removed = removedTalentGrantIds(currentTalents, ranks, 'Fate Weaver');
        const currentKnown = state.class_spells?.known_spells || [];
        let known = currentKnown.filter(spellId => {
            const optional = fateOptionalById[spellId];
            return !optional || optional.level <= level;
        });
        known = known.filter(spellId => !removed.includes(spellId));

        const historySpellIds = new Set(Object.values(state.levelUpHistory || {})
            .map(entry => entry?.spellId).filter(Boolean));
        const optionalKnown = known.filter(spellId => fateOptionalById[spellId]);
        if (optionalKnown.length > level) {
            const removable = optionalKnown.filter(spellId => !historySpellIds.has(spellId))
                .sort((a, b) => fateOptionalById[b].level - fateOptionalById[a].level);
            const removeCount = optionalKnown.length - level;
            const toRemove = new Set(removable.slice(0, removeCount));
            if (toRemove.size < removeCount) {
                optionalKnown.filter(spellId => !toRemove.has(spellId))
                    .sort((a, b) => fateOptionalById[b].level - fateOptionalById[a].level)
                    .slice(0, removeCount - toRemove.size)
                    .forEach(spellId => toRemove.add(spellId));
            }
            known = known.filter(spellId => !toRemove.has(spellId));
        }

        const updates = {};
        if (JSON.stringify(ranks) !== JSON.stringify(currentTalents)) updates.talents = ranks;
        if (JSON.stringify(known) !== JSON.stringify(currentKnown)) {
            updates.class_spells = { ...(state.class_spells || {}), known_spells: known };
        }
        if (Object.keys(updates).length > 0) set(updates);
        if (removed.length) get().removeTalentGrantSpells(removed);

        const spellbook = useSpellbookStore.getState();
        const library = loadLibraryFromStorage();
        let changed = false;
        classTalentNodes('Fate Weaver').filter(node => node.passiveSpellId && ranks[node.id]).forEach(node => {
            const rank = ranks[node.id];
            const canonical = FATE_WEAVER_PROJECTED_SPELLS_BY_ID[node.passiveSpellId];
            if (!canonical) return;
            const view = { ...canonical, source: 'talent', talentId: node.id, talentRank: rank,
                maxRanks: 3, description: node.rankValues[rank - 1].text,
                learnedRankValues: node.rankValues[rank - 1].values };
            const existing = (spellbook.spells || []).find(spell => spell.id === node.passiveSpellId);
            if (existing?.source === 'talent') spellbook.updateSpell(view.id, view);
            const index = library?.spells?.findIndex(spell => spell.id === node.passiveSpellId && spell.source === 'talent') ?? -1;
            if (index >= 0) { library.spells[index] = view; changed = true; }
        });
        if (changed) saveLibraryToStorage(library);
    },


    updateLevel: (newLevel) => {
        const before = get();
        const beforeClass = before.class || before.characterClass;
        if ((beforeClass === 'Gambler' || beforeClass === 'Fate Weaver') && newLevel < before.level) {
            for (let lostLevel = before.level; lostLevel > newLevel; lostLevel--) get().reverseLevelUpBonus(lostLevel);
        }
        let removedGrantIds = [];
        set(state => {
            const oldLevel = state.level;
            const characterClass = state.class || state.characterClass;
            let talents = state.talents || {};

            if (newLevel < oldLevel && characterClass !== 'Fate Weaver') {
                const pruned = pruneTalentsForChange(talents, {
                    previousClass: characterClass,
                    nextClass: characterClass,
                    level: newLevel
                });
                removedGrantIds = removedTalentGrantIds(talents, pruned, characterClass);
                talents = pruned;
            }

            // Record character change for persistence
            if (state.currentCharacterId && newLevel !== oldLevel) {
                get().recordCharacterChange(state.currentCharacterId, 'stat_change', {
                    stat: 'level',
                    value: newLevel,
                    previousValue: oldLevel,
                    timestamp: new Date()
                });
            }

            return newLevel < oldLevel && characterClass !== 'Fate Weaver'
                ? { level: newLevel, talents }
                : { level: newLevel };
        });

        if (removedGrantIds.length > 0) {
            get().removeTalentGrantSpells(removedGrantIds);
        }

        get().reconcileGamblerTalents();
        get().reconcileFateWeaverTalents();

        // Auto-assign spells based on new level
        const state = get();
        const characterClass = state.class || state.characterClass;
        if (characterClass) {
            get().assignSpellsForLevel(newLevel, characterClass);
        }
    },

    updateExhaustionLevel: (newExhaustionLevel) => {
        set(state => {
            // Record character change for persistence
            if (state.currentCharacterId && newExhaustionLevel !== state.exhaustionLevel) {
                get().recordCharacterChange(state.currentCharacterId, 'stat_change', {
                    stat: 'exhaustionLevel',
                    value: newExhaustionLevel,
                    previousValue: state.exhaustionLevel,
                    timestamp: new Date()
                });
            }

            // Recalculate derived stats with new exhaustion level
            const effectiveStats = state.race && state.subrace
                ? applyRacialModifiers(state.stats, state.race, state.subrace)
                : state.stats;
            const equipmentBonuses = calculateEquipmentBonuses(state.equipment);

            // Apply equipment bonuses to stats before calculating derived stats
            const totalStats = { ...effectiveStats };
            const statMapping = {
                str: 'strength',
                con: 'constitution',
                agi: 'agility',
                int: 'intelligence',
                spir: 'spirit',
                cha: 'charisma'
            };

            Object.entries(statMapping).forEach(([shortName, fullName]) => {
                if (equipmentBonuses[shortName]) {
                    totalStats[fullName] = (totalStats[fullName] || 0) + equipmentBonuses[shortName];
                }
            });

            const encumbranceState = getEncumbranceState();
            const derivedStats = calculateDerivedStats(totalStats, equipmentBonuses, {}, encumbranceState, newExhaustionLevel, state.health, state.race, state.subrace, undefined, state.ancestry);

            // Update health and mana max values based on new derived stats
            const newMaxHealth = Math.round(derivedStats.maxHealth);
            const newMaxMana = Math.round(derivedStats.maxMana);

            let newHealth = { ...state.health };
            let newMana = { ...state.mana };

            // Level 4: HP maximum halved (handled in calculateDerivedStats)
            // But we need to ensure current health doesn't exceed new max
            newHealth.max = newMaxHealth;
            newHealth.current = Math.min(newHealth.current, newMaxHealth);

            // Level 6: Death - set HP to 0
            if (newExhaustionLevel >= 6) {
                newHealth.current = 0;
            }

            // Update mana max
            newMana.max = newMaxMana;
            newMana.current = Math.min(newMana.current, newMaxMana);

            return {
                exhaustionLevel: newExhaustionLevel,
                derivedStats,
                health: newHealth,
                mana: newMana
            };
        });
    },

    // Handle level-up choice from modal
    handleLevelUpChoice: (choice) => {
        const state = get();
        const newLevel = state.pendingLevelUpInfo?.newLevel || state.level;
        if ((state.class || state.characterClass) === 'Gambler') {
            const data = ALL_CLASSES_DATA.Gambler;
            const known = state.class_spells?.known_spells || [];
            const legal = Object.entries(data.spellPools).filter(([level]) => Number(level) <= newLevel).flatMap(([, ids]) => ids);
            const allOptions = Object.values(data.spellPools).flat();
            if (newLevel < 1 || newLevel > 10 || state.levelUpHistory?.[newLevel]?.spellId ||
                !legal.includes(choice?.spellId) || known.includes(choice.spellId) ||
                known.filter(spellId => allOptions.includes(spellId)).length >= newLevel) return;
        }

        if ((state.class || state.characterClass) === 'Fate Weaver') {
            const known = state.class_spells?.known_spells || [];
            const allOptions = Object.values(FATE_WEAVER_SPELL_POOLS).flat();
            const legal = Object.entries(FATE_WEAVER_SPELL_POOLS)
                .filter(([level]) => Number(level) <= newLevel)
                .flatMap(([, ids]) => ids);
            const recordedPicks = new Set(Object.values(state.levelUpHistory || {})
                .map(entry => entry?.spellId).filter(Boolean));
            if (newLevel < 1 || newLevel > 10 || state.levelUpHistory?.[newLevel] ||
                !choice?.spellId || !legal.includes(choice.spellId) || known.includes(choice.spellId) ||
                recordedPicks.has(choice.spellId) ||
                known.filter(spellId => allOptions.includes(spellId)).length >= newLevel) return;
        }

        const historyEntry = {
            healthIncrease: choice.healthIncrease || 0,
            manaIncrease: choice.manaIncrease || 0,
            attributes: choice.attributes || [],
            timestamp: new Date().toISOString()
        };

        const atomicUpdate = {};

        if (choice.spellId) {
            const currentSpells = state.class_spells?.known_spells || [];
            if (!currentSpells.includes(choice.spellId)) {
                atomicUpdate.class_spells = {
                    ...state.class_spells,
                    known_spells: [...currentSpells, choice.spellId]
                };
            } else {
                console.warn(`Ã¢Å¡Â Ã¯Â¸Â Attempted to learn spell ${choice.spellId} that is already known`);
            }
            historyEntry.spellId = choice.spellId;
        }

        if (choice.attributes && choice.attributes.length > 0) {
            const newStats = { ...state.stats };
            choice.attributes.forEach(attr => {
                if (attr) {
                    newStats[attr] = (newStats[attr] || 0) + 1;
                }
            });
            atomicUpdate.stats = newStats;
        }

        atomicUpdate.levelUpHistory = {
            ...state.levelUpHistory,
            [newLevel]: historyEntry
        };

        set(atomicUpdate);

        // Recalculate derived stats (this will now include level-up bonuses from history)
        get().initializeCharacter();

        // Check if there are more levels that need choices
        const updatedState = get();
        const currentLevel = updatedState.level;
        const updatedLevelUpHistory = updatedState.levelUpHistory || {};

        // Find the next level that doesn't have a history entry
        let nextLevelToPrompt = null;
        for (let level = newLevel + 1; level <= currentLevel; level++) {
            if (!updatedLevelUpHistory[level]) {
                nextLevelToPrompt = level;
                break;
            }
        }

        // If we found another level that needs a choice, show the modal for it
        if (nextLevelToPrompt) {
            set({
                showLevelUpModal: true,
                pendingLevelUpInfo: {
                    newLevel: nextLevelToPrompt,
                    oldLevel: nextLevelToPrompt - 1
                }
            });
        } else {
            // No more levels need choices, close the modal
            set({
                showLevelUpModal: false,
                pendingLevelUpInfo: null
            });
        }

        // Save character after choice
        if (state.currentCharacterId) {
            get().saveCurrentCharacter();
        }

        get().syncWithMultiplayer();

    },

    // Reverse level-up bonuses when leveling down.
    // Applies all removals atomically in a single set() call to avoid stale-state bugs,
    // then removes the history entry.  Callers are responsible for calling
    // initializeCharacter() once after all reversals are complete.
    reverseLevelUpBonus: (level) => {
        const state = get();
        const choice = state.levelUpHistory[level];

        if (!choice) {
            return;
        }

        const atomicUpdate = {};

        // Reverse spell if present
        if (choice.spellId) {
            const currentSpells = state.class_spells?.known_spells || [];
            atomicUpdate.class_spells = {
                ...state.class_spells,
                known_spells: currentSpells.filter(id => id !== choice.spellId)
            };
        }

        // Reverse attribute increases (handle both old and new format)
        const attributes = choice.attributes || (choice.attribute ? [choice.attribute] : []);
        if (attributes.length > 0) {
            const newStats = { ...state.stats };
            attributes.forEach(attr => {
                if (attr) {
                    newStats[attr] = Math.max(1, (newStats[attr] || 1) - 1);
                }
            });
            atomicUpdate.stats = newStats;
        }

        // Remove this level's entry from history so initializeCharacter()
        // will exclude its healthIncrease / manaIncrease from the running totals.
        const updatedHistory = { ...state.levelUpHistory };
        delete updatedHistory[level];
        atomicUpdate.levelUpHistory = updatedHistory;

        set(atomicUpdate);
        // NOTE: Do NOT call initializeCharacter() here.
        // When reversing multiple levels in a loop (adjustLevel), the caller
        // does a single initializeCharacter() pass at the end for efficiency.
    }
});
