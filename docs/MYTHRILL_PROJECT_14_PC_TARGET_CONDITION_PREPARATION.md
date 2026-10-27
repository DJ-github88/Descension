# Next bounded PC-target condition contract — preparation only

**Superseded 2026-10-25:** Main HQ resolved D-PC-1 and authorized
[A9](MYTHRILL_PROJECT_14_A9_CONTRACT.md), now [implemented](MYTHRILL_PROJECT_14_A9_ACCEPTANCE.md).
Hostile current-GM success authority has no target ACK/online veto; voluntary application needs
explicit GM designation and independent affirmative target acceptance. PC-source payment consent
remains mandatory. The preparation below is retained as historical rationale, not the current gate.

2026-10-25. Follows [A8](MYTHRILL_PROJECT_14_A8_CONTRACT.md). No PC-target
implementation or policy is authorized by this preparation.

## Proposed closed capability

Retain the single admitted `authored-condition:v1` immediate ACTION, one canonical
Stunned application, explicit source AP/mana prices, source-authored duration and
GM manual expiry. One exact primary PC target on the same room/map. No reactions,
mixed effects, general buffs, save engine, automatic immunity or expiry engine.

| Source | Existing authority to reuse | Additional target boundary |
|---|---|---|
| Creature → primary PC | A4/A7 exact placed association, incarnation/admission/current authenticated GM; no PC owner price approval | Exact canonical target owner/character/primary attachment. Source outcome and payment remain GM-confirmed. Target notice/ack policy must be frozen. |
| Owner primary PC → primary PC | A1/A8 exact source owner approval of installed definition/version/hash, price, target and duration; source action/Stunned gates | Independent target-owner notice/ack, never reuse source price approval as target acknowledgement. Distinct principals may coincide but roles remain explicit. |

Creature-only installation never implicitly grants PC execution. Existing supported
binding vocabulary remains closed; no reconstructed-class registration/migration.

## Creator decision D-PC-1: acknowledgement versus hostile-effect authority

**Concrete case:** a GM-controlled hostile creature's admitted Bell ability succeeds
against Ilse after the GM resolves the save. Ilse's player is disconnected, or sees
the notice but disagrees with the ruling. Does non-acknowledgement block installation?

**Recommendation:** separate receipt/visibility acknowledgement from effect authority.
For a GM-adjudicated hostile effect, current authenticated GM success authority may
install on the exact target without target-owner approval. Deliver a truthful notice
and retain acknowledged/unacknowledged status; silence is not consent, and lack of
acknowledgement is not a universal hostile-condition veto. Source owner approval still
authorizes only that PC's exact payment/attempt. No timeout is treated as acceptance.

For a voluntarily accepted effect, use exact target-owner affirmative consent, not
silence or GM proxy approval. **Creator must decide** whether the next single Stunned
slice supports only hostile GM adjudication, only voluntary consent, or both explicitly
tagged modes, and who establishes the mode. Recommend **hostile GM-adjudicated mode
first**, with explicit GM attestation and owner-visible correction/dispute access,
because Stunned is chiefly hostile and a veto would change combat rules. Do not infer
mode from ally/enemy targeting text or a client toggle alone.

## Saves, immunities and ruling

GM manually resolves eligibility, range, save outcome, immunity and success before
installation; store private evidence separately from owner/public terms. A failed save
is not software proof; immunity is not inferred from a class name. Required success
confirmation must explicitly include immunity/eligibility review. If the GM finds a
save succeeded or immunity applies, no successful-application command is emitted;
attempt/tabletop resource costs remain manual as in A7/A8. This preparation assigns
no new saving throw, difficulty, advantage arithmetic or attempt price.

**D-PC-2:** if creator wants automated source payment on a failed/immune attempt,
freeze that independent price rule first. Recommend retaining A8 successful-only
automation in the next bounded contract.

## Atomic write and recovery

Reuse existing P7 source+target operation bound: source temp-first payment plus exact
canonical target condition, consent/attempt consumption and receipt in one admission.
Current source ownership/GM authority, target identity/primary/canonical character,
admission/revocation, source Stunned, revisions/bounds/capacity and writer checks repeat
after awaits. No local debit, optimistic condition or target-sheet direct mutation.
Notification/ack must not become a separate irreversible prepayment. Original immutable
command, owner approvals and any target ack retain exact IDs, epoch and receipt custody;
lost delivery recovers the original result silently. PC private resource projections
and target-player condition reconciliation need real App verification.

## Correction path and next freeze

Existing C2 exact-instance GM correction/removal is the authority path; target player
can report/dispute a ruling, inspect the permitted canonical source/duration and use
existing permitted proposal controls. A correction does not silently refund price,
rewrite the original receipt, merge sources or remove sibling instances. C4 named
Shield Bash schedules do not apply. Freeze which existing target correction proposals
require GM adjudication, preserving current permissions rather than inventing a veto.

Once D-PC-1 is decided, prepare one implementation contract with explicit public/private
target projections, acknowledgement delivery/rejoin states and no-ack wording. Verify
foreign/secondary/recreated target refusal, revoked source/GM, target-owner changes,
atomic refusal, independent instances, exact removal, disputes/corrections and original
command recovery. Keep creature-source and PC-source consent differences explicit.
