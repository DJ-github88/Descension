/**
 * Sync Handlers
 *
 * State synchronization between clients (initial full sync, peer-to-peer
 * targeted sync, and conflict resolution):
 * - request_full_sync: client asks for full room snapshot
 * - sync_tokens / sync_grid_items / sync_character_tokens: targeted peer sync
 *   (supports recipientPlayerId for direct delivery, otherwise broadcasts to room)
 * - request_combat_sync: combat-only snapshot
 * - save_room_state_request: persist room state to Firebase
 * - resolve_state_conflict: apply authoritative state after conflict
 */

const roomCheckpointExport = require('../services/roomCheckpointExport');
const roomAccess = require('../services/roomAccessService');
const roomAuthority = require('../services/roomAuthorityService');

function registerSyncHandlers(ctx) {
  const {
    io,
    socket,
    rooms,
    players,
    logger,
    firebaseBatchWriter,
    firebaseService,
    authorityService
  } = ctx;

  // Root collections that have per-map counterparts. They are used to detect
  // ambiguous legacy state during recovery.
  const ROOT_RECOVERY_COLLECTIONS = ['tokens', 'characterTokens', 'gridItems'];

  const hasOwn = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

  const isPlainRecord = (value) => !!value && typeof value === 'object' && !Array.isArray(value);

  const getOwnMapRecord = (maps, mapId) => {
    if (!isPlainRecord(maps) || !hasOwn(maps, mapId)) {
      return { present: false, map: null };
    }
    const candidate = maps[mapId];
    return { present: true, map: isPlainRecord(candidate) ? candidate : null };
  };

  const collectionHasContent = (collection) => isPlainRecord(collection) && Object.keys(collection).length > 0;

  // Root entries whose explicit map scope conflicts with the map a legacy
  // fallback would label them as. They must never be relabelled.
  const findLegacyScopeConflicts = (gs, targetMapId) => {
    const conflicts = [];
    for (const field of ROOT_RECOVERY_COLLECTIONS) {
      const collection = gs[field];
      if (!isPlainRecord(collection)) {continue;}
      for (const [key, entry] of Object.entries(collection)) {
        const entryMapId = isPlainRecord(entry) ? entry.mapId : undefined;
        if (entryMapId && entryMapId !== targetMapId) {
          conflicts.push({ field, key });
        }
      }
    }
    return conflicts;
  };

  // Root entries that no own per-map store accounts for. These can only be
  // legacy-only content and must not be silently dropped by a per-map reply.
  const findLegacyOnlyContent = (gs, maps) => {
    const knownKeys = { tokens: new Set(), characterTokens: new Set(), gridItems: new Set() };
    for (const mapId of Object.keys(maps)) {
      const { map } = getOwnMapRecord(maps, mapId);
      if (!map) {continue;}
      for (const field of ROOT_RECOVERY_COLLECTIONS) {
        const collection = map[field];
        if (!isPlainRecord(collection)) {continue;}
        for (const key of Object.keys(collection)) {knownKeys[field].add(key);}
      }
    }

    const legacyOnly = [];
    for (const field of ROOT_RECOVERY_COLLECTIONS) {
      const collection = gs[field];
      if (!isPlainRecord(collection)) {continue;}
      for (const key of Object.keys(collection)) {
        if (!knownKeys[field].has(key)) {legacyOnly.push({ field, key });}
      }
    }
    return legacyOnly;
  };

  const rejectRecovery = (code, message, extra = {}) => {
    logger.warn('[request_full_sync] Rejected recovery request', {
      socketId: socket.id, code, ...extra
    });
    socket.emit('sync_error', { event: 'request_full_sync', code, message, ...extra });
  };

  // Targeted peer sync must stay inside the sender's actual room; the global
  // players map contains every connected player across all rooms, including
  // stale entries for sockets that now belong elsewhere.
  const findRoomRecipient = (sender, room, recipientPlayerId) => {
    if (!recipientPlayerId) {return null;}
    const recipient = Array.from(players.values()).find(
      p => p.id === recipientPlayerId && p.roomId === sender.roomId
    );
    if (!recipient) {return null;}
    const isMember = (room.players && room.players.has(recipient.id)) ||
      (room.gm && room.gm.id === recipient.id);
    return isMember ? recipient : null;
  };

  const rejectTargetedSync = (event, sender, recipientPlayerId) => {
    logger.warn(`[${event}] Blocked targeted sync to a player outside the sender room`, {
      senderId: sender.id,
      recipientPlayerId,
      roomId: sender.roomId
    });
    socket.emit('sync_error', {
      event,
      recipientPlayerId,
      message: 'Recipient is not a member of your room'
    });
  };

  // A sender only qualifies while its authoritative membership is current.
  const getCurrentSyncContext = (event) => {
    const sender = players.get(socket.id);
    if (!sender) {return null;}
    const room = rooms.get(sender.roomId);
    if (!room) {return null;}

    // R2: authoritative sync delivery requires the current room authority.
    if (authorityService && roomAccess.roomAuthorityDenial(room, authorityService)) {
      logger.warn(`[${event}] Blocked sync from a non-authoritative room lifecycle`, {
        senderId: sender.id,
        roomId: sender.roomId
      });
      socket.emit('sync_error', {
        event,
        message: 'Room is not currently available on this server'
      });
      return null;
    }

    const isMember = (room.players && room.players.has(sender.id)) ||
      (room.gm && room.gm.id === sender.id);
    if (!isMember) {
      logger.warn(`[${event}] Blocked sync from a sender outside the current room membership`, {
        senderId: sender.id,
        roomId: sender.roomId
      });
      socket.emit('sync_error', {
        event,
        message: 'Sender is not a current member of this room'
      });
      return null;
    }

    return { sender, room };
  };

  // Socket.IO channel membership can be stale (a socket that joined another
  // room without leaving the previous channel). Delivery is derived from the
  // current authoritative room membership instead of channel membership.
  const emitToCurrentRoomMembers = (event, sender, room, payload) => {
    const delivered = new Set();
    const deliverTo = (memberSocketId) => {
      if (!memberSocketId || memberSocketId === socket.id || delivered.has(memberSocketId)) {return;}
      const memberPlayer = players.get(memberSocketId);
      if (!memberPlayer || memberPlayer.roomId !== room.id) {return;}
      delivered.add(memberSocketId);
      io.to(memberSocketId).emit(event, payload);
    };

    if (room.players && typeof room.players.forEach === 'function') {
      room.players.forEach((member) => deliverTo(member && member.socketId));
    }
    if (room.gm) {deliverTo(room.gm.socketId);}

    return delivered.size;
  };

  socket.on('request_full_sync', (data) => {
    const player = players.get(socket.id);
    if (!player) {return;}

    const room = rooms.get(player.roomId);
    if (!room) {return;}

    // R2: full room-state recovery is authoritative delivery.
    if (authorityService && roomAccess.roomAuthorityDenial(room, authorityService)) {
      rejectRecovery('room_authority_lost', 'Room is not currently available on this server');
      return;
    }

    const gs = room.gameState || {};
    // Requested map first (when supplied), then the player's current map, then
    // the room default. Never serve another map's state under this map ID.
    const requestedMapId = (data && data.mapId) || player.currentMapId || gs.defaultMapId || 'default';
    const maps = isPlainRecord(gs.maps) ? gs.maps : {};
    const hasPerMapStores = Object.keys(maps).length > 0;
    // Own-property lookup only: prototype keys such as constructor/__proto__
    // must never resolve to a map record.
    const { present: mapPresent, map: ownMap } = getOwnMapRecord(maps, requestedMapId);

    if ((mapPresent && !ownMap) || (!ownMap && hasPerMapStores)) {
      rejectRecovery('map_unavailable', `Map '${requestedMapId}' is not available for recovery`, {
        mapId: requestedMapId
      });
      return;
    }

    if (!ownMap) {
      // Documented legacy fallback: pre-per-map rooms stored a single unscoped
      // token/character/grid collection at the gameState root. Serve that root
      // state only when the room has no per-map stores at all, the requested
      // map is the room default, and every explicit root scope agrees with it.
      const fallbackMapId = gs.defaultMapId || 'default';
      if (requestedMapId !== fallbackMapId) {
        rejectRecovery('map_unavailable', `Map '${requestedMapId}' is not available for recovery`, {
          mapId: requestedMapId
        });
        return;
      }

      const conflicts = findLegacyScopeConflicts(gs, requestedMapId);
      if (conflicts.length > 0) {
        rejectRecovery(
          'legacy_map_conflict',
          'Legacy recovery scope conflicts with stored map metadata; checkpoint reconciliation is required',
          { mapId: requestedMapId, conflictCount: conflicts.length }
        );
        return;
      }

      // Reply on the event the client actually listens for. Shape mirrors the
      // other full_game_state_sync payloads so the existing handler can apply it.
      // P4: outbound privacy projection; raw stored state is never altered.
      socket.emit('full_game_state_sync', {
        mapId: requestedMapId,
        legacyFallback: true,
        tokens: roomAccess.projectGameStateForClient({ tokens: gs.tokens || {} }).tokens,
        characterTokens: roomAccess.projectGameStateForClient({ characterTokens: gs.characterTokens || {} }).characterTokens,
        gridItems: gs.gridItems || {},
        fogOfWar: gs.fogOfWarData || gs.fogOfWar,
        mapData: gs.mapData ? roomAccess.projectRootMapDataForClient(gs.mapData) : null,
        combat: gs.combat || null,
        players: roomAccess.projectPlayersForClient(room.players),
        gm: roomAccess.projectPlayerForClient(room.gm),
        room: { id: room.id, name: room.name }
      });
      return;
    }

    // Per-map recovery: reject ambiguous mixed state instead of silently
    // omitting legacy root content or serving root fog under a per-map label.
    const legacyOnly = findLegacyOnlyContent(gs, maps);
    const rootFogLegacy = collectionHasContent(gs.fogOfWarData || gs.fogOfWar);
    if (legacyOnly.length > 0 || rootFogLegacy) {
      rejectRecovery(
        'legacy_ambiguous',
        'Recovery is ambiguous: legacy root state coexists with per-map state; checkpoint reconciliation is required',
        { mapId: requestedMapId, legacyOnlyCount: legacyOnly.length }
      );
      return;
    }

    const projectedMap = roomAccess.projectGameStateForClient({ maps: { [requestedMapId]: { ...ownMap } } }).maps[requestedMapId];
    socket.emit('full_game_state_sync', {
      mapId: requestedMapId,
      mapIds: Object.keys(maps),
      tokens: projectedMap.tokens || {},
      characterTokens: projectedMap.characterTokens || {},
      gridItems: projectedMap.gridItems || {},
      fogOfWar: projectedMap.fogOfWarData || {},
      // Complete map record so silent hydration can replace every owned
      // collection (drawings, objects, optional fields) without omission.
      mapData: projectedMap,
      combat: gs.combat || null,
      players: roomAccess.projectPlayersForClient(room.players),
      gm: roomAccess.projectPlayerForClient(room.gm),
      room: { id: room.id, name: room.name }
    });
  });

  socket.on('sync_tokens', (data) => {
    const context = getCurrentSyncContext('sync_tokens');
    if (!context) {return;}
    const { sender, room } = context;

    const payload = {
      tokens: roomAccess.projectGameStateForClient({ tokens: data.tokens || {} }).tokens,
      mapId: data.mapId
    };

    if (data.recipientPlayerId) {
      const recipient = findRoomRecipient(sender, room, data.recipientPlayerId);
      if (recipient) {
        io.to(recipient.socketId).emit('full_game_state_sync', payload);
      } else {
        rejectTargetedSync('sync_tokens', sender, data.recipientPlayerId);
      }
    } else {
      emitToCurrentRoomMembers('full_game_state_sync', sender, room, payload);
    }
  });

  socket.on('sync_grid_items', (data) => {
    const context = getCurrentSyncContext('sync_grid_items');
    if (!context) {return;}
    const { sender, room } = context;

    const payload = { gridItems: data.gridItems, mapId: data.mapId };

    if (data.recipientPlayerId) {
      const recipient = findRoomRecipient(sender, room, data.recipientPlayerId);
      if (recipient) {
        io.to(recipient.socketId).emit('full_game_state_sync', payload);
      } else {
        rejectTargetedSync('sync_grid_items', sender, data.recipientPlayerId);
      }
    } else {
      emitToCurrentRoomMembers('full_game_state_sync', sender, room, payload);
    }
  });

  socket.on('sync_character_tokens', (data) => {
    const context = getCurrentSyncContext('sync_character_tokens');
    if (!context) {return;}
    const { sender, room } = context;

    const payload = {
      characterTokens: roomAccess.projectGameStateForClient({ characterTokens: data.characterTokens || {} }).characterTokens,
      mapId: data.mapId
    };

    if (data.recipientPlayerId) {
      const recipient = findRoomRecipient(sender, room, data.recipientPlayerId);
      if (recipient) {
        io.to(recipient.socketId).emit('full_game_state_sync', payload);
      } else {
        rejectTargetedSync('sync_character_tokens', sender, data.recipientPlayerId);
      }
    } else {
      emitToCurrentRoomMembers('full_game_state_sync', sender, room, payload);
    }
  });

  socket.on('request_combat_sync', () => {
    const player = players.get(socket.id);
    if (!player) {return;}
    const room = rooms.get(player.roomId);
    if (!room) {return;}

    socket.emit('full_game_state_sync', {
      combat: room.gameState.combat || null,
      players: roomAccess.projectPlayersForClient(room.players),
      gm: roomAccess.projectPlayerForClient(room.gm)
    });
  });

  socket.on('save_room_state_request', async(data) => {
    const player = players.get(socket.id);
    if (!player) {return;}
    const room = rooms.get(player.roomId);
    if (!room) {return;}

    const writeOutcomes = firebaseService.ROOM_WRITE_OUTCOMES || {};
    const isGM = player.isGM === true || (room.gm && room.gm.id === player.id);
    if (!isGM) {
      logger.warn('[save_room_state_request] Denied explicit room save from a non-GM member', {
        socketId: socket.id,
        roomId: room.id
      });
      socket.emit('room_state_save_error', {
        roomId: room.id,
        outcome: writeOutcomes.PERMANENT || 'permanent',
        code: 'gm_required',
        retriable: false,
        error: 'Only the GM can save the room state'
      });
      return;
    }

    const reason = data && data.reason;

    try {
      if (!firebaseBatchWriter || typeof firebaseBatchWriter.saveNow !== 'function') {
        socket.emit('room_state_save_error', {
          roomId: room.id,
          reason,
          outcome: 'unavailable',
          code: 'checkpoint_writer_unavailable',
          retriable: false,
          error: 'Room checkpoint writer is unavailable'
        });
        return;
      }

      if (room.migrationRequired === true) {
        // Verification binds every conversion attempt (including retries) to
        // the exact prepared source; pendingExplicitConversion only records
        // that preparation happened, never that the source is unchanged.
        if (!room.pendingExplicitConversion) {
          // A legacy/selected room may only convert once a verified raw
          // rollback artifact exists (frozen migration contract).
          const exportResult = await roomCheckpointExport.ensureRollbackArtifact(room.id, firebaseService);
          if (!exportResult.ok) {
            logger.error('[save_room_state_request] Legacy conversion refused without rollback export', {
              roomId: room.id,
              reason: exportResult.reason
            });
            socket.emit('room_state_save_error', {
              roomId: room.id,
              reason,
              outcome: 'permanent',
              code: 'MIGRATION_EXPORT_REQUIRED',
              retriable: false,
              error: `Legacy room conversion requires a verified rollback export (${exportResult.reason})`
            });
            return;
          }

          // Re-read AFTER the export and re-verify the source selection and
          // fingerprint still match the exact exported candidates before any
          // destructive conversion.
          const preparedClassification = await firebaseService.readRoomCheckpoint(room.id);
          const preparedFingerprint = preparedClassification.kind === 'READ_FAILED'
            ? null
            : roomCheckpointExport.selectionFingerprint(preparedClassification);
          if (preparedClassification.kind === 'READ_FAILED' ||
            preparedFingerprint === null ||
            preparedFingerprint !== exportResult.sourceFingerprint) {
            logger.error('[save_room_state_request] Migration source changed after export; reclassification required', {
              roomId: room.id,
              kind: preparedClassification.kind
            });
            socket.emit('room_state_save_error', {
              roomId: room.id,
              reason,
              outcome: 'permanent',
              code: 'MIGRATION_SOURCE_CHANGED',
              retriable: false,
              error: 'Room source changed after export; reclassify before conversion'
            });
            return;
          }

          const selectedCandidate = preparedClassification.selectedCandidateId === 'split' ? 'split' : 'inline';
          room.pendingProvenance = {
            kind: selectedCandidate === 'split' ? 'legacy-split' : 'legacy-inline',
            sourceRoomId: room.id,
            sourceRevision: Number.isSafeInteger(Number(preparedClassification.revision)) ? Number(preparedClassification.revision) : (room.checkpointRevision || null),
            selectedCandidateId: selectedCandidate,
            rollbackArtifactId: exportResult.artifactId,
            rollbackArtifactSha256: exportResult.sha256,
            decisionId: (preparedClassification.selection && preparedClassification.selection.decisionId) || null
          };
          room.pendingSourceFingerprint = exportResult.sourceFingerprint;
          room.pendingExplicitConversion = true;
        } else {
          // Every retry re-verifies the prepared source before it can publish
          // or delete legacy inline state.
          const currentClassification = await firebaseService.readRoomCheckpoint(room.id);
          const currentFingerprint = currentClassification.kind === 'READ_FAILED'
            ? null
            : roomCheckpointExport.selectionFingerprint(currentClassification);
          if (!roomCheckpointExport.isConvertibleClassification(currentClassification) ||
            currentFingerprint === null ||
            currentFingerprint !== room.pendingSourceFingerprint) {
            logger.error('[save_room_state_request] Migration retry source no longer matches the prepared export', {
              roomId: room.id,
              kind: currentClassification.kind
            });
            socket.emit('room_state_save_error', {
              roomId: room.id,
              reason,
              outcome: 'permanent',
              code: 'MIGRATION_SOURCE_CHANGED',
              retriable: false,
              error: 'Room source changed after export; reclassify before conversion'
            });
            return;
          }
        }
      }

      // Shared writer outcome contract: confirmed only after a durable cloud
      // write; a false/unavailable/thrown result is never reported as saved.
      // The selected writer publishes one atomic P3 checkpoint.
      const result = await firebaseBatchWriter.saveNow(room.id, room.gameState);

      if (result && result.outcome === (writeOutcomes.CONFIRMED || 'confirmed')) {
        // B9: a committed write under the ORIGINATING epoch is not a current
        // success after a takeover. Revalidate the exact captured context
        // before acknowledging the live save.
        if (authorityService) {
          const contextCheck = await roomAuthority.assertOperationContext(
            roomAuthority.getOperationContext(data), authorityService,
            { binding: { rooms, players, socketId: socket.id } }
          );
          if (!contextCheck.ok) {
            socket.emit('room_state_save_error', {
              roomId: room.id,
              reason,
              outcome: 'authority_lost',
              code: contextCheck.code,
              retriable: false,
              error: 'Room state was saved but the current room authority was lost'
            });
            return;
          }
        }
        // Report the highest revision this attempt confirmed, never a stale
        // shared state field from before the attempt.
        const acknowledgedRevision = Math.max(
          Number(result.confirmedRevision) || 0,
          Number(result.revision) || 0
        ) || null;
        socket.emit('room_state_saved', {
          roomId: room.id,
          reason,
          cloudSaved: true,
          confirmedRevision: acknowledgedRevision
        });
      } else {
        socket.emit('room_state_save_error', {
          roomId: room.id,
          reason,
          outcome: (result && result.outcome) || 'retryable',
          retriable: !!(result && result.retriable),
          error: 'Room state was not confirmed saved to the cloud'
        });
      }
    } catch (error) {
      logger.error('[save_room_state_request] Error:', { error: error.message });
      socket.emit('room_state_save_error', {
        roomId: room.id,
        reason,
        outcome: 'retryable',
        retriable: true,
        error: error.message
      });
    }
  });

  socket.on('resolve_state_conflict', async(data) => {
    // Browser whole-room snapshot replacement is disabled (P3). Selected
    // checkpoint restore through the bounded export fixture is the only
    // supported replacement boundary.
    socket.emit('sync_error', {
      event: 'resolve_state_conflict',
      code: 'SNAPSHOT_REPLACEMENT_DISABLED',
      message: 'Browser whole-room snapshot replacement is disabled; use the selected checkpoint restore workflow'
    });
    logger.warn('[resolve_state_conflict] Rejected browser whole-room replacement', {
      socketId: socket.id,
      roomId: data && data.roomId
    });
  });
}

module.exports = { registerSyncHandlers };
