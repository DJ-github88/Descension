# SVG Resource Display Specifications: 7 Target Classes

**Date:** 2026-10-30  
**Status:** Calm Tabletop React-Rendered SVG Specifications  
**Scope:** The 7 Target Classes: Covenbane, Exorcist, Dreadnaught, Inscriptor, Witch Doctor, Bladedancer, Totemist.  
**Design System Anchor:** Calm TTRPG Visual Direction, ClassResourceBar HUD conventions (nominal 240px × 48px).

---

## 1. Visual Language & Accessibility Standards

In accordance with Mythrill's calm tabletop visual language:
- **Material Realism:** Palettes mirror authentic physical substances: cold bog-iron, coarse salt, weathered brass, slate, unbleached tallow, polished steel, and carved granite.
- **Restrained HUD Contrast:** Dark background containers (`#161922`, `#1e2230`) with soft atmospheric borders (`rgba(255,255,255,0.1)`).
- **Accessibility:** High-contrast numeric badges, distinct geometric silhouettes for colorblind users, SVG `<title>` and `<desc>` metadata.
- **States Represented:** Explicit visual definitions for Empty (0%), Partial (50%), Full (100%), and Warning/Critical states.

---

## 2. Component Specifications

### 1. Covenbane: Hexbreaker Charges (`CovenbaneResourceBar.jsx`)
- **Resource:** Hexbreaker Charges (0 to 6 charges).
- **Design Concept:** A weathered iron strip holding 6 barbed bog-iron nail heads. As charges accumulate, the nail heads glow with a pale silver-leaden luminescence.
- **Palette:** Iron Black (`#1f2421`), Pale Lead Silver (`#d1d5db`), Hexbreaker Glow (`#a7f3d0`).
- **SVG Structure:**
  ```jsx
  <svg viewBox="0 0 240 48" className="class-resource-svg" role="img" aria-label={`Hexbreaker Charges: ${charges}/6`}>
    <title>Covenbane Hexbreaker Charges</title>
    <desc>{`${charges} of 6 null-iron barbed charges active`}</desc>
    {/* Frame */}
    <rect x="2" y="2" width="236" height="44" rx="4" fill="#161922" stroke="#374151" strokeWidth="1.5" />
    {/* Charge Slots */}
    {[0, 1, 2, 3, 4, 5].map(idx => {
      const active = idx < charges;
      const x = 20 + idx * 34;
      return (
        <g key={idx} transform={`translate(${x}, 12)`}>
          <polygon points="12,0 24,12 12,24 0,12" fill={active ? "#374151" : "#1f2937"} stroke="#4b5563" strokeWidth="1" />
          {active && <polygon points="12,4 20,12 12,20 4,12" fill="#a7f3d0" filter="drop-shadow(0 0 2px #34d399)" />}
        </g>
      );
    })}
    <text x="225" y="29" fill="#e5e7eb" fontSize="13" fontFamily="Cinzel, serif" textAnchor="end">{`${charges}/6`}</text>
  </svg>
  ```

---

### 2. Exorcist: Purification Sanctity (`ExorcistResourceBar.jsx`)
- **Resource:** Purification Sanctity (0 to 10 points).
- **Design Concept:** A consecrated circular salt ring flanked by scriptural phylactery ribbons. As sanctity rises, the ring fills with glowing silver salt crystals.
- **Palette:** Parchment Off-White (`#f3f4f6`), Sacred Silver (`#e0e7ff`), Dark Ash Linen (`#1e1b2e`).
- **SVG Structure:**
  ```jsx
  <svg viewBox="0 0 240 48" className="class-resource-svg" role="img" aria-label={`Purification Sanctity: ${sanctity}/10`}>
    <title>Exorcist Purification Sanctity</title>
    <desc>{`${sanctity} of 10 purification sanctity points`}</desc>
    <rect x="2" y="2" width="236" height="44" rx="4" fill="#15171e" stroke="#4338ca" strokeWidth="1.2" />
    {/* Sanctity Progress Track */}
    <rect x="50" y="18" width="130" height="12" rx="3" fill="#1f2430" />
    <rect x="50" y="18" width={(sanctity / 10) * 130} height="12" rx="3" fill="url(#saltGrad)" />
    {/* Salt Seal Emblem */}
    <circle cx="26" cy="24" r="14" fill="#1e1b2e" stroke="#818cf8" strokeWidth="1.5" />
    <path d="M 26 14 L 26 34 M 16 24 L 36 24" stroke="#c7d2fe" strokeWidth="1.5" />
    <text x="225" y="29" fill="#e0e7ff" fontSize="13" fontFamily="Cinzel, serif" textAnchor="end">{`${sanctity}/10`}</text>
  </svg>
  ```

---

### 3. Dreadnaught: Furnace Pressure (`DreadnaughtResourceBar.jsx`)
- **Resource:** Furnace Pressure (0 to 100 PSI).
- **Design Concept:** A heavy riveted brass-and-iron boiler pressure dial with green, amber, and red danger zones.
- **Palette:** Riveted Cast Iron (`#1c1917`), Burnished Brass (`#d97706`), Steam White (`#fef3c7`), Overheat Red (`#ef4444`).
- **SVG Structure:**
  ```jsx
  <svg viewBox="0 0 240 48" className="class-resource-svg" role="img" aria-label={`Furnace Pressure: ${psi} PSI`}>
    <title>Dreadnaught Furnace Pressure</title>
    <desc>{`${psi} PSI boiler pressure: ${psi >= 90 ? 'CRITICAL OVERHEAT' : 'STABLE'}`}</desc>
    <rect x="2" y="2" width="236" height="44" rx="4" fill="#1c1917" stroke="#78350f" strokeWidth="1.5" />
    {/* Pressure Bar */}
    <rect x="55" y="18" width="125" height="12" rx="2" fill="#292524" />
    <rect x="55" y="18" width={(Math.min(psi, 100) / 100) * 125} height="12" rx="2" 
          fill={psi >= 90 ? '#ef4444' : psi >= 60 ? '#f59e0b' : '#10b981'} />
    {/* Gauge Dial Icon */}
    <circle cx="28" cy="24" r="14" fill="#292524" stroke="#d97706" strokeWidth="2" />
    <line x1="28" y1="24" x2={28 + 10 * Math.cos(((psi/100)*180 - 180) * Math.PI / 180)}
          y2={24 + 10 * Math.sin(((psi/100)*180 - 180) * Math.PI / 180)} stroke="#fef3c7" strokeWidth="2" />
    <text x="225" y="29" fill={psi >= 90 ? '#fca5a5' : '#fef3c7'} fontSize="12" fontFamily="monospace" textAnchor="end">{`${psi} PSI`}</text>
  </svg>
  ```

---

### 4. Inscriptor: Runic Resonance (`InscriptorResourceBar.jsx`)
- **Resource:** Runic Resonance (0 to 10 Resonance).
- **Design Concept:** An engraved slate slab with 10 geometric runic slots that illuminate in deep lapis blue.
- **Palette:** Slate Gray (`#1e293b`), Lapis Lazuli (`#2563eb`), Arcane Cyan (`#38bdf8`).
- **SVG Structure:**
  ```jsx
  <svg viewBox="0 0 240 48" className="class-resource-svg" role="img" aria-label={`Runic Resonance: ${resonance}/10`}>
    <title>Inscriptor Runic Resonance</title>
    <desc>{`${resonance} of 10 active runic resonance nodes`}</desc>
    <rect x="2" y="2" width="236" height="44" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
    {[...Array(10)].map((_, i) => {
      const active = i < resonance;
      return (
        <rect key={i} x={16 + i * 16} y="18" width="11" height="12" rx="1"
              fill={active ? '#2563eb' : '#1e293b'} stroke={active ? '#38bdf8' : '#334155'} strokeWidth="1" />
      );
    })}
    <text x="225" y="29" fill="#93c5fd" fontSize="13" fontFamily="Cinzel, serif" textAnchor="end">{`${resonance}/10`}</text>
  </svg>
  ```

---

### 5. Witch Doctor: Bog Tallow (`WitchDoctorResourceBar.jsx`)
- **Resource:** Bog Tallow (0 to 100 Tallow).
- **Design Concept:** An antique clay crucible filled with viscous green-black peat tallow, flanked by bone needle indicators.
- **Palette:** Bog Clay (`#27272a`), Dark Moss (`#14532d`), Tallow Green (`#22c55e`).
- **SVG Structure:**
  ```jsx
  <svg viewBox="0 0 240 48" className="class-resource-svg" role="img" aria-label={`Bog Tallow: ${tallow}/100`}>
    <title>Witch Doctor Bog Tallow</title>
    <desc>{`${tallow} of 100 bog tallow units`}</desc>
    <rect x="2" y="2" width="236" height="44" rx="4" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
    <rect x="52" y="18" width="128" height="12" rx="3" fill="#27272a" />
    <rect x="52" y="18" width={(tallow / 100) * 128} height="12" rx="3" fill="#15803d" />
    {/* Crucible Icon */}
    <path d="M 18 20 Q 28 34 38 20 Z" fill="#27272a" stroke="#4ade80" strokeWidth="1.5" />
    <text x="225" y="29" fill="#86efac" fontSize="13" fontFamily="Cinzel, serif" textAnchor="end">{`${tallow}%`}</text>
  </svg>
  ```

---

### 6. Bladedancer: Kinetic Momentum (`BladedancerResourceBar.jsx`)
- **Resource:** Kinetic Momentum (0 to 10 Momentum; 4 Tiers: Adagio, Andante, Allegro, Presto).
- **Design Concept:** A dual-arc swept curve resembling twin scimitars, with an energetic kinetic pointer showing the current tempo tier.
- **Palette:** Dueling Steel (`#334155`), Polished Chrome (`#cbd5e1`), Kinetic Rose Gold (`#f43f5e`).
- **SVG Structure:**
  ```jsx
  <svg viewBox="0 0 240 48" className="class-resource-svg" role="img" aria-label={`Kinetic Momentum: ${momentum}/10`}>
    <title>Bladedancer Kinetic Momentum</title>
    <desc>{`${momentum} of 10 momentum points: tier ${momentum >= 9 ? 'Presto' : momentum >= 6 ? 'Allegro' : momentum >= 3 ? 'Andante' : 'Adagio'}`}</desc>
    <rect x="2" y="2" width="236" height="44" rx="4" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
    {/* 4 Tier Blocks */}
    <rect x="45" y="18" width="30" height="12" fill={momentum >= 1 ? '#38bdf8' : '#1e293b'} rx="1" />
    <rect x="78" y="18" width="30" height="12" fill={momentum >= 3 ? '#38bdf8' : '#1e293b'} rx="1" />
    <rect x="111" y="18" width="30" height="12" fill={momentum >= 6 ? '#f59e0b' : '#1e293b'} rx="1" />
    <rect x="144" y="18" width="30" height="12" fill={momentum >= 9 ? '#f43f5e' : '#1e293b'} rx="1" />
    <text x="225" y="29" fill="#f1f5f9" fontSize="12" fontFamily="Cinzel, serif" textAnchor="end">
      {momentum >= 9 ? 'PRESTO' : momentum >= 6 ? 'ALLEGRO' : momentum >= 3 ? 'ANDANTE' : 'ADAGIO'}
    </text>
  </svg>
  ```

---

### 7. Totemist: Conduit Attunement (`TotemistResourceBar.jsx`)
- **Resource:** Conduit Attunement (0 to 10) & 3 Pylon Slots.
- **Design Concept:** A lithic triangular pedestal displaying 3 discrete pylon status nodes and a central attunement resonance track.
- **Palette:** Granite Gray (`#334155`), Earth Umber (`#92400e`), Lightning Gold (`#fbbf24`).
- **SVG Structure:**
  ```jsx
  <svg viewBox="0 0 240 48" className="class-resource-svg" role="img" aria-label={`Conduit Attunement: ${attunement}/10, Pylons: ${activePylons}/3`}>
    <title>Totemist Conduit Attunement</title>
    <desc>{`${attunement} of 10 attunement with ${activePylons} of 3 active pylons deployed`}</desc>
    <rect x="2" y="2" width="236" height="44" rx="4" fill="#1c1917" stroke="#78350f" strokeWidth="1.5" />
    {/* 3 Pylon Token Icons */}
    {[0, 1, 2].map(i => {
      const active = i < activePylons;
      return (
        <circle key={i} cx={24 + i * 16} cy="24" r="6"
                fill={active ? '#fbbf24' : '#292524'} stroke="#d97706" strokeWidth="1.5" />
      );
    })}
    {/* Attunement Gauge */}
    <rect x="75" y="18" width="100" height="12" rx="2" fill="#292524" />
    <rect x="75" y="18" width={(attunement / 10) * 100} height="12" rx="2" fill="#d97706" />
    <text x="225" y="29" fill="#fef3c7" fontSize="13" fontFamily="Cinzel, serif" textAnchor="end">{`${attunement}/10`}</text>
  </svg>
  ```
