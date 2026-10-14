import ClassMenuSpells from '../../../../components/hud/ClassMenuSpells';
import React, { useState, useRef, useEffect, useId } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/GaolerResourceBar.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import '../../../../styles/unified-context-menu.css';
import ClassTip from '../../../../components/hud/ClassTip';

import { INK, MUTED, PAGE, PAPER, PANEL, RULE, inked, washed } from '../../../../components/hud/calmBarPalette';
// ===== TENSION GAUGE =====
// Ten iron links weave along a machined rail — odd links stand vertical, even
// links lie flat, with the verticals' lower arcs repainted so the rings truly
// interlock. The first `VP` links burn with the spec's fire; spent links stay
// cold but outlined. Click any link to wind straight to it; the ratchet dial
// at the end of the rail opens the Tension Ledger.
const LINK_PITCH = 20;
const V_LINK_W = 18;
const V_LINK_H = 32;
const F_LINK_W = 36;
const F_LINK_H = 16;
const LINK_BAND = 5;
const CHAIN_CY = 32;
const CHAIN_START = 45; // link 1 (leftmost)

const roundedRectPath = (x, y, w, h, r) => {
    const rr = Math.max(0, Math.min(r, w / 2, h / 2));
    const f = (n) => Number(n.toFixed(2));
    return [
        `M ${f(x + rr)} ${f(y)}`,
        `H ${f(x + w - rr)}`,
        `A ${f(rr)} ${f(rr)} 0 0 1 ${f(x + w)} ${f(y + rr)}`,
        `V ${f(y + h - rr)}`,
        `A ${f(rr)} ${f(rr)} 0 0 1 ${f(x + w - rr)} ${f(y + h)}`,
        `H ${f(x + rr)}`,
        `A ${f(rr)} ${f(rr)} 0 0 1 ${f(x)} ${f(y + h - rr)}`,
        `V ${f(y + rr)}`,
        `A ${f(rr)} ${f(rr)} 0 0 1 ${f(x + rr)} ${f(y)}`,
        'Z'
    ].join(' ');
};

const ringPath = (cx, cy, ow, oh, band) => {
    const iw = ow - band * 2;
    const ih = oh - band * 2;
    const outer = roundedRectPath(cx - ow / 2, cy - oh / 2, ow, oh, Math.min(ow, oh) / 2);
    const inner = roundedRectPath(cx - iw / 2, cy - ih / 2, iw, ih, Math.min(iw, ih) / 2);
    return `${outer} ${inner}`;
};

const isVerticalLink = (id) => id % 2 === 1;
const linkW = (id) => (isVerticalLink(id) ? V_LINK_W : F_LINK_W);
const linkH = (id) => (isVerticalLink(id) ? V_LINK_H : F_LINK_H);
const linkCx = (id) => CHAIN_START + (id - 1) * LINK_PITCH;

// Ratchet dial silhouette on the end cap
const gearPath = (cx, cy, rOuter, rInner, teeth) => {
    const pts = [];
    const step = Math.PI / teeth;
    for (let i = 0; i < teeth * 2; i++) {
        const a = i * step - Math.PI / 2;
        const r = i % 2 === 0 ? rOuter : rInner;
        pts.push(`${(cx + Math.cos(a) * r).toFixed(2)} ${(cy + Math.sin(a) * r).toFixed(2)}`);
    }
    return `M ${pts.join(' L ')} Z`;
};

const RAIL_PATH = roundedRectPath(6, 15, 288, 34, 9);

const GaolerResourceBar = ({
    classResource = {},
    size = 'normal',
    config = {},
    context = 'hud',
    isOwner = true,
    onClassResourceUpdate = null
}) => {
    const vpFromProps = classResource?.current ?? 0;
    const [localVP, setLocalVP] = useState(vpFromProps);
    const characterClassName = useCharacterStore(state => state.class);
    const characterSpec = useCharacterStore(state => state.primarySpecialization);
    const lockedSpec = characterClassName === 'Warden' && characterSpec
        ? ({ 'vengeance-seeker': 'vengeanceSeeker', vengeance_seeker: 'vengeanceSeeker' }[characterSpec] || characterSpec)
        : null;
    const [selectedSpec, setSelectedSpec] = useState(lockedSpec || 'shadowblade');
    useEffect(() => { if (lockedSpec) setSelectedSpec(lockedSpec); }, [lockedSpec]);
    const [isInStealth, setIsInStealth] = useState(false);
    const [activeCages, setActiveCages] = useState(0);
    const [isInAvatar, setIsInAvatar] = useState(false);
    const [isMarked, setIsMarked] = useState(true);

    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);

    const barRef = useRef(null);
    const controlsMenuRef = useRef(null);
    const tooltipRef = useResourceBarTooltip(barRef, showTooltip, [localVP, selectedSpec, isInStealth, activeCages, isInAvatar]);

    // Namespace SVG def ids per instance so stacked PartyHUD frames never collide.
    const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
    const ids = {
        glow: `wardenGlow${uid}`,
        shadow: `wardenShadow${uid}`,
        rail: `wardenRail${uid}`,
        steel: `wardenSteel${uid}`,
        linkLit: `wardenLinkLit${uid}`,
        linkEmpty: `wardenLinkEmpty${uid}`,
        iron: `wardenIron${uid}`,
        core: `wardenCore${uid}`,
        hole: `wardenHole${uid}`,
        halo: `wardenHalo${uid}`,
        edgeLight: `wardenEdgeLight${uid}`,
        edgeDark: `wardenEdgeDark${uid}`,
        slabClip: `wardenSlabClip${uid}`,
        chainCap: `wardenChainCap${uid}`
    };

    const maxVP = 10;

    useEffect(() => {
        if (classResource?.current !== undefined && classResource.current !== localVP) {
            setLocalVP(classResource.current);
        }
    }, [classResource?.current]);

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

    // Specialization configurations
    const specConfigs = {
        shadowblade: {
            name: 'Iron Stalker',
            menuLabel: 'Iron Stalker',
            baseColor: '#1a0a2e',
            activeColor: '#581c87',
            glowColor: '#a855f7',
            icon: 'fa-user-ninja'
        },
        jailer: {
            name: 'Iron Jailer',
            menuLabel: 'Iron Jailer',
            baseColor: '#0f172a',
            activeColor: '#334155',
            glowColor: '#38bdf8',
            icon: 'fa-lock'
        },
        vengeanceSeeker: {
            name: 'Relentless Tormentor',
            menuLabel: 'Tormentor',
            baseColor: '#450a0a',
            activeColor: '#991b1b',
            glowColor: '#ef4444',
            icon: 'fa-crosshairs'
        },
        monolith: {
            name: 'Monolith',
            menuLabel: 'Monolith',
            baseColor: '#291e17',
            activeColor: '#78350f',
            glowColor: '#f59e0b',
            icon: 'fa-mountain'
        }
    };

    const currentSpec = specConfigs[selectedSpec] || specConfigs.shadowblade;

    const specBlurbs = {
        shadowblade: 'Slip into stealth and bleed the marked from the dark.',
        jailer: 'Cage up to two quarries in cold iron.',
        vengeanceSeeker: 'Torment your mark; at full tension, rise as the Avatar.',
        monolith: 'An immovable anchor — no active state, only pressure.'
    };

    // Spend thresholds — mirrored by the studs above the rail and the ledger's ready chip.
    // Common Warden spell costs; the studs are plain cost marks, not named abilities.
    const spendMarks = [{ cost: 2 }, { cost: 3 }, { cost: 4 }, { cost: 6 }, { cost: 10 }];

    // Chat logging
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
            ? `${characterName} forged ${absAmount} ${resourceName}`
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

    const handleVPChange = (delta) => {
        const newValue = Math.max(0, Math.min(maxVP, localVP + delta));
        const actualAmount = Math.abs(newValue - localVP);
        if (actualAmount > 0) {
            setLocalVP(newValue);
            logClassResourceChange('Tension', actualAmount, delta > 0, 'vengeancePoints');
            if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
        }
    };

    // Click a link to wind the chain straight to it.
    const handleVPSet = (value) => {
        const newValue = Math.max(0, Math.min(maxVP, value));
        const actualAmount = Math.abs(newValue - localVP);
        if (actualAmount === 0) return;
        setLocalVP(newValue);
        logClassResourceChange('Tension', actualAmount, newValue > localVP, 'vengeancePoints');
        if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
    };

    const handleKeyDown = (e) => {
        if (!isOwner) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); handleVPChange(1); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); handleVPChange(-1); }
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowControls(!showControls); }
        if (e.key === 'Escape') { setShowControls(false); setShowTooltip(false); }
    };

    // Get visual state
    const getVisualState = () => {
        if (selectedSpec === 'shadowblade' && isInStealth) return 'stealth';
        if (selectedSpec === 'jailer' && activeCages > 0) return 'caged';
        if (selectedSpec === 'vengeanceSeeker' && isInAvatar) return 'avatar';
        if (localVP === maxVP) return 'max';
        return 'normal';
    };

    const visualState = getVisualState();

    const chainLinks = Array.from({ length: 10 }, (_, k) => ({ id: k + 1 }));
    const verticalLinks = chainLinks.filter((link) => isVerticalLink(link.id));
    const flatLinks = chainLinks.filter((link) => !isVerticalLink(link.id));

    const linkStateClasses = (link) => {
        const isFilled = localVP >= link.id;
        const isCurrent = localVP === link.id && localVP > 0;
        return `${isFilled ? 'filled' : 'empty'}${isCurrent ? ' current' : ''}`;
    };

    // Banked fire inside the open core, oriented to the link
    const renderCoreFire = (link) => {
        const isFilled = localVP >= link.id;
        if (!isFilled) return null;
        const isCurrent = localVP === link.id && localVP > 0;
        const cx = linkCx(link.id);
        const vertical = isVerticalLink(link.id);
        return (
            <ellipse
                cx={cx} cy={CHAIN_CY}
                rx={vertical ? 3.2 : 8.2}
                ry={vertical ? 8.2 : 3.2}
                fill={PAGE}
                opacity={isCurrent ? 1 : 0.5}
            />
        );
    };

    const renderLinkArt = (link) => {
        const cx = linkCx(link.id);
        const isFilled = localVP >= link.id;
        const isCurrent = localVP === link.id && localVP > 0;
        const d = ringPath(cx, CHAIN_CY, linkW(link.id), linkH(link.id), LINK_BAND);
        return (
            <React.Fragment key={`art-${link.id}`}>
                {isCurrent && (
                    <ellipse
                        cx={cx} cy={CHAIN_CY} rx="28" ry="24"
                        fill={PAPER}
                        className="warden-halo"
                    />
                )}
                {renderCoreFire(link)}
                <path
                    d={d}
                    fillRule="evenodd"
                    fill={isFilled ? washed('#dde5f0', 0.2) : PAPER}
                    stroke={isFilled ? RULE : RULE}
                    strokeWidth={isFilled ? 1.3 : 1.2}
                />
                {isFilled && (
                    <path d={d} fill="none" stroke={inked(currentSpec.glowColor, 0.55)} strokeWidth="1" opacity="0.9" />
                )}
                <path d={d} fill="none" stroke={INK} strokeWidth="0.5" opacity={isFilled ? 0.35 : 0.16} />
            </React.Fragment>
        );
    };

    const renderLink = (link) => {
        const cx = linkCx(link.id);
        return (
            <g
                key={link.id}
                className={`warden-chain-link link-${link.id} ${linkStateClasses(link)}`}
                onClick={(e) => {
                    if (!isOwner) return;
                    e.stopPropagation();
                    handleVPSet(link.id);
                }}
                style={{ cursor: isOwner ? 'pointer' : 'default' }}
            >
                <title>{`Tension ${link.id}`}</title>
                {renderLinkArt(link)}
                <rect
                    x={cx - linkW(link.id) / 2 - 2}
                    y={CHAIN_CY - linkH(link.id) / 2 - 2}
                    width={linkW(link.id) + 4}
                    height={linkH(link.id) + 4}
                    fill="transparent"
                    pointerEvents="all"
                />
            </g>
        );
    };

    // Verticals' lower arcs repaint over the flat links so the rings interlock.
    const renderLinkCap = (link) => {
        const cx = linkCx(link.id);
        const isFilled = localVP >= link.id;
        const d = ringPath(cx, CHAIN_CY, linkW(link.id), linkH(link.id), LINK_BAND);
        return (
            <g key={`cap-${link.id}`} className="warden-chain-cap">
                <path
                    d={d}
                    fillRule="evenodd"
                    fill={isFilled ? washed('#dde5f0', 0.2) : PAPER}
                    stroke={isFilled ? RULE : RULE}
                    strokeWidth={isFilled ? 1.3 : 1.2}
                />
                {isFilled && (
                    <path d={d} fill="none" stroke={inked(currentSpec.glowColor, 0.55)} strokeWidth="1" opacity="0.9" />
                )}
            </g>
        );
    };

    // Lower-half hit targets for the verticals (drawn over the flats they cross)
    const renderCapHit = (link) => {
        const cx = linkCx(link.id);
        return (
            <rect
                key={`cap-hit-${link.id}`}
                className={`warden-cap-hit link-${link.id}-cap`}
                x={cx - linkW(link.id) / 2 - 2}
                y={CHAIN_CY}
                width={linkW(link.id) + 4}
                height={linkH(link.id) / 2 + 2}
                fill="transparent"
                pointerEvents="all"
                onClick={(e) => {
                    if (!isOwner) return;
                    e.stopPropagation();
                    handleVPSet(link.id);
                }}
                style={{ cursor: isOwner ? 'pointer' : 'default' }}
            >
                <title>{`Tension ${link.id}`}</title>
            </rect>
        );
    };


    return (
        <div className={`warden-resource-container ${size} context-${context}`}>
            <div className="resource-bar-row">
                <div
                    ref={barRef}
                    role="slider"
                    tabIndex={isOwner ? 0 : -1}
                    aria-label={`Tension, ${localVP} of ${maxVP} vengeance points, ${currentSpec.name}`}
                    aria-valuemin={0}
                    aria-valuemax={maxVP}
                    aria-valuenow={localVP}
                    className={`warden-resource-bar ${size} state-${visualState} clickable`}
                    onMouseEnter={() => { if (!showControls) setShowTooltip(true); }}
                    onMouseLeave={() => setShowTooltip(false)}
                    onFocus={() => { if (!showControls) setShowTooltip(false); }}
                    onKeyDown={handleKeyDown}
                    onClick={() => {
                        if (isOwner) {
                            setShowControls(!showControls);
                            if (showControls) setShowTooltip(false);
                        }
                    }}
                    style={{
                        '--spec-base-color': currentSpec.baseColor,
                        '--spec-active-color': currentSpec.activeColor,
                        '--spec-glow-color': currentSpec.glowColor
                    }}
                >
                    <svg
                        className="warden-chain-svg"
                        viewBox="0 0 300 64"
                        preserveAspectRatio="xMidYMid meet"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs />

                        {/* 1. MACHINED IRON RAIL */}
                        <g className="warden-rail">
                            <path
                                d={RAIL_PATH}
                                fill={PAPER}
                                stroke={RULE}
                                strokeWidth="1.3"
                            />
                        </g>
                        <g clipPath={`url(#${ids.slabClip})`} pointerEvents="none">
                            <rect x="0" y="15" width="300" height="8" fill={PAGE} />
                            <rect x="0" y="41" width="300" height="8" fill={PAPER} />
                            <path d="M 16 19.5 L 284 19.5" stroke={INK} strokeWidth="0.8" opacity="0.12" />
                            <path d="M 16 44.5 L 284 44.5" stroke={RULE} strokeWidth="0.9" opacity="0.5" />
                        </g>

                        {/* Rail bolts */}
                        {[[16, 20], [284, 20], [16, 44], [284, 44]].map(([x, y], i) => (
                            <g key={`bolt-${i}`} pointerEvents="none">
                                <circle cx={x} cy={y} r="1.5" fill={PANEL} stroke={RULE} strokeWidth="0.5" />
                                <circle cx={x - 0.4} cy={y - 0.4} r="0.45" fill={washed('#cbd5e1', 0.2)} opacity="0.5" />
                            </g>
                        ))}

                        {/* 2. BOLTED ANCHOR — the chain is shackled to the rail's eye */}
                        <g className="warden-anchor" pointerEvents="none">
                            <rect x="10" y="22" width="16" height="20" rx="3" fill={PANEL} stroke={RULE} strokeWidth="0.9" />
                            <circle cx="14" cy="26" r="1.3" fill={PAPER} stroke={RULE} strokeWidth="0.4" />
                            <circle cx="14" cy="38" r="1.3" fill={PAPER} stroke={RULE} strokeWidth="0.4" />
                            {/* Eyelet ring */}
                            <circle cx="28" cy="32" r="5.6" fill="none" stroke={MUTED} strokeWidth="3.2" />
                            <circle cx="28" cy="32" r="5.6" fill="none" stroke={RULE} strokeWidth="0.7" opacity="0.85" />
                        </g>

                        {/* 3. THE WOVEN CHAIN — verticals ride behind, flats lie over
                            them, then the verticals' lower arcs repaint so the rings
                            truly interlock. */}
                        <g className="warden-chain">
                            {verticalLinks.map((link) => renderLink(link))}
                            {flatLinks.map((link) => renderLink(link))}
                            <g clipPath={`url(#${ids.chainCap})`} pointerEvents="none">
                                {verticalLinks.map((link) => renderLinkCap(link))}
                            </g>
                            {verticalLinks.map((link) => renderCapHit(link))}
                        </g>

                        {/* Spend talismans: cost marks at 2 · 3 · 4 · 6 · 10 */}
                        {spendMarks.map(({ cost }) => {
                            const reached = localVP >= cost;
                            const cx = linkCx(cost);
                            return (
                                <g key={cost} className={`warden-spend-stud ${reached ? 'reached' : 'empty'}`} pointerEvents="none">
                                    <polygon
                                        points={`${cx},4.5 ${cx + 2.6},8 ${cx},11.5 ${cx - 2.6},8`}
                                        fill={reached ? washed(currentSpec.glowColor, 0.2) : PAPER}
                                        stroke={reached ? inked('#f8fafc', 0.6) : RULE}
                                        strokeWidth="0.7"
                                    >
                                        <title>{`Spend ${cost}`}</title>
                                    </polygon>
                                    <circle
                                        cx={cx} cy="8" r="0.9"
                                        fill={reached ? PAGE : PAPER}
                                        opacity={reached ? 0.95 : 0.8}
                                    />
                                </g>
                            );
                        })}

                        {/* 4. RATCHET DIAL — always-visible button that opens the Tension Ledger */}
                        <g
                            className={`warden-graft ${localVP >= maxVP ? 'straining' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (isOwner) {
                                    setShowControls(!showControls);
                                    if (showControls) setShowTooltip(false);
                                }
                            }}
                            style={{ cursor: isOwner ? 'pointer' : 'default' }}
                        >
                            <title>Tension {localVP}/{maxVP} — open the Tension Ledger</title>
                            <circle cx="272" cy="32" r="17" fill="transparent" pointerEvents="all" />
                            <circle cx="272" cy="32" r="14.5" fill={PANEL} stroke={RULE} strokeWidth="1.2" />
                            <circle cx="272" cy="32" r="11.4" fill={PAPER} stroke={RULE} strokeWidth="0.8" />
                            <path
                                className="warden-gear"
                                d={gearPath(272, 32, 9.4, 7.1, 8)}
                                fill={PANEL}
                                stroke={RULE}
                                strokeWidth="0.8"
                            />
                            {/* Soul-fire hub — brightens with banked tension */}
                            <circle
                                cx="272" cy="32" r="4.6"
                                fill={PAGE}
                                opacity={0.35 + (localVP / maxVP) * 0.65}
                            />
                            <circle cx="272" cy="32" r="4.6" fill="none" stroke={RULE} strokeWidth="1.1" />
                            {/* Blood rim */}
                            <circle
                                cx="272" cy="32" r="7.6"
                                fill="none" stroke={inked('#a51d1d', 0.6)} strokeWidth="1"
                                opacity={0.3 + (localVP / maxVP) * 0.7}
                            />
                            {/* Spec-fire ring riding the dial */}
                            <circle
                                cx="272" cy="32" r="12"
                                fill="none"
                                stroke={localVP >= maxVP ? inked(currentSpec.glowColor, 0.55) : inked(currentSpec.activeColor, 0.55)}
                                strokeWidth="1.1"
                                opacity={localVP > 0 ? 0.9 : 0.4}
                            />
                            {/* Strain arcs at full tension */}
                            {localVP >= maxVP && (
                                <g stroke={inked(currentSpec.glowColor, 0.55)} strokeWidth="1" strokeLinecap="round" fill="none">
                                    <path d="M 259.5 20.5 L 262.5 25 L 261 27" />
                                    <path d="M 284.5 43.5 L 281.5 39 L 283 37" />
                                </g>
                            )}
                        </g>

                        {/* 5. CAGE BARS — spectral bars drop while the jailer holds cages */}
                        {selectedSpec === 'jailer' && activeCages > 0 && (
                            <g pointerEvents="none">
                                {[linkCx(5), linkCx(7)].map((x) => (
                                    <g key={x}>
                                        <line x1={x} y1="8" x2={x} y2="56" stroke={inked(currentSpec.glowColor, 0.55)} strokeWidth="3" opacity="0.35" />
                                        <line x1={x} y1="8" x2={x} y2="56" stroke={inked('#e9edff', 0.6)} strokeWidth="1.1" opacity="0.85" />
                                    </g>
                                ))}
                            </g>
                        )}
                    </svg>
                </div>
            </div>

            {/* Warden Controls Menu - Tension Ledger */}
            {showControls && barRef.current && ReactDOM.createPortal(
                (() => {
                    const menuRect = barRef.current.getBoundingClientRect();
                    const hudContainer = barRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                    let hudTop = menuRect.top;
                    let hudBottom = menuRect.bottom;
                    if (hudContainer) {
                        const hudRect = hudContainer.getBoundingClientRect();
                        hudTop = hudRect.top;
                        hudBottom = hudRect.bottom;
                    }
                    const spaceBelow = window.innerHeight - hudBottom - 16;
                    const spaceAbove = hudTop - 16;
                    const placeAbove = spaceBelow < 380 && spaceAbove > spaceBelow;
                    return (
                        <div
                            ref={controlsMenuRef}
                            className={`unified-context-menu compact context-menu-container warden-menu-container class-resource-menu ${context === 'party' ? 'chronarch-party' : ''}`}
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
                                top: placeAbove ? hudTop - 8 : hudBottom + 8,
                                left: menuRect.left + (menuRect.width / 2),
                                transform: placeAbove ? 'translate(-50%, -100%)' : 'translateX(-50%)',
                                maxHeight: Math.max(220, placeAbove ? spaceAbove : spaceBelow),
                                overflowY: 'auto',
                                zIndex: 100000
                            }}
                        >
                            <div className="cm" style={{ '--cm-accent': '#5a6470', '--cm-accent-deep': '#2a3038', '--cm-wash': '#e4e6e6' }}>
                                <header className="cm-head">
                                    <span className={`cm-seal ${localVP === 0 ? 'is-quiet' : ''}`}>{localVP}</span>
                                    <div className="cm-titles">
                                        <div className="cm-eyebrow">Tension Ledger</div>
                                        <div className="cm-title">{localVP >= maxVP ? 'Chain Taut' : localVP >= 2 ? 'Links Banked' : 'Slack Chain'}</div>
                                        <div className="cm-sub">{localVP} of {maxVP} Tension banked</div>
                                    </div>
                                    <button type="button" className="cm-x" aria-label="Close the ledger" onClick={(e) => { e.stopPropagation(); setShowControls(false); }}>
                                        <i className="fas fa-times" aria-hidden="true"></i>
                                    </button>
                                </header>
                                <div className="cm-stepper">
                                    <button type="button" className="context-menu-button spend" onClick={(e) => { e.stopPropagation(); handleVPChange(-1); }} disabled={!isOwner || localVP <= 0} title="Spend 1 Tension" aria-label="Spend 1 Tension">
                                        <i className="fas fa-minus" aria-hidden="true"></i>
                                    </button>
                                    <div className="cm-stepper-read">
                                        <span className="cm-stepper-value">VP: {localVP}/{maxVP}</span>
                                        <div className="cm-meter" aria-hidden="true"><span style={{ width: `${maxVP ? (localVP / maxVP) * 100 : 0}%` }}></span></div>
                                    </div>
                                    <button type="button" className="context-menu-button gain" onClick={(e) => { e.stopPropagation(); handleVPChange(1); }} disabled={!isOwner || localVP >= maxVP} title="Bank 1 Tension" aria-label="Bank 1 Tension">
                                        <i className="fas fa-plus" aria-hidden="true"></i>
                                    </button>
                                </div>
                                <ClassMenuSpells className="Warden" resourceTypes={['tension']} resourceLabel="Tension" current={localVP} />
                                {lockedSpec ? (
                                    <div className="cm-burden is-quiet">
                                        <span className="cm-burden-label">Your path</span>
                                        <p className="cm-burden-text"><strong>{specConfigs[selectedSpec]?.name}.</strong> {specBlurbs[selectedSpec]}</p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="cm-section">Strain of the Graft</div>
                                        <div className="cm-row" role="group" aria-label="Specialization">
                                            {Object.entries(specConfigs).map(([key, spec]) => (
                                                <button
                                                    key={key}
                                                    type="button"
                                                    className={`context-menu-button ${selectedSpec === key ? 'active' : ''}`}
                                                    onClick={(e) => { e.stopPropagation(); setSelectedSpec(key); }}
                                                    title={`${spec.name}${specBlurbs[key] ? ` — ${specBlurbs[key]}` : ''}`}
                                                    aria-pressed={selectedSpec === key}
                                                >
                                                    <i className={`fas ${spec.icon}`} aria-hidden="true"></i>
                                                    <span>{spec.menuLabel || spec.name}</span>
                                                </button>
                                            ))}
                                        </div>
                                        <p className="cm-line is-quiet">{specBlurbs[selectedSpec]}</p>
                                    </>
                                )}
                                {selectedSpec === 'shadowblade' && (
                                    <div className="cm-row" style={{ '--cm-cols': 1 }}>
                                        <button type="button" className={`context-menu-button ${isInStealth ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setIsInStealth(!isInStealth); }} title="Toggle Stealth">
                                            <i className={`fas ${isInStealth ? 'fa-check-circle' : 'fa-circle'}`} aria-hidden="true"></i> Stealth
                                        </button>
                                    </div>
                                )}
                                {selectedSpec === 'jailer' && (
                                    <>
                                        <div className="cm-section">Cages: {activeCages}/2</div>
                                        <div className="cm-row" style={{ '--cm-cols': 4 }}>
                                            <button type="button" className="context-menu-button spend" onClick={(e) => { e.stopPropagation(); setActiveCages(Math.max(0, activeCages - 1)); }} title="Release a cage"><i className="fas fa-minus" aria-hidden="true"></i> 1</button>
                                            <button type="button" className="context-menu-button" onClick={(e) => { e.stopPropagation(); setActiveCages(0); }} title="Release every cage">Clear</button>
                                            <button type="button" className="context-menu-button" onClick={(e) => { e.stopPropagation(); setActiveCages(2); }} title="Slam both cages shut">Max</button>
                                            <button type="button" className="context-menu-button gain" onClick={(e) => { e.stopPropagation(); setActiveCages(Math.min(2, activeCages + 1)); }} title="Drop another cage"><i className="fas fa-plus" aria-hidden="true"></i> 1</button>
                                        </div>
                                    </>
                                )}
                                {selectedSpec === 'vengeanceSeeker' && (
                                    <div className="cm-row">
                                        <button type="button" className={`context-menu-button ${isInAvatar ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setIsInAvatar(!isInAvatar); }} title="Toggle Avatar">
                                            <i className={`fas ${isInAvatar ? 'fa-check-circle' : 'fa-circle'}`} aria-hidden="true"></i> Avatar
                                        </button>
                                        <button type="button" className={`context-menu-button ${isMarked ? 'active' : ''}`} onClick={(e) => { e.stopPropagation(); setIsMarked(!isMarked); }} title="Toggle Marked">
                                            <i className={`fas ${isMarked ? 'fa-check-circle' : 'fa-circle'}`} aria-hidden="true"></i> Marked
                                        </button>
                                    </div>
                                )}
                                <p className="cm-line is-quiet">Bank and spend Tension by casting your Warden abilities from the action bar or spellbook.</p>
                                <div className="cm-foot">
                                    <button
                                        type="button"
                                        className="context-menu-button quiet"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const resetAmount = localVP;
                                            setLocalVP(0);
                                            setShowControls(false);
                                            if (resetAmount > 0) {
                                                logClassResourceChange('Tension', resetAmount, false, 'vengeancePoints');
                                                if (onClassResourceUpdate) onClassResourceUpdate('current', 0);
                                            }
                                        }}
                                        title="Slack the chain back to 0 Tension"
                                    >
                                        <i className="fas fa-undo" aria-hidden="true"></i>Reset
                                    </button>
                                    <button
                                        type="button"
                                        className="context-menu-button"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const gainAmount = maxVP - localVP;
                                            setLocalVP(maxVP);
                                            setShowControls(false);
                                            if (gainAmount > 0) {
                                                logClassResourceChange('Tension', gainAmount, true, 'vengeancePoints');
                                                if (onClassResourceUpdate) onClassResourceUpdate('current', maxVP);
                                            }
                                        }}
                                        title="Wind the chain taut"
                                    >
                                        <i className="fas fa-arrow-up" aria-hidden="true"></i> Max
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })(),
                document.body
            )}

            {/* Simplified Tooltip */}
            {showTooltip && !showControls && ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip warden-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}>
                    <ClassTip
                        icon="fas fa-link"
                        tint="#f59e0b"
                        title="Tension"
                        subtitle="Warden Vengeance (VP)"
                        state={`${localVP}/${maxVP} VP`}
                        stateTone={localVP >= 6 ? 'good' : 'neutral'}
                        mechanic="Tension (VP) builds from attacks (+1, +2 vs your quarry), evasion (+1), crits (+2) and tethers; your Warden spells spend it. Each VP adds +5 ft pursuit speed."
                        status={[
                            localVP > 0 ? `${localVP} Tension banked for your spells.` : 'Empty — tether and press the attack to bank VP.',
                        ]}
                        usage={isOwner ? 'Click a link to wind straight to that Tension, or use − / + in the Tension Ledger. The ratchet dial opens the ledger.' : null}
                    />
                </div>,
                document.body
            )}
        </div>
    );
};

export default GaolerResourceBar;
