import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/DoomsayerResourceBar.css';

const DoomsayerResourceBar = ({ classResource = {}, size = 'normal', config = {}, context = 'hud', isOwner = true, onClassResourceUpdate = null }) => {
    const havoc = classResource?.current ?? classResource?.havoc ?? 0;
    const maxHavoc = classResource?.max ?? config?.resources?.havoc?.max ?? 15;
    const activeProphecies = classResource?.activeProphecies ?? 0;
    const specialization = classResource?.specialization ?? 'requiem';

    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const barRef = useRef(null);
    const tooltipRef = useRef(null);
    const controlsMenuRef = useRef(null);

    const { addCombatNotification } = useChatStore();
    const isGMMode = useGameStore(state => state.isGMMode);
    const currentPlayerName = useCharacterStore(state => state.name || 'Player');

    const getActorName = () => {
        const actorName = currentPlayerName || 'Player';
        return isGMMode ? `${actorName} (GM)` : actorName;
    };

    const logChange = (amount, isPositive) => {
        const absAmount = Math.abs(amount);
        const actorName = getActorName();
        const characterName = currentPlayerName || 'Character';
        const verb = isPositive ? 'earned' : 'spent';
        addCombatNotification({
            type: 'combat_resource',
            attacker: actorName,
            target: characterName,
            amount: absAmount,
            resourceType: 'classResource',
            isPositive,
            customMessage: `${characterName} ${verb} ${absAmount} Havoc`
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
        requiem: { name: 'Requiem', icon: 'fa-skull', desc: 'Single-target death prophecies' },
        endbringer: { name: 'Endbringer', icon: 'fa-bolt', desc: 'Escalating doom auras' },
        cataclysm: { name: 'Cataclysm', icon: 'fa-explosion', desc: 'Area chaos and destruction' }
    };

    const currentSpec = specConfigs[specialization] || specConfigs.requiem;

    const handleHavocChange = (delta) => {
        const newVal = Math.max(0, Math.min(maxHavoc, havoc + delta));
        const actual = Math.abs(newVal - havoc);
        if (actual > 0) logChange(actual, delta > 0);
        if (onClassResourceUpdate) onClassResourceUpdate('current', newVal);
    };

    const getIntensityClass = (index) => {
        const ratio = index / maxHavoc;
        if (ratio >= 0.9) return 'max';
        if (ratio >= 0.6) return 'high';
        if (ratio >= 0.3) return 'mid';
        return 'low';
    };

    const handleBarMouseEnter = () => {
        setShowTooltip(true);
    };

    const handleBarMouseLeave = () => {
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

            if (tooltipRect.width === 0 || tooltipRect.height === 0) {
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

            let left = barRect.left + (barRect.width / 2) - (tooltipRect.width / 2);
            let top = hudBottom + margin;

            if (left < margin) left = margin;
            if (left + tooltipRect.width > viewportWidth - margin) {
                left = viewportWidth - tooltipRect.width - margin;
            }

            if (top + tooltipRect.height > viewportHeight - margin) {
                if (hudContainer) {
                    const hudRect = hudContainer.getBoundingClientRect();
                    top = hudRect.top - tooltipRect.height - margin;
                } else {
                    top = barRect.top - tooltipRect.height - margin;
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
            if (tooltipRef.current) tooltipRef.current.style.opacity = '';
        };
    }, [showTooltip, havoc, specialization]);

    return (
        <div className="doomsayer-resource-wrapper">
            <div
                ref={barRef}
                className={`doomsayer-havoc-bar ${size} ${isOwner ? 'clickable' : ''}`}
                onMouseEnter={handleBarMouseEnter}
                onMouseLeave={handleBarMouseLeave}
                onClick={(e) => {
                    e.stopPropagation();
                    if (isOwner) setShowControls(!showControls);
                }}
            >
                <div className="doomsayer-track">
                    {Array.from({ length: maxHavoc }, (_, i) => (
                        <div
                            key={i}
                            className={`doomsayer-segment ${i < havoc ? `filled ${getIntensityClass(i)}` : ''}`}
                        />
                    ))}
                    <span className="doomsayer-bar-value">{havoc}/{maxHavoc}</span>
                </div>

                {activeProphecies > 0 && (
                    <div className="doomsayer-prophecy-badge">
                        <i className="fas fa-dice"></i>
                        <span>{activeProphecies}</span>
                    </div>
                )}
            </div>

            {showTooltip && ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip" style={{ opacity: 0 }}>
                    <div className="tooltip-header">
                        <i className={`fas ${currentSpec.icon}`} style={{ color: '#CC3300' }}></i>
                        Havoc — {currentSpec.name}
                    </div>

                    <div className="tooltip-section">
                        <div style={{ fontSize: '0.9rem', marginBottom: '4px' }}>
                            <strong>Current Havoc:</strong> <span style={{ color: '#CC3300' }}>{havoc}</span> / {maxHavoc}
                        </div>
                        {havoc >= 10 && (
                            <div style={{ fontSize: '0.8rem', color: '#B22222', fontWeight: 600 }}>
                                Supreme abilities unlocked!
                            </div>
                        )}
                    </div>

                    <div className="tooltip-divider"></div>

                    <div className="tooltip-section">
                        <div className="tooltip-label">Specialization</div>
                        <div style={{ fontSize: '0.8rem', color: 'rgba(58,42,26,0.6)' }}>
                            {currentSpec.desc}
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {showControls && ReactDOM.createPortal(
                <div
                    ref={controlsMenuRef}
                    className="unified-context-menu compact"
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
                            <i className={`fas ${currentSpec.icon}`} style={{ marginRight: '8px', color: '#CC3300' }}></i>
                            Prophetic Havoc
                        </div>

                        {/* Havoc Adjustment */}
                        <div className="context-menu-section">
                            <div className="context-menu-section-title" style={{ textAlign: 'center' }}>Havoc: {havoc}/{maxHavoc}</div>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                <button className="context-menu-button" onClick={() => handleHavocChange(-5)} title="Minus 5">
                                    <i className="fas fa-minus"></i> 5
                                </button>
                                <button className="context-menu-button" onClick={() => handleHavocChange(-1)} title="Minus 1">
                                    <i className="fas fa-minus"></i> 1
                                </button>
                                <button className="context-menu-button" onClick={() => handleHavocChange(1)} title="Plus 1">
                                    <i className="fas fa-plus"></i> 1
                                </button>
                                <button className="context-menu-button" onClick={() => handleHavocChange(5)} title="Plus 5">
                                    <i className="fas fa-plus"></i> 5
                                </button>
                            </div>

                            <div className="context-menu-section-title" style={{ fontSize: '9px', marginBottom: '4px' }}>Quick Sets</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '2px' }}>
                                <button className="context-menu-button" style={{ padding: '4px 0', justifyContent: 'center' }} onClick={() => handleHavocChange(-maxHavoc)}>0</button>
                                <button className="context-menu-button" style={{ padding: '4px 0', justifyContent: 'center' }} onClick={() => { const v = Math.floor(maxHavoc * 0.25); if (onClassResourceUpdate) { logChange(Math.abs(v - havoc), v > havoc); onClassResourceUpdate('current', v); } }}>25%</button>
                                <button className="context-menu-button" style={{ padding: '4px 0', justifyContent: 'center' }} onClick={() => { const v = Math.floor(maxHavoc * 0.5); if (onClassResourceUpdate) { logChange(Math.abs(v - havoc), v > havoc); onClassResourceUpdate('current', v); } }}>50%</button>
                                <button className="context-menu-button" style={{ padding: '4px 0', justifyContent: 'center' }} onClick={() => { const v = Math.floor(maxHavoc * 0.75); if (onClassResourceUpdate) { logChange(Math.abs(v - havoc), v > havoc); onClassResourceUpdate('current', v); } }}>75%</button>
                                <button className="context-menu-button" style={{ padding: '4px 0', justifyContent: 'center' }} onClick={() => handleHavocChange(maxHavoc)}>MAX</button>
                            </div>
                        </div>

                        <div className="context-menu-separator" style={{ margin: '8px 0' }}></div>

                        {/* Specialization Selection */}
                        <div className="context-menu-section">
                            <div className="context-menu-section-title">Specialization</div>
                            <div className="spec-options-grid">
                                {Object.entries(specConfigs).map(([key, spec]) => (
                                    <button
                                        key={key}
                                        className={`context-menu-button ${specialization === key ? 'active' : ''}`}
                                        style={{ fontSize: '9px', padding: '4px 6px' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (onClassResourceUpdate) onClassResourceUpdate('specialization', key);
                                        }}
                                        title={spec.desc}
                                    >
                                        <i className={`fas ${spec.icon}`} style={{ width: '12px' }}></i>
                                        {spec.name}
                                    </button>
                                ))}
                            </div>
                        </div>

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

export default DoomsayerResourceBar;
