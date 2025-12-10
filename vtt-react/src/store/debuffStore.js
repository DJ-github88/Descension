import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useGameStore from './gameStore';

const useDebuffStore = create(
    persist(
        (set, get) => ({
            activeDebuffs: [],
            
            // Add a new debuff
            addDebuff: (debuff) => {
                const { activeDebuffs } = get();
                const newDebuff = {
                    id: `debuff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    name: debuff.name,
                    icon: debuff.icon,
                    description: debuff.description,
                    effects: debuff.effects || {},
                    duration: debuff.duration || 60, // Duration in seconds
                    startTime: Date.now(),
                    source: debuff.source || 'spell',
                    stackable: debuff.stackable || false,
                    type: 'debuff',
                    // New targeting properties
                    targetId: debuff.targetId || 'player', // Default to player if not specified
                    targetType: debuff.targetType || 'player', // 'player', 'token', 'creature'
                    color: debuff.color || '#DC143C',
                    // Round-based duration properties
                    durationType: debuff.durationType || 'minutes',
                    durationValue: debuff.durationValue,
                    remainingRounds: debuff.remainingRounds
                };

                // For round-based debuffs, don't set endTime (they don't expire automatically)
                if (debuff.durationType !== 'rounds') {
                    newDebuff.endTime = Date.now() + (debuff.duration || 60) * 1000;
                }

                // Check if debuff is stackable (now also considers target)
                if (!newDebuff.stackable) {
                    // Remove existing debuff with same name and target
                    const filteredDebuffs = activeDebuffs.filter(d =>
                        !(d.name === newDebuff.name && d.targetId === newDebuff.targetId)
                    );
                    set({ activeDebuffs: [...filteredDebuffs, newDebuff] });
                } else {
                    set({ activeDebuffs: [...activeDebuffs, newDebuff] });
                }

                // Sync with multiplayer
                get().syncDebuffUpdate('debuff_added', newDebuff);

                // Set up automatic removal timer (only for time-based debuffs)
                if (newDebuff.durationType !== 'rounds') {
                    setTimeout(() => {
                        get().removeDebuff(newDebuff.id);
                    }, newDebuff.duration * 1000);
                }
            },

            // Remove a debuff by ID - also cleans up token.state.conditions
            removeDebuff: (debuffId) => {
                const { activeDebuffs } = get();
                const debuffToRemove = activeDebuffs.find(debuff => debuff.id === debuffId);

                set({ activeDebuffs: activeDebuffs.filter(debuff => debuff.id !== debuffId) });

                // Also remove from token's condition list so tooltips/visuals update immediately
                if (debuffToRemove && debuffToRemove.targetId && debuffToRemove.targetId !== 'player') {
                    try {
                        // Dynamically import to avoid circular dependency
                        const useCreatureStore = require('./creatureStore').default;
                        const { tokens, updateTokenState } = useCreatureStore.getState();
                        const token = tokens.find(t => t.id === debuffToRemove.targetId);
                        if (token?.state?.conditions) {
                            const updatedConditions = token.state.conditions.filter(c =>
                                !(c.name === debuffToRemove.name || c.id === debuffToRemove.name?.toLowerCase())
                            );
                            if (updatedConditions.length !== token.state.conditions.length) {
                                updateTokenState(debuffToRemove.targetId, { conditions: updatedConditions });
                            }
                        }
                    } catch (e) {
                        console.warn('Could not sync debuff removal with token state:', e);
                    }
                }

                // Sync with multiplayer
                if (debuffToRemove) {
                    get().syncDebuffUpdate('debuff_removed', { debuffId, debuffData: debuffToRemove });
                }
            },

            // Remove all debuffs
            clearAllDebuffs: () => {
                set({ activeDebuffs: [] });
            },

            // Get remaining time for a debuff
            getRemainingTime: (debuffId) => {
                const { activeDebuffs } = get();
                const debuff = activeDebuffs.find(d => d.id === debuffId);
                if (!debuff) return 0;

                // For round-based durations, return remaining rounds as seconds for display
                if (debuff.durationType === 'rounds') {
                    // Always return the stored remaining rounds, regardless of combat state
                    // The actual countdown only happens when decrementRoundBasedDebuffs is called
                    return (debuff.remainingRounds || debuff.durationValue || 1) * 6;
                }

                const remaining = Math.max(0, debuff.endTime - Date.now());
                return Math.ceil(remaining / 1000); // Return in seconds
            },

            // Update debuff timers (called periodically)
            updateDebuffTimers: () => {
                const { activeDebuffs } = get();
                const currentTime = Date.now();

                // Find expired debuffs (only time-based debuffs, not round-based)
                const expiredDebuffs = activeDebuffs.filter(debuff =>
                    debuff.durationType !== 'rounds' && debuff.endTime <= currentTime
                );
                const validDebuffs = activeDebuffs.filter(debuff =>
                    debuff.durationType === 'rounds' || debuff.endTime > currentTime
                );

                if (validDebuffs.length !== activeDebuffs.length) {
                    set({ activeDebuffs: validDebuffs });

                    // Clean up token.state.conditions for expired debuffs
                    const targetGroups = {};
                    expiredDebuffs.forEach(debuff => {
                        if (debuff.targetId && debuff.targetId !== 'player') {
                            if (!targetGroups[debuff.targetId]) {
                                targetGroups[debuff.targetId] = [];
                            }
                            targetGroups[debuff.targetId].push(debuff.name);
                        }
                    });

                    if (Object.keys(targetGroups).length > 0) {
                        try {
                            const useCreatureStore = require('./creatureStore').default;
                            const { tokens, updateTokenState } = useCreatureStore.getState();
                            Object.entries(targetGroups).forEach(([targetId, names]) => {
                                const token = tokens.find(t => t.id === targetId);
                                if (token?.state?.conditions) {
                                    const updatedConditions = token.state.conditions.filter(c =>
                                        !names.includes(c.name) && !names.map(n => n?.toLowerCase()).includes(c.id)
                                    );
                                    if (updatedConditions.length !== token.state.conditions.length) {
                                        updateTokenState(targetId, { conditions: updatedConditions });
                                    }
                                }
                            });
                        } catch (e) {
                            console.warn('Could not sync expired debuffs with token state:', e);
                        }
                    }
                }
            },

            // Get active debuff effects for character calculations
            getActiveDebuffEffects: (targetId = 'player') => {
                const { activeDebuffs } = get();
                const effects = {};

                activeDebuffs
                    .filter(debuff => debuff.targetId === targetId)
                    .forEach(debuff => {
                        if (debuff.effects) {
                            Object.keys(debuff.effects).forEach(effectType => {
                                if (!effects[effectType]) {
                                    effects[effectType] = [];
                                }
                                // Debuffs should have negative values to reduce stats
                                const effectValue = debuff.effects[effectType];
                                const negativeValue = effectValue > 0 ? -effectValue : effectValue;
                                effects[effectType].push({
                                    value: negativeValue,
                                    source: debuff.name
                                });
                            });
                        }
                    });

                return effects;
            },

            // Get debuffs for a specific target
            getDebuffsForTarget: (targetId) => {
                const { activeDebuffs } = get();
                return activeDebuffs.filter(debuff => debuff.targetId === targetId);
            },

            // Remove debuffs for a specific target
            removeDebuffsForTarget: (targetId) => {
                const { activeDebuffs } = get();
                set({ activeDebuffs: activeDebuffs.filter(debuff => debuff.targetId !== targetId) });
            },

            // Decrement round-based debuffs for a specific target (called when their turn ends)
            decrementRoundBasedDebuffs: (targetId) => {
                const { activeDebuffs } = get();
                const expiredDebuffs = [];
                const updatedDebuffs = activeDebuffs.map(debuff => {
                    if (debuff.targetId === targetId && debuff.durationType === 'rounds') {
                        const remainingRounds = (debuff.remainingRounds || debuff.durationValue || 1) - 1;
                        if (remainingRounds <= 0) {
                            expiredDebuffs.push(debuff); // Track expired debuffs
                            return null; // Mark for removal
                        }
                        return { ...debuff, remainingRounds };
                    }
                    return debuff;
                }).filter(debuff => debuff !== null); // Remove expired debuffs

                set({ activeDebuffs: updatedDebuffs });

                // Clean up token.state.conditions for expired debuffs
                if (expiredDebuffs.length > 0 && targetId && targetId !== 'player') {
                    try {
                        const useCreatureStore = require('./creatureStore').default;
                        const { tokens, updateTokenState } = useCreatureStore.getState();
                        const token = tokens.find(t => t.id === targetId);
                        if (token?.state?.conditions) {
                            const expiredNames = expiredDebuffs.map(d => d.name);
                            const updatedConditions = token.state.conditions.filter(c =>
                                !expiredNames.includes(c.name) && !expiredNames.map(n => n?.toLowerCase()).includes(c.id)
                            );
                            if (updatedConditions.length !== token.state.conditions.length) {
                                updateTokenState(targetId, { conditions: updatedConditions });
                            }
                        }
                    } catch (e) {
                        console.warn('Could not sync expired debuffs with token state:', e);
                    }
                }
            },

            // Update debuff duration (for context menu adjustments)
            updateDebuffDuration: (debuffId, newDuration, durationType = 'minutes') => {
                const { activeDebuffs } = get();
                const updatedDebuffs = activeDebuffs.map(debuff => {
                    if (debuff.id === debuffId) {
                        if (durationType === 'rounds') {
                            return {
                                ...debuff,
                                remainingRounds: newDuration,
                                durationValue: newDuration,
                                durationType: 'rounds'
                            };
                        } else {
                            const newEndTime = Date.now() + (newDuration * 1000);
                            return {
                                ...debuff,
                                endTime: newEndTime,
                                duration: newDuration,
                                durationType: durationType
                            };
                        }
                    }
                    return debuff;
                });

                set({ activeDebuffs: updatedDebuffs });
            },

            // Multiplayer Synchronization
            syncDebuffUpdate: (updateType, data) => {
                const gameStore = useGameStore.getState();
                if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
                    gameStore.multiplayerSocket.emit('debuff_update', {
                        type: updateType,
                        data: data,
                        timestamp: Date.now()
                    });
                }
            }
        }),
        {
            name: 'debuff-store',
            // Don't persist timers, they'll be recalculated on load
            partialize: (state) => ({
                activeDebuffs: state.activeDebuffs.map(debuff => ({
                    ...debuff,
                    // Recalculate remaining time on load
                    duration: Math.max(0, Math.ceil((debuff.endTime - Date.now()) / 1000))
                })).filter(debuff => debuff.duration > 0)
            })
        }
    )
);

export default useDebuffStore;
