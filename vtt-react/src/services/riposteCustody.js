/** Capability-separated private sibling of P12A custody; no migration or offline replay queue. */
import { createScopedNativeFamily } from '../persistence/scopedNativeFamily';
import { strikeContext } from './weaponStrikeCustody';
import { CAPABILITY } from './riposteExecution';
import { canonical } from './featherSlash';
const storage = createScopedNativeFamily({ familyId: 'room.strikeConsequenceLatest.riposte.v1' });
export const riposteContext = strikeContext;
export function loadRiposteCustody(context = riposteContext()) {
  if (!context.current()) return null;
  const record = storage.load([context.roomId]);
  return record?.version === 1 && record.capability === CAPABILITY && record.uid === context.uid && record.roomId === context.roomId ? record : null;
}
export function retainRiposteCustody(context, patch) {
  if (!context.current()) throw Error('Retired Riposte principal/room.');
  const previous = loadRiposteCustody(context) || {};
  const record = { owner: {}, gm: {}, offers: {}, parents: {}, ...previous, ...patch, version: 1, capability: CAPABILITY, uid: context.uid, roomId: context.roomId };
  for (const family of ['owner', 'gm', 'offers', 'parents']) {
    record[family] = { ...(previous[family] || {}), ...(patch[family] || {}) };
    if (Object.keys(record[family]).length > 64) throw Error('Riposte custody capacity — manual reconciliation required.');
    for (const [id, supplied] of Object.entries(patch[family] || {})) {
      const old = previous[family]?.[id]; if (!old) continue;
      const next = { ...old, ...supplied }; record[family][id] = next;
      if (Object.prototype.hasOwnProperty.call(supplied, 'history') && canonical(supplied.history) !== canonical(old.history)) throw Error('Archived Riposte history is immutable.');
      if (old.history) next.history = old.history;
      if (old.roll && canonical(old.roll) !== canonical(next.roll)) throw Error('Retained Riposte faces are immutable.');
      const field = family === 'owner' ? 'approval' : family === 'gm' ? 'command' : 'request';
      if (old[field] && !next[field]) throw Error('Retained Riposte request bytes cannot be removed.');
      if (!old[field]) continue;
      const idField = field === 'approval' ? 'approvalId' : field === 'command' ? 'commandId' : 'requestId';
      const same = old[field][idField] === next[field][idField];
      if (same && canonical(old[field]) !== canonical(next[field])) throw Error('Exact retained Riposte bytes cannot change under one ID.');
      if (!same) {
        const terminal = family === 'owner' ? ['withdrawn', 'declined', 'revalidated', 'refused'] : ['refused'];
        if (!terminal.includes(old.phase)) throw Error('Unknown/accepted Riposte custody cannot be replaced. Check the same request.');
        const history = [...(old.history || []), { phase: old.phase, [field]: old[field], result: old.result || null }];
        if (history.length > 16) throw Error('Riposte retained-history capacity — reconcile manually, no old bytes discarded.');
        next.history = history;
      }
      if (old.phase === 'accepted' && next.phase !== 'accepted') record[family][id] = old;
    }
  }
  const saved = storage.save(record, [context.roomId]);
  if (saved.status !== 'OK') throw Error(`Riposte device custody unavailable (${saved.reason || saved.status}); nothing emitted.`);
  return record;
}
