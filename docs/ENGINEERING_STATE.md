# Mythrill / Prism — engineering state

Updated: 2026-10-15. Checkout: `D:/VTT` (the old `D:/Mythrill/Descension`
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
