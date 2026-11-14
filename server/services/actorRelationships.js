const actors = require('./actorConsequences');

const VERSION = 1;
const VALUES = Object.freeze(['ally', 'enemy', 'neutral']);
const REF_KEYS = Object.freeze(['kind', 'roomId', 'mapId', 'tokenId', 'instanceId', 'ownerUid', 'characterId']);
const MAX_PAIRS = 64;

const integer = value => Number.isSafeInteger(value) && value >= 0;
const fail = (code, message = code) => { const error = new Error(message); error.code = code; throw error; };

function refKey(ref) {
  return JSON.stringify(REF_KEYS.filter(key => ref[key] !== undefined).map(key => [key, ref[key]]));
}

function pairKey(a, b) {
  return actors.hash([refKey(a), refKey(b)].sort());
}

function stored(room) {
  const record = room?.gameState?.actorRelationships;
  if (record === undefined) {return null;}
  if (!record || typeof record !== 'object' || Array.isArray(record) || record.version !== VERSION ||
    !integer(record.revision) || !record.pairs || typeof record.pairs !== 'object' || Array.isArray(record.pairs)) {
    fail('relationship_contract_unavailable', 'The stored relationship contract is not a supported version or shape.');
  }
  return record;
}

function revision(room) {
  return stored(room)?.revision || 0;
}

function get(room, a, b) {
  actors.validateRef(a);
  actors.validateRef(b);
  const record = stored(room);
  if (!record) {return 'neutral';}
  const pair = record.pairs[pairKey(a, b)];
  return pair && VALUES.includes(pair.value) ? pair.value : 'neutral';
}

function planSet(room, pairs, value, options = {}) {
  if (!room || !options.gmUid || room.gmId !== options.gmUid) {return { ok: false, code: 'relationship_forbidden' };}
  if (!VALUES.includes(value) || !Array.isArray(pairs) || pairs.length === 0 || pairs.length > MAX_PAIRS) {
    return { ok: false, code: 'relationship_invalid' };
  }
  let record;
  try {
    record = stored(room);
  } catch (error) {
    return { ok: false, code: error.code || 'relationship_contract_unavailable' };
  }
  if (!integer(options.expectedRevision) || options.expectedRevision !== (record?.revision || 0)) {
    return { ok: false, code: 'relationship_revision_conflict' };
  }
  const next = actors.clone(room.gameState);
  const current = next.actorRelationships
    ? actors.clone(next.actorRelationships)
    : { version: VERSION, revision: 0, pairs: {} };
  const updatedAt = Date.now();
  const ops = [];
  const seen = new Set();
  for (const pair of pairs) {
    if (!pair || typeof pair !== 'object') {return { ok: false, code: 'relationship_invalid' };}
    try {
      actors.validateRef(pair.a);
      actors.validateRef(pair.b);
      actors.locate(room, pair.a, true);
      actors.locate(room, pair.b, true);
    } catch (_) {
      return { ok: false, code: 'relationship_actor_missing' };
    }
    if (pair.a.roomId !== room.id || pair.b.roomId !== room.id) {return { ok: false, code: 'relationship_actor_missing' };}
    if (actors.hash(pair.a) === actors.hash(pair.b)) {return { ok: false, code: 'relationship_invalid' };}
    const key = pairKey(pair.a, pair.b);
    if (seen.has(key)) {continue;}
    seen.add(key);
    current.pairs[key] = { a: actors.clone(pair.a), b: actors.clone(pair.b), value, updatedAt };
    ops.push({ key, a: actors.clone(pair.a), b: actors.clone(pair.b), value });
  }
  if (!ops.length) {return { ok: false, code: 'relationship_invalid' };}
  current.version = VERSION;
  current.revision += 1;
  next.actorRelationships = current;
  return { ok: true, next, revision: current.revision, ops };
}

function planRecruitAlliance(room, sourceRef, actorRefs, options = {}) {
  return planSet(room, actorRefs.map(ref => ({ a: sourceRef, b: ref })), 'ally', options);
}

function project(room, a, b) {
  return get(room, a, b);
}

module.exports = { VERSION, VALUES, MAX_PAIRS, revision, get, planSet, planRecruitAlliance, pairKey, refKey, project };
