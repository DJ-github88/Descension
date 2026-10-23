import React, { useId, useRef } from 'react';
import './resource-glyphs.css';

/**
 * ResourceGlyph — ink-and-wash SVG resource icons for the party HUD and target bars.
 *
 *   health     → heart-shaped potion flask with a cork and brass lip
 *   mana       → cut arcane crystal resting in a brass cradle
 *   ap         → winged boot that fills with gold
 *   exhaustion → brass-capped hourglass that drains as exhaustion rises
 *
 * Drawn for ~40px: one ink weight, muted page-friendly colours, a single
 * highlight and one craft detail each, so the glyphs read at a glance and sit
 * calmly on the parchment frame.
 *
 * Phases (by fill ratio):
 *   max      full, a slow glint
 *   high     filled to the ratio
 *   low      a hairline crack (AP: wing starts to droop)
 *   critical a second crack, the fill ebbs softly (AP: wing hangs low)
 *   empty    broken: chipped glass, split crystal, snapped wing, spilled sand
 * `surplus` (temporary resources) adds a soft coloured aura on top of any phase.
 */

export const getResourcePhase = (current, max, kind) => {
    if (kind === 'exhaustion') {
        const lvl = Math.min(6, Math.max(0, Number(current) || 0));
        if (lvl === 0) return 'max';
        if (lvl <= 2) return 'high';
        if (lvl <= 4) return 'low';
        if (lvl === 5) return 'critical';
        return 'empty';
    }
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

/* One ink, one line weight: matches the frame's printed-sheet look. */
const INK = '#34251a';
const LINE = 3.4;
const PAGE = '#f6f1e6';
const SPENT_LIGHT = '#eee8dc';
const SPENT_DARK = '#c9bfad';

/* Muted, earthy pigments — readable on parchment without shouting. */
const PALETTE = {
    health: { hi: '#e08a86', fill: '#a8363c', deep: '#5c1a1f', aura: '#d0605f', foam: '#f3c4bd' },
    mana: { hi: '#a9c2e6', fill: '#4a6fae', deep: '#1f3463', aura: '#7fa0d6', foam: '#dbe7f6' },
    ap: { hi: '#f1d896', fill: '#c99a42', deep: '#7d5a1e', aura: '#ddb862', foam: '#fbefcf' },
    exhaustion: { hi: '#e9cf8f', fill: '#c99a4e', deep: '#7c5a26', aura: '#a08ac0', foam: '#f6e6bd' },
};

const clamp01 = (n) => Math.min(1, Math.max(0, n));

// Module counter keeps clip/gradient ids unique even across separate React roots.
let glyphCounter = 0;

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

const Glint = ({ x, y, s = 1 }) => (
    <path
        className="rg-glint"
        d={`M${x} ${y - 7 * s} Q${x + 1 * s} ${y - 1 * s} ${x + 7 * s} ${y} Q${x + 1 * s} ${y + 1 * s} ${x} ${y + 7 * s} Q${x - 1 * s} ${y + 1 * s} ${x - 7 * s} ${y} Q${x - 1 * s} ${y - 1 * s} ${x} ${y - 7 * s} Z`}
        fill="#fffdf6"
    />
);

/** Hairline crack: ink line over a faint light edge so it reads on glass and fill alike. */
const Crack = ({ d, w = 1.8 }) => (
    <g className="rg-crack">
        <path d={d} fill="none" stroke="#fffaf0" strokeWidth={w + 1.4} strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
        <path d={d} fill="none" stroke={INK} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
    </g>
);

/** Soft aged brass — low contrast so fittings support the glyph instead of competing. */
const BrassDefs = ({ id, tarnished = false }) => (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={tarnished ? '#c8b88f' : '#ead39a'} />
        <stop offset="0.55" stopColor={tarnished ? '#9a8a66' : '#b98d45'} />
        <stop offset="1" stopColor={tarnished ? '#6c6047' : '#7f5f27'} />
    </linearGradient>
);

/** Vertical liquid gradient: bright surface, rich body, deep base. */
const LiquidDefs = ({ id, c }) => (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={c.hi} />
        <stop offset="0.3" stopColor={c.fill} />
        <stop offset="1" stopColor={c.deep} />
    </linearGradient>
);

const GlassDefs = ({ id, dulled = false }) => (
    <radialGradient id={id} cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#fffdf8" />
        <stop offset="0.6" stopColor={dulled ? '#e6e0d4' : '#f3eee4'} />
        <stop offset="1" stopColor={dulled ? '#cfc7b8' : '#ddd5c5'} />
    </radialGradient>
);

/* ------------------------------------------------------------------ */
/* Heart flask (health)                                                */
/* ------------------------------------------------------------------ */

const HEART = 'M50 114 C24 96 9 77 10 56 C11 39 23 30 36 31 C43 32 48 36 50 41 C52 36 57 32 64 31 C77 30 89 39 90 56 C91 77 76 96 50 114 Z';
const HEART_TOP = 31;
const HEART_BOTTOM = 114;

const HeartFlask = ({ ratio, phase, uid }) => {
    const c = PALETTE.health;
    const shattered = phase === 'empty';
    const liquidTop = HEART_TOP + (1 - ratio) * (HEART_BOTTOM - HEART_TOP);
    return (
        <>
            <defs>
                <clipPath id={`${uid}-clip`}><path d={HEART} /></clipPath>
                <GlassDefs id={`${uid}-glass`} dulled={shattered} />
                <LiquidDefs id={`${uid}-liq`} c={c} />
                <BrassDefs id={`${uid}-brass`} />
            </defs>

            {/* neck, cork and brass lip — the one craft detail */}
            <path d="M43 17 H57 V25 C57 28 59 30 62 31.5 H38 C41 30 43 28 43 25 Z" fill={`url(#${uid}-glass)`} stroke={INK} strokeWidth={LINE * 0.8} strokeLinejoin="round" />
            <path d="M42 7 C42 5 44 4 46 4 H54 C56 4 58 5 58 7 V15 H42 Z" fill={shattered ? '#b8a68e' : '#b4875a'} stroke={INK} strokeWidth={LINE * 0.8} strokeLinejoin="round" />
            <path d="M46 7 V13 M50 6 V13 M54 7 V13" stroke={INK} strokeWidth="0.9" opacity="0.3" strokeLinecap="round" />
            <rect x="39.5" y="14" width="21" height="5.5" rx="2.75" fill={`url(#${uid}-brass)`} stroke={INK} strokeWidth="1.8" />

            {/* glass body */}
            <path d={HEART} fill={`url(#${uid}-glass)`} />

            {/* liquid with a soft meniscus */}
            {!shattered && ratio > 0 && (
                <g clipPath={`url(#${uid}-clip)`} className="rg-fill">
                    <rect x="0" y={liquidTop} width="100" height={HEART_BOTTOM - liquidTop + 4} fill={`url(#${uid}-liq)`} />
                    <path d={`M0 ${liquidTop + 1.2} H100`} stroke={c.foam} strokeWidth="2" opacity="0.7" />
                </g>
            )}

            {/* broken: dried residue and a punched-out chip */}
            {shattered && (
                <>
                    <g clipPath={`url(#${uid}-clip)`}>
                        <path d="M28 106 C40 101 60 101 72 106 V120 H28 Z" fill={c.deep} opacity="0.35" />
                    </g>
                    <path d="M63 45 L76 41 L72 56 L65 52 Z" fill={PAGE} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
                </>
            )}

            {/* single curved highlight */}
            <path d="M22 58 C20 47 26 40 35 39" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" opacity={shattered ? 0.35 : 0.75} />

            <path d={HEART} fill="none" stroke={INK} strokeWidth={LINE} strokeLinejoin="round" />

            {(phase === 'low' || phase === 'critical' || shattered) && <Crack d="M68 42 L71 50 L66 57 L71 65" />}
            {(phase === 'critical' || shattered) && <Crack d="M30 54 L36 63 L32 71 L37 80" />}
            {shattered && (
                <g className="rg-shards" stroke={INK} strokeWidth="1.3" strokeLinejoin="round">
                    <path d="M30 117 L38 114 L36 121 Z" fill="#e6e0d4" />
                    <path d="M62 118 L70 115 L68 122 Z" fill="#d9d2c4" />
                </g>
            )}
            {phase === 'max' && <Glint x={31} y={50} s={0.75} />}
        </>
    );
};

/* ------------------------------------------------------------------ */
/* Arcane crystal (mana)                                               */
/* ------------------------------------------------------------------ */

const GEM = 'M50 5 L77 35 L71 96 L50 112 L29 96 L23 35 Z';
const GEM_LEFT = 'M50 5 L50 112 L29 96 L23 35 Z';
const GEM_RIGHT = 'M50 5 L77 35 L71 96 L50 112 Z';
const GEM_TOP = 5;
const GEM_BOTTOM = 112;

// Four broad facets (0 = lit, 1 = shadow) — enough to read as cut stone.
const FACETS = [
    ['M50 5 L23 35 L50 45 Z', 0.05],
    ['M50 5 L77 35 L50 45 Z', 0.4],
    ['M23 35 L50 45 L50 112 L29 96 Z', 0.3],
    ['M77 35 L50 45 L50 112 L71 96 Z', 0.8],
];

const mix = (a, b, t) => {
    const pa = a.match(/\w\w/g).map((h) => parseInt(h, 16));
    const pb = b.match(/\w\w/g).map((h) => parseInt(h, 16));
    return `#${pa.map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, '0')).join('')}`;
};

const Facets = ({ light, dark, only }) => (
    <g>
        {FACETS.filter((_, i) => !only || only.includes(i)).map(([d, t]) => (
            <path key={d} d={d} fill={mix(light, dark, t)} />
        ))}
    </g>
);

const FacetLines = () => (
    <path d="M23 35 L50 45 L77 35 M50 45 V112" fill="none" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" opacity="0.5" />
);

/** Brass cradle under the stone — the one craft detail. */
const Cradle = ({ uid }) => (
    <g>
        <path d="M30 92 L37 106 Q50 120 63 106 L70 92" fill="none" stroke={INK} strokeWidth="6.4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M30 92 L37 106 Q50 120 63 106 L70 92" fill="none" stroke={`url(#${uid}-brass)`} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
    </g>
);

const ArcaneCrystal = ({ ratio, phase, uid }) => {
    const c = PALETTE.mana;
    const shattered = phase === 'empty';
    const level = GEM_TOP + (1 - ratio) * (GEM_BOTTOM - GEM_TOP);

    if (shattered) {
        return (
            <g className="rg-split">
                <defs><BrassDefs id={`${uid}-brass`} /></defs>
                <g transform="translate(-5 3) rotate(-7 36 60)">
                    <clipPath id={`${uid}-l`}><path d={GEM_LEFT} /></clipPath>
                    <g clipPath={`url(#${uid}-l)`}><Facets light={SPENT_LIGHT} dark={SPENT_DARK} /></g>
                    <path d={GEM_LEFT} fill="none" stroke={INK} strokeWidth={LINE} strokeLinejoin="round" />
                </g>
                <g transform="translate(6 6) rotate(7 64 60)">
                    <clipPath id={`${uid}-r`}><path d={GEM_RIGHT} /></clipPath>
                    <g clipPath={`url(#${uid}-r)`}><Facets light={SPENT_LIGHT} dark={SPENT_DARK} /></g>
                    <path d={GEM_RIGHT} fill="none" stroke={INK} strokeWidth={LINE} strokeLinejoin="round" />
                </g>
                <Cradle uid={uid} />
                <g className="rg-shards" stroke={INK} strokeWidth="1.3" strokeLinejoin="round">
                    <path d="M44 120 L50 116 L52 122 Z" fill="#e2dccf" />
                    <path d="M16 112 L21 109 L21 115 Z" fill="#d5cdbe" />
                </g>
            </g>
        );
    }

    return (
        <>
            <defs>
                <clipPath id={`${uid}-clip`}><path d={GEM} /></clipPath>
                <clipPath id={`${uid}-lvl`}><rect x="0" y={level} width="100" height={GEM_BOTTOM - level + 2} /></clipPath>
                <BrassDefs id={`${uid}-brass`} />
            </defs>

            {/* spent stone: pale, parchment-grey */}
            <g clipPath={`url(#${uid}-clip)`}>
                <Facets light={SPENT_LIGHT} dark={SPENT_DARK} />
            </g>

            {/* charged part of the stone */}
            {ratio > 0 && (
                <g clipPath={`url(#${uid}-lvl)`} className="rg-fill">
                    <g clipPath={`url(#${uid}-clip)`}>
                        <Facets light={c.hi} dark={c.deep} />
                        <line x1="0" y1={level + 1} x2="100" y2={level + 1} stroke={c.foam} strokeWidth="1.8" opacity="0.85" />
                    </g>
                </g>
            )}

            <FacetLines />
            {/* table highlight */}
            <path d="M31 38 L45 43" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity="0.8" />
            <path d={GEM} fill="none" stroke={INK} strokeWidth={LINE} strokeLinejoin="round" />
            <Cradle uid={uid} />

            {(phase === 'low' || phase === 'critical') && <Crack d="M64 48 L60 58 L66 66 L62 76" />}
            {phase === 'critical' && <Crack d="M35 72 L41 80 L37 89" />}
            {phase === 'max' && <Glint x={63} y={24} s={0.75} />}
        </>
    );
};

/* ------------------------------------------------------------------ */
/* Winged boot (action points)                                         */
/* ------------------------------------------------------------------ */

const BOOT = 'M44 24 H70 V68 C80 70 91 76 94 86 C96 93 92 99 85 99 H44 C40 99 38 96 39 92 Z';
const BOOT_TOP = 24;
const BOOT_BOTTOM = 99;

const leaf = (bx, by, tx, ty, w) => {
    const dx = tx - bx;
    const dy = ty - by;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const mx = bx + dx * 0.55;
    const my = by + dy * 0.55;
    const f = (n) => n.toFixed(1);
    return `M${f(bx)} ${f(by)} Q${f(mx + nx * w)} ${f(my + ny * w)} ${f(tx)} ${f(ty)} Q${f(mx - nx * w * 0.45)} ${f(my - ny * w * 0.45)} ${f(bx)} ${f(by)} Z`;
};

// Wing silhouette: rounded leading edge, scalloped primaries; base hides behind the shaft.
const WING = 'M58 38 C46 28 30 15 10 9 C3 8 1 14 7 18 L12 21 C3 24 3 31 10 32 L15 34 C6 39 8 46 15 46 L21 47 C14 53 18 59 25 57 L31 57 C28 63 34 66 40 62 L58 58 Z';
const WING_VEINS = 'M54 44 L13 21 M54 47 L16 34 M54 50 L22 47 M55 53 L32 57';
const WING_COVERT = 'M57 41 C47 37 37 36 29 38 C34 43 44 46 57 47';
const WING_BROKEN = 'M58 46 C48 43 38 43 28 46 L33 49 L26 53 L32 55 C29 60 34 63 40 61 L58 58 Z';

const WingedBoot = ({ ratio, phase, uid }) => {
    const c = PALETTE.ap;
    const shattered = phase === 'empty';
    const level = BOOT_TOP + (1 - ratio) * (BOOT_BOTTOM - BOOT_TOP);
    const droop = phase === 'critical' ? 'rotate(-22 54 50)' : phase === 'low' ? 'rotate(-10 54 50)' : undefined;

    return (
        <>
            <defs>
                <clipPath id={`${uid}-clip`}><path d={BOOT} /></clipPath>
                <LiquidDefs id={`${uid}-charge`} c={c} />
                <BrassDefs id={`${uid}-brass`} />
            </defs>

            {/* wing first, so it grows out from behind the shaft */}
            <g className="rg-wing" transform={droop}>
                <path d={shattered ? WING_BROKEN : WING} fill={shattered ? '#e6dfd2' : '#fbf7ee'} stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
                {!shattered && (
                    <>
                        <path d={WING_VEINS} fill="none" stroke={INK} strokeWidth="1.1" strokeLinecap="round" opacity="0.35" />
                        <path d={WING_COVERT} fill={`url(#${uid}-brass)`} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
                    </>
                )}
                {shattered && <path d="M28 46 L33 49 L26 53" fill="none" stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />}
            </g>

            {/* boot: empty leather is pale; AP fills it with gold */}
            <path d={BOOT} fill={shattered ? '#e3dccf' : PAGE} />
            {!shattered && ratio > 0 && (
                <g clipPath={`url(#${uid}-clip)`} className="rg-fill">
                    <rect x="0" y={level} width="100" height={BOOT_BOTTOM - level + 2} fill={`url(#${uid}-charge)`} />
                    <path d={`M0 ${level + 1} H100`} stroke={c.foam} strokeWidth="1.8" opacity="0.8" />
                </g>
            )}
            <path d={BOOT} fill="none" stroke={INK} strokeWidth={LINE} strokeLinejoin="round" />

            {/* folded brass-trimmed cuff and sole — the craft detail */}
            <path d="M41 18 H73 C74 18 75 19 75 20 V29 C75 30 74 31 73 31 H41 C40 31 39 30 39 29 V20 C39 19 40 18 41 18 Z" fill={`url(#${uid}-brass)`} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M38 99 H88 C93 99 96 101 95 104 C94 107 91 108 88 108 H41 C38 108 36 106 37 103 Z" fill="#5d4532" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />

            {(phase === 'critical' || shattered) && <Crack d="M63 40 L58 50 L63 58" />}
            {shattered && (
                <>
                    <Crack d="M80 76 L75 85" />
                    <g className="rg-shards" stroke={INK} strokeWidth="1.3" strokeLinejoin="round">
                        <path d={leaf(8, 118, 26, 110, 5)} fill="#ece6da" />
                    </g>
                </>
            )}
            {phase === 'max' && <Glint x={61} y={44} s={0.7} />}
        </>
    );
};

/* ------------------------------------------------------------------ */
/* Hourglass (exhaustion)                                              */
/* ------------------------------------------------------------------ */

const HG_GLASS = 'M33 19 C31 33 32 46 45 59 C47 61 47 63 45 65 C32 78 31 91 33 105 H67 C69 91 68 78 55 65 C53 63 53 61 55 59 C68 46 69 33 67 19 Z';

export const ExhaustionHourglass = ({ current = 0, uid, stage: propStage }) => {
    const stage = propStage !== undefined
        ? propStage
        : Math.min(6, Math.max(0, Math.round(Number(current) || 0)));
    const shattered = stage === 6;
    const weary = stage >= 4;

    // Top bulb sand surface (drains toward the waist at 62).
    const topSandY = [24, 31, 38, 45, 52, 59, 62][stage];
    // Bottom bulb mound surface (rises from 105).
    const btmSandY = [105, 98, 90, 82, 75, 69, 105][stage];

    const sandHi = weary ? '#c7b7cf' : '#ecd193';
    const sandMid = weary ? '#9a86a8' : '#c99a4e';
    const sandDeep = weary ? '#5e4b6e' : '#7c5a26';

    return (
        <g className={`rg-exhaustion-stage-${stage}`}>
            <defs>
                <clipPath id={`${uid}-glass-clip`}><path d={HG_GLASS} /></clipPath>
                <BrassDefs id={`${uid}-brass`} tarnished={weary} />
                <linearGradient id={`${uid}-sand`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor={sandHi} />
                    <stop offset="0.35" stopColor={sandMid} />
                    <stop offset="1" stopColor={sandDeep} />
                </linearGradient>
                <GlassDefs id={`${uid}-glass`} dulled={stage >= 3} />
            </defs>

            {/* posts behind the glass */}
            <rect x="26" y="18" width="4" height="88" fill={`url(#${uid}-brass)`} stroke={INK} strokeWidth="1.8" transform={shattered ? 'rotate(-5 28 106)' : undefined} />
            <rect x="70" y="18" width="4" height="88" fill={`url(#${uid}-brass)`} stroke={INK} strokeWidth="1.8" />

            <path d={HG_GLASS} fill={`url(#${uid}-glass)`} />

            {/* sand */}
            {!shattered && (
                <g clipPath={`url(#${uid}-glass-clip)`} className="rg-fill">
                    {topSandY < 61 && (
                        <path d={`M20 ${topSandY} Q50 ${topSandY + (stage === 0 ? 0 : 5)} 80 ${topSandY} V64 H20 Z`} fill={`url(#${uid}-sand)`} />
                    )}
                    {btmSandY < 105 && (
                        <path d={`M20 106 V${Math.min(105, btmSandY + 11)} Q36 ${btmSandY + 2} 50 ${btmSandY} Q64 ${btmSandY + 2} 80 ${Math.min(105, btmSandY + 11)} V106 Z`} fill={`url(#${uid}-sand)`} />
                    )}
                </g>
            )}

            {/* falling thread of sand */}
            {!shattered && stage >= 1 && stage <= 4 && (
                <g className="rg-stream">
                    <line x1="50" y1="63" x2="50" y2={btmSandY} stroke={sandMid} strokeWidth="1.6" strokeDasharray="3 2" className="rg-stream-flow" />
                </g>
            )}
            {!shattered && stage === 5 && (
                <g className="rg-stream" fill={sandMid}>
                    <circle cx="50" cy="67" r="1.2" />
                    <circle cx="50" cy="73" r="1" />
                </g>
            )}

            {/* stage 0: a small sparkle of vitality in the full bulb */}
            {stage === 0 && (
                <g className="rg-vitality-star">
                    <Glint x={50} y={38} s={0.6} />
                </g>
            )}

            {/* glass highlight + outline */}
            <path d="M37 25 C35 35 37 46 44 54" fill="none" stroke="#ffffff" strokeWidth="2.8" strokeLinecap="round" opacity={shattered ? 0.3 : 0.75} />
            <path d={HG_GLASS} fill="none" stroke={INK} strokeWidth={LINE * 0.85} strokeLinejoin="round" />

            {/* wear builds up with the stages */}
            {stage >= 2 && <Crack d="M37 30 L41 38 L37 45" />}
            {stage >= 4 && <Crack d="M63 80 L58 88 L63 96" />}
            {stage >= 5 && <path d="M62 35 L67 42 L60 44 Z" fill={PAGE} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />}

            {/* broken: sand spilled on the ground */}
            {shattered && (
                <>
                    <Crack d="M50 22 L46 34 L52 44 L47 56" w={2} />
                    <Crack d="M44 70 L50 82 L45 94" w={2} />
                    <path d="M14 117 C24 110 40 109 50 113 C60 109 76 110 86 117 Z" fill={`url(#${uid}-sand)`} stroke={INK} strokeWidth="1.6" strokeLinejoin="round" />
                    <g className="rg-shards" stroke={INK} strokeWidth="1.3" strokeLinejoin="round">
                        <path d="M10 120 L17 117 L15 123 Z" fill="#e6e0d4" />
                        <path d="M80 121 L88 118 L86 124 Z" fill="#d9d2c4" />
                    </g>
                </>
            )}

            {/* brass caps and waist ring — the craft detail */}
            <g transform={shattered ? 'rotate(-6 50 14)' : undefined}>
                <path d="M25 10 H75 C77 10 78 12 77 14 L74 19 H26 L23 14 C22 12 23 10 25 10 Z" fill={`url(#${uid}-brass)`} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
            </g>
            <path d="M26 105 H74 L77 110 C78 112 77 114 75 114 H25 C23 114 22 112 23 110 Z" fill={`url(#${uid}-brass)`} stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />
            {!shattered && <ellipse cx="50" cy="62" rx="5.5" ry="2.4" fill={`url(#${uid}-brass)`} stroke={INK} strokeWidth="1.4" />}
        </g>
    );
};

export const ART = {
    health: HeartFlask,
    mana: ArcaneCrystal,
    ap: WingedBoot,
    exhaustion: ExhaustionHourglass,
};

const ResourceGlyph = ({ kind = 'health', current = 0, max = 1, surplus = false, className = '', title }) => {
    const rawId = useId();
    const serial = useRef(null);
    if (serial.current === null) serial.current = ++glyphCounter;
    const uid = `rg${serial.current}${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}`;
    const safeKind = ART[kind] ? kind : 'health';
    const phase = getResourcePhase(current, max, safeKind);
    const ratio = clamp01((Number(current) || 0) / Math.max(1, Number(max) || 1));
    const Art = ART[safeKind];
    const aura = PALETTE[safeKind].aura;
    const stage = safeKind === 'exhaustion' ? Math.min(6, Math.max(0, Math.round(Number(current) || 0))) : undefined;

    return (
        <svg
            className={`resource-glyph rg-${safeKind} rg-phase-${phase}${surplus ? ' rg-surplus' : ''} ${className}`.trim()}
            viewBox="0 0 100 124"
            data-kind={safeKind}
            data-phase={phase}
            data-stage={stage}
            role={title ? 'img' : undefined}
            aria-hidden={title ? undefined : 'true'}
            focusable="false"
            style={{ '--rg-aura': aura }}
        >
            {title && <title>{title}</title>}
            <Art ratio={ratio} phase={phase} uid={uid} current={current} max={max} stage={stage} />
        </svg>
    );
};

export default ResourceGlyph;
