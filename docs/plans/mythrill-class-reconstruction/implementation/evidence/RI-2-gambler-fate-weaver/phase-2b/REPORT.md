# RI-2 Phase 2B — Fate Weaver and Augur disposition return

**Status: Implementation complete; focused verification passed; independent review deferred.**

Fate Weaver is authored, selectable development content and manually usable. It is **not automatically admitted** to combat execution, persistence, migration or settlement. The Augur is preserved by an explicit 380-row data-only disposition inventory; no legacy Augur character is converted. No commit, push or deployment was authored by this task.

## Capability statement

| Capability | Gambler | Fate Weaver | Augur |
|---|---|---|---|
| Authored complete package | Yes | Yes | Preserved legacy class |
| Selectable development class | Yes | Yes, qualification-gated outside native access | Legacy selection unchanged |
| Manually usable at the table | Yes | Yes | Yes, unchanged |
| Automatically admitted/executed | No | No | No |
| Legacy save converted | No | No | No |

Fate Weaver has **no native heritage access** and no heritage edge. The native registry remains **105** relationships. All non-native creation pairs remain qualification-gated; existing `ClassAcquisitionEditor` evidence is the selectability path. No global access policy was weakened.

## Complete Fate Weaver manifest

`complete-manifest.json` contains all 96 authored records, all 96 projected spells, all three trees, all 54 nodes and rank values, progression, resource rules, acquisition records, provenance and all 380 Augur dispositions.

| Package | Actual |
|---|---:|
| Optional records | 40: four at each level 1–10 |
| Core records | 2 |
| Talent actives | 6 |
| Ranked passive records | 48, three ranks each |
| Unique authored records | 96 |
| Active records | 48 |
| Talent nodes | 54 across three trees |
| Rank capacity | 50 per tree, 150 total |
| Character talent budget | 5/level, maximum 50 |
| Catalogue-generated spells | 114 = 96 authored + 18 universal |

Tree IDs are `covenant`, `severance` and `tapestry`. The exact signature/capstone pairs are:

| Tree | Signature node → grant | Capstone node → grant |
|---|---|---|
| Covenant Weaver | `cr1_fate_weaver_covenant_weaver_signature` → `cr1_fate_weaver_witnessed_covenant` | `cr1_fate_weaver_covenant_weaver_capstone` → `cr1_fate_weaver_threefold_compact` |
| Thread Cutter | `cr1_fate_weaver_severer_signature` → `cr1_fate_weaver_sever_borrowed_crown` | `cr1_fate_weaver_severer_capstone` → `cr1_fate_weaver_sever_throughline` |
| Tapestry Keeper | `cr1_fate_weaver_tapestry_keeper_signature` → `cr1_fate_weaver_reanchor_tapestry` | `cr1_fate_weaver_tapestry_keeper_capstone` → `cr1_fate_weaver_grand_relay` |

The focused tests accept a signature only at level 3 with 10 same-tree points and both predecessors fully ranked. They refuse level 2, 9 points, partial predecessors and cross-tree points. They accept the capstone only at level 10 with 45 same-tree points, the fully ranked predecessor and the signature; level 9 and a missing signature are refused.

Every record and node carries `classId`, `rulesetVersion`, `authoredOnly:true`, `executionEnabled:false`, `applicationMode:'manual-tabletop'`, empty `automatedCapabilities` and a manual-only notice.

## Resource boundary

`Fate Links` is the separate managed resource type `fate-links`; it never aliases legacy `threadsOfDestiny`, Fortune, Benediction, Malediction or Omen Debt.

- Exactly three tokens in `free`, `reserved` or `recovering`.
- At most three links with distinct endpoints and recorded consent.
- 60 ft default formation range.
- One or two uses; expiry recorded explicitly.
- At most three points of original assigned damage after mitigation per transfer.
- No recursive transfer, derived damage, reconnect/initiative refill, fourth tree or second bank.
- Expired tokens recover only on a completed long rest; consent withdrawal ends the link.
- HUD is read-only and starts uninitialized. Owner view shows recorded links; observer view hides endpoint identities and private actor references.

## Actual consumer behavior

- `Step1CoreDraft` now exposes both **Gambler** and **Fate Weaver**. The Phase 2A Gambler map omission was corrected during this phase. Fate selection renders the acquisition/current-interface panel and the `Fate Weaver Calling Chosen` state.
- `LevelUpChoiceModal` maps Fate Weaver. Optional picks remain one-per-level; cores, signatures, capstones and ranked passives are not offered as optional picks.
- Catalogue, detail, spell pools, specializations, resource guide, spell library and level-up consumers are registered. All 96 authored records remain distinct from the 18 universal catalog entries.
- The actual Codex detail route renders Overview, Tradition, Resource System, Specializations and Spells. All three trees render 18 nodes each; the header reports 11 authored rows for Fate, and the help copy now defers to each tree's authored gates instead of the obsolete generic “30 in-tree” claim.
- `SpellLibrary` and `useClassSpellLibrary` retain canonical Fate grant/passive identities; no second `talent-spell-*` copy is generated.

## Augur disposition

`augur-disposition.json` is the exact machine-readable 380-row table. `AUGUR-DISPOSITION.md` is the summary.

| Source type | Rows |
|---|---:|
| Active spells | 45 |
| Spell-pool entries | 44 |
| Talent nodes | 57 |
| Talent-rank rows | 150 |
| Materialized talent grants | 57 |
| Subrace variants | 11 |
| Class alias | 1 |
| Heritage edges | 9 |
| Resources | 3 |
| Specializations | 3 |
| **Total** | **380** |

Every row is `keep` with `destinationClassId:'augur'`, `destinationId:null` and `automaticConversion:false`. No `adapt` destination is invented because no exact authored Augur→`cr1_fate_weaver_*` crosswalk exists. All Auspex, Ill Omen, sign-reading/material-focus and Hierophant content is preserved rather than discarded for a tree quota.

The 11 variants, the `Nereid Myrathil Augur` alias and the `deepling_myrathil` path remain. All 9 heritage edges remain: `skald_human`, `vashir_astril`, `silath_astril`, `kessen_neth`, `marked_vreken`, `korr_solari`, `deepling_myrathil`, `shoreling_myrathil`, `riverling_myrathil`. The legacy resources remain `omens`, `benediction`, `malediction`.

## Legacy and compatibility

- `getReconstructionCompatibility('augur')` retains `merged-design`, `legacyResolutionRetained:true`, `automaticConversion:false` and the Fate Weaver successor label only.
- Gambit retains its 122-row keep table, split successors and no automatic conversion.
- `CLASS_COMPATIBILITY_ALIASES` is unchanged.
- Gambit, Augur, Nereid Myrathil Augur and Chaos Weaver data, IDs, trees, variants and resources were not rewritten. The 380 rows are appended data, not migration.
- Heritage/catalogue counts are **24/24/27/24/24**, **600** combinations and native **105**.

## Verification

`jest-results.json`: **29/29 suites, 328/328 tests passed**. The recorded set covers the Fate package/gates, Fate HUD, Gambler regression/HUD, Augur dispositions, all guides, heritage/roster/edges, class icon/count tests, catalogue/detail/tree, resource contracts/banks, class racial exemptions, spell audit, Deepling, creation, level-up, spell library, Augur resources, capability consumers and class access.

Command shape: `CI=true; npx react-scripts test --watchAll=false --runInBand --silent --json --outputFile=<phase-2b>/jest-results.json --runTestsByPath <the 29 recorded suites>`.

`eslint-results.json`: **31 scoped files, 0 errors, 98 warnings, no diagnostic identity introduced relative to HEAD**. Existing warnings remain in the shared seams; no cleanup was claimed as RI-2 work. `task-changes.json` records the 31 application paths with entry/current SHA-256 values; new paths entered as `absent`. `current-hashes.json` records 62 changed paths, 27 observed protected/concurrent deltas and scoped whitespace exit **0**. Whole-file hashes preserve concurrent hunks and do not attribute every working-tree change to RI-2. A concurrent commit (`8d23e50b`) landed after the entry capture and includes intermediate RI-2 files; entry remains `f9527d31`. That commit is not an acceptance or a task-authored commit.

`browser-results.json` plus `fate-detail-1280.png`, `fate-detail-360.png` and `fate-tree-360.png` record the actual Codex route at **1280x900** and **360x800**:

- Fate Weaver class detail, manual overview and resource guide.
- Explicit uninitialized `Fate Links` preview and the manual-only token/link terms.
- Covenant Weaver, Thread Cutter and Tapestry Keeper: 18 nodes each.
- 1280px and 360px class detail and 360px tree checks have **no document horizontal overflow**.
- Zero page/console errors; one existing `NO_ACTIVE_SCOPE` save warning outside an active character scope.

The detached production build completed with **Compiled successfully** and exit **0**.

## Exact limitations

- `/account/characters/create` still redirects unauthenticated browsers to `/`. Creation/selectability is covered by the mounted `Step1CoreDraft` test, not authenticated browser persistence.
- The level-up class map is exercised by the shared `LevelUpChoiceModal` regression; no Fate-specific rendered modal assertion was added, and optional-grant accounting is covered by the shared modal and store tests.
- `/game` at 360px remains PhoneGate-blocked; phone-width evidence is limited to the public class-detail/tree routes.
- No automated combat, token creation, damage transfer, expiry, consent enforcement, persistence or migration is claimed. Those remain Main HeadQ/Combat HQ work.
- No playtest/balance certification, final roster acceptance or independent review is claimed.
- No content-lock rows are missing. The remaining gaps are engine capabilities, not authored Fate or Augur rows.

## Remaining Main HeadQ dependencies

- **CR-A1:** reviewed typed-term identity and admission/serialization.
- **CR-R1:** authoritative AP/resource planning and refusal.
- **CR-D1:** trusted link/token ownership, consent records and private endpoint projections.
- **CR-E1:** damage partition/ordering and ward application.
- **CR-E2:** exactly-once expiry/recovery and long-rest settlement.
- **CR-L1:** authoritative turn/rest identity, deduplication and reconciliation.

## Scope disclosure

The 380-row manifest is isolated in `data/classes/augurDispositions.js` so legacy inventory generation does not bloat `fateWeaverData.js`. It is data-only, not a Rules/Integration module or adapter. The new manifest, its test and the Fate creation test are recorded as new Phase 2B paths with entry state `absent`. `RulesPage.jsx` received the necessary Fate lazy-loader entry alongside the approved Gambler entry; `TalentTreeContent.jsx` received only the class-accurate tree header/help copy. There is no new server, scheduler, private ledger, opcode engine or automatic migration.

**Stop here for independent Phase 2B review.** No commit, push, deploy, native-edge approval or final acceptance was performed by this task.
