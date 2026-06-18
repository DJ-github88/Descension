/**
 * Party Handlers (Social Party System)
 *
 * Social party lifecycle (distinct from room party):
 * - create_party / join_party / leave_party / disband_party: lifecycle
 * - register_presence / update_status: social presence tracking
 * - accept_party_invite / decline_party_invite: invitation response
 * - party_message: party-scoped chat
 * - promote_to_leader / remove_party_member: member management
 *
 * NOTE: Four internal helpers (getPartyMemberCount, emitPartyUpdated,
 * createSocialParty, autoDisbandIfTooSmall) appear to be unused after
 * extraction audit — candidates for future cleanup.
 */

function registerPartyHandlers(ctx) {
  const {
    socket,
    players,
    parties,
    userToParty,
    partyInvitations,
    onlineSocialUsers,
    logger,
    uuidv4,
    sanitizeChatMessage,
    handlePartyLeave,
    getSocketsByUserId,
    emitToUserId,
    getUserDisplayName,
    buildPartyMemberData,
    emitToPartyMembers
  } = ctx;

  const getPartyMemberCount = (party) => Object.keys(party?.members || {}).length;

  const normalizePartyForClient = (party) => {
    if (!party) return null;
    return {
      ...party,
      members: { ...(party.members || {}) }
    };
  };

  const emitPartyUpdated = (party) => {
    if (!party) return;
    emitToPartyMembers(party, 'party_updated', normalizePartyForClient(party));
  };

  const createSocialParty = ({ leaderUserId, partyName, leaderData = {} }) => {
    const fallbackName = `${getUserDisplayName(leaderUserId, 'Party Leader')}'s Party`;
    const normalizedName =
      typeof partyName === 'string' && partyName.trim().length > 0
        ? partyName.trim()
        : fallbackName;

    const partyId = uuidv4();
    const createdAt = Date.now();
    const leaderMember = buildPartyMemberData(leaderUserId, {
      ...leaderData,
      isGM: true,
      joinedAt: createdAt
    });

    const party = {
      id: partyId,
      name: normalizedName,
      leaderId: leaderUserId,
      maxMembers: 6,
      isActive: true,
      members: {
        [leaderUserId]: leaderMember
      },
      createdAt,
      updatedAt: createdAt
    };

    parties.set(partyId, party);
    userToParty.set(leaderUserId, partyId);

    return party;
  };

  const autoDisbandIfTooSmall = (party, context = {}) => {
    if (!party) return false;

    const memberIds = Object.keys(party.members || {});
    if (memberIds.length === 0) {
      parties.delete(party.id);
      return true;
    }

    if (memberIds.length === 1) {
      const lastMemberId = memberIds[0];
      const lastMember = party.members[lastMemberId];
      const disbandPayload = {
        partyId: party.id,
        partyName: party.name,
        disbandedBy: context.triggerUserId || null
      };

      emitToUserId(lastMemberId, 'party_auto_disbanded', {
        ...disbandPayload,
        message: `${party.name} has been disbanded because only one member remained.`
      });

      emitToUserId(lastMemberId, 'party_disbanded', disbandPayload);

      userToParty.delete(lastMemberId);
      parties.delete(party.id);

      logger.info('[party] Auto-disbanded party with a single remaining member', {
        partyId: party.id,
        partyName: party.name,
        lastMemberId,
        lastMemberName: lastMember?.name,
        triggeredBy: context.triggerUserId || null
      });

      return true;
    }

    return false;
  };

  socket.on('create_party', ({ partyName, leaderData }) => {
    try {
      let userId = socket.data.userId;
      let userName = leaderData?.name || 'Unknown';

      const player = players.get(socket.id);
      const socialUser = onlineSocialUsers.get(socket.id);

      if (player) {
        userId = player.userId || userId || player.id;
        userName = player.name;
      } else if (socialUser) {
        userId = socialUser.userId;
        userName = socialUser.name;
      }

      if (!userId) {
        if (socket.data.isGuest) {
          userId = 'guest-' + socket.id;
        } else {
          return;
        }
      }

      const partyId = uuidv4();
      const leaderMember = buildPartyMemberData(userId, {
        ...leaderData,
        isGM: true,
        joinedAt: Date.now()
      });

      const party = {
        id: partyId,
        name: partyName || `${userName}'s Party`,
        leaderId: userId,
        members: {
          [userId]: leaderMember
        },
        createdAt: Date.now(),
        updatedAt: Date.now()
      };

      parties.set(partyId, party);
      userToParty.set(userId, partyId);

      socket.emit('party_created', { party });

      logger.info('[create_party] Party created', { partyId, leaderId: userId });

    } catch (error) {
      logger.error('[create_party] Error:', { error: error.message });
    }
  });

  socket.on('join_party', ({ partyId }) => {
    try {
      let userId = socket.data.userId;
      let userName = 'Unknown';

      const player = players.get(socket.id);
      const socialUser = onlineSocialUsers.get(socket.id);

      if (player) {
        userId = player.userId || userId || player.id;
        userName = player.name;
      } else if (socialUser) {
        userId = socialUser.userId;
        userName = socialUser.name;
      }

      if (!userId) return;

      const party = parties.get(partyId);
      if (!party) {
        socket.emit('party_error', { error: 'Party not found' });
        return;
      }

      if (party.members[userId]) {
        socket.emit('party_joined', { party: normalizePartyForClient(party) });
        return;
      }

      const memberData = buildPartyMemberData(userId, { isGM: false });
      party.members[userId] = memberData;
      userToParty.set(userId, partyId);

      socket.emit('party_joined', { party: normalizePartyForClient(party) });

      Object.keys(party.members).forEach(memberId => {
        if (memberId !== userId) {
          const memberSockets = getSocketsByUserId(memberId);
          memberSockets.forEach(s => s.emit('party_member_joined', {
            partyId,
            memberId: userId,
            memberData: memberData
          }));
        }
      });

      logger.info('[join_party] Player joined party', { playerId: userId, partyId });

    } catch (error) {
      logger.error('[join_party] Error:', { error: error.message });
    }
  });

  socket.on('leave_party', () => {
    try {
      let userId = socket.data.userId;
      let userName = 'Unknown';

      const player = players.get(socket.id);
      const socialUser = onlineSocialUsers.get(socket.id);

      if (player) {
        userId = player.userId || userId || player.id;
        userName = player.name;
      } else if (socialUser) {
        userId = socialUser.userId;
        userName = socialUser.name;
      }

      if (!userId) {
        logger.warn('[leave_party] No userId found', { socketId: socket.id });
        return;
      }

      handlePartyLeave(userId, userName, socket.id);

      socket.emit('party_left', { success: true });

      logger.info('[leave_party] Player left party', { playerId: userId, socketId: socket.id });

    } catch (error) {
      logger.error('[leave_party] Error:', { error: error.message, stack: error.stack });
    }
  });

  socket.on('register_presence', (data) => {
    try {
      let userId = socket.data.userId || data.userId;
      let originalUserId = userId;
      let name = data.name || 'Unknown';

      const player = players.get(socket.id);
      if (player) {
        originalUserId = userId;
        userId = player.userId || userId || player.id;
        name = player.name;
      }

      if (!userId) {
        if (socket.data.isGuest) {
          userId = 'guest-' + socket.id;
        } else {
          logger.warn('[register_presence] No userId available', { socketId: socket.id, dataUserId: data.userId });
          return;
        }
      }

      socket.data.userId = userId;
      socket.data.userName = name;

      onlineSocialUsers.set(socket.id, {
        userId: userId,
        socketId: socket.id,
        originalUserId: originalUserId !== userId ? originalUserId : null,
        name: name,
        characterClass: data.characterClass,
        characterLevel: data.characterLevel,
        status: 'online',
        lastSeen: Date.now()
      });

      socket.emit('presence_registered', { success: true });

    } catch (error) {
      logger.error('[register_presence] Error:', { error: error.message });
    }
  });

  socket.on('update_status', (data) => {
    try {
      const { userId, status, statusComment } = data;

      if (!userId) {
        logger.warn('[update_status] Missing userId');
        return;
      }

      const validStatuses = ['online', 'away', 'busy', 'offline'];
      if (!validStatuses.includes(status)) {
        logger.warn('[update_status] Invalid status:', { status });
        return;
      }

      const userEntry = Array.from(onlineSocialUsers.entries())
        .find(([socketId, user]) => user.userId === userId);

      if (userEntry) {
        const [socketId, userData] = userEntry;
        onlineSocialUsers.set(socketId, {
          ...userData,
          status,
          statusComment: statusComment || null,
          lastSeen: Date.now()
        });

        socket.broadcast.emit('user_status_changed', {
          userId,
          status,
          statusComment: statusComment || null
        });

        logger.info('[update_status] Status updated', { userId, status });
      }

    } catch (error) {
      logger.error('[update_status] Error:', { error: error.message });
    }
  });

  socket.on('accept_party_invite', ({ invitationId }) => {
    try {
      const invitation = partyInvitations.get(invitationId);
      if (!invitation) {
        socket.emit('party_error', { error: 'Invitation not found or expired' });
        return;
      }

      if (Date.now() > invitation.expiresAt) {
        partyInvitations.delete(invitationId);
        socket.emit('party_error', { error: 'Invitation expired' });
        return;
      }

      const party = parties.get(invitation.partyId);
      if (!party) {
        socket.emit('party_error', { error: 'Party no longer exists' });
        return;
      }

      let userId = socket.data.userId;
      let userName = 'Unknown';

      const player = players.get(socket.id);
      const socialUser = onlineSocialUsers.get(socket.id);

      if (player) {
        userId = player.userId || userId || player.id;
        userName = player.name;
      } else if (socialUser) {
        userId = socialUser.userId;
        userName = socialUser.name;
      }

      if (!userId) return;

      const existingPartyId = userToParty.get(userId);
      if (existingPartyId && existingPartyId !== invitation.partyId) {
        logger.info('[accept_party_invite] Auto-leaving old party before joining new one', {
          userId,
          oldPartyId: existingPartyId,
          newPartyId: invitation.partyId
        });
        handlePartyLeave(userId, userName, socket.id);
      }

      const memberData = buildPartyMemberData(userId, { isGM: false });
      party.members[userId] = memberData;

      userToParty.set(userId, invitation.partyId);
      partyInvitations.delete(invitationId);

      socket.emit('party_updated', { party: normalizePartyForClient(party) });

      Object.keys(party.members).forEach(memberId => {
        if (memberId !== userId) {
          const memberSockets = getSocketsByUserId(memberId);
          memberSockets.forEach(s => s.emit('party_member_joined', {
            partyId: invitation.partyId,
            memberId: userId,
            memberData: memberData
          }));
        }
      });

      if (invitation.fromUserId && invitation.fromUserId !== userId) {
        const inviterSockets = getSocketsByUserId(invitation.fromUserId);
        inviterSockets.forEach(s => {
          s.emit('party_invite_accepted', {
            partyId: invitation.partyId,
            memberId: userId,
            memberName: userName,
            memberData: memberData
          });
          s.emit('party_invitation_accepted', {
            invitationId,
            userId,
            userName
          });
        });
      }

      socket.emit('party_join_confirmed', {
        partyId: invitation.partyId,
        partyName: party.name,
        memberCount: Object.keys(party.members).length
      });

      logger.info('[accept_party_invite] Player joined party', {
        playerId: userId,
        partyId: invitation.partyId
      });

    } catch (error) {
      logger.error('[accept_party_invite] Error:', { error: error.message });
    }
  });

  socket.on('decline_party_invite', ({ invitationId }) => {
    try {
      const invitation = partyInvitations.get(invitationId);
      if (!invitation) return;

      let declinerName = invitation.toUserId;
      const socialUser = onlineSocialUsers.get(socket.id);
      if (socialUser && socialUser.name) {
        declinerName = socialUser.name;
      }

      partyInvitations.delete(invitationId);

      const inviterSockets = getSocketsByUserId(invitation.fromUserId);
      inviterSockets.forEach(s => s.emit('party_invitation_declined', {
        invitationId,
        userId: invitation.toUserId,
        userName: declinerName
      }));

      socket.emit('invitation_declined_confirmed', { invitationId });

    } catch (error) {
      logger.error('[decline_party_invite] Error:', { error: error.message });
    }
  });

  socket.on('party_message', ({ partyId, message, messageId }) => {
    try {
      let userId = socket.data.userId;
      let userName = 'Unknown';

      const player = players.get(socket.id);
      const socialUser = onlineSocialUsers.get(socket.id);

      if (player) {
        userId = player.userId || userId || player.id;
        userName = player.name;
      } else if (socialUser) {
        userId = socialUser.userId;
        userName = socialUser.name;
      }

      if (!userId) return;

      const party = parties.get(partyId);
      if (!party) return;

      const isMember = !!party.members[userId];
      if (!isMember) {
        logger.warn(`[party_message] User ${userId} is not a member of party ${partyId}`);
        return;
      }

      const sanitizedMessage = sanitizeChatMessage(message);
      if (!sanitizedMessage) return;

      Object.keys(party.members).forEach(memberId => {
        const memberSockets = getSocketsByUserId(memberId);
        memberSockets.forEach(s => {
          s.emit('party_chat_message', {
            partyId,
            id: messageId || `party_${Date.now()}_${userId}`,
            fromId: userId,
            fromSocketId: socket.id,
            senderName: userName,
            message: sanitizedMessage,
            timestamp: Date.now()
          });
        });
      });

    } catch (error) {
      logger.error('[party_message] Error:', { error: error.message });
    }
  });

  socket.on('promote_to_leader', ({ partyId, newLeaderId }) => {
    try {
      let userId = socket.data.userId;

      const player = players.get(socket.id);
      const socialUser = onlineSocialUsers.get(socket.id);

      if (player) {
        userId = player.userId || userId || player.id;
      } else if (socialUser) {
        userId = socialUser.userId;
      }

      if (!userId) return;

      const party = parties.get(partyId);
      if (!party) return;

      if (party.leaderId !== userId) {
        socket.emit('party_error', { error: 'Only the leader can promote members' });
        return;
      }

      const newLeaderMember = party.members[newLeaderId];
      if (!newLeaderMember) {
        socket.emit('party_error', { error: 'Member not found' });
        return;
      }

      Object.keys(party.members).forEach(mId => {
        party.members[mId].isLeader = (mId === newLeaderId);
        party.members[mId].isGM = (mId === newLeaderId);
      });
      party.leaderId = newLeaderId;

      Object.keys(party.members).forEach(memberId => {
        const memberSockets = getSocketsByUserId(memberId);
        memberSockets.forEach(s => s.emit('party_leader_changed', {
          newLeaderId,
          newLeaderName: newLeaderMember.name
        }));
      });

      logger.info('[promote_to_leader] New party leader', { partyId, newLeaderId });

    } catch (error) {
      logger.error('[promote_to_leader] Error:', { error: error.message });
    }
  });

  socket.on('remove_party_member', ({ partyId, targetUserId }) => {
    try {
      let userId = socket.data.userId;

      const player = players.get(socket.id);
      const socialUser = onlineSocialUsers.get(socket.id);

      if (player) {
        userId = player.userId || userId || player.id;
      } else if (socialUser) {
        userId = socialUser.userId;
      }

      if (!userId) return;

      const party = parties.get(partyId);
      if (!party) return;

      if (party.leaderId !== userId) {
        socket.emit('party_error', { error: 'Only the leader can remove members' });
        return;
      }

      delete party.members[targetUserId];
      userToParty.delete(targetUserId);

      const removedSockets = getSocketsByUserId(targetUserId);
      removedSockets.forEach(s => s.emit('removed_from_party', { partyId }));

      Object.keys(party.members).forEach(memberId => {
        const memberSockets = getSocketsByUserId(memberId);
        memberSockets.forEach(s => s.emit('party_member_removed', {
          memberId: targetUserId
        }));
      });

      logger.info('[remove_party_member] Member removed from party', { partyId, targetUserId });

    } catch (error) {
      logger.error('[remove_party_member] Error:', { error: error.message });
    }
  });

  socket.on('disband_party', ({ partyId }) => {
    try {
      let userId = socket.data.userId;

      const player = players.get(socket.id);
      const socialUser = onlineSocialUsers.get(socket.id);

      if (player) {
        userId = player.userId || userId || player.id;
      } else if (socialUser) {
        userId = socialUser.userId;
      }

      if (!userId) return;

      const party = parties.get(partyId);
      if (!party) {
        socket.emit('party_disbanded', { partyId });
        logger.warn('[disband_party] Party not found, sent cleanup to client', { partyId, userId });
        return;
      }

      if (party.leaderId !== userId) {
        socket.emit('party_error', { error: 'Only the leader can disband the party' });
        return;
      }

      Object.keys(party.members).forEach(memberId => {
        userToParty.delete(memberId);
        const memberSockets = getSocketsByUserId(memberId);
        memberSockets.forEach(s => s.emit('party_disbanded', { partyId }));
      });

      parties.delete(partyId);

      socket.emit('party_left', { partyId });

      logger.info('[disband_party] Party disbanded', { partyId, leaderId: userId });

    } catch (error) {
      logger.error('[disband_party] Error:', { error: error.message });
    }
  });
}

module.exports = { registerPartyHandlers };
