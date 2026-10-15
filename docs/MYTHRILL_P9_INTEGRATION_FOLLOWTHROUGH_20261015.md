# P8/P9 integration follow-through — 2026-10-15

## Integration verdict

**PASS for the three bounded corrections and the identified frozen desktop frontend.**
Independent review is complete. The P8 compatibility failure is corrected; the
previously copied migration-import and HUD-layer repairs pass. Historical P7/P8/P9
source acceptance retains its original identity. **This is not whole-rolling-tree
or deployment acceptance:** a later session-management edit was not in the frozen
build. Narrow/short viewport and empty-host limitations remain documented.

**Exact next task:** reconcile the later `vtt-react/src/hooks/useSessionManagement.js`
delta with its owner, freeze the resulting integrated tree, then build and repeat
the bounded production-App smoke against that identity. After that, obtain creator
confirmation of `<attr>/K` and schedule the existing real-backend/two-device/human
gates. No P10 or narration/reaction integration is implied.

## Available handoff and custody

- Read `AGENTS.md`, `ENGINEERING_STATE.md`, the original P9 acceptance report,
  current worktree, accepted P8 snapshot and P9 manifests/sealed source.
- On entry, this report did **not** exist. Claude's original follow-through report,
  integration diff and scratch-browser artifacts were not available for inspection.
  Available integration artifacts were the nine files in
  `vtt-react/verification/p9/evidence/integration-20261015/device/`; filenames ending
  in `device.log` contain `/sessions/.../mnt/VTT` paths and are not relabelled as
  native Windows executions.
- The archived P9 independent cycle1/cycle2 packet is available and was inspected;
  its 29-file LF manifest hashes to
  `a5a75dc33f836c61023be634f92c81c0b72fec7676f54141201debb22e0a050c`.
  Three accepted source copies were checked against both that manifest and the
  sealed packet. The prior repairs were reconstructed from those bytes, not an
  invented missing Claude diff.
- Initial HEAD: `dd445bec3a295f2a1d1aad8ec0b77e1d2f5e3334`; initial inventory:
  `sol/before-identity.json`, 12,533 files. HEAD was advanced by another process to
  `f491e6943ebe5368828dc97111bd097c4bc90c94` during this task. This implementation
  session and its reviewers issued **no commit, reset, push or deployment**.
- New evidence below is relative to
  `vtt-react/verification/p9/evidence/integration-20261015/sol/`.

## Corrected defects and exact scope

| Correction | Bytes present on entry / final disposition |
|---|---|
| P8 dataset compatibility | `featherSlash.js` still required only `1.4.0` on entry. Changed only that gate to the explicit `['1.4.0', '1.5.0']` allowlist, with an identity comment and affected tests. |
| Legacy Arcanoneer cast | `ActionBar.jsx` already contained the missing `migrateBlockId` import; its legacy regression test was also present. Compared with accepted P9 source: exactly the one added import. Preserved unchanged. |
| Actual HUD integration repair | `PartyHUD.jsx` already added `actor-consequence-layer` to the existing wrapper; `SpellConsequencePanel.css` already appended its fixed right-edge/scrolling rule. These are the UI repair, not a guessed colour change. Preserved unchanged. |

Before the gate edit, the accepted P8 gzip packet was hash-verified against
`b53b919df7f944dfbe58a7ec380c46b0af99097b437ce7d21dd01a3c58e74a0c`.
Decoded **complete Branvig/`grimmstalk` creature and ability-group definitions are
identical** to current content; Feather Slash is identical. Every existing creature
and ability family is unchanged; four shopkeepers are additive.
See `raw-definition-verification.json` and independent `completion-invariants.json`.
This is exact decoded-definition equality, not a claim that the larger JSON files
have their historical whole-file hashes.

The gate retains all existing execution-shape/content checks. It does not admit
future versions or alter mechanics. `FEATHER_CAPABILITY` deliberately stays
`feather-slash:v1/abilities:1.4.0`: original plans, UUID-bearing commands, retained
drafts and receipt interpretation remain compatible across the two reviewed datasets.
No data/cache version was downgraded or shopkeeper content reverted.

### Corrected current identities (raw SHA-256)

| File, relative to `vtt-react/` | SHA-256 |
|---|---|
| `src/services/featherSlash.js` | `ad2b3134998a8585906bbb82a1ac3878dafecac92070a9ad81f659ed1812669a` |
| `src/services/__tests__/featherSlash.test.js` | `43eaf32fb3a87bf38cda145e9c7afc29bfbfda4f83f53585f376abd1acc2bcb9` |
| `src/components/ui/ActionBar.jsx` | `7a04ec3302561ae91cd495bddce4d5596235bd5b8c5916f58686b767f9000d33` |
| `src/components/ui/__tests__/ActionBarLegacyArcanoneerSpheres.test.jsx` | `98e8afbef304b1359da67d136ae2f38e43fc002846dcee247df500d5466dbb73` |
| `src/components/hud/PartyHUD.jsx` | `c5f2e9381c18fae3e68ec47f3f8bf2c02bca8e3be48ea72a8f6179e9e07db5d9` |
| `src/components/hud/SpellConsequencePanel.css` | `2f936ff2ff5bdc3f610c2c24c49015a1b935bd835a3f8f4e1dfeb2837682a68b` |

Full focal/current-vs-start identities: `final-summary.json`, `final-source.json`.
The independent final addendum lists 16 matching runtime/data/dependency identities.
Compared with the historical P9 manifest, five already-at-entry variants remain:
the import, wrapper, CSS, `SpellCastConfirmation.jsx` presentation variant and the
implementation handoff document. None was rewritten by this implementation session.

## Executed checks and production/harness distinction

| Check | Result / retained evidence |
|---|---|
| Focused source/component checks | **7 suites, 87/87 passed**, no input drift: `focused/`. Includes P8 allowlist/content/identity, P9 service/producers, legacy cast and PartyHUD. |
| Scoped lint | **0 errors, 27 incumbent warnings**, no input drift: `lint/`. |
| Independent checks | Separate 7/87 run; 28 execution mutations for each allowed version; 11 refused unreviewed values; original plan/receipt and unknown-command custody; import-removal negative reproduces the missing-name ReferenceError. `independent-review/`. |
| Isolated mounted P8 browser | **W1–W12 passed**, zero page errors, no input drift: `p8/`. Real Chrome, token/fan/controller, stores and registered Socket.IO stack; not full App. |
| Isolated same-owner rejoin | **Passed**, exact held-ACK command/roll/receipt retained, no second payment/damage: `rejoin/`. |
| Isolated mounted P9 browser | **S3/S4/S6/S7/S9 passed**, zero page errors, no input drift: `p9/`. Producer components additionally covered by focused mounts. |
| Outstanding P7 lifecycle | **Passed**, seven observations/fourteen controls, zero page errors: `lifecycle/green-1792085169132.json`. Original external source input was readable and hash-checked. No environment refusal occurred. |
| Current-checkout production builds | Initial build **exit 0 / no drift**: `build/`. Later `build-final/` and `build-current/` compile successfully but record unrelated concurrent input drift. These are not drift-free whole-tree seals. |
| Final frozen-current-source build | **Compiled successfully / exit 0 / mirrorDrift `[]`**: `build-snapshot/`. Complete current src/public/config copied to a temporary workspace; unchanged CRACO production configuration and installed dependencies. Environment files remain temporary, unarchived. |
| Final production-App replay | **Passed** against that exact optimized build: `app-replay-final/`. Actual App/router/full compiled CSS, actual token fan/adjudication, actual HUD drop/click, owner approval and normal GM pointer-click-to-receipt. |

All builds were detached with redirected output. Exact commands, timestamps,
before/after input hashes and exit records are retained. No broad P5–P9 audit or
server-suite rerun was used. Unchanged accepted server/runtime evidence remains
historical evidence, not a newly executed result.

### Final built-App observations

- **P8:** physical `[3,5] + 5 = 13`, GM final 10; source AP 1, target HP 24 and temp
  HP 0. Receipt `a1fd70a3-75c5-458c-8868-51a4f0bb1026` retains the original capability.
- **P9:** actual HUD spell routes to the owner panel; physical `6 + 4 = 10`;
  approval leaves ordinary resource pools unchanged; GM final 7 installs once.
  Source mana 9 + 0 temp, AP 2 + 0 temp, spheres `['ember']`; target HP 17.
  Receipt `279dee0e-6b81-4fb2-9e45-c1ebc098d159` is `owner-approval-gm` authorized.
- GM acceptance hit-test succeeds and ordinary Playwright `.click()` completes.
  Post-acceptance host bounds fit 1440×1000 and 1024×768; active-card acceptance was
  exercised at 1440×1000. Accessibility snapshots corroborate preparation/results.
- **Two `Failed to fetch` page errors** accompany **22 deliberate Firebase
  installation/Firestore request refusals**. This is not a zero-page-errors App run.
- Setup seeds fixture principals/actors through existing webpack exports and
  connects real browser Socket.IO to the registered test backend. Provider identity,
  canonical ownership, lease and cloud persistence are simulated boundaries. The
  synthetic external drop payload reaches the real React handlers; it is not an OS
  drag-gesture or physical-device witness. Other compiled library bodies remain real.
- Both final receipts are explicitly **live-only** (`checkpointRevision: null`).

Final source packet SHA-256:
`e9aed0321e5aa850eec06f3c1de573fe1589788c94e239e66fcbc8d11bc1cbf9`.
Final build manifest:
`29c6a64f3a9082d0b113e3f45dfb33eec51480e89087ee049ca35c2cdcc1f00c`.
Final App result:
`d56de547c06c3acc08dc67bfdcf90763a095bf7438084d71665cf8560d2389b7`.

### Failed attempts retained honestly

`app-replay/` and `app-replay-2/` through `app-replay-7/` remain evidence of witness
setup/assertion failures, not passed product checks. They include an overbroad
network fixture, wrong compiled-module lookup, synthetic `DragEvent` losing its
payload under the incumbent polyfill, a stale reference across atomic map
replacement, and whole-character equality incorrectly rejecting intended class-home
publication. The final witness compares fresh resource pools and keeps all intended
payment/class/target assertions. No production edit was made to bypass those checks.

## Independent verdict and residual limits

Completed separate reviewer execution `ses_ebf03aeadffeANFTqxK8ypUoYU` produced:

1. `independent-review/review.md` — initial **INCOMPLETE** while the App witness was pending.
2. `independent-review/final-review.md` — completed run-8 evidence closes that gap;
   three corrections **PASS within bounded desktop scope**.
3. `independent-review/snapshot-final-addendum.md` — final frozen source/build/App
   provenance independently verified; **PASS**. SHA-256
   `2830aa2c4c281ff5234cb334fad6535d086b2bdfdee8ac5063fcf89e3bc45505`.

The earlier interrupted reviewer launch is not counted as completed review.

**Unresolved source/layout limits:** narrow-width fixture frame overlap; only a
50px scrolling strip at 390px viewport height; the unconditional empty offline
wrapper retains a 22×14px presentation/pointer footprint; user-dragged frames may
occupy the right edge. These do not invalidate the bounded desktop acceptance and
are not claimed fixed. The later live `useSessionManagement.js` change is outside
the frozen identity and has not been accepted by this follow-through.

**Environment/player gates remain:** creator `<attr>/K`, human tabletop and
GM/observer/player confirmation, physical second device, live Firebase/rules/backend
lease, deployed crash/restart and deployment. P5-05/07/09/10/11/12/13/31/32 remain open.

## Historical preservation and concurrent work

The historical P7/P8/P9 acceptance reports retain their recorded hashes, including
P9 `d379b925bb4dcb811b103d6879df10e1be5ea0188dec9b4aa66c80207cb777a5`.
The final seal checks 476 initial historical/witness paths: **474 unchanged**.
Two generated P7 JSON paths were replaced during concurrent work and now match the
externally advanced HEAD: `p7/evidence/server-results.json` and
`p7/evidence/corrections-20261013/server-green.json`.
Their exact original bytes were recovered read-only from the starting Git object,
matched to the initial raw hashes, and saved as `p7-*-original.json` beside separate
`p7-*-concurrent.json` copies. Current external bytes were not overwritten.
`final-summary.json.preservedHistorical` records both identities and locations.
No blanket claim that every historical pathname stayed unchanged is made.

All focal correction bytes match the frozen build and current source. During its
build only the live `useSessionManagement.js` changed; the mirror stayed immutable.
Earlier unrelated content/style changes and the external HEAD advance are retained,
not attributed to this correction or silently reverted. No narration/reactions or
new game mechanics were integrated by this task.
