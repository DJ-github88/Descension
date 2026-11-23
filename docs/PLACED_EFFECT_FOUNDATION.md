# Placed-Effect Foundation (`placed-effect:v1`)

Reusable room-authoritative map placement custody shared across Wizard **Traps**, Inscriptor **Inscriptions**, and Totemist **Totems/Conduits**, built on the existing authored ability registry, committed movement pipeline, canonical condition records, and split checkpoint persistence.

## 1. Current Scope & Invariants

- **Shipped Production Mode (`placedEffectPolicy.js`) — Fail-Closed for Arming**:
  - `POLICY.creatorApproval` is `null` (`armedApproved() === false`), synced byte-identically between [`placedEffectPolicy.js`](file:///d:/VTT/vtt-react/src/services/placedEffectPolicy.js) and [`placedEffectPolicy.js`](file:///d:/VTT/server/shared/services/placedEffectPolicy.js).
  - Ordinary GM placement (`actor_placed_effect_place`, `armed: false`), inspection (`actor_placed_effect_list`), reconnect/checkpoint recovery (`room.gameState.placedEffectLedger`), and GM removal (`actor_placed_effect_remove`) operate in production.
  - Requests with `armed: true` fail closed (`placed_effect_arming_unapproved`), and `placedMovementTrigger.evaluateMovement` immediately exits when `armedApproved()` is `false`.
- **Existing Manual Wizard Traps Preserved**:
  - Saved manual Wizard `TRAP` drafts remain strictly manual (`spellType: 'TRAP'` in [`authoredAbility.js`](file:///d:/VTT/vtt-react/src/services/authoredAbility.js) and [`trapAuthoringAndManualGuard.test.jsx`](file:///d:/VTT/vtt-react/src/components/spellcrafting-wizard/__tests__/trapAuthoringAndManualGuard.test.jsx)), without modifying `authoredAbility.js`, `installedDefinitionRegistry.js`, or `executionCompatibility.js`.

## 2. Reusable Placed-Effect Record (`placedEffectLedger` v1)

Stored server-side on `room.gameState.placedEffectLedger` (projected per viewer through `actor_placed_effect_list`, scrubbed from raw `projectGameStateForClient` snapshots):

| Field | Purpose |
|---|---|
| `placementId` | Unique UUID per map placement (`contract: 'placed-effect:v1'`). |
| `family` | Domain tag: `'placed' \| 'trap' \| 'inscription' \| 'totem'`. |
| `armed` / `state` | `'placed'` (unarmed), `'armed'`, `'consumed'`, `'stale'`, or `'inactive'`. |
| `location` | Exact `{ mapId, position: { x, y }, shape: 'circle', radiusFeet, gridSnapshot: { gridType, gridSize, feetPerTile, offsetX, offsetY } }`. |
| `owner` / `ownerRevision` | Bound primary PC `actorRef` (`kind === 'character'`) and revision at placement. |
| `gmUid` | Authoritative GM user ID at placement time. |
| `definitionRef` / `sourceRecordId` | Exact admitted non-revoked, non-creatureOnly ability reference (`roomId`, `definitionId`, `definitionVersion`, `definitionHash`). |
| `visibility` / `rulesSnapshot` | Snapshot of `visibility`, `payment`, `expiry`, and `triggerEligibility` captured at placement. |
| `processedMoves` | Bounded SHA-256 move keys (`{ actionId, placementId, mapId, mover }`) preventing replay re-triggers. |

Staleness guards re-evaluate automatically on read and trigger evaluation:
- `placement_map_missing` when `location.mapId` is deleted.
- `placement_grid_changed` when square grid size, `feetPerTile`, or offsets change.
- `definition_revoked` / `definition_not_admitted` if the ability version changes or is revoked.
- `placement_owner_stale` / `placement_gm_changed` if ownership or GM authority changes.

## 3. Isolated Armed Execution & Non-Trigger Guarantees

Enabled strictly under the test-only module swapper ([`placedEffectTestLoader.cjs`](file:///d:/VTT/server/tests/helpers/placedEffectTestLoader.cjs) / [`placedEffectTestPolicy.js`](file:///d:/VTT/server/tests/helpers/placedEffectTestPolicy.js)) via `npm run test:placed:isolated`:

- Reuses committed movement choke points in [`syncService.js`](file:///d:/VTT/server/services/syncService.js) (`MovementDebouncer.flush`) and [`characterHandlers.js`](file:///d:/VTT/server/handlers/characterHandlers.js) (`character_moved` drop), plus `passiveMovementTrigger` footprint geometry (`isInsideRadius`), canonical condition building (`buildConditionRecord`), and transactional commits (`actors.stage(..., PASSIVE_TRIGGER_STAGE)` + `commitPassiveConsequence`).
- Fires strictly on `!wasInside && nowInside` transitions; atomically marks `'consume-on-first-trigger'` placements `state: 'consumed'` inside the same staged commit.
- Proven non-triggers: room load/checkpoint hydration, tokens already inside (`inside -> inside`, `inside -> outside`), zero displacement, drag frames (`isDragging: true`), teleport (`isTeleport` / `movementKind: 'teleport'`), forced movement (`forcedMovement`), owner self-entry, non-matching relationships, replayed `actionId` moves, removed placements, cross-map moves, deleted maps, and grid scale changes.

## 4. Domain Reuse: Traps vs Inscriptions vs Totems

Shared custody (`location`, `owner`, `definitionRef`, staleness, map/HUD overlay, reconnect recovery) stays decoupled from domain rules (`rulesSnapshot`):

- **Wizard Traps (`family: 'trap'`)**: Typically single-use concealed triggers waiting on enemy movement entry, resolving once and becoming `consumed`.
- **Inscriptor Inscriptions (`family: 'inscription'`)**: Class design ([`inscriptorData.js`](file:///d:/VTT/vtt-react/src/data/classes/inscriptorData.js), [`inscriptorResourceGuide.js`](file:///d:/VTT/vtt-react/src/data/resourceSystems/inscriptorResourceGuide.js)) uses **Runic Resonance (0–10)**, up to **5 active runes**, remote 40 ft discharge/detonation, and 1-hour persistence across surfaces or items rather than single-use self-consuming traps.
- **Totemist Totems (`family: 'totem'`)**: Class design ([`totemistData.js`](file:///d:/VTT/vtt-react/src/data/classes/totemistData.js), [`totemistResourceGuide.js`](file:///d:/VTT/vtt-react/src/data/resourceSystems/totemistResourceGuide.js)) uses **Conduit Attunement (0–10)**, up to **3 physical pylons** with discrete HP durability (`3x Level + Attunement`), persistent directional/pulse zones, and `manual-only` expiry instead of trap consumption.
- `placedEffectArmed.isolated.test.js` swaps `setTestRulesForTest` to `{ visibility: 'public', expiry: 'manual-only', triggerEligibility: { actorKind: 'any', relationship: 'ally', voluntaryMoveOnly: true } }` to prove `inscription` and `totem` reuse map custody without inheriting single-use trap consumption or hidden trap visibility.

## 5. Creator Rulings Needed for the First Actual Wizard Trap

Turning armed prototype support into the first real Wizard Trap requires explicit sign-off on four open rulings (`placedEffectPolicy.DECISIONS`):

1. **`PE1_TRIGGER_ELIGIBILITY` — Who triggers a Wizard Trap, and by what movement?**
   - *Decision needed*: Confirm whether only voluntary moves by `'enemy'` `'creature'` tokens trigger traps (`actorKind: 'creature'`, `relationship: 'enemy'`, `voluntaryMoveOnly: true`), or whether forced movement / teleport / hostile PCs / neutral NPCs can trigger.
   - *Recommended default*: `actorKind: 'creature'`, `relationship: 'enemy'`, `voluntaryMoveOnly: true` (matching `passiveMovementEntry` conservative defaults).
2. **`PE2_PAYMENT` — When and how is a Wizard Trap paid for?**
   - *Decision needed*: Confirm whether placing/arming a Wizard Trap deducts AP/Mana at placement time (requiring owner pre-approval like P9/A10 spells), at trigger detonation, or starts `'none'` until manual class cost settlement is wired.
   - *Recommended default*: Defer automatic deduction until owner approval UI for placement costs is built (`payment: 'none'` for initial GM-placed trap).
3. **`PE3_VISIBILITY` — Who sees placed Wizard Traps on map and HUD?**
   - *Decision needed*: Confirm whether Wizard Traps default to `'owner-and-gm'` (hidden from other players/enemies) or `'gm-only'` until detected/triggered.
   - *Recommended default*: `'owner-and-gm'` (caster knows where their own trap sits; observers cannot read concealed trap markers).
4. **`PE4_EXPIRY` — How do placed traps consume or expire?**
   - *Decision needed*: Confirm `'consume-on-first-trigger'` (marking placement `consumed` atomically with condition application), whether any save/miss still consumes the trap, and whether rest/room-reset clears active traps.
   - *Recommended default*: `'consume-on-first-trigger'` on first eligible entry.
