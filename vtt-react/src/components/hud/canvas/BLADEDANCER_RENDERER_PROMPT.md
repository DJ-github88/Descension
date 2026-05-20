# Canvas Resource Bar Renderer — Bladedancer Stance Flow

## What Exists Now (CSS HTML Bar)

The Bladedancer's resource bar is a **three-segment horizontal pill** at `ClassResourceBar.jsx` lines 8268–8880, routed via `visual.type === 'stance-flow'`.

### Current visual layout
```
┌────────────────────────────────────────────────────┐
│ [Momentum Bar LEFT] [Stance Icon CENTER] [Flourish Bar RIGHT] │
│   Blue fill 0-20       Ornament + icon     Gold fill 0-5     │
│   Click → +/- menu     Click → transitions  Click → +/- menu │
└────────────────────────────────────────────────────┘
```

### Current CSS structure (`stance-flow.css` — 187 lines)
```
.class-resource-bar.stance-flow     — transparent, no border
  .stance-flow-compact              — flex row, 24px pill, parchment gradient bg, rounded
    .momentum-bar-left              — flex:1, blue tint bg, left-rounded, hover glow
      .momentum-fill                — width:% blue fill
      .resource-value-left          — centered "12"
    .stance-icon-center             — 28px wide, ornament circle + 4 diagonal lines + FA icon
    .flourish-bar-right             — flex:1, dark tint bg, right-rounded, hover glow
      .flourish-fill                — width:% gold fill (right-aligned)
      .resource-value-right         — centered "3"
```

### Current sizing
| Size | Pill height | Stance icon | Icon font | Context |
|------|-----------|-------------|-----------|---------|
| `small` | 20px | 30×30px | 14px | PartyHUD member frame |
| `normal` | 24px | 28px wide | 12px | Portrait HUD |
| `large` | 32px | 44×44px | 22px | Rules page |

### The three resources

| Resource | Range | Behavior | Interaction |
|----------|-------|----------|-------------|
| **Momentum** | 0–20 | Volatile: +1/2 on hit/crit, -1 on miss/damage. Crashes to 0 if rooted. | Left click opens +1/+2/-2/-4/reset/max menu |
| **Stance** | 6 stances (network graph) | Passive bonuses/penalties while active. Transitions cost 2–4 Momentum. | Center click shows available transitions with costs |
| **Flourish** | 0–5 | Persistent tokens from Signature Moves. No decay. Spent on ultimates. | Right click opens +1/-1/reset/max menu |

### What the player needs to know at a glance (playability requirements)

1. **How much Momentum do I have?** — The volatile resource. Am I rich (can afford transitions + abilities) or poor (limited options)?
2. **What stance am I in?** — My current passive bonuses/penalties.
3. **Can I afford a stance transition?** — The network has costs 2–4. Do I have enough?
4. **How much Flourish do I have?** — Persistent tokens toward ultimates.
5. **What's my "combat tempo"?** — Momentum should FEEL like a heartbeat that rises and falls.

### Current playability issues (what canvas can fix)

1. **Momentum looks static** — A flat blue fill doesn't convey the "combat heartbeat" nature. Should pulse/breathe.
2. **Flourish as a fill bar is misleading** — Flourish is discrete tokens (0–5), not a percentage. A fill bar suggests continuous values. Should be 5 pips.
3. **No threshold indicators** — Can I afford a stance transition (2)? An ability (3–6)? A signature move (6)? The bar doesn't show spending thresholds.
4. **Stance icon is decorative, not informative** — Just an FA icon. Doesn't show stance TYPE (offensive/defensive/etc.) or available transition directions.
5. **No visual connection between resources** — Momentum feeds into Stance (spending to transition). There's no visual energy flow.
6. **Flourish fill goes right-to-left** — Inconsistent with Momentum's left-to-right. Confusing for quick reading.

---

## What We're Building (Canvas Stance Flow Renderer)

### Design philosophy
The bar should feel like a **living weapon** — a blade that hums with kinetic energy. Momentum is the blade's vibration, the Stance is the grip, Flourish is the edge.

### Visual design — "Living Blade Stance Flow"

**Single canvas** rendering all three segments as one cohesive visual:

```
┌──────────────────────────────────────────────────────┐
│ ░░░░░░▓▓▓▓▓▓▓▓▓▓▓░░░░ │ ◆ │ ◇◇◇◆◆                │
│ ▒▒▒▒▒▒▓▓▓▓▓▓▓▓▓▓▓▒▒▒▒ │ ◆ │                       │
│ ░░░░░░▓▓▓▓▓▓▓▓▓▓▓░░░░ │ ◆ │                       │
│    Momentum (12/20)    │Stance│   Flourish (3/5)     │
│  [threshold marks 2,6] │Icon │   [5 diamond pips]    │
└──────────────────────────────────────────────────────┘
```

### Segment 1: Momentum (left, ~60% width)

**A flowing, breathing fill bar:**
- Base: dark blue-tinted rounded rect (left-capped)
- Fill: animated blue gradient that **pulses** — faster pulse at higher momentum (conveying "heartbeat")
- Fill has internal **flowing wave motion** — not flat, it ripples like water (fitting "Flowing Water" stance theme)
- **Threshold markers** at 2, 4, 6: thin bright lines showing "you can afford a transition / ability / signature move"
- Threshold markers change color: gray (can't afford) → white (can afford) → stance-color (actively hoverable)
- **Value text** "12/20" centered, same style as Berserker text
- At 0 momentum: bar looks "dead" — flat, no pulse, dim
- At 15+ momentum: intense glow, rapid pulse, energetic particles

**Momentum particles:**
- Small blue energy sparks drift from the fill toward the stance icon
- Speed and count scale with momentum value
- Represents "energy feeding into your stance"

### Segment 2: Stance Icon (center, fixed width)

**A dynamic glowing gem:**
- Stance-colored glowing circle (not just an FA icon)
- The circle pulses with the stance's signature color
- FA icon overlaid on top, white with stance-colored shadow
- **Transition hint arrows** — subtle directional indicators showing which stances are accessible (e.g., small dots at N/S/E/W showing available network connections)
- When Momentum is sufficient for a transition, the accessible stance dots glow brighter
- On stance change: brief flash/ripple effect emanating from center

### Segment 3: Flourish (right, ~40% width)

**Five discrete diamond pips — NOT a fill bar:**
- 5 diamond shapes in a row (or pentagon arrangement for large size)
- Empty pip: dark outline, very subtle
- Filled pip: glowing gold with inner sparkle
- Pips fill LEFT to RIGHT (consistent reading direction with momentum)
- Gentle pulse on the most recently filled pip
- **Value text** "3/5" shown below or beside the pips (or just the pip count is enough)

**Why pips instead of a bar:**
- Flourish is 0–5 TOKENS, not a continuous value
- Pips instantly communicate "I have 3 tokens to spend"
- Each pip can visually represent a specific earned Flourish (if we ever want to track origin)

### Full-bar effects

- **Energy flow line**: A subtle glowing line connecting Momentum → Stance → Flourish, showing the resource relationship
- **Stance transition animation**: When transitioning, a burst of particles flows from the momentum bar through the stance icon
- **Flow Master spec bonus**: All threshold markers glow blue (reduced costs visible)
- **Shadow Dancer spec bonus**: Shadow Step accessible indicator glows even when not in network range

---

## Architecture

### Renderer: `bladedancerStanceRenderer.js`

Single canvas renderer with three visual zones. Hit testing returns which zone was clicked:

```js
hitTest(mx, my, ...) → {
  zone: 'momentum' | 'stance' | 'flourish',
  momentumPercent: 0.6,      // for momentum zone
  pipIndex: 3,                // for flourish zone
} | null
```

### Data flow via config:
```js
config = {
  momentum: { current: 12, max: 20 },
  flourish: { current: 3, max: 5 },
  currentStance: 'Striking Serpent',
  stances: { 'Flowing Water': { icon, color, type }, ... },
  transitionCosts: { ... },
  availableTransitions: ['Whirling Wind', 'Rooted Stone', 'Flowing Water'],
  specialization: 'Flow Master',
}
```

### Wrapper: Uses `layoutMode="bar"` (same as Berserker — responsive width)
- Height: 24px normal, 20px small, 32px large
- The canvas fills the stance-flow-compact container width

### Integration: Replace the three HTML segments with one ResourceCanvasBar
- Three separate click handlers → one canvas with zone-based hit testing
- The parent (`renderStanceFlow`) decides what menu to show based on `hit.zone`
- Momentum menu → `setShowMomentumMenu(true)`
- Stance click → `setShowStanceMenu(true)`
- Flourish click → `setShowFlourishMenu(true)`

---

## Sizing Rules

| Size | Bar height | Stance zone width | Pip size | Font | Context |
|------|-----------|-------------------|----------|------|---------|
| `large` | 32px | 44px | 8px | 14px | Rules page |
| `normal` | 24px | 28px | 6px | 12px | Portrait HUD |
| `small` | 20px | 24px | 4px | 10px | PartyHUD |

### Zone layout ratios
- Momentum zone: ~55% of total width
- Stance zone: fixed width (see table)
- Flourish zone: remaining ~45% minus stance width

---

## Rendering Rules

### Momentum zone
- Background: dark blue-tinted rounded rect (left half of pill)
- Fill: animated blue gradient, wave motion via `Math.sin(time * speed + x * freq)`
- Pulse: glow intensity oscillates via `Math.sin(time * (2 + momentum/max * 4))`
- Threshold marks at 2, 4, 6: vertical lines, brightness based on affordability
- Value text: "12/20" centered
- Particles: blue energy dots drifting toward center

### Stance zone
- Stance-colored glowing circle
- FA icon rendered as... wait, canvas can't render FA icons natively.
- **Solution**: Keep the stance icon as HTML overlay on top of the canvas, OR draw a simple geometric symbol per stance
- Better solution: Canvas draws the glow/pulse background, HTML icon stays on top via CSS positioning

**Hybrid approach** (recommended):
- Canvas draws the glowing circle and effects
- HTML `.stance-icon-center` with FA icon is positioned absolutely ON TOP of the canvas
- This avoids font rendering issues in canvas and keeps the existing icon system working
- The canvas just adds the dynamic glow/pulse behind the icon

### Flourish zone
- 5 diamond pips in a horizontal row
- Filled pips: gold with inner white sparkle, subtle pulse
- Empty pips: dark outline, very low opacity fill
- **NO value text needed** — the pip count IS the value (but can add small text if desired)

### Double-framing (same lesson)
- For `large`: canvas draws own dark background, border
- For `small`/`normal`: canvas transparent, CSS `.stance-flow-compact` provides the pill frame

---

## Checklist Before Starting

1. ✅ Read `renderStanceFlow()` (lines 8268–8880) — understand current HTML structure
2. ✅ Read `stance-flow.css` (187 lines) — understand current CSS
3. ✅ Read `bladedancerData.js` — understand stances, network, costs
4. ✅ Read `classResources.js` Bladedancer section — resource config
5. ✅ Read tooltip code (lines 9015–9162) — understand hover info
6. ⬜ Read PartyHUD integration for small-size constraints
7. ⬜ Decide: single canvas or hybrid (canvas + HTML stance icon)

## Checklist After Implementation

1. Renderer registered in `renderers/index.js` as `'stance-flow'`
2. ResourceCanvasBar with `layoutMode="bar"` wraps the whole stance-flow
3. Three-zone hit testing works (momentum/stance/flourish)
4. Momentum pulses and flows
5. Flourish shows as 5 diamond pips
6. Stance icon renders correctly (hybrid: canvas glow + HTML icon)
7. Threshold markers on momentum at 2, 4, 6
8. Energy particles flow from momentum toward stance
9. All three click menus still work
10. Tooltips still work on hover per zone
11. Small size fits PartyHUD member frame
12. Large size shows enhanced effects
13. Specialization bonuses reflected (Flow Master thresholds, Shadow Step access)
14. No console errors

## Key Files Reference

| File | Path | Role |
|------|------|------|
| Canvas wrapper | `src/components/hud/canvas/ResourceCanvasBar.jsx` | Already has bar mode from Berserker |
| Renderer (NEW) | `src/components/hud/canvas/renderers/bladedancerStanceRenderer.js` | The stance flow renderer |
| Fluid physics | `src/components/hud/canvas/renderers/fluidPhysics.js` | Reuse SparkParticle |
| Registry | `src/components/hud/canvas/renderers/index.js` | Register `stance-flow` |
| Integration host | `src/components/hud/ClassResourceBar.jsx` (lines 8268–8880) | `renderStanceFlow()` |
| Stance flow CSS | `src/components/hud/styles/resourceBars/stance-flow.css` | Simplify (remove fill/text) |
| Bladedancer data | `src/data/classResources.js` (lines 2026–2176) | Stance config, network |
| Bladedancer class | `src/data/classes/bladedancerData.js` | Spells, specs |
| Rules page | `src/components/rules/ClassDetailDisplay.jsx` | Large-size display |
