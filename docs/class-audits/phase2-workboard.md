# Phase 2 Workboard — All 21 Classes

> Started 2026-09-13 after Phase 1 pilots (Berserker, Lunarch, Apex, Warden).
> Sources: `talentTreeValidator` (53 files / **65 valid / 0 invalid**), `scripts/audit-classes.mjs`, tree icon scan.
> Update this file as workstreams complete.

## Status snapshot

| Metric | Value |
|---|---|
| Talent trees valid | **65 / 65** (0 invalid, 0 legacy) |
| Repo integrity errors (audit) | 0 |
| Pool-floor gaps (>=4 options / >=2 non-damage) | 187 |
| Validator warnings | 142 ranks = 116 free-cast + 26 rank-clones |
| Legacy icons still falling back to runes | ~700 occurrences across 40+ tree files |
| Spec-name drift | cleared for Berserker / Lunarch / Apex / Warden; remaining classes TBD per audit |
| Free-cast ACTIVE talents (audit, by node) | 50 across 4 classes (Toxicologist 20, Pyrofiend 19, Martyr 9, Gambit 2) |

## Workstreams

### A. Icon sweep (mechanical, parallelizable) — IN PROGRESS
Replace every legacy `ability_*` / `spell_*` icon with verified local assets under `public/assets/icons/abilities/<Category>/<Name>.png`. Per class unit, validator must stay 0/0.

| Unit | Files | Icons |
|---|---|---|
| Gambit + Harbinger | gambit.js, harbinger.js | 69 + 31 |
| Animist + Chronarch | animist.js, chronarch.js | 34 + 30 |
| Spellguard + Shaper | 6 spec files | 73 + 38 |
| Pyrofiend + Martyr | 6 spec files | 54 + 54 |
| Remaining (next wave) | Arcanoneer 35, Augur 46, False Prophet 35, Inquisitor 43, Minstrel 33, Plaguebringer 30, Revenant 21, Toxicologist 42, Warden 28, Crusader 2 | ~315 |

### B. Free-cast sweep (resource-loop tuning)
Give every ACTIVE talent a resource cost keyed to its class resource (rage/resonance/spheres/madness/fortune/devotion/vengeance/tension/notes/marks/etc.), mapping spend vs generate per the spell text (negative baseAmount = generation).

- Toxicologist 20 nodes (Gadgeteer/Venomancer/Saboteur) — vials/parts keys
- Pyrofiend 19 nodes (Inferno/Wildfire/Hellfire) — veil key
- Martyr 9 nodes (Redemption/Zealot/Ascetic; Ironclad fixed) — devotion key
- Gambit 2 nodes (High Roller/Probability Savant) — fortune key

### C. Rank-clone sweep (authoring, 26 nodes)
Hand-tune rank upgrades that resolve identically (mostly T7 doctrines). Node list:
`aw_t3_elemental_ward, cc_t7_war_conductor, cu_t7_liturgy_of_depletion, dc_t7_silver_tongue, dh_t7_peat_heart, dp_t7_displacement_doctrine, ds_t7_deaths_seer_doctrine, fm_t7_flow_doctrine, fr_t7_fate_rift_doctrine, fs_t7_frost_sovereign_doctrine, hw_t7_sacred_choir, id_t7_calcified_edge, mm_t7_dissonance_doctrine, pa_t7_phylactery_doctrine, pm_t7_pure_doctrine, rw_t7_rewind_doctrine, sb_t7_mirror_mastery, sb_t7_spirit_doctrine, sh_t7_sanguine_doctrine, ss_t7_stormscribe_doctrine, st_t7_stasis_doctrine, tw_t7_agony_doctrine, tw_t7_thornwarden_doctrine, vs_t7_waste_spore_doctrine, wp_t7_wild_prophet_doctrine`

### D. Spell-floor content program (the big one)
Every class must offer >=4 options and >=2 non-damage at levels 1–10. Current gap = 187 entries across 21 classes. Needs ~150 new spells total, authored per class deep dive with:
- one utility/control/defense/support option minimum per level,
- class-resource interaction in every spell,
- canonical vocabulary (12 damage types, durability dice, 5 attributes),
- `mechanicsText` overrides on all buff/debuff effects.

### E. Per-class identity deep dives (overlap-cluster order)
Cluster order from `overlap-matrix.md`:
1. **C1 cap-pressure** — Berserker [done], Lunarch [done], **Harbinger, Pyrofiend, Spellguard, Chronarch** (differentiate failure shapes + agency axes)
2. **C2 mark/tether** — Apex [done], Warden [done; C2 locked: chase vs cage]
3. **C3 probability** — Augur, Gambit
4. **C4 affliction** — Plaguebringer, Toxicologist
5. **C5 anti-magic** — Inquisitor, Spellguard (overlaps C1)
6. **C6 sacrifice/redirect** — Martyr, Crusader, False Prophet
7. **Remainder** — Animist, Arcanoneer, Minstrel, Revenant, Shaper, Inquisitor + any unvisited

Each deep dive: audit sheet (`docs/class-audits/<class>.md`), kill-darlings change list, implement, validate, memory, Daniel review.

## Queued pilot follow-ups (from Phase 1 sheets)

- Berserker: ~10 spells (incl. non-damage L5/L7)
- Lunarch: ~16 spells; phase agency (manual shift cost); phase theme drift config vs data; 3 weakness picks at L1
- Apex: ~8 spells; 2 weakness picks; companion-as-information identity pass
- Warden: ~10 spells (L6 has 0 non-damage); `warden_glaive_mastery` pick; empty `classResources` tooltip description

## Milestones

1. [x] All trees valid (65/0)
2. [ ] Icon sweep complete (0 legacy icons in `talentTrees/`)
3. [ ] Free-cast sweep complete (0 free-cast ACTIVE talents)
4. [ ] Rank-clone sweep complete (0 identical-rank warnings)
5. [ ] Spell-floor program complete (0 pool-floor gaps)
6. [ ] All 21 audit sheets + Daniel review
