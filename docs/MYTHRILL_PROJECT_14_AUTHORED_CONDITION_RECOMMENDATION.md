# Next bounded capability — Wizard-authored condition application

2026-10-23 · Recommendation only after [A6](MYTHRILL_PROJECT_14_A6_ACCEPTANCE.md). Not frozen/implemented.

**Subsequent disposition:** this bounded recommendation was separately authorized, frozen and delivered
as [P14-A7](MYTHRILL_PROJECT_14_A7_ACCEPTANCE.md), repaired independent ACCEPT/Build4-App4 PASS (qualified).
The original preparation below remains historical rationale; A7's contract/acceptance owns current scope.

**Recommend one reusable first profile:** immediate ACTION, one exact admitted placed creature source,
one exact distinct placed creature target, exactly one **Stunned** condition, GM explicitly confirms the
already-resolved applicability/save outcome, explicit authored AP/mana, **manual duration/expiry only**.
Definition names confer no behavior. Begin creature→creature to reuse current GM authority without
introducing a target-owner consent policy. PC sources/targets can be separately scoped later.

## Architectural basis inspected

- Wizard whole drafts preserve buff/debuff/control/targeting/duration/trigger data; `debuffTypes.js`
  distinguishes control from reductions, vulnerability, periodic and spreading effects. This authoring
  vocabulary is richer than the executable domain and is not itself rule authority.
- Current `authoredAbility.definitionFromWizard` refuses buff/debuff/control/mixed/trigger/duration
  mechanics; A1a descriptor is direct damage/healing. Keep that accepted capability closed. A future
  separately versioned closed descriptor/profile must validate the **whole** saved definition and bind
  it to existing installed/source admission. Do not disguise a condition as direct healing or alter
  the protected compiler without a separately coordinated contract.
- `sharedConditionProfile.makeStunnedRecord` already owns exact target/sourceActor/sourceOccurrence,
  canonical predicate and manual timing. `sharedConditionService`/custody and P7 own display/write/retry.
  `actorConsequences.assertCanAct`, supported voluntary movement gates and existing consumers own
  mechanical enforcement. `sharedEffectLifecycle` is bounded C4 timing, not a general scheduler.

## Keep six concerns separate

| Concern | First profile / boundary |
|---|---|
| Application and source identity | Exact installed definition version/hash, immutable saved association, current-GM source grant, exact source/target refs and one immutable application occurrence. Map authored Stunned identity explicitly to canonical Stunned; do not match arbitrary display names. Reuse canonical record UUID/sourceActor/sourceEntityId, binding version/definition provenance through existing accepted command/receipt metadata. |
| Mechanical enforcement | Existing canonical Stunned consumers only. Applying a record does not implement saving throws, advantage, immunity, interrupt resolution or every action path. GM confirms unresolved applicability; preserve the original outcome evidence. No new buff values or condition mechanics. |
| Duration/expiry | Manual only, visibly labelled. Preserve authored durations whole; do not silently turn a timed definition into manual execution. Admit only an explicitly manual-compatible profile; other duration profiles stay unsupported until separately mapped. C4's named Defend/Bash schedules do not imply generic Wizard expiry. No wall-clock timer or periodic effects. |
| Payment/atomicity | One existing P7 consequence with source AP/mana finals and target canonical condition add, same receipt/consumption. Existing general P7 can represent this, but current spell binder explicitly forbids conditions and current named-condition stage forbids payment: a narrow typed reviewed binder/stage extension is required. Never call the manual condition controller and payment as separate accepted writes. No payment before final acceptance. |
| Stacking/independent instances | Preserve existing canonical Stunned independent source-occurrence behavior; no invented stat stacking or refresh rules. Duplicate command recovers original record; same application cannot create another instance. Separate sources remain individually removable; source identity must not collapse two casts or two token siblings. Any reapplication/refresh ambiguity remains explicit/manual. |
| Unsupported/mixed effects | Whole-definition validation refuses damage+condition, healing+buff, periodic/control chains, stat modifiers and unsupported targeting/timing. Preserve records and explain manual fallback; never execute a convenient subset. Generic buff/debuff arithmetic waits for a separately reviewed canonical profile. |

## Contract preparation needed before implementation

Freeze the exact Wizard field/profile mapping with Class/authoring, separate installed descriptor version,
application occurrence identity, manual timing semantics and allowed distinct creature target profile.
Then reuse the existing admission, retained outcome/custody, GM final and P7 installation/receipt owners.
Verification should prove source payment+condition atomicity, independent instances, current authority/
Stunned source refusal, stale same-evidence revalidation, duplicate/restart recovery and canonical engine
enforcement. No new values, durations, stacking, automatic timers, named spell controller or migration is
recommended by this document. Wider conditions and buff/debuff execution remain future work.
