# Toxicologist — Deep Dive

- Date: 2026-09-14
- Auditor: Phase 2 C4 cluster (spell-floor + talent audit, validated)
- Status: **implemented — awaiting Daniel review**

## 1. Scores (0–3 per dimension; target >= 24/30, no dimension <= 1)

| # | Dimension | Score | Evidence |
|---|---|---|---|
| 1 | Identity & fantasy | 3 | Pragmatic craftsman-chemist and trap engineer: distills fog-predators in the Frostwood Reach (Thalren fog-distiller, Tethered Mimir floor-brewer, Viridian Florae thorn-blood, Withered null-distillate). Physical reagents, shaking hands, stained fingers, and mechanical contraptions |
| 2 | Group function & exclusive utility | 3 | Tactical perimeter control, mechanical gadgets, non-lethal debilitation (nauseate/daze/disarm without hard stun lockouts), acid demolition, smoke evasion, and field antidote brewing |
| 3 | Resource loop design | 3 | Reagent vial system: 5 base Vials, expended on concoctions and traps, regained on enemy kills within 30ft or battlefield scavenging |
| 4 | Spell-curve quality | 3 | 50 authored spells; 0 pool-floor gaps across levels 1–10 (L1: 8\|4, L2: 5\|4, L3: 6\|4, L4: 4\|4, L5: 4\|3, L6: 4\|4, L7: 4\|3, L8: 4\|4, L9: 4\|3, L10: 4\|4) |
| 5 | Utility identity per level | 3 | Rich alchemical toolbox: chemical analysis, lock-dissolving acid, scent-erasing smoke, slow food taints, stasis pistons, and universal panacea brewing |
| 6 | Combat decision density | 3 | High planning density: preparing traps, managing vial inventory, placing area-denial puddles, and selecting specialized solvents for armored vs evasive targets |
| 7 | Talent-tree integration | 3 | Three complete 50-pt trees (Venomancer, Gadgeteer, Saboteur); 0 validator errors, 0 warnings; all icons verified local assets; 0 free-cast ACTIVE talents |
| 8 | UI expression | 2 | Vials counter and gadget cooldown trackers; crafted concoction palette queued |
| 9 | Anti-overlap distance | 3 | C4 Affliction cluster: Toxicologist is *the craftsman who prepares* (distilled flasks, manufactured contraptions, external antidotes, mechanical constructs); cleanly distinct from Plaguebringer's *the living substrate that propagates* (internal host, biological symbiosis, spore flesh) |
| 10 | Beginner legibility | 2 | Managing vial economics and coordinating trap placement requires tactical positioning and resource budgeting |
| | **Total** | **28/30** | Exceeds charter target (>= 24/30) |

## 2. Utility Ledger row

- Primary / secondary role: Control / Utility (Alchemy, Traps & Sabotage)
- Exclusive territory: **external alchemical concoctions & gadget contraptions** — crafting physical vials, acid solvents, deployed traps, and engineered war constructs
- Conflicts to resolve: C4 Affliction cluster (Plaguebringer overlap resolved; renamed L8 `tox_pandemic` -> `tox_alchemical_outbreak`)
- Resolution: keep; anchor firmly in intellectual preparation, physical reagent jars, and mechanical contraptions rather than parasitic disease cultivation

## 3. Findings

### Talent trees
- All three trees (`toxicologistVenomancer.js`, `toxicologistGadgeteer.js`, `toxicologistSaboteur.js`) are 18-node, 50-pt v2 valid trees.
- Validator: 3 valid / 0 invalid, 0 warnings.
- All talent icons verified local assets.
- 0 free-cast ACTIVE talents: active talents cost mana and vials.

### Spellbook
- 50 total spells in `toxicologistData.js`.
- Established explicit `spellPools: { 1: [...], ..., 10: [...] }` map, eliminating fallback reliance.
- Unslotted non-stance passives (`tox_vial_dependency`, `tox_no_hard_cc` from L1; `tox_concoction_instability` from L3).
- Resolved naming collision: renamed L8 `tox_pandemic` ("Pandemic") to `tox_alchemical_outbreak` ("Alchemical Outbreak") to avoid collision with Plaguebringer's L7 `pb_pandemic`.
- Normalized summon effects: changed `effectTypes: ["summoning"]` to canonical `["summon"]` on `tox_mechanical_monstrosity`, `tox_war_machine`, and `tox_mechanical_army`.
- Spell floor completed: 10 new spells authored:
  - L4: `tox_alchemical_adhesive` (non-damage resin root control)
  - L4: `tox_vapor_veil` (non-damage neutralizing aerosol buff/utility)
  - L5: `tox_narcotic_vapor` (non-damage soporific daze/delirium control)
  - L6: `tox_calcified_antidote` (non-damage metallic cleanse + 20 temp HP buff)
  - L6: `tox_pneumatic_stasis_piston` (non-damage vice clamp disarm control)
  - L7: `tox_cryogenic_distillate` (non-damage endothermic freezing zone control)
  - L7: `tox_caustic_deluge` (damage + armor melt debuff)
  - L8: `tox_biochemical_siphon` (non-damage tether drain buff/debuff)
  - L9: `tox_stasis_gas_dispersal` (non-damage suspended animation stasis control)
  - L10: `tox_panacea_concoction` (non-damage universal restoration cleanse/buff)
- Pool map: L1 (8\|4), L2 (5\|4), L3 (6\|4), L4 (4\|4), L5 (4\|3), L6 (4\|4), L7 (4\|3), L8 (4\|4), L9 (4\|3), L10 (4\|4).
- 0 pool-floor gaps, 0 warnings.

### Resource / data
- Primary class resource: `vials` (toxinVials).
- Damage types: canonical `blight`, `rime`, `arcane`, `wyrd`.

## 4. Change list

| Item | Action | Rationale | Status |
|---|---|---|---|
| Spell-floor program | authored 10 spells (L4–L10) | Charter requirement (>=4 options, >=2 non-damage) | done |
| Explicit spellPools | defined explicit 1–10 pools | Remove fallback reliance & unslot passives | done |
| Name collision fix | renamed L8 `tox_pandemic` -> `tox_alchemical_outbreak` | Disambiguate from Plaguebringer L7 `pb_pandemic` | done |
| Summon normalization | changed `summoning` to canonical `summon` | Ensure proper non-damage classification | done |
| Free-cast ACTIVE talents | costed with vials/mana | Resource loop integrity | done |
| Legacy icons | verified local assets | Asset localization | done |
| C4 preparation prose | sharpen vs Plaguebringer bio-host | Anti-overlap clarity | done |

## 5. Evidence

- `node scripts/audit-classes.mjs --class Toxicologist`: 0 integrity errors, 0 pool-floor gaps, 0 warnings.
- `npm run validate:talent-trees`: 65 valid / 0 invalid, 0 warnings.
- `npm run audit:damage-types`: 0 non-canonical errors.
- `npm run audit:spell-variety`: 0 upgrade traps.

## 6. Mind memory

- `toxicologist-deep-dive-2026-09-14`, `class-deep-dive-policies-2026-09-13`

## 7. Spell-level format & flavor pass — 2026-09-16

Tool: `scripts/spell-card-qa.mjs`. **Before: 31 flagged / 8 errors. After: 0 errors** (remaining warnings are long descriptions).

| Spell | Issue | Fix |
|---|---|---|
| `tox_acid_unlocking`, `tox_false_death`, `tox_smoke_bomb` | no `effectTypes` | added `utility` + utilityConfigs (dissolve, feign death, smoke cover) |
| `tox_apply_poison` | no `effectTypes`, duration rounds/attacks mismatch | added poison-coating buffConfig; duration type `time` |
| `tox_alchemical_adhesive`, `tox_pneumatic_stasis_piston` | `debuff` with no config | added resin slow / vice-clamp disarm debuffs |
| `tox_biochemical_siphon` | `buff` with no stats, bad `healingType` | added tether buffConfig; healing `vampiric`, formula `15` |

Flavor: vial/gadget identity intact; no rethemes proposed.

### Pass 2 addendum — 2026-09-16 (mechanical warning cleanup)

`tox_antidote` + `tox_purifying_antidote` + `tox_calcified_antidote` + `tox_panacea_concoction`: cure/purification configs now gated with `utility` type and have `selectedEffects`/`effects[]`. `tox_poison_trap`/`contraption_network`/`overcharged_trap`: duration type aligned to `minutes` (traps).

### Pass 3 addendum — 2026-09-16 (cooldown declarations)

`tox_crippling_toxin` now declares `cooldownConfig: { cooldownType: "turn_based", cooldownValue: 0 }`.

### Pass 4 — 2026-09-16 (verbosity trim)

22 descriptions over 200 chars rewritten to ≤200, preserving every mechanic, number, and the class voice. Full global spell-card QA is now **0 errors / 0 warnings** across all 21 classes (1,026 spells).
