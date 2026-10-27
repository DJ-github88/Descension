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
