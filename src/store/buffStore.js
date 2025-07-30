import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
                    remainingRounds: buff.remainingRounds
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

                // Set up automatic removal timer (only for time-based buffs)
                if (newBuff.durationType !== 'rounds') {
                    setTimeout(() => {
                        get().removeBuff(newBuff.id);
                    }, newBuff.duration * 1000);
                }
            },

            // Remove a buff by ID
            removeBuff: (buffId) => {
                const { activeBuffs } = get();
                set({ activeBuffs: activeBuffs.filter(buff => buff.id !== buffId) });
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

                // Remove expired buffs (only time-based buffs, not round-based)
                const validBuffs = activeBuffs.filter(buff =>
                    buff.durationType === 'rounds' || buff.endTime > currentTime
                );

                if (validBuffs.length !== activeBuffs.length) {
                    set({ activeBuffs: validBuffs });
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
                const updatedBuffs = activeBuffs.map(buff => {
                    if (buff.targetId === targetId && buff.durationType === 'rounds') {
                        const remainingRounds = (buff.remainingRounds || buff.durationValue || 1) - 1;
                        if (remainingRounds <= 0) {
                            return null; // Mark for removal
                        }
                        return { ...buff, remainingRounds };
                    }
                    return buff;
                }).filter(buff => buff !== null); // Remove expired buffs

                set({ activeBuffs: updatedBuffs });
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
