import React from 'react';

/**
 * Detailed, animated SVG backdrops for every class row.
 * Each scene is hand-built to evoke the class's identity:
 *   Arcanoneer  -> an atom: 8 elemental electrons orbiting a pulsing nucleus
 *   Berserker   -> viscous blood reservoir, hanging drips & rising pool
 *   Shaper      -> a slowly turning yin-yang of balance & transformation
 *   Harbinger   -> spiralling ash vortex & entropy bolts
 *   Chronarch   -> grinding clockwork gears & sweeping hand
 *   Inquisitor  -> cold-iron barbed wire & vow-seal
 *   Revenant    -> souls spiralling into a phylactery
 *   False Prophet -> a blind all-seeing eye & writhing tendrils
 *   Gambit      -> gambler's felt: tumbling cards, spinning coins & dice
 *   Apex        -> a hunter's crosshair tracking through fog
 *   Animist     -> rising ancestor spirits & drum resonance
 *   Lunarch     -> a moon gliding through its phases
 *   Martyr      -> sacred heart, crown of thorns, rays & sacrificial blood
 *   Minstrel    -> music notes bobbing on a warm, glowing stage
 *   Plaguebringer -> toxic acid, rising poison gas, bubbles & corrosive drips
 *   Pyrofiend   -> a roaring wall of layered flames & embers
 *   Spellguard  -> a rune shield recoiling as it reflects an incoming spell
 *   Toxicologist -> bubbling corrosive acid
 *   Warden      -> a heavy catenary iron chain & manacle
 *   Augur       -> a scrying orb, fate-threads, omen stars & casting bones
 *
 * Motion is driven by CSS keyframes in ClassesDisplay.css that target
 * the .cbd-* element classes. Custom props (--tx/--ty/delay) let one
 * keyframe serve many elements with staggered timing.
 */

const SVG = ({ children }) => (
    <svg
        className="cbd-svg"
        viewBox="0 0 1200 140"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        focusable="false"
    >
        {children}
    </svg>
);

/* ----------------------------------------------------------------- */
/* 1. ARCANONEER                                                     */
/* ----------------------------------------------------------------- */
const Arcanoneer = () => {
    const RX = 212, RY = 50;
    // three orbital planes, each carrying elemental electrons (all 8 non-physical types)
    const rings = [
        { tilt: 0,   electrons: [['arc-ember', 0, 0], ['arc-storm', 120, 2.0], ['arc-wyrd', 240, 4.0]] },
        { tilt: 60,  electrons: [['arc-rime', 60, 1.0], ['arc-arcane', 180, 3.0], ['arc-blight', 300, 5.0]] },
        { tilt: 120, electrons: [['arc-primal', 30, 1.5], ['arc-sacred', 150, 3.5]] },
    ];
    return (
    <SVG>
        <defs>
            <radialGradient id="arc-ember"><stop offset="0%" stopColor="#ffd28a" /><stop offset="55%" stopColor="#ff5722" /><stop offset="100%" stopColor="#7a1f00" stopOpacity="0" /></radialGradient>
            <radialGradient id="arc-rime"><stop offset="0%" stopColor="#b3e5ff" /><stop offset="55%" stopColor="#4fc3f7" /><stop offset="100%" stopColor="#01579b" stopOpacity="0" /></radialGradient>
            <radialGradient id="arc-storm"><stop offset="0%" stopColor="#fff7c2" /><stop offset="55%" stopColor="#ffd54f" /><stop offset="100%" stopColor="#f57f17" stopOpacity="0" /></radialGradient>
            <radialGradient id="arc-arcane"><stop offset="0%" stopColor="#d1c4e9" /><stop offset="55%" stopColor="#9575cd" /><stop offset="100%" stopColor="#4527a0" stopOpacity="0" /></radialGradient>
            <radialGradient id="arc-wyrd"><stop offset="0%" stopColor="#ffc2dd" /><stop offset="55%" stopColor="#ec407a" /><stop offset="100%" stopColor="#880e4f" stopOpacity="0" /></radialGradient>
            <radialGradient id="arc-primal"><stop offset="0%" stopColor="#c4f0a8" /><stop offset="55%" stopColor="#66bb6a" /><stop offset="100%" stopColor="#1b5e20" stopOpacity="0" /></radialGradient>
            <radialGradient id="arc-blight"><stop offset="0%" stopColor="#e0b0ff" /><stop offset="55%" stopColor="#8e44ad" /><stop offset="100%" stopColor="#3a0a55" stopOpacity="0" /></radialGradient>
            <radialGradient id="arc-sacred"><stop offset="0%" stopColor="#fffbe0" /><stop offset="55%" stopColor="#ffe082" /><stop offset="100%" stopColor="#b8860b" stopOpacity="0" /></radialGradient>
            <radialGradient id="arc-nucleus"><stop offset="0%" stopColor="#ffffff" /><stop offset="30%" stopColor="#e9d4ff" /><stop offset="70%" stopColor="#8e5bd6" /><stop offset="100%" stopColor="#3a1a70" stopOpacity="0" /></radialGradient>
            <radialGradient id="arc-flash"><stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" /><stop offset="100%" stopColor="#ffffff" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="1200" height="140" fill="#150d1a" />
        <circle cx="600" cy="70" r="120" fill="none" stroke="#7c4fd6" strokeOpacity="0.12" />
        {/* orbital planes with orbiting elemental electrons */}
        {rings.map((ring, ri) => (
            <g key={ri} transform={`rotate(${ring.tilt} 600 70)`}>
                <ellipse cx="600" cy="70" rx={RX} ry={RY} fill="none" stroke="#caa6ff" strokeOpacity="0.20" strokeWidth="1.5" />
                {ring.electrons.map(([grad, phi, delay], ei) => (
                    <g key={ei} transform={`rotate(${phi} 600 70)`}>
                        <g className="cbd-arc-orbit" style={{ transformOrigin: '600px 70px', animationDelay: delay + 's' }}>
                            <circle cx={600 + RX} cy="70" r="15" fill={`url(#${grad})`} />
                        </g>
                    </g>
                ))}
            </g>
        ))}
        {/* pulsing nucleus + merge flash */}
        <circle className="cbd-arc-nucleus" cx="600" cy="70" r="34" fill="url(#arc-nucleus)" style={{ transformOrigin: '600px 70px' }} />
        <circle className="cbd-arc-flash" cx="600" cy="70" r="50" fill="url(#arc-flash)" />
    </SVG>
    );
};

/* ----------------------------------------------------------------- */
/* 2. BERSERKER                                                      */
/* ----------------------------------------------------------------- */
const Berserker = () => (
    <SVG>
        <defs>
            <linearGradient id="bers-mass" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d6202c" /><stop offset="55%" stopColor="#a3121c" /><stop offset="100%" stopColor="#5e0710" /></linearGradient>
            <radialGradient id="bers-drop"><stop offset="0%" stopColor="#ff4448" /><stop offset="70%" stopColor="#c41828" /><stop offset="100%" stopColor="#6a060c" /></radialGradient>
        </defs>
        <rect width="1200" height="140" fill="#140303" />
        {/* top blood reservoir */}
        <path d="M0 0 H1200 V24 Q1140 44 1080 24 Q1020 46 960 22 Q900 46 840 24 Q780 46 720 22 Q660 46 600 24 Q540 46 480 22 Q420 46 360 24 Q300 46 240 22 Q180 46 120 24 Q60 46 0 24 Z" fill="url(#bers-mass)" />
        {/* glossy specular highlight along the reservoir */}
        <path d="M20 10 Q60 28 120 12 Q180 30 240 10 Q300 28 360 12 Q420 30 480 10 Q540 28 600 12 Q660 30 720 10 Q780 28 840 12 Q900 30 960 10 Q1020 28 1080 12 Q1140 30 1180 10" fill="none" stroke="#ff8a8e" strokeOpacity="0.45" strokeWidth="2.5" />
        {/* hanging viscous drips - thin tail + bulb, with specular dot */}
        {[
            { x: 150, len: 50 }, { x: 350, len: 78 }, { x: 560, len: 40 },
            { x: 760, len: 66 }, { x: 980, len: 56 }, { x: 1110, len: 34 }
        ].map((h, i) => (
            <g key={'h' + i}>
                <path d={`M${h.x - 2} 22 L${h.x - 3} ${20 + h.len - 8} Q${h.x - 4} ${20 + h.len} ${h.x} ${20 + h.len} Q${h.x + 4} ${20 + h.len} ${h.x + 3} ${20 + h.len - 8} L${h.x + 2} 22 Z`} fill="url(#bers-mass)" />
                <circle cx={h.x - 1.5} cy={20 + h.len - 4} r="1.6" fill="#ffb0b3" opacity="0.7" />
            </g>
        ))}
        {/* falling droplets with motion streak */}
        {[150, 350, 560, 760, 980].map((x, i) => (
            <g key={'d' + i} className="cbd-bers-drip" style={{ animationDelay: (i * 0.6) + 's' }}>
                <rect x={x - 0.8} y="14" width="1.6" height="14" fill="#c41828" opacity="0.55" />
                <circle cx={x} cy="30" r="5" fill="url(#bers-drop)" />
                <circle cx={x - 1.5} cy="28" r="1.6" fill="#ff9498" opacity="0.8" />
            </g>
        ))}
        {/* blood splatter */}
        {[[120, 96], [300, 110], [620, 102], [820, 112], [1020, 98]].map(([x, y], i) => (
            <circle key={'sp' + i} cx={x} cy={y} r="2.4" fill="#a3121c" opacity="0.7" />
        ))}
        {/* rising pool */}
        <path className="cbd-bers-pool" d="M0 140 H1200 V122 Q900 110 600 120 Q300 110 0 122 Z" fill="#4c0709" opacity="0.92" />
        <rect className="cbd-bers-pulse" x="0" y="0" width="1200" height="140" fill="#c41e3a" opacity="0.12" />
    </SVG>
);

/* ----------------------------------------------------------------- */
/* 3. SHAPER                                                         */
/* ----------------------------------------------------------------- */
const Shaper = () => (
    <SVG>
        <defs>
            <radialGradient id="shap-glow"><stop offset="0%" stopColor="#f0e2c0" stopOpacity="0.45" /><stop offset="100%" stopColor="#f0e2c0" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="1200" height="140" fill="#15110d" />
        <circle cx="600" cy="70" r="84" fill="url(#shap-glow)" />
        {/* slowly counter-rotating notched ring - the shaping energy */}
        <g className="cbd-shap-ring" style={{ transformOrigin: '600px 70px' }}>
            <circle cx="600" cy="70" r="62" fill="none" stroke="#c9a86a" strokeOpacity="0.28" strokeWidth="1.5" strokeDasharray="3 9" />
        </g>
        {/* the yin-yang: balance & transformation made flesh */}
        <g className="cbd-shap-yin" style={{ transformOrigin: '600px 70px' }}>
            <circle cx="600" cy="70" r="46" fill="#241a12" />
            <path d="M600 24 A46 46 0 1 1 600 116 A23 23 0 1 1 600 70 A23 23 0 1 0 600 24 Z" fill="#efe0c6" />
            <circle cx="600" cy="47" r="8" fill="#241a12" />
            <circle cx="600" cy="93" r="8" fill="#efe0c6" />
        </g>
    </SVG>
);

/* ----------------------------------------------------------------- */
/* 4. HARBINGER                                                      */
/* ----------------------------------------------------------------- */
const Harbinger = () => (
    <SVG>
        <defs>
            <radialGradient id="harb-eye"><stop offset="0%" stopColor="#c79be8" /><stop offset="60%" stopColor="#7e3ca0" /><stop offset="100%" stopColor="#2a0f3a" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="1200" height="140" fill="#191021" />
        <circle cx="600" cy="70" r="60" fill="url(#harb-eye)" opacity="0.7" />
        <g className="cbd-harb-spiral">
            {Array.from({ length: 16 }).map((_, i) => {
                const a = (i / 16) * Math.PI * 2;
                const r = 30 + i * 5;
                return <circle key={i} cx={600 + Math.cos(a) * r} cy={70 + Math.sin(a) * r * 0.5} r={2 + (i % 3)} fill="#d9c3f0" opacity={0.25 + (i % 4) * 0.15} />;
            })}
        </g>
        <polyline className="cbd-harb-bolt" points="300,20 340,55 320,60 370,110" fill="none" stroke="#c79be8" strokeWidth="2" strokeOpacity="0.7" />
        <polyline className="cbd-harb-bolt cbd-harb-bolt--b" points="900,30 870,62 890,68 850,118" fill="none" stroke="#b388d6" strokeWidth="1.5" strokeOpacity="0.6" />
    </SVG>
);

/* ----------------------------------------------------------------- */
/* 5. CHRONARCH                                                      */
/* ----------------------------------------------------------------- */
const Chronarch = () => (
    <SVG>
        <defs>
            <radialGradient id="chron-hub"><stop offset="0%" stopColor="#e0c878" /><stop offset="100%" stopColor="#7a5a18" /></radialGradient>
        </defs>
        <rect width="1200" height="140" fill="#13101e" />
        <g className="cbd-chron-gear cbd-chron-gear--cw" style={{ transformOrigin: '300px 70px' }}>
            <circle cx="300" cy="70" r="52" fill="none" stroke="#b89640" strokeWidth="14" strokeDasharray="20 14" strokeOpacity="0.55" />
            <circle cx="300" cy="70" r="38" fill="none" stroke="#8a6c20" strokeWidth="2" strokeOpacity="0.5" />
            <circle cx="300" cy="70" r="9" fill="url(#chron-hub)" />
        </g>
        <g className="cbd-chron-gear cbd-chron-gear--ccw" style={{ transformOrigin: '900px 70px' }}>
            <circle cx="900" cy="70" r="40" fill="none" stroke="#b89640" strokeWidth="12" strokeDasharray="16 12" strokeOpacity="0.5" />
            <circle cx="900" cy="70" r="7" fill="url(#chron-hub)" />
        </g>
        <circle cx="600" cy="70" r="46" fill="none" stroke="#b89640" strokeWidth="2" strokeOpacity="0.4" />
        <circle cx="600" cy="70" r="46" fill="none" stroke="#b89640" strokeOpacity="0.3" strokeDasharray="2 12" />
        <g className="cbd-chron-hand"><rect x="598" y="32" width="4" height="40" fill="#e0c878" rx="2" /></g>
        <circle cx="600" cy="70" r="5" fill="#e0c878" />
    </SVG>
);

/* ----------------------------------------------------------------- */
/* 6. INQUISITOR                                                     */
/* ----------------------------------------------------------------- */
const Inquisitor = () => (
    <SVG>
        <defs>
            <radialGradient id="inq-seal"><stop offset="0%" stopColor="#ff5a4d" /><stop offset="100%" stopColor="#5a0000" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="1200" height="140" fill="#160405" />
        <g className="cbd-inq-wire" fill="none" stroke="#7a0a0a" strokeWidth="2.5" strokeOpacity="0.6">
            <path d="M0 48 H1200" />
            {[120, 360, 600, 840, 1080].map((x) => (
                <path key={x} d={`M${x} 48 l10 -12 l10 12 l10 -12 l10 12`} />
            ))}
        </g>
        <g className="cbd-inq-wire cbd-inq-wire--b" fill="none" stroke="#6a0000" strokeWidth="2" strokeOpacity="0.5">
            <path d="M0 96 H1200" />
            {[240, 720].map((x) => (
                <path key={x} d={`M${x} 96 l-10 -10 l-10 10 l-10 -10 l-10 10`} />
            ))}
        </g>
        <circle className="cbd-inq-seal" cx="600" cy="70" r="70" fill="url(#inq-seal)" />
        <g className="cbd-inq-cross" stroke="#e0463a" strokeWidth="3" strokeOpacity="0.7" fill="none">
            <line x1="600" y1="40" x2="600" y2="100" />
            <line x1="572" y1="64" x2="628" y2="64" />
        </g>
    </SVG>
);

/* ----------------------------------------------------------------- */
/* 7. REVENANT                                                       */
/* ----------------------------------------------------------------- */
const Revenant = () => (
    <SVG>
        <defs>
            <radialGradient id="rev-gem"><stop offset="0%" stopColor="#a8f0c4" /><stop offset="55%" stopColor="#37b86c" /><stop offset="100%" stopColor="#0c2a18" stopOpacity="0" /></radialGradient>
            <radialGradient id="rev-soul"><stop offset="0%" stopColor="#c8ffe0" /><stop offset="100%" stopColor="#37b86c" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="1200" height="140" fill="#15110b" />
        <g className="cbd-rev-spiral">
            {Array.from({ length: 10 }).map((_, i) => {
                const a = (i / 10) * Math.PI * 2;
                const r = 120 - i * 10;
                return <circle key={i} cx={600 + Math.cos(a) * r} cy={70 + Math.sin(a) * r * 0.55} r="6" fill="url(#rev-soul)" opacity="0.7" />;
            })}
        </g>
        <circle className="cbd-rev-gem" cx="600" cy="70" r="40" fill="url(#rev-gem)" />
        <path d="M600 50 l16 12 l-6 20 l-20 0 l-6 -20 Z" fill="#1a3a26" stroke="#7ef0a8" strokeWidth="1.5" strokeOpacity="0.7" />
    </SVG>
);

/* ----------------------------------------------------------------- */
/* 8. FALSE PROPHET                                                  */
/* ----------------------------------------------------------------- */
const FalseProphet = () => (
    <SVG>
        <defs>
            <radialGradient id="fp-iris"><stop offset="0%" stopColor="#fff3b0" /><stop offset="60%" stopColor="#caa030" /><stop offset="100%" stopColor="#3a2a00" /></radialGradient>
            <radialGradient id="fp-glow"><stop offset="0%" stopColor="#9b59b6" stopOpacity="0.5" /><stop offset="100%" stopColor="#9b59b6" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="1200" height="140" fill="#140a1a" />
        {[[150, 1], [1050, -1]].map(([x, d]) => (
            <g key={x} className="cbd-fp-tendril" style={{ transformOrigin: `${x}px 70px` }}>
                <path d={`M${x} 70 q ${24 * d} -28 ${48 * d} -10 q ${18 * d} 20 ${40 * d} 6`} fill="none" stroke="#7e4a99" strokeWidth="3" strokeOpacity="0.45" />
                <path d={`M${x} 70 q ${24 * d} 28 ${48 * d} 10 q ${18 * d} -20 ${40 * d} -6`} fill="none" stroke="#7e4a99" strokeWidth="3" strokeOpacity="0.4" />
            </g>
        ))}
        <circle cx="600" cy="70" r="95" fill="url(#fp-glow)" />
        <path d="M500 70 Q600 18 700 70 Q600 122 500 70 Z" fill="#f4ecd8" opacity="0.92" />
        <circle className="cbd-fp-iris" cx="600" cy="70" r="26" fill="url(#fp-iris)" />
        <circle cx="600" cy="70" r="9" fill="#0a0408" />
        <circle cx="594" cy="64" r="3" fill="#fff" opacity="0.8" />
    </SVG>
);

/* ----------------------------------------------------------------- */
/* 9. GAMBIT                                                         */
/* ----------------------------------------------------------------- */
const Gambit = () => (
    <SVG>
        <defs>
            <radialGradient id="gamb-felt" cx="50%" cy="65%" r="62%"><stop offset="0%" stopColor="#1f6e44" /><stop offset="100%" stopColor="#0d1408" stopOpacity="0" /></radialGradient>
            <linearGradient id="gamb-coin" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fff3b0" /><stop offset="50%" stopColor="#e8c44a" /><stop offset="100%" stopColor="#8a6a10" /></linearGradient>
            <linearGradient id="gamb-card" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fbf3d0" /><stop offset="100%" stopColor="#d8be78" /></linearGradient>
        </defs>
        <rect width="1200" height="140" fill="#0d1408" />
        <ellipse cx="600" cy="92" rx="540" ry="74" fill="url(#gamb-felt)" />
        {/* faint probability threads */}
        <g stroke="#e8c44a" strokeOpacity="0.16" fill="none" strokeWidth="1.5">
            <path d="M0 112 Q300 62 600 102 T1200 92" />
            <path d="M0 82 Q300 122 600 72 T1200 102" />
        </g>
        {/* tumbling playing cards */}
        {[[200, -12, 0], [560, 16, 0.7], [920, -8, 1.3]].map(([x, r, d], i) => (
            <g key={'c' + i} className="cbd-gamb-card" style={{ animationDelay: d + 's' }}>
                <rect x={x} y="-34" width="40" height="54" rx="5" fill="url(#gamb-card)" stroke="#7a6010" strokeWidth="1.5" transform={`rotate(${r} ${x + 20} -7)`} />
                <path d={`M${x + 20} -16 C ${x + 20} -8, ${x + 10} -8, ${x + 10} 0 C ${x + 10} 8, ${x + 20} 8, ${x + 20} 0 C ${x + 20} 8, ${x + 30} 8, ${x + 30} 0 C ${x + 30} -8, ${x + 20} -8, ${x + 20} -16 Z`} fill="#b2102e" />
            </g>
        ))}
        {/* flipping gold coins */}
        {[[340, 0], [640, 0.8], [980, 1.5], [150, 1.1]].map(([x, d], i) => (
            <g key={'coin' + i} className="cbd-gamb-coin" style={{ animationDelay: d + 's' }}>
                <circle cx={x} cy="-14" r="13" fill="url(#gamb-coin)" stroke="#8a6a10" strokeWidth="1.5" />
                <circle cx={x} cy="-14" r="7" fill="none" stroke="#fff3b0" strokeOpacity="0.7" strokeWidth="1.5" />
                <text x={x} y="-9" textAnchor="middle" fontSize="11" fill="#8a6a10" fontWeight="700" fontFamily="serif">G</text>
            </g>
        ))}
        {/* tumbling dice */}
        {[[470, -16, 0.4], [800, 14, 1.1], [1080, -10, 1.8]].map(([x, r, d], i) => (
            <g key={'d' + i} className="cbd-gamb-die" style={{ animationDelay: d + 's' }}>
                <rect x={x} y="-26" width="30" height="30" rx="6" fill="#fbf3d0" stroke="#7a6010" strokeWidth="1.5" transform={`rotate(${r} ${x + 15} -11)`} />
                <circle cx={x + 9} cy="-17" r="2.4" fill="#2a1a00" />
                <circle cx={x + 21} cy="-17" r="2.4" fill="#2a1a00" />
                <circle cx={x + 15} cy="-9" r="2.4" fill="#2a1a00" />
            </g>
        ))}
    </SVG>
);

/* ----------------------------------------------------------------- */
/* 10. APEX                                                          */
/* ----------------------------------------------------------------- */
const Apex = () => (
    <SVG>
        <defs>
            <radialGradient id="apx-fog"><stop offset="0%" stopColor="#3a201c" stopOpacity="0.6" /><stop offset="100%" stopColor="#3a201c" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="1200" height="140" fill="#17100e" />
        <ellipse className="cbd-apx-fog" cx="300" cy="70" rx="260" ry="70" fill="url(#apx-fog)" />
        <ellipse className="cbd-apx-fog cbd-apx-fog--b" cx="900" cy="70" rx="300" ry="80" fill="url(#apx-fog)" />
        <g className="cbd-apx-cross">
            <circle cx="0" cy="70" r="34" fill="none" stroke="#e74c3c" strokeWidth="2" strokeOpacity="0.8" />
            <circle cx="0" cy="70" r="3" fill="#ff6b5a" />
            <line x1="-46" y1="70" x2="-22" y2="70" stroke="#e74c3c" strokeWidth="2" />
            <line x1="22" y1="70" x2="46" y2="70" stroke="#e74c3c" strokeWidth="2" />
            <line x1="0" y1="24" x2="0" y2="48" stroke="#e74c3c" strokeWidth="2" />
            <line x1="0" y1="92" x2="0" y2="116" stroke="#e74c3c" strokeWidth="2" />
        </g>
    </SVG>
);

/* ----------------------------------------------------------------- */
/* 11. ANIMIST                                                       */
/* ----------------------------------------------------------------- */
const Animist = () => (
    <SVG>
        <defs>
            <radialGradient id="anim-soul"><stop offset="0%" stopColor="#d8ffe6" /><stop offset="100%" stopColor="#2ecc71" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="1200" height="140" fill="#0e160e" />
        {[0, 1, 2].map((i) => (
            <circle key={i} className="cbd-anim-ring" cx="600" cy="130" r="20" fill="none" stroke="#2ecc71" strokeWidth="2" strokeOpacity="0.4" style={{ animationDelay: `${i * 1.3}s` }} />
        ))}
        {[[260, 0], [600, 0.8], [940, 1.6]].map(([x, d]) => (
            <g key={x} className="cbd-anim-spirit" style={{ animationDelay: `${d}s` }}>
                <ellipse cx={x} cy="150" rx="16" ry="26" fill="url(#anim-soul)" />
                <circle cx={x} cy="128" r="9" fill="url(#anim-soul)" />
            </g>
        ))}
    </SVG>
);

/* ----------------------------------------------------------------- */
/* 12. LUNARCH                                                       */
/* ----------------------------------------------------------------- */
const Lunarch = () => (
    <SVG>
        <defs>
            <radialGradient id="lun-glow"><stop offset="0%" stopColor="#fff6c8" /><stop offset="60%" stopColor="#f1c40f" /><stop offset="100%" stopColor="#5a4a00" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="1200" height="140" fill="#10140a" />
        <g stroke="#f1c40f" strokeOpacity="0.14" fill="none">
            <path d="M0 100 Q300 60 600 100 T1200 100" />
            <path d="M0 70 Q300 110 600 70 T1200 70" />
        </g>
        {[[150, 0.35], [320, 0.6], [880, 0.6], [1050, 0.35]].map(([x, o]) => (
            <g key={x}>
                <circle cx={x} cy="70" r="18" fill="#2a2614" />
                <circle cx={x} cy="70" r="18" fill="#f1c40f" opacity={o} />
            </g>
        ))}
        <g className="cbd-lun-moon">
            <circle cx="0" cy="70" r="40" fill="url(#lun-glow)" />
            <circle cx="0" cy="70" r="26" fill="#fbf3c0" />
            <circle cx="0" cy="70" r="26" fill="#10140a" transform="translate(14 0)" />
        </g>
    </SVG>
);

/* ----------------------------------------------------------------- */
/* 13. MARTYR                                                        */
/* ----------------------------------------------------------------- */
const Martyr = () => (
    <SVG>
        <defs>
            <radialGradient id="mart-halo"><stop offset="0%" stopColor="#ffe082" /><stop offset="55%" stopColor="#ff9a3c" stopOpacity="0.5" /><stop offset="100%" stopColor="#ff9a3c" stopOpacity="0" /></radialGradient>
            <radialGradient id="mart-heart" cx="50%" cy="38%"><stop offset="0%" stopColor="#ff6a5a" /><stop offset="100%" stopColor="#6e0810" /></radialGradient>
        </defs>
        <rect width="1200" height="140" fill="#0b0810" />
        {/* radiating sacred rays */}
        <g className="cbd-mart-rays" stroke="#ffd479" strokeOpacity="0.32" strokeWidth="2.5">
            {Array.from({ length: 14 }).map((_, i) => {
                const a = (i / 14) * Math.PI * 2;
                return <line key={i} x1={600 + Math.cos(a) * 46} y1={72 + Math.sin(a) * 24} x2={600 + Math.cos(a) * 130} y2={72 + Math.sin(a) * 60} />;
            })}
        </g>
        <circle className="cbd-mart-halo" cx="600" cy="72" r="120" fill="url(#mart-halo)" />
        {/* crown of thorns */}
        <g className="cbd-mart-crown" transform="translate(600 36)">
            <circle r="22" fill="none" stroke="#6e4218" strokeWidth="5" />
            <circle r="22" fill="none" stroke="#8a5a24" strokeWidth="2" strokeOpacity="0.6" />
            {Array.from({ length: 12 }).map((_, i) => {
                const a = (i / 12) * Math.PI * 2;
                return <line key={i} x1={Math.cos(a) * 22} y1={Math.sin(a) * 22} x2={Math.cos(a) * 34} y2={Math.sin(a) * 34} stroke="#5a3a14" strokeWidth="3.5" />;
            })}
        </g>
        {/* sacred heart with flame */}
        <g className="cbd-mart-heart" transform="translate(600 80)">
            <path d="M0 18 C 0 4, -22 4, -22 -10 C -22 -24, 0 -24, 0 -10 C 0 -24, 22 -24, 22 -10 C 22 4, 0 4, 0 18 Z" fill="url(#mart-heart)" stroke="#ff8a5a" strokeWidth="1.5" strokeOpacity="0.7" />
            <path d="M0 -14 Q -8 -26 0 -36 Q 8 -26 0 -14 Z" fill="#ffb74d" />
            <line x1="0" y1="-36" x2="0" y2="-46" stroke="#ffe082" strokeWidth="2.5" />
            <line x1="0" y1="18" x2="-7" y2="26" stroke="#6e0810" strokeWidth="3" />
            <line x1="0" y1="18" x2="7" y2="26" stroke="#6e0810" strokeWidth="3" />
        </g>
        {/* blood falling from the crown */}
        {[582, 600, 618].map((x, i) => (
            <g key={'b' + i} className="cbd-mart-blood" style={{ animationDelay: (i * 0.5) + 's' }}>
                <circle cx={x} cy="60" r="4" fill="#c41e3a" />
            </g>
        ))}
    </SVG>
);

/* ----------------------------------------------------------------- */
/* 14. MINSTREL                                                      */
/* ----------------------------------------------------------------- */
const Minstrel = () => {
    const Note = ({ x, y, s = 1, delay, dur }) => (
        <g className="cbd-min-note" style={{ animationDelay: delay + 's', animationDuration: dur + 's' }}>
            <ellipse cx={x} cy={y} rx={7 * s} ry={5 * s} fill="#f3d27a" transform={`rotate(-20 ${x} ${y})`} />
            <rect x={x + 6 * s} y={y - 30 * s} width={2.4 * s} height={30 * s} fill="#f3d27a" />
            <path d={`M${x + 8.4 * s} ${y - 30 * s} q 13 ${3 * s} 8 ${19 * s} q 3 ${-13 * s} -8 ${-15 * s} Z`} fill="#f3d27a" />
        </g>
    );
    const Beamed = ({ x, y, s = 1, delay, dur }) => (
        <g className="cbd-min-note" style={{ animationDelay: delay + 's', animationDuration: dur + 's' }}>
            <ellipse cx={x} cy={y} rx={7 * s} ry={5 * s} fill="#f3d27a" transform={`rotate(-20 ${x} ${y})`} />
            <rect x={x + 6 * s} y={y - 30 * s} width={2.4 * s} height={30 * s} fill="#f3d27a" />
            <ellipse cx={x + 24 * s} cy={y + 4 * s} rx={7 * s} ry={5 * s} fill="#f3d27a" transform={`rotate(-20 ${x + 24 * s} ${y + 4 * s})`} />
            <rect x={x + 30 * s} y={y - 26 * s} width={2.4 * s} height={30 * s} fill="#f3d27a" />
            <rect x={x + 6 * s} y={y - 30 * s} width={26 * s} height={4 * s} fill="#f3d27a" />
        </g>
    );
    return (
    <SVG>
        <defs>
            <linearGradient id="min-bg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2a1d10" />
                <stop offset="50%" stopColor="#1a120a" />
                <stop offset="100%" stopColor="#0d0905" />
            </linearGradient>
            <radialGradient id="min-stage"><stop offset="0%" stopColor="#f3d27a" stopOpacity="0.30" /><stop offset="100%" stopColor="#f3d27a" stopOpacity="0" /></radialGradient>
        </defs>
        {/* thematic background: warm stage glow */}
        <rect width="1200" height="140" fill="url(#min-bg)" />
        <ellipse className="cbd-min-stage" cx="600" cy="74" rx="340" ry="64" fill="url(#min-stage)" />
        {/* musical staff lines */}
        <g stroke="#f3d27a" strokeOpacity="0.12" strokeWidth="1">
            {[34, 46, 58, 70, 82].map((y) => (<line key={y} x1="0" y1={y} x2="1200" y2={y} />))}
        </g>
        {/* floating music notes */}
        <Note x={170} y={98} s={1} delay={0} dur={4.2} />
        <Beamed x={330} y={62} s={1.05} delay={0.6} dur={4.8} />
        <Note x={560} y={100} s={0.95} delay={1.1} dur={4.0} />
        <Beamed x={730} y={58} s={1.1} delay={0.3} dur={5.2} />
        <Note x={960} y={96} s={1} delay={1.6} dur={4.4} />
        <Note x={1080} y={66} s={0.9} delay={0.9} dur={4.6} />
    </SVG>
    );
};

/* ----------------------------------------------------------------- */
/* 15. PLAGUEBRINGER                                                 */
/* ----------------------------------------------------------------- */
const Plaguebringer = () => (
    <SVG>
        <defs>
            <linearGradient id="plag-acid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d6ff4a" stopOpacity="0.95" /><stop offset="100%" stopColor="#4a7818" /></linearGradient>
            <radialGradient id="plag-gas"><stop offset="0%" stopColor="#e8ff9a" stopOpacity="0.8" /><stop offset="100%" stopColor="#9ab030" stopOpacity="0" /></radialGradient>
            <radialGradient id="plag-bub"><stop offset="0%" stopColor="#f2ffb0" /><stop offset="100%" stopColor="#9ac830" stopOpacity="0" /></radialGradient>
            <radialGradient id="plag-bio"><stop offset="0%" stopColor="#ecff8a" /><stop offset="70%" stopColor="#9ad62b" /><stop offset="100%" stopColor="#3f6b12" /></radialGradient>
            <radialGradient id="plag-bioled"><stop offset="0%" stopColor="#f4ffb8" /><stop offset="100%" stopColor="#5e9b1e" /></radialGradient>
        </defs>
        <rect width="1200" height="140" fill="#0a0f06" />
        {/* ambient toxic haze */}
        <ellipse cx="600" cy="74" rx="300" ry="60" fill="#8db52b" opacity="0.10" />
        {/* central biohazard trefoil motif */}
        <g transform="translate(600 74)">
            <circle r="46" fill="none" stroke="#9ad62b" strokeOpacity="0.4" strokeWidth="2" />
            <g className="cbd-plag-bio" fill="url(#plag-bio)" stroke="#3f6b12" strokeWidth="1.5">
                {/* three ring-arcs forming the trefoil */}
                {[0, 120, 240].map((rot) => (
                    <g key={rot} transform={`rotate(${rot})`}>
                        <path d="M0 -44 A44 44 0 0 1 38 -22 Q26 -16 18 -20 A30 30 0 0 0 0 -30 A30 30 0 0 0 -18 -20 Q-26 -16 -38 -22 A44 44 0 0 1 0 -44 Z" transform="translate(0 18)" />
                    </g>
                ))}
                {/* center hub */}
                <circle r="7" fill="url(#plag-bioled)" />
            </g>
        </g>
        {/* toxic liquid surface */}
        <path className="cbd-plag-acid" d="M-200 116 Q0 102 200 116 T600 116 T1000 116 T1400 116 L1400 140 L-200 140 Z" fill="url(#plag-acid)" />
        <path className="cbd-plag-acid" d="M-200 116 Q0 102 200 116 T600 116 T1000 116 T1400 116" fill="none" stroke="#f2ffb0" strokeOpacity="0.6" strokeWidth="2" />
        {/* rising poison gas clouds */}
        {[[260, 0], [560, 1], [860, 0.5], [1060, 1.4]].map(([x, d], i) => (
            <ellipse key={'g' + i} className="cbd-plag-gas" cx={x} cy="100" rx="34" ry="22" fill="url(#plag-gas)" style={{ animationDelay: d + 's' }} />
        ))}
        {/* bubbles in the brew */}
        {[[200, 0], [420, 0.6], [640, 1.2], [820, 0.3], [1040, 0.9]].map(([x, d], i) => (
            <circle key={'b' + i} className="cbd-plag-bubble" cx={x} cy="116" r="7" fill="url(#plag-bub)" style={{ animationDelay: d + 's' }} />
        ))}
        {/* slime drips from the top */}
        {[340, 700, 980].map((x, i) => (
            <g key={'d' + i} className="cbd-plag-drip" style={{ animationDelay: (i * 0.7) + 's' }}>
                <rect x={x} y="0" width="2.4" height="22" fill="#c4f04a" opacity="0.6" />
                <circle cx={x + 1.2} cy="24" r="4.5" fill="#c4f04a" />
            </g>
        ))}
    </SVG>
);

/* ----------------------------------------------------------------- */
/* 16. PYROFIEND                                                     */
/* ----------------------------------------------------------------- */
const Pyrofiend = () => (
    <SVG>
        <defs>
            <radialGradient id="pyr-glow" cx="50%" cy="100%"><stop offset="0%" stopColor="#ff7a1f" /><stop offset="100%" stopColor="#ff7a1f" stopOpacity="0" /></radialGradient>
            <linearGradient id="pyr-dim" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="#5a1400" /><stop offset="60%" stopColor="#a51e08" /><stop offset="100%" stopColor="#a51e08" stopOpacity="0" /></linearGradient>
            <linearGradient id="pyr-hot" x1="0" y1="1" x2="0" y2="0"><stop offset="0%" stopColor="#fff3b0" /><stop offset="35%" stopColor="#ffb13c" /><stop offset="72%" stopColor="#e0340d" /><stop offset="100%" stopColor="#e0340d" stopOpacity="0" /></linearGradient>
        </defs>
        <rect width="1200" height="140" fill="#14070a" />
        <ellipse className="cbd-pyr-glow" cx="600" cy="140" rx="640" ry="82" fill="url(#pyr-glow)" />
        {/* back flames - dim, tall */}
        {[60, 200, 340, 480, 620, 760, 900, 1040, 1180].map((x, i) => (
            <path key={'bf' + i} className="cbd-pyr-flame cbd-pyr-flame--back" d={`M${x} 140 q ${-26} ${-58} 0 ${-94} q ${26} ${36} 0 ${94} Z`} fill="url(#pyr-dim)" style={{ animationDelay: (i * 0.18) + 's' }} />
        ))}
        {/* front flames - hot, bright */}
        {[130, 270, 410, 550, 690, 830, 970, 1110].map((x, i) => (
            <path key={'ff' + i} className="cbd-pyr-flame" d={`M${x} 140 q ${-18} ${-46} 0 ${-78} q ${18} ${30} 0 ${78} Z`} fill="url(#pyr-hot)" style={{ animationDelay: (i * 0.22 + 0.1) + 's' }} />
        ))}
        {/* embers */}
        {[[220, 0], [500, 0.5], [780, 1.0], [1060, 1.4], [360, 1.7], [920, 0.3]].map(([x, d], i) => (
            <circle key={'e' + i} className="cbd-pyr-ember" cx={x} cy="140" r="3" fill="#ffd28a" style={{ animationDelay: d + 's' }} />
        ))}
    </SVG>
);

/* ----------------------------------------------------------------- */
/* 17. SPELLGUARD                                                    */
/* ----------------------------------------------------------------- */
const Spellguard = () => (
    <SVG>
        <defs>
            <linearGradient id="spg-face" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3a78b8" /><stop offset="100%" stopColor="#0a1c2e" /></linearGradient>
            <radialGradient id="spg-flash"><stop offset="0%" stopColor="#ffffff" /><stop offset="100%" stopColor="#7ec8ff" stopOpacity="0" /></radialGradient>
            <linearGradient id="spg-bolt" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#cdeaff" stopOpacity="0" /><stop offset="100%" stopColor="#cdeaff" /></linearGradient>
        </defs>
        <rect width="1200" height="140" fill="#07111c" />
        {/* rotating arcane ring */}
        <g className="cbd-spg-ring" fill="none" stroke="#3a78b8" strokeOpacity="0.3">
            <circle cx="610" cy="72" r="64" strokeDasharray="3 10" strokeWidth="2" />
            <circle cx="610" cy="72" r="78" strokeDasharray="2 16" strokeWidth="1.5" strokeOpacity="0.2" />
        </g>
        {/* the shield */}
        <g className="cbd-spg-shield">
            <path d="M560 28 L660 28 L660 72 Q660 110 610 126 Q560 110 560 72 Z" fill="url(#spg-face)" stroke="#7ec8ff" strokeWidth="3" />
            <path d="M560 28 L660 28 L660 72 Q660 110 610 126 Q560 110 560 72 Z" fill="none" stroke="#cdeaff" strokeOpacity="0.4" strokeWidth="1" />
            <circle cx="610" cy="66" r="15" fill="none" stroke="#7ec8ff" strokeWidth="2" />
            <path d="M610 55 L610 77 M599 66 L621 66" stroke="#cdeaff" strokeWidth="2.5" />
        </g>
        {/* impact flash on the shield's left edge */}
        <circle className="cbd-spg-flash" cx="556" cy="60" r="28" fill="url(#spg-flash)" />
        {/* incoming spell bolt, flying in from the left */}
        <path className="cbd-spg-in" d="M360 58 L420 50 L448 62 L492 48 L548 58" fill="none" stroke="url(#spg-bolt)" strokeWidth="3.5" />
        {/* reflected bolt, flying out to the right */}
        <path className="cbd-spg-out" d="M672 54 L732 46 L760 58 L804 44 L860 54" fill="none" stroke="url(#spg-bolt)" strokeWidth="3.5" transform="translate(-40 0)" />
    </SVG>
);

/* ----------------------------------------------------------------- */
/* 18. TOXICOLOGIST                                                  */
/* ----------------------------------------------------------------- */
const Toxicologist = () => (
    <SVG>
        <defs>
            <linearGradient id="tox-acid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9ccc4a" stopOpacity="0.6" /><stop offset="100%" stopColor="#4a6a18" /></linearGradient>
            <radialGradient id="tox-bub"><stop offset="0%" stopColor="#d8f08a" /><stop offset="100%" stopColor="#7cb342" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="1200" height="140" fill="#0f1608" />
        <path className="cbd-tox-surface" d="M-200 110 Q0 96 200 110 T600 110 T1000 110 T1400 110 L1400 140 L-200 140 Z" fill="url(#tox-acid)" />
        {[[220, 0], [460, 0.7], [680, 1.3], [940, 0.4], [1120, 1.9]].map(([x, d]) => (
            <circle key={x} className="cbd-tox-bubble" cx={x} cy="110" r="7" fill="url(#tox-bub)" style={{ animationDelay: `${d}s` }} />
        ))}
    </SVG>
);

/* ----------------------------------------------------------------- */
/* 19. WARDEN                                                        */
/* ----------------------------------------------------------------- */
const Warden = () => {
    const N = 11;
    const links = [];
    for (let i = 0; i < N; i++) {
        const x = 70 + i * ((1200 - 140) / (N - 1));
        const sag = Math.sin((i / (N - 1)) * Math.PI) * 16;
        links.push({ x, y: 54 + sag, rot: i % 2 ? 0 : 90 });
    }
    return (
        <SVG>
            <defs>
                <linearGradient id="wd-iron" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#8a8074" /><stop offset="50%" stopColor="#36312a" /><stop offset="100%" stopColor="#16130f" /></linearGradient>
            </defs>
            <rect width="1200" height="140" fill="#0e0c0a" />
            {/* hanging catenary chain */}
            <g className="cbd-wd-chain">
                {links.map((l, i) => (
                    <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.rot})`}>
                        <ellipse cx="0" cy="0" rx="36" ry="18" fill="none" stroke="url(#wd-iron)" strokeWidth="12" />
                        <ellipse cx="0" cy="0" rx="36" ry="18" fill="none" stroke="#a07a44" strokeOpacity="0.35" strokeWidth="3" />
                    </g>
                ))}
            </g>
            {/* central manacle / shackle */}
            <g className="cbd-wd-shackle" transform="translate(600 120)">
                <rect x="-28" y="-15" width="56" height="30" rx="7" fill="#2a2620" stroke="#6a6258" strokeWidth="3.5" />
                <circle cx="0" cy="0" r="10" fill="#0e0c0a" />
                <circle cx="0" cy="0" r="10" fill="none" stroke="#6a6258" strokeWidth="2" />
                <rect x="-4" y="15" width="8" height="22" fill="#3a352c" />
            </g>
        </SVG>
    );
};

/* ----------------------------------------------------------------- */
/* 20. AUGUR                                                         */
/* ----------------------------------------------------------------- */
const Augur = () => (
    <SVG>
        <defs>
            <radialGradient id="aug-orb" cx="42%" cy="38%"><stop offset="0%" stopColor="#f0e0ff" /><stop offset="45%" stopColor="#9b6cd6" /><stop offset="100%" stopColor="#3a1a5a" /></radialGradient>
            <radialGradient id="aug-glow"><stop offset="0%" stopColor="#c9aaff" stopOpacity="0.6" /><stop offset="100%" stopColor="#c9aaff" stopOpacity="0" /></radialGradient>
            <linearGradient id="aug-bone" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#e8dcc0" /><stop offset="100%" stopColor="#9c8a64" /></linearGradient>
        </defs>
        <rect width="1200" height="140" fill="#0e0a14" />
        {/* casting cloth */}
        <path d="M0 132 Q600 104 1200 132 L1200 140 L0 140 Z" fill="#1a1030" opacity="0.85" />
        {/* twinkling omen stars */}
        {[[180, 40], [300, 70], [900, 50], [1040, 80], [160, 90]].map(([x, y], i) => (
            <circle key={'s' + i} className="cbd-aug-star" cx={x} cy={y} r="2.2" fill="#e0c8ff" style={{ animationDelay: (i * 0.4) + 's' }} />
        ))}
        {/* swirling fate threads */}
        <g className="cbd-aug-threads" fill="none" stroke="#b388e6" strokeOpacity="0.4" strokeWidth="1.5">
            <ellipse cx="600" cy="70" rx="124" ry="34" />
            <ellipse cx="600" cy="70" rx="156" ry="46" strokeOpacity="0.22" />
        </g>
        {/* scrying orb */}
        <circle className="cbd-aug-halo" cx="600" cy="70" r="92" fill="url(#aug-glow)" />
        <g className="cbd-aug-orb">
            <circle cx="600" cy="70" r="36" fill="url(#aug-orb)" stroke="#d1b3ff" strokeOpacity="0.6" strokeWidth="1.5" />
            <ellipse cx="588" cy="58" rx="11" ry="6.5" fill="#fff" opacity="0.5" />
            <path d="M576 80 Q600 72 624 80" fill="none" stroke="#e0c8ff" strokeOpacity="0.5" strokeWidth="1.5" />
        </g>
        {/* casting bones on the cloth */}
        {[[470, 120, 12], [600, 128, -14], [740, 118, 24]].map(([x, y, r], i) => (
            <g key={'b' + i} className="cbd-aug-bone" style={{ animationDelay: (i * 0.5) + 's' }} transform={`translate(${x} ${y}) rotate(${r})`}>
                <rect x="-13" y="-4" width="26" height="8" rx="4" fill="url(#aug-bone)" />
                <circle cx="-13" cy="0" r="4.5" fill="url(#aug-bone)" />
                <circle cx="13" cy="0" r="4.5" fill="url(#aug-bone)" />
            </g>
        ))}
        <circle className="cbd-aug-rune" cx="600" cy="124" r="30" fill="url(#aug-glow)" />
    </SVG>
);

/* ----------------------------------------------------------------- */
const BACKDROPS = {
    arcanoneer: Arcanoneer,
    berserker: Berserker,
    shaper: Shaper,
    harbinger: Harbinger,
    chronarch: Chronarch,
    inquisitor: Inquisitor,
    revenant: Revenant,
    'false-prophet': FalseProphet,
    gambit: Gambit,
    apex: Apex,
    animist: Animist,
    lunarch: Lunarch,
    martyr: Martyr,
    minstrel: Minstrel,
    plaguebringer: Plaguebringer,
    pyrofiend: Pyrofiend,
    spellguard: Spellguard,
    toxicologist: Toxicologist,
    warden: Warden,
    augur: Augur,
};

const ClassRowBackdrop = ({ slug }) => {
    const Backdrop = BACKDROPS[slug];
    if (!Backdrop) return <div className="class-row-bg-effects" />;
    return (
        <div className="class-row-bg-effects">
            <Backdrop />
        </div>
    );
};

export default ClassRowBackdrop;
