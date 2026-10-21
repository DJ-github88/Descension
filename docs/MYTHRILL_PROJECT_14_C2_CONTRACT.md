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

Pending. This freeze is not an acceptance claim.
