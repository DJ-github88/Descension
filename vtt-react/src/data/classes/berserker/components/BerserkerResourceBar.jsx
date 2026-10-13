import ClassMenuSpells from '../../../../components/hud/ClassMenuSpells';
import React, { useState, useRef, useEffect, useId } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import { getResourceStatusFlavor } from '../../../../utils/resourceStatusFlavor';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import ClassTip from '../../../../components/hud/ClassTip';
import { INK, MUTED, PAGE, PAPER, PANEL, RULE, ETCH, BRICK, washed } from '../../../../components/hud/calmBarPalette';
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
        riftClip: `bsRiftClip${uid}`
    };

    // Calm rage inks: each tier deepens the ink; Obliteration is brick-dark.
    const RAGE_TIERS = [
        { at: 21, label: 'Frenzied' },
        { at: 41, label: 'Primal' },
        { at: 61, label: 'Carnage' },
        { at: 81, label: 'Cataclysm' }
    ];
    const rageInk = localRage >= 101 ? '#6e2418'
        : localRage >= 81 ? BRICK
        : localRage >= 61 ? '#9a3f1c'
        : localRage >= 41 ? '#a3551a'
        : localRage >= 21 ? '#8a5a12'
        : MUTED;
    const xForRage = (v) => 26 + (Math.min(100, Math.max(0, v)) / 100) * 308;

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
                            <clipPath id={ids.riftClip}>
                                <rect x="26" y="8" width="308" height="40" rx="2" />
                            </clipPath>
                        </defs>

                        {/* 1. Parchment page behind the jaws */}
                        <rect className="bs-page" x="24" y="6" width="312" height="44" rx="3" fill={PAGE} stroke={isOverheated ? BRICK : RULE} strokeWidth={isOverheated ? 1.5 : 1} />

                        {/* 2. Rage: a wash of the current tier ink between the jaws, with an inked leading edge */}
                        <g clipPath={`url(#${ids.riftClip})`}>
                            {activeFillWidth > 0 && (
                                <>
                                    <rect className="bs-rage-fill" x="26" y="8" width={activeFillWidth} height="40" fill={washed(rageInk, 0.36)} />
                                    <line x1={26 + activeFillWidth} y1="8" x2={26 + activeFillWidth} y2="48" stroke={rageInk} strokeWidth="1.6" />
                                </>
                            )}
                            {/* Tier thresholds: Frenzied, Primal, Carnage, Cataclysm */}
                            {RAGE_TIERS.map((t) => (
                                <line
                                    key={t.at}
                                    x1={xForRage(t.at - 1)} y1="10" x2={xForRage(t.at - 1)} y2="46"
                                    stroke={localRage >= t.at ? rageInk : ETCH}
                                    strokeWidth="0.8"
                                    strokeDasharray="1.6 1.6"
                                />
                            ))}
                        </g>

                        {/* 3. Jaws: paper teeth with a thin rule, framing the rage */}
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
                            fill={PANEL}
                            stroke={RULE}
                            strokeWidth="0.9"
                            strokeLinejoin="round"
                        />
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
                            fill={PANEL}
                            stroke={RULE}
                            strokeWidth="0.9"
                            strokeLinejoin="round"
                        />

                        {/* 4. Pain Immunity fang (21+): inked, with the kin-rune between the jaws */}
                        <polygon points="86,7 92,15 98,7" fill={localRage >= 21 ? washed('#8a5a12', 0.45) : PAPER} stroke={localRage >= 21 ? '#8a5a12' : RULE} strokeWidth="0.9" />
                        <polygon points="86,49 92,41 98,49" fill={localRage >= 21 ? washed('#8a5a12', 0.45) : PAPER} stroke={localRage >= 21 ? '#8a5a12' : RULE} strokeWidth="0.9" />
                        <polygon points="92,24 95,28 92,32 89,28" fill={localRage >= 21 ? '#8a5a12' : 'none'} stroke={localRage >= 21 ? '#8a5a12' : ETCH} strokeWidth="0.8" />

                        {/* 5. Overheat fang (100): brick once the jaw is full */}
                        <polygon points="322,7 327,15 332,7" fill={localRage >= 100 ? BRICK : PAPER} stroke={localRage >= 100 ? BRICK : RULE} strokeWidth="0.9" />
                        <polygon points="322,49 327,41 332,49" fill={localRage >= 100 ? BRICK : PAPER} stroke={localRage >= 100 ? BRICK : RULE} strokeWidth="0.9" />

                        {/* 6. Ten click-to-set sectors (10..100) */}
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
                            >
                                <title>{`Set Rage to ${val}`}</title>
                            </rect>
                        ))}

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
                            <title>Stoke rage +5 (Shift: +25)</title>
                            <rect x="0" y="0" width="38" height="56" fill="transparent" pointerEvents="all" />
                            <polygon className="bs-trigger-plate" points="4,16 22,8 26,28 22,48 4,40 8,28" fill={PAPER} stroke={RULE} strokeWidth="1" strokeLinejoin="round" />
                            <line x1="15" y1="21" x2="15" y2="35" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
                            <line x1="8" y1="28" x2="22" y2="28" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
                        </g>

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
                            <title>Vent rage -10 (Shift: -25)</title>
                            <rect x="322" y="0" width="38" height="56" fill="transparent" pointerEvents="all" />
                            <polygon className="bs-trigger-plate" points="334,8 356,16 352,28 356,40 334,48 338,28" fill={PAPER} stroke={RULE} strokeWidth="1" strokeLinejoin="round" />
                            <line x1="339" y1="28" x2="351" y2="28" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
                        </g>

                        <g
                            className="berserker-brand-center"
                            onClick={(e) => {
                                e.stopPropagation();
                                dismissTooltip();
                                if (isOwner) setShowControls(!showControls);
                            }}
                        >
                            {/* Crossed war-axes */}
                            <line x1="166" y1="5" x2="194" y2="23" stroke={localRage >= 41 ? rageInk : MUTED} strokeWidth="1.4" strokeLinecap="round" />
                            <line x1="194" y1="5" x2="166" y2="23" stroke={localRage >= 41 ? rageInk : MUTED} strokeWidth="1.4" strokeLinecap="round" />
                            <path d="M 164,4 C 160,8 162,13 167,11 M 196,4 C 200,8 198,13 193,11" fill="none" stroke={localRage >= 41 ? rageInk : MUTED} strokeWidth="1.1" />
                            {/* Horned skull faceplate */}
                            <polygon points="180,3 190,9 188,19 184,23 180,21 176,23 172,19 170,9" fill={PAPER} stroke={localRage >= 61 ? rageInk : MUTED} strokeWidth="1.2" strokeLinejoin="round" />
                            <path d="M 170,9 L 163,2 L 168,11 M 190,9 L 197,2 L 192,11" fill={PAPER} stroke={localRage >= 61 ? rageInk : MUTED} strokeWidth="1" strokeLinejoin="round" />
                            {/* Eyes kindle with rage */}
                            <polygon points="176,12 178,14 177,16 174,15" fill={localRage >= 21 ? rageInk : ETCH} />
                            <polygon points="184,12 182,14 183,16 186,15" fill={localRage >= 21 ? rageInk : ETCH} />
                        </g>

                        {/* 7. Overheat (101+): brick strokes bursting from the jaw, static */}
                        {isOverheated && (
                            <g className="bs-overheat-marks" stroke={BRICK} strokeWidth="1.3" strokeLinecap="round" pointerEvents="none">
                                <line x1="180" y1="3" x2="180" y2="-2" />
                                <line x1="163" y1="2" x2="160" y2="-3" />
                                <line x1="197" y1="2" x2="200" y2="-3" />
                                <line x1="108" y1="6" x2="105" y2="1" />
                                <line x1="252" y1="6" x2="255" y2="1" />
                                <line x1="108" y1="50" x2="105" y2="55" />
                                <line x1="252" y1="50" x2="255" y2="55" />
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
                        mechanic="Rage builds from melee abilities (+1d6, 1d4 recoil), damage taken (+1d4), crits (+2d6), kills (+1d8); −10/round idle. 21+: Battle-Trance (pain and fear immunity, no ally healing). 101+: drop below 101 within 1 round or take 2d6, reset to 0 and be Stunned."
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
                    <div className="cm" style={{ '--cm-accent': '#a3341f', '--cm-accent-deep': '#5e1a10', '--cm-wash': '#f5e0d2' }}>
                        <header className="cm-head">
                            <span className={`cm-seal ${localRage < 21 ? 'is-quiet' : ''}`}>{localRage}</span>
                            <div className="cm-titles">
                                <div className="cm-eyebrow">Rage: {localRage}/100</div>
                                <div className="cm-title">{rageState.name}</div>
                                <div className="cm-sub">{statusFlavor?.text || 'Every blow stokes the kettle.'}</div>
                            </div>
                            <button type="button" className="cm-x" aria-label="Close menu" onClick={() => setShowControls(false)}>
                                <i className="fas fa-times" aria-hidden="true"></i>
                            </button>
                        </header>
                        <div className="cm-meter" aria-hidden="true"><span style={{ width: `${Math.min(100, localRage)}%` }}></span></div>
                        <div className={`cm-burden ${localRage < 21 ? 'is-quiet' : localRage >= 81 ? 'is-severe' : ''}`}>
                            <span className="cm-burden-label">{localRage < 21 ? 'The kettle is cold' : `While ${rageState.name}`}</span>
                            <p className="cm-burden-text">{rageState.bonus}</p>
                        </div>
                        <div className="cm-section">Thresholds</div>
                        <div className="cm-track" style={{ '--cm-cols': 6 }} role="group" aria-label="Set Rage">
                            {[[0, 'Cold'], [21, 'Frenzy'], [41, 'Primal'], [61, 'Carnage'], [81, 'Cataclysm'], [100, 'Brink']].map(([val, label]) => (
                                <button
                                    key={val}
                                    type="button"
                                    className={`cm-pip ${[0, 21, 41, 61, 81, 100].filter((v) => v <= localRage).pop() === val ? 'active' : ''} ${localRage >= val ? 'lit' : ''} ${val >= 81 ? 'gate' : ''}`}
                                    title={`Set Rage to ${val}`}
                                    onClick={() => handleRageSet(val)}
                                >
                                    {val}<small>{label}</small>
                                </button>
                            ))}
                        </div>
                        <div className="cm-section">Fuel &amp; Unleash</div>
                        <div className="cm-row" style={{ '--cm-cols': 3 }}>
                            <span className="cm-row-label">Strike, bleed or kill to build</span>
                            {[5, 10, 25].map((n) => (
                                <button key={n} type="button" className="context-menu-button gain" onClick={() => handleRageChange(n)}>
                                    +{n}
                                </button>
                            ))}
                            <span className="cm-row-label">Spend it on your abilities</span>
                            {[10, 25, 50].map((n) => (
                                <button key={n} type="button" className="context-menu-button spend" onClick={() => handleRageChange(-n)}>
                                    -{n}
                                </button>
                            ))}
                        </div>
                        <ClassMenuSpells className="Berserker" resourceTypes={['rage']} resourceLabel="Rage" current={localRage} />
                        <details className="cm-notes">
                            <summary>How Rage works</summary>
                            <p>Melee strikes, damage taken and kills stoke the kettle. Abilities spend it.</p>
                            <p>Above 20 you are in Battle-Trance: no ally can heal you. Cross 101 and Metabolic Burnout deals 2d6 and drops you to 0.</p>
                        </details>
                        <div className="cm-foot">
                            <button type="button" className="context-menu-button quiet" onClick={() => { handleRageSet(0); setShowControls(false); }}>
                                <i className="fas fa-undo" aria-hidden="true"></i> Reset (0)
                            </button>
                            <button type="button" className="context-menu-button danger" onClick={() => { handleRageSet(100); setShowControls(false); }}>
                                <i className="fas fa-fire" aria-hidden="true"></i> Max (100)
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
