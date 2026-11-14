/**
 * Party Handlers (Social Party System)
 *
 * Social party lifecycle (distinct from room party):
 * - create_party / join_party / leave_party / disband_party: lifecycle
 * - register_presence / update_status: social presence tracking
 * - accept_party_invite / decline_party_invite: invitation response
 * - party_message: party-scoped chat
 * - promote_to_leader / remove_party_member: member management
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
    buildPartyMemberData
  } = ctx;

  const normalizePartyForClient = (party) => {
    if (!party) {return null;}
    return {
      ...party,
      members: { ...(party.members || {}) }
    };
  };

  // Social-party admission is invite-only. A registered guest presence or a
  // player record is not a verified account: only the socket auth middleware's
  // authenticated identity may create, accept or hold a social membership.
  const resolveVerifiedPartyUserId = () => {
    if (!socket.data || socket.data.authenticated !== true) {return null;}
    const uid = socket.data.userId;
    return typeof uid === 'string' && uid.length > 0 ? uid : null;
  };

  const purgeMemberTargetInvitations = (partyId, userId) => {
    const purgedInvitationIds = [];
    for (const [invitationId, invitation] of partyInvitations.entries()) {
      if (invitation && invitation.kind === 'party' && invitation.partyId === partyId &&
        invitation.toUserId === userId) {
        partyInvitations.delete(invitationId);
        purgedInvitationIds.push(invitationId);
      }
    }
    return purgedInvitationIds;
  };

  const emitPartySnapshotToOtherUserSockets = (userId, party, exceptSocketId) => {
    getSocketsByUserId(userId).forEach(s => {
      if (s.id !== exceptSocketId) {
        s.emit('party_joined', { party: normalizePartyForClient(party) });
      }
    });
  };

  const hasPendingTargetInvitation = (partyId, userId) => {
    for (const invitation of partyInvitations.values()) {
      if (invitation && invitation.kind === 'party' && invitation.partyId === partyId &&
        invitation.toUserId === userId) {
        return true;
      }
    }
    return false;
  };

  // Explicit party switching is not a socket disconnect: remove the old
  // membership even when the user has another connected socket. The disconnect
  // path keeps its existing multi-tab guard in handlePartyLeave.
  const leavePartyForSwitch = (userId, userName, exceptSocketId = null) => {
    const partyId = userToParty.get(userId);
    if (!partyId) {return;}

    const party = parties.get(partyId);
    if (!party) {
      userToParty.delete(userId);
      return;
    }

    delete party.members[userId];
    userToParty.delete(userId);
    party.updatedAt = Date.now();

    // An explicit switch removes the membership for every socket of the
    // account. Other connected sockets receive the existing party_left event
    // so their local party UI is cleared; the acting socket receives the new
    // party state from create/accept below.
    getSocketsByUserId(userId).forEach(s => {
      if (s.id !== exceptSocketId) {
        s.emit('party_left', { partyId, updatedAt: party.updatedAt });
      }
    });

    const remainingMemberIds = Object.keys(party.members);
    if (remainingMemberIds.length === 0 || party.leaderId === userId) {
      remainingMemberIds.forEach(memberId => {
        userToParty.delete(memberId);
        getSocketsByUserId(memberId).forEach(s => s.emit('party_disbanded', {
          partyId,
          partyName: party.name,
          reason: 'leader_left',
          updatedAt: party.updatedAt
        }));
      });
      parties.delete(partyId);
      return;
    }

    remainingMemberIds.forEach(memberId => {
      getSocketsByUserId(memberId).forEach(s => s.emit('party_member_left', {
        partyId,
        memberId: userId,
        memberName: userName,
        updatedAt: party.updatedAt
      }));
    });
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

      // Creating a new party is an explicit switch. Remove any current
      // membership first so a direct create_party call cannot leave a ghost
      // membership in the previous party. The ordinary create UI is hidden
      // while isInParty, but some client local-start flows call createParty
      // after resetting only local state.
      if (userToParty.get(userId)) {
        logger.info('[create_party] Switching from existing party before create', { userId });
        leavePartyForSwitch(userId, userName, socket.id);
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
      emitPartySnapshotToOtherUserSockets(userId, party, socket.id);

      logger.info('[create_party] Party created', { partyId, leaderId: userId });

    } catch (error) {
      logger.error('[create_party] Error:', { error: error.message });
    }
  });

  socket.on('join_party', ({ partyId }) => {
    try {
      const userId = resolveVerifiedPartyUserId();
      if (!userId) {
        socket.emit('party_error', {
          error: 'A verified account is required to join a party',
          code: 'party_join_requires_verified_identity'
        });
        return;
      }

      const party = parties.get(partyId);

      // Existing membership survives reconnect and repeated join events.
      if (party && party.members[userId]) {
        socket.emit('party_joined', { party: normalizePartyForClient(party) });
        return;
      }

      // A party id only identifies the intended party. It is not an admission
      // credential: a non-member needs a recipient-bound invitation accepted
      // through accept_party_invite. The same refusal is returned for an unknown
      // id so an unauthorized caller cannot use this route to confirm that a
      // party exists.
      socket.emit('party_error', {
        error: 'An invitation is required to join this party',
        code: 'party_join_requires_invitation'
      });

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
      // Identity comes only from the verified socket auth. Never trust the
      // client-supplied userId (that allowed impersonating other users).
      let userId = socket.data.userId;
      let name = data.name || 'Unknown';

      const player = players.get(socket.id);
      if (player) {
        userId = player.userId || userId || player.id;
        name = player.name;
      }

      if (!userId) {
        if (socket.data.isGuest) {
          userId = 'guest-' + socket.id;
        } else {
          logger.warn('[register_presence] No verified userId available', { socketId: socket.id });
          return;
        }
      }

      socket.data.userId = userId;
      socket.data.userName = name;

      onlineSocialUsers.set(socket.id, {
        userId,
        socketId: socket.id,
        originalUserId: null,
        name,
        characterClass: data.characterClass,
        characterLevel: data.characterLevel,
        status: 'online',
        lastSeen: Date.now()
      });

      // Authoritative social-party state follows registration. This restores
      // current membership after reconnect and clears a stale local party
      // when the account no longer has a server membership. It grants no
      // admission: the snapshot is the account's own current state.
      const currentPartyId = userToParty.get(userId);
      const currentParty = currentPartyId ? parties.get(currentPartyId) : null;
      if (currentParty) {
        socket.emit('party_joined', { party: normalizePartyForClient(currentParty) });
      } else {
        socket.emit('party_left', { partyId: null, reason: 'reconnect_sync' });
      }

      socket.emit('presence_registered', { success: true });

    } catch (error) {
      logger.error('[register_presence] Error:', { error: error.message });
    }
  });

  socket.on('update_status', (data) => {
    try {
      const { status, statusComment } = data;

      const validStatuses = ['online', 'away', 'busy', 'offline'];
      if (!validStatuses.includes(status)) {
        logger.warn('[update_status] Invalid status:', { status });
        return;
      }

      // A socket may only change its OWN presence; the client-supplied userId
      // is ignored so users cannot forge another user's status.
      const userData = onlineSocialUsers.get(socket.id);
      if (!userData) {
        logger.warn('[update_status] No presence registered for socket', { socketId: socket.id });
        return;
      }

      const userId = userData.userId;
      onlineSocialUsers.set(socket.id, {
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

    } catch (error) {
      logger.error('[update_status] Error:', { error: error.message });
    }
  });

  socket.on('accept_party_invite', ({ invitationId }) => {
    try {
      const invitation = partyInvitations.get(invitationId);
      // Domain isolation: this social event may only operate on social party
      // invitations, never on recipient-bound room invitations.
      if (!invitation || invitation.kind !== 'party') {
        socket.emit('party_error', { error: 'Invitation not found or expired' });
        return;
      }
      const acceptingUid = resolveVerifiedPartyUserId();
      if (!acceptingUid) {
        socket.emit('party_error', {
          error: 'A verified account is required to accept a party invitation',
          code: 'party_join_requires_verified_identity'
        });
        return;
      }
      if (invitation.toUserId !== acceptingUid) {
        socket.emit('party_error', {
          error: 'Not authorized for this invitation',
          code: 'party_invitation_recipient_mismatch'
        });
        return;
      }

      if (Date.now() > invitation.expiresAt) {
        partyInvitations.delete(invitationId);
        socket.emit('party_error', { error: 'Invitation expired', code: 'party_invitation_expired' });
        return;
      }

      const party = parties.get(invitation.partyId);
      if (!party) {
        socket.emit('party_error', { error: 'Party no longer exists', code: 'party_not_found' });
        return;
      }

      // Acceptance revalidates invitation authority. An invitation issued by a
      // member who has since left or been removed is no longer admission.
      if (!invitation.fromUserId || !party.members[invitation.fromUserId]) {
        partyInvitations.delete(invitationId);
        socket.emit('party_error', {
          error: 'Invitation is no longer valid',
          code: 'party_invitation_invalid'
        });
        return;
      }

      const userId = acceptingUid;
      let userName = 'Unknown';

      const player = players.get(socket.id);
      const socialUser = onlineSocialUsers.get(socket.id);

      if (player) {
        userName = player.name;
      } else if (socialUser) {
        userName = socialUser.name;
      }

      if (party.members[userId]) {
        // Duplicate invitation: consume it but keep exactly one membership.
        partyInvitations.delete(invitationId);
        userToParty.set(userId, invitation.partyId);
        party.updatedAt = Date.now();
        socket.emit('party_updated', { party: normalizePartyForClient(party) });
        emitPartySnapshotToOtherUserSockets(userId, party, socket.id);
        socket.emit('party_join_confirmed', {
          partyId: invitation.partyId,
          partyName: party.name,
          memberCount: Object.keys(party.members).length
        });
        return;
      }

      const existingPartyId = userToParty.get(userId);
      if (existingPartyId && existingPartyId !== invitation.partyId) {
        logger.info('[accept_party_invite] Auto-leaving old party before joining new one', {
          userId,
          oldPartyId: existingPartyId,
          newPartyId: invitation.partyId
        });
        // This is an explicit switch, not a socket disconnect. Remove the old
        // membership even if another socket for this user is still connected.
        leavePartyForSwitch(userId, userName, socket.id);
      }

      const memberData = buildPartyMemberData(userId, { isGM: false });
      party.members[userId] = memberData;

      userToParty.set(userId, invitation.partyId);
      partyInvitations.delete(invitationId);
      party.updatedAt = Date.now();

      socket.emit('party_updated', { party: normalizePartyForClient(party) });
      emitPartySnapshotToOtherUserSockets(userId, party, socket.id);

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
      if (!invitation || invitation.kind !== 'party') {return;}
      const decliningUid = socket.data.userId
        || (players.get(socket.id) && players.get(socket.id).userId)
        || (onlineSocialUsers.get(socket.id) && onlineSocialUsers.get(socket.id).userId)
        || null;
      if (!decliningUid || invitation.toUserId !== decliningUid) {return;}

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

      if (!userId) {return;}

      const party = parties.get(partyId);
      if (!party) {return;}

      const isMember = !!party.members[userId];
      if (!isMember) {
        logger.warn(`[party_message] User ${userId} is not a member of party ${partyId}`);
        return;
      }

      const sanitizedMessage = sanitizeChatMessage(message);
      if (!sanitizedMessage) {return;}

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

      if (!userId) {return;}

      const party = parties.get(partyId);
      if (!party) {return;}

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
      party.updatedAt = Date.now();

      Object.keys(party.members).forEach(memberId => {
        const memberSockets = getSocketsByUserId(memberId);
        memberSockets.forEach(s => s.emit('party_leader_changed', {
          partyId,
          newLeaderId,
          newLeaderName: newLeaderMember.name,
          updatedAt: party.updatedAt
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

      if (!userId) {return;}

      const party = parties.get(partyId);
      if (!party) {return;}

      if (party.leaderId !== userId) {
        socket.emit('party_error', { error: 'Only the leader can remove members' });
        return;
      }

      const targetIsMember = !!party.members[targetUserId];
      const targetCurrentPartyId = userToParty.get(targetUserId);
      const targetHasPendingInvitation = hasPendingTargetInvitation(partyId, targetUserId);

      // A leader may remove a current member or revoke a pending invitation to
      // this party. They must not mutate another party's membership or mapping.
      if (!targetIsMember && !targetHasPendingInvitation) {
        socket.emit('party_error', {
          error: 'Member not found in this party',
          code: 'party_member_not_found'
        });
        return;
      }

      if (targetIsMember) {
        delete party.members[targetUserId];
        if (targetCurrentPartyId === partyId) {
          userToParty.delete(targetUserId);
        }
        party.updatedAt = Date.now();

        // Removal invalidates outstanding admission authority for this
        // membership: pending invitations addressed to the removed member
        // cannot be replayed to restore it. Invitations issued by the removed
        // member remain in the map but fail acceptance-time inviter
        // revalidation.
        const purgedInvitationIds = purgeMemberTargetInvitations(partyId, targetUserId);

        const removedSockets = getSocketsByUserId(targetUserId);
        if (!targetCurrentPartyId || targetCurrentPartyId === partyId) {
          removedSockets.forEach(s => s.emit('removed_from_party', {
            partyId,
            invitationIds: purgedInvitationIds,
            updatedAt: party.updatedAt
          }));
        }

        Object.keys(party.members).forEach(memberId => {
          const memberSockets = getSocketsByUserId(memberId);
          memberSockets.forEach(s => s.emit('party_member_removed', {
            partyId,
            memberId: targetUserId,
            updatedAt: party.updatedAt
          }));
        });

        logger.info('[remove_party_member] Member removed from party', {
          partyId,
          targetUserId,
          purgedInvitationCount: purgedInvitationIds.length
        });
        return;
      }

      // A pending-invitation-only revocation is not a membership removal.
      // Always use the invitation event so no client can display a false
      // "removed from party" notice, regardless of the target's party state.
      const purgedInvitationIds = purgeMemberTargetInvitations(partyId, targetUserId);
      getSocketsByUserId(targetUserId).forEach(s => s.emit('party_invitation_revoked', {
        partyId,
        invitationType: 'party',
        invitationIds: purgedInvitationIds,
        updatedAt: party.updatedAt
      }));
      logger.info('[remove_party_member] Pending party invitation revoked', {
        partyId,
        targetUserId,
        purgedInvitationCount: purgedInvitationIds.length
      });

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

      if (!userId) {return;}

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

      party.updatedAt = Date.now();
      Object.keys(party.members).forEach(memberId => {
        userToParty.delete(memberId);
        const memberSockets = getSocketsByUserId(memberId);
        memberSockets.forEach(s => s.emit('party_disbanded', {
          partyId,
          updatedAt: party.updatedAt
        }));
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
