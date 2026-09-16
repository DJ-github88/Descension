# Berserker — Deep Dive

- Date: 2026-09-13
- Auditor: Phase 1 pilot (agent-assisted tree authoring, validated)
- Status: **implemented — awaiting Daniel review**

## 1. Scores (0–3 per dimension; target >= 24/30, no dimension <= 1)

| # | Dimension | Score | Evidence |
|---|---|---|---|
| 1 | Identity & fantasy | 3 | Hunger Pact lore across four traditions (memory / geothermal / faith / alchemy) is the strongest in the roster; unique vocabulary (Blood-Heat, Battle-Trance, Death's Door, Metabolic Burnout) |
| 2 | Group function & exclusive utility | 2 | Exclusive territory = dual-pressure threshold combat; group value concentrated in Warlord tree (galvanize/war cries). Base kit has little party utility |
| 3 | Resource loop design | 3 | Rage 0–100 with tier states, floor starvation (2 rounds no melee -> -10/round + Agility disadvantage) and ceiling burnout; healing lockout at 21+ is a real, legible cost; talents now feed/spend the bar |
| 4 | Spell-curve quality | 1 | 33 spells; levels 2–10 sit at 2–3 options, below the >=4 floor. Levels 3/6/7/8/9 have only 2 options (no real choice). Level 7 has 1 non-damage option. **Content additions queued** |
| 5 | Utility identity per level | 2 | L1 is excellent (9 options, strong utility: detection, forge-hands, rally, stance toggles). Mid/late levels are mostly damage with thin utility |
| 6 | Combat decision density | 3 | Heat management, execute windows, stance toggles, self-damage tradeoffs, DR bypass at low HP — real round-to-round decisions |
| 7 | Talent-tree integration | 3 | Was 3 broken 38-pt stubs; now 3 complete 50-pt trees (8/6/6/5/5/5/15), validator 0 errors/0 warnings, real icons, every ACTIVE spends or generates Rage |
| 8 | UI expression | 2 | Bar is excellent (fang sectors, presets, states, now owner-gated). Tooltip remains hardcoded (planned data-driven pass) and tree prose mixes "Heat"/"Rage" |
| 9 | Anti-overlap distance | 2 | Cap-pressure cluster C1 (Harbinger/Pyrofiend/Spellguard/Chronarch/Lunarch): Berserker's dual pressure is distinct, but "vent before cap" texture must stay differentiated in Phase 2 |
| 10 | Beginner legibility | 2 | Loop is clear; spec name collision resolved (spec renamed Savage, resource stays Rage); subtitle copy-paste bug fixed |
| | **Total** | **23/30** | Below target until spell floor is filled |

## 2. Utility Ledger row

- Primary / secondary role: DPS / Bruiser
- Exclusive territory: dual-pressure resource (starvation floor + burnout ceiling); sustain through aggression; near-death DR bypass
- Conflicts to resolve: C1 cap-pressure cluster (failure-state shape), Shaper stance toggles (Berserker tempers the same toolkit; Shaper morphs it)
- Resolution: keep; sharpen in Phase 2 C1 pass

## 3. Findings

### Talent trees (implemented this session)
- All three wired trees were incomplete stubs (15 nodes / 38 pts) with 6–10 validator errors each: missing cooldowns on ACTIVE ranks, `primaryDamage` without `damageTypes`, invalid `category: 'heal'`, free-cast actives.
- Now each tree is 18 nodes / 50 pts, tiers 8/6/6/5/5/5/15, validator 0 errors / 0 warnings, every icon a real local asset, every ACTIVE pays its own cost text.
- New T7 capstones:
  - **Savage**: Hemorrhagic Ruin (5), Bloodprice Apotheosis (3), High-Heat Burst (3)
  - **Juggernaut**: Calcified Apotheosis (5), Reactive Spine Mantle (3), Geothermal Ironhide (3)
  - **Warlord**: Wounds Are Orders (5), Terror Is Policy (3), Communion of Scars (3)
- Retired candidates: `berserkerPrimalRage.js`, `berserkerBloodFrenzy.js`, `berserkerSavageInstincts.js` are valid 50-pt fossils of an older spec set (Primal Rage / Blood Frenzy / Savage Instincts), unreferenced by `TALENT_TREES`. Kept on disk pending review.

### Spellbook
- 33 spells; pools now integrity-clean. Floor gaps: L2 (3), L3 (2), L4 (3), L5 (3), L6 (2), L7 (2, 1 non-damage), L8 (2), L9 (2), L10 (3).
- Needed: ~10 additions, at least 2 non-damage picks at L5 and L7 (a roar/command utility, a survival utility, a party-enabling pick).
- ID prefix mixing (`bsk_*` vs `berserk_*`) — cosmetic tech debt, deferred.

### Resource / data
- `classResources` Berserker entry: id `bloodHeat`, display `Rage`, short `BLOOD-HEAT`. Display-vs-lore naming drift remains a Phase 3 decision.
- Spec naming: classData spec `savage` was named "Rage" (collided with the resource); renamed to **Savage**. Subtitle fixed from "Three Paths of Decay" (copy-paste from Plaguebringer) to "Three Paths of the Hunger Pact".
- Passives in pick pools: `calloused_hide` / `boiling_veins` (stance toggles) at L1 and `blood_frenzy` at L7 — decision needed: stances may be legitimate picks; class weakness/passives must not be.

## 4. Change list

| Item | Action | Rationale | Status |
|---|---|---|---|
| berserkerSavage/Juggernaut/Warlord trees | fix + complete to 50 pts | Broken stubs were the live UI content | done |
| T7 capstones | add 9 named capstones (3/tree) | House T7 shape: 1 ultimate + rankables, 15 pts | done |
| ACTIVE talent resource costs | add rage/health costs | Kill free-cast drift; tie talents to the bar | done |
| Legacy icons (`ability_*`) | replace with local assets | Legacy icons silently fell back to generic runes | done |
| Spec `savage` name "Rage" | rename to Savage | Collided with resource name | done |
| Spec subtitle "Decay" | fix to Hunger Pact | Copy-paste bug | done |
| Spell floor L2–L10 | add ~10 spells incl. 2 non-damage at L5/L7 | Charter floor (>=4 options, >=2 non-damage) | queued |
| Fossil trees (Primal Rage etc.) | deleted | Older spec set, unreferenced (Daniel approved) | done |
| Heat vs Rage tree prose | unified on Rage | Tooltip/prose consistency | done |
| Passive stance toggles in pools | keep toggles; move weaknesses | Stances are real picks; weakness passives stay out (Daniel approved) | done |

## 5. Evidence

- `npm run audit:classes -- --class Berserker`: 0 integrity errors; free-cast talents 42 -> 0; floor gaps listed above.
- `npm run validate:talent-trees`: 66 valid / 5 invalid (was 63/8); Berserker all valid; remaining = Lunarch x3, Martyr Ironclad, Warden Monolith.
- `npm run validate:classes`: 0 issues; spell-qa 0.
- Jest: 19 resource-bar suites / 114 tests + 12 talent tests pass.
- Playwright: pending (bar tooltip review with Daniel).

## 6. Mind memory

- `class-phase0-tooling-and-fixes-2026-09-13`, `class-system-audit-snapshot-2026-09-13`
- Pilot memory to follow on approval.

## 7. Spell-level format & flavor pass — 2026-09-16

Tool: `scripts/spell-card-qa.mjs` (deep parsed-data render-contract audit; see
`docs/class-audits/spell-card-qa-report.md`). **Before: 27 errors / 50 warnings. After: 0 errors /
24 warnings** (all 24 remaining are descriptions >200 chars — verbosity backlog, deferred).

### Fixed (card-breaking)

| Spell | Issue | Fix |
|---|---|---|
| `bsk_hunger_scent` | `utility` with no config | added `utilityConfig` (perception/blood-trail, 3-mile track) |
| `bsk_caldera_warmth` | `utility`+`buff` with no configs | dropped redundant `buff`; added environment `utilityConfig` (15ft allies, 4h) |
| `bsk_arterial_burst` | `buff` with no config | added `buffConfig` (+2 AP / +10ft, 1 round, 1d6 self-damage) |
| `berserk_boiled_blood_constitution` | `buff` with no config → "No stats configured yet" | dropped redundant `buff`; stays utility (environment) — the screenshot bug |
| `berserk_unbroken_will` | `buff` with no config | dropped redundant `buff`; stays utility (social) |
| `bsk_caldera_slam` | `crowd_control` label, no control config | renamed to `control` + knockdown `controlConfig` |
| `berserk_skull_cleaver` | legacy dice shape, `MELEE_ATTACK`, thin control | `2d8 + strength`, `damageTypes`, `DICE`, daze effects[] |
| `berserk_rending_flurry` | legacy dice shape, thin DoT | `3d6 + strength`, `DICE`, bleeding `debuffConfig.effects[]` |
| `berserk_intimidating_shout` | `debuff` with no config, `SAVING_THROW` | added shaken debuff (spirit save, -2 attacks/checks) + control effects[]; resolution `SAVE` |
| `berserk_blood_frenzy_rush` | `utility` missing, buff no stats | added cleanse `utilityConfig`; buff now movement statModifier + effects[] |
| `berserk_bone_shatter` | legacy dice shape, thin debuff | `3d10 + strength`, `DICE`, Durability -2 penalty |
| `berserk_war_cry_dominance` | buff no stats | damageIncrease effects[] + +2 damage statModifier; knockback effects[] |
| `berserk_cleaving_cyclone` | legacy dice shape | `4d8 + strength`, `DICE` |
| `berserk_titanic_endurance` | buff not gated, no stats | added `buff` type; temp HP 25% + stun immunity effects[] |
| `berserk_spine_breaker` | legacy dice shape, thin control | `5d8 + strength`, `DICE`, pinned/incapacitated effects[] |
| `berserk_juggernaut_charge` | legacy dice shape, thin control | `4d10 + strength`, `DICE`, prone effects[] |
| `berserk_blood_boil_aura` | `school:'fire'`, buff no stats, `debuff` with no config | `ember` school/description; weapon-ignite buff + aura burn debuff |
| `berserk_world_render` | legacy dice shape, `SAVING_THROW`, thin control | `6d10 + strength`, `DICE`, difficult-terrain zone effects[] |
| `berserk_indomitable_spirit` | buff no stats | death-prevention effects[] (status immunity + 1 HP floor) |
| `berserk_avatar_of_slaughter` | buff missing, empty transformation | buffConfig (armor-break + regen) + full `transformationConfig` (newForm, description, grantedAbilities) |

Drive-by build fix (pre-existing, unrelated): `minstrelData.js` 3 formulas used banned
`charisma` → `spirit` (24 other Minstrel formulas already use spirit). `npm run validate:classes`
was failing on it before this pass.

### Flavor / class-fit review (proposals — Daniel decides, no content changes made)

- **Format-only group** (`skull_cleaver`, `rending_flurry`, `bone_shatter`, `cleaving_cyclone`,
  `spine_breaker`, `juggernaut_charge`, `world_render`): pure physical violence with Rage costs,
  on-identity for the Flesh-Toll economy. No retheme needed, only the format migration above.
- **`berserk_world_render` (L9)**: reads as generic earthquake. Proposal: retheme toward
  caldera/forge imagery (e.g. "Caldera Collapse") to keep Nordhalla/Vault vocabulary. Mechanically
  unchanged.
- **`berserk_avatar_of_slaughter` (L10)**: now concrete; name is generic. Proposal: give it a
  Hunger Pact name at review (e.g. reference the Forge or the Hunger Winter). Daniel decides.
- **`bsk_caldera_warmth` vs `berserk_boiled_blood_constitution`**: deliberate self-vs-allies,
  8h-vs-4h split of environmental heat/cold hardening. Overlap is intentional asymmetry; keep, but
  keep both texts distinct (they are).
- **`bsk_arterial_burst` (arterial surge)**: only action-economy lever in the kit (+2 AP self);
  good decision texture. Watch in the anti-overlap pass vs Martyr/Chronarch AP manipulation.
- **Out-of-combat suite** (`hunger_scent`, `caldera_warmth`, `boiled_blood`, `forge_touched_hands`,
  `pain_blind`, `unbroken_will`): strong Hunger Pact survival identity for an all-combat class;
  recommend keeping all six as L1–L3 identity picks.
- **Shout ladder** (`intimidating_shout` L3 fear vs `war_cry_dominance` L6 party damage): distinct
  enough; check Dominance vs Warlord tree's galvanize during talent review.

### Evidence (this pass)

- `node scripts/spell-card-qa.mjs --class Berserker`: 0 errors / 24 warnings (long descriptions)
- `npm run validate:classes`: structure 0 issues; audit 0 integrity errors / 0 floor gaps / 0 warnings
- `node scripts/spell-qa.mjs`: 0 issues
- Jest `allGuides.test.js`: 107 passed
- Playwright card review: pending (Daniel) — `Boiled-Blood Constitution` should now show only the
  Utility block (no "No stats configured yet")

### Pass 4 — 2026-09-16 (verbosity trim)

24 descriptions over 200 chars rewritten to ≤200, preserving every mechanic, number, and the class voice. Full global spell-card QA is now **0 errors / 0 warnings** across all 21 classes (1,026 spells).
