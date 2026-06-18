/**
 * Session Invitation Handlers
 *
 * Join-request and invitation flow for game sessions:
 * - request_to_join_session: player asks leader for entry (creates roomJoinRequest)
 * - respond_to_join_request: leader accepts/declines (creates partyInvitation on accept)
 * - invite_member_to_session: in-room member invites outsider (GM or party member)
 * - invite_to_party: party-scoped invitation with auto-leave detection
 */

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

  socket.on('request_to_join_session', async (data) => {
    try {
      const { leaderId, roomId, requesterId, requesterName } = data;

      logger.info('[request_to_join_session] Join request received', {
        leaderId, roomId, requesterId, requesterName
      });

      const room = rooms.get(roomId);
      if (!room) {
        socket.emit('join_error', { message: 'Room not found' });
        logger.warn('[request_to_join_session] Room not found', { roomId });
        return;
      }

      const leaderInRoom = Array.from(players.values())
        .some(p => (p.userId === leaderId || p.id === leaderId) && p.roomId === roomId);

      if (!leaderInRoom) {
        socket.emit('join_error', { message: 'Leader is not in this session' });
        logger.warn('[request_to_join_session] Leader not in room', { leaderId, roomId });
        return;
      }

      const requestId = uuidv4();
      const request = {
        id: requestId,
        roomId,
        requesterId,
        requesterName,
        leaderId,
        createdAt: Date.now(),
        expiresAt: Date.now() + 60000
      };

      roomJoinRequests.set(requestId, request);

      const leaderSockets = getSocketsByUserId(leaderId);
      if (leaderSockets.length > 0) {
        leaderSockets.forEach(s => {
          s.emit('session_join_request', request);
        });
        logger.info('[request_to_join_session] Join request sent to leader', {
          requestId, requesterId, leaderId
        });
      } else {
        socket.emit('join_error', { message: 'Leader is not online' });
        logger.warn('[request_to_join_session] Leader not online', { leaderId });
        roomJoinRequests.delete(requestId);
      }

    } catch (error) {
      logger.error('[request_to_join_session] Error:', { error: error.message });
    }
  });

  socket.on('respond_to_join_request', async (data) => {
    try {
      const { requestId, accepted } = data;

      logger.info('[respond_to_join_request] Response received', { requestId, accepted });

      const request = roomJoinRequests.get(requestId);
      if (!request) {
        socket.emit('join_error', { message: 'Request not found or expired' });
        logger.warn('[respond_to_join_request] Request not found', { requestId });
        return;
      }

      if (Date.now() > request.expiresAt) {
        roomJoinRequests.delete(requestId);
        socket.emit('join_error', { message: 'Request expired' });
        logger.warn('[respond_to_join_request] Request expired', { requestId });
        return;
      }

      const requesterSockets = getSocketsByUserId(request.requesterId);

      if (accepted) {
        const invitation = {
          id: uuidv4(),
          roomId: request.roomId,
          partyName: 'Session Join',
          gmName: request.leaderId,
          createdAt: Date.now(),
          expiresAt: Date.now() + 300000
        };

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

  socket.on('invite_member_to_session', async (data) => {
    try {
      const { memberId, roomId } = data;
      const userId = socket.data?.userId;

      logger.info('[invite_member_to_session] Session invite received', {
        memberId, roomId, inviterId: userId
      });

      const player = players.get(socket.id);
      if (!player || player.roomId !== roomId) {
        socket.emit('invite_error', { message: 'You must be in the session to invite' });
        logger.warn('[invite_member_to_session] Inviter not in room', { socketId: socket.id });
        return;
      }

      const room = rooms.get(roomId);
      if (!room) {
        socket.emit('invite_error', { message: 'Room not found' });
        logger.warn('[invite_member_to_session] Room not found', { roomId });
        return;
      }

      const memberSockets = getSocketsByUserId(memberId);
      if (memberSockets.length === 0) {
        socket.emit('invite_error', { message: 'Member not online' });
        logger.warn('[invite_member_to_session] Member not online', { memberId });
        return;
      }

      const invitation = {
        id: uuidv4(),
        roomId,
        partyName: room.name || 'Game Session',
        gmName: player.name,
        gmLevel: player.character?.level,
        isPermanent: room.isPermanent || false,
        roomDescription: room.settings?.description || '',
        currentPlayers: Array.from(room.players.values()).map(p => ({
          id: p.id,
          name: p.name,
          class: p.character?.class || 'Unknown'
        })),
        status: 'pending',
        createdAt: Date.now(),
        expiresAt: Date.now() + 300000
      };

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

  socket.on('invite_to_party', async ({ partyId, fromUserId, toUserId }) => {
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
        partyId: targetPartyId,
        fromUserId,
        toUserId,
        createdAt: Date.now(),
        expiresAt: Date.now() + (5 * 60 * 1000)
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
          error: 'User is not reachable — their social socket may not be connected',
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
