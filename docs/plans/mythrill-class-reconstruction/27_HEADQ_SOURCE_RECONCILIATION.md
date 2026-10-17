# HeadQ review — live source reconciliation

**CONFIRMED source capture:** `master`, HEAD `8ea1abff1d8c1f959b2d4a10e6b7ca73879c2ff2`. New evidence: [headq-source-baseline.json](evidence/headq-source-baseline.json). The first checkpoint's inventories and acceptance artifacts are preserved.

## What changed, and what did not

The checkout still contains extensive user-owned uncommitted work: 360 tracked changed files in the entry diff, including class records, art, rules/lore, character creation, HUD, persistence and combat. Untracked P12A/P12B services/tests and development contracts are part of the current implementation, not absent merely because HEAD does not contain them. The full status is captured in the new baseline. No reset/stash/clean or application writes were performed for this review.

All **136 source inputs of the previous class census match their recorded hashes**. A fresh evaluation of every current authored original class spell through the current production `supportSpell` still admits four: `arc_spark_bolt`, `martyr_restorative_prayer`, `minstrel_opening_chord`, `minstrel_harmonic_strike`. The Arcanoneer fixture cannot afford its recipe; support and affordability remain separate. This is a fresh source/planner result, not copied historical acceptance and not a server submission test.

## Current capability boundary

| Capability | Current source evidence | Consequence for the review |
|---|---|---|
| P9 original class spells | `services/spellConsequence.js:16,69–73,130–181,265–279`; server `spellPayments.js:12,22–49` | Four originals/three class homes; custom/library/talent definitions are not newly admitted by editing controls |
| P12A weapon strikes | `services/weaponStrike*.js`, server `strikeApprovals.js`, registrations in actor handlers | Newer local PC→creature AP/HP workflow exists separately from P9; preserve it |
| P12B blocking/wear | server `actorConsequences.js:125,153–160`, `blockApprovals.js`; client blocking services/custody | Equipment wear and owner declaration are implemented named extensions. Previous generic statements that P7 has no equipment support are now explicitly scoped/superseded |
| Bounded actor commands | server `actorConsequences.js:118–178` | At most two actors, ≤32 condition operations. No generic class-domain program, arbitrary N-actor atomic batch or entity creation operation |
| Conditions | server `actorConsequences.js:88–115` | Records require `sharedTiming:'manual'`; storing a duration does not run delayed damage/expiry automatically |
| Class state | resource contracts/store and three P9 payment homes | Local per-class tracking exists; not all resources have admitted authoritative homes |
| Persistence | private custody families/character snapshot/cloud shape codec and room checkpoint | Reuse personal-vs-room separation. P12B equipment custody travels with the character; new hands/links/actors must not bypass its ownership/recovery model |
| Heritage | actual sheet hook at `SpellActionBar.jsx:1296–1315` | Advisory notices only for these named edge routes; no paired-cost executor is established |

The ledger reports P10, P11, P12A and P12B-thin accepted within their recorded source scopes. Those prior test/build reports are **AUTHORED evidence** here, not newly rerun full acceptance.

## P10–P14 recommendations reconciled

- P10's Laws and first-table baseline remain authoritative for terminology and 4 base AP. Per-heritage AP claims are not silently added back by this design.
- P11 per-weapon skill storage/budget is current. These seven drafts do not invent proficiency arithmetic, AC or another attack roll system.
- P12A/B owner approval, exact actor identity, temp-first payment, accepted receipt and private intent custody remain the integration foundation.
- P12B-r1 is **still proposed**: source `blockApprovals.js:305` retains `stale_attack`, and handler `UNCONSUMABLE` still closes it. Do not pretend the recorded-roll repair has landed.
- P13A narration, P12C map selection/area preview, P13B reaction windows and P14 expanded consequences are **proposed/deferred**, as the current roadmap §11 states. No corresponding general event/area/lifecycle engine was found in the inspected production seams.
- A class-specific linked transfer, summoned command or transformation is not made authoritative by generic token controls or a manual GM consequence. Its missing named capability remains explicit.

## Implications for the seven proposals

Use the existing authority/checkpoint architecture with individually reviewed extensions. Keep the current P9 guard intact. First define a reviewed immutable spell admission path, strict class programs, revisioned domain state and exact event lifecycle; then add one demonstrated domain at a time. The proposal is not permission to widen P7 under an unrelated class/content task.

The two reported Wizard defects were reproduced on an isolated real-React page using unmodified production Step5/serializer bodies; see [bounded correction contracts](implementation/CR-W1-WIZARD-CORRECTIONS.md). No personal account/library or shared room was used.

## Concurrent drift observed at final status comparison

Additional book/editor/store, CameraCompass and 2D/3D wall/geometry files appeared modified during this review, plus untracked BookCampaignImporterModal/BookSpellPickerModal. They are treated as concurrent user work and preserved; the final review report records23 added status entries and no removed entries outside planning. This does not mean this planning agent edited them.

Relevant narrow follow-up: `BookSpellPickerModal:83–139` enumerates a book projection using `ap`/`manaCost`/plural `resourceCosts`; it does not carry a canonical singular resourceCost or classResourceProgram. `:210–233` can forge/live-merge/save library records; BookDocumentEditor imports/mounts it. No authoritative actor-consequence/routeSpell entry was found in these inspected book modules. Do not mistake that extra authoring/display consumer for new validated execution, or assume it will preserve the proposed namespace without an explicit adapter.

WallGeometry's current exports concern endpoints/heights/footprints/projection/rendering; camera/wall source changes are not proof of new server range/LoE/zone validation. [Follow-up hashes and limits](evidence/headq-concurrent-followup.json) identify the inspected bytes. No full book/wall/UI test or frozen whole-App acceptance is claimed. The earlier136 and new scoped authority inputs remain stable; next implementation contract freeze must recheck these simultaneous consumers with their owner.
