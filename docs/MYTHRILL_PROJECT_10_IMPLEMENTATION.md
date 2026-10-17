# Project 10: First-Table Rules and Execution Contract (implementation report)

**Integrated status, 2026-10-16:** the independently reviewed bundle is applied to `D:/VTT`. Sol's retained session-hook delta has a bounded independent PASS; its build/App dependency is closed. Focused 48 suites/477 tests, final integrated production build, Laws/cache/tracker browser checks and bounded P8/P9 production-App smoke pass. Evidence and remaining human/operational gates are recorded in [MYTHRILL_P10_INTEGRATION_20261016.md](MYTHRILL_P10_INTEGRATION_20261016.md) and the live engineering ledger.

The implementation/review account below came from Claude's isolated workspace. Its original pending dependency is historical, not an instruction to wait for Sol. Nothing was committed, pushed or deployed by this integration.

Scope: original P10 in `MYTHRILL_NEXT_PHASE.md` §26. The rev3 proposal and the combat Laws draft were used only as inputs for the creator decisions below.

## Creator decisions applied

| Decision | What changed |
|---|---|
| 1A: AP baseline | PCs refill to 4 AP at the start of each turn. Initiative is rolled once per fight. A basic weapon strike costs 2 AP. Named abilities keep their authored costs (Feather Slash 1 AP; no blanket cast cost). Heritage AP differences are set aside and documented. Saved characters and temporary pools are kept, with no silent reset. Owner: `src/data/firstTableRules.js`. |
| 2A: defense and elixir Laws | The approved defense and elixir rules are published. Armor Score and the soak die are removed. Unresolved items are marked `[Open: …]` and proposals `[Proposed: …]`. The pages say what is played by hand today; the P8/P9 automation stays as accepted. There are no reaction timers, no defense automation and no elixir execution. |
| Armor / AC | Armor score, AC and armor rating are obsolete for characters and creatures, including hidden ratings. The displays, explanations and controls are removed. Legacy saved bytes are untouched and never converted to DR. Creatures mitigate through flat DR, resistances/vulnerabilities and authored defensive effects. Creature Defend improves DR, is applied by the GM, and its amount, cost and duration are `[Open]`. |
| Defaults H6, H7, H9, H13 | No container-nesting claims. Current encumbrance behavior is documented. Turns are cooperative and the GM confirms cross-actor results. The release gate stays open. |

## Change set (38 files)

- **Laws and canon:** `rules.json`, `lore.json`, three class canon passages (Arcanoneer, Shaper, Minstrel), and `versions.js`, which bumps rules and lore to 2.3.0. A new First Table Reference page.
- **AP baseline:** `firstTableRules.js` (new). `raceData`, `characterUtils`, `CharacterStats`, `weaponIntegration`, `universalCombatSpells`, `silentRoomHydration` and `combatStore` read from it. Initiative is rerolled only in the explicit "initiative" mode.
- **Armor/AC display removal:** 19 UI and utility files. Display-only; no saved field is deleted or converted.
- **Skills and weapons pages:** `SkillsDisplay.jsx`, `WeaponsRulesDisplay.jsx` and the matching `rules.json` pages (see below).
- **Tests:** `firstTableLaws.test.js` checks the Laws against their runtime owners and parse-guards the edited files; `FirstTableLawsRendered.test.jsx` renders the real RulesPage on 8 codex views. `combatStore`, `LibraryBrowserModal` and `lootThematicExcerpt` tests are updated.
- **Reproducible:** `p10_apply.py` verifies its text replacements and aborts before writing on a mismatch. At integration, all existing target files were additionally compared with HEAD because JSON `set`/`insert` operations do not guard every original value. All 38 outputs pass the reviewed diff's reverse-apply check.

## Verification (isolated workspace only; retained implementation account)

The workspace was GitHub `master` 8ea1abf with P10 applied. These are Claude's results; current Windows results are in the integration report.

- **P10 suites:** `firstTableLaws` passes 42/42, including parse guards. The rendered Laws test passes 8/8: Combat Basics, Inventory, Attacks & Damage, Combat Tracker, First Table, Skills (both toggles), Advanced Weapon Mastery, Weapons.
- **Focused suites:** 87 suites and 982 tests pass, including combatStore, silentRoomHydration, featherSlash, spellConsequence, p7BoundsConsumers; TalentTreeContent, RulesPageCodexRoute, ActionBar/SpellActionBar, SettingsWindow, Step7SkillsLanguages; all waveA/B/C persistence suites, TokenTooltips, CreatureAbilityFanOut, BestiaryDisplay.
- **Isolated lint:** reported no new findings, 0 errors, incumbent warnings. Current checkout's actual lint baseline is separately recorded; do not substitute this isolated claim for it.
- **Independent reviews:** main change PASS, two text defects fixed and asserted. Skills/weapons first review FAIL for a non-authored local codex table; fixed with a rendered regression. Re-review PASS-WITH-FIXES with fixes applied. Confirmed-die wording check PASS-WITH-FIXES: "an 8 triggers" became "face 8 is…" without implying a lookup rule.
- The bundle includes [P10_FIRST_REVIEW_REPORT.md](P10_FIRST_REVIEW_REPORT.md). Later skills/weapons review verdicts are recorded in this implementation account; separate full review artifacts were not present in the supplied archive.

## Skills and weapon proficiency (creator clarifications, 2026-10-16)

### Creator-confirmed rules incorporated

- **Growing proficiency die:** d4 Untrained, d6 Novice, d8 Trained, d10 Apprentice, d12 Adept, d20 Expert and Master. Read from authored `WEAPON_TYPE_TIERS` and asserted. Fixed-d8 weapon wording was conflicting existing material, not an alternative rule.
- **Simple (Standard): manual, narrative advancement.** Players set and update rank on the sheet as training/story warrants; no level progression or GM approval requirement. No new rank workflow.
- **Advanced:** authored-task advancement only, outside first-table rules. Rolls/outcome tables are the same; no separate combat procedure.
- **Point-buy confirmed for initial allocation.** Current code charges 1/2/3/4/5/6 per rank step (Master totals 21); pool 10 plus 1 per Intelligence above 10; background skills and the one class skill start Novice, paid from that pool. Exact budget and bonus policy remain `[Open]`.
- **Weapon identity:** attack card, proficiency with the particular weapon type, and that weapon's own outcome table. No generic accuracy/damage bonus, no Armor Class, no improvised weapon example.
- Authored AC/to-hit/ignore-armor-DR outcomes remain unchanged and visibly `[Open]`; they are not translated into another rule.

### Player-facing pages corrected

**Skills, both toggles:** self-set ranks, current point-buy with budget open, no Standard quest counts, Advanced as authored-task advancement, growing die on the weapon's own authored table. Removed static d8/d6-type/step-down/richer-table/"No flat DR" claims. The Advanced Weapon Mastery codex view prioritizes authored faces over legacy local fallback text.

**Weapons:** "What Makes a Weapon", Proficiency Die d4–d20, faces 1–20 in both modes, Advanced as advancement only, `[Open]` AC/to-hit/lookup notes. Search data in `rules.json` matches these custom components; custom pages render title/description rather than the JSON sections.

### Still open within the confirmed rules (GM rules meanwhile)

1. Proficiency modifier, explosion, and mapping a result to faces 1–20.
2. Whether rank adds a flat +1…+6 check bonus in addition to setting the die.
3. Skill-check resolution: GM Difficulty Die with +5 attribute step-down and max = critical success, versus fixed DCs and exploding maximum.
4. Point-buy budget and bonus points. Current Intelligence term reads as 2 per modifier point; background/heritage bonus lists do not apply.
5. Creator-authored revisions to AC/to-hit/ignore-armor-DR weapon faces.

### Separately bounded follow-up — skill engine not repaired by P10

1. **Per-weapon rank storage:** `infoSlice.setSkillRank(skillId, rankKey)` ignores the weapon type passed by the sheet, so a single Weapon Mastery rank overrides per-weapon quest progress.
2. **Conflicting roll paths:** sheet Standard reads rank die plus modifier on faces 1–20; sheet Advanced/3D dice use legacy `weaponmastery_*_d8` rank tables. Legacy local Laws tables remain fallback only. The isolated report also described the old codex d8 detail as a residual; that description is superseded by its reviewed authored-face fix and rendered regression, not a second unresolved codex failure.
3. **Negative budget:** class-skill selection does not check remaining points.
4. **Misleading text outside P10 pages:** wizard Skill Quests/quest-count/free or race/background bonus help; sheet "Getting Better" says GM awards upgrades; `StepDurability.jsx` says all armor wears on 1–2 and crits ignore DR.
5. **Proficiency combat integration:** task progression derives rank from quests when no rank is stored; quest `unlocks` grant nothing; strikes and P8/P9 do not read proficiency.

## Integration provenance

Original isolated dependency: Sol had not reconciled the later live `useSessionManagement.js` delta or rebuilt/replayed that resulting source, and Claude could not check the offline PC. This integration directly inspected the online checkout, retained the hook unchanged, added its focused regression and obtained one bounded review of that seam. No renewed broad review of P10 was commissioned.

Bundle: `p10bundle-final.tgz`, SHA-256 `7eff31ec8f8aaf7e0d1b3a4df29e186448cac82bafefd9bb46d1cedb88be6c9e`; baseline HEAD `8ea1abff1d8c1f959b2d4a10e6b7ca73879c2ff2`. Original report, script, edit data and diff remain in the external extraction `D:/AppData/Temp/opencode/p10-integration-20261016/p10/`. Unrelated work and `server/firebase-service-account.json` remain untouched.
