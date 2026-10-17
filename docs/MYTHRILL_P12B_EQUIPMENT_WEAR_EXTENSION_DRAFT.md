# P12B — typed equipment-wear extension (DRAFT for contract preparation)

2026-10-16 · **Not frozen, not authorized. No server or client change is made by this document.**
It refines contract §3's one-line placeholder `equipmentWear {slot, itemId, beforeDie, afterDie, broken}`.
It assumes none of D-A…D-J. The only decision that changes its meaning is **D-E** (see §8).
Companion: [MYTHRILL_P12B_FIRST_DECISION_BATCH.md](MYTHRILL_P12B_FIRST_DECISION_BATCH.md).

## 1. Facts verified in source (D:/VTT, read-only)

| # | Fact | Where | Consequence |
|---|---|---|---|
| F1 | A P7 actor entry accepts only `ref, expectedRevision, finalResources, conditions, classPayment` | `server/services/actorConsequences.js` `validateCommand` | Wear needs a new typed key; nothing can carry it today |
| F2 | `classPayment` is a named, source-owned adapter with an owner-only `sync` mode (CAS on `before`) and an approval-bound mode. Its home is on `token.state`; a new incarnation moves it to `actorRecovery`; `actor_propose` refuses it | `actorConsequences.stage`, `actorConsequenceHandlers.js` (bind, `actor_propose`) | Reuse this pattern exactly instead of inventing a new one |
| F3 | The room's shared equipment projection is a positive allowlist with no `durability`, `maxDurability`, `broken` or `instanceId`. Inventory is stripped | `roomAccessService.js` `EQUIPMENT_ITEM_SCALAR_KEYS`, `SHARED_CHARACTER_FIELDS` | No die is public today. Publishing one for declared pieces is a deliberate new disclosure |
| F4 | Outbound `token.state` is a positive allowlist; `classPayment` is not projected | `roomAccessService.projectStateUpdates` | A blocking declaration must be added explicitly |
| F5 | Inventory instances get `uuidv4()` ids. Exception: containers with `preserveId`. Starter/test equipment keeps the library `id` and a separate `instanceId` | `inventoryStore.processAddItem`/`addItemFromLibrary`; `characterSlices/coreSlice.js` | Identity is `(slot, id)`. A non-unique `id` must refuse declaration, never guess |
| F6 | Authored item dice use only d4, d6, d8, d10, d12, d20. Live records may also hold `'broken'`, legacy numbers (clamped to 0) or an object (`durability.max`, `EquipmentActionSlot`) | `src/data/items/**`; `itemStore.updateItemDurability`; `ui/EquipmentActionSlot.jsx` | Only ladder strings are declarable. Nothing is converted |
| F7 | Today's wear writer matches by `id` only. It fans out to itemStore (+ Firebase item save), inventoryStore and character equipment, then auto-unequips on break. There is no slot or before-value check | `itemStore.updateItemDurability`, `enhancedDiceService.handleWeaponFumble` | It can't be called blind from a receipt. If an equipped `id` equals a library item `id`, the library record would wear too |
| F8 | Defending is a P7 typed condition, `conditionKey: 'defending'` | `actorConsequenceService.roomCondition` | The server can check "no wear while Defending" against committed state |
| F9 | P8 Feather Slash is a GM-direct creature→PC command (creature AP + PC HP), with no owner approval. P9/P12A approvals are bound in `stage()` by a two-way binder dispatch with a cross-registry collision guard | `vtt-react/src/services/featherSlash.js`; `actorConsequences.stage` | 12B = P8 shape + an owner block approval + the wear entry. Dispatch gains a third registry |

## 2. Smallest shape

Two typed actor entries (character targets only) plus one approval capability. Nothing else is added.

### 2.1 Public blocking declaration (home on `token.state.blocking`)

```js
{ version: 1, revision: <int ≥ 1>, mode: 'block' | 'none',
  pieces: [ { slot, itemId, name, kind: 'armor' | 'shield', currentDie, broken } ] }
```

- `mode: 'none'` ⇔ `pieces: []` ("Don't block"; publishes no item).
- `mode: 'block'`: 1–4 pieces (favored + up to 3 backups, proposed bound), in order.
  - Slots and ids are unique.
  - `currentDie ∈ {d4,d6,d8,d10,d12,d20,broken}`; `broken ⇔ currentDie === 'broken'`.
  - `name` is at most 80 characters; `itemId` at most 120.
- Armor slots: head, shoulders, back, chest, wrists, gloves, waist, legs, feet. A shield is `offHand`
  with subtype `SHIELD` (proposed).
- **Cross-check at commit:** `token.character.equipment[slot].id === itemId`, and the kind matches the
  shared item's `type`/`subtype`. Otherwise → `equipment_projection_mismatch`.
- **Trust boundary.** The die itself is owner-declared, like the class home: the server can't see
  the private item.
- **Lifecycle.** A blocking declaration is never carried to a new incarnation. On bind it moves to
  `actorRecovery.priorBlocking` (as `classPayment` does).

### 2.2 Owner sync — actor key `blockingDeclaration`

```js
{ before: <current declaration or null>, after: <declaration with revision = before.revision + 1 (or 1)> }
```

- Accepted only through the direct actor command:
  - submitter is `ref.ownerUid`;
  - primary attachment;
  - single actor;
  - no `approval`.
- Refused while a block approval is pending for that character (`blocking_pending`). A CAS mismatch
  on `before` → `stale_blocking_state`. `actor_propose` refuses it (as with `classPayment`).
- Bumps `actorContract.revision`.
- "Own turn" timing is **not** enforced by the server in this draft (choice W-a).

### 2.3 Owner block approval — capability `p12b-block:v1`

```js
{ version: 1, roomId, approvalId, actionEpoch, baseCommitSequence,
  source: <creature ref>, target: <owner's character ref>,
  blocking: { revision, slot, itemId, die }, roll: { mode: 'digital' | 'physical', faces: [face] } }
```

- One face, `1 ≤ face ≤ die`.
- It approves only "this piece, this roll". It carries no HP, no attack data and no Defend claim.
- Registry: same rules as P12A/P9:
  - process memory, at most 32 pending per room, one per character;
  - closed + pending tombstones ≤ 4096;
  - `outcome_unknown` after a runtime change.
- Registered only by the target's owner, while `blocking.revision` matches.

### 2.4 Wear entry — actor key `equipmentWear` (GM command only)

```js
{ slot, itemId, blockingRevision, beforeDie, afterDie, broken }
```

**Server checks at `stage()`, synchronously and with no awaits:**
1. `command.approval` binds a pending `p12b-block:v1` approval with equal source/target refs. The wear
   entry is on the target actor; at most one wear entry per command.
2. The current declaration has `revision === approval.blocking.revision === blockingRevision`.
3. The named piece is the **first non-broken piece in declared order** (the published backup rule)
   and equals the approval's slot/itemId.
4. `currentDie === approval.die === beforeDie ≠ 'broken'`.
5. Server derivation; the entry must match exactly (`invalid_equipment_wear`):
   - `defending` = the target holds a condition with `conditionKey 'defending'`;
   - `wears` = `!defending && (kind === 'armor' ? face ≤ 2 : face === 1)`;
   - `afterDie` = `wears ? step(beforeDie) : beforeDie`, on the ladder `d20→d12→d10→d8→d6→d4→broken`;
   - `broken` = `afterDie === 'broken'`.
6. The cross-check from §2.1 still holds.

**Apply:** set the piece's `currentDie`/`broken`, `blocking.revision += 1`, `actorContract.revision += 1`
(once per actor, as today). HP on the same actor commits atomically in the same command and receipt.

**Not in this adapter:**
- whether a block was allowed (critical, non-physical);
- the HP arithmetic.

Those belong to the separately frozen 12B adjudication schema, which must use the **same approval
face** for DR and wear.

**Receipt (public):**

```js
actor.equipmentWear = { slot, itemId, name, kind, beforeDie, afterDie, broken, naturalFace, defending }
```

## 3. Owner device reconciliation (private, client)

The room commits the public die; the owner's private item record is changed only by the owner's
own client.

- **Trigger.** An accepted receipt (live, or recovered from the snapshot) whose `target` is the
  owner's active primary, carrying `equipmentWear`.
- **Precondition.** `characterStore.equipment[slot]` has `id === itemId` and current durability
  `=== beforeDie`, and the receipt's `commandId` is not in the bounded applied set.
- **Write.** Apply `afterDie` through a slot+id-scoped writer: equipment, the matching inventory
  instance, then save. **Not** the id-only fan-out in F7, which would also touch a library record
  sharing the id. On `broken`, perform the Laws' automatic unequip to the pack, then prompt for a new
  declaration.
- **Idempotence.**
  - Private die already `=== afterDie` and `commandId` recorded → no-op.
  - Historical or duplicate receipts never roll back.
- **Mismatch** (moved, repaired, different die):
  - write nothing;
  - keep a recovery candidate (bound 8, refusing at capacity, like `roomActorRecoveryCandidates`);
  - show "Wear from this hit is not on your sheet yet — reconcile with the GM".
  The room projection keeps the committed value.
- **Owner offline.** The receipt stays in the ledger (≤256, replay floor). If it was evicted before the
  owner saw it, the declaration's lower die at a newer revision is the recovery signal.

## 4. Privacy

- **Public:** the declared pieces' slot, opaque item id, name, kind, current die and broken flag,
  plus the receipt wear line.
- **Never public:** inventory, `maxDurability`, enchantments, or the durability of undeclared
  equipment. "Don't block" publishes nothing.
- **Approval:** names one piece and one face.

## 5. Retry and recovery

| Situation | Result |
|---|---|
| Same command ID and bytes | P7 `knownReceipt` → original receipt; no second wear |
| Same approval, new command | `approval_consumed` |
| Declaration changed/worn since the approval | `stale_blocking_state`, approval closed `owner_reapproval_required` |
| Actor revision moved (another hit landed) | `stale_actor_revision`; the approval stays pending if its declaration revision still matches |
| Runtime change | `outcome_unknown`; never auto-resubmitted; explicit checks recover existing receipts |
| Owner device replays the receipt | Precondition/applied-set no-op |

## 6. Exact P7 touch points for a later freeze

1. `validateCommand`: keys `blockingDeclaration`, `equipmentWear` (character refs only); shapes as §2.
2. `stage()`: apply both entries; third binder in the dispatch; extend the cross-registry collision
   guard to the new registry.
3. `publicReceipt`: the §2.4 public projection.
4. `PROTECTED`: add `blocking`, so legacy `token_updated` / `character_updated` writes refuse it.
5. Bind handler and `preserveImportedActorMetadata`: move `state.blocking` to recovery.
6. `roomAccessService.projectStateUpdates`: a positive `blocking` projection.
7. Client `applyAcceptedConsequence`: carry `state.blocking` from the snapshot, then run §3.

P9 module and approval handlers stay unchanged, as in 12A.

## 7. Draft acceptance checks

| ID | Check |
|---|---|
| W1 | Armor d8, face 2, not Defending → d6; same receipt carries HP |
| W2 | Shield d8, face 2 → no wear; face 1 → d6 |
| W3 | Defending condition held, face 1 → no wear; a client entry claiming wear is refused |
| W4 | d4 worn → `broken`; the next block uses the first backup; naming the broken piece is refused |
| W5 | d20 face 1 (armor) → d12 |
| W6 | A wrong `afterDie`, skipped backup, stale declaration revision or slot/id not in shared equipment → refused, nothing spent |
| W7 | A non-ladder durability can't be declared; there is no conversion |
| W8 | Same command retried → one wear; a second command on a consumed approval → `approval_consumed` |
| W9 | Owner device: wear applied once by slot+id; a library item sharing the id is untouched; a mismatch leaves a candidate |
| W10 | Legacy token update writing `state.blocking` → refused; new incarnation → declaration moved to recovery |
| W11 | Outbound projection: "Don't block" publishes no item; undeclared equipment shows no die |

## 8. Dependencies and HQ choices (not creator rules)

- **D-E** decides what `currentDie` means. The draft assumes the recommended "item's current die",
  the only reading consistent with "the durability die IS your defense die". A table answer requires
  a second die field and a different §2.4 derivation.
- **D-D** decides only whether a wear entry may accompany a critical. The adapter is agnostic.
  **D-C** and **D-B** affect only HP arithmetic.
- **W-a** Should the server enforce "set on your own turn" when combat is active (current turn =
  this character)? Proposed: not in the first build.
- **W-b** May the GM apply wear without an owner approval (owner absent, GM enters physical faces)?
  Proposed: no; the GM resolves it manually and the owner reconciles their sheet.
- **W-c** Visibility of the declaration: room-public (proposed, matching contract §3) or GM + owner only.
- **W-d** Backup bound (4 proposed) and the armor slot list.
- **W-e** Non-unique equipment ids (starter/test items): refuse declaration (proposed), or mint a uuid
  on equip as a separate, approved data fix.
