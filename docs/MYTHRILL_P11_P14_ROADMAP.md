# Mythrill P11–P14 roadmap: a playable Prism combat table

Created 2026-10-16 by HQ authorization, after P10 integration. The original
roadmap ([MYTHRILL_NEXT_PHASE.md](MYTHRILL_NEXT_PHASE.md) §26) ends at P10 and is unchanged.
This document adds four bounded phases. **At creation only P11 was authorized.** Later bounded
authorizations/status are recorded below; each further slice still needs its own contract/go-ahead.

> **Latest delivery, 2026-10-21:** [P14-C3](MYTHRILL_PROJECT_14_C3_CONTRACT.md#implementation-and-evidence)
> Shield Bash manual-result adapter is implemented/review ACCEPT, Build1 C3 parity and App2 PASS.
> Exact GM-selected actors and retained result identity use C2's shared Stunned path. Rolls/costs/
> eligibility/save/expiry remain manual; this is neither full Shield Bash execution nor P14 completion.
>
> **Preserved C2 delivery:** [P14-C2](MYTHRILL_PROJECT_14_C2_CONTRACT.md#implementation--evidence)
> bounded Stunned is implemented/review ACCEPT, Build2 compilation/C2 client parity and App5 PASS.
> Same C1 condition spine; supported actions/reactions/voluntary player movement refuse, independent
> source timings retained. Saves/advantage/source resolution/expiry remain manual. P14 is not complete.
>
> **Preserved C1 delivery:** [P14-C1 §6](MYTHRILL_PROJECT_14_C1_CONTRACT.md#6-implementation-and-verification)
> shared PC Defending is implemented/review ACCEPT, Build3 compilation/C1 byte parity and App11 PASS.
> One exact-actor editor/P7 path, actual P12B2×/no-wear and retained-face removal/recovery. Prior action
> cost/expiry remain manual. E1a/W/B2 acceptance is carried forward; broader condition/trigger work stays open.

> **Latest E1a status, 2026-10-19:** original universal Riposte PC→original creature attacker execution
> delivered, bounded independent ACCEPT, optimized Build1/App2 PASS. Exactly1 AP/no second Parry debit,
> fresh choice/structured GM prior-payment attestation, owner consent, retained rolls and one P7 AP/HP/
> consumption receipt; [exact source/evidence/limits](MYTHRILL_PROJECT_13B_CONTRACT.md#13-e1a-implementation-and-verification--2026-10-19).
> No automatic Parry/trigger/eligibility/mitigation/ordering or broader reaction engine; old E1a-proposal
> wording below is historical. Other roadmap tracks still need separately named approval.

> **Latest 2026-10-19:** P13B-W declaration collector is implemented, independently source/delta accepted,
> integrated Build3/App4 verified. [Exact handoff](MYTHRILL_PROJECT_13B_CONTRACT.md#11-w-implementation-and-integrated-handoff--2026-10-19).
> Collection does not pay, reserve, roll or resolve reactions. E1a original Riposte AP/HP bridge is a
> proposal only; broader execution/A1b remains unauthorized. Older blanket W-preparation statuses below
> are historical. Accepted B2 §8.1 and earlier closure evidence are reused unchanged.

> **Latest 2026-10-18:** creator approved G1/G3/G3a/G5 and froze/authorized **P12C-B2 §8.1 only**.
> Original Radiant Burst circle/channel is implemented, bounded source-review accepted and final
> production build3/App7 verified. [Exact boundary/evidence](MYTHRILL_PROJECT_12C_B2_CONTRACT.md#15-first-slice-implementation-and-verification--2026-10-18).
> Earlier blanket B2 preparation-only statements below are superseded for that subset; wider B2,
> obstruction enforcement, P13B execution and area execution remain conditional, not authorized.

> **Status 2026-10-17:** P11 complete; P12A and P12B-thin implemented and reviewed. The
> allocation of targeting, floating combat text and area execution is revised in §11. §11 wins
> where it differs from §5–§8.
>
> **Status 2026-10-18:** P12B-r1, P13A and P12C-B1 implemented and independently reviewed (PASS
> each), uncommitted. P12C-B2, P13B and area execution remain preparation only. Dependencies on the
> class reconstruction are in §12 and the shared table
> [MYTHRILL_CROSS_TRACK_COORDINATION.md](MYTHRILL_CROSS_TRACK_COORDINATION.md).
>
> **Preparation update 2026-10-18:** B2 and P13B conditional drafts and the creator packet rev2 are
> complete (§13), not frozen or implemented. §13 and those drafts win over earlier unapproved reaction
> ordering, disclosure, Pass and chain-cap suggestions in §6/§9. A1b is now parked per current handoff33.

## 1. What "fully fledged combat" means here

A GM and two or three players can run a Prism fight in the VTT and at a physical
table with the same choices and results:

1. A player chooses an action card and an exact, eligible target.
2. The attack resolves through the weapon's attack card, Evasion and the defender's
   favored blocking piece, with physical or on-screen dice.
3. Eligible reactions get a short, urgent opportunity; follow-ups (Parry → Riposte,
   Raise Shield → Shield Bash) can open another.
4. The GM confirms each final result, and one accepted command applies it.
5. The screen narrates declarations, counters, redirects, defenses and outcomes,
   and keeps a lasting history.

It does **not** mean every spell, class feature or creature ability is automated.
Each phase names a small supported set. Everything else stays playable by hand,
with a visible reason, and the GM can always enter a result manually.

## 2. Evidence used

Read: root `AGENTS.md`; [ENGINEERING_STATE.md](ENGINEERING_STATE.md); P7–P10 contracts
and reports; the original roadmap; the player Laws draft
`laws-drafts/MYTHRILL_COMBAT_LAWS_PLAYER_DRAFT_20261015.md`; `docs/ai/*`.

Inspected source (all under `vtt-react/src/`):

| Area | What exists today |
|---|---|
| Skills and weapons | `constants/skillDefinitions.js`, `skillPointSystem.js`, `weaponTypeSimpleTables.js` (`WEAPON_TYPE_TIERS`, 1–20 outcome tables), `weaponTypeMeta.js`; sheet `components/character-sheet/Skills.jsx`; creation `character-creation-wizard/steps/Step7SkillsLanguages.jsx`; store `store/characterSlices/infoSlice.js`. Ranks persist inside `skillRanks` through the canonical character and runtime state paths. |
| Roll paths | Sheet Standard: rank die + stat/rank modifier, "exploding" text. Sheet Advanced and 3D dice: legacy `weaponmastery_*_d8` tables with authored face text. Strikes and P8/P9 read no proficiency. |
| Targeting | `store/targetingStore.js` is local UI state (single/multiple/area modes, no authority). P8/P9 consume one exact P7 actor ref. P9 refuses area, chain and multi-target spells with a diagnostic. |
| P7 | `server/services/actorConsequences.js`, `services/actorConsequenceService.js`: exact refs + expected revisions; **source plus at most one target, ≤32 operations, HP/mana/AP current/temp and typed conditions**; receipts in the room checkpoint. No inventory, equipment, cooldown or N-actor operations. Shared rooms never tick conditions. |
| P8 | `services/featherSlash.js`: one creature ability, GM target, one roll, GM final amount, one P7 command. |
| P9 | `services/spellConsequence*.js`, `server/services/spellPayments.js`: four supported single-target DICE spells, owner approval + GM final amount, typed class payment for three domains, HUD cooldown starts only from an accepted receipt (client-local). |
| Universal actions | `data/universalCombatSpells.js` has authored cards for Attack, Defend, Dodge, Parry, Raise Shield, Help, Opportunity Attack, Interpose, Riposte, Shield Bash, Spell Reaction, Use Item and others. Reaction triggers exist only as prose; there is no structured trigger field. |
| Defense data | Items carry a `durability: 'dN'` die (the equipment DR die) and `maxDurability`. No favored-blocking selection, DR roll, wear or break execution exists. |
| Conditions | P7 typed condition records; timing is manual in shared rooms (F4). |
| Narration | `components/combat-narration-preview/` is an isolated, unmounted preview: a public-field-only presenter, a bounded banner queue and session history. Not a server contract. |

**Not accessible:** the rev3 consolidated combat proposal is not in `D:\VTT`
or the project docs. It was not read. Its content is used only where the Laws
draft or P10 report already quotes it.

## 3. Dependency order and why the four phases hold

```
P11 proficiency storage/budget/wording ─┐
                                         ├─> P12 targeting + defense (one exchange, one P7 command)
P7 + P8/P9 consumers ────────────────────┘          │
                                                     ├─> P13 reaction windows, chains, narration
                                                     │          │
                                                     └──────────┴─> P14 remaining consequences + table readiness
```

The suggested structure holds, with two boundary refinements:

- **Equipment wear and break state go in P12, not P14.** Wear is read from the DR
  die face during defense resolution; splitting it would leave P12 producing
  results that P14 must reinterpret. Elixir consumption stays in P14.
- **Narration starts in P13 as specified,** but its first adapter is fed only
  by accepted receipts, so it can be switched on for existing P8/P9/P12 outcomes
  before reaction windows exist. P12 shows outcomes in its own panel and chat.

## 4. P11 — Skill and Weapon Proficiency Foundations (authorized)

Bounded contract: [MYTHRILL_PROJECT_11_CONTRACT.md](MYTHRILL_PROJECT_11_CONTRACT.md).

**Workflow delivered.** A player sets a rank for each weapon type separately on the
sheet and at creation; ranks survive reload and stay with that character. Creation
point-buy cannot be overspent. Sheet and creation text say what is played by
hand, what the VTT does, and what is still open.

**Supported cases.** Independent per-weapon ranks; legacy shared rank kept and
offered for explicit per-weapon assignment; class-skill selection and upgrades
within the existing budget; over-budget creation blocked, edit mode warned.
**Manual fallbacks.** Rolls, modifiers, explosions and outcome lookup stay as
today, labelled where open. No combat reads proficiency.

**Reuse.** `skillRanks` persistence (canonical + runtime + multiplayer sync),
`skillPointSystem.js` costs and budget, `WEAPON_TYPE_META`, P10 Laws wording.
**Non-goals.** Roll semantics, budget formula or bonuses, combat wiring, quest
`unlocks`, skill-check resolution, Laws pages, creature skills.
**Decisions needed.** None block the authorized slices.
**Authority/privacy/persistence.** Owner (or GM through existing inspection
permission) edits the personal sheet; no room authority change. Data stays in the
existing personal `skillRanks` map; no migration. Legacy bytes preserved.
**Acceptance.** Two weapon types hold independent ranks; reload restores them;
another character/account does not see them; a legacy shared rank is untouched
and assignable; budget boundaries hold while selections change; rendered
creation and sheet controls show the right text.
**Source vs live gates.** Source acceptance is jsdom + real-browser component
checks. Live Firebase save/load on a second device remains an environment gate.

## 5. P12 — Targeting and Defense Resolution

**Workflow delivered.** On their turn a player picks a basic weapon strike (2 AP)
or another supported card and an exact target that the card allows (self, ally,
enemy). The defender's favored blocking piece, chosen earlier on their own turn,
is shown. The attacker rolls the weapon die (on screen or physical). Evasion turns
extra low faces into misses. On a hit, the defender rolls the blocking piece's DR
die. The panel shows the arithmetic, flat DR, resistance/vulnerability and wear;
the GM confirms the final amount; one P7 command applies attacker AP, target HP
and the blocking piece's wear.

**Supported initial cases.**
- Basic weapon strike, PC → creature and creature → PC, single exact target.
- Defender "Don't block", favored piece, ordered backups when the favorite is broken or unworn.
- Equipment DR die roll; Defend (1 AP on own turn) doubles the DR result and prevents wear until the defender's next turn.
- Wear from the natural face: armor on 1–2, shield on 1, one die size per wear, broken below d4.
- Flat DR subtracted without rolling; piercing critical reduces flat DR only; Riposte ignores flat DR and Defend's extra (the Riposte itself arrives in P13).
- Creature defense: authored flat DR, resistances/vulnerabilities; creature Defend remains GM-applied.
- Evasion: each +1 adds one missed face beyond natural 1.

**Manual fallbacks (visible reason).** Area, cone, chain and multi-target actions;
formula attacks and spells without an attack roll vs Evasion; weapon proficiency
outcome faces (until the P11 follow-up decisions); non-physical damage vs equipment
DR; mitigation order beyond the cases above; creature Defend amount; criticals vs shields.

**Reuse.** P7 exact refs/revisions/receipts; P8 GM-adjudication panel pattern;
P9 owner-approval + GM-final flow; `firstTableRules.js` (strike 2 AP, Defend 1 AP);
item `durability` die; `targetingStore` for selection UI only.

**Narrow P7 extension required.** A typed **equipment-wear entry** for the
defender's exact equipped item: `{slot, itemInstanceId, beforeDie, afterDie,
broken}`, validated against a revisioned equipment projection on the room actor.
This is a named extension like P9's class home, not inventory access in general.
It needs its own contract freeze and server tests. Private inventory contents
never enter the room; only the blocking piece's public die and state are projected.

**Eligibility and identity.** Card `targetRestrictions` decide self/ally/enemy.
Which token field defines "ally" and "enemy" (party PC vs creature, or an explicit
side) is not established in current source; the P12 contract must name it, with
GM override. Stale, deleted or re-incarnated targets
refuse with `binding_required`/revision errors and nothing is spent.

**Non-goals.** Reactions, timers, redirects, area templates, elixirs, generic
mitigation pipeline, AC or hidden armor ratings, rebalancing armor dice.

**Decisions needed before implementation.** D12-1 mitigation order and equipment DR
vs non-physical damage; D12-2 Evasion cap/stacking and formula attacks; D12-3
criticals vs shields; D12-4 the three armor die tables; D12-5 obsolete AC/to-hit
weapon faces (strike resolution must not read them); D12-6 generic creature Defend.
Each can also be shipped as "GM decides" with the automation stopping at that point.

**Authority/privacy/persistence/recovery.** GM authorizes foreign consequences
(P7 F5). The favored-piece selection is owner-written, only on the owner's turn,
and projected to the room. Wear is part of the same P7 receipt as the damage, so a
retry never wears twice. A restart before acceptance shows "outcome unknown";
nothing is re-executed.

**Focused acceptance.** Strike → hit → DR roll → wear in one receipt; miss by
Evasion spends AP only; Defend doubling with no wear; shield face 2 does not wear;
armor at d4 face 1 breaks; Don't-block; backup used when the favorite is broken;
stale target refusal; retry returns the same receipt; physical-dice path matches.

**Gates.** Source acceptance (server + browser witnesses). Live backend,
two devices and a human session remain separate gates.

## 6. P13 — Reaction Windows, Chains and Combat Narration

**Workflow delivered.** When an action reaches a moment that an eligible
participant's authored reaction names, the server opens a reaction window: an
urgent opportunity (default eight seconds) shown only to eligible holders and the
GM. Players may stay silent. Declarations are sealed until the window resolves.
Resolution order never depends on who clicked first. A successful reaction with
an authored follow-up opens a new window for that character. The GM can pause,
extend, close or continue a window, or switch the table to manual procedure.
Declarations, counters, redirects, defenses and outcomes appear as prominent
on-screen narration with a lasting history.

**Supported initial cases.** Parry → Riposte; Raise Shield → Shield Bash; Dodge;
Interpose (redirect to the interposing ally, a fresh exact target); Opportunity
Attack as a window opened by movement (subject to D13-3).

**Manual fallbacks.** Spell Reaction and every class reaction without structured
trigger data; Help; Ready Action; anything whose trigger is only prose.

**Reuse.** P12 exchange/outcome pipeline; P7 receipts (each executed reaction is
its own P7 command); `combat-narration-preview` presenter, queue and public-field
whitelist; combat tracker turn ownership.

**New pieces.**
- Authored **trigger metadata** on supported reaction cards (moment, reach, cost,
  follow-up of). This is data, so the creator approves each entry.
- A server-owned **exchange record** in room state: steps, open window, sealed
  declarations, executed step receipts. Bounded size, checkpointed with the room.
- A narration adapter that publishes only public, accepted events.

**Technical safety limits (proposed, not rules).** At most 8 windows per exchange
and 1 follow-up window per successful reaction per character; on reaching the
limit the GM sees "continue chain / close". These limits never block a
card-named follow-up below the cap and are labelled in the UI as table settings.

**Atomicity.** An exchange is **not** one transaction. Each executed reaction is
its own accepted P7 command; the exchange record lists which steps executed.
A disconnect, timeout or restart leaves the exchange `interrupted`; executed steps
stay executed and are never refunded; the GM resolves the remainder by hand.

**Presentation.** Reaction cards available to you are prominent; unavailable ones
are dimmed with an accessible reason (no AP, out of reach, wrong moment, not
your trigger). Availability is computed per context, never from a hard-coded
own-turn rule. Narration never covers the reaction controls and never reveals
sealed declarations or hidden information. Screen terms match the printed cards.

**Non-goals.** Recursive general trigger engine, priority by speed, a coordinated
optimization lobby, automatic creature reaction choice, refunds.

**Decisions needed.** D13-1 payment for declared-but-unexecuted reactions (J4);
D13-2 resolution order when several react to one moment; D13-3 own-turn reactions
to enemy triggers (J5); D13-4 Raise Shield wording; D13-5 Parry compares face or
total; D13-6 optional Pass and early close; D13-7 hidden-declaration procedure at
a physical table; D13-8 Spell Reaction's 2 AP and Evade. Until decided, the window
can collect declarations and hand the ordering/payment to the GM.

**Authority/privacy/persistence/recovery.** Server clock owns the window; clients
show a countdown only. Sealed declarations are visible to the declarer and GM
only, and are excluded from room broadcasts until resolution. Window state is
checkpointed; after restart an open window is closed as `interrupted`, never
silently resolved. Late declarations after close are refused with a reason.

**Focused acceptance.** Window opens only for eligible holders; nobody eligible →
no window; silence passes; two simultaneous declarations resolve in the configured
order regardless of arrival; Parry success opens Riposte for the parrier only;
a creature's successful parry gives the player nothing; executed reaction pays
in full even if made unnecessary; disconnect mid-window; GM pause/extend; manual
table mode; narration shows outcome after acceptance and never a sealed choice.

**Gates.** Server/browser source acceptance; live two-device latency and a human
"does eight seconds feel urgent but fair" playtest are separate gates.

## 7. P14 — Remaining Consequences and End-to-End Table Readiness

**Target workflow (future, not a completion claim).** A full first-table fight runs end to end: elixirs drunk
off-turn for 0 AP, supported class payments and cooldowns, supported conditions
applied from actions, bounded multi-target actions, GM override everywhere, and a
printed reference that matches the screen.

**Supported initial cases.**
- Elixir use: a typed **inventory-consumption entry** (exact item instance,
  quantity before/after) plus its supported effect in one P7 command. 0 AP,
  usable during a reaction window. Timing cutoffs follow D14-1.
- Class payments for further domains, one domain at a time, through the existing
  managed resource planners (no common resource scalar).
- Durable turn-based cooldowns for supported actions (room-scoped, from receipts).
- Shared conditions first: proposed P14-C1 PC Defending manual-result bridge through the same P7 path
  from token/context, sheet, GM and manual Defend card entry; actual block mechanics/removal/recovery
  must agree. Later authored spell conditions require exact source mapping; timing remains manual until
  its own clock contract. No generic action execution from a condition name/icon.
- Bounded multi-target: an explicit list of exact refs, capped (proposed ≤6),
  as **one P7 command per target** with a shared exchange id, not an atomic batch,
  unless P7 is extended to N actors under its own contract.
- Physical-table reference cards for every supported workflow.

**Manual fallbacks.** Area templates and zone membership, durations/ticks in shared
rooms, summons, transformations, any card with unparsed fields.

**Reuse.** Everything above; P5/P6 personal persistence for inventory; release
checklist from P10.

**P14-C1 does not replace the other tracks.** Shared condition storage/readers are prerequisites for
later Stunned action/reaction gates and lifecycle events, not proof those exist. Reaction-card
highlighting/actual authored triggers, Counterspell/Intervene and subsequent chains remain P13 follow-ons;
E1a is original Riposte only. Targeting obstruction retains its separate B2 §14 geometry/authority/override
freeze. Chain/bounce/seeking/fork/persistent propagation retains the completed B2 inventory and per-card
recipient/path/timing decisions. A shared condition can later be an output of those capabilities; it
does not supply traversal, targeting legality, atomic N-actor payment or a scheduler.

**Decisions needed.** D14-1 elixir timing cutoffs; D14-2 which items count as
elixirs; D14-3 whether multi-target needs atomic all-or-nothing; D14-4 `<attr>/K`
rounding (P9); D14-5 H13 operations owner and first-release decision.

**Authority/privacy/persistence.** Inventory stays private; only the consumed
item's public name and the effect enter the room receipt. Owner approves their own
consumption; GM confirms effects on others.

**Focused acceptance.** Elixir during an open window; double-submit consumes once;
empty stack refusal; multi-target partial failure is reported per target; cooldown
survives reload and room restart; printed reference matches screen terminology.

**Gates.** This phase closes source work for the first table. It cannot close
human, live-service, staged deployment or operations gates; it prepares the
evidence for them.

## 8. Coverage table

| Need | Where | Notes |
|---|---|---|
| Exact source/target identity | **Existing (P7)** | Exact refs, incarnations, revisions. P12 adds card eligibility. |
| Self / ally / enemy eligibility | **P12** | From authored `targetRestrictions`; the ally/enemy source field is named in the P12 contract. |
| Area actions | **Deferred (manual)** | Template membership is not proven; P14 handles explicit lists only. |
| Multiple targets | **P14** | Explicit capped list, sequential per-target commands unless P7 is extended. |
| Redirects / interception (Interpose) | **P13** | New exact target inside the exchange; fresh eligibility check. |
| Target replacement, stale/deleted targets | **Existing (P7) + P12/P13** | Refuse with reason; nothing spent. |
| Per-weapon proficiency storage | **P11** | Implemented now. |
| Weapon outcome tables / unique outcomes | **P11 follow-up → P12** | Needs D11-1…D11-3 before any automation. |
| Evasion | **P12** | Missed faces; cap/stacking open. |
| Blocking (favored piece, backups, Don't block) | **P12** | Owner sets on own turn. |
| Equipment DR die vs flat DR | **P12** | Separate fields; flat DR never wears. |
| Resistance / vulnerability | **P12** | Creature-authored; order open (D12-1). |
| Defend | **P12B + proposed P14-C1** | P12B consumes canonical PC Defending for2×/no-wear; unified application/Defend action payment is not thereby automated. Creature Defend manual. |
| Conditions and timing | **Existing P7 storage + P14-C1 proposal** | Surface integration, mechanics and clocks are separate; PC Defending first, Stunned full admission/expiry later. No icon-as-enforcement claim. |
| Resource / class payment | **Existing (P9 three domains) + P14** | Further domains one at a time. |
| Cooldowns | **Existing (local, P9) + P14** | Durable room cooldowns in P14. |
| Equipment wear and breakage | **P12** | Typed wear entry in the same receipt. |
| Elixir consumption | **P14** | Typed inventory-consumption entry. |
| Reactions to actions | **P13** | Authored triggers only. |
| Reactions to reactions (follow-ups) | **P13** | Card-named follow-ups; technical cap + GM continue. |
| Disconnect / timeout / retry / partial exchanges | **Existing (P7 retry) + P13** | Exchange `interrupted`; executed steps kept. |
| On-screen narration and history | **P13** | Reuse the preview presenter; receipt-fed adapter first. |
| GM intervention / manual adjudication | **Existing (P8/P9) + every phase** | GM final amount and manual entry always available. |
| Physical dice | **Existing (P8/P9) + every phase** | Physical result entry on each roll. |
| Obsolete AC/to-hit weapon faces | **Decision D11-3** | Not read by any automation until revised. |
| Generic mitigation engine, rebalances | **Not planned** | Speculative; excluded. |

## 9. Creator decisions by phase

Confirmed decisions (not asked again) are in the P11 contract and §5–§7.

| Phase | Open decision | Default until decided |
|---|---|---|
| P11 follow-up | D11-1 proficiency roll modifier; D11-2 explosion; D11-3 mapping a result onto faces 1–20 and revised AC/to-hit faces; D11-4 rank check bonus; D11-5 general skill-check resolution (Difficulty Die vs fixed DC); D11-6 point-buy budget and bonus points | GM rules; sheet shows `[Open]` |
| P12 | D12-1 mitigation order and equipment DR vs non-physical damage; D12-2 Evasion cap/stacking/formula attacks; D12-3 criticals vs shields; D12-4 the three armor die tables; D12-5 = D11-3; D12-6 generic creature Defend | Automation stops; GM decides |
| P13 | D13-1 unexecuted declaration payment (J4); D13-2 multi-reaction order; D13-3 own-turn reactions (J5); D13-4 Raise Shield wording; D13-5 Parry face vs total; D13-6 Pass/early close; D13-7 hidden declarations at a physical table; D13-8 Spell Reaction 2 AP and Evade; approval of the technical chain limits as table settings | Window collects; GM orders and charges |
| P14 | D14-1 elixir timing; D14-2 what counts as an elixir; D14-3 atomic multi-target; D14-4 `<attr>/K`; D14-5 H13 owner/release | Manual |
| Gates | Creator Laws/canon validation; GM + two-player physical and VTT session; nine P5 environment gates; live Firebase/rules/backend; staged deployment | Open |

## 10. Rules for every phase

- One phase at a time, own contract, own independent review.
- No AC, Armor score or hidden armor rating anywhere.
- Authored costs stay authoritative; distinctive class mechanics are not homogenized.
- Never pre-spend; never refund an executed action; never present a pending result as applied.
- Sequential P7 commits are not one transaction; say so in UI and receipts.
- A recorded roll is never discarded to obtain a new one; changed state is revalidated, not rerolled.

## 11. Allocation revision (HQ requirements of 2026-10-17)

Proposed contracts: [MYTHRILL_NEXT_SLICES_CONTRACT_20261017.md](MYTHRILL_NEXT_SLICES_CONTRACT_20261017.md).
HQ authorized P12B-r1, P13A and P12C-B1 on 2026-10-17; their frozen contracts are
[P12 rev 5 §3.9](MYTHRILL_PROJECT_12_CONTRACT.md), [P13A](MYTHRILL_PROJECT_13A_CONTRACT.md) and
[P12C-B1](MYTHRILL_PROJECT_12C_B1_CONTRACT.md). All three are implemented and reviewed (2026-10-18).
P12C-B2, P13B and P14 are not authorized.

| Phase | Now contains | Notes |
|---|---|---|
| **P12** | P12A/P12B-thin/r1 and B1 map targeting complete; B2 authored area-preview conditional draft complete (§13), no implementation authorization | Preview only; validation and execution stay with the existing controllers and the GM |
| **P13** | **P13A** accepted-result narration and floating combat text; then **P13B** reaction windows and chains under their own contract | P13A consumes accepted receipts only |
| **P14** | Expanded area and multi-target consequences (needs G1–G5, D14-3 and an explicit choice between per-target P7 commands and an N-actor P7 extension), elixirs, further class domains, durable cooldowns, table readiness | P7 today is source + at most one target; it cannot resolve an arbitrary area attack atomically |

**Dependency adjustments, and why.**
- **P13A runs before P12C-B1.** It depends only on P7 receipts and the P8/P9/P12 text builders, so it
  needs no targeting or reaction decision, and it gives every already-supported action visible
  results. Order: P12B-r1 → P13A → P12C-B1, one at a time.
- **P12C-B1 must precede P13B.** Interpose and other redirects need the shared map-targeting
  interface to pick a fresh exact target.
- **P12C-B2 is useful only as a manual aid until P14,** and its conditional membership/display subset
  needs the explicit geometry decisions/manual boundaries in the B2 draft (§13), including boundary contact/gridless.
  It may be done late in P12 or at the start of P14; it is not a prerequisite of P13.
- Area tool findings carried into P12C: the existing free-standing template (dice menu) clips by the
  placer's sight and counts token centres over all map tokens, hidden ones included. B2 must use only
  visible tokens and must not turn those tool conventions into rules.

Coverage-table changes (§8): "Area actions" → preview P12C-B2, execution P14. "On-screen narration
and history" → P13A (also floating combat text). Targeting UI for supported actions → P12C-B1.

## 12. Dependency on the class reconstruction (2026-10-18)

The class track (Class HeadQ, `docs/plans/mythrill-class-reconstruction/`) owns class mechanics,
heritage, resource schemas, content and migrations. Combat owns execution infrastructure. The shared
table is [MYTHRILL_CROSS_TRACK_COORDINATION.md](MYTHRILL_CROSS_TRACK_COORDINATION.md): capability,
existing implementation, proposed extension, owning track, prerequisite decision and affected files.
Its candidate class schemas are proposals until Class HeadQ marks them reviewed.

| Phase | What it gives the class track | What it does not do |
|---|---|---|
| **P13A** (done) | Generic HP/temp-HP feedback for any accepted P7 receipt; AP/mana/wear in narration | No class-resource floats or generic resource bar. Class-resource presentation stays domain-specific: a per-domain presenter owned by the class track, behind one feed hook |
| **P12C** | B1 (done): exact single-target picking. The picker can later serve linked actors, companions, summons and positional choices | No execution of links, companions, summons or positional rules is supported or claimed until those capabilities exist |
| **P13B** | Proposed W private opportunity/manual bridge first; later named payment/execution carries **typed class operations**, reviewed per domain | No reservations exist in current P9 planners. No scalar model; typed execution freezes only after exact class-reviewed rules are cited |
| **P14** | Approved consequence capabilities, scheduled one at a time | P14 completion does **not** mean every reconstructed class is automated. Unready or unapproved capabilities split into bounded follow-on projects (N-actor consequences, entity lifecycle, turn/rest boundaries, private domain projections, body/trait adapters, A1b admission) |

**Rules.** Reuse the existing class-resource contracts; no speculative universal resource engine.
No candidate mechanic, class rename or character migration in combat work; existing class IDs and
compatibility stay until approved migrations exist. Shared HUD, casting, resource and Spell Wizard
edits are announced in the shared table before they reach the device.

**Authoring prerequisites (class-track dependencies).** End-to-end authored-spell execution needs
explicit 0 AP preserved (CR-W1a) and `resourceCost` preserved through serialization, export and
templates (CR-W1b). Both are accepted by the class track, and their corrected identities were verified
on the device on 2026-10-18. CR-A1a (server-only, unhooked definition infrastructure) is accepted, and its
working-tree bytes match the reviewed SHA-256; HEAD still holds the pre-correction bytes. The combat
slices made no repair to any of these. **CR-A1b is PARKED**, not a selected integration, per current
class handoff33; Main HQ owns any future shared authority/execution/persistence decision. Corrected A1a
final evidence is correction plus verification (reviewer applied F1/F2), not fresh independent review
of untouched code. No live installation or second admission/execution engine is implied.

## 13. Documentation-only HQ takeover: prepared contracts (2026-10-18)

Actual HEAD `8ba81efbf935e08d4fcd488a9b597f5eb8031b0f`; extensive uncommitted combat/class/other work
preserved. [B2 §2](MYTHRILL_PROJECT_12C_B2_CONTRACT.md#2-actual-checkout-and-evidence-boundary) records
source/evidence reconciliation. Latest integrated closure is reused from the evening slice report;
no historical audit or rerun of accepted checks for this preparation.

| Prepared object | Settled boundary | Conditional / later |
|---|---|---|
| [P12C-B2](MYTHRILL_PROJECT_12C_B2_CONTRACT.md) | Existing targeting/AoE owners; explicit dimensions/origin; visible candidates only; no roll/cost/proposal/chat/consequence | G1/G1b/G3/G3a/G3b/G4/G5 or explicit manual subset; G2/G6 stay GM-decided; no authoritative range/movement supplied |
| [P13B](MYTHRILL_PROJECT_13B_CONTRACT.md) | Actual card/moment matrix, smallest W manual-bridge proposal, sealed GM-first commitment, identity/deadline/recovery, four worked cases | Policy/card questions; E1 separately named Parry/Riposte payment/binder; no card escrow or generic reservation claim |
| [Creator packet rev2](MYTHRILL_DECISIONS_AREA_AND_REACTIONS_BATCH1.md) | Independent questions, short examples, consequences and slice dependencies; original batch retained as collapsed history | No new approval/default; no required reading of technical drafts to answer |

Earlier §6/§9 suggestions are history, not current policy: no mandatory Pass/automatic early-close
default, no “redirects then defences” ordering, no precommitting GM choices after reading players,
no one-follow-up-per-character restriction. Technical safety budgets yield automation for GM
continuation/manual play; exact bounds remain unfrozen and cannot become tabletop reaction limits.
Current P7 sequential groups are not an atomic exchange or arbitrary area transaction.

Current class requirements were read from handoff33, R1/CR-L1 and C1 package/report. Candidate lifecycle
schemas remain proposed; reported C1 implementation is class-local/manual, not shared execution.
Shared dependencies/owners are updated in coordination rows6/7/14/19–21. No implementation, content
migration, commit, push, deployment or dependency change is authorized by completing these drafts.

### Creator addition: complete targeting/propagation coverage

The single [coverage matrix and source trace](MYTHRILL_PROJECT_12C_B2_CONTRACT.md#9-targeting-and-propagation-coverage-matrix)
is in B2 §9, per-mode rule ledger §10, save discrepancies §11, examples §12, recommended sequence §13.
No new parallel report or engine. Initial selection, first delivery, further propagation and effect
application/timing remain distinct, including chain-as-link versus chain-as-travel.

- **Current targeting slice:** B1 stays exact one-ref selection; B2 proposes explicit static area/channel
  footprint only. Class-owned zero/sentinel/schema/per-effect save preservation is separately contracted.
  Later list/path aid can reuse the interaction without spending or consequence authority.
- **P13B:** actual authored initial/intermediate/impact/hit/damage opportunities when eligible, not an
  automatic timer on each hop; repeated actors need distinct causal occurrence IDs, not a blanket ban.
- **P14:** one named immediate multi-recipient card at a time; explicit once/per-hop costs/rolls, stops,
  recipient/segment checks and partial-versus-atomic choice. Current P7 two-actor groups are insufficient
  for an arbitrary chain and do not become atomic because a map drew it.
- **Explicit lifecycle/manual deferral:** spreading clocks/generations, moving/trailing zones, channel
  sustain/interrupt, delayed/compulsory triggers, links and return coordinates need FO-B/E/N (private
  projection FO-P when applicable). Seeking hidden discovery, wall/object ricochet and recursive forks
  remain manual until exact rules/capabilities are frozen. No universal propagation policy is adopted.
