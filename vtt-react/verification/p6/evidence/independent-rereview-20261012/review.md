# Independent bounded P6 R1–R6 re-review — 2026-10-12

## Verdict: BLOCK

The six original reproductions are valid and their literal original symptoms
are closed by the corrected runner. P6 is nevertheless not accepted: independent
correction-focused probes demonstrate an R1 unrelated-data decoding regression
and incomplete R4 consumed-structure validation. R2/R3/R5/R6 pass this bounded
review. No fixes were implemented; stop at this verdict.

The external gaps runner's GREEN/exit0 labels mean its observation assertions
completed: two assertions reproduce acceptance failures, while the third proves
R5 owner-return accessibility. Those labels are not P6 PASS decisions.

## Actual identity and integrity

- Checkout: D:/VTT. HEAD before/after:
  620fbc072e87f113cdcc2ea323e0c6c2b28e6d6b. Corrections are uncommitted.
- Read original roadmap P6 plus H3/H5/P5 dependency, frozen P6 contract,
  complete original BLOCK report, correction report, source-hashes.md and
  final-identity.json. Read runner, snapshot/freezer/finalizer, original
  independent supplement, original browser harnesses and correction production
  paths. No graph existed; no graph generation or general P5/P6 audit performed.
- before.json hashes 11,992 Git tracked/nonignored untracked files; after.json
  hashes 11,993. All 280 focal production/witness/contract paths remain identical;
  full focal before/after SHA256s are recorded in focal-hashes.md and identities.
- All eleven correction source/test hashes match the supplied corrected table.
  Permanent P6 witness hashes and existing evidenceHashes match final-identity.
  Fresh GREEN, supplemental, P6 and P5 manifests identify those actual bytes.
- All preserved independent artifacts match their recorded SHA256s. Original
  BLOCK report equals preserved review.md. P5 report/witness files and frozen
  contract remain unchanged. ClassCodex.css remains
  a0406c34078720c4f96ac8ea5f89843bb9e61c94fc614fb51bdc35ea01106e5d.
- Frozen snapshot has 268 files, each independently compared with the original
  reviewed after.json. Compressed SHA256:
  340b007680f2e6b456fa35a9414fb726f6e5c4bf0b3517569f055d96b056aa11.
- At review start, final-identity differed only for SpellLibrary.jsx and
  DebuffEffects.jsx: styling classes/inline-style removal and duplicate native
  title removal, respectively. During review, concurrent App.jsx gained only
  an import of new styles/calm-shared.css (item-tooltip presentation). These
  files are outside the tested production module manifests and do not invalidate
  the bounded P6/P5 behavior evidence. All concurrent styling is preserved.
  This is not a full App-shell or exact-current-whole-checkout build claim.

## Runner execution and historical RED validity

Executed from D:/VTT/vtt-react, each exit 0:

    node verification/p6/regressions-browser.cjs --red
    node verification/p6/regressions-browser.cjs
    node verification/p6/character-save-browser.cjs
    node verification/p5-01/character-preservation-browser.cjs

The permanent regression runner writes repository evidence by default. An
external NODE_OPTIONS preload redirected only its green.json and evidence/red
artifact writes outside the repository; it did not alter scenarios, production
module bodies, payload handling or assertions. Snapshot extraction was already
external. finalize-evidence.cjs and freeze-reviewed.cjs were inspected, not run.
The finalizer is not read-only with respect to repository evidence despite its
header: it normalizes/copies logs and rewrites identity/hash/diff artifacts.

Fresh RED's manifest exactly equals the original independent supplement's
manifest, not merely the same HEAD. Ten scenarios complete with no page errors.
Six specific original observations reproduce:

1. R1: real addItem authors ordinary-blade, position row0/col0 and [[true]];
   canonical reports would-change-preserved-data and runtime success:false;
   no ordinary-blade-bearing payload reaches either character destination.
2. R2: after real failed autosaves settle, notes newer work to preserve / HP7
   become older exported draft / HP19, without alert, replacing candidates.
3. R3: imported runtime HP5/item becomes retained HP21/items[], without alert.
4. R4: wrapper c-a with canonical.id=c-b changes roster to c-b while selection
   remains c-a, without alert.
5. R5: held A session rejection after A-to-B persists the exact A PRIVATE
   DELAYED CHANGE marker in B's scoped offline queue.
6. R6: stale canonical read releases under B, attempts metadata.lastPlayedAt
   on characters/c-a with live UID u-b, and only then outer sync rejects.

Exit 0 means those specific evidence assertions succeeded, not P6 acceptance.
Four original positive controls execute. Reconciliation's original historical
scenario is observational; fresh final-source retained-controls.cjs additionally
asserts synced0/failed1, one retained queue entry and exact canonical notes.

## Explicit R1–R6 dispositions

### R1 — BLOCK: ordinary inventory fixed, unrelated decoding changes data

Passing evidence: default 1x1 and production custom 2x2 matrices preserve exact
items through canonical/runtime submission and loads, mounted combined/import
paths, failure retention, real reload recovery and healed retries. Legacy
sanitizer-encoded string rows decode back to boolean matrices. Existing raw
matrices remain matrices. Unknown unsupported futureNested:[[1,2],[3]] remains
exact and is refused before canonical submission; cyclic/BigInt recovery/export
refusal controls remain intact.

Independent failure: characterShapeCodec.js:13–20 traverses every plain object
and treats any nested property named shape as inventory shape data. A saved
record's preservedFields.futureAnnotation.shape.cells:["[true]"] is supported
ordinary string-array data in an unrelated annotation. transformFromStorage
and real loadCharacter silently return [[true]] instead. The source object
itself remains untouched, but the decoded preserved value is changed. There is
no item-path restriction or encoding provenance separating these meanings.

Where: src/utils/characterShapeCodec.js:13–20;
src/services/firebase/characterPersistenceService.js:197–205. Evidence:
gaps.json, review-gap-R1-legacy-and-unknown-shape-decoding. This violates frozen
contract #7/roadmap backward-compatibility and the explicit unrelated-data check.

### R2 — PASS

Both differing unsaved candidates are checked before staging/application. The
older mounted import visibly refuses; notes newer work to preserve, HP7, roster
and both exported candidates equal their pre-import values. The File's exact
text remains the older JSON. Refusal does not mutate selection or projections.

### R3 — PASS

Clean matching runtime import uses the owning hook's synchronous apply guard.
HP5 and imported-blade become live and exact retained runtime JSON survives
unrelated store notifications and explicit retry/load. Genuine subsequent HP4
edit stages pending and confirms after healing. Conflicting runtime-only import
visibly refuses with HP21/current candidates and exact source file preserved.
Valid canonical-only and combined controls also pass.

### R4 — BLOCK: identity defect fixed; consumed structures incompletely validated

Original contradictory embedded canonical.id is rejected before mutation.
Wrapper version/owner/target, runtime identity/version, canonical owner, runtime
inventory.items and invalid canonical stats controls all refuse without changing
roster, selection, notes/resources/items or candidates. All-lane preflight
prevents a valid canonical lane from applying when tested runtime data is invalid.

Independent failure: a matching clean import with canonical.class={invalid:
"object"}, runtime:null and notes INVALID CLASS MUST NOT APPLY passes preflight.
Roster class, live class and retained canonical class all become the object;
live/retained notes become the imported marker. There is no alert. The permanent
validator only checks truthiness of required name/race/class and numeric stats;
the added preflight does not validate those consumed core field types.

Where: src/persistence/characterSaveOutcome.js:188–217 and 239;
src/services/firebase/characterPersistenceService.js:64–87;
src/hooks/useCharacterPersistence.js:95–114;
src/store/characterSlices/coreSlice.js:875–925.
Evidence: gaps.json, review-gap-R4-invalid-consumed-canonical-class;
independent mounted MCP input confirmation in mcp-invalid-import.yml. This is an
accepted invalid structure, not a claimed loader exception or backend exploit.
It fails the requested before-mutation consumed-structure boundary.

### R5 — PASS for bounded refusal/private memory semantics

Origin is captured in the core caller and propagated through session await,
dynamic sync acquisition and queue admission. Account and same-UID generation
retirement return false and produce no B queue/private-marker write. Exact
origin change remains in the session object, pendingSync=true with memory-only
syncError. The ordinary same-owner failure/heal control syncs one change and
confirms a subsequent session update, with canonical HP9 and an empty queue.

Independent accessibility check: under B, getActiveSession(c-a) returns null and
B queue excludes the exact retained marker. On same-page A return, the production
getActiveSession returns that exact origin source; core endCharacterSession
applies it and the simulated canonical document contains the exact marker.
Therefore this is accessible private origin memory, not merely an assertion
against an unreachable Map. It is not reload-durable and has no selected-draft
UI export status. No new requirement that a refused retired session operation
must create a reload-durable offline replay system is imposed. Its memory claim
matches this demonstrated limited behavior, and it is not accepted as cloud
confirmation or device-draft recovery. Evidence: gaps.json R5 owner-return case.

### R6 — PASS

Loader captures scope/generation, checks matching live principal/source predicate
before read, after read, immediately before metadata write and before return.
Sync supplies its own current-candidate predicate to the loader. Held read
release after account or same-UID retirement produces zero characters/c-a write
attempts and rejects. Attempts are observed before simulated admission/rejection.
Legitimate new-generation P5 handoff writes remain separately recorded while
the stale read is held. Same-owner ordinary load/session-sync controls succeed.

## Existing acceptance and affected P5 regressions

- Corrected permanent runner: 14/14 GREEN, no page errors; green.log/green.json.
- Existing P6 browser: all five named witnesses PASS; p6-browser.log.
- Original P5 browser: pending-edit, failed-preservation, marker-failure 3/3
  GREEN, including zero retirement submissions, required preservation holds
  and exact recovery; p5-browser.log.
- Exact unchanged 18-suite command selection from correction report executed;
  original affected 16-suite/99-test P5 boundary retained, plus P6/closure:
  18/18 suites, 134/134 tests, no failures/skips, 20.666s; regressions.log records
  full verbatim command and results.
- Four original supplemental controls re-executed against final source:
  canonical/runtime persisted ordering, later-edit/old-token protection,
  mounted cyclic export refusal, pending reconciliation/no false completed sync.
  retained-controls.json/log contain exact observations.
- Targeted lint evidence is reused for its unchanged correction-source/witness
  scope: reported 0 errors/warnings, evidence bytes match final identity. Prior
  detached corrected-source build log/exit inspected: Compiled successfully/0,
  evidence hash matches. No new whole-checkout build claim is made for concurrent
  presentation edits; those lie outside these bounded behavioral manifests.
  No rerun required to establish the demonstrated source BLOCK. Fresh git
  diff --check passes; CRLF conversion notices are not whitespace failures.

## Simulation and missing proof

Real Chrome, installed React/Zustand, actual production compiled module bodies,
stores/coordinator/gates, mounted provider/status/file input, localStorage/Web
Locks and document/module reload execute. Auth/config/admission and Firestore
transport are simulated. Production ordering/fences/outcome/queue logic are not
mock replacements. Correction fixture rejects raw nested arrays and records all
write attempts before backend behavior. Reload cloud Maps survive only in
fixture sessionStorage; the R1 witness reinstates both refusal flags after reload.

No full App/router/provider-shell acceptance, actual SDK/backend rules/admission,
staged deployment or second-device durability proof. Backup creation executes
in browser; backup restoration does not. Deferred reversed backup restore
signature remains unchanged and unexpanded. These limits are not hidden by green
simulation results and do not replace the demonstrated source defects.

P5 remains 33 accepted / 0 source BLOCK / 9 environment-blocked / 0 inconclusive
within its prior accepted scope. P5-05/07/09/10/11/12/13/31/32 remain outstanding.

## Review artifacts and repository effects

All authored review scripts, hashes, observations, logs and report are under
D:/AppData/Temp/opencode/p6-rereview-20261012. Snapshot extraction also uses
external p6-reviewed-* temporary directories. Fresh RED and GREEN repository
evidence were redirected externally. The two automatically generated MCP
scratch log/snapshot files were relocated from its fixed .playwright-mcp output
directory to this external directory; pre-existing scratch files were untouched.

No production, repository evidence, contract, witness or pre-existing repository
file was modified by this review. Observed before/after differences are the
concurrent App.jsx styling import/new calm-shared.css only, explicitly inspected
and preserved. All focal files and original evidence are unchanged. No commit,
push, deployment, fix or P7 work occurred. Final verdict: BLOCK.
