import { create } from "zustand";
import { calculateEffectiveMovementSpeed } from "../utils/conditionUtils";

const useCombatStore = create((set, get) => ({
    // Combat state
    isInCombat: false,
    isSelectionMode: false,
    round: 1,
    turnOrder: [],
    currentTurnIndex: 0,
    selectedTokens: new Set(),
    combatTimeline: [],

    // UI state
    timelinePosition: { x: 300, y: 100 },
    timelineSize: { width: 450, height: 350 },

    // Combat configuration
    combatConfig: {
        showTimers: true,
        apRestorationMode: 'initiative', // 'max', 'set', 'initiative'
        apRestorationAmount: 3, // Used when mode is 'set'
        healthRegenEnabled: false,
        manaRegenEnabled: false
    },

    // Turn timer state
    turnTimers: new Map(), // tokenId -> { startTime, totalTime, isActive }
    currentTurnStartTime: null,

    // Movement tracking
    movementThisTurn: new Map(), // tokenId -> { startPosition: {x, y}, totalDistance: number }
    movementPath: [], // Array of {x, y} positions for current drag
    movementUnlocked: new Set(), // Set of tokenIds that have unlocked movement this turn
    turnMovementUsed: new Map(), // tokenId -> total movement used this turn in feet
    turnStartPositions: new Map(), // tokenId -> {x, y} position at start of turn

    // Movement visualization state
    activeMovement: null, // { tokenId, startPosition, currentPosition }
    pendingMovementConfirmation: null, // Movement data awaiting confirmation

    // Temporary movement tracking during drag
    tempMovementDistance: new Map(), // tokenId -> current drag distance in feet

    // Combat actions
    startSelectionMode: () => set({
        isSelectionMode: true,
        selectedTokens: new Set()
    }),

    cancelSelectionMode: () => set({
        isSelectionMode: false,
        selectedTokens: new Set()
    }),

    toggleTokenSelection: (tokenId) => set(state => {
        const newSelected = new Set(state.selectedTokens);
        if (newSelected.has(tokenId)) {
            newSelected.delete(tokenId);
        } else {
            newSelected.add(tokenId);
        }
        return { selectedTokens: newSelected };
    }),

    // Start combat with selected tokens
    startCombat: (tokens, creatures, addCombatNotification) => {
        const combatants = tokens.map(token => {
            let creature = creatures.find(c => c.id === token.creatureId);
            let isCharacterToken = false;

            // CRITICAL FIX: Handle character tokens (have playerId OR isPlayerToken flag)
            // Local player tokens have isPlayerToken=true but no playerId
            // Multiplayer player tokens have playerId
            if (!creature && (token.playerId || token.isPlayerToken)) {
                isCharacterToken = true;
                const useCharacterStore = require('./characterStore').default;
                const char = useCharacterStore.getState();
                // CRITICAL FIX: Use moveSpeed (not movementSpeed) - matches characterUtils.js
                const characterSpeed = char.derivedStats?.moveSpeed || 30;
                creature = {
                    id: token.playerId ? `character_${token.playerId}` : 'character_local',
                    name: char.name || 'Character',
                    stats: {
                        agility: char.stats?.agility || 10,
                        initiativeMod: Math.floor(((char.stats?.agility || 10) - 10) / 2),
                        speed: characterSpeed
                    },
                    tokenIcon: char.tokenSettings?.customIcon || char.lore?.characterImage || 'inv_misc_questionmark',
                    tokenBorder: char.tokenSettings?.borderColor || '#4CAF50'
                };
            }

            if (!creature) return null;

            // Roll initiative (d20 + initiative modifier)
            const d20Roll = Math.floor(Math.random() * 20) + 1;
            const initiativeMod = creature.stats.initiativeMod || Math.floor((creature.stats.agility - 10) / 2);
            const initiative = d20Roll + initiativeMod;

            // Log initiative roll to chat
            if (addCombatNotification) {
                addCombatNotification({
                    type: 'initiative_roll',
                    content: `${creature.name} rolled ${d20Roll} + ${initiativeMod} for initiative (total: ${initiative})`,
                    creature: creature.name,
                    roll: d20Roll,
                    modifier: initiativeMod,
                    total: initiative,
                    timestamp: new Date().toISOString()
                });
            }

            // CRITICAL FIX: Set max AP from stats, calculate current AP from initiative
            let currentActionPoints = 0;
            let maxActionPoints = 0;

            if (isCharacterToken) {
                // For character tokens, use their actual AP from character store
                const useCharacterStore = require('./characterStore').default;
                const char = useCharacterStore.getState();
                maxActionPoints = char.actionPoints?.max || char.derivedStats?.maxActionPoints || 3;
                // Calculate current AP based on initiative roll
                if (initiative >= 1 && initiative <= 5) currentActionPoints = 0;
                else if (initiative >= 6 && initiative <= 10) currentActionPoints = 1;
                else if (initiative >= 11 && initiative <= 15) currentActionPoints = 2;
                else if (initiative >= 16 && initiative <= 20) currentActionPoints = 3;
                else if (initiative >= 21) currentActionPoints = 4;
            } else {
                // For creature tokens, get max AP from creature stats
                maxActionPoints = creature.stats?.maxActionPoints || 6;
                // Calculate current AP based on initiative roll
                if (initiative >= 1 && initiative <= 5) currentActionPoints = 0;
                else if (initiative >= 6 && initiative <= 10) currentActionPoints = 1;
                else if (initiative >= 11 && initiative <= 15) currentActionPoints = 2;
                else if (initiative >= 16 && initiative <= 20) currentActionPoints = 3;
                else if (initiative >= 21) currentActionPoints = 4;
            }

            return {
                tokenId: token.id,
                creatureId: creature.id,
                name: creature.name,
                initiative,
                d20Roll,
                agilityMod: Math.floor((creature.stats.agility - 10) / 2),
                initiativeMod,
                tokenIcon: creature.tokenIcon,
                tokenBorder: creature.tokenBorder,
                currentActionPoints,
                maxActionPoints,
                isCharacterToken
            };
        }).filter(Boolean);

        // Sort by initiative (highest first)
        const sortedCombatants = combatants.sort((a, b) => b.initiative - a.initiative);

        // Generate timeline with round separators
        const timeline = generateCombatTimeline(sortedCombatants, 5); // 5 rounds ahead

        // Initialize turn timers for all combatants
        const turnTimers = new Map();
        sortedCombatants.forEach(combatant => {
            turnTimers.set(combatant.tokenId, {
                totalTime: 0,
                isActive: false,
                startTime: null
            });
        });

        // Start timer for first combatant
        const firstCombatant = sortedCombatants[0];
        if (firstCombatant) {
            turnTimers.set(firstCombatant.tokenId, {
                totalTime: 0,
                isActive: true,
                startTime: Date.now()
            });
        }

        set({
            isInCombat: true,
            isSelectionMode: false,
            round: 1,
            turnOrder: sortedCombatants,
            currentTurnIndex: 0,
            selectedTokens: new Set(),
            combatTimeline: timeline,
            turnTimers,
            currentTurnStartTime: Date.now(),
            turnMovementUsed: new Map(), // Reset movement tracking for new combat
            activeMovement: null,
            pendingMovementConfirmation: null
        });

        // CRITICAL FIX: Sync initial AP to character store AND party store for ALL character tokens
        sortedCombatants.forEach(combatant => {
            if (combatant.isCharacterToken) {
                try {
                    // Sync to character store (for local player)
                    const useCharacterStore = require('./characterStore').default;
                    useCharacterStore.getState().updateResource(
                        'actionPoints',
                        combatant.currentActionPoints,
                        combatant.maxActionPoints
                    );

                    // Sync to party store (for Party HUD display)
                    const usePartyStore = require('./partyStore').default;
                    usePartyStore.getState().updatePartyMember('current-player', {
                        character: {
                            ...usePartyStore.getState().partyMembers.find(m => m.id === 'current-player')?.character,
                            actionPoints: {
                                current: combatant.currentActionPoints,
                                max: combatant.maxActionPoints
                            }
                        }
                    });

                } catch (error) {
                    console.error('❌ Failed to sync initial character AP:', error);
                }
            }
        });

        // MULTIPLAYER SYNC: Broadcast combat start to other players
        try {
            const useGameStore = require('./gameStore').default;
            const gameState = useGameStore.getState();

            if (gameState.isInMultiplayer && gameState.multiplayerSocket?.connected) {
                gameState.multiplayerSocket.emit('combat_started', {
                    turnOrder: sortedCombatants,
                    round: 1,
                    currentTurnIndex: 0,
                    timestamp: Date.now()
                });
                console.log('⚔️ Emitted combat_started to server');
            }
        } catch (error) {
            console.warn('Failed to emit combat_started:', error);
        }
    },

    // Record turn start position for a token
    recordTurnStartPosition: (tokenId, position) => {
        const state = get();
        const newTurnStartPositions = new Map(state.turnStartPositions);
        newTurnStartPositions.set(tokenId, position);
        set({ turnStartPositions: newTurnStartPositions });
        // Turn start position recorded
    },

    // Get turn start position for a token
    getTurnStartPosition: (tokenId) => {
        const state = get();
        return state.turnStartPositions.get(tokenId);
    },

    // Update initiative for a combatant (for delayed joins or corrections)
    updateInitiative: (tokenId, newInitiative) => set(state => {
        const updatedTurnOrder = state.turnOrder.map(combatant => {
            if (combatant.tokenId === tokenId) {
                return { ...combatant, initiative: newInitiative };
            }
            return combatant;
        });

        // Re-sort by initiative
        const sortedTurnOrder = updatedTurnOrder.sort((a, b) => b.initiative - a.initiative);

        // Update current turn index if needed
        let newCurrentTurnIndex = state.currentTurnIndex;
        const currentCombatant = state.turnOrder[state.currentTurnIndex];
        if (currentCombatant && currentCombatant.tokenId === tokenId) {
            // If we updated the current combatant's initiative, find their new position
            newCurrentTurnIndex = sortedTurnOrder.findIndex(c => c.tokenId === tokenId);
        }

        return {
            turnOrder: sortedTurnOrder,
            currentTurnIndex: newCurrentTurnIndex
        };
    }),

    // Set turn order (for synchronization)
    setTurnOrder: (newTurnOrder) => set({
        turnOrder: newTurnOrder
    }),

    // End current turn and move to next
    nextTurn: () => set(state => {
        const currentTime = Date.now();
        const currentCombatant = state.turnOrder[state.currentTurnIndex];
        const nextIndex = (state.currentTurnIndex + 1) % state.turnOrder.length;
        const newRound = nextIndex === 0 ? state.round + 1 : state.round;
        const config = state.combatConfig;

        // Clear movement tracking for the ending turn
        const newTurnMovementUsed = new Map(state.turnMovementUsed);
        const newMovementUnlocked = new Set(state.movementUnlocked);
        const newTurnStartPositions = new Map(state.turnStartPositions);

        if (currentCombatant) {
            // Clear all movement data for the ending turn
            newTurnMovementUsed.delete(currentCombatant.tokenId);
            newMovementUnlocked.delete(currentCombatant.tokenId);
            newTurnStartPositions.delete(currentCombatant.tokenId);

            // Process over-time effects (DOT/HOT) at turn end
            try {
                const { processOverTimeEffectsForTarget } = require('../services/effectProcessingService');
                processOverTimeEffectsForTarget(currentCombatant.tokenId, 'turn_end');
            } catch (error) {
                console.warn('Failed to process turn-end over-time effects:', error);
            }

            // Decrement round-based conditions for the ending turn
            try {
                const { decrementRoundBasedBuffs } = require('./buffStore').default.getState();
                const { decrementRoundBasedDebuffs } = require('./debuffStore').default.getState();
                decrementRoundBasedBuffs(currentCombatant.tokenId);
                decrementRoundBasedDebuffs(currentCombatant.tokenId);
                // Turn end - decremented round-based conditions
            } catch (error) {
                // Failed to decrement round-based conditions
            }

            // Process turn-based cooldowns
            try {
                const { processTurnBasedCooldowns } = require('../components/spellcrafting-wizard/core/mechanics/cooldownSystem');
                processTurnBasedCooldowns();
            } catch (error) {
                console.warn('Failed to process turn-based cooldowns:', error);
            }

            // Turn end - cleared movement data
        }

        // Update timer for current combatant (end their turn)
        const updatedTimers = new Map(state.turnTimers);
        if (currentCombatant && state.currentTurnStartTime) {
            const currentTimer = updatedTimers.get(currentCombatant.tokenId) || { totalTime: 0, isActive: false, startTime: null };
            const turnDuration = currentTime - state.currentTurnStartTime;
            updatedTimers.set(currentCombatant.tokenId, {
                totalTime: currentTimer.totalTime + turnDuration,
                isActive: false,
                startTime: null
            });
        }

        // Start timer for next combatant
        const nextCombatant = state.turnOrder[nextIndex];
        if (nextCombatant) {
            updatedTimers.set(nextCombatant.tokenId, {
                ...updatedTimers.get(nextCombatant.tokenId),
                isActive: true,
                startTime: currentTime
            });
        }

        // Roll new initiative for next combatant and calculate AP
        const updatedTurnOrder = state.turnOrder.map((combatant, index) => {
            if (index === nextIndex) {
                // Roll new initiative (d20 + initiative modifier)
                const d20Roll = Math.floor(Math.random() * 20) + 1;
                const initiativeMod = combatant.initiativeMod || combatant.agilityMod || 0;
                const newInitiative = d20Roll + initiativeMod;

                // Calculate AP based on config
                let currentActionPoints = 0;
                const maxActionPoints = combatant.maxActionPoints;

                if (config.apRestorationMode === 'max') {
                    // Restore to max AP
                    currentActionPoints = maxActionPoints;
                } else if (config.apRestorationMode === 'set') {
                    // Restore to set amount (capped at max)
                    currentActionPoints = Math.min(config.apRestorationAmount, maxActionPoints);
                } else if (config.apRestorationMode === 'initiative') {
                    // Calculate AP based on initiative roll (default behavior)
                    if (newInitiative >= 1 && newInitiative <= 5) currentActionPoints = 0;
                    else if (newInitiative >= 6 && newInitiative <= 10) currentActionPoints = 1;
                    else if (newInitiative >= 11 && newInitiative <= 15) currentActionPoints = 2;
                    else if (newInitiative >= 16 && newInitiative <= 20) currentActionPoints = 3;
                    else if (newInitiative >= 21) currentActionPoints = 4;
                }

                return {
                    ...combatant,
                    initiative: newInitiative,
                    d20Roll: d20Roll,
                    currentActionPoints,
                    maxActionPoints
                };
            }
            return combatant;
        });

        // CRITICAL FIX: Sync AP to character store AND party store when character's turn starts
        const nextCombatantData = updatedTurnOrder[nextIndex];
        if (nextCombatantData?.isCharacterToken) {
            try {
                // Sync to character store
                const useCharacterStore = require('./characterStore').default;
                useCharacterStore.getState().updateResource(
                    'actionPoints',
                    nextCombatantData.currentActionPoints,
                    nextCombatantData.maxActionPoints
                );

                // Sync to party store
                const usePartyStore = require('./partyStore').default;
                const currentMember = usePartyStore.getState().partyMembers.find(m => m.id === 'current-player');
                if (currentMember) {
                    usePartyStore.getState().updatePartyMember('current-player', {
                        character: {
                            ...currentMember.character,
                            actionPoints: {
                                current: nextCombatantData.currentActionPoints,
                                max: nextCombatantData.maxActionPoints
                            }
                        }
                    });
                }

            } catch (error) {
                console.error('❌ Failed to sync character AP on turn start:', error);
            }
        }

        // Apply health/mana regen based on config
        if (nextCombatant && (config.healthRegenEnabled || config.manaRegenEnabled)) {
            try {
                const useCreatureStore = require('./creatureStore').default;
                const creatures = useCreatureStore.getState().creatures;
                const creature = creatures.find(c => c.id === nextCombatant.creatureId);

                // Handle character tokens
                if (nextCombatant.isCharacterToken) {
                    const useCharacterStore = require('./characterStore').default;
                    const charState = useCharacterStore.getState();
                    const totalStats = charState.getTotalStatsWithEffects?.() || {};

                    if (config.healthRegenEnabled && totalStats.healthRegen) {
                        const healthRegen = Math.round(totalStats.healthRegen || 0);
                        if (healthRegen > 0) {
                            charState.updateResource('health', healthRegen, null, false);
                        }
                    }

                    if (config.manaRegenEnabled && totalStats.manaRegen) {
                        const manaRegen = Math.round(totalStats.manaRegen || 0);
                        if (manaRegen > 0) {
                            charState.updateResource('mana', manaRegen, null, false);
                        }
                    }
                } else if (creature) {
                    // Handle creature tokens - calculate regen from stats
                    const tokens = useCreatureStore.getState().tokens;
                    const token = tokens.find(t => t.id === nextCombatant.tokenId);

                    if (token) {
                        if (config.healthRegenEnabled) {
                            const constitution = creature.stats?.constitution || 10;
                            const healthRegen = Math.floor(constitution / 2);
                            if (healthRegen > 0) {
                                const currentHp = token.state?.currentHp || 0;
                                const maxHp = creature.stats?.maxHp || 100;
                                const newHp = Math.min(maxHp, currentHp + healthRegen);
                                useCreatureStore.getState().updateTokenState(nextCombatant.tokenId, { currentHp: newHp });
                                // Sync to combat timeline
                                get().updateCombatantHP(nextCombatant.tokenId, newHp);
                            }
                        }

                        if (config.manaRegenEnabled) {
                            const intelligence = creature.stats?.intelligence || 10;
                            const spirit = creature.stats?.spirit || 10;
                            const manaRegen = Math.floor((intelligence + spirit) / 4);
                            if (manaRegen > 0) {
                                const currentMana = token.state?.currentMana || 0;
                                const maxMana = creature.stats?.maxMana || 0;
                                const newMana = Math.min(maxMana, currentMana + manaRegen);
                                useCreatureStore.getState().updateTokenState(nextCombatant.tokenId, { currentMana: newMana });
                                // Sync to combat timeline
                                get().updateCombatantMana(nextCombatant.tokenId, newMana);
                            }
                        }
                    }
                }
            } catch (error) {
                console.warn('Failed to apply health/mana regen:', error);
            }
        }

        // Process over-time effects (DOT/HOT) at turn start for the next combatant
        if (nextCombatant) {
            try {
                const { processOverTimeEffectsForTarget } = require('../services/effectProcessingService');
                processOverTimeEffectsForTarget(nextCombatant.tokenId, 'turn');
            } catch (error) {
                console.warn('Failed to process turn-start over-time effects:', error);
            }
        }

        // Process round-start effects when a new round begins
        if (newRound > state.round) {
            try {
                const { processOverTimeEffectsForTarget } = require('../services/effectProcessingService');
                // Process round-based effects for all combatants
                state.turnOrder.forEach(combatant => {
                    processOverTimeEffectsForTarget(combatant.tokenId, 'round');
                });
            } catch (error) {
                console.warn('Failed to process round-start over-time effects:', error);
            }
        }

        const newState = {
            currentTurnIndex: nextIndex,
            round: newRound,
            turnOrder: updatedTurnOrder,
            turnTimers: updatedTimers,
            currentTurnStartTime: currentTime,
            turnMovementUsed: newTurnMovementUsed,
            movementUnlocked: newMovementUnlocked,
            turnStartPositions: newTurnStartPositions,
            // Clear any pending movement confirmations
            pendingMovementConfirmation: null,
            activeMovement: null,
            tempMovementDistance: new Map(state.tempMovementDistance)
        };

        // MULTIPLAYER SYNC: Emit turn change to other players
        // Use setTimeout to ensure this runs after state update
        setTimeout(() => {
            try {
                const useGameStore = require('./gameStore').default;
                const gameState = useGameStore.getState();
                console.log('⚔️ Combat turn sync check:', {
                    isInMultiplayer: gameState.isInMultiplayer,
                    hasSocket: !!gameState.multiplayerSocket,
                    socketConnected: gameState.multiplayerSocket?.connected,
                    nextIndex,
                    newRound
                });
                if (gameState.isInMultiplayer && gameState.multiplayerSocket?.connected) {
                    gameState.multiplayerSocket.emit('combat_turn_changed', {
                        currentTurnIndex: nextIndex,
                        round: newRound,
                        turnOrder: updatedTurnOrder,
                        timestamp: Date.now()
                    });
                    console.log('⚔️ Emitted combat_turn_changed to server');
                } else {
                    console.log('⚔️ NOT syncing - not in multiplayer or socket not connected');
                }
            } catch (e) {
                console.warn('Failed to sync combat turn:', e);
            }
        }, 0);

        return newState;
    }),

    // End combat
    endCombat: () => {
        set({
            isInCombat: false,
            isSelectionMode: false,
            round: 1,
            turnOrder: [],
            currentTurnIndex: 0,
            selectedTokens: new Set(),
            combatTimeline: [],
            turnTimers: new Map(),
            currentTurnStartTime: null,
            turnMovementUsed: new Map(),
            movementUnlocked: new Set(),
            turnStartPositions: new Map(),
            activeMovement: null,
            pendingMovementConfirmation: null
        });

        // MULTIPLAYER SYNC: Broadcast combat end to other players
        try {
            const useGameStore = require('./gameStore').default;
            const gameState = useGameStore.getState();

            if (gameState.isInMultiplayer && gameState.multiplayerSocket?.connected) {
                gameState.multiplayerSocket.emit('combat_ended', {
                    timestamp: Date.now()
                });
                console.log('🏳️ Emitted combat_ended to server');
            }
        } catch (error) {
            console.warn('Failed to emit combat_ended:', error);
        }
    },

    // Reorder turn order (for drag and drop)
    reorderTurnOrder: (newTurnOrder) => set(state => {
        // Adjust currentTurnIndex to maintain the same current combatant
        const currentCombatant = state.turnOrder[state.currentTurnIndex];
        const newCurrentIndex = newTurnOrder.findIndex(c => c.tokenId === currentCombatant?.tokenId);

        return {
            turnOrder: newTurnOrder,
            currentTurnIndex: newCurrentIndex >= 0 ? newCurrentIndex : 0
        };
    }),

    // Force reset combat state (for debugging/emergency)
    forceResetCombat: () => {
        // Force resetting combat state
        set({
            isInCombat: false,
            isSelectionMode: false,
            round: 1,
            turnOrder: [],
            currentTurnIndex: 0,
            selectedTokens: new Set(),
            combatTimeline: [],
            turnTimers: new Map(),
            currentTurnStartTime: null,
            turnMovementUsed: new Map(),
            movementThisTurn: new Map(),
            movementUnlocked: new Set(),
            activeMovement: null,
            pendingMovementConfirmation: null
        });
    },

    // Debug function to log current state
    debugCombatState: () => {
        get();
        // Combat store state debug
    },

    // Clear localStorage for combat store
    clearCombatStorage: () => {
        localStorage.removeItem('combat-store');
        // Combat store localStorage cleared
    },

    // Update timeline position
    updateTimelinePosition: (position) => set({ timelinePosition: position }),

    updateCombatConfig: (config) => set(state => ({
        combatConfig: { ...state.combatConfig, ...config }
    })),

    // Update timeline size
    updateTimelineSize: (size) => set({ timelineSize: size }),

    // Reset timeline position to default
    resetTimelinePosition: () => set({ timelinePosition: { x: 300, y: 100 } }),

    // Movement tracking functions
    startMovementTracking: (tokenId, startPosition) => {
        const state = get();
        const newMovementThisTurn = new Map(state.movementThisTurn);
        newMovementThisTurn.set(tokenId, {
            startPosition,
            totalDistance: 0
        });
        set({
            movementThisTurn: newMovementThisTurn,
            movementPath: [startPosition],
            tempMovementDistance: new Map(state.tempMovementDistance).set(tokenId, 0)
        });
    },

    updateMovementPath: (position) => {
        const state = get();
        set({ movementPath: [...state.movementPath, position] });
    },

    // Update temporary movement distance during drag
    updateTempMovementDistance: (tokenId, distance) => {
        const state = get();
        // Ensure tempMovementDistance is a Map
        const currentTempMovement = state.tempMovementDistance instanceof Map
            ? state.tempMovementDistance
            : new Map();
        const newTempMovement = new Map(currentTempMovement);
        newTempMovement.set(tokenId, distance);
        set({ tempMovementDistance: newTempMovement });
    },

    calculateMovementDistance: (path, feetPerTile = 5) => {
        if (path.length < 2) return 0;

        let totalDistance = 0;
        for (let i = 1; i < path.length; i++) {
            const prev = path[i - 1];
            const curr = path[i];
            const dx = curr.x - prev.x;
            const dy = curr.y - prev.y;
            const tileDistance = Math.sqrt(dx * dx + dy * dy);
            totalDistance += tileDistance * feetPerTile;
        }
        return totalDistance;
    },

    finishMovementTracking: (tokenId, endPosition) => {
        const state = get();
        const movementData = state.movementThisTurn.get(tokenId);
        if (!movementData) return 0;

        const finalPath = [...state.movementPath, endPosition];
        const totalDistance = get().calculateMovementDistance(finalPath);

        const newMovementThisTurn = new Map(state.movementThisTurn);
        newMovementThisTurn.set(tokenId, {
            ...movementData,
            totalDistance
        });

        set({
            movementThisTurn: newMovementThisTurn,
            movementPath: []
        });

        return totalDistance;
    },

    clearMovementTracking: (tokenId) => {
        const state = get();
        const newMovementThisTurn = new Map(state.movementThisTurn);
        newMovementThisTurn.delete(tokenId);
        set({
            movementThisTurn: newMovementThisTurn,
            movementPath: []
        });
    },

    // Movement visualization functions
    startMovementVisualization: (tokenId, startPosition) => {
        set({
            activeMovement: {
                tokenId,
                startPosition,
                currentPosition: startPosition
            }
        });
    },

    updateMovementVisualization: (currentPosition) => {
        const state = get();
        if (state.activeMovement) {
            set({
                activeMovement: {
                    ...state.activeMovement,
                    currentPosition
                }
            });
        }
    },

    clearMovementVisualization: () => {
        // Clearing movement visualization
        set({
            activeMovement: null
            // DO NOT clear pendingMovementConfirmation here - it should only be cleared by the dialog
        });
    },

    // Movement validation and AP calculation
    validateMovement: (tokenId, dragStartPosition, endPosition, creatures, feetPerTile = 5) => {
        const state = get();
        const combatant = state.turnOrder.find(c => c.tokenId === tokenId);

        if (!combatant) {
            return { isValid: false, reason: 'Token not in combat' };
        }

        // Find creature data - handle character tokens
        let creature = creatures.find(c => c.id === combatant.creatureId);

        if (!creature && combatant.isCharacterToken) {
            const useCharacterStore = require('./characterStore').default;
            const char = useCharacterStore.getState();
            // CRITICAL FIX: Use moveSpeed (not movementSpeed) - matches characterUtils.js
            const characterSpeed = char.derivedStats?.moveSpeed || 30;
            creature = {
                id: combatant.creatureId,
                name: char.name || 'Character',
                stats: { speed: characterSpeed }
            };
        }

        if (!creature) {
            return { isValid: false, reason: 'Creature data not found' };
        }

        // Record turn start position if this is the first movement of the turn
        const turnStartPosition = state.turnStartPositions.get(tokenId);
        if (!turnStartPosition) {
            get().recordTurnStartPosition(tokenId, dragStartPosition);
        }

        // Get grid system for proper tile calculations
        const gridSystem = window.gridSystem || {
            worldToGrid: (x, y) => ({ x: Math.round(x / 50), y: Math.round(y / 50) }),
            getGridState: () => ({ gridSize: 50 })
        };

        // Calculate movement distance for THIS SPECIFIC MOVE using D&D/Pathfinder tile-based movement
        const dragStartGrid = gridSystem.worldToGrid(dragStartPosition.x, dragStartPosition.y);
        const endGrid = gridSystem.worldToGrid(endPosition.x, endPosition.y);

        const tileDx = endGrid.x - dragStartGrid.x;  // Don't use Math.abs here - we need the sign
        const tileDy = endGrid.y - dragStartGrid.y;  // Don't use Math.abs here - we need the sign
        const absTileDx = Math.abs(tileDx);
        const absTileDy = Math.abs(tileDy);

        // Calculate movement cost for this move using D&D/Pathfinder rules:
        // - Horizontal/Vertical: 5 feet per tile
        // - Diagonal: 8 feet per tile (alternating 5ft/10ft, but we'll use 8ft average)
        let currentMoveFeet;

        if (absTileDx === 0 || absTileDy === 0) {
            // Pure horizontal or vertical movement
            const tiles = Math.max(absTileDx, absTileDy);
            currentMoveFeet = tiles * 5; // 5 feet per tile
        } else {
            // Mixed movement with diagonals
            const diagonalTiles = Math.min(absTileDx, absTileDy);
            const straightTiles = Math.abs(absTileDx - absTileDy);
            currentMoveFeet = (diagonalTiles * 8) + (straightTiles * 5); // 8ft diagonal, 5ft straight
        }

        // Calculate ADDITIVE movement tracking
        const movementUsedThisTurn = state.turnMovementUsed.get(tokenId) || 0;
        const totalMovementAfterThis = movementUsedThisTurn + currentMoveFeet; // ADD current move to existing movement

        // Get token conditions for speed calculation
        // Check both creature tokens and character tokens
        const useCreatureStore = require('./creatureStore').default;
        let token = useCreatureStore.getState().tokens.find(t => t.id === tokenId);
        if (!token && combatant.isCharacterToken) {
            const useCharacterTokenStore = require('./characterTokenStore').default;
            token = useCharacterTokenStore.getState().characterTokens.find(t => t.id === tokenId);
        }
        const conditions = token?.state?.conditions || [];

        // Get base creature speed and apply condition modifiers
        const baseSpeed = creature.stats?.speed || 30;
        const creatureSpeed = calculateEffectiveMovementSpeed(baseSpeed, conditions);
        const currentAP = combatant.currentActionPoints || 0;

        // Movement AP calculation logic
        let additionalAPNeeded = 0;
        let needsConfirmation = false;
        const hasUnlockedMovement = state.movementUnlocked.has(tokenId);

        // CRITICAL: Determine if confirmation is needed
        // The key issue is that we need to FORCE confirmation for first movement

        if (!hasUnlockedMovement || movementUsedThisTurn === 0) {
            // FIRST MOVEMENT OF THE TURN - ALWAYS requires confirmation and 1 AP
            additionalAPNeeded = 1;
            needsConfirmation = true;
            return {
                currentMoveFeet: Math.round(currentMoveFeet),
                totalMovementAfterThis: Math.round(totalMovementAfterThis),
                creatureSpeed,
                currentAP,
                additionalAPNeeded,
                needsConfirmation,
                reason: !hasUnlockedMovement ? 'Movement not unlocked' : 'No movement used this turn'
            };
        } else {
            // Movement is already unlocked - get the current total unlocked movement
            const totalUnlockedMovement = get().getTotalUnlockedMovement(tokenId, creatures);

            if (totalMovementAfterThis > totalUnlockedMovement) {
                // Need additional AP for movement beyond unlocked amount
                const excessMovement = totalMovementAfterThis - totalUnlockedMovement;
                const additionalSegments = Math.ceil(excessMovement / creatureSpeed);
                additionalAPNeeded = additionalSegments;
                needsConfirmation = true; // Always confirm when spending additional AP
            } else {
                // Within unlocked movement - no additional AP needed, no confirmation required
                additionalAPNeeded = 0;
                needsConfirmation = false;
            }
        }

        // Check if this movement exceeds what we can do with current AP
        const isValid = currentAP >= additionalAPNeeded;

        // Calculate movement segments for return data
        const movementSegmentsUsed = Math.ceil(movementUsedThisTurn / creatureSpeed);
        const movementSegmentsAfterThis = Math.ceil(totalMovementAfterThis / creatureSpeed);

        const result = {
            isValid,
            currentMovementFeet: currentMoveFeet, // Distance of this specific move
            totalMovementAfterThis,
            movementUsedThisTurn,
            remainingMovement: Math.max(0, (movementSegmentsUsed * creatureSpeed) - movementUsedThisTurn),
            creatureSpeed,
            currentAP,
            additionalAPNeeded,
            movementSegmentsNeeded: movementSegmentsAfterThis,
            movementSegmentsAlreadyPaid: movementSegmentsUsed,
            needsConfirmation,
            reason: !isValid ? 'Insufficient Action Points' : null
        };

        return result;
    },

    // Set pending movement confirmation
    setPendingMovementConfirmation: (movementData) => {
        set({ pendingMovementConfirmation: movementData });
    },

    // Clear pending movement confirmation
    clearPendingMovementConfirmation: () => {
        // Don't clear tempMovementDistance here - let the component handle it
        set({
            pendingMovementConfirmation: null,
            activeMovement: null
        });
    },

    // Confirm movement and spend AP
    confirmMovement: (tokenId, apCost, totalMovementDistance) => {
        const state = get();

        // Spend the required AP
        get().spendActionPoints(tokenId, apCost);

        // Set the total movement used this turn to the provided total
        const newTurnMovementUsed = new Map(state.turnMovementUsed);
        newTurnMovementUsed.set(tokenId, totalMovementDistance);

        // Mark movement as unlocked for this token
        const newMovementUnlocked = new Set(state.movementUnlocked);
        newMovementUnlocked.add(tokenId);

        // Clear movement states and temporary tracking for this token
        const currentTempMovement = state.tempMovementDistance instanceof Map
            ? state.tempMovementDistance
            : new Map();
        const newTempMovement = new Map(currentTempMovement);
        newTempMovement.set(tokenId, 0);

        set({
            activeMovement: null,
            pendingMovementConfirmation: null,
            turnMovementUsed: newTurnMovementUsed,
            movementUnlocked: newMovementUnlocked,
            tempMovementDistance: newTempMovement
        });

        return true;
    },

    // Add movement without confirmation (for base movement)
    addMovementUsed: (tokenId, movementDistance) => {
        const state = get();
        const currentUsed = state.turnMovementUsed.get(tokenId) || 0;
        const newTurnMovementUsed = new Map(state.turnMovementUsed);
        newTurnMovementUsed.set(tokenId, currentUsed + movementDistance);

        set({ turnMovementUsed: newTurnMovementUsed });
    },

    // Get remaining movement for a token
    getRemainingMovement: (tokenId, creatures) => {
        const state = get();
        const combatant = state.turnOrder.find(c => c.tokenId === tokenId);
        if (!combatant) return 0;

        // Find creature data - handle character tokens
        let creature = creatures.find(c => c.id === combatant.creatureId);

        if (!creature && combatant.isCharacterToken) {
            const useCharacterStore = require('./characterStore').default;
            const char = useCharacterStore.getState();
            // CRITICAL FIX: Use moveSpeed (not movementSpeed) - matches characterUtils.js
            creature = {
                id: combatant.creatureId,
                name: char.name || 'Character',
                stats: { speed: char.derivedStats?.moveSpeed || 30 }
            };
        }

        if (!creature) return 0;

        const creatureSpeed = creature.stats?.speed || 30;
        const currentAP = combatant.currentActionPoints || 0;
        const movementUsed = state.turnMovementUsed.get(tokenId) || 0;
        const hasUnlockedMovement = state.movementUnlocked.has(tokenId);

        if (!hasUnlockedMovement) {
            // No movement unlocked yet - can move up to speed with 1 AP
            return currentAP > 0 ? creatureSpeed : 0;
        } else {
            // Movement is unlocked - get total unlocked movement from the dedicated function
            const totalUnlockedMovement = get().getTotalUnlockedMovement(tokenId, creatures);
            const remainingUnlocked = Math.max(0, totalUnlockedMovement - movementUsed);

            // Plus additional movement from remaining AP (if any)
            const additionalMovement = Math.max(0, currentAP) * creatureSpeed; // Each remaining AP unlocks another segment

            return remainingUnlocked + additionalMovement;
        }
    },

    // Get total unlocked movement for a token
    getTotalUnlockedMovement: (tokenId, creatures) => {
        const state = get();
        const combatant = state.turnOrder.find(c => c.tokenId === tokenId);
        if (!combatant) return 0;

        // Find creature data - handle character tokens
        let creature = creatures.find(c => c.id === combatant.creatureId);

        if (!creature && combatant.isCharacterToken) {
            const useCharacterStore = require('./characterStore').default;
            const char = useCharacterStore.getState();
            // CRITICAL FIX: Use moveSpeed (not movementSpeed) - matches characterUtils.js
            creature = {
                id: combatant.creatureId,
                name: char.name || 'Character',
                stats: { speed: char.derivedStats?.moveSpeed || 30 }
            };
        }

        if (!creature) return 0;

        // Get token conditions for speed calculation
        // Check both creature tokens and character tokens
        const useCreatureStore = require('./creatureStore').default;
        let token = useCreatureStore.getState().tokens.find(t => t.id === tokenId);
        if (!token && combatant.isCharacterToken) {
            const useCharacterTokenStore = require('./characterTokenStore').default;
            token = useCharacterTokenStore.getState().characterTokens.find(t => t.id === tokenId);
        }
        const conditions = token?.state?.conditions || [];

        // Get base creature speed and apply condition modifiers
        const baseSpeed = creature.stats?.speed || 30;
        const creatureSpeed = calculateEffectiveMovementSpeed(baseSpeed, conditions);
        const movementUsed = state.turnMovementUsed.get(tokenId) || 0;
        const hasUnlockedMovement = state.movementUnlocked.has(tokenId);

        if (!hasUnlockedMovement) {
            return 0; // No movement unlocked yet
        } else {
            // Calculate total unlocked movement based on AP spent
            const movementSegmentsAlreadyPaid = Math.ceil(movementUsed / creatureSpeed);
            return movementSegmentsAlreadyPaid * creatureSpeed; // Each AP spent unlocks one movement segment
        }
    },

    // Get movement information for tooltips
    getMovementInfo: (tokenId, creatures) => {
        const state = get();
        const combatant = state.turnOrder.find(c => c.tokenId === tokenId);
        if (!combatant) return null;

        const creature = creatures.find(c => c.id === combatant.creatureId);
        if (!creature) return null;

        // Get token conditions for speed calculation
        // Check both creature tokens and character tokens
        const useCreatureStore = require('./creatureStore').default;
        let token = useCreatureStore.getState().tokens.find(t => t.id === tokenId);
        if (!token && combatant.isCharacterToken) {
            const useCharacterTokenStore = require('./characterTokenStore').default;
            token = useCharacterTokenStore.getState().characterTokens.find(t => t.id === tokenId);
        }
        const conditions = token?.state?.conditions || [];

        // Get base creature speed and apply condition modifiers
        const baseSpeed = creature.stats?.speed || 30;
        const creatureSpeed = calculateEffectiveMovementSpeed(baseSpeed, conditions);
        const currentAP = combatant.currentActionPoints || 0;
        const movementUsed = state.turnMovementUsed.get(tokenId) || 0;

        // Safety check for tempMovementDistance
        let tempMovement = 0;
        if (state.tempMovementDistance && typeof state.tempMovementDistance.get === 'function') {
            tempMovement = state.tempMovementDistance.get(tokenId) || 0;
        }

        const totalMovementUsed = movementUsed + tempMovement; // Include temporary movement
        const hasUnlockedMovement = state.movementUnlocked.has(tokenId);

        return {
            creatureSpeed,
            currentAP,
            movementUsed: totalMovementUsed, // Show total including temp movement
            hasUnlockedMovement,
            remainingMovement: get().getRemainingMovement(tokenId, creatures),
            unlockedMovement: hasUnlockedMovement ? get().getTotalUnlockedMovement(tokenId, creatures) : 0,
            canMove: currentAP > 0 || hasUnlockedMovement
        };
    },

    resetAllMovementTracking: () => {
        set({
            movementThisTurn: new Map(),
            movementPath: [],
            turnMovementUsed: new Map(),
            movementUnlocked: new Set(),
            turnStartPositions: new Map(),
            tempMovementDistance: new Map()
        });
    },

    // Check if it's the token's turn
    isTokensTurn: (tokenId) => {
        const state = get();
        const combatant = state.turnOrder[state.currentTurnIndex];
        return combatant?.tokenId === tokenId;
    },

    // Initialize store with proper Map/Set types
    initializeStore: () => {
        const state = get();

        // Performance Optimization: Check if initialization is already complete
        const isAlreadyInitialized =
            (state.turnMovementUsed instanceof Map) &&
            (state.movementThisTurn instanceof Map) &&
            (state.tempMovementDistance instanceof Map) &&
            (state.turnStartPositions instanceof Map) &&
            (state.movementUnlocked instanceof Set) &&
            (state.selectedTokens instanceof Set) &&
            (state.turnTimers instanceof Map) &&
            !(state.timelineSize && (state.timelineSize.height === 120 || state.timelineSize.width > 650));

        if (isAlreadyInitialized) return;

        const updates = {};

        // Ensure all Maps and Sets are properly initialized
        if (!(state.turnMovementUsed instanceof Map)) {
            updates.turnMovementUsed = new Map();
        }
        if (!(state.movementThisTurn instanceof Map)) {
            updates.movementThisTurn = new Map();
        }
        if (!(state.tempMovementDistance instanceof Map)) {
            updates.tempMovementDistance = new Map();
        }
        if (!(state.turnStartPositions instanceof Map)) {
            updates.turnStartPositions = new Map();
        }
        if (!(state.movementUnlocked instanceof Set)) {
            updates.movementUnlocked = new Set();
        }
        if (!(state.selectedTokens instanceof Set)) {
            updates.selectedTokens = new Set();
        }
        if (!(state.turnTimers instanceof Map)) {
            updates.turnTimers = new Map();
        }

        // Migrate old timeline size to new dimensions
        if (state.timelineSize && (state.timelineSize.height === 120 || state.timelineSize.width > 650)) {
            updates.timelineSize = { width: 450, height: 180 };
        }

        if (Object.keys(updates).length > 0) {
            set(updates);
        }
    },

    // Debug function to reset movement state
    resetMovementState: () => {
        set({
            turnMovementUsed: new Map(),
            movementUnlocked: new Set(),
            turnStartPositions: new Map(),
            activeMovement: null,
            pendingMovementConfirmation: null,
            tempMovementDistance: new Map()
        });
    },

    // Get current combatant
    getCurrentCombatant: () => {
        const state = get();
        return state.turnOrder[state.currentTurnIndex] || null;
    },

    // Check if it's a specific token's turn
    isTokensTurn: (tokenId) => {
        const state = get();
        // If not in combat, no token has a turn
        if (!state.isInCombat) return false;
        const currentCombatant = state.turnOrder[state.currentTurnIndex];
        return currentCombatant?.tokenId === tokenId;
    },

    // Spend action points
    spendActionPoints: (tokenId, amount) => {

        // Find the combatant to determine if it's a character or creature token
        const combatant = get().turnOrder.find(c => c.tokenId === tokenId);
        if (!combatant) {
            console.warn('⚠️ Cannot spend AP: combatant not found for tokenId:', tokenId);
            return;
        }

        // CRITICAL FIX: Calculate newAP BEFORE updating the store
        const newAP = Math.max(0, combatant.currentActionPoints - amount);

        // Update combat store turnOrder
        set(state => {
            const updatedTurnOrder = state.turnOrder.map(combatant => {
                if (combatant.tokenId === tokenId) {
                    return {
                        ...combatant,
                        currentActionPoints: newAP
                    };
                }
                return combatant;
            });

            return { turnOrder: updatedTurnOrder };
        });

        // CRITICAL FIX: Synchronize AP to other stores for consistent display
        if (combatant.isCharacterToken) {
            // Update character store AND party store for character tokens
            try {
                const useCharacterStore = require('./characterStore').default;
                const beforeAP = useCharacterStore.getState().actionPoints;

                // Sync to character store
                useCharacterStore.getState().updateResource('actionPoints', newAP, beforeAP.max);

                // Sync to party store
                const usePartyStore = require('./partyStore').default;
                const currentMember = usePartyStore.getState().partyMembers.find(m => m.id === 'current-player');
                if (currentMember) {
                    usePartyStore.getState().updatePartyMember('current-player', {
                        character: {
                            ...currentMember.character,
                            actionPoints: {
                                current: newAP,
                                max: beforeAP.max
                            }
                        }
                    });
                }

            } catch (error) {
                console.error('❌ Failed to sync AP to character/party store:', error);
            }
        } else {
            // Update creature token state for creature tokens
            try {
                const useCreatureStore = require('./creatureStore').default;
                useCreatureStore.getState().updateTokenState(tokenId, {
                    currentActionPoints: newAP
                });
            } catch (error) {
                console.error('❌ Failed to sync AP to creature token state:', error);
            }
        }
    },

    // Get timer info for a token
    getTimerInfo: (tokenId) => {
        const state = get();
        const timer = state.turnTimers.get(tokenId);
        if (!timer) return { totalTime: 0, currentTime: 0, isActive: false };

        let currentTime = 0;
        if (timer.isActive && timer.startTime) {
            currentTime = Date.now() - timer.startTime;
        }

        return {
            totalTime: timer.totalTime,
            currentTime,
            isActive: timer.isActive
        };
    },

    // CRITICAL FIX: Synchronize HP updates to combat timeline
    // This ensures the timeline shows current HP values
    updateCombatantHP: (tokenId, newHP) => {
        set(state => {
            const updatedTurnOrder = state.turnOrder.map(combatant => {
                if (combatant.tokenId === tokenId) {
                    return {
                        ...combatant,
                        currentHP: newHP
                    };
                }
                return combatant;
            });
            return { turnOrder: updatedTurnOrder };
        });
    },

    // CRITICAL FIX: Synchronize Mana updates to combat timeline
    // This ensures the timeline shows current Mana values
    updateCombatantMana: (tokenId, newMana) => {
        set(state => {
            const updatedTurnOrder = state.turnOrder.map(combatant => {
                if (combatant.tokenId === tokenId) {
                    return {
                        ...combatant,
                        currentMana: newMana
                    };
                }
                return combatant;
            });
            return { turnOrder: updatedTurnOrder };
        });
    }
}));

// Helper function to generate combat timeline
function generateCombatTimeline(combatants, rounds = 3) {
    const timeline = [];

    for (let round = 1; round <= rounds; round++) {
        // Add round separator
        timeline.push({
            type: 'round_separator',
            round,
            id: `round-${round}`
        });

        // Add combatants for this round
        combatants.forEach((combatant, index) => {
            timeline.push({
                type: 'combatant',
                ...combatant,
                round,
                turnId: `round-${round}-turn-${index}`,
                isCurrentTurn: round === 1 && index === 0
            });
        });
    }

    return timeline;
}

// Initialize the store to ensure proper Map/Set types
useCombatStore.getState().initializeStore();

// Expose store for debugging
if (typeof window !== 'undefined') {
    window.combatStore = useCombatStore;

    // Debug functions
    window.debugCombat = {
        resetMovement: () => {
            useCombatStore.getState().resetMovementState();
        },
        checkState: () => {
            useCombatStore.getState();
            // Combat state checked
        },
        forceUnlockMovement: (tokenId) => {
            const state = useCombatStore.getState();
            const newMovementUnlocked = new Set(state.movementUnlocked);
            newMovementUnlocked.add(tokenId);
            useCombatStore.setState({ movementUnlocked: newMovementUnlocked });
        },
        forceLockMovement: (tokenId) => {
            const state = useCombatStore.getState();
            const newMovementUnlocked = new Set(state.movementUnlocked);
            newMovementUnlocked.delete(tokenId);
            useCombatStore.setState({ movementUnlocked: newMovementUnlocked });
        },
        clearMovementData: (tokenId) => {
            const state = useCombatStore.getState();
            const newTurnMovementUsed = new Map(state.turnMovementUsed);
            const newMovementUnlocked = new Set(state.movementUnlocked);
            const newTurnStartPositions = new Map(state.turnStartPositions);

            newTurnMovementUsed.delete(tokenId);
            newMovementUnlocked.delete(tokenId);
            newTurnStartPositions.delete(tokenId);

            useCombatStore.setState({
                turnMovementUsed: newTurnMovementUsed,
                movementUnlocked: newMovementUnlocked,
                turnStartPositions: newTurnStartPositions
            });
        },
        initializeStore: () => {
            useCombatStore.getState().initializeStore();
        },
        testMovementConfirmation: (tokenId) => {
            useCombatStore.getState();
            // Test movement confirmation
        },
        forceShowMovementDialog: (tokenId) => {
            const testData = {
                tokenId,
                baseMovement: 30,
                totalDistance: 25,
                currentMovementDistance: 25,
                movementUsedThisTurn: 0,
                feetPerTile: 5,
                currentAP: 2,
                requiredAP: 1,
                creatureName: 'Test Creature',
                finalPosition: { x: 100, y: 100 },
                startPosition: { x: 50, y: 50 }
            };
            useCombatStore.setState({
                pendingMovementConfirmation: testData
            });
        },
        simulateFirstMovement: (tokenId) => {
            const state = useCombatStore.getState();

            // Clear movement state to simulate fresh turn
            const newTurnMovementUsed = new Map(state.turnMovementUsed);
            const newMovementUnlocked = new Set(state.movementUnlocked);
            newTurnMovementUsed.delete(tokenId);
            newMovementUnlocked.delete(tokenId);

            useCombatStore.setState({
                turnMovementUsed: newTurnMovementUsed,
                movementUnlocked: newMovementUnlocked
            });
        },
        testMovementValidation: (tokenId, startPos, endPos) => {
            const state = useCombatStore.getState();
            const creatures = window.creatureStore?.getState()?.creatures || [];

            const result = state.validateMovement(
                tokenId,
                startPos || { x: 100, y: 100 },
                endPos || { x: 150, y: 150 },
                creatures,
                5
            );

            return result;
        },
        debugMovementSystem: () => {
            useCombatStore.getState();
            // Debug movement system
        }
    };
}

export default useCombatStore;
