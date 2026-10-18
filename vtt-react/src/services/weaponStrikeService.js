import { create } from 'zustand';
import { getStore } from '../store/storeRegistry';
import { canonical, sameExactRef } from './featherSlash';
import { supportStrike, buildApproval, classifyDefenses, planStrikeCommand, acceptedText, strikeReceipt, producerSlot } from './weaponStrike';
import { ownerSource } from './spellConsequenceService';
import { findActor, inSharedRoom, refreshActorSnapshot, prepareActorCommand, submitPreparedActorCommand, requestActorEvent } from './actorConsequenceService';
import { captureActorDelivery, currentActorDelivery } from './actorProjectionOrder';
import { strikeContext, loadStrikeCustody, retainStrikeCustody, unresolvedStrike } from './weaponStrikeCustody';

export const useWeaponStrikeStore = create(() => ({ owner: null, ownerStatus: null, gmPending: {}, gmStatus: {}, data: null, dataError: null }));
const game = () => getStore('gameStore')?.getState() || {};
const character = () => getStore('characterStore')?.getState() || {};
const tokens = () => [...(getStore('creatureStore')?.getState().creatureTokens || []), ...(getStore('characterTokenStore')?.getState().characterTokens || [])];
const setOwner = ownerStatus => useWeaponStrikeStore.setState({ ownerStatus });
const setGm = (id, status) => useWeaponStrikeStore.setState(s => ({ gmStatus: { ...s.gmStatus, [id]: status } }));
export const closeStrikePanel = () => useWeaponStrikeStore.setState({ owner: null });
export { ownerSource };
export function routeWeaponStrike(action, origin) {
  if (!inSharedRoom() || !producerSlot(action)) return false;
  const support = supportStrike(action, character());
  if (!support.supported) return false;
  useWeaponStrikeStore.setState({ owner: { action: { id: action.id }, origin } });
  restoreStrikeCustody();
  return true;
}
export function strikeDiagnostic(action) {
  if (!inSharedRoom() || !producerSlot(action)) return null;
  const support = supportStrike(action, character());
  return support.supported ? null : support.reason;
}
let loading;
export function loadStrikeData() {
  if (!loading) loading = Promise.all(['/data/creatures.json', '/data/abilities.json'].map(async url => {
    const response = await fetch(url); if (!response.ok) throw Error('Bundled defense reference unavailable.'); return response.json();
  })).then(([creatures, abilities]) => { useWeaponStrikeStore.setState({ data: { creatures, abilities }, dataError: null }); })
    .catch(error => { loading = null; useWeaponStrikeStore.setState({ dataError: error.message }); });
  return loading;
}
export function strikeDefenses(approval) {
  const data = useWeaponStrikeStore.getState().data;
  if (!data) throw Error('Load the bundled defense reference before adjudicating.');
  const target = findActor(approval.target);
  if (!target) throw Error('Exact target is no longer present.');
  const loaded = getStore('creatureStore')?.getState().creatures?.find(c => c.id === target.creatureId);
  return classifyDefenses({ approval, target, loaded, bundled: data.creatures.find(c => c.id === target.creatureId), abilities: data.abilities[target.creatureId] || [] });
}
const ownerMessage = value => {
  if (value?.phase === 'accepted') return acceptedText(value.result);
  if (['withdrawn', 'declined'].includes(value?.phase)) return `${value.phase === 'withdrawn' ? 'Withdrawn' : 'Declined'} before acceptance; approval spent nothing.`;
  if (value?.phase === 'awaiting') return 'Awaiting GM adjudication. Approval spends nothing.';
  if (value?.phase === 'refused') return `Registration refused (${value.result?.code}); this first submission was not accepted.`;
  if (value?.phase === 'reconciled') return 'Explicitly reconciled with the GM. Retained as history.';
  return `Outcome unresolved${value?.result?.code ? ` (${value.result.code})` : ''}. Check this same strike; no reroll or second payment. Reconcile with the GM if it cannot be recovered.`;
};
export function restoreStrikeCustody() {
  const saved = loadStrikeCustody();
  useWeaponStrikeStore.setState({ ownerStatus: saved?.owner ? { ...saved.owner, message: ownerMessage(saved.owner) } : null,
    gmStatus: Object.fromEntries(Object.entries(saved?.gm || {}).map(([id, value]) => [id, { ...value, phase: value.phase === 'submitting' ? 'unknown' : value.phase }])) });
  return saved;
}
function keepOwner(context, value) {
  retainStrikeCustody(context, { owner: value });
  return setOwner({ ...value, message: ownerMessage(value) });
}
export async function sendStrikeApproval({ action, ownerType, targetRef, roll, proficiencyRoll }) {
  const context = strikeContext(), delivery = captureActorDelivery();
  if (!context.current()) throw Error('Sign in and join the room.');
  if (unresolvedStrike(loadStrikeCustody(context)?.owner)) throw Error('Check, withdraw or reconcile the retained strike first.');
  const initial = ownerSource();
  if (initial.error) throw Error(initial.error);
  const snapshot = await refreshActorSnapshot();
  if (!context.current() || !currentActorDelivery(delivery, context.roomId)) return;
  if (!snapshot.success) throw Error(`Snapshot unavailable (${snapshot.code}). Nothing submitted.`);
  const source = ownerSource();
  if (source.error || !sameExactRef(source.ref, initial.ref)) throw Error('Owner attachment changed. Review this strike again.');
  const approval = buildApproval({ support: supportStrike(action, character(), ownerType), source: source.ref, target: targetRef,
    actionEpoch: snapshot.actionEpoch, baseCommitSequence: snapshot.commitSequence, approvalId: crypto.randomUUID(), roll, proficiencyRoll });
  if (!findActor(targetRef)) throw Error('Exact bound target is no longer present.');
  const sourceToken = findActor(source.ref), pools = sourceToken.character;
  if (pools.actionPoints.current + (pools.tempActionPoints || 0) < 2) throw Error('Insufficient AP; price is 2 AP, temporary first.');
  retainStrikeCustody(context, { owner: { phase: 'prepared', approval, sent: false } });
  return submitApproval(context);
}
async function submitApproval(context) {
  const latest = loadStrikeCustody(context)?.owner;
  if (!latest?.approval) return;
  const delivery = captureActorDelivery(), first = !latest.sent;
  keepOwner(context, { ...latest, phase: 'unknown', sent: true });
  const result = await requestActorEvent('actor_strike_approve', latest.approval);
  if (!context.current() || !currentActorDelivery(delivery, context.roomId)) return;
  // A delivered receipt may have settled custody while the ACK was lost.
  if (loadStrikeCustody(context)?.owner?.phase === 'accepted') return;
  if (result.receipt) return consumeStrikeReceipt(result);
  const phase = result.code === 'awaiting_gm' ? 'awaiting' : ['approval_withdrawn', 'approval_declined'].includes(result.code) ? result.code.slice(9)
    : first && ['invalid_strike_approval', 'forbidden', 'insufficient_resources', 'actor_not_found', 'actor_binding_conflict', 'binding_required', 'secondary_attachment'].includes(result.code) ? 'refused' : 'unknown';
  keepOwner(context, { ...latest, sent: true, phase, result });
}
export const checkStrikeApproval = () => submitApproval(strikeContext());
export async function withdrawStrikeApproval() {
  const context = strikeContext(), delivery = captureActorDelivery(), latest = loadStrikeCustody(context)?.owner;
  if (!latest?.approval) return;
  const result = await requestActorEvent('actor_strike_withdraw', { roomId: context.roomId, approvalId: latest.approval.approvalId });
  if (!context.current() || !currentActorDelivery(delivery, context.roomId)) return;
  if (result.receipt) return consumeStrikeReceipt(result);
  keepOwner(context, { ...latest, phase: result.success && result.code === 'withdrawn' ? 'withdrawn' : 'unknown', result });
}
export function reconcileStrike() {
  const context = strikeContext(), latest = loadStrikeCustody(context)?.owner;
  if (unresolvedStrike(latest)) keepOwner(context, { ...latest, phase: 'reconciled' });
}
export async function refreshStrikeApprovals() {
  const context = strikeContext(), delivery = captureActorDelivery();
  restoreStrikeCustody();
  const result = await requestActorEvent('actor_strike_list', { roomId: context.roomId });
  if (!context.current() || !currentActorDelivery(delivery, context.roomId) || !result.success) return;
  useWeaponStrikeStore.setState({ gmPending: Object.fromEntries((result.pending || []).filter(e => !e.own).map(e => [e.approval.approvalId, e])) });
}
function keepGm(context, id, value) {
  const previous = loadStrikeCustody(context)?.gm || {};
  // Terminal history is bounded separately: unresolved exact commands are never discarded.
  const unresolved = Object.entries(previous).filter(([key, v]) => key !== id && !['accepted', 'declined', 'reconciled', 'refused'].includes(v.phase));
  const terminal = Object.entries(previous).filter(([key, v]) => key !== id && ['accepted', 'declined', 'reconciled', 'refused'].includes(v.phase)).slice(-7);
  retainStrikeCustody(context, { gm: { ...Object.fromEntries([...terminal, ...unresolved]), [id]: value } });
  setGm(id, value);
}
export async function gmAcceptStrike(id, draft) {
  const context = strikeContext(), delivery = captureActorDelivery();
  if (!game().isGMMode || !context.current()) throw Error('Current GM required.');
  const kept = loadStrikeCustody(context)?.gm?.[id];
  if (kept?.command && ['submitting', 'unknown'].includes(kept.phase)) throw Error('Check the same prepared command first.');
  const entry = useWeaponStrikeStore.getState().gmPending[id];
  if (!entry) throw Error('Approval is no longer pending.');
  const defenseBefore = strikeDefenses(entry.approval);
  if (canonical(defenseBefore) !== canonical(draft.defense)) throw Error('Defenses changed. Review the summary.');
  const snapshot = await refreshActorSnapshot();
  if (!context.current() || !currentActorDelivery(delivery, context.roomId)) return;
  if (!game().isGMMode || !snapshot.success) throw Error(`Current GM snapshot required (${snapshot.code || 'authority changed'}).`);
  const defense = strikeDefenses(entry.approval);
  if (canonical(defense) !== canonical(draft.defense)) throw Error('Defenses changed. Review the summary again.');
  const plan = planStrikeCommand({ ...draft, approval: entry.approval, contentHash: entry.contentHash, tokens: tokens(), defense });
  const command = prepareActorCommand(plan.entries, plan.extra);
  keepGm(context, id, { phase: 'submitting', command, message: 'Submitting one AP/HP consequence…' });
  return settleGm(context, delivery, id, await submitPreparedActorCommand(command));
}
function settleGm(context, delivery, id, result) {
  if (!context.current() || !currentActorDelivery(delivery, context.roomId)) return;
  if (result.receipt) return consumeStrikeReceipt(result);
  const previous = loadStrikeCustody(context)?.gm?.[id];
  if (previous?.phase === 'accepted') return;
  const definitive = ['stale_actor_revision', 'insufficient_resources', 'approval_mismatch', 'invalid_strike_adjudication', 'adjustment_reason_required', 'defense_ruling_required', 'miss_requires_zero', 'not_applied_mismatch', 'forbidden', 'authorization_required', 'room_authority_lost', 'room_binding_changed', 'actor_not_found', 'actor_binding_conflict', 'secondary_attachment'].includes(result.code);
  keepGm(context, id, { ...previous, phase: definitive ? 'refused' : 'unknown', result,
    message: definitive ? `Command refused (${result.code}). Review the current summary and explicitly prepare again; original command retained for checking.` : `Command outcome unresolved (${result.code}). Check same command; reconcile with the GM before preparing another.` });
}
export async function gmCheckStrikeCommand(id) {
  const context = strikeContext(), delivery = captureActorDelivery(), saved = loadStrikeCustody(context)?.gm?.[id];
  if (!saved?.command) return;
  return settleGm(context, delivery, id, await submitPreparedActorCommand(saved.command));
}
export function reconcileGmStrike(id) {
  const context = strikeContext(), saved = loadStrikeCustody(context)?.gm?.[id];
  if (saved) keepGm(context, id, { ...saved, phase: 'reconciled', message: 'Explicitly reconciled; retained command will not be re-sent automatically.' });
}
export async function gmDeclineStrike(id) {
  const context = strikeContext(), delivery = captureActorDelivery();
  const result = await requestActorEvent('actor_strike_decline', { roomId: context.roomId, approvalId: id });
  if (!context.current() || !currentActorDelivery(delivery, context.roomId)) return;
  if (result.receipt) return consumeStrikeReceipt(result);
  if (result.success) useWeaponStrikeStore.setState(s => { const gmPending = { ...s.gmPending }; delete gmPending[id]; return { gmPending }; });
}
export function consumeStrikeReceipt(result) {
  const view = strikeReceipt(result), context = strikeContext();
  if (!view || !context.current() || view.receipt.roomId !== context.roomId) return null;
  const id = view.recorded.approvalId, text = acceptedText(result), saved = loadStrikeCustody(context);
  const receiptResult = Object.fromEntries(['success', 'receipt', 'status', 'durability'].filter(k => result[k] !== undefined).map(k => [k, result[k]]));
  if (saved?.owner?.approval?.approvalId === id && view.receipt.source.ownerUid === context.uid) keepOwner(context, { ...saved.owner, phase: 'accepted', result: receiptResult });
  if (saved?.gm?.[id]) keepGm(context, id, { ...saved.gm[id], phase: 'accepted', result: receiptResult, message: text });
  const chat = getStore('chatStore'), notificationId = `p12a:${view.receipt.roomId}:${view.receipt.commandId}`;
  if (chat && !chat.getState().notifications.combat.some(n => n.id === notificationId)) chat.getState().addNotification('combat', { id: notificationId, type: 'combat', timestamp: new Date(view.receipt.acceptedAt).toISOString(), content: text });
  useWeaponStrikeStore.setState(s => { const gmPending = { ...s.gmPending }; delete gmPending[id]; return { gmPending }; });
  return view;
}
export function registerWeaponStrikeHandlers({ socket }) {
  if (!socket) return () => {};
  const registered = captureActorDelivery(socket);
  // Registration precedes room_joined; keep the captured principal/generation, as P7 does.
  const live = roomId => currentActorDelivery({ ...registered, room: game().multiplayerRoom, roomId: game().multiplayerRoom?.id }, roomId);
  const pending = value => { if (live(value?.roomId) && game().isGMMode) useWeaponStrikeStore.setState(s => ({ gmPending: { ...s.gmPending, [value.approval.approvalId]: value } })); };
  const accepted = result => { if (live(result?.receipt?.roomId)) consumeStrikeReceipt(result); };
  const closed = value => {
    if (!live(value?.roomId)) return;
    useWeaponStrikeStore.setState(s => { const gmPending = { ...s.gmPending }; delete gmPending[value.approvalId]; return { gmPending }; });
    const ownerContext = strikeContext(), latest = loadStrikeCustody(ownerContext)?.owner;
    if (latest?.approval?.approvalId === value.approvalId && latest.phase !== 'accepted' && ['withdrawn', 'declined'].includes(value.code)) keepOwner(ownerContext, { ...latest, phase: value.code });
  };
  socket.on('actor_strike_pending', pending); socket.on('actor_strike_closed', closed); socket.on('actor_consequence_accepted', accepted);
  return () => { socket.off('actor_strike_pending', pending); socket.off('actor_strike_closed', closed); socket.off('actor_consequence_accepted', accepted); };
}
