import ClassMenuSpells from '../../../../components/hud/ClassMenuSpells';
import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/MartyrResourceBar.css';
import '../../../../styles/unified-context-menu.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import ClassTip from '../../../../components/hud/ClassTip';
import { INK, MUTED, PAGE, PAPER, RULE, ETCH, BRICK, inked, washed } from '../../../../components/hud/calmBarPalette';
import { MARTYR_DAMAGE_THRESHOLDS, MARTYR_DEVOTION_MAX, MARTYR_DAMAGE_BANK_MAX, normalizeManagedClassResource, updateManagedClassResource } from '../../../classResourceContracts';

const THRESHOLDS = MARTYR_DAMAGE_THRESHOLDS;
const MAX_LEVEL = MARTYR_DEVOTION_MAX;

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
    'Faithless — healing halved and Intervene locked. Sacrifice 15+ HP in one round to awaken.',
    'Resistance to the first instance of damage each combat round',
    'Regain 1d6 HP at the start of each of your turns',
    'All allies within 10 ft gain +1 damage reduction',
    'Allies within 10 ft gain resistance to the first damage type taken each round',
    '+10 ember damage on attacks; allies within 10 ft gain temp HP when you take damage',
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
        description: 'Ember combustion. Ember spells deal +(Devotion Level × 3) dmg; half of the bonus is dealt back to you as self-harm.',
        sharedPassive: "Suffering's Gift: At Devotion 3+, taking damage grants nearby allies temp HP equal to your Devotion tier."
    },
    ascetic: {
        name: 'Ascetic',
        title: 'The Vow-Silent',
        accentColor: '#cbd5e1',
        glowColor: '#f8fafc',
        description: 'Monastic discipline. Amplified spell costs -1 Devotion (min 1). Resist smashing damage at Devotion 4+.',
        sharedPassive: "Suffering's Gift: At Devotion 3+, taking damage grants nearby allies temp HP equal to your Devotion tier."
    },
    ironclad: {
        name: 'Ironclad',
        title: 'The Living Forge',
        accentColor: '#d35400',
        glowColor: '#f39c12',
        description: 'Welded Skald dreadnaught boiler-plate. Converts damage into boiler-pressure and offensive vents.',
        sharedPassive: "Furnace Vow: At Devotion 3+, calcified plating grants +2 DR and area steam vents."
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
    const normalizedResource = normalizeManagedClassResource(classResource, 'Martyr');
    const rawLevel = normalizedResource.current;
    const rawDamage = normalizedResource.damage;
    const rawSpec = classResource?.spec ?? martyrState?.martyrSpec ?? config?.visual?.spec ?? 'redemption';

    const [devotionLedger, setDevotionLedger] = useState(normalizedResource);
    const devotionLevel = devotionLedger.current;
    const devotionDamage = devotionLedger.damage;
    const [martyrSpec] = useState(rawSpec in SPEC_DATA ? rawSpec : 'redemption');

    const [showControls, setShowControls] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [hoverSection, setHoverSection] = useState(null);

    const barRef = useRef(null);
    const controlsMenuRef = useRef(null);
    const tooltipRef = useResourceBarTooltip(barRef, showTooltip, [devotionLevel, devotionDamage, hoverSection]);

    // Sync external state updates
    useEffect(() => {
        setDevotionLedger(normalizedResource);
    }, [rawLevel, rawDamage, normalizedResource.spentLevels, normalizedResource.bonusLevels]);

    // Update handlers
    const updateDevotionState = (nextLedger) => {
        const clampedLevel = nextLedger.current;
        const clampedDamage = nextLedger.damage;
        setDevotionLedger(nextLedger);

        if (setMartyrState) {
            setMartyrState(prev => ({
                ...prev,
                localDevotionLevel: clampedLevel,
                localDevotionDamage: clampedDamage
            }));
        }

        if (onClassResourceUpdate) {
            onClassResourceUpdate('spentLevels', nextLedger.spentLevels);
            onClassResourceUpdate('bonusLevels', nextLedger.bonusLevels);
            onClassResourceUpdate('damage', clampedDamage);
            onClassResourceUpdate('current', clampedLevel);
        }
    };

    const handleSetLevel = (newLevel) => {
        const clampedLevel = Math.max(0, Math.min(newLevel, MAX_LEVEL));
        const correspondingDamage = THRESHOLDS[clampedLevel];
        updateDevotionState(normalizeManagedClassResource({ ...devotionLedger, current: clampedLevel,
            damage: correspondingDamage, spentLevels: 0, bonusLevels: 0 }, 'Martyr'));
    };

    const handleDamageChange = (newDamage) => {
        const clampedDamage = Math.max(0, Math.min(newDamage, MARTYR_DAMAGE_BANK_MAX));
        updateDevotionState(updateManagedClassResource(devotionLedger, 'Martyr', 'damage', clampedDamage));
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
    const nextThreshold = devotionLedger.earnedLevels < MAX_LEVEL ? THRESHOLDS[devotionLedger.earnedLevels + 1] : THRESHOLDS[MAX_LEVEL];
    const damageNeeded = devotionLedger.earnedLevels >= MAX_LEVEL ? 0 : Math.max(0, nextThreshold - devotionDamage);

    // Liquid fill calculation (width from 0 to 92px)
    const liquidFillWidth = Math.max(0, Math.min(92, (devotionDamage / 100) * 92));

    // Spec colors
    const activeSpec = SPEC_DATA[martyrSpec] || SPEC_DATA.redemption;
    const specInk = inked(activeSpec.accentColor, 0.5);
    const specWash = washed(activeSpec.accentColor, 0.18);

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
                    <defs />

                    {/* Parchment page with a ledger rule and two vertical dividers */}
                    <rect x="3" y="3" width="286" height="70" rx="3" fill={PAGE} stroke={RULE} strokeWidth="1.2" />
                    <rect x="6" y="6" width="280" height="64" rx="1.5" fill="none" stroke={ETCH} strokeWidth="0.6" />
                    <line x1="119" y1="12" x2="119" y2="64" stroke={RULE} strokeWidth="0.8" />
                    <line x1="173" y1="12" x2="173" y2="64" stroke={RULE} strokeWidth="0.8" />

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
                                        fill={PAGE}
                                        stroke={isFilled ? specInk : RULE}
                                        strokeWidth={isActiveTier ? '1.5' : '0.8'}
                                    />

                                    {/* Inner Gem Core */}
                                    <circle
                                        cx={cx}
                                        cy={cy}
                                        r="9"
                                        fill={isFilled ? specWash : PAPER}
                                        stroke={isFilled ? specInk : ETCH}
                                        strokeWidth="0.6"
                                    />

                                    {/* Sunburst Notches for Active Tier */}
                                    {isActiveTier && (
                                        <circle
                                            cx={cx}
                                            cy={cy}
                                            r="13"
                                            fill="none"
                                            stroke={specInk}
                                            strokeWidth="0.8"
                                            strokeDasharray="2 2"
                                        />
                                    )}

                                    {/* Roman Numeral Inscription */}
                                    <text
                                        x={cx}
                                        y={cy + 3.2}
                                        fill={isFilled ? INK : ETCH}
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
                                        stroke={devotionLevel > 0 ? specInk : ETCH}
                                        strokeWidth={i % 2 === 0 ? '1.2' : '0.7'}
                                        strokeLinecap="round"
                                    />
                                );
                            })}
                        </g>

                        {/* Outer Cathedral Monstrance Ring */}
                        <circle
                            cx="146"
                            cy="38"
                            r="20"
                            fill={PAPER}
                            stroke={devotionLevel > 0 ? specInk : RULE}
                            strokeWidth="1.2"
                        />

                        {/* Inner Reliquary Chamber */}
                        <circle
                            cx="146"
                            cy="38"
                            r="15"
                            fill={devotionLevel > 0 ? specWash : PAGE}
                            stroke={devotionLevel > 0 ? specInk : ETCH}
                            strokeWidth="0.8"
                        />

                        {/* Center Current Tier Roman Numeral */}
                        <text
                            x="146"
                            y="43.5"
                            fill={devotionLevel > 0 ? INK : ETCH}
                            fontSize="14"
                            fontWeight="900"
                            textAnchor="middle"
                            fontFamily="Cinzel, serif"
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
                            fill={PAGE}
                            stroke={RULE}
                            strokeWidth="1"
                        />

                        {/* Caliper Inner Glass Channel */}
                        <rect
                            x="183"
                            y="29"
                            width="92"
                            height="18"
                            rx="9"
                            fill={PAPER}
                            stroke={ETCH}
                            strokeWidth="0.6"
                        />

                        {/* Dynamic Liquid/Plasma Fill */}
                        <rect
                            className="martyr-liquid-fill"
                            x="183"
                            y="29"
                            width={liquidFillWidth}
                            height="18"
                            rx="9"
                            fill={washed(BRICK, 0.42)}
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
                                        stroke={isPassed ? inked(BRICK, 0.2) : RULE}
                                        strokeWidth="0.8"
                                        strokeDasharray="1.5 1.5"
                                    />
                                    <circle
                                        cx={tickX}
                                        cy="38"
                                        r="1.4"
                                        fill={isPassed ? inked(BRICK, 0.2) : RULE}
                                    />
                                </g>
                            );
                        })}
                    </g>
                </svg>
            </div>

            {/* Shared ClassTip Tooltip (Zero emojis, FontAwesome icon) */}
            {showTooltip && !showControls && ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip martyr-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}>
                    {hoverSection === 'caliper' ? (
                        <ClassTip
                            icon="fas fa-heart-pulse"
                            tint={activeSpec.accentColor}
                            title="Sacrificial Bank"
                            subtitle="Martyr Devotion Gauge"
                            state={`${devotionDamage}/100 DMG`}
                            stateTone={devotionDamage >= 80 ? 'good' : devotionDamage >= 20 ? 'warn' : 'neutral'}
                             mechanic="Eligible cumulative damage earns levels at 10/20/40/60/80/100. Available Devotion is 0–6 after spending; the damage ledger is not a spendable 100-point pool."
                            status={[
                                 devotionLedger.earnedLevels >= MAX_LEVEL
                                     ? 'All six damage thresholds earned; spending remains deducted until an explicit level grant or reset.'
                                     : `${damageNeeded} more eligible damage crosses the next earned threshold. ${devotionLedger.spentLevels} levels spent.`,
                                'Decay: lose 1 tier after 1 round without damage or a Voluntary Offering.'
                            ]}
                            usage={isOwner ? 'Click +10 / +20 to bank damage · Click 1d8 HP for Voluntary Offering · Center opens the full drawer.' : null}
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
                                    ? `Tier ${devotionLevel} passive: ${STAGE_PASSIVES[devotionLevel]}`
                                    : STAGE_PASSIVES[0],
                                activeSpec.sharedPassive
                            ]}
                            usage={isOwner ? 'Click any Tier seal to set Devotion directly · Center Monstrance toggles the dossier.' : null}
                        />
                    )}
                </div>,
                document.body
            )}

            {/* Unified Context Controls Drawer (Pathfinder Warm Beige/Parchment Theme) */}
            {showControls && ReactDOM.createPortal(
                <div
                    ref={controlsMenuRef}
                    className={`unified-context-menu compact context-menu-container martyr-menu-container class-resource-menu ${context === 'party' ? 'chronarch-party' : ''}`}
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
                        top: barRef.current ? barRef.current.getBoundingClientRect().bottom + 8 : '50%',
                        left: barRef.current ? barRef.current.getBoundingClientRect().left : '50%',
                        transform: barRef.current ? 'none' : 'translate(-50%, -50%)',
                        zIndex: 100000,
                        maxWidth: '315px',
                        width: '100%'
                    }}
                >
                    <div className="cm" style={{ '--cm-accent': '#a8742a', '--cm-accent-deep': '#5e3a12', '--cm-wash': '#f3e4c8' }}>
                        <header className="cm-head">
                            <span className={`cm-seal ${devotionLevel === 0 ? 'is-quiet' : ''}`}>{devotionLevel === 0 ? '0' : ROMAN_NUMERALS[devotionLevel]}</span>
                            <div className="cm-titles">
                                <div className="cm-eyebrow">Martyr Devotion &amp; Suffering Ledger</div>
                                <div className="cm-title">{STAGE_NAMES[devotionLevel]}</div>
                                <div className="cm-sub">{devotionLevel === 0 ? 'Devotion unkindled' : `Devotion tier ${ROMAN_NUMERALS[devotionLevel]}`}</div>
                            </div>
                            <button type="button" className="cm-x" aria-label="Close menu" onClick={() => setShowControls(false)}>
                                <i className="fas fa-times" aria-hidden="true"></i>
                            </button>
                        </header>
                        <div className={`cm-burden ${devotionLevel === 0 ? 'is-quiet' : ''}`}>
                            <span className="cm-burden-label">Your devotion grants</span>
                            <p className="cm-burden-text">{STAGE_PASSIVES[devotionLevel]}</p>
                        </div>
                        <div className="cm-section">Set Devotion Tier</div>
                        <div className="cm-track" style={{ '--cm-cols': 7 }} role="group" aria-label="Set Devotion tier">
                            {[0, 1, 2, 3, 4, 5, 6].map((lvl) => (
                                <button
                                    key={lvl}
                                    type="button"
                                    className={`cm-pip ${devotionLevel === lvl ? 'active' : ''} ${devotionLevel >= lvl && lvl > 0 ? 'lit' : ''}`}
                                    onClick={() => handleSetLevel(lvl)}
                                    title={`${STAGE_NAMES[lvl]} (${THRESHOLDS[lvl]} DMG)`}
                                >
                                    {lvl === 0 ? '0' : ROMAN_NUMERALS[lvl]}
                                </button>
                            ))}
                        </div>
                        <div className="cm-row">
                            <button type="button" className="context-menu-button spend" onClick={() => handleSetLevel(Math.max(0, devotionLevel - 1))} disabled={devotionLevel === 0}>
                                -1 Tier
                            </button>
                            <button type="button" className="context-menu-button gain" onClick={() => handleSetLevel(Math.min(MAX_LEVEL, devotionLevel + 1))} disabled={devotionLevel === MAX_LEVEL}>
                                +1 Tier
                            </button>
                        </div>
                        <div className="cm-section">Suffering Bank Management (Damage Taken)</div>
                        <div className="cm-meter" aria-hidden="true"><span style={{ width: `${Math.min(100, devotionDamage)}%` }}></span></div>
                        <p className="cm-line">{devotionDamage}/100 DMG banked{devotionLedger.earnedLevels < MAX_LEVEL ? `, ${damageNeeded} more to the next tier` : ''}.</p>
                        <p className="cm-line is-quiet">Earned: {devotionLedger.earnedLevels} · Spent: {devotionLedger.spentLevels} · Bonus: {devotionLedger.bonusLevels}</p>
                        <div className="cm-row" style={{ '--cm-cols': 4 }}>
                            <button type="button" className="context-menu-button" onClick={() => handleDamageChange(Math.max(0, devotionDamage - 10))} title="Subtract 10 Damage">-10</button>
                            <button type="button" className="context-menu-button" onClick={() => handleDamageChange(devotionDamage + 10)} title="Add 10 Damage">+10</button>
                            <button type="button" className="context-menu-button" onClick={() => handleDamageChange(devotionDamage + 20)} title="Add 20 Damage">+20</button>
                            <button type="button" className="context-menu-button quiet" onClick={() => handleDamageChange(0)} title="Reset banked damage to 0" aria-label="Reset banked damage"><i className="fas fa-undo" aria-hidden="true"></i></button>
                        </div>
                        <ClassMenuSpells className="Martyr" resourceTypes={['devotion']} resourceLabel="Devotion" current={devotionLevel} />
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default MartyrResourceBar;
