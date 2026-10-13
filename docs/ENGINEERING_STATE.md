# Mythrill / Prism — engineering state

Updated: 2026-10-13. Checkout: `D:/VTT` (the old `D:/Mythrill/Descension`
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
