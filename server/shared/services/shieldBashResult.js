/** Closed manual-result adapter. C2 still owns the Stunned record and all mechanics. */
const profile = require('./sharedConditionProfile');
const DEFINITION_ID = 'universal_shield_bash';
const SOURCE_HASH = '89bebadaa3b079de5c22ad2bebc823ab3f1bad87a0e35b1d6b245ee6c2802fab';
const PREFIX = DEFINITION_ID + ':';
const TIMING = 'shield-bash-target-end';
const BOUNDARY = 'Manual result: the GM has adjudicated Shield Bash. This records its Stunned effect only; rolls, costs and other effects are handled separately.';
const EXPIRY = "Until the end of the target's next turn — GM removes.";
const uuid = value => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
const namedRecord = record => typeof record?.sourceEntityId === 'string' && record.sourceEntityId.startsWith(PREFIX);
function makeRecord(source, target, resultId) {
  if (!uuid(resultId) || !source) throw Error('Exact source, target and Shield Bash result UUID required.');
  return profile.makeStunnedRecord(target, resultId, { sourceActor: source, sourceOccurrence: PREFIX + resultId, timing: TIMING });
}
function metadata(source, target, resultId) {
  makeRecord(source, target, resultId);
  return { definitionId: DEFINITION_ID, definitionHash: SOURCE_HASH, resultId, source, target, stunnedConfirmed: true };
}
function readResult(command) {
  try { return JSON.parse(command?.adjudication?.chosenResult).manualResult || null; } catch (_) { return null; }
}
function validCommand(command) {
  try {
    const r = readResult(command), actor = command.actors[0], operation = actor.conditions[0];
    return r && profile.canonical(r) === profile.canonical(metadata(r.source, r.target, r.resultId)) &&
      command.commandId === r.resultId && command.actors.length === 1 && profile.sameRef(actor.ref, r.target) &&
      profile.sameRef(command.target, r.target) && !command.source && !command.approval &&
      Object.keys(actor).every(key => ['ref', 'expectedRevision', 'conditions'].includes(key)) && actor.conditions.length === 1 &&
      operation.op === 'add' && operation.recordId === r.resultId &&
      profile.canonical(operation.record) === profile.canonical(makeRecord(r.source, r.target, r.resultId)) &&
      command.adjudication.definitionId === profile.STUNNED.definitionId && command.adjudication.definitionVersionOrHash === profile.STUNNED.origin;
  } catch (_) { return false; }
}
exports.DEFINITION_ID = DEFINITION_ID;
exports.SOURCE_HASH = SOURCE_HASH;
exports.PREFIX = PREFIX;
exports.TIMING = TIMING;
exports.BOUNDARY = BOUNDARY;
exports.EXPIRY = EXPIRY;
exports.namedRecord = namedRecord;
exports.makeRecord = makeRecord;
exports.metadata = metadata;
exports.readResult = readResult;
exports.validCommand = validCommand;
