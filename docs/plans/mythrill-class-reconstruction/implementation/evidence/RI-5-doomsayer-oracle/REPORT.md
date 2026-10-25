# RI-5 Doomsayer + Oracle — consolidated implementation report

**Date:** 2026-10-25  
**HEAD:** `77c110db` (worktree dirty; unrelated Plaguebringer and P14-A7 changes preserved)  
**Status:** implementation and focused verification complete. No commit, push or deploy. Not Sol acceptance; broad review remains for the completed class batch.

## Scope

Implemented Doomsayer and Oracle as complete classes through the established roster system:

- class data and detail/catalogue registration;
- full optional pools, core grants, signatures, capstones and 54-node/150-rank trees;
- normal character creation, level-up, talent, spell library, sheet and HUD seams;
- manual resource contracts and read-only HUD previews;
- explicit Harbinger legacy dispositions and historical Oracle dispositions;
- content locks, class dossiers and carry-forward shared-defect record.

No standalone workshops, parallel combat authority, class-specific server or automatic migration were added.

## Content inventory

| Class | Core | Optional | Optional per level | Signatures | Capstones | Passive records | Nodes | Ranks | Unique records | Action | Passive |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Doomsayer | 2 | 40 | 4 | 3 | 3 | 48 | 54 | 150 | 96 | 48 | 48 |
| Oracle | 2 | 40 | 4 | 3 | 3 | 48 | 54 | 150 | 96 | 48 | 48 |

Both classes use `rulesetVersion: cr-review-r1`, `authoredOnly: true`, `manualOnly: true`, `executionEnabled: false`, and `applicationMode: manual-tabletop`.

### Exact class IDs and resources

- Doomsayer: `doomsayer`; resource `doom-calamities` ("Calamities & Havoc"); Havoc 0-15; at most two active public calamities; trigger resolution +3 Havoc, expiry +1, dismantle +0.
- Oracle: `oracle`; resource `oracle-forecasts` ("Forecasts"); exactly two prepared slots; one-or-two own-turn expiry; no Omen Debt, no dice replacement.

### Core durations and clock/expiry rules

- Doomsayer calamity clocks: 1-3 own turns; only an authored paid action or recorded table event advances a clock; no automatic timer.
- Oracle forecast expiry: 1-2 own turns; fulfillment/failure/expiry is recorded once; no automatic benefit.

### Core grant IDs

- `cr1_doomsayer_plant_calamity`
- `cr1_doomsayer_dismantle_calamity`
- `cr1_oracle_commit_forecast`
- `cr1_oracle_release_forecast`

### Tree IDs and signature/capstone IDs

| Class | Tree | Signature | Capstone |
|---|---|---|---|
| Doomsayer | `requiem` | `cr1_doomsayer_quiet_requiem` | `cr1_doomsayer_absolute_requiem` |
| Doomsayer | `endbringer` | `cr1_doomsayer_lengthen_the_hour` | `cr1_doomsayer_the_last_hour` |
| Doomsayer | `forewarner` | `cr1_doomsayer_sound_the_warning` | `cr1_doomsayer_the_published_doom` |
| Oracle | `seer` | `cr1_oracle_read_the_next_step` | `cr1_oracle_the_clear_moment` |
| Oracle | `witness` | `cr1_oracle_witness_the_blow` | `cr1_oracle_the_watched_thread` |
| Oracle | `pathfinder` | `cr1_oracle_chart_the_safe_line` | `cr1_oracle_the_certain_road` |

Signatures require level 3, 10 same-tree points and fully ranked entry predecessors. Capstones require level 10, 45 same-tree points, the signature and the final passive predecessor. All 18-node trees contain 16 three-rank passives plus one signature and one capstone.

Full exact optional IDs, names, AP, damage/target/duration, gates and rank values are in [CONTENT-LOCK.md](CONTENT-LOCK.md) and [CONTENT-LOCK.json](CONTENT-LOCK.json).

## Compatibility mappings

### Harbinger to Doomsayer

- Relationship: `successor-name`.
- Legacy resolution retained: yes.
- Automatic conversion: no.
- Successor: `doomsayer` only.
- `414` explicit Harbinger record dispositions, all `keep` under `harbinger` with `destinationId: null`:

| Source type | Count |
|---|---:|
| spell | 45 |
| nested spell effect | 46 |
| spell-pool entry | 45 |
| talent node | 57 |
| talent rank | 150 |
| materialized talent | 57 |
| subrace variant | 5 |
| heritage edge | 4 |
| resource | 2 |
| specialization | 3 |

Legacy Harbinger remains registered with its exact Mayhem gauge (`mayhem`, max 100), spells, trees and saves. Doomsayer does not import Mayhem, Wild Surge or the Harbinger tree IDs.

### Oracle historical records

- Relationship: `independent`.
- Legacy resolution retained: yes.
- Automatic conversion: no.
- Successors: none.
- `81` historical Oracle dispositions, all `legacy-only` with `destinationId: null`: 35 spells, 38 nodes, 3 trees, 1 Omen Debt resource, 3 specializations and 1 legacy Augur/debt alias record.
- New Oracle records use separate `cr1_oracle_*` IDs. Historical Omen Debt is not restored as a live resource.

## Heritage and acquisition

Recommendation-only; no `CLASS_PROVENANCE` entry, no native edge, no heritage effect implementation:

- Doomsayer: `skald_human`, `thrask_solari`, `tessen_human`; acquisition `witnessed_calamity`, `doom_arithmetic`, `disruption_method`, `forewarning_accounting`.
- Oracle: `vashir_astril`, `ordan_human`; acquisition `observed_omen`, `forecast_discipline`, `expiry_accounting`, `bounded_reading`.

`getClassNativeHeritageIds('Doomsayer')` and `getClassNativeHeritageIds('Oracle')` both return `[]`. No pair is advertised as live pending approval.

## Implementation notes

- Added the two classes to the class registry, spell generator, spell categories, talent tree registry, display catalogue, resource registry, resource aliases, resource contracts, resource guides and HUD router.
- Added class-specific handling to `Step1CoreDraft`, `LevelUpChoiceModal`, `useClassSpellLibrary`, `TalentTreeContent`, `infoSlice` and `progressionSlice` for core-only starting grants, authored optional pools, talent pruning and reconciliation.
- Added read-only HUD displays that show uninitialized state rather than inventing a calamity or forecast.
- Added dispositions as data-only modules. No automatic conversion or duplicate character records were created.
- Added `RI-5` content-lock export guard at `vtt-react/src/data/classes/__tests__/ri5ContentLockExport.test.js`; it writes the JSON lock only when `RI5_EXPORT=1`.

## Verification actually run

### Automated

| Check | Result |
|---|---|
| `src/data` suite | 75 suites, 1,501 tests passed |
| `src/components/hud` suite | 15 suites, 89 tests passed |
| New package suites | Doomsayer 9/9, Oracle 9/9 |
| Store/consumer suite | 18/18 (class selection, starter/level-up non-granting, modal options, signature, capstone gates, Reset All, actual `updateLevel(1)`, actual class switch and pruning) |
| HUD manual-resource suite | 5/5 |
| `allGuides` | 142/142 |
| Heritage/icon count suites | 17/17 |
| Resource/rest/resource-slice suites | 28/28 |
| Scoped ESLint | 0 errors, 79 existing warnings |
| Production build | exit `0`; build log ends with successful static build |
| `git diff --check` | no whitespace errors in RI-5 files; two unrelated pre-existing trailing-space warnings in `CharacterSheetWindow.jsx` and `Lore.jsx` |
| `check-class-structure` | `doomsayerData.js` and `oracleData.js` `[OK]`; full command still fails on pre-existing Fate Weaver/Gambler/Deathcaller/Lichborne/Chaos Weaver schema issues |
| `audit-classes --class Doomsayer` | 0 integrity errors, 0 pool-floor gaps; 3 expected warnings for core/talent records omitted from optional pools |
| `audit-classes --class Oracle` | 0 integrity errors, 0 pool-floor gaps; 3 expected warnings for core/talent records omitted from optional pools |
| `validate:talent-trees` | CR1 wrapper exports reported as "legacy" for Doomsayer, Oracle, Fate Weaver and Gambler; actual 18-node/50-rank trees are asserted by the integration suites |

### Browser checks

Against the running app at `http://localhost:3000`:

- `/rules/classes` exposes `Doomsayer`, `Oracle` and the unchanged legacy `Harbinger`.
- Doomsayer detail resolves role, resource, three specializations, `50 Capacity` Requiem tree, `Quiet Requiem` signature and `Absolute Requiem` capstone.
- Absolute Requiem reports `Requires character level 10`, `Requires 45 points spent in Requiem` and the authored prerequisite.
- Doomsayer Resource System shows the explicit uninitialized Calamities & Havoc display.
- Doomsayer Spells tab shows the core and level-1 records.
- Oracle detail resolves role, resource, three specializations, `50 Capacity` Seer tree, `Read the Next Step` signature and `The Clear Moment` capstone.
- Oracle Resource System shows the explicit uninitialized Forecast Slots display and `No debt`.
- Oracle Spells tab shows the core and level-1 records.
- `/account/characters/create` exposes both classes. Doomsayer and Oracle each show their two core grants and four legal level-1 optional choices. Selecting Doom Bolt changes Starting Spells to `1 of 1 chosen`; initial state is `0 of 1 chosen`.
- At 390x844, both class detail/resource pages and the character-creation route have `scrollWidth === innerWidth` (no horizontal overflow).
- Normal console state on class pages is the pre-existing `Error loading user maps: FirebaseError: Missing or insufficient permissions.` A dev-only `removeChild` overlay artifact appeared once after manually removing a stale webpack overlay; a clean reload returned to the single pre-existing Firebase error. This is not attributed to RI-5.

## Changed paths and SHA-256

Hashes are after the final edits. `REPORT.md` is omitted because it is this document.

| Path | SHA-256 |
|---|---|
| `vtt-react/src/data/classes/doomsayerData.js` | `cfac0079c72d826d21687b0df472d2808da3b54753679b017440e0f12ffd2ee4` |
| `vtt-react/src/data/classes/oracleData.js` | `b0169b25ec96e1af2c98ba5466ff5b4d457bf49b37fb0861f01236a0904bdba0` |
| `vtt-react/src/data/classes/harbingerDispositions.js` | `98eed2757fa243289c525d8bfd2a536884383243f382d4c2bc12de553e9e623c` |
| `vtt-react/src/data/classes/oracleDispositions.js` | `dbbd71681e349e240ac3d346161f2fe9bcf8a0dcbce0c613fd4f994324e2e90e` |
| `vtt-react/src/data/talentTrees/doomsayer.js` | `a22b635205817932d9a923a33a247d9c251a511733d7f8048a166f3670c9b54a` |
| `vtt-react/src/data/talentTrees/oracle.js` | `5a0721fa61a157c68885078693fb647dff73562aa2bef21c852e5eadbdf93c4c` |
| `vtt-react/src/data/resourceSystems/doomsayerResourceGuide.js` | `6bd8c766f38fda2947089d72c40e7edcb71b45f043ae15d80ec7c50c6546ff76` |
| `vtt-react/src/data/resourceSystems/oracleResourceGuide.js` | `e7927642497a85208649f60e4c0dfafc27905d7b0c8c7ede61e3c2a494f49dc5` |
| `vtt-react/src/components/hud/DoomsayerResourceDisplay.jsx` | `e7764d0b1f59b19e2f3cb5abc2106e15cdeeb510a43cebb544bd17da0d062265` |
| `vtt-react/src/components/hud/OracleResourceDisplay.jsx` | `78ef2e839c305d835f1a7b01e2ca0760db59e94aad07a8e9b4465bc614fb5b49` |
| `vtt-react/src/data/classes/__tests__/doomsayerIntegration.test.js` | `34a3e2f391e3d03a93bf40fb8fd5bcefbd5aabe72c948a57af1f17198736087f` |
| `vtt-react/src/data/classes/__tests__/oracleIntegration.test.js` | `bde4d4121a3bf3f64d38ada26049d4a4698a178bd5b14b6b6afb5929877a0b5e` |
| `vtt-react/src/data/classes/__tests__/doomsayerOracleStoreIntegration.test.jsx` | `e1c3a8dfac1f81a723737e26acc49e4f59b06bcfa08206e2338fbde27e41c336` |
| `vtt-react/src/data/classes/__tests__/ri5ContentLockExport.test.js` | `ab959b5484b31d3c41b8310baa5d048afed263b8a77987804e44aff4134c83e5` |
| `vtt-react/src/components/hud/__tests__/DoomsayerOracleResourceDisplay.test.jsx` | `782390adae7238b93f9961d29cfa1a220433178e7fa0847a0dc7e4a4babf5693` |
| `vtt-react/src/data/classes/index.js` | `eb073d7e5b56f98a29634583b635ef6ae3bb3b06da175b1f5ee737e066f9c278` |
| `vtt-react/src/data/classes/classDisplayData.js` | `7ba4838c3bf83bc28992013c7009e518378fd0dfe4895b17ed6d4e40847cae61` |
| `vtt-react/src/data/classes/classReconstructionCompatibility.js` | `fb041b31e52f03e8884ba496be8586417fea89e29d4168b35b42c7d4326ed894` |
| `vtt-react/src/data/classes/classFlavorProfiles.js` | `9d3cd9cfcc7f66cec3cadf32cd821ea17958e3e2b5572999dacd6afaefb5d208` |
| `vtt-react/src/data/classSpellGenerator.js` | `da1f7e81e22d9c8fd532feb0a0b514c3d0bcc24f66880af41bda163dc92ee8d4` |
| `vtt-react/src/data/classSpellCategories.js` | `1c7475c8a14c2975b4d9780722d44f7edcfbba13a7fcd4cd78c7ba209d1a044a` |
| `vtt-react/src/data/talentTreeData.js` | `ae352eca445aa8157828877d08c962ce6de724dd8e2c0f2cd76978adcc89402f` |
| `vtt-react/src/data/classResources.js` | `f9b3f70bfc4a94abb7d4d0122181e3c10b6e4f7762d991d7503e3219f397f855` |
| `vtt-react/src/data/classResourceContracts.js` | `9151ba17317da7e84229310e004da3ec40c799edf147642aff68be2ca3f3277a` |
| `vtt-react/src/data/classResourceAliases.js` | `50f5873a304fc2c98480af5554c0294af65009011d9f0ef7c2a5c82f402bd138` |
| `vtt-react/src/data/resourceSystems/index.js` | `a60d9246f08839db232e5063d621ced059d98141919950f2be54062a32228893` |
| `vtt-react/src/data/resourceSystems/__tests__/allGuides.test.js` | `d317ca9b2206e723842875719a5acf05473132b8b7e29c2e51ba6d93e87fe83e` |
| `vtt-react/src/components/hud/ClassResourceBar.jsx` | `1254e06c7b58f0dbee266a46c1945055a50e42bd8e4e2c2cea4c0177c4c597f8` |
| `vtt-react/src/components/rules/RulesPage.jsx` | `995f70dc97d3ab72ab8d6ad00b352673091fdde68f6a6aec257c6a8122612ff0` |
| `vtt-react/src/components/rules/ClassDetailDisplay.jsx` | `4982c1d97c6f85c8aa5886d9f6bd8cb079f235b4e04cdb4119396b910fa0b3ac` |
| `vtt-react/src/components/character-creation-wizard/steps/Step1CoreDraft.jsx` | `a39287eeb1e8e9577e319a60cadea3ded3c82399be7d0ac1385355c0f6d23c11` |
| `vtt-react/src/components/modals/LevelUpChoiceModal.jsx` | `96298db2b53d084184fe8b22c9e22dd99aa0fff5e31fcaf29d211810f5573077` |
| `vtt-react/src/store/characterSlices/infoSlice.js` | `85a7c46a7a089c9b0771c29b2c65d9ce19729a4bcee8507c8e13097016a3835d` |
| `vtt-react/src/store/characterSlices/progressionSlice.js` | `fc5b58da791c237fdfb85b5a281665fce34a128290883ddc7adea68f27bd1e19` |
| `vtt-react/src/hooks/useClassSpellLibrary.js` | `ecf9c70255c2e018f2fb47afca91248997d4abebd2d216f762b8b599f1901911` |
| `vtt-react/src/components/talent-tree/TalentTreeContent.jsx` | `1a4a890b5b79f873d11738953dd04ce44c4628099d8de4eb2edc4d15b6c14911` |
| `vtt-react/src/data/__tests__/classHeritageRegistry.test.js` | `ad38802279be35d85fa669bd9b7bf13493124376749d578817afdef1f178bfc7` |
| `vtt-react/src/utils/__tests__/classIconUtils.test.js` | `8b261ccd6607d44fd96d0d82c4d5bdc1bb74e264c425dac8d2b1df98e6e9a05c` |
| `docs/plans/mythrill-class-reconstruction/classes/doomsayer.md` | `087a1368dee9f11adc58f33dca18384303eeba406ed6e5549731f49e6b375d1c` |
| `docs/plans/mythrill-class-reconstruction/classes/oracle.md` | `e51f610e720b92f138111d8da51445c8f65a4250f726b53eb9e88dbb12a87c68` |
| `docs/plans/mythrill-class-reconstruction/implementation/evidence/RI-5-doomsayer-oracle/CONTENT-LOCK.md` | `c3e8f7b02164966806fed0e40728a5ac5b9273266cf6cf55c2ba1220050f41e4` |
| `docs/plans/mythrill-class-reconstruction/implementation/evidence/RI-5-doomsayer-oracle/CONTENT-LOCK.json` | `c953506465bc26e7d1a80a2d4c3b82eaefbb821fef33aef23238207e68947403` |
| `docs/plans/mythrill-class-reconstruction/implementation/evidence/RI-5-doomsayer-oracle/CARRY-FORWARD-shared-wizard-view.md` | `2b1030b19a3e3718d2d3e99e1bd9620f86b0af8bb39dab0b930a461e50af2bb0` |

## Manual limits and unresolved dependencies

- No automatic calamity/forecast lifecycle, Havoc gain/spend, damage, ward, movement, benefit or expiry execution.
- No dice replacement, reroll, banking or reuse in either class.
- No automated combat, balance or three-turn numerical simulation was claimed.
- No automatic migration, class change or duplicate character creation from legacy Harbinger or historical Oracle.
- No account/cloud persistence claim. Guest-local versus account/cloud remains unverified.
- Shared Plaguebringer wizard/view defects remain carry-forward; see [CARRY-FORWARD-shared-wizard-view.md](CARRY-FORWARD-shared-wizard-view.md).
- Native heritage pairs remain recommendations pending approval; no heritage edge is implemented.
- `check-class-structure` still fails on pre-existing Fate Weaver, Gambler, Deathcaller, Lichborne and Chaos Weaver files; the two new data files pass the same check.
- `validate:talent-trees` cannot validate the CR1 wrapper export shape and reports it as legacy for several accepted classes; the actual node/rank/gate behavior is covered by the integration and consumer suites.
- Sol acceptance is not claimed. Broad review remains deferred until the implementation batch is complete.
- No commit, push or deploy was performed.
