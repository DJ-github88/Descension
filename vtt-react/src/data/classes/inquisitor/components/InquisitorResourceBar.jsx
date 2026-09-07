import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/InquisitorResourceBar.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import '../../../../styles/unified-context-menu.css';
import ClassTip from '../../../../components/hud/ClassTip';

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
    const propAuthority = classResource?.authority ?? classResource?.current ?? 0;
    const [localAuthority, setLocalAuthority] = useState(propAuthority);

    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);

    const maxAuthority = classResource?.max || config?.mechanics?.max || 8;

    useEffect(() => {
        if (classResource?.authority !== undefined) setLocalAuthority(classResource.authority);
        else if (classResource?.current !== undefined) setLocalAuthority(classResource.current);
    }, [classResource?.authority, classResource?.current]);

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
        const newValue = Math.max(0, Math.min(maxAuthority, localAuthority + delta));
        const diff = Math.abs(newValue - localAuthority);
        if (diff > 0) {
            setLocalAuthority(newValue);
            logClassResourceChange('Authority', diff, delta > 0, 'authority');
            if (onClassResourceUpdate) {
                onClassResourceUpdate('authority', newValue);
                onClassResourceUpdate('current', newValue);
            }
        }
    };

    const setAuthorityDirect = (targetValue) => {
        const clamped = Math.max(0, Math.min(maxAuthority, targetValue));
        const diff = Math.abs(clamped - localAuthority);
        if (diff > 0) {
            const isPositive = clamped > localAuthority;
            setLocalAuthority(clamped);
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
                        <defs>
                            {/* Inquisitorial Holy Ember Glow */}
                            <filter id="inqEmberGlow" x="-30%" y="-30%" width="160%" height="160%">
                                <feGaussianBlur stdDeviation="2.5" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            {/* Absolute Verdict Radiant Burst Glow */}
                            <filter id="inqAbsoluteBurst" x="-35%" y="-35%" width="170%" height="170%">
                                <feGaussianBlur stdDeviation="3.2" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            <filter id="inqDropShadow" x="-15%" y="-15%" width="130%" height="130%">
                                <feDropShadow dx="0" dy="2" stdDeviation="1.8" floodColor="#000000" floodOpacity="0.95" />
                            </filter>

                            {/* Cold-Iron Metal Bevel Gradient */}
                            <linearGradient id="inqColdIron" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#383230" />
                                <stop offset="25%" stopColor="#221e1d" />
                                <stop offset="65%" stopColor="#141110" />
                                <stop offset="100%" stopColor="#080707" />
                            </linearGradient>

                            {/* Sealed Link Searing Molten Core Gradient */}
                            <radialGradient id="inqSealedMolten" cx="50%" cy="45%" r="60%">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="20%" stopColor="#fef08a" />
                                <stop offset="45%" stopColor="#f59e0b" />
                                <stop offset="75%" stopColor="#b91c1c" />
                                <stop offset="100%" stopColor="#450a0a" />
                            </radialGradient>

                            {/* Demon Collar Cold Metal Plate */}
                            <linearGradient id="inqCollarPlate" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#443c39" />
                                <stop offset="35%" stopColor="#292422" />
                                <stop offset="70%" stopColor="#171413" />
                                <stop offset="100%" stopColor="#0a0808" />
                            </linearGradient>

                            {/* Consecrated Burning Salt Rim */}
                            <linearGradient id="inqSaltRim" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="50%" stopColor="#fef3c7" />
                                <stop offset="100%" stopColor="#ca8a04" />
                            </linearGradient>
                        </defs>

                        {/* 1. BACKGROUND LEASH RUNWAY & SHADOW BED */}
                        <g filter="url(#inqDropShadow)">
                            {/* Deep Chiseled Blood-Ash Trench */}
                            <path
                                d="M 12 28 Q 180 34 348 28"
                                fill="none"
                                stroke="#0a0807"
                                strokeWidth="24"
                                strokeLinecap="round"
                            />
                            {/* Dark Rust-Iron Sub-Spine */}
                            <path
                                d="M 18 28 Q 180 32 342 28"
                                fill="none"
                                stroke="#1f1816"
                                strokeWidth="16"
                                strokeLinecap="round"
                            />
                        </g>

                        {/* 2. BARBED WIRE RUNNERS LACING THE LEASH */}
                        {/* Upper Barbed Strand with Razor Barbs */}
                        <path
                            d="M 18 17 Q 90 14 160 18 M 200 18 Q 270 14 342 17"
                            fill="none"
                            stroke={isAbsoluteVerdict ? '#fef08a' : isBindingTaut ? '#ef4444' : '#78716c'}
                            strokeWidth="1.4"
                            filter={isAbsoluteVerdict ? 'url(#inqEmberGlow)' : undefined}
                        />
                        {[30, 60, 90, 120, 150, 210, 240, 270, 300, 330].map((bx, i) => (
                            <path
                                key={i}
                                d={`M ${bx - 3} 14 L ${bx + 3} 20 M ${bx + 3} 14 L ${bx - 3} 20`}
                                stroke={isAbsoluteVerdict ? '#ffffff' : isBindingTaut ? '#fca5a5' : '#a8a29e'}
                                strokeWidth="1.1"
                                strokeLinecap="round"
                            />
                        ))}

                        {/* Lower Barbed Strand with Razor Barbs */}
                        <path
                            d="M 18 39 Q 90 42 160 38 M 200 38 Q 270 42 342 39"
                            fill="none"
                            stroke={isAbsoluteVerdict ? '#fef08a' : isBindingTaut ? '#ef4444' : '#78716c'}
                            strokeWidth="1.4"
                            filter={isAbsoluteVerdict ? 'url(#inqEmberGlow)' : undefined}
                        />
                        {[40, 70, 100, 130, 220, 250, 280, 310, 340].map((bx, i) => (
                            <path
                                key={i}
                                d={`M ${bx - 3} 36 L ${bx + 3} 42 M ${bx + 3} 36 L ${bx - 3} 42`}
                                stroke={isAbsoluteVerdict ? '#ffffff' : isBindingTaut ? '#fca5a5' : '#a8a29e'}
                                strokeWidth="1.1"
                                strokeLinecap="round"
                            />
                        ))}

                        {/* Interconnecting Heavy Iron Anchor Pins between Links */}
                        {[59, 89, 119, 241, 271, 301].map((cx, i) => (
                            <g key={i}>
                                <line x1={cx - 3} y1="28" x2={cx + 3} y2="28" stroke="#574843" strokeWidth="3" strokeLinecap="round" />
                                <circle cx={cx} cy="28" r="1.5" fill="#ca8a04" />
                            </g>
                        ))}

                        {/* 3. LEFT FLANK TRIGGER: RUSTED IRON BRAND & ANATHEMA STAKE */}
                        <g
                            className="inq-flank-trigger inq-flank-left"
                            onClick={handleLeftFlankClick}
                            style={{ cursor: isOwner ? 'pointer' : 'default' }}
                        >
                            {/* Brand Grip Mount */}
                            <rect x="6" y="23" width="7" height="10" rx="1.5" fill="#1c1817" stroke="#78350f" strokeWidth="0.8" />
                            {/* Heavy Spiked Anathema Brand Head */}
                            <path
                                d="M 16 13 L 16 43 M 9 28 L 23 28 M 11 19 L 21 37 M 21 19 L 11 37"
                                stroke={localAuthority > 0 ? '#ef4444' : '#574843'}
                                strokeWidth="2"
                                strokeLinecap="round"
                                filter={localAuthority > 0 ? 'url(#inqEmberGlow)' : undefined}
                            />
                            {/* Burning Salt Ember Core */}
                            <circle
                                cx="16"
                                cy="28"
                                r="2.8"
                                fill={localAuthority > 0 ? '#fde047' : '#78350f'}
                                filter={localAuthority > 0 ? 'url(#inqEmberGlow)' : undefined}
                            />

                            {/* Full-Height Transparent Hitbox */}
                            <rect x="2" y="2" width="28" height="52" fill="transparent" pointerEvents="all">
                                <title>{isOwner ? 'Affix Anathema Seal (+1 Authority, Shift: Max 8, Alt: -1)' : 'Anathema Brand'}</title>
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
                                    {/* Link Drop Shadow */}
                                    <polygon
                                        points={points}
                                        fill="#080606"
                                        transform="translate(0, 1.5)"
                                    />

                                    {/* Heavy Cold-Iron Hexagonal Link Outer Rim */}
                                    <polygon
                                        points={points}
                                        fill={isSealed ? 'url(#inqSealedMolten)' : 'url(#inqColdIron)'}
                                        stroke={isSealed ? (isAbsoluteVerdict ? '#ffffff' : '#f59e0b') : '#443c39'}
                                        strokeWidth={isSealed ? '1.6' : '1.1'}
                                        filter={isSealed ? 'url(#inqEmberGlow)' : undefined}
                                    />

                                    {/* Inner Link Pierced Core */}
                                    <ellipse
                                        cx={link.cx}
                                        cy={link.cy}
                                        rx="5"
                                        ry="8"
                                        fill={isSealed ? '#450a0a' : '#0a0807'}
                                        stroke={isSealed ? '#b91c1c' : '#292422'}
                                        strokeWidth="0.8"
                                    />

                                    {/* Sealed: Inward Edict Rune / Consecrated Salt Stud */}
                                    {isSealed ? (
                                        <>
                                            {/* Burning cross-rune inside the link core */}
                                            <line x1={link.cx} y1={link.cy - 5} x2={link.cx} y2={link.cy + 5} stroke="#fef08a" strokeWidth="1.2" />
                                            <line x1={link.cx - 3.5} y1={link.cy} x2={link.cx + 3.5} y2={link.cy} stroke="#fef08a" strokeWidth="1.2" />
                                            <circle cx={link.cx} cy={link.cy} r="1.2" fill="#ffffff" />
                                        </>
                                    ) : (
                                        /* Open/Cold Link Keyhole Slot */
                                        <circle cx={link.cx} cy={link.cy} r="1.4" fill="#1f1c1a" />
                                    )}

                                    {/* Razor Barbs extending from top & bottom of each link */}
                                    <path
                                        d={`M ${link.cx - 5} ${link.cy - h} L ${link.cx - 8} ${link.cy - h - 3} M ${link.cx + 5} ${link.cy - h} L ${link.cx + 8} ${link.cy - h - 3}`}
                                        stroke={isSealed ? '#fef08a' : '#78716c'}
                                        strokeWidth="1.1"
                                        strokeLinecap="round"
                                    />
                                    <path
                                        d={`M ${link.cx - 5} ${link.cy + h} L ${link.cx - 8} ${link.cy + h + 3} M ${link.cx + 5} ${link.cy + h} L ${link.cx + 8} ${link.cy + h + 3}`}
                                        stroke={isSealed ? '#fef08a' : '#78716c'}
                                        strokeWidth="1.1"
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
                                        <title>{isOwner ? `Barbed Edict Link ${link.id} (Click to set Authority)` : `Authority Link ${link.id}`}</title>
                                    </rect>
                                </g>
                            );
                        })}

                        {/* 5. CENTERPIECE: THE SPIKED DEMON-COLLAR & ANATHEMA GUILLOTINE */}
                        <g className="inq-center-collar inq-center-gavel" filter="url(#inqDropShadow)">
                            {/* Crossed Cold-Iron Driving Stakes (x: 162 to 198) */}
                            <path d="M 163 10 L 197 46 M 197 10 L 163 46" stroke="#574843" strokeWidth="2.5" strokeLinecap="round" />

                            {/* Heavy Forged Beast Collar Arch Ring */}
                            <circle
                                cx="180"
                                cy="28"
                                r="17"
                                fill="url(#inqCollarPlate)"
                                stroke={isAbsoluteVerdict ? '#ffffff' : isBindingTaut ? '#dc2626' : '#574843'}
                                strokeWidth="2"
                                filter={isAbsoluteVerdict ? 'url(#inqAbsoluteBurst)' : isBindingTaut ? 'url(#inqEmberGlow)' : undefined}
                            />

                            {/* Inner Collar Bevel */}
                            <circle
                                cx="180"
                                cy="28"
                                r="13"
                                fill="#0d0908"
                                stroke="#78350f"
                                strokeWidth="1"
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
                                        stroke={isAbsoluteVerdict ? '#fde047' : '#854d0e'}
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                );
                            })}

                            {/* Center Core: The Caged Anathema Horror Eye / Guillotine Keystone */}
                            {isAbsoluteVerdict ? (
                                /* Absolute Verdict (8): Blazing Consecrated White-Gold Judgment Core */
                                <>
                                    <circle cx="180" cy="28" r="8" fill="#fef08a" filter="url(#inqAbsoluteBurst)" />
                                    <circle cx="180" cy="28" r="4.5" fill="#ffffff" />
                                    {/* Radiating Lightning Sparks */}
                                    <line x1="172" y1="28" x2="188" y2="28" stroke="#b91c1c" strokeWidth="1.5" />
                                    <line x1="180" y1="20" x2="180" y2="36" stroke="#b91c1c" strokeWidth="1.5" />
                                </>
                            ) : isBindingTaut ? (
                                /* High Authority (4-7): Glowing demonic slit eye awake in chains */
                                <>
                                    <ellipse cx="180" cy="28" rx="8" ry="6" fill="#7f1d1d" filter="url(#inqEmberGlow)" />
                                    <path d="M 173 28 Q 180 23 187 28 Q 180 33 173 28 Z" fill="#ef4444" stroke="#450a0a" strokeWidth="0.8" />
                                    <ellipse cx="180" cy="28" rx="1.2" ry="4" fill="#0c0505" />
                                </>
                            ) : (
                                /* Low Authority (0-3): Slumbering Leaden Cold-Iron Seal */
                                <>
                                    <circle cx="180" cy="28" r="7" fill="#171413" stroke="#3d3734" strokeWidth="1" />
                                    <line x1="180" y1="23" x2="180" y2="33" stroke="#574843" strokeWidth="1.2" />
                                    <line x1="175" y1="28" x2="185" y2="28" stroke="#574843" strokeWidth="1.2" />
                                    <circle cx="180" cy="28" r="1.5" fill="#78350f" />
                                </>
                            )}

                            {/* Top Guillotine Wedge Chisel Head */}
                            <path d="M 176 8 L 184 8 L 182 13 L 178 13 Z" fill="#ca8a04" stroke="#78350f" strokeWidth="0.8" />
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
                                fill="#2c2422"
                                stroke="#78350f"
                                strokeWidth="1.2"
                            />
                            {/* Chipped Serrated Edge */}
                            <line x1="347" y1="18" x2="344" y2="38" stroke={localAuthority > 0 ? '#fde047' : '#574843'} strokeWidth="1" />
                            {/* Barbed Wire Cleaver Binding */}
                            <path d="M 337 23 L 351 27 M 337 31 L 351 35" stroke="#ca8a04" strokeWidth="1.2" strokeLinecap="round" />
                            {/* Consecrated Brine Droplet */}
                            <path
                                d="M 344 41 C 341.5 44, 341 46.5, 344 48.5 C 347 46.5, 346.5 44, 344 41 Z"
                                fill={localAuthority > 0 ? '#fde047' : '#574843'}
                                stroke={localAuthority > 0 ? '#fef08a' : '#292524'}
                                strokeWidth="0.8"
                                filter={localAuthority > 0 ? 'url(#inqEmberGlow)' : undefined}
                            />

                            {/* Full-Height Transparent Hitbox */}
                            <rect x="330" y="2" width="28" height="52" fill="transparent" pointerEvents="all">
                                <title>{isOwner ? 'Strike Verdict / Sever (+1 Authority, Shift: Max 8, Alt: -1)' : 'Severance Cleaver'}</title>
                            </rect>
                        </g>
                    </svg>
                </div>
            </div>

            {/* Shared ClassTip Tooltip */}
            {showTooltip && ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}>
                    <ClassTip
                        icon="fas fa-gavel"
                        tint="#8b0000"
                        title="The Barbed Leash of the Damned"
                        state={`${localAuthority}/${maxAuthority} Authority · ${localAuthority >= 8 ? 'Absolute Verdict' : localAuthority >= 4 ? 'Binding Conduit' : 'Null-Chains'}`}
                        stateTone={localAuthority >= 8 ? 'critical' : localAuthority >= 4 ? 'warn' : 'good'}
                        mechanic="Generated by parrying spells, striking with cold iron, and confronting supernatural horrors. Spend on anathema seals, contract severance, and demonic subjugation."
                        status={[
                            localAuthority >= 8
                                ? 'Absolute Verdict ready: Barbed Edicts strike with lethal cold-iron execution.'
                                : localAuthority >= 4
                                ? 'High Authority: Cold iron smolders with anathema frost, ready to sever dark covenants.'
                                : localAuthority > 0
                                ? `${localAuthority} Authority gathered. Chains rattle with anti-magic friction.`
                                : 'Chains quiet. Awaiting supernatural contact or cold-iron engagement.'
                        ]}
                        usage={isOwner ? 'Click center demon collar for Inquisition Tribunal. Click hex-links or flank triggers to calibrate.' : null}
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
                                <i className="fas fa-gavel" style={{ marginRight: '6px', color: '#8b0000' }}></i>
                                Inquisition Tribunal
                            </div>

                            {/* Authority Counter Controls */}
                            <div className="context-menu-section-header" style={{ fontSize: '12px', marginTop: '6px', marginBottom: '6px' }}>
                                Authority ({localAuthority}/{maxAuthority})
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                <button className="context-menu-button spend" onClick={() => handleAuthorityChange(-1)}>
                                    <i className="fas fa-minus"></i> -1
                                </button>
                                <button className="context-menu-button gain" onClick={() => handleAuthorityChange(1)}>
                                    <i className="fas fa-plus"></i> +1
                                </button>
                                <button className="context-menu-button gain" onClick={() => handleAuthorityChange(maxAuthority)}>
                                    Max
                                </button>
                            </div>

                            {/* Judicial Edicts Quick Spends */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                <button
                                    className="context-menu-button spend"
                                    onClick={() => handleAuthorityChange(-2)}
                                    title="Spend 2 Authority on Anathema Strike"
                                >
                                    <i className="fas fa-fire" style={{ marginRight: '4px' }}></i> Anathema (-2)
                                </button>
                                <button
                                    className="context-menu-button spend"
                                    onClick={() => handleAuthorityChange(-4)}
                                    title="Spend 4 Authority on Sever Contract"
                                >
                                    <i className="fas fa-link" style={{ marginRight: '4px' }}></i> Sever (-4)
                                </button>
                            </div>

                            <div className="context-menu-main-separator" style={{ margin: '10px 0' }}></div>

                            {/* Quick Presets */}
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                                <button
                                    className="context-menu-button"
                                    onClick={() => {
                                        setAuthorityDirect(0);
                                        setShowControls(false);
                                    }}
                                    style={{ flex: 1 }}
                                >
                                    <i className="fas fa-undo"></i> Reset (0)
                                </button>
                                <button
                                    className="context-menu-button"
                                    onClick={() => {
                                        setAuthorityDirect(maxAuthority);
                                        setShowControls(false);
                                    }}
                                    style={{ flex: 1 }}
                                >
                                    <i className="fas fa-arrow-up"></i> Full Verdict
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

export default InquisitorResourceBar;
