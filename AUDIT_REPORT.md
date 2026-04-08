# Mythrill VTT — Integrity Audit Report

**Date:** April 8, 2026  
**Scope:** TTRPG Rule Engine, VTT Synchronization, Firebase Backend Integrity  
**Status:** COMPLETE

---

## Table of Contents

1. [Mechanical Breaks](#1-mechanical-breaks)
2. [Sync & Database Failures](#2-sync--database-failures)
3. [VTT Friction](#3-vtt-friction)
4. [Severity Summary](#4-severity-summary)
5. [Appendix A: Files Examined](#appendix-a-files-examined)
6. [Appendix B: Unaudited Areas & Continuation Plan](#appendix-b-unaudited-areas--continuation-plan)

---

## 1. Mechanical Breaks

> Where the TTRPG math or rules fail.

### M-01: Debuff Double-Negation — Debuffs Apply as Buffs

**Severity:** HIGH  
**Files:** `vtt-react/src/services/effectProcessingService.js:351-375`, `vtt-react/src/store/debuffStore.js:357`

`debuffStore.getActiveDebuffEffects()` already negates debuff values (positive → negative). `effectProcessingService.getStatModifiersForTarget()` negates them **again** (line 375: `const negativeValue = effectValue > 0 ? -effectValue : effectValue`). When both code paths are active, a debuff that should reduce Strength by 2 instead **increases** it by 2.

**Impact:** Players with debuffs can receive stat bonuses through the over-time effect processing path. This affects DOT/HOT processing during combat turns.

---

### M-02: Level-Up Is Not Atomic — HP/Mana Bonuses Can Be Permanently Lost

**Severity:** MEDIUM  
**Files:** `vtt-react/src/store/characterStore.js:4241-4376`, `vtt-react/src/utils/experienceUtils.js`

The level-up process performs 3+ separate `set()` calls:
1. `set({ stats: newStats })` — attribute increases
2. `set({ levelUpHistory: ... })` — records the choice
3. `get().initializeCharacter()` — recalculates derived stats from history

If the app crashes or connection drops between steps 1 and 2, the attribute increase is applied but `levelUpHistory` has no entry for that level. On next `initializeCharacter()`, the HP/Mana bonuses from that level are lost because they're summed from `levelUpHistory` (line 2057-2061). No rollback mechanism exists.

**Impact:** Characters can level up without gaining the correct max HP/Mana. The lost bonuses are silent — no error, no indication.

---

### M-03: Rest Mechanics Are Incomplete — Cooldowns, Class Resources, Buffs Not Reset

**Severity:** MEDIUM  
**Files:** `vtt-react/src/store/gameStore.js:557-729`, `vtt-react/src/components/spellcrafting-wizard/core/mechanics/cooldownSystem.js`

Neither `takeShortRest` nor `takeLongRest` resets:
- **Spell cooldowns** — The cooldown system HAS a `resetCooldown` function with rest-processing logic, but it is **never invoked** by the rest functions.
- **Class resources** — Class resources defined with `shortRest`/`longRest` recovery in `classResources.js` are not reset.
- **Active buffs/debuffs** — Neither rest type clears temporary buffs/debuffs.

**Impact:** A long rest restores HP/Mana/AP but leaves the character unable to cast spells (cooldowns still active) and still debuffed. This breaks the TTRPG rest cycle entirely.

---

### M-04: Consumable Buffs Applied Twice

**Severity:** MEDIUM  
**Files:** `vtt-react/src/utils/consumableUtils.js:596-652`

`completeConsumableUsage` applies buffs/debuffs at lines 619-628 **and again** at lines 635-644. The `remainingOverheals.length === 0` check re-applies buffs unconditionally.

**Impact:** Consumable items grant double buff duration/strength. A potion that should grant +2 STR for 1 round grants +4 STR or +2 STR for 2 rounds.

---

### M-05: Spell Casting Deducts Resources Before Applying Effects — No Rollback

**Severity:** MEDIUM  
**Files:** `vtt-react/src/components/ui/ActionBar.jsx:1380-1660`

Spell casting flow:
1. Deduct Mana
2. Deduct AP
3. Deduct class resources
4. Apply effects to targets (happens separately, even in different code paths)
5. Start cooldown (local state only, lost on page refresh)

If the app crashes between steps 1-4, the caster has spent resources but the spell effect never happened. No compensation logic exists. Additionally, immediate spell effects (damage/healing to targets) appear disconnected from the casting flow — `effectProcessingService.js` only handles over-time effects, not instant spell resolution.

**Impact:** Mana/AP spent on spells that never resolve. Spell cooldowns are trivially bypassed by refreshing the page.

---

### M-06: Rest Is Not Atomic — Partial Rest State

**Severity:** MEDIUM  
**Files:** `vtt-react/src/store/gameStore.js:557-662`

Both `takeShortRest` and `takeLongRest` perform 6+ separate store mutations (HP, Mana, AP, temp HP, temp Mana, temp AP). Each triggers its own multiplayer sync event. If the app crashes mid-rest, the character has partial benefits. Other players see a partially-rested character in real-time due to the individual sync events.

**Impact:** A crashed rest can leave a character with restored HP but not Mana, with the other players' HUDs showing the inconsistent state.

---

### M-07: No TTRPG Rule Enforcement — All Rules Client-Side Only

**Severity:** HIGH (design-level)  
**Files:** `vtt-react/src/store/combatStore.js`, `server/handlers/socketHandlers.js:2293-2366`

All TTRPG rules run client-side with zero server validation:
- **Initiative rolls:** Client generates with `Math.random()`, server stores verbatim. A modified client can set any initiative value.
- **AP spending:** Client tracks locally, server accepts any AP value via `character_resource_updated`.
- **Damage/healing:** All calculations use `Math.random()` client-side. Results sent as absolute values, server accepts without verification.
- **Resource limits:** No server check that a player has enough mana/AP to cast. `canCastSpell()` is client-side only.
- **Buff/debuff effects:** Arbitrary stat modifiers accepted via `buff_update`/`debuff_update`.
- **Turn authority:** Any player (not just GM or current turn holder) can emit `combat_turn_changed`.

The server's `validationService.js` has a `combat_action` Joi schema that is **never used** by actual combat handlers.

**Impact:** A modified client can fabricate combat data, heal to full at will, set arbitrary damage values, and manipulate turn order. In a cooperative VTT this may be acceptable (trust model), but it provides zero protection against cheating.

---

### M-08: Formula Evaluation Uses `Function()` Constructor — Code Injection Risk

**Severity:** LOW  
**Files:** `vtt-react/src/components/spellcrafting-wizard/core/mechanics/resolutionEngine.js:430-451`

`evaluateFormula()` uses `new Function()` to evaluate spell formulas. The regex safety check (line 446) blocks some characters but allows `?:><=&|` which could enable ternary expressions and other non-math operations. The developer notes: "This is still not completely safe for untrusted input."

**Impact:** Community-shared spells with crafted formulas could execute arbitrary JavaScript in the browser.

---

### M-09: Crafting System Produces No Items — Complete Ghost

**Severity:** HIGH  
**Files:** `vtt-react/src/store/craftingStore.js:354-575`

`useCraftingStore` uses `zustand/persist` with localStorage only. No Firebase import exists anywhere in the file. `completeCraftingItem()` (line 524) sets the queue item's `status: 'completed'` but never transfers the crafted item to `inventoryStore`, `characterStore`, or any Firebase collection. The `resultItemId` on each recipe is defined but never consumed by any downstream system.

**Impact:** Crafting is a purely cosmetic minigame. Completed items appear in the crafting queue as "completed" but the player never receives them. Profession levels and experience are also localStorage-only, lost on cache clear.

---

### M-10: Quest Rewards Never Delivered to Character Data

**Severity:** HIGH  
**Files:** `vtt-react/src/store/questStore.js:78-517`

`useQuestStore` uses `zustand/persist` with localStorage only. No Firebase import. The `completeQuest()` function (line 214) sets `status: 'completed'` but never calls inventory, currency, or XP services. The `pendingRewardDeliveries`/`confirmRewardDelivery` flow (lines 351-398) is a local UI state machine — the GM "approves" a reward but no actual gold, items, or XP are written to `characterStore` or Firebase.

**Impact:** Quest completion is cosmetic. The reward struct (`experience`, `currency`, `items`) exists on quest objects but is never applied. Players see "Quest Complete" but receive nothing.

---

### M-11: Talent Tree Selections Lost on Page Refresh

**Severity:** HIGH  
**Files:** `vtt-react/src/components/windows/TalentTreeWindow.jsx:236-237, 316-326`

Talent selections are stored in React `useState({})` (line 237: `const [talents, setTalents] = useState({})`). The component reads `class` and `level` from `useCharacterStore` (line 234) but **never writes talent selections back** to any store. No Firebase write. No Zustand store. The `handleTalentClick` function (line 316) updates the local `talents` state object only. On unmount (window close, page refresh, route change), all talent investments are destroyed.

**Impact:** Players spend talent points, see the UI update, close the window, and all progress is gone. No persistence mechanism exists at any layer.

---

### M-12: Spellbook and Custom Spells Not Persisted to Firebase

**Severity:** MEDIUM  
**Files:** `vtt-react/src/store/spellbookStore.js:29-140`, `vtt-react/src/utils/raceDisciplineSpellUtils.js:449-492`

`useSpellbookStore` uses `zustand/persist` with a custom `localStorage` adapter. No Firebase import. Custom spells, collections, and favorites are localStorage-only, lost on cache clear.

`raceDisciplineSpellUtils.js` `addSpellsToLibrary()` (line 449) dispatches to `SpellLibraryContext` (a React Context), not to `spellbookStore` or Firebase. The context is in-memory only. Race and discipline spells are computed and displayed but not durably saved to the player's spellbook.

**Impact:** Custom spells and race/class spell collections are tied to the browser's localStorage. Clearing browser data or switching devices loses all spell customization.

---

### M-13: Action Bar Layout Not Synced to Firebase

**Severity:** LOW  
**Files:** `vtt-react/src/services/actionBarPersistenceService.js:1-391`, `vtt-react/src/hooks/useActionBarPersistence.js:1-224`

`ActionBarPersistenceService` uses `localStorage.setItem()` exclusively (line 75). No Firebase import. The `useActionBarPersistence` hook faithfully calls the persistence service (line 81) and debounces saves (line 106), but the underlying storage is browser-local.

**Impact:** Action bar layouts and hotkey bindings differ across devices/browsers. A player who customizes their action bar on desktop sees the default layout on mobile.

---

## 2. Sync & Database Failures

> Where Firebase updates are missing, slow, or risky.

### S-01: Room Deletion Does Not Cascade to Subcollections — Permanent Orphan Data

**Severity:** CRITICAL  
**Files:** `vtt-react/src/services/roomService.js:419-435`, `server/services/firebaseService.js:506-512`

`deleteRoom()` calls `deleteDoc()` on the room document. Firestore does **NOT** auto-delete subcollections. The following data becomes permanent orphans:
- `rooms/{roomId}/gameState/*` — all map data, tokens, fog of war
- `rooms/{roomId}/chat/*` — all chat messages

The admin script `server/scripts/deleteAllRooms.js` correctly deletes subcollections, but this is only a bulk tool, not called during normal operation.

**Impact:** Every deleted room leaves behind potentially large subcollections that accumulate forever, consuming storage and increasing Firebase costs.

---

### S-02: Character Deletion Is Soft-Delete Only — No Cascade Cleanup

**Severity:** CRITICAL  
**Files:** `vtt-react/src/services/firebase/characterPersistenceService.js:483-521`, `vtt-react/src/store/characterStore.js:2699`

Character deletion only sets `metadata.deletedAt` timestamp. The document persists forever. Additionally, the following are **never cleaned up**:

| Orphaned Data | Service | Has Cleanup Function? |
|---|---|---|
| `users/{userId}/characterStates/{charId}` | characterStateService.js | Yes (`deleteCharacterState`) — **never called** |
| `characterSessions` collection | characterSessionService.js | Yes (`forceEndAllSessions`) — **never called** |
| Character backups | characterBackupService.js | No |
| Tokens on maps | socketHandlers.js | No event emitted |
| Party member entries | partyStore.js | No |
| Presence data | presenceService.js | No |
| Combat turn order entries | socketHandlers.js | No |
| Campaign character links | campaignService.js | No |

**Impact:** Deleted characters leave behind runtime state, active sessions, map tokens, and party entries. The character document itself still counts toward Firestore storage.

---

### S-03: User Account Deletion Misses Critical Data

**Severity:** HIGH  
**Files:** `vtt-react/src/services/firebase/persistenceService.js:448-471`

`deleteAllUserData()` cleans user-scoped subcollections (characterStates, roomStates, journals, campaigns) but misses:
- **Character documents** in top-level `characters` collection
- **Rooms where user is GM** — abandoned rooms persist forever
- **Community contributions** — items/spells/maps shared to community reference deleted userId
- **Friend relationships** — other users' friend lists still contain the deleted user
- **Friend requests** — pending requests are not cancelled
- **Presence document** — stale online status
- **Firebase Auth account** — not deleted

**Impact:** Account deletion leaves significant orphan data and broken references across the system.

---

### S-04: Map Deletion Leaves Dead Portal Connections

**Severity:** HIGH  
**Files:** `server/handlers/socketHandlers.js:1653-1662`, `vtt-react/src/components/level-editor/TileOverlay.jsx:602-657`

When a map is deleted via `map_update {action: 'delete'}`, no code scans other maps' `dndElements` to remove portals pointing to the deleted map. The portal deletion code (`TileOverlay.jsx:620-657`) handles deleting a **single connection** but NOT when an entire map is removed.

Additionally, player map assignments (`playerMapAssignments[playerId]`) are not updated when their assigned map is deleted.

**Impact:** Portals on other maps that pointed to the deleted map become dead links. Players assigned to the deleted map have stale assignments.

---

### S-05: Token Movements Not Directly Persisted to Firebase

**Severity:** MEDIUM  
**Files:** `server/services/syncService.js:88-193`

`MovementDebouncer` updates in-memory state and broadcasts via Socket.io every 50ms, but does **NOT** write to Firebase. Token positions are only persisted when **another event** triggers `firebaseBatchWriter.queueWrite()` (token_created, token_updated, map_update, etc.).

If no other event fires after a token is moved, the movement is lost on server restart. In practice, periodic events like fog updates or combat turns will trigger saves, but pure movement-only sessions can lose positions.

**Impact:** Token positions can be lost on server crash/restart if no other state changes occurred recently.

---

### S-06: FirebaseBatchWriter Keeps Only Latest State — Last-Write-Wins Per Room

**Severity:** MEDIUM  
**Files:** `server/services/syncService.js:16-82`

`queueWrite(roomId, gameState)` overwrites the previous pending write for the same room. With a 500ms flush interval, rapid sequential updates by different players/GMs on the same room result in only the **last** state being persisted. Intermediate states are silently dropped.

The `DeltaSyncEngine` and `RealtimeSyncEngine` exist in the codebase but appear to be advanced/parallel services not integrated into the primary write path.

**Impact:** Two GMs editing the same map simultaneously could lose each other's changes. Rapid state changes (multiple token moves, fog edits, wall placements) within a 500ms window only the last is persisted.

---

### S-07: No Server-Side Handler for Inventory Updates

**Severity:** HIGH  
**Files:** `vtt-react/src/store/inventoryStore.js:104`, `server/handlers/socketHandlers.js`

The client emits `inventory_update` events via `syncInventoryToMultiplayer`, but the server has **no handler** for this event. Inventory state (items, currency) is never validated or synchronized server-side. Each client maintains its own inventory state independently.

**Impact:** Players' inventories are never validated against a server-side source of truth. Inventory states can diverge silently between players.

---

### S-08: Grid Item Loot Race Condition — Item Duplication

**Severity:** CRITICAL  
**Files:** `vtt-react/src/store/gridItemStore.js:354-793`, `server/handlers/socketHandlers.js:2368-2390`

The loot operation is:
1. Read grid items from store
2. Read original item from itemStore
3. Add to player inventory
4. Remove from grid
5. Emit to server

Steps 3 and 4 are **not atomic**. Two players reading the grid simultaneously both find the item, both add it to their inventory, and both remove it from the grid. The server's `item_looted` handler **only broadcasts** — it does not check if the item still exists on the grid or remove it from server-side state.

For currency items specifically, `removeItemFromGrid(gridItemId)` is called **twice** (lines 611 and 762) — the second call is a no-op but indicates logic errors in the loot flow.

**Impact:** Any loot drop can be duplicated by two players clicking it simultaneously. Gold piles, rare items, quest rewards on the ground — all can be duplicated.

---

### S-09: Shop Purchase — Currency Lost When Inventory Full

**Severity:** MEDIUM  
**Files:** `vtt-react/src/components/shop/ShopWindow.jsx:346-411`

Purchase flow:
1. Check affordability
2. Deduct currency (`updateCurrency`)
3. Add items to inventory (`addItemFromLibrary` — returns `null` if inventory full)
4. Update merchant inventory

Step 2 happens before step 3. If `addItemFromLibrary` returns `null` (inventory full), the currency is already deducted but the player receives no item. No rollback mechanism exists.

Additionally, shop inventory is local per-client. Two players can buy the same limited-stock item simultaneously because each checks quantity locally before either deducts.

**Impact:** Players can lose gold on failed purchases. Limited stock items can be duplicated across players.

---

### S-10: Currency Withdrawal Duplication Bug

**Severity:** HIGH  
**Files:** `vtt-react/src/components/windows/CurrencyWithdrawModal.jsx:64-88`

Withdrawal flow:
1. Create a currency item (`createCurrencyItem`)
2. Add item to inventory (`addItemFromLibrary`)
3. Deduct currency (`updateCurrency`)

Steps 2 and 3 are **not atomic**. If step 2 succeeds but step 3 fails, the player gets both the physical currency item AND keeps the original currency balance. Additionally, the deduction reads from the `currency` prop captured at render time — rapid withdrawals could all read the same pre-withdrawal value.

**Impact:** Players can duplicate currency by withdrawing rapidly or by exploiting the non-atomic create-then-deduct flow.

---

### S-11: FirebaseBatchWriter Flush Uses Promise.allSettled — Partial Failures Silent

**Severity:** LOW  
**Files:** `server/services/syncService.js:55-70`

The batch flush iterates all pending writes and calls `firebaseService.updateRoomGameState()` for each room, wrapped in `Promise.allSettled()`. If one room's write fails, others succeed but the failure is only logged — no retry, no notification to clients.

**Impact:** A transient Firebase error for one room's write is silently swallowed. The room's state is lost until the next write cycle. The clients are not notified that persistence failed.

---

### S-12: Fog of War and Map Data Size on Large Maps

**Severity:** POTENTIAL  
**Files:** `server/services/firebaseService.js:227-270`, `vtt-react/src/components/level-editor/StaticFogOverlay.jsx`

Firebase documents have a 1MB size limit. Fog of war data (`fogOfWarData`, `fogOfWarPaths`, `exploredAreas`) is stored as part of the map document. For very large maps with complex fog patterns, this could exceed the document size limit and cause write failures.

The split storage path (`saveRoomDataSplit`) activates when the total room state exceeds 900KB, splitting into per-map subcollections. However, a single very large map's fog data could still exceed limits.

**Impact:** Very large maps with extensive fog of war may fail to save. No explicit size checking occurs before writes.

---

## 3. VTT Friction

> Where the interface and the backend state don't align logically.

### V-01: Combat Turn Change — External Store Mutations Not Atomic

**Severity:** MEDIUM  
**Files:** `vtt-react/src/store/combatStore.js:293-566`

`nextTurn()` performs 8+ external store mutations as side effects during a Zustand `set()` callback:
1. Process over-time effects (modifies character/creature health stores)
2. Decrement round-based buffs/debuffs (modifies buffStore/debuffStore)
3. Process turn-based cooldowns
4. Roll new initiative and calculate AP
5. Sync AP to characterStore + partyStore (3 separate store mutations)
6. Apply health/mana regen
7. Process turn-start over-time effects

The combat store's **own** state is updated atomically in a single `set()`, but all external mutations are independent. If AP sync to characterStore succeeds but partyStore sync fails, the two stores show different AP values.

**Impact:** Turn transitions can leave the combat tracker, character sheet, and party HUD showing inconsistent AP values.

---

### V-02: Multiplayer Sync Amplifies Partial Failures

**Severity:** MEDIUM  
**Files:** `vtt-react/src/store/characterStore.js:1770` (updateResource), `vtt-react/src/store/gameStore.js:557-729`

Each individual resource update (HP, Mana, AP) triggers its own `syncResourcesWithMultiplayer` call, which emits a separate `character_resource_updated` socket event. This means:
- A rest (6 mutations) sends 6 separate sync events
- A spell cast (3-4 mutations) sends 3-4 separate sync events
- Other players see partial state updates in real-time

**Impact:** Other players observe inconsistent intermediate states during multi-step operations. A healing spell appears to restore HP, then Mana, then AP as separate events rather than a single atomic update.

---

### V-03: Spell Cooldowns Lost on Page Refresh

**Severity:** MEDIUM  
**Files:** `vtt-react/src/components/ui/ActionBar.jsx:1580-1654`

Spell cooldowns are tracked in the ActionBar component's local state (`actionSlots`), not in a persistent Zustand store or Firebase. Refreshing the page clears all active cooldowns.

`actionBarPersistenceService.js` and `useActionBarPersistence.js` exist but need verification that they persist cooldown state (not just slot layout).

**Impact:** Players can bypass spell cooldowns by refreshing the page. In combat, this allows casting powerful spells more frequently than intended.

---

### V-04: Character Resource Updates Have No Confirmation Dialogs for Destructive Actions

**Severity:** LOW  
**Files:** `vtt-react/src/components/hud/ResourceAdjustmentModal.jsx`

Resource adjustments (HP/Mana/AP) can be made by the GM without confirmation. There is no undo mechanism. A misclick on a character's HP can kill them with no confirmation prompt and no way to revert.

---

### V-05: Map Switch Does Not Warn About Unsaved State

**Severity:** LOW  
**Files:** `vtt-react/src/components/dialogs/MapSwitchConfirmDialog.jsx`

While a confirmation dialog exists for map switching, it doesn't check whether the current map has unsaved changes (pending fog of war edits, wall placements, token positions that haven't been flushed to Firebase via the 500ms batch writer).

**Impact:** Rapidly switching maps could lose the last 500ms of edits with no indication.

---

### V-06: Double Grid Item Removal for Currency Loot

**Severity:** LOW  
**Files:** `vtt-react/src/store/gridItemStore.js:611, 762`

Currency items call `removeItemFromGrid(gridItemId)` twice in the same loot function — once in the currency-specific path (line 611) and once in the general cleanup path (line 762). The second call is a no-op (item already removed from state), but it indicates that the loot flow's branching logic has cleanup errors.

---

## 4. Severity Summary

### CRITICAL (3)
| ID | Issue | Impact |
|---|---|---|
| S-01 | Room deletion doesn't cascade subcollections | Permanent orphan data, growing storage costs |
| S-02 | Character deletion soft-delete only, no cascade | Orphan state, tokens, sessions, party entries |
| S-08 | Grid item loot race condition | Item/currency duplication by two players |

### HIGH (7)
| ID | Issue | Impact |
|---|---|---|
| M-01 | Debuff double-negation | Debuffs become buffs through one code path |
| M-07 | All TTRPG rules client-side only | Zero protection against cheating |
| S-03 | Account deletion misses critical data | Orphan characters, rooms, community content |
| S-04 | Map deletion leaves dead portals | Broken portal links, stale player assignments |
| S-07 | No server inventory handler | Inventories never validated server-side |
| S-10 | Currency withdrawal duplication | Players can duplicate currency |
| M-03 | Rest doesn't reset cooldowns/class resources | Rest cycle broken |

### MEDIUM (10)
| ID | Issue | Impact |
|---|---|---|
| M-02 | Level-up not atomic | Lost HP/Mana bonuses on crash |
| M-04 | Consumable buffs applied twice | Double buff effects |
| M-05 | Spell resources deducted before effects | Mana lost on crash |
| M-06 | Rest not atomic | Partial rest state visible to others |
| S-05 | Token movements not directly persisted | Positions lost on server restart |
| S-06 | Batch writer last-write-wins per room | Simultaneous edits can lose data |
| S-09 | Shop purchase currency loss | Gold consumed, no item if inventory full |
| V-01 | Combat turn external mutations not atomic | Inconsistent AP across HUDs |
| V-02 | Multiplayer sync amplifies partial failures | Others see intermediate states |
| V-03 | Spell cooldowns lost on refresh | Cooldown bypass |

### LOW (4)
| ID | Issue | Impact |
|---|---|---|
| M-08 | Function() code injection in formulas | Community spells could execute JS |
| S-11 | Batch flush partial failures silent | Failed writes not retried |
| V-04 | No undo/confirmation for GM resource edits | Misclick kills characters |
| V-05 | Map switch doesn't check unsaved changes | Last 500ms of edits could be lost |
| V-06 | Double grid item removal for currency | Logic error, second call is no-op |

---

## Appendix A: Files Examined

### Frontend Stores
- `vtt-react/src/store/characterStore.js` — Character state, equipment, level-up, derived stats
- `vtt-react/src/store/combatStore.js` — Combat resolution, initiative, turn management
- `vtt-react/src/store/buffStore.js` — Buff application and stat recalculation
- `vtt-react/src/store/debuffStore.js` — Debuff application and stat recalculation
- `vtt-react/src/store/inventoryStore.js` — Inventory, currency, item management
- `vtt-react/src/store/containerStore.js` — Container operations
- `vtt-react/src/store/gridItemStore.js` — Grid items, loot, pickup
- `vtt-react/src/store/partyStore.js` — Party HUD sync
- `vtt-react/src/store/gameStore.js` — Rest mechanics, game state

### Frontend Services
- `vtt-react/src/services/effectProcessingService.js` — Spell effect processing, DOT/HOT
- `vtt-react/src/services/firebase/characterPersistenceService.js` — Character CRUD
- `vtt-react/src/services/firebase/characterStateService.js` — Runtime character state
- `vtt-react/src/services/firebase/characterSessionService.js` — Session management
- `vtt-react/src/services/firebase/characterBackupService.js` — Backup management
- `vtt-react/src/services/firebase/roomStateService.js` — Room state persistence
- `vtt-react/src/services/firebase/persistenceService.js` — User data management
- `vtt-react/src/services/firebase/presenceService.js` — Online presence
- `vtt-react/src/services/firebase/roomService.js` — Room CRUD
- `vtt-react/src/services/firebase/communitySpellService.js` — Community spells
- `vtt-react/src/services/firebase/communityItemService.js` — Community items
- `vtt-react/src/services/firebase/communityCreatureService.js` — Community creatures
- `vtt-react/src/services/firebase/communityMapService.js` — Community maps

### Frontend Utils
- `vtt-react/src/utils/characterUtils.js` — Derived stat calculations
- `vtt-react/src/utils/pointBuySystem.js` — Character creation stat allocation
- `vtt-react/src/utils/experienceUtils.js` — XP/level calculations
- `vtt-react/src/utils/spellEffects.js` — Spell damage/healing calculations
- `vtt-react/src/utils/consumableUtils.js` — Consumable item usage
- `vtt-react/src/utils/equipmentUtils.js` — Equipment calculations
- `vtt-react/src/utils/firebaseUtils.js` — Firestore sanitization

### Frontend Components
- `vtt-react/src/components/ui/ActionBar.jsx` — Spell casting flow
- `vtt-react/src/components/shop/ShopWindow.jsx` — Purchase/sell flow
- `vtt-react/src/components/windows/CurrencyWithdrawModal.jsx` — Currency withdrawal
- `vtt-react/src/components/rest/RestOverlay.jsx` — Rest UI
- `vtt-react/src/components/combat/CombatTimeline.jsx` — Combat tracker
- `vtt-react/src/components/modals/LevelUpChoiceModal.jsx` — Level-up UI
- `vtt-react/src/components/character-creation-wizard/CharacterCreationWizard.jsx` — Character creation
- `vtt-react/src/components/level-editor/TileOverlay.jsx` — Portal connections
- `vtt-react/src/components/hud/PartyHUD.jsx` — Party HUD
- `vtt-react/src/components/account/RoomManager.jsx` — Room deletion UI

### Frontend Config
- `vtt-react/src/config/firebase.js` — Firebase client initialization

### Server
- `server/handlers/socketHandlers.js` — All 64 socket event handlers
- `server/handlers/roomHandlers.js` — Room CRUD operations
- `server/services/syncService.js` — FirebaseBatchWriter, MovementDebouncer
- `server/services/firebaseService.js` — Firebase Admin operations
- `server/services/validationService.js` — Input validation schemas
- `server/services/optimizedFirebase.js` — Advanced Firebase service
- `server/services/deltaSync.js` — Delta sync engine
- `server/services/realtimeSync.js` — Realtime sync engine
- `server/scripts/deleteAllRooms.js` — Admin cleanup script

### Config
- `config/firestore.rules` — Firestore security rules (310 lines)
- `config/firebase.json` — Firebase project configuration
- `config/firestore.indexes.json` — Firestore composite indexes

---

## Appendix B: Unaudited Areas & Continuation Plan

### Phase 1: Ghost Mechanics Sweep
Check these stores for real Firebase persistence vs UI-only decoration:
- `vtt-react/src/store/craftingStore.js` — Does crafting produce saved items?
- `vtt-react/src/store/questStore.js` — Does quest completion deliver rewards to Firebase?
- `vtt-react/src/store/dialogueStore.js` — Is dialogue state persisted?
- `vtt-react/src/store/targetingStore.js` — Is targeting synced?
- `vtt-react/src/store/diceStore.js` — Are dice rolls logged?
- `vtt-react/src/store/spellbookStore.js` — Are known spells saved?
- `vtt-react/src/store/settingsStore.js` — Are settings persisted?
- `vtt-react/src/components/windows/TalentTreeWindow.jsx` — Do talent selections modify characterStore and save?
- `vtt-react/src/services/actionBarPersistenceService.js` — Is action bar saved to Firebase?
- `vtt-react/src/hooks/useActionBarPersistence.js` — Does it actually call the persistence service?
- `vtt-react/src/utils/raceDisciplineSpellUtils.js` — Do race/class spells get added to spellbook?

**Method:** For each, read the store's save/persist/sync functions. If they call a Firebase service in `vtt-react/src/services/firebase/`, mark **PERSISTED**. If they only use Zustand `set()` with no Firebase write, mark **GHOST**.

### Phase 2: Firebase Loading & Size Audit
- Read `server/services/firebaseService.js` `getRoomData()` and `saveRoomDataSplit()` — verify the 900KB split threshold
- Check if community services use pagination or load all: `communitySpellService.js`, `communityItemService.js`, `communityCreatureService.js`, `communityMapService.js`
- Check fog-of-war data structure in level editor — is it per-tile pixel data (huge) or path-based (compact)?
- Verify `config/firestore.indexes.json` for query coverage

### Phase 3: Simultaneous GM Edit Conflicts
- Read `server/services/syncService.js` `FirebaseBatchWriter` — confirm it keeps only LATEST state per room
- Read `server/services/deltaSync.js` — does it mitigate the last-write-wins issue?
- Read `server/services/realtimeSync.js` — does it have conflict resolution?
- What happens if two GMs edit the same map's fog of war simultaneously?

### Phase 4: Offline & Reconnection Audit
- Read `vtt-react/src/services/offlineService.js` — what does it queue?
- Read `vtt-react/src/services/optimisticUpdatesService.js` — are updates rolled back on failure?
- Read `vtt-react/src/hooks/useRealtimeSync.js` — does the conflict resolution actually work?
- Read `vtt-react/src/components/common/ConflictResolutionModal.jsx` — is it connected?
- What happens to the debounced auto-save queue when connection drops?

---

## Continuation Prompt

Copy the following into a new conversation to resume the audit:

```
Context: You are continuing a VTT/TTRPG Integrity Audit for the Mythrill VTT codebase at D:\VTT.
An existing AUDIT_REPORT.md file exists in the repo root with ~70% of the audit complete.
Read that file first to understand what has been found.

Your job is to complete the remaining 30% by executing Phases 1-4 described in Appendix B.

PHASE 1 (Ghost Mechanics Sweep):
Check these stores for real Firebase persistence vs UI-only decoration:
- vtt-react/src/store/craftingStore.js → does crafting produce saved items?
- vtt-react/src/store/questStore.js → does quest completion deliver rewards to Firebase?
- vtt-react/src/store/dialogueStore.js → is dialogue state persisted?
- vtt-react/src/store/targetingStore.js → is targeting synced?
- vtt-react/src/store/diceStore.js → are dice rolls logged?
- vtt-react/src/store/spellbookStore.js → are known spells saved?
- vtt-react/src/store/settingsStore.js → are settings persisted?
- vtt-react/src/components/windows/TalentTreeWindow.jsx → do talent selections modify characterStore and save?
- vtt-react/src/services/actionBarPersistenceService.js → is action bar saved to Firebase?
- vtt-react/src/hooks/useActionBarPersistence.js → does it actually call the persistence service?
- vtt-react/src/utils/raceDisciplineSpellUtils.js → do race/class spells get added to spellbook?

For each: Read the store's save/persist/sync functions. If they call a Firebase service in vtt-react/src/services/firebase/, mark PERSISTED. If they only use Zustand set() with no Firebase write, mark GHOST.

PHASE 2 (Firebase Loading & Size):
- Read server/services/firebaseService.js getRoomData() and saveRoomDataSplit() — verify the 900KB split threshold
- Check if community services use pagination or load all: communitySpellService.js, communityItemService.js, communityCreatureService.js, communityMapService.js
- Check fog-of-war data structure in level editor — is it per-tile pixel data (huge) or path-based (compact)?
- Verify config/firestore.indexes.json for query coverage

PHASE 3 (Simultaneous GM Edit Conflicts):
- Read server/services/syncService.js FirebaseBatchWriter — confirm it keeps only LATEST state per room
- Read server/services/deltaSync.js — does it mitigate the last-write-wins issue?
- Read server/services/realtimeSync.js — does it have conflict resolution?
- What happens if two GMs edit the same map's fog of war simultaneously?

PHASE 4 (Offline & Reconnection):
- Read vtt-react/src/services/offlineService.js — what does it queue?
- Read vtt-react/src/services/optimisticUpdatesService.js — are updates rolled back on failure?
- Read vtt-react/src/hooks/useRealtimeSync.js — does the conflict resolution actually work?
- Read vtt-react/src/components/common/ConflictResolutionModal.jsx — is it connected?
- What happens to the debounced auto-save queue when connection drops?

After completing all phases, UPDATE AUDIT_REPORT.md by adding findings to the appropriate categories (Mechanical Breaks, Sync & Database Failures, VTT Friction) and marking the unaudited sections as complete. Keep the same ID numbering scheme (M-XX, S-XX, V-XX) starting from the next available number.
```
