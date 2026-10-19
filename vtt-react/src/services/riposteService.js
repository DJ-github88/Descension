import { create } from 'zustand';
import { getStore } from '../store/storeRegistry';
import { canonical, sameExactRef } from './featherSlash';
import { captureActorDelivery, currentActorDelivery } from './actorProjectionOrder';
import { refreshActorSnapshot, findActor, requestActorEvent, prepareActorCommand, submitPreparedActorCommand } from './actorConsequenceService';
import { onRoomRejoined } from './roomRejoinBus';
import { riposteContext, loadRiposteCustody, retainRiposteCustody } from './riposteCustody';
import { CAPABILITY, weaponForRiposte, recordRiposteRoll, ripostePlan, riposteReceipt, riposteAcceptedText } from './riposteExecution';
import { ownerSource } from './spellConsequenceService';
import { reactionPrincipal } from './reactionWindowService';
import { isPrivateProjectionIsolated } from '../persistence/bootstrapPrivacyGate';

const initial = () => ({ principal: null, opportunities: [], pending: [], saved: null, status: '' });
export const useRiposteStore = create(initial);
let binding = 0, refreshOrder = 0, acceptedOrder = 0;
const game = () => getStore('gameStore')?.getState() || {};
const tokens = () => [...(getStore('creatureStore')?.getState().creatureTokens || []), ...(getStore('characterTokenStore')?.getState().characterTokens || [])];
const character = () => getStore('characterStore')?.getState() || {};
const unresolved = v => v?.command && !['accepted', 'refused', 'reconciled'].includes(v.phase);
const scope = () => ({ context: riposteContext(), delivery: captureActorDelivery(), principal: reactionPrincipal(), binding });
const live = s => s.binding === binding && s.principal === reactionPrincipal() && !isPrivateProjectionIsolated() && s.context.current() && currentActorDelivery(s.delivery, s.context.roomId);
export function restoreRiposte() { const saved = loadRiposteCustody(); useRiposteStore.setState({ saved }); return saved; }
function keep(context, family, id, value) {
  const previous = loadRiposteCustody(context) || {}, lane = { ...(previous[family] || {}), [id]: value };
  retainRiposteCustody(context, { [family]: lane }); restoreRiposte();
}
async function scoped(event, data) {
  const s = scope(), context = s.context;
  if (!context.current()) throw Error('Current room/account required.');
  const result = await requestActorEvent(event, data);
  if (!live(s)) return { success: false, code: 'retired_principal' };
  return result;
}
export async function refreshRiposte() {
  const s = scope(), context = s.context, gm = game().isGMMode, order = ++refreshOrder;
  if (!context.current()) return;
  restoreRiposte();
  const [state, approvals] = await Promise.all([requestActorEvent('actor_riposte_list', { roomId: context.roomId }),
    requestActorEvent('actor_strike_list', { roomId: context.roomId, capability: CAPABILITY })]);
  if (!live(s) || order < acceptedOrder) return;
  acceptedOrder = order;
  if (state.success && approvals.success && state.viewerRole === (gm ? 'gm' : 'owner')) useRiposteStore.setState({ opportunities: state.opportunities, pending: approvals.pending, status: '' });
  else useRiposteStore.setState({ opportunities: [], pending: [], status: 'Riposte unavailable — retain evidence and reconcile manually; no new opportunity is recreated.' });
}
export async function offerRiposte(fields) {
  const s = scope(), context = s.context, snapshot = await refreshActorSnapshot();
  if (!live(s)) return;
  if (!context.current() || !snapshot.success || !game().isGMMode) throw Error('Current GM snapshot required.');
  const id = fields.requestId || crypto.randomUUID(), saved = loadRiposteCustody(context)?.offers?.[id];
  const request = saved?.request || { ...fields, requestId: id, roomId: context.roomId, actionEpoch: snapshot.actionEpoch };
  keep(context, 'offers', id, { request, phase: 'unknown' });
  const result = await scoped('actor_riposte_offer', request);
  if (result.code === 'retired_principal') return result;
  if (result.receipt) {
    keep(context, 'offers', id, { request, phase: 'recorded', result: { success: true, receipt: result.receipt } });
    consumeRiposte(result); await refreshRiposte(); return result;
  }
  keep(context, 'offers', id, { request, phase: result.success ? 'recorded' : ['outcome_unknown', 'room_connection_unavailable'].includes(result.code) ? 'unknown' : 'refused', result });
  if (!result.success) throw Error(`Riposte offer: ${result.code}. Exact request retained; no automatic retry.`);
  await refreshRiposte(); return result;
}
export function retainRiposteRoll(p, { slot, ownerType, mode, faces }) {
  const context = riposteContext(), previous = loadRiposteCustody(context)?.owner?.[p.id];
  if (previous?.roll) throw Error('A Riposte roll is retained. Reuse it; no replacement roll.');
  const support = weaponForRiposte(character(), slot, ownerType);
  if (!support.supported || support.needsType) throw Error(support.reason || 'Choose the actual supported weapon type.');
  const roll = recordRiposteRoll(mode, support.weapon.die, faces);
  keep(context, 'owner', p.id, { phase: 'draft', weapon: support.weapon, roll });
}
export async function approveRiposte(p) {
  const s = scope(), context = s.context, previous = loadRiposteCustody(context)?.owner?.[p.id];
  if (!previous?.roll) throw Error('Retain a physical/digital weapon roll first.');
  if (previous.approval && !['withdrawn', 'declined', 'revalidated', 'refused'].includes(previous.phase)) throw Error('Check or withdraw the existing approval first.');
  const snapshot = await refreshActorSnapshot();
  if (!live(s)) return;
  const source = ownerSource();
  if (!snapshot.success || source.error || !sameExactRef(source.ref, p.source) || !findActor(p.target)) throw Error('Exact owner/attacker binding unavailable.');
  const current = weaponForRiposte(character(), previous.weapon.slot, previous.weapon.weaponType);
  if (!current.supported || canonical(current.weapon) !== canonical(previous.weapon)) throw Error('Weapon context changed; retained roll is preserved for manual handling.');
  const approval = { version: 1, capability: CAPABILITY, roomId: context.roomId, approvalId: crypto.randomUUID(),
    actionEpoch: snapshot.actionEpoch, baseCommitSequence: snapshot.commitSequence, source: p.source, target: p.target,
    opportunityId: p.id, proof: p.proof, weapon: previous.weapon, roll: previous.roll, price: { ap: 1 } };
  keep(context, 'owner', p.id, { ...previous, approval, phase: 'unknown' });
  return checkRiposteApproval(p.id);
}
export async function checkRiposteApproval(id) {
  const context = riposteContext(), saved = loadRiposteCustody(context)?.owner?.[id]; if (!saved?.approval) return;
  const result = await scoped('actor_strike_approve', saved.approval);
  if (result.code === 'retired_principal') return;
  if (result.receipt) return consumeRiposte(result);
  if (loadRiposteCustody(context)?.owner?.[id]?.phase === 'accepted') return;
  const phase = result.code === 'awaiting_gm' ? 'awaiting' : result.code?.startsWith('approval_') ? result.code.slice(9) :
    ['insufficient_resources', 'riposte_revalidation_required', 'riposte_closed_intent_required', 'riposte_approval_mismatch'].includes(result.code) ? 'refused' : 'unknown';
  keep(context, 'owner', id, { ...saved, phase, result }); await refreshRiposte();
}
export async function withdrawRiposte(id) {
  const context = riposteContext(), saved = loadRiposteCustody(context)?.owner?.[id]; if (!saved?.approval) return;
  const result = await scoped('actor_strike_withdraw', { roomId: context.roomId, approvalId: saved.approval.approvalId });
  if (result.code === 'retired_principal') return;
  if (result.receipt) return consumeRiposte(result);
  keep(context, 'owner', id, { ...saved, phase: result.success ? 'withdrawn' : 'unknown', result }); await refreshRiposte();
}
export async function executeRiposte(entry, { outcome, amount, confirmed }) {
  const s = scope(), context = s.context, id = entry.approval.opportunityId;
  if (!context.current() || !game().isGMMode) throw Error('Current GM required.');
  if (unresolved(loadRiposteCustody(context)?.gm?.[id])) throw Error('Check the same prepared Riposte command first.');
  const rulingState = () => canonical([entry.approval.source, entry.approval.target].map(ref => {
    const token = findActor(ref); return [token?.state?.actorContract?.revision, token?.position || null];
  }));
  const reviewed = rulingState(), snapshot = await refreshActorSnapshot();
  if (!live(s) || !snapshot.success || !game().isGMMode) return;
  if (reviewed !== rulingState()) throw Error('Actor state or position changed. Review the refreshed ruling before preparing execution.');
  const p = useRiposteStore.getState().opportunities.find(p => p.id === id);
  if (!p?.parentKeys) throw Error('Current GM parent proof unavailable; no command prepared.');
  const plan = ripostePlan({ ...entry, tokens: tokens(), outcome, amount, confirmed, parentKeys: p.parentKeys, offerHash: p.offerHash });
  const command = prepareActorCommand(plan.entries, plan.extra);
  keep(context, 'gm', id, { phase: 'unknown', command });
  return checkRiposteCommand(id);
}
export async function checkRiposteCommand(id) {
  const s = scope(), context = s.context, saved = loadRiposteCustody(context)?.gm?.[id]; if (!saved?.command) return;
  const result = await submitPreparedActorCommand(saved.command);
  if (!live(s)) return;
  if (result.receipt) return consumeRiposte(result);
  if (loadRiposteCustody(context)?.gm?.[id]?.phase === 'accepted') return;
  const definitive = ['stale_actor_revision', 'insufficient_resources', 'riposte_ruling_stale', 'riposte_revalidation_required', 'riposte_approval_mismatch', 'approval_mismatch', 'invalid_final_amount', 'approval_required'].includes(result.code);
  keep(context, 'gm', id, { ...saved, phase: definitive ? 'refused' : 'unknown', result }); await refreshRiposte();
}
export async function controlRiposte(p, cancel = false) {
  const result = await scoped(cancel ? 'actor_riposte_cancel' : 'actor_riposte_revalidate', { roomId: game().multiplayerRoom.id, opportunityId: p.id });
  if (result.code === 'retired_principal') return;
  if (result.receipt) return consumeRiposte(result);
  if (!result.success) throw Error(`Riposte: ${result.code}; retain exact command/evidence.`);
  await refreshRiposte(); return result;
}
export function consumeRiposte(result) {
  const context = riposteContext(), view = riposteReceipt(result);
  if (!context.current() || !view || view.receipt.roomId !== context.roomId) return;
  const id = view.chosen.opportunityId, saved = loadRiposteCustody(context) || {};
  const accepted = Object.fromEntries(['success', 'receipt', 'status', 'durability'].filter(k => result[k] !== undefined).map(k => [k, result[k]]));
  if (saved.owner?.[id] && view.receipt.source.ownerUid === context.uid) keep(context, 'owner', id, { ...saved.owner[id], phase: 'accepted', result: accepted });
  if (saved.gm?.[id]) keep(context, 'gm', id, { ...saved.gm[id], phase: 'accepted', result: accepted });
  useRiposteStore.setState({ status: riposteAcceptedText(result) });
  return view;
}
export function bindRiposte(socket) {
  const generation = ++binding, principal = reactionPrincipal();
  useRiposteStore.setState(initial());
  useRiposteStore.setState({ principal });
  const registered = captureActorDelivery(socket);
  const current = roomId => generation === binding && principal === reactionPrincipal() && currentActorDelivery({ ...registered, room: game().multiplayerRoom, roomId: game().multiplayerRoom?.id }, roomId);
  const changed = v => { if (current(v?.roomId)) refreshRiposte(); };
  const accepted = result => { if (current(result?.receipt?.roomId)) {consumeRiposte(result); refreshRiposte();} };
  const closed = value => {
    if (!current(value?.roomId)) return;
    const c = riposteContext(), saved = loadRiposteCustody(c);
    for (const [id, entry] of Object.entries(saved?.owner || {})) if (entry.approval?.approvalId === value.approvalId && entry.phase !== 'accepted') keep(c, 'owner', id, { ...entry, phase: value.code });
    refreshRiposte();
  };
  socket.on('actor_riposte_changed', changed); socket.on('actor_riposte_pending', changed); socket.on('actor_riposte_closed', closed); socket.on('actor_consequence_accepted', accepted);
  const off = onRoomRejoined(event => { if (event.socket === socket && current(event.roomId)) refreshRiposte(); });
  refreshRiposte();
  return () => { socket.off('actor_riposte_changed', changed); socket.off('actor_riposte_pending', changed); socket.off('actor_riposte_closed', closed); socket.off('actor_consequence_accepted', accepted); off(); if (generation === binding) {binding += 1; useRiposteStore.setState(initial());} };
}
