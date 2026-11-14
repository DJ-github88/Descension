/** GM-only relationship-set command. Reuses the accepted actorRelationships.planSet
 * contract and the shared actor-consequence receipt/checkpoint finalizer. */
const actors = require('./actorConsequences');
const relationships = require('./actorRelationships');

const VERSION = 1;
const SET_KEYS = Object.freeze(['version', 'roomId', 'commandId', 'actionEpoch', 'baseCommitSequence',
  'pairs', 'value', 'expectedRelationshipRevision']);
const PAIR_KEYS = Object.freeze(['a', 'b']);
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_BYTES = 16 * 1024;

const string = value => typeof value === 'string' && value.length > 0 && value.length <= 300;
const integer = value => Number.isSafeInteger(value) && value >= 0;
const fail = (code, message = code) => { const error = new Error(message); error.code = code; throw error; };

function validate(request) {
  if (!request || typeof request !== 'object' || Array.isArray(request) ||
      ![Object.prototype, null].includes(Object.getPrototypeOf(request)) ||
      Object.keys(request).some(key => !SET_KEYS.includes(key))) {fail('invalid_relationship');}
  if (request.version !== VERSION || !string(request.roomId) || !UUID.test(request.commandId || '') ||
      !string(request.actionEpoch) || !integer(request.baseCommitSequence) ||
      !Array.isArray(request.pairs) || request.pairs.length === 0 || request.pairs.length > relationships.MAX_PAIRS ||
      !relationships.VALUES.includes(request.value) || !integer(request.expectedRelationshipRevision) ||
      actors.bytes(request) > MAX_BYTES) {fail('invalid_relationship');}
  for (const pair of request.pairs) {
    if (!pair || typeof pair !== 'object' || Array.isArray(pair) || Object.keys(pair).some(key => !PAIR_KEYS.includes(key))) {
      fail('invalid_relationship');
    }
    try {
      actors.validateRef(pair.a);
      actors.validateRef(pair.b);
    } catch (error) {
      fail('invalid_relationship', error.message);
    }
  }
}

function stage(room, player, uid, request, confirmedRevision) {
  validate(request);
  if (!player || player.isGM !== true) {fail('forbidden');}
  if (request.roomId !== room.id) {fail('invalid_relationship');}

  const prior = actors.ledger(room);
  if (request.actionEpoch !== actors.epoch(room)) {fail('outcome_unknown');}
  if (request.baseCommitSequence < prior.replayFloor) {fail('retry_window_expired');}
  if (request.baseCommitSequence > prior.commitSequence) {fail('invalid_relationship');}

  const plan = relationships.planSet(room, request.pairs, request.value,
    { gmUid: uid, expectedRevision: request.expectedRelationshipRevision });
  if (!plan.ok) {fail(plan.code);}

  const command = {
    ...request,
    adjudication: {
      definitionId: 'actor-relationship:v1',
      definitionVersionOrHash: 'actor-relationship:v1',
      chosenResult: JSON.stringify({
        capability: 'actor-relationship:v1',
        revision: plan.revision,
        value: request.value,
        pairCount: plan.ops.length
      }),
      adjustmentReason: 'GM-only symmetric source-relative relationship set. Exact actor refs are located and checked against the current revision; the pairs are stored in the room gameState checkpoint. No hostility is inferred from ownership, party or combat.'
    }
  };
  const staged = actors.finishStage(room, uid, command, { kind: 'gm-relationship', authorizerUid: uid },
    confirmedRevision, plan.next, []);
  staged.receipt.contentHash = actors.hash(request);
  staged.revision = plan.revision;
  staged.ops = plan.ops;
  return staged;
}

function receiptPlan(receipt) {
  try {
    const chosen = JSON.parse(receipt?.adjudication?.chosenResult || '{}');
    return {
      revision: integer(chosen.revision) ? chosen.revision : null,
      value: relationships.VALUES.includes(chosen.value) ? chosen.value : null
    };
  } catch (_) {
    return { revision: null, value: null };
  }
}

module.exports = { VERSION, SET_KEYS, PAIR_KEYS, MAX_BYTES, validate, stage, receiptPlan };
