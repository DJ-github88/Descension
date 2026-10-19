# Mythrill / Prism — engineering state

Updated: 2026-10-18. Checkout: `D:/VTT` (the old `D:/Mythrill/Descension`
path in CLAUDE.md is historical). Roadmap authority: [MYTHRILL_NEXT_PHASE.md](MYTHRILL_NEXT_PHASE.md).

## Accepted baseline

- Reviewed HEAD: `620fbc072e87f113cdcc2ea323e0c6c2b28e6d6b`.
- P5: **33 independently accepted / 0 source BLOCK / 9 environment-blocked / 0 inconclusive**.
- P5-01 **PASS**; F1 wrong-owner submission and F2 destructive failed preservation independently closed.
- P6 **PASS — independently source-accepted**, including the final R1 container
  compatibility correction. Acceptance identifies the uncommitted reviewed bytes,
  not HEAD alone; R2/R3/R4/R5/R6 and the annotation correction carry forward.
- Accepted journal, privacy, P5-19 and socket cases carry forward.
- Source acceptance **is not deployment readiness**.
- P7: **PASS — independently source-accepted 2026-10-14** at exact reviewed
  hashes, execution HEAD `8ee079fa41714890099e3db82b06efa0701bb0cc`.
  Source acceptance is bounded to frozen F1–F6/A1–A11; no P8/P9 approval.
- P8: **PASS — independently source-accepted 2026-10-14**, original Branvig
  Feather Slash only, frozen F8.1–F8.5/W1–W12. The single bounded repair closes
  B8-1; source acceptance does not close human/tabletop/backend/deployment gates
  or authorize P9/broader combat proposals.
- P9: **PASS — independently source-accepted 2026-10-15 (cycle2)**, original
  supported single-target DICE damage/healing only (contract F9.1–F9.4 + repair
  erratum). Acceptance names the exact 29 P9 file bytes, not the live device tree.
- P10: **Reviewed bundle integrated and locally verified 2026-10-16**; original
  independent isolated review carries forward. Sol's identified hook/build/App
  integration dependency is closed. Human/tabletop and operational release gates
  remain open; no deployment-readiness claim.
- Outstanding gates: **P5-05/07/09/10/11/12/13/31/32**. No gate is closed by P6 client simulations.

## Evidence

- Complete independent report: [MYTHRILL_P5_01_INDEPENDENT_ACCEPTANCE_20261012.md](MYTHRILL_P5_01_INDEPENDENT_ACCEPTANCE_20261012.md), retained from `D:/AppData/Temp/opencode/p5-01-independent-acceptance-20261012.md`.
- Replay/frozen P5 contract: [MYTHRILL_P5_01_CHARACTER_PRESERVATION_REPLAY.md](MYTHRILL_P5_01_CHARACTER_PRESERVATION_REPLAY.md).
- Historical verification/matrix: [MYTHRILL_PROJECT_5_WAVE_C_VERIFICATION.md](MYTHRILL_PROJECT_5_WAVE_C_VERIFICATION.md).
- Mounted reconnection evidence: [MYTHRILL_P5_38_MOUNTED_RECONNECTION_COMPLETION.md](MYTHRILL_P5_38_MOUNTED_RECONNECTION_COMPLETION.md).
- Permanent P5 browser witnesses: `vtt-react/verification/p5-01/character-browser-harness.cjs` and `character-preservation-browser.cjs`.

The independent report's hashes identify the accepted P5 source and witnesses.
P6 acceptance is separately recorded below; it does not close any P5 environment gate.

### P6 exact reviewed identity and retained acceptance

- Checkout `D:/VTT`, branch `master`, HEAD `620fbc072e87f113cdcc2ea323e0c6c2b28e6d6b`.
- Complete independent report, byte-for-byte:
  [MYTHRILL_P6_CONTAINER_INDEPENDENT_ACCEPTANCE_20261012.md](MYTHRILL_P6_CONTAINER_INDEPENDENT_ACCEPTANCE_20261012.md).
  SHA256 `f5cfa5450ee970cf6e1c0bb0720a8be98e38df4ccaec968cf7ef6e50851e47d3`.
  Original: `D:/AppData/Temp/opencode/p6-container-independent-20261012/review.md`.
- Accepted `vtt-react/src/utils/characterShapeCodec.js` SHA256
  `ddbd6d694e62a8a14709d058be69b14b0fcce20d32364be69564dd8303a83b37`.
- Accepted `vtt-react/verification/p6/container-browser.cjs` SHA256
  `706e4f964b6a89612044ffc9e15f354b18118b375b985d24b191aadaac7003c4`.
- Repository evidence: `vtt-react/verification/p6/evidence/independent-container-acceptance-20261012/`.
  Complete source inventories `before.json`/`after.json`, `focal-hashes.md`,
  behavioral manifest `green.json`, artifact manifest, raw observations, runner
  commands/logs and detached build evidence are retained. Prior RED/historical
  snapshots and supporting evidence remain in the existing P6 evidence tree.
- Preservation check: all **12,175** prior inventoried files matched before edits;
  all 45 independently manifested artifacts plus the manifest were byte-copied
  and hash-verified. No accepted runtime/source/witness bytes were changed.

### Historical P6 verdict ledger

These reports are **superseded as the current verdict** by the final independent
source PASS above. Their findings and original report bytes remain intact.

| Historical report | Current disposition |
|---|---|
| [Original BLOCK](MYTHRILL_P6_INDEPENDENT_BLOCK_20261012.md) | Superseded by final independent acceptance; original R1–R6 evidence retained |
| [R1–R6 re-review BLOCK](MYTHRILL_P6_INDEPENDENT_REREVIEW_BLOCK_20261012.md) | Superseded by final acceptance and intervening bounded corrections |
| [Container BLOCK](MYTHRILL_P6_CONTAINER_INDEPENDENT_BLOCK_20261012.md) | Sole remaining container R1 closed by final acceptance |

### Accepted limits / outstanding environment gates

P6 witnesses used real Chrome, React/Zustand, production bodies, stores,
provider/status/import controls, scoped browser storage and reload. Auth/config,
Firestore transport and backend admission were simulated. Compilation succeeded
for the accepted source; this is not full-App behavioral acceptance, real
Firebase/rules/admission, staged deployment or second-device durability proof.
R5 private same-page **origin-memory retention is not reload-durable**.
Unreachable backup restoration remains **deferred**, not accepted as working.
P5-05/07/09/10/11/12/13/31/32 remain environment-blocked. Source acceptance
does not authorize deployment or satisfy roadmap §20 release gates.

## Current work

### P13B-E1a — 2026-10-19 (contract prepared only; no execution code authorized)

Creator records collector W complete at its accepted boundary and requests the bounded original
`universal_riposte` execution contract. [P13B §12](MYTHRILL_PROJECT_13B_CONTRACT.md#12-smallest-next-execution-candidate--e1a-not-authorized)
now pins the authored source/card and1-AP price, exact attacking creature/Parry, authenticated GM
success/prior-payment attestation, a fresh Riposte choice, exact owner consent/retained rolls, GM final
damage and one P7 AP/HP/consumption receipt. A closed collector intent and the manual Parry-follow-up
opener converge through that same opportunity; neither card text nor a closed Parry window authorizes it.

The contract reuses P12A/P9 consent/custody/payment/receipt machinery with a strict named branch, **not**
P12A's2-AP/formula path. Prior Parry payment remains **GM-attested**, never charged again by E1a.
Cancellation/stale/unknown/rejoin/restart and private proof/public receipt boundaries are specified;
no new timer for execution or pre-restart reissue. Unresolved rules stay GM-adjudicated; unsupported
conditions/extras unapplied. Required engineering gates are not falsely claimed to exist already.

No new rule answer blocks this manual boundary; explicit contract/freeze and implementation go-ahead
remain required. Eligible-card highlighting/real triggers, Counterspell/Intervene/chains, shared condition
lifecycle and obstruction/propagation remain future tracks (§12.7). Documentation only: collector review/
build/App not repeated, no payment/effect code or Class/RI-1/Wizard/A1b edits, migration, commit/push/deploy.

### P13B-W declaration collector — 2026-10-19 (implemented, reviewed, integrated handoff complete)

**Creator acknowledges completion at the accepted §11 boundary.** E1a preparation reuses it unchanged;
it adds no execution permission to W and repeats no collector review or build.

Creator approved **D13-6b full8s/no normal early close, D13-11 private pre-cutoff correction/withdrawal
with history, D13-10 interrupted/manual takeover and original-deadline reconnect**. The HUD's GM form
seals exact GM choices/explicit none before opening; invited primary owners privately declare card
references/notes, correct or withdraw. At cutoff GM alone receives private review. Silence needs no Pass;
no other-player choice/count/arrival-priority display. All open and retained closed windows are reachable.

**Collection is implemented; reaction resolution is manual.** GM attests the moment/eligibility and
holds the base action; verifies cards/range/components, orders simultaneous choices, rolls, determines
outcomes and settles prices through existing manual controls. W does not detect resource conflicts,
reserve/spend/release/refund anything, apply effects, stop/rewind attacks, submit a P7 command or create
an accepted consequence. No automatic trigger parsing, reaction chain or A1b installation. A follow-up
is a distinct GM-opened linked window, not inferred success. Deadlines never restart on reconnect.

**Independent review closed:** initial bounded review BLOCK → repaired → source acceptance; the **same
review's final delta acceptance** closes the final three changed runtime files/service regression and
reconciles exact Build3/App4 hashes. **No remaining bounded review blocker.** Original RED evidence
retained. Server9/9, latest client3 suites/14 tests, prior repair probes5/5 reused; only missing delta
coverage ran (3/3 probes). No broad audit or completed App/build/B2/class checks repeated for handoff.

**Integrated identity:** unchanged HEAD `8ba81efbf935e08d4fcd488a9b597f5eb8031b0f`, uncommitted exact runtime/
test/witness hashes and review reports in [P13B §11](MYTHRILL_PROJECT_13B_CONTRACT.md#11-w-implementation-and-integrated-handoff--2026-10-19).
Final detached **Build3 exit0/drift[]**, current W client build mismatches `[]`; asset manifest
`84547e1ea7d908471eda1aee12d76cc833b48e1b9e56cb815b8acf482e5bbe01`.
Retained **production-App4 PASS**: GM/owner/observer,1440/820, original member/window/deadline and current
revision4 on real transport reconnect, no duplicate submission, one persistent rejoin listener, private
review, manual child/interruption, accessible controls, dark headings and inset lists. No pool/typed-class
change or P7 receipt (0→0); raw private markers absent; every other gameState byte equal after **only**
root/map `actorProjection.cut` exclusions. Three deliberate fixture Firebase fetch errors retained.

**Limits:** live-only private records, no durable secret replay/restart recovery; principal-private
unknown/unavailable audit is in-memory. IDs/bytes survive same-principal rebind, not reload durability.
GM form has one controlled reactor+bundled note/explicit none; card IDs/labels are unverified references.
Capacity, real Firebase/rules, second-device/human urgency/fairness and deployment limits remain stated in
§11. Class RI-1's own review is BLOCK/correction pending per its parent checkpoint; no class acceptance
or payment support is inferred. Parent checkpoint/class files and accepted B2/rejoin evidence preserved.

**Next proposal only:** [E1a §12](MYTHRILL_PROJECT_13B_CONTRACT.md#12-smallest-next-execution-candidate--e1a-not-authorized),
one universal Riposte1-AP/one-creature HP consequence after a GM-attested successful, paid Parry, with
GM arithmetic/eligibility and exact owner consent. No new rule answer blocks that manual boundary;
the execution/consumption contract and implementation still require separate freeze/go-ahead. No new
automatic payments/effects, A1b, commit, push or deployment in this handoff.

### P12C-B2 §8.1 — 2026-10-18 (implemented, reviewed, locally verified)

**Creator approved G1/G3/G3a/G5 and authorized this first slice.** Original Radiant Burst only:
10-ft circle,20-ft origin range, one selected damage/healing channel, square grid. The HUD's manual
confirmation now offers **Preview area** independently of its manual notice. Crosshair, free-point
placement, source/origin/aim/range/circle, geometric-only token markers, Keep/Cancel/Clear, keyboard/
tablet-touch and focus return work through the existing targeting/AoE infrastructure.

**Completed acceptance acknowledged by creator, 2026-10-19.** Carry forward the exact source/build/App
identities below unchanged. This reaction preparation neither widens the preview nor repeats its checks;
future class/content/profile edits do not inherit this bounded10-ft/20-ft acceptance automatically.

- Positive occupied-cell overlap, once per exact actor; contact alone excluded. Reuses the actual
  movement footprint helper at verified cell-centred placements; unknown/off-grid footprints manual.
- Candidate output lives inside the actual token visibility gate; no hidden names/highlights/counts/
  ARIA output or cached member list. Source/visible movement invalidates confirmation permanently until
  re-kept; scope/entry/effect retirement, disconnect/loading and grid changes clear the transient session.
- Recipient conflict, walls/LoE/elevation remain visibly GM-decided. Malformed/altered dimensions or
  source coordinates give an explicit manual fallback. **No roll, payment, chat or consequence**.
- One bounded independent review: initial R1–R7 BLOCK → repaired → source accepted. Affected9 suites/
  44 tests; final changed3 suites/11 tests (overlap); final reviewer2 suites/7 tests. Scoped lint0 errors/
  1 incumbent warning; detector[]. **Final detached build3 exit0/drift[]; actual production-App7 PASS**
  at1440px and supported820px, including touch. Zero outbound events and unchanged pools/authored record/
  receipt count. Three deliberate Firebase `Failed to fetch` errors retained, no other page-error type.
- Exact source review, build/asset/result identities and external paths:
  [B2 §15](MYTHRILL_PROJECT_12C_B2_CONTRACT.md#15-first-slice-implementation-and-verification--2026-10-18).
  No full-repository/source snapshots or copied evidence asset trees. Prior accepted closure reused.

**Limits:** owner selected primary source and HUD confirmation entry only; transient/local preview,
not legal recipients/casting. Other spells/shapes, propagation, reactions, area execution and authoritative
obstruction remain unfrozen. Phone tactical grid is gated by the incumbent App; hidden flags are
fixture-seeded per viewer, not live hide-control transport proof. Live Firebase, physical second-device,
human-table and deployment gates remain open. Original class spell/Wizard untouched; A1a/W1a/W1b hashes
unchanged and A1b parked. Concurrent Class C1 source/checkpoint/assets preserved. No commit/push/deploy.

### Historical area-preview and reaction preparation — 2026-10-18

The following preparation record predates the creator's §8.1 approval/implementation above. Its wider
B2 profiles, §14 obstruction enforcement and P13B execution remain conditional; its old blanket B2/W
preparation-only status is superseded by the completed handoffs above.

**Main HQ bounded continuation:** live contracts still contain no later B2/P13B approval or
implementation. [B2 §8.1](MYTHRILL_PROJECT_12C_B2_CONTRACT.md#81-first-freeze-candidate-one-original-ranged-circle)
now pins one original ranged-circle/effect-channel freeze candidate: four immediate choices
**G1/G3/G3a/G5** or explicit manual boundaries; G1b/G3b/G4 stay independent/manual outside that first
subset. Radiant Burst's recipient conflict remains visible. The existing packet carries this short
confirmation batch; it adds no reaction questions. [B2 §14](MYTHRILL_PROJECT_12C_B2_CONTRACT.md#14-obstruction-aware-aiming-conditional-technical-boundary)
prepares clear/blocked/partial/unknown feedback, sight versus trajectory/cover/area distinctions,
spatial revalidation and scoped GM ruling, plus a **future** P7-stage enforcement seam. Source inspection
found door `state`/`isOpen` and wall-key/ID representation gaps, visual-object sight approximations,
and movement not versioned by actor resource CAS; none repaired or turned into Prism rules. Explicit
zero field meanings remain Class HeadQ-owned, not inferred by B2. A1a/W1a/W1b device hashes rechecked
and unchanged. One bounded read-only independent review found no blocker and one freeze-wording
correction, now applied. Validation is scoped documentation/source consistency only; no new runtime
acceptance/build claim. Class C1 correction work/checkpoint preserved; coordination row24 records the
future spatial dependency. **No production implementation authorized by this continuation.**

Documentation-only HQ takeover from the actual checkout at HEAD
**`8ba81efbf935e08d4fcd488a9b597f5eb8031b0f`**. Pre-existing uncommitted combat closure, corrected A1a,
class C1, unrelated source/data/assets and staged race-image deletions were preserved. Relevant starting
drift and source findings: [B2 §2](MYTHRILL_PROJECT_12C_B2_CONTRACT.md#2-actual-checkout-and-evidence-boundary).

| Deliverable | Preparation status | Implementation status |
|---|---|---|
| [P12C-B2 contract](MYTHRILL_PROJECT_12C_B2_CONTRACT.md) | Draft complete: authored shape/origin mapping, crosshair/placement lifecycle, visible-only candidates, boundary/Large/gridless examples, manual walls/elevation | **Not frozen/authorized/implemented**; preview only, no rolls/payment/proposals/chat/effects |
| [P13B contract](MYTHRILL_PROJECT_13B_CONTRACT.md) | Draft complete: actual trigger/card matrix, sealed GM-first declaration protocol, deadlines/identities/typed capability gaps/recovery and four worked cases | **Not frozen/authorized/implemented**; smallest W manual bridge proposed, E1 named execution separate |
| [Creator packet rev2](MYTHRILL_DECISIONS_AREA_AND_REACTIONS_BATCH1.md) | Compact independent questions/recommendations/dependencies; revision1 preserved as history | **No new decisions approved**; no default ordering/Pass/payment/reservation rule adopted |
| [Shared dependencies/ownership](MYTHRILL_CROSS_TRACK_COORDINATION.md) | Current class handoff33/C1 requirements reconciled; preview versus authoritative geometry separated | No new authority/payment system or class migration |

**Source findings, not repairs:** legacy area tool counts/names all-map token centres and supplies
default cone/line dimensions; it cannot be reused unchanged for B2. Current P9 typed planners/payment
adapters do not reserve resources/cards. Intervene, Counterspell variants and Parry/Riposte wording need
exact card/moment interpretation, kept explicit in the drafts. No generic after-roll reaction window.

**Class-track reconciliation:** corrected W1a/W1b and A1a service hashes match coordination §3. A1a is
unhooked; final F1/F2 evidence is correction plus verification, not fresh independent review of untouched
implementation. **A1b is PARKED**, per current class handoff33. C1 reports a class-local manual workshop,
not live casts. R1/CR-L1 schemas are proposed; exact reviewed domain requirements are needed before a
reaction-payment/execution freeze, not before preparing the conditional contract.

**Verification boundary:** focused source/document inspection and documentation consistency/whitespace
checks only in this takeover. Reused the retained evening slice-closure evidence below: corrected P12A
11 checks, single production `room_joined` registration, repeated rejoin recovery, slices/P12B/recovery/P9
witnesses, 88 suites/567 tests and successful rebuild. No rerun merely to reconfirm handoff; no application
implementation, commit, push, deployment, reset or dependency change. Live Firebase/deployment/physical
second-device/human-table gates remain open. Next: creator answers or explicit manual subset, then HQ
freeze and separate implementation authorization.

**Creator addition — targeting/propagation inventory complete (preparation only).** Existing
[B2 §9–§13](MYTHRILL_PROJECT_12C_B2_CONTRACT.md#9-targeting-and-propagation-coverage-matrix) now holds one
source-backed coverage matrix, per-mode semantics/open decisions, save-path discrepancies and five
representative flows. All six actual Wizard propagation methods, alternate selection/area encodings,
prose piercing/ricochet, persistent/moving/channel zones and linked/delayed/triggered recipients are
separated into selection → first delivery → propagation → application/timing. Whole draft JSON differs
from outer save/normalizer/game-code projections (including zero range/count and flat/nested parameters).
No finding repaired in application code. Recommended sequence: Class-owned targeting preservation/
mapping contract → B2 simple static preview → bounded list/path aid; P13B actual reaction moments and
P14 named multi-recipient consequences remain separate, with lifecycle follow-ons for persistent/
delayed/linked state. Coordination rows22–23 and roadmap §13 updated. No new supported execution mode,
rules approval, test/build rerun, commit or deployment. Concurrent class correction work preserved.

### P12B-r1, P13A, P12C-B1 — 2026-10-18 (implemented, reviewed, uncommitted)

Authorized by HQ 2026-10-17. Report: [MYTHRILL_SLICES_20261017_IMPLEMENTATION.md](MYTHRILL_SLICES_20261017_IMPLEMENTATION.md).
Frozen contracts: [P12 rev 5 §3.9](MYTHRILL_PROJECT_12_CONTRACT.md), [P13A](MYTHRILL_PROJECT_13A_CONTRACT.md),
[P12C-B1](MYTHRILL_PROJECT_12C_B1_CONTRACT.md). Class dependencies:
[MYTHRILL_CROSS_TRACK_COORDINATION.md](MYTHRILL_CROSS_TRACK_COORDINATION.md); roadmap §11–§12.

- **P12B-r1 PASS:**
  - recorded block rolls survive stale state: carry-forward is allowed only with ledger proof of sibling
    AP payments; otherwise the GM revalidates with a public reason;
  - an unavailable piece stays a GM ruling;
  - withdrawn or voided attacks are closed and cannot be rolled again.
- **P13A PASS:**
  - calm HP/temp-HP floats from exact before/after revisions ("absorbed" only when established);
  - narration, history and accessible announcements for AP, mana and wear;
  - visibility filtering on every surface; deduplicated deliveries; no replay.
- **P12C-B1 PASS:**
  - map picking for P8, P9 and P12A (crosshair, rings, advisory range ring, aim line);
  - roll drafts bound to owner, character and action;
  - manual shared-room actions spend nothing.
  - Post-review witness fix: Esc while picking no longer opens the exit dialog.
- **Behaviour change:** in shared rooms, unsupported actions post a notice and spend nothing locally.
- **Verification:**
  - server P12B suite 21 passing;
  - client 81 suites / 534 tests, plus the Feather Slash unsent-roll test;
  - one integrated optimized build;
  - new App witness PASS; regressions in the report.
- **Integration closure 2026-10-18: PASS.**
  - Rejoin recovery is restored through the single `room_joined` listener and an in-process fan-out
    (`roomRejoinBus.js`), with no added socket listeners and the listener-count test unchanged.
  - Repeated rejoins are verified in the App: one read per rejoin, no accumulation, no duplicate receipt.
  - The adjudication column is bounded and collapsible; Feather Slash opens by real click at 1440 px.
  - New-epoch safety regression P12B B25 added.
  - **Production behaviour:** `registerRoomJoinedListener` (services/roomRejoinBus.js) owns each socket's
    single `room_joined` listener. The App lifecycle passes its join handling; the listener ignores retired
    sockets and relays only a rejoin of the current room.
  - **Harness result (corrected 2026-10-18 evening):** the P12A witness calls the same production
    registration (it does not mount MultiplayerApp) and passes all 11 checks, with stronger rejoin
    assertions. The original witness is kept as `app-browser.20261016-original.cjs`.
  - The slices witness passes: repeated rejoins, retired socket, left room.
- **Open creator decisions:** S1, F1, G1–G6; a "pay listed costs" control needs its own payment contract. Next decision batch: [MYTHRILL_DECISIONS_AREA_AND_REACTIONS_BATCH1.md](MYTHRILL_DECISIONS_AREA_AND_REACTIONS_BATCH1.md).
- **Class track (planning milestone, Class HeadQ):**
  - CR-W1a (0-AP coercion) and CR-W1b (resourceCost export loss) are accepted class-track
    prerequisites; their corrected hashes were verified on the device. Combat made no repair.
  - CR-A1a working tree matches its corrected SHA-256 (`48b69255…`); HEAD `8ba81efb` has the
    pre-correction bytes. Current handoff33 parks CR-A1b under Main HQ; corrected evidence provenance above.
  - Shared coordination, file ownership and verified identities:
    [MYTHRILL_CROSS_TRACK_COORDINATION.md](MYTHRILL_CROSS_TRACK_COORDINATION.md).
  - P13B/P14 **execution freezes** require the class package's exact reviewed requirements; the conditional
    P13B preparation draft is now complete above.
- Not authorized for implementation: P12C-B2, P13B, area execution. No commit, push or deployment.

### P12B-thin creature hit → owner block → HP and wear — 2026-10-16

**C1/D-E approved; frozen contract revision 4 §3 implemented; one bounded independent review
(initial BLOCK → all repairs confirmed) PASS; integrated production build and App smoke PASS.**
Report: [MYTHRILL_PROJECT_12B_IMPLEMENTATION.md](MYTHRILL_PROJECT_12B_IMPLEMENTATION.md).

**Built:**
- owner declaration in the server-enforced selection window;
- GM attack offer → owner block roll bound to that attack → one P7 command (creature AP, target HP,
  recomputed wear) with minimal public text;
- owner/GM-scoped declaration;
- private custody lineage saved with equipment and inventory;
- add-then-clear breakage.

**Defect fixed:** item loss when a piece breaks with a full pack (`itemStore.updateItemDurability`).

**Review:**
- R1: a declaration's public command hash leaked the order and dice by enumeration; the hash is now withheld.
- R2–R7 and note 8 repaired.

**Results:**
- server 12 P12B tests, 61 PASS with P12A/P9/P7;
- client 25 focused tests, 142 PASS in the affected set;
- App P12B witness PASS: real sync, turn refusal, declare, block, duplicate/out-of-order, full pack,
  backup, observer privacy;
- P12A and P8/P9 App regressions PASS, 0 page errors.

**Evidence and identity:** outside Git at `D:/AppData/Temp/opencode/p12b-20261016/`. The build ran in
the cloud workspace from a hash-identified snapshot; its limits and the concurrent live drift are
recorded in `build.json`.

**Still open:** every other creator decision (C2–C5, D-A…D-J except D-E), H-a…H-e, and the live,
human and deployment gates.

### P12A basic weapon strike — 2026-10-16

**Implemented; one bounded independent source review PASS; manifested production build and
full-App witnesses PASS.** Frozen PC → one bound creature / owner approval → direct GM → one
P7 AP/HP consequence only. Report:
[MYTHRILL_PROJECT_12A_IMPLEMENTATION.md](MYTHRILL_PROJECT_12A_IMPLEMENTATION.md). Review:
[MYTHRILL_P12A_INDEPENDENT_REVIEW_20261016.md](MYTHRILL_P12A_INDEPENDENT_REVIEW_20261016.md).

- Takeover found seven passing interrupted server tests and no P12 client. Completed both action
  bars, owner/GM panels, private exact-byte approval/prepared-command custody and rejoin/reload
  recovery. Price2 AP temp first; approval never spends; accepted results come only from receipts.
- Per-weapon ranks/raw proficiency faces and full authored outcomes are visible; no inferred face,
  table-damage bonus or executable prose. Published-tier/lone-flat-DR arithmetic only; undecided
  defenses require a GM verdict. Critical flat DR remains GM-adjudicated, never armor-bypassed.
- Strict schemas, post-await authority/registry rechecks, closed-ID capacity reservation and a
  shared synchronous cross-P9 identity gate preserve domain isolation. P9 module/approval-handler
  bodies unchanged. Independent B1/B2 and S1–S4 repaired in the same bounded review.
- **13 P12 registered tests; affected server49 PASS.** Frontend14 suites126 PASS plus affected/
  additional6 suites30 checks (overlap). Scoped lint0 errors;31 incumbent client warnings, no new
  P12 warnings. Scoped whitespace clean. P8/P9 actual production-App regression PASS.
- Final frozen production build exit0, mirror drift `[]`; build/source/config hashes and asset
  manifest are outside Git at `D:/AppData/Temp/opencode/p12a-frozen-final-20261016/`. Full App
  proves all three producers, miss/hit/critical, physical/digital, manual outcome, lost-ACK exact
  recovery, owner/GM reload, same-socket rejoin,33 completed strikes and runtime-unknown behavior.
  Separate App witness proves stale CAS refusal → GM reload → explicit corrected command.
- **P11's outstanding local build/full-App closure is complete**, including separate ranks,
  legacy recovery, actual device saveCurrentCharacter→scoped roster→reload, creation budget,
  Summary readiness and existing over-budget edit mode. Source acceptance and local closure do
  not close live Firebase/rules, deployed restart, physical two-device or human/tabletop gates.
- Two earlier concurrent-writer build attempts and their failures are retained externally. Final
  acceptance identifies the frozen integrated source, not later unrelated live App/account/
  transition-overlay/SpellActionBar CSS edits. Concurrent source/assets/data are preserved.
- *(Superseded 2026-10-16: P12B-thin is implemented under C1/D-E; see the P12B section above.)* **P12B remained preparation-only at P12A completion. None of D-A…D-J was approved then.** Proficiency modifier/explosion/
  lookup, creator Laws validation, first-table session and operational gates remain open. No
  reactions/timers, equipment wear, elixirs or multi-target execution. No commit/push/deploy/reset.

### P11 Skill and Weapon Proficiency Foundations — 2026-10-16

**Implemented; one bounded independent review PASS (after one repair cycle).**
HQ defined P11–P14 after the original ten-project roadmap ended (an earlier check the
same day found no original P11). Roadmap: [MYTHRILL_P11_P14_ROADMAP.md](MYTHRILL_P11_P14_ROADMAP.md).
Contract: [MYTHRILL_PROJECT_11_CONTRACT.md](MYTHRILL_PROJECT_11_CONTRACT.md). Report:
[MYTHRILL_PROJECT_11_IMPLEMENTATION.md](MYTHRILL_PROJECT_11_IMPLEMENTATION.md). Review:
[MYTHRILL_P11_INDEPENDENT_REVIEW_20261016.md](MYTHRILL_P11_INDEPENDENT_REVIEW_20261016.md).
HEAD unchanged `8ea1abff`; no commit/push/deploy/reset.

- Weapon Mastery ranks are per weapon type (`skillRanks.weaponMastery_<type>`, owner
  `utils/weaponProficiency.js`); legacy shared rank kept byte-for-byte, never applied,
  offered per weapon. No persistence/schema change.
- Creation point-buy enforced with the unchanged budget/costs: class-skill selection
  and upgrades need the points; new characters over budget cannot finish (Skills step
  and Summary); edit mode only informs.
- Creation/sheet wording aligned with the P10 Laws; open rules labelled. Roll
  arithmetic unchanged. Proficiency→combat follow-up specified, not implemented.
- **31 new tests + 73 regression tests PASS**; lint equals baseline; real-browser
  witness **28/28** (`vtt-react/verification/p11/`, bundle/evidence outside Git at
  `D:/AppData/Temp/opencode/p11-browser-20261016/`).
- **Local build/full-App closure completed during P12A** (report above and P11 report addendum).
  Open: live Firebase/second-device/human gates; creator decisions D11-1…D11-6.
  Concurrent presentation edits (Skills `stats-combined`, restyled P11 CSS, wizard
  CSS/Step1/Step10) preserved. Skills.jsx working copy was CRLF over LF HEAD before P11.
- **Historical P11 closure attempt (superseded by P12A local closure): required detached production build and
  full-App smoke NOT run.** Desktop control on the PC reported "available but not turned
  on" (twice, after the owner approved it); the device shell is a Linux VM (4 GB,
  180 s/call, no detached or Windows processes) and cannot run the AGENTS.md build. A
  launcher is staged outside Git at `D:/AppData/Temp/opencode/p11-closure-20261016/run-build.cmd`
  (wraps `verification/p10/run.cjs build`, which records the exact built source).
  Outstanding: that build plus App smoke of two weapon ranks, save/reload, legacy
  recovery, creation budget + Summary readiness and an over-budget edit. The witness
  harness compile is not a substitute. Stray `docs/.p11probe` (5-byte "test") removed.
- **Historical P12 preparation before the subsequent revision3a freeze**, revision2: draft contract
  [MYTHRILL_PROJECT_12_CONTRACT.md](MYTHRILL_PROJECT_12_CONTRACT.md) and creator brief
  [MYTHRILL_P12_CREATOR_DECISIONS.md](MYTHRILL_P12_CREATOR_DECISIONS.md). 12A (PC basic strike
  → one creature) now includes an explicit manual proficiency step (raw die face recorded; GM
  picks table face / none / deferred; non-damage effects listed as "Not applied by the VTT") and a
  defense matrix over five verified creature-defense sources (library fields, 35 creatures'
  prose passives, instance conditions, creature-wizard homebrew in a "percent taken" encoding,
  campaign free text). 12A automates only published-tier library resistances and a lone instance
  flat DR; everything else is a required GM ruling, so 12A can be frozen with no decision answered.
  New findings recorded as decisions D-I (homebrew encoding) and D-J (prose vs structured
  defenses); D-B now separates attacker-side "damage dealt" lifesteal from defender-side absorb;
  D-F shows miss-chance consequences of the half-die cap and six formula options (141 of 195
  creature damage abilities roll several dice). No decision is approved. Audit:
  `vtt-react/verification/p12/defense_data_audit.py`.
- **Current next:** P12A is frozen, implemented and locally verified as recorded above; P11's
  local build/App gap is closed. Creator decisions remain prerequisites for any later widening or
  P12B freeze. Creator Laws validation, first-table session and H13 owner remain.

### P10 integrated; Sol bounded closure complete — 2026-10-16

**Complete for the identified integrated source and production App.** Report:
[MYTHRILL_P10_INTEGRATION_20261016.md](MYTHRILL_P10_INTEGRATION_20261016.md).
Entry/final HEAD `8ea1abff1d8c1f959b2d4a10e6b7ca73879c2ff2`; unrelated class
icons and later concurrent journal presentation retained. No commit/push/deploy/reset.

- Inspected archive tooling, all 38 target paths matched HEAD; guarded dry-run and
  single apply pass. Integrated runtime exactly reverse-checks the reviewed diff.
  Rules/lore cache versions 2.3.0; abilities/creatures and capability guards unchanged.
- Retained committed `useSessionManagement.js` delta unchanged; focused 4/4 and
  [bounded independent PASS](MYTHRILL_SESSION_CLOSURE_BOUNDED_REVIEW_20261016.md).
  No substantive production reconciliation beyond reviewed P10.
- **48 suites / 477 tests PASS**; scoped whitespace clean. Lint adds no findings:
  actual 33 incumbent errors/209 warnings versus HEAD 33/210, recorded honestly.
- **One final detached production compile PASS**, relevant drift `[]`; actual
  production-App Feather Slash and P9 HUD→owner→GM accepted-receipt smoke PASS.
  Laws browser verifies stale IndexedDB refresh, growing die/open skill details,
  First Table/defense/support text, creature tooltip and default tracker 4 AP /
  opening initiative retained / temporary AP preserved.
- Small relevant identity/results: `vtt-react/verification/p10/integration-identity.json`;
  bulky build/log/browser evidence remains outside Git under
  `D:/AppData/Temp/opencode/p10-integration-20261016/`. This is fixture-bound local
  browser proof, not live Firebase, deployed restart, human or physical-device proof.
- Later unrelated journal and character-wizard CSS edits are preserved outside
  the built-source claim; they do not reopen bounded P8/P9. Exact integration-path
  whitespace passes; concurrent wizard CSS has separately observed whitespace.
- **Next bounded task:** creator validation of published Laws/canon and the existing
  GM + two-player physical/VTT first-table session; appoint H13 operations owner.
  P9 `<attr>/K`, all nine P5 environment gates and staged operational proof remain
  open. Per-weapon rank storage, conflicting roll paths, negative point budget,
  out-of-scope skill copy and eventual proficiency combat wiring remain separate
  follow-up work. P10 is no longer waiting for Sol.

### P8/P9 bounded integration follow-through — 2026-10-15

**PASS for the three bounded corrections and identified frozen desktop frontend;
whole-rolling-tree/deployment acceptance remains open.** Current integration report:
[MYTHRILL_P9_INTEGRATION_FOLLOWTHROUGH_20261015.md](MYTHRILL_P9_INTEGRATION_FOLLOWTHROUGH_20261015.md).
Historical P7/P8/P9 reports/hashes below retain their original meaning.

- Verified accepted/current complete Branvig raw definitions equal; explicitly
  admitted abilities `1.5.0` alongside `1.4.0` without changing the original
  capability, command/receipt identity or content guards. Shopkeepers retained.
- Existing `migrateBlockId` import and the actual PartyHUD right-edge host/CSS
  repairs were already copied here; preserved and independently reviewed.
- Focused **7 suites /87 tests**, lint **0 errors /27 incumbent warnings**,
  P8/P9/rejoin isolated browsers and formerly outstanding P7 lifecycle pass.
- Final frozen-current-source production build **exit0 /no mirror drift**;
  actual production-App P8 fan and P9 HUD→owner→GM→receipt paths pass.
  Two deliberately refused Firebase fetch page errors remain recorded.
- Completed independent reports and exact current identities:
  `vtt-react/verification/p9/evidence/integration-20261015/sol/`.
  Final packet SHA256 `e9aed0321e5aa850eec06f3c1de573fe1589788c94e239e66fcbc8d11bc1cbf9`.
- A later live `useSessionManagement.js` edit was not in that historical frozen
  build. **Resolved 2026-10-16** by the P10 integration/closure above: retained source,
  bounded independent review, final integrated build and production-App smoke pass.
  Creator `<attr>/K`, real-backend/two-device/human and P5 environment gates remain open.
- HEAD externally advanced `dd445bec`→`f491e694`; this implementation/review issued
  no commit/reset/push/deployment. Two concurrently replaced generated P7 evidence
  JSONs have both original hash-verified and newer copies retained in `sol/`.

**Current P9 verdict: PASS — independently source-accepted, 2026-10-15, cycle2.**
Complete independent report, preserved byte-for-byte:
[MYTHRILL_P9_SOURCE_INDEPENDENT_ACCEPTANCE_20261015.md](MYTHRILL_P9_SOURCE_INDEPENDENT_ACCEPTANCE_20261015.md),
SHA256 `d379b925bb4dcb811b103d6879df10e1be5ea0188dec9b4aa66c80207cb777a5`. Contract:
[MYTHRILL_PROJECT_9_CONTRACT.md](MYTHRILL_PROJECT_9_CONTRACT.md) (frozen V1 + repair erratum).
Handoff: [MYTHRILL_PROJECT_9_IMPLEMENTATION.md](MYTHRILL_PROJECT_9_IMPLEMENTATION.md).
Evidence: `vtt-react/verification/p9/evidence/` (`implementation-20261015/`,
`repair-cycle1-20261015/`, `independent-review/independent-cycle1-and-cycle2.tar.gz`
with the cycle1 BLOCK report, probes, cycle2 runs and the 29-file LF-normalized
identity manifest `p9-identity-lf-sha256.txt`).

Cycle1 BLOCK (B1 approval consumable via propose/adjudicate; B2 consumed-approval
memory bounded by the receipt ledger, with false "no payment" wording) was closed by
the single bounded repair; N1–N4 also closed. Supported set from authored data:
Marrow-Piercing Slug, Restorative Prayer, Opening Chord, Harmonic Strike; every other
class payment/shape stays manual with a diagnostic. Owner approves price + one roll,
GM confirms the final amount, one atomic P7 command installs source pools (temp
first), the revisioned class home and target HP; receipts are the only result.
Witnesses: P9 server 132 passing, focused 230/230, Chrome S3/S4/S6/S7/S9, server P7
35/1 pending, P8 W1–W12/rejoin/runtime and P7 owner pass; full server 599 passing /
2 pending (development check). Executed in a disposable mirror of this HEAD with
LF-identical content (device shell has no Chrome) and partly on the device.

**Creator decision open:** `<attr>/K` rounds down (Arcanoneer's authored text); veto →
non-integer quotients go manual. **Concurrent third-party drift (2026-10-15, after the
P9 seal), not attributed to P9:** ~90 modified tracked files on `D:/VTT` including
accepted P8 inputs `public/data/abilities.json`/`creatures.json` (additive: four
shopkeeper creatures; grimmstalk unchanged), `creatureStore.js`, `versions.js` and a
colour-only change to P9's `SpellCastConfirmation.jsx`. P8's accepted data hashes no
longer match the device; this needs creator acceptance/attribution. P7 `lifecycle`
browser witness was not runnable (external `D:/AppData` input unavailable). Human
tabletop/creator, two-device, live backend, full-App build and deployment remain
outstanding. No commit, push or deployment.

### Historical P8 verdict

**Current P8 verdict: PASS — independently source-accepted, 2026-10-14, cycle2.**
Complete independent report, preserved byte-for-byte:
[MYTHRILL_P8_SOURCE_INDEPENDENT_ACCEPTANCE_20261014.md](MYTHRILL_P8_SOURCE_INDEPENDENT_ACCEPTANCE_20261014.md).
SHA256 `62bdda8fcc100846bbb4a6554fd29ddef3cbe5dd67e4ffc2e16b99e2324a9f92`.
External original:
`D:/AppData/Temp/opencode/p8-20261014/independent/final-cycle2/review-20261014-final-PASS.md`.

Reviewed HEAD remains `8ee079fa41714890099e3db82b06efa0701bb0cc`; dirty concurrent
work is preserved. Repair input packet:
`D:/AppData/Temp/opencode/p8-20261014/repair/seal-1792005519293/source.json`,
SHA256 `cd49b31eccc57c717ae938d89d437520b66faf2294f7a8648b758d4e53f8a07e`.
Frozen P8 contract SHA256
`1436f823b44405a9ecf47d41da99d8c5522dafc75acaaae6aec8243a960b5173` is unchanged.
Independent accepted source: **527 unique inputs /2,412 loaded comparisons /0 drift**,
`final-cycle2/accepted-source.json.gz` SHA256
`b53b919df7f944dfbe58a7ec380c46b0af99097b437ce7d21dd01a3c58e74a0c`.
Full hashes: `accepted-source-hashes.json` SHA256
`46c804c60306011d1e7a83d21608557a748cb2e56559989e52ff46474b7dd5bc`.
The focused controller's accepted SHA256 is
`f8f5654578981e482751b4a48ebef54b4774bbe0f43db1c7cb6943614e423b09`.

Fresh independent B8-1 held-ACK/same-owner real Socket.IO rejoin passes: retired
delivery retains unknown intent/exact UUID/roll; explicit same-command checking
returns the original accepted receipt without new payment/damage/RNG. Stable
mounted W1–W12, fresh Node/P3 known-versus-unknown recovery using the review's own
browser inputs, affected P7 owner/lifecycle controls and actual Chrome printed
reference all pass. Focused **13 suites /128 tests**; scoped lint **0 errors /20
incumbent token warnings**. Exact commands/results are in `final-cycle2/validation-summary.json`;
raw observations, PDF, source snapshots, `publication.json` and artifact manifest
are retained in that same external directory. Cycle1 BLOCK/failure/probe remain
under `independent/final-cycle1/`; the sole bounded repair cycle is consumed.

Actual raw loader/fan/controller/target UI, exact bound creature or primary-PC,
GM final adjudication, temp-first affordable atomic two-actor P7 command, scoped
latest-action custody and receipt-only GM/observer result are accepted for this
original slice. **40/42** historical P7 seal entries are unchanged; only the
intentional client prepared-command/principal seam and classified storage family
extend P7. Server/schema/static data remain unchanged; P5/P6/P7 historical
acceptance stays attached to its original reviewed identity and is not relabelled.

This is source proof with declared provider/owner/lease/cloud transport and browser
SDK/config/inert-library fixtures. **Actual human/creator/tabletop/GM-observer-PC,
two-device, live Firestore/rules/backend lease, full-App/build, staged deployment
and deployed crash/restart proof remain unperformed/outstanding, not waived.**
Recorded physical faces parity and Chrome print do not claim human playtesting.
**P5-05/07/09/10/11/12/13/31/32 and roadmap release gates remain outstanding.**
Reviewer changed only report publication and this ledger; no production edits,
git writes, commit, push or deployment. **Stop before P9.**

### Historical P7 independent source acceptance

**Current P7 verdict: PASS — independently source-accepted, 2026-10-14.**
Complete independent report, preserved byte-for-byte:
[MYTHRILL_P7_SOURCE_INDEPENDENT_ACCEPTANCE_20261014.md](MYTHRILL_P7_SOURCE_INDEPENDENT_ACCEPTANCE_20261014.md).
External original:
`D:/AppData/Temp/opencode/p7-final-20261013/independent/review-20261014-final-PASS.md`.

The three remaining defects are independently closed: B5 lifecycle ordering,
B7 reload-durable private recovery/shared-personal condition preservation, and
ordinary F5 bounds/build editing. The cycle1 local-condition loss is closed by
the single bounded repair; the independent original failed observation now
passes unchanged, as do expanded matched-owner hydration/receipt controls.
Earlier independent B1/B2/B3/B4/B6 and A2/A3/A4/A6/A8/A11 PASS carry forward.

Reviewed exact seal: `D:/AppData/Temp/opencode/p7-final-20261013/combined/seal-1791980637030/source.json`.
Execution HEAD was externally advanced to `8ee079fa41714890099e3db82b06efa0701bb0cc`;
concurrent unrelated work was preserved. All 42 seal entries match; independent
56-path source snapshot/hashes and 5,379-file retained evidence custody are under
`D:/AppData/Temp/opencode/p7-final-20261013/independent/cycle2-20261014/`.

Independent cycle2 results: 24 focused suites / 178 tests; original failed probe;
matched-owner full/repeat/map/section/accepted-receipt witness; lifecycle and
actual reload/export/isolation/storage-refusal recovery browsers; retained P5
(3), P6 (5), container (8), remaining (4 plus 17 malformed refusals), and regression
(14) controls all pass. Scoped lint: 0 errors / 7 retained warnings. Prior
independently executed unchanged server evidence remains valid: 35 registered
tests and 192 dependency passes / 1 archived opt-in P7_RED witness pending.
Conditional unavailable-DB behavior remains unestablished.

This is source acceptance with simulated provider/Firestore/lease/cloud transport
boundaries, not full-App/two-device/deployed restart/live-backend or whole-current-
tree build acceptance. **P5-05/07/09/10/11/12/13/31/32 remain outstanding.** P6's
historical source acceptance stays attached to its original reviewed identity.
No deployment, commit/push, P8/P9 or presentation work follows. Stop at P7.

### Historical P7 correction handoff and pre-final BLOCK

**Current P7 verdict: independent BLOCK (B1–B7); corrections implemented,
awaiting independent acceptance.** The historical implementation claims below
are retained. Current report:
[MYTHRILL_P7_B1_B7_CORRECTIONS_20261013.md](MYTHRILL_P7_B1_B7_CORRECTIONS_20261013.md).
Complete independent report/probes/source identities are retained at
`vtt-react/verification/p7/evidence/independent-block-20261013/`.
Permanent reviewed-source RED replays and corrected production-path GREEN
witnesses are at `evidence/corrections-20261013/`.

New checks: **25 registered P7 checks**, mounted functional socket subscriptions,
ACK/broadcast retry custody, protected snapshot/reconciliation and selected
personal-payload scoping; **580 server passes / 2 pending**, **19 affected frontend
suites / 144 tests**, preserved P5/P6 browser controls. The full frontend run has
separate presentation failures; see the styling-owner section of the current
report rather than treating them as an identical baseline. P6's historical source
PASS and P5's nine environment gates remain unchanged. New integration bytes
require independent review. No P8/P9 work or self-acceptance follows.

External concurrent commits moved HEAD during this correction session from
`620fbc072e87f113cdcc2ea323e0c6c2b28e6d6b` through `4d60e5d3` to
`6552db470bc850595b8891721208fe77c2c2c8ee`. This correction agent issued no commit,
push or deployment command. Full final hashes, rather than HEAD alone, identify
the corrected source. Earlier source identities remain historical evidence.

### Historical implementation handoff (before independent BLOCK)

**Project 7 — Actor Instance Consequence and Condition Contract: V1 frozen under
coordinator C1–C6; implemented source awaiting independent acceptance**, original
roadmap §26/§27 scope. Contract: [MYTHRILL_PROJECT_7_CONTRACT.md](MYTHRILL_PROJECT_7_CONTRACT.md).
Implementation/source handoff: [MYTHRILL_PROJECT_7_IMPLEMENTATION.md](MYTHRILL_PROJECT_7_IMPLEMENTATION.md).

P7 evidence is retained at `vtt-react/verification/p7/evidence/`: exact starting
inventory/source snapshot, pre-fix negatives, registered server and mounted
browser witnesses, retained affected regressions and final behavioral hashes.
P6's accepted verdict remains attached to its reviewed hashes. New dependency
bytes are regression-covered implementation source, not already independently
accepted P6/P7 bytes. Source acceptance and real-backend/staged gates remain
separate; P5's nine environment gates are unchanged.

No P8/P9 controllers, class-payment/initiative/mitigation rules or P11–P14 were
implemented. No commit, push or deployment. Stop at the bounded P7 independent
acceptance handoff.

Latest P7 source checks: **18/18 registered/import checks**, mounted production
HUD/owner/turn/recovery witnesses with zero page errors, full server **573 passing /
2 pending / 0 failures**, affected frontend **19 suites / 144 tests**, and detached
final build **Compiled successfully / exit0**. Retained P5/P6 browser controls pass
unchanged. Full frontend retains one identical starting-source Pyrofiend SVG
assertion failure (2,731 tests pass); unrelated whole-worktree whitespace remains.
Scoped P7 diff check is clean. These results are implementation evidence, not
independent P7 acceptance or closure of the nine environment gates.
