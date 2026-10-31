import usePersistenceStatusStore from '../store/persistenceStatusStore';
import { getStore } from '../store/storeRegistry';
import { createScopedNativeFamily } from './scopedNativeFamily';
import { captureConsumerContext, isConsumerContextCurrent } from './scopedConsumer';
import { isPrivateProjectionIsolated } from './bootstrapPrivacyGate';
import { validateCharacterData } from '../services/firebase/characterPersistenceService';
import { decodeCharacterShapes } from '../utils/characterShapeCodec';
import { EQUIPMENT_SLOT_KEYS } from '../utils/equipmentUtils';

const drafts = createScopedNativeFamily({ familyId: 'character.saveDraft' });
// Only the latest candidate per owner/character/lane, never an action log.
// conditionRecovery is private read-only source, never executable runtime data.
const candidates = new Map();
let revision = 0;
export const characterStatusKey = (context, id, lane) =>
  `character:${context?.scope?.scopeKind}:${context?.scope?.scopeId}:${context?.accountGeneration}:${id}:${lane}`;
const candidateKey = (context, id, lane) => `${context.scope.scopeKind}:${context.scope.scopeId}:${id}:${lane}`;

export function characterContextCurrent(context) {
  if (!context || !isConsumerContextCurrent(context) || isPrivateProjectionIsolated()) return false;
  const user = getStore('authStore')?.getState().user;
  return context.scope.scopeKind === 'guest' ? !!user?.isGuest : user?.uid === context.scope.scopeId && !user?.isGuest;
}

// Clone without JSON: serialization refusal must still retain the exact candidate
// (including cycles/BigInt), rather than retain only a lossy/partial export.
function snapshot(value, seen = new Map()) {
  if (!value || typeof value !== 'object') return value;
  if (seen.has(value)) return seen.get(value);
  if (value instanceof Date) return new Date(value);
  // Firestore timestamps in canonical metadata have a documented JSON form;
  // retain seconds/nanoseconds instead of treating SDK prototypes as authored data.
  if (typeof value.toDate === 'function' && Number.isFinite(value.seconds) && Number.isFinite(value.nanoseconds)) {
    return { seconds: value.seconds, nanoseconds: value.nanoseconds };
  }
  if (!Array.isArray(value) && Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) return value;
  const copy = Array.isArray(value) ? [] : {};
  seen.set(value, copy);
  Object.keys(value).forEach(key => { copy[key] = snapshot(value[key], seen); });
  return copy;
}
function serialize(value, space) {
  return JSON.stringify(value, (_key, item) => {
    if (typeof item === 'function' || typeof item === 'symbol' ||
      (typeof item === 'number' && !Number.isFinite(item)) ||
      (item && typeof item === 'object' && !Array.isArray(item) && Object.getPrototypeOf(item) !== Object.prototype && Object.getPrototypeOf(item) !== null)) {
      throw new Error('Draft contains a value that cannot be exported losslessly');
    }
    return item;
  }, space);
}
const fingerprint = (payload) => {
  try { return serialize({ ...payload, updatedAt: undefined }); } catch (_error) { return null; }
};

function publish(entry) {
  if (!characterContextCurrent(entry.context)) return;
  usePersistenceStatusStore.getState().setStatus(characterStatusKey(entry.context, entry.id, entry.lane), entry.status,
    entry.message);
  usePersistenceStatusStore.setState(state => ({
    statuses: { ...state.statuses, [characterStatusKey(entry.context, entry.id, entry.lane)]: {
      ...state.statuses[characterStatusKey(entry.context, entry.id, entry.lane)],
      retention: entry.retention, revision: entry.revision
    } }
  }));
}

function retain(entry) {
  if (entry.lane === 'conditionRecovery' && entry.payload.length > 8) {
    entry.retention = 'memory';
    entry.message = 'Condition recovery capacity reached. Keep this page open; download the exact source.';
    return { status: 'RECOVERY_CAPACITY', persisted: false };
  }
  try { serialize(entry.payload); } catch (error) {
    entry.retention = 'memory';
    entry.message = `Draft serialization failed: ${error.message}. Keep this page open; source retained in memory.`;
    return { status: 'SERIALIZATION_ERROR', persisted: false };
  }
  const result = drafts.save({ payload: entry.payload, revision: entry.revision, pending: entry.status !== 'saved' }, [entry.id, entry.lane]);
  entry.retention = result.status === 'OK' && result.persisted ? 'device' : 'memory';
  if (entry.retention === 'memory') {
    entry.message = `Device retention failed (${result.status}). Keep this page open; download or retry.`;
  }
  return result;
}

export function getCharacterCandidate(id, lane, context = captureConsumerContext().context) {
  if (!characterContextCurrent(context)) return null;
  const key = candidateKey(context, id, lane);
  let entry = candidates.get(key);
  if (entry) {
    if (entry.context.accountGeneration !== context.accountGeneration) {
      entry = { ...entry, context, inFlight: null,
        status: entry.status === 'saved' ? 'idle' : entry.status === 'saving' ? 'pending' : entry.status };
      candidates.set(key, entry);
      publish(entry);
    }
    return entry;
  }
  const stored = drafts.load([id, lane]);
  if (!stored?.payload) return null;
  entry = { id, lane, context, payload: stored.payload, revision: ++revision,
    fingerprint: fingerprint(stored.payload), status: stored.pending ? 'pending' : 'idle', retention: 'device', message: null };
  candidates.set(key, entry);
  publish(entry);
  return entry;
}

export function stageCharacterDraft(id, lane, payload, context = captureConsumerContext().context) {
  if (!id || !characterContextCurrent(context)) return null;
  const key = candidateKey(context, id, lane);
  const previous = getCharacterCandidate(id, lane, context);
  const capturedPayload = snapshot(payload);
  const hash = fingerprint(capturedPayload);
  if (hash !== null && previous?.fingerprint === hash) {
    if (previous.retention !== 'device') retain(previous);
    markConditionRecoveryRefusal(previous);
    publish(previous);
    return previous;
  }
  const entry = { id, lane, context, payload: capturedPayload, fingerprint: hash,
    revision: ++revision, status: 'pending', retention: 'memory', message: null };
  candidates.set(key, entry);
  retain(entry);
  if (entry.retention === 'memory') entry.status = 'error';
  markConditionRecoveryRefusal(entry);
  publish(entry);
  return entry;
}

const recoveryMatches = (candidate, id, context) => candidate?.observedOwnerUid === context?.scope?.scopeId &&
  candidate.observedCharacterId === id && Array.isArray(candidate.records);

/** Explicit owner/character recovery read. Observation never establishes ownership
 * of a condition target; these bytes cannot be installed as buffs/debuffs. */
export function getPersonalConditionRecovery(id, context = captureConsumerContext().context) {
  const entry = getCharacterCandidate(id, 'conditionRecovery', context);
  return snapshot(Array.isArray(entry?.payload) ? entry.payload.filter(candidate => recoveryMatches(candidate, id, context)) : []);
}

function markConditionRecoveryRefusal(entry) {
  if (entry.lane !== 'runtime') return false;
  const recovery = getCharacterCandidate(entry.id, 'conditionRecovery', entry.context);
  if (!recovery || recovery.retention === 'device') return false;
  entry.status = 'error';
  entry.message = `Private condition recovery is memory only. ${recovery.message}`;
  return true;
}

/** Copy before projection can discard ambiguous records. Reuse the P6 scoped
 * preservation/refusal path; union sources rather than replace them on save/load.
 * The optional cache input permits migration of the earlier volatile P7 cache. */
export function preservePersonalConditionRecovery(id, sources = getStore('gameStore')?.getState().personalConditionRecoveryCandidates || [],
  context = captureConsumerContext().context) {
  if (!id || !characterContextCurrent(context)) return null;
  const previous = getPersonalConditionRecovery(id, context);
  const incoming = sources.filter(candidate => recoveryMatches(candidate, id, context));
  if (!previous.length && !incoming.length) return null;
  for (const candidate of incoming) {
    const hash = fingerprint(candidate);
    if (hash === null || !previous.some(value => fingerprint(value) === hash)) previous.push(snapshot(candidate));
  }
  const entry = stageCharacterDraft(id, 'conditionRecovery', previous, context);
  const runtime = getCharacterCandidate(id, 'runtime', context);
  if (runtime && markConditionRecoveryRefusal(runtime)) publish(runtime);
  return entry;
}

export function isLatestCharacterDraft(entry) {
  return !!entry && characterContextCurrent(entry.context) &&
    candidates.get(candidateKey(entry.context, entry.id, entry.lane)) === entry;
}

export function setCharacterSaveOutcome(entry, status, message = null) {
  if (!isLatestCharacterDraft(entry)) return false;
  entry.status = status;
  entry.message = message;
  if (status === 'saved') retain(entry);
  markConditionRecoveryRefusal(entry);
  publish(entry);
  return true;
}

export async function saveCharacterDraft(entry, write) {
  if (!isLatestCharacterDraft(entry)) return { success: false, reason: 'stale-owner-or-edit' };
  if (entry.inFlight) return entry.inFlight;
  const run = async () => {
    retain(entry);
    if (markConditionRecoveryRefusal(entry)) {
      publish(entry);
      return { success: false, reason: 'condition-recovery-retention-failed' };
    }
    if (entry.retention !== 'device') {
      setCharacterSaveOutcome(entry, 'error', entry.message);
      return { success: false, reason: 'device-retention-failed' };
    }
    if (navigator.onLine === false) {
      setCharacterSaveOutcome(entry, 'pending', 'Offline. Retained on this device; cloud save pending.');
      return { success: false, localOnly: true, reason: 'offline' };
    }
    setCharacterSaveOutcome(entry, 'saving');
    try {
      const result = await write(entry.payload, () => isLatestCharacterDraft(entry));
      const confirmed = result === true || (result?.success === true && result.localOnly !== true);
      if (isLatestCharacterDraft(entry) && markConditionRecoveryRefusal(entry)) {
        publish(entry);
        return { success: false, reason: 'condition-recovery-retention-failed', runtimeCloudConfirmed: confirmed };
      }
      setCharacterSaveOutcome(entry, confirmed ? 'saved' : result?.localOnly ? 'pending' : 'error',
        confirmed ? null : result?.error || result?.reason || 'Cloud save was not confirmed. Retry or download this draft.');
      return typeof result === 'boolean' ? { success: result } : result;
    } catch (error) {
      setCharacterSaveOutcome(entry, 'error', error.message);
      return { success: false, error: error.message };
    }
  };
  entry.inFlight = run();
  const result = await entry.inFlight;
  entry.inFlight = null;
  return result;
}

export function recoverCharacterRoster(characters) {
  return characters.map(character => {
    const entry = getCharacterCandidate(character.id, 'canonical');
    if (!entry || entry.status === 'idle' || entry.status === 'saved') return character;
    publish(entry);
    return { ...character, ...entry.payload, id: character.id };
  });
}

export function exportCharacterDraft(id) {
  const captured = captureConsumerContext();
  if (!captured.ok || !characterContextCurrent(captured.context)) throw new Error('No eligible owner');
  const canonical = getCharacterCandidate(id, 'canonical', captured.context);
  const runtime = getCharacterCandidate(id, 'runtime', captured.context);
  const conditionRecovery = getPersonalConditionRecovery(id, captured.context);
  if (!canonical && !runtime && !conditionRecovery.length) throw new Error('No retained draft for this character');
  return serialize({ format: 'mythrill-character-draft', version: 1,
    owner: captured.context.scope, characterId: id,
    canonical: canonical?.payload || null, runtime: runtime?.payload || null,
    ...(conditionRecovery.length ? { conditionRecovery } : {}) }, 2);
}

const isRecord = value => !!value && typeof value === 'object' && !Array.isArray(value);

// Validate only fields interpreted by loadCharacter/applyRuntime and their
// inventory consumers. Uninterpreted extension fields are preserved verbatim.
function validateConsumedTypes(payload, lane) {
  const optional = (record, keys, accepts, label) => {
    for (const key of keys) if (record?.[key] !== undefined && !accepts(record[key])) throw new Error(`Invalid ${lane} ${label || key} type`);
  };
  const text = value => value === null || typeof value === 'string';
  const numeric = value => Number.isFinite(value);
  if (lane === 'canonical') {
    optional(payload, ['baseName', 'subrace', 'raceDisplayName', 'background', 'backgroundDisplayName', 'path', 'pathDisplayName',
      'selectedAbility', 'alignment', 'primarySpecialization'], text);
    optional(payload, ['level', 'experience', 'durability', 'damageReduction'], numeric);
    optional(payload, ['classAcquisition', 'class_spells', 'levelUpHistory', 'talents', 'resistances', 'spellPower', 'tokenSettings'], isRecord);
    optional(payload, ['pathPassives', 'immunities'], Array.isArray);
    // Attribute provenance (utils/attributeProfile.js): baseStats is an attribute map, statsModel a marker string.
    optional(payload, ['baseStats'], value => value === null || isRecord(value));
    optional(payload, ['statsModel'], value => value === null || typeof value === 'string');
    // Ancestral Gifts: null (none / legacy) or { heritageId, core, picks: { rowId: giftId|null } }.
    optional(payload, ['ancestry'], value => value === null || (isRecord(value) && typeof value.heritageId === 'string'
      && typeof value.core === 'string' && isRecord(value.picks)
      && Object.values(value.picks).every(pick => pick === null || typeof pick === 'string')));
    optional(payload.class_spells, ['known_spells'], value => Array.isArray(value) && value.every(spell => typeof spell === 'string'));
    if (payload.levelUpHistory) for (const entry of Object.values(payload.levelUpHistory)) {
      if (!isRecord(entry)) throw new Error('Invalid canonical levelUpHistory entry');
      optional(entry, ['healthIncrease', 'manaIncrease'], numeric);
    }
  }
  optional(payload, ['tempHealth', 'tempMana', 'tempActionPoints', 'exhaustionLevel', 'skillPointsSpent', 'skillPointsAvailable'], numeric);
  // Canonical legacy root resources are also consumed before nested resources.
  for (const key of ['health', 'mana', 'actionPoints']) if (payload[key] !== undefined &&
    (!isRecord(payload[key]) || !numeric(payload[key].current) || !numeric(payload[key].max))) throw new Error(`Invalid ${lane} ${key} structure`);
  optional(payload.classResource, ['type'], value => typeof value === 'string');
  optional(payload.inventory, ['encumbranceState'], value => typeof value === 'string');
  optional(payload.inventory?.currency, ['platinum', 'gold', 'silver', 'copper'], numeric);
  optional(payload.lore, ['background', 'personalityTraits', 'ideals', 'bonds', 'flaws', 'appearance', 'backstory', 'goals',
    'fears', 'allies', 'enemies', 'organizations', 'notes'], text);

  const validateItem = item => {
    if (!isRecord(item)) throw new Error(`Invalid ${lane} inventory item structure`);
    optional(item, ['name', 'type', 'subtype', 'quality', 'weaponSlot', 'hand'], value => typeof value === 'string');
    optional(item, ['width', 'height', 'rotation', 'quantity', 'weight', 'originalWidth', 'originalHeight', 'originalRotation'], numeric);
    if (item.position !== undefined && (!isRecord(item.position) || !numeric(item.position.row) || !numeric(item.position.col))) throw new Error('Invalid inventory position');
    if (item.shape !== undefined && item.shape !== null) {
      if (!isRecord(item.shape)) throw new Error('Invalid inventory shape');
      optional(item.shape, ['type'], value => typeof value === 'string');
      optional(item.shape, ['width', 'height'], numeric);
      const cells = item.shape.cells;
      if (cells !== undefined && (!Array.isArray(cells) || !cells.length || !cells.every(row =>
        Array.isArray(row) && row.length > 0 && row.length === cells[0].length && row.every(cell => typeof cell === 'boolean')))) throw new Error('Invalid inventory shape cells');
    }
    if (item.containerProperties !== undefined) {
      if (!isRecord(item.containerProperties)) throw new Error('Invalid container properties');
      if (item.containerProperties.items !== undefined) {
        if (!Array.isArray(item.containerProperties.items)) throw new Error('Invalid contained items');
        item.containerProperties.items.forEach(validateItem);
      }
    }
  };
  // Accept the existing JSON-row representation only at codec-owned item paths.
  const decoded = decodeCharacterShapes(payload);
  decoded.inventory?.items?.forEach(validateItem);
  decoded.inventory?.containers?.forEach(container => {
    if (!isRecord(container)) throw new Error('Invalid inventory container');
    if (container.items !== undefined) {
      if (!Array.isArray(container.items)) throw new Error('Invalid container items');
      container.items.forEach(validateItem);
    }
  });
  for (const slot of [...EQUIPMENT_SLOT_KEYS, 'weapon', 'armor', 'shield', 'main_hand', 'off_hand']) {
    if (decoded.equipment?.[slot] !== undefined && decoded.equipment[slot] !== null) validateItem(decoded.equipment[slot]);
  }
  if (decoded.equipment?.accessories !== undefined) {
    if (!Array.isArray(decoded.equipment.accessories)) throw new Error('Invalid equipment accessories');
    decoded.equipment.accessories.forEach(validateItem);
  }
  for (const entries of [payload.buffs, payload.debuffs, payload.quests?.quests]) {
    if (entries?.some(entry => !isRecord(entry))) throw new Error(`Invalid ${lane} condition or quest entry`);
  }
}

function validateImportedPayload(payload, lane, id, context) {
  if (!isRecord(payload)) throw new Error(`Invalid ${lane} payload structure`);
  const identities = [payload.id, payload.characterId, payload.metadata?.id];
  if ((lane === 'canonical' && payload.id !== id) || identities.some(value => value !== undefined && value !== id)) {
    throw new Error(`${lane} embedded character identity does not match the selected character`);
  }
  for (const owner of [payload.userId, payload.metadata?.userId, payload.storageExtensions?.metadata?.userId]) {
    if (owner !== undefined && owner !== context.scope.scopeId) throw new Error(`${lane} embedded owner does not match`);
  }
  if (payload.version !== undefined && (!Number.isInteger(payload.version) || payload.version < 1 || (lane === 'runtime' && payload.version !== 1))) {
    throw new Error(`Unsupported ${lane} payload version`);
  }
  if (lane === 'canonical') validateCharacterData(payload);
  const resources = lane === 'canonical' ? payload.resources : payload;
  for (const key of ['health', 'mana', 'actionPoints']) {
    const resource = resources[key];
    if (resource !== undefined && (!isRecord(resource) || !Number.isFinite(resource.current) || !Number.isFinite(resource.max))) {
      throw new Error(`Invalid ${lane} ${key} structure`);
    }
  }
  for (const key of ['inventory', 'equipment', 'lore', 'classResource', 'quests', 'skillRanks', 'skillProgress']) {
    if (payload[key] !== undefined && !(key === 'classResource' && payload[key] === null) && !isRecord(payload[key])) throw new Error(`Invalid ${lane} ${key} structure`);
  }
  for (const [record, keys] of [[payload.inventory, ['items', 'containers']], [payload.quests, ['quests', 'categories']], [payload, ['buffs', 'debuffs', 'bodyStates', 'spells']]]) {
    for (const key of keys) if (record?.[key] !== undefined && !Array.isArray(record[key])) throw new Error(`Invalid ${lane} ${key} structure`);
  }
  if (payload.inventory?.items?.some(item => !isRecord(item))) throw new Error('Invalid inventory item structure');
  if (payload.inventory?.currency !== undefined && !isRecord(payload.inventory.currency)) throw new Error('Invalid inventory currency structure');
  if (payload.quests?.questCategories !== undefined && !isRecord(payload.quests.questCategories)) throw new Error('Invalid quest categories structure');
  validateConsumedTypes(payload, lane);
}

export function importCharacterDraft(raw, id) {
  const data = JSON.parse(raw);
  const context = captureConsumerContext().context;
  if (!characterContextCurrent(context) || !isRecord(data) || data.format !== 'mythrill-character-draft' || data.version !== 1 ||
    data.characterId !== id || data.owner?.scopeId !== context.scope.scopeId || data.owner?.scopeKind !== context.scope.scopeKind) {
    throw new Error('Draft version, owner or selected character does not match');
  }
  if (!data.canonical && !data.runtime && !data.conditionRecovery?.length) throw new Error('Draft has no character payload');
  if (data.conditionRecovery !== undefined && (!Array.isArray(data.conditionRecovery) || data.conditionRecovery.some(candidate =>
    !recoveryMatches(candidate, id, context) || candidate.records.some(record => !isRecord(record))))) {
    throw new Error('Private condition recovery owner or character does not match');
  }
  // Validate every lane before retaining or applying any lane. A rejected file
  // stays on disk/in the file input; the current recovery candidates are intact.
  for (const lane of ['canonical', 'runtime']) {
    if (data[lane] !== null && data[lane] !== undefined) validateImportedPayload(data[lane], lane, id, context);
  }
  for (const lane of ['canonical', 'runtime']) {
    const current = getCharacterCandidate(id, lane, context);
    if ((data.canonical || data.runtime) && current && current.status !== 'saved' && current.status !== 'idle' &&
      (!data[lane] || fingerprint(data[lane]) !== current.fingerprint)) {
      throw new Error('Current unsaved work differs from this file. Retry or download it first; neither candidate was replaced. The import file is unchanged.');
    }
  }
  for (const lane of ['canonical', 'runtime']) if (data[lane]) stageCharacterDraft(id, lane, data[lane], context);
  if (data.conditionRecovery) preservePersonalConditionRecovery(id, data.conditionRecovery, context);
  return data;
}

export function resetCharacterSaveOutcomeForTests() {
  candidates.clear();
  drafts.resetForTests();
  revision = 0;
}
