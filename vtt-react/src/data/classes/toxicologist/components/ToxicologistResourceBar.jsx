import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/ToxicologistResourceBar.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import '../../../../styles/unified-context-menu.css';
import ClassTip from '../../../../components/hud/ClassTip';

/**
 * Toxicologist Resource Bar: "The Canopy Syringe-Alembic & Needle-Clockwork Rig"
 *
 * Full 360px wide alchemical instrument:
 * - Left Flank Trigger: Hand-blown dropper bulb / reagent distiller pipette (+1 Toxin Vial, Shift: Max, Alt: -1)
 * - Left Wing: 6 Hand-blown venom ampoules in brass retaining cages, linked by emerald distillation capillaries
 * - Centerpiece: The Condensation Alembic & Pressure Manometer core (opens Alchemical Bench menu)
 * - Right Wing: 5 Spring-loaded clockwork contraption cogs with interlocking teeth and ratchet pawls
 * - Right Flank Trigger: Tension crank / ratchet winding key (+1 Contraption Part, Shift: Max, Alt: -1)
 */
const ToxicologistResourceBar = ({
    classResource = {},
    size = 'normal',
    config = {},
    context = 'hud',
    isOwner = true,
    onClassResourceUpdate = null
}) => {
    const propToxins = classResource?.toxinVials ?? classResource?.current ?? 6;
    const propParts = classResource?.contraptionParts ?? 3;

    const [localToxinVials, setLocalToxinVials] = useState(propToxins);
    const [localContraptionParts, setLocalContraptionParts] = useState(propParts);

    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);

    const maxToxinVials = classResource?.toxinVialsMax || 6;
    const maxContraptionParts = classResource?.contraptionPartsMax || 5;

    useEffect(() => {
        if (classResource?.toxinVials !== undefined) setLocalToxinVials(classResource.toxinVials);
    }, [classResource?.toxinVials]);

    useEffect(() => {
        if (classResource?.contraptionParts !== undefined) setLocalContraptionParts(classResource.contraptionParts);
    }, [classResource?.contraptionParts]);

    const barRef = useRef(null);
    const controlsMenuRef = useRef(null);
    const tooltipRef = useResourceBarTooltip(barRef, showTooltip, [localToxinVials, localContraptionParts]);

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
            ? `${characterName} brewed ${absAmount} ${resourceName}`
            : `${characterName} expended ${absAmount} ${resourceName}`;

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

    const handleToxinsChange = (delta) => {
        const newValue = Math.max(0, Math.min(maxToxinVials, localToxinVials + delta));
        const diff = Math.abs(newValue - localToxinVials);
        if (diff > 0) {
            setLocalToxinVials(newValue);
            logClassResourceChange('Toxin Vials', diff, delta > 0, 'toxinVials');
            if (onClassResourceUpdate) onClassResourceUpdate('toxinVials', newValue);
        }
    };

    const handlePartsChange = (delta) => {
        const newValue = Math.max(0, Math.min(maxContraptionParts, localContraptionParts + delta));
        const diff = Math.abs(newValue - localContraptionParts);
        if (diff > 0) {
            setLocalContraptionParts(newValue);
            logClassResourceChange('Contraption Parts', diff, delta > 0, 'contraptionParts');
            if (onClassResourceUpdate) onClassResourceUpdate('contraptionParts', newValue);
        }
    };

    const setToxinsDirect = (targetValue) => {
        const clamped = Math.max(0, Math.min(maxToxinVials, targetValue));
        const diff = Math.abs(clamped - localToxinVials);
        if (diff > 0) {
            const isPositive = clamped > localToxinVials;
            setLocalToxinVials(clamped);
            logClassResourceChange('Toxin Vials', diff, isPositive, 'toxinVials');
            if (onClassResourceUpdate) onClassResourceUpdate('toxinVials', clamped);
        }
    };

    const setPartsDirect = (targetValue) => {
        const clamped = Math.max(0, Math.min(maxContraptionParts, targetValue));
        const diff = Math.abs(clamped - localContraptionParts);
        if (diff > 0) {
            const isPositive = clamped > localContraptionParts;
            setLocalContraptionParts(clamped);
            logClassResourceChange('Contraption Parts', diff, isPositive, 'contraptionParts');
            if (onClassResourceUpdate) onClassResourceUpdate('contraptionParts', clamped);
        }
    };

    const handlePhialClick = (e, index) => {
        e.stopPropagation();
        if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation();
        if (!isOwner) return;
        const target = localToxinVials === index ? index - 1 : index;
        setToxinsDirect(target);
    };

    const handleCogClick = (e, index) => {
        e.stopPropagation();
        if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation();
        if (!isOwner) return;
        const target = localContraptionParts === index ? index - 1 : index;
        setPartsDirect(target);
    };

    const handleLeftFlankClick = (e) => {
        e.stopPropagation();
        if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation();
        if (!isOwner) return;
        if (e.shiftKey) {
            setToxinsDirect(maxToxinVials);
        } else if (e.altKey || e.ctrlKey) {
            handleToxinsChange(-1);
        } else {
            handleToxinsChange(1);
        }
    };

    const handleRightFlankClick = (e) => {
        e.stopPropagation();
        if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation();
        if (!isOwner) return;
        if (e.shiftKey) {
            setPartsDirect(maxContraptionParts);
        } else if (e.altKey || e.ctrlKey) {
            handlePartsChange(-1);
        } else {
            handlePartsChange(1);
        }
    };

    // 6 Phial positions in left wing (x: 32 to 158)
    const phialPositions = [
        { id: 1, cx: 42, cy: 28 },
        { id: 2, cx: 63, cy: 28 },
        { id: 3, cx: 84, cy: 28 },
        { id: 4, cx: 105, cy: 28 },
        { id: 5, cx: 126, cy: 28 },
        { id: 6, cx: 147, cy: 28 }
    ];

    // 5 Cog positions in right wing (x: 202 to 328)
    const cogPositions = [
        { id: 1, cx: 213, cy: 28, r: 9.5 },
        { id: 2, cx: 237, cy: 28, r: 10.5 },
        { id: 3, cx: 261, cy: 28, r: 9.5 },
        { id: 4, cx: 285, cy: 28, r: 10.5 },
        { id: 5, cx: 309, cy: 28, r: 9.5 }
    ];

    // Dynamic Manometer needle calculation
    const totalResources = localToxinVials + localContraptionParts;
    const maxTotal = maxToxinVials + maxContraptionParts;
    const resourceRatio = maxTotal > 0 ? totalResources / maxTotal : 0;
    const needleAngleDeg = -65 + resourceRatio * 130;
    const needleRad = (needleAngleDeg - 90) * Math.PI / 180;
    const needleX = 180 + Math.cos(needleRad) * 9.5;
    const needleY = 28 + Math.sin(needleRad) * 9.5;

    return (
        <div className={`toxicologist-resource-container ${size} context-${context}`}>
            <div className="resource-bar-row">
                <div
                    ref={barRef}
                    className={`toxicologist-resource-bar ${size} clickable`}
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
                        className="toxicologist-manifold-svg"
                        viewBox="0 0 360 56"
                        preserveAspectRatio="xMidYMid meet"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            {/* Toxic Emerald Glow */}
                            <filter id="toxiGreenGlow" x="-25%" y="-25%" width="150%" height="150%">
                                <feGaussianBlur stdDeviation="2.2" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            {/* Clockwork Brass Glow */}
                            <filter id="toxiBrassGlow" x="-25%" y="-25%" width="150%" height="150%">
                                <feGaussianBlur stdDeviation="2" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            <filter id="toxiDropShadow" x="-15%" y="-15%" width="130%" height="130%">
                                <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.9" />
                            </filter>

                            {/* Heavy Ironwood & Gunmetal Chassis */}
                            <linearGradient id="toxiChassisGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#2c2825" />
                                <stop offset="25%" stopColor="#1a1816" />
                                <stop offset="60%" stopColor="#121110" />
                                <stop offset="100%" stopColor="#080706" />
                            </linearGradient>

                            {/* Tarnished Brass Trim */}
                            <linearGradient id="toxiBrassTrim" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#fde047" />
                                <stop offset="35%" stopColor="#d97706" />
                                <stop offset="70%" stopColor="#92400e" />
                                <stop offset="100%" stopColor="#451a03" />
                            </linearGradient>

                            {/* Copper Serpentine Condensation Coil */}
                            <linearGradient id="toxiCopperCoil" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#fdba74" />
                                <stop offset="40%" stopColor="#ea580c" />
                                <stop offset="75%" stopColor="#9a3412" />
                                <stop offset="100%" stopColor="#431407" />
                            </linearGradient>

                            {/* Alchemical Glass Phial Active Fluid */}
                            <linearGradient id="toxiFluidGrad" x1="0" y1="1" x2="0" y2="0">
                                <stop offset="0%" stopColor="#14532d" />
                                <stop offset="35%" stopColor="#16a34a" />
                                <stop offset="70%" stopColor="#84cc16" />
                                <stop offset="92%" stopColor="#bef264" />
                                <stop offset="100%" stopColor="#ecfccb" />
                            </linearGradient>

                            {/* Central Alembic Vapor Gradient */}
                            <radialGradient id="toxiAlembicVapor" cx="50%" cy="45%" r="55%">
                                <stop offset="0%" stopColor="#d9f99d" stopOpacity="0.9" />
                                <stop offset="35%" stopColor="#65a30d" stopOpacity="0.8" />
                                <stop offset="75%" stopColor="#166534" stopOpacity="0.85" />
                                <stop offset="100%" stopColor="#052e16" stopOpacity="0.95" />
                            </radialGradient>

                            {/* Clockwork Brass Gear Active Gradient */}
                            <radialGradient id="toxiGearActive" cx="45%" cy="45%" r="55%">
                                <stop offset="0%" stopColor="#fffbeb" />
                                <stop offset="25%" stopColor="#fde047" />
                                <stop offset="60%" stopColor="#ca8a04" />
                                <stop offset="88%" stopColor="#854d0e" />
                                <stop offset="100%" stopColor="#451a03" />
                            </radialGradient>
                        </defs>

                        {/* 1. INDUSTRIAL APPARATUS CHASSIS */}
                        <g filter="url(#toxiDropShadow)">
                            {/* Outer Brass/Iron Frame */}
                            <rect
                                x="4"
                                y="5"
                                width="352"
                                height="46"
                                rx="7"
                                fill="url(#toxiChassisGrad)"
                                stroke="#785a3c"
                                strokeWidth="1.6"
                            />
                            {/* Inner Recessed Backplate */}
                            <rect
                                x="6.5"
                                y="7.5"
                                width="347"
                                height="41"
                                rx="5"
                                fill="#0a0908"
                                stroke="rgba(255, 255, 255, 0.08)"
                                strokeWidth="0.8"
                            />
                        </g>

                        {/* Left Wing Recess (Vials) */}
                        <rect
                            x="31"
                            y="10"
                            width="128"
                            height="36"
                            rx="4"
                            fill="#060c04"
                            stroke="#1a2e12"
                            strokeWidth="1"
                        />

                        {/* Right Wing Recess (Cogs) */}
                        <rect
                            x="201"
                            y="10"
                            width="128"
                            height="36"
                            rx="4"
                            fill="#0e0a07"
                            stroke="#36220f"
                            strokeWidth="1"
                        />

                        {/* Interconnecting Brass Distillation Pipes & Tripwire Rods */}
                        {/* Upper delivery line */}
                        <path
                            d="M 28 14 L 165 14"
                            fill="none"
                            stroke="#ca8a04"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                        {/* Lower delivery line */}
                        <path
                            d="M 28 42 L 165 42"
                            fill="none"
                            stroke="#92400e"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                        />
                        {/* Right tripwire linkage rail */}
                        <path
                            d="M 195 28 L 332 28"
                            fill="none"
                            stroke="#78716c"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                        <path
                            d="M 195 14 L 332 14"
                            fill="none"
                            stroke="#44403c"
                            strokeWidth="1"
                            strokeDasharray="2 3"
                        />
                        <path
                            d="M 195 42 L 332 42"
                            fill="none"
                            stroke="#44403c"
                            strokeWidth="1"
                            strokeDasharray="2 3"
                        />

                        {/* Structural Screws & Rivets */}
                        {[
                            [9, 10], [351, 10],
                            [9, 46], [351, 46],
                            [32, 8], [157, 8],
                            [203, 8], [327, 8],
                            [32, 48], [157, 48],
                            [203, 48], [327, 48]
                        ].map(([cx, cy], i) => (
                            <g key={i}>
                                <circle cx={cx} cy={cy} r="1.6" fill="#0c0b0a" />
                                <circle cx={cx} cy={cy} r="1.1" fill="#ca8a04" />
                                <circle cx={cx - 0.3} cy={cy - 0.3} r="0.4" fill="#fef08a" opacity="0.8" />
                            </g>
                        ))}

                        {/* 2. LEFT FLANK TRIGGER: REAGENT PIPETTE / DROPPER BULB */}
                        <g
                            className="toxi-flank-trigger toxi-flank-left"
                            onClick={handleLeftFlankClick}
                            style={{ cursor: isOwner ? 'pointer' : 'default' }}
                        >
                            {/* Dropper Squeeze Bulb */}
                            <path
                                d="M 11 15 C 11 11, 23 11, 23 15 C 23 19, 19.5 22, 19.5 24 L 14.5 24 C 14.5 22, 11 19, 11 15 Z"
                                fill="#262320"
                                stroke="#ca8a04"
                                strokeWidth="1"
                            />
                            {/* Bulb Ribbing */}
                            <path d="M 13 14 Q 17 12 21 14" fill="none" stroke="#44403c" strokeWidth="0.8" />
                            <path d="M 13 17 Q 17 15 21 17" fill="none" stroke="#44403c" strokeWidth="0.8" />

                            {/* Brass Collar */}
                            <rect x="13.5" y="23.5" width="7" height="2.5" rx="0.5" fill="#ca8a04" stroke="#78350f" strokeWidth="0.5" />

                            {/* Glass Pipette Stem */}
                            <path
                                d="M 15 26 L 15 37 L 17 41 L 19 37 L 19 26 Z"
                                fill="rgba(255, 255, 255, 0.25)"
                                stroke="#4d7c0f"
                                strokeWidth="0.8"
                            />

                            {/* Venom Droplet Teardrop */}
                            <path
                                d="M 17 42 C 14.5 45, 14 47.5, 17 49.5 C 20 47.5, 19.5 45, 17 42 Z"
                                fill={localToxinVials > 0 ? '#84cc16' : '#274116'}
                                stroke={localToxinVials > 0 ? '#bef264' : '#14290a'}
                                strokeWidth="0.8"
                                filter={localToxinVials > 0 ? 'url(#toxiGreenGlow)' : undefined}
                            />

                            {/* Dedicated Full-Height Transparent Click Area */}
                            <rect x="2" y="3" width="28" height="50" fill="transparent" pointerEvents="all">
                                <title>{isOwner ? 'Distill Toxin Vial (+1, Shift: Max, Alt: -1)' : 'Toxin Distiller'}</title>
                            </rect>
                        </g>

                        {/* 3. LEFT WING: 6 HAND-BLOWN VENOM AMPOULES */}
                        {phialPositions.map((phial) => {
                            const isFilled = localToxinVials >= phial.id;

                            return (
                                <g
                                    key={phial.id}
                                    className={`toxi-phial ${isFilled ? 'filled' : 'empty'}`}
                                    onClick={(e) => handlePhialClick(e, phial.id)}
                                    style={{ cursor: isOwner ? 'pointer' : 'default' }}
                                >
                                    {/* Glass Ampoule Body */}
                                    <rect
                                        x={phial.cx - 6.5}
                                        y="14"
                                        width="13"
                                        height="28"
                                        rx="4"
                                        fill={isFilled ? 'url(#toxiFluidGrad)' : '#070f05'}
                                        stroke={isFilled ? '#84cc16' : '#192b11'}
                                        strokeWidth={isFilled ? '1.2' : '0.8'}
                                        filter={isFilled ? 'url(#toxiGreenGlow)' : undefined}
                                    />

                                    {/* Glass Phial Neck & Stopper */}
                                    <rect
                                        x={phial.cx - 3.5}
                                        y="11.5"
                                        width="7"
                                        height="3.5"
                                        rx="1"
                                        fill={isFilled ? '#ca8a04' : '#573a1e'}
                                        stroke="#291a0c"
                                        strokeWidth="0.6"
                                    />

                                    {/* Brass Cage Retaining Bracket Bands */}
                                    <line
                                        x1={phial.cx - 6.5}
                                        y1="22"
                                        x2={phial.cx + 6.5}
                                        y2="22"
                                        stroke={isFilled ? '#ca8a04' : '#3f2d19'}
                                        strokeWidth="0.8"
                                    />
                                    <line
                                        x1={phial.cx - 6.5}
                                        y1="34"
                                        x2={phial.cx + 6.5}
                                        y2="34"
                                        stroke={isFilled ? '#ca8a04' : '#3f2d19'}
                                        strokeWidth="0.8"
                                    />

                                    {/* Filled: Specular highlight & Effervescent Bubbles */}
                                    {isFilled ? (
                                        <>
                                            <line
                                                x1={phial.cx - 3.5}
                                                y1="16"
                                                x2={phial.cx - 3.5}
                                                y2="38"
                                                stroke="rgba(255, 255, 255, 0.7)"
                                                strokeWidth="0.8"
                                                strokeLinecap="round"
                                            />
                                            <circle cx={phial.cx + 2.5} cy="35" r="1.1" fill="#ffffff" opacity="0.8" />
                                            <circle cx={phial.cx + 1} cy="25" r="0.7" fill="#ffffff" opacity="0.6" />
                                        </>
                                    ) : (
                                        /* Empty: Murky stagnant residue at base */
                                        <rect
                                            x={phial.cx - 5}
                                            y="37"
                                            width="10"
                                            height="3.5"
                                            rx="1.5"
                                            fill="#14260e"
                                            opacity="0.4"
                                        />
                                    )}

                                    {/* Transparent Click Target */}
                                    <rect
                                        x={phial.cx - 9}
                                        y="10"
                                        width="18"
                                        height="36"
                                        fill="transparent"
                                        pointerEvents="all"
                                    >
                                        <title>{isOwner ? `Toxin Vial ${phial.id} (Click to calibrate)` : `Toxin Vial ${phial.id}`}</title>
                                    </rect>
                                </g>
                            );
                        })}

                        {/* 4. CENTERPIECE: THE CONDENSATION ALEMBIC & PRESSURE MANOMETER */}
                        <g className="toxi-center-manifold" filter="url(#toxiDropShadow)">
                            {/* Coiled Condenser Coil Behind Alembic */}
                            <path
                                d="M 170 17 Q 180 19 190 17 Q 170 27 190 27 Q 170 37 190 37"
                                fill="none"
                                stroke="url(#toxiCopperCoil)"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                            />

                            {/* Hand-Blown Alembic Glass Sphere */}
                            <circle
                                cx="180"
                                cy="28"
                                r="15"
                                fill={localToxinVials > 0 ? 'url(#toxiAlembicVapor)' : '#10170e'}
                                stroke={localToxinVials > 0 ? '#a3e635' : '#2b3b24'}
                                strokeWidth="1.6"
                                filter={localToxinVials > 0 ? 'url(#toxiGreenGlow)' : undefined}
                            />

                            {/* Top Alembic Chimney & Vent Cap */}
                            <rect x="177" y="7" width="6" height="7" fill="#78350f" stroke="#ca8a04" strokeWidth="0.8" />
                            <circle cx="180" cy="7" r="2.5" fill="#fde047" />

                            {/* 4 Brass Claw Brackets clutching the sphere */}
                            {[0, 90, 180, 270].map((angle, i) => {
                                const rad = (angle * Math.PI) / 180;
                                const x1 = 180 + Math.cos(rad) * 15;
                                const y1 = 28 + Math.sin(rad) * 15;
                                const x2 = 180 + Math.cos(rad) * 18.5;
                                const y2 = 28 + Math.sin(rad) * 18.5;
                                return (
                                    <line
                                        key={i}
                                        x1={x1}
                                        y1={y1}
                                        x2={x2}
                                        y2={y2}
                                        stroke="#ca8a04"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                    />
                                );
                            })}

                            {/* Center Manometer Dial Ring */}
                            <circle
                                cx="180"
                                cy="28"
                                r="8.5"
                                fill="#191613"
                                stroke="#ca8a04"
                                strokeWidth="1.2"
                            />

                            {/* Manometer Calibration Tick Marks */}
                            {[-60, -30, 0, 30, 60].map((tickAngle, i) => {
                                const rad = ((tickAngle - 90) * Math.PI) / 180;
                                const x1 = 180 + Math.cos(rad) * 6.5;
                                const y1 = 28 + Math.sin(rad) * 6.5;
                                const x2 = 180 + Math.cos(rad) * 8;
                                const y2 = 28 + Math.sin(rad) * 8;
                                return (
                                    <line
                                        key={i}
                                        x1={x1}
                                        y1={y1}
                                        x2={x2}
                                        y2={y2}
                                        stroke="#fef08a"
                                        strokeWidth="0.6"
                                    />
                                );
                            })}

                            {/* Active Manometer Needle (Dynamic based on resource pressure) */}
                            <line
                                x1="180"
                                y1="28"
                                x2={needleX}
                                y2={needleY}
                                stroke="#fde047"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                            />

                            {/* Center Pin Pivot Rivet */}
                            <circle cx="180" cy="28" r="2.5" fill="#ca8a04" />
                            <circle cx="180" cy="28" r="1.2" fill="#fef08a" />
                        </g>

                        {/* 5. RIGHT WING: 5 SPRING-LOADED CONTRAPTION COGS */}
                        {cogPositions.map((cog) => {
                            const isStocked = localContraptionParts >= cog.id;

                            return (
                                <g
                                    key={cog.id}
                                    className={`toxi-cog ${isStocked ? 'stocked' : 'empty'}`}
                                    onClick={(e) => handleCogClick(e, cog.id)}
                                    style={{ cursor: isOwner ? 'pointer' : 'default' }}
                                >
                                    {/* Cog Outer Wheel Base */}
                                    <circle
                                        cx={cog.cx}
                                        cy={cog.cy}
                                        r={cog.r}
                                        fill={isStocked ? 'url(#toxiGearActive)' : '#191512'}
                                        stroke={isStocked ? '#ca8a04' : '#382514'}
                                        strokeWidth={isStocked ? '1.2' : '0.8'}
                                        filter={isStocked ? 'url(#toxiBrassGlow)' : undefined}
                                    />

                                    {/* Machined Gear Teeth */}
                                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
                                        const rad = (angle * Math.PI) / 180;
                                        const x1 = cog.cx + Math.cos(rad) * (cog.r - 2);
                                        const y1 = cog.cy + Math.sin(rad) * (cog.r - 2);
                                        const x2 = cog.cx + Math.cos(rad) * (cog.r + 2.5);
                                        const y2 = cog.cy + Math.sin(rad) * (cog.r + 2.5);

                                        return (
                                            <line
                                                key={i}
                                                x1={x1}
                                                y1={y1}
                                                x2={x2}
                                                y2={y2}
                                                stroke={isStocked ? '#fef08a' : '#2d1c0e'}
                                                strokeWidth="1.3"
                                                strokeLinecap="round"
                                            />
                                        );
                                    })}

                                    {/* Inner Cutouts / Wheel Spokes */}
                                    {isStocked && (
                                        <>
                                            <circle cx={cog.cx - 3.5} cy={cog.cy} r="1.2" fill="#713f12" />
                                            <circle cx={cog.cx + 3.5} cy={cog.cy} r="1.2" fill="#713f12" />
                                            <circle cx={cog.cx} cy={cog.cy - 3.5} r="1.2" fill="#713f12" />
                                            <circle cx={cog.cx} cy={cog.cy + 3.5} r="1.2" fill="#713f12" />
                                        </>
                                    )}

                                    {/* Center Axle Pin & Rivet */}
                                    <circle cx={cog.cx} cy={cog.cy} r="3.2" fill="#120e0b" />
                                    <circle
                                        cx={cog.cx}
                                        cy={cog.cy}
                                        r="1.4"
                                        fill={isStocked ? '#fde047' : '#452b14'}
                                    />

                                    {/* Transparent Click Target */}
                                    <rect
                                        x={cog.cx - cog.r - 2}
                                        y="10"
                                        width={(cog.r + 2) * 2}
                                        height="36"
                                        fill="transparent"
                                        pointerEvents="all"
                                    >
                                        <title>{isOwner ? `Contraption Part ${cog.id} (Click to calibrate)` : `Contraption Part ${cog.id}`}</title>
                                    </rect>
                                </g>
                            );
                        })}

                        {/* 6. RIGHT FLANK TRIGGER: TENSION CRANK / WINDING KEY */}
                        <g
                            className="toxi-flank-trigger toxi-flank-right"
                            onClick={handleRightFlankClick}
                            style={{ cursor: isOwner ? 'pointer' : 'default' }}
                        >
                            {/* Butterfly Thumb-Turn Wings */}
                            <path
                                d="M 341 23 C 334 19, 334 13, 341 16 Z"
                                fill="#ca8a04"
                                stroke="#78350f"
                                strokeWidth="0.8"
                            />
                            <path
                                d="M 345 23 C 352 19, 352 13, 345 16 Z"
                                fill="#ca8a04"
                                stroke="#78350f"
                                strokeWidth="0.8"
                            />

                            {/* Winding Key Shaft */}
                            <rect
                                x="341.5"
                                y="21"
                                width="3"
                                height="14"
                                rx="1"
                                fill="#fde047"
                                stroke="#b45309"
                                strokeWidth="0.8"
                            />

                            {/* Spiral Tension Mainspring Coil */}
                            <path
                                d="M 338 38 A 4.5 4.5 0 0 1 348 38 A 3.5 3.5 0 0 1 340 41"
                                fill="none"
                                stroke={localContraptionParts > 0 ? '#fde047' : '#573a1e'}
                                strokeWidth="1.3"
                                strokeLinecap="round"
                                filter={localContraptionParts > 0 ? 'url(#toxiBrassGlow)' : undefined}
                            />

                            {/* Dedicated Full-Height Transparent Click Area */}
                            <rect x="330" y="3" width="28" height="50" fill="transparent" pointerEvents="all">
                                <title>{isOwner ? 'Assemble Contraption Part (+1, Shift: Max, Alt: -1)' : 'Clockwork Winder'}</title>
                            </rect>
                        </g>
                    </svg>
                </div>
            </div>

            {/* Shared ClassTip Tooltip */}
            {showTooltip && !showControls && ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip toxicologist-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}>
                    <ClassTip
                        icon="fas fa-flask"
                        tint="#84cc16"
                        title="Vials & Contraption Parts"
                        subtitle="Toxicologist Field Apothecary"
                        state={`${localToxinVials}/${maxToxinVials} Vials · ${localContraptionParts}/${maxContraptionParts} Parts`}
                        stateTone={localToxinVials > 0 ? 'good' : 'warn'}
                        mechanic="Vials (INT mod +3, min 4) distill 1d4 per short rest and all on long rest; spend them on poisons and concoctions. Contraption Parts (max 5) are reclaimed after combat, or 1 per short rest / all on long rest if destroyed; deploy them as traps."
                        status={[
                            localToxinVials > 0
                                ? `${localToxinVials} Vials and ${localContraptionParts} Parts ready for field synthesis.`
                                : 'Dry — take a rest or reclaim deployed contraptions.',
                        ]}
                        usage={isOwner ? 'Click center to open the Alchemical Bench · Click flank triggers or icons to calibrate.' : null}
                    />
                </div>,
                document.body
            )}

            {/* Player Controls Menu - Unified Warm Parchment Theme */}
            {showControls && ReactDOM.createPortal(
                <div
                    ref={controlsMenuRef}
                    className={`unified-context-menu compact context-menu-container toxicologist-menu-container class-resource-menu ${context === 'party' ? 'chronarch-party' : ''}`}
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
                                <i className="fas fa-flask" style={{ marginRight: '6px', color: '#bef264' }}></i>
                                Alchemical Bench
                            </div>

                            {/* Toxin Vials Controls */}
                            <div className="context-menu-section-header" style={{ fontSize: '12px', marginTop: '6px', marginBottom: '6px' }}>
                                Toxin Vials ({localToxinVials}/{maxToxinVials})
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                <button className="context-menu-button spend" onClick={() => handleToxinsChange(-1)}>
                                    <i className="fas fa-minus"></i> -1
                                </button>
                                <button className="context-menu-button gain" onClick={() => handleToxinsChange(1)}>
                                    <i className="fas fa-plus"></i> +1
                                </button>
                                <button className="context-menu-button gain" onClick={() => handleToxinsChange(maxToxinVials)}>
                                    Max
                                </button>
                            </div>

                            {/* Contraption Parts Controls */}
                            <div className="context-menu-section-header" style={{ fontSize: '12px', marginTop: '6px', marginBottom: '6px' }}>
                                Contraption Parts ({localContraptionParts}/{maxContraptionParts})
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                <button className="context-menu-button spend" onClick={() => handlePartsChange(-1)}>
                                    <i className="fas fa-minus"></i> -1
                                </button>
                                <button className="context-menu-button gain" onClick={() => handlePartsChange(1)}>
                                    <i className="fas fa-plus"></i> +1
                                </button>
                                <button className="context-menu-button gain" onClick={() => handlePartsChange(maxContraptionParts)}>
                                    Max
                                </button>
                            </div>

                            <div className="context-menu-main-separator" style={{ margin: '10px 0' }}></div>

                            {/* Quick Actions */}
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                                <button
                                    className="context-menu-button"
                                    onClick={() => {
                                        setLocalToxinVials(0);
                                        setLocalContraptionParts(0);
                                        if (onClassResourceUpdate) {
                                            onClassResourceUpdate('toxinVials', 0);
                                            onClassResourceUpdate('contraptionParts', 0);
                                        }
                                        setShowControls(false);
                                    }}
                                    style={{ flex: 1 }}
                                >
                                    <i className="fas fa-undo"></i> Reset
                                </button>
                                <button
                                    className="context-menu-button"
                                    onClick={() => {
                                        setLocalToxinVials(maxToxinVials);
                                        setLocalContraptionParts(maxContraptionParts);
                                        if (onClassResourceUpdate) {
                                            onClassResourceUpdate('toxinVials', maxToxinVials);
                                            onClassResourceUpdate('contraptionParts', maxContraptionParts);
                                        }
                                        setShowControls(false);
                                    }}
                                    style={{ flex: 1 }}
                                >
                                    <i className="fas fa-arrow-up"></i> Full Stock
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

export default ToxicologistResourceBar;
