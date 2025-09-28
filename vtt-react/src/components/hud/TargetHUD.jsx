import React, { useState, useRef, useEffect, useMemo } from 'react';
import Draggable from 'react-draggable';
import useTargetingStore from '../../store/targetingStore';
import useGameStore from '../../store/gameStore';
import usePartyStore from '../../store/partyStore';
import useCharacterStore from '../../store/characterStore';
import useCreatureStore from '../../store/creatureStore';
import useBuffStore from '../../store/buffStore';
import useDebuffStore from '../../store/debuffStore';
import ResourceAdjustmentModal from './ResourceAdjustmentModal';
import ClassResourceBar from './ClassResourceBar';
import ConditionDurationModal from '../modals/ConditionDurationModal';
import EnhancedCreatureInspectView from '../creature-wizard/components/common/EnhancedCreatureInspectView';
import UnifiedContextMenu from '../level-editor/UnifiedContextMenu';
// REMOVED: import '../../styles/party-hud.css'; // CAUSES CSS POLLUTION - loaded centrally
// REMOVED: import '../../styles/buff-container.css'; // CAUSES CSS POLLUTION - loaded centrally
import './styles/ClassResourceBar.css';

const TargetHUD = ({ position, onOpenCharacterSheet }) => {
    const nodeRef = useRef(null);
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [showResourceModal, setShowResourceModal] = useState(false);
    const [resourceModalData, setResourceModalData] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [tooltip, setTooltip] = useState({ show: false, content: '', position: { x: 0, y: 0 } });
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [conditionContextMenu, setConditionContextMenu] = useState({ show: false, condition: null, position: { x: 0, y: 0 } });
    const [forceUpdate, setForceUpdate] = useState(0);
    const [showDurationModal, setShowDurationModal] = useState(false);
    const [durationModalCondition, setDurationModalCondition] = useState(null);
    const [showCreatureInspect, setShowCreatureInspect] = useState(false);
    const [inspectCreatureData, setInspectCreatureData] = useState(null);
    const [inspectToken, setInspectToken] = useState(null);

    const { currentTarget, targetType, clearTarget, targetHUDPosition, setTargetHUDPosition, getTargetHUDPosition } = useTargetingStore();
    const { isGMMode } = useGameStore();
    const { updatePartyMember } = usePartyStore();
    const { updateResource, activeCharacter } = useCharacterStore();
    const { updateTokenState, getCreature, creatures } = useCreatureStore();

    // Get current player data for comparison
    const currentPlayerData = activeCharacter;
    const { getBuffsForTarget, getRemainingTime } = useBuffStore();
    const { getDebuffsForTarget, getRemainingTime: getDebuffRemainingTime } = useDebuffStore();

    // Force re-render when tokens change for creature targets - use reactive subscription
    const tokens = useCreatureStore(state => state.tokens);

    // Real-time updates for condition timers - reduced frequency for performance
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 2000); // Update every 2 seconds instead of 1 second for better performance

        return () => clearInterval(interval);
    }, []);

    // Watch for store changes using direct store access
    useEffect(() => {
        // Force update when target changes or when we need to refresh
        setForceUpdate(prev => prev + 1);
    }, [currentTarget, refreshKey]);

    // Watch for token changes specifically for creature targets
    useEffect(() => {
        if (targetType === 'creature' && currentTarget?.id) {
            const targetToken = tokens.find(t => t.id === currentTarget.id);
            // Always force refresh when tokens array changes for creature targets
            setForceUpdate(prev => prev + 1);
        }
    }, [tokens, targetType, currentTarget?.id]);

    // Subscribe to store changes for immediate updates
    useEffect(() => {
        const unsubscribers = [];

        // Subscribe to party store changes for party member targets
        if (targetType === 'party_member') {
            const unsubscribeParty = usePartyStore.subscribe(
                (state) => state.partyMembers,
                (partyMembers) => {
                    // Check if our target is in the updated party members
                    const updatedMember = partyMembers.find(m => m.id === currentTarget?.id);
                    if (updatedMember) {
                        setForceUpdate(prev => prev + 1);
                    }
                }
            );
            unsubscribers.push(unsubscribeParty);
        }

        // Subscribe to character store changes for current player target
        if (targetType === 'player' || (targetType === 'party_member' && currentTarget?.id === 'current-player')) {
            const unsubscribeCharacter = useCharacterStore.subscribe(
                (state) => state,
                () => {
                    setForceUpdate(prev => prev + 1);
                }
            );
            unsubscribers.push(unsubscribeCharacter);
        }

        // Subscribe to creature store changes for creature targets
        if (targetType === 'creature') {
            const unsubscribeCreature = useCreatureStore.subscribe(
                (state) => state.tokens,
                (tokens) => {
                    // Check if our target token was updated
                    const targetToken = tokens.find(t => t.id === currentTarget?.id);
                    if (targetToken) {
                        setForceUpdate(prev => prev + 1);
                    }
                }
            );
            unsubscribers.push(unsubscribeCreature);
        }

        return () => {
            unsubscribers.forEach(unsubscribe => unsubscribe());
        };
    }, [targetType, currentTarget?.id]);

    // Close context menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check if the click is inside any context menu
            const isInsideContextMenu = event.target.closest('.party-context-menu') ||
                                      event.target.closest('.buff-context-menu') ||
                                      event.target.closest('.debuff-context-menu') ||
                                      event.target.closest('.unified-context-menu');

            if (!isInsideContextMenu) {
                if (showContextMenu) {
                    setShowContextMenu(false);
                }
                if (conditionContextMenu.show) {
                    setConditionContextMenu({ show: false, condition: null, position: { x: 0, y: 0 } });
                }
            }
        };

        if (showContextMenu || conditionContextMenu.show) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showContextMenu, conditionContextMenu.show]);

    // Get target data based on type - memoized to ensure reactivity
    const targetData = useMemo(() => {
        // This function will re-run when dependencies change
        const _ = forceUpdate; // Keep forceUpdate dependency for timer-based updates
        if (!currentTarget) return null;
        if (targetType === 'party_member' || targetType === 'player') {
            // For party members, get fresh data from stores instead of cached data
            if (currentTarget.id === 'current-player') {
                // Get fresh data from character store for current player
                const characterState = useCharacterStore.getState();
                return {
                    name: characterState.name,
                    class: characterState.class,
                    race: characterState.raceDisplayName || characterState.race,
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
                const partyState = usePartyStore.getState();
                const member = partyState.partyMembers.find(m => m.id === currentTarget.id);
                if (member) {
                    return {
                        name: member.name,
                        class: member.character?.class || 'Unknown',
                        race: member.character?.raceDisplayName || member.character?.race || 'Unknown',
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
            // Get fresh token data from store to ensure we have the latest state
            const freshTokens = useCreatureStore.getState().tokens;
            // Now we target by tokenId, so find the token directly
            const token = freshTokens.find(t => t.id === currentTarget.id);

            let health, mana, actionPoints;

            // ALWAYS prioritize token state for real-time updates
            if (token && token.state) {
                // Use token state for current values, target stats for max values
                // This ensures real-time updates when HP/mana/AP changes
                health = {
                    current: token.state.currentHp || 0,
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
    }, [targetType, currentTarget, tokens, forceUpdate, refreshKey]);

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
                // Default character icon
                return 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_head_human_01.jpg';
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
                }
                // Default character icon
                return 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_head_human_01.jpg';
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
                    return `https://wow.zamimg.com/images/wow/icons/large/${creature.tokenIcon}.jpg`;
                }
            }
            // Fallback to default creature icon
            return 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_head_orc_01.jpg';
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
            return currentTarget.id;
        } else if (targetType === 'creature') {
            // For creatures, we now target by tokenId directly
            return currentTarget.id;
        }
        return null;
    };

    const targetId = getTargetId();
    const targetBuffs = targetId ? getBuffsForTarget(targetId) : [];
    const targetDebuffs = targetId ? getDebuffsForTarget(targetId) : [];

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

    const handleResourceBarClick = (e, resourceType) => {
        if (!isGMMode) return;

        e.preventDefault();
        e.stopPropagation();

        const rect = e.currentTarget.getBoundingClientRect();
        const position = {
            x: rect.right + 10,
            y: rect.top
        };

        let currentValue, maxValue;
        switch (resourceType) {
            case 'health':
                currentValue = safeHealth.current;
                maxValue = safeHealth.max;
                break;
            case 'mana':
                currentValue = safeMana.current;
                maxValue = safeMana.max;
                break;
            case 'actionPoints':
                currentValue = safeActionPoints.current;
                maxValue = safeActionPoints.max;
                break;
            default:
                return;
        }

        setResourceModalData({
            resourceType,
            currentValue,
            maxValue,
            position
        });
        setShowResourceModal(true);
    };

    const handleResourceAdjustment = (adjustment) => {
        if (!resourceModalData) return;

        const { resourceType } = resourceModalData;

        if (targetType === 'party_member' || targetType === 'player') {
            // Update party member or player - get fresh data from stores
            const memberId = currentTarget.id;

            if (memberId === 'current-player') {
                // Update character store directly for current player
                const characterState = useCharacterStore.getState();
                const currentResource = characterState[resourceType];
                const currentValue = currentResource.current;
                const maxValue = currentResource.max;
                const newValue = Math.max(0, Math.min(maxValue, currentValue + adjustment));

                updateResource(resourceType, newValue); // Don't pass maxValue unless we want to change it

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
            } else {
                // Update party member through party store
                const partyState = usePartyStore.getState();
                const member = partyState.partyMembers.find(m => m.id === memberId);

                if (member) {
                    const currentResource = member.character[resourceType];
                    const currentValue = currentResource.current;
                    const maxValue = currentResource.max;
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

                    // Force immediate UI update
                    setTimeout(() => {
                        setForceUpdate(prev => prev + 1);
                        setRefreshKey(prev => prev + 1);
                    }, 0);

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
                }
            } else {
                console.error('❌ Token not found for creature:', tokenId);
            }
        }

        setShowResourceModal(false);
        setResourceModalData(null);

        // Force refresh of target data
        setRefreshKey(prev => prev + 1);
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
        } else {
            const debuffStore = useDebuffStore.getState();
            debuffStore.removeDebuff(condition.id);
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
                    enableUserSelectHack={false} // Disable user select hack for better performance
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
                                        <div className="member-race-class">
                                            {targetData.isCreature
                                                ? targetData.race
                                                : `${targetData.race} ${targetData.class}`
                                            }
                                        </div>
                                        <div className="member-alignment-exhaustion">
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
                                        className={`resource-bar health-bar ${isGMMode ? 'clickable' : ''}`}
                                        onClick={(e) => handleResourceBarClick(e, 'health')}
                                        style={{ cursor: isGMMode ? 'pointer' : 'default' }}
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
                                        className={`resource-bar mana-bar ${isGMMode ? 'clickable' : ''}`}
                                        onClick={(e) => handleResourceBarClick(e, 'mana')}
                                        style={{ cursor: isGMMode ? 'pointer' : 'default' }}
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
                                        className={`resource-bar ap-bar ${isGMMode ? 'clickable' : ''}`}
                                        onClick={(e) => handleResourceBarClick(e, 'actionPoints')}
                                        style={{ cursor: isGMMode ? 'pointer' : 'default' }}
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
                                            onResourceClick={(resourceType) => handleResourceBarClick(null, resourceType)}
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
                        {(targetBuffs.length > 0 || targetDebuffs.length > 0) && (
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
                                                        <i className={buff.icon || 'fas fa-plus'}></i>
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
                                                        <i className={debuff.icon || 'fas fa-minus'}></i>
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
                            </div>
                        )}
                    </div>
                </Draggable>
            </div>

            {/* Context Menu - Outside draggable container */}
            {showContextMenu && (
                <UnifiedContextMenu
                    visible={true}
                    x={contextMenuPosition.x}
                    y={contextMenuPosition.y}
                    onClose={() => setShowContextMenu(false)}
                    disableClickOutside={true}
                    items={[
                        {
                            icon: <i className="fas fa-search"></i>,
                            label: 'Inspect',
                            onClick: (e) => {
                                console.log('🎯 TargetHUD: Inspect clicked');
                                e.preventDefault();
                                e.stopPropagation();
                                setShowContextMenu(false); // Close menu immediately
                                handleInspectTarget();
                            }
                        },
                        {
                            icon: <i className="fas fa-times"></i>,
                            label: 'Clear Target',
                            onClick: (e) => {
                                console.log('🎯 TargetHUD: Clear Target clicked');
                                e.preventDefault();
                                e.stopPropagation();
                                setShowContextMenu(false); // Close menu immediately
                                handleClearTarget();
                            }
                        }
                    ]}
                />
            )}

            {/* Resource Adjustment Modal */}
            {showResourceModal && resourceModalData && (
                <ResourceAdjustmentModal
                    show={showResourceModal}
                    onClose={() => {
                        setShowResourceModal(false);
                        setResourceModalData(null);
                    }}
                    onAdjust={handleResourceAdjustment}
                    resourceType={resourceModalData.resourceType}
                    currentValue={resourceModalData.currentValue}
                    maxValue={resourceModalData.maxValue}
                    position={resourceModalData.position}
                />
            )}

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
                    <div className="equipment-slot-description">{tooltip.content.description}</div>
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
                        className={conditionContextMenu.condition?.type === 'buff' ? 'buff-context-menu' : 'debuff-context-menu'}
                        style={{
                            position: 'fixed',
                            left: conditionContextMenu.position.x,
                            top: conditionContextMenu.position.y,
                            zIndex: 10001
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div
                            className="context-menu-item"
                            onClick={handleAdjustConditionTime}
                        >
                            <i className="fas fa-clock" style={{ marginRight: '8px' }}></i>
                            Adjust Duration
                        </div>
                        <div
                            className="context-menu-item"
                            onClick={handleRemoveCondition}
                        >
                            <i className="fas fa-times" style={{ marginRight: '8px' }}></i>
                            Remove Condition
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
