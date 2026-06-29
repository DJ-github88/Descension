import { calculateEquipmentBonuses, calculateDerivedStats, flattenEffects } from '../../utils/characterUtils';
import { isTwoHandedWeapon, getSlotsToCleanForTwoHanded } from '../../utils/equipmentUtils';
import { initializeClassResource, updateClassResourceMax } from '../../data/classResources';
import { applyRacialModifiers, getFullRaceData, getRaceData } from '../../data/raceData';
import { getRacialSpells, getRacialStatModifiers } from '../../utils/raceDisciplineSpellUtils';
import useGameStore from '../gameStore';
import characterPersistenceService from '../../services/firebase/characterPersistenceService';
import characterSessionService from '../../services/firebase/characterSessionService';
import characterMigrationService from '../../services/firebase/characterMigrationService';
import localStorageManager from '../../utils/localStorageManager';
import { getCharacterData, updateCharacterData, storeCharacterOffline } from '../../services/offlineService';
import { getEncumbranceState, getCurrentUserId, isGuestUser, getCharactersStorageKey, shouldUseFirebase } from '../characterHelpers';
import { ALL_CLASSES_DATA } from '../../data/classes';
import { ALL_CLASS_SPELLS } from '../../data/classSpellGenerator';
import { checkLevelUp, getXPForLevel } from '../../utils/experienceUtils';

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

        // Update race display name if race and subrace are set
        // Also update if the raceDisplayName doesn't contain parentheses (old format)
        if (state.race && state.subrace && (!state.raceDisplayName || !state.raceDisplayName.includes('('))) {
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
        const derivedStats = calculateDerivedStats(totalStats, equipmentBonuses, {}, encumbranceState, state.exhaustionLevel || 0, state.health, state.race, state.subrace);

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

    // Ensure starter spells are assigned for the given class when none are known
    ensureClassStarterSpells: async (className) => {
        const state = get();
        try {
            if (!className) return false;
            const known = state.class_spells?.known_spells || [];
            // Only assign if no spells are known OR if we have fewer than 3 level 1 spells
            // This allows us to fill in missing spells
            if (known.length >= 3) {
                // Check if we have at least 3 level 1 spells
                try {
                    const available = ALL_CLASS_SPELLS[className] || [];
                    const level1SpellIds = new Set(available.filter(s => (s.level || 1) === 1).map(s => s.id));
                    const knownLevel1Count = known.filter(id => level1SpellIds.has(id)).length;
                    if (knownLevel1Count >= 3) {
                        return false; // Already have 3+ level 1 spells
                    }
                } catch (e) {
                    // If we can't check, proceed with assignment
                }
            }

            // Ensure character is level 1 if not set
            if (!state.level || state.level < 1) {
                set({ level: 1 });
            }

            // Prefer selecting from the actually loaded/generated class spells
            try {
                const available = ALL_CLASS_SPELLS[className] || [];

                // Filter to level 1 spells only (or spells without level, which default to 1)
                const level1Spells = available.filter(s => {
                    const spellLevel = s.level || 1;
                    return spellLevel === 1;
                });


                if (level1Spells.length > 0) {
                    // Get currently known level 1 spells
                    const knownLevel1SpellIds = new Set(known.filter(id =>
                        level1Spells.some(s => s.id === id)
                    ));

                    // If we already have 3+ level 1 spells, don't reassign
                    if (knownLevel1SpellIds.size >= 3) {
                        return false;
                    }

                    // Filter out already known spells
                    const availableLevel1Spells = level1Spells.filter(s => !known.includes(s.id));

                    let starter = [];
                    if (className === 'Harbinger') {
                        const withTables = availableLevel1Spells.filter(s => (s.rollableTable && s.rollableTable.enabled) || (s.mechanicsConfig && s.mechanicsConfig.rollableTable && s.mechanicsConfig.rollableTable.enabled));
                        const ds = availableLevel1Spells.filter(s => s.specialization === 'deaths_seer');
                        const wp = availableLevel1Spells.filter(s => s.specialization === 'wild_prophet');
                        const fr = availableLevel1Spells.filter(s => s.specialization === 'fate_rift');
                        starter = (withTables.slice(0, 3).length === 3
                            ? withTables.slice(0, 3)
                            : [...fr, ...ds, ...wp].filter(s => withTables.includes(s) || s.rollableTable?.enabled).slice(0, 3));
                    } else if (className === 'Gambit') {
                        // Prefer card-based spells with rollable tables
                        const withCards = availableLevel1Spells.filter(s => (s.resolution === 'CARDS') || (s.mechanicsConfig?.cards) || (s.rollableTable?.resolutionType === 'CARDS'));
                        const withTables = withCards.filter(s => s.rollableTable?.enabled);
                        starter = (withTables.slice(0, 3).length === 3 ? withTables.slice(0, 3) : withCards.slice(0, 3));
                    } else {
                        // For all other classes, randomly select from available level 1 spells
                        const needed = Math.min(3 - knownLevel1SpellIds.size, availableLevel1Spells.length);
                        if (needed > 0) {
                            const shuffled = [...availableLevel1Spells].sort(() => Math.random() - 0.5);
                            starter = shuffled.slice(0, needed);
                        }
                    }

                    if (starter.length > 0) {
                        const starterIds = starter.map(s => s.id).filter(id => id);
                        // Merge with existing known spells (keep non-level-1 spells)
                        const existingNonLevel1 = known.filter(id =>
                            !level1Spells.some(s => s.id === id)
                        );
                        const updatedKnownSpells = [...existingNonLevel1, ...starterIds];

                        set({
                            class_spells: {
                                ...state.class_spells,
                                known_spells: updatedKnownSpells
                            }
                        });
                        return true;
                    } else if (knownLevel1SpellIds.size < 3) {
                        console.warn(`Ã¢Å¡Â Ã¯Â¸Â Could not assign enough level 1 spells for ${className}. Have ${knownLevel1SpellIds.size}, need 3, but only ${availableLevel1Spells.length} available.`);
                    }
                } else {
                    console.warn(`Ã¢Å¡Â Ã¯Â¸Â No level 1 spells found in ALL_CLASS_SPELLS for ${className}`);
                }
            } catch (e) {
                console.warn('Could not load from ALL_CLASS_SPELLS, falling back to spellPools:', e);
            }

            // Fall back to classData spell pools if generator unavailable or no spells found
            try {
                // Helper function to get class data by name
                const getClassData = (name) => (ALL_CLASSES_DATA[name] || null);

                // Helper function to get level 1 spell IDs from class data
                const getLevel1SpellIds = (classData) => {
                    if (!classData) return [];

                    // First try spellPools[1]
                    if (classData.spellPools && classData.spellPools[1]) {
                        return classData.spellPools[1];
                    }

                    // Fallback: filter spells/exampleSpells array for level 1 spells
                    const spellsArray = classData.spells || classData.exampleSpells || [];
                    if (Array.isArray(spellsArray) && spellsArray.length > 0) {
                        return spellsArray
                            .filter(spell => spell.level === 1 || !spell.level) // Include spells without level (default to 1)
                            .map(spell => spell.id)
                            .filter(id => id); // Remove any undefined/null IDs
                    }

                    return [];
                };

                const classData = getClassData(className);
                const level1SpellIds = getLevel1SpellIds(classData);

                if (level1SpellIds.length > 0) {
                    // Try to match spell IDs with ALL_CLASS_SPELLS to ensure they exist
                    let validSpellIds = level1SpellIds;
                    try {
                        const available = ALL_CLASS_SPELLS[className] || [];
                        const availableIds = new Set(available.map(s => s.id));
                        validSpellIds = level1SpellIds.filter(id => availableIds.has(id));

                        // If no matches found, use original IDs (might be a new class or different format)
                        if (validSpellIds.length === 0) {
                            console.warn(`Ã¢Å¡Â Ã¯Â¸Â No matching spell IDs found in ALL_CLASS_SPELLS for ${className}, using classData IDs directly`);
                            validSpellIds = level1SpellIds;
                        }
                    } catch (e) {
                        console.warn('Could not cross-reference with ALL_CLASS_SPELLS in fallback:', e);
                    }

                    const shuffled = [...validSpellIds].sort(() => Math.random() - 0.5);
                    const selectionFallback = shuffled.slice(0, Math.min(3, validSpellIds.length));
                    set({
                        class_spells: {
                            ...state.class_spells,
                            known_spells: selectionFallback
                        }
                    });
                    return true;
                }
            } catch (e) {
                console.warn('Fallback to spellPools also failed:', e);
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
        set({ level: newLevel });

        // Only trigger updateExperience if leveling up (to avoid triggering modal when manually adjusting)
        if (levelChange > 0) {
            get().updateExperience(newXP);
        } else {
            // Just set XP without triggering level-up check
            set({ experience: newXP });
        }

        // Auto-assign spells based on new level (only when leveling UP Ã¢â‚¬â€ leveling down
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

    updateLevel: (newLevel) => {
        set(state => {
            const oldLevel = state.level;

            // Record character change for persistence
            if (state.currentCharacterId && newLevel !== oldLevel) {
                get().recordCharacterChange(state.currentCharacterId, 'stat_change', {
                    stat: 'level',
                    value: newLevel,
                    previousValue: oldLevel,
                    timestamp: new Date()
                });
            }

            return { level: newLevel };
        });

        // Auto-assign spells based on new level
        const state = get();
        const characterClass = state.characterClass;
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
            const derivedStats = calculateDerivedStats(totalStats, equipmentBonuses, {}, encumbranceState, newExhaustionLevel, state.health, state.race, state.subrace);

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

        // Build the level-up history entry
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
