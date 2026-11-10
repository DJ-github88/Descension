/** Shared-room consumables: the stat-condition part of an item is applied only if the room confirms it.
 * In a shared room `conditionStore.addCondition` routes the record to the actor-consequence command and returns that
 * command's outcome promise; offline it returns nothing and applies the buff locally. This helper turns either into
 * { applied, code, message } so the caller consumes the item and applies its other effects only after a confirmation.
 * It adds no rule: the room's own refusal text is shown unchanged, and no item is exempted from any refusal. */
import { getStore } from '../store/storeRegistry';
import {
  retryActorCommand, findActor, refOf, routeTokenState, roomCondition, inSharedRoom,
  getPendingActorCommand, submitPreparedActorCommand, clearPendingActorCommandsForTests, roomResourceProjection,
  setCommandPreparedHook
} from './actorConsequenceService';
import { isDefending, isStunned } from './sharedConditionProfile';

export { findActor };

const ROOM_ERRORS = {
  binding_required: 'Your character is not attached to a token in this room, so the room cannot record the effect. Nothing was applied.',
  room_connection_unavailable: 'The room connection is unavailable. Nothing was applied.',
  outcome_unknown: 'The room did not confirm the effect in time, so it is not known whether it was recorded. Check the shared conditions before trying again.',
  retired_principal: 'The room session changed before the effect was confirmed. Check the shared conditions before trying again.',
  recovery_journal_unavailable: 'This browser could not store the recovery record required before the room is asked. Nothing was sent and the item is still in your pack. Free browser storage or allow site storage, then try again.',
  overheal_choice_required: 'A healing choice is needed before this use can be sent. Nothing was applied.'
};

/** One use of one item at a time. A second click while the first is still waiting for the room is ignored, so the
 * same item can never send two commands or be consumed twice. The key is shared by every entry point. */
const inFlight = new Set();
export const consumeKey = item => String(item?.originalItemId ?? item?.id ?? item?.name ?? '');
export async function withConsumeLock(key, run) {
  if (!key) return run();                       // nothing to key on: no lock, but also never a silent dead item
  if (inFlight.has(key)) return { locked: true };
  inFlight.add(key);
  try { return await run(); } finally { inFlight.delete(key); }
}

/** Items whose room conditions are confirmed or whose overheal choice is still open. Every entry point consults this
 * set, so opening the choice in one window cannot let another window send the same conditions again. */
const held = new Set();
export const isHeld = key => held.has(key);
export const markHeld = key => { if (key) held.add(key); return key; };
export const releaseHeld = key => { if (key) held.delete(key); };

const activeCharacterId = () => getStore('characterStore')?.getState?.()?.currentCharacterId || getStore('characterStore')?.getState?.()?.id || null;
const currentRoomId = () => getStore('gameStore')?.getState?.()?.multiplayerRoom?.id || null;
const currentOwnerUid = () => getStore('authStore')?.getState?.()?.user?.uid || null;
const currentPlayerId = () => getStore('gameStore')?.getState?.()?.currentPlayer?.id || null;
const currentActorInstanceId = charId => {
  const playerId = getStore('gameStore')?.getState?.()?.currentPlayer?.id;
  const token = (playerId ? findActor?.(playerId) : null)
    || findActor?.('player')
    || (charId ? findActor?.(charId) : null)
    || (getStore('characterTokenStore')?.getState?.()?.characterTokens || []).find(t =>
      !charId || t?.character?.id === charId || t?.state?.actorContract?.characterId === charId
    );
  return token?.state?.actorContract?.instanceId || null;
};

/** Plan instant resource updates (HP, mana, AP) from the authoritative resource source (fresh token.character when
 * supplied after actor_snapshot refresh, otherwise roomResourceProjection() or characterStore) so a mixed consumable
 * (condition + instant restore) submits finalResources and conditions in ONE atomic actor_consequence command.
 * When allowOverhealCap is false and a positive restore would exceed max (unless resolved in overhealModes),
 * overheal: true tells the caller an interactive overheal choice is needed before any room submission. */
export function planConsumableResources(item, { allowOverhealCap = false, overhealModes = null, sourceOverride = null } = {}) {
  if (!item) return { overheal: false, updates: null };
  const cs = item.combatStats || {};
  const rawVal = v => (typeof v === 'object' && v !== null ? Number(v.value) : Number(v)) || 0;
  const restores = [
    ['health', 'currentHp', 'tempHealth', rawVal(cs.healthRestore ?? item.healthRestore)],
    ['mana', 'currentMana', 'tempMana', rawVal(cs.manaRestore ?? item.manaRestore)],
    ['actionPoints', 'currentActionPoints', 'tempActionPoints', rawVal(cs.apRestore ?? cs.actionPointRestore ?? item.apRestore)]
  ];
  const charState = getStore('characterStore')?.getState?.() || {};
  const projected = roomResourceProjection?.() || null;
  const source = sourceOverride || projected || charState;
  const updates = {};
  const overhealPools = [];
  for (const [poolKey, stateKey, tempKey, delta] of restores) {
    if (!delta) continue;
    const pool = source?.[poolKey] || charState?.[poolKey];
    if (!pool) continue;
    const cur = Number(pool.current) || 0;
    const max = Number(pool.max) || 0;
    const temp = Number(source?.[tempKey] ?? charState?.[tempKey] ?? 0) || 0;
    const mode = overhealModes?.[poolKey] || (allowOverhealCap ? 'cap' : null);
    if (!mode && delta > 0 && (cur + delta > max || cur >= max)) {
      overhealPools.push({
        resourceType: poolKey,
        amount: delta,
        overhealAmount: Math.max(0, (cur + delta) - max),
        currentValue: cur,
        maxValue: max,
        currentTemp: temp
      });
      continue;
    }
    if (delta > 0 && mode === 'temp') {
      const overhealAmount = Math.max(0, (cur + delta) - max);
      updates[stateKey] = Math.max(0, Math.min(max, cur + delta));
      updates[tempKey] = temp + overhealAmount;
    } else {
      updates[stateKey] = Math.max(0, Math.min(max, cur + delta));
      updates[tempKey] = temp;
    }
  }
  if (overhealPools.length) return { overheal: true, updates: null, overhealPools };
  return { overheal: false, updates: Object.keys(updates).length ? updates : null };
}

/** True when the authoritative room resource projection is active and already reflects the planned finalResources. */
export function areResourcesProjected(resourceUpdates) {
  if (!resourceUpdates || !Object.keys(resourceUpdates).length) return false;
  const projected = roomResourceProjection?.();
  if (!projected) return false;
  const pairs = [
    ['currentHp', 'health', 'tempHealth'],
    ['currentMana', 'mana', 'tempMana'],
    ['currentActionPoints', 'actionPoints', 'tempActionPoints']
  ];
  for (const [stateKey, poolKey, tempKey] of pairs) {
    if (resourceUpdates[stateKey] !== undefined && projected[poolKey]?.current !== resourceUpdates[stateKey]) return false;
    if (resourceUpdates[tempKey] !== undefined && (projected[tempKey] ?? 0) !== resourceUpdates[tempKey]) return false;
  }
  return true;
}

const STORAGE_KEY = 'mythrill-vtt:unresolved-consumable-commands:v1';
const unresolved = new Map();
const historicalAccepted = [];

export const getHistoricalAcceptedForTests = () => [...historicalAccepted];

const COMPLETIONS_FIELD = 'consumableCommandCompletions';
const journalWarningShown = new Set();

class RecoveryJournalError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RecoveryJournalError';
    this.code = 'recovery_journal_unavailable';
  }
}

/** A failed recovery-journal write is visible: the player is told before a use is refused, or that an already
 * submitted use is uncertain and must not be retried as a fresh use. Storage errors never get reported as a refusal. */
function warnJournalFailure(reason, error, entry) {
  const signature = `${reason}:${error?.name || 'Error'}`;
  if (journalWarningShown.has(signature)) return;
  journalWarningShown.add(signature);
  const detail = error?.message ? ` (${error.message})` : '';
  if (reason === 'pre_submit') {
    postInventoryNotice(`The recovery record for this item use could not be saved in this browser, so nothing was sent.${detail}`);
  } else if (reason === 'cleanup') {
    postInventoryNotice(`The recovery record for this item use could not be updated in this browser. If this page reloads, an earlier attempt may stay held until it can be settled.${detail}`);
  } else {
    const name = entry?.name ? `${entry.name}: ` : '';
    postInventoryNotice(`${name}the room may have recorded this use, but this browser could not save the recovery record. Keep this page open and do not reload; a new attempt is blocked until the earlier use is settled.${detail}`);
  }
}

function persistUnresolved({ require = false, expectedCommandId = null, entry = null, reason = 'post_submit' } = {}) {
  if (typeof window === 'undefined' || !window.localStorage) {
    const error = new RecoveryJournalError('browser storage is unavailable');
    if (require) throw error;
    warnJournalFailure(reason, error, entry);
    return false;
  }
  try {
    const serialized = {};
    for (const [k, list] of unresolved.entries()) {
      const keep = (list || []).filter(e => !e.completed && e.actorInstanceId && (e.command || e.acceptedReceipt || e.outcome));
      if (keep.length) serialized[k] = keep;
    }
    if (Object.keys(serialized).length) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
    else window.localStorage.removeItem(STORAGE_KEY);
    if (require) {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : null;
      const found = parsed && typeof parsed === 'object' && Object.values(parsed).some(list =>
        Array.isArray(list) && list.some(value => !expectedCommandId || value.commandId === expectedCommandId));
      if (!found) throw new RecoveryJournalError('the recovery record could not be read back after writing');
    }
    return true;
  } catch (error) {
    const failure = error instanceof RecoveryJournalError ? error : new RecoveryJournalError(error?.message || 'storage write failed');
    if (require) throw failure;
    warnJournalFailure(reason, failure, entry);
    return false;
  }
}

const completionList = value => (Array.isArray(value) ? value : []);
const completionMatches = (commandId, characterId) => marker => !!marker && marker.commandId === commandId &&
  (!characterId || !marker.characterId || marker.characterId === characterId);

/** True when the exact item deduction for this command is already stored in the same character/inventory save that
 * carries the completed-command marker. A separately written flag is never accepted as proof. */
export function hasDurableCompletion(commandId, characterId) {
  if (!commandId) return false;
  const inventory = getStore('inventoryStore')?.getState?.();
  if (completionList(inventory?.[COMPLETIONS_FIELD]).some(completionMatches(commandId, characterId))) return true;
  const characterStore = getStore('characterStore')?.getState?.() || {};
  for (const character of (characterStore.characters || [])) {
    if (characterId && character.id !== characterId) continue;
    if (completionList(character?.inventory?.[COMPLETIONS_FIELD]).some(completionMatches(commandId, characterId))) return true;
  }
  if (characterId && (characterStore.currentCharacterId === characterId || characterStore.id === characterId)) {
    if (completionList(characterStore.inventory?.[COMPLETIONS_FIELD]).some(completionMatches(commandId, characterId))) return true;
  }
  return false;
}

function hydrateUnresolved(key) {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return;
    let dirty = false;
    const keys = key ? [key] : Object.keys(parsed);
    for (const k of keys) {
      const storedList = Array.isArray(parsed[k]) ? parsed[k] : [];
      if (!storedList.length) continue;
      const validStored = [];
      for (const entry of storedList) {
        const liveInstanceId = currentActorInstanceId(entry.characterId);
        if (liveInstanceId && entry.actorInstanceId && entry.actorInstanceId !== liveInstanceId) {
          if (entry.acceptedReceipt || entry.outcome?.success || entry.outcome?.status === 'accepted') {
            historicalAccepted.push({ ...entry, key: k, retiredReason: 'actor_incarnation_mismatch', retiredAt: Date.now() });
          }
          dirty = true;
          continue;
        }
        validStored.push(entry);
        const memList = unresolved.get(k) || [];
        if (!memList.some(m => m.commandId && m.commandId === entry.commandId)) {
          unresolved.set(k, [...memList, entry]);
        }
      }
      if (validStored.length !== storedList.length) {
        if (validStored.length) parsed[k] = validStored;
        else delete parsed[k];
      }
    }
    if (dirty) {
      if (Object.keys(parsed).length) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
      else window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch (_) { /* ignore malformed storage */ }
}

const matchesCharacterScope = (entry, targetChar) => !targetChar || !entry.characterId || entry.characterId === targetChar;

export const hasUnresolved = (key, characterId) => {
  hydrateUnresolved(key);
  const list = unresolved.get(key) || [];
  return list.some(entry => !entry.completed && matchesCharacterScope(entry, characterId));
};

const deriveResourceUpdates = (command, outcome, acceptedReceipt) => {
  const fr = command?.actors?.[0]?.finalResources
    || outcome?.receipt?.actors?.[0]?.finalResources
    || acceptedReceipt?.actors?.[0]?.finalResources
    || null;
  if (!fr) return null;
  const updates = {};
  if (fr.hp) { updates.currentHp = fr.hp.current; updates.tempHealth = fr.hp.temp ?? 0; }
  if (fr.mana) { updates.currentMana = fr.mana.current; updates.tempMana = fr.mana.temp ?? 0; }
  if (fr.ap) { updates.currentActionPoints = fr.ap.current; updates.tempActionPoints = fr.ap.temp ?? 0; }
  return Object.keys(updates).length ? updates : null;
};

const enrichEntry = entry => {
  const command = entry.command || getPendingActorCommand?.(entry.commandId) || null;
  const characterId = entry.characterId || activeCharacterId();
  const roomId = entry.roomId || command?.roomId || currentRoomId();
  const ownerUid = entry.ownerUid || currentOwnerUid();
  const actorInstanceId = entry.actorInstanceId
    || command?.actors?.[0]?.ref?.instanceId
    || entry.outcome?.receipt?.actors?.[0]?.ref?.instanceId
    || entry.acceptedReceipt?.actors?.[0]?.ref?.instanceId
    || currentActorInstanceId(characterId);
  const playerId = entry.playerId || currentPlayerId();
  const resourceUpdates = entry.resourceUpdates || deriveResourceUpdates(command, entry.outcome, entry.acceptedReceipt);
  return {
    ...entry,
    characterId,
    ...(entry.itemId ? { itemId: entry.itemId } : {}),
    ...(command ? { command } : {}),
    ...(roomId ? { roomId } : {}),
    ...(ownerUid ? { ownerUid } : {}),
    ...(playerId ? { playerId } : {}),
    ...(actorInstanceId ? { actorInstanceId } : {}),
    ...(resourceUpdates ? { resourceUpdates } : {})
  };
};

const noteUnresolved = (key, entry, { require = false } = {}) => {
  if (key && (entry.commandId || entry.command || entry.acceptedReceipt || entry.outcome)) {
    const enriched = enrichEntry(entry);
    const list = (unresolved.get(key) || []).filter(e => !enriched.commandId || e.commandId !== enriched.commandId);
    unresolved.set(key, [...list, enriched]);
    try {
      persistUnresolved({
        require,
        expectedCommandId: enriched.commandId,
        entry: enriched,
        reason: require ? 'pre_submit' : 'post_submit'
      });
    } catch (error) {
      // Nothing was sent: an entry that could not be stored must not be left holding the item.
      unresolved.set(key, (unresolved.get(key) || []).filter(value => value !== enriched && (!enriched.commandId || value.commandId !== enriched.commandId)));
      throw error;
    }
  }
};

const dropEntry = (key, entry) => {
  unresolved.set(key, (unresolved.get(key) || []).filter(value => value !== entry && (!entry.commandId || value.commandId !== entry.commandId)));
  persistUnresolved({ reason: 'cleanup', entry });
};

const dropCommandId = (key, commandId) => {
  if (!key || !commandId) return;
  unresolved.set(key, (unresolved.get(key) || []).filter(value => value.commandId !== commandId));
  persistUnresolved({ reason: 'cleanup', entry: { commandId } });
};

/** When the room accepts a consumable effect (including before local inventory deduction completes or when the active
 * character / principal has changed), the accepted command is preserved in the durable journal until markUseCompleted
 * runs after local deduction. It is NOT classified as refused. */
export const preserveAcceptedForReconciliation = (key, entry) => {
  if (key && (entry?.commandId || entry?.command || entry?.acceptedReceipt || entry?.outcome)) {
    const existing = (unresolved.get(key) || []).find(e => entry.commandId && e.commandId === entry.commandId);
    const enriched = enrichEntry({ ...(existing || {}), ...entry, completed: false });
    const list = (unresolved.get(key) || []).filter(e => !enriched.commandId || e.commandId !== enriched.commandId);
    unresolved.set(key, [...list, enriched]);
    persistUnresolved({ reason: 'post_submit', entry: enriched });
  }
};

/** The use that registered these entries has consumed the item, so they no longer belong to a use that is waiting.
 * Bound to the original character so switching characters cannot mark another character's use completed. */
export const markUseCompleted = (key, characterId, itemId = null) => {
  hydrateUnresolved(key);
  const targetChar = characterId || activeCharacterId();
  const remaining = [];
  for (const entry of (unresolved.get(key) || [])) {
    if (matchesCharacterScope(entry, targetChar)) {
      if (itemId && entry.itemId && entry.itemId !== itemId) {
        remaining.push(entry);
        continue;
      }
      if (roomAccepted(entry.outcome) || entry.acceptedReceipt || (entry.command && entry.outcome?.code !== 'outcome_unknown')) {
        continue;
      }
      entry.completed = true;
    }
    remaining.push(entry);
  }
  if (remaining.length) unresolved.set(key, remaining);
  else unresolved.delete(key);
  persistUnresolved({ reason: 'cleanup', entry: { commandId: key } });
};

const roomAccepted = outcome => outcome?.success === true || !!outcome?.acceptedReceipt || outcome?.status === 'accepted';
const stillWaiting = outcome => ['outcome_unknown', 'room_connection_unavailable', 'authorization_required', 'awaiting_authorization'].includes(outcome?.code) || outcome?.status === 'awaiting_authorization';

export async function reconcileUnresolved(key, characterId, inventoryInstanceId = null) {
  hydrateUnresolved(key);
  const targetChar = characterId || activeCharacterId();
  const allEntries = [...(unresolved.get(key) || [])];
  const entries = allEntries.filter(entry =>
    matchesCharacterScope(entry, targetChar) && (!inventoryInstanceId || entry.itemId === inventoryInstanceId));
  if (!entries.length) return { state: 'none' };
  let rest = [], credited = false, resourceUpdates = null, settledItemId = null, settledCommandId = null, alreadyDeducted = false;
  for (const entry of entries) {
    const liveRoom = currentRoomId();
    const liveUid = currentOwnerUid();
    const livePlayerId = currentPlayerId();
    const liveInstanceId = currentActorInstanceId(entry.characterId || targetChar);
    // Exact recovery scope: principal, room, acting player, character and actor incarnation. A stored accepted
    // outcome never overrides a retired/missing binding; it is moved to historical evidence instead of applied.
    const foreignContext = (entry.roomId && (!liveRoom || entry.roomId !== liveRoom))
      || (entry.ownerUid && (!liveUid || entry.ownerUid !== liveUid))
      || (entry.playerId && (!livePlayerId || entry.playerId !== livePlayerId))
      || (entry.actorInstanceId && (!liveInstanceId || entry.actorInstanceId !== liveInstanceId));
    if (foreignContext) {
      if (entry.acceptedReceipt || entry.outcome?.success || entry.outcome?.status === 'accepted') {
        historicalAccepted.push({ ...entry, key, retiredReason: 'retired_principal', retiredAt: Date.now() });
      }
      dropEntry(key, entry);
      return { state: 'refused', message: roomOutcomeText({ success: false, code: 'retired_principal' }) };
    }
    let outcome;
    try { outcome = await retryActorCommand(entry.commandId); } catch (error) { outcome = { success: false, code: 'outcome_unknown', error: error?.message }; }
    if (outcome?.code === 'retired_principal') {
      if (entry.acceptedReceipt || entry.outcome?.success || entry.outcome?.status === 'accepted') {
        historicalAccepted.push({ ...entry, key, retiredReason: 'retired_principal', retiredAt: Date.now() });
      }
      dropEntry(key, entry);
      return { state: 'refused', message: roomOutcomeText(outcome) };
    }
    if (outcome?.code === 'outcome_unknown' && !outcome?.commandId && entry.command && typeof submitPreparedActorCommand === 'function') {
      try { outcome = await submitPreparedActorCommand(entry.command); } catch (error) { outcome = { success: false, code: 'outcome_unknown', error: error?.message, commandId: entry.command.commandId }; }
      if (outcome?.code === 'retired_principal') {
        if (entry.acceptedReceipt || entry.outcome?.success || entry.outcome?.status === 'accepted') {
          historicalAccepted.push({ ...entry, key, retiredReason: 'retired_principal', retiredAt: Date.now() });
        }
        dropEntry(key, entry);
        return { state: 'refused', message: roomOutcomeText(outcome) };
      }
    }
    if (!roomAccepted(outcome) && (entry.acceptedReceipt || entry.outcome?.success || entry.outcome?.status === 'accepted')) {
      outcome = entry.outcome || { success: true, status: 'accepted', acceptedReceipt: entry.acceptedReceipt, commandId: entry.commandId };
    }
    if (roomAccepted(outcome)) {                // landed (even if this client could not yet show it)
      if (!entry.completed) {
        credited = true;
        rest = entry.rest || [];
        settledItemId = entry.itemId || settledItemId;
        settledCommandId = entry.commandId || settledCommandId;
        alreadyDeducted = alreadyDeducted || (entry.commandId ? hasDurableCompletion(entry.commandId, entry.characterId || targetChar) : false);
        resourceUpdates = entry.resourceUpdates || deriveResourceUpdates(entry.command, outcome, outcome?.acceptedReceipt);
      }
      dropEntry(key, entry);
      continue;
    }
    if (stillWaiting(outcome)) {
      // The service no longer holds this command (answered through another path or cleared): it cannot be replayed.
      if (outcome.code === 'outcome_unknown' && !outcome.commandId) {
        dropEntry(key, entry);
        return { state: 'lost', message: 'The earlier attempt can no longer be re-asked from here, so it is not known whether it was recorded. Check the shared conditions; the next use is a new attempt.' };
      }
      return { state: 'unresolved', message: roomOutcomeText(outcome) };
    }
    dropEntry(key, entry);
    return { state: 'refused', message: roomOutcomeText(outcome) };
  }
  return credited
    ? { state: 'applied', rest, ...(settledItemId ? { itemId: settledItemId } : {}), ...(settledCommandId ? { commandId: settledCommandId } : {}),
      alreadyDeducted, resourceUpdates, resourcesApplied: alreadyDeducted || areResourcesProjected(resourceUpdates) }
    : { state: 'none' };
}

export const resetUnresolvedForTests = ({ keepStorage = false } = {}) => {
  unresolved.clear();
  historicalAccepted.length = 0;
  inFlight.clear();
  held.clear();
  journalWarningShown.clear();
  if (!keepStorage && typeof window !== 'undefined' && window.localStorage) {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch (_) {}
  }
  clearPendingActorCommandsForTests?.();
};

/** The text a player is shown for a room outcome that did not apply the effect. */
export function roomOutcomeText(outcome) {
  const code = outcome?.code;
  if (code && ROOM_ERRORS[code]) return ROOM_ERRORS[code];
  const text = typeof outcome?.error === 'string' ? outcome.error.trim() : '';
  if (text && text !== code) return text;
  return code ? `The room did not accept it (${String(code).replace(/_/g, ' ')}). Nothing was applied.` : 'The room did not accept it. Nothing was applied.';
}

/** Applies one buff/debuff record through `addCondition` and resolves whether the room (or the local store) took it. */
export async function applyConsumableCondition(addCondition, polarity, condition, key, rest = [], characterId, resourceUpdates = null, itemId = null) {
  let preparedCommandId = null;
  const resolvedCharId = characterId || activeCharacterId();
  const clearHook = setCommandPreparedHook?.(command => {
    preparedCommandId = command?.commandId || null;
    noteUnresolved(key, {
      commandId: command?.commandId,
      command,
      polarity,
      name: condition?.name,
      rest,
      resourceUpdates,
      characterId: resolvedCharId,
      ...(itemId ? { itemId } : {})
    }, { require: true });
  });
  let routed;
  try {
    routed = addCondition(polarity, condition);
    if (!routed || typeof routed.then !== 'function') return { applied: true };
    let outcome;
    try { outcome = await routed; } catch (error) { outcome = { success: false, code: 'outcome_unknown', error: error?.message }; }
    const cmdId = outcome?.commandId || preparedCommandId;
    if (roomAccepted(outcome)) {
      if (key && preparedCommandId) {
        preserveAcceptedForReconciliation(key, {
          commandId: cmdId,
          outcome,
          acceptedReceipt: outcome?.acceptedReceipt || outcome?.receipt,
          polarity,
          name: condition?.name,
          rest,
          resourceUpdates,
          characterId: resolvedCharId,
          ...(itemId ? { itemId } : {})
        });
      }
      return { applied: true, outcome, commandId: cmdId, resourcesApplied: areResourcesProjected(resourceUpdates) };
    }
    if (outcome?.code === 'outcome_unknown') {
      noteUnresolved(key, {
        commandId: cmdId,
        polarity,
        name: condition?.name,
        rest,
        resourceUpdates,
        characterId: resolvedCharId,
        ...(itemId ? { itemId } : {})
      });
    } else if (cmdId) {
      dropCommandId(key, cmdId);
    }
    return { applied: false, code: outcome?.code || null, message: roomOutcomeText(outcome), outcome, commandId: cmdId };
  } catch (error) {
    if (preparedCommandId) dropCommandId(key, preparedCommandId);
    return { applied: false, code: 'exception', message: roomOutcomeText({ error: error?.message }) };
  } finally {
    clearHook?.();
  }
}

/** Multiple stat records of one item (or a stat record paired with instant resource restoration) are ONE room command,
 * so a refusal of any part applies nothing and leaves the item untouched. */
const applyLocally = (addCondition, records) => {
  for (const { polarity, condition } of records) addCondition(polarity, condition);
  return { confirmed: true, partialRefusal: null, resourcesApplied: false };
};

export const normalizeForRoom = (polarity, condition, ref) => {
  const duration = typeof condition?.duration === 'number' ? condition.duration : 60;
  const durationType = condition?.durationType || 'seconds';
  const startTime = typeof condition?.startTime === 'number' ? condition.startTime : Date.now();
  const raw = {
    id: condition?.id || `${polarity}_${Date.now()}_${Math.random()}`,
    type: polarity,
    name: condition?.name,
    icon: condition?.icon || 'ability_DualWield',
    color: condition?.color || (polarity === 'buff' ? '#00ff00' : '#ff0000'),
    description: condition?.description || '',
    effects: condition?.effects || {},
    duration,
    durationType,
    startTime,
    source: condition?.source || 'item',
    stackable: typeof condition?.stackable === 'boolean' ? condition.stackable : false,
    target: condition?.target || 'player',
    ...condition
  };

  if (durationType === 'rounds') {
    const rounds = typeof condition?.durationValue === 'number'
      ? condition.durationValue
      : (typeof condition?.remainingRounds === 'number' ? condition.remainingRounds : Math.ceil(duration / 6));
    raw.durationValue = rounds;
    raw.remainingRounds = typeof condition?.remainingRounds === 'number' ? condition.remainingRounds : rounds;
    delete raw.endTime;
  } else {
    raw.endTime = typeof condition?.endTime === 'number' ? condition.endTime : startTime + (duration * 1000);
    delete raw.durationValue;
    delete raw.remainingRounds;
  }

  if (condition?.hasOverTimeEffect) {
    raw.hasOverTimeEffect = true;
    if (typeof condition.overTimeType === 'string') raw.overTimeType = condition.overTimeType;
    if (typeof condition.overTimeFormula === 'string') raw.overTimeFormula = condition.overTimeFormula;
    if (typeof condition.overTimeElement === 'string') raw.overTimeElement = condition.overTimeElement;
    if (typeof condition.tickFrequency === 'string') raw.tickFrequency = condition.tickFrequency;
    if (typeof condition.tickFrequencyValue === 'number') raw.tickFrequencyValue = condition.tickFrequencyValue;
    if (typeof condition.tickFrequencyUnit === 'string') raw.tickFrequencyUnit = condition.tickFrequencyUnit;
  } else if (typeof condition?.hasOverTimeEffect === 'boolean') {
    raw.hasOverTimeEffect = condition.hasOverTimeEffect;
  }

  for (const key of Object.keys(raw)) {
    if (raw[key] === null || raw[key] === undefined) {
      delete raw[key];
    }
  }

  const res = roomCondition(raw, ref);
  return res;
};

async function applyCombinedConditions(key, records, addCondition, characterId, resourceUpdates = null, itemId = null) {
  const first = records[0]?.condition || {};
  const token = findActor(first.target || first.targetId || 'player');
  const ref = refOf(token);
  if (!ref) {
    const outcome = { success: false, code: 'binding_required' };
    return { applied: false, code: 'binding_required', message: roomOutcomeText(outcome), outcome };
  }
  const resolvedCharId = characterId || activeCharacterId();
  let preparedCommandId = null;
  let resolvedResourceUpdates = typeof resourceUpdates === 'function' ? null : resourceUpdates;
  const clearHook = setCommandPreparedHook?.(command => {
    preparedCommandId = command?.commandId || null;
    noteUnresolved(key, {
      commandId: command?.commandId,
      command,
      name: records[0]?.condition?.name,
      rest: [],
      resourceUpdates: resolvedResourceUpdates || deriveResourceUpdates(command, null, null),
      characterId: resolvedCharId,
      ...(itemId ? { itemId } : {})
    }, { require: true });
  });
  let routed;
  try {
    routed = routeTokenState(token.id, freshToken => {
      const freshRef = refOf(freshToken) || ref;
      const existing = freshToken?.state?.conditions || [];
      // Records belong to the same use. Existing same-name records are replaced once; buff and debuff
      // records of the same item both survive (their polarity differs).
      const combined = records.map(({ polarity, condition }) => normalizeForRoom(polarity, condition, freshRef));
      const names = new Set(combined.map(record => record.name));
      const next = [...existing.filter(value => isDefending(value) || isStunned(value) || !names.has(value.name)), ...combined];
      // Authoritative resource source: the post-snapshot token, but only while the existing owner-attachment projection is
      // active (roomResourceProjection). Without it the local sheet remains the source, exactly as before; the token is never
      // copied over local resources here.
      const computedResources = typeof resourceUpdates === 'function' ? resourceUpdates(roomResourceProjection?.() ? freshToken : null) : resourceUpdates;
      if (computedResources?.refused) return { refused: computedResources.refused };
      // Authoritative revalidation: the pre-submit choice was made from the then-current source. If the post-refresh
      // values now need a choice that was never collected, send nothing and hand the fresh pools back to the caller.
      if (computedResources?.overheal) return { refused: {
        success: false,
        code: 'overheal_choice_required',
        error: roomOutcomeText({ code: 'overheal_choice_required' }),
        overhealPools: computedResources.overhealPools || []
      } };
      resolvedResourceUpdates = computedResources?.updates !== undefined ? computedResources.updates : computedResources;
      return { ...(resolvedResourceUpdates || {}), conditions: next };
    });
    if (!routed || typeof routed.then !== 'function') { const local = applyLocally(addCondition, records); return { applied: local.confirmed }; }
    let outcome;
    try { outcome = await routed; } catch (error) { outcome = { success: false, code: 'outcome_unknown', error: error?.message }; }
    const cmdId = outcome?.commandId || preparedCommandId;
    if (roomAccepted(outcome)) {
      if (key && preparedCommandId) {
        preserveAcceptedForReconciliation(key, {
          commandId: cmdId,
          outcome,
          acceptedReceipt: outcome?.acceptedReceipt || outcome?.receipt,
          name: records[0]?.condition?.name,
          rest: [],
          resourceUpdates: resolvedResourceUpdates,
          characterId: resolvedCharId,
          ...(itemId ? { itemId } : {})
        });
      }
      return { applied: true, outcome, commandId: cmdId, resourcesApplied: areResourcesProjected(resolvedResourceUpdates) };
    }
    if (outcome?.code === 'outcome_unknown') {
      noteUnresolved(key, {
        commandId: cmdId,
        name: records[0]?.condition?.name,
        rest: [],
        resourceUpdates: resolvedResourceUpdates,
        characterId: resolvedCharId,
        ...(itemId ? { itemId } : {})
      });
    } else if (cmdId) {
      dropCommandId(key, cmdId);
    }
    return { applied: false, code: outcome?.code || null, message: roomOutcomeText(outcome), outcome, commandId: cmdId,
      ...(outcome?.overhealPools?.length ? { overhealPools: outcome.overhealPools } : {}) };
  } catch (error) {
    if (preparedCommandId) dropCommandId(key, preparedCommandId);
    return { applied: false, code: 'exception', message: roomOutcomeText({ error: error?.message }) };
  } finally {
    clearHook?.();
  }
}

/** Before a new use: settle any earlier unconfirmed use of the same item. Returns whether this click may go on and
 * whether the room has meanwhile confirmed the earlier command (then the conditions are NOT sent again). */
export async function settleEarlierUse(key, name, characterId, inventoryInstanceId = null) {
  const prior = await reconcileUnresolved(key, characterId, inventoryInstanceId);
  if (prior.state === 'none') return { proceed: true, alreadyConfirmed: false, rest: [] };
  if (prior.state === 'applied') {
    postInventoryNotice(`${name}: the room has now confirmed the earlier use; it is completed now, once.`);
    return {
      proceed: true,
      alreadyConfirmed: true,
      rest: prior.rest || [],
      ...(prior.itemId ? { settledItemId: prior.itemId } : {}),
      ...(prior.commandId ? { settledCommandId: prior.commandId } : {}),
      ...(prior.alreadyDeducted ? { alreadyDeducted: true } : {}),
      ...(prior.resourcesApplied ? { resourcesApplied: true } : {})
    };
  }
  if (prior.state === 'refused') { postInventoryNotice(consumableNotUsedText(name, prior.message)); return { proceed: false }; }
  if (prior.state === 'lost') { postInventoryNotice(`${name} was not used and is still in your pack. ${prior.message}`); return { proceed: false }; }
  postInventoryNotice(`${name} was not used again and is still in your pack. The room has not yet confirmed or refused the earlier use, so a second attempt is held to avoid applying it twice. ${prior.message}`);
  return { proceed: false };
}

/** Sibling entry points: send the item's stat records (buff first) and report what the room did.
 * Offline stays one local pass. In a shared room, multiple records or a condition paired with instant resource
 * restoration are sent as one atomic room command (all or none). */
export async function applyItemConditions(addCondition, key, records, characterId, resourceUpdates = null, itemId = null) {
  const hasResources = typeof resourceUpdates === 'function' || !!(resourceUpdates && Object.keys(resourceUpdates).length);
  if (records.length > 1 || (records.length === 1 && hasResources)) {
    if (!inSharedRoom()) return applyLocally(addCondition, records);
    const applied = await applyCombinedConditions(key, records, addCondition, characterId, resourceUpdates, itemId);
    return applied.applied
      ? { confirmed: true, partialRefusal: null, commandId: applied.commandId || applied.outcome?.commandId, outcome: applied.outcome, resourcesApplied: !!applied.resourcesApplied }
      : { confirmed: false, refused: applied };
  }
  let confirmed = false, partialRefusal = null, lastCommandId = null, lastOutcome = null, resourcesApplied = false;
  for (let i = 0; i < records.length; i++) {
    const { polarity, condition } = records[i];
    const applied = await applyConsumableCondition(addCondition, polarity, condition, key, records.slice(i + 1), characterId, resourceUpdates, itemId);
    if (applied.applied) {
      confirmed = true;
      if (applied.commandId || applied.outcome?.commandId) lastCommandId = applied.commandId || applied.outcome?.commandId;
      if (applied.outcome) lastOutcome = applied.outcome;
      if (applied.resourcesApplied) resourcesApplied = true;
    }
    else if (!confirmed) return { confirmed: false, refused: applied };
    else partialRefusal = applied;
  }
  return { confirmed, partialRefusal, commandId: lastCommandId, outcome: lastOutcome, resourcesApplied };
}

/** After a replay was confirmed: send the records of that use which were never sent. A refusal here leaves the confirmed part in place. */
export async function sendRemainingRecords(addCondition, key, name, rest) {
  if (!rest?.length) return;
  const sent = await applyItemConditions(addCondition, key, rest);
  if (!sent.confirmed) postInventoryNotice(`${name} took effect, except one part. ${sent.refused.message}`);
  else if (sent.partialRefusal) postInventoryNotice(`${name} took effect, except one part. ${sent.partialRefusal.message}`);
}

/** One Inventory line in the existing chat notification channel (as the manual-action gate posts its notice). */
export function postInventoryNotice(content) {
  const chat = getStore('chatStore')?.getState?.();
  const notice = { type: 'system', sender: 'Inventory', content, timestamp: new Date().toISOString() };
  if (typeof chat?.addCombatNotification === 'function') chat.addCombatNotification(notice);
  else chat?.addNotification?.('system', notice);
}

export const consumableNotUsedText = (name, message) => `${name} was not used and is still in your pack. ${message}`;
