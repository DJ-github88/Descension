# P14-A1 — Wizard-authored immediate ability execution

2026-10-22 · **FROZEN / implemented; bounded independent ACCEPT; Build4/App7 PASS.**
This is P14's first authored capability, not historical CR-A1b wholesale or P14 completion.

## Reconciled baseline and ownership

Entry `master/ad93fd78048a49030f28af18e23bcf0e91a2aa85`. A1a SHA256
`48b69255b8958ae75a7aa17ed7aa67c95b6d4c2bada63f4dcd24a305e20f0003` verified.
P7/P9 contracts, P11–P14 roadmap, Class handoff33 and retained A1a/A1b were read against
current source. C4 repaired ACCEPT/Build2/App4 is current; no historical checkpoint reopens it.
Since A1b investigation, shared Stunned, Riposte, shared conditions, authenticated expiry,
retained-roll recovery and result feedback exist. Reuse these owners.
Initial dirty files: engineering/priorities/coordination/roadmap/C4 docs; RI-2 correction2
evidence and `verification/p14/record-lifecycle-evidence.cjs`. Preserve those contributions.

## Capability and identity

`authored-immediate:v1`, adapter version `p14-a1-wizard-1`. A1a compiler/registry/fixtures remain
byte-preserved, including `executionEnabled:false` in its syntax descriptor. The installed lookup
adds runtime eligibility separately; no trust flag in a library record grants execution.
Canonical DTO/ref/hash/limits remain A1a §4–7: exact room, UUID definition ID, sequential version,
SHA256 of all canonical definition bytes. Original class-binding vocabulary is unchanged. GM chooses
an existing binding; execution checks the primary PC's corresponding class, with no inferred new IDs.
An edit needs a newly admitted immutable version and fresh exact consent. Prior versions/history are
retained; revocation appends a decision and affects future acceptance, never accepted history.

## Authoring and admission

Actual Wizard normal save retains a detached whole draft alongside its normal serialized/template/
outer record paths. Only explicit AP/mana integers and range integers (including zero) are admitted;
absent/null/malformed/conflicting values refuse, never default or repair. Normal save preserves range0.
The shared pure whole-record adapter inspects active mechanics and refuses unknown/conflicting fields,
mixed effects, chain/link/area/propagation, enabled crit/save/periodic/shield/trigger/mechanic programs,
material consumption, cooldowns, movement/entities/equipment and non-AP/mana prices. Known disabled
Wizard defaults are inert configuration, explicitly validated as such. Original unsupported records
remain saved/editable, visibly manual; no extraction of one supported component from a complex spell.

GM submits the saved library record for server validation and explicit admission/revocation using
the existing P7 handler context/confirm/admit owner. A1a plans against the server-owned registry at
`gameState.authoredSpellRegistry`; caller snapshots cannot replace it. After authorization awaits,
recheck exact context and registry revision before synchronous writer admission/install. A rejected
plan/admission installs no definition/decision. Registry transitions and actor executions are distinct
transactions; neither is claimed atomically coupled to a local library save.

## Execution / conservation / custody

One immediate ACTION; one exact primary owner PC source plus at most one exact primary PC or creature
target on the same map (self permitted). Formula exactly `NdM[+K|-K]` within A1a limits, no stat tokens
or executable input. One direct damage of one canonical type OR direct healing. Existing physical/
digital recording retains every face and arithmetic. Shared pure descriptor reading is reusable by
Laws simulations; no separate resolver. GM adjudicates legality, range, target restrictions, defense,
mitigation and final nonnegative integer amount; adjustment reason required when different from roll.

Extend existing P9 spell approval/payment/custody/controller/panel rather than parallel services.
An authored definition reference identifies its exact installed version/hash; server independently
matches name/kind/types/price/dice/constant, rejects class payment, checks current non-revoked registry,
owner UID/current membership/primary attachment/exact incarnations and canonical Stunned. Checks repeat
after await and at P7 stage. Owner approval spends nothing. AP/mana temporary pools first, temp HP
absorbs damage first, HP floors at0, healing caps at max with temp unchanged (P9 F9.3). Current revisions
and exact calculated finals bind to one P7 consequence: payment+HP+receipt, followed synchronously by
approval consumption, no await between admission/install/consumption. Failure installs none of them.

Reuse P7 receipt/epoch/replay-floor rules and P9 pre-emission device custody for original definition,
consent, faces, approval and command IDs/bytes. No automatic replacement/re-emission on reconnect.
Unknown blocks replacement; explicit same-byte check recovers original pending/receipt or honest unknown.
Stale-state GM revalidation retains faces; material edits require new consent. Old-epoch unknown work
never executes fresh after restart. Registry/checkpoint decode validates A1a history; trusted server
checkpoint restoration retains definitions/revocation and receipts. Imported client registry is recovery
data, never authority. Temporary rooms live-only; writer admission is accepted-live/checkpoint pending,
only actual confirmed revision establishes checkpoint-confirmed.

## Projection / UX

Private original drafts, pending consent and command custody are owner/GM only. Ordinary room snapshots
do not publish raw registry. Authenticated lookup exposes admitted canonical public capability records
and revocation status, not source drafts. Accepted-result narration/floats use existing P13A/P9 feed and
visibility/dedup. Existing parchment controls, physical dice, target/cost labels, keyboard/tablet access.
Labels distinguish saved locally, admission pending, admitted, unsupported/manual, revoked, pending
execution, accepted live, confirmed, failed/unknown. Save alone never means ready to execute.

## Writable / protected

Writable: additive pure `services/authoredAbility` adapter; server installed-registry helper; existing
P7 handler, spellPayments, actorConsequences protections, socket authority set, access projection;
client spellConsequence/service/panel/feed and library admission component; Wizard Review whole-draft/
range preservation only; focused tests/production-App witness, Laws and these status docs.
Actual normal-save/reopen trace also requires the same narrow whole-draft/ID/range preservation in
`SpellwizardApp.jsx` (its separate normal save owner) and Step4's range0 initializer/validation.
The review found dropped definition identity in the normal reopen mapping; retaining that ID is
necessary for explicit version2 admission. No W1 resource/serializer changes are authorized.
The actual production Spellbook uses `ExternalLivePreview.jsx`'s Complete Spell as its visible save;
that owner receives the same detached whole-draft/ID/range preservation. Step2 exposes an explicit
Immediate ACTION choice (previously no cast-time choice was materialized for ACTION). The adapter
accepts the W1-owned `actionPoints` selected-type marker only with matching explicit AP price; no
new economy is inferred from `primaryResourceType` presentation metadata.
For a zero-AP/zero-mana remote target, the source entry compare-and-sets its unchanged AP projection;
P7 requires a real typed operation for every participating actor. This adds no debit or price default
and keeps source+target and operation bounds unchanged. The real production library→Wizard tab switch
uses an owner-guarded transient request in the existing spellbook store, consumed by the normal reopen
mapping after mount (the old DOM-event-before-mount could lose the entire edit). No new storage lane.
Protect A1a compiler/tests/fixtures, W1 resource editor/manager/serializer, class/ancestry/cards/resources,
existing IDs/grants/migrations, unrelated concurrent files. Compare fresh context before every write.

## Acceptance / extension handoff

Two newly Wizard-authored distinct names (damage/healing) through save/reopen/admit/owner roll+consent/
GM final/P7/owner projection/observer feedback. Include AP0/range0, physical/digital fidelity, temp-first/
caps, no pre-spend; insufficient/Stunned/unauthorized; changed/revoked definitions pre/post await;
stale/deleted/recreated actors; concurrent spend; writer failure; duplicate/lost ACK/reload/reconnect;
checkpoint recovery/new epoch; preserved complex manual drafts; private pending data/once-only feedback.
Focused affected P8/P9/P12/E1a/C1–C4 seams, detached production build, real production-App GM/owner/observer
witness, one bounded independent reviewer with concrete repairs. Evidence bulk stays outside Git.

Future Class/ancestry/embedded Creature/Item authors target this same canonical capability/installed-ref
interface; those producers and class/heritage admission are not delivered here. Retain roadmap needs:
damage+conditions, self-costs/multiple components, specified-duration periodic changes, expiration outcomes,
suppression/stacking/recharge, reaction chains, obstruction/propagated targeting, environmental/tile predicates.
Next smallest extension: one explicitly mapped additional producer using this exact capability, before
widening the consequence shape. No automatic reconstructed-class/ancestry admission or resource economy.

## Implementation and verification — 2026-10-22

**Delivered at this boundary.** [Same-reviewer final acceptance](MYTHRILL_PROJECT_14_A1_ACCEPTANCE.md)
closes two concrete findings: incomplete outer/draft reconciliation and dropped reopen identity. The
reviewer independently inspected final source/evidence and measured identities; execution of tests,
build and App belongs to the implementer, not the reviewer (its execution sandbox was unavailable).
No unresolved concrete source findings. C4 and prior accepted phases are carried forward.

### Player / GM walkthrough

1. GM opens Spellbook → Spell Wizard. Choose ACTION and explicitly choose **Immediate** timing. Author
   one damage or direct-healing effect, DICE resolution, one formula (`1d6+2`, for example), Single
   Target with one restriction and explicit range. Set AP and mana as fixed whole numbers, including0.
   A displayed resource fallback is not a saved price: enter/review the fixed value. No server default
   fills absent values. Complete Spell saves the original whole draft normally.
2. Close/reopen Spell Library; open that spell's details (compact rows also support Enter/Space).
   **Refresh room admission** distinguishes local copies, current installed versions, changed copies
   and revocation. Choose an existing class binding, then **Admit this saved version**. Admission is
   exact and immutable. Editing retains the definition UUID, preserves0 AP/mana/range, and needs a new
   explicit admission/version. Old installed versions remain available until separately revoked.
3. Player selects the matching primary owner attachment. In the existing shared action/adjudication
   column, open **Admitted abilities**, refresh, and choose **Use admitted ability**. Pick one exact
   bound PC/creature on the same map; record physical faces or roll digitally once. Approve the shown
   price and roll. Nothing is spent at approval.
4. GM checks legality, range/restriction, defense and mitigation; enters the final amount and an
   adjustment reason when needed. **Accept one consequence** installs AP/mana payment and target HP
   together through P7. Matching owner projection, narration/history and HP/temp-HP feedback follow
   accepted receipts. Unknown work retains original bytes and blocks replacement; check the original
   approval/command. Reload/reconnect never automatically creates another action.

The real witnesses authored **Ink Lance** (1 AP,3 mana, Arcane `1d6+2`,30ft) and **Quiet Mending**
(0 AP,0 mana, healing `1d8+1`,0ft). Both use the same capability; their names confer no authority.
The pure mapping/reading interface is `authoredAbility.definitionFromWizard(record, context)` and
`readFormula(formula)`, followed by A1a compilation and trusted installed lookup. Laws can reuse those
pure checks/reading with the existing roll/command calculation; no second simulation resolver exists.

### Focused evidence

- **Server10 new production cases PASS:** two definitions, explicit zeros, physical/digital fidelity,
  no pre-spend, temp-first/caps/free remote operation, unsupported/conflicting/missing/null data,
  unauthorized admission/use/revocation, pending revocation and immutable version2, Stunned before and
  after consent, insufficient pools, stale/recreated/deleted actors, corrupt installed definition,
  simultaneous commands, writer refusal/no partial definition or consequence, authority-await change,
  real checkpoint build/decode/new runtime and known receipt versus old-epoch unknown recovery.
- **Affected seams:**70 production cases across P9/P12A/P12B/E1a/C2/C3/C4 PASS; C1 actual blocking and
  P8 restriction seams are included. Final affected P9 group10 PASS after receipt-recovery ordering
  repair. This reuses prior acceptance; it is not another historical audit or deployment acceptance.
- **Client:** final6 suites/74 tests PASS (authored pure/custody/P9 and accepted W1 resource/serialization
  controls); earlier65 condition/feed/Laws and4 retained-roll tests PASS. Groups overlap; no summed
  total is claimed. Scoped helper/controller/panel/admission lint0; mechanical UI detector `[]`.
- **Same bounded independent review:** initial F1/F2 BLOCK → repairs → source closure → final ACCEPT.
  The unchanged independent probe source has15 PASS when run by the implementer. Original probes,
  findings and intermediate reports remain under the same external review directory.
- **Build4:** detached frozen production compile exit0; mirrorDrift `[]`, concurrentLiveDrift `[]`.
  All16 scoped client runtime files match built inputs; all22 runtime files match App7 before/after
  and final source. Seven protected A1a/W1/universal-card hashes match. Asset-manifest SHA256
  `03fe9b4caf8ca85bdc150ff448c7ee3ae9e809a837a7f446bbba9af4228cf3a0`.
- **Production-App7 PASS:** actual Wizard controls/Complete Spell/normal library author2, close/reopen,
  GM admission, physical damage/digital healing, exact owner consent/no spend, actual temp-first/cap,
  personal HP reconciliation, observer narration/HP floats; lost GM ACK+broadcast → unknown/disabled
  replacement → GM reload → exact original command recovery, one receipt and observer chat once.
  Owner reload emits no action. Actual compact-library edit preserves UUID/zeros; local edit leaves
  installedv1 intact; explicitv2/new hash; mixed healing/debuff stays saved/manual, admission disabled
  and spends nothing. Desktop1440×1000/tablet1024×768 viewport captures retained.

Earlier App1–App5 include fixture-selector corrections and discovery of missing explicit-zero input
materialization/actual producer globalResolution; App6 completed execution/recovery but its immediate
post-refresh DOM count assertion raced the response. These remain retained history, not green final
witnesses. Build1–3 are intermediate, not the final accepted source identity.

### Identity / limitations / retained artifacts

Entry/final branch and HEAD: `master/ad93fd78048a49030f28af18e23bcf0e91a2aa85`; delivered source is the
**reviewed uncommitted bytes**, not HEAD alone. Initial C4/status/RI-2 evidence is preserved. No commit,
push, deployment, reset, upgrade or migration. No unrelated Class/heritage content is accepted here.

Reusable production witnesses: `server/tests/p14a1Authored.production.test.js`, two new authored client
test suites, `verification/p14/authored-app-browser.cjs` and `record-authored-evidence.cjs`. Bulk evidence:
`D:/AppData/Temp/opencode/p14a1-build4/`, `p14a1-app7/`, `p14a1-review1/`; final gate
`p14a1-final-evidence.json` SHA256 `94f806db35cb40c5bd324f5b376a262fc0f39156a2bee3aea4653087295eada4`.
It records all22 runtime hashes, seven protected identities, Build/App manifests and witness identity.
The independent report names the exact evidence hashes. All client-runtime mismatches are `[]`.

Provider authentication, canonical ownership, process lease and cloud transport are fixtures around
the real optimized App/registered backend. App7 receipts are **temporary-room live-only** and retain
three nonfatal `Failed to fetch` errors. Permanent writer refusal and checkpoint codec/restoration are
focused server evidence; App7 is not real cloud confirmation, deployment, second-device or physical-
tablet proof. General conditions/lifecycle, new actors/resources and broader P14 remain manual/open.

### Class / ancestry / embedded-editor handoff

Future producers supply a complete preserved record → positive adapter → canonical definition/version
→ GM-installed ref, then use this same owner-consent/P7 path. Neither a class package, heritage registry,
item grant nor source name is admission. Existing A1a binding IDs are unchanged; reconstructed classes
and ancestry need separately reviewed bindings/eligibility before using them. Creature/Item lightweight
editors can target this definition interface; acting-creature sources, new economies or additional
effect components require named extensions, not cloned engines. Main HQ owns authority/execution;
Class/Heritage owns content/loadouts/grants and producer mappings. The next smallest extension is one
lightweight producer emitting this exact already-admitted shape, with its own preservation witness.
