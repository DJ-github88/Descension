# RI-4 — Druid + Hunter implementation evidence

**Date:** 2026-10-27  
**Status:** implementation complete and locally verified; manual tabletop only. No commit, push or deploy.  
**Ruleset:** `cr-review-r1`  
**Content lock:** [CONTENT-LOCK.md](CONTENT-LOCK.md) and [CONTENT-LOCK.json](CONTENT-LOCK.json)

## Scope

Implemented the next unimplemented approved cohort in the documented roster order: **RI-4 Druid + Hunter**. The content lock was incomplete at the dossier level, so this task authored the complete level 1–10 pools, three 50-point trees, signatures, capstones, passives, resource rules, guides and HUDs before registering the classes.

Preserved and not converted:

- All legacy Shaper and Apex data, spells, trees, resources, IDs and saved characters.
- Existing Doomsayer, Oracle, Gambler, Fate Weaver, Deathcaller and Lichborne records.
- `shaper → druid` and `apex → hunter` compatibility rows remain explicit successor-name mappings with `legacyResolutionRetained: true` and `automaticConversion: false`.
- No native heritage edge is registered for either class; dossier native pairings remain recommendations only.

## Complete content lock

| Class | Core | Optional | Signatures | Capstones | Passives | Unique records | Trees | Nodes | Ranks |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Druid | 2 | 40 | 3 | 3 | 48 | 96 | 3 | 54 | 150 |
| Hunter | 3 | 40 | 3 | 3 | 48 | 97 | 3 | 54 | 150 |

Druid resource: `druid-body` (Anatomical Loadout). Hunter resource: `hunter-evidence` (Quarry & Evidence). Both are uninitialized/read-only until the table records real state. Every record and node is `authoredOnly: true`, `executionEnabled: false`, `applicationMode: 'manual-tabletop'`, `automatedCapabilities: []`.

## Exact changed paths and SHA-256

| Path | SHA-256 |
|---|---|
| `vtt-react/src/data/classes/druidData.js` | `4ad2d6d6ba199b234712fed0538e43ff5e3e2ff8e6c7016fe4cd28ecb377744d` |
| `vtt-react/src/data/classes/hunterData.js` | `22a520dc748c54c528b6e6db589d61cd1a0d576fe22a2d9bf403daa03c089cd3` |
| `vtt-react/src/data/talentTrees/druid.js` | `66a81e9697b76e5be85d2e34ab4dabaafadd9b31731131d4c211d3feb123c2e9` |
| `vtt-react/src/data/talentTrees/hunter.js` | `50a961e777f39aa5b439c10f3c6470fa94079d9caa00718499c763b9462cd2c8` |
| `vtt-react/src/data/resourceSystems/druidResourceGuide.js` | `c0747d0f0a6ee0c2c1ce8cf1bc0b37921d741e4a69c211fb6b62b7979865bf95` |
| `vtt-react/src/data/resourceSystems/hunterResourceGuide.js` | `6417eb2a8bb9cb232b461c41ee3b8e7e122afed7f917b81900ee2e066aa9c57c` |
| `vtt-react/src/components/hud/DruidResourceDisplay.jsx` | `50cd9eebaa176d8d4a0e86f44d15504cd03b34ff3ff896dfe47d47e75e57d0bd` |
| `vtt-react/src/components/hud/HunterResourceDisplay.jsx` | `24afba88888c9582b54e62ef6578a02cb39fa8906776227e49f9e80b9763f701` |
| `vtt-react/src/data/classes/index.js` | `d6a5a6d6c554a116bcea9580f78839f40ae486b36636d05e6501e83826c43aaf` |
| `vtt-react/src/data/classes/classDisplayData.js` | `8fa321ff698b1ad4a076ce316ae477e61981b9c41da4289b793fe7b97b3c6fe3` |
| `vtt-react/src/data/classSpellGenerator.js` | `59f03bbfc8c4995eccfae3ddd502ca085a1e6106781dedd9b4a9f6f6ed76d156` |
| `vtt-react/src/data/classSpellCategories.js` | `d38258f620937b1d9c3eea90e742ec30d1e030bfdd39f48210f9d14d9b032962` |
| `vtt-react/src/data/talentTreeData.js` | `85ccfc296ecede859e6aaecbb0a2554c9e1e06559a2fb33fd625e4e3b213f077` |
| `vtt-react/src/data/classResources.js` | `8367465897fc6afdf06bc289285b7e0708d898b8d4374377d2bfa241fa1b2583` |
| `vtt-react/src/data/classResourceContracts.js` | `72248235863ebcd6447f61fd0608b78c52eeb9394adcedc9bcd47db1c11bd93b` |
| `vtt-react/src/data/classResourceAliases.js` | `bb9f07e4f7ad09d760e7f08381dc33e4cabcefd0efded63c6b0d6c6181ca9874` |
| `vtt-react/src/data/resourceSystems/index.js` | `f6afa5400c8353f58482f39277c36f828528748154fed0d38ab250b888b6d71b` |
| `vtt-react/src/components/character-creation-wizard/steps/Step1CoreDraft.jsx` | `fa712950d60b4aa068c23e728c232972616476fa7ca52e51b2f03cf61b86a7ee` |
| `vtt-react/src/components/modals/LevelUpChoiceModal.jsx` | `aec9715ebd2048550d2011b5f17318ec0a034db10c8de5137cf8ca1d5075cafb` |
| `vtt-react/src/components/rules/RulesPage.jsx` | `3ea4443b428650ae772f25b3214bfc39b6579669353d0a1a506d3a66f855c77a` |
| `vtt-react/src/components/rules/ClassDetailDisplay.jsx` | `390842d93b13d76210e2680121b30c22528bbb8591dd844304109fabc32e0ffe` |
| `vtt-react/src/components/hud/ClassResourceBar.jsx` | `2fdd0ac64e6ac65ef38f74a49c7ae342d4e431c4c18ba3fc3668f392828a6ae1` |
| `vtt-react/src/components/talent-tree/TalentTreeContent.jsx` | `1016999db13eb091ac542695096af33da221d86a841919e5bc597a17f573b76c` |
| `vtt-react/src/store/characterSlices/progressionSlice.js` | `1cfe5b474765b30888f0daae9d22c61873464e007974a3aafc7bfc219cfea82d` |
| `vtt-react/src/store/characterSlices/infoSlice.js` | `945fdd5c0d373f296b51b53443cd20bb0f7aa497145243a0eac823de3bbce03e` |
| `vtt-react/src/store/characterSlices/coreSlice.js` | `6731902c9d55d69054b1c4d96ff5b92db8ccbbf8dc3523280a4d0e0cf7e0ddc4` |
| `vtt-react/src/data/classes/__tests__/druidIntegration.test.js` | `8da455f4e84c07d3a3e20f038f1af03f39a84b97967c6d4e112378227d34cd19` |
| `vtt-react/src/data/classes/__tests__/hunterIntegration.test.js` | `af5d815bf509a1b15ef1aed580c5f848bae032cea84d3bde7d57257412d43aec` |
| `vtt-react/src/data/classes/__tests__/druidHunterStoreIntegration.test.jsx` | `b891c5cbb24ffc448586f5eacf2dd97eb333629c3bcf481caeba500e15383094` |
| `docs/plans/mythrill-class-reconstruction/implementation/evidence/RI-4-druid-hunter/CONTENT-LOCK.json` | `27c5ec6e99a33eb9ec583aea54197b0c557841b7d6665e507bbee7ec3875a1cc` |
| `docs/plans/mythrill-class-reconstruction/implementation/evidence/RI-4-druid-hunter/CONTENT-LOCK.md` | `9ebc14d76c008dcd0d420d2c0dedc337eda1c6647a5f9c598703773169a82813` |
| `docs/plans/mythrill-class-reconstruction/implementation/evidence/RI-5-doomsayer-oracle/CARRY-FORWARD-shared-wizard-view.md` | `3fb11df872a090b7204869a6a2b8a1ef6a83ba1f9c8df0731897f17098f7a4c1` |

`REPORT.md` is excluded from its own hash table because it is the document being written.

## Shared-system finding and fix

The first Druid create/save flow exposed a shared persistence race: `createCharacter` started the scoped roster write without awaiting it, and the creation page immediately reloaded the roster. The reload could read the previous roster and overwrite the newly created character. `coreSlice.createCharacter` now awaits the scoped roster write before returning. This is a shared persistence correction, not a class-specific workaround. It is recorded in the carry-forward ledger. Both Druid and Hunter create flows passed after the fix.

## Verification

### Automated

| Check | Result |
|---|---|
| Focused RI-4 batch | **39 suites / 334 tests passed** |
| Scoped ESLint | **0 errors**, 92 pre-existing unrelated warnings |
| Production build | **Compiled successfully**, static output generated |
| Content-lock counts | Druid 96/48/48/54/150; Hunter 97/49/48/54/150 |

Evidence files: [focused-tests.log](focused-tests.log), [eslint-results.txt](eslint-results.txt), [build.log](build.log), [browser-results.json](browser-results.json).

The focused batch included the new `druidIntegration`, `hunterIntegration` and `druidHunterStoreIntegration` suites plus the existing class, wizard, talent-tree, class-detail, character-store, resource and persistence suites (`p6CharacterSave.production.test.jsx`). No test was skipped.

**Flaky existing test note:** one intermediate full-batch run hit a single timing/order-sensitive failure in the pre-existing `gamblerIntegration` library-hook test (`known_spells` expected 2, observed 7). The same suite passes in isolation, and the complete batch passed on rerun with 39/39 suites and 334/334 tests. No RI-4 class file is involved in that failure; it is recorded as an existing test stability limit, not a claimed pass for the failed run.

### Live browser round-trip

| Witness | Id | Result |
|---|---|---|
| Druid — Verdant Proof, Skald Human, Scholar | `char_1793091281455_gpzllxro3` | Created, saved, viewed, reopened in editor, updated again |
| Hunter — Gray Proof, Skald Human, Scholar | `char_1793091383367_w4g3vnycd` | Created, saved, viewed, reopened in editor, updated again |

Persisted after the second save:

- Druid: `known_spells` = `cr1_druid_adopt_loadout`, `cr1_druid_recover_self`, `cr1_druid_rending_claw`; base `stats`/`baseStats` = `15/6/6/5/5/5`; resource `druid-body` uninitialized.
- Hunter: `known_spells` = `cr1_hunter_mark_quarry`, `cr1_hunter_take_angle`, `cr1_hunter_press_quarry`, `cr1_hunter_hunters_snare`; base `stats`/`baseStats` = `15/6/6/5/5/5`; resource `hunter-evidence` uninitialized.
- Roster and character view agreed: Druid HP 50/58, MP 19/19, speed 30 ft, 3 spells / 2 trained skills; Hunter HP 50/58, MP 19/19, speed 30 ft, 4 spells / 2 trained skills.
- Edit mode showed `Starting Spells 1 of 1 chosen`, `Ability Scores — All points spent`, the correct heritage/calling/origin and no `Character not found`.

### Desktop and narrow browser checks

- Desktop 1280×800: Druid and Hunter catalogue/detail, Resource System guides, Specializations and roster cards rendered; no horizontal overflow.
- Narrow 390×844: Druid and Hunter detail, character view, roster and Druid edit Step 1 rendered; no horizontal overflow. Resource HUDs showed the explicit uninitialized manual notice.
- Console: only the pre-existing unrelated `Error loading user maps: Missing or insufficient permissions` plus inventory-size warnings. No class-runtime error.

## Known limits

- Manual tabletop only. No automatic transformation/slot/transition/recovery, evidence generation, contact, companion action, path, damage, prevention, movement or expiry.
- Guest/local persistence verified. Account/cloud persistence, multi-device sync and conflict handling were not tested or claimed.
- Native heritage access remains unimplemented; dossier pairings are recommendations only.
- Legacy Shaper/Apex records remain loadable and unconverted.
- No combat automation, balance validation, deployment or Sol acceptance is claimed.
- No commit, push or deploy was performed.
