# Gambler — HeadQ review R1

**PROPOSED; review-ready design, not implementation or final roster approval.** R1 is the active recommendation. The investigation-v0 draft below is preserved but superseded.

Shared timing/transfer/schema: [R1 contract](../29_PRIORITY_REVIEW_RULES_AND_SERIALIZATION.md). Evidence and native recommendations: [all25 cultural review](../28_HERITAGE_REVIEW_AND_PRIORITY_ORIGINS.md).

## Fantasy and repeated decisions

Commit real stakes before the result, build a finite hand and choose which risks you can afford.

**Repeated decisions:** Which card to expose; how much Fortune to escrow; whether to play a pair for protection or retain it; whether an ally’s next event is worth underwriting.

**Role, complexity and weaknesses:** Medium-high complexity burst/support and social risk broker. Wins pay spectacularly; a finite hand, committed stake and weak sustained defense constrain it.

## Exact proposed state, operations and reset rules

```json
{
  "version": 1,
  "type": "gambler-hand",
  "fortune": {
    "min": 0,
    "max": 7,
    "longRestReset": 3
  },
  "cards": {
    "count": 20,
    "suits": [
      "C",
      "D",
      "H",
      "S"
    ],
    "ranks": [
      1,
      2,
      3,
      4,
      5
    ],
    "zones": [
      "deck",
      "hand",
      "discard",
      "pending-wager"
    ],
    "handMax": 5
  },
  "wagerMax": 1,
  "usage": [
    "draw-ownTurnId",
    "recut-ownTurnId",
    "read-ownTurnId"
  ],
  "longRestId": "unique-completed-event"
}
```

1. Opening at a completed long rest: Fortune3, shuffle the20 unique cards and deal5 privately; deck15. Subsequent encounters carry that exact bank/order/hand. No initiative/reconnect reset.

2. Own-turn start draws up to2 only into empty hand sockets, if deck has cards, once. No automatic discard or shuffle. Recut is a separate1-AP, once/own-turn action with its own explicit discard/draw rules.

3. A wager reserves its exact played card(s) in pending-wager and removes stake from available Fortune into escrow. There is one unresolved wager across attack and underwriting. Available+escrow never exceeds7 before settlement. During a pending wager, no Recut/new wager; ordinary weapons and observation remain possible.

4. Base stake1–2,2d6≥8 pays2×stake; High Roller stake3,2d6≥9 pays9. After payout cap available Fortune7 and discard overflow. These are returned stakes, not additional return plus profit. A losing stake is consumed; no bankruptcy damage at Fortune0.

5. Resolve card(s) to discard and clear escrow exactly once. Underwrite locks a consenting ally’s next original single-d8 damage roll before its face:5–8 wins, adds2 raw damage before mitigation, returns2×stake. Expiry/cancelled eligible action loses the committed stake; never rerolls the ally.

6. After commitment there is no cost-refund withdrawal. Outcome-unknown retains card/stake/result. A rest/encounter close waits for settlement or explicit same-action GM reconciliation. Recut’s broke recovery requires actually discarding a card, so it cannot mint Fortune without an action and finite contents.

## Three specializations — different behavior

| Tree ID/name | Player behavior | Exact R1 variation/signature | Weakness | Later advancement direction |
| --- | --- | --- | --- | --- |
| high-roller / High Roller | Commit one large volatile strike rather than several small bets. | Double or Nothing uses3 AP/card/stake3 and a harder9+ roll. Same bank7; its overflow is deliberately lost. | No free credit or HP-to-Fortune loop; a loss can leave only basic attacks/Recut. | At later tiers: public wager-condition choice, a once/rest exceptional stake, and a finite final bet; no larger bank. |
| card-sharp / Card Sharp | Preserve actual matching ranks and choose protection instead of wagering cards. | Marked Pair1 AP consumes an exact pair for ward4, one use until next own turn; no Fortune price. | No pair means no signature; giving up cards reduces later wagers/pattern choices. | Later tiers: controlled discard choice, named hand patterns and one five-card arrangement; no automatic rare hand. |
| odds-broker / Odds Broker | Choose an ally/event to underwrite before seeing its roll, waiting instead of making your own wager. | Underwrite1 AP reserves1–2 Fortune/card for one specific eligible event/expiry; one pending wager blocks own bets. | Ally may not act, may cancel, or roll outside5–8; stake is still lost. | Later tiers: alternative declared event kinds and one finite two-contract capstone only under separately reviewed event rules. |

Signatures are level3, one-point talent nodes after10 points in the same tree. First investment chooses the primary tree; a later hybrid pays every prerequisite and still shares one class state/caps. Full50-point nodes/ranks remain later content, not implicitly granted here.

## Legal three-turn example

Level3 Card Sharp; Marked Pair learned11/15 talent points. Fortune3, hand[1C,1D,3H,4H,5S], distinct specified deck draw order; no pending wager/optional heritage edge.

| Turn | Actions/recorded results | AP arithmetic | Resource/effect arithmetic |
| --- | --- | --- | --- |
| T1 | Wager Strike2 AP: play5S/stake2;2d6=5+4 wins;d8=4. | 4−2=2 | Fortune3→1 +return4=5; escrow0→2→0; hand5→4; assigned damage4+1+2=7. |
| T2 | Start draws2S into one empty socket. Marked Pair1 AP consumes1C/1D for ward4; Wager Strike2 AP plays4H/stake1,2d6=2+3 loses;d8=4. | 4−1−2=1 | Hand4→5→3→2; Fortune5→4, escrow settles0; assigned damage5; pair ward has one use, not another bank. |
| T3 | Start draws3C/5D. Base Wager Strike2 AP plays5D/stake2,2d6=6+3 wins; Recut1 AP discards3C/draws2D+4C. | 4−2−1=1 | Hand2→4→3→2→4; Fortune4→2 +return4=6; escrow0. No illegal stake3 from a Card Sharp. |

Unspent AP is left unspent. No signature from another unlearned tree is borrowed. Incoming enemy consequences are separately GM-confirmed events, not free caster actions. SharedR1 specifies legality assumptions and timing; the current VTT does not automatically execute the new mechanics.

## Noncombat use

Read the Table inspects only your own next card and one real observable tell. Merrowport risk brokerage, games and fair wager terms are useful without pretending to read every opponent’s mind.

## Native origins and acquisition — recommended, not current canon

house_wager + initiation_survival + wager_discipline + finite_deck_training. Weft House practitioners remain preserved legacy or positively qualified; Fate Weaver native recommendation does not erase their old wagers.

**Institution, founder/transmission and current crisis:** Preserve Merrowport House, Merr-Cael and Last Table/Merrowport for the wagering school. Jax/Jix/Lyra are modern transmission evidence, not the origin of all native probability. No forced new leader.

| Recommended native ID/title | Bounded advantage | Paired cost/limitation | Cultural crisis |
| --- | --- | --- | --- |
| merryn_human / Sea-Omen Gambler | Once/completed long rest, use a carried voyage-share ledger to take advantage on one noncombat maritime risk-appraisal check. | The declared voyage obligation stays recorded; abandoning it suspends this edge until amends, not baseline inland play. | Jax remains missing and the silent sea leaves wager obligations disputed. |
| drall_fexric / Sump-Hustler | Once/completed long rest, a prepared variance device grants advantage on one Intelligence-based noncombat game/device-preparation check. | Consume one actual spare part for the preparation regardless of result; Tilt still makes ordinary deterministic work unreliable. | Salvage scarcity and incoming guild refugees make a reliable table difficult to maintain. |

These are19 proposed native pairings across the seven, not current registry edits. Every edge needs evidence, full native/rare method/body validation and an enforced paired cost before automatic benefit claims. Native access presumes training; it does not grant power by birth. Other peoples may qualify positively; raw parent hardBlocks are not copied.

## Six fully structured representative abilities

Complete canonical review payloads: [gambler R1 JSON](manifests/gambler-review-r1.json); [all42 records](../evidence/headq-seven-abilities.json). Each includes stable ID, source/level, AP/mana, typed cost/gain/operation, damage/target/range/area/duration/check/reaction/cooldown/conditions, effect configuration, talent/heritage interactions, dependencies and verification. “Structured” here refers to the proposedR1 schema, not current application admission.

| Stable ID/name | Level/content source | AP/mana | Opcode/class price | Effect/target/expiry |
| --- | --- | --- | --- | --- |
| cr1_gambler_wager_strike / Wager Strike | 1 / class-feature | 2/0 | wager.attack: 2 AP, one exact hand card,1–2 Fortune to escrow. | Play one card and stake Fortune before a 2d6 wager. On 8+, return twice the stake and add the stake to this strike; on loss the stake is gone. Target {"targetingType":"single","rangeType":"ranged","rangeDistance":30,"targetRestrictions":["enemy"],"maxTargets":1}; duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"} |
| cr1_gambler_recut / Recut | 1 / class-feature | 1/0 | hand.recut: 1 AP;0–2 chosen hand cards discarded. | Once on your own turn discard up to two cards, reshuffle discard only if the deck is empty, then draw into up to two empty sockets. If broke and you actually discarded a card, recover one Fortune. Target {"targetingType":"self","rangeType":"self","rangeDistance":0,"targetRestrictions":["self"],"maxTargets":1}; duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"} |
| cr1_gambler_read_table / Read the Table | 2 / spell-pick | 1/0 | table.read: 1 AP; no Fortune/card spend. | Inspect the next card of your own deck and one publicly observable tell of a game or wager. You learn no hidden opponent cards and do not change deck order. Target {"targetingType":"self","rangeType":"self","rangeDistance":0,"targetRestrictions":["self"],"maxTargets":1}; duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"} |
| cr1_gambler_double_or_nothing / Double or Nothing | 3 / talent-signature / high-roller | 3/0 | wager.high-roll: 3 AP, one card, Fortune3 escrow. | Play one card and stake exactly three Fortune on a harder 2d6 wager. On 9+, return three times the stake and deliver the larger published strike; otherwise lose the stake. Target {"targetingType":"single","rangeType":"ranged","rangeDistance":30,"targetRestrictions":["enemy"],"maxTargets":1}; duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"} |
| cr1_gambler_marked_pair / Marked Pair | 3 / talent-signature / card-sharp | 1/0 | hand.marked-pair: 1 AP, exact pair2 cards; no Fortune. | Expose and discard two cards of the same rank to place a four-point one-use luck ward on one ally. The ward is not healing or a second Fortune bank. Target {"targetingType":"single","rangeType":"ranged","rangeDistance":30,"targetRestrictions":["ally","self"],"maxTargets":1}; duration {"durationType":"own_turns","durationValue":1,"durationUnit":"next_caster_turn_start"} |
| cr1_gambler_underwrite / Underwrite | 3 / talent-signature / odds-broker | 1/0 | wager.underwrite: 1 AP, one hand card,1–2 Fortune escrow; one unresolved wager total. | Before an ally rolls, stake Fortune and one card against that ally’s next eligible original single-d8 damage roll. Face5–8 pays the wager and adds two raw damage before mitigation; otherwise the stake is lost. Target {"targetingType":"single","rangeType":"ranged","rangeDistance":30,"targetRestrictions":["ally","self"],"maxTargets":1}; duration {"durationType":"own_turns","durationValue":1,"durationUnit":"next_caster_turn_start"} |

## Progression and remaining-content manifest

Core management features are granted separately from exactly one optional spell pick per level. Talent budget remains5/level, cap50. Level advancement does not silently increase resource caps. The following is a bounded production requirement list, not an invented complete library around unapproved mechanics.

| Level | Progression outline | Class-specific remaining deliverable |
| --- | --- | --- |
| 1 | Starting resource features plus a level1 choice pool; recovery is never a mandatory spell-pick tax. | Alternative wager/defense choice pool |
| 2 | Noncombat/utility choices; catalogue preparation and actual institutional acquisition. | Social risk options beyond Read the Table |
| 3 | Three representative signature nodes, each requiring10 tree points plus its1-point node. | Signature-node prerequisites and ranked hand interactions |
| 4 | Defensive/counterplay choices; any reaction content waits for its actual timing contract. | Defensive wagers after timing support |
| 5 | Distinct permitted uses of the same resource, not automatic larger banks or extra actors. | Named pattern and ally-event choices |
| 6 | Exploration/support and meaningful resource expenditure/recovery tradeoffs. | Bounded stake tradeoffs |
| 7 | Advanced positional, entity, commitment or trait choices appropriate to this class. | Contract/escape utility choices |
| 8 | High-level counterplay with explicit interruption and recovery behavior. | High-level counterplay |
| 9 | Finite high-level expression, never unbounded probability, actors or immortality. | Finite grand wagers |
| 10 | Three separately authored capstones retaining the reviewed core invariants unless HeadQ approves a new version. | Three distinct capstones retaining bank/deck limits |

Every remaining item still needs stable IDs, legal choice pools, full records and witnesses after core review. The three representative signatures do not equal three complete talent trees.

## Spell Wizard and serialized fields

Card IDs/ranks/suits and pattern selector; permitted stake bounds, wager die/threshold/payout, exact eligible event and expiry, public/private hand preview. Never store a chosen hand or result in the authored definition.

Use explicit resourceCost.actionPoints/mana and classResourceProgram{version,domain,op,args}, with classId/rulesetVersion pinning ownership. No duplicated scalar class cost/gain. Current App load enumerates fields and would drop a new top-level program: load/review/reducer, both saves, normalizer, templates/export/card and execution admission all need explicit support. RESOURCE_PROGRAM and own-turn duration/cooldown terms are proposed extensions.

## Runtime, authority, synchronization and persistence

**Existing:** local resource planners, the three other P9 typed payment homes, exact actor refs/revisions, owner/GM accepted receipts, private intent custody, personal/room codecs and manual GM adjudication.

**Missing for this proposal:** CR-A1, CR-R1, CR-E1, CR-D1-private-deck, CR-E2-deferred-consequence. None of these six definitions is admitted by current P9 just because JSON exists.

Room authority owns attached class state, active effects and actors; personal preparation/snapshot is a different home. Reuse existing authority through reviewed named extensions, not a parallel combat engine. [Lifecycle contract](../implementation/CR-L1-AUTHORITATIVE-LIFECYCLES.md) defines commitment, event timing, cancellation, deduplication, reconnect, checkpoint and owner projection. No refill/draw/actor recreation on disconnect.

## HUD/SVG, menus and tooltips

Five card sockets; available Fortune and separate escrow; deck/discard counts; locked pending action. Observers see only public count/played cards; backs must not hide private rank data still present in DOM.

Import calmBarPalette: etched parchment geometry, one accent, BRICK danger and text/hatching redundancy; no filters, glow or looping motion. Focus/touch details must provide every hover explanation. SVG derives state and issues intents; it never owns or mutates the economy.

## Migration and compatibility

No65 Gambit spell or tree ID is renamed in place. All28 historical gambler_* records remain legacy until per-payload transfer review; the newcr1_* six are new semantics. Debt/cards/FP are preserved in old resource state; owner chooses explicit conversion, not a numerical division.

Exact relevant legacy spell IDs, tree/node IDs and materialized talent-spell IDs are listed in [priority compatibility index](../evidence/headq-priority-compatibility.json). Disposition is preserve-legacy/no-automatic-remap, not approved transfer. Original profiles/saves/assets/native relations remain. Even a restored historical ID needs a new explicit ruleset version; unknown old saves are never silently read asR1.

## Closest overlaps and independent existence

Fate Weaver reserves relationships, not stakes; Chaos Weaver changes a declared sample set, not a personal bankroll/hand. Gambling remains the core choice, so it cannot be reduced to their cosmetic talent tree.

## HeadQ choice and consequences

The Druid player-facing name and selective familiar-naming principle are approved; Hunter remains a working name. R1 economy, balance, specializations and native/institution records still need HeadQ approval; engine extensions need their own contracts. Preserve Shaper IDs/compatibility until explicit migration approval. The name imports no conventional Druid rules, worship, pet requirement or heritage assignment. No remaining full-library or50-point-tree detail is delegated to an implementer to invent.

<details>
<summary>Archived investigation-v0 — preserved, superseded by R1 above</summary>

# Gambler — wager and finite-hand design dossier

**DESIGN INTENT:** mandatory independent restoration; Gambit is not a fourth target. **PROPOSED:** all new mechanics below. **Status: substantive design draft, incomplete content/lore contract.**

## Evidence and identity

**HISTORICAL:** pre-consolidation Gambler had 28 authored top-level spells, Fortune nudging, personal probability strain and three trees: Fortune's Favor, High Roller, Card Sharp. All 28 IDs survive in current Gambit, whose card-override and debt layers also preserve 35 Fate Weaver IDs. See historical census/definitions. **AUTHORED current:** Gambit combines Fortune 0–7, Debt 0–13 and card overrides; its prose gives conflicting tax/depletion explanations. Those penalties are not automatically retained.

**Recommended name:** Gambler. Alternatives: Cardsharp, High Roller, Wagerer, Fortune Hunter. Instantly recognizable; no new vocabulary needed before character creation.

**Player introduction:** “You put something real on the table before the dice land. Build a hand, read the risk and decide what you can afford to lose. When the impossible pays out, everyone remembers who called it.”

Combat: flexible burst/support through declared stakes. Noncombat: games, risk brokerage, maritime bargains and finding the hidden price of an offer. Complexity: medium-high. Strength: deliberate high payoff and flexible hand conversion. Weakness: finite hand, committed stakes, variance and weak sustained defense. No arbitrary catastrophe simply because Fortune reaches zero; the class must remain playable when broke.

## Proposed exact prototype state

- `fortune`: integer 0–7; start encounter at 3 only if the approved encounter refresh rule permits it. No encounter-start refresh by toggling initiative.
- `deck`: unique permutation of 20 cards, four suits × ranks 1–5; `hand` max 5; `discard` and `deck` disjoint, every card exactly once across zones. Opening hand 5.
- `wager`: null or one immutable `{id, actionId, stake, event, targetRef, recordedRoll, status}`. Stake 1–3 Fortune, removed to escrow at acceptance before result is known. One unresolved wager maximum.
- Own-turn draw: up to two cards, only into empty hand slots, once per authoritative own-turn ID. Empty deck is not automatically shuffled; a 1 AP Recut action reshuffles discard only, preserving held/escrow cards.
- Win on the base 2d6 wager: sum ≥8; returned Fortune = 2×stake, capped at 7. Loss: escrow consumed. A tie has no special outcome. No choice after seeing faces.
- Accepted wager resolution and its payoff/damage must share one operation identity. Disconnect retains the hand/escrow/roll and permits same-command checking, never a fresh draw.
- No passive Fortune regeneration, free HP-to-Fortune loop or universal Debt meter. Karmic Debt is retained as legacy evidence and a possible optional credit mechanic, not required by all three restored classes.
- Long-rest/encounter refresh semantics and deck privacy require creator/engine approval. Until then persistent prototype state must be explicit rather than fabricated by the HUD.

## Three tree directions

| Tree | New decisions | Generator/spender changes | Signature and weakness | Capstone direction |
|---|---|---|---|---|
| High Roller | Commit one large wager instead of several safe actions | Stake up to 3; no free credit; a single accepted win can overflow and waste Fortune | Double or Nothing: stake 3 for a large fixed branch payoff; weak after a loss | The Last Stake: one published extraordinary wager, finite use, never guaranteed victory |
| Card Sharp | Preserve ranks/suits to complete hands | Spend actual pairs/runs; forgo two-card draw when preserving a full hand | Marked Pair: consume a pair to shield one ally; hand opportunity cost | Royal Arrangement: spend a five-card pattern to choose one predefined team effect |
| Odds Broker | Decide whose eligible uncertain event to underwrite | Reserve Fortune for one exact ally action; gains only from its resolved original event | Underwrite: guarantee a small bounded minimum at the price of your stake, not rewrite arbitrary rolls | House Compact: two separately approved wagers with separate identities; no unbounded network |

Talent progression must follow the verified 5 points/level, 50-point tree capacity; individual nodes/prerequisites/rank effects remain to author. First point primary-spec behavior must be preserved. A passive can't grant all three signature economies at once through a hybrid build.

### Three-turn base example

Initial Fortune 3, hand `[1C,1D,3H,4H,5S]`; 4 AP each turn is an illustration, not new initiative rules.

1. **T1:** Wager Strike (2 AP), stake 2: available 3→1, escrow 2. Record 2d6 = 5+4. Win: escrow 2→0, Fortune 1→5. Resolve the action's published damage once. Hold the pair for defense instead of spending all remaining Fortune.
2. **T2:** Card Sharp signature (1 AP), consume `1C,1D`: hand 5→3; one ally receives the approved bounded shield. Wager Strike stake 1: Fortune 5→4; roll 2+3 loses; escrow consumed, Fortune stays 4. Both actions are distinct commitments; no reroll from changing target.
3. **T3:** Own-turn draw 2 refills hand 3→5. Stake 3: Fortune 4→1; roll 6+3 wins, payout 6 gives Fortune 7. The player deliberately accepts low reserve for a full-bank payoff; overflow beyond 7 never creates hidden credit.

### Tree example differences

High Roller uses T1 small stake → T2 protect remaining bankroll → T3 stake 3. Card Sharp spends T1 to improve rank pair → T2 consumes pair for an ally → T3 plays a run rather than staking. Odds Broker reserves T1 one Fortune against an ally's next original action → T2 settles that action once → T3 chooses a different insured ally. Full numerical three-turn examples for each final tree remain required.

## Heritage, institution and world

**CONFIRMED current provenance:** Gambit's native paths are Merryn, Weft and Alchemite; Merrowport House/Merr-Cael is its institution, separate from Mael-Zhul's cosmic House. Jax is missing; Lyra leads Deck-Burners, not the current House. Sources: registry:52,82; gambitData:26–75,112–149; human:39,58; fexrick:54; neth:70–78.

**UNRESOLVED native assignment:** Merryn maritime wagers and Alchemite variance devices are strong research leads; do not assume the Weft link tradition must become a native Gambler path. Full 25-heritage/lore review precedes assignments. Proposed outsider requirements: real accepted wager, survived initiation, trained stake discipline; not personality or a GM tick alone. Proposed institution: preserve Merrowport House for the actual wagering school, subject to approval and fate-school separation. Proposed crisis: whether Merr-Cael can maintain consent and settled stakes while radicals force outcomes. New founder/leader claims are not approved.

Variant briefs to develop *if native assignment approved*: Merryn Sea-Omen Gambler structures a maritime wager but cannot abandon its carried obligation; Alchemite Sump-Hustler prepares a variance device but inherits Tilt's deterministic unreliability. Exact advantage/cost must use the existing bounded heritage contract, not free Fortune every roll. Weft requires an independent decision rather than blanket inheritance.

## SVG and UI contract

Compact: five engraved card sockets, Fortune count 0–7 and a separate escrow marker. Show backs to observers unless the card is public; never leak rank through labels/DOM attributes. Expanded: full hand, deck/discard counts, odds, declared stake and immutable pending roll. A pending wager looks locked, not resolved. Tooltip explains win/loss, caps, draw/Recut, rest and current tree/heritage changes. Resource authoring needs a hand-pattern and wager-table editor, not a Luck input.

## Runtime and progression dependencies

Needs finite deck conservation, private hand projection, immutable pre-result commitment, recorded random outcomes, atomic escrow/payoff and existing exact-command recovery. P9-v1 does not execute this. Levels should unlock hand use at 1, ally wagering at 2, patterns at 3–4, deliberate high stakes at 5–6, table control at 7–8 and finite grand wagers at 9–10; exact per-level library/pick coverage remains incomplete.

Six representative ability briefs: Wager Strike (base attack), Recut (base deck utility), Read the Table (base investigation), Double or Nothing (High Roller), Marked Pair (Card Sharp), Underwrite (Odds Broker). These are **not yet six fully structured spell records**. Complete schema rows, damage/AP tuning, node progression and native variants are explicit remaining deliverables.

## Five-test rationale

Fantasy: wagerer. Tactical: stake before outcome versus preserve hand. Resource: finite cards plus escrow. World: real House/Dead Pot practices, not universal luck magic. Trees: risk size, pattern preservation, allied underwriting. It cannot be a Fate Weaver tree because cards and stakes are its every-turn economy, while linking people is not.

</details>
