# RI-2 Phase 2A — Gambler implementation return

**Status: Implementation complete; focused verification passed; independent review deferred.**

Class HeadQ accepted the complete G1 content lock and the native-access amendment. Gambler is authored, selectable development content and manually usable. It is **not automatically admitted** to combat execution. Phase 2B was subsequently started. No commit, push or deployment was performed.

## Complete manifest and hashes

- `complete-manifest.json`: all 96 authored records, all projected cards with retained typed source, all 54 nodes and exact rank triples/prerequisites, progression, native acquisition records/variants, provenance and all 122 Gambit compatibility dispositions.
- `entry-hashes.json`: SHA-256 entry state captured before application edits, including dirty concurrent work and `absent` new paths. The later explicitly approved Codex loader and mounted spell-library files were added with separately recorded pre-edit entry hashes.
- `task-changes.json`: task-edited application paths with entry/current whole-file SHA-256 hashes; concurrent-only writable changes are separate.
- `current-hashes.json`: complete current ledger, protected-control deltas, artifact hashes and scoped whitespace-check result. Whole-file hashes include preserved concurrent hunks; they do not attribute every working-tree hunk to RI-2.

The package is implemented in `data/classes/gamblerData.js`, `data/talentTrees/gambler.js`, `data/resourceSystems/gamblerResourceGuide.js` and `components/hud/GamblerResourceDisplay.jsx`, with the named shared registrations/consumers/tests. There is no production Gambler Rules/Integration module or standalone workshop.

| Package | Actual |
|---|---:|
| Optional records | 40: four at each level 1–10 |
| Core records | 2 |
| Talent actives | 6: three signatures, three capstones |
| Ranked passive records | 48, with three exact ranks each |
| Unique spell records | 96 |
| Active records | 48 |
| Talent nodes | 54 across three trees |
| Rank capacity | 50 per tree, 150 total |
| Global character talent budget | 5/level, maximum 50 |

All six retained R1 authored spell payloads deep-equal the independent reviewed JSON, including ACTION types, AP/mana, descriptions, targeting, duration, explicit null/zero values and program arguments. Their exact node/spell mappings are retained.

## Native-access amendment and baseline correction

The live entry registry had **103**, not 102, native relationships: 102 blueprint pairs plus the accepted RI-1 `Chaos Weaver|drall_fexric` pair. The first focused run exposed the stale 102→104 expectation; this was reported and the user directed continuation. Gambler adds exactly two, giving **105**. The plan records this correction.

Approved native trained paths:

- `Gambler|merryn_human`: Merrowport/Last Table voyage-share wagering and settlement training.
- `Gambler|drall_fexric`: Alchemite salvage-wager apprenticeship, distinct from Chaos Weaver containment.

Both return the exact four acquisition requirement IDs: `house_wager`, `initiation_survival`, `wager_discipline`, `finite_deck_training`. Complete evidence requirements are in the class package and manifest; the actual Tradition tab exposes them.

Native access is separate from mechanical benefits. `heritageEffectsImplemented:false`; `getHeritageEdge` is null and free class-racial grants are empty for both paths. No benefit/cost rows were added. Coverage explicitly expects three pending mechanical pairs: the existing Chaos Weaver pair and the two Gambler pairs. Every other native relationship remains covered independently.

The existing native resolver returns training requirements; it does not independently prove every native apprenticeship. No shared access-verification framework was added.

Phase 2A catalogue expectations are provenance/base/all/display/portraits **23/23/26/23/23**, 575 canonical combinations, three aliases and 21 authored-edge classes. Phase 2B's class counts remain 24/24/27/24/24 and 600 combinations; native relationships stay 105 unless separately amended.

## Actual consumer behavior

- Explicit class selection grants only Wager Strike and Recut, leaving the actual hand uninitialized. Optional choices are separate. Random starter assignment and level-up top-up are refused.
- The real LevelUpChoiceModal exposes every unchosen legal optional from the current or earlier level, not three random entries. Confirming one choice adds one optional. Core/passive/talent-active records are excluded; duplicate/already-used level choices and invalid talent picks are refused by the Gambler store path.
- All three signature and all three capstone nodes materialize canonical **ACTION** records. Signature AP is 3/1/1; capstone AP is 4/3/2. No additional `talent-spell-*` passive is created. Repeated clicks do not duplicate canonical grants.
- Signatures require ten prior same-tree points at level three; capstones require forty-five at level ten. Predecessors must be fully ranked with AND semantics. Actual allocation refuses points beyond the fifty-point global budget.
- Ranked passive allocation/refund/reset uses each accepted canonical passive ID and the highest learned rank's exact values. It does not grant an unlearned optional spell or apply a live buff.
- Level-down reconciliation is exercised through `updateLevel`, `adjustLevel` and `updateCharacterInfo('level', ...)`: obsolete derived identities and lost optional picks are removed; surviving passive copies get their reduced rank. Class-switch cleanup retains unrelated authored records and grants still needed by another roster character.
- The library hook exposes learned canonical talent identities without adding unlearned options. Gambler has ten exact level categories: the legacy 1/2/4/6 category list otherwise loses level-three signatures and level-ten capstones.
- The mounted SpellLibrary now projects Gambler talent nodes through their complete canonical records, retaining exact `grantId`/`passiveSpellId`, AP, ACTION type, typed manual mechanics, learned rank values and the existing learned-copy deduplication. It no longer invents `talent-spell-*` identities or drops the typed payload. The focused mounted test covers all three trees, both pagination pages, 18 unique drag payloads, a pre-seeded canonical learned copy, ACTION/AP/manual parity and ranked passive values. Legacy converter and Wizard admission behavior are unchanged.
- Codex talent inspection is read-only and does not mutate the active legacy character or grant spells.
- ClassResourceBar routes Gambler through its separate `gambler-hand` display. It starts explicitly uninitialized, never deals cards/refills, and has no resource-mutating controls. Owner views use actual hand cards; observer view models/DOM/ARIA/titles contain public counts only, not hand/deck order, pending card choices, actor refs or recorded faces.
- Valid committed, outcome-unknown, face-recorded and partially settled Compact snapshots render without assuming a result is present. Compact remains one locked parent until both fixed legs close. Inspection is keyboard/touch reachable with 44px targets.

The twenty actual cards, five-card hand, Fortune-seven and escrow conservation are validated without repair or mutation. Recut's discard/empty-deck/broke conditions and Underwrite's 2x return/+2 raw/expiry-loss arguments are unchanged. House Compact has exactly two fixed legs and does not increase general wager capacity.

## Compatibility

All 65 indexed Gambit spell IDs, three tree IDs and 54 materialized talent IDs have explicit **keep** dispositions under legacy Gambit with `automaticConversion:false` and no new destination ID. The independent compatibility JSON is used to verify complete inventory coverage. New G1 definitions do not reinterpret old IDs or convert Fortune/debt into a hand.

Gambit, Augur and Nereid Augur data/identities remain intact; the Augur disposition array remains empty for Phase 2B. Legacy source controls are hashed; actual Gambit/Augur/Chaos Weaver Codex routes also load successfully. No character migration was run.

## Verification

`jest-results.json`: **13/13 suites, 232/232 tests passed**. The focused run includes the new package/integrated-consumer, mounted SpellLibrary and HUD suites; named shared catalogue/detail/talent/guide/heritage/icon tests; retained RI-1 modal/progression/integration regressions. The mounted test drives the actual component with all three Gambler trees and both pagination pages. The test code invokes real components and stores; library persistence is isolated in tests rather than requiring an authenticated remote save.

Command shape: `CI=true; RI2_EVIDENCE_EXPORT=1; npx react-scripts test --watchAll=false --runInBand --silent --json --outputFile=<phase-2a>/jest-results.json --runTestsByPath <the 13 recorded suites>`.

`eslint-results.json`: **0 errors, 99 warnings**, with **no introduced diagnostic identities relative to HEAD**. Warnings remain in existing Step1CoreDraft, ClassResourceBar, LevelUpChoiceModal, TalentTreeContent, talentTreeData, RulesPage, SpellLibrary, and the concurrently edited Step9CharacterSummary. Adding SpellLibrary to the scoped set surfaced 15 longstanding warnings already present at HEAD; two hook-dependency messages shifted line number because of preserved concurrent edits and are compared with line references normalized. The evidence contains every message and HEAD comparison; existing/concurrent warnings were not hidden or broadly cleaned up. New Gambler production/test files are clean. The scoped CLI covers 35 changed/observed application paths, including the concurrent-only writable seam.

`browser-results.json` and `resource-1280.png` / `resource-360.png` record real-route checks at **1280x900 and 360x900**:

- Normal Gambler Codex route, both native paths, all four acquisition requirements and pending mechanical status.
- Real Resource System guide and explicit uninitialized integrated HUD preview.
- All ten spell levels through pagination; House Compact's full manual price, exact two-leg structure and +4 raw terms through actual card inspection.
- All three talent trees, eighteen nodes each.
- Zero document horizontal overflow for resource, card and tree views; no broken Gambler-view images in the final pass.
- Zero page errors and zero console errors in the recorded checks. An existing environment warning is not represented as zero warnings.

The browser tool's long batch response timed out after its actions had continued; the completed result was recovered from the page and saved as the evaluation artifact. Both viewport checks and route limitations are present in that recovered result.

The real Codex route initially exposed a missing explicit lazy-loader entry. The user approved adding the one-entry `components/rules/RulesPage.jsx` scope correction, recorded in the plan and entry-hash amendment before editing. The mounted spellbook independently rematerialized learned talents through the legacy converter, producing `talent-spell-*` identities and losing G1 typed records; the user separately approved the Gambler-only canonical projection in `components/spellcrafting-wizard/components/library/SpellLibrary.jsx`, recorded in the plan and entry ledger before editing. A missing transparent Gambler header variant was handled in the allowed detail component by using the existing framed asset; no assets were added.

Development compilation succeeded using a detached server. No foreground production build was run or required.

## Exact coverage limitations

- `/account/characters/create` redirects the unauthenticated browser to `/`. Authenticated creation/sheet and persisted character save/load were not exercised end-to-end. Selection, the mounted SpellLibrary projection, learning, rank/grant reconciliation and owner/observer rendering were exercised through the actual component/store tests instead; those are not mislabeled as authenticated browser coverage.
- `/game` at 360px redirects through PhoneGate and reports a larger screen is required. No phone-grid HUD interaction is claimed.
- No pre-edit rendered browser fixture snapshot was captured. Pre-edit source hashes and later actual legacy-route checks provide the recorded baseline/preservation evidence.
- Custody/state checks and observer DTO/DOM privacy are validated locally; room transport privacy, authority, trusted deck order and automatic payment/consequence admission remain shared-engine work.
- No playtest/balance certification, automated wager settlement, future opcode admission, or final class acceptance is claimed.

## Concurrent work and scope

Concurrent changes continued during this task. The final ledger records 34 task-edited application files and 48 total changed paths, with scoped whitespace check exit 0. It reports observed deltas in protected `coreSlice.js`, `resourceSlice.js`, `PartyHUD.jsx`, CharacterPanel and coordination/engineering documents. This task did not edit those protected paths. Step9CharacterSummary was also changed concurrently and is listed separately from task-edited files. Existing/concurrent hunks in shared writable seams were preserved. These deltas are not presented as RI-2 approval of another track's work.

## Remaining Main Mythrill HeadQ dependencies

- CR-A1: definition identity, authoring round-trip and admission/serialization contracts for reviewed typed terms.
- CR-R1: authorized atomic AP/card/Fortune/escrow planning and refusal.
- CR-D1: trusted finite private deck, retained inspection choices and private room projections.
- CR-E1: ward/damage/check/movement application and exact ordering.
- CR-E2: original single-d8 deferred matching, cancellation/expiry and exactly-once compound settlement.
- CR-L1: authoritative turn/rest identities, deduplication, outcome-unknown recovery and reconciliation.

No server, shared combat infrastructure, automatic settlement or Fate Weaver/Augur implementation was added. **Stop here for independent Phase 2A review.**
