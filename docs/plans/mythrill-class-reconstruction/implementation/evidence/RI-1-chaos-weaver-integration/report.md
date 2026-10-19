# RI-1 Chaos Weaver integration — report (in progress)

Started 2026-10-18. Scope: `RI-1-CHAOS-WEAVER-INTEGRATION.md` + `34_ROSTER_INTEGRATION_COHORTS.md`.
Baseline: entry working tree captured in `entry-hashes.json` / `entry-git-status.txt` before any edit.

## Phase 1 — Domain repairs B1–B5 (complete, validated)

Edited files (current-state hashes in `after-domain-repairs-hashes.json`):

| File | Entry → now | Nature |
|---|---|---|
| `vtt-react/src/data/classes/chaosWeaverData.js` | `fd27a919…` → `3b144a76…` | `outcome` on the closed record profile + 4 authored deterministic outcomes |
| `vtt-react/src/data/classes/chaosWeaverRules.js` | `07602a9e…` → `191d1b90…` | B1–B5 domain logic |
| `vtt-react/src/data/talentTrees/chaosWeaver.js` | `8c8e7d5d…` → `74d9f844…` | passive builder carries `outcome: null` |
| `vtt-react/src/data/classes/__tests__/chaosWeaverRules.test.js` | writable test | updated decline control; 4 new positive/negative controls |

Everything else in the entry manifest is hash-identical, including all read-only controls and retained C1 evidence.
`Step1CoreDraft.jsx` changed between entry and this snapshot due to **concurrent workstream activity** (subrace cards; separately tracked, not edited here); recorded for preservation and to be merged-with, not overwritten, when integration touches it.

### B1 — completed-build validation + level-change pruning

`buildPreview` no longer feeds a completed pick list through the add-pick validator. It now:
- structurally validates the submitted allocation against authored gates with the highest ranked `minLevel` (so an unpaid signature such as `{cw1_ps_n05:1}` is still refused);
- prunes level-ineligible/dependent ranks and over-budget points via `pruneAllocationForLevel`, then revalidates and exposes the pruned allocation, points and grants;
- validates picks as a completed build: unknown / non-`level-pick` / over-level / duplicate / more picks than levels refused; valid earlier unchosen picks stay legal.

Controls: retained probe "build validation and primary order" is back to its corrected baseline (`corePickAccepted:false`, `unpaidSignatureAccepted:false`); supplement `legalPick` flips `false → true`; new Jest controls cover legal pick, over-level pick, duplicates, per-level count, core-as-pick, and `fillTree` prune-at-level-1.

### B2 — settlement history validated against its recorded event

`validateSettlementShape` no longer requires a historical `selectedTileId` to still sit in the current spent zone (illegal after legal recovery/rest). It instead validates the recorded event: selected ID ∈ settled primary IDs; exactly one recorded face; the face resolves to the selected ID via the fixed mapping (anomaly-trigger and sampled settlements). Exports after Fold recovery, after rest, and the closed-anomaly witness round-trip exactly.

Controls: supplement `recoveredRoundTrip`/`restedRoundTrip` `false → true`; `anomalyCompleteWitness.roundTrip` `false → true`; new Jest round-trip asserts byte equality (`serializePacket(importPacket(text)) === text`).

### B3 — pending IDs priced and continuations checked

`validatePendingShape` now checks:
- pending primary IDs against the authored symbol/price profile (`comboForTileIds`), so a Split-shaped pending renamed to a Bias-shaped spell is rejected as a retained draft (`forgedPendingPrice` `true → false`);
- deterministic pendings must match the authored retained-outcome marker mapping, phase `face-recorded`, no selected/recorded face;
- a deterministic record without an authored outcome may not hold a pending at all;
- a non-null continuation must match an authored continuation choice symbol; actions without an authored continuation profile refuse one.

### B4 — anomaly void closes the sample

`voidPending` for a triggered anomaly now transitions the bound IDs to spent, clears the anomaly, retains the recorded face in the void settlement entry, and logs "closed without refund or redraw". Retriggering refuses (`no anomaly exists`); no redraw with the same action ID. Non-trigger voids unchanged.

Controls: supplement `anomalyVoidRedraw` now ends with `spent:["M1","F1"]`, `anomaly:null`; new Jest control asserts closure + no retrigger.

### B5 — deterministic authored results retained; decline requires confirmations

- New required profile field `outcome` (null on sampled/passive records) validated by `validateRecordProfile` (shape, `branchRule` must be null, damage contract).
- Authored outcomes on exactly the four deterministic records with an authored downside: `cw1_01` (1d6 Wyrd + 5ft next-start penalty), `cw1_04` (ward 2 self + 5ft), `cw1_08` (5ft + manual +1 check), `cw1_15` (5ft; manual requirement line added). All other deterministic records keep the instant-spend path.
- `commitSpell` for an authored deterministic outcome moves IDs available→committed and creates a pending with the `deterministic-no-sample` marker mapping, phase `face-recorded`; `resolveFace`/`recordFace` refuse with "this deterministic result has no physical face; settle it with its authored confirmations".
- `retentionForPending` returns the authored outcome and confirmation labels for these pendings; settlement records the outcome and applies the recorded 5ft next-start penalty (penalty record only — no automatic movement/HP/AP application; `remainingMovementFeet` untouched).
- `resolveContinuation` decline refuses `undefined`/partial confirmations ("confirm the retained authored result first: missing …"), then finalizes with the confirmed primary labels; only the unused reservation returns.

Justified sequencing fallout (reported, not weakened):
- The retained read-only workshop's decline button sends `{}`; its single decline test now fails against the corrected contract (`test-run-domain-repairs.log`). The corrected flow lands on the integrated class-detail surface; workshop JSX/tests stay untouched as required.
- Retained probes #28 ("round trips all worksheet phases") and #31 ("Cascade numerical witness") decline without confirmations and now throw on that step. All other 30 retained probes match the corrected baseline payload-exactly (`probe-summary-after.json` + this report's diff section).
- The supplementary harness `deterministicFracture` observation throws at its generic `recordFace` step for the same reason; its former payload proved the defect (no retained result), and the new flow is covered by the Jest controls plus `supplement-run-after.json`.

### Verification summary (phase 1)

- Five-suite baseline command: **4/5 suites, 53/54 tests** — the one failure is the retained workshop decline expectation above.
- Scoped ESLint: 0 errors, 1 pre-existing `no-loop-func` warning (`chaosWeaverRules.js:1749`, present at entry).
- Retained 32-probe run: exit 0, payload delta exactly probes #28/#31 (throws), witnesses/preservation/counts identical.
- Supplement: every defect observation flips to corrected behavior; two observations throw on the mandated confirmation sequencing.
- Hashes: `after-domain-repairs-hashes.json`; logs: `test-run-domain-repairs.log`, `eslint-domain-repairs.log`, `probe-summary-after.json`, `supplement-run-after.json`.

## Phase 2 — Established-system integration (complete, validated)

Current-state hashes: `after-phase2-hashes.json` (33 files). Registered manifest: `manifest-phase2.json`.

### New integration modules

| File | Content |
|---|---|
| `data/classes/chaosWeaverIntegration.js` | `CHAOS_WEAVER_DATA`: identity, `developmentStatus:'development'`, `manualOnly`, 49 projected actives (40 optional + 3 core + 6 talent actives) with typed branch/price/continuation/manual requirements, `spellPools` (4 authored options per level 1–10), `CHAOS_WEAVER_PROGRESSION_POLICY` (1 starting pick, 1/level, earlier unchosen allowed, no random/auto assignment, core grants), specializations, resource system, variants. |
| `data/classes/classReconstructionCompatibility.js` | 9 data-only legacy→successor rows + helpers; no automatic conversion. |
| `data/resourceSystems/chaosWeaverResourceGuide.js` | v2 resource guide (zones, publish-then-face, paid recovery, long-rest-only refill). |

### Registered seams

- `classes/index.js` — `CLASS_TEMPLATES['Chaos Weaver']` (registered; 25 classes total).
- `classDisplayData.js`, `classSpellGenerator.js` (dedicated projection preserves `specialization`), `classSpellCategories.js`, `talentTreeData.js` (`buildChaosWeaverTree` over the 3×18 = 54 authored nodes; 6 grant nodes), `classResources.js` (uninitialized `chaos-weaver-tiles` config), `classResourceContracts.js` (`CHAOS_WEAVER_TILE_RESOURCE_ID`, normalization, change refusal), `resourceSystems/index.js` (+guide), `classHeritageRegistry.js` (drall_fexric path + provenance row + history row; `heritageEffectsImplemented:false`; not inserted into `CLASS_COMPATIBILITY_ALIASES`).

### Consumers

- `ClassesDisplay.jsx` — prominent workshop entry + banner removed; status visible before selection via `class-row-dev-badge` ("Development") on the card; CW remains selectable (no `comingSoon`); tests rewritten to CW expectations.
- `ClassDetailDisplay.jsx/.css` — CW region (`cragjaw-peaks`), uninitialized demo class resource, dev-status chip; header/role/dev chip contrast measured ≥6.1:1 (see below).
- `ClassResourceBar.jsx` — `'chaos-weaver-tiles'` dedicated read-only display; explicit uninitialized notice (`data-cw-uninitialized`); tiles never drawn/refilled/moved; max-0 hide guard exception scoped to this visual type only (regression control for Warden included).
- `TalentTreeContent.jsx` — explicit policy gates + dynamic tier rail retained; grant nodes now own their canonical class-spell identity (`grantId`) in spellbook/library, legacy `talent-spell-${id}` unchanged for nodes without a grant; reset removes both forms.
- `Step1CoreDraft.jsx` — CW in `CLASS_DATA_MAP` + specialists group; `getStartingSpellPickCount` policy reads; optional-pick counting filters to `spellPools[1]`; class click seeds `grantedCoreSpellIds`; pick launcher/drawer/confirm gated on exactly one optional pick.
- `Step9CharacterSummary.jsx` — checklist "Starting Spells (choose 1)" driven by policy + pool-only count.
- `LevelUpChoiceModal.jsx` — policy-scoped level-up pools (current level; earlier unchosen too when allowed); core/talent/passive actives are never free picks.
- `infoSlice.js` — class-change on a policy class grants only `grantedCoreSpellIds` (no random starters).
- `progressionSlice.js` — `forbidsAutomaticSpellAssignment` guard: `ensureClassStarterSpells` refuses; `assignSpellsForLevel` no-ops; legacy classes unchanged (control test).

### Bounded amendments (added seams, documented blockers)

1. `RulesPage.jsx` — single `CLASS_DATA_LOADERS['Chaos Weaver']` entry (with in-file comment). Blocker: this map is the only loader for the normal class detail; without it the detail cannot resolve projected spells/pools (acceptance #3/#4 fail). One line only.
2. `CharacterWizardContext.js` (protected Wizard reducer) — AMENDMENT-1, confined to the `spells` validation branch: policy classes count only `spellPools[1]` picks and derive `startingSpellPicks` from the class policy. Blocker: the hardcoded 3-pick expectation blocks legitimate CW creation with exactly one optional pick.
3. `ClassesDisplay.css` — 2 selectors styling the development badge. Blocker: status must be visible before selection (acceptance), and this component's rows are styled solely from this sheet; sibling badges already use it.
4. `data/resourceSystems/__tests__/allGuides.test.js` — guide-key equality assertion updated for the new guide.

### B6 / B7 dispositions

- **B6** — authored/domain validation already rejects non-integers (`Number.isInteger` throughout `chaosWeaverRules.js`). The integrated surfaces expose no numeric counter inputs (HUD and detail resource panel are read-only). The only remaining `parseInt` counters are in the retained read-only workshop (`ChaosWeaverWorkshop.jsx:603–605`); reported as a remaining reproducible failure + exact Main HeadQ seam. No integrated path can truncate input.
- **B7** — the low-contrast gradient header belonged to the retired workshop delivery surface; the normal route no longer mounts it (`noWorkshopMount:true`). Measured on the actual class detail at 1280px and 360px: heading 12.5:1, Development chip 12.56:1, role line 6.16:1, tabs ≥52px, `scrollWidth === clientWidth` (no clipping).

### Verification (Phase 2)

- Five-suite retained baseline: **4/5 suites, 53/54 tests** — same single retained workshop decline expectation (`test-run-phase2.log`).
- Targeted suites: TalentTree/ClassesDisplay/ClassDetailSpells/CharacterWizardContext **4 suites, 26 tests pass**; new suites `chaosWeaverIntegration` + `ChaosWeaverClassResourceIntegration` + `chaosWeaverProgression` **3 suites, 15 tests pass**; `allGuides` + `chaosWeaverPackage` + `ChaosWeaverResourceDisplay` **3 suites, 127 tests pass**.
- Retained 32-probe run: delta identical to Phase 1 — probes #28/#31 throw on the mandated confirmation sequencing, all other payloads equal, witnesses equal; preservation drift limited to concurrently edited `server/` files (`probe-diff-phase2.md`).
- Supplementary harness: observations match Phase 1 post-repair dispositions (corrections, justified sequencing throws, preserved controls) — no new divergence (`supplement-diff-phase2.md`).
- Scoped ESLint (27 JS/JSX): **0 errors**, 83 warnings, all pre-existing unused-vars/exhaustive-deps in large legacy files (`eslint-phase2.log`).
- Personal snapshot codec: CW `class_spells` (core + pick), `talents`, `levelUpHistory` and typed `classResource.tiles` survive an ordinary `assembleCharacterWorkingData` → JSON round-trip (`codec-roundtrip-phase2.log`; fixture `codec-roundtrip-fixture.test.js.txt`).
- Browser: `browser-results-1280.json`, `browser-results-360.json` (route `/rules?…class=Chaos Weaver`); catalogue card + detail tabs (Overview/Tradition/Resource System/Specializations/Spells) render on the normal routes; Spells tab lists 7 inscribed level-1 spells (3 core + 4 pool) etc.; 0 console errors.

### Remaining capability boundaries (for Main HeadQ)

- Retained workshop remains unmodified: its decline button sends `{}` (fails corrected confirmations) and `parseInt` counters truncate fractional input.
- No automated execution anywhere: HUD/detail are read-only; no AP/HP/movement/cooldown is applied automatically; all class-specific effects are manual-tabletop.
- Authenticated Character Forge route is not reachable in demo mode; wizard class selection/learning logic is covered by the store/component suites instead.
- No commit/push/deploy performed.
