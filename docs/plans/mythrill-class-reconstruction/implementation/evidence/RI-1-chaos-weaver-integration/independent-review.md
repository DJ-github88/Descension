# RI-1 Chaos Weaver — independent integration review

**Verdict: BLOCK** (2026-10-19)

Reviewed against `RI-1-CHAOS-WEAVER-INTEGRATION.md`, `34_ROSTER_INTEGRATION_COHORTS.md`, the phase-1/phase-2 evidence, and the retained C1 controls. Application code was not modified for this review; probes and browser state were read-only/restored. Machine-readable results: `independent-results.json`, `independent-retained-probes.json`, `independent-supplement.json`, `independent-hud-console.txt`.

The integration is substantially real: the class is registered, authored content is present, the normal class-detail route works at 1280/360, the six-tile display is read-only and correct for valid/uninitialized state, heritage access resolves, the repaired C1 rules round-trip, and legacy saves are preserved. It is not acceptable yet because four acceptance failures are reachable in the integrated class, and the heritage test baseline was not updated for the approved new class.

## Blocking findings

### 1. Level-2 learning still uses the legacy random 3-option slice

The policy filter in `LevelUpChoiceModal.jsx:654-658` correctly restricts options to `spellPools[level]` and earlier unchosen pools. The legacy special case at `LevelUpChoiceModal.jsx:956-968` then shuffles and slices the policy-filtered result to three for every class at level 2, with no policy bypass.

Live reproduction (real modal, level 2, known `cw1_01`):

- Rendered icons: **3** — Fracture Brace, Lancing Variance, Survey the Seam (the trio changes per reload).
- Legal options from `CHAOS_WEAVER_DATA.progression.policy` (`allowEarlierUnchosen:true`), pools 1+2 minus known: **7** — `cw1_02`, `cw1_03`, `cw1_04`, `cw1_05`, `cw1_06`, `cr1_chaos_weaver_read_instability`, `cw1_08`.
- Contract acceptance #3 requires “Level2 adds one legal optional”; hiding four legal options fails it.

**Fix:** do not apply the level-2 random slice to classes with an explicit progression policy (skip it entirely when `progressionPolicy` is non-null, or delete the special case and rely on the pool filter).

### 2. The six paid talent actives materialize as PASSIVE / 0 AP with no typed metadata

`talentTreeData.js:314-338` synthesizes one `spell` object per node and hard-codes `spellType:'PASSIVE'` for all of them, including nodes whose `grantId` names an authored ACTION. `convertTalentSpellToLibrarySpell` then classifies that synthetic object as passive. `TalentTreeContent.jsx:502-509` overrides only the library `id` to the canonical `grantId`, so the identity is right but the content is not.

| Node | Canonical grant | Authored | Materialized |
|---|---|---|---|
| `cw1_ps_n05` | `cr1_chaos_weaver_bias_draw` | ACTION, 2 AP | PASSIVE, 0 AP, no typed record |
| `cw1_ps_n18` | `cw1_closed_distribution` | ACTION, 3 AP | PASSIVE, 0 AP, no typed record |
| `cw1_ab_n05` | `cr1_chaos_weaver_unsteady_ground` | ACTION, 2 AP | PASSIVE, 0 AP, no typed record |
| `cw1_ab_n18` | `cw1_last_boundary` | ACTION, 3 AP | PASSIVE, 0 AP, no typed record |
| `cw1_ca_n05` | `cr1_chaos_weaver_second_possibility` | ACTION, 3 AP | PASSIVE, 0 AP, no typed record |
| `cw1_ca_n18` | `cw1_single_aftershock` | ACTION, 4 AP | PASSIVE, 0 AP, no typed record |

The canonical ID is applied by `syncTalentSpell`; the authored type, AP price and `specialMechanics.chaosWeaver` record are not. Passive-only nodes keeping `talent-spell-<node>` is intended legacy behavior and is not this defect. Contract acceptance #1 (“all 49 active prices … resolve in actual adapter/card/library output”) and #5 (paid state) fail for the granted actives.

**Fix:** for nodes with `grantId`, build `spell` from the canonical authored active record (or resolve it in `syncTalentSpell`/a shared helper) instead of stamping the synthetic passive; preserve authored `spellType`, `resourceCost`, targeting and typed class metadata. Never emit a second passive record for the same paid grant.

### 3. Talent ranks and grants survive level reduction and class switching

`updateLevel` (`progressionSlice.js:432-455`) only sets `level` and calls `assignSpellsForLevel`; it never prunes `talents` or removes earned grants. `updateCharacterInfo('class', …)` (`infoSlice.js:225-298`) replaces `class_spells.known_spells` with the new class’s core grants but leaves `talents` untouched. `pruneAllocationForLevel` is only called from the preview path (`chaosWeaverRules.js:1999`).

Live reproduction:

- Set level 10 with a paid allocation (including capstone `cw1_ps_n18`) and class spells; `updateLevel(1)` left the full talent map unchanged (including the capstone) and left the granted spell IDs known.
- Switching to Berserker replaced `known_spells` with Berserker starters but left every `cw1_ps_*` rank and the capstone in `talents`; the earlier live run also left granted canonical spells in the spellbook.
- Contract acceptance #2 (“lower level/respec removes eligibility/grants”) and #3 (“no extra … talent grant”) fail.

**Fix:** on level reduction and class change, prune the allocation with `pruneAllocationForLevel`, remove earned grant spellbook/library entries for removed ranks, and enforce the `5×level`/50 cap and capstone level. Respec should use the same pruning path. Do not silently rewrite the character’s real talents from preview-only code.

### 4. A valid deterministic pending crashes the resource HUD

For an authored deterministic result, `commitSpell` creates a pending with phase `face-recorded`, `recordedFaces: null`, and a `deterministic-no-sample` mapping (`chaosWeaverRules.js:1134-1144`). `pendingText` (`ChaosWeaverResourceDisplay.jsx:85-96`) reads `pending.recordedFaces[0]` for that phase and throws.

Reproduced with `cw1_01` committed on `F1` in the real PartyHUD and in the standalone probe:

```
Uncaught TypeError: Cannot read properties of null (reading '0')
  at pendingText (ChaosWeaverResourceDisplay.jsx:93)
```

Console evidence: `independent-hud-console.txt`; machine result: `deterministicDisplay.threw`. This is a valid state the repaired rules create, so acceptance #5 (“retain pending face/outcome/continuation”) fails.

**Fix:** handle deterministic pendings before indexing faces — render the authored outcome/confirmation prompt (no physical face), and guard `recordedFaces`/`selectedTileId` null. Do not invent a face.

### 5. Heritage test baseline was not updated for the approved 22nd class

`data/__tests__/classHeritageRegistry.test.js` is a writable heritage consumer test but was not updated. Three tests fail because `CLASS_PROVENANCE` and `BASE_CLASSES_DATA` now have 22 entries, not 21; the blueprint checks still expect 21 and 525 combinations. The registry behavior itself is correct: `getClassNativeHeritageIds('Chaos Weaver')` is exactly `['drall_fexric']`, matching the approved single Alchemite addition; the other 21 classes’ blueprint relationships are unchanged.

Disposition: not a runtime defect, but a required deliberate baseline update. Do not weaken the 25-heritage/102-native-blueprint assertions; add Chaos Weaver as the approved 22nd development class and assert its only native row is `drall_fexric`, plus the 550-combination iteration. Leaving a directly related suite red is not acceptable for acceptance.

## Test-failure dispositions

- **`ChaosWeaverWorkshop.test.jsx` — “granted Second Possibility reaches rehearsal and declining returns the reservation”**: retained unsupported-path failure. The unchanged workshop decline button sends `{}` and cannot satisfy the repaired decline confirmations; the workshop has no production importer/route and RI-1 removed its delivery entrance. Do not edit the assertion to manufacture a pass. Explicitly update or retire the retained workshop test in a separate bounded change. This is not evidence that the integrated decline path is broken; that path is covered by `chaosWeaverRules.test.js` and passes.
- **`classHeritageRegistry.test.js` — 3 failures**: approved-class baseline drift, described above. Update the test deliberately.
- **Retained C1 probe exceptions (4)**: `manual anomaly closure bypass`, `round trips all worksheet phases`, `Anomaly numerical witness`, `Cascade numerical witness`. These retained probes encode pre-repair inputs (missing confirmations/spent tiles) and now throw on the corrected contract. Disposition: harness drift, not product defects; update the probes to the repaired confirmation/input sequencing rather than relaxing the repair. All other retained payloads are identical (`retainedProbeDrift: []`), and the 54 node gates / 40 prices remain clean.
- **Focused Jest run (12 suites): 201 pass / 1 fail** (workshop decline above). **Heritage suite: 49 pass / 3 fail** (baseline update above).

## What is integrated and usable now

- Manifest unchanged: 97 unique identities, 49 active (40 optional + 3 core + 6 talent actives), 48 passive records, 54 nodes, 3 trees, six tile IDs, `executionEnabled:false`, manual-tabletop.
- Normal catalogue/detail at `/rules?...class=Chaos%20Weaver`: development badge, overview/tradition/resource/specializations/spells, full cards, three trees and node inspector; 1280 and 360 have no horizontal overflow; inspector Escape returns focus.
- Creation prerequisites and policy: exactly one optional level-1 pick, core grants separate; store-level starter/level-up policy tests pass. The authenticated wizard route was not exercisable in this session (redirect), so the UI path remains a verification gap.
- HUD: uninitialized personal resource shows an explicit notice rather than six invented tiles; valid 4-available/2-committed state renders all six tiles correctly; no refill or scalar conversion.
- Heritage: `drall_fexric` native access and broken-stabilizer/outsider/qualified cases resolve; only the approved single native relationship was added.
- Repaired C1 domain: deterministic outcomes, decline confirmations, anomaly void closure, recovered/rested imports, build/price validation; all three manual sequences complete and round-trip byte-exactly in the probe run.
- Preservation: Gambit, Augur (including Nereid alias), Harbinger, Revenant, Shaper and Apex round-trip identical; phase-2 33-file hash manifest is exact. Entry drift is limited to concurrently edited protected files (26 paths, including `PartyHUD.jsx`/socket work); no phase-2 drift.
- No automatic execution: all class effects remain manual/read-only; no AP/HP/movement application or room authority.

## Remaining Main HeadQ dependencies

- Resource execution/persistence/multiplayer admission for the six tiles; the HUD intentionally owns no authoritative state.
- Automatic application of paid AP/HP/movement/penalties and any combat execution; currently manual-tabletop only.
- Server/P9/P12/P13 reaction-window and PartyHUD integration owned by the concurrent workstream; reconcile, do not overwrite.
- Wizard targeting/export preservation remains a separate contract, not part of RI-1 acceptance.

## Minimal correction instruction (copy-ready)

> Repair only these RI-1 acceptance failures, then rerun the targeted suites, retained probes, and the live 1280/360 checks:
>
> 1. In `LevelUpChoiceModal.jsx`, bypass the legacy `currentLevel === 2` random three-option slice for classes with `progression.policy`; the modal must show every legal current-or-earlier unchosen `spellPools` option (7 at level 2 with `cw1_01` known).
> 2. In `talentTreeData.js`/`TalentTreeContent.jsx`, stop synthesizing `spellType:'PASSIVE'` for grant nodes. For nodes with `grantId`, materialize the canonical authored active record (type, AP price, targeting and `specialMechanics.chaosWeaver`); keep `talent-spell-<node>` only for nodes without a grant. Ensure no duplicate library entry.
> 3. On level reduction and class change, prune `talents` with `pruneAllocationForLevel`, remove earned grant library/spellbook entries for removed ranks, and enforce `5×level`/50/capstone. Do not alter preview-only semantics.
> 4. In `ChaosWeaverResourceDisplay.jsx`, render deterministic `face-recorded` pendings without indexing `recordedFaces`/`selectedTileId`; show the authored outcome/confirmation text and keep the physical-face path unchanged.
> 5. Update `classHeritageRegistry.test.js` for the approved 22nd class: 22 provenance/base entries and 550 combinations, while preserving the 25-heritage/102-native-blueprint checks and asserting `Chaos Weaver -> ['drall_fexric']`. Leave the retained workshop decline failure explicitly updated/retired; do not fake its assertion.
>
> Return exact source hashes, updated test logs, and live evidence for each item. After ACCEPT, proceed to the next cohort: Gambler first, then Fate Weaver incorporating Augur; reuse the RI-1 pattern and build no new standalone workshop. Wizard targeting/export preservation stays a separate workstream.
