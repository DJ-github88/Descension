# Class Audit Sheets — Template & Index

> One sheet per class: `docs/class-audits/<class-name>.md`. Produced during the Phase 2 deep
> dives per `docs/CLASS_DESIGN_CHARTER.md`. Phase 1 pilots calibrate this template.

## Index

| Class | Sheet | Deep-dive status | Review |
|---|---|---|---|
| Arcanoneer | — | queued | — |
| Berserker | [berserker.md](berserker.md) | implemented — awaiting review | Daniel |
| Shaper | — | queued | — |
| Harbinger | — | queued (C1) | — |
| Chronarch | — | queued (C1) | — |
| Inquisitor | — | queued (C5) | — |
| Revenant | — | queued | — |
| False Prophet | — | queued (C6) | — |
| Gambit | — | queued (C3) | — |
| Apex | [apex.md](apex.md) | implemented — awaiting review | Daniel |
| Animist | — | queued | — |
| Lunarch | [lunarch.md](lunarch.md) | implemented — awaiting review | Daniel |
| Martyr | — | queued (C6) | — |
| Minstrel | — | queued | — |
| Plaguebringer | — | queued (C4) | — |
| Pyrofiend | — | queued (C1) | — |
| Spellguard | — | queued (C1/C5) | — |
| Toxicologist | — | queued (C4) | — |
| Warden | [warden.md](warden.md) | implemented — awaiting review | Daniel |
| Augur | — | queued (C3) | — |
| Crusader | — | queued (C6) | — |

## Template

```markdown
# <Class> — Deep Dive

- Date / session:
- Auditor:
- Status: assessment | changes-proposed | implemented | verified | reviewed

## 1. Scores (0–3 per dimension; target >= 24/30, no dimension <= 1)

| # | Dimension | Score | Evidence |
|---|---|---|---|
| 1 | Identity & fantasy | | |
| 2 | Group function & exclusive utility | | |
| 3 | Resource loop design | | |
| 4 | Spell-curve quality | | |
| 5 | Utility identity per level | | |
| 6 | Combat decision density | | |
| 7 | Talent-tree integration | | |
| 8 | UI expression | | |
| 9 | Anti-overlap distance | | |
| 10 | Beginner legibility | | |
| | **Total** | | |

## 2. Utility Ledger row (from charter)

- Primary / secondary role:
- Exclusive territory:
- Conflicts to resolve:
- Resolution:

## 3. Findings

- Spellbook (levels, orphans, floor gaps, duplicates):
- Resource loop vs spells:
- Talent trees (validator status, wiring, rank quality):
- Resource bar tooltip/menu vs class data:
- Lore/vocabulary:

## 4. Change list (kill your darlings)

| Item | Action (cut/merge/retheme/keep/fix/add) | Rationale | Status |
|---|---|---|---|

## 5. Evidence

- `npm run audit:classes -- --class <Name>`:
- `npm run validate:classes`:
- `npm run validate:talent-trees`:
- Jest:
- Playwright (bar/tooltip/menu):
- Daniel review:

## 6. Mind memory

- Memory name(s):
```

## Definition of done per class

See §6 of `docs/CLASS_DESIGN_CHARTER.md`. A sheet is not complete until the rubric is
>= 24/30, the audit script shows no integrity errors, and the resource bar tooltip/menu has
been visually verified.
