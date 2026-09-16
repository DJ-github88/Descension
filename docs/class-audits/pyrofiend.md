# Pyrofiend — Deep Dive

- Date: 2026-09-14
- Auditor: Phase 2 C1 cluster (spell-floor + talent audit, validated)
- Status: **implemented — awaiting Daniel review**

## 1. Scores (0–3 per dimension; target >= 24/30, no dimension <= 1)

| # | Dimension | Score | Evidence |
|---|---|---|---|
| 1 | Identity & fantasy | 3 | Living furnace / Inferno Apostate: channel hellfire, climb Inferno Veil tiers, trade flesh and sanity for apocalyptic heat. Unmistakable fantasy and visceral vocabulary |
| 2 | Group function & exclusive utility | 2 | Primary DPS / Blaster; exclusive utility lies in ignite propagation, hazard zone control, and the newly authored Ember Siphon / Obsidian Aegis party protections |
| 3 | Resource loop design | 3 | Inferno Veil 0–10: climbing Veil tiers ramps ember damage and area but increases volatility; at cap (Veil 10), triggers an irreversible death-clock countdown. The starkest failure shape in the C1 cluster |
| 4 | Spell-curve quality | 3 | 52 authored spells; 0 pool-floor gaps across all levels 1–10 (L1: 7\|4, L2: 5\|3, L3: 4\|2, L4: 5\|2, L5: 5\|3, L6: 4\|2, L7: 4\|2, L8: 5\|3, L9: 4\|3, L10: 4\|3) |
| 5 | Utility identity per level | 2 | Solid utility progression: smoke concealment, cinder wards, obsidian shields, ember siphon cleanse, and the Ashen Crucible pause mechanic |
| 6 | Combat decision density | 3 | High-tension balancing act: ascend Veil for critical thresholds vs venting via descends to avoid triggering the terminal burnout countdown |
| 7 | Talent-tree integration | 3 | Three complete 50-pt trees (Inferno, Hellfire, Wildfire); 0 validator errors, 0 warnings; all icons localized; 0 free-cast ACTIVE talents (all carry Veil/mana costs) |
| 8 | UI expression | 2 | Inferno Veil bar with flame aesthetic and tier indicators; tooltip copy planned for data-driven standardization |
| 9 | Anti-overlap distance | 3 | C1 cluster: Pyrofiend's failure shape is *irreversible death-clock / catastrophic meltdown*; cleanly differentiated from Berserker (starvation), Harbinger (random rewrite), and Chronarch (temporal backlash) |
| 10 | Beginner legibility | 2 | Clear high-risk/high-reward loop, though the death-clock at Veil 10 punishes careless pilots |
| | **Total** | **26/30** | Meets charter target (>= 24/30) |

## 2. Utility Ledger row

- Primary / secondary role: DPS (Blaster) / Area Denial
- Exclusive territory: **Inferno Veil ascent & terminal death-clock** — escalation through heat tiers culminating in an irreversible burnout timer unless sealed or vented
- Conflicts to resolve: C1 cap-pressure cluster (differentiation vs Berserker/Harbinger/Chronarch), Arcanoneer (fire/elemental blast overlap)
- Resolution: keep; emphasize bodily self-consumption, Veil tension, and hazard control

## 3. Findings

### Talent trees
- All three trees (`pyrofiendInferno`, `pyrofiendHellfire`, `pyrofiendWildfire`) are valid 50-pt trees under the v2 validator.
- 0 validator warnings, 0 invalid trees.
- Zero free-cast ACTIVE talents: every active talent costs mana and interacts with the Veil resource (`veil`, `inferno_ascend`, `inferno_descend`).
- All talent icons verified local assets.

### Spellbook
- 52 total spells in `pyrofiendData.js`.
- Spell floor completed: 10 new spells authored (+10) providing at least 4 options and at least 2 non-damage options across every single level from 1 to 10.
- Pool map: L1 (7\|4), L2 (5\|3), L3 (4\|2), L4 (5\|2), L5 (5\|3), L6 (4\|2), L7 (4\|2), L8 (5\|3), L9 (4\|3), L10 (4\|3).
- Canonical damage types: all spells strictly conform to `ember` (with self-strain damage using canonical types).

### Resource / data
- `classResources.js` and `pyrofiendData.js` align on Inferno Veil mechanics.
- Two minor warnings remain in audit tooling for authored utility spells `pyro_hearth_heat` (L1) and `pyro_inferno_blast` (L3) omitted from level-up pick pools (retained as situational/ritual spells).

## 4. Change list

| Item | Action | Rationale | Status |
|---|---|---|---|
| Spell-floor program | authored 10 spells (L4, L6, L7, L8, L9, L10) | Charter requirement (>=4 options, >=2 non-damage) | done |
| Free-cast ACTIVE talents | costed with Veil/mana | Resource loop integrity | done |
| Legacy icons | verified local assets | UI visual consistency | done |
| Damage-type audit | strictly `ember` school & damageTypes | Canon consistency | done |
| C1 failure-shape prose | differentiate death-clock vs starvation/backlash | Anti-overlap clarity | queued |

## 5. Evidence

- `node scripts/audit-classes.mjs --class Pyrofiend`: 0 integrity errors, 0 pool-floor gaps.
- `node vtt-react/src/utils/talentTreeValidator.mjs --file pyrofiendInferno`: 1 valid / 0 invalid, 0 warnings.
- `npm run audit:damage-types`: 0 non-canonical errors.
- `npm run audit:spell-variety`: 0 upgrade traps.

## 6. Mind memory

- `pyrofiend-deep-dive-2026-09-14`, `class-deep-dive-policies-2026-09-13`

## 7. Spell-level format & flavor pass — 2026-09-16

Tool: `scripts/spell-card-qa.mjs`. **Before: 42 flagged / 6 errors. After: 0 errors** (remaining warnings are long descriptions).

| Spell | Issue | Fix |
|---|---|---|
| `pyro_inferno_blast` | no `effectTypes` | added `damage`+`control` with 4d6 ember + burning-ground zone |
| `pyro_hearth_heat` | no `effectTypes` | added `utility` + warmth utilityConfig |
| `pyro_living_hearth`, `pyro_cinder_veil` | `buff` with no config | added hearth-warmth / heat-mirage buffConfigs |

Flavor: volcanic-furnace identity intact; no rethemes proposed.

### Pass 4 — 2026-09-16 (verbosity trim)

40 descriptions over 200 chars rewritten to ≤200, preserving every mechanic, number, and the class voice. Full global spell-card QA is now **0 errors / 0 warnings** across all 21 classes (1,026 spells).
