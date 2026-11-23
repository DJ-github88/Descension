/**
 * Event-driven evaluator for authored passive turn-boundary triggers (`authored-passive-turn:v1`).
 *
 * Triggered exclusively by authenticated `actor_turn_boundary` transitions (`mode === 'advance'`)
 * — never by `mode === 'adopt'`, wall-clock timers, or legacy `combat_turn_changed` events.
 * Applies the authored non-periodic `gm-manual` condition onto self automatically without
 * opening an 8-second reaction declaration window and without stacking duplicates while active.
 */
const crypto = require('crypto');
const actors = require('./actorConsequences');
const passiveActivation = require('./passiveActivation');
const actorRelationships = require('./actorRelationships');
const pure = require('../shared/services/authoredAbility');
const {
  conditionAlreadyActiveFromPassive,
  buildConditionRecord,
  commitPassiveConsequence
} = require('./passiveMovementTrigger');

function matchesWhoseTurn(room, ownerRef, boundaryRef, whoseTurn) {
  if (!ownerRef || !boundaryRef) return false;
  if (whoseTurn === 'any') return true;
  const sameActor = actors.hash(ownerRef) === actors.hash(boundaryRef);
  if (whoseTurn === 'self') return sameActor;
  if (whoseTurn === 'ally' || whoseTurn === 'enemy') {
    if (sameActor) return false;
    return actorRelationships.get(room, ownerRef, boundaryRef) === whoseTurn;
  }
  return false;
}

function boundaryActorFor(item, outgoingRef, incomingRef) {
  if (item?.trigger?.kind === 'turn_start') return incomingRef || null;
  if (item?.trigger?.kind === 'turn_end') return outgoingRef || null;
  return null;
}

function evaluateTurnBoundary(room, boundaryEvent, runtime = {}) {
  const results = [];
  if (!room?.gameState || !boundaryEvent) return results;

  const { combatId, sequence, round, outgoingRef, incomingRef } = boundaryEvent;
  if (typeof combatId !== 'string' || !combatId.trim() || !Number.isSafeInteger(sequence) || sequence < 1) {
    return results;
  }

  const storedLedger = passiveActivation.stored(room);
  const passiveActivations = (storedLedger?.activations || []).filter(item => item?.passiveKind === pure.PASSIVE_TURN_CAPABILITY);
  if (!passiveActivations.length) return results;

  const { firebaseBatchWriter: writer } = runtime;
  const confirmedRevision = Math.max(room.checkpointRevision || 0, writer?.getStatus?.(room.id)?.confirmedRevision || 0);

  for (const item of passiveActivations) {
    const boundaryRef = boundaryActorFor(item, outgoingRef, incomingRef);
    if (!boundaryRef) continue;
    try {
      actors.validateRef(boundaryRef);
    } catch (_) {
      continue;
    }
    if (boundaryRef.roomId !== room.id) continue;

    const evaluated = passiveActivation.evaluateActivation(room, item);
    if (!evaluated.ok || evaluated.state !== 'active') continue;

    if (!matchesWhoseTurn(room, item.target, boundaryRef, item.trigger?.whoseTurn)) continue;

    const currentLedger = passiveActivation.stored(room);
    const boundaryKey = actors.hash({
      kind: 'passive-turn',
      activationId: item.activationId,
      trigger: item.trigger.kind,
      combatId,
      sequence
    });
    if ((currentLedger?.processedBoundaries || []).includes(boundaryKey)) continue;

    let ownerLocated;
    try {
      ownerLocated = actors.locate(room, item.target);
    } catch (_) {
      continue;
    }

    if (conditionAlreadyActiveFromPassive(room, ownerLocated.token, item)) continue;

    try {
      const recordId = crypto.randomUUID();
      const conditionRecord = buildConditionRecord(item.target, recordId, item);
      const command = {
        version: 1,
        roomId: room.id,
        commandId: crypto.randomUUID(),
        actionEpoch: actors.epoch(room),
        baseCommitSequence: actors.ledger(room).commitSequence,
        source: item.target,
        target: item.target,
        actors: [{
          ref: item.target,
          expectedRevision: ownerLocated.contract.revision,
          conditions: [{ op: 'add', recordId, record: conditionRecord }]
        }],
        adjudication: {
          definitionId: item.sourceRecordId,
          definitionVersionOrHash: `${pure.PASSIVE_TURN_CAPABILITY}/${item.definitionRef.definitionHash}`,
          chosenResult: JSON.stringify({
            capability: pure.PASSIVE_TURN_CAPABILITY,
            passiveName: item.name,
            activationId: item.activationId,
            trigger: item.trigger.kind,
            whoseTurn: item.trigger.whoseTurn,
            combatId,
            sequence,
            round: Number.isSafeInteger(round) ? round : null,
            boundaryActor: boundaryRef,
            condition: item.effects.condition,
            conditionRecordId: recordId
          }),
          adjustmentReason: `Passive "${item.name}" fired: ${item.trigger.whoseTurn} ${item.trigger.kind === 'turn_start' ? 'turn start' : 'turn end'}.`
        }
      };

      const staged = actors.stage(
        room,
        { isGM: true },
        room.gmId,
        command,
        { kind: 'gm', authorizerUid: room.gmId },
        confirmedRevision,
        actors.PASSIVE_TRIGGER_STAGE
      );
      if (staged.existing) continue;

      if (staged.next[passiveActivation.LEDGER_KEY]) {
        const priorBoundaries = Array.isArray(staged.next[passiveActivation.LEDGER_KEY].processedBoundaries)
          ? staged.next[passiveActivation.LEDGER_KEY].processedBoundaries
          : [];
        staged.next[passiveActivation.LEDGER_KEY].processedBoundaries = [...priorBoundaries, boundaryKey]
          .slice(-passiveActivation.MAX_PROCESSED_BOUNDARIES);
      }

      commitPassiveConsequence(room, staged, confirmedRevision, runtime);
      results.push({ activationId: item.activationId, receipt: staged.receipt, record: conditionRecord });
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[passiveTurnTrigger] skipped consequence:', error?.code || error?.message || error);
      }
    }
  }

  return results;
}

module.exports = {
  evaluateTurnBoundary,
  matchesWhoseTurn
};
