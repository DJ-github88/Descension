import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/ApexResourceBar.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import '../../../../styles/unified-context-menu.css';
import ClassTip from '../../../../components/hud/ClassTip';

/**
 * Apex Resource Bar: "The Predator's Kill-Ledger"
 *
 * Full 360px -- the companion lives on the VTT canvas as a friendly token.
 * The bar is a pure quarry-mark kill-track spanning the full chassis.
 *
 * Layout (viewBox 0 0 360 56):
 *   Left Trigger  (x 2-32)   : shadow-claw blade, click = -1 mark, shift = reset 0
 *   Glaive Spine  (x 32-328) : 5 large quarry-notch talon slots across full width
 *       Marks 1-4: curved bloodfire razor blades
 *       Mark 5:    KILL-STATE -- serrated supernova kill-talon + execution halo
 *   Right Trigger (x 328-358): glaive advance blade, click = +1 mark, shift = max 5
 *   Companion HP and stance managed via Pack Codex context menu only
 */
const ApexResourceBar = ({
    classResource = {},
    size = 'normal',
    config = {},
    context = 'hud',
    isOwner = true,
    onClassResourceUpdate = null
}) => {
    const maxMarks = classResource?.max ?? 5;
    const propMarks = Math.min(Math.max(classResource?.current ?? 0, 0), maxMarks);
    const propCompanionHP = classResource?.companionHP ?? 50;
    const propCompanionMaxHP = classResource?.companionMaxHP ?? 50;
    const propStance = classResource?.companionStance || 'Hunt';

    const [marks, setMarks] = useState(propMarks);
    const [companionHP, setCompanionHP] = useState(propCompanionHP);
    const [companionMaxHP, setCompanionMaxHP] = useState(propCompanionMaxHP);
    const [companionStance, setCompanionStance] = useState(propStance);

    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);

    useEffect(() => {
        if (classResource?.current !== undefined) {
            setMarks(Math.min(Math.max(classResource.current, 0), maxMarks));
        }
    }, [classResource?.current, maxMarks]);

    useEffect(() => {
        if (classResource?.companionHP !== undefined) {
            setCompanionHP(classResource.companionHP);
        }
    }, [classResource?.companionHP]);

    useEffect(() => {
        if (classResource?.companionMaxHP !== undefined) {
            setCompanionMaxHP(classResource.companionMaxHP);
        }
    }, [classResource?.companionMaxHP]);

    useEffect(() => {
        if (classResource?.companionStance !== undefined) {
            setCompanionStance(classResource.companionStance);
        }
    }, [classResource?.companionStance]);

    const barRef = useRef(null);
    const controlsMenuRef = useRef(null);
    const tooltipRef = useResourceBarTooltip(barRef, showTooltip, [marks, companionHP, companionStance]);

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

    const { addCombatNotification } = useChatStore();
    const isGMMode = useGameStore(state => state.isGMMode);
    const currentPlayerName = useCharacterStore(state => state.name || 'Player');

    const getActorName = () => {
        const actorName = currentPlayerName || 'Player';
        return isGMMode ? `${actorName} (GM)` : actorName;
    };

    const isApexReady = marks >= 5;

    const logResourceChange = (msg, amount, resourceType = 'quarryMarks') => {
        const actorName = getActorName();
        const characterName = currentPlayerName || 'Character';

        addCombatNotification({
            type: 'combat_resource',
            attacker: actorName,
            target: characterName,
            amount: amount,
            resourceType: resourceType,
            isPositive: amount > 0,
            customMessage: `${characterName} ${msg}`
        });
    };

    const updateMarks = (newMarks) => {
        const clamped = Math.min(Math.max(newMarks, 0), maxMarks);
        setMarks(clamped);
        logResourceChange(`adjusted Quarry Marks to ${clamped}/${maxMarks}`, clamped);

        if (onClassResourceUpdate) {
            onClassResourceUpdate('current', clamped);
        }
    };


    const updateCompanionHP = (newHP) => {
        const clamped = Math.min(Math.max(newHP, 0), companionMaxHP);
        setCompanionHP(clamped);
        logResourceChange(`commanded Companion Vitality to ${clamped}/${companionMaxHP} HP`, clamped, 'companionHP');

        if (onClassResourceUpdate) {
            onClassResourceUpdate('companionHP', clamped);
        }
    };

    const updateStance = (newStance) => {
        setCompanionStance(newStance);
        logResourceChange(`shifted Pack Stance to ${newStance}`, 0, 'companionStance');

        if (onClassResourceUpdate) {
            onClassResourceUpdate('companionStance', newStance);
        }
    };

    const handleMarkSelect = (e, targetMark) => {
        e.stopPropagation();
        if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation();
        if (!isOwner) return;

        // If clicking currently active top mark, decrement by 1; otherwise set to targetMark
        if (marks === targetMark) {
            updateMarks(targetMark - 1);
        } else {
            updateMarks(targetMark);
        }
    };

    const handleAdvanceMarks = (e) => {
        e.stopPropagation();
        if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation();
        if (!isOwner) return;

        if (e.shiftKey) {
            updateMarks(maxMarks);
            return;
        }

        if (marks < maxMarks) {
            updateMarks(marks + 1);
        }
    };

    const handleRegressMarks = (e) => {
        e.stopPropagation();
        if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation();
        if (!isOwner) return;

        if (e.shiftKey) {
            updateMarks(0);
            return;
        }

        if (marks > 0) {
            updateMarks(marks - 1);
        }
    };


    // 5 Mark talon coordinates -- evenly distributed across full spine (x 45 to 315)
    const talonPositions = [
        { index: 1, cx: 58,  cy: 28 },
        { index: 2, cx: 126, cy: 28 },
        { index: 3, cx: 180, cy: 28 },
        { index: 4, cx: 234, cy: 28 },
        { index: 5, cx: 302, cy: 28, isApex: true }
    ];

    return (
        <div className={`apex-resource-container ${size} context-${context}`}>
            <div className="resource-bar-row">
                <div
                    ref={barRef}
                    className={`apex-resource-bar ${size} marks-${marks} ${isApexReady ? 'apex-execution-ready' : ''} clickable`}
                    onMouseEnter={() => { if (!showControls) setShowTooltip(true); }}
                    onMouseLeave={() => setShowTooltip(false)}
                    onClick={() => {
                        if (isOwner) {
                            setShowControls(!showControls);
                            if (showControls) setShowTooltip(false);
                        }
                    }}
                >
                    <svg
                        className="apex-glaive-svg"
                        viewBox="0 0 360 56"
                        preserveAspectRatio="xMidYMid meet"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            {/* Deep Shadow-Steel Chassis Gradient */}
                            <linearGradient id="apexChassisGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#08070d" />
                                <stop offset="20%" stopColor="#12101b" />
                                <stop offset="45%" stopColor="#181524" />
                                <stop offset="70%" stopColor="#12101b" />
                                <stop offset="100%" stopColor="#08070d" />
                            </linearGradient>

                            {/* Glaive Razor Edge Silver-Violet Gradient */}
                            <linearGradient id="apexBladeGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="35%" stopColor="#cbd5e1" />
                                <stop offset="70%" stopColor="#64748b" />
                                <stop offset="100%" stopColor="#1e293b" />
                            </linearGradient>

                            {/* Bloodfire Marks Radiant Gradient */}
                            <linearGradient id="apexBloodfireGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="25%" stopColor="#fca5a5" />
                                <stop offset="60%" stopColor="#ef4444" />
                                <stop offset="90%" stopColor="#991b1b" />
                                <stop offset="100%" stopColor="#450a0a" />
                            </linearGradient>

                            {/* Apex Execution Zenith Searing Gold-Crimson Gradient */}
                            <radialGradient id="apexZenithGrad" cx="45%" cy="38%" r="65%">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="25%" stopColor="#fef08a" />
                                <stop offset="55%" stopColor="#f43f5e" />
                                <stop offset="85%" stopColor="#be123c" />
                                <stop offset="100%" stopColor="#4c0519" />
                            </radialGradient>

                            {/* Beast Vitality Gradient */}
                            <linearGradient id="apexVitalityGrad" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#059669" />
                                <stop offset="50%" stopColor="#10b981" />
                                <stop offset="100%" stopColor="#34d399" />
                            </linearGradient>

                            {/* Filter: Predator Starlight Glow */}
                            <filter id="apexGlow" x="-40%" y="-40%" width="180%" height="180%">
                                <feGaussianBlur stdDeviation="2.2" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            {/* Filter: Apex Execution Supernova Corona */}
                            <filter id="apexZenithGlow" x="-70%" y="-70%" width="240%" height="240%">
                                <feGaussianBlur stdDeviation="5.5" result="blur1" />
                                <feGaussianBlur stdDeviation="2" result="blur2" />
                                <feMerge>
                                    <feMergeNode in="blur1" />
                                    <feMergeNode in="blur2" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            <filter id="apexDropShadow" x="-15%" y="-15%" width="130%" height="130%">
                                <feDropShadow dx="0" dy="2" stdDeviation="1.8" floodColor="#000000" floodOpacity="0.9" />
                            </filter>
                        </defs>

                        {/* 1. SHADOW GLAIVE CHASSIS & PREDATOR FRAME */}
                        <g filter="url(#apexDropShadow)">
                            {/* Sweeping Glaive Blade Perimeter */}
                            <path
                                d="M 12 7 C 75 3, 285 3, 348 7 C 356 7, 358 15, 356 28 C 358 41, 356 49, 348 49 C 285 53, 75 53, 12 49 C 4 49, 2 41, 4 28 C 2 15, 4 7, 12 7 Z"
                                fill="url(#apexChassisGrad)"
                                stroke={isApexReady ? '#f43f5e' : '#334155'}
                                strokeWidth={isApexReady ? '1.8' : '1.4'}
                            />
                            {/* Inner Recessed Night-Steel Channel */}
                            <path
                                d="M 14 9.5 C 75 5.5, 285 5.5, 346 9.5 C 353 9.5, 355 17, 353 28 C 355 39, 353 46.5, 346 46.5 C 285 50.5, 75 50.5, 14 46.5 C 7 46.5, 5 39, 7 28 C 5 17, 7 9.5, 14 9.5 Z"
                                fill="#07060f"
                                stroke="rgba(255, 255, 255, 0.08)"
                                strokeWidth="0.8"
                            />
                        </g>

                        {/* Etched Glaive Tracking Ley-Lines */}
                        <path
                            d="M 28 28 Q 145 34 332 28"
                            fill="none"
                            stroke="#1e293b"
                            strokeWidth="3.2"
                        />
                        <path
                            d="M 28 28 Q 145 34 332 28"
                            fill="none"
                            stroke={isApexReady ? '#f43f5e' : '#64748b'}
                            strokeWidth="1"
                            strokeDasharray="3 3"
                            opacity={isApexReady ? '0.85' : '0.45'}
                        />

                        {/* Astrolabe / Tracking Graduation Marks */}
                        {[22, 38, 54, 76, 96, 116, 145, 176, 206, 236, 266, 298, 320, 338].map((tx, i) => (
                            <g key={i}>
                                <line x1={tx} y1="8" x2={tx} y2="11.5" stroke="#475569" strokeWidth="0.8" />
                                <line x1={tx} y1="44.5" x2={tx} y2="48" stroke="#475569" strokeWidth="0.8" />
                            </g>
                        ))}

                        {/* 2. LEFT FLANK TRIGGER: PREDATOR CLAW STEPPER (◄) */}
                        <g
                            className="apex-flank-trigger apex-flank-left"
                            onClick={handleRegressMarks}
                            style={{ cursor: isOwner ? 'pointer' : 'default' }}
                        >
                            {/* Curved Shadow Claw Blade */}
                            <path
                                d="M 24 12 C 10 16, 8 40, 24 44 C 17 38, 17 18, 24 12 Z"
                                fill="url(#apexBladeGrad)"
                                stroke="#94a3b8"
                                strokeWidth="1"
                                filter="url(#apexGlow)"
                            />
                            {/* Tactile Regress Chevron ◄ */}
                            <polygon
                                points="15,28 20,24 20,32"
                                fill={isOwner ? '#e2e8f0' : '#64748b'}
                                opacity="0.9"
                            />
                            {/* Shadow Pivot Gem */}
                            <circle cx="21" cy="28" r="1.8" fill="#f43f5e" />

                            {/* Full-Height Transparent Hitbox */}
                            <rect
                                x="2"
                                y="4"
                                width="30"
                                height="48"
                                fill="transparent"
                                pointerEvents="all"
                            >
                                <title>{isOwner ? 'Reduce Marks (Click: -1 Mark, Shift: Reset to 0)' : 'Predator Claw'}</title>
                            </rect>
                        </g>

                        {/* 3. THE 5 LETHAL QUARRY MARK TALONS (full spine, x: 32 to 328) */}
                        {talonPositions.map((talon) => {
                            const isEarned = marks >= talon.index;
                            const isTalonApex = talon.isApex;

                            return (
                                <g
                                    key={talon.index}
                                    className={`apex-mark-talon mark-${talon.index} ${isEarned ? 'earned' : 'unearned'} ${isTalonApex && isEarned ? 'apex-tier' : ''}`}
                                    onClick={(e) => handleMarkSelect(e, talon.index)}
                                    style={{ cursor: isOwner ? 'pointer' : 'default' }}
                                >
                                    {/* Active Talon Radiant Orbital Ray */}
                                    {isEarned && (
                                        <line
                                            x1={talon.cx}
                                            y1="10"
                                            x2={talon.cx}
                                            y2="46"
                                            stroke={isTalonApex ? '#f43f5e' : '#ef4444'}
                                            strokeWidth="1.4"
                                            opacity={isTalonApex ? 0.9 : 0.6}
                                            filter="url(#apexGlow)"
                                        />
                                    )}

                                    {/* Mark Talon Blade Setting & Body */}
                                    {!isTalonApex ? (
                                        /* Standard Quarry Mark Talon (1-4) */
                                        <g>
                                            {/* Outer Claw Socket */}
                                            <path
                                                d={`M ${talon.cx - 9} 16 C ${talon.cx + 1} 13, ${talon.cx + 9} 24, ${talon.cx} 40 C ${talon.cx - 6} 34, ${talon.cx - 9} 26, ${talon.cx - 9} 16 Z`}
                                                fill={isEarned ? 'url(#apexBloodfireGrad)' : '#0d0c18'}
                                                stroke={isEarned ? '#fca5a5' : '#334155'}
                                                strokeWidth={isEarned ? '1.4' : '0.9'}
                                                filter={isEarned ? 'url(#apexGlow)' : undefined}
                                            />
                                            {/* Talon Inner Spine */}
                                            <path
                                                d={`M ${talon.cx - 3} 18 Q ${talon.cx + 3} 27 ${talon.cx} 36`}
                                                fill="none"
                                                stroke={isEarned ? '#ffffff' : '#1e293b'}
                                                strokeWidth="1"
                                                opacity={isEarned ? 0.9 : 0.3}
                                            />
                                            {/* Glowing Apex Pip */}
                                            <circle
                                                cx={talon.cx - 1}
                                                cy="27"
                                                r="1.6"
                                                fill={isEarned ? '#ffffff' : '#1e293b'}
                                            />
                                        </g>
                                    ) : (
                                        /* 5TH MARK: APEX EXECUTION SERRATED SUPERNOVA TALON */
                                        <g>
                                            {/* Blazing Outer Halo when active */}
                                            {isEarned && (
                                                <circle
                                                    cx={talon.cx}
                                                    cy={talon.cy}
                                                    r="19"
                                                    fill="none"
                                                    stroke="#f43f5e"
                                                    strokeWidth="2"
                                                    strokeDasharray="3 2"
                                                    filter="url(#apexZenithGlow)"
                                                />
                                            )}

                                            {/* Massive Serrated Execution Talon */}
                                            <path
                                                d={`M ${talon.cx - 11} 13 C ${talon.cx + 3} 10, ${talon.cx + 13} 22, ${talon.cx + 1} 43 C ${talon.cx - 7} 36, ${talon.cx - 11} 26, ${talon.cx - 11} 13 Z`}
                                                fill={isEarned ? 'url(#apexZenithGrad)' : '#0d0c18'}
                                                stroke={isEarned ? '#ffffff' : '#475569'}
                                                strokeWidth={isEarned ? '2' : '1'}
                                                filter={isEarned ? 'url(#apexZenithGlow)' : undefined}
                                            />

                                            {/* Searing Execution Spine */}
                                            <path
                                                d={`M ${talon.cx - 4} 15 Q ${talon.cx + 4} 27 ${talon.cx + 1} 39`}
                                                fill="none"
                                                stroke={isEarned ? '#ffffff' : '#334155'}
                                                strokeWidth="1.4"
                                            />

                                            {/* Searing Cardinal Flares on Mark 5 */}
                                            {isEarned && (
                                                <g>
                                                    <line x1={talon.cx - 15} y1={talon.cy} x2={talon.cx - 12} y2={talon.cy} stroke="#ffffff" strokeWidth="1.6" />
                                                    <line x1={talon.cx + 12} y1={talon.cy} x2={talon.cx + 15} y2={talon.cy} stroke="#ffffff" strokeWidth="1.6" />
                                                    <line x1={talon.cx} y1="8" x2={talon.cx} y2="11" stroke="#ffffff" strokeWidth="1.6" />
                                                    <line x1={talon.cx} y1="45" x2={talon.cx} y2="48" stroke="#ffffff" strokeWidth="1.6" />
                                                </g>
                                            )}
                                        </g>
                                    )}

                                    {/* Dedicated Talon Click Hitbox */}
                                    <rect
                                        x={talon.cx - 14}
                                        y="6"
                                        width="28"
                                        height="44"
                                        fill="transparent"
                                        pointerEvents="all"
                                    >
                                        <title>{isOwner ? `Quarry Mark ${talon.index}${isTalonApex ? ' (Kill-State)' : ''} - Click to toggle` : `Mark ${talon.index}`}</title>
                                    </rect>
                                </g>
                            );
                        })}

                        {/* 6. RIGHT FLANK TRIGGER: GLAIVE RAZOR STEPPER (►) */}
                        <g
                            className="apex-flank-trigger apex-flank-right"
                            onClick={handleAdvanceMarks}
                            style={{ cursor: isOwner ? 'pointer' : 'default' }}
                        >
                            {/* Curved Razor Glaive Blade */}
                            <path
                                d="M 336 12 C 350 16, 352 40, 336 44 C 343 38, 343 18, 336 12 Z"
                                fill="url(#apexBladeGrad)"
                                stroke="#94a3b8"
                                strokeWidth="1"
                                filter="url(#apexGlow)"
                            />
                            {/* Tactile Advance Chevron ► */}
                            <polygon
                                points="345,28 340,24 340,32"
                                fill={isOwner ? '#fca5a5' : '#64748b'}
                                opacity="0.9"
                            />
                            {/* Bloodfire Pivot Gem */}
                            <circle cx="339" cy="28" r="1.8" fill="#f43f5e" />

                            {/* Full-Height Transparent Hitbox */}
                            <rect
                                x="326"
                                y="4"
                                width="32"
                                height="48"
                                fill="transparent"
                                pointerEvents="all"
                            >
                                <title>{isOwner ? 'Advance Marks (Click: +1 Mark, Shift: Max 5 Marks)' : 'Glaive Stepper'}</title>
                            </rect>
                        </g>
                    </svg>
                </div>
            </div>

            {/* Shared ClassTip Tooltip */}
            {showTooltip && ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip apex-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}>
                    <ClassTip
                        icon="fas fa-paw"
                        tint="#ef4444"
                        title="The Predator's Kill-Ledger"
                        subtitle="Apex Quarry Ledger & Pack Hunt"
                        state={`Marks: ${marks}/${maxMarks} · HP: ${companionHP}/${companionMaxHP}`}
                        stateTone={isApexReady ? 'critical' : 'good'}
                        mechanic="Quarry Marks track your prey across the hunt. Five marks triggers Apex Execution — your greatest kill. The companion token on the map acts independently; manage its HP and stance via the Pack Codex menu."
                        status={[
                            isApexReady
                                ? 'APEX EXECUTION PRIMED: Unleash multi-target shadow glaive chain or execution rend!'
                                : `Quarry Marks: ${marks} of ${maxMarks} claimed.`,
                            `Pack Stance: ${companionStance} — Companion at ${companionHP}/${companionMaxHP} HP.`
                        ]}
                        usage={isOwner ? 'Right-click for Pack Codex. Click talons to set marks. Click flank chevrons to step marks.' : null}
                    />
                </div>,
                document.body
            )}

            {/* Player Controls Menu - Unified Warm Parchment Theme */}
            {showControls && ReactDOM.createPortal(
                <div
                    ref={controlsMenuRef}
                    className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                    onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                    onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                    style={{
                        position: 'fixed',
                        top: (() => {
                            if (!barRef.current) return '50%';
                            const rect = barRef.current.getBoundingClientRect();
                            let hudContainer = barRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                            let hudBottom = rect.bottom;
                            if (hudContainer) {
                                const hudRect = hudContainer.getBoundingClientRect();
                                hudBottom = hudRect.bottom;
                            }
                            return hudBottom + 8;
                        })(),
                        left: (() => {
                            if (!barRef.current) return '50%';
                            const rect = barRef.current.getBoundingClientRect();
                            return rect.left + (rect.width / 2);
                        })(),
                        transform: 'translateX(-50%)',
                        zIndex: 100000
                    }}
                >
                    <div className="context-menu-main">
                        <div className="context-menu-section">
                            <div className="context-menu-section-header">
                                <i className="fas fa-paw" style={{ marginRight: '6px', color: '#ef4444' }}></i>
                                The Silent Hunt: Pack Codex
                            </div>

                            {/* Marks Display & Steppers */}
                            <div className="context-menu-section-header" style={{ fontSize: '12px', marginTop: '6px', marginBottom: '4px' }}>
                                Quarry Marks: {marks} / {maxMarks} {isApexReady ? '(Apex Primed!)' : ''}
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '3px', marginBottom: '8px' }}>
                                {[0, 1, 2, 3, 4, 5].map((val) => (
                                    <button
                                        key={val}
                                        className={`context-menu-button ${marks === val ? 'active gain' : ''}`}
                                        onClick={() => updateMarks(val)}
                                        style={{ fontSize: '11px', padding: '4px 2px' }}
                                    >
                                        {val === 5 ? '5 [APEX]' : val}
                                    </button>
                                ))}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                <button className="context-menu-button spend" onClick={(e) => handleRegressMarks(e)}>
                                    <i className="fas fa-minus"></i> -1 Mark
                                </button>
                                <button className="context-menu-button gain" onClick={(e) => handleAdvanceMarks(e)}>
                                    <i className="fas fa-plus"></i> +1 Mark
                                </button>
                            </div>

                            <div className="context-menu-main-separator" style={{ margin: '8px 0' }}></div>

                            {/* Beast Companion Management */}
                            <div className="context-menu-section-header" style={{ fontSize: '12px', marginBottom: '4px' }}>
                                Companion Vitality: {companionHP} / {companionMaxHP} HP
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '3px', marginBottom: '8px' }}>
                                <button className="context-menu-button spend" onClick={() => updateCompanionHP(companionHP - 10)}>
                                    -10 HP
                                </button>
                                <button className="context-menu-button spend" onClick={() => updateCompanionHP(companionHP - 5)}>
                                    -5 HP
                                </button>
                                <button className="context-menu-button gain" onClick={() => updateCompanionHP(companionHP + 5)}>
                                    +5 HP
                                </button>
                                <button className="context-menu-button gain" onClick={() => updateCompanionHP(companionMaxHP)}>
                                    Max HP
                                </button>
                            </div>

                            {/* Companion Stance Selector */}
                            <div className="context-menu-section-header" style={{ fontSize: '11px', color: '#555', marginBottom: '4px' }}>
                                Companion Stance:
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3px', marginBottom: '8px' }}>
                                {['Hunt', 'Guard', 'Stalk'].map((st) => (
                                    <button
                                        key={st}
                                        className={`context-menu-button ${companionStance === st ? 'active' : ''}`}
                                        onClick={() => updateStance(st)}
                                        style={{ fontSize: '10px', padding: '4px 2px' }}
                                    >
                                        {st}
                                    </button>
                                ))}
                            </div>

                            <div className="context-menu-main-separator" style={{ margin: '8px 0' }}></div>

                            {/* Quick Presets */}
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                                <button
                                    className="context-menu-button gain"
                                    onClick={() => {
                                        updateMarks(5);
                                        setShowControls(false);
                                    }}
                                    style={{ flex: 1 }}
                                >
                                    <i className="fas fa-crosshairs"></i> Apex Execution
                                </button>
                                <button
                                    className="context-menu-button"
                                    onClick={() => {
                                        updateMarks(0);
                                        updateCompanionHP(companionMaxHP);
                                        setShowControls(false);
                                    }}
                                    style={{ flex: 1 }}
                                >
                                    <i className="fas fa-undo"></i> Reset Pack
                                </button>
                            </div>

                            <button
                                className="context-menu-button danger"
                                onClick={() => setShowControls(false)}
                                style={{ width: '100%' }}
                            >
                                <i className="fas fa-times"></i> Close
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default ApexResourceBar;
