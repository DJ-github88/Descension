/** P12B owner custody (frozen contract revision 4 §3.6–3.7): interrupted saves, duplicate and
 * out-of-order receipts, eviction, changed equipment, character/account scope, retired attachments
 * and full-pack breakage. Competing values are preserved, never silently chosen. */
import { emptyCustody, findEntry, canDeclare, recordDeclaration, applyWearReceipt, reconcileHome, resolveConflict, completeUnequip, locateItem, pruneForCapacity, hasCapacityFor, CUSTODY_LIMITS } from '../blockingCustody';
import { eligiblePieces } from '../equipmentBlocking';

const ref = (instanceId = 'inc-1', ownerUid = 'owner') => ({ kind: 'character', roomId: 'room', mapId: 'map', tokenId: 'pc', instanceId, ownerUid, characterId: 'ilsa' });
const hide = { id: 'weathered-hide', name: 'Weathered Hide', type: 'armor', subtype: 'LEATHER', durability: 'd8', maxDurability: 'd8' }; // wizard: library id, no instanceId
const buckler = { id: 'b6f1c0de-0000-4000-8000-000000000001', name: 'Oak Buckler', type: 'armor', subtype: 'SHIELD', durability: 'd8', maxDurability: 'd8' };
const greaves = { id: 'tattered-greaves', instanceId: 'item_1792170000000_a', name: 'Tattered Greaves', type: 'armor', subtype: 'CLOTH', durability: 'd4', maxDurability: 'd6' };
const sheet = (equipment = { chest: hide, offHand: buckler, legs: greaves }, items = []) => ({ equipment, items, custody: emptyCustody() });
const room = (revision, dice = {}) => ({ version: 1, revision, mode: 'block', pieces: [
  { slot: 'chest', itemId: hide.id, name: hide.name, kind: 'armor', currentDie: dice.chest || 'd8', broken: dice.chest === 'broken' },
  { slot: 'offHand', itemId: buckler.id, name: buckler.name, kind: 'shield', currentDie: dice.offHand || 'd8', broken: false },
  { slot: 'legs', itemId: greaves.id, name: greaves.name, kind: 'armor', currentDie: dice.legs || 'd4', broken: dice.legs === 'broken' }] });
const declared = (state = sheet(), r = ref()) => recordDeclaration(state, r, room(1), eligiblePieces(state.equipment)).state;
const wear = (blockingRevision, slot, beforeDie, afterDie, commandId = `cmd-${blockingRevision}`) =>
  ({ ref: ref(), commandId, wear: { slot, blockingRevision, beforeDie, afterDie, broken: afterDie === 'broken', name: 'x' } });

test('identity: wizard library ids use slot-legacy keys, inventory uuids and instanceIds are instance keys; nothing is minted', () => {
  const pieces = eligiblePieces({ chest: hide, offHand: buckler, legs: greaves, mainHand: { id: 'sword', type: 'weapon', durability: 'd8' } });
  expect(pieces.map(p => [p.slot, p.keySource, p.itemKey])).toEqual([
    ['chest', 'slot-legacy', 'chest:weathered-hide'], ['offHand', 'uuid', buckler.id], ['legs', 'instance', greaves.instanceId]]);
  expect(eligiblePieces({ chest: { ...hide, durability: 30 } })).toEqual([]); // legacy numeric die: not declarable, not converted
  expect(hide.instanceId).toBeUndefined();
});
test('apply once: armor d8 → d6 writes the item and custody together; a duplicate receipt is a no-op', () => {
  const state = declared();
  const first = applyWearReceipt(state, wear(1, 'chest', 'd8', 'd6'));
  expect(first.outcome).toBe('applied');
  expect(first.state.equipment.chest.durability).toBe('d6');
  expect(findEntry(first.state.custody, ref()).revision).toBe(2);
  const again = applyWearReceipt(first.state, wear(1, 'chest', 'd8', 'd6'));
  expect(again.outcome).toBe('noop');
  expect(again.state).toBe(first.state);
  expect(state.equipment.chest.durability).toBe('d8'); // input never mutated
});
test('interrupted save: a crash before retention re-applies identically; after retention it is a no-op; a torn write is a conflict, never a second step', () => {
  const persistedBefore = declared();
  const live = applyWearReceipt(persistedBefore, wear(1, 'chest', 'd8', 'd6')).state;
  // Crash before the P6 draft was retained: reload from the previous draft and replay the receipt.
  const replay = applyWearReceipt(JSON.parse(JSON.stringify(persistedBefore)), wear(1, 'chest', 'd8', 'd6')).state;
  expect(replay.equipment.chest.durability).toBe(live.equipment.chest.durability);
  expect(findEntry(replay.custody, ref()).revision).toBe(2);
  // Crash after retention: the draft already holds both.
  expect(applyWearReceipt(JSON.parse(JSON.stringify(live)), wear(1, 'chest', 'd8', 'd6')).outcome).toBe('noop');
  // A hypothetical torn record (die written, lineage not) cannot double-wear: both values are kept.
  const torn = { ...persistedBefore, equipment: { ...persistedBefore.equipment, chest: { ...hide, durability: 'd6' } } };
  const result = applyWearReceipt(torn, wear(1, 'chest', 'd8', 'd6'));
  expect(result.outcome).toBe('conflict');
  expect(result.state.equipment.chest.durability).toBe('d6');
  expect(findEntry(result.state.custody, ref()).conflicts[0]).toMatchObject({ slot: 'chest', roomDie: 'd6', privateDie: 'd6', reason: 'private-change' });
});
test('out of order: a later receipt waits as a gap and both apply in revision order', () => {
  const state = declared();
  expect(applyWearReceipt(state, wear(2, 'chest', 'd6', 'd4')).outcome).toBe('gap');
  const one = applyWearReceipt(state, wear(1, 'chest', 'd8', 'd6'));
  const two = applyWearReceipt(one.state, wear(2, 'chest', 'd6', 'd4'));
  expect([one.outcome, two.outcome]).toEqual(['applied', 'applied']);
  expect(two.state.equipment.chest.durability).toBe('d4');
  expect(applyWearReceipt(two.state, wear(1, 'chest', 'd8', 'd6')).outcome).toBe('noop');
});
test('eviction / reload: the room declaration fast-forwards wear-only differences after preserving prior values', () => {
  const state = declared();
  const result = reconcileHome(state, ref(), room(3, { chest: 'd4' }));
  expect(result.outcome).toBe('fast-forward');
  expect(result.state.equipment.chest.durability).toBe('d4');
  expect(result.candidate).toEqual({ reason: 'p12b-wear-without-receipt', source: 'home-read', prior: [{ slot: 'chest', itemKey: 'chest:weathered-hide', die: 'd8' }] });
  expect(applyWearReceipt(result.state, wear(1, 'chest', 'd8', 'd6')).outcome).toBe('noop');
  expect(reconcileHome(result.state, ref(), room(3, { chest: 'd4' })).outcome).toBe('noop');
});
test('a higher room die or changed pieces (another device) is never fast-forwarded', () => {
  const state = declared();
  const raised = reconcileHome(state, ref(), room(2, { chest: 'd10' }));
  expect(raised.outcome).toBe('conflict');
  expect(raised.state.equipment.chest.durability).toBe('d8');
  expect(findEntry(raised.state.custody, ref()).conflicts[0].reason).toBe('declaration-changed-elsewhere');
  expect(canDeclare(raised.state.custody, ref())).toBe(false);
  expect(recordDeclaration(raised.state, ref(), room(4), []).outcome).toBe('conflicts-unresolved');
});
test('changed equipment: moved uuid item is found in the pack; a moved library-id item with a duplicate is ambiguous; repairs conflict', () => {
  const state = declared();
  const moved = { ...state, equipment: { ...state.equipment, offHand: null }, items: [{ ...buckler }] };
  const applied = applyWearReceipt(moved, wear(1, 'offHand', 'd8', 'd6'));
  expect(applied.outcome).toBe('applied');
  expect(applied.state.items[0].durability).toBe('d6');
  const duplicate = { ...state, equipment: { ...state.equipment, chest: null }, items: [{ ...hide }, { ...hide, durability: 'd8' }] };
  expect(locateItem(duplicate, findEntry(state.custody, ref()).pieces.find(p => p.slot === 'chest'))).toBe('ambiguous');
  const ambiguous = applyWearReceipt(duplicate, wear(1, 'chest', 'd8', 'd6'));
  expect(ambiguous.outcome).toBe('conflict');
  expect(ambiguous.state.items.map(i => i.durability)).toEqual(['d8', 'd8']);
  // Only the equipped slot copy is the slot-legacy piece: a duplicate purchase in the pack is untouched.
  const withSpare = { ...state, items: [{ ...hide }] };
  const slotOnly = applyWearReceipt(withSpare, wear(1, 'chest', 'd8', 'd6'));
  expect([slotOnly.state.equipment.chest.durability, slotOnly.state.items[0].durability]).toEqual(['d6', 'd8']);
  const repaired = { ...state, equipment: { ...state.equipment, chest: { ...hide, durability: 'd10' } } };
  const conflict = applyWearReceipt(repaired, wear(1, 'chest', 'd8', 'd6'));
  expect(conflict.state.equipment.chest.durability).toBe('d10');
  const later = applyWearReceipt(conflict.state, wear(2, 'chest', 'd6', 'd4'));
  expect(findEntry(later.state.custody, ref()).conflicts).toHaveLength(1);
  expect(findEntry(later.state.custody, ref()).conflicts[0]).toMatchObject({ roomDie: 'd4', privateDie: 'd10' });
  const keep = resolveConflict(later.state, ref(), 0, 'private');
  expect([keep.outcome, keep.state.equipment.chest.durability, canDeclare(keep.state.custody, ref())]).toEqual(['resolved-private', 'd10', true]);
  const useRoom = resolveConflict(later.state, ref(), 0, 'room');
  expect(useRoom.state.equipment.chest.durability).toBe('d4');
});
test('character and account scope: receipts for another attachment, character or uid never touch this sheet', () => {
  const state = declared();
  for (const other of [ref('inc-2'), ref('inc-1', 'someone-else'), { ...ref(), characterId: 'other' }]) {
    const result = applyWearReceipt(state, { ...wear(1, 'chest', 'd8', 'd6'), ref: other });
    expect(result.outcome).toBe('home-required');
    expect(result.state).toBe(state);
  }
});
test('retired attachment: the old lineage reconciles from its recovered tail; unrelated declarations conflict', () => {
  const state = declared(sheet(), ref('old'));
  const tail = room(2, { chest: 'd6' });
  const result = reconcileHome(state, ref('old'), tail, { source: 'retired-attachment' });
  expect(result.outcome).toBe('fast-forward');
  expect(result.state.equipment.chest.durability).toBe('d6');
  expect(result.candidate.source).toBe('retired-attachment');
  const fresh = reconcileHome(state, ref('new'), room(1));
  expect(fresh.outcome).toBe('adopted');
  expect(findEntry(fresh.state.custody, ref('new')).pieces.map(p => p.keySource)).toEqual(['slot-legacy', 'uuid', 'instance']);
  const mismatch = reconcileHome(sheet(), ref('new'), room(5, { chest: 'd4' }));
  expect(mismatch.outcome).toBe('conflict');
  expect(mismatch.state.equipment.chest.durability).toBe('d8');
});
test('full-pack breakage: broken piece stays equipped and pending; space completes it; an interrupted add is deduplicated; never deleted or duplicated', () => {
  const state = declared();
  const broken = applyWearReceipt(state, wear(1, 'legs', 'd4', 'broken'));
  expect(broken.state.equipment.legs).toMatchObject({ durability: 'broken', broken: true });
  expect(findEntry(broken.state.custody, ref()).pendingUnequip).toEqual([{ slot: 'legs', itemKey: greaves.instanceId, keySource: 'instance', commandId: 'cmd-1' }]);
  const full = completeUnequip(broken.state, () => false);
  expect(full.outcomes).toEqual([{ itemKey: greaves.instanceId, outcome: 'pack-full' }]);
  expect(full.state.equipment.legs.broken).toBe(true);
  expect(full.state.items).toEqual([]);
  expect(findEntry(full.state.custody, ref()).pendingUnequip).toHaveLength(1);
  const added = [];
  const ok = completeUnequip(full.state, item => { added.push(item); return [item]; });
  expect(ok.state.equipment.legs).toBeNull();
  expect(ok.state.items).toHaveLength(1);
  expect(added).toHaveLength(1);
  expect(findEntry(ok.state.custody, ref()).pendingUnequip).toEqual([]);
  // Interrupted after the add: the exact instance is already in the pack, so the slot copy is the same item.
  const interrupted = { ...full.state, items: [{ ...full.state.equipment.legs }] };
  const healed = completeUnequip(interrupted, () => { throw Error('must not add again'); });
  expect(healed.outcomes[0].outcome).toBe('deduplicated');
  expect([healed.state.equipment.legs, healed.state.items.length]).toEqual([null, 1]);
});
test('slot-legacy breakage with a genuine duplicate purchase in the pack retries the add instead of guessing', () => {
  const aligned = recordDeclaration(sheet({ chest: { ...hide, durability: 'd4' }, offHand: buckler, legs: greaves }, [{ ...hide }]), ref(),
    { ...room(1), pieces: [{ slot: 'chest', itemId: hide.id, name: hide.name, kind: 'armor', currentDie: 'd4', broken: false }] }, eligiblePieces({ chest: { ...hide, durability: 'd4' } })).state;
  const worn = applyWearReceipt(aligned, wear(1, 'chest', 'd4', 'broken'));
  expect(worn.outcome).toBe('applied');
  expect(findEntry(worn.state.custody, ref()).pendingUnequip[0].keySource).toBe('slot-legacy');
  // Review R7: a pack copy with the same library id is never treated as "already added" (no deletion).
  const full = completeUnequip(worn.state, () => false);
  expect([full.state.equipment.chest?.broken, full.state.items.length, full.outcomes[0].outcome]).toEqual([true, 1, 'pack-full']);
  const retried = completeUnequip(full.state, item => [...full.state.items, item]);
  expect(retried.outcomes[0].outcome).toBe('unequipped');
  expect(retried.state.items).toHaveLength(2);
  expect(retried.state.equipment.chest).toBeNull();
});
test('bounds refuse instead of dropping: conflict and entry capacity', () => {
  let state = declared();
  const custody = JSON.parse(JSON.stringify(state.custody));
  custody.entries[0].conflicts = Array.from({ length: CUSTODY_LIMITS.conflicts }, (_, i) => ({ slot: `s${i}`, reason: 'x' }));
  state = { ...state, custody, equipment: { ...state.equipment, chest: { ...hide, durability: 'd10' } } };
  const result = applyWearReceipt(state, wear(1, 'chest', 'd8', 'd6'));
  expect(result.outcome).toBe('capacity');
  expect(result.state).toBe(state);
  let many = sheet();
  for (let i = 0; i < CUSTODY_LIMITS.entries; i++) many = recordDeclaration(many, ref(`inc-${i}`), room(1), []).state;
  expect(recordDeclaration(many, ref('inc-extra'), room(1), []).outcome).toBe('capacity');
});

test('review R3: a whole-declaration conflict blocks every write; re-aligning adopts the room lineage with per-slot choices', () => {
  const state = declared();
  // Another device swapped the chest piece: the room lineage now names a different item in that slot.
  const otherChest = { slot: 'chest', itemId: 'bronze-cuirass', name: 'Bronze Cuirass', kind: 'armor', currentDie: 'd8', broken: false };
  const changed = { version: 1, revision: 4, mode: 'block', pieces: [otherChest] };
  const conflicted = reconcileHome({ ...state, items: [{ ...hide }], equipment: { ...state.equipment, chest: { id: 'bronze-cuirass', name: 'Bronze Cuirass', type: 'armor', durability: 'd8' } } }, ref(), changed);
  expect(conflicted.outcome).toBe('conflict');
  // A wear line for "chest" must not wear the old custody item (A, now in the pack) — nothing is written.
  const held = applyWearReceipt(conflicted.state, wear(4, 'chest', 'd8', 'd6'));
  expect(held.outcome).toBe('conflict');
  expect(held.state.items[0].durability).toBe('d8');
  expect(held.state.equipment.chest.durability).toBe('d8');
  const realigned = resolveConflict(held.state, ref(), 0, 'room');
  expect(realigned.outcome).toBe('realigned');
  const entry = findEntry(realigned.state.custody, ref());
  expect(entry.pieces.map(p => [p.slot, p.itemId, p.die])).toEqual([['chest', 'bronze-cuirass', 'd6']]);
  expect(entry.conflicts).toEqual([expect.objectContaining({ slot: 'chest', roomDie: 'd6', privateDie: 'd8', reason: 'unattributed-difference' })]);
  expect(realigned.state.equipment.chest.durability).toBe('d8'); // still the owner's explicit choice next
});
test('review R4: clean entries of other attachments are pruned; dirty entries are never dropped and capacity is reported', () => {
  let many = sheet();
  for (let i = 0; i < CUSTODY_LIMITS.entries; i++) many = recordDeclaration(many, ref(`inc-${i}`), room(1), []).state;
  const pruned = pruneForCapacity(many, ref('inc-new'));
  expect(pruned.outcome).toBe('ok');
  expect(pruned.state.custody.entries).toHaveLength(CUSTODY_LIMITS.entries - 1);
  const dirty = JSON.parse(JSON.stringify(many.custody));
  dirty.entries.forEach(entry => { entry.conflicts = [{ slot: 'chest', reason: 'x' }]; });
  expect(pruneForCapacity({ ...many, custody: dirty }, ref('inc-new')).outcome).toBe('capacity');
  expect(hasCapacityFor(dirty, ref('inc-new'))).toBe(false);
  expect(hasCapacityFor(dirty, ref('inc-0'))).toBe(true);
});
