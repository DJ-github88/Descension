# Retained 32-probe diff vs `correction/probe-summary.json`

Command (from repo root): `node docs/plans/mythrill-class-reconstruction/implementation/evidence/CLASS-C1-chaos-weaver/independent-review/independent-probes.cjs --summary`
Result after B1–B5 domain repairs: exit 0; 32 checks; 30 payload-identical to the corrected baseline; 2 changed entries below.

## Changed entries

| Check | Baseline (correction) | After domain repairs | Disposition |
|---|---|---|---|
| `round trips all worksheet phases` | `{exact:true}` | `{threw:"resolveContinuation: confirm the retained authored result first: missing damage, movement before declining"}` | **Justified B5b sequencing** — the probe's declination path predates the mandated primary-confirmation requirement on decline (review B5). The probe is retained unchanged; its exact round-trip phases are re-proven by the Jest controls and `supplement-run-after.json` (`recoveredRoundTrip`/`restedRoundTrip` ok, byte-exact). |
| `Cascade numerical witness` | full final payload (`ap:0`, `phase:"continuation-pending"`, tiles/penalties) | same `threw` message | **Justified B5b sequencing** — identical cause: the witness declines without confirmations. |

## Identical entries (30/32)

Notably: `build validation and primary order` remains at its corrected baseline (`corePickAccepted:false`, `unpaidSignatureAccepted:false`, `firstInvestedCascadeButSummary:"cascade-weaver"`) after the B1 rework — the completed-build fix does not reopen the unpaid-signature acceptance defect.
Witnesses (`probabilityFirstSelection:"S2"`), `preservation`, `applicationHashes`, and `counts` (`{optional:40,core:3,talentActives:6,passives:48,total:97,nodes:54,trees:3}`) are all byte-identical to the corrected baseline.

Artifacts: `probe-summary-after.json`; comparison tool `diff-tools-probes.cjs` (run from repo root with the baseline path from the correction evidence).
