# CLASS-C1 independent review — BLOCK

Reviewed 2026-10-18 against `implementation/CLASS-C1-CHAOS-WEAVER.md`, actual application sources, and the implementer's retained evidence. **Application code remained read-only.** This directory contains review evidence only. No next-cohort implementation or package was prepared: that instruction was conditional on ACCEPT.

## Verdict

**BLOCK.** Correct cardinality and 45 passing tests do not establish the contract. Independent checks reproduce destructive worksheet results, invalid build admission, unsupported imports certified as C1, rejected legal prices, incomplete anomaly rehearsal and UI accessibility failures. These are bounded class-content/workshop defects, not a request for shared combat infrastructure.

## Evidence and commands

- `independent-probes.cjs` loads the actual three data/rules modules with the installed Babel CommonJS transform; no application mocks, registration, RNG, storage, network or game-state writers. It produces observations, including failing behavior, rather than an all-green acceptance assertion. `probe-results.json` is the retained full output, including all 97 record summaries, all 54 node tuples and entry/delivery/current hashes.
- Reproduce from repository root: `node docs/plans/mythrill-class-reconstruction/implementation/evidence/CLASS-C1-chaos-weaver/independent-review/independent-probes.cjs --summary`. Omit `--summary` for full output. The source is review-only; it does not write application or evidence files itself.
- Ran the exact contract command from `vtt-react`: `$env:CI='true'; npm test -- --watchAll=false --runInBand --runTestsByPath src/data/classes/__tests__/chaosWeaverPackage.test.js src/data/classes/__tests__/chaosWeaverRules.test.js src/components/rules/chaos-weaver/__tests__/ChaosWeaverWorkshop.test.jsx src/components/hud/__tests__/ChaosWeaverResourceDisplay.test.jsx src/components/rules/__tests__/ClassesDisplay.test.jsx`. **5 suites, 45 tests pass**, 6.106 seconds.
- Scoped ESLint passes on all **11 JS/JSX** files. Including the twelfth path (CSS) produces `ChaosWeaverWorkshop.css:4:0 Parsing error: Unexpected token`; this ESLint configuration does not parse CSS. The implementer's unqualified “eslint all12, zero warnings/errors” claim is not reproducible literally. This tooling distinction is not a product blocker by itself.
- `git diff --check`: only the pre-existing `docs/MYTHRILL_P11_P14_ROADMAP.md:397` blank line at EOF; line-ending notices accompany other dirty files. No C1 whitespace error identified.
- Real existing dev server, Chromium, route `http://localhost:3000/codex/character-creation/classes`, desktop 1280×900 and narrow 360×800. No browser component mocks. Separate fresh Chromium context with `hasTouch:true` verified synthesized taps at 360px. Reduced-motion media was exercised. Physical devices and other browser engines were not tested.
- Inspected **all six** implementer screenshots. New `desktop-locked-verified.png`, `mobile-locked-verified.png` and `mobile-rules-verified.png` were captured in the same browser operation as their asserted state. `mobile-locked-snapshot.yml` retains the accessible locked worksheet.
- The shared live browser returned to the catalogue between some tool calls; cause was not established. Earlier captures actually show the catalogue and are explicitly named `mobile-catalogue-after-interruption*.png` / `mobile-catalogue-snapshot.yml`. They are not evidence of a locked worksheet and are not attributed to a C1 remount defect. Same-operation captures and the fresh touch context avoid relying on those interrupted observations.

## Findings

Paths below are relative to `vtt-react/src/`. Line references identify the unchanged reviewed delivery.

### R1 — BLOCK: malformed/unsupported imports are certified and overwrite the worksheet

`data/classes/chaosWeaverRules.js:1218–1299`; `components/rules/chaos-weaver/ChaosWeaverWorkshop.jsx:811–830`.

`validateRehearsalState` validates tile counts but not the complete worksheet shape or zone ownership. `importPacket` validates loose profiles, not the complete closed authored C1 package.

Independent probes show `ok:true` for each of:

1. Active worksheet with `turn` deleted.
2. `S1` in `committed` while `pending:null` (six IDs still conserved).
3. Unknown worksheet extension.
4. Unknown nested `resourceCost` extension.
5. Chosen Crosscurrent M branch changed to `999d6`.
6. Packet with `classData`, `progression` and `talents` deleted and just one active spell retained.
7. Pending mapping whose `order` remains unchanged but face entries select the wrong IDs.

`pending:7` throws `Cannot use 'in' operator to search for 'actionId' in 7` rather than returning a rejected draft. Similar nested-type assumptions need one closed boundary validator, not only these examples patched.

**Real UI reproduction:** exported a valid settled worksheet (2 AP, S1/F1 spent), moved an available tile S2 to committed with no pending owner, changed a branch to `999d6`, and imported. The UI displayed **“Certified C1 packet imported; rehearsal worksheet restored.”** Re-export retained orphan committed S2, proving replacement of the previously valid worksheet. The changed branch silently reverted to authored `1d6+2`, proving that a packet advertised as certified is not an exact UI round trip.

Canonical export/import/serialize is exact, including 0 prices, authored ranks/branches and initialized, committed, continuation-pending and settled worksheets. That positive control does not excuse malformed/custom admission. Unsupported branch-editor drafts stay labeled unsupported and outside execution, but importing that same kind of modified branch bypasses certification. There is no executable game-record path here; the false certification and active worksheet promotion are the defects.

### R2 — BLOCK: tile-price matching rejects legal records and accepts destructive duplicate recovery

`data/classes/chaosWeaverRules.js:327–399,563–638`.

- Finite Cataclysm `cw1_37`, legal S1/S2/M1/F1, is refused.
- Sixfold Audit `cw1_38`, legal S1/M1/F1, is refused.
- Last Boundary `cw1_last_boundary`, legal M1/M2/F1, is refused.

Exact-ID descriptor values are compared to symbol strings; the any-three descriptor is represented as one combo element and rejected by combo-length checks. These are authored prices, not missing shared-engine capabilities.

After settling Split S1/F1, Fold with `['S1','S1']` returns **`ok:true`, AP reduced by1, `tiles:null`**. The original input object stays immutable, but the returned successful result is corrupt and the UI's `applyResult` would adopt it. Recovery lacks the duplicate precheck applied to ordinary spends; the second transition returns null. Invalid operations must fail without a paid/corrupt replacement state.

### R3 — BLOCK: legal build preview uses the wrong gates and incomplete validation

`data/classes/chaosWeaverRules.js:1015–1081,1089–1172`; workshop `:628–659,784–804,898–905`.

- Three points P01 plus two A01 allow P03 despite only **3 points in Probability**, below its same-tree gate5. Code compares `allocationPoints` to `requiresPoints`.
- Respec `{P01:3,P02:2,P03:1}` minus one P02 retains P03 even though only4 other same-tree points remain. Pruning checks predecessor ranks only, not point gates.
- `buildPreview` accepts a core Split as an optional pick and an isolated unpaid P05 signature. It counts total points without validating the whole allocation or propagating all `canPickSpell` errors.
- Primary tree is first in fixed tree order, not the first invested tree: Cascade then Probability reports Probability.
- Preview level changes do not prune/revalidate existing picks and grants before `knownSpells` exposes them.
- `previewParameterValues` omits nonnumeric A08 trigger options and exposes capstone-extension numeric values before the capstone is learned. C06/C17 and C10/C17 also use different parameter keys for the same final continuation fields, so there is no unified resolved value for those fields.
- At an actually allocated level3 Cascade signature **without C10**, the real rehearsal dropdown offers S1/S2 ward reservations. `continuationOptions` unions all choices without checking `requiresTalentId`. The pure function even accepts reserved F2. Only the reservation's availability/exclusion is checked.

The 5×level/50 global budget and predecessor-full-rank checks do work on ordinary allocation paths. They are insufficient to validate hybrids and respecs.

### R4 — BLOCK: anomaly, once/rest and retained outcome worksheets are incomplete

`data/classes/chaosWeaverRules.js:563–610,629–677,760–879,910–955`; workshop `:1170–1305`.

- Anomaly placement retains no physical selection mapping. “Trigger” immediately spends bound IDs and clears the anomaly without entering a face, retaining M/F outcome, recording a branch settlement, or locking an unresolved anomaly result. The Anomaly specialization numerical witness cannot be completed as specified.
- `resolveAnomaly` accepts early expiry, free dismissal, Counterseal and Unbind without pricing/preconditions or a corresponding action. The real UI exposes free Counterseal/Unbind closure reasons. Paid dismissal through the dedicated button works, but its bypass remains.
- Generic `commitSpell` admits dismissal with no anomaly, Counterseal with no anomaly, and Unbind with no own inert record. The UI guards only the dedicated dismissal case. Counterseal/Unbind casts themselves do not settle the corresponding owned record.
- Safe Rehearsal's zero-count early return skips the once/rest check and deterministic commit never records its use. It can be paid repeatedly in one rest interval. Bound casts also skip usage recording; paid sampled capstone void leaves once/rest unused. These are resource refunds/reuse, even in a local worksheet.
- Selecting Fracture and settling Split leaves `penalties:[]` and the movement counter unchanged. Unchanged counters alone could be consistent with manual adjudication, but there is **no manual branch-result/penalty confirmation path**: the log/settlement records the selected ID, not the published numerical outcome or its expiry. The penalty summary reports0. Only Prepared Exchange populates the penalty list. The draw UI shows IDs/faces but no retained damage/ward/step/downside for the table to confirm. Consequently numerical branch effects cannot be fully witnessed in the worksheet.
- Negative AP/movement and turn0 are accepted by `setWorksheetCounters`; `parseInt` also silently truncates input. Manual input still needs nonnegative integer/domain validation.

Required correction is a **local manual worksheet**: published mapping, explicit human face, retained authored branch, manual movement/penalty/ward confirmations, correct usage/timing and one unresolved choice. Do not implement real HP/AP payments, map watching, trusted dice, timers, reactions or a combat engine.

### R5 — BLOCK: authored structured outcomes and rendered rules are not wholly consistent

`data/classes/chaosWeaverData.js:678–711,1126–1154,1335–1364`; `components/rules/chaos-weaver/ChaosWeaverWorkshop.jsx:318–322,841`.

- `cw1_14` targets willing self/ally, but every `wardOut` defaults `appliesTo:'self'`; an ally choice disagrees with its structured branch. Audit other target/subject fields against §5–§5.156 rather than inferring target semantics from prose.
- `cw1_31` and `cw1_39` Fracture have structured movement containing only a5ft displacement. Their additional caster−10ft penalty and distinct next-start/end-next-turn expiries exist only in prose notes. An outcome must retain **both** effects as typed authored data and show them consistently; the current single movement value cannot express both.
- Anomaly cards display radius/trigger/expiry but not `area.branches`; their exact M/F effects are absent from the card and the action's effect text/inspector must carry more of the rules. R4's trigger flow does not consume those branches either.
- Record inspector selects passive IDs but resolves via the active-only map, then falls back to the **first passive**. Selecting any other passive displays the wrong record/ranks.

This prevents an affirmative “all97 semantically match across rules/cards/rehearsal/export” finding.

### R6 — BLOCK: real-route responsive/focus/legibility requirements fail

`components/rules/ClassesDisplay.jsx:111–129,169–232`; workshop JSX `:589–612,844–875`; CSS `:27–83,244–249,507–519`; resource display `:216–233,319–330`.

- Keyboard Enter opens exactly **one workshop**, but focus goes to `BODY`; keyboard Back also returns focus to `BODY` rather than the opener. No entry/back focus handoff is implemented. Inspector Enter→focus inspector→Escape→focus return **passes**.
- At360px, six tab cells are ~48.67px wide. “Level Progression” content has59px scroll width; “Rehearsal” has52px. Labels visibly collide/clip. Buttons are tappable, but this is not a legible wrapped tab layout.
- Rank buttons are **36px high**, below the explicitly required44px controls (mobile measured137×36). Inspector SVG controls outside the SVG are44px; SVG token hit areas are smaller but have the external inspect alternative.
- Existing global Codex styles override the new CSS: brown/orange gradient header with subtitle `rgb(104,83,62)` on that dark background, and active tab text can be dark on the seal background. These are plainly visible in the original retained screenshots and `mobile-rules-verified.png`. Rules subheadings also inherit bright gold. Calm parchment/palette intent exists but actual mounted legibility fails.
- SVG lane text is5.8/6.4 viewBox units (~8–10px at displayed sizes); tile shapes/labels and accessible summary are redundant, but the small numerical HUD text merits enlargement/readable external text. New locked screenshots show how tiny the selection/downside summary is.
- Most stylesheet selectors are bare `.cw-*`, not rooted under `.chaos-weaver-workshop` as required; strengthen scoped rules without changing global CSS.

**Positives:** 21 existing catalogue choices remain; original class click preserves the route `/rules?category=character-creation&sub=classes&class=Berserker` and callback tests pass. Tab switches preserve pending state. A mobile0-AP Second Possibility pending choice explicitly declined returns only M1; S1/F1 stay spent. Synthesized touch opens the workshop, starts rehearsal, opens/closes inspector; one instance. Reduced-motion mode is static.

Mechanical Impeccable detector reported eight side-accent-border warnings. These are incumbent Codex callouts/explicit statuses and are **not treated as contract defects**; no redesign is requested. Heuristic scores: accessibility2/4, performance3/4 (no profiling), responsive2/4, theming2/4, integrity2/4 =11/20. These scores do not replace the concrete acceptance findings.

## Content and numerical witness accounting

- Actual modules: **40 optional +3 core +6 talent actives +48 passives =97 unique records;54 nodes;18 nodes/50 ranks per tree;150 capacity,50 character cap.** No alias `cw1_07` record; original R1 Read Instability ID is used.
- Read all authored active rows/branches/native/resource rules and all node definitions against the contract. Independent literal checks cover all40 optional names/levels/AP/mana, all54 gates/predecessor lists/rank capacities, every passive's primary rank tuple and all48 derived passive records. Secondary capstone/C17 values were source-compared. Those literal checks pass; structured mismatch examples in R5 and behavioral failures in R2–R4 prevent semantic acceptance. This is not a count-only signoff.
- Correct optional availability has four new choices at every level with≥2 nondamage; legal earlier unchosen pools work. Build admission/respec errors remain R3.
- **Reported fixes retested:** ordinary Fold accepts1 and2 distinct spent IDs; empty/committed recovery refused. Explicit AP/mana0 and zero-count null zones now round-trip. Second Possibility commit costs3 AP; accept charges0 extra, including acceptance from0 AP. These fixes pass, with duplicate Fold and once/rest gaps separately recorded.
- **Probability three-turn witness:** ran the stated paid Fold/Bias/Split sequence; final AP1; available S1/M2/F2; spent S2/M1/F1. Crucial **contract/evidence contradiction**: §10 says S1/S2/F1 with d6=3 selects F1. The normative sorted mapping in §3.11 gives **S2** for3–4 and **F1** for5–6. Actual code correctly selects S2. Use face5 or6 to witness Fracture; amend only the witness/evidence, not the fixed mapping. Implementer report repeats the wrong F1/d6=3 claim.
- **Anomaly three-turn witness:** paid binding, coexistence Split, closure, Fold, rebinding, paid dismissal and Fold conserve IDs; final AP2; available S2/M1/M2/F1; spent S1/F2. The required physical anomaly face and numerical M/F branch cannot be recorded (R4). It is a partial witness, not a pass.
- **Cascade three-turn witness:** T1 accept, T2 Fracture+explicit decline, T3 interrupted continuation. T3 AP0; committed S1/M2/F1; spent M1; available S2/F2. No repeated primary settlement; committed reservation remains locked. Missing retained Fracture penalty/confirmations and illegal continuation choices remain R3/R4.
- Valid Split cancellation/GM void requires a reason, spends committed primary/reservation with no refund, no second face/settlement; no automatic timeout path found. Rest refuses pending/anomaly, requires a new label, restores six and clears once/rest. Anomaly scheduled endT+2 expiry works for the base profile; arbitrary early closure bypass remains.
- Prepared Exchange needs named part, different symbols, spent/available zones, once/rest/no-pending; conserves six and records native penalty expiry. No physical inventory is modified. Different-action movement penalties aggregate by max in the helper, but ordinary Fracture cannot be entered into that helper through the UI.

## Preservation — all25 protected entries

**The arithmetic is21 unchanged +3 concurrent server entries +1 authorized ClassesDisplay seam =25.** The “remaining entry” is `ClassesDisplay.jsx`, explicitly writable under contract §9 item11. It is not a missing fourth concurrent file or unauthorized registry edit.

M = matches entry and delivery; C = differs from entry, concurrent P12B work; A = authorized C1 change. Full SHA-256 values are in `probe-results.json`.

|#|Protected path (repository-relative)|Review result|
|---|---|---|
|1|`server/services/authoredSpellDefinitions.js`|M|
|2|`server/tests/authoredSpellDefinitions.test.js`|M|
|3|`server/tests/fixtures/crA1aDefinitionVectors.json`|M|
|4|`server/services/actorConsequences.js`|M|
|5|`server/services/spellPayments.js`|M|
|6|`server/services/strikeApprovals.js`|M|
|7|`server/services/blockApprovals.js`|C; current matches delivery|
|8|`server/handlers/actorConsequenceHandlers.js`|C; current matches delivery|
|9|`server/handlers/socketHandlers.js`|M|
|10|`server/services/roomAuthorityService.js`|M|
|11|`server/services/roomCheckpoint.js`|M|
|12|`server/services/syncService.js`|M|
|13|`server/services/firebaseService.js`|M|
|14|`server/tests/p9SpellConsequences.production.test.js`|M|
|15|`server/tests/p12aWeaponStrike.production.test.js`|M|
|16|`server/tests/p12bBlockWear.production.test.js`|C; also differs from delivery, see below|
|17|`vtt-react/src/components/spellcrafting-wizard/components/steps/Step5Resources.jsx`|M|
|18|`vtt-react/src/components/spellcrafting-wizard/core/mechanics/resourceManager.js`|M|
|19|`vtt-react/src/components/spellcrafting-wizard/core/utils/spellSerializer.js`|M|
|20|`vtt-react/src/data/classes/index.js`|M|
|21|`vtt-react/src/data/classHeritageRegistry.js`|M|
|22|`vtt-react/src/data/talentTreeData.js`|M|
|23|`vtt-react/src/components/rules/ClassesDisplay.jsx`|A; current matches C1 delivery|
|24|`docs/plans/mythrill-class-reconstruction/implementation/evidence/CR-A1a-independent-review/review.md`|M|
|25|`docs/plans/mythrill-class-reconstruction/implementation/evidence/CR-A1a-independent-review/independent-probes.cjs`|M|

P12B test hashes: entry `b43683a7ac60843ac05fb1872bb9d3a2ae04479a3764046c12401b77c58439dc`; delivery `00ade31d9d9a70d7364fafa877f7a53a27b2602e434d879f88daed271e72b34f`; reviewed `c5e597739a8de9c1f9cb0791f848980e6db022b95834b74be43857fd5e51c178`. **Do not claim all25 match delivery.** Twenty-four do; this test has evolved further.

Inspected the three server diffs: P12B block-approval carry-forward/revalidation, retained rolls, closed-offer tombstones, and B15–B25 controls. They contain no C1 class imports or Chaos Weaver functionality and align with the delivery's concurrent-work classification. Their reported earlier mtimes corroborate but do not prove edit authorship. The extra P12B test delta cannot be reconstructed against the delivery bytes from a hash alone.

All12 delivered C1 application files currently match their delivery hashes exactly, including both modified ClassesDisplay files. Existing class catalogue callback remains in place. No C1 import of global stores, persistence, sockets, payment/actor services or library writers was found; the dependency chain is class-local data/rules, React and the read-only palette/SVG.

**Limits:** this was an already extensively dirty shared worktree. A pair of hashes and mtimes is not a complete filesystem activity log. The ClassesDisplay test's pre-implementation working hash was not captured (delivery explicitly says so). We can verify the current approved-path implementation and the25 listed controls, not assert historical authorship or byte preservation of every file in the whole repository. No unauthorized C1 application edit was identified; none was made in this review.

## Storage/network and scope limitations

Instrumented `Storage.setItem/removeItem/clear`, `fetch` and WebSocket sends after route load, then keyboard entry, rehearsal start, tab switches and export: **zero calls during that bounded workshop pass**. Source inspection shows no worksheet storage/server writer. Existing app-wide `NO_ACTIVE_SCOPE` save warnings recur. Network history includes Firebase configuration GETs and Google Analytics page-view POSTs: do not describe the entire running application as network/write-free. No character/library/room/payment server writes were observed or introduced by C1. The instrumentation was a bounded pass, not a server filesystem audit or a guarantee about all unrelated app code; XHR/indexedDB were not separately instrumented.

No automated combat, balance validation, trusted randomness, multiplayer/persistence acceptance, live class registration, broad P9/P12 suites or production build was performed or required. No core-engine files were changed by this reviewer. Browser refresh/close durability is explicitly out of contract; tab state continuity was verified within a mounted session.

## Disposition

Use `DEEPSEEK-CORRECTION.md` for a bounded repair. Re-review C1 after correction. Gambler/Fate Weaver (including Augur merger and legacy preservation) remains the next conditional content cohort; no implementation or cohort package is issued on this BLOCK.
