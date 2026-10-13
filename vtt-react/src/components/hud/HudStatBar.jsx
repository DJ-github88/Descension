import React, { useId } from 'react';
import './HudStatBar.css';

const LABELS = { health: 'HP', mana: 'MP', ap: 'AP' };
const TITLES = { health: 'Health', mana: 'Mana', ap: 'Action Points' };

/**
 * HudStatBar: a drawn (SVG) stat bar for creature targets.
 * Parchment-framed track, inked fill, optional temporary overflow, and
 * segment ticks for small pools like Action Points. No image assets.
 */
const HudStatBar = ({ kind = 'health', current = 0, max = 1, temp = 0, name = 'Creature' }) => {
    const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
    const safeMax = Math.max(1, Number(max) || 1);
    const value = Math.max(0, Math.min(safeMax, Number(current) || 0));
    const extra = Math.max(0, Number(temp) || 0);
    const pct = value / safeMax;
    const tempPct = Math.min(1 - pct, extra / safeMax);
    const W = 200;
    const H = 16;
    const fillW = W * pct;
    const segments = kind === 'ap' && safeMax > 1 && safeMax <= 12 ? safeMax : 0;
    const low = kind === 'health' && pct > 0 && pct <= 0.25;

    return (
        <div
            className={`hud-stat-bar hsb-${kind}${low ? ' is-low' : ''}${value === 0 ? ' is-empty' : ''}`}
            role="meter"
            aria-label={`${name} ${TITLES[kind] || 'Resource'}`}
            aria-valuemin={0}
            aria-valuemax={safeMax}
            aria-valuenow={value}
            title={`${TITLES[kind] || 'Resource'}: ${value} / ${safeMax}${extra ? ` (+${extra} temporary)` : ''}`}
        >
            <span className="hsb-chip" aria-hidden="true">{LABELS[kind] || ''}</span>
            <div className="hsb-track">
                <svg className="hsb-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
                    <defs>
                        <linearGradient id={`hsbFill${uid}`} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" className="hsb-stop-hi" />
                            <stop offset="0.55" className="hsb-stop-mid" />
                            <stop offset="1" className="hsb-stop-lo" />
                        </linearGradient>
                        <pattern id={`hsbHatch${uid}`} width="5" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                            <rect width="2" height="5" className="hsb-hatch" />
                        </pattern>
                    </defs>
                    <rect x="0" y="0" width={W} height={H} className="hsb-bed" />
                    {fillW > 0 && <rect x="0" y="0" width={fillW} height={H} fill={`url(#hsbFill${uid})`} className="hsb-fill" />}
                    {tempPct > 0 && <rect x={fillW} y="0" width={W * tempPct} height={H} fill={`url(#hsbHatch${uid})`} className="hsb-temp" />}
                    {fillW > 1 && <rect x="0" y="1.5" width={fillW} height="2" className="hsb-gloss" />}
                    {segments > 0 && Array.from({ length: segments - 1 }, (_, i) => {
                        const x = (W / segments) * (i + 1);
                        return <line key={i} x1={x} y1="0" x2={x} y2={H} className="hsb-tick" vectorEffect="non-scaling-stroke" />;
                    })}
                </svg>
                <span className="hsb-value">
                    {value}<span className="hsb-max">/{safeMax}</span>{extra > 0 && <span className="hsb-extra">+{extra}</span>}
                </span>
            </div>
        </div>
    );
};

export default HudStatBar;
