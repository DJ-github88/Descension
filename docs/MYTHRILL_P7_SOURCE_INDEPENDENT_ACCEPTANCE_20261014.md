# P7 — independent source acceptance, 2026-10-14

## Verdict: PASS — bounded independent source acceptance

The three remaining P7 source defects are independently closed on the exact source identified below: **B5 lifecycle snapshot ordering; B7 reload-durable private condition recovery and shared/personal condition integration; ordinary F5 bounds/build editing.** The first final-review condition-loss finding is closed by the single permitted bounded repair. No unresolved correction-specific source blocker remains in this review.

The reviewer previously performed the pre-fix root review and cycle1 final review, and performed **no implementation or production edits**. Implementer checks were inspected, not accepted as independent execution. This report consolidates fresh cycle2 execution, explicitly reused prior independent unchanged-source evidence, and the previously accepted bounded decisions. It is not a general audit, deployment/readiness acceptance, full-App/two-device test or whole-current-tree build claim. No P8/P9 work is authorized.

## 1. Exact reviewed identity and custody

- Checkout `D:/VTT`; execution HEAD **`8ee079fa41714890099e3db82b06efa0701bb0cc`**, unchanged during cycle2. Another actor externally advanced HEAD from cycle1's `f901f276388e5814d679dae6def763ceaf9f8e69` while sealing the repair. This reviewer issued no git write, staging, commit, push or deployment command.
- Supplied final seal: `D:/AppData/Temp/opencode/p7-final-20261013/combined/seal-1791980637030/source.json` and `source.diff`. All **42** declared source/test/witness/contract hashes match current raw disk bytes; every embedded snapshot entry verifies. The scoped tracked diff is byte-identical to the supplied diff. Acceptance identifies those bytes, not HEAD alone.
- Independent execution/custody directory: **`D:/AppData/Temp/opencode/p7-final-20261013/independent/cycle2-20261014/`**, called `C2` below. `before.json`/`after.json` identify **56** source/required-input paths, full worktree status, hashes and evidence custody. `source.json.gz` captures their exact raw bytes; `source.diff`, `repair.diff` and `source-hashes.md` retain reviewable identity.
- Compared with cycle1's captured inputs, only production `vtt-react/src/services/silentRoomHydration.js` changed; `final-checks.cjs` added owner-mode verification and a new permanent owner witness was added. All server production/test bodies used for the reused independent selection are unchanged. The external commit's server changes are exactly the previously reviewed correction paths.
- Worktree is **not claimed clean**. At handoff it contained tooltip/style and recovery-document changes. Additional concurrent HUD/spellguard/hook/shared-style edits appeared during execution. Their full statuses are retained; these were preserved and are outside the focal acceptance. No reviewed focal or loaded-source byte drift was found.
- **5,379 preexisting regular evidence files**, including cycle1/root-review/implementer evidence, original re-review and retained repository P6/P7 evidence, hash-match before/after. New outputs use fresh external directories; no retained evidence was overwritten. The original failing external probe itself remains byte-identical.
- Loaded raw production manifests were checked against disk: original/owner probes **335 paths each**, lifecycle **347**, recovery/P6/container/remaining/regressions **281 each**, and the P5 witness's declared **7-path** manifest; zero drift. Counts describe each manifest, not unique files summed across runs.
- `C2/validation-summary.json` records commands, manifest hashes, controls and reuse rationale. `C2/artifact-manifest.json` seals fresh evidence and this external report. Final documentation equality/custody is separately recorded in `C2/documentation-integrity.json`.

### Key raw source SHA256s

| Path | SHA256 |
|---|---|
| `server/services/actorProjection.js` | `fb064c693f7554c8b9f5e6fbdab3baafe2a776f86c0bf75d1439549f1b2d1a8e` |
| `server/services/actorConsequences.js` | `073b4fc7bff449f6dd46cddeb759c5d8f69024d876f12fb2577881d4edc32834` |
| `server/handlers/actorConsequenceHandlers.js` | `7de44c114312adf6982abb485437e4281f1dba18b983a28d158cfc7c86d03acd` |
| `server/handlers/tokenHandlers.js` | `625024f9dd1b5c30d726a5eac10bcc8797aa34fd7707b23a171c57f001647c56` |
| `vtt-react/src/services/actorProjectionOrder.js` | `e92b8c0efa46fe14ad03cfcd4640137df04632006eb34f124c99224807361591` |
| `vtt-react/src/services/actorConsequenceService.js` | `3a3db6508ba7510e28548eb2f8804dfbb9b37b0f413e29fec965abdf040c0427` |
| `vtt-react/src/services/silentRoomHydration.js` | `700842222ed355872639a9dba3d42b3bb8e32bed2c6c93f62d28601b5b3ec627` |
| `vtt-react/src/hooks/useCharacterPersistence.js` | `997b735dd7a31b4352945c70989dab04a5ca28a53abdea08bc130f92d251f840` |
| `vtt-react/src/persistence/characterSaveOutcome.js` | `63cfd47b0e9f590b490c2fe5f19b31aae3eb45ef9ba583814b0a6d6746b66cd0` |
| `vtt-react/verification/p7/evidence/frozen-contract.md` | `a8e0a5a5dee94a7eea0e352d0a0421027928ce82d4ed9f5f86f6832714b9b71a` |

## 2. Scope and governing invariant

Read the updated combined handoff/repair section, exact seals/diffs, lifecycle/recovery/bounds handoffs, original frozen F1–F6 (including ordinary build-edit preservation in F5), and `root-review/ordering-invariant.md`. Inspected the changed production creation/deletion/binding, snapshot/event/admission, scoped recovery and max-only build paths and permanent witnesses before execution. Context7 is unavailable; no new external-library API or dependency was introduced by this review.

The independent lifecycle invariant remains unchanged: once an authoritative lifecycle/projection cut is admitted, older or equal-but-conflicting data cannot change presence, binding, incarnation or protected values in its coverage. Absence remains ordered after a displayed token disappears. New proven creation/binding/deletion, initial hydration, room/map changes, same-runtime reconnect and explicit fresh-runtime reconciliation remain supported. Recovery selection cannot mint freshness. Scope, current delivery context, exact actor revision/owner identity and complete-versus-partial collection coverage remain distinct.

The reviewed implementation uses server `actorProjection` epoch/cut separately from action receipts and checkpoint revisions, creation `actorLifecycle` provenance, synchronous complete actor snapshots and client complete-collection fences. Fences survive token deletion and retain absence without an unbounded per-token tombstone list. Current principal/account-generation/socket/room context and correlated bootstrap/read govern first/new-runtime admission; unknown epoch arrival does not reset authority. The review did not weaken the freeze to fit implementation behavior.

## 3. Three independent closure decisions

### B5 lifecycle snapshot admission — PASS

Fresh cycle2 lifecycle execution checks actual registered handlers, production stores/admission, mounted bind/owner controls and subscribed browser consumers. It refuses retained old bound snapshots after deletion, after unbound recreation and after binding the new incarnation; refuses old absence after recreation; and refuses room/map/section stale arrivals and equal-content conflicts. Explicit recovery no longer promotes a stale/equal-conflicting retained candidate.

Seven negative observations and 14 named control groups complete with zero page errors. Controls cover current duplicate hydration; real initial/unbound hydration and deletion/recreation/bind; lower actor revision and metadata-loss at a greater real cut without partial actor installation; delayed old bind/removal; omitted collections; actual nondefault-map PC primary invalidation/owner selection/removal; retained competing recovery; real debounced token collections; real new Socket.IO same-epoch GM rejoin; room B admission/A revisit; held refresh across room/socket/principal changes; and explicit current-read reconciliation after simulated room-runtime replacement.

Creation/deletion/rebinding still do not misuse the consequence commit sequence as lifecycle order. Real server addressing continues to invalidate obsolete exact refs. Snapshot observations remain silent: RNG0/outbound0. Runtime replacement is a source-level simulation, not deployed crash-durability evidence.

Evidence: `C2/lifecycle-1791980862639/green-1791980880976.json`, command and output log. The prior root RED and original `root-review/ordering-invariant.md` remain unchanged.

### B7 private condition recovery and hydration integration — PASS

The owner/character-scoped private `conditionRecovery` lane in the existing draft family retains exact ambiguous source bytes separately from executable personal runtime/cloud/public conditions. Scoped reads, explicit export/import, immutable retention and storage-refusal status prevent foreign adoption and false runtime confirmation. Direct projection collection works without a mounted persistence hook and does not create a new global raw cache.

Fresh permanent `condition-recovery-browser.cjs --require-collection` executes actual Chrome reload/storage/download: Unicode/NUL/nested/null/false/zero/private/clock bytes survive; the supported selected draft download contains the exact recovery; executable/cloud data excludes it; another selected character/account cannot export or import it; returning owner retrieves it. Selective browser storage failure retains the new exact source in memory, prevents runtime cloud writes/false saved status, then heals by retry without a new edit and survives another actual reload. Local round2 survives reload and actually decrements to1 only in local sandbox. All assertions complete with zero page errors.

**Cycle1 finding and single repair:** full-room global replacement had cleared selected-local conditions before `hydrateActorConditions()` could preserve them. The production repair at `silentRoomHydration.js:372–383` skips that global condition replacement only for shared full snapshots, leaving the original lists for the existing owner-scoped collector. Actor records still come from admitted tokens; off-room/full and existing section behavior remain in their owning paths.

The independent **original failed probe was rerun byte-for-byte**, including its unchanged preservation assertion, with only new output environment/destinations. It now exits0: the same mounted selected owner's local round2 record survives current full-room hydration exactly; active binding/resources remain unchanged, RNG0/outbound0.

The separately inspected expanded permanent owner witness also exits0. Current full-room/repeated/map/section hydration and an actual accepted consequence preserve exact local round2 and round0. Ambiguous private bytes enter scoped recovery; foreign, retired-incarnation and foreign-global records do not become executable. Owner projection remains exact. This closes the same invariant that failed cycle1; no second repair was requested.

Evidence: `C2/original.command.json`, `original.log`, `independent-owner-hydration.json`; `C2/owner-1791980765020/{owner-conditions.json,browser.json,command.json,output.log}`; `C2/recovery-1791980920000/recovery.json`. Original failure remains `independent/review-20261014-cycle1-BLOCK.md` and `independent/run-20261014-final/`; implementer RED/repair observations remain under `combined/owner-1791980516509` and `owner-1791980554413`.

### Ordinary F5 bounds/build editing — PASS

The correction restores real historical state/stats max60 packets as authorized in-place build edits. Typed owning-domain max-only paths validate finite nonnegative numbers and containers/aliases, preserve current/temp/conditions/private token source, reject forbidden/foreign/secondary/metadata/protected-field changes atomically, and preserve exact map/ownership. Effective bounds changes increment actor revision, invalidating old immutable commands and GM proposals; unchanged maxima/unrelated edits do not masquerade as changed actor resources. Lower/zero maxima do not clamp current/temp values.

The independently executed nine registered bounds cases establish fresh bounds validation/admission, exact mirrors and retained checkpoint/cut, unchanged denied-state/relay/persistence, and import quarantine. Mounted production controls execute the real PC max-only token-refresh and character-sync producers, sender/delta consumers, newer maximums/fresh HP command, and refusal of older projected values. The original probe and expanded owner witness rerun that permanent mounted bounds body unchanged on repaired production. Server implementation/test bodies are unchanged from the independently passing cycle1 selection.

Evidence: cycle1 `server-1791979987581/{observations.json,output.log,command.json}` and `bounds-1791980021480/browser.json`; cycle2 original/owner complete bounds observations and source hashes. No deletion/recreation substitute is used to claim ordinary F5 editing works.

## 4. Executed checks and valid reuse

All fresh final-checks commands use cwd `D:/VTT/vtt-react` and `P7_FINAL_OUT=C2`:

```text
node verification/p7/final-checks.cjs <mode>
```

The original independent observation uses:

```text
node D:/AppData/Temp/opencode/p7-final-20261013/independent/cycle2-20261014/run-original.cjs
```

Its child is the unchanged `independent/run-20261014-final/owner-hydration-probe.cjs`. Only output paths/environment are new. Each command JSON retains exact inner argv, cwd, exit, duration, source identity and environment. Output preloads isolate dotenv/provider credentials and redirect evidence/log publications; gameplay source and decision bodies are not replaced.

| Selection / evidence directory | Independent result |
|---|---|
| Original failed observation, `original.command.json` | **Exit0, 11,821ms**, exact local condition retained. |
| `owner-1791980765020` | Exit0; 4 hydration paths plus actual accepted consequence; local round2/zero, scoped raw retention, foreign/retired exclusion, RNG0/outbound0. |
| `focused-1791980765029` | **24 suites / 178 tests passed**, exit0. |
| `lifecycle-1791980862639` | Exit0; 7 negative observations / 14 named controls. |
| `recovery-1791980920000` | Exit0 with `--require-collection`; actual reload/export/isolation/refusal/healing. |
| `p5-1791980818399` | Exit0; **3** original mounted preservation/handoff controls. |
| `p6-1791980818399` | Exit0; **5** original mounted save/retry/export/latest-edit/reload controls. |
| `container-1791980818413` | Exit0; **8** retained container/shape/import/refusal/reload controls. |
| `remaining-1791980862638` | Exit0; **4** controls, including **17 malformed-import refusals**. |
| `regressions-1791980862638` | Exit0; **14** retained import/session/account-generation controls. |
| `lint-1791980919999` | Exit0; **0 errors / 7 retained warnings** (six unused join/handler bindings, hydration anonymous default export). |
| Reused cycle1 `server-1791979987581` | **35 passing**, independently executed before the frontend-only repair, all relevant server bytes unchanged. |
| Reused cycle1 `dependencies-1791980021492` | **192 passing / 1 pending**, independently executed before repair, unchanged server selection. |

The pending dependency row is the intentionally archived opt-in `P7_RED` negative witness, not a conditional DB test. **Conditional unavailable-DB behavior remains unestablished.** No skipped assertion is counted as durability evidence. The 178 focused tests are rerun tests, not additional unique tests to add to cycle1's same selection.

Fresh browser observations have zero page errors and no declared loaded-source drift. Server/dependency reuse is justified by exact focal hash equality, unchanged server test/dependency bodies and the frontend-only repair; `validation-summary.json` records the actual previously executed argv and reuse comparison. Prior bounds observations are supplemented by two fresh executions of the same mounted bounds body.

## 5. Consolidated retained P7 acceptance

Carry forward B1/B2/B3/B4/B6 and A2/A3/A4/A6/A8/A11 bounded independent PASS from their reviewed identities unless a correction-related regression is demonstrated. None was demonstrated; the affected registered P7 and dependency selection passes independently. This review closes the remaining lifecycle/personal-recovery/bounds failures affecting A1/A5/A7/A9/A10. Therefore original P7 is **source-accepted within its frozen F1–F6/A1–A11 scope**, with the following limits retained.

P6 historical acceptance remains attached to its original reviewed source; new P7 integration is accepted by this report and its affected regressions, not merely by preserving old reports. Earlier independent BLOCK/root-review/cycle1 reports and RED snapshots remain evidence of their exact historical bytes; this final source verdict supersedes their current P7 blocker disposition without changing those reports. Presentation findings and current unrelated presentation changes are outside this assignment and receive no acceptance from it.

## 6. Simulations, limits and outstanding gates

1. Provider ID-token verification, canonical owner/backend documents and lease backend are fixtures. Real registered membership/permission/authority/actor decisions execute against them.
2. Persistent writer retention/admission, actor/receipt/checkpoint staging and P3 codec paths execute with simulated cloud transport. Temporary cooperation is explicitly live-only, not crash-durable.
3. Browser Firebase auth/config/SDK/documents, storage transport, router/CSS and inherited inert nonessential render/dice libraries are fixtures. Real production store/service/hook/provider/consumer bodies, mounted controls, Chrome storage/reload/download execute.
4. Browser outbound uses HTTP to real fixture Socket.IO clients; inbound subscriptions are explicitly bridged. Real same-epoch reconnect executes; room-object/runtime replacement is simulated, not deployed crash/restore. No full-App/join/router, real Firestore/rules admission, two-device or deployed restart durability acceptance is claimed.
5. Private condition recovery is device-scoped/read-only source and explicit export, not executable ownership or a room/public receipt. Capacity/serialization/device refusal is visibly memory-only for new refused bytes; no unsupported reload-survival promise is made. P6 origin-memory-only session recovery and deferred unreachable backup restore limits remain.
6. Hydration is silent replacement, not gameplay/ticks/payment/roll execution. A11 fixtures are already-adjudicated final common pools. No class economics, initiative/mitigation law, P8/P9 controller/payment or physical-playtest acceptance is introduced.
7. No fresh whole-current-tree build or full test-suite claim. Scoped lint has the seven recorded warnings. Unrelated presentation/content changes and their tests are outside the accepted focal identity. No deployment or release readiness follows from source PASS.

**P5-05/07/09/10/11/12/13/31/32 remain outstanding.** All nine environment/readiness gates and roadmap release conditions remain in force. No gate is closed by these simulations, by the archived pending test or by this source verdict.

## 7. Documentation and stop

After independent execution PASS, preserve this complete external report byte-for-byte as `docs/MYTHRILL_P7_SOURCE_INDEPENDENT_ACCEPTANCE_20261014.md` using `apply_patch`, and update only the engineering ledger's current P7 source verdict/evidence routing while retaining historical sections and all outstanding gates. Documentation equality and preserved historical ledger content are checked separately after publication. This does not change production, the git index or HEAD.

**Final independent decision: P7 source PASS at the exact reviewed hashes; no unresolved correction-specific source blocker. Stop at P7.** No commit, push, deployment, presentation edit or P8/P9 work was performed or authorized by this review.
