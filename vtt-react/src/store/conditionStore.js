import { getStore } from './storeRegistry';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useGameStore from './gameStore';

const POLARITY_CONFIG = {
    buff: {
        stateKey: 'activeBuffs',
        idPrefix: 'buff_',
        defaultColor: '#32CD32',
        defaultSource: 'consumable',
        socketEvent: 'buff_update',
        logTag: '[conditionStore/buff]',
        addedEvent: 'buff_added',
        removedEvent: 'buff_removed',
        idField: 'buffId',
        dataField: 'buffData',
        negateEffects: false
    },
    debuff: {
        stateKey: 'activeDebuffs',
        idPrefix: 'debuff_',
        defaultColor: '#DC143C',
        defaultSource: 'spell',
        socketEvent: 'debuff_update',
        logTag: '[conditionStore/debuff]',
        addedEvent: 'debuff_added',
        removedEvent: 'debuff_removed',
        idField: 'debuffId',
        dataField: 'debuffData',
        negateEffects: true
    }
};

const CONDITION_MIGRATION_FLAG = 'condition-store-migrated-v1';
if (typeof window !== 'undefined' && window.localStorage && !window.localStorage.getItem(CONDITION_MIGRATION_FLAG)) {
    try {
        const existingRaw = window.localStorage.getItem('condition-store');
        const existing = existingRaw ? JSON.parse(existingRaw) : null;
        const hasExistingData =
            existing?.state &&
            ((Array.isArray(existing.state.activeBuffs) && existing.state.activeBuffs.length > 0) ||
                (Array.isArray(existing.state.activeDebuffs) && existing.state.activeDebuffs.length > 0));

        if (!hasExistingData) {
            const oldBuffs = JSON.parse(window.localStorage.getItem('buff-store') || '{}');
            const oldDebuffs = JSON.parse(window.localStorage.getItem('debuff-store') || '{}');
            const merged = {
                state: {
                    activeBuffs: oldBuffs.state?.activeBuffs || [],
                    activeDebuffs: oldDebuffs.state?.activeDebuffs || []
                },
                version: 0
            };
            window.localStorage.setItem('condition-store', JSON.stringify(merged));
        }
        window.localStorage.setItem(CONDITION_MIGRATION_FLAG, '1');
    } catch (e) {
        console.warn('[conditionStore] One-time migration from legacy buff-store/debuff-store failed:', e);
    }
}

const buildConditionRecord = (polarity, condition) => {
    const cfg = POLARITY_CONFIG[polarity];
    const record = {
        id: condition.id || `${cfg.idPrefix}${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: condition.name,
        icon: condition.icon,
        description: condition.description,
        effectSummary: condition.effectSummary || '',
        effects: condition.effects || {},
        duration: condition.duration || 60,
        startTime: condition.startTime || Date.now(),
        source: condition.source || cfg.defaultSource,
        stackable: condition.stackable || false,
        type: polarity,
        targetId: condition.targetId || 'player',
        targetType: condition.targetType || 'player',
        color: condition.color || cfg.defaultColor,
        durationType: condition.durationType || 'minutes',
        durationValue: condition.durationValue,
        remainingRounds: condition.remainingRounds,
        hasOverTimeEffect: condition.hasOverTimeEffect || false,
        overTimeType: condition.overTimeType,
        overTimeFormula: condition.overTimeFormula,
        overTimeElement: condition.overTimeElement,
        tickFrequency: condition.tickFrequency,
        tickFrequencyValue: condition.tickFrequencyValue,
        tickFrequencyUnit: condition.tickFrequencyUnit
    };

    if (condition.durationType !== 'rounds') {
        record.endTime = condition.endTime || (Date.now() + (condition.duration || 60) * 1000);
    }

    return record;
};

const syncConditionToTokenState = (polarity, record) => {
    const conditionForToken = {
        id: record.id,
        name: record.name,
        icon: record.icon,
        color: record.color,
        description: record.description,
        type: polarity,
        appliedAt: record.startTime,
        duration: record.durationType === 'rounds'
            ? record.durationValue * 6000
            : record.duration * 1000,
        durationType: record.durationType,
        durationValue: record.durationValue,
        remainingRounds: record.remainingRounds,
        effects: record.effects
    };

    if (record.targetId === 'player' || record.targetId === 'current-player') {
        const useCharacterTokenStore = getStore('characterTokenStore');
        const { characterTokens, updateCharacterTokenState } = useCharacterTokenStore.getState();
        const playerToken = characterTokens.find(t => t.isPlayerToken);
        if (playerToken) {
            const existingConditions = playerToken.state?.conditions || [];
            const existingIndex = existingConditions.findIndex(c => c.name === record.name);
            if (existingIndex >= 0) {
                existingConditions[existingIndex] = conditionForToken;
            } else {
                existingConditions.push(conditionForToken);
            }
            updateCharacterTokenState(playerToken.id, { conditions: [...existingConditions] });
        }
    } else if (record.targetId && record.targetId !== 'player') {
        const useCreatureStore = getStore('creatureStore');
        const { tokens, updateTokenState } = useCreatureStore.getState();
        const token = tokens.find(t => t.id === record.targetId);
        if (token) {
            const existingConditions = token.state?.conditions || [];
            const existingIndex = existingConditions.findIndex(c => c.name === record.name);
            if (existingIndex >= 0) {
                existingConditions[existingIndex] = conditionForToken;
            } else {
                existingConditions.push(conditionForToken);
            }
            updateTokenState(record.targetId, { conditions: [...existingConditions] });
        }
        const useCharacterTokenStore = getStore('characterTokenStore');
        const { characterTokens, updateCharacterTokenState } = useCharacterTokenStore.getState();
        const charToken = characterTokens.find(t => t.id === record.targetId);
        if (charToken) {
            const existingConditions = charToken.state?.conditions || [];
            const existingIndex = existingConditions.findIndex(c => c.name === record.name);
            if (existingIndex >= 0) {
                existingConditions[existingIndex] = conditionForToken;
            } else {
                existingConditions.push(conditionForToken);
            }
            updateCharacterTokenState(charToken.id, { conditions: [...existingConditions] });
        }
    }
};

const removeConditionFromTokenState = (polarity, record) => {
    if (!record) return;
    if (record.targetId === 'player') {
        const useCharacterTokenStore = getStore('characterTokenStore');
        const { characterTokens, updateCharacterTokenState } = useCharacterTokenStore.getState();
        const playerToken = characterTokens.find(t => t.isPlayerToken);
        if (playerToken?.state?.conditions) {
            const updatedConditions = playerToken.state.conditions.filter(c =>
                !(c.name === record.name || c.id === record.name?.toLowerCase())
            );
            if (updatedConditions.length !== playerToken.state.conditions.length) {
                updateCharacterTokenState(playerToken.id, { conditions: updatedConditions });
            }
        }
    } else if (record.targetId && record.targetId !== 'player') {
        const useCreatureStore = getStore('creatureStore');
        const { tokens, updateTokenState } = useCreatureStore.getState();
        const token = tokens.find(t => t.id === record.targetId);
        if (token?.state?.conditions) {
            const updatedConditions = token.state.conditions.filter(c =>
                !(c.name === record.name || c.id === record.name?.toLowerCase())
            );
            if (updatedConditions.length !== token.state.conditions.length) {
                updateTokenState(record.targetId, { conditions: updatedConditions });
            }
        }
        const useCharacterTokenStore = getStore('characterTokenStore');
        const { characterTokens, updateCharacterTokenState } = useCharacterTokenStore.getState();
        const charToken = characterTokens.find(t => t.id === record.targetId);
        if (charToken?.state?.conditions) {
            const updatedConditions = charToken.state.conditions.filter(c =>
                !(c.name === record.name || c.id === record.name?.toLowerCase())
            );
            if (updatedConditions.length !== charToken.state.conditions.length) {
                updateCharacterTokenState(charToken.id, { conditions: updatedConditions });
            }
        }
    }
};

const triggerCharacterStatRecalculation = (polarity, recordName) => {
    try {
        const characterStore = getStore('characterStore');
        const { stats, updateStat } = characterStore.getState();
        if (stats && updateStat) {
            updateStat('strength', stats.strength);
        }
    } catch (e) {
        console.warn(`[conditionStore] Could not trigger stat recalculation:`, e);
    }
};

const useConditionStore = create(
    persist(
        (set, get) => ({
            activeBuffs: [],
            activeDebuffs: [],

            addCondition: (polarity, condition, silent = false) => {
                const cfg = POLARITY_CONFIG[polarity];
                const list = get()[cfg.stateKey];
                const newRecord = buildConditionRecord(polarity, condition);

                console.log(`${cfg.logTag} Adding ${polarity}:`, newRecord.name, 'targetId:', newRecord.targetId, 'effects:', newRecord.effects);

                if (!newRecord.stackable) {
                    const filtered = list.filter(c =>
                        !(c.name === newRecord.name && c.targetId === newRecord.targetId)
                    );
                    set({ [cfg.stateKey]: [...filtered, newRecord] });
                    console.log(`${cfg.logTag} ${polarity} added (non-stackable). Total:`, filtered.length + 1);
                } else {
                    set({ [cfg.stateKey]: [...list, newRecord] });
                    console.log(`${cfg.logTag} ${polarity} added (stackable). Total:`, list.length + 1);
                }

                if (!silent) {
                    get().syncConditionUpdate(polarity, cfg.addedEvent, newRecord);
                }

                try {
                    syncConditionToTokenState(polarity, newRecord);
                } catch (e) {
                    console.warn(`[conditionStore] Could not sync ${polarity} to token conditions:`, e);
                }

                if (newRecord.durationType !== 'rounds') {
                    const remainingTime = Math.max(0, newRecord.endTime - Date.now());
                    setTimeout(() => {
                        get().removeCondition(polarity, newRecord.id);
                    }, remainingTime);
                }

                triggerCharacterStatRecalculation(polarity, newRecord.name);
            },

            removeCondition: (polarity, id, silent = false) => {
                const cfg = POLARITY_CONFIG[polarity];
                const list = get()[cfg.stateKey];
                const recordToRemove = list.find(c => c.id === id);

                set({ [cfg.stateKey]: list.filter(c => c.id !== id) });

                if (recordToRemove) {
                    try {
                        removeConditionFromTokenState(polarity, recordToRemove);
                    } catch (e) {
                        console.warn(`[conditionStore] Could not sync ${polarity} removal with token state:`, e);
                    }
                }

                if (recordToRemove && !silent) {
                    get().syncConditionUpdate(polarity, cfg.removedEvent, { [cfg.idField]: id, [cfg.dataField]: recordToRemove });
                }

                triggerCharacterStatRecalculation(polarity, recordToRemove?.name);
            },

            clearAllConditions: (polarity) => {
                const cfg = POLARITY_CONFIG[polarity];
                set({ [cfg.stateKey]: [] });
            },

            getRemainingTime: (polarity, id) => {
                const cfg = POLARITY_CONFIG[polarity];
                const list = get()[cfg.stateKey];
                const record = list.find(c => c.id === id);
                if (!record) return 0;

                if (record.durationType === 'rounds') {
                    return (record.remainingRounds || record.durationValue || 1) * 6;
                }

                const remaining = Math.max(0, record.endTime - Date.now());
                return Math.ceil(remaining / 1000);
            },

            updateConditionTimers: (polarity) => {
                const cfg = POLARITY_CONFIG[polarity];
                const list = get()[cfg.stateKey];
                const currentTime = Date.now();

                const expired = list.filter(c =>
                    c.durationType !== 'rounds' && c.endTime <= currentTime
                );
                const valid = list.filter(c =>
                    c.durationType === 'rounds' || c.endTime > currentTime
                );

                if (valid.length !== list.length) {
                    set({ [cfg.stateKey]: valid });

                    const playerConditions = [];
                    const targetGroups = {};
                    expired.forEach(record => {
                        if (record.targetId === 'player') {
                            playerConditions.push(record.name);
                        } else if (record.targetId && record.targetId !== 'player') {
                            if (!targetGroups[record.targetId]) {
                                targetGroups[record.targetId] = [];
                            }
                            targetGroups[record.targetId].push(record.name);
                        }
                    });

                    if (playerConditions.length > 0) {
                        try {
                            const useCharacterTokenStore = getStore('characterTokenStore');
                            const { characterTokens, updateCharacterTokenState } = useCharacterTokenStore.getState();
                            const playerToken = characterTokens.find(t => t.isPlayerToken);
                            if (playerToken?.state?.conditions) {
                                const updatedConditions = playerToken.state.conditions.filter(c =>
                                    !playerConditions.includes(c.name) && !playerConditions.map(n => n?.toLowerCase()).includes(c.id)
                                );
                                if (updatedConditions.length !== playerToken.state.conditions.length) {
                                    updateCharacterTokenState(playerToken.id, { conditions: updatedConditions });
                                }
                            }
                        } catch (e) {
                            console.warn(`[conditionStore] Could not sync expired player ${polarity} with token state:`, e);
                        }
                    }

                    if (Object.keys(targetGroups).length > 0) {
                        try {
                            const useCreatureStore = getStore('creatureStore');
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
                            const useCharacterTokenStore = getStore('characterTokenStore');
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
                            console.warn(`[conditionStore] Could not sync expired ${polarity} with token state:`, e);
                        }
                    }
                }
            },

            getActiveEffects: (polarity, targetId = 'player') => {
                const cfg = POLARITY_CONFIG[polarity];
                const list = get()[cfg.stateKey];
                const effects = {};

                const targetIds = [targetId];
                if (targetId === 'player') {
                    targetIds.push('current-player');
                    try {
                        const gameStore = getStore('gameStore');
                        const charStore = getStore('characterStore');
                        const playerId = gameStore.getState()?.currentPlayer?.id || charStore.getState()?.currentCharacterId || charStore.getState()?.id;
                        if (playerId && playerId !== 'player') targetIds.push(playerId);
                    } catch (e) {}
                }

                list
                    .filter(record => targetIds.includes(record.targetId))
                    .forEach(record => {
                        if (record.effects) {
                            Object.keys(record.effects).forEach(effectType => {
                                if (!effects[effectType]) {
                                    effects[effectType] = [];
                                }
                                let effectValue = record.effects[effectType];
                                if (cfg.negateEffects && effectValue > 0) {
                                    effectValue = -effectValue;
                                }
                                effects[effectType].push({
                                    value: effectValue,
                                    source: record.name
                                });
                            });
                        }
                    });

                return effects;
            },

            getConditionsForTarget: (polarity, targetId) => {
                const cfg = POLARITY_CONFIG[polarity];
                const list = get()[cfg.stateKey];
                return list.filter(record => record.targetId === targetId);
            },

            removeConditionsForTarget: (polarity, targetId) => {
                const cfg = POLARITY_CONFIG[polarity];
                const list = get()[cfg.stateKey];
                set({ [cfg.stateKey]: list.filter(record => record.targetId !== targetId) });
            },

            decrementRoundBasedConditions: (polarity, targetId) => {
                const cfg = POLARITY_CONFIG[polarity];
                const list = get()[cfg.stateKey];
                const expired = [];
                const updated = list.map(record => {
                    if (record.targetId === targetId && record.durationType === 'rounds') {
                        const remainingRounds = (record.remainingRounds || record.durationValue || 1) - 1;
                        if (remainingRounds <= 0) {
                            expired.push(record);
                            return null;
                        }
                        return { ...record, remainingRounds };
                    }
                    return record;
                }).filter(record => record !== null);

                set({ [cfg.stateKey]: updated });

                if (expired.length > 0) {
                    if (targetId === 'player') {
                        try {
                            const useCharacterTokenStore = getStore('characterTokenStore');
                            const { characterTokens, updateCharacterTokenState } = useCharacterTokenStore.getState();
                            const playerToken = characterTokens.find(t => t.isPlayerToken);
                            if (playerToken?.state?.conditions) {
                                const expiredNames = expired.map(c => c.name);
                                const updatedConditions = playerToken.state.conditions.filter(c =>
                                    !expiredNames.includes(c.name) && !expiredNames.map(n => n?.toLowerCase()).includes(c.id)
                                );
                                if (updatedConditions.length !== playerToken.state.conditions.length) {
                                    updateCharacterTokenState(playerToken.id, { conditions: updatedConditions });
                                }
                            }
                        } catch (e) {
                            console.warn(`[conditionStore] Could not sync expired player ${polarity} with token state:`, e);
                        }
                    } else if (targetId && targetId !== 'player') {
                        try {
                            const useCreatureStore = getStore('creatureStore');
                            const { tokens, updateTokenState } = useCreatureStore.getState();
                            const token = tokens.find(t => t.id === targetId);
                            if (token?.state?.conditions) {
                                const expiredNames = expired.map(c => c.name);
                                const updatedConditions = token.state.conditions.filter(c =>
                                    !expiredNames.includes(c.name) && !expiredNames.map(n => n?.toLowerCase()).includes(c.id)
                                );
                                if (updatedConditions.length !== token.state.conditions.length) {
                                    updateTokenState(targetId, { conditions: updatedConditions });
                                }
                            }
                            const useCharacterTokenStore = getStore('characterTokenStore');
                            const { characterTokens, updateCharacterTokenState } = useCharacterTokenStore.getState();
                            const charToken = characterTokens.find(t => t.id === targetId);
                            if (charToken?.state?.conditions) {
                                const expiredNames = expired.map(c => c.name);
                                const updatedConditions = charToken.state.conditions.filter(c =>
                                    !expiredNames.includes(c.name) && !expiredNames.map(n => n?.toLowerCase()).includes(c.id)
                                );
                                if (updatedConditions.length !== charToken.state.conditions.length) {
                                    updateCharacterTokenState(charToken.id, { conditions: updatedConditions });
                                }
                            }
                        } catch (e) {
                            console.warn(`[conditionStore] Could not sync expired ${polarity} with token state:`, e);
                        }
                    }
                }
            },

            updateConditionDuration: (polarity, id, newDuration, durationType = 'minutes') => {
                const cfg = POLARITY_CONFIG[polarity];
                const list = get()[cfg.stateKey];
                const updated = list.map(record => {
                    if (record.id === id) {
                        if (durationType === 'rounds') {
                            return {
                                ...record,
                                remainingRounds: newDuration,
                                durationValue: newDuration,
                                durationType: 'rounds'
                            };
                        } else {
                            const newEndTime = Date.now() + (newDuration * 1000);
                            return {
                                ...record,
                                endTime: newEndTime,
                                duration: newDuration,
                                durationType: durationType
                            };
                        }
                    }
                    return record;
                });

                set({ [cfg.stateKey]: updated });
            },

            syncConditionUpdate: (polarity, updateType, data) => {
                const cfg = POLARITY_CONFIG[polarity];
                const gameStore = useGameStore.getState();
                if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
                    gameStore.multiplayerSocket.emit(cfg.socketEvent, {
                        type: updateType,
                        data: data,
                        roomId: gameStore.multiplayerRoom?.id,
                        timestamp: Date.now()
                    });
                }
            },

            remapTargetIdForLocalPlayer: (targetId) => {
                const gameStore = useGameStore.getState();
                const currentPlayerId = gameStore.currentPlayer?.id;
                const authStore = getStore('authStore');
                const userId = authStore.getState().user?.uid;

                if (targetId === currentPlayerId || targetId === userId) {
                    return 'current-player';
                }
                return targetId;
            }
        }),
        {
            name: 'condition-store',
            partialize: (state) => ({
                activeBuffs: state.activeBuffs.map(buff => ({
                    ...buff,
                    duration: Math.max(0, Math.ceil((buff.endTime - Date.now()) / 1000))
                })).filter(buff => buff.duration > 0),
                activeDebuffs: state.activeDebuffs.map(debuff => ({
                    ...debuff,
                    duration: Math.max(0, Math.ceil((debuff.endTime - Date.now()) / 1000))
                })).filter(debuff => debuff.duration > 0)
            })
        }
    )
);

export default useConditionStore;
