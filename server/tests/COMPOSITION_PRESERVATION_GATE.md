# Composition-Preservation Gate (`server/`)

This gate catches overlapping-release regressions on `server/handlers/actorConsequenceHandlers.js` and its composed production-stack handlers before installation.

## Exact Command

From `D:\VTT\server`:

```powershell
# Against a staged release root (recommended before installing any candidate):
npm run test:composition -- --root <staged-root-path>

# Or directly with Node:
node tests/helpers/runCompositionGate.cjs --root <staged-root-path>

# Against the live tree (omits --root):
npm run test:composition
```

To self-verify the gate invariants in disposable temporary stages (frozen regressed fixture `5bbe3493...` fails on the intended reconciliation assertions, pinned repaired candidate `3467d9de...` passes, missing tests/modules/setup, assertion failures, and unlisted pending rows exit nonzero, no silent live-module fallback, and zero writes to live files):

```powershell
npm run test:composition:verify-gate
```

### Self-Check Provenance Controls

- **Negative control (frozen regressed fixture):** `handoff/terminal-approval-reconciliation-release-20261115/backup/actorConsequenceHandlers.js.BASE` (SHA-256 `5bbe34937e361a8333c4ca2049ae624af0253566f245145611664d47a67b12fb`). Never inferred from current live state, so later healthy live changes cannot invalidate the historical negative control.
- **Positive control (pinned repaired candidate):** `handoff/baseline-failure-disposition-20261115/candidate/server/handlers/actorConsequenceHandlers.js` (SHA-256 `3467d9de189ebdb9ed049514bb57a06269dcc3838108daf830862fea6f119216`).

## Stage-Root Contract

- `<staged-root-path>` must contain `server/` (with the bounded test files and handler/service modules under test) and `vtt-react/src/{services,data}/` (for shared-module checks).
- `tests/helpers/compositionStageGuard.cjs` is preloaded whenever `--root` points to a staged root distinct from `D:\VTT`. Any `require` that resolves into live `D:\VTT\server\` (outside `node_modules`) or `D:\VTT\vtt-react\` throws `ERR_LIVE_MODULE_SUBSTITUTION`.
- Missing required test files, missing modules, or failing assertions always exit nonzero.
- Ordinary execution uses the shipped production `passiveActivationPolicy.js` (never preloads `passiveActivationTestLoader.cjs` or sets `PASSIVE_APPROVED`).

## Bounded Real-Handler Suite

1. `tests/terminalApprovalComposition.production.test.js` — combined passive (`actor_passive_list`, `actor_passive_activate`, `actor_passive_revoke`), relationship (`actor_relationship_set`, `actor_relationship_list` with `actor_not_found` / `forbidden`), retained `approvalId` refresh, and `closedApproval` privacy.
2. `tests/companionReconciliationComposition.production.test.js` — companion reconciliation committed-closure behavior (`actor_companion_dismiss` and `actor_companion_place` missing-token reconcile closing pending approvals with `actor_removed`, `actor_spell_closed`, and `actor_spell_list` privacy).
3. `tests/spellApprovalListReconciliation.production.test.js` — `actor_spell_list` retained `approvalId`, `closedApproval`, and `consumedReceipt` owner/GM/observer privacy.
4. `tests/relationshipPickerHandler.test.js` — exact-source authorization, hidden-target refusal, and forged `actor_spell_approve` relationship guard.
5. `tests/firstPlayablePassive.production.test.js` — production-policy passive registration, eligibility, initiative consumption, persistence, privacy, and rollback.

## Required vs Optional/Pending Cases

- **Required (must execute and pass; missing or pending fails the gate):**
  - `serves passive activation, relationship queries and retained-approval refresh / exact closures together`
  - `actor_companion_dismiss commits closure of pending approval targeting the companion and reconciles via actor_spell_list`
  - `actor_companion_place reconciliation closes pending approval when active companion token is missing from map`
  - `returns closedApproval for owner and GM after combat_clock_changed, never for unrelated player/observer, and never fabricates for unknown IDs`
  - `returns consumedReceipt for owner and GM when accepted, never for unrelated player/observer`
  - `scopes actor_relationship_list to authorized source and visible target without hidden-token discovery or private fields`
  - `forged client actor_spell_approve still fails at the server binder on relationship mismatch`
  - `ships passiveActivationPolicy.js with explicit creator approval (approved() === true, P1-P5) and byte-identical client/server mirrors`
  - `represents Heightened Senses with exact identity, Perception NOVICE eligibility, and provenance while refusing unrelated passives`
  - `refuses non-GM activation/revocation, creatures, and secondary attachments`
- **Optional/Pending (loader-dependent policy-swap rows in `firstPlayablePassive.production.test.js`; expected `pending` in ordinary production-policy execution):**
  - `refuses actor_passive_activate with passive_activation_unapproved and applies +0 initiative when policy is unapproved`
  - `supports all three P4 stacking modes in isolated test policy`
