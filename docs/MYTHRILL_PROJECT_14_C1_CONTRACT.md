# P14-C1 — shared conditions: PC Defending first

2026-10-20 · **HQ FROZEN and authorized for implementation: shared PC Defending only.**
One underlying condition definition/identity and authoritative write path, with thin spell/card,
token/context, sheet and GM adapters. P7 already stores records; an icon is not enforcement.
**Implementation closure:** bounded independent source review **ACCEPT**, optimized Build3 compilation
PASS and real-App11 PASS; exact coverage, identities and limits are in [§6](#6-implementation-and-verification).
E1a remains complete at [P13B §13](MYTHRILL_PROJECT_13B_CONTRACT.md#13-e1a-implementation-and-verification--2026-10-19);
its evidence/review/build is reused, not repeated. This is not the Class C1 workshop or an A1b contract.

## 1. Actual authored rules — no imported defaults

| Case | Source-backed rule | Actual gap / bounded treatment |
|---|---|---|
| **PC Defending** | `firstTableRules.js:13` / `universalCombatSpells.js:250–285` / published `rules.json:1060,1064,2770`: **Defend1 AP, ACTION on your turn; until your next turn, favored blocking-piece DR rolls double and never wear the piece** | No Armor/AC or generic flat DR bonus. `conditionsData.js:148–155` still says increased armor/resistance; card's structured duration is instant/0 despite its prose. Do not execute those contradictory fields or copy the token menu's10-minute default. Use the published rule label and **manual expiry** in C1 |
| **Creature Defend** | `rules.json:2770`, token context `CreatureToken.jsx:2944–2975`: authored creature DR benefit or GM ruling; no Armor/AC/equipment wear | Amount, cost and duration explicitly open. **Not the PC profile**, never infer double equipment DR for a creature. Manual marker/GM outcome only in this slice |
| **Stunned** | `conditionsData.js:14–22`: cannot move/take actions. Published `rules.json:3769,3801–3802,3829–3830`: incapacitated (**no actions or reactions**), cannot move, automatically fail STR/AGI saves, attacks against target have advantage | Catalogue is incomplete; no basis to invent penalties, AP drain, extra dice or a Prism advantage operator. These are authored statements, not proof of current automation. **No Stunned enforcement delivered by C1** |
| **Stunned duration** | Published bludgeoning critical `rules.json:2835`:1 round, moderate d8 Constitution save negates. `universal_shield_bash:431–459`: STR-v-CON then until end of target's next turn, but structured duration says1 round | Duration belongs to the source. Do not normalize all stuns to one round, six seconds or next-turn expiry. Saves/arithmetic/source-specific clock stay manual until a named follow-on |

## 2. Surface-to-engine map (current source trace, not a runtime audit)

Paths below are relative to `vtt-react/src/` unless prefixed `server/`.
**A** = authoritative P7 path; **A?** = attempts it but producer/resolution limitations exist;
**P** = presentation/partial client calculation; **L** = independent local mutation, not room authority.

| Surface / producer | Actual route | Storage vs mechanics / concrete limitation |
|---|---|---|
| Token **ConditionsWindow** (`:196–231`) | `updateTokenState`/`updateCharacterTokenState` → `routeTokenState` → typed operations (**A?**) | Default timed records supply appliedAt/duration but lack P7-required start/end or remainingRounds. `roomCondition` drops appliedAt, so these shapes can refuse `invalid_condition`. This is a static schema trace, not a claimed new browser repro. Stable preset IDs also conflate instance/definition and removal filters by ID |
| Creature **Toggle Defense** (`CreatureToken:2926–2976`) | Token write then separate `conditionStore.addCondition` (**two A? requests**) | Semantic-id marker plus separately minted buff; same-revision requests can race. Marker describes creature GM DR, not PC double-roll. No authored10-minute creature rule establishes its hard-coded duration |
| **BuffDebuffCreatorModal** (`:305–413`) | `conditionStore.addCondition` → P7 in shared mode (**A?**); otherwise **L** | Valid timed builder often exists, but it guesses target from playerId/local_player and has numeric custom effects, not a named definition. Imports condition **icons**, not condition mechanics; sourceActor is not preserved by current normalization |
| Sheet **CharacterStats** (`:280–388,646–748`) | Reads conditionStore numeric effects and token conditions (**P**) | Computes displayed modifiers/speed, not condition admission/action enforcement. Chooses isPlayerToken/first-token fallback rather than exact inspected room actor. It has no shared condition editor entry here |
| **PartyHUD / TargetHUD** condition widgets | Reads projections; remove/edit calls conditionStore → P7 for shared records (**A? +P**) | Record removal can be authoritative; alias filtering/manual countdown labels can disagree. Badge/countdown alone certifies neither action denial nor expiry |
| HUD/sheet **spell/card actions** | Unsupported shared actions, including Defend/Shield Bash, post manual notice; existing named P8/P9/E1a execute only their supported parts | **No general spell→condition executor.** Legacy/local item buffs use conditionStore; P12A/E1a critical conditions remain unapplied. Do not infer execution from authored control/buff configuration |
| **ActorConsequenceControls** + generic P7 | `actor_consequence`; when authorization_required, proposal → GM adjudication (**A**) | Exact attachment and immutable-result correction/retry exist. Not a named-condition library, rule evaluator or expiry scheduler |
| Legacy `buff_update`/`debuff_update` listeners | Silent conditionStore updates (**L projection**) | Old relay handlers still exist, but registered `socketHandlers.js:817–846` rejects these outgoing legacy condition writes. They are **not** a second legitimate room-authoritative condition path |

**Storage spine:** `actorConsequences.js:88–116,136–143,311–324` validates v1 records, exact target refs,
id=recordId, add/update/remove, numeric effect whitelist, actor CAS and receipt retry. Commands mutate
`maps[mapId].tokens/characterTokens[tokenId].state.conditions`; snapshots/accepted results hydrate
conditionStore projections (`actorConsequenceService:304,503–515`). Current controller permissions allow
one own/delegated actor; other targets require existing GM authorization. C1 preserves that policy.

**Mechanical readers:** server `blockApprovals.js:49–50,292–315` and client `equipmentBlocking.js:66–70`
already recognize **v1 `conditionKey:'defending'`**, recompute doubled reduction and no wear. This even
includes marker-kind v1 records: “marker” is not universally equivalent to “no mechanics.” By contrast,
`conditionUtils.js:17–21,91–95` checks `id || name`, not conditionKey; UUID-backed Stunned can miss the
speed check. Its canTokenMove helper has no production callers found. Creature movement budgets and
sheet speed use the speed utility, but named server action/payment/move paths inspected have no shared
Stunned gate. **Do not claim authoritative movement/action/save/advantage enforcement from a ring.**

**Timing/mirror divergence:** conditionStore shared timer/round functions return without expiring;
characterTokenStore cleanup also guards shared mode. CreatureStore `:493–530` directly filters locally
without that guard, and App `:1244–1258` plus HUD intervals call it every second. Round-zero/time fields
can therefore cause local divergence. DurationModal defaults10 minutes and promises auto ticks; those
labels do not establish shared expiry. It returns milliseconds while conditionStore duration is seconds;
do not copy units blindly or turn a round into an authoritative six-second timer. Personal timers are not the room clock.

## 3. ONE proposed first end-to-end slice: named PC Defending bridge

**Apply/remove an already table-resolved PC Defending condition through shared interfaces, then observe
the existing P12B block effect.** No automatic Defend price/turn/saves/spell execution is added.

| Part | Implementation-ready boundary |
|---|---|
| One definition/predicate | One closed shared PC Defending profile and pure predicate (e.g. JSON data + small CommonJS helper under src, consumable by Node/client). `conditionsData`/editors/tooltips reference it; both existing holdsDefending readers delegate to it. Preserve current v1/key semantics,2×/no-wear—not a programmable effect engine or flat-DR/Armor scalar |
| One controller/store | Thin `sharedConditionService` builds exact P7 operations and awaits receipt/status. Token/context editor, sheet drawer, GM controls and the **manual-result Defend card entry** call it. No per-interface buff implementation/local optimistic write. `state.conditions` is authority; conditionStore is a derived view |
| Instance/source/target | New recordId UUID distinct from conditionKey `defending`; full exact room/map/token/incarnation + PC owner/character/primary target. Use existing v1 fields, e.g. effectOrigin `shared-condition:defending:v1`, type buff/kind effect/effects `{}`. Preserve accepted IDs. Carry sourceActor only when explicitly known (self Defend/known source); administrative authorizer comes from receipt. Never infer caster/target from first token/player aliases; unknown attribution stays manual |
| Named vs custom | Explicit profile selection, not icon/title matching, establishes new semantic key. Preserve supplied canonical conditionKey/sourceActor rather than rederive from a renamed label. A custom label “Defending” is not silently promoted. Existing accepted v1/key records remain baseline, not migrated/deduped; ambiguous/private recovery is read-only until explicit correction |
| Duplicate/correction | Same command/bytes returns receipt. Same recordId conflicts cannot duplicate. Across surfaces, existing canonical Defending is selected/no-op, **not** silently refreshed/replaced. Named add must recheck current actor/profile after awaits; competing fresh duplicate refused. Independent timed sources/refresh-stacking stay outside C1. GM explicit update/removal uses exact recordId+CAS, never name-wide removal; conflicting legacy interpretation requires explicit correction |
| Duration/expiry | `sharedTiming:'manual', durationType:'manual'`, source label **“until your next turn — GM removes”**. No10-minute/six-second/instant expiry inference. Disable independent cleanup for accepted shared records; personal/sandbox timers unchanged. Manual record never vanishes because of reload/round0/wallclock. Automatic turn/round boundaries are a later contract |
| Price/action availability | Defend remains authored1 AP ACTION on own turn; cost/eligibility resolved manually before this result-entry workflow. Condition administration itself pays nothing and claims no free Defend or verified payment. No Stunned/action gate, source spell saves or A1b casting integration in C1 |
| Persistence/privacy | Reuse P7 prepare/submit/status/receipt/writer + existing P5 scoped-native helper for bounded exact-operation custody if needed; persist IDs/bytes before emission, no offline replay engine. Unknown ACK blocks replacement; rejoin reads current actor+same command. New runtime restores accepted checkpoint state/known receipts only, otherwise manual reconciliation. Temporary rooms stay live-only. No private class recovery/source notes leaked in public icons/ARIA/history |

**Interfaces:** reuse one exact-actor condition editor/drawer, not four new implementations. First real
vertical demonstration: token ConditionsWindow + sheet entry/removal (sheet opens that same editor).
Manual Defend card/GM entry are thin prefilled **result-entry** adapters; the card still does not cast,
pay, validate timing or apply an arbitrary authored spell. Class/Wizard control records remain manual;
this source reference is not A1a admission. Other spells can use the same controller only when their
own exact outcome is supported/resolved; unsupported extra operations stay visibly unapplied.

## 4. Frozen acceptance (executed after HQ authorization; results in §6)

1. Real App GM/owner/observer: apply via token editor; sheet/HUD shows the **same recordId/key/target**
   only after acceptance. Remove via sheet; token/HUD/backend all lose that exact record. Reverse the
   direction with a new episode. Inspect mode never edits the viewer/first token instead of its target.
2. Real P12B: while active, a recorded armor d8 face2 reduces by4 and causes **no wear**, for multiple
   hits (fresh attack/roll records per hit) without consuming Defending. After removal, a new roll with
   that same face value2 reduces by2 and wears d8→d6 under
   existing rules. No numeric Armor/flatDR/stat-sheet bonus is fabricated. Icon inspection alone fails acceptance.
   Existing critical/non-physical/manual branches are unchanged; Defending grants no permission to
   block an otherwise unsupported hit. No replay/backfill of E1a's labelled-unapplied condition effects.
3. Remove/correct during a pending block: original face retained; stale summary refuses, explicit GM
   revalidation updates Defending/wear interpretation, no automatic reroll or second consequence.
4. Duplicate clicks/interfaces, lost ACK, same-command retry and delayed snapshots create no second
   condition, timer refresh or unrelated deletion. Bad target/incarnation/permission refuses; own/GM
   correction follows current P7 policy. Condition edits change no AP/HP/equipment themselves.
5. Permanent scoped checkpoint/reload/rejoin restores the same active record/effect and later removal;
   historical results do not reapply. Validated current checkpoint conditions remain authoritative even
   when their old add receipt is pruned; unknown command outcomes cannot authorize replay, and rebound/
   ambiguous candidates are recovery only. Temporary/live-only/failed checkpoint confirmation stay honest.
6. Advancing wallclock or rendering an expired/round0 shared marker does not locally delete it. At
   the authored next-turn moment the GM explicitly removes it through P7; active/manual-expiry status
   is visible. No timer text promises automation. Preserve E1a and affected P12B/P7 identity/resource regressions.

Authorized implementation writes: closed shared profile/helper; conditionStore/normalizer
controller; ConditionsWindow/duration view; sheet drawer entry and manual card adapter; both existing
Defending predicates; shared-cleanup guards; focused tests/one App witness. Class HQ co-reviews condition
content/casting and sheet integration before code; no class/heritage/resource/Wizard/export migration.

## 5. Genuine blockers and still-open dependencies

**No new creator game-rule answer blocks this PC Defending/manual-expiry/manual-payment slice.**
HQ approved this boundary and the coordinated write scope is recorded before edits. Automatic expiry, complete Stunned
enforcement, creature Defend or multi-source timing are not smuggled into that approval. Their source-
specific/Prism operator questions become blockers only for their own selected automation contracts.

| Roadmap dependency | Still open after C1 |
|---|---|
| Stunned and other named conditions | Shared action/reaction/voluntary-movement admission gates, alternate-control bypass prevention, authored save/advantage semantics and per-source duration; GM correction/forced movement must remain distinct from a forbidden action |
| Reactions | Eligible-card highlighting +actual typed triggers; Counterspell/Intervene and subsequent windows/chains; E1a is original RP only, not condition lifecycle |
| Obstruction | B2 §14 real LoS/LoE/cover/geometry freshness/overrides, not advisory aim or condition display |
| Propagation / persistent effects | Per-profile chains/bounces/seeking/forks/zones/linked recipients and application timing; no area/traversal/execution claim from condition storage |
| General lifecycle | Authenticated once-only turn/round/expiry/rest/encounter boundaries and supported stacking/procs/DoT/HoT, using this same condition path rather than local timers |

## 6. Implementation and verification

**Delivered at the frozen manual PC boundary.** One JSON definition and pure Node/client predicate feed
both existing P12B readers. `sharedConditionService` prepares exact P7 operations with UUID instances,
CAS, pre-emission user/room-scoped command custody, principal/role/connection fences and same-command
recovery. Active state is read from current canonical token conditions, never from an add receipt.
Repeated Apply is a no-op; named server admission refuses a competing fresh duplicate or mixed payment.
Legacy accepted v1/key records keep their existing mechanics. Custom title collisions preserve them.

| Interface | Delivered boundary / verification |
|---|---|
| Token ConditionsWindow | Shared editor with exact token ref; old Defending preset/X bypass removed. App11 applies here, then sheet removes the same instance |
| Sheet Stats | One entry into that same editor; exact own identity or explicit inspected owner/character identity, unavailable when ambiguous. App11 reads/removes, then applies a new episode |
| GM attachment controls | Same editor for selected primary PC; App11 reads/idempotent Apply and observes exact removal. P7 server tests exercise GM correction/removal |
| Manual Defend card | Thin entry to the same editor; source-reviewed only as an entry, not automated casting/payment or a separately browser-accepted action executor |
| HUD/rings | Accepted record projection and **Until your next turn — GM removes.** Shared cleanup cannot independently expire it. No Armor/AC/flat-DR bonus |

### Evidence and actual coverage

- **Server: 50 passing** across `p12bBlockWear.production.test.js`, `p7Consequences.production.test.js`
  and `p7Bounds.production.test.js`; final two C1 cases rerun after adding restore/pruned-receipt proof,
  **2 passing**. Exact owner/GM/foreign refusal, typed profile/UUID/source validation, duplicate/retry,
  no resource/equipment mutation by condition administration, permanent-room checkpoint codec → new
  runtime with old add receipt pruned → old replay refused/current condition retained → fresh removal.
- **Client: 5 suites / 33 passing**: shared controller (4), custom-title adapter regression, existing
  equipment blocking/custody/projection-order regressions. Unknown command immutability, persisted
  before emission, disconnected/retired-role fences, exact inspection identity and active no-op checked.
- Scoped new/changed condition code lint: **0 errors / 0 warnings**. Existing HUD files retain their
  pre-existing warnings; earlier scoped HUD lint had **0 errors**. New editor mechanical design scan `[]`.
- **One independent review**, original BLOCK retained, same-review repair verification and final identity
  **ACCEPT**. B1 generic token X bypass removed; B2 custom same-name addition preserves canonical
  Defending. Runnable source/P7 probes are retained externally; no broad acceptance restart.
- **Build3 compilation exit0**, asset manifest SHA256
  `1ae0603e9f2ba2032bf3be8e377aa621120dd4654ee5aaf1c62646a3ae3958dd`.
  **C1 runtime mismatches `[]`** against build inputs/outputs. Full-build source drift was **not empty**:
  concurrent Class `Step1CoreDraft.jsx` changed during compilation. That Class identity is not accepted
  here. Build1/2 compilation failures are retained; the shared CommonJS helper now avoids Babel's
  object-spread ESM import injection using `Object.assign`.
- **Real optimized App11 PASS**: GM/owner/observer, token→sheet exact record/remove, reverse
  sheet→token episode, same-instance no-op, two distinct actual P12B accepted hits with recorded d8
  face2→4 and no wear, pending removal refuses stale summary (`approval_mismatch`), fresh explicit GM
  interpretation retains face2→2 and wears d8→d6. No reroll/second condition/consequence is created.
  Lost add ACK **and** accepted broadcast are withheld: unknown custody blocks replacement, survives
  browser reload, and same command recovers its receipt without duplicate. Actual socket reconnect/
  rejoin and checkpoint codec preserve the active instance. Desktop1440×1000/tablet1024×768 fit without
  horizontal overflow. App provider/cloud traffic is deliberately blocked; four `Failed to fetch` page
  errors are retained, not presented as a zero-error browser run. Accelerated fixture raises selected
  event limits. Permanent restore is the production-stack test above, not live Firebase durability.

### Exact retained identities

All external paths below are under `D:/AppData/Temp/opencode/`. `p14c1-final-evidence.json` verifies
all **24 reviewed runtime file hashes**, their frontend Build3 parity and the successful App result.
Recreate that check with `node vtt-react/verification/p14/record-evidence.cjs` from the repo root.

| Artifact | SHA256 |
|---|---|
| `p14c1-review1-runtime.sha256` (complete runtime identity) | `92578c5ac8f8a0a4507bf01c513cbb83c79206fcaeca109dd80e72ed2b94ea75` |
| `p14c1-review1.md` | `cce7612eae87a7c0d3f9bc8e91d9028ab383abc9bbec25841b4791d507ac84cb` |
| `p14c1-review1-probe.cjs` | `319fb9356fc59e73cfe844029fb59be86884475290891ff46ceede6cb0763dff` |
| `p14c1-build3/build.json` | `4768f9102ee30cfe403311905e7904154ef2b2cecd67924418b6fffb2a2fda3a` |
| `p14c1-app11/result.json` | `52e56e07dd89e9f82fb98f16c90bb8341350e6ea675133d3e341d5190b4a9820` |
| repo `verification/p14/defending-app-browser.cjs` | `78ab8b8156c5c2d2919dce8c6d65a1b7f26e54310aa3ea9f6b0f66dea753c542` |
| repo `server/tests/p12bBlockWear.production.test.js` | `5881be591d3dbe02765ec48dc8e13f4a43f5a1cfc0e0761338e0ebebd4381c2b` |

**Limits retained:** manual prior Defend1 AP/action/timing and manual expiry; no Stunned admission,
automatic lifecycle, creature Defend rule, broader reactions/obstruction/propagation or A1b. Provider/
ownership/lease/cloud are fixture boundaries; no two-device/human/live Firebase/deployment acceptance.
The incumbent tactical App intentionally does not run at phone width. Concurrent Class/race/authoring
changes are preserved. E1a/W/B2 acceptance carries forward. No commit/push/deployment.
