import React, { useState, useRef, useEffect, useId } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import { getResourceStatusFlavor } from '../../../../utils/resourceStatusFlavor';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import ClassTip from '../../../../components/hud/ClassTip';
import '../styles/BerserkerResourceBar.css';
import '../../../../styles/unified-context-menu.css';

/**
 * BERSERKER CLASS RESOURCE BAR: "The Fanged Caldera Jaw & Kin-Blood Rift"
 *
 * An imposing, wide, barbaric iron-and-bone muzzle spanning 360px:
 * - Upper and lower clashing wrought-iron jaws with 10 interlocking serrated fangs.
 * - Full-span uncontained molten kin-blood rift surging between the fangs (x: 26..334, 308px wide).
 * - Spiked Skald Kin-Fang marking Pain Immunity (21+ Rage) with a kindled golden rune.
 * - Crowning Horned Berserker Skull & Crossed Axes Clasp (.berserker-brand-center).
 * - Heavy Hinge Flank Triggers: Left Spiked Hinge (+5 Quick Fuel), Right Exhaust Valve (-10 Vent).
 * - 10 interactive calibration fang-sectors (10..100) for instant tactile setting.
 * - Violent Overheat (101+) volcanic plasma plumes erupting past the clamped fangs.
 * - Zero on-bar text clutter; zero emojis; zero AP.
 * - Unified warm parchment context menu matching all VTT menus.
 */

const BerserkerResourceBar = ({
    rage: legacyRage,
    maxRage: legacyMaxRage = 100,
    classResource = {},
    size = 'normal',
    config = {},
    context = 'hud',
    isOwner = true,
    onClassResourceUpdate = null
}) => {
    const rawRage = classResource?.current ?? legacyRage ?? 0;
    const maxRage = classResource?.max ?? legacyMaxRage ?? 100;

    const [localRage, setLocalRage] = useState(rawRage);
    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);

    const tooltipTimerRef = useRef(null);
    const suppressTooltipUntilRef = useRef(0);

    const barRef = useRef(null);
    const controlsMenuRef = useRef(null);
    const tooltipRef = useResourceBarTooltip(barRef, showTooltip && !showControls, [localRage]);

    useEffect(() => {
        if (rawRage !== undefined && rawRage !== localRage) {
            setLocalRage(rawRage);
        }
    }, [rawRage]);

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

    const logClassResourceChange = (resourceName, amount, isPositive) => {
        if (!addCombatNotification) return;
        const absAmount = Math.abs(amount);
        const actorName = getActorName();
        const characterName = currentPlayerName || 'Character';

        const message = isPositive
            ? `${characterName} built ${absAmount} ${resourceName}`
            : `${characterName} unleashed ${absAmount} ${resourceName}`;

        addCombatNotification({
            type: 'combat_resource',
            attacker: actorName,
            target: characterName,
            amount: absAmount,
            resourceType: 'bloodHeat',
            isPositive: isPositive,
            customMessage: message
        });
    };

    const handleRageChange = (delta) => {
        const newVal = Math.max(0, Math.min(150, localRage + delta));
        const diff = Math.abs(newVal - localRage);
        if (diff > 0) {
            setLocalRage(newVal);
            logClassResourceChange('Rage', diff, delta > 0);
            if (onClassResourceUpdate) onClassResourceUpdate('current', newVal);
        }
    };

    const handleRageSet = (value) => {
        const newVal = Math.max(0, Math.min(150, value));
        const diff = Math.abs(newVal - localRage);
        if (diff > 0) {
            setLocalRage(newVal);
            logClassResourceChange('Rage', diff, newVal > localRage);
            if (onClassResourceUpdate) onClassResourceUpdate('current', newVal);
        }
    };

    const handleMouseEnter = () => {
        if (showControls || Date.now() < suppressTooltipUntilRef.current) return;
        if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
        tooltipTimerRef.current = setTimeout(() => {
            if (!showControls && Date.now() >= suppressTooltipUntilRef.current) {
                setShowTooltip(true);
            }
        }, 400);
    };

    const handleMouseLeave = () => {
        if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
        setShowTooltip(false);
    };

    const dismissTooltip = () => {
        suppressTooltipUntilRef.current = Date.now() + 850;
        if (tooltipTimerRef.current) clearTimeout(tooltipTimerRef.current);
        setShowTooltip(false);
    };

    const getRageStateInfo = (currentRage) => {
        if (currentRage >= 101) return { name: 'Obliteration', color: '#ff0000', bonus: '+5 attack, +8 damage, crits cleave · 1d6 self-damage/turn' };
        if (currentRage >= 81) return { name: 'Cataclysm', color: '#dc2626', bonus: '+4 attack, +6 damage, fear immunity · Durability Dice -6' };
        if (currentRage >= 61) return { name: 'Carnage', color: '#ea580c', bonus: '+3 attack, +4 damage · Durability Dice -4, Agility check disadvantage' };
        if (currentRage >= 41) return { name: 'Primal', color: '#f97316', bonus: '+2 attack, +2 damage · Durability Dice -2' };
        if (currentRage >= 21) return { name: 'Frenzied', color: '#f59e0b', bonus: '+1 attack, +5 ft speed · Battle-Trance (no ally healing)' };
        return { name: 'Smoldering', color: '#78350f', bonus: 'Basic strikes only — no bonuses while cold' };
    };

    const rageState = getRageStateInfo(localRage);
    const isOverheated = localRage >= 101;
    const statusFlavor = getResourceStatusFlavor('Berserker', { current: localRage, max: maxRage });

    // Wide uncontained rift fill (x: 26 to 334, total width = 308px)
    const activeFillWidth = Math.min(308, Math.max(0, (localRage / 100) * 308));

    // Unique SVG ID namespace
    const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
    const ids = {
        rageGlow: `bsRageGlow${uid}`,
        dropShadow: `bsDropShadow${uid}`,
        ironJaw: `bsIronJaw${uid}`,
        jawRim: `bsJawRim${uid}`,
        bloodGrad: `bsBlood${uid}`,
        skullGrad: `bsSkull${uid}`,
        riftClip: `bsRiftClip${uid}`
    };

    // 10 fang sectors along x: 26 to 334 (each 30.8px wide)
    const fangSectors = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

    return (
        <div className={`berserker-resource-container ${size} context-${context}`}>
            <div className="resource-bar-row">
                <div
                    ref={barRef}
                    className={`berserker-resource-bar ${size} clickable ${isOverheated ? 'overheated' : ''}`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={(e) => {
                        if (e.target && e.target.closest && e.target.closest('.berserker-flank-trigger, .berserker-heat-cell')) {
                            return;
                        }
                        e.stopPropagation();
                        dismissTooltip();
                        if (!isOwner) {
                            return;
                        }
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                        }
                        setShowControls(!showControls);
                    }}
                >
                    <svg
                        className="berserker-brand-svg"
                        viewBox="0 0 360 56"
                        preserveAspectRatio="xMidYMid meet"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            {/* Volcanic Rage Glow */}
                            <filter id={ids.rageGlow} x="-20%" y="-20%" width="140%" height="140%">
                                <feGaussianBlur stdDeviation="2.5" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            <filter id={ids.dropShadow} x="-10%" y="-10%" width="120%" height="120%">
                                <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#000000" floodOpacity="0.85" />
                            </filter>

                            {/* Brutal Wrought Iron Jaw Plate */}
                            <linearGradient id={ids.ironJaw} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#2c130b" />
                                <stop offset="35%" stopColor="#1a0905" />
                                <stop offset="70%" stopColor="#0f0402" />
                                <stop offset="100%" stopColor="#060201" />
                            </linearGradient>

                            {/* Rusted Bronze / Forged Fang Rim */}
                            <linearGradient id={ids.jawRim} x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#853c0a" />
                                <stop offset="50%" stopColor="#c25e14" />
                                <stop offset="100%" stopColor="#853c0a" />
                            </linearGradient>

                            {/* Kin-Blood Magma Gradient */}
                            <linearGradient id={ids.bloodGrad} x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#6e0d0d" />
                                <stop offset="25%" stopColor="#b91c1c" />
                                <stop offset="50%" stopColor="#ea580c" />
                                <stop offset="80%" stopColor="#f59e0b" />
                                <stop offset="100%" stopColor="#fef08a" />
                            </linearGradient>

                            {/* Skull Clasp Gradient */}
                            <linearGradient id={ids.skullGrad} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3d160e" />
                                <stop offset="50%" stopColor="#200a06" />
                                <stop offset="100%" stopColor="#0d0402" />
                            </linearGradient>

                            {/* Clip path for the central river between jaw arches */}
                            <clipPath id={ids.riftClip}>
                                <rect x="26" y="8" width="308" height="40" rx="3" />
                            </clipPath>
                        </defs>

                        {/* 1. CLASHING FANG MAW (BACKGROUND & RECESSED CHASM BED) */}
                        <g filter={`url(#${ids.dropShadow})`}>
                            {/* Deep Basalt Bed */}
                            <rect
                                x="24"
                                y="8"
                                width="312"
                                height="40"
                                rx="3"
                                fill="#090201"
                                stroke="#3d1406"
                                strokeWidth="1.2"
                            />

                            {/* Active Boiling Blood Stream */}
                            <g clipPath={`url(#${ids.riftClip})`}>
                                {activeFillWidth > 0 && (
                                    <rect
                                        x="26"
                                        y="8"
                                        width={activeFillWidth}
                                        height="40"
                                        fill={`url(#${ids.bloodGrad})`}
                                        filter={`url(#${ids.rageGlow})`}
                                    />
                                )}

                                {/* Boiling Plasma Wave Veins */}
                                <path
                                    d="M 28,28 Q 60,25 92,28 T 156,28 T 220,28 T 284,28 T 332,28"
                                    fill="none"
                                    stroke="rgba(255, 255, 255, 0.4)"
                                    strokeWidth="1"
                                />
                                {localRage >= 41 && (
                                    <path
                                        d="M 32,23 L 70,26 L 110,21 L 160,25 L 210,22 L 260,26 L 310,23"
                                        fill="none"
                                        stroke={localRage >= 81 ? '#ffffff' : '#fef08a'}
                                        strokeWidth="1.2"
                                        opacity="0.65"
                                    />
                                )}
                            </g>
                        </g>

                        {/* 2. THE HEAVY IRON JAW ARCHES & INTERLOCKING FANGS */}
                        {/* Upper Jaw Arch & Downward Fangs */}
                        <g filter={`url(#${ids.dropShadow})`}>
                            <path
                                d={`M 24,14
                                   L 26,14 L 38,26 L 44,12
                                   L 56,26 L 62,12
                                   L 74,27 L 80,12
                                   L 92,26 L 98,12
                                   L 110,27 L 116,12
                                   L 128,26 L 134,12
                                   L 146,27 L 152,12
                                   L 164,26 L 170,12
                                   L 190,12 L 196,26 L 202,12
                                   L 214,27 L 220,12
                                   L 232,26 L 238,12
                                   L 250,27 L 256,12
                                   L 268,26 L 274,12
                                   L 286,27 L 292,12
                                   L 304,26 L 310,12
                                   L 322,26 L 328,12
                                   L 336,14 L 336,6 L 24,6 Z`}
                                fill={`url(#${ids.ironJaw})`}
                                stroke={`url(#${ids.jawRim})`}
                                strokeWidth="1.2"
                            />
                            {/* Inner Highlight on Upper Fangs */}
                            <path
                                d="M 28,8 L 332,8"
                                stroke="rgba(249, 115, 22, 0.3)"
                                strokeWidth="0.8"
                            />
                        </g>

                        {/* Lower Jaw Arch & Upward Fangs */}
                        <g filter={`url(#${ids.dropShadow})`}>
                            <path
                                d={`M 24,42
                                   L 26,42 L 32,30 L 40,44
                                   L 48,30 L 58,44
                                   L 66,29 L 76,44
                                   L 84,30 L 94,44
                                   L 102,29 L 112,44
                                   L 120,30 L 130,44
                                   L 138,29 L 148,44
                                   L 156,30 L 166,44
                                   L 174,29 L 186,44
                                   L 194,30 L 204,44
                                   L 212,29 L 222,44
                                   L 230,30 L 240,44
                                   L 248,29 L 258,44
                                   L 266,30 L 276,44
                                   L 284,29 L 294,44
                                   L 302,30 L 312,44
                                   L 320,29 L 330,44
                                   L 336,42 L 336,50 L 24,50 Z`}
                                fill={`url(#${ids.ironJaw})`}
                                stroke={`url(#${ids.jawRim})`}
                                strokeWidth="1.2"
                            />
                            {/* Inner Highlight on Lower Fangs */}
                            <path
                                d="M 28,48 L 332,48"
                                stroke="rgba(249, 115, 22, 0.3)"
                                strokeWidth="0.8"
                            />
                        </g>

                        {/* Spiked Fang Root Studs */}
                        {[44, 76, 108, 140, 220, 252, 284, 316].map((cx, i) => (
                            <g key={i}>
                                <circle cx={cx} cy={8} r="1.8" fill="#080201" />
                                <circle cx={cx} cy={8} r="1.1" fill="#b45309" />
                                <circle cx={cx} cy={48} r="1.8" fill="#080201" />
                                <circle cx={cx} cy={48} r="1.1" fill="#b45309" />
                            </g>
                        ))}

                        {/* 3. PAIN IMMUNITY SPECIAL FANG (21+ Rage) at x ≈ 92 */}
                        <g>
                            {/* Glowing Runic Fang Frame */}
                            <polygon
                                points="86,7 92,15 98,7"
                                fill={localRage >= 21 ? '#f59e0b' : '#451a03'}
                                stroke="#1c0703"
                                strokeWidth="0.8"
                                filter={localRage >= 21 ? `url(#${ids.rageGlow})` : undefined}
                            />
                            <polygon
                                points="86,49 92,41 98,49"
                                fill={localRage >= 21 ? '#f59e0b' : '#451a03'}
                                stroke="#1c0703"
                                strokeWidth="0.8"
                                filter={localRage >= 21 ? `url(#${ids.rageGlow})` : undefined}
                            />
                            {/* Blazing Kin-Rune in the Center */}
                            {localRage >= 21 && (
                                <polygon
                                    points="92,24 95,28 92,32 89,28"
                                    fill="#fef08a"
                                    filter={`url(#${ids.rageGlow})`}
                                />
                            )}
                        </g>

                        {/* 4. OVERHEAT BURNOUT FANG (100 Rage) at x ≈ 327 */}
                        <g>
                            <polygon
                                points="322,7 327,15 332,7"
                                fill={localRage >= 100 ? '#ff0000' : '#451a03'}
                            />
                            <polygon
                                points="322,49 327,41 332,49"
                                fill={localRage >= 100 ? '#ff0000' : '#451a03'}
                            />
                        </g>

                        {/* 5. INTERACTIVE 10 CALIBRATION SECTORS OVER THE FANGS */}
                        {fangSectors.map((val, i) => (
                            <rect
                                key={val}
                                x={26 + i * 30.8}
                                y="8"
                                width="30.8"
                                height="40"
                                fill="transparent"
                                className="berserker-heat-cell"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    dismissTooltip();
                                    if (isOwner) handleRageSet(val);
                                }}
                            />
                        ))}

                        {/* 6. LEFT FLANK TRIGGER: SPIKED HINGE BOLT (+5 Rage) */}
                        <g
                            className="berserker-flank-trigger left"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
                                    e.nativeEvent.stopImmediatePropagation();
                                }
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
                                    e.nativeEvent.stopImmediatePropagation();
                                }
                                dismissTooltip();
                                if (isOwner) {
                                    const delta = e.shiftKey ? 25 : 5;
                                    handleRageChange(delta);
                                }
                            }}
                        >
                            {/* Full Height Left Hitbox */}
                            <rect x="0" y="0" width="38" height="56" fill="transparent" pointerEvents="all" />
                            <polygon
                                points="4,16 22,8 26,28 22,48 4,40 8,28"
                                fill="#250c07"
                                stroke="#853c0a"
                                strokeWidth="1.6"
                            />
                            {/* Plus Glyph */}
                            <line x1="15" y1="20" x2="15" y2="36" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                            <line x1="7" y1="28" x2="23" y2="28" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
                        </g>

                        {/* 7. RIGHT FLANK TRIGGER: PRESSURE VENT EXHAUST (-10 Rage) */}
                        <g
                            className="berserker-flank-trigger right"
                            onMouseDown={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
                                    e.nativeEvent.stopImmediatePropagation();
                                }
                            }}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
                                    e.nativeEvent.stopImmediatePropagation();
                                }
                                dismissTooltip();
                                if (isOwner) {
                                    const delta = e.shiftKey ? -25 : -10;
                                    handleRageChange(delta);
                                }
                            }}
                        >
                            {/* Full Height Right Hitbox */}
                            <rect x="322" y="0" width="38" height="56" fill="transparent" pointerEvents="all" />
                            <polygon
                                points="334,8 356,16 352,28 356,40 334,48 338,28"
                                fill="#250c07"
                                stroke="#853c0a"
                                strokeWidth="1.6"
                            />
                            {/* Minus Glyph */}
                            <line x1="338" y1="28" x2="352" y2="28" stroke="#f59e0b" strokeWidth="3.2" strokeLinecap="round" />
                        </g>

                        {/* 8. CENTERPIECE: HORNED SKULL & CROSSED AXES CLASP (.berserker-brand-center) */}
                        <g
                            className="berserker-brand-center"
                            filter={`url(#${ids.dropShadow})`}
                            onClick={(e) => {
                                e.stopPropagation();
                                dismissTooltip();
                                if (isOwner) setShowControls(!showControls);
                            }}
                        >
                            {/* Crossed War-Axes */}
                            <line x1="166" y1="5" x2="194" y2="23" stroke={localRage >= 41 ? '#ea580c' : '#451a03'} strokeWidth="2" strokeLinecap="round" />
                            <line x1="194" y1="5" x2="166" y2="23" stroke={localRage >= 41 ? '#ea580c' : '#451a03'} strokeWidth="2" strokeLinecap="round" />
                            {/* Axe Blades */}
                            <path
                                d="M 164,4 C 160,8 162,13 167,11 M 196,4 C 200,8 198,13 193,11"
                                fill="none"
                                stroke={localRage >= 41 ? '#f59e0b' : '#5a2208'}
                                strokeWidth="1.4"
                            />

                            {/* Horned Skull Faceplate */}
                            <polygon
                                points="180,3 190,9 188,19 184,23 180,21 176,23 172,19 170,9"
                                fill={`url(#${ids.skullGrad})`}
                                stroke={isOverheated ? '#ff0000' : localRage >= 61 ? '#f97316' : '#78350f'}
                                strokeWidth="1.6"
                            />

                            {/* Horn Spikes */}
                            <path
                                d="M 170,9 L 163,2 L 168,11 M 190,9 L 197,2 L 192,11"
                                fill="#1c0a06"
                                stroke={isOverheated ? '#ff0000' : localRage >= 61 ? '#f97316' : '#78350f'}
                                strokeWidth="1.2"
                            />

                            {/* Blazing Skull Eyes */}
                            <polygon
                                points="176,12 178,14 177,16 174,15"
                                fill={localRage >= 81 ? '#ffffff' : localRage >= 41 ? '#fef08a' : localRage >= 21 ? '#f59e0b' : '#3d1208'}
                                filter={localRage >= 21 ? `url(#${ids.rageGlow})` : undefined}
                            />
                            <polygon
                                points="184,12 182,14 183,16 186,15"
                                fill={localRage >= 81 ? '#ffffff' : localRage >= 41 ? '#fef08a' : localRage >= 21 ? '#f59e0b' : '#3d1208'}
                                filter={localRage >= 21 ? `url(#${ids.rageGlow})` : undefined}
                            />
                        </g>

                        {/* 9. OVERHEAT ERUPTION SPOUTS (101+ Rage) */}
                        {isOverheated && (
                            <g stroke="#ff0000" strokeWidth="2.2" strokeLinecap="round" filter={`url(#${ids.rageGlow})`}>
                                <line x1="180" y1="3" x2="180" y2="-4" />
                                <line x1="163" y1="2" x2="159" y2="-5" />
                                <line x1="197" y1="2" x2="201" y2="-5" />
                                <line x1="108" y1="6" x2="104" y2="-2" />
                                <line x1="252" y1="6" x2="256" y2="-2" />
                                <line x1="180" y1="50" x2="180" y2="58" />
                                <line x1="108" y1="50" x2="104" y2="57" />
                                <line x1="252" y1="50" x2="256" y2="57" />
                                <line x1="6" y1="28" x2="-2" y2="28" />
                                <line x1="354" y1="28" x2="362" y2="28" />
                            </g>
                        )}
                    </svg>
                </div>
            </div>

            {/* Shared ClassTip Tooltip */}
            {showTooltip && !showControls && ReactDOM.createPortal(
                <div
                    ref={tooltipRef}
                    className="unified-resourcebar-tooltip pathfinder-tooltip berserker-tooltip"
                    style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}
                >
                    <ClassTip
                        icon="fas fa-fire"
                        tint="#dc2626"
                        title={`Blood-Heat Rage · ${rageState.name}`}
                        subtitle="Berserker Blood-Iron Apparatus"
                        state={`${localRage}/100 Rage · ${rageState.name}`}
                        stateTone={isOverheated ? 'bad' : localRage >= 41 ? 'good' : 'neutral'}
                        mechanic="Build Rage: melee ability +1d6 (you take 1d4 smashing recoil), taking damage +1d4, crit +2d6, kill +1d8; idle -10/round. At 21+ Battle-Trance grants pain and fear immunity but locks out all ally healing; at 101+ spend below 101 within 1 round or take 2d6 unresistable, reset to 0, and be Stunned 1 round."
                        status={[
                            isOverheated
                                ? { text: 'OVERHEAT — spend below 101 this round or take 2d6 unresistable, reset to 0, and be Stunned 1 round.', tone: 'critical' }
                                : localRage >= 81
                                    ? { text: 'Cataclysm — +4 attack, +6 damage, fear immunity. Durability Dice -6. One step from Overheat.', tone: 'bad' }
                                    : localRage >= 61
                                        ? { text: 'Carnage — +3 attack, +4 damage. Durability Dice -4, Agility check disadvantage.', tone: 'warn' }
                                        : localRage >= 41
                                            ? 'Primal — +2 attack, +2 damage. Durability Dice -2.'
                                            : localRage >= 21
                                                ? 'Frenzied — +1 attack, +5 ft speed. Battle-Trance: pain/fear immunity, no ally healing.'
                                                : 'Smoldering — no bonuses yet. Strike or take damage to build Rage.'
                        ]}
                        usage={isOwner ? 'Click skull clasp for Rage controls. Left hinge +5, right vent -10 (Shift for ±25), or click a fang sector to set Rage directly.' : null}
                    />
                </div>,
                document.body
            )}

            {/* Rage Controls Menu - Unified Parchment Theme (Zero Emojis, Zero AP) */}
            {showControls && ReactDOM.createPortal(
                <div
                    ref={controlsMenuRef}
                    className={`unified-context-menu berserker-rage-popover berserker-menu-container class-resource-menu ${context === 'party' ? 'chronarch-party' : ''}`}
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
                            e.nativeEvent.stopImmediatePropagation();
                        }
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) {
                            e.nativeEvent.stopImmediatePropagation();
                        }
                    }}
                    onMouseEnter={(e) => {
                        e.stopPropagation();
                        dismissTooltip();
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
                            let hudTop = rect.top;
                            if (hudContainer) {
                                const hudRect = hudContainer.getBoundingClientRect();
                                hudBottom = hudRect.bottom;
                                hudTop = hudRect.top;
                            }
                            if (hudBottom + 390 > window.innerHeight) {
                                return Math.max(10, hudTop - 390);
                            }
                            return hudBottom + 8;
                        })(),
                        left: (() => {
                            if (!barRef.current) return '50%';
                            const rect = barRef.current.getBoundingClientRect();
                            return Math.max(175, Math.min(window.innerWidth - 175, rect.left + (rect.width / 2)));
                        })(),
                        transform: 'translateX(-50%)',
                        zIndex: 100000
                    }}
                >
                    <div className="context-menu-main">
                        {/* Header */}
                        <div className="context-menu-section-header berserker-menu-header">
                            <span className="berserker-menu-title">
                                <i className="fas fa-skull" style={{ marginRight: '6px', color: '#fca5a5' }}></i>
                                Rage: {localRage}/100 ({rageState.name})
                            </span>
                            <button
                                className="berserker-menu-close-btn"
                                onClick={() => setShowControls(false)}
                                title="Close"
                            >
                                <i className="fas fa-times"></i>
                            </button>
                        </div>

                        {/* Status Flavor Banner */}
                        {statusFlavor && (
                            <div className="menu-status-flavor" style={statusFlavor.style}>
                                {statusFlavor.text}
                            </div>
                        )}

                        {/* Section 1: Calibration Presets */}
                        <div className="context-menu-section">
                            <div className="context-menu-section-title" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <span>Rage Thresholds</span>
                                <span style={{ color: '#fca5a5', fontWeight: 'bold' }}>
                                    {rageState.bonus}
                                </span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                {[0, 21, 41, 61, 81, 100].map((val) => {
                                    const isActive = localRage === val;
                                    return (
                                        <button
                                            key={val}
                                            type="button"
                                            className={`context-menu-button ${isActive ? 'active' : ''} ${val === 100 ? 'danger' : ''}`}
                                            onClick={() => handleRageSet(val)}
                                        >
                                            {val}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Section 2: Build & Spend */}
                        <div className="context-menu-section">
                            <div className="context-menu-section-title">Fuel & Unleash</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', marginBottom: '6px' }}>
                                <button type="button" className="context-menu-button gain" onClick={() => handleRageChange(5)}>
                                    <i className="fas fa-plus" style={{ marginRight: '4px', fontSize: '11px' }}></i>+5
                                </button>
                                <button type="button" className="context-menu-button gain" onClick={() => handleRageChange(10)}>
                                    <i className="fas fa-plus" style={{ marginRight: '4px', fontSize: '11px' }}></i>+10
                                </button>
                                <button type="button" className="context-menu-button gain" onClick={() => handleRageChange(25)}>
                                    <i className="fas fa-plus" style={{ marginRight: '4px', fontSize: '11px' }}></i>+25
                                </button>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px', marginBottom: '6px' }}>
                                <button type="button" className="context-menu-button spend" onClick={() => handleRageChange(-10)}>
                                    <i className="fas fa-minus" style={{ marginRight: '4px', fontSize: '11px' }}></i>-10
                                </button>
                                <button type="button" className="context-menu-button spend" onClick={() => handleRageChange(-25)}>
                                    <i className="fas fa-minus" style={{ marginRight: '4px', fontSize: '11px' }}></i>-25
                                </button>
                                <button type="button" className="context-menu-button spend" onClick={() => handleRageChange(-50)}>
                                    <i className="fas fa-minus" style={{ marginRight: '4px', fontSize: '11px' }}></i>-50
                                </button>
                            </div>
                        </div>

                        <div className="context-menu-main-separator" style={{ margin: '8px 0' }}></div>

                        {/* Section 3: Reset & Maximum */}
                        <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                                type="button"
                                className="context-menu-button"
                                onClick={() => {
                                    handleRageSet(0);
                                    setShowControls(false);
                                }}
                                style={{ flex: 1 }}
                            >
                                <i className="fas fa-undo"></i> Reset (0)
                            </button>
                            <button
                                type="button"
                                className="context-menu-button danger"
                                onClick={() => {
                                    handleRageSet(100);
                                    setShowControls(false);
                                }}
                                style={{ flex: 1 }}
                            >
                                <i className="fas fa-fire"></i> Max (100)
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default BerserkerResourceBar;
