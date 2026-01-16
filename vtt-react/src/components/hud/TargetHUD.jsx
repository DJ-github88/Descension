import React, { useState, useRef, useEffect, useMemo } from 'react';
import Draggable from 'react-draggable';
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

    const { currentTarget, targetType, clearTarget, targetHUDPosition, setTargetHUDPosition, getTargetHUDPosition } = useTargetingStore();
    const { isGMMode } = useGameStore();
    const { updatePartyMember } = usePartyStore();
    const { updateResource, updateClassResource, activeCharacter, updateTempResource } = useCharacterStore();
    const { updateTokenState, getCreature, creatures } = useCreatureStore();
    const { characterTokens } = useCharacterTokenStore();
    const { addCombatNotification } = useChatStore();

    // Get current player data for comparison
    const currentPlayerData = activeCharacter;
    const { getBuffsForTarget, getRemainingTime, updateBuffTimers } = useBuffStore();
    const { getDebuffsForTarget, getRemainingTime: getDebuffRemainingTime, updateDebuffTimers } = useDebuffStore();

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
                    classResource: characterState.classResource,
                    level: characterState.level || 1,
                    isCreature: false
                };
            } else {
                // Get fresh data from party store for other party members
                const member = partyMembers.find(m => m.id === currentTarget.id);
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
                    level: characterData.level || 1,
                    isCreature: false
                };
            }
        } else if (targetType === 'creature') {
            // For creatures, get current values from token state if available
            const token = tokens.find(t => t.id === currentTarget.id);

            let health, mana, actionPoints;

            // ALWAYS prioritize token state for real-time updates
            if (token && token.state) {
                // Use token state for current values, target stats for max values
                // This ensures real-time updates when HP/mana/AP changes
                health = {
                    current: token.state?.currentHp || 0,
                    max: currentTarget.stats?.maxHp || 35
                };
                mana = {
                    current: token.state.currentMana || 0,
                    max: currentTarget.stats?.maxMana || 0
                };
                actionPoints = {
                    current: token.state.currentActionPoints || 0,
                    max: currentTarget.stats?.maxActionPoints || 2
                };
            } else {
                // Fallback to creature stats if no token found
                // Use the creature's actual stats directly
                health = {
                    current: currentTarget.stats?.currentHp || currentTarget.stats?.maxHp || 35,
                    max: currentTarget.stats?.maxHp || 35
                };

                mana = {
                    current: currentTarget.stats?.currentMana || currentTarget.stats?.maxMana || 0,
                    max: currentTarget.stats?.maxMana || 0
                };

                actionPoints = {
                    current: currentTarget.stats?.currentActionPoints || currentTarget.stats?.maxActionPoints || 2,
                    max: currentTarget.stats?.maxActionPoints || 2
                };
            }

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
                isCreature: true
            };
        }
        return null;
    }, [targetType, currentTarget, partyMembers, characterState, tokens]);

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
            // If targeting current player, check both 'current-player' and 'player' IDs
            if (currentTarget.id === 'current-player') {
                // Try 'player' first (standard buff/debuff targetId), then fallback to 'current-player'
                const playerBuffs = getBuffsForTarget('player');
                const playerDebuffs = getDebuffsForTarget('player');
                if (playerBuffs.length > 0 || playerDebuffs.length > 0) {
                    return 'player';
                }
                return 'current-player';
            }
            return currentTarget.id;
        } else if (targetType === 'creature') {
            // For creatures, we now target by tokenId directly
            return currentTarget.id;
        }
        return null;
    };

    const targetId = getTargetId();
    // Get buffs/debuffs, also check 'player' if targetId is 'current-player'
    let targetBuffs = targetId ? getBuffsForTarget(targetId) : [];
    let targetDebuffs = targetId ? getDebuffsForTarget(targetId) : [];

    // If targeting current player and no buffs found, also check 'player' ID
    if (targetType === 'party_member' || targetType === 'player') {
        if (currentTarget.id === 'current-player' && targetBuffs.length === 0 && targetDebuffs.length === 0) {
            targetBuffs = getBuffsForTarget('player');
            targetDebuffs = getDebuffsForTarget('player');
        }
    }

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

        const tempFieldMap = {
            'health': 'tempHealth',
            'mana': 'tempMana',
            'actionPoints': 'tempActionPoints'
        };
        const tempField = tempFieldMap[resourceType];

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

                if (adjustment < 0) {
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
                    // Positive adjustment (healing/restoring)
                    const newValue = Math.max(0, Math.min(maxValue, currentValue + adjustment));
                    updateResource(resourceType, newValue, maxValue);
                }

                // Show floating combat text for current player at Target HUD position
                if (window.showFloatingCombatText && adjustment !== 0) {
                    let textType;
                    if (resourceType === 'health') {
                        textType = adjustment > 0 ? 'heal' : 'damage';
                    } else if (resourceType === 'mana') {
                        textType = adjustment > 0 ? 'mana' : 'mana-loss';
                    } else if (resourceType === 'actionPoints') {
                        textType = adjustment > 0 ? 'ap' : 'ap-loss';
                    }

                    // Position floating text at the actual Target HUD DOM element location
                    let floatingTextPosition;
                    if (nodeRef.current) {
                        const rect = nodeRef.current.getBoundingClientRect();
                        floatingTextPosition = {
                            x: rect.left + rect.width / 2,
                            y: rect.top - 20 // Position above the HUD for better visibility
                        };
                    } else {
                        // Fallback to center of screen
                        floatingTextPosition = {
                            x: window.innerWidth / 2,
                            y: window.innerHeight / 2
                        };
                    }

                    console.log('🎯 Target HUD: About to call showFloatingCombatText for current player:', {
                        adjustment,
                        textType,
                        position: floatingTextPosition,
                        functionExists: typeof window.showFloatingCombatText
                    });

                    // Add a small delay to ensure DOM is updated
                    setTimeout(() => {
                        window.showFloatingCombatText(
                            Math.abs(adjustment).toString(),
                            textType,
                            floatingTextPosition
                        );
                    }, 50);
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

                    if (adjustment < 0) {
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
                        updatePartyMember(memberId, {
                            character: {
                                ...member.character,
                                [resourceType]: {
                                    ...member.character[resourceType],
                                    current: newValue
                                },
                                [tempField]: newTemp
                            }
                        });

                        // MULTIPLAYER SYNC: Notify the player about the resource update
                        const socket = window.multiplayerSocket;
                        if (socket && socket.connected && adjustment !== 0) {
                            setTimeout(() => {
                                const partyState = usePartyStore.getState();
                                const updatedMember = partyState.partyMembers.find(m => m.id === memberId);
                                console.log('📤 TargetHUD emitting character_resource_updated:', {
                                    memberId,
                                    memberName: updatedMember?.name,
                                    allPartyMemberIds: partyState.partyMembers.map(m => ({ id: m.id, name: m.name })),
                                    resourceType,
                                    adjustment
                                });
                                if (updatedMember && updatedMember.character) {
                                    socket.emit('character_resource_updated', {
                                        playerId: memberId,
                                        playerName: updatedMember.name, // Include name for fallback matching
                                        resource: resourceType,
                                        current: updatedMember.character[resourceType]?.current,
                                        max: updatedMember.character[resourceType]?.max,
                                        temp: updatedMember.character[tempField],
                                        adjustment: adjustment, // Include adjustment for FCT sync
                                        timestamp: Date.now()
                                    });
                                }
                            }, 0);
                        }
                    } else {
                        // Positive adjustment (healing/restoring)
                        const newValue = Math.max(0, Math.min(maxValue, currentValue + adjustment));
                        updatePartyMember(memberId, {
                            character: {
                                ...member.character,
                                [resourceType]: {
                                    ...member.character[resourceType],
                                    current: newValue
                                }
                            }
                        });

                        // MULTIPLAYER SYNC: Notify the player about the resource update
                        const socket = window.multiplayerSocket;
                        if (socket && socket.connected && adjustment !== 0) {
                            setTimeout(() => {
                                const partyState = usePartyStore.getState();
                                const updatedMember = partyState.partyMembers.find(m => m.id === memberId);
                                if (updatedMember && updatedMember.character) {
                                    socket.emit('character_resource_updated', {
                                        playerId: memberId,
                                        playerName: updatedMember.name, // Include name for fallback matching
                                        resource: resourceType,
                                        current: updatedMember.character[resourceType]?.current,
                                        max: updatedMember.character[resourceType]?.max,
                                        temp: updatedMember.character[tempField],
                                        adjustment: adjustment, // Include adjustment for FCT sync
                                        timestamp: Date.now()
                                    });
                                }
                            }, 0);
                        }
                    }

                    // Show floating combat text for party member at Target HUD position
                    if (window.showFloatingCombatText && adjustment !== 0) {
                        let textType;
                        if (resourceType === 'health') {
                            textType = adjustment > 0 ? 'heal' : 'damage';
                        } else if (resourceType === 'mana') {
                            textType = adjustment > 0 ? 'mana' : 'mana-loss';
                        } else if (resourceType === 'actionPoints') {
                            textType = adjustment > 0 ? 'ap' : 'ap-loss';
                        }

                        // Position floating text at the actual Target HUD DOM element location
                        let floatingTextPosition;
                        if (nodeRef.current) {
                            const rect = nodeRef.current.getBoundingClientRect();
                            floatingTextPosition = {
                                x: rect.left + rect.width / 2,
                                y: rect.top - 20 // Position above the HUD for better visibility
                            };
                        } else {
                            // Fallback to stored position
                            const targetHUDPos = getTargetHUDPosition();
                            floatingTextPosition = {
                                x: targetHUDPos.x + 100,
                                y: targetHUDPos.y - 20 // Position above the HUD
                            };
                        }

                        setTimeout(() => {
                            window.showFloatingCombatText(
                                Math.abs(adjustment).toString(),
                                textType,
                                floatingTextPosition
                            );
                        }, 50);
                    }

                    // Log the resource change (unless logging is skipped)
                    if (adjustment !== 0 && !skipLogging) {
                        const characterName = getTargetName();
                        logResourceChange(characterName, resourceType, adjustment, adjustment > 0);
                    }
                }
            }
        } else if (targetType === 'creature') {
            // Update creature token
            const tokenId = currentTarget.id;  // For creatures, currentTarget.id is the token ID
            const token = tokens.find(t => t.id === tokenId);

            if (token) {
                const safeResource = resourceType === 'health' ? safeHealth :
                    resourceType === 'mana' ? safeMana : safeActionPoints;
                const currentValue = safeResource.current;
                const maxValue = safeResource.max;
                const newValue = Math.max(0, Math.min(maxValue, currentValue + adjustment));

                // Map resource types to token state properties
                const stateKey = resourceType === 'health' ? 'currentHp' :
                    resourceType === 'mana' ? 'currentMana' :
                        resourceType === 'actionPoints' ? 'currentActionPoints' : null;

                if (stateKey) {
                    updateTokenState(token.id, {
                        [stateKey]: newValue
                    });

                    // Show floating combat text at token's screen position
                    if (window.showFloatingCombatText && token.position && adjustment !== 0) {
                        // Determine text type based on resource and adjustment direction
                        let textType;
                        if (resourceType === 'health') {
                            textType = adjustment > 0 ? 'heal' : 'damage';
                        } else if (resourceType === 'mana') {
                            textType = adjustment > 0 ? 'mana' : 'mana-loss';
                        } else if (resourceType === 'actionPoints') {
                            textType = adjustment > 0 ? 'ap' : 'ap-loss';
                        }

                        // Get the token's screen position using the grid system
                        const gridSystem = window.gridSystem;
                        if (gridSystem) {
                            try {
                                // Get viewport dimensions for proper coordinate conversion (same as CreatureToken)
                                const viewportWidth = window.innerWidth;
                                const viewportHeight = window.innerHeight;
                                const screenPos = gridSystem.worldToScreen(token.position.x, token.position.y, viewportWidth, viewportHeight);

                                // Add a small delay to ensure DOM is updated
                                setTimeout(() => {
                                    console.log('🎯 Creature floating text:', {
                                        tokenPosition: token.position,
                                        screenPos,
                                        adjustment,
                                        textType
                                    });
                                    window.showFloatingCombatText(
                                        Math.abs(adjustment).toString(),
                                        textType,
                                        { x: screenPos.x, y: screenPos.y }
                                    );
                                }, 50);
                            } catch (error) {
                                console.error('❌ Failed to convert creature token position to screen coordinates:', error);
                                // Fallback: show floating text at a default position
                                setTimeout(() => {
                                    window.showFloatingCombatText(
                                        Math.abs(adjustment).toString(),
                                        textType,
                                        { x: window.innerWidth / 2, y: window.innerHeight / 2 }
                                    );
                                }, 50);
                            }
                        } else {
                            console.error('❌ Grid system not available for creature floating text');
                        }
                    }

                    // Log the resource change (unless logging is skipped)
                    if (adjustment !== 0 && !skipLogging) {
                        const characterName = getTargetName();
                        logResourceChange(characterName, resourceType, adjustment, adjustment > 0);
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
            const safeResource = resourceType === 'health' ? safeHealth :
                resourceType === 'mana' ? safeMana : safeActionPoints;
            if (!safeResource) return { current: 0, max: 0, temp: 0 };
            return {
                current: safeResource.current || 0,
                max: safeResource.max || 0,
                temp: 0 // Creatures don't have temporary resources
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
                const maxHp = currentTarget.stats?.maxHp || 0;
                const currentHp = token.state?.currentHp || 0;
                const maxMp = currentTarget.stats?.maxMana || 0;
                const currentMp = token.state?.currentMana || 0;
                const maxAp = currentTarget.stats?.maxActionPoints || 0;
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
                const currentMp = token.state?.currentMana || 0;
                const currentAp = token.state?.currentActionPoints || 0;
                const healthAmount = currentHp;
                const manaAmount = currentMp;
                const apAmount = currentAp;

                // Drain all resources (creatures don't have temporary resources)
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
                if (healAmount > 0) logResourceChange(characterName, 'health', healAmount, true);
            } else {
                const partyState = usePartyStore.getState();
                const member = partyState.partyMembers.find(m => m.id === memberId);
                if (member && member.character) {
                    const maxHp = member.character.health?.max || 0;
                    const currentHp = member.character.health?.current || 0;
                    const healAmount = maxHp - currentHp;
                    handleResourceAdjust('health', healAmount);
                    if (healAmount > 0) logResourceChange(characterName, 'health', healAmount, true);
                }
            }
        } else if (targetType === 'creature') {
            const tokenId = currentTarget.id;
            const token = tokens.find(t => t.id === tokenId);
            if (token) {
                const maxHp = currentTarget.stats?.maxHp || 0;
                const currentHp = token.state?.currentHp || 0;
                const healAmount = maxHp - currentHp;
                handleResourceAdjust('health', healAmount);
                if (healAmount > 0) logResourceChange(characterName, 'health', healAmount, true);
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
                handleResourceAdjust('health', -currentHp);
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
                if (drainAmount > 0) logResourceChange(characterName, 'mana', -drainAmount, false);
            } else {
                const partyState = usePartyStore.getState();
                const member = partyState.partyMembers.find(m => m.id === memberId);
                if (member && member.character) {
                    const currentMp = member.character.mana?.current || 0;
                    const tempMp = member.character.tempMana || 0;
                    const drainAmount = currentMp + tempMp;
                    handleResourceAdjust('mana', -drainAmount);
                    if (drainAmount > 0) logResourceChange(characterName, 'mana', -drainAmount, false);
                }
            }
        } else if (targetType === 'creature') {
            const tokenId = currentTarget.id;
            const token = tokens.find(t => t.id === tokenId);
            if (token) {
                const currentMp = token.state?.currentMana || 0;
                handleResourceAdjust('mana', -currentMp);
                if (currentMp > 0) logResourceChange(characterName, 'mana', -currentMp, false);
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
                if (restoreAmount > 0) logResourceChange(characterName, 'mana', restoreAmount, true);
            } else {
                const partyState = usePartyStore.getState();
                const member = partyState.partyMembers.find(m => m.id === memberId);
                if (member && member.character) {
                    const maxMp = member.character.mana?.max || 0;
                    const currentMp = member.character.mana?.current || 0;
                    const restoreAmount = maxMp - currentMp;
                    handleResourceAdjust('mana', restoreAmount);
                    if (restoreAmount > 0) logResourceChange(characterName, 'mana', restoreAmount, true);
                }
            }
        } else if (targetType === 'creature') {
            const tokenId = currentTarget.id;
            const token = tokens.find(t => t.id === tokenId);
            if (token) {
                const maxMp = currentTarget.stats?.maxMana || 0;
                const currentMp = token.state?.currentMana || 0;
                const restoreAmount = maxMp - currentMp;
                handleResourceAdjust('mana', restoreAmount);
                if (restoreAmount > 0) logResourceChange(characterName, 'mana', restoreAmount, true);
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
                if (drainAmount > 0) logResourceChange(characterName, 'actionPoints', -drainAmount, false);
            } else {
                const partyState = usePartyStore.getState();
                const member = partyState.partyMembers.find(m => m.id === memberId);
                if (member && member.character) {
                    const currentAp = member.character.actionPoints?.current || 0;
                    const tempAp = member.character.tempActionPoints || 0;
                    const drainAmount = currentAp + tempAp;
                    handleResourceAdjust('actionPoints', -drainAmount);
                    if (drainAmount > 0) logResourceChange(characterName, 'actionPoints', -drainAmount, false);
                }
            }
        } else if (targetType === 'creature') {
            const tokenId = currentTarget.id;
            const token = tokens.find(t => t.id === tokenId);
            if (token) {
                const currentAp = token.state?.currentActionPoints || 0;
                handleResourceAdjust('actionPoints', -currentAp);
                if (currentAp > 0) logResourceChange(characterName, 'actionPoints', -currentAp, false);
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
        setConditionContextMenu({
            show: true,
            condition: { ...condition, type },
            position: { x: e.clientX, y: e.clientY }
        });
    };

    const handleRemoveCondition = () => {
        if (!conditionContextMenu.condition) return;

        const condition = conditionContextMenu.condition;
        const type = condition.type;

        if (type === 'buff') {
            const buffStore = useBuffStore.getState();
            buffStore.removeBuff(condition.id);
        } else if (type === 'debuff') {
            const debuffStore = useDebuffStore.getState();
            debuffStore.removeDebuff(condition.id);
        } else if (type === 'condition') {
            // Handle actual conditions from token.state.conditions
            // Find the target token and remove the condition
            let targetToken = null;
            let isCharacterToken = false;

            if (targetType === 'creature') {
                targetToken = tokens.find(t => t.id === currentTarget.id);
            } else if (targetType === 'party_member' || targetType === 'player') {
                if (currentTarget.id === 'current-player') {
                    targetToken = characterTokens.find(t => t.isPlayerToken);
                    isCharacterToken = true;
                } else {
                    targetToken = characterTokens.find(t => t.playerId === currentTarget.id);
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
        } else {
            const debuffStore = useDebuffStore.getState();
            debuffStore.updateDebuffDuration(condition.id, duration, durationType);
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
                                        <div className="resource-text">
                                            {Number(safeHealth.current) || 0}/{Number(safeHealth.max) || 1}
                                        </div>
                                    </div>

                                    {/* Mana Bar - Always show for consistency */}
                                    <div
                                        className="resource-bar mana-bar"
                                    >
                                        <div
                                            className="resource-fill"
                                            style={{
                                                width: `${manaPercent}%`,
                                                backgroundColor: '#2196F3'
                                            }}
                                        />
                                        <div className="resource-text">
                                            {Number(safeMana.current) || 0}/{Number(safeMana.max) || 0}
                                        </div>
                                    </div>

                                    {/* Action Points Bar - Always show for consistency */}
                                    <div
                                        className="resource-bar ap-bar"
                                    >
                                        <div
                                            className="resource-fill"
                                            style={{
                                                width: `${apPercent}%`,
                                                backgroundColor: '#FF9800'
                                            }}
                                        />
                                        <div className="resource-text">
                                            {Number(safeActionPoints.current) || 0}/{Number(safeActionPoints.max) || 1} AP
                                        </div>
                                    </div>

                                    {/* Class Resource Bar - Only show if character has a class and class resource */}
                                    {targetData?.class && targetData?.classResource && (
                                        <ClassResourceBar
                                            characterClass={targetData.class}
                                            classResource={targetData.classResource}
                                            isGMMode={isGMMode}
                                            onClassResourceUpdate={handleClassResourceUpdate}
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
                                                const remainingTime = getRemainingTime(buff.id);
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
                                                            color: '#f0e6d2',
                                                            fontWeight: 'bold',
                                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
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
                                                const remainingTime = getDebuffRemainingTime(debuff.id);
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
                                                            color: '#f0e6d2',
                                                            fontWeight: 'bold',
                                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
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

                                    {/* Conditions Row */}
                                    {targetConditions.length > 0 && (
                                        <div className="target-conditions" style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                            {targetConditions.map((condition) => {
                                                const conditionData = CONDITIONS[condition.id] || CONDITIONS[condition.name?.toLowerCase()] || {
                                                    name: condition.name || condition.id,
                                                    icon: condition.icon || '/assets/icons/Status/buff/star-emblem-power.png',
                                                    color: condition.color || '#FFD700',
                                                    description: condition.description || ''
                                                };

                                                const tooltipContent = {
                                                    title: conditionData.name,
                                                    description: conditionData.description,
                                                    duration: formatConditionTime(condition)
                                                };

                                                return (
                                                    <div
                                                        key={condition.id || condition.name}
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection: 'column',
                                                            alignItems: 'center',
                                                            pointerEvents: 'auto'
                                                        }}
                                                    >
                                                        <div
                                                            className="condition-icon"
                                                            style={{
                                                                backgroundColor: conditionData.color,
                                                                width: '32px',
                                                                height: '32px',
                                                                borderRadius: '4px',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                border: '2px solid rgba(255, 255, 255, 0.3)',
                                                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                                                            }}
                                                            onMouseEnter={(e) => handleTooltipShow(e, tooltipContent)}
                                                            onMouseLeave={handleTooltipHide}
                                                            onContextMenu={(e) => handleConditionRightClick(e, { ...condition, type: 'condition', targetId: targetType === 'creature' ? currentTarget.id : (currentTarget.id === 'current-player' ? 'current-player' : currentTarget.id) }, 'condition')}
                                                        >
                                                            {conditionData.icon && conditionData.icon.startsWith('/assets/') ? (
                                                                <img
                                                                    src={conditionData.icon}
                                                                    alt={conditionData.name}
                                                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                    }}
                                                                />
                                                            ) : (
                                                                <i className={conditionData.icon || 'fas fa-circle'} style={{ fontSize: '16px', color: '#fff' }}></i>
                                                            )}
                                                        </div>
                                                        <div style={{
                                                            fontSize: '10px',
                                                            color: '#f0e6d2',
                                                            fontWeight: 'bold',
                                                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.8)',
                                                            marginTop: '2px',
                                                            fontFamily: 'Cinzel, serif'
                                                        }}>
                                                            {formatConditionTime(condition)}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            );
                        })()}
                    </div>
                </Draggable>
            </div>

            {/* Context Menu - Outside draggable container */}
            {showContextMenu && (() => {
                const menuItems = [];

                // Inspect
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
                                            const maxAp = currentTarget.stats?.maxActionPoints || 0;
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
                            color: '#7a3b2e',
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
                        color: '#7a3b2e',
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
                                onClick={handleAdjustConditionTime}
                            >
                                <i className="fas fa-clock" style={{ marginRight: '8px' }}></i>
                                Adjust Duration
                            </div>
                            <div
                                className="context-menu-item danger"
                                onClick={handleRemoveCondition}
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
        </>
    );
};

export default TargetHUD;
