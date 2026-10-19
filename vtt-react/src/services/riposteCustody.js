/** Capability-separated private sibling of P12A custody; no migration or offline replay queue. */
import { createScopedNativeFamily } from '../persistence/scopedNativeFamily';
import { strikeContext } from './weaponStrikeCustody';
import { CAPABILITY } from './riposteExecution';
const storage = createScopedNativeFamily({ familyId: 'room.strikeConsequenceLatest.riposte.v1' });
export const riposteContext = strikeContext;
export function loadRiposteCustody(context = riposteContext()) {
  if (!context.current()) return null;
  const record = storage.load([context.roomId]);
  return record?.version === 1 && record.capability === CAPABILITY && record.uid === context.uid && record.roomId === context.roomId ? record : null;
}
export function retainRiposteCustody(context, patch) {
  if (!context.current()) throw Error('Retired Riposte principal/room.');
  const record = { owner: {}, gm: {}, offers: {}, ...loadRiposteCustody(context), ...patch, version: 1, capability: CAPABILITY, uid: context.uid, roomId: context.roomId };
  if (Object.keys(record.owner).length > 64 || Object.keys(record.gm).length > 64 || Object.keys(record.offers).length > 64) throw Error('Riposte custody capacity — manual reconciliation required.');
  const saved = storage.save(record, [context.roomId]);
  if (saved.status !== 'OK') throw Error(`Riposte device custody unavailable (${saved.reason || saved.status}); nothing emitted.`);
  return record;
}
