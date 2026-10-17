# SVG resource apparatus specifications

**Seven-class R1:** current dossier sections and [R1 rules](29_PRIORITY_REVIEW_RULES_AND_SERIALIZATION.md) pin counts/occupancy/secondary states. These replace obsolete v0 limits while retaining the apparatus concepts below. No renderer is implemented or verified by this design milestone.

**PROPOSED designs**, grounded in the current Calm palette. Each shape has semantic work; no decorative bar disguising a generic number. Existing retained classes keep their best SVG concepts unless a proven resource redesign requires change.

## Shared rendering contract

Pure renderer inputs: normalized domain view model, compact/expanded size, privacy projection, pending/unknown state, accessible summary and intent callbacks. Renderers never draw random cards, spend resources, infer turn boundaries or write stores. Unique SVG IDs derive from instance identity to avoid collision across party members. Use a stable viewBox and non-scaling rules where appropriate; validate at actual HUD dimensions, not only a large screenshot.

Separate SVG decoration from DOM controls. Visible SVG text names counts; the trigger button supplies equivalent text. Private state must be absent from observer props/DOM, not merely visually covered. Expanded view can use HTML lists next to SVG for readable entity/relationship detail.

| Candidate | Compact geometry/state | Expanded information | Empty / blocked / danger | Acceptance witness |
|---|---|---|---|---|
| Gambler | Five card sockets, Fortune count, escrow marker | Hand, pile counts, wager terms/odds and recorded outcome | Empty sockets; locked pending stake; unpaid credit only if approved | Observer sees backs/counts only; same-command retry never redraws |
| Fate Weaver | Three spool marks with free/reserved/recovering hatch and endpoint initials | Links, direction, event, uses, expiry, consent | Broken endpoint or out-of-range icon with reason | Three distinct token states; trigger releases correct thread only |
| Chaos Weaver | Six outcome tiles in available/committed/spent lanes | Exact branch distribution and chosen outcome | Empty bag recoverable; immutable commitment framed | All tiles conserved,2:1 odds legible, no fake volatility bar |
| Deathcaller | Two capacity seals, two order ticks, manifestation status glyphs | Roster, template, HP, order used, binding | Defeated pattern crossed; no actor means no command | Summon loss frees capacity after receipt, not at optimistic click |
| Lichborne | Twelve integrity notches around finite anchor seal, three-stage indicator | Anchor condition/location permissions, trait/vulnerability pairs | Cracked integrity, unavailable return reason | Zero integrity differs from absent anchor; no automatic resurrection animation |
| Hunter | Quarry token and Read/Angle/Pressure symbols of different shapes | Evidence provenance/expiry, companion when relevant | Unknown/escaped quarry; invalid evidence reason | Solo mode has no fictitious companion HP; target change clears exact evidence |
| Druid (name approved; display/economy proposed) | Four anatomical slot glyphs, two occupied, three transition stitches | Prepared loadouts, suspended trait, body interface | Suspended slot hatching; transition cap indicates Recover | Stone/tissue art communicates same slot rules; no conventional nature/worship motif inferred from the name |
| Animist A | Triptych of presence seals: host/anchor/free | Named presence, request, substrate, service limits | Disrupted substrate and obligation clearly named | Hosting doesn't imply a new body form or minion turn |
| Inscriptor | Rune tablet with occupied sockets and visible sequence order | Exact glyph objects/clauses/expiry | Broken sequence, spent ink/socket | Order matters and is readable without color |
| Titan | Monument fulcrum with charge/vector and Sacred/Arcane seal | Declared anchor/impact line/release cost | Unbraced or disrupted footing | Spatial commitment represented; not generic rage fill |
| Dreadnaught | Overlapping armor plates and brace orientation | Equipment pieces, strain/load and chosen resistance | Broken plate/blocked mobility | Actual equipment state drives plates, not an invented armor score |
| Primalist | Discrete living aspect/environment symbols | Prepared aspects and actual local conditions | Unavailable environmental source | No ancestral/dead glyphs unless the final design genuinely needs them |

The last four concepts need full mechanic dossiers before final geometry can be frozen. Monk, Bladedancer, Oracle, Exorcist, Covenbane and Witch Doctor apparatus specifications remain incomplete. Their art should follow finalized resources, not force the resource to fit a pretty instrument.

## Retained-class review

Spheres must display eight canonical types; notes seven actual pitches/counts. Berserker thermal pressure, Pyrofiend stages, Chronarch shard/strain, Augur dual pools, Lunarch phase, Plaguebringer infection cultivation, Toxicologist prepared vials/parts, Spellguard captured energy, Warden capture/tension, Martyr Devotion and Crusader Fervor should show actual canonical resource fields. Audit every current renderer for stale aliases/demo state and accurate thresholds; do not assume every existing dispatch branch is current production UI.
