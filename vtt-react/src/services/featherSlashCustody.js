import { createScopedNativeFamily } from '../persistence/scopedNativeFamily';
import { captureOwnerGuard, resolveActiveScope } from '../persistence/scopedConsumer';
import { getStore } from '../store/storeRegistry';
import { featherReceipt, FEATHER_ID } from './featherSlash';

const storage = createScopedNativeFamily({ familyId: 'room.featherSlashLatest' });
// Bounded latest entries only; refused storage keeps exact memory bytes through
// a handoff. Capacity refuses replacement rather than discarding unknown work.
const memory = new Map();
const key = (uid, roomId) => JSON.stringify([uid, roomId]);
export function featherContext() {
  const uid = getStore('authStore')?.getState().user?.uid;
  const game = getStore('gameStore')?.getState(), roomId = game?.multiplayerRoom?.id;
  const guard = captureOwnerGuard(uid), scope = resolveActiveScope();
  return { uid, roomId, guard, current: () => !!uid && scope?.scopeKind === 'user' && guard.ok && guard.isCurrent() &&
    getStore('authStore').getState().user?.uid === uid && getStore('gameStore').getState().isInMultiplayer && getStore('gameStore').getState().multiplayerRoom?.id === roomId };
}
export function loadLatestFeather(context = featherContext()) {
  if (!context.current()) return null;
  const id = key(context.uid, context.roomId), retained = memory.get(id);
  if (retained) return retained;
  const saved = storage.load([context.roomId]);
  if (!saved || saved.version !== 1 || saved.uid !== context.uid || saved.roomId !== context.roomId ||
    (saved.command && (saved.command.roomId !== context.roomId || saved.command.adjudication?.definitionId !== FEATHER_ID))) return null;
  return { ...saved, custody: 'Device retained' };
}
export function retainLatestFeather(context, value) {
  if (!context.current()) throw Error('Retired owner/room context; action not adopted.');
  const id = key(context.uid, context.roomId);
  const previous = loadLatestFeather(context);
  if (previous?.command && ['unknown', 'prepared'].includes(previous.phase) && previous.command.commandId !== value.command?.commandId) throw Error('An unresolved latest Feather Slash command is retained. Check that same command before starting another action.');
  if (!memory.has(id) && memory.size >= 8) throw Error('Latest-action memory capacity reached; preserve existing custody before continuing.');
  const record = { ...value, version: 1, uid: context.uid, roomId: context.roomId,
    ...(value.result ? { result: Object.fromEntries(['success', 'code', 'error', 'receipt', 'status', 'durability', 'commandId'].filter(field => value.result[field] !== undefined).map(field => [field, value.result[field]])) } : {}) };
  let saved;
  try { saved = storage.save(record, [context.roomId]); } catch (error) { saved = { status: 'SERIALIZATION_REFUSED', reason: error.message }; }
  const retained = { ...record, custody: saved.status === 'OK' ? 'Device retained' : `Memory only — reload custody unavailable (${saved.reason || saved.status})` };
  memory.set(id, retained);
  return retained;
}
export function consumeFeatherReceipt(result) {
  const view = featherReceipt(result), context = featherContext();
  if (!view || !context.current() || view.receipt.roomId !== context.roomId) return null;
  const id = `p8:${view.receipt.roomId}:${view.receipt.submitterUid}:${view.receipt.commandId}`;
  const chat = getStore('chatStore');
  if (chat && !chat.getState().notifications.combat.some(note => note.id === id)) chat.getState().addNotification('combat', {
    id, type: 'combat', receiptId: id, timestamp: new Date(view.receipt.acceptedAt).toISOString(),
    content: `${view.recorded.sourceName} → ${view.recorded.targetName}: Feather Slash · ${view.recorded.mode} [${view.recorded.faces.join(', ')}] + 5 = ${view.recorded.total}; GM final ${view.receipt.adjudication.finalAmount} slicing${view.receipt.adjudication.adjustmentReason ? ` (${view.receipt.adjudication.adjustmentReason})` : ''}. Accepted receipt ${view.receipt.commandId}.`,
    // addNotification is local-only. Receipt delivery is the sole room relay.
  });
  const prior = loadLatestFeather(context);
  if (!prior?.command || prior.command.commandId === view.receipt.commandId || prior.result?.success || prior.phase === 'refused') {
    retainLatestFeather(context, { ...(prior?.command?.commandId === view.receipt.commandId ? prior : {}), phase: 'accepted', result });
  }
  return view;
}
