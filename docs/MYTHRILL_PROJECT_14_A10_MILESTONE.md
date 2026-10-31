# P14-A10 — composable authored combat effects (milestone)

2026-10-27 · Main HQ milestone brief (composable combat effects). One plan, then implementation and
evidence in this file. Reuses A1/A4/A7/A8 admission, owner consent and GM adjudication, P7 staging/
writer/receipts, C2 condition enforcement and C4's authenticated turn clock. No new engine.

## 1. Plan (written before runtime edits)

**Coordination check.** A10 had not started (ledger: "no contract/evidence/code"); nothing to reuse or
compete with. The concurrent character-reliability session is the sole writer of the files listed in
the ledger's *Integrated playable foundation* table (Character Wizard context, creation/view/management
pages, `characterHelpers.js`, `coreSlice.js`, `resourceSlice.js`, `characterScopedStorage.js` and their
tests). A10 edits none of them. Shared effective-stat helpers for *characters* stay theirs; A10's
numeric consumer is the existing condition-based movement helper used by creature tokens/combat.

**Supported outcome.**

- *A. Structured expiry.* A new versioned capability `authored-effect:v1` (compiler
  `p14-a10-effect-1`) in the existing installed registry. Its timing is one of `gm-manual`,
  `target-next-start`, `target-next-end`. Structured modes install a C4 schedule in the same P7
  stage as payment and the condition; if the clock, roster or capacity cannot take the schedule,
  the whole command is refused. Expiry happens only at C4's GM-confirmed turn boundary, exact
  instance, never from browser timers, reconnects or combat end. `authored-condition:v1` (A7–A9)
  keeps its manual meaning byte-for-byte.
- *B. Numeric family: flat movement speed (feet per movement AP).* Meaning: Laws "Moving costs
  1 AP"; the per-AP distance is the actor's speed. Consumer: `calculateEffectiveMovementSpeed`
  → combat movement AP validation/unlocked distance, creature token tooltip and Inspect. Order
  reuses the existing sheet order (condition multipliers, then flat additions, floor, clamp ≥0).
  Combination is bounded, not decided: at most one authored movement modifier per target;
  a second application is refused (`modifier_combination_unresolved`) so the GM resolves it.
- *C. Atomic bundle.* One direct damage OR healing plus one supported canonical effect (Stunned or
  the movement modifier) on one exact creature target, from an exact admitted placed creature or an
  exact owner primary PC. One P7 command: source payment + target HP + condition + schedule.

**Owned files (A10 writer).** Server: `shared/` mirrors (`authoredAbility.js`, new
`authoredEffect.js`, `sharedConditionProfile.js`, `sharedEffectTiming.js`, profiles JSON),
`installedDefinitionRegistry.js`, `installedAuthoredAbilities.js`, `spellPayments.js`,
`actorConsequences.js`, `sharedEffectLifecycle.js`, `scripts/sync-shared.js`, new tests. Client: the
mirrored services, `authoredAbilityRegistry.js`, `spellConsequence.js`, `spellConsequenceService.js`,
`SpellConsequencePanel.jsx`, `AuthoredConditionFields.jsx`, `Step3Effects.jsx` (narrow),
`spellWizardContext.js` (validity line only), `utils/conditionUtils.js`. Each file is compared with
its entry bytes before write-back; later concurrent changes are merged, never overwritten.

**Interfaces needed from others.** None blocking. Character stats: none (creature targets only).

**Internal increments.** (1) shared profiles/timing/adapter + compiler; (2) binder/P7/lifecycle;
(3) production-handler tests; (4) Wizard controls, movement consumer, launcher/panel/narration;
(5) build, connected App witness, one independent review, ledger/coordination/roadmap links.

**Acceptance scenarios.** The brief's eight App scenarios, backed by production-handler tests for
authority, atomicity (resource/writer/identity/capacity/schedule failure), lifecycle, independent
instances and lost-ACK recovery.

## 2. Implementation and evidence (2026-10-28)

**Status: delivered at this bounded boundary; one independent review ACCEPT after repairs; Build4 exit0;
connected production-App witness PASS (qualified, §2.4).** Per-capability status is in §2.1.

### 2.1 What players and the GM can now do

| Capability | Status | What actually happens |
|---|---|---|
| A. Structured expiry | **Working** | Spell Wizard → *Use composed effect profile*: expiry is *Manual*, *Start of the target's next turn* or *End of the target's next turn*. Structured instances get a C4 schedule in the same P7 stage as payment and the effect. Without an adopted authenticated clock with the target in the exact roster (or with schedule capacity full) the whole command is refused (`effect_schedule_unavailable`), nothing charged. Expiry happens only at the GM-confirmed C4 boundary for that exact instance; combat end/reset/reconnect retire the clock, and the instance is then labelled "not tracked by the current turn clock; GM removes". A7–A9 `authored-condition:v1` stays manual, unchanged. |
| B. Numeric family: flat movement speed | **Working (bounded)** | Authored `movement` effect, a whole-5 ft change from −60 to +60 with a name ("Mired −10 ft"). Canonical record (`shared-condition:movement-modifier:v1`, `effects.movementSpeed`) on the target. Consumer: `calculateEffectiveMovementSpeed` (creature Inspect speed, token movement confirmation and combat movement-AP validation), applied after existing condition multipliers, floor, never below 0; validated authored records only, so legacy/sandbox effects are never double-counted. Removal/expiry restores the base calculation. **Bound:** a second authored movement change on the same target is refused (`modifier_combination_unresolved`) — see §2.3. |
| C. Atomic combined effects | **Working** | One direct damage OR healing (DICE, retained faces, GM final amount + reason) plus Stunned or the movement change on one distinct exact creature; routes: exact admitted placed creature → creature, exact owner primary PC → creature. One P7 command installs source payment (temp-first), target HP and the condition (+ schedule) or nothing. Owner approval binds price, exact target, the whole effect bundle and duration; a changed GM timing requires fresh owner approval. PC targets for bundles remain unsupported (no new consent contract). |

Correction: accepted authored-effect instances are never edited; the GM removes the exact instance
(shared condition editor now lists movement changes with a GM-only *Remove … instance*), and
re-applies through a new approved action if needed. Generic writes cannot add or rebuild authored
provenance. Narration: one accepted-result line ("X uses Y on Z, applying … (expires …)"); floats
come only from exact HP deltas. Private GM evidence and (PC route) the GM timing note stay server-side.

### 2.2 Files (A10 writer)

Server: `services/{installedDefinitionRegistry,installedAuthoredAbilities,spellPayments,actorConsequences,
sharedEffectLifecycle}.js`, `shared/` mirrors (+ new `authoredEffect.js`), `scripts/sync-shared.js`,
`tests/p14a10AuthoredEffect.production.test.js`. Client: `services/{authoredEffect (new),authoredAbility,
authoredAbilityRegistry,itemAuthoredAbility,sharedConditionProfile,sharedEffectTiming,spellConsequence,
spellConsequenceService,acceptedResultFeed,sharedConditionService}.js`, `utils/conditionUtils.js`,
`components/hud/{SpellConsequencePanel,TargetHUD (exact-instance removal only)}.jsx`,
`components/conditions/SharedDefendingEditor.jsx`, Wizard `AuthoredConditionFields.{jsx,css}`,
`Step3Effects.jsx`, `spellWizardContext.js` (validity line), `AuthoredAdmission.jsx`, item/creature
ability display (`ItemAbilityAccess`, `ItemAbilityEditor`, `CreatureAuthoredAbility`), tests
`services/__tests__/{authoredEffect,sharedConditionService}.test.js`, witness
`verification/p14/composable-effect-app-browser.cjs`. `spellConsequence.js`'s concurrent
`combatAttributes` change (HQ/Sonnet I2) was preserved; A10 made no further edit to it.

### 2.3 Movement-modifier combination — HQ decision recorded, implementation deferred

*How do two authored movement changes on one target combine?* **HQ decision (2026-10-28):** different
named effects stack additively; reapplying the same named effect from the same source refreshes its
duration rather than stacking its value; movement speed never falls below 0 ft. **A10 is not expanded:**
it keeps its existing atomic refusal (`modifier_combination_unresolved`, nothing charged, GM resolves)
for any second authored movement change on the same target, until this policy is implemented and
tested in a separately scoped milestone. The 0 ft floor is already enforced by A10's consumer.

### 2.4 Verification

- **Server:** A10 registered production handlers **11/11** (authority, atomic refusal for resources/
  source Stunned/stale revision/writer/schedule capacity, authority-await races, independent instances,
  lost ACK/duplicate/combat end/old epoch, A7/C4 unchanged, review F1–F4 and finding 1). Full server
  suite **939+ passing**; the only 2 failures are P7 "after all" evidence-file hooks that need
  `verification/p7/evidence` (absent in the sandbox copy; identical on the pre-A10 base).
- **Client:** `authoredEffect` 4/4, `sharedConditionService` 13/13 (incl. movement removal); full
  suite on the current candidate 370 suites pass; the 13 failing suites are Class/persistence/asset
  suites outside A10 that need public assets or are concurrent Class work (`__tmp_ri8_lockgen`), none
  import A10 code. Scoped CI lint exit0 on every A10 client file.
- **Review:** one independent bounded review. Earlier pass F1–F4 (authored instances rewritable by
  update; non-GM removal; PC-route timing note public; retired-clock label) repaired. Recheck findings:
  1 MAJOR conflicting structured Wizard `durationConfig` executed a different timing → refused now;
  2 no movement removal control → added (first repair threw client-side, fixed, recheck closed);
  3 authored-only timings in the generic Stunned dropdown → filtered; 4 label claimed correction →
  "GM removal"; 5 HUD removal by name removed sibling instances → exact `recordId`. **Final ACCEPT.**
- **Build:** Build4 of the current device tree (captured 2026-10-28T07:47Z, `master/89cddc2b` + dirty
  work) plus final A10 bytes, `craco build` exit0, asset manifest
  `381c5271c62d1ccd05340287b75809882da4b51fe043f1a30f36c1535845378e`. Built in the cloud sandbox (Linux,
  same package-lock), not the native detached Windows runner; public media excluded except the three
  images imported by `src`.
- **Connected production App (App4) PASS** against Build4, `verification/p14/composable-effect-app-browser.cjs`
  (GM, owner, observer; registered backend; provider/ownership/lease/cloud fixtures; temporary room).
  All eight brief scenarios: (1) actual Spell Wizard authors *A10 Ember Snare* (1d6+2 + Stunned, end of
  target's next turn) and *A10 Mire Grip* (Mired −10 ft, start of target's next turn); save/reopen keeps
  the whole record; library admission for the PC route; (6) owner approval spends nothing, GM confirm
  without turn tracking refuses with state byte-identical; after enabling *Shared turn expiry* the same
  retained approval installs payment, HP 34→28 effective and Stunned in one receipt; private GM evidence
  never reaches the observer; one narration line each for GM/observer; (7) a second Ember Snare instance
  is independent; removing it keeps the first and its boundary; (2) real *Advance authenticated turn*:
  not removed at the target's start, removed at its end, observer agrees; (3) keeper creature applies
  Mire Grip through Inspect; (8) its ACK/delivery suppressed, reload, *Check same command* returns the
  original receipt with no second receipt/effect; movement consumer reads 25 ft (base 35) for GM Inspect
  and observer; (6b) a second Mire Grip is refused `modifier_combination_unresolved`, state unchanged;
  (4) at the target's next start Mired expires and speed returns to 35 ft; combat end changes no tokens.
  Desktop 1440 and tablet 1024 panels have no horizontal overflow (screenshots retained).
  **Qualifications:** the Creature Wizard's compatible-library list rendered empty in this sandbox
  (both saved records map as supported), so the keeper's association is the exact saved whole record
  placed through the real creature-store action; Inspect bind/admit/use are real. The combat tracker
  window overlapped Inspect tabs, so those tab/menu clicks dispatch the same React handlers; after
  reload the observer's speed read used the compiled `calculateEffectiveMovementSpeed` with its own
  projected token. Offline fonts are served empty to the test browser. 13 blocked-provider
  `Failed to fetch` page errors are fixture refusals. Evidence (outside Git, cloud workspace):
  `result.json` `dd9036e0…`, witness `ee50d1fe…`, asset manifest `381c5271…`.

### 2.5 Integration status

Source identity: device capture 2026-10-28T07:47Z (`master/89cddc2b`, dirty working tree) + A10 final
bytes; concurrent Class RI-8, character/attribute (Sonnet) and HQ I2 `combatAttributes` edits included
as captured, not accepted here. HQ's App14 accepted an earlier A10 snapshot; the post-freeze A10 delta
(review repairs above) is now complete — no further A10 writes are pending. HQ's PC-route
timing-note redaction is preserved (equivalent condition in `actorConsequences.publicReceipt`). No Git
writes, deployment, dependency change, rebalance or save migration.

**Final device identity (2026-10-28T20:40Z).** All 37 A10-touched files on D:\VTT were hashed
(LF-normalized) and match the Build4/App4 candidate byte-for-byte; none changed after the last A10 write
(08:37Z). The 15-file post-freeze delta with hashes is recorded in the coordination handoff.

### 2.6 Next reusable capability family

Turn-start/turn-end **periodic ticks** (authored damage/healing-over-time) on the same C4 clock and
P7 writer, once one settled authored tick profile exists — or a second
numeric family on the same canonical modifier record (e.g. a flat check modifier with an identified
consumer). The HQ movement-stacking policy (§2.3) is its own separately scoped milestone. Areas, propagation, reactions, summons and transformations stay later.
