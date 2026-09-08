import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/MartyrResourceBar.css';
import '../../../../styles/unified-context-menu.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import ClassTip from '../../../../components/hud/ClassTip';

const THRESHOLDS = [0, 10, 20, 40, 60, 80, 100];
const MAX_LEVEL = 6;

const STAGE_NAMES = [
    'Mortal Resolve',
    'Flickering Faith',
    'Steadfast Conviction',
    'Radiant Sacrifice',
    "Sol's Breath Ascendance",
    "Sol's Breath Martyrdom",
    'Celestial Protector'
];

const STAGE_PASSIVES = [
    'None (Faithless state — healings halved, step into harm\'s way to awaken)',
    'Resistance to the first instance of damage each combat round',
    'Regain 1d6 HP at the start of each of your turns',
    'All allies within 10 ft gain +1 damage reduction',
    'Allies within 10 ft gain resistance to the first damage type taken each round',
    '+10 ember damage on attacks; allies within 10 ft gain temp HP when you bleed',
    'Apotheosis: Allies within 15 ft resist all incoming damage'
];

const ROMAN_NUMERALS = ['—', 'I', 'II', 'III', 'IV', 'V', 'VI'];

const SPEC_DATA = {
    redemption: {
        name: 'Redemption',
        title: 'The Sun-Vigil',
        accentColor: '#ffd700',
        glowColor: '#fff8dc',
        description: 'Mercy and holy wards. Intervene heals ally for 2d6 HP, +10 ft heal range.',
        sharedPassive: "Suffering's Gift: At Devotion 3+, taking damage grants nearby allies temp HP equal to your Devotion tier."
    },
    zealot: {
        name: 'Zealot',
        title: 'Radiant Wrath',
        accentColor: '#dc143c',
        glowColor: '#ff6b6b',
        description: 'Ember combustion. Ember spells deal +(Devotion Level × 2) dmg; heal for 15% of ember damage.',
        sharedPassive: "Suffering's Gift: At Devotion 3+, taking damage grants nearby allies temp HP equal to your Devotion tier."
    },
    ascetic: {
        name: 'Ascetic',
        title: 'The Vow-Silent',
        accentColor: '#cbd5e1',
        glowColor: '#f8fafc',
        description: 'Monastic discipline. Amplified spell costs -1 Devotion (min 1). Resist physical damage at Lv 4+.',
        sharedPassive: "Suffering's Gift: At Devotion 3+, taking damage grants nearby allies temp HP equal to your Devotion tier."
    },
    ironclad: {
        name: 'Ironclad',
        title: 'The Living Forge',
        accentColor: '#d35400',
        glowColor: '#f39c12',
        description: 'Welded Skald dreadnaught boiler-plate. Converts damage into boiler-pressure and offensive vents.',
        sharedPassive: "Furnace Vow: Deepened devotion calcifies plating, granting up to +4 DR and area steam vents."
    }
};

const MartyrResourceBar = ({
    classResource = {},
    size = 'normal',
    config = {},
    context = 'hud',
    isOwner = true,
    onClassResourceUpdate = null,
    // Backwards-compatibility props
    martyrState = null,
    setMartyrState = null
}) => {
    // Determine level and damage from props (prioritizing classResource over legacy state)
    const rawLevel = classResource?.current !== undefined
        ? classResource.current
        : (martyrState?.localDevotionLevel ?? classResource?.level ?? 0);
    const rawDamage = classResource?.damage !== undefined
        ? classResource.damage
        : (martyrState?.localDevotionDamage ?? classResource?.devotionDamage ?? THRESHOLDS[rawLevel] ?? 0);
    const rawSpec = classResource?.spec ?? martyrState?.martyrSpec ?? config?.visual?.spec ?? 'redemption';

    const [devotionLevel, setDevotionLevel] = useState(Math.max(0, Math.min(rawLevel, MAX_LEVEL)));
    const [devotionDamage, setDevotionDamage] = useState(Math.max(0, Math.min(rawDamage, 150)));
    const [martyrSpec] = useState(rawSpec in SPEC_DATA ? rawSpec : 'redemption');

    const [showControls, setShowControls] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [hoverSection, setHoverSection] = useState(null);

    const barRef = useRef(null);
    const controlsMenuRef = useRef(null);
    const tooltipRef = useResourceBarTooltip(barRef, showTooltip, [devotionLevel, devotionDamage, hoverSection]);

    // Sync external state updates
    useEffect(() => {
        if (rawLevel !== undefined && rawLevel !== devotionLevel) {
            setDevotionLevel(Math.max(0, Math.min(rawLevel, MAX_LEVEL)));
        }
    }, [rawLevel]);

    useEffect(() => {
        if (rawDamage !== undefined && rawDamage !== devotionDamage) {
            setDevotionDamage(Math.max(0, Math.min(rawDamage, 150)));
        }
    }, [rawDamage]);

    // Update handlers
    const updateDevotionState = (newLevel, newDamage) => {
        const clampedLevel = Math.max(0, Math.min(newLevel, MAX_LEVEL));
        const clampedDamage = Math.max(0, Math.min(newDamage, 150));

        setDevotionLevel(clampedLevel);
        setDevotionDamage(clampedDamage);

        if (setMartyrState) {
            setMartyrState(prev => ({
                ...prev,
                localDevotionLevel: clampedLevel,
                localDevotionDamage: clampedDamage
            }));
        }

        if (onClassResourceUpdate) {
            onClassResourceUpdate('current', clampedLevel);
            onClassResourceUpdate('damage', clampedDamage);
        }
    };

    const handleSetLevel = (newLevel) => {
        const clampedLevel = Math.max(0, Math.min(newLevel, MAX_LEVEL));
        const correspondingDamage = THRESHOLDS[clampedLevel];
        updateDevotionState(clampedLevel, correspondingDamage);
    };

    const handleDamageChange = (newDamage) => {
        const clampedDamage = Math.max(0, Math.min(newDamage, 150));
        let calculatedLevel = 0;
        for (let i = MAX_LEVEL; i >= 0; i--) {
            if (clampedDamage >= THRESHOLDS[i]) {
                calculatedLevel = i;
                break;
            }
        }
        updateDevotionState(calculatedLevel, clampedDamage);
    };

    // Close controls drawer on outside click
    useEffect(() => {
        if (!showControls) return;
        const handleOutsideClick = (e) => {
            if (controlsMenuRef.current && controlsMenuRef.current.contains(e.target)) return;
            if (barRef.current && barRef.current.contains(e.target)) return;
            setShowControls(false);
        };
        document.addEventListener('mousedown', handleOutsideClick);
        return () => document.removeEventListener('mousedown', handleOutsideClick);
    }, [showControls]);

    // Tooltip trigger
    const handleMouseEnter = (section) => {
        if (showControls) return;
        setHoverSection(section);
        setShowTooltip(true);
    };

    const handleMouseLeave = () => {
        setHoverSection(null);
        setShowTooltip(false);
    };

    // Next threshold calculations
    const currentThreshold = THRESHOLDS[devotionLevel];
    const nextThreshold = devotionLevel < MAX_LEVEL ? THRESHOLDS[devotionLevel + 1] : THRESHOLDS[MAX_LEVEL];
    const damageNeeded = devotionLevel >= MAX_LEVEL ? 0 : Math.max(0, nextThreshold - devotionDamage);

    // Liquid fill calculation (width from 0 to 92px)
    const liquidFillWidth = Math.max(0, Math.min(92, (devotionDamage / 100) * 92));

    // Spec colors
    const activeSpec = SPEC_DATA[martyrSpec] || SPEC_DATA.redemption;

    return (
        <div className={`martyr-resource-wrapper ${size} ${context === 'party' ? 'party-context' : ''}`}>
            <div
                ref={barRef}
                className={`martyr-resource-bar spec-${martyrSpec} ${size} ${context === 'party' ? 'party-context' : ''}`}
                onClick={() => {
                    // Clicking on background or centerpiece opens controls drawer
                    if (isOwner) {
                        setShowControls(prev => !prev);
                        setShowTooltip(false);
                    }
                }}
            >
                <svg
                    viewBox="0 0 292 76"
                    className="martyr-master-svg"
                    role="img"
                    aria-label="Martyr Devotion Reliquary Apparatus"
                >
                    <defs>
                        {/* Background metallic gradient */}
                        <linearGradient id="martyrBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#150d09" />
                            <stop offset="50%" stopColor="#25160e" />
                            <stop offset="100%" stopColor="#130b08" />
                        </linearGradient>

                        {/* Gold filigree trim */}
                        <linearGradient id="martyrGoldBorder" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8d6624" />
                            <stop offset="25%" stopColor="#f3c868" />
                            <stop offset="50%" stopColor="#ffe9a0" />
                            <stop offset="75%" stopColor="#e5b34a" />
                            <stop offset="100%" stopColor="#7a5518" />
                        </linearGradient>

                        {/* Stigmata active seal glow gradient */}
                        <radialGradient id="martyrSealGlow" cx="50%" cy="50%" r="50%">
                            <stop offset="0%" stopColor={activeSpec.glowColor} stopOpacity="1" />
                            <stop offset="50%" stopColor={activeSpec.accentColor} stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#3d1508" stopOpacity="0.3" />
                        </radialGradient>

                        {/* Caliper liquid gradient */}
                        <linearGradient id="martyrLiquidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#962d1d" />
                            <stop offset="50%" stopColor="#d35400" />
                            <stop offset="100%" stopColor={activeSpec.accentColor} />
                        </linearGradient>

                        {/* Glass tube reflection highlight */}
                        <linearGradient id="martyrGlassHighlight" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
                            <stop offset="40%" stopColor="#ffffff" stopOpacity="0.1" />
                            <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
                        </linearGradient>

                        {/* Center Monstrance glow filter */}
                        <filter id="martyrSunGlow" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* BASE PLATE */}
                    <rect
                        x="3"
                        y="3"
                        width="286"
                        height="70"
                        rx="8"
                        ry="8"
                        fill="url(#martyrBgGrad)"
                        stroke="url(#martyrGoldBorder)"
                        strokeWidth="1.6"
                    />

                    {/* Inner Sanctum Border Inset */}
                    <rect
                        x="6"
                        y="6"
                        width="280"
                        height="64"
                        rx="6"
                        ry="6"
                        fill="none"
                        stroke="rgba(212, 175, 55, 0.22)"
                        strokeWidth="0.8"
                        strokeDasharray="4 2"
                    />

                    {/* Corner Sun-Boss Rivets */}
                    <circle cx="8" cy="8" r="2.2" fill="#d4af37" stroke="#3d2208" strokeWidth="0.6" />
                    <circle cx="284" cy="8" r="2.2" fill="#d4af37" stroke="#3d2208" strokeWidth="0.6" />
                    <circle cx="8" cy="68" r="2.2" fill="#d4af37" stroke="#3d2208" strokeWidth="0.6" />
                    <circle cx="284" cy="68" r="2.2" fill="#d4af37" stroke="#3d2208" strokeWidth="0.6" />

                    {/* Gothic Arch Filigree Dividers */}
                    <line x1="119" y1="12" x2="119" y2="64" stroke="rgba(212, 175, 55, 0.35)" strokeWidth="0.9" />
                    <circle cx="119" cy="38" r="3" fill="#2a170e" stroke="rgba(212, 175, 55, 0.6)" strokeWidth="0.8" />

                    <line x1="173" y1="12" x2="173" y2="64" stroke="rgba(212, 175, 55, 0.35)" strokeWidth="0.9" />
                    <circle cx="173" cy="38" r="3" fill="#2a170e" stroke="rgba(212, 175, 55, 0.6)" strokeWidth="0.8" />

                    {/* ========================================================= */}
                    {/* LEFT FLANK: THE 6 SACRED STIGMATA SEALS (Tiers I - VI)   */}
                    {/* ========================================================= */}
                    <g
                        className="martyr-seals-cluster"
                        onMouseEnter={() => handleMouseEnter('seals')}
                        onMouseLeave={handleMouseLeave}
                    >
                        {/* 6 Seals: Row 1 (I, II, III) & Row 2 (IV, V, VI) */}
                        {[
                            { level: 1, cx: 28, cy: 25, numeral: 'I' },
                            { level: 2, cx: 64, cy: 25, numeral: 'II' },
                            { level: 3, cx: 100, cy: 25, numeral: 'III' },
                            { level: 4, cx: 28, cy: 51, numeral: 'IV' },
                            { level: 5, cx: 64, cy: 51, numeral: 'V' },
                            { level: 6, cx: 100, cy: 51, numeral: 'VI' }
                        ].map(({ level, cx, cy, numeral }) => {
                            const isFilled = level <= devotionLevel;
                            const isActiveTier = level === devotionLevel;

                            return (
                                <g
                                    key={level}
                                    className={`martyr-seal-slot ${isFilled ? 'filled' : 'empty'} ${isActiveTier ? 'active-tier' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (isOwner) {
                                            handleSetLevel(isFilled && level === devotionLevel ? level - 1 : level);
                                        }
                                    }}
                                    onContextMenu={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        if (isOwner) handleSetLevel(Math.max(0, devotionLevel - 1));
                                    }}
                                >
                                    {/* Outer Barbed Ring / Gothic Bezel */}
                                    <circle
                                        cx={cx}
                                        cy={cy}
                                        r="11.5"
                                        fill="#120905"
                                        stroke={isFilled ? activeSpec.accentColor : 'rgba(139, 90, 43, 0.4)'}
                                        strokeWidth={isActiveTier ? '1.4' : '0.8'}
                                    />

                                    {/* Inner Gem Core */}
                                    <circle
                                        cx={cx}
                                        cy={cy}
                                        r="9"
                                        fill={isFilled ? 'url(#martyrSealGlow)' : '#1b100a'}
                                        stroke={isFilled ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0,0,0,0.5)'}
                                        strokeWidth="0.6"
                                    />

                                    {/* Sunburst Notches for Active Tier */}
                                    {isActiveTier && (
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r="13"
                                            fill="none"
                                            stroke={activeSpec.accentColor}
                                            strokeWidth="0.8"
                                            strokeDasharray="2 2"
                                            filter="url(#martyrSunGlow)"
                                        />
                                    )}

                                    {/* Roman Numeral Inscription */}
                                    <text
                                        x={cx}
                                        y={cy + 3.2}
                                        fill={isFilled ? '#ffffff' : 'rgba(180, 150, 110, 0.35)'}
                                        fontSize="8"
                                        fontWeight="900"
                                        textAnchor="middle"
                                        fontFamily="Cinzel, serif"
                                        style={{ pointerEvents: 'none' }}
                                    >
                                        {numeral}
                                    </text>
                                </g>
                            );
                        })}
                    </g>

                    {/* ========================================================= */}
                    {/* CENTERPIECE: THE SOLAR MONSTRANCE / HEART OF SERA         */}
                    {/* ========================================================= */}
                    <g
                        className="martyr-centerpiece"
                        onMouseEnter={() => handleMouseEnter('monstrance')}
                        onMouseLeave={handleMouseLeave}
                        onClick={(e) => {
                            e.stopPropagation();
                            if (isOwner) {
                                setShowControls(prev => !prev);
                                setShowTooltip(false);
                            }
                        }}
                    >
                        {/* Spiked Radiant Halo (12 rays) */}
                        <g className="martyr-monstrance-halo">
                            {Array.from({ length: 12 }).map((_, i) => {
                                const angle = (i * 30 * Math.PI) / 180;
                                const x1 = 146 + Math.cos(angle) * 19;
                                const y1 = 38 + Math.sin(angle) * 19;
                                const x2 = 146 + Math.cos(angle) * (i % 2 === 0 ? 27 : 24);
                                const y2 = 38 + Math.sin(angle) * (i % 2 === 0 ? 27 : 24);
                                return (
                                    <line
                                        key={i}
                                        x1={x1}
                                        y1={y1}
                                        x2={x2}
                                        y2={y2}
                                        stroke={activeSpec.accentColor}
                                        strokeWidth={i % 2 === 0 ? '1.4' : '0.8'}
                                        strokeLinecap="round"
                                        opacity={devotionLevel > 0 ? '0.9' : '0.4'}
                                    />
                                );
                            })}
                        </g>

                        {/* Outer Cathedral Monstrance Ring */}
                        <circle
                            cx="146"
                            cy="38"
                            r="20"
                            fill="#160c07"
                            stroke="url(#martyrGoldBorder)"
                            strokeWidth="1.6"
                            filter={devotionLevel > 0 ? 'url(#martyrSunGlow)' : 'none'}
                        />

                        {/* Inner Reliquary Chamber */}
                        <circle
                            cx="146"
                            cy="38"
                            r="15"
                            fill={devotionLevel > 0 ? 'url(#martyrSealGlow)' : '#100704'}
                            stroke={activeSpec.accentColor}
                            strokeWidth="0.8"
                        />

                        {/* Center Current Tier Roman Numeral */}
                        <text
                            x="146"
                            y="43.5"
                            fill={devotionLevel > 0 ? '#ffffff' : 'rgba(212, 175, 55, 0.45)'}
                            fontSize="14"
                            fontWeight="900"
                            textAnchor="middle"
                            fontFamily="Cinzel, serif"
                            filter={devotionLevel > 0 ? 'drop-shadow(0 0 4px rgba(255,255,255,0.8))' : 'none'}
                            style={{ pointerEvents: 'none' }}
                        >
                            {ROMAN_NUMERALS[devotionLevel]}
                        </text>
                    </g>

                    {/* ========================================================= */}
                    {/* RIGHT FLANK: SACRIFICIAL BLOOD-VESSEL / CALIPER GAUGE     */}
                    {/* ========================================================= */}
                    <g
                        className="martyr-caliper-cluster"
                        onMouseEnter={() => handleMouseEnter('caliper')}
                        onMouseLeave={handleMouseLeave}
                    >
                        {/* Caliper Outer Brass Frame */}
                        <rect
                            x="180"
                            y="26"
                            width="98"
                            height="24"
                            rx="12"
                            fill="#150a06"
                            stroke="url(#martyrGoldBorder)"
                            strokeWidth="1.3"
                        />

                        {/* Caliper Inner Glass Channel */}
                        <rect
                            x="183"
                            y="29"
                            width="92"
                            height="18"
                            rx="9"
                            fill="#0d0503"
                            stroke="rgba(0, 0, 0, 0.8)"
                            strokeWidth="0.8"
                        />

                        {/* Dynamic Liquid/Plasma Fill */}
                        <rect
                            className="martyr-liquid-fill"
                            x="183"
                            y="29"
                            width={liquidFillWidth}
                            height="18"
                            rx="9"
                            fill="url(#martyrLiquidGrad)"
                            filter={devotionDamage > 0 ? 'url(#martyrSunGlow)' : 'none'}
                        />

                        {/* Glass Specular Reflection Highlight */}
                        <rect
                            x="183"
                            y="29"
                            width="92"
                            height="9"
                            rx="4"
                            fill="url(#martyrGlassHighlight)"
                            style={{ pointerEvents: 'none' }}
                        />

                        {/* Threshold Tick Marks & Diamond Pips */}
                        {[
                            { dmg: 10, label: '10' },
                            { dmg: 20, label: '20' },
                            { dmg: 40, label: '40' },
                            { dmg: 60, label: '60' },
                            { dmg: 80, label: '80' }
                        ].map(({ dmg }) => {
                            const tickX = 183 + (dmg / 100) * 92;
                            const isPassed = devotionDamage >= dmg;

                            return (
                                <g key={dmg} style={{ pointerEvents: 'none' }}>
                                    <line
                                        x1={tickX}
                                        y1="29"
                                        x2={tickX}
                                        y2="47"
                                        stroke={isPassed ? '#ffffff' : 'rgba(212, 175, 55, 0.4)'}
                                        strokeWidth="0.8"
                                        strokeDasharray="1.5 1.5"
                                    />
                                    <circle
                                        cx={tickX}
                                        cy="38"
                                        r="1.4"
                                        fill={isPassed ? '#ffffff' : 'rgba(212, 175, 55, 0.6)'}
                                    />
                                </g>
                            );
                        })}
                    </g>
                </svg>
            </div>

            {/* Shared ClassTip Tooltip (Zero emojis, FontAwesome icon) */}
            {showTooltip && ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip martyr-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}>
                    {hoverSection === 'caliper' ? (
                        <ClassTip
                            icon="fas fa-heart-pulse"
                            tint={activeSpec.accentColor}
                            title="Sacrificial Bank"
                            subtitle="Martyr Devotion Gauge"
                            state={`${devotionDamage}/100 DMG`}
                            stateTone={devotionDamage >= 80 ? 'good' : devotionDamage >= 20 ? 'warn' : 'neutral'}
                            mechanic="Every point of damage willingly absorbed for allies fills the Devotion boiler. Higher damage triggers Stigmata thresholds."
                            status={[
                                devotionLevel >= MAX_LEVEL
                                    ? 'Maximum Devotion attained (Celestial Protector) — party-wide damage immunity!'
                                    : `${damageNeeded} more damage needed to unlock Tier ${devotionLevel + 1} (${STAGE_NAMES[devotionLevel + 1]}).`,
                                'Lose 1 level after 2 consecutive rounds without damage or Voluntary Offering.'
                            ]}
                            usage={isOwner ? 'Click +10 / +20 to bank damage · Click 1d8 HP for Voluntary Offering · Center opens full drawer.' : null}
                        />
                    ) : (
                        <ClassTip
                            icon="fas fa-cross"
                            tint={activeSpec.accentColor}
                            title={`Devotion · ${STAGE_NAMES[devotionLevel]}`}
                            subtitle="Martyr Devotion Gauge"
                            state={`Tier ${ROMAN_NUMERALS[devotionLevel]} (${devotionDamage} DMG)`}
                            stateTone={devotionLevel >= 4 ? 'good' : devotionLevel > 0 ? 'warn' : 'neutral'}
                            mechanic={`Sera Solvan's First Scar transforms suffering into divine authority. ${activeSpec.title}: ${activeSpec.description}`}
                            status={[
                                devotionLevel > 0
                                    ? `Tier ${devotionLevel} Passive: ${STAGE_PASSIVES[devotionLevel]}`
                                    : STAGE_PASSIVES[0],
                                activeSpec.sharedPassive
                            ]}
                            usage={isOwner ? 'Click any Stigmata Seal to set Tier directly · Center Monstrance toggles Pathfinder Drawer.' : null}
                        />
                    )}
                </div>,
                document.body
            )}

            {/* Unified Context Controls Drawer (Pathfinder Warm Beige/Parchment Theme) */}
            {showControls && ReactDOM.createPortal(
                <div
                    ref={controlsMenuRef}
                    className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                    onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                    onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                    style={{
                        position: 'fixed',
                        top: barRef.current ? barRef.current.getBoundingClientRect().bottom + 8 : '50%',
                        left: barRef.current ? barRef.current.getBoundingClientRect().left : '50%',
                        transform: barRef.current ? 'none' : 'translate(-50%, -50%)',
                        zIndex: 100000,
                        maxWidth: '315px',
                        width: '100%'
                    }}
                >
                    <div className="context-menu-main">
                        <div className="context-menu-section">
                            <div className="context-menu-section-header">Martyr Devotion & Suffering Ledger</div>

                            {/* Current state summary */}
                            <div style={{ fontSize: '0.8rem', marginBottom: '6px', lineHeight: 1.35 }}>
                                <div><strong>Devotion:</strong> {STAGE_NAMES[devotionLevel]} <span style={{ color: '#b7791f' }}>(Tier {ROMAN_NUMERALS[devotionLevel]})</span></div>
                                <div><strong>Suffering Banked:</strong> <span style={{ color: devotionLevel >= 5 ? '#c0392b' : '#b7791f' }}>{devotionDamage}/100 DMG</span> {devotionLevel < MAX_LEVEL && <span style={{ fontSize: '0.72rem', color: '#666' }}>({damageNeeded} to next tier)</span>}</div>
                                <div style={{ color: devotionLevel === 0 ? '#b30000' : '#5a4628', marginTop: '2px', fontSize: '0.74rem' }}>
                                    <strong>Active Passive:</strong> {STAGE_PASSIVES[devotionLevel]}
                                </div>
                            </div>

                            <div className="context-menu-section-header" style={{ fontSize: '12px', marginTop: '8px', marginBottom: '8px' }}>
                                Set Devotion Tier
                            </div>

                            {/* Direct Jump Grid (0 to 6) */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                {[0, 1, 2, 3, 4, 5, 6].map((lvl) => (
                                    <button
                                        key={lvl}
                                        className={`context-menu-button ${devotionLevel === lvl ? 'active' : ''} ${lvl === 0 ? 'danger' : ''}`}
                                        onClick={() => handleSetLevel(lvl)}
                                        title={`${STAGE_NAMES[lvl]} (${THRESHOLDS[lvl]} DMG)`}
                                    >
                                        {lvl === 0 ? '0' : ROMAN_NUMERALS[lvl]}
                                    </button>
                                ))}
                            </div>

                            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                                <button
                                    className="context-menu-button"
                                    onClick={() => handleSetLevel(Math.max(0, devotionLevel - 1))}
                                    disabled={devotionLevel === 0}
                                >
                                    <i className="fas fa-minus-circle"></i>
                                    -1 Tier
                                </button>
                                <button
                                    className="context-menu-button"
                                    onClick={() => handleSetLevel(Math.min(MAX_LEVEL, devotionLevel + 1))}
                                    disabled={devotionLevel === MAX_LEVEL}
                                >
                                    <i className="fas fa-plus-circle"></i>
                                    +1 Tier
                                </button>
                            </div>

                            <div className="context-menu-main-separator" style={{ margin: '8px 0' }}></div>

                            {/* Suffering Bank Controls */}
                            <div className="context-menu-section-header" style={{ fontSize: '12px', marginBottom: '6px' }}>
                                Suffering Bank Management (Damage Taken)
                            </div>
                            <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                                <button
                                    className="context-menu-button"
                                    onClick={() => handleDamageChange(Math.max(0, devotionDamage - 10))}
                                    title="Subtract 10 Damage"
                                >
                                    <i className="fas fa-minus"></i> -10 DMG
                                </button>
                                <button
                                    className="context-menu-button"
                                    onClick={() => handleDamageChange(devotionDamage + 10)}
                                    title="Add 10 Damage"
                                >
                                    <i className="fas fa-plus"></i> +10 DMG
                                </button>
                                <button
                                    className="context-menu-button"
                                    onClick={() => handleDamageChange(devotionDamage + 20)}
                                    title="Add 20 Damage"
                                >
                                    <i className="fas fa-layer-group"></i> +20 DMG
                                </button>
                                <button
                                    className="context-menu-button"
                                    onClick={() => handleDamageChange(0)}
                                    title="Reset Banked Damage to 0"
                                >
                                    <i className="fas fa-undo"></i>
                                </button>
                            </div>

                            <button
                                className="context-menu-button danger"
                                onClick={() => setShowControls(false)}
                                style={{ width: '100%', marginTop: '6px' }}
                            >
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

export default MartyrResourceBar;
