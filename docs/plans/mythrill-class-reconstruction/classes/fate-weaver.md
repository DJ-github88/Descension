# Fate Weaver — HeadQ review R1

**Creator update, 2026-10-18:** Augur merges into this independent restored class. Preserve/assess actual sign-reading/material foci, Auspex, Ill Omen and Hierophant techniques and all origins; do not automatically import both Benediction/Malediction banks or Omen Debt. [Explicit content disposition](prophecy-cluster.md). Oracle remains independent; Doomsayer is Harbinger's proposed name. Existing application IDs/saves stay compatible. This full next content cohort follows the complete Chaos Weaver C1 package and is not blocked on engine completion.

**PROPOSED; review-ready design, not implementation or final roster approval.** R1 is the active recommendation. The investigation-v0 draft below is preserved but superseded.

Shared timing/transfer/schema: [R1 contract](../29_PRIORITY_REVIEW_RULES_AND_SERIALIZATION.md). Evidence and native recommendations: [all25 cultural review](../28_HERITAGE_REVIEW_AND_PRIORITY_ORIGINS.md).

## Fantasy and repeated decisions

Prepare which lives are connected and which bounded consequences can pass between them.

**Repeated decisions:** Who bears a risk; which of three threads to reserve; whether a longer covenant is worth two occupied tokens; when to cut, sever or re-anchor before an event begins.

**Role, complexity and weaknesses:** High-complexity positional support/control with obligations/investigation utility. Setup, consent, range, occupied capacity and breakable links are real weaknesses.

## Exact proposed state, operations and reset rules

```json
{
  "version": 1,
  "type": "fate-links",
  "tokens": 3,
  "tokenStates": [
    "free",
    "reserved",
    "recovering"
  ],
  "maxLinks": 3,
  "link": {
    "id": "stable",
    "createdSequence": "room accepted sequence",
    "tokenIds": "one or two",
    "from": "exact actor ref",
    "to": "distinct exact actor ref",
    "uses": "1 or2",
    "event": "original-assigned-damage",
    "amountMax": 3,
    "formationRangeEach": 30,
    "separationMax": 60,
    "expiresAt": "caster ownTurnCounter+2 end"
  },
  "recoverAt": "next owner own-turn start"
}
```

1. Exactly3 token IDs partition into free/reserved/recovering. Reserving2 in a covenant leaves at most1 free token. No kills, observed dice or damage generate new threads.

2. Tie1 AP reserves1/uses1; Covenant2 AP reserves2/uses2. Consent from both endpoints; source may be caster, endpoints distinct. Each endpoint within30ft on formation, ≤60ft apart on maintenance. Expiry end of second subsequent caster turn.

3. Use the post-mitigation/pre-temp partition in sharedR1: bearer getsmin(3,D), protected D−that. Transferred burden is not re-mitigated, cannot trigger links/gains or recursively loop. Assigned damage is conserved, actual clamped HP loss need not equal it.

4. Covenant holds both tokens through first use. On final use or Cut/Sever closure tokens enter recovering until their caster’s next own turn. Unused natural expiry releasesfree; encounter closure releases only after pending events settle.

5. Cut Clean1 AP only your own existing link. Sever2 AP prices one free thread into recovery and removes only an identified registered fate-link object within30ft; unrelated buffs, gods, bloodlines or ordinary relationships are ineligible. Enemy’s reserved tokens recover on its own next turn.

6. Reanchor1 AP changes exactly one endpoint with consent/range checks, preserving original event/use/expiry. Cannot occur once the trigger begins. No use/expiry refresh from cycling endpoints.

7. Only one link per original event: earliest accepted room creation sequence wins across casters; other links are not consumed. An invalid/dead/retired/out-of-range endpoint ends eligibility before partition; normal original damage remains. No after-receipt damage rewrite.

## Three specializations — different behavior

| Tree ID/name | Player behavior | Exact R1 variation/signature | Weakness | Later advancement direction |
| --- | --- | --- | --- | --- |
| covenant-weaver / Covenant Weaver | Keep a meaningful two-use promise instead of cycling many small links. | Witnessed Covenant reserves2 tokens, uses2, same3-point transfer and expiry. | Only1 thread remains free; one spent use does not return half the reservation. | Later: named event-specific covenant, explicit duration/condition trade and one finite triad only with atomicN-actor support. |
| severer / Severer | Identify hostile fate topology and spend your own capacity to dismantle it. | Sever the Borrowed Crown2 AP puts1 thread in recovery, cuts one registered fate-link. | Cannot dispel unrelated magic or spam without free threads; needs an identified effect. | Later: precise inspection, warded-link counterplay and one bounded sustained-link cut, no universal nullification. |
| tapestry-keeper / Tapestry Keeper | Move the useful endpoint while preserving the original promise. | Reanchor1 AP retains reservation/use/expiry and requires fresh consent. | Movement/range can break the formation; no retroactive retargeting or free duration. | Later: predeclared alternate endpoint and a finite relay, never a recursive damage graph. |

Signatures are level3, one-point talent nodes after10 points in the same tree. First investment chooses the primary tree; a later hybrid pays every prerequisite and still shares one class state/caps. Full50-point nodes/ranks remain later content, not implicitly granted here.

## Legal three-turn example

Level3 Tapestry Keeper; Reanchor learned11/15. Threads allfree; A/B/C willing living exact actors, each in legal formation range; enoughHP/no other mitigation/temp for numerical losses.

| Turn | Actions/recorded results | AP arithmetic | Resource/effect arithmetic |
| --- | --- | --- | --- |
| T1 | Tie A→B1 AP; later original assigned damage8 resolves through that use. | 4−1=3 | Free3→2/reserved1; assignedA5/B3; uses1→0; free2/reserved0/recovering1. |
| T2 | Start recovers token. Tie A→B1 AP, then Reanchor bearer toC1 AP; no eligible damage this turn. | 4−1−1=2 | Free3→2/reserved1/recovering0; linkcreatedT2 expiresendT4; uses1 remains1. |
| T3 | Reanchor bearer back toB1 AP before any event; later original damage6 resolves. | 4−1=3 | SameT4expiry, uses1→0; assignedA3/B3; free2/reserved0/recovering1 untilT4start. |

Unspent AP is left unspent. No signature from another unlearned tree is borrowed. Incoming enemy consequences are separately GM-confirmed events, not free caster actions. SharedR1 specifies legality assumptions and timing; the current VTT does not automatically execute the new mechanics.

## Noncombat use

Read the Bond reveals perceptible registered terms or witnessed voluntary obligations, not all hidden loyalties. A thread court can establish custody/escort obligations without omniscient or universal contract enforcement.

## Native origins and acquisition — recommended, not current canon

bond_interface + thread_apprenticeship + consent_and_severance_training. Other peoples need an actual acquired perceptible interface and institution, not a liking for destiny.

**Institution, founder/transmission and current crisis:** PROPOSED Weft Thread Court, Under-Ledger/Atropolis with Ironjaw contacts; rotating steward role. Lyra is transmission/schism evidence, not automatically appointed current leader. Keep old House membership and First Contract distinct.

| Recommended native ID/title | Bounded advantage | Paired cost/limitation | Cultural crisis |
| --- | --- | --- | --- |
| kessen_neth / Clause-Weaver | With a maintained obligation ledger, read the public terms of one perceptible fate link without fabricating its hidden clauses; once/completed long rest the Read the Bond action also identifies whether its stated expiry contradicts a witnessed public pledge. | No knowingly false pact-enforced assertion about that clause; collateral/Fraying and source-evidence obligations persist independently. No extra thread or automatic outcome choice. | Lyra’s Deck-Burners force certainty where the Thread Court insists on declared consent and bounded terms. |

These are19 proposed native pairings across the seven, not current registry edits. Every edge needs evidence, full native/rare method/body validation and an enforced paired cost before automatic benefit claims. Native access presumes training; it does not grant power by birth. Other peoples may qualify positively; raw parent hardBlocks are not copied.

## Six fully structured representative abilities

Complete canonical review payloads: [fate-weaver R1 JSON](manifests/fate-weaver-review-r1.json); [all42 records](../evidence/headq-seven-abilities.json). Each includes stable ID, source/level, AP/mana, typed cost/gain/operation, damage/target/range/area/duration/check/reaction/cooldown/conditions, effect configuration, talent/heritage interactions, dependencies and verification. “Structured” here refers to the proposedR1 schema, not current application admission.

| Stable ID/name | Level/content source | AP/mana | Opcode/class price | Effect/target/expiry |
| --- | --- | --- | --- | --- |
| cr1_fate_weaver_tie_thread / Tie the Thread | 1 / class-feature | 1/0 | link.tie: 1 AP; one free token becomes reserved. | Reserve one of three threads between two willing lives. On the next eligible original damage event, assign up to three of the protected actor’s post-mitigation damage to the bearer before temp HP. Target {"targetingType":"multi","rangeType":"ranged","rangeDistance":30,"targetRestrictions":["ally","self"],"maxTargets":2}; duration {"durationType":"own_turns","durationValue":2,"durationUnit":"subsequent_caster_turn_end"} |
| cr1_fate_weaver_cut_clean / Cut Clean | 1 / class-feature | 1/0 | link.cut: 1 AP; existing reserved token(s) become recovering, not free. | End one of your own untriggered links and recover its reserved threads at the start of your next own turn. Cutting is not an immediate refund or a reversal of damage. Target {"targetingType":"self","rangeType":"self","rangeDistance":0,"targetRestrictions":["self"],"maxTargets":1}; duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"} |
| cr1_fate_weaver_read_bond / Read the Bond | 2 / spell-pick | 2/0 | bond.read: 2 AP; no token spent. | Read the declared terms of one perceptible registered magical fate link or a witnessed voluntary obligation. This does not reveal unknown secrets or create a new bond. Target {"targetingType":"single","rangeType":"ranged","rangeDistance":30,"targetRestrictions":["perceptible-bond"],"maxTargets":1}; duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"} |
| cr1_fate_weaver_witnessed_covenant / Witnessed Covenant | 3 / talent-signature / covenant-weaver | 2/0 | link.covenant: 2 AP; two free threads reserved. | Reserve two threads in one protective covenant with two uses. Each eligible event transfers at most three; the two threads remain occupied until both uses are spent or the covenant ends. Target {"targetingType":"multi","rangeType":"ranged","rangeDistance":30,"targetRestrictions":["ally","self"],"maxTargets":2}; duration {"durationType":"own_turns","durationValue":2,"durationUnit":"subsequent_caster_turn_end"} |
| cr1_fate_weaver_sever_borrowed_crown / Sever the Borrowed Crown | 3 / talent-signature / severer | 2/0 | link.sever: 2 AP; one free token becomes recovering. | Sever one identified registered fate-link object within range. Commit one thread to recovering as the price; this does not dispel unrelated magic, bloodlines, gods or ordinary affection. Target {"targetingType":"single","rangeType":"ranged","rangeDistance":30,"targetRestrictions":["identified-fate-link"],"maxTargets":1}; duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"} |
| cr1_fate_weaver_reanchor_tapestry / Reanchor the Tapestry | 3 / talent-signature / tapestry-keeper | 1/0 | link.reanchor: 1 AP; reservation stays unchanged. | Change one endpoint of your own existing link to a willing legal actor. The original event, use count and expiry remain unchanged; the link cannot be moved after its triggering event begins. Target {"targetingType":"single","rangeType":"ranged","rangeDistance":30,"targetRestrictions":["ally","self"],"maxTargets":1}; duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"} |

## Progression and remaining-content manifest

Core management features are granted separately from exactly one optional spell pick per level. Talent budget remains5/level, cap50. Level advancement does not silently increase resource caps. The following is a bounded production requirement list, not an invented complete library around unapproved mechanics.

| Level | Progression outline | Class-specific remaining deliverable |
| --- | --- | --- |
| 1 | Starting resource features plus a level1 choice pool; recovery is never a mandatory spell-pick tax. | Alternative clause/defense choices |
| 2 | Noncombat/utility choices; catalogue preparation and actual institutional acquisition. | Travel/investigation beyond Read the Bond |
| 3 | Three representative signature nodes, each requiring10 tree points plus its1-point node. | Three signature nodes/prerequisites |
| 4 | Defensive/counterplay choices; any reaction content waits for its actual timing contract. | Counter-links after timing support |
| 5 | Distinct permitted uses of the same resource, not automatic larger banks or extra actors. | Event-specific two-use clauses |
| 6 | Exploration/support and meaningful resource expenditure/recovery tradeoffs. | Escort/re-anchor utility |
| 7 | Advanced positional, entity, commitment or trait choices appropriate to this class. | Nonrecursive advanced links |
| 8 | High-level counterplay with explicit interruption and recovery behavior. | Hostile link counterplay |
| 9 | Finite high-level expression, never unbounded probability, actors or immortality. | Advanced conditional commitments |
| 10 | Three separately authored capstones retaining the reviewed core invariants unless HeadQ approves a new version. | Finite capstones after N-actor rules |

Every remaining item still needs stable IDs, legal choice pools, full records and witnesses after core review. The three representative signatures do not equal three complete talent trees.

## Spell Wizard and serialized fields

Endpoint slots/direction/consent, allowed original event, threadreservation, usecount, transfercap, exact expiry/recovery, reanchor/sever scope. Preview must show token occupancy and assigned-damage conservation.

Use explicit resourceCost.actionPoints/mana and classResourceProgram{version,domain,op,args}, with classId/rulesetVersion pinning ownership. No duplicated scalar class cost/gain. Current App load enumerates fields and would drop a new top-level program: load/review/reducer, both saves, normalizer, templates/export/card and execution admission all need explicit support. RESOURCE_PROGRAM and own-turn duration/cooldown terms are proposed extensions.

## Runtime, authority, synchronization and persistence

**Existing:** local resource planners, the three other P9 typed payment homes, exact actor refs/revisions, owner/GM accepted receipts, private intent custody, personal/room codecs and manual GM adjudication.

**Missing for this proposal:** CR-A1, CR-R1, CR-E1, CR-N1-atomic-links. None of these six definitions is admitted by current P9 just because JSON exists.

Room authority owns attached class state, active effects and actors; personal preparation/snapshot is a different home. Reuse existing authority through reviewed named extensions, not a parallel combat engine. [Lifecycle contract](../implementation/CR-L1-AUTHORITATIVE-LIFECYCLES.md) defines commitment, event timing, cancellation, deduplication, reconnect, checkpoint and owner projection. No refill/draw/actor recreation on disconnect.

## HUD/SVG, menus and tooltips

Three spool glyphs free/reserved/recovering; endpoint initials and broken/expiring cue. Expanded terms/consent/use/expiry list. No complete graph squeezed into a meter.

Import calmBarPalette: etched parchment geometry, one accent, BRICK danger and text/hatching redundancy; no filters, glow or looping motion. Focus/touch details must provide every hover explanation. SVG derives state and issues intents; it never owns or mutates the economy.

## Migration and compatibility

All35 historical Fate Weaver IDs/currentGambit cards remain unchanged compatibility data; no automatic migration of card overrides into link objects. OldKarmic Weaver/High Roller nodes and materialized talent-spell IDs remain on legacy characters. Newthread state starts by explicit approved loadout conversion, with no fabricated existing links.

Exact relevant legacy spell IDs, tree/node IDs and materialized talent-spell IDs are listed in [priority compatibility index](../evidence/headq-priority-compatibility.json). Disposition is preserve-legacy/no-automatic-remap, not approved transfer. Original profiles/saves/assets/native relations remain. Even a restored historical ID needs a new explicit ruleset version; unknown old saves are never silently read asR1.

## Closest overlaps and independent existence

Neither wagers nor randomized branch distributions. Animist carries real ancestral voices, not redistributed damage. Fate Weaver earns a class because topology/reservation are its repeated tactical decisions.

## HeadQ choice and consequences

The Druid player-facing name and selective familiar-naming principle are approved; Hunter remains a working name. R1 economy, balance, specializations and native/institution records still need HeadQ approval; engine extensions need their own contracts. Preserve Shaper IDs/compatibility until explicit migration approval. The name imports no conventional Druid rules, worship, pet requirement or heritage assignment. No remaining full-library or50-point-tree detail is delegated to an implementer to invent.

<details>
<summary>Archived investigation-v0 — preserved, superseded by R1 above</summary>

# Fate Weaver — finite threads and linked consequences

**DESIGN INTENT:** independent restoration. **PROPOSED:** new mechanics below. **Status: substantive design draft; full content/heritage approval incomplete.**

## Historical evidence and identity

**HISTORICAL:** 35 top-level spells, card-based d20 overrides, Fate Reserve 0–4 and Karmic Debt 0–13; Fortune Teller, Card Master, Thread Weaver trees. All 35 IDs survive in Gambit. This history is cartomancy, not evidence that an entity-link engine already exists.

**Recommended:** Fate Weaver. Alternatives: Threadweaver, Fatebinder, Weaver, Destiny Binder. Player pitch: “Choose whose lives are connected. Tie a danger to a protector, share a narrow opening or cut a consequence loose. Your strongest spell is the relationship you prepared.” Role: positional support/control, noncombat relationship/obligation analysis. Complexity high. Weakness: setup, range and finite capacity; cannot invent a bond to an unknown person or rewrite an already accepted receipt.

## Proposed exact prototype resource

Three reusable thread tokens. Each is `free`, `reserved-by-link`, or `recovering-until-own-turn`. At most three links. Each link has unique ID, two distinct exact actor refs, one direction, one eligible event, fixed amount, one use and expiry at the end of the caster's second subsequent own turn. Base formation range: each endpoint within 30 ft of caster; maintain endpoints within 60 ft of each other, with line-of-effect policy pending. These ranges are tuning proposals.

Tie (1 AP): reserve one free token and create one link with approved endpoints/terms. Cut (1 AP): remove link and put token into recovery until the next own turn. Trigger: consume the link/use, route the approved consequence and recover the token at next own turn. Expiry: release token free. Neither damage nor enemy deaths manufacture thread tokens. No currency called Fortune or shared Debt bar.

Base protective link routes up to 3 points of *ordinary incoming HP damage* from endpoint A to consenting endpoint B **before either HP loss commits**. It preserves total damage; cannot transfer self-cost, sacrifice, anchor loss, redirected damage or healing. Temp-HP/mitigation order needs a frozen rule; until approved, this action stays manual. A recipient's transferred portion cannot trigger another link. No automatic loops, chain copies or “share 100%” effects.

The link is an explicit pending effect included in an authoritative action plan, not a listener that sees a finished receipt and then pretends the original damage never happened. Original event ID + link ID is consumed once. If B disappears or range fails, link does not redirect; original damage resolves as otherwise authorized, and the GM sees why the link was unavailable. Unknown command outcome retains the same terms.

## Three trees

| Tree | Behavior/resource change | Targeting/position | Support/offense/defense/utility | Cost/weakness | Capstone direction |
|---|---|---|---|---|---|
| Covenant Weaver | Bind protection clauses; one link may hold two uses at a higher thread reservation | Protect one named ally; stand where both endpoints can be maintained | Share bounded damage, witness a voluntary obligation | Occupied thread capacity and consent | A finite three-party covenant only after N-actor rules |
| Severer | Cut an enemy's prepared beneficial connection, not arbitrary spellcasting | Identify a real eligible bond; enemy check under approved rules | Break one transfer, expose one escape route, disrupt a defined tether | Cannot sever unknown prose effects or ordinary relationships | Cut one specifically tagged sustained effect with a clear cost |
| Tapestry Keeper | Move one reserved endpoint rather than create free links | Re-anchor through a consenting ally within range; same event/expiry | Relay positioning, safeguard exploration lines, conditional focus | Re-anchor costs AP and cannot occur after outcome knowledge | One prepared rerouting configuration; no retroactive rewrite |

Individual 50-point trees, rank tables and capstones are incomplete. Legacy Card Master work can inform symbols/interface without forcing this class back into Gambler's hand economy.

## Numerical three-turn example

Initial 3 free threads; allies A and B consent.

1. **T1:** Tie A→B, 1 AP; free 3→2, reserved 0→1. A later faces a declared 8 ordinary HP damage under an approved mitigation ruling. Link partitions it A5/B3 in the same accepted consequence. Link is consumed; reserved 1→0, recovering 0→1. Total applied loss remains 8 if no capped-HP/temp complications; those cases need separate rules.
2. **T2:** Own-turn recovery makes free 2→3. Tie A→C, reserve 1 (free2); place a separate Severer tether on an identified enemy bond, reserve another (free1). They are different explicit effects, not a recursively connected web.
3. **T3:** Choose Cut on the enemy tether before it pays off: free stays1, reserved2→1, recovering0→1. Keep A→C to protect the ally. At its documented expiry the retained link releases its token; no debt explosion and no soul farming.

Tree demonstrations to finalize: Covenant retains a long-lived two-use link across three turns; Severer identifies/prepares/cuts an enemy tether; Keeper sets/reanchors/consumes a link to preserve a moving formation. They must show actual final node/resource numbers before implementation.

## World foundation and native review

**CONFIRMED current evidence:** Weft perceive an obligation-web and Gambit variant uses fate-thread collateral (`neth.js:70–78`, `gambitData.js:43–57`). That supports investigation, not automatic assignment. Native/adopted/prohibited list remains **UNRESOLVED** pending all-heritage review. Proposed acquisition: an actual perceivable bond interface, guided thread discipline, demonstrated consent/obligation training. Incompatible state must name a lost interface, not ban a race by stereotype.

**PROPOSED institution:** a distinct obligation conservatory in Ironjaw/Atropolis orbit, disputing Lyra's forced-certainty doctrine. Do not assert Lyra founded or currently leads the restored class without canon review. Potential native title “Clause-Weaver”; signature interprets visible obligations, paired with truthful-assertion constraint. Benefit/cost requires its own typed heritage row and must not add free thread slots.

## UI/SVG and authoring

Compact: three spool glyphs plus small endpoint initials/markers; free/reserved/recovering visually distinct by fill/hatching. Never squeeze a complete battlefield graph into the HUD. Expanded: exact endpoints, event, amount, remaining uses, expiry, consent and invalidity reason. Wizard: link editor with endpoint slots, direction, event whitelist, amount, uses and duration; preview shows total-damage conservation and required runtime extension. Tooltip says “reserved” rather than “spent” when appropriate.

## Dependencies and progression

Requires linked-effect persistence, consent, exact-target identity, an interception/reaction stage, event causality, N-actor atomicity where required, range/LoE rules and public/private projection. A generic P7 source+one target command cannot atomically charge caster and damage two other actors. Levels should expand *kinds of clauses* rather than endlessly add links: basic protection1, voluntary travel bond2, cutting3, reanchor4, two-use clause5, counter-link6, advanced encounter commitments7–8, capstone9–10.

Six ability briefs: Tie the Thread, Cut Clean, Shared Burden, Witnessed Covenant, Sever the Borrowed Crown, Reanchor the Tapestry. Full structured records/progression/heritage variants remain outstanding.

Distinct from Gambler: relationships and reserved topology, no wagering. Distinct from Chaos Weaver: explicit bounded outcome routing, not randomized branch distributions. Distinct from Animist: no ancestral entities or substrate memory.

</details>
