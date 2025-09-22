import React, { useState, useRef, useEffect, useCallback } from 'react';
import Draggable from 'react-draggable';
// Removed: Resizable - not used
import usePartyStore from '../../store/partyStore';
import useTargetingStore from '../../store/targetingStore';
import useCharacterStore from '../../store/characterStore';
import useGameStore from '../../store/gameStore';
import useBuffStore from '../../store/buffStore';
import useDebuffStore from '../../store/debuffStore';
import useChatStore from '../../store/chatStore';
import ResourceAdjustmentModal from './ResourceAdjustmentModal';
import ClassResourceBar from './ClassResourceBar';
import TooltipPortal from '../tooltips/TooltipPortal';
import UnifiedContextMenu from '../level-editor/UnifiedContextMenu';
import { showPlayerLeaveNotification } from '../../utils/playerNotifications';
// REMOVED: import 'react-resizable/css/styles.css'; // CAUSES CSS POLLUTION - loaded centrally
// REMOVED: import '../../styles/party-hud.css'; // CAUSES CSS POLLUTION - loaded centrally
// REMOVED: import './styles/ClassResourceBar.css'; // CAUSES CSS POLLUTION - loaded centrally

const PartyMemberFrame = ({ member, isCurrentPlayer = false, onContextMenu, onResourceAdjust, onBuffContextMenu }) => {
    const frameRef = useRef(null);
    const { setTarget, currentTarget, clearTarget } = useTargetingStore();
    const { isGMMode } = useGameStore();
    const { getBuffsForTarget, getRemainingTime, updateBuffTimers, removeBuff } = useBuffStore();
    const { getDebuffsForTarget, getRemainingTime: getDebuffRemainingTime, updateDebuffTimers } = useDebuffStore();
    const [showResourceModal, setShowResourceModal] = useState(false);
    const [resourceModalData, setResourceModalData] = useState(null);
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipData, setTooltipData] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [forceUpdate, setForceUpdate] = useState(0);

    const isTargeted = currentTarget?.id === member.id;

    // Timer to update buff and debuff displays every second
    useEffect(() => {
        // Get current buffs and debuffs for this member
        const currentBuffs = getBuffsForTarget(member.id);
        const currentDebuffs = getDebuffsForTarget(member.id);

        if (!isCurrentPlayer || (currentBuffs.length === 0 && currentDebuffs.length === 0)) return;

        const interval = setInterval(() => {
            updateBuffTimers();
            updateDebuffTimers();
            setForceUpdate(prev => prev + 1); // Force re-render to update timer displays
        }, 1000);

        return () => clearInterval(interval);
    }, [isCurrentPlayer, member.id, getBuffsForTarget, getDebuffsForTarget, updateBuffTimers, updateDebuffTimers]);

    const handleRightClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        onContextMenu(e, member);
    };

    const handleTargetMember = () => {
        if (isTargeted) {
            clearTarget();
        } else {
            setTarget({
                id: member.id,
                name: member.name,
                type: 'party_member',
                data: member
            }, 'party_member');
        }
    };

    // Calculate resource percentages and colors
    const healthPercent = (member.character?.health?.current || 0) / (member.character?.health?.max || 1) * 100;
    const manaPercent = (member.character?.mana?.current || 0) / (member.character?.mana?.max || 1) * 100;
    const apPercent = (member.character?.actionPoints?.current || 0) / (member.character?.actionPoints?.max || 1) * 100;

    const getHealthColor = (percent) => {
        if (percent > 75) return '#4CAF50';
        if (percent > 50) return '#FFC107';
        if (percent > 25) return '#FF9800';
        return '#F44336';
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
                currentValue = member.character?.health?.current || 0;
                maxValue = member.character?.health?.max || 0;
                break;
            case 'mana':
                currentValue = member.character?.mana?.current || 0;
                maxValue = member.character?.mana?.max || 0;
                break;
            case 'actionPoints':
                currentValue = member.character?.actionPoints?.current || 0;
                maxValue = member.character?.actionPoints?.max || 0;
                break;
            default:
                return;
        }

        setResourceModalData({
            resourceType,
            currentValue,
            maxValue,
            position,
            memberId: member.id
        });
        setShowResourceModal(true);
    };

    const handleResourceAdjustment = (adjustment) => {
        if (onResourceAdjust && resourceModalData) {
            onResourceAdjust(resourceModalData.memberId, resourceModalData.resourceType, adjustment, frameRef);
        }
        setShowResourceModal(false);
        setResourceModalData(null);
    };

    // Helper function to calculate buff tooltip position with viewport awareness
    const calculateBuffTooltipPosition = (mouseX, mouseY) => {
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const tooltipWidth = 250; // Approximate width of buff tooltip
        const tooltipHeight = 150; // Approximate height of buff tooltip

        // Position tooltip close to cursor with small offset
        let x = mouseX + 10;
        let y = mouseY - 10;

        // Adjust if tooltip would go off the right edge
        if (x + tooltipWidth > viewportWidth - 20) {
            x = mouseX - tooltipWidth - 10;
        }

        // Adjust if tooltip would go off the bottom edge
        if (y + tooltipHeight > viewportHeight - 20) {
            y = mouseY - tooltipHeight - 10;
        }

        // Adjust if tooltip would go off the top edge
        if (y < 20) {
            y = mouseY + 20;
        }

        // Adjust if tooltip would go off the left edge
        if (x < 20) {
            x = 20;
        }

        return { x, y };
    };

    // Buff tooltip handlers
    const handleBuffMouseEnter = (e, buff) => {
        const remainingTime = getRemainingTime(buff.id);
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

        setTooltipData({
            title: buff.name,
            description: buff.description,
            timeRemaining: timeString,
            effects: buff.effects
        });

        const position = calculateBuffTooltipPosition(e.clientX, e.clientY);
        setTooltipPosition(position);
        setShowTooltip(true);
    };

    const handleBuffMouseMove = (e) => {
        if (showTooltip) {
            const position = calculateBuffTooltipPosition(e.clientX, e.clientY);
            setTooltipPosition(position);
        }
    };

    const handleBuffMouseLeave = () => {
        setShowTooltip(false);
        setTooltipData(null);
    };

    // Buff context menu handler
    const handleBuffRightClick = (e, buff) => {
        e.preventDefault();
        e.stopPropagation();
        onBuffContextMenu(e, buff);
    };

    // Debuff tooltip handlers
    const handleDebuffMouseEnter = (e, debuff) => {
        const remainingTime = getDebuffRemainingTime(debuff.id);
        const minutes = Math.floor(remainingTime / 60);
        const seconds = remainingTime % 60;
        const timeString = minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;

        setTooltipData({
            title: debuff.name,
            description: debuff.description,
            timeRemaining: timeString,
            effects: debuff.effects
        });

        const position = calculateBuffTooltipPosition(e.clientX, e.clientY);
        setTooltipPosition(position);
        setShowTooltip(true);
    };

    const handleDebuffMouseMove = (e) => {
        if (showTooltip) {
            const position = calculateBuffTooltipPosition(e.clientX, e.clientY);
            setTooltipPosition(position);
        }
    };

    const handleDebuffMouseLeave = () => {
        setShowTooltip(false);
        setTooltipData(null);
    };

    // Debuff context menu handler
    const handleDebuffRightClick = (e, debuff) => {
        e.preventDefault();
        e.stopPropagation();
        onBuffContextMenu(e, debuff); // Reuse the same context menu handler
    };

    const formatEffectText = (effects) => {
        if (!effects) return '';

        const effectTexts = [];
        Object.keys(effects).forEach(effectType => {
            const value = effects[effectType];
            switch (effectType) {
                case 'healthRestore':
                    effectTexts.push(`+${value} Health`);
                    break;
                case 'manaRestore':
                    effectTexts.push(`+${value} Mana`);
                    break;
                case 'strength':
                    effectTexts.push(`+${value} Strength`);
                    break;
                case 'agility':
                    effectTexts.push(`+${value} Agility`);
                    break;
                case 'intelligence':
                    effectTexts.push(`+${value} Intelligence`);
                    break;
                case 'constitution':
                    effectTexts.push(`+${value} Constitution`);
                    break;
                case 'spirit':
                    effectTexts.push(`+${value} Spirit`);
                    break;
                case 'charisma':
                    effectTexts.push(`+${value} Charisma`);
                    break;
                default:
                    effectTexts.push(`${effectType}: ${value}`);
            }
        });

        return effectTexts.join(', ');
    };

    // Check if character has a class resource bar to add appropriate styling
    const hasClassResource = member.character?.class && member.character?.classResource;
    const classResourceType = member.character?.class?.toLowerCase().replace(/\s+/g, '-');

    return (
        <>
            <div
                ref={frameRef}
                className={`party-member-frame ${isCurrentPlayer ? 'current-player' : ''} ${isTargeted ? 'targeted' : ''} ${hasClassResource ? 'has-class-resource' : ''} ${hasClassResource ? `class-${classResourceType}` : ''}`}
                onContextMenu={handleRightClick}
            >
                {/* Portrait */}
                <div className="party-portrait">
                    <div className="portrait-image">
                        <i className="fas fa-user"></i>
                    </div>
                    {/* GM Crown */}
                    {member.isGM && (
                        <div className="leader-crown">
                            <i className="fas fa-crown"></i>
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="party-member-info">
                    <div className="member-header">
                        <div className="member-name">
                            {member.name}
                            {member.character?.level && ` (Level ${member.character.level})`}
                            {(member.character?.exhaustionLevel || 0) > 0 && (
                                <span className="exhaustion-indicator" title={`Exhausted ${member.character.exhaustionLevel}`}>
                                    💤
                                </span>
                            )}
                        </div>
                        <div className="member-details">
                            <div className="member-race-class">
                                {(() => {
                                    const race = member.character?.raceDisplayName || member.character?.race || 'Unknown Race';
                                    const characterClass = member.character?.class || 'Unknown Class';
                                    return `${race} ${characterClass}`;
                                })()}
                            </div>
                            <div className="member-alignment">
                                <span className="alignment">{member.character?.alignment || 'Neutral'}</span>
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
                                {member.character?.health?.current || 0}/{member.character?.health?.max || 0}
                            </div>
                        </div>

                        {/* Mana Bar */}
                        {(member.character?.mana?.max || 0) > 0 && (
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
                                    {member.character?.mana?.current || 0}/{member.character?.mana?.max || 0}
                                </div>
                            </div>
                        )}

                        {/* Action Points Bar */}
                        {(member.character?.actionPoints?.max || 0) > 0 && (
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
                                    {member.character?.actionPoints?.current || 0}/{member.character?.actionPoints?.max || 0} AP
                                </div>
                            </div>
                        )}

                        {/* Class Resource Bar - Only show if character has a class and class resource */}
                        {member.character?.class && member.character?.classResource && (
                            <ClassResourceBar
                                characterClass={member.character.class}
                                classResource={member.character.classResource}
                                isGMMode={isGMMode}
                                onResourceClick={(resourceType) => onResourceAdjust(member.id, resourceType)}
                                size="small"
                            />
                        )}
                    </div>
                </div>

                {/* Status Indicators */}
                <div className="member-status-indicators">
                    <div className={`status-dot ${member.status || 'online'}`}></div>
                </div>
            </div>

            {/* Buffs and Debuffs - Only show for current player */}
            {isCurrentPlayer && (() => {
                // Get buffs and debuffs for the current player
                const playerBuffs = getBuffsForTarget('player');
                const playerDebuffs = getDebuffsForTarget('player');

                return (
                    <div className="character-buffs-debuffs">
                        {/* Buffs Row */}
                        {playerBuffs.length > 0 && (
                            <div className="character-buffs">
                                {playerBuffs.map((buff) => {
                                    const remainingTime = getRemainingTime(buff.id);
                                    const minutes = Math.floor(remainingTime / 60);
                                    const seconds = remainingTime % 60;

                                    return (
                                        <div
                                            key={buff.id}
                                            className="buff-icon"
                                            onMouseEnter={(e) => handleBuffMouseEnter(e, buff)}
                                            onMouseMove={handleBuffMouseMove}
                                            onMouseLeave={handleBuffMouseLeave}
                                            onContextMenu={(e) => handleBuffRightClick(e, buff)}
                                        >
                                            <img
                                                src={buff.icon}
                                                alt={buff.name}
                                                onError={(e) => {
                                                    e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessedrecovery.jpg';
                                                }}
                                            />
                                            <div className="buff-timer">
                                                {minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : seconds}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* Debuffs Row */}
                        {playerDebuffs.length > 0 && (
                            <div className="character-debuffs">
                                {playerDebuffs.map((debuff) => {
                                    const remainingTime = getDebuffRemainingTime(debuff.id);
                                    const minutes = Math.floor(remainingTime / 60);
                                    const seconds = remainingTime % 60;

                                    return (
                                        <div
                                            key={debuff.id}
                                            className="debuff-icon"
                                            onMouseEnter={(e) => handleDebuffMouseEnter(e, debuff)}
                                            onMouseMove={handleDebuffMouseMove}
                                            onMouseLeave={handleDebuffMouseLeave}
                                            onContextMenu={(e) => handleDebuffRightClick(e, debuff)}
                                        >
                                            <img
                                                src={debuff.icon}
                                                alt={debuff.name}
                                                onError={(e) => {
                                                    e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_shadowbolt.jpg';
                                                }}
                                            />
                                            <div className="debuff-timer">
                                                {minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : seconds}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })()}

            {/* Buff Tooltip */}
            {showTooltip && tooltipData && (
                <TooltipPortal>
                    <div
                        className="buff-tooltip"
                        style={{
                            position: 'fixed',
                            left: tooltipPosition.x,
                            top: tooltipPosition.y,
                            pointerEvents: 'none',
                            zIndex: 999999999
                        }}
                    >
                        <div className="buff-tooltip-header">
                            <div className="buff-tooltip-title">{tooltipData.title}</div>
                            <div className="buff-tooltip-time">Time Remaining: {tooltipData.timeRemaining}</div>
                        </div>
                        {tooltipData.description && (
                            <div className="buff-tooltip-description">
                                {tooltipData.description}
                            </div>
                        )}
                        {tooltipData.effects && Object.keys(tooltipData.effects).length > 0 && (
                            <div className="buff-tooltip-effects">
                                <div className="buff-tooltip-effects-title">Effects:</div>
                                <div className="buff-tooltip-effects-text">
                                    {formatEffectText(tooltipData.effects)}
                                </div>
                            </div>
                        )}
                    </div>
                </TooltipPortal>
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
        </>
    );
};

const PartyHUD = ({ onOpenCharacterSheet, onCreateToken }) => {
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [contextMenuMember, setContextMenuMember] = useState(null);
    const [showBuffContextMenu, setShowBuffContextMenu] = useState(false);
    const [buffContextMenuPosition, setBuffContextMenuPosition] = useState({ x: 0, y: 0 });
    const [contextMenuBuff, setContextMenuBuff] = useState(null);
    const nodeRefs = useRef({});

    // Removed: Unused force update state

    // Subscribe to party store changes for real-time updates
    useEffect(() => {
        const unsubscribeParty = usePartyStore.subscribe(
            (state) => state.partyMembers,
            (partyMembers) => {

                // Removed: Force update call
            }
        );

        // Also subscribe to character store for current player updates
        const unsubscribeCharacter = useCharacterStore.subscribe(
            (state) => ({
                name: state.name,
                baseName: state.baseName,
                race: state.race,
                subrace: state.subrace,
                raceDisplayName: state.raceDisplayName,
                class: state.class,
                level: state.level,
                health: state.health,
                mana: state.mana,
                actionPoints: state.actionPoints,
                classResource: state.classResource
            }),
            (characterData) => {
                // Update the current player in the party store when character data changes
                const partyState = usePartyStore.getState();
                const currentMember = partyState.partyMembers.find(m => m.id === 'current-player');
                if (currentMember) {
                    usePartyStore.getState().updatePartyMember('current-player', {
                        name: characterData.name,
                        character: {
                            ...currentMember.character,
                            race: characterData.race,
                            subrace: characterData.subrace,
                            raceDisplayName: characterData.raceDisplayName,
                            class: characterData.class,
                            level: characterData.level,
                            health: characterData.health,
                            mana: characterData.mana,
                            actionPoints: characterData.actionPoints,
                            classResource: characterData.classResource
                        }
                    });
                }
                // Removed: Force update call
            }
        );

        return () => {
            unsubscribeParty();
            unsubscribeCharacter();
        };
    }, []);

    const {
        partyMembers,
        removePartyMember,
        updatePartyMember,
        getMemberPosition,
        setMemberPosition,
        currentParty
    } = usePartyStore();
    const { setTarget, currentTarget, clearTarget } = useTargetingStore();
    const { updateResource } = useCharacterStore();
    const { removeBuff } = useBuffStore();
    const { addNotification } = useChatStore();
    const { setGMMode } = useGameStore();
    const currentPlayerData = useCharacterStore(state => ({
        name: state.name,
        race: state.race,
        raceDisplayName: state.raceDisplayName,
        class: state.class,
        level: state.level,
        alignment: state.alignment,
        exhaustionLevel: state.exhaustionLevel,
        health: state.health,
        mana: state.mana,
        actionPoints: state.actionPoints,
        derivedStats: state.derivedStats,
        equipmentBonuses: state.equipmentBonuses,
        classResource: state.classResource // Add class resource to subscription
    }));

    // Context menu handlers
    const handleContextMenu = (e, member) => {
        console.log(`🎯 HUD CONTEXT MENU: Opening at ${e.clientX}, ${e.clientY} on ${window.location.hostname}`);
        setContextMenuPosition({ x: e.clientX, y: e.clientY });
        setContextMenuMember(member);
        setShowContextMenu(true);
    };

    // Buff context menu handlers
    const handleBuffContextMenu = (e, buff) => {
        setBuffContextMenuPosition({ x: e.clientX, y: e.clientY });
        setContextMenuBuff(buff);
        setShowBuffContextMenu(true);
    };

    const handleDismissBuff = () => {
        if (contextMenuBuff) {
            removeBuff(contextMenuBuff.id);
        }
        setShowBuffContextMenu(false);
        setContextMenuBuff(null);
    };

    const handleTargetMember = () => {
        if (!contextMenuMember) return;

        const isTargeted = currentTarget?.id === contextMenuMember.id;
        if (isTargeted) {
            clearTarget();
        } else {
            setTarget({
                id: contextMenuMember.id,
                name: contextMenuMember.name,
                type: 'party_member',
                data: contextMenuMember
            }, 'party_member');
        }
        setShowContextMenu(false);
    };

    const handleInspectMember = () => {
        if (!contextMenuMember) return;

        // Check if inspecting self or another party member
        const isSelf = contextMenuMember.name === currentPlayerData.name || contextMenuMember.id === 'current-player';

        if (onOpenCharacterSheet) {
            // Pass the full member object, not just the character data
            onOpenCharacterSheet(contextMenuMember, isSelf);
        }

        setShowContextMenu(false);
    };

    const handleCreateToken = () => {
        if (!contextMenuMember) return;

        // Check if this is the current player
        const isSelf = contextMenuMember.name === currentPlayerData.name || contextMenuMember.id === 'current-player';

        if (isSelf && onCreateToken) {
            // Only allow creating tokens for the current player
            onCreateToken(contextMenuMember, isSelf);
        }

        setShowContextMenu(false);
    };

    const handleUninviteMember = () => {
        if (!contextMenuMember) return;

        // Don't allow removing the current player (check by name and ID)
        if (contextMenuMember.name === currentPlayerData.name || contextMenuMember.id === 'current-player') {
            setShowContextMenu(false);
            return;
        }

        // Show leave notification with fade-out effect (same as real multiplayer)
        showPlayerLeaveNotification(contextMenuMember.name, currentParty?.name || 'Party');

        // Add visual fade-out effect before removing (same as simulator)
        const memberElement = document.querySelector(`.party-frame-${contextMenuMember.id}`);
        if (memberElement) {
            memberElement.style.transition = 'opacity 0.5s ease-out';
            memberElement.style.opacity = '0';

            // Remove after animation completes
            setTimeout(() => {
                removePartyMember(contextMenuMember.id);

                // Also remove from simulator state if this is a simulated player
                if (contextMenuMember.id.startsWith('sim_')) {
                    // Notify simulator to remove this player from its state
                    const simulatorEvent = new CustomEvent('removeSimulatedPlayer', {
                        detail: { playerId: contextMenuMember.id }
                    });
                    window.dispatchEvent(simulatorEvent);
                }

                // Clear target if we're targeting the removed member
                if (currentTarget?.id === contextMenuMember.id) {
                    clearTarget();
                }
            }, 500);
        } else {
            // Fallback: remove immediately if element not found
            removePartyMember(contextMenuMember.id);

            // Also remove from simulator state if this is a simulated player
            if (contextMenuMember.id.startsWith('sim_')) {
                // Notify simulator to remove this player from its state
                const simulatorEvent = new CustomEvent('removeSimulatedPlayer', {
                    detail: { playerId: contextMenuMember.id }
                });
                window.dispatchEvent(simulatorEvent);
            }

            // Clear target if we're targeting the removed member
            if (currentTarget?.id === contextMenuMember.id) {
                clearTarget();
            }
        }

        // Add chat notification about player being uninvited
        addNotification('social', {
            sender: { name: 'System', class: 'system', level: 0 },
            content: `${contextMenuMember.name} was removed from the party`,
            type: 'system',
            timestamp: new Date().toISOString()
        });

        setShowContextMenu(false);
        console.log(`🚫 Uninvited player: ${contextMenuMember.name}`);
    };

    const handleTransferLeadership = () => {
        console.log('🚀 Transfer Leadership clicked!', {
            contextMenuMember,
            currentPlayerData: currentPlayerData.name
        });

        if (!contextMenuMember) {
            console.log('❌ No context menu member found');
            return;
        }

        // Don't allow transferring to yourself
        if (contextMenuMember.name === currentPlayerData.name || contextMenuMember.id === 'current-player') {
            console.log('❌ Cannot transfer to yourself');
            setShowContextMenu(false);
            return;
        }

        console.log('✅ Proceeding with leadership transfer...');

        // Update current player to remove GM status
        updatePartyMember('current-player', { isGM: false });
        console.log('📝 Removed GM status from current player');

        // Update target member to have GM status
        updatePartyMember(contextMenuMember.id, { isGM: true });
        console.log('📝 Added GM status to target member:', contextMenuMember.name);

        // Switch global GM mode - current player becomes Player, loses all GM privileges
        setGMMode(false);
        console.log('📝 Set global GM mode to false');

        // Add chat notification about leadership transfer
        addNotification('social', {
            sender: { name: 'System', class: 'system', level: 0 },
            content: `${contextMenuMember.name} is now the party leader`,
            type: 'system',
            timestamp: new Date().toISOString()
        });

        setShowContextMenu(false);
        console.log(`👑 Leadership transferred to: ${contextMenuMember.name} - You are now a Player`);
    };

    const handleResourceAdjust = (memberId, resourceType, adjustment, hudElementRef = null) => {
        if (memberId === 'current-player') {
            // Update current player's resources in character store
            const currentValue = currentPlayerData[resourceType]?.current || 0;
            const maxValue = currentPlayerData[resourceType]?.max || 0;
            const newValue = Math.max(0, Math.min(maxValue, currentValue + adjustment));
            updateResource(resourceType, newValue, maxValue);

            // Show floating combat text for current player
            if (window.showFloatingCombatText) {
                // Determine text type based on resource and adjustment direction
                let textType;
                if (resourceType === 'health') {
                    textType = adjustment > 0 ? 'heal' : 'damage';
                } else if (resourceType === 'mana') {
                    textType = adjustment > 0 ? 'mana' : 'mana-loss';
                } else if (resourceType === 'actionPoints') {
                    textType = adjustment > 0 ? 'ap' : 'ap-loss';
                }

                // Get the actual HUD element position if available
                let floatingTextPosition;
                if (hudElementRef && hudElementRef.current) {
                    const rect = hudElementRef.current.getBoundingClientRect();
                    floatingTextPosition = {
                        x: rect.left + rect.width / 2,
                        y: rect.top + 10 // Slightly above the HUD for better visibility
                    };
                } else {
                    // Fallback to main player HUD position (bottom-left corner of screen)
                    floatingTextPosition = { x: 120, y: window.innerHeight - 100 };
                }

                window.showFloatingCombatText(
                    Math.abs(adjustment).toString(),
                    textType,
                    floatingTextPosition
                );
            }
        } else {
            // Update party member's resources
            const member = partyMembers.find(m => m.id === memberId);
            if (member) {
                const currentValue = member.character?.[resourceType]?.current || 0;
                const maxValue = member.character?.[resourceType]?.max || 0;
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

                // Show floating combat text for party member
                if (window.showFloatingCombatText) {
                    // Determine text type based on resource and adjustment direction
                    let textType;
                    if (resourceType === 'health') {
                        textType = adjustment > 0 ? 'heal' : 'damage';
                    } else if (resourceType === 'mana') {
                        textType = adjustment > 0 ? 'mana' : 'mana-loss';
                    } else if (resourceType === 'actionPoints') {
                        textType = adjustment > 0 ? 'ap' : 'ap-loss';
                    }

                    // Get the actual HUD element position if available
                    let floatingTextPosition;
                    if (hudElementRef && hudElementRef.current) {
                        const rect = hudElementRef.current.getBoundingClientRect();
                        floatingTextPosition = {
                            x: rect.left + rect.width / 2,
                            y: rect.top + 10 // Slightly above the HUD for better visibility
                        };
                    } else {
                        // Fallback to stored position if HUD element ref not available
                        const memberPosition = getMemberPosition(memberId);
                        if (memberPosition) {
                            floatingTextPosition = {
                                x: memberPosition.x + 100,
                                y: memberPosition.y + 20
                            };
                        } else {
                            floatingTextPosition = { x: 200, y: 300 };
                        }
                    }

                    window.showFloatingCombatText(
                        Math.abs(adjustment).toString(),
                        textType,
                        floatingTextPosition
                    );
                }
            }
        }
    };

    // Handle drag for party member frames with immediate visual feedback
    const handleMemberDrag = useCallback((member, data) => {
        // Update the member's position IMMEDIATELY for responsive visual feedback
        setMemberPosition(member.id, { x: data.x, y: data.y });
    }, []); // Zustand store functions are stable, no deps needed

    // Removed: Test functions for buffs/debuffs

    // Removed: Auto-party creation - multiplayer handles party creation

    // Debug logging for party members
    console.log('🎭 PartyHUD rendering with members:', partyMembers.map(m => ({
        id: m.id,
        name: m.name,
        isGM: m.isGM,
        race: m.character?.race,
        raceDisplayName: m.character?.raceDisplayName,
        class: m.character?.class
    })));

    // Simple rule: Show HUDs for all room members
    // No complex leadership - room creator is GM, others are players
    const displayMembers = partyMembers.map(member => {
        // Update current player with live character data
        if (member.id === 'current-player') {
            return {
                ...member, // Preserve all existing member data including isGM
                name: currentPlayerData.name,
                character: {
                    level: currentPlayerData.level,
                    race: currentPlayerData.race,
                    subrace: currentPlayerData.subrace,
                    raceDisplayName: currentPlayerData.raceDisplayName,
                    class: currentPlayerData.class,
                    alignment: currentPlayerData.alignment,
                    exhaustionLevel: currentPlayerData.exhaustionLevel,
                    health: currentPlayerData.health,
                    mana: currentPlayerData.mana,
                    actionPoints: currentPlayerData.actionPoints,
                    classResource: currentPlayerData.classResource
                }
            };
        }
        return member;
    });

    return (
        <>


            <div className="party-hud-frames">
                {displayMembers.map((member, index) => {
                    // Create or get a unique ref for this member
                    if (!nodeRefs.current[member.id]) {
                        nodeRefs.current[member.id] = React.createRef();
                    }
                    const memberNodeRef = nodeRefs.current[member.id];

                    // Calculate dynamic spacing based on whether previous members have class resources
                    let yOffset = 200;
                    for (let i = 0; i < index; i++) {
                        const prevMember = displayMembers[i];
                        const hasClassResource = prevMember.character?.class && prevMember.character?.classResource;
                        const isComplexClass = ['Minstrel', 'Chaos Weaver', 'Gambler', 'Exorcist', 'Lichborne', 'Plaguebringer', 'Toxicologist', 'False Prophet'].includes(prevMember.character?.class);

                        if (hasClassResource && isComplexClass) {
                            yOffset += 120; // Extra spacing for complex class resource displays
                        } else if (hasClassResource) {
                            yOffset += 100; // Standard spacing for class resource displays
                        } else {
                            yOffset += 80; // Standard spacing for basic frames
                        }
                    }

                    return (
                        <Draggable
                            key={member.id}
                            handle={`.party-frame-${member.id}`}
                            defaultPosition={{ x: 20, y: yOffset }}
                            nodeRef={memberNodeRef}
                            onDrag={(e, data) => handleMemberDrag(member, data)}
                            enableUserSelectHack={false} // Disable user select hack for better performance
                            disabled={false} // Ensure dragging is always enabled
                            scale={1} // Fixed scale to prevent transform calculations
                        >
                            <div ref={memberNodeRef} className={`party-frame-${member.id}`}>
                                <PartyMemberFrame
                                    member={member}
                                    isCurrentPlayer={member.name === currentPlayerData.name}
                                    onContextMenu={handleContextMenu}
                                    onResourceAdjust={handleResourceAdjust}
                                    onBuffContextMenu={handleBuffContextMenu}
                                />
                            </div>
                        </Draggable>
                    );
                })}
            </div>

            {/* Context Menu - Outside draggable containers */}
            {showContextMenu && (() => {
                const menuItems = [];

                // Target/Clear Target
                menuItems.push({
                    icon: <i className="fas fa-crosshairs"></i>,
                    label: currentTarget?.id === contextMenuMember?.id ? 'Clear Target' : 'Target',
                    onClick: handleTargetMember
                });

                // Inspect
                menuItems.push({
                    icon: <i className="fas fa-search"></i>,
                    label: 'Inspect',
                    onClick: handleInspectMember
                });

                // Only show create token for current player
                if (contextMenuMember?.name === currentPlayerData.name || contextMenuMember?.id === 'current-player') {
                    menuItems.push({
                        icon: <i className="fas fa-plus-circle"></i>,
                        label: 'Create Token',
                        onClick: handleCreateToken
                    });
                }

                // Leadership transfer - only show if current player is GM and target is not current player
                const currentPlayerIsGM = partyMembers.find(m => m.id === 'current-player')?.isGM;

                // Only show uninvite for other party members, not yourself, and only if you're the GM
                if (currentPlayerIsGM && contextMenuMember?.name !== currentPlayerData.name && contextMenuMember?.id !== 'current-player') {
                    menuItems.push({
                        icon: <i className="fas fa-user-minus"></i>,
                        label: 'Uninvite',
                        onClick: handleUninviteMember,
                        className: 'danger'
                    });
                }

                console.log('🔍 Leadership check:', {
                    currentPlayerIsGM,
                    contextMenuMemberName: contextMenuMember?.name,
                    contextMenuMemberId: contextMenuMember?.id,
                    currentPlayerName: currentPlayerData.name,
                    partyMembers: partyMembers.map(m => ({ id: m.id, name: m.name, isGM: m.isGM }))
                });
                if (currentPlayerIsGM && contextMenuMember?.name !== currentPlayerData.name && contextMenuMember?.id !== 'current-player') {
                    menuItems.push({
                        type: 'separator'
                    });
                    menuItems.push({
                        icon: <i className="fas fa-crown"></i>,
                        label: 'Transfer Leadership',
                        onClick: (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            console.log('🖱️ Transfer Leadership menu item clicked');
                            handleTransferLeadership();
                        },
                        className: 'leadership'
                    });
                }

                return (
                    <UnifiedContextMenu
                        visible={true}
                        x={contextMenuPosition.x}
                        y={contextMenuPosition.y}
                        onClose={() => setShowContextMenu(false)}
                        items={menuItems}
                    />
                );
            })()}

            {/* Buff Context Menu - Outside draggable containers */}
            {showBuffContextMenu && (
                <UnifiedContextMenu
                    visible={true}
                    x={buffContextMenuPosition.x}
                    y={buffContextMenuPosition.y}
                    onClose={() => setShowBuffContextMenu(false)}
                    items={[
                        {
                            icon: <i className="fas fa-times"></i>,
                            label: 'Dismiss Buff',
                            onClick: handleDismissBuff
                        }
                    ]}
                />
            )}
        </>
    );
};

export default PartyHUD;
