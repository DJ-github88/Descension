# Calm TTRPG — reconstruction visual contract

**DESIGN INTENT:** illustrated tabletop rulebook, restrained craft, all resource displays SVG. **CONFIRMED authority:** `components/hud/calmBarPalette.js` and `styles/adventurer-windows.css`, current class SVG components and Codex/character surfaces. No new design system is needed.

## Token authority and observed drift

Resource SVG tokens: INK `#34251a`, MUTED `#68533e`, PAGE `#f8f5ee`, PAPER `#f1ece1`, PANEL `#e8e2d4`, RULE `#c4baa6`, ETCH `#cdc4b1`, BRICK `#8b3a2a`, BRASS `#9a7b3c`. Use imports and existing `inked`, `washed`, `pageFrame` helpers rather than copying a replacement palette.

The palette comment says it mirrors adventure CSS, but current CSS differs: adventure paper `#faf6ee`, page `#f7f3ea`, panel `#eee8dc`, rule `#b6a080`, brass `#c4ab79` (`adventurer-windows.css:12–20`). That is **CONFIRMED source drift**, not permission to globally unify either palette. SVG art uses its existing palette owner; windows use their CSS tokens. A later token reconciliation needs its own scoped review.

Crimson Text/Georgia for readable prose, Cinzel/Georgia for short headings/labels (`adventurer-windows.css:32–34`). Never apply all-caps decorative type to long explanations, numerical editing or dense spell text.

## Composition

- Warm page, fine frame, etched inactive marks, one muted class accent. Geometry communicates class identity before accent.
- Compact apparatus shows only actionable state; expanded sheet/menu reveals relationships, entities, commitments and rules. Do not turn a HUD into a miniature full character sheet.
- At compact size prioritize silhouette, current available/committed counts, active form/quarry/anchor and urgent invalidity. Ornament cannot compete with the resource count.
- Warning means a genuine resource rule. Use text/symbol/hatching plus BRICK; never encode state by red/green alone. No neon, glow/filter, drop-shadow or looping SVG animation.
- One event-driven transition for gain/spend/form change is enough. Reduced motion removes movement. Static state must be fully legible.

## Interaction and accessibility

Every compact apparatus has an accessible name and state summary. Use a real button for expanded details; focus/touch provides the same content as hover. Tooltip must not contain the only operable controls. Keyboard navigation reaches menu, closes on Escape and restores trigger focus. A disabled action explains why; pending/unknown state differs from a successful spend. Screen readers announce one accepted update, not every render/frame.

Numerals remain readable at actual HUD scale; full text contrast is tested against its real surface. Count labels cannot rely on ETCH. Keep touch controls large enough even when the SVG art is narrow. Responsive layout can wrap the expanded panel, not shrink text to illegibility.

## Artwork briefs and reuse

Traditional fantasy illustration, readable silhouette, pen/ink crosshatching, restrained watercolor and one accent. Retain raster art and existing portrait/icon paths unless individually remapped. Resource art is SVG interface; class portrait art need not be converted to SVG. Retired-class assets are reviewed for reuse or archive, never deleted by class-ID migration.

## Browser evidence and limits

Existing localhost3000 served the21-class Codex and Gambit overview/resource tabs during this investigation, with no observed page errors and one console warning. This confirms those views were reachable in that running app, not a hash-identified production build, complete resource interactivity, mobile behavior or multiplayer. Future CR10 witnesses must cover desktop/narrow, keyboard/touch, reduced motion and real resource changes.
