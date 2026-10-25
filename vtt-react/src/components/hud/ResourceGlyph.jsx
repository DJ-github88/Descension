import React, { useId, useRef } from 'react';
import './resource-glyphs.css';

/**
 * ResourceGlyph — ink-and-wash SVG resource icons for the party HUD and target bars.
 *
 *   health     → heart-shaped potion flask: cork, brass collar, rounded liquid
 *   mana       → faceted crystal phial with the same cork and collar, so the
 *                two read as one apothecary set
 *   ap         → winged boot; each primary feather is one action point and
 *                spent feathers stay as dashed outlines, so the count reads
 *   exhaustion → brass-capped hourglass that drains as exhaustion rises
 *
 * Drawn for ~40px: one ink weight, muted page-friendly colours, a single
 * highlight and one craft detail each, so the glyphs read at a glance and sit
 * calmly on the parchment frame.
 *
 * Phases (by fill ratio):
 *   max      full, a slow glint
 *   high     filled to the ratio
 *   low      a hairline crack
 *   critical a second crack, the fill ebbs softly
 *   empty    broken: chipped glass and dried residue; AP: every feather spent
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

/* Muted, earthy pigments — readable on parchment without shouting. */
const PALETTE = {
    health: {
        hi: '#e08a86', fill: '#a8363c', deep: '#5c1a1f', aura: '#d0605f', foam: '#f6c9c2',
        vhi: '#d9645f', vfill: '#a5323a', vdeep: '#55141b', bubble: '#f3b3ac',
    },
    mana: {
        hi: '#a9c2e6', fill: '#4a6fae', deep: '#1f3463', aura: '#7fa0d6', foam: '#dbe7f6',
        vhi: '#7f9fd6', vfill: '#3f62a3', vdeep: '#1a2c56', bubble: '#b8cdee',
    },
    // ap: pale tan leather for the boot; the feathers carry the count
    ap: { hi: '#f3e9d6', fill: '#e6d6b8', deep: '#cdb48a', aura: '#ddb862', foam: '#fbefcf' },
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
/* Apothecary vessels: shared glass, stopper and liquid                */
/* ------------------------------------------------------------------ */

/** Rounded liquid: lit near the upper left, deepening toward the far wall. */
const VolumeDefs = ({ id, c }) => (
    <radialGradient id={id} cx="0.36" cy="0.42" r="0.75">
        <stop offset="0" stopColor={c.vhi} />
        <stop offset="0.45" stopColor={c.vfill} />
        <stop offset="1" stopColor={c.vdeep} />
    </radialGradient>
);

/** Glass neck, brass collar and a stout cork with a darker cap. Health and mana
    share it, so the two bottom corners read as one set. */
const Stopper = ({ uid, spent = false }) => (
    <g className="rg-stopper">
        <path d="M42 18 H58 V27 C58 30 60 32 63 33.5 H37 C40 32 42 30 42 27 Z" fill={`url(#${uid}-glass)`} stroke={INK} strokeWidth="2.7" strokeLinejoin="round" />
        <path d="M41.5 5 C41.5 3 43.5 2 46 2 H54 C56.5 2 58.5 3 58.5 5 V16 H41.5 Z" fill={spent ? '#b8a68e' : '#b4875a'} stroke={INK} strokeWidth="2.7" strokeLinejoin="round" />
        <path d="M41.5 5 C41.5 3 43.5 2 46 2 H54 C56.5 2 58.5 3 58.5 5 V7 H41.5 Z" fill={spent ? '#9a8a72' : '#8a6440'} />
        <rect x="38.5" y="14.5" width="23" height="6.5" rx="3" fill={`url(#${uid}-brass)`} stroke={INK} strokeWidth="1.9" />
    </g>
);

/** Liquid up to `level`, with a curved surface and a few rising bubbles. */
const Liquid = ({ uid, c, level, bottom, ratio }) => {
    const bubbleY = level + (bottom - level) * 0.45;
    return (
        <g clipPath={`url(#${uid}-clip)`} className="rg-fill">
            <path d={`M0 ${level + 2} Q50 ${level - 2} 100 ${level + 2} V124 H0 Z`} fill={`url(#${uid}-vol)`} />
            <path d={`M4 ${level + 2} Q50 ${level - 2} 96 ${level + 2}`} fill="none" stroke={c.foam} strokeWidth="2.4" opacity="0.85" />
            {ratio > 0.35 && (
                <g fill={c.bubble}>
                    <circle cx="63" cy={bubbleY} r="2.6" opacity="0.75" />
                    <circle cx="57" cy={bubbleY + 9} r="1.7" opacity="0.6" />
                    <circle cx="68" cy={bubbleY + 13} r="1.3" opacity="0.55" />
                </g>
            )}
        </g>
    );
};

/** Pale inner rim: reads as the thickness of the glass. */
const GlassRim = ({ uid, d }) => (
    <g clipPath={`url(#${uid}-clip)`}>
        <path d={d} fill="none" stroke="#fffaf2" strokeWidth="5" opacity="0.45" />
    </g>
);

/* ------------------------------------------------------------------ */
/* Heart flask (health)                                                */
/* ------------------------------------------------------------------ */

const HEART = 'M50 115 C26 98 10 80 10 59 C10 42 22 32 35.5 32 C43 32 48 36.5 50 42 C52 36.5 57 32 64.5 32 C78 32 90 42 90 59 C90 80 74 98 50 115 Z';
const HEART_TOP = 32;
const HEART_BOTTOM = 115;

const HeartFlask = ({ ratio, phase, uid }) => {
    const c = PALETTE.health;
    const shattered = phase === 'empty';
    const level = HEART_TOP + (1 - ratio) * (HEART_BOTTOM - HEART_TOP);
    return (
        <>
            <defs>
                <clipPath id={`${uid}-clip`}><path d={HEART} /></clipPath>
                <GlassDefs id={`${uid}-glass`} dulled={shattered} />
                <VolumeDefs id={`${uid}-vol`} c={c} />
                <BrassDefs id={`${uid}-brass`} />
            </defs>

            <Stopper uid={uid} spent={shattered} />
            <path d={HEART} fill={`url(#${uid}-glass)`} />

            {!shattered && ratio > 0 && (
                <Liquid uid={uid} c={c} level={level} bottom={HEART_BOTTOM} ratio={ratio} />
            )}

            {/* broken: dried residue and a punched-out chip */}
            {shattered && (
                <g clipPath={`url(#${uid}-clip)`}>
                    <path d="M30 107 C42 102 58 102 70 107 V122 H30 Z" fill={c.deep} opacity="0.3" />
                </g>
            )}

            <GlassRim uid={uid} d={HEART} />

            {/* a crescent on the left lobe, a fleck on the right */}
            <path d="M20 64 C17 51 23 41 33 39.5" fill="none" stroke="#ffffff" strokeWidth="4.6" strokeLinecap="round" opacity={shattered ? 0.4 : 0.85} />
            <circle cx="74" cy="46" r="2.6" fill="#ffffff" opacity={shattered ? 0.35 : 0.8} />

            <path d={HEART} fill="none" stroke={INK} strokeWidth={LINE} strokeLinejoin="round" />

            {(phase === 'low' || phase === 'critical' || shattered) && <Crack d="M69 44 L72 52 L67 59 L72 67" />}
            {(phase === 'critical' || shattered) && <Crack d="M30 56 L36 65 L32 73 L37 82" />}
            {shattered && (
                <>
                    <path d="M62 46 L75 42 L71 57 L64 53 Z" fill={PAGE} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
                    <g className="rg-shards" stroke={INK} strokeWidth="1.3" strokeLinejoin="round">
                        <path d="M30 118 L38 115 L36 122 Z" fill="#e6e0d4" />
                        <path d="M62 119 L70 116 L68 123 Z" fill="#d9d2c4" />
                    </g>
                </>
            )}
            {phase === 'max' && <Glint x={30} y={54} s={0.75} />}
        </>
    );
};

/* ------------------------------------------------------------------ */
/* Crystal phial (mana)                                                */
/* ------------------------------------------------------------------ */

const PHIAL = 'M37 33.5 H63 L77 48 L72 99 L50 117 L28 99 L23 48 Z';
const PHIAL_TOP = 35;
const PHIAL_BOTTOM = 117;

const CrystalPhial = ({ ratio, phase, uid }) => {
    const c = PALETTE.mana;
    const shattered = phase === 'empty';
    const level = PHIAL_TOP + (1 - ratio) * (PHIAL_BOTTOM - PHIAL_TOP);
    return (
        <>
            <defs>
                <clipPath id={`${uid}-clip`}><path d={PHIAL} /></clipPath>
                <GlassDefs id={`${uid}-glass`} dulled={shattered} />
                <VolumeDefs id={`${uid}-vol`} c={c} />
                <BrassDefs id={`${uid}-brass`} />
            </defs>

            <Stopper uid={uid} spent={shattered} />
            <path d={PHIAL} fill={`url(#${uid}-glass)`} />

            {!shattered && ratio > 0 && (
                <Liquid uid={uid} c={c} level={level} bottom={PHIAL_BOTTOM} ratio={ratio} />
            )}
            {shattered && (
                <g clipPath={`url(#${uid}-clip)`}>
                    <path d="M30 108 L50 114 L70 108 V122 H30 Z" fill={c.deep} opacity="0.3" />
                </g>
            )}

            {/* cut facets: one lit plane, one shaded plane, over glass and liquid alike */}
            <g clipPath={`url(#${uid}-clip)`}>
                <path d="M23 48 L50 57 L50 117 L28 99 Z" fill="#ffffff" opacity="0.14" />
                <path d="M77 48 L50 57 L50 117 L72 99 Z" fill="#1b1209" opacity="0.13" />
            </g>
            <GlassRim uid={uid} d={PHIAL} />
            <path d="M23 48 L50 57 L77 48 M50 57 V117" fill="none" stroke={INK} strokeWidth="1.2" strokeLinejoin="round" opacity="0.45" />
            <path d="M30 55 L33 89" stroke="#ffffff" strokeWidth="3.6" strokeLinecap="round" opacity={shattered ? 0.35 : 0.8} />

            <path d={PHIAL} fill="none" stroke={INK} strokeWidth={LINE} strokeLinejoin="round" />

            {(phase === 'low' || phase === 'critical' || shattered) && <Crack d="M66 53 L63 62 L68 69 L64 78" />}
            {(phase === 'critical' || shattered) && <Crack d="M34 66 L39 75 L35 85" />}
            {shattered && (
                <>
                    <path d="M64 41 L73 45 L70 55 Z" fill={PAGE} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
                    <g className="rg-shards" stroke={INK} strokeWidth="1.3" strokeLinejoin="round">
                        <path d="M44 120 L50 116 L52 122 Z" fill="#e2dccf" />
                        <path d="M16 112 L21 109 L21 115 Z" fill="#d5cdbe" />
                    </g>
                </>
            )}
            {phase === 'max' && <Glint x={64} y={67} s={0.75} />}
        </>
    );
};

/* ------------------------------------------------------------------ */
/* Winged boot (action points)                                         */
/* ------------------------------------------------------------------ */

const BOOT = 'M44 24 H70 V68 C80 70 91 76 94 86 C96 93 92 99 85 99 H44 C40 99 38 96 39 92 Z';
const MAX_FEATHERS = 6;

/** One primary feather per action point. Feathers fan from behind the shaft,
    the leading one longest; spent feathers stay as dashed outlines so the
    count still reads (3 of 3, 1 of 3) without a number. Pools above six fall
    back to six feathers lit by ratio. */
const featherLayout = (current, max) => {
    const safeMax = Math.max(1, Math.round(Number(max) || 1));
    const n = Math.min(MAX_FEATHERS, safeMax);
    const value = Math.max(0, Number(current) || 0);
    const lit = safeMax <= MAX_FEATHERS
        ? Math.min(n, Math.floor(value))
        : Math.round(clamp01(value / safeMax) * n);
    const thickness = { 1: 12, 2: 12, 3: 11.5, 4: 10, 5: 9, 6: 8 }[n];
    const base = { x: 57, y: 46 };
    return Array.from({ length: n }, (_, i) => {
        const t = n > 1 ? i / (n - 1) : 0.35;
        const angle = 216 + (150 - 216) * t;
        const length = 70 + (44 - 70) * t;
        const rad = (angle * Math.PI) / 180;
        return {
            key: i,
            lit: i < lit,
            cx: base.x + (Math.cos(rad) * length) / 2,
            cy: base.y + (Math.sin(rad) * length) / 2,
            rx: length / 2,
            ry: thickness,
            angle,
            tipX: base.x + Math.cos(rad) * length * 0.9,
            tipY: base.y + Math.sin(rad) * length * 0.9,
            baseX: base.x,
            baseY: base.y,
        };
    });
};

const WingedBoot = ({ phase, uid, current, max }) => {
    const c = PALETTE.ap;
    const spent = phase === 'empty';
    const feathers = featherLayout(current, max);
    const r1 = (n) => n.toFixed(1);

    return (
        <>
            <defs>
                <LiquidDefs id={`${uid}-leather`} c={c} />
                <BrassDefs id={`${uid}-brass`} tarnished={spent} />
            </defs>

            {/* wing first, so the feathers grow out from behind the shaft;
                lower primaries are drawn first so the leading feather overlaps them */}
            <g className="rg-wing">
                {[...feathers].reverse().map((f) => (
                    f.lit ? (
                        <g key={f.key} className="rg-feather is-lit">
                            <ellipse cx={r1(f.cx)} cy={r1(f.cy)} rx={r1(f.rx)} ry={f.ry} transform={`rotate(${r1(f.angle)} ${r1(f.cx)} ${r1(f.cy)})`} fill="#fbf7ee" stroke={INK} strokeWidth="2.4" />
                            <path d={`M${f.baseX} ${f.baseY} L${r1(f.tipX)} ${r1(f.tipY)}`} stroke={INK} strokeWidth="1.1" opacity="0.35" strokeLinecap="round" />
                        </g>
                    ) : (
                        <ellipse key={f.key} className="rg-feather is-spent" cx={r1(f.cx)} cy={r1(f.cy)} rx={r1(f.rx)} ry={f.ry} transform={`rotate(${r1(f.angle)} ${r1(f.cx)} ${r1(f.cy)})`} fill="#efe8da" fillOpacity="0.5" stroke={INK} strokeWidth="1.5" strokeDasharray="3.2 2.6" opacity="0.5" />
                    )
                ))}
                <path d="M58 37 C50 36 42 39 37 44 C42 50 50 52 58 52 Z" fill={`url(#${uid}-brass)`} stroke={INK} strokeWidth="1.8" strokeLinejoin="round" />
            </g>

            {/* the boot itself stays put; the feathers carry the count */}
            <path d={BOOT} fill={spent ? '#e3dccf' : `url(#${uid}-leather)`} />
            <path d="M50 32 C49 50 48 70 50 92" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" opacity={spent ? 0.3 : 0.55} />
            <path d={BOOT} fill="none" stroke={INK} strokeWidth={LINE} strokeLinejoin="round" />

            {/* folded brass-trimmed cuff and sole — the craft detail */}
            <path d="M41 18 H73 C74 18 75 19 75 20 V29 C75 30 74 31 73 31 H41 C40 31 39 30 39 29 V20 C39 19 40 18 41 18 Z" fill={`url(#${uid}-brass)`} stroke={INK} strokeWidth="2.4" strokeLinejoin="round" />
            <path d="M38 99 H88 C93 99 96 101 95 104 C94 107 91 108 88 108 H41 C38 108 36 106 37 103 Z" fill="#5d4532" stroke={INK} strokeWidth="2.2" strokeLinejoin="round" />

            {phase === 'max' && <Glint x={61} y={46} s={0.7} />}
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
    mana: CrystalPhial,
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
