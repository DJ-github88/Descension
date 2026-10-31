# RI-8 — Inquisitor + Spellguard + Toxicologist implementation evidence

**Date:** 2026-10-28  
**Status:** implementation complete and locally verified; retained legacy roster content, explicit progression and full content locks added. Plaguebringer RI-8 work was preserved and not reopened. No commit, push or deploy.  
**Content lock:** [CONTENT-LOCK.md](CONTENT-LOCK.md) and [CONTENT-LOCK.json](CONTENT-LOCK.json)  
**Browser witness:** [browser-results.json](browser-results.json)

## Scope and reconciliation

This cohort completes the remaining RI-8 classes in the documented order: Inquisitor, Spellguard and Toxicologist. The approved roster, master index, decision register, completion ledger, existing class audits/dossiers, repository state and the preserved Plaguebringer lock were reconciled before editing. The three classes already had authored spell libraries, three 50-point talent trees, resource systems, guides, HUDs and native access; this batch adds the missing explicit progression policy/manifest layer, integration tests, full content locks and verification.

No class was rebuilt, truncated, renamed or converted. No legacy ID, authored record, native list, resource key or save was migrated. Plaguebringer's 46 optional records, two unslotted passives, 57 nodes and 150 ranks remain unchanged. The separate Minstrel Combat record decision remains bounded to its approved builder/resolver records and was not reopened; Argon's compatibility findings were not used to authorize combat execution or broad schema changes. Sol's comprehensive review remains deferred until the full class batch is complete.

| Class | Authored spells | Pools (L1…L10) | Trees | Nodes | Ranks | Resource |
|---|---:|---|---:|---:|---:|---|
| Inquisitor | 46 | 8/6/4/4/4/4/4/4/4/4 | 3 | 57 | 150 | Authority |
| Spellguard | 48 | 8/6/4/4/4/4/4/4/4/4 | 3 | 58 | 150 | Arcane Energy Points |
| Toxicologist | 50 | 8/5/6/4/4/4/4/4/4/4 | 3 | 54 | 150 | Vials + Contraption Parts |

Every class now exposes `progression.policy` with three starting picks, one optional pick per level, earlier unchosen pools legal, no core grants, no random starting assignment and no automatic top-up. Existing known spells are not rewritten. Spellguard's two weakness passives and Toxicologist's three weakness records remain catalogue-only/unslotted.

## Shared resource fixes included

The existing `utils/characterResourceSnapshot.js` remains the source of truth for effective attributes and maximum health/mana. This batch added consumer fixes only:

- `coreSlice.js` now persists snapshot maxima on character creation instead of the placeholder 50/50 HP and 25/25 MP values.
- `CharacterPanel.jsx` recomputes the vitals snapshot when ancestry/base provenance arrives, preventing a stale pre-hydration maximum.
- `CharacterStats.jsx` uses the same snapshot maxima instead of its own derived maximum for the view.
- `characterResourceAgreement.test.js` now covers RI-8 Inquisitor Tallyn, Spellguard Korr and Toxicologist Briaren fixtures in addition to the prior Merryn, Tessic and Nethien cases.

The live browser witnesses ended with persisted resources, roster cards and the character view in agreement after inventory hydration. The final values reflect the live `encumbered` inventory state; the creation snapshot itself was taken before that state was hydrated, so the final maxima are lower than the unencumbered creation maximum for the same characters.

## Exact changed paths and SHA-256

| Path | SHA-256 |
|---|---|
| `vtt-react/src/data/classes/inquisitorData.js` | `72212b3d6bdc3087679fe42088d75534066437b2a120ee488a23df380d30e28a` |
| `vtt-react/src/data/classes/spellguardData.js` | `3b1e01b76db7d028e6bf1f148f8b2b48b0f91e19a1207dca4c4f2d0e959e548c` |
| `vtt-react/src/data/classes/toxicologistData.js` | `0d25b0092dc843ac579b42442a3c101205c0872e47fb3c6a44f8470b23b648fd` |
| `vtt-react/src/data/classes/__tests__/inquisitorIntegration.test.js` | `3f7d5ec02058c286b26b6308c019d4e9009ad1b9b4798fd656d4751db8da0151` |
| `vtt-react/src/data/classes/__tests__/spellguardIntegration.test.js` | `714641ee2fc17ec4e7d5e9c2b5fa5aede5445f60a3fa5cf15800d39d2aa6195e` |
| `vtt-react/src/data/classes/__tests__/toxicologistIntegration.test.js` | `ab4429f19cc9c998f386c8e68c68cefae10b0cfb7948aed5e88a4bc1a0645294` |
| `vtt-react/src/data/classes/__tests__/ri8RosterStoreIntegration.test.jsx` | `4e5288217c9229b1fc65f5bf0304507a0f242e845072c7b6cad58ff79cf11e8e` |
| `vtt-react/src/store/characterSlices/coreSlice.js` | `1fd2a1ca3b61fc67919b33141b16b73d6a11c321fffbf8bfa37835edfcd4d817` |
| `vtt-react/src/components/character-sheet/CharacterPanel.jsx` | `734357c8df16a5b9378cc246994876bfa6d1af4d261738f249ed70939d4042dd` |
| `vtt-react/src/components/character-sheet/CharacterStats.jsx` | `bc15ce4d05974048edbd3ced54a237e8c272c915b472413cb60ca29434364e0b` |
| `vtt-react/src/utils/__tests__/characterResourceAgreement.test.js` | `f33180e7a96dedf26d3ae0bb173df9dbd306322b2c325271e884f653eae0fff4` |
| `vtt-react/src/components/modals/__tests__/LevelUpChoiceModal.test.jsx` | `c7aa862c9eb49a42ed9a3872df6fc5235eb06896a53129535d91b011058f71be` |
| `docs/plans/mythrill-class-reconstruction/00_README_AND_MASTER_INDEX.md` | `519b6e1b4002ebcdb22a0c1b51f59a33b259c4a5952b3e1c25acfb35980d6adf` |
| `docs/plans/mythrill-class-reconstruction/26_COMPLETION_AND_CONTINUATION.md` | `7dd15d0674a996959913e2d1c83a8d63443622396e31d964e9d02462047e7dc5` |
| `.../RI-8-inquisitor-spellguard-toxicologist/CONTENT-LOCK.md` | `2e56660076cef108b516c93e547e0524b55d10ca9fecfe0531a66034d1212ed4` |
| `.../RI-8-inquisitor-spellguard-toxicologist/CONTENT-LOCK.json` | `93069aaaa38de8a80bf84b6ee477f5a2bbf1582dd8402c942f756357dd5efc30` |
| `.../RI-8-inquisitor-spellguard-toxicologist/browser-results.json` | `dd1a44077ad4d224caf25dd2be96b49ef3955969cc767e7215c4b354949a3577` |
| `.../RI-8-inquisitor-spellguard-toxicologist/guest-roster-before.json` | `76480025607a1d52d364bfba8328c641590129476f28d8c5506ddddc77516791` |
| `.../RI-8-inquisitor-spellguard-toxicologist/inquisitor-roster.png` | `4d4b868f7acefd717bd4d997024bbb57b7f703b842f99688683815cc766eb202` |
| `.../RI-8-inquisitor-spellguard-toxicologist/spellguard-view.png` | `b114e43c205f393c4fb909dcc45ac8e711954140f79c1116a1d28ed6a2dd66e7` |
| `.../RI-8-inquisitor-spellguard-toxicologist/toxicologist-view.png` | `ac0cb9ee4dd2ac739973bf4756123e7ad809cf6a7268d9aee64a87948e173c6a` |
| `.../RI-8-inquisitor-spellguard-toxicologist/focused-tests.log` | `fcb4b7191456f1d7ce85e3802fe28f285081580f03e213fa01d404e932d5331c` |
| `.../RI-8-inquisitor-spellguard-toxicologist/eslint-results.txt` | `bb9f36261a76ab276ad07c907dda1ea5415fc1e1b7301b46fb6761f73e67fd78` |
| `.../RI-8-inquisitor-spellguard-toxicologist/build.log` | `ed726d11a97ba75c5d36f9380754a3aa4a5c71b60bc283ccfb5b7f1879454c86` |

`REPORT.md` is excluded from its own table. The already-dirty shared files `coreSlice.js`, `CharacterPanel.jsx` and `CharacterStats.jsx` contained concurrent RI-7/character work; only the small snapshot/provenance blocks described above were added by this batch. The three Plaguebringer RI-8 source files and lock were not modified.

## Verification

### Automated

| Check | Result |
|---|---|
| Focused RI-8 + prior cohort batch | **29 suites / 288 tests passed** |
| Scoped ESLint (`npm run lint`) | **exit 0, 0 errors** |
| Production build (`npx craco build`, detached) | **exit 0, “Compiled successfully.”** |
| Content-lock source hashes | **24/24 match current files** |

Evidence: [focused-tests.log](focused-tests.log), [eslint-results.txt](eslint-results.txt), [build.log](build.log).

The legacy random-option control in `LevelUpChoiceModal.test.jsx` now uses Pyrofiend instead of Minstrel, because Minstrel has an explicit RI-6 progression policy that exposes its authored options. This is a test-only alignment; no Minstrel content, resource or Combat-record behavior was changed. The RI-8 integration suites, RI-8 progression/store suite, shared-resource agreement suite, catalogue consistency, resource contracts, HUD suites, talent tree, class detail, prior RI-6/RI-7 suites and the P6 production save suite all passed.

### Live browser round-trips

Playwright against the running app at `http://localhost:3000`, 1280×800:

| Class | Witness | Id | Result |
|---|---|---|---|
| Inquisitor | Iron Proof, Tallyn Human, Scout | `char_1793174941451_78tjufucd` | Created, saved, viewed, reopened in edit, saved again |
| Spellguard | Aegis Proof, Korr Solari, Pilgrim | `char_1793176070451_mr6g9pda3` | Created, saved, viewed, reopened in edit, saved again |
| Toxicologist | Vial Proof, Briaren Florae, Ranger | `char_1793176319033_svawfh6cw` | Created, saved, viewed, reopened in edit, saved again |

All three reopened with `Starting Spells — 3 of 3 chosen` and `Ability Scores — All points spent`. Persisted and view/roster agreement:

| Class | Known spells | Base stats | Resource | Persisted / view / roster |
|---|---|---|---|---|
| Inquisitor | `inq_iron_interrogation`, `inq_detect_corruption`, `inq_null_salt_ward` | 15/7/5/5/5/5 | `authority` 0/8 | HP 37/37, MP 25/37, AP 3/3 |
| Spellguard | `spg_aegis_ward`, `sg_void_siphon`, `sg_entropic_aegis` | 15/5/5/5/5/5 | `arcaneEnergyPoints` 0/100 | HP 50/64, MP 25/47, AP 3/3 |
| Toxicologist | `tox_acid_unlocking`, `tox_apply_poison`, `tox_antidote` | 15/5/5/5/5/5 | `toxinVialsContraptions` vials 4/4, parts 5/5 | HP 22/22, MP 25/29, AP 3/3 |

Ancestry and origin survived the second save: Tallyn `desperate_will_human` with Mind/Fog/Quill picks; Korr `vault_breath_solari` with Breath/Senses/Pulse picks; Briaren `branch_arm_brawn_florae` with Body/Sense/Will picks. The guest character **Kira Goldmane** was preserved; the original guestRoster and activeId were restored from `guest-roster-before.json` after the witnesses were deleted.

### Desktop and narrow checks

- 1280×800: Inquisitor, Spellguard and Toxicologist class detail pages loaded with resource tabs; Inquisitor and Toxicologist specializations rendered; no horizontal overflow.
- 390×844: all three class detail pages loaded with no horizontal overflow; the Toxicologist character view and roster also had no horizontal overflow.
- Console: 0 class-runtime errors. The known unrelated errors remain Firebase user-map permissions and the unavailable local `localhost:3001` socket fallback.

## Known limits

- Guest/local persistence only; authenticated cloud persistence, sync conflict handling and multi-device behavior were not tested or claimed.
- Manual/class content only: no combat automation, damage/condition execution, balance validation, migration, deployment, commit, push or Sol acceptance is claimed.
- Inquisitor Authority, Spellguard AEP intake/venting and Toxicologist vial/part expenditure are tracked through their existing contracts but do not auto-run spell effects or infer damage.
- The retained trees keep their existing 5-point-ladder layout; no new level/point gates were authored for these three classes in this cohort.
- Spellguard preserves the legacy `aep` vs `arcane_energy_points`/`arcaneEnergyPoints` key family rather than silently canonicalizing it.
- The final browser maxima reflect the live encumbered inventory state. The creation snapshot is unencumbered; the inventory hydration changes the maximum until the persisted resources and roster agree with the live state.
- No commit, push or deploy was performed; Sol's comprehensive review remains deferred until the full class implementation batch is complete.
