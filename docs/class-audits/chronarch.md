# Chronarch — Deep Dive

- Date: 2026-09-14
- Auditor: Phase 2 C1 cluster (spell-floor + talent audit, validated)
- Status: **implemented — awaiting Daniel review**

## 1. Scores (0–3 per dimension; target >= 24/30, no dimension <= 1)

| # | Dimension | Score | Evidence |
|---|---|---|---|
| 1 | Identity & fantasy | 3 | Time Weaver / Temporal Architect: manipulate local causality, freeze projectiles, loop enemy actions, rewind catastrophic wounds, pay cellular strain for timeline intrusion. Unrivaled chronal fantasy |
| 2 | Group function & exclusive utility | 3 | Wholly unique group tools: rewinding ally damage/debuffs, granting AP, stasis zones, project velocity dampening, pocket dimension sanctuaries, and the ultimate Chronal Restoration |
| 3 | Resource loop design | 3 | Dual-engine: Time Shards (0–10 builder) vs Temporal Strain (0–10 cap-pressure). Basic spells build shards; heavy Flux spells consume shards and generate Strain. Cap failure (10 Strain) triggers Temporal Backlash (3d6 blight, stun, shard purge) |
| 4 | Spell-curve quality | 3 | 49 authored spells; 0 pool-floor gaps across all levels 1–10 (L1: 7\|6, L2: 6\|5, L3: 4\|4, L4: 4\|4, L5: 4\|4, L6: 4\|4, L7: 4\|4, L8: 4\|4, L9: 4\|3, L10: 4\|4) |
| 5 | Utility identity per level | 3 | Exceptional utility depth: 3 to 6 non-damage options at every level, including both combat stasis/rewinds and out-of-combat investigations (Deja Vu, Temporal Compression, Rewind Blunder) |
| 6 | Combat decision density | 3 | Every turn balances Shard generation vs Strain accumulation; choosing when to risk heavy Flux spells near the Strain threshold drives intense tactical choices |
| 7 | Talent-tree integration | 3 | Three complete 50-pt trees; 0 validator errors, 0 warnings; all 65 legacy icons replaced with verified local assets; 0 free-cast ACTIVE talents |
| 8 | UI expression | 3 | Distinct dual bars: Time Shards (blue gem lattice) and Temporal Strain (red threat bar); clear visual thresholding |
| 9 | Anti-overlap distance | 3 | C1 cluster: Chronarch's failure shape is *cellular recoil & timeline stutter* (backlash + shard wipe); distinctly separated from Pyrofiend's death clock, Berserker's rage starvation, and Harbinger's random surge rewrite |
| 10 | Beginner legibility | 2 | Piloting two connected resource bars alongside timeline mechanics requires concentration |
| | **Total** | **28/30** | Exceeds charter target (>= 24/30) |

## 2. Utility Ledger row

- Primary / secondary role: Control / Support (Temporal Manipulation)
- Exclusive territory: **causality rewinding & stasis fields** — manipulating the turn economy (AP grant/drain), rewinding wounds and blunders, and delaying or locking battlefield coordinates
- Conflicts to resolve: C1 cap-pressure cluster (differentiation vs Pyrofiend/Harbinger/Spellguard), Harbinger (temporal vs planar fate drift)
- Resolution: keep; emphasize clockwork precision, causality mechanics, and cellular strain

## 3. Findings

### Talent trees
- All three trees (`chronarch.js`) validated cleanly under the v2 talent tree validator.
- 0 validator errors, 0 warnings.
- 65 legacy icons replaced with verified local ability icons in Phase 2 icon wave.
- 0 free-cast ACTIVE talents: every active talent costs mana and either generates or expends Time Shards/Strain.

### Spellbook
- 49 total authored spells in `chronarchData.js`.
- Spell floor completed: 7 new spells authored (L4 `chrono_stasis_wall`, L6 `chrono_causality_reweave`, L7 `chrono_anchorfield`, L8 `chrono_timeline_purge`, L9 `chrono_timeless_sanctuary`, L10 `chrono_epoch_shatter`, L10 `chrono_paradox_transcendence`).
- Missing authored spells linked into pools: `chrono_slow_fall` (L1) and `chrono_time_blink` (L2).
- Passive unslotted from pick pool: `temporal_mastery` (L10) unslotted from the active pick pool into authored passive standing, replaced with 2 new active L10 capstones (`chrono_epoch_shatter` and `chrono_paradox_transcendence`).
- Pool map: L1 (7\|6), L2 (6\|5), L3 (4\|4), L4 (4\|4), L5 (4\|4), L6 (4\|4), L7 (4\|4), L8 (4\|4), L9 (4\|3), L10 (4\|4).
- 0 pool-floor gaps, 0 warnings.

### Resource / data
- Dual-bar configuration in `chronarchData.js` (`time_shards` max 10, `temporal_strain` max 10) fully aligned with spell costs and backlash mechanics.

## 4. Change list

| Item | Action | Rationale | Status |
|---|---|---|---|
| Spell-floor program | authored 7 spells (L4, L6, L7, L8, L9, L10 x2) | Charter requirement (>=4 options, >=2 non-damage) | done |
| Pool omissions | added `chrono_slow_fall` (L1) and `chrono_time_blink` (L2) | Resolved audit warnings | done |
| L10 passive in pick slot | removed `temporal_mastery` from pick pool; added 2 active capstones | Passives barred from pick pools | done |
| Legacy icons | replaced 65 icons | Asset localization | done |
| Free-cast ACTIVE talents | verified resource costs | Resource loop integrity | done |
| C1 failure-shape prose | differentiate temporal backlash vs other C1 classes | Anti-overlap clarity | queued |

## 5. Evidence

- `node scripts/audit-classes.mjs --class Chronarch`: 0 integrity errors, 0 pool-floor gaps, 0 warnings.
- `node vtt-react/src/utils/talentTreeValidator.mjs --file chronarch`: 3 valid / 0 invalid, 0 warnings.
- `npm run audit:damage-types`: 0 non-canonical errors.
- `npm run audit:spell-variety`: 0 upgrade traps.

## 6. Mind memory

- `chronarch-deep-dive-2026-09-14`, `class-deep-dive-policies-2026-09-13`

## 7. Spell-level format & flavor pass — 2026-09-16

Tool: `scripts/spell-card-qa.mjs`. **Before: 43 flagged / 4 errors. After: 0 errors** (remaining warnings are long descriptions + resource-value-missing items from the deep dive).

| Spell | Issue | Fix |
|---|---|---|
| `chrono_slow_fall`, `chrono_time_blink` | no `effectTypes` | added `utility` + feather-fall / blink utilityConfigs |
| `temporal_foreknowledge` | `buff` with no config | added already-lived buffConfig |

Flavor: clockwork/time-shard identity intact; Temporal Strain modeling remains the tracked deep-dive gap.

### Pass 3 addendum — 2026-09-16 (cooldown declarations)

28 spells had no `cooldownConfig` at all. Per the SQL reference, the field is required; every affected spell now declares `cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 }` — an explicit no-cooldown declaration matching the class's resource-gated design (Time Shards / Temporal Strain), not a balance change.

### Pass 4 — 2026-09-16 (verbosity trim)

12 descriptions over 200 chars rewritten to ≤200, preserving every mechanic, number, and the class voice. Full global spell-card QA is now **0 errors / 0 warnings** across all 21 classes (1,026 spells).
