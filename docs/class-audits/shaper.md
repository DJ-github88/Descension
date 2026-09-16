# Shaper — Deep Dive

- Date: 2026-09-14
- Auditor: Phase 2 Remainder cluster (spell-floor + talent audit, validated)
- Status: **implemented — awaiting Daniel review**

## 1. Scores (0–3 per dimension; target >= 24/30, no dimension <= 1)

| # | Dimension | Score | Evidence |
|---|---|---|---|
| 1 | Identity & fantasy | 3 | Visceral biological form-shifter: Arch Mimir mask-anchored form stability, Fractured Mimir vigil surveillance forms, Groven flesh-sculpting alchemy, and Marked Vreken mycelial networks; transitioning fluidly between combat stances |
| 2 | Group function & exclusive utility | 3 | Dynamic frontliner, kinetic redirector, and adaptive survivor: switching between fluid stances (Ataxic Flow, Arterial Strike, Centrifugal Fury, Deadened Bastion, Silence Predator), growing environmental adaptations (gills, dark-sight, wall claws), and kinetic dispersion barriers |
| 3 | Resource loop design | 3 | Flux engine (base 0, max 20) with Body Toll: generating Flux through attacks, movement, and kinetic deflection; spending Flux on explosive biological mutations, stances, and titan apotheosis |
| 4 | Spell-curve quality | 3 | 47 authored spells; 0 pool-floor gaps across all levels 1–10 (L1: 14\|11, L2: 8\|7, L3: 4\|2, L4: 4\|3, L5: 4\|3, L6: 4\|3, L7: 4\|4, L8: 4\|3, L9: 4\|4, L10: 4\|4) |
| 5 | Utility identity per level | 3 | Superb physiological exploration utility: anatomical mimicry, kinetic gliding, wall-climbing claws, water-striding surface tension, flesh masks, bone-reading psychometry, and adaptive organ growth |
| 6 | Combat decision density | 3 | Very high tactical flexibility: choosing which stance to flow into based on incoming threat types, balancing Body Toll against mobility bursts, and timing ultimate chimeric transformations |
| 7 | Talent-tree integration | 3 | Three complete 50-pt trees (Flow Master, Iron Dancer, Primal Shadow); 0 validator errors, 0 warnings; all icons verified local assets; 0 free-cast ACTIVE talents |
| 8 | UI expression | 2 | Flux resource gauge and active stance toggle indicator queued |
| 9 | Anti-overlap distance | 3 | Distinct from Apex (beast hunter) and Warden (nature bulwark): Shaper is the morphic biokinetic combatant altering their own physical anatomy on a cellular level |
| 10 | Beginner legibility | 3 | Stance system and form transitions provide an intuitive martial-arts flow with clear visual themes |
| | **Total** | **29/30** | Exceeds charter target (>= 24/30) |

## 2. Utility Ledger row

- Primary / secondary role: Damage / Defense (Biological Adaptation, Fluid Stances & Biokinetic Control)
- Exclusive territory: **live anatomical re-sculpting & multi-stance fluid transitions** — shifting between specialized biological postures, growing situational appendages, and absorbing kinetic energy into cellular Flux
- Conflicts to resolve: Apex (mark/tether) and Animist (ancestral spirit forms) overlap resolved; Shaper mutates their own living flesh rather than commanding companions or channelling ghosts
- Resolution: keep; anchor firmly in Mimir mask metaphysics, Groven vat-sculpting, and biological adaptability

## 3. Findings

### Talent trees
- All three trees are 18-node, 50-pt v2 valid trees.
- Validator: 3 valid / 0 invalid, 0 warnings.
- All talent icons verified local assets.
- 0 free-cast ACTIVE talents.

### Spellbook
- 47 total spells in `shaperData.js`.
- Integrated all 11 missing authored stance/utility spells into `spellPools` (L1, L2, L3).
- Removed passive `shaper_myotatic_reflex` from pick pools.
- Spell floor completed: 9 new spells authored:
  - L6: `shaper_hypertrophic_surge` (smashing melee slam damage + Fortitude knockdown)
  - L7: `shaper_calcified_carapace_stance` (non-damage +6 DR + Flux generation when struck)
  - L7: `shaper_neural_mycelium_link` (non-damage +4 DR ally buff + mirrored healing symbiosis)
  - L8: `shaper_kinetic_dispersion_field` (non-damage 50% party AoE damage reduction)
  - L9: `shaper_chimeric_regeneration` (non-damage 10d8 heal + full debuff cleanse + +5 DR)
  - L9: `shaper_predatory_singularity` (12d8 multi-target slicing/primal damage + bleed)
  - L10: `shaper_convergence_avatar` (non-damage shifting titan transformation with +8 DR and 50 temp HP)
  - L10: `shaper_biomorphic_cataclysm` (18d10 smashing/slicing 60ft burst + Fortitude knockdown)
  - L10: `shaper_primordial_cocoon` (non-damage complete party invulnerability for 1 round + 40 HP emergence heal)
- Pool map: L1 (14\|11), L2 (8\|7), L3 (4\|2), L4 (4\|3), L5 (4\|3), L6 (4\|3), L7 (4\|4), L8 (4\|3), L9 (4\|4), L10 (4\|4).
- 0 pool-floor gaps, 0 warnings.

### Resource / data
- Primary class resources: `flux` and `body_toll`.
- Damage types: canonical `smashing`, `stabbing`, `slicing`, `blight`, `primal`, `wyrd`.

## 4. Change list

| Item | Action | Rationale | Status |
|---|---|---|---|
| Spell-floor program | authored 9 spells (L6–L10) | Charter requirement (>=4 options, >=2 non-damage) | done |
| Stance integration | added 11 authored stances/utility spells to pools | Full pool availability for all authored actions | done |
| Passive removal | removed `shaper_myotatic_reflex` from L7 pool | Level-up pick pool clean of non-stance passives | done |
| Free-cast ACTIVE talents | verified resource costs | Resource loop integrity | done |
| Legacy icons | verified local assets | Asset localization | done |

## 5. Evidence

- `node scripts/audit-classes.mjs --class Shaper`: 0 integrity errors, 0 pool-floor gaps, 0 warnings.
- `npm run validate:talent-trees`: 65 valid / 0 invalid, 0 warnings.
- `npm run audit:damage-types`: 0 non-canonical errors.
- `npm run audit:spell-variety`: 0 upgrade traps.

## 6. Mind memory

- `shaper-deep-dive-2026-09-14`, `class-deep-dive-policies-2026-09-13`

## 7. Spell-level format & flavor pass — 2026-09-16

Tool: `scripts/spell-card-qa.mjs`. **Before: 19 flagged / 10 errors. After: 0 errors / 0 non-verbosity
warnings.**

### Fixed (card-breaking)

| Spell | Issue | Fix |
|---|---|---|
| `shaper_anatomical_mimicry` | `utility` with no config | added biological-disguise utilityConfig |
| `shaper_kinetic_glide` | `utility` with no config | added fall/glide movement utilityConfig |
| `shaper_reactive_parry` | `buff` with no stats | added +4 Active Soak parry buffConfig |
| `shaper_wall_claws` | no `effectTypes` | added `utility` + wall-climb utilityConfig |
| `shaper_water_stride` | no `effectTypes` | added `utility` + liquid-stride utilityConfig |
| `shaper_arterial_siphon` | `utility` with no config | added Body-Toll siphon utilityConfig |
| `shaper_ataxic_maelstrom` | `utility` with no config | added dash-strike utilityConfig |
| `shaper_convergence_avatar` | `buff` with no stats, thin transformation | added Titan Morphology buffConfig + `formName`/target on transformationConfig |
| `shaper_primordial_cocoon` | buffConfig not gated | added `buff` to effectTypes |

### Flavor / class-fit notes

- Flux/Body-Toll economy reads consistently (`classResource:{type:"flux"}` + `bodyTollCost`);
  form-requirement keys (`formRequirement`) present on the stance-gated spells. No rethemes
  proposed.
- `shaper_structural_fragility` is a fatal-flaw passive in the L1 pool — already tracked in the
  class audit's pick-pool policy item.

### Evidence (this pass)

- `node scripts/spell-card-qa.mjs --dump Shaper`: 0 errors
- `audit:classes --class Shaper`: 0 integrity / 0 floor gaps / 0 warnings; `spell-qa` 0 issues
- Playwright card review: pending (Daniel)

### Pass 4 — 2026-09-16 (verbosity trim)

12 descriptions over 200 chars rewritten to ≤200, preserving every mechanic, number, and the class voice. Full global spell-card QA is now **0 errors / 0 warnings** across all 21 classes (1,026 spells).
