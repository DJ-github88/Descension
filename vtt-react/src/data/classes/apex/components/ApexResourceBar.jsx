import ClassMenuSpells from '../../../../components/hud/ClassMenuSpells';
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/ApexResourceBar.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import '../../../../styles/unified-context-menu.css';
import ClassTip from '../../../../components/hud/ClassTip';
import useCreatureStore from '../../../../store/creatureStore';
import { APEX_MARK_MAX, APEX_PACK_EVENTS, normalizeApexResource, applyApexPackEvent, beginApexOwnTurn, getApexCompanionStatus, getApexTurnCap } from '../../../apexResourceContract';

import { INK, PAGE, PAPER, PANEL, RULE, ETCH, inked, washed } from '../../../../components/hud/calmBarPalette';
const EMPTY_TOKENS = [];

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
    onClassResourceUpdate = null,
    showcase = false
}) => {
    const normalizedResource = normalizeApexResource(classResource);
    const maxMarks = APEX_MARK_MAX;
    const propMarks = normalizedResource.current;
    const propCompanionHP = classResource?.companionHP ?? 50;
    const propCompanionMaxHP = classResource?.companionMaxHP ?? 50;
    const propStance = classResource?.companionStance || 'Hunt';

    const [marks, setMarks] = useState(propMarks);
    const [companionHP, setCompanionHP] = useState(propCompanionHP);
    const [companionMaxHP, setCompanionMaxHP] = useState(propCompanionMaxHP);
    const [companionStance, setCompanionStance] = useState(propStance);
    const [generation, setGeneration] = useState(normalizedResource.apexGeneration);
    const [companionTokenId, setCompanionTokenId] = useState(classResource.companionTokenId || '');
    const [reportedAvailable, setReportedAvailable] = useState(classResource.companionAvailable === true);
    const [targetReference, setTargetReference] = useState('');
    const eventSequence = useRef(0);
    const creatureTokens = useCreatureStore(state => state.creatureTokens) || EMPTY_TOKENS;
    const primarySpecialization = useCharacterStore(state => state.primarySpecialization);
    const specialization = (!showcase && primarySpecialization) || classResource.apexSpecialization || classResource.spec;
    const turnCap = getApexTurnCap(specialization);
    const localResource = { ...classResource, current: marks, apexGeneration: generation, companionTokenId, companionAvailable: reportedAvailable };
    const companionStatus = getApexCompanionStatus(localResource, creatureTokens);

    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);

    useEffect(() => {
        setMarks(propMarks);
    }, [propMarks]);

    useEffect(() => { setGeneration(normalizedResource.apexGeneration); }, [classResource.apexGeneration]);
    useEffect(() => { setCompanionTokenId(classResource.companionTokenId || ''); }, [classResource.companionTokenId]);
    useEffect(() => { setReportedAvailable(classResource.companionAvailable === true); }, [classResource.companionAvailable]);

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
        const clamped = normalizeApexResource({ current: newMarks }).current;
        setMarks(clamped);
        logResourceChange(`adjusted Quarry Marks to ${clamped}/${maxMarks}`, clamped);

        if (onClassResourceUpdate) {
            onClassResourceUpdate('current', clamped);
        }
    };

    const commitPackResource = next => {
        setGeneration(next.apexGeneration);
        setMarks(next.current);
        if (onClassResourceUpdate) {
            onClassResourceUpdate('apexGeneration', next.apexGeneration);
            onClassResourceUpdate('current', next.current);
        }
    };

    const recordPackOutcome = kind => {
        if (!isOwner) return;
        const latestTokens = useCreatureStore.getState().creatureTokens || EMPTY_TOKENS;
        const result = applyApexPackEvent(localResource, {
            kind, turn: generation.turn,
            id: `reported:${generation.turn}:${Date.now()}:${++eventSequence.current}`,
            companionTokenId,
            hunterTargetId: targetReference.trim(), companionTargetId: targetReference.trim()
        }, { companionAvailable: getApexCompanionStatus(localResource, latestTokens).available, specialization });
        if (!result.accepted) return;
        commitPackResource(result.resource);
        logResourceChange(`recorded ${kind.replace(/_/g, ' ')}: +${result.gained} Marks (${result.resource.apexGeneration.generated}/${turnCap} generated this own turn)`, result.gained);
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
                        <defs />

                        {/* 1. SHADOW GLAIVE CHASSIS & PREDATOR FRAME */}
                        <g>
                            {/* Sweeping Glaive Blade Perimeter */}
                            <path
                                d="M 12 7 C 75 3, 285 3, 348 7 C 356 7, 358 15, 356 28 C 358 41, 356 49, 348 49 C 285 53, 75 53, 12 49 C 4 49, 2 41, 4 28 C 2 15, 4 7, 12 7 Z"
                                fill={PAPER}
                                stroke={isApexReady ? inked('#f43f5e', 0.6) : RULE}
                                strokeWidth={isApexReady ? '1.8' : '1.4'}
                            />
                            {/* Inner Recessed Night-Steel Channel */}
                            <path
                                d="M 14 9.5 C 75 5.5, 285 5.5, 346 9.5 C 353 9.5, 355 17, 353 28 C 355 39, 353 46.5, 346 46.5 C 285 50.5, 75 50.5, 14 46.5 C 7 46.5, 5 39, 7 28 C 5 17, 7 9.5, 14 9.5 Z"
                                fill={PAPER}
                                stroke={ETCH}
                                strokeWidth="0.8"
                            />
                        </g>

                        {/* Etched Glaive Tracking Ley-Lines */}
                        <path
                            d="M 28 28 Q 145 34 332 28"
                            fill="none"
                            stroke={RULE}
                            strokeWidth="3.2"
                        />
                        <path
                            d="M 28 28 Q 145 34 332 28"
                            fill="none"
                            stroke={isApexReady ? inked('#f43f5e', 0.6) : RULE}
                            strokeWidth="1"
                            strokeDasharray="3 3"
                            opacity={isApexReady ? '0.85' : '0.45'}
                        />

                        {/* Astrolabe / Tracking Graduation Marks */}
                        {[22, 38, 54, 76, 96, 116, 145, 176, 206, 236, 266, 298, 320, 338].map((tx, i) => (
                            <g key={i}>
                                <line x1={tx} y1="8" x2={tx} y2="11.5" stroke={RULE} strokeWidth="0.8" />
                                <line x1={tx} y1="44.5" x2={tx} y2="48" stroke={RULE} strokeWidth="0.8" />
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
                                fill={PAPER}
                                stroke={inked('#94a3b8', 0.6)}
                                strokeWidth="1"
                            />
                            {/* Tactile Regress Chevron ◄ */}
                            <polygon
                                points="15,28 20,24 20,32"
                                fill={isOwner ? washed('#e2e8f0', 0.2) : PANEL}
                                opacity="0.9"
                            />
                            {/* Shadow Pivot Gem */}
                            <circle cx="21" cy="28" r="1.8" fill={washed('#f43f5e', 0.2)} />

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
                                            stroke={isTalonApex ? inked('#f43f5e', 0.6) : inked('#ef4444', 0.6)}
                                            strokeWidth="1.4"
                                            opacity={isTalonApex ? 0.9 : 0.6}
                                        />
                                    )}

                                    {/* Mark Talon Blade Setting & Body */}
                                    {!isTalonApex ? (
                                        /* Standard Quarry Mark Talon (1-4) */
                                        <g>
                                            {/* Outer Claw Socket */}
                                            <path
                                                d={`M ${talon.cx - 9} 16 C ${talon.cx + 1} 13, ${talon.cx + 9} 24, ${talon.cx} 40 C ${talon.cx - 6} 34, ${talon.cx - 9} 26, ${talon.cx - 9} 16 Z`}
                                                fill={isEarned ? washed('#ef4444', 0.2) : PAPER}
                                                stroke={isEarned ? inked('#fca5a5', 0.6) : RULE}
                                                strokeWidth={isEarned ? '1.4' : '0.9'}
                                            />
                                            {/* Talon Inner Spine */}
                                            <path
                                                d={`M ${talon.cx - 3} 18 Q ${talon.cx + 3} 27 ${talon.cx} 36`}
                                                fill="none"
                                                stroke={isEarned ? INK : RULE}
                                                strokeWidth="1"
                                                opacity={isEarned ? 0.9 : 0.3}
                                            />
                                            {/* Glowing Apex Pip */}
                                            <circle
                                                cx={talon.cx - 1}
                                                cy="27"
                                                r="1.6"
                                                fill={isEarned ? PAGE : PAPER}
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
                                                    stroke={inked('#f43f5e', 0.6)}
                                                    strokeWidth="2"
                                                    strokeDasharray="3 2"
                                                />
                                            )}

                                            {/* Massive Serrated Execution Talon */}
                                            <path
                                                d={`M ${talon.cx - 11} 13 C ${talon.cx + 3} 10, ${talon.cx + 13} 22, ${talon.cx + 1} 43 C ${talon.cx - 7} 36, ${talon.cx - 11} 26, ${talon.cx - 11} 13 Z`}
                                                fill={isEarned ? washed('#f43f5e', 0.2) : PAPER}
                                                stroke={isEarned ? INK : RULE}
                                                strokeWidth={isEarned ? '2' : '1'}
                                            />

                                            {/* Searing Execution Spine */}
                                            <path
                                                d={`M ${talon.cx - 4} 15 Q ${talon.cx + 4} 27 ${talon.cx + 1} 39`}
                                                fill="none"
                                                stroke={isEarned ? INK : RULE}
                                                strokeWidth="1.4"
                                            />

                                            {/* Searing Cardinal Flares on Mark 5 */}
                                            {isEarned && (
                                                <g>
                                                    <line x1={talon.cx - 15} y1={talon.cy} x2={talon.cx - 12} y2={talon.cy} stroke={INK} strokeWidth="1.6" />
                                                    <line x1={talon.cx + 12} y1={talon.cy} x2={talon.cx + 15} y2={talon.cy} stroke={INK} strokeWidth="1.6" />
                                                    <line x1={talon.cx} y1="8" x2={talon.cx} y2="11" stroke={INK} strokeWidth="1.6" />
                                                    <line x1={talon.cx} y1="45" x2={talon.cx} y2="48" stroke={INK} strokeWidth="1.6" />
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
                                fill={PAPER}
                                stroke={inked('#94a3b8', 0.6)}
                                strokeWidth="1"
                            />
                            {/* Tactile Advance Chevron ► */}
                            <polygon
                                points="345,28 340,24 340,32"
                                fill={isOwner ? washed('#fca5a5', 0.2) : PANEL}
                                opacity="0.9"
                            />
                            {/* Bloodfire Pivot Gem */}
                            <circle cx="339" cy="28" r="1.8" fill={washed('#f43f5e', 0.2)} />

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
            {showTooltip && !showControls && ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip apex-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}>
                    <ClassTip
                        icon="fas fa-paw"
                        tint="#ef4444"
                        title="Quarry Marks"
                        subtitle="Apex Predator's Crosshairs & Pack"
                        state={`Marks: ${marks}/${maxMarks} · HP: ${companionHP}/${companionMaxHP}`}
                        stateTone={isApexReady ? 'good' : 'neutral'}
                        mechanic="Marks (0–5) come only from pack synergy: coordinated strikes, companion hits and crits, Mark Quarry. A fallen companion stops generation. Spend on chains and finishers; 5 primes the ultimate."
                        status={[
                            isApexReady
                                ? { text: '5/5 Marks — ultimate finisher primed.', tone: 'good' }
                                : `Marks: ${marks}/${maxMarks} banked via the pack.`,
                            `${generation.generated}/${turnCap} generated in own-turn window ${generation.turn}. Spending does not refund this limit.`,
                            `Companion: ${companionStance} · ${companionHP}/${companionMaxHP} HP.`
                        ]}
                        usage={isOwner ? 'Click chassis for Pack Codex and report resolved pack outcomes. Talons and chevrons are manual corrections.' : null}
                    />
                </div>,
                document.body
            )}

            {/* Player Controls Menu - Unified Warm Parchment Theme */}
            {showControls && ReactDOM.createPortal(
                <div
                    ref={controlsMenuRef}
                    className={`unified-context-menu compact context-menu-container apex-menu-container class-resource-menu ${context === 'party' ? 'chronarch-party' : ''}`}
                    onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                    onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                    onMouseEnter={(e) => {
                        e.stopPropagation();
                        setShowTooltip(false);
                    }}
                    onMouseMove={(e) => e.stopPropagation()}
                    onMouseOver={(e) => e.stopPropagation()}
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
                            const menuHeight = Math.min(600, window.innerHeight - 24);
                            return Math.max(12, Math.min(hudBottom + 8, window.innerHeight - menuHeight - 12));
                        })(),
                        left: (() => {
                            if (!barRef.current) return '50%';
                            const rect = barRef.current.getBoundingClientRect();
                            const menuWidth = Math.min(340, window.innerWidth - 24);
                            return Math.max(12, Math.min(rect.left + rect.width / 2 - menuWidth / 2, window.innerWidth - menuWidth - 12));
                        })(),
                        width: Math.min(340, window.innerWidth - 24),
                        maxHeight: Math.min(600, window.innerHeight - 24),
                        overflowY: 'auto',
                        boxSizing: 'border-box',
                        zIndex: 100000
                    }}
                >
                    <div className="cm" style={{ '--cm-accent': '#4a7340', '--cm-accent-deep': '#24401f', '--cm-wash': '#e4ead6' }}>
                        <header className="cm-head">
                            <span className={`cm-seal ${marks === 0 ? 'is-quiet' : ''}`}>{marks}</span>
                            <div className="cm-titles">
                                <div className="cm-eyebrow">The Silent Hunt: Pack Codex</div>
                                <div className="cm-title">{isApexReady ? 'Apex Primed' : marks >= 3 ? 'Closing In' : marks >= 1 ? 'On the Scent' : 'Unseen'}</div>
                                <div className="cm-sub">Quarry Marks: {marks} / {maxMarks}. {isApexReady ? 'The quarry is yours.' : 'You and the beast hunt as one.'}</div>
                            </div>
                            <button type="button" className="cm-x" aria-label="Close menu" onClick={() => setShowControls(false)}>
                                <i className="fas fa-times" aria-hidden="true"></i>
                            </button>
                        </header>
                        <div className="cm-track" style={{ '--cm-cols': 6 }} role="group" aria-label="Set Quarry Marks">
                            {[0, 1, 2, 3, 4, 5].map((val) => (
                                <button
                                    key={val}
                                    type="button"
                                    className={`cm-pip ${marks === val ? 'active' : ''} ${marks >= val && val > 0 ? 'lit' : ''} ${val === 5 ? 'gate' : ''}`}
                                    title={`Set marks to ${val}`}
                                    onClick={() => updateMarks(val)}
                                >
                                    {val}{val === 5 && <small>Apex</small>}
                                </button>
                            ))}
                        </div>
                        <div className="cm-row">
                            <button type="button" className="context-menu-button spend" onClick={(e) => handleRegressMarks(e)}>
                                -1 Mark
                            </button>
                            <button type="button" className="context-menu-button gain" onClick={(e) => handleAdvanceMarks(e)}>
                                +1 Mark
                            </button>
                        </div>

                        <div className="cm-section">
                            The pack's work
                            <span className="cm-section-aside">Turn {generation.turn}: {generation.generated} / {turnCap} earned</span>
                        </div>
                        <label className="cm-field">
                            <span className="cm-field-label">Companion token</span>
                            <select aria-label="Companion token" value={companionTokenId} onChange={e => {
                                setCompanionTokenId(e.target.value);
                                onClassResourceUpdate?.('companionTokenId', e.target.value);
                            }}>
                                <option value="">Use reported companion status</option>
                                {creatureTokens.map(token => <option key={token.id} value={token.id}>{token.name || token.id}</option>)}
                            </select>
                        </label>
                        {companionTokenId ? (
                            <p className={`cm-line ${companionStatus.available ? '' : 'is-quiet'}`}>{companionStatus.name}: {companionStatus.available ? 'available' : 'unavailable'} (canvas state)</p>
                        ) : (
                            <label className="cm-check">
                                <input type="checkbox" checked={reportedAvailable} onChange={e => {
                                    setReportedAvailable(e.target.checked);
                                    onClassResourceUpdate?.('companionAvailable', e.target.checked);
                                }} /> Companion available (reported)
                            </label>
                        )}
                        <input className="cm-input" aria-label="Coordinated strike quarry reference" placeholder="Same quarry: both attacks hit" value={targetReference}
                            onChange={e => setTargetReference(e.target.value)} />
                        <div className="cm-row cm-row-list">
                            {Object.entries(APEX_PACK_EVENTS).map(([kind, rule]) => (
                                <button key={kind} type="button" className="context-menu-button"
                                    onClick={() => recordPackOutcome(kind)} disabled={!companionStatus.available || generation.generated >= turnCap ||
                                        (kind === 'coordinated_strike' && !targetReference.trim())}>{rule.label}</button>
                            ))}
                        </div>
                        <button type="button" className="cm-btn" onClick={() => commitPackResource(beginApexOwnTurn(localResource))}>Begin next own turn</button>

                        <div className="cm-section">
                            Companion
                            <span className="cm-section-aside">{companionHP} / {companionMaxHP} HP</span>
                        </div>
                        <div className="cm-meter" aria-hidden="true"><span style={{ width: `${companionMaxHP ? Math.min(100, (companionHP / companionMaxHP) * 100) : 0}%` }}></span></div>
                        <div className="cm-row" style={{ '--cm-cols': 4 }}>
                            <button type="button" className="context-menu-button spend" onClick={() => updateCompanionHP(companionHP - 10)}>-10 HP</button>
                            <button type="button" className="context-menu-button spend" onClick={() => updateCompanionHP(companionHP - 5)}>-5 HP</button>
                            <button type="button" className="context-menu-button gain" onClick={() => updateCompanionHP(companionHP + 5)}>+5 HP</button>
                            <button type="button" className="context-menu-button gain" onClick={() => updateCompanionHP(companionMaxHP)}>Max HP</button>
                        </div>
                        <div className="cm-row" style={{ '--cm-cols': 3 }} role="group" aria-label="Companion stance">
                            <span className="cm-row-label">Stance</span>
                            {['Hunt', 'Guard', 'Stalk'].map((st) => (
                                <button key={st} type="button" className={`context-menu-button ${companionStance === st ? 'active' : ''}`} onClick={() => updateStance(st)}>{st}</button>
                            ))}
                        </div>

                        <ClassMenuSpells className="Apex" resourceTypes={['marks']} resourceLabel="Quarry Marks" current={marks} />
                        <details className="cm-notes">
                            <summary>How the hunt works</summary>
                            <p>Record each resolved pack outcome once; marks earned per turn are capped by your specialization.</p>
                            <p>Advance at the start of your own turn, not at a round boundary. Automatic outcome and turn detection is still pending.</p>
                        </details>
                        <div className="cm-foot">
                            <button type="button" className="context-menu-button quiet" onClick={() => { updateMarks(0); updateCompanionHP(companionMaxHP); setShowControls(false); }}>
                                <i className="fas fa-undo" aria-hidden="true"></i> Reset Pack
                            </button>
                            <button type="button" className="context-menu-button danger" onClick={() => { updateMarks(5); setShowControls(false); }}>
                                <i className="fas fa-crosshairs" aria-hidden="true"></i> Apex Execution
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
