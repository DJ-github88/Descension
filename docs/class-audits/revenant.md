# Revenant — Deep Dive

- Date: 2026-09-14
- Auditor: Phase 2 Remainder cluster (spell-floor + talent audit, validated)
- Status: **implemented — awaiting Daniel review**

## 1. Scores (0–3 per dimension; target >= 24/30, no dimension <= 1)

| # | Dimension | Score | Evidence |
|---|---|---|---|
| 1 | Identity & fantasy | 3 | Tragic unliving host who refuses death due to lingering obligation: Clean Vreken ancestral voice-keepers, Marked Vreken ghost-mycelium network-stasis, Drun Nethien debt-bound survival, and Tessen bloodline perpetuity |
| 2 | Group function & exclusive utility | 3 | Relentless frontline attrition, life-force buffering, and necrotic battlefield control: phylactery-buffered survivability, death-sense tracking, corpse animation, bone cage confinement, and underworld banishment |
| 3 | Resource loop design | 3 | Dual Mana/HP + Death-Toll engine with Phylactery Integrity buffer: casting spells sacrifices personal vitality or spends accumulated Toll; high Toll unleashes devastating necromantic harvests and avatar ascensions |
| 4 | Spell-curve quality | 3 | 45 authored spells; 0 pool-floor gaps across all levels 1–10 (L1: 6\|6, L2: 6\|6, L3: 4\|3, L4: 4\|3, L5: 4\|3, L6: 4\|3, L7: 4\|2, L8: 4\|4, L9: 4\|2, L10: 4\|4) |
| 5 | Utility identity per level | 3 | Deep mortuary investigation and necromantic utility: corpse walking through ash, petitioning the freshly slain, tasting blood to read memories and poisons, and sensing nearby deaths |
| 6 | Combat decision density | 3 | High round-to-round tactical tension: balancing personal health sacrifices with incoming damage, monitoring phylactery integrity, and timing burst Toll releases |
| 7 | Talent-tree integration | 3 | Three complete 50-pt trees; 0 validator errors, 0 warnings; all icons verified local assets; 0 free-cast ACTIVE talents |
| 8 | UI expression | 2 | Death-Toll gauge and phylactery integrity tracking queued |
| 9 | Anti-overlap distance | 3 | Distinct from Martyr (willing sacrifice for party) and Plaguebringer (biological blights): Revenant is an unliving entity bound to a physical/mycelial phylactery, utilizing cryogenic permafrost and necromantic death-magic |
| 10 | Beginner legibility | 2 | Managing health sacrifice alongside Toll thresholds requires careful awareness of one's own survival margins |
| | **Total** | **28/30** | Exceeds charter target (>= 24/30) |

## 2. Utility Ledger row

- Primary / secondary role: Damage / Defense (Undying Attrition, Cryogenic Death & Necrotic Rites)
- Exclusive territory: **phylactery-buffered immortality & self-vitality sacrifice** — absorbing lethal blows through external soul caches, walking through corpse-ash, and harvesting enemy life-force into Death-Toll
- Conflicts to resolve: Martyr (sacrifice/redirection) and Plaguebringer (affliction/spread) overlap resolved; Revenant is the refusing-to-die revenant anchored to a phylactery
- Resolution: keep; anchor firmly in Vreken bog rites, Kora's veil-speakers, and Drun Nethien legal survival

## 3. Findings

### Talent trees
- All three trees are 18-node, 50-pt v2 valid trees.
- Validator: 3 valid / 0 invalid, 0 warnings.
- All talent icons verified local assets.
- 0 free-cast ACTIVE talents.

### Spellbook
- 45 total spells in `revenantData.js`.
- Spell floor completed: 18 new spells authored:
  - L3: `rv_bone_cage_prison` (blight damage + Restrained bone cage control)
  - L4: `rv_mycelial_shroud` (non-damage +4 DR + 2d6 regeneration buff)
  - L4: `rv_corpse_tendril_whip` (rime/blight damage + 20ft pull control)
  - L5: `rv_phylactery_tether` (non-damage 50% ally damage absorption via phylactery buffer)
  - L5: `rv_death_chill_lance` (rime/blight damage + black ice slip knockdown)
  - L6: `rv_spectral_paralysis` (non-damage tomb-rigidity paralysis control)
  - L6: `rv_corpse_puppet_march` (non-damage skeletal swarm Disadvantage control)
  - L6: `rv_rime_scythe_sweep` (rime/slicing sweeping cone damage)
  - L7: `rv_unhallowed_ground_sanctuary` (non-damage +5 DR + necrotic/rime immunity sanctuary)
  - L7: `rv_soul_siphon_vortex` (non-damage 30ft silence + 20% vulnerability vortex)
  - L8: `rv_undying_legion_call` (non-damage 60 temp HP cohort phalanx shield)
  - L8: `rv_glacial_entombment` (non-damage 2-round peat-ice stasis control)
  - L8: `rv_reapers_reap` (blight/slicing AoE harvest damage + 50% life drain)
  - L9: `rv_phylactery_transcendence` (non-damage spectral phantom form with 15 DR and free HP casting)
  - L9: `rv_absolute_banishment` (underworld banishment for 2 rounds + 12d8 damage on return)
  - L9: `rv_black_sun_apocalypse` (14d8 blight/rime black permafrost meteorite damage)
  - L10: `rv_world_crypt_domain` (non-damage 80ft domain with +8 DR, auto-revive at 50% HP, and phylactery recharge)
  - L10: `rv_the_final_harvest` (20d10 blight/rime encounter-wide reap + permanent execution below 10% HP)
- Pool map: L1 (6\|6), L2 (6\|6), L3 (4\|3), L4 (4\|3), L5 (4\|3), L6 (4\|3), L7 (4\|2), L8 (4\|4), L9 (4\|2), L10 (4\|4).
- 0 pool-floor gaps, 0 warnings.

### Resource / data
- Primary class resources: `toll` (Death-Toll) and `phylactery_integrity`.
- Damage types: canonical `blight`, `rime`, `wyrd`, `slicing`.

## 4. Change list

| Item | Action | Rationale | Status |
|---|---|---|---|
| Spell-floor program | authored 18 spells (L3–L10) | Charter requirement (>=4 options, >=2 non-damage) | done |
| Spell-pool expansion | defined full 1–10 pools | Full level-up pick pool clarity | done |
| Slicing normalization | replaced `slashing` with `slicing` | Canonical physical damage type consistency | done |
| Free-cast ACTIVE talents | verified resource costs | Resource loop integrity | done |
| Legacy icons | verified local assets | Asset localization | done |

## 5. Evidence

- `node scripts/audit-classes.mjs --class Revenant`: 0 integrity errors, 0 pool-floor gaps, 0 warnings.
- `npm run validate:talent-trees`: 65 valid / 0 invalid, 0 warnings.
- `npm run audit:damage-types`: 0 non-canonical errors.
- `npm run audit:spell-variety`: 0 upgrade traps.

## 6. Mind memory

- `revenant-deep-dive-2026-09-14`, `class-deep-dive-policies-2026-09-13`
