# P6 — Truthful Character Save and Offline Status

Frozen 2026-10-12 before production edits. Authority: `MYTHRILL_NEXT_PHASE.md`
§26 Project 6, §11 scopes, §12 authority, §21 H3/H5 and §27 dependencies.
Accepted baseline: `620fbc072e87f113cdcc2ea323e0c6c2b28e6d6b`; P5 evidence is
separately retained in `MYTHRILL_P5_01_INDEPENDENT_ACCEPTANCE_20261012.md`.

## Behavior and boundaries

1. For the selected owner/character show **Canonical character** and **Personal
   runtime** outcomes separately. Labels: pending, saving, cloud saved, failed;
   retention: device draft vs memory only. Idle/unverified is not cloud saved.
2. Cloud saved requires the actual relevant write's backend confirmation for the
   latest captured edit. Device bytes, SDK latency compensation, a localOnly
   result, offline no-op, backup, journal save or accepted live room are not that
   confirmation. Runtime status is an owner personal snapshot, not a room checkpoint.
3. Capture owner scope/account generation/character/lane and an immutable payload
   at authoring/scheduling time. Latest edit identity is a monotonic adapter
   revision plus payload identity, not a wall clock. Older success/failure cannot
   clear or relabel newer work. Per-document writes remain serialized.
4. Every continuation requires the original generation, matching live principal
   and non-isolated gate. Character switches cannot redirect a captured operation
   or its status. Existing P5 required roster/marker confirmation and handoff
   failure hold remain authoritative and intact.
5. Retain the exact latest draft before cloud work, using P5 registered scoped
   storage; a refused write leaves prior durable bytes and a private memory
   candidate. Report quota/serialization/network/persistence failure visibly.
   Memory-only is explicitly not reload-safe. Failed draft serialization/export
   reports failure rather than silently dropping unsupported values.
6. Manual retry is one attempt per selected lane, coalesced while in flight;
   reconnect retries matching supported personal drafts once. No endless replay
   or automatic class payment, roll, resource transition or room action.
7. Recover selected scoped drafts after reload/account return before stale cloud
   hydration. Download a versioned JSON document for only the selected character,
   including canonical/runtime candidates and owner provenance. Import validates
   version/owner/character and retains the candidate before explicit retry; no
   cross-owner adoption. Preserve inventory, equipment, notes, banks, body and
   acquisition data and unknown preserved fields.
8. Offline character no-ops retain queued work and pending/manual-reconciliation
   metadata; unverifiable historic synced cache metadata becomes pending. No flat
   writes to canonical character documents.

## Production paths inspected

- Canonical mutations: character `infoSlice`/`resourceSlice` →
  `triggerCharacterAutoSave` (2,000ms); stats/progression and inventory also call
  `saveCurrentCharacter` → `coreSlice.updateCharacter` → scoped `saveRoster` +
  required deferred marker → `characterPersistenceService.saveCharacter(data,
  userId, {isCurrent})` → serialized `persistCharacter` → `updateDoc`.
- Recovery: `loadCharacters` + `mergeRetainedCharacterCandidate` /
  `resumeDeferredCharacterPublication`; `loadCharacter`/`setActiveCharacter`.
- Runtime: mounted `PersistenceProvider` → `CharacterPersistenceProvider` →
  `useCharacterPersistence` subscriptions/debounce/forceSave → facade
  `persistenceService.saveCharacterState` → `characterStateService` → `setDoc`.
  Hook load and realtime application feed the actual inventory and character
  stores. Write-token echo suppression is retained.
- UI consumers: a small shared status/retry/download surface in the owned sheet,
  owned character page/account management; provider supplies runtime retry.
  Inspection of another player's sheet does not show personal save controls.
- Supplementary offline cache: `storeCharacterOffline`, `updateCharacterData`,
  `syncOfflineData`; cache sync metadata cannot establish upload confirmation.
- Deferred observations: sync service is reachable through session `recordChange`
  failures/local sessions; it omits owner in load and reverses save arguments.
  Backup restore reverses save arguments but no mounted production caller was
  found. Correct only the reachable sync attribution/outcome defect; document
  backup restore as deferred unless a production consumer is demonstrated.

## Implementation boundary / non-goals

Reuse P5 scoped primitives and existing persistenceStatusStore, canonical tails,
runtime service and mounted provider. A small character-specific outcome/draft
adapter is permitted; no replacement of every persistence service. No full
offline action queue/conflict solver, cloud CAS system, room authority/P7 actor
reconciliation, class economics/gameplay/Prism/ROAD changes, schema rewrite,
whole-account export/backup UI, P7–P14, commit, push or deploy.

## Acceptance witnesses

Production canonical store/service and mounted runtime hook/consumer must cover
current success; newer edit during old pending write; older success/failure;
offline/failure/healed retry; storage refusal/private source hold;
account switch/same-UID new generation; character switch; reload/recovery;
selected export/import fidelity; canonical/runtime distinctions and token echo.
External auth/Firestore boundaries may be explicitly simulated, not outcomes or
ownership logic. Run affected accepted P5 preservation/privacy/journal/socket
regressions and browser P5 replay, targeted lint and detached production build.
Real second-device/staged Firebase evidence remains separately unexecuted when
no isolated backend is available. Nine P5 environment gates remain outstanding.

Rollback disables the adapter/retries with honest unsaved indicators and retained
drafts; it never purges scoped sources or replays gameplay.
