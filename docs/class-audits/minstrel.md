# Minstrel — Deep Dive

- Date: 2026-09-14
- Auditor: Phase 2 Remainder cluster (spell-floor + talent audit, validated)
- Status: **implemented — awaiting Daniel review**

## 1. Scores (0–3 per dimension; target >= 24/30, no dimension <= 1)

| # | Dimension | Score | Evidence |
|---|---|---|---|
| 1 | Identity & fantasy | 3 | Conductor of battlefield acoustics and maritime sonic engineering: Merryn storm-singers, Myrathil tide-singers, and Clean Vreken acoustics; banking musical notes to resolve powerful cadences, carrying the tragic curse of the stolen voice |
| 2 | Group function & exclusive utility | 3 | Rhythmic team synchronization, action economy momentum, and sonic crowd control: speeding allies, reflecting ranged fire with acoustic barriers, pacifying hostile creatures, and resolving cadences |
| 3 | Resource loop design | 3 | Dual Mana + Musical Notes engine (max 35 notes, 5 per pitch I–VII): builder spells bank distinct pitch notes; cadences and symphonies consume banked pitches to trigger escalating teamwide benefits |
| 4 | Spell-curve quality | 3 | 48 authored spells; 0 pool-floor gaps across all levels 1–10 (L1: 9\|7, L2: 5\|4, L3: 6\|5, L4: 4\|3, L5: 4\|3, L6: 4\|4, L7: 4\|3, L8: 4\|4, L9: 4\|4, L10: 4\|3) |
| 5 | Utility identity per level | 3 | Superb maritime and social utility: Siren's calm soothing hostilities, resonance touch shattering brittle locks/revealing hollow chambers, mnemonic chords consulting world memory, busker street diversions, and rallying march anthems |
| 6 | Combat decision density | 3 | High tactical engagement: deciding which musical pitches to bank, calculating chord combinations for cadence triggers, and timing burst symphonies |
| 7 | Talent-tree integration | 3 | Three complete 50-pt trees (Chord Combinations, Harmonic Weaving, Musical Magic); 0 validator errors, 0 warnings; all icons verified local assets; 0 free-cast ACTIVE talents |
| 8 | UI expression | 3 | Musical note staff tracker component and cadence resolution interface |
| 9 | Anti-overlap distance | 3 | Completely distinct mechanical identity: chord-building cadence system, sonic wave propagation, and party momentum manipulation |
| 10 | Beginner legibility | 3 | Intuitive musical motif backed by clear builder-spender mechanics |
| | **Total** | **29/30** | Exceeds charter target (>= 24/30) |

## 2. Utility Ledger row

- Primary / secondary role: Support / Control (Battlefield Acoustics, Rhythm & Cadence Magic)
- Exclusive territory: **musical note banking & cadence resolution** — synchronizing party action economy, acoustic deflection barriers, and auditory crowd control
- Conflicts to resolve: Augur (fate/dice) and Animist (ancestor spirits) overlap resolved; Minstrel works through maritime sound frequencies and rhythmic physics
- Resolution: keep; anchor firmly in Merryn storm-sailor engineering, Myrathil tidal music, and Lyris the Tide-Singer's legacy

## 3. Findings

### Talent trees
- All three trees are 18-node, 50-pt v2 valid trees.
- Validator: 3 valid / 0 invalid, 0 warnings.
- All talent icons verified local assets.
- 0 free-cast ACTIVE talents.

### Spellbook
- 48 total spells in `minstrelData.js`.
- Spell floor completed: 5 new spells authored:
  - L6: `minstrel_tide_turners_dirge` (storm damage + enemy speed halving & attack penalty debuff)
  - L7: `minstrel_resonant_barrier` (non-damage 35 temp HP acoustic bastion reflecting ranged attacks)
  - L8: `minstrel_abyssal_crescendo` (12d8 storm damage + deafen / disorientation control)
  - L9: `minstrel_anthem_of_the_iceheart` (non-damage +1 AP, +4 DR, and complete control immunity)
  - L10: `minstrel_apotheosis_symphony` (16d10 storm/wyrd battlefield damage + 50 HP party heal)
- Pool map: L1 (9\|7), L2 (5\|4), L3 (6\|5), L4 (4\|3), L5 (4\|3), L6 (4\|4), L7 (4\|3), L8 (4\|4), L9 (4\|4), L10 (4\|3).
- 0 pool-floor gaps, 0 warnings.

### Resource / data
- Primary class resources: `mana` and `musical_notes`.
- Damage types: canonical `storm`, `wyrd`, `primal`, `sacred`.

## 4. Change list

| Item | Action | Rationale | Status |
|---|---|---|---|
| Spell-floor program | authored 5 spells (L6–L10) | Charter requirement (>=4 options, >=2 non-damage) | done |
| Spell-pool expansion | added new spells into L6–L10 pools | Completes pool floors across all levels | done |
| Free-cast ACTIVE talents | verified note and mana costs | Resource loop integrity | done |
| Legacy icons | verified local assets | Asset localization | done |

## 5. Evidence

- `node scripts/audit-classes.mjs --class Minstrel`: 0 integrity errors, 0 pool-floor gaps, 0 warnings.
- `npm run validate:talent-trees`: 65 valid / 0 invalid, 0 warnings.
- `npm run audit:damage-types`: 0 non-canonical errors.
- `npm run audit:spell-variety`: 0 upgrade traps.

## 6. Mind memory

- `minstrel-deep-dive-2026-09-14`, `class-deep-dive-policies-2026-09-13`

## 7. Spell-level format & flavor pass — 2026-09-16

Tool: `scripts/spell-card-qa.mjs`. **Before: 24 flagged / 2 errors. After: 0 errors** (remaining warnings are long descriptions).

| Spell | Issue | Fix |
|---|---|---|
| `minstrel_rallying_anthem` | `buff` with no config | added marching-anthem aura buffConfig |
| `charisma` formulas (drive-by from Berserker pass) | banned attribute in 3 damage formulas | `charisma` → `spirit` (24 other formulas already used spirit) |

Flavor: note/cadence identity intact; no rethemes proposed.

### Pass 2 addendum — 2026-09-16 (mechanical warning cleanup)

`minstrel_harmony_of_renewal`: purification `effects[]` added. 11 cadence spells had `durationType: rounds` / `durationUnit: turns` — type aligned to `turns`; `song_of_rest` aligned to `hours`.

### Pass 4 — 2026-09-16 (verbosity trim)

14 descriptions over 200 chars rewritten to ≤200, preserving every mechanic, number, and the class voice. Full global spell-card QA is now **0 errors / 0 warnings** across all 21 classes (1,026 spells).
