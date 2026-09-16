# Spellguard — Deep Dive

- Date: 2026-09-14
- Auditor: Phase 2 C1/C5 cluster (spell-floor + talent audit, validated)
- Status: **implemented — awaiting Daniel review**

## 1. Scores (0–3 per dimension; target >= 24/30, no dimension <= 1)

| # | Dimension | Score | Evidence |
|---|---|---|---|
| 1 | Identity & fantasy | 3 | Null-Weave Sentinel / Anti-Mage Warden: weave intercepting wards, catch hostile sorcery, ground arcane lightning, turn enemy spells into kinetic fuel. Imposing defensive fantasy |
| 2 | Group function & exclusive utility | 3 | Exceptional group protection: spell absorption domes, projectile redirection, grounding rods, dispels, and magical damage mitigation. High utility identity |
| 3 | Resource loop design | 3 | Arcane Ward saturation: intercepting spells builds charge towards saturation (cap-pressure); overcharging triggers Arcane Saturation / backlash unless discharged into defensive pulses or strikes. Straddles C1 (cap pressure) and C5 (anti-magic) |
| 4 | Spell-curve quality | 3 | 62 authored spells; 0 pool-floor gaps across all levels 1–10 (L1: 10\|7, L2: 6\|5, L3: 4\|4, L4: 4\|3, L5: 4\|2, L6: 4\|3, L7: 4\|3, L8: 4\|4, L9: 4\|3, L10: 4\|4) |
| 5 | Utility identity per level | 3 | At least 2–7 non-damage options at every level: counter-wards, kinetic barriers, spell purges, grounding anchors, and antimagic bastions |
| 6 | Combat decision density | 3 | Reactive gameplay: deciding whether to absorb incoming spells into Ward capacity, expend charges for team mitigation, or vent in offensive breaker strikes |
| 7 | Talent-tree integration | 3 | Three complete 50-pt trees (Spell Breaker, Arcane Warden, Mana Reaver); 0 validator errors, 0 warnings; all legacy `inv_*` icons replaced; 0 free-cast ACTIVE talents |
| 8 | UI expression | 2 | Arcane Ward bar with absorption thresholds; UI copy standardization queued |
| 9 | Anti-overlap distance | 3 | C5 anti-magic cluster: cleanly differentiated from Inquisitor. Inquisitor condemns and silences casters through holy retribution; Spellguard mechanically catches, stores, and grounds ambient arcane force |
| 10 | Beginner legibility | 2 | Reaction timing and absorption saturation management require active combat tracking |
| | **Total** | **27/30** | Meets charter target (>= 24/30) |

## 2. Utility Ledger row

- Primary / secondary role: Tank / Support (Anti-Magic)
- Exclusive territory: **kinetic spell interception & ward saturation** — capturing hostile magical energy to charge protective domes, kinetic discharge, and spell redirects
- Conflicts to resolve: C5 anti-magic cluster (Inquisitor overlap), C1 cap-pressure cluster (saturation vs meltdown/burnout)
- Resolution: keep; emphasize kinetic shielding and spell absorption over divine punishment

## 3. Findings

### Talent trees
- All three trees (`spellguardSpellBreaker`, `spellguardArcaneWarden`, `spellguardManaReaver`) are 18-node, 50-pt v2 valid trees.
- Validator: 3 valid / 0 invalid, 0 warnings.
- All 4 legacy `inv_*` icons replaced with verified local ability icons in Phase 2.
- 0 free-cast ACTIVE talents: all active nodes carry appropriate mana and ward/charge resource costs.

### Spellbook
- 62 total spells in `spellguardData.js`.
- Spell floor completed: 16 new spells authored (+16) filling all historical level gaps.
- Pool map: L1 (10\|7), L2 (6\|5), L3 (4\|4), L4 (4\|3), L5 (4\|2), L6 (4\|3), L7 (4\|3), L8 (4\|4), L9 (4\|3), L10 (4\|4).
- 0 pool-floor gaps across all levels 1–10.

### Resource / data
- Warning note in audit tooling: L1 pool contains 2 weakness passives (`spellguard_arcane_radiation`, `spellguard_kinetic_fragility`) awaiting unslotting into passive class feature data.

## 4. Change list

| Item | Action | Rationale | Status |
|---|---|---|---|
| Spell-floor program | authored 16 spells across L2–L10 | Charter requirement (>=4 options, >=2 non-damage) | done |
| Legacy icons | replaced 4 `inv_*` icons | Local asset compliance | done |
| Free-cast ACTIVE talents | costed with mana/charges | Resource loop integrity | done |
| C5 anti-magic prose | sharpen vs Inquisitor | Anti-overlap clarity | queued |
| L1 weakness passives in pool | unslot to class traits | Clean pick pool standards | queued |

## 5. Evidence

- `node scripts/audit-classes.mjs --class Spellguard`: 0 integrity errors, 0 pool-floor gaps.
- `node vtt-react/src/utils/talentTreeValidator.mjs --file spellguard`: 3 valid / 0 invalid, 0 warnings.
- `npm run audit:damage-types`: 0 non-canonical errors.
- `npm run audit:spell-variety`: 0 upgrade traps.

## 6. Mind memory

- `spellguard-deep-dive-2026-09-14`, `class-deep-dive-policies-2026-09-13`

## 7. Spell-level format & flavor pass — 2026-09-16

Tool: `scripts/spell-card-qa.mjs`. **Before: 31 flagged / 12 errors. After: 0 errors / 0 non-verbosity
warnings** (remaining are descriptions >200 chars only).

### Fixed (card-breaking)

| Spell | Issue | Fix |
|---|---|---|
| `sg_kinetic_discharge` | `crowd_control`, no control config | `control` + 15ft forced-movement knockback config |
| `sg_null_field_bastion` | `buff` with no stats | added anti-magic ward buffConfig (+4 saves, 50% spell DR) |
| `sg_anti_magic_shackle` | `crowd_control` + two missing configs | `control` + silenced config + magical-lockout debuffConfig |
| `sg_overload_shockwave` | `crowd_control`, no control config | `control` + knockdown config; encoded the stated **50 AEP cost** |
| `sg_fortress_of_nullification` | `buff` with no stats | added anchored-fortress buffConfig (magical damage/CC immunity) |
| `sg_singularity_aegis` | `buff` with no stats | added singularity reflect buffConfig |
| `spg_aegis_ward` | no `effectTypes` | added `buff` + +3 DR reaction buffConfig |
| `spg_spell_break` | no `effectTypes` | added `control` + counter-spell config |

### Resource / data notes (proposal — Daniel decides)

- **AEP key drift:** spells spend `classResource:{type:"arcane_energy_points"}` (13 instances), but
  `classResources.js` defines `Spellguard.id = 'arcaneEnergyPoints'` (camelCase). Same drift family
  as Crusader's `fervor` vs `radiantFervor` — pick one canonical key before release.
- `sg_overload_shockwave` explicitly states a 50 AEP cost but had none encoded; added
  `classResource:{type:"arcane_energy_points", cost:50}` using the in-class key. If the key is
  canonicalized, sweep all 14 instances together.
- Other AEP spenders in prose (e.g. `sg_containment_cycle` "Spend 15 AEP", `sg_saturation_flush`
  "Vent 40 AEP") should be audited in the same key pass.

### Flavor / class-fit notes

- Silence-crystal/anti-magic identity coherent; overlap prose vs Inquisitor already tracked in §4
  (C5 cluster). No rethemes proposed.
- 2 passives (`spellguard_arcane_radiation`, `spellguard_kinetic_fragility`) are class weaknesses in
  the pick pool — already tracked in §4.

### Evidence (this pass)

- `node scripts/spell-card-qa.mjs --dump Spellguard`: 0 errors
- `audit:classes --class Spellguard`: 0 integrity / 0 floor gaps / 0 warnings; `spell-qa` 0 issues
- Playwright card review: pending (Daniel)

### Pass 4 — 2026-09-16 (verbosity trim)

21 descriptions over 200 chars rewritten to ≤200, preserving every mechanic, number, and the class voice. Full global spell-card QA is now **0 errors / 0 warnings** across all 21 classes (1,026 spells).
