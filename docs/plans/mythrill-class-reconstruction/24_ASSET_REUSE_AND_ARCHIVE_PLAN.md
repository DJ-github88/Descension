# Class asset inventory, reuse and archive plan

## Verified inventory scope

`evidence/asset-inventory.json` contains path, byte size and SHA256 for **760 current class-directory assets**:481 icon files/derivatives and279 class illustrations. It also records all historical icon-directory paths/basenames found across available local Git refs. It does not yet inventory every spell icon, legacy background or out-of-tree illustration.

The pre-consolidation snapshot contains183 recursive icon files,63 top-level files. Current HEAD's recursive icon count is481. The full-history basename list includes `_old`, `_v2_old`, `_v3_old`, `_v4_old` revisions and current/retired names. A prior claim of68 historical entries uses an unspecified scope; do not turn it into68 playable classes. Class registration, data/spells, talent/resource definitions and source consumers are separate evidence.

## Proposed asset classification record

For each exact source path/hash: historical/current identity, art revision, format/resolution, native heritage depicted, existing consumers, suitability for successor, proposed destination path/alias, attribution/license provenance if present, retain/reuse/archive disposition and creator review. Unknown suitability remains unresolved, not discarded.

## Reuse priorities

| Existing content | Candidate reuse | Boundary |
|---|---|---|
| Gambler/Fate Weaver old icons and Gambit portraits | Independent wager/thread/chaos briefs after visual inspection | Cards do not automatically make an image Fate Weaver; heritage depiction must remain accurate |
| Revenant/Lichborne/Deathcaller art | Finite-anchor Rime and commanded-dead identities | No forced all-souls visual vocabulary; preserve original portraits for legacy characters |
| Shaper/Formbender/Bladedancer | Druid transformation art versus separate martial-sequence art | Distinguish changed anatomy from martial movement; retain old assets/paths; no nature-worship imagery imported from the approved name |
| Apex/Huntress | Hunter solo/companion/glaive paths | Do not remove visible companion from a saved character's chosen portrait |
| Inscriptor/Primalist/Witch Doctor/Titan | Restored candidate illustration briefs | Historical look may conflict with current world/body/Calm art; review individually |

Resource SVGs are functional interface components, separate from raster portrait work. Reuse compatible geometry/symbols, but remove obsolete display semantics only in the destination renderer. Leave compatibility renderer available.

## Safe path migration

Never globally rename filenames because a public class name changes. Preserve user icon overrides and old paths. New destination assets get distinct paths; a read alias can serve legacy references. Thumbnail/transparent variants are regenerated only in an approved art pipeline with source originals retained. No destructive image conversion during planning.

## Remaining work

Per-image visual inspection, broken-reference/path/case audit, exact historical-name classification, spell icon/background inventory, art briefs per native pairing and destination renderer inventory. The760 hashed files are an inventory, not760 approved reuse decisions.
