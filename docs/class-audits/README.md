# Class Audit Sheets — Template & Index

> One sheet per class: `docs/class-audits/<class-name>.md`. Produced during the Phase 2 deep
> dives per `docs/CLASS_DESIGN_CHARTER.md`. Phase 1 pilots calibrate this template.

## Index

| Class | Sheet | Deep-dive status | Review |
|---|---|---|---|
| Arcanoneer | [arcanoneer.md](arcanoneer.md) | implemented — awaiting review | Daniel |
| Berserker | [berserker.md](berserker.md) | implemented — awaiting review | Daniel |
| Shaper | [shaper.md](shaper.md) | implemented — awaiting review | Daniel |
| Harbinger | [harbinger.md](harbinger.md) | implemented — awaiting review | Daniel |
| Chronarch | [chronarch.md](chronarch.md) | implemented — awaiting review | Daniel |
| Inquisitor | [inquisitor.md](inquisitor.md) | implemented — awaiting review | Daniel |
| Revenant | [revenant.md](revenant.md) | implemented — awaiting review | Daniel |
| False Prophet | [false_prophet.md](false_prophet.md) | implemented — awaiting review | Daniel |
| Gambit | [gambit.md](gambit.md) | implemented — awaiting review | Daniel |
| Apex | [apex.md](apex.md) | implemented — awaiting review | Daniel |
| Animist | [animist.md](animist.md) | implemented — awaiting review | Daniel |
| Lunarch | [lunarch.md](lunarch.md) | implemented — awaiting review | Daniel |
| Martyr | [martyr.md](martyr.md) | implemented — awaiting review | Daniel |
| Minstrel | [minstrel.md](minstrel.md) | implemented — awaiting review | Daniel |
| Plaguebringer | [plaguebringer.md](plaguebringer.md) | implemented — awaiting review | Daniel |
| Pyrofiend | [pyrofiend.md](pyrofiend.md) | implemented — awaiting review | Daniel |
| Spellguard | [spellguard.md](spellguard.md) | implemented — awaiting review | Daniel |
| Toxicologist | [toxicologist.md](toxicologist.md) | implemented — awaiting review | Daniel |
| Warden | [warden.md](warden.md) | implemented — awaiting review | Daniel |
| Augur | [augur.md](augur.md) | implemented — awaiting review | Daniel |
| Crusader | [crusader.md](crusader.md) | implemented — awaiting review | Daniel |

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
