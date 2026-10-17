/** Private, user-scoped exact-byte custody; never an offline replay queue. */
import { createScopedNativeFamily } from '../persistence/scopedNativeFamily';
import { spellContext } from './spellConsequenceCustody';
import { CAPABILITY } from './weaponStrike';
const storage = createScopedNativeFamily({ familyId: 'room.strikeConsequenceLatest' });
export const strikeContext = spellContext;
export const unresolvedStrike = value => !!value?.approval && !['accepted', 'withdrawn', 'declined', 'reconciled', 'refused'].includes(value.phase);
export function loadStrikeCustody(context = strikeContext()) {
  if (!context.current()) return null;
  const saved = storage.load([context.roomId]);
  return saved?.version === 1 && saved.capability === CAPABILITY && saved.uid === context.uid && saved.roomId === context.roomId ? saved : null;
}
export function retainStrikeCustody(context, patch) {
  if (!context.current()) throw Error('Retired strike principal/room; custody not adopted.');
  const previous = loadStrikeCustody(context), owner = patch.owner;
  if (owner && unresolvedStrike(previous?.owner) && previous.owner.approval.approvalId !== owner.approval?.approvalId) throw Error('Check, withdraw or reconcile the retained strike first.');
  const record = { owner: null, gm: {}, ...previous, ...patch, version: 1, capability: CAPABILITY, uid: context.uid, roomId: context.roomId };
  if (Object.keys(record.gm).length > 32) throw Error('Prepared strike custody capacity reached.');
  const saved = storage.save(record, [context.roomId]);
  // Refuse before emission when reload custody cannot be guaranteed.
  if (saved.status !== 'OK') throw Error(`Strike device custody unavailable (${saved.reason || saved.status}); preserve the existing strike and retry.`);
  return record;
}
