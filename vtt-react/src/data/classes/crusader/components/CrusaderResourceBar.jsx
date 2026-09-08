import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/CrusaderResourceBar.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import ClassTip from '../../../../components/hud/ClassTip';
import '../../../../styles/unified-context-menu.css';

const CrusaderResourceBar = ({
    classResource = {},
    size = 'normal',
    config = {},
    context = 'hud',
    isOwner = true,
    onClassResourceUpdate = null
}) => {
    const fervorFromProps = classResource?.current ?? 0;
    const maxFervor = classResource?.max ?? 100;
    const [localFervor, setLocalFervor] = useState(fervorFromProps);
    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);

    const barRef = useRef(null);
    const controlsMenuRef = useRef(null);
    const tooltipRef = useResourceBarTooltip(barRef, showTooltip, [localFervor]);

    useEffect(() => {
        if (classResource?.current !== undefined && classResource.current !== localFervor) {
            setLocalFervor(classResource.current);
        }
    }, [classResource?.current]);

    // Close controls menu when clicking outside
    useEffect(() => {
        if (!showControls) return;
        const handleClickOutside = (e) => {
            if (controlsMenuRef.current && controlsMenuRef.current.contains(e.target)) return;
            if (barRef.current && barRef.current.contains(e.target)) return;
            setShowControls(false);
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showControls]);

    // Chat logging
    const { addCombatNotification } = useChatStore();
    const isGMMode = useGameStore(state => state.isGMMode);
    const currentPlayerName = useCharacterStore(state => state.name || 'Player');

    const getActorName = () => {
        const actorName = currentPlayerName || 'Player';
        return isGMMode ? `${actorName} (GM)` : actorName;
    };

    const logClassResourceChange = (resourceName, amount, isPositive) => {
        const absAmount = Math.abs(amount);
        const actorName = getActorName();
        const characterName = currentPlayerName || 'Character';

        const message = isPositive
            ? `${characterName} kindled ${absAmount} ${resourceName}`
            : `${characterName} unleashed ${absAmount} ${resourceName}`;

        addCombatNotification({
            type: 'combat_resource',
            attacker: actorName,
            target: characterName,
            amount: absAmount,
            resourceType: 'fervor',
            isPositive: isPositive,
            customMessage: message
        });
    };

    const handleFervorChange = (delta) => {
        const newValue = Math.max(0, Math.min(maxFervor, localFervor + delta));
        const actualAmount = Math.abs(newValue - localFervor);
        if (actualAmount > 0) {
            setLocalFervor(newValue);
            logClassResourceChange('Fervor', actualAmount, delta > 0);
            if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
        }
    };

    const isHarmonic = localFervor >= 50;
    const isJudgmentReady = localFervor >= 100;

    // Dual Conduit fill calculations (viewBox 0 0 292 76)
    // Left conduit: x=22, width=98 (represents 0-50 fervor)
    const leftConduitFill = Math.min(1, Math.max(0, localFervor / 50)) * 98;
    // Right conduit: x=172, width=98 (represents 50-100 fervor)
    const rightConduitFill = localFervor > 50 ? Math.min(1, Math.max(0, (localFervor - 50) / 50)) * 98 : 0;

    return (
        <div className={`crusader-resource-container ${size} context-${context}`}>
            <div className="resource-bar-row">
                <div
                    ref={barRef}
                    className={`crusader-resource-bar ${size} ${isHarmonic ? 'harmonic' : ''} ${isJudgmentReady ? 'judgment-ready' : ''} clickable`}
                    onMouseEnter={() => { if (!showControls) setShowTooltip(true); }}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={() => {
                        if (isOwner) {
                            setShowControls(prev => !prev);
                            setShowTooltip(false);
                        }
                    }}
                    title="Crusader Radiant Fervor. Click to open ledger."
                >
                    <svg
                        className="crusader-fervor-svg"
                        viewBox="0 0 292 76"
                        preserveAspectRatio="xMidYMid meet"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-label="Crusader Radiant Fervor Reliquary"
                    >
                        <defs>
                            {/* Radiant Solar Glow Filters */}
                            <filter id="crusaderSolarGlow" x="-30%" y="-30%" width="160%" height="160%">
                                <feGaussianBlur stdDeviation="2.2" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>
                            <filter id="crusaderJudgmentGlow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="3.8" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            {/* Reliquary Chassis Metallic Obsidian/Bronze Gradient */}
                            <linearGradient id="crusaderBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#1a130c" />
                                <stop offset="50%" stopColor="#291c10" />
                                <stop offset="100%" stopColor="#140f09" />
                            </linearGradient>

                            {/* Consecrated Starlight Gold Border */}
                            <linearGradient id="crusaderGoldBorder" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#8d6624" />
                                <stop offset="25%" stopColor="#f3c868" />
                                <stop offset="50%" stopColor="#ffe9a0" />
                                <stop offset="75%" stopColor="#e5b34a" />
                                <stop offset="100%" stopColor="#7a5518" />
                            </linearGradient>

                            {/* Solar Fervor Liquid Fill */}
                            <linearGradient id="crusaderLiquidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#9a3412" />
                                <stop offset="40%" stopColor="#ea580c" />
                                <stop offset="75%" stopColor="#eab308" />
                                <stop offset="100%" stopColor="#fef08a" />
                            </linearGradient>

                            {/* Glass Specular Reflection Highlight */}
                            <linearGradient id="crusaderGlassHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
                                <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
                                <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
                            </linearGradient>

                            {/* Sunburst Radial Medallion Gradient */}
                            <radialGradient id="crusaderSunburstGrad" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="35%" stopColor="#fef08a" />
                                <stop offset="75%" stopColor="#eab308" />
                                <stop offset="100%" stopColor="#78350f" />
                            </radialGradient>
                        </defs>

                        {/* Reliquary Base Plate */}
                        <rect
                            x="3"
                            y="3"
                            width="286"
                            height="70"
                            rx="8"
                            ry="8"
                            fill="url(#crusaderBgGrad)"
                            stroke="url(#crusaderGoldBorder)"
                            strokeWidth="1.6"
                        />
                        {/* Filigree Inner Inset */}
                        <rect
                            x="6"
                            y="6"
                            width="280"
                            height="64"
                            rx="6"
                            ry="6"
                            fill="none"
                            stroke="rgba(234, 179, 8, 0.28)"
                            strokeWidth="0.8"
                            strokeDasharray="4 2"
                            pointerEvents="none"
                        />

                        {/* Corner Sun-Boss Rivets */}
                        <circle cx="10" cy="10" r="2.2" fill="#eab308" stroke="#78350f" strokeWidth="0.8" />
                        <circle cx="282" cy="10" r="2.2" fill="#eab308" stroke="#78350f" strokeWidth="0.8" />
                        <circle cx="10" cy="66" r="2.2" fill="#eab308" stroke="#78350f" strokeWidth="0.8" />
                        <circle cx="282" cy="66" r="2.2" fill="#eab308" stroke="#78350f" strokeWidth="0.8" />

                        {/* ========================================================= */}
                        {/* LEFT CONDUIT: KINDLING RAIL (0 to 50 FERVOR)              */}
                        {/* ========================================================= */}
                        <g className="crusader-left-conduit">
                            {/* Recessed Conduit Channel */}
                            <rect
                                x="22"
                                y="29"
                                width="98"
                                height="18"
                                rx="9"
                                fill="#0f0c08"
                                stroke="rgba(234, 179, 8, 0.45)"
                                strokeWidth="1.0"
                            />

                            {/* Glowing Liquid Fill */}
                            {leftConduitFill > 0 && (
                                <rect
                                    x="22"
                                    y="29"
                                    width={leftConduitFill}
                                    height="18"
                                    rx="9"
                                    fill="url(#crusaderLiquidGrad)"
                                    filter={localFervor >= 25 ? 'url(#crusaderSolarGlow)' : undefined}
                                />
                            )}

                            {/* Glass Highlight */}
                            <rect
                                x="22"
                                y="29"
                                width="98"
                                height="9"
                                rx="4"
                                fill="url(#crusaderGlassHighlight)"
                                pointerEvents="none"
                            />

                            {/* Milestone 25 Fervor Diamond Pip */}
                            <line x1="71" y1="29" x2="71" y2="47" stroke={localFervor >= 25 ? '#ffffff' : 'rgba(234, 179, 8, 0.4)'} strokeWidth="0.8" strokeDasharray="1.5 1.5" />
                            <circle cx="71" cy="38" r="1.5" fill={localFervor >= 25 ? '#ffffff' : 'rgba(234, 179, 8, 0.6)'} />
                        </g>

                        {/* ========================================================= */}
                        {/* RIGHT CONDUIT: HARMONIC RAIL (50 to 100 FERVOR)           */}
                        {/* ========================================================= */}
                        <g className="crusader-right-conduit">
                            {/* Recessed Conduit Channel */}
                            <rect
                                x="172"
                                y="29"
                                width="98"
                                height="18"
                                rx="9"
                                fill="#0f0c08"
                                stroke="rgba(234, 179, 8, 0.45)"
                                strokeWidth="1.0"
                            />

                            {/* Glowing Liquid Fill */}
                            {rightConduitFill > 0 && (
                                <rect
                                    x="172"
                                    y="29"
                                    width={rightConduitFill}
                                    height="18"
                                    rx="9"
                                    fill="url(#crusaderLiquidGrad)"
                                    filter={isJudgmentReady ? 'url(#crusaderJudgmentGlow)' : 'url(#crusaderSolarGlow)'}
                                />
                            )}

                            {/* Glass Highlight */}
                            <rect
                                x="172"
                                y="29"
                                width="98"
                                height="9"
                                rx="4"
                                fill="url(#crusaderGlassHighlight)"
                                pointerEvents="none"
                            />

                            {/* Milestone 75 Fervor Diamond Pip */}
                            <line x1="221" y1="29" x2="221" y2="47" stroke={localFervor >= 75 ? '#ffffff' : 'rgba(234, 179, 8, 0.4)'} strokeWidth="0.8" strokeDasharray="1.5 1.5" />
                            <circle cx="221" cy="38" r="1.5" fill={localFervor >= 75 ? '#ffffff' : 'rgba(234, 179, 8, 0.6)'} />
                        </g>

                        {/* ========================================================= */}
                        {/* CENTERPIECE: SACRED SOLAR MONSTRANCE / CHALICE            */}
                        {/* ========================================================= */}
                        <g
                            className={`crusader-centerpiece svg-sunburst-emblem ${isJudgmentReady ? 'judgment-flaring' : isHarmonic ? 'harmonic-glowing' : ''}`}
                            pointerEvents="none"
                        >
                            {/* 12-Ray Spiked Radiant Halo */}
                            <g className="crusader-monstrance-halo">
                                {Array.from({ length: 12 }).map((_, i) => {
                                    const angle = (i * 30 * Math.PI) / 180;
                                    const x1 = 146 + Math.cos(angle) * 19;
                                    const y1 = 38 + Math.sin(angle) * 19;
                                    const x2 = 146 + Math.cos(angle) * (i % 2 === 0 ? 27 : 24);
                                    const y2 = 38 + Math.sin(angle) * (i % 2 === 0 ? 27 : 24);
                                    return (
                                        <line
                                            key={i}
                                            x1={x1}
                                            y1={y1}
                                            x2={x2}
                                            y2={y2}
                                            stroke={isJudgmentReady ? '#ffffff' : isHarmonic ? '#fde047' : 'rgba(234, 179, 8, 0.6)'}
                                            strokeWidth={i % 2 === 0 ? 1.6 : 1.1}
                                            strokeLinecap="round"
                                            filter={isJudgmentReady ? 'url(#crusaderJudgmentGlow)' : isHarmonic ? 'url(#crusaderSolarGlow)' : undefined}
                                        />
                                    );
                                })}
                            </g>

                            {/* Outer Cathedral Monstrance Ring */}
                            <circle
                                cx="146"
                                cy="38"
                                r="20"
                                fill="#160c07"
                                stroke="url(#crusaderGoldBorder)"
                                strokeWidth="1.6"
                                filter={isHarmonic ? 'url(#crusaderSolarGlow)' : undefined}
                            />

                            {/* Inner Chamber */}
                            <circle
                                cx="146"
                                cy="38"
                                r="15"
                                fill={isHarmonic ? 'url(#crusaderSunburstGrad)' : '#100704'}
                                stroke="#eab308"
                                strokeWidth="0.8"
                            />

                            {/* Solvan Cross Crest */}
                            <path
                                d="M 146 29 L 146 47 M 137 38 L 155 38"
                                stroke={isHarmonic ? '#78350f' : '#eab308'}
                                strokeWidth="2.2"
                                strokeLinecap="round"
                            />
                            <circle
                                cx="146"
                                cy="38"
                                r="2.2"
                                fill={isHarmonic ? '#ffffff' : '#fef08a'}
                            />
                        </g>
                    </svg>
                </div>
            </div>

            {/* Crusader Context Menu - Unified Pathfinder Parchment Style */}
            {showControls && ReactDOM.createPortal(
                <div
                    ref={controlsMenuRef}
                    className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                    onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                    onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                    style={{
                        position: 'fixed',
                        top: barRef.current ? barRef.current.getBoundingClientRect().bottom + 8 : '50%',
                        left: barRef.current ? barRef.current.getBoundingClientRect().left : '50%',
                        transform: barRef.current ? 'none' : 'translate(-50%, -50%)',
                        zIndex: 100000,
                        maxWidth: '315px',
                        width: '100%'
                    }}
                >
                    <div className="context-menu-main">
                        <div className="context-menu-section">
                            <div className="context-menu-section-header">Crusader Radiant Fervor Ledger</div>

                            {/* Current state summary */}
                            <div style={{ fontSize: '0.8rem', marginBottom: '8px', lineHeight: 1.35 }}>
                                <div><strong>Fervor:</strong> <span style={{ color: isHarmonic ? '#b7791f' : '#5a4628' }}>{localFervor}/{maxFervor}</span></div>
                                <div>
                                    <strong>Stance:</strong>{' '}
                                    {isJudgmentReady ? (
                                        <span style={{ color: '#c0392b', fontWeight: 'bold' }}>Judgment Unleashed (Solar Cataclysm ready!)</span>
                                    ) : isHarmonic ? (
                                        <span style={{ color: '#b7791f', fontWeight: 'bold' }}>Harmonic Stance (+1 damage die on melee strikes)</span>
                                    ) : (
                                        <span>Kindling Stance</span>
                                    )}
                                </div>
                            </div>

                            {/* Kindle Section */}
                            <div className="context-menu-section-header" style={{ fontSize: '12px', marginBottom: '6px' }}>Kindle Fervor</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                <button
                                    className="context-menu-button gain"
                                    onClick={(e) => { e.stopPropagation(); handleFervorChange(10); }}
                                >
                                    <i className="fas fa-sword"></i> Strike (+10)
                                </button>
                                <button
                                    className="context-menu-button gain"
                                    onClick={(e) => { e.stopPropagation(); handleFervorChange(25); }}
                                >
                                    <i className="fas fa-sun"></i> Prayer (+25)
                                </button>
                            </div>

                            {/* Unleash Section */}
                            <div className="context-menu-section-header" style={{ fontSize: '12px', marginBottom: '6px' }}>Unleash Fervor</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                <button
                                    className="context-menu-button spend"
                                    onClick={(e) => { e.stopPropagation(); handleFervorChange(-25); }}
                                    disabled={localFervor < 25}
                                    style={{ opacity: localFervor < 25 ? 0.5 : 1 }}
                                >
                                    Aegis (-25)
                                </button>
                                <button
                                    className="context-menu-button spend"
                                    onClick={(e) => { e.stopPropagation(); handleFervorChange(-50); }}
                                    disabled={localFervor < 50}
                                    style={{ opacity: localFervor < 50 ? 0.5 : 1 }}
                                >
                                    Harmonic (-50)
                                </button>
                                <button
                                    className="context-menu-button danger"
                                    onClick={(e) => { e.stopPropagation(); handleFervorChange(-100); }}
                                    disabled={localFervor < 100}
                                    style={{ opacity: localFervor < 100 ? 0.5 : 1 }}
                                >
                                    Judgment (-100)
                                </button>
                            </div>

                            <div className="context-menu-main-separator" style={{ margin: '8px 0' }}></div>

                            {/* Quick Actions */}
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '6px' }}>
                                <button
                                    className="context-menu-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const gain = maxFervor - localFervor;
                                        setLocalFervor(maxFervor);
                                        if (gain > 0) {
                                            logClassResourceChange('Fervor', gain, true);
                                            if (onClassResourceUpdate) onClassResourceUpdate('current', maxFervor);
                                        }
                                    }}
                                    style={{ flex: 1 }}
                                >
                                    <i className="fas fa-arrow-up"></i> Max
                                </button>
                                <button
                                    className="context-menu-button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        const resetAmount = localFervor;
                                        setLocalFervor(0);
                                        if (resetAmount > 0) {
                                            logClassResourceChange('Fervor', resetAmount, false);
                                            if (onClassResourceUpdate) onClassResourceUpdate('current', 0);
                                        }
                                    }}
                                    style={{ flex: 1 }}
                                >
                                    <i className="fas fa-undo"></i> Reset
                                </button>
                            </div>

                            <button
                                className="context-menu-button danger"
                                onClick={() => setShowControls(false)}
                                style={{ width: '100%', marginTop: '4px' }}
                            >
                                <i className="fas fa-times"></i> Close
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Shared ClassTip Tooltip */}
            {showTooltip && !showControls && ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip crusader-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}>
                    <ClassTip
                        icon="fas fa-sun"
                        tint="#eab308"
                        title="Radiant Fervor"
                        subtitle="Crusader Solar Dynamo"
                        state={`${localFervor}/${maxFervor}`}
                        stateTone={isJudgmentReady ? 'good' : isHarmonic ? 'good' : 'neutral'}
                        mechanic="Kindle in sacred combat: melee strikes (+10), shield-defense (+10), Beacon/Prayer (+25). Unleash at 25 Aegis, 50 Harmonic Stance, 100 Solar Judgment."
                        status={[
                            isJudgmentReady
                                ? 'JUDGMENT READY — unleash the unburied light.'
                                : isHarmonic
                                    ? 'Harmonic Stance live — strikes infused with radiance.'
                                    : localFervor >= 25
                                        ? 'Aegis available — keep kindling toward Harmonic (50).'
                                        : 'Kindle Fervor to light the engine.',
                        ]}
                        usage={isOwner ? 'Click bar to manage Fervor · Harmonic activates at 50, Judgment at 100.' : null}
                    />
                </div>,
                document.body
            )}
        </div>
    );
};

export default CrusaderResourceBar;
