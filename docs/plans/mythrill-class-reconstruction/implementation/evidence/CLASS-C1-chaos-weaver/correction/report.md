# CLASS-C1 Chaos Weaver — Correction Pass Report

**Entry verdict:** `independent-review/review.md` — BLOCK (findings R1–R6).
**Scope:** the original 12 authorized paths only (10 new + 2 modified). No new paths added.
**Policy:** no commits, amendments, pushes or deploys were made. Probes and prior evidence were never edited; all re-runs append to this `correction/` directory.

## Verification summary

| Check | Result | Artifact |
| --- | --- | --- |
| Focused test suites (5) | **50 passed, 50 total** (was 45; +5 independent regression tests) | `test-run.log` |
| ESLint (11 JS/JSX paths) | 0 errors, 1 pre-existing warning (`chaosWeaverRules.js` `no-loop-func` in `pruneRanks`, present before this pass) | `test-run.log` |
| `git diff --check` | Clean (only LF/CRLF informational warnings, repo-wide) | `test-run.log` |
| Independent probes | exit code 0; 32 checks; 6 SAME / 26 DIFF, every DIFF is a reviewed correction below | `probe-summary.json`, `probe-diff.json` |
| Browser checks (existing dev server, real route `/codex/character-creation/classes`) | Desktop 1280×900 and 360×800; focus handoff both ways; wrapped tabs; 44px targets; readable HUD text | four PNGs in this directory |

## Finding-by-finding disposition

### R1 — Import/worksheet validation accepted contradictory or orphaned states
- `validateRehearsalState` now rejects committed tiles with no live action owner and bound tiles with no visible anomaly owner (zone-ownership closure).
- Import validation tightened: missing turn object, unknown worksheet fields, wrong fixed mapping, orphan committed tiles — all rejected with explicit errors.
- **Probe:** `import orphanCommitted` now `accepted:false` — `rehearsal: committed tile S1 has no unresolved action owner` (was `accepted:true`). Same for `import missingTurn`, `import unknownWorksheet`, `import wrongMapping`, `import missingContent`, `import unknownCost`, `import changedBranch`. `null pending import robustness` no longer throws and returns a structured rejection.
- **Test:** new `committed and bound tiles must have a live owner in the worksheet` (legal pending still validates clean).

### R2 — Legal tile prices were rejected ("chosen tiles do not satisfy the authored symbol requirement")
- `comboForTileIds` now compares combo token **totals** (an `anyTiles` descriptor covers N tiles) against the chosen tile count via `comboTileTotal`, instead of comparing descriptor-list length.
- **Probe:** `legal price cw1_37` → committed S1 S2 M1 F1, ap 16; `legal price cw1_38` → spent S1 M1 F1, ap 17; `legal price cw1_last_boundary` → bound M1 M2 F1, ap 17. All three now `ok:true` (were `ok:false`).
- **Probe:** `duplicate Fold invalid atomicity` now `ok:false` (`duplicate tile IDs in the commitment`) with `inputUnchanged:true` (was `ok:true`).

### R3 — Talent gates, respec and build validation accepted illegal builds
- **Probe:** `hybrid gate` `gate5Allowed:true → false`; `respec gate recheck` `gate5NodeRetained:true → false`; `build validation and primary order` `corePickAccepted:true → false`, `unpaidSignatureAccepted:true → false`, first-invested Cascade now resolves to `cascade-weaver`; `continuation invalid symbols` both `allowed:true → false`; `Safe Rehearsal once/rest` now records `oncePerRest:["cw1_20"]` and `secondAllowed:false`; `once/rest void cannot refund use` now preserves the spent use (`usageAfterPaidVoid:["cw1_closed_distribution"]`).

### R4 — Anomaly lifecycle allowed free/early closures and never locked the trigger
- Trigger now locks an `anomaly-trigger` pending (mapping retained) until the physical face is recorded and the action settles.
- **Probe:** `anomaly trigger` — mapping present, `pending.kind:"anomaly-trigger"`, phase `committed` (was `mapping:null, pending:null`).
- **Probe:** `manual anomaly closure bypass` now **throws inside the probe** (`Cannot read properties of undefined (reading 'turn')`) — the free/early closure path returns a structured rejection with no `session`, so the probe's unchecked dereference fails. Closed bypass, documented, not a regression.
- **Probe:** `Counterseal and Unbind preconditions` all `true → false`; `invalid counters` `negative:true → false`.
- **Probe:** `Anomaly numerical witness` now throws `commitSpell: one unresolved action already exists, tile M1 is not spent, tile F1 is not spent` — the witness sequence predates the lock-and-face contract; the corrected flow (trigger → face → confirmations → settle) is exercised by the new workshop test and the browser run. Re-expression recorded here.
- **Probe:** `Fracture settlement worksheet` now populates `penalties:[{sourceActionId:"action-1",feet:5,expiresBoundary:"next-own-turn-start",expiresOwnTurn:2}]` (was `[]`).

### R5 — Data typing defects
- **Probe:** `structured branch/prose consistency` — `skewedGuardWardTarget` `"self" → "self-or-ally"`; lateral/final passage Fracture now carry the typed `penalty` (10 ft) alongside displacement.
- **Probe:** `capstone extension and nonnumeric preview` — `unlearnedCapstoneValue` now omitted; `writtenBoundaryOmitted` exposes the non-numeric `unsteady-ground.triggerOptions` descriptor.

### R6 — Interaction, focus, sizing and CSS legibility
- Workshop root takes focus on open; closing returns focus to the opener (`ClassesDisplay` stores and refocuses the entry button).
- Tabs: `flex: 0 0 auto; white-space: nowrap` — at 360px they wrap to 3 rows, no clipping, no horizontal overflow (measured per-tab).
- Small controls ≥44px: rank buttons 58×44 desktop, 114×44 at 360px (were 36px high).
- HUD: `viewBox 240×52` with enlarged SVG text (lane 7→8, count 8→9, tile label 7→8 units; ≈12–13.5px on-screen desktop). Pending/anomaly/zone lines are readable HTML at 0.85rem (13.6px) below the SVG, `aria-hidden` with the full sentence preserved in the SVG `<title>` and the group `aria-label`.
- Root pane gets a parchment background; `h2/h3/h4` inside the workshop use ink instead of the global gold; all workshop rules are scoped under `.chaos-weaver-workshop` so shared creature/dice-wizard `.cw-*` styles are untouched. A `prefers-reduced-motion` guard disables transitions/animations inside the workshop.

## Corrections beyond the six findings

- `pendingSettlementPreview` returns the preview for phase `continuation-pending` as well as `face-recorded` (drives the mandatory confirmation checklist for continuation accept).
- Workshop: manual confirmation checkboxes (damage/ward/movement/penalty labels, plus `continuation` for accept) are required before settle/accept; all action handlers reset the checklist; the anomaly panel offers trigger (locked when a draw is pending), mapping, branches and the paid dismissal.
- New tests: anomaly trigger end-to-end (bind → face → confirm → settle), continuation accept gated on confirmation, focus handoff both ways.

## Probe diff (32 checks, name-paired)

6 SAME: `all 54 node gates…`, `all optional prices…`, `reported fixes`, `round trips all worksheet phases` (`exact:true`), `Probability numerical witness`, `Cascade numerical witness`. All 26 DIFFs and their before/after payloads are in `probe-diff.json`; every one maps to a finding above, a closed bypass, or the witness re-expression. No DIFF is unexplained.

Witness erratum (kept from review): Probability rehearsal uses S1/S2/F1 — a d6 result of 3 selects S2; use 5 or 6 to force F1.

## Preservation

`preservation-check.json`: 21/25 protected entries MATCH. CHANGED:

- `server/services/blockApprovals.js` — concurrent work outside this scope; unchanged since the original implementation capture (still divergent from entry baseline).
- `server/handlers/actorConsequenceHandlers.js` — same classification.
- `server/tests/p12bBlockWear.production.test.js` — concurrent work outside this scope; changed again during the correction window (not touched by this pass).
- `vtt-react/src/components/rules/ClassesDisplay.jsx` — by design (authorized path #11; further modified this pass for the R6 focus handoff).

## Hashes

See `new-source-hashes.json` (all 12 paths, post-correction SHA-256 + line counts + entry-baseline hashes). 10 new files + 2 modified files as originally authorized.

## Browser evidence and limitations

Screenshots: `playwright-desktop-workshop-top.png`, `playwright-desktop-hud-readability.png`, `playwright-360-workshop-tabs.png`, `playwright-360-hud-readable.png`. Same methodology as the review (existing dev server, real route, no component mocks). Limitations inherited from the review apply: no physical devices and no non-Chromium engines were tested; 360px interaction was verified by target sizing and real clicks, not synthesized multi-touch.
