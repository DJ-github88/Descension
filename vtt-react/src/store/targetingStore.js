import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Target types
export const TARGET_TYPES = {
    CREATURE: 'creature',
    PLAYER: 'player',
    PARTY_MEMBER: 'party_member',
    OBJECT: 'object',
    LOCATION: 'location'
};

// Targeting modes
export const TARGETING_MODES = {
    SINGLE: 'single',
    MULTIPLE: 'multiple',
    AREA: 'area',
    NONE: 'none'
};

// Initial state
const initialState = {
    // Current target information
    currentTarget: null,
    targetType: null,

    // Multiple targets (for spells/abilities that can target multiple entities)
    selectedTargets: [],

    // Targeting mode
    targetingMode: TARGETING_MODES.NONE,

    // Target history (for quick re-targeting)
    targetHistory: [],
    maxHistorySize: 10,

    // Target HUD position persistence
    targetHUDPosition: { x: 300, y: 200 },

    // Targeting settings
    targetingSettings: {
        autoTargetHostiles: false,
        showTargetIndicators: true,
        targetThroughFriendlies: false,
        assistTargeting: true, // Target the target of your target
        stickyTargeting: true // Keep target selected until manually changed
    },
    
    // Target validation rules
    validationRules: {
        requireLineOfSight: false,
        maxRange: null,
        allowSelfTarget: true,
        allowFriendlyTarget: true,
        allowHostileTarget: true
    }
};

// Create the targeting store
const useTargetingStore = create(
    persist(
        (set, get) => ({
            ...initialState,

            // Core Targeting Actions
            setTarget: (target, targetType = TARGET_TYPES.CREATURE) => {
                const state = get();
                
                // Validate target based on current rules
                if (!get().isValidTarget(target, targetType)) {
                    return false;
                }

                // Add current target to history before changing
                if (state.currentTarget) {
                    get().addToTargetHistory(state.currentTarget, state.targetType);
                }

                set({
                    currentTarget: target,
                    targetType: targetType,
                    selectedTargets: [target] // Reset multiple targets when setting single target
                });

                return true;
            },

            clearTarget: () => {
                const state = get();

                // Add current target to history before clearing
                if (state.currentTarget) {
                    get().addToTargetHistory(state.currentTarget, state.targetType);
                }

                set({
                    currentTarget: null,
                    targetType: null,
                    selectedTargets: []
                });
            },

            // Multiple Target Management
            addToSelectedTargets: (target, targetType = TARGET_TYPES.CREATURE) => {
                const state = get();
                
                if (!get().isValidTarget(target, targetType)) {
                    return false;
                }

                // Check if target is already selected
                const isAlreadySelected = state.selectedTargets.some(t => 
                    t.id === target.id && t.type === targetType
                );

                if (!isAlreadySelected) {
                    set(state => ({
                        selectedTargets: [...state.selectedTargets, { ...target, type: targetType }]
                    }));
                }

                return true;
            },

            removeFromSelectedTargets: (targetId, targetType) => {
                set(state => ({
                    selectedTargets: state.selectedTargets.filter(t => 
                        !(t.id === targetId && t.type === targetType)
                    )
                }));
            },

            clearSelectedTargets: () => {
                set({ selectedTargets: [] });
            },

            // Target History Management
            addToTargetHistory: (target, targetType) => {
                set(state => {
                    const newHistoryEntry = {
                        target: { ...target },
                        targetType,
                        timestamp: Date.now()
                    };

                    // Remove duplicate entries
                    const filteredHistory = state.targetHistory.filter(entry => 
                        !(entry.target.id === target.id && entry.targetType === targetType)
                    );

                    // Add new entry and limit size
                    const newHistory = [newHistoryEntry, ...filteredHistory]
                        .slice(0, state.maxHistorySize);

                    return { targetHistory: newHistory };
                });
            },

            selectFromHistory: (historyIndex) => {
                const state = get();
                const historyEntry = state.targetHistory[historyIndex];
                
                if (historyEntry) {
                    get().setTarget(historyEntry.target, historyEntry.targetType);
                }
            },

            clearTargetHistory: () => {
                set({ targetHistory: [] });
            },

            // Targeting Mode Management
            setTargetingMode: (mode) => {
                set({ targetingMode: mode });
                
                // Clear targets when changing modes
                if (mode === TARGETING_MODES.NONE) {
                    get().clearTarget();
                    get().clearSelectedTargets();
                }
            },

            // Settings Management
            updateTargetingSettings: (settings) => {
                set(state => ({
                    targetingSettings: { ...state.targetingSettings, ...settings }
                }));
            },

            updateValidationRules: (rules) => {
                set(state => ({
                    validationRules: { ...state.validationRules, ...rules }
                }));
            },

            // Target HUD Position Management
            setTargetHUDPosition: (position) => {
                set({ targetHUDPosition: position });
            },

            getTargetHUDPosition: () => {
                return get().targetHUDPosition;
            },

            // Target Validation
            isValidTarget: (target, targetType) => {
                const state = get();
                const rules = state.validationRules;

                if (!target) return false;

                // Check self-targeting
                if (target.id === 'current-player' && !rules.allowSelfTarget) {
                    return false;
                }

                // Check range if specified
                if (rules.maxRange && target.distance > rules.maxRange) {
                    return false;
                }

                // Check faction-based targeting
                if (target.faction === 'friendly' && !rules.allowFriendlyTarget) {
                    return false;
                }

                if (target.faction === 'hostile' && !rules.allowHostileTarget) {
                    return false;
                }

                // Check line of sight if required
                if (rules.requireLineOfSight && !target.hasLineOfSight) {
                    return false;
                }

                return true;
            },

            // Utility Functions
            getTargetById: (targetId, targetType) => {
                const state = get();
                
                if (state.currentTarget?.id === targetId && state.targetType === targetType) {
                    return state.currentTarget;
                }

                return state.selectedTargets.find(t => t.id === targetId && t.type === targetType);
            },

            hasTarget: () => {
                const state = get();
                return state.currentTarget !== null;
            },

            hasMultipleTargets: () => {
                const state = get();
                return state.selectedTargets.length > 1;
            },

            getTargetCount: () => {
                const state = get();
                return state.selectedTargets.length;
            },

            // Target Assistance (target of target)
            getTargetOfTarget: () => {
                const state = get();
                if (state.currentTarget && state.currentTarget.currentTarget) {
                    return state.currentTarget.currentTarget;
                }
                return null;
            },

            // Quick targeting functions
            targetNearestEnemy: () => {
                // This would need to be implemented with actual game logic
                // to find the nearest enemy creature
            },

            targetNearestFriend: () => {
                // This would need to be implemented with actual game logic
                // to find the nearest friendly creature
            },

            targetPartyMember: (memberIndex) => {
                // This would integrate with the party store to target a specific party member
            }
        }),
        {
            name: 'targeting-store',
            storage: {
                getItem: (name) => {
                    const str = localStorage.getItem(name);
                    if (!str) return null;
                    return JSON.parse(str);
                },
                setItem: (name, value) => {
                    localStorage.setItem(name, JSON.stringify(value));
                },
                removeItem: (name) => localStorage.removeItem(name)
            }
        }
    )
);

export default useTargetingStore;
