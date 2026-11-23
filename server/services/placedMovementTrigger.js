/**
 * Event-driven evaluator for placed map effect movement-entry triggers (`placed-effect:v1`).
 *
 * Evaluates strictly on committed movement (never drag previews, room loads, or zero-displacement)
 * and reuses `passiveMovementTrigger` footprint geometry, condition building, and consequence commits.
 * Fail-closed in production whenever `placedEffectPolicy.armedApproved()` is false.
 */
const crypto = require('crypto');
const actors = require('./actorConsequences');
const placed = require('./placedEffect');
const policy = require('../shared/services/placedEffectPolicy');
const actorRelationships = require('./actorRelationships');
const installedAuthoredAbilities = require('./installedAuthoredAbilities');
const pure = require('../shared/services/authoredAbility');
const profile = require('../shared/services/sharedConditionProfile');
const {
  isInsideRadius,
  buildConditionRecord,
  commitPassiveConsequence
} = require('./passiveMovementTrigger');

function conditionAlreadyActiveFromPlaced(moverToken, placement) {
  const records = moverToken?.state?.conditions;
  if (!Array.isArray(records) || records.length === 0) return false;
  return records.some(record =>
    record &&
    record.effectDefinition === placement.sourceRecordId &&
    profile.sameRef(record.sourceActor, placement.owner)
  );
}

function matchesActorAndRelationship(room, ownerRef, moverRef, eligibility) {
  if (!eligibility || !ownerRef || !moverRef) return false;
  if (eligibility.actorKind === 'creature') {
    if (moverRef.kind !== 'creature') return false;
  } else if (eligibility.actorKind !== 'any') {
    return false;
  }

  const sameActor = profile.sameRef(ownerRef, moverRef);
  if (sameActor) return false;

  const rel = eligibility.relationship;
  if (rel === 'any') return true;
  if (rel === 'enemy' || rel === 'ally') {
    return actorRelationships.get(room, ownerRef, moverRef) === rel;
  }
  return false;
}

function isVoluntaryMove(moveEvent) {
  if (!moveEvent) return false;
  if (moveEvent.isTeleport === true || moveEvent.forcedMovement === true) return false;
  if (moveEvent.movementKind === 'teleport' || moveEvent.movementKind === 'forced') return false;
  return true;
}

function notifyPlacedChange(room, beforeAudience, runtime = {}) {
  const { io, rooms, players } = runtime;
  if (!io || !rooms || !players) return;
  const afterAudience = placed.audience(room);
  const payload = { roomId: room.id };
  const isPublic = beforeAudience.publicChange || afterAudience.publicChange;
  const allowedUids = isPublic
    ? null
    : new Set([room.gmId, ...beforeAudience.ownerUids, ...afterAudience.ownerUids]);

  const roomSockets = io.sockets?.adapter?.rooms?.get?.(room.id);
  if (!roomSockets) return;
  for (const socketId of roomSockets) {
    const player = players.get(socketId);
    if (!player) continue;
    const isCurrentRoomMember = !player.roomId || player.roomId === room.id;
    if (!isCurrentRoomMember) continue;
    if (allowedUids && !allowedUids.has(player.userId) && !player.isGM) continue;
    io.to(socketId).emit('actor_placed_effect_changed', payload);
  }
}

function evaluateMovement(room, moveEvent, runtime = {}) {
  const results = [];
  if (!policy.armedApproved()) return results;
  if (!room?.gameState || !moveEvent || moveEvent.isDragging) return results;

  const currentLedger = placed.stored(room);
  if (!currentLedger || !Array.isArray(currentLedger.placements) || currentLedger.placements.length === 0) {
    return results;
  }

  const {
    moverToken,
    mapId,
    fromPosition,
    toPosition,
    actionId
  } = moveEvent;

  if (!moverToken || typeof mapId !== 'string' || !fromPosition || !toPosition) return results;
  if (!Number.isFinite(fromPosition.x) || !Number.isFinite(fromPosition.y) ||
      !Number.isFinite(toPosition.x) || !Number.isFinite(toPosition.y)) {
    return results;
  }
  if (fromPosition.x === toPosition.x && fromPosition.y === toPosition.y) {
    return results;
  }

  const moverContract = moverToken?.state?.actorContract;
  if (!moverContract || moverContract.version !== 1) return results;
  let moverRef;
  try {
    moverRef = actors.refFor(moverContract);
    actors.validateRef(moverRef);
  } catch (_) {
    return results;
  }
  if (moverRef.roomId !== room.id || moverRef.mapId !== mapId) {
    return results;
  }

  let metrics;
  try {
    metrics = installedAuthoredAbilities.mapGridMetrics(room, mapId);
  } catch (_) {
    return results;
  }
  const creaturesCatalog = room.gameState.creatures || [];
  const candidateIds = currentLedger.placements
    .filter(p => p && p.location?.mapId === mapId && p.armed === true && p.state !== 'consumed')
    .map(p => p.placementId);

  if (candidateIds.length === 0) return results;

  const { firebaseBatchWriter: writer } = runtime;

  for (const placementId of candidateIds) {
    const liveLedger = placed.stored(room);
    const placement = liveLedger?.placements?.find(p => p.placementId === placementId);
    if (!placement || placement.location?.mapId !== mapId) continue;

    const evaluated = placed.evaluatePlacement(room, placement);
    if (!evaluated.ok || evaluated.state !== 'armed') continue;
    if (!placement.resolvedEffect?.condition || !placement.resolvedEffect?.timing) continue;

    const eligibility = placement.rulesSnapshot?.triggerEligibility;
    if (!eligibility) continue;
    if (eligibility.voluntaryMoveOnly !== false && !isVoluntaryMove(moveEvent)) continue;
    if (!matchesActorAndRelationship(room, placement.owner, moverRef, eligibility)) continue;

    const moveKey = (typeof actionId === 'string' && actionId.trim().length > 0)
      ? actors.hash({
          kind: 'placed-move',
          actionId,
          placementId: placement.placementId,
          mapId,
          mover: moverRef
        })
      : null;

    if (moveKey && Array.isArray(liveLedger.processedMoves) && liveLedger.processedMoves.includes(moveKey)) {
      continue;
    }

    let liveMover;
    try {
      liveMover = actors.locate(room, moverRef);
    } catch (_) {
      continue;
    }

    const radiusFeet = placement.location.radiusFeet;
    const centerPos = placement.location.position;
    const wasInside = isInsideRadius(centerPos, fromPosition, liveMover.token, radiusFeet, metrics, creaturesCatalog);
    const nowInside = isInsideRadius(centerPos, toPosition, liveMover.token, radiusFeet, metrics, creaturesCatalog);
    if (wasInside || !nowInside) continue;

    if (conditionAlreadyActiveFromPlaced(liveMover.token, placement)) continue;

    const beforeAudience = placed.audience(room);
    const confirmedRevision = Math.max(room.checkpointRevision || 0, writer?.getStatus?.(room.id)?.confirmedRevision || 0);

    try {
      const recordId = crypto.randomUUID();
      const synthItem = {
        target: placement.owner,
        sourceRecordId: placement.sourceRecordId,
        effects: { condition: placement.resolvedEffect.condition },
        timing: { durationText: placement.resolvedEffect.timing.durationText }
      };
      const conditionRecord = buildConditionRecord(moverRef, recordId, synthItem);
      const command = {
        version: 1,
        roomId: room.id,
        commandId: crypto.randomUUID(),
        actionEpoch: actors.epoch(room),
        baseCommitSequence: actors.ledger(room).commitSequence,
        source: placement.owner,
        target: moverRef,
        actors: [{
          ref: moverRef,
          expectedRevision: liveMover.contract.revision,
          conditions: [{ op: 'add', recordId, record: conditionRecord }]
        }],
        adjudication: {
          definitionId: placement.sourceRecordId,
          definitionVersionOrHash: `${pure.PASSIVE_ENTRY_CAPABILITY}/${placement.definitionRef.definitionHash}`,
          chosenResult: JSON.stringify({
            capability: pure.PASSIVE_ENTRY_CAPABILITY,
            placedContract: placed.CONTRACT,
            placementId: placement.placementId,
            family: placement.family,
            abilityName: placement.abilityName,
            trigger: 'placed-movement-entry',
            actionId: typeof actionId === 'string' ? actionId : null,
            condition: placement.resolvedEffect.condition,
            conditionRecordId: recordId
          }),
          adjustmentReason: `Placed effect "${placement.abilityName}" triggered on movement entry.`
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

      const nextLedger = staged.next[placed.LEDGER_KEY];
      if (nextLedger && Array.isArray(nextLedger.placements)) {
        const idx = nextLedger.placements.findIndex(p => p.placementId === placement.placementId);
        if (idx >= 0) {
          const expiryMode = placement.rulesSnapshot?.expiry || 'consume-on-first-trigger';
          if (expiryMode === 'consume-on-first-trigger') {
            nextLedger.placements[idx] = {
              ...nextLedger.placements[idx],
              state: 'consumed',
              consumedAtCommit: staged.receipt.commitSequence,
              consumedBy: actors.clone(moverRef),
              consumedActionId: typeof actionId === 'string' ? actionId : null
            };
          }
          nextLedger.revision = (nextLedger.revision || 0) + 1;
        }
        if (moveKey) {
          const priorMoves = Array.isArray(nextLedger.processedMoves) ? nextLedger.processedMoves : [];
          nextLedger.processedMoves = [...priorMoves, moveKey].slice(-placed.MAX_PROCESSED_MOVES);
        }
      }

      commitPassiveConsequence(room, staged, confirmedRevision, runtime);
      notifyPlacedChange(room, beforeAudience, runtime);
      results.push({
        placementId: placement.placementId,
        state: staged.next?.[placed.LEDGER_KEY]?.placements?.find(p => p.placementId === placement.placementId)?.state || placement.state,
        receipt: staged.receipt,
        record: conditionRecord
      });
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[placedMovementTrigger] skipped consequence:', error?.code || error?.message || error);
      }
    }
  }

  return results;
}

module.exports = {
  evaluateMovement,
  conditionAlreadyActiveFromPlaced,
  matchesActorAndRelationship
};
