# Corrected CLASS-C1 — independent re-review: BLOCK

2026-10-18. Application code remained read-only. The original contract, independent BLOCK, original probe source/assertions and correction evidence were retained. Latest creator direction changes the **next delivery model** to established-system roster integration; it does not retroactively change C1's review requirements or turn these failures into accepted behavior.

## Remaining reproducible contract failures

Run `node docs/plans/mythrill-class-reconstruction/implementation/evidence/CLASS-C1-chaos-weaver/independent-rereview/supplement.cjs` from the repository root. `supplement-results.json` retains observations and all source hashes.

|ID / original finding|Reproduction and actual result|Required bounded correction|
|---|---|---|
|B1 / R3 legal build and eligibility|`buildPreview({characterLevel:1,pickedSpellIds:['cw1_01']})` returns false: “already chosen” and “no pool pick remains”. `buildPreview` passes the already-completed list back to the **add-a-new-pick** validator (`chaosWeaverRules.js:1883–1885`). Every nonempty valid list fails its own membership check. In the actual route, allocate the legal level3 Cascade signature, lower preview level to1, then open Rehearsal: Second Possibility remains available. `knownSpells` and `onPreviewLevel={setPreviewLevel}` (`Workshop.jsx:652–661,1007`) never revalidate the build.|Validate a completed build without treating each member as a new addition. Revalidate/prune dependent ranks, picks and grants on level changes before exposing known spells. Keep valid earlier unchosen picks legal; reject unpaid signatures.|
|B2 / R1 round-trip regression|Settle Split S1/F1, face1; pay Fold1 AP to recover S1; export→import returns false: “settlement action-1: the selected ID must be spent after settlement”. The same happens after a legal completed rest. Completed Anomaly witness also fails import after M1 recovery. `validateSettlementShape:2218–2220` incorrectly requires **historical** selected IDs to remain in the current spent zone.|Validate settlement history against its recorded event, not the current zone after later legal recovery. Preserve exact accepted worksheet bytes.|
|B3 / R1 strict pending import|Create a valid pending Split S1/F1 and change only `pending.spellId` to `cr1_chaos_weaver_bias_draw`; the complete canonical packet imports with `ok:true`. Two IDs cannot pay Bias's S1/S2/F price. `validatePendingShape:1991–2091` checks resolution/mapping/ownership but not the pending spell's authored price or continuation eligibility.|Check pending/anomaly IDs against the named authored action and permitted continuation profile, in addition to ownership and exact mappings. Reject as retained draft without promoting it.|
|B4 / R4 no-redraw Anomaly lifecycle|Bind M1/F1, trigger, record6→F1, GM void with reason, trigger again, record1→M1. Both trigger and new face return true, using **the same action-1**. `voidPending:1338–1370` leaves the anomaly bound and clears pending; `resolveAnomaly:1388–1417` creates another committed draw.|Keep a recorded face immutable through void/closure. End the voided commitment without refund/redraw or retain its locked original result for explicit settlement. Never reopen that sample.|
|B5 / R4 complete Fracture confirmation|Actual-route Fraying Bolt (`cw1_01`, F1) immediately spends2 AP/F1, leaves penalties0, creates no settlement or manual result confirmation. `commitSpell:1094–1102` bypasses the corrected sampled-result flow. Also actual-route Cascade F1→Decline settles primary with **all manual confirmations unchecked**; `resolveContinuation:1299–1304` calls finalization without confirmations. Declining the extra option is not confirmation of primary damage/downside.|Retain/confirm the deterministic authored downside and numerical result, and require primary confirmations on decline while returning only the unused reservation. Do not apply real movement/HP automatically.|
|B6 / R4 counter input validation|Actual route: enter AP `3.7`, Apply counters → AP3. `Workshop.jsx:603–605` still uses `parseInt`, silently truncating invalid integer input; pure API rejection alone does not fix UI input.|Parse whole input; refuse noninteger/negative AP/movement and turn<1 atomically, with an error.|
|B7 / R6 mounted contrast|360px real route still computes `.cw-header` background as `linear-gradient(135deg,#7a3b2e,#8b4513,#a0522d)` with `.cw-lead` text `rgb(104,83,62)`. Ratios against gradient stops: **1.162,1.022,1.292:1** at16.8px. The darker header and dark subtitle remain unreadable. `browser-results.json.styles/headerContrast` records computed colors.|Override the inherited header background/foreground within the scoped class surface, using existing palette. Keep the correction when integrating the normal detail page.|

These are existing import/build/lifecycle/UI contract failures and correction regressions, not new combat, balance, persistence or multiplayer acceptance requirements.

## Finding-by-finding disposition

|Original finding|Verified corrected portions|Disposition|
|---|---|---|
|R1 imports|Missing turn; primitive pending; unknown worksheet/cost; changed branch999d6; missing content; orphan committed; tampered mapping all reject. Canonical untouched/committed/face/settled controls remain exact. Rejected text retained in draft; real Anomaly export rejection did not overwrite its current state.|Partial — B2/B3 remain.|
|R2 prices/atomicity|Finite Cataclysm S1/S2/M1/F1 succeeds, AP20→16, four committed; Sixfold Audit S1/M1/F1 succeeds AP20→17, three spent; Last Boundary M1/M2/F1 succeeds AP20→17, three bound. Duplicate Fold rejects, no session returned, input unchanged. Distinct1/2-ID Fold still works.|Original examples corrected.|
|R3 builds|Same-tree hybrid gate rejects borrowed points; respec prunes gate-dependent ranks; unpaid signature/core-as-pick rejected; first-invested Cascade retained; unauthorized F/S continuation refused; capstone extensions hidden until learned; A08 trigger choices exposed.|Partial — B1 remains; malformed pending import B3 can bypass price constraints.|
|R4 lifecycle|Anomaly now publishes mapping, locks, records face and branch and settles; paid dismissal deducts1 AP; Counterseal costs2 AP plus its own tiles and closes/spends anomaly; early expiry/free closure reject; Safe Rehearsal and paid capstone void retain once/rest use. Sampled Split F records5ft penalty to next start. Rest refuses pending/anomaly and duplicate label; continuation reserve is excluded from mapping; accept works at0 extra AP.|Partial — B4/B5/B6 remain.|
|R5 structured records/inspector|Skewed Guard ward target self-or-ally; Lateral Refuge and Final Safe Passage retain displacement plus separate10ft caster penalty and distinct expiries; Anomaly branches rendered/retained; choosing `talent_spell_cw1_ca_n17` actually displays Last Continuation, not first passive.|Original examples corrected; no blanket execution claim.|
|R6 mounted UI|Keyboard entry focuses workshop; Back returns opener; inspector Enter/Escape returns focus. 360px tabs wrap, widths≥62.9px, all44px high, scrollWidth≤clientWidth; document width360. Rank buttons min114×44. Active-tab foreground/background now legible. SVG has enlarged text plus external zone/pending/anomaly summaries. Reduced-motion branch static; scoped selectors retained.|Partial — B7 remains.|

## All26 correction DIFFs inspected

The original32 probes were rerun unchanged. Their zero exit is **not** an acceptance assertion. All26 name-paired payload changes reproduce correction evidence. “Intended” below applies to the specific observation, not all adjacent behavior.

|#|Probe DIFF|Independent disposition|
|---|---|---|
|1|structured branch/prose consistency|Intended R5 typed penalties/target repair; literal values match §5.|
|2|capstone extension and nonnumeric preview|Intended R3; learned-only extension and A08 descriptor.|
|3|legal price cw1_37|Intended R2 four-ID cost.|
|4|legal price cw1_38|Intended R2 any-three-distinct cost.|
|5|legal price cw1_last_boundary|Intended R2 two exact M plus F.|
|6|duplicate Fold invalid atomicity|Intended rejection, no paid/corrupt replacement.|
|7|hybrid gate|Intended same-tree gate.|
|8|respec gate recheck|Intended dependent pruning.|
|9|build validation and primary order|Its three negative/order observations are intended; completed-legal-pick regression **B1** is not accepted by that negative-only probe.|
|10|Safe Rehearsal once/rest|Intended usage recorded.|
|11|continuation invalid symbols|Intended F refusal and S requires C10.|
|12|anomaly trigger|Intended §3 fixed mapping/retained unresolved face; not instant free closure.|
|13|manual anomaly closure bypass|Original probe now dereferences `.session` on rejection. Not accepted on exception alone: supplementary observations individually confirm early expiry, free Counterseal/Unbind/dismissal all reject. Positive paid Counterseal and browser dismissal work.|
|14|Fracture settlement worksheet|Intended5ft next-start record; no automatic movement-counter reduction required for manual worksheet. Deterministic/decline omissions B5 remain.|
|15|import missingTurn|Intended strict rejection.|
|16|import orphanCommitted|Intended owner-closure rejection.|
|17|import unknownWorksheet|Intended unknown-extension rejection/draft retention.|
|18|import unknownCost|Intended exact nested cost rejection.|
|19|import changedBranch|Intended exact branch rejection; authored branch preserved.|
|20|import missingContent|Intended full-package requirement.|
|21|import wrongMapping|Intended exact face-entry validation, not order-only validation.|
|22|null pending import robustness|Intended structured rejection of primitive7.|
|23|Counterseal and Unbind preconditions|Intended no-record refusals.|
|24|once/rest void cannot refund use|Intended paid use retained.|
|25|invalid counters|Intended pure-API rejection; UI truncation B6 remains.|
|26|Anomaly numerical witness|Original probe now stops at the newly required face lock. Contract §3/§10 supports inserting **trigger→face1→movement confirmation→settle**, then original remaining operations. Completed independently in pure source and actual browser, final AP2/expected zones. Original probe and assertion remain untouched; its exception is not a passed witness. New Anomaly void redraw B4 remains a regression.|

Six SAME groups: all54 node tuples/prerequisites and48 passives; all40 optional names/levels/AP/mana; reported prior fixes; round trips for the four retained immediate phases; Probability witness; Cascade witness. The limited round-trip phases miss subsequent recovery/rest B2. Cascade's SAME result includes an expired prior Fracture at T3 and does not prove confirmation on decline.

## Actual-route specialization sequences

Chromium, existing dev server, `http://localhost:3000/codex/character-creation/classes`; normal production components, no component/state injection. Level3 legal11-point own-tree signature builds were purchased through UI controls. Manual counters4 AP/30ft. `browser-results.json` retains full visible logs.

- **Probability:** T1 Bias S1/S2/F1 uses **face6** for F1; Fold S1/F1. T2 Fold S2, Bias S1/S2/F2 face3→S2. T3 Fold S1/F2, Split M1/F1 face1→M1, confirm damage/movement. Final AP1, available S1/M2/F2, spent S2/M1/F1. Face3→F1 in the original witness is an arithmetic typo; normative §3.11 sorts S1,S2,F1 and assigns F1 faces5/6. No mapping change authorized.
- **Anomaly:** T1 bind M1/F1, Split S1/F2 face1→S1, confirm damage; enemy entry triggers locked M1/F1 draw, face1→M1, confirm movement, settle both bound IDs to spent. T2 Fold M1/F1, rebind. T3 enemy avoids; paid dismissal1 AP then Fold1 AP. Final AP2, available S2/M1/M2/F1, spent S1/F2, no pending/anomaly. **Previously incomplete sequence completed.** Export/import after this legal sequence reproduces B2.
- **Cascade:** T1 Second S1/F1 with M1 reservation, face1→S1, confirm primary+continuation, accept. T2 Fold S1/F1, Second with M2, face6→F1; decline returns only M2, retains primary and5ft next-start penalty, AP0. Missing primary confirmations on decline independently captured B5. T3 Fold then Second with M2, face1→S1; tab-switch interruption retains pending choice, AP0, committed S1/M2/F1, spent M1, available S2/F2. No repeated primary settlement on tab switch.

Desktop1280×900 and narrow360×800 exercised. Synthesized physical devices/other engines not claimed. Browser helper's initial long combined requests exceeded MCP timeout; completed sequences were resumed in short awaited UI operations and final logs captured. This is an automation boundary, not a product finding. `browser-check.js` retains helper/sequence definitions; browser-results is the completed-run evidence, not a claim that the first monolithic invocation passed.

## Identity and all25 preservation entries

All **12/12 current C1 application identities match `correction/new-source-hashes.json`**, individually recorded in `supplement-results.json.identities` (10 new,2 modified). They do not all match the older pre-correction delivery; that is expected. This reviewer made no application edits.

M = entry/delivery unchanged; C = concurrent server delta; A = authorized C1 seam. Exact hashes retained in supplementary evidence.

|#|Repository-relative path|Disposition|
|---|---|---|
|1|`server/services/authoredSpellDefinitions.js`|M|
|2|`server/tests/authoredSpellDefinitions.test.js`|M|
|3|`server/tests/fixtures/crA1aDefinitionVectors.json`|M|
|4|`server/services/actorConsequences.js`|M|
|5|`server/services/spellPayments.js`|M|
|6|`server/services/strikeApprovals.js`|M|
|7|`server/services/blockApprovals.js`|C; matches original C1 delivery|
|8|`server/handlers/actorConsequenceHandlers.js`|C; matches original C1 delivery|
|9|`server/handlers/socketHandlers.js`|M|
|10|`server/services/roomAuthorityService.js`|M|
|11|`server/services/roomCheckpoint.js`|M|
|12|`server/services/syncService.js`|M|
|13|`server/services/firebaseService.js`|M|
|14|`server/tests/p9SpellConsequences.production.test.js`|M|
|15|`server/tests/p12aWeaponStrike.production.test.js`|M|
|16|`server/tests/p12bBlockWear.production.test.js`|C; differs from entry/delivery, matches previous independent review hash `c5e597739a8de9c1f9cb0791f848980e6db022b95834b74be43857fd5e51c178`|
|17|`vtt-react/src/components/spellcrafting-wizard/components/steps/Step5Resources.jsx`|M|
|18|`vtt-react/src/components/spellcrafting-wizard/core/mechanics/resourceManager.js`|M|
|19|`vtt-react/src/components/spellcrafting-wizard/core/utils/spellSerializer.js`|M|
|20|`vtt-react/src/data/classes/index.js`|M|
|21|`vtt-react/src/data/classHeritageRegistry.js`|M|
|22|`vtt-react/src/data/talentTreeData.js`|M|
|23|`vtt-react/src/components/rules/ClassesDisplay.jsx`|A; entry→C1 entry→correction focus handoff; matches corrected hash `ebdab2dd19f28d101b371b135a3cbfc41538264c36d56b5041cf0adaa5c3fdbb`|
|24|`docs/plans/mythrill-class-reconstruction/implementation/evidence/CR-A1a-independent-review/review.md`|M|
|25|`docs/plans/mythrill-class-reconstruction/implementation/evidence/CR-A1a-independent-review/independent-probes.cjs`|M|

**21M +3C +1A =25.** Inspected three server working diffs: P12B approval carry-forward/revalidation/closed-offer tombstones and B15–B25 tests, no C1 imports/functionality. Hashes and diffs establish current bytes/content, not historical authorship in a shared dirty tree. ClassesDisplay test's preimplementation working bytes were never captured; no retrospective whole-repo preservation claim.

## Checks and boundaries

- Exact contract five-suite Jest command: **5 suites/50 tests pass**,7.541 seconds. These miss B1–B7.
- Scoped ESLint11 JS/JSX:0 errors,1 `no-loop-func` warning at rules1661. CSS is outside this parser; no false “12 linted files” claim.
- `git diff --check` passes (line-ending notices only).
- Retained32-probe command rerun unchanged; observation runner still catches two exceptions and exits0. Supplement independently resolves their meaning rather than weakening originals.
- No build, automated combat, balance testing, trusted sampling, room authority, persistence/restart or new acceptance requirements. Live class registration remains outside old C1 acceptance; its absence is the **new strategy's integration task**, not an added retroactive blocker.
- W1/Wizard targeting/export preservation contracts remain separately assigned. C1 packet validation does not certify main Wizard round-trip or targeting; its three named controls remain unchanged.

## Minimal DeepSeek correction instruction

Repair B1–B7 within the existing C1 data/rules/presentation scope: distinguish add-pick from completed-build validation; revalidate eligibility on level change; validate historical settlements without pinning current zones; validate pending authored prices/continuations; preserve Anomaly face through void; retain deterministic downside and require primary confirmations on decline; reject fractional UI counters; fix mounted scoped header contrast. Add positive legal-build/recovered-rested round-trip and no-redraw controls alongside negative controls. Retain original probes and before/after evidence. No new workshop framework, engine, Wizard or server edits. The separately proposed **RI-1** integration contract follows the creator's revised delivery direction; this BLOCK is not a request to extend workshop infrastructure.
