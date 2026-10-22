# RI-2 Phase 2B Fate Weaver third correction report

**Disposition: the three independent-review blockers have focused corrections and fresh verification. Independent re-review is required. This is not an acceptance claim.**

Re-review basis: `ri2-phase2b-correction2-independent-block-20261022`. Reviewed baseline: `652aad2b12eaa130be12a2d2d56abaafac8d7d57`. Evidence from `phase-2b/`, `phase-2b-correction/`, and `phase-2b-correction-2/` is retained unchanged. This report and its evidence live only in `phase-2b-correction-3/`.

## Repository context

- During this pass, concurrent commits advanced HEAD from `652aad2b` to `5594c33b` and then `485c0bba`. Those commits were not created by this pass.
- The B1 source edits are now committed in `5594c33b` (`progressionSlice.js`, `infoSlice.js`, `TalentTreeContent.jsx`). The B2 consent edit is now committed in `485c0bba` (`fateWeaverData.js`). The remaining B3 source and all correction-3 test changes are in the worktree.
- No commit, push, deploy, admission, class-cohort expansion, combat-authority/A1b work, browser acceptance, or playtest acceptance was performed.
- Unrelated P14 changes that appeared concurrently were preserved. They are not included in `correction.diff` and are not claimed by this correction.

## Findings and corrections

| Review blocker | Correction | Primary paths |
|---|---|---|
| B1: `removeTalentGrantSpells` treated another roster character's ownership as if the active character were still eligible. Mounted Reset All left the active character's known Covenant grants and deleted shared copies still needed by another character. | The active character's stored `known_spells` now always lose removed grants, even when another roster character uses the same ID. Shared spellbook/library copies are pruned only when no other roster character still derives or explicitly knows the grant. Reset All now delegates through `setTalents(..., { grantIds })` and performs one talents/known update. | `progressionSlice.js`, `infoSlice.js`, `TalentTreeContent.jsx`, `fateWeaverCorrections.test.js`, `TalentTreeContent.test.jsx` |
| B2: nested consent was checked, but contradictory supported top-level `sourceConsent`/`targetConsent` aliases were ignored. A canonical nested `source:true,target:true` plus top-level `sourceConsent:true,targetConsent:false` validated and rendered a free HUD state. | Consent aliases are merged and conflict-checked. Both/mutual forms, nested source/target, and legacy top-level aliases must agree. Missing endpoints, contradictory aliases, conflicting `both` flags, and invalid strings reject atomically without repairing state. | `fateWeaverData.js`, `fateWeaverIntegration.test.js`, `FateWeaverResourceDisplay.test.jsx` |
| B3: common recovery said reserved tokens recover next own turn without requiring closure, the Codex popup displayed that stale rule beside the R1 payload, and `resourceRules` still encoded `formationRangeFeet: 60` instead of R1's 30 ft formation each / 60 ft maintenance separation. | Common tokens/recovery, resource-system generation notes, guide vitals/loop/example/quick start/ledger/materials, HUD copy, and the mounted Codex popup now state closure plus use exhaustion before recovery at the owning caster's next own turn. `formationRangeFeet` was replaced by `formationRangeEachFeet: 30` and `maintenanceSeparationFeet: 60`; the recovery enum is `next-caster-own-turn-after-closure-and-uses-exhausted`. | `fateWeaverData.js`, `fateWeaverResourceGuide.js`, `FateWeaverResourceDisplay.jsx`, `ClassDetailDisplaySpells.test.jsx`, `fateWeaverIntegration.test.js` |

## B1 ownership behavior

- `removeTalentGrantSpells(grantIds, options = {})` separates `removableKnown` from ownership-aware `removableShared`.
- Other roster characters' derived grants and known spells feed `stillNeeded`; the active character is excluded from that set.
- Active stored known spells lose every removed grant. Shared derived copies survive if another character still derives or explicitly knows the grant.
- When `options.talents` is supplied, talents and the pruned known list are written in one store patch before shared copies settle.
- `setTalents(newTalents, options)` merges explicit `grantIds` with Fate Weaver removed grants and delegates to `removeTalentGrantSpells`.
- Mounted Reset All collects all tree grant IDs, current book/library `talent-spell-*` IDs, then delegates. It no longer deletes shared copies directly.

The regression test seeds the full Covenant `Witnessed Covenant`/`Threefold Compact` grants on both the active and another roster character. Reset clears the active character's known grants, leaves the other character unchanged, and preserves shared spellbook/library copies. The production `useClassSpellLibrary` probe runs at `level: 1` so starter-spell top-up cannot mask the deletion assertion.

## B2 consent behavior

The required invalid case remains rejected:

```text
consent: { source: true, target: true }
sourceConsent: true
targetConsent: false
```

Valid nested/legacy forms, named `both`/`mutual`, and missing/conflicting endpoint cases are covered. The integrated HUD test confirms the contradiction produces the review state, no fabricated `Free` count, and no link terms.

## B3 preserved R1 values

- `releaseOnlyWhenUsesZero: true`
- `threadRecovery: "next-caster-own-turn-after-closure"`
- `formationRangeEachFeet: 30`
- `maintenanceSeparationFeet: 60`
- `refreshOnLongRest`, `refreshOnReconnect`, and `refreshOnInitiative`: `false`

All six R1 `classResourceProgram` payloads, targeting configs, and duration configs remain exactly equal as JSON values to `classes/manifests/fate-weaver-review-r1.json`.

## Verification

- Jest correction batch: **14/14 suites, 150/150 tests passed**, exit 0 (`jest-correction3.log`, `jest-correction3.exit`). Includes Fate integration/corrections/HUD, mounted Codex popup, mounted Talent Tree Reset All, Gambler integration/HUD, Augur dispositions/resource contract/resource bar, class resource contracts, spell-cast resource contracts, level-up modal, and Chaos Weaver progression.
- Manifest audit: **pass** (`manifest-audit.json`). 96 authored, 96 projected, 96 manifest records, 96 unique, 48 active, 48 passive, 40 optional, 2 core, 6 talent actives, 3 trees, 54 nodes, 382 Augur rows, all six R1 programs/targeting/durations exact, all records manual and non-executing, closure/range copy present, legacy `formationRangeFeet` absent.
- ESLint on the 10 correction paths: **0 errors, 6 warnings**, exit 0 (`eslint-correction.json`). Five warnings are unused vars in `TalentTreeContent.jsx`; one is the pre-existing UTF-8 BOM in `fateWeaverData.js`.
- Scoped `git diff --check`: **clean**, exit 0.
- Detached production build: **Compiled successfully**, exit 0 (`build-correction-3.log`, `build-correction-3.exit`). Compilation only; no runtime or browser acceptance is claimed.
- Source diff against `652aad2b`, restricted to the 10 correction paths: **219 insertions / 60 deletions** (`correction.diff`). This includes B1/B2 now committed in HEAD and B3/tests in the worktree. Plain `git diff HEAD` is not the correction diff because it omits committed B1/B2.

## Evidence inventory

- `complete-manifest.json` - generated by the integration suite with `RI2_EVIDENCE_EXPORT=1` and `RI2_EVIDENCE_DIR` set to this directory.
- `jest-correction3.log`, `jest-correction3.exit` - 14-suite batch and exit code.
- `manifest-audit.json` - independent counts, R1 preservation, copy, range, recovery, and manual-boundary audit.
- `eslint-correction.json` - scoped lint report.
- `build-correction-3.log`, `build-correction-3.exit` - detached build and exit code.
- `correction.diff` - diff from `652aad2b` restricted to the 10 correction paths.
- `current-hashes.json` - source, evidence, immutable Phase 2B, and prior correction-2 hashes.
- `REPORT.md` - this report.

## Limitations

- No independent re-review has been performed. This report does not accept the class.
- The retained external Sol harness was not rerun for this correction. Its prior `16/17` result was against the old artifact; the sole failure is the intentional comparison with immutable `phase-2b/complete-manifest.json`, and its short-circuited lines were not executed. No skipped assertion is counted as a pass.
- No browser route, persistence, migration, combat automation, or playtest acceptance is claimed.
- Concurrent P14 work and concurrent commits are outside this correction's scope. Their presence does not imply review or acceptance here.
- Jest logs contain expected `initializeCharacter`/`getEncumbranceState` console warnings. They are not test failures.
