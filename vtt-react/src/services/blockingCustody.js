/** P12B owner-device custody (frozen contract revision 4 §3.6–3.7). Pure functions over a private
 * sheet snapshot { equipment, items, custody }; nothing here talks to the network.
 *
 * Room HP/wear is atomic; private persistence is a separate step. Safety comes from a revision
 * lineage (not a receipt-id set): custody records the room declaration revision each private die
 * last matched, so an already-applied change, a gap and a competing local edit are distinguishable.
 * Competing values are preserved as conflicts; nothing is silently chosen, minted or deleted.
 */
import { LADDER, ladderIndex, privateDie, itemKeyFor } from './equipmentBlocking';

export const CUSTODY_LIMITS = Object.freeze({ entries: 4, conflicts: 8 });
const REF_KEYS = ['kind', 'roomId', 'mapId', 'tokenId', 'instanceId', 'ownerUid', 'characterId'];
const clone = value => (value === undefined ? undefined : JSON.parse(JSON.stringify(value)));
export const sameRef = (a, b) => !!a && !!b && REF_KEYS.every(key => a[key] === b[key]);
export const emptyCustody = () => ({ version: 1, entries: [] });
export function normalizeCustody(value) {
  return value?.version === 1 && Array.isArray(value.entries) ? clone(value) : emptyCustody();
}
export const findEntry = (custody, ref) => normalizeCustody(custody).entries.find(entry => sameRef(entry.ref, ref)) || null;
export const unresolvedConflicts = (custody, ref) => findEntry(custody, ref)?.conflicts || [];

// ── Locating the private item without guessing ─────────────────────────────
function allItems(state) {
  const out = [];
  for (const [slot, item] of Object.entries(state.equipment || {})) {if (item && typeof item === 'object') {out.push({ where: 'equipment', slot, item });}}
  (state.items || []).forEach((item, index) => {if (item && typeof item === 'object') {out.push({ where: 'inventory', index, item });}});
  return out;
}
/** Returns one location, null (missing) or 'ambiguous'. */
export function locateItem(state, piece) {
  const all = allItems(state);
  let matches;
  if (piece.keySource === 'instance') {matches = all.filter(entry => entry.item.instanceId === piece.itemKey);}
  else if (piece.keySource === 'uuid') {matches = all.filter(entry => entry.item.id === piece.itemKey && !entry.item.instanceId);}
  else {
    const separator = piece.itemKey.indexOf(':');
    const slot = piece.itemKey.slice(0, separator), id = piece.itemKey.slice(separator + 1);
    const inSlot = state.equipment?.[slot];
    if (inSlot && inSlot.id === id && !inSlot.instanceId) {return { where: 'equipment', slot, item: inSlot };}
    matches = all.filter(entry => entry.item.id === id && !entry.item.instanceId);
  }
  if (matches.length === 1) {return matches[0];}
  return matches.length ? 'ambiguous' : null;
}
function writeDie(state, location, die) {
  const next = { ...state, equipment: { ...state.equipment }, items: [...(state.items || [])] };
  const update = item => ({ ...item, durability: die === 'broken' ? 'broken' : die, broken: die === 'broken' });
  if (location.where === 'equipment') {next.equipment[location.slot] = update(location.item);}
  else {next.items[location.index] = update(location.item);}
  return next;
}
function withEntry(state, ref, mutate) {
  const custody = normalizeCustody(state.custody);
  const index = custody.entries.findIndex(entry => sameRef(entry.ref, ref));
  const entry = clone(custody.entries[index]);
  const result = mutate(entry);
  custody.entries[index] = entry;
  return { custody, result };
}
function addConflict(entry, conflict) {
  if (entry.conflicts.length >= CUSTODY_LIMITS.conflicts) {return false;}
  entry.conflicts.push(conflict);
  return true;
}

// ── Declarations ───────────────────────────────────────────────────────────
/** The owner may not publish a new declaration over unresolved competing values. */
export function canDeclare(custody, ref) {
  return unresolvedConflicts(custody, ref).length === 0;
}
/** Records a successful owner sync: pieces carry the private keys captured with the declaration. */
export function recordDeclaration(state, ref, roomDeclaration, keyedPieces) {
  const custody = normalizeCustody(state.custody);
  const index = custody.entries.findIndex(entry => sameRef(entry.ref, ref));
  if (index !== -1 && custody.entries[index].revision >= roomDeclaration.revision) {return { state, outcome: 'noop' };}
  if (index !== -1 && custody.entries[index].conflicts.length) {return { state, outcome: 'conflicts-unresolved' };}
  if (index === -1 && custody.entries.length >= CUSTODY_LIMITS.entries) {return { state, outcome: 'capacity' };}
  const pieces = roomDeclaration.pieces.map(piece => {
    const keyed = keyedPieces.find(value => value.slot === piece.slot && value.itemId === piece.itemId);
    return { slot: piece.slot, itemId: piece.itemId, itemKey: keyed?.itemKey ?? `${piece.slot}:${piece.itemId}`, keySource: keyed?.keySource ?? 'slot-legacy', die: piece.currentDie, broken: !!piece.broken };
  });
  const entry = { ref: clone(ref), revision: roomDeclaration.revision, pieces, pendingUnequip: index === -1 ? [] : custody.entries[index].pendingUnequip, conflicts: [] };
  if (index === -1) {custody.entries.push(entry);} else {custody.entries[index] = entry;}
  return { state: { ...state, custody }, outcome: 'recorded' };
}

// ── Wear receipts ──────────────────────────────────────────────────────────
/** Applies one public wear line. Outcomes: applied | noop | gap | home-required | conflict | capacity. */
export function applyWearReceipt(state, { ref, commandId, wear }) {
  const entry = findEntry(state.custody, ref);
  if (!entry) {return { state, outcome: 'home-required' };}
  const before = wear.blockingRevision, after = before + 1;
  if (entry.revision >= after) {return { state, outcome: 'noop' };}
  if (entry.revision < before) {return { state, outcome: 'gap' };}
  const piece = entry.pieces.find(value => value.slot === wear.slot);
  let next = state, outcome = 'applied', recorded = true;
  const { custody } = withEntry(state, ref, current => {
    const target = current.pieces.find(value => value.slot === wear.slot);
    current.revision = after;
    if (!target) {
      recorded = addConflict(current, { slot: wear.slot, itemKey: null, roomDie: wear.afterDie, privateDie: null, commandId, reason: 'piece-unknown' });
      outcome = 'conflict'; return;
    }
    const whole = current.conflicts.find(conflict => conflict.slot === null);
    if (whole) {
      // Review R3: the custody pieces may name a different item than the room lineage; never write.
      const roomPiece = (whole.room || []).find(value => value.slot === wear.slot);
      if (roomPiece) {roomPiece.currentDie = wear.afterDie; roomPiece.broken = wear.broken;}
      whole.roomRevision = after;
      outcome = 'conflict'; return;
    }
    const conflicted = current.conflicts.find(conflict => conflict.slot === wear.slot);
    const location = locateItem(state, target);
    const actual = location && location !== 'ambiguous' ? privateDie(location.item) : null;
    if (!conflicted && location && location !== 'ambiguous' && actual === target.die && target.die === wear.beforeDie) {
      next = writeDie(state, location, wear.afterDie);
      target.die = wear.afterDie; target.broken = wear.broken;
      if (wear.broken && location.where === 'equipment') {
        current.pendingUnequip.push({ slot: location.slot, itemKey: target.itemKey, keySource: target.keySource, commandId });
      }
      return;
    }
    // Competing private value (repair, move, ambiguity or an earlier conflict): keep both, choose nothing.
    target.die = wear.afterDie; target.broken = wear.broken;
    outcome = 'conflict';
    if (conflicted) {conflicted.roomDie = wear.afterDie; conflicted.commandId = commandId; return;}
    recorded = addConflict(current, { slot: wear.slot, itemKey: target.itemKey, roomDie: wear.afterDie, privateDie: actual,
      commandId, reason: location === 'ambiguous' ? 'ambiguous' : location ? 'private-change' : 'missing' });
  });
  if (!recorded) {return { state, outcome: 'capacity' };}
  return { state: { ...next, custody }, outcome, piece };
}
function matchesKey(item, piece) {
  if (!item) {return false;}
  if (piece.keySource === 'instance') {return item.instanceId === piece.itemKey;}
  if (piece.keySource === 'uuid') {return item.id === piece.itemKey && !item.instanceId;}
  return item.id === piece.itemKey.slice(piece.itemKey.indexOf(':') + 1) && !item.instanceId;
}

// ── Home reconciliation (gap, eviction, another device, retired attachment) ─
/** Compares the room declaration (owner-scoped view or recovery) with custody. Fast-forwards only a
 * difference explained by wear alone, after preserving prior private values as a recovery candidate. */
export function reconcileHome(state, ref, roomDeclaration, { source = 'home-read' } = {}) {
  if (!roomDeclaration || roomDeclaration.version !== 1) {return { state, outcome: 'noop' };}
  const entry = findEntry(state.custody, ref);
  if (!entry) {return adoptDeclaration(state, ref, roomDeclaration, source);}
  if (entry.revision >= roomDeclaration.revision) {return { state, outcome: 'noop' };}
  const samePieces = entry.pieces.length === roomDeclaration.pieces.length &&
    entry.pieces.every((piece, index) => roomDeclaration.pieces[index]?.slot === piece.slot && roomDeclaration.pieces[index]?.itemId === piece.itemId);
  const wearOnly = samePieces && roomDeclaration.pieces.every((piece, index) => ladderIndex(piece.currentDie) <= ladderIndex(entry.pieces[index].die) &&
    (piece.currentDie === 'broken') === !!piece.broken);
  let next = state, outcome = 'fast-forward', recorded = true;
  const prior = [];
  const { custody } = withEntry(state, ref, current => {
    current.revision = roomDeclaration.revision;
    if (!wearOnly) {
      outcome = 'conflict';
      recorded = addConflict(current, { slot: null, itemKey: null, roomDie: null, privateDie: null, commandId: source, reason: 'declaration-changed-elsewhere',
        room: clone(roomDeclaration.pieces), roomRevision: roomDeclaration.revision, custody: clone(current.pieces) });
      return;
    }
    roomDeclaration.pieces.forEach((room, index) => {
      const piece = current.pieces[index];
      if (room.currentDie === piece.die) {return;}
      const location = locateItem(next, piece);
      const actual = location && location !== 'ambiguous' ? privateDie(location.item) : null;
      if (location && location !== 'ambiguous' && actual === piece.die && !current.conflicts.some(conflict => conflict.slot === piece.slot)) {
        prior.push({ slot: piece.slot, itemKey: piece.itemKey, die: actual });
        next = writeDie(next, location, room.currentDie);
        if (room.currentDie === 'broken' && location.where === 'equipment') {
          current.pendingUnequip.push({ slot: location.slot, itemKey: piece.itemKey, keySource: piece.keySource, commandId: source });
        }
      } else {
        outcome = 'conflict';
        recorded = recorded && addConflict(current, { slot: piece.slot, itemKey: piece.itemKey, roomDie: room.currentDie, privateDie: actual, commandId: source,
          reason: location === 'ambiguous' ? 'ambiguous' : location ? 'private-change' : 'missing' });
      }
      piece.die = room.currentDie; piece.broken = !!room.broken;
    });
  });
  if (!recorded) {return { state, outcome: 'capacity' };}
  return { state: { ...next, custody }, outcome, candidate: prior.length ? { reason: 'p12b-wear-without-receipt', source, prior } : null };
}
/** No lineage on this device: adopt pieces whose private die equals the room's; record the rest as conflicts. */
function adoptDeclaration(state, ref, roomDeclaration, source) {
  const custody = normalizeCustody(state.custody);
  if (custody.entries.length >= CUSTODY_LIMITS.entries) {return { state, outcome: 'capacity' };}
  const entry = { ref: clone(ref), revision: roomDeclaration.revision, pieces: [], pendingUnequip: [], conflicts: [] };
  let outcome = 'adopted';
  for (const room of roomDeclaration.pieces) {
    const item = state.equipment?.[room.slot];
    const keyed = item && item.id === room.itemId ? itemKeyFor(item, room.slot) : { itemKey: `${room.slot}:${room.itemId}`, keySource: 'slot-legacy' };
    const piece = { slot: room.slot, itemId: room.itemId, ...keyed, die: room.currentDie, broken: !!room.broken };
    entry.pieces.push(piece);
    const location = locateItem(state, piece);
    const actual = location && location !== 'ambiguous' ? privateDie(location.item) : null;
    if (actual !== room.currentDie) {
      outcome = 'conflict';
      if (!addConflict(entry, { slot: room.slot, itemKey: piece.itemKey, roomDie: room.currentDie, privateDie: actual, commandId: source,
        reason: location === 'ambiguous' ? 'ambiguous' : location ? 'unattributed-difference' : 'missing' })) {return { state, outcome: 'capacity' };}
    }
  }
  custody.entries.push(entry);
  return { state: { ...state, custody }, outcome };
}

// ── Explicit owner resolution ──────────────────────────────────────────────
/** The owner chooses: 'room' writes the committed room die to the item; 'private' keeps the sheet value
 * (to be published by the next declaration on their turn). Either way the choice is explicit. */
export function resolveConflict(state, ref, conflictIndex, choice) {
  const entry = findEntry(state.custody, ref);
  const conflict = entry?.conflicts?.[conflictIndex];
  if (!conflict) {return { state, outcome: 'noop' };}
  if (conflict.slot === null) {return realign(state, ref, conflictIndex, conflict);}
  let next = state;
  if (choice === 'room' && conflict.slot && conflict.roomDie) {
    const piece = entry.pieces.find(value => value.slot === conflict.slot);
    const location = piece ? locateItem(state, piece) : null;
    if (!location || location === 'ambiguous') {return { state, outcome: 'not-locatable' };}
    next = writeDie(state, location, conflict.roomDie);
  } else if (choice !== 'private') {return { state, outcome: 'noop' };}
  const { custody } = withEntry(next, ref, current => {current.conflicts.splice(conflictIndex, 1);});
  return { state: { ...next, custody }, outcome: choice === 'room' ? 'resolved-room' : 'resolved-private', resolved: conflict };
}

/** Whole-declaration conflict: custody adopts the room's piece list (the lineage receipts refer to),
 * keyed to the owner's current items; every die that differs becomes a per-slot both-values conflict. */
function realign(state, ref, conflictIndex, conflict) {
  const custody = normalizeCustody(state.custody);
  const index = custody.entries.findIndex(entry => sameRef(entry.ref, ref));
  const entry = custody.entries[index];
  const others = entry.conflicts.filter((_, i) => i !== conflictIndex);
  const adopted = adoptDeclaration({ ...state, custody: { version: 1, entries: [] } }, ref,
    { version: 1, revision: conflict.roomRevision || entry.revision, pieces: conflict.room || [] }, 'realigned');
  if (adopted.outcome === 'capacity') {return { state, outcome: 'capacity' };}
  const fresh = adopted.state.custody.entries[0];
  if (others.length + fresh.conflicts.length > CUSTODY_LIMITS.conflicts) {return { state, outcome: 'capacity' };}
  custody.entries[index] = { ...fresh, pendingUnequip: entry.pendingUnequip, conflicts: [...others, ...fresh.conflicts] };
  return { state: { ...state, custody }, outcome: 'realigned', resolved: conflict };
}
/** Bounded custody: clean entries of other attachments may be dropped (a later visit re-adopts and
 * compares dice); entries holding conflicts or pending unequips are never dropped. */
export function pruneForCapacity(state, activeRef) {
  const custody = normalizeCustody(state.custody);
  while (custody.entries.length >= CUSTODY_LIMITS.entries) {
    const index = custody.entries.findIndex(entry => !sameRef(entry.ref, activeRef) && !entry.conflicts.length && !entry.pendingUnequip.length);
    if (index === -1) {return { state, outcome: 'capacity' };}
    custody.entries.splice(index, 1);
  }
  return { state: custody.entries.length === normalizeCustody(state.custody).entries.length ? state : { ...state, custody }, outcome: 'ok' };
}
export function hasCapacityFor(custody, ref) {
  const normalized = normalizeCustody(custody);
  return normalized.entries.some(entry => sameRef(entry.ref, ref)) ||
    normalized.entries.filter(entry => entry.conflicts.length || entry.pendingUnequip.length).length < CUSTODY_LIMITS.entries;
}

// ── Broken pieces: add to the pack first, clear the slot only on success ──
/** addToPack(item) performs the add and returns true only on success (pure in tests, store-backed live). */
export function completeUnequip(state, addToPack, toPackItem = item => item) {
  const custody = normalizeCustody(state.custody);
  let next = { ...state, equipment: { ...state.equipment }, items: [...(state.items || [])] };
  const outcomes = [];
  for (const entry of custody.entries) {
    entry.pendingUnequip = entry.pendingUnequip.filter(pending => {
      const piece = { itemKey: pending.itemKey, keySource: pending.keySource };
      const inSlot = pending.slot ? next.equipment[pending.slot] : null;
      const slotHolds = !!inSlot && matchesKey(inSlot, piece) && privateDie(inSlot) === 'broken';
      if (!slotHolds) {outcomes.push({ itemKey: pending.itemKey, outcome: 'already-unequipped' }); return false;}
      // Review R7: only an exact instance/uuid key in the pack proves the same item was already added
      // (an interrupted add); a library-id match may be a different copy, so it is never deleted.
      if (pending.keySource !== 'slot-legacy' && next.items.some(item => matchesKey(item, piece))) {
        next.equipment[pending.slot] = null;
        outcomes.push({ itemKey: pending.itemKey, outcome: 'deduplicated' });
        return false;
      }
      const added = addToPack(toPackItem(inSlot));
      if (!added) {outcomes.push({ itemKey: pending.itemKey, outcome: 'pack-full' }); return true;}
      if (Array.isArray(added)) {next.items = added;}
      next.equipment[pending.slot] = null;
      outcomes.push({ itemKey: pending.itemKey, outcome: 'unequipped' });
      return false;
    });
  }
  return { state: { ...next, custody }, outcomes };
}
export const pendingUnequips = custody => normalizeCustody(custody).entries.flatMap(entry => entry.pendingUnequip.map(pending => ({ ...pending, ref: entry.ref })));
export { LADDER };
