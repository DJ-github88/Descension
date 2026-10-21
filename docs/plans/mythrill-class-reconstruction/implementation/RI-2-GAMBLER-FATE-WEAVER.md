# RI-2 — Gambler + Fate Weaver: complete delivery and Augur merger assessment

**Directly executable DeepSeek assignment, 2026-10-20.** Implement RI-2 only after RI-1 is accepted. RI-1 is **ACCEPT** for integration; do not reopen its review or change its accepted application code. This cohort delivers two complete reconstructed classes through the established class system and assesses the Augur merger. Application implementation is assigned to DeepSeek; the preparation session makes no application changes.

## Outcome

Gambler and Fate Weaver exist as distinct **development**, manual-tabletop classes in the ordinary catalogue, detail, creation, learning/progression, talent-tree, spell-library/card and resource-HUD surfaces. Each is a complete class package, not a six-ability dossier or UI mock. Existing Gambit and Augur characters, including Nereid Myrathil Augur, keep their IDs, spells, talents, resources, variants and saved state.

The Augur is not silently replaced. Every current Augur active spell, tree node, rank/spell mapping, variant and heritage edge receives an explicit keep/adapt/legacy-only disposition with exact source and destination IDs where a technique is carried into Fate Weaver. Auspex, sign-reading/material foci, Ill Omen and Hierophant content are preserved or intentionally assessed, never discarded for a tree quota. No Benediction/Malediction bank, Omen Debt, automatic migration or fourth Fate Weaver tree is introduced.

No new combat execution is claimed. Effects whose current engine support is absent remain explicitly manual/disabled and apply no AP, HP, movement, resource, custody or timing change.

## Source gate and content lock

### Accepted G1 / native-access amendment — 2026-10-20

Class HeadQ accepts the complete inline Gambler G1 lock: 40 optional records, 48 three-rank passive records, the unchanged six R1 payloads and signature mappings, all three capstones, and one House Compact parent wager with exactly two fixed legs. Phase 2A implementation is authorized; Phase 2B is not.

This bounded amendment supersedes the provenance-only Gambler access instructions below:

- Register **Gambler** in exactly `merryn_human` and `drall_fexric` using `HERITAGE_TRADITIONS` and `CLASS_PROVENANCE` in `vtt-react/src/data/classHeritageRegistry.js`. Preserve every other relationship.
- Preserve acquisition IDs `house_wager`, `initiation_survival`, `wager_discipline`, `finite_deck_training`. Native means a trained tradition, not a free power or automatic proof of apprenticeship.
- Explicit writable amendment paths: `vtt-react/src/data/classHeritageRegistry.js`, `vtt-react/src/data/__tests__/classHeritageRegistry.test.js`, `vtt-react/src/data/__tests__/heritageRosterCoverage.test.js`, and `vtt-react/src/data/__tests__/heritageEdgeContract.test.js`.
- Verified current registry baseline: **103** native relationships (102 blueprint relationships plus the accepted RI-1 Chaos Weaver pair). Phase 2A adds exactly two for **105**; Phase 2B retains 105 unless separately amended. The earlier 102→104 statement conflated blueprint and current registry counts; the first focused run exposed this stale expectation. Catalogue/provenance/portrait expectations remain 23/23/26/23/23 and 575 combinations after 2A; 24/24/27/24/24 and 600 after 2B. Aliases remain three and authored-edge classes remain 21.
- Mechanical heritage benefits remain pending; Gambler `heritageEffectsImplemented:false`. Do **not** add benefit/cost rows or edit `heritageEdgeContract.js` to satisfy coverage.
- Coverage must explicitly distinguish approved native access from pending mechanical edges. Pending pairs are `Chaos Weaver|drall_fexric`, `Gambler|merryn_human`, and `Gambler|drall_fexric`; this does not weaken coverage for other native pairs.
- Record G1's complete accepted mechanics in the Gambler authored package and Phase 2A manifest. Unsupported effects use the established manual-class projection, not invented executable opcodes.

**Codex loader scope correction (explicitly approved during Phase 2A):** add `vtt-react/src/components/rules/RulesPage.jsx` to the writable list for the single Gambler lazy-loader entry. The actual Codex route has an explicit loader allow-list, so registering the ordinary class index alone cannot render Gambler detail. No other route behavior is amended. Capture this file's entry hash before editing.

**Mounted-library scope correction (explicitly approved during Phase 2A):** add `vtt-react/src/components/spellcrafting-wizard/components/library/SpellLibrary.jsx` for a Gambler-only canonical talent projection. This consumer rematerializes talents independently of the tree/hook and otherwise creates legacy `talent-spell-*` identities and drops typed manual data. Reuse the complete canonical `node.spell`, exact grant/passive IDs and learned rank; retain existing Map deduplication. Leave legacy conversion and all Wizard schema/core admission paths unchanged. Capture the entry hash before editing and test the mounted library, not just its hook.

**Phase 2A delivery:** Implementation complete; focused verification passed; independent review deferred. Complete authored/projected manifest, node/rank tables, entry/current hashes, focused Jest/ESLint evidence and actual-route browser results are in `evidence/RI-2-gambler-fate-weaver/phase-2a/`. Phase 2B is in progress.

Read before editing:

- `../34_ROSTER_INTEGRATION_COHORTS.md` row 2 and the binding compatibility table.
- `../classes/gambler.md`, `../classes/fate-weaver.md`, `../classes/manifests/gambler-review-r1.json`, `../classes/manifests/fate-weaver-review-r1.json`, `../evidence/headq-seven-abilities.json`, `../evidence/headq-priority-compatibility.json`, `../classes/prophecy-cluster.md`.
- `../29_PRIORITY_REVIEW_RULES_AND_SERIALIZATION.md`, `../28_HERITAGE_REVIEW_AND_PRIORITY_ORIGINS.md`, `../02A_CLASS_LIFECYCLE_AND_SOURCE_MAP.md`, `CR-L1-AUTHORITATIVE-LIFECYCLES.md`.
- The accepted RI-1 implementation and evidence, especially `RI-1-CHAOS-WEAVER-INTEGRATION.md`, `data/classes/chaosWeaverData.js`, `data/classes/chaosWeaverIntegration.js`, `data/talentTrees/chaosWeaver.js`, its package/integration tests and `FINAL-REVIEW.md`.
- Actual legacy owners: `data/classes/gambitData.js`, `data/classes/augurData.js`, `data/talentTrees/gambit.js`, `data/talentTrees/augur*.js`, `data/augurResourceContract.js`, `data/classes/classReconstructionCompatibility.js`, `data/classHeritageRegistry.js`, `data/classResourceContracts.js`, `data/classResources.js`, `components/hud/ClassResourceBar.jsx`.
- Current templates: `data/classes/arcanoneerData.js`, `minstrelData.js`; `data/talentTrees/minstrel.js`, `arcanoneer.js`, `talentSystem.mjs`; actual class-detail, creation, level-up, talent, library and HUD consumers.

**Content-lock gate.** The R1 dossiers approve direction and core invariants; they do not approve a complete remaining library, full rank tables, final capstone names/tuning or native access. Before materializing missing records, the cohort must have an explicit content-lock table enumerating every optional, core, signature and capstone record, plus every three-rank passive record with its three rank values, stable node/spell IDs, level, tree, AP/mana, targets, durations, branch/downside, source and destination. Do not invent names, tuning or native edges to fill a count. If the content-lock table is incomplete, stop at the affected package boundary and return the exact missing rows; do not register a partial class.

The six ability payloads in each R1 manifest are mandatory starting content, not the complete package. Preserve each payload's exact ability, node and spell IDs, descriptions, AP, targeting, durations and program arguments through the class projection.

## Binding package shape

Each class must contain:

| Component | Gambler | Fate Weaver |
|---|---:|---:|
| Optional spells | 40 | 40 |
| Core feature records | 2 | 2 |
| Talent actives (3 signatures + 3 capstones) | 6 | 6 |
| Passive talent records (3 ranks each) | 48 | 48 |
| Active records | 48 | 48 |
| Unique authored identities | 96 | 96 |
| Trees | 3 | 3 |
| Nodes | 54 (18/tree) | 54 (18/tree) |
| Rank capacity | 150 (50/tree) | 150 (50/tree) |

- Four optional records at every level 1–10; at least two non-damage options per level; exactly one optional pick per level, chosen from that level or an earlier unchosen legal pool.
- Core records are granted separately and do not consume optional picks. Signature and capstone records are paid talent grants; they are not free starting spells or optional picks.
- Character talent budget is 5 points/level, cap 50. Signature nodes require 10 points in the same tree and minimum level 3. Capstones require 45 points in the same tree and minimum level 10. Every listed predecessor must be fully ranked; gates count paid points in the same tree; no cross-tree borrowing.
- Three trees, 18 nodes each, at least 16 three-rank passive nodes per tree, one signature node and one capstone node per tree. A passive node's three paid rank values and its derived passive spell record come from one source, never two maintained copies.
- Stable record IDs use `cr1_gambler_*` and `cr1_fate_weaver_*`. Never reuse or rename a legacy `gambit_*`, `gambler_*`, `fate_weaver_*`, `augur_*` or materialized `talent-spell-*` ID.
- Every class, record and node carries `classId`, `rulesetVersion`, `authoredOnly:true`, `executionEnabled:false`, `applicationMode:'manual-tabletop'`, empty `automatedCapabilities`, and a manual-only notice.
- Explicit zero and null values are preserved. Do not flatten typed branches, escrow, consent, use counts, expiries or source metadata into generic damage/cost fields.

## Gambler contract

- Class ID `gambler`; display name `Gambler`; development/manual status. Distinct from legacy Gambit.
- Mandatory R1 payloads: core/optional records `cr1_gambler_wager_strike` and `cr1_gambler_recut` (core, level 1), `cr1_gambler_read_table` (optional, level 2); signature spells `cr1_gambler_double_or_nothing`, `cr1_gambler_marked_pair` and `cr1_gambler_underwrite` (level 3). Preserve their exact paired node IDs `cr1_gambler_high_roller_signature`, `cr1_gambler_card_sharp_signature` and `cr1_gambler_odds_broker_signature`; do not collapse node and spell identity.
- Trees: `high-roller` / High Roller, `card-sharp` / Card Sharp, `odds-broker` / Odds Broker. Working capstone directions are finite last stake, one five-card arrangement and finite two-contract arrangement; final names, effects and IDs belong to content lock.
- Resource state: 20 unique cards, four suits and ranks 1–5, exactly one zone each across deck/hand/discard/pending-wager; hand max 5; one unresolved wager; Fortune 0–7; available Fortune plus escrow never exceeds 7.
- Completed long rest: Fortune 3, shuffle/deal 5, deck 15; subsequent encounters carry the exact bank/order/hand. Own-turn start draws up to 2 into empty sockets only, once, only if the deck has cards. Recut is 1 AP once per own turn: discard 0–2 actual cards, reshuffle discard only if the deck is empty, then draw into up to two empty sockets; if broke (Fortune 0), recover one Fortune only when an actual card was discarded. No unconditional Fortune, automatic shuffle or reconnect refill.
- Base wager: one exact hand card and 1–2 Fortune to escrow, `2d6 >= 8` returns `2x` stake and applies the published strike; loss consumes escrow. High Roller: 3 Fortune, `2d6 >= 9`, pays 9. Underwrite: one ally's next original single-d8 damage roll; 5–8 returns `2x` stake and adds 2 raw damage before mitigation, otherwise expiry/cancellation loses the stake. No refund after commitment; no bankruptcy damage.
- Gambler HUD: five card sockets, available Fortune, separate escrow, deck/discard counts and locked pending-wager state. Observers receive only public counts/played cards; private rank/suit data must not remain in DOM, ARIA labels or tooltips for hidden cards. No HUD action mutates cards, Fortune, escrow or wagers.
- Legacy Gambit has `fortune` 0–7, Debt 0–13 and its own card layers. Do not map Fortune, Debt, cards or legacy `gambler_*` records into the new hand. All 65 Gambit spell IDs, three tree IDs and 54 materialized talent IDs remain legacy until an explicit per-record disposition exists.

## Fate Weaver contract

- Class ID `fate-weaver`; display name `Fate Weaver`; development/manual status. Distinct from legacy Gambit and the old Fate Weaver card spec.
- Mandatory R1 payloads: core/optional records `cr1_fate_weaver_tie_thread` and `cr1_fate_weaver_cut_clean` (core, level 1), `cr1_fate_weaver_read_bond` (optional, level 2); signature spells `cr1_fate_weaver_witnessed_covenant`, `cr1_fate_weaver_sever_borrowed_crown` and `cr1_fate_weaver_reanchor_tapestry` (level 3). Preserve their exact paired node IDs `cr1_fate_weaver_covenant_weaver_signature`, `cr1_fate_weaver_severer_signature` and `cr1_fate_weaver_tapestry_keeper_signature`; do not collapse node and spell identity.
- Trees: `covenant-weaver` / Covenant Weaver, `severer` / Severer, `tapestry-keeper` / Tapestry Keeper. Working capstone directions are a finite triad, one sustained-link cut and a finite relay; final names, effects and IDs belong to content lock.
- Resource state: exactly three token IDs partitioned into free/reserved/recovering; max three links; one or two uses per link; event `original-assigned-damage`; `amountMax:3`; formation range 30 feet to each endpoint; separation max 60 feet; expiry at the end of the second subsequent caster turn; recovery at the next owner (caster) own-turn start.
- Tie: 1 AP, one free token. Covenant: 2 AP, two free tokens and two uses. Both endpoints consent, are distinct, and must be legal exact actor refs. Cut: 1 AP, only your own link. Sever: 2 AP and one free thread, only an identified registered fate-link object within 30 feet. Reanchor: 1 AP, exactly one endpoint, fresh consent/range, preserving event, uses and expiry.
- Damage partition is post-mitigation/pre-temp: bearer receives `min(3,D)`, protected actor receives `D - transferred`. Transferred burden is not re-mitigated, cannot trigger links or recursion, and assigned damage is conserved. One link per original event; earliest accepted room sequence wins; no after-receipt rewrite.
- Fate Weaver HUD: three spool glyphs with free/reserved/recovering states, endpoint initials, broken/expiring cue and explicit terms/consent/use/expiry inspection. No complete graph in a meter, no mutation, no invented links or token refill.
- Legacy card/thread data stays separate. `threadsOfDestiny`, `fate_reserve`, `fortune`, `karmic_debt` and legacy `fate_weaver_*`/`gambit_*` records are not new `fate-links` state.

## Augur merger assessment

Deliver a data-only `AUGUR_DISPOSITIONS` manifest and append the exact rows to the existing `augur` `recordDispositions` array in `classReconstructionCompatibility.js`. The manifest must enumerate, from the actual legacy owners rather than a hand-written subset:

- every active spell in `AUGUR_DATA` (including `exampleSpells`/`spells`), every spell-pool entry and every materialized spell ID;
- every node, rank and grant/spell mapping in `AUGUR_AUSPICE`, `AUGUR_HARBINGER` and `AUGUR_HIEROPHANT`;
- every Augur subrace variant, including the Nereid Myrathil variant path, and every current Augur heritage edge;
- the legacy Omen Debt/Benediction/Malediction resource surface as a resource-level disposition.

Each row uses `sourceType`, `sourceId`, `sourceClassId`, `disposition` (`keep`, `adapt`, `legacy-only`), `destinationClassId`, `destinationId` or `null`, `rationale`, and `automaticConversion:false`. `keep` means exact legacy preservation with no new ID; `adapt` requires an exact new `cr1_fate_weaver_*` destination; `legacy-only` records intentional non-carriage. No source ID may be omitted, duplicated, renamed or given a guessed destination. Do not delete Auspex/Hierophant material to force a three-tree appearance. Do not copy both Benediction/Malediction banks or Omen Debt into Fate Weaver. If a technique cannot fit without a fourth tree, retain it legacy-only and document why.

The existing rows are `split` for Gambit (Gambler/Fate Weaver/Chaos Weaver) and `merged-design` for Augur (Fate Weaver). Append dispositions only; do not change relationship semantics, delete legacy successors, or add these one-to-many rows to `CLASS_COMPATIBILITY_ALIASES`.

## Heritage and native access

- Add Gambler and Fate Weaver provenance entries to `data/classHeritageRegistry.js` with `heritageEffectsImplemented:false`. Use the R1 dossier's proposed power/acquisition/institution language; label proposed institutions. Do not claim a final native roster, founder or canon approval.
- Gambler `merryn_human` + `drall_fexric` are **approved native trained traditions** under the bounded amendment. Fate Weaver `kessen_neth` remains proposed, not a registry edit. Acquisition and mechanical benefits are separate approvals.
- Gambler native variants document all four acquisition requirements, with no invented benefit/cost rows. `heritageEffectsImplemented` stays false. Native access is training, not ancestry permission; the existing resolver returns requirements, not independent proof of every native apprenticeship.
- Register approved native access independently of mechanical edges. Add a typed edge/cost only after its own approval. Pending mechanical pairs are `Chaos Weaver|drall_fexric`, `Gambler|merryn_human` and `Gambler|drall_fexric`; other coverage is unchanged.
- Final class counts: `CLASS_PROVENANCE` 22→24, `BASE_CLASSES_DATA` 22→24, `ALL_CLASSES_DATA` 25→27, `CLASS_DISPLAY_DATA` 22→24, portrait options 22→24, alias count 3, canonical combinations 550→600, authored-edge classes 21 unchanged. At 2A only Gambler is registered: 23/23/26/23, 23 portraits and 575 combinations. Current native registry baseline 103 becomes **105** after exactly two Gambler additions; 2B retains 105 unless separately amended.

## Phase 2A — Gambler only

1. Preflight: capture `/rules?category=character-creation&sub=classes&class=Gambit` or the actual legacy routes, the rendered Gambit/Augur/Chaos Weaver fixtures, current `ALL_CLASSES_DATA`/display/guide/resource registries, `git status`, and SHA-256 hashes of every existing writable path (mark new paths `absent`). Preserve unrelated server/riposte work.
2. Author `gamblerData.js`: identity, origin/acquisition, proposed variants, progression (4 options/level, one pick), resource rules, pure state validators, core/optional/signature/capstone records, projected cards and package manifest. Keep all mechanics data-only.
3. Author `talentTrees/gambler.js`: three complete trees, 54 nodes, 50 ranks/tree, derived 48 passive records, signature at 10 points/level 3, capstones at 45 points/level 10, full predecessor AND gates, no duplicate passive definitions.
4. Author `gamblerResourceGuide.js` and `GamblerResourceDisplay.jsx`; register the guide and custom HUD route. The display is read-only/manual, owner/observer aware, and never a FortunePoints or legacy Gambit branch.
5. Register `Gambler` in `classes/index.js`, `classDisplayData.js`, `classSpellGenerator.js`, `classSpellCategories.js`, `talentTreeData.js`, `classResources.js`, `classResourceContracts.js`, `resourceSystems/index.js` and `classHeritageRegistry.js`. Add `gambler-hand` as the managed resource ID; add no `fortune`/`fortunePoints` alias. Use the existing `/assets/icons/classes/gambler.png`; update `classIconUtils.test.js` from 22 to 23 portrait options and update the hardcoded registry counts to the 2A values.
6. Add the Gambit `recordDispositions` inventory without changing legacy resolution. Add no automatic Gambit→Gambler conversion.
7. Add `gamblerIntegration.test.js`, the Gambler HUD test, and the named shared test appends. Run the complete Gambler acceptance suite and capture evidence in `docs/plans/mythrill-class-reconstruction/implementation/evidence/RI-2-gambler-fate-weaver/phase-2a/`.
8. Stop at the 2A gate. Do not begin Fate Weaver registration or Augur dispositions until 2A is accepted.

## Phase 2B — Fate Weaver + Augur merger

1. Re-capture the 2A accepted hashes and legacy fixtures. Do not overwrite 2A evidence.
2. Author `fateWeaverData.js`, including the six mandatory ability payloads, full 96-record package, three trees/54 nodes/48 passive records, state validators and the `AUGUR_DISPOSITIONS` manifest. Do not import Benediction/Malediction or Omen Debt as a new resource.
3. Author `fateWeaverResourceGuide.js` and `FateWeaverResourceDisplay.jsx`; register the guide and custom HUD route. The display is read-only/manual and separate from legacy `threadsOfDestiny`.
4. Complete every Augur source→destination disposition, then append the exact rows to `classReconstructionCompatibility.js`. Verify no legacy Augur/Nereid resolution changes.
5. Register `Fate Weaver` in the same shared seams using `fate-links` as the managed resource ID. Add no legacy thread/fortune alias. Use the existing `/assets/icons/classes/fate_weaver.png`; update `classIconUtils.test.js` from 23 to 24 portrait options and complete the final registry counts.
6. Add `fateWeaverIntegration.test.js`, the Fate Weaver HUD test, the Augur disposition coverage test, and the named shared test appends. Run the complete 2B acceptance suite and capture evidence in `docs/plans/mythrill-class-reconstruction/implementation/evidence/RI-2-gambler-fate-weaver/phase-2b/`.

## Exact writable paths

All application paths are relative to `vtt-react/src/`. Edit a shared seam only when the actual consumer requires it; capture entry hashes and reconcile dirty overlaps first.

**New class packages and tests:**

- `data/classes/gamblerData.js`
- `data/classes/fateWeaverData.js`
- `data/talentTrees/gambler.js`
- `data/talentTrees/fateWeaver.js`
- `data/resourceSystems/gamblerResourceGuide.js`
- `data/resourceSystems/fateWeaverResourceGuide.js`
- `components/hud/GamblerResourceDisplay.jsx`
- `components/hud/FateWeaverResourceDisplay.jsx`
- `data/classes/__tests__/gamblerIntegration.test.js`
- `data/classes/__tests__/fateWeaverIntegration.test.js`
- `components/hud/__tests__/GamblerResourceDisplay.test.jsx`
- `components/hud/__tests__/FateWeaverResourceDisplay.test.jsx`

**Existing shared seams (only when required):**

- `data/classes/index.js`
- `data/classes/classDisplayData.js`
- `data/classes/classReconstructionCompatibility.js`
- `data/classSpellGenerator.js`
- `data/classSpellCategories.js`
- `data/talentTreeData.js`
- `data/classResources.js`
- `data/classResourceContracts.js`
- `data/classResourceAliases.js`
- `data/resourceSystems/index.js`
- `data/classHeritageRegistry.js`
- `data/heritageEdgeContract.js` (only after an approved native edge)
- `components/rules/ClassesDisplay.jsx`
- `components/rules/RulesPage.jsx` (explicitly approved one-entry Gambler lazy-loader scope correction)
- `components/rules/ClassDetailDisplay.jsx`
- `components/rules/ClassDetailDisplay.css`
- `components/hud/ClassResourceBar.jsx`
- `components/talent-tree/TalentTreeContent.jsx`
- `components/talent-tree/TalentTreeContent.css`
- `components/character-creation-wizard/steps/Step1CoreDraft.jsx`
- `components/character-creation-wizard/steps/Step9CharacterSummary.jsx`
- `components/modals/LevelUpChoiceModal.jsx`
- `store/characterSlices/infoSlice.js`
- `store/characterSlices/progressionSlice.js`
- `hooks/useClassSpellLibrary.js`
- `components/spellcrafting-wizard/components/library/SpellLibrary.jsx` (explicitly approved Gambler-only canonical talent projection)

**Named test/evidence paths:**

- `data/resourceSystems/__tests__/allGuides.test.js`
- `data/__tests__/classHeritageRegistry.test.js`
- `data/__tests__/heritageEdgeContract.test.js`
- `data/__tests__/heritageRosterCoverage.test.js`
- `utils/__tests__/classIconUtils.test.js`
- `components/rules/__tests__/ClassesDisplay.test.jsx`
- `components/rules/__tests__/ClassDetailDisplaySpells.test.jsx`
- `components/talent-tree/__tests__/TalentTreeContent.test.jsx`
- `docs/plans/mythrill-class-reconstruction/implementation/evidence/RI-2-gambler-fate-weaver/phase-2a/`
- `docs/plans/mythrill-class-reconstruction/implementation/evidence/RI-2-gambler-fate-weaver/phase-2b/`

**Read-only controls:** all legacy class definitions/spells/trees/resources/variants, including `data/classes/gambitData.js`, `data/classes/augurData.js`, `data/talentTrees/gambit.js`, `data/talentTrees/augur*.js`, `data/augurResourceContract.js` and `data/resourceSystems/gambitResourceGuide.js`; every `server/` path; `PartyHUD.jsx`; `coreSlice.js`; `resourceSlice.js`; `characterHelpers.js`; persistence codecs; the accepted RI-1 files; original C1 and RI-1 evidence; main Wizard schema/reducer/load/save/targeting/export; P9/P12/P13 cast producers/manual gate; global CSS/assets; canonical lore/Laws. Do not edit unrelated concurrent server/riposte work.

**No extra modules:** do not add production `*Rules.js` or `*Integration.js`, a second adapter layer, a class-team server, a scheduler, a private ledger or a generic opcode engine. Put projections and pure validators in the two class data modules. If a new scoped CSS file is truly required, stop and name the bounded amendment rather than adding it silently.

## Tests

**Package tests (Gambler and Fate Weaver):**

1. Counts 40 optional + 2 core + 6 talent actives + 48 three-rank passive records; 48 active records; 96 unique identities; 54 nodes; 3 trees; 150 rank capacity (50/tree).
2. Every level has four optional records and at least two non-damage records; IDs are unique and no new ID collides with a legacy ID.
3. Every record is a closed manual profile with explicit zero/null values, AP/mana, classId/rulesetVersion and no automated capability; all typed branch/escrow/consent/status fields survive projection.
4. Pools, `newChoiceIds`, core grants, signature/capstone gates, predecessor ANDs, max-rank absolutes and no-cycle rules match the authored package; six grant nodes resolve to the six talent actives; 48 derived passive records each carry exactly three ranks and have no duplicate definitions.
5. Gambler state validators reject duplicate/missing cards, multiple zones, hand >5, Fortune+escrow >7, multiple unresolved wagers and invalid stake/card selection without mutation; valid long-rest/draw/Recut/wager sequences conserve contents.
6. Fate Weaver validators reject duplicate token IDs, multiple token states, more than three links, non-distinct endpoints, illegal use/expiry and post-trigger reanchor; damage partition conserves assigned damage and cannot recurse.
7. The HUD tests prove owner/observer privacy, explicit uninitialized state, no automatic refill, no mutation on interaction, readable focus/tooltips and 44px inspection targets.
8. Registration tests prove the normal catalogue/detail/cards/pools/trees/learning/HUD reachability and the development/manual status; level-up and library entry do not add extra optional/talent grants.

**Legacy and compatibility tests:**

9. Gambit, Augur, Nereid Myrathil Augur and Chaos Weaver fixtures load/save with identical class keys, known spell IDs, talent IDs, variants and classResource; no legacy resource is reinterpreted as `gambler-hand` or `fate-links`.
10. The Gambit row has an explicit disposition for every one of the 65 legacy spells, three tree IDs and 54 materialized talent IDs in the compatibility index; no automatic destination.
11. The Augur dispositions inventory is derived from actual `AUGUR_DATA` and tree exports and covers every active spell, pool, node, rank/spell mapping, variant and heritage edge exactly once; every `adapt` destination is a real Fate Weaver ID; no source disappears.
12. `getReconstructionCompatibility('gambit')` and `('augur')` retain `automaticConversion:false`, legacy resolution and their existing successors; `CLASS_COMPATIBILITY_ALIASES` is unchanged.
13. Heritage/catalogue counts and tests match the approved state. Gambler has exactly two approved native access pairs and no mechanical edges; Fate Weaver's proposed access stays unregistered. Coverage identifies the three explicitly pending mechanical pairs without weakening any other relationship.

**Shared UI tests:**

14. Append Gambler/Fate Weaver catalogue/detail/cards/pools assertions to `ClassesDisplay.test.jsx` and `ClassDetailDisplaySpells.test.jsx`.
15. Append canonical grant-node/materialized-spell assertions to `TalentTreeContent.test.jsx`; reuse the existing canonical grant path and ensure no second passive is generated.
16. Add both guides to `allGuides.test.js` with distinct archetype/tagline and complete view models.
17. Update `classIconUtils.test.js` to the phase count (23 after 2A, 24 after 2B), and verify `getClassIconUrl`/portrait ids resolve the existing `gambler.png` and `fate_weaver.png` assets.

**Verification commands and evidence:**

- Run targeted Jest from `vtt-react/` with `CI=true`, `--watchAll=false`, `--runInBand`; include the two integration tests, HUD tests, named shared tests and legacy fixtures. Example template: `$env:CI='true'; npx react-scripts test --watchAll=false --runInBand --runTestsByPath <named-test-paths>`. Do not run a broad combat/balance suite merely because class content changed.
- Run scoped ESLint on changed JS/JSX only: `npx eslint <changed-paths>` from `vtt-react/`. Report errors and warnings separately; zero is required for acceptance unless an unrelated pre-existing warning is named.
- Use Playwright on actual routes: catalogue/detail for `Gambler` and `Fate%20Weaver`, spell cards/pools, all three trees, resource guide and HUD. Check 1280px and 360px only where the route is not auth/PhoneGate blocked; capture exact blockers for unavailable authenticated creation/sheet routes.
- Record SHA-256 hashes for every existing writable and protected control, mark new paths `absent` at entry, capture before/after source hashes, test counts, lint results, browser URL/viewport/console errors, and the exact legacy fixtures used.
- Use the detached background build pattern from `AGENTS.md` only if a build is necessary. Never run a raw foreground webpack build.

## Acceptance — 2A Gambler

1. The content-lock table and manifest are complete; 40/2/6/48 and 96/54/3 counts pass; no placeholder or six-row class is registered.
2. All four options at every level, core grants, signatures/capstones and tree gates behave positively and negatively in the actual learning/talent consumers; no random startup or load-time top-up.
3. Gambler appears through normal catalogue/detail/creation/library/HUD; observers cannot read private hand data; invalid state is rejected without mutation.
4. Gambler resource and card examples conserve the 20-card deck, Fortune/escrow and one-wager limit; long-rest reset is explicit, not reconnect/initiative-driven.
5. Legacy Gambit and every other saved class remain loadable with exact IDs/data/resources; no automatic conversion occurs.
6. The Gambit compatibility inventory is complete and explicit; no native pair/edge was invented.
7. Targeted tests, scoped lint, source hashes and actual-route evidence pass. Phase 2A is accepted before 2B begins.

## Acceptance — 2B Fate Weaver + Augur

1. The complete Fate Weaver content-lock table passes the same 96/54/3 and progression/tree checks.
2. All three signature/capstone paths and all thread states/uses/expiry/recovery cases have positive and refusal witnesses; no new bank or recursive link is introduced.
3. Augur dispositions cover the actual inventory exactly: every active record, node, rank, variant and edge has a disposition; every adapted technique resolves to a real Fate Weaver ID; Auspex, Ill Omen and Hierophant provenance is not silently destroyed.
4. Legacy Augur/Nereid saves, `AUGUR_DATA`, the three Augur trees and Omen Debt/Benediction/Malediction resource behavior remain unchanged.
5. Fate Weaver appears through normal catalogue/detail/creation/library/HUD with a separate `fate-links` display; legacy `threadsOfDestiny` is untouched.
6. Heritage/catalogue counts and tests are updated to the approved state; no unapproved native edge or final-roster claim is made.
7. Targeted tests, scoped lint, source hashes and actual-route evidence pass, and the report clearly separates authored, selectable development, manually usable and automatically admitted capability.

## Required return

Return the changed-file list with entry/current hashes (new files: entry `absent`); complete Gambler and Fate Weaver manifests (IDs, levels, trees, record counts, resource rules, tree gates, native status); the exact Gambit and Augur disposition tables; legacy fixture results; test/lint/browser evidence on actual routes; remaining unsupported capabilities and their exact Main HeadQ seams; and any content-lock rows still missing. State plainly whether each class is authored, selectable development, manually usable and automatically admitted. Do not claim automated combat, migration, native approval or final roster acceptance. No commit/push/deploy unless separately requested.

## Copy-ready DeepSeek prompt

> Implement **RI-2 Gambler + Fate Weaver and the Augur merger assessment** exactly as specified in `docs/plans/mythrill-class-reconstruction/implementation/RI-2-GAMBLER-FATE-WEAVER.md` and row 2 of `34_ROSTER_INTEGRATION_COHORTS.md`.
>
> Start from the current working tree and preserve concurrent server/riposte work and the accepted RI-1 implementation. Read the R1 dossiers, both six-ability manifests, the compatibility index, the R1 lifecycle/heritage contracts, and the actual legacy Gambit/Augur data/trees/resources. Do not use those six ability payloads as the class library and do not invent missing content: the complete content-lock table is a hard gate.
>
> Build each class through the established catalogue/detail/creation/learning/tree/library/HUD system. Reuse the C1 canonical grant/progression patterns, not a workshop or a second parallel framework. Keep both classes manual-tabletop: non-executable effects remain visibly labeled and apply nothing automatically. Preserve every Gambit, Augur, Nereid Augur and Chaos Weaver ID/save/resource; append explicit data-only compatibility dispositions and never automatically convert a legacy character.
>
> Implement Gambler first (phase 2A), then stop for acceptance. Implement Fate Weaver and the complete Augur disposition inventory only after 2A is accepted. Add no native edge without approval, no Benediction/Malediction or Omen Debt import, no fortune/thread alias, no server/engine change, and no commit/push/deploy. Return complete manifests, hashes, tests, actual-route evidence and unresolved content or capability gaps.
