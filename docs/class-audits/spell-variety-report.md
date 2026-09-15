# Spell Variety & Originality Report

> Tool: `scripts/audit-spell-variety.mjs` (advisory). It computes a per-spell **signature**
> (effect types + targeting/range + damage types + mechanic flags: dot/chain/save/crit/
> heal/shield/buff/debuff/control/utility/trigger/class-resource), then flags:
> - **upgrade traps** — same signature, later spell is a bigger-dice version of an earlier one
> - **signature twins** — groups of spells sharing a signature (potential redundancy)
> - **pure-damage filler** — spells with no rider of any kind
> - **cross-class name collisions**
>
> Policy (per Daniel): a higher-level spell must never be a strict upgrade of an earlier pick.
> Later spells must change the decision: delivery/targeting, effect composition, risk/cost,
> timing, or a named rider. Ids and levels stay stable; pools keep resolving.

## Headline findings (2026-09-14)

| Class | Spells | Pure damage | Twin groups | **Upgrade traps** |
|---|---|---|---|---|
| Harbinger | 44 | 7 (16%) | 3 | **0** (was 6) |
| Augur | 38 | 2 (5%) | 4 | **0** (was 3) |
| Apex | 46 | 11 (24%) | 4 | **0** (was 2) |
| Plaguebringer | 41 | 3 (7%) | 5 | **0** (was 2) |
| Inquisitor | 28 | 0 (0%) | 0 | **0** (was 1) |
| Gambit | 64 | 11 (17%) | 5 | **0** (was 1) |
| Minstrel | 46 | 8 (17%) | 10 | 0 |
| Pyrofiend | 42 | 11 (26%) | 8 | 0 |
| Chronarch | 42 | 0 (0%) | 7 | 0 |
| Shaper | 47 | 4 (9%) | 6 | 0 |
| Berserker | 33 | 2 (6%) | 5 | 0 |
| False Prophet | 44 | 2 (5%) | 5 | 0 |
| Warden | 37 | 3 (8%) | 5 | 0 |
| Toxicologist | 40 | 5 (13%) | 4 | 0 |
| Lunarch | 28 | 1 (4%) | 4 | 0 |
| Revenant | 26 | 1 (4%) | 3 | 0 |
| Martyr | 38 | 1 (3%) | 3 | 0 |
| Animist | 40 | 6 (15%) | 2 | 0 |
| Arcanoneer | 35 | 9 (26%) | 1 | 0 |
| Spellguard | 32 | 1 (3%) | 0 | 0 |
| Crusader | 27 | 2 (7%) | 0 | 0 |

## Tier 1 — Upgrade traps — RESOLVED 2026-09-14 (0 remaining)

**Harbinger** — the prophecy ladder became four different decisions: Execution Prophecy (single-target execute window, cheap), Prophecy of Annihilation (area doom zone that feeds Mayhem), Requiem Absolute (consumes all active prophecies, backlash + Mayhem reset), Final Requiem (once-per-combat ultimate that spends ALL Mayhem, self-recoil).
**Augur** — split by ledger side: Hallowed Consecration (Benediction ward) vs Desolate Bog (Malediction terrain); Unblinking Gaze (cheap no-save mark) vs Ruinous Fate Hex (committed curse with Omen Debt rider); Dirge of the Unmade (AoE pulse) vs Wounded World Portent (single-target fate severance that denies healing/teleport).
**Apex** — Swift Assault became the Quarry mark-builder/gap-closer; Razor Dance the Marks-consuming whirlwind. Coordinated Assault is now the companion-synergy strike; Shadow Strike the stealth-window burst. Five pure-damage spells gained chase hooks (mark pin, shadow slip, companion harry, execute+reposition, truesight window) — pure-damage ratio 37% → 24%.
**Plaguebringer** — Mark of the Pestilent is the single-host seed; Ultimate Affliction the harvest finisher that consumes cultivated stages. Plague of Flies spreads between hosts; Decay Field denies terrain.
**Inquisitor** — Scourge of Submission nullifies the next supernatural ability (feed Dominance Die); Shackles of Searing Iron restrains and burns.
**Gambit** — Dice Dart banks Fortune; Taunt the Odds is the wager strike (spend Fortune or take Debt, called-number d20).

### Harbinger — the prophecy ladder (6 traps, one family)
`Execution Prophecy (L6)`, `Prophecy of Annihilation (L7)`, `Requiem Absolute (L9)`,
`Final Requiem (L10)` share one signature and differ only by dice (44 → 52 → 97.5 → 130).
Fix: give each prophecy a different *shape* — execute window / area doom zone / delayed
consumption payoff / ultimate Mayhem sink — so choosing between them is a real decision.

### Augur (3 traps)
- `Hallowed Consecration (L2)` → `Desolate Bog of Ruin (L5)` (3.5 → 10.5)
- `Unblinking Gaze (L3)` → `Ruinous Fate Hex (L4)` (10.5 → 18)
- `Dirge of the Unmade (L7)` → `Wounded World Portent (L9)` (27 → 36)
Fix: differentiate by omen interplay (benediction ward vs malediction rot), targeting, and rider.

### Apex (2 traps + 37% pure damage)
- `Swift Assault (L3)` → `Razor Dance (L5)` (4.5 → 13.5)
- `Coordinated Assault (L3)` → `Shadow Strike (L3)` (9 → 13.5)
Fix: express the chase (mobility, marks, companion commands, stealth windows) instead of
dice ladders; add hooks to the pure-damage filler.

### Plaguebringer (2 traps)
- `Mark of the Pestilent (L2)` → `Ultimate Affliction (L10)` (9 → 82.5)
- `Plague of Flies (L4)` → `Decay Field (L7)` (5 → 22.5)
Fix: propagation identity — incubation stages, host spreading, harvest payoff — not raw dice.

### Inquisitor (1 trap) / Gambit (1 trap)
- `Scourge of Submission (L2)` → `Shackles of Searing Iron (L4)` (3.5 → 7)
- `Dice Dart (L1)` → `Taunt the Odds (L3)` (4.5 → 16.5)
Fix: Inquisitor = nullify vs execute decisions; Gambit = wager/fortune spend vs raw damage.

## Tier 2 — Pure-damage filler hotspots
Apex 37%, Arcanoneer 26%, Pyrofiend 26%, Harbinger 25%, Gambit 17%, Minstrel 17%.
Every pure-damage spell must earn its slot with a hook (resource interaction, targeting
shape, rider, risk) — prioritize during the spell-floor program.

## Tier 3 — Signature-twin hotspots (review, not automatically wrong)
Minstrel 10, Pyrofiend 8, Chronarch 7, Apex 7, Plaguebringer 7. Twins are acceptable when
the decision texture differs (cost, timing, target profile); review during each class's
deep dive.

## Fix log

| Date | Scope | Result |
|---|---|---|
| 2026-09-14 | Tier 1 trap wave (Harbinger, Augur, Apex, Plaguebringer, Inquisitor, Gambit) | **done — 0 upgrade traps across all 21 classes**; pure-damage hotspots reduced (Apex 37→24%, Harbinger 25→16%); all validators/QA green |
| next | Tier 2 filler hooks (Arcanoneer 26%, Pyrofiend 26%, Gambit 17%, Minstrel 17%) and Tier 3 twin review as part of the spell-floor program | queued |
