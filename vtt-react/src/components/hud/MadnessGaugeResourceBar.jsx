import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import ClassTip from './ClassTip';
import { INK, MUTED, PAGE, PAPER, RULE, ETCH, BRICK, washed } from './calmBarPalette';
import { useResourceBarTooltipPosition } from './useResourceBarTooltip';

const MILESTONE_MARKS = [6, 10, 15];

// Fracture inks by Madness value: violet deepening to crimson, then brick at Convulsion.
const FRACTURE_BANDS = [
    { max: 5, ink: '#5a3d7a' },
    { max: 9, ink: '#6b3f86' },
    { max: 14, ink: '#7d3a7e' },
    { max: 19, ink: '#8b2f42' },
    { max: 20, ink: BRICK }
];

const bandFor = (value) => FRACTURE_BANDS.find(b => value <= b.max) || FRACTURE_BANDS[0];

// Fracture geometry: cracks spread outward from the Silent Eye as Madness
// climbs. Values 1-10 fan left, 11-20 fan right; low values hug the eye.
const fractureGeom = (value) => {
    const side = value <= 10 ? -1 : 1;
    const k = value <= 10 ? value - 1 : value - 11; // 0 (near eye) .. 9 (frame edge)
    const x0 = 150 + side * (30 + k * 11.5);
    const y0 = 34 + ((k * 37) % 13 - 6);
    const x1 = x0 + side * 6.5;
    const y1 = y0 - 5 + (k % 3) * 3;
    const x2 = x1 + side * 4.5;
    const y2 = y1 + 7 - (k % 2) * 4;
    const spur = k % 3 === 0
        ? `M ${x1} ${y1} L ${x1 + side * 3} ${y1 - 4}`
        : '';
    return { x0, y0, d: `M ${x0} ${y0} L ${x1} ${y1} L ${x2} ${y2} ${spur}`, mx: (x0 + x2) / 2, my: (y0 + y2) / 2 };
};

const MadnessGaugeResourceBar = ({
  falseProphetState,
  setFalseProphetState,
  uiState,
  setUiState,
  finalClassResource,
  finalConfig,
  character,
  isOwner,
  onClassResourceUpdate,
  size,
  context,
  madnessBarRef,
  renderStatusFlavor,
  logClassResourceChange,
  getDangerLevel,
}) => {
  const {
      localMadness,
      showMadnessMenu
  } = falseProphetState;
  const {} = uiState;
  const setShowTooltip = (value) => setUiState(prev => ({ ...prev, showTooltip: value }));
  const setTooltipPosition = (value) => setUiState(prev => ({ ...prev, tooltipPosition: value }));
  const setTooltipPlacement = (value) => setUiState(prev => ({ ...prev, tooltipPlacement: value }));
  const setLocalMadness = (value) => setFalseProphetState(prev => ({ ...prev, localMadness: value }));
  const setShowMadnessMenu = (value) => setFalseProphetState(prev => ({ ...prev, showMadnessMenu: value }));
  const setFalseProphetHoverSection = (value) => setFalseProphetState(prev => ({ ...prev, falseProphetHoverSection: value }));

        // Live value first; local override only after the owner adjusts it.
        const currentMadness = localMadness ?? finalClassResource?.current ?? 0;
        const maxMadness = finalConfig.mechanics?.max ?? 20;
        const isConvulsion = currentMadness >= 20;
        const isDanger = currentMadness >= 15 && !isConvulsion;

        // Dedicated hover tooltip (shared ClassTip body). The parent's generic
        // ResourceTooltip is suppressed for dedicated bars, so this component
        // owns its own portal.
        const [showTip, setShowTip] = useState(false);
        const dangerLevel = getDangerLevel ? getDangerLevel(currentMadness) : { name: 'Stable' };
        const tooltipRef = useResourceBarTooltipPosition(
            madnessBarRef,
            showTip && !showMadnessMenu,
            [currentMadness, maxMadness]
        );


        // The Silent Eye: aperture widens as the mind fractures; the pupil
        // dissolves past 15 (Li Wei's blank white stare), veins surface.
        const eyeOpen = currentMadness === 0 ? 2.5 : 3 + (currentMadness / maxMadness) * 11;
        const pupilR = currentMadness >= 15 ? 0 : Math.max(0, 6.5 - currentMadness * 0.38);
        const eyeBand = bandFor(Math.max(1, currentMadness));

        // Adjustment functions
        const gainMadness = (amount) => {
            const newValue = Math.min(maxMadness, currentMadness + amount);
            const actualAmount = newValue - currentMadness;
            setLocalMadness(newValue);
            if (actualAmount > 0) {
                logClassResourceChange('Madness', actualAmount, true, 'madness');
                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
            }
        };

        const spendMadness = (amount) => {
            const newValue = Math.max(0, currentMadness - amount);
            const actualAmount = currentMadness - newValue;
            setLocalMadness(newValue);
            if (actualAmount > 0) {
                logClassResourceChange('Madness', actualAmount, false, 'madness');
                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
            }
        };

        const resetMadness = () => {
            const resetAmount = currentMadness;
            setLocalMadness(0);
            if (resetAmount > 0) {
                logClassResourceChange('Madness', resetAmount, false, 'madness');
                if (onClassResourceUpdate) onClassResourceUpdate('current', 0);
            }
        };

        const setToConvulsion = () => {
            const newValue = 20;
            const amount = Math.abs(newValue - currentMadness);
            setLocalMadness(newValue);
            if (amount > 0) {
                logClassResourceChange('Madness', amount, newValue > currentMadness, 'madness');
                if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
            }
        };

        const setMadnessTo = (value) => {
            const newValue = Math.max(0, Math.min(maxMadness, value));
            const amount = Math.abs(newValue - currentMadness);
            if (amount === 0) return;
            setLocalMadness(newValue);
            logClassResourceChange('Madness', amount, newValue > currentMadness, 'madness');
            if (onClassResourceUpdate) onClassResourceUpdate('current', newValue);
        };

        // Tooltip handlers
        const handleMadnessBarEnter = (e) => {
            setFalseProphetHoverSection('madness');
            const rect = madnessBarRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const spaceBelow = viewportHeight - rect.bottom;
            const spaceAbove = rect.top;

            setTooltipPosition({ x: rect.left + rect.width / 2, y: rect.top });
            setTooltipPlacement(spaceBelow > 400 ? 'below' : (spaceAbove > 400 ? 'above' : 'below'));
            setShowTooltip(true);
            setShowTip(true);
        };

        const handleMadnessBarLeave = () => {
            setFalseProphetHoverSection(null);
            setShowTooltip(false);
            setShowTip(false);
        };

        const handleBarClick = () => {
            setShowTooltip(false);
            setShowTip(false);
            setShowMadnessMenu(!showMadnessMenu);
        };

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); gainMadness(1); }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); spendMadness(1); }
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleBarClick(); }
            if (e.key === 'Escape') { setShowMadnessMenu(false); setShowTooltip(false); setShowTip(false); }
        };

        return (
            <div className={`class-resource-bar madness-gauge ${size} ${isConvulsion ? 'convulsion' : ''} ${isDanger ? 'danger' : ''}`}>
                <div className="madness-bar-wrapper">
                    <div
                        className="madness-ward"
                        ref={madnessBarRef}
                        role="slider"
                        tabIndex={0}
                        aria-label={`Madness, ${currentMadness} of ${maxMadness}`}
                        aria-valuemin={0}
                        aria-valuemax={maxMadness}
                        aria-valuenow={currentMadness}
                        onMouseEnter={handleMadnessBarEnter}
                        onMouseLeave={handleMadnessBarLeave}
                        onClick={handleBarClick}
                        onKeyDown={handleKeyDown}
                        style={{ cursor: 'pointer' }}
                    >
                        <svg
                            className="madness-ward-svg"
                            viewBox="0 0 300 64"
                            preserveAspectRatio="xMidYMid meet"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            {/* 1. Parchment page with a ledger frame (brick when the mind convulses) */}
                            <rect
                                className="fp-page"
                                x="2.5" y="7.5" width="295" height="49" rx="3"
                                fill={PAGE}
                                stroke={isConvulsion ? BRICK : isDanger ? '#8b2f42' : RULE}
                                strokeWidth={isConvulsion ? 1.5 : 1}
                            />
                            <rect x="5.5" y="10.5" width="289" height="43" rx="1.5" fill="none" stroke={isConvulsion ? BRICK : RULE} strokeWidth="0.6" opacity={isConvulsion ? 0.8 : 0.5} />

                            {/* 2. The track the fractures spread along */}
                            <line x1="13" y1="34" x2="287" y2="34" stroke={RULE} strokeWidth="1" strokeLinecap="round" />

                            {/* Milestones (6, 10, 15): small diamonds that ink in when reached */}
                            {MILESTONE_MARKS.map((mark) => {
                                const g = fractureGeom(mark);
                                const lit = currentMadness >= mark;
                                const top = Math.max(10, g.y0 - 13);
                                return (
                                    <polygon
                                        key={mark}
                                        points={`${g.x0},${top} ${g.x0 + 2.4},${top + 2.6} ${g.x0},${top + 5.2} ${g.x0 - 2.4},${top + 2.6}`}
                                        fill={lit ? washed(bandFor(mark).ink, 0.45) : PAPER}
                                        stroke={lit ? bandFor(mark).ink : RULE}
                                        strokeWidth="0.8"
                                    >
                                        <title>{`Milestone: Madness ${mark}`}</title>
                                    </polygon>
                                );
                            })}

                            {/* 3. Twenty whisper-fractures: faint etching, inked as madness spreads */}
                            {Array.from({ length: maxMadness }, (_, idx) => {
                                const value = idx + 1;
                                const isFilled = currentMadness >= value;
                                const isCurrent = currentMadness === value && currentMadness > 0;
                                const isDoom = value === 20;
                                const band = bandFor(value);
                                const g = fractureGeom(value);
                                return (
                                    <g
                                        key={value}
                                        className={`fp-fracture fracture-${value} ${isFilled ? 'filled' : 'empty'} ${isCurrent ? 'current' : ''}`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setMadnessTo(value);
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <title>{`Madness ${value}`}</title>
                                        <rect x={g.mx - 6} y={g.my - 9} width="12" height="18" fill="transparent" />
                                        {isCurrent && (
                                            <circle cx={g.mx} cy={g.my} r="7" fill="none" stroke={band.ink} strokeWidth="1" />
                                        )}
                                        <path
                                            d={g.d}
                                            className={isFilled ? 'fp-fracture-core' : 'fp-fracture-etch'}
                                            fill="none"
                                            stroke={isFilled ? band.ink : ETCH}
                                            strokeWidth={isFilled ? 1.5 : 1.1}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                        {isDoom && (
                                            <circle
                                                cx={g.mx}
                                                cy={g.my}
                                                r="9.5"
                                                fill="none"
                                                stroke={isConvulsion ? BRICK : RULE}
                                                strokeWidth="1"
                                                strokeDasharray="3 2.4"
                                            />
                                        )}
                                    </g>
                                );
                            })}

                            {/* 4. The Silent Eye: opens as the mind fractures; the pupil dissolves past 15 */}
                            <g
                                className={`fp-eye ${isConvulsion ? 'convulsing' : ''}`}
                                onClick={(e) => { e.stopPropagation(); handleBarClick(); }}
                                style={{ cursor: 'pointer' }}
                            >
                                <title>{`Madness ${currentMadness} of ${maxMadness}`}</title>
                                <path
                                    d="M 116,34 Q 150,14 184,34 Q 150,54 116,34 Z"
                                    fill={PAPER}
                                    stroke={isConvulsion ? BRICK : currentMadness > 0 ? eyeBand.ink : MUTED}
                                    strokeWidth="1.2"
                                    strokeLinejoin="round"
                                />
                                <ellipse
                                    cx="150" cy="34" rx="24" ry={Math.min(eyeOpen, 9.5)}
                                    fill={pupilR === 0 && currentMadness > 0 ? washed('#7d3a7e', 0.12) : PAGE}
                                    stroke={RULE}
                                    strokeWidth="0.6"
                                />
                                {pupilR > 0 && currentMadness > 0 && (
                                    <g>
                                        <circle cx="150" cy="34" r={pupilR + 1.2} fill="none" stroke={eyeBand.ink} strokeWidth="1" />
                                        <circle cx="150" cy="34" r={pupilR} fill={INK} />
                                    </g>
                                )}
                                {currentMadness >= 15 && (
                                    <g stroke={BRICK} strokeWidth="0.9" strokeLinecap="round">
                                        <polyline points="122,28 130,31 128,35" fill="none" />
                                        <polyline points="178,28 170,31 172,36" fill="none" />
                                        <polyline points="150,46 150,41 146,39" fill="none" />
                                    </g>
                                )}
                                {currentMadness === 0 && (
                                    <line x1="120" y1="34" x2="180" y2="34" stroke={MUTED} strokeWidth="1.2" strokeLinecap="round" />
                                )}
                            </g>
                        </svg>
                    </div>

                    {/* Adjustment Menu */}
                    {showMadnessMenu && madnessBarRef.current && ReactDOM.createPortal(
                        <div
                            className={`unified-context-menu compact context-menu-container falseprophet-menu-container class-resource-menu ${context === 'party' ? 'chronarch-party' : ''}`}
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            onMouseEnter={(e) => { e.stopPropagation(); setShowTooltip(false); }}
                            onMouseMove={(e) => e.stopPropagation()}
                            onMouseOver={(e) => e.stopPropagation()}
                            style={{
                                position: 'fixed',
                                top: (() => {
                                    if (!madnessBarRef.current) return '50%';
                                    const rect = madnessBarRef.current.getBoundingClientRect();
                                    let hudContainer = madnessBarRef.current.closest('.party-hud, .party-member-frame, .character-portrait-hud');
                                    let hudBottom = rect.bottom;
                                    if (hudContainer) {
                                        const hudRect = hudContainer.getBoundingClientRect();
                                        hudBottom = hudRect.bottom;
                                    }
                                    return hudBottom + 8;
                                })(),
                                left: (() => {
                                    if (!madnessBarRef.current) return '50%';
                                    const rect = madnessBarRef.current.getBoundingClientRect();
                                    return rect.left + (rect.width / 2);
                                })(),
                                transform: 'translateX(-50%)',
                                zIndex: 100000
                            }}
                        >
                            <div className="context-menu-main">
                                <div className="menu-title">Madness: {currentMadness}/{maxMadness}</div>
                                {renderStatusFlavor()}

                                <div style={{ fontSize: '0.8rem', marginBottom: '8px', lineHeight: 1.35 }}>
                                    <div><strong>Shadow damage:</strong> +{currentMadness}</div>
                                </div>

                                {/* Milestone legend */}
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px', fontSize: '0.68rem' }}>
                                    {[
                                        ['6 Veil', '#a78bfa'],
                                        ['9 Vision', '#d8b4fe'],
                                        ['10 +2d6', '#f0abfc'],
                                        ['12 Apocalypse', '#f0abfc'],
                                        ['15 Danger', '#fda4af'],
                                        ['20 Convulsion', '#ff6b6b']
                                    ].map(([label, color]) => (
                                        <span key={label} style={{ padding: '1px 6px', borderRadius: '3px', background: 'rgba(148,0,211,0.12)', border: `1px solid ${color}`, color }}> {label}</span>
                                    ))}
                                </div>

                                <div className="falseprophet-actions">
                                    <div className="falseprophet-action-row">
                                        <button onClick={() => gainMadness(1)} className="context-menu-button gain" title="Gain 1 Madness">
                                            <i className="fas fa-plus"></i>
                                            <span>+1</span>
                                        </button>
                                        <button onClick={() => gainMadness(3)} className="context-menu-button gain" title="Gain 1d4 Madness (3)">
                                            <i className="fas fa-dice-d6"></i>
                                            <span>+3</span>
                                        </button>
                                        <button onClick={() => gainMadness(4)} className="context-menu-button gain" title="Gain 1d6 Madness (4)">
                                            <i className="fas fa-dice-d6"></i>
                                            <span>+4</span>
                                        </button>
                                        <button onClick={() => gainMadness(5)} className="context-menu-button gain" title="Gain 1d8 Madness (5)">
                                            <i className="fas fa-dice-d8"></i>
                                            <span>+5</span>
                                        </button>
                                    </div>
                                    <div className="falseprophet-action-row">
                                        <button onClick={() => spendMadness(1)} className="context-menu-button spend" title="Spend 1 Madness">
                                            <i className="fas fa-minus"></i>
                                            <span>-1</span>
                                        </button>
                                        <button onClick={() => spendMadness(3)} className="context-menu-button spend" title="Spend 1d4 Madness (3)">
                                            <i className="fas fa-dice-d6"></i>
                                            <span>-3</span>
                                        </button>
                                        <button onClick={() => spendMadness(4)} className="context-menu-button spend" title="Spend 1d6 Madness (4)">
                                            <i className="fas fa-dice-d6"></i>
                                            <span>-4</span>
                                        </button>
                                        <button onClick={() => spendMadness(5)} className="context-menu-button spend" title="Spend 1d8 Madness (5)">
                                            <i className="fas fa-dice-d8"></i>
                                            <span>-5</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="falseprophet-quick-actions">
                                    <button
                                        onClick={() => { resetMadness(); setShowMadnessMenu(false); }}
                                        className="context-menu-button danger"
                                        title="Reset to 0"
                                    >
                                        <i className="fas fa-undo"></i>
                                    </button>
                                    <button
                                        onClick={setToConvulsion}
                                        className="context-menu-button danger"
                                        title="Set to 20 (Convulsion)"
                                    >
                                        <i className="fas fa-exclamation-triangle"></i>
                                    </button>
                                    <button
                                        onClick={() => setShowMadnessMenu(false)}
                                        className="context-menu-button"
                                        title="Close"
                                    >
                                        <i className="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        </div>,
                        document.body
                    )}

                    {/* Hover tooltip — shared ClassTip body */}
                    {showTip && !showMadnessMenu && ReactDOM.createPortal(
                        <div
                            ref={tooltipRef}
                            className="unified-resourcebar-tooltip pathfinder-tooltip false-prophet-tooltip"
                            style={{ position: 'fixed', left: 0, top: 0, opacity: 0, pointerEvents: 'none' }}
                        >
                            <ClassTip
                                icon="fas fa-eye"
                                tint={eyeBand.ink}
                                title="Madness"
                                subtitle="False Prophet — The Fanatical Choir"
                                state={`${currentMadness}/${maxMadness} · ${dangerLevel.name}`}
                                stateTone={isConvulsion ? 'critical' : isDanger ? 'bad' : currentMadness >= 10 ? 'warn' : 'neutral'}
                                mechanic="Spells and sermons generate Madness (1d4-2d6); some abilities spend it. Every point adds +1 damage to all your wyrd and blight spells."
                                status={[
                                    'Milestones: 6 Veil of Shadows · 9 Wyrd-touched Vision · 12 Apocalyptic Revelation · 20 Insanity Convulsion.',
                                    isConvulsion
                                        ? { text: 'CONVULSION: roll 1d6 (blight burst, stun 2 rounds, disadvantage 3 rounds, teleport + 4d6 wyrd, 30 ft fear, 6d6 wyrd), then Madness resets to 0.', tone: 'critical' }
                                        : isDanger
                                            ? { text: 'Danger zone (15+): spend Madness or stop generating before 20.', tone: 'bad' }
                                            : `${currentMadness} banked — +${currentMadness} damage to every wyrd and blight spell.`,
                                ]}
                                usage={isOwner ? 'Click a fracture to set Madness · Click the Eye for gain/spend controls · Arrow keys step 1.' : null}
                            />
                        </div>,
                        document.body
                    )}
                </div>
            </div>
        );
};

export default MadnessGaugeResourceBar;
