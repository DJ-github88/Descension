import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/AugurResourceBar.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';

const AugurResourceBar = ({ classResource = {}, size = 'normal', config = {}, context = 'hud', isOwner = true, onClassResourceUpdate = null }) => {
    const benediction = classResource?.benediction ?? 0;
    const malediction = classResource?.malediction ?? 0;
    const maxBenediction = classResource?.maxBenediction ?? config?.resources?.benediction?.max ?? 10;
    const maxMalediction = classResource?.maxMalediction ?? config?.resources?.malediction?.max ?? 10;
    const omenDebt = classResource?.omenDebt ?? 0;
    const specialization = classResource?.specialization ?? 'auspex';

    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const barRef = useRef(null);
    const tooltipRef = useResourceBarTooltip(barRef, showTooltip);
    const controlsMenuRef = useRef(null);

    const { addCombatNotification } = useChatStore();
    const isGMMode = useGameStore(state => state.isGMMode);
    const currentPlayerName = useCharacterStore(state => state.name || 'Player');

    const getActorName = () => {
        const actorName = currentPlayerName || 'Player';
        return isGMMode ? `${actorName} (GM)` : actorName;
    };

    const logChange = (resourceName, amount, isPositive) => {
        const absAmount = Math.abs(amount);
        const actorName = getActorName();
        const characterName = currentPlayerName || 'Character';
        const verb = isPositive ? 'gained' : 'spent';
        addCombatNotification({
            type: 'combat_resource',
            attacker: actorName,
            target: characterName,
            amount: absAmount,
            resourceType: 'classResource',
            isPositive,
            customMessage: `${characterName} ${verb} ${absAmount} ${resourceName}`
        });
    };

    useEffect(() => {
        if (!showControls) return;
        const handleClickOutside = (event) => {
            const isInsideMenu = controlsMenuRef.current?.contains(event.target);
            const isInsideBar = barRef.current?.contains(event.target);
            if (!isInsideMenu && !isInsideBar) setShowControls(false);
        };
        const timeoutId = setTimeout(() => document.addEventListener('mousedown', handleClickOutside), 0);
        return () => { clearTimeout(timeoutId); document.removeEventListener('mousedown', handleClickOutside); };
    }, [showControls]);

    const specConfigs = {
        auspex: { name: 'Auspex', benMax: 10, malMax: 10, icon: 'fa-eye', desc: 'Balanced omen reader' },
        harbinger: { name: 'Harbinger', benMax: 5, malMax: 15, icon: 'fa-cloud-bolt', desc: 'Dark portents focus' },
        hierophant: { name: 'Hierophant', benMax: 15, malMax: 5, icon: 'fa-sun', desc: 'Divine blessings focus' }
    };

    const currentSpec = specConfigs[specialization] || specConfigs.auspex;

    const handleBenedictionChange = (delta) => {
        const newVal = Math.max(0, Math.min(maxBenediction, benediction + delta));
        const actual = Math.abs(newVal - benediction);
        if (actual > 0) logChange('Benediction', actual, delta > 0);
        if (onClassResourceUpdate) onClassResourceUpdate('benediction', newVal);
    };

    const handleMaledictionChange = (delta) => {
        const newVal = Math.max(0, Math.min(maxMalediction, malediction + delta));
        const actual = Math.abs(newVal - malediction);
        if (actual > 0) logChange('Malediction', actual, delta > 0);
        if (onClassResourceUpdate) onClassResourceUpdate('malediction', newVal);
    };

    const handleBarMouseEnter = (e) => {
        setShowTooltip(true);
    };

    const handleBarMouseLeave = (e) => {
        setShowTooltip(false);
    };

    useEffect(() => {
        if (!showTooltip || !tooltipRef.current || !barRef.current) return;

        const updatePosition = () => {
            const tooltip = tooltipRef.current;
            const bar = barRef.current;
            if (!tooltip || !bar) return;

            tooltip.style.opacity = '0';
            tooltip.style.position = 'fixed';

            const barRect = bar.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();

            if (barRect.width === 0 && barRect.height === 0 && barRect.left === 0 && barRect.top === 0) {
                requestAnimationFrame(updatePosition);
                return;
            }

            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const margin = 8;

            let hudContainer = bar.closest('.party-hud, .party-member-frame, .character-portrait-hud');
            let hudBottom = barRect.bottom;

            if (hudContainer) {
                const hudRect = hudContainer.getBoundingClientRect();
                hudBottom = hudRect.bottom;
            }

            const tooltipWidth = tooltipRect.width > 0 ? tooltipRect.width : 300;
            const tooltipHeight = tooltipRect.height > 0 ? tooltipRect.height : 200;

            let left = barRect.left + (barRect.width / 2) - (tooltipWidth / 2);
            let top = hudBottom + margin;

            if (tooltipRect.width === 0 || tooltipRect.height === 0) {
                // Apply fallback positioning so it doesn't default to the top-left of the viewport,
                // but keep it hidden (opacity 0) while waiting for layout dimensions to resolve.
                tooltip.style.left = `${left}px`;
                tooltip.style.top = `${top}px`;
                tooltip.style.opacity = '0';
                requestAnimationFrame(updatePosition);
                return;
            }

            if (left < margin) left = margin;
            if (left + tooltipWidth > viewportWidth - margin) {
                left = viewportWidth - tooltipWidth - margin;
            }

            if (top + tooltipHeight > viewportHeight - margin) {
                if (hudContainer) {
                    const hudRect = hudContainer.getBoundingClientRect();
                    top = hudRect.top - tooltipHeight - margin;
                } else {
                    top = barRect.top - tooltipHeight - margin;
                }
                if (top < margin) top = margin;
            }

            tooltip.style.left = `${left}px`;
            tooltip.style.top = `${top}px`;
            tooltip.style.transform = 'none';
            tooltip.style.zIndex = '2147483647';
            tooltip.style.opacity = '1';
        };

        updatePosition();
        requestAnimationFrame(() => requestAnimationFrame(updatePosition));
        const timeoutId = setTimeout(updatePosition, 50);

        return () => {
            clearTimeout(timeoutId);
            if (tooltipRef.current) tooltipRef.current.style.opacity = '0';
        };
    }, [showTooltip, benediction, malediction, specialization]);

    return (
        <div className="augur-resource-wrapper">
            <div
                ref={barRef}
                className={`augur-omen-bar ${size} ${isOwner ? 'clickable' : ''}`}
                onMouseEnter={handleBarMouseEnter}
                onMouseLeave={handleBarMouseLeave}
                onClick={(e) => {
                    e.stopPropagation();
                    if (isOwner) setShowControls(!showControls);
                }}
            >
                <div className="augur-bar-row single-bar">
                    <div className="augur-track combined-track">
                        {/* Left side: Malediction (fills right-to-left from center) */}
                        <div className="malediction-half" style={{ display: 'flex', flexDirection: 'row-reverse', flex: maxMalediction, gap: '2px' }}>
                            {Array.from({ length: maxMalediction }, (_, i) => (
                                <div key={`mal-${i}`} className={`augur-segment mal-segment ${i < malediction ? 'filled' : ''}`} />
                            ))}
                        </div>
                        
                        {/* Center divider */}
                        <div className="center-divider"></div>
                        
                        {/* Right side: Benediction (fills left-to-right from center) */}
                        <div className="benediction-half" style={{ display: 'flex', flexDirection: 'row', flex: maxBenediction, gap: '2px' }}>
                            {Array.from({ length: maxBenediction }, (_, i) => (
                                <div key={`ben-${i}`} className={`augur-segment ben-segment ${i < benediction ? 'filled' : ''}`} />
                            ))}
                        </div>
                        
                        <span className="augur-bar-value mal-value">{malediction}/{maxMalediction}</span>
                        <span className="augur-bar-value ben-value">{benediction}/{maxBenediction}</span>
                    </div>
                </div>

                {omenDebt < 0 && (
                    <div className="augur-debt-badge">
                        <i className="fas fa-exclamation-triangle"></i>
                        <span>{omenDebt}</span>
                    </div>
                )}
            </div>

            {showTooltip && ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}>
                    <div className="tooltip-header">
                        <i className="fas fa-eye" style={{ color: '#8B5A8B' }}></i>
                        Omen Resources
                    </div>

                    <div className="tooltip-section">
                        <div className="tooltip-label">Benediction (Radiant Omen)</div>
                        <div style={{ fontSize: '0.85rem', color: '#B8860B', fontWeight: 600 }}>{benediction} / {maxBenediction}</div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(58,42,26,0.7)' }}>Spend to force misses, ward allies, and preempt incoming strikes.</div>
                    </div>

                    <div className="tooltip-divider"></div>

                    <div className="tooltip-section">
                        <div className="tooltip-label">Malediction (Dark Omen)</div>
                        <div style={{ fontSize: '0.85rem', color: '#8B5A8B', fontWeight: 600 }}>{malediction} / {maxMalediction}</div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(58,42,26,0.7)' }}>Spend to cripple, curse, and rot your enemies.</div>
                    </div>

                    <div className="tooltip-divider"></div>

                    <div className="tooltip-section">
                        <div className="tooltip-label">How Omens Are Generated</div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(58,42,26,0.85)', lineHeight: 1.4 }}>
                            Every d20 rolled within 60 ft (yours, an ally's, or an enemy's) generates an Omen:
                            <strong> even results → Benediction</strong>, <strong>odd results → Malediction</strong>.
                            With no bleeding targets or corpses available, you must <strong>Self-Mutilate</strong> (1d6 slashing + Bleed) to generate either.
                        </div>
                    </div>

                    {omenDebt < 0 && (
                        <>
                            <div className="tooltip-divider"></div>
                            <div className="tooltip-section">
                                <div className="tooltip-label" style={{ color: '#B22222' }}>Omen Debt (Flesh Tax)</div>
                                <div style={{ fontSize: '0.85rem', color: '#B22222', fontWeight: 600 }}>{omenDebt}</div>
                                <div style={{ fontSize: '0.8rem', color: 'rgba(58,42,26,0.7)' }}>Unused points at long rest become permanent Debt: -1 to all saves per point (cap -10).</div>
                            </div>
                        </>
                    )}
                </div>,
                document.body
            )}

            {showControls && ReactDOM.createPortal(
                <div
                    ref={controlsMenuRef}
                    className="unified-context-menu compact augur-menu-container"
                    onMouseEnter={() => setShowTooltip(false)}
                    onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                    onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                    style={{
                        position: 'fixed',
                        top: barRef.current ? barRef.current.getBoundingClientRect().bottom + 8 : '50%',
                        left: barRef.current ? barRef.current.getBoundingClientRect().left : '50%',
                        transform: barRef.current ? 'none' : 'translate(-50%, -50%)',
                        zIndex: 100000
                    }}
                >
                    <div className="context-menu-main">
                        <div className="context-menu-section-header">
                            <i className={`fas ${currentSpec.icon}`} style={{ marginRight: '8px', color: '#8b7355' }}></i>
                            Omen Controls
                        </div>

                        {/* Resource Controls */}
                        <div className="context-menu-section">
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                {/* Benediction Column */}
                                <div>
                                    <div className="context-menu-section-title" style={{ color: '#DAA520', textAlign: 'center' }}>Benediction</div>
                                    <div style={{ fontSize: '12px', fontWeight: '700', textAlign: 'center', marginBottom: '6px' }}>{benediction}/{maxBenediction}</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                                        <button className="context-menu-button ben" onClick={() => handleBenedictionChange(1)} title="Add 1">
                                            <i className="fas fa-plus"></i>
                                        </button>
                                        <button className="context-menu-button ben" onClick={() => handleBenedictionChange(-1)} title="Spend 1">
                                            <i className="fas fa-minus"></i>
                                        </button>
                                    </div>
                                    <button className="context-menu-button" style={{ marginTop: '4px', justifyContent: 'center' }} onClick={() => { if (onClassResourceUpdate) onClassResourceUpdate('benediction', 0); }}>
                                        Reset
                                    </button>
                                </div>

                                {/* Malediction Column */}
                                <div>
                                    <div className="context-menu-section-title" style={{ color: '#B07AB0', textAlign: 'center' }}>Malediction</div>
                                    <div style={{ fontSize: '12px', fontWeight: '700', textAlign: 'center', marginBottom: '6px' }}>{malediction}/{maxMalediction}</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                                        <button className="context-menu-button mal" onClick={() => handleMaledictionChange(1)} title="Add 1">
                                            <i className="fas fa-plus"></i>
                                        </button>
                                        <button className="context-menu-button mal" onClick={() => handleMaledictionChange(-1)} title="Spend 1">
                                            <i className="fas fa-minus"></i>
                                        </button>
                                    </div>
                                    <button className="context-menu-button" style={{ marginTop: '4px', justifyContent: 'center' }} onClick={() => { if (onClassResourceUpdate) onClassResourceUpdate('malediction', 0); }}>
                                        Reset
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="context-menu-separator" style={{ margin: '8px 0' }}></div>

                        <button className="context-menu-button danger" onClick={() => setShowControls(false)} style={{ width: '100%', padding: '6px', justifyContent: 'center', marginTop: '4px' }}>
                            <i className="fas fa-times"></i> Close
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default AugurResourceBar;
