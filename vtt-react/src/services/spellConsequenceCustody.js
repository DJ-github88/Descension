/** Original P9: bounded latest owner approval/result per authenticated owner + room.
 * Same-approval checking only; never an offline replay queue or a new roll. */
import { createScopedNativeFamily } from '../persistence/scopedNativeFamily';
import { captureOwnerGuard, resolveActiveScope } from '../persistence/scopedConsumer';
import { getStore } from '../store/storeRegistry';
import { P9_CAPABILITY } from './spellConsequence';

const storage = createScopedNativeFamily({ familyId: 'room.spellConsequenceLatest' });
const memory = new Map();
const key = (uid, roomId) => JSON.stringify([uid, roomId]);
const UNRESOLVED = ['prepared', 'awaiting', 'unknown', 'reapproval', 'unresolved'];
export function spellContext() {
  const uid = getStore('authStore')?.getState().user?.uid;
  const game = getStore('gameStore')?.getState(), roomId = game?.multiplayerRoom?.id;
  const guard = captureOwnerGuard(uid), scope = resolveActiveScope();
  const characterId = getStore('characterStore')?.getState().currentCharacterId;
  const accountCurrent = () => !!uid && scope?.scopeKind === 'user' && guard.ok && guard.isCurrent() && getStore('authStore').getState().user?.uid === uid;
  const principalCurrent = () => accountCurrent() && getStore('gameStore').getState().isInMultiplayer && getStore('gameStore').getState().multiplayerRoom?.id === roomId;
  return { uid, roomId, guard, accountCurrent, principalCurrent, current: () => principalCurrent() && getStore('characterStore')?.getState().currentCharacterId === characterId };
}
export function loadLatestSpell(context = spellContext()) {
  if (!context.current()) return null;
  const retained = memory.get(key(context.uid, context.roomId));
  if (retained) return retained;
  const saved = storage.load([context.roomId]);
  if (!saved || saved.version !== 1 || saved.capability !== P9_CAPABILITY || saved.uid !== context.uid || saved.roomId !== context.roomId ||
    (saved.approval && (saved.approval.roomId !== context.roomId || (saved.route === 'creature' ? saved.approval.sourceAuthority?.gmUid !== context.uid : saved.approval.source?.ownerUid !== context.uid)))) return null;
  return { ...saved, custody: 'Device retained' };
}
export const unresolvedSpell = value => !!value?.approval && UNRESOLVED.includes(value.phase);
export function retainLatestSpell(context, value) {
  if (!context.current()) throw Error('Retired owner/room context; spell approval not adopted.');
  const id = key(context.uid, context.roomId);
  const previous = loadLatestSpell(context);
  if (unresolvedSpell(previous) && previous.approval.approvalId !== value.approval?.approvalId && !value.supersedes) {
    throw Error('An unresolved spell approval is retained. Check, withdraw or re-approve it before casting another supported spell.');
  }
  if (!memory.has(id) && memory.size >= 8) throw Error('Latest-spell memory capacity reached; preserve existing custody before continuing.');
  const { supersedes, ...rest } = value;
  // Condition-only approvals have no roll draft to carry their prior consent evidence.
  if (previous?.approval?.spell?.kind === 'condition' && previous.approval.approvalId !== rest.approval?.approvalId) {
    const history = previous.attemptHistory || [];
    if (history.length >= 64) throw Error('Condition consent history full; preserve/reconcile existing evidence first.');
    const { attemptHistory, custody, ...evidence } = previous; // eslint-disable-line no-unused-vars
    rest.attemptHistory = [...history, evidence];
  } else if (previous?.attemptHistory && !rest.attemptHistory) rest.attemptHistory = previous.attemptHistory;
  const record = { ...rest, version: 1, capability: P9_CAPABILITY, uid: context.uid, roomId: context.roomId,
    ...(rest.result ? { result: Object.fromEntries(['success', 'code', 'error', 'receipt', 'status', 'durability', 'approvalId', 'contentHash'].filter(field => rest.result[field] !== undefined).map(field => [field, rest.result[field]])) } : {}) };
  let saved;
  try { saved = storage.save(record, [context.roomId]); } catch (error) { saved = { status: 'SERIALIZATION_REFUSED', reason: error.message }; }
  const retained = { ...record, custody: saved.status === 'OK' ? 'Device retained' : `Memory only — reload custody unavailable (${saved.reason || saved.status})` };
  memory.set(id, retained);
  return retained;
}
