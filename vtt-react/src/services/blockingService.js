/** P12B thin slice — owner/GM client service (frozen contract revision 4 §3).
 * Owner: declaration on their own turn, block roll approval for one GM attack offer, and safe
 * private-sheet reconciliation. GM: attack offer and one approval-bound P7 command.
 * Declarations are read through owner/GM-scoped events only.
 */
import { create } from 'zustand';
import { getStore } from '../store/storeRegistry';
import { createScopedNativeFamily } from '../persistence/scopedNativeFamily';
import { spellContext } from './spellConsequenceCustody';
import { ownerSource } from './spellConsequenceService';
import { findActor, refreshActorSnapshot, prepareActorCommand, submitPreparedActorCommand, requestActorEvent } from './actorConsequenceService';
import { captureActorDelivery, currentActorDelivery } from './actorProjectionOrder';
import { createInventoryItem } from '../utils/equipmentUtils';
import { CAPABILITY, eligiblePieces, declarationEntry, firstAvailable, buildAttack, planBlockCommand, blockReceipt, acceptedBlockText, recordBlockFace } from './equipmentBlocking';
import { normalizeCustody, findEntry, sameRef, canDeclare, recordDeclaration, applyWearReceipt, reconcileHome, resolveConflict, completeUnequip, pendingUnequips, pruneForCapacity, hasCapacityFor } from './blockingCustody';

export const useBlockingStore = create(() => ({ ownView: null, offers: {}, ownerStatus: null, ownerOpen: false, gmOffers: {}, gmPending: {}, gmStatus: {}, gmViews: {}, notice: null }));
const storage = createScopedNativeFamily({ familyId: 'room.blockingLatest' });
const game = () => getStore('gameStore')?.getState() || {};
const characterStore = () => getStore('characterStore');
const inventoryStore = () => getStore('inventoryStore');
const set = patch => useBlockingStore.setState(patch);
const gapQueue = [];
let gapTimer = null;
const GAP_GRACE_MS = 2000;
export const blockingContext = spellContext;

// ── Device custody of exact prepared bytes (never an offline replay queue) ─
export function loadBlockingCustody(context = blockingContext()) {
  if (!context.current()) return null;
  const saved = storage.load([context.roomId]);
  return saved?.version === 1 && saved.capability === CAPABILITY && saved.uid === context.uid && saved.roomId === context.roomId ? saved : null;
}
function retain(context, patch) {
  if (!context.current()) throw Error('Retired principal or room; custody not adopted.');
  const previous = loadBlockingCustody(context);
  const record = { declaration: null, owner: null, gm: {}, ...previous, ...patch, version: 1, capability: CAPABILITY, uid: context.uid, roomId: context.roomId };
  const gm = Object.entries(record.gm);
  if (gm.length > 32) record.gm = Object.fromEntries([...gm.filter(([, v]) => !['accepted', 'declined', 'reconciled', 'closed'].includes(v.phase)),
    ...gm.filter(([, v]) => ['accepted', 'declined', 'reconciled', 'closed'].includes(v.phase)).slice(-8)].slice(-32));
  const saved = storage.save(record, [context.roomId]);
  if (saved.status !== 'OK') throw Error(`Device custody unavailable (${saved.reason || saved.status}); nothing was sent.`);
  return record;
}

// ── Private sheet: one synchronous update, one P6 draft ────────────────────
function privateSnapshot() {
  const sheet = characterStore().getState();
  return { equipment: sheet.equipment || {}, items: inventoryStore()?.getState().items || [], custody: normalizeCustody(sheet.roomEquipmentCustody) };
}
/** Installs equipment, inventory and custody together, then saves once (P6 retention outcome stays visible). */
function installPrivate(before, next, candidate) {
  const store = characterStore(), sheet = store.getState();
  const patch = {};
  if (candidate) {
    const prior = sheet.roomActorRecoveryCandidates || [];
    if (prior.length >= 8) return 'candidate-capacity';
    patch.roomActorRecoveryCandidates = [...prior, { ownerUid: candidate.ref.ownerUid, characterId: candidate.ref.characterId, ref: candidate.ref, reason: candidate.reason,
      data: { source: candidate.source, prior: candidate.prior } }];
  }
  if (next.equipment !== before.equipment) patch.equipment = next.equipment;
  patch.roomEquipmentCustody = next.custody;
  if (next.items !== before.items) inventoryStore()?.setState({ items: next.items });
  store.setState(patch);
  try { require('../store/characterHelpers').triggerCharacterAutoSave(() => store.getState().saveCurrentCharacter()); } catch (_) { /* P6 status remains visible */ }
  return 'installed';
}
function runPrivate(mutate, ref) {
  const before = privateSnapshot(), result = mutate(before);
  if (result.state === before) return result;
  const installed = installPrivate(before, result.state, result.candidate ? { ...result.candidate, ref } : null);
  if (installed === 'candidate-capacity') { set({ notice: { ...useBlockingStore.getState().notice, capacity: true } }); return { ...result, outcome: 'candidate-capacity', state: before }; }
  settleUnequip();
  noticeFromCustody();
  return result;
}
/** Review R4: capacity is never a silent drop — clean entries of other attachments may be pruned first. */
function ensureCapacity(ref) {
  const before = privateSnapshot();
  const pruned = pruneForCapacity(before, ref);
  if (pruned.outcome === 'capacity') { set({ notice: { ...useBlockingStore.getState().notice, capacity: true } }); return false; }
  if (pruned.state !== before) installPrivate(before, pruned.state, null);
  return true;
}
function runGuarded(mutate, ref) {
  const result = runPrivate(mutate, ref);
  if (result.outcome === 'capacity') set({ notice: { ...useBlockingStore.getState().notice, capacity: true } });
  return result;
}
/** Laws: a broken piece is unequipped to the pack — only after the pack accepted it. */
export function settleUnequip() {
  const before = privateSnapshot();
  if (!pendingUnequips(before.custody).length) return [];
  const addToPack = item => {
    const result = inventoryStore()?.getState().addItem?.(item);
    return result?.success === true ? (inventoryStore().getState().items || []) : false;
  };
  const result = completeUnequip(before, addToPack, createInventoryItem);
  installPrivate(before, result.state, null);
  return result.outcomes;
}
function noticeFromCustody() {
  const source = ownerSource(), custody = privateSnapshot().custody;
  const entry = source.ref ? findEntry(custody, source.ref) : null;
  const conflicts = entry?.conflicts?.length || 0, pending = pendingUnequips(custody).length;
  const capacity = !!useBlockingStore.getState().notice?.capacity && !(source.ref && hasCapacityFor(custody, source.ref) && findEntry(custody, source.ref));
  set({ notice: conflicts || pending || capacity ? { conflicts, pending, capacity } : null });
}

// ── Owner: scoped view, declaration, reconciliation ────────────────────────
async function readOwnView(ref) {
  const result = await requestActorEvent('actor_blocking_view', { roomId: ref.roomId, ref });
  if (result?.success) set({ ownView: { ref: result.ref, declaration: result.declaration, contractRevision: result.contractRevision } });
  return result;
}
export async function refreshOwnBlocking() {
  const context = blockingContext(), source = ownerSource();
  if (!context.current() || source.error) { set({ ownView: null }); return null; }
  const delivery = captureActorDelivery();
  const view = await readOwnView(source.ref);
  if (!context.current() || !currentActorDelivery(delivery, context.roomId) || !view?.success) return view;
  await reconcileRetired(context, source.ref);
  drainGaps();
  // Review R2: missing receipts never stall custody — the scoped view fast-forwards wear-only
  // differences (prior values preserved); held gap receipts then resolve as no-ops.
  if (!findEntry(characterStore().getState().roomEquipmentCustody, source.ref) && !ensureCapacity(source.ref)) return view;
  runGuarded(state => reconcileHome(state, source.ref, view.declaration), source.ref);
  drainGaps();
  gapQueue.splice(0, gapQueue.length, ...gapQueue.filter(item => sameRef(item.ref, source.ref)));
  noticeFromCustody();
  return view;
}
function scheduleGapResolution(immediate = false) {
  if (gapTimer) clearTimeout(gapTimer);
  gapTimer = setTimeout(() => { gapTimer = null; if (gapQueue.length) refreshOwnBlocking(); }, immediate ? 0 : GAP_GRACE_MS);
}
async function reconcileRetired(context, activeRef) {
  for (const entry of normalizeCustody(characterStore().getState().roomEquipmentCustody).entries) {
    if (sameRef(entry.ref, activeRef) || entry.ref.roomId !== context.roomId) continue;
    const result = await requestActorEvent('actor_recovery', { roomId: context.roomId, locator: { kind: 'character', mapId: entry.ref.mapId, tokenId: entry.ref.tokenId } });
    if (!context.current() || !result?.success) continue;
    const raw = result.recovery?.rawToken, contract = raw?.state?.actorContract;
    const tail = contract?.instanceId !== entry.ref.instanceId && raw?.state?.actorRecovery?.priorBlocking?.version === 1 ? raw.state.actorRecovery.priorBlocking
      : contract && contract.primary === false ? raw.state.equipmentBlocking : null;
    if (!tail) continue; // nothing to reconcile from: keep the lineage (pruned only when clean, under capacity)
    runGuarded(state => reconcileHome(state, entry.ref, tail, { source: 'retired-attachment' }), entry.ref);
    const latest = findEntry(characterStore().getState().roomEquipmentCustody, entry.ref);
    if (latest && latest.revision >= tail.revision && !latest.conflicts.length && !latest.pendingUnequip.length) {
      const custody = normalizeCustody(characterStore().getState().roomEquipmentCustody);
      custody.entries = custody.entries.filter(value => !sameRef(value.ref, entry.ref));
      runPrivate(state => ({ state: { ...state, custody }, outcome: 'retired' }), entry.ref);
    }
  }
}
export function ownEligiblePieces() { return eligiblePieces(characterStore().getState().equipment); }
export async function submitDeclaration({ mode, slots = [] }) {
  const context = blockingContext(), delivery = captureActorDelivery();
  if (!context.current()) throw Error('Sign in and join the room.');
  const source = ownerSource();
  if (source.error) throw Error(source.error);
  if (!canDeclare(characterStore().getState().roomEquipmentCustody, source.ref)) throw Error('Resolve the equipment conflicts below before declaring again.');
  if (!ensureCapacity(source.ref)) throw Error('Equipment custody is full of unresolved items from other rooms or attachments. Resolve them before declaring here.');
  const eligible = ownEligiblePieces();
  const pieces = slots.map(slot => eligible.find(piece => piece.slot === slot)).filter(Boolean);
  if (pieces.length !== slots.length) throw Error('A chosen piece is no longer equipped with a ladder die.');
  const view = await readOwnView(source.ref);
  if (!view?.success) throw Error(`Declaration unavailable (${view?.code}).`);
  const snapshot = await refreshActorSnapshot();
  if (!context.current() || !currentActorDelivery(delivery, context.roomId)) return null;
  if (!snapshot.success) throw Error(`Snapshot unavailable (${snapshot.code}). Nothing submitted.`);
  const token = findActor(source.ref);
  if (!token) throw Error('Your primary room attachment is missing.');
  const entry = declarationEntry(view.declaration?.revision || 0, mode, pieces);
  const command = prepareActorCommand([{ ref: source.ref, expectedRevision: token.state.actorContract.revision, blockingDeclaration: entry }]);
  retain(context, { declaration: { phase: 'submitting', command, ref: source.ref, keyedPieces: pieces } });
  return settleDeclaration(context, await submitPreparedActorCommand(command));
}
async function settleDeclaration(context, result) {
  const saved = loadBlockingCustody(context)?.declaration;
  if (!saved) return result;
  if (result?.receipt) {
    const view = await readOwnView(saved.ref);
    const recorded = view?.success && view.declaration ? runGuarded(state => recordDeclaration(state, saved.ref, view.declaration, saved.keyedPieces), saved.ref) : { outcome: 'view-unavailable' };
    retain(context, { declaration: { ...saved, phase: 'accepted' } });
    const declared = view?.declaration?.mode === 'none' ? 'Declared: Don’t block.' : `Declared: ${view?.declaration?.pieces.map(p => `${p.name} ${p.currentDie}`).join(' → ')}`;
    set({ ownerStatus: { phase: 'declared', message: ['recorded', 'noop'].includes(recorded.outcome) ? declared
      : `${declared} Warning: your sheet could not record it (${recorded.outcome}); wear will be reconciled from the room view.` } });
    return result;
  }
  const definitive = !['outcome_unknown', 'room_connection_unavailable'].includes(result?.code);
  retain(context, { declaration: { ...saved, phase: definitive ? 'refused' : 'unknown', code: result?.code } });
  const reasons = { not_your_turn: 'You can change your blocking piece only on your own turn.', equipment_projection_mismatch: 'Your shared equipment is not current in the room yet. Wait a moment and try again.',
    blocking_pending: 'A block roll is pending. Wait for the GM or withdraw it first.', stale_blocking_state: 'The declaration changed (for example by wear). Review it and declare again.',
    combat_binding_required: 'Your combatant entry is not bound yet; ask the GM to rebind combat.' };
  set({ ownerStatus: { phase: definitive ? 'refused' : 'unknown', message: reasons[result?.code] || `Declaration ${definitive ? 'refused' : 'outcome unresolved'} (${result?.code}).${definitive ? '' : ' Check the same declaration.'}` } });
  return result;
}
export async function checkDeclaration() {
  const context = blockingContext(), saved = loadBlockingCustody(context)?.declaration;
  if (!saved?.command || saved.phase === 'accepted') return null;
  return settleDeclaration(context, await submitPreparedActorCommand(saved.command));
}
export function resolveOwnConflict(index, choice) {
  const source = ownerSource();
  if (source.error) throw Error(source.error);
  const result = runPrivate(state => resolveConflict(state, source.ref, index, choice), source.ref);
  if (result.outcome === 'not-locatable') throw Error('That item cannot be located uniquely on your sheet; keep your sheet value or move the item back first.');
  return result;
}

// ── Owner: block roll for one offered attack ───────────────────────────────
export async function approveBlock(commandId, { mode, face }) {
  const context = blockingContext(), delivery = captureActorDelivery();
  if (!context.current()) throw Error('Sign in and join the room.');
  const offer = useBlockingStore.getState().offers[commandId];
  if (!offer) throw Error('This attack is no longer offered.');
  const source = ownerSource();
  if (source.error) throw Error(source.error);
  const view = await readOwnView(source.ref);
  const snapshot = await refreshActorSnapshot();
  if (!context.current() || !currentActorDelivery(delivery, context.roomId)) return null;
  if (!snapshot.success || !view?.success) throw Error('Room state unavailable. Nothing submitted.');
  const piece = firstAvailable(view.declaration, findActor(source.ref)?.character?.equipment);
  if (!piece) throw Error('No available blocking piece. Resolve this hit with the GM without a block.');
  const roll = recordBlockFace(mode, piece.currentDie, face);
  const approval = { version: 1, roomId: context.roomId, approvalId: crypto.randomUUID(), actionEpoch: snapshot.actionEpoch, baseCommitSequence: snapshot.commitSequence,
    source: offer.attack.source, target: source.ref, attack: { commandId: offer.commandId, attackHash: offer.attackHash },
    blocking: { revision: view.declaration.revision, slot: piece.slot, itemId: piece.itemId, die: piece.currentDie }, roll };
  retain(context, { owner: { phase: 'prepared', approval, piece: { name: piece.name, die: piece.currentDie, kind: piece.kind } } });
  return sendApproval(context);
}
async function sendApproval(context) {
  const latest = loadBlockingCustody(context)?.owner;
  if (!latest?.approval) return null;
  const result = await requestActorEvent('actor_block_approve', latest.approval);
  if (!context.current()) return null;
  if (result.receipt) return consumeBlockReceipt(result);
  const phase = result.code === 'awaiting_gm' ? 'awaiting' : ['approval_withdrawn', 'approval_declined', 'approval_owner_reapproval_required'].includes(result.code) ? 'closed'
    : ['outcome_unknown', 'room_connection_unavailable'].includes(result.code) ? 'unknown' : 'refused';
  retain(context, { owner: { ...latest, phase, code: result.code } });
  set({ ownerStatus: { phase, message: phase === 'awaiting' ? `Rolled ${latest.approval.roll.faces[0]} on ${latest.piece.name} (${latest.piece.die}). Awaiting the GM.`
    : phase === 'unknown' ? `Block roll outcome unresolved (${result.code}). Check the same roll.` : `Block roll not registered (${result.code}).` } });
  return result;
}
export const checkBlockApproval = () => sendApproval(blockingContext());
export async function withdrawBlock() {
  const context = blockingContext(), latest = loadBlockingCustody(context)?.owner;
  if (!latest?.approval) return null;
  const result = await requestActorEvent('actor_block_withdraw', { roomId: context.roomId, approvalId: latest.approval.approvalId });
  if (result.receipt) return consumeBlockReceipt(result);
  retain(context, { owner: { ...latest, phase: result.success ? 'closed' : 'unknown', code: result.code } });
  set({ ownerStatus: { phase: result.success ? 'closed' : 'unknown', message: result.success ? 'Block roll withdrawn; nothing was applied.' : `Withdraw unresolved (${result.code}).` } });
  return result;
}

// ── GM: attack offer and approval-bound command ────────────────────────────
export async function gmOfferBlock(form) {
  const context = blockingContext(), delivery = captureActorDelivery();
  if (!game().isGMMode || !context.current()) throw Error('Current GM required.');
  const snapshot = await refreshActorSnapshot();
  if (!context.current() || !currentActorDelivery(delivery, context.roomId)) return null;
  if (!snapshot.success) throw Error(`Snapshot unavailable (${snapshot.code}).`);
  const sourceToken = findActor(form.source), targetToken = findActor(form.target);
  if (!sourceToken || !targetToken) throw Error('Choose a bound creature and a bound character on this map.');
  const attack = buildAttack({ ...form, sourceRevision: sourceToken.state.actorContract.revision });
  const commandId = crypto.randomUUID();
  retain(context, { gm: { ...(loadBlockingCustody(context)?.gm || {}), [commandId]: { phase: 'offering', attack } } });
  const result = await requestActorEvent('actor_block_offer', { roomId: context.roomId, commandId, attack });
  if (!result.success) {
    retain(context, { gm: { ...(loadBlockingCustody(context)?.gm || {}), [commandId]: { phase: 'closed', attack, code: result.code } } });
    throw Error(`Offer refused (${result.code}).`);
  }
  const offer = { commandId, attack: result.attack, attackHash: result.attackHash };
  retain(context, { gm: { ...(loadBlockingCustody(context)?.gm || {}), [commandId]: { phase: 'offered', offer } } });
  set(s => ({ gmOffers: { ...s.gmOffers, [commandId]: offer }, gmStatus: { ...s.gmStatus, [commandId]: { phase: 'offered', message: 'Offered; waiting for the owner’s block roll.' } } }));
  return offer;
}
export async function gmReadDeclaration(ref) {
  const result = await requestActorEvent('actor_blocking_view', { roomId: ref.roomId, ref });
  if (result?.success) set(s => ({ gmViews: { ...s.gmViews, [`${ref.mapId}:${ref.tokenId}`]: result.declaration } }));
  return result;
}
const nameOf = token => token?.state?.customName || token?.character?.name || token?.name || token?.creature?.name || token?.id || 'Unknown';
export async function gmPlanBlock(approvalId, draft) {
  const entry = useBlockingStore.getState().gmPending[approvalId];
  if (!entry) throw Error('Approval is no longer pending.');
  const offer = useBlockingStore.getState().gmOffers[entry.approval.attack.commandId];
  if (!offer) throw Error('The matching offer is not in this session; check pending blocks again.');
  const snapshot = await refreshActorSnapshot();
  if (!snapshot.success) throw Error(`Current snapshot required (${snapshot.code}).`);
  const view = await gmReadDeclaration(entry.approval.target);
  if (!view?.success) throw Error(`Declaration unavailable (${view?.code}).`);
  const sourceToken = findActor(entry.approval.source), targetToken = findActor(entry.approval.target);
  if (!sourceToken || !targetToken) throw Error('Exact actors are no longer present.');
  return planBlockCommand({ offer, entry, sourceToken, targetToken, declaration: view.declaration, names: { source: nameOf(sourceToken), target: nameOf(targetToken) }, ...draft });
}
export async function gmAcceptBlock(approvalId, draft) {
  const context = blockingContext(), delivery = captureActorDelivery();
  if (!game().isGMMode || !context.current()) throw Error('Current GM required.');
  const entry = useBlockingStore.getState().gmPending[approvalId];
  const kept = entry && loadBlockingCustody(context)?.gm?.[entry.approval.attack.commandId];
  if (kept?.command && ['submitting', 'unknown'].includes(kept.phase)) throw Error('Check the same prepared command first.');
  const snapshot = await refreshActorSnapshot();
  if (!context.current() || !currentActorDelivery(delivery, context.roomId)) return null;
  if (!snapshot.success) throw Error(`Current GM snapshot required (${snapshot.code}).`);
  const plan = await gmPlanBlock(approvalId, draft);
  const command = prepareActorCommand(plan.entries, plan.extra, { commandId: plan.commandId });
  keepGm(context, plan.commandId, { phase: 'submitting', command, approvalId, message: 'Submitting one HP + wear consequence…' });
  return settleGm(context, plan.commandId, await submitPreparedActorCommand(command));
}
function keepGm(context, commandId, value) {
  retain(context, { gm: { ...(loadBlockingCustody(context)?.gm || {}), [commandId]: { ...(loadBlockingCustody(context)?.gm?.[commandId] || {}), ...value } } });
  set(s => ({ gmStatus: { ...s.gmStatus, [commandId]: value } }));
}
function settleGm(context, commandId, result) {
  if (!context.current()) return null;
  if (result?.receipt) return consumeBlockReceipt(result);
  const definitive = !['outcome_unknown', 'room_connection_unavailable'].includes(result?.code);
  keepGm(context, commandId, { phase: definitive ? 'refused' : 'unknown', code: result?.code,
    message: definitive ? `Command refused (${result?.code}). Review and prepare again; the original command is retained for checking.` : `Command outcome unresolved (${result?.code}). Check the same command.` });
  return result;
}
export async function gmCheckBlockCommand(commandId) {
  const context = blockingContext(), saved = loadBlockingCustody(context)?.gm?.[commandId];
  if (!saved?.command) return null;
  return settleGm(context, commandId, await submitPreparedActorCommand(saved.command));
}
export async function gmDeclineBlock(approvalId) {
  const context = blockingContext();
  const result = await requestActorEvent('actor_block_decline', { roomId: context.roomId, approvalId });
  if (result.receipt) return consumeBlockReceipt(result);
  if (result.success) set(s => { const gmPending = { ...s.gmPending }; delete gmPending[approvalId]; return { gmPending }; });
  return result;
}
export async function gmCancelOffer(commandId) {
  const context = blockingContext();
  const result = await requestActorEvent('actor_block_decline', { roomId: context.roomId, commandId });
  if (result.success) {
    keepGm(context, commandId, { phase: 'closed', message: 'Offer withdrawn; nothing applied.' });
    set(s => { const gmOffers = { ...s.gmOffers }; delete gmOffers[commandId]; return { gmOffers }; });
  }
  return result;
}
export async function refreshBlockLists() {
  const context = blockingContext();
  if (!context.current()) return;
  const result = await requestActorEvent('actor_block_list', { roomId: context.roomId });
  if (!context.current() || !result?.success) return;
  const saved = loadBlockingCustody(context);
  set({ offers: game().isGMMode ? useBlockingStore.getState().offers : Object.fromEntries((result.offered || []).map(o => [o.commandId, o])),
    ...(game().isGMMode ? { gmOffers: Object.fromEntries((result.offered || []).map(o => [o.commandId, o])), gmPending: Object.fromEntries((result.pending || []).filter(e => !e.own).map(e => [e.approval.approvalId, e])),
      gmStatus: Object.fromEntries(Object.entries(saved?.gm || {}).map(([id, v]) => [id, { ...v, phase: v.phase === 'submitting' ? 'unknown' : v.phase }])) } : {}) });
  if (saved?.owner?.approval && ['awaiting', 'unknown', 'prepared'].includes(saved.owner.phase)) set({ ownerStatus: { phase: saved.owner.phase, message: `Retained block roll ${saved.owner.approval.roll.faces[0]} on ${saved.owner.piece?.name}. Check the same roll.` } });
}

// ── Accepted receipts (owner sheet + GM history + chat) ────────────────────
function drainGaps() {
  let progressed = true;
  while (progressed && gapQueue.length) {
    progressed = false;
    for (let i = 0; i < gapQueue.length; i++) {
      const item = gapQueue[i];
      const result = runPrivate(state => applyWearReceipt(state, item), item.ref);
      if (result.outcome !== 'gap') { gapQueue.splice(i, 1); progressed = true; break; }
    }
  }
}
export function consumeBlockReceipt(result) {
  const view = blockReceipt(result), context = blockingContext();
  if (!view || !context.current() || view.receipt.roomId !== context.roomId) return null;
  const source = ownerSource();
  if (!source.error && sameRef(source.ref, view.target) && view.target.ownerUid === context.uid) {
    const item = { ref: view.target, commandId: view.receipt.commandId, wear: view.wear };
    const applied = runGuarded(state => applyWearReceipt(state, item), view.target);
    if (applied.outcome === 'gap') {
      if (!gapQueue.some(q => q.commandId === item.commandId)) {
        if (gapQueue.length < 32) gapQueue.push(item);
        scheduleGapResolution(gapQueue.length >= 32); // overflow: resolve from the scoped view now, never drop silently
      }
    } else drainGaps();
    if (applied.outcome === 'home-required') refreshOwnBlocking();
    const saved = loadBlockingCustody(context)?.owner;
    if (saved?.approval?.approvalId === view.approvalId) retain(context, { owner: { ...saved, phase: 'accepted' } });
    set({ ownerStatus: { phase: 'accepted', message: acceptedBlockText(result) } });
    readOwnView(view.target);
  }
  const commandId = view.receipt.commandId, kept = loadBlockingCustody(context)?.gm?.[commandId];
  if (kept && game().isGMMode) keepGm(context, commandId, { phase: 'accepted', message: acceptedBlockText(result) });
  set(s => { const gmPending = { ...s.gmPending }, gmOffers = { ...s.gmOffers }, offers = { ...s.offers }; delete gmPending[view.approvalId]; delete gmOffers[commandId]; delete offers[commandId]; return { gmPending, gmOffers, offers }; });
  const chat = getStore('chatStore'), notificationId = `p12b:${view.receipt.roomId}:${commandId}`;
  if (chat && !chat.getState().notifications.combat.some(n => n.id === notificationId)) chat.getState().addNotification('combat', { id: notificationId, type: 'combat', timestamp: new Date(view.receipt.acceptedAt).toISOString(), content: acceptedBlockText(result) });
  return view;
}
/** Sync receipts for the owner's own declaration (ACK may have been lost). */
function consumeDeclarationReceipt(result) {
  const context = blockingContext(), saved = loadBlockingCustody(context)?.declaration;
  if (!saved?.command || saved.phase === 'accepted' || result?.receipt?.commandId !== saved.command.commandId) return;
  settleDeclaration(context, result);
}
export function registerBlockingHandlers({ socket }) {
  if (!socket) return () => {};
  const registered = captureActorDelivery(socket);
  const live = roomId => currentActorDelivery({ ...registered, room: game().multiplayerRoom, roomId: game().multiplayerRoom?.id }, roomId);
  const offered = value => { if (live(value?.roomId)) { set(s => ({ offers: { ...s.offers, [value.commandId]: value }, ownerOpen: true })); } };
  const offerClosed = value => { if (live(value?.roomId)) set(s => { const offers = { ...s.offers }; delete offers[value.commandId]; return { offers }; }); };
  const pending = value => { if (live(value?.roomId) && game().isGMMode) set(s => ({ gmPending: { ...s.gmPending, [value.approval.approvalId]: value } })); };
  const closed = value => {
    if (!live(value?.roomId)) return;
    set(s => { const gmPending = { ...s.gmPending }; delete gmPending[value.approvalId]; return { gmPending }; });
    const context = blockingContext(), latest = loadBlockingCustody(context)?.owner;
    if (latest?.approval?.approvalId === value.approvalId && latest.phase !== 'accepted') {
      retain(context, { owner: { ...latest, phase: 'closed', code: value.code } });
      set({ ownerStatus: { phase: 'closed', message: value.code === 'owner_reapproval_required' ? 'Your declaration changed; roll again if the GM re-offers.' : `Block roll ${value.code}; nothing was applied.` } });
    }
  };
  const changed = value => {
    if (!live(value?.roomId)) return;
    if (game().isGMMode) set(s => ({ gmViews: { ...s.gmViews, [`${value.ref.mapId}:${value.ref.tokenId}`]: value.declaration } }));
    const source = ownerSource();
    if (!source.error && sameRef(source.ref, value.ref)) set({ ownView: { ref: value.ref, declaration: value.declaration } });
  };
  const accepted = result => {
    if (!live(result?.receipt?.roomId)) return;
    if (blockReceipt(result)) consumeBlockReceipt(result);
    else if (result.receipt.actors?.some(actor => actor.blocking)) consumeDeclarationReceipt(result);
  };
  const rejoined = () => { if (live(game().multiplayerRoom?.id)) { refreshBlockLists(); refreshOwnBlocking(); } };
  const events = [['actor_block_offered', offered], ['actor_block_offer_closed', offerClosed], ['actor_block_pending', pending], ['actor_block_closed', closed],
    ['actor_blocking_changed', changed], ['actor_consequence_accepted', accepted], ['room_joined', rejoined]];
  events.forEach(([event, handler]) => socket.on(event, handler));
  return () => events.forEach(([event, handler]) => socket.off(event, handler));
}
