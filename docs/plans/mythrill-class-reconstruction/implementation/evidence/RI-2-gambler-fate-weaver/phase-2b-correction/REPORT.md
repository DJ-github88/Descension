# RI-2 Phase 2B — Fate Weaver correction return

**Status: BLOCK corrections implemented; focused verification passed; independent re-review required. This is not an acceptance claim.**

Fate Weaver remains authored, selectable development content and manually usable. It is **not automatically admitted** to combat execution, persistence, migration or settlement. The Augur remains a preserved legacy class with an explicit 382-row data-only disposition inventory; no legacy Augur character is converted. No commit, push or deployment was authored by this correction.

The review-era `phase-2b/` artifacts were left immutable. This report, `CORRECTION-REPORT.md`, the corrected content lock, the 382-row disposition and the refreshed manifests are the correction record.

## Capability statement

| Capability | Gambler | Fate Weaver | Augur |
|---|---|---|---|
| Authored complete package | Yes | Yes | Preserved legacy class |
| Selectable development class | Yes | Yes, qualification-gated outside native access | Legacy selection unchanged |
| Manually usable at the table | Yes | Yes | Yes, unchanged |
| Automatically admitted/executed | No | No | No |
| Legacy save converted | No | No | No |

Fate Weaver still has **no native heritage access** and no heritage edge. The native registry remains **105** relationships. No global access policy was weakened.

## Complete Fate Weaver package

`complete-manifest.json` contains all 96 authored records, all 96 projected spells, all three trees, all 54 nodes and rank values, progression, resource rules, acquisition records and provenance.

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

Tree IDs remain `covenant`, `severance` and `tapestry`.

| Tree | Signature node → grant | Capstone node → grant |
|---|---|---|
| Covenant Weaver | `cr1_fate_weaver_covenant_weaver_signature` → `cr1_fate_weaver_witnessed_covenant` | `cr1_fate_weaver_covenant_weaver_capstone` → `cr1_fate_weaver_threefold_compact` |
| Thread Cutter | `cr1_fate_weaver_severer_signature` → `cr1_fate_weaver_sever_borrowed_crown` | `cr1_fate_weaver_severer_capstone` → `cr1_fate_weaver_sever_throughline` |
| Tapestry Keeper | `cr1_fate_weaver_tapestry_keeper_signature` → `cr1_fate_weaver_reanchor_tapestry` | `cr1_fate_weaver_tapestry_keeper_capstone` → `cr1_fate_weaver_grand_relay` |

Signatures require level 3 and 10 same-tree points excluding their own rank; capstones require level 10 and 45 same-tree points with the signature and predecessors fully ranked. Fate pruning enforces the same gates on every level reduction path.

## Corrected resource boundary

`Fate Links` remains the separate managed resource type `fate-links`; it never aliases legacy `threadsOfDestiny`, Fortune, Benediction, Malediction or Omen Debt.

- Exactly three tokens in `free`, `reserved` or `recovering`.
- At most three links with distinct endpoints, recorded two-way consent and explicit expiry.
- 60 ft default maintenance separation; 30 ft formation range in the R1 payloads.
- One or two uses; `usesRemaining` must match the authored use count.
- At most three points of original assigned damage after mitigation per transfer.
- No recursive transfer, derived damage, reconnect/initiative refill or second bank.
- A closing link moves its reserved token(s) to `recovering`; recovery occurs only at the owning caster's next own turn. There is no long-rest refill.
- HUD is read-only and starts uninitialized. Observer view hides endpoint identities and private actor references.

The validator rejects duplicate token IDs, unknown token states, missing or mismatched reservations, missing consent, absent expiry, duplicate link IDs, shared endpoints, invalid use counts and unreferenced reserved tokens. It does not repair invalid state.

## Corrected progression behavior

- `updateLevel`, `adjustLevel` and `updateCharacterInfo('level')` all reconcile Fate talents.
- Fate allocations are pruned to 5 points per level, cap 50, then checked for minimum level, same-tree points, fully ranked predecessors and rank bounds.
- Signatures and capstones are removed when their gates fail. Above-level optional spells and their history/grants are removed.
- Removed talent grants are cleaned from the spellbook and library while still respecting shared grants on other roster characters.
- `handleLevelUpChoice` is atomic for Fate Weaver: one optional pick per level, legal pool level, not already known, and no mutation on refusal.
- Generated category IDs are canonical `fate weaver_level_N`; Gambler IDs are unchanged.

## Augur disposition

`augur-disposition.json` is the current machine-readable 382-row table; `AUGUR-DISPOSITION.md` is its summary.

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
| Resources | 5 |
| Specializations | 3 |
| **Total** | **382** |

Every row is `keep` with `destinationClassId:'augur'`, `destinationId:null` and `automaticConversion:false`. The five resource rows are `omens`, `benediction`, `malediction`, `omenDebt` and `benediction-malediction`. All Auspex, Ill Omen, sign-reading/material-focus and Hierophant content is preserved.

The 11 variants, the `Nereid Myrathil Augur` alias and the `deepling_myrathil` path remain. All 9 heritage edges remain. No legacy ID is renamed, deleted or collapsed into a Fate Weaver ID.

## Verification

- Jest correction batch: **11/11 suites, 112/112 tests passed** (`jest-correction.log`).
- Retained Sol probe harness: **16/17 passed** (`sol-harness.log`). The sole failure is the intentional equality check against the immutable review-era `phase-2b/complete-manifest.json`; the corrected records are in the correction manifest.
- ESLint on 13 correction paths: **0 errors, 1 warning** (`eslint-correction.json`). The warning is the pre-existing UTF-8 BOM in `fateWeaverData.js`.
- `correction.diff` records the tracked diff; the new correction test is listed in `CORRECTION-REPORT.md`.
- Detached production build: **Compiled successfully, exit 0** (`build-correction.log`, `build-correction.exit`).
- No authenticated browser route, combat automation, persistence, migration or playtest acceptance is claimed by this correction. Build success is compilation only.

## Exact limitations

- The old `phase-2b/complete-manifest.json` is intentionally unchanged, so the retained harness equality probe fails by design.
- Capstones retain a once-per-completed-long-rest use cooldown. This is a capstone cooldown, not the removed rest-based token refill. Eternal Tapestry retains its authored once-per-long-rest recovery utility; no automatic resource rule performs a long-rest refill.
- `handleLevelUpChoice` requires a legal optional `spellId` for Fate Weaver. Stat-only level transitions without a spell choice still need confirmation against the live modal flow.
- `/game` at 360px remains PhoneGate-blocked; no new browser evidence is claimed for this correction.
- No commit, push, deploy, native-edge approval or final acceptance was performed.

## Remaining Main HeadQ dependencies

- **CR-A1:** reviewed typed-term identity and admission/serialization.
- **CR-R1:** authoritative AP/resource planning and refusal.
- **CR-D1:** trusted link/token ownership, consent records and private endpoint projections.
- **CR-E1:** damage partition/ordering and ward application.
- **CR-E2:** exactly-once expiry/recovery and own-turn settlement.
- **CR-L1:** authoritative turn/rest identity, deduplication and reconciliation.

**Stop here for independent Phase 2B re-review.**
