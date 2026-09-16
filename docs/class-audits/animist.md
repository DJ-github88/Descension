# Animist — Deep Dive

- Date: 2026-09-14
- Auditor: Phase 2 Remainder cluster (spell-floor + talent audit, validated)
- Status: **implemented — awaiting Daniel review**

## 1. Scores (0–3 per dimension; target >= 24/30, no dimension <= 1)

| # | Dimension | Score | Evidence |
|---|---|---|---|
| 1 | Identity & fantasy | 3 | Ancestral spirit-channeler and totem-carver: Ordan throat-singing overtones, Skald bone-carving, Groven moss-root communion, and Astril starlight ancestry; carrying the voices of the dead with the hazard of Spirit Erosion |
| 2 | Group function & exclusive utility | 3 | Battlefield zoning, totem placement, ancestral warding, and spirit communion: positioning persistent totems (healing, gale, thunder, primeval), spirit-walking scouts, and threshold knells |
| 3 | Resource loop design | 3 | Dual Mana + Resonance engine: generating Resonance via ancestral cantrips and communion; spending Resonance on high-impact totems, ancestral invocations, and avatar ascensions |
| 4 | Spell-curve quality | 3 | 47 authored spells; 0 pool-floor gaps across all levels 1–10 (L1: 8\|6, L2: 8\|7, L3: 5\|3, L4: 4\|3, L5: 4\|2, L6: 4\|4, L7: 4\|3, L8: 4\|3, L9: 4\|2, L10: 4\|4) |
| 5 | Utility identity per level | 3 | Rich out-of-combat spirit exploration: ancestral whispers, bone-reading memory echoes, spirit-walking scouts, language-translating runes, threshold camp alarms, and mourner pacifications |
| 6 | Combat decision density | 3 | High tactical variety: totem deployment geometry, choosing between damage smites and party buffing auras, and managing Resonance expenditure |
| 7 | Talent-tree integration | 3 | Three complete 50-pt trees; 0 validator errors, 0 warnings; all icons verified local assets; 0 free-cast ACTIVE talents |
| 8 | UI expression | 2 | Resonance bar and active totem duration tracker queued |
| 9 | Anti-overlap distance | 3 | Cleanly differentiated from Warden (tether/nature warden) and Shaper (body transformation): Animist is the spiritual medium, totem deployer, and ancestral voice channeler |
| 10 | Beginner legibility | 3 | Clear and thematic totem/spirit playstyle with immediate tactile feedback |
| | **Total** | **28/30** | Exceeds charter target (>= 24/30) |

## 2. Utility Ledger row

- Primary / secondary role: Support / Control (Totems, Ancestral Communion & Primal Magic)
- Exclusive territory: **totem-anchored zone control & ancestral spirit communion** — planting totems to radiate persistent auras, projecting spirit scouts, reading psychometric echoes from bones, and channeling ancient battle-spirits
- Conflicts to resolve: Warden (mark/cage) and Shaper (flesh crafting) overlap resolved; Animist channels the deceased and commands static totem matrices
- Resolution: keep; anchor firmly in Ordan throat-singing lineage, Skald bone rites, and fractured ancestral languages

## 3. Findings

### Talent trees
- All three trees are 18-node, 50-pt v2 valid trees.
- Validator: 3 valid / 0 invalid, 0 warnings.
- All talent icons verified local assets.
- 0 free-cast ACTIVE talents.

### Spellbook
- 47 total spells in `animistData.js`.
- Integrated missing authored spells `animist_spirit_voice` (L1) and `animist_spirit_hawk` (L2) into `spellPools`.
- Spell floor completed: 9 new spells authored:
  - L4: `animist_ancestral_wrath_strike` (primal/smashing melee damage)
  - L5: `animist_thunder_totem` (storm totem discharging lightning bolts each round)
  - L6: `animist_ancestral_concussion` (primal sonic cone damage + Fortitude stun)
  - L7: `animist_volcanic_fissure` (ember/primal magma line fissure damage)
  - L8: `animist_primeval_stampede` (primal ghost-herd AoE damage + knockdown)
  - L9: `animist_ancestral_communion_sanctuary` (non-damage 8d8 heal + +6 DR + fear/charm immunity)
  - L9: `animist_wrath_of_the_first_ancestor` (14d8 crushing primal single-target smite)
  - L10: `animist_totem_of_the_world_tree` (non-damage +8 DR + shared health + lethal damage ward)
  - L10: `animist_apotheosis_ancestral_tempest` (18d8 storm/primal battlefield hurricane + knockdown)
- Pool map: L1 (8\|6), L2 (8\|7), L3 (5\|3), L4 (4\|3), L5 (4\|2), L6 (4\|4), L7 (4\|3), L8 (4\|3), L9 (4\|2), L10 (4\|4).
- 0 pool-floor gaps, 0 warnings.

### Resource / data
- Primary class resources: `mana` and `resonance`.
- Damage types: canonical `primal`, `storm`, `ember`, `smashing`, `blight`, `wyrd`.

## 4. Change list

| Item | Action | Rationale | Status |
|---|---|---|---|
| Spell-floor program | authored 9 spells (L4–L10) | Charter requirement (>=4 options, >=2 non-damage) | done |
| Spell-pool integration | included `animist_spirit_voice` (L1) and `animist_spirit_hawk` (L2) | Missing authored spells in pools | done |
| Free-cast ACTIVE talents | verified resonance and mana costs | Resource loop integrity | done |
| Legacy icons | verified local assets | Asset localization | done |

## 5. Evidence

- `node scripts/audit-classes.mjs --class Animist`: 0 integrity errors, 0 pool-floor gaps, 0 warnings.
- `npm run validate:talent-trees`: 65 valid / 0 invalid, 0 warnings.
- `npm run audit:damage-types`: 0 non-canonical errors.
- `npm run audit:spell-variety`: 0 upgrade traps.

## 6. Mind memory

- `animist-deep-dive-2026-09-14`, `class-deep-dive-policies-2026-09-13`

## 7. Spell-level format & flavor pass — 2026-09-16

Tool: `scripts/spell-card-qa.mjs`. **Before: 8 flagged / 6 errors. After: 0 errors** (remaining warnings are long descriptions).

| Spell | Issue | Fix |
|---|---|---|
| `animist_spirit_voice`, `animist_spirit_hawk` | no `effectTypes` | added `utility` + divination/scout utilityConfigs |
| `animist_threshold_ward`, `animist_mourners_pact` | `buff` with no config | added vigil-rest / kin-trust buffConfigs |

Flavor: ancestor/Resonance identity intact (CL-02 founder fix remains tracked separately); no rethemes proposed.

### Pass 4 — 2026-09-16 (verbosity trim)

6 descriptions over 200 chars rewritten to ≤200, preserving every mechanic, number, and the class voice. Full global spell-card QA is now **0 errors / 0 warnings** across all 21 classes (1,026 spells).
