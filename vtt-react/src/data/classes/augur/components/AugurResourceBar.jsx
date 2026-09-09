import React, { useState, useRef, useEffect, useId } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/AugurResourceBar.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import ClassTip from '../../../../components/hud/ClassTip';
import '../../../../styles/unified-context-menu.css';

const AugurResourceBar = ({
    classResource = {},
    size = 'normal',
    config = {},
    context = 'hud',
    isOwner = true,
    onClassResourceUpdate = null
}) => {
    const benediction = classResource?.benediction ?? 0;
    const malediction = classResource?.malediction ?? 0;
    const maxBenediction = classResource?.maxBenediction ?? config?.resources?.benediction?.max ?? 10;
    const maxMalediction = classResource?.maxMalediction ?? config?.resources?.malediction?.max ?? 10;
    const omenDebt = classResource?.omenDebt ?? 0;
    const specialization = classResource?.specialization ?? 'auspex';

    const [showTooltip, setShowTooltip] = useState(false);
    const [showControls, setShowControls] = useState(false);
    const [hoveredFang, setHoveredFang] = useState(null);
    const barRef = useRef(null);
    const controlsMenuRef = useRef(null);
    const tooltipRef = useResourceBarTooltip(barRef, showTooltip, [benediction, malediction, specialization, omenDebt]);

    // Namespace SVG def ids per instance so stacked PartyHUD frames never collide.
    const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
    const ids = {
        sun: `augurSun${uid}`,
        void: `augurVoid${uid}`,
        shadow: `augurShadow${uid}`,
        brass: `augurBrass${uid}`,
        malBed: `augurMalBed${uid}`,
        benBed: `augurBenBed${uid}`,
        malFang: `augurMalFang${uid}`,
        benFang: `augurBenFang${uid}`
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

    const { addCombatNotification } = useChatStore();
    const isGMMode = useGameStore(state => state.isGMMode);
    const currentPlayerName = useCharacterStore(state => state.name || 'Player');

    const getActorName = () => {
        const actorName = currentPlayerName || 'Player';
        return isGMMode ? `${actorName} (GM)` : actorName;
    };

    const logChange = (resourceName, amount, isPositive) => {
        const absAmount = Math.abs(amount);
        const actorName = getActorName();
        const characterName = currentPlayerName || 'Character';
        const verb = isPositive ? 'gained' : 'spent';
        addCombatNotification({
            type: 'combat_resource',
            attacker: actorName,
            target: characterName,
            amount: absAmount,
            resourceType: 'classResource',
            isPositive,
            customMessage: `${characterName} ${verb} ${absAmount} ${resourceName}`
        });
    };

    const handleBenedictionChange = (delta) => {
        const newVal = Math.max(0, Math.min(maxBenediction, benediction + delta));
        const actual = Math.abs(newVal - benediction);
        if (actual > 0) {
            logChange('Benediction', actual, delta > 0);
            if (onClassResourceUpdate) onClassResourceUpdate('benediction', newVal);
        }
    };

    const handleMaledictionChange = (delta) => {
        const newVal = Math.max(0, Math.min(maxMalediction, malediction + delta));
        const actual = Math.abs(newVal - malediction);
        if (actual > 0) {
            logChange('Malediction', actual, delta > 0);
            if (onClassResourceUpdate) onClassResourceUpdate('malediction', newVal);
        }
    };

    const handlePoolSet = (pool, value) => {
        if (pool === 'benediction') {
            const newVal = Math.max(0, Math.min(maxBenediction, value));
            if (newVal !== benediction) {
                logChange('Benediction', Math.abs(newVal - benediction), newVal > benediction);
                if (onClassResourceUpdate) onClassResourceUpdate('benediction', newVal);
            }
        } else {
            const newVal = Math.max(0, Math.min(maxMalediction, value));
            if (newVal !== malediction) {
                logChange('Malediction', Math.abs(newVal - malediction), newVal > malediction);
                if (onClassResourceUpdate) onClassResourceUpdate('malediction', newVal);
            }
        }
    };

    const handleKeyDown = (e) => {
        if (!isOwner) return;
        if (e.key === 'ArrowLeft') { e.preventDefault(); handleMaledictionChange(-1); }
        if (e.key === 'ArrowRight') { e.preventDefault(); handleMaledictionChange(1); }
        if (e.key === 'ArrowDown') { e.preventDefault(); handleBenedictionChange(-1); }
        if (e.key === 'ArrowUp') { e.preventDefault(); handleBenedictionChange(1); }
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowControls(!showControls); }
        if (e.key === 'Escape') { setShowControls(false); setShowTooltip(false); }
    };

    // Marrow-fang shards: id 1 hugs the omphalos, id 10 bites the frame edge.
    // Splintered tips, uneven heights — gore, not glass.
    const fangPoints = (cx, baseY, h, w) =>
        `${cx - w / 2},${baseY} ${cx - w / 2 + 1.4},${baseY - h * 0.55} ` +
        `${cx - 0.6},${baseY - h} ${cx + 1.4},${baseY - h * 0.62} ${cx + w / 2},${baseY}`;

    const maledictionFangs = Array.from({ length: maxMalediction }, (_, i) => ({
        id: i + 1,
        cx: 124 - i * 10,
        h: 15 + ((i * 5) % 3) * 2.6
    }));

    const benedictionFangs = Array.from({ length: maxBenediction }, (_, i) => ({
        id: i + 1,
        cx: 176 + i * 10,
        h: 15 + ((i * 7 + 1) % 3) * 2.6
    }));

    const inDebt = omenDebt < 0;
    // The eye leans toward the heavier pool — the balance read at a glance.
    const lean = Math.max(-10, Math.min(10, benediction - malediction)) * 0.7;

    return (
        <div className={`augur-resource-wrapper ${size} context-${context}`}>
            <div className="resource-bar-row">
                <div
                    ref={barRef}
                    role="slider"
                    tabIndex={isOwner ? 0 : -1}
                    aria-label={`Dual omens: ${benediction} light, ${malediction} dark${inDebt ? `, debt ${omenDebt}` : ''}`}
                    aria-valuemin={0}
                    aria-valuemax={Math.max(maxBenediction, maxMalediction)}
                    aria-valuenow={benediction + malediction}
                    className={`augur-omen-bar ${size} clickable ${inDebt ? 'omen-debt' : ''}`}
                    onMouseEnter={() => { if (!showControls) setShowTooltip(true); }}
                    onMouseLeave={() => { setShowTooltip(false); setHoveredFang(null); }}
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
                        className="augur-astrolabe-svg"
                        viewBox="0 0 300 64"
                        preserveAspectRatio="xMidYMid meet"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <filter id={ids.sun} x="-40%" y="-40%" width="180%" height="180%">
                                <feGaussianBlur stdDeviation="2" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            <filter id={ids.void} x="-40%" y="-40%" width="180%" height="180%">
                                <feGaussianBlur stdDeviation="2" result="blur" />
                                <feMerge>
                                    <feMergeNode in="blur" />
                                    <feMergeNode in="SourceGraphic" />
                                </feMerge>
                            </filter>

                            <filter id={ids.shadow} x="-10%" y="-10%" width="120%" height="120%">
                                <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.85" />
                            </filter>

                            {/* Aged altar-stone chassis */}
                            <linearGradient id={ids.brass} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#2c2419" />
                                <stop offset="35%" stopColor="#1a150e" />
                                <stop offset="70%" stopColor="#120e09" />
                                <stop offset="100%" stopColor="#080604" />
                            </linearGradient>

                            {/* Wing channel beds */}
                            <linearGradient id={ids.malBed} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#09050d" />
                                <stop offset="100%" stopColor="#150a20" />
                            </linearGradient>

                            <linearGradient id={ids.benBed} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#0f0c05" />
                                <stop offset="100%" stopColor="#20180a" />
                            </linearGradient>

                            {/* Lit marrow-fang hearts */}
                            <linearGradient id={ids.malFang} x1="0" y1="1" x2="0" y2="0">
                                <stop offset="0%" stopColor="#581c87" />
                                <stop offset="60%" stopColor="#a855f7" />
                                <stop offset="100%" stopColor="#f0abfc" />
                            </linearGradient>

                            <linearGradient id={ids.benFang} x1="0" y1="1" x2="0" y2="0">
                                <stop offset="0%" stopColor="#92400e" />
                                <stop offset="60%" stopColor="#f59e0b" />
                                <stop offset="100%" stopColor="#fef9c3" />
                            </linearGradient>
                        </defs>

                        {/* 1. HARUSPEX ALTAR SLAB — full bleed */}
                        <g filter={`url(#${ids.shadow})`}>
                            <path
                                d="M 5 8 L 295 8 L 297 14 L 297 50 L 295 56 L 5 56 L 3 50 L 3 14 Z"
                                fill={`url(#${ids.brass})`}
                                stroke={inDebt ? '#ef4444' : '#b45309'}
                                strokeWidth={inDebt ? 2 : 1.5}
                            />
                            {/* Blood-groove seam along the top edge */}
                            <line
                                x1="12" y1="10.5" x2="288" y2="10.5"
                                stroke={inDebt ? '#ef4444' : '#b45309'}
                                strokeWidth="1"
                                strokeLinecap="round"
                                opacity={inDebt ? 0.9 : 0.45}
                            />
                        </g>

                        {/* Brass corner studs */}
                        {[[10, 14], [290, 14], [10, 50], [290, 50]].map(([cx, cy], i) => (
                            <g key={i}>
                                <circle cx={cx} cy={cy} r="2" fill="#0d0a07" />
                                <circle cx={cx} cy={cy} r="1.2" fill="#d97706" />
                                <circle cx={cx - 0.4} cy={cy - 0.4} r="0.45" fill="#fef08a" opacity="0.9" />
                            </g>
                        ))}

                        {/* 2. LEFT WING CHANNEL — dark omens */}
                        <rect
                            x="20" y="36" width="112" height="13" rx="4"
                            fill={`url(#${ids.malBed})`}
                            stroke="#581c87"
                            strokeWidth="1"
                        />

                        {/* 3. RIGHT WING CHANNEL — light omens */}
                        <rect
                            x="168" y="36" width="112" height="13" rx="4"
                            fill={`url(#${ids.benBed})`}
                            stroke="#b45309"
                            strokeWidth="1"
                        />

                        {/* 4. MALEDICTION MARROW-FANGS */}
                        {maledictionFangs.map((fang) => {
                            const isFilled = malediction >= fang.id;
                            const isCurrent = malediction === fang.id && malediction > 0;
                            const key = `mal-${fang.id}`;
                            return (
                                <g
                                    key={fang.id}
                                    className={`augur-omen-fang ${key} ${isFilled ? 'filled' : 'empty'} ${isCurrent ? 'current' : ''}`}
                                    onMouseEnter={() => setHoveredFang(key)}
                                    onMouseLeave={() => setHoveredFang(null)}
                                    onClick={(e) => {
                                        if (!isOwner) return;
                                        e.stopPropagation();
                                        handlePoolSet('malediction', fang.id);
                                    }}
                                    style={{ cursor: isOwner ? 'pointer' : 'default' }}
                                >
                                    <title>{`Dark omen ${fang.id}`}</title>
                                    {isCurrent && (
                                        <circle
                                            cx={fang.cx} cy={42 - fang.h / 2} r="8"
                                            fill="none" stroke="#d946ef" strokeWidth="1.2" opacity="0.8"
                                            className="augur-halo" filter={`url(#${ids.void})`}
                                        />
                                    )}
                                    <polygon
                                        points={fangPoints(fang.cx, 50, fang.h, 7.2)}
                                        fill={isFilled ? `url(#${ids.malFang})` : '#0d0714'}
                                        stroke={isFilled ? '#d946ef' : (hoveredFang === key ? '#7e22ce' : '#27103d')}
                                        strokeWidth={isFilled ? 1 : 0.9}
                                        strokeLinejoin="round"
                                        filter={isFilled ? `url(#${ids.void})` : undefined}
                                    />
                                    {isFilled && (
                                        <circle cx={fang.cx} cy={50 - fang.h * 0.35} r="1.1" fill="#ffffff" className="augur-fang-heart" />
                                    )}
                                </g>
                            );
                        })}

                        {/* 5. BENEDICTION MARROW-FANGS */}
                        {benedictionFangs.map((fang) => {
                            const isFilled = benediction >= fang.id;
                            const isCurrent = benediction === fang.id && benediction > 0;
                            const key = `ben-${fang.id}`;
                            return (
                                <g
                                    key={fang.id}
                                    className={`augur-omen-fang ${key} ${isFilled ? 'filled' : 'empty'} ${isCurrent ? 'current' : ''}`}
                                    onMouseEnter={() => setHoveredFang(key)}
                                    onMouseLeave={() => setHoveredFang(null)}
                                    onClick={(e) => {
                                        if (!isOwner) return;
                                        e.stopPropagation();
                                        handlePoolSet('benediction', fang.id);
                                    }}
                                    style={{ cursor: isOwner ? 'pointer' : 'default' }}
                                >
                                    <title>{`Light omen ${fang.id}`}</title>
                                    {isCurrent && (
                                        <circle
                                            cx={fang.cx} cy={42 - fang.h / 2} r="8"
                                            fill="none" stroke="#fbbf24" strokeWidth="1.2" opacity="0.8"
                                            className="augur-halo" filter={`url(#${ids.sun})`}
                                        />
                                    )}
                                    <polygon
                                        points={fangPoints(fang.cx, 50, fang.h, 7.2)}
                                        fill={isFilled ? `url(#${ids.benFang})` : '#140f07'}
                                        stroke={isFilled ? '#f59e0b' : (hoveredFang === key ? '#b45309' : '#3d2509')}
                                        strokeWidth={isFilled ? 1 : 0.9}
                                        strokeLinejoin="round"
                                        filter={isFilled ? `url(#${ids.sun})` : undefined}
                                    />
                                    {isFilled && (
                                        <circle cx={fang.cx} cy={50 - fang.h * 0.35} r="1.1" fill="#ffffff" className="augur-fang-heart" />
                                    )}
                                </g>
                            );
                        })}

                        {/* 6. CENTER OMPHALOS — split navel-stone of the reading */}
                        <g
                            className="augur-center-omphalos"
                            filter={`url(#${ids.shadow})`}
                            onClick={(e) => {
                                e.stopPropagation();
                                if (isOwner) {
                                    setShowControls(!showControls);
                                    if (showControls) setShowTooltip(false);
                                }
                            }}
                            style={{ cursor: isOwner ? 'pointer' : 'default' }}
                        >
                            <title>Dual omens — open controls</title>
                            {/* Brass ring */}
                            <circle
                                cx="150" cy="32" r="17"
                                fill="#17130b"
                                stroke={inDebt ? '#ef4444' : '#f59e0b'}
                                strokeWidth="1.8"
                            />
                            {/* Split disc: violet night / gold dawn */}
                            <path d="M 150,19 A 13,13 0 0,0 150,45 Z" fill="#150a20" stroke="#581c87" strokeWidth="0.8" />
                            <path d="M 150,19 A 13,13 0 0,1 150,45 Z" fill="#20180a" stroke="#b45309" strokeWidth="0.8" />
                            {/* Star-specks in the night half */}
                            <g fill="#c4b5fd">
                                <circle cx="143" cy="26" r="0.7" opacity="0.9" />
                                <circle cx="140" cy="36" r="0.6" opacity="0.7" />
                                <circle cx="145" cy="41" r="0.5" opacity="0.8" />
                            </g>
                            {/* Sacrificial blade divider */}
                            <line x1="150" y1="19" x2="150" y2="45" stroke="#d6c9a8" strokeWidth="1" opacity="0.85" />
                            {/* Debt cracks across the stone */}
                            {inDebt && (
                                <g stroke="#ef4444" strokeWidth="1" strokeLinecap="round" filter={`url(#${ids.sun})`}>
                                    <polyline points="139,22 144,29 141,35" fill="none" />
                                    <polyline points="161,24 156,31 159,38" fill="none" />
                                </g>
                            )}
                            {/* The reading eye — pupil leans to the heavier pool */}
                            <path
                                d="M 140,32 C 144,26.5 156,26.5 160,32 C 156,37.5 144,37.5 140,32 Z"
                                fill="none"
                                stroke={inDebt ? '#ef4444' : '#fef08a'}
                                strokeWidth="1.3"
                            />
                            <circle
                                cx={150 + lean} cy="32" r="2.6"
                                fill={inDebt ? '#ef4444' : '#f59e0b'}
                                filter={benediction + malediction > 0 ? `url(#${ids.sun})` : undefined}
                            />
                            <circle cx={150 + lean} cy="32" r="0.9" fill="#ffffff" />
                        </g>
                    </svg>
                </div>
            </div>

            {/* Shared ClassTip Tooltip */}
            {showTooltip && ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip augur-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}>
                    <ClassTip
                        icon="fas fa-eye"
                        tint="#f59e0b"
                        title="Astrolabe of Dual Omens"
                        subtitle="Augur Dual Omen Astrolabe"
                        state={`${benediction}/${maxBenediction} Light · ${malediction}/${maxMalediction} Dark`}
                        stateTone={inDebt ? 'bad' : 'neutral'}
                        mechanic="Every d20 within 60 ft births an omen: even → Benediction (force misses, ward allies), odd → Malediction (cripple, curse, rot). No blood nearby? Draw Blood (1d6 slashing + Bleed) to generate."
                        status={[
                            benediction > 0 ? `${benediction} radiant banked — force a miss or ward an ally.` : 'No radiant banked.',
                            malediction > 0 ? `${malediction} dark banked — curse something.` : 'No dark banked.',
                            inDebt ? `DEBT ${omenDebt}: unspent points rot into −1 saves each (cap −10). Spend down before rest!` : null,
                        ]}
                        usage={isOwner ? 'Click the stone for controls · Click a fang to set its pool · ←/→ dark, ↑/↓ light.' : null}
                    />
                </div>,
                document.body
            )}

            {/* Omen Controls Menu - Compact Unified Pathfinder Theme */}
            {showControls && ReactDOM.createPortal(
                <div
                    ref={controlsMenuRef}
                    className={`unified-context-menu compact context-menu-container augur-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
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
                        <div className="context-menu-section-header">
                            Dual Omen Astrolabe
                        </div>

                        {/* Dual Column Controls */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '8px' }}>
                            {/* Malediction (Dark) */}
                            <div>
                                <div style={{ color: '#d946ef', textAlign: 'center', fontSize: '11px', fontWeight: '700' }}>
                                    Dark ({malediction}/{maxMalediction})
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginTop: '4px' }}>
                                    <button className="context-menu-button spend" onClick={() => handleMaledictionChange(-1)}>
                                        <i className="fas fa-minus"></i>
                                    </button>
                                    <button className="context-menu-button gain" onClick={() => handleMaledictionChange(1)}>
                                        <i className="fas fa-plus"></i>
                                    </button>
                                </div>
                                <button
                                    className="context-menu-button"
                                    style={{ width: '100%', marginTop: '4px' }}
                                    onClick={() => { if (onClassResourceUpdate) onClassResourceUpdate('malediction', 0); }}
                                >
                                    Reset
                                </button>
                            </div>

                            {/* Benediction (Light) */}
                            <div>
                                <div style={{ color: '#f59e0b', textAlign: 'center', fontSize: '11px', fontWeight: '700' }}>
                                    Light ({benediction}/{maxBenediction})
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', marginTop: '4px' }}>
                                    <button className="context-menu-button spend" onClick={() => handleBenedictionChange(-1)}>
                                        <i className="fas fa-minus"></i>
                                    </button>
                                    <button className="context-menu-button gain" onClick={() => handleBenedictionChange(1)}>
                                        <i className="fas fa-plus"></i>
                                    </button>
                                </div>
                                <button
                                    className="context-menu-button"
                                    style={{ width: '100%', marginTop: '4px' }}
                                    onClick={() => { if (onClassResourceUpdate) onClassResourceUpdate('benediction', 0); }}
                                >
                                    Reset
                                </button>
                            </div>
                        </div>

                        <div className="context-menu-main-separator" style={{ margin: '8px 0' }}></div>

                        <button
                            className="context-menu-button danger"
                            onClick={() => setShowControls(false)}
                            style={{ width: '100%' }}
                        >
                            <i className="fas fa-times"></i> Close
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default AugurResourceBar;
