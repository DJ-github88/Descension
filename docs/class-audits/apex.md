# Apex — Deep Dive

- Date: 2026-09-13
- Auditor: Phase 1 pilot (agent-assisted tree polish, validated)
- Status: **implemented — awaiting Daniel review**

## 1. Scores (0–3 per dimension; target >= 24/30, no dimension <= 1)

| # | Dimension | Score | Evidence |
|---|---|---|---|
| 1 | Identity & fantasy | 2 | The Silent Hunt, Quarry marks, companion bond, fog stalker — strong predator fantasy, but it overlapped Warden's designate-and-execute at the decision-texture level until sharpened |
| 2 | Group function & exclusive utility | 2 | Real tracking/scouting tools (Beast Scout, Fog Truesight, vibration reading) and a companion; no reserved group verb yet — candidate: the hunt's information layer |
| 3 | Resource loop design | 3 | Marks (0–5) built by tracking/flanking/striking the Quarry, spent on finishers; companion HP as a second track; turn cap (3, Beastmaster 4); decay and companion-death rules |
| 4 | Spell-curve quality | 1 | 46 spells but L4–L10 sit at exactly 3 options; non-damage is 1 per level from L3 down to L10. Needs ~8 additions |
| 5 | Utility identity per level | 2 | L1–L2 are rich (11 and 8 options with scouting, stances, companion tools); utility evaporates mid/late |
| 6 | Combat decision density | 2 | Mark management, companion positioning, stealth windows, executes — but a large share of spells is straight damage |
| 7 | Talent-tree integration | 3 | Trees were already valid 50-pt builds; capstone rank-3 clones fixed (crit range / bounce / companion cleave), all 41 legacy icons replaced with verified assets, validator 0 errors/0 warnings |
| 8 | UI expression | 2 | Bar is faithful (marks grid, companion HP, Hunt/Guard/Stalk stances) and matches `apexData` generation tables; tooltip status is thin and there is no spec picker |
| 9 | Anti-overlap distance | 2 | C2 with Warden: Apex must own *the chase* (mobility, information, companion), Warden *the cage* (tether, drag, lockdown). Recorded; deepen in the Warden pilot |
| 10 | Beginner legibility | 2 | Clean loop (mark → stack → execute) hampered by thin late pools and muddy spec labels (now aligned) |
| | **Total** | **21/30** | Below target until the spell floor is filled and C2 differentiation lands |

## 2. Utility Ledger row

- Primary / secondary role: DPS / Skirmish
- Exclusive territory (draft): the **mobile hunt** — cross-terrain tracking, information warfare, companion scouting, ambush from fog; the Quarry is a target chosen across space, not a leash
- Conflicts to resolve: C2 with Warden (both are "designate one enemy, build, execute")
- Resolution: Apex = the chase; Warden = the cage. Locks in the Warden pilot.

## 3. Findings

### Talent trees (implemented this session)
- All three trees were already structurally valid (3 x 50 pts, tiers 8/6/6/15+ rankables), with one warning each: the `*_t7_*_doctrine` capstone rank 3 resolved identically to rank 2.
- Fixed escalations: Shadowblade Doctrine — glaive crits on 19–20; Bladestorm Doctrine — glaives bounce to 1 extra target; Beastmaster Doctrine — companion attacks cleave to 1 extra target.
- 41 legacy `ability_*`/`spell_*` icons replaced; 57 icon fields re-verified against `public/assets/icons/abilities` (56 unique paths, 0 missing).
- `talentTrees/index.js` now exports the Apex and Animist trees (they were absent from the barrel).

### Specs / naming
- `apexData` spec names were misaligned and collided with the resource: `bladestorm` was named "Marks" (same as the resource), `beastmaster` "The Twin-Fang Predator", `shadowblade` "The Mist-Stalker". Aligned all three to the UI names used by `classSpellCategories` + `classResources`: Bladestorm / Beastmaster / Shadowblade. Ids unchanged.
- Optional later improvement: restore the epithets (Twin-Fang Predator / Mist-Stalker) across *all* sources if Daniel wants richer tab labels — that requires touching classData + classSpellCategories + classResources together.

### Spellbook
- 46 spells; floor gaps L4–L10 (all 3 options), and non-damage shortfalls at L3/L4/L5/L6/L8/L10 (1 each).
- Needed: ~8 additions, including a tracking/companion utility at L4–L6 and finisher alternatives late.
- Two non-stance weakness passives sit in pick pools: `hunt_bond_sickness` (L1), `hunt_pack_dependency` (L3) — move to fixed class traits in the Phase 2 spell pass.

### Resource / data
- No bar fidelity bugs found: `ApexResourceBar` reads marks/companion/stance from the prop and matches the generation table.
- C2 differentiation is the main identity work: the companion must be more than a damage pet — it is the hunt's information layer (scouting, tracking, flanking) and the class's exclusive utility.

## 4. Change list

| Item | Action | Rationale | Status |
|---|---|---|---|
| `*_doctrine` capstone rank 3 | hand-tune escalations | Validator warning: rank 3 == rank 2 | done |
| 41 legacy icons | replace with local assets | Silent fallback to generic runes | done |
| Spec names (Marks/Twin-Fang/Mist-Stalker) | align to Bladestorm/Beastmaster/Shadowblade | Name collision + 4-source drift | done |
| `talentTrees/index.js` barrel | add Apex + Animist exports | Missing exports (latent debt) | done |
| Spell floor L3–L10 | add ~8 spells incl. tracking/companion utility | Charter floor | queued |
| Weakness passives in pools | move to class traits | Policy: no weakness picks | queued |
| C2 differentiation vs Warden | companion-as-information identity pass | Anti-overlap | warden pilot |
| Tooltip/menu depth + spec picker | UI standardization pass | Thin status; no spec selection | queued |

## 5. Evidence

- `node vtt-react/src/utils/talentTreeValidator.mjs --file apex`: 3 valid / 0 invalid, 0 errors / 0 warnings.
- Repo summary: 53 files / 63 valid / 2 invalid (only Martyr Ironclad + Warden Monolith).
- `npm run audit:classes -- --class Apex`: 0 integrity errors; floor gaps + 2 weakness-pick warnings listed above.
- `npm run validate:classes`: 0 issues; spell-qa 0.
- Jest: resource-bar suites (incl. Apex) 114 tests + 12 talent tests pass.

## 6. Mind memory

- `apex-pilot-deep-dive-2026-09-13`, `class-deep-dive-policies-2026-09-13`
