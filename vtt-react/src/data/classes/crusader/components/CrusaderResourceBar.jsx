import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/CrusaderResourceBar.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import ClassTip from '../../../../components/hud/ClassTip';
import '../../../../styles/unified-context-menu.css';

import { INK, PAGE, PAPER, RULE, ETCH, inked, washed } from '../../../../components/hud/calmBarPalette';
import ClassMenuSpells from '../../../../components/hud/ClassMenuSpells';
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

    // Dual Conduit fill calculations (viewBox 0 0 360 76)
    // Left conduit: x=22, width=132 (represents 0-50 fervor)
    const leftConduitFill = Math.min(1, Math.max(0, localFervor / 50)) * 132;
    // Right conduit: x=206, width=132 (represents 50-100 fervor)
    const rightConduitFill = localFervor > 50 ? Math.min(1, Math.max(0, (localFervor - 50) / 50)) * 132 : 0;

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
                    title="Crusader Fervor. Click to open ledger."
                >
                    <svg
                        className="crusader-fervor-svg"
                        viewBox="0 0 360 76"
                        preserveAspectRatio="xMidYMid meet"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-label="Crusader Fervor Reliquary"
                    >
                        <defs />

                        {/* Reliquary Base Plate */}
                        <rect
                            x="3"
                            y="3"
                            width="354"
                            height="70"
                            rx="8"
                            ry="8"
                            fill={PAPER}
                            stroke={inked('#f3c868', 0.6)}
                            strokeWidth="1.6"
                        />
                        {/* Depth Vignette */}
                        <rect
                            x="3"
                            y="3"
                            width="354"
                            height="70"
                            rx="8"
                            ry="8"
                            fill={PAPER}
                            pointerEvents="none"
                        />
                        {/* Filigree Inner Inset */}
                        <rect
                            x="6"
                            y="6"
                            width="348"
                            height="64"
                            rx="6"
                            ry="6"
                            fill="none"
                            stroke={inked('#eab308', 0.6)}
                            strokeWidth="0.8"
                            strokeDasharray="4 2"
                            pointerEvents="none"
                        />
                        {/* Corner Filigree Scrolls */}
                        <g stroke={inked('#eab308', 0.6)} strokeWidth="1" fill="none" strokeLinecap="round" pointerEvents="none">
                            <path d="M12 24 Q12 12 24 12" />
                            <path d="M336 12 Q348 12 348 24" />
                            <path d="M12 52 Q12 64 24 64" />
                            <path d="M348 64 Q336 64 336 52" />
                        </g>

                        {/* Corner Sun-Boss Rivets */}
                        <circle cx="10" cy="10" r="2.2" fill={washed('#eab308', 0.2)} stroke={RULE} strokeWidth="0.8" />
                        <circle cx="350" cy="10" r="2.2" fill={washed('#eab308', 0.2)} stroke={RULE} strokeWidth="0.8" />
                        <circle cx="10" cy="66" r="2.2" fill={washed('#eab308', 0.2)} stroke={RULE} strokeWidth="0.8" />
                        <circle cx="350" cy="66" r="2.2" fill={washed('#eab308', 0.2)} stroke={RULE} strokeWidth="0.8" />

                        {/* ========================================================= */}
                        {/* CONSECRATED SANCTUM: ARCHED WINDOW + SOLAR RAY FAN        */}
                        {/* (behind the rails, intensity scales with Fervor)          */}
                        {/* ========================================================= */}
                        <g
                            className="crusader-sanctum-rays"
                            clipPath="url(#crusaderPlateClip)"
                            opacity={0.4 + 0.6 * Math.min(1, Math.max(0, localFervor / 100))}
                            pointerEvents="none"
                        >
                            {/* Gothic ogee arch framing the monstrance */}
                            <path
                                d="M146 73 L146 34 Q146 11 180 3 Q214 11 214 34 L214 73"
                                fill="none"
                                stroke={inked('#eab308', 0.6)}
                                strokeWidth="1"
                                strokeDasharray="3 2.5"
                            />
                            <path
                                d="M152 73 L152 35 Q152 15 180 7 Q208 15 208 35 L208 73"
                                fill="none"
                                stroke={ETCH}
                                strokeWidth="0.8"
                            />
                            {/* Radiant fan from the reliquary heart */}
                            {Array.from({ length: 20 }).map((_, i) => {
                                const ang = (i * 18 * Math.PI) / 180;
                                const inner = 25;
                                const outer = i % 2 === 0 ? 56 : 40;
                                return (
                                    <line
                                        key={i}
                                        x1={180 + Math.cos(ang) * inner}
                                        y1={38 + Math.sin(ang) * inner}
                                        x2={180 + Math.cos(ang) * outer}
                                        y2={38 + Math.sin(ang) * outer}
                                        stroke={inked('#eab308', 0.6)}
                                        strokeWidth={i % 2 === 0 ? 1.1 : 0.7}
                                        strokeLinecap="round"
                                        opacity={localFervor >= (i / 20) * 100 ? 0.85 : 0.35}
                                    />
                                );
                            })}
                        </g>

                        {/* ========================================================= */}
                        {/* LEFT CONDUIT: KINDLING RAIL (0 to 50 FERVOR)              */}
                        {/* ========================================================= */}
                        <g className="crusader-left-conduit">
                            {/* Recessed Conduit Channel */}
                            <rect
                                x="22"
                                y="29"
                                width="132"
                                height="18"
                                rx="9"
                                fill={PAPER}
                                stroke={inked('#eab308', 0.6)}
                                strokeWidth="1.1"
                            />
                            {/* Inner Depth Shadow */}
                            <line x1="25" y1="31" x2="151" y2="31" stroke={RULE} strokeWidth="1" />

                            {/* Fervor Graduation Ticks (every 10) */}
                            {[1, 2, 3, 4].map((i) => (
                                <line
                                    key={i}
                                    x1={22 + i * 26.4}
                                    y1="32.5"
                                    x2={22 + i * 26.4}
                                    y2="43.5"
                                    stroke={localFervor >= i * 10 ? inked('#fef08a', 0.6) : inked('#eab308', 0.6)}
                                    strokeWidth="0.7"
                                />
                            ))}

                            {/* Glowing Liquid Fill (clipped to channel) */}
                            {leftConduitFill > 0 && (
                                <g clipPath="url(#crusaderLeftClip)">
                                    <rect
                                        x="22"
                                        y="29"
                                        width={leftConduitFill}
                                        height="18"
                                        fill={washed('#eab308', 0.2)}
                                    />
                                    {/* Travelling lead spark */}
                                    <circle
                                        cx={Math.max(24, 22 + leftConduitFill - 3)}
                                        cy="38"
                                        r="2.4"
                                        fill={washed('#fffbe6', 0.2)}
                                    />
                                </g>
                            )}

                            {/* Glass Highlight */}
                            <rect
                                x="22"
                                y="29"
                                width="132"
                                height="9"
                                rx="4"
                                fill={PAGE}
                                pointerEvents="none"
                            />

                            {/* Rail End Caps */}
                            <circle cx="24" cy="38" r="1.4" fill={washed('#eab308', 0.2)} />
                            <circle cx="152" cy="38" r="1.4" fill={washed('#eab308', 0.2)} />

                            {/* Milestone 25 Fervor — Aegis Diamond */}
                            <g transform="translate(88,38)">
                                <rect
                                    x="-2.1"
                                    y="-2.1"
                                    width="4.2"
                                    height="4.2"
                                    transform="rotate(45)"
                                    fill={localFervor >= 25 ? washed('#fff7cc', 0.2) : washed('#eab308', 0.2)}
                                    stroke={RULE}
                                    strokeWidth="0.5"
                                />
                            </g>
                        </g>

                        {/* ========================================================= */}
                        {/* RIGHT CONDUIT: HARMONIC RAIL (50 to 100 FERVOR)           */}
                        {/* ========================================================= */}
                        <g className="crusader-right-conduit">
                            {/* Recessed Conduit Channel */}
                            <rect
                                x="206"
                                y="29"
                                width="132"
                                height="18"
                                rx="9"
                                fill={PAPER}
                                stroke={inked('#eab308', 0.6)}
                                strokeWidth="1.1"
                            />
                            {/* Inner Depth Shadow */}
                            <line x1="209" y1="31" x2="335" y2="31" stroke={RULE} strokeWidth="1" />

                            {/* Fervor Graduation Ticks (every 10) */}
                            {[1, 2, 3, 4].map((i) => (
                                <line
                                    key={i}
                                    x1={206 + i * 26.4}
                                    y1="32.5"
                                    x2={206 + i * 26.4}
                                    y2="43.5"
                                    stroke={localFervor >= 50 + i * 10 ? inked('#fef08a', 0.6) : inked('#eab308', 0.6)}
                                    strokeWidth="0.7"
                                />
                            ))}

                            {/* Glowing Liquid Fill (clipped to channel) */}
                            {rightConduitFill > 0 && (
                                <g clipPath="url(#crusaderRightClip)">
                                    <rect
                                        x="206"
                                        y="29"
                                        width={rightConduitFill}
                                        height="18"
                                        fill={washed('#eab308', 0.2)}
                                    />
                                    {/* Travelling lead spark */}
                                    <circle
                                        cx={Math.max(208, 206 + rightConduitFill - 3)}
                                        cy="38"
                                        r="2.4"
                                        fill={washed('#fffbe6', 0.2)}
                                    />
                                </g>
                            )}

                            {/* Glass Highlight */}
                            <rect
                                x="206"
                                y="29"
                                width="132"
                                height="9"
                                rx="4"
                                fill={PAGE}
                                pointerEvents="none"
                            />

                            {/* Rail End Caps */}
                            <circle cx="208" cy="38" r="1.4" fill={washed('#eab308', 0.2)} />
                            <circle cx="336" cy="38" r="1.4" fill={washed('#eab308', 0.2)} />

                            {/* Milestone 75 Fervor Pip */}
                            <g transform="translate(272,38)">
                                <rect
                                    x="-2.1"
                                    y="-2.1"
                                    width="4.2"
                                    height="4.2"
                                    transform="rotate(45)"
                                    fill={localFervor >= 75 ? washed('#fff7cc', 0.2) : washed('#eab308', 0.2)}
                                    stroke={RULE}
                                    strokeWidth="0.5"
                                />
                            </g>

                            {/* Milestone 100 Fervor — Judgment Starburst */}
                            <g transform="translate(336,38)">
                                {[0, 45, 90, 135].map((deg) => (
                                    <line
                                        key={deg}
                                        x1="0"
                                        y1="-4.4"
                                        x2="0"
                                        y2="4.4"
                                        transform={`rotate(${deg})`}
                                        stroke={isJudgmentReady ? INK : inked('#eab308', 0.6)}
                                        strokeWidth="1"
                                        strokeLinecap="round"
                                    />
                                ))}
                            </g>
                        </g>

                        {/* ========================================================= */}
                        {/* CENTERPIECE: SACRED SOLAR MONSTRANCE / CHALICE            */}
                        {/* ========================================================= */}
                        <g
                            className={`crusader-centerpiece svg-sunburst-emblem ${isJudgmentReady ? 'judgment-flaring' : isHarmonic ? 'harmonic-glowing' : ''}`}
                            pointerEvents="none"
                        >
                            {/* Halo Bloom */}
                            <circle className="crusader-halo-bloom" cx="180" cy="38" r="34" fill={washed('#eab308', 0.2)} />

                            {/* 16-Ray Spiked Radiant Halo (slow orbit once Harmonic) */}
                            <g className="crusader-monstrance-halo">
                                {isHarmonic && (
                                    <animateTransform
                                        attributeName="transform"
                                        type="rotate"
                                        from="0 180 38"
                                        to="360 180 38"
                                        dur="36s"
                                        repeatCount="indefinite"
                                    />
                                )}
                                {Array.from({ length: 16 }).map((_, i) => {
                                    const angle = (i * 22.5 * Math.PI) / 180;
                                    const x1 = 180 + Math.cos(angle) * 20;
                                    const y1 = 38 + Math.sin(angle) * 20;
                                    const x2 = 180 + Math.cos(angle) * (i % 2 === 0 ? 29 : 25);
                                    const y2 = 38 + Math.sin(angle) * (i % 2 === 0 ? 29 : 25);
                                    return (
                                        <line
                                            key={i}
                                            x1={x1}
                                            y1={y1}
                                            x2={x2}
                                            y2={y2}
                                            stroke={isJudgmentReady ? INK : isHarmonic ? inked('#fde047', 0.6) : inked('#eab308', 0.6)}
                                            strokeWidth={i % 2 === 0 ? 1.5 : 1}
                                            strokeLinecap="round"
                                        />
                                    );
                                })}
                            </g>

                            {/* Outer Cathedral Monstrance Ring with Rune Ticks */}
                            <circle
                                cx="180"
                                cy="38"
                                r="22"
                                fill={PAPER}
                                stroke={inked('#f3c868', 0.6)}
                                strokeWidth="1.8"
                            />
                            {Array.from({ length: 12 }).map((_, i) => {
                                const angle = (i * 30 * Math.PI) / 180;
                                return (
                                    <line
                                        key={i}
                                        x1={180 + Math.cos(angle) * 22}
                                        y1={38 + Math.sin(angle) * 22}
                                        x2={180 + Math.cos(angle) * 24.2}
                                        y2={38 + Math.sin(angle) * 24.2}
                                        stroke={isJudgmentReady ? INK : inked('#eab308', 0.6)}
                                        strokeWidth="0.9"
                                        strokeLinecap="round"
                                    />
                                );
                            })}

                            {/* Inner Chamber */}
                            <circle
                                cx="180"
                                cy="38"
                                r="16"
                                fill={isHarmonic ? washed('#eab308', 0.2) : PAPER}
                                stroke={inked('#eab308', 0.6)}
                                strokeWidth="1"
                            />

                            {/* Solvan Cross Crest */}
                            <path
                                d="M 180 28 L 180 48 M 170 38 L 190 38"
                                stroke={isHarmonic ? RULE : inked('#eab308', 0.6)}
                                strokeWidth="2.6"
                                strokeLinecap="round"
                            />
                            <circle
                                cx="180"
                                cy="38"
                                r="2.6"
                                fill={isHarmonic ? PAGE : washed('#fef08a', 0.2)}
                            />

                            {/* Judgment Sparks */}
                            {isJudgmentReady && (
                                <g>
                                    {[0, 60, 120, 180, 240, 300].map((deg) => (
                                        <circle
                                            key={deg}
                                            cx={180 + Math.cos((deg * Math.PI) / 180) * 30}
                                            cy={38 + Math.sin((deg * Math.PI) / 180) * 30}
                                            r="1.5"
                                            fill={washed('#fffbe6', 0.2)}
                                        />
                                    ))}
                                </g>
                            )}
                        </g>

                        {/* ========================================================= */}
                        {/* RELIQUARY TRIM: SIDE ROSETTES + RISING EMBERS             */}
                        {/* ========================================================= */}
                        <g className="crusader-side-rosettes" pointerEvents="none">
                            {[[12, 38], [348, 38]].map(([cx, cy], idx) => (
                                <g key={idx} transform={`translate(${cx},${cy})`}>
                                    {[0, 45, 90, 135].map((deg) => (
                                        <line
                                            key={deg}
                                            x1="0"
                                            y1="-3.8"
                                            x2="0"
                                            y2="3.8"
                                            transform={`rotate(${deg})`}
                                            stroke={inked('#eab308', 0.6)}
                                            strokeWidth="0.9"
                                            strokeLinecap="round"
                                        />
                                    ))}
                                    <circle r="1.3" fill={washed('#fef08a', 0.2)} />
                                </g>
                            ))}
                        </g>

                        <g className="crusader-embers" pointerEvents="none">
                            {[
                                { x: 60, y: 62, delay: '0s' },
                                { x: 106, y: 18, delay: '0.7s' },
                                { x: 156, y: 64, delay: '1.4s' },
                                { x: 204, y: 16, delay: '0.35s' },
                                { x: 254, y: 62, delay: '1.1s' },
                                { x: 300, y: 20, delay: '1.8s' }
                            ].map((ember, i) => (
                                <circle
                                    key={i}
                                    className="crusader-ember"
                                    cx={ember.x}
                                    cy={ember.y}
                                    r="1.1"
                                    fill={washed('#fde047', 0.2)}
                                    style={{ animationDelay: ember.delay }}
                                />
                            ))}
                        </g>
                    </svg>
                </div>
            </div>

            {/* Crusader Context Menu - Unified Pathfinder Parchment Style */}
            {showControls && ReactDOM.createPortal(
                <div
                    ref={controlsMenuRef}
                    className={`unified-context-menu compact context-menu-container crusader-menu-container class-resource-menu ${context === 'party' ? 'chronarch-party' : ''}`}
                    onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                    onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                    onMouseEnter={(e) => {
                        e.stopPropagation();
                        setShowTooltip(false);
                    }}
                    onMouseMove={(e) => e.stopPropagation()}
                    onMouseOver={(e) => e.stopPropagation()}
                    style={(() => {
                        if (!barRef.current) {
                            return { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 100000 };
                        }
                        const rect = barRef.current.getBoundingClientRect();
                        const hudContainer = barRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                        if (hudContainer) {
                            const hudRect = hudContainer.getBoundingClientRect();
                            const menuWidth = Math.max(240, Math.min(hudRect.width, window.innerWidth - 16));
                            return {
                                position: 'fixed',
                                top: `${hudRect.bottom + 8}px`,
                                left: `${hudRect.left}px`,
                                width: `${menuWidth}px`,
                                maxWidth: `${menuWidth}px`,
                                transform: 'none',
                                zIndex: 100000
                            };
                        }
                        return {
                            position: 'fixed',
                            top: `${rect.bottom + 8}px`,
                            left: `${rect.left + (rect.width / 2)}px`,
                            transform: 'translateX(-50%)',
                            zIndex: 100000
                        };
                    })()}
                >
                    <div className="cm" style={{ '--cm-accent': '#b08a2e', '--cm-accent-deep': '#6b4f12', '--cm-wash': '#f4e7c4' }}>
                        <header className="cm-head">
                            <span className={`cm-seal ${localFervor < 25 ? 'is-quiet' : ''}`}>{localFervor}</span>
                            <div className="cm-titles">
                                <div className="cm-eyebrow">Crusader Fervor Ledger</div>
                                <div className="cm-title">{isJudgmentReady ? 'Full Radiance' : isHarmonic ? 'Harmonic' : 'Kindling'}</div>
                                <div className="cm-sub"><span>{localFervor}/{maxFervor}</span> Fervor, kindled by strikes</div>
                            </div>
                            <button type="button" className="cm-x" aria-label="Close menu" onClick={() => setShowControls(false)}>
                                <i className="fas fa-times" aria-hidden="true"></i>
                            </button>
                        </header>
                        <div className="cm-meter" aria-hidden="true"><span style={{ width: `${maxFervor ? Math.min(100, (localFervor / maxFervor) * 100) : 0}%` }}></span></div>
                        <div className={`cm-burden ${localFervor >= 80 ? 'is-severe' : localFervor < 50 ? 'is-quiet' : ''}`}>
                            <span className="cm-burden-label">{isHarmonic ? 'Harmonic Stance' : 'Harmonic Stance at 50'}</span>
                            <p className="cm-burden-text">
                                {isHarmonic
                                    ? 'Your attacks deal +1d6 sacred damage and sunder Durability and DR.'
                                    : `Strike, block and hold consecrated ground. ${50 - localFervor} more Fervor and your blade burns white.`}
                            </p>
                            {localFervor >= 80 && (
                                <span className="cm-burden-cost">Zealous Scorching: 80 or more unspent Fervor burns you. Spend or vent.</span>
                            )}
                        </div>
                        <div className="cm-section">Kindle</div>
                        <div className="cm-row" style={{ '--cm-cols': 3 }}>
                            <button type="button" className="context-menu-button gain is-stacked" onClick={(e) => { e.stopPropagation(); handleFervorChange(10); }} title="A landed melee strike">
                                Strike (+10)<span className="cm-btn-sub">melee hit</span>
                            </button>
                            <button type="button" className="context-menu-button gain is-stacked" onClick={(e) => { e.stopPropagation(); handleFervorChange(10); }} title="A blocked blow or soak roll">
                                Block (+10)<span className="cm-btn-sub">soak a hit</span>
                            </button>
                            <button type="button" className="context-menu-button gain is-stacked" onClick={(e) => { e.stopPropagation(); handleFervorChange(5); }} title="Starting a turn on your consecrated ground">
                                Hallowed (+5)<span className="cm-btn-sub">consecrated</span>
                            </button>
                        </div>
                        <div className="cm-section">
                            Spend
                            <span className="cm-section-aside">spent through your spells</span>
                        </div>
                        <div className="cm-row" style={{ '--cm-cols': 4 }}>
                            {[10, 25, 50, 100].map((n) => (
                                <button key={n} type="button" className="context-menu-button spend" onClick={(e) => { e.stopPropagation(); handleFervorChange(-n); }} disabled={localFervor < n}>-{n}</button>
                            ))}
                        </div>
                        <ClassMenuSpells className="Crusader" resourceTypes={['fervor']} resourceLabel="Fervor" current={localFervor} />
                        <div className="cm-foot">
                            <button
                                type="button"
                                className="context-menu-button quiet"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    const resetAmount = localFervor;
                                    setLocalFervor(0);
                                    if (resetAmount > 0) {
                                        logClassResourceChange('Fervor', resetAmount, false);
                                        if (onClassResourceUpdate) onClassResourceUpdate('current', 0);
                                    }
                                }}
                                title="Vent all Fervor back to 0"
                            >
                                <i className="fas fa-undo" aria-hidden="true"></i> Vent All
                            </button>
                            <button
                                type="button"
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
                                title="Set Fervor to its maximum (GM or owner override)"
                            >
                                <i className="fas fa-arrow-up" aria-hidden="true"></i> Max
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
                        title="Fervor"
                        subtitle="Crusader Solar Dynamo"
                        state={`${localFervor}/${maxFervor}`}
                        stateTone={isJudgmentReady ? 'good' : isHarmonic ? 'good' : 'neutral'}
                        mechanic="Fervor builds from strikes (+10–15), blocks (+10) and consecrated ground (+5/round). Spend 25 on Aegis, 50 on Harmonic Stance (+1d6 sacred), 100 on Solvan Judgment. Holding 80+ risks starlight overload."
                        status={[
                            isJudgmentReady
                                ? { text: 'JUDGMENT READY — unleash Solvan Judgment.', tone: 'good' }
                                : isHarmonic
                                    ? { text: 'Harmonic Stance live — all strikes deal +1d6 sacred damage.', tone: 'good' }
                                    : localFervor >= 25
                                        ? 'Aegis of the Martyred Sun available (25) — keep kindling toward Harmonic (50).'
                                        : 'Kindle Fervor to light the engine.',
                        ]}
                        usage={isOwner ? 'Click the bar to manage Fervor · Aegis at 25, Harmonic Stance at 50, Solvan Judgment at 100.' : null}
                    />
                </div>,
                document.body
            )}
        </div>
    );
};

export default CrusaderResourceBar;
