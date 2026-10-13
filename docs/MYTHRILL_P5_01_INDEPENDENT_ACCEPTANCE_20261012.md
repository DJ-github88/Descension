# Independent read-only acceptance — Mythrill P5-01

Date: 2026-10-12. Verdict: **PASS** for the bounded F1/F2 correction.

## Integrity and prior evidence

Checkout verified: D:/VTT. HEAD before/after:
`620fbc072e87f113cdcc2ea323e0c6c2b28e6d6b`.
All runtime is committed at this HEAD. The only worktree differences before and
after review are the same implementation-agent files:

- modified `vtt-react/src/persistence/__tests__/characterHandoffPreservation.test.js`
- untracked `vtt-react/verification/p5-01/character-browser-harness.cjs`
- untracked `vtt-react/verification/p5-01/character-preservation-browser.cjs`
- untracked `docs/MYTHRILL_P5_01_CHARACTER_PRESERVATION_REPLAY.md`

No repository files were changed by this acceptance. All new review artifacts
and the fresh baseline export are under D:/AppData/Temp/opencode.

Read AGENTS.md, CLAUDE.md, the full replay report/frozen contract, the harness,
the runner, and relevant runtime/save/restore/offline/backup/coordination paths.
Mind's `project-5-final-independent-source-accepted-closed-2026-10-11` claims
prior independent acceptance and has matching focal runtime hashes. Its indexed
retained `p5-sol-independent.log` covers mounted privacy/socket observations;
`p5-sol-independent-character-boundaries.results.json` records five historical
completion defects, not their final acceptance. No complete retrievable later
F1/F2 independent report was found. Memory/hashes were not used as the verdict;
the fresh executions below establish this acceptance.

## Historical source authenticity

Created a fresh isolated export at
`D:/AppData/Temp/opencode/p5-01-independent-baseline-20261012` using:

```text
git archive --format=tar -o <export>/source.tar ef4082801513ff82630b22bdf88a330600a5397b vtt-react/src
tar -xf <export>/source.tar -C <export>
git get-tar-commit-id < <export>/source.tar
git diff --no-index --quiet -- <export>/vtt-react/src D:/AppData/Temp/opencode/p5-01-baseline-replay/vtt-react/src
```

Tar commit identity: exact `ef4082801513ff82630b22bdf88a330600a5397b`.
Full exported-directory comparison exit 0: the supplied historical source is
byte-identical to the fresh export, not a patched approximation.
Dependencies are the installed current dependencies, not a historical reinstall.

## Executions and independent decisions

From D:/VTT/vtt-react:

```text
node verification/p5-01/character-preservation-browser.cjs
node verification/p5-01/character-preservation-browser.cjs --source-root D:/AppData/Temp/opencode/p5-01-baseline-replay/vtt-react/src --expect-block
node D:/AppData/Temp/opencode/p5-01-independent-specific-evidence-20261012.cjs
```

Current: 3/3 GREEN (pending-edit, failed-preservation, required-marker-only refusal).
Historical: both original failures reproduced; marker-only scenario also BLOCK.

**Important evidence qualification:** repository `--expect-block` checks only
that each original scenario has some failed assertion. A scenario exception
escapes and fails the runner, but unrelated assertion/runtime failures could
still satisfy its BLOCK labels. Exit 0 alone is not specific RED proof. The
independent supplemental script explicitly asserts the exact signatures from
fresh JSON output; both passed:

- **F1 RED:** real authored/pending marker, live B / retained A; exactly two
  canonical submissions containing that marker with `metadata.userId:u-b` and
  `liveUid:u-b`.
- **F2 RED:** actual marker-bearing roster refusal, successful B activation with
  `blocked:false`, no retained candidate, no required marker, stored A roster
  lacking the edit, and A return failing to recover it.

**F1 PASS on current runtime:** real updateLore, pending callback/timer and baseline
roster asserted; live auth changed to B while A scope/generation stayed retained;
hold is the production delay (2,000 ms) plus 150 ms. Zero canonical/backup
submissions during retirement, one successful marker-bearing roster write,
original-owner record/required marker preserved, B projection empty and A exact
marker recovered/published under A.

**F2 PASS on current runtime:** quota throws are converted by the real writer to
refused outcomes; character stopNewWork reports failure, coordinator blocked true,
retained A scope/generation with private projection hidden, exact A candidate held.
Required-marker-only refusal also blocks despite roster success. Healed retry
preserves before B activation. Supplemental gate observer reads actual A roster
and exact native marker `characterIds:["c-a"]` at B activation and confirms memory
candidate already retired only after these durable sources are established.

**Paired privacy/recovery PASS:** synchronous empty selectors and hidden mounted
CharacterManagement/PrivateProjectionBoundary; supplemental requestAnimationFrame
sampling reports zero visible A-content frames throughout retained-A pending
intervals in all three cases. Real cloud rejection on A return is observed at the
attempt boundary; exact local source and required marker survive, then healed
production load publishes/reconstructs the exact edit. Offline writes are
supplementary and never treated as confirmation. Memory-only hold is not
restart-safe storage.

## Exact affected regression run

CI=true, from D:/VTT/vtt-react:

```text
npm test -- --watchAll=false --runInBand --silent --runTestsByPath src/persistence/__tests__/characterHandoffPreservation.test.js src/persistence/__tests__/characterProjectionIsolation.test.js src/store/__tests__/waveB_characterRosterIsolation.test.js src/services/__tests__/characterPersistence.test.js src/persistence/__tests__/waveA_handoff.test.js src/persistence/__tests__/waveB_scopedStoreStorage.test.js src/persistence/__tests__/waveB_scopedConsumer.test.js src/store/__tests__/shareableStore.test.js src/hooks/__tests__/useJournalPersistence.lifecycleFences.test.js src/hooks/__tests__/useJournalPersistence.ownerFence.test.js src/persistence/__tests__/PrivateProjectionBoundary.synchronousIsolation.test.js src/persistence/__tests__/PrivateProjectionBoundary.missedActivation.test.js src/persistence/__tests__/registry.test.js src/persistence/__tests__/waveB_b1b5Corrections.test.js src/components/windows/__tests__/MythrillWindow.privateProjection.test.jsx src/components/multiplayer/__tests__/useSocketConnection.eligibility.test.js
```

**16 suites / 99 tests PASS**, 17.907 s. Source-inspected controls include
synchronous throw/async rejection at Web Locks acquisition through real roster
coordination, required-marker refusal, same-UID generations, late ACKs, newer
saved/unsaved edits versus older publication, queue revalidation, exact marker
retirement, journal lifecycle fences, private portals and mounted socket
eligibility. No new source defect reproduced. No broader audit/build was needed.

## Harness validity and limits

The browser compiles on-disk production source without body rewrites; all
initStoreRegistry participants, authStore/setUser subscription, updateLore,
actual debounce, character store, scoped writer, offline/backup service,
preservation/coordinator, and real mounted CharacterManagement/Boundary execute.
The review-only supplement exposes the existing witness in memory and adds
observers/assertions; it does not replace production save/store logic.

Firebase configuration/principal and Firestore SDK calls are external simulations;
auth principal is supplied through production authStore.setUser (not real provider
admission). Firestore logs attempted values/live UID before rejection or storage
application and does not enforce owner attribution. In-page cloud documents are a
Map; local recovery is actual Chrome localStorage under actual Web Locks. React,
Zustand and its external-store shim are installed production libraries. Routing,
CSS, UUID wrapper and unrelated heavy icon/graphics/audio/geometry packages are
simulated/inert; socket transport is unused and deliberately unavailable.
Full App shell/provider/router is not mounted. Unit tests additionally use auth
and Web Locks doubles and mock automatic backup, so backup-path evidence comes
from the browser, not those unit tests. No live Firebase/rules/transaction,
socket-server admission, deployed system or restart-safe memory-hold claim.

## Before/after SHA256 integrity

Every value below is identical before and after all acceptance executions.
Paths relative to D:/VTT:

```text
vtt-react/src/persistence/characterHandoffPreservation.js EB9950459CE0D4D7FCA27244F452CE3EB401366E444E8F09120253CE01CCB910
vtt-react/src/persistence/characterScopedStorage.js A3859AFFF98D5F7E488FF31567F39CF39C1169E4E2EAB9FF8278F31D7948B894
vtt-react/src/persistence/scopedStoreHandoffs.js D83C100987802B1AE5DB6F0124AE6964F45663C53F8D29A9E3DCA37AC1E8A2FF
vtt-react/src/store/characterHelpers.js F5A94079C1DCCE9CDBB29FAFDA9069A92DDE0B6E14088651FC8A5EE46738A845
vtt-react/src/store/characterSlices/coreSlice.js A0A8F946BE54B990A225984FA69BB14ABD88418FF85BE5F6BAA20CAC22D5518C
vtt-react/src/store/characterSlices/infoSlice.js C4BFC65988821EF481890B52A653D9D0A0ACE39001A1806FC7F4F9447AA479D9
vtt-react/src/services/firebase/characterPersistenceService.js 0B8F93B8FD0A13444BBC3B0DAC35C2EBF9897D964150D633953AD78510A86CEE
vtt-react/src/services/firebase/characterBackupService.js 42B0655481CC5B3C6C64DF28EE1B390A261C3B71F2BC5E13CC0033A01A13F512
vtt-react/src/services/offlineService.js 7E8FC79792919F10003F2EAD3A96C59C2EC4312F1CEA0509D4C1EEADABA1B8BE
vtt-react/src/persistence/privateStorageRegistry.js AD9E7DC85F1F40C381005FE37122FECF25FF9235E4D4FE540BA3583F66F949F6
vtt-react/src/persistence/handoff/accountHandoffCoordinator.js 6AA459919F33FD740AEF7AFBF9667B74F3AC4A702F9CE661DA7B0D03E025AB45
vtt-react/src/persistence/localCoordination.js BFB1491BCD7722C796B9BB28F378FF8A39AB7023C61B7C432726DEE131577C25
vtt-react/src/persistence/safeWrite.js 3A90A1280A3453703EE3857679E392780143871C375112EA56C2F51B25287A5F
vtt-react/src/persistence/PrivateProjectionBoundary.jsx B1997A6F6E758B8A16F6C9DA9BC8E0B0B8303BD218AE5322F78E6E8F65BDCBEE
vtt-react/src/persistence/__tests__/characterHandoffPreservation.test.js C805CDAEF44EA6915A8DD3CF0DC159AD1E8ED85FD1EBB67C20203F3AA213EB6F
vtt-react/verification/p5-01/character-browser-harness.cjs 85480B3F802D36C59EE3F595308AF942957795E693CBACA28AB760DBAC4FED06
vtt-react/verification/p5-01/character-preservation-browser.cjs C164BABEE8184C463391EB7E745288EE7CD3358BF8B7ECE3FFB7A5D53659F1FD
docs/MYTHRILL_P5_01_CHARACTER_PRESERVATION_REPLAY.md B09750F16C3D55B3D142ACE36A69BD08269ADD47D9B468CBDCB010D4A73A04AF
```

## Evidence artifacts

- p5-01-independent-green-20261012.log: fresh current full JSON/manifest.
- p5-01-independent-red-20261012.log: fresh genuine baseline full JSON/manifest.
- p5-01-independent-specific-evidence-20261012.cjs/.log: exact RED-signature
  assertions, stronger owner/marker/recovery checks, and supplemental activation
  and mounted-frame observations.
- Exact Jest execution/result and before/after hashes also recorded in tool output.

## Canonical classification returned to coordinator

**33 independently accepted / 0 source BLOCK / 9 environment-blocked / 0
inconclusive** (42 total). P5-01 changes from source BLOCK to PASS. Carry forward
P5-38, P5-02/03/04 journal cases, P5-19 and all other prior accepted cases.
Environment-blocked: P5-05/07/09/10/11/12/13/31/32, unchanged.
This is source acceptance, not deployment readiness or P6 authorization.
No repository edits, fixes, commits, pushes, deployment or full P5 audit occurred.
