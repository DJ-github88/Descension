# Arcanoneer — Deep Dive

- Date: 2026-09-14
- Auditor: Phase 2 Remainder cluster (spell-floor + talent audit, validated)
- Status: **implemented — awaiting Daniel review**

## 1. Scores (0–3 per dimension; target >= 24/30, no dimension <= 1)

| # | Dimension | Score | Evidence |
|---|---|---|---|
| 1 | Identity & fantasy | 3 | Rigorous combinatorial spell-engineer inspired by high-stakes elemental syntax: Nethien contract-syntax under the Grand Nomenclature, Clockwork/Caustic Fexric proving-ground calibration, and Stargazer Astril cosmic starlight frequencies |
| 2 | Group function & exclusive utility | 3 | Modular elemental toolkit: mixing 2 to 5 elemental spheres on the fly to produce tailored damage types, area disruption, barrier reinforcement, dispels, and environmental manipulation |
| 3 | Resource loop design | 3 | Dual Mana + Elemental Spheres engine (base 0, max 12 banked): generating spheres via round dice / attunement and spending exact spherical formulas per spell; managing Sphere Exhaustion risk |
| 4 | Spell-curve quality | 3 | 46 authored spells; 0 pool-floor gaps across all levels 1–10 (L1: 6\|3, L2: 4\|4, L3: 4\|2, L4: 4\|3, L5: 4\|2, L6: 4\|3, L7: 4\|3, L8: 4\|3, L9: 4\|2, L10: 4\|4) |
| 5 | Utility identity per level | 3 | Deep non-combat elemental utility: aetheric lanterns, prismatic portals, thermodynamic atmospheric modulation, crystalline calibration, and environmental bridge crystallization |
| 6 | Combat decision density | 3 | High tactical variety: choosing sphere combinations based on enemy elemental resistances, optimizing action points between sphere generation and high-cost multisphere formulations |
| 7 | Talent-tree integration | 3 | Three complete 50-pt trees (Entropy Weaver, Prism Mage, Sphere Architect); 0 validator errors, 0 warnings; all icons verified local assets; 0 free-cast ACTIVE talents |
| 8 | UI expression | 3 | Distinctive formulation-to-spell builder component and elemental sphere orbit tracker |
| 9 | Anti-overlap distance | 3 | Cleanly isolated mechanical territory: no other class uses live elemental sphere synthesis or formula-based clause syntax |
| 10 | Beginner legibility | 2 | Combining spheres dynamically requires mental math and recipe familiarity, but core spells provide strong straightforward baselines |
| | **Total** | **28/30** | Exceeds charter target (>= 24/30) |

## 2. Utility Ledger row

- Primary / secondary role: Damage / Control (Combinatorial Elemental Engineering & Battlefield Shaping)
- Exclusive territory: **live elemental sphere synthesis & formula-based spellcrafting** — combining fire, frost, storm, earth, sacred, void, and arcane spheres into tailored compound effects
- Conflicts to resolve: Pyrofiend (fire/veil cap) and Spellguard (arcane counter-magic) overlap resolved; Arcanoneer is the versatile combinatorial scientist, not the volatile demon or the anti-magic tank
- Resolution: keep; anchor firmly in the Grand Nomenclature, contractual syntax, and Fexric precision engineering

## 3. Findings

### Talent trees
- All three trees are 18-node, 50-pt v2 valid trees.
- Validator: 3 valid / 0 invalid, 0 warnings.
- All talent icons verified local assets.
- 0 free-cast ACTIVE talents.

### Spellbook
- 46 total spells in `arcanoneerData.js`.
- Normalized `arc_divine_healing` effectTypes from `["defensive"]` to canonical `["defense", "buff"]`.
- Added authored utility `arc_prismatic_portal` into `spellPools[6]`.
- Spell floor completed: 8 new spells authored:
  - L2: `arc_concussive_resonance` (storm/arcane damage + Fortitude silence control)
  - L3: `arc_galvanic_overload` (storm/ember plasma burst damage)
  - L4: `arc_cryogenic_crystallization` (non-damage permafrost root control + 25% physical vulnerability)
  - L5: `arc_mnemonic_matrix_ward` (non-damage 30 temp HP ward + 2 sphere refund on strike)
  - L7: `arc_prismatic_resonance_field` (harmonic refraction +4 DR buff + enemy backlash damage)
  - L8: `arc_null_compression_barrier` (non-damage 50% damage reduction gravity barrier)
  - L9: `arc_aether_nullification_lattice` (non-damage mass buff dispel + 40ft silence zone)
  - L10: `arc_singularity_collapse` (primal/arcane gravitational pull + 16d10 damage + stun)
- Pool map: L1 (6\|3), L2 (4\|4), L3 (4\|2), L4 (4\|3), L5 (4\|2), L6 (4\|3), L7 (4\|3), L8 (4\|3), L9 (4\|2), L10 (4\|4).
- 0 pool-floor gaps, 0 warnings.

### Resource / data
- Primary class resources: `mana` and `elemental_spheres`.
- Damage types: canonical `arcane`, `ember`, `rime`, `storm`, `blight`, `primal`, `sacred`.

## 4. Change list

| Item | Action | Rationale | Status |
|---|---|---|---|
| Spell-floor program | authored 8 spells (L2, L3, L4, L5, L7, L8, L9, L10) | Charter requirement (>=4 options, >=2 non-damage) | done |
| Spell-pool integration | included `arc_prismatic_portal` in L6 pool | Missing authored spell | done |
| Classification fix | normalized `arc_divine_healing` to `defense`, `buff` | Canonical non-damage classification | done |
| Free-cast ACTIVE talents | verified sphere and mana costs | Resource loop integrity | done |
| Legacy icons | verified local assets | Asset localization | done |

## 5. Evidence

- `node scripts/audit-classes.mjs --class Arcanoneer`: 0 integrity errors, 0 pool-floor gaps, 0 warnings.
- `npm run validate:talent-trees`: 65 valid / 0 invalid, 0 warnings.
- `npm run audit:damage-types`: 0 non-canonical errors.
- `npm run audit:spell-variety`: 0 upgrade traps.

## 6. Mind memory

- `arcanoneer-deep-dive-2026-09-14`, `class-deep-dive-policies-2026-09-13`
