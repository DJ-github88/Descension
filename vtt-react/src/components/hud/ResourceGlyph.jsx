import React, { useId, useRef } from 'react';
import './resource-glyphs.css';

/**
 * ResourceGlyph — painted SVG resource icons (replace the old PNG icons).
 *
 *   health → heart-shaped potion flask with brass collar and corked neck
 *   mana   → cut arcane crystal in a brass claw setting
 *   ap     → feathered winged boot on a brass-rimmed shield
 *
 * Each glyph fills to the live ratio and moves through phases:
 *   max      full, soft breathing glow and a glint
 *   high     filled to the ratio
 *   low      first hairline crack (AP: wing starts to droop)
 *   critical more cracks, the fill flickers (AP: wing trembles)
 *   empty    shattered: missing shard, split crystal, broken wing, fragments
 * `surplus` (temporary resources) adds a coloured aura on top of any phase.
 */

export const getResourcePhase = (current, max) => {
    const safeMax = Math.max(1, Number(max) || 1);
    const value = Math.max(0, Number(current) || 0);
    if (value <= 0) return 'empty';
    if (value >= safeMax) return 'max';
    const ratio = value / safeMax;
    if (ratio >= 0.5) return 'high';
    if (ratio >= 0.25) return 'low';
    return 'critical';
};

/** Legacy four-state name kept for existing class hooks (vial-state-*, heart-state-*). */
export const legacyStateFor = (phase) => (phase === 'critical' ? 'low' : phase);

const INK = '#2c1f16';
const PAGE = '#f8f5ee';

const PALETTE = {
    health: { hi: '#ff7a7f', fill: '#c0283c', deep: '#5e0b19', glow: '#e0485a', aura: '#ff6a5a', foam: '#ffc2c6' },
    mana: { hi: '#bfe0ff', fill: '#3a74d6', deep: '#132a66', glow: '#4f8cf0', aura: '#6fb6ff', foam: '#d8ecff' },
    ap: { hi: '#ffe39a', fill: '#d6a23c', deep: '#7c5513', glow: '#e8bf5c', aura: '#ffd36a', foam: '#fff1c4' },
};

const clamp01 = (n) => Math.min(1, Math.max(0, n));

// Module counter keeps clip/gradient ids unique even across separate React roots.
let glyphCounter = 0;

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

const Glow = ({ id, color, children }) => (
    <g className="rg-glow" aria-hidden="true">
        <defs>
            <filter id={id} x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="6" />
            </filter>
        </defs>
        <g filter={`url(#${id})`} fill={color}>{children}</g>
    </g>
);

const Glint = ({ x, y, s = 1 }) => (
    <path
        className="rg-glint"
        d={`M${x} ${y - 8 * s} L${x + 1.5 * s} ${y - 1.5 * s} L${x + 8 * s} ${y} L${x + 1.5 * s} ${y + 1.5 * s} L${x} ${y + 8 * s} L${x - 1.5 * s} ${y + 1.5 * s} L${x - 8 * s} ${y} L${x - 1.5 * s} ${y - 1.5 * s} Z`}
        fill="#fffdf6"
    />
);

const Crack = ({ d, w = 1.5 }) => (
    <g className="rg-crack">
        <path d={d} fill="none" stroke="#ffffff" strokeWidth={w + 1.6} strokeLinecap="round" strokeLinejoin="round" opacity="0.45" />
        <path d={d} fill="none" stroke={INK} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </g>
);

/** Brass gradient used by collars, rims and settings. */
const BrassDefs = ({ id }) => (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#f6e2a0" />
        <stop offset="0.45" stopColor="#c9993f" />
        <stop offset="1" stopColor="#7a5418" />
    </linearGradient>
);

const Rivet = ({ x, y, r = 2.2 }) => (
    <g>
        <circle cx={x} cy={y} r={r} fill="#8a6220" stroke={INK} strokeWidth="0.8" />
        <circle cx={x - r * 0.3} cy={y - r * 0.3} r={r * 0.4} fill="#fbeec2" />
    </g>
);

const GroundShadow = ({ cx = 50, cy = 119, rx = 26 }) => (
    <ellipse cx={cx} cy={cy} rx={rx} ry="3.2" fill={INK} opacity="0.16" />
);

/* ------------------------------------------------------------------ */
/* Heart flask (health)                                                */
/* ------------------------------------------------------------------ */

const HEART = 'M50 113 C22 94 8 75 9 55 C10 37 23 28 36 30 C43 31 48 35 50 40 C52 35 57 31 64 30 C77 28 90 37 91 55 C92 75 78 94 50 113 Z';
const HEART_TOP = 30;
const HEART_BOTTOM = 113;
const BUBBLES = [[34, 92, 2.2], [58, 98, 1.6], [66, 80, 2.6], [42, 74, 1.4], [28, 70, 1.8], [72, 64, 1.5], [52, 58, 1.9]];

const HeartFlask = ({ ratio, phase, uid }) => {
    const c = PALETTE.health;
    const shattered = phase === 'empty';
    const liquidTop = HEART_TOP + (1 - ratio) * (HEART_BOTTOM - HEART_TOP);
    const swirlY = liquidTop + (HEART_BOTTOM - liquidTop) * 0.45;
    return (
        <>
            <GroundShadow />
            {phase === 'max' && <Glow id={`${uid}-g`} color={c.glow}><path d={HEART} /></Glow>}
            <defs>
                <clipPath id={`${uid}-clip`}><path d={HEART} /></clipPath>
                <radialGradient id={`${uid}-glass`} cx="0.36" cy="0.34" r="0.75">
                    <stop offset="0" stopColor="#ffffff" />
                    <stop offset="0.55" stopColor={shattered ? '#d9d6cf' : '#e9efec'} />
                    <stop offset="1" stopColor={shattered ? '#a9a49a' : '#b4c2bd'} />
                </radialGradient>
                <linearGradient id={`${uid}-liq`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor={c.hi} />
                    <stop offset="0.25" stopColor={c.fill} />
                    <stop offset="1" stopColor={c.deep} />
                </linearGradient>
                <radialGradient id={`${uid}-vig`} cx="0.42" cy="0.45" r="0.62">
                    <stop offset="0.55" stopColor="#000000" stopOpacity="0" />
                    <stop offset="1" stopColor="#1a0306" stopOpacity="0.55" />
                </radialGradient>
                <linearGradient id={`${uid}-cork`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#7b4b26" />
                    <stop offset="0.4" stopColor="#c99561" />
                    <stop offset="1" stopColor="#6c4020" />
                </linearGradient>
                <linearGradient id={`${uid}-neck`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor="#b9c6c1" />
                    <stop offset="0.35" stopColor="#ffffff" />
                    <stop offset="1" stopColor="#a8b6b1" />
                </linearGradient>
                <BrassDefs id={`${uid}-brass`} />
            </defs>

            {/* cork with grain */}
            <path d="M40 4 C40 2 42 1 44 1 H56 C58 1 60 2 60 4 V15 H40 Z" fill={`url(#${uid}-cork)`} stroke={INK} strokeWidth="2" />
            <path d="M44 5 V13 M49 3 V14 M54 5 V12" stroke="#5a3418" strokeWidth="0.9" opacity="0.6" />
            {/* glass neck */}
            <path d="M42 15 H58 V26 C58 28 60 30 63 31 L37 31 C40 30 42 28 42 26 Z" fill={`url(#${uid}-neck)`} stroke={INK} strokeWidth="2" strokeLinejoin="round" />
            {/* brass collar with rivets and twine */}
            <rect x="38" y="13" width="24" height="6" rx="2" fill={`url(#${uid}-brass)`} stroke={INK} strokeWidth="1.6" />
            <Rivet x={42} y={16} r={1.3} />
            <Rivet x={58} y={16} r={1.3} />
            <path d="M42 22 L58 25 M42 25 L58 22" stroke="#8b6a44" strokeWidth="1.1" opacity="0.8" />

            {/* glass body */}
            <path d={HEART} fill={`url(#${uid}-glass)`} />

            {/* liquid: depth gradient, inner swirl, bubbles, meniscus */}
            {!shattered && ratio > 0 && (
                <g clipPath={`url(#${uid}-clip)`} className="rg-fill">
                    <rect x="0" y={liquidTop} width="100" height={HEART_BOTTOM - liquidTop + 4} fill={`url(#${uid}-liq)`} />
                    <path
                        d={`M14 ${swirlY} C30 ${swirlY - 9} 44 ${swirlY + 10} 58 ${swirlY + 2} S80 ${swirlY - 8} 88 ${swirlY + 4}`}
                        fill="none" stroke={c.hi} strokeWidth="3" strokeLinecap="round" opacity="0.35"
                    />
                    <path
                        d={`M20 ${swirlY + 12} C36 ${swirlY + 4} 50 ${swirlY + 18} 70 ${swirlY + 12}`}
                        fill="none" stroke={c.hi} strokeWidth="1.6" strokeLinecap="round" opacity="0.25"
                    />
                    {BUBBLES.filter(([, y]) => y > liquidTop + 4).map(([x, y, r]) => (
                        <circle key={`${x}-${y}`} cx={x} cy={y} r={r} fill="none" stroke={c.foam} strokeWidth="0.9" opacity="0.75" />
                    ))}
                    <rect x="0" y={liquidTop} width="100" height={HEART_BOTTOM - liquidTop + 4} fill={`url(#${uid}-vig)`} />
                    <ellipse cx="50" cy={liquidTop} rx="46" ry="2.4" fill={c.foam} opacity="0.55" />
                </g>
            )}

            {/* glass shine and rim light */}
            {!shattered && (
                <>
                    <path d="M20 54 C19 43 26 36 35 36" fill="none" stroke="#ffffff" strokeWidth="4.5" strokeLinecap="round" opacity="0.8" />
                    <circle cx="20" cy="62" r="1.8" fill="#ffffff" opacity="0.75" />
                    <path d="M83 50 C85 64 78 80 64 94" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
                </>
            )}

            {/* shattered: punched-out shard, dried stain at the bottom */}
            {shattered && (
                <>
                    <g clipPath={`url(#${uid}-clip)`}>
                        <path d="M30 104 C40 100 60 100 70 104 L70 120 L30 120 Z" fill={c.deep} opacity="0.55" />
                    </g>
                    <path d="M62 44 L77 40 L73 57 L64 52 Z" fill={PAGE} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
                </>
            )}

            <path d={HEART} fill="none" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />

            {(phase === 'low' || phase === 'critical' || shattered) && <Crack d="M67 39 L70 47 L66 53 L71 61" />}
            {(phase === 'critical' || shattered) && <Crack d="M30 49 L36 59 L32 67 L38 77" />}
            {shattered && (
                <>
                    <Crack d="M50 61 L56 71 L50 81 L54 93" w={1.7} />
                    <Crack d="M64 52 L58 62" />
                    <g className="rg-shards" stroke={INK} strokeWidth="1.2" strokeLinejoin="round">
                        <path d="M28 116 L36 113 L34 120 Z" fill="#dfe5e2" />
                        <path d="M60 117 L68 114 L66 121 Z" fill="#cfd8d4" />
                        <path d="M76 111 L82 110 L79 116 Z" fill="#e6ece9" />
                        <circle cx="45" cy="120" r="1.6" fill={c.fill} stroke="none" />
                    </g>
                </>
            )}
            {phase === 'max' && <Glint x={30} y={45} s={0.9} />}
        </>
    );
};

/* ------------------------------------------------------------------ */
/* Arcane crystal (mana)                                               */
/* ------------------------------------------------------------------ */

const GEM = 'M50 4 L78 34 L72 98 L50 116 L28 98 L22 34 Z';
const GEM_LEFT = 'M50 4 L50 116 L28 98 L22 34 Z';
const GEM_RIGHT = 'M50 4 L78 34 L72 98 L50 116 Z';
const GEM_TOP = 4;
const GEM_BOTTOM = 116;

// Facets, each with a light value (0 = lit side, 1 = shadow side).
const FACETS = [
    ['M50 4 L22 34 L50 42 Z', 0.1],
    ['M50 4 L78 34 L50 42 Z', 0.45],
    ['M22 34 L50 42 L36 66 Z', 0.25],
    ['M22 34 L36 66 L28 98 Z', 0.4],
    ['M78 34 L50 42 L64 66 Z', 0.6],
    ['M78 34 L64 66 L72 98 Z', 0.85],
    ['M50 42 L36 66 L50 88 L64 66 Z', 0],
    ['M28 98 L36 66 L50 88 Z', 0.5],
    ['M28 98 L50 88 L50 116 Z', 0.65],
    ['M72 98 L64 66 L50 88 Z', 0.75],
    ['M72 98 L50 88 L50 116 Z', 0.95],
];

const mix = (a, b, t) => {
    const pa = a.match(/\w\w/g).map((h) => parseInt(h, 16));
    const pb = b.match(/\w\w/g).map((h) => parseInt(h, 16));
    return `#${pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, '0')).join('')}`;
};

const Facets = ({ light, dark }) => (
    <g>
        {FACETS.map(([d, t]) => (
            <path key={d} d={d} fill={mix(light, dark, t)} />
        ))}
    </g>
);

const FacetLines = ({ opacity = 0.55 }) => (
    <g fill="none" stroke={INK} strokeWidth="0.9" strokeLinejoin="round" opacity={opacity}>
        <path d="M22 34 L50 42 L78 34" />
        <path d="M50 4 L50 42 M50 88 L50 116" />
        <path d="M28 98 L50 88 L72 98" />
        <path d="M50 42 L36 66 L50 88 L64 66 Z" />
        <path d="M22 34 L36 66 L28 98 M78 34 L64 66 L72 98" />
    </g>
);

const BrassSetting = ({ uid }) => (
    <g>
        <path d="M22 86 L30 82 L33 104 L24 100 Z" fill={`url(#${uid}-brass)`} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M78 86 L70 82 L67 104 L76 100 Z" fill={`url(#${uid}-brass)`} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
        <path d="M36 108 Q50 124 64 108 L60 118 Q50 125 40 118 Z" fill={`url(#${uid}-brass)`} stroke={INK} strokeWidth="1.5" strokeLinejoin="round" />
        <Rivet x={26} y={92} r={1.4} />
        <Rivet x={74} y={92} r={1.4} />
    </g>
);

const ArcaneCrystal = ({ ratio, phase, uid }) => {
    const c = PALETTE.mana;
    const shattered = phase === 'empty';
    const level = GEM_TOP + (1 - ratio) * (GEM_BOTTOM - GEM_TOP);

    if (shattered) {
        return (
            <g className="rg-split">
                <GroundShadow rx={30} />
                <defs><BrassDefs id={`${uid}-brass`} /></defs>
                <g transform="translate(-6 4) rotate(-8 36 60)">
                    <clipPath id={`${uid}-l`}><path d={GEM_LEFT} /></clipPath>
                    <g clipPath={`url(#${uid}-l)`}><Facets light="#e3e7ee" dark="#7d8696" /></g>
                    <path d={GEM_LEFT} fill="none" stroke={INK} strokeWidth="2.3" strokeLinejoin="round" />
                    <path d="M22 34 L50 42 M36 66 L50 88 M22 34 L36 66 L28 98" fill="none" stroke={INK} strokeWidth="0.9" opacity="0.5" />
                </g>
                <g transform="translate(7 7) rotate(8 64 60)">
                    <clipPath id={`${uid}-r`}><path d={GEM_RIGHT} /></clipPath>
                    <g clipPath={`url(#${uid}-r)`}><Facets light="#e3e7ee" dark="#7d8696" /></g>
                    <path d={GEM_RIGHT} fill="none" stroke={INK} strokeWidth="2.3" strokeLinejoin="round" />
                    <path d="M50 42 L78 34 M64 66 L50 88 M78 34 L64 66 L72 98" fill="none" stroke={INK} strokeWidth="0.9" opacity="0.5" />
                </g>
                <BrassSetting uid={uid} />
                <g className="rg-shards" stroke={INK} strokeWidth="1.2" strokeLinejoin="round">
                    <path d="M42 121 L49 116 L51 122 Z" fill="#d6dce6" />
                    <path d="M60 119 L67 118 L63 123 Z" fill="#b8c1cf" />
                    <path d="M14 112 L19 109 L19 115 Z" fill="#c9d0db" />
                </g>
            </g>
        );
    }

    return (
        <>
            <GroundShadow rx={28} />
            {phase === 'max' && <Glow id={`${uid}-g`} color={c.glow}><path d={GEM} /></Glow>}
            <defs>
                <clipPath id={`${uid}-clip`}><path d={GEM} /></clipPath>
                <clipPath id={`${uid}-lvl`}><rect x="0" y={level} width="100" height={GEM_BOTTOM - level + 2} /></clipPath>
                <radialGradient id={`${uid}-core`} cx="0.5" cy="0.55" r="0.5">
                    <stop offset="0" stopColor="#ffffff" stopOpacity="0.9" />
                    <stop offset="0.35" stopColor={c.hi} stopOpacity="0.6" />
                    <stop offset="1" stopColor={c.fill} stopOpacity="0" />
                </radialGradient>
                <BrassDefs id={`${uid}-brass`} />
            </defs>

            {/* spent crystal: cloudy, grey-blue */}
            <g clipPath={`url(#${uid}-clip)`}>
                <Facets light="#e6ebf2" dark="#8f9bb0" />
            </g>

            {/* charged part: deep blue facets with a glowing core */}
            {ratio > 0 && (
                <g clipPath={`url(#${uid}-lvl)`} className="rg-fill">
                    <g clipPath={`url(#${uid}-clip)`}>
                        <Facets light="#9cc8ff" dark={c.deep} />
                        <ellipse cx="50" cy="66" rx="20" ry="30" fill={`url(#${uid}-core)`} />
                        <path d="M40 92 C44 80 56 76 52 62 C49 52 56 46 60 40" fill="none" stroke="#e6f2ff" strokeWidth="1.2" opacity="0.55" />
                        <line x1="0" y1={level} x2="100" y2={level} stroke={c.foam} strokeWidth="1.6" opacity="0.9" />
                    </g>
                </g>
            )}

            <FacetLines />
            {/* table highlight */}
            <path d="M28 36 L46 41 L35 62 Z" fill="#ffffff" opacity="0.35" />
            <path d="M30 37 L44 41" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" opacity="0.85" />
            <path d={GEM} fill="none" stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
            <BrassSetting uid={uid} />

            {(phase === 'low' || phase === 'critical') && <Crack d="M66 46 L62 56 L68 64 L63 74" />}
            {phase === 'critical' && <Crack d="M33 74 L40 82 L35 92" />}
            {phase === 'max' && (
                <>
                    <Glint x={64} y={24} s={0.9} />
                    <Glint x={36} y={80} s={0.55} />
                </>
            )}
        </>
    );
};

/* ------------------------------------------------------------------ */
/* Winged boot on a shield (action points)                             */
/* ------------------------------------------------------------------ */

const SHIELD = 'M14 17 C34 10 66 10 86 17 V60 C86 87 69 105 50 118 C31 105 14 87 14 60 Z';
const FIELD = 'M21 22 C38 17 62 17 79 22 V60 C79 83 65 98 50 109 C35 98 21 83 21 60 Z';
const FIELD_TOP = 18;
const FIELD_BOTTOM = 109;
const BOOT = 'M35 36 H56 V68 C64 70 74 74 78 80 C81 85 79 92 73 92 H33 C30 92 30 87 32 83 L35 74 Z';

const leaf = (bx, by, tx, ty, w) => {
    const dx = tx - bx;
    const dy = ty - by;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const mx = bx + dx * 0.55;
    const my = by + dy * 0.55;
    const f = (n) => n.toFixed(1);
    return `M${f(bx)} ${f(by)} Q${f(mx + nx * w)} ${f(my + ny * w)} ${f(tx)} ${f(ty)} Q${f(mx - nx * w * 0.5)} ${f(my - ny * w * 0.5)} ${f(bx)} ${f(by)} Z`;
};

// Feathers fan from the heel of the wing; back row first.
const FEATHERS = [
    [56, 46, 88, 6, 11],
    [56, 48, 94, 20, 10],
    [56, 50, 95, 34, 9],
    [56, 51, 88, 47, 8],
];
const FEATHERS_BROKEN = [
    [56, 49, 74, 32, 8],
    [56, 51, 80, 46, 7],
];

const WingedBoot = ({ ratio, phase, uid }) => {
    const c = PALETTE.ap;
    const shattered = phase === 'empty';
    const level = FIELD_TOP + (1 - ratio) * (FIELD_BOTTOM - FIELD_TOP);
    const droop = phase === 'critical' ? 'rotate(26 57 49)' : phase === 'low' ? 'rotate(12 57 49)' : undefined;
    const feathers = shattered ? FEATHERS_BROKEN : FEATHERS;

    return (
        <>
            <GroundShadow rx={30} />
            {phase === 'max' && <Glow id={`${uid}-g`} color={c.glow}><path d={SHIELD} /></Glow>}
            <defs>
                <clipPath id={`${uid}-clip`}><path d={FIELD} /></clipPath>
                <BrassDefs id={`${uid}-brass`} />
                <radialGradient id={`${uid}-field`} cx="0.4" cy="0.3" r="0.8">
                    <stop offset="0" stopColor={shattered ? '#e2ddd3' : '#fbf6ea'} />
                    <stop offset="1" stopColor={shattered ? '#b9b1a3' : '#d9ccb0'} />
                </radialGradient>
                <linearGradient id={`${uid}-charge`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor={c.hi} />
                    <stop offset="0.4" stopColor={c.fill} />
                    <stop offset="1" stopColor={c.deep} />
                </linearGradient>
                <linearGradient id={`${uid}-leather`} x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0" stopColor={shattered ? '#8c8478' : '#5a341b'} />
                    <stop offset="0.4" stopColor={shattered ? '#b3aa9c' : '#9a6234'} />
                    <stop offset="1" stopColor={shattered ? '#7c7468' : '#4a2a14'} />
                </linearGradient>
                <linearGradient id={`${uid}-feather`} x1="0" y1="1" x2="1" y2="0">
                    <stop offset="0" stopColor={shattered ? '#d6cfc2' : '#efe6d2'} />
                    <stop offset="1" stopColor="#ffffff" />
                </linearGradient>
            </defs>

            {/* brass rim and field */}
            <path d={SHIELD} fill={`url(#${uid}-brass)`} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
            <path d={FIELD} fill={`url(#${uid}-field)`} stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />
            {!shattered && ratio > 0 && (
                <g clipPath={`url(#${uid}-clip)`} className="rg-fill">
                    <rect x="0" y={level} width="100" height={FIELD_BOTTOM - level + 2} fill={`url(#${uid}-charge)`} opacity="0.8" />
                    <line x1="0" y1={level} x2="100" y2={level} stroke={c.foam} strokeWidth="1.6" opacity="0.9" />
                </g>
            )}
            <Rivet x={20} y={19} />
            <Rivet x={80} y={19} />
            <Rivet x={17} y={62} />
            <Rivet x={83} y={62} />
            <Rivet x={50} y={113} r={1.8} />

            {/* boot: leather shading, folded cuff, laces, brass buckle, sole */}
            <path d={BOOT} fill={`url(#${uid}-leather)`} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
            <path d="M33 36 H58 V45 H33 Z" fill={shattered ? '#a59d90' : '#b47a45'} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M40 50 L52 56 M52 50 L40 56 M40 58 L52 64 M52 58 L40 64" stroke={shattered ? '#e4ded2' : '#efe3c8'} strokeWidth="1.2" strokeLinecap="round" />
            <path d="M60 72 C68 74 74 77 76 82" fill="none" stroke={shattered ? '#d2cabd' : '#d29a63'} strokeWidth="1.4" opacity="0.8" />
            <rect x="36" y="68" width="9" height="7" rx="1.2" fill="none" stroke={`url(#${uid}-brass)`} strokeWidth="2" />
            <path d="M31 88 C31 92 33 94 36 94 H74 C78 94 81 92 80 88" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
            <path d="M33 85 H76" stroke="#2a170b" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />

            {/* wing: proud when full, droops as AP runs low, snaps when empty */}
            {/* mirrored so the wing sprouts from the heel (back of the boot, toe points right) */}
            <g transform="translate(35 0) scale(-0.8 1) translate(-56 0)">
            <g className="rg-wing" transform={droop}>
                {feathers.map(([bx, by, tx, ty, w]) => (
                    <g key={`${tx}-${ty}`}>
                        <path d={leaf(bx, by, tx, ty, w)} fill={`url(#${uid}-feather)`} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
                        <path d={`M${bx} ${by} L${bx + (tx - bx) * 0.85} ${by + (ty - by) * 0.85}`} stroke="#b9a98a" strokeWidth="0.8" />
                    </g>
                ))}
                {/* gilded coverts at the heel of the wing */}
                <path
                    d="M52 52 C55 40 64 34 74 33 C72 40 68 46 62 50 C66 50 70 50 72 49 C68 54 62 56 54 56 Z"
                    fill={shattered ? '#b9b1a3' : `url(#${uid}-brass)`}
                    stroke={INK} strokeWidth="1.6" strokeLinejoin="round"
                />
                {shattered && <path d="M76 30 L74 36 L79 37 L76 42" fill="none" stroke={INK} strokeWidth="1.4" strokeLinejoin="round" />}
            </g>
            </g>

            {(phase === 'critical' || shattered) && <Crack d="M27 30 L32 40 L28 50" />}
            {shattered && (
                <>
                    <Crack d="M50 96 L46 103 L51 108" w={1.7} />
                    <Crack d="M76 58 L70 64" />
                    <g className="rg-shards" stroke={INK} strokeWidth="1.2" strokeLinejoin="round">
                        <path d={leaf(84, 112, 96, 100, 3)} fill="#e9e2d4" />
                        <path d={leaf(88, 120, 99, 114, 2.5)} fill="#ddd5c6" />
                    </g>
                </>
            )}
            {phase === 'max' && <Glint x={30} y={28} s={0.8} />}
        </>
    );
};

const ART = { health: HeartFlask, mana: ArcaneCrystal, ap: WingedBoot };

const ResourceGlyph = ({ kind = 'health', current = 0, max = 1, surplus = false, className = '', title }) => {
    const rawId = useId();
    const serial = useRef(null);
    if (serial.current === null) serial.current = ++glyphCounter;
    const uid = `rg${serial.current}${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
    const safeKind = ART[kind] ? kind : 'health';
    const phase = getResourcePhase(current, max);
    const ratio = clamp01((Number(current) || 0) / Math.max(1, Number(max) || 1));
    const Art = ART[safeKind];
    const aura = PALETTE[safeKind].aura;

    return (
        <svg
            className={`resource-glyph rg-${safeKind} rg-phase-${phase}${surplus ? ' rg-surplus' : ''} ${className}`.trim()}
            viewBox="0 0 100 124"
            data-kind={safeKind}
            data-phase={phase}
            role={title ? 'img' : undefined}
            aria-hidden={title ? undefined : 'true'}
            focusable="false"
            style={{ '--rg-aura': aura }}
        >
            {title && <title>{title}</title>}
            <Art ratio={ratio} phase={phase} uid={uid} />
        </svg>
    );
};

export default ResourceGlyph;
