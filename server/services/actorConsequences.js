/** Frozen P7: exact token attachments, final common pools, individual records.
 * No class economics, rolls, targeting rules, shared clocks or entity registry.
 */
const crypto = require('crypto');
const checkpoint = require('./roomCheckpoint');
const own = (record, key) => !!record && Object.prototype.hasOwnProperty.call(record, key);
const clone = value => JSON.parse(JSON.stringify(value));
const fail = (code, message = code) => { const error = new Error(message); error.code = code; throw error; };
const string = value => typeof value === 'string' && value.length > 0 && value.length <= 200;
const integer = value => Number.isSafeInteger(value) && value >= 0;
const bytes = value => Buffer.byteLength(JSON.stringify(value), 'utf8');
const keys = (record, allowed) => {
  if (!record || typeof record !== 'object' || Array.isArray(record) ||
    ![Object.prototype, null].includes(Object.getPrototypeOf(record)) || Object.keys(record).some(key => !allowed.includes(key))) {fail('invalid_consequence');}
};
const hash = value => checkpoint.canonicalHash(value);
const POOLS = { hp: ['currentHp', 'health', 'tempHealth', 'maxHp'], mana: ['currentMana', 'mana', 'tempMana', 'maxMana'], ap: ['currentActionPoints', 'actionPoints', 'tempActionPoints', 'maxAP'] };
const MODIFIERS = ['strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma', 'armor', 'damageReduction', 'movementSpeed', 'healthRegen', 'manaRegen', 'maxHp', 'maxMana', 'maxAP', 'attackBonus', 'damageBonus', 'saveBonus'];
const CONDITION_FIELDS = ['version', 'id', 'recordId', 'conditionKey', 'originalName', 'name', 'type', 'kind', 'target', 'targetId', 'targetType', 'source', 'sourceActor', 'sourceEntityId', 'effectOrigin', 'isMagical', 'icon', 'color', 'description', 'effectSummary', 'effects', 'duration', 'durationType', 'durationValue', 'remainingRounds', 'startTime', 'endTime', 'stackable', 'hasOverTimeEffect', 'overTimeType', 'overTimeFormula', 'overTimeElement', 'tickFrequency', 'tickFrequencyValue', 'tickFrequencyUnit', 'clockBoundary', 'sharedTiming'];
const REF_KEYS = ['kind', 'roomId', 'mapId', 'tokenId', 'instanceId', 'ownerUid', 'characterId'];
const PROTECTED = new Set(['actorContract', 'actorConsequences', 'health', 'mana', 'actionPoints', 'currentHp', 'currentMana', 'currentActionPoints', 'tempHealth', 'tempMana', 'tempActionPoints', 'hp', 'maxHp', 'maxMana', 'maxAP', 'maxActionPoints', 'conditions', 'buffs', 'debuffs', 'finalResources', 'expectedRevision']);
const runtimeEpochs = new WeakMap();

function epoch(room) {
  const token = room.authorityToken;
  const identity = token ? `${token.authorityInstanceId}:${token.authorityGeneration}` : 'local';
  let current = runtimeEpochs.get(room);
  if (!current || current.identity !== identity) {
    current = { identity, id: crypto.randomUUID() };
    runtimeEpochs.set(room, current);
  }
  return current.id;
}
function ledger(room) {
  const stored = room.gameState.actorConsequences;
  if (stored && stored.version !== 1) {fail('unsupported_actor_contract');}
  if (stored && (!integer(stored.commitSequence) || !integer(stored.replayFloor) || stored.replayFloor > stored.commitSequence ||
    !Array.isArray(stored.receipts) || stored.receipts.length > 256 || bytes(stored.receipts) > 512 * 1024)) {fail('unsupported_actor_contract');}
  return stored || { version: 1, admissionEpoch: epoch(room), commitSequence: 0, replayFloor: 0, receipts: [] };
}
function validateRef(ref, incarnation = true) {
  keys(ref, REF_KEYS);
  if (!['creature', 'character'].includes(ref.kind) || !['roomId', 'mapId', 'tokenId'].every(key => string(ref[key])) ||
    (incarnation && !string(ref.instanceId))) {fail('invalid_consequence');}
  if (['player', 'current-player', 'local_player', 'local-player'].includes(ref.tokenId)) {fail('actor_binding_conflict');}
  if (ref.kind === 'character' && (!string(ref.ownerUid) || !string(ref.characterId))) {fail('actor_binding_conflict');}
  if (ref.kind === 'creature' && (own(ref, 'ownerUid') || own(ref, 'characterId'))) {fail('actor_binding_conflict');}
}
function refFor(contract) {
  return Object.fromEntries(REF_KEYS.filter(key => contract[key] !== undefined).map(key => [key, contract[key]]));
}
function locate(room, ref, requireBound = true, allowInactive = false) {
  validateRef(ref, requireBound);
  if (ref.roomId !== room.id || !own(room.gameState.maps, ref.mapId)) {fail('actor_not_found');}
  const map = room.gameState.maps[ref.mapId];
  let field = ref.kind === 'character' ? 'characterTokens' : 'tokens';
  if (!requireBound && ref.kind === 'creature') {
    if (own(map.tokens, ref.tokenId) && own(map.creatures, ref.tokenId) && hash(map.tokens[ref.tokenId]) !== hash(map.creatures[ref.tokenId])) {fail('legacy_reconciliation_required');}
    if (!own(map.tokens, ref.tokenId) && own(map.creatures, ref.tokenId)) {field = 'creatures';}
  }
  if (!own(map[field], ref.tokenId)) {fail('actor_not_found');}
  const token = map[field][ref.tokenId];
  if (!requireBound) {return { map, field, token };}
  const contract = token.state?.actorContract;
  if (contract && contract.version !== 1) {fail('unsupported_actor_contract');}
  if (!contract) {fail('binding_required');}
  if (hash(refFor(contract)) !== hash(ref)) {fail('actor_binding_conflict');}
  if (ref.kind === 'character' && ((!allowInactive && !contract.primary) || token.ownerUserId !== ref.ownerUid || token.character?.id !== ref.characterId)) {fail('secondary_attachment');}
  return { map, field, token, contract };
}
function permitted(room, player, uid, ref, token) {
  // P4's exact scoped delegate check; never use legacy session ownership for P7.
  if (player.isGM) {return true;}
  if (uid && token.ownerUserId === uid && (ref.kind !== 'character' || ref.ownerUid === uid)) {return true;}
  return require('../handlers/tokenHandlers').resolveTokenAuthority(room, player, ref.tokenId,
    { ...token, ownerUserId: token.ownerUserId || '__unowned__' }, ref.mapId, uid) === 'delegate';
}
function resources(token, kind) {
  const out = {};
  for (const [pool, [stateKey, pcKey, tempKey, maxKey]] of Object.entries(POOLS)) {
    const values = kind === 'character' ? token.character : token.state;
    const current = kind === 'character' ? values?.[pcKey]?.current : values?.[stateKey];
    const max = kind === 'character' ? values?.[pcKey]?.max : (values?.[maxKey] ?? token.stats?.[maxKey] ?? token.creature?.stats?.[maxKey] ?? (pool === 'ap' ? token.stats?.maxActionPoints : undefined));
    out[pool] = { current, temp: values?.[tempKey] ?? 0, max };
  }
  return out;
}
function validateRecord(record, ref) {
  keys(record, CONDITION_FIELDS);
  if (record.version !== 1 || !string(record.id) || record.id !== record.recordId || !string(record.name) ||
    typeof record.originalName !== 'string' || !record.originalName.trim() || typeof record.source !== 'string' || !record.source.trim() ||
     !['buff', 'debuff', 'marker'].includes(record.type) || !['effect', 'marker', 'legacy-manual'].includes(record.kind) ||
     hash(record.target) !== hash(ref) || record.targetId !== ref.tokenId || record.targetType !== ref.kind ||
     record.sharedTiming !== 'manual' || !['rounds', 'minutes', 'hours', 'seconds', 'manual'].includes(record.durationType)) {fail('invalid_condition');}
  for (const [key, value] of Object.entries(record)) {
    if (['target', 'sourceActor', 'effects'].includes(key)) {continue;}
    if (value !== null && !['number', 'string', 'boolean'].includes(typeof value)) {fail('invalid_condition');}
    if (typeof value === 'number' && !Number.isFinite(value)) {fail('invalid_condition');}
  }
  for (const key of ['isMagical', 'stackable', 'hasOverTimeEffect']) {
    if (own(record, key) && typeof record[key] !== 'boolean') {fail('invalid_condition');}
  }
  for (const key of ['duration', 'durationValue', 'remainingRounds', 'startTime', 'endTime', 'tickFrequencyValue']) {
    if (own(record, key) && (typeof record[key] !== 'number' || !Number.isFinite(record[key]))) {fail('invalid_condition');}
  }
  for (const key of ['source', 'sourceEntityId', 'effectOrigin', 'originalName', 'conditionKey', 'icon', 'color', 'description', 'effectSummary', 'overTimeType', 'overTimeFormula', 'overTimeElement', 'tickFrequency', 'tickFrequencyUnit', 'clockBoundary']) {
    if (own(record, key) && typeof record[key] !== 'string') {fail('invalid_condition');}
  }
  if (record.sourceActor) {validateRef(record.sourceActor);}
  if (record.effects) {
    keys(record.effects, MODIFIERS);
    if (Object.values(record.effects).some(value => typeof value !== 'number' || !Number.isFinite(value))) {fail('invalid_condition');}
  }
  if (record.durationType === 'rounds' && (!integer(record.remainingRounds) || !integer(record.durationValue))) {fail('invalid_condition');}
  if (!['rounds', 'manual'].includes(record.durationType) && (!Number.isFinite(record.startTime) || !Number.isFinite(record.endTime) || record.endTime < record.startTime)) {fail('invalid_condition');}
  return clone(record);
}
function validateCommand(command) {
  keys(command, ['version', 'roomId', 'commandId', 'actionEpoch', 'baseCommitSequence', 'source', 'target', 'actors', 'adjudication']);
  if (command.version !== 1 || !string(command.roomId) || !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(command.commandId || '') || !string(command.actionEpoch) || !integer(command.baseCommitSequence) ||
    !Array.isArray(command.actors) || command.actors.length < 1 || command.actors.length > 2 || bytes(command) > 65536 || !hash(command)) {fail('invalid_consequence');}
  const seen = new Set();
  let operations = 0;
  for (const actor of command.actors) {
    keys(actor, ['ref', 'expectedRevision', 'finalResources', 'conditions']);
    validateRef(actor.ref);
    if (actor.ref.roomId !== command.roomId || !integer(actor.expectedRevision) || seen.has(hash(actor.ref))) {fail('invalid_consequence');}
    seen.add(hash(actor.ref));
    if (actor.finalResources) {
      keys(actor.finalResources, Object.keys(POOLS));
      for (const values of Object.values(actor.finalResources)) {
        keys(values, ['current', 'temp']);
        if (![values.current, values.temp].every(value => typeof value === 'number' && Number.isFinite(value) && value >= 0)) {fail('invalid_resources');}
      }
    }
    if (actor.conditions) {
      if (!Array.isArray(actor.conditions)) {fail('invalid_condition');}
      operations += actor.conditions.length;
      for (const operation of actor.conditions) {
        keys(operation, ['op', 'recordId', 'record']);
        if (!['add', 'remove', 'update'].includes(operation.op) || !string(operation.recordId)) {fail('invalid_condition');}
        if (operation.op !== 'remove' && (operation.record?.id !== operation.recordId || !validateRecord(operation.record, actor.ref))) {fail('invalid_condition');}
        if (operation.op === 'remove' && operation.record !== undefined) {fail('invalid_condition');}
      }
    }
    if (!Object.keys(actor.finalResources || {}).length && !actor.conditions?.length) {fail('invalid_consequence');}
  }
  if (operations > 32) {fail('condition_operation_limit');}
  for (const role of ['source', 'target']) {
    if (command[role] && (!seen.has(hash(command[role])) || !validateRefOrTrue(command[role]))) {fail('invalid_consequence');}
  }
  if (command.actors.length === 2 && (!command.source || !command.target)) {fail('invalid_consequence');}
  if (command.adjudication) {
    keys(command.adjudication, ['definitionId', 'definitionVersionOrHash', 'chosenResult', 'finalAmount', 'adjustmentReason']);
    if (Object.values(command.adjudication).some(value => !['string', 'number'].includes(typeof value) || (typeof value === 'number' && !Number.isFinite(value)))) {fail('invalid_consequence');}
  }
  return command;
}
function validateRefOrTrue(ref) {validateRef(ref); return true;}
function knownReceipt(room, uid, command) {
  const found = ledger(room).receipts.find(receipt => receipt.submitterUid === uid && receipt.commandId === command.commandId);
  if (found && found.contentHash !== hash(command)) {fail('command_id_conflict');}
  return found || null;
}
function publicCondition(record) {
  if (!record || typeof record !== 'object') {return null;}
  const out = {};
  for (const key of CONDITION_FIELDS) {
    if (!own(record, key)) {continue;}
    const value = record[key];
    if (key === 'target' || key === 'sourceActor') {
      try {validateRef(value); out[key] = clone(value);} catch (_) { /* private/unknown identity is not projected */ }
    } else if (key === 'effects') {
      out.effects = Object.fromEntries(MODIFIERS.filter(mod => typeof value?.[mod] === 'number' && Number.isFinite(value[mod])).map(mod => [mod, value[mod]]));
    } else if (key === 'icon') {
      const icon = require('./roomAccessService').projectAssetReference(value);
      if (icon) {out.icon = icon;}
    } else if (value === null || ['string', 'boolean'].includes(typeof value) || (typeof value === 'number' && Number.isFinite(value))) {out[key] = value;}
  }
  return out;
}
function publicContract(contract) {
  if (!contract || contract.version !== 1) {return null;}
  try {validateRef(refFor(contract));} catch (_) {return { version: 1, readOnly: true };}
  if (!integer(contract.revision)) {return { version: 1, readOnly: true };}
  return { version: 1, ...refFor(contract), revision: contract.revision, ...(contract.kind === 'character' ? { primary: contract.primary === true } : {}) };
}
function publicReceipt(receipt) {
  if (!receipt || receipt.version !== 1 || !Array.isArray(receipt.actors)) {return { version: receipt?.version ?? null, readOnly: true };}
  const fields = ['version', 'roomId', 'commandId', 'submitterUid', 'contentHash', 'admissionEpoch', 'commitSequence', 'checkpointRevision', 'acceptedAt'];
  const out = Object.fromEntries(fields.filter(key => typeof receipt[key] === 'string' || (typeof receipt[key] === 'number' && Number.isFinite(receipt[key]))).map(key => [key, receipt[key]]));
  if (receipt.checkpointRevision === null) {out.checkpointRevision = null;}
  out.authorization = Object.fromEntries(['kind', 'authorizerUid', 'proposalId'].filter(key => typeof receipt.authorization?.[key] === 'string').map(key => [key, receipt.authorization[key]]));
  for (const role of ['source', 'target']) {
    if (receipt[role]) {try {validateRef(receipt[role]); out[role] = clone(receipt[role]);} catch (_) {out.readOnly = true;}}
  }
  if (receipt.adjudication) {out.adjudication = Object.fromEntries(['definitionId', 'definitionVersionOrHash', 'chosenResult', 'finalAmount', 'adjustmentReason']
    .filter(key => typeof receipt.adjudication[key] === 'string' || (typeof receipt.adjudication[key] === 'number' && Number.isFinite(receipt.adjudication[key])))
    .map(key => [key, receipt.adjudication[key]]));}
  out.actors = receipt.actors.map(actor => {
    try {validateRef(actor.ref);} catch (_) {return { readOnly: true };}
    return { ref: clone(actor.ref), beforeRevision: integer(actor.beforeRevision) ? actor.beforeRevision : null, afterRevision: integer(actor.afterRevision) ? actor.afterRevision : null,
      finalResources: Object.fromEntries(Object.keys(POOLS).map(pool => [pool, Object.fromEntries(['current', 'temp', 'max'].filter(key => typeof actor.finalResources?.[pool]?.[key] === 'number' && Number.isFinite(actor.finalResources[pool][key])).map(key => [key, actor.finalResources[pool][key]]))])),
      conditions: Array.isArray(actor.conditions) ? actor.conditions.map(publicCondition).filter(Boolean) : [] };
  });
  return out;
}
function stage(room, player, uid, command, authorization, confirmedRevision) {
  validateCommand(command);
  if (command.roomId !== room.id) {fail('actor_not_found');}
  const existing = knownReceipt(room, uid, command);
  if (existing) {return { existing };}
  const prior = ledger(room);
  if (command.actionEpoch !== epoch(room)) {fail('outcome_unknown');}
  if (command.baseCommitSequence < prior.replayFloor) {fail('retry_window_expired');}
  if (command.baseCommitSequence > prior.commitSequence) {fail('invalid_consequence');}
  const validated = checkpoint.canonicalize(room.gameState, 'gameState');
  if (validated.error) {fail('CHECKPOINT_INVALID', validated.error);}
  if (!player.isGM && command.actors.length > 1) {fail('authorization_required');}
  const next = clone(room.gameState);
  const entries = [];
  for (const actor of command.actors) {
    const resolved = locate(room, actor.ref);
    if (!player.isGM && !permitted(room, player, uid, actor.ref, resolved.token)) {fail('authorization_required');}
    if (resolved.contract.revision !== actor.expectedRevision) {fail('stale_actor_revision');}
    if (!Number.isSafeInteger(actor.expectedRevision + 1)) {fail('revision_exhausted');}
    const token = next.maps[actor.ref.mapId][resolved.field][actor.ref.tokenId];
    const bounds = resources(resolved.token, actor.ref.kind);
    for (const [pool, values] of Object.entries(actor.finalResources || {})) {
      const [stateKey, pcKey, tempKey] = POOLS[pool];
      if (!Number.isFinite(bounds[pool].max) || bounds[pool].max < 0 || values.current > bounds[pool].max) {fail('invalid_resources');}
      if (actor.ref.kind === 'character') {
        token.character[pcKey].current = values.current;
        token.character[tempKey] = values.temp;
      } else {
        token.state[stateKey] = values.current;
        token.state[tempKey] = values.temp;
      }
    }
    const records = token.state.conditions || [];
    if (!Array.isArray(records)) {fail('legacy_reconciliation_required');}
    for (const operation of actor.conditions || []) {
      const index = records.findIndex(record => (record.recordId || record.id) === operation.recordId);
      if (operation.op === 'add') {
        if (index !== -1) {fail('condition_id_conflict');}
        records.push(validateRecord(operation.record, actor.ref));
      } else {
        if (index === -1) {fail('condition_not_found');}
        if (operation.op === 'remove') {records.splice(index, 1);}
        else {records[index] = validateRecord(operation.record, actor.ref);}
      }
    }
    token.state.conditions = records;
    token.state.actorContract.revision += 1;
    entries.push({ ref: actor.ref, beforeRevision: actor.expectedRevision, afterRevision: actor.expectedRevision + 1, finalResources: resources(token, actor.ref.kind), conditions: clone(records) });
  }
  const receipt = { version: 1, roomId: room.id, commandId: command.commandId, submitterUid: uid, contentHash: hash(command), admissionEpoch: epoch(room),
    commitSequence: prior.commitSequence + 1, checkpointRevision: 0, actors: entries, authorization, acceptedAt: Date.now() };
  if (command.source) {receipt.source = clone(command.source);}
  if (command.target) {receipt.target = clone(command.target);}
  if (command.adjudication) {receipt.adjudication = clone(command.adjudication);}
  if (!Number.isSafeInteger(receipt.commitSequence)) {fail('revision_exhausted');}
  const retained = clone(prior.receipts);
  let replayFloor = prior.replayFloor;
  // Only a CONFIRMED prefix can go; pending memory receipts are never evicted.
  while (retained.length + 1 > 256 || bytes([...retained, receipt]) > 512 * 1024) {
    if (!retained.length || retained[0].checkpointRevision === null || retained[0].checkpointRevision > confirmedRevision) {fail('receipt_capacity');}
    replayFloor = retained.shift().commitSequence;
  }
  next.actorConsequences = { version: 1, admissionEpoch: epoch(room), commitSequence: receipt.commitSequence, replayFloor, receipts: [...retained, receipt] };
  const mirrors = checkpoint.deriveRootMirrors(next.maps);
  if (mirrors.collisions.length) {fail('actor_binding_conflict');}
  next.tokens = mirrors.tokens; next.characterTokens = mirrors.characterTokens; next.gridItems = mirrors.gridItems;
  for (const actor of entries) {
    for (const combatant of next.combat?.turnOrder || []) {
      if (hash(combatant.actorRef) !== hash(actor.ref)) {continue;}
      combatant.currentHp = actor.finalResources.hp.current;
      combatant.currentMana = actor.finalResources.mana.current;
      combatant.currentActionPoints = actor.finalResources.ap.current;
    }
  }
  require('./actorProjection').advance(room, next);
  return { next, receipt };
}
// Only these owning-domain maximum paths may cross the legacy write guard.
// Current/temp/conditions and authority metadata remain protected recursively.
function buildPaths(event) {
  const paths = [];
  const maxima = ['maxHp', 'maxMana', 'maxAP', 'maxActionPoints'];
  if (['token_updated', 'creature_updated'].includes(event)) {
    for (const envelope of ['updates', 'stateUpdates']) {
      for (const container of ['', 'state.', 'stats.', 'creature.stats.']) {
        for (const key of maxima) {paths.push(`${envelope}.${container}${key}`);}
      }
      for (const key of ['health', 'mana', 'actionPoints']) {paths.push(`${envelope}.character.${key}.max`);}
    }
  }
  if (['character_token_updated', 'character_updated'].includes(event)) {
    for (const key of ['health', 'mana', 'actionPoints']) {paths.push(`character.${key}.max`);}
  }
  return paths;
}
function protectedPath(value, depth = 0, allowed = [], prefix = '') {
  if (!value || typeof value !== 'object') {return null;}
  if (depth > 20) {return 'depth_limit';}
  for (const [key, child] of Object.entries(value)) {
    const path = `${prefix}${key}`;
    if (PROTECTED.has(key) && !allowed.includes(path) &&
      !(child && typeof child === 'object' && !Array.isArray(child) && allowed.some(candidate => candidate.startsWith(`${path}.`)))) {return key;}
    const found = protectedPath(child, depth + 1, allowed, `${path}.`);
    if (found) {return `${key}.${found}`;}
  }
  return null;
}
function validateBuildEnvelope(event, data) {
  const object = value => value && typeof value === 'object' && !Array.isArray(value) && [Object.prototype, null].includes(Object.getPrototypeOf(value));
  const check = (value, fields) => {
    if (!object(value)) {fail('invalid_bounds');}
    for (const field of fields) {
      if (!own(value, field)) {continue;}
      if (!object(value[field])) {fail('invalid_bounds');}
    }
  };
  const pairs = character => {
    check(character, ['health', 'mana', 'actionPoints']);
    for (const key of ['health', 'mana', 'actionPoints']) {
      if (own(character, key)) {keys(character[key], ['max']);}
    }
  };
  if (['token_updated', 'creature_updated'].includes(event)) {
    for (const key of ['updates', 'stateUpdates']) {
      if (!own(data, key)) {continue;}
      check(data[key], ['state', 'stats', 'character', 'creature']);
      if (own(data[key], 'creature')) {check(data[key].creature, ['stats']);}
      if (own(data[key], 'character')) {pairs(data[key].character);}
    }
  }
  if (['character_token_updated', 'character_updated'].includes(event)) {
    if (own(data, 'character')) {pairs(data.character);}
    if (own(data, 'stateUpdates')) {check(data.stateUpdates, []);}
  }
  for (const path of buildPaths(event)) {
    const parts = path.split('.'); let value = data;
    for (const key of parts.slice(0, -1)) {value = value?.[key];}
    if (own(value, parts[parts.length - 1])) {
      const max = value[parts[parts.length - 1]];
      if (typeof max !== 'number' || !Number.isFinite(max) || max < 0) {fail('invalid_bounds');}
    }
  }
}
function prepareBuildUpdate(token, updates, kind) {
  validateBuildEnvelope('token_updated', { updates });
  const blocked = protectedPath({ updates }, 0, buildPaths('token_updated')) || authorityMetadataPath(updates) || require('./actorProjection').metadataPath(updates);
  if (blocked) {fail('actor_consequence_required');}
  const next = { ...token, ...updates };
  for (const field of ['state', 'stats', 'character', 'creature']) {
    if (own(updates, field)) {next[field] = { ...token[field], ...updates[field] };}
  }
  if (updates.creature?.stats) {next.creature.stats = { ...token.creature?.stats, ...updates.creature.stats };}
  let boundsChanged = false, hasBounds = false;
  const prior = resources(token, kind);
  for (const [pool, [, pcKey, , maxKey]] of Object.entries(POOLS)) {
    const values = [];
    if (kind === 'character') {
      if (own(updates.character, pcKey)) {
        keys(updates.character[pcKey], ['max']);
        next.character[pcKey] = { ...token.character?.[pcKey], ...updates.character[pcKey] };
        if (own(updates.character[pcKey], 'max')) {values.push(updates.character[pcKey].max);}
      }
      // A PC's maxima never originate from creature/state aliases.
      if ([updates, updates.state, updates.stats, updates.creature?.stats].some(value => ['maxHp', 'maxMana', 'maxAP', 'maxActionPoints'].some(key => own(value, key)))) {fail('invalid_bounds');}
    } else {
      if (updates.character && ['health', 'mana', 'actionPoints'].some(key => own(updates.character, key))) {fail('invalid_bounds');}
      for (const value of [updates, updates.state, updates.stats, updates.creature?.stats]) {
        for (const key of pool === 'ap' ? ['maxAP', 'maxActionPoints'] : [maxKey]) {
          if (own(value, key)) {values.push(value[key]);}
        }
      }
    }
    if (!values.length) {continue;}
    hasBounds = true;
    if (values.some(value => value !== values[0])) {fail('invalid_bounds');}
    boundsChanged ||= prior[pool].max !== values[0];
    if (kind !== 'character') {
      next.state = { ...next.state, [maxKey]: values[0] };
      if (pool === 'ap') {next.state.maxActionPoints = values[0];}
    }
  }
  const contract = token.state?.actorContract;
  if (hasBounds && contract) {
    if (contract.version !== 1 || !integer(contract.revision)) {fail('unsupported_actor_contract');}
    if (kind === 'character' && !contract.primary) {fail('secondary_attachment');}
    if (boundsChanged) {
      if (!Number.isSafeInteger(contract.revision + 1)) {fail('revision_exhausted');}
      next.state = { ...next.state, actorContract: { ...contract, revision: contract.revision + 1 } };
    }
  }
  return { token: next, boundsChanged };
}
function installBuildUpdate(room, map, field, id, prepared) {
  // Preflight exhaustion before mutation; installation and cut advance have no await.
  const projection = require('./actorProjection');
  if (!Number.isSafeInteger(projection.current(room).cut + 1)) {fail('projection_order_exhausted');}
  if (checkpoint.deriveRootMirrors(room.gameState.maps).collisions.length) {fail('actor_binding_conflict');}
  map[field][id] = prepared.token;
  const mirrors = checkpoint.deriveRootMirrors(room.gameState.maps);
  room.gameState.tokens = mirrors.tokens; room.gameState.characterTokens = mirrors.characterTokens;
  const contract = prepared.token.state?.actorContract;
  if (contract?.kind === 'character' && contract.primary) {
    for (const player of [...room.players.values(), room.gm].filter(Boolean)) {
      if (player.userId === contract.ownerUid && player.character?.id === contract.characterId) {
        player.character = { ...player.character, ...prepared.token.character };
      }
    }
  }
  if (contract) {
    const values = resources(prepared.token, contract.kind);
    for (const combatant of room.gameState.combat?.turnOrder || []) {
      if (hash(combatant.actorRef) !== hash(refFor(contract))) {continue;}
      combatant.maxHp = values.hp.max; combatant.maxMana = values.mana.max; combatant.maxActionPoints = values.ap.max;
    }
  }
  projection.advance(room);
}
function authorityMetadataPath(value, depth = 0) {
  if (!value || typeof value !== 'object') {return null;}
  if (depth > 20) {return 'depth_limit';}
  for (const [key, child] of Object.entries(value)) {
    if (['actorContract', 'actorConsequences'].includes(key)) {return key;}
    const found = authorityMetadataPath(child, depth + 1);
    if (found) {return `${key}.${found}`;}
  }
  return null;
}
function preserveImportedActorMetadata(gameState) {
  if (own(gameState, 'actorProjection')) {
    gameState.actorConsequenceRecovery = { ...gameState.actorConsequenceRecovery, importedActorProjection: gameState.actorProjection, reason: 'untrusted-local-import' };
    delete gameState.actorProjection;
  }
  for (const map of Object.values(gameState.maps || {})) {
    if (own(map, 'actorProjection')) {
      map.actorProjectionRecovery = { ...map.actorProjectionRecovery, importedActorProjection: map.actorProjection, reason: 'untrusted-local-import' };
      delete map.actorProjection;
    }
    for (const field of ['tokens', 'characterTokens', 'creatures']) {
      for (const token of Object.values(map[field] || {})) {
        for (const [key, retained] of [['actorContract', 'importedActorContract'], ['actorLifecycle', 'importedActorLifecycle']]) {
          if (!own(token.state, key)) {continue;}
          token.state.actorRecovery = { ...token.state.actorRecovery, [retained]: token.state[key] };
          delete token.state[key];
        }
      }
    }
  }
  if (gameState.actorConsequences) {
    gameState.actorConsequenceRecovery = { ...gameState.actorConsequenceRecovery, imported: gameState.actorConsequences, reason: 'untrusted-local-import' };
    delete gameState.actorConsequences;
  }
  return gameState;
}
module.exports = { epoch, ledger, locate, permitted, resources, stage, knownReceipt, validateCommand, validateRef, refFor, hash, bytes, clone, fail, keys, own, publicCondition, publicContract, publicReceipt, protectedPath, authorityMetadataPath, preserveImportedActorMetadata, buildPaths, validateBuildEnvelope, prepareBuildUpdate, installBuildUpdate, CONDITION_FIELDS, POOLS };
