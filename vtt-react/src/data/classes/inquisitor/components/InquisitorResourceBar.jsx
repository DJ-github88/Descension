import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/InquisitorResourceBar.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import '../../../../styles/unified-context-menu.css';
import ClassTip from '../../../../components/hud/ClassTip';
import { INK, MUTED, PAGE, PAPER, PANEL, RULE, ETCH, BRICK, BRASS, mix, inked, washed } from '../../../../components/hud/calmBarPalette';
import ClassMenuSpells from '../../../../components/hud/ClassMenuSpells';
import { INQUISITOR_AUTHORITY_MAX, normalizeInquisitorResource } from '../../../inquisitorResourceContract';

/**
 * Inquisitor Resource Bar: "The Barbed Leash of the Damned & Caged Anathema Collar"
 *
 * Full 360px wide visceral inquisitorial apparatus:
 * - Left Flank Trigger: Cold-Iron Anathema Brand (+1 Authority, Shift: Max 8, Alt: -1)
 * - The 8 Barbed Hex-Links: Heavy interlocking cold-iron chain links with razor barbs (.inq-hex-link.sealed)
 * - Centerpiece: The Spiked Demon-Collar & Anathema Guillotine (.inq-center-collar)
 * - Right Flank Trigger: Severance Guillotine Cleaver (+1 Authority, Shift: Max 8, Alt: -1)
 */
const InquisitorResourceBar = ({
    classResource = {},
    size = 'normal',
    config = {},
    context = 'hud',
    isOwner = true,
    onClassResourceUpdate = null
}) => {
    const normalizedResource = normalizeInquisitorResource(classResource);
    const propAuthority = normalizedResource.current;
    const [localAuthority, setLocalAuthority] = useState(propAuthority);

    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [auraActive, setAuraActive] = useState(normalizedResource.nullAura.active);

    const maxAuthority = INQUISITOR_AUTHORITY_MAX;

    useEffect(() => {
        setLocalAuthority(propAuthority);
    }, [propAuthority]);
    useEffect(() => { setAuraActive(normalizedResource.nullAura.active); }, [normalizedResource.nullAura.active]);

    const barRef = useRef(null);
    const controlsMenuRef = useRef(null);
    const tooltipRef = useResourceBarTooltip(barRef, showTooltip, [localAuthority]);

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

    const logClassResourceChange = (resourceName, amount, isPositive, resourceType = 'classResource') => {
        const absAmount = Math.abs(amount);
        const actorName = getActorName();
        const characterName = currentPlayerName || 'Character';

        const message = isPositive
            ? `${characterName} established ${absAmount} ${resourceName}`
            : `${characterName} executed ${absAmount} ${resourceName}`;

        addCombatNotification({
            type: 'combat_resource',
            attacker: actorName,
            target: characterName,
            amount: absAmount,
            resourceType: resourceType,
            isPositive: isPositive,
            customMessage: message
        });
    };

    const handleAuthorityChange = (delta) => {
        if (!isOwner) return;
        const newValue = Math.max(0, Math.min(maxAuthority, localAuthority + delta));
        const diff = Math.abs(newValue - localAuthority);
        if (diff > 0) {
            setLocalAuthority(newValue);
            if (newValue === 0) setAuraActive(false);
            logClassResourceChange('Authority', diff, delta > 0, 'authority');
            if (onClassResourceUpdate) {
                onClassResourceUpdate('authority', newValue);
                onClassResourceUpdate('current', newValue);
            }
        }
    };

    const setAuthorityDirect = (targetValue) => {
        if (!isOwner) return;
        const clamped = Math.max(0, Math.min(maxAuthority, targetValue));
        const diff = Math.abs(clamped - localAuthority);
        if (diff > 0) {
            const isPositive = clamped > localAuthority;
            setLocalAuthority(clamped);
            if (clamped === 0) setAuraActive(false);
            logClassResourceChange('Authority', diff, isPositive, 'authority');
            if (onClassResourceUpdate) {
                onClassResourceUpdate('authority', clamped);
                onClassResourceUpdate('current', clamped);
            }
        }
    };

    const handleLinkClick = (e, index) => {
        e.stopPropagation();
        if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation();
        if (!isOwner) return;
        const target = localAuthority === index ? index - 1 : index;
        setAuthorityDirect(target);
    };

    const handleLeftFlankClick = (e) => {
        e.stopPropagation();
        if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation();
        if (!isOwner) return;
        if (e.shiftKey) {
            setAuthorityDirect(maxAuthority);
        } else if (e.altKey || e.ctrlKey) {
            handleAuthorityChange(-1);
        } else {
            handleAuthorityChange(1);
        }
    };

    const handleRightFlankClick = (e) => {
        e.stopPropagation();
        if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation();
        if (!isOwner) return;
        if (e.shiftKey) {
            setAuthorityDirect(maxAuthority);
        } else if (e.altKey || e.ctrlKey) {
            handleAuthorityChange(-1);
        } else {
            handleAuthorityChange(1);
        }
    };

    // 8 Hex-Link centers across the barbed leash:
    // Left wing (Links 1-4): cx = [44, 74, 104, 134]
    // Right wing (Links 5-8): cx = [226, 256, 286, 316]
    const hexLinks = [
        { id: 1, cx: 44, cy: 28 },
        { id: 2, cx: 74, cy: 28 },
        { id: 3, cx: 104, cy: 28 },
        { id: 4, cx: 134, cy: 28 },
        { id: 5, cx: 226, cy: 28 },
        { id: 6, cx: 256, cy: 28 },
        { id: 7, cx: 286, cy: 28 },
        { id: 8, cx: 316, cy: 28 }
    ];

    const isAbsoluteVerdict = localAuthority >= 8;
    const isBindingTaut = localAuthority >= 4;

    return (
        <div className={`inquisitor-resource-container ${size} context-${context}`}>
            <div className="resource-bar-row">
                <div
                    ref={barRef}
                    role="slider"
                    tabIndex={isOwner ? 0 : -1}
                    aria-label={`Inquisitor Authority ${localAuthority} of 8; null aura ${auraActive && localAuthority > 0 ? 'active' : 'released'}`}
                    aria-valuemin={0}
                    aria-valuemax={8}
                    aria-valuenow={localAuthority}
                    onKeyDown={event => {
                        if (!isOwner) return;
                        if (['ArrowRight', 'ArrowUp', 'ArrowLeft', 'ArrowDown'].includes(event.key)) {
                            event.preventDefault();
                            handleAuthorityChange(['ArrowRight', 'ArrowUp'].includes(event.key) ? 1 : -1);
                        } else if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            setShowControls(value => !value);
                        }
                    }}
                    className={`inquisitor-resource-bar ${size} ${isAbsoluteVerdict ? 'verdict-absolute' : ''} clickable`}
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
                        className="inquisitor-leash-svg"
                        viewBox="0 0 360 56"
                        preserveAspectRatio="xMidYMid meet"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs />

                        {/* 1. LEDGER PAGE AND LEASH RUNWAY */}
                        <rect x="2" y="2" width="356" height="52" rx="3" fill={PAGE} stroke={RULE} strokeWidth="1" />
                        <path d="M 12 28 Q 180 34 348 28" fill="none" stroke={PANEL} strokeWidth="24" strokeLinecap="round" />
                        <path d="M 18 28 Q 180 32 342 28" fill="none" stroke={PAPER} strokeWidth="16" strokeLinecap="round" />

                        {/* 2. BARBED WIRE RUNNERS LACING THE LEASH */}
                        {/* Upper Barbed Strand with Razor Barbs */}
                        <path
                            d="M 18 17 Q 90 14 160 18 M 200 18 Q 270 14 342 17"
                            fill="none"
                            stroke={isAbsoluteVerdict ? BRASS : isBindingTaut ? BRICK : RULE}
                            strokeWidth="1.2"
                        />
                        {[30, 60, 90, 120, 150, 210, 240, 270, 300, 330].map((bx, i) => (
                            <path
                                key={i}
                                d={`M ${bx - 3} 14 L ${bx + 3} 20 M ${bx + 3} 14 L ${bx - 3} 20`}
                                stroke={isAbsoluteVerdict ? BRASS : isBindingTaut ? BRICK : ETCH}
                                strokeWidth="1"
                                strokeLinecap="round"
                            />
                        ))}

                        {/* Lower Barbed Strand with Razor Barbs */}
                        <path
                            d="M 18 39 Q 90 42 160 38 M 200 38 Q 270 42 342 39"
                            fill="none"
                            stroke={isAbsoluteVerdict ? BRASS : isBindingTaut ? BRICK : RULE}
                            strokeWidth="1.2"
                        />
                        {[40, 70, 100, 130, 220, 250, 280, 310, 340].map((bx, i) => (
                            <path
                                key={i}
                                d={`M ${bx - 3} 36 L ${bx + 3} 42 M ${bx + 3} 36 L ${bx - 3} 42`}
                                stroke={isAbsoluteVerdict ? BRASS : isBindingTaut ? BRICK : ETCH}
                                strokeWidth="1"
                                strokeLinecap="round"
                            />
                        ))}

                        {/* Interconnecting Heavy Iron Anchor Pins between Links */}
                        {[59, 89, 119, 241, 271, 301].map((cx, i) => (
                            <g key={i}>
                                <line x1={cx - 3} y1="28" x2={cx + 3} y2="28" stroke={RULE} strokeWidth="2.4" strokeLinecap="round" />
                                <circle cx={cx} cy="28" r="1.4" fill={BRASS} />
                            </g>
                        ))}

                        {/* 3. LEFT FLANK TRIGGER: RUSTED IRON BRAND & ANATHEMA STAKE */}
                        <g
                            className="inq-flank-trigger inq-flank-left"
                            onClick={handleLeftFlankClick}
                            style={{ cursor: isOwner ? 'pointer' : 'default' }}
                        >
                            {/* Brand Grip Mount */}
                            <rect x="6" y="23" width="7" height="10" rx="1.5" fill={PAPER} stroke={RULE} strokeWidth="0.8" />
                            {/* Heavy Spiked Anathema Brand Head */}
                            <path
                                d="M 16 13 L 16 43 M 9 28 L 23 28 M 11 19 L 21 37 M 21 19 L 11 37"
                                stroke={localAuthority > 0 ? BRICK : ETCH}
                                strokeWidth="1.8"
                                strokeLinecap="round"
                            />
                            {/* Burning Salt Ember Core */}
                            <circle
                                cx="16"
                                cy="28"
                                r="2.8"
                                fill={localAuthority > 0 ? BRASS : ETCH}
                            />

                            {/* Full-Height Transparent Hitbox */}
                            <rect x="2" y="2" width="28" height="52" fill="transparent" pointerEvents="all">
                                <title>{isOwner ? 'Gain 1 Authority (Shift: max 8, Alt: −1)' : 'Anathema Brand'}</title>
                            </rect>
                        </g>

                        {/* 4. THE 8 HEAVY COLD-IRON HEX-LINKS */}
                        {hexLinks.map((link) => {
                            const isSealed = localAuthority >= link.id;

                            // Faceted Hexagonal Link Polygon Coordinates (width: 24, height: 34)
                            const w = 12;
                            const h = 17;
                            const cut = 5;
                            const points = [
                                `${link.cx - w + cut},${link.cy - h}`,
                                `${link.cx + w - cut},${link.cy - h}`,
                                `${link.cx + w},${link.cy - h + cut}`,
                                `${link.cx + w},${link.cy + h - cut}`,
                                `${link.cx + w - cut},${link.cy + h}`,
                                `${link.cx - w + cut},${link.cy + h}`,
                                `${link.cx - w},${link.cy + h - cut}`,
                                `${link.cx - w},${link.cy - h + cut}`
                            ].join(' ');

                            return (
                                <g
                                    key={link.id}
                                    className={`inq-hex-link inq-shackle ${isSealed ? 'sealed' : 'open'}`}
                                    onClick={(e) => handleLinkClick(e, link.id)}
                                    style={{ cursor: isOwner ? 'pointer' : 'default' }}
                                >
                                    
                                    {/* Heavy Cold-Iron Hexagonal Link Outer Rim */}
                                    <polygon
                                        points={points}
                                        fill={isSealed ? washed(BRICK, 0.26) : PAPER}
                                        stroke={isSealed ? (isAbsoluteVerdict ? BRASS : inked(BRICK, 0.15)) : RULE}
                                        strokeWidth={isSealed ? '1.4' : '1'}
                                    />

                                    {/* Inner Link Pierced Core */}
                                    <ellipse
                                        cx={link.cx}
                                        cy={link.cy}
                                        rx="5"
                                        ry="8"
                                        fill={isSealed ? PAGE : PANEL}
                                        stroke={isSealed ? BRICK : ETCH}
                                        strokeWidth="0.8"
                                    />

                                    {/* Sealed: Inward Edict Rune / Consecrated Salt Stud */}
                                    {isSealed ? (
                                        <>
                                            {/* Burning cross-rune inside the link core */}
                                            <line x1={link.cx} y1={link.cy - 5} x2={link.cx} y2={link.cy + 5} stroke={BRICK} strokeWidth="1.1" />
                                            <line x1={link.cx - 3.5} y1={link.cy} x2={link.cx + 3.5} y2={link.cy} stroke={BRICK} strokeWidth="1.1" />
                                            <circle cx={link.cx} cy={link.cy} r="1.2" fill={BRICK} />
                                        </>
                                    ) : (
                                        /* Open/Cold Link Keyhole Slot */
                                        <circle cx={link.cx} cy={link.cy} r="1.4" fill={ETCH} />
                                    )}

                                    {/* Razor Barbs extending from top & bottom of each link */}
                                    <path
                                        d={`M ${link.cx - 5} ${link.cy - h} L ${link.cx - 8} ${link.cy - h - 3} M ${link.cx + 5} ${link.cy - h} L ${link.cx + 8} ${link.cy - h - 3}`}
                                        stroke={isSealed ? BRICK : ETCH}
                                        strokeWidth="1"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d={`M ${link.cx - 5} ${link.cy + h} L ${link.cx - 8} ${link.cy + h + 3} M ${link.cx + 5} ${link.cy + h} L ${link.cx + 8} ${link.cy + h + 3}`}
                                        stroke={isSealed ? BRICK : ETCH}
                                        strokeWidth="1"
                                        strokeLinecap="round"
                                    />

                                    {/* Dedicated Transparent Click Target Area */}
                                    <rect
                                        x={link.cx - 14}
                                        y="7"
                                        width="28"
                                        height="42"
                                        fill="transparent"
                                        pointerEvents="all"
                                    >
                                        <title>{isOwner ? `Authority Link ${link.id} (Click to set Authority)` : `Authority Link ${link.id}`}</title>
                                    </rect>
                                </g>
                            );
                        })}

                        {/* 5. CENTERPIECE: THE SPIKED DEMON-COLLAR & ANATHEMA GUILLOTINE */}
                        <g className="inq-center-collar inq-center-gavel">
                            {/* Crossed Cold-Iron Driving Stakes (x: 162 to 198) */}
                            <path d="M 163 10 L 197 46 M 197 10 L 163 46" stroke={RULE} strokeWidth="2" strokeLinecap="round" />

                            {/* Heavy Forged Beast Collar Arch Ring */}
                            <circle
                                cx="180"
                                cy="28"
                                r="17"
                                fill={PAPER}
                                stroke={isAbsoluteVerdict ? BRASS : isBindingTaut ? BRICK : RULE}
                                strokeWidth="1.6"
                            />

                            {/* Inner Collar Bevel */}
                            <circle
                                cx="180"
                                cy="28"
                                r="13"
                                fill={PAGE}
                                stroke={ETCH}
                                strokeWidth="0.8"
                            />

                            {/* 6 Inward Spiked Fangs Clamping the Beast Core */}
                            {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                                const rad = (angle * Math.PI) / 180;
                                const x1 = 180 + Math.cos(rad) * 16;
                                const y1 = 28 + Math.sin(rad) * 16;
                                const x2 = 180 + Math.cos(rad) * 10;
                                const y2 = 28 + Math.sin(rad) * 10;
                                return (
                                    <line
                                        key={i}
                                        x1={x1}
                                        y1={y1}
                                        x2={x2}
                                        y2={y2}
                                        stroke={isAbsoluteVerdict ? BRASS : RULE}
                                        strokeWidth="1.6"
                                        strokeLinecap="round"
                                    />
                                );
                            })}

                            {/* Center Core: The Caged Anathema Horror Eye / Guillotine Keystone */}
                            {isAbsoluteVerdict ? (
                                /* Absolute Verdict (8): Blazing Consecrated White-Gold Judgment Core */
                                <>
                                    <circle cx="180" cy="28" r="8" fill={mix(PAGE, BRASS, 0.4)} stroke={BRASS} strokeWidth="1" />
                                    <circle cx="180" cy="28" r="3.5" fill={PAGE} stroke={BRASS} strokeWidth="0.8" />
                                    {/* Radiating Lightning Sparks */}
                                    <line x1="172" y1="28" x2="188" y2="28" stroke={BRICK} strokeWidth="1.2" />
                                    <line x1="180" y1="20" x2="180" y2="36" stroke={BRICK} strokeWidth="1.2" />
                                </>
                            ) : isBindingTaut ? (
                                /* High Authority (4-7): Glowing demonic slit eye awake in chains */
                                <>
                                    <ellipse cx="180" cy="28" rx="8" ry="6" fill={washed(BRICK, 0.18)} />
                                    <path d="M 173 28 Q 180 23 187 28 Q 180 33 173 28 Z" fill={PAGE} stroke={BRICK} strokeWidth="1" />
                                    <ellipse cx="180" cy="28" rx="1.2" ry="3.4" fill={INK} />
                                </>
                            ) : (
                                /* Low Authority (0-3): Slumbering Leaden Cold-Iron Seal */
                                <>
                                    <circle cx="180" cy="28" r="7" fill={PANEL} stroke={RULE} strokeWidth="0.9" />
                                    <line x1="180" y1="23" x2="180" y2="33" stroke={MUTED} strokeWidth="1" />
                                    <line x1="175" y1="28" x2="185" y2="28" stroke={MUTED} strokeWidth="1" />
                                    <circle cx="180" cy="28" r="1.5" fill={MUTED} />
                                </>
                            )}

                            {/* Top Guillotine Wedge Chisel Head */}
                            <path d="M 176 8 L 184 8 L 182 13 L 178 13 Z" fill={BRASS} stroke={inked(BRASS, 0.4)} strokeWidth="0.6" />
                        </g>

                        {/* 6. RIGHT FLANK TRIGGER: SEVERANCE GUILLOTINE CLEAVER */}
                        <g
                            className="inq-flank-trigger inq-flank-right"
                            onClick={handleRightFlankClick}
                            style={{ cursor: isOwner ? 'pointer' : 'default' }}
                        >
                            {/* Severance Chisel / Cleaver Blade */}
                            <path
                                d="M 339 16 L 349 16 L 346 40 L 342 40 Z"
                                fill={PAPER}
                                stroke={RULE}
                                strokeWidth="1"
                            />
                            {/* Chipped Serrated Edge */}
                            <line x1="347" y1="18" x2="344" y2="38" stroke={localAuthority > 0 ? BRICK : ETCH} strokeWidth="1" />
                            {/* Barbed Wire Cleaver Binding */}
                            <path d="M 337 23 L 351 27 M 337 31 L 351 35" stroke={BRASS} strokeWidth="1" strokeLinecap="round" />
                            {/* Consecrated Brine Droplet */}
                            <path
                                d="M 344 41 C 341.5 44, 341 46.5, 344 48.5 C 347 46.5, 346.5 44, 344 41 Z"
                                fill={localAuthority > 0 ? washed(BRICK, 0.4) : PAPER}
                                stroke={localAuthority > 0 ? BRICK : ETCH}
                                strokeWidth="0.8"
                            />

                            {/* Full-Height Transparent Hitbox */}
                            <rect x="330" y="2" width="28" height="52" fill="transparent" pointerEvents="all">
                                <title>{isOwner ? 'Gain 1 Authority (Shift: max 8, Alt: −1)' : 'Severance Cleaver'}</title>
                            </rect>
                        </g>
                    </svg>
                </div>
            </div>

            {/* Shared ClassTip Tooltip */}
            {showTooltip && !showControls && ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip inquisitor-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}>
                    <ClassTip
                        icon="fas fa-gavel"
                        tint="#ef4444"
                        title="The Barbed Leash of the Damned"
                        subtitle="Inquisitor Barbed Authority"
                        state={`${localAuthority}/${maxAuthority} Authority`}
                        stateTone={localAuthority >= 8 ? 'good' : localAuthority >= 4 ? 'neutral' : localAuthority > 0 ? 'warn' : 'bad'}
                        mechanic="Counterspells, dispels and strikes on supernatural targets build Authority (max 8); −1/round without contact. Your Inquisitor spells spend it. At 0, The Hollow opens and bound entities make Rebellion Saves."
                        status={[
                            auraActive && localAuthority > 0 ? 'Null aura active: known foreign magical assistance is suppressed; self effects and nonmagical treatment remain.' : 'Null aura released: ordinary assistance is not suppressed.',
                            localAuthority >= 8
                                ? { text: 'Authority full — the tribunal is in session.', tone: 'good' }
                                : localAuthority >= 4
                                ? 'Building — cold iron holds; keep the pressure on supernatural foes.'
                                : localAuthority > 0
                                ? `${localAuthority} Authority gathered — the chains rattle.`
                                : { text: 'The Hollow: anti-magic fails and every bound entity makes a Rebellion Save.', tone: 'bad' },
                            'Mundane enemies and attacks grant no Authority.'
                        ]}
                        usage={isOwner ? 'Click a chain link to set Authority · Flank brands +1 (Shift for max, Alt for -1) · Center collar opens the Tribunal.' : null}
                    />
                </div>,
                document.body
            )}

            {/* Player Controls Menu - Unified Warm Parchment Theme */}
            {showControls && ReactDOM.createPortal(
                <div
                    ref={controlsMenuRef}
                    className={`unified-context-menu compact context-menu-container inquisitor-menu-container class-resource-menu ${context === 'party' ? 'chronarch-party' : ''}`}
                    onMouseEnter={(e) => { e.stopPropagation(); setShowTooltip(false); }}
                    onMouseMove={(e) => e.stopPropagation()}
                    onMouseOver={(e) => e.stopPropagation()}
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
                            return Math.max(12, Math.min(hudBottom + 8, window.innerHeight - Math.min(560, window.innerHeight - 24) - 12));
                        })(),
                        left: (() => {
                            if (!barRef.current) return '50%';
                            const rect = barRef.current.getBoundingClientRect();
                            const width = Math.min(340, window.innerWidth - 24);
                            return Math.max(12, Math.min(rect.left + rect.width / 2 - width / 2, window.innerWidth - width - 12));
                        })(),
                        width: Math.min(340, window.innerWidth - 24),
                        maxHeight: Math.min(560, window.innerHeight - 24),
                        overflowY: 'auto',
                        boxSizing: 'border-box',
                        zIndex: 100000
                    }}
                >
                    <div className="cm" style={{ '--cm-accent': '#6a6258', '--cm-accent-deep': '#33302b', '--cm-wash': '#e9e4da' }}>
                        <header className="cm-head">
                            <span className={`cm-seal ${localAuthority === 0 ? 'is-quiet' : ''}`}>{localAuthority}</span>
                            <div className="cm-titles">
                                <div className="cm-eyebrow">Inquisition Tribunal</div>
                                <div className="cm-title">{localAuthority === 0 ? 'No Standing' : localAuthority >= maxAuthority ? 'Full Verdict' : localAuthority >= 4 ? 'In Session' : 'Summoned'}</div>
                                <div className="cm-sub">Authority ({localAuthority}/{maxAuthority})</div>
                            </div>
                            <button type="button" className="cm-x" aria-label="Close menu" onClick={() => setShowControls(false)}>
                                <i className="fas fa-times" aria-hidden="true"></i>
                            </button>
                        </header>
                        <div className="cm-meter" aria-hidden="true"><span style={{ width: `${maxAuthority ? (localAuthority / maxAuthority) * 100 : 0}%` }}></span></div>
                        <div className={`cm-burden ${auraActive && localAuthority > 0 ? '' : 'is-quiet'}`}>
                            <span className="cm-burden-label">Null aura</span>
                            <label className="cm-check">
                                <input type="checkbox" checked={auraActive && localAuthority > 0} disabled={localAuthority === 0}
                                    onChange={event => {
                                        setAuraActive(event.target.checked);
                                        onClassResourceUpdate?.('nullAura', { active: event.target.checked });
                                    }} /> Active null aura
                            </label>
                            <p className="cm-burden-text">{auraActive && localAuthority > 0 ? 'Foreign magical assistance suppressed' : 'Aura released — assistance permitted'}</p>
                        </div>
                        <div className="cm-section">Authority</div>
                        <div className="cm-row" style={{ '--cm-cols': 4 }}>
                            <button type="button" className="context-menu-button spend" onClick={() => handleAuthorityChange(-2)} disabled={localAuthority < 2}>-2</button>
                            <button type="button" className="context-menu-button spend" onClick={() => handleAuthorityChange(-1)} disabled={localAuthority < 1}>-1</button>
                            <button type="button" className="context-menu-button gain" onClick={() => handleAuthorityChange(1)}>+1</button>
                            <button type="button" className="context-menu-button gain" onClick={() => handleAuthorityChange(maxAuthority)}>Max</button>
                        </div>
                        <ClassMenuSpells className="Inquisitor" resourceTypes={['authority']} resourceLabel="Authority" current={localAuthority} />
                        <details className="cm-notes">
                            <summary>How the aura works</summary>
                            <p>Suppression needs labelled origin and magic metadata. Your own Authority and nonmagical effects remain; hostile damage and corruption still land.</p>
                            <p>Spending to zero releases the aura. Unknown legacy provenance is never guessed.</p>
                        </details>
                        <div className="cm-foot">
                            <button type="button" className="context-menu-button quiet" onClick={() => { setAuthorityDirect(0); setShowControls(false); }}>
                                <i className="fas fa-undo" aria-hidden="true"></i> Reset (0)
                            </button>
                            <button type="button" className="context-menu-button" onClick={() => { setAuthorityDirect(maxAuthority); setShowControls(false); }}>
                                <i className="fas fa-arrow-up" aria-hidden="true"></i> Full Verdict
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default InquisitorResourceBar;
