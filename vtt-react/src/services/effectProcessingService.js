/**
 * Effect Processing Service
 * Handles processing of buff/debuff effects including:
 * - Damage over time (DOT)
 * - Healing over time (HOT)
 * - Mana drain/regen
 * - Stat modifications
 */

import useBuffStore from '../store/buffStore';
import useDebuffStore from '../store/debuffStore';
import useCreatureStore from '../store/creatureStore';
import useCharacterStore from '../store/characterStore';
import useChatStore from '../store/chatStore';

/**
 * Simple dice roller for formulas like "1d6", "2d4 + 2", etc.
 */
const rollDice = (formula) => {
    if (!formula) return 0;
    
    // Handle simple number
    if (/^\d+$/.test(formula.trim())) {
        return parseInt(formula.trim());
    }
    
    let total = 0;
    const parts = formula.toLowerCase().replace(/\s/g, '').split(/([+-])/);
    let operator = '+';
    
    for (const part of parts) {
        if (part === '+' || part === '-') {
            operator = part;
            continue;
        }
        
        let value = 0;
        
        // Check for dice notation (e.g., 2d6)
        const diceMatch = part.match(/^(\d*)d(\d+)$/);
        if (diceMatch) {
            const count = parseInt(diceMatch[1]) || 1;
            const sides = parseInt(diceMatch[2]);
            for (let i = 0; i < count; i++) {
                value += Math.floor(Math.random() * sides) + 1;
            }
        } else {
            // Plain number
            value = parseInt(part) || 0;
        }
        
        if (operator === '+') {
            total += value;
        } else {
            total -= value;
        }
    }
    
    return Math.max(0, total);
};

/**
 * Get resistance value for a damage type
 * Returns a multiplier (1.0 = no resistance, 0.5 = 50% resistance, 0 = immune)
 */
const getResistanceMultiplier = (targetId, targetType, damageElement) => {
    if (!damageElement || damageElement === 'healing') return 1.0;
    
    // Map element types to resistance stat names
    const resistanceMap = {
        'physical': 'physical_resistance',
        'fire': 'fire_resistance',
        'cold': 'cold_resistance',
        'lightning': 'lightning_resistance',
        'poison': 'poison_resistance',
        'acid': 'acid_resistance',
        'necrotic': 'necrotic_resistance',
        'radiant': 'radiant_resistance',
        'psychic': 'psychic_resistance',
        'thunder': 'thunder_resistance',
        'force': 'force_resistance'
    };
    
    const resistanceStat = resistanceMap[damageElement.toLowerCase()];
    if (!resistanceStat) return 1.0;
    
    let resistanceValue = 0;
    
    if (targetType === 'player' || targetId === 'player') {
        // Get player resistances
        const characterStore = useCharacterStore.getState();
        const resistances = characterStore.resistances || {};
        resistanceValue = resistances[damageElement.toLowerCase()] || resistances[resistanceStat] || 0;
    } else {
        // Get creature resistances
        const creatureStore = useCreatureStore.getState();
        const token = creatureStore.tokens.find(t => t.id === targetId);
        if (token) {
            const creature = creatureStore.creatures.find(c => c.id === token.creatureId);
            if (creature) {
                const resistances = creature.resistances || creature.stats?.resistances || {};
                resistanceValue = resistances[damageElement.toLowerCase()] || resistances[resistanceStat] || 0;
                
                // Check for immunities
                const immunities = creature.immunities || [];
                if (immunities.includes(damageElement.toLowerCase())) {
                    return 0; // Immune = no damage
                }
            }
        }
    }
    
    // Convert resistance percentage to multiplier (e.g., 50% resistance = 0.5 multiplier)
    // Resistance values are typically stored as percentages (0-100)
    const multiplier = Math.max(0, 1 - (resistanceValue / 100));
    return multiplier;
};

/**
 * Process a single over-time effect tick
 */
const processEffectTick = (effect, targetId, targetType) => {
    if (!effect.hasOverTimeEffect) return null;
    
    let amount = rollDice(effect.overTimeFormula);
    if (amount === 0) return null;
    
    // Apply resistance for damage effects
    let resistanceMultiplier = 1.0;
    let resistanceText = '';
    if (effect.overTimeType === 'damage') {
        resistanceMultiplier = getResistanceMultiplier(targetId, targetType, effect.overTimeElement);
        if (resistanceMultiplier === 0) {
            // Target is immune
            const result = {
                effectName: effect.name,
                targetId,
                targetType,
                amount: 0,
                originalAmount: amount,
                type: effect.overTimeType,
                element: effect.overTimeElement,
                immune: true,
                message: `${effect.name}: Target is immune to ${effect.overTimeElement} damage`
            };
            
            // Log immunity to combat chat
            const chatStore = useChatStore.getState();
            if (chatStore.addCombatNotification) {
                chatStore.addCombatNotification({
                    type: 'immunity',
                    content: result.message,
                    effectName: effect.name,
                    element: effect.overTimeElement,
                    timestamp: new Date().toISOString()
                });
            }
            return result;
        }
        
        const originalAmount = amount;
        amount = Math.floor(amount * resistanceMultiplier);
        
        if (resistanceMultiplier < 1.0) {
            const resistancePercent = Math.round((1 - resistanceMultiplier) * 100);
            resistanceText = ` (${resistancePercent}% resisted)`;
        }
    }
    
    const result = {
        effectName: effect.name,
        targetId,
        targetType,
        amount,
        type: effect.overTimeType,
        element: effect.overTimeElement,
        resistanceMultiplier,
        resistanceText
    };
    
    // Apply the effect based on type
    if (targetType === 'player' || targetId === 'player') {
        // Apply to player character
        const characterStore = useCharacterStore.getState();
        
        switch (effect.overTimeType) {
            case 'damage': {
                const currentHp = characterStore.health?.current || 0;
                const newHp = Math.max(0, currentHp - amount);
                characterStore.updateHealth({ current: newHp });
                result.newValue = newHp;
                result.message = `${effect.name} deals ${amount} ${effect.overTimeElement} damage${resistanceText}`;
                break;
            }
            case 'healing': {
                const healCurrentHp = characterStore.health?.current || 0;
                const healMaxHp = characterStore.health?.max || 100;
                const healedHp = Math.min(healMaxHp, healCurrentHp + amount);
                characterStore.updateHealth({ current: healedHp });
                result.newValue = healedHp;
                result.message = `${effect.name} heals for ${amount}`;
                break;
            }
            case 'mana_drain': {
                const currentMana = characterStore.mana?.current || 0;
                const newMana = Math.max(0, currentMana - amount);
                characterStore.updateMana({ current: newMana });
                result.newValue = newMana;
                result.message = `${effect.name} drains ${amount} mana`;
                break;
            }
            case 'mana_regen': {
                const regenCurrentMana = characterStore.mana?.current || 0;
                const maxMana = characterStore.mana?.max || 100;
                const regenMana = Math.min(maxMana, regenCurrentMana + amount);
                characterStore.updateMana({ current: regenMana });
                result.newValue = regenMana;
                result.message = `${effect.name} restores ${amount} mana`;
                break;
            }
        }
    } else {
        // Apply to creature token
        const creatureStore = useCreatureStore.getState();
        const token = creatureStore.tokens.find(t => t.id === targetId);
        
        if (token) {
            const creature = creatureStore.creatures.find(c => c.id === token.creatureId);
            const creatureName = creature?.name || 'Creature';
            
            switch (effect.overTimeType) {
                case 'damage': {
                    const currentHp = token.state?.currentHp || 0;
                    const newHp = Math.max(0, currentHp - amount);
                    creatureStore.updateTokenState(targetId, { currentHp: newHp });
                    result.newValue = newHp;
                    result.message = `${effect.name} deals ${amount} ${effect.overTimeElement} damage to ${creatureName}${resistanceText}`;
                    break;
                }
                case 'healing': {
                    const healCurrentHp = token.state?.currentHp || 0;
                    const maxHp = creature?.stats?.maxHp || 100;
                    const healedHp = Math.min(maxHp, healCurrentHp + amount);
                    creatureStore.updateTokenState(targetId, { currentHp: healedHp });
                    result.newValue = healedHp;
                    result.message = `${effect.name} heals ${creatureName} for ${amount}`;
                    break;
                }
                case 'mana_drain': {
                    const currentMana = token.state?.currentMana || 0;
                    const newMana = Math.max(0, currentMana - amount);
                    creatureStore.updateTokenState(targetId, { currentMana: newMana });
                    result.newValue = newMana;
                    result.message = `${effect.name} drains ${amount} mana from ${creatureName}`;
                    break;
                }
                case 'mana_regen': {
                    const regenCurrentMana = token.state?.currentMana || 0;
                    const creatureMaxMana = creature?.stats?.maxMana || 100;
                    const regenMana = Math.min(creatureMaxMana, regenCurrentMana + amount);
                    creatureStore.updateTokenState(targetId, { currentMana: regenMana });
                    result.newValue = regenMana;
                    result.message = `${effect.name} restores ${amount} mana to ${creatureName}`;
                    break;
                }
            }
        }
    }
    
    // Log to combat chat
    if (result.message) {
        const chatStore = useChatStore.getState();
        if (chatStore.addCombatNotification) {
            chatStore.addCombatNotification({
                type: effect.overTimeType === 'damage' ? 'damage' : 'healing',
                content: result.message,
                effectName: effect.name,
                amount: amount,
                element: effect.overTimeElement,
                timestamp: new Date().toISOString()
            });
        }
    }
    
    return result;
};

/**
 * Process all over-time effects for a specific target
 * Called when it's that target's turn or on tick intervals
 */
export const processOverTimeEffectsForTarget = (targetId, tickTiming = 'turn') => {
    const buffStore = useBuffStore.getState();
    const debuffStore = useDebuffStore.getState();
    
    const results = [];
    
    // Process buffs
    buffStore.activeBuffs
        .filter(buff => buff.targetId === targetId && buff.hasOverTimeEffect)
        .filter(buff => buff.tickFrequency === tickTiming || buff.tickFrequency === 'realtime')
        .forEach(buff => {
            const result = processEffectTick(buff, targetId, buff.targetType);
            if (result) results.push(result);
        });
    
    // Process debuffs
    debuffStore.activeDebuffs
        .filter(debuff => debuff.targetId === targetId && debuff.hasOverTimeEffect)
        .filter(debuff => debuff.tickFrequency === tickTiming || debuff.tickFrequency === 'realtime')
        .forEach(debuff => {
            const result = processEffectTick(debuff, targetId, debuff.targetType);
            if (result) results.push(result);
        });
    
    return results;
};

/**
 * Process all real-time effects (called on interval timer)
 */
export const processRealtimeEffects = () => {
    const buffStore = useBuffStore.getState();
    const debuffStore = useDebuffStore.getState();
    
    const results = [];
    
    // Get all unique target IDs with realtime effects
    const targets = new Set();
    
    buffStore.activeBuffs
        .filter(buff => buff.hasOverTimeEffect && buff.tickFrequency === 'realtime')
        .forEach(buff => targets.add(buff.targetId));
    
    debuffStore.activeDebuffs
        .filter(debuff => debuff.hasOverTimeEffect && debuff.tickFrequency === 'realtime')
        .forEach(debuff => targets.add(debuff.targetId));
    
    // Process each target
    targets.forEach(targetId => {
        const targetResults = processOverTimeEffectsForTarget(targetId, 'realtime');
        results.push(...targetResults);
    });
    
    return results;
};

/**
 * Get total stat modifiers for a target from all active buffs/debuffs
 */
export const getStatModifiersForTarget = (targetId) => {
    const buffStore = useBuffStore.getState();
    const debuffStore = useDebuffStore.getState();
    
    const modifiers = {};
    
    // Collect buff effects
    buffStore.activeBuffs
        .filter(buff => buff.targetId === targetId)
        .forEach(buff => {
            if (buff.effects) {
                Object.entries(buff.effects).forEach(([stat, value]) => {
                    modifiers[stat] = (modifiers[stat] || 0) + value;
                });
            }
        });
    
    // Collect debuff effects (these should already be negative in the effects object)
    debuffStore.activeDebuffs
        .filter(debuff => debuff.targetId === targetId)
        .forEach(debuff => {
            if (debuff.effects) {
                Object.entries(debuff.effects).forEach(([stat, value]) => {
                    // Ensure debuff values are negative
                    const effectiveValue = value > 0 ? -value : value;
                    modifiers[stat] = (modifiers[stat] || 0) + effectiveValue;
                });
            }
        });
    
    return modifiers;
};

/**
 * Apply stat modifiers to a creature's effective stats
 */
export const getCreatureEffectiveStats = (creature, tokenId) => {
    if (!creature?.stats) return creature?.stats || {};
    
    const modifiers = getStatModifiersForTarget(tokenId);
    const effectiveStats = { ...creature.stats };
    
    // Apply modifiers
    Object.entries(modifiers).forEach(([stat, modifier]) => {
        if (effectiveStats[stat] !== undefined) {
            effectiveStats[stat] = Math.max(0, effectiveStats[stat] + modifier);
        }
    });
    
    return effectiveStats;
};

// Real-time effect processing timer
let realtimeTimerId = null;
let lastTickTimes = new Map(); // Track when each effect last ticked

/**
 * Calculate tick interval in milliseconds based on frequency settings
 */
const getTickIntervalMs = (effect) => {
    const value = effect.tickFrequencyValue || 1;
    const unit = effect.tickFrequencyUnit || 'rounds';
    
    switch (unit) {
        case 'rounds':
            return value * 6000; // 1 round = 6 seconds
        case 'minutes':
            return value * 60000;
        case 'hours':
            return value * 3600000;
        default:
            return value * 6000;
    }
};

/**
 * Check if an effect should tick based on its interval
 */
const shouldEffectTick = (effect) => {
    const effectKey = effect.id;
    const now = Date.now();
    const lastTick = lastTickTimes.get(effectKey) || 0;
    const interval = getTickIntervalMs(effect);
    
    if (now - lastTick >= interval) {
        lastTickTimes.set(effectKey, now);
        return true;
    }
    return false;
};

/**
 * Process real-time effects with proper interval checking
 */
const processRealtimeEffectsWithInterval = () => {
    const buffStore = useBuffStore.getState();
    const debuffStore = useDebuffStore.getState();
    
    const results = [];
    
    // Process buffs with realtime tick frequency
    buffStore.activeBuffs
        .filter(buff => buff.hasOverTimeEffect && buff.tickFrequency === 'realtime')
        .filter(buff => shouldEffectTick(buff))
        .forEach(buff => {
            const result = processEffectTick(buff, buff.targetId, buff.targetType);
            if (result) results.push(result);
        });
    
    // Process debuffs with realtime tick frequency
    debuffStore.activeDebuffs
        .filter(debuff => debuff.hasOverTimeEffect && debuff.tickFrequency === 'realtime')
        .filter(debuff => shouldEffectTick(debuff))
        .forEach(debuff => {
            const result = processEffectTick(debuff, debuff.targetId, debuff.targetType);
            if (result) results.push(result);
        });
    
    return results;
};

/**
 * Start real-time effect processing
 * Checks every second for effects that need to tick
 */
export const startRealtimeEffectProcessing = () => {
    if (realtimeTimerId) {
        console.log('[EffectProcessing] Real-time processing already running');
        return;
    }
    
    console.log('[EffectProcessing] Starting real-time effect processing');
    
    // Check every second for effects that need to tick
    realtimeTimerId = setInterval(() => {
        processRealtimeEffectsWithInterval();
    }, 1000);
};

/**
 * Stop real-time effect processing
 */
export const stopRealtimeEffectProcessing = () => {
    if (realtimeTimerId) {
        console.log('[EffectProcessing] Stopping real-time effect processing');
        clearInterval(realtimeTimerId);
        realtimeTimerId = null;
    }
};

/**
 * Check if real-time processing is active
 */
export const isRealtimeProcessingActive = () => {
    return realtimeTimerId !== null;
};

/**
 * Clean up tick tracking for removed effects
 */
export const cleanupEffectTracking = (effectId) => {
    lastTickTimes.delete(effectId);
};

export default {
    processOverTimeEffectsForTarget,
    processRealtimeEffects,
    getStatModifiersForTarget,
    getCreatureEffectiveStats,
    rollDice,
    startRealtimeEffectProcessing,
    stopRealtimeEffectProcessing,
    isRealtimeProcessingActive,
    cleanupEffectTracking
};

