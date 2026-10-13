import ClassMenuSpells from '../../../../components/hud/ClassMenuSpells';
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/ToxicologistResourceBar.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import '../../../../styles/unified-context-menu.css';
import ClassTip from '../../../../components/hud/ClassTip';

import { INK, PAGE, PAPER, RULE, ETCH, inked, washed } from '../../../../components/hud/calmBarPalette';
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
                        <defs />

                        {/* 1. INDUSTRIAL APPARATUS CHASSIS */}
                        <g>
                            {/* Outer Brass/Iron Frame */}
                            <rect
                                x="4"
                                y="5"
                                width="352"
                                height="46"
                                rx="7"
                                fill={PAPER}
                                stroke={inked('#785a3c', 0.6)}
                                strokeWidth="1.6"
                            />
                            {/* Inner Recessed Backplate */}
                            <rect
                                x="6.5"
                                y="7.5"
                                width="347"
                                height="41"
                                rx="5"
                                fill={PAPER}
                                stroke={ETCH}
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
                            fill={PAPER}
                            stroke={RULE}
                            strokeWidth="1"
                        />

                        {/* Right Wing Recess (Cogs) */}
                        <rect
                            x="201"
                            y="10"
                            width="128"
                            height="36"
                            rx="4"
                            fill={PAPER}
                            stroke={RULE}
                            strokeWidth="1"
                        />

                        {/* Interconnecting Brass Distillation Pipes & Tripwire Rods */}
                        {/* Upper delivery line */}
                        <path
                            d="M 28 14 L 165 14"
                            fill="none"
                            stroke={inked('#ca8a04', 0.6)}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                        {/* Lower delivery line */}
                        <path
                            d="M 28 42 L 165 42"
                            fill="none"
                            stroke={inked('#92400e', 0.6)}
                            strokeWidth="1.2"
                            strokeLinecap="round"
                        />
                        {/* Right tripwire linkage rail */}
                        <path
                            d="M 195 28 L 332 28"
                            fill="none"
                            stroke={RULE}
                            strokeWidth="1.5"
                            strokeLinecap="round"
                        />
                        <path
                            d="M 195 14 L 332 14"
                            fill="none"
                            stroke={RULE}
                            strokeWidth="1"
                            strokeDasharray="2 3"
                        />
                        <path
                            d="M 195 42 L 332 42"
                            fill="none"
                            stroke={RULE}
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
                                <circle cx={cx} cy={cy} r="1.6" fill={PAPER} />
                                <circle cx={cx} cy={cy} r="1.1" fill={washed('#ca8a04', 0.2)} />
                                <circle cx={cx - 0.3} cy={cy - 0.3} r="0.4" fill={washed('#fef08a', 0.2)} opacity="0.8" />
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
                                fill={PAPER}
                                stroke={inked('#ca8a04', 0.6)}
                                strokeWidth="1"
                            />
                            {/* Bulb Ribbing */}
                            <path d="M 13 14 Q 17 12 21 14" fill="none" stroke={RULE} strokeWidth="0.8" />
                            <path d="M 13 17 Q 17 15 21 17" fill="none" stroke={RULE} strokeWidth="0.8" />

                            {/* Brass Collar */}
                            <rect x="13.5" y="23.5" width="7" height="2.5" rx="0.5" fill={washed('#ca8a04', 0.2)} stroke={RULE} strokeWidth="0.5" />

                            {/* Glass Pipette Stem */}
                            <path
                                d="M 15 26 L 15 37 L 17 41 L 19 37 L 19 26 Z"
                                fill={PAGE}
                                stroke={RULE}
                                strokeWidth="0.8"
                            />

                            {/* Venom Droplet Teardrop */}
                            <path
                                d="M 17 42 C 14.5 45, 14 47.5, 17 49.5 C 20 47.5, 19.5 45, 17 42 Z"
                                fill={localToxinVials > 0 ? washed('#84cc16', 0.2) : PAPER}
                                stroke={localToxinVials > 0 ? inked('#bef264', 0.6) : RULE}
                                strokeWidth="0.8"
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
                                        fill={isFilled ? washed('#84cc16', 0.2) : PAPER}
                                        stroke={isFilled ? inked('#84cc16', 0.6) : RULE}
                                        strokeWidth={isFilled ? '1.2' : '0.8'}
                                    />

                                    {/* Glass Phial Neck & Stopper */}
                                    <rect
                                        x={phial.cx - 3.5}
                                        y="11.5"
                                        width="7"
                                        height="3.5"
                                        rx="1"
                                        fill={isFilled ? washed('#ca8a04', 0.2) : PAPER}
                                        stroke={RULE}
                                        strokeWidth="0.6"
                                    />

                                    {/* Brass Cage Retaining Bracket Bands */}
                                    <line
                                        x1={phial.cx - 6.5}
                                        y1="22"
                                        x2={phial.cx + 6.5}
                                        y2="22"
                                        stroke={isFilled ? inked('#ca8a04', 0.6) : RULE}
                                        strokeWidth="0.8"
                                    />
                                    <line
                                        x1={phial.cx - 6.5}
                                        y1="34"
                                        x2={phial.cx + 6.5}
                                        y2="34"
                                        stroke={isFilled ? inked('#ca8a04', 0.6) : RULE}
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
                                                stroke={INK}
                                                strokeWidth="0.8"
                                                strokeLinecap="round"
                                            />
                                            <circle cx={phial.cx + 2.5} cy="35" r="1.1" fill={PAGE} opacity="0.8" />
                                            <circle cx={phial.cx + 1} cy="25" r="0.7" fill={PAGE} opacity="0.6" />
                                        </>
                                    ) : (
                                        /* Empty: Murky stagnant residue at base */
                                        <rect
                                            x={phial.cx - 5}
                                            y="37"
                                            width="10"
                                            height="3.5"
                                            rx="1.5"
                                            fill={PAPER}
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
                        <g className="toxi-center-manifold">
                            {/* Coiled Condenser Coil Behind Alembic */}
                            <path
                                d="M 170 17 Q 180 19 190 17 Q 170 27 190 27 Q 170 37 190 37"
                                fill="none"
                                stroke={inked('#ea580c', 0.6)}
                                strokeWidth="2.2"
                                strokeLinecap="round"
                            />

                            {/* Hand-Blown Alembic Glass Sphere */}
                            <circle
                                cx="180"
                                cy="28"
                                r="15"
                                fill={localToxinVials > 0 ? washed('#65a30d', 0.2) : PAPER}
                                stroke={localToxinVials > 0 ? inked('#a3e635', 0.6) : RULE}
                                strokeWidth="1.6"
                            />

                            {/* Top Alembic Chimney & Vent Cap */}
                            <rect x="177" y="7" width="6" height="7" fill={PAPER} stroke={inked('#ca8a04', 0.6)} strokeWidth="0.8" />
                            <circle cx="180" cy="7" r="2.5" fill={washed('#fde047', 0.2)} />

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
                                        stroke={inked('#ca8a04', 0.6)}
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
                                fill={PAPER}
                                stroke={inked('#ca8a04', 0.6)}
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
                                        stroke={inked('#fef08a', 0.6)}
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
                                stroke={inked('#fde047', 0.6)}
                                strokeWidth="1.4"
                                strokeLinecap="round"
                            />

                            {/* Center Pin Pivot Rivet */}
                            <circle cx="180" cy="28" r="2.5" fill={washed('#ca8a04', 0.2)} />
                            <circle cx="180" cy="28" r="1.2" fill={washed('#fef08a', 0.2)} />
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
                                        fill={isStocked ? washed('#ca8a04', 0.2) : PAPER}
                                        stroke={isStocked ? inked('#ca8a04', 0.6) : RULE}
                                        strokeWidth={isStocked ? '1.2' : '0.8'}
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
                                                stroke={isStocked ? inked('#fef08a', 0.6) : RULE}
                                                strokeWidth="1.3"
                                                strokeLinecap="round"
                                            />
                                        );
                                    })}

                                    {/* Inner Cutouts / Wheel Spokes */}
                                    {isStocked && (
                                        <>
                                            <circle cx={cog.cx - 3.5} cy={cog.cy} r="1.2" fill={PAPER} />
                                            <circle cx={cog.cx + 3.5} cy={cog.cy} r="1.2" fill={PAPER} />
                                            <circle cx={cog.cx} cy={cog.cy - 3.5} r="1.2" fill={PAPER} />
                                            <circle cx={cog.cx} cy={cog.cy + 3.5} r="1.2" fill={PAPER} />
                                        </>
                                    )}

                                    {/* Center Axle Pin & Rivet */}
                                    <circle cx={cog.cx} cy={cog.cy} r="3.2" fill={PAPER} />
                                    <circle
                                        cx={cog.cx}
                                        cy={cog.cy}
                                        r="1.4"
                                        fill={isStocked ? washed('#fde047', 0.2) : PAPER}
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
                                fill={washed('#ca8a04', 0.2)}
                                stroke={RULE}
                                strokeWidth="0.8"
                            />
                            <path
                                d="M 345 23 C 352 19, 352 13, 345 16 Z"
                                fill={washed('#ca8a04', 0.2)}
                                stroke={RULE}
                                strokeWidth="0.8"
                            />

                            {/* Winding Key Shaft */}
                            <rect
                                x="341.5"
                                y="21"
                                width="3"
                                height="14"
                                rx="1"
                                fill={washed('#fde047', 0.2)}
                                stroke={inked('#b45309', 0.6)}
                                strokeWidth="0.8"
                            />

                            {/* Spiral Tension Mainspring Coil */}
                            <path
                                d="M 338 38 A 4.5 4.5 0 0 1 348 38 A 3.5 3.5 0 0 1 340 41"
                                fill="none"
                                stroke={localContraptionParts > 0 ? inked('#fde047', 0.6) : RULE}
                                strokeWidth="1.3"
                                strokeLinecap="round"
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
                        mechanic="Vials (INT mod +3, min 4) refill 1d4 per short rest, all on a long rest; spend them on poisons. Contraption Parts (max 5) return after combat (or 1 per short rest if destroyed); deploy as traps."
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
                    <div className="cm" style={{ '--cm-accent': '#5e7a2e', '--cm-accent-deep': '#2f4214', '--cm-wash': '#e6ebd2' }}>
                        <header className="cm-head">
                            <span className="cm-seal"><i className="fas fa-flask" aria-hidden="true"></i></span>
                            <div className="cm-titles">
                                <div className="cm-eyebrow">The workshop</div>
                                <div className="cm-title">Alchemical Bench</div>
                                <div className="cm-sub">{localToxinVials === 0 && localContraptionParts === 0 ? 'The shelves are bare.' : 'Brewed, bottled and ready to throw.'}</div>
                            </div>
                            <button type="button" className="cm-x" aria-label="Close menu" onClick={() => setShowControls(false)}>
                                <i className="fas fa-times" aria-hidden="true"></i>
                            </button>
                        </header>
                        <div className="cm-duo">
                            <section className="cm-pane" style={{ '--pane-accent': '#5e7a2e', '--pane-wash': '#e6ebd2' }}>
                                <div className="cm-pane-title">Toxin Vials ({localToxinVials}/{maxToxinVials})</div>
                                <p className="cm-pane-text">Coat blades, brew poisons.</p>
                                <div className="cm-track cm-track-static" style={{ '--cm-cols': Math.max(1, maxToxinVials) }} aria-hidden="true">
                                    {Array.from({ length: maxToxinVials }).map((_, i) => <span key={i} className={`cm-pip ${i < localToxinVials ? 'active' : ''}`}></span>)}
                                </div>
                                <div className="cm-row" style={{ '--cm-cols': 3 }}>
                                    <button type="button" className="context-menu-button spend" onClick={() => handleToxinsChange(-1)}>-1</button>
                                    <button type="button" className="context-menu-button gain" onClick={() => handleToxinsChange(1)}>+1</button>
                                    <button type="button" className="context-menu-button" onClick={() => handleToxinsChange(maxToxinVials)}>Max</button>
                                </div>
                            </section>
                            <section className="cm-pane" style={{ '--pane-accent': '#8a6a3a', '--pane-wash': '#efe3cc' }}>
                                <div className="cm-pane-title">Contraption Parts ({localContraptionParts}/{maxContraptionParts})</div>
                                <p className="cm-pane-text">Springs, gears, traps.</p>
                                <div className="cm-track cm-track-static" style={{ '--cm-cols': Math.max(1, maxContraptionParts) }} aria-hidden="true">
                                    {Array.from({ length: maxContraptionParts }).map((_, i) => <span key={i} className={`cm-pip ${i < localContraptionParts ? 'active' : ''}`}></span>)}
                                </div>
                                <div className="cm-row" style={{ '--cm-cols': 3 }}>
                                    <button type="button" className="context-menu-button spend" onClick={() => handlePartsChange(-1)}>-1</button>
                                    <button type="button" className="context-menu-button gain" onClick={() => handlePartsChange(1)}>+1</button>
                                    <button type="button" className="context-menu-button" onClick={() => handlePartsChange(maxContraptionParts)}>Max</button>
                                </div>
                            </section>
                        </div>
                        <ClassMenuSpells className="Toxicologist" resourceTypes={['vials', 'contraption_parts']} resourceLabel="vials and parts" currentByType={{ vials: localToxinVials, contraption_parts: localContraptionParts }} />
                        <div className="cm-foot">
                            <button
                                type="button"
                                className="context-menu-button quiet"
                                onClick={() => {
                                    setLocalToxinVials(0);
                                    setLocalContraptionParts(0);
                                    if (onClassResourceUpdate) {
                                        onClassResourceUpdate('toxinVials', 0);
                                        onClassResourceUpdate('contraptionParts', 0);
                                    }
                                    setShowControls(false);
                                }}
                            >
                                <i className="fas fa-undo" aria-hidden="true"></i> Reset
                            </button>
                            <button
                                type="button"
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
                            >
                                <i className="fas fa-arrow-up" aria-hidden="true"></i> Full Stock
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
