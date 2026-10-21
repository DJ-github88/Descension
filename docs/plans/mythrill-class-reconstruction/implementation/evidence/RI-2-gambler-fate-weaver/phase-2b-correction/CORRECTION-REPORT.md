# RI-2 Phase 2B Fate Weaver — bounded correction report

**Disposition: corrections implemented and focused verification passed; independent re-review required. This is not an acceptance claim.**

Baseline: HEAD `9e653fc4`. Review basis: `ri2-phase2b-independent-review-block-20261021` and the authoritative six-record payload manifest `classes/manifests/fate-weaver-review-r1.json`. The review-era `phase-2b/` evidence was treated as immutable; all new evidence is written under `phase-2b-correction/`.

## Findings and corrections

| Review finding | Correction | Primary paths |
|---|---|---|
| Mandatory R1 payloads were replaced by different mechanics: Tie lacked transfer/60 ft/next-turn expiry, Cut refunded immediately, Covenant reserved one token, Sever priced a free token, recovery used long rest. | Restored the R1 typed arguments for Tie the Thread, Cut Clean, Read the Bond, Witnessed Covenant, Sever the Borrowed Crown and Reanchor the Tapestry. Recovery is `next-caster-own-turn`; long-rest, reconnect and initiative refresh are disabled. | `fateWeaverData.js` |
| Validator accepted duplicate token IDs, unknown states and unconsented/unreserved/no-expiry links. | Replaced the validator with explicit token/link/consent/reservation/use/expiry/partition checks. It reports invalid state and never repairs it. | `fateWeaverData.js` |
| Echoed Oath granted extra uses over the hard maximum; Broad Shoulders re-mitigated transferred damage; Throughline Precision added damage to a no-damage capstone; Broken Crown still referenced removed Sever suppression; Eternal Thread granted long-rest token recovery. | Reauthored all five passives as bounded check/save bonuses. Extra uses, re-mitigation, capstone damage, suppression and extra token recovery are excluded in the authored text. | `talentTrees/fateWeaver.js` |
| Level reduction routed Fate pruning to Chaos-Weaver-only logic; signatures/capstones and above-level optional picks survived `updateLevel`, `adjustLevel` and class/level changes. | Added Fate pruning (5 points/level, cap 50, level/same-tree/prerequisite/rank gates) and `reconcileFateWeaverTalents`, which removes invalid ranks and grants, filters above-level optional spells, and refreshes derived passive views. Wired all three level-change paths. | `progressionSlice.js`, `infoSlice.js` |
| Repeated optional picks in the same level were accepted. | Added an atomic Fate level-up guard: one optional pick per level, legal pool level, not already known, and no mutation on refusal. | `progressionSlice.js` |
| Normal class spell categories did not generate Fate levels 3/5/7/8/9/10. | Generalized the Gambler category fill to Fate Weaver with canonical `fate weaver_level_N` IDs while preserving Gambler IDs. | `classSpellCategories.js` |
| Augur disposition omitted live `omenDebt` and managed `benediction-malediction` resources. | Added both resource IDs. Row count is now 382 with five resource rows; all rows remain `keep`/`automaticConversion:false`. | `augurDispositions.js` |
| Resource guide, tooltip and projection still described long-rest recovery and legacy severity. | Updated guidance, tooltip and projection fallbacks to own-turn recovery and the R1 sever price. | `fateWeaverResourceGuide.js`, `classResources.js`, `fateWeaverData.js` |

The three-thread economy, three-link cap, manual/execution boundary, three trees, 96 authored records, 40 optional records, six talent actives and 54 nodes are unchanged.

## Verification

- Jest correction batch: **11/11 suites, 112/112 tests passed** (`jest-correction.log`). Suites: Fate integration, Fate corrections, Fate HUD, Augur dispositions, Augur resource contract, Augur resource bar, Gambler integration, Gambler HUD, class resource contracts, spell-cast resource contracts and the shared level-up modal.
- Retained Sol probe harness: **16/17 passed** (`sol-harness.log`). The only failure is the intentional old-artifact equality check: it compares current authored records to the immutable `phase-2b/complete-manifest.json`. Satisfying it would require mutating review-era evidence or reverting the corrections. The current records are instead captured in `complete-manifest.json` in this folder.
- ESLint on the 13 correction paths: **0 errors, 1 warning** (`eslint-correction.json`). The warning is the pre-existing UTF-8 BOM in `fateWeaverData.js`; the newly introduced `no-loop-func` warning was removed before the final run.
- Detached production build: **Compiled successfully, exit 0** (`build-correction.log`, `build-correction.exit`).
- Correction artifacts: `complete-manifest.json` (96 authored records, 96 projected spells, three trees, 54 nodes, progression/resource/acquisition/provenance data) and `augur-disposition.json` (382 rows).
- Source diff: `correction.diff`. New correction test: `fateWeaverCorrections.test.js`.

## Source hashes (SHA-256)

```
228097809b8e3e689d17afa319a9d941d06848cad96d128ed2ab0ecdc2a53054  vtt-react/src/data/classes/fateWeaverData.js
8c069081dc21dd443e8b525adeaaab4a48ad8578ba9d2b5916d5b4fe2d513417  vtt-react/src/data/talentTrees/fateWeaver.js
e910dfc293e61c8985038657587a333eb889efb437e50f50c7782a7f0bdf8cbd  vtt-react/src/data/classSpellCategories.js
45b439e1350140937bbdcdb45eb3ed17ccb3f81afbac9b9c7faf7b2206de0ad7  vtt-react/src/store/characterSlices/progressionSlice.js
3e7fd2cba2c2d44c2cbd0cff8f89f8f73455e659d2d2fb3e5d0c7993ce6ca3cc  vtt-react/src/store/characterSlices/infoSlice.js
443909deb056a1e7eff2e727223695e1aa7bb0a9ec608e0e079766403c65ef7d  vtt-react/src/data/classes/augurDispositions.js
bb2c08d07ebe33521aa9bfeeb685e7c6f2e75f117592eaf7f0cc92d3c6c77f15  vtt-react/src/data/resourceSystems/fateWeaverResourceGuide.js
c814b86f895845087bb03ccd76097e7abfd80d0d0edeb9df75bc4cbd884eb0e4  vtt-react/src/data/classResources.js
538d3335f6ddbdd2b2e6b2a45b36c8bb77c54da39c2d2a3ef4e8d03056d5855e  vtt-react/src/data/classes/__tests__/fateWeaverIntegration.test.js
63638a068d8473643ce0ba417a7ea53ad8b95357bee74d9031afb3c54ba762eb  vtt-react/src/data/classes/__tests__/fateWeaverCorrections.test.js
d7e8f2a484153c46a935eacca58196e900e4567a5c507760f8d571453d126cdc  vtt-react/src/data/classes/__tests__/augurDispositions.test.js
b2c1ab16abc46ab6df6f4e6f82482b7e2edad88ec02499992ad420dd3fdaf1f3  vtt-react/src/data/classes/__tests__/gamblerIntegration.test.js
47118c0e25dc552c56696569acf24a5bcb7ea3175f3df241a9f1c00c206454f6  vtt-react/src/components/hud/__tests__/FateWeaverResourceDisplay.test.jsx
```

## Limitations

- The old `phase-2b/complete-manifest.json` is intentionally unchanged, so the retained harness equality probe fails by design. Current truth is the correction manifest.
- Capstones retain a once-per-completed-long-rest use cooldown. This is a capstone cooldown, not the removed rest-based token refill; Eternal Tapestry still exposes its authored once-per-long-rest recovery utility. No resource rule performs a long-rest refill automatically.
- `handleLevelUpChoice` requires a legal optional `spellId` for Fate Weaver. Stat-only level transitions that do not carry a spell choice must be checked against the live modal flow before re-review.
- No authenticated browser route, combat automation, persistence, migration or playtest acceptance is claimed in this correction. Build success is compilation only.
- No commit, push or deploy was performed, and unrelated worktree changes were preserved.
