import { calculateEquipmentBonuses, calculateDerivedStats } from '../../utils/characterUtils';
import { initializeClassResource, updateClassResourceMax } from '../../data/classResources';
import { applyRacialModifiers } from '../../data/raceData';
import { getEncumbranceState, triggerCharacterAutoSave } from '../characterHelpers';
import { normalizeManagedClassResource, updateManagedClassResource, getManagedResourceId, getClassResourceValue, changeManagedClassResource } from '../../data/classResourceContracts';
import { applyApexPackEvent, beginApexOwnTurn, getApexCompanionStatus } from '../../data/apexResourceContract';
import { getStore } from '../storeRegistry';
import { clearActivePointer } from '../../persistence/characterScopedStorage';
import { advancePyroDebtCall } from '../../data/pyrofiendResourceContract';
import { recordSpellguardIntake } from '../../data/spellguardResourceContract';
import { getInquisitorAssistanceDecision } from '../../data/inquisitorResourceContract';
import { getAugurLongRestDebt } from '../../data/augurResourceContract';

const refreshInquisitorAssistanceStats = get => {
    const state = get();
    if (getManagedResourceId(state.classResource, state.class) === 'authority' && state.stats && typeof state.updateStat === 'function') {
        state.updateStat('strength', state.stats.strength);
    }
};

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

    // Provenance-aware assistance is distinct from manual resource calibration.
    receiveAssistance: (resourceType, amount, provenance = {}) => {
        const state = get();
        if (!['health', 'mana'].includes(resourceType) || !Number.isFinite(amount) || amount <= 0 || !state[resourceType]) return { applied: false, reason: 'invalid-assistance' };
        const decision = getInquisitorAssistanceDecision({ ...state, assistanceIdentityIds: ['player', 'current-player'] },
            { ...provenance, kind: resourceType === 'health' ? 'healing' : 'mana_regen' });
        if (decision.suppressed) return { applied: false, ...decision };
        state.updateResource(resourceType, state[resourceType].current + amount);
        return { applied: true, ...decision };
    },

    setInquisitorNullAura: active => {
        const state = get();
        if (getManagedResourceId(state.classResource, state.class) !== 'authority') return false;
        state.updateClassResource('nullAura', { active: active === true });
        return get().classResource.nullAura.active;
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
            const contractedResource = getManagedResourceId(state.classResource, state.class)
                ? { ...updateManagedClassResource(state.classResource, state.class, field, fieldValue), lastUpdate: updatedResource.lastUpdate }
                : updatedResource;

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
                classResource: contractedResource
            };
        });
        refreshInquisitorAssistanceStats(get);
    },

    resetClassResource: () => {
        const state = get();
        if (!state.classResource || !state.class) return;

        const fresh = initializeClassResource(state.class, {
            ...state.stats,
            level: state.level
        });
        if (!fresh) return;

        const resourceId = getManagedResourceId(state.classResource, state.class);
        let resetResource = fresh;
        if (resourceId === 'infernoVeil') resetResource = updateManagedClassResource(state.classResource, state.class, 'current', 0);
        if (resourceId === 'arcaneEnergyPoints') resetResource = { ...updateManagedClassResource(state.classResource, state.class, 'current', 0), activeEffects: [] };
        if (resourceId === 'authority') resetResource = { ...updateManagedClassResource(state.classResource, state.class, 'current', 0), activeEffects: [] };
        if (resourceId === 'kineticFluxBodyToll') {
            resetResource = updateManagedClassResource(state.classResource, state.class, 'current', 0);
            resetResource = updateManagedClassResource(resetResource, state.class, 'bodyToll', 0);
            resetResource = updateManagedClassResource(resetResource, state.class, 'stance', 'Ataxic Flow');
            resetResource = { ...resetResource, activeEffects: [] };
        }
        if (resourceId === 'toxinVialsContraptions') {
            const maxVials = state.classResource?.toxinVialsMax ?? state.classResource?.maxVials ?? 4;
            const maxParts = state.classResource?.contraptionPartsMax ?? 5;
            resetResource = normalizeManagedClassResource({ ...state.classResource, toxinVials: maxVials, contraptionParts: maxParts }, state.class);
        }
        if (resourceId === 'benediction-malediction') {
            const debt = getAugurLongRestDebt(state.classResource);
            resetResource = normalizeManagedClassResource({ ...state.classResource, benediction: 0, malediction: 0, omenDebt: debt }, state.class);
        }
        if (resetResource === fresh && getManagedResourceId(fresh, state.class)) {
            resetResource = normalizeManagedClassResource(fresh, state.class);
        }
        set({ classResource: resetResource });
        refreshInquisitorAssistanceStats(get);

        if (state.currentCharacterId) {
            triggerCharacterAutoSave(() => get().saveCurrentCharacter());
        }

        get().syncResourcesWithMultiplayer({ classResource: 0 });
    },

    // Report resolved magical intake without silently losing residual/overflow.
    recordSpellguardInterception: receipt => {
        let result = { accepted: false, reason: 'not-spellguard' };
        set(state => {
            if (!state.classResource || getManagedResourceId(state.classResource, state.class) !== 'arcaneEnergyPoints') return state;
            result = recordSpellguardIntake(state.classResource, receipt);
            return result.accepted ? { classResource: { ...result.resource, lastUpdate: Date.now() } } : state;
        });
        if (result.accepted) {
            const state = get();
            if (state.currentCharacterId) triggerCharacterAutoSave(() => get().saveCurrentCharacter());
            state.syncResourcesWithMultiplayer({ classResource: 0 });
        }
        return result;
    },

    // Idempotent own-turn receipts for a latched Pyrofiend Debt Call
    advancePyroOwnTurn: ownTurnId => {
        let result = { accepted: false };
        set(state => {
            if (!state.classResource || getManagedResourceId(state.classResource, state.class) !== 'infernoVeil') return state;
            result = advancePyroDebtCall(state.classResource, ownTurnId);
            return result.accepted ? { classResource: { ...result.resource, lastUpdate: Date.now() } } : state;
        });
        if (result.accepted) {
            const state = get();
            if (state.currentCharacterId) triggerCharacterAutoSave(() => get().saveCurrentCharacter());
            state.syncResourcesWithMultiplayer({ classResource: 0 });
        }
        return result;
    },

    // Resolved pack outcomes and own-turn windows (Apex)
    recordApexPackEvent: event => {
        let result = { accepted: false, gained: 0, reason: 'not-apex' };
        set(state => {
            if (!state.classResource || getManagedResourceId(state.classResource, state.class) !== 'quarryMarksCompanion') return state;
            const tokens = getStore('creatureStore')?.getState().creatureTokens || [];
            result = applyApexPackEvent(state.classResource, event, {
                companionAvailable: getApexCompanionStatus(state.classResource, tokens).available,
                specialization: state.primarySpecialization || state.classResource.apexSpecialization
            });
            return result.accepted ? { classResource: { ...result.resource, lastUpdate: Date.now() } } : state;
        });
        if (result.accepted) {
            const state = get();
            if (state.currentCharacterId) triggerCharacterAutoSave(() => get().saveCurrentCharacter());
            state.syncResourcesWithMultiplayer({ classResource: 0 });
        }
        return result;
    },

    beginApexOwnTurn: () => {
        const state = get();
        if (!state.classResource || getManagedResourceId(state.classResource, state.class) !== 'quarryMarksCompanion') return;
        state.updateClassResource('apexGeneration', beginApexOwnTurn(state.classResource).apexGeneration);
    },

    // Consume class resource (spend points/charges/etc.)
    consumeClassResource: (amount = 1, resourceKey) => {
        set(state => {
            const resource = normalizeManagedClassResource(state.classResource, state.class);
            const managed = getManagedResourceId(resource, state.class);
            if (!resource || !Number.isFinite(amount) || amount <= 0 || (managed && !Number.isInteger(amount)) ||
                getClassResourceValue(resource, state.class, resourceKey) < amount) {
                return state;
            }

            const newCurrent = Math.max(0, resource.current - amount);

            if (state.currentCharacterId) triggerCharacterAutoSave(() => get().saveCurrentCharacter());



            return {
                classResource: managed ? {
                    ...changeManagedClassResource(resource, state.class, -amount, resourceKey),
                    lastUpdate: Date.now()
                } : {
                    ...resource,
                    current: newCurrent,
                    lastUpdate: Date.now()
                }
            };
        });

        // Sync with multiplayer
        refreshInquisitorAssistanceStats(get);
        get().syncWithMultiplayer();
    },

    // Gain class resource (earn points/charges/etc.)
    gainClassResource: (amount = 1, resourceKey) => {
        set(state => {
            if (!state.classResource) return state;
            const resource = normalizeManagedClassResource(state.classResource, state.class);
            const managed = getManagedResourceId(resource, state.class);
            if (!Number.isFinite(amount) || amount <= 0 || (managed && !Number.isInteger(amount))) return state;

            const newCurrent = Math.min(resource.max, resource.current + amount);

            if (state.currentCharacterId) triggerCharacterAutoSave(() => get().saveCurrentCharacter());



            return {
                classResource: managed ? {
                    ...changeManagedClassResource(resource, state.class, amount, resourceKey),
                    lastUpdate: Date.now()
                } : {
                    ...resource,
                    current: newCurrent,
                    lastUpdate: Date.now()
                }
            };
        });

        // Sync with multiplayer
        refreshInquisitorAssistanceStats(get);
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
                // Clear invalid active character ID (scoped selector)
                clearActivePointer();
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
