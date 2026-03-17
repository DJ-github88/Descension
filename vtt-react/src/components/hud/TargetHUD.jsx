import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Draggable from 'react-draggable';
import { createPortal } from 'react-dom';
import useTargetingStore from '../../store/targetingStore';
import useGameStore from '../../store/gameStore';
import usePartyStore from '../../store/partyStore';
import useCharacterStore from '../../store/characterStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import { CONDITIONS } from '../../data/conditionsData';
import useBuffStore from '../../store/buffStore';
import useDebuffStore from '../../store/debuffStore';
import useChatStore from '../../store/chatStore';
import ClassResourceBar from './ClassResourceBar';
import ConditionDurationModal from '../modals/ConditionDurationModal';
import EnhancedCreatureInspectView from '../creature-wizard/components/common/EnhancedCreatureInspectView';
import { getBackgroundData } from '../../data/backgroundData';
import { getCustomBackgroundData } from '../../data/customBackgroundData';
import { getEnhancedPathData } from '../../data/enhancedPathData';
import { getIconUrl, getCreatureTokenIconUrl } from '../../utils/assetManager';
import { getTokenResources, getStateKeyForResource, getTempFieldName } from '../../utils/tokenStateUtils';
// REMOVED: import '../../styles/party-hud.css'; // CAUSES CSS POLLUTION - loaded centrally
// REMOVED: import '../../styles/buff-container.css'; // CAUSES CSS POLLUTION - loaded centrally
import './styles/ClassResourceBar.css';

// Helper function to get background display name
const getBackgroundDisplayName = (backgroundId, backgroundDisplayName) => {
    if (backgroundDisplayName) {
        return backgroundDisplayName;
    }
    if (backgroundId) {
        const bgData = getBackgroundData(backgroundId);
        if (bgData) {
            return bgData.name;
        }
        // Try custom backgrounds
        const customBgData = getCustomBackgroundData(backgroundId.toLowerCase());
        if (customBgData) {
            return customBgData.name;
        }
    }
    return '';
};

// Helper function to get path/discipline display name
const getPathDisplayName = (pathId, pathDisplayName) => {
    if (pathDisplayName) {
        return pathDisplayName;
    }
    if (pathId) {
        const pathData = getEnhancedPathData(pathId);
        if (pathData) {
            return pathData.name;
        }
    }
    return '';
};

const normalizeConditionKey = (value) => String(value || '').trim().toLowerCase();

const getStableConditionId = (condition, scopeKey = 'target') => {
    const normalizedName = normalizeConditionKey(condition?.name || condition?.id || 'condition');
    const normalizedId = normalizeConditionKey(condition?.id);

    // Keep store-generated IDs intact when available
    if (normalizedId && (normalizedId.startsWith('buff_') || normalizedId.startsWith('debuff_'))) {
        return condition.id;
    }

    const safeScope = normalizeConditionKey(scopeKey || 'target');
    return `condition:${safeScope}:${normalizedName || normalizedId || 'unknown'}`;
};

const conditionMatches = (leftCondition, rightCondition) => {
    if (!leftCondition || !rightCondition) return false;

    const leftId = normalizeConditionKey(leftCondition.id);
    const rightId = normalizeConditionKey(rightCondition.id);
    const leftName = normalizeConditionKey(leftCondition.name || leftCondition.sourceConditionName || leftCondition.id);
    const rightName = normalizeConditionKey(rightCondition.name || rightCondition.sourceConditionName || rightCondition.id);
    const rightSourceId = normalizeConditionKey(rightCondition.sourceConditionId);

    if (leftId && rightId && leftId === rightId) return true;
    if (leftId && rightSourceId && leftId === rightSourceId) return true;
    if (leftName && rightName && leftName === rightName) return true;
    if (leftId && rightName && leftId === rightName) return true;
    if (leftName && rightId && leftName === rightId) return true;

    return false;
};

const toFiniteNumber = (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : null;
};

const getFallbackConditionRemainingSeconds = (condition, now = Date.now()) => {
    if (!condition) return 0;

    if (condition.durationType === 'rounds') {
        const rounds = toFiniteNumber(condition.remainingRounds ?? condition.durationValue ?? condition.duration);
        return rounds ? Math.max(0, Math.ceil(rounds)) * 6 : 0;
    }

    const endTime = toFiniteNumber(condition.endTime);
    if (endTime && endTime > 0) {
        return Math.max(0, Math.ceil((endTime - now) / 1000));
    }

    const appliedAt = toFiniteNumber(condition.appliedAt ?? condition.startTime);
    const durationRaw = toFiniteNumber(condition.duration);

    if (appliedAt && durationRaw && durationRaw > 0) {
        const durationMs = durationRaw > 1000 ? durationRaw : durationRaw * 1000;
        return Math.max(0, Math.ceil((appliedAt + durationMs - now) / 1000));
    }

    if (durationRaw && durationRaw > 0) {
        return durationRaw > 1000 ? Math.ceil(durationRaw / 1000) : Math.ceil(durationRaw);
    }

    return 0;
};

const TargetHUD = ({ position, onOpenCharacterSheet }) => {
    const nodeRef = useRef(null);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [hoveredMenuItem, setHoveredMenuItem] = useState(null);
    const contextMenuRef = useRef(null);
    const [tooltip, setTooltip] = useState({ show: false, content: '', position: { x: 0, y: 0 } });
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [conditionContextMenu, setConditionContextMenu] = useState({ show: false, condition: null, position: { x: 0, y: 0 } });
    const [showDurationModal, setShowDurationModal] = useState(false);
    const [durationModalCondition, setDurationModalCondition] = useState(null);
    const [showCreatureInspect, setShowCreatureInspect] = useState(false);
    const [inspectCreatureData, setInspectCreatureData] = useState(null);
    const [inspectToken, setInspectToken] = useState(null);
    const [showOverhealModal, setShowOverhealModal] = useState(false);
    const [overhealData, setOverhealData] = useState(null); // { resourceType, adjustment, overhealAmount, currentValue, maxValue }

    const { currentTarget, targetType, clearTarget, targetHUDPosition, setTargetHUDPosition, getTargetHUDPosition } = useTargetingStore();
    const { isGMMode } = useGameStore();
    const { updatePartyMember } = usePartyStore();
    const { updateResource, updateClassResource, activeCharacter, updateTempResource } = useCharacterStore();
    const { updateTokenState, getCreature, creatures } = useCreatureStore();
    const { characterTokens } = useCharacterTokenStore();
    const { addCombatNotification } = useChatStore();

    // Get current player data for comparison
    const currentPlayerData = activeCharacter;
    const { getBuffsForTarget, getRemainingTime, updateBuffTimers, getActiveEffects, activeBuffs } = useBuffStore();
    const { getDebuffsForTarget, getRemainingTime: getDebuffRemainingTime, updateDebuffTimers, getActiveDebuffEffects, activeDebuffs } = useDebuffStore();

    // Real-time updates for condition timers - also cleans up expired conditions
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
            // Clean up expired buffs and debuffs (this also syncs with token.state.conditions)
            updateBuffTimers();
            updateDebuffTimers();
            // Clean up expired conditions from character tokens
            const useCharacterTokenStore = require('../../store/characterTokenStore').default;
            const { cleanupExpiredConditions } = useCharacterTokenStore.getState();
            cleanupExpiredConditions();
            // Clean up expired conditions from creature tokens
            const useCreatureStore = require('../../store/creatureStore').default;
            const { cleanupExpiredConditions: cleanupCreatureConditions } = useCreatureStore.getState();
            cleanupCreatureConditions();
        }, 1000); // 1s cadence for visible countdowns and cleanup

        return () => clearInterval(interval);
    }, [updateBuffTimers, updateDebuffTimers]);

    // Close context menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the click is inside any context menu
            const isInsideContextMenu = event.target.closest('.context-menu-container') ||
                event.target.closest('.buff-context-menu') ||
                event.target.closest('.debuff-context-menu') ||
                event.target.closest('.condition-context-menu') ||
                event.target.closest('.unified-context-menu');

            if (!isInsideContextMenu) {
                if (showContextMenu) {
                    setShowContextMenu(false);
                    setHoveredMenuItem(null);
                }
                if (conditionContextMenu.show) {
                    setConditionContextMenu({ show: false, condition: null, position: { x: 0, y: 0 } });
                }
            }
        };

        if (showContextMenu || conditionContextMenu.show) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        // Always return a cleanup function to ensure consistent hook count
        return () => {
            if (showContextMenu || conditionContextMenu.show) {
                document.removeEventListener('mousedown', handleClickOutside);
            }
        };
    }, [showContextMenu, conditionContextMenu.show]);

    // Get reactive store data for proper memoization
    const partyMembers = usePartyStore(state => state.partyMembers);
    const characterState = useCharacterStore(state => state);
    const tokens = useCreatureStore(state => state.tokens);

    // Helper function to calculate modified stats for a creature including buff/debuff effects
    const getModifiedCreatureStats = useCallback((token, baseStats = {}) => {
        if (!token) return baseStats;

        const targetId = token.id;
        const buffEffects = getActiveEffects(targetId);
        const debuffEffects = getActiveDebuffEffects(targetId);

        // Start with base stats
        const modifiedStats = { ...baseStats };

        // Apply buff effects (positive modifiers)
        Object.entries(buffEffects).forEach(([statKey, effects]) => {
            const totalBonus = effects.reduce((sum, e) => sum + e.value, 0);
            modifiedStats[statKey] = (modifiedStats[statKey] || 0) + totalBonus;
        });

        // Apply debuff effects (negative modifiers - already negated by getActiveDebuffEffects)
        Object.entries(debuffEffects).forEach(([statKey, effects]) => {
            const totalPenalty = effects.reduce((sum, e) => sum + e.value, 0);
            modifiedStats[statKey] = (modifiedStats[statKey] || 0) + totalPenalty;
        });

        return modifiedStats;
    }, [getActiveEffects, getActiveDebuffEffects]);

    // Get target data based on type - memoized to ensure reactivity
    const targetData = useMemo(() => {
        if (!currentTarget) return null;

        if (targetType === 'party_member' || targetType === 'player') {
            // For party members, get fresh data from stores instead of cached data
            if (currentTarget.id === 'current-player') {
                // Get fresh data from character store for current player
                return {
                    name: characterState.name,
                    class: characterState.class,
                    race: characterState.raceDisplayName || characterState.race,
                    background: getBackgroundDisplayName(characterState.background, characterState.backgroundDisplayName),
                    path: getPathDisplayName(characterState.path, characterState.pathDisplayName),
                    alignment: characterState.alignment,
                    exhaustionLevel: characterState.exhaustionLevel,
                    health: characterState.health,
                    mana: characterState.mana,
                    actionPoints: characterState.actionPoints,
                    tempHealth: characterState.tempHealth || 0,
                    tempMana: characterState.tempMana || 0,
                    tempActionPoints: characterState.tempActionPoints || 0,
                    classResource: characterState.classResource,
                    level: characterState.level || 1,
                    isCreature: false
                };
            } else {
                // Get fresh data from party store for other party members
                // FIX: Use multi-field matching like updatePartyMember does
                const member = partyMembers.find(m => 
                    m.id === currentTarget.id ||
                    m.userId === currentTarget.id ||
                    m.socketId === currentTarget.id ||
                    m.uid === currentTarget.id ||
                    (currentTarget.userId && (m.id === currentTarget.userId || m.userId === currentTarget.userId)) ||
                    (currentTarget.socketId && (m.id === currentTarget.socketId || m.socketId === currentTarget.socketId))
                );
                if (member) {
                    return {
                        name: member.name,
                        class: member.character?.class || 'Unknown',
                        race: member.character?.raceDisplayName || member.character?.race || 'Unknown',
                        background: getBackgroundDisplayName(member.character?.background, member.character?.backgroundDisplayName),
                        path: getPathDisplayName(member.character?.path, member.character?.pathDisplayName),
                        alignment: member.character?.alignment || 'Neutral',
                        exhaustionLevel: member.character?.exhaustionLevel || 0,
                        health: member.character?.health || { current: 100, max: 100 },
                        mana: member.character?.mana || { current: 0, max: 0 },
                        actionPoints: member.character?.actionPoints || { current: 2, max: 2 },
                        tempHealth: member.character?.tempHealth || 0,
                        tempMana: member.character?.tempMana || 0,
                        tempActionPoints: member.character?.tempActionPoints || 0,
                        classResource: member.character?.classResource,
                        level: member.character?.level || 1,
                        isCreature: false
                    };
                }

                // Fallback to cached data if member not found in party store
                const memberData = currentTarget.data || currentTarget;
                const characterData = memberData.character || memberData;
                return {
                    name: currentTarget.name || memberData.name,
                    class: characterData.class || 'Unknown',
                    race: characterData.raceDisplayName || characterData.race || 'Unknown',
                    background: getBackgroundDisplayName(characterData.background, characterData.backgroundDisplayName),
                    path: getPathDisplayName(characterData.path, characterData.pathDisplayName),
                    alignment: characterData.alignment || 'Neutral',
                    exhaustionLevel: characterData.exhaustionLevel || 0,
                    health: characterData.health || { current: 100, max: 100 },
                    mana: characterData.mana || { current: 0, max: 0 },
                    actionPoints: characterData.actionPoints || { current: 2, max: 2 },
                    tempHealth: characterData.tempHealth || 0,
                    tempMana: characterData.tempMana || 0,
                    tempActionPoints: characterData.tempActionPoints || 0,
                    level: characterData.level || 1,
                    isCreature: false
                };
            }
        } else if (targetType === 'creature') {
            // For creatures, use unified resource accessor
            const token = tokens.find(t => t.id === currentTarget.id);
            const resources = getTokenResources(token || currentTarget, 'creature');

            // Get base stats from creature
            const baseStats = currentTarget.stats || {};
            
            // Apply buff/debuff modifiers to stats
            const modifiedStats = getModifiedCreatureStats(token, baseStats);

            // Calculate max values with buff/debuff modifiers
            const baseHealth = resources.health;
            const baseMana = resources.mana;
            const baseActionPoints = resources.actionPoints;

            // Apply stat modifiers to max values
            const maxHpMod = (modifiedStats.maxHp || 0) - (baseStats.maxHp || 0);
            const maxManaMod = (modifiedStats.maxMana || 0) - (baseStats.maxMana || 0);
            const maxApMod = (modifiedStats.maxActionPoints || 0) - (baseStats.maxActionPoints || 0);

            const health = {
                current: baseHealth.current,
                max: baseHealth.max + maxHpMod
            };
            const mana = {
                current: baseMana.current,
                max: baseMana.max + maxManaMod
            };
            const actionPoints = {
                current: baseActionPoints.current,
                max: baseActionPoints.max + maxApMod
            };

            return {
                name: currentTarget.name,
                race: currentTarget.race || currentTarget.type || 'Creature',
                class: null, // Creatures don't have classes
                alignment: currentTarget.alignment || 'Neutral',
                exhaustionLevel: 0, // Creatures typically don't have exhaustion
                health: health,
                mana: mana,
                actionPoints: actionPoints,
                level: currentTarget.level || 1,
                isCreature: true,
                tempHealth: resources.tempHealth || 0,
                tempMana: resources.tempMana || 0,
                tempActionPoints: resources.tempActionPoints || 0,
                modifiedStats: modifiedStats // Include for reference
            };
        }
        return null;
    }, [targetType, currentTarget, partyMembers, characterState, tokens, getModifiedCreatureStats]);

    // Get target image/icon based on target type
    const getTargetImage = () => {
        if (!currentTarget) return null;

        if (targetType === 'party_member' || targetType === 'player') {
            if (currentTarget.id === 'current-player') {
                // Get current player's character image
                const characterState = useCharacterStore.getState();
                if (characterState.tokenSettings?.customIcon) {
                    return characterState.tokenSettings.customIcon;
                }
                if (characterState.lore?.characterImage) {
                    return characterState.lore.characterImage;
                }
                // Check for characterIcon and convert to URL
                if (characterState.lore?.characterIcon) {
                    return `getIconUrl('${characterState.lore.characterIcon}', 'items')`;
                }
                // Default character icon
                return getIconUrl('inv_misc_head_human_01', 'items');
            } else {
                // Get party member's character image
                const partyState = usePartyStore.getState();
                const member = partyState.partyMembers.find(m => m.id === currentTarget.id);
                if (member?.character) {
                    if (member.character.tokenSettings?.customIcon) {
                        return member.character.tokenSettings.customIcon;
                    }
                    if (member.character.lore?.characterImage) {
                        return member.character.lore.characterImage;
                    }
                    // Check for characterIcon and convert to URL
                    if (member.character.lore?.characterIcon) {
                        return `getIconUrl('${member.character.lore.characterIcon}', 'items')`;
                    }
                }
                // Default character icon
                return getIconUrl('inv_misc_head_human_01', 'items');
            }
        } else if (targetType === 'creature') {
            // Get creature's token image - currentTarget.id is now the token ID
            const token = tokens.find(t => t.id === currentTarget.id);
            if (token?.state?.customIcon) {
                return token.state.customIcon;
            }
            // Get the creature data to check for custom token image
            if (token) {
                const creature = creatures.find(c => c.id === token.creatureId);
                if (creature?.customTokenImage) {
                    return creature.customTokenImage;
                }
                if (creature?.tokenIcon) {
                    return getCreatureTokenIconUrl(creature.tokenIcon, creature.type);
                }
            }
            // Fallback to default creature icon
            return getCreatureTokenIconUrl(null, null);
        }

        return null;
    };

    // Get image transformations for the target
    const getImageTransformations = () => {
        if (!currentTarget) return null;

        if (targetType === 'party_member' || targetType === 'player') {
            if (currentTarget.id === 'current-player') {
                const characterState = useCharacterStore.getState();
                return characterState.lore?.imageTransformations;
            } else {
                const partyState = usePartyStore.getState();
                const member = partyState.partyMembers.find(m => m.id === currentTarget.id);
                return member?.character?.lore?.imageTransformations;
            }
        } else if (targetType === 'creature') {
            // Creatures use token-level transformations
            const token = tokens.find(t => t.id === currentTarget.id);
            if (token?.state) {
                return {
                    scale: (token.state.iconScale || 100) / 100,
                    positionX: ((token.state.iconPosition?.x || 50) - 50) * 2,
                    positionY: ((token.state.iconPosition?.y || 50) - 50) * -2,
                    rotation: 0 // Creatures don't typically have rotation
                };
            }
        }

        return null;
    };

    // Don't render if no target
    if (!currentTarget) {
        console.log('🎯 TargetHUD: No current target, hiding component');
        return null;
    }
    if (!targetData) {
        console.log('🎯 TargetHUD: No target data, hiding component');
        return null;
    }

    // Ensure resource data is properly structured
    const safeHealth = (targetData.health && typeof targetData.health === 'object' &&
        typeof targetData.health.current === 'number' &&
        typeof targetData.health.max === 'number')
        ? targetData.health : { current: 0, max: 1 };

    const safeMana = (targetData.mana && typeof targetData.mana === 'object' &&
        typeof targetData.mana.current === 'number' &&
        typeof targetData.mana.max === 'number')
        ? targetData.mana : { current: 0, max: 0 };

    const safeActionPoints = (targetData.actionPoints && typeof targetData.actionPoints === 'object' &&
        typeof targetData.actionPoints.current === 'number' &&
        typeof targetData.actionPoints.max === 'number')
        ? targetData.actionPoints : { current: 0, max: 1 };

    // Get target ID for buffs/debuffs
    const getTargetId = () => {
        if (targetType === 'party_member' || targetType === 'player') {
            const gameStore = useGameStore.getState();
            const currentPlayerId = gameStore.currentPlayer?.id;

            // If targeting current player, check 'current-player', 'player', and actual playerId
            if (currentTarget.id === 'current-player' ||
                (currentPlayerId && currentTarget.id === currentPlayerId)) {
                return currentTarget.id;
            }
            return currentTarget.id;
        } else if (targetType === 'creature') {
            // For creatures, we now target by tokenId directly
            return currentTarget.id;
        }
        return null;
    };

    const targetId = getTargetId();
    const gameStore = useGameStore.getState();
    const currentPlayerId = gameStore.currentPlayer?.id;

    // Get all relevant store buffs/debuffs
    let rawBuffs = [];
    let rawDebuffs = [];

    if (targetId) {
        rawBuffs = [...getBuffsForTarget(targetId)];
        rawDebuffs = [...getDebuffsForTarget(targetId)];

        // If it's the current player, also check the aliases
        if (targetId === 'current-player' || (currentPlayerId && targetId === currentPlayerId)) {
            if (targetId !== 'player') {
                rawBuffs = [...rawBuffs, ...getBuffsForTarget('player')];
                rawDebuffs = [...rawDebuffs, ...getDebuffsForTarget('player')];
            }
            if (targetId !== 'current-player') {
                rawBuffs = [...rawBuffs, ...getBuffsForTarget('current-player')];
                rawDebuffs = [...rawDebuffs, ...getDebuffsForTarget('current-player')];
            }
            if (currentPlayerId && targetId !== currentPlayerId) {
                rawBuffs = [...rawBuffs, ...getBuffsForTarget(currentPlayerId)];
                rawDebuffs = [...rawDebuffs, ...getDebuffsForTarget(currentPlayerId)];
            }
        }
        
        // For party members, also try looking up by various ID types
        if ((targetType === 'party_member' || targetType === 'player') && targetId !== 'current-player') {
            // Try looking up by userId, socketId if available
            const altIds = [
                currentTarget.userId,
                currentTarget.socketId,
                currentTarget.uid
            ].filter(Boolean);
            
            for (const altId of altIds) {
                const altBuffs = getBuffsForTarget(altId);
                const altDebuffs = getDebuffsForTarget(altId);
                if (altBuffs.length > 0 || altDebuffs.length > 0) {
                    rawBuffs = [...rawBuffs, ...altBuffs];
                    rawDebuffs = [...rawDebuffs, ...altDebuffs];
                }
            }
        }
    }

    // Get conditions from token state
    let rawConditions = [];
    if (targetType === 'creature' && currentTarget?.id) {
        const token = tokens.find(t => t.id === currentTarget.id);
        rawConditions = token?.state?.conditions || [];
    } else if ((targetType === 'party_member' || targetType === 'player') && currentTarget?.id) {
        // Also get conditions from character tokens for party members
        const characterTokenStore = require('../../store/characterTokenStore').default;
        if (currentTarget.id === 'current-player') {
            const playerToken = characterTokenStore.getState().characterTokens.find(t => t.isPlayerToken);
            rawConditions = playerToken?.state?.conditions || [];
        } else {
            // Find by playerId or token id for other party members
            const memberToken = characterTokenStore.getState().characterTokens.find(t => 
                t.playerId === currentTarget.id || 
                t.id === currentTarget.id ||
                t.playerId === currentTarget.userId ||
                t.playerId === currentTarget.socketId
            );
            rawConditions = memberToken?.state?.conditions || [];
        }
    }

    // CONSOLIDATION & DEDUPLICATION LOGIC
    const finalBuffs = [];
    const finalDebuffs = [];
    const dedupeKeys = new Set();
    const targetScopeKey = `${targetType || 'target'}:${currentTarget?.id || currentTarget?.name || 'unknown'}`;

    const registerCondition = (condition) => {
        const stableId = normalizeConditionKey(getStableConditionId(condition, targetScopeKey));
        const sourceId = normalizeConditionKey(condition?.sourceConditionId);
        const id = normalizeConditionKey(condition?.id);
        const name = normalizeConditionKey(condition?.name || condition?.sourceConditionName || condition?.id);

        const keys = [
            stableId ? `stable:${stableId}` : null,
            sourceId ? `source:${sourceId}` : null,
            id ? `id:${id}` : null,
            name ? `name:${name}` : null
        ].filter(Boolean);

        if (keys.some((key) => dedupeKeys.has(key))) {
            return false;
        }

        keys.forEach((key) => dedupeKeys.add(key));
        return true;
    };

    // 1) Store buffs first (authoritative timers)
    rawBuffs.forEach((buff) => {
        const normalizedBuff = {
            ...buff,
            id: buff.id || getStableConditionId(buff, targetScopeKey),
            type: 'buff',
            sourceConditionId: buff.id,
            sourceConditionName: buff.name,
            __isTokenDerived: false,
            __storeConditionId: buff.id || null
        };

        if (!registerCondition(normalizedBuff)) return;
        finalBuffs.push(normalizedBuff);
    });

    // 2) Store debuffs
    rawDebuffs.forEach((debuff) => {
        const normalizedDebuff = {
            ...debuff,
            id: debuff.id || getStableConditionId(debuff, targetScopeKey),
            type: 'debuff',
            sourceConditionId: debuff.id,
            sourceConditionName: debuff.name,
            __isTokenDerived: false,
            __storeConditionId: debuff.id || null
        };

        if (!registerCondition(normalizedDebuff)) return;
        finalDebuffs.push(normalizedDebuff);
    });

    // 3) Token conditions merged into buffs/debuffs (with stable IDs and store fallbacks)
    rawConditions.forEach((condition) => {
        const lookupById = normalizeConditionKey(condition?.id);
        const lookupByName = normalizeConditionKey(condition?.name || condition?.id);
        const conditionData = CONDITIONS[condition?.id] || CONDITIONS[lookupByName] || CONDITIONS[lookupById] || {};

        const inferredType = normalizeConditionKey(condition?.type || conditionData.type) === 'buff' ? 'buff' : 'debuff';
        const matchingStoreCondition = inferredType === 'buff'
            ? rawBuffs.find((buff) => conditionMatches(buff, condition))
            : rawDebuffs.find((debuff) => conditionMatches(debuff, condition));

        const mergedCondition = {
            ...conditionData,
            ...matchingStoreCondition,
            ...condition,
            id: matchingStoreCondition?.id || getStableConditionId(condition, targetScopeKey),
            sourceConditionId: condition.id || matchingStoreCondition?.id,
            sourceConditionName: condition.name || matchingStoreCondition?.name,
            name: condition.name || matchingStoreCondition?.name || conditionData.name || condition.id || 'Condition',
            icon: condition.icon || matchingStoreCondition?.icon || conditionData.icon,
            color: condition.color || matchingStoreCondition?.color || conditionData.color || (inferredType === 'buff' ? '#32CD32' : '#DC143C'),
            description: condition.description || matchingStoreCondition?.description || conditionData.description,
            effectSummary: condition.effectSummary || matchingStoreCondition?.effectSummary || conditionData.effectSummary || '',
            type: inferredType,
            __isTokenDerived: true,
            __storeConditionId: matchingStoreCondition?.id || null
        };

        if (!registerCondition(mergedCondition)) return;

        if (inferredType === 'buff') {
            finalBuffs.push(mergedCondition);
        } else {
            finalDebuffs.push(mergedCondition);
        }
    });

    // Use these consolidated lists for rendering
    const targetBuffs = finalBuffs;
    const targetDebuffs = finalDebuffs;
    const targetConditions = []; // This will now be empty as they are merged into buffs/debuffs

    // Calculate resource percentages and colors
    const healthPercent = safeHealth.max > 0 ? Math.min(100, Math.max(0, (Number(safeHealth.current) / Number(safeHealth.max)) * 100)) : 0;
    const manaPercent = safeMana.max > 0 ? Math.min(100, Math.max(0, (Number(safeMana.current) / Number(safeMana.max)) * 100)) : 0;
    const apPercent = safeActionPoints.max > 0 ? Math.min(100, Math.max(0, (Number(safeActionPoints.current) / Number(safeActionPoints.max)) * 100)) : 0;

    const getHealthColor = (percent) => {
        if (percent > 75) return '#4CAF50';
        if (percent > 50) return '#FFC107';
        if (percent > 25) return '#FF9800';
        return '#F44336';
    };

    const handleRightClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        // Use nativeEvent for stopImmediatePropagation if available
        if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
            e.nativeEvent.stopImmediatePropagation();
        }
        console.log('🎯 TargetHUD: Right-click detected at', e.clientX, e.clientY);
        setContextMenuPosition({ x: e.clientX, y: e.clientY });
        setShowContextMenu(true);
        console.log('🎯 TargetHUD: Context menu state set to true');
    };

    const handleClearTarget = () => {
        clearTarget();
        setShowContextMenu(false);
    };

    const handleInspectTarget = () => {
        console.log('🎯 TargetHUD: Inspect Target clicked!');

        if (!currentTarget || !targetData) {
            console.log('🎯 TargetHUD: No target to inspect');
            setShowContextMenu(false);
            return;
        }

        // Check if inspecting a party member or creature
        if (targetType === 'party_member') {
            // For party members, open their character sheet
            const isSelf = targetData.name === currentPlayerData?.name || targetData.id === 'current-player';

            // Use the same logic as PartyHUD inspect
            if (onOpenCharacterSheet) {
                onOpenCharacterSheet(targetData, isSelf);
                console.log('🎯 TargetHUD: Opening character sheet for:', targetData.name);
            } else {
                console.log('🎯 TargetHUD: Character sheet opener not available');
            }
        } else if (targetType === 'creature') {
            // CRITICAL FIX: Only GMs can inspect creatures
            if (!isGMMode) {
                console.warn('⚠️ TargetHUD: Players cannot inspect creature tokens');
                setShowContextMenu(false);
                return;
            }

            // For creatures, fetch the full creature data from the store and open the inspection window
            console.log('🎯 TargetHUD: Opening creature inspection for:', targetData.name);
            console.log('🎯 TargetHUD: Fetching full creature data for token ID:', currentTarget.id);

            // Get the token first, then get the creature data
            const token = tokens.find(t => t.id === currentTarget.id);
            if (token) {
                const fullCreatureData = getCreature(token.creatureId);
                if (fullCreatureData) {
                    console.log('🎯 TargetHUD: Full creature data found:', fullCreatureData.name);
                    console.log('🎯 TargetHUD: Creature has stats:', !!fullCreatureData.stats);
                    setInspectCreatureData(fullCreatureData);
                    setInspectToken(token);
                    setShowCreatureInspect(true);
                } else {
                    console.error('🎯 TargetHUD: Could not find full creature data for creature ID:', token.creatureId);
                }
            } else {
                console.error('🎯 TargetHUD: Could not find token with ID:', currentTarget.id);
            }
        }

        setShowContextMenu(false);
    };


    // Handler for class resource updates (e.g., Inferno Veil)
    const handleClassResourceUpdate = (field, value) => {
        if (targetType === 'party_member' || targetType === 'player') {
            const memberId = currentTarget?.id;

            if (memberId === 'current-player') {
                // Update current player's class resource in character store
                updateClassResource(field, value);
            } else if (memberId) {
                // Update party member's class resource in party store
                const partyState = usePartyStore.getState();
                const member = partyState.partyMembers.find(m => m.id === memberId);
                if (member && member.character?.classResource) {
                    updatePartyMember(memberId, {
                        character: {
                            ...member.character,
                            classResource: {
                                ...member.character.classResource,
                                [field]: value,
                                lastUpdate: Date.now()
                            }
                        }
                    });
                }
            }
        }
    };

    // Helper function to get character name from target
    const getTargetName = () => {
        if (!currentTarget) return 'Unknown';
        if (targetType === 'creature') {
            return currentTarget.name || 'Creature';
        }
        if (currentTarget.id === 'current-player') {
            return characterState.name || 'Player';
        }
        const member = partyMembers.find(m => m.id === currentTarget.id);
        return member?.name || currentTarget.name || 'Unknown';
    };

    // Helper function to get the actor name (current player, with GM suffix if in GM mode)
    const getActorName = () => {
        const actorName = currentPlayerData?.name || characterState.name || 'Player';
        return isGMMode ? `${actorName} (GM)` : actorName;
    };

    // Helper function to log full restore/drain as a single combined message
    const logFullResourceChange = (characterName, healthAmount, manaAmount, apAmount, isRestore) => {
        const actorName = getActorName();
        const parts = [];

        if (manaAmount > 0) {
            parts.push(`${manaAmount} Mana`);
        }
        if (healthAmount > 0) {
            parts.push(`${healthAmount} Health`);
        }
        if (apAmount > 0) {
            parts.push(`${apAmount} Action Point${apAmount > 1 ? 's' : ''}`);
        }

        if (parts.length === 0) return; // No changes to log

        // Format: "x Mana, y Health and z Action Points"
        let resourceList = '';
        if (parts.length === 1) {
            resourceList = parts[0];
        } else if (parts.length === 2) {
            resourceList = `${parts[0]} and ${parts[1]}`;
        } else {
            resourceList = `${parts[0]}, ${parts[1]} and ${parts[2]}`;
        }

        const actionWord = isRestore ? ['Replenished', 'Restored', 'Recovered'][Math.floor(Math.random() * 3)] : 'Drained';
        const message = `${characterName} ${actionWord} ${resourceList}`;

        addCombatNotification({
            type: isRestore ? 'combat_heal' : 'combat_hit',
            [isRestore ? 'healer' : 'attacker']: actorName,
            target: characterName,
            [isRestore ? 'healing' : 'damage']: healthAmount || manaAmount || apAmount,
            customMessage: message
        });
    };

    // Helper function to generate varied log messages for resource changes (same as PartyHUD)
    const logResourceChange = (characterName, resourceType, amount, isPositive) => {
        const absAmount = Math.abs(amount);
        const actorName = getActorName();

        if (resourceType === 'health') {
            // Use existing combat_heal and combat_hit types for health
            if (isPositive) {
                const messages = [
                    `Healed ${characterName} for ${absAmount} health`,
                    `${characterName} regained ${absAmount} health`,
                    `${characterName} recovered ${absAmount} health`,
                    `Restored ${absAmount} health to ${characterName}`
                ];
                const message = messages[Math.floor(Math.random() * messages.length)];
                addCombatNotification({
                    type: 'combat_heal',
                    healer: actorName,
                    target: characterName,
                    healing: absAmount,
                    customMessage: message
                });
            } else {
                const messages = [
                    `Hit ${characterName} for ${absAmount} damage`,
                    `${characterName} took ${absAmount} damage`,
                    `Dealt ${absAmount} damage to ${characterName}`,
                    `${characterName} suffered ${absAmount} damage`
                ];
                const message = messages[Math.floor(Math.random() * messages.length)];
                addCombatNotification({
                    type: 'combat_hit',
                    attacker: actorName,
                    target: characterName,
                    damage: absAmount,
                    customMessage: message
                });
            }
        } else {
            // For mana and action points, create custom messages
            const resourceNames = {
                'mana': { positive: ['mana'], negative: ['mana'] },
                'actionPoints': { positive: ['action points', 'AP'], negative: ['action points', 'AP'] }
            };
            const resource = resourceNames[resourceType] || { positive: [resourceType], negative: [resourceType] };
            const variants = isPositive ? resource.positive : resource.negative;
            const resourceName = variants[Math.floor(Math.random() * variants.length)];

            let message = '';
            if (isPositive) {
                const messages = [
                    `Restored ${absAmount} ${resourceName} to ${characterName}`,
                    `${characterName} regained ${absAmount} ${resourceName}`,
                    `${characterName} recovered ${absAmount} ${resourceName}`,
                    `Replenished ${absAmount} ${resourceName} for ${characterName}`
                ];
                message = messages[Math.floor(Math.random() * messages.length)];
            } else {
                const messages = [
                    `${characterName} lost ${absAmount} ${resourceName}`,
                    `Drained ${absAmount} ${resourceName} from ${characterName}`,
                    `${characterName} expended ${absAmount} ${resourceName}`,
                    `${absAmount} ${resourceName} was drained from ${characterName}`
                ];
                message = messages[Math.floor(Math.random() * messages.length)];
            }

            // For non-health resources, use combat_hit format but with custom message
            addCombatNotification({
                type: 'combat_hit',
                attacker: actorName,
                target: characterName,
                damage: absAmount,
                resourceType: resourceType,
                customMessage: message
            });
        }
    };

    // Handle resource adjustments (similar to PartyHUD)
    const handleResourceAdjust = (resourceType, adjustment, skipLogging = false) => {
        if (!currentTarget) return;

        // Only handle positive adjustments (healing/restoring) for overheal detection
        if (adjustment > 0) {
            const resource = getTargetResource(resourceType);
            const currentValue = resource.current;
            const maxValue = resource.max;

            // Check for overheal
            if (currentValue + adjustment > maxValue) {
                // Show confirmation modal for temporary resources
                const overhealAmount = (currentValue + adjustment) - maxValue;
                setOverhealData({
                    resourceType,
                    adjustment,
                    overhealAmount,
                    currentValue,
                    maxValue
                });
                setShowOverhealModal(true);
                return; // Don't apply yet, wait for user confirmation
            }
        }

        // Apply the adjustment (no overheal or negative adjustment)
        applyResourceAdjustment(resourceType, adjustment, false, skipLogging);
    };

    const applyResourceAdjustment = (resourceType, adjustment, asTemporary = false, skipLogging = false) => {
        if (!currentTarget) return;

        const tempField = getTempFieldName(resourceType);

        if (targetType === 'party_member' || targetType === 'player') {
            // Update party member or player - get fresh data from stores
            const memberId = currentTarget.id;

            if (memberId === 'current-player') {
                // Update character store directly for current player
                const characterState = useCharacterStore.getState();
                const currentResource = characterState[resourceType];
                if (!currentResource) return;

                const currentValue = currentResource.current || 0;
                const maxValue = currentResource.max || 0;
                const currentTemp = characterState[tempField] || 0;

                if (asTemporary && adjustment > 0) {
                    // Add as temporary resource (overheal)
                    const overhealAmount = (currentValue + adjustment) - maxValue;
                    
                    // Set resource to max and add overheal as temporary
                    updateResource(resourceType, maxValue, maxValue);
                    updateTempResource(resourceType, currentTemp + overhealAmount);
                } else if (adjustment < 0) {
                    // Taking damage/draining - reduce temporary resources first
                    const damageAmount = Math.abs(adjustment);
                    let remainingDamage = damageAmount;
                    let newTemp = currentTemp;
                    let newValue = currentValue;

                    // First, reduce temporary resources
                    if (currentTemp > 0) {
                        if (damageAmount <= currentTemp) {
                            // All damage absorbed by temporary resources
                            newTemp = currentTemp - damageAmount;
                            remainingDamage = 0;
                        } else {
                            // Temporary resources exhausted, remaining damage goes to actual resource
                            remainingDamage = damageAmount - currentTemp;
                            newTemp = 0;
                        }
                    }

                    // Apply remaining damage to actual resource
                    if (remainingDamage > 0) {
                        newValue = Math.max(0, currentValue - remainingDamage);
                    }

                    // Update both resource and temporary resource
                    updateResource(resourceType, newValue, maxValue);
                    if (newTemp !== currentTemp) {
                        updateTempResource(resourceType, newTemp);
                    }
                } else {
                    // Positive adjustment (healing/restoring) - capped at max if not asTemporary
                    const newValue = Math.max(0, Math.min(maxValue, currentValue + adjustment));
                    updateResource(resourceType, newValue, maxValue);
                }

                // Log the resource change (unless logging is skipped)
                if (adjustment !== 0 && !skipLogging) {
                    const characterName = getTargetName();
                    logResourceChange(characterName, resourceType, adjustment, adjustment > 0);
                }
            } else {
                // Update party member through party store
                const partyState = usePartyStore.getState();
                const member = partyState.partyMembers.find(m => m.id === memberId);

                if (member && member.character) {
                    const currentResource = member.character[resourceType];
                    if (!currentResource) return;

                    const currentValue = currentResource.current || 0;
                    const maxValue = currentResource.max || 0;
                    const currentTemp = member.character[tempField] || 0;

                    let finalValue = currentValue;
                    let finalTemp = currentTemp;

                    if (asTemporary && adjustment > 0) {
                        // Add as temporary resource (overheal)
                        const overhealAmount = (currentValue + adjustment) - maxValue;
                        finalValue = maxValue;
                        finalTemp = currentTemp + overhealAmount;

                        updatePartyMember(memberId, {
                            character: {
                                ...member.character,
                                [resourceType]: {
                                    ...member.character[resourceType],
                                    current: finalValue
                                },
                                [tempField]: finalTemp
                            }
                        });
                    } else if (adjustment < 0) {
                        // Taking damage/draining - reduce temporary resources first
                        const damageAmount = Math.abs(adjustment);
                        let remainingDamage = damageAmount;
                        finalTemp = currentTemp;
                        finalValue = currentValue;

                        // First, reduce temporary resources
                        if (currentTemp > 0) {
                            if (damageAmount <= currentTemp) {
                                // All damage absorbed by temporary resources
                                finalTemp = currentTemp - damageAmount;
                                remainingDamage = 0;
                            } else {
                                // Temporary resources exhausted, remaining damage goes to actual resource
                                remainingDamage = damageAmount - currentTemp;
                                finalTemp = 0;
                            }
                        }

                        // Apply remaining damage to actual resource
                        if (remainingDamage > 0) {
                            finalValue = Math.max(0, currentValue - remainingDamage);
                        }

                        // Update both resource and temporary resource
                        updatePartyMember(memberId, {
                            character: {
                                ...member.character,
                                [resourceType]: {
                                    ...member.character[resourceType],
                                    current: finalValue
                                },
                                [tempField]: finalTemp
                            }
                        });
                    } else {
                        // Positive adjustment (healing/restoring) - capped at max
                        finalValue = Math.max(0, Math.min(maxValue, currentValue + adjustment));
                        updatePartyMember(memberId, {
                            character: {
                                ...member.character,
                                [resourceType]: {
                                    ...member.character[resourceType],
                                    current: finalValue
                                }
                            }
                        });
                    }

                    // MULTIPLAYER SYNC: Emit calculated values directly
                    const socket = window.multiplayerSocket;
                    if (socket && socket.connected && adjustment !== 0) {
                        const gameStore = useGameStore.getState();
                        const roomId = gameStore.multiplayerRoom?.id;
                        const capturedPlayerName = member.name;

                        socket.emit('character_resource_updated', {
                            roomId: roomId,
                            playerId: memberId,
                            userId: member.userId || member.uid,
                            socketId: member.socketId,
                            playerName: capturedPlayerName,
                            resource: resourceType,
                            current: finalValue,
                            max: maxValue,
                            temp: finalTemp,
                            adjustment: adjustment,
                            timestamp: Date.now()
                        });
                    }

                    // Log the resource change (unless logging is skipped)
                    if (adjustment !== 0 && !skipLogging) {
                        const characterName = getTargetName();
                        logResourceChange(characterName, resourceType, adjustment, adjustment > 0);
                    }
                }
            }
        } else if (targetType === 'creature') {
            // Update creature token using unified utilities
            const tokenId = currentTarget.id;
            const token = tokens.find(t => t.id === tokenId);

            if (token) {
                const resources = getTokenResources(token, 'creature');
                const resourceMap = {
                    'health': resources.health,
                    'mana': resources.mana,
                    'actionPoints': resources.actionPoints
                };
                const safeResource = resourceMap[resourceType];
                if (safeResource) {
                    const currentValue = safeResource.current;
                    const maxValue = safeResource.max;
                    const currentTemp = tempField ? (token.state?.[tempField] || 0) : 0;

                    let newValue = currentValue;
                    let newTemp = currentTemp;

                    if (asTemporary && adjustment > 0) {
                        // Add overflow as temporary resource
                        const overhealAmount = Math.max(0, (currentValue + adjustment) - maxValue);
                        newValue = Math.min(maxValue, currentValue + adjustment);
                        newTemp = currentTemp + overhealAmount;
                    } else if (adjustment < 0) {
                        // Drain temporary resources first
                        const damageAmount = Math.abs(adjustment);
                        let remainingDamage = damageAmount;

                        if (currentTemp > 0) {
                            if (damageAmount <= currentTemp) {
                                newTemp = currentTemp - damageAmount;
                                remainingDamage = 0;
                            } else {
                                newTemp = 0;
                                remainingDamage = damageAmount - currentTemp;
                            }
                        }

                        if (remainingDamage > 0) {
                            newValue = Math.max(0, currentValue - remainingDamage);
                        }
                    } else {
                        // Standard positive adjustment capped at max
                        newValue = Math.max(0, Math.min(maxValue, currentValue + adjustment));
                    }

                    // Use unified state key accessor
                    const stateKey = getStateKeyForResource(resourceType);

                    if (stateKey) {
                        const stateUpdates = {
                            [stateKey]: newValue
                        };

                        if (tempField && newTemp !== currentTemp) {
                            stateUpdates[tempField] = newTemp;
                        }

                        updateTokenState(token.id, stateUpdates);

                        // Log the resource change (unless logging is skipped)
                        if (adjustment !== 0 && !skipLogging) {
                            const characterName = getTargetName();
                            logResourceChange(characterName, resourceType, adjustment, adjustment > 0);
                        }
                    }
                }
            } else {
                console.error('❌ Token not found for creature:', tokenId);
            }
        }
    };

    // Helper function to get target resource values
    const getTargetResource = (resourceType) => {
        if (!currentTarget || !targetData) return { current: 0, max: 0, temp: 0 };

        if (targetType === 'party_member' || targetType === 'player') {
            const memberId = currentTarget.id;
            if (memberId === 'current-player') {
                if (!currentPlayerData) return { current: 0, max: 0, temp: 0 };
                const resource = currentPlayerData[resourceType];
                if (!resource) return { current: 0, max: 0, temp: 0 };
                const tempField = resourceType === 'health' ? 'tempHealth' :
                    resourceType === 'mana' ? 'tempMana' : 'tempActionPoints';
                return {
                    current: resource?.current || 0,
                    max: resource?.max || 0,
                    temp: currentPlayerData[tempField] || 0
                };
            } else {
                const partyState = usePartyStore.getState();
                const member = partyState.partyMembers.find(m => m.id === memberId);
                if (member && member.character) {
                    const resource = member.character[resourceType];
                    if (!resource) return { current: 0, max: 0, temp: 0 };
                    const tempField = resourceType === 'health' ? 'tempHealth' :
                        resourceType === 'mana' ? 'tempMana' : 'tempActionPoints';
                    return {
                        current: resource?.current || 0,
                        max: resource?.max || 0,
                        temp: member.character[tempField] || 0
                    };
                }
            }
        } else if (targetType === 'creature') {
            // Use unified resource accessor for consistency
            const token = tokens.find(t => t.id === currentTarget.id);
            const resources = getTokenResources(token || currentTarget, 'creature');
            const resourceMap = {
                'health': resources.health,
                'mana': resources.mana,
                'actionPoints': resources.actionPoints
            };
            const tempMap = {
                'health': resources.tempHealth,
                'mana': resources.tempMana,
                'actionPoints': resources.tempActionPoints
            };
            const safeResource = resourceMap[resourceType] || { current: 0, max: 0 };

            return {
                current: safeResource.current || 0,
                max: safeResource.max || 0,
                temp: tempMap[resourceType] || 0
            };
        }
        return { current: 0, max: 0, temp: 0 };
    };

    // Handle full restore all (HP, mana, and AP)
    const handleFullRestoreAll = () => {
        if (!currentTarget || !targetData) return;

        const characterName = getTargetName();

        if (targetType === 'party_member' || targetType === 'player') {
            const memberId = currentTarget.id;

            if (memberId === 'current-player') {
                // Get fresh data from character store
                const characterState = useCharacterStore.getState();
                const maxHp = characterState.health?.max || 0;
                const currentHp = characterState.health?.current || 0;
                const maxMp = characterState.mana?.max || 0;
                const currentMp = characterState.mana?.current || 0;
                const maxAp = characterState.actionPoints?.max || 0;
                const currentAp = characterState.actionPoints?.current || 0;
                const healthAmount = maxHp - currentHp;
                const manaAmount = maxMp - currentMp;
                const apAmount = maxAp - currentAp;

                handleResourceAdjust('health', healthAmount, true);
                handleResourceAdjust('mana', manaAmount, true);
                handleResourceAdjust('actionPoints', apAmount, true);

                // Log as single combined message
                if (healthAmount > 0 || manaAmount > 0 || apAmount > 0) {
                    logFullResourceChange(characterName, healthAmount, manaAmount, apAmount, true);
                }
            } else {
                // Get fresh data from party store
                const partyState = usePartyStore.getState();
                const member = partyState.partyMembers.find(m => m.id === memberId);
                if (member && member.character) {
                    const maxHp = member.character.health?.max || 0;
                    const currentHp = member.character.health?.current || 0;
                    const maxMp = member.character.mana?.max || 0;
                    const currentMp = member.character.mana?.current || 0;
                    const maxAp = member.character.actionPoints?.max || 0;
                    const currentAp = member.character.actionPoints?.current || 0;
                    const healthAmount = maxHp - currentHp;
                    const manaAmount = maxMp - currentMp;
                    const apAmount = maxAp - currentAp;

                    handleResourceAdjust('health', healthAmount, true);
                    handleResourceAdjust('mana', manaAmount, true);
                    handleResourceAdjust('actionPoints', apAmount, true);

                    // Log as single combined message
                    if (healthAmount > 0 || manaAmount > 0 || apAmount > 0) {
                        logFullResourceChange(characterName, healthAmount, manaAmount, apAmount, true);
                    }
                }
            }
        } else if (targetType === 'creature') {
            // For creatures, get fresh data from token state and target stats
            const tokenId = currentTarget.id;
            const token = tokens.find(t => t.id === tokenId);
            if (token) {
                // Use modified stats from targetData (includes buff/debuff effects)
                const modifiedStats = targetData?.modifiedStats || currentTarget.stats || {};
                const maxHp = modifiedStats.maxHp || 0;
                const currentHp = token.state?.currentHp || 0;
                const maxMp = modifiedStats.maxMana || 0;
                const currentMp = token.state?.currentMana || 0;
                const maxAp = modifiedStats.maxActionPoints || 0;
                const currentAp = token.state?.currentActionPoints || 0;
                const healthAmount = maxHp - currentHp;
                const manaAmount = maxMp - currentMp;
                const apAmount = maxAp - currentAp;

                handleResourceAdjust('health', healthAmount, true);
                handleResourceAdjust('mana', manaAmount, true);
                handleResourceAdjust('actionPoints', apAmount, true);

                // Log as single combined message
                if (healthAmount > 0 || manaAmount > 0 || apAmount > 0) {
                    logFullResourceChange(characterName, healthAmount, manaAmount, apAmount, true);
                }
            }
        }
        setShowContextMenu(false);
    };

    // Handle full drain all (HP, mana, and AP, including temporary)
    const handleFullDrainAll = () => {
        if (!currentTarget || !targetData) return;

        const characterName = getTargetName();

        if (targetType === 'party_member' || targetType === 'player') {
            const memberId = currentTarget.id;

            if (memberId === 'current-player') {
                // Get fresh data from character store
                const characterState = useCharacterStore.getState();
                const currentHp = characterState.health?.current || 0;
                const tempHp = characterState.tempHealth || 0;
                const currentMp = characterState.mana?.current || 0;
                const tempMp = characterState.tempMana || 0;
                const currentAp = characterState.actionPoints?.current || 0;
                const tempAp = characterState.tempActionPoints || 0;
                const healthAmount = currentHp + tempHp;
                const manaAmount = currentMp + tempMp;
                const apAmount = currentAp + tempAp;

                // Drain all resources including temporary
                handleResourceAdjust('health', -healthAmount, true);
                handleResourceAdjust('mana', -manaAmount, true);
                handleResourceAdjust('actionPoints', -apAmount, true);

                // Log as single combined message
                if (healthAmount > 0 || manaAmount > 0 || apAmount > 0) {
                    logFullResourceChange(characterName, healthAmount, manaAmount, apAmount, false);
                }
            } else {
                // Get fresh data from party store
                const partyState = usePartyStore.getState();
                const member = partyState.partyMembers.find(m => m.id === memberId);
                if (member && member.character) {
                    const currentHp = member.character.health?.current || 0;
                    const tempHp = member.character.tempHealth || 0;
                    const currentMp = member.character.mana?.current || 0;
                    const tempMp = member.character.tempMana || 0;
                    const currentAp = member.character.actionPoints?.current || 0;
                    const tempAp = member.character.tempActionPoints || 0;
                    const healthAmount = currentHp + tempHp;
                    const manaAmount = currentMp + tempMp;
                    const apAmount = currentAp + tempAp;

                    // Drain all resources including temporary
                    handleResourceAdjust('health', -healthAmount, true);
                    handleResourceAdjust('mana', -manaAmount, true);
                    handleResourceAdjust('actionPoints', -apAmount, true);

                    // Log as single combined message
                    if (healthAmount > 0 || manaAmount > 0 || apAmount > 0) {
                        logFullResourceChange(characterName, healthAmount, manaAmount, apAmount, false);
                    }
                }
            }
        } else if (targetType === 'creature') {
            // For creatures, get fresh data from token state
            const tokenId = currentTarget.id;
            const token = tokens.find(t => t.id === tokenId);
            if (token) {
                const currentHp = token.state?.currentHp || 0;
                const tempHp = token.state?.tempHealth || 0;
                const currentMp = token.state?.currentMana || 0;
                const tempMp = token.state?.tempMana || 0;
                const currentAp = token.state?.currentActionPoints || 0;
                const tempAp = token.state?.tempActionPoints || 0;
                const healthAmount = currentHp + tempHp;
                const manaAmount = currentMp + tempMp;
                const apAmount = currentAp + tempAp;

                // Drain all resources including temporary
                handleResourceAdjust('health', -healthAmount, true);
                handleResourceAdjust('mana', -manaAmount, true);
                handleResourceAdjust('actionPoints', -apAmount, true);

                // Log as single combined message
                if (healthAmount > 0 || manaAmount > 0 || apAmount > 0) {
                    logFullResourceChange(characterName, healthAmount, manaAmount, apAmount, false);
                }
            }
        }
        setShowContextMenu(false);
    };

    // Handle full heal (only health)
    const handleFullHeal = () => {
        if (!currentTarget || !targetData) return;

        const characterName = getTargetName();

        if (targetType === 'party_member' || targetType === 'player') {
            const memberId = currentTarget.id;

            if (memberId === 'current-player') {
                const characterState = useCharacterStore.getState();
                const maxHp = characterState.health?.max || 0;
                const currentHp = characterState.health?.current || 0;
                const healAmount = maxHp - currentHp;
                handleResourceAdjust('health', healAmount);
                // logResourceChange removed - handled by handleResourceAdjust
            } else {
                const partyState = usePartyStore.getState();
                const member = partyState.partyMembers.find(m => m.id === memberId);
                if (member && member.character) {
                    const maxHp = member.character.health?.max || 0;
                    const currentHp = member.character.health?.current || 0;
                    const healAmount = maxHp - currentHp;
                    handleResourceAdjust('health', healAmount);
                    // logResourceChange removed - handled by handleResourceAdjust
                }
            }
        } else if (targetType === 'creature') {
            const tokenId = currentTarget.id;
            const token = tokens.find(t => t.id === tokenId);
            if (token) {
                // Use modified stats from targetData (includes buff/debuff effects)
                const modifiedStats = targetData?.modifiedStats || currentTarget.stats || {};
                const maxHp = modifiedStats.maxHp || 0;
                const currentHp = token.state?.currentHp || 0;
                const healAmount = maxHp - currentHp;
                handleResourceAdjust('health', healAmount);
                // logResourceChange removed - handled by handleResourceAdjust
            }
        }
        setShowContextMenu(false);
    };

    // Handle kill (set health to 0, including temporary HP)
    const handleKill = () => {
        if (!currentTarget || !targetData) return;

        if (targetType === 'party_member' || targetType === 'player') {
            const memberId = currentTarget.id;

            if (memberId === 'current-player') {
                const characterState = useCharacterStore.getState();
                const currentHp = characterState.health?.current || 0;
                const tempHp = characterState.tempHealth || 0;
                handleResourceAdjust('health', -(currentHp + tempHp));
            } else {
                const partyState = usePartyStore.getState();
                const member = partyState.partyMembers.find(m => m.id === memberId);
                if (member && member.character) {
                    const currentHp = member.character.health?.current || 0;
                    const tempHp = member.character.tempHealth || 0;
                    handleResourceAdjust('health', -(currentHp + tempHp));
                }
            }
        } else if (targetType === 'creature') {
            const tokenId = currentTarget.id;
            const token = tokens.find(t => t.id === tokenId);
            if (token) {
                const currentHp = token.state?.currentHp || 0;
                const tempHp = token.state?.tempHealth || 0;
                handleResourceAdjust('health', -(currentHp + tempHp));
            }
        }
        setShowContextMenu(false);
    };

    // Handle drain mana (set mana to 0, including temporary mana)
    const handleDrainMana = () => {
        if (!currentTarget || !targetData) return;

        const characterName = getTargetName();

        if (targetType === 'party_member' || targetType === 'player') {
            const memberId = currentTarget.id;

            if (memberId === 'current-player') {
                const characterState = useCharacterStore.getState();
                const currentMp = characterState.mana?.current || 0;
                const tempMp = characterState.tempMana || 0;
                const drainAmount = currentMp + tempMp;
                handleResourceAdjust('mana', -drainAmount);
                // logResourceChange removed - handled by handleResourceAdjust
            } else {
                const partyState = usePartyStore.getState();
                const member = partyState.partyMembers.find(m => m.id === memberId);
                if (member && member.character) {
                    const currentMp = member.character.mana?.current || 0;
                    const tempMp = member.character.tempMana || 0;
                    const drainAmount = currentMp + tempMp;
                    handleResourceAdjust('mana', -drainAmount);
                    // logResourceChange removed - handled by handleResourceAdjust
                }
            }
        } else if (targetType === 'creature') {
            const tokenId = currentTarget.id;
            const token = tokens.find(t => t.id === tokenId);
            if (token) {
                const currentMp = token.state?.currentMana || 0;
                const tempMp = token.state?.tempMana || 0;
                handleResourceAdjust('mana', -(currentMp + tempMp));
                // logResourceChange removed - handled by handleResourceAdjust
            }
        }
        setShowContextMenu(false);
    };

    // Handle full restore mana (set mana to max)
    const handleFullRestoreMana = () => {
        if (!currentTarget || !targetData) return;

        const characterName = getTargetName();

        if (targetType === 'party_member' || targetType === 'player') {
            const memberId = currentTarget.id;

            if (memberId === 'current-player') {
                const characterState = useCharacterStore.getState();
                const maxMp = characterState.mana?.max || 0;
                const currentMp = characterState.mana?.current || 0;
                const restoreAmount = maxMp - currentMp;
                handleResourceAdjust('mana', restoreAmount);
                // logResourceChange removed - handled by handleResourceAdjust
            } else {
                const partyState = usePartyStore.getState();
                const member = partyState.partyMembers.find(m => m.id === memberId);
                if (member && member.character) {
                    const maxMp = member.character.mana?.max || 0;
                    const currentMp = member.character.mana?.current || 0;
                    const restoreAmount = maxMp - currentMp;
                    handleResourceAdjust('mana', restoreAmount);
                    // logResourceChange removed - handled by handleResourceAdjust
                }
            }
        } else if (targetType === 'creature') {
            const tokenId = currentTarget.id;
            const token = tokens.find(t => t.id === tokenId);
            if (token) {
                // Use modified stats from targetData (includes buff/debuff effects)
                const modifiedStats = targetData?.modifiedStats || currentTarget.stats || {};
                const maxMp = modifiedStats.maxMana || 0;
                const currentMp = token.state?.currentMana || 0;
                const restoreAmount = maxMp - currentMp;
                handleResourceAdjust('mana', restoreAmount);
                // logResourceChange removed - handled by handleResourceAdjust
            }
        }
        setShowContextMenu(false);
    };

    // Handle drain AP (set action points to 0, including temporary AP)
    const handleDrainAP = () => {
        if (!currentTarget || !targetData) return;

        const characterName = getTargetName();

        if (targetType === 'party_member' || targetType === 'player') {
            const memberId = currentTarget.id;

            if (memberId === 'current-player') {
                const characterState = useCharacterStore.getState();
                const currentAp = characterState.actionPoints?.current || 0;
                const tempAp = characterState.tempActionPoints || 0;
                const drainAmount = currentAp + tempAp;
                handleResourceAdjust('actionPoints', -drainAmount);
                // logResourceChange removed - handled by handleResourceAdjust
            } else {
                const partyState = usePartyStore.getState();
                const member = partyState.partyMembers.find(m => m.id === memberId);
                if (member && member.character) {
                    const currentAp = member.character.actionPoints?.current || 0;
                    const tempAp = member.character.tempActionPoints || 0;
                    const drainAmount = currentAp + tempAp;
                    handleResourceAdjust('actionPoints', -drainAmount);
                    // logResourceChange removed - handled by handleResourceAdjust
                }
            }
        } else if (targetType === 'creature') {
            const tokenId = currentTarget.id;
            const token = tokens.find(t => t.id === tokenId);
            if (token) {
                const currentAp = token.state?.currentActionPoints || 0;
                const tempAp = token.state?.tempActionPoints || 0;
                handleResourceAdjust('actionPoints', -(currentAp + tempAp));
                // logResourceChange removed - handled by handleResourceAdjust
            }
        }
        setShowContextMenu(false);
    };

    // Handle position changes from dragging with immediate visual feedback
    const handleDrag = (e, data) => {
        // Update position IMMEDIATELY for responsive visual feedback
        setTargetHUDPosition({ x: data.x, y: data.y });
    };

    // Tooltip handlers
    const handleTooltipShow = (e, content) => {
        setTooltip({
            show: true,
            content,
            position: {
                x: e.clientX + 10,
                y: e.clientY - 10
            }
        });
    };

    const handleTooltipHide = () => {
        setTooltip({ show: false, content: '', position: { x: 0, y: 0 } });
    };

    // Format time for display
    const formatTime = (seconds, durationType = 'minutes') => {
        if (seconds <= 0) return durationType === 'rounds' ? '0 rounds' : '0:00';

        if (durationType === 'rounds') {
            const rounds = Math.ceil(seconds / 6); // 6 seconds per round
            return rounds === 1 ? '1 round' : `${rounds} rounds`;
        }

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    // Condition context menu handlers
    const handleConditionRightClick = (e, condition, type) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Allow both GMs and players to interact with condition context menus
        // (Removing the isGMMode check as requested by user)
        
        setConditionContextMenu({
            show: true,
            condition: { ...condition, type },
            position: { x: e.clientX, y: e.clientY }
        });
    };

    const handleRemoveCondition = (condition, type) => {
        if (!condition) return;

        console.log('🎯 TargetHUD: Removing condition:', condition.name || condition.id, 'of type:', type);

        // 1. Remove from appropriate store if it exists there
        if (type === 'buff') {
            const buffStore = useBuffStore.getState();
            buffStore.removeBuff(condition.id);
        } else if (type === 'debuff') {
            const debuffStore = useDebuffStore.getState();
            debuffStore.removeDebuff(condition.id);
        }

        // 2. If it's token-derived (or type was override to 'condition'), also handle token state directly
        if (condition.__isTokenDerived || type === 'condition') {
            let targetToken = null;
            let isCharacterToken = false;

            if (targetType === 'creature') {
                targetToken = tokens.find(t => t.id === currentTarget.id);
            } else if (targetType === 'party_member' || targetType === 'player') {
                const { characterTokens } = useCharacterTokenStore.getState();
                
                if (currentTarget.id === 'current-player') {
                    targetToken = characterTokens.find(t => t.isPlayerToken);
                    isCharacterToken = true;
                } else {
                    targetToken = characterTokens.find(t => 
                        t.playerId === currentTarget.id || 
                        t.id === currentTarget.id ||
                        t.playerId === currentTarget.userId
                    );
                    isCharacterToken = true;
                }
            }

            if (targetToken?.state?.conditions) {
                const updatedConditions = targetToken.state.conditions.filter(c =>
                    !(c.id === condition.id || c.name === condition.name)
                );

                if (isCharacterToken) {
                    const { updateCharacterTokenState } = useCharacterTokenStore.getState();
                    updateCharacterTokenState(targetToken.id, { conditions: updatedConditions });
                } else {
                    updateTokenState(targetToken.id, { conditions: updatedConditions });
                }
            }
        }

        setConditionContextMenu({ show: false, condition: null, position: { x: 0, y: 0 } });
    };

    const handleAdjustConditionTime = () => {
        if (!conditionContextMenu.condition) return;

        const condition = conditionContextMenu.condition;
        const type = condition.type;
        const currentDuration = type === 'buff' ?
            getRemainingTime(condition.id) :
            getDebuffRemainingTime(condition.id);

        // Calculate current values for the modal
        const isRoundBased = condition.durationType === 'rounds';
        let initialDurationType, initialDurationValue;

        if (isRoundBased) {
            initialDurationType = 'rounds';
            initialDurationValue = Math.ceil(currentDuration / 6); // Convert seconds to rounds
        } else {
            // For time-based durations, determine the best unit
            if (currentDuration >= 3600) {
                initialDurationType = 'hours';
                initialDurationValue = Math.ceil(currentDuration / 3600);
            } else if (currentDuration >= 60) {
                initialDurationType = 'minutes';
                initialDurationValue = Math.ceil(currentDuration / 60);
            } else {
                initialDurationType = 'minutes';
                initialDurationValue = Math.max(1, Math.ceil(currentDuration / 60));
            }
        }

        // Store the condition data with initial values for the modal
        setDurationModalCondition({
            ...conditionContextMenu.condition,
            initialDurationType,
            initialDurationValue
        });
        setShowDurationModal(true);
        setConditionContextMenu({ show: false, condition: null, position: { x: 0, y: 0 } });
    };

    const handleDurationModalApply = (durationData) => {
        if (!durationModalCondition) return;

        const condition = durationModalCondition.condition || durationModalCondition;
        const type = condition.type;

        // Convert the duration data to the format expected by the stores
        let duration, durationType;

        if (durationData.durationType === 'rounds') {
            duration = durationData.durationValue;
            durationType = 'rounds';
        } else {
            // Convert from milliseconds to seconds for the store
            duration = Math.ceil(durationData.duration / 1000);
            durationType = durationData.durationType;
        }

        if (type === 'buff') {
            const buffStore = useBuffStore.getState();
            buffStore.updateBuffDuration(condition.id, duration, durationType);
        } else if (type === 'debuff') {
            const debuffStore = useDebuffStore.getState();
            debuffStore.updateDebuffDuration(condition.id, duration, durationType);
        } else {
            // For plain conditions, update the token's condition directly
            let targetToken = null;
            let isCharacterToken = false;

            if (targetType === 'creature') {
                targetToken = tokens.find(t => t.id === currentTarget.id);
            } else if (targetType === 'party_member' || targetType === 'player') {
                const { characterTokens } = useCharacterTokenStore.getState();
                
                if (currentTarget.id === 'current-player') {
                    targetToken = characterTokens.find(t => t.isPlayerToken);
                    isCharacterToken = true;
                } else {
                    targetToken = characterTokens.find(t => 
                        t.playerId === currentTarget.id || 
                        t.id === currentTarget.id ||
                        t.playerId === currentTarget.userId
                    );
                    isCharacterToken = true;
                }
            }

            if (targetToken?.state?.conditions) {
                const updatedConditions = targetToken.state.conditions.map(c => {
                    if (c.id === condition.id || c.name === condition.name) {
                        return {
                            ...c,
                            duration: durationData.durationType === 'rounds' ? durationData.durationValue * 6000 : durationData.duration,
                            durationValue: duration,
                            durationType: durationType,
                            remainingRounds: durationType === 'rounds' ? duration : undefined,
                            appliedAt: Date.now()
                        };
                    }
                    return c;
                });

                if (isCharacterToken) {
                    const { updateCharacterTokenState } = useCharacterTokenStore.getState();
                    updateCharacterTokenState(targetToken.id, { conditions: updatedConditions });
                } else {
                    updateTokenState(targetToken.id, { conditions: updatedConditions });
                }
            }
        }

        // Also update token state if it's token-derived to ensure persistence
        if (condition.__isTokenDerived) {
             let targetToken = null;
             let isCharacterToken = false;
 
             if (targetType === 'creature') {
                 targetToken = tokens.find(t => t.id === currentTarget.id);
             } else if (targetType === 'party_member' || targetType === 'player') {
                 const { characterTokens } = useCharacterTokenStore.getState();
                 
                 if (currentTarget.id === 'current-player') {
                     targetToken = characterTokens.find(t => t.isPlayerToken);
                     isCharacterToken = true;
                 } else {
                     targetToken = characterTokens.find(t => 
                         t.playerId === currentTarget.id || 
                         t.id === currentTarget.id ||
                         t.playerId === currentTarget.userId
                     );
                     isCharacterToken = true;
                 }
             }
 
             if (targetToken?.state?.conditions) {
                 const updatedConditions = targetToken.state.conditions.map(c => {
                     if (c.id === condition.id || c.name === condition.name) {
                         return {
                             ...c,
                             durationValue: duration,
                             durationType: durationType,
                             remainingRounds: durationType === 'rounds' ? duration : undefined,
                             // If it's time-based, the endpoint will be calculated by the store upon sync,
                             // but we can update the core fields here.
                         };
                     }
                     return c;
                 });
 
                 if (isCharacterToken) {
                    const { updateCharacterTokenState } = useCharacterTokenStore.getState();
                    updateCharacterTokenState(targetToken.id, { conditions: updatedConditions });
                 } else {
                     updateTokenState(targetToken.id, { conditions: updatedConditions });
                 }
             }
        }

        setShowDurationModal(false);
        setDurationModalCondition(null);
    };





    // Check if target has a class resource bar to add appropriate styling
    const hasClassResource = targetData?.class && targetData?.classResource;
    const classResourceType = targetData?.class?.toLowerCase().replace(/\s+/g, '-');

    return (
        <>
            <div className="target-hud-frame">
                <Draggable
                    handle=".target-frame"
                    position={targetHUDPosition}
                    onDrag={handleDrag}
                    nodeRef={nodeRef}
                    enableUserSelectHack={true} // Enable user select hack to prevent text selection during drag
                    scale={1} // Fixed scale to prevent transform calculations
                    disabled={false} // Ensure dragging is always enabled
                >
                    <div ref={nodeRef} className="target-frame" style={{ position: 'relative' }}>
                        <div
                            className={`party-member-frame target-frame-style ${hasClassResource ? 'has-class-resource' : ''} ${hasClassResource ? `class-${classResourceType}` : ''}`}
                            onContextMenu={handleRightClick}
                        >
                            {/* Portrait */}
                            <div className="party-portrait">
                                <div className="portrait-image">
                                    {getTargetImage() ? (
                                        <div
                                            className="target-token-image"
                                            style={{
                                                width: '100%',
                                                height: '100%',
                                                borderRadius: '8px',
                                                backgroundImage: `url(${getTargetImage()})`,
                                                backgroundSize: getImageTransformations()
                                                    ? `${(getImageTransformations().scale || 1) * 120}%`
                                                    : 'cover',
                                                backgroundPosition: getImageTransformations()
                                                    ? `${50 + (getImageTransformations().positionX || 0) / 2}% ${50 - (getImageTransformations().positionY || 0) / 2}%`
                                                    : 'center center',
                                                backgroundRepeat: 'no-repeat',
                                                transform: getImageTransformations()
                                                    ? `rotate(${getImageTransformations().rotation || 0}deg)`
                                                    : 'none'
                                            }}
                                        />
                                    ) : (
                                        <i className="fas fa-crosshairs"></i>
                                    )}
                                </div>
                            </div>

                            {/* Info Section */}
                            <div className="party-member-info">
                                <div className="member-header">
                                    <div className="member-name">{targetData.name}</div>
                                    <div className="member-details">
                                        {targetData.isCreature ? (
                                            <div className="member-race-class">
                                                {targetData.race}
                                            </div>
                                        ) : (
                                            <>
                                                {/* Line 1: Race */}
                                                <div className="member-race">
                                                    {targetData.race || 'Unknown Race'}
                                                </div>
                                                {/* Line 2: Background Class (Discipline) */}
                                                {(() => {
                                                    const classParts = [];
                                                    if (targetData.background) {
                                                        classParts.push(targetData.background);
                                                    }
                                                    if (targetData.class) {
                                                        classParts.push(targetData.class);
                                                    }
                                                    if (targetData.path) {
                                                        classParts.push(`(${targetData.path})`);
                                                    }
                                                    const classLine = classParts.join(' ');
                                                    return classLine ? (
                                                        <div className="member-class-background">
                                                            {classLine}
                                                        </div>
                                                    ) : null;
                                                })()}
                                            </>
                                        )}
                                        {/* Line 3: Alignment */}
                                        <div className="member-alignment">
                                            <span className="alignment">{targetData.alignment}</span>
                                            {targetData.exhaustionLevel > 0 && (
                                                <span className="exhaustion">Exhausted {targetData.exhaustionLevel}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Resource Bars */}
                                <div className="resource-bars-container">
                                    {/* Health Bar */}
                                    <div
                                        className="resource-bar health-bar"
                                    >
                                        <div
                                            className="resource-fill"
                                            style={{
                                                width: `${healthPercent}%`,
                                                backgroundColor: getHealthColor(healthPercent)
                                            }}
                                        />
                                        {targetData.tempHealth > 0 && safeHealth.max > 0 && (
                                            <div
                                                className="temp-resource-fill health-temp"
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: `${healthPercent}%`,
                                                    height: '100%',
                                                    width: `${Math.min(100 - healthPercent, (targetData.tempHealth / safeHealth.max) * 100)}%`,
                                                    backgroundColor: 'rgba(255, 255, 255, 0.4)',
                                                    transition: 'width 0.3s ease, left 0.3s ease',
                                                    zIndex: 1,
                                                    pointerEvents: 'none'
                                                }}
                                            />
                                        )}
                                        <div className="resource-text">
                                            {(() => {
                                                const current = safeHealth.current;
                                                const max = safeHealth.max;
                                                const temp = targetData.tempHealth || 0;
                                                return temp > 0
                                                    ? `${current}/${max} +${temp} Temporary HP`
                                                    : `${current}/${max}`;
                                            })()}
                                        </div>
                                    </div>

                                    {/* Mana Bar */}
                                    {safeMana.max > 0 && (
                                        <div className="resource-bar mana-bar">
                                            <div
                                                className="resource-fill"
                                                style={{
                                                    width: `${manaPercent}%`,
                                                    backgroundColor: '#2196F3'
                                                }}
                                            />
                                            {targetData.tempMana > 0 && safeMana.max > 0 && (
                                                <div
                                                    className="temp-resource-fill mana-temp"
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: `${manaPercent}%`,
                                                        height: '100%',
                                                        width: `${Math.min(100 - manaPercent, (targetData.tempMana / safeMana.max) * 100)}%`,
                                                        backgroundColor: 'rgba(255, 255, 255, 0.4)',
                                                        transition: 'width 0.3s ease, left 0.3s ease',
                                                        zIndex: 1,
                                                        pointerEvents: 'none'
                                                    }}
                                                />
                                            )}
                                            <div className="resource-text">
                                                {(() => {
                                                    const current = safeMana.current;
                                                    const max = safeMana.max;
                                                    const temp = targetData.tempMana || 0;
                                                    return temp > 0
                                                        ? `${current}/${max} +${temp} Temporary Mana`
                                                        : `${current}/${max}`;
                                                })()}
                                            </div>
                                        </div>
                                    )}

                                    {/* Action Points Bar */}
                                    {safeActionPoints.max > 0 && (
                                        <div className="resource-bar ap-bar">
                                            <div
                                                className="resource-fill"
                                                style={{
                                                    width: `${apPercent}%`,
                                                    backgroundColor: '#FF9800'
                                                }}
                                            />
                                            {targetData.tempActionPoints > 0 && safeActionPoints.max > 0 && (
                                                <div
                                                    className="temp-resource-fill ap-temp"
                                                    style={{
                                                        position: 'absolute',
                                                        top: 0,
                                                        left: `${apPercent}%`,
                                                        height: '100%',
                                                        width: `${Math.min(100 - apPercent, (targetData.tempActionPoints / safeActionPoints.max) * 100)}%`,
                                                        backgroundColor: 'rgba(255, 255, 255, 0.4)',
                                                        transition: 'width 0.3s ease, left 0.3s ease',
                                                        zIndex: 1,
                                                        pointerEvents: 'none'
                                                    }}
                                                />
                                            )}
                                            <div className="resource-text">
                                                {(() => {
                                                    const current = safeActionPoints.current;
                                                    const max = safeActionPoints.max;
                                                    const temp = targetData.tempActionPoints || 0;
                                                    return temp > 0
                                                        ? `${current}/${max} AP +${temp} Temporary AP`
                                                        : `${current}/${max} AP`;
                                                })()}
                                            </div>
                                        </div>
                                    )}

                                    {/* Class Resource Bar - Only show if character has a class and class resource */}
                                    {targetData?.class && targetData?.classResource && (
                                        <ClassResourceBar
                                            characterClass={targetData.class}
                                            classResource={targetData.classResource}
                                            isGMMode={isGMMode}
                                            isOwner={false}
                                            onClassResourceUpdate={null}
                                            size="small"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Status Indicators */}
                            <div className="member-status-indicators">
                                <div className="status-dot online"></div>
                            </div>
                        </div>

                        {/* Target Conditions - positioned beneath the HUD */}
                        {(() => {
                            // Get target token conditions
                            let targetConditions = [];
                            if (targetType === 'creature') {
                                const targetToken = tokens.find(t => t.id === currentTarget.id);
                                targetConditions = targetToken?.state?.conditions || [];
                            } else if (targetType === 'party_member' || targetType === 'player') {
                                if (currentTarget.id === 'current-player') {
                                    const playerToken = characterTokens.find(t => t.isPlayerToken);
                                    targetConditions = playerToken?.state?.conditions || [];
                                } else {
                                    // For other party members, try to find their character token
                                    const memberToken = characterTokens.find(t => t.playerId === currentTarget.id);
                                    targetConditions = memberToken?.state?.conditions || [];
                                }
                            }

                            // Format time helper for conditions
                            const formatConditionTime = (condition) => {
                                if (!condition.duration && !condition.durationType) return '∞';
                                if (condition.durationType === 'rounds') {
                                    const rounds = condition.remainingRounds ?? condition.durationValue ?? 0;
                                    return `${rounds}r`;
                                }
                                if (condition.appliedAt && condition.duration) {
                                    const remaining = Math.max(0, Math.floor((condition.appliedAt + condition.duration - Date.now()) / 1000));
                                    const mins = Math.floor(remaining / 60);
                                    const secs = remaining % 60;
                                    return mins > 0 ? `${mins}:${secs.toString().padStart(2, '0')}` : `${secs}s`;
                                }
                                return '∞';
                            };

                            return (targetBuffs.length > 0 || targetDebuffs.length > 0 || targetConditions.length > 0) && (
                                <div
                                    className="target-conditions-beneath"
                                    style={{
                                        position: 'absolute',
                                        top: '100%',
                                        left: '0',
                                        width: '100%',
                                        marginTop: '4px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '4px',
                                        pointerEvents: 'none'
                                    }}
                                >
                                    {/* Buffs Row */}
                                    {targetBuffs.length > 0 && (
                                        <div className="target-buffs" style={{ display: 'flex', gap: '4px' }}>
                                            {targetBuffs.map((buff) => {
                                                const remainingTime = buff.__isTokenDerived ? getFallbackConditionRemainingSeconds(buff, currentTime) : getRemainingTime(buff.id);
                                                const tooltipContent = {
                                                    title: buff.name,
                                                    effectSummary: buff.effectSummary,
                                                    description: buff.description,
                                                    duration: formatTime(remainingTime, buff.durationType)
                                                };
                                                return (
                                                    <div
                                                        key={buff.id}
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            pointerEvents: 'auto'
                                                        }}
                                                    >
                                                        <div
                                                            className="buff-icon"
                                                            style={{
                                                                backgroundColor: buff.color || '#32CD32'
                                                            }}
                                                            onMouseEnter={(e) => handleTooltipShow(e, tooltipContent)}
                                                            onMouseLeave={handleTooltipHide}
                                                            onContextMenu={(e) => handleConditionRightClick(e, buff, 'buff')}
                                                        >
                                                            {buff.icon && buff.icon.startsWith('/assets/') ? (
                                                                <img
                                                                    src={buff.icon}
                                                                    alt={buff.name}
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                    }}
                                                                />
                                                            ) : (
                                                                <i className={buff.icon || 'fas fa-plus'}></i>
                                                            )}
                                                        </div>
                                                        <div style={{
                                                            fontSize: '10px',
                                                            color: '#ffffff !important',
                                                            fontWeight: 'bold',
                                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.9)',
                                                            marginTop: '2px',
                                                            fontFamily: 'Cinzel, serif'
                                                        }}>
                                                            {formatTime(remainingTime, buff.durationType)}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Debuffs Row */}
                                    {targetDebuffs.length > 0 && (
                                        <div className="target-debuffs" style={{ display: 'flex', gap: '4px' }}>
                                            {targetDebuffs.map((debuff) => {
                                                const remainingTime = debuff.__isTokenDerived ? getFallbackConditionRemainingSeconds(debuff, currentTime) : getDebuffRemainingTime(debuff.id);
                                                const tooltipContent = {
                                                    title: debuff.name,
                                                    effectSummary: debuff.effectSummary,
                                                    description: debuff.description,
                                                    duration: formatTime(remainingTime, debuff.durationType)
                                                };
                                                return (
                                                    <div
                                                        key={debuff.id}
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            pointerEvents: 'auto'
                                                        }}
                                                    >
                                                        <div
                                                            className="debuff-icon"
                                                            style={{
                                                                backgroundColor: debuff.color || '#DC143C'
                                                            }}
                                                            onMouseEnter={(e) => handleTooltipShow(e, tooltipContent)}
                                                            onMouseLeave={handleTooltipHide}
                                                            onContextMenu={(e) => handleConditionRightClick(e, debuff, 'debuff')}
                                                        >
                                                            {debuff.icon && debuff.icon.startsWith('/assets/') ? (
                                                                <img
                                                                    src={debuff.icon}
                                                                    alt={debuff.name}
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                    }}
                                                                />
                                                            ) : (
                                                                <i className={debuff.icon || 'fas fa-minus'}></i>
                                                            )}
                                                        </div>
                                                        <div style={{
                                                            fontSize: '10px',
                                                            color: '#ffffff !important',
                                                            fontWeight: 'bold',
                                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.9)',
                                                            marginTop: '2px',
                                                            fontFamily: 'Cinzel, serif'
                                                        }}>
                                                            {formatTime(remainingTime, debuff.durationType)}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}

                                    {/* Conditions Row merged into buffs/debuffs row above */}
                                </div>
                            );
                        })()}
                    </div>
                </Draggable>
            </div>

            {/* Context Menu - Outside draggable container */}
            {showContextMenu && (() => {
                const menuItems = [];

                // Inspect - Only show for creatures if GM, otherwise show for players/party members
                const showInspect = targetType !== 'creature' || isGMMode;

                if (showInspect) {
                    menuItems.push({
                        icon: <i className="fas fa-search"></i>,
                        label: 'Inspect',
                        onClick: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setShowContextMenu(false);
                            handleInspectTarget();
                        }
                    });
                }

                // Clear Target
                menuItems.push({
                    icon: <i className="fas fa-times"></i>,
                    label: 'Clear Target',
                    onClick: (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowContextMenu(false);
                        handleClearTarget();
                    }
                });

                // Resource adjustment options - show if GM mode for all target types
                if (isGMMode) {
                    menuItems.push({ type: 'separator' });

                    // Full Restore All
                    menuItems.push({
                        icon: <i className="fas fa-redo"></i>,
                        label: 'Full Restore All',
                        onClick: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleFullRestoreAll();
                        },
                        className: 'heal'
                    });

                    // Full Drain All
                    menuItems.push({
                        icon: <i className="fas fa-battery-empty"></i>,
                        label: 'Full Drain All',
                        onClick: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleFullDrainAll();
                        },
                        className: 'danger'
                    });

                    menuItems.push({ type: 'separator' });

                    // Health submenu
                    menuItems.push({
                        icon: <i className="fas fa-heart"></i>,
                        label: 'Health',
                        submenu: [
                            {
                                icon: <i className="fas fa-minus-circle"></i>,
                                label: 'Damage (5)',
                                onClick: (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleResourceAdjust('health', -5);
                                    setShowContextMenu(false);
                                }
                            },
                            {
                                icon: <i className="fas fa-minus-circle"></i>,
                                label: 'Damage (10)',
                                onClick: (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleResourceAdjust('health', -10);
                                    setShowContextMenu(false);
                                }
                            },
                            { type: 'separator' },
                            {
                                icon: <i className="fas fa-plus-circle"></i>,
                                label: 'Heal (5)',
                                onClick: (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleResourceAdjust('health', 5);
                                    setShowContextMenu(false);
                                }
                            },
                            {
                                icon: <i className="fas fa-plus-circle"></i>,
                                label: 'Heal (10)',
                                onClick: (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleResourceAdjust('health', 10);
                                    setShowContextMenu(false);
                                }
                            },
                            { type: 'separator' },
                            {
                                icon: <i className="fas fa-heart"></i>,
                                label: 'Full Heal',
                                onClick: (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleFullHeal();
                                },
                                className: 'heal'
                            },
                            {
                                icon: <i className="fas fa-skull"></i>,
                                label: 'Kill',
                                onClick: (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleKill();
                                },
                                className: 'danger'
                            }
                        ]
                    });

                    // Mana submenu
                    menuItems.push({
                        icon: <i className="fas fa-magic"></i>,
                        label: 'Mana',
                        submenu: [
                            {
                                icon: <i className="fas fa-minus-circle"></i>,
                                label: 'Drain (5)',
                                onClick: (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleResourceAdjust('mana', -5);
                                    setShowContextMenu(false);
                                }
                            },
                            {
                                icon: <i className="fas fa-minus-circle"></i>,
                                label: 'Drain (10)',
                                onClick: (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleResourceAdjust('mana', -10);
                                    setShowContextMenu(false);
                                }
                            },
                            { type: 'separator' },
                            {
                                icon: <i className="fas fa-plus-circle"></i>,
                                label: 'Restore (5)',
                                onClick: (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleResourceAdjust('mana', 5);
                                    setShowContextMenu(false);
                                }
                            },
                            {
                                icon: <i className="fas fa-plus-circle"></i>,
                                label: 'Restore (10)',
                                onClick: (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleResourceAdjust('mana', 10);
                                    setShowContextMenu(false);
                                }
                            },
                            { type: 'separator' },
                            {
                                icon: <i className="fas fa-magic"></i>,
                                label: 'Full Restore',
                                onClick: (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleFullRestoreMana();
                                },
                                className: 'heal'
                            },
                            {
                                icon: <i className="fas fa-battery-empty"></i>,
                                label: 'Drain All',
                                onClick: (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDrainMana();
                                },
                                className: 'danger'
                            }
                        ]
                    });

                    // Action Points submenu
                    menuItems.push({
                        icon: <i className="fas fa-bolt"></i>,
                        label: 'Action Points',
                        submenu: [
                            {
                                icon: <i className="fas fa-minus-circle"></i>,
                                label: 'Spend (1)',
                                onClick: (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleResourceAdjust('actionPoints', -1);
                                    setShowContextMenu(false);
                                }
                            },
                            {
                                icon: <i className="fas fa-minus-circle"></i>,
                                label: 'Spend (2)',
                                onClick: (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleResourceAdjust('actionPoints', -2);
                                    setShowContextMenu(false);
                                }
                            },
                            {
                                icon: <i className="fas fa-minus-circle"></i>,
                                label: 'Spend (3)',
                                onClick: (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleResourceAdjust('actionPoints', -3);
                                    setShowContextMenu(false);
                                }
                            },
                            { type: 'separator' },
                            {
                                icon: <i className="fas fa-plus-circle"></i>,
                                label: 'Restore (1)',
                                onClick: (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleResourceAdjust('actionPoints', 1);
                                    setShowContextMenu(false);
                                }
                            },
                            {
                                icon: <i className="fas fa-plus-circle"></i>,
                                label: 'Restore (2)',
                                onClick: (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleResourceAdjust('actionPoints', 2);
                                    setShowContextMenu(false);
                                }
                            },
                            {
                                icon: <i className="fas fa-plus-circle"></i>,
                                label: 'Restore (3)',
                                onClick: (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleResourceAdjust('actionPoints', 3);
                                    setShowContextMenu(false);
                                }
                            },
                            { type: 'separator' },
                            {
                                icon: <i className="fas fa-bolt"></i>,
                                label: 'Full Restore',
                                onClick: (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!currentTarget || !targetData) return;

                                    if (targetType === 'party_member' || targetType === 'player') {
                                        const memberId = currentTarget.id;

                                        if (memberId === 'current-player') {
                                            const characterState = useCharacterStore.getState();
                                            const maxAp = characterState.actionPoints?.max || 0;
                                            const currentAp = characterState.actionPoints?.current || 0;
                                            handleResourceAdjust('actionPoints', maxAp - currentAp);
                                        } else {
                                            const partyState = usePartyStore.getState();
                                            const member = partyState.partyMembers.find(m => m.id === memberId);
                                            if (member && member.character) {
                                                const maxAp = member.character.actionPoints?.max || 0;
                                                const currentAp = member.character.actionPoints?.current || 0;
                                                handleResourceAdjust('actionPoints', maxAp - currentAp);
                                            }
                                        }
                                    } else if (targetType === 'creature') {
                                        const tokenId = currentTarget.id;
                                        const token = tokens.find(t => t.id === tokenId);
                                        if (token) {
                                            // Use modified stats from targetData (includes buff/debuff effects)
                                            const modifiedStats = targetData?.modifiedStats || currentTarget.stats || {};
                                            const maxAp = modifiedStats.maxActionPoints || 0;
                                            const currentAp = token.state?.currentActionPoints || 0;
                                            handleResourceAdjust('actionPoints', maxAp - currentAp);
                                        }
                                    }
                                    setShowContextMenu(false);
                                },
                                className: 'heal'
                            },
                            {
                                icon: <i className="fas fa-battery-empty"></i>,
                                label: 'Drain All',
                                onClick: (e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDrainAP();
                                },
                                className: 'danger'
                            }
                        ]
                    });
                }

                return (
                    <div
                        ref={contextMenuRef}
                        className="context-menu-container"
                        style={{
                            position: 'fixed',
                            left: contextMenuPosition.x,
                            top: contextMenuPosition.y,
                            zIndex: 10000,
                            backgroundColor: '#f0e6d2',
                            border: '2px solid #a08c70',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                            fontFamily: "'Bookman Old Style', 'Garamond', serif",
                            color: '#7a3b2e',
                            padding: '8px',
                            display: 'flex',
                            gap: '0',
                            minWidth: hoveredMenuItem !== null && menuItems[hoveredMenuItem]?.submenu ? '280px' : '160px'
                        }}
                        onMouseLeave={() => {
                            // Close menu when mouse leaves entire container
                            setHoveredMenuItem(null);
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Main menu items */}
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            {menuItems.map((item, index) => (
                                <React.Fragment key={index}>
                                    {item.type === 'separator' ? (
                                        <hr style={{
                                            border: 'none',
                                            borderTop: '1px solid #a08c70',
                                            margin: '4px 0',
                                            width: '100%'
                                        }} />
                                    ) : (
                                        <button
                                            className="context-menu-button"
                                            style={{
                                                pointerEvents: 'auto',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '6px 12px',
                                                border: '1px solid #a08c70',
                                                borderRadius: '4px',
                                                backgroundColor: hoveredMenuItem === index ? '#e8dcc0' : (item.className === 'danger' ? '#ffebee' : item.className === 'heal' ? '#e8f5e9' : '#d4c4a8'),
                                                color: '#7a3b2e',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                fontFamily: "'Bookman Old Style', 'Garamond', serif",
                                                width: '100%',
                                                textAlign: 'left',
                                                margin: '2px 0',
                                                minWidth: '140px'
                                            }}
                                            onMouseEnter={() => {
                                                setHoveredMenuItem(index);
                                            }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (item.submenu) {
                                                    // Don't close on submenu items, just keep submenu open
                                                    return;
                                                }
                                                if (item.onClick) {
                                                    item.onClick(e);
                                                }
                                                if (!item.submenu) {
                                                    setShowContextMenu(false);
                                                }
                                            }}
                                            disabled={item.disabled}
                                            title={item.title}
                                        >
                                            {item.icon}
                                            <span>{item.label}</span>
                                            {item.submenu && <i className="fas fa-chevron-right" style={{ marginLeft: 'auto', fontSize: '10px' }} />}
                                        </button>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>

                        {/* Submenu - always rendered but only visible when hovering */}
                        {menuItems[hoveredMenuItem]?.submenu && (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    backgroundColor: '#f0e6d2',
                                    border: '1px solid #a08c70',
                                    borderLeft: 'none',
                                    borderRadius: '0 4px 4px 0',
                                    padding: '8px 4px',
                                    minWidth: '130px',
                                    marginLeft: '4px',
                                    opacity: hoveredMenuItem !== null ? 1 : 0,
                                    visibility: hoveredMenuItem !== null ? 'visible' : 'hidden',
                                    transition: 'opacity 0.1s ease, visibility 0.1s ease'
                                }}
                            >
                                {menuItems[hoveredMenuItem].submenu.map((subItem, subIndex) => (
                                    <React.Fragment key={subIndex}>
                                        {subItem.type === 'separator' ? (
                                            <hr style={{
                                                border: 'none',
                                                borderTop: '1px solid #a08c70',
                                                margin: '2px 0',
                                                width: '100%'
                                            }} />
                                        ) : (
                                            <button
                                                className="context-menu-button"
                                                style={{
                                                    pointerEvents: 'auto',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '6px',
                                                    padding: '4px 8px',
                                                    border: '1px solid #a08c70',
                                                    borderRadius: '3px',
                                                    backgroundColor: subItem.className === 'danger' ? '#ffebee' : subItem.className === 'heal' ? '#e8f5e9' : '#d4c4a8',
                                                    color: '#7a3b2e',
                                                    cursor: 'pointer',
                                                    fontSize: '11px',
                                                    fontFamily: "'Bookman Old Style', 'Garamond', serif",
                                                    width: '100%',
                                                    textAlign: 'left',
                                                    margin: '1px 0'
                                                }}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (subItem.onClick) {
                                                        subItem.onClick(e);
                                                    }
                                                    setShowContextMenu(false);
                                                }}
                                            >
                                                {subItem.icon}
                                                <span>{subItem.label}</span>
                                            </button>
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })()}


            {/* Condition Duration Modal */}
            {showDurationModal && durationModalCondition && (
                <ConditionDurationModal
                    show={showDurationModal}
                    onClose={() => {
                        setShowDurationModal(false);
                        setDurationModalCondition(null);
                    }}
                    onApply={handleDurationModalApply}
                    conditionName={durationModalCondition.name || ''}
                    initialDurationType={durationModalCondition.initialDurationType || 'minutes'}
                    initialDurationValue={durationModalCondition.initialDurationValue || 10}
                />
            )}

            {/* Condition Tooltip */}
            {tooltip.show && (
                <div
                    className="equipment-slot-tooltip"
                    style={{
                        position: 'fixed',
                        left: tooltip.position.x,
                        top: tooltip.position.y,
                        transform: 'translate(-50%, -100%)',
                        zIndex: 10000,
                        pointerEvents: 'none'
                    }}
                >
                    <div className="equipment-slot-name">{tooltip.content.title}</div>
                    {tooltip.content.effectSummary && (
                        <div style={{
                            fontSize: '12px',
                            color: '#ffffff !important',
                            fontWeight: '600',
                            marginTop: '4px',
                            padding: '4px 8px',
                            backgroundColor: 'rgba(122, 59, 46, 0.1)',
                            borderRadius: '4px',
                            borderLeft: '3px solid #7a3b2e'
                        }}>
                            {tooltip.content.effectSummary}
                        </div>
                    )}
                    {tooltip.content.description && (
                        <div className="equipment-slot-description" style={{ marginTop: '6px' }}>
                            {tooltip.content.description}
                        </div>
                    )}
                    <div style={{
                        marginTop: '8px',
                        fontSize: '12px',
                        color: '#ffffff !important',
                        fontWeight: 'bold'
                    }}>
                        Duration: {tooltip.content.duration}
                    </div>
                </div>
            )}

            {/* Condition Context Menu */}
            {conditionContextMenu.show && (
                <>
                    <div
                        className="context-menu-overlay"
                        onClick={() => setConditionContextMenu({ show: false, condition: null, position: { x: 0, y: 0 } })}
                    />
                    <div
                        className={`unified-context-menu small condition-context-menu ${conditionContextMenu.condition?.type === 'buff' ? 'buff-context-menu' : 'debuff-context-menu'}`}
                        style={{
                            left: conditionContextMenu.position.x,
                            top: conditionContextMenu.position.y
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="context-menu-main">
                            <div
                                className="context-menu-item"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleAdjustConditionTime();
                                }}
                            >
                                <i className="fas fa-clock" style={{ marginRight: '8px' }}></i>
                                Adjust Duration
                            </div>
                            <div
                                className="context-menu-item danger"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveCondition(conditionContextMenu.condition, conditionContextMenu.condition?.type);
                                }}
                            >
                                <i className="fas fa-times" style={{ marginRight: '8px' }}></i>
                                Remove Condition
                            </div>
                        </div>
                    </div>
                </>
            )}

            {/* Creature Inspection Window */}
            {showCreatureInspect && targetType === 'creature' && inspectCreatureData && (
                <EnhancedCreatureInspectView
                    creature={inspectCreatureData}
                    token={inspectToken}
                    isOpen={showCreatureInspect}
                    onClose={() => {
                        setShowCreatureInspect(false);
                        setInspectCreatureData(null);
                        setInspectToken(null);
                    }}
                />
            )}
            {/* Overheal Confirmation Modal */}
            {showOverhealModal && overhealData && createPortal(
                <div
                    className="modal-overlay"
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 10001
                    }}
                    onClick={() => {
                        setShowOverhealModal(false);
                        setOverhealData(null);
                    }}
                >
                    <div
                        className="overheal-modal"
                        style={{
                            backgroundColor: '#f0e6d2',
                            border: '2px solid #a08c70',
                            borderRadius: '8px',
                            padding: '20px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                            fontFamily: "'Bookman Old Style', 'Garamond', serif",
                            color: '#7a3b2e',
                            minWidth: '350px',
                            maxWidth: '450px',
                            textAlign: 'center'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#8e2424' }}>
                            <i className="fas fa-exclamation-triangle" style={{ marginRight: '10px' }}></i>
                            Overheal Detected
                        </h3>
                        <p style={{ margin: '0 0 20px 0', fontSize: '14px', lineHeight: '1.5' }}>
                            {getTargetName()} is being healed for <strong>{overhealData.adjustment}</strong> points of {overhealData.resourceType}, which exceeds their maximum of <strong>{overhealData.maxValue}</strong>.
                            <br /><br />
                            Excess: <strong>{overhealData.overhealAmount}</strong> points.
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button
                                style={{
                                    padding: '10px',
                                    border: '1px solid #7a3b2e',
                                    borderRadius: '4px',
                                    backgroundColor: '#7a3b2e',
                                    color: 'white',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    fontWeight: 'bold'
                                }}
                                onClick={() => {
                                    applyResourceAdjustment(overhealData.resourceType, overhealData.adjustment, true);
                                    setShowOverhealModal(false);
                                    setOverhealData(null);
                                }}
                            >
                                Add excess as Temporary {overhealData.resourceType.charAt(0).toUpperCase() + overhealData.resourceType.slice(1)}
                            </button>
                            <button
                                style={{
                                    padding: '10px',
                                    border: '1px solid #a08c70',
                                    borderRadius: '4px',
                                    backgroundColor: '#d4c4a8',
                                    color: '#7a3b2e',
                                    cursor: 'pointer',
                                    fontSize: '14px'
                                }}
                                onClick={() => {
                                    applyResourceAdjustment(overhealData.resourceType, overhealData.adjustment, false);
                                    setShowOverhealModal(false);
                                    setOverhealData(null);
                                }}
                            >
                                Cap at Maximum {overhealData.resourceType.charAt(0).toUpperCase() + overhealData.resourceType.slice(1)}
                            </button>
                            <button
                                style={{
                                    padding: '8px',
                                    border: 'none',
                                    backgroundColor: 'transparent',
                                    color: '#7a3b2e',
                                    textDecoration: 'underline',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    marginTop: '5px'
                                }}
                                onClick={() => {
                                    setShowOverhealModal(false);
                                    setOverhealData(null);
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default TargetHUD;
