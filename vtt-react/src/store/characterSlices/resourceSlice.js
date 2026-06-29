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
import { getEncumbranceState, getCurrentUserId, isGuestUser, getCharactersStorageKey, shouldUseFirebase, CHARACTER_AUTO_SAVE_DELAY, clearCharacterAutoSaveTimer, triggerCharacterAutoSave } from '../characterHelpers';

export const createResourceSlice = (set, get) => ({
    // Resources
    health: {
        current: 45,
        max: 50
    },
    mana: {
        current: 45,
        max: 50
    },
    actionPoints: {
        current: 1,
        max: 3
    },
    // Temporary resources (overheal/overmana/overap)
    tempHealth: 0,
    tempMana: 0,
    tempActionPoints: 0,

    // Class-specific resource system
    classResource: {
        type: 'classResource', // Default type for unknown classes
        current: 3, // Set to 3 to test the bar fill
        max: 5, // Default max value
        // Additional properties for complex resource types
        stacks: [], // For multi-stack systems like Chaos Weaver dice
        phase: null, // For phase-based systems like Lunarch
        threshold: 0, // For threshold-based systems like Berserker
        slots: [], // For slot-based systems like Inscriptor glyphs
        charges: 0, // For charge-based systems
        spheres: [], // For sphere systems like Arcanoneer (array of element IDs)
        strain: 0, // For strain systems
        risk: 0, // For risk systems like Gambit
        // Visual state tracking
        activeEffects: [], // For tracking active visual effects
        lastUpdate: Date.now()
    },

    updateResource: (resource, current, max, temp, skipSync = false, skipSave = false) => {
        set(state => {
            const oldResource = state[resource] || { current: 0, max: 0 };
            const newResource = {
                current: current !== undefined ? Math.min(max || oldResource.max, Math.max(0, current)) : oldResource.current,
                max: max !== undefined ? Math.max(0, max) : oldResource.max
            };

            const tempField = `temp${resource.charAt(0).toUpperCase() + resource.slice(1)}`;
            const updates = { [resource]: newResource };

            // Handle optional temp resource update
            if (temp !== undefined) {
                updates[tempField] = Math.max(0, temp);
            }

            // If health changed, recalculate derived stats to apply conditional passives (like Battle Fury)
            let newDerivedStats = state.derivedStats;
            if (resource === 'health') {
                // Apply racial modifiers to get effective stats for calculations
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
                newDerivedStats = calculateDerivedStats(totalStats, equipmentBonuses, {}, encumbranceState, state.exhaustionLevel || 0, newResource, state.race, state.subrace);
                updates.derivedStats = newDerivedStats;
            }

            // CRITICAL FIX: Debounced auto-save to Firebase/Multiplayer for resource changes
            if (state.currentCharacterId && !skipSave) {
                triggerCharacterAutoSave(() => get().saveCurrentCharacter());
            }

            // MULTIPLAYER SYNC: Broadcast resource changes to other players
            if (!skipSync) {
                const delta = {};
                if (current !== undefined) delta[resource] = current - oldResource.current;
                else if (temp !== undefined) delta[resource] = 0; // Trigger sync if only temp changed

                setTimeout(() => get().syncResourcesWithMultiplayer(delta), 0);
            }

            return updates;
        });
    },

    // Temporary resource management
    updateTempResource: (resourceType, amount, skipSync = false, skipSave = false) => {
        set(state => {
            const tempField = `temp${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}`;
            const newAmount = Math.max(0, amount);

            // MULTIPLAYER SYNC
            if (!skipSync) {
                setTimeout(() => {
                    // Use the unified sync logic for temp resources
                    get().syncResourcesWithMultiplayer({ [resourceType]: 0 });
                }, 0);
            }

            // AUTO-SAVE
            if (state.currentCharacterId && !skipSave) {
                triggerCharacterAutoSave(() => get().saveCurrentCharacter());
            }

            return { [tempField]: newAmount };
        });
    },

    // Class resource management functions
    updateClassResource: (field, value, skipSync = false, skipSave = false) => {
        set(state => {
            if (!state.classResource) return state;

            // SMART FIX: If value is a plain number and the field is nested (has .current), auto-wrap it
            const existingField = state.classResource[field];
            const isNestedField = existingField && typeof existingField === 'object' && !Array.isArray(existingField) && 'current' in existingField;
            const isPrimitiveValue = value !== null && typeof value !== 'object';

            let fieldValue = value;
            if (isNestedField && isPrimitiveValue) {
                fieldValue = {
                    ...existingField,
                    current: value
                };
            }

            const updatedResource = {
                ...state.classResource,
                [field]: fieldValue,
                lastUpdate: Date.now()
            };

            // CRITICAL FIX: Debounced auto-save for class resource changes
            if (state.currentCharacterId && !skipSave) {
                triggerCharacterAutoSave(() => get().saveCurrentCharacter());
            }

            // Sync with multiplayer (de-prioritized or separate event)
            if (!skipSync) {
                setTimeout(() => {
                    // Trigger sync for class resource specifically
                    get().syncResourcesWithMultiplayer({ classResource: 0 });
                }, 0);
            }

            return {
                classResource: updatedResource
            };
        });
    },

    resetClassResource: () => {
        const state = get();
        if (!state.classResource || !state.class) return;

        const fresh = initializeClassResource(state.class, {
            ...state.stats,
            level: state.level
        });
        if (!fresh) return;

        set({ classResource: fresh });

        if (state.currentCharacterId) {
            triggerCharacterAutoSave(() => get().saveCurrentCharacter());
        }

        get().syncResourcesWithMultiplayer({ classResource: 0 });
    },

    // Consume class resource (spend points/charges/etc.)
    consumeClassResource: (amount = 1) => {
        set(state => {
            if (!state.classResource || state.classResource.current < amount) {
                return state;
            }

            const newCurrent = Math.max(0, state.classResource.current - amount);



            return {
                classResource: {
                    ...state.classResource,
                    current: newCurrent,
                    lastUpdate: Date.now()
                }
            };
        });

        // Sync with multiplayer
        get().syncWithMultiplayer();
    },

    // Gain class resource (earn points/charges/etc.)
    gainClassResource: (amount = 1) => {
        set(state => {
            if (!state.classResource) return state;

            const newCurrent = Math.min(state.classResource.max, state.classResource.current + amount);



            return {
                classResource: {
                    ...state.classResource,
                    current: newCurrent,
                    lastUpdate: Date.now()
                }
            };
        });

        // Sync with multiplayer
        get().syncWithMultiplayer();
    },

    // Refresh class resource max when stats change
    refreshClassResourceMax: () => {
        set(state => {
            if (!state.classResource || !state.class) return state;

            const updatedResource = updateClassResourceMax(
                state.classResource,
                state.class,
                { ...state.stats, level: state.level }
            );



            return {
                classResource: updatedResource
            };
        });
    },

    // Force recalculation of health and mana based on current stats
    recalculateResources: () => {
        const state = get();

        // Apply racial modifiers to get effective stats
        const effectiveStats = state.race && state.subrace
            ? applyRacialModifiers(state.stats, state.race, state.subrace)
            : state.stats;

        // Calculate equipment bonuses
        const equipmentBonuses = calculateEquipmentBonuses(state.equipment || {});

        // Apply equipment bonuses to stats
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

        // Get encumbrance state
        const encumbranceState = state.inventory?.encumbranceState || 'normal';

        // Calculate derived stats
        const derivedStats = calculateDerivedStats(totalStats, equipmentBonuses, {}, encumbranceState, state.exhaustionLevel || 0);

        // Calculate correct max values
        const newMaxHealth = Math.round(derivedStats.maxHealth);
        const newMaxMana = Math.round(derivedStats.maxMana);

        // Update health and mana with recalculated max values
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

    // Get the currently active character
    getActiveCharacter: () => {
        const state = get();


        if (state.currentCharacterId) {
            const character = state.characters.find(char => char.id === state.currentCharacterId);
            if (character) {
                return character;
            } else {
                console.warn(`Active character ID ${state.currentCharacterId} not found in characters array`);
                // Clear invalid active character ID
                localStorage.removeItem('mythrill-active-character');
                set({ currentCharacterId: null });
            }
        }
        return null;
    },

    updateHealth: (newHealth) => {
        set(state => {
            const updatedHealth = { ...state.health, ...newHealth };

            // Record character change for persistence
            if (state.currentCharacterId) {
                get().recordCharacterChange(state.currentCharacterId, 'resource_change', {
                    type: 'health',
                    value: updatedHealth,
                    timestamp: new Date()
                });

                // Save the character with updated health
                setTimeout(() => {
                    get().saveCurrentCharacter();
                }, 100); // Small delay to ensure state is updated
            }

            // Recalculate resistances if health changed (for conditional passives)
            setTimeout(() => {
                get().recalculateResistancesFromPassives();
            }, 0);

            return { health: updatedHealth };
        });
    },

    updateMana: (newMana) => {
        set(state => {
            const updatedMana = { ...state.mana, ...newMana };

            // Record character change for persistence
            if (state.currentCharacterId) {
                get().recordCharacterChange(state.currentCharacterId, 'resource_change', {
                    type: 'mana',
                    value: updatedMana,
                    timestamp: new Date()
                });

                // Save the character with updated mana
                setTimeout(() => {
                    get().saveCurrentCharacter();
                }, 100); // Small delay to ensure state is updated
            }

            return { mana: updatedMana };
        });
    },

    updateActionPoints: (newActionPoints) => {
        set(state => {
            const updatedActionPoints = { ...state.actionPoints, ...newActionPoints };

            // Record character change for persistence
            if (state.currentCharacterId) {
                get().recordCharacterChange(state.currentCharacterId, 'resource_change', {
                    type: 'actionPoints',
                    value: updatedActionPoints,
                    timestamp: new Date()
                });
            }

            return { actionPoints: updatedActionPoints };
        });
    }
});
