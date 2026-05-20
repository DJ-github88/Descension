# Canvas Resource Bar Renderer — Berserker Rage Bar

## What Exists Now (CSS HTML Bar)

The Berserker's rage bar is currently a **pure CSS/HTML horizontal fill bar** at `ClassResourceBar.jsx` lines 8001–8254, routed via `visual.type === 'dual-dice'`.

### Current CSS structure (`rage-bar.css`)
```
.class-resource-bar.rage-bar         — outer column wrapper
  .rage-bar-wrapper                  — flex row-reverse, full width
    .rage-bar-container              — flex:1, click target, ref for tooltip
      .bar-background                — dark gradient bg, 20px tall (14px small, 28px large)
        .bar-fill                    — width:% colored by state, red gradient + glow shadow
      .bar-text                      — centered "42/100", white + text-shadow
    [popup menu portal]              — +/- buttons, manual input (separate React portal)
```

### Current sizing (from CSS)
| Size | Bar height | Text size | Context |
|------|-----------|-----------|---------|
| `small` | 14px | 10px | PartyHUD member frame (240px wide) |
| `normal` | 20px | 12px | Character portrait HUD, equipment |
| `large` | 28px | 14px | Rules page, character sheet |

### Current behavior
- Width: `flex:1` fills available space in `.rage-bar-container`
- Fill color changes by rage state (Smoldering→Frenzied→Primal→Carnage→Cataclysm→Obliteration)
- Overheat (101+): CSS `overheatGlow` + `rageShake` animations on `.bar-background`
- Click: toggles popup menu (portal with +5/-5/+10/-10/+20/-20, manual input 0–150)
- Hover: shows rage tooltip via `handleRageBarEnter/Leave`
- Security: `if (!isOwner) return` on all mutations

### What the canvas replaces
The canvas replaces **only** the visual bar: `.bar-background` + `.bar-fill` + `.bar-text`. The popup menu, container wrapper, and tooltip logic remain HTML/React.

---

## What We're Building (Canvas Thermal Gauge Renderer)

### Visual design — "Blood-Heat Thermal Gauge"
A canvas-rendered horizontal bar that visualizes the Berserker's escalating Blood-Heat (0–100+ rage) with these layers:

1. **Background**: Rounded-rect dark gradient (same as current CSS, drawn in canvas)
2. **Fill bar**: State-colored gradient fill left→right proportional to `rage/100`
   - Color shifts through rage states: dark ember → red → orange → yellow → white-hot
3. **Threshold markers**: Subtle tick marks at state boundaries (21, 41, 61, 81, 101)
4. **Overheat zone** (101+): Pulsing red overlay beyond the 100% mark + subtle canvas shake
5. **Ember particles**: Small rising sparks at higher rage levels (count scales with rage)
6. **Heat shimmer**: Subtle distortion wave across the fill at rage > 60
7. **State text**: "42/100" rendered in canvas (replaces `.bar-text`)
8. **Hover highlight**: Bright glow on the bar segment under cursor

### Critical architecture difference from Arcanoneer
The Arcanoneer renderer uses a **fixed-size orb grid** (8 orbs, pre-computed dimensions). The Berserker renderer uses a **responsive-width bar** that fills its container.

This means `ResourceCanvasBar.jsx`'s `computeDimensions()` — currently hardcoded for orb grids — must be extended to support bar-type renderers with responsive width.

---

## Architecture

### Layer 1: ResourceCanvasBar.jsx (WRAPPER — needs modification)

Currently hardcoded for orb layout:
```js
// EXISTING (orb mode)
const cols = isLarge ? 8 : 4;
const rows = isLarge ? 1 : 2;
const orbDiameter = isLarge ? 42 : (isSmall ? 22 : 32);
// ... computes fixed width/height
```

Needs a **bar mode** added:
```js
// NEW: bar mode — responsive width, fixed height
if (layoutMode === 'bar') {
  const h = isLarge ? 28 : (isSmall ? 14 : 20);
  // Width comes from ResizeObserver on container
  // Canvas fills container width
}
```

**Required changes to ResourceCanvasBar.jsx:**
1. Accept a `layoutMode` prop: `'grid'` (default, existing behavior) or `'bar'`
2. In `bar` mode: fixed height per size, width from `ResizeObserver` on `containerRef`
3. Add `ResizeObserver` effect for bar mode that updates `canvasSize.width` when container resizes
4. Keep all existing orb-mode behavior untouched (backward compatible)
5. Pass `layoutMode` through to renderer so it knows how to draw

### Layer 2: berserkerRageRenderer.js (NEW FILE — the renderer)

Must export a class with this interface:

| Method | Purpose |
|--------|---------|
| `constructor()` | Init state: particles array, time, prevRage (for delta detection) |
| `layout(config)` | For bar mode: returns `{ x, y, width, height, barRadius }` — the bar rect |
| `render(ctx, width, height, data, elements, size, config)` | Draw frame. `config.currentRage` is the rage value, `config.maxRage` is 100 |
| `update(data, elements, layoutResult, width, height)` | Per-frame: update particles, detect rage gains for spark bursts |
| `hitTest(mx, my, elements, spheres, size, canvasW, canvasH)` | Returns `{ barSegment: 'fill'|'overheat'|'background' }` or null |
| `setHovered(idx)` | For bar: pass a boolean or x-coordinate for hover highlight |
| `dispose()` | Cleanup |

**Data flow:**
- `config.currentRage` — the rage value (0–150)
- `config.maxRage` — 100
- `config.rageStates` — the state definitions from `classResources.js`
- `spheres` / `elements` — **not used** for Berserker (pass empty arrays)

### Layer 3: renderers/index.js (REGISTRY — add entry)

```js
import BerserkerRageRenderer from './berserkerRageRenderer';

// In RENDERER_REGISTRY:
'rage-bar': () => new BerserkerRageRenderer(),
```

### Layer 4: fluidPhysics.js (PARTICLES — reuse/extend)

Reuse existing `SparkParticle` for ember bursts. Optionally add:
- `EmberParticle` — slower rising spark with trail (if needed for distinct look)

---

## Sizing Rules (Bar Mode)

| Size | Bar height | Bar radius | Font size | Context |
|------|-----------|------------|-----------|---------|
| `large` | 28px | 6px | 14px | Rules page, character sheet |
| `normal` | 20px | 4px | 12px | Portrait HUD |
| `small` | 14px | 3px | 10px | PartyHUD |

### PartyHUD width constraint
- Member frame: `240px` wide, `padding: 8px`, `border: 2.5px` → inner: ~219px
- `.rage-bar-container` is `flex:1` so it fills remaining space after any side buttons
- Canvas width = container width (responsive via ResizeObserver)

---

## Rendering Rules

### Double-framing (same lesson as Arcanoneer)
- For `large` size: canvas draws its own background, border, rounded rect
- For `small`/`normal` sizes: canvas is **transparent background** — the CSS `.bar-background` container provides the frame
- This prevents "box inside a box"

### State colors (rage thresholds)
```
Smoldering   (0–20):   dark ember   #4A0000 → #8B2500
Frenzied     (21–40):  crimson      #CC0000 → #FF3333
Primal       (41–60):  orange-red   #E25822 → #FF7F50
Carnage      (61–80):  orange       #FF8C00 → #FFB347
Cataclysm    (81–100): yellow-gold  #FFD700 → #FFE55C
Obliteration (101+):   white-hot    #FFFFFF with #FF0000 glow
```

The fill gradient should transition between these as rage increases, not snap discretely. Use the midpoint color of the current state as the primary fill color, blending toward the next state near boundaries.

### Threshold markers
Draw thin vertical lines at 21%, 41%, 61%, 81%, 101% of the bar width. Very subtle — just enough to show the state boundaries. Slightly brighter at the active state boundary.

### Overheat (101+)
- Fill extends beyond 100% mark (capped at 150/100 = 150% visually, but clip at bar width)
- Pulsing red glow overlay that oscillates via `Math.sin(time * 4)`
- Subtle horizontal shake via small random x-offset per frame
- Intensified ember particles (double count)

### Ember particles
- Spawn along the top edge of the fill bar
- Rise upward, fade out, drift slightly horizontally
- Count scales with rage: ~0 at Smoldering, ~5 at Primal, ~15 at Cataclysm, ~25 at Obliteration
- Use existing `SparkParticle` or create `EmberParticle` with slower rise speed

### Heat shimmer (rage > 60)
- Subtle sinusoidal distortion wave across the fill area
- Very low opacity — just a sense of heat haze
- Implemented as a semi-transparent wavy overlay

### State text
- Rendered in canvas: "42/100" centered in the bar
- White text with dark shadow (same style as current CSS `.bar-text`)
- Font size per size table above
- During overheat: text pulses between white and red

### Empty bar (rage = 0)
- Just the background, no fill, no particles
- Subtle dark ember glow at the base (ambient warmth)

---

## RAF Loop Stability (CRITICAL — same pattern)

The wrapper's RAF loop uses ref-based pattern:
- `spheresRef`, `elementsRef`, `callbacksRef` store current values
- RAF callback reads from refs — does NOT close over state
- Loop only restarts on layout/size changes, not data changes
- Data changes update refs, next RAF frame picks them up

For bar mode, the rage value goes through `configRef.current.currentRage`. Do NOT change this pattern.

---

## Tooltip Pattern (keep existing)

The current rage tooltip is managed by `handleRageBarEnter/Leave` in ClassResourceBar. The canvas bar should trigger the same tooltip. Two options:

1. **Simple**: Keep `onMouseEnter`/`onMouseLeave` on the canvas container div (outside canvas). The canvas doesn't need to manage tooltip position.
2. **Enhanced**: Use `onElementHover` callback to pass rage state info for a richer tooltip.

Recommend option 1 for parity with existing behavior. The tooltip content (state, bonuses, penalties) is already implemented at lines 10369–10426.

---

## Integration Plan

### In ClassResourceBar.jsx — modify `renderRageBar()`

Replace the `.bar-background` > `.bar-fill` + `.bar-text` divs with:

```jsx
<div className="rage-bar-container" ref={rageBarRef}
     onMouseEnter={handleRageBarEnter}
     onMouseLeave={handleRageBarLeave}
     onClick={(e) => { e.stopPropagation(); setShowRageMenu(v => !v); }}>
    <ResourceCanvasBar
        rendererType="rage-bar"
        size={size}
        layoutMode="bar"
        spheres={[]}
        elements={[]}
        config={{
            currentRage: berserkerRage,
            maxRage: berserkerRageMax,
            rageStates: finalConfig.rageStates,
        }}
        isOwner={isOwner}
        style={{ width: '100%', height: size === 'large' ? 28 : (size === 'small' ? 14 : 20) }}
    />
</div>
```

Everything else in `renderRageBar()` stays the same: the popup menu portal, the outer container, the overheated class toggle.

---

## CSS Changes

The existing `rage-bar.css` mostly stays. Remove/simplify:
- `.bar-fill` styles (canvas draws the fill now)
- `.bar-text` styles (canvas draws the text now)
- `.bar-overheat` (canvas handles overheat visuals)

Keep:
- `.class-resource-bar.rage-bar` container layout
- `.rage-bar-wrapper` flex layout
- `.rage-bar-container` positioning
- `.bar-background` background/border for small/normal (canvas is transparent, CSS provides frame)
- All popup menu styles
- Overheated class toggle (used for container-level effects if needed)

---

## Checklist Before Starting

1. ✅ Read `ClassResourceBar.jsx` `renderRageBar()` (lines 8001–8254) — understand current HTML structure
2. ✅ Read `rage-bar.css` (287 lines) — understand current CSS styling
3. ✅ Read `arcanoneerSphereRenderer.js` — reference for renderer interface
4. ✅ Read `ResourceCanvasBar.jsx` — understand wrapper, identify needed modifications
5. ✅ Read `renderers/index.js` — see registration pattern
6. ✅ Read `fluidPhysics.js` — see what particles exist for reuse
7. ✅ Read Berserker data in `classResources.js` (lines 1671–1782) — rage states, thresholds, mechanics
8. ⬜ Read `party-hud.css` line 1524+ — verify small-size constraints

## Checklist After Implementation

1. Renderer registered in `renderers/index.js` as `'rage-bar'`
2. `ResourceCanvasBar.jsx` updated with `layoutMode="bar"` + `ResizeObserver`
3. Arcanoneer still works unchanged (backward compatible)
4. Canvas embedded inside `renderRageBar()` replacing `.bar-fill` + `.bar-text`
5. `isOwner={true}` passed from Rules page context
6. Three sizes tested: large (Rules), normal (portrait), small (PartyHUD)
7. Small size fits within PartyHUD member frame (flex:1 width, 14px height)
8. No double-framing for small/normal (canvas transparent, CSS provides frame)
9. Overheat visuals work (pulsing glow, shake, intensified embers)
10. State colors transition smoothly through rage thresholds
11. Popup menu (+/- buttons, manual input) still works via click
12. Tooltip still works via hover enter/leave
13. RAF loop stable under rapid rage changes (spamming +5/-5)
14. Ember particles scale with rage level
15. No console errors in build

## Key Files Reference

| File | Path | Role |
|------|------|------|
| Canvas wrapper | `src/components/hud/canvas/ResourceCanvasBar.jsx` | Needs bar mode addition |
| Canvas wrapper CSS | `src/components/hud/styles/ResourceCanvasBar.css` | May need bar-mode styles |
| Renderer (NEW) | `src/components/hud/canvas/renderers/berserkerRageRenderer.js` | The rage bar renderer |
| Fluid physics | `src/components/hud/canvas/renderers/fluidPhysics.js` | Reuse SparkParticle |
| Registry | `src/components/hud/canvas/renderers/index.js` | Register `rage-bar` |
| Integration host | `src/components/hud/ClassResourceBar.jsx` (lines 8001–8254) | `renderRageBar()` |
| Rage bar CSS | `src/components/hud/styles/resourceBars/rage-bar.css` | Simplify (remove fill/text) |
| PartyHUD CSS | `src/styles/party-hud.css` (line 1524+) | Member frame constraints |
| Berserker data | `src/data/classResources.js` (lines 1671–1782) | Rage states, thresholds |
| Rules page | `src/components/rules/ClassDetailDisplay.jsx` | Large-size display |
