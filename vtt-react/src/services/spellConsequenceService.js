/** Original P9 runtime: producer routing, owner approval custody, GM adjudication
 * and receipt-only results. Stores remain projections of accepted P7 receipts. */
import { create } from 'zustand';
import { getStore } from '../store/storeRegistry';
import { normalizeManagedClassResource } from '../data/classResourceContracts';
import { canonical, sameExactRef } from './featherSlash';
import { supportSpell, buildApproval, planSpellCommand, spellReceipt, typedClassValue, ownerRefusal, gmRefusal, P9_SPELL_EXECUTION } from './spellConsequence';
import { refOf, findActor, inSharedRoom, refreshActorSnapshot, prepareActorCommand, submitPreparedActorCommand, retryActorCommand,
  requestActorEvent, roomResourceProjection } from './actorConsequenceService';
import { spellContext, loadLatestSpell, retainLatestSpell, unresolvedSpell } from './spellConsequenceCustody';
import { chatLineFor } from './acceptedResultFeed';
import { draftContext, sameDraftContext, withDiscarded } from './targetPick';
import { replaceAuthoredRegistry } from './authoredAbilityRegistry';
import { isAuthored, actionId, CAPABILITY } from './authoredAbility';
import { matchingItemVersions } from './itemAuthoredAbility';
import { conditionContext, loadConditionCustody, retainConditionCommand } from './sharedConditionCustody';

export const useSpellConsequenceStore = create(() => ({ owner: null, ownerStatus: null, gmPending: {}, gmStatus: {} }));
export async function refreshAuthoredAbilities() {
  const context = spellContext(), socket = gameState().multiplayerSocket;
  const result = await requestActorEvent('actor_authored_list', { roomId: context.roomId });
  if (!context.current() || gameState().multiplayerSocket !== socket) return { success: false, code: 'retired_principal' };
  if (result.success) {
    replaceAuthoredRegistry(context.roomId, result.entries);
    useSpellConsequenceStore.setState({ authoredEntries: result.entries, creatureSources: result.creatureSources || [], registryRevision: result.revision, authoredRoomId: context.roomId });
  }
  return result;
}
export function authoredRegistryWork() { return loadConditionCustody()?.entries?.['authored-registry'] || null; }
export async function changeAuthoredAdmission(operation, recordOrRef, classId, sourceRef) {
  const context = conditionContext(), old = authoredRegistryWork();
  if (old && !['accepted', 'failed'].includes(old.phase)) throw Error('Admission outcome unknown. Check the original request before making another change.');
  const result = await refreshAuthoredAbilities();
  if (!result.success || !context.current()) throw Error(result.code || 'Room unavailable');
  const data = { roomId: context.roomId, requestId: crypto.randomUUID(), expectedRegistryRevision: result.revision };
  if (operation === 'admit') {
    if (sourceRef) {
      const snapshot = await refreshActorSnapshot();
      if (!snapshot.success || !context.current()) throw Error('Current source snapshot unavailable.');
      const source = findActor(sourceRef);
      if (!source) throw Error('Exact placed source is missing.');
      data.source = sourceRef; data.expectedSourceRevision = source.state.actorContract.revision;
      const association = result.creatureSources?.find(e => sameExactRef(e.source, sourceRef))?.association;
      const match = matchingItemVersions(association, result.entries, context.roomId).filter(e => !e.revoked && e.canonicalDefinition.binding.classId === 'arcanoneer').at(-1);
      data.definitionVersion = match?.definitionRef.definitionVersion || 1 + Math.max(0, ...result.entries.filter(e => e.definitionRef.definitionId === recordOrRef.authoredDefinitionId).map(e => e.definitionRef.definitionVersion));
    } else {
      data.record = recordOrRef; data.classId = classId;
      data.definitionVersion = 1 + Math.max(0, ...result.entries.filter(e => e.definitionRef.definitionId === recordOrRef.authoredDefinitionId).map(e => e.definitionRef.definitionVersion));
    }
  } else data.definitionRef = recordOrRef;
  const entry = { kind: 'authored-registry', event: `actor_authored_${operation}`, command: { commandId: data.requestId, ...data }, phase: 'prepared' };
  retainConditionCommand(context, 'authored-registry', entry);
  return checkAuthoredAdmission();
}
export async function checkAuthoredAdmission() {
  const context = conditionContext(), old = authoredRegistryWork();
  if (!old || old.phase === 'accepted') return old?.result;
  const { commandId, ...data } = old.command;
  const result = await requestActorEvent(old.event, data);
  if (!context.current()) return { success: false, code: 'retired_principal' };
  const phase = result.success ? 'accepted' : UNKNOWN.includes(result.code) ? 'unknown' : 'failed';
  retainConditionCommand(context, 'authored-registry', { ...old, phase, result });
  await refreshAuthoredAbilities();
  if (result.success && old.command.source) await refreshActorSnapshot();
  useSpellConsequenceStore.setState(s => ({ registryWorkVersion: (s.registryWorkVersion || 0) + 1 }));
  return result;
}
const UNKNOWN = ['outcome_unknown', 'room_connection_unavailable', 'retired_principal', 'snapshot_required'];
const unavailableOutcome = value => ['unresolved', 'unknown', 'prepared'].includes(value?.phase) || ['retry_window_expired', 'approval_consumed'].includes(value?.result?.code);
const characterState = () => getStore('characterStore')?.getState() || {};
const gameState = () => getStore('gameStore')?.getState() || {};
const tokens = () => [...(getStore('creatureStore')?.getState().creatureTokens || []), ...(getStore('characterTokenStore')?.getState().characterTokens || [])];
const setOwnerStatus = ownerStatus => useSpellConsequenceStore.setState({ ownerStatus });
// Latest writer-confirmed checkpoint revision per room (from room_save_status only).
const confirmed = new Map();
function durabilityLabel(receipt, fallback) {
  if (receipt?.checkpointRevision === null) return 'live-only (temporary room)';
  const revision = receipt?.checkpointRevision, latest = confirmed.get(receipt?.roomId);
  if (Number.isSafeInteger(revision) && revision > 0 && Number.isSafeInteger(latest) && revision <= latest) return 'checkpoint-confirmed';
  return fallback === 'checkpoint-confirmed' ? fallback : 'accepted-live / checkpoint pending';
}

/** Support decision for the current shared-room caster; null when not in a room. */
export function spellSupport(spellLike) {
  if (!P9_SPELL_EXECUTION || !inSharedRoom()) return null;
  return supportSpell(spellLike, characterState());
}
export function spellDiagnostic(spellLike) {
  const support = spellSupport(spellLike);
  return support && !support.supported ? support.reason : null;
}
export const isP9Routed = spellLike => spellSupport(spellLike)?.supported === true;
/** Producer gate: a supported spell in a shared room opens the P9 panel and never
 * reaches a local pre-spend, cooldown or empty-target notice. */
export function routeSpellCast(spellLike, origin) {
  const support = spellSupport(spellLike);
  if (!support?.supported) return false;
  useSpellConsequenceStore.setState({ owner: { spellId: support.definitionId, origin: { producer: origin?.producer || 'unknown', slotIndex: origin?.slotIndex ?? null } } });
  return true;
}
export const closeOwnerPanel = () => useSpellConsequenceStore.setState({ owner: null });

// A4 uses the same retained-roll slot, payment preparation and GM command custody as A1.
export const creatureAttempt = () => { const r = loadLatestSpell(); return r?.route === 'creature' ? r : null; };
export async function openCreatureAbility(sourceRef) {
  const latest = loadLatestSpell();
  if (latest?.route === 'creature' && !['accepted', 'reconciled'].includes(latest.phase) && (latest.creature?.roll || latest.approval)) {
    useSpellConsequenceStore.setState({ creatureOpen: true }); return;
  }
  if (unresolvedSpell(latest) || latest?.draft?.roll) throw Error('A recorded ability roll is retained. Finish or explicitly reconcile it first.');
  const context = spellContext();
  const result = await refreshAuthoredAbilities(), snapshot = await refreshActorSnapshot();
  if (!result.success || !snapshot.success || !context.current() || !gameState().isGMMode) throw Error('Current GM room authority is unavailable.');
  const source = findActor(sourceRef), savedSource = result.creatureSources?.find(e => sameExactRef(e.source, sourceRef)), grant = savedSource?.admission;
  const entry = result.entries.find(e => grant && actionId(e.definitionRef) === actionId(grant.definitionRef));
  if (!source || !grant || !entry || entry.revoked || grant.gmUid !== context.uid || !matchingItemVersions(savedSource.association, [entry], context.roomId).length) throw Error('Admit this exact placed creature and saved version first.');
  if (entry.canonicalDefinition.targeting.rangeFeet === 0 || entry.canonicalDefinition.targeting.restriction === 'self') throw Error('Range 0 or self-only: distinct creature targets are unavailable in this slice. The authored definition is unchanged.');
  retainLatestSpell(context, { route: 'creature', phase: 'draft', creature: { source: sourceRef, entry, grant, roll: null, target: null, attemptId: crypto.randomUUID(), actionEpoch: snapshot.actionEpoch, baseCommitSequence: snapshot.commitSequence } });
  useSpellConsequenceStore.setState({ creatureOpen: true }); bumpDraft();
}
export function saveCreatureRoll(roll, target) {
  const context = spellContext(), latest = creatureAttempt();
  if (!latest || latest.approval) throw Error('This prepared attempt is immutable. Check or explicitly cancel it first.');
  if (latest.creature.roll && canonical(latest.creature.roll) !== canonical(roll)) throw Error('The recorded faces cannot be replaced.');
  const creature = { ...latest.creature, roll, target };
  const draft = { context: draftContext('spell', { sourceRef: creature.source, spellId: actionId(creature.entry.definitionRef) }), label: creature.entry.canonicalDefinition.name, roll, targetKey: '', at: Date.now() };
  const kept = retainLatestSpell(context, { ...latest, creature, draft }); bumpDraft();
  if (!String(kept.custody).startsWith('Device')) throw Error('Device custody unavailable. Faces remain in memory; nothing emitted.');
}
export async function prepareCreatureAbility() {
  const context = spellContext(), latest = creatureAttempt(), c = latest?.creature;
  if (!c?.roll || !c.target) throw Error('Choose an exact target and retain the roll first.');
  if (latest.phase === 'accepted') return;
  const d = c.entry.canonicalDefinition;
  const approval = latest.approval || { version: 1, roomId: context.roomId, approvalId: c.attemptId, actionEpoch: c.actionEpoch, baseCommitSequence: c.baseCommitSequence,
    source: c.source, target: c.target, sourceAuthority: { admissionId: c.grant.requestId, gmUid: c.grant.gmUid, associationHash: c.grant.associationHash },
    spell: { definitionId: actionId(c.entry.definitionRef), definitionHash: `${CAPABILITY}/${c.entry.definitionRef.definitionHash}`, name: d.name, kind: d.effect.kind, damageTypes: c.entry.descriptor.effect.damageTypes },
    price: c.entry.descriptor.price, classPayment: null, roll: c.roll };
  const retained = retainLatestSpell(context, { ...latest, approval, phase: 'prepared' });
  if (!String(retained.custody).startsWith('Device')) throw Error('Device custody unavailable; nothing emitted.');
  useSpellConsequenceStore.setState({ creatureMessage: 'Validating exact source, admission, target and retained roll…' });
  const result = await requestActorEvent('actor_spell_prepare_creature', approval);
  if (!context.current()) return;
  if (result.success && result.receipt) { consumeSpellReceipt(result, { historical: true }); return; }
  const phase = result.code === 'awaiting_gm' ? 'awaiting' : ['retry_window_expired', 'approval_consumed'].includes(result.code) ? 'unresolved' : UNKNOWN.includes(result.code) ? 'unknown' : 'refused';
  retainLatestSpell(context, { ...retained, phase, contentHash: result.contentHash, result });
  if (phase === 'awaiting') useSpellConsequenceStore.setState(s => ({ gmPending: { ...s.gmPending, [approval.approvalId]: { approval, contentHash: result.contentHash } } }));
  useSpellConsequenceStore.setState({ creatureMessage: phase === 'awaiting' ? 'Validated. Nothing spent. Review and confirm the final amount.' : ['unknown', 'unresolved'].includes(phase) ? 'Outcome unavailable. Check the original attempt or reconcile manually; replacement is blocked.' : `Refused (${result.error || result.code}). Original faces retained; explicitly revalidate after correction. Nothing installed by this check.` });
  bumpDraft();
}
export async function cancelCreatureAbility() {
  const context = spellContext(), latest = creatureAttempt();
  if (!latest) return;
  const command = latest.approval && loadConditionCustody(context)?.entries?.[`authored-spell:${latest.approval.approvalId}`];
  if (['unknown', 'unresolved'].includes(latest.phase) || unavailableOutcome(command) || (command && !['failed', 'accepted'].includes(command.phase))) throw Error('Check the original command before cancelling. Its outcome is unknown or unavailable; manual reconciliation may be required.');
  if (latest.approval && latest.phase !== 'accepted') {
    const result = await requestActorEvent('actor_spell_withdraw', { roomId: context.roomId, approvalId: latest.approval.approvalId, approval: latest.approval });
    if (!context.current()) return;
    if (result.success && result.receipt) { consumeSpellReceipt(result, { historical: true }); return; }
    if (!result.success || result.code !== 'withdrawn') throw Error(`Cannot prove cancellation (${result.code}). Reconcile manually; faces retained.`);
  }
  // Explicitly closed evidence is kept in the existing bounded discarded-draft history.
  retainLatestSpell(context, { ...latest, phase: 'reconciled', draft: null, discardedDrafts: latest.draft ? withDiscarded(latest.discardedDrafts, latest.draft) : latest.discardedDrafts });
  useSpellConsequenceStore.setState({ creatureOpen: false }); bumpDraft();
}
/** Explicit material revalidation: positive close first, same source/formula/faces, new provenance. */
export async function revalidateCreatureContext() {
  const context = spellContext(), latest = creatureAttempt(), c = latest?.creature;
  if (!c?.roll || ['accepted', 'unknown', 'unresolved'].includes(latest.phase)) throw Error('Resolve the original outcome before changing its context.');
  const saved = latest.approval && loadConditionCustody(context)?.entries?.[`authored-spell:${latest.approval.approvalId}`];
  if (saved && (saved.phase !== 'failed' || unavailableOutcome(saved))) throw Error('Check the original command; it cannot be replaced.');
  const result = await refreshAuthoredAbilities(), snapshot = await refreshActorSnapshot();
  if (!result.success || !snapshot.success || !context.current()) throw Error('Current room context unavailable. Original evidence retained.');
  const source = findActor(c.source), savedSource = result.creatureSources?.find(e => sameExactRef(e.source, c.source)), grant = savedSource?.admission;
  const entry = result.entries.find(e => grant && actionId(e.definitionRef) === actionId(grant.definitionRef));
  if (!source || !entry || entry.revoked || grant.gmUid !== context.uid || !matchingItemVersions(savedSource.association, [entry], context.roomId).length || entry.canonicalDefinition.effect.formula !== c.roll.reading || entry.canonicalDefinition.effect.kind !== c.entry.canonicalDefinition.effect.kind)
    throw Error('Exact source, effect or formula is incompatible. Original evidence remains retained for manual reconciliation.');
  if (latest.approval) {
    const closed = await requestActorEvent('actor_spell_withdraw', { roomId: context.roomId, approvalId: latest.approval.approvalId, approval: latest.approval });
    if (!context.current()) return;
    if (closed.success && closed.receipt) { consumeSpellReceipt(closed, { historical: true }); return; }
    if (!closed.success || closed.code !== 'withdrawn') throw Error(`Old attempt not positively closed (${closed.code}); no replacement created.`);
  }
  const history = latest.attemptHistory || [];
  if (history.length >= 64) throw Error('Evidence history full; manual reconciliation required.');
  const { attemptHistory, custody, ...evidence } = latest; // eslint-disable-line no-unused-vars
  retainLatestSpell(context, { route: 'creature', phase: 'draft', supersedes: latest.approval?.approvalId, attemptHistory: [...history, evidence],
    creature: { ...c, entry, grant, attemptId: crypto.randomUUID(), actionEpoch: snapshot.actionEpoch, baseCommitSequence: snapshot.commitSequence }, draft: latest.draft });
  useSpellConsequenceStore.setState({ creatureMessage: 'Old attempt positively closed. Original faces retained. Explicitly select/review the target, then validate the refreshed admission.' }); bumpDraft();
}

/** The caster is the selected, matching owner primary attachment (P7 reconciliation). */
export function ownerSource() {
  const projection = roomResourceProjection();
  if (!projection) return { error: 'Select your owner attachment in the Party HUD first (exact owner, character, room and session).' };
  const token = findActor(projection.roomActorProjection.ref);
  if (!token || !token.state?.actorContract?.primary) return { error: 'Your primary room attachment is missing or retired.' };
  return { token, ref: refOf(token), mapId: token.mapId };
}
async function readHome(ref) {
  const result = await requestActorEvent('actor_recovery', { roomId: ref.roomId, ref });
  if (!result?.success) return { error: result?.code || 'recovery_unavailable' };
  const stored = result.recovery?.rawToken?.state?.classPayment;
  return { home: stored?.version === 1 ? { domain: stored.domain, value: stored.value } : null };
}
/** Owner-only sync of their own sheet value into the revisioned room home. */
async function syncHome(ref, payment) {
  const read = await readHome(ref);
  if (read.error) return { success: false, code: read.error };
  const wanted = { domain: payment.domain, value: payment.before };
  if (canonical(read.home) === canonical(wanted)) return { success: true, code: 'class_home_current' };
  const snapshot = await refreshActorSnapshot();
  if (!snapshot.success) return snapshot;
  const token = findActor(ref);
  if (!token) return { success: false, code: 'actor_not_found' };
  const command = prepareActorCommand([{ ref, expectedRevision: token.state.actorContract.revision, classPayment: { mode: 'sync', before: read.home, after: wanted } }]);
  return submitPreparedActorCommand(command);
}
function describeRefusal(code) {
  return `Not registered (${String(code || 'refused').replace(/_/g, ' ')}) — no payment was recorded.`;
}
/** Owner: approve the exact price/typed result with one recorded roll. */
// ── P12C-B1 roll drafts (MYTHRILL_PROJECT_12C_B1_CONTRACT.md §2) ─────────────────────────────────────
export const spellDraftContext = ({ characterId, sourceRef, spellId }) => sourceRef && spellId ? draftContext('spell', { characterId, sourceRef, spellId }) : null;
export const loadSpellDraft = () => loadLatestSpell()?.draft || null;
export const loadDiscardedSpellDrafts = () => loadLatestSpell()?.discardedDrafts || [];
const bumpDraft = () => useSpellConsequenceStore.setState(s => ({ draftVersion: (s.draftVersion || 0) + 1 }));
/** Retains a recorded roll at roll time; never replaces a draft that belongs to another spell. */
export function saveSpellDraft({ context: ctx, label, roll, targetKey }) {
  const context = spellContext(), latest = loadLatestSpell(context);
  if (!ctx) throw Error('Select your owner attachment before rolling.');
  if (unresolvedSpell(latest)) throw Error('A spell approval with a recorded roll is pending. Check or withdraw it first.');
  if (latest?.draft && !sameDraftContext(latest.draft.context, ctx)) throw Error('A recorded roll for another spell is retained. Cast it from that spell or discard it first.');
  const { custody, ...rest } = latest || {}; // eslint-disable-line no-unused-vars
  const draft = { context: ctx, label: String(label || '').slice(0, 80), roll: roll || null, targetKey: targetKey || '', at: latest?.draft?.at || Date.now() };
  const kept = retainLatestSpell(context, { ...rest, draft });
  bumpDraft();
  if (!String(kept.custody || '').startsWith('Device')) throw Error(`Roll kept in memory only: ${kept.custody}`);
  return draft;
}
export function discardSpellDraft() {
  const context = spellContext(), latest = loadLatestSpell(context);
  if (!latest?.draft) return;
  const { custody, ...rest } = latest; // eslint-disable-line no-unused-vars
  retainLatestSpell(context, { ...rest, draft: null, discardedDrafts: withDiscarded(latest.discardedDrafts, latest.draft) });
  bumpDraft();
}
/** The recorded roll of an approval that was not accepted, as a draft for the same spell (contract §2). */
function spellDraftFromApproval(a) {
  return { context: draftContext('spell', { characterId: a.source.characterId, sourceRef: a.source, spellId: a.spell.definitionId }), label: a.spell.name, roll: a.roll, targetKey: '', at: Date.now(), fromApproval: a.approvalId };
}
export async function sendSpellApproval({ spellId, targetRef, roll, origin }) {
  const context = spellContext();
  if (!context.current()) return setOwnerStatus({ phase: 'refused', message: 'Sign in and join the room to cast with P9.' });
  const latest = loadLatestSpell(context);
  if (unresolvedSpell(latest)) return setOwnerStatus({ phase: latest.phase, message: 'An unresolved spell approval is retained; check or withdraw it first.', latest });
  const source = ownerSource();
  if (source.error) return setOwnerStatus({ phase: 'refused', message: source.error });
  let support = supportSpell({ id: spellId }, characterState());
  if (!support.supported) return setOwnerStatus({ phase: 'refused', message: support.reason });
  if (!support.payment.affordable) return setOwnerStatus({ phase: 'refused', message: support.payment.reason });
  if (support.payment.classPayment) {
    setOwnerStatus({ phase: 'syncing', message: 'Publishing your current class resource to the room…' });
    const synced = await syncHome(source.ref, support.payment.classPayment);
    if (!synced.success) return setOwnerStatus({ phase: 'refused', message: `Class resource sync refused (${synced.code}); nothing submitted.` });
  }
  const snapshot = await refreshActorSnapshot();
  if (!snapshot.success) return setOwnerStatus({ phase: 'refused', message: `Room snapshot unavailable (${snapshot.code}); nothing submitted.` });
  support = supportSpell({ id: spellId }, characterState());
  const current = ownerSource();
  if (current.error) return setOwnerStatus({ phase: 'refused', message: current.error });
  let approval;
  try {
    approval = buildApproval({ support, tokens: tokens(), sourceRef: current.ref, targetRef, roomId: snapshot.roomId, mapId: current.mapId,
      actionEpoch: snapshot.actionEpoch, baseCommitSequence: snapshot.commitSequence, roll, approvalId: crypto.randomUUID() });
  } catch (error) { return setOwnerStatus({ phase: 'refused', message: error.message }); }
  let retained;
  // P12C-B1: the draft becomes the approval (the record is replaced); discards stay listed.
  try { retained = retainLatestSpell(context, { phase: 'prepared', approval, origin, cooldown: support.cooldown, discardedDrafts: latest?.discardedDrafts || [] }); } catch (error) { return setOwnerStatus({ phase: 'refused', message: error.message }); }
  if (isAuthored(approval.spell) && !String(retained.custody).startsWith('Device')) return setOwnerStatus({ phase: 'prepared', latest: retained, message: 'Device custody unavailable; nothing emitted. Restore device storage before checking this exact approval.' });
  bumpDraft();
  return submitApproval(context, retained);
}
async function submitApproval(context, current) {
  if (isAuthored(current.approval?.spell) && !String(current.custody).startsWith('Device')) return setOwnerStatus({ phase: 'prepared', latest: current, message: 'Device custody unavailable; nothing emitted.' });
  // Mark the bytes as sent before the first emission: afterwards no refusal may say "no payment".
  const firstSubmission = !current.sent;
  const retained = firstSubmission ? retainLatestSpell(context, { ...current, sent: true }) : current;
  setOwnerStatus({ phase: 'awaiting', message: 'Submitting approval…', latest: retained });
  const result = await requestActorEvent('actor_spell_approve', retained.approval);
  if (!context.current()) return { success: false, code: 'retired_principal' };
  if (result.success) { consumeSpellReceipt(result); return result; }
  if (result.code === 'awaiting_gm') {
    const kept = retainLatestSpell(context, { ...retained, phase: 'awaiting', contentHash: result.contentHash });
    return setOwnerStatus({ phase: 'awaiting', message: 'Awaiting GM adjudication. Nothing is spent until the GM accepts.', latest: kept });
  }
  if (UNKNOWN.includes(result.code)) {
    const kept = retainLatestSpell(context, { ...retained, phase: 'unknown' });
    return setOwnerStatus({ phase: 'unknown', message: 'Outcome unknown. Check this same approval; it will not reroll or pay twice.', latest: kept });
  }
  const outcome = ownerRefusal(firstSubmission, result.code);
  // A refused first submission was never registered: its recorded roll returns for the same spell.
  const returned = outcome.phase === 'refused' ? { draft: spellDraftFromApproval(retained.approval) } : {};
  const kept = retainLatestSpell(context, { ...retained, phase: outcome.phase, result, ...returned });
  if (returned.draft) bumpDraft();
  return setOwnerStatus({ ...outcome, ...(returned.draft ? { message: `${outcome.message} Your recorded roll is kept for this spell.` } : {}), latest: kept });
}
/** Owner: explicit reconciliation with the GM clears an unresolvable approval. */
export function markSpellReconciled() {
  const context = spellContext(), latest = loadLatestSpell(context);
  if (latest?.phase !== 'unresolved') return null;
  const kept = retainLatestSpell(context, { ...latest, phase: 'reconciled' });
  return setOwnerStatus({ phase: 'reconciled', message: 'Marked reconciled with the GM. The old approval is retained as history and will not be re-sent.', latest: kept });
}
/** Owner: re-send the exact retained approval bytes (idempotent on the server). */
export async function checkSpellApproval() {
  const context = spellContext(), latest = loadLatestSpell(context);
  if (!latest?.approval) return setOwnerStatus({ phase: 'idle', message: 'No retained spell approval.' });
  return submitApproval(context, latest);
}
export async function withdrawSpellApproval() {
  const context = spellContext(), latest = loadLatestSpell(context);
  if (!latest?.approval) return null;
  const result = await requestActorEvent('actor_spell_withdraw', { roomId: latest.approval.roomId, approvalId: latest.approval.approvalId });
  if (!context.current()) return null;
  if (result.success && result.receipt) { consumeSpellReceipt(result); return result; }
  if (result.success && result.code === 'withdrawn') {
    // P12C-B1 §2: the withdrawn roll returns as a draft for the same spell (re-approve, never reroll).
    const draft = spellDraftFromApproval(latest.approval);
    const kept = retainLatestSpell(context, { ...latest, phase: 'withdrawn', result, draft });
    bumpDraft();
    return setOwnerStatus({ phase: 'withdrawn', message: 'Withdrawn before GM acceptance — no payment was recorded. Your recorded roll is kept for this spell.', latest: kept });
  }
  if (['approval_consumed', 'retry_window_expired'].includes(result.code)) {
    const outcome = ownerRefusal(false, result.code);
    return setOwnerStatus({ ...outcome, latest: retainLatestSpell(context, { ...latest, phase: outcome.phase, result }) });
  }
  return setOwnerStatus({ phase: latest.phase, message: `Withdrawal not confirmed (${result.code}); the approval may still be accepted.`, latest });
}
/** Owner: approve again after the class price/typed result changed. Same roll. */
export async function reapproveSpell() {
  const context = spellContext(), latest = loadLatestSpell(context);
  if (latest?.phase !== 'reapproval') return null;
  const source = ownerSource();
  if (source.error) return setOwnerStatus({ phase: 'reapproval', message: source.error, latest });
  let support = supportSpell({ id: latest.approval.spell.definitionId }, characterState());
  if (!support.supported || !support.payment.affordable) return setOwnerStatus({ phase: 'reapproval', message: support.reason || support.payment?.reason, latest });
  if (support.reading.reading !== latest.approval.roll.reading) return setOwnerStatus({ phase: 'reapproval', message: 'Your formula reading changed; cancel and record a new roll explicitly.', latest });
  if (support.payment.classPayment) {
    const synced = await syncHome(source.ref, support.payment.classPayment);
    if (!synced.success) return setOwnerStatus({ phase: 'reapproval', message: `Class resource sync refused (${synced.code}).`, latest });
  }
  const snapshot = await refreshActorSnapshot();
  if (!snapshot.success) return setOwnerStatus({ phase: 'reapproval', message: `Room snapshot unavailable (${snapshot.code}).`, latest });
  support = supportSpell({ id: latest.approval.spell.definitionId }, characterState());
  let approval;
  try {
    approval = buildApproval({ support, tokens: tokens(), sourceRef: latest.approval.source, targetRef: latest.approval.target, roomId: snapshot.roomId,
      mapId: latest.approval.source.mapId, actionEpoch: snapshot.actionEpoch, baseCommitSequence: snapshot.commitSequence, roll: latest.approval.roll, approvalId: crypto.randomUUID() });
  } catch (error) { return setOwnerStatus({ phase: 'reapproval', message: error.message, latest }); }
  const retained = retainLatestSpell(context, { phase: 'prepared', approval, origin: latest.origin, cooldown: latest.cooldown, supersedes: latest.approval.approvalId });
  return submitApproval(context, retained);
}
export function restoreOwnerStatus() {
  const latest = loadLatestSpell();
  if (!latest || latest.route === 'creature') return null;
  const messages = { awaiting: 'Awaiting GM adjudication. Nothing is spent until the GM accepts.', unknown: 'Outcome unknown. Check this same approval.',
    reapproval: 'The class price or typed result changed. Review and approve again (same roll).', accepted: 'Accepted.', refused: describeRefusal(latest.result?.code),
    withdrawn: 'Withdrawn before GM acceptance — no payment was recorded.', declined: 'Declined by the GM before acceptance — no payment was recorded.', prepared: 'Prepared; check this same approval.',
    unresolved: ownerRefusal(false, latest.result?.code).message, reconciled: 'Marked reconciled with the GM.' };
  return setOwnerStatus({ phase: latest.phase, message: messages[latest.phase] || latest.phase, latest });
}

// ── Owner reconciliation of an accepted result ─────────────────────────────
function applyOwnerClass(view, approval) {
  const projection = roomResourceProjection();
  if (!projection || !sameExactRef(projection.roomActorProjection.ref, view.receipt.source)) return 'not-active-attachment';
  const store = getStore('characterStore'), state = store.getState();
  const payment = approval?.classPayment;
  if (!payment) return 'no-class-payment';
  const personal = typedClassValue(state.classResource, state.class, payment.domain);
  if (canonical(personal) !== canonical(payment.before)) {
    // A sheet edit during the pending window is preserved, never silently lost.
    const prior = state.roomActorRecoveryCandidates || [];
    if (prior.length >= 8) return 'candidate-capacity';
    store.setState({ roomActorRecoveryCandidates: [...prior, { ownerUid: view.receipt.source.ownerUid, characterId: view.receipt.source.characterId, ref: view.receipt.source,
      reason: 'p9-class-edit-during-pending-approval', data: { classResource: JSON.parse(JSON.stringify(state.classResource)) } }] });
  }
  store.setState({ classResource: { ...normalizeManagedClassResource({ ...state.classResource, ...payment.after }, state.class), lastUpdate: Date.now() } });
  try { require('../store/characterHelpers').triggerCharacterAutoSave(() => store.getState().saveCurrentCharacter()); } catch (_) { /* P6 status remains visible */ }
  return 'applied';
}
async function applyOwnerClassFromHome(view) {
  const projection = roomResourceProjection();
  if (!projection || !sameExactRef(projection.roomActorProjection.ref, view.receipt.source)) return;
  const read = await readHome(view.receipt.source);
  const store = getStore('characterStore'), state = store.getState();
  if (!read.home || !roomResourceProjection()) return;
  // Repair N4: without device custody the prior sheet value is preserved before replacement.
  const prior = state.roomActorRecoveryCandidates || [];
  if (canonical(typedClassValue(state.classResource, state.class, read.home.domain)) !== canonical(read.home.value)) {
    if (prior.length >= 8) return;
    store.setState({ roomActorRecoveryCandidates: [...prior, { ownerUid: view.receipt.source.ownerUid, characterId: view.receipt.source.characterId, ref: view.receipt.source,
      reason: 'p9-class-replaced-without-device-custody', data: { classResource: JSON.parse(JSON.stringify(state.classResource)) } }] });
  }
  store.setState({ classResource: { ...normalizeManagedClassResource({ ...state.classResource, ...read.home.value }, state.class), lastUpdate: Date.now() } });
}
function startCooldown(origin, cooldown, spellId) {
  if (origin?.producer !== 'hud' || !Number.isInteger(origin.slotIndex) || !cooldown || cooldown.type === 'none' || !(cooldown.value > 0)) return;
  try { window.dispatchEvent(new CustomEvent('mythrill:p9-spell-accepted', { detail: { slotIndex: origin.slotIndex, spellId, cooldown } })); } catch (_) { /* no window */ }
}
/** Every client derives results from the accepted receipt only (deduplicated). */
export function consumeSpellReceipt(result, { historical = false } = {}) {
  const view = spellReceipt(result);
  if (!view || view.receipt.roomId !== gameState().multiplayerRoom?.id) return null;
  const id = `p9:${view.receipt.roomId}:${view.receipt.submitterUid}:${view.receipt.commandId}`;
  const chat = getStore('chatStore');
  const { recorded, receipt } = view, adjudication = receipt.adjudication;
  const fullLine = `${recorded.sourceName} → ${recorded.targetName}: ${recorded.spellName} · ${recorded.roll.mode} [${recorded.roll.dice.map(group => group.faces.join(', ')).join(' | ')}] ${recorded.roll.constant >= 0 ? '+' : '-'} ${Math.abs(recorded.roll.constant)} = ${recorded.roll.total}; GM final ${adjudication.finalAmount} ${recorded.kind === 'healing' ? 'healing' : (recorded.damageTypes || []).join('/')}${adjudication.adjustmentReason ? ` (${adjudication.adjustmentReason})` : ''}. Accepted receipt ${receipt.commandId}.`;
  let line = fullLine; try {line = chatLineFor(result, fullLine);} catch (_) { line = null; } // P13A §4: never name actors this viewer cannot see
  if (!historical && line && chat && !chat.getState().notifications.combat.some(note => note.id === id)) chat.getState().addNotification('combat', {
    id, type: 'combat', receiptId: id, timestamp: new Date(receipt.acceptedAt).toISOString(),
    content: line,
  });
  useSpellConsequenceStore.setState(current => {
    const gmPending = { ...current.gmPending }; delete gmPending[view.approvalId];
    const gmStatus = { ...current.gmStatus, ...(current.gmStatus[view.approvalId] ? { [view.approvalId]: { phase: 'accepted', checkpointRevision: view.receipt.checkpointRevision, message: `Accepted · ${durabilityLabel(view.receipt, view.status)}` } } : {}) };
    return { gmPending, gmStatus };
  });
  const context = spellContext();
  const creature = loadLatestSpell(context);
  if (context.current() && creature?.route === 'creature' && creature.approval?.approvalId === view.approvalId) {
    retainLatestSpell(context, { ...creature, phase: 'accepted', result });
    bumpDraft();
  }
  if (context.current() && view.receipt.source.ownerUid === context.uid) {
    const latest = loadLatestSpell(context);
    if (latest?.approval?.approvalId === view.approvalId) {
      if (latest.phase !== 'accepted') {
        applyOwnerClass(view, latest.approval);
        startCooldown(latest.origin, latest.cooldown, view.receipt.adjudication.definitionId);
      }
      const kept = retainLatestSpell(context, { ...latest, phase: 'accepted', result });
      setOwnerStatus({ phase: 'accepted', message: `Accepted · ${durabilityLabel(view.receipt, view.status)}. GM final ${adjudication.finalAmount}.`, latest: kept });
    } else if (view.receipt.source.characterId === characterState().currentCharacterId) {
      applyOwnerClassFromHome(view);
    }
  }
  return view;
}

// ── GM adjudication ─────────────────────────────────────────────────────────
const setGm = (approvalId, status) => useSpellConsequenceStore.setState(current => ({ gmStatus: { ...current.gmStatus, [approvalId]: { ...current.gmStatus[approvalId], ...status } } }));
export async function refreshSpellApprovals() {
  const roomId = gameState().multiplayerRoom?.id;
  if (!roomId) return null;
  const result = await requestActorEvent('actor_spell_list', { roomId });
  if (!result?.success) return result;
  const gmPending = {};
  for (const entry of result.pending || []) if (!entry.own) gmPending[entry.approval.approvalId] = entry;
  useSpellConsequenceStore.setState({ gmPending });
  for (const saved of Object.values(loadConditionCustody()?.entries || {})) {
    if (saved.kind === 'authored-execution') setGm(saved.command.approval.approvalId, { phase: saved.phase === 'prepared' ? 'unknown' : saved.phase === 'failed' && ['retry_window_expired', 'approval_consumed'].includes(saved.result?.code) ? 'unresolved' : saved.phase, commandId: saved.command.commandId,
      message: saved.phase === 'accepted' ? 'Accepted (retained original result).' : 'Retained original command. Check it before confirming another result.' });
  }
  return result;
}
export async function gmAcceptSpell(approvalId, { finalAmount, reason, adjudicated }) {
  const entry = useSpellConsequenceStore.getState().gmPending[approvalId];
  if (!entry) return setGm(approvalId, { phase: 'refused', message: 'Approval no longer pending.' });
  const authored = isAuthored(entry.approval.spell), context = conditionContext();
  const prior = loadConditionCustody(context)?.entries?.[`authored-spell:${approvalId}`];
  if (authored && (['preparing', 'submitting', 'unknown', 'accepted'].includes(useSpellConsequenceStore.getState().gmStatus[approvalId]?.phase) || (prior && !['failed'].includes(prior.phase)))) return;
  setGm(approvalId, { phase: 'preparing', message: 'Preparing the exact result…' });
  const snapshot = await refreshActorSnapshot();
  if (!snapshot.success) return setGm(approvalId, { phase: 'refused', message: `Room snapshot unavailable (${snapshot.code}).` });
  let command;
  try {
    const plan = planSpellCommand({ approval: entry.approval, contentHash: entry.contentHash, tokens: tokens(), roomId: snapshot.roomId, mapId: entry.approval.source.mapId,
      finalAmount, reason, adjudicated });
    command = prepareActorCommand(plan.entries, plan.extra);
    if (authored) retainConditionCommand(context, `authored-spell:${approvalId}`, { kind: 'authored-execution', phase: 'prepared', command });
  } catch (error) { return setGm(approvalId, { phase: 'refused', message: `${error.message} Nothing submitted.` }); }
  setGm(approvalId, { phase: 'submitting', commandId: command.commandId, message: 'Submitting one consequence…' });
  const result = await submitPreparedActorCommand(command);
  if (authored && context.current()) retainConditionCommand(context, `authored-spell:${approvalId}`, { command, phase: result.success ? 'accepted' : ['retry_window_expired', 'approval_consumed'].includes(result.code) ? 'unresolved' : UNKNOWN.includes(result.code) ? 'unknown' : 'failed', result });
  return settleGm(approvalId, command.commandId, result, false);
}
function settleGm(approvalId, commandId, result, isRetry) {
  if (result.success) {
    consumeSpellReceipt(result, { historical: isRetry });
    return setGm(approvalId, { phase: 'accepted', checkpointRevision: result.receipt?.checkpointRevision, message: `Accepted · ${durabilityLabel(result.receipt, result.status)}` });
  }
  if (UNKNOWN.includes(result.code)) return setGm(approvalId, { phase: 'unknown', commandId, message: 'Outcome unknown. Check this same command; it will not be rebuilt or resubmitted with new values.' });
  return setGm(approvalId, gmRefusal(isRetry, result.code));
}
export async function gmCheckSpellCommand(approvalId) {
  const status = useSpellConsequenceStore.getState().gmStatus[approvalId];
  if (!status?.commandId) return null;
  const context = conditionContext(), saved = loadConditionCustody(context)?.entries?.[`authored-spell:${approvalId}`];
  const result = saved ? await submitPreparedActorCommand(saved.command) : await retryActorCommand(status.commandId);
  if (saved && context.current()) retainConditionCommand(context, `authored-spell:${approvalId}`, { ...saved, phase: result.success ? 'accepted' : ['retry_window_expired', 'approval_consumed'].includes(result.code) ? 'unresolved' : UNKNOWN.includes(result.code) ? 'unknown' : 'failed', result });
  return settleGm(approvalId, status.commandId, result, true);
}
export async function gmDeclineSpell(approvalId) {
  const result = await requestActorEvent('actor_spell_decline', { roomId: gameState().multiplayerRoom?.id, approvalId });
  if (result.success && result.receipt) { consumeSpellReceipt(result); return result; }
  if (result.success) {
    useSpellConsequenceStore.setState(current => { const gmPending = { ...current.gmPending }; delete gmPending[approvalId]; return { gmPending }; });
    return setGm(approvalId, { phase: 'declined', message: 'Declined before acceptance; no payment was recorded.' });
  }
  return setGm(approvalId, { phase: 'refused', message: `Decline not confirmed (${result.code}).` });
}

export function registerSpellConsequenceHandlers({ socket }) {
  if (!socket) return () => {};
  const live = () => gameState().multiplayerSocket === socket;
  // The server delivers pending approvals to entitled GM sessions only.
  const pending = value => {
    if (!live() || value?.roomId !== gameState().multiplayerRoom?.id || !value.approval?.approvalId) return;
    useSpellConsequenceStore.setState(current => ({ gmPending: { ...current.gmPending, [value.approval.approvalId]: value } }));
  };
  const closed = value => {
    if (!live() || value?.roomId !== gameState().multiplayerRoom?.id) return;
    useSpellConsequenceStore.setState(current => { const gmPending = { ...current.gmPending }; delete gmPending[value.approvalId]; return { gmPending }; });
    const context = spellContext(), latest = loadLatestSpell(context);
    if (latest?.approval?.approvalId !== value.approvalId || latest.phase === 'accepted') return;
    const phase = value.code === 'owner_reapproval_required' ? 'reapproval' : value.code === 'declined' ? 'declined' : value.code === 'withdrawn' ? 'withdrawn' : latest.phase;
    const kept = retainLatestSpell(context, { ...latest, phase });
    setOwnerStatus({ phase, latest: kept, message: phase === 'reapproval' ? 'The class price or typed result changed. Review and approve again (same roll).'
      : phase === 'declined' ? 'Declined by the GM before acceptance — no payment was recorded.' : phase === 'withdrawn' ? 'Withdrawn before GM acceptance — no payment was recorded.' : latest.phase });
  };
  const accepted = result => { if (live()) consumeSpellReceipt(result); };
  // Checkpoint confirmation upgrades the accepted label only from the writer's confirmed revision.
  const saved = value => {
    if (!live() || value?.roomId !== gameState().multiplayerRoom?.id || !Number.isSafeInteger(value.confirmedRevision)) return;
    confirmed.set(value.roomId, Math.max(confirmed.get(value.roomId) || 0, value.confirmedRevision));
    const { ownerStatus, gmStatus } = useSpellConsequenceStore.getState();
    const revision = ownerStatus?.latest?.result?.receipt?.checkpointRevision;
    if (ownerStatus?.phase === 'accepted' && Number.isSafeInteger(revision) && revision > 0 && revision <= value.confirmedRevision) {
      setOwnerStatus({ ...ownerStatus, message: ownerStatus.message.replace('accepted-live / checkpoint pending', 'checkpoint-confirmed') });
    }
    for (const [id, status] of Object.entries(gmStatus)) {
      if (status.phase === 'accepted' && Number.isSafeInteger(status.checkpointRevision) && status.checkpointRevision > 0 && status.checkpointRevision <= value.confirmedRevision && !status.message.includes('checkpoint-confirmed')) {
        setGm(id, { message: 'Accepted · checkpoint-confirmed' });
      }
    }
  };
  socket.on('actor_spell_pending', pending); socket.on('actor_spell_closed', closed); socket.on('actor_consequence_accepted', accepted); socket.on('room_save_status', saved);
  return () => { socket.off('actor_spell_pending', pending); socket.off('actor_spell_closed', closed); socket.off('actor_consequence_accepted', accepted); socket.off('room_save_status', saved); };
}
