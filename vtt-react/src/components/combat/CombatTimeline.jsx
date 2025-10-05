import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import useCombatStore from '../../store/combatStore';
import useCreatureStore from '../../store/creatureStore';
import { createPortal } from 'react-dom';
import TurnTimer from './TurnTimer';
import '../../styles/combat-system.css';

const CombatTimeline = () => {
    const {
        isInCombat,
        turnOrder,
        currentTurnIndex,
        round,
        nextTurn,
        endCombat,
        timelinePosition,
        timelineSize,
        updateTimelinePosition,
        updateTimelineSize,
        resetTimelinePosition,
        reorderTurnOrder
    } = useCombatStore();

    const { creatures } = useCreatureStore();

    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipData, setTooltipData] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [draggedItem, setDraggedItem] = useState(null);
    const nodeRef = useRef(null);

    // Auto-adjust timeline width when number of combatants changes
    useEffect(() => {
        if (!isInCombat || turnOrder.length === 0) return;

        // Calculate optimal width based on number of combatants
        const tokenWidth = 85; // Match CSS max-width
        const tokenGap = 8; // Match CSS gap
        const padding = 24; // Match CSS padding (12px * 2)

        // Calculate width to fit actual tokens (up to 6 before wrapping)
        const tokensToShow = Math.min(turnOrder.length, 6);
        const contentWidth = (tokensToShow * tokenWidth) + ((tokensToShow - 1) * tokenGap) + padding;

        // Use content width with reasonable min/max bounds
        const calculatedWidth = Math.max(
            320, // Minimum width (fits ~3 tokens comfortably)
            Math.min(
                650, // Maximum width (fits ~6 tokens)
                contentWidth
            )
        );

        console.log('CombatTimeline: Auto-adjusting width', {
            numCombatants: turnOrder.length,
            tokensToShow,
            contentWidth,
            calculatedWidth,
            currentWidth: timelineSize.width
        });

        // Always update to the calculated width when combatant count changes
        // Use taller default height to accommodate token content
        updateTimelineSize({
            width: calculatedWidth,
            height: timelineSize.height || 350
        });
    }, [turnOrder.length, isInCombat, updateTimelineSize]);

    const handleMouseEnter = (event, combatant) => {
        const rect = event.currentTarget.getBoundingClientRect();
        // Position tooltip above the token, accounting for page scroll
        setTooltipPosition({
            x: rect.left + rect.width / 2,
            y: rect.top + window.scrollY - 10
        });
        setTooltipData(combatant);
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        setShowTooltip(false);
        setTooltipData(null);
    };

    const handleNextTurn = () => {
        nextTurn();
    };

    const handleEndCombat = () => {
        endCombat();
    };

    const handleResize = (event, { size }) => {
        updateTimelineSize(size);
    };

    const getCreatureIcon = (combatant) => {
        // Handle character tokens
        if (combatant.isCharacterToken) {
            const useCharacterStore = require('../../store/characterStore').default;
            const char = useCharacterStore.getState();
            return char.tokenSettings?.customIcon || char.lore?.characterImage || 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
        }

        // First try to get the creature from the store
        const creature = creatures.find(c => c.id === combatant.creatureId);
        if (creature && creature.tokenIcon) {
            return `https://wow.zamimg.com/images/wow/icons/medium/${creature.tokenIcon}.jpg`;
        }

        // Fallback to combatant's tokenIcon
        if (combatant.tokenIcon) {
            return `https://wow.zamimg.com/images/wow/icons/medium/${combatant.tokenIcon}.jpg`;
        }

        // Default fallback
        return 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
    };

    // Handle drag and drop for reordering
    const handleDragStart = (e, combatant, index) => {
        setDraggedItem({ combatant, index });
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, targetIndex) => {
        e.preventDefault();
        if (draggedItem && draggedItem.index !== targetIndex) {
            // Reorder the turn order
            const newTurnOrder = [...turnOrder];
            const [removed] = newTurnOrder.splice(draggedItem.index, 1);
            newTurnOrder.splice(targetIndex, 0, removed);

            // Update the store if reorderTurnOrder function exists
            if (reorderTurnOrder) {
                reorderTurnOrder(newTurnOrder);
            }
        }
        setDraggedItem(null);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
    };

    // Don't render if not in combat
    if (!isInCombat) {
        return null;
    }

    // If in combat but no turn order, show emergency controls
    if (turnOrder.length === 0) {
        console.log('CombatTimeline: In combat but no turn order - showing emergency controls');
        return (
            <>
                {createPortal(
                    <div style={{
                        position: 'fixed',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        background: 'rgba(0, 0, 0, 0.9)',
                        color: 'white',
                        padding: '20px',
                        borderRadius: '8px',
                        zIndex: 10000,
                        textAlign: 'center'
                    }}>
                        <h3 style={{ color: '#ff4444', marginBottom: '15px' }}>Combat Error</h3>
                        <p style={{ marginBottom: '15px' }}>Combat is active but no combatants found!</p>
                        <button
                            onClick={endCombat}
                            style={{
                                padding: '10px 20px',
                                background: '#ff4444',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            Emergency End Combat
                        </button>
                    </div>,
                    document.body
                )}
            </>
        );
    }

    console.log('CombatTimeline: Rendering timeline with position:', timelinePosition);
    console.log('CombatTimeline: Window dimensions:', { width: window.innerWidth, height: window.innerHeight });
    console.log('CombatTimeline: Timeline size:', timelineSize);

    // Use timeline size from store (updated by useEffect)
    const effectiveWidth = timelineSize.width || 450;
    const effectiveHeight = timelineSize.height || 350;

    return (
        <>
            {createPortal(
                <Draggable
                    handle=".timeline-header"
                    position={timelinePosition}
                    onStop={(e, data) => updateTimelinePosition({ x: data.x, y: data.y })}
                    nodeRef={nodeRef}
                >
                    <div
                        ref={nodeRef}
                        style={{
                            position: 'fixed',
                            left: 0,
                            top: 0,
                            zIndex: 9500
                        }}
                    >
                        <Resizable
                            width={effectiveWidth}
                            height={effectiveHeight}
                            onResize={handleResize}
                            minConstraints={[350, 250]}
                            maxConstraints={[900, 700]}
                            resizeHandles={['ne', 'nw', 'se', 'sw']}
                        >
                            <div
                                className="combat-timeline-window-compact"
                                style={{
                                    width: effectiveWidth,
                                    height: effectiveHeight
                                }}
                            >
                        <div className="timeline-header">
                            <div className="timeline-title">
                                Round {round}
                            </div>
                            <div className="timeline-controls">
                                <button
                                    className="timeline-button next-turn"
                                    onClick={handleNextTurn}
                                    title="Next Turn"
                                >
                                    <img
                                        src="https://wow.zamimg.com/images/wow/icons/medium/ability_warrior_charge.jpg"
                                        alt="Next Turn"
                                        onError={(e) => {
                                            e.target.src = "https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg";
                                        }}
                                    />
                                    Next Turn
                                </button>
                                <button
                                    className="timeline-button end-combat"
                                    onClick={handleEndCombat}
                                    title="End Combat"
                                >
                                    <img
                                        src="https://wow.zamimg.com/images/wow/icons/medium/ability_warrior_revenge.jpg"
                                        alt="End Combat"
                                        onError={(e) => {
                                            e.target.src = "https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg";
                                        }}
                                    />
                                    End Combat
                                </button>
                                <button
                                    className="timeline-button"
                                    onClick={resetTimelinePosition}
                                    title="Reset Position"
                                    style={{ fontSize: '10px', padding: '4px 6px' }}
                                >
                                    Reset Pos
                                </button>
                            </div>
                        </div>

                        <div className="timeline-combatants">
                            {turnOrder.map((combatant, index) => {
                                const isCurrentTurn = index === currentTurnIndex;
                                const isPastTurn = index < currentTurnIndex;

                                return (
                                    <div
                                        key={`${combatant.tokenId}-${index}`}
                                        className={`timeline-token ${isCurrentTurn ? 'current-turn' : ''} ${isPastTurn ? 'past-turn' : ''}`}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, combatant, index)}
                                        onDragOver={handleDragOver}
                                        onDrop={(e) => handleDrop(e, index)}
                                        onDragEnd={handleDragEnd}
                                        onMouseEnter={(e) => handleMouseEnter(e, combatant)}
                                        onMouseLeave={handleMouseLeave}
                                    >
                                        <div className="token-portrait">
                                            <img
                                                src={getCreatureIcon(combatant)}
                                                alt={combatant.name}
                                                className="token-icon"
                                                onError={(e) => {
                                                    e.target.src = "https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg";
                                                }}
                                            />
                                            {isCurrentTurn && (
                                                <div className="current-turn-glow"></div>
                                            )}
                                        </div>
                                        <div className="token-initiative">
                                            Init: {combatant.initiative}
                                        </div>
                                        <div className="token-ap">
                                            AP: {combatant.currentActionPoints}/{combatant.maxActionPoints}
                                        </div>
                                        <div className="token-timer">
                                            <TurnTimer tokenId={combatant.tokenId} compact={true} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                            </div>
                        </Resizable>
                    </div>
                </Draggable>,
                document.body
            )}

            {/* Tooltip */}
            {showTooltip && tooltipData && createPortal(
                <div
                    className="combat-tooltip"
                    style={{
                        position: 'absolute',
                        left: tooltipPosition.x,
                        top: tooltipPosition.y,
                        transform: 'translateX(-50%) translateY(-100%)',
                        zIndex: 10000,
                        pointerEvents: 'none'
                    }}
                >
                    <div className="tooltip-content">
                        <div className="tooltip-name">{tooltipData.name}</div>
                        <div className="tooltip-initiative">
                            <div>Initiative: {tooltipData.initiative}</div>
                            <div className="initiative-breakdown">
                                (d20: {tooltipData.d20Roll} + Mod: {tooltipData.initiativeMod || tooltipData.agilityMod})
                            </div>
                        </div>
                        <div className="tooltip-ap">
                            Action Points: {tooltipData.currentActionPoints}/{tooltipData.maxActionPoints}
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default CombatTimeline;
