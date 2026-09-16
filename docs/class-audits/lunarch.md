# Lunarch — Deep Dive

- Date: 2026-09-13
- Auditor: Phase 1 pilot (agent-assisted tree authoring, validated)
- Status: **implemented — awaiting Daniel review**

## 1. Scores (0–3 per dimension; target >= 24/30, no dimension <= 1)

| # | Dimension | Score | Evidence |
|---|---|---|---|
| 1 | Identity & fantasy | 3 | Rift-parasite host cycling four lunar phases; the parasite feeds on hope/anticipation/ecstasy/memory. One of the strongest class fantasies in the roster |
| 2 | Group function & exclusive utility | 2 | Sanguine Warden is a real party healer; Hollow/Silence lean personal. Exclusive territory = phase-state manipulation, but no reserved group verb yet |
| 3 | Resource loop design | 2 | Phases (0–4) auto-advance every 3 rounds, shift deals 2d6 blight + Transition Shock, cannot be opted out. Hugely distinct, but **low player agency** — the weakest point of the class. New trees now spend/require/advance phases, which is the first fix |
| 4 | Spell-curve quality | 1 | 28 spells; L3–L10 sit at 1–3 options (L10 has 1). Below the >=4 floor; needs ~16 additions |
| 5 | Utility identity per level | 2 | Utility exists (gravity pull, eclipse aegis, symbiote overdrive) but thins out late; L6/L9 have zero non-damage options |
| 6 | Combat decision density | 3 | Phase timing, Full Moon windows, Delirium risk, Hollow Marks, silence zones, self-sear healing — strong moment-to-moment choices |
| 7 | Talent-tree integration | 3 | Was 3 broken 38-pt stubs (one with 31 errors); now 3 x 50-pt trees, validator 0 errors/0 warnings, real icons, mana + `lunar_phase` costs |
| 8 | UI expression | 2 | Lunar dial bar is strong; `classResources` Lunarch tooltip is thin (title/description only) and phase themes in config drift from classData |
| 9 | Anti-overlap distance | 2 | C1 cluster with Chronarch ("clock/backlash"), but involuntary cycling vs authored time control is a real distinction once prose teaches it |
| 10 | Beginner legibility | 2 | The forced-cycle concept is hard for a new player; the bar carries a lot of the teaching burden |
| | **Total** | **22/30** | Below target until the spell floor is filled and phase agency is addressed |

## 2. Utility Ledger row

- Primary / secondary role: Control / Support
- Exclusive territory: the **forced celestial cycle** — involuntary phase shifts that rewrite your toolkit each cycle; gravity fields
- Conflicts to resolve: Chronarch (authored time control vs involuntary nature); needs a reserved group verb (candidate: phase-locking zones that also protect allies)
- Resolution: keep; deepen in Phase 2 C1 pass

## 3. Findings

### Talent trees (implemented this session)
- All three wired trees were incomplete 38-pt stubs with 7–31 validator errors each (category `'heal'`, `spellType: 'REACTION'`, missing cooldowns, missing damageTypes, free-cast actives).
- Now each is 18 nodes / 50 pts, tiers 8/6/6/5/5/5/15, validator 0 errors / 0 warnings, real local icons, every ACTIVE carries mana costs and phase interaction where its text requires it.
- New T7 capstones:
  - **Hollow Sentinel**: Starfall Excision (5), Delirium Verdict (3, Full Moon only), Non-Euclidean Predator (3)
  - **Silence-Speaker**: Brood Moon Ascendant (5), Eclipse of the Dead Moon (3, Waning only), Apotheosis of the Star Plague (3)
  - **Sanguine Warden**: Sanguine Tithe (5), Bloodmoon Transfusion (3), Broodmother's Bargain (3, advances the phase)
- `lsw_t4_celestial_rebirth` re-encoded from invalid `REACTION` to `ACTIVE` + `actionType: "reaction"` + `reactionTrigger` (house pattern).
- Orphan fossils (`lunarchMoonlightSentinel/StarfallInvoker/MoonwellGuardian`) deleted per the approved policy; legacy alias mappings and backdrops removed from `talentTreeData.js` for both Lunarch and Berserker.

### Spellbook
- 28 spells; floor gaps L3 (3), L4 (3), L5 (2), L6 (2), L7 (2), L8 (2), L9 (2), L10 (1).
- Needed: ~16 additions, including non-damage picks at L5/L6/L7/L9.
- L1 pool contains 3 **non-stance passives/weaknesses** (`lunarch_celestial_rejection`, `lunarch_phase_lock`, `lunarch_transition_shock`) occupying pick slots — move to fixed class traits in the Phase 2 spell pass.

### Resource / data
- Phase agency is the class's design risk: everything happens on a timer the player cannot influence. New talents now require specific phases or advance the cycle; recommend defining a player-facing manual shift cost (config has `manualShiftCost: 8` with no resource attached) and hold/extend options in Phase 2.
- Phase theme drift: `classResources.js` config says New = Defense, Waxing = Healing, Full = Offense, Waning = Efficiency; `lunarchData.js` says Waxing = damage/speed, Waning = vampiric healing. Reconcile in the UI/tooltip pass.
- Lunarch `classResources` tooltip block is title/description only (thin) while the bar carries full copy — planned data-driven tooltip pass.

## 4. Change list

| Item | Action | Rationale | Status |
|---|---|---|---|
| lunarch{HollowSentinel,SilenceSpeaker,SanguineWarden} trees | fix + complete to 50 pts | Broken stubs were the live UI content | done |
| T7 capstones | add 9 named capstones | House T7 shape: ultimate + rankables, 15 pts | done |
| ACTIVE talent resource costs | add mana + lunar_phase costs | Tie talents to the phase loop; kill free-cast drift | done |
| Celestial Rebirth REACTION | re-encode as ACTIVE + reaction fields | Validator/house schema | done |
| Legacy icons | replace with local assets | Fallback to generic runes | done |
| Fossil trees + alias mappings | delete | Older spec set, unreferenced (approved policy) | done |
| Spell floor L3–L10 | add ~16 spells incl. non-damage gaps | Charter floor | queued |
| L1 passive/weakness picks | move to class traits | Policy: no weakness picks | queued |
| Phase agency + manual shift cost | design hold/extend/shift options | Class's weakest point (player agency) | queued |
| Phase theme drift (config vs data) | reconcile | Player-facing contradiction | queued |

## 5. Evidence

- `npm run audit:classes -- --class Lunarch`: 0 integrity errors; spec drift cleared; floor gaps listed above.
- `npm run validate:talent-trees`: 53 files / 63 valid / 2 invalid (only Martyr Ironclad + Warden Monolith remain).
- `npm run validate:classes`: 0 issues; spell-qa 0.
- Jest: 19 resource-bar suites / 114 tests + 12 talent tests pass (LunarchResourceBar included).
- Playwright: pending (bar/phase tooltip review with Daniel).

## 6. Mind memory

- `lunarch-pilot-deep-dive-2026-09-13`, `class-phase0-tooling-and-fixes-2026-09-13`

## 7. Spell-level format & flavor pass — 2026-09-16

Tool: `scripts/spell-card-qa.mjs` (deep parsed-data render-contract audit). **Before: 31 flagged /
27 errors. After: 0 errors / 18 warnings** (all 18 are descriptions >200 chars — deferred).

### Fixed (card-breaking)

| Spell | Issue | Fix |
|---|---|---|
| `waxing_crescent_scythe` | `debuff` with no config | added Waxing Bleed `debuffConfig` |
| `eclipse_aegis` | `buff` with no config | added absorber `buffConfig` (absorb + melee-shatter blind); shieldConfig kept |
| `lunar_tide_pull` | `crowd_control`, no control config | renamed to `control` + forced-movement pull config |
| `starlight_delirium` | `crowd_control`, no control config | renamed to `control` + mind-control effects (spirit save) |
| `gravity_singularity` | `crowd_control`, no control config | renamed to `control` + restraint/pin config |
| `symbiote_overdrive` | `buff` with no stats | empowerment effects (+4 DR, +3d8 spell, crit 18–20, expiry self-damage) |
| `celestial_symbiosis` | `buff` with no stats | empowerment effects (free phase select, half mana, 3 rounds) |
| `tidal_scourge` | legacy dice shape, `radiant`, `SAVING_THROW` | `3d6 + intelligence` sacred, `DICE`, knockback effects[] |
| `silence_shroud` | buff only-duration → "No stats configured yet" | effects[] (incoming attacks disadvantage, no LoS targeting, +3 stealth) |
| `lunar_radiance_burst` | legacy dice shape, `radiant`, `SAVING_THROW`, blind with no detail | `4d8 + intelligence` sacred, `SAVE`, blind effects[] + Constitution save |
| `parasitic_transfusion` | healing dice shape, buff no stats | `4d8 + intelligence` heal; +2 Durability buff |
| `phase_displacement` | `utility` no config + buff not gated | added `buff` type, utilityConfig (phase walk), effects[] |
| `gravity_inversion_field` | `utility` no config, `radiant`, `SAVING_THROW` | school arcane, `SAVE`, levitation effects[] + Agility save |
| `eclipse_barrier` | buff not gated | added `buff` type + absorb/cleanse/reflect effects[] |
| `coronal_ray` | legacy dice shape, `radiant`, `RANGED_ATTACK` | `5d10 + intelligence` sacred, `DICE` |
| `astral_projection_anchor` | `utility` no config, buff no stats | projection effects[] + spirit-flight utilityConfig |
| `apogee_lance` | legacy dice shape, `radiant`, `RANGED_ATTACK`, thin control | `6d10 + intelligence` sacred, `DICE`, stasis effects[] |
| `null_horizon` | buff not gated, thin control | added `buff` type; zone silence + 50% magic-mitigation effects[] |
| `phase_restoration` | healing dice shape, `radiant` | `6d8 + intelligence` heal (`direct`, DICE); school sacred |
| `cosmic_annihilation` | legacy dice shape, `radiant`, `SAVING_THROW` | `8d10 + intelligence` sacred, `DICE`, blast-push effects[] |
| `avatar_of_the_dead_moon` | `buff` no config, empty transformation | buffConfig (flight/immunity/free casting) + full celestial transformation with 3 granted abilities |
| `syzygy_cataclysm` | legacy dice shape, `SAVING_THROW`, thin control | `6d8 + intelligence` wyrd, `SAVE`, stun effects[] + Strength save |

### Class-wide damage-type correction (ember/radiant → sacred)

The class's star/moonlight damage was encoded as **ember** (a generator artifact) and **radiant**
(legacy alias) across the whole kit, contradicting its own text:
- phase riders said "1d4 sacred" while `damageTypes` said `ember` (e.g. Phase Tear, Silence Rend);
- the class play-example mixed "1d8 sacred … +2d8 sacred … **42 ember damage**" in one block;
- expanded L4–L10 descriptions said "sacred damage" over `ember` data.

Applied: every `"ember"` schema token (school/damageTypes/tags), prose damage statement, and
`radiant` → **sacred**; class identity `damageTypes` now `["sacred","blight","wyrd"]`. The only
surviving `ember` is Supernova Collapse's intentional mixed `["sacred","ember"]` (its description
says both). Supernova Collapse, class lore text at lines 130/365/383/680/702/1114/1115/1864 and all
rider text were corrected in the same sweep.

### Flavor / class-fit review (proposals — Daniel decides, no further content changes made)

- `binding_horror`: swept to sacred school, but the fiction is parasitic tendrils feeding on a
  target — consider **blight** school instead.
- `crescent_blade`: swept to sacred, but it is a *crystallized secretion blade* — consider
  **slicing** if the damage is meant to be physical.
- `hollow_sight`: swept to sacred; the sigil/mark fantasy could support **wyrd** instead.
- `parasitic_bolt` phase riders now read "+1d4 sacred / +1d8 sacred" — consistent with the phase
  tables; no balance change intended beyond type correction.
- Open from the deep dive: phase-theme drift (config says Waxing=Healing/Waning=Efficiency, class
  data says Waxing=damage/speed/Waning=vampiric) and the manual phase-shift agency cost.

### Evidence (this pass)

- `node scripts/spell-card-qa.mjs --dump Lunarch`: 0 errors / 18 warnings (long descriptions)
- `npm run validate:classes`: structure 0 issues; `audit:classes --class Lunarch` 0 integrity / 0 floor gaps / 0 warnings
- `node scripts/spell-qa.mjs`: 0 issues (no legacy aliases, no non-canonical types)
- Playwright card review: pending (Daniel)

### Pass 4 — 2026-09-16 (verbosity trim)

18 descriptions over 200 chars rewritten to ≤200, preserving every mechanic, number, and the class voice. Full global spell-card QA is now **0 errors / 0 warnings** across all 21 classes (1,026 spells).
