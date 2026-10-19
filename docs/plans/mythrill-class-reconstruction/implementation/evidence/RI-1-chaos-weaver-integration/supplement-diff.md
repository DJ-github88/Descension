# Supplementary harness diff vs `independent-rereview/supplement-results.json`

Command (from repo root): `node docs/plans/mythrill-class-reconstruction/implementation/evidence/CLASS-C1-chaos-weaver/independent-rereview/supplement.cjs`
Result after B1–B5 domain repairs: exit 0. Full JSON: `supplement-run-after.json`; deep comparison tool: `diff-tools-supplement.cjs` / `diff-tools-supplement-deep.cjs`.

## Observation-by-observation

| Observation | Baseline | After repairs | Disposition |
|---|---|---|---|
| `legalPick` | `ok:false` ("cw1_01: already chosen" / "no pool pick remains") | `ok:true`, errors `[]`; pick record now carries the authored `outcome` object | **B1 fixed**; record-profile addition expected. |
| `recoveredRoundTrip` | `ok:false` ("selected ID must be spent after settlement") | `ok:true`, draft retained | **B2 fixed.** |
| `restedRoundTrip` | `ok:false` (same) | `ok:true`, draft retained | **B2 fixed.** |
| `anomalyCompleteWitness.roundTrip` | `false` | `true` | **B2/B4 fixed** (closed-anomaly witness imports). |
| `forgedPendingPrice` | `ok:true` (defect: forged price imported) | `ok:false`, "pending primary IDs do not satisfy the authored symbol requirement", draft retained | **B3 fixed.** |
| `malformedPendingMapping` | 2 errors | 4 errors (adds authored-symbol + sampled-mapping checks) | B3 strengthened; still rejected as draft. |
| `anomalyVoidRedraw.afterVoid` | void left `bound:["M1","F1"]`, `anomaly` non-null | after void: `spent:["M1","F1"]`, `anomaly:null`, pending null, void settlement retains the recorded face | **B4 fixed.** |
| `deterministicFracture` | payload showed instant spend, no penalties/settlements (the defect) | `threw` at its generic `recordFace` step: "this deterministic result has no physical face; settle it with its authored confirmations" | **Justified B5a sequencing** — the generic harness assumed a physical face; the corrected flow (commit → confirm labels → settle with recorded outcome/penalty) is proven by the new Jest control and byte-exact packet round-trips. |
| `paidCounterseal` | unchanged | identical | Preserved. |
| `closureRejections` | unchanged | identical | Preserved. |
| `preservation` | unchanged | identical | Preserved. |
| `retainedProbeChecks[28]` / `[31]` | full payloads | `threw` on decline-without-confirmations | Same justified B5b sequencing as `probe-diff.md`. |
| `correctionComparison[28]` / `[31]` | `exactCorrectionPayload:true` | `false` | Same two justified exceptions; all other 30 entries exact. |
| `identities` | all match | drift exactly on `chaosWeaverData.js`, `chaosWeaverRules.js`, `talentTrees/chaosWeaver.js`, `chaosWeaverRules.test.js` | Expected: the four writable repair targets. All other identities (HUD display, workshop, package test, etc.) still match. |
| `witnesses` | `{probabilityFirstSelection:"S2"}` | identical | Preserved. |

## Net

Every defect observation in the review's B1–B5 block flips to corrected behavior; the only new non-matching payloads are (a) the mandated confirmation sequencing on the pre-fix decline path (probes #28/#31, `deterministicFracture`) and (b) the dossier/identity drift on the four intentionally edited files.
