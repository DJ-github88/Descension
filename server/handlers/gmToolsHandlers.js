/**
 * GM Tools Handlers
 *
 * Server half of the GM Tools panel (vtt-react/src/components/gm-tools/GMToolsPanel.jsx):
 * - request_player_list    -> player_list_updated (GM only)
 * - request_room_settings  -> room_settings_updated (GM only)
 * - update_room_settings   -> merge into room.settings + broadcast (GM only)
 * - mute_player            -> mark muted (chat is blocked server-side) + refresh list (GM only)
 * - kick_player            -> notify target, remove from room, refresh list (GM only)
 *
 * Every event is GM-gated via validateRoomMembership(..., requireGM=true).
 * Player identity is taken from the server-side player record, never the client.
 */

const roomCheckpointExport = require('../services/roomCheckpointExport');
const roomAccess = require('../services/roomAccessService');
const roomAuthority = require('../services/roomAuthorityService');

function registerGmToolsHandlers(ctx) {
  const {
    io,
    socket,
    rooms,
    players,
    logger,
    firebaseService,
    validateRoomMembership,
    firebaseBatchWriter,
    authorityService
  } = ctx;

  if (!socket) {
    return;
  }

  const buildPlayerList = (room) => {
    const list = [];
    const seen = new Set();

    if (room.gm && room.gm.id && !room.players.has(room.gm.id)) {
      list.push({
        id: room.gm.id,
        name: room.gm.name,
        color: room.gm.color,
        isGM: true,
        isOnline: true,
        isMuted: !!room.gm.muted
      });
      seen.add(room.gm.id);
    }

    room.players.forEach((p) => {
      if (seen.has(p.id)) {
        return;
      }
      list.push({
        id: p.id,
        name: p.name,
        color: p.color,
        isGM: !!p.isGM,
        isOnline: true,
        isMuted: !!p.muted
      });
    });

    return list;
  };

  const persistIfPermanent = (room) => {
    try {
      if (room.isPermanent && firebaseBatchWriter?.queueWrite) {
        firebaseBatchWriter.queueWrite(room.id, room.gameState);
      }
    } catch (_e) {
      // persistence is best-effort
    }
  };

  socket.on('request_player_list', () => {
    try {
      const validation = validateRoomMembership(socket, undefined, true);
      if (!validation.valid) {
        return;
      }
      socket.emit('player_list_updated', buildPlayerList(validation.room));
    } catch (error) {
      logger?.error?.('[request_player_list] Error:', { error: error.message });
    }
  });

  socket.on('request_room_settings', () => {
    try {
      const validation = validateRoomMembership(socket, undefined, true);
      if (!validation.valid) {
        return;
      }
      socket.emit('room_settings_updated', validation.room.settings || {});
    } catch (error) {
      logger?.error?.('[request_room_settings] Error:', { error: error.message });
    }
  });

  socket.on('update_room_settings', (data) => {
    try {
      const validation = validateRoomMembership(socket, undefined, true);
      if (!validation.valid) {
        return;
      }
      const { room } = validation;
      const settings = data && typeof data === 'object' && !Array.isArray(data) ? data : {};
      // P4: one shared bounded settings validator. Arbitrary spread updates
      // (ownership, membership, consent) are refused.
      const validated = roomCheckpointExport.validateRoomMetadataPatch({ settings });
      if (!validated.ok) {
        socket.emit('room_settings_error', { error: validated.error || 'Invalid room settings', code: roomAccess.DENIAL_CODES.PROTECTED_FIELD });
        return;
      }
      room.settings = { ...(room.settings || {}), ...validated.patch.settings };
      io.to(room.id).emit('room_settings_updated', room.settings);
      persistIfPermanent(room);
      logger?.debug?.('[update_room_settings] updated', { roomId: room.id });
    } catch (error) {
      logger?.error?.('[update_room_settings] Error:', { error: error.message });
    }
  });

  // Project 3: server-mediated shared canonical metadata edit. The browser
  // never writes name/description/settings to canonical Firestore. The server
  // validates the entire bounded patch with ONE shared validator, applies it
  // atomically to the authoritative live room and checkpoints through the
  // selected P2/P3 writer.
  //
  // Metadata-only authority order:
  //   A) current verified in-game GM/member authority
  //   B) verified account UID === authoritative live room GM/owner UID
  // Path B authorizes ONLY bounded metadata fields: no membership synthesis,
  // no gameplay powers, no gameState/checkpoint replacement.
  socket.on('update_room_metadata', async(data, callback) => {
    const respond = (payload) => {
      if (typeof callback === 'function') {callback(payload);}
    };
    try {
      // H2: durable account operations require a verified non-anonymous
      // principal, independent of gameplay membership.
      const identity = roomAccess.checkDurableRoomIdentity(socket);
      if (!identity.allowed) {
        respond({ success: false, error: 'A signed-in, non-anonymous account is required', code: identity.code });
        return;
      }
      const rawUpdates = data && typeof data === 'object' ? data : {};
      const requestedRoomId = typeof rawUpdates.roomId === 'string' && rawUpdates.roomId.length > 0
        ? rawUpdates.roomId
        : null;
      const candidate = { ...rawUpdates };
      delete candidate.roomId;

      // Validate the complete requested patch before any mutation or writer.
      const validation = roomCheckpointExport.validateRoomMetadataPatch(candidate);
      if (!validation.ok) {
        respond({ success: false, error: validation.error });
        return;
      }
      const patch = validation.patch;

      const liveRoom = requestedRoomId && rooms && typeof rooms.get === 'function'
        ? rooms.get(requestedRoomId)
        : null;

      let room = null;
      if (liveRoom) {
        // R2: a live room edit requires the current room authority, including
        // the verified-owner fallback. Lease validation failure is never
        // bypassed by account ownership.
        const roomDenial = roomAccess.roomAuthorityDenial(liveRoom, authorityService);
        if (roomDenial) {
          respond({ success: false, error: 'Room is not currently available on this server', code: roomDenial });
          return;
        }
        const memberValidation = validateRoomMembership(socket, requestedRoomId, true);
        const verifiedUserId = socket.data && socket.data.userId;
        const accountOwner = !!verifiedUserId && verifiedUserId === liveRoom.gmId;
        if (memberValidation.valid) {
          room = memberValidation.room;
        } else if (accountOwner) {
          room = liveRoom;
        } else {
          respond({ success: false, error: 'GM privileges required' });
          return;
        }
      } else if (!requestedRoomId) {
        const memberValidation = validateRoomMembership(socket, undefined, true);
        if (!memberValidation.valid) {
          respond({ success: false, error: 'GM privileges required' });
          return;
        }
        room = memberValidation.room;
      }

      if (room) {
        // Entire patch is already valid: apply atomically to live authority.
        if (patch.name !== undefined) {room.name = patch.name;}
        if (patch.description !== undefined) {room.description = patch.description;}
        if (patch.settings !== undefined) {
          room.settings = { ...(room.settings || {}), ...patch.settings };
        }

        let outcome = 'accepted';
        if (room.isPermanent && firebaseBatchWriter && typeof firebaseBatchWriter.saveNow === 'function') {
          const result = await firebaseBatchWriter.saveNow(room.id, room.gameState);
          if (!result || result.outcome !== 'confirmed') {
            respond({
              success: false,
              outcome: (result && result.outcome) || 'unavailable',
              error: 'Room metadata was not confirmed saved to the cloud'
            });
            return;
          }
          // B9: a committed write under the ORIGINATING epoch is not a current
          // success after a takeover. Revalidate the exact captured context
          // before broadcasting or acknowledging.
          if (authorityService) {
            const contextCheck = await roomAuthority.assertOperationContext(
              roomAuthority.getOperationContext(data), authorityService,
              { binding: { rooms, players, socketId: socket.id } }
            );
            if (!contextCheck.ok) {
              respond({
                success: false,
                outcome: 'authority_lost',
                code: contextCheck.code,
                error: 'Room metadata was saved but the current room authority was lost'
              });
              return;
            }
          }
          outcome = 'confirmed';
        } else if (room.isPermanent && firebaseBatchWriter && typeof firebaseBatchWriter.queueWrite === 'function') {
          firebaseBatchWriter.queueWrite(room.id, room.gameState);
          outcome = 'queued';
        }
        io.to(room.id).emit('room_metadata_updated', {
          name: room.name,
          description: room.description ?? null,
          settings: room.settings || {},
          updatedBy: socket.id
        });
        respond({ success: true, outcome, name: room.name });
        logger?.debug?.('[update_room_metadata] updated', { roomId: room.id, fields: Object.keys(patch), outcome });
        return;
      }

      // No live authority: account-level canonical edit or bounded draft edit.
      // C5: claim target authority for the bounded operation, then release.
      let accountClaim = null;
      if (authorityService) {
        accountClaim = await authorityService.acquire(requestedRoomId);
        if (!accountClaim.ok) {
          respond({ success: false, error: 'Room is currently unavailable on this server', code: accountClaim.code });
          return;
        }
      }
      let cloud;
      let releaseResult = { ok: true, released: true, code: null };
      try {
        cloud = await roomCheckpointExport.publishAccountMetadataEdit({
          roomId: requestedRoomId,
          patch,
          gmUserId: socket.data && socket.data.userId,
          firebaseService,
          authority: accountClaim ? accountClaim.token : null,
          authorityService
        });
      } finally {
        if (authorityService && accountClaim) {
          try {
            releaseResult = await authorityService.release(accountClaim.token);
          } catch (_releaseError) {
            releaseResult = { ok: false, code: 'room_authority_unavailable', released: false };
          }
        }
      }
      // C5: a committed metadata write is HISTORICAL durability when the
      // captured authority is lost during release. Never emit a stale
      // current-authority broadcast/ack for it.
      const releaseClean = !accountClaim ||
        (releaseResult && releaseResult.ok === true && releaseResult.released === true);
      if (cloud.ok && !releaseClean) {
        respond({
          success: false,
          outcome: 'authority_lost',
          durable: true,
          revision: cloud.revision,
          code: (releaseResult && releaseResult.code) || 'room_authority_lost',
          error: 'Room metadata was saved but the current room authority was lost'
        });
        return;
      }
      if (cloud.ok) {
        socket.emit('room_metadata_updated', {
          name: patch.name !== undefined ? patch.name : null,
          description: patch.description !== undefined ? patch.description : null,
          settings: patch.settings || {},
          updatedBy: socket.id
        });
        respond({ success: true, outcome: cloud.outcome, revision: cloud.revision, kind: cloud.kind || 'canonical' });
      } else if (cloud.reason === 'not_room_gm' || cloud.reason === 'verified_identity_required') {
        respond({ success: false, error: 'GM privileges required' });
      } else if (cloud.reason === 'invalid_metadata') {
        respond({ success: false, error: cloud.error || 'Invalid room metadata' });
      } else {
        respond({ success: false, error: `Room metadata update unavailable (${cloud.reason})` });
      }
    } catch (error) {
      logger?.error?.('[update_room_metadata] Error:', { error: error.message });
      respond({ success: false, error: 'Room metadata update failed' });
    }
  });

  socket.on('mute_player', (data) => {
    try {
      const validation = validateRoomMembership(socket, undefined, true);
      if (!validation.valid) {
        return;
      }
      const { room } = validation;
      const target = room.players.get(data?.playerId);
      if (!target) {
        return;
      }
      target.muted = true;
      socket.emit('player_list_updated', buildPlayerList(room));
      logger?.info?.('[mute_player] muted', { roomId: room.id, playerId: target.id });
    } catch (error) {
      logger?.error?.('[mute_player] Error:', { error: error.message });
    }
  });

  socket.on('kick_player', async(data) => {
    try {
      const validation = validateRoomMembership(socket, undefined, true);
      if (!validation.valid) {
        return;
      }
      const { room } = validation;
      const targetId = data?.playerId;
      const target = room.players.get(targetId);
      if (!target) {
        return;
      }

      // P4: kick/explicit removal revokes durable entitlement. Legacy runtime
      // players without a verified UID are only detached at runtime.
      const targetUid = target.userId || null;
      if (targetUid && !roomAccess.isOwningGm(room, targetUid)) {
        // R1: the durable revoke carries the current pinned room authority.
        const revoke = await roomAccess.revokeMembership(firebaseService, room, targetUid, authorityService);
        if (!revoke.ok) {
          socket.emit('player_kick_error', {
            error: 'Membership removal could not be confirmed; kick was refused',
            code: revoke.code
          });
          return;
        }
      }

      // B9: after the durable revoke await, the ORIGINATING epoch must still be
      // current before local detach/broadcast/cleanup effects. A stale process
      // must not acknowledge a current authoritative kick.
      if (authorityService) {
        const kickContextCheck = await roomAuthority.assertOperationContext(
          roomAuthority.getOperationContext(data), authorityService,
          { binding: { rooms, players, socketId: socket.id } }
        );
        if (!kickContextCheck.ok) {
          socket.emit('player_kick_error', {
            error: 'Membership removal was saved but the current room authority was lost',
            code: kickContextCheck.code
          });
          return;
        }
      }

      // Terminate any inventory shares owned by the removed member.
      if (targetUid && room.inventoryShares) {
        for (const [characterId, share] of Object.entries(room.inventoryShares)) {
          if (share.ownerUserId === targetUid) {
            delete room.inventoryShares[characterId];
          }
        }
      }

      const detached = targetUid
        ? roomAccess.detachMemberDevices({ io, room, players, userId: targetUid })
        : [];

      // Ensure the specific target device is detached even without a UID.
      if (detached.length === 0) {
        room.players.delete(targetId);
        if (room.gameState?.playerMapAssignments) {
          delete room.gameState.playerMapAssignments[targetId];
        }
        const targetSocket = target.socketId ? io.sockets.sockets.get(target.socketId) : null;
        if (targetSocket) {
          targetSocket.emit('player_kicked', {
            roomId: room.id,
            playerId: target.id,
            reason: 'kicked'
          });
          targetSocket.leave(room.id);
          players.delete(targetSocket.id);
        }
      } else {
        detached.forEach((s) => {
          s.emit('player_kicked', {
            roomId: room.id,
            playerId: target.id,
            reason: 'kicked'
          });
        });
      }

      socket.to(room.id).emit('player_left', {
        playerId: target.id,
        playerName: target.name,
        playerCount: roomAccess.countActiveMemberSlots(room)
      });

      socket.emit('player_list_updated', buildPlayerList(room));
      persistIfPermanent(room);
      logger?.info?.('[kick_player] kicked', { roomId: room.id, playerId: target.id, targetUid });
    } catch (error) {
      logger?.error?.('[kick_player] Error:', { error: error.message });
    }
  });

  /**
   * P4: canonical room deletion is a server-mediated owner operation. The
   * browser can no longer delete room documents/fragments directly.
   */
  socket.on('delete_room', async(data, ackCallback) => {
    const respond = (payload) => { if (typeof ackCallback === 'function') {ackCallback(payload);} };
    const ownerProof = (gmId) => {
      if (!roomAccess.isValidOwnerId(gmId)) {return roomAccess.DENIAL_CODES.OWNER_RECOVERY_REQUIRED;}
      if (gmId !== socket.data.userId) {return roomAccess.DENIAL_CODES.OWNER_REQUIRED;}
      return null;
    };
    try {
      // H2 durable principal gate.
      const identity = roomAccess.checkDurableRoomIdentity(socket);
      if (!identity.allowed) {
        respond({ success: false, error: 'A signed-in, non-anonymous account is required', code: identity.code });
        return;
      }
      const player = players.get(socket.id);
      const uid = socket.data?.userId || null;
      const roomId = (data && data.roomId) || (player && player.roomId);
      if (!uid || !roomId) {
        respond({ success: false, error: 'Authentication and room are required', code: roomAccess.DENIAL_CODES.NOT_AUTHENTICATED });
        return;
      }

      const live = rooms.get(roomId);
      if (live) {
        const proof = ownerProof(live.gmId);
        if (proof) {
          respond({
            success: false,
            error: proof === roomAccess.DENIAL_CODES.OWNER_RECOVERY_REQUIRED
              ? 'Room owner could not be proven; explicit owner recovery is required'
              : 'Only the room owner can delete the room',
            code: proof
          });
          return;
        }

        // Serialize with admission/revocation and block new checkpoint work
        // before the durable delete starts.
        const authorityToken = live.authorityToken || (authorityService && typeof authorityService.currentToken === 'function'
          ? authorityService.currentToken(roomId)
          : null);
        // R7: quiesce the lifecycle before durable deletion; new admissions and
        // mutations are refused while the delete settles.
        if (authorityService && authorityToken) {authorityService.beginQuiesce(roomId);}
        const outcome = await roomAccess.withRoomAdmissionLock(roomId, async() => {
          live.deleting = true;
          live.lifecycleState = 'deleting';
          live.isActive = false;
          live.gmSessionId = null;
          live.inventoryShares = {};

          const deleteResult = firebaseService && typeof firebaseService.deleteRoom === 'function'
            ? await firebaseService.deleteRoom(roomId, authorityToken ? { authority: authorityToken } : {})
            : false;
          const deleted = deleteResult === true || (deleteResult && deleteResult.ok === true);
          if (!deleted) {
            // Truthful failure. Reactivation requires FRESH proof that the
            // unchanged backend authority is still held by this lifecycle.
            let stillAuthoritative = !authorityService;
            if (authorityService && authorityToken) {
              const proof = await authorityService.assertBackendHeld(authorityToken);
              stillAuthoritative = proof.ok === true;
            }
            if (stillAuthoritative) {
              live.deleting = false;
              live.lifecycleState = 'active';
            }
            return { ok: false, code: deleteResult && deleteResult.code };
          }
          if (authorityService) {authorityService.markDeleted(roomId);}

          // Suppress retained/retry checkpoint work so a stale snapshot cannot
          // recreate the deleted root.
          if (firebaseBatchWriter && typeof firebaseBatchWriter.forgetRoom === 'function') {
            firebaseBatchWriter.forgetRoom(roomId);
          }

          // Detach every owner/member device after the durable result.
          const detach = (targetSocketId, playerId) => {
            const target = targetSocketId ? io.sockets.sockets.get(targetSocketId) : null;
            if (target) {
              target.emit('room_deleted', { roomId });
              target.leave(roomId);
            }
            if (targetSocketId) {players.delete(targetSocketId);}
            if (playerId) {players.delete(playerId);}
          };
          for (const p of Array.from(live.players.values())) {detach(p.socketId, p.id);}
          if (live.gm) {detach(live.gm.socketId, live.gm.id);}
          live.players.clear();
          rooms.delete(roomId);
          return { ok: true };
        });

        if (!outcome.ok) {
          respond({ success: false, error: 'Room deletion was not confirmed; nothing was deleted' });
          return;
        }
        respond({ success: true });
        if (typeof ctx.getPublicRooms === 'function') {io.emit('room_list', ctx.getPublicRooms());}
        logger?.info?.('[delete_room] Live room deleted by owner', { roomId, uid });
        return;
      }

      // Inactive cloud room: authorize from trusted server metadata, then delete.
      const metadata = firebaseService && typeof firebaseService.getRoomRootMetadata === 'function'
        ? await firebaseService.getRoomRootMetadata(roomId)
        : null;
      if (!metadata) {
        respond({ success: false, error: 'Room not found', code: roomAccess.DENIAL_CODES.ROOM_UNAVAILABLE });
        return;
      }
      const proof = ownerProof(metadata.gmId);
      if (proof) {
        respond({
          success: false,
          error: proof === roomAccess.DENIAL_CODES.OWNER_RECOVERY_REQUIRED
            ? 'Room owner could not be proven; explicit owner recovery is required'
            : 'Only the room owner can delete the room',
          code: proof
        });
        return;
      }
      // Inactive cloud room: claim target authority, then delete under the
      // atomic tombstone fence.
      let cloudClaim = null;
      if (authorityService) {
        cloudClaim = await authorityService.acquire(roomId);
        if (!cloudClaim.ok) {
          respond({ success: false, error: 'Room is currently unavailable on this server', code: cloudClaim.code });
          return;
        }
      }
      const deleteResult = firebaseService && typeof firebaseService.deleteRoom === 'function'
        ? await firebaseService.deleteRoom(roomId, cloudClaim ? { authority: cloudClaim.token } : {})
        : false;
      const deleted = deleteResult === true || (deleteResult && deleteResult.ok === true);
      if (!deleted) {
        respond({ success: false, error: 'Room deletion was not confirmed; nothing was deleted', code: deleteResult && deleteResult.code });
        return;
      }
      if (authorityService && cloudClaim) {authorityService.markDeleted(roomId);}
      if (firebaseBatchWriter && typeof firebaseBatchWriter.forgetRoom === 'function') {
        firebaseBatchWriter.forgetRoom(roomId);
      }
      respond({ success: true });
      if (typeof ctx.getPublicRooms === 'function') {io.emit('room_list', ctx.getPublicRooms());}
      logger?.info?.('[delete_room] Inactive cloud room deleted by owner', { roomId, uid });
    } catch (error) {
      logger?.error?.('[delete_room] Error:', { error: error.message });
      respond({ success: false, error: 'Room deletion failed' });
    }
  });
}

module.exports = { registerGmToolsHandlers };
