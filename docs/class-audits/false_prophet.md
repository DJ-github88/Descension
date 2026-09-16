# False Prophet — Deep Dive

- Date: 2026-09-14
- Auditor: Phase 2 C6 cluster (spell-floor + talent audit, validated)
- Status: **implemented — awaiting Daniel review**

## 1. Scores (0–3 per dimension; target >= 24/30, no dimension <= 1)

| # | Dimension | Score | Evidence |
|---|---|---|---|
| 1 | Identity & fantasy | 3 | Insidious psychic shepherd and manufactured apostle: parasitic empathetic links (`Stitch of Suffering`), congregational suffering redirection, madness-fueled apocalyptic miracles, and manufactured doctrine tapping into the Silence and Lumia false stars |
| 2 | Group function & exclusive utility | 3 | Empathetic link damage redirection and suffering conversion: weaponizing incoming party damage straight into linked enemies from Level 1, mass psychological deception, and psychic hive defense |
| 3 | Resource loop design | 3 | Dual Mana + Madness engine (Madness base 0, threshold 20 triggers Convulsion): casting spells generates or spends Madness; high Madness increases DCs and empowers dark miracles while escalating the catastrophic threat of Apocalyptic Convulsion |
| 4 | Spell-curve quality | 3 | 54 authored spells; 0 pool-floor gaps across all levels 1–10 (L1: 9\|7, L2: 6\|5, L3: 5\|5, L4: 5\|4, L5: 7\|5, L6: 4\|4, L7: 4\|3, L8: 4\|3, L9: 4\|2, L10: 4\|3) |
| 5 | Utility identity per level | 3 | Distinct out-of-combat cult-leader utility: reading surface thoughts, unlit darkness vision, consulting the Voice of the Silence, whispering suggestive thoughts into weak minds, and empathetic health transfers |
| 6 | Combat decision density | 3 | Intense tactical risk/reward: managing Madness generation to maximize spell potency without crossing the 20-point Convulsion threshold, choosing link targets to redistribute party damage, and deploying mass cognitive deceptions |
| 7 | Talent-tree integration | 3 | Three complete 50-pt trees (Cult Leader, Voice of the Silence, Apostate); 0 validator errors, 0 warnings; all icons verified local assets; 0 free-cast ACTIVE talents |
| 8 | UI expression | 2 | Madness tracker with convulsion risk thresholds (5/10/15/19/20) and empathetic link line rendering queued |
| 9 | Anti-overlap distance | 3 | C6 Sacrifice cluster: False Prophet is *the broken fanatic who spreads madness & weaponizes suffering* (empathetic psychic links, madness dice, deception); cleanly distinct from Martyr's *the selfless wall that absorbs wounds* and Crusader's *the martial zealot who smites with holy wrath* |
| 10 | Beginner legibility | 2 | High complexity due to Madness threshold management, convulsion mechanics, and empathetic link targeting; heavily rewarded for experienced players |
| | **Total** | **28/30** | Exceeds charter target (>= 24/30) |

## 2. Utility Ledger row

- Primary / secondary role: Control / Support (Empathetic Redirection, Madness & Deception)
- Exclusive territory: **empathetic link redirection & weaponized party suffering** — stitching neural cords between allies and enemies to mirror incoming wounds, manipulating consensus reality, and channeling silence-revelations
- Conflicts to resolve: C6 Sacrifice cluster (Martyr and Crusader overlap resolved; psychic redirection vs self-sacrificial absorption vs radiant smiting)
- Resolution: keep; anchor firmly in psychological manipulation, manufactured dogma, and parasitic empathetic bonds

## 3. Findings

### Talent trees
- All three trees are 18-node, 50-pt v2 valid trees.
- Validator: 3 valid / 0 invalid, 0 warnings.
- All talent icons verified local assets.
- 0 free-cast ACTIVE talents.

### Spellbook
- 54 total spells in `falseProphetData.js`.
- Normalized `fp_summon_congregation` to canonical `effectTypes: ["summon"]`.
- Separated passive flaw entries (`fp_void_whisper`, `fp_fractured_reality`) from active level-up pick pools.
- Spell floor completed: 10 new spells authored:
  - L6: `fp_broadcast_agony` (wyrd damage + debuff mirroring 50% damage to linked foes)
  - L7: `fp_parasitic_tether` (non-damage +4 DR ally buff + 40% damage redirect)
  - L8: `fp_veil_of_collective_denial` (non-damage 50% miss chance illusion defense)
  - L8: `fp_cataclysmic_hysteria` (wyrd AoE damage + fear control)
  - L9: `fp_mass_apostasy` (non-damage DC 19 mass mind-control / defection)
  - L9: `fp_communal_sacrifice_rite` (non-damage 8d8 party heal + temp HP scaling with Madness)
  - L9: `fp_collapse_of_sanctity` (wyrd line damage stripping sacred protections)
  - L10: `fp_the_great_delusion` (non-damage battlefield-wide sensory stasis)
  - L10: `fp_voice_of_the_unborn_god` (18d10 apocalyptic silence cone damage)
  - L10: `fp_avatar_of_the_silent_monolith` (non-damage obsidian monolith transformation with 10 DR and damage absorption)
- Pool map: L1 (9\|7), L2 (6\|5), L3 (5\|5), L4 (5\|4), L5 (7\|5), L6 (4\|4), L7 (4\|3), L8 (4\|3), L9 (4\|2), L10 (4\|3).
- 0 pool-floor gaps, 0 warnings.

### Resource / data
- Primary class resources: `mana` and `madness`.
- Damage types: canonical `wyrd`.

## 4. Change list

| Item | Action | Rationale | Status |
|---|---|---|---|
| Spell-floor program | authored 10 spells (L6–L10) | Charter requirement (>=4 options, >=2 non-damage) | done |
| Explicit spellPools | defined levels 1–10 pools | Full level-up pick pool clarity; excluded passives | done |
| Summon normalization | normalized `fp_summon_congregation` to `summon` | Canonical classification | done |
| Free-cast ACTIVE talents | verified resource costs | Resource loop integrity | done |
| Legacy icons | verified local assets | Asset localization | done |
| C6 sacrifice prose | sharpen vs Martyr absorb and Crusader smite | Anti-overlap clarity | done |

## 5. Evidence

- `node scripts/audit-classes.mjs --class "False Prophet"`: 0 integrity errors, 0 pool-floor gaps, 0 warnings.
- `npm run validate:talent-trees`: 65 valid / 0 invalid, 0 warnings.
- `npm run audit:damage-types`: 0 non-canonical errors.
- `npm run audit:spell-variety`: 0 upgrade traps.

## 6. Mind memory

- `false-prophet-deep-dive-2026-09-14`, `class-deep-dive-policies-2026-09-13`

## 7. Spell-level format & flavor pass — 2026-09-16

Tool: `scripts/spell-card-qa.mjs`. **Before: 33 flagged / 8 errors. After: 0 errors** (remaining warnings are long descriptions).

| Spell | Issue | Fix |
|---|---|---|
| `fp_veil_of_silence` | `debuff`+`utility` with no configs | added silence debuff + zone utilityConfig |
| `fp_mind_control` | `debuff`+`control` with no configs | added mind-control config (DC 15 Spirit) + mental debuff |
| `fp_wyrd_shape` | `debuff`+`control` with no configs | added polymorph control + helpless debuff |
| `fp_mass_apostasy` | `debuff` with no config | added oath-shatter debuffConfig |
| `fp_the_great_delusion` | `utility` with no config | added dreamscape utilityConfig |

Flavor: manufactured-gospel/madness identity intact; no rethemes proposed.

### Pass 4 — 2026-09-16 (verbosity trim)

28 descriptions over 200 chars rewritten to ≤200, preserving every mechanic, number, and the class voice. Full global spell-card QA is now **0 errors / 0 warnings** across all 21 classes (1,026 spells).
