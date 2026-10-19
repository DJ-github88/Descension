import { create } from 'zustand';
import { getStore } from '../store/storeRegistry';
import { canonical, sameExactRef } from './featherSlash';
import { supportStrike, buildApproval, classifyDefenses, planStrikeCommand, acceptedText, strikeReceipt, producerSlot } from './weaponStrike';
import { ownerSource } from './spellConsequenceService';
import { findActor, inSharedRoom, refreshActorSnapshot, prepareActorCommand, submitPreparedActorCommand, requestActorEvent } from './actorConsequenceService';
import { captureActorDelivery, currentActorDelivery } from './actorProjectionOrder';
import { strikeContext, loadStrikeCustody, retainStrikeCustody, unresolvedStrike } from './weaponStrikeCustody';
import { chatLineFor } from './acceptedResultFeed';
import { onRoomRejoined } from './roomRejoinBus';
import { draftContext, sameDraftContext, withDiscarded } from './targetPick';

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
// ── P12C-B1 roll drafts (MYTHRILL_PROJECT_12C_B1_CONTRACT.md §2) ─────────────────────────────────────
/** The exact action context of a recorded strike roll. */
export function strikeDraftContext({ characterId, sourceRef, actionId, support }) {
  if (!support?.supported || support.needsType || !sourceRef) return null;
  return { ...draftContext('strike', { characterId, sourceRef, actionId, slot: support.weapon.slot, itemId: support.weapon.itemId, weaponType: support.weapon.weaponType, die: support.weapon.die }),
    proficiencyDie: support.proficiency?.die ?? null };
}
export const loadStrikeDraft = () => loadStrikeCustody()?.draft || null;
export const loadDiscardedStrikeDrafts = () => loadStrikeCustody()?.discardedDrafts || [];
/** Retains the recorded rolls at roll time; refuses to replace a draft that belongs to another action. */
export function saveStrikeDraft({ context: ctx, label, roll, proficiencyRoll, targetKey }) {
  const context = strikeContext(), saved = loadStrikeCustody(context);
  if (!ctx) throw Error('Choose the action and weapon type before rolling.');
  // No second roll while an approval holds recorded rolls (withdraw returns those rolls instead).
  if (unresolvedStrike(saved?.owner)) throw Error('A strike approval with recorded rolls is pending. Check, withdraw or reconcile it first.');
  if (saved?.draft && !sameDraftContext(saved.draft.context, ctx)) throw Error('A recorded roll for another action is retained. Send it from that action or discard it first.');
  const draft = { context: ctx, label: String(label || '').slice(0, 80), roll: roll || null, proficiencyRoll: proficiencyRoll || null, targetKey: targetKey || '', at: saved?.draft?.at || Date.now() };
  retainStrikeCustody(context, { draft });
  useWeaponStrikeStore.setState(s => ({ draftVersion: (s.draftVersion || 0) + 1 }));
  return draft;
}
/** Explicit discard: the faces stay listed on this device (contract §2). */
export function discardStrikeDraft() {
  const context = strikeContext(), saved = loadStrikeCustody(context);
  if (!saved?.draft) return;
  retainStrikeCustody(context, { draft: null, discardedDrafts: withDiscarded(saved.discardedDrafts, saved.draft) });
  useWeaponStrikeStore.setState(s => ({ draftVersion: (s.draftVersion || 0) + 1 }));
}
/** The recorded rolls of an approval that was not accepted, as a draft for the same action context. */
function draftFromApproval(owner) {
  const a = owner?.approval;
  if (!a || !owner.actionId) return null;
  const ctx = { ...draftContext('strike', { characterId: a.source.characterId, sourceRef: a.source, actionId: owner.actionId, slot: a.weapon.slot, itemId: a.weapon.itemId, weaponType: a.weapon.weaponType, die: a.weapon.die }),
    proficiencyDie: a.proficiency.die };
  return { context: ctx, label: a.weapon.name, roll: a.roll, proficiencyRoll: a.proficiency.roll, targetKey: '', at: Date.now(), fromApproval: a.approvalId };
}
/** P12C-B1 §2: returned rolls always win; a draft made meanwhile (only possible from older custody) is listed as discarded. */
function returnRolls(context, owner) {
  const draft = draftFromApproval(owner);
  if (!draft) return;
  const saved = loadStrikeCustody(context);
  const displaced = saved?.draft && saved.draft.fromApproval !== draft.fromApproval ? saved.draft : null;
  retainStrikeCustody(context, { draft, ...(displaced ? { discardedDrafts: withDiscarded(saved.discardedDrafts, displaced) } : {}) });
  useWeaponStrikeStore.setState(s => ({ draftVersion: (s.draftVersion || 0) + 1 }));
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
  // P12C-B1: the draft becomes the approval atomically; the action id stays for a later withdraw.
  retainStrikeCustody(context, { owner: { phase: 'prepared', approval, sent: false, actionId: action.id }, draft: null });
  useWeaponStrikeStore.setState(s => ({ draftVersion: (s.draftVersion || 0) + 1 }));
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
  // A refused first submission was never accepted: its recorded rolls return for the same action.
  if (phase === 'refused') returnRolls(context, latest);
}
export const checkStrikeApproval = () => submitApproval(strikeContext());
export async function withdrawStrikeApproval() {
  const context = strikeContext(), delivery = captureActorDelivery(), latest = loadStrikeCustody(context)?.owner;
  if (!latest?.approval) return;
  const result = await requestActorEvent('actor_strike_withdraw', { roomId: context.roomId, approvalId: latest.approval.approvalId });
  if (!context.current() || !currentActorDelivery(delivery, context.roomId)) return;
  if (result.receipt) return consumeStrikeReceipt(result);
  const withdrawn = result.success && result.code === 'withdrawn';
  keepOwner(context, { ...latest, phase: withdrawn ? 'withdrawn' : 'unknown', result });
  // P12C-B1 §2: the owner's withdrawn rolls return as a draft for the same action (re-approve, never reroll).
  if (withdrawn) returnRolls(context, latest);
}
/** Only an unknown outcome can be reconciled; an approval awaiting the GM is checked or withdrawn instead. */
export const reconcilableStrike = value => unresolvedStrike(value) && value.phase !== 'awaiting';
export function reconcileStrike() {
  const context = strikeContext(), latest = loadStrikeCustody(context)?.owner;
  if (reconcilableStrike(latest)) keepOwner(context, { ...latest, phase: 'reconciled' });
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
  let line = text; try {line = chatLineFor(result, text);} catch (_) { line = null; } // P13A §4: never name actors this viewer cannot see
  if (line && chat && !chat.getState().notifications.combat.some(n => n.id === notificationId)) chat.getState().addNotification('combat', { id: notificationId, type: 'combat', timestamp: new Date(view.receipt.acceptedAt).toISOString(), content: line });
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
  // Authorized same-room rejoin (single room_joined listener → roomRejoinBus): re-read the server's pending list.
  const rejoined = event => { if (event?.socket === socket && live(event.roomId)) refreshStrikeApprovals(); };
  const offRejoin = onRoomRejoined(rejoined);
  socket.on('actor_strike_pending', pending); socket.on('actor_strike_closed', closed); socket.on('actor_consequence_accepted', accepted);
  return () => { socket.off('actor_strike_pending', pending); socket.off('actor_strike_closed', closed); socket.off('actor_consequence_accepted', accepted); offRejoin(); };
}
