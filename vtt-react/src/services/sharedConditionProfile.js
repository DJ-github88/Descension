/** Closed P14-C1 profile shared by Node/client. No evaluator, clock or action/payment rule. */
const data = require('../data/sharedConditionProfiles.json');
const DEFENDING = Object.freeze(data.defending);
const STUNNED = Object.freeze(data.stunned);
const uuid = value => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
const REF_KEYS = ['kind', 'roomId', 'mapId', 'tokenId', 'instanceId', 'ownerUid', 'characterId'];
const sameRef = (a, b) => !!a && !!b && REF_KEYS.every(k => a[k] === b[k]);
const canonical = value => JSON.stringify(value, (key, child) => child && typeof child === 'object' && !Array.isArray(child)
  ? Object.fromEntries(Object.keys(child).sort().map(k => [k, child[k]])) : child);
const isDefending = r => r?.version === 1 && r.conditionKey === DEFENDING.conditionKey;
const recordsFor = token => (Array.isArray(token?.state?.conditions) ? token.state.conditions : []).filter(isDefending);
const holdsDefending = token => recordsFor(token).length > 0;
const blockingReduction = (face, defending) => face * (defending ? DEFENDING.blockingMultiplier : 1);
const preventsBlockingWear = defending => !!defending && DEFENDING.preventsBlockingWear;
const expiryLabel = (record, combat) => require('./sharedEffectTiming').label(record, combat) || (isStunned(record) ? record.effectSummary : isDefending(record) && record.target?.kind === 'character' ? DEFENDING.expiryLabel :
  record?.sharedTiming === 'manual' ? 'GM manages timing.' : null);
function makeDefendingRecord(target, id, sourceMode = 'manual') {
  if (target?.kind !== 'character' || !REF_KEYS.every(k => typeof target[k] === 'string' && target[k]) || !uuid(id) || !['manual', 'self-defend'].includes(sourceMode)) throw Error('Exact primary PC, UUID instance and source mode required.');
  // Keep this Node/client module free of object-spread Babel helper imports (CRA otherwise marks CommonJS as ESM).
  return Object.assign({
    version: 1, id, recordId: id, conditionKey: DEFENDING.conditionKey, originalName: DEFENDING.name, name: DEFENDING.name,
    type: 'buff', kind: 'effect', target: JSON.parse(JSON.stringify(target)), targetId: target.tokenId, targetType: 'character',
    source: sourceMode === 'self-defend' ? 'manual-result:universal_defend' : 'manual',
    effectOrigin: DEFENDING.origin, description: DEFENDING.description, effectSummary: DEFENDING.expiryLabel,
    icon: DEFENDING.icon, color: DEFENDING.color, effects: {}, isMagical: false, stackable: false, hasOverTimeEffect: false,
    sharedTiming: 'manual', durationType: 'manual', clockBoundary: DEFENDING.clockBoundary
  }, sourceMode === 'self-defend' ? { sourceActor: JSON.parse(JSON.stringify(target)), sourceEntityId: target.tokenId } : {});
}
function validManagedRecord(record, target) {
  if (record?.effectOrigin === STUNNED.origin) {
    try { return canonical(record) === canonical(makeStunnedRecord(target, record.recordId, {
      sourceOccurrence: record.sourceEntityId, timing: record.clockBoundary, sourceActor: record.sourceActor, authoredDuration: record.authoredDuration
    })); } catch (_) { return false; }
  }
  if (!record || !uuid(record.recordId) || record.effectOrigin !== DEFENDING.origin || record.target?.kind !== 'character' || !sameRef(record.target, target) || !REF_KEYS.every(k => typeof target[k] === 'string' && target[k])) return false;
  const expected = makeDefendingRecord(target, record.recordId, record.source === 'manual-result:universal_defend' ? 'self-defend' : 'manual');
  return canonical(record) === canonical(expected);
}
function makeStunnedRecord(target, id, { sourceOccurrence, timing = 'manual', sourceActor, authoredDuration } = {}) {
  const validRef = ref => ref && ['creature', 'character'].includes(ref.kind) &&
    (ref.kind === 'character' ? REF_KEYS : REF_KEYS.slice(0, 5)).every(k => typeof ref[k] === 'string' && ref[k]) &&
    Object.keys(ref).every(k => (ref.kind === 'character' ? REF_KEYS : REF_KEYS.slice(0, 5)).includes(k));
  if (!validRef(target) || !uuid(id) || typeof sourceOccurrence !== 'string' || !sourceOccurrence.trim() ||
      sourceOccurrence !== sourceOccurrence.trim() || sourceOccurrence.length > 160 || !Object.prototype.hasOwnProperty.call(STUNNED.timings, timing) ||
      (sourceActor && (!validRef(sourceActor) || sourceActor.roomId !== target.roomId))) throw Error('Exact actor, UUID, source occurrence and known timing required.');
  const authored = sourceOccurrence.startsWith('authored-condition:');
  // Public PC-target views omit sourceActor; the authored binder still requires the exact full record.
  if ((authored && (!uuid(sourceOccurrence.slice('authored-condition:'.length)) || timing !== 'manual' || typeof authoredDuration !== 'string' || !authoredDuration.trim() || authoredDuration.length > 700)) || (!authored && authoredDuration !== undefined)) throw Error('Authored occurrence requires manual timing and duration.');
  return Object.assign({ version: 1, id, recordId: id, conditionKey: 'stunned', originalName: STUNNED.name, name: STUNNED.name,
    type: STUNNED.type, kind: 'effect', target: JSON.parse(JSON.stringify(target)), targetId: target.tokenId, targetType: target.kind,
    source: 'manual-resolved:stunned', sourceEntityId: sourceOccurrence, effectOrigin: STUNNED.origin, description: STUNNED.description,
    effectSummary: authored ? `${authoredDuration} — GM removes.` : STUNNED.timings[timing], icon: STUNNED.icon, color: STUNNED.color, effects: {}, isMagical: false,
    stackable: true, hasOverTimeEffect: false, sharedTiming: 'manual', durationType: 'manual', clockBoundary: timing
  }, sourceActor ? { sourceActor: JSON.parse(JSON.stringify(sourceActor)) } : {}, authored ? { authoredDuration } : {});
}
function isStunned(record) { return record?.effectOrigin === STUNNED.origin && validManagedRecord(record, record.target); }
const stunnedRecordsFor = token => (Array.isArray(token?.state?.conditions) ? token.state.conditions : []).filter(r =>
  isStunned(r) && sameRef(r.target, token.state?.actorContract));
const holdsStunned = token => stunnedRecordsFor(token).length > 0;
const sameStunnedSource = (a, b) => a.sourceEntityId === b.sourceEntityId && canonical(a.sourceActor || null) === canonical(b.sourceActor || null);
exports.STUNNED = STUNNED;
exports.makeStunnedRecord = makeStunnedRecord;
exports.isStunned = isStunned;
exports.stunnedRecordsFor = stunnedRecordsFor;
exports.holdsStunned = holdsStunned;
exports.sameStunnedSource = sameStunnedSource;
exports.DEFENDING = DEFENDING;
exports.REF_KEYS = REF_KEYS;
exports.sameRef = sameRef;
exports.canonical = canonical;
exports.isDefending = isDefending;
exports.recordsFor = recordsFor;
exports.holdsDefending = holdsDefending;
exports.blockingReduction = blockingReduction;
exports.preventsBlockingWear = preventsBlockingWear;
exports.expiryLabel = expiryLabel;
exports.makeDefendingRecord = makeDefendingRecord;
exports.validManagedRecord = validManagedRecord;
