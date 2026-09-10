import React, { useState, useRef, useEffect, useId } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/PyrofiendResourceBar.css';
import '../../../../styles/unified-context-menu.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import ClassTip from '../../../../components/hud/ClassTip';

const STAGE_NAMES = {
    0: 'Mortal',
    1: 'Ember',
    2: 'Smolder',
    3: 'Scorch',
    4: 'Blaze',
    5: 'Inferno',
    6: 'Conflagration',
    7: 'Cataclysm',
    8: 'Apocalypse',
    9: 'Oblivion'
};

const DRAWBACK_TEXTS = {
    0: 'None',
    1: '-2 Hit chance (distortions)',
    2: '1d4 Wyrd dmg/turn',
    3: '-10ft Movement, Fatigue',
    4: '+1d6 Damage taken from all sources',
    5: 'Bleeding: 1d6 blight/turn',
    6: 'Cannot be healed by others, disadvantage on Insight/Perception',
    7: '-15ft Speed, 1d6 Suffocation',
    8: '2d4 self-damage, disadvantage on Agility checks',
    9: '4d8 self-damage, death in 3 turns, Scathrach manifests'
};

// Nine demonic seals of the Veil — each stage its own rune, drawn in a 20x20
// box centered on (0,0). Hand-chiseled: uneven stems, overshot joints,
// barbed tips and fracture spurs. Complexity grows as Scathrach takes hold.
const RUNE_PATHS = {
    1: 'M 0.5,-8 L -0.5,8 M 0,-4.5 L 4.5,-7.5 M -0.5,-3.5 L 4,-6.5 M 0,1 L 5,-2.5',
    2: 'M 0.5,-8 L -0.5,-1 M -0.5,-1 L -5.5,8 M -0.5,-1 L 4.5,7.5 M -5.5,8 L -2.5,6.5 M 4.5,7.5 L 2,7',
    3: 'M -6.5,-6 L -2.5,7.5 M 0,-8.5 L 1.5,8 M 6.5,-6 L 3.5,7 M -6,0.5 L 6.5,-2.5 M -3,3 L -5.5,5.5',
    4: 'M 0,-8.5 L 6,0 L 0.5,8.5 L -6,0 Z M -6,0 L -9,-4.5 M -7,1 L -9,-2 M 6,0 L 9,-4 M 0,-8.5 L 0,-4',
    5: 'M -7,0 A 7,4.8 0 1,0 7,0 A 7,4.8 0 1,0 -7,0 M 0.5,-7.5 L -0.5,7.5 M -9,-6.5 L -6.5,-4.5 M 9,-6 L 6.5,-4 M -3,6 L 3,5.5',
    6: 'M 0,-7.5 L -6.5,-3.5 L -6,3.5 M 0,-7.5 L 6.5,-3.5 L 6,4 M -2.5,-2.5 L 3,2.5 M 3,-2 L -3,2.5 M -6,3.5 L -4,6 M 6,4 L 4,6.5',
    7: 'M 0,-9 L 2.5,-2 L 9,0 L 2,2.5 L -0.5,9 L -2.5,2 L -9,0 L -2,-2.5 Z M -8.5,-8 L 8.5,8.5 M -8.5,-8 L -5,-6',
    8: 'M -7.5,-5 Q 0,-8.5 7.5,-5 M -7.5,5.5 Q 0,8.5 7.5,5.5 M -7.5,-5 L -4,0.5 L -7.5,5.5 M 7.5,-5 L 4,0 L 7.5,5.5 M -3,-1.5 L 0,2.5 L 3.5,-1 M -7.5,-5 L -9,-7',
    9: 'M -8,0 A 8,8 0 1,0 8,0 A 8,8 0 1,0 -8,0 M -3.5,0 A 3.5,3.5 0 1,0 3.5,0 A 3.5,3.5 0 1,0 -3.5,0 M 0,-8 L 0.5,-4.5 M -0.5,4.5 L 0,8 M -8,0 L -4.5,0.5 M 4.5,-0.5 L 8,0 M -5.6,-5.6 L -3,-3.5 M 3.5,3 L 5.6,5.6 M 5.6,-5.6 L 3,-3 M -3.5,3.5 L -5.6,5.6 M 2,-6.5 L 4,-8'
};

const RUNE_NAMES = {
    1: 'the Brand', 2: 'the Fork', 3: 'the Claw', 4: 'the Horned Diamond',
    5: 'the Watching Eye', 6: 'the Shackled Hex', 7: 'the Shattered Star',
    8: 'the Maw', 9: 'the Ninth Seal'
};

// Ignited-rune heat bands — fire under-stroke + white-hot core per stage group.
const GLYPH_BANDS = {
    ember: { ring: '#ff5500', fire: '#ff5500', hot: '#ffab2e' },
    molten: { ring: '#ff7a00', fire: '#ff6b08', hot: '#ffd23e' },
    surge: { ring: '#ffb300', fire: '#ff9500', hot: '#fff2a8' },
    blood: { ring: '#ff3300', fire: '#ff2200', hot: '#ff8a5e' },
    oblivion: { ring: '#ff1100', fire: '#ff2200', hot: '#ffffff' }
};

const glyphBandFor = (id) => {
    if (id >= 9) return GLYPH_BANDS.oblivion;
    if (id >= 7) return GLYPH_BANDS.blood;
    if (id >= 5) return GLYPH_BANDS.surge;
    if (id >= 3) return GLYPH_BANDS.molten;
    return GLYPH_BANDS.ember;
};

const PyrofiendResourceBar = ({
    classResource = {},
    size = 'normal',
    config = {},
    context = 'hud',
    isOwner = true,
    onClassResourceUpdate = null
}) => {
    const infernoLevel = classResource?.current ?? 0;
    const maxInfernoLevel = classResource?.max ?? 9;

    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [hoveredRune, setHoveredRune] = useState(null);

    const barRef = useRef(null);
    const controlsMenuRef = useRef(null);
    const tooltipRef = useResourceBarTooltip(barRef, showTooltip, [infernoLevel]);

    // Namespace SVG def ids per instance so stacked PartyHUD frames never collide.
    const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
    const ids = {
        glow: `pyroGlow${uid}`,
        shadow: `pyroShadow${uid}`,
        basalt: `pyroBasalt${uid}`,
        bed: `pyroBed${uid}`,
        kindle: `pyroKindle${uid}`,
        iron: `pyroIron${uid}`
    };

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
            ? `${characterName} stoked ${absAmount} ${resourceName}`
            : `${characterName} cooled ${absAmount} ${resourceName}`;

        addCombatNotification({
            type: 'combat_resource',
            attacker: actorName,
            target: characterName,
            amount: absAmount,
            resourceType: 'infernoLevel',
            isPositive: isPositive,
            customMessage: message
        });
    };

    const handleInfernoChange = (delta) => {
        const newLevel = Math.max(0, Math.min(maxInfernoLevel, infernoLevel + delta));
        const actualAmount = Math.abs(newLevel - infernoLevel);
        if (actualAmount > 0) {
            logClassResourceChange('Inferno Level', actualAmount, delta > 0);
            if (onClassResourceUpdate) onClassResourceUpdate('current', newLevel);
        }
    };

    const handleInfernoSet = (level) => {
        const newLevel = Math.max(0, Math.min(maxInfernoLevel, level));
        const actualAmount = Math.abs(newLevel - infernoLevel);
        if (actualAmount > 0) {
            logClassResourceChange('Inferno Level', actualAmount, newLevel > infernoLevel);
            if (onClassResourceUpdate) onClassResourceUpdate('current', newLevel);
        }
    };

    const getStageName = (level) => STAGE_NAMES[level] || 'Unknown';
    const getDrawbackText = (level) => DRAWBACK_TEXTS[level] || 'Unknown';

    // Nine swallowed coals of the First Cabal — full-bleed, swelling toward
    // Oblivion. Coal 5 is the Surge gate (Whisper eye), 6 the Heresy shackle,
    // 9 the Maw.
    const runePositions = [
        { id: 1, cx: 25, cy: 34, r: 7.5 },
        { id: 2, cx: 55.5, cy: 34, r: 7.5 },
        { id: 3, cx: 86, cy: 34, r: 8 },
        { id: 4, cx: 116.5, cy: 34, r: 8.5 },
        { id: 5, cx: 150, cy: 33, r: 11 },
        { id: 6, cx: 183.5, cy: 34, r: 8.5 },
        { id: 7, cx: 214, cy: 34, r: 9 },
        { id: 8, cx: 244.5, cy: 34, r: 9.5 },
        { id: 9, cx: 275.5, cy: 33, r: 11.5 }
    ];

    const isSurging = infernoLevel >= 5;
    const isHeresy = infernoLevel >= 6;
    const isCatastrophic = infernoLevel >= 9;

    const handleKeyDown = (e) => {
        if (!isOwner) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); handleInfernoChange(1); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); handleInfernoChange(-1); }
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowControls(!showControls); }
        if (e.key === 'Escape') { setShowControls(false); setShowTooltip(false); }
    };

    return (
        <div className={`pyrofiend-resource-wrapper ${size} ${isCatastrophic ? 'catastrophic-warning' : ''} context-${context}`}>
            <div className="resource-bar-row">
                <div
                    ref={barRef}
                    role="slider"
                    tabIndex={isOwner ? 0 : -1}
                    aria-label={`Inferno Veil, stage ${infernoLevel} of ${maxInfernoLevel}, ${getStageName(infernoLevel)}`}
                    aria-valuemin={0}
                    aria-valuemax={maxInfernoLevel}
                    aria-valuenow={infernoLevel}
                    className={`pyrofiend-resource-bar ${size} clickable ${isSurging ? 'surging' : ''} ${isHeresy ? 'heresy' : ''} ${isCatastrophic ? 'catastrophic' : ''}`}
                    onMouseEnter={() => { if (!showControls) setShowTooltip(true); }}
                    onMouseLeave={() => {
                        setShowTooltip(false);
                        setHoveredRune(null);
                    }}
                    onFocus={() => { if (!showControls) setShowTooltip(false); }}
                    onKeyDown={handleKeyDown}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (isOwner) {
                            setShowControls(!showControls);
                            if (showControls) setShowTooltip(false);
                        }
                    }}
                >
                    <svg
                        className="pyrofiend-caldera-svg"
                        viewBox="0 0 300 64"
                        preserveAspectRatio="xMidYMid meet"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <filter id={ids.glow} x="-40%" y="-40%" width="180%" height="180%">
                                <feGaussianBlur stdDeviation="2.2" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            <filter id={ids.shadow} x="-10%" y="-10%" width="120%" height="120%">
                                <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.9" />
                            </filter>

                            {/* Charred obsidian slab */}
                            <linearGradient id={ids.basalt} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#241312" />
                                <stop offset="35%" stopColor="#150b0a" />
                                <stop offset="70%" stopColor="#0c0605" />
                                <stop offset="100%" stopColor="#050202" />
                            </linearGradient>

                            {/* Cold artery bed */}
                            <linearGradient id={ids.bed} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#0a0504" />
                                <stop offset="100%" stopColor="#1a0c08" />
                            </linearGradient>

                            {/* Kindled socket bed — dark ember well so the rune is the hero */}
                            <radialGradient id={ids.kindle} cx="50%" cy="42%" r="62%">
                                <stop offset="0%" stopColor="#5a1200" />
                                <stop offset="45%" stopColor="#2e0800" />
                                <stop offset="80%" stopColor="#120403" />
                                <stop offset="100%" stopColor="#0a0302" />
                            </radialGradient>

                            {/* Cold iron corner brackets */}
                            <linearGradient id={ids.iron} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6b6f78" />
                                <stop offset="45%" stopColor="#3a3d44" />
                                <stop offset="100%" stopColor="#17181c" />
                            </linearGradient>
                        </defs>

                        {/* 1. CHARRED OBSIDIAN SLAB — full bleed */}
                        <g filter={`url(#${ids.shadow})`}>
                            <path
                                d="M 5 8 L 295 8 L 297 14 L 297 50 L 295 56 L 5 56 L 3 50 L 3 14 Z"
                                fill={`url(#${ids.basalt})`}
                                stroke={isCatastrophic ? '#ff2200' : isSurging ? '#a83208' : '#421a14'}
                                strokeWidth={isCatastrophic ? 2 : 1.5}
                            />
                            {/* Heat seam along the top edge — kindles as the Veil climbs */}
                            <line
                                x1="12" y1="10.5" x2="288" y2="10.5"
                                stroke={infernoLevel === 0 ? 'rgba(255, 69, 0, 0.14)' : '#ff7a1a'}
                                strokeWidth="1"
                                strokeLinecap="round"
                                opacity={infernoLevel === 0 ? 1 : 0.35 + (infernoLevel / 9) * 0.65}
                            />
                            {/* Scar-tissue cracks in the slab */}
                            <g stroke="#000000" strokeWidth="0.9" opacity="0.75" strokeLinecap="round" fill="none">
                                <polyline points="48,56 54,49 51,44" />
                                <polyline points="252,8 247,14 250,19" />
                                <polyline points="150,56 150,51 146,48" stroke={isSurging ? '#ff5500' : '#000000'} opacity={isSurging ? 1 : 0.75} />
                            </g>
                            {/* Chipped rock notches along the slab edges */}
                            <g fill="#050202" stroke="#000000" strokeWidth="0.6">
                                <polygon points="96,8 102,8 99,11.5" />
                                <polygon points="232,56 239,56 235.5,52.5" />
                                <polygon points="3,34 6,36.5 3,39" />
                                <polygon points="297,30 294,32.5 297,35" />
                            </g>
                        </g>

                        {/* Cold-iron corner brackets echoing the HUD frame */}
                        {[
                            'M 3 20 L 3 14 L 5 12 L 5 8 L 11 8 L 11 11 L 8 11 L 8 14 L 6 16 L 6 20 Z',
                            'M 297 20 L 297 14 L 295 12 L 295 8 L 289 8 L 289 11 L 292 11 L 292 14 L 294 16 L 294 20 Z',
                            'M 3 44 L 3 50 L 5 52 L 5 56 L 11 56 L 11 53 L 8 53 L 8 50 L 6 48 L 6 44 Z',
                            'M 297 44 L 297 50 L 295 52 L 295 56 L 289 56 L 289 53 L 292 53 L 292 50 L 294 48 L 294 44 Z'
                        ].map((d, i) => (
                            <path key={i} d={d} fill={`url(#${ids.iron})`} stroke="#0a0a0c" strokeWidth="0.6" />
                        ))}

                        {/* 2. CARVED CHANNEL — the groove the seals rest in (no fill; the runes are the readout) */}
                        <rect
                            x="13"
                            y="31"
                            width="274"
                            height="6.5"
                            rx="3.25"
                            fill={`url(#${ids.bed})`}
                            stroke="#2b110e"
                            strokeWidth="1"
                        />

                        {/* Threshold gates: Whisper (5) and Heresy (6) dividers */}
                        <line x1="167" y1="22" x2="167" y2="44" stroke={infernoLevel >= 5 ? '#ffb300' : '#4a2418'} strokeWidth="1.2" strokeDasharray="2 1.6" opacity={infernoLevel >= 5 ? 1 : 0.6} />
                        <line x1="199" y1="22" x2="199" y2="44" stroke={infernoLevel >= 6 ? '#ff2222' : '#4a2418'} strokeWidth="1.2" strokeDasharray="2 1.6" opacity={infernoLevel >= 6 ? 1 : 0.6} />

                        {/* 3. NINE DEMONIC SEALS */}
                        {runePositions.map((rune) => {
                            const isFilled = infernoLevel >= rune.id;
                            const isCurrent = infernoLevel === rune.id && infernoLevel > 0;
                            const isHeresyRune = rune.id === 6;
                            const isMaw = rune.id === 9;
                            const band = glyphBandFor(rune.id);
                            const glyphScale = rune.r / 11;
                            const isHovered = hoveredRune === rune.id;

                            return (
                                <g
                                    key={rune.id}
                                    className={`pyro-rune-crucible rune-${rune.id} ${isFilled ? 'filled' : 'empty'} ${isCurrent ? 'current' : ''}`}
                                    onMouseEnter={() => setHoveredRune(rune.id)}
                                    onMouseLeave={() => setHoveredRune(null)}
                                    onClick={(e) => {
                                        if (!isOwner) return;
                                        e.stopPropagation();
                                        handleInfernoSet(rune.id);
                                    }}
                                    style={{ cursor: isOwner ? 'pointer' : 'default' }}
                                >
                                    <title>{`Stage ${rune.id} — ${getStageName(rune.id)} ${RUNE_NAMES[rune.id]}`}</title>
                                    {/* Current-stage halo */}
                                    {isCurrent && (
                                        <circle
                                            cx={rune.cx}
                                            cy={rune.cy}
                                            r={rune.r + 4.5}
                                            fill="none"
                                            stroke={band.ring}
                                            strokeWidth="1.4"
                                            opacity="0.85"
                                            className="pyro-halo"
                                            filter={`url(#${ids.glow})`}
                                        />
                                    )}
                                    {/* Forged seal socket */}
                                    <circle
                                        cx={rune.cx}
                                        cy={rune.cy}
                                        r={rune.r + 2.2}
                                        fill="#100706"
                                        stroke={isFilled ? band.ring : (isHovered ? '#7a2f18' : '#4a2018')}
                                        strokeWidth={isFilled ? 1.6 : 1}
                                    />
                                    {/* Kindled socket bed */}
                                    <circle
                                        cx={rune.cx}
                                        cy={rune.cy}
                                        r={rune.r}
                                        fill={isFilled ? `url(#${ids.kindle})` : '#0a0403'}
                                        filter={isFilled ? `url(#${ids.glow})` : undefined}
                                    />

                                    {/* The demonic seal itself — etched dormant, burning when ignited */}
                                    <g transform={`translate(${rune.cx}, ${rune.cy}) scale(${glyphScale})`} pointerEvents="none">
                                        {isFilled && (
                                            <path
                                                d={RUNE_PATHS[rune.id]}
                                                className="pyro-rune-fire"
                                                fill="none"
                                                stroke={band.fire}
                                                strokeWidth="2.6"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                opacity="0.85"
                                                filter={`url(#${ids.glow})`}
                                            />
                                        )}
                                        <path
                                            d={RUNE_PATHS[rune.id]}
                                            className={isFilled ? 'pyro-rune-core' : 'pyro-rune-etch'}
                                            fill="none"
                                            stroke={isFilled ? (isHovered ? '#ffffff' : band.hot) : '#6e2f1a'}
                                            strokeWidth={isFilled ? 1.25 : 1.1}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            opacity={isFilled ? 1 : 0.85}
                                            filter={isFilled ? `url(#${ids.glow})` : undefined}
                                        />
                                        {isFilled && (
                                            <circle cx="0" cy="0" r="1" fill="#ffffff" className="pyro-rune-heart" />
                                        )}
                                    </g>

                                    {/* Stage 6 — HERESY SHACKLE: no hand may heal past this seal */}
                                    {isHeresyRune && (
                                        <path
                                            d={`M ${rune.cx - 6} ${rune.cy + rune.r + 3.5} Q ${rune.cx} ${rune.cy + rune.r + 8} ${rune.cx + 6} ${rune.cy + rune.r + 3.5}`}
                                            fill="none"
                                            stroke={infernoLevel >= 6 ? '#ff2222' : '#4a2418'}
                                            strokeWidth="1.4"
                                            strokeLinecap="round"
                                            filter={infernoLevel >= 6 ? `url(#${ids.glow})` : undefined}
                                        />
                                    )}

                                    {/* Stage 9 — OBLIVION MAW fangs */}
                                    {isMaw && (
                                        <g
                                            stroke={isFilled ? '#ff2200' : '#4a1b14'}
                                            strokeWidth="1.2"
                                            strokeLinecap="round"
                                            filter={isFilled ? `url(#${ids.glow})` : undefined}
                                        >
                                            <line x1={rune.cx - 7} y1={rune.cy - rune.r - 5.5} x2={rune.cx - 4.5} y2={rune.cy - rune.r - 1.5} />
                                            <line x1={rune.cx + 7} y1={rune.cy - rune.r - 5.5} x2={rune.cx + 4.5} y2={rune.cy - rune.r - 1.5} />
                                            <line x1={rune.cx - 7} y1={rune.cy + rune.r + 5.5} x2={rune.cx - 4.5} y2={rune.cy + rune.r + 1.5} />
                                            <line x1={rune.cx + 7} y1={rune.cy + rune.r + 5.5} x2={rune.cx + 4.5} y2={rune.cy + rune.r + 1.5} />
                                        </g>
                                    )}
                                </g>
                            );
                        })}

                        {/* Death-clock emberfall over the furnace */}
                        {isCatastrophic && (
                            <g pointerEvents="none" stroke="#ff4416" strokeWidth="1" strokeLinecap="round" opacity="0.7">
                                <line x1="40" y1="8" x2="38" y2="13" />
                                <line x1="120" y1="7" x2="121" y2="12" />
                                <line x1="200" y1="8" x2="198" y2="13" />
                                <line x1="262" y1="7" x2="263" y2="12" />
                            </g>
                        )}
                    </svg>
                </div>
            </div>

            {/* Shared ClassTip Tooltip */}
            {showTooltip && !showControls && ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip pyrofiend-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}>
                    <ClassTip
                        icon="fas fa-fire-flame-curved"
                        tint="#ff4500"
                        title={`${getStageName(infernoLevel)} (Stage ${infernoLevel})`}
                        subtitle="Pyrofiend Inferno Crucible"
                        state={`${infernoLevel >= 9 ? '+10' : `+${infernoLevel}`} ember/hit`}
                        stateTone={infernoLevel >= 7 ? 'bad' : infernoLevel >= 5 ? 'warn' : 'neutral'}
                        mechanic="Spells build Inferno (+1 to +3 per cast); each level adds +1 ember damage to every hit, and level 9 adds +10. Cooling Ember drops 2 levels and heals 1d6 + Spirit/3; resting reduces 1/minute, and a short rest resets to 0."
                        status={[
                            infernoLevel >= 9
                                ? { text: 'OBLIVION — 3 of your turns left. At zero you detonate for 10d6 ember in 30 ft and Scathrach claims your soul: no resurrection.', tone: 'critical' }
                                : infernoLevel >= 6
                                    ? { text: 'No outside healing. Whisper: Spirit save DC 12 + level each turn or your next attack is forced onto the nearest creature.', tone: 'bad' }
                                    : infernoLevel >= 5
                                        ? { text: 'Infernal Surge live — next ember spell +2d6. The Whisper watches; cool it or commit.', tone: 'warn' }
                                        : infernoLevel > 0
                                            ? 'Warming up — damage climbing, drawbacks still mild.'
                                            : 'Cold — cast ember spells to ascend.',
                        ]}
                        usage={isOwner ? 'Click the bar for controls · Click a seal to ascend or cool straight to it · Arrow keys stoke/cool.' : null}
                    />
                </div>,
                document.body
            )}

            {/* Player Controls Menu - Compact Unified Pathfinder Theme */}
            {showControls && ReactDOM.createPortal(
                <div
                    ref={controlsMenuRef}
                    className={`unified-context-menu compact context-menu-container pyrofiend-menu-container class-resource-menu ${context === 'party' ? 'chronarch-party' : ''}`}
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
                                Inferno: Stage {infernoLevel}/{maxInfernoLevel} ({getStageName(infernoLevel)})
                            </div>

                            {/* Summary info */}
                            <div style={{ fontSize: '0.8rem', marginBottom: '8px', lineHeight: 1.35 }}>
                                <div><strong>Fire bonus:</strong> +{infernoLevel} dmg per die {isSurging && <span style={{ color: '#ff9e5e' }}>· Surge +2d6 live</span>}</div>
                                <div style={{ color: infernoLevel >= 7 ? '#ff6b6b' : infernoLevel >= 5 ? '#fdba74' : 'var(--crm-text-dim, #cbd5e1)' }}>
                                    <strong>Drawback:</strong> {getDrawbackText(infernoLevel)}
                                </div>
                            </div>

                            {/* Stage thresholds legend */}
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px', fontSize: '0.68rem' }}>
                                <span style={{ padding: '1px 6px', borderRadius: '3px', background: 'rgba(255,179,0,0.15)', border: '1px solid rgba(255,179,0,0.5)', color: '#ffb300' }}>5 Whisper</span>
                                <span style={{ padding: '1px 6px', borderRadius: '3px', background: 'rgba(255,34,34,0.12)', border: '1px solid rgba(255,34,34,0.5)', color: '#ff6b6b' }}>6 Heresy</span>
                                <span style={{ padding: '1px 6px', borderRadius: '3px', background: 'rgba(255,34,0,0.18)', border: '1px solid rgba(255,34,0,0.6)', color: '#ff4422' }}>9 Oblivion</span>
                            </div>

                            {/* Direct Jump Grid (0 to 9) */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
                                    <button
                                        key={lvl}
                                        title={`${getStageName(lvl)} — ${getDrawbackText(lvl)}`}
                                        className={`context-menu-button ${infernoLevel === lvl ? 'active' : ''} ${lvl >= 9 ? 'danger' : ''}`}
                                        onClick={() => handleInfernoSet(lvl)}
                                    >
                                        {lvl}
                                    </button>
                                ))}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                <button className="context-menu-button spend" onClick={() => handleInfernoChange(-1)}>
                                    <i className="fas fa-minus"></i> -1 (Cool)
                                </button>
                                <button className="context-menu-button gain" onClick={() => handleInfernoChange(1)}>
                                    <i className="fas fa-plus"></i> +1 (Stoke)
                                </button>
                            </div>

                            <div className="context-menu-main-separator" style={{ margin: '12px 0' }}></div>

                            <button className="context-menu-button danger" onClick={() => setShowControls(false)} style={{ width: '100%' }}>
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

export default PyrofiendResourceBar;
