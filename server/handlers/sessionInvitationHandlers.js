/**
 * Session Invitation Handlers
 *
 * Join-request and invitation flow for game sessions:
 * - request_to_join_session: player asks the room GM for entry
 * - respond_to_join_request: owning GM accepts/declines
 * - invite_member_to_session: owning GM issues a recipient-bound room invite
 * - revoke_room_invitation: owning GM revokes a pending room invite
 * - invite_to_party: social party invitation (never a room authorization)
 *
 * Project 4 invitation contract: typed `room` invitations (version 1) with a
 * verified owning-GM issuer, an exact recipient UID, a five-minute expiry and
 * one-time successful consumption. Socket IDs are delivery hints, never
 * identity. Old ambiguous invitations require visible reissue.
 */

const { INVITATION_EXPIRY_MS } = require('../utils/constants');
const roomAccess = require('../services/roomAccessService');

function buildRoomInvitation({ uuidv4, roomId, fromUserId, toUserId, room, issuerName }) {
  return {
    version: 1,
    kind: 'room',
    id: uuidv4(),
    roomId,
    fromUserId,
    toUserId,
    role: 'member',
    status: 'pending',
    createdAt: Date.now(),
    expiresAt: Date.now() + INVITATION_EXPIRY_MS,
    // Display metadata only; never authorization.
    partyName: 'Session Join',
    roomName: room ? room.name : 'Game Session',
    gmName: issuerName || (room && room.gm && room.gm.name) || 'Game Master',
    roomDescription: (room && room.settings && room.settings.description) || '',
    isPermanent: !!(room && room.isPermanent),
    currentPlayers: room
      ? Array.from(room.players.values())
        .filter((p) => !p.isGM)
        .map((p) => ({ id: p.id, name: p.name, class: (p.character && p.character.class) || 'Unknown' }))
      : []
  };
}

function registerSessionInvitationHandlers(ctx) {
  const {
    socket,
    rooms,
    players,
    parties,
    userToParty,
    partyInvitations,
    onlineSocialUsers,
    roomJoinRequests,
    logger,
    uuidv4,
    getSocketsByUserId,
    getOnlineUserById
  } = ctx;

  function resolveVerifiedUserId() {
    const uid = socket.data && socket.data.userId;
    return typeof uid === 'string' && uid.length > 0 ? uid : null;
  }

  function isIssuingGmForRoom(room, player, uid) {
    if (roomAccess.isOwningGm(room, uid)) {return true;}
    // Legacy temporary rooms without a recorded owner: in-room GM role.
    return !!(player && player.isGM && player.roomId === room.id && !roomAccess.isValidOwnerId(room.gmId));
  }

  socket.on('request_to_join_session', async(data) => {
    try {
      const requesterId = resolveVerifiedUserId();
      if (!requesterId) {
        socket.emit('join_error', { message: 'Authentication required', code: roomAccess.DENIAL_CODES.NOT_AUTHENTICATED });
        return;
      }

      const { leaderId, roomId } = data || {};
      const requesterName = (data && data.requesterName) || (players.get(socket.id) && players.get(socket.id).name) || 'Player';

      logger.info('[request_to_join_session] Join request received', {
        leaderId, roomId, requesterId, requesterName
      });

      const room = rooms.get(roomId);
      if (!room) {
        socket.emit('join_error', { message: 'Room not found', code: roomAccess.DENIAL_CODES.ROOM_UNAVAILABLE });
        logger.warn('[request_to_join_session] Room not found', { roomId });
        return;
      }

      // The leader must be the room's owning GM (owner id is the authority).
      const ownerId = roomAccess.isValidOwnerId(room.gmId) ? room.gmId : null;
      if (ownerId && leaderId && leaderId !== ownerId) {
        socket.emit('join_error', { message: 'Leader is not this room\'s owner', code: roomAccess.DENIAL_CODES.GM_REQUIRED });
        return;
      }
      const effectiveLeaderId = ownerId || leaderId;

      // A recorded owning GM with an active bound socket is in the session
      // even though the runtime GM player record is keyed by socket id and may
      // not carry the account UID.
      const ownerActive = !!(ownerId && room.gm && room.gm.socketId && room.isActive === true);
      const leaderInRoom = ownerActive || Array.from(players.values())
        .some(p => (p.userId === effectiveLeaderId || p.id === effectiveLeaderId) && p.roomId === roomId);

      if (!leaderInRoom) {
        socket.emit('join_error', { message: 'Leader is not in this session', code: roomAccess.DENIAL_CODES.GM_REQUIRED });
        logger.warn('[request_to_join_session] Leader not in room', { leaderId: effectiveLeaderId, roomId });
        return;
      }

      const requestId = uuidv4();
      const request = {
        id: requestId,
        roomId,
        requesterId,
        requesterName,
        leaderId: effectiveLeaderId,
        createdAt: Date.now(),
        expiresAt: Date.now() + 60000
      };

      roomJoinRequests.set(requestId, request);

      const leaderSockets = getSocketsByUserId(effectiveLeaderId);
      if (leaderSockets.length > 0) {
        leaderSockets.forEach(s => {
          s.emit('session_join_request', request);
        });
        logger.info('[request_to_join_session] Join request sent to leader', {
          requestId, requesterId, leaderId: effectiveLeaderId
        });
      } else {
        socket.emit('join_error', { message: 'Leader is not online', code: roomAccess.DENIAL_CODES.GM_REQUIRED });
        logger.warn('[request_to_join_session] Leader not online', { leaderId: effectiveLeaderId });
        roomJoinRequests.delete(requestId);
      }

    } catch (error) {
      logger.error('[request_to_join_session] Error:', { error: error.message });
    }
  });

  socket.on('respond_to_join_request', async(data) => {
    try {
      const { requestId, accepted } = data || {};

      logger.info('[respond_to_join_request] Response received', { requestId, accepted });

      const request = roomJoinRequests.get(requestId);
      if (!request) {
        socket.emit('join_error', { message: 'Request not found or expired', code: roomAccess.DENIAL_CODES.INVITATION_INVALID });
        logger.warn('[respond_to_join_request] Request not found', { requestId });
        return;
      }

      if (Date.now() > request.expiresAt) {
        roomJoinRequests.delete(requestId);
        socket.emit('join_error', { message: 'Request expired', code: roomAccess.DENIAL_CODES.INVITATION_EXPIRED });
        logger.warn('[respond_to_join_request] Request expired', { requestId });
        return;
      }

      // Only GM authority over the RELEVANT room may approve/decline.
      const room = rooms.get(request.roomId);
      if (!room) {
        roomJoinRequests.delete(requestId);
        socket.emit('join_error', { message: 'Room no longer exists', code: roomAccess.DENIAL_CODES.ROOM_UNAVAILABLE });
        return;
      }
      const responder = players.get(socket.id);
      const responderId = resolveVerifiedUserId() || (responder && responder.userId) || null;
      const isAuthorizedResponder = roomAccess.isOwningGm(room, responderId) ||
        (responder && responder.isGM && responder.roomId === room.id && !roomAccess.isValidOwnerId(room.gmId));
      if (!isAuthorizedResponder) {
        socket.emit('join_error', { message: 'Not authorized to respond to this request', code: roomAccess.DENIAL_CODES.GM_REQUIRED });
        logger.warn('[respond_to_join_request] Unauthorized responder', {
          requestId, responderId, ownerId: room.gmId
        });
        return;
      }

      const requesterSockets = getSocketsByUserId(request.requesterId);

      if (accepted) {
        const invitation = buildRoomInvitation({
          uuidv4,
          roomId: request.roomId,
          fromUserId: roomAccess.isValidOwnerId(room.gmId) ? room.gmId : responderId,
          toUserId: request.requesterId,
          room,
          issuerName: responder && responder.name
        });

        partyInvitations.set(invitation.id, invitation);

        if (requesterSockets.length > 0) {
          requesterSockets.forEach(s => {
            s.emit('join_request_accepted', {
              invitation,
              roomId: request.roomId
            });
          });
        }

        logger.info('[respond_to_join_request] Join request accepted', {
          requestId, requesterId: request.requesterId
        });
      } else {
        if (requesterSockets.length > 0) {
          requesterSockets.forEach(s => {
            s.emit('join_request_declined', {
              requestId,
              leaderId: request.leaderId
            });
          });
        }

        logger.info('[respond_to_join_request] Join request declined', {
          requestId, requesterId: request.requesterId
        });
      }

      roomJoinRequests.delete(requestId);

    } catch (error) {
      logger.error('[respond_to_join_request] Error:', { error: error.message });
    }
  });

  socket.on('invite_member_to_session', async(data) => {
    try {
      const { memberId, roomId } = data || {};
      const uid = resolveVerifiedUserId();

      logger.info('[invite_member_to_session] Session invite received', {
        memberId, roomId, inviterId: uid
      });

      if (!uid) {
        socket.emit('invite_error', { message: 'Authentication required', code: roomAccess.DENIAL_CODES.NOT_AUTHENTICATED });
        return;
      }

      const player = players.get(socket.id);
      if (!player || player.roomId !== roomId) {
        socket.emit('invite_error', { message: 'You must be in the session to invite', code: roomAccess.DENIAL_CODES.NOT_ROOM_MEMBER });
        logger.warn('[invite_member_to_session] Inviter not in room', { socketId: socket.id });
        return;
      }

      const room = rooms.get(roomId);
      if (!room) {
        socket.emit('invite_error', { message: 'Room not found', code: roomAccess.DENIAL_CODES.ROOM_UNAVAILABLE });
        logger.warn('[invite_member_to_session] Room not found', { roomId });
        return;
      }

      // P4: issuer must be the verified owning GM of this room.
      if (!isIssuingGmForRoom(room, player, uid)) {
        socket.emit('invite_error', { message: 'GM privileges required', code: roomAccess.DENIAL_CODES.GM_REQUIRED });
        logger.warn('[invite_member_to_session] Issuer is not the room owner', { uid, roomId });
        return;
      }

      if (typeof memberId !== 'string' || memberId.length === 0) {
        socket.emit('invite_error', { message: 'A recipient account is required', code: roomAccess.DENIAL_CODES.INVITATION_INVALID });
        return;
      }
      if (memberId === uid) {
        socket.emit('invite_error', { message: 'You are already in this session', code: roomAccess.DENIAL_CODES.INVITATION_INVALID });
        return;
      }
      if (Array.isArray(room.bannedUsers) && room.bannedUsers.includes(memberId)) {
        socket.emit('invite_error', { message: 'That account is not permitted to join this room', code: roomAccess.DENIAL_CODES.NOT_ROOM_MEMBER });
        return;
      }

      const memberSockets = getSocketsByUserId(memberId);
      if (memberSockets.length === 0) {
        socket.emit('invite_error', { message: 'Member not online', code: roomAccess.DENIAL_CODES.ROOM_UNAVAILABLE });
        logger.warn('[invite_member_to_session] Member not online', { memberId });
        return;
      }

      const invitation = buildRoomInvitation({
        uuidv4,
        roomId,
        fromUserId: roomAccess.isValidOwnerId(room.gmId) ? room.gmId : uid,
        toUserId: memberId,
        room,
        issuerName: player.name
      });

      partyInvitations.set(invitation.id, invitation);

      memberSockets.forEach(s => {
        s.emit('gm_session_invitation', invitation);
      });

      socket.emit('session_invitation_sent', { memberId, invitationId: invitation.id });

      logger.info('[invite_member_to_session] Session invitation sent', {
        memberId, roomId, invitationId: invitation.id
      });

    } catch (error) {
      logger.error('[invite_member_to_session] Error:', { error: error.message });
    }
  });

  socket.on('revoke_room_invitation', async(data) => {
    try {
      const { invitationId } = data || {};
      const uid = resolveVerifiedUserId();
      if (!uid) {
        socket.emit('invite_error', { message: 'Authentication required', code: roomAccess.DENIAL_CODES.NOT_AUTHENTICATED });
        return;
      }
      const invitation = invitationId ? partyInvitations.get(invitationId) : null;
      if (!invitation || invitation.kind !== 'room' || invitation.version !== 1) {
        socket.emit('invite_error', { message: 'Invitation not found', code: roomAccess.DENIAL_CODES.INVITATION_INVALID });
        return;
      }
      const room = rooms.get(invitation.roomId);
      const player = players.get(socket.id);
      const issuerAuthorized = (room && roomAccess.isOwningGm(room, uid)) ||
        (room && !roomAccess.isValidOwnerId(room.gmId) && player && player.isGM && player.roomId === room.id);
      if (!issuerAuthorized) {
        socket.emit('invite_error', { message: 'GM privileges required', code: roomAccess.DENIAL_CODES.GM_REQUIRED });
        return;
      }
      if (invitation.status === 'accepted' || invitation.status === 'declined') {
        socket.emit('invite_error', { message: 'Invitation already resolved', code: roomAccess.DENIAL_CODES.INVITATION_CONSUMED });
        return;
      }
      // R8.1: revocation shares the admission lock with acceptance so accept and
      // revoke have exactly one deterministic winner.
      await roomAccess.withRoomAdmissionLock(room.id, async() => {
        if (invitation.status === 'accepted' || invitation.status === 'declined' || invitation.status === 'revoked') {
          socket.emit('invite_error', { message: 'Invitation already resolved', code: roomAccess.DENIAL_CODES.INVITATION_CONSUMED });
          return;
        }
        invitation.status = 'revoked';
        invitation.revokedAt = Date.now();
        invitation.revokedBy = uid;
      });
      if (invitation.status !== 'revoked') {return;}

      const recipientSockets = getSocketsByUserId(invitation.toUserId);
      recipientSockets.forEach(s => {
        s.emit('room_invitation_revoked', { invitationId: invitation.id, roomId: invitation.roomId });
      });
      socket.emit('session_invitation_revoked', { invitationId: invitation.id });
    } catch (error) {
      logger.error('[revoke_room_invitation] Error:', { error: error.message });
    }
  });

  socket.on('invite_to_party', async({ partyId, fromUserId, toUserId }) => {
    try {
      logger.info('📢 [invite_to_party] Received invite request', { partyId, fromUserId, toUserId, socketId: socket.id });

      const targetUserPartyId = userToParty.get(toUserId);
      let targetAlreadyInParty = false;
      let targetExistingPartyId = null;
      if (targetUserPartyId) {
        const targetUserParty = parties.get(targetUserPartyId);
        if (!targetUserParty) {
          logger.warn('📢 [invite_to_party] Cleaning stale userToParty entry for target', { toUserId, stalePartyId: targetUserPartyId });
          userToParty.delete(toUserId);
        } else {
          const targetOnlineUser = getOnlineUserById(toUserId);
          if (!targetOnlineUser) {
            logger.warn('📢 [invite_to_party] Target user has party entry but is offline, cleaning up', { toUserId, stalePartyId: targetUserPartyId });
            userToParty.delete(toUserId);
          } else {
            if (targetUserPartyId === partyId) {
              logger.info('📢 [invite_to_party] Target already in same party', { toUserId, partyId });
              socket.emit('party_invite_failed', {
                error: 'User is already in your party',
                toUserId: toUserId
              });
              return;
            }
            logger.info('📢 [invite_to_party] Target user already in a different party, delivering invite with auto-leave flag', { toUserId, existingPartyId: targetUserPartyId });
            targetAlreadyInParty = true;
            targetExistingPartyId = targetUserPartyId;
          }
        }
      }

      let targetPartyId = partyId;

      if (!targetPartyId && fromUserId) {
        targetPartyId = userToParty.get(fromUserId);
        logger.info('📢 [invite_to_party] Resolved partyId from user', { fromUserId, targetPartyId });
      }

      const party = parties.get(targetPartyId);
      if (!party) {
        logger.warn('📢 [invite_to_party] Party not found', { targetPartyId });
        socket.emit('party_error', { error: 'Party not found' });
        return;
      }

      const invitationId = uuidv4();
      const invitation = {
        id: invitationId,
        // Social party invitation only. NEVER a room-access grant.
        kind: 'party',
        partyId: targetPartyId,
        fromUserId,
        toUserId,
        createdAt: Date.now(),
        expiresAt: Date.now() + INVITATION_EXPIRY_MS
      };

      partyInvitations.set(invitationId, invitation);

      const targetSockets = getSocketsByUserId(toUserId);

      if (targetSockets.length > 0) {
        const inviterData = onlineSocialUsers.get(socket.id) || {};
        const invitationPayload = {
          ...invitation,
          partyName: party.name,
          fromUserName: inviterData.name || 'Unknown',
          senderName: inviterData.name || 'Unknown',
          senderLevel: inviterData.characterLevel || 1,
          senderClass: inviterData.characterClass || 'Unknown',
          fromUserId,
          targetAlreadyInParty,
          targetExistingPartyId
        };
        targetSockets.forEach(s => s.emit('party_invitation_received', invitationPayload));
        logger.info('📢 [invite_to_party] Invitation delivered', { invitationId, toUserId, socketCount: targetSockets.length });
      } else {
        logger.warn('📢 [invite_to_party] Target user not found in onlineSocialUsers', {
          toUserId,
          onlineUsersCount: onlineSocialUsers.size,
          onlineUserIds: Array.from(onlineSocialUsers.values()).map(u => u.userId).slice(0, 10)
        });
        socket.emit('party_invite_failed', {
          error: 'User is not reachable: their social socket may not be connected',
          toUserId
        });
        partyInvitations.delete(invitationId);
        return;
      }

      socket.emit('invitation_sent', { invitationId, toUserId });
      logger.info('📢 [invite_to_party] Invitation sent confirmation emitted', { invitationId, toUserId });

    } catch (error) {
      logger.error('📢 [invite_to_party] Error:', { error: error.message });
    }
  });
}

module.exports = { registerSessionInvitationHandlers };
