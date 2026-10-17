# Executive decisions and scope

**Later creator decision — DESIGN INTENT:** the bodily-transformation class's player-facing name is **Druid**, rejecting Metamorph and superseding prior naming alternatives. Selectively familiar class names are approved as a naming principle. No conventional Druid mechanics, nature worship, companion requirements or heritage assignments are imported. Anatomy, specializations and origins stay under review; Shaper IDs/compatibility stay intact until explicit migration approval. [Scope](31_CREATOR_NAMING_DECISION_DRUID.md).

## DESIGN INTENT — binding creator decisions

| Identity | Future catalogue | Existing source/save treatment |
|---|---|---|
| Gambit | Retired destination; restore independent Gambler, Fate Weaver, Chaos Weaver | Preserve records, resources, spells, talents, references, art, campaigns and characters until migration approval |
| Revenant | Retired destination; restore independent Deathcaller and Lichborne | Preserve finite anchor and Death-Toll implementation and legacy references |
| Shaper | Retired name/identity; retain bodily transformation under a better proposed name | Preserve Flux/Body Toll, forms, talents, interfaces and art for evaluation |
| Apex | Investigate Hunter as preferred provisional public identity, including historical Huntress | No global replacement or automatic save rewrite |
| Animist | Remains under review | Do not remove; compare at least two strong revisions |
| Monk | Independent candidate to investigate | No inheritance of transformation mechanics merely for code reuse |
| Arcanoneer | Eight-element recipe constructor with no primary element | Preserve typed spheres and canonical ingredient vocabulary |

There is no target roster quota. Three trees is a default; the existing fourth Martyr and Warden trees must be investigated, not silently removed.

## CONFIRMED — baseline constraints

- `AGENTS.md` applies to this checkout. `CLAUDE.md:38` names an older path; `docs/ENGINEERING_STATE.md:3–4` explicitly identifies `D:/VTT` as current.
- Current class registry includes 21 base classes plus three narrow Nereid compatibility aliases (`classes/index.js:48–85`). An alias is not another playable base class.
- `classHeritageRegistry.js` is the access-policy owner. The wrapped class index replaces raw `allowedSubraces`, clears raw `hardBlocks`, and derives justification from provenance (`:206–220`). Raw class restrictions remain useful authored/historical evidence, not a competing gate.
- P9's source-owned class-payment homes support only spheres, notes and Devotion (`server/services/spellPayments.js:9–13`). Other local resource planners do not establish authoritative combat support.

## AUTHORED — documents requiring reconciliation

`docs/CLASS_DESIGN_CHARTER.md:11,86` says keep all 21. This is superseded **for target design** by the creator's explicit retirements. The same charter describes level cap 10, one spell pick per level, 5 talent points per level and a 50-point full tree (`:13`); verify those against current consumers before designing progression.

`docs/CLASS_AUDIT_STANDARDS.md` contains conflicting tone examples and an old ban on flat DR (`:540`), while the active P12 contracts explicitly distinguish flat DR from equipment durability dice. The new plan must use the later bounded combat authority rather than blindly copying an older schema guide.

## PROPOSED — approval model

Approve mechanics and heritage assignments separately from their technical implementation. Design approval alone must not promote a candidate to release-approved or change an existing save. Candidate status, compatibility status, runtime capability support and content completeness must be independently recorded.
