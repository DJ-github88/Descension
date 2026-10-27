/** A7 shared data mapping. C2 owns mechanics; no save resolver or timer. */
const { makeStunnedRecord } = require('./sharedConditionProfile');
const CAPABILITY = 'authored-condition:v1';
const isCondition = approval => approval?.spell?.definitionHash?.startsWith(`${CAPABILITY}/`) === true;
const namedRecord = record => String(record?.sourceEntityId || '').startsWith('authored-condition:');
function recordFor(approval) {
  return makeStunnedRecord(approval.target, approval.approvalId, { sourceActor: approval.source,
    sourceOccurrence: `authored-condition:${approval.approvalId}`, timing: 'manual',
    authoredDuration: approval.source.kind === 'character' ? approval.conditionTerms.timing.durationText : approval.target.kind === 'character' ? approval.resolution.timing.durationText : `${approval.resolution.timing.durationText} (${approval.resolution.timingNote})` });
}
function resultFor(approval) {
  return { capability: CAPABILITY, approvalId: approval.approvalId, kind: 'condition', conditionKey: 'stunned',
    conditionInstanceId: approval.approvalId, spellName: approval.spell.name, gmConfirmed: true, resolution: approval.resolution };
}
module.exports = { CAPABILITY, isCondition, namedRecord, recordFor, resultFor };
