import { getStore } from '../store/storeRegistry';
import { getBootstrapGateState } from '../persistence/bootstrapPrivacyGate';
import { isSocketRetired } from '../persistence/handoff/socketPrincipalRetirement';

// Complete collection fences retain absence without per-deleted-token tombstones.
// Never evict a fence to make room: capacity failure is a visible refusal.
const rooms = new Map();
const game = () => getStore('gameStore')?.getState() || {};
const uid = () => getStore('authStore')?.getState().user?.uid;
export const captureActorDelivery = (socket = game().multiplayerSocket) => ({ socket, uid: uid(),
  generation: getBootstrapGateState().accountGeneration, roomId: game().multiplayerRoom?.id, room: game().multiplayerRoom });
export function currentActorDelivery(context, roomId) {
  return !!context?.uid && !!context.socket && context.socket === game().multiplayerSocket && !isSocketRetired(context.socket) &&
    context.uid === uid() && context.generation === getBootstrapGateState().accountGeneration &&
    context.room === game().multiplayerRoom && context.roomId === game().multiplayerRoom?.id && roomId === context.roomId;
}
const canonical = value => JSON.stringify(value, function(key, child) {
  return child && typeof child === 'object' && !Array.isArray(child)
    ? Object.fromEntries(Object.keys(child).sort().map(k => [k, child[k]])) : child;
});
const view = (token, field) => {
  if (!token) return null;
  const state = token.state || {};
  return { binding: state.actorContract || null, lifecycle: state.actorLifecycle || null,
    ownerUid: token.ownerUserId || null, characterId: field === 'characterTokens' ? token.character?.id : undefined,
    values: field === 'characterTokens' ? Object.fromEntries(['health', 'mana', 'actionPoints', 'tempHealth', 'tempMana', 'tempActionPoints'].map(k => [k, token.character?.[k]]))
      : Object.fromEntries(['currentHp', 'currentMana', 'currentActionPoints', 'tempHealth', 'tempMana', 'tempActionPoints', 'maxHp', 'maxMana', 'maxAP'].map(k => [k, state[k]])),
    conditions: state.conditions || [] };
};
const collection = (map, field) => map?.[field] || {};
const refused = code => ({ ok: false, code });
export function retainActorProjectionCandidate(result, reason, context = captureActorDelivery()) {
  const store = getStore('gameStore'), prior = store.getState().actorProjectionRecoveryCandidates || [];
  const candidate = { result: JSON.parse(JSON.stringify(result)), uid: context.uid, accountGeneration: context.generation,
    readOnly: reason !== 'actor_runtime_reconciliation_required', reason };
  if (reason === 'actor_runtime_reconciliation_required') {
    const fence = rooms.get(canonical([context.uid, context.generation, context.roomId]));
    candidate.previousProjection = JSON.parse(JSON.stringify({ epoch: fence?.epoch, roomCut: fence?.roomCut,
      collections: [...(fence?.collections || [])], maps: getStore('mapStore')?.getState().maps || [] }));
  }
  if (!prior.some(value => canonical(value) === canonical(candidate))) {
    if (prior.length >= 16) {
      store.setState({ actorConsequenceStatus: { success: false, code: 'actor_recovery_capacity' } });
      return false;
    }
    store.setState({ actorProjectionRecoveryCandidates: [...prior, candidate] });
  }
  store.setState({ actorRecoverySnapshot: candidate });
  return true;
}

export function prepareActorProjection(maps, options = {}) {
  if (!game().isInMultiplayer) return { ok: true, commit() {} };
  const scope = options.scope || 'room';
  const supplied = options.actorProjection || Object.values(maps || {}).find(map => map?.actorProjection)?.actorProjection;
  const roomId = supplied?.roomId;
  if (options.roomId && options.roomId !== roomId) return refused('actor_delivery_context');
  if (!currentActorDelivery(options.context || captureActorDelivery(), roomId)) return refused('actor_delivery_context');
  if (supplied?.version !== 1 || typeof supplied.epoch !== 'string' || !Number.isSafeInteger(supplied.cut) || supplied.cut < 0) return refused('actor_projection_order_missing');
  const key = canonical([uid(), getBootstrapGateState().accountGeneration, roomId]);
  const prior = rooms.get(key);
  const epochChange = prior && prior.epoch !== supplied.epoch;
  if ((!prior || epochChange) && !options.correlated) return refused('actor_projection_read_required');
  if (epochChange && !options.reconcileEpoch) return refused('actor_runtime_reconciliation_required');
  if (!prior && rooms.size >= 32) return refused('actor_projection_capacity');
  const next = epochChange || !prior ? { epoch: supplied.epoch, roomCut: -1, collections: new Map() } :
    { ...prior, collections: new Map(prior.collections) };
  const mapIds = new Set(Object.keys(maps || {}));
  if (scope === 'room') for (const k of next.collections.keys()) mapIds.add(JSON.parse(k)[0]);
  if (scope === 'room' && supplied.cut < next.roomCut) return refused('actor_projection_stale');
  for (const mapId of mapIds) for (const field of ['tokens', 'creatures', 'characterTokens']) {
    const map = maps?.[mapId];
    if (map?.id !== undefined && map.id !== mapId) return refused('actor_binding_conflict');
    if (map?.actorProjection && canonical(map.actorProjection) !== canonical(supplied)) return refused('actor_projection_order_conflict');
    if (scope === 'section' && map?.[field] === undefined) continue;
    const collectionKey = canonical([mapId, field]);
    const fence = next.collections.get(collectionKey);
    const high = Math.max(next.roomCut, fence?.cut ?? -1);
    if (supplied.cut < high) return refused('actor_projection_stale');
    const incoming = collection(map, field);
    // Fences cannot share nested objects with mutable display/store projections.
    const values = JSON.parse(JSON.stringify(Object.fromEntries(Object.entries(incoming).map(([id, token]) => [id, view(token, field)]))));
    if (supplied.cut === high && canonical(values) !== canonical(fence?.values || {})) return refused('actor_projection_conflict');
    for (const [id, token] of Object.entries(incoming)) {
      const binding = token.state?.actorContract, old = fence?.values[id]?.binding;
      if (token.id !== id) return refused('actor_binding_conflict');
      if (binding && (binding.version !== 1 || !Number.isSafeInteger(binding.revision) || binding.revision < 0 || !binding.instanceId ||
        (field === 'characterTokens' && (binding.ownerUid !== token.ownerUserId || binding.characterId !== token.character?.id || !binding.ownerUid || !binding.characterId)))) return refused('actor_binding_conflict');
      if (binding && (binding.roomId !== roomId || binding.mapId !== mapId || binding.tokenId !== id || binding.kind !== (field === 'characterTokens' ? 'character' : 'creature'))) return refused('actor_binding_conflict');
      if (old && !binding) {
        const birth = token.state?.actorLifecycle;
        if (birth?.roomId !== roomId || birth?.epoch !== supplied.epoch || birth.cut <= high || birth.cut > supplied.cut) return refused('actor_binding_metadata_missing');
      }
      if (old && binding?.instanceId === old.instanceId) {
        if (canonical({ ...binding, revision: undefined }) !== canonical({ ...old, revision: undefined }) ||
          values[id].ownerUid !== fence.values[id].ownerUid) return refused('actor_binding_conflict');
        if (binding.revision < old.revision) return refused('actor_projection_stale');
        if (binding.revision === old.revision && canonical(values[id]) !== canonical(fence.values[id])) return refused('actor_projection_conflict');
      }
    }
    if (!fence && next.collections.size >= 256) return refused('actor_projection_capacity');
    next.collections.set(collectionKey, { cut: supplied.cut, values });
  }
  if (scope === 'room') next.roomCut = supplied.cut;
  return { ok: true, epochChange, commit() { rooms.set(key, next); } };
}
