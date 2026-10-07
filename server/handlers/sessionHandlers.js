/**
 * Session Handlers
 *
 * Game session lifecycle and player/room membership transitions:
 * - launch_game_session: GM triggers session start (broadcasts to room)
 * - respond_to_game_session: player accepts/declines session start
 * - respond_to_room_invitation: recipient accepts/declines a recipient-bound
 *   GM room invitation (P4: typed, recipient-bound, expiring, one-time)
 * - update_player_color: player color change broadcast to room
 */

const roomAccess = require('../services/roomAccessService');
const { getDeltaSyncCapabilities } = require('../services/deltaSyncCapabilities');

function registerSessionHandlers(ctx) {
  const {
    io,
    socket,
    rooms,
    players,
    partyInvitations,
    logger,
    uuidv4,
    sanitizePlayerName,
    firebaseService,
    getPublicRooms,
    authorityService
  } = ctx;

  socket.on('launch_game_session', (_data) => {
    const player = players.get(socket.id);
    if (!player || !player.isGM) {return;}

    const room = rooms.get(player.roomId);
    if (!room) {return;}
    if (authorityService && roomAccess.roomAuthorityDenial(room, authorityService)) {return;}

    // Notify the room that the game session is starting. The client listens for
    // `game_session_launched` (players only; the GM's flag filters it out).
    io.to(player.roomId).emit('game_session_launched', {
      roomId: room.id,
      roomName: room.name,
      gmName: player.name,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('respond_to_game_session', (data) => {
    const player = players.get(socket.id);
    if (!player) {return;}

    const room = rooms.get(player.roomId);
    if (!room) {return;}
    if (authorityService && roomAccess.roomAuthorityDenial(room, authorityService)) {return;}

    // Relay the response to the room; the client filters it to the GM.
    socket.to(room.id).emit('game_session_response', {
      playerId: player.id,
      playerName: player.name,
      accepted: !!data?.accepted,
      timestamp: new Date().toISOString()
    });
  });

  socket.on('respond_to_room_invitation', async(data) => {
    const emitJoinError = (code, message) => {
      socket.emit('join_error', message ? { message, code } : { code });
    };
    try {
      const uid = socket.data?.userId || null;
      if (!uid) {
        emitJoinError(roomAccess.DENIAL_CODES.NOT_AUTHENTICATED, 'Authentication required to join session');
        return;
      }

      const invitationId = data && data.invitationId;
      const invitation = invitationId ? partyInvitations.get(invitationId) : null;

      // P4: only typed, recipient-bound room invitations authorize room
      // admission. Old ambiguous invitations are never bearer tickets.
      if (!invitation || invitation.kind !== 'room' || invitation.version !== 1) {
        emitJoinError(roomAccess.DENIAL_CODES.INVITATION_REISSUE_REQUIRED,
          'This invitation is no longer valid; ask the GM to reissue it');
        return;
      }

      if (data.roomId && invitation.roomId !== data.roomId) {
        emitJoinError(roomAccess.DENIAL_CODES.INVITATION_INVALID, 'Invitation does not match this room');
        return;
      }

      if (invitation.toUserId !== uid) {
        // Do not consume another account's invitation.
        emitJoinError(roomAccess.DENIAL_CODES.INVITATION_WRONG_RECIPIENT, 'This invitation is for a different account');
        return;
      }

      if (invitation.status === 'revoked') {
        emitJoinError(roomAccess.DENIAL_CODES.INVITATION_REVOKED, 'This invitation was revoked');
        return;
      }
      if (invitation.status === 'accepted') {
        emitJoinError(roomAccess.DENIAL_CODES.INVITATION_CONSUMED, 'This invitation has already been used');
        return;
      }
      if (invitation.status === 'declined') {
        emitJoinError(roomAccess.DENIAL_CODES.INVITATION_CONSUMED, 'This invitation is no longer available');
        return;
      }
      if (Number(invitation.expiresAt) && Date.now() > Number(invitation.expiresAt)) {
        partyInvitations.delete(invitation.id);
        emitJoinError(roomAccess.DENIAL_CODES.INVITATION_EXPIRED, 'This invitation has expired');
        return;
      }

      if (!data.accepted) {
        invitation.status = 'declined';
        invitation.declinedAt = Date.now();
        logger.info('[respond_to_room_invitation] Player declined GM invitation', {
          invitationId: invitation.id, uid
        });
        return;
      }

      const room = rooms.get(invitation.roomId);
      if (!room) {
        emitJoinError(roomAccess.DENIAL_CODES.ROOM_UNAVAILABLE, 'Room no longer exists');
        return;
      }

      // C5: invitation admission requires current target-room authority. No
      // second runtime is reconstructed merely to accept an invite.
      if (authorityService) {
        const denial = roomAccess.roomAuthorityDenial(room, authorityService);
        if (denial) {
          emitJoinError(denial, 'Room is not currently available on this server');
          return;
        }
      }

      // Lifetime validation and consumption happen atomically with admission
      // inside the shared per-room admission lock. Revalidate everything that
      // could have raced since the fast-path checks.
      const outcome = await roomAccess.withRoomAdmissionLock(room.id, async() => {
        // B11: prove this is the SAME registered invitation record (stable
        // identity), not a stale copy; a replacement/reissue must not be
        // consumed by the old acceptance.
        if (partyInvitations.get(invitation.id) !== invitation) {
          return { code: roomAccess.DENIAL_CODES.INVITATION_REISSUE_REQUIRED };
        }
        if (invitation.kind !== 'room' || invitation.version !== 1) {
          return { code: roomAccess.DENIAL_CODES.INVITATION_INVALID };
        }
        if (invitation.roomId !== room.id) {
          return { code: roomAccess.DENIAL_CODES.INVITATION_INVALID };
        }
        if (invitation.status === 'revoked') {return { code: roomAccess.DENIAL_CODES.INVITATION_REVOKED };}
        if (invitation.status === 'accepted') {return { code: roomAccess.DENIAL_CODES.INVITATION_CONSUMED };}
        if (invitation.status === 'declined') {return { code: roomAccess.DENIAL_CODES.INVITATION_CONSUMED };}
        const expiry = Number(invitation.expiresAt);
        if (!Number.isFinite(expiry) || Date.now() >= expiry) {
          partyInvitations.delete(invitation.id);
          return { code: roomAccess.DENIAL_CODES.INVITATION_EXPIRED };
        }
        if (invitation.toUserId !== uid) {return { code: roomAccess.DENIAL_CODES.INVITATION_WRONG_RECIPIENT };}
        if (roomAccess.isValidOwnerId(room.gmId) && invitation.fromUserId !== room.gmId) {
          return { code: roomAccess.DENIAL_CODES.INVITATION_REISSUE_REQUIRED };
        }
        if (room.isPermanent) {
          const identity = roomAccess.checkDurableRoomIdentity(socket);
          if (!identity.allowed) {return { code: identity.code };}
          if (!roomAccess.hasProvableOwner(room)) {return { code: roomAccess.DENIAL_CODES.OWNER_RECOVERY_REQUIRED };}
        }
        if (roomAccess.isOwningGm(room, uid)) {return { code: roomAccess.DENIAL_CODES.GM_REQUIRED };}
        const eligibility = () => {
          if (partyInvitations.get(invitation.id) !== invitation) {
            return { ok: false, code: roomAccess.DENIAL_CODES.INVITATION_REISSUE_REQUIRED };
          }
          if (invitation.kind !== 'room' || invitation.version !== 1 || invitation.roomId !== room.id) {
            return { ok: false, code: roomAccess.DENIAL_CODES.INVITATION_INVALID };
          }
          if (invitation.status === 'revoked') {return { ok: false, code: roomAccess.DENIAL_CODES.INVITATION_REVOKED };}
          if (invitation.status !== 'pending') {return { ok: false, code: roomAccess.DENIAL_CODES.INVITATION_CONSUMED };}
          if (!(Number(invitation.expiresAt) > Date.now())) {
            partyInvitations.delete(invitation.id);
            return { ok: false, code: roomAccess.DENIAL_CODES.INVITATION_EXPIRED };
          }
          if (invitation.toUserId !== uid) {return { ok: false, code: roomAccess.DENIAL_CODES.INVITATION_WRONG_RECIPIENT };}
          if (roomAccess.isValidOwnerId(room.gmId) && invitation.fromUserId !== room.gmId) {
            return { ok: false, code: roomAccess.DENIAL_CODES.INVITATION_REISSUE_REQUIRED };
          }
          return { ok: true };
        };

        // Duplicate event for this exact socket: consume idempotently. No new
        // runtime side effect, but the exact room authority must still hold and
        // the invitation must still be pending/registered AFTER the await.
        const sameSocket = Array.from(room.players.values())
          .find((p) => p && p.socketId === socket.id && p.userId === uid);
        if (sameSocket) {
          if (authorityService) {
            const fresh = await authorityService.assertCurrent(room.authorityToken || null, { backendCheck: true });
            if (!fresh.ok) {return { code: fresh.code || roomAccess.DENIAL_CODES.ROOM_AUTHORITY_LOST };}
          }
          const recheck = eligibility();
          if (!recheck.ok) {return { code: recheck.code };}
          invitation.status = 'accepted';
          invitation.consumedAt = invitation.consumedAt || Date.now();
          return { ok: true, player: sameSocket, room, alreadyAttached: true };
        }

        // R8/B10/B11: invitation lifetime/status/identity is revalidated at the
        // last synchronous point before irreversible admission effects. A
        // failure here rolls back the durable grant (when this request created
        // it) and inserts no runtime player/map/socket side effect.
        const admission = await roomAccess.admitVerifiedMember({
          socket,
          rooms,
          players,
          firebaseService,
          uuidv4,
          room,
          userId: uid,
          playerName: data.playerName || (data.character && data.character.name) || 'Player',
          playerColor: '#4a90e2',
          character: data.character || null,
          sanitizePlayerName,
          lockHeld: true,
          authorityService,
          validateBeforeSideEffects: eligibility
        });
        if (!admission.ok) {return { code: admission.code };}
        // Consume only AFTER durable + runtime admission for THIS request. The
        // pre-side-effect check already validated the invitation; no
        // post-effect error path may leave admission effects behind.
        invitation.status = 'accepted';
        invitation.consumedAt = Date.now();
        return { ok: true, player: admission.player, room: admission.room };
      });

      if (!outcome.ok) {
        const message = outcome.code === roomAccess.DENIAL_CODES.CAPACITY_REACHED
          ? 'Room is full'
          : outcome.code === roomAccess.DENIAL_CODES.MEMBERSHIP_PERSISTENCE_FAILED
            ? 'Room membership could not be confirmed; join was refused'
            : outcome.code === roomAccess.DENIAL_CODES.MEMBERSHIP_COMPENSATION_REQUIRED
              ? 'Join was refused; the room membership change needs retry'
              : outcome.code === roomAccess.DENIAL_CODES.MEMBERSHIP_COMPENSATION_PERSISTENCE_FAILED
                ? 'Join was refused; the room membership change could not be safely recorded'
                : outcome.code === roomAccess.DENIAL_CODES.MEMBERSHIP_COMPENSATION_UNAVAILABLE
                  ? 'Room membership recovery is temporarily unavailable; join was refused'
                  : 'Unable to join this room';
        emitJoinError(outcome.code, message);
        return;
      }

      const liveRoom = outcome.room;
      const player = outcome.player;

      const roomForEmission = roomAccess.buildRoomProjection(liveRoom);
      roomForEmission.deltaSyncCapabilities = getDeltaSyncCapabilities();
      roomForEmission.playerMapAssignments = (liveRoom.gameState && liveRoom.gameState.playerMapAssignments) || {};

      socket.emit('room_joined', {
        room: roomForEmission,
        player: roomAccess.projectPlayerForClient(player),
        isGM: false
      });

      socket.to(liveRoom.id).emit('player_joined', {
        player: roomAccess.projectPlayerForClient(player),
        playerCount: roomAccess.countActiveMemberSlots(liveRoom)
      });

      if (typeof getPublicRooms === 'function') {
        io.emit('room_list', getPublicRooms());
      }

      logger.info('[respond_to_room_invitation] Player joined room via GM invitation', {
        playerId: player.id, userId: uid, roomId: liveRoom.id, invitationId: invitation.id
      });

    } catch (error) {
      logger.error('[respond_to_room_invitation] Error:', { error: error.message });
      emitJoinError(null, 'Unable to join this room');
    }
  });

  socket.on('update_player_color', (data) => {
    const player = players.get(socket.id);
    if (!player) {return;}

    player.color = data.color;

    const room = rooms.get(player.roomId);
    if (room) {
      if (authorityService && roomAccess.roomAuthorityDenial(room, authorityService)) {return;}
      room.players.set(player.id, player);

      io.to(player.roomId).emit('player_color_updated', {
        playerId: player.id,
        color: data.color
      });
    }
  });

}

module.exports = { registerSessionHandlers };
