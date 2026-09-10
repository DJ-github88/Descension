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
                                <stop offset="0%" stopColor="#2b1e12" />
                                <stop offset="50%" stopColor="#3c2b18" />
                                <stop offset="100%" stopColor="#1c140c" />
                            </linearGradient>

                            {/* Consecrated Starlight Gold Border */}
                            <linearGradient id="crusaderGoldBorder" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#8d6624" />
                                <stop offset="25%" stopColor="#f3c868" />
                                <stop offset="50%" stopColor="#ffe9a0" />
                                <stop offset="75%" stopColor="#e5b34a" />
                                <stop offset="100%" stopColor="#7a5518" />
                            </linearGradient>

                            {/* Recessed Rail Depth */}
                            <linearGradient id="crusaderRailGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                <stop offset="0%" stopColor="#050302" />
                                <stop offset="45%" stopColor="#1b1309" />
                                <stop offset="100%" stopColor="#2d2011" />
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

                            {/* Halo Bloom Behind The Monstrance */}
                            <radialGradient id="crusaderHaloBloom" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#fde047" stopOpacity="0.55" />
                                <stop offset="55%" stopColor="#eab308" stopOpacity="0.18" />
                                <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
                            </radialGradient>

                            {/* Plate Depth Vignette */}
                            <radialGradient id="crusaderPlateVignette" cx="50%" cy="50%" r="62%">
                                <stop offset="55%" stopColor="#000000" stopOpacity="0" />
                                <stop offset="100%" stopColor="#000000" stopOpacity="0.45" />
                            </radialGradient>

                            {/* Keeps fervor fill inside the rounded conduits */}
                            <clipPath id="crusaderLeftClip">
                                <rect x="22" y="29" width="132" height="18" rx="9" />
                            </clipPath>
                            <clipPath id="crusaderRightClip">
                                <rect x="206" y="29" width="132" height="18" rx="9" />
                            </clipPath>
                            {/* Keeps sun rays inside the reliquary plate */}
                            <clipPath id="crusaderPlateClip">
                                <rect x="3" y="3" width="354" height="70" rx="8" />
                            </clipPath>
                            {/* Long golden ray gradient */}
                            <linearGradient id="crusaderRayGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#eab308" stopOpacity="0" />
                                <stop offset="50%" stopColor="#fef08a" stopOpacity="0.9" />
                                <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
                            </linearGradient>
                        </defs>

                        {/* Reliquary Base Plate */}
                        <rect
                            x="3"
                            y="3"
                            width="354"
                            height="70"
                            rx="8"
                            ry="8"
                            fill="url(#crusaderBgGrad)"
                            stroke="url(#crusaderGoldBorder)"
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
                            fill="url(#crusaderPlateVignette)"
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
                            stroke="rgba(234, 179, 8, 0.28)"
                            strokeWidth="0.8"
                            strokeDasharray="4 2"
                            pointerEvents="none"
                        />
                        {/* Corner Filigree Scrolls */}
                        <g stroke="rgba(234, 179, 8, 0.55)" strokeWidth="1" fill="none" strokeLinecap="round" pointerEvents="none">
                            <path d="M12 24 Q12 12 24 12" />
                            <path d="M336 12 Q348 12 348 24" />
                            <path d="M12 52 Q12 64 24 64" />
                            <path d="M348 64 Q336 64 336 52" />
                        </g>

                        {/* Corner Sun-Boss Rivets */}
                        <circle cx="10" cy="10" r="2.2" fill="#eab308" stroke="#78350f" strokeWidth="0.8" />
                        <circle cx="350" cy="10" r="2.2" fill="#eab308" stroke="#78350f" strokeWidth="0.8" />
                        <circle cx="10" cy="66" r="2.2" fill="#eab308" stroke="#78350f" strokeWidth="0.8" />
                        <circle cx="350" cy="66" r="2.2" fill="#eab308" stroke="#78350f" strokeWidth="0.8" />

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
                                stroke="rgba(234, 179, 8, 0.32)"
                                strokeWidth="1"
                                strokeDasharray="3 2.5"
                            />
                            <path
                                d="M152 73 L152 35 Q152 15 180 7 Q208 15 208 35 L208 73"
                                fill="none"
                                stroke="rgba(254, 240, 138, 0.2)"
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
                                        stroke="url(#crusaderRayGrad)"
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
                                fill="url(#crusaderRailGrad)"
                                stroke="rgba(234, 179, 8, 0.55)"
                                strokeWidth="1.1"
                            />
                            {/* Inner Depth Shadow */}
                            <line x1="25" y1="31" x2="151" y2="31" stroke="rgba(0, 0, 0, 0.65)" strokeWidth="1" />

                            {/* Fervor Graduation Ticks (every 10) */}
                            {[1, 2, 3, 4].map((i) => (
                                <line
                                    key={i}
                                    x1={22 + i * 26.4}
                                    y1="32.5"
                                    x2={22 + i * 26.4}
                                    y2="43.5"
                                    stroke={localFervor >= i * 10 ? 'rgba(254, 240, 138, 0.6)' : 'rgba(234, 179, 8, 0.28)'}
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
                                        fill="url(#crusaderLiquidGrad)"
                                        filter={localFervor >= 25 ? 'url(#crusaderSolarGlow)' : undefined}
                                    />
                                    {/* Travelling lead spark */}
                                    <circle
                                        cx={Math.max(24, 22 + leftConduitFill - 3)}
                                        cy="38"
                                        r="2.4"
                                        fill="#fffbe6"
                                        filter="url(#crusaderSolarGlow)"
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
                                fill="url(#crusaderGlassHighlight)"
                                pointerEvents="none"
                            />

                            {/* Rail End Caps */}
                            <circle cx="24" cy="38" r="1.4" fill="rgba(234, 179, 8, 0.55)" />
                            <circle cx="152" cy="38" r="1.4" fill="rgba(234, 179, 8, 0.55)" />

                            {/* Milestone 25 Fervor — Aegis Diamond */}
                            <g transform="translate(88,38)">
                                <rect
                                    x="-2.1"
                                    y="-2.1"
                                    width="4.2"
                                    height="4.2"
                                    transform="rotate(45)"
                                    fill={localFervor >= 25 ? '#fff7cc' : 'rgba(234, 179, 8, 0.4)'}
                                    stroke="#78350f"
                                    strokeWidth="0.5"
                                    filter={localFervor >= 25 ? 'url(#crusaderSolarGlow)' : undefined}
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
                                fill="url(#crusaderRailGrad)"
                                stroke="rgba(234, 179, 8, 0.55)"
                                strokeWidth="1.1"
                            />
                            {/* Inner Depth Shadow */}
                            <line x1="209" y1="31" x2="335" y2="31" stroke="rgba(0, 0, 0, 0.65)" strokeWidth="1" />

                            {/* Fervor Graduation Ticks (every 10) */}
                            {[1, 2, 3, 4].map((i) => (
                                <line
                                    key={i}
                                    x1={206 + i * 26.4}
                                    y1="32.5"
                                    x2={206 + i * 26.4}
                                    y2="43.5"
                                    stroke={localFervor >= 50 + i * 10 ? 'rgba(254, 240, 138, 0.7)' : 'rgba(234, 179, 8, 0.28)'}
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
                                        fill="url(#crusaderLiquidGrad)"
                                        filter={isJudgmentReady ? 'url(#crusaderJudgmentGlow)' : 'url(#crusaderSolarGlow)'}
                                    />
                                    {/* Travelling lead spark */}
                                    <circle
                                        cx={Math.max(208, 206 + rightConduitFill - 3)}
                                        cy="38"
                                        r="2.4"
                                        fill="#fffbe6"
                                        filter={isJudgmentReady ? 'url(#crusaderJudgmentGlow)' : 'url(#crusaderSolarGlow)'}
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
                                fill="url(#crusaderGlassHighlight)"
                                pointerEvents="none"
                            />

                            {/* Rail End Caps */}
                            <circle cx="208" cy="38" r="1.4" fill="rgba(234, 179, 8, 0.55)" />
                            <circle cx="336" cy="38" r="1.4" fill="rgba(234, 179, 8, 0.55)" />

                            {/* Milestone 75 Fervor Pip */}
                            <g transform="translate(272,38)">
                                <rect
                                    x="-2.1"
                                    y="-2.1"
                                    width="4.2"
                                    height="4.2"
                                    transform="rotate(45)"
                                    fill={localFervor >= 75 ? '#fff7cc' : 'rgba(234, 179, 8, 0.4)'}
                                    stroke="#78350f"
                                    strokeWidth="0.5"
                                    filter={localFervor >= 75 ? 'url(#crusaderSolarGlow)' : undefined}
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
                                        stroke={isJudgmentReady ? '#ffffff' : 'rgba(234, 179, 8, 0.4)'}
                                        strokeWidth="1"
                                        strokeLinecap="round"
                                        filter={isJudgmentReady ? 'url(#crusaderJudgmentGlow)' : undefined}
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
                            <circle className="crusader-halo-bloom" cx="180" cy="38" r="34" fill="url(#crusaderHaloBloom)" />

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
                                            stroke={isJudgmentReady ? '#ffffff' : isHarmonic ? '#fde047' : 'rgba(234, 179, 8, 0.6)'}
                                            strokeWidth={i % 2 === 0 ? 1.5 : 1}
                                            strokeLinecap="round"
                                            filter={isJudgmentReady ? 'url(#crusaderJudgmentGlow)' : isHarmonic ? 'url(#crusaderSolarGlow)' : undefined}
                                        />
                                    );
                                })}
                            </g>

                            {/* Outer Cathedral Monstrance Ring with Rune Ticks */}
                            <circle
                                cx="180"
                                cy="38"
                                r="22"
                                fill="#160c07"
                                stroke="url(#crusaderGoldBorder)"
                                strokeWidth="1.8"
                                filter={isHarmonic ? 'url(#crusaderSolarGlow)' : undefined}
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
                                        stroke={isJudgmentReady ? '#ffffff' : 'rgba(234, 179, 8, 0.7)'}
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
                                fill={isHarmonic ? 'url(#crusaderSunburstGrad)' : '#100704'}
                                stroke="#eab308"
                                strokeWidth="1"
                                filter={isHarmonic ? 'url(#crusaderSolarGlow)' : undefined}
                            />

                            {/* Solvan Cross Crest */}
                            <path
                                d="M 180 28 L 180 48 M 170 38 L 190 38"
                                stroke={isHarmonic ? '#78350f' : '#eab308'}
                                strokeWidth="2.6"
                                strokeLinecap="round"
                            />
                            <circle
                                cx="180"
                                cy="38"
                                r="2.6"
                                fill={isHarmonic ? '#ffffff' : '#fef08a'}
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
                                            fill="#fffbe6"
                                            filter="url(#crusaderJudgmentGlow)"
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
                                            stroke="rgba(234, 179, 8, 0.7)"
                                            strokeWidth="0.9"
                                            strokeLinecap="round"
                                        />
                                    ))}
                                    <circle r="1.3" fill="#fef08a" filter="url(#crusaderSolarGlow)" />
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
                                    fill="#fde047"
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
                    <div className="context-menu-main">
                        <div className="context-menu-section">
                            <div className="context-menu-section-header">Crusader Fervor Ledger</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--crm-text-dim, #cbd5e1)', marginBottom: '6px' }}>
                                Build Fervor in melee, then spend it on starlight smites.
                            </div>

                            {/* Current state summary */}
                            <div style={{ fontSize: '0.8rem', marginBottom: '6px', lineHeight: 1.35 }}>
                                <div><strong>Fervor:</strong> <span style={{ color: isHarmonic ? '#fef08a' : 'var(--crm-text-dim, #cbd5e1)' }}>{localFervor}/{maxFervor}</span> <span style={{ color: 'var(--crm-text-dim, #cbd5e1)', fontSize: '0.72rem' }}>— kindled by strikes</span></div>
                                <div>
                                    <strong>Stance:</strong>{' '}
                                    {isJudgmentReady ? (
                                        <span style={{ color: '#f87171', fontWeight: 'bold' }}>Solar Judgment ready</span>
                                    ) : isHarmonic ? (
                                        <span style={{ color: '#fef08a', fontWeight: 'bold' }}>Harmonic (+1d6 sacred, sunders DR)</span>
                                    ) : (
                                        <span>Kindling</span>
                                    )}
                                </div>
                                {localFervor >= 80 && !isJudgmentReady && (
                                    <div style={{ color: '#f87171', fontStyle: 'italic', marginTop: '2px' }}>
                                        Zealous Scorching: 80+ unspent Fervor burns you — spend or vent.
                                    </div>
                                )}
                            </div>

                            {/* Kindle Section */}
                            <div className="context-menu-section-header" style={{ fontSize: '12px', marginBottom: '2px' }}>Kindle Fervor</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--crm-text-dim, #cbd5e1)', marginBottom: '6px' }}>
                                Melee strikes +10 · blocked hits +10 · prayer +25
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '10px' }}>
                                <button
                                    className="context-menu-button gain"
                                    onClick={(e) => { e.stopPropagation(); handleFervorChange(10); }}
                                    title="Gain +10 Fervor — a landed melee strike or a blocked hit"
                                >
                                    <i className="fas fa-sword"></i> Strike (+10)
                                </button>
                                <button
                                    className="context-menu-button gain"
                                    onClick={(e) => { e.stopPropagation(); handleFervorChange(25); }}
                                    title="Gain +25 Fervor — invoke a starlight prayer or Beacon of Truth"
                                >
                                    <i className="fas fa-sun"></i> Prayer (+25)
                                </button>
                            </div>

                            {/* Unleash Section */}
                            <div className="context-menu-section-header" style={{ fontSize: '12px', marginBottom: '2px' }}>Unleash Fervor</div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--crm-text-dim, #cbd5e1)', marginBottom: '6px' }}>
                                25 Aegis barrier · 50 Harmonic Stance · 100 Solar Judgment
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', marginBottom: '4px' }}>
                                <button
                                    className="context-menu-button spend"
                                    onClick={(e) => { e.stopPropagation(); handleFervorChange(-25); }}
                                    disabled={localFervor < 25}
                                    style={{ opacity: localFervor < 25 ? 0.5 : 1 }}
                                    title="Spend 25 Fervor — Aegis of the Martyred Sun: a starlight barrier"
                                >
                                    Aegis (-25)
                                </button>
                                <button
                                    className="context-menu-button spend"
                                    onClick={(e) => { e.stopPropagation(); handleFervorChange(-50); }}
                                    disabled={localFervor < 50}
                                    style={{ opacity: localFervor < 50 ? 0.5 : 1 }}
                                    title="Spend 50 Fervor — enter Harmonic Stance: +1d6 sacred damage, sunders Durability/DR"
                                >
                                    Harmonic (-50)
                                </button>
                                <button
                                    className="context-menu-button danger"
                                    onClick={(e) => { e.stopPropagation(); handleFervorChange(-100); }}
                                    disabled={localFervor < 100}
                                    style={{ opacity: localFervor < 100 ? 0.5 : 1 }}
                                    title="Spend 100 Fervor — Solvan Judgment: 20 ft AoE smite that shatters Passive DR"
                                >
                                    Judgment (-100)
                                </button>
                            </div>

                            {(() => {
                                const next = localFervor < 25
                                    ? { label: 'Aegis', at: 25 }
                                    : localFervor < 50
                                        ? { label: 'Harmonic Stance', at: 50 }
                                        : localFervor < 100
                                            ? { label: 'Solar Judgment', at: 100 }
                                            : null;
                                if (!next) return null;
                                return (
                                    <div style={{ fontSize: '0.72rem', color: 'var(--crm-text-dim, #cbd5e1)', marginBottom: '6px' }}>
                                        Next: {next.label} in {next.at - localFervor} Fervor
                                    </div>
                                );
                            })()}

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
                                    title="Set Fervor to 100 (GM / owner override)"
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
                                    title="Vent all Fervor back to 0"
                                >
                                    <i className="fas fa-undo"></i> Vent All
                                </button>
                            </div>

                            <button
                                className="context-menu-button danger"
                                onClick={() => setShowControls(false)}
                                style={{ width: '100%', marginTop: '4px' }}
                                title="Close the ledger"
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
                        title="Fervor"
                        subtitle="Crusader Solar Dynamo"
                        state={`${localFervor}/${maxFervor}`}
                        stateTone={isJudgmentReady ? 'good' : isHarmonic ? 'good' : 'neutral'}
                        mechanic="Kindle Fervor in sacred combat: strikes +10 to +15, blocking hits +10, consecrated ground +5 per round. Spend 25 on Aegis of the Martyred Sun, 50 on Harmonic Stance (+1d6 sacred damage), and 100 on Solvan Judgment; holding 80+ unspent causes starlight overload."
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
