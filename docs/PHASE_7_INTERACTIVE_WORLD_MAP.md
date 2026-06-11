# PHASE 7: INTERACTIVE WORLD MAP

> Status: **Completed**
> Build order: 7.1 + 7.2 → user defines regions → 7.3 → 7.4 → 7.5 → 7.6 (future)

## PHASE 7 COMPLETION SUMMARY (June 2026)

All tasks for Phase 7 (7.1 through 7.5) have been fully implemented, verified, and refined:
- **7.1 Immerse Button & Transition:** Implemented the "Immerse" button with solid midnight royal blue gradient styling and gold text matching the hero primary button's visual weight. Created a zero-jump transitional zoom starting exactly from the active landing page background position by setting the transform programmatically on mount. Zoom transitions are set to 3500ms (enter) and 2000ms (exit) for immersive pacing.
- **7.2 Dev Editor & 7.3 Region Overlays:** Integrated drawing polygons and placing location pins inside map coordinates (panning/zooming with canvas). Supported GM shift-drag repositioning and right-click pin deletion.
- **7.4 Lore Sidebar & 7.5 Location Pins:** Wired location pins with zone IDs to expand and scroll sidebar to corresponding lore cards. Created detailed data rendering for deep locations (population, governing structure, economy, sub-locations, and a customized parchment atmosphere panel).
- **Refined Aesthetics & Controls:**
  - Unified the burnt parchment border into a single full-screen edge container warped by an SVG fractal noise displacement filter, adding smoldering ember animations and avoiding corner overlap glitches. Reduced visual thickness to prevent obstructing the map content.
  - Set `limitToBounds={true}` and dynamic cover scale sizing for `minScale` so that the map canvas behaves like a full-screen viewport and never shows empty borders.
  - Configured smooth wheel zoom step of `0.05` and `150ms` animation time to make map navigation elegant, fluid, and highly controllable.

---

## SECTION 1: OVERVIEW & ARCHITECTURE

### 1.1 What This Phase Delivers

An interactive world map accessible from the landing page that allows:
- Exploring the 7 regions of Mythrill through zoom/pan on the world map image
- Region outlines that highlight on hover and open lore sidebars on click
- Dev tool for drawing region boundaries and placing location pins
- (7.6 future) Player annotations, friend sharing, custom drawings

### 1.2 Architecture Decision

**Custom component + SVG overlays.** No heavy GIS library.

| Choice | Rationale |
|---|---|
| Custom viewer with `react-zoom-pan-pinch` (8KB) | Lightweight, handles wheel zoom/drag pan/touch. No leaflet CSS conflicts with Bootstrap. |
| SVG polygon overlays for regions | Native browser rendering, easy hover/click handling, scales with zoom transforms |
| CSS for parchment aesthetic | Consistent with existing Mythrill VTT visual language |
| Copy-paste console export for dev editor | No server write endpoint needed, data lives in codebase JS files |

### 1.3 Key Existing Assets

| Asset | Path | Details |
|---|---|---|
| World map image | `vtt-react/public/assets/images/backgrounds/Mythril.jpeg` | 4096x3072px, ~3.3MB |
| Landing page CSS pan | `vtt-react/src/components/landing/styles/LandingPage.css` lines 93-136 | 240s `mapPan` keyframes, `background-size: 420%`, naming regions in comments |
| Landing page component | `vtt-react/src/components/landing/LandingPage.jsx` | 522 lines, hero with Play Online + Sandbox buttons |
| Route registration | `vtt-react/src/App.jsx` line 1148-1158 | Routes `/` to `LandingPage` |
| Region meta | `vtt-react/src/store/worldStore.js` lines 8-58 | `REGION_META` with id, name, description, dangerLevel, mapStyle |
| Zone data | `vtt-react/src/data/zoneData.js` | 35 zones across 7 regions (5 per region), with id, type, connections, factions |
| Deep locations | `vtt-react/src/data/deepLocationData.js` | 4 deep locations with heraldry, population, governance, atmosphere, subLocations |
| Lore dictionary | `vtt-react/src/data/loreDictionary.js` | Region and entity lore entries with id, term, type, summary, fullEntry |
| Biome data | `vtt-react/src/data/biomeData.js` | 6 biomes mapped to regions via `regionFlavor.regionName` |
| World guide | `docs/GM_WORLD_GUIDE.md` | Canonical narrative source, Part II lines 46-367 |
| Subscription tiers | `vtt-react/src/services/subscriptionService.js` | GUEST, FREE, PRO (Dungeon Master), ULTIMATE (Archmage) with featureFlags |
| Social/friends | `vtt-react/src/store/socialStore.js` + `vtt-react/src/services/socialService.js` | Friend list management, presence tracking |
| Nav library window | `vtt-react/src/components/windows/LibraryWindow.jsx` | Atlas section renders `MapLibraryWindow` — UI pattern reference |

### 1.4 Existing Data Pipeline (How Region Data Is Already Wired)

```
worldStore.getRegion(regionId)
  └─ REGION_META[regionId] → { id, name, description, dangerLevel, mapStyle }

worldStore.getRegionContext(regionId)
  └─ { region, locations, factions, eventCount }

worldStore.getFullContextForLocation(locationId)
  └─ { location (zoneData + deepLocationData merged),
       region, factions, classesPracticed, timeline }

worldStore.getWorldOverview()
  └─ regions[] with locationCount, factionCount, locations slice(0,3)
```

All of this is already available at runtime. The map viewer consumes these store methods directly.

### 1.5 Region Spatial Layout (North → South)

Based on trade flows, border descriptions, and lore from `GM_WORLD_GUIDE.md` and `rulesData.js`:

```
NORTH (frozen, glaciers)
  │
  ├── NORDHALLA ──────── Fjord-Gate ──────┐
  │   (Valley of Ymir,                      │
  │    Frozen Archive)                      │
  │                                         │
  ├── ICEHEART SEA ◄─── borders Nordhalla ──┘
  │   (Ironjaw Port,       (ocean region,
  │    Merrowport,          Treakous Rift)
  │    Shard-Window)
  │
  ├── CRAGJAW PEAKS ──── north/south barrier
  │   (Frostmaw Holdfast,  Ancestor-Spans =
  │    The Spans)           only passage
  │
  ├── FROSTWOOD REACH ── transitional zone
  │   (Greymark Keep,      (West hemisphere)
  │    Ironwood Heart)
  │
  ├── SUNDRIFT VALE ──── open steppe, central
  │   (Synod Hold,
  │    Ancestor Mounds)
  │
  └── SUNDALE ────────── southern volcanic
      (Harath-Vault,        Basalt Shyr on
       Emberspire Caldera)  border with →
                            BRYNGLOOM FOREST
                            (Atropolis, Sunken Spire)
```

---

## SECTION 2: THE 7 REGIONS — COMPLETE DATA REFERENCE

### 2.1 Region Summary Table

| # | ID | Name | Danger | Biome | Noble House | Dark Bargain Price |
|---|---|---|---|---|---|---|
| 1 | `frostwood-reach` | Frostwood Reach | Medium | Forest | House Thalreth | Historical memory decays per generation |
| 2 | `nordhalla` | Nordhalla | Extreme | Arctic | House Skalvyr | Summer never returns to the north |
| 3 | `sundale` | Sundale | High | Desert | House Solvan | Ancestral lands die |
| 4 | `iceheart-sea` | Iceheart Sea | Extreme | Ocean | House Mereval | The sea never sleeps |
| 5 | `cragjaw-peaks` | Cragjaw Peaks | Extreme | Underdark | House Tesshan | Every landmark buried; no sky in 8 generations |
| 6 | `sundrift-vale` | Sundrift Vale | Medium | — (no biome) | House Ordavan | Constellations erased from firmament |
| 7 | `bryngloom-forest` | Bryngloom Forest | High | Swamp | — (Neth ancestors) | Death is a renegotiated clause |

### 2.2 Key Locations Per Region (zoneData.js, 5 per region)

| Region | Locations |
|---|---|
| **Frostwood Reach** | Greymark Keep (city), The Shallows (wilderness), Scribes' Tower (settlement), Ledger Halls (ruin), Ironwood Heart (wilderness) |
| **Nordhalla** | Frozen Archive (city), Bloodhammer Sump (settlement), Fjord-Gate (settlement), Hunger Glaciers (wilderness), Rimor's Hearth (ruin) |
| **Sundale** | Harath-Vault (city), Great Forge (city), Emberspire Caldera (wilderness), Basalt Shyr (settlement), Cinder Badlands (wilderness) |
| **Iceheart Sea** | Merrowport (city), Ironjaw Port (settlement), Treakous Rift (wilderness), First Shore (ruin), Gale-Storm Shallows (wilderness) |
| **Cragjaw Peaks** | Frostmaw Holdfast (city), The Spans (settlement), Ancestor-Gaps (tomb), Sump Galleries (wilderness), Lost Brood Vats (ruin) |
| **Sundrift Vale** | Synod Hold (city), Mound-Camps (settlement), Ancestor Mounds (tomb), Grass Tundra (wilderness), Lien-Stalked Grazes (wilderness) |
| **Bryngloom Forest** | Atropolis (city), The Sunken Spire (city), Peat-Bog Sinks (wilderness), Root-Veil Scriptorium (settlement), Over-Shanty (settlement) |

### 2.3 Locations With Deep Data (deepLocationData.js, 4 entries)

Only 4 locations currently have deep profiles: Greymark Keep (frostwood-reach), Frozen Archive (nordhalla), Over-Shanty (bryngloom-forest), Synod Hold (sundrift-vale). These include heraldry, population, governance, economy, atmosphere (mood/architecture/sounds/smells/lighting), history, sub-locations, faction presence, travel connections, class presence, and NPC references.

---

## SECTION 3: STEP 7.1 — IMMERSE BUTTON + MAP VIEWER SHELL

### 3.1 Immerse Button (Landing Page)

**Location:** Landing page hero section, third button after Play Online and Sandbox.

**Appearance:**
- Icon: `fa-map` (FontAwesome)
- Button text: "Immerse" / "Explore the world map"
- Same styling as secondary action button (brown/wood tones)
- Available to **everyone** (no auth required)

**Current hero button layout (LandingPage.jsx lines 127-148):**
```jsx
<div className="action-buttons">
  <button className="primary-action-btn" onClick={onEnterMultiplayer}>
    <i className="fas fa-dragon"></i>
    Play Online / Adventure with friends
  </button>
  <button className="secondary-action-btn" onClick={onEnterSinglePlayer}>
    <i className="fas fa-flask"></i>
    Sandbox Mode / Test tools & experiment
  </button>
  <!-- NEW Immerse button goes here -->
</div>
```

**CSS location:** `vtt-react/src/components/landing/styles/LandingPage.css` after line 669 (after `.secondary-action-btn:hover .btn-subtitle` block)

**Technical:** Button calls `window.openWorldMapImmerse()` which is a method exposed by the `App.jsx` component. This avoids prop threading.

### 3.2 Immerse Transition Animation

**Entering Immerse (clicking the button):**

| Step | Duration | What Happens |
|---|---|---|
| 1 | ~400ms | Header, nav, hero buttons, all UI elements fade out (`opacity: 0`, then `display: none`) |
| 2 | 0ms | CSS `mapPan` animation captured at current `background-position` via `getComputedStyle` |
| 3 | 0ms | `mapPan` animation paused (`animation-play-state: paused`) |
| 4 | 0ms | `WorldMapImmerse` component mounts at full-screen, placed at the captured position |
| 5 | ~1500ms | Map smoothly zooms out from current position to `width: 100vw, height: 100vh` (showing entire map) |
| 6 | ~800ms | Burned parchment border fades in around map edges |

**State machine for transition:**
```
LANDING ──[click Immerse]──▶ FADE_OUT ──[400ms]──▶ ZOOM_OUT ──[1500ms]──▶ IMMERSE
                                                                          │
LANDING ◀──[600ms]── FADE_IN ◀──[1000ms]── ZOOM_IN ◀────[click X]───────┘
```

**Exiting Immerse (clicking X button, top-right corner):**

| Step | Duration | What Happens |
|---|---|---|
| 1 | ~600ms | Burned parchment border fades out |
| 2 | ~1000ms | Map zooms in to a random interesting area (one of the region centers, cached from mapPan keyframes) |
| 3 | ~400ms | Header, nav, buttons fade back in |
| 4 | 0ms | `WorldMapImmerse` unmounts |
| 5 | 0ms | `mapPan` CSS animation resumes from the new position (`animation-play-state: running`) |

### 3.3 WorldMapImmerse Component Structure

```
WorldMapImmerse.jsx
├── Full-screen overlay (z-index: 9999, position: fixed)
│   ├── BurnedParchmentBorder.jsx
│   │   └── CSS-animated ember glow + torn edge effect
│   ├── MapCanvas.jsx
│   │   ├── Wrapper: react-zoom-pan-pinch <TransformWrapper>
│   │   │   ├── <TransformComponent> (handles zoom/pan transforms)
│   │   │   │   ├── Map image (Mythril.jpeg, 4096x3072)
│   │   │   │   ├── RegionOverlay.jsx (SVG layer, from 7.3)
│   │   │   │   ├── LocationPins.jsx (from 7.5)
│   │   │   │   └── PlayerAnnotationsLayer.jsx (from 7.6)
│   │   │   └── </TransformComponent>
│   │   └── MapControls.jsx (zoom +/- buttons, close X)
│   └── LoreSidebar.jsx (slides in from right, from 7.4)
└── DevEditor.jsx (toggleable, from 7.2)
```

### 3.4 Auto-Drift Behavior (Inside Immerse Mode)

- When user is not interacting: slow auto-drift pans across the full map (similar to landing page `mapPan` but at the current zoom level)
- `requestAnimationFrame` loop, translates center by ~0.5px/frame
- On `pointerdown`: pauses drift
- After 5 seconds of no `pointermove` / `pointerdown`: resumes drift
- Drift pauses while sidebar is open

### 3.5 Burned Parchment Border

**CSS approach:**
- Outer element with `position: fixed; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; z-index: 1`
- Multiple layers of inset `box-shadow` creating a charred edge:
  ```css
  box-shadow:
    inset 0 0 60px 30px rgba(20, 10, 5, 0.9),
    inset 0 0 30px 15px rgba(30, 15, 5, 0.7),
    inset 0 0 10px 5px rgba(40, 20, 10, 0.5);
  ```
- Pseudo-element for ember animation:
  ```css
  animation: emberGlow 4s ease-in-out infinite alternate;
  /* pulses warm orange at the edges */
  ```
- Inner edge: CSS `mask-image` with radial-gradient or border-image with noise texture for torn edge effect
- Border should feel like an old document, edges darkened by time and flame

### 3.6 Files to Create/Modify

| File | Action | Notes |
|---|---|---|
| `components/world-map/WorldMapImmerse.jsx` | **Create** | Main container, transition state machine |
| `components/world-map/WorldMapImmerse.css` | **Create** | All immersive map styles |
| `components/world-map/MapCanvas.jsx` | **Create** | Zoom/pan wrapper using react-zoom-pan-pinch |
| `components/world-map/BurnedParchmentBorder.jsx` | **Create** | Animated border component |
| `components/world-map/BurnedParchmentBorder.css` | **Create** | Border + ember animation styles |
| `components/world-map/MapControls.jsx` | **Create** | Zoom buttons, close X, dev toggle |
| `components/landing/LandingPage.jsx` | **Modify** | Add Immerse button to hero |
| `components/landing/styles/LandingPage.css` | **Modify** | Add `.immersive-action-btn` styles |
| `package.json` | **Modify** | Add `react-zoom-pan-pinch` dependency |

---

## SECTION 4: STEP 7.2 — DEV EDITOR (POLYGON + PIN PLACEMENT TOOL)

### 4.1 Access Method

Hidden toggle inside the world map viewer. Access via:
- Triple-click on the map title text ("Mythrill" watermark) OR
- Small gear icon in bottom-left corner that only appears on hover
- Toggle closes editor and hides all dev UI

### 4.2 Draw Region Mode

**Workflow:**
1. Select a region from dropdown (7 options, one per region)
2. Click on the map to place polygon vertices
3. Visual: golden/silver glowing line follows cursor between last vertex and current mouse position
4. Click near the first vertex to close the polygon (snap radius ~15px at default zoom)
5. "Complete Region" button also available to manually close
6. Closed polygon gets semi-transparent fill preview (region's assigned color)
7. Can: undo last point, clear and restart, switch to another region, edit existing polygon

**Drawing line visual (feathered ink quill effect):**
- SVG `<polyline>` or `<path>` with:
  - Stroke: gradient `#C4A44A → #E8D5A3 → #C4A44A`
  - `stroke-width`: 2-3px with slight variation (simulate hand-drawn)
  - `stroke-linecap: round`, `stroke-linejoin: round`
  - `filter: drop-shadow(0 0 4px rgba(196, 164, 74, 0.6))`
- Trailing sparkle particles along the line: small CSS-animated dots (golden, fade after 1s)
- Connected vertices shown as small golden dots (3px radius)
- First vertex shown as larger dot (5px radius) with pulsing glow

**Vertex placement at zoom:** Coordinates stored in **image-space pixels** (relative to the 4096x3072 image), NOT screen pixels. The transform wrapper handles the coordinate conversion.

### 4.3 Place Pin Mode

**Workflow:**
1. Select pin type from a toolbar (12 icon types, see below)
2. Optionally select a zoneId from zoneData dropdown to link the pin to existing lore
3. Click on the map to drop the pin at that pixel coordinate
4. Pin renders immediately with the selected SVG icon
5. Can: drag to reposition (shift-click), right-click to remove, right-click to edit title/zoneId

**Pin icon toolbar:** Horizontal row below the map or as a floating palette. Shows 12 icons rendered as mini previews (16x16). Active selection has golden border.

### 4.4 Pin Icon Types (Custom SVG Parchment Style)

All icons drawn as inline SVG `<path>` data, styled with parchment ink aesthetic (sepia/cool brown tones, slight rough edges, subtle drop shadow).

| Icon ID | Visual | Use Case | SVG Concept |
|---|---|---|---|
| `fortress` | Castle/keep | Major cities, seats of power | Silhouette of castle with 3 towers, crenellations |
| `house` | Small house | Settlements, villages | Simple peaked roof + chimney, door |
| `mountain` | Mountain peaks | Wilderness, mountainous terrain | 2-3 triangular peaks with snow caps |
| `tree` | Stylized tree | Forests, groves | Circular canopy + trunk, root detail |
| `cave` | Cave opening | Underground entrances, dungeons | Dark arch with stalactites |
| `door` | Ornate door | Points of interest, transitions | Arch doorway with keyhole |
| `port` | Anchor/ship | Harbors, coastal cities | Simple anchor silhouette |
| `ruin` | Broken pillar | Ruins, ancient sites | Tilted pillar with top broken off |
| `tomb` | Skull/ossuary | Tombs, burial grounds | Stylized skull silhouette |
| `camp` | Tent/fire | Camps, temporary locations | Triangular tent with small fire |
| `shrine` | Altar/candle | Religious sites, shrines | Simple altar with flame |
| `custom` | Star/marker | Generic marker, player annotations | 4-point compass star |

**Visual style for all icons:**
- Base color: `#8B7355` (warm brown)
- Opaque fill with 10% transparency edge blur
- `filter: drop-shadow(0 1px 2px rgba(0,0,0,0.5))`
- On hover: scale 1.15, color shifts to `#C4A44A` (gold)
- Size: 24x24px at default zoom, scales with map zoom

### 4.5 Save Mechanism (Console Export)

**Trigger:** "Export to Console" button in dev toolbar.

**Output format (printed to `console.log`):**

```js
// regionPolygons.js — Copy this block into the file
export const REGION_POLYGONS = {
  'frostwood-reach': {
    points: [
      [1200, 400], [1250, 450], [1300, 420], [1280, 480],
      [1240, 520], [1180, 500], [1150, 460], [1200, 400]
    ],
    color: '#4a6741',
    glowColor: '#6b8f5e',
    labelPosition: [1225, 460]
  },
  'nordhalla': { points: [...], color: '#5B7B9A', glowColor: '#7B9BBA', labelPosition: [...] },
  // ... 5 more regions
};

// locationCoordinates.js — Copy this block into the file
export const LOCATION_COORDINATES = {
  'greymark-keep': { x: 1234, y: 567, pinType: 'fortress' },
  'the-shallows': { x: 1300, y: 600, pinType: 'tree' },
  // ... 33 more locations
};
```

**User workflow:**
1. Draw all 7 regions and place all 35 pins in the dev editor
2. Click "Export to Console"
3. Open browser dev tools (F12) → Console
4. Copy the formatted JS blocks
5. Paste into `vtt-react/src/data/regionPolygons.js` and `vtt-react/src/data/locationCoordinates.js`

### 4.6 Files to Create/Modify

| File | Action | Notes |
|---|---|---|
| `components/world-map/DevEditor.jsx` | **Create** | Dev toolbar, polygon editor, pin placer, export button |
| `components/world-map/DevEditor.css` | **Create** | Editor toolbar styles, vertex dot styles, drawing line animation |
| `components/world-map/mapPinIcons.js` | **Create** | SVG path data for all 12 pin icons |
| `data/regionPolygons.js` | **Create** | Empty initial structure, filled via console export |
| `data/locationCoordinates.js` | **Create** | Empty initial structure, filled via console export |

---

## SECTION 5: STEP 7.3 — REGION OVERLAYS + HOVER EFFECTS

### 5.1 SVG Polygon Layer

Rendered inside the zoom/pan container (so regions scale/pan with the map image).

**DOM structure:**
```html
<svg style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;">
  <g class="region-polygons" style="pointer-events: auto;">
    <path class="region-polygon" data-region-id="frostwood-reach" d="M 1200 400 L 1250 450 ... Z" />
    <path class="region-polygon" data-region-id="nordhalla" d="..." />
    <!-- 5 more paths -->
  </g>
</svg>
```

### 5.2 Visual Style (TTRPG Feel — Antique Map)

**Default state:**
- Fill: semi-transparent color (opacity 0.12-0.20) with subtle parchment texture overlay
  - Parchment texture via SVG `<pattern>` with noise-like dots at low opacity
  - Alternative: CSS `mix-blend-mode: multiply` on a semi-transparent fill
- Stroke: thin golden-brown line `#8B7355`, 1.5px width
- The overall effect: a subtly hand-colored antique map, not a modern digital overlay

**Hover state:**
- Fill opacity increases to 0.30
- Stroke brightens to `#C4A44A` (warm gold), width increases to 2.5px
- Stroke gets glow: `filter: drop-shadow(0 0 6px rgba(196,164,74,0.5))`
- Region name appears as a floating label, centered in the polygon:
  - Font: 'Cinzel', serif, 14px, color: `#f0e6d2`
  - Background: semi-transparent dark parchment `rgba(44, 24, 16, 0.85)`
  - Border: 1px solid `rgba(212, 175, 55, 0.3)`
  - Border-radius: 4px, padding: 4px 12px
  - Text-shadow: `1px 1px 2px rgba(0,0,0,0.8)`
  - `pointer-events: none` so it doesn't interfere with click
- Cursor: `pointer`

**Active/selected state (region is clicked, sidebar is open):**
- Same as hover but persists
- Fill opacity at 0.25
- Stroke is bright gold and slightly thicker (3px)
- Label remains visible

### 5.3 Danger Level Color Coding

| Danger | Fill Color | Accent Color | Glow Color |
|---|---|---|---|
| medium (Frostwood Reach, Sundrift Vale) | `#4a6741` (forest green) | `#6b8f5e` | `rgba(74, 103, 65, 0.4)` |
| high (Sundale, Bryngloom Forest) | `#8B6914` (amber/bronze) | `#B8961F` | `rgba(139, 105, 20, 0.4)` |
| extreme (Nordhalla, Iceheart Sea, Cragjaw Peaks) | `#6B1A1A` (deep crimson) | `#8B2020` | `rgba(107, 26, 26, 0.4)` |

### 5.4 Special Cases

**Connected continents (if two regions share a landmass):**
- Two separate SVG `<path>` elements that share a border edge
- Each has its own hover state (only the path under the cursor highlights)
- The shared border gets a slightly different stroke: lighter, dashed or dotted (`stroke-dasharray: 3 2`), indicating this is an internal boundary
- The labels for adjacent regions should not overlap (positioned toward each region's center of mass)

**Ocean region (Iceheart Sea):**
- Dashed stroke (`stroke-dasharray: 6 4`) to distinguish water from land
- Slightly lighter blue-tinted fill (`rgba(70, 100, 130, 0.15)`)
- Wave-like SVG pattern fill (subtle, low opacity)
- Label shows over the water area

### 5.5 Point-in-Polygon Click Detection

When a click occurs, determine which region was clicked using a ray-casting point-in-polygon test:
```js
function pointInPolygon(point, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0], yi = polygon[i][1];
    const xj = polygon[j][0], yj = polygon[j][1];
    const intersect = ((yi > point[1]) !== (yj > point[1]))
        && (point[0] < (xj - xi) * (point[1] - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}
```

Regions should not overlap by definition (they partition the map). The first match is returned.

### 5.6 Files to Create/Modify

| File | Action | Notes |
|---|---|---|
| `components/world-map/RegionOverlay.jsx` | **Create** | SVG layer rendering all 7 region polygons |
| `components/world-map/RegionOverlay.css` | **Create** | Polygon hover/active states, region label styles |
| `data/regionPolygons.js` | **Modify** | Filled with actual coordinates via dev editor (7.2) |

---

## SECTION 6: STEP 7.4 — LORE SIDEBAR

### 6.1 Trigger

Click any region polygon or location pin. If a pin is clicked and the pin is in a region, the sidebar opens for that region with the pin/location scrolled into view.

### 6.2 Animation

- Slides in from right edge: `transform: translateX(350px) → translateX(0)`, ~400ms ease-out
- Width: 350px (fixed)
- Backdrop: slides with the sidebar
- Sidebar does NOT push the map — it overlays on top
- Close: slide out right, ~250ms ease-in

### 6.3 Sidebar Layout

```
┌──────────────────────────────────────┐
│ [X Close]                            │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │ 🔴 EXTREME DANGER               │ │
│ │ NORDHALLA                       │ │
│ │ The Frozen Throne               │ │
│ └──────────────────────────────────┘ │
│                                      │
│ ─── DESCRIPTION ───                  │
│ A brutalist cathedral of frozen      │
│ black fjords and towering glaciers,  │
│ warmed only by deep geothermal       │
│ sumps...                             │
│                                      │
│ ─── THE DARK BARGAIN ───             │
│ House Skalvyr halted the glaciers    │
│ permanently. Price: summer never     │
│ returns to the north.                │
│                                      │
│ ─── KEY LOCATIONS ───                │
│ 🏰 Frozen Archive     City           │
│ 🔨 Bloodhammer Sump   Settlement     │
│ ⚓ Fjord-Gate          Settlement     │
│ 🏔 Hunger Glaciers     Wilderness ▶  │
│ 🏚 Rimor's Hearth      Ruin          │
│                                      │
│ ─── INHABITANTS ───                  │
│ Skald Humans, Rime-Born (Rune        │
│ Keepers, Bloodhammer, Frostbound),   │
│ Corvani (subfolk)                    │
│                                      │
│ ─── BIOME ───                        │
│ Arctic · Freezing · Perpetual snow   │
│                                      │
│ ┌──────────────────────────────────┐ │
│ │  🔭 Immerse: Explore Nordhalla  │ │
│ │  (Coming Soon)                  │ │
│ └──────────────────────────────────┘ │
└──────────────────────────────────────┘
```

### 6.4 Section Data Sources

| Section | Data Source | Method |
|---|---|---|
| Header (name, danger, subtitle) | `worldStore.getRegion(regionId)` | REGION_META with dangerLevel, name |
| Description | `loreDictionary[regionId].fullEntry` | Full lore text (~2-3 paragraphs) |
| Dark Bargain | `loreDictionary[regionId].fullEntry` + `rulesData.js` regional-overview | Parsed from lore text (contains noble house + price) |
| Key Locations | `worldStore.getLocationsByRegion(regionId)` | Enriched zones with type icons |
| Inhabitants | Parsed from `loreDictionary` + `rulesData.js` region text | Races and cultures present |
| Biome | `biomeData.js` matched via `regionFlavor.regionName` | Display name + terrain type |
| Region Immerse button | Placeholder (future) | Disabled, shows "Coming Soon" |

### 6.5 Location List with Deep Data Expansion

Locations that have a corresponding deepLocationData entry (4 total) show:
- Small "▶" expand arrow
- Clicking expands to show:
  - Population count
  - Governance type + leader
  - Economy (primary + secondary)
  - Atmosphere snippet (mood, architecture, sounds, smells)
  - Sub-locations list

### 6.6 Region Immerse Button (Future)

**Label:** `🔭 Immerse: Explore [Region Name]`

**Planned interaction (future implementation):**
1. Capture the clicked region's polygon bounding box from `REGION_POLYGONS`
2. Animate zoom to fit those bounds (~1s ease-out)
3. Apply a radial clip-path mask centered on the region that expands to fill the screen
4. World map fades out behind the mask
5. Detailed regional view fades in:
   - Higher-resolution crop of the main map or separate region-specific map image
   - More granular locations (sub-zones, streets)
   - Custom imagery keyed to locations
   - Deeper lore sections
6. The region's polygon outline morphs into the border of the new view
7. Back button reverses the transition (zoom out, mask shrinks, world map fades back)

**Data needed for future:**
- High-res regional map images (one per region, placed in `public/assets/images/maps/regions/`)
- Region-specific location images keyed in `deepLocationData.js` or `locationCoordinates.js`
- Extended lore data per region location

### 6.7 Close Behavior

- Click X button in sidebar header → sidebar slides out right → map zoom resets (or stays at current position) → auto-drift resumes after 5s
- Click anywhere on the map outside the sidebar → sidebar closes → region deselects
- Click a different region → sidebar updates with new region data (no redundant close/reopen)

### 6.8 Files to Create/Modify

| File | Action | Notes |
|---|---|---|
| `components/world-map/LoreSidebar.jsx` | **Create** | Region info panel with all sections |
| `components/world-map/LoreSidebar.css` | **Create** | Sidebar styles, slide animation, location list |
| `data/locationCoordinates.js` | **Read** | Pin positions for location list scrolling |

---

## SECTION 7: STEP 7.5 — LOCATION PINS

### 7.1 Pin Rendering

35 zones from `zoneData.js` rendered as clickable SVG pins on the map, inside the zoom/pan container.

**Pin component structure:**
```html
<g class="map-pin" data-zone-id="greymark-keep" transform="translate(1234, 567)">
  <!-- Pin icon SVG path from mapPinIcons.js -->
  <path d="..." class="pin-icon" fill="#8B7355" />
  <!-- Pin label (hidden by default, shown on hover) -->
  <text class="pin-label" x="0" y="20" text-anchor="middle">Greymark Keep</text>
</g>
```

### 7.2 Pin Appearance

**Default state:**
- SVG icon rendered at 24x24px (scales with map zoom level)
- Warm brown fill `#8B7355`, subtle drop shadow
- No label visible

**Hover state:**
- Icon scales up to 1.15x (CSS transition)
- Color shifts to gold `#C4A44A`
- Drop shadow intensifies
- Label appears: font 'Cinzel', serif, 10px, color `#f0e6d2`, background `rgba(44,24,16,0.8)`, no pointer events
- Cursor: `pointer`

**Deep location indicator:**
- If the zone has a corresponding deepLocationData entry, the pin icon gets a subtle secondary indicator:
  - Small gold dot below the icon
  - Or slightly different icon tint

### 7.3 Pin Interaction

- **Hover:** Shows name label
- **Click:**
  - If sidebar is open for the same region: scrolls the location list to that location, expands it if deep data exists
  - If sidebar is closed or open for a different region: opens sidebar for the pin's region (derived from `zoneData[zoneId].regionId`), scrolls to that location in the list, expands if deep data exists
- **No double-click or right-click behavior** (avoids conflict with map pan, keeps it simple)

### 7.4 Pin Z-Ordering

Pins render ABOVE region polygons in the SVG stacking:
1. Region polygons (bottom)
2. Region labels
3. Location pins
4. Pin labels (top)

This ensures pins are clickable over region fills, but region hover/click still works in gaps between pins.

### 7.5 Performance Note

All 35 pins are rendered as a single `<g>` element containing 35 `<g pin>` children. No virtualization needed at this scale. The SVG is inside the react-zoom-pan-pinch transform wrapper, so pins scale/pan natively with the map image.

### 7.6 Files to Create/Modify

| File | Action | Notes |
|---|---|---|
| `components/world-map/LocationPins.jsx` | **Create** | All pins layer, renders individual MapPin components |
| `components/world-map/MapPin.jsx` | **Create** | Individual pin with icon, hover label, click handler |
| `components/world-map/mapPinIcons.js` | **Create** | SVG path data for all 12 pin icon types |
| `data/locationCoordinates.js` | **Read** | Pin pixel positions (filled via dev editor 7.2) |

---

## SECTION 8: STEP 7.6 — PLAYER ANNOTATIONS (FUTURE)

> This section is fully designed but NOT in the current build scope.
> It will be implemented after 7.1-7.5 are complete and functional.

### 8.1 Subscription Gating

| Tier | Permission | Notes |
|---|---|---|
| Guest | View-only | Can see dev-placed pins and regions. No annotations. |
| Free (Adventurer) | Up to 10 personal pins | Pins only, no area drawing, no custom images |
| PRO (Dungeon Master) | Unlimited pins + area drawing + custom images + quest linking + friend sharing | Full annotation suite |
| ULTIMATE (Archmage) | All DM features | Same as DM for map annotations |

Subscription tier checked via `subscriptionService.getTier(userId)` → `tierId` → feature flags.

### 8.2 Player Capabilities

1. **Place custom pins:**
   - Choose from the same 12 icon types (including `custom`)
   - Add title, description, optional custom image URL
   - Link to quests from player's quest log
   - Drag to reposition (long-press or shift-drag)
   - Stored in Firebase Firestore: `userMapAnnotations/{userId}/pins/{pinId}`

2. **Draw custom areas:**
   - Polygon drawing tool (simplified version of dev editor)
   - Same golden ink drawing aesthetic
   - Fill with chosen color and opacity
   - Add title, description, notes
   - Mark as "discovered" / "unexplored" / "dangerous" / "safe"
   - Stored in Firebase Firestore: `userMapAnnotations/{userId}/areas/{areaId}`

3. **Connect notes:**
   - Pins and areas have attached notes section (rich text via contentEditable or simple markdown)
   - Quest-linked pins show quest status icon: 🟢 in-progress, ✅ complete, ❌ failed
   - Notes visible in the popout when clicking the annotation
   - Notes include timestamps and can be edited

4. **Remove annotations:**
   - Right-click or long-press annotation → "Delete" option → confirmation dialog
   - Only own annotations can be removed by players
   - Dev can remove any annotation via dev editor (moderation capability)

5. **Custom images:**
   - Upload images to Firebase Storage under `userMapAnnotations/{userId}/images/{imageId}`
   - Images appear in the sidebar popout for that annotation
   - Max image size per tier: Free 1MB, DM 5MB, Archmage 10MB
   - Dev-placed locations have hardcoded image URLs in `locationCoordinates.js`

### 8.3 Dev Capabilities (via dev editor, extended)

- All player capabilities
- Remove ANY annotation (player-made, for moderation)
- Edit dev-placed pins and areas
- Dev annotations are part of the codebase (shipped to all users, visible to everyone)
- Dev annotations distinguished by a slight visual difference (tiny gold border dot on the icon)

### 8.4 Collision / Overlap Handling

**Problem:** Multiple annotations (pins, areas) can overlap at the same screen position, especially at low zoom levels.

**Solution: Selection Carousel**

1. Visual indicator: when multiple items overlap at a click point, a small numbered badge appears (e.g., `③` with gold ring) showing how many items are stacked
2. Click opens a **selection carousel** — a small popup directly adjacent to the click point listing all overlapping items:
   ```
   ┌──────────────────────────┐
   │ 🏰 Greymark Keep (Region)│
   │ 📍 Player Pin: "Camp"   │
   │ 🗺 Area: "Ambush Site"  │
   └──────────────────────────┘
   ```
3. Each item shows its icon + truncated name
4. Click one to select it (opens its sidebar/popout)
5. Click outside to dismiss the carousel

### 8.5 Z-Index Layering (Bottom to Top)

| Layer | Content |
|---|---|
| 1 | Region polygons (dev-defined, always shown) |
| 2 | Player-drawn areas (under pins, transparent fill) |
| 3 | Dev-placed pins |
| 4 | Player-placed pins |
| 5 | Pin/area labels and tooltips |
| 6 | Selection carousel popup (topmost, on click) |

### 8.6 Firebase Data Structure

**Firestore collections:**
```
userMapAnnotations/
  {userId}/
    settings: { defaultVisibility: 'friends' | 'public' | 'private' }
    pins/
      {pinId}: {
        zoneId: string | null,
        pinType: 'fortress' | 'house' | ... | 'custom',
        title: string,
        description: string,
        imageUrl: string | null,
        position: { x: number, y: number },
        linkedQuests: [questId, ...],
        visibility: 'private' | 'friends' | 'public',
        createdAt: timestamp,
        updatedAt: timestamp
      }
    areas/
      {areaId}: {
        title: string,
        description: string,
        points: [[x, y], ...],
        color: string,
        opacity: number,
        fillStyle: 'solid' | 'hatched' | 'dotted',
        imageUrl: string | null,
        status: 'discovered' | 'unexplored' | 'dangerous' | 'safe',
        linkedQuests: [questId, ...],
        visibility: 'private' | 'friends' | 'public',
        createdAt: timestamp,
        updatedAt: timestamp
      }

mapShares/
  {shareId}: {
    fromUserId: string,
    toUserId: string,
    viewState: { centerX: number, centerY: number, zoom: number },
    annotationVisibility: 'all' | 'pins_only' | 'areas_only',
    status: 'pending' | 'accepted' | 'rejected' | 'expired',
    message: string | null,
    createdAt: timestamp,
    expiresAt: timestamp  // 24 hours from creation
  }
```

**Firebase Storage:**
```
userMapAnnotations/{userId}/images/{imageId}
```

**Security rules (Firestore):**
- User can only read/write their own `pins/` and `areas/` documents
- User can only read `mapShares/{shareId}` where `toUserId === auth.uid` or `fromUserId === auth.uid`
- `visibility: 'public'` docs readable by authenticated users
- `visibility: 'friends'` docs readable by users in friend list

### 8.7 Friend Sharing Flow

1. Player (sharer) clicks "Share View" button in map controls (visible to DM+ tier)
2. Current map state captured: center position (x, y at current zoom), zoom level
3. Friend selector dialog opens (uses existing `socialStore.friends` data + `socialService`)
4. Player selects a friend and optionally writes a short message
5. Firestore document created in `mapShares/{shareId}` with `status: 'pending'`
6. Friend receives notification: badge on Immerse button on landing page, or in-app notification
7. Friend clicks notification or opens shares panel from Immerse view
8. Accepting:
   - Friend's current map view **fades** (overlay with 0.5 opacity, ~400ms)
   - Map **animates** (pan + zoom) to match the sharer's `viewState` (~1s ease-out)
   - Overlay fades out, sharer's shared annotations fade in at their positions
   - Both users are now looking at the same area with shared annotations visible
9. Rejecting: share status set to `rejected`, cleared from UI
10. Shares expire after 24 hours (`expiresAt`)

**CSS transition for accepting share:**
```css
.map-share-transition-overlay {
  background: rgba(44, 24, 16, 0.5);
  animation: shareFadeIn 0.4s ease-out;
}
@keyframes shareFadeIn {
  from { opacity: 0; }
  to { opacity: 0.5; }
}
```

### 8.8 Component Tree Additions for 7.6

```
WorldMapImmerse.jsx
├── ...
├── PlayerAnnotationsLayer.jsx     (renders all player pins + areas)
│   ├── AnnotationPin.jsx          (individual player pin)
│   └── AnnotationArea.jsx         (individual player-drawn area polygon)
├── AnnotationToolbar.jsx          (pin/area drawing tools, subscription gated)
├── AnnotationPopup.jsx            (edit/view annotation notes/details)
├── AnnotationCollisionMenu.jsx    (overlap selection carousel)
└── ShareDialog.jsx                (share to friend UI)
```

### 8.9 Files to Create/Modify for 7.6

| File | Action | Notes |
|---|---|---|
| `components/world-map/PlayerAnnotationsLayer.jsx` | **Create** | Renders player pins + areas from Firebase |
| `components/world-map/AnnotationPin.jsx` | **Create** | Individual player-placed pin |
| `components/world-map/AnnotationArea.jsx` | **Create** | Player-drawn area polygon |
| `components/world-map/AnnotationToolbar.jsx` | **Create** | Drawing tool buttons, pin type selector |
| `components/world-map/AnnotationPopup.jsx` | **Create** | Edit/view notes, quest linking |
| `components/world-map/AnnotationCollisionMenu.jsx` | **Create** | Overlap selector carousel |
| `components/world-map/ShareDialog.jsx` | **Create** | Friend selector, share creation |
| `store/mapAnnotationStore.js` | **Create** | Zustand store bridging Firebase + map UI state |
| `services/mapAnnotationService.js` | **Create** | Firestore CRUD for annotations + shares |
| `firestore.rules` | **Modify** | Add rules for userMapAnnotations + mapShares collections |

---

## SECTION 9: COMPLETE FILE INVENTORY

### 9.1 New Files to Create (Phase 7.1-7.5)

```
vtt-react/src/
  components/world-map/
    WorldMapImmerse.jsx              # Main container, transition state machine
    WorldMapImmerse.css              # Immerse view styles, parchment theme
    MapCanvas.jsx                    # Zoom/pan wrapper (react-zoom-pan-pinch)
    RegionOverlay.jsx                # SVG polygon layer for 7 regions
    RegionOverlay.css                # Polygon hover/active styles
    LocationPins.jsx                 # All 35 pins layer
    MapPin.jsx                       # Individual pin component
    mapPinIcons.js                   # SVG path data for 12 pin types
    DevEditor.jsx                    # Dev polygon/pin editor toolbar
    DevEditor.css                    # Editor styles, drawing line animation
    LoreSidebar.jsx                  # Region info panel
    LoreSidebar.css                  # Sidebar slide animation, location list
    BurnedParchmentBorder.jsx        # Animated border component
    BurnedParchmentBorder.css        # Ember glow animation, torn edges
    MapControls.jsx                  # Zoom +/- buttons, close X, dev toggle
  data/
    regionPolygons.js                # 7 region polygon coordinates (dev-created)
    locationCoordinates.js           # 35 pin positions (dev-created)
```

### 9.2 New Files to Create (Phase 7.6 - Future)

```
vtt-react/src/
  components/world-map/
    PlayerAnnotationsLayer.jsx
    AnnotationPin.jsx
    AnnotationArea.jsx
    AnnotationToolbar.jsx
    AnnotationPopup.jsx
    AnnotationCollisionMenu.jsx
    ShareDialog.jsx
  store/
    mapAnnotationStore.js
  services/
    mapAnnotationService.js
```

### 9.3 Existing Files to Modify

```
vtt-react/src/
  components/landing/LandingPage.jsx         # Add Immerse button
  components/landing/styles/LandingPage.css  # Add .immersive-action-btn styles
  components/landing/LandingPage.jsx         # Wire window.openWorldMapImmerse
  App.jsx                                     # Expose openWorldMapImmerse to window
  package.json                                # Add react-zoom-pan-pinch
```

---

## SECTION 10: DEPENDENCIES

### 10.1 New npm Dependencies

| Package | Version | Size | Purpose |
|---|---|---|---|
| `react-zoom-pan-pinch` | ^3.6.1 | 8KB gzipped | Zoom, pan, pinch-zoom, double-tap, wheel zoom |

No other new dependencies. SVG rendering, CSS animations, and existing stores handle everything else.

### 10.2 Existing Dependencies Used

| Package | Usage |
|---|---|
| `zustand` | `useWorldStore` for region/location data; custom store for map state |
| `react` | All components |
| `firebase` (Firestore + Storage) | 7.6 only (player annotations, sharing) |
| `FontAwesome` (CSS, already in project) | Pin icons, sidebar icons, button icons |

### 10.3 Existing Services Used (7.6 Only)

| Service | Purpose |
|---|---|
| `subscriptionService.js` | Check user tier for feature gating |
| `socialService.js` | Friend list for sharing feature |
| `socialStore.js` | Friend data for share dialog |
| `authService.js` | User ID for Firebase annotation storage |

---

## SECTION 11: STATE MANAGEMENT

### 11.1 WorldMapImmerse Internal State

All managed via `useState` in the WorldMapImmerse component (not a Zustand store):

```js
// Transition
const [phase, setPhase] = useState('entering'); // 'entering' | 'zoomingOut' | 'immersed' | 'exiting'

// Map view
const [autoDrift, setAutoDrift] = useState(true);
const [lastInteraction, setLastInteraction] = useState(Date.now());

// Region selection
const [selectedRegionId, setSelectedRegionId] = useState(null);
const [sidebarOpen, setSidebarOpen] = useState(false);

// Dev editor (7.2)
const [devMode, setDevMode] = useState(false);
const [devTool, setDevTool] = useState('drawRegion'); // 'drawRegion' | 'placePin'
const [currentRegion, setCurrentRegion] = useState(null);
const [drawingPoints, setDrawingPoints] = useState([]);
const [selectedPinType, setSelectedPinType] = useState('fortress');
const [selectedPinZoneId, setSelectedPinZoneId] = useState(null);

// Hover state
const [hoveredRegionId, setHoveredRegionId] = useState(null);
const [hoveredPinId, setHoveredPinId] = useState(null);
```

### 11.2 Window Integration

The `openWorldMapImmerse` function is exposed on `window` by `App.jsx`:

```js
// In App.jsx
const [showWorldMap, setShowWorldMap] = useState(false);

useEffect(() => {
  window.openWorldMapImmerse = () => setShowWorldMap(true);
}, []);

// In the render tree or as a portal outside Routes:
{showWorldMap && <WorldMapImmerse onClose={() => setShowWorldMap(false)} />}
```

This avoids prop threading through the route hierarchy and keeps the map viewer independent of the landing page's render cycle.

---

## SECTION 12: IMPLEMENTATION ORDER

### Build Sequence

| Order | Step | Depends On | What to Build |
|---|---|---|---|
| **1** | 7.1 (Map Viewer Shell) | — | Immerse button, WorldMapImmerse component, MapCanvas with react-zoom-pan-pinch, burned parchment border, enter/exit transitions, auto-drift |
| **2** | 7.2 (Dev Editor) | 7.1 (needs map to draw on) | Dev toolbar, polygon drawing mode, pin placement mode, console export, all 12 map pin SVG icons |
| **3** | 🛠 Define Regions | 7.2 | YOU use the dev editor to draw all 7 region boundaries and place all 35 location pins. Copy exported JS to `regionPolygons.js` and `locationCoordinates.js`. |
| **4** | 7.3 (Region Overlays) | Step 3 (needs polygon data) | RegionOverlay component, polygon rendering, hover/active states, danger color coding, point-in-polygon click detection |
| **5** | 7.4 (Lore Sidebar) | 7.3 (needs click to trigger) | LoreSidebar component, all sections, location list with deep data expansion, slide animation, Immerse placeholder button |
| **6** | 7.5 (Location Pins) | Step 3 (needs pin coordinates) | LocationPins + MapPin components, pin rendering with icons, hover labels, click-to-sidebar integration |
| **7** | 7.6 (Player Annotations) | 7.1-7.5 | Firebase integration, annotation toolbar, player pins/areas, collision handling, sharing. Full design in Section 8. |

---

## SECTION 13: TECHNICAL NOTES & GOTCHAS

### 13.1 react-zoom-pan-pinch Integration

```jsx
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

<TransformWrapper
  initialScale={1}
  minScale={0.3}
  maxScale={5}
  centerOnInit
  onTransformed={(ref) => {
    // Update drift state when user interacts
    setLastInteraction(Date.now());
  }}
>
  {({ zoomIn, zoomOut, resetTransform }) => (
    <>
      <MapControls zoomIn={zoomIn} zoomOut={zoomOut} />
      <TransformComponent wrapperStyle={{ width: '100vw', height: '100vh' }}>
        {/* Map image + overlays here */}
      </TransformComponent>
    </>
  )}
</TransformWrapper>
```

### 13.2 Coordinate System

All coordinates stored in **image-space pixels** (0-4096 for x, 0-3072 for y). The TransformComponent handles scaling these to screen coordinates. When capturing click coordinates for the dev editor, convert screen coordinates to image coordinates using the current transform state.

```js
// Converting screen click to image coordinates:
const imageX = (screenX - transformState.positionX) / transformState.scale;
const imageY = (screenY - transformState.positionY) / transformState.scale;
```

### 13.3 Transition State Machine (7.1)

```js
const TRANSITIONS = {
  entering: { next: 'zoomingOut', duration: 400 },
  zoomingOut: { next: 'immersed', duration: 1500 },
  immersed: { next: 'zoomingIn', duration: Infinity },  // stays until user action
  zoomingIn: { next: 'complete', duration: 1000 },       // exiting
  complete: { next: null, duration: 400 }                // calls onClose()
};
```

### 13.4 Map Pan Animation Capture

To capture the landing page's current `background-position` before pausing:

```js
const landingPage = document.querySelector('.landing-page.map-background');
const computed = getComputedStyle(landingPage);
const bgPos = computed.backgroundPosition; // e.g., "50% 10%"
landingPage.style.animationPlayState = 'paused';
landingPage.style.backgroundPosition = bgPos;

// Convert percentage to approximate pixel position on the 4096x3072 image
// to set the initial MapCanvas center
```

### 13.5 FontAwesome Icons

The project uses FontAwesome 6 (CSS version). All icon class names are prefixed with `fa-` (e.g., `fa-map`, `fa-dragon`, `fa-gem`). Use existing icon patterns.

### 13.6 Existing Pattern Reference

The `LibraryWindow.jsx` in `components/windows/` is a good reference for:
- Full-screen overlay pattern with z-index management
- Content-area sections with drill-down navigation
- Back button behavior
- Bootstrap class integration with custom theming

---

## SECTION 14: FUTURE ENHANCEMENTS (BEYOND 7.6)

1. **Region detail maps** — High-res regional map images, one per region, loaded when "Immerse: Explore" is clicked (7.4 future transition)
2. **GM live session overlay** — During multiplayer sessions, show party token position on the world map in real-time
3. **Travel system integration** — Connect zoneData `connections[]` graph to travel mechanics, show routes between locations
4. **Timeline integration** — Filter map by timeline events: "Show world state during Year 5 of the Deepening"
5. **Faction influence overlay** — Heatmap showing faction influence per region, from `factionStore`
6. **Weather overlay** — Live weather data from `biomeData.weatherTable` rendered on the map
7. **Multiplayer collaborative annotation** — Party members can see each other's shared annotations in real-time via Socket.io
8. **Print/export** — Export the annotated map as a PNG for session handouts
9. **Accessibility** — Keyboard navigation, screen reader descriptions for regions, high-contrast mode
