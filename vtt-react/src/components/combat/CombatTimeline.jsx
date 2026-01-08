import React, { useState, useRef, useEffect, useCallback } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import useCombatStore from '../../store/combatStore';
import useCreatureStore from '../../store/creatureStore';
import useGameStore from '../../store/gameStore';
import { getCreatureTokenIconUrl, getIconUrl } from '../../utils/assetManager';
import { createPortal } from 'react-dom';
import TurnTimer from './TurnTimer';
import CombatConfigModal from './CombatConfigModal';
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
        reorderTurnOrder,
        combatConfig
    } = useCombatStore();

    const { creatures } = useCreatureStore();
    const windowScale = useGameStore(state => state.windowScale);

    const [showTooltip, setShowTooltip] = useState(false);
    const [tooltipData, setTooltipData] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
    const [draggedItem, setDraggedItem] = useState(null);
    const [isResizing, setIsResizing] = useState(false);
    const [showConfigModal, setShowConfigModal] = useState(false);
    // Local state for resize visual feedback - syncs with store on resize stop
    const [localSize, setLocalSize] = useState({ 
        width: timelineSize.width || 450, 
        height: timelineSize.height || 350 
    });
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

    // Sync localSize with store when it changes (e.g., from auto-adjust)
    useEffect(() => {
        if (!isResizing) {
            setLocalSize({
                width: timelineSize.width || 450,
                height: timelineSize.height || 350
            });
        }
    }, [timelineSize.width, timelineSize.height, isResizing]);

    // Handle resize start - disable transitions for smooth resizing
    const handleResizeStart = useCallback(() => {
        setIsResizing(true);
    }, []);

    // Handle resize - update LOCAL state for visual feedback, not store
    const handleResize = useCallback((event, { size }) => {
        setLocalSize(size);
    }, []);

    // Handle resize stop - update store only once when done
    const handleResizeStop = useCallback((event, { size }) => {
        setIsResizing(false);
        setLocalSize(size);
        // NOW update the store with final size
        updateTimelineSize(size);
    }, [updateTimelineSize]);

    const getCreatureIcon = (combatant) => {
        // Handle character tokens
        if (combatant.isCharacterToken) {
            const useCharacterStore = require('../../store/characterStore').default;
            const char = useCharacterStore.getState();
            return char.tokenSettings?.customIcon || char.lore?.characterImage || getIconUrl('Utility/Utility', 'abilities');
        }

        // First try to get the creature from the store
        const creature = creatures.find(c => c.id === combatant.creatureId);
        if (creature && creature.tokenIcon) {
            return getCreatureTokenIconUrl(creature.tokenIcon, creature.type);
        }

        // Fallback to combatant's tokenIcon
        if (combatant.tokenIcon) {
            return getCreatureTokenIconUrl(combatant.tokenIcon, combatant.type || creature?.type);
        }

        // Default fallback
        return getCreatureTokenIconUrl(null, null);
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

    // Use local size for rendering (synced with store, but updated locally during resize)
    const effectiveWidth = localSize.width;
    const effectiveHeight = localSize.height;

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
                            onResizeStart={handleResizeStart}
                            onResize={handleResize}
                            onResizeStop={handleResizeStop}
                            minConstraints={[350, 250]}
                            maxConstraints={[900, 700]}
                            resizeHandles={['ne', 'nw', 'se', 'sw']}
                            transformScale={windowScale}
                        >
                            <div
                                className={`combat-timeline-window-compact ${isResizing ? 'resizing' : ''}`}
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
                                    Next Turn
                                </button>
                                <button
                                    className="timeline-button end-combat"
                                    onClick={handleEndCombat}
                                    title="End Combat"
                                >
                                    End Combat
                                </button>
                                <button
                                    className="timeline-button config-button"
                                    onClick={() => setShowConfigModal(true)}
                                    title="Combat Configuration"
                                >
                                    <i className="fas fa-cog"></i>
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
                                                    e.target.onerror = null;
                                                    e.target.src = getIconUrl('Utility/Utility', 'abilities');
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
                                        {combatConfig.showTimers && (
                                            <div className="token-timer">
                                                <TurnTimer tokenId={combatant.tokenId} compact={true} />
                                            </div>
                                        )}
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

            {/* Config Modal */}
            <CombatConfigModal
                isOpen={showConfigModal}
                onClose={() => setShowConfigModal(false)}
            />
        </>
    );
};

export default CombatTimeline;
