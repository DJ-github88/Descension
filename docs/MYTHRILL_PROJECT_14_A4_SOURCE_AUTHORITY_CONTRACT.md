# P14-A4 — exact placed-creature execution

2026-10-22 · **FROZEN before runtime edits. Authorized by Main HQ's P14-A4 execution prompt.**

## Reconciled source and ownership

Entry `master/485c0bbab9171879e2ea47cd83b44ddc0f046deb`; accepted A3 documentation/witness
changes are uncommitted. Existing Class/Fate Weaver correction3, character/HUD/token/Inventory
resource-overflow UI changes and shared status documents are unrelated work and are preserved.
Read A1/A2/A3 contracts and acceptance, engineering/priorities/coordination, current installed
registry, P9 payment/custody, P7 exact actors/writer, P8 and canonical C2 condition interfaces.
Prior acceptance carries forward; this is a source-authority delta, not a renewed historical audit.

## Supported workflow

GM authors/selects a whole Wizard-format separate activated ability in Creature Wizard, explicitly
keeps/saves it, places the creature, binds its real P7 actor if necessary, then uses placed Inspect →
Abilities & Spells. Refresh/admit the exact saved association **for this creature**, then Use for this
creature. Choose one distinct exact placed creature on the same room/map (dropdown or existing map
picker), retain physical faces or roll digitally once, prepare, explicitly adjudicate final amount,
confirm one consequence and inspect receipt/payment/HP. No PC-shaped source or fake owner consent.

One immediate ACTION; one direct damage OR healing; explicit nonnegative integer AP/mana; existing
bounded NdM±K. Names confer nothing. Zero AP/mana remain zero. Range0 is retained/displayed but this
distinct-target slice refuses it, as well as self-only restrictions; no self-target workaround.
Range/restrictions/defenses/flat DR/resistance/vulnerability/mitigation remain explicit GM rulings.
No armor-score/AC/equipment-DR concept is introduced for creatures. Complex records remain whole/manual.

## Exact source authority and immutable admission

Library/template ID is provenance, not authority. Source/target are current P7
`{kind:'creature',roomId,mapId,tokenId,instanceId}` with revision CAS; `instanceId` is incarnation.
Ability UUID, immutable installed version/hash, placement association hash, admission request UUID,
attempt UUID and command UUID/hash are distinct. Client association/status alone grants nothing.

The smallest additional binding is **exact placed source admission**, stored under the already
protected server-owned `state.actorContract.authoredAdmission`. It contains admission request/hash,
exact source ref, full detached association hash, exact installed definition ref and admitting GM UID.
Existing actor_authored_admit gains an explicit creature-source branch; current GM context/confirm,
A1 adapter/compiler/registry planner and P7 writer/install remain owners. Matching immutable content
can reuse an existing installed version; changed content needs sequential new version. A1a's closed
class syntax remains byte-protected: the adapter's legacy `arcanoneer` syntax anchor is serialization
only on this route, **never evidence of a creature class or execution entitlement**. Exact source
admission, whole association comparison and current GM supply creature authority independently.
Original PC admission/class checks and PC-only actor_spell_approve remain strict and unchanged in scope.

Replacement/recreation changes incarnation and never inherits admission. Duplication cannot use another
source's grant even if bytes were copied. Template edits do not propagate association to old placements;
placement edits mismatch the grant. Explicit refresh admission replaces the grant and invalidates old
unconsumed attempts. Existing version revocation disables all future acceptance of that version; receipts
remain historical. A new GM must explicitly admit again; previous GM attempts cannot be consumed.
Imported actorContract is already quarantined; trusted checkpoints retain the grant, whose complete
source/association/installed identity is revalidated before use. No separate permission/storage framework.

## Payment and atomic install

Authoritative creature pools: `state.currentActionPoints/currentMana/tempActionPoints/tempMana`, maxima
`maxAP/maxMana` with existing stats/creature stats fallbacks (`actorConsequences.resources`). Missing temp
means0; missing normal/max is unavailable, never unlimited. Positive prices require valid payable pool
and max; supported temp pools pay first. A free remote action uses existing unchanged-AP CAS, requiring
a real AP projection; no new pool is silently created. Bounds/revisions are checked at P7 stage.

Explicit GM-source preparation enters the existing spellPayments registry via a separately validated
source type. The same shared binder/planner produces one existing actor_consequence: source AP/mana and
target HP/tempHP plus receipt, synchronously consumes the attempt after P7 writer admission/install.
Damage consumes temp HP first/floors0; healing caps normal HP/leaves temp. Explicit accepted amount0
can pay the exact authored price. Opening/rolling/preparing/cancelling spend nothing. Any authority,
identity, admission, condition, revision, affordability, bounds or writer refusal installs none.

## Conditions, custody and recovery

Canonical assertCanAct/Stunned at preparation before/after authority await and final shared P7 stage.
Roll evidence survives refusal; after removing conditions, explicit revalidation refreshes revisions
with the original faces, not a free reroll. Material target/admission changes require explicit new
validation and keep prior evidence/history. Unknown outcomes block replacement.

Reuse existing scoped spell roll/attempt custody and sharedCondition command custody; no new storage
family. Persist attempt/faces before preparation emission and immutable command before consequence
emission. Same ID/different bytes refuses; duplicate confirmation returns original receipt. Lost ACK
checks the original command. Reload/rejoin restores status without submission. Historical recovery
silently hydrates actors/status, never replays chat/floats. Current authenticated GM may recover known
accepted history after deletion/revocation. New epoch rejects old unconsumed provenance; unavailable/
pruned exact outcomes require manual reconciliation, never a new ID/reroll. Temporary rooms are live-only;
persistent rooms retain the existing writer/checkpoint guarantees, not a new cloud durability claim.

## Writable / protected

Writable: installedAuthoredAbilities, existing actorConsequenceHandlers/spellPayments/P7 binder metadata,
socket authority event set; shared spell planner/controller/custody extensions; placed CreatureAbilityDetails
and existing inspect mount, normal admission component route option, existing P9 panel host; focused tests,
reusable App/evidence witnesses, Laws/help and requested status/roadmap/next contract docs.
The actorContract envelope already owns import/legacy-writer protection; no new catalogue/save migration.
Production-placement reconciliation adds a narrow `tokenHandlers.js` capture of the detached association
from the existing creature placement payload (plus its existing name/position). Ordinary public token
projection does not publish raw Wizard drafts. GM-only authored lookup supplies exact placed snapshots
for Inspect, including after reload; observer lookup does not expose them. Request-ID identity history
is bounded under the existing protected actorConsequences ledger and retained by its finalizer.
The shared actorConsequenceService projection additionally preserves authoritative unavailable unused
creature pools as absent; it never turns them into zero or rejects an otherwise accepted A4 receipt.
Protect A1a compiler/tests/fixtures, W1 resource editor/manager/serializer, class/heritage/card/resource
content and unrelated UI. Fresh-context patches in the shared tree; any separate-workspace writeback
must compare live bytes first. No commit/push/reset/deploy/dependency upgrade/migration.

## Acceptance gates

Focused production tests: damage/healing/exact prices/zeros/amount0, missing/insufficient pools/temp-first,
separate same-definition instances, association/version/v1-v2/revocation, foreign/non/current/replaced GM,
map/token/incarnation/deletion, Stunned before/during await and retained revalidation, stale CAS/bounds,
duplicates/conflicting bytes/writer refusal/no partial install, lost ACK/exact receipt, rejoin/restart/
checkpoint/import and unsupported PC/complex/self/range0 refusal. Relevant A1/A2/A3/P8/C2 regressions only.
Actual optimized App GM+observer: Creature Wizard save/reopen/place/Inspect/admit, physical damage/digital
healing, separate instances, exact once payment/HP/visible feedback, lost ACK original command and
Stunned retained-face revalidation. Detached production build/source manifest; one bounded independent
review with concrete repairs; bulk evidence external. Report actual runs and fixture/provider/device limits.

## Deferred and next bounded contract

No creature→PC/self/areas/chains/reactions/mixed conditions/periodic/delayed/expiry outcomes/entities/
movement/equipment costs/new economies/automatic mitigation. Next is a preparation-only creature→PC
contract using P12B exact owner block offer/consent/final damage and this route's source payment,
PC HP/equipment wear atomically; healing needs explicit separate target-consent policy and no blocking.
Class/Heritage content/loadouts/selection remain their track's work. P14 remains open.
