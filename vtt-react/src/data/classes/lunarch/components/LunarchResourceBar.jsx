import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/LunarchResourceBar.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import '../../../../styles/unified-context-menu.css';
import ClassTip from '../../../../components/hud/ClassTip';

/**
 * Lunarch Resource Bar: "The Living Moon-Eye of Vael & The Celestial Orrery"
 *
 * Full 360px wide astronomical spectacle:
 * - Left Flank: Crescent Sickle of Vael (Step back 1 round / previous phase, Shift: New Moon)
 * - 4 Cardinal Moon Sanctuaries:
 *     1. New Moon (The Stygian Eclipse) at cx=58 (.lunar-phase-node.new_moon)
 *     2. Waxing Moon (The Silver Horn) at cx=114 (.lunar-phase-node.waxing_moon)
 *     3. Full Moon (The Radiant Zenith) at cx=246 (.lunar-phase-node.full_moon)
 *     4. Waning Moon (The Twilight Husk) at cx=302 (.lunar-phase-node.waning_moon)
 * - Centerpiece: The Living Hero Moon & Astrolabe Meridian Needle at cx=180 (.lunar-center-astrolabe)
 *     * Physically transforms based on active moon phase (Eclipse Corona, Waxing Horn, Full Supernova, Waning Dusk)
 *     * Tri-Star Chronometer Halo: 3 distinct celestial star-pearls showing Round 1, Round 2, Round 3 (Transition Imminent)
 *     * Curved Phase Orbit Progress Filament underneath
 * - Right Flank: Morning-Star Chronometer Key (Step forward 1 round / next phase, Shift: Full Moon)
 */
const LunarchResourceBar = ({
    classResource = {},
    size = 'normal',
    config = {},
    context = 'hud',
    isOwner = true,
    onClassResourceUpdate = null
}) => {
    const phaseOrder = ['new_moon', 'waxing_moon', 'full_moon', 'waning_moon'];

    // Resolve initial phase from string or numeric index
    const parsePhase = (val) => {
        if (typeof val === 'string' && phaseOrder.includes(val)) return val;
        if (typeof val === 'number' && val >= 0 && val < 4) return phaseOrder[val];
        return 'new_moon';
    };

    const propPhase = parsePhase(classResource?.currentLunarPhase ?? classResource?.phase ?? classResource?.current);
    const propRounds = classResource?.roundsInPhase ?? classResource?.round ?? 0;

    const [currentPhase, setCurrentPhase] = useState(propPhase);
    const [roundsInPhase, setRoundsInPhase] = useState(propRounds);

    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);

    useEffect(() => {
        if (classResource?.currentLunarPhase !== undefined) setCurrentPhase(parsePhase(classResource.currentLunarPhase));
        else if (classResource?.phase !== undefined) setCurrentPhase(parsePhase(classResource.phase));
        else if (classResource?.current !== undefined) setCurrentPhase(parsePhase(classResource.current));
    }, [classResource?.currentLunarPhase, classResource?.phase, classResource?.current]);

    useEffect(() => {
        if (classResource?.roundsInPhase !== undefined) setRoundsInPhase(classResource.roundsInPhase);
        else if (classResource?.round !== undefined) setRoundsInPhase(classResource.round);
    }, [classResource?.roundsInPhase, classResource?.round]);

    const barRef = useRef(null);
    const controlsMenuRef = useRef(null);
    const tooltipRef = useResourceBarTooltip(barRef, showTooltip, [currentPhase, roundsInPhase]);

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

    const logClassResourceChange = (phaseName, roundCount) => {
        const actorName = getActorName();
        const characterName = currentPlayerName || 'Character';

        addCombatNotification({
            type: 'combat_resource',
            attacker: actorName,
            target: characterName,
            amount: roundCount,
            resourceType: 'lunarPhase',
            isPositive: true,
            customMessage: `${characterName} channeled the ${phaseName} (Round ${roundCount + 1}/3)`
        });
    };

    const updatePhaseAndRound = (newPhase, newRounds) => {
        setCurrentPhase(newPhase);
        setRoundsInPhase(newRounds);
        const phaseIndex = phaseOrder.indexOf(newPhase);

        const phaseTitles = {
            new_moon: 'New Moon',
            waxing_moon: 'Waxing Moon',
            full_moon: 'Full Moon',
            waning_moon: 'Waning Moon'
        };

        logClassResourceChange(phaseTitles[newPhase] || newPhase, newRounds);

        if (onClassResourceUpdate) {
            onClassResourceUpdate('currentLunarPhase', newPhase);
            onClassResourceUpdate('phase', newPhase);
            onClassResourceUpdate('roundsInPhase', newRounds);
            onClassResourceUpdate('round', newRounds);
            onClassResourceUpdate('current', phaseIndex);
        }
    };

    const handlePhaseSelect = (e, targetPhase) => {
        e.stopPropagation();
        if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation();
        if (!isOwner) return;
        updatePhaseAndRound(targetPhase, 0);
    };

    const handleAdvanceRound = (e) => {
        e.stopPropagation();
        if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation();
        if (!isOwner) return;

        if (e.shiftKey) {
            // Jump directly to Full Moon
            updatePhaseAndRound('full_moon', 0);
            return;
        }

        const nextRounds = roundsInPhase + 1;
        if (nextRounds >= 3) {
            // Auto cycle to next phase
            const currentIndex = phaseOrder.indexOf(currentPhase);
            const nextPhase = phaseOrder[(currentIndex + 1) % 4];
            updatePhaseAndRound(nextPhase, 0);
        } else {
            updatePhaseAndRound(currentPhase, nextRounds);
        }
    };

    const handleRegressRound = (e) => {
        e.stopPropagation();
        if (e.nativeEvent?.stopImmediatePropagation) e.nativeEvent.stopImmediatePropagation();
        if (!isOwner) return;

        if (e.shiftKey) {
            // Jump directly to New Moon
            updatePhaseAndRound('new_moon', 0);
            return;
        }

        if (roundsInPhase > 0) {
            updatePhaseAndRound(currentPhase, roundsInPhase - 1);
        } else {
            // Roll back to previous phase at round 2
            const currentIndex = phaseOrder.indexOf(currentPhase);
            const prevPhase = phaseOrder[(currentIndex + 3) % 4];
            updatePhaseAndRound(prevPhase, 2);
        }
    };

    // 4 Cardinal Moon Phase configurations
    const moonPhases = [
        {
            id: 'new_moon',
            name: 'New Moon',
            subtitle: 'Stygian Eclipse',
            theme: 'Dark Void Defense',
            buff: '+3 DR · Charm/Fear Immunity',
            cx: 58,
            cy: 28,
            color: '#1e1b4b',
            glow: '#818cf8',
            accent: '#c7d2fe',
            ringColor: '#6366f1'
        },
        {
            id: 'waxing_moon',
            name: 'Waxing Moon',
            subtitle: 'The Silver Horn',
            theme: 'Astral Surge',
            buff: '+1d6 Sensation Damage · +10ft Speed',
            cx: 114,
            cy: 28,
            color: '#0369a1',
            glow: '#38bdf8',
            accent: '#e0f2fe',
            ringColor: '#0ea5e9'
        },
        {
            id: 'full_moon',
            name: 'Full Moon',
            subtitle: 'Radiant Zenith',
            theme: 'Apocalyptic Corona',
            buff: '+2d8 Sacred Damage · Ignores 50% DR',
            cx: 246,
            cy: 28,
            color: '#ca8a04',
            glow: '#fde047',
            accent: '#ffffff',
            ringColor: '#eab308'
        },
        {
            id: 'waning_moon',
            name: 'Waning Moon',
            subtitle: 'Twilight Husk',
            theme: 'Vitality Siphon',
            buff: '-3 Mana Cost · 25% Vampiric Drain',
            cx: 302,
            cy: 28,
            color: '#7e22ce',
            glow: '#c084fc',
            accent: '#f3e8ff',
            ringColor: '#a855f7'
        }
    ];

    const currentPhaseData = moonPhases.find(p => p.id === currentPhase) || moonPhases[0];
    const isFullMoon = currentPhase === 'full_moon';
    const isShiftImminent = roundsInPhase >= 2;

    return (
        <div className={`lunarch-resource-container ${size} context-${context}`}>
            <div className="resource-bar-row">
                <div
                    ref={barRef}
                    className={`lunarch-resource-bar ${size} phase-${currentPhase} ${isFullMoon ? 'zenith-radiance' : ''} clickable`}
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
                        className="lunarch-astrolabe-svg"
                        viewBox="0 0 360 56"
                        preserveAspectRatio="xMidYMid meet"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            {/* Deep Astral Space Void Gradient */}
                            <linearGradient id="lunarVoidSky" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#080714" />
                                <stop offset="25%" stopColor="#0f1124" />
                                <stop offset="50%" stopColor="#151730" />
                                <stop offset="75%" stopColor="#0f1124" />
                                <stop offset="100%" stopColor="#080714" />
                            </linearGradient>

                            {/* Celestial Silver Blade Gradient for Orrery Horns */}
                            <linearGradient id="lunarSilverCrescent" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="35%" stopColor="#cbd5e1" />
                                <stop offset="70%" stopColor="#64748b" />
                                <stop offset="100%" stopColor="#1e293b" />
                            </linearGradient>

                            {/* Golden Astrolabe Trim Gradient */}
                            <linearGradient id="lunarBrassGrad" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#fef08a" />
                                <stop offset="45%" stopColor="#ca8a04" />
                                <stop offset="85%" stopColor="#713f12" />
                                <stop offset="100%" stopColor="#3b1d06" />
                            </linearGradient>

                            {/* 1. Hero New Moon: Dark Star Eclipse Void */}
                            <radialGradient id="heroNewMoonGrad" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#080714" />
                                <stop offset="70%" stopColor="#100f28" />
                                <stop offset="90%" stopColor="#312e81" />
                                <stop offset="100%" stopColor="#818cf8" />
                            </radialGradient>

                            {/* 2. Hero Waxing Moon: Razor Silver-Cyan Crescent on Deep Astral Blue */}
                            <radialGradient id="heroWaxingGrad" cx="68%" cy="42%" r="62%">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="32%" stopColor="#7dd3fc" />
                                <stop offset="68%" stopColor="#0284c7" />
                                <stop offset="92%" stopColor="#0369a1" />
                                <stop offset="100%" stopColor="#082f49" />
                            </radialGradient>

                            {/* 3. Hero Full Moon: Blinding White-Gold Supernova */}
                            <radialGradient id="heroFullGrad" cx="46%" cy="40%" r="62%">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="25%" stopColor="#fef08a" />
                                <stop offset="55%" stopColor="#facc15" />
                                <stop offset="85%" stopColor="#ca8a04" />
                                <stop offset="100%" stopColor="#854d0e" />
                            </radialGradient>

                            {/* 4. Hero Waning Moon: Dusky Twilight Amethyst Crescent */}
                            <radialGradient id="heroWaningGrad" cx="32%" cy="42%" r="62%">
                                <stop offset="0%" stopColor="#ffffff" />
                                <stop offset="32%" stopColor="#e9d5ff" />
                                <stop offset="68%" stopColor="#a855f7" />
                                <stop offset="92%" stopColor="#7e22ce" />
                                <stop offset="100%" stopColor="#3b0764" />
                            </radialGradient>

                            {/* Filter: Celestial Starlight Glow */}
                            <filter id="lunarStarGlow" x="-40%" y="-40%" width="180%" height="180%">
                                <feGaussianBlur stdDeviation="2.2" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            {/* Filter: Super Hero Moon Corona Aura */}
                            <filter id="lunarHeroAura" x="-60%" y="-60%" width="220%" height="220%">
                                <feGaussianBlur stdDeviation="4.5" result="blur1" />
                                <feGaussianBlur stdDeviation="1.8" result="blur2" />
                                <feMerge>
                                    <feMergeNode in="blur1" />
                                    <feMergeNode in="blur2" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            {/* Filter: Full Zenith Supernova Flare */}
                            <filter id="lunarZenithBurst" x="-80%" y="-80%" width="260%" height="260%">
                                <feGaussianBlur stdDeviation="6" result="blur1" />
                                <feGaussianBlur stdDeviation="2.5" result="blur2" />
                                <feMerge>
                                    <feMergeNode in="blur1" />
                                    <feMergeNode in="blur2" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            <filter id="lunarDropShadow" x="-15%" y="-15%" width="130%" height="130%">
                                <feDropShadow dx="0" dy="2" stdDeviation="1.8" floodColor="#000000" floodOpacity="0.9" />
                            </filter>
                        </defs>

                        {/* 1. CELESTIAL HORIZON & NOCTURNAL ORRERY BED */}
                        <g filter="url(#lunarDropShadow)">
                            {/* Outer Star-Iron Crescent Chassis */}
                            <path
                                d="M 12 7 C 80 3, 280 3, 348 7 C 356 7, 358 15, 356 28 C 358 41, 356 49, 348 49 C 280 53, 80 53, 12 49 C 4 49, 2 41, 4 28 C 2 15, 4 7, 12 7 Z"
                                fill="url(#lunarVoidSky)"
                                stroke="#475569"
                                strokeWidth="1.4"
                            />
                            {/* Inner Recessed Celestial Starfield */}
                            <path
                                d="M 14 9.5 C 80 5.5, 280 5.5, 346 9.5 C 353 9.5, 355 17, 353 28 C 355 39, 353 46.5, 346 46.5 C 280 50.5, 80 50.5, 14 46.5 C 7 46.5, 5 39, 7 28 C 5 17, 7 9.5, 14 9.5 Z"
                                fill="#07060f"
                                stroke="rgba(255, 255, 255, 0.08)"
                                strokeWidth="0.8"
                            />
                        </g>

                        {/* Background Ecliptic Orbit Wave linking all lunar coordinates */}
                        <path
                            d="M 28 28 Q 180 35 332 28"
                            fill="none"
                            stroke="#1e293b"
                            strokeWidth="3.5"
                        />
                        <path
                            d="M 28 28 Q 180 35 332 28"
                            fill="none"
                            stroke={currentPhaseData.glow}
                            strokeWidth="1.2"
                            strokeDasharray="4 4"
                            opacity="0.5"
                        />

                        {/* Astrolabe Degree Graduation Ticks across Outer Rims */}
                        {[22, 40, 58, 86, 114, 140, 160, 200, 220, 246, 274, 302, 320, 338].map((tx, i) => (
                            <g key={i}>
                                <line x1={tx} y1="8" x2={tx} y2="11.5" stroke="#64748b" strokeWidth="0.8" />
                                <line x1={tx} y1="44.5" x2={tx} y2="48" stroke="#64748b" strokeWidth="0.8" />
                            </g>
                        ))}

                        {/* 2. LEFT FLANK TRIGGER: CRESCENT SICKLE OF VAEL (◄) */}
                        <g
                            className="lunar-flank-trigger lunar-flank-left"
                            onClick={handleRegressRound}
                            style={{ cursor: isOwner ? 'pointer' : 'default' }}
                        >
                            {/* Curved Silver Crescent Blade with Pointed Horns */}
                            <path
                                d="M 26 12 C 10 16, 8 40, 26 44 C 18 38, 18 18, 26 12 Z"
                                fill="url(#lunarSilverCrescent)"
                                stroke="#94a3b8"
                                strokeWidth="1"
                                filter="url(#lunarStarGlow)"
                            />
                            {/* Tactile Regress Chevron Glyph ◄ */}
                            <polygon
                                points="16,28 21,24 21,32"
                                fill={isOwner ? '#e2e8f0' : '#64748b'}
                                opacity="0.9"
                            />
                            {/* Star Pearl Pivot */}
                            <circle cx="23" cy="28" r="2" fill="#818cf8" filter="url(#lunarStarGlow)" />

                            {/* Full-Height Transparent Hitbox with isolated propagation */}
                            <rect
                                x="2"
                                y="4"
                                width="32"
                                height="48"
                                fill="transparent"
                                pointerEvents="all"
                            >
                                <title>{isOwner ? 'Regress Phase / Round (Click: -1 Round, Shift: New Moon)' : 'Moon Sickle'}</title>
                            </rect>
                        </g>

                        {/* 3. THE 4 CARDINAL MOON SANCTUARIES */}
                        {moonPhases.map((moon) => {
                            const isActive = currentPhase === moon.id;

                            return (
                                <g
                                    key={moon.id}
                                    className={`lunar-phase-node ${moon.id} ${isActive ? 'active' : 'inactive'}`}
                                    onClick={(e) => handlePhaseSelect(e, moon.id)}
                                    style={{ cursor: isOwner ? 'pointer' : 'default' }}
                                >
                                    {/* Active Sanctuary Orbital Beam connecting toward Center */}
                                    {isActive && (
                                        <g>
                                            <line
                                                x1={moon.cx}
                                                y1={moon.cy}
                                                x2={moon.cx < 180 ? moon.cx + 26 : moon.cx - 26}
                                                y2={moon.cy}
                                                stroke={moon.glow}
                                                strokeWidth="2"
                                                opacity="0.75"
                                                strokeDasharray="2 2"
                                                filter="url(#lunarStarGlow)"
                                            />
                                            {/* Radiant Aura Ring */}
                                            <circle
                                                cx={moon.cx}
                                                cy={moon.cy}
                                                r="16.5"
                                                fill="none"
                                                stroke={moon.glow}
                                                strokeWidth="1.6"
                                                strokeDasharray="3 2"
                                                filter="url(#lunarStarGlow)"
                                            />
                                            {/* Phase Pointer Triangle at Upper Rim */}
                                            <polygon
                                                points={`${moon.cx},9 ${moon.cx + 2.5},12.5 ${moon.cx - 2.5},12.5`}
                                                fill={moon.accent}
                                            />
                                        </g>
                                    )}

                                    {/* Outer Brass Sanctuary Setting */}
                                    <circle
                                        cx={moon.cx}
                                        cy={moon.cy}
                                        r="12.5"
                                        fill="#0a0a14"
                                        stroke={isActive ? moon.ringColor : '#334155'}
                                        strokeWidth={isActive ? '1.8' : '1'}
                                    />

                                    {/* 🌑 1. NEW MOON SANCTUARY (cx = 58) */}
                                    {moon.id === 'new_moon' && (
                                        <g>
                                            {/* Eclipse Void Sphere with glowing perimeter */}
                                            <circle
                                                cx={moon.cx}
                                                cy={moon.cy}
                                                r="9.5"
                                                fill="#070614"
                                                stroke={isActive ? '#818cf8' : '#312e81'}
                                                strokeWidth={isActive ? '1.5' : '0.8'}
                                                filter={isActive ? 'url(#lunarStarGlow)' : undefined}
                                            />
                                            {/* Subtle Inner Eclipse Sliver */}
                                            <path
                                                d={`M ${moon.cx - 6} ${moon.cy - 6} A 9.5 9.5 0 0 1 ${moon.cx + 6} ${moon.cy + 6}`}
                                                fill="none"
                                                stroke="#c7d2fe"
                                                strokeWidth="0.8"
                                                opacity={isActive ? 0.9 : 0.4}
                                            />
                                        </g>
                                    )}

                                    {/* 🌓 2. WAXING MOON SANCTUARY (cx = 114) */}
                                    {moon.id === 'waxing_moon' && (
                                        <g>
                                            {/* Dark base disc */}
                                            <circle cx={moon.cx} cy={moon.cy} r="9.5" fill="#080d16" stroke="#1e293b" strokeWidth="0.8" />
                                            {/* Illuminated Right Crescent */}
                                            <path
                                                d={`M ${moon.cx} ${moon.cy - 9.5} A 9.5 9.5 0 0 1 ${moon.cx} ${moon.cy + 9.5} A 9.5 9.5 0 0 0 ${moon.cx} ${moon.cy - 9.5} Z`}
                                                fill={isActive ? 'url(#heroWaxingGrad)' : '#38bdf8'}
                                                stroke={isActive ? '#7dd3fc' : '#0284c7'}
                                                strokeWidth={isActive ? '1.2' : '0.6'}
                                                filter={isActive ? 'url(#lunarStarGlow)' : undefined}
                                            />
                                        </g>
                                    )}

                                    {/* 🌕 3. FULL MOON SANCTUARY (cx = 246) */}
                                    {moon.id === 'full_moon' && (
                                        <g>
                                            {/* Radiant Orb */}
                                            <circle
                                                cx={moon.cx}
                                                cy={moon.cy}
                                                r="9.5"
                                                fill={isActive ? 'url(#heroFullGrad)' : '#ca8a04'}
                                                stroke={isActive ? '#ffffff' : '#eab308'}
                                                strokeWidth={isActive ? '1.6' : '1'}
                                                filter={isActive ? 'url(#lunarStarGlow)' : undefined}
                                            />
                                            {/* Internal Mare contour */}
                                            <path
                                                d={`M ${moon.cx - 4} ${moon.cy - 2} Q ${moon.cx} ${moon.cy + 3} ${moon.cx + 4} ${moon.cy - 2}`}
                                                fill="none"
                                                stroke="#92400e"
                                                strokeWidth="1"
                                                opacity="0.4"
                                            />
                                        </g>
                                    )}

                                    {/* 🌗 4. WANING MOON SANCTUARY (cx = 302) */}
                                    {moon.id === 'waning_moon' && (
                                        <g>
                                            {/* Dark base disc */}
                                            <circle cx={moon.cx} cy={moon.cy} r="9.5" fill="#0e0717" stroke="#2e1065" strokeWidth="0.8" />
                                            {/* Illuminated Left Crescent */}
                                            <path
                                                d={`M ${moon.cx} ${moon.cy - 9.5} A 9.5 9.5 0 0 0 ${moon.cx} ${moon.cy + 9.5} A 9.5 9.5 0 0 1 ${moon.cx} ${moon.cy - 9.5} Z`}
                                                fill={isActive ? 'url(#heroWaningGrad)' : '#c084fc'}
                                                stroke={isActive ? '#e9d5ff' : '#9333ea'}
                                                strokeWidth={isActive ? '1.2' : '0.6'}
                                                filter={isActive ? 'url(#lunarStarGlow)' : undefined}
                                            />
                                        </g>
                                    )}

                                    {/* Dedicated Sanctuary Click Hitbox */}
                                    <rect
                                        x={moon.cx - 16}
                                        y="6"
                                        width="32"
                                        height="44"
                                        fill="transparent"
                                        pointerEvents="all"
                                    >
                                        <title>{isOwner ? `${moon.name} (${moon.subtitle}) - Click to sync phase` : moon.name}</title>
                                    </rect>
                                </g>
                            );
                        })}

                        {/* 4. THE CENTERPIECE: THE LIVING HERO MOON & ASTROLABE MERIDIAN (cx = 180) */}
                        {/* Note: has class .lunar-center-astrolabe for test compatibility! */}
                        <g className="lunar-center-astrolabe" filter="url(#lunarDropShadow)">
                            {/* Outer Brass Orrery Caliper Ring (r = 23) */}
                            <circle
                                cx="180"
                                cy="28"
                                r="22.5"
                                fill="#07060f"
                                stroke="url(#lunarBrassGrad)"
                                strokeWidth="1.8"
                            />

                            {/* Astrolabe Axis Meridian Ticks */}
                            <line x1="180" y1="6" x2="180" y2="9.5" stroke="#facc15" strokeWidth="1.2" />
                            <line x1="180" y1="46.5" x2="180" y2="50" stroke="#facc15" strokeWidth="1.2" />
                            <line x1="158" y1="28" x2="161.5" y2="28" stroke="#facc15" strokeWidth="1.2" />
                            <line x1="198.5" y1="28" x2="202" y2="28" stroke="#facc15" strokeWidth="1.2" />

                            {/* Dynamic Hero Moon Outer Radiance / Ethereal Halo */}
                            <circle
                                cx="180"
                                cy="28"
                                r="18"
                                fill="none"
                                stroke={currentPhaseData.glow}
                                strokeWidth={isFullMoon ? '2.4' : '1.4'}
                                opacity={isFullMoon ? 0.9 : 0.65}
                                filter={isFullMoon ? 'url(#lunarZenithBurst)' : 'url(#lunarHeroAura)'}
                            />

                            {/* ================= HERO MOON CORE BODY ================= */}
                            {currentPhase === 'new_moon' && (
                                /* 🌑 THE LIVING STYGIAN ECLIPSE */
                                <g>
                                    {/* Total Solar Corona Ring */}
                                    <circle
                                        cx="180"
                                        cy="28"
                                        r="16"
                                        fill="none"
                                        stroke="#818cf8"
                                        strokeWidth="2"
                                        filter="url(#lunarHeroAura)"
                                    />
                                    {/* Dark Void Disc */}
                                    <circle
                                        cx="180"
                                        cy="28"
                                        r="15"
                                        fill="url(#heroNewMoonGrad)"
                                        stroke="#4338ca"
                                        strokeWidth="1"
                                    />
                                    {/* Cosmic Crater & Shadow Nebula */}
                                    <circle cx="174" cy="25" r="2.2" fill="#18182e" />
                                    <circle cx="185" cy="31" r="1.8" fill="#18182e" />
                                    {/* Faint Starlight Edge */}
                                    <path
                                        d="M 168 20 A 15 15 0 0 1 192 36"
                                        fill="none"
                                        stroke="#c7d2fe"
                                        strokeWidth="1.2"
                                        opacity="0.7"
                                    />
                                </g>
                            )}

                            {currentPhase === 'waxing_moon' && (
                                /* 🌓 THE LIVING WAXING MOON */
                                <g>
                                    {/* Dark side disc */}
                                    <circle cx="180" cy="28" r="15" fill="#080c16" stroke="#1e293b" strokeWidth="1" />
                                    {/* Radiant Razor Crescent (Right side illuminated) */}
                                    <path
                                        d="M 180 13 A 15 15 0 0 1 180 43 A 15 15 0 0 0 180 13 Z"
                                        fill="url(#heroWaxingGrad)"
                                        stroke="#7dd3fc"
                                        strokeWidth="1.4"
                                        filter="url(#lunarHeroAura)"
                                    />
                                    <circle cx="186" cy="26" r="2" fill="#ffffff" opacity="0.75" />
                                </g>
                            )}

                            {currentPhase === 'full_moon' && (
                                /* 🌕 THE LIVING FULL ZENITH SUPERNOVA */
                                <g>
                                    <circle
                                        cx="180"
                                        cy="28"
                                        r="15"
                                        fill="url(#heroFullGrad)"
                                        stroke="#ffffff"
                                        strokeWidth="2"
                                        filter="url(#lunarZenithBurst)"
                                    />
                                    {/* Lunar Mare markings */}
                                    <path
                                        d="M 173 25 Q 180 32 187 25"
                                        fill="none"
                                        stroke="#854d0e"
                                        strokeWidth="1.6"
                                        opacity="0.3"
                                    />
                                    {/* Searing Cardinal Flares */}
                                    <line x1="180" y1="7" x2="180" y2="12" stroke="#ffffff" strokeWidth="1.8" filter="url(#lunarStarGlow)" />
                                    <line x1="180" y1="44" x2="180" y2="49" stroke="#ffffff" strokeWidth="1.8" filter="url(#lunarStarGlow)" />
                                    <line x1="159" y1="28" x2="164" y2="28" stroke="#ffffff" strokeWidth="1.8" filter="url(#lunarStarGlow)" />
                                    <line x1="196" y1="28" x2="201" y2="28" stroke="#ffffff" strokeWidth="1.8" filter="url(#lunarStarGlow)" />
                                </g>
                            )}

                            {currentPhase === 'waning_moon' && (
                                /* 🌗 THE LIVING WANING MOON */
                                <g>
                                    {/* Dark side disc */}
                                    <circle cx="180" cy="28" r="15" fill="#0d0716" stroke="#2e1065" strokeWidth="1" />
                                    {/* Radiant Twilight Crescent (Left side illuminated) */}
                                    <path
                                        d="M 180 13 A 15 15 0 0 0 180 43 A 15 15 0 0 1 180 13 Z"
                                        fill="url(#heroWaningGrad)"
                                        stroke="#e9d5ff"
                                        strokeWidth="1.4"
                                        filter="url(#lunarHeroAura)"
                                    />
                                    <circle cx="174" cy="26" r="2" fill="#ffffff" opacity="0.75" />
                                </g>
                            )}

                            {/* Astrolabe Central Needle Pivot Point */}
                            <circle cx="180" cy="28" r="2.8" fill="#ffffff" stroke="#1e293b" strokeWidth="0.8" />

                            {/* 5. THE TRI-STAR CHRONOMETER (3 Rounds of Parasite Feeding) */}
                            {/* Distinct diamond star-pearls at the upper meridian */}
                            {[
                                { roundIdx: 0, x: 161, y: 8 },
                                { roundIdx: 1, x: 180, y: 5.5 },
                                { roundIdx: 2, x: 199, y: 8 }
                            ].map((star) => {
                                const isLit = roundsInPhase >= star.roundIdx;
                                const isShiftWarning = star.roundIdx === 2 && isLit;

                                return (
                                    <g key={star.roundIdx} className={`lunar-star-pearl star-${star.roundIdx} ${isLit ? 'lit' : 'unlit'} ${isShiftWarning ? 'shift-warning' : ''}`}>
                                        {/* Diamond Star-Pearl */}
                                        <polygon
                                            points={`${star.x},${star.y - 3.5} ${star.x + 3.5},${star.y} ${star.x},${star.y + 3.5} ${star.x - 3.5},${star.y}`}
                                            fill={
                                                isShiftWarning
                                                    ? '#fda4af'
                                                    : isLit
                                                    ? currentPhaseData.accent
                                                    : '#090d16'
                                            }
                                            stroke={
                                                isShiftWarning
                                                    ? '#f43f5e'
                                                    : isLit
                                                    ? currentPhaseData.glow
                                                    : '#334155'
                                            }
                                            strokeWidth={isLit ? '1.2' : '0.8'}
                                            filter={isLit ? 'url(#lunarStarGlow)' : undefined}
                                        />
                                        {/* Sparkle glint on lit stars */}
                                        {isLit && (
                                            <circle cx={star.x} cy={star.y} r="1" fill="#ffffff" />
                                        )}
                                    </g>
                                );
                            })}

                            {/* Lower Phase Progression Filament Gauge */}
                            <path
                                d="M 163 48.5 Q 180 52 197 48.5"
                                fill="none"
                                stroke="#1e293b"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                            />
                            {roundsInPhase >= 0 && (
                                <path
                                    d={
                                        roundsInPhase === 0
                                            ? "M 163 48.5 Q 170 50.5 174 51"
                                            : roundsInPhase === 1
                                            ? "M 163 48.5 Q 175 51.5 186 51"
                                            : "M 163 48.5 Q 180 52 197 48.5"
                                    }
                                    fill="none"
                                    stroke={isShiftImminent ? '#f43f5e' : currentPhaseData.glow}
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    filter="url(#lunarStarGlow)"
                                />
                            )}

                            {/* Dedicated Center Hitbox to open Ephemeris menu */}
                            <rect
                                x="156"
                                y="4"
                                width="48"
                                height="48"
                                fill="transparent"
                                pointerEvents="all"
                            >
                                <title>{isOwner ? 'Ephemeris of Vael - Click to open controls' : currentPhaseData.name}</title>
                            </rect>
                        </g>

                        {/* 6. RIGHT FLANK TRIGGER: MORNING-STAR CHRONOMETER KEY (►) */}
                        <g
                            className="lunar-flank-trigger lunar-flank-right"
                            onClick={handleAdvanceRound}
                            style={{ cursor: isOwner ? 'pointer' : 'default' }}
                        >
                            {/* Curved Golden Morning-Star Blade */}
                            <path
                                d="M 334 12 C 350 16, 352 40, 334 44 C 342 38, 342 18, 334 12 Z"
                                fill="url(#lunarBrassGrad)"
                                stroke="#ca8a04"
                                strokeWidth="1"
                                filter="url(#lunarStarGlow)"
                            />
                            {/* Tactile Advance Chevron Glyph ► */}
                            <polygon
                                points="344,28 339,24 339,32"
                                fill={isOwner ? '#fef08a' : '#854d0e'}
                                opacity="0.9"
                            />
                            {/* Star Diamond Pivot */}
                            <circle cx="337" cy="28" r="2" fill="#facc15" filter="url(#lunarStarGlow)" />

                            {/* Full-Height Transparent Hitbox with isolated propagation */}
                            <rect
                                x="324"
                                y="4"
                                width="34"
                                height="48"
                                fill="transparent"
                                pointerEvents="all"
                            >
                                <title>{isOwner ? 'Advance Phase / Round (Click: +1 Round, Shift: Full Moon)' : 'Star Key'}</title>
                            </rect>
                        </g>
                    </svg>
                </div>
            </div>

            {/* Shared ClassTip Tooltip */}
            {showTooltip && !showControls && ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip lunarch-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}>
                    <ClassTip
                        icon="fas fa-moon"
                        tint="#a855f7"
                        title="The Lunar Communion"
                        subtitle={`${currentPhaseData.name} · Lunarch Lunar Ephemeris`}
                        state={`${currentPhaseData.name} · Round ${roundsInPhase + 1}/3`}
                        stateTone={isFullMoon ? 'bad' : currentPhase === 'waxing_moon' ? 'warn' : 'good'}
                        mechanic="Cycles New → Waxing → Full → Waning automatically every 3 rounds; you cannot opt out. Every shift deals 2d6 blight and forces a 1d6 Transition Shock roll (rupture, blind, mana loss, lost action, or wyrd)."
                        status={[
                            `Active Influence: ${currentPhaseData.buff}`,
                            roundsInPhase >= 2
                                ? { text: 'Shift imminent at round end: 2d6 blight + 1d6 Transition Shock.', tone: 'warn' }
                                : 'The cycle turns automatically — a manual shift costs 8 mana.'
                        ]}
                        usage={isOwner ? 'Click center moon for Ephemeris. Click any sanctuary node to sync phase. Click flank triggers to step rounds.' : null}
                    />
                </div>,
                document.body
            )}

            {/* Player Controls Menu - Unified Warm Parchment Theme */}
            {showControls && ReactDOM.createPortal(
                <div
                    ref={controlsMenuRef}
                    className={`unified-context-menu compact context-menu-container lunarch-menu-container class-resource-menu ${context === 'party' ? 'chronarch-party' : ''}`}
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
                                <i className="fas fa-moon" style={{ marginRight: '6px', color: '#c084fc' }}></i>
                                Ephemeris of Vael
                            </div>

                            {/* Current Status Display */}
                            <div className="context-menu-section-header" style={{ fontSize: '12px', marginTop: '6px', marginBottom: '6px' }}>
                                {currentPhaseData.name} (Round {roundsInPhase + 1}/3)
                            </div>
                            <div style={{ fontSize: '11px', color: 'var(--crm-label, #d8b4fe)', fontStyle: 'italic', marginBottom: '8px' }}>
                                {currentPhaseData.buff}
                            </div>

                            {/* 4 Phase Selection Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                {moonPhases.map((moon) => (
                                    <button
                                        key={moon.id}
                                        className={`context-menu-button ${currentPhase === moon.id ? 'active gain' : ''}`}
                                        onClick={() => updatePhaseAndRound(moon.id, 0)}
                                    >
                                        <i className="fas fa-circle" style={{ color: moon.glow, fontSize: '9px', marginRight: '5px' }}></i>
                                        {moon.name}
                                    </button>
                                ))}
                            </div>

                            {/* Round Steppers */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                <button className="context-menu-button spend" onClick={(e) => handleRegressRound(e)}>
                                    <i className="fas fa-backward"></i> -1 Round
                                </button>
                                <button className="context-menu-button gain" onClick={(e) => handleAdvanceRound(e)}>
                                    <i className="fas fa-forward"></i> +1 Round
                                </button>
                            </div>

                            <div className="context-menu-main-separator" style={{ margin: '10px 0' }}></div>

                            {/* Quick Presets */}
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                                <button
                                    className="context-menu-button"
                                    onClick={() => {
                                        updatePhaseAndRound('new_moon', 0);
                                        setShowControls(false);
                                    }}
                                    style={{ flex: 1 }}
                                >
                                    <i className="fas fa-shield-alt"></i> Stygian Eclipse
                                </button>
                                <button
                                    className="context-menu-button"
                                    onClick={() => {
                                        updatePhaseAndRound('full_moon', 0);
                                        setShowControls(false);
                                    }}
                                    style={{ flex: 1 }}
                                >
                                    <i className="fas fa-star"></i> Full Zenith
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

export default LunarchResourceBar;
