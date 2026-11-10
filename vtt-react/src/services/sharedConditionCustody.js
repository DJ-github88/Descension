/** Exact P14-C1 command custody; same scoped-native boundary as P9/P12, not a replay queue. */
import { createScopedNativeFamily } from '../persistence/scopedNativeFamily';
import { spellContext } from './spellConsequenceCustody';
import { canonical, DEFENDING } from './sharedConditionProfile';
const storage = createScopedNativeFamily({ familyId: 'room.sharedConditionLatest.v1' });
export const conditionContext = spellContext;
export function loadConditionCustody(context = conditionContext()) {
  if (!context.current()) return null;
  const r = storage.load([context.roomId]);
  return r?.version === 1 && r.origin === DEFENDING.origin && r.uid === context.uid && r.roomId === context.roomId ? r : null;
}
export function retainConditionCommand(context, key, next) {
  if (!context.current()) throw Error('Retired condition principal/room.');
  const previous = loadConditionCustody(context), old = previous?.entries?.[key];
  let history = old?.history || [];
  if (old?.command && next.command.commandId !== old.command.commandId) {
    if (!['accepted', 'failed'].includes(old.phase)) throw Error('Unknown condition command cannot be replaced. Check the same ID.');
    history = [...history, { command: old.command, phase: old.phase, result: old.result || null }];
    if (history.length > 64) throw Error('Condition custody history full — manual reconciliation required; no bytes discarded.');
  } else if (old?.command && canonical(next.command) !== canonical(old.command)) throw Error('Condition command bytes cannot change under one ID.');
  if (next.history && canonical(next.history) !== canonical(old?.history)) throw Error('Condition history is immutable.');
  const entry = old?.phase === 'accepted' && old.command.commandId === next.command.commandId && next.phase !== 'accepted' ? old : { ...old, ...next, history };
  const record = { ...previous, version: 1, origin: DEFENDING.origin, uid: context.uid, roomId: context.roomId, entries: { ...previous?.entries, [key]: entry } };
  if (Object.keys(record.entries).length > 64) throw Error('Condition custody capacity — no new command emitted.');
  const saved = storage.save(record, [context.roomId]);
  if (saved.status !== 'OK') throw Error(`Condition device custody unavailable (${saved.reason || saved.status}); nothing emitted.`);
  return record;
}
/** Private GM pre-command evidence, in the existing device custody family. */
export function retainConditionResolution(context, approvalId, resolution) {
  if (!context.current()) throw Error('Retired condition principal/room.');
  const previous = loadConditionCustody(context);
  if (previous?.entries?.[`authored-spell:${approvalId}`] && previous.entries[`authored-spell:${approvalId}`].phase !== 'failed') throw Error('Original emitted command is immutable.');
  const resolutions = { ...previous?.resolutions, [approvalId]: resolution };
  if (Object.keys(resolutions).length > 64) throw Error('Condition resolution custody full; preserve existing evidence.');
  const record = { ...previous, version: 1, origin: DEFENDING.origin, uid: context.uid, roomId: context.roomId, entries: previous?.entries || {}, resolutions };
  const saved = storage.save(record, [context.roomId]);
  if (saved.status !== 'OK') throw Error(`Condition resolution device custody unavailable (${saved.reason || saved.status}); nothing emitted.`);
  return resolution;
}
/** Safe pruning of definitively confirmed periodic-tick history only; never mutates server state, receipts or pending commands. */
export function clearRetainedPeriodicEntries(context, keys) {
  if (!context.current()) throw Error('Retired condition principal/room.');
  const previous = loadConditionCustody(context);
  if (!previous?.entries) return previous;
  const keyList = Array.isArray(keys) ? keys : [keys];
  const nextEntries = { ...previous.entries };
  let changed = false;
  for (const key of keyList) {
    const entry = nextEntries[key];
    if (!entry) continue;
    if (entry.kind !== 'periodic-tick') {
      throw Error('Only periodic tick recovery history can be cleared.');
    }
    if (entry.command?.roomId !== context.roomId || (Array.isArray(entry.ref) && entry.ref[1] !== context.roomId)) {
      throw Error('Cannot clear periodic tick history from another room.');
    }
    if (entry.phase !== 'accepted' || ['tick_already_resolved', 'tick_not_found'].includes(entry.result?.code)) {
      throw Error('Unconfirmed or pending periodic tick cannot be cleared.');
    }
    delete nextEntries[key];
    changed = true;
  }
  if (!changed) return previous;
  const record = { ...previous, version: 1, origin: DEFENDING.origin, uid: context.uid, roomId: context.roomId, entries: nextEntries };
  const saved = storage.save(record, [context.roomId]);
  if (saved.status !== 'OK') throw Error(`Condition device custody unavailable (${saved.reason || saved.status}); history not cleared.`);
  return record;
}
export const clearRetainedPeriodicEntry = (context, key) => clearRetainedPeriodicEntries(context, [key]);

