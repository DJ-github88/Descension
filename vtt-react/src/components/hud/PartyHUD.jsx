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
import usePresenceStore from '../../store/presenceStore';
import ClassResourceBar from './ClassResourceBar';
import TooltipPortal from '../tooltips/TooltipPortal';
import { showPlayerLeaveNotification } from '../../utils/playerNotifications';
// REMOVED: import 'react-resizable/css/styles.css'; // CAUSES CSS POLLUTION - loaded centrally
// REMOVED: import '../../styles/party-hud.css'; // CAUSES CSS POLLUTION - loaded centrally
// REMOVED: import './styles/ClassResourceBar.css'; // CAUSES CSS POLLUTION - loaded centrally

const PartyMemberFrame = ({ member, isCurrentPlayer = false, onContextMenu, onResourceAdjust, onBuffContextMenu, onClassResourceUpdate, onRegisterRefs }) => {
    const frameRef = useRef(null);
    const healthBarRef = useRef(null);
    const manaBarRef = useRef(null);
    const apBarRef = useRef(null);
    const { setTarget, currentTarget, clearTarget } = useTargetingStore();
    const isGMMode = useGameStore(state => state.isGMMode);
    const { getBuffsForTarget, getRemainingTime, updateBuffTimers, removeBuff } = useBuffStore();
    const { getDebuffsForTarget, getRemainingTime: getDebuffRemainingTime, updateDebuffTimers } = useDebuffStore();
    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipData, setTooltipData] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [forceUpdate, setForceUpdate] = useState(0);

    const isTargeted = currentTarget?.id === member.id;

    // Register refs with parent component
    useEffect(() => {
        if (onRegisterRefs) {
            onRegisterRefs(member.id, {
                health: healthBarRef,
                mana: manaBarRef,
                actionPoints: apBarRef
            });
        }
    }, [member.id, onRegisterRefs]);

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
                    <div
                        className="portrait-image"
                        style={{
                            backgroundImage: member.character?.tokenSettings?.customIcon
                                ? `url(${member.character.tokenSettings.customIcon})`
                                : member.character?.lore?.characterImage
                                ? `url(${member.character.lore.characterImage})`
                                : member.character?.lore?.characterIcon
                                ? `url(https://wow.zamimg.com/images/wow/icons/large/${member.character.lore.characterIcon}.jpg)`
                                : 'none',
                            backgroundSize: member.character?.lore?.imageTransformations
                                ? `${(member.character.lore.imageTransformations.scale || 1) * 150}%`
                                : 'cover',
                            backgroundPosition: member.character?.lore?.imageTransformations
                                ? `${50 + (member.character.lore.imageTransformations.positionX || 0) / 2}% ${50 - (member.character.lore.imageTransformations.positionY || 0) / 2}%`
                                : 'center center',
                            backgroundRepeat: 'no-repeat',
                            transform: member.character?.lore?.imageTransformations
                                ? `rotate(${member.character.lore.imageTransformations.rotation || 0}deg)`
                                : 'none'
                        }}
                    >
                        {/* Show default icon only if no character image */}
                        {!member.character?.tokenSettings?.customIcon && !member.character?.lore?.characterImage && !member.character?.lore?.characterIcon && (
                            <i className="fas fa-user"></i>
                        )}
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
                            ref={healthBarRef}
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
                                {(() => {
                                    const current = member.character?.health?.current || 0;
                                    const max = member.character?.health?.max || 0;
                                    const temp = member.character?.tempHealth || 0;
                                    return temp > 0 
                                        ? `${current}/${max} +${temp} Temporary HP`
                                        : `${current}/${max}`;
                                })()}
                            </div>
                        </div>

                        {/* Mana Bar */}
                        {(member.character?.mana?.max || 0) > 0 && (
                            <div
                                ref={manaBarRef}
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
                                    {(() => {
                                        const current = member.character?.mana?.current || 0;
                                        const max = member.character?.mana?.max || 0;
                                        const temp = member.character?.tempMana || 0;
                                        return temp > 0 
                                            ? `${current}/${max} +${temp} Temporary Mana`
                                            : `${current}/${max}`;
                                    })()}
                                </div>
                            </div>
                        )}

                        {/* Action Points Bar */}
                        {(member.character?.actionPoints?.max || 0) > 0 && (
                            <div
                                ref={apBarRef}
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
                                    {(() => {
                                        const current = member.character?.actionPoints?.current || 0;
                                        const max = member.character?.actionPoints?.max || 0;
                                        const temp = member.character?.tempActionPoints || 0;
                                        return temp > 0 
                                            ? `${current}/${max} AP +${temp} Temporary AP`
                                            : `${current}/${max} AP`;
                                    })()}
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
                                onClassResourceUpdate={onClassResourceUpdate ? (field, value) => onClassResourceUpdate(member.id, field, value) : null}
                                size="small"
                                context="party"
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
        </>
    );
};

const PartyHUD = ({ onOpenCharacterSheet, onCreateToken }) => {
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
    const [contextMenuMember, setContextMenuMember] = useState(null);
    const [hoveredMenuItem, setHoveredMenuItem] = useState(null);
    const contextMenuRef = useRef(null);
    const [showBuffContextMenu, setShowBuffContextMenu] = useState(false);
    const [buffContextMenuPosition, setBuffContextMenuPosition] = useState({ x: 0, y: 0 });
    const [contextMenuBuff, setContextMenuBuff] = useState(null);
    const [showCustomAmountModal, setShowCustomAmountModal] = useState(false);
    const [customAmountType, setCustomAmountType] = useState(''); // 'damage', 'heal', 'mana-damage', 'mana-heal', 'xp'
    const [showOverhealModal, setShowOverhealModal] = useState(false);
    const [overhealData, setOverhealData] = useState(null); // { resourceType, amount, memberId }
    const nodeRefs = useRef({});
    const resourceBarRefs = useRef({}); // Store refs to resource bars for floating text positioning

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
                tempHealth: state.tempHealth || 0,
                tempMana: state.tempMana || 0,
                tempActionPoints: state.tempActionPoints || 0,
                classResource: state.classResource,
                lore: state.lore,
                tokenSettings: state.tokenSettings
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
                            tempHealth: characterData.tempHealth,
                            tempMana: characterData.tempMana,
                            tempActionPoints: characterData.tempActionPoints,
                            classResource: characterData.classResource,
                            lore: characterData.lore,
                            tokenSettings: characterData.tokenSettings
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

    // Handle click outside to close context menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showContextMenu && contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
                setShowContextMenu(false);
                setHoveredMenuItem(null);
            }
        };

        if (showContextMenu) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showContextMenu]);

    const {
        partyMembers,
        removePartyMember,
        updatePartyMember,
        getMemberPosition,
        setMemberPosition,
        currentParty
    } = usePartyStore();
    const { setTarget, currentTarget, clearTarget } = useTargetingStore();
    const { updateResource, updateClassResource } = useCharacterStore();
    const { removeBuff } = useBuffStore();
    const { addNotification, addCombatNotification } = useChatStore();
    const { setGMMode, isGMMode, toggleGMMode, isInMultiplayer } = useGameStore();
    const currentUserPresence = usePresenceStore((state) => state.currentUserPresence);
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
        tempHealth: state.tempHealth || 0,
        tempMana: state.tempMana || 0,
        tempActionPoints: state.tempActionPoints || 0,
        derivedStats: state.derivedStats,
        equipmentBonuses: state.equipmentBonuses,
        classResource: state.classResource,
        lore: state.lore,
        tokenSettings: state.tokenSettings
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

    const handleToggleGMView = () => {
        if (!isInMultiplayer) {
            toggleGMMode();
        }
        setShowContextMenu(false);
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

    // Handler for class resource updates (e.g., Inferno Veil)
    const handleClassResourceUpdate = (memberId, field, value) => {
        if (memberId === 'current-player') {
            // Update current player's class resource in character store
            updateClassResource(field, value);
        } else {
            // Update party member's class resource in party store
            const member = partyMembers.find(m => m.id === memberId);
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
    };

    // Register resource bar refs from PartyMemberFrame
    const handleRegisterRefs = useCallback((memberId, refs) => {
        resourceBarRefs.current[memberId] = refs;
    }, []);

    // Helper function to get character name from memberId
    const getCharacterName = (memberId) => {
        if (memberId === 'current-player') {
            return currentPlayerData.name || 'Player';
        }
        const member = partyMembers.find(m => m.id === memberId);
        return member?.name || 'Unknown';
    };

    // Helper function to get the actor name (current player, with GM suffix if in GM mode)
    const getActorName = () => {
        const actorName = currentPlayerData.name || 'Player';
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

    // Helper function to generate varied log messages for resource changes
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

    const handleResourceAdjust = (memberId, resourceType, adjustment, hudElementRef = null) => {
        // Only handle positive adjustments (healing/restoring) for overheal detection
        if (adjustment > 0) {
            let currentValue, maxValue;
            
            if (memberId === 'current-player') {
                currentValue = currentPlayerData[resourceType]?.current || 0;
                maxValue = currentPlayerData[resourceType]?.max || 0;
            } else {
                const member = partyMembers.find(m => m.id === memberId);
                if (!member) return;
                currentValue = member.character?.[resourceType]?.current || 0;
                maxValue = member.character?.[resourceType]?.max || 0;
            }

            // Check for overheal
            const wouldOverheal = (currentValue + adjustment) > maxValue;
            
            if (wouldOverheal) {
                // Show confirmation modal for temporary resources
                const overhealAmount = (currentValue + adjustment) - maxValue;
                setOverhealData({
                    memberId,
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
        applyResourceAdjustment(memberId, resourceType, adjustment, false, false);
    };

    const applyResourceAdjustment = (memberId, resourceType, adjustment, asTemporary = false, skipLogging = false) => {
        const tempFieldMap = {
            'health': 'tempHealth',
            'mana': 'tempMana',
            'actionPoints': 'tempActionPoints'
        };
        const tempField = tempFieldMap[resourceType];

        if (memberId === 'current-player') {
            // Update current player's resources in character store
            const currentValue = currentPlayerData[resourceType]?.current || 0;
            const maxValue = currentPlayerData[resourceType]?.max || 0;
            const currentTemp = currentPlayerData[tempField] || 0;
            
            if (asTemporary && adjustment > 0) {
                // Add as temporary resource (overheal)
                const overhealAmount = (currentValue + adjustment) - maxValue;
                
                // Set resource to max and add overheal as temporary
                updateResource(resourceType, maxValue, maxValue);
                useCharacterStore.getState().updateTempResource(resourceType, currentTemp + overhealAmount);
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
                    useCharacterStore.getState().updateTempResource(resourceType, newTemp);
                }
            } else {
                // Normal positive adjustment (healing/restoring, no overheal)
                const newValue = Math.max(0, Math.min(maxValue, currentValue + adjustment));
                updateResource(resourceType, newValue, maxValue);
            }

            // Show floating combat text for current player
            showFloatingTextForResource(memberId, resourceType, adjustment, 'current-player');
            
            // Log the resource change (only log if there's an actual change and logging is not skipped)
            if (adjustment !== 0 && !asTemporary && !skipLogging) {
                const characterName = getCharacterName(memberId);
                logResourceChange(characterName, resourceType, adjustment, adjustment > 0);
            }
        } else {
            // Update party member's resources
            const member = partyMembers.find(m => m.id === memberId);
            if (member) {
                const currentValue = member.character?.[resourceType]?.current || 0;
                const maxValue = member.character?.[resourceType]?.max || 0;
                const currentTemp = member.character?.[tempField] || 0;
                
                if (asTemporary && adjustment > 0) {
                    // Add as temporary resource (overheal)
                    const overhealAmount = (currentValue + adjustment) - maxValue;
                    
                    // Set resource to max and add overheal as temporary
                    updatePartyMember(memberId, {
                        character: {
                            ...member.character,
                            [resourceType]: {
                                ...member.character[resourceType],
                                current: maxValue
                            },
                            [tempField]: currentTemp + overhealAmount
                        }
                    });
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
                } else {
                    // Normal positive adjustment (healing/restoring, no overheal)
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
                }

                // Show floating combat text for party member
                showFloatingTextForResource(memberId, resourceType, adjustment, memberId);
                
                // Log the resource change (only log if there's an actual change and logging is not skipped)
                if (adjustment !== 0 && !asTemporary && !skipLogging) {
                    const characterName = getCharacterName(memberId);
                    logResourceChange(characterName, resourceType, adjustment, adjustment > 0);
                }
            }
        }
    };

    const showFloatingTextForResource = (memberId, resourceType, adjustment, refMemberId) => {
        if (!window.showFloatingCombatText) return;

        // Determine text type based on resource and adjustment direction
        let textType;
        if (resourceType === 'health') {
            textType = adjustment > 0 ? 'heal' : 'damage';
        } else if (resourceType === 'mana') {
            textType = adjustment > 0 ? 'mana' : 'mana-loss';
        } else if (resourceType === 'actionPoints') {
            textType = adjustment > 0 ? 'ap' : 'ap-loss';
        }

        if (!textType) return;

        // Get the resource bar ref for this member and resource type
        let floatingTextPosition;
        const refs = resourceBarRefs.current[refMemberId];
        
        if (refs && refs[resourceType] && refs[resourceType].current) {
            const rect = refs[resourceType].current.getBoundingClientRect();
            floatingTextPosition = {
                x: rect.left + rect.width / 2,
                y: rect.top - 20 // Position above the bar
            };
        } else {
            // Fallback positioning
            if (memberId === 'current-player') {
                floatingTextPosition = { x: 120, y: window.innerHeight - 100 };
            } else {
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
        }

        window.showFloatingCombatText(
            Math.abs(adjustment).toString(),
            textType,
            floatingTextPosition
        );
    };

    // Handle custom amount adjustments
    const handleCustomAmount = (type) => {
        setCustomAmountType(type);
        setShowCustomAmountModal(true);
        setShowContextMenu(false);
    };

    // Handle custom amount submission
    const handleCustomAmountSubmit = (amount) => {
        const numAmount = parseInt(amount);
        // Allow negative values for XP, but not for health/mana
        if (isNaN(numAmount) || !contextMenuMember) return;
        if (customAmountType !== 'xp' && numAmount <= 0) return;

        const memberId = contextMenuMember.id;
        const characterName = getCharacterName(memberId);

        switch (customAmountType) {
            case 'damage':
                handleResourceAdjust(memberId, 'health', -numAmount);
                logResourceChange(characterName, 'health', -numAmount, false);
                break;
            case 'heal':
                handleResourceAdjust(memberId, 'health', numAmount);
                logResourceChange(characterName, 'health', numAmount, true);
                break;
            case 'mana-damage':
                handleResourceAdjust(memberId, 'mana', -numAmount);
                logResourceChange(characterName, 'mana', -numAmount, false);
                break;
            case 'mana-heal':
                handleResourceAdjust(memberId, 'mana', numAmount);
                logResourceChange(characterName, 'mana', numAmount, true);
                break;
            case 'ap-spend':
                handleResourceAdjust(memberId, 'actionPoints', -numAmount);
                logResourceChange(characterName, 'actionPoints', -numAmount, false);
                break;
            case 'ap-restore':
                handleResourceAdjust(memberId, 'actionPoints', numAmount);
                logResourceChange(characterName, 'actionPoints', numAmount, true);
                break;
            case 'xp':
                handleAwardXP(memberId, numAmount);
                // XP logging is handled in handleAwardXP
                break;
        }
        setShowCustomAmountModal(false);
        setCustomAmountType('');
    };

    // Handle awarding XP to a party member
    const handleAwardXP = (memberId, xpAmount) => {
        const characterName = getCharacterName(memberId);
        const absAmount = Math.abs(xpAmount);
        
        if (memberId === 'current-player') {
            // Award XP to current player
            useCharacterStore.getState().awardExperience(xpAmount);
            console.log(`💰 ${xpAmount > 0 ? 'Awarded' : 'Removed'} ${absAmount} XP ${xpAmount > 0 ? 'to' : 'from'} current player`);
        } else {
            // For other party members, we'd need to send this through multiplayer
            // For now, just log it
            console.log(`💰 Would ${xpAmount > 0 ? 'award' : 'remove'} ${absAmount} XP ${xpAmount > 0 ? 'to' : 'from'} party member ${memberId}`);
            // TODO: Implement multiplayer XP award
        }

        // Log to combat tab
        const actorName = getActorName();
        const xpMessages = xpAmount > 0 ? [
            `${characterName} gained ${absAmount} experience`,
            `${characterName} earned ${absAmount} XP`,
            `${absAmount} experience was awarded to ${characterName}`,
            `${characterName} received ${absAmount} experience points`
        ] : [
            `${absAmount} experience was removed from ${characterName}`,
            `${characterName} lost ${absAmount} XP`,
            `${absAmount} experience was deducted from ${characterName}`
        ];
        const xpMessage = xpMessages[Math.floor(Math.random() * xpMessages.length)];
        addCombatNotification({
            type: 'combat_resource',
            attacker: actorName,
            target: characterName,
            resourceType: 'experience',
            amount: absAmount,
            isPositive: xpAmount > 0,
            message: xpMessage
        });

        setShowContextMenu(false);
    };

    // Handle level adjustment for a party member
    const handleLevelAdjust = (memberId, levelChange) => {
        const characterName = getCharacterName(memberId);
        const absChange = Math.abs(levelChange);
        
        if (memberId === 'current-player') {
            // Adjust level for current player
            useCharacterStore.getState().adjustLevel(levelChange);
            console.log(`📊 ${levelChange > 0 ? 'Added' : 'Removed'} ${absChange} level(s) ${levelChange > 0 ? 'to' : 'from'} current player`);
        } else {
            // For other party members, we'd need to send this through multiplayer
            // For now, just log it
            console.log(`📊 Would ${levelChange > 0 ? 'add' : 'remove'} ${absChange} level(s) ${levelChange > 0 ? 'to' : 'from'} party member ${memberId}`);
            // TODO: Implement multiplayer level adjustment
        }

        // Log to combat tab - get level after change
        const actorName = getActorName();
        const newLevel = memberId === 'current-player' ? useCharacterStore.getState().level : 
                         (partyMembers.find(m => m.id === memberId)?.character?.level || '?');
        const levelMessages = levelChange > 0 ? [
            `${characterName} reached level ${newLevel}`,
            `${characterName} leveled up!`,
            `${characterName} gained ${absChange} level${absChange > 1 ? 's' : ''}`,
            `${characterName} advanced ${absChange} level${absChange > 1 ? 's' : ''}`
        ] : [
            `${characterName} lost ${absChange} level${absChange > 1 ? 's' : ''}`,
            `${absChange} level${absChange > 1 ? 's' : ''} ${absChange > 1 ? 'were' : 'was'} removed from ${characterName}`,
            `${characterName} was reduced by ${absChange} level${absChange > 1 ? 's' : ''}`
        ];
        const levelMessage = levelMessages[Math.floor(Math.random() * levelMessages.length)];
        addCombatNotification({
            type: 'combat_resource',
            attacker: actorName,
            target: characterName,
            resourceType: 'level',
            amount: absChange,
            isPositive: levelChange > 0,
            message: levelMessage
        });

        setShowContextMenu(false);
    };

    // Handle full heal (only health)
    const handleFullHeal = () => {
        if (!contextMenuMember) return;

        const memberId = contextMenuMember.id;
        const characterName = getCharacterName(memberId);

        if (memberId === 'current-player') {
            const maxHp = currentPlayerData.health?.max || 0;
            const currentHp = currentPlayerData.health?.current || 0;
            const healAmount = maxHp - currentHp;
            handleResourceAdjust(memberId, 'health', healAmount);
            if (healAmount > 0) logResourceChange(characterName, 'health', healAmount, true);
        } else {
            const member = partyMembers.find(m => m.id === memberId);
            if (member) {
                const maxHp = member.character?.health?.max || 0;
                const currentHp = member.character?.health?.current || 0;
                const healAmount = maxHp - currentHp;
                handleResourceAdjust(memberId, 'health', healAmount);
                if (healAmount > 0) logResourceChange(characterName, 'health', healAmount, true);
            }
        }
        setShowContextMenu(false);
    };

    // Handle full restore all (HP, mana, and AP)
    const handleFullRestoreAll = () => {
        if (!contextMenuMember) return;

        const memberId = contextMenuMember.id;
        const characterName = getCharacterName(memberId);

        if (memberId === 'current-player') {
            const maxHp = currentPlayerData.health?.max || 0;
            const currentHp = currentPlayerData.health?.current || 0;
            const maxMp = currentPlayerData.mana?.max || 0;
            const currentMp = currentPlayerData.mana?.current || 0;
            const maxAp = currentPlayerData.actionPoints?.max || 0;
            const currentAp = currentPlayerData.actionPoints?.current || 0;
            const healthAmount = maxHp - currentHp;
            const manaAmount = maxMp - currentMp;
            const apAmount = maxAp - currentAp;
            
            // Skip individual logging - we'll log once at the end
            applyResourceAdjustment(memberId, 'health', healthAmount, false, true);
            applyResourceAdjustment(memberId, 'mana', manaAmount, false, true);
            applyResourceAdjustment(memberId, 'actionPoints', apAmount, false, true);
            
            // Log as single combined message
            if (healthAmount > 0 || manaAmount > 0 || apAmount > 0) {
                logFullResourceChange(characterName, healthAmount, manaAmount, apAmount, true);
            }
        } else {
            const member = partyMembers.find(m => m.id === memberId);
            if (member) {
                const maxHp = member.character?.health?.max || 0;
                const currentHp = member.character?.health?.current || 0;
                const maxMp = member.character?.mana?.max || 0;
                const currentMp = member.character?.mana?.current || 0;
                const maxAp = member.character?.actionPoints?.max || 0;
                const currentAp = member.character?.actionPoints?.current || 0;
                const healthAmount = maxHp - currentHp;
                const manaAmount = maxMp - currentMp;
                const apAmount = maxAp - currentAp;
                
                // Skip individual logging - we'll log once at the end
                applyResourceAdjustment(memberId, 'health', healthAmount, false, true);
                applyResourceAdjustment(memberId, 'mana', manaAmount, false, true);
                applyResourceAdjustment(memberId, 'actionPoints', apAmount, false, true);
                
                // Log as single combined message
                if (healthAmount > 0 || manaAmount > 0 || apAmount > 0) {
                    logFullResourceChange(characterName, healthAmount, manaAmount, apAmount, true);
                }
            }
        }
        setShowContextMenu(false);
    };

    // Handle full drain all (HP, mana, and AP, including temporary resources)
    const handleFullDrainAll = () => {
        if (!contextMenuMember) return;

        const memberId = contextMenuMember.id;
        const characterName = getCharacterName(memberId);

        if (memberId === 'current-player') {
            const currentHp = currentPlayerData.health?.current || 0;
            const tempHp = currentPlayerData.tempHealth || 0;
            const currentMp = currentPlayerData.mana?.current || 0;
            const tempMp = currentPlayerData.tempMana || 0;
            const currentAp = currentPlayerData.actionPoints?.current || 0;
            const tempAp = currentPlayerData.tempActionPoints || 0;
            const healthAmount = currentHp + tempHp;
            const manaAmount = currentMp + tempMp;
            const apAmount = currentAp + tempAp;
            
            // Drain all resources including temporary - skip individual logging
            applyResourceAdjustment(memberId, 'health', -healthAmount, false, true);
            applyResourceAdjustment(memberId, 'mana', -manaAmount, false, true);
            applyResourceAdjustment(memberId, 'actionPoints', -apAmount, false, true);
            
            // Log as single combined message
            if (healthAmount > 0 || manaAmount > 0 || apAmount > 0) {
                logFullResourceChange(characterName, healthAmount, manaAmount, apAmount, false);
            }
        } else {
            const member = partyMembers.find(m => m.id === memberId);
            if (member) {
                const currentHp = member.character?.health?.current || 0;
                const tempHp = member.character?.tempHealth || 0;
                const currentMp = member.character?.mana?.current || 0;
                const tempMp = member.character?.tempMana || 0;
                const currentAp = member.character?.actionPoints?.current || 0;
                const tempAp = member.character?.tempActionPoints || 0;
                const healthAmount = currentHp + tempHp;
                const manaAmount = currentMp + tempMp;
                const apAmount = currentAp + tempAp;
                
                // Drain all resources including temporary - skip individual logging
                applyResourceAdjustment(memberId, 'health', -healthAmount, false, true);
                applyResourceAdjustment(memberId, 'mana', -manaAmount, false, true);
                applyResourceAdjustment(memberId, 'actionPoints', -apAmount, false, true);
                
                // Log as single combined message
                if (healthAmount > 0 || manaAmount > 0 || apAmount > 0) {
                    logFullResourceChange(characterName, healthAmount, manaAmount, apAmount, false);
                }
            }
        }
        setShowContextMenu(false);
    };

    // Handle kill (set health to 0, including temporary HP)
    const handleKill = () => {
        if (!contextMenuMember) return;

        const memberId = contextMenuMember.id;

        if (memberId === 'current-player') {
            const currentHp = currentPlayerData.health?.current || 0;
            const tempHp = currentPlayerData.tempHealth || 0;
            // Drain both current and temporary HP
            handleResourceAdjust(memberId, 'health', -(currentHp + tempHp));
        } else {
            const member = partyMembers.find(m => m.id === memberId);
            if (member) {
                const currentHp = member.character?.health?.current || 0;
                const tempHp = member.character?.tempHealth || 0;
                // Drain both current and temporary HP
                handleResourceAdjust(memberId, 'health', -(currentHp + tempHp));
            }
        }
        setShowContextMenu(false);
    };

    // Handle drain mana (set mana to 0, including temporary mana)
    const handleDrainMana = () => {
        if (!contextMenuMember) return;

        const memberId = contextMenuMember.id;
        const characterName = getCharacterName(memberId);

        if (memberId === 'current-player') {
            const currentMp = currentPlayerData.mana?.current || 0;
            const tempMp = currentPlayerData.tempMana || 0;
            const drainAmount = currentMp + tempMp;
            // Drain both current and temporary mana
            handleResourceAdjust(memberId, 'mana', -drainAmount);
            if (drainAmount > 0) logResourceChange(characterName, 'mana', -drainAmount, false);
        } else {
            const member = partyMembers.find(m => m.id === memberId);
            if (member) {
                const currentMp = member.character?.mana?.current || 0;
                const tempMp = member.character?.tempMana || 0;
                const drainAmount = currentMp + tempMp;
                // Drain both current and temporary mana
                handleResourceAdjust(memberId, 'mana', -drainAmount);
                if (drainAmount > 0) logResourceChange(characterName, 'mana', -drainAmount, false);
            }
        }
        setShowContextMenu(false);
    };

    // Handle full restore mana (set mana to max)
    const handleFullRestoreMana = () => {
        if (!contextMenuMember) return;

        const memberId = contextMenuMember.id;
        const characterName = getCharacterName(memberId);

        if (memberId === 'current-player') {
            const maxMp = currentPlayerData.mana?.max || 0;
            const currentMp = currentPlayerData.mana?.current || 0;
            const restoreAmount = maxMp - currentMp;
            handleResourceAdjust(memberId, 'mana', restoreAmount);
            if (restoreAmount > 0) logResourceChange(characterName, 'mana', restoreAmount, true);
        } else {
            const member = partyMembers.find(m => m.id === memberId);
            if (member) {
                const maxMp = member.character?.mana?.max || 0;
                const currentMp = member.character?.mana?.current || 0;
                const restoreAmount = maxMp - currentMp;
                handleResourceAdjust(memberId, 'mana', restoreAmount);
                if (restoreAmount > 0) logResourceChange(characterName, 'mana', restoreAmount, true);
            }
        }
        setShowContextMenu(false);
    };

    // Handle drain AP (set action points to 0, including temporary AP)
    const handleDrainAP = () => {
        if (!contextMenuMember) return;

        const memberId = contextMenuMember.id;
        const characterName = getCharacterName(memberId);

        if (memberId === 'current-player') {
            const currentAp = currentPlayerData.actionPoints?.current || 0;
            const tempAp = currentPlayerData.tempActionPoints || 0;
            const drainAmount = currentAp + tempAp;
            // Drain both current and temporary AP
            handleResourceAdjust(memberId, 'actionPoints', -drainAmount);
            if (drainAmount > 0) logResourceChange(characterName, 'actionPoints', -drainAmount, false);
        } else {
            const member = partyMembers.find(m => m.id === memberId);
            if (member) {
                const currentAp = member.character?.actionPoints?.current || 0;
                const tempAp = member.character?.tempActionPoints || 0;
                const drainAmount = currentAp + tempAp;
                // Drain both current and temporary AP
                handleResourceAdjust(memberId, 'actionPoints', -drainAmount);
                if (drainAmount > 0) logResourceChange(characterName, 'actionPoints', -drainAmount, false);
            }
        }
        setShowContextMenu(false);
    };

    // Handle drag for party member frames with throttled updates for smooth performance
    const dragThrottleRef = useRef({});
    const handleMemberDrag = useCallback((member, data) => {
        const memberId = member.id;
        const now = Date.now();
        const lastUpdate = dragThrottleRef.current[memberId] || 0;
        
        // Throttle store updates to every 16ms (~60fps) for smooth dragging
        // The Draggable component handles visual updates, we just sync to store
        if (now - lastUpdate >= 16) {
            setMemberPosition(memberId, { x: data.x, y: data.y });
            dragThrottleRef.current[memberId] = now;
        }
    }, []); // Zustand store functions are stable, no deps needed

    // Removed: Test functions for buffs/debuffs

    // Removed: Auto-party creation - multiplayer handles party creation

    // Simple rule: Show HUDs for all room members
    // No complex leadership - room creator is GM, others are players
    const displayMembers = partyMembers.map(member => {
        // Update current player with live character data
        if (member.id === 'current-player') {
            // Debug logging for party HUD resource display
            if (currentPlayerData.name === 'YAD') {
                console.log('🔍 PartyHUD current player data:', {
                    characterName: currentPlayerData.name,
                    health: currentPlayerData.health,
                    mana: currentPlayerData.mana,
                    derivedStats: currentPlayerData.derivedStats
                });
            }

            return {
                ...member, // Preserve all existing member data including isGM
                name: currentPlayerData.name,
                status: currentUserPresence?.status || 'online', // Add status from presence
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
                    tempHealth: currentPlayerData.tempHealth,
                    tempMana: currentPlayerData.tempMana,
                    tempActionPoints: currentPlayerData.tempActionPoints,
                    classResource: currentPlayerData.classResource,
                    lore: currentPlayerData.lore,
                    tokenSettings: currentPlayerData.tokenSettings
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
                    let yOffset = 20;
                    for (let i = 0; i < index; i++) {
                        const prevMember = displayMembers[i];
                        const hasClassResource = prevMember.character?.class && prevMember.character?.classResource;
                        const isComplexClass = ['Minstrel', 'Chaos Weaver', 'Gambler', 'Exorcist', 'Lichborne', 'Plaguebringer', 'Toxicologist', 'False Prophet'].includes(prevMember.character?.class);

                        if (hasClassResource && isComplexClass) {
                            yOffset += 130; // Extra spacing for complex class resource displays
                        } else if (hasClassResource) {
                            yOffset += 115; // Standard spacing for class resource displays
                        } else {
                            yOffset += 100; // Standard spacing for basic frames
                        }
                    }

                    // Get stored position or use default
                    const storedPosition = getMemberPosition(member.id);
                    const initialPosition = storedPosition || { x: 20, y: yOffset };

                    return (
                        <Draggable
                            key={member.id}
                            handle={`.party-frame-${member.id} .party-member-frame`}
                            position={initialPosition}
                            nodeRef={memberNodeRef}
                            onDrag={(e, data) => handleMemberDrag(member, data)}
                            onStop={(e, data) => {
                                // Final position update on drag end
                                setMemberPosition(member.id, { x: data.x, y: data.y });
                            }}
                            enableUserSelectHack={true} // Enable user select hack to prevent text selection during drag
                            disabled={false} // Ensure dragging is always enabled
                            scale={1} // Fixed scale to prevent transform calculations
                            cancel=".resource-bar, .buff-icon, .debuff-icon, button, input, select, textarea"
                        >
                            <div ref={memberNodeRef} className={`party-frame-${member.id}`}>
                                <PartyMemberFrame
                                    member={member}
                                    isCurrentPlayer={member.name === currentPlayerData.name}
                                    onContextMenu={handleContextMenu}
                                    onResourceAdjust={handleResourceAdjust}
                                    onBuffContextMenu={handleBuffContextMenu}
                                    onClassResourceUpdate={handleClassResourceUpdate}
                                    onRegisterRefs={handleRegisterRefs}
                                />
                            </div>
                        </Draggable>
                    );
                })}
            </div>

            {/* Context Menu - Outside draggable containers */}
            {showContextMenu && (() => {
                const menuItems = [];

                // GM/Player View Toggle - Add at the top
                menuItems.push({
                    icon: <i className={`fas ${isGMMode ? 'fa-crown' : 'fa-user'}`}></i>,
                    label: isGMMode ? 'Switch to Player View' : 'Switch to GM View',
                    onClick: handleToggleGMView,
                    disabled: isInMultiplayer,
                    title: isInMultiplayer
                        ? 'GM mode determined by room creator status'
                        : (isGMMode ? 'Switch to Player View (fog blocks visibility)' : 'Switch to GM View (see through fog)')
                });

                menuItems.push({ type: 'separator' });

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

                // Health adjustment options - only show if GM mode
                if (isGMMode) {
                    menuItems.push({ type: 'separator' });

                    // Full Restore All button (restores HP, mana, and AP)
                    menuItems.push({
                        icon: <i className="fas fa-redo"></i>,
                        label: 'Full Restore All',
                        onClick: handleFullRestoreAll,
                        className: 'heal'
                    });

                    // Full Drain All button (drains HP, mana, and AP including temporary)
                    menuItems.push({
                        icon: <i className="fas fa-battery-empty"></i>,
                        label: 'Full Drain All',
                        onClick: handleFullDrainAll,
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
                                onClick: () => handleResourceAdjust(contextMenuMember.id, 'health', -5)
                            },
                            {
                                icon: <i className="fas fa-minus-circle"></i>,
                                label: 'Damage (10)',
                                onClick: () => handleResourceAdjust(contextMenuMember.id, 'health', -10)
                            },
                            {
                                icon: <i className="fas fa-edit"></i>,
                                label: 'Custom Damage',
                                onClick: () => handleCustomAmount('damage')
                            },
                            { type: 'separator' },
                            {
                                icon: <i className="fas fa-plus-circle"></i>,
                                label: 'Heal (5)',
                                onClick: () => handleResourceAdjust(contextMenuMember.id, 'health', 5)
                            },
                            {
                                icon: <i className="fas fa-plus-circle"></i>,
                                label: 'Heal (10)',
                                onClick: () => handleResourceAdjust(contextMenuMember.id, 'health', 10)
                            },
                            {
                                icon: <i className="fas fa-edit"></i>,
                                label: 'Custom Heal',
                                onClick: () => handleCustomAmount('heal')
                            },
                            { type: 'separator' },
                            {
                                icon: <i className="fas fa-heart"></i>,
                                label: 'Full Heal',
                                onClick: handleFullHeal,
                                className: 'heal'
                            },
                            {
                                icon: <i className="fas fa-skull"></i>,
                                label: 'Kill',
                                onClick: handleKill,
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
                                onClick: () => handleResourceAdjust(contextMenuMember.id, 'mana', -5)
                            },
                            {
                                icon: <i className="fas fa-minus-circle"></i>,
                                label: 'Drain (10)',
                                onClick: () => handleResourceAdjust(contextMenuMember.id, 'mana', -10)
                            },
                            {
                                icon: <i className="fas fa-edit"></i>,
                                label: 'Custom Drain',
                                onClick: () => handleCustomAmount('mana-damage')
                            },
                            { type: 'separator' },
                            {
                                icon: <i className="fas fa-plus-circle"></i>,
                                label: 'Restore (5)',
                                onClick: () => handleResourceAdjust(contextMenuMember.id, 'mana', 5)
                            },
                            {
                                icon: <i className="fas fa-plus-circle"></i>,
                                label: 'Restore (10)',
                                onClick: () => handleResourceAdjust(contextMenuMember.id, 'mana', 10)
                            },
                            {
                                icon: <i className="fas fa-edit"></i>,
                                label: 'Custom Restore',
                                onClick: () => handleCustomAmount('mana-heal')
                            },
                            { type: 'separator' },
                            {
                                icon: <i className="fas fa-magic"></i>,
                                label: 'Full Restore',
                                onClick: handleFullRestoreMana,
                                className: 'heal'
                            },
                            {
                                icon: <i className="fas fa-battery-empty"></i>,
                                label: 'Drain All',
                                onClick: handleDrainMana,
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
                                onClick: () => handleResourceAdjust(contextMenuMember.id, 'actionPoints', -1)
                            },
                            {
                                icon: <i className="fas fa-minus-circle"></i>,
                                label: 'Spend (2)',
                                onClick: () => handleResourceAdjust(contextMenuMember.id, 'actionPoints', -2)
                            },
                            {
                                icon: <i className="fas fa-minus-circle"></i>,
                                label: 'Spend (3)',
                                onClick: () => handleResourceAdjust(contextMenuMember.id, 'actionPoints', -3)
                            },
                            {
                                icon: <i className="fas fa-edit"></i>,
                                label: 'Custom Spend',
                                onClick: () => handleCustomAmount('ap-spend')
                            },
                            { type: 'separator' },
                            {
                                icon: <i className="fas fa-plus-circle"></i>,
                                label: 'Restore (1)',
                                onClick: () => handleResourceAdjust(contextMenuMember.id, 'actionPoints', 1)
                            },
                            {
                                icon: <i className="fas fa-plus-circle"></i>,
                                label: 'Restore (2)',
                                onClick: () => handleResourceAdjust(contextMenuMember.id, 'actionPoints', 2)
                            },
                            {
                                icon: <i className="fas fa-plus-circle"></i>,
                                label: 'Restore (3)',
                                onClick: () => handleResourceAdjust(contextMenuMember.id, 'actionPoints', 3)
                            },
                            {
                                icon: <i className="fas fa-edit"></i>,
                                label: 'Custom Restore',
                                onClick: () => handleCustomAmount('ap-restore')
                            },
                            { type: 'separator' },
                            {
                                icon: <i className="fas fa-bolt"></i>,
                                label: 'Full Restore',
                                onClick: () => {
                                    if (!contextMenuMember) return;
                                    const memberId = contextMenuMember.id;
                                    if (memberId === 'current-player') {
                                        const maxAp = currentPlayerData.actionPoints?.max || 0;
                                        const currentAp = currentPlayerData.actionPoints?.current || 0;
                                        handleResourceAdjust(memberId, 'actionPoints', maxAp - currentAp);
                                    } else {
                                        const member = partyMembers.find(m => m.id === memberId);
                                        if (member) {
                                            const maxAp = member.character?.actionPoints?.max || 0;
                                            const currentAp = member.character?.actionPoints?.current || 0;
                                            handleResourceAdjust(memberId, 'actionPoints', maxAp - currentAp);
                                        }
                                    }
                                    setShowContextMenu(false);
                                },
                                className: 'heal'
                            },
                            {
                                icon: <i className="fas fa-battery-empty"></i>,
                                label: 'Drain All',
                                onClick: handleDrainAP,
                                className: 'danger'
                            }
                        ]
                    });

                    // Experience submenu
                    menuItems.push({
                        icon: <i className="fas fa-star"></i>,
                        label: 'Experience',
                        submenu: [
                            {
                                icon: <i className="fas fa-plus-circle"></i>,
                                label: 'Award 50 XP',
                                onClick: () => handleAwardXP(contextMenuMember.id, 50)
                            },
                            {
                                icon: <i className="fas fa-plus-circle"></i>,
                                label: 'Award 100 XP',
                                onClick: () => handleAwardXP(contextMenuMember.id, 100)
                            },
                            {
                                icon: <i className="fas fa-plus-circle"></i>,
                                label: 'Award 250 XP',
                                onClick: () => handleAwardXP(contextMenuMember.id, 250)
                            },
                            {
                                icon: <i className="fas fa-plus-circle"></i>,
                                label: 'Award 500 XP',
                                onClick: () => handleAwardXP(contextMenuMember.id, 500)
                            },
                            { type: 'separator' },
                            {
                                icon: <i className="fas fa-minus-circle"></i>,
                                label: 'Remove 50 XP',
                                onClick: () => handleAwardXP(contextMenuMember.id, -50)
                            },
                            {
                                icon: <i className="fas fa-minus-circle"></i>,
                                label: 'Remove 100 XP',
                                onClick: () => handleAwardXP(contextMenuMember.id, -100)
                            },
                            {
                                icon: <i className="fas fa-minus-circle"></i>,
                                label: 'Remove 250 XP',
                                onClick: () => handleAwardXP(contextMenuMember.id, -250)
                            },
                            {
                                icon: <i className="fas fa-minus-circle"></i>,
                                label: 'Remove 500 XP',
                                onClick: () => handleAwardXP(contextMenuMember.id, -500)
                            },
                            { type: 'separator' },
                            {
                                icon: <i className="fas fa-edit"></i>,
                                label: 'Custom Amount',
                                onClick: () => handleCustomAmount('xp')
                            }
                        ]
                    });

                    // Level adjustment submenu
                    menuItems.push({
                        icon: <i className="fas fa-level-up-alt"></i>,
                        label: 'Level',
                        submenu: [
                            {
                                icon: <i className="fas fa-arrow-up"></i>,
                                label: 'Add 1 Level',
                                onClick: () => handleLevelAdjust(contextMenuMember.id, 1)
                            },
                            {
                                icon: <i className="fas fa-arrow-up"></i>,
                                label: 'Add 5 Levels',
                                onClick: () => handleLevelAdjust(contextMenuMember.id, 5)
                            },
                            { type: 'separator' },
                            {
                                icon: <i className="fas fa-arrow-down"></i>,
                                label: 'Remove 1 Level',
                                onClick: () => handleLevelAdjust(contextMenuMember.id, -1)
                            },
                            {
                                icon: <i className="fas fa-arrow-down"></i>,
                                label: 'Remove 5 Levels',
                                onClick: () => handleLevelAdjust(contextMenuMember.id, -5)
                            }
                        ]
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
                                                backgroundColor: hoveredMenuItem === index ? '#e8dcc0' : (item.className === 'danger' ? '#ffebee' : '#d4c4a8'),
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
                                                    backgroundColor: subItem.className === 'danger' ? '#ffebee' : '#d4c4a8',
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

            {/* Buff Context Menu - Outside draggable containers */}
            {showBuffContextMenu && (
                <div
                    className="context-menu-container"
                    style={{
                        position: 'fixed',
                        left: buffContextMenuPosition.x,
                        top: buffContextMenuPosition.y,
                        zIndex: 10000,
                        backgroundColor: '#f0e6d2',
                        border: '2px solid #a08c70',
                        borderRadius: '8px',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                        fontFamily: "'Bookman Old Style', 'Garamond', serif",
                        color: '#7a3b2e',
                        padding: '8px'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
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
                            backgroundColor: '#d4c4a8',
                            color: '#7a3b2e',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontFamily: "'Bookman Old Style', 'Garamond', serif",
                            width: '100%',
                            textAlign: 'left',
                            margin: '2px 0'
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDismissBuff();
                        }}
                    >
                        <i className="fas fa-times"></i>
                        <span>Dismiss Buff</span>
                    </button>
                </div>
            )}

            {/* Custom Amount Modal */}
            {showCustomAmountModal && (
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
                        setShowCustomAmountModal(false);
                        setCustomAmountType('');
                    }}
                >
                    <div
                        className="custom-amount-modal"
                        style={{
                            backgroundColor: '#f0e6d2',
                            border: '2px solid #a08c70',
                            borderRadius: '8px',
                            padding: '20px',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                            fontFamily: "'Bookman Old Style', 'Garamond', serif",
                            color: '#7a3b2e',
                            minWidth: '300px',
                            textAlign: 'center'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>
                            {customAmountType === 'damage' && 'Custom Damage Amount'}
                            {customAmountType === 'heal' && 'Custom Heal Amount'}
                            {customAmountType === 'mana-damage' && 'Custom Mana Drain Amount'}
                            {customAmountType === 'mana-heal' && 'Custom Mana Restore Amount'}
                            {customAmountType === 'ap-spend' && 'Custom Action Points Spend Amount'}
                            {customAmountType === 'ap-restore' && 'Custom Action Points Restore Amount'}
                            {customAmountType === 'xp' && 'Award Experience Points'}
                        </h3>
                        <input
                            type="number"
                            min={customAmountType === 'xp' ? undefined : "1"}
                            placeholder={customAmountType === 'xp' ? 'Enter amount (+ or -)...' : 'Enter amount...'}
                            style={{
                                width: '100%',
                                padding: '8px',
                                border: '1px solid #a08c70',
                                borderRadius: '4px',
                                fontSize: '14px',
                                marginBottom: '15px',
                                textAlign: 'center'
                            }}
                            autoFocus
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleCustomAmountSubmit(e.target.value);
                                } else if (e.key === 'Escape') {
                                    setShowCustomAmountModal(false);
                                    setCustomAmountType('');
                                }
                            }}
                        />
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button
                                style={{
                                    padding: '8px 16px',
                                    border: '1px solid #a08c70',
                                    borderRadius: '4px',
                                    backgroundColor: '#d4c4a8',
                                    color: '#7a3b2e',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                                onClick={(e) => {
                                    const input = e.target.parentElement.parentElement.querySelector('input');
                                    handleCustomAmountSubmit(input.value);
                                }}
                            >
                                Apply
                            </button>
                            <button
                                style={{
                                    padding: '8px 16px',
                                    border: '1px solid #a08c70',
                                    borderRadius: '4px',
                                    backgroundColor: '#e8dcc0',
                                    color: '#7a3b2e',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                                onClick={() => {
                                    setShowCustomAmountModal(false);
                                    setCustomAmountType('');
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Overheal Confirmation Modal */}
            {showOverhealModal && overhealData && (
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
                            textAlign: 'center'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>
                            Overheal Detected
                        </h3>
                        <p style={{ margin: '0 0 20px 0', fontSize: '14px' }}>
                            This would restore {overhealData.adjustment} {overhealData.resourceType === 'health' ? 'HP' : overhealData.resourceType === 'mana' ? 'Mana' : 'AP'}, 
                            but the current value is {overhealData.currentValue}/{overhealData.maxValue}.
                            <br />
                            <strong>{overhealData.overhealAmount}</strong> would exceed the maximum.
                        </p>
                        <p style={{ margin: '0 0 20px 0', fontSize: '13px', fontStyle: 'italic' }}>
                            Would you like to add the excess as temporary {overhealData.resourceType === 'health' ? 'HP' : overhealData.resourceType === 'mana' ? 'Mana' : 'AP'}?
                        </p>
                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                            <button
                                style={{
                                    padding: '8px 16px',
                                    border: '1px solid #a08c70',
                                    borderRadius: '4px',
                                    backgroundColor: '#d4c4a8',
                                    color: '#7a3b2e',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                                onClick={() => {
                                    applyResourceAdjustment(overhealData.memberId, overhealData.resourceType, overhealData.adjustment, true);
                                    setShowOverhealModal(false);
                                    setOverhealData(null);
                                }}
                            >
                                Add as Temporary
                            </button>
                            <button
                                style={{
                                    padding: '8px 16px',
                                    border: '1px solid #a08c70',
                                    borderRadius: '4px',
                                    backgroundColor: '#d4c4a8',
                                    color: '#7a3b2e',
                                    cursor: 'pointer',
                                    fontSize: '12px'
                                }}
                                onClick={() => {
                                    // Just cap at max, don't add temporary
                                    applyResourceAdjustment(overhealData.memberId, overhealData.resourceType, overhealData.maxValue - overhealData.currentValue, false);
                                    setShowOverhealModal(false);
                                    setOverhealData(null);
                                }}
                            >
                                Cap at Maximum
                            </button>
                            <button
                                style={{
                                    padding: '8px 16px',
                                    border: '1px solid #a08c70',
                                    borderRadius: '4px',
                                    backgroundColor: '#e8dcc0',
                                    color: '#7a3b2e',
                                    cursor: 'pointer',
                                    fontSize: '12px'
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
                </div>
            )}
        </>
    );
};

export default PartyHUD;
