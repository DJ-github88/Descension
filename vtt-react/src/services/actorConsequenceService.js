/** P7 client projection/command boundary. Stores remain projections of room
 * acceptance; this module performs no dice, class-price or initiative rules. */
import { getStore } from '../store/storeRegistry';
import { getBootstrapGateState } from '../persistence/bootstrapPrivacyGate';
import { isSocketRetired } from '../persistence/handoff/socketPrincipalRetirement';

const pools = { hp: ['currentHp', 'health', 'tempHealth'], mana: ['currentMana', 'mana', 'tempMana'], ap: ['currentActionPoints', 'actionPoints', 'tempActionPoints'] };
const protectedKeys = new Set(['currentHp', 'currentMana', 'currentActionPoints', 'tempHealth', 'tempMana', 'tempActionPoints', 'conditions', 'health', 'mana', 'actionPoints']);
const refKeys = ['kind', 'roomId', 'mapId', 'tokenId', 'instanceId', 'ownerUid', 'characterId'];
const clone = value => JSON.parse(JSON.stringify(value));
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const sameRef = (a, b) => !!a && !!b && refKeys.every(key => a[key] === b[key]);
let active = null;
let admission = null;
const pending = new Map();
const origins = new Map();
const state = () => getStore('gameStore')?.getState() || {};
export const inSharedRoom = () => state().isInMultiplayer === true;
const status = result => { getStore('gameStore').setState({ actorConsequenceStatus: result }); return result; };
const error = code => status({ success: false, code, error: code.replace(/_/g, ' ') });
export const refOf = token => {
  const binding = token?.state?.actorContract;
  return binding?.version === 1 ? Object.fromEntries(refKeys.filter(key => binding[key] !== undefined).map(key => [key, binding[key]])) : null;
};
const tokens = () => [
  ...(getStore('creatureStore')?.getState().creatureTokens || []),
  ...(getStore('characterTokenStore')?.getState().characterTokens || [])
];
export function findActor(target) {
  if (target?.kind && target?.instanceId) return tokens().find(token => sameRef(refOf(token), target)) || null;
  if (['player', 'current-player', 'local_player', 'local-player'].includes(target)) return matchingActive()?.token || null;
  const exact = tokens().filter(token => token.id === (target?.tokenId || target?.id || target));
  if (exact.length === 1) return exact[0];
  // Local party alias resolution requires owner AND canonical character AND primary.
  const member = typeof target === 'object' ? target : getStore('partyStore').getState().partyMembers.find(value => value.id === target);
  if (!member?.userId || !member.character?.id) return null;
  const candidates = tokens().filter(token => token.state?.actorContract?.primary && token.ownerUserId === member.userId && token.character?.id === member.character.id);
  return candidates.length === 1 ? candidates[0] : null;
}
function matchingActive() {
  const game = state();
  if (!active || !game.isInMultiplayer) return null;
  const gate = getBootstrapGateState();
  const character = getStore('characterStore').getState();
  const uid = getStore('authStore').getState().user?.uid;
  if (!active || !game.isInMultiplayer || active.ref.roomId !== game.multiplayerRoom?.id || active.ref.ownerUid !== uid ||
    active.ref.characterId !== character.currentCharacterId || active.accountGeneration !== gate.accountGeneration) return null;
  const token = tokens().find(value => sameRef(refOf(value), active.ref) && value.state.actorContract.primary);
  return token ? { ...active, token } : null;
}
export function selectOwnerAttachment(ref) {
  const token = findActor(ref);
  const gate = getBootstrapGateState();
  if (!token || ref.kind !== 'character' || !token.state.actorContract.primary || ref.roomId !== state().multiplayerRoom?.id ||
    ref.ownerUid !== getStore('authStore').getState().user?.uid || ref.characterId !== getStore('characterStore').getState().currentCharacterId) return error('actor_binding_conflict');
  active = { ref: clone(ref), accountGeneration: gate.accountGeneration };
  reconcileOwner();
  return status({ success: true, code: 'active_attachment_selected', ref });
}
export function roomResourceProjection() {
  const match = matchingActive();
  if (!match) return null;
  const fields = ['health', 'mana', 'actionPoints', 'tempHealth', 'tempMana', 'tempActionPoints'];
  return { ...Object.fromEntries(fields.filter(key => match.token.character[key] !== undefined).map(key => [key, clone(match.token.character[key])])),
    roomActorProjection: { ref: match.ref, revision: match.token.state.actorContract.revision, accountGeneration: match.accountGeneration } };
}
export function projectPersonalRuntime(data, preserve = true) {
  if (!data) return data;
  const uid = getStore('authStore').getState().user?.uid;
  const characterId = getStore('characterStore').getState().currentCharacterId;
  const belongs = record => {
    if (record.target?.roomId) return record.target.kind === 'character' && record.target.ownerUid === uid && record.target.characterId === characterId &&
      (!inSharedRoom() || (record.target.roomId === state().multiplayerRoom?.id && !!findActor(record.target)));
    if (record.ownerUid || record.characterId) return record.ownerUid === uid && record.characterId === characterId;
    if (record.targetId === characterId && record.targetType === 'character') return true;
    return !inSharedRoom() && ['player', 'current-player', 'local-player', 'local_player'].includes(record.targetId);
  };
  const scoped = { ...data };
  for (const key of ['buffs', 'debuffs']) if (Array.isArray(data[key])) scoped[key] = data[key].filter(belongs);
  if (Array.isArray(data.roomActorRecoveryCandidates)) scoped.roomActorRecoveryCandidates = data.roomActorRecoveryCandidates.filter(candidate => candidate.ownerUid === uid && candidate.characterId === characterId);
  if (data.roomActorProjection && (data.roomActorProjection.ref?.ownerUid !== uid || data.roomActorProjection.ref?.characterId !== characterId)) delete scoped.roomActorProjection;
  const ambiguous = ['buffs', 'debuffs'].flatMap(key => (data[key] || []).filter(record => !belongs(record) && !record.target?.roomId));
  if (ambiguous.length) {
    // Original bytes stay manual/recovery data outside the executable payload.
    // Observation context is not proof of selected-character ownership.
    const game = getStore('gameStore'), prior = game.getState().personalConditionRecoveryCandidates || [];
    const candidate = { observedOwnerUid: uid, observedCharacterId: characterId, records: clone(ambiguous) };
    if (!prior.some(value => same(value, candidate))) {
      if (prior.length >= 8) throw new Error('Condition recovery capacity reached; personal application refused');
      game.setState({ personalConditionRecoveryCandidates: [...prior, candidate] });
    }
  }
  const match = matchingActive();
  if (!match) return scoped;
  const projection = roomResourceProjection();
  const records = match.token.state.conditions || [];
  const result = { ...scoped, ...projection };
  for (const [key, type] of [['buffs', 'buff'], ['debuffs', 'debuff']]) result[key] = [
    ...(scoped[key] || []).filter(record => !record.target?.roomId), ...records.filter(record => record.type === type)
  ];
  if (preserve && !same({ ...data, roomActorRecoveryCandidates: undefined }, { ...result, roomActorRecoveryCandidates: undefined })) {
    const store = getStore('characterStore');
    const prior = store.getState().roomActorRecoveryCandidates || [];
    const candidate = { ownerUid: match.ref.ownerUid, characterId: match.ref.characterId, ref: match.ref, data: clone(data) };
    if (!prior.some(value => same(value, candidate))) {
      // Refuse replacement rather than discard a recovery candidate at the bound.
      if (prior.length >= 8) throw new Error('Room reconciliation candidate capacity reached; personal application refused');
      store.setState({ roomActorRecoveryCandidates: [...prior, candidate] });
    }
  }
  return result;
}
export function reconcileOwner() {
  const match = matchingActive();
  if (!match) return;
  const projection = roomResourceProjection();
  const store = getStore('characterStore');
  if (Object.entries(projection).some(([key, value]) => !same(store.getState()[key], value))) store.setState(projection);
}
function request(event, payload) {
  const game = state(), socket = game.multiplayerSocket;
  if (!socket?.connected || isSocketRetired(socket)) return Promise.resolve(error('room_connection_unavailable'));
  const roomId = game.multiplayerRoom?.id, generation = getBootstrapGateState().accountGeneration;
  return new Promise(resolve => {
    const timer = setTimeout(() => resolve(error('outcome_unknown')), 5000);
    socket.emit(event, payload, result => {
      clearTimeout(timer);
      if (state().multiplayerSocket !== socket || state().multiplayerRoom?.id !== roomId || getBootstrapGateState().accountGeneration !== generation || isSocketRetired(socket)) {
        resolve({ success: false, code: 'retired_principal' }); return;
      }
      resolve(result);
    });
  });
}
export async function refreshActorSnapshot() {
  const result = await request('actor_snapshot', { roomId: state().multiplayerRoom?.id });
  if (result.success) {
    const validation = validateActorSnapshot(result.maps);
    if (!validation.ok) {
      getStore('gameStore').setState({ actorRecoverySnapshot: { result, uid: getStore('authStore').getState().user?.uid,
         accountGeneration: getBootstrapGateState().accountGeneration, readOnly: validation.code === 'actor_binding_metadata_missing', reason: validation.code } });
      return error('actor_reconciliation_required');
    }
    admission = { roomId: result.roomId, actionEpoch: result.actionEpoch, commitSequence: result.commitSequence, replayFloor: result.replayFloor };
    replaceActorSnapshot(result);
  }
  return result;
}
function replaceActorSnapshot(result) {
  const creatures = [], characters = [];
  for (const [mapId, map] of Object.entries(result.maps || {})) {
    for (const token of Object.values(map.tokens || {})) creatures.push({ ...token, mapId });
    for (const token of Object.values(map.creatures || {})) if (!map.tokens?.[token.id]) creatures.push({ ...token, mapId });
    for (const token of Object.values(map.characterTokens || {})) characters.push({ ...token, mapId });
  }
  getStore('creatureStore').setState({ creatureTokens: creatures, tokens: creatures });
  getStore('characterTokenStore').setState({ characterTokens: characters });
  getStore('mapStore').setState(current => ({ maps: current.maps.map(map => ({ ...map,
    tokens: result.maps?.[map.id]?.tokens || {}, characterTokens: result.maps?.[map.id]?.characterTokens || {} })) }));
  hydrateActorConditions();
}
export function acceptRecoveredActorSnapshot() {
  const recovery = state().actorRecoverySnapshot;
  if (!recovery || recovery.uid !== getStore('authStore').getState().user?.uid || recovery.accountGeneration !== getBootstrapGateState().accountGeneration ||
     recovery.result.roomId !== state().multiplayerRoom?.id) return error('retired_principal');
  if (recovery.readOnly) return error('legacy_reconciliation_required');
  const match = matchingActive();
  if (match) {
    const store = getStore('characterStore'), prior = store.getState().roomActorRecoveryCandidates || [];
    if (prior.length >= 8) return error('candidate_capacity');
    store.setState({ roomActorRecoveryCandidates: [...prior, { ownerUid: match.ref.ownerUid, characterId: match.ref.characterId, ref: match.ref,
      reason: 'explicit-room-checkpoint-reconciliation', data: roomResourceProjection() }] });
  }
  const result = recovery.result;
  admission = { roomId: result.roomId, actionEpoch: result.actionEpoch, commitSequence: result.commitSequence, replayFloor: result.replayFloor };
  replaceActorSnapshot(result);
  getStore('gameStore').setState({ actorRecoverySnapshot: null });
  return status({ success: true, code: 'room_projection_reconciled' });
}
export async function bindActor(tokenId, kind, options = {}) {
  const snapshot = await refreshActorSnapshot();
  if (!snapshot.success) return status(snapshot);
  const mapId = getStore('mapStore').getState().currentMapId;
  const field = kind === 'character' ? 'characterTokens' : 'tokens';
  const token = snapshot.maps?.[mapId]?.[field]?.[tokenId] || (kind === 'creature' ? snapshot.maps?.[mapId]?.creatures?.[tokenId] : null);
  const fingerprint = snapshot.bindings?.find(value => value.mapId === mapId && value.tokenId === tokenId && value.kind === kind);
  if (!token || !fingerprint) return error('actor_not_found');
  const ref = { kind, roomId: snapshot.roomId, mapId, tokenId,
    ...(kind === 'character' ? { ownerUid: token.ownerUserId, characterId: token.character?.id } : {}) };
  const result = await request('actor_bind', { roomId: snapshot.roomId, ref, snapshotHash: fingerprint.snapshotHash, ...options });
  if (result.success) applyBoundActor(result);
  return status(result);
}
export function applyBoundActor(payload) {
  if (payload.roomId !== state().multiplayerRoom?.id || !payload.token) return false;
  for (const invalidated of payload.invalidated || []) applyBoundActor(invalidated);
  const kind = payload.ref?.kind || payload.kind || (payload.token.character ? 'character' : 'creature');
  const store = getStore(kind === 'character' ? 'characterTokenStore' : 'creatureStore');
  const key = kind === 'character' ? 'characterTokens' : 'creatureTokens';
  const existing = store.getState()[key] || [];
  const prior = existing.find(token => token.id === payload.token.id && (token.mapId || payload.mapId) === payload.mapId);
  const merged = { ...prior, ...payload.token, mapId: payload.mapId };
  const next = prior ? existing.map(token => token === prior ? merged : token) : [...existing, merged];
  store.setState({ [key]: next, ...(kind === 'creature' ? { tokens: next } : {}) });
  getStore('mapStore').setState(current => ({ maps: current.maps.map(map => map.id === payload.mapId ? { ...map,
    [kind === 'character' ? 'characterTokens' : 'tokens']: { ...map[kind === 'character' ? 'characterTokens' : 'tokens'], [merged.id]: merged } } : map) }));
  reconcileOwner(); return true;
}
export function applyAcceptedConsequence(result) {
  const receipt = result?.receipt;
  if (!receipt || receipt.version !== 1 || receipt.roomId !== state().multiplayerRoom?.id || !Array.isArray(receipt.actors)) return false;
  if (admission?.roomId === receipt.roomId && receipt.admissionEpoch !== admission.actionEpoch) {
    if (receipt.commitSequence <= admission.commitSequence) {
      pending.delete(receipt.commandId); origins.delete(receipt.commandId);
      status({ ...result, historical: true }); return true;
    }
    status({ success: false, code: 'snapshot_required' }); return false;
  }
  const staged = [];
  for (const actor of receipt.actors) {
    const token = findActor(actor.ref);
    if (!token) {
      if (admission?.roomId === receipt.roomId && receipt.commitSequence <= admission.commitSequence) continue;
      status({ success: false, code: 'snapshot_required' }); return false;
    }
    const revision = token.state.actorContract.revision;
    if (revision > actor.afterRevision) continue; // historical receipt cannot roll back
    if (revision < actor.beforeRevision) {status({ success: false, code: 'snapshot_required' }); return false;}
    const next = { ...token, state: { ...token.state, actorContract: { ...token.state.actorContract, revision: actor.afterRevision }, conditions: clone(actor.conditions) } };
    if (actor.ref.kind === 'character') next.character = { ...token.character };
    for (const [pool, [stateKey, pcKey, tempKey]] of Object.entries(pools)) {
      const values = actor.finalResources[pool];
      if (!values || ![values.current, values.temp, values.max].every(Number.isFinite)) return false;
      if (actor.ref.kind === 'character') {
        next.character[pcKey] = { ...token.character[pcKey], current: values.current, max: values.max };
        next.character[tempKey] = values.temp;
      } else {next.state[stateKey] = values.current; next.state[tempKey] = values.temp;}
    }
    if (revision === actor.afterRevision && !same(next, token)) {status({ success: false, code: 'actor_projection_conflict' }); return false;}
    staged.push({ actor, token, next });
  }
  // No await or gameplay mutator between the actor publications.
  for (const kind of ['creature', 'character']) {
    const selected = staged.filter(value => value.actor.ref.kind === kind);
    if (!selected.length) continue;
    const store = getStore(kind === 'creature' ? 'creatureStore' : 'characterTokenStore');
    const key = kind === 'creature' ? 'creatureTokens' : 'characterTokens';
    const next = store.getState()[key].map(token => selected.find(value => value.token === token)?.next || token);
    store.setState({ [key]: next, ...(kind === 'creature' ? { tokens: next } : {}) });
  }
  const conditionStore = getStore('conditionStore');
  getStore('mapStore').setState(current => ({ maps: current.maps.map(map => {
    const local = staged.filter(value => value.actor.ref.mapId === map.id);
    if (!local.length) return map;
    const next = { ...map };
    for (const value of local) {
      const field = value.actor.ref.kind === 'character' ? 'characterTokens' : 'tokens';
      next[field] = { ...next[field], [value.actor.ref.tokenId]: value.next };
    }
    return next;
  }) }));
  const all = tokens().flatMap(token => (token.state?.conditions || []).filter(record => record.recordId && record.target));
  conditionStore.setState({ activeBuffs: all.filter(record => record.type === 'buff'), activeDebuffs: all.filter(record => record.type === 'debuff') });
  const party = getStore('partyStore');
  party.setState(current => ({ partyMembers: current.partyMembers.map(member => {
    const match = staged.find(value => value.actor.ref.kind === 'character' &&
      ((member.userId === value.actor.ref.ownerUid && member.character?.id === value.actor.ref.characterId) ||
        (member.id === 'current-player' && matchingActive() && sameRef(active.ref, value.actor.ref))));
    return match ? { ...member, character: { ...member.character, ...match.next.character } } : member;
  }) }));
  const combat = getStore('combatStore') || require('../store/combatStore').default;
  combat.setState(current => ({ turnOrder: current.turnOrder.map(combatant => {
    const match = staged.find(value => sameRef(combatant.actorRef, value.actor.ref));
    return match ? { ...combatant, currentActionPoints: match.actor.finalResources.ap.current, currentHp: match.actor.finalResources.hp.current, currentMana: match.actor.finalResources.mana.current, resourceConsequenceStatus: 'applied' } : combatant;
  }) }));
  reconcileOwner();
  if (admission?.roomId === receipt.roomId) admission.commitSequence = Math.max(admission.commitSequence, receipt.commitSequence);
  if (matchingActive() && staged.some(value => sameRef(value.actor.ref, active.ref))) {
    const store = getStore('characterStore');
    require('../store/characterHelpers').triggerCharacterAutoSave(() => store.getState().saveCurrentCharacter());
  }
  pending.delete(receipt.commandId); origins.delete(receipt.commandId); status({ ...result, historical: staged.length === 0 }); return true;
}
export async function submitActorEntries(entries, extra = {}) {
  {
    const snapshot = await refreshActorSnapshot();
    if (!snapshot.success) return status(snapshot);
  }
  const command = { version: 1, roomId: admission.roomId, commandId: crypto.randomUUID(), actionEpoch: admission.actionEpoch,
    baseCommitSequence: admission.commitSequence, actors: clone(entries), ...extra };
  if (pending.size >= 32) return error('command_capacity');
  pending.set(command.commandId, command);
  origins.set(command.commandId, { uid: getStore('authStore').getState().user?.uid, accountGeneration: getBootstrapGateState().accountGeneration, roomId: command.roomId });
  return retryActorCommand(command.commandId);
}
export async function retryActorCommand(commandId) {
  const command = pending.get(commandId);
  if (!command) return error('outcome_unknown');
  const origin = origins.get(commandId);
  if (!origin || origin.uid !== getStore('authStore').getState().user?.uid || origin.accountGeneration !== getBootstrapGateState().accountGeneration || origin.roomId !== state().multiplayerRoom?.id) return error('retired_principal');
  const result = await request('actor_consequence', command);
  if (result.success && !applyAcceptedConsequence(result)) return status({ success: false, code: 'snapshot_required', commandId, acceptedReceipt: result.receipt, status: result.status });
  if (result.code === 'authorization_required') {
    const proposal = await request('actor_propose', command);
    return status({ ...proposal, commandId });
  }
  if (!result.success && !['outcome_unknown', 'room_connection_unavailable'].includes(result.code)) {
    pending.delete(commandId); origins.delete(commandId);
    return status(result);
  }
  return status({ ...result, commandId });
}
export function routeTokenState(tokenId, updates) {
  if (!inSharedRoom() || !Object.keys(updates || {}).some(key => protectedKeys.has(key))) return false;
  const token = findActor(tokenId), ref = refOf(token);
  if (!ref) {error('binding_required'); return true;}
  const finalResources = {};
  for (const [pool, [stateKey, , tempKey]] of Object.entries(pools)) {
    if (updates[stateKey] !== undefined || updates[tempKey] !== undefined) finalResources[pool] = {
      current: updates[stateKey] ?? token.state[stateKey], temp: updates[tempKey] ?? token.state[tempKey] ?? 0 };
  }
  const operations = [];
  if (updates.conditions) {
    const before = token.state.conditions || [], after = updates.conditions;
    for (const record of before) if (!after.some(value => value.id === record.id)) operations.push({ op: 'remove', recordId: record.recordId || record.id });
    for (const raw of after) {
      const record = roomCondition(raw, ref);
      const old = before.find(value => value.id === record.id);
      if (!old || !same(old, record)) operations.push({ op: old ? 'update' : 'add', recordId: record.id, record });
    }
  }
  submitActorEntries([{ ref, expectedRevision: token.state.actorContract.revision,
    ...(Object.keys(finalResources).length ? { finalResources } : {}), ...(operations.length ? { conditions: operations } : {}) }]);
  return true;
}
export function roomCondition(raw, ref) {
  const id = raw.recordId || raw.id || crypto.randomUUID();
  const aliases = { slow: 'slowed', slowed: 'slowed', haste: 'hastened', hasted: 'hastened', hastened: 'hastened', defend: 'defending', defending: 'defending' };
  const fields = ['icon', 'color', 'description', 'effectSummary', 'effects', 'source', 'sourceEntityId', 'effectOrigin', 'isMagical', 'duration', 'durationType', 'durationValue', 'remainingRounds', 'startTime', 'endTime', 'stackable', 'hasOverTimeEffect', 'overTimeType', 'overTimeFormula', 'overTimeElement', 'tickFrequency', 'tickFrequencyValue', 'tickFrequencyUnit', 'clockBoundary'];
  return { ...Object.fromEntries(fields.filter(key => raw[key] !== undefined).map(key => [key, raw[key]])), version: 1, id, recordId: id,
    name: raw.name, originalName: raw.originalName || raw.name, conditionKey: aliases[raw.name?.toLowerCase()] || raw.name?.toLowerCase(),
    type: ['buff', 'debuff'].includes(raw.type) ? raw.type : 'marker', kind: raw.kind || (raw.effects ? 'effect' : 'marker'),
     target: ref, targetId: ref.tokenId, targetType: ref.kind, source: raw.source === undefined ? 'manual' : raw.source,
     sharedTiming: 'manual', durationType: raw.durationType || 'manual' };
}
export function adjustSharedResource(target, resource, adjustment, asTemporary = false) {
  const token = findActor(target), ref = refOf(token), pool = { health: 'hp', mana: 'mana', actionPoints: 'ap' }[resource];
  if (!token || !ref || !pool) return Promise.resolve(error('binding_required'));
  const [stateKey, pcKey, tempKey] = pools[pool];
  const values = ref.kind === 'character' ? token.character : token.state;
  const current = ref.kind === 'character' ? values[pcKey].current : values[stateKey];
  const max = ref.kind === 'character' ? values[pcKey].max : (values[{ hp: 'maxHp', mana: 'maxMana', ap: 'maxAP' }[pool]] ?? token.stats?.[{ hp: 'maxHp', mana: 'maxMana', ap: 'maxAP' }[pool]] ?? token.stats?.maxActionPoints);
  const temp = values[tempKey] || 0;
  const finalTemp = adjustment < 0 ? Math.max(0, temp + adjustment) : temp + (asTemporary ? Math.max(0, current + adjustment - max) : 0);
  const finalCurrent = adjustment < 0 ? Math.max(0, current + Math.min(0, adjustment + temp)) : Math.min(max, current + adjustment);
  return submitActorEntries([{ ref, expectedRevision: token.state.actorContract.revision, finalResources: { [pool]: { current: finalCurrent, temp: finalTemp } } }]);
}
export function setSharedResourceTotals(target, restore) {
  const token = findActor(target), ref = refOf(token);
  if (!ref) return Promise.resolve(error('binding_required'));
  const values = ref.kind === 'character' ? token.character : token.state;
  const finalResources = {};
  for (const [pool, [, pcKey, tempKey]] of Object.entries(pools)) {
    const maxKey = { hp: 'maxHp', mana: 'maxMana', ap: 'maxAP' }[pool];
    const max = ref.kind === 'character' ? values[pcKey].max : values[maxKey];
    finalResources[pool] = { current: restore ? max : 0, temp: restore ? values[tempKey] || 0 : 0 };
  }
  return submitActorEntries([{ ref, expectedRevision: token.state.actorContract.revision, finalResources }]);
}
export function registerActorHandlers({ socket }) {
  if (!socket) return () => {};
  const accepted = async result => {
    if (isSocketRetired(socket) || state().multiplayerSocket !== socket) return;
    if (!applyAcceptedConsequence(result)) {
      const snapshot = await refreshActorSnapshot();
      if (snapshot.success && !isSocketRetired(socket) && state().multiplayerSocket === socket) applyAcceptedConsequence(result);
    }
  };
  const bound = result => { if (!isSocketRetired(socket) && state().multiplayerSocket === socket) applyBoundActor(result); };
  const proposal = value => { if (!isSocketRetired(socket) && state().multiplayerSocket === socket && value.command?.roomId === state().multiplayerRoom?.id) getStore('gameStore').setState({ pendingActorProposal: value }); };
  const confirmed = value => {
    if (isSocketRetired(socket) || state().multiplayerSocket !== socket || value.roomId !== state().multiplayerRoom?.id) return;
    const result = state().actorConsequenceStatus;
    if (result?.receipt && Number.isSafeInteger(result.receipt.checkpointRevision) && result.receipt.checkpointRevision > 0 && result.receipt.checkpointRevision <= value.confirmedRevision) status({ ...result, status: 'checkpoint-confirmed' });
  };
  socket.on('actor_consequence_accepted', accepted); socket.on('actor_bound', bound); socket.on('actor_proposal_pending', proposal);
  socket.on('room_save_status', confirmed);
  return () => {socket.off('actor_consequence_accepted', accepted); socket.off('actor_bound', bound); socket.off('actor_proposal_pending', proposal);socket.off('room_save_status', confirmed);};
}
export async function approvePendingActorProposal(proposal) {
  const result = await request('actor_adjudicate', { roomId: state().multiplayerRoom?.id, proposalId: proposal.proposalId, contentHash: proposal.contentHash });
  if (result.success) {applyAcceptedConsequence(result); getStore('gameStore').setState({ pendingActorProposal: null });}
  return status(result);
}
export function hydrateActorConditions() {
  if (!inSharedRoom()) return;
  const records = tokens().flatMap(token => (token.state?.conditions || []).filter(record => record.recordId && record.target));
  getStore('conditionStore').setState({ activeBuffs: records.filter(record => record.type === 'buff'), activeDebuffs: records.filter(record => record.type === 'debuff') });
  reconcileOwner();
}
export function validateActorSnapshot(maps, roomId = state().multiplayerRoom?.id) {
  if (!inSharedRoom()) return { ok: true };
  for (const [mapId, map] of Object.entries(maps || {})) {
    for (const field of ['tokens', 'characterTokens']) {
      for (const incoming of Object.values(map?.[field] || {})) {
        const ref = refOf(incoming);
        if (!ref) {
          const prior = tokens().find(token => token.id === incoming.id && refOf(token)?.roomId === roomId && refOf(token)?.mapId === mapId &&
            refOf(token)?.kind === (field === 'characterTokens' ? 'character' : 'creature'));
          if (prior) return { ok: false, code: 'actor_binding_metadata_missing' };
          continue;
        }
        if (ref.roomId !== roomId || ref.mapId !== mapId) return { ok: false, code: 'actor_binding_conflict' };
        const prior = findActor(ref);
        if (!prior) continue;
        const revision = incoming.state.actorContract.revision, current = prior.state.actorContract.revision;
        if (revision < current) return { ok: false, code: 'actor_projection_stale' };
        const protectedView = token => ({ values: ref.kind === 'character' ? Object.fromEntries(['health', 'mana', 'actionPoints', 'tempHealth', 'tempMana', 'tempActionPoints'].map(key => [key, token.character[key]]))
          : Object.fromEntries(['currentHp', 'currentMana', 'currentActionPoints', 'tempHealth', 'tempMana', 'tempActionPoints'].map(key => [key, token.state[key]])), conditions: token.state.conditions || [] });
        if (revision === current && !same(protectedView(incoming), protectedView(prior))) return { ok: false, code: 'actor_projection_conflict' };
      }
    }
  }
  return { ok: true };
}
