import ClassMenuSpells from '../../../../components/hud/ClassMenuSpells';
import React, { useState, useRef, useEffect, useId } from 'react';
import ReactDOM from 'react-dom';
import useChatStore from '../../../../store/chatStore';
import useGameStore from '../../../../store/gameStore';
import useCharacterStore from '../../../../store/characterStore';
import '../styles/AugurResourceBar.css';
import { useResourceBarTooltip } from '../../../../components/hud/useResourceBarTooltip';
import ClassTip from '../../../../components/hud/ClassTip';
import '../../../../styles/unified-context-menu.css';

import { PAGE, PAPER, RULE, inked, washed } from '../../../../components/hud/calmBarPalette';
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
                        <defs />

                        {/* 1. HARUSPEX ALTAR SLAB — full bleed */}
                        <g>
                            <path
                                d="M 5 8 L 295 8 L 297 14 L 297 50 L 295 56 L 5 56 L 3 50 L 3 14 Z"
                                fill={PAPER}
                                stroke={inDebt ? inked('#ef4444', 0.6) : inked('#b45309', 0.6)}
                                strokeWidth={inDebt ? 2 : 1.5}
                            />
                            {/* Blood-groove seam along the top edge */}
                            <line
                                x1="12" y1="10.5" x2="288" y2="10.5"
                                stroke={inDebt ? inked('#ef4444', 0.6) : inked('#b45309', 0.6)}
                                strokeWidth="1"
                                strokeLinecap="round"
                                opacity={inDebt ? 0.9 : 0.45}
                            />
                        </g>

                        {/* Brass corner studs */}
                        {[[10, 14], [290, 14], [10, 50], [290, 50]].map(([cx, cy], i) => (
                            <g key={i}>
                                <circle cx={cx} cy={cy} r="2" fill={PAPER} />
                                <circle cx={cx} cy={cy} r="1.2" fill={washed('#d97706', 0.2)} />
                                <circle cx={cx - 0.4} cy={cy - 0.4} r="0.45" fill={washed('#fef08a', 0.2)} opacity="0.9" />
                            </g>
                        ))}

                        {/* 2. LEFT WING CHANNEL — dark omens */}
                        <rect
                            x="20" y="36" width="112" height="13" rx="4"
                            fill={PAPER}
                            stroke={inked('#581c87', 0.6)}
                            strokeWidth="1"
                        />

                        {/* 3. RIGHT WING CHANNEL — light omens */}
                        <rect
                            x="168" y="36" width="112" height="13" rx="4"
                            fill={PAPER}
                            stroke={inked('#b45309', 0.6)}
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
                                            fill="none" stroke={inked('#d946ef', 0.6)} strokeWidth="1.2" opacity="0.8"
                                            className="augur-halo"
                                        />
                                    )}
                                    <polygon
                                        points={fangPoints(fang.cx, 50, fang.h, 7.2)}
                                        fill={isFilled ? washed('#a855f7', 0.2) : PAPER}
                                        stroke={isFilled ? inked('#d946ef', 0.6) : (hoveredFang === key ? inked('#7e22ce', 0.6) : RULE)}
                                        strokeWidth={isFilled ? 1 : 0.9}
                                        strokeLinejoin="round"
                                    />
                                    {isFilled && (
                                        <circle cx={fang.cx} cy={50 - fang.h * 0.35} r="1.1" fill={PAGE} className="augur-fang-heart" />
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
                                            fill="none" stroke={inked('#fbbf24', 0.6)} strokeWidth="1.2" opacity="0.8"
                                            className="augur-halo"
                                        />
                                    )}
                                    <polygon
                                        points={fangPoints(fang.cx, 50, fang.h, 7.2)}
                                        fill={isFilled ? washed('#f59e0b', 0.2) : PAPER}
                                        stroke={isFilled ? inked('#f59e0b', 0.6) : (hoveredFang === key ? inked('#b45309', 0.6) : RULE)}
                                        strokeWidth={isFilled ? 1 : 0.9}
                                        strokeLinejoin="round"
                                    />
                                    {isFilled && (
                                        <circle cx={fang.cx} cy={50 - fang.h * 0.35} r="1.1" fill={PAGE} className="augur-fang-heart" />
                                    )}
                                </g>
                            );
                        })}

                        {/* 6. CENTER OMPHALOS — split navel-stone of the reading */}
                        <g
                            className="augur-center-omphalos"
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
                                fill={PAPER}
                                stroke={inDebt ? inked('#ef4444', 0.6) : inked('#f59e0b', 0.6)}
                                strokeWidth="1.8"
                            />
                            {/* Split disc: violet night / gold dawn */}
                            <path d="M 150,19 A 13,13 0 0,0 150,45 Z" fill={PAPER} stroke={inked('#581c87', 0.6)} strokeWidth="0.8" />
                            <path d="M 150,19 A 13,13 0 0,1 150,45 Z" fill={PAPER} stroke={inked('#b45309', 0.6)} strokeWidth="0.8" />
                            {/* Star-specks in the night half */}
                            <g fill={washed('#c4b5fd', 0.2)}>
                                <circle cx="143" cy="26" r="0.7" opacity="0.9" />
                                <circle cx="140" cy="36" r="0.6" opacity="0.7" />
                                <circle cx="145" cy="41" r="0.5" opacity="0.8" />
                            </g>
                            {/* Sacrificial blade divider */}
                            <line x1="150" y1="19" x2="150" y2="45" stroke={inked('#d6c9a8', 0.6)} strokeWidth="1" opacity="0.85" />
                            {/* Debt cracks across the stone */}
                            {inDebt && (
                                <g stroke={inked('#ef4444', 0.6)} strokeWidth="1" strokeLinecap="round">
                                    <polyline points="139,22 144,29 141,35" fill="none" />
                                    <polyline points="161,24 156,31 159,38" fill="none" />
                                </g>
                            )}
                            {/* The reading eye — pupil leans to the heavier pool */}
                            <path
                                d="M 140,32 C 144,26.5 156,26.5 160,32 C 156,37.5 144,37.5 140,32 Z"
                                fill="none"
                                stroke={inDebt ? inked('#ef4444', 0.6) : inked('#fef08a', 0.6)}
                                strokeWidth="1.3"
                            />
                            <circle
                                cx={150 + lean} cy="32" r="2.6"
                                fill={inDebt ? washed('#ef4444', 0.2) : washed('#f59e0b', 0.2)}
                            />
                            <circle cx={150 + lean} cy="32" r="0.9" fill={PAGE} />
                        </g>
                    </svg>
                </div>
            </div>

            {/* Shared ClassTip Tooltip */}
            {showTooltip && !showControls && ReactDOM.createPortal(
                <div ref={tooltipRef} className="unified-resourcebar-tooltip pathfinder-tooltip augur-tooltip" style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}>
                    <ClassTip
                        icon="fas fa-eye"
                        tint="#f59e0b"
                        title="Astrolabe of Dual Omens"
                        subtitle="Augur Benediction & Malediction"
                        state={`${benediction}/${maxBenediction} Light · ${malediction}/${maxMalediction} Dark`}
                        stateTone={inDebt ? 'bad' : 'neutral'}
                        mechanic="Every d20 within 60 ft banks an omen: even = Benediction, odd = Malediction. With no fresh blood nearby, Blood Price (1d6 slashing, 3 rounds bleeding) grants +2 omens."
                        status={[
                            benediction > 0 ? `${benediction} Benediction banked — force a miss or ward an ally.` : 'No Benediction banked.',
                            malediction > 0 ? `${malediction} Malediction banked — curse or rot a foe.` : 'No Malediction banked.',
                            inDebt ? { text: `OMEN DEBT ${Math.abs(omenDebt)}: -1 to all saving throws per unused point (max -10). It only triggers at a long rest — short rests are safe.`, tone: 'bad' } : null,
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
                    className={`unified-context-menu compact context-menu-container augur-menu-container class-resource-menu ${context === 'party' ? 'chronarch-party' : ''}`}
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
                    <div className="cm" style={{ '--cm-accent': '#7a5a9a', '--cm-accent-deep': '#3f2a58', '--cm-wash': '#ebe2f0' }}>
                        <header className="cm-head">
                            <span className="cm-seal"><i className="fas fa-eye" aria-hidden="true"></i></span>
                            <div className="cm-titles">
                                <div className="cm-eyebrow">{benediction + malediction} omens banked</div>
                                <div className="cm-title">Dual Omen Astrolabe</div>
                                <div className="cm-sub">{benediction > malediction ? 'The stars lean toward light.' : malediction > benediction ? 'The stars lean toward shadow.' : 'The stars hang balanced.'}</div>
                            </div>
                            <button type="button" className="cm-x" aria-label="Close menu" onClick={() => setShowControls(false)}>
                                <i className="fas fa-times" aria-hidden="true"></i>
                            </button>
                        </header>
                        {inDebt && (
                            <div className="cm-burden is-severe">
                                <span className="cm-burden-label">Omen debt {Math.abs(omenDebt)}</span>
                                <p className="cm-burden-text">At your next long rest, each unused point costs -1 to all saving throws. Short rests are safe.</p>
                            </div>
                        )}
                        <div className="cm-duo">
                            <section className="cm-pane" style={{ '--pane-accent': '#6a3f86', '--pane-wash': '#e8dcef' }}>
                                <div className="cm-pane-title">Dark ({malediction}/{maxMalediction})</div>
                                <p className="cm-pane-text">Curse or rot a foe.</p>
                                <div className="cm-meter cm-pane-meter" aria-hidden="true"><span style={{ width: `${maxMalediction ? (malediction / maxMalediction) * 100 : 0}%` }}></span></div>
                                <div className="cm-row">
                                    <button type="button" className="context-menu-button spend" aria-label="Spend one Dark" onClick={() => handleMaledictionChange(-1)}><i className="fas fa-minus" aria-hidden="true"></i></button>
                                    <button type="button" className="context-menu-button gain" aria-label="Bank one Dark" onClick={() => handleMaledictionChange(1)}><i className="fas fa-plus" aria-hidden="true"></i></button>
                                </div>
                                <button type="button" className="cm-pane-reset" onClick={() => { if (onClassResourceUpdate) onClassResourceUpdate('malediction', 0); }}>Reset</button>
                            </section>
        <section className="cm-pane" style={{ '--pane-accent': '#b07d1e', '--pane-wash': '#f4e6c4' }}>
                                <div className="cm-pane-title">Light ({benediction}/{maxBenediction})</div>
                                <p className="cm-pane-text">Force a miss or ward an ally.</p>
                                <div className="cm-meter cm-pane-meter" aria-hidden="true"><span style={{ width: `${maxBenediction ? (benediction / maxBenediction) * 100 : 0}%` }}></span></div>
                                <div className="cm-row">
                                    <button type="button" className="context-menu-button spend" aria-label="Spend one Light" onClick={() => handleBenedictionChange(-1)}><i className="fas fa-minus" aria-hidden="true"></i></button>
                                    <button type="button" className="context-menu-button gain" aria-label="Bank one Light" onClick={() => handleBenedictionChange(1)}><i className="fas fa-plus" aria-hidden="true"></i></button>
                                </div>
                                <button type="button" className="cm-pane-reset" onClick={() => { if (onClassResourceUpdate) onClassResourceUpdate('benediction', 0); }}>Reset</button>
                            </section>
                                            </div>
                        <ClassMenuSpells className="Augur" resourceTypes={['benediction', 'malediction']} resourceLabel="omens" currentByType={{ benediction, malediction }} />
                        <details className="cm-notes">
                            <summary>How omens work</summary>
                            <p>Every d20 rolled within 60 ft banks an omen: an even roll for Light, an odd roll for Dark.</p>
                            <p>With no fresh blood nearby, pay the Blood Price (1d6 slashing, bleeding for 3 rounds) to bank two more.</p>
                        </details>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default AugurResourceBar;
