# Class Resource Bar Improvement Plan

> **Status:** Proposal — not yet implemented
> **Scope:** All class resource bars across `ClassResourceBar.jsx` (inline) and the six separate component bars (`Plaguebringer`, `Pyrofiend`, `Spellguard`, `Toxicologist`, `Warden`, `Augur`)
> **Reference implementation:** The redesigned **Minstrel** musical-notes bar (`musical-notes-combo.css` + `renderMusicalNotesCombo`) is the gold standard this plan measured against.

---

## 1. Why the Minstrel bar sets the bar

The redesigned Minstrel resource bar now satisfies the qualities every class bar should aim for:

| Quality | How the Minstrel bar does it |
|---|---|
| **Reflects the class fantasy** | Discrete pips + Roman numerals + faint musical staff lines *look* like a musical score — the visual is the mechanic. |
| **Fits the party HUD rhythm** | A single 14px-tall compact row that matches the HP/Mana/AP bars, with all rich content moved into a click-out popover panel. |
| **Shows the core loop at a glance** | Cadence-readiness chips tell you *what you can do right now*, not just *what you have*. |
| **Readable on every surface** | Numeral + fill encode the value; hover reveals exact counts; panel & tooltip text are dark-on-light for the beige menu theme. |
| **Interactive & owner-aware** | Click cells to adjust, click chips to resolve a cadence, click the spec pill to cycle — all gated by `isOwner`/`isGMMode`. |

**The Minstrel pattern to reuse everywhere:**
1. A **compact single-row bar** for `context="party"` / `size="small"` that fits the HP/Mana/AP rhythm (~14px).
2. A **popover panel** (`unified-context-menu` portal) holding spec selection, fine controls, and any class-specific "what can I do" affordances (Minstrel's cadence chips).
3. **Discrete, countable visuals** (pips/segments/cells) over fluid fills when the resource is a stack.
4. **Dark text on the light beige** `unified-context-menu` — never rely on bright/thematic colors for body text.
5. **Read the value from the `classResource` prop**, never hardcoded `useState` defaults.

---

## 2. Systemic issues (fix once, help many bars)

These cut across most/all bars and are the **highest-leverage** work.

### 2.1 The "icon eats the button" bug 🔴
**Symptom:** In click-to-open menus, the FontAwesome icon fills the button and the number (`+1`, `-3`, etc.) is clipped to invisible. Worst on **False Prophet** (reported), also affects **Inquisitor**, **Shaper**, **Gambit/Threads**, **Chronarch**, **Lunarch**.

**Root cause** (`unified-context-menu.css`):
- `.context-menu-button` (line ~346): horizontal flex + `overflow: hidden`.
- `.context-menu-button i` (line ~499): hard-locked to `width: 18px; font-size: 16px; flex-shrink: 0`.
- In a 200px-wide `.chronarch-party` menu, 4 buttons/row → ~42px each. After padding + 18px icon + gap, **<12px remain** for the number, which `overflow:hidden` clips.

**The fix already exists but is unused.** Column-layout button classes were authored for exactly this and never applied in JSX:
- `.falseprophet-action-btn` (line 1127) — `flex-direction: column`, icon-over-label.
- `.shaper-action-btn` (line 1409), `.chronarch-action-btn` (line 1589), `.falseprophet-quick-btn` (line 1191).

**Plan:** Either (a) swap the JSX to use these column classes in the affected menus, or (b) globally relax `.context-menu-button i` to `flex-shrink: 1; min-width: 0` and shrink the icon to ~12px in compact menus. Recommend (a) for the worst offenders (False Prophet, Inquisitor) and (b) as a safety net.

### 2.2 Hardcoded local state ignoring the prop 🔴
**Plaguebringer** (`useState(65)` virulence, `useState(4)` afflictions) and **Spellguard** (`useState(45)` AEP) display fake demo values that never sync with real character data.

**Plan:** Read from the `classResource` prop like Pyrofiend/Toxicologist/Warden/Augur do.

### 2.3 Stale / fabricated specialization data 🔴
Several bars ship spec IDs, names, and passives that **don't match the class data files**:
- **Warden:** resource renamed "Vengeance Points" (data: **"Tether Tension"**); **Monolith spec missing** entirely; ability names are legacy ("Vengeful Strike" vs data's "Barbed Lash").
- **Spellguard:** resource renamed "Arcane Energy Points" (data: **"Void Resonance (AEP)"**); specs use stale names/passives ("Arcane Fortitude" vs data's "Lead-Lined Ribcage").
- **Pyrofiend:** ships a **fabricated "Hellfire" spec**; the real third spec is **"The Apostate's Path"**. Stage names are also wrong (component's Mortal/Ember/... vs data's Dante-inspired Limbo/Lust/...).
- **Plaguebringer:** spec IDs use camelCase (`virulentSpreader`) while data uses kebab-case (`virulent-spreader`) — a sync bug.

**Plan:** Reconcile each bar's spec/ability tables against its `<class>Data.js`. Make the data file the single source of truth.

### 2.4 Duplicated tooltip-positioning logic 🟠
Every separate-component bar re-implements an ~80-line `useEffect` for viewport-flipped, HUD-aware tooltip placement.

**Plan:** Extract a shared `useTooltipPosition(barRef, opts)` hook and adopt it across all six component bars.

### 2.5 Missing/inconsistent compact sizing 🟠
- **Augur** has **no `.small`/`.large` CSS at all** — renders identically in a cramped party frame.
- **Toxicologist** parks its spec button at `left: -40px` outside the bar — clipped in narrow frames.
- Many bars rely on 9px / 7px inline font sizes that clip in compact width.

**Plan:** Add a shared "compact party-frame sizing contract" (`min-width`, segment sizing, label overflow rules) and ensure every bar has `.small` / `.party-member-frame` rules.

### 2.6 Bright thematic colors used for body text 🟡
On the light-beige `unified-context-menu`/`pathfinder-tooltip`, bright note/spec colors (yellow, gold, orange) are unreadable. (Already fixed for Minstrel — use a colored swatch/dot + dark text.)

**Plan:** Audit every tooltip/menu for inline `color: <bright>` body text; replace with dark text + a small colored swatch where the thematic color matters.

---

## 3. Per-class findings & recommendations

Priority key: 🔴 critical (broken UX / wrong data) · 🟠 important (notable UX or fidelity gap) · 🟡 polish

### Bars rendered inline in `ClassResourceBar.jsx`

#### False Prophet — Madness Gauge 🔴
- **Bar:** 20 horizontal segments across 5 danger tiers + `{n}/{max}` label.
- **The reported bug:** The gain/spend menu uses 4 `.context-menu-button`s per row; the fixed 18px icons leave no room for the `+1/+3/+4/+5` numbers → **numbers invisible**.
- **Also:** 20 segments crowd the bar at party-frame width.
- **Fix:**
  1. Apply `.falseprophet-action-btn` (column layout) to the menu buttons — or cap at 2/row.
  2. Consider grouping segments into the 5 tiers as thicker blocks (4 segments per tier) so the bar reads as a danger meter, not 20 dots.

#### Revenant — Ascension/Blood 🟠
- **Bar:** Two side-by-side halves — 7 skull-path cells (left) + blood-token fill (right).
- **Issues:** 7px skull emoji (💀) barely legible; 8px overlay number collides with center skull divider; heavy inline styles.
- **Fix:** Replace emoji glyphs with FontAwesome icons sized to the cell; move overlay number to avoid divider collision; migrate inline styles to CSS classes.

#### Chronarch — Time Shards / Temporal Strain 🟡
- **Bar:** Two fluid fill bars + center ornament; strain pulses/flashes at high values.
- **Issues:** Mild icon-crowding in the 2–3-button menu rows; unused `.chronarch-action-btn` column class.
- **Fix:** Adopt `.chronarch-action-btn` for the menu; otherwise this bar is solid.

#### Harbinger — Mayhem Gauge 🟢
- **Bar:** Canvas-rendered; 2×2 grid menu uses inline text (`+5 Mayhem`) so numbers stay visible.
- **Status:** Best of the inline bunch. Minimal work — verify the menu fits in party width.

#### Gambit — Threads of Destiny 🟠
- **Bar:** 13 segmented cells with tiny card-suit glyphs.
- **Issues:** Same icon-crowding as False Prophet (3 buttons/row); **mojibake card-suit characters** (`'â '`, `'â™¥'`) likely render as replacement glyphs — corrupted UTF-8.
- **Fix:** Repair the unicode card suits (♠♥♦♣); adopt column buttons for the menu; 13 segments is dense in compact — consider collapsing to a `n/13` numeric bar with a pip strip.

#### Gambit — Fortune Points / Karmic Debt 🟡
- **Bar:** Two side-by-side fills (gold + red) with a `♦` divider.
- **Issues:** 9px labels with ellipsis clip `"7/7 FP"` → `"7/7…"`; both bars share one hover tooltip (`'fp'`) so hovering debt shows the fortune tooltip.
- **Fix:** Split the hover section so each bar has its own tooltip; widen/abbreviate labels.

#### Martyr — Devotion Gauge 🟡
- **Bar:** 6 level segments with inline 8px level numbers + damage threshold label.
- **Issues:** Damage numeric input is cramped in 200px party menus.
- **Fix:** Mostly fine; ensure the popup input scales.

#### Inquisitor — Hexbreaker Charges 🔴
- **Bar:** Up to 8 charge cells + 3-dot attack counter.
- **Issues:** The **spend grid is 4-column `.context-menu-button`** with `-1/-2/-3/-6` → labels clip (same root cause as False Prophet). 8 charges + 3 dots + 2 labels is a lot of mass in a party frame.
- **Fix:** Switch the spend grid to column buttons or 2-column; add a numeric overlay for the attack counter.

#### Arcanoneer — Elemental Spheres 🟡
- **Bar:** Canvas orb grid + side controls (dice/clear buttons); **no popup menu** — left-click adds, right-click removes.
- **Issues:** Right-click-to-cycle-mode is non-obvious; discoverability relies on tooltip text only.
- **Fix:** Add a small mode label/indicator next to the dice button so the current mode is always visible.

#### Shaper — Stance Flow 🔴
- **Bar:** Canvas multi-zone with 3 HTML overlays (Flux zone, stance icon, Body Toll zone); **no numbers on the bar itself**.
- **Issues:** Momentum/Body Toll menus crowd icons over numbers (same bug); unused `.shaper-action-btn` exists; absolute overlay positioning (`calc(50% - 14px)`) is fragile.
- **Fix:** Apply `.shaper-action-btn`; show at least a compact `{flux}/{bodyToll}` indicator on the bar in party mode; harden overlay positioning.

#### Berserker — Blood-Heat Rage 🟡
- **Bar:** Canvas rage bar with `overheated` state; 2-buttons-per-row menu (so numbers fit).
- **Status:** Least-bad instance of the action-button pattern. Keep the numeric `set` input pattern — it's a good idea worth copying to other bars.

#### Exorcist — Dominance Die 🟠
- **Bar:** Single fill bar with a **user-typed demon name** sharing space with the `d12` label.
- **Issues:** Arbitrary-length demon names overflow/clip the narrow party bar; menu is icon-only with no visible labels (chevrons, edit, unlink…).
- **Fix:** Truncate the demon name with ellipsis at compact width; add tiny text labels under the menu's icon-only buttons.

#### Lunarch — Lunar Phases 🟠
- **Bar:** Moon icon + 4-segment phase bar + 3-round timer dots.
- **Issues:** 4 phase-shift buttons in a 2-col grid with full phase names ("Waxing Moon") at 8px clip; phase icons at 9px are borderline.
- **Fix:** Use abbreviations in the phase buttons (e.g. "Wax", "Wane") with full name in tooltip.

### Bars in separate component files

#### Toxicologist — Toxin Vials + Contraption Parts 🟠 *(best data fidelity)*
- **Bar:** Split vertical-fill (green toxins | gear contraptions) + spec button parked at `left: -40px` **outside the bar**.
- **Issues:** The external spec button is a **layout hazard** (clipped in narrow frames); three separate menus is a high discovery burden; count badges on liquid can have contrast issues.
- **Fix:** Move the spec button inside the bar (icon in the divider); consolidate the three menus into one popover panel (Minstrel-style); ensure count badges have a dark outline.
- **Note:** This is the only bar whose specs fully match the data — use it as a fidelity model alongside Minstrel.

#### Augur — Benediction / Malediction 🟠 *(best data fidelity)*
- **Bar:** Dual-fill track where the **center divider physically shifts** to visualize each spec's cap asymmetry — genuinely elegant.
- **Issues:** **No size variants at all** — renders oversized in party frames; generation rule (**even d20 = Benediction, odd = Malediction**) and self-mutilation flaw are never explained in the tooltip; debt badge is an unlabeled negative number.
- **Fix:** Add `.small`/`.large` CSS + `.party-member-frame` rules; add a "How you gain these" line to the tooltip; label the debt badge.

#### Pyrofiend — Inferno Veil 🔴
- **Bar:** 9 escalating segments with intensity animations + death-clock warning at 9; **no numeric overlay** (must count segments).
- **Issues:** Fabricated "Hellfire" spec (real third spec is "Apostate's Path"); stage names diverge from data; no visible number for the most dangerous resource in the game; `catastrophic-warning` floats `top:-18px` overlapping the bar above.
- **Fix:** Replace Hellfire with the real Apostate spec + Tempered Pact mechanics; align stage names to data's Dante scheme; **add a numeric overlay** (`9/9`) on the bar; reposition the death-clock warning so it doesn't overlap.

#### Plaguebringer — Virulence + Afflictions 🔴
- **Bar:** Virulence fill + 10 affliction chips.
- **Issues:** Hardcoded state ignores prop; spec IDs are camelCase (data is kebab); **the entire affliction depth is flattened** — data has 5 cultivation categories × 3 stages with distinct final archetypes, but the bar shows one `0–10` counter; the class's signature is invisible.
- **Fix:** Read from prop; fix spec ID casing; redesign the affliction half to show stage/category (e.g. 5 category columns × pip rows) rather than a flat chip count.

#### Warden — Vengeance Points 🔴
- **Bar:** 10 segments + large 20px `vp-number` overlay; complex menu with spec-state toggles.
- **Issues:** Resource renamed away from data's **"Tether Tension"** (erases the flesh-graft fantasy); **Monolith spec missing**; ability names stale; the 20px number dominates/crowds segments at small size.
- **Fix:** Restore "Tether Tension" naming; add the Monolith spec; align ability names; shrink the numeric overlay in compact mode.

#### Spellguard — Arcane Energy Points 🔴
- **Bar:** Single fill with rune glyphs, energy particles, spec overlays; the **only bar with a full party-context beige reskin** (good pattern!).
- **Issues:** Hardcoded state; resource renamed from **"Void Resonance (AEP)"**; specs stale; **the "ticking bomb" identity is scrubbed** — Arcane Radiation (end-of-round necrotic + max-HP reduction), Critical Meltdown at 100, and the +50% physical vulnerability are absent from the tooltip.
- **Fix:** Read from prop; restore Void Resonance naming + the radiation/meltdown/vulnerability warnings in the tooltip; fix spec names/passives. Keep the party-context reskin as a model.

---

## 4. Recommended implementation order

**Phase 0 — Systemic fixes (do first, unblock everything):**
1. Resolve the icon-eats-button bug (§2.1) — global `.context-menu-button i` relaxation + apply the existing column classes in the worst menus (False Prophet, Inquisitor, Shaper).
2. Fix the two hardcoded-state bars so values reflect real data (§2.2: Plaguebringer, Spellguard).
3. Extract the shared `useTooltipPosition` hook (§2.4).

**Phase 1 — Critical fidelity corrections (§2.3):**
4. Reconcile spec/ability/naming data for Pyrofiend, Warden, Spellguard, Plaguebringer against their `<class>Data.js`.

**Phase 2 — Per-bar UX, worst first:**
5. False Prophet (menu + segment grouping).
6. Inquisitor (spend grid + numeric counter).
7. Shaper (menu buttons + compact indicator).
8. Toxicologist (move spec button inside; consolidate menus).
9. Augur (add size variants + tooltip economy).
10. Pyrofiend (numeric overlay + warning reposition).
11. Plaguebringer (affliction depth redesign).
12. Warden (rename + Monolith spec + overlay sizing).
13. Spellguard (rename + radiation warnings).

**Phase 3 — Polish across the rest:**
14. Gambit (fix mojibake suits + split tooltips), Revenant (icons + overlay), Lunarch (abbreviations), Exorcist (name truncation + labels), Chronarch/Martyr/Harbinger/Berserker/Arcanoneer (minor).

---

## 5. Quick "does this bar match the Minstrel standard?" checklist

Use this when reviewing or redesigning any class bar:

- [ ] Does the bar's **visual** evoke the class fantasy (Minstrel = musical staff; Augur = shifting omen scale)?
- [ ] Does it fit the **14px party-HUD rhythm**, with rich content in a popover (not stacked rows)?
- [ ] Is the value encoded by **discrete, countable units** when it's a stack — or a clear fill when it's a meter?
- [ ] Are **all numbers readable** on the bar (or revealed on hover) at compact width?
- [ ] Does the tooltip/menu tell you **what you can do** with the resource right now (Minstrel's cadence chips), not just how much you have?
- [ ] Is body text **dark-on-light** (never bright thematic colors) on the beige menu/tooltip?
- [ ] Does it **read from the `classResource` prop** (no hardcoded state)?
- [ ] Do **specs/names/abilities match** the class data file?
- [ ] Is there an `isOwner`/`isGMMode` gate on mutations?
- [ ] Are there `.small` / `.party-member-frame` size rules?

---

*Research basis: inline-bar audit of `ClassResourceBar.jsx`, separate-component audit of the six `*ResourceBar.jsx` files, and playstyle summaries from each `<class>Data.js`. No code was modified during research.*
