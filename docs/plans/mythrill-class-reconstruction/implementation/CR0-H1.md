# CR0-H1 — five human heritages, source/consumer evidence only

**COMPLETED by the planning agent in the HeadQ R1 milestone.** Results: [human report](../heritage/CR0-H1-humans.md), [exact reviewed JSON](../evidence/heritage-human-audit.json), [all25 conclusions](../28_HERITAGE_REVIEW_AND_PRIORITY_ORIGINS.md). Original bounded contract is retained below as historical scope/evidence; do not rerun or hand off as unfinished. No application implementation.

## Goal and bounded records

Manually audit exactly these five current heritage IDs: `thalren_human` (Tallyn), `skald_human` (Skald), `tessen_human` (Tessic), `merryn_human` (Merryn), `ordan_human` (Ordu). Establish their actual current cultural/body/acquisition/edge/variant facts and source conflicts. Do not assign restored natives until the complete25-heritage review is available.

## Source evidence to read

1. Root AGENTS/CLAUDE, current ENGINEERING_STATE and creator decisions in this package.
2. `vtt-react/src/data/races/human.js` in full.
3. `vtt-react/src/data/classHeritageRegistry.js` in full, especially all five rows, relevant provenance and access resolver.
4. All relevant human pairings in `heritageEdgeContract.js`, `heritageEdgeAdapter.js`, `heritageCapabilityConsumers.js` and their actual non-test consumers.
5. Raw class variants, livingOrder, worldFriction and origin for the union of these native classes: Inquisitor, Toxicologist, Warden, Spellguard, Augur, Berserker, Harbinger, Martyr, Apex, Revenant, Chronarch, Gambit, Minstrel, Animist, False Prophet.
6. Current lore blueprint/framework, relevant human institutions/NPCs/locations/backgrounds. Trace LoreLink IDs to actual records; do not equate a string mention with a validated location.
7. Current creation/access consumers in characterClassAccess, pointBuySystem, Step1/Step9 and CharacterWizardContext for these pairings.

Use current-census JSON to locate fields, but read the source before confirming them. Record hashes and exact line/function locations. Core framework's era-relative chronology wins over old fixed-year detail for new prose; report unresolved naming contradictions without rewriting canon.

## Exact writable targets

- New `docs/plans/mythrill-class-reconstruction/heritage/CR0-H1-humans.md`.
- New `docs/plans/mythrill-class-reconstruction/evidence/heritage-human-audit.json`.
- The master index's completion ledger, limited to CR0-H1 status/link.

All other files read-only. Preserve existing implementation/art/tests/saves and other planning work. No Git reset/stash/clean/commit/push or source/canon edits.

## Output JSON schema

```text
{
  version: 1,
  capturedAt: ISO timestamp,
  branch: string,
  head: full Git SHA,
  sourceHashes: {relativePath: sha256},
  heritages: [exactly the five records below]
}

heritage record = {
  heritageId: one of the five IDs,
  displayName: exact current registry name,
  raceId: "human",
  nativeClasses: exact registry list,
  retiringNativeClasses: subset in ["Gambit","Revenant","Shaper"],
  culture: {evidenceLabel, summary, sources[]},
  bodyInterfaces: [{stateOrProperty, evidenceLabel, sources[]}],
  pairings: [{className, acquisitionRequirements[], methodOrNull,
    rawVariantPresent, wrappedAccessResult, edgeIdOrNull,
    advantage, pairedCost, condition, implementedConsumerOrNull,
    executionLevel, evidenceLabel, sources[]}],
  rareRoutes: [{className, requirementIds[], sourceRequired,
    bodyIncompatibilities[], edgeAuthored, sources[]}],
  institutions: [{name, role, founderState, currentLeaderOrNull,
    locationRefs[], validatedLocationRefs[], sources[]}],
  conflicts: [{topic, conflictingClaims[], authorityEvidence,
    status:"UNRESOLVED"|"CONFIRMED", recommendedNextAction}],
  restorationLeads: [{candidate, rationale, sourceEvidence[],
    missingEvidence[], nativeAssignment:"UNRESOLVED"}]
}
source = {path, hash, lineOrFunction, evidenceLabel, claim}
executionLevel = "data-only" | "advisory" | "local-bookkeeping" |
  "bounded-authoritative" | "unresolved"
evidenceLabel = one of the six master evidence labels
```

No empty strings as unknown facts: use null and explain the gap. A capability route without an executor is AUTHORED or advisory, not authoritative. Native training is not a free class power. Incompatible body states override qualification. Existing unknown-field preservation and legacy-calling warnings remain intact.

## Mechanics/UI requirements

No mechanics changed. Verify owner-visible access, qualification reason, native variant title/reframe/signature/crisis/quote and actual bounded edge/cost. If checking browser, use read-only Codex/isolated creation fixtures and save no personal character. Calm TTRPG screenshots/snapshots are evidence only, not redesign work.

## Verification

From repo root: `git status --short`, `git branch --show-current`, `git rev-parse HEAD`; compare against evidence before and after. Read source with dedicated tools. Use planning validator after adding the new links:

```powershell
node docs/plans/mythrill-class-reconstruction/evidence/validate-package.cjs
```

If actual access/helper behavior is uncertain, run only relevant existing tests from vtt-react:

```powershell
$env:CI='true'; npm test -- --watchAll=false --runInBand --no-cache --runTestsByPath src/data/__tests__/classHeritageRegistry.test.js src/utils/__tests__/characterClassAccess.test.js
```

No build needed. Do not relabel the earlier59-test run as fresh source evidence.

## Acceptance

Exactly five complete reviewed records; native lists agree with current registry; all human-native class variants and edges examined; actual consumers distinguished from data; missing LoreLink targets/conflicts enumerated; source hashes and line locations present; restored native assignments remain unresolved pending full25 review. Markdown explains culture/body/institution and every advantage/cost coherently, not only a compatibility table. Only the three allowed planning targets changed intentionally.

## Dependencies, migration, rollback, decisions

No creative approval required to inspect source. Missing external records are evidence gaps, not permission to invent. No save/schema migration. Rollback only this task's planning edits, retaining useful evidence; no accepted combat consequence or user work touched. Creator decisions are asked only after source conflicts cannot be resolved by further investigation.

## Expected output

Human-heritage audit JSON + readable evidence report + indexed completion line. Then stop and hand off the next bounded heritage cohort (not application changes).
