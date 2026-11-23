/**
 * Event-driven evaluator for authored passive movement-entry triggers (`authored-passive-entry:v1`).
 *
 * Triggered directly by `token_moved` (MovementDebouncer.flush) and `character_moved`
 * for the single move that just occurred — never scans on ticks/intervals.
 *
 * Deliberately left open/unsettled (not fired automatically here):
 * - teleport (`isTeleport === true` or `movementKind === 'teleport'`)
 * - forced movement (`forcedMovement === true` or `movementKind === 'forced'`)
 * - re-entry while/after the passive's condition record was applied (no duplicate/stacking; re-entry policy unsettled)
 */
const crypto = require('crypto');
const actors = require('./actorConsequences');
const checkpoint = require('./roomCheckpoint');
const passiveActivation = require('./passiveActivation');
const installedAuthoredAbilities = require('./installedAuthoredAbilities');
const actorRelationships = require('./actorRelationships');
const actorProjection = require('./actorProjection');
const pure = require('../shared/services/authoredAbility');
const profile = require('../shared/services/sharedConditionProfile');

const MAX_PROCESSED_MOVES = 256;

const sessionUid = (room, player, socketId) => player.userId ||
  (player.isGM && room.gm?.id === player.id && room.gm?.socketId === socketId ? room.gmId : null);

function deliverToEntitledRoomSessions(io, rooms, players, room, event, payload) {
  if (!io || !players || !room) return;
  for (const [sid, player] of players) {
    const peer = io.sockets?.sockets?.get?.(sid);
    if (!peer?.data?.authenticated) continue;
    if (rooms && rooms.get(room.id) !== room) continue;
    if (player.roomId !== room.id || sessionUid(room, player, sid) !== peer.data.userId) continue;
    if (player.isGM && !(room.gm?.id === player.id && room.gm?.socketId === sid && peer.data.userId === room.gmId)) continue;
    if (!player.isGM && room.players?.get(player.id) !== player) continue;
    try { io.to(sid).emit(event, payload); } catch (_) { /* best-effort delivery after state commit */ }
  }
}

function isInsideRadius(ownerPos, moverPos, moverToken, radiusFeet, metrics, creaturesCatalog) {
  const { gridType, gridSize, feetPerTile, offsetX, offsetY } = metrics;
  if (gridType !== 'square' || !Number.isFinite(gridSize) || gridSize <= 0 || !Number.isFinite(feetPerTile) || feetPerTile <= 0) {
    return false;
  }
  const radiusPx = (radiusFeet / feetPerTile) * gridSize;
  const footprint = pure.tokenFootprintForArea(moverToken, creaturesCatalog);
  const cells = pure.occupiedGridCells(moverPos, footprint, gridSize, offsetX, offsetY);
  if (cells) {
    return cells.some(cell => pure.circleCellOverlap(ownerPos, radiusPx, cell, gridSize, offsetX, offsetY) === 'candidate');
  }
  return Math.hypot(moverPos.x - ownerPos.x, moverPos.y - ownerPos.y) <= radiusPx + gridSize * 1e-8;
}

function conditionAlreadyActiveFromPassive(room, moverToken, item) {
  const conditions = Array.isArray(moverToken?.state?.conditions) ? moverToken.state.conditions : [];
  if (!conditions.length) return false;
  if (conditions.some(r => r && r.effectDefinition === item.sourceRecordId && profile.sameRef(r.sourceActor, item.target))) {
    return true;
  }
  if (item.effects?.condition?.kind === 'stunned') {
    const receipts = room.gameState?.actorConsequences?.receipts || [];
    const passiveRecordIds = new Set();
    for (const rec of receipts) {
      if (rec?.adjudication?.definitionId !== item.sourceRecordId) continue;
      try {
        const chosen = typeof rec.adjudication.chosenResult === 'string' ? JSON.parse(rec.adjudication.chosenResult) : null;
        if (chosen?.conditionRecordId) passiveRecordIds.add(chosen.conditionRecordId);
      } catch (_) { /* ignore malformed historical entry */ }
    }
    return conditions.some(r => profile.isStunned(r) && profile.sameRef(r.sourceActor, item.target) && passiveRecordIds.has(r.recordId));
  }
  return false;
}

function buildConditionRecord(moverRef, recordId, item) {
  const condition = item.effects.condition;
  const options = {
    sourceActor: item.target,
    sourceOccurrence: profile.EFFECT_PREFIX + recordId,
    timing: 'manual',
    authoredDuration: item.timing.durationText
  };
  if (condition.kind === 'stunned') {
    return profile.makeStunnedRecord(moverRef, recordId, options);
  }
  if (condition.kind === 'movement') {
    return profile.makeMovementRecord(moverRef, recordId, {
      ...options,
      feet: condition.feet,
      label: condition.label,
      effectDefinition: item.sourceRecordId
    });
  }
  if (condition.kind === 'attribute') {
    return profile.makeAttributeRecord(moverRef, recordId, {
      ...options,
      attribute: condition.attribute,
      amount: condition.amount,
      label: condition.label,
      effectDefinition: item.sourceRecordId
    });
  }
  if (condition.kind === 'damageReduction') {
    return profile.makeDamageReductionRecord(moverRef, recordId, {
      ...options,
      amount: condition.amount,
      label: condition.label,
      effectDefinition: item.sourceRecordId
    });
  }
  actors.fail('unsupported_passive', 'Unsupported passive effect kind.');
}

function installNextState(room, next, writer) {
  room.gameState = next;
  for (const map of Object.values(next.maps || {})) {
    for (const token of Object.values(map.characterTokens || {})) {
      const binding = token.state?.actorContract;
      if (!binding?.primary) continue;
      for (const player of new Set([...(room.players ? room.players.values() : []), room.gm].filter(Boolean))) {
        if (player.userId === binding.ownerUid && player.character?.id === binding.characterId) {
          player.character = {
            ...player.character,
            ...Object.fromEntries(['health', 'mana', 'actionPoints', 'tempHealth', 'tempMana', 'tempActionPoints'].map(k => [k, token.character[k]]))
          };
        }
      }
    }
  }
  if (writer && typeof writer.queueWrite === 'function') {
    writer.queueWrite(room.id, next, false, room.authorityToken ? { authorityToken: room.authorityToken } : undefined);
  }
}

function commitPassiveConsequence(targetRoom, staged, confirmedRevision, runtime = {}) {
  const { io, players, rooms, firebaseBatchWriter: writer } = runtime;
  const liveOnly = targetRoom.isPermanent !== true && !targetRoom.persistentRoomId;
  if (liveOnly || !writer || typeof writer.admitConsequence !== 'function') {
    staged.receipt.checkpointRevision = null;
    const validated = checkpoint.canonicalize(staged.next, 'gameState');
    if (validated.error) actors.fail('CHECKPOINT_INVALID', validated.error);
    installNextState(targetRoom, staged.next, writer);
  } else {
    const admission = writer.admitConsequence(targetRoom.id, revision => {
      staged.receipt.checkpointRevision = revision;
      return staged.next;
    }, next => installNextState(targetRoom, next, null), { authorityToken: targetRoom.authorityToken });
    if (!admission.queued) actors.fail(admission.code || admission.reason || 'writer_admission_refused');
  }

  const payload = {
    success: true,
    receipt: actors.publicReceipt(staged.receipt),
    actorSnapshot: actorProjection.snapshot(targetRoom),
    combat: actors.clone(targetRoom.gameState.combat || null),
    combatHash: actors.hash(targetRoom.gameState.combat || null),
    status: Number.isSafeInteger(staged.receipt.checkpointRevision) && staged.receipt.checkpointRevision > 0 && staged.receipt.checkpointRevision <= confirmedRevision
      ? 'checkpoint-confirmed' : 'accepted-live',
    durability: staged.receipt.checkpointRevision === null ? 'live-only' : 'checkpoint-eligible'
  };
  deliverToEntitledRoomSessions(io, rooms, players, targetRoom, 'actor_consequence_accepted', payload);
  return payload;
}

function evaluateMovement(room, moveEvent, runtime = {}) {
  const results = [];
  if (!room?.gameState || !moveEvent) return results;

  const storedLedger = passiveActivation.stored(room);
  const passiveActivations = (storedLedger?.activations || []).filter(item => item?.passiveKind === pure.PASSIVE_ENTRY_CAPABILITY);
  if (!passiveActivations.length) return results;

  // Teleport and forced movement remain explicitly unsettled/open — never auto-fire them.
  if (moveEvent.isTeleport === true || moveEvent.movementKind === 'teleport' ||
      moveEvent.forcedMovement === true || moveEvent.movementKind === 'forced') {
    return results;
  }

  const { moverToken, mapId, fromPosition, toPosition, actionId } = moveEvent;
  if (!moverToken || !mapId || !fromPosition || !toPosition ||
      ![fromPosition.x, fromPosition.y, toPosition.x, toPosition.y].every(Number.isFinite)) {
    return results;
  }
  if (fromPosition.x === toPosition.x && fromPosition.y === toPosition.y) {
    return results;
  }

  const moverContract = moverToken.state?.actorContract;
  if (!moverContract || moverContract.version !== 1) return results;
  let moverRef;
  try {
    moverRef = actors.refFor(moverContract);
    actors.validateRef(moverRef);
  } catch (_) {
    return results;
  }
  if (moverRef.roomId !== room.id || moverRef.mapId !== mapId) return results;

  const metrics = installedAuthoredAbilities.mapGridMetrics(room, mapId);
  if (metrics.gridType !== 'square' || !Number.isFinite(metrics.gridSize) || metrics.gridSize <= 0 ||
      !Number.isFinite(metrics.feetPerTile) || metrics.feetPerTile <= 0) {
    return results;
  }
  const creaturesCatalog = metrics.map?.creatures || room.gameState?.combat?.creatures || room.gameState?.creatures || [];
  const { firebaseBatchWriter: writer } = runtime;
  const confirmedRevision = Math.max(room.checkpointRevision || 0, writer?.getStatus?.(room.id)?.confirmedRevision || 0);

  for (const item of passiveActivations) {
    if (item.target?.mapId !== mapId) continue;
    if (actors.hash(item.target) === actors.hash(moverRef)) continue;

    const evaluated = passiveActivation.evaluateActivation(room, item);
    if (!evaluated.ok || evaluated.state !== 'active') continue;

    let ownerLocated;
    try { ownerLocated = actors.locate(room, item.target); } catch (_) { continue; }
    const ownerPos = ownerLocated.token?.position;
    if (!ownerPos || ![ownerPos.x, ownerPos.y].every(Number.isFinite)) continue;

    const restriction = item.targeting?.restriction;
    if (restriction === 'enemy' || restriction === 'ally') {
      if (actorRelationships.get(room, item.target, moverRef) !== restriction) continue;
    }

    let liveMover;
    try { liveMover = actors.locate(room, moverRef); } catch (_) { continue; }

    const radiusFeet = item.targeting?.radiusFeet;
    const wasInside = isInsideRadius(ownerPos, fromPosition, liveMover.token, radiusFeet, metrics, creaturesCatalog);
    const isInside = isInsideRadius(ownerPos, toPosition, liveMover.token, radiusFeet, metrics, creaturesCatalog);
    if (wasInside || !isInside) continue;

    const currentLedger = passiveActivation.stored(room);
    const normalizedActionId = typeof actionId === 'string' && actionId.trim() ? actionId.trim() : null;
    const moveKey = normalizedActionId
      ? actors.hash({ kind: 'passive-move', activationId: item.activationId, mover: moverRef, actionId: normalizedActionId })
      : null;
    if (moveKey && (currentLedger?.processedMoves || []).includes(moveKey)) continue;

    // Re-entry policy is open/unsettled: do not duplicate or re-apply while active from this passive.
    if (conditionAlreadyActiveFromPassive(room, liveMover.token, item)) continue;

    try {
      const recordId = crypto.randomUUID();
      const conditionRecord = buildConditionRecord(moverRef, recordId, item);
      const command = {
        version: 1,
        roomId: room.id,
        commandId: crypto.randomUUID(),
        actionEpoch: actors.epoch(room),
        baseCommitSequence: actors.ledger(room).commitSequence,
        source: item.target,
        target: moverRef,
        actors: [{
          ref: moverRef,
          expectedRevision: liveMover.contract.revision,
          conditions: [{ op: 'add', recordId, record: conditionRecord }]
        }],
        adjudication: {
          definitionId: item.sourceRecordId,
          definitionVersionOrHash: `${pure.PASSIVE_ENTRY_CAPABILITY}/${item.definitionRef.definitionHash}`,
          chosenResult: JSON.stringify({
            capability: pure.PASSIVE_ENTRY_CAPABILITY,
            passiveName: item.name,
            activationId: item.activationId,
            trigger: item.trigger?.kind || pure.PASSIVE_ENTRY_TRIGGER_ID,
            radiusFeet,
            restriction,
            condition: item.effects.condition,
            conditionRecordId: recordId,
            actionId: normalizedActionId
          }),
          adjustmentReason: `Passive "${item.name}" fired: ${restriction} moved into ${radiusFeet} ft radius.`
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

      if (moveKey && staged.next[passiveActivation.LEDGER_KEY]) {
        const priorMoves = Array.isArray(staged.next[passiveActivation.LEDGER_KEY].processedMoves)
          ? staged.next[passiveActivation.LEDGER_KEY].processedMoves
          : [];
        staged.next[passiveActivation.LEDGER_KEY].processedMoves = [...priorMoves, moveKey].slice(-MAX_PROCESSED_MOVES);
      }

      commitPassiveConsequence(room, staged, confirmedRevision, runtime);
      results.push({ activationId: item.activationId, receipt: staged.receipt, record: conditionRecord });
    } catch (error) {
      // Do not fail token movement when a passive effect cannot be combined or applied cleanly.
      if (process.env.NODE_ENV !== 'production') {
        console.warn('[passiveMovementTrigger] skipped consequence:', error?.code || error?.message || error);
      }
    }
  }

  return results;
}

module.exports = {
  evaluateMovement,
  isInsideRadius,
  conditionAlreadyActiveFromPassive,
  buildConditionRecord,
  deliverToEntitledRoomSessions,
  commitPassiveConsequence
};
