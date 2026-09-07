import React, { useState, useRef, useEffect, useId } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/RevenantResourceBar.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import ClassTip from '../../../../components/hud/ClassTip';
import '../../../../styles/unified-context-menu.css';
import { getResourceStatusFlavor } from '../../../../utils/resourceStatusFlavor';

// Toll Volatility Tiers
export const TOLL_TIERS = [
    { min: 0, max: 5, name: 'Stasis', color: '#7c3aed', glow: '#a78bfa', hot: '#c4b5fd', desc: 'Stable necrotic reserves. Cold blood runs quiet.' },
    { min: 6, max: 10, name: 'Searing', color: '#9333ea', glow: '#c084fc', hot: '#e9d5ff', desc: 'Frost-fire resonance (+1d4 blight/rime damage).' },
    { min: 11, max: 15, name: 'Necrotic Rot', color: '#c026d3', glow: '#e879f9', hot: '#fae8ff', desc: 'Decaying flesh (+1d8 blight). External healing severed!' },
    { min: 16, max: 20, name: 'Cataclysm', color: '#ef4444', glow: '#f87171', hot: '#fee2e2', desc: 'CRITICAL MASS: 30ft Glacial Stasis Freeze on lethal damage!' }
];

export const getTollTier = (toll) => {
    return TOLL_TIERS.find(t => toll >= t.min && toll <= t.max) || TOLL_TIERS[0];
};

// Fracture crackles spreading across the peat-basalt plate
const getFracturePath = (index) => {
    const isLeft = index <= 10;
    const offset = isLeft ? index - 1 : index - 11;
    const startX = 66 + (index - 1) * 8.6;
    const y0 = 9 + ((offset * 7) % 5);
    const midX = startX + (isLeft ? -3.5 : 3.5);
    const midY = y0 + 6;
    const endX = midX + (isLeft ? -4 : 4);
    const endY = midY + ((offset * 11) % 5);
    return `M ${startX} ${y0} L ${midX} ${midY} L ${endX} ${endY}`;
};

const RevenantResourceBar = ({
    classResource = {},
    size = 'normal',
    config = {},
    context = 'hud',
    isOwner = true,
    onClassResourceUpdate = null,
    showcase = false
}) => {
    // 1. Dual-Resource Values
    const rawToll = classResource?.toll ?? classResource?.current ?? 0;
    const toll = Math.max(0, Math.min(20, rawToll));
    const maxToll = classResource?.maxToll ?? config?.mechanics?.toll?.max ?? 20;

    const rawPhylacteryHP = classResource?.phylacteryHP ?? 50;
    const phylacteryHP = Math.max(0, Math.min(50, rawPhylacteryHP));
    const maxPhylacteryHP = classResource?.maxPhylacteryHP ?? config?.mechanics?.phylactery?.max ?? 50;

    const deathShroud = Boolean(classResource?.deathShroud);

    // Current volatility tier
    const currentTier = getTollTier(toll);
    const isCataclysm = toll >= 16;
    const isRot = toll >= 11 && !isCataclysm;
    const isSearing = toll >= 6 && !isRot && !isCataclysm;

    // 2. Local Interactive States
    const [showControls, setShowControls] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    const barRef = useRef(null);
    const controlsMenuRef = useRef(null);
    const tooltipRef = useResourceBarTooltip(barRef, showTooltip && !showControls, [toll, phylacteryHP, deathShroud, currentTier.name]);

    // Unique SVG ID prefix
    const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
    const ids = {
        glow: `revGlow${uid}`,
        shadow: `revShadow${uid}`,
        basalt: `revBasalt${uid}`,
        ironBevel: `revIron${uid}`,
        trackBed: `revTrackBed${uid}`,
        phylacteryFluid: `revPhylFluid${uid}`,
        shroudGlow: `revShroudGlow${uid}`,
        cataclysmGlow: `revCataGlow${uid}`
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

    // Stores & Combat Log
    const { addCombatNotification } = useChatStore();
    const isGMMode = useGameStore(state => state.isGMMode);
    const currentPlayerName = useCharacterStore(state => state.name || 'Player');

    const getActorName = () => {
        const actorName = currentPlayerName || 'Player';
        return isGMMode ? `${actorName} (GM)` : actorName;
    };

    const logResourceChange = (resourceName, amount, isPositive, customMessage = null) => {
        const absAmount = Math.abs(amount);
        const actorName = getActorName();
        const characterName = currentPlayerName || 'Character';
        const verb = isPositive ? 'channeled' : 'expended';

        addCombatNotification({
            type: 'combat_resource',
            attacker: actorName,
            target: characterName,
            amount: absAmount,
            resourceType: 'classResource',
            isPositive,
            customMessage: customMessage || `${characterName} ${verb} ${absAmount} ${resourceName}`
        });
    };

    // Mutators
    const setTollValue = (newVal) => {
        const clamped = Math.max(0, Math.min(maxToll, newVal));
        const diff = clamped - toll;
        if (diff === 0) return;
        logResourceChange('Death-Toll', Math.abs(diff), diff > 0, 
            diff > 0 
                ? `${currentPlayerName || 'Revenant'} advanced Death-Toll to ${clamped} (${getTollTier(clamped).name})`
                : `${currentPlayerName || 'Revenant'} purged necrotic resonance, lowering Death-Toll to ${clamped}`
        );
        if (onClassResourceUpdate) {
            onClassResourceUpdate('toll', clamped);
            onClassResourceUpdate('current', clamped);
        }
    };

    const stepToll = (delta) => setTollValue(toll + delta);

    const setPhylacteryHPValue = (newVal) => {
        const clamped = Math.max(0, Math.min(maxPhylacteryHP, newVal));
        const diff = clamped - phylacteryHP;
        if (diff === 0) return;
        logResourceChange('Phylactery Soul-HP', Math.abs(diff), diff > 0,
            diff > 0
                ? `${currentPlayerName || 'Revenant'} harvested +${Math.abs(diff)} soul essence into the Basalt Phylactery (${clamped}/${maxPhylacteryHP} HP)`
                : `${currentPlayerName || 'Revenant'} channeled ${Math.abs(diff)} soul HP from the Basalt Phylactery (${clamped}/${maxPhylacteryHP} HP)`
        );
        if (onClassResourceUpdate) {
            onClassResourceUpdate('phylacteryHP', clamped);
        }
    };

    const toggleDeathShroud = () => {
        const nextState = !deathShroud;
        const msg = nextState
            ? `${currentPlayerName || 'Revenant'} ignited DEATH SHROUD (Burning HP for Mana, +Blight/Rime damage)`
            : `${currentPlayerName || 'Revenant'} extinguished Death Shroud`;
        logResourceChange('Death Shroud', 1, nextState, msg);
        if (onClassResourceUpdate) {
            onClassResourceUpdate('deathShroud', nextState);
        }
    };

    const triggerGlacialNova = () => {
        logResourceChange('Strategic Resurrection', phylacteryHP, false,
            `❄ ${currentPlayerName || 'Revenant'} detonated GLACIAL STASIS NOVA! All enemies within 20ft frozen in peat-ice; soul restored to 50 HP.`
        );
        if (onClassResourceUpdate) {
            onClassResourceUpdate('phylacteryHP', 50);
            onClassResourceUpdate('toll', 0);
            onClassResourceUpdate('current', 0);
        }
        setShowControls(false);
    };

    // Keyboard accessibility
    const handleKeyDown = (e) => {
        if (!isOwner) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); stepToll(1); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); stepToll(-1); }
        if (e.key === 's' || e.key === 'S') { e.preventDefault(); toggleDeathShroud(); }
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowControls(prev => !prev); }
        if (e.key === 'Escape') { setShowControls(false); setShowTooltip(false); }
    };

    // Tooltip status flavor
    const statusFlavor = getResourceStatusFlavor('Revenant', { toll, current: toll, bloodTokens: toll });

    // Calculate Phylactery soul fluid height (viewBox coordinate, 0..36 height)
    const phylacteryPct = maxPhylacteryHP > 0 ? (phylacteryHP / maxPhylacteryHP) : 0;
    const fluidY = 48 - (phylacteryPct * 36);
    const fluidHeight = phylacteryPct * 36;

    return (
        <div 
            className={`class-resource-bar revenant-resource-bar ${size} ${isCataclysm ? 'is-cataclysm' : ''} ${isRot ? 'is-rot' : ''} ${deathShroud ? 'shroud-active' : ''}`}
            ref={barRef}
            role="slider"
            tabIndex={isOwner ? 0 : -1}
            aria-label={`Death-Toll: ${toll} of ${maxToll}, Phylactery HP: ${phylacteryHP}/${maxPhylacteryHP}, Shroud: ${deathShroud ? 'Active' : 'Inactive'}`}
            aria-valuemin={0}
            aria-valuemax={maxToll}
            aria-valuenow={toll}
            onKeyDown={handleKeyDown}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <div className="revenant-bar-wrapper">
                <svg
                    className="revenant-apparatus-svg"
                    viewBox="0 0 296 60"
                    preserveAspectRatio="xMidYMid meet"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        {/* Soft Spectral Glow */}
                        <filter id={ids.glow} x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="2" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Heavy Sarcophagus Drop Shadow */}
                        <filter id={ids.shadow} x="-15%" y="-15%" width="130%" height="130%">
                            <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.85" />
                        </filter>

                        {/* Cataclysm Critical Mass Pulse Glow */}
                        <filter id={ids.cataclysmGlow} x="-40%" y="-40%" width="180%" height="180%">
                            <feGaussianBlur stdDeviation="3.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* Bryngloom Peat-Basalt Base Plate Gradient */}
                        <linearGradient id={ids.basalt} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#181124" />
                            <stop offset="40%" stopColor="#0f0a17" />
                            <stop offset="100%" stopColor="#06030a" />
                        </linearGradient>

                        {/* Cold Bog-Iron Casing & Rivet Bevel */}
                        <linearGradient id={ids.ironBevel} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#4a5568" />
                            <stop offset="40%" stopColor="#283142" />
                            <stop offset="100%" stopColor="#0a0f1c" />
                        </linearGradient>

                        {/* Carved Crypt Track Bed */}
                        <linearGradient id={ids.trackBed} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#030206" />
                            <stop offset="50%" stopColor="#0a0614" />
                            <stop offset="100%" stopColor="#030206" />
                        </linearGradient>

                        {/* Basalt Phylactery Soul Fluid Gradient */}
                        <linearGradient id={ids.phylacteryFluid} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#bae6fd" />
                            <stop offset="35%" stopColor="#38bdf8" />
                            <stop offset="100%" stopColor="#0369a1" />
                        </linearGradient>

                        {/* Death Shroud Mist Glow */}
                        <radialGradient id={ids.shroudGlow} cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor="#c026d3" stopOpacity="0.85" />
                            <stop offset="60%" stopColor="#9333ea" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="#3b0764" stopOpacity="0" />
                        </radialGradient>
                    </defs>

                    {/* ========================================================================= */}
                    {/* 1. MASTER PEAT-BASALT TOMB SLAB & BOG-IRON CASING (Pure Vector Chassis) */}
                    {/* ========================================================================= */}
                    <g filter={`url(#${ids.shadow})`}>
                        {/* Outer Bog-Iron Edge Bevel */}
                        <rect
                            x="2"
                            y="2"
                            width="292"
                            height="56"
                            rx="5"
                            fill={`url(#${ids.ironBevel})`}
                            stroke={isCataclysm ? '#ef4444' : isRot ? '#c026d3' : deathShroud ? '#9333ea' : '#1e293b'}
                            strokeWidth={isCataclysm ? 1.6 : 1.2}
                        />

                        {/* Inner Peat-Basalt Plate */}
                        <rect
                            x="4"
                            y="4"
                            width="288"
                            height="52"
                            rx="4"
                            fill={`url(#${ids.basalt})`}
                        />

                        {/* Perimeter Tomb Seams */}
                        <line x1="8" y1="5.5" x2="288" y2="5.5" stroke={isCataclysm ? 'rgba(239, 68, 68, 0.45)' : 'rgba(168, 85, 247, 0.25)'} strokeWidth="0.8" />
                        <line x1="8" y1="54.5" x2="288" y2="54.5" stroke="rgba(15, 23, 42, 0.7)" strokeWidth="0.8" />

                        {/* Four Corner Tomb Rivets */}
                        {[
                            [6.5, 6.5],
                            [289.5, 6.5],
                            [6.5, 53.5],
                            [289.5, 53.5]
                        ].map(([cx, cy], i) => (
                            <g key={i}>
                                <circle cx={cx} cy={cy} r="1.4" fill="#0b0f19" stroke="#475569" strokeWidth="0.6" />
                                <circle cx={cx - 0.3} cy={cy - 0.3} r="0.4" fill="#94a3b8" />
                            </g>
                        ))}
                    </g>

                    {/* ========================================================================= */}
                    {/* 2. LEFT FLANK: VESPER'S BASALT PHYLACTERY (Frost-Stasis Core, x: 7..55) */}
                    {/* ========================================================================= */}
                    <g 
                        className="rev-phylactery-module"
                        style={{ cursor: isOwner ? 'pointer' : 'default' }}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (!isOwner) return;
                            if (e.altKey || e.shiftKey) {
                                setPhylacteryHPValue(phylacteryHP - 10);
                            } else {
                                setPhylacteryHPValue(phylacteryHP < 50 ? phylacteryHP + 10 : 0);
                            }
                        }}
                    >
                        {/* Sarcophagus Reliquary Socket Frame */}
                        <rect
                            x="7"
                            y="6"
                            width="48"
                            height="48"
                            rx="5"
                            fill="#08040d"
                            stroke={phylacteryHP > 0 ? '#38bdf8' : '#334155'}
                            strokeWidth={phylacteryHP > 0 ? '1.4' : '0.8'}
                            filter={phylacteryHP > 0 ? `url(#${ids.glow})` : undefined}
                        />

                        {/* Inner Deep Well Reservoir */}
                        <rect
                            x="10"
                            y="9"
                            width="42"
                            height="42"
                            rx="3"
                            fill="#02050e"
                            stroke="#1e293b"
                            strokeWidth="0.8"
                        />

                        {/* Liquid Soul Fluid (Rime-Cyan) */}
                        {phylacteryHP > 0 && (
                            <rect
                                x="11"
                                y={fluidY}
                                width="40"
                                height={fluidHeight}
                                rx="2"
                                fill={`url(#${ids.phylacteryFluid})`}
                                opacity="0.85"
                                filter={`url(#${ids.glow})`}
                            />
                        )}

                        {/* Fluid Surface Wave Highlight */}
                        {phylacteryHP > 0 && (
                            <line
                                x1="11"
                                y1={fluidY}
                                x2="51"
                                y2={fluidY}
                                stroke="#f0f9ff"
                                strokeWidth="1.2"
                                strokeLinecap="round"
                            />
                        )}

                        {/* Faceted Frost-Stasis Crystal Sigil */}
                        <g filter={phylacteryHP > 0 ? `url(#${ids.glow})` : undefined}>
                            {/* Crystal Silhouette */}
                            <path
                                d="M 31,13 L 41,23 L 31,43 L 21,23 Z"
                                fill={phylacteryHP > 0 ? 'rgba(255, 255, 255, 0.2)' : 'rgba(51, 65, 85, 0.2)'}
                                stroke={phylacteryHP > 0 ? '#e0f2fe' : '#475569'}
                                strokeWidth="1"
                            />
                            {/* Inner Facet Lines */}
                            <line x1="31" y1="13" x2="31" y2="43" stroke={phylacteryHP > 0 ? '#7dd3fc' : '#334155'} strokeWidth="0.7" />
                            <line x1="21" y1="23" x2="41" y2="23" stroke={phylacteryHP > 0 ? '#7dd3fc' : '#334155'} strokeWidth="0.7" />
                        </g>

                        {/* Minimal Soul HP Numerals Inside Reliquary */}
                        <text
                            x="31"
                            y="33"
                            fill={phylacteryHP > 0 ? '#ffffff' : '#64748b'}
                            fontSize="10"
                            fontWeight="900"
                            textAnchor="middle"
                            filter="drop-shadow(0 1.5px 3px rgba(0,0,0,0.9))"
                        >
                            {phylacteryHP}
                        </text>
                    </g>

                    {/* ========================================================================= */}
                    {/* 3. CENTER: KORA'S 20 DEATH-TOLL CRYPT RIBS (x: 58..244, Pure Chunky Art) */}
                    {/* ========================================================================= */}
                    <g className="rev-toll-module">
                        {/* Carved Crypt Groove (38px Tall!) */}
                        <rect
                            x="59"
                            y="6"
                            width="186"
                            height="48"
                            rx="4"
                            fill={`url(#${ids.trackBed})`}
                            stroke={isCataclysm ? '#ef4444' : isRot ? '#c026d3' : '#1e1b2e'}
                            strokeWidth="1"
                        />

                        {/* Spreading Frost/Heat Fracture Lines Across the Stone */}
                        {Array.from({ length: toll }, (_, idx) => {
                            const val = idx + 1;
                            const tier = getTollTier(val);
                            return (
                                <path
                                    key={`frac-${val}`}
                                    d={getFracturePath(val)}
                                    stroke={tier.glow}
                                    strokeWidth="0.8"
                                    strokeLinecap="round"
                                    opacity="0.5"
                                    fill="none"
                                />
                            );
                        })}

                        {/* 20 Chunky Crypt-Stone Pillars / Ribs (36px Tall!) */}
                        {Array.from({ length: 20 }, (_, idx) => {
                            const val = idx + 1;
                            const isFilled = toll >= val;
                            const isCurrent = toll === val;
                            const tier = getTollTier(val);

                            // 4 chambers of 5 with 3px vault gaps between chambers
                            const chamberIdx = Math.floor(idx / 5);
                            const segmentX = 63 + (idx * 8.4) + (chamberIdx * 3.2);
                            const segmentY = 11;
                            const segmentW = 7;
                            const segmentH = 38;

                            return (
                                <g
                                    key={`segment-${val}`}
                                    className={`rev-segment ${isFilled ? 'filled' : 'empty'} ${isCurrent ? 'current' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (!isOwner) return;
                                        setTollValue(toll === val ? val - 1 : val);
                                    }}
                                    style={{ cursor: isOwner ? 'pointer' : 'default' }}
                                >
                                    {/* Segment Notch Outer Frame */}
                                    <rect
                                        x={segmentX}
                                        y={segmentY}
                                        width={segmentW}
                                        height={segmentH}
                                        rx="1.8"
                                        fill={isFilled ? tier.color : '#07040d'}
                                        stroke={isFilled ? (isCurrent ? '#ffffff' : tier.glow) : '#1a1326'}
                                        strokeWidth={isCurrent ? '1.4' : '0.7'}
                                        filter={isFilled ? `url(#${ids.glow})` : undefined}
                                    />

                                    {/* Inner Lit Core of the Crypt Rib */}
                                    {isFilled && (
                                        <rect
                                            x={segmentX + 1.2}
                                            y={segmentY + 2.5}
                                            width={segmentW - 2.4}
                                            height={segmentH - 5}
                                            rx="0.9"
                                            fill={isCurrent ? '#ffffff' : tier.hot}
                                            opacity="0.85"
                                        />
                                    )}
                                </g>
                            );
                        })}

                        {/* Subtle Bog-Iron Crypt Chamber Dividers at 5, 10, 15 */}
                        {[5, 10, 15].map((sepIdx, i) => {
                            const sepX = 63 + (sepIdx * 8.4) + ((sepIdx / 5) * 3.2) - 1.6;
                            return (
                                <g key={i}>
                                    <line
                                        x1={sepX}
                                        y1="8"
                                        x2={sepX}
                                        y2="52"
                                        stroke="#334155"
                                        strokeWidth="0.9"
                                        strokeDasharray="3,2"
                                    />
                                    {/* Faint Roman milestone mark */}
                                    <text
                                        x={sepX}
                                        y="6.5"
                                        fill={toll >= sepIdx ? getTollTier(sepIdx).glow : '#475569'}
                                        fontSize="3.8"
                                        fontWeight="900"
                                        textAnchor="middle"
                                    >
                                        {sepIdx === 5 ? 'V' : sepIdx === 10 ? 'X' : 'XV'}
                                    </text>
                                </g>
                            );
                        })}
                    </g>

                    {/* ========================================================================= */}
                    {/* 4. RIGHT FLANK: DEATH SHROUD SKULL SEAL & CRYPT KEY (x: 248..292) */}
                    {/* ========================================================================= */}
                    <g className="rev-actions-module">
                        {/* A. Death Shroud Carved Skull Talisman (Top Right) */}
                        <g
                            className={`rev-shroud-seal ${deathShroud ? 'active' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (isOwner) toggleDeathShroud();
                            }}
                            style={{ cursor: isOwner ? 'pointer' : 'default' }}
                            filter={deathShroud ? `url(#${ids.glow})` : undefined}
                        >
                            {/* Socket Stone Frame */}
                            <rect
                                x="249"
                                y="6"
                                width="40"
                                height="32"
                                rx="4"
                                fill={deathShroud ? 'url(#shroudGlow)' : '#0a0814'}
                                stroke={deathShroud ? '#c026d3' : '#334155'}
                                strokeWidth={deathShroud ? '1.4' : '0.8'}
                            />

                            {/* Pure SVG Vector Skull (Zero Emojis!) */}
                            <g transform="translate(254, 8)">
                                {/* Cranium & Jaw */}
                                <path
                                    d="M 15,3 C 9,3 4.5,7 4.5,13.5 C 4.5,17.5 7,20 9.5,21 L 9.5,24.5 C 9.5,25.5 11,26 13,26 L 17,26 C 19,26 20.5,25.5 20.5,24.5 L 20.5,21 C 23,20 25.5,17.5 25.5,13.5 C 25.5,7 21,3 15,3 Z"
                                    fill={deathShroud ? '#2e1065' : '#141a24'}
                                    stroke={deathShroud ? '#f0abfc' : '#475569'}
                                    strokeWidth="1"
                                />
                                {/* Eye Sockets */}
                                <ellipse
                                    cx="11.5"
                                    cy="13.5"
                                    rx="2.5"
                                    ry="3"
                                    fill={deathShroud ? '#ffffff' : '#04060a'}
                                    filter={deathShroud ? `url(#${ids.glow})` : undefined}
                                />
                                <ellipse
                                    cx="18.5"
                                    cy="13.5"
                                    rx="2.5"
                                    ry="3"
                                    fill={deathShroud ? '#ffffff' : '#04060a'}
                                    filter={deathShroud ? `url(#${ids.glow})` : undefined}
                                />
                                {/* Nasal Cavity */}
                                <path
                                    d="M 15,16.5 L 13.8,19.5 L 16.2,19.5 Z"
                                    fill={deathShroud ? '#c026d3' : '#04060a'}
                                />
                                {/* Jaw Teeth Separator Lines */}
                                <line x1="12" y1="23" x2="12" y2="26" stroke={deathShroud ? '#f0abfc' : '#334155'} strokeWidth="0.8" />
                                <line x1="15" y1="23" x2="15" y2="26" stroke={deathShroud ? '#f0abfc' : '#334155'} strokeWidth="0.8" />
                                <line x1="18" y1="23" x2="18" y2="26" stroke={deathShroud ? '#f0abfc' : '#334155'} strokeWidth="0.8" />
                            </g>
                        </g>

                        {/* B. Tombcraft Tender Crypt Cross Key (Bottom Right) */}
                        <g
                            className="rev-tender-key"
                            onClick={(e) => {
                                e.stopPropagation();
                                setShowControls(prev => !prev);
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            <rect
                                x="249"
                                y="40"
                                width="40"
                                height="14"
                                rx="3"
                                fill={showControls ? '#2e1b4d' : '#100b1d'}
                                stroke={showControls ? '#c084fc' : '#3b3252'}
                                strokeWidth="0.8"
                            />
                            {/* Engraved Crypt Cross & Relic Key Icon */}
                            <line x1="257" y1="47" x2="281" y2="47" stroke={showControls ? '#f5d0fe' : '#94a3b8'} strokeWidth="1" strokeLinecap="round" />
                            <line x1="269" y1="43" x2="269" y2="51" stroke={showControls ? '#f5d0fe' : '#94a3b8'} strokeWidth="1" strokeLinecap="round" />
                            <circle cx="269" cy="47" r="1.4" fill={showControls ? '#ffffff' : '#cbd5e1'} />
                        </g>
                    </g>
                </svg>

                {/* Floating Tactical Popover Menu Portal */}
                {showControls && ReactDOM.createPortal(
                    <div 
                        className="rev-tender-popover unified-context-menu" 
                        ref={controlsMenuRef}
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            position: 'fixed',
                            top: (() => {
                                if (!barRef.current) return '50%';
                                const rect = barRef.current.getBoundingClientRect();
                                const hudContainer = barRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                let hudBottom = rect.bottom;
                                let hudTop = rect.top;
                                if (hudContainer) {
                                    const hudRect = hudContainer.getBoundingClientRect();
                                    hudBottom = hudRect.bottom;
                                    hudTop = hudRect.top;
                                }
                                if (hudBottom + 360 > window.innerHeight) {
                                    return Math.max(10, hudTop - 360);
                                }
                                return hudBottom + 8;
                            })(),
                            left: (() => {
                                if (!barRef.current) return '50%';
                                const rect = barRef.current.getBoundingClientRect();
                                return Math.max(165, Math.min(window.innerWidth - 165, rect.left + (rect.width / 2)));
                            })(),
                            transform: 'translateX(-50%)',
                            zIndex: 100000
                        }}
                    >
                        <div className="rev-tender-header">
                            <div className="rev-tender-title">
                                <i className="fas fa-skull"></i>
                                <span>Tombcraft Tactical Tender</span>
                            </div>
                            <button 
                                className="rev-tender-close-btn"
                                onClick={() => setShowControls(false)}
                                title="Close tender"
                            >
                                ×
                            </button>
                        </div>

                        {/* Status Flavor Banner */}
                        {statusFlavor && (
                            <div className="rev-status-flavor-banner" style={statusFlavor.style}>
                                <i className="fas fa-quote-left"></i> {statusFlavor.text}
                            </div>
                        )}

                        {/* Section 1: Death-Toll Volatility Presets */}
                        <div className="rev-tender-section">
                            <div className="rev-section-label">
                                <span>Death-Toll Presets</span>
                                <span className="rev-current-pill" style={{ color: currentTier.color }}>
                                    {toll}/20 ({currentTier.name})
                                </span>
                            </div>
                            <div className="rev-preset-grid">
                                <button 
                                    className={`rev-preset-btn ${toll === 0 ? 'active' : ''}`}
                                    onClick={() => setTollValue(0)}
                                >
                                    <span className="rev-btn-title">Dry Veins (0)</span>
                                    <span className="rev-btn-sub">Dormant stasis</span>
                                </button>
                                <button 
                                    className={`rev-preset-btn ${toll === 5 ? 'active' : ''}`}
                                    onClick={() => setTollValue(5)}
                                >
                                    <span className="rev-btn-title">Stasis Cap (5)</span>
                                    <span className="rev-btn-sub">Max safe reserves</span>
                                </button>
                                <button 
                                    className={`rev-preset-btn ${toll === 10 ? 'active' : ''}`}
                                    onClick={() => setTollValue(10)}
                                >
                                    <span className="rev-btn-title">Searing (10)</span>
                                    <span className="rev-btn-sub">+1d4 Blight/Rime</span>
                                </button>
                                <button 
                                    className={`rev-preset-btn ${toll === 15 ? 'active' : ''}`}
                                    onClick={() => setTollValue(15)}
                                >
                                    <span className="rev-btn-title">Necrotic Rot (15)</span>
                                    <span className="rev-btn-sub">Healing severed!</span>
                                </button>
                                <button 
                                    className={`rev-preset-btn cata ${toll === 20 ? 'active' : ''}`}
                                    onClick={() => setTollValue(20)}
                                >
                                    <span className="rev-btn-title">Cataclysm (20)</span>
                                    <span className="rev-btn-sub">Walking bomb detonation</span>
                                </button>
                            </div>
                        </div>

                        {/* Section 2: Basalt Phylactery Soul Controls */}
                        <div className="rev-tender-section">
                            <div className="rev-section-label">
                                <span>Basalt Phylactery (Vesper's Frost-Stasis)</span>
                                <span className="rev-current-pill" style={{ color: '#38bdf8' }}>
                                    {phylacteryHP}/50 HP
                                </span>
                            </div>
                            <div className="rev-phylactery-controls-row">
                                <button 
                                    className="rev-action-btn"
                                    onClick={() => setPhylacteryHPValue(phylacteryHP + 10)}
                                    disabled={phylacteryHP >= 50}
                                >
                                    <i className="fas fa-plus"></i> Harvest Soul (+10 HP)
                                </button>
                                <button 
                                    className="rev-action-btn"
                                    onClick={() => setPhylacteryHPValue(phylacteryHP - 10)}
                                    disabled={phylacteryHP <= 0}
                                >
                                    <i className="fas fa-minus"></i> Drain Soul (-10 HP)
                                </button>
                                <button 
                                    className="rev-nova-btn"
                                    onClick={triggerGlacialNova}
                                    title="Drains phylactery upon lethal damage to trigger 20ft freeze nova"
                                >
                                    <i className="fas fa-snowflake"></i> Glacial Nova (Resurrect)
                                </button>
                            </div>
                        </div>

                        {/* Section 3: Death Shroud Switch */}
                        <div className="rev-tender-section">
                            <div className="rev-shroud-toggle-card" onClick={toggleDeathShroud}>
                                <div className="rev-toggle-left">
                                    <div className="rev-toggle-title">
                                        <i className="fas fa-skull"></i>
                                        <span>Death Shroud Mode</span>
                                    </div>
                                    <div className="rev-toggle-desc">
                                        Burns 2 HP/round instead of Mana. Amplifies frost and necrotic spell damage dice.
                                    </div>
                                </div>
                                <div className={`rev-toggle-switch ${deathShroud ? 'on' : 'off'}`}>
                                    {deathShroud ? 'ACTIVE' : 'OFF'}
                                </div>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
            </div>

            {/* Tactical Hover Tooltip */}
            {showTooltip && !showControls && ReactDOM.createPortal(
                <div
                    ref={tooltipRef}
                    className="unified-resourcebar-tooltip pathfinder-tooltip"
                    style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}
                >
                    <ClassTip
                        icon="fas fa-skull"
                        tint={currentTier.color}
                        title="Death-Toll & Phylactery"
                        state={`${toll}/20 • ${currentTier.name}`}
                        stateTone={isCataclysm ? 'bad' : isRot ? 'warn' : 'good'}
                        mechanic="Spend HP to advance Toll into volatile damage tiers. Soul HP in the Phylactery fuels Strategic Resurrection."
                        status={[
                            `Tier: ${currentTier.name} — ${currentTier.desc}`,
                            `Phylactery: ${phylacteryHP}/50 HP (${phylacteryHP > 0 ? 'Resurrection Ready' : 'Depleted'})`,
                            `Death Shroud: ${deathShroud ? 'Ignited (-2 HP/round for amplified blight dice)' : 'Inactive'}`
                        ]}
                        usage="Click ribs to adjust Toll. Click Phylactery to bank soul HP. Click Skull seal to toggle Shroud. Click Relic Key for Tender."
                        hint="Arrow keys step Toll. Press 'S' for Shroud, Enter for Tender menu."
                    />
                </div>,
                document.body
            )}
        </div>
    );
};

export default React.memo(RevenantResourceBar);
