import React, { useId } from 'react';
import ReactDOM from 'react-dom';

const MILESTONE_MARKS = [6, 10, 15];

// Ignited-fracture heat bands by Madness value.
const FRACTURE_BANDS = [
    { max: 5, ring: '#6a0dad', fire: '#6a0dad', hot: '#a78bfa' },
    { max: 9, ring: '#9400D3', fire: '#9400D3', hot: '#d8b4fe' },
    { max: 14, ring: '#b026ff', fire: '#c026d3', hot: '#f0abfc' },
    { max: 19, ring: '#DC143C', fire: '#DC143C', hot: '#fda4af' },
    { max: 20, ring: '#ff2020', fire: '#ff2020', hot: '#ffffff' }
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

        // Namespace SVG def ids per instance so stacked PartyHUD frames never collide.
        const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
        const ids = {
            glow: `fpGlow${uid}`,
            shadow: `fpShadow${uid}`,
            basalt: `fpBasalt${uid}`,
            bed: `fpBed${uid}`,
            silver: `fpSilver${uid}`
        };

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
        };

        const handleMadnessBarLeave = () => {
            setFalseProphetHoverSection(null);
            setShowTooltip(false);
        };

        const handleBarClick = () => {
            setShowMadnessMenu(!showMadnessMenu);
        };

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { e.preventDefault(); gainMadness(1); }
            if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { e.preventDefault(); spendMadness(1); }
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleBarClick(); }
            if (e.key === 'Escape') { setShowMadnessMenu(false); setShowTooltip(false); }
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
                            <defs>
                                <filter id={ids.glow} x="-40%" y="-40%" width="180%" height="180%">
                                    <feGaussianBlur stdDeviation="2" result="blur" />
                                    <feMerge>
                                        <feMergeNode in="blur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>

                                <filter id={ids.shadow} x="-10%" y="-10%" width="120%" height="120%">
                                    <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.9" />
                                </filter>

                                {/* Void-glass slab */}
                                <linearGradient id={ids.basalt} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#1b1430" />
                                    <stop offset="40%" stopColor="#100b20" />
                                    <stop offset="100%" stopColor="#070510" />
                                </linearGradient>

                                {/* Cold channel bed */}
                                <linearGradient id={ids.bed} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#080614" />
                                    <stop offset="100%" stopColor="#150c28" />
                                </linearGradient>

                                {/* Dead-star silver */}
                                <linearGradient id={ids.silver} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#b8b0d0" />
                                    <stop offset="50%" stopColor="#6e6488" />
                                    <stop offset="100%" stopColor="#2a2438" />
                                </linearGradient>
                            </defs>

                            {/* 1. VOID-GLASS SLAB — full bleed */}
                            <g filter={`url(#${ids.shadow})`}>
                                <path
                                    d="M 5 8 L 295 8 L 297 14 L 297 50 L 295 56 L 5 56 L 3 50 L 3 14 Z"
                                    fill={`url(#${ids.basalt})`}
                                    stroke={isConvulsion ? '#ff2020' : isDanger ? '#8f1030' : '#3d2b5e'}
                                    strokeWidth={isConvulsion ? 2 : 1.5}
                                />
                                {/* Silence seam along the top edge — kindles violet as the mind fractures */}
                                <line
                                    x1="12" y1="10.5" x2="288" y2="10.5"
                                    stroke={currentMadness === 0 ? 'rgba(148, 0, 211, 0.18)' : '#a855f7'}
                                    strokeWidth="1"
                                    strokeLinecap="round"
                                    opacity={currentMadness === 0 ? 1 : 0.3 + (currentMadness / maxMadness) * 0.7}
                                />
                                {/* Dead-star specks in the glass */}
                                <g fill="#b8b0d0">
                                    <circle cx="30" cy="18" r="0.7" opacity="0.5" />
                                    <circle cx="70" cy="50" r="0.6" opacity="0.4" />
                                    <circle cx="232" cy="16" r="0.7" opacity="0.5" />
                                    <circle cx="272" cy="48" r="0.6" opacity="0.4" />
                                    <circle cx="150" cy="55" r="0.6" opacity="0.35" />
                                </g>
                            </g>

                            {/* Pale silver corner brackets */}
                            {[
                                'M 3 20 L 3 14 L 5 12 L 5 8 L 11 8 L 11 11 L 8 11 L 8 14 L 6 16 L 6 20 Z',
                                'M 297 20 L 297 14 L 295 12 L 295 8 L 289 8 L 289 11 L 292 11 L 292 14 L 294 16 L 294 20 Z',
                                'M 3 44 L 3 50 L 5 52 L 5 56 L 11 56 L 11 53 L 8 53 L 8 50 L 6 48 L 6 44 Z',
                                'M 297 44 L 297 50 L 295 52 L 295 56 L 289 56 L 289 53 L 292 53 L 292 50 L 294 48 L 294 44 Z'
                            ].map((d, i) => (
                                <path key={i} d={d} fill={`url(#${ids.silver})`} stroke="#0a0a0c" strokeWidth="0.6" />
                            ))}

                            {/* 2. CARVED CHANNEL — the groove the fractures rest in */}
                            <rect
                                x="13"
                                y="31"
                                width="274"
                                height="6.5"
                                rx="3.25"
                                fill={`url(#${ids.bed})`}
                                stroke="#241739"
                                strokeWidth="1"
                            />

                            {/* Milestone diamonds above the channel */}
                            {MILESTONE_MARKS.map((mark) => {
                                const g = fractureGeom(mark);
                                const lit = currentMadness >= mark;
                                return (
                                    <polygon
                                        key={mark}
                                        points={`${g.x0},${Math.max(8, g.y0 - 13)} ${g.x0 + 2.4},${Math.max(8, g.y0 - 13) + 2.6} ${g.x0},${Math.max(8, g.y0 - 13) + 5.2} ${g.x0 - 2.4},${Math.max(8, g.y0 - 13) + 2.6}`}
                                        fill={lit ? bandFor(mark).hot : '#241739'}
                                        stroke={lit ? bandFor(mark).ring : '#3d2b5e'}
                                        strokeWidth="0.8"
                                        filter={lit ? `url(#${ids.glow})` : undefined}
                                    />
                                );
                            })}

                            {/* 3. TWENTY WHISPER-FRACTURES */}
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
                                        {isCurrent && (
                                            <circle
                                                cx={g.mx}
                                                cy={g.my}
                                                r="7"
                                                fill="none"
                                                stroke={band.hot}
                                                strokeWidth="1.2"
                                                opacity="0.8"
                                                className="fp-halo"
                                                filter={`url(#${ids.glow})`}
                                            />
                                        )}
                                        {isFilled && (
                                            <path
                                                d={g.d}
                                                className="fp-fracture-fire"
                                                fill="none"
                                                stroke={band.fire}
                                                strokeWidth="3"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                opacity="0.7"
                                                filter={`url(#${ids.glow})`}
                                            />
                                        )}
                                        <path
                                            d={g.d}
                                            className={isFilled ? 'fp-fracture-core' : 'fp-fracture-etch'}
                                            fill="none"
                                            stroke={isFilled ? band.hot : '#4a3670'}
                                            strokeWidth={isFilled ? 1.4 : 1.1}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            opacity={isFilled ? 1 : 0.8}
                                            filter={isFilled ? `url(#${ids.glow})` : undefined}
                                        />
                                        {isFilled && <circle cx={g.mx} cy={g.my} r="1" fill="#ffffff" />}
                                        {/* Convulsion ring around the twentieth fracture */}
                                        {isDoom && (
                                            <circle
                                                cx={g.mx}
                                                cy={g.my}
                                                r="9.5"
                                                fill="none"
                                                stroke={isConvulsion ? '#ff2020' : '#5e1a2e'}
                                                strokeWidth="1.2"
                                                strokeDasharray="3 2.4"
                                                opacity={isConvulsion ? 1 : 0.7}
                                                filter={isConvulsion ? `url(#${ids.glow})` : undefined}
                                            />
                                        )}
                                    </g>
                                );
                            })}

                            {/* 4. THE SILENT EYE — Li Wei's blind stare */}
                            <g
                                className={`fp-eye ${isConvulsion ? 'convulsing' : ''}`}
                                onClick={(e) => { e.stopPropagation(); handleBarClick(); }}
                                style={{ cursor: 'pointer' }}
                            >
                                <title>{`Madness ${currentMadness} of ${maxMadness}`}</title>
                                <path
                                    d="M 116,34 Q 150,14 184,34 Q 150,54 116,34 Z"
                                    fill="#0b0616"
                                    stroke={isConvulsion ? '#ff2020' : '#8b7ab8'}
                                    strokeWidth="1.6"
                                    filter={currentMadness > 0 ? `url(#${ids.glow})` : undefined}
                                />
                                {/* Sclera — blank white as the pupil dissolves */}
                                <ellipse
                                    cx="150" cy="34" rx="24" ry={eyeOpen}
                                    fill={pupilR === 0 && currentMadness > 0 ? '#e8e4f2' : '#cfc8e4'}
                                />
                                {/* Void pupil with violet rim */}
                                {pupilR > 0 && (
                                    <g filter={`url(#${ids.glow})`}>
                                        <circle cx="150" cy="34" r={pupilR + 1.2} fill="none" stroke={eyeBand.ring} strokeWidth="1.2" />
                                        <circle cx="150" cy="34" r={pupilR} fill="#050308" />
                                    </g>
                                )}
                                {/* Blood-veins past 15 */}
                                {currentMadness >= 15 && (
                                    <g stroke="#c21430" strokeWidth="1" strokeLinecap="round" opacity="0.9">
                                        <polyline points="122,28 130,31 128,35" fill="none" />
                                        <polyline points="178,28 170,31 172,36" fill="none" />
                                        <polyline points="150,46 150,41 146,39" fill="none" />
                                    </g>
                                )}
                                {/* Lid line when shut */}
                                {currentMadness === 0 && (
                                    <line x1="120" y1="34" x2="180" y2="34" stroke="#8b7ab8" strokeWidth="1.4" strokeLinecap="round" />
                                )}
                            </g>
                        </svg>
                    </div>

                    {/* Adjustment Menu */}
                    {showMadnessMenu && madnessBarRef.current && ReactDOM.createPortal(
                        <div
                            className={`unified-context-menu compact context-menu-container falseprophet-menu-container ${context === 'party' ? 'chronarch-party' : ''}`}
                            onMouseDown={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            onClick={(e) => { e.stopPropagation(); if (e.nativeEvent && e.nativeEvent.stopImmediatePropagation) { e.nativeEvent.stopImmediatePropagation(); } }}
                            onMouseEnter={(e) => e.stopPropagation()}
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
                </div>
            </div>
        );
};

export default MadnessGaugeResourceBar;
