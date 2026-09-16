# Augur — Deep Dive

- Date: 2026-09-14
- Auditor: Phase 2 C3 cluster (spell-floor + talent audit, validated)
- Status: **implemented — awaiting Daniel review**

## 1. Scores (0–3 per dimension; target >= 24/30, no dimension <= 1)

| # | Dimension | Score | Evidence |
|---|---|---|---|
| 1 | Identity & fantasy | 3 | Visceral Haruspex of the Frozen Archive: reads immediate combat trajectory in steaming entrails, spilled blood, and shattered bone. Gripping lore (founder Cassia preserved in glacier-ice, accuracy collapse from 93% to 41%) |
| 2 | Group function & exclusive utility | 3 | Preemptive action economy and fate recording: foresight shielding, guaranteed critical ranges, odd/even roll manipulation, condition cleansing, and the Ledger Inversion / Glacier Sepulcher interventions |
| 3 | Resource loop design | 3 | Dual-pool omen engine: d20 Evens generate Benediction (healing, wards, boons); d20 Odds generate Malediction (curses, rot, vulnerability). Can also be seeded via fresh gore and sacrificial memory burn |
| 4 | Spell-curve quality | 3 | 45 authored spells; 0 pool-floor gaps across all levels 1–10 (L1: 7\|7, L2: 5\|5, L3: 4\|3, L4: 4\|4, L5: 4\|4, L6: 4\|3, L7: 4\|4, L8: 4\|4, L9: 4\|4, L10: 4\|4) |
| 5 | Utility identity per level | 3 | Outstanding utility identity: at least 3 to 7 non-damage choices per level, encompassing battlefield warding, bone-casting, entrail-reading investigations, and probability accounting |
| 6 | Combat decision density | 3 | High round-to-round tactical play: harvesting enemy and ally rolls into twin pools, timing preemptive shields, and trading blood or memory to stabilize party survival |
| 7 | Talent-tree integration | 3 | Three complete 50-pt trees (Auspice, Harbinger, Hierophant); 0 validator errors, 0 warnings; all icons verified local assets; 0 free-cast ACTIVE talents |
| 8 | UI expression | 2 | Dual Benediction / Malediction bar; data-driven tooltip copy queued |
| 9 | Anti-overlap distance | 3 | C3 probability cluster: Augur is *the ledger that records fate* (reactive d20 reading, even/odd accounting, blood harvest); cleanly distinct from Gambit's *hand that cheats fate* (proactive wagers, card draws, debt caps) |
| 10 | Beginner legibility | 2 | Tracking d20 even/odd outcomes and balancing two concurrent omen pools requires attentive play |
| | **Total** | **28/30** | Exceeds charter target (>= 24/30) |

## 2. Utility Ledger row

- Primary / secondary role: Support / Control (Probability & Divination)
- Exclusive territory: **even/odd d20 roll harvesting & visceral haruspicy** — recording combat die rolls to fund proactive wards, fated inversions, and catastrophic curses
- Conflicts to resolve: C3 probability cluster (Gambit overlap), Harbinger (prophecy terminology drift)
- Resolution: keep; anchor firmly in physical entrail-reading, gore harvest, and mathematical ledger accounting

## 3. Findings

### Talent trees
- All three trees (`augurAuspice.js`, `augurHarbinger.js`, `augurHierophant.js`) are 18-node, 50-pt v2 valid trees.
- Validator: 3 valid / 0 invalid, 0 warnings.
- All talent icons verified local assets.
- 0 free-cast ACTIVE talents: active talents cost mana and generate/spend Benediction or Malediction.

### Spellbook
- 45 total spells in `augurData.js`.
- Spell floor completed: 7 new spells authored (L4 `augur_visceral_tether`, L5 `augur_fated_transfusion`, L6 `augur_gagged_portent`, L7 `augur_ledger_inversion`, L8 `augur_archive_oblivion`, L9 `augur_glacier_sepulcher`, L10 `augur_first_failing_echo`).
- Pool map: L1 (7\|7), L2 (5\|5), L3 (4\|3), L4 (4\|4), L5 (4\|4), L6 (4\|3), L7 (4\|4), L8 (4\|4), L9 (4\|4), L10 (4\|4).
- 0 pool-floor gaps, 0 warnings.

### Resource / data
- Dual-pool resource (`benediction` / `malediction`) aligned between `classResources.js`, `augurData.js`, and spell costs.

## 4. Change list

| Item | Action | Rationale | Status |
|---|---|---|---|
| Spell-floor program | authored 7 spells (L4–L10) | Charter requirement (>=4 options, >=2 non-damage) | done |
| Free-cast ACTIVE talents | costed with omens/mana | Resource loop integrity | done |
| Legacy icons | verified local assets | Asset localization | done |
| C3 ledger-vs-wager prose | sharpen vs Gambit | Anti-overlap clarity | queued |

## 5. Evidence

- `node scripts/audit-classes.mjs --class Augur`: 0 integrity errors, 0 pool-floor gaps, 0 warnings.
- `node vtt-react/src/utils/talentTreeValidator.mjs --file augurAuspice`: 1 valid / 0 invalid, 0 warnings.
- `npm run audit:damage-types`: 0 non-canonical errors.
- `npm run audit:spell-variety`: 0 upgrade traps.

## 6. Mind memory

- `augur-deep-dive-2026-09-14`, `class-deep-dive-policies-2026-09-13`

### Pass 4 — 2026-09-16 (verbosity trim)

32 descriptions over 200 chars rewritten to ≤200, preserving every mechanic, number, and the class voice. Full global spell-card QA is now **0 errors / 0 warnings** across all 21 classes (1,026 spells).
