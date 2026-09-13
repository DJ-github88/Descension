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
