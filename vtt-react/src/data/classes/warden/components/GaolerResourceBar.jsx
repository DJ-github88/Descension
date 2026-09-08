import React, { useState, useRef, useEffect, useId } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/GaolerResourceBar.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import '../../../../styles/unified-context-menu.css';
import ClassTip from '../../../../components/hud/ClassTip';

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
        chassis: `wardenChassis${uid}`,
        steel: `wardenSteel${uid}`,
        link: `wardenLink${uid}`,
        iron: `wardenIron${uid}`,
        wound: `wardenWound${uid}`
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
            baseColor: '#1a0a2e',
            activeColor: '#581c87',
            glowColor: '#a855f7',
            icon: 'fa-user-ninja'
        },
        jailer: {
            name: 'Iron Warden',
            baseColor: '#0f172a',
            activeColor: '#334155',
            glowColor: '#38bdf8',
            icon: 'fa-lock'
        },
        vengeanceSeeker: {
            name: 'Relentless Tormentor',
            baseColor: '#450a0a',
            activeColor: '#991b1b',
            glowColor: '#ef4444',
            icon: 'fa-crosshairs'
        },
        monolith: {
            name: 'Monolith',
            baseColor: '#291e17',
            activeColor: '#78350f',
            glowColor: '#f59e0b',
            icon: 'fa-mountain'
        }
    };

    const currentSpec = specConfigs[selectedSpec] || specConfigs.shadowblade;

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

    // Graft-chain links: ids 1-5 wind left from the flesh-ring, 6-10 wind right.
    // Odd links stand vertical, even links lie flat — a true alternating chain.
    const chainLinks = [
        ...Array.from({ length: 5 }, (_, k) => ({ id: k + 1, cx: 126 - k * 23 })),
        ...Array.from({ length: 5 }, (_, k) => ({ id: k + 6, cx: 174 + k * 23 }))
    ];

    // Spend-mark studs: Strike (2) · Glaive (3) · Resolve (4) · Cage (6) · Avatar (10).
    const spendMarks = [2, 3, 4, 6, 10];
    const linkCx = (id) => id <= 5 ? 126 - (id - 1) * 23 : 174 + (id - 6) * 23;

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
                                <feGaussianBlur stdDeviation="2" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            <filter id={ids.shadow} x="-10%" y="-10%" width="120%" height="120%">
                                <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.85" />
                            </filter>

                            {/* Blackened cold-iron slab */}
                            <linearGradient id={ids.chassis} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#22262e" />
                                <stop offset="35%" stopColor="#14171d" />
                                <stop offset="70%" stopColor="#0d0f14" />
                                <stop offset="100%" stopColor="#06080a" />
                            </linearGradient>

                            {/* Forged steel edge */}
                            <linearGradient id={ids.steel} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#64748b" />
                                <stop offset="50%" stopColor="#334155" />
                                <stop offset="100%" stopColor="#1e293b" />
                            </linearGradient>

                            {/* Taut link metal in the oath metal */}
                            <linearGradient id={ids.link} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={currentSpec.glowColor} />
                                <stop offset="55%" stopColor={currentSpec.activeColor} />
                                <stop offset="100%" stopColor={currentSpec.baseColor} />
                            </linearGradient>

                            {/* Flesh-ring iron */}
                            <linearGradient id={ids.iron} x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0%" stopColor="#6b7280" />
                                <stop offset="45%" stopColor="#353b46" />
                                <stop offset="100%" stopColor="#101318" />
                            </linearGradient>

                            {/* Open wound bed */}
                            <radialGradient id={ids.wound} cx="50%" cy="45%" r="55%">
                                <stop offset="0%" stopColor="#5a1010" />
                                <stop offset="55%" stopColor="#2a0808" />
                                <stop offset="100%" stopColor="#0d0303" />
                            </radialGradient>
                        </defs>

                        {/* 1. BLACKENED COLD-IRON SLAB — full bleed */}
                        <g filter={`url(#${ids.shadow})`}>
                            <path
                                d="M 5 8 L 295 8 L 297 14 L 297 50 L 295 56 L 5 56 L 3 50 L 3 14 Z"
                                fill={`url(#${ids.chassis})`}
                                stroke={`url(#${ids.steel})`}
                                strokeWidth="1.5"
                            />
                            {/* Rust-pit blooms in the iron */}
                            <g fill="#3a2415" opacity="0.55" pointerEvents="none">
                                <ellipse cx="22" cy="14" rx="4" ry="1.8" />
                                <ellipse cx="278" cy="52" rx="4.5" ry="2" />
                                <ellipse cx="150" cy="57" rx="5" ry="1.6" />
                                <ellipse cx="62" cy="55" rx="3" ry="1.4" />
                                <ellipse cx="240" cy="11" rx="3.4" ry="1.5" />
                            </g>
                        </g>

                        {/* Iron corner brackets */}
                        {[
                            'M 3 20 L 3 14 L 5 12 L 5 8 L 11 8 L 11 11 L 8 11 L 8 14 L 6 16 L 6 20 Z',
                            'M 297 20 L 297 14 L 295 12 L 295 8 L 289 8 L 289 11 L 292 11 L 292 14 L 294 16 L 294 20 Z',
                            'M 3 44 L 3 50 L 5 52 L 5 56 L 11 56 L 11 53 L 8 53 L 8 50 L 6 48 L 6 44 Z',
                            'M 297 44 L 297 50 L 295 52 L 295 56 L 289 56 L 289 53 L 292 53 L 292 50 L 294 48 L 294 44 Z'
                        ].map((d, i) => (
                            <path key={i} d={d} fill={`url(#${ids.iron})`} stroke="#0a0a0c" strokeWidth="0.6" />
                        ))}

                        {/* 2. GRAFT-CHAIN — ten links winding out of the wound */}
                        {chainLinks.map((link) => {
                            const isFilled = localVP >= link.id;
                            const isCurrent = localVP === link.id && localVP > 0;
                            const vertical = link.id % 2 === 1;
                            const slack = isFilled ? 0 : (link.id % 2 === 1 ? -7 : 7);
                            const w = vertical ? 12 : 20;
                            const h = vertical ? 20 : 12;
                            return (
                                <g
                                    key={link.id}
                                    className={`warden-chain-link link-${link.id} ${isFilled ? 'filled' : 'empty'} ${isCurrent ? 'current' : ''}`}
                                    transform={`rotate(${slack} ${link.cx} 32)`}
                                    onClick={(e) => {
                                        if (!isOwner) return;
                                        e.stopPropagation();
                                        handleVPSet(link.id);
                                    }}
                                    style={{ cursor: isOwner ? 'pointer' : 'default' }}
                                >
                                    <title>{`Tension ${link.id}`}</title>
                                    {isCurrent && (
                                        <circle
                                            cx={link.cx} cy={32} r="12"
                                            fill="none" stroke={currentSpec.glowColor} strokeWidth="1.2" opacity="0.8"
                                            className="warden-halo" filter={`url(#${ids.glow})`}
                                        />
                                    )}
                                    {/* Hollow iron link */}
                                    <rect
                                        x={link.cx - w / 2} y={32 - h / 2} width={w} height={h} rx={Math.min(w, h) / 2}
                                        fill="none"
                                        stroke={isFilled ? `url(#${ids.link})` : '#3d2a1a'}
                                        strokeWidth={isFilled ? 3.4 : 3}
                                        filter={isFilled ? `url(#${ids.glow})` : undefined}
                                    />
                                    {isFilled && (
                                        <rect
                                            x={link.cx - w / 2 + 2.6} y={32 - h / 2 + 2.6}
                                            width={w - 5.2} height={h - 5.2} rx={Math.max(1, Math.min(w, h) / 2 - 2.6)}
                                            fill="none"
                                            stroke={currentSpec.glowColor}
                                            strokeWidth="1"
                                            opacity="0.85"
                                        />
                                    )}
                                </g>
                            );
                        })}

                        {/* Spend-mark studs: Strike 2 · Glaive 3 · Resolve 4 · Cage 6 · Avatar 10 */}
                        {spendMarks.map((mark) => {
                            const reached = localVP >= mark;
                            const cx = linkCx(mark);
                            return (
                                <polygon
                                    key={mark}
                                    points={`${cx},9.5 ${cx + 2},12 ${cx},14.5 ${cx - 2},12`}
                                    fill={reached ? currentSpec.glowColor : '#1c232e'}
                                    stroke={reached ? '#ffffff' : '#2a3340'}
                                    strokeWidth="0.6"
                                    opacity={reached ? 1 : 0.8}
                                    filter={reached ? `url(#${ids.glow})` : undefined}
                                >
                                    <title>{`Spend ${mark}`}</title>
                                </polygon>
                            );
                        })}

                        {/* 3. THE GRAFT — iron flesh-ring the chain is driven through */}
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
                            <title>Tension {localVP}/{maxVP} — open controls</title>
                            {/* Chain running behind the ring */}
                            <rect
                                x="126" y="27" width="48" height="10" rx="5"
                                fill="none" stroke="#241a12" strokeWidth="3"
                            />
                            {/* Wound bed */}
                            <circle cx="150" cy="32" r="10.5" fill={`url(#${ids.wound})`} />
                            {/* Blood rim — wells brighter as tension climbs */}
                            <circle
                                cx="150" cy="32" r="10.5"
                                fill="none" stroke="#8a1414" strokeWidth="1.4"
                                opacity={0.45 + (localVP / maxVP) * 0.55}
                                filter={localVP > 0 ? `url(#${ids.glow})` : undefined}
                            />
                            {/* Iron torus */}
                            <circle
                                cx="150" cy="32" r="14"
                                fill="none" stroke={`url(#${ids.iron})`} strokeWidth="4"
                            />
                            <circle
                                cx="150" cy="32" r="14"
                                fill="none"
                                stroke={localVP >= maxVP ? currentSpec.glowColor : currentSpec.activeColor}
                                strokeWidth="1"
                                opacity={localVP > 0 ? 0.9 : 0.4}
                                filter={localVP > 0 ? `url(#${ids.glow})` : undefined}
                            />
                            {/* Strain cracks at full tension */}
                            {localVP >= maxVP && (
                                <g stroke={currentSpec.glowColor} strokeWidth="1.1" strokeLinecap="round" filter={`url(#${ids.glow})`}>
                                    <line x1="139" y1="21" x2="144" y2="27" />
                                    <line x1="161" y1="43" x2="156" y2="37" />
                                </g>
                            )}
                        </g>

                        {/* 4. CAGE BARS — dropped while the jailer holds cages */}
                        {selectedSpec === 'jailer' && activeCages > 0 && (
                            <g stroke={`url(#${ids.iron})`} strokeWidth="2.4" strokeLinecap="round" opacity="0.95">
                                {[127, 173].map((x) => (
                                    <line key={x} x1={x} y1="10" x2={x} y2="54" />
                                ))}
                            </g>
                        )}
                    </svg>
                </div>
            </div>

            {/* Warden Controls Menu - Compact Unified Pathfinder Theme */}
            {showControls && barRef.current && ReactDOM.createPortal(
                <div
                    ref={controlsMenuRef}
                    className={`unified-context-menu compact context-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                    onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                    onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
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
                            <div className="context-menu-section-header">VP: {localVP}/{maxVP}</div>

                            {/* Gain Section */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                <button
                                    className="context-menu-button gain"
                                    onClick={(e) => { e.stopPropagation(); handleVPChange(1); }}
                                >
                                    <i className="fas fa-plus"></i> +1
                                </button>
                                <button
                                    className="context-menu-button gain"
                                    onClick={(e) => { e.stopPropagation(); if (isMarked) handleVPChange(2); }}
                                >
                                    <i className="fas fa-plus-circle"></i> +2
                                </button>
                            </div>

                            {/* Spend Section */}
                            <div className="context-menu-section-header" style={{ fontSize: '12px', marginTop: '12px', marginBottom: '8px' }}>Spend</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                <button
                                    className="context-menu-button spend"
                                    onClick={(e) => { e.stopPropagation(); handleVPChange(-1); }}
                                >
                                    <i className="fas fa-minus"></i> -1
                                </button>
                                <button
                                    className="context-menu-button spend"
                                    onClick={(e) => { e.stopPropagation(); handleVPChange(-2); }}
                                >
                                    <i className="fas fa-minus"></i> -2
                                </button>
                                <button
                                    className="context-menu-button spend"
                                    onClick={(e) => { e.stopPropagation(); handleVPChange(-3); }}
                                >
                                    <i className="fas fa-minus"></i> -3
                                </button>
                                <button
                                    className="context-menu-button spend"
                                    onClick={(e) => { e.stopPropagation(); handleVPChange(selectedSpec === 'jailer' ? -4 : -6); }}
                                >
                                    <i className="fas fa-minus"></i> {selectedSpec === 'jailer' ? '-4' : '-6'}
                                </button>
                            </div>

                            {/* Shadowblade State */}
                            {selectedSpec === 'shadowblade' && (
                                <>
                                    <div className="context-menu-section-header" style={{ fontSize: '12px', marginTop: '12px', marginBottom: '8px' }}>Shadowblade</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                        <button
                                            className={`context-menu-button ${isInStealth ? 'active' : ''}`}
                                            onClick={(e) => { e.stopPropagation(); setIsInStealth(!isInStealth); }}
                                        >
                                            <i className={`fas ${isInStealth ? 'fa-check-circle' : 'fa-circle'}`}></i>
                                            Stealth
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Jailer State */}
                            {selectedSpec === 'jailer' && (
                                <>
                                    <div className="context-menu-section-header" style={{ fontSize: '12px', marginTop: '12px', marginBottom: '8px' }}>Cages: {activeCages}/2</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                        <button
                                            className="context-menu-button spend"
                                            onClick={(e) => { e.stopPropagation(); setActiveCages(Math.max(0, activeCages - 1)); }}
                                        >
                                            <i className="fas fa-minus"></i> -1
                                        </button>
                                        <button
                                            className="context-menu-button"
                                            onClick={(e) => { e.stopPropagation(); setActiveCages(0); }}
                                        >
                                            Clear
                                        </button>
                                        <button
                                            className="context-menu-button gain"
                                            onClick={(e) => { e.stopPropagation(); setActiveCages(2); }}
                                        >
                                            Max
                                        </button>
                                        <button
                                            className="context-menu-button gain"
                                            onClick={(e) => { e.stopPropagation(); setActiveCages(Math.min(2, activeCages + 1)); }}
                                        >
                                            <i className="fas fa-plus"></i> +1
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Vengeance Seeker State */}
                            {selectedSpec === 'vengeanceSeeker' && (
                                <>
                                    <div className="context-menu-section-header" style={{ fontSize: '12px', marginTop: '12px', marginBottom: '8px' }}>Vengeance Seeker</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px', marginBottom: '8px' }}>
                                        <button
                                            className={`context-menu-button ${isInAvatar ? 'active' : ''}`}
                                            onClick={(e) => { e.stopPropagation(); setIsInAvatar(!isInAvatar); }}
                                        >
                                            <i className={`fas ${isInAvatar ? 'fa-check-circle' : 'fa-circle'}`}></i>
                                            Avatar
                                        </button>
                                        <button
                                            className={`context-menu-button ${isMarked ? 'active' : ''}`}
                                            onClick={(e) => { e.stopPropagation(); setIsMarked(!isMarked); }}
                                        >
                                            <i className={`fas ${isMarked ? 'fa-check-circle' : 'fa-circle'}`}></i>
                                            Marked
                                        </button>
                                    </div>
                                </>
                            )}

                            <div className="context-menu-main-separator" style={{ margin: '12px 0' }}></div>

                            {/* Quick Actions */}
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                                <button
                                    className="context-menu-button danger"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (localVP < maxVP) return;
                                        handleVPChange(-10);
                                        setIsInAvatar(true);
                                        setShowControls(false);
                                    }}
                                    disabled={localVP < maxVP}
                                    style={{ flex: 1, opacity: localVP < maxVP ? 0.5 : 1 }}
                                >
                                    <i className="fas fa-star"></i> Avatar
                                </button>
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
                                    style={{ flex: 1 }}
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
                                    style={{ flex: 1 }}
                                >
                                    <i className="fas fa-arrow-up"></i> Max
                                </button>
                            </div>

                            <button
                                className="context-menu-button danger"
                                onClick={(e) => { e.stopPropagation(); setShowControls(false); }}
                                style={{ width: '100%' }}
                            >
                                <i className="fas fa-times"></i> Close
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            {/* Simplified Tooltip */}
            {showTooltip && !showControls && ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip warden-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}>
                    <ClassTip
                        icon="fas fa-link"
                        tint="#f59e0b"
                        title="Vengeance (Tension)"
                        subtitle="Warden Vengeance Pool"
                        state={`${localVP}/${maxVP} VP`}
                        stateTone={localVP >= 6 ? 'good' : 'neutral'}
                        mechanic="Attacks (+1, +2 on marked), evasions (+1) and crits (+2) bank VP. +5 ft pursuit speed per VP toward your mark (max +50 ft)."
                        status={[
                            localVP >= 10
                                ? `${localVP} banked — Avatar of Vengeance ready.`
                                : localVP >= 6
                                    ? `${localVP} banked — Cage (6) or Hunter's Resolve (4) ready.`
                                    : localVP >= 2
                                        ? `${localVP} banked — Vengeful Strike (2) ready.`
                                        : 'Empty — press the attack to bank VP.',
                        ]}
                        usage="Spend 2 Strike · 3 Glaive · 4 Resolve · 6 Cage · 10 Avatar. Click a link to wind straight there; the ring opens controls."
                    />
                </div>,
                document.body
            )}
        </div>
    );
};

export default GaolerResourceBar;
