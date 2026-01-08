import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useGameStore from './gameStore';

const useBuffStore = create(
    persist(
        (set, get) => ({
            // Active buffs array - now supports targeting specific creatures
            activeBuffs: [],

            // Add a new buff
            addBuff: (buff) => {
                const { activeBuffs } = get();
                const newBuff = {
                    id: `buff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
                    name: buff.name,
                    icon: buff.icon,
                    description: buff.description,
                    effectSummary: buff.effectSummary || '',
                    effects: buff.effects || {},
                    duration: buff.duration || 60, // Duration in seconds
                    startTime: Date.now(),
                    source: buff.source || 'consumable',
                    stackable: buff.stackable || false,
                    // New targeting properties
                    targetId: buff.targetId || 'player', // Default to player if not specified
                    targetType: buff.targetType || 'player', // 'player', 'token', 'creature'
                    color: buff.color || '#32CD32',
                    // Round-based duration properties
                    durationType: buff.durationType || 'minutes',
                    durationValue: buff.durationValue,
                    remainingRounds: buff.remainingRounds,
                    // Over-time effect properties
                    hasOverTimeEffect: buff.hasOverTimeEffect || false,
                    overTimeType: buff.overTimeType,
                    overTimeFormula: buff.overTimeFormula,
                    overTimeElement: buff.overTimeElement,
                    tickFrequency: buff.tickFrequency,
                    tickFrequencyValue: buff.tickFrequencyValue,
                    tickFrequencyUnit: buff.tickFrequencyUnit
                };

                // For round-based buffs, don't set endTime (they don't expire automatically)
                if (buff.durationType !== 'rounds') {
                    newBuff.endTime = Date.now() + (buff.duration || 60) * 1000;
                }

                // Check if buff is stackable (now also considers target)
                if (!newBuff.stackable) {
                    // Remove existing buff with same name and target
                    const filteredBuffs = activeBuffs.filter(b =>
                        !(b.name === newBuff.name && b.targetId === newBuff.targetId)
                    );
                    set({ activeBuffs: [...filteredBuffs, newBuff] });
                } else {
                    set({ activeBuffs: [...activeBuffs, newBuff] });
                }

                // Sync with multiplayer
                get().syncBuffUpdate('buff_added', newBuff);

                // Set up automatic removal timer (only for time-based buffs)
                if (newBuff.durationType !== 'rounds') {
                    setTimeout(() => {
                        get().removeBuff(newBuff.id);
                    }, newBuff.duration * 1000);
                }
            },

            // Remove a buff by ID - also cleans up token.state.conditions
            removeBuff: (buffId) => {
                const { activeBuffs } = get();
                const buffToRemove = activeBuffs.find(buff => buff.id === buffId);

                set({ activeBuffs: activeBuffs.filter(buff => buff.id !== buffId) });

                // Also remove from token's condition list so tooltips/visuals update immediately
                if (buffToRemove) {
                    try {
                        // Handle player buffs (targetId === 'player')
                        if (buffToRemove.targetId === 'player') {
                            const useCharacterTokenStore = require('./characterTokenStore').default;
                            const { characterTokens, updateCharacterTokenState } = useCharacterTokenStore.getState();
                            const playerToken = characterTokens.find(t => t.isPlayerToken);
                            if (playerToken?.state?.conditions) {
                                const updatedConditions = playerToken.state.conditions.filter(c =>
                                    !(c.name === buffToRemove.name || c.id === buffToRemove.name?.toLowerCase())
                                );
                                if (updatedConditions.length !== playerToken.state.conditions.length) {
                                    updateCharacterTokenState(playerToken.id, { conditions: updatedConditions });
                                }
                            }
                        } else if (buffToRemove.targetId && buffToRemove.targetId !== 'player') {
                            // Handle creature/character token buffs
                            const useCreatureStore = require('./creatureStore').default;
                            const { tokens, updateTokenState } = useCreatureStore.getState();
                            const token = tokens.find(t => t.id === buffToRemove.targetId);
                            if (token?.state?.conditions) {
                                const updatedConditions = token.state.conditions.filter(c =>
                                    !(c.name === buffToRemove.name || c.id === buffToRemove.name?.toLowerCase())
                                );
                                if (updatedConditions.length !== token.state.conditions.length) {
                                    updateTokenState(buffToRemove.targetId, { conditions: updatedConditions });
                                }
                            }
                            // Also check character tokens in case it's a character token
                            const useCharacterTokenStore = require('./characterTokenStore').default;
                            const { characterTokens, updateCharacterTokenState } = useCharacterTokenStore.getState();
                            const charToken = characterTokens.find(t => t.id === buffToRemove.targetId);
                            if (charToken?.state?.conditions) {
                                const updatedConditions = charToken.state.conditions.filter(c =>
                                    !(c.name === buffToRemove.name || c.id === buffToRemove.name?.toLowerCase())
                                );
                                if (updatedConditions.length !== charToken.state.conditions.length) {
                                    updateCharacterTokenState(charToken.id, { conditions: updatedConditions });
                                }
                            }
                        }
                    } catch (e) {
                        console.warn('Could not sync buff removal with token state:', e);
                    }
                }

                // Sync with multiplayer
                if (buffToRemove) {
                    get().syncBuffUpdate('buff_removed', { buffId, buffData: buffToRemove });
                }
            },

            // Remove all buffs
            clearAllBuffs: () => {
                set({ activeBuffs: [] });
            },

            // Get remaining time for a buff
            getRemainingTime: (buffId) => {
                const { activeBuffs } = get();
                const buff = activeBuffs.find(b => b.id === buffId);
                if (!buff) return 0;

                // For round-based durations, return remaining rounds as seconds for display
                if (buff.durationType === 'rounds') {
                    // Always return the stored remaining rounds, regardless of combat state
                    // The actual countdown only happens when decrementRoundBasedBuffs is called
                    return (buff.remainingRounds || buff.durationValue || 1) * 6;
                }

                const remaining = Math.max(0, buff.endTime - Date.now());
                return Math.ceil(remaining / 1000); // Return in seconds
            },

            // Update buff timers (called periodically)
            updateBuffTimers: () => {
                const { activeBuffs } = get();
                const currentTime = Date.now();

                // Find expired buffs (only time-based buffs, not round-based)
                const expiredBuffs = activeBuffs.filter(buff =>
                    buff.durationType !== 'rounds' && buff.endTime <= currentTime
                );
                const validBuffs = activeBuffs.filter(buff =>
                    buff.durationType === 'rounds' || buff.endTime > currentTime
                );

                if (validBuffs.length !== activeBuffs.length) {
                    set({ activeBuffs: validBuffs });

                    // Clean up token.state.conditions for expired buffs
                    const playerBuffs = [];
                    const targetGroups = {};
                    expiredBuffs.forEach(buff => {
                        if (buff.targetId === 'player') {
                            playerBuffs.push(buff.name);
                        } else if (buff.targetId && buff.targetId !== 'player') {
                            if (!targetGroups[buff.targetId]) {
                                targetGroups[buff.targetId] = [];
                            }
                            targetGroups[buff.targetId].push(buff.name);
                        }
                    });

                    // Handle player buffs
                    if (playerBuffs.length > 0) {
                        try {
                            const useCharacterTokenStore = require('./characterTokenStore').default;
                            const { characterTokens, updateCharacterTokenState } = useCharacterTokenStore.getState();
                            const playerToken = characterTokens.find(t => t.isPlayerToken);
                            if (playerToken?.state?.conditions) {
                                const updatedConditions = playerToken.state.conditions.filter(c =>
                                    !playerBuffs.includes(c.name) && !playerBuffs.map(n => n?.toLowerCase()).includes(c.id)
                                );
                                if (updatedConditions.length !== playerToken.state.conditions.length) {
                                    updateCharacterTokenState(playerToken.id, { conditions: updatedConditions });
                                }
                            }
                        } catch (e) {
                            console.warn('Could not sync expired player buffs with token state:', e);
                        }
                    }

                    // Handle creature/character token buffs
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
                            // Also check character tokens
                            const useCharacterTokenStore = require('./characterTokenStore').default;
                            const { characterTokens, updateCharacterTokenState } = useCharacterTokenStore.getState();
                            Object.entries(targetGroups).forEach(([targetId, names]) => {
                                const charToken = characterTokens.find(t => t.id === targetId);
                                if (charToken?.state?.conditions) {
                                    const updatedConditions = charToken.state.conditions.filter(c =>
                                        !names.includes(c.name) && !names.map(n => n?.toLowerCase()).includes(c.id)
                                    );
                                    if (updatedConditions.length !== charToken.state.conditions.length) {
                                        updateCharacterTokenState(charToken.id, { conditions: updatedConditions });
                                    }
                                }
                            });
                        } catch (e) {
                            console.warn('Could not sync expired buffs with token state:', e);
                        }
                    }
                }
            },

            // Get active buff effects for character calculations
            getActiveEffects: (targetId = 'player') => {
                const { activeBuffs } = get();
                const effects = {};

                activeBuffs
                    .filter(buff => buff.targetId === targetId)
                    .forEach(buff => {
                        if (buff.effects) {
                            Object.keys(buff.effects).forEach(effectType => {
                                if (!effects[effectType]) {
                                    effects[effectType] = [];
                                }
                                effects[effectType].push({
                                    value: buff.effects[effectType],
                                    source: buff.name
                                });
                            });
                        }
                    });

                return effects;
            },

            // Get buffs for a specific target
            getBuffsForTarget: (targetId) => {
                const { activeBuffs } = get();
                return activeBuffs.filter(buff => buff.targetId === targetId);
            },

            // Remove buffs for a specific target
            removeBuffsForTarget: (targetId) => {
                const { activeBuffs } = get();
                set({ activeBuffs: activeBuffs.filter(buff => buff.targetId !== targetId) });
            },

            // Decrement round-based buffs for a specific target (called when their turn ends)
            decrementRoundBasedBuffs: (targetId) => {
                const { activeBuffs } = get();
                const expiredBuffs = [];
                const updatedBuffs = activeBuffs.map(buff => {
                    if (buff.targetId === targetId && buff.durationType === 'rounds') {
                        const remainingRounds = (buff.remainingRounds || buff.durationValue || 1) - 1;
                        if (remainingRounds <= 0) {
                            expiredBuffs.push(buff); // Track expired buffs
                            return null; // Mark for removal
                        }
                        return { ...buff, remainingRounds };
                    }
                    return buff;
                }).filter(buff => buff !== null); // Remove expired buffs

                set({ activeBuffs: updatedBuffs });

                // Clean up token.state.conditions for expired buffs
                if (expiredBuffs.length > 0) {
                    if (targetId === 'player') {
                        // Handle player buffs
                        try {
                            const useCharacterTokenStore = require('./characterTokenStore').default;
                            const { characterTokens, updateCharacterTokenState } = useCharacterTokenStore.getState();
                            const playerToken = characterTokens.find(t => t.isPlayerToken);
                            if (playerToken?.state?.conditions) {
                                const expiredNames = expiredBuffs.map(b => b.name);
                                const updatedConditions = playerToken.state.conditions.filter(c =>
                                    !expiredNames.includes(c.name) && !expiredNames.map(n => n?.toLowerCase()).includes(c.id)
                                );
                                if (updatedConditions.length !== playerToken.state.conditions.length) {
                                    updateCharacterTokenState(playerToken.id, { conditions: updatedConditions });
                                }
                            }
                        } catch (e) {
                            console.warn('Could not sync expired player buffs with token state:', e);
                        }
                    } else if (targetId && targetId !== 'player') {
                        // Handle creature/character token buffs
                        try {
                            const useCreatureStore = require('./creatureStore').default;
                            const { tokens, updateTokenState } = useCreatureStore.getState();
                            const token = tokens.find(t => t.id === targetId);
                            if (token?.state?.conditions) {
                                const expiredNames = expiredBuffs.map(b => b.name);
                                const updatedConditions = token.state.conditions.filter(c =>
                                    !expiredNames.includes(c.name) && !expiredNames.map(n => n?.toLowerCase()).includes(c.id)
                                );
                                if (updatedConditions.length !== token.state.conditions.length) {
                                    updateTokenState(targetId, { conditions: updatedConditions });
                                }
                            }
                            // Also check character tokens
                            const useCharacterTokenStore = require('./characterTokenStore').default;
                            const { characterTokens, updateCharacterTokenState } = useCharacterTokenStore.getState();
                            const charToken = characterTokens.find(t => t.id === targetId);
                            if (charToken?.state?.conditions) {
                                const expiredNames = expiredBuffs.map(b => b.name);
                                const updatedConditions = charToken.state.conditions.filter(c =>
                                    !expiredNames.includes(c.name) && !expiredNames.map(n => n?.toLowerCase()).includes(c.id)
                                );
                                if (updatedConditions.length !== charToken.state.conditions.length) {
                                    updateCharacterTokenState(charToken.id, { conditions: updatedConditions });
                                }
                            }
                        } catch (e) {
                            console.warn('Could not sync expired buffs with token state:', e);
                        }
                    }
                }
            },

            // Update buff duration (for context menu adjustments)
            updateBuffDuration: (buffId, newDuration, durationType = 'minutes') => {
                const { activeBuffs } = get();
                const updatedBuffs = activeBuffs.map(buff => {
                    if (buff.id === buffId) {
                        if (durationType === 'rounds') {
                            return {
                                ...buff,
                                remainingRounds: newDuration,
                                durationValue: newDuration,
                                durationType: 'rounds'
                            };
                        } else {
                            const newEndTime = Date.now() + (newDuration * 1000);
                            return {
                                ...buff,
                                endTime: newEndTime,
                                duration: newDuration,
                                durationType: durationType
                            };
                        }
                    }
                    return buff;
                });

                set({ activeBuffs: updatedBuffs });
            },

            // Multiplayer Synchronization
            syncBuffUpdate: (updateType, data) => {
                const gameStore = useGameStore.getState();
                if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
                    gameStore.multiplayerSocket.emit('buff_update', {
                        type: updateType,
                        data: data,
                        timestamp: Date.now()
                    });
                }
            }
        }),
        {
            name: 'buff-store',
            // Don't persist timers, they'll be recalculated on load
            partialize: (state) => ({
                activeBuffs: state.activeBuffs.map(buff => ({
                    ...buff,
                    // Recalculate remaining time on load
                    duration: Math.max(0, Math.ceil((buff.endTime - Date.now()) / 1000))
                })).filter(buff => buff.duration > 0)
            })
        }
    )
);

export default useBuffStore;
