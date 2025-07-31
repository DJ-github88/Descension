import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

                // Set up automatic removal timer (only for time-based debuffs)
                if (newDebuff.durationType !== 'rounds') {
                    setTimeout(() => {
                        get().removeDebuff(newDebuff.id);
                    }, newDebuff.duration * 1000);
                }
            },

            // Remove a debuff by ID
            removeDebuff: (debuffId) => {
                const { activeDebuffs } = get();
                set({ activeDebuffs: activeDebuffs.filter(debuff => debuff.id !== debuffId) });
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

                // Remove expired debuffs (only time-based debuffs, not round-based)
                const validDebuffs = activeDebuffs.filter(debuff =>
                    debuff.durationType === 'rounds' || debuff.endTime > currentTime
                );

                if (validDebuffs.length !== activeDebuffs.length) {
                    set({ activeDebuffs: validDebuffs });
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
                const updatedDebuffs = activeDebuffs.map(debuff => {
                    if (debuff.targetId === targetId && debuff.durationType === 'rounds') {
                        const remainingRounds = (debuff.remainingRounds || debuff.durationValue || 1) - 1;
                        if (remainingRounds <= 0) {
                            return null; // Mark for removal
                        }
                        return { ...debuff, remainingRounds };
                    }
                    return debuff;
                }).filter(debuff => debuff !== null); // Remove expired debuffs

                set({ activeDebuffs: updatedDebuffs });
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
