# P5-01 — bounded character-preservation replay

## Frozen acceptance contract (2026-10-12, before replay/source edits)

Checkout: `D:/VTT`; starting HEAD: `620fbc072e87f113cdcc2ea323e0c6c2b28e6d6b`;
starting worktree: clean. Reviewed failing baseline:
`ef4082801513ff82630b22bdf88a330600a5397b`.
The newer HEAD already contains the F1/F2 implementation and subsequent
completion/recovery corrections. This task verifies them rather than reimplementing them.

1. **Production composition:** real `initStoreRegistry`, `authStore` and its
   `installAuthBootstrapGate` subscription, all registered scoped-store handoff
   participants, `accountHandoffCoordinator`, `characterStore` slices,
   `characterScopedStorage`, offline service, canonical character persistence
   service and backup service. Mount real `CharacterManagement` inside real
   `PrivateProjectionBoundary`. The isolated harness is not the full App shell.
2. **Auth/scope/generation:** activate A, load and select `c-a` through production
   actions, author notes using real `updateLore('notes', marker)`. Assert the
   actual production 2,000 ms debounce is pending and the roster still has the
   baseline. Change live auth to B; synchronously observe live B / retained A
   scope / original generation / `handoffPending:true`. Hold a final
   `stopNewWork` observer for longer than the debounce. Successful retirement
   advances generation and activates B; failure must keep B ineligible.
3. **F1:** no A payload may be submitted with B's argument/metadata/live UID.
   No cloud save of the pending payload during retirement, and no flush plus
   second save. A's exact working edit must reach A's scoped roster and required
   deferred-publication marker before activation, then recover through A's
   production load/activation and publish only while A is authenticated.
4. **F2:** reject every marker-bearing local storage write (roster, forks and
   supplementary offline cache). Also refuse just the required publication
   marker. Inspect real returned failure statuses and the coordinator result;
   exercise thrown/rejected external failures through the production write
   chain. A memory candidate is an isolated retry hold, not restart durability.
   Healing storage and retrying must preserve the exact candidate before B
   activation. Return to A and recover the marker. Failed cloud publication on
   return must retain the durable local source and marker until healed retry.
5. **Privacy/staleness:** character roster, active pointer and active selector
   empty immediately; mounted private DOM hidden in the notifying turn and
   absent through the held interval. Late A completion cannot reinstall A in B,
   mutate B status, consume B pending work or retire B's recovery marker. Existing
   permanent character/completion and journal/privacy regressions cover these
   accepted boundaries without reopening them.
6. **Allowed simulation:** Firebase configuration/auth provider and Firestore
   SDK network calls (isolated in-browser documents and logs), Socket.IO transport
   (unused by these scenarios), routing, CSS and unrelated heavy graphics/icon
   packages. No store, save, scoped writer, offline writer, coordinator, character
   backup or preservation implementation is substituted. Chrome, localStorage,
   Web Locks, React, Zustand and mounted character component logic are real.
7. **PASS/BLOCK:** all assertions above must hold. Any wrong-owner submission,
   duplicate handoff save, exposed private projection, activation without confirmed
   preservation, lost candidate or stale completion mutation is BLOCK. These are
   client production-path results, not live Firebase/rules/socket admission or
   deployment acceptance.

## Evidence precedence and scope

The repository verification document includes historical self-reported totals.
Mind indexes a later independent acceptance (2026-10-11), including raw source
hashes, but memory alone does not override the supplied independent BLOCK.
This replay records current behavior and leaves the verdict **corrected,
awaiting independent Sol acceptance**. P5 is not self-closed and P6 is not started.
P1–P4, accepted journal cases, P5-19 and P5-38 retain their accepted status;
P11–P14 remain provisional. Environment gates P5-05/07/09/10/11/12/13/31/32
are unchanged by this bounded task.

## Current position and newer evidence

HEAD remained `620fbc072e87f113cdcc2ea323e0c6c2b28e6d6b` throughout this task.
There were no starting dirty paths. The diff from `ef408280…` already includes
the owner-bound snapshot, awaited preservation/hold, deferred recovery marker,
local-first saving, completion fencing and serialized canonical writes.
No runtime implementation change was necessary in this task.

Mind's `project-5-final-independent-source-accepted-closed-2026-10-11` reports a
later independent PASS/closure. Its **seven focal runtime raw SHA256 hashes
exactly match** the source compiled by the fresh GREEN replay below. The retained
`p5-sol-independent.log/.results.json` also report mounted P5-01/P5-38 PASS, but
that log does not itself provide the later complete F1/F2 acceptance report.
No newer repository independent acceptance report or current-state ledger was
found. Thus: newer implementation is verified; the later acceptance claim is
disclosed rather than converted into this implementer's closure verdict. The
requested independent Sol review remains the acceptance handoff for this task.

## Pre-change observations and permanent RED→GREEN replay

Before changing any runtime source, the existing production-path character and
isolation suites passed **2 suites / 18 tests** on current HEAD. The new frozen
browser replay likewise passed on current source; F1/F2 do not reproduce there.
Historical RED was then reproduced against an isolated `git archive` export of
the supplied failing commit, using the **same repository runner and assertions**.
The checkout was never switched, reset, cleaned or patched to old source.

| Witness | `ef408280…` RED | Current HEAD GREEN |
|---|---|---|
| F1 `pending-edit` | Actual debounce pending. Live B / retained A / generation 2. Two `updateDoc` submissions of A's marker to `characters/c-a`, both `metadata.userId:u-b` and live UID `u-b`; two marker-bearing roster writes. Returning A has no recovered edit (`notes:""`). | Actual debounce pending. Synchronous selectors `[]/null/null` and mounted host hidden. Held beyond 2 s: zero canonical/backup cloud submissions, exactly one marker-bearing roster write, exact A scoped payload + required marker. B activates only after preservation; A returns with exact edit. |
| F2 `failed-preservation` | Marker-bearing storage writes throw; production writers return refusal. Coordinator reports `blocked:false`, activates B and has no retained candidate. Local A roster still baseline; A's edit is lost. | Coordinator reports character `stopNewWork` failure, retains A scope/generation with isolation active, B remains ineligible, private candidate contains exact marker. Healing/retry preserves it durably before B activates; returning A recovers it. |
| Required marker-only failure | Baseline has no required marker contract; B activates and loses A recovery. | Roster succeeds but required marker fails: handoff still blocks, private candidate remains. Healed retry then A return succeeds. |

Each GREEN browser scenario also rejects canonical cloud publication on A's
return, checks that the exact scoped source and deferred marker survive, then
heals the network and recovers/publishes through the production load path.
The cloud SDK simulation logs attempted writes before rejecting them; wrong-owner
attribution cannot be hidden by the injected network rejection.
This demonstrates client attribution/recovery, **not a Firestore rules bypass**.

## Changes made in this task

- `vtt-react/verification/p5-01/character-browser-harness.cjs`: portable loader
  compiles on-disk production modules unchanged, records source hashes and
  supplies only the enumerated external boundaries. Uses installed React,
  Zustand (including its actual external-store shim), production backup and
  offline services, real browser storage/Web Locks. Optional source-root export
  makes historical RED reproducible. Direct invocation serves an isolated page
  for accessibility-snapshot checks.
- `vtt-react/verification/p5-01/character-preservation-browser.cjs`: permanent
  F1/F2 and marker-only witnesses, actual pending-timer checks, synchronous
  mounted privacy, hold past debounce, attempted cloud/backup attribution log,
  one-successful-roster-save assertion, failed-preservation hold, healed retry,
  failed-cloud retention and owner recovery. Blocks non-loopback browser requests.
- `vtt-react/src/persistence/__tests__/characterHandoffPreservation.test.js`:
  verifies the actual pending callback/timer and exact retained failure candidate;
  adds two Web Locks boundary fault cases (synchronous throw and asynchronous
  rejection) through real `saveRoster`/coordination/preservation/coordinator logic.
  No persistence function being asserted is mocked by these additional cases.
- This document: frozen contract, evidence ledger and independent replay handoff.

## Retention accounting verified

`updateLore` schedules the actual debounce. Isolation synchronously captures
the working character/inventory payload and original gate owner/generation,
discards that now-redundant debounce, starts preservation and hides the public
projection. The character participant awaits `ensureCharacterHandoffPreserved`.
`saveRoster` binds context before its queued work, compares/writes under local
coordination and returns a confirmed/refused result; required marker outcome is
also inspected. Refusal prevents destructive reset/destination activation and
retains the isolated candidate for retry.

`storeCharacterOffline` calls its scoped native writer but returns no persistence
confirmation; it is supplementary and **not counted as recovery proof**. A
memory hold is also not restart-safe. Successful browser assertions require the
actual A roster bytes plus the durable required marker; return merges those
sources over the stale cloud baseline and publishes under A only. Late/completion
and exact-marker retirement behavior remain covered by the existing production
character regressions. Failure attempts/retries may make multiple local attempts;
the no-duplicate invariant refers to the successful pending-edit retirement,
not to failed retries.

## Verification commands and artifacts

From `D:/VTT/vtt-react`:

```powershell
node verification/p5-01/character-preservation-browser.cjs
```

**3/3 GREEN**, no browser runtime errors. Complete JSON evidence and source
manifest: `D:/AppData/Temp/opencode/p5-01-replay-green.log`. Portable runner and
this evidence table remain in the repository; no temporary harness is required.

Historical RED, from the repo root (use a fresh disposable export directory):

```powershell
# Verify the temporary parent first; create the export directory if absent.
Test-Path -LiteralPath "D:/AppData/Temp/opencode"
New-Item -ItemType Directory -Path "D:/AppData/Temp/opencode/p5-01-baseline-replay"
git archive --format=tar -o "D:/AppData/Temp/opencode/p5-01-baseline-replay/source.tar" ef4082801513ff82630b22bdf88a330600a5397b vtt-react/src
tar -xf "D:/AppData/Temp/opencode/p5-01-baseline-replay/source.tar" -C "D:/AppData/Temp/opencode/p5-01-baseline-replay"
node vtt-react/verification/p5-01/character-preservation-browser.cjs --source-root "D:/AppData/Temp/opencode/p5-01-baseline-replay/vtt-react/src" --expect-block
```

**Both original failures reproduced**; marker-only control also BLOCK on that
baseline. Runner exits 0 in `--expect-block` mode only when both original
scenarios BLOCK. Full JSON: `D:/AppData/Temp/opencode/p5-01-replay-red.log`.
The disposable export uses existing current dependencies; it is a historical
production-source witness, not a historical dependency/install reproduction.

Bounded affected regression selection, from `D:/VTT/vtt-react`:

```powershell
$env:CI='true'
npm test -- --watchAll=false --runInBand --silent --runTestsByPath src/persistence/__tests__/characterHandoffPreservation.test.js src/persistence/__tests__/characterProjectionIsolation.test.js src/store/__tests__/waveB_characterRosterIsolation.test.js src/services/__tests__/characterPersistence.test.js src/persistence/__tests__/waveA_handoff.test.js src/persistence/__tests__/waveB_scopedStoreStorage.test.js src/persistence/__tests__/waveB_scopedConsumer.test.js src/store/__tests__/shareableStore.test.js src/hooks/__tests__/useJournalPersistence.lifecycleFences.test.js src/hooks/__tests__/useJournalPersistence.ownerFence.test.js src/persistence/__tests__/PrivateProjectionBoundary.synchronousIsolation.test.js src/persistence/__tests__/PrivateProjectionBoundary.missedActivation.test.js src/persistence/__tests__/registry.test.js src/persistence/__tests__/waveB_b1b5Corrections.test.js src/components/windows/__tests__/MythrillWindow.privateProjection.test.jsx src/components/multiplayer/__tests__/useSocketConnection.eligibility.test.js
npx --no-install eslint --no-eslintrc --config .eslintrc.js src/persistence/__tests__/characterHandoffPreservation.test.js verification/p5-01/character-browser-harness.cjs verification/p5-01/character-preservation-browser.cjs
```

**16 suites / 99 tests passed** (31.547 s); character suite now 18 tests.
Lint: **0 errors / 0 warnings**. `git diff --check`: clean.
Initial lint included root `scripts/` and hit inherited root config resolution;
the witnesses now live in the non-ignored frontend verification directory and
the exact final command explicitly uses its existing config. Initial harness
React UMD export-path resolution was corrected before executed behavioral
replay. These setup errors are not source-regression evidence.

Additional Playwright MCP accessibility witness on the same permanent harness:
real mounted CharacterManagement exposed heading `A HERO`; after real
`updateLore` plus live A→B, the notifying turn reported pending debounce true,
live UID `u-b`, retained scope `u-a`, generation 2, selectors `[]/null/null`,
host display `none`. Accessibility snapshot during the hold was empty. Held
roster contained `A UNSENT CHARACTER snapshot`, zero canonical submissions;
release activated B, returning A restored that exact marker. Snapshot evidence
is in this session's Playwright tool output (initial page artifact
`.playwright-mcp/page-2026-10-12T10-30-41-821Z.yml`). Browser and the owned
snapshot harness process were closed. No raw production build was run because
only verification code and documentation changed.

### Current focal source manifest (raw SHA256)

All paths below are relative to `vtt-react/src`; all match the later independent
Mind index. The runner prints these on every replay.

```text
persistence/characterHandoffPreservation.js EB9950459CE0D4D7FCA27244F452CE3EB401366E444E8F09120253CE01CCB910
persistence/characterScopedStorage.js A3859AFFF98D5F7E488FF31567F39CF39C1169E4E2EAB9FF8278F31D7948B894
persistence/scopedStoreHandoffs.js D83C100987802B1AE5DB6F0124AE6964F45663C53F8D29A9E3DCA37AC1E8A2FF
store/characterHelpers.js F5A94079C1DCCE9CDBB29FAFDA9069A92DDE0B6E14088651FC8A5EE46738A845
store/characterSlices/coreSlice.js A0A8F946BE54B990A225984FA69BB14ABD88418FF85BE5F6BAA20CAC22D5518C
services/firebase/characterPersistenceService.js 0B8F93B8FD0A13444BBC3B0DAC35C2EBF9897D964150D633953AD78510A86CEE
persistence/privateStorageRegistry.js AD9E7DC85F1F40C381005FE37122FECF25FF9235E4D4FE540BA3583F66F949F6
```

## Remaining issues and independent handoff

- **Source defects:** none demonstrated in F1/F2 or affected accepted regressions.
- **Evidence:** independent Sol acceptance of this bounded replay remains the
  requested handoff. Full App/provider/router shell and live authenticated
  Firebase/Firestore rules/socket-server admission/deployment were not tested.
- **Environment:** P5-05/07/09/10/11/12/13/31/32 retain their separate gates.
  The unrelated recovered Mind checkpoint describes ongoing external-gate work;
  this task does not claim its results or alter that work.

Sol: run the current browser command, inspect each scenario's attempted write
UID/metadata, actual pending timer, synchronous selector/DOM isolation, held
roster/marker, failure result/candidate and healed A recovery. Replay the
historical export with `--expect-block` to confirm both defects are detected.
Run the bounded regression command above; pay particular attention to late
normal-save ACKs, same-UID generations, newer edits, exact marker retirement,
journal lifecycle fences, portals and mounted socket eligibility. Resolve the
later indexed independent-acceptance record against repository evidence before
changing any project-wide classification.

**Verdict: corrected, awaiting independent Sol acceptance.**
No P5 closure, P6 implementation, commit, push or deployment was performed.
