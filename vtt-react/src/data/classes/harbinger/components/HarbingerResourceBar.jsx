import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/HarbingerResourceBar.css';
import '../../../../styles/unified-context-menu.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import ClassTip from '../../../../components/hud/ClassTip';

const STAGE_NAMES = {
    0: 'Stable Anchor',
    1: 'Whispered Doom',
    2: 'Looming Shadow',
    3: 'Incipient Friction',
    4: 'Planar Strain',
    5: 'Spatial Distortion',
    6: 'Probability Shear',
    7: 'Planar Thinning',
    8: 'Redline Entropy',
    9: 'Molecular Dissociation',
    10: 'Master Wild Surge'
};

const DRAWBACK_TEXTS = {
    0: 'None — planar anchor intact.',
    1: 'None — Safe Zone (0-40): Mayhem is building.',
    2: 'None — Safe Zone (0-40): Mayhem is building.',
    3: 'None — Safe Zone (0-40): Mayhem is building.',
    4: 'None — Safe Zone (0-40): Mayhem is building.',
    5: '10% misfire — a fizzled spell deals 2d6 storm to you.',
    6: '10% misfire (2d6 storm to self).',
    7: '25% misfire, +25% vulnerability to smashing and slicing.',
    8: '25% misfire, +25% vulnerability to smashing and slicing.',
    9: '25% misfire, +50% vulnerability to smashing and slicing.',
    10: 'Anomalous Dissociation: 100% smashing/slicing vulnerability for 2 rounds.'
};

const MASTER_WILD_SURGE_TABLE = [
    { range: [1, 15], cat: 'Unstable Miracle', name: 'Chronal Mending Wave', desc: 'A soothing temporal rift opens. All allies within 30ft regain 4d8 HP and shed 1 ongoing condition.' },
    { range: [16, 30], cat: 'Unstable Miracle', name: 'Gravitational Aegis', desc: 'Gravity bends around the party. Allies gain +3 DR and immunity to forced movement for 2 rounds.' },
    { range: [31, 45], cat: 'Radical Area Ruin', name: 'Sundrift Gravity Shear', desc: 'Grass grows sideways; 30ft radius zone becomes inverted difficult terrain dealing 3d8 arcane damage to all creatures.' },
    { range: [46, 60], cat: 'Radical Area Ruin', name: 'Entropy Conflagration', desc: 'A chaotic blast wave erupts. All hostile creatures within 25ft take 5d10 blight/wyrd damage and are knocked prone.' },
    { range: [61, 70], cat: 'Reality Reversal', name: 'Probability Inversion Field', desc: 'For 1 round, all missed attack rolls count as hits, and critical hits count as critical fumbles.' },
    { range: [71, 80], cat: 'Reality Reversal', name: 'Spatial Transposition Scramble', desc: 'All combatants within 40ft instantly swap positions randomly. DC 15 Spirit save or disoriented (Slowed).' },
    { range: [81, 90], cat: 'Physical Backlash', name: 'Molecular Dissociation', desc: 'Caster suffers 3d10 arcane damage and gains 100% vulnerability to smashing and slicing for 2 rounds as density drops to zero.' },
    { range: [91, 100], cat: 'Physical Backlash', name: 'Catastrophic Timeline Shear', desc: 'Caster loses all remaining Mana and takes 4d10 blight damage. A permanent 10ft Chaos Pocket forms at the caster’s feet.' }
];

// Vector glyph path blueprints for all 10 eldritch runes
const RUNE_GLYPHS = {
    1: "M 0,-7 C 4,-7 7,-3 5,2 C 3,6 0,8 0,8 C 0,8 -3,6 -5,2 C -7,-3 -4,-7 0,-7 Z M 0,-2 A 2,2 0 1,0 0,2 A 2,2 0 1,0 0,-2",
    2: "M -6,-7 L 0,-1 L 6,-7 M -6,7 L 0,1 L 6,7 M 0,-7 L 0,7",
    3: "M -5,-8 L 5,-3 L -3,1 L 4,8 M -2,-8 L -2,8",
    4: "M 0,-8 L 7,0 L 0,8 L -7,0 Z M -4,-4 L 4,4 M 4,-4 L -4,4",
    5: "M 0,-8 C 5,-8 8,-4 6,1 C 4,6 -1,7 -4,4 C -7,1 -6,-4 -2,-6 C 2,-8 5,-4 3,0",
    6: "M -7,-6 L 0,-2 L 7,-6 M -7,6 L 0,2 L 7,6 M 0,-8 L 0,8 M -4,0 L 4,0",
    7: "M -6,-8 L -6,8 M -1,-6 L -1,6 M 4,-8 L 4,8 M -8,0 L 6,0",
    8: "M -6,-8 L 6,-8 L -5,8 L 5,8 Z M -2,0 L 2,0 M 0,-4 L 0,4",
    9: "M -6,-6 L 6,6 M -6,6 L 6,-6 M 0,-8 L 0,-4 M 0,4 L 0,8 M -8,0 L -4,0 M 4,0 L 8,0",
    10: "M -7,-5 C -7,-9 7,-9 7,-5 C 7,-1 3,2 0,7 C -3,2 -7,-1 -7,-5 Z M -3,-4 A 1.2,1.2 0 1,0 -3,-2 A 1.2,1.2 0 1,0 -3,-4 M 3,-4 A 1.2,1.2 0 1,0 3,-2 A 1.2,1.2 0 1,0 3,-4 M -4,3 L 4,3 M 0,7 L 0,10"
};

const HarbingerResourceBar = ({
    classResource = {},
    size = 'normal',
    config = {},
    context = 'hud',
    isOwner = true,
    onClassResourceUpdate = null
}) => {
    // Stage value from 0 to 10 (or mapped from 0-100 Mayhem)
    const rawVal = classResource?.current ?? classResource?.mayhem ?? 0;
    const mayhemStage = rawVal > 10 ? Math.min(10, Math.max(0, Math.round(rawVal / 10))) : Math.min(10, Math.max(0, rawVal));
    const maxStage = 10;

    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [hoveredRune, setHoveredRune] = useState(null);
    const [lastSurgeResult, setLastSurgeResult] = useState(null);

    const barRef = useRef(null);
    const tooltipRef = useResourceBarTooltip(barRef, showTooltip, [mayhemStage]);
    const controlsMenuRef = useRef(null);

    // Close controls menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (showControls) {
                const clickedElement = event.target;
                const isInsideMenu = controlsMenuRef.current?.contains(clickedElement);
                const isInsideBar = barRef.current?.contains(clickedElement);

                if (!isInsideMenu && !isInsideBar) {
                    setShowControls(false);
                }
            }
        };

        if (showControls) {
            const timeoutId = setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside);
            }, 0);

            return () => {
                clearTimeout(timeoutId);
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }
    }, [showControls]);

    // Chat store for combat notifications
    const { addCombatNotification } = useChatStore();
    const isGMMode = useGameStore(state => state.isGMMode);
    const currentPlayerName = useCharacterStore(state => state.name || 'Harbinger');

    const getActorName = () => {
        const actorName = currentPlayerName || 'Harbinger';
        return isGMMode ? `${actorName} (GM)` : actorName;
    };

    const logClassResourceChange = (resourceName, amount, isPositive, resourceType = 'mayhemStage') => {
        const absAmount = Math.abs(amount);
        const actorName = getActorName();
        const characterName = currentPlayerName || 'Character';

        let message = '';
        if (isPositive) {
            const messages = [
                `${characterName} accumulated +${absAmount} ${resourceName}`,
                `${characterName}'s entropy gauge rose by +${absAmount} ${resourceName}`,
                `${absAmount} ${resourceName} harvested from collapsing timelines by ${characterName}`,
                `${characterName} channeled +${absAmount} ${resourceName}`
            ];
            message = messages[Math.floor(Math.random() * messages.length)];
        } else {
            const messages = [
                `${characterName} vented ${absAmount} ${resourceName}`,
                `${characterName} spent ${absAmount} ${resourceName} manipulating prophecy bounds`,
                `${absAmount} ${resourceName} released by ${characterName}`,
                `${characterName}'s planar matrix cooled by ${absAmount} ${resourceName}`
            ];
            message = messages[Math.floor(Math.random() * messages.length)];
        }

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

    const handleStageChange = (delta) => {
        const newStage = Math.max(0, Math.min(maxStage, mayhemStage + delta));
        const actualAmount = Math.abs(newStage - mayhemStage);
        if (actualAmount > 0) {
            logClassResourceChange('Mayhem Stage', actualAmount, delta > 0, 'mayhemStage');
        }
        if (onClassResourceUpdate) {
            onClassResourceUpdate('current', newStage);
        }
    };

    const handleStageSet = (level) => {
        const newStage = Math.max(0, Math.min(maxStage, level));
        const actualAmount = Math.abs(newStage - mayhemStage);
        if (actualAmount > 0) {
            logClassResourceChange('Mayhem Stage', actualAmount, newStage > mayhemStage, 'mayhemStage');
        }
        if (onClassResourceUpdate) {
            onClassResourceUpdate('current', newStage);
        }
    };

    const handleRollWildSurge = () => {
        const roll = Math.floor(Math.random() * 100) + 1;
        const surge = MASTER_WILD_SURGE_TABLE.find(s => roll >= s.range[0] && roll <= s.range[1]) || MASTER_WILD_SURGE_TABLE[0];
        setLastSurgeResult({ roll, ...surge });

        const actorName = getActorName();
        addCombatNotification({
            type: 'combat_resource',
            attacker: actorName,
            target: actorName,
            amount: roll,
            resourceType: 'wild_surge',
            isPositive: surge.cat === 'Unstable Miracle',
            customMessage: `⚡ MASTER WILD SURGE [d100: ${roll}]: ${surge.name} (${surge.cat}) — ${surge.desc}`
        });

        // Reset Mayhem to 0 on Surge
        if (onClassResourceUpdate) {
            onClassResourceUpdate('current', 0);
        }
    };

    const getVisualIntensity = () => {
        if (mayhemStage === 0) return 'dormant';
        if (mayhemStage <= 3) return 'whisper';
        if (mayhemStage <= 5) return 'escalating';
        if (mayhemStage <= 7) return 'volatile';
        if (mayhemStage <= 9) return 'redline';
        return 'catastrophic';
    };

    const getStageName = (level) => STAGE_NAMES[level] || 'Unknown';
    const getDrawbackText = (level) => DRAWBACK_TEXTS[level] || 'Unknown';

    const getBonusText = (level) => {
        if (level <= 4) return 'None — Safe Zone (0-40)';
        if (level <= 6) return '+1 bonus damage/healing die (Escalating)';
        if (level <= 8) return '+2 bonus dice · +5 ft radius (Volatile)';
        if (level === 9) return '+3 bonus dice · +10 ft radius · +1 target (Maximum)';
        return 'd100 Master Wild Surge — Mayhem resets to 0';
    };

    const getDrawbackColor = (level) => {
        if (level === 0) return '#4a3c2c';
        if (level <= 4) return '#7f8c8d';
        if (level <= 6) return '#8e44ad';
        if (level <= 8) return '#c0392b';
        return '#b30000';
    };

    // Wing rune coordinates (viewBox 0 0 292 76)
    // Left Wing: Stages 1-5 across x=16..118
    // Center Singularity: x=146, y=38, r=24
    // Right Wing: Stages 6-10 across x=174..276
    const leftXs = [24, 46, 68, 90, 112];
    const rightXs = [180, 202, 224, 246, 268];
    const runeXs = [...leftXs, ...rightXs];
    const runeY = 41;

    return (
        <div className={`harbinger-resource-wrapper ${size} ${mayhemStage >= 10 ? 'catastrophic-warning' : ''}`}>
            {/* Main Resource Bar - Pure Scalable Vector Apparatus */}
            <div
                ref={barRef}
                className={`harbinger-resource-bar class-resource-bar mayhem-gauge ${size} clickable intensity-${getVisualIntensity()}`}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => {
                    setShowTooltip(false);
                    setHoveredRune(null);
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    if (isOwner) setShowControls(!showControls);
                }}
            >
                <svg
                    className="harbinger-master-svg"
                    viewBox="0 0 292 76"
                    preserveAspectRatio="xMidYMid meet"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Harbinger Mayhem Singularity"
                >
                    <defs>
                        {/* Glow filters */}
                        <filter id="harbingerGlowViolet" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="1.8" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <filter id="harbingerGlowMagenta" x="-40%" y="-40%" width="180%" height="180%">
                            <feGaussianBlur stdDeviation="2.4" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                        <filter id="harbingerGlowCataclysm" x="-50%" y="-50%" width="200%" height="200%">
                            <feGaussianBlur stdDeviation="3.2" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Base Obsidian & Chitin Gradients */}
                        <linearGradient id="harbingerObsidian" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#1e0b2e" />
                            <stop offset="35%" stopColor="#12061c" />
                            <stop offset="75%" stopColor="#0a0310" />
                            <stop offset="100%" stopColor="#040106" />
                        </linearGradient>

                        <linearGradient id="harbingerVoidBorder" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="#6b21a8" />
                            <stop offset="30%" stopColor="#a855f7" />
                            <stop offset="50%" stopColor="#e879f9" />
                            <stop offset="70%" stopColor="#9333ea" />
                            <stop offset="100%" stopColor="#4c1d95" />
                        </linearGradient>

                        <radialGradient id="harbingerSingularity" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#050009" />
                            <stop offset="45%" stopColor="#1a0033" />
                            <stop offset="75%" stopColor="#7e22ce" />
                            <stop offset="92%" stopColor="#c026d3" />
                            <stop offset="100%" stopColor="#3b0764" />
                        </radialGradient>

                        <radialGradient id="harbingerVolatileCore" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#fff1f2" />
                            <stop offset="25%" stopColor="#fb7185" />
                            <stop offset="60%" stopColor="#e11d48" />
                            <stop offset="85%" stopColor="#881337" />
                            <stop offset="100%" stopColor="#4c0519" />
                        </radialGradient>
                    </defs>

                    {/* Chassis Base Plate: Chiseled Cosmic Obsidian Slab */}
                    <rect
                        x="1.5"
                        y="1.5"
                        width="289"
                        height="73"
                        rx="6"
                        fill="url(#harbingerObsidian)"
                        stroke="url(#harbingerVoidBorder)"
                        strokeWidth="1.6"
                        className="harbinger-chassis-base"
                    />

                    {/* Inner Dimensional Fracture Inset */}
                    <rect
                        x="3.5"
                        y="3.5"
                        width="285"
                        height="69"
                        rx="4.5"
                        fill="none"
                        stroke="rgba(192, 132, 252, 0.45)"
                        strokeWidth="1.0"
                        pointerEvents="none"
                    />

                    {/* Abyssal Corner Void Studs */}
                    <circle cx="6" cy="6" r="2.0" fill="#4c1d95" stroke="#f0abfc" strokeWidth="0.8" pointerEvents="none" />
                    <circle cx="286" cy="6" r="2.0" fill="#4c1d95" stroke="#f0abfc" strokeWidth="0.8" pointerEvents="none" />
                    <circle cx="6" cy="70" r="2.0" fill="#4c1d95" stroke="#f0abfc" strokeWidth="0.8" pointerEvents="none" />
                    <circle cx="286" cy="70" r="2.0" fill="#4c1d95" stroke="#f0abfc" strokeWidth="0.8" pointerEvents="none" />

                    {/* Corner Chitinous Tendril Claws */}
                    <path d="M 4 15 C 6 11 11 6 15 4 M 4 61 C 6 65 11 70 15 72 M 288 15 C 286 11 281 6 277 4 M 288 61 C 286 65 281 70 277 72" stroke="rgba(232, 121, 249, 0.65)" strokeWidth="1.2" fill="none" pointerEvents="none" />

                    {/* Energy Conduit Conduits connecting runes to Singularity */}
                    <line x1="18" y1="41" x2="118" y2="41" stroke="rgba(192, 132, 252, 0.5)" strokeWidth="1.2" />
                    <line x1="174" y1="41" x2="274" y2="41" stroke="rgba(192, 132, 252, 0.5)" strokeWidth="1.2" />

                    {/* Active Entropy Beam (Left) */}
                    {mayhemStage > 0 && (
                        <line
                            x1="18"
                            y1="41"
                            x2={leftXs[Math.min(4, mayhemStage - 1)]}
                            y2="41"
                            stroke="#c084fc"
                            strokeWidth="1.4"
                            strokeDasharray="4 2"
                            filter="url(#harbingerGlowViolet)"
                            pointerEvents="none"
                        />
                    )}

                    {/* Volatile Entropy Beam (Right) */}
                    {mayhemStage >= 6 && (
                        <line
                            x1="174"
                            y1="41"
                            x2={rightXs[Math.min(4, mayhemStage - 6)]}
                            y2="41"
                            stroke={mayhemStage >= 9 ? "#f43f5e" : "#e879f9"}
                            strokeWidth="1.5"
                            strokeDasharray="4 2"
                            filter="url(#harbingerGlowMagenta)"
                            pointerEvents="none"
                        />
                    )}
                    {/* ========================================================= */}
                    {/* CENTERPIECE: THE ABYSSAL VALVE & SINGULARITY EYE          */}
                    {/* ========================================================= */}
                    <g
                        className={`harbinger-center-core ${mayhemStage >= 10 ? 'cataclysm-active' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (isOwner && mayhemStage >= 10) {
                                handleRollWildSurge();
                            } else if (isOwner) {
                                setShowControls(prev => !prev);
                            }
                        }}
                        style={{ cursor: isOwner ? 'pointer' : 'default' }}
                        title={mayhemStage >= 10 ? "Catastrophic Mayhem! Click to roll Master Wild Surge!" : "Click to open Mayhem Controls"}
                    >
                        {/* Outer Chitin Teeth Ring */}
                        <circle cx="146" cy="38" r="24.5" fill="none" stroke="rgba(216, 180, 254, 0.55)" strokeWidth="1.0" strokeDasharray="3 3" />
                        {Array.from({ length: 12 }, (_, i) => {
                            const angle = (i * 30 * Math.PI) / 180;
                            const x1 = 146 + 22.5 * Math.cos(angle);
                            const y1 = 38 + 22.5 * Math.sin(angle);
                            const x2 = 146 + 25 * Math.cos(angle);
                            const y2 = 38 + 25 * Math.sin(angle);
                            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(240, 171, 252, 0.85)" strokeWidth="1.1" />;
                        })}

                        {/* Singularity Void Disk */}
                        <circle
                            cx="146"
                            cy="38"
                            r="21.5"
                            fill={mayhemStage >= 10 ? "url(#harbingerVolatileCore)" : "url(#harbingerSingularity)"}
                            stroke={mayhemStage >= 10 ? "#f43f5e" : "url(#harbingerVoidBorder)"}
                            strokeWidth="1.4"
                            filter={mayhemStage >= 10 ? "url(#harbingerGlowCataclysm)" : "url(#harbingerGlowViolet)"}
                            className={`harbinger-core-orb ${mayhemStage >= 10 ? 'pulsing-core' : ''}`}
                        />

                        {/* Swirling Event Horizon Rings */}
                        <circle cx="146" cy="38" r="16.5" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="0.6" strokeDasharray="5 3" className="harbinger-vortex-ring" />
                        <circle cx="146" cy="38" r="11" fill="none" stroke="rgba(232, 121, 249, 0.45)" strokeWidth="0.5" strokeDasharray="4 2" />

                        {/* Central Void Eye Pupil / Singularity Pit */}
                        <ellipse
                            cx="146"
                            cy="38"
                            rx={mayhemStage >= 10 ? "7.5" : `${3.5 + mayhemStage * 0.35}`}
                            ry={mayhemStage >= 10 ? "7.5" : `${2.5 + mayhemStage * 0.25}`}
                            fill="#030006"
                            stroke={mayhemStage >= 10 ? "#ffffff" : "#d946ef"}
                            strokeWidth={mayhemStage >= 10 ? "1.2" : "0.8"}
                            pointerEvents="none"
                        />
                    </g>

                    {/* ========================================================= */}
                    {/* 10 ELDRITCH FRACTURE RUNES (STAGES 1 THROUGH 10)          */}
                    {/* ========================================================= */}
                    {Array.from({ length: maxStage }, (_, idx) => {
                        const stageNum = idx + 1;
                        const cx = runeXs[idx];
                        const cy = runeY;
                        const isFilled = mayhemStage >= stageNum;
                        const isCurrentTier = mayhemStage === stageNum;
                        const isVolatile = stageNum >= 6;
                        const isCatastrophic = stageNum === 10;
                        const isHovered = hoveredRune === stageNum;

                        const runeColor = isCatastrophic
                            ? (isFilled ? "#fb7185" : "rgba(244, 63, 94, 0.75)")
                            : isVolatile
                                ? (isFilled ? "#e879f9" : "rgba(217, 70, 239, 0.7)")
                                : (isFilled ? "#c084fc" : "rgba(168, 85, 247, 0.65)");

                        return (
                            <g
                                key={stageNum}
                                className={`harbinger-rune-slot slot-${stageNum} ${isFilled ? 'filled' : 'empty'} ${isCurrentTier ? 'current-active' : ''} ${isCatastrophic ? 'catastrophic' : ''} ${isHovered ? 'hovered' : ''}`}
                                data-stage={stageNum}
                                onMouseEnter={() => setHoveredRune(stageNum)}
                                onMouseLeave={() => setHoveredRune(null)}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if (!isOwner) return;
                                    if (mayhemStage === stageNum) {
                                        handleStageSet(stageNum - 1);
                                    } else {
                                        handleStageSet(stageNum);
                                    }
                                }}
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    if (!isOwner) return;
                                    handleStageChange(-1);
                                }}
                                style={{ cursor: isOwner ? 'pointer' : 'default' }}
                            >
                                {/* Generous transparent hit area */}
                                <rect x={cx - 10} y={cy - 18} width="20" height="38" fill="transparent" pointerEvents="all" />

                                {/* Recessed Obsidian Glyph Socket */}
                                <polygon
                                    points={`${cx},${cy - 11} ${cx + 8.5},${cy} ${cx},${cy + 11} ${cx - 8.5},${cy}`}
                                    fill={isFilled ? "rgba(42, 12, 66, 0.95)" : "rgba(24, 9, 38, 0.9)"}
                                    stroke={isFilled ? runeColor : "rgba(192, 132, 252, 0.65)"}
                                    strokeWidth={isFilled ? "1.4" : "1.1"}
                                    filter={isFilled ? "url(#harbingerGlowViolet)" : undefined}
                                    pointerEvents="none"
                                />

                                {/* Internal Guideline Tick marks */}
                                <line x1={cx - 5} y1={cy} x2={cx + 5} y2={cy} stroke="rgba(216, 180, 254, 0.45)" strokeWidth="0.8" pointerEvents="none" />

                                {/* Glowing Vector Rune Glyph */}
                                <g transform={`translate(${cx}, ${cy})`} pointerEvents="none">
                                    <path
                                        d={RUNE_GLYPHS[stageNum]}
                                        fill="none"
                                        stroke={isFilled ? (isHovered ? "#ffffff" : runeColor) : "rgba(233, 213, 255, 0.75)"}
                                        strokeWidth={isFilled ? "1.4" : "1.15"}
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        filter={isFilled ? (isCatastrophic ? "url(#harbingerGlowCataclysm)" : "url(#harbingerGlowMagenta)") : undefined}
                                    />
                                    {isFilled && (
                                        <circle cx="0" cy="0" r="1.1" fill="#ffffff" pointerEvents="none" />
                                    )}
                                </g>

                                {/* Stage Pip Indicator */}
                                <circle
                                    cx={cx}
                                    cy="60"
                                    r={isFilled ? (isCurrentTier ? 2.0 : 1.4) : 1.0}
                                    fill={isFilled ? (isCurrentTier ? '#ffffff' : runeColor) : 'rgba(233, 213, 255, 0.35)'}
                                    pointerEvents="none"
                                />
                            </g>
                        );
                    })}
                </svg>
            </div>

            {/* Shared ClassTip Tooltip (Mechanic / Right now / Use) */}
            {showTooltip && !showControls && ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip harbinger-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}>
                    <ClassTip
                        icon="fas fa-meteor"
                        tint="#a855f7"
                        title={`${getStageName(mayhemStage)} (Stage ${mayhemStage}/${maxStage})`}
                        subtitle="Harbinger Abyssal Mayhem"
                        state={getBonusText(mayhemStage)}
                        stateTone={mayhemStage >= 6 ? 'bad' : mayhemStage >= 5 ? 'warn' : 'neutral'}
                        mechanic="Cast spells and plant prophecies to build Mayhem: Safe (0-40) no bonus, Escalating (41-60) +1 damage/healing die, Volatile (61-80) +2 dice and +5 ft radius, Maximum (81-99) +3 dice, +10 ft, and +1 target. Spend Mayhem to widen prophecy ranges; at 100 a d100 Master Wild Surge fires and Mayhem resets to 0."
                        status={[
                            mayhemStage >= 9
                                ? { text: 'UNSTABLE — 25% misfire (2d6 storm), +50% vulnerability to smashing and slicing. Spend down or ride it.', tone: 'bad' }
                                : mayhemStage >= 7
                                    ? { text: 'VOLATILE — 25% misfire, +25% vulnerability to smashing and slicing.', tone: 'warn' }
                                    : mayhemStage > 0
                                        ? 'Amplified and climbing — watch the drawbacks.'
                                        : 'Dormant — cast to build Mayhem.',
                            'Maintaining an active doom prophecy blocks all healing.'
                        ]}
                        usage={isOwner ? 'Click bar for controls · Shift+Click or click rune to set stage · Click center to roll Surge.' : null}
                    />
                </div>,
                document.body
            )}

            {/* Unified Context Controls Menu (Standard Project Theme) */}
            {showControls && ReactDOM.createPortal(
                <div
                    ref={controlsMenuRef}
                    className={`unified-context-menu compact context-menu-container harbinger-menu-container class-resource-menu ${context === 'party' ? 'chronarch-party' : ''}`}
                    onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                    onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                    style={(() => {
                        if (!barRef.current) return { position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 100000 };
                        const frame = barRef.current.closest('.party-member-frame') || barRef.current.closest('.party-hud');
                        const frameRect = frame ? frame.getBoundingClientRect() : barRef.current.getBoundingClientRect();
                        return {
                            position: 'fixed',
                            top: `${frame ? frameRect.bottom + 4 : barRef.current.getBoundingClientRect().bottom + 8}px`,
                            left: `${frame ? frameRect.left : barRef.current.getBoundingClientRect().left}px`,
                            zIndex: 100000
                        };
                    })()}
                >
                    <div className="context-menu-main">
                        <div className="context-menu-section">
                            <div className="context-menu-section-header">Harbinger Mayhem Controls</div>

                            {/* Current state summary */}
                            <div style={{ fontSize: '0.8rem', marginBottom: '6px', lineHeight: 1.35 }}>
                                <div><strong>Stage:</strong> {getStageName(mayhemStage)} <span style={{ color: '#d8b4fe' }}>(Level {mayhemStage}/{maxStage})</span></div>
                                <div><strong>Bonus:</strong> {getBonusText(mayhemStage)}</div>
                                <div style={{ color: mayhemStage >= 8 ? '#f87171' : mayhemStage >= 6 ? '#d8b4fe' : 'var(--crm-text-dim, #cbd5e1)' }}>
                                    <strong>Drawback:</strong> {getDrawbackText(mayhemStage)}
                                </div>
                                {mayhemStage >= 6 && (
                                    <div style={{ color: '#f87171', fontStyle: 'italic', marginTop: '2px' }}>
                                        Planar Instability active — Physical vulnerability & misfire risks engaged.
                                    </div>
                                )}
                                {mayhemStage === 0 && (
                                    <div style={{ color: 'var(--crm-text-dim, #cbd5e1)', fontStyle: 'italic', marginTop: '2px' }}>
                                        Cast spells to build Mayhem. Spend Mayhem to widen prophecy ranges.
                                    </div>
                                )}
                            </div>

                            <div className="context-menu-section-header" style={{ fontSize: '12px', marginTop: '8px', marginBottom: '8px' }}>
                                Set Mayhem Level
                            </div>

                            {/* Direct Jump Grid (0 to 10) */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lvl) => (
                                    <button
                                        key={lvl}
                                        className={`context-menu-button ${mayhemStage === lvl ? 'active' : ''} ${lvl >= 10 ? 'danger' : ''}`}
                                        onClick={() => handleStageSet(lvl)}
                                    >
                                        {lvl}
                                    </button>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <button className="context-menu-button" onClick={() => handleStageChange(-1)}>
                                    <i className="fas fa-minus-circle"></i>
                                    -1
                                </button>
                                <button className="context-menu-button" onClick={() => handleStageChange(1)}>
                                    <i className="fas fa-plus-circle"></i>
                                    +1
                                </button>
                            </div>

                            <div className="context-menu-main-separator" style={{ margin: '10px 0' }}></div>

                            {/* Master Wild Surge Trigger */}
                            <button
                                className="context-menu-button"
                                style={{ width: '100%', marginBottom: '8px', backgroundColor: '#8e44ad', color: '#ffffff', fontWeight: 'bold' }}
                                onClick={handleRollWildSurge}
                            >
                                <i className="fas fa-dice-d20" style={{ marginRight: '6px' }}></i>
                                Roll d100 Master Wild Surge
                            </button>

                            {lastSurgeResult && (
                                <div style={{ padding: '6px', background: 'rgba(142, 68, 173, 0.1)', border: '1px solid #8e44ad', borderRadius: '4px', fontSize: '0.76rem', marginBottom: '8px' }}>
                                    <div style={{ fontWeight: 'bold', color: '#d8b4fe' }}>
                                        d100 = {lastSurgeResult.roll}: {lastSurgeResult.name}
                                    </div>
                                    <div style={{ color: 'var(--crm-text-dim, #cbd5e1)', fontSize: '0.72rem', marginTop: '2px' }}>
                                        {lastSurgeResult.desc}
                                    </div>
                                </div>
                            )}

                            <button className="context-menu-button danger" onClick={() => setShowControls(false)} style={{ width: '100%' }}>
                                <i className="fas fa-times"></i>
                                Close
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default HarbingerResourceBar;

