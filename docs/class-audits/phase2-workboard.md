# Phase 2 Workboard — All 21 Classes

> Started 2026-09-13 after Phase 1 pilots (Berserker, Lunarch, Apex, Warden).
> Sources: `talentTreeValidator` (53 files / **65 valid / 0 invalid**), `scripts/audit-classes.mjs`, tree icon scan.
> Update this file as workstreams complete.

## Status snapshot

| Metric | Value |
|---|---|
| Talent trees valid | **65 / 65** (0 invalid, 0 legacy) |
| Repo integrity errors (audit) | **0** across all 21 classes |
| Pool-floor gaps (>=4 options / >=2 non-damage) | **0** across all 21 classes (Spell-floor program COMPLETE: all 21 classes meet >=4 options and >=2 non-damage across L1–L10) |
| Validator warnings | **0** (all rank-clones tuned; all free-casts costed; 0 non-stance passives in pick pools) |
| Legacy icons (true icon fields) | **0** — all localized and verified |
| Damage-type artifacts | **0 errors** (`scripts/audit-damage-types.mjs`); review bucket only = card-suit domains |
| Spec-name drift | **0** across all 21 classes |
| Free-cast ACTIVE talents | **0 across 0 classes** (was 141/7 at the start of Phase 2) |

## Workstreams

### A. Icon sweep (mechanical, parallelizable) — DONE
Replace every legacy `ability_*` / `spell_*` icon with verified local assets under `public/assets/icons/abilities/<Category>/<Name>.png`. Per class unit, validator must stay 0/0.

| Unit | Status |
|---|---|
| Gambit + Harbinger | done (gambit verified already clean; harbinger 31 replaced) |
| Animist + Chronarch | done (65 replaced) |
| Spellguard + Shaper | done (4 `inv_*` replaced; rest already local) |
| Pyrofiend + Martyr | done (already localized; verified) |
| Final wave | done — arcanoneer, augur, falseprophet, inquisitor, minstrel, plaguebringer, revenant, warden, toxicologist trio, `minstrelData.js` |

### B. Free-cast sweep — DONE (0 remaining)
Every ACTIVE talent now carries a class-resource cost (spend positive / generate negative). Conventions for future authoring:

| Class | Cost key(s) |
|---|---|
| Berserker | `rage` (+ `health` for self-damage) |
| Lunarch | `mana`, `lunar_phase` |
| Warden | `vengeance` |
| Harbinger | `mayhem` |
| Pyrofiend | `veil` |
| Toxicologist | `vials`, `contraptions` |
| Martyr | `devotion` (+ `health`) |
| Gambit | `fortunePoints` (+ `health`) |
| Animist | `resonance` |
| Augur | `benediction`, `malediction` |
| Arcanoneer | `spheres`, `mana` |
| False Prophet | `madness`, `health` |
| Crusader | `mana` |

### C. Rank-clone sweep — DONE
All rank-upgrade clones hand-tuned (doctrine riders appended to the flagged rank only; spread cumulatively). Validator warnings: 0.

### F. Damage-type consistency — DONE (keep green)
Canonical 11: smashing, stabbing, slicing, ember, rime, storm, primal, arcane, blight, wyrd, sacred (+ healing restorative).
- New tool: `scripts/audit-damage-types.mjs` + `npm run audit:damage-types`. Scans mechanical fields across 1,192 files; 0 errors.
- Fixed: Berserker `school: "physical"` ×3 (→ primal/ember/smashing); universal combat 'social' ×2 (→ wyrd); custom lineage 'Tempest' (→ storm); Harbinger Chaos-Bolt `random_elemental` (→ `random` + `randomPool`); `spellDataValidator` auto-fix suggestions rewritten to canonical (were suggesting fire/cold/lightning/radiant/necrotic/poison/acid/psychic/force).
- Canon correction: `LEGACY_TYPE_MAP` shadow/necrotic/void/silence now → **wyrd** (were → blight), matching CLASS_AUDIT_STANDARDS (blight = rot/poison/acid; wyrd = otherworldly/necrotic/shadow/mind).
- Docs updated: `SPELL_DATA_REFERENCE.md` Rule 3 school list, `CLASS_AUDIT_STANDARDS.md` §C header.
- Open review item: card-suit element domains (`water`/`earth`/`air` in `cardSystem.js`, used by the card/deck mechanic) — decide migrate to rime/primal/storm or reframe as non-damage domains.

### D. Spell-floor content program (the big one)
Every class must offer >=4 options and >=2 non-damage at levels 1–10. Current gap = 187 entries across 21 classes. Needs ~150 new spells total, authored per class deep dive with:
- one utility/control/defense/support option minimum per level,
- class-resource interaction in every spell,
- canonical vocabulary (12 damage types, durability dice, 5 attributes),
- `mechanicsText` overrides on all buff/debuff effects.

### E. Per-class identity deep dives (overlap-cluster order)
Cluster order from `overlap-matrix.md`:
1. **C1 cap-pressure** — Berserker [done], Lunarch [done], Harbinger [done], Pyrofiend [done], Spellguard [done], Chronarch [done] (all 6 sheets & spell floors complete; differentiate failure shapes + agency axes)
2. **C2 mark/tether** — Apex [done], Warden [done; C2 locked: chase vs cage]
3. **C3 probability** — Augur [done], Gambit [done] (ledger-vs-wager; sheets & floors complete)
4. **C4 affliction** — Plaguebringer [done], Toxicologist [done] (propagation vs preparation; sheets & floors complete)
5. **C5 anti-magic** — Inquisitor [done], Spellguard [done] (punishment vs absorption; sheets & floors complete)
6. **C6 sacrifice/redirect** — Martyr [done], Crusader [done], False Prophet [done] (all 3 sheets & spell floors complete; 0 gaps, 0 warnings)
7. **Remainder** — Animist [done], Arcanoneer [done], Minstrel [done], Revenant [done], Shaper [done]

All 21 classes have completed their deep dives, audit sheets (`docs/class-audits/<class>.md`), and spell-floor builds.

## Pilot follow-ups (Phase 1 classes) — ALL COMPLETE

- Berserker: 14 new spells authored; spellPools 1–10 fully populated; 0 gaps, 0 warnings.
- Lunarch: 15 new spells authored; 3 L1 passives excluded from pool; 0 gaps, 0 warnings.
- Apex: 8 new spells authored; 2 passives excluded from pool; 0 gaps, 0 warnings.
- Warden: 9 new spells authored; 1 passive excluded from pool; 0 gaps, 0 warnings.

## Milestones

1. [x] All trees valid (65/0, 0 warnings)
2. [x] Icon sweep complete (0 legacy icons in `talentTrees/`)
3. [x] Free-cast sweep complete (0 free-cast ACTIVE talents)
4. [x] Rank-clone sweep complete (0 identical-rank warnings)
5. [x] Spell-floor program complete (0 pool-floor gaps across all 21 classes)
6. [x] All 21 audit sheets authored and indexed in `docs/class-audits/` (all 21 classes scoring 30/30)
