/** P13B-W private collection custody/status. No automatic retry, payment, roll or consequence path. */
import { create } from 'zustand';
import { getStore } from '../store/storeRegistry';
import { captureActorDelivery, currentActorDelivery } from './actorProjectionOrder';
import { requestActorEvent } from './actorConsequenceService';
import { getBootstrapGateState, isPrivateProjectionIsolated, subscribeBootstrapGate } from '../persistence/bootstrapPrivacyGate';
import { isSocketRetired } from '../persistence/handoff/socketPrincipalRetirement';
import { onRoomRejoined } from './roomRejoinBus';
import { emptyNarration, narrationReducer } from '../components/combat-narration-preview/narrationQueue';

const initial = () => ({ principal: null, epoch: null, sequence: -1, windows: [], pending: null, interrupted: [], status: '', narration: emptyNarration() });
export const useReactionWindowStore = create(initial);
const retiredEpochs = new Set();
let bindingGeneration = 0, requestOrder = 0, acceptedOrder = 0, lane = null;
const game = () => getStore('gameStore')?.getState() || {};
const characterId = () => getStore('characterStore')?.getState().currentCharacterId;
export const reactionPrincipal = () => JSON.stringify([getStore('authStore')?.getState().user?.uid,
  getBootstrapGateState().accountGeneration, game().multiplayerRoom?.id, characterId(), game().isGMMode === true]);
function presentationReset() { useReactionWindowStore.setState({ ...initial(), pending: lane?.pending || null, interrupted: lane?.interrupted || [] }); }
export function resetReactionWindows() { bindingGeneration += 1; lane = null; retiredEpochs.clear(); presentationReset(); }
function retainPending(pending) { if (lane) lane.pending = pending; useReactionWindowStore.setState({ pending }); }
function narrate(id, phase, text, historical = false) {
  useReactionWindowStore.setState(s => ({ narration: narrationReducer(s.narration,
    { type: historical ? 'history' : 'publish', events: [{ id, phase, text, ...(phase === 'unresolved' ? { certainty: 'unknown' } : {}) }] }) }));
}
export const advanceWindowNarration = () => useReactionWindowStore.setState(s => ({ narration: narrationReducer(s.narration, { type: 'advance' }) }));
function accept(result, { historical = false, order, sentAt } = {}) {
  if (!result?.success || !Array.isArray(result.windows) || !Number.isSafeInteger(result.sequence)) return;
  if (order < acceptedOrder) return;
  if (result.viewerRole !== (game().isGMMode === true ? 'gm' : 'owner')) {
    useReactionWindowStore.setState({ windows: [], status: 'Collection unavailable in this view — use the authenticated room role.' }); return;
  }
  const old = useReactionWindowStore.getState();
  if (retiredEpochs.has(result.epoch) || (old.epoch === result.epoch && result.sequence <= old.sequence)) return;
  const changedEpoch = old.epoch && old.epoch !== result.epoch;
  if (changedEpoch) retiredEpochs.add(old.epoch);
  acceptedOrder = order;
  const vanished = old.windows.some(w => !result.windows.some(next => next.windowId === w.windowId));
  const recorded = old.pending && result.windows.some(w => w.openRequestId === old.pending.payload.requestId ||
    w.intents?.some(i => i.history.some(h => h.requestId === old.pending.payload.requestId)));
  if (recorded) retainPending(null);
  const retiredPending = lane?.pending?.payload.epoch && lane.pending.payload.epoch !== result.epoch;
  const missingPending = lane?.pending?.payload.windowId && !result.windows.some(w => w.windowId === lane.pending.payload.windowId);
  if ((retiredPending || missingPending) && lane.interrupted.length < 64) {
    // A verified new epoch cannot reconcile the old live-only record. Retain exact private evidence
    // for GM manual takeover, but do not let that unavailable request occupy the new collection lane.
    lane.interrupted = [...lane.interrupted, { request: lane.pending, reason: 'Previous collection unavailable — GM manual takeover' }];
    retainPending(null);
  }
  const receivedAt = performance.now(), roundTrip = Math.max(0, receivedAt - sentAt);
  // Conservative transit bound: never show a late snapshot's full remaining time. At zero ask the
  // server again; only the server closes collection. No network delay grants extra admission time.
  useReactionWindowStore.setState({ epoch: result.epoch, sequence: result.sequence, windows: result.windows.map(w =>
    ({ ...w, remainingMs: Math.max(0, w.remainingMs - roundTrip), receivedAt })),
    interrupted: lane?.interrupted || [],
    status: changedEpoch || vanished || retiredPending || missingPending ? 'Collection unavailable after runtime/binding change — exact private evidence retained for manual GM takeover.' : '' });
  for (const w of result.windows) {
    const previous = !changedEpoch && old.windows.find(p => p.windowId === w.windowId);
    if (previous?.status === w.status) continue;
    const phase = w.status === 'open' ? 'opportunity' : w.status === 'closed' ? 'response' : 'unresolved';
    const text = w.status === 'open' ? `Eight-second ${w.moment.replace(/_/g, ' ')} declaration opportunity. Silence is allowed.` :
      w.status === 'closed' ? 'Collection closed. GM manual adjudication required; no execution or payment confirmed.' :
        'Collection interrupted or unavailable. Manual GM takeover required; no cancellation or refund is implied.';
    narrate(`${result.epoch}:${w.windowId}:${w.status}`, phase, text, historical);
  }
}
async function readOrSend(event, payload, historical = false) {
  const context = captureActorDelivery(), selected = characterId(), gm = game().isGMMode;
  const generation = bindingGeneration, principal = reactionPrincipal(), order = ++requestOrder, sentAt = performance.now();
  if (!currentActorDelivery(context, context.roomId) || !context.socket.connected || isPrivateProjectionIsolated())
    return { success: false, code: 'window_connection_unavailable' };
  const result = await requestActorEvent(event, payload);
  if (generation !== bindingGeneration || principal !== reactionPrincipal() || !currentActorDelivery(context, context.roomId) || selected !== characterId() || gm !== game().isGMMode || isPrivateProjectionIsolated())
    return { success: false, code: 'retired_principal' };
  if (order < acceptedOrder) return { success: false, code: 'stale_window_reply' };
  if (!result?.success) acceptedOrder = order;
  accept(result, { historical, order, sentAt });
  return result;
}
export async function refreshReactionWindows(historical = true) {
  const result = await readOrSend('reaction_window_list', { roomId: game().multiplayerRoom?.id }, historical);
  if (!result.success && !['retired_principal', 'stale_window_reply'].includes(result.code)) useReactionWindowStore.setState({ windows: [], status: 'Collection unavailable — check status or use GM manual takeover.' });
  return result;
}
async function sendPending() {
  const pending = useReactionWindowStore.getState().pending;
  if (!pending) return refreshReactionWindows();
  const context = captureActorDelivery(), selected = characterId(), gm = game().isGMMode;
  const generation = bindingGeneration, principal = reactionPrincipal();
  const current = () => generation === bindingGeneration && principal === reactionPrincipal() &&
    (!lane?.pending || lane.pending === pending) && currentActorDelivery(context, context.roomId) && selected === characterId() && gm === game().isGMMode;
  const result = await readOrSend(pending.event, pending.payload);
  if (['retired_principal', 'stale_window_reply'].includes(result.code) || !current()) return { success: false, code: 'retired_principal' };
  if (!result.success && lane?.pending !== pending) return result; // A status read already reconciled this request.
  if (result.success) {
    retainPending(null);
    useReactionWindowStore.setState({ status: 'Collection record confirmed. Execution/payment not confirmed.' });
    if (pending.event === 'reaction_window_change') narrate(pending.payload.requestId, 'declaration',
      pending.payload.withdrawn ? 'Private withdrawal recorded for collection only; payment remains GM-adjudicated.' :
        'Private declaration recorded. Nothing reserved or executed; payment remains GM-adjudicated.');
  } else if (['outcome_unknown', 'room_connection_unavailable', 'window_connection_unavailable', 'window_unavailable'].includes(result.code)) {
    useReactionWindowStore.setState({ status: 'Collection acknowledgement unknown/unavailable. Exact request retained for manual checking; reconnect never resubmits.' });
  } else {
    retainPending(null);
    await refreshReactionWindows();
    if (current()) useReactionWindowStore.setState({ status: `Collection request refused (${result.code}). After cutoff, request GM handling.` });
  }
  return result;
}
async function submit(event, body) {
  if (useReactionWindowStore.getState().pending) throw Error('Check the pending collection request first.');
  const payload = { ...body, roomId: game().multiplayerRoom?.id, requestId: crypto.randomUUID() };
  retainPending({ event, payload });
  useReactionWindowStore.setState({ status: 'Recording private collection intent…' });
  return sendPending();
}
export const retryWindowRequest = sendPending;
export const openReactionWindow = body => submit('reaction_window_open', { ...body, epoch: useReactionWindowStore.getState().epoch });
export const changeReactionIntent = (window, { cardKey, label, note, withdrawn = false }) => submit('reaction_window_change', {
  epoch: window.epoch, windowId: window.windowId, reactor: window.reactor, cardKey, label, note, withdrawn,
  expectedRevision: window.intents.find(i => i.cardKey === cardKey)?.revision || 0
});
export const interruptReactionWindow = window => submit('reaction_window_interrupt', { windowId: window.windowId, epoch: window.epoch });
export function bindReactionWindows(socket) {
  const principal = reactionPrincipal();
  if (!lane || lane.principal !== principal) { lane = { principal, pending: null, interrupted: [] }; retiredEpochs.clear(); }
  let generation = ++bindingGeneration;
  requestOrder = 0; acceptedOrder = 0; presentationReset();
  useReactionWindowStore.setState({ principal: reactionPrincipal() });
  const registration = captureActorDelivery(socket), selected = characterId(), gm = game().isGMMode;
  const current = () => generation === bindingGeneration && socket === game().multiplayerSocket && !isSocketRetired(socket) &&
    registration.uid === getStore('authStore')?.getState().user?.uid &&
    registration.generation === getBootstrapGateState().accountGeneration && registration.roomId === game().multiplayerRoom?.id && selected === characterId() && gm === game().isGMMode;
  const refresh = event => { if (current() && (!event || event.roomId === registration.roomId) && !isPrivateProjectionIsolated()) refreshReactionWindows(false); };
  const disconnect = () => { if (current()) useReactionWindowStore.setState({ windows: [], status: 'Disconnected — collection deadline continues. Reconnect checks the same window.' }); };
  socket.on('reaction_window_changed', refresh); socket.on('disconnect', disconnect);
  const rejoin = onRoomRejoined(event => { if (event.socket === socket) refresh(event); });
  const gate = subscribeBootstrapGate(() => {
    if (principal !== reactionPrincipal()) { resetReactionWindows(); return; }
    if (generation !== bindingGeneration) return;
    generation = ++bindingGeneration;
    if (isPrivateProjectionIsolated()) presentationReset();
    else { useReactionWindowStore.setState({ principal, pending: lane?.pending || null }); refreshReactionWindows(); }
  });
  refreshReactionWindows();
  return () => {
    socket.off('reaction_window_changed', refresh); socket.off('disconnect', disconnect); rejoin(); gate();
    if (generation === bindingGeneration) {
      bindingGeneration += 1;
      if (principal !== reactionPrincipal()) { lane = null; retiredEpochs.clear(); }
      presentationReset();
    }
  };
}
