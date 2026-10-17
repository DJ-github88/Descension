# Chaos Weaver — HeadQ review R1

**PROPOSED; review-ready design, not implementation or final roster approval.** R1 is the active recommendation. The investigation-v0 draft below is preserved but superseded.

Shared timing/transfer/schema: [R1 contract](../29_PRIORITY_REVIEW_RULES_AND_SERIALIZATION.md). Evidence and native recommendations: [all25 cultural review](../28_HERITAGE_REVIEW_AND_PRIORITY_ORIGINS.md).

## Fantasy and repeated decisions

Choose a transparent set of possibilities before the draw, then live with its recorded consequence.

**Repeated decisions:** Which symbols/odds to commit; spend AP recovering or attacking; reserve two tiles in a visible anomaly; after a recorded branch pay for one bounded continuation rather than reroll.

**Role, complexity and weaknesses:** High-complexity uncertainty controller. Finite options, published downside and paid recovery replace automatic fill-to-catastrophe pressure.

## Exact proposed state, operations and reset rules

```json
{
  "version": 1,
  "type": "chaos-tiles",
  "tiles": [
    {
      "id": "S1",
      "symbol": "surge"
    },
    {
      "id": "S2",
      "symbol": "surge"
    },
    {
      "id": "M1",
      "symbol": "shift"
    },
    {
      "id": "M2",
      "symbol": "shift"
    },
    {
      "id": "F1",
      "symbol": "fracture"
    },
    {
      "id": "F2",
      "symbol": "fracture"
    }
  ],
  "zones": [
    "available",
    "committed",
    "bound",
    "spent"
  ],
  "pendingActionMax": 1,
  "activeAnomalyMax": 1,
  "longRest": "six available; no encounter refill"
}
```

1. All six IDs occur in exactly one of available/committed/bound/spent. R1 removes v0’s free symbol exchange. Fold the Odds1 AP recovers1–2 exact spent tiles only, never committed or bound tiles.

2. Split2 AP commits Fracture plus Surge/Shift. Draw uniformly by tile ID and spend both. Surge:2d6 Wyrd. Shift:1d6 Wyrd plus optional legal5ft caster movement. Fracture:1d6 Wyrd and caster movement−5ft until next own turn. All branches are known before committing.

3. Bias2 AP commits S1+S2+one Fracture for2/3 Surge and1/3 Fracture. All three are spent. Physical-dice uniform bins are fixed before the roll; a digital selected ID is retained before presentation.

4. Anomaly2 AP binds one Shift/one Fracture in a visible5ft-radius circle within30ft. First enemy voluntary entry draws once: Shift ends its remaining movement this turn; Fracture slows caster5ft through the END of the next own turn, so an off-turn trigger has a real next-turn cost. One anomaly maximum; expiry endT+2. Trigger, expiry or1-AP dismissal sends both to spent, never available.

5. Cascade3 AP commits a normal two-tile split and declares a willing ally before randomness. After its recorded branch, spend an additional available Shift to move that ally5ft legally, or decline. Primary result/penalty stands, no new draw, one follow-up only. Interrupted choice persists; declining never refunds the primary action.

6. Completed long rest resets all six only after unresolved actions settle. Encounter toggles/reconnect never refill. Invalid precommit choices mutate nothing; pending committed contents/results remain locked for exact recovery.

## Three specializations — different behavior

| Tree ID/name | Player behavior | Exact R1 variation/signature | Weakness | Later advancement direction |
| --- | --- | --- | --- | --- |
| probability-sculptor / Probability Sculptor | Exhaust more options to bias a transparent declared distribution. | Bias the Draw commits three actual tiles for2:1 odds. | Needs both Surge IDs and spends them even when Fracture wins. | Later: one bounded precommit substitution/weight choice, never post-result replacement. |
| anomaly-binder / Anomaly Binder | Tie up options in a place the enemy may avoid. | Shift/Fracture stay bound in one visible anomaly and cannot be used or recovered elsewhere. | Placement, voluntary entry and expiry can deny a payoff; no tile refund. | Later: explicit finite geometric conditions, not unbounded zones or secret membership. |
| cascade-weaver / Cascade Weaver | Keep a useful extra tile for a continuation after the primary branch is known. | Optional Shift buys the predeclared ally a5ft move; primary downside remains. | 3 AP, extra resource and constrained ally/path; recovery must preserve a pending choice. | Later: small one-step continuation whitelist, never recursive surges. |

Signatures are level3, one-point talent nodes after10 points in the same tree. First investment chooses the primary tree; a later hybrid pays every prerequisite and still shares one class state/caps. Full50-point nodes/ranks remain later content, not implicitly granted here.

## Legal three-turn example

Level3 Probability Sculptor; Bias learned with11/15 talent points. All six tiles available; no anomaly/pending choice. Enemy is legal within30ft; caster has the stated movement.

| Turn | Actions/recorded results | AP arithmetic | Resource/effect arithmetic |
| --- | --- | --- | --- |
| T1 | Bias2 AP commitsS1/S2/F1; physicalmappingdraw6 selectsF1;damage d6=3. Fold1 AP restoresS1/F1. | 4−2−1=1 | Available6→3→5; spent0→3→1(S2). Fracture−5ft untilT2start; assigneddamage3. |
| T2 | Penaltyexpires. Fold1 AP restoresS2. Bias2 AP commitsS1/S2/F2; recordedS2;damage2d6=3+4. | 4−1−2=1 | Available5→6→3(M1/M2/F1); spent1→0→3; assigneddamage7. No automatictile regeneration. |
| T3 | Fold1 AP restoresS1/F2. Split2 AP commitsM1/F1;recordedM1;damage d6=4 and optionallegal5ftmove. | 4−1−2=1 | Available3→5→3; spent3→1→3. SixuniqueIDs conserved; no secondbranchdraw. |

Unspent AP is left unspent. No signature from another unlearned tree is borrowed. Incoming enemy consequences are separately GM-confirmed events, not free caster actions. SharedR1 specifies legality assumptions and timing; the current VTT does not automatically execute the new mechanics.

## Noncombat use

Read Instability spends a real tile to ask one observable material/boundary/stabilizer question. It diagnoses actual anomalies; it does not invent setting facts or tell the future.

## Native origins and acquisition — recommended, not current canon

anomaly_encounter + containment_training + stabilizing_interface: actual finite apparatus or bodily interface. House wager initiation alone does not qualify.

**Institution, founder/transmission and current crisis:** PROPOSED Alchemite Variance Circle at Sump workshops/Roulette Manifold, influenced by Jix contact without declaring her already its founder. Wider Wyrd ecology is not universally Keth’s creation.

| Recommended native ID/title | Bounded advantage | Paired cost/limitation | Cultural crisis |
| --- | --- | --- | --- |
| drall_fexric / Sump Variance-Worker | Once per completed long rest, a prepared device exchanges one spent tile with one available tile of a different symbol before committing an action. IDs/symbols/count stay conserved. | Consumes one actual spare part from the prepared device (0 additional AP) and imposes caster movement−5ft until next own turn. Once/rest; cannot touch committed/bound tiles or choose an outcome. The material/position price is real, not a free base exchange. | Variance workshops face guild refugees and insist containment differs from rigged House wagers. |

These are19 proposed native pairings across the seven, not current registry edits. Every edge needs evidence, full native/rare method/body validation and an enforced paired cost before automatic benefit claims. Native access presumes training; it does not grant power by birth. Other peoples may qualify positively; raw parent hardBlocks are not copied.

## Six fully structured representative abilities

Complete canonical review payloads: [chaos-weaver R1 JSON](manifests/chaos-weaver-review-r1.json); [all42 records](../evidence/headq-seven-abilities.json). Each includes stable ID, source/level, AP/mana, typed cost/gain/operation, damage/target/range/area/duration/check/reaction/cooldown/conditions, effect configuration, talent/heritage interactions, dependencies and verification. “Structured” here refers to the proposedR1 schema, not current application admission.

| Stable ID/name | Level/content source | AP/mana | Opcode/class price | Effect/target/expiry |
| --- | --- | --- | --- | --- |
| cr1_chaos_weaver_fold_odds / Fold the Odds | 1 / class-feature | 1/0 | tiles.fold: 1 AP;0 class currency. | Recover up to two exact spent tiles. Recovering gives up an action and never changes a tile’s symbol or creates a seventh possibility. Target {"targetingType":"self","rangeType":"self","rangeDistance":0,"targetRestrictions":["self"],"maxTargets":1}; duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"} |
| cr1_chaos_weaver_split_possibility / Split Possibility | 1 / class-feature | 2/0 | possibility.split: 2 AP; two available tiles, one must be Fracture. | Commit two differently-symbolled tiles including Fracture, then draw uniformly from that declared set. Resolve its published branch and spend both tiles. Target {"targetingType":"single","rangeType":"ranged","rangeDistance":30,"targetRestrictions":["enemy"],"maxTargets":1}; duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"} |
| cr1_chaos_weaver_read_instability / Read Instability | 2 / spell-pick | 1/0 | instability.read: 1 AP; one exact available tile to spent. | Spend one available tile to diagnose one observable local instability: its affected material, rough boundary or stabilizing interface. You do not create hidden facts or receive a future roll. Target {"targetingType":"single","rangeType":"ranged","rangeDistance":30,"targetRestrictions":["observable-anomaly"],"maxTargets":1}; duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"} |
| cr1_chaos_weaver_bias_draw / Bias the Draw | 3 / talent-signature / probability-sculptor | 2/0 | possibility.bias: 2 AP; both Surge tiles and one Fracture. | Commit two Surge tiles and one Fracture tile for a transparent2:1 distribution. All three are spent regardless of which branch is selected. Target {"targetingType":"single","rangeType":"ranged","rangeDistance":30,"targetRestrictions":["enemy"],"maxTargets":1}; duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"} |
| cr1_chaos_weaver_unsteady_ground / Unsteady Ground | 3 / talent-signature / anomaly-binder | 2/0 | anomaly.bind: 2 AP; M/F tiles available ->bound until trigger/expiry/dismissal. | Bind one Shift and one Fracture tile in a visible small anomaly. First original voluntary enemy entry draws once: Shift ends its movement this turn; Fracture slows you5ft through the end of your next own turn. Target {"targetingType":"area","rangeType":"ranged","rangeDistance":30,"targetRestrictions":["visible-legal-point"],"maxTargets":1}; duration {"durationType":"own_turns","durationValue":2,"durationUnit":"subsequent_caster_turn_end"} |
| cr1_chaos_weaver_second_possibility / Second Possibility | 3 / talent-signature / cascade-weaver | 3/0 | possibility.cascade: 3 AP; two main tiles, optional third available Shift spent only if follow-up chosen. | Commit a normal two-tile split. After its recorded branch but before effect commitment, you may spend one additional available Shift tile to move one predeclared willing ally5ft. One follow-up only, never a new draw. Target {"targetingType":"multi","rangeType":"ranged","rangeDistance":30,"targetRestrictions":["enemy","willing-ally"],"maxTargets":2}; duration {"durationType":"instant","durationValue":0,"durationUnit":"instant"} |

## Progression and remaining-content manifest

Core management features are granted separately from exactly one optional spell pick per level. Talent budget remains5/level, cap50. Level advancement does not silently increase resource caps. The following is a bounded production requirement list, not an invented complete library around unapproved mechanics.

| Level | Progression outline | Class-specific remaining deliverable |
| --- | --- | --- |
| 1 | Starting resource features plus a level1 choice pool; recovery is never a mandatory spell-pick tax. | Alternative basic branch/defense choices |
| 2 | Noncombat/utility choices; catalogue preparation and actual institutional acquisition. | Diagnosis beyond Read Instability |
| 3 | Three representative signature nodes, each requiring10 tree points plus its1-point node. | Three signature nodes/prerequisites |
| 4 | Defensive/counterplay choices; any reaction content waits for its actual timing contract. | Defensive branch choices |
| 5 | Distinct permitted uses of the same resource, not automatic larger banks or extra actors. | Finite anomaly conditions |
| 6 | Exploration/support and meaningful resource expenditure/recovery tradeoffs. | Recovery/exhaustion tradeoffs |
| 7 | Advanced positional, entity, commitment or trait choices appropriate to this class. | One-step continuation variety |
| 8 | High-level counterplay with explicit interruption and recovery behavior. | Anomaly counterplay |
| 9 | Finite high-level expression, never unbounded probability, actors or immortality. | Bounded large effects |
| 10 | Three separately authored capstones retaining the reviewed core invariants unless HeadQ approves a new version. | Capstones conserving six tile identities |

Every remaining item still needs stable IDs, legal choice pools, full records and witnesses after core review. The three representative signatures do not equal three complete talent trees.

## Spell Wizard and serialized fields

Actual tile multiplicity, published branches/downside, uniform sampling, reservation/expiry and one optional follow-up with a predeclared ally. Probabilities derive from finite IDs, not hidden arbitrary weights.

Use explicit resourceCost.actionPoints/mana and classResourceProgram{version,domain,op,args}, with classId/rulesetVersion pinning ownership. No duplicated scalar class cost/gain. Current App load enumerates fields and would drop a new top-level program: load/review/reducer, both saves, normalizer, templates/export/card and execution admission all need explicit support. RESOURCE_PROGRAM and own-turn duration/cooldown terms are proposed extensions.

## Runtime, authority, synchronization and persistence

**Existing:** local resource planners, the three other P9 typed payment homes, exact actor refs/revisions, owner/GM accepted receipts, private intent custody, personal/room codecs and manual GM adjudication.

**Missing for this proposal:** CR-A1, CR-R1, CR-E1, CR-D2-outcome-bag, CR-E2-deferred-consequence, CR-G1-zone-membership. None of these six definitions is admitted by current P9 just because JSON exists.

Room authority owns attached class state, active effects and actors; personal preparation/snapshot is a different home. Reuse existing authority through reviewed named extensions, not a parallel combat engine. [Lifecycle contract](../implementation/CR-L1-AUTHORITATIVE-LIFECYCLES.md) defines commitment, event timing, cancellation, deduplication, reconnect, checkpoint and owner projection. No refill/draw/actor recreation on disconnect.

## HUD/SVG, menus and tooltips

Six-symbol apparatus with available/committed/bound/spent lanes; locked distribution/result and pending-choice marker. Expand exact IDs, payoffs and anomaly expiry.

Import calmBarPalette: etched parchment geometry, one accent, BRICK danger and text/hatching redundancy; no filters, glow or looping motion. Focus/touch details must provide every hover explanation. SVG derives state and issues intents; it never owns or mutates the economy.

## Migration and compatibility

Preserve Gambit and Harbinger. Mayhem never automatically becomes tiles. Exact historical Chaos Weaver/Doomsayer transfers remain original-assignment work; old IDs/allocations remain compatible. Newcr1_* records do not reuse an existing Mayhem home.

Exact relevant legacy spell IDs, tree/node IDs and materialized talent-spell IDs are listed in [priority compatibility index](../evidence/headq-priority-compatibility.json). Disposition is preserve-legacy/no-automatic-remap, not approved transfer. Original profiles/saves/assets/native relations remain. Even a restored historical ID needs a new explicit ruleset version; unknown old saves are never silently read asR1.

## Closest overlaps and independent existence

Harbinger causes a scheduled calamity; Chaos Weaver deliberately chooses uncertainty and exhausted options. Gambler stakes a bankroll/hand; Fate Weaver routes a reserved relationship. These are distinct repeated decisions.

## HeadQ choice and consequences

The Druid player-facing name and selective familiar-naming principle are approved; Hunter remains a working name. R1 economy, balance, specializations and native/institution records still need HeadQ approval; engine extensions need their own contracts. Preserve Shaper IDs/compatibility until explicit migration approval. The name imports no conventional Druid rules, worship, pet requirement or heritage assignment. No remaining full-library or50-point-tree detail is delegated to an implementer to invent.

<details>
<summary>Archived investigation-v0 — preserved, superseded by R1 above</summary>

# Chaos Weaver — deliberate uncertainty design

**DESIGN INTENT:** mandatory independent restoration. **PROPOSED:** all new mechanics. **Status: design draft; no current execution claim.**

## Evidence and pitch

**HISTORICAL:** old Chaos Weaver explicitly used non-spendable Mayhem 0–100, escalating amplification, unavoidable d100 Wild Surge and dissociation. Four historical trees were registered: Reality Bending, Entropy Control, Chaos Dice, Wild Magic. Current Harbinger still has Mayhem 0–100 and a Wild Surge marker (`harbingerResourceContract.js:3–15`). This is strong mechanical-overlap evidence; exact spell/node transfer remains to trace. Creator intent to restore Chaos Weaver does not require restoring the old pressure gauge unchanged.

**Recommended:** Chaos Weaver. Alternatives: Wild Mage, Chaos Mage, Anomaly Weaver, Entropist. Introduction: “You do not ask what will happen. You decide which things are allowed to happen, then let reality choose. Build a favorable set of possibilities without pretending danger has vanished.” Combat: flexible controller with explicit variance choices. Noncombat: controlled anomalies, strange routes and bounded experimental outcomes. High complexity; neither guaranteed catastrophe nor unrestricted random nonsense.

## Proposed finite outcome-bag system

Six uniquely identified tiles, two of each symbol: `surge`, `shift`, `fracture`. All tiles are in `bag`, `committed`, or `spent`, exactly once. No scalar Volatility bank. Each own turn, once, player may exchange one spent tile for one bag tile of a different symbol; identities remain conserved and change is recorded. Encounter opening uses the fixed six-tile set; resetting initiative cannot regenerate it.

An action chooses two or three available bag tiles **before** randomness. At least one chosen tile must be a downside-enabled `fracture` for amplified actions. All chosen tiles move to committed. Draw uniformly from the committed set, record selected tile ID, execute its published branch, move **all** committed tiles to spent. This is sampling from a declared distribution, not choosing the best branch after the draw.

Base “Fold the Odds” is 1 AP and recovers up to two spent tiles to bag, with no effect/damage. Ordinary unamplified action may use one tile with its fixed minor effect. Empty bag remains playable through recovery; no spell that generates free extra tiles. Unknown receipt preserves the exact committed set and selection. RNG protocol/privacy remains an engine decision, not an assertion that a client can prove honest randomness.

Example branch table for an amplified spatial strike: Surge = published larger damage; Shift = published lesser damage plus 5-ft optional movement; Fracture = published lesser damage plus caster loses 5 ft of movement until its next own turn. These are example semantics; exact mitigation/check/forced-movement rules must be settled separately. No lethal surprise effects hidden behind a generic Wild Surge label.

## Three trees

| Tree | What the player does | Resource change | Signature | Weakness | Capstone direction |
|---|---|---|---|---|---|
| Probability Sculptor | Chooses a weighted branch set with transparent downside | May commit a duplicate symbol as weight, paying the extra tile | Bias the Draw: choose 2 Surge/1 Fracture for 2:1 odds | Three tiles exhausted for one result | Rewrite one unused branch before commitment, never after result |
| Anomaly Binder | Places one finite environmental anomaly with explicit options | Reserve tiles in one object until triggered or dismissed | Unsteady Ground: one marked location with two declared consequences | Reserved tiles unavailable for attacks, object can be avoided | One bounded two-step anomaly, not recursive world alteration |
| Cascade Weaver | Chooses whether to spend a second committed operation after first result | Branch may offer one optional follow-up with its own tile cost | Second Possibility: spend remaining tile for a small, published continuation | Cannot continue on empty bag; one follow-up maximum | One finite paired sequence under approved reaction/exchange rules |

These are new distinct trees, not renamed old elemental damage bonuses. Full 50-point nodes, rank effects and three-turn tree examples remain to specify.

## Three-turn example

Initial bag S1/S2/M1/M2/F1/F2, spent none.

1. **T1:** Commit S1/S2/F1 to a three-tile action (2 AP). Distribution 2/3 Surge, 1/3 Fracture. Recorded draw F1. Resolve published downside branch, then all three move to spent. Bag M1/M2/F2; no reroll.
2. **T2:** Fold the Odds (1 AP), recover S1 and F1. Bag M1/M2/F2/S1/F1, spent S2. Commit M1/F2 (2 AP); choose movement-heavy odds deliberately. Draw M1, resolve Shift; both become spent. Bag M2/S1/F1.
3. **T3:** Commit S1/F1 (2 AP): 1/2 Surge, 1/2 Fracture. Draw S1; resolve Surge, both spent. Retain M2 for a small predictable spatial utility next turn rather than exhausting everything.

There is no growing pressure meter, Fortune wager or fate-link graph. The risk is chosen distribution and exhausted options. The player can explain the odds before casting.

## Lore and heritage review

**CONFIRMED leads:** Alchemite intentional variance/roulette catastrophe, actual breach gradients in Harbinger provenance, and wider Wyrd ecology. None establishes that all Chaos Weaver magic comes from Keth Amar. All native assignments remain **UNRESOLVED** until complete cultural audit. An Alchemite experimental school is a strong candidate; a Lumian/Kordak school needs actual institution/body-interface evidence, not “they are magical.”

Proposed acquisition: survive a bounded anomaly encounter, learn containment and commit a stabilizing device/interface; incompatible state is an unusable interface, not a moral alignment. Proposed order “The Unclosed Circle” is an unapproved new name, not recovered canon. Founder/current leader/location require creator review. Candidate Alchemite interpretation: Sump Variance-Worker, one prepared device capability balanced by Tilt/repair obligations; no free outcome choice.

## SVG/UI/wizard

Compact probability apparatus: six engraved tiles in bag/spent lanes, committed set outlined, selected outcome notch after acceptance. Never a fake “chaos percentage” bar. Expanded: exact tile IDs/symbols, declared distribution, published branches, current commitment and last accepted selection. Wizard: bounded branch table, integer weights/actual tile multiplicity, downside payload and maximum follow-up. Preview lists every outcome and its probability without rolling.

## Runtime/progression

Needs immutable choice-before-randomness, exact tile conservation, finite branch payload validators and existing same-command recovery. Anomaly objects need persistent area/entity support; Cascade needs bounded exchange semantics. Current P9 cannot execute them. Suggested progression: tile actions1, recovery/branch reading2, bias3, utility branch4, reservation5, counter-anomaly6, bounded sequence7–8, finite capstone9–10. Six ability briefs: Fold the Odds, Split Possibility, Bias the Draw, Unsteady Ground, Second Possibility, Seal the Anomaly. Full structured spell records are outstanding.

</details>
