/**
 * Consumable Utility Functions
 * 
 * Shared utility for handling consumable item usage across the application.
 * Provides consistent behavior for:
 * - Resource restoration (HP, Mana, AP) with overheal detection
 * - Buff/Debuff application with proper durations
 * - Multiplayer sync to party HUD, token HUD, and character sheet
 */

import { getIconUrl } from './assetManager';

const SPELL_DAMAGE_TYPES = ['fire', 'frost', 'arcane', 'nature', 'lightning', 'acid', 'force', 'thunder', 'chaos', 'necrotic', 'radiant', 'poison', 'psychic'];

/**
 * Calculate resource adjustment and detect overheal
 * @param {Object} params - Parameters object
 * @param {string} params.resourceType - 'health', 'mana', or 'actionPoints'
 * @param {number} params.amount - Amount to restore
 * @param {Object} params.currentResource - Current resource state { current, max }
 * @param {Object} params.item - The consumable item
 * @returns {Object} - { applied: boolean, pendingOverheal: object|null }
 */
export const calculateResourceAdjustment = ({ resourceType, amount, currentResource, item }) => {
    if (!currentResource || amount <= 0) {
        return { applied: false, pendingOverheal: null };
    }

    const currentValue = currentResource.current || 0;
    const maxValue = currentResource.max || 0;
    const newValue = currentValue + amount;

    if (newValue > maxValue) {
        const overhealAmount = newValue - maxValue;
        return {
            applied: false,
            pendingOverheal: {
                resourceType,
                amount,
                overhealAmount,
                currentValue,
                maxValue,
                item
            }
        };
    }

    return { applied: true, pendingOverheal: null };
};

/**
 * Extract duration from consumable item
 * @param {Object} item - The consumable item
 * @returns {number} - Duration in seconds
 */
export const extractConsumableDuration = (item) => {
    const combatStats = item.combatStats || {};
    const baseStats = item.baseStats || {};
    const utilityStats = item.utilityStats || {};
    
    let foundDuration = null;

    Object.keys(baseStats).forEach(statName => {
        const statData = baseStats[statName];
        if (statData && typeof statData === 'object' && statData.duration && !foundDuration) {
            foundDuration = statData.duration;
        }
    });

    if (!foundDuration && combatStats.maxHealth && combatStats.maxHealth.duration) {
        foundDuration = combatStats.maxHealth.duration;
    }

    if (!foundDuration && utilityStats.movementSpeed && utilityStats.movementSpeed.duration) {
        foundDuration = utilityStats.movementSpeed.duration;
    }

    if (!foundDuration && combatStats.spellDamage && combatStats.spellDamage.types) {
        Object.values(combatStats.spellDamage.types).forEach(spellData => {
            if (spellData && typeof spellData === 'object' && spellData.duration && !foundDuration) {
                foundDuration = spellData.duration;
            }
        });
    }

    if (!foundDuration && utilityStats.duration) {
        const durationValue = utilityStats.duration.value || 1;
        const durationType = utilityStats.duration.type || 'MINUTES';
        foundDuration = durationType === 'ROUNDS' ? durationValue * 6 : durationValue * 60;
    }

    return foundDuration || 60;
};

/**
 * Collect buff effects from consumable
 * @param {Object} item - The consumable item
 * @returns {Object} - { effects: {}, hasBuffs: boolean }
 */
export const collectBuffEffects = (item) => {
    console.log('[consumableUtils] collectBuffEffects called for item:', item?.name);
    console.log('[consumableUtils] item.combatStats:', item?.combatStats);
    console.log('[consumableUtils] item.baseStats:', item?.baseStats);
    console.log('[consumableUtils] item.utilityStats:', item?.utilityStats);
    
    const combatStats = item.combatStats || {};
    const baseStats = item.baseStats || {};
    const utilityStats = item.utilityStats || {};
    const buffEffects = {};
    let hasBuffs = false;

    const positiveStats = ['strength', 'agility', 'intelligence', 'constitution', 'spirit', 'charisma'];
    positiveStats.forEach(stat => {
        if (combatStats[stat] && combatStats[stat].value > 0) {
            console.log(`[consumableUtils] Found positive combat stat ${stat}:`, combatStats[stat].value);
            buffEffects[stat] = combatStats[stat].value;
            hasBuffs = true;
        }
        if (baseStats[stat]) {
            const value = typeof baseStats[stat] === 'object' ? baseStats[stat].value : baseStats[stat];
            if (value > 0) {
                console.log(`[consumableUtils] Found positive base stat ${stat}:`, value);
                buffEffects[stat] = (buffEffects[stat] || 0) + value;
                hasBuffs = true;
            }
        }
    });

    const combatStatEffects = ['armor', 'damage', 'healingPower', 'healthRegen', 'manaRegen', 'moveSpeed'];
    combatStatEffects.forEach(stat => {
        if (combatStats[stat] && combatStats[stat].value > 0) {
            console.log(`[consumableUtils] Found positive combat effect ${stat}:`, combatStats[stat].value);
            buffEffects[stat] = combatStats[stat].value;
            hasBuffs = true;
        }
    });

    if (combatStats.maxHealth && combatStats.maxHealth.value > 0) {
        console.log('[consumableUtils] Found positive maxHealth:', combatStats.maxHealth.value);
        buffEffects.maxHealth = combatStats.maxHealth.value;
        hasBuffs = true;
    }

    if (baseStats.maxHealth) {
        const value = typeof baseStats.maxHealth === 'object' ? baseStats.maxHealth.value : baseStats.maxHealth;
        if (value > 0) {
            console.log('[consumableUtils] Found positive baseStats maxHealth:', value);
            buffEffects.maxHealth = (buffEffects.maxHealth || 0) + value;
            hasBuffs = true;
        }
    }

    if (baseStats.moveSpeed) {
        const value = typeof baseStats.moveSpeed === 'object' ? baseStats.moveSpeed.value : baseStats.moveSpeed;
        if (value > 0) {
            console.log('[consumableUtils] Found positive baseStats moveSpeed:', value);
            buffEffects.moveSpeed = (buffEffects.moveSpeed || 0) + value;
            hasBuffs = true;
        }
    }

    if (combatStats.spellDamage && combatStats.spellDamage.types) {
        Object.entries(combatStats.spellDamage.types).forEach(([spellType, spellData]) => {
            const value = typeof spellData === 'object' ? spellData.value : spellData;
            if (value > 0) {
                console.log(`[consumableUtils] Found positive spell damage ${spellType}:`, value);
                buffEffects[`${spellType}SpellPower`] = value;
                hasBuffs = true;
            }
        });
    }

    SPELL_DAMAGE_TYPES.forEach(type => {
        const typeKey = `${type}Damage`;
        const spellPowerKey = `${type}SpellPower`;

        if (combatStats[typeKey] && combatStats[typeKey].value > 0) {
            buffEffects[spellPowerKey] = combatStats[typeKey].value;
            hasBuffs = true;
        }
        if (combatStats[spellPowerKey] && combatStats[spellPowerKey].value > 0) {
            buffEffects[spellPowerKey] = (buffEffects[spellPowerKey] || 0) + combatStats[spellPowerKey].value;
            hasBuffs = true;
        }
    });

    if (combatStats.resistances) {
        Object.entries(combatStats.resistances).forEach(([resistanceType, resData]) => {
            const value = typeof resData === 'object' ? resData.value : resData;
            if (value > 0) {
                buffEffects[`${resistanceType}Resistance`] = value;
                hasBuffs = true;
            }
        });
    }

    Object.keys(utilityStats).forEach(statName => {
        const statData = utilityStats[statName];
        if (statName !== 'duration' && statData) {
            const value = typeof statData === 'object' ? statData.value : statData;
            if (value > 0) {
                const statMap = {
                    movementSpeed: 'moveSpeed',
                    carryingCapacity: 'carryingCapacity'
                };
                const mappedStat = statMap[statName] || statName;
                buffEffects[mappedStat] = value;
                hasBuffs = true;
            }
        }
    });

    console.log('[consumableUtils] Final buff effects:', buffEffects, 'hasBuffs:', hasBuffs);
    return { effects: buffEffects, hasBuffs };
};

/**
 * Collect debuff effects from consumable
 * @param {Object} item - The consumable item
 * @returns {Object} - { effects: {}, hasDebuffs: boolean }
 */
export const collectDebuffEffects = (item) => {
    console.log('[consumableUtils] collectDebuffEffects called for item:', item?.name);
    
    const combatStats = item.combatStats || {};
    const baseStats = item.baseStats || {};
    const utilityStats = item.utilityStats || {};
    const debuffEffects = {};
    let hasDebuffs = false;

    console.log('[consumableUtils] Checking baseStats for debuffs:', baseStats);

    const negativeStats = ['strength', 'agility', 'intelligence', 'constitution', 'spirit', 'charisma'];
    negativeStats.forEach(stat => {
        if (combatStats[stat] && combatStats[stat].value < 0) {
            console.log(`[consumableUtils] Found negative combat stat ${stat}:`, combatStats[stat].value);
            debuffEffects[stat] = Math.abs(combatStats[stat].value);
            hasDebuffs = true;
        }
        if (baseStats[stat]) {
            const value = typeof baseStats[stat] === 'object' ? baseStats[stat].value : baseStats[stat];
            console.log(`[consumableUtils] Checking base stat ${stat}:`, value);
            if (value < 0) {
                console.log(`[consumableUtils] Found negative base stat ${stat}:`, value);
                debuffEffects[stat] = (debuffEffects[stat] || 0) + Math.abs(value);
                hasDebuffs = true;
            }
        }
    });

    const combatStatEffects = ['armor', 'damage', 'healingPower', 'healthRegen', 'manaRegen', 'moveSpeed'];
    combatStatEffects.forEach(stat => {
        if (combatStats[stat] && combatStats[stat].value < 0) {
            debuffEffects[stat] = Math.abs(combatStats[stat].value);
            hasDebuffs = true;
        }
    });

    if (combatStats.maxHealth && combatStats.maxHealth.value < 0) {
        debuffEffects.maxHealth = Math.abs(combatStats.maxHealth.value);
        hasDebuffs = true;
    }

    if (baseStats.maxHealth) {
        const value = typeof baseStats.maxHealth === 'object' ? baseStats.maxHealth.value : baseStats.maxHealth;
        if (value < 0) {
            debuffEffects.maxHealth = (debuffEffects.maxHealth || 0) + Math.abs(value);
            hasDebuffs = true;
        }
    }

    if (baseStats.moveSpeed) {
        const value = typeof baseStats.moveSpeed === 'object' ? baseStats.moveSpeed.value : baseStats.moveSpeed;
        if (value < 0) {
            debuffEffects.moveSpeed = (debuffEffects.moveSpeed || 0) + Math.abs(value);
            hasDebuffs = true;
        }
    }

    if (baseStats.movementSpeed) {
        const value = typeof baseStats.movementSpeed === 'object' ? baseStats.movementSpeed.value : baseStats.movementSpeed;
        if (value < 0) {
            debuffEffects.moveSpeed = (debuffEffects.moveSpeed || 0) + Math.abs(value);
            hasDebuffs = true;
        }
    }

    if (combatStats.spellDamage && combatStats.spellDamage.types) {
        Object.entries(combatStats.spellDamage.types).forEach(([spellType, spellData]) => {
            const value = typeof spellData === 'object' ? spellData.value : spellData;
            if (value < 0) {
                debuffEffects[`${spellType}SpellPower`] = Math.abs(value);
                hasDebuffs = true;
            }
        });
    }

    SPELL_DAMAGE_TYPES.forEach(type => {
        const typeKey = `${type}Damage`;
        const spellPowerKey = `${type}SpellPower`;

        if (combatStats[typeKey] && combatStats[typeKey].value < 0) {
            debuffEffects[spellPowerKey] = Math.abs(combatStats[typeKey].value);
            hasDebuffs = true;
        }
        if (combatStats[spellPowerKey] && combatStats[spellPowerKey].value < 0) {
            debuffEffects[spellPowerKey] = (debuffEffects[spellPowerKey] || 0) + Math.abs(combatStats[spellPowerKey].value);
            hasDebuffs = true;
        }
    });

    Object.keys(utilityStats).forEach(statName => {
        const statData = utilityStats[statName];
        if (statName !== 'duration' && statData) {
            const value = typeof statData === 'object' ? statData.value : statData;
            if (value < 0) {
                const statMap = {
                    movementSpeed: 'moveSpeed',
                    carryingCapacity: 'carryingCapacity'
                };
                const mappedStat = statMap[statName] || statName;
                debuffEffects[mappedStat] = Math.abs(value);
                hasDebuffs = true;
            }
        }
    });

    console.log('[consumableUtils] Final debuff effects:', debuffEffects, 'hasDebuffs:', hasDebuffs);
    return { effects: debuffEffects, hasDebuffs };
};

/**
 * Apply resource change with optional temporary resource
 * @param {Object} params - Parameters object
 * @param {string} params.resourceType - 'health', 'mana', or 'actionPoints'
 * @param {number} params.amount - Amount to add
 * @param {boolean} params.asTemporary - Whether to add excess as temporary
 * @param {Object} params.stores - Store references
 * @returns {void}
 */
export const applyResourceChange = ({ resourceType, amount, asTemporary, stores }) => {
    const { characterStore, partyStore, gameStore } = stores;
    const charState = characterStore.getState();
    
    const resourceMap = {
        'health': charState.health,
        'mana': charState.mana,
        'actionPoints': charState.actionPoints
    };
    
    const tempMap = {
        'health': charState.tempHealth || 0,
        'mana': charState.tempMana || 0,
        'actionPoints': charState.tempActionPoints || 0
    };
    
    const currentResource = resourceMap[resourceType];
    const currentTemp = tempMap[resourceType];
    
    if (!currentResource) return;
    
    const currentValue = currentResource.current || 0;
    const maxValue = currentResource.max || 0;
    const newValue = currentValue + amount;
    
    if (asTemporary && newValue > maxValue) {
        const overhealAmount = newValue - maxValue;
        characterStore.getState().updateResource(resourceType, maxValue, maxValue, currentTemp + overhealAmount, true, true);
    } else {
        const finalValue = Math.min(maxValue, Math.max(0, newValue));
        characterStore.getState().updateResource(resourceType, finalValue, maxValue, undefined, true, true);
    }

    syncResourceToAll({ resourceType, characterStore, partyStore, gameStore });
};

/**
 * Sync resource to all relevant stores and multiplayer
 * @param {Object} params - Parameters object
 * @param {string} params.resourceType - 'health', 'mana', or 'actionPoints'
 * @param {Object} params.characterStore - Character store reference
 * @param {Object} params.partyStore - Party store reference
 * @param {Object} params.gameStore - Game store reference
 */
export const syncResourceToAll = ({ resourceType, characterStore, partyStore, gameStore }) => {
    try {
        const charState = characterStore.getState();
        const resource = charState[resourceType];
        const tempField = `temp${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}`;
        const tempValue = charState[tempField] || 0;

        if (partyStore) {
            try {
                const partyState = partyStore.getState();
                const currentMember = partyState.partyMembers.find(m => 
                    m.id === 'current-player' || 
                    m.id === charState.currentCharacterId ||
                    m.userId === charState.userId
                );
                
                if (currentMember) {
                    partyStore.getState().updatePartyMember(currentMember.id, {
                        character: {
                            ...currentMember.character,
                            [resourceType]: {
                                current: resource.current,
                                max: resource.max
                            },
                            [tempField]: tempValue
                        }
                    });
                }
            } catch (e) {
                console.warn('Failed to sync to party store:', e);
            }
        }

        if (gameStore) {
            try {
                const gameState = gameStore.getState();
                if (gameState.isInMultiplayer && gameState.multiplayerSocket && gameState.multiplayerSocket.connected) {
                    const socketId = gameState.multiplayerSocket.id;
                    const roomId = gameState.multiplayerRoom?.id;
                    
                    if (roomId) {
                        gameState.multiplayerSocket.emit('character_resource_updated', {
                            roomId: roomId,
                            playerId: gameState.currentPlayer?.id || socketId,
                            socketId: socketId,
                            resource: resourceType,
                            current: resource.current,
                            max: resource.max,
                            temp: tempValue,
                            timestamp: Date.now()
                        });
                    }
                }
            } catch (e) {
                console.warn('Failed to sync to multiplayer:', e);
            }
        }
    } catch (e) {
        console.warn('Error in syncResourceToAll:', e);
    }
};

const EFFECT_STAT_NAMES = {
    'strength': 'Strength', 'agility': 'Agility', 'constitution': 'Constitution',
    'intelligence': 'Intelligence', 'spirit': 'Spirit', 'charisma': 'Charisma',
    'armor': 'Armor', 'damage': 'Damage', 'healingpower': 'Healing Power',
    'healthregen': 'Health Regen', 'manaregen': 'Mana Regen',
    'maxhealth': 'Max Health', 'maxmana': 'Max Mana',
    'movespeed': 'Movement Speed',
    'carryingcapacity': 'Carrying Capacity'
};

const UNIT_STATS_SET = new Set(['movespeed', 'movement speed', 'speed']);

const resolveEffectStatName = (stat) => {
    let name = EFFECT_STAT_NAMES[stat.toLowerCase()];
    if (!name) {
        name = stat
            .replace(/([A-Z])/g, ' $1')
            .replace(/_/g, ' ')
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ')
            .trim();
    }
    return name;
};

export const generateBuffEffectSummary = (effects) => {
    if (!effects || typeof effects !== 'object') return '';
    const lines = [];
    Object.entries(effects).forEach(([stat, value]) => {
        if (value !== 0 && value !== null && value !== undefined) {
            const statName = resolveEffectStatName(stat);
            const absVal = Math.abs(value);
            const unitSuffix = UNIT_STATS_SET.has(stat.toLowerCase()) ? ' units' : '';
            if (value > 0) {
                lines.push(`Increases ${statName} by ${absVal}${unitSuffix}`);
            } else {
                lines.push(`Decreases ${statName} by ${absVal}${unitSuffix}`);
            }
        }
    });
    return lines.join(', ');
};

export const generateDebuffEffectSummary = (effects) => {
    if (!effects || typeof effects !== 'object') return '';
    const lines = [];
    Object.entries(effects).forEach(([stat, value]) => {
        if (value !== 0 && value !== null && value !== undefined) {
            const statName = resolveEffectStatName(stat);
            const absVal = Math.abs(value);
            const unitSuffix = UNIT_STATS_SET.has(stat.toLowerCase()) ? ' units' : '';
            lines.push(`Decreases ${statName} by ${absVal}${unitSuffix}`);
        }
    });
    return lines.join(', ');
};

/**
 * Apply buff effects from consumable
 * @param {Object} params - Parameters object
 * @param {Object} params.item - The consumable item
 * @param {Object} params.buffStore - Buff store reference
 * @param {Object} params.effects - Pre-collected buff effects (optional)
 * @param {string} params.targetId - The ID of the target (optional, defaults to 'player')
 * @param {string} params.targetType - The type of target (optional, defaults to 'player')
 * @returns {boolean} - Whether buffs were applied
 */
export const applyBuffEffects = ({ item, buffStore, effects = null, targetId = 'player', targetType = 'player' }) => {
    const { effects: buffEffects, hasBuffs } = effects || collectBuffEffects(item);
    
    if (hasBuffs) {
        const duration = extractConsumableDuration(item);
        const effectSummary = generateBuffEffectSummary(buffEffects);
        buffStore.getState().addBuff({
            name: item.name,
            icon: getIconUrl(item.iconId, 'items'),
            description: item.description || `Temporary enhancement from ${item.name}`,
            effectSummary: effectSummary,
            effects: buffEffects,
            duration: duration,
            source: 'consumable',
            stackable: false,
            targetId: targetId,
            targetType: targetType
        });
    }
    
    return hasBuffs;
};

/**
 * Apply debuff effects from consumable
 * @param {Object} params - Parameters object
 * @param {Object} params.item - The consumable item
 * @param {Object} params.debuffStore - Debuff store reference
 * @param {Object} params.effects - Pre-collected debuff effects (optional)
 * @param {string} params.targetId - The ID of the target (optional, defaults to 'player')
 * @param {string} params.targetType - The type of target (optional, defaults to 'player')
 * @returns {boolean} - Whether debuffs were applied
 */
export const applyDebuffEffects = ({ item, debuffStore, effects = null, targetId = 'player', targetType = 'player' }) => {
    const { effects: debuffEffects, hasDebuffs } = effects || collectDebuffEffects(item);
    
    if (hasDebuffs) {
        const duration = extractConsumableDuration(item);
        const effectSummary = generateDebuffEffectSummary(debuffEffects);
        debuffStore.getState().addDebuff({
            name: item.name,
            icon: getIconUrl(item.iconId, 'items'),
            description: item.description || `Temporary negative effect from ${item.name}`,
            effectSummary: effectSummary,
            effects: debuffEffects,
            duration: duration,
            source: 'consumable',
            stackable: false,
            targetId: targetId,
            targetType: targetType
        });
    }
    
    return hasDebuffs;
};

/**
 * Main function to use a consumable item
 * @param {Object} params - Parameters object
 * @param {Object} params.item - The consumable item to use
 * @param {Object} params.stores - Store references { characterStore, buffStore, debuffStore, partyStore, gameStore, inventoryStore }
 * @param {Function} params.onOverheal - Callback when overheal is detected (receives array of overheals)
 * @param {Function} params.onSuccess - Callback when consumable is successfully used
 * @returns {Object} - { success: boolean, pendingOverheal: boolean, overheals: array }
 */
export const useConsumable = ({ item, stores, onOverheal, onSuccess }) => {
    const { characterStore, buffStore, debuffStore, partyStore, gameStore, inventoryStore } = stores;
    const charState = characterStore.getState();
    const combatStats = item.combatStats || {};
    
    const pendingOverheals = [];
    let hasInstantEffects = false;

    if (combatStats.healthRestore) {
        const healAmount = combatStats.healthRestore.value || 0;
        if (healAmount !== 0) {
            if (healAmount > 0) {
                const result = calculateResourceAdjustment({
                    resourceType: 'health',
                    amount: healAmount,
                    currentResource: charState.health,
                    item
                });
                if (result.applied) {
                    hasInstantEffects = true;
                    applyResourceChange({
                        resourceType: 'health',
                        amount: healAmount,
                        asTemporary: false,
                        stores: { characterStore, partyStore, gameStore }
                    });
                } else if (result.pendingOverheal) {
                    pendingOverheals.push(result.pendingOverheal);
                }
            } else {
                hasInstantEffects = true;
                applyResourceChange({
                    resourceType: 'health',
                    amount: healAmount,
                    asTemporary: false,
                    stores: { characterStore, partyStore, gameStore }
                });
            }
        }
    }

    if (combatStats.manaRestore) {
        const manaAmount = combatStats.manaRestore.value || 0;
        if (manaAmount !== 0) {
            if (manaAmount > 0) {
                const result = calculateResourceAdjustment({
                    resourceType: 'mana',
                    amount: manaAmount,
                    currentResource: charState.mana,
                    item
                });
                if (result.applied) {
                    hasInstantEffects = true;
                    applyResourceChange({
                        resourceType: 'mana',
                        amount: manaAmount,
                        asTemporary: false,
                        stores: { characterStore, partyStore, gameStore }
                    });
                } else if (result.pendingOverheal) {
                    pendingOverheals.push(result.pendingOverheal);
                }
            } else {
                hasInstantEffects = true;
                applyResourceChange({
                    resourceType: 'mana',
                    amount: manaAmount,
                    asTemporary: false,
                    stores: { characterStore, partyStore, gameStore }
                });
            }
        }
    }

    if (combatStats.actionPointRestore || combatStats.apRestore) {
        const apAmount = combatStats.actionPointRestore?.value || combatStats.apRestore?.value || 0;
        if (apAmount !== 0) {
            if (apAmount > 0) {
                const result = calculateResourceAdjustment({
                    resourceType: 'actionPoints',
                    amount: apAmount,
                    currentResource: charState.actionPoints,
                    item
                });
                if (result.applied) {
                    hasInstantEffects = true;
                    applyResourceChange({
                        resourceType: 'actionPoints',
                        amount: apAmount,
                        asTemporary: false,
                        stores: { characterStore, partyStore, gameStore }
                    });
                } else if (result.pendingOverheal) {
                    pendingOverheals.push(result.pendingOverheal);
                }
            } else {
                hasInstantEffects = true;
                applyResourceChange({
                    resourceType: 'actionPoints',
                    amount: apAmount,
                    asTemporary: false,
                    stores: { characterStore, partyStore, gameStore }
                });
            }
        }
    }

    if (pendingOverheals.length > 0) {
        if (onOverheal) {
            onOverheal(pendingOverheals);
        }
        return { success: false, pendingOverheal: true, overheals: pendingOverheals };
    }

    const { effects: buffEffects, hasBuffs } = collectBuffEffects(item);
    const { effects: debuffEffects, hasDebuffs } = collectDebuffEffects(item);
    
    // Use serverPlayerId for proper multiplayer buff sync
    const gameState = gameStore.getState();
    const targetId = gameState.currentPlayer?.id || charState.currentCharacterId || charState.id || 'player';
    const targetType = 'player';

    if (hasBuffs) {
        applyBuffEffects({ item, buffStore, effects: { effects: buffEffects, hasBuffs }, targetId, targetType });
    }

    if (hasDebuffs) {
        applyDebuffEffects({ item, debuffStore, effects: { effects: debuffEffects, hasDebuffs }, targetId, targetType });
    }

    if (inventoryStore) {
        inventoryStore.getState().removeItem(item.id, 1);
    }

    if (onSuccess) {
        onSuccess();
    }

    return { success: true, pendingOverheal: false, overheals: [] };
};

/**
 * Complete consumable usage after overheal decision
 * @param {Object} params - Parameters object
 * @param {Array} params.overheals - Array of overheal data
 * @param {Object} params.item - The consumable item
 * @param {Object} params.stores - Store references
 * @param {boolean} params.asTemporary - Whether to add excess as temporary
 * @param {string} params.resourceType - Specific resource type to process (null for all)
 */
export const completeConsumableUsage = ({ overheals, item, stores, asTemporary, resourceType = null }) => {
    const { characterStore, buffStore, debuffStore, partyStore, gameStore, inventoryStore } = stores;
    
    const overhealsToProcess = resourceType 
        ? overheals.filter(oh => oh.resourceType === resourceType)
        : overheals;

    overhealsToProcess.forEach(overheal => {
        applyResourceChange({
            resourceType: overheal.resourceType,
            amount: overheal.amount,
            asTemporary,
            stores: { characterStore, partyStore, gameStore }
        });
    });

    // Apply buff/debuff effects once
    const charState = characterStore.getState();
    const gameState = gameStore.getState();
    const targetId = gameState.currentPlayer?.id || charState.currentCharacterId || charState.id || 'player';
    const targetType = 'player';

    const { effects: buffEffects, hasBuffs } = collectBuffEffects(item);
    const { effects: debuffEffects, hasDebuffs } = collectDebuffEffects(item);

    if (hasBuffs) {
        applyBuffEffects({ item, buffStore, effects: { effects: buffEffects, hasBuffs }, targetId, targetType });
    }

    if (hasDebuffs) {
        applyDebuffEffects({ item, debuffStore, effects: { effects: debuffEffects, hasDebuffs }, targetId, targetType });
    }

    const remainingOverheals = resourceType 
        ? overheals.filter(oh => oh.resourceType !== resourceType)
        : [];

    if (remainingOverheals.length === 0) {
        if (inventoryStore) {
            inventoryStore.getState().removeItem(item.id, 1);
        }
    }

    return { remainingOverheals };
};

export default {
    calculateResourceAdjustment,
    extractConsumableDuration,
    collectBuffEffects,
    collectDebuffEffects,
    generateBuffEffectSummary,
    generateDebuffEffectSummary,
    applyResourceChange,
    syncResourceToAll,
    applyBuffEffects,
    applyDebuffEffects,
    useConsumable,
    completeConsumableUsage
};
