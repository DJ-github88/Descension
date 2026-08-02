import React from 'react';

/**
 * High-detail, thematic animated SVG backdrops for every class row.
 * Refined per feedback:
 * 1. Minstrel: Rendered explicit glowing circular Note Head ORBs on TOP of stem necks with specular highlights, Treble Clef & Sheet Music Parchment.
 * 2. Plaguebringer & Toxicologist: Extended wave paths from -600 to 1800 for 100% seamless infinite looping with zero edge cutoffs.
 * 3. Berserker: Lore-faithful Skald Bloodhammer design - Twin Axes with glowing copper-heat edges, boiling copper vein networks & melting Nordhalla frost.
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
    const RX = 220, RY = 52;
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
                <radialGradient id="arc-nucleus"><stop offset="0%" stopColor="#ffffff" /><stop offset="30%" stopColor="#ffea9f" /><stop offset="70%" stopColor="#e67e22" /><stop offset="100%" stopColor="#3a1a70" stopOpacity="0" /></radialGradient>
                <radialGradient id="arc-flash"><stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" /><stop offset="100%" stopColor="#ffffff" stopOpacity="0" /></radialGradient>
            </defs>
            <rect width="1200" height="140" fill="#160e0a" />
            <circle cx="600" cy="70" r="120" fill="none" stroke="#e67e22" strokeOpacity="0.25" strokeWidth="1.5" />
            <polygon points="600,10 650,40 650,100 600,130 550,100 550,40" fill="none" stroke="#ffaa44" strokeOpacity="0.3" strokeWidth="1.5" />
            {rings.map((ring, ri) => (
                <g key={ri} transform={`rotate(${ring.tilt} 600 70)`}>
                    <ellipse cx="600" cy="70" rx={RX} ry={RY} fill="none" stroke="#ffaa44" strokeOpacity="0.25" strokeWidth="1.5" />
                    {ring.electrons.map(([grad, phi, delay], ei) => (
                        <g key={ei} transform={`rotate(${phi} 600 70)`}>
                            <g className="cbd-arc-orbit" style={{ transformOrigin: '600px 70px', animationDelay: delay + 's' }}>
                                <circle cx={600 + RX} cy="70" r="16" fill={`url(#${grad})`} />
                                <circle cx={600 + RX} cy="70" r="6" fill="#ffffff" opacity="0.9" />
                            </g>
                        </g>
                    ))}
                </g>
            ))}
            <circle className="cbd-arc-nucleus" cx="600" cy="70" r="36" fill="url(#arc-nucleus)" style={{ transformOrigin: '600px 70px' }} />
            <circle className="cbd-arc-flash" cx="600" cy="70" r="56" fill="url(#arc-flash)" />
        </SVG>
    );
};

/* ----------------------------------------------------------------- */
/* 2. BERSERKER - Skald Bloodhammer: Twin Copper Axes & Boiling Veins */
/* ----------------------------------------------------------------- */
const Berserker = () => (
    <SVG>
        <defs>
            <radialGradient id="bers-rage-glow" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#ff3300" stopOpacity="0.85" />
                <stop offset="45%" stopColor="#b31b00" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#3d0000" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="bers-steel" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="35%" stopColor="#e5e7eb" />
                <stop offset="70%" stopColor="#4b5563" />
                <stop offset="100%" stopColor="#111827" />
            </linearGradient>
            <linearGradient id="bers-copper-edge" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#ffcc44" />
                <stop offset="50%" stopColor="#ff5500" />
                <stop offset="100%" stopColor="#aa1100" />
            </linearGradient>
        </defs>
        <rect width="1200" height="140" fill="#140203" />

        {/* Central volcanic Blood-Heat core aura */}
        <circle cx="600" cy="70" r="170" fill="url(#bers-rage-glow)" />

        {/* Nordhalla Melting Frost Crystals on edges */}
        <g stroke="#7dd3fc" strokeOpacity="0.35" strokeWidth="1.5" fill="none">
            <path d="M0 0 L40 30 L0 60 M0 30 L60 30 M20 15 L20 45" />
            <path d="M1200 0 L1160 30 L1200 60 M1200 30 L1140 30 M1180 15 L1180 45" />
        </g>

        {/* BOILING COPPER VEIN NETWORK (Spreading across marrow) */}
        <g stroke="url(#bers-copper-edge)" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.85">
            <path d="M120 70 Q240 30 360 80 T600 40 T840 90 T1080 50" />
            <path d="M80 100 Q260 120 440 60 T760 110 T1040 60" />
            <path d="M300 20 L330 45 M700 120 L730 95 M500 90 L530 115" strokeWidth="1.5" />
        </g>

        {/* TWIN SKALD BLOODHAMMER BATTLE-AXES */}
        <g transform="translate(600 70)">
            {/* Left Axe */}
            <g transform="rotate(-30)">
                <rect x="-6" y="-68" width="12" height="136" rx="3" fill="#3a1e05" stroke="#1c0c01" strokeWidth="1.5" />
                <rect x="-6.5" y="-18" width="13" height="36" fill="#8b4513" stroke="#3a1d07" strokeWidth="1" />
                {/* Crescent Axe Blade */}
                <path d="M-6 -38 Q-60 -70 -70 -20 Q-50 5 -6 -3 Z" fill="url(#bers-steel)" stroke="url(#bers-copper-edge)" strokeWidth="2.5" />
                <path d="M6 -38 Q60 -70 70 -20 Q50 5 6 -3 Z" fill="url(#bers-steel)" stroke="url(#bers-copper-edge)" strokeWidth="2.5" />
                <circle cx="0" cy="-24" r="7" fill="#ff4400" />
            </g>

            {/* Right Axe */}
            <g transform="rotate(30)">
                <rect x="-6" y="-68" width="12" height="136" rx="3" fill="#3a1e05" stroke="#1c0c01" strokeWidth="1.5" />
                <rect x="-6.5" y="-18" width="13" height="36" fill="#8b4513" stroke="#3a1d07" strokeWidth="1" />
                <path d="M-6 -38 Q-60 -70 -70 -20 Q-50 5 -6 -3 Z" fill="url(#bers-steel)" stroke="url(#bers-copper-edge)" strokeWidth="2.5" />
                <path d="M6 -38 Q60 -70 70 -20 Q50 5 6 -3 Z" fill="url(#bers-steel)" stroke="url(#bers-copper-edge)" strokeWidth="2.5" />
                <circle cx="0" cy="-24" r="7" fill="#ff4400" />
            </g>

            {/* Glowing Nordhammer Helm Eye Slits */}
            <g transform="translate(0 -6)">
                <polygon points="-30,-10 -8,-3 -16,-18" fill="#ffffff" filter="drop-shadow(0 0 10px #ff3300)" />
                <polygon points="30,-10 8,-3 16,-18" fill="#ffffff" filter="drop-shadow(0 0 10px #ff3300)" />
            </g>
        </g>

        {/* Floating Copper Embers */}
        {[[150, 40], [320, 110], [480, 30], [720, 115], [880, 25], [1050, 95]].map(([x, y], i) => (
            <circle key={'sp' + i} className="cbd-pyr-ember" cx={x} cy={y} r={3.5 + (i % 3)} fill="#ffaa00" style={{ animationDelay: (i * 0.4) + 's' }} />
        ))}
        <rect className="cbd-bers-pulse" x="0" y="0" width="1200" height="140" fill="#ff1a2b" opacity="0.14" />
    </SVG>
);

/* ----------------------------------------------------------------- */
/* 3. SHAPER                                                         */
/* ----------------------------------------------------------------- */
const Shaper = () => (
    <SVG>
        <defs>
            <radialGradient id="shap-glow"><stop offset="0%" stopColor="#f5e0c5" stopOpacity="0.5" /><stop offset="100%" stopColor="#f5e0c5" stopOpacity="0" /></radialGradient>
            <linearGradient id="shap-bone" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f7ebd9" /><stop offset="100%" stopColor="#c9a86a" /></linearGradient>
        </defs>
        <rect width="1200" height="140" fill="#17100d" />
        <circle cx="600" cy="70" r="90" fill="url(#shap-glow)" />
        <circle cx="600" cy="70" r="68" fill="none" stroke="#c9a86a" strokeOpacity="0.3" strokeWidth="1.5" />
        <g className="cbd-shap-ring" style={{ transformOrigin: '600px 70px' }}>
            <circle cx="600" cy="70" r="62" fill="none" stroke="#f5e0c5" strokeOpacity="0.4" strokeWidth="2" strokeDasharray="6 10" />
        </g>
        <g className="cbd-shap-yin" style={{ transformOrigin: '600px 70px' }}>
            <circle cx="600" cy="70" r="48" fill="#241a12" stroke="#c9a86a" strokeWidth="2" />
            <path d="M600 22 A48 48 0 1 1 600 118 A24 24 0 1 1 600 70 A24 24 0 1 0 600 22 Z" fill="url(#shap-bone)" />
            <circle cx="600" cy="46" r="9" fill="#241a12" />
            <circle cx="600" cy="94" r="9" fill="url(#shap-bone)" />
            <circle cx="600" cy="46" r="3" fill="#f5e0c5" />
            <circle cx="600" cy="94" r="3" fill="#241a12" />
        </g>
    </SVG>
);

/* ----------------------------------------------------------------- */
/* 4. HARBINGER                                                      */
/* ----------------------------------------------------------------- */
const Harbinger = () => (
    <SVG>
        <defs>
            <radialGradient id="harb-eye"><stop offset="0%" stopColor="#e0a0ff" /><stop offset="60%" stopColor="#9540c8" /><stop offset="100%" stopColor="#2a0f3a" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="1200" height="140" fill="#191021" />
        <circle cx="600" cy="70" r="70" fill="url(#harb-eye)" opacity="0.8" />
        <ellipse cx="600" cy="70" rx="140" ry="40" fill="none" stroke="#d9a8ff" strokeOpacity="0.25" strokeWidth="1.5" />
        <g className="cbd-harb-spiral">
            {Array.from({ length: 20 }).map((_, i) => {
                const a = (i / 20) * Math.PI * 2;
                const r = 30 + i * 5;
                return <circle key={i} cx={600 + Math.cos(a) * r} cy={70 + Math.sin(a) * r * 0.5} r={2 + (i % 3)} fill="#e8c8ff" opacity={0.35 + (i % 4) * 0.15} />;
            })}
        </g>
        <polyline className="cbd-harb-bolt" points="250,15 310,50 280,58 350,120" fill="none" stroke="#e0a0ff" strokeWidth="2.5" strokeOpacity="0.85" />
        <polyline className="cbd-harb-bolt cbd-harb-bolt--b" points="950,20 890,58 920,64 850,125" fill="none" stroke="#c080ff" strokeWidth="2" strokeOpacity="0.75" />
    </SVG>
);

/* ----------------------------------------------------------------- */
/* 5. CHRONARCH                                                      */
/* ----------------------------------------------------------------- */
const Chronarch = () => (
    <SVG>
        <defs>
            <radialGradient id="chron-hub"><stop offset="0%" stopColor="#ffe680" /><stop offset="60%" stopColor="#d99b1c" /><stop offset="100%" stopColor="#593b00" /></radialGradient>
        </defs>
        <rect width="1200" height="140" fill="#13101e" />
        <g className="cbd-chron-gear cbd-chron-gear--cw" style={{ transformOrigin: '300px 70px' }}>
            <circle cx="300" cy="70" r="54" fill="none" stroke="#d99b1c" strokeWidth="16" strokeDasharray="22 14" strokeOpacity="0.65" />
            <circle cx="300" cy="70" r="40" fill="none" stroke="#fce484" strokeWidth="2" strokeOpacity="0.6" />
            <circle cx="300" cy="70" r="10" fill="url(#chron-hub)" />
        </g>
        <g className="cbd-chron-gear cbd-chron-gear--ccw" style={{ transformOrigin: '900px 70px' }}>
            <circle cx="900" cy="70" r="42" fill="none" stroke="#d99b1c" strokeWidth="12" strokeDasharray="18 12" strokeOpacity="0.6" />
            <circle cx="900" cy="70" r="8" fill="url(#chron-hub)" />
        </g>
        <circle cx="600" cy="70" r="50" fill="none" stroke="#ffd700" strokeWidth="2" strokeOpacity="0.5" />
        <circle cx="600" cy="70" r="50" fill="none" stroke="#ffd700" strokeOpacity="0.4" strokeDasharray="3 13" />
        <g className="cbd-chron-hand">
            <rect x="598" y="28" width="4" height="44" fill="#ffe680" rx="2" />
            <polygon points="600,24 594,36 606,36" fill="#ffd700" />
        </g>
        <circle cx="600" cy="70" r="6" fill="#ffd700" stroke="#7a5a18" strokeWidth="1.5" />
    </SVG>
);

/* ----------------------------------------------------------------- */
/* 6. INQUISITOR                                                     */
/* ----------------------------------------------------------------- */
const Inquisitor = () => (
    <SVG>
        <defs>
            <radialGradient id="inq-seal"><stop offset="0%" stopColor="#ff4d4d" /><stop offset="65%" stopColor="#990000" /><stop offset="100%" stopColor="#330000" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="1200" height="140" fill="#160405" />
        <g className="cbd-inq-wire" fill="none" stroke="#8b0000" strokeWidth="3" strokeOpacity="0.75">
            <path d="M0 48 H1200" />
            {[100, 300, 500, 700, 900, 1100].map((x) => (
                <path key={x} d={`M${x} 48 l12 -14 l6 14 l12 -14 l-6 14 M${x + 4} 48 l-12 14 l-6 -14`} stroke="#cc0000" strokeWidth="2" />
            ))}
        </g>
        <g className="cbd-inq-wire cbd-inq-wire--b" fill="none" stroke="#660000" strokeWidth="2.5" strokeOpacity="0.6">
            <path d="M0 96 H1200" />
            {[200, 600, 1000].map((x) => (
                <path key={x} d={`M${x} 96 l-12 -12 l-6 12 l-12 -12 l6 12`} stroke="#990000" strokeWidth="2" />
            ))}
        </g>
        <circle className="cbd-inq-seal" cx="600" cy="70" r="74" fill="url(#inq-seal)" />
        <circle cx="600" cy="70" r="42" fill="#2a0406" stroke="#ff4d4d" strokeWidth="2" />
        <g className="cbd-inq-cross" stroke="#ff6666" strokeWidth="3.5" strokeLinecap="square" fill="none">
            <line x1="600" y1="36" x2="600" y2="104" />
            <line x1="566" y1="64" x2="634" y2="64" />
        </g>
    </SVG>
);

/* ----------------------------------------------------------------- */
/* 7. REVENANT                                                       */
/* ----------------------------------------------------------------- */
const Revenant = () => (
    <SVG>
        <defs>
            <radialGradient id="rev-gem"><stop offset="0%" stopColor="#c2ffd9" /><stop offset="50%" stopColor="#2ecc71" /><stop offset="100%" stopColor="#082b17" stopOpacity="0" /></radialGradient>
            <radialGradient id="rev-soul"><stop offset="0%" stopColor="#e8ffe8" /><stop offset="100%" stopColor="#2ecc71" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="1200" height="140" fill="#0c1410" />
        <g className="cbd-rev-spiral">
            {Array.from({ length: 12 }).map((_, i) => {
                const a = (i / 12) * Math.PI * 2;
                const r = 130 - i * 9;
                return <circle key={i} cx={600 + Math.cos(a) * r} cy={70 + Math.sin(a) * r * 0.5} r="7" fill="url(#rev-soul)" opacity="0.8" />;
            })}
        </g>
        <circle className="cbd-rev-gem" cx="600" cy="70" r="44" fill="url(#rev-gem)" />
        <path d="M600 36 L622 52 L612 88 L588 88 L578 52 Z" fill="#143622" stroke="#5ef0b0" strokeWidth="2" opacity="0.9" />
        <circle cx="600" cy="64" r="8" fill="#c2ffd9" />
    </SVG>
);

/* ----------------------------------------------------------------- */
/* 8. FALSE PROPHET                                                  */
/* ----------------------------------------------------------------- */
const FalseProphet = () => (
    <SVG>
        <defs>
            <radialGradient id="fp-iris"><stop offset="0%" stopColor="#ffffcc" /><stop offset="50%" stopColor="#f1c40f" /><stop offset="100%" stopColor="#4a3b00" /></radialGradient>
            <radialGradient id="fp-glow"><stop offset="0%" stopColor="#b06ab3" stopOpacity="0.6" /><stop offset="100%" stopColor="#b06ab3" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="1200" height="140" fill="#140a1a" />
        {[[150, 1], [1050, -1]].map(([x, d]) => (
            <g key={x} className="cbd-fp-tendril" style={{ transformOrigin: `${x}px 70px` }}>
                <path d={`M${x} 70 q ${28 * d} -32 ${56 * d} -12 q ${20 * d} 24 ${48 * d} 8`} fill="none" stroke="#9b59b6" strokeWidth="3.5" strokeOpacity="0.5" />
                <path d={`M${x} 70 q ${28 * d} 32 ${56 * d} 12 q ${20 * d} -24 ${48 * d} -8`} fill="none" stroke="#8e44ad" strokeWidth="3" strokeOpacity="0.45" />
            </g>
        ))}
        <circle cx="600" cy="70" r="100" fill="url(#fp-glow)" />
        <path d="M490 70 Q600 14 710 70 Q600 126 490 70 Z" fill="#f8f4e6" stroke="#f1c40f" strokeWidth="2" opacity="0.95" />
        <circle className="cbd-fp-iris" cx="600" cy="70" r="28" fill="url(#fp-iris)" stroke="#d4af37" strokeWidth="2" />
        <ellipse cx="600" cy="70" rx="5" ry="20" fill="#0a0408" />
        <circle cx="594" cy="62" r="3.5" fill="#ffffff" opacity="0.9" />
    </SVG>
);

/* ----------------------------------------------------------------- */
/* 9. GAMBIT                                                         */
/* ----------------------------------------------------------------- */
const Gambit = () => (
    <SVG>
        <defs>
            <radialGradient id="gamb-felt" cx="50%" cy="65%" r="62%"><stop offset="0%" stopColor="#27ae60" /><stop offset="100%" stopColor="#0d1408" stopOpacity="0" /></radialGradient>
            <linearGradient id="gamb-coin" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffea66" /><stop offset="50%" stopColor="#f1c40f" /><stop offset="100%" stopColor="#997515" /></linearGradient>
            <linearGradient id="gamb-card" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#ffffff" /><stop offset="100%" stopColor="#f0e6cf" /></linearGradient>
        </defs>
        <rect width="1200" height="140" fill="#0d1408" />
        <ellipse cx="600" cy="92" rx="540" ry="74" fill="url(#gamb-felt)" />
        <g stroke="#f1c40f" strokeOpacity="0.2" fill="none" strokeWidth="1.5">
            <path d="M0 112 Q300 62 600 102 T1200 92" />
            <path d="M0 82 Q300 122 600 72 T1200 102" />
        </g>
        {[
            { x: 180, r: -14, d: 0, suit: '♠', val: 'A', color: '#111' },
            { x: 540, r: 18, d: 0.7, suit: '♥', val: 'K', color: '#e74c3c' },
            { x: 900, r: -10, d: 1.3, suit: '♦', val: 'Q', color: '#e74c3c' }
        ].map((c, i) => (
            <g key={'c' + i} className="cbd-gamb-card" style={{ animationDelay: c.d + 's' }}>
                <g transform={`rotate(${c.r} ${c.x + 22} -5)`}>
                    <rect x={c.x} y="-36" width="44" height="60" rx="5" fill="url(#gamb-card)" stroke="#d4af37" strokeWidth="2" />
                    <text x={c.x + 6} y="-18" fontSize="11" fill={c.color} fontWeight="800">{c.val}</text>
                    <text x={c.x + 22} y="8" textAnchor="middle" fontSize="22" fill={c.color}>{c.suit}</text>
                </g>
            </g>
        ))}
        {[[320, 0], [640, 0.8], [980, 1.5], [140, 1.1]].map(([x, d], i) => (
            <g key={'coin' + i} className="cbd-gamb-coin" style={{ animationDelay: d + 's' }}>
                <circle cx={x} cy="-14" r="14" fill="url(#gamb-coin)" stroke="#b8941f" strokeWidth="1.5" />
                <circle cx={x} cy="-14" r="9" fill="none" stroke="#ffea66" strokeOpacity="0.8" strokeWidth="1.5" />
                <text x={x} y="-9" textAnchor="middle" fontSize="11" fill="#7a5a00" fontWeight="900" fontFamily="serif">7</text>
            </g>
        ))}
        {[[440, -16, 0.4], [780, 14, 1.1], [1060, -10, 1.8]].map(([x, r, d], i) => (
            <g key={'d' + i} className="cbd-gamb-die" style={{ animationDelay: d + 's' }}>
                <g transform={`rotate(${r} ${x + 16} -10)`}>
                    <rect x={x} y="-26" width="32" height="32" rx="6" fill="#ffffff" stroke="#d4af37" strokeWidth="2" />
                    <circle cx={x + 9} cy="-17" r="2.5" fill="#e74c3c" />
                    <circle cx={x + 23} cy="-17" r="2.5" fill="#111111" />
                    <circle cx={x + 16} cy="-10" r="2.5" fill="#111111" />
                    <circle cx={x + 9} cy="-3" r="2.5" fill="#111111" />
                    <circle cx={x + 23} cy="-3" r="2.5" fill="#e74c3c" />
                </g>
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
            <radialGradient id="apx-fog"><stop offset="0%" stopColor="#4a1a15" stopOpacity="0.7" /><stop offset="100%" stopColor="#4a1a15" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="1200" height="140" fill="#17100e" />
        <ellipse className="cbd-apx-fog" cx="300" cy="70" rx="280" ry="70" fill="url(#apx-fog)" />
        <ellipse className="cbd-apx-fog cbd-apx-fog--b" cx="900" cy="70" rx="320" ry="80" fill="url(#apx-fog)" />
        <g className="cbd-apx-cross">
            <circle cx="0" cy="70" r="38" fill="none" stroke="#ef4444" strokeWidth="2" strokeOpacity="0.85" />
            <circle cx="0" cy="70" r="24" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="3 3" strokeOpacity="0.6" />
            <circle cx="0" cy="70" r="3" fill="#ff7777" />
            <line x1="-50" y1="70" x2="-26" y2="70" stroke="#ef4444" strokeWidth="2" />
            <line x1="26" y1="70" x2="50" y2="70" stroke="#ef4444" strokeWidth="2" />
            <line x1="0" y1="20" x2="0" y2="44" stroke="#ef4444" strokeWidth="2" />
            <line x1="0" y1="96" x2="0" y2="120" stroke="#ef4444" strokeWidth="2" />
            <text x="12" y="42" fill="#ef4444" fontSize="8" fontWeight="800" fontFamily="monospace">100m</text>
            <text x="12" y="104" fill="#ef4444" fontSize="8" fontWeight="800" fontFamily="monospace">LOCKED</text>
        </g>
    </SVG>
);

/* ----------------------------------------------------------------- */
/* 11. ANIMIST                                                       */
/* ----------------------------------------------------------------- */
const Animist = () => (
    <SVG>
        <defs>
            <radialGradient id="anim-soul"><stop offset="0%" stopColor="#e8ffe8" /><stop offset="60%" stopColor="#50fb95" /><stop offset="100%" stopColor="#1e824c" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="1200" height="140" fill="#0e160e" />
        {[0, 1, 2].map((i) => (
            <circle key={i} className="cbd-anim-ring" cx="600" cy="130" r="24" fill="none" stroke="#50fb95" strokeWidth="2" strokeOpacity="0.4" style={{ animationDelay: `${i * 1.3}s` }} />
        ))}
        {[[260, 0], [600, 0.8], [940, 1.6]].map(([x, d]) => (
            <g key={x} className="cbd-anim-spirit" style={{ animationDelay: `${d}s` }}>
                <ellipse cx={x} cy="150" rx="20" ry="30" fill="url(#anim-soul)" />
                <circle cx={x} cy="126" r="11" fill="url(#anim-soul)" />
                <path d={`M${x - 4} 118 Q${x - 14} 104 ${x - 18} 94 M${x + 4} 118 Q${x + 14} 104 ${x + 18} 94`} stroke="#50fb95" strokeWidth="2" fill="none" />
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
            <radialGradient id="lun-glow"><stop offset="0%" stopColor="#ffffff" /><stop offset="50%" stopColor="#38bdf8" /><stop offset="100%" stopColor="#0369a1" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="1200" height="140" fill="#10140a" />
        <g stroke="#38bdf8" strokeOpacity="0.2" fill="none">
            <path d="M0 100 Q300 60 600 100 T1200 100" />
            <path d="M0 70 Q300 110 600 70 T1200 70" />
        </g>
        {[[140, 0.3], [280, 0.5], [420, 0.8], [780, 0.8], [920, 0.5], [1060, 0.3]].map(([x, o]) => (
            <g key={x}>
                <circle cx={x} cy="70" r="18" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" strokeOpacity="0.4" />
                <circle cx={x} cy="70" r="18" fill="#e0f2fe" opacity={o} />
            </g>
        ))}
        <g className="cbd-lun-moon">
            <circle cx="0" cy="70" r="42" fill="url(#lun-glow)" />
            <circle cx="0" cy="70" r="28" fill="#f8fafc" />
            <circle cx="0" cy="70" r="28" fill="#10140a" transform="translate(15 0)" />
        </g>
    </SVG>
);

/* ----------------------------------------------------------------- */
/* 13. MARTYR                                                        */
/* ----------------------------------------------------------------- */
const Martyr = () => (
    <SVG>
        <defs>
            <radialGradient id="mart-halo"><stop offset="0%" stopColor="#ffe082" /><stop offset="55%" stopColor="#ff9a3c" stopOpacity="0.6" /><stop offset="100%" stopColor="#ff9a3c" stopOpacity="0" /></radialGradient>
            <radialGradient id="mart-heart" cx="50%" cy="38%"><stop offset="0%" stopColor="#ff6b6b" /><stop offset="100%" stopColor="#7a0008" /></radialGradient>
        </defs>
        <rect width="1200" height="140" fill="#0b0810" />
        <g className="cbd-mart-rays" stroke="#ffd479" strokeOpacity="0.4" strokeWidth="2.5">
            {Array.from({ length: 16 }).map((_, i) => {
                const a = (i / 16) * Math.PI * 2;
                return <line key={i} x1={600 + Math.cos(a) * 46} y1={72 + Math.sin(a) * 24} x2={600 + Math.cos(a) * 140} y2={72 + Math.sin(a) * 65} />;
            })}
        </g>
        <circle className="cbd-mart-halo" cx="600" cy="72" r="124" fill="url(#mart-halo)" />
        <g className="cbd-mart-crown" transform="translate(600 34)">
            <circle r="24" fill="none" stroke="#7a481c" strokeWidth="5" />
            <circle r="24" fill="none" stroke="#a36d2e" strokeWidth="2" strokeOpacity="0.7" />
            {Array.from({ length: 14 }).map((_, i) => {
                const a = (i / 14) * Math.PI * 2;
                return <line key={i} x1={Math.cos(a) * 24} y1={Math.sin(a) * 24} x2={Math.cos(a) * 36} y2={Math.sin(a) * 36} stroke="#6e4218" strokeWidth="3.5" />;
            })}
        </g>
        <g className="cbd-mart-heart" transform="translate(600 80)">
            <path d="M0 20 C 0 4, -24 4, -24 -12 C -24 -28, 0 -28, 0 -12 C 0 -28, 24 -28, 24 -12 C 24 4, 0 4, 0 20 Z" fill="url(#mart-heart)" stroke="#ff8a5a" strokeWidth="2" />
            <path d="M0 -16 Q -10 -30 0 -40 Q 10 -30 0 -16 Z" fill="#ffb74d" />
            <line x1="0" y1="-40" x2="0" y2="-50" stroke="#ffe082" strokeWidth="3" />
        </g>
        {[580, 600, 620].map((x, i) => (
            <g key={'b' + i} className="cbd-mart-blood" style={{ animationDelay: (i * 0.5) + 's' }}>
                <circle cx={x} cy="58" r="4.5" fill="#d61424" />
            </g>
        ))}
    </SVG>
);

/* ----------------------------------------------------------------- */
/* 14. MINSTREL - Prominent Circular Note Head Orbs on top of stems  */
/* ----------------------------------------------------------------- */
const Minstrel = () => {
    // Single Quarter Note with explicit glowing circular ORB at base of stem
    const QuarterNote = ({ x, y, s = 1.1, delay, dur }) => (
        <g className="cbd-min-note" style={{ animationDelay: delay + 's', animationDuration: dur + 's' }}>
            {/* 1. Stem Neck rendered FIRST */}
            <rect x={x + 8 * s} y={y - 42 * s} width={4.5 * s} height={42 * s} rx={2} fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
            {/* Flag at top */}
            <path d={`M${x + 12.5 * s} ${y - 42 * s} Q${x + 30 * s} ${y - 26 * s} ${x + 16 * s} ${y - 12 * s} Q${x + 24 * s} ${y - 28 * s} ${x + 12.5 * s} ${y - 38 * s} Z`} fill="#fbbf24" />
            {/* 2. Explicit Note Head ORB rendered SECOND (on top of stem base) */}
            <circle cx={x} cy={y} r={12 * s} fill="#fbbf24" stroke="#78350f" strokeWidth="2" />
            <circle cx={x - 3 * s} cy={y - 3 * s} r={4 * s} fill="#ffffff" opacity="0.85" />
        </g>
    );

    // Beamed Eighth Notes with explicit glowing circular ORBs at base of stems
    const BeamedNotes = ({ x, y, s = 1.1, delay, dur }) => (
        <g className="cbd-min-note" style={{ animationDelay: delay + 's', animationDuration: dur + 's' }}>
            {/* 1. Stems & Beam Bar rendered FIRST */}
            <rect x={x + 8 * s} y={y - 42 * s} width={4.5 * s} height={42 * s} rx={2} fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
            <rect x={x + 44 * s} y={y - 36 * s} width={4.5 * s} height={42 * s} rx={2} fill="#fbbf24" stroke="#78350f" strokeWidth="1" />
            <polygon points={`${x + 8 * s},${y - 42 * s} ${x + 48.5 * s},${y - 36 * s} ${x + 48.5 * s},${y - 27 * s} ${x + 8 * s},${y - 33 * s}`} fill="#fbbf24" stroke="#78350f" strokeWidth="1.5" />
            {/* 2. Explicit Note Head ORBs rendered SECOND */}
            <g>
                <circle cx={x} cy={y} r={12 * s} fill="#fbbf24" stroke="#78350f" strokeWidth="2" />
                <circle cx={x - 3 * s} cy={y - 3 * s} r={4 * s} fill="#ffffff" opacity="0.85" />
            </g>
            <g>
                <circle cx={x + 36 * s} cy={y + 6 * s} r={12 * s} fill="#fbbf24" stroke="#78350f" strokeWidth="2" />
                <circle cx={x + 33 * s} cy={y + 3 * s} r={4 * s} fill="#ffffff" opacity="0.85" />
            </g>
        </g>
    );

    // Treble Clef Symbol
    const TrebleClef = ({ x, y, s = 1.2 }) => (
        <g transform={`translate(${x} ${y}) scale(${s})`} fill="none" stroke="#fbbf24" strokeWidth="3.5" opacity="0.9">
            <path d="M12 48 C 12 56, 4 56, 4 48 C 4 40, 16 34, 16 22 C 16 10, 4 10, 4 22 C 4 36, 20 40, 20 54 C 20 66, 8 70, 0 62" />
            <line x1="12" y1="2" x2="12" y2="76" strokeWidth="4" />
            <circle cx="12" cy="76" r="4.5" fill="#fbbf24" />
        </g>
    );

    return (
        <SVG>
            <defs>
                <linearGradient id="min-bg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2a1d08" />
                    <stop offset="50%" stopColor="#181206" />
                    <stop offset="100%" stopColor="#0a0803" />
                </linearGradient>
                <radialGradient id="min-stage"><stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" /><stop offset="100%" stopColor="#fbbf24" stopOpacity="0" /></radialGradient>
            </defs>
            <rect width="1200" height="140" fill="url(#min-bg)" />
            <ellipse className="cbd-min-stage" cx="600" cy="74" rx="400" ry="70" fill="url(#min-stage)" />

            <path d="M80 35 Q300 15 600 45 Q900 75 1120 30 L1120 95 Q900 140 600 110 Q300 80 80 105 Z" fill="#2d200d" stroke="#d97706" strokeWidth="1.5" opacity="0.4" />

            <g stroke="#fbbf24" strokeOpacity="0.25" strokeWidth="1.5">
                {[30, 44, 58, 72, 86].map((y) => (<line key={y} x1="0" y1={y} x2="1200" y2={y} />))}
            </g>

            <TrebleClef x={90} y={24} s={1.1} />
            <TrebleClef x={1080} y={24} s={1.1} />

            <QuarterNote x={220} y={94} s={1.1} delay={0} dur={4.2} />
            <BeamedNotes x={360} y={62} s={1.15} delay={0.6} dur={4.8} />
            <QuarterNote x={580} y={98} s={1.1} delay={1.1} dur={4.0} />
            <BeamedNotes x={760} y={58} s={1.2} delay={0.3} dur={5.2} />
            <QuarterNote x={980} y={92} s={1.1} delay={1.6} dur={4.4} />
        </SVG>
    );
};

/* ----------------------------------------------------------------- */
/* 15. PLAGUEBRINGER - Extended Bounds (-600 to 1800) Zero Cutoff    */
/* ----------------------------------------------------------------- */
const Plaguebringer = () => (
    <SVG>
        <defs>
            <linearGradient id="plag-acid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#d6ff4a" stopOpacity="0.95" /><stop offset="100%" stopColor="#4a7818" /></linearGradient>
            <radialGradient id="plag-gas"><stop offset="0%" stopColor="#e8ff9a" stopOpacity="0.85" /><stop offset="100%" stopColor="#9ab030" stopOpacity="0" /></radialGradient>
            <radialGradient id="plag-bub"><stop offset="0%" stopColor="#f2ffb0" /><stop offset="100%" stopColor="#9ac830" stopOpacity="0" /></radialGradient>
            <radialGradient id="plag-bio"><stop offset="0%" stopColor="#ecff8a" /><stop offset="70%" stopColor="#9ad62b" /><stop offset="100%" stopColor="#3f6b12" /></radialGradient>
            <radialGradient id="plag-bioled"><stop offset="0%" stopColor="#f4ffb8" /><stop offset="100%" stopColor="#5e9b1e" /></radialGradient>
        </defs>
        <rect width="1200" height="140" fill="#0a0f06" />
        <ellipse cx="600" cy="74" rx="320" ry="64" fill="#8db52b" opacity="0.12" />
        <g transform="translate(600 74)">
            <circle r="48" fill="none" stroke="#9ad62b" strokeOpacity="0.45" strokeWidth="2.5" />
            <g className="cbd-plag-bio" fill="url(#plag-bio)" stroke="#3f6b12" strokeWidth="1.5">
                {[0, 120, 240].map((rot) => (
                    <g key={rot} transform={`rotate(${rot})`}>
                        <path d="M0 -44 A44 44 0 0 1 38 -22 Q26 -16 18 -20 A30 30 0 0 0 0 -30 A30 30 0 0 0 -18 -20 Q-26 -16 -38 -22 A44 44 0 0 1 0 -44 Z" transform="translate(0 18)" />
                    </g>
                ))}
                <circle r="8" fill="url(#plag-bioled)" />
            </g>
        </g>
        {/* Extended 2400px wide path from -600px to 1800px guarantees zero edge cutoff */}
        <path className="cbd-plag-acid" d="M-600 116 Q-500 102 -400 116 T-200 116 T0 116 T200 116 T400 116 T600 116 T800 116 T1000 116 T1200 116 T1400 116 T1600 116 T1800 116 L1800 140 L-600 140 Z" fill="url(#plag-acid)" />
        <path className="cbd-plag-acid" d="M-600 116 Q-500 102 -400 116 T-200 116 T0 116 T200 116 T400 116 T600 116 T800 116 T1000 116 T1200 116 T1400 116 T1600 116 T1800 116" fill="none" stroke="#f2ffb0" strokeOpacity="0.7" strokeWidth="2" />
        {[[260, 0], [560, 1], [860, 0.5], [1060, 1.4]].map(([x, d], i) => (
            <ellipse key={'g' + i} className="cbd-plag-gas" cx={x} cy="100" rx="36" ry="24" fill="url(#plag-gas)" style={{ animationDelay: d + 's' }} />
        ))}
        {[[200, 0], [420, 0.6], [640, 1.2], [820, 0.3], [1040, 0.9]].map(([x, d], i) => (
            <circle key={'b' + i} className="cbd-plag-bubble" cx={x} cy="116" r="8" fill="url(#plag-bub)" style={{ animationDelay: d + 's' }} />
        ))}
        {[340, 700, 980].map((x, i) => (
            <g key={'d' + i} className="cbd-plag-drip" style={{ animationDelay: (i * 0.7) + 's' }}>
                <rect x={x} y="0" width="3" height="24" fill="#c4f04a" opacity="0.75" />
                <circle cx={x + 1.5} cy="26" r="5" fill="#c4f04a" />
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
        <ellipse className="cbd-pyr-glow" cx="600" cy="140" rx="660" ry="86" fill="url(#pyr-glow)" />
        {[60, 200, 340, 480, 620, 760, 900, 1040, 1180].map((x, i) => (
            <path key={'bf' + i} className="cbd-pyr-flame cbd-pyr-flame--back" d={`M${x} 140 q ${-26} ${-58} 0 ${-94} q ${26} ${36} 0 ${94} Z`} fill="url(#pyr-dim)" style={{ animationDelay: (i * 0.18) + 's' }} />
        ))}
        {[130, 270, 410, 550, 690, 830, 970, 1110].map((x, i) => (
            <path key={'ff' + i} className="cbd-pyr-flame" d={`M${x} 140 q ${-18} ${-46} 0 ${-78} q ${18} ${30} 0 ${78} Z`} fill="url(#pyr-hot)" style={{ animationDelay: (i * 0.22 + 0.1) + 's' }} />
        ))}
        {[[220, 0], [500, 0.5], [780, 1.0], [1060, 1.4], [360, 1.7], [920, 0.3]].map(([x, d], i) => (
            <circle key={'e' + i} className="cbd-pyr-ember" cx={x} cy="140" r="3.5" fill="#ffd28a" style={{ animationDelay: d + 's' }} />
        ))}
    </SVG>
);

/* ----------------------------------------------------------------- */
/* 17. SPELLGUARD                                                    */
/* ----------------------------------------------------------------- */
const Spellguard = () => (
    <SVG>
        <defs>
            <linearGradient id="spg-face" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#38bdf8" /><stop offset="100%" stopColor="#0c4a6e" /></linearGradient>
            <radialGradient id="spg-flash"><stop offset="0%" stopColor="#ffffff" /><stop offset="100%" stopColor="#7ec8ff" stopOpacity="0" /></radialGradient>
            <linearGradient id="spg-bolt" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#cdeaff" stopOpacity="0" /><stop offset="100%" stopColor="#cdeaff" /></linearGradient>
        </defs>
        <rect width="1200" height="140" fill="#07111c" />
        <g className="cbd-spg-ring" fill="none" stroke="#38bdf8" strokeOpacity="0.35">
            <circle cx="610" cy="72" r="66" strokeDasharray="4 10" strokeWidth="2" />
            <circle cx="610" cy="72" r="80" strokeDasharray="2 16" strokeWidth="1.5" strokeOpacity="0.25" />
        </g>
        <g className="cbd-spg-shield">
            <path d="M560 26 L660 26 L660 72 Q660 112 610 128 Q560 112 560 72 Z" fill="url(#spg-face)" stroke="#7ec8ff" strokeWidth="3" />
            <path d="M560 26 L660 26 L660 72 Q660 112 610 128 Q560 112 560 72 Z" fill="none" stroke="#cdeaff" strokeOpacity="0.5" strokeWidth="1" />
            <circle cx="610" cy="66" r="16" fill="none" stroke="#7ec8ff" strokeWidth="2" />
            <path d="M610 54 L610 78 M598 66 L622 66" stroke="#cdeaff" strokeWidth="3" />
        </g>
        <circle className="cbd-spg-flash" cx="556" cy="60" r="30" fill="url(#spg-flash)" />
        <path className="cbd-spg-in" d="M360 58 L420 50 L448 62 L492 48 L548 58" fill="none" stroke="url(#spg-bolt)" strokeWidth="4" />
        <path className="cbd-spg-out" d="M672 54 L732 46 L760 58 L804 44 L860 54" fill="none" stroke="url(#spg-bolt)" strokeWidth="4" transform="translate(-40 0)" />
    </SVG>
);

/* ----------------------------------------------------------------- */
/* 18. TOXICOLOGIST - Extended Bounds (-600 to 1800) Zero Cutoff     */
/* ----------------------------------------------------------------- */
const Toxicologist = () => (
    <SVG>
        <defs>
            <linearGradient id="tox-acid" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9ccc4a" stopOpacity="0.75" /><stop offset="100%" stopColor="#4a6a18" /></linearGradient>
            <radialGradient id="tox-bub"><stop offset="0%" stopColor="#d8f08a" /><stop offset="100%" stopColor="#7cb342" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="1200" height="140" fill="#0f1608" />
        {[[260, 50], [600, 42], [940, 48]].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y})`}>
                <path d="M-10 -20 L10 -20 L10 -6 L24 24 L-24 24 L-10 -6 Z" fill="rgba(156,204,74,0.25)" stroke="#9ccc4a" strokeWidth="2" />
                <path d="M-20 16 L20 16 L22 22 L-22 22 Z" fill="#9ccc4a" opacity="0.8" />
            </g>
        ))}
        {/* Extended 2400px wide path from -600px to 1800px guarantees zero edge cutoff */}
        <path className="cbd-tox-surface" d="M-600 110 Q-500 96 -400 110 T-200 110 T0 110 T200 110 T400 110 T600 110 T800 110 T1000 110 T1200 110 T1400 110 T1600 110 T1800 110 L1800 140 L-600 140 Z" fill="url(#tox-acid)" />
        {[[220, 0], [460, 0.7], [680, 1.3], [940, 0.4], [1120, 1.9]].map(([x, d]) => (
            <circle key={x} className="cbd-tox-bubble" cx={x} cy="110" r="8" fill="url(#tox-bub)" style={{ animationDelay: `${d}s` }} />
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
        const sag = Math.sin((i / (N - 1)) * Math.PI) * 18;
        links.push({ x, y: 52 + sag, rot: i % 2 ? 0 : 90 });
    }
    return (
        <SVG>
            <defs>
                <linearGradient id="wd-iron" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9e9384" /><stop offset="50%" stopColor="#423b32" /><stop offset="100%" stopColor="#181511" /></linearGradient>
            </defs>
            <rect width="1200" height="140" fill="#0e0c0a" />
            <g className="cbd-wd-chain">
                {links.map((l, i) => (
                    <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.rot})`}>
                        <ellipse cx="0" cy="0" rx="38" ry="20" fill="none" stroke="url(#wd-iron)" strokeWidth="13" />
                        <ellipse cx="0" cy="0" rx="38" ry="20" fill="none" stroke="#c8ad72" strokeOpacity="0.4" strokeWidth="3" />
                    </g>
                ))}
            </g>
            <g className="cbd-wd-shackle" transform="translate(600 120)">
                <rect x="-30" y="-16" width="60" height="32" rx="8" fill="#2a2620" stroke="#8a8074" strokeWidth="4" />
                <circle cx="0" cy="0" r="11" fill="#0e0c0a" />
                <circle cx="0" cy="0" r="11" fill="none" stroke="#c8ad72" strokeWidth="2" />
                <rect x="-4" y="16" width="8" height="24" fill="#3a352c" />
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
            <radialGradient id="aug-orb" cx="42%" cy="38%"><stop offset="0%" stopColor="#f5ebff" /><stop offset="45%" stopColor="#a855f7" /><stop offset="100%" stopColor="#3b0764" /></radialGradient>
            <radialGradient id="aug-glow"><stop offset="0%" stopColor="#d8b4fe" stopOpacity="0.65" /><stop offset="100%" stopColor="#d8b4fe" stopOpacity="0" /></radialGradient>
            <linearGradient id="aug-bone" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#fef08a" /><stop offset="100%" stopColor="#ca8a04" /></linearGradient>
        </defs>
        <rect width="1200" height="140" fill="#0e0a14" />
        <path d="M0 132 Q600 104 1200 132 L1200 140 L0 140 Z" fill="#1a1030" opacity="0.9" />
        {[[180, 40], [300, 70], [900, 50], [1040, 80], [160, 90]].map(([x, y], i) => (
            <circle key={'s' + i} className="cbd-aug-star" cx={x} cy={y} r="2.6" fill="#e9d5ff" style={{ animationDelay: (i * 0.4) + 's' }} />
        ))}
        <g className="cbd-aug-threads" fill="none" stroke="#c084fc" strokeOpacity="0.45" strokeWidth="1.5">
            <ellipse cx="600" cy="70" rx="130" ry="36" />
            <ellipse cx="600" cy="70" rx="165" ry="48" strokeOpacity="0.25" />
        </g>
        <circle className="cbd-aug-halo" cx="600" cy="70" r="96" fill="url(#aug-glow)" />
        <g className="cbd-aug-orb">
            <circle cx="600" cy="70" r="38" fill="url(#aug-orb)" stroke="#e9d5ff" strokeOpacity="0.7" strokeWidth="2" />
            <ellipse cx="588" cy="58" rx="12" ry="7" fill="#ffffff" opacity="0.6" />
            <path d="M574 80 Q600 70 626 80" fill="none" stroke="#e9d5ff" strokeOpacity="0.6" strokeWidth="2" />
        </g>
        {[[460, 120, 12, 'ᚠ'], [600, 128, -14, 'ᚢ'], [740, 118, 24, 'ᚦ']].map(([x, y, r, rune], i) => (
            <g key={'b' + i} className="cbd-aug-bone" style={{ animationDelay: (i * 0.5) + 's' }} transform={`translate(${x} ${y}) rotate(${r})`}>
                <rect x="-14" y="-5" width="28" height="10" rx="5" fill="url(#aug-bone)" stroke="#854d0e" strokeWidth="1" />
                <text x="0" y="3" textAnchor="middle" fontSize="10" fill="#422006" fontWeight="900">{rune}</text>
            </g>
        ))}
        <circle className="cbd-aug-rune" cx="600" cy="124" r="32" fill="url(#aug-glow)" />
    </SVG>
);

/* ----------------------------------------------------------------- */
/* 21. CRUSADER                                                      */
/* ----------------------------------------------------------------- */
const Crusader = () => (
    <SVG>
        <defs>
            <radialGradient id="cru-glow"><stop offset="0%" stopColor="#fef08a" stopOpacity="0.6" /><stop offset="100%" stopColor="#f59e0b" stopOpacity="0" /></radialGradient>
        </defs>
        <rect width="1200" height="140" fill="#1c1509" />
        <g stroke="#fbbf24" strokeOpacity="0.3" strokeWidth="2">
            {Array.from({ length: 12 }).map((_, i) => {
                const a = (i / 12) * Math.PI * 2;
                return <line key={i} x1="600" y1="70" x2={600 + Math.cos(a) * 300} y2={70 + Math.sin(a) * 100} />;
            })}
        </g>
        <circle cx="600" cy="70" r="80" fill="url(#cru-glow)" />
        <polygon points="600,20 640,40 640,90 600,120 560,90 560,40" fill="#78350f" stroke="#fbbf24" strokeWidth="3" />
        <line x1="600" y1="20" x2="600" y2="120" stroke="#fde047" strokeWidth="2" />
        <line x1="560" y1="55" x2="640" y2="55" stroke="#fde047" strokeWidth="2" />
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
    crusader: Crusader,
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
