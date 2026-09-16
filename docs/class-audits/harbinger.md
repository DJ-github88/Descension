# Harbinger — Deep Dive

- Date: 2026-09-14
- Auditor: Phase 2 C1 cluster (agent-assisted tree polish, validated)
- Status: **implemented — awaiting Daniel review**

## 1. Scores (0–3 per dimension; target >= 24/30, no dimension <= 1)

| # | Dimension | Score | Evidence |
|---|---|---|---|
| 1 | Identity & fantasy | 3 | Doom arithmetic: compute the entropy of dying stars, plant prophecies that detonate later, Mayhem pressure rewriting probability. One of the strongest, most specific fantasies in the roster |
| 2 | Group function & exclusive utility | 2 | Control/damage caster with prophecy debuffs and planar zones; utility exists (~13 of 44 spells) but rarely a group-facing verb no one else has |
| 3 | Resource loop design | 3 | Mayhem 0–100 in four tiers: safe / +1 die @10% / +2 +area @25% / +3 +targets @100% Wild Surge (d100 table). Cap failure is *random rewrite*, not damage — a unique failure shape in the C1 cluster |
| 4 | Spell-curve quality | 2 | 44 spells; levels 1–9 offer >=4 options; only L10 falls short (3 options, 1 non-damage). Needs 1–2 capstones at L10 |
| 5 | Utility identity per level | 2 | Utility present at most levels (foresight, warding, interrogation) but thin at L10; L3 has only 2 non-damage picks |
| 6 | Combat decision density | 3 | Prophecy windows, roll-range bands, backlash management, surge gambling, delayed detonations — high decision density |
| 7 | Talent-tree integration | 3 | Three 50-pt trees; three doctrine rank-clones fixed; all icons are real local assets; every ACTIVE already carries Mayhem costs (verified — zero free-cast) |
| 8 | UI expression | 2 | Mayhem bar is strong (abyssal runes, bonus/drawback summary, live d100 Wild Surge roller); tooltip copy still hardcoded |
| 9 | Anti-overlap distance | 2 | C1 cluster: Harbinger's failure state is *scheduled payload + random table*; distinct from Pyrofiend's irreversible death clock and Berserker's starvation/burnout. Needs prose teaching the difference (queued) |
| 10 | Beginner legibility | 2 | Prophecy math and Wild Surge tables are the least beginner-friendly in the class list; the bar carries a lot of teaching burden |
| | **Total** | **24/30** | Meets target; remaining gap is L10 content + group-utility identity |

## 2. Utility Ledger row

- Primary / secondary role: DPS / Control
- Exclusive territory: **scheduled doom** — prophecies planted now that detonate later; probability rewritten through Mayhem Wild Surges
- Conflicts to resolve: C1 cap-pressure cluster (failure-shape differentiation), Chronarch (time/planes overlap in Fate Rift flavor)
- Resolution: keep; C1 prose pass queued to teach "random rewrite vs death clock vs starvation"

## 3. Findings

### Talent trees (implemented this session)
- Three doctrine rank-clones (`wp_t7_wild_prophet_doctrine`, `ds_t7_deaths_seer_doctrine`, `fr_t7_fate_rift_doctrine`) hand-tuned: rank 3 now adds a real rider (surge double-trigger / resistance piercing / rift radius) that persists through ranks 4–5.
- All icons already localized (31 replaced in the Phase 2 icon wave).
- Free-cast sweep: **zero ACTIVE talents lack costs** — every one already spends/generates Mayhem per its text. (The "6 free-cast" attribution was Gambit's `ps_t2_weighted_dice` / `hr_t1_all_in_strike`, handled in the Gambit sweep.)
- Minor open item: T1 generator nodes encode mana + positive effect prose ("generate 1–2 Mayhem") without a negative `mayhem` entry; behavior is fine (not free-cast) but the negative-cost convention would express generation more precisely.

### Spellbook
- 44 spells. Only floor gap: L10 (3 options, 1 non-damage). Queued: add 1–2 L10 capstones (a group-facing prophecy utility and/or a control finisher) in the spell-floor program.
- Duplicate-name check: `Judgment Day` is not present here (Inquisitor/Martyr/Revenant only); `harbinger-universal-doom_bolt`-style kebab ids remain from the legacy ID pass (cosmetic debt).

### Resource / data
- Mayhem config, bar rendering, and class data agree (four tiers, Wild Surge at 100).
- C1 differentiation recorded in `overlap-matrix.md`; prose pass queued.

## 4. Change list

| Item | Action | Rationale | Status |
|---|---|---|---|
| Three doctrine rank-clones | hand-tuned escalations | Validator warnings; capstones were flat | done |
| Legacy icons | replaced with local assets | Fallback to generic runes | done (wave) |
| L10 pool | add 1–2 spells (>=1 non-damage) | Charter floor (4 options / 2 non-damage) | queued |
| C1 failure-shape prose | teach vs Pyrofiend/Berserker/Lunarch | Anti-overlap clarity | queued |
| Tooltip/menu data-driven pass | UI standardization | Hardcoded copy | queued |
| T1 generator negative-mayhem encoding | convention polish | Explicit generation costs | queued |

## 5. Evidence

- `node vtt-react/src/utils/talentTreeValidator.mjs --file harbinger`: 3 valid / 0 invalid, 0 warnings (was 3 clones + free-cast details).
- Repo summary: 65 valid / 0 invalid.
- `npm run audit:classes -- --class Harbinger`: 0 integrity errors; L10 floor gap only.
- `npm run audit:damage-types`: 0 errors (Harbinger Chaos Bolt `random_elemental` fixed to `random` + pool).
- Jest: damage suites 12/12; talent tests 12/12 (prior runs); bar suites green.

## 6. Mind memory

- `harbinger-deep-dive-2026-09-14`, `damage-type-consistency-audit-2026-09-13`

## 7. Spell-level format & flavor pass — 2026-09-16

Tool: `scripts/spell-card-qa.mjs`. **Before: 11 flagged / 1 error. After: 0 errors** (remaining warnings are long descriptions).

| Spell | Issue | Fix |
|---|---|---|
| `harbinger_universal_calamity_stasis_horizon` | `control` with no config, buff not gated | added cooldown-freeze zone config + `buff` type |

Flavor: Mayhem/prophecy identity intact; no rethemes proposed.

### Pass 2 addendum — 2026-09-16 (mechanical warning cleanup)

`harbinger_universal_twist_of_doom`: reroll utility now renders via `selectedEffects` (was only in an unread `effects[]`).

### Pass 4 — 2026-09-16 (verbosity trim)

10 descriptions over 200 chars rewritten to ≤200, preserving every mechanic, number, and the class voice. Full global spell-card QA is now **0 errors / 0 warnings** across all 21 classes (1,026 spells).
