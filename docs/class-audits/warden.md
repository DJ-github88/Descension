# Warden — Deep Dive

- Date: 2026-09-13
- Auditor: Phase 1 pilot (agent-assisted tree repair + wiring, validated)
- Status: **implemented — awaiting Daniel review** (includes a roster change: Iron Jailer promoted)

## 1. Scores (0–3 per dimension; target >= 24/30, no dimension <= 1)

| # | Dimension | Score | Evidence |
|---|---|---|---|
| 1 | Identity & fantasy | 3 | Chain-grafted penitent jailer; rusted forearm chains, forced duels, drag-and-crush. Strong, coherent vocabulary (Tension, tethers, cages) |
| 2 | Group function & exclusive utility | 3 | The only class whose group function is **containment**: leash the boss away from the party, cage high-threat targets. Iron Jailer adds multi-target cages no one else has |
| 3 | Resource loop design | 3 | Tension (0–10) built by attacks, tethers, evasions, crits; spent on restraints/cages; tether can't be broken while Tension > 0; pursuit speed with no teleports |
| 4 | Spell-curve quality | 1 | 37 spells; L4–L10 sit at 2–3 options, and L6 has **zero** non-damage options. Needs ~10 additions |
| 5 | Utility identity per level | 2 | L1–L2 rich (6 and 8 options); mid/late thin |
| 6 | Combat decision density | 3 | Tether management, reel/drag positioning, cage selection, chokepoint play |
| 7 | Talent-tree integration | 3 | All four trees now valid 50-pt builds, 0 errors/0 warnings; Monolith repaired, Jailer promoted and completed |
| 8 | UI expression | 3 | Best bar in the roster: spec picker, cage bars, threshold studs, spec state keys — and the jailer mode was already built, only names were stale (now canonical) |
| 9 | Anti-overlap distance | 3 | C2 resolved: Apex owns the chase, Warden owns the cage; Iron Jailer's containment is exclusive in the roster |
| 10 | Beginner legibility | 2 | Four specs adds density; each is clear, but the class asks a lot of a new player |
| | **Total** | **26/30** | Above target; remaining gap is the spell floor |

## 2. Utility Ledger row

- Primary / secondary role: Control / Bruiser
- Exclusive territory: **territorial duel** — 15 ft forced 1v1, leash, drag, and (Iron Jailer) multi-cage containment
- Conflicts to resolve: C2 with Apex — resolved: Apex = the chase, Warden = the cage
- Resolution: locked in `docs/class-audits/overlap-matrix.md` C2

## 3. Findings

### Talent trees (implemented this session)
- **Monolith repaired**: was 48 pts with 17 errors (missing cooldowns, `spellType: 'REACTION'`, categories `defense`/`control`, missing damageTypes). Now 50 pts (8/6/5/5/6/8/12), 19 nodes, 0 errors/0 warnings, 19 icons replaced.
- **Iron Jailer promoted to a real 4th spec** (Daniel approved): the tree was already a valid 50-pt build with a full classData spec block, ~10 `specialization: "jailer"` spells, and a bar that already rendered its cage mode. Wired across: `warden.js` shim, `TALENT_TREES`, `getTreeBackdrop`, `talentTrees/index.js`, `classSpellCategories`; 14 legacy icons replaced.
- Validator global: 53 files / **64 valid / 1 invalid** (only Martyr Ironclad remains, Phase 2).

### Naming canonicalization
Four competing name sets existed (classData / classSpellCategories / Gaoler bar / tree ids). Canon = **classData lore names**, now used everywhere:
**Iron Stalker · Iron Jailer · Relentless Tormentor · Monolith**
classSpellCategories and the Gaoler bar labels were updated; the bar test was updated from the stale "Iron Warden" to "Iron Jailer". Audit spec drift for Warden is now clean (4/4/4 sources).

### Spellbook
- 37 spells; floor gaps L4–L10 (2–3 options each); non-damage shortfalls at L4, L6 (0), L7.
- Needed: ~10 additions, including at least 2 non-damage at L6 and control/utility at L4/L7.
- One non-stance weakness passive in a pick pool: `warden_glaive_mastery` (L1) — move to class traits in the Phase 2 spell pass.

### Resource / data
- `classResources` Warden `tooltip.description` is still empty (the bar carries the copy) — queued for the data-driven tooltip pass.
- Tension display name vs `id: vengeance-points` drift remains a repo-wide naming idiom (bar + spells now use `vengeance` cost keys in talents).

## 4. Change list

| Item | Action | Rationale | Status |
|---|---|---|---|
| wardenMonolith tree | repair to 50 pts + schema fixes + icons | 17 validator errors, live UI tree | done |
| Iron Jailer spec | promote + wire all layers + icons | Fully authored content, exceptional-4th policy | done |
| Warden spec names | canonicalize to classData lore set | 4 competing name sets | done |
| Gaoler bar labels + test | update to canonical names | Stale UI names | done |
| Spell floor L4–L10 | add ~10 spells incl. L6 non-damage | Charter floor | queued |
| `warden_glaive_mastery` pick | move to class traits | Policy: no weakness picks | queued |
| `classResources` tooltip description | fill + data-driven pass | Empty config copy | queued |
| C2 deepening | prose/identity pass with Apex | Anti-overlap maintenance | queued |

## 5. Evidence

- `node vtt-react/src/utils/talentTreeValidator.mjs --summary`: 53 files / 64 valid / 1 invalid (Martyr Ironclad only).
- `--file wardenMonolith`: valid 1 / 0 invalid, 0 errors / 0 warnings. `--file wardenJailer`: valid, 0/0.
- `npm run audit:classes -- --class Warden`: 0 integrity errors; spec drift cleared; floor gaps + 1 weakness-pick warning listed above.
- Jest: GaolerResourceBar 5/5 pass (after canonical-name test update); TalentTree 12/12 pass; full resource-bar suite previously 114 pass.
- Playwright: pending (bar/spec-picker review with Daniel).

## 6. Mind memory

- `warden-pilot-deep-dive-2026-09-13`, `class-deep-dive-policies-2026-09-13`, `class-phase0-tooling-and-fixes-2026-09-13`
