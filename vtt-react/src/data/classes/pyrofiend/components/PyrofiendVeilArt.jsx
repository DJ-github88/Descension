import React from 'react';
import { INK, MUTED, PAPER, RULE, ETCH, BRICK } from '../../../../components/hud/calmBarPalette';

/*
 * Scathrach's Veil — calm parchment rendering of the Pyrofiend resource.
 *
 * Pure presentation: no stores, no side effects. The bar component owns state
 * and passes stage, hover and handlers in. Drawn in the shared calm TTRPG
 * language (parchment page, thin ink rules, no glows or filters); the class
 * keeps its identity through ember ink, the nine seal glyphs, the Whisper and
 * Heresy gates, the Heresy shackle and the Oblivion maw.
 *
 * viewBox 0 0 300 64, same footprint as the previous art.
 */

// Nine demonic seals, each drawn in a 20x20 box centered on (0,0).
export const RUNE_PATHS = {
    1: 'M 0.5,-8 L -0.5,8 M 0,-4.5 L 4.5,-7.5 M -0.5,-3.5 L 4,-6.5 M 0,1 L 5,-2.5',
    2: 'M 0.5,-8 L -0.5,-1 M -0.5,-1 L -5.5,8 M -0.5,-1 L 4.5,7.5 M -5.5,8 L -2.5,6.5 M 4.5,7.5 L 2,7',
    3: 'M -6.5,-6 L -2.5,7.5 M 0,-8.5 L 1.5,8 M 6.5,-6 L 3.5,7 M -6,0.5 L 6.5,-2.5 M -3,3 L -5.5,5.5',
    4: 'M 0,-8.5 L 6,0 L 0.5,8.5 L -6,0 Z M -6,0 L -9,-4.5 M -7,1 L -9,-2 M 6,0 L 9,-4 M 0,-8.5 L 0,-4',
    5: 'M -7,0 A 7,4.8 0 1,0 7,0 A 7,4.8 0 1,0 -7,0 M 0.5,-7.5 L -0.5,7.5 M -9,-6.5 L -6.5,-4.5 M 9,-6 L 6.5,-4 M -3,6 L 3,5.5',
    6: 'M 0,-7.5 L -6.5,-3.5 L -6,3.5 M 0,-7.5 L 6.5,-3.5 L 6,4 M -2.5,-2.5 L 3,2.5 M 3,-2 L -3,2.5 M -6,3.5 L -4,6 M 6,4 L 4,6.5',
    7: 'M 0,-9 L 2.5,-2 L 9,0 L 2,2.5 L -0.5,9 L -2.5,2 L -9,0 L -2,-2.5 Z M -8.5,-8 L 8.5,8.5 M -8.5,-8 L -5,-6',
    8: 'M -7.5,-5 Q 0,-8.5 7.5,-5 M -7.5,5.5 Q 0,8.5 7.5,5.5 M -7.5,-5 L -4,0.5 L -7.5,5.5 M 7.5,-5 L 4,0 L 7.5,5.5 M -3,-1.5 L 0,2.5 L 3.5,-1 M -7.5,-5 L -9,-7',
    9: 'M -8,0 A 8,8 0 1,0 8,0 A 8,8 0 1,0 -8,0 M -3.5,0 A 3.5,3.5 0 1,0 3.5,0 A 3.5,3.5 0 1,0 -3.5,0 M 0,-8 L 0.5,-4.5 M -0.5,4.5 L 0,8 M -8,0 L -4.5,0.5 M 4.5,-0.5 L 8,0 M -5.6,-5.6 L -3,-3.5 M 3.5,3 L 5.6,5.6 M 5.6,-5.6 L 3,-3 M -3.5,3.5 L -5.6,5.6 M 2,-6.5 L 4,-8'
};

export const RUNE_NAMES = {
    1: 'the Brand', 2: 'the Fork', 3: 'the Claw', 4: 'the Horned Diamond',
    5: 'the Watching Eye', 6: 'the Shackled Hex', 7: 'the Shattered Star',
    8: 'the Maw', 9: 'the Ninth Seal'
};

// Ember inks deepen as the Veil climbs: ember -> molten -> surge (amber) -> blood -> oblivion.
// `ink` strokes the seal, `wash` tints the kindled socket.
const INK_BANDS = {
    ember: { ink: '#a84a1c', wash: '#f2dac4' },
    molten: { ink: '#a3551a', wash: '#f1dcbf' },
    surge: { ink: '#946414', wash: '#efe1b8' },
    blood: { ink: '#8b3a2a', wash: '#efd4c8' },
    oblivion: { ink: '#6e2418', wash: '#e9ccc3' }
};

export const inkBandFor = (id) => {
    if (id >= 9) return INK_BANDS.oblivion;
    if (id >= 7) return INK_BANDS.blood;
    if (id >= 5) return INK_BANDS.surge;
    if (id >= 3) return INK_BANDS.molten;
    return INK_BANDS.ember;
};

// Coal 5 is the Surge gate (Whisper eye), 6 the Heresy shackle, 9 the Maw.
export const RUNE_POSITIONS = [
    { id: 1, cx: 25, cy: 34, r: 7.5 },
    { id: 2, cx: 55.5, cy: 34, r: 7.5 },
    { id: 3, cx: 86, cy: 34, r: 8 },
    { id: 4, cx: 116.5, cy: 34, r: 8.5 },
    { id: 5, cx: 150, cy: 33, r: 11 },
    { id: 6, cx: 183.5, cy: 34, r: 8.5 },
    { id: 7, cx: 214, cy: 34, r: 9 },
    { id: 8, cx: 244.5, cy: 34, r: 9.5 },
    { id: 9, cx: 275.5, cy: 33, r: 11.5 }
];

const PyrofiendVeilArt = ({
    infernoLevel = 0,
    debtLatched = false,
    hoveredRune = null,
    isOwner = false,
    getStageName = () => '',
    onRuneEnter = () => {},
    onRuneLeave = () => {},
    onRuneSelect = () => {}
}) => {
    const current = RUNE_POSITIONS.find((r) => r.id === infernoLevel);
    const currentBand = inkBandFor(infernoLevel);

    return (
        <svg
            className="pyrofiend-caldera-svg"
            viewBox="0 0 300 64"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* 1. No page box: the seals sit directly on the card. Only a latched Debt Call draws a brick frame. */}
            {debtLatched && (
                <rect
                    className="pyro-page"
                    x="2.5" y="7.5" width="295" height="49" rx="3"
                    fill="none"
                    stroke={BRICK}
                    strokeWidth="1.2"
                />
            )}

            {/* 2. The track: a thin rule, inked in ember up to the current seal */}
            <line x1="13" y1="34" x2="287" y2="34" stroke={RULE} strokeWidth="1.2" strokeLinecap="round" />
            {current && current.id > 1 && (
                <line
                    className="pyro-track-fill"
                    x1="25" y1="34" x2={current.cx} y2="34"
                    stroke={currentBand.ink}
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            )}

            {/* 3. Threshold gates: Whisper (5) and Heresy (6) */}
            <line
                x1="167" y1="20" x2="167" y2="48"
                stroke={infernoLevel >= 5 ? INK_BANDS.surge.ink : MUTED}
                strokeWidth="1"
                strokeDasharray="2 1.8"
                opacity={infernoLevel >= 5 ? 0.9 : 0.4}
            />
            <line
                x1="199" y1="20" x2="199" y2="48"
                stroke={infernoLevel >= 6 ? BRICK : MUTED}
                strokeWidth="1"
                strokeDasharray="2 1.8"
                opacity={infernoLevel >= 6 ? 0.9 : 0.4}
            />

            {/* 4. Nine seals */}
            {RUNE_POSITIONS.map((rune) => {
                const isFilled = infernoLevel >= rune.id;
                const isCurrent = infernoLevel === rune.id && infernoLevel > 0;
                const isHovered = hoveredRune === rune.id;
                const band = inkBandFor(rune.id);
                const glyphScale = rune.r / 11;

                return (
                    <g
                        key={rune.id}
                        className={`pyro-rune-crucible rune-${rune.id} ${isFilled ? 'filled' : 'empty'} ${isCurrent ? 'current' : ''}`}
                        onMouseEnter={() => onRuneEnter(rune.id)}
                        onMouseLeave={() => onRuneLeave()}
                        onClick={(e) => {
                            if (!isOwner) return;
                            e.stopPropagation();
                            onRuneSelect(rune.id);
                        }}
                        style={{ cursor: isOwner ? 'pointer' : 'default' }}
                    >
                        <title>{`Stage ${rune.id} — ${getStageName(rune.id)} ${RUNE_NAMES[rune.id]}`}</title>

                        {/* Current stage: a single thin ring, no glow, no pulse */}
                        {isCurrent && (
                            <circle cx={rune.cx} cy={rune.cy} r={rune.r + 4.2} fill="none" stroke={band.ink} strokeWidth="1" />
                        )}

                        {/* Socket */}
                        <circle
                            cx={rune.cx}
                            cy={rune.cy}
                            r={rune.r + 2}
                            fill={isFilled ? band.wash : PAPER}
                            stroke={isFilled ? band.ink : (isHovered ? MUTED : RULE)}
                            strokeWidth={isFilled ? 1.2 : 0.9}
                        />

                        {/* Seal glyph: faint etching when dormant, ember ink when kindled */}
                        <g transform={`translate(${rune.cx}, ${rune.cy}) scale(${glyphScale})`} pointerEvents="none">
                            <path
                                d={RUNE_PATHS[rune.id]}
                                className={isFilled ? 'pyro-rune-core' : 'pyro-rune-etch'}
                                fill="none"
                                stroke={isFilled ? (isHovered ? INK : band.ink) : (isHovered ? MUTED : ETCH)}
                                strokeWidth={isFilled ? 1.5 : 1.15}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </g>

                        {/* Stage 6: Heresy shackle */}
                        {rune.id === 6 && (
                            <path
                                d={`M ${rune.cx - 6} ${rune.cy + rune.r + 3.5} Q ${rune.cx} ${rune.cy + rune.r + 7.5} ${rune.cx + 6} ${rune.cy + rune.r + 3.5}`}
                                fill="none"
                                stroke={infernoLevel >= 6 ? BRICK : RULE}
                                strokeWidth="1.1"
                                strokeLinecap="round"
                            />
                        )}

                        {/* Stage 9: Oblivion maw fangs */}
                        {rune.id === 9 && (
                            <g stroke={isFilled ? BRICK : RULE} strokeWidth="1" strokeLinecap="round">
                                <line x1={rune.cx - 7} y1={rune.cy - rune.r - 4} x2={rune.cx - 4.5} y2={rune.cy - rune.r - 1.5} />
                                <line x1={rune.cx + 7} y1={rune.cy - rune.r - 4} x2={rune.cx + 4.5} y2={rune.cy - rune.r - 1.5} />
                                <line x1={rune.cx - 7} y1={rune.cy + rune.r + 4} x2={rune.cx - 4.5} y2={rune.cy + rune.r + 1.5} />
                                <line x1={rune.cx + 7} y1={rune.cy + rune.r + 4} x2={rune.cx + 4.5} y2={rune.cy + rune.r + 1.5} />
                            </g>
                        )}
                    </g>
                );
            })}

            {/* Debt Call latched: brick tally marks along the top margin */}
            {debtLatched && (
                <g className="pyro-debt-marks" pointerEvents="none" stroke={BRICK} strokeWidth="1" strokeLinecap="round">
                    <line x1="40" y1="12" x2="38.5" y2="16" />
                    <line x1="120" y1="12" x2="121" y2="16" />
                    <line x1="200" y1="12" x2="198.5" y2="16" />
                    <line x1="262" y1="12" x2="263" y2="16" />
                </g>
            )}
        </svg>
    );
};

export default PyrofiendVeilArt;
