# 21-Class Overlap Matrix — Baseline (2026-09-13)

> Companion to `docs/CLASS_DESIGN_CHARTER.md`. Built from the verified Phase 0 audit
> (mind: `class-system-audit-snapshot-2026-09-13`). Update this file as pairs are resolved
> in Phase 1/2 deep dives.

## Method

Pairs are flagged when two classes share the same **decision texture** (how a round feels),
not merely the same damage type or role. Each flagged pair gets a differentiation direction.
Status: `open` -> `pilot` -> `resolved`.

## Cluster map

### C1 — Cap-pressure / self-fueling resources (6 classes)

| Class | Failure shape at/near cap | Agency axis | Unique verb to protect |
|---|---|---|---|
| Berserker | Burnout at 100 + starvation at 0 | Dual pressure: fight to stay fed, vent before eruption | Pain-fueled sustain; aggression as upkeep |
| Harbinger | Mayhem 100 = Wild Surge (d100 table) | Scheduled: plant prophecies, then detonate | Delayed doom, probability rewrite |
| Pyrofiend | Veil 9 = 3-turn death clock, debt carries on death | Irreversible escalation, no reset | Permanent heat debt |
| Spellguard | Meltdown at 100 (AoE that hits allies too) | Absorption economy, +50% physical vulnerability | Intercept-and-vent energy |
| Chronarch | Strain 10 = forced phase-out (loss of agency) | Two-track: Shards (spend) vs Strain (bleed off) | Time banking / undo |
| Lunarch | Involuntary phase shift every 3 rounds | No opt-out; phase changes your toolkit | Forced celestial cycle |

**Decision:** keep all six, but no two may share the "vent before cap" verb. Every failure
state must differ on two axes: (a) who it hurts (self / allies / area / timeline), (b) who
chooses (player vent vs forced event). Verify per class in Phase 2 cluster order.

### C2 — Mark/tether execution (Apex vs Warden) — status: Apex reviewed, Warden pending

| Shared texture | Apex differentiation | Warden differentiation |
|---|---|---|
| Designate one enemy, build resource, execute | The chase: Quarry read across terrain, companion scouting, fog ambush, reach; the mark is chosen across space | The cage: 15 ft leash, drag/position, lockdown; the mark is pinned in place |

Decision (set in the Apex pilot): Apex owns *the chase* (information, mobility, companion); Warden owns *the cage*
(lockdown, forced duel, repositioning). Neither may buy the other's signature. Verify in the Warden pilot.

### C3 — d20 probability meta (Augur vs Gambit) — status: open

| Shared texture | Augur | Gambit |
|---|---|---|
| Manipulate d20 outcomes | Reads actual rolls (even/odd ledger), reactive intercepts, debt from hoarding | Wagers: fate deck, Fortune/Karmic Debt, proactive manipulation, calamity at debt cap |

Decision: Augur = the ledger that records fate; Gambit = the hand that cheats it.

### C4 — Affliction stacking (Plaguebringer vs Toxicologist) — status: open

| Shared texture | Plaguebringer | Toxicologist |
|---|---|---|
| Stacking damage-over-time identity | Living disease cultivated on hosts; spreads, evolves, harvest at peak | Prepared alchemy: vials, coatings, contraptions, traps; bench crafting between fights |

Decision: PB = propagation (it grows on them); Toxi = preparation (it was built before).
Resolve duplicate spell name `Pandemic`.

### C5 — Anti-magic nullification (Inquisitor vs Spellguard) — status: open

| Shared texture | Inquisitor | Spellguard |
|---|---|---|
| Shut down hostile magic | Cold-iron arbitration: nullify entities/contracts, execute the supernatural | Absorption reactor: intercept energy, bank it, vent or redirect it |

Decision: Inquisitor nullifies *actors and pacts*; Spellguard manages *energy*. Resolve
duplicate `Null Field`.

### C6 — Sacrifice/redirect (Martyr, Crusader, False Prophet) — status: open

| Class | Direction | Signature |
|---|---|---|
| Martyr | Ally pain -> self -> protection | Damage interception and conversion |
| Crusader | Front-line engagement -> shared bar -> burst/judgment | Consecrated territory + solar judgment |
| False Prophet | Enemy-facing redirection through manufactured congregation | Empathetic links as offense, madness scaling |

Decision: Martyr absorbs (ally-facing, defensive economy); Crusader leads (both economies in
one bar, offense-forward); False Prophet redirects (enemy-facing, control).

## Cross-class duplicate names to resolve

| Name | Conflicts | Resolution direction |
|---|---|---|
| Judgment Day | Inquisitor L8, Martyr L9, Revenant L8 | Rename/retheme per class; keep at most one |
| Pandemic | Plaguebringer L7, Toxicologist L8 | Distinct mechanics or one renamed |
| Null Field | Inquisitor, Spellguard | Split: entity-null vs energy-null; rename one |
| Chaos Bolt | multiple | Audit in phase 2; keep strongest flavor fit |
| Dimensional Rift | multiple | Same |
| Primal Cataclysm | multiple | Same |
| Phase Shift | multiple | Same |
| Bone-Reading | Animist/Shaper (name) | Rename one |

## Minor watchlist

- **Minstrel note-bank vs Arcanoneer sphere-bank** — collection currencies, but collection
  verbs differ (musical cadences vs rolled elemental blocks). Keep; verify in Phase 2.
- **Shaper form matrix vs Berserker stance toggles** — Shaper morphs the toolkit; Berserker
  toggles temper the same toolkit. Keep unless Phase 2 finds identical decisions.

## Maintenance

- Update status when a pair is resolved in a deep dive; link the class audit sheet.
- Add new rows when the audit script or a deep dive surfaces an overlap.
- Full 21×21 numeric scoring lands in each class's audit sheet; this file is the keep/resolve ledger.
