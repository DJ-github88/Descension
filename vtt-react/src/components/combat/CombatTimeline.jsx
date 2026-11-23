import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import Draggable from 'react-draggable';
import { Resizable } from 'react-resizable';
import useCombatStore from '../../store/combatStore';
import useCreatureStore from '../../store/creatureStore';
import useCharacterTokenStore from '../../store/characterTokenStore';
import useGameStore from '../../store/gameStore';
import useSettingsStore from '../../store/settingsStore';
import { getCreatureTokenIconUrl, getIconUrl } from '../../utils/assetManager';
import { createPortal } from 'react-dom';
import TurnTimer from './TurnTimer';
import CombatConfigModal from './CombatConfigModal';
import CombatRosterControls from '../gm-tools/CombatRosterControls';
import useWindowManagerStore from '../../store/windowManagerStore';
import { useSharedConditionStore } from '../../services/sharedConditionService';
import { useSpellConsequenceStore } from '../../services/spellConsequenceService';
import { projectOngoingEffects } from '../../services/ongoingEffectsProjection';
import './CombatTimeline.css';

const EMPTY_LIST = [];

const CombatTimeline = () => {
    const {
        isInCombat,
        turnOrder,
        currentTurnIndex,
        round,
        effectLifecycle,
        retiredPeriodicTicks,
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

    const { creatures, creatureTokens = EMPTY_LIST } = useCreatureStore();
    const characterTokens = useCharacterTokenStore(state => state.characterTokens) || EMPTY_LIST;
    const isGMMode = useGameStore(state => state.isGMMode);
    const isInMultiplayer = useGameStore(state => state.isInMultiplayer);
    const roomId = useGameStore(state => state.multiplayerRoom?.id || null);
    const clockPhase = useSharedConditionStore(state => state.clockPhase);
    const sharedCombat = useSharedConditionStore(state => state.combat);
    const registryRevision = useSpellConsequenceStore(state => state.registryRevision);
    const windowScale = useSettingsStore(state => state.windowScale);

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
    const toggleRef = useRef(null);
    const [collapsed, setCollapsed] = useState(false);
    const [effectsExpanded, setEffectsExpanded] = useState(true);
    const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));
    const zIndex = useWindowManagerStore(s => s.windows.get('combat-timeline')?.zIndex || 1000);
    const collapse = useCallback(() => { setCollapsed(true); toggleRef.current?.focus(); }, []);
    useEffect(() => {
        if (!isInCombat) return;
        const manager = useWindowManagerStore.getState();
        manager.registerWindow('combat-timeline', 'window', collapse);
        return () => manager.unregisterWindow('combat-timeline');
    }, [isInCombat, collapse]);
    useEffect(() => {
        const resize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    // Auto-adjust timeline size only when combat starts or combatants change drastically
    useEffect(() => {
        if (!isInCombat || turnOrder.length === 0) return;

        // Calculate optimal width based on number of combatants
        const tokenWidth = 95; // Match new CSS width
        const tokenGap = 12; // Match new CSS gap
        const padding = 40; // Match new CSS padding

        // Calculate width to fit actual tokens (up to 8 before wrapping)
        const tokensToFit = Math.min(turnOrder.length, 8);
        const calculatedWidth = Math.max(
            400, // Minimum width
            Math.min(
                850, // Maximum width 
                (tokensToFit * tokenWidth) + ((tokensToFit - 1) * tokenGap) + padding
            )
        );

        // Only auto-resize IF we don't have a stored size yet or if it's the very first render
        if (!timelineSize.width || !timelineSize.height) {
            updateTimelineSize({
                width: calculatedWidth,
                height: 400
            });
        }
    }, [turnOrder.length, isInCombat, updateTimelineSize, timelineSize.width, timelineSize.height]);

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
            if (combatant.tokenIcon) return combatant.tokenIcon;
            const useCharacterStore = require('../../store/characterStore').default;
            const char = useCharacterStore.getState();
            return char.tokenSettings?.customIcon || char.lore?.characterImage || getIconUrl('Arcane/Abstract Rune', 'abilities');
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

    const ongoingEffects = useMemo(() => {
        if (!isInCombat) {
            return { clock: null, effects: [], dueTicks: [], cooldowns: [] };
        }
        const combatSnapshot = {
            isActive: true,
            turnOrder,
            currentTurnIndex,
            round,
            effectLifecycle: effectLifecycle ?? sharedCombat?.effectLifecycle ?? null,
            retiredPeriodicTicks: retiredPeriodicTicks ?? sharedCombat?.retiredPeriodicTicks ?? null
        };
        return projectOngoingEffects({
            combat: combatSnapshot,
            turnOrder,
            currentTurnIndex,
            round,
            isInCombat,
            isInMultiplayer,
            clockPhase,
            characterTokens,
            creatureTokens,
            isGMMode,
            roomId,
            registryRevision
        });
    }, [isInCombat, turnOrder, currentTurnIndex, round, effectLifecycle, retiredPeriodicTicks, sharedCombat, isInMultiplayer, clockPhase, characterTokens, creatureTokens, isGMMode, roomId, registryRevision]);

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
                        background: 'var(--adventure-page, #f8f5ee)',
                        color: 'var(--adventure-ink, #34251a)',
                        padding: '24px 32px',
                        border: '1px solid #9b835e',
                        borderRadius: '3px',
                        boxShadow: '0 10px 30px rgba(30, 21, 14, 0.45)',
                        zIndex: 10000,
                        textAlign: 'center',
                        fontFamily: 'Cinzel, Georgia, serif'
                    }}>
                        <h3 style={{ color: 'var(--adventure-seal, #663c32)', marginBottom: '10px', fontSize: '16px', fontWeight: '700' }}>Combat Notice</h3>
                        <p style={{ marginBottom: '18px', fontFamily: 'Crimson Text, Georgia, serif', fontSize: '14px', color: 'var(--adventure-muted, #68533e)' }}>Combat is active but no combatants were found.</p>
                        <button
                            onClick={endCombat}
                            style={{
                                padding: '8px 18px',
                                background: 'var(--adventure-seal, #663c32)',
                                color: '#fdfaf3',
                                border: '1px solid #4a2820',
                                borderRadius: '3px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontFamily: 'Cinzel, Georgia, serif',
                                fontWeight: '600',
                                letterSpacing: '0.5px'
                            }}
                        >
                            End Combat
                        </button>
                    </div>,
                    document.body
                )}
            </>
        );
    }

    // Use local size for rendering (synced with store, but updated locally during resize)
    const effectiveWidth = Math.min(localSize.width, viewport.width - 24);
    const effectiveHeight = collapsed ? 60 : Math.min(localSize.height, viewport.height - 24);
    const position = {
        x: Math.max(12, Math.min(timelinePosition.x, viewport.width - effectiveWidth - 12)),
        y: Math.max(12, Math.min(timelinePosition.y, viewport.height - effectiveHeight - 12))
    };

    return (
        <>
            {createPortal(
                <Draggable
                    handle=".timeline-header"
                    cancel="button, input, select, textarea"
                    position={position}
                    onStop={(e, data) => updateTimelinePosition({ x: data.x, y: data.y })}
                    nodeRef={nodeRef}
                    scale={1}
                >
                    <div
                        ref={nodeRef}
                        role="region"
                        aria-label="Combat tracker"
                        onPointerDown={() => useWindowManagerStore.getState().bringToFront('combat-timeline')}
                        onFocus={() => useWindowManagerStore.getState().bringToFront('combat-timeline')}
                        onKeyDown={e => { if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); collapse(); } }}
                        style={{
                            position: 'fixed',
                            left: 0,
                            top: 0,
                            zIndex,
                            transform: `scale(${windowScale})`,
                            transformOrigin: 'top left'
                        }}
                    >
                        <Resizable
                            width={effectiveWidth}
                            height={effectiveHeight}
                            onResizeStart={handleResizeStart}
                            onResize={handleResize}
                            onResizeStop={handleResizeStop}
                            minConstraints={[400, 150]}
                            maxConstraints={[1200, 1200]}
                            resizeHandles={['ne', 'nw', 'se', 'sw']}
                            transformScale={1}
                        >
                            <div
                                className={`combat-timeline-window-compact ${isResizing ? 'resizing' : ''}${collapsed ? ' timeline-collapsed' : ''}`}
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
                                        <button ref={toggleRef} type="button" className="timeline-button timeline-toggle"
                                            aria-label={collapsed ? 'Expand combat tracker' : 'Collapse combat tracker'}
                                            aria-expanded={!collapsed} onClick={() => setCollapsed(value => !value)}>
                                            {collapsed ? 'Expand' : 'Collapse'}
                                        </button>
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
                                                            e.target.src = getIconUrl('Arcane/Abstract Rune', 'abilities');
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
                                                    AP: {Number.isFinite(combatant.currentActionPoints) ? combatant.currentActionPoints : 0}/{Number.isFinite(combatant.maxActionPoints) ? combatant.maxActionPoints : 0}
                                                </div>
                                                {combatConfig.showTimers && (
                                                    <div className="token-timer">
                                                        <TurnTimer tokenId={combatant.tokenId} compact={true} />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                    {isGMMode && isInMultiplayer && (
                                        <div className="timeline-roster" style={{ flexBasis: '100%', width: '100%' }}>
                                            <CombatRosterControls />
                                        </div>
                                    )}
                                </div>

                                <section className="timeline-ongoing-effects" aria-label="Ongoing effects and cooldowns">
                                    <div className="timeline-effects-header">
                                        <button
                                            type="button"
                                            className="timeline-effects-toggle"
                                            aria-expanded={effectsExpanded}
                                            onClick={() => setEffectsExpanded(value => !value)}
                                        >
                                            <span>Ongoing Effects &amp; Cooldowns ({ongoingEffects.effects.length + ongoingEffects.dueTicks.length + ongoingEffects.cooldowns.length})</span>
                                            <span>{effectsExpanded ? '▾' : '▸'}</span>
                                        </button>
                                        <span className="timeline-effects-clock" role="status">
                                            {ongoingEffects.clock
                                                ? `Turn boundary ${ongoingEffects.clock.sequence}`
                                                : 'Timing unavailable'}
                                        </span>
                                    </div>
                                    {effectsExpanded && (
                                        <div className="timeline-effects-body">
                                            {ongoingEffects.effects.length === 0 && ongoingEffects.dueTicks.length === 0 && ongoingEffects.cooldowns.length === 0 ? (
                                                <p className="timeline-effects-empty">No active tracked effects or cooldowns.</p>
                                            ) : (
                                                <>
                                                    {ongoingEffects.effects.length > 0 && (
                                                        <ul className="timeline-effects-list" aria-label="Active effects">
                                                            {ongoingEffects.effects.map(item => (
                                                                <li key={item.id} className={`timeline-effect-item timeline-effect-${item.timingStatus}`}>
                                                                    <div className="timeline-effect-title">
                                                                        <strong>{item.effectName}</strong>
                                                                        <span className="timeline-effect-actor">{item.actorName}</span>
                                                                    </div>
                                                                    {item.timingStatus === 'scheduled' ? (
                                                                        <div className="timeline-effect-timing">
                                                                            <span>{item.remainingText}</span>
                                                                            <span>{item.nextOccurrenceText}</span>
                                                                            <span>{item.finalExpiryText}</span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="timeline-effect-timing">
                                                                            <span className="timeline-effect-badge">{item.timingLabel}</span>
                                                                            <span>{item.detailText}</span>
                                                                        </div>
                                                                    )}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                    {ongoingEffects.dueTicks.length > 0 && (
                                                        <ul className="timeline-effects-list" aria-label="Due periodic ticks">
                                                            {ongoingEffects.dueTicks.map(tick => (
                                                                <li key={tick.tickId} className={`timeline-effect-item timeline-effect-${tick.live ? 'tick' : 'unavailable'}`}>
                                                                    <div className="timeline-effect-title">
                                                                        <strong>{tick.label}</strong>
                                                                        <span className="timeline-effect-actor">{tick.actorName}</span>
                                                                    </div>
                                                                    <div className="timeline-effect-timing">
                                                                        <span>{tick.occurrenceText}</span>
                                                                        <span>{tick.boundaryText}</span>
                                                                        <span>{tick.statusText}</span>
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                    {ongoingEffects.cooldowns.length > 0 && (
                                                        <ul className="timeline-effects-list" aria-label="Active cooldowns">
                                                            {ongoingEffects.cooldowns.map(cd => (
                                                                <li key={cd.id} className={`timeline-effect-item timeline-effect-${cd.timingStatus}`}>
                                                                    <div className="timeline-effect-title">
                                                                        <strong>Cooldown: {cd.abilityName}</strong>
                                                                        <span className="timeline-effect-actor">{cd.actorName}</span>
                                                                    </div>
                                                                    {cd.timingStatus === 'scheduled' ? (
                                                                        <div className="timeline-effect-timing">
                                                                            <span>{cd.remainingText}</span>
                                                                            <span>{cd.nextOccurrenceText}</span>
                                                                            <span>{cd.releaseText}</span>
                                                                        </div>
                                                                    ) : (
                                                                        <div className="timeline-effect-timing">
                                                                            <span className="timeline-effect-badge">{cd.timingLabel}</span>
                                                                            <span>{cd.detailText}</span>
                                                                        </div>
                                                                    )}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    )}
                                </section>
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
                            Action Points: {Number.isFinite(tooltipData.currentActionPoints) ? tooltipData.currentActionPoints : 0}/{Number.isFinite(tooltipData.maxActionPoints) ? tooltipData.maxActionPoints : 0}
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
