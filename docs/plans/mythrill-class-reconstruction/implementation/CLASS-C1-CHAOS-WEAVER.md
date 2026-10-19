# CLASS-C1 — Chaos Weaver: complete class-local implementation package

**Status: implementation-ready proposal for Class HeadQ / DeepSeek handoff, 2026-10-18. Content and class-local UI only. No application implementation is authorized by preparation of this package.** All numeric rules below are the recommended C1 tuning, not retroactively approved canon. There are no unresolved design alternatives for DeepSeek to invent. HeadQ may approve this complete proposal or request a specific revision; shared engine completion is not a prerequisite.

## 1. Recommendation, identity and source use

**Begin with Chaos Weaver.** Its six public physical possibilities form a small, inspectable class economy. It requires neither Gambler's private deck, Fate Weaver's multi-actor damage transfer, Deathcaller's actor roster, Lichborne's death return, nor Druid's body/stat replacement. It can be completely authored, checked and rehearsed in a class-local rulebook/workshop now. Its random commitments and anomalies still need Main HeadQ capabilities before automated shared play; this package does not pretend otherwise.

**Pitch:** “Choose which things may happen; spend those possibilities even when reality chooses the one you dislike.” Role: Wyrd damage / uncertainty control; secondary observational utility. Primary attributes: Intelligence / Spirit. No primary-element selector; Wyrd is this class's payload affinity, not an eight-element generalist replacement. Light clothing, staff or dagger and a finite stabilizing apparatus are proposed equipment training; no new equipment item IDs, armor calculations, HP formula or generic proficiency engine is introduced here.

**Weaknesses:** paid recovery, finite available symbols, unavoidable published Fracture branches, no healing, no free draw/exchange, no hidden reroll, one unresolved action and one anomaly. Its group verb is **publish and contain a finite set of possible consequences**, not foretell actual future facts, underwrite a wager or redirect another actor's damage.

Sources: active R1 `classes/chaos-weaver.md`; its six records in `classes/manifests/chaos-weaver-review-r1.json`; shared R1 timing; completed all-25 culture review and `headq-priority-compatibility.json`. C1 completes missing progression/trees/library and pins its new tuning. Keep all R1/v0 artifacts intact. No historical Mayhem spell/node is automatically transferred by similarity of name.

Latest settled roster direction remains: **Druid**, Augur content merged/assessed into **Fate Weaver**, Harbinger's proposed identity **Doomsayer**, **Oracle independent**; earlier Gambler/Fate Weaver/Chaos Weaver and Deathcaller/Lichborne restorations retained. No old application IDs are renamed by C1.

## 2. Deliverable and capability boundary

Ship one complete **class rulebook + manual tabletop workshop**: class identity, all rules, level1–10 choices, 97 authored spell/talent records, legal build previews, native proposal, accessible six-tile SVG and class-facing authoring inspector/export.

The workshop is entered from a clearly labeled **Reconstruction preview — manual only** button on the existing Classes rules page. It does not add a global selectable character class, change existing class counts, grant live spells/talents, write character/library/room state, or intercept casting. This is a bounded implemented class-content surface, not a new candidate-registration framework. The same data/SVG can later be consumed by approved class selection and HUD wiring without redefining rules.

| Can be implemented/tested now | Main Mythrill HeadQ supplies separately |
|---|---|
| Complete data, rendered rules/spell cards, build allocation preview and exact JSON export/import in the workshop | Global character/class registration and versioned save treatment when authorized |
| Pure six-tile conservation/choice legality calculator and local manual rehearsal, physical face entered explicitly | Trusted shared pre-result commitment, random sampling/roll custody and duplicate-safe class transitions |
| Pure SVG with read-only state + callbacks; local preview of available/committed/bound/spent | Party HUD authoritative state, privacy, cross-client sync, reconnect/restart durability |
| Branch odds, price, talent and native modification previews; unsupported labels | Actual AP/HP application, GM adjudication, owner consent and atomic receipts |
| Manual movement/ward/anomaly/rest worksheets with explicit confirmations | Spatial/ward/deferred-event/own-turn/rest/inventory executors and expiry |

`authoredOnly:true`, `executionEnabled:false`, `applicationMode:'manual-tabletop'` are fixed on all C1 exports. Even a simple damage-only row does not bypass current admission by using its displayed formula. No `eval`, opcode executor, generic program language, server module or effect callback is authorized.

## 3. Class-local data and resource rules

Content ID `chaos-weaver`, ruleset `cr-cw-1`; these identify the candidate packet, **not a new application class ID or an A1a binding whitelist entry**.

```text
tile IDs: S1,S2 = Surge; M1,M2 = Shift; F1,F2 = Fracture
state: {
 version:1, rulesetVersion:'cr-cw-1',
 available:TileId[], committed:TileId[], bound:TileId[], spent:TileId[],
 pending:null|{actionId,spellId,sourceLabel,targetLabel,primaryTileIds,
   continuationTileId:null|TileId,mapping,selectedTileId:null|TileId,
   recordedFaces:null|int[],phase},
 anomaly:null|{actionId,tileIds,centerLabel,radiusFeet,trigger,
   createdOwnTurn,expiresEndOwnTurn,profile},
 penalties:[{sourceActionId,feet,expiresBoundary,expiresOwnTurn}],
 usage:{completedRestId:null|string,oncePerRest:AbilityId[]},
 turn:{ownTurnNumber,apAvailable,remainingMovementFeet}, workshopOnly:true
}
```

1. Every one of the six IDs occurs in exactly one zone. A tile never changes symbol. Reject duplicate/foreign/missing IDs, contradictory pending/anomaly ownership or malformed imported state; preserve the rejected JSON as an exportable draft, not a repaired playable state.
2. At one **explicitly confirmed completed long rest**, after all pending actions/anomalies have settled, all six become available and once/rest uses clear. Initiative, level gain, class selection, view remount, short rest or reconnect never refills. The workshop requires a new manual rest label; this is a rehearsal check, not trusted event identity.
3. Fold the Odds costs1 AP and recovers one or two selected **spent** IDs. None spent means unavailable. Never recovers committed/bound IDs. No free per-turn recovery or symbol exchange. Repeating Fold requires another actual AP payment at the table.
4. Split Possibility costs2 AP: choose one available F and one available S or M; publish the exact ordered pair and all branches before the face. Both tiles become committed. Uniformly select one ID, then both become spent irrespective of result.
5. Default Split branches: **S:2d6 Wyrd**; **M:1d6 Wyrd and optional5ft caster displacement using remaining legal movement**; **F:1d6 Wyrd and caster movement−5ft until next own-turn start**. All targets/geometry/mitigation/critical/hit legality are GM-adjudicated; no hidden Evasion bypass or second attack roll is inferred.
6. Bias the Draw costs2 AP, both S plus one F: uniform ID sampling gives2/3 S,1/3 F. Use the Split S/F branches; all three are spent. C1 never changes tile weights or adds an invisible outcome.
7. Unsteady Ground costs2 AP: bind one M and one F in a visible5ft-radius circle within30ft. One anomaly; first enemy original voluntary entry draws once. M ends that actor's remaining movement for the current turn; F gives caster movement−5ft through **end of next own turn**. Either branch, expiry at endT+2, or paid1-AP dismissal sends both IDs to spent. No damage, refund, second target or forced-movement trigger. Occupants at creation do not count as entry. The table confirms paths and relationship; workshop never watches map pixels.
8. Second Possibility costs3 AP: ordinary Split plus one predeclared willing ally within30ft. After the retained primary branch, optionally spend one further available M for that ally's legal5ft displacement using its remaining movement; otherwise decline. The main result/Fracture stands. Exactly one derived follow-up; it generates no new draw, tile, reaction or anomaly trigger. The optional M must be reserved from availability before the primary draw if selected as a promised follow-up; unused reservation returns only after the recorded decline, never the primary tiles. It occupies `committed` while choice is pending.
9. C1 resolves the R1 wording ambiguity: branch selection/result is retained first, then the one continuation choice, then the GM records primary+continuation together. No repeated primary effect while that choice is pending. One unresolved action across all casts; no Fold/rest/native exchange while pending. An existing nonpending anomaly may coexist with a cast only if enough other IDs are available.
10. Before manual commitment, cancel freely. After commitment, no resource refund or new face from cancellation/timeouts. An impossible/unresolved branch stays locked until the table records settlement/GM void with a reason; a void never invents a favorable new result. The workshop has no automatic “timed out = failed” transition.
11. Uniform physical mapping is exact: sort committed IDs in S1,S2,M1,M2,F1,F2 order. Two IDs: d6 faces1–3 select first,4–6 second. Three IDs:1–2 first,3–4 second,5–6 third. Four IDs: d4 direct. Retain the mapping **before** entering the face. Damage dice are separate original dice, never reuse the selection face as damage. No digital RNG is needed for this deliverable.
12. Same-source Fracture penalty refreshes its published expiry; penalties from different actions use **largest feet reduction, not a sum**, to minimum remaining movement0. They never refund movement already used. Wards below prevent the stated assigned Wyrd damage before temp HP, once; strongest eligible C1 ward only, no stacking, no fate-transfer interaction inferred. Wards/timing are manual rules only.

## 4. Complete level progression

Level cap10; exactly **one optional spell pick at each level** from that level or an earlier unchosen pool. At least four newly available options and two nondamage options at every level. Core actions, passives, signatures and capstones do not consume a spell pick. No automatic tile-cap or damage scaling by level.

| Level | Total optional picks / talent budget | Core or progression event | New optional choices |
|---|---|---|---|
|1|1 /5|Six Tiles, Fold, Split, stabilizer care and explicit downside rules|01–04|
|2|2 /10|No new resource bank|05–08|
|3|3 /15|A signature can be bought after10 points in that tree|09–12|
|4|4 /20|No free reaction unlock|13–16|
|5|5 /25|No second anomaly or tile cap increase|17–20|
|6|6 /30|Recovery remains paid|21–24|
|7|7 /35|Derived continuations still one only|25–28|
|8|8 /40|Anomaly counterplay remains visible|29–32|
|9|9 /45|Finite high-level choices; no certainty capstone|33–36|
|10|10 /50|One fully funded tree can buy its capstone; hybrids keep all paid prerequisites|37–40|

Primary specialization is the first tree invested in, not three free signatures. Class-local respec preview recomputes legality and removes dependent ranks; it never rewrites a character's real talents. At a table, rest/training respec permission remains the campaign's existing policy, not a new free combat action.

## 5. Complete spell manifest — 49 active records

**Serialization defaults, explicit on every expanded record:** ACTION, own-turn use, mana0, somatic usable stabilizer, immediate unless listed, no cooldown unless “once/rest”, no reaction/save/critical modifier, no area or persistent effect except listed, Wyrd for damage. Target one visible enemy within30ft unless specified; utility ranges/subjects are explicit. “Step” consumes remaining legal movement and grants no additional movement allowance. Nondamage rows are **U**; damage rows **D**. Failure to satisfy an input refuses before commitment without partial change. All class tile prices are typed design data, not negative scalar resourceCost fields.

Stable optional IDs are `cw1_01`…`cw1_40` (name is not identity). Tree grants have fixed IDs shown below. Every branch damage/effect and every tile spend below is exhaustive; no favorable prose effect is implied. Core/Split-derived spells always spend **all** committed tiles, not only the selected ID.

|ID|Level/type/name|AP / exact tiles|Complete effect, target and duration override|
|---|---|---|---|
|01|1 D Fraying Bolt|2 / one F→spent|1d6 Wyrd; caster movement−5ft until next own-turn start. Deliberate deterministic low-resource basic, not a sample.|
|02|1 D Sideways Spark|2 / one M→spent|1d4 Wyrd; optional caster5ft step.|
|03|1 U Survey the Seam|1 / one M→spent|One visible inert object within10ft: identify one visible seam or likely mechanical load path, not hidden contents or structural immunity bypass; instant information.|
|04|1 U Fracture Brace|1 / one F→spent|Self ward2 versus next Wyrd assigned damage before next own-turn start; also caster−5ft movement to that start.|
|05|2 D Lancing Variance|2 / one S→spent|1d6+2 Wyrd. Deterministic basic giving up a Surge that could bias a set.|
|06|2 D Chosen Crosscurrent|2 / M+F sample|M:1d6+2 Wyrd and caster5ft step; F:1d6 Wyrd and normal Fracture penalty.|
|07|2 U Read Instability|1 / any one→spent|Observable anomaly within30ft; choose **one** actual material, rough-boundary or stabilizer fact. No future rolls, hidden identities or invented facts. ID is `cr1_chaos_weaver_read_instability` (alias cw1_07 in tables only).|
|08|2 U Counterweight|1 / F→spent|Touch a mundane carried load: +1 to one GM-called noncombat balance/handling check made before end of next own turn; caster−5ft movement to next start. Not advantage, armor or immunity.|
|09|3 D Discordant Arc|2 / S+F sample|S:2d6+2 Wyrd; F:1d6+2 Wyrd and normal Fracture penalty.|
|10|3 U Slip Tether|1 / M+F sample, self|M:caster10ft legal step; F:no step and normal Fracture penalty. Spend both; not teleport or escape from a binding without GM legality.|
|11|3 U Measured Shelter|2 / S→spent, willing self/ally30ft|Ward4 versus next Wyrd damage before next caster-turn start.|
|12|3 U Signal Coin|1 / M→spent|Touch one existing inert token: emits one declared audible click when physically jostled before endT+2, then inert. Does not sense invisible creatures, identify an intruder or create material.|
|13|4 D Torsion Lance|3 / S+F sample|S:3d6 Wyrd; F:1d6+2 Wyrd and normal Fracture penalty.|
|14|4 U Skewed Guard|2 / S-or-M +F sample, willing self/ally30ft|S:ward6; M:ward3 and caster5ft step; F:ward3 and normal caster Fracture. Ward expiry next caster-turn start, one Wyrd event.|
|15|4 U Inert Margin|1 / F→spent, touch|One mundane fragile object carried by caster: +2 to one GM-called noncombat check to stabilize it before endT+1; caster−5ft movement to next start. No automatic magical hazard shutdown.|
|16|4 U Shared Survey|2 / any one→spent|One willing ally within10ft participates in observing one actual visible anomaly within30ft. The table answers two distinct material/boundary/stabilizer questions to both; no hidden knowledge.|
|17|5 D Resonance Fork|3 / S+M+F sample|S:3d6 Wyrd; M:2d6 Wyrd and caster5ft step; F:1d6 Wyrd and normal Fracture. Uniform thirds, all spent.|
|18|5 U Warning Boundary|2 / M+F→bound, visible point30ft|5ft anomaly; first enemy voluntary entry: M creates an audible warning and optional caster5ft legal step; F gives caster−5ft to end next own turn. No attack/stop; expiry endT+2; same one-anomaly/dismiss rules.|
|19|5 U Stabilizer's Kit|2 / S→spent, self|Declare one carried mundane tool. +2 to one GM-called noncombat apparatus-calibration check this activity/endT+1. Does not manufacture tools, components or a free rest.|
|20|5 U Safe Rehearsal|1 / no tile, self, once/rest|+2 to one GM-called noncombat risk-explanation check about one currently legal published set in this scene, without commitment, tile movement or roll. Merely inspecting odds/branches is always free; this price buys only the check bonus, not access to basic information.|
|21|6 D Deep Shear|3 / S+F sample|S:3d6+3 Wyrd; F:2d6 Wyrd and caster−10ft until next own-turn start. Stronger branch buys a worse downside.|
|22|6 U Return Line|2 / M→spent, self|Up to15ft legal displacement along a previously observed clear route, using remaining movement. Not teleport, forced escape or obstacle removal.|
|23|6 U Retune Apparatus|2 / one chosen spent F→available, self|Recover exactly that F and give self ward4 to next caster-turn start. No other tile recovered; deliberately trades Fold's broad recovery for protection.|
|24|6 U Hold the Sample|1 / any one available→bound|Touch an actual inert material sample and preserve its observable arrangement until endT+2 or1-AP release; tile then spent. Occupies the anomaly slot; no living, active magical, temporal or limitless preservation.|
|25|7 D Crossgrain Ray|3 / S+M+F sample|S:4d6 Wyrd; M:2d6 Wyrd and caster10ft step; F:2d6 Wyrd and caster−10ft until next start.|
|26|7 U Passed Opening|2 / M→spent, willing ally30ft|Ally may immediately make one10ft legal derived displacement using remaining movement. No additional action, attack, reaction or resource generation.|
|27|7 U Joint Containment|2 / S+F sample, willing ally30ft|S:ally ward8; F:ally ward4 and caster−10ft until next start. One Wyrd event, expiry next caster-turn start; no ally tile pool.|
|28|7 U Trace Disturbance|2 / any one→spent|One visible mundane disturbance/anomaly30ft: identify direction of an actually observable change and one likely local stabilizer. No time travel, culprit identity or divination of future events.|
|29|8 D Fault Needle|3 / S+F sample|S:4d6+2 Wyrd; F:2d6+2 Wyrd and caster−10ft until next start.|
|30|8 U Counterseal|2 / S+F sample, point30ft|End **your own** anomaly: all its bound tiles become spent; S grants self ward6, F grants no ward and caster−10ft to next start. No hostile-effect dispel; impossible if an anomaly trigger is unresolved.|
|31|8 U Lateral Refuge|2 / M+F sample, self|M:20ft legal displacement; F:5ft legal displacement and caster−10ft until next start. Remaining movement still bounds both branches.|
|32|8 U Public Experiment|2 / S→spent|One visible apparatus/material and willing witnesses10ft: answer three distinct existing observable cause/boundary/stabilizer facts after a GM-adjudicated test. No generated loot or automatic success against an active hazard.|
|33|9 D Wyrd Crucible|4 / S1+S2+F sample|S:5d6 Wyrd; F:2d6 Wyrd and caster−10ft until end next own turn. All three spent; one target.|
|34|9 U Partitioned Shelter|3 / S+M+F sample, willing ally30ft|S:ward10; M:ward6 plus ally5ft derived step; F:ward4 and caster−10ft to end next own turn. One Wyrd event, ward expiry end caster's next turn.|
|35|9 U Unbind the Test|2 / any available tile→spent|Safely close **your own** inert Hold Sample/Signal Coin record early; its bound tile, if any, becomes spent; answer one observable failure-mode question. No undo of accepted outcomes or recovery of another caster's contents.|
|36|9 U Read the Whole Apparatus|3 / S+M→spent|Visible apparatus30ft: four distinct existing material/boundary/stabilizer/failure-path questions; no guaranteed correct future outcome, creature mind or unknown history.|
|37|10 D Finite Cataclysm|4 / S1+S2+M+F sample, once/rest|S:6d6 Wyrd; M:3d6 Wyrd and caster10ft step; F:2d6 Wyrd and caster−10ft through end next own turn. Uniform ID weights1/2,1/4,1/4; one enemy, no explosion.|
|38|10 U Sixfold Audit|3 / three distinct available IDs→spent, once/rest|Touch one visible inert apparatus/real anomaly; choose six distinct observable material/boundary/stabilizer/failure-path questions. Does not reveal hidden actors, passwords or future RNG.|
|39|10 U Final Safe Passage|3 / M+F sample, willing ally30ft, once/rest|M:ally20ft legal derived displacement; F:ally5ft and caster−10ft through end next own turn. All remaining movement/permission constraints stand.|
|40|10 U Shelter of Alternatives|4 / S+M+F sample, willing ally30ft, once/rest|S:ward14; M:ward8 plus ally5ft step; F:ward6 and caster−10ft through end next turn. One Wyrd event, ward expires end next caster turn.|

Core grants: `cr1_chaos_weaver_fold_odds` and `cr1_chaos_weaver_split_possibility`, both level1, exact rules §3; plus `cw1_dismiss_anomaly`, level1 utility ACTION1AP/mana0, self's one anomaly only, no new tile cost, instant: all its bound IDs become spent and the anomaly closes. Refuse if none exists or its trigger is unresolved. Dismissal is known but unusable until an actual binding is present, never a recovery pick tax. Six Tiles/stabilizer care/rest confirmations are class rules, not extra pickable spell records.

**Fixed data expansion:** use one closed class-local record shape below, not an executable Wizard schema. `resourceCost`, required null/empty fields and capability status are materialized on every record; no `||` defaults or omitted zero prices. Branch/ward/movement/expiry values are taken literally from the tables. `branchRule` is null for deterministic actions; sampled records contain the exact symbol outcomes and selection rule. Unknown imported fields are retained in raw draft data and prevent C1 validation; they are not stripped into supported status.

```text
{
 id, classId:'chaos-weaver', rulesetVersion:'cr-cw-1', name, level,
 source:'core'|'level-pick'|'talent', treeId:null|'probability-sculptor'|'anomaly-binder'|'cascade-weaver',
 spellType:'ACTION'|'PASSIVE', icon:'Psychic/Psychic Telepathy',
 resourceCost:{actionPoints:int,mana:0}, tileRule:{inputSymbols,zoneFrom,zoneTo,count,spendAllPrimary},
 target:{roles:string[],rangeFeet:int,maxSubjects:int},
 branchRule:null|{selection:'uniform-by-primary-tile-id',outcomes:{symbol:exactOutcome}},
 timing:{use:'own-turn'|'passive',expiry:null|exactBoundary,oncePerRest:boolean},
 damage:null|{formula,damageTypes:['wyrd']}, reaction:null, savingThrow:null,
 conditions:[], area:null|exactAnomalyProfile, continuation:null|exactOneChoiceProfile,
 rankValues:null|[rank1,rank2,rank3], requires:null|exactTalentPrerequisites,
 effectText:exactPublishedRule, sourceRefs:string[],
 authoredOnly:true, executionEnabled:false, applicationMode:'manual-tabletop',
 automatedCapabilities:[], manualRequirements:string[]
}
```

Instant information rows use a visible object/anomaly label as their one subject. Self+ally or enemy+predeclared-ally actions have `maxSubjects:2`; a line/circle's one trigger victim never means a multi-target attack. Passive talent records have explicit AP0/mana0 and empty tile inputs, and their lowest acquisition level derives from §6 gates. Anomaly and continuation profiles are closed, named C1 data with the parameters in this package, not a new opcode interpreter. Reusing a base Split branch **does not inherit Split-only talent modifiers** unless a row explicitly names that spell.

|Talent spell ID / grant|Level / AP / price|Complete rule|
|---|---|---|
|`cr1_chaos_weaver_bias_draw` / P05|3 /2 /S1+S2+F|§3 Bias; level gate plus node paid.|
|`cr1_chaos_weaver_unsteady_ground` / A05|3 /2 /M+F bound|§3 Unsteady Ground; level gate plus node paid.|
|`cr1_chaos_weaver_second_possibility` / C05|3 /3 /Split pair + optional M|§3 Second Possibility; level gate plus node paid.|
|`cw1_closed_distribution` / P18|10 /3 /two same-symbol S or M plus F; once/rest|Uniform three-ID draw. S:4d6 Wyrd; M:2d6 Wyrd+caster5ft step; F:2d6 Wyrd+normal Fracture. All three spent; no guaranteed branch, extra tile or second sample.|
|`cw1_last_boundary` / A18|10 /3 /M1+M2+F bound; once/rest|One visible10ft anomaly30ft, expires endT+3. First enemy original voluntary entry: M ends remaining movement; F gives caster−10ft through end next own turn. All three spent on trigger/expiry/dismiss. Never coexists with another anomaly.|
|`cw1_single_aftershock` / C18|10 /4 /Split pair + optional S or M; once/rest|Primary S:3d6 Wyrd; M:2d6 Wyrd+caster5ft step; F:2d6 Wyrd+normal Fracture. One predeclared willing ally30ft; optional extra S buys ward6 to next caster start, OR extra M buys10ft derived step. Reserve exact optional ID before primary draw; one choice, never both.|

Exactly **40 optional +3 core +6 active talent grants =49 active records**. The48 remaining talent nodes below each generate one passive authored spell record with three explicit ranks, for **97 total**. Native edge is an origin feature, not a98th pickable spell. No overlapping “exampleSpells” duplicate definitions.

## 6. Full three-tree talent specification — 54 nodes, 150 rank capacity

Each tree has18 nodes: sixteen3-rank passives, one1-rank signature (05), one1-rank capstone (18). **50 points each; 50 total character points, not150 allocatable.** Stable node IDs `cw1_ps_n01`…`n18`, `cw1_ab_n01`…`n18`, `cw1_ca_n01`…`n18`. Ordinary passive spell IDs `talent_spell_<nodeId>`. These do not reuse `talent-spell-<legacyId>` materializations.

All three trees use this complete layout/prerequisite table. Every listed predecessor must be **fully ranked**; prerequisites are AND. Gates count already-spent points in the same tree. Signature minimum level3; capstone minimum level10; all nodes obey5×level/50 global budget. Other minimum levels follow the point budget. Columns A/B are only layout, not automatic choices.

|Nodes|Point gate|Predecessor(s)|Max ranks / position|
|---|---|---|---|
|01 /02|0|none /none|3 each; columns0/2,row0|
|03 /04|5|01 /02|3 each; columns0/2,row1|
|05|10|03|1; column1,row2|
|06 /07|10|03 /04|3 each; columns0/2,row2|
|08 /09|15|06 /07|3 each; columns0/2,row3|
|10 /11|20|08 /09|3 each; columns0/2,row4|
|12 /13|25|10 /11|3 each; columns0/2,row5|
|14 /15|30|12 /13|3 each; columns0/2,row6|
|16 /17|35|14 /15|3 each; columns0/2,row7|
|18|45|05 AND16 AND17|1; column1,row8; those full chains in fact require49 prior points|

A legal full-tree allocation is3points in01,3in02,3in03,1in04, then05 for point11; complete04 and all remaining nodes in predecessor order, then18 as point50. Signature/grant must disappear from the preview if its prerequisite rank is removed. Do not reuse the existing global tree editor's fixed-tier assumptions or library-writing callbacks for this workshop.

**Rank semantics:** tuples are absolute rank1/rank2/rank3 values, not cumulative sums. Each row changes only the exact named parameter. Across hybrids, modifiers to the same `(spell,branch,parameter)` use the largest one; do not add several range/flat/ward bonuses targeting the same field. Different declared parameters may coexist. No talent reduces AP/tile prices, removes a Fracture downside, changes sample odds postcommit, increases6 tiles/one pending/one anomaly, or repeats a follow-up. Passive rank records are manual rule descriptions/preview modifiers, not applied live buffs.

### Probability Sculptor — spend more known possibilities, not hidden luck

|Node/name|Exact rank1 /2 /3 effect (05/18 are single-rank grants)|
|---|---|
|P01 Measured Reach|Split enemy range35 /40 /45ft.|
|P02 Clean Surge|Split Surge damage flat bonus+1 /+2 /+3.|
|P03 Read the Fracture|Split Fracture damage flat bonus+1 /+2 /+3; movement cost unchanged.|
|P04 Shared Notebook|Read Instability may answer2 /3 /4 distinct questions instead of1, still actual observable facts.|
|P05 Bias the Draw|Grant `cr1_chaos_weaver_bias_draw`.|
|P06 Extended Bias|Bias range40 /50 /60ft.|
|P07 Narrow Lance|Lancing Variance flat damage bonus+1 /+2 /+3.|
|P08 Calculated Arc|Discordant Arc Surge flat damage bonus+1 /+2 /+3.|
|P09 Shelter Arithmetic|Measured Shelter ward5 /6 /7 instead of4.|
|P10 Surveying Rod|Read Instability range40 /50 /60ft.|
|P11 Fraying Focus|Fraying Bolt flat damage bonus+1 /+2 /+3; downside unchanged.|
|P12 Published Proof|+1 /+2 /+3 to one GM-called noncombat check explaining a fully published finite distribution per completed-rest interval. No roll alteration.|
|P13 Guard Equation|Skewed Guard Surge ward7 /8 /9; other branches unchanged.|
|P14 Stable Bench|Stabilizer's Kit calibration bonus+3 /+4 /+5 instead of+2.|
|P15 Deep Calculation|Deep Shear Surge flat damage bonus+1 /+2 /+3, not its Fracture branch/cost.|
|P16 Audited Weights|Bias the Draw Surge flat damage bonus+1 /+2 /+3; also Closed Distribution's Surge when that capstone is learned.|
|P17 Declared Margin|Split Shift legal step10 /15 /20ft instead of5; also Closed Distribution's Shift when learned; remaining movement bounds both.|
|P18 Closed Distribution|Grant `cw1_closed_distribution`; does not refresh any once/rest use.|

### Anomaly Binder — place one avoidable, finite apparatus

|Node/name|Exact rank1 /2 /3 effect|
|---|---|
|A01 Ground Survey|Survey the Seam range15 /20 /25ft.|
|A02 Braced Interface|Fracture Brace ward3 /4 /5; penalty unchanged.|
|A03 Material Memory|Signal Coin jostle signal audible within20 /30 /40ft to normal listeners; no supernatural detection.|
|A04 Close Observation|Shared Survey answers3 /4 /5 distinct existing questions instead of2.|
|A05 Unsteady Ground|Grant `cr1_chaos_weaver_unsteady_ground`.|
|A06 Placement Line|Unsteady Ground placement range40 /50 /60ft.|
|A07 Broad Etching|Unsteady Ground radius6 /8 /10ft; still one first enemy trigger.|
|A08 Written Boundary|Before placement, Unsteady Ground may select entry OR exit /entry OR exit OR voluntary crossing of its centerline /any of those plus a named boundary segment; exactly one published trigger selected, never several. Newly legal geometry remains manual/unimplemented.|
|A09 Warning Call|Warning Boundary's caster step10 /15 /20ft instead of5, only its M branch and remaining movement.|
|A10 Patient Anchor|Unsteady Ground expiry endT+3 /T+4 /T+5 instead ofT+2; no extra trigger.|
|A11 Companion Shelter|Measured Shelter ward5 /6 /7; same field as P09 uses maximum, not sum.|
|A12 Careful Seal|Counterseal Surge ward7 /8 /9; cannot refund anomaly tiles.|
|A13 Inert Archive|Hold the Sample expiry endT+3 /T+4 /T+5; still inert-only and one anomaly slot.|
|A14 Edge Witness|+1 /+2 /+3 to one GM-called noncombat check to document an actually visible anomaly boundary per completed-rest interval.|
|A15 Calibrated Reagent|Retune Apparatus ward5 /6 /7; still recovers only one spent F.|
|A16 Last Survey|Warning Boundary placement range40 /50 /60ft; also Last Boundary's placement range when learned; no price reduction.|
|A17 Deep Etching|Warning Boundary radius6 /8 /10ft; also Last Boundary radius12 /14 /16ft when learned; still one enemy trigger.|
|A18 Last Boundary|Grant `cw1_last_boundary`.|

### Cascade Weaver — retain an option for one continuation

|Node/name|Exact rank1 /2 /3 effect|
|---|---|
|C01 Sideways Reach|Sideways Spark enemy range35 /40 /45ft.|
|C02 Sure Footing|Sideways Spark legal caster step10 /15 /20ft; damage unchanged.|
|C03 Crosscurrent Hand|Chosen Crosscurrent M flat damage bonus+1 /+2 /+3.|
|C04 Counterbalanced Load|Counterweight's noncombat check bonus+2 /+3 /+4 instead of+1.|
|C05 Second Possibility|Grant `cr1_chaos_weaver_second_possibility`.|
|C06 Passing Distance|Second Possibility ally step10 /15 /20ft; still one extra M, no extra allowance.|
|C07 Shared Reach|Second Possibility predeclared ally range40 /50 /60ft; enemy range unchanged.|
|C08 Slip the Knot|Slip Tether M step15 /20 /25ft; no effect on Fracture.|
|C09 Return Practice|Return Line legal displacement20 /25 /30ft.|
|C10 Optional Shelter|Second Possibility may predeclare an alternative follow-up: spend S for ward3 /4 /5 to its ally until next caster start. Choose S-ward OR M-move before primary commit; exactly one optional result.|
|C11 Passed Momentum|Passed Opening ally displacement15 /20 /25ft.|
|C12 Joint Reading|Joint Containment Surge ward9 /10 /11; downside unchanged.|
|C13 Crossgrain Method|Crossgrain Ray Shift flat damage bonus+1 /+2 /+3; legal movement unchanged.|
|C14 Refuge Route|Lateral Refuge M displacement25 /30 /35ft.|
|C15 One Clear Signal|+1 /+2 /+3 to one GM-called noncombat check coordinating a predeclared safe route per completed-rest interval; no automatic ally action.|
|C16 Aftershock Reach|Second Possibility's primary enemy range40 /50 /60ft; also Single Aftershock predeclared ally range40 /50 /60ft when learned.|
|C17 Last Continuation|Second Possibility optional M displacement25 /30 /35ft or learned optional S ward6 /7 /8; Single Aftershock optional M15 /20 /25ft or S ward7 /8 /9 when learned. Still exactly one follow-up, with remaining movement bounding displacement.|
|C18 Single Aftershock|Grant `cw1_single_aftershock`.|

**Capstone investment note:** nodes16/17 have an immediate named ordinary-spell effect and a capstone extension that stays inactive until the capstone is learned. Cards display both separately; do not grant capstone access early. No source execution or free signature is inferred from reaching a point gate.

## 7. Proposed native variant and acquisition

**One recommended native variant:** `drall_fexric`, **Sump Variance-Worker**. No automatic additional natives; every other compatible people may qualify through actual `anomaly_encounter`, `containment_training`, `stabilizing_interface`. Broken stabilizer blocks active class procedure until repaired; ancestry alone is neither competence nor a racial prohibition. The workshop displays these as proposed acquisition records, not a current heritage-resolver registration.

**Origin:** Alchemite variance containment around the Roulette Manifold/Sump workshops, distinct from Merrowport House wagering and from cosmic Mael-Zhul. Jix is a documented cross-school contact, not newly declared founder of all Chaos Weavers. Proposed institution **Variance Circle** is a workshop network, not an invented government or current canonical NPC. Present transmission as apprenticeship in surviving a real anomaly and maintaining a finite interface. Crisis: salvage scarcity and refugee workshops pressure the boundary between honest containment and rigging a sample.

**Native edge — Prepared Exchange:** once per completed long rest, before commitment and with no pending action, consume one actual prepared spare part; exchange one chosen spent ID with one chosen available ID of a different symbol (one each changes zone; no symbol changes); caster movement−5ft until next own-turn start. Additional AP0, mana0. Cannot touch bound/committed tiles, change a recorded result or waive the part. All six IDs conserved; no inventory support means **manual verification required, no automatic benefit**. This is not the free base exchange removed by R1. Normal class play works without this edge.

Proposed teaching phrase, **anonymous workshop instruction, not a historical NPC quotation**: “Name the failure before you invite it.” No canonical lore file or living/dead founder claim changes in this package.

## 8. Class-local SVG, HUD and authoring requirements

`ChaosWeaverResourceDisplay` is a pure SVG view-model component. Props: validated four-zone state, pending/anomaly summaries, disabled reason and `onInspect`; it owns no resource state, RNG, clock or storage. Six labeled geometric tokens: Surge triangle, Shift bent path, Fracture split diamond; each includes S1/S2/M1/M2/F1/F2. Four labeled lanes/counts, pending lock and recorded choice, one-anomaly/expiry text. Never reduce it to “Mayhem0–100” or six interchangeable pips.

Compact minimum240×64 viewBox, expanded panel wraps at360px; 44px touch buttons outside the SVG. Accessible text e.g. “Six tiles: three available, two bound, one spent; one anomaly; no unresolved draw.” Use `components/hud/calmBarPalette.js`; one muted Wyrd accent, INK/PAGE/RULE and BRICK only for genuine downside/invalidity. Text/hatching/shape redundancies, keyboard focus, Escape-close/focus-return, touch parity, reduced-motion static behavior. No glow/filters/looping motion or rank information hidden only in color.

Workshop tabs: **Rules; Level Progression; Spells; Talents; Origins; Rehearsal; Authoring/Export**. Rehearsal has explicit start-of-own-turn/end-of-own-turn/rest confirmations and human-entered physical faces; no scheduler or real actor refs. AP/movement are local counters entered for the worksheet, never real character pools. Prominent persistent “local rehearsal — does not spend AP, move tokens or apply effects” status. A newly opened session starts **uninitialized**, not silently refilled; start a new rehearsal explicitly or import the prior worksheet. Tab remounts preserve parent-held session state. Reset clears only this session's rehearsal, never class draft bytes. Closing/reloading has no durability guarantee; export/import preserves a manual worksheet. No automatic localStorage or new private-custody family.

Class-facing authoring inspector exposes typed tile prices (exact IDs chosen at rehearsal, symbol constraints authored), full branch table/denominators, AP/mana, targets/range, downside/expiry, one anomaly and one continuation constraints. It validates a closed list of these C1 record profiles; it cannot edit arbitrary JavaScript, paths or authored formulas. Replacing a branch may save as **unsupported custom draft**, never as executable C1. No new main Wizard step, reducer action or general resource-program evaluator in this package.

Export one complete packet `{schemaVersion:1,classId:'chaos-weaver',rulesetVersion:'cr-cw-1',authoredOnly:true,executionEnabled:false,classData,resourceRules,progression,spells,talents,nativeVariants,rehearsal:null|state}` with a matching import/inspect action. `primaryTileIds` alone supplies the selection mapping; a reserved `continuationTileId` is never included in that sample. Preserve exact numeric0, branch tables, ID arrays/order, costs/downside, rank values and unknown imported extensions as draft bytes; unknown extensions prevent treating that packet as validated C1. Export is data only. Do not insert these records into a user's existing library or claim existing Wizard load preserves unimplemented program fields.

## 9. Exact DeepSeek writable files

All application paths relative to `vtt-react/src/`. **One bounded class-local assignment after authorization**, not several engine phases. Preserve dirty work and reconcile collisions before creating files.

Create:

1. `data/classes/chaosWeaverData.js` — identity/origins/progression/49 active records, literal stable IDs; no global registration.
2. `data/talentTrees/chaosWeaver.js` —54 nodes and48 passive spell records, full rank values/prerequisites.
3. `data/classes/chaosWeaverRules.js` — pure C1 validation, legal build/odds and local manual-rehearsal planning only; no actual payment/RNG/effect execution.
4. `components/rules/chaos-weaver/ChaosWeaverWorkshop.jsx`.
5. `components/rules/chaos-weaver/ChaosWeaverWorkshop.css` — scoped root only, existing typography/tokens.
6. `components/hud/ChaosWeaverResourceDisplay.jsx` — reusable pure SVG, mounted in workshop only.
7. `data/classes/__tests__/chaosWeaverPackage.test.js`.
8. `data/classes/__tests__/chaosWeaverRules.test.js`.
9. `components/rules/chaos-weaver/__tests__/ChaosWeaverWorkshop.test.jsx`.
10. `components/hud/__tests__/ChaosWeaverResourceDisplay.test.jsx`.

Modify only:

11. `components/rules/ClassesDisplay.jsx` — import/workshop entry and local open/back navigation; current class catalogue and `onSelectClass` behavior preserved. Do not route the candidate through the current character-select callback.
12. `components/rules/__tests__/ClassesDisplay.test.jsx` — verify the new manual entry and retained existing selection.

Evidence only under `docs/plans/mythrill-class-reconstruction/implementation/evidence/CLASS-C1-chaos-weaver/`.

Read-only reuse: existing palette, icons/SVG helpers, content/lore-link formatting if its established API suffices, serializers for verification controls. Existing `ClassesDisplay` is the actual entry seam (there is no `ClassCodex.jsx`). Avoid `TalentTreeContent`'s live library-writing callbacks; preview ranks belong to the workshop. No global candidate registry, framework, dependency or broad component rewrite.

**Protected:** all `server/`; W1/A1a and original findings/probes; class index/display/resource/heritage/global talent registries; character stores/persistence; main Wizard files; P9/P12; global CSS; legacy Gambit/Harbinger/Augur and all other class content; assets/canonical Laws/lore. Main HeadQ receives engine requirements in33, not a request to expand this file list.

## 10. Acceptance matrix and executable checks

|Check|Required observation / evidence|
|---|---|
|Content completeness|Exactly40 optional records, four at every level with≥2 nondamage;3 core;6 talent actives;48 rank-passives;97 unique records; all references resolve. Optional07 uses its existing R1 stable ID, no duplicate cw1_07 payload.|
|Rank/build legality|18 nodes and50 max ranks per tree;54 nodes/150 capacity;5×level global budget≤50; no cycles/missing refs; signature at11 points earliestL3; full-tree point50 capstone; hybrid cannot borrow unpaid signature.|
|Pure-state conservation|After every valid/invalid rehearsal path exactly six IDs, unchanged symbols; no committed/bound recovery; same chosen action cannot be settled twice within this local session. No claim of network/restart dedup.|
|Odds|Explicit pair1/2, Bias2/3–1/3, triad1/3, Cataclysm1/2–1/4–1/4; mapping fixed before face; separate damage dice.|
|Costs/downside|All49 active AP/mana match tables plus native0/0; F downside never silently removed; all primary committed IDs spent on every branch; unused continuation reservation returns only on explicit decline; Fold paid; no rest/encounter/talent/preview refill.|
|Lifecycle worksheets|Manual anomaly trigger/expiry/dismiss→spent; original-voluntary filter visible; one continuation/no redraw; choice remains pending; rest refuses unresolved records. No timers or actual map movement.|
|Natives|Prepared Exchange requires part/once-rest/no-pending/different symbols; swaps exact two zones, consumes part on tabletop, records penalty; no native benefit autoexecutes.|
|Rank effects|All tuples expanded exactly; highest-rank absolute values, same-parameter hybrids use max; capstone-only nodes visibly inactive until grant; no free AP or hidden probability change.|
|Round trip|Export→import→export exact JSON-equivalent packet; explicit0 preserved; malformed/unknown draft retained but not certified; original R1 records/source not overwritten.|
|Mounted UI|Real workshop entry, all tabs, locked ranks, selection/commit/manual result/pending choice/settle/export/import; pureSVG and keyboard/touch/error views work with actual production components.|
|Compatibility|Existing class click still invokes original callback; no new globally selectable ID, no live talent/library writes, no save migration, no call to servercast/actor/payment service from workshop.|
|Preservation|Entry/current hashes for every protected W1/A1a/P9/P12 source and old class registry; scoped diff only12 named paths plus evidence; preserve concurrent work.|

Example manual witnesses for each tree (level3,4AP,15 points, its05 learned):

- **Probability:** T1 Bias2AP S1/S2/F1 selects F1, d6=3; Fold1AP restores S1/F1. T2 Fold1AP restores S2, Bias2AP S1/S2/F2 selects S2, damage3+4=7. T3 Fold1AP S1/F2; Split2AP M1/F1 selects M1, damage4, optional5ft legal step. Other symbols/IDs unchanged; no automatic gain.
- **Anomaly:** T1 Unsteady2AP M1/F1 bound, Split2AP S1/F2 selects S1 for7 damage. Enemy voluntary entry selects M1 and ends remaining movement; both bound IDs spent. T2 Fold1AP M1/F1, Unsteady2AP binds them again. T3 enemy avoids it; spend1AP dismissal to spent, Fold1AP restores M1/F1. No avoided-trigger refund.
- **Cascade:** T1 Second3AP S1/F1 with M1 reserved, selects S1 for7; take ally5ft continuation, all3 spent. T2 Fold1AP S1/F1, Second3AP pair with M2 reserved selects F1 for3; decline continuation, M2 available, original Fracture remains. T3 Fold1AP S1/F1 then Second3AP with M2, selects S1; interrupted continuation remains locked until explicit recorded choice. No repeated primary damage.

From `D:\VTT\vtt-react` after implementation:

```powershell
$env:CI='true'; npm test -- --watchAll=false --runInBand --runTestsByPath src/data/classes/__tests__/chaosWeaverPackage.test.js src/data/classes/__tests__/chaosWeaverRules.test.js src/components/rules/chaos-weaver/__tests__/ChaosWeaverWorkshop.test.jsx src/components/hud/__tests__/ChaosWeaverResourceDisplay.test.jsx src/components/rules/__tests__/ClassesDisplay.test.jsx
```

Run scoped eslint on those12 paths, `git diff --check`, and Playwright on the real rules-page entry at desktop1280px/narrow360px, keyboard, touch-equivalent, reduced motion. Capture snapshots before commitment, locked pending choice and after settlement/export; report mocks explicitly. This is one-client class-local UI/tabletop rehearsal acceptance. No two-client persistence, trusted randomness or engine acceptance is claimed or required. Protected engine bytes unchanged means no broad P9/P12 build/suite is justified; run their focused controls only if a future separately authorized change touches their seam. No foreground webpack build.

## 11. Compatibility, rollback and delivery gate

Keep `gambit`, `harbinger`, `augur`, Shaper/Apex/Revenant and historical Chaos Weaver IDs, spells, talent allocations, acquisitions and assets. Mayhem0–100 never converts to six tiles. Doomsayer does not inherit this sample bag because it used to have chaos prose. Fate Weaver's Augur assessment does not add its dual pools here. New candidate packet IDs must not alias old IDs or silently grant existing class heritage edges.

Rollback removes the workshop import/entry and these new class-local files only. Preserve exported/manual campaign packets and all prior content; do not delete personal libraries, undo accepted room outcomes, refund costs, roll back shared engines or mass-rewrite saves. No existing live save schema is changed, so no migration/rollback converter is needed.

**Only actual gate:** HeadQ approval/implementation authorization for this complete proposed C1 content-and-workshop scope. There are **no unanswered creator choices that prevent preparing/implementing the approved class-local package**. Native institution/edge and numerical tuning are concrete recommendations in this package, not an additional questionnaire; HeadQ may accept/revise them without delaying the base library. Engine support is explicitly outside acceptance, never a prerequisite for finishing this class design/content.

**DeepSeek instruction:** Implement exactly this data/rules/workshop package after authorization; no new engine work or invented content. Return49active/48passive manifest,54nodes/three50-point proofs, the three manual examples, actual mounted UI evidence, source hashes/diff and explicit unsupported list. Do not describe authored data, a rehearsal transition or an SVG as a working shared cast.

**Next roster cohort:** Gambler + Fate Weaver/Augur-preservation assessment, using their existing dossiers; then Deathcaller/Lichborne, Druid/Hunter, Doomsayer/Oracle/Animist. These are bounded content deliveries, not new infrastructure phases or roster removals.
