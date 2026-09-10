import React, { useState, useRef, useEffect, useId } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/GaolerResourceBar.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import '../../../../styles/unified-context-menu.css';
import ClassTip from '../../../../components/hud/ClassTip';

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
    const [selectedSpec, setSelectedSpec] = useState('shadowblade');
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
            name: 'Flayed Stalker',
            menuLabel: 'Flayed Stalker',
            baseColor: '#1a0a2e',
            activeColor: '#581c87',
            glowColor: '#a855f7',
            icon: 'fa-user-ninja'
        },
        jailer: {
            name: 'Iron Warden',
            menuLabel: 'Iron Warden',
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
    const spendMarks = [
        { cost: 2, label: 'Strike', icon: 'fa-bolt' },
        { cost: 3, label: 'Glaive', icon: 'fa-shuriken' },
        { cost: 4, label: 'Resolve', icon: 'fa-shield-halved' },
        { cost: 6, label: 'Cage', icon: 'fa-lock' },
        { cost: 10, label: 'Avatar', icon: 'fa-crown' }
    ];

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
                fill={`url(#${ids.hole})`}
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
                        fill={`url(#${ids.halo})`}
                        className="warden-halo"
                    />
                )}
                {renderCoreFire(link)}
                <path
                    d={d}
                    fillRule="evenodd"
                    fill={isFilled ? `url(#${ids.linkLit})` : `url(#${ids.linkEmpty})`}
                    stroke={isFilled ? '#0b0e13' : '#5f6b7d'}
                    strokeWidth={isFilled ? 1.3 : 1.2}
                />
                {isFilled && (
                    <path d={d} fill="none" stroke={currentSpec.glowColor} strokeWidth="1" opacity="0.9" />
                )}
                <path d={d} fill="none" stroke="#ffffff" strokeWidth="0.5" opacity={isFilled ? 0.35 : 0.16} />
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
                    fill={isFilled ? `url(#${ids.linkLit})` : `url(#${ids.linkEmpty})`}
                    stroke={isFilled ? '#0b0e13' : '#5f6b7d'}
                    strokeWidth={isFilled ? 1.3 : 1.2}
                />
                {isFilled && (
                    <path d={d} fill="none" stroke={currentSpec.glowColor} strokeWidth="1" opacity="0.9" />
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

    const readyLabel = localVP >= maxVP
        ? 'Avatar (10) ready'
        : localVP >= 6
            ? 'Cage (6) ready'
            : localVP >= 4
                ? 'Resolve (4) ready'
                : localVP >= 3
                    ? 'Glaive (3) ready'
                    : localVP >= 2
                        ? 'Strike (2) ready'
                        : 'Empty — press the attack';

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
                        <defs>
                            <filter id={ids.glow} x="-40%" y="-40%" width="180%" height="180%">
                                <feGaussianBlur stdDeviation="1.5" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            <filter id={ids.shadow} x="-6%" y="-14%" width="112%" height="128%">
                                <feDropShadow dx="0" dy="1.6" stdDeviation="1.6" floodColor="#000000" floodOpacity="0.8" />
                            </filter>

                            {/* Machined iron rail */}
                            <linearGradient id={ids.rail} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#39414f" />
                                <stop offset="30%" stopColor="#1b2029" />
                                <stop offset="100%" stopColor="#090c11" />
                            </linearGradient>

                            {/* Burnished steel lip */}
                            <linearGradient id={ids.steel} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8b98ad" />
                                <stop offset="45%" stopColor="#3d4757" />
                                <stop offset="100%" stopColor="#151b24" />
                            </linearGradient>

                            {/* Banked link — steel shell with the fire banked inside */}
                            <linearGradient id={ids.linkLit} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#dde5f0" stopOpacity="0.9" />
                                <stop offset="22%" stopColor="#8f9aab" />
                                <stop offset="48%" stopColor={currentSpec.glowColor} />
                                <stop offset="78%" stopColor={currentSpec.activeColor} />
                                <stop offset="100%" stopColor={currentSpec.baseColor} />
                            </linearGradient>

                            {/* Spent link — smoked-out iron with a readable steel rim */}
                            <linearGradient id={ids.linkEmpty} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#3d4653" />
                                <stop offset="45%" stopColor="#232a34" />
                                <stop offset="100%" stopColor="#10141a" />
                            </linearGradient>

                            {/* Ring hardware */}
                            <linearGradient id={ids.iron} x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#98a2b3" />
                                <stop offset="45%" stopColor="#3a404c" />
                                <stop offset="100%" stopColor="#0e1116" />
                            </linearGradient>

                            {/* Soul-fire heart of the ratchet dial */}
                            <radialGradient id={ids.core} cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.98" />
                                <stop offset="35%" stopColor={currentSpec.glowColor} stopOpacity="0.9" />
                                <stop offset="75%" stopColor={currentSpec.activeColor} stopOpacity="0.65" />
                                <stop offset="100%" stopColor={currentSpec.baseColor} stopOpacity="0" />
                            </radialGradient>

                            {/* Fire banked inside a banked link's open core */}
                            <radialGradient id={ids.hole} cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                                <stop offset="38%" stopColor={currentSpec.glowColor} stopOpacity="0.8" />
                                <stop offset="100%" stopColor={currentSpec.activeColor} stopOpacity="0" />
                            </radialGradient>

                            {/* Halo bloom behind the current link */}
                            <radialGradient id={ids.halo} cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor={currentSpec.glowColor} stopOpacity="0.55" />
                                <stop offset="55%" stopColor={currentSpec.glowColor} stopOpacity="0.14" />
                                <stop offset="100%" stopColor={currentSpec.glowColor} stopOpacity="0" />
                            </radialGradient>

                            {/* Rail bevel wash */}
                            <linearGradient id={ids.edgeLight} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
                                <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                            </linearGradient>
                            <linearGradient id={ids.edgeDark} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#000000" stopOpacity="0" />
                                <stop offset="100%" stopColor="#000000" stopOpacity="0.5" />
                            </linearGradient>

                            <clipPath id={ids.slabClip}>
                                <path d={RAIL_PATH} />
                            </clipPath>
                            {/* Lower arcs repaint over the flat links so the rings weave */}
                            <clipPath id={ids.chainCap}>
                                <rect x="0" y={CHAIN_CY} width="300" height="40" />
                            </clipPath>
                        </defs>

                        {/* 1. MACHINED IRON RAIL */}
                        <g className="warden-rail">
                            <path
                                d={RAIL_PATH}
                                fill={`url(#${ids.rail})`}
                                stroke={`url(#${ids.steel})`}
                                strokeWidth="1.3"
                                filter={`url(#${ids.shadow})`}
                            />
                        </g>
                        <g clipPath={`url(#${ids.slabClip})`} pointerEvents="none">
                            <rect x="0" y="15" width="300" height="8" fill={`url(#${ids.edgeLight})`} />
                            <rect x="0" y="41" width="300" height="8" fill={`url(#${ids.edgeDark})`} />
                            <path d="M 16 19.5 L 284 19.5" stroke="#ffffff" strokeWidth="0.8" opacity="0.12" />
                            <path d="M 16 44.5 L 284 44.5" stroke="#000000" strokeWidth="0.9" opacity="0.5" />
                        </g>

                        {/* Rail bolts */}
                        {[[16, 20], [284, 20], [16, 44], [284, 44]].map(([x, y], i) => (
                            <g key={`bolt-${i}`} pointerEvents="none">
                                <circle cx={x} cy={y} r="1.5" fill={`url(#${ids.iron})`} stroke="#08090c" strokeWidth="0.5" />
                                <circle cx={x - 0.4} cy={y - 0.4} r="0.45" fill="#cbd5e1" opacity="0.5" />
                            </g>
                        ))}

                        {/* 2. BOLTED ANCHOR — the chain is shackled to the rail's eye */}
                        <g className="warden-anchor" pointerEvents="none">
                            <rect x="10" y="22" width="16" height="20" rx="3" fill={`url(#${ids.iron})`} stroke="#05070a" strokeWidth="0.9" />
                            <circle cx="14" cy="26" r="1.3" fill="#0d1117" stroke="#000000" strokeWidth="0.4" />
                            <circle cx="14" cy="38" r="1.3" fill="#0d1117" stroke="#000000" strokeWidth="0.4" />
                            {/* Eyelet ring */}
                            <circle cx="28" cy="32" r="5.6" fill="none" stroke={`url(#${ids.iron})`} strokeWidth="3.2" />
                            <circle cx="28" cy="32" r="5.6" fill="none" stroke="#05070a" strokeWidth="0.7" opacity="0.85" />
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

                        {/* Spend talismans: Strike 2 · Glaive 3 · Resolve 4 · Cage 6 · Avatar 10 */}
                        {spendMarks.map(({ cost }) => {
                            const reached = localVP >= cost;
                            const cx = linkCx(cost);
                            return (
                                <g key={cost} className={`warden-spend-stud ${reached ? 'reached' : 'empty'}`} pointerEvents="none">
                                    <polygon
                                        points={`${cx},4.5 ${cx + 2.6},8 ${cx},11.5 ${cx - 2.6},8`}
                                        fill={reached ? currentSpec.glowColor : '#1a1f28'}
                                        stroke={reached ? '#f8fafc' : '#4a5462'}
                                        strokeWidth="0.7"
                                        filter={reached ? `url(#${ids.glow})` : undefined}
                                    >
                                        <title>{`Spend ${cost}`}</title>
                                    </polygon>
                                    <circle
                                        cx={cx} cy="8" r="0.9"
                                        fill={reached ? '#ffffff' : '#0a0d12'}
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
                            <circle cx="272" cy="32" r="14.5" fill={`url(#${ids.iron})`} stroke="#05070a" strokeWidth="1.2" />
                            <circle cx="272" cy="32" r="11.4" fill="#0b0f15" stroke="#04060a" strokeWidth="0.8" />
                            <path
                                className="warden-gear"
                                d={gearPath(272, 32, 9.4, 7.1, 8)}
                                fill={`url(#${ids.iron})`}
                                stroke="#04060a"
                                strokeWidth="0.8"
                            />
                            {/* Soul-fire hub — brightens with banked tension */}
                            <circle
                                cx="272" cy="32" r="4.6"
                                fill={`url(#${ids.core})`}
                                opacity={0.35 + (localVP / maxVP) * 0.65}
                                filter={localVP > 0 ? `url(#${ids.glow})` : undefined}
                            />
                            <circle cx="272" cy="32" r="4.6" fill="none" stroke="#05060a" strokeWidth="1.1" />
                            {/* Blood rim */}
                            <circle
                                cx="272" cy="32" r="7.6"
                                fill="none" stroke="#a51d1d" strokeWidth="1"
                                opacity={0.3 + (localVP / maxVP) * 0.7}
                                filter={localVP > 0 ? `url(#${ids.glow})` : undefined}
                            />
                            {/* Spec-fire ring riding the dial */}
                            <circle
                                cx="272" cy="32" r="12"
                                fill="none"
                                stroke={localVP >= maxVP ? currentSpec.glowColor : currentSpec.activeColor}
                                strokeWidth="1.1"
                                opacity={localVP > 0 ? 0.9 : 0.4}
                                filter={localVP > 0 ? `url(#${ids.glow})` : undefined}
                            />
                            {/* Strain arcs at full tension */}
                            {localVP >= maxVP && (
                                <g stroke={currentSpec.glowColor} strokeWidth="1" strokeLinecap="round" fill="none" filter={`url(#${ids.glow})`}>
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
                                        <line x1={x} y1="8" x2={x} y2="56" stroke={currentSpec.glowColor} strokeWidth="3" opacity="0.35" />
                                        <line x1={x} y1="8" x2={x} y2="56" stroke="#e9edff" strokeWidth="1.1" opacity="0.85" />
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
                            <div className="context-menu-main">
                                <div className="context-menu-section">
                                    <div className="context-menu-section-header warden-ledger-title">
                                        <i className="fas fa-link" aria-hidden="true"></i> Tension Ledger
                                        <span className="warden-ledger-subtitle">Warden Vengeance</span>
                                    </div>
                                    <div className="warden-menu-flavor">
                                        Cold-iron links banked through the graft-ring — {localVP}/{maxVP} Tension.
                                    </div>

                                    {/* The core control: big −/+ around the live counter */}
                                    <div className="warden-vp-panel">
                                        <button
                                            className="context-menu-button warden-vp-step"
                                            onClick={(e) => { e.stopPropagation(); handleVPChange(-1); }}
                                            disabled={!isOwner || localVP <= 0}
                                            title="Spend 1 Tension"
                                            aria-label="Spend 1 Tension"
                                        >
                                            <i className="fas fa-minus" aria-hidden="true"></i>
                                        </button>
                                        <div className="warden-vp-readout">
                                            <span className="warden-status-counter">VP: {localVP}/{maxVP}</span>
                                            <span className={`warden-status-ready ${localVP >= 2 ? 'ready' : ''}`}>
                                                {readyLabel}
                                            </span>
                                        </div>
                                        <button
                                            className="context-menu-button warden-vp-step"
                                            onClick={(e) => { e.stopPropagation(); handleVPChange(1); }}
                                            disabled={!isOwner || localVP >= maxVP}
                                            title="Bank 1 Tension"
                                            aria-label="Bank 1 Tension"
                                        >
                                            <i className="fas fa-plus" aria-hidden="true"></i>
                                        </button>
                                    </div>

                                    {/* Spend thresholds at a glance — mirrors the rail studs */}
                                    <div className="warden-threshold-grid">
                                        {spendMarks.map(({ cost, label, icon }) => {
                                            const reached = localVP >= cost;
                                            return (
                                                <span
                                                    key={cost}
                                                    className={`warden-threshold ${reached ? 'reached' : ''}`}
                                                    title={`${label} — costs ${cost} Tension`}
                                                >
                                                    <i className={`fas ${icon}`} aria-hidden="true"></i>
                                                    <span className="warden-threshold-label">{label}</span>
                                                    <b>{cost}</b>
                                                </span>
                                            );
                                        })}
                                    </div>

                                    {/* Spec: which strain the graft answers to */}
                                    <div className="context-menu-section-header warden-subheader">Strain of the Graft</div>
                                    <div className="warden-spec-grid">
                                        {Object.entries(specConfigs).map(([key, spec]) => {
                                            const isActiveSpec = selectedSpec === key;
                                            return (
                                                <button
                                                    key={key}
                                                    className={`context-menu-button warden-spec-button ${isActiveSpec ? 'active' : ''}`}
                                                    onClick={(e) => { e.stopPropagation(); setSelectedSpec(key); }}
                                                    title={`${spec.name}${specBlurbs[key] ? ` — ${specBlurbs[key]}` : ''}`}
                                                    aria-pressed={isActiveSpec}
                                                >
                                                    <i
                                                        className={`fas ${spec.icon} warden-spec-icon`}
                                                        style={{ color: spec.glowColor }}
                                                        aria-hidden="true"
                                                    />
                                                    <span className="warden-spec-name">{spec.menuLabel || spec.name}</span>
                                                    {isActiveSpec && <i className="fas fa-check warden-spec-check" aria-hidden="true"></i>}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="warden-menu-hint">{specBlurbs[selectedSpec]}</div>

                                    {/* Spec state controls */}
                                    {selectedSpec === 'shadowblade' && (
                                        <>
                                            <div className="context-menu-section-header warden-subheader">Stalker State</div>
                                            <div className="warden-state-controls">
                                                <button
                                                    className={`context-menu-button ${isInStealth ? 'active' : ''}`}
                                                    onClick={(e) => { e.stopPropagation(); setIsInStealth(!isInStealth); }}
                                                    title="Toggle Stealth — shadow the marked quarry"
                                                >
                                                    <i className={`fas ${isInStealth ? 'fa-check-circle' : 'fa-circle'}`}></i> Stealth
                                                </button>
                                            </div>
                                        </>
                                    )}
                                    {selectedSpec === 'jailer' && (
                                        <>
                                            <div className="context-menu-section-header warden-subheader">Cages: {activeCages}/2</div>
                                            <div className="warden-state-controls four-col">
                                                <button
                                                    className="context-menu-button spend"
                                                    onClick={(e) => { e.stopPropagation(); setActiveCages(Math.max(0, activeCages - 1)); }}
                                                    title="Release a cage"
                                                >
                                                    <i className="fas fa-minus"></i> -1
                                                </button>
                                                <button
                                                    className="context-menu-button"
                                                    onClick={(e) => { e.stopPropagation(); setActiveCages(0); }}
                                                    title="Release every cage"
                                                >
                                                    Clear
                                                </button>
                                                <button
                                                    className="context-menu-button gain"
                                                    onClick={(e) => { e.stopPropagation(); setActiveCages(2); }}
                                                    title="Slam both cages shut"
                                                >
                                                    Max
                                                </button>
                                                <button
                                                    className="context-menu-button gain"
                                                    onClick={(e) => { e.stopPropagation(); setActiveCages(Math.min(2, activeCages + 1)); }}
                                                    title="Drop another cage"
                                                >
                                                    <i className="fas fa-plus"></i> +1
                                                </button>
                                            </div>
                                        </>
                                    )}
                                    {selectedSpec === 'vengeanceSeeker' && (
                                        <>
                                            <div className="context-menu-section-header warden-subheader">Tormentor State</div>
                                            <div className="warden-state-controls">
                                                <button
                                                    className={`context-menu-button ${isInAvatar ? 'active' : ''}`}
                                                    onClick={(e) => { e.stopPropagation(); setIsInAvatar(!isInAvatar); }}
                                                    title="Toggle Avatar — the hunt ascends"
                                                >
                                                    <i className={`fas ${isInAvatar ? 'fa-check-circle' : 'fa-circle'}`}></i> Avatar
                                                </button>
                                                <button
                                                    className={`context-menu-button ${isMarked ? 'active' : ''}`}
                                                    onClick={(e) => { e.stopPropagation(); setIsMarked(!isMarked); }}
                                                    title="Toggle Marked — declare your quarry"
                                                >
                                                    <i className={`fas ${isMarked ? 'fa-check-circle' : 'fa-circle'}`}></i> Marked
                                                </button>
                                            </div>
                                        </>
                                    )}

                                    {/* The economy lives on the Warden's abilities, not here */}
                                    <div className="warden-menu-hint warden-menu-hint-tip">
                                        <i className="fas fa-book" aria-hidden="true"></i>
                                        {' '}Bank and spend Tension by casting your Warden abilities from the action bar or spellbook.
                                    </div>

                                    <div className="context-menu-main-separator" style={{ margin: '10px 0' }}></div>

                                    {/* GM overrides only — spending is ability-driven */}
                                    <div className="warden-quick-actions">
                                        <button
                                            className="context-menu-button"
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
                                            <i className="fas fa-undo"></i> Reset
                                        </button>
                                        <button
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
                                            title="Wind the chain taut to 10 Tension"
                                        >
                                            <i className="fas fa-arrow-up"></i> Max
                                        </button>
                                    </div>

                                    <button
                                        className="context-menu-button danger warden-close-button"
                                        onClick={(e) => { e.stopPropagation(); setShowControls(false); }}
                                        title="Close the ledger"
                                    >
                                        <i className="fas fa-times"></i> Close
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
                        mechanic="Bank Tension (VP) by attacking (+1, +2 vs your marked quarry), evading (+1), critting (+2), and by tethering hooked enemies that flee or strike your allies. Spend VP on Vengeful Strike (2), Whirling Glaive (3), Hunter's Resolve (4), Cage of Vengeance (6; 4 as Jailer), and Avatar of Vengeance (10); each VP grants +5 ft pursuit speed toward your mark."
                        status={[
                            localVP >= 10
                                ? `${localVP} banked — Avatar of Vengeance ready.`
                                : localVP >= 6
                                    ? `${localVP} banked — Cage of Vengeance (6) or Hunter's Resolve (4) ready.`
                                    : localVP >= 3
                                        ? `${localVP} banked — Whirling Glaive (3) or Vengeful Strike (2) ready.`
                                        : localVP >= 2
                                            ? `${localVP} banked — Vengeful Strike (2) ready.`
                                            : 'Empty — tether and press the attack to bank VP.',
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
