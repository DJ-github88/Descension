# P14-C2 — shared Stunned, bounded enforcement

2026-10-21 · **FROZEN / implementation authorized by creator instruction.** Builds on accepted C1;
does not reopen C1/E1a/W/B2 acceptance or complete P14.

## Rules and source baseline

Branch `master`, HEAD `f9527d315f0a5fd338bc29bc0efee493285e58d7`. Actual dirty working bytes are the
baseline: C1 profile/controller/editor, P7 handlers, E1a/W services, token/sheet/GM adapters and
conditions/store corrections are uncommitted. Concurrent Class/race/RI-2 work is preserved.

Published `vtt-react/public/data/rules.json:3801–3802,3829–3830`: incapacitated means no actions or
reactions; Stunned additionally forbids movement, automatically fails STR/AGI saves, and gives attacks
against the target advantage. `:2835`: bludgeoning critical stun lasts one round, moderate d8 CON save
negates. `src/data/universalCombatSpells.js:431–459`: Shield Bash STR-v-CON, until end of target's next
turn; its structured one-round field is not that timing. Catalogue text is incomplete, not another rule.
No save/advantage arithmetic or source application is inferred from a name, icon or UUID.

Read dependencies: P7 F1–F6, C1 §6, P13B §11–13, roadmap, coordination and Class handoff33/34 requirements.
Exact consent, typed domain prices, private custody, actor CAS and existing checkpoint writer remain
owners. A1b stays parked; Wizard 0-AP/resourceCost and corrected A1a untouched.

## Player/GM workflow and canonical record

- Existing C1 editor gains Stunned on token, sheet and GM entries. Exact bound primary PCs and bound
  creature instances only; own/delegate permissions or existing explicit GM proposal/adjudication.
- Explicit closed `shared-condition:stunned:v1` identity plus strict full record validation activates
  mechanics. UUID instance differs from `conditionKey`. Legacy/name-only/key-only stuns remain manual.
- Each episode has explicit public source occurrence reference, optional exact known source actor, and
  timing choice: manual GM ruling, critical one-round, or Shield Bash target-end-next-turn. Source spell,
  critical/save/payment truth is GM/table-resolved before result entry. Unknown source actor is labelled.
- Same source occurrence/actor cannot be freshly added twice. Independent occurrences remain separate;
  any valid active episode restricts the actor. No additive stun strength or refreshed common timer.
  Exact-instance timing correction and removal preserve all sibling episodes. Changing source requires
  explicit removal/add. Accepted state only; no optimistic activation.
- All expiry is manual. GM tracks the source's boundary and removes that exact instance in this editor.
  For one round GM rules the actual round boundary; no six-second conversion or guessed turn boundary.
- STR/AGI saves: GM records automatic failure without rolling. Attacks against target: GM applies the
  table's Prism advantage procedure and enters the final ruling/damage; no automated die operator.

## Enforcement seams / boundaries

- Registered `actor_spell_approve` / `actor_strike_approve` call current-room checks before and after
  authority awaits. These checks reject canonical Stunned, including original E1a Riposte.
- Shared P7 stage checks the acting source of approval-bound actions, P8 Feather Slash and P12B attacks
  before binder/CAS/install, after handler authority awaits. Stale consent/opportunity never bypasses it.
  Known receipts remain readable first. Refusal retains rolls/consent/commands and installs zero AP/HP/
  opportunity consumption. E1a explicit revalidation follows its existing manual-review path.
- Generic P7 result administration, resource correction, condition editing, recovery, equipment
  declaration and turn administration are not newly classified as character actions. P12B blocking is
  not reclassified as Parry or an AP reaction. W collects manual declarations, not execution.
- `token_moved`, debounced settlement after its authority await, `character_moved`, and alternate token/
  creature position update paths reject non-GM voluntary relocation for canonical Stunned. No client
  flag can assert forced/teleport. GM relocation remains administrative; GM adjudicates forced movement
  and teleportation, which have no typed authoritative executors here. Map transfer remains GM-owned.
- Client token drag guards prevent ordinary optimistic movement; server remains the authority. UI
  explains the restriction and manual exceptions. Unsupported/manual actions are resolved at table.

## Concurrency, permission, retry and recovery

Reuse C1's exact principal/room/incarnation/CAS, one pending custody lane per actor, persist-before-emit,
same-command status/retry, reconnect and checkpoint records. Duplicate commands return original receipt;
fresh duplicate source occurrence refuses. Lost ACK is unknown and blocks replacement. New runtime
restores canonical checkpoint records; unknown old command never replays. Another account/character
cannot adopt/edit a foreign instance. No separate ledger, executor or expiry scheduler.

## Writable scope / protected areas

Before writes compare current bytes/read context; preserve concurrent deltas. Combat writes:
`sharedConditionProfiles.json`, `sharedConditionProfile.js`, `sharedConditionService.js`, existing
`SharedDefendingEditor.jsx/.css`, `conditionsData.js`, `ConditionsWindow.jsx`; additive exact-ref token/
sheet/GM adapters as required. Server `actorConsequences.js`, `actorConsequenceHandlers.js`, named
approval readers, `tokenHandlers.js`, `characterHandlers.js`, `environmentHandlers.js`, debouncer in
`syncService.js`; focused tests and `verification/p14/stunned-app-browser.cjs`. Existing entries retain
their C1 names where needed for compatibility. Ledger/priorities/coordination/roadmap updated.
No Class data/resources/Wizard/A1a, stable IDs/migration, dependency upgrades or unrelated cleanup.

## Acceptance witnesses

Focused registered-stack checks: exact multi-source records, invalid/legacy identity, foreign refusal,
idempotency/CAS/reconnect/checkpoint; action and E1a refusal at consent and after consent/authority await;
zero AP/HP/consumption and retained rolls; removal restores availability; movement sibling events and
post-await settlement, GM exception. Affected C1/block/strike/spell regressions only. One production-App
GM/owner/observer witness for token↔sheet same-instance/removal/reverse, independent timing, state labels,
movement and supported refusal. One bounded independent review, repairs and affected rechecks; detached
production build with source identity/drift. Bulky artifacts under `D:/AppData/Temp/opencode/`.

## Implementation / evidence

**Delivered at this bounded boundary. Independent review ACCEPT after concrete repairs; optimized
Build2 compilation exit0 / C2 client mismatches `[]`; production-App5 PASS.** P14 remains open.

### What works / manual procedure

Token Conditions → the existing shared editor; sheet Stats → existing **Sheet shared PC Defending**
entry (same editor now includes Stunned); GM exact attachment → **Edit selected shared conditions**.
The component/export and sheet button retain their C1 names for compatibility. Bound creatures use
their token/GM entry; the personal sheet continues to address only its exact primary PC.

Each explicit Stunned episode has its own UUID, source occurrence reference, optional exact known
source actor and source-specific manual timing. Add/remove/timing correction use the same P7/controller/
custody path; HUD exact removal also routes there. Custom same-name conditions preserve canonical
episodes and remain manual. Removing one episode does not clear its sibling or restore availability
until the last canonical episode is removed. Unchanged historical source attribution survives source
departure; fresh adds require an explicitly selected known source actor to still exist.

**Enforced:** no P8 Feather Slash, P9 supported spell, P12A basic strike, P12B acting-creature attack,
or E1a Riposte execution by a canonically Stunned actor. Owner approval and final P7 installation both
recheck current state; a prior consent/closed opportunity cannot override it. Retained receipts are
read first. Refusal has no AP/mana/HP/class-bank/wear/opportunity installation, and retains commands,
consent and original roll. Explicit GM revalidation/new consent follows the existing action's procedure.
Blocking itself is not newly interpreted as an AP reaction. W remains declaration collection only.

**Movement:** player/delegate voluntary token/character movement and alternate position edits refuse;
queued moves recheck current actor after authority awaits and cannot recreate a disappeared original
attachment from root mirrors. Normal token drag is guarded; the server is decisive. GM repositioning
remains administrative. Forced movement/teleportation require GM adjudication and repositioning, with
no client-declared exception or automated relocation rule. Legacy no-token character relays cannot
relocate bound PCs; production validation already requires a token ID, with an additional handler guard.

**Manual:** initial source attack/critical/save/payment, automatically failed STR/AGI saves (GM records
failure without rolling), advantage against the target (GM uses the table's Prism procedure and enters
the final ruling), and expiry. GM tracks **one round** or **end of target's next turn** separately and
removes the exact episode. Unknown manual duration stays labelled. No automatic source-spell execution,
expiry/round clock, advantage dice operator, generic rule evaluator, A1b or migration.

### Focused verification and review

- **6 new C2 registered-production cases PASS:** dedicated suite4; isolated E1a1; isolated P9 typed
  payment1. Full middleware/registered handlers, strict canonical vs legacy identity, multi-source timing,
  foreign refusal, same-command receipt, checkpoint codec/new runtime/pruned receipt, removal and GM
  correction, movement siblings/GM exception, actual held-authority-await race, unchanged consent/roll/
  pools/bank and no opportunity consumption. Post-source-departure timing correction also checked.
- **46 affected server regressions PASS:** P12A13, P12B24 (including C1's actual doubled/no-wear and
  retained-face removal behavior), P9's prior9. These are affected-path regressions, not renewed phase
  acceptance. E1a's historical acceptance is reused; only its new C2 case was independently executed.
- **Client5 suites /39 tests PASS:** shared controller/adapters, Riposte service, spell consequence,
  equipment blocking. Retained unknown bytes/no optimistic activation, exact-instance edits, independent
  custom-title preservation and authoritative-refusal recovery. Review independently ran3 suites/24
  overlapping checks. Scoped changed service/editor/store lint0 errors/0 warnings; UI detector `[]`.
- **One bounded independent review:** original R1 missing-map fallback and R2 departed-source timing
  BLOCK → repairs/probes PASS → ACCEPT. Same review closed App-driven refusal classification/custom-title
  repairs and the narrow legacy-relay guard/test correction; no outstanding findings. Original failures
  and probes retained externally. Source sets are not relabelled as a new broad audit.
- **Production-App5 PASS:** GM/owner/observer; actual E1a controls create/consent to original physical
  face3, then token Stunned makes execution definitively refused with AP/HP/sequence/roll unchanged.
  Supported basic-strike consent and voluntary movement/alternate position write refuse. Token→sheet
  reads same two independent episode IDs, removes each separately, and restores explicit revalidation/
  consent using face3 for an accepted paid miss. Reverse sheet episode, withheld ACK+broadcast, reload,
  original command recovery and real reconnect preserve the exact instance. Foreign observer refuses.
  Desktop1440×1000/tablet1024×768 captured; scrolling editor has no horizontal overflow; sheet entry
  exercised by keyboard Enter. Four deliberately blocked provider/cloud `Failed to fetch` errors are
  retained; not a zero-error/live-Firebase claim. App1 path-separator fixture failure, App2 lookup issue,
  App3 truthful-refusal defect and App4 unrelated hover-menu interception remain external history.
- Final server-only no-token relay guard widening followed App5; its explicit production validation
  case plus direct registered-handler probe were rechecked by the same reviewer. App5's actual exact
  token-ID paths are unchanged. No frontend runtime changed after Build2/App5.

### Source/build identity and concurrency

Entry HEAD `f9527d315f0a5fd338bc29bc0efee493285e58d7`; concurrent external commit advanced `master` to
`8d23e50bba40168c50ffb0bc41c68a125dc656cb` during this task and included previously dirty combat/Class
work. **This agent issued no commit, push, deployment, reset or Git write.** Current source is the
reviewed device bytes, not an assertion that entry HEAD contained C1 corrections.

Build2 input/output C2 runtime parity is empty mismatches across21 client runtime dependencies. Full
build drift is nonempty: concurrent Class `classReconstructionCompatibility.js`/`gamblerIntegration.test.js`
and this agent's in-progress `riposteService.test.js`/`sharedConditionAdapters.test.js`. Test-only drift
is not bundled runtime drift; Class content is not accepted here. All A1a/W1a/W1b and original universal
card hashes were rechecked unchanged against the retained accepted identities. Context7 was unavailable
in this harness; implementation reused existing React/Zustand APIs/patterns and added no dependency.

All artifacts below are under `D:/AppData/Temp/opencode/`; regenerate final current-byte verification
with `node vtt-react/verification/p14/record-stunned-evidence.cjs` from repo root.

| Artifact | SHA-256 |
|---|---|
| Build2 asset manifest | `95490a5687e14fc178accef5e13c19cd5518b5fdf0dec99d0360c653f7ef542b` |
| `p14c2-review1/final-runtime.sha256` | `b3cd91329b2ecd872f4d322c86c9e2bcc7be5849c8eea5306b77adf185db31a0` |
| `p14c2-review1/REPORT.md` | `bcb350c834d3cf4d5c180257935ab102a84e53fa74a4a8f629133321ed287ec1` |
| `p14c2-build2/build.json` | `4dd6f00bd5006b4b7aa15f4417b507d5ac9c5564f575e1e8252bb140db5e0bc3` |
| `p14c2-app5/result.json` | `23b12d66393799932baf7feddcdf5a35838a4045ed23b2bf3dffba2fee603863` |
| repo `verification/p14/stunned-app-browser.cjs` | `c385dfe5a8c3ad299dcd3af25472236e3576dff7098ffeae890870c9673122ab` |

`p14c2-review1/REPORT.md` + `final-runtime.sha256` identify all29 reviewed runtime dependencies and
focused test bytes. `p14c2-final-evidence.json` ties those identities to Build2/App5 and protected sources.
No bulky artifacts were added to Git. Permanent live Firebase durability, two physical devices and human
table validation remain existing environment gates. Class HQ's parent Mind checkpoint is preserved.

### Remaining / next smallest useful slice

No unresolved creator rule blocks this delivered boundary. Complete Stunned automation remains blocked
on an approved Prism advantage execution procedure, actual save integration and authenticated timing
boundaries (including the interpretation of one round). Smallest useful next preparation: a named
Shield Bash result-entry adapter that supplies exact source/target and end-target-next-turn metadata to
this controller after GM-resolved STR-v-CON; automatic payment/reaction execution or expiry would need
their own separate freeze. General lifecycle/creature Defend, other conditions, trigger highlighting,
Counterspell/Intervene, obstruction and propagation remain open. **Do not declare all P14 complete.**
