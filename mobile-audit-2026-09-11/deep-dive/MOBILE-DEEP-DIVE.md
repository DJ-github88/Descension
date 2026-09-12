# Mythrill VTT — Mobile Deep Dive (2026-09-11)

Viewport audited: 412×924 (Pixel 10 CSS px), live app on localhost:3000.
Scope: `/account` shell + every tab, `/rules` (Laws & Lore) + subcategories.
Screenshots: `mobile-audit-2026-09-11/deep-dive/`.

## TL;DR

The previous pass fixed overflow bugs; what remains is **structural button/nav overload**.
Root causes, in order of impact:

1. **Duplicate navigation rendered twice on one screen** (World: 10 icon buttons + the same 10 text tabs).
2. **Icon-only nav with no labels** (Rules sidebar on mobile; World strip) — tooltips don't exist on touch.
3. **Repeated identical CTAs** ("Create Character" + "Forge New Hero"; three different "create room" buttons).
4. **Per-card action overload** (character card = 1 state button + 3 icon buttons).
5. **Desktop authoring UI leaking to phones** (Books editor = 149 visible controls; 12 formatting buttons per block).
6. **No persistent navigation on phone** — every tab switch is hamburger → drawer → find item.

Also fixed during audit: **/rules search trigger crashed the app**
(`RulesPage.jsx` passed the click event as `initialQuery`, so `initialQuery.trim()` threw).
Fixed: `onClick={() => openSearch()}`. Verified working.

## Measured control counts (main content, 412px)

| Surface | Visible controls | Notes |
|---|---|---|
| Characters tab | 9 | 2 create CTAs, 4 buttons on the single hero card, 2 stacked 100%-wide selects |
| Rooms tab | 6 | 3 create-room buttons across empty states |
| Journal tab | 4 | clean, except an unlabeled dot legend row |
| World tab | **50** | **20 of them are the same 10 destinations twice** (icon strip + tabs) |
| Books tab | **149** | per-block authoring toolbars (12 buttons × N blocks); should be reader-only on phone |
| /rules top | 11 icon buttons | 7 visible at once, zero labels |

## Findings & proposed solutions

### 1. Account shell — replace drawer-only nav with a bottom tab bar (biggest win)

Today: header (avatar/name + search + storage + hamburger) then drawer with 8 tabs + 3 actions.
Phone nav requires 3 taps to reach any tab, and the current tab is invisible.

Proposal:
- Add a fixed **bottom tab bar, max 5 items, icon + label**, visible only ≤768px:
  `Characters · Journal · World · Books · More`.
- "More" opens the existing drawer (Rooms, Campaigns, Social, Membership, Home, Upgrade, Sign Out).
- Header on phone shrinks to: avatar + name (tap = profile) + search icon + "…" overflow (storage, notifications).
- Keep `useIsPhone()` default tab = `characters` (already implemented, AccountDashboard.jsx:164).
- Content needs `padding-bottom` = tab bar height + safe-area inset (`env(safe-area-inset-bottom)`).

### 2. Characters tab — one CTA, two controls per card

- Keep **one** create CTA on phone: the dashed "Forge New Hero" card is the better affordance; hide the header "Create Character" button ≤768px (or vice versa — pick one).
- Search row: move Class + Sort into a **"Filters" bottom sheet** (badge shows active count), so the row is `[search][filters]`. Alternatively two 50% selects in a single row — but the sheet scales better.
- Hero card on phone:
  - Whole card tap → **View sheet**.
  - Active hero: ribbon only (already exists) — remove the redundant "Active Hero" button.
  - Non-active hero: one compact "Select" chip in the card header.
  - Edit / Delete move into an **overflow "…"** on the card (delete stays behind confirm).
  - Net: 4 action controls → 1–2.
- Shorten mobile placeholder to "Search heroes…" (current one is clipped mid-word).

### 3. World tab — kill the duplicate nav

- Remove the 10-button `.world-header-icon-strip` on phone (it duplicates `.world-tabs` exactly; 20 → 10 nav controls).
- Keep the labeled `.world-tabs` scroller (already scroll-snap) and add a trailing **"All sections"** chip opening a bottom sheet with all 10 labels + counts.
- Fold the "Worlds (n)" switcher into the title row (already is) and drop the duplicate for mobile if space is tight.

### 4. Rules (Laws & Lore) — labels over icons

- The existing bottom sheet with labeled subcategories is the right pattern; make it the entry point instead of 10 mystery icons.
- Phone header becomes: `[Browse ▾] [Search field]` where Browse opens the category sheet (labels + icons); selecting a category lists its subsections.
- Keep the category icon strip only ≥1024px (desktop sidebar).
- Section tabs (How to Navigate / Core Principles / …): ensure horizontal scroll + edge fade; never clip mid-word ("Session Str…" today).
- Add a breadcrumb under the hero (`Character Creation › Classes`) so users know where they are after a bottom-sheet jump.

### 5. Books — reader-first on phones

- Default to **Reader mode** on `useIsPhone()`; hide the authoring toolbar and per-block formatting controls behind an explicit "Edit" action (authoring is desktop/tablet work per the mobile guardrail).
- If editing on phone must exist, show formatting in a **bottom sheet for the focused block** instead of 12 inline buttons per block.
- Toolbar on phone: Back, TOC (existing navigator drawer), Reader/Edit toggle, overflow (theme, print, glossary, revisions).

### 6. Rooms — one primary action

- Collapse the empty state to a single **"Create a room"** button that opens a type sheet: Local (offline) vs Multiplayer (permanent).
- Room cards: primary "Enter" + "…" overflow (rename/share/delete).

### 7. Journal polish

- Hide the unlabeled dot legend (Received/Notes/Orbs progress row) on phone behind an info affordance.
- Folder select flex-1 + compact icon "New Folder" button on one row (currently select and button eat a full row each).

### 8. Cross-cutting conventions to adopt

- Touch targets ≥44px; bottom sheets for pickers/filters; labels always visible for top-level nav.
- No tooltip-only controls on phone (`title` is invisible on touch).
- One primary CTA per screen/empty state.
- Per-item controls: 1 primary + "…" overflow on phone.
- All mobile overrides in the **last matching media block** of each file
  (AccountDashboard.css ~5345, WorldDashboard.css ~3739, RulesPage.css) — see `known-pitfalls` memory.

## Suggested phasing

1. **P0** — ✅ DONE (2026-09-11): /rules search crash (RulesPage.jsx:5837), account bottom tab bar
   (Characters · Journal · World · Books · More), drawer slimmed to secondary tabs + actions,
   close X + tap-outside backdrop, hamburger removed on phones, content padding for the fixed bar.
   Verified at 412/320: no horizontal overflow on all 8 tabs; desktop 1440 unaffected;
   account 10/10 + WorldDashboard 13/13 jest; eslint clean.
2. **P1** — ✅ DONE (2026-09-11): Characters tab consolidation (single create CTA on phones —
   header button hidden, Forge card remains; search + "Filters" trigger on one row; Class/Sort in
   a portal bottom sheet; whole card tap = character view; per-card "..." action sheet replaces
   3 icon buttons; "Ready for play" replaces the redundant Active Hero button; placeholder
   "Search heroes…"). World: duplicate 10-icon strip hidden ≤768 (visible controls 50 → 40).
   Verified at 412/320 (no overflow), desktop 1440 untouched, account 10/10 + WorldDashboard 13/13,
   eslint no new issues.
3. **P2** — ✅ DONE (2026-09-11):
   - **Rules**: phone strip is now `[Search] [Browse]`; Browse opens a portal bottom sheet with all
     10 labeled categories, drill-down to subcategories, active highlighting. Desktop rail unchanged.
   - **Books**: reader-first on phones (`activeMode` defaults to read via `useIsPhone`, write toggle
     hidden, authoring toolbar actions hidden). Visible controls 149 → 8 at 412px.
   - **Rooms**: one primary "Create a Room" CTA opening a Local/Multiplayer type sheet; the three
     inline create buttons hidden on phones. Desktop unchanged.
   - **Journal**: DM+ upsell hint hidden on phones; counters stay inline (specificity fix:
     `.journal-stats .journal-upsell-hint` beats `.journal-stats span`).
   - Verified: 412px no overflow on all 8 surfaces; desktop 1440 regressions clean;
     BookDocumentEditor 24/24, account 10/10, WorldDashboard 13/13; eslint 0 errors.

### P0 implementation notes (for follow-up work)

- `AccountDashboard.jsx`: bottom nav rendered only when `isPhone`; `More` toggles the existing
  drawer which now shows only Rooms/Campaigns/Social/Membership + Home/Upgrade/Sign Out.
  Hamburger JSX is `!isPhone` (kept for 768px tablet edge where `isPhone` is false but the
  drawer CSS is still active).
- `AccountDashboard.css` (appended at end of file): `.account-bottom-nav` fixed bar,
  `.account-mobile-menu-header`/`-close`, `.account-mobile-backdrop`, and
  `.account-dashboard { padding-bottom: calc(72px + env(safe-area-inset-bottom)) }`.
- Header still keeps search icon + storage pill; moving storage into the drawer remains optional.


## Open decisions (need Daniel)

- Bottom bar slots: `Characters · Journal · World · Books · More` vs keeping Social on the bar.
- Tabs to keep in drawer vs promote: Rooms/Campaigns are desktop-ish per guardrails.
- CSS depth: structure/JSX only, or include mobile styling passes (standing rule says Daniel does final polish manually).
