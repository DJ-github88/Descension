export function registerPartyHandlers(ctx) {
  const {
    socket,
    setIsGM,
    currentPlayerRef,
    getActiveCharacter,
    addPartyMember
  } = ctx;
    if (!socket) return;

    // Listen for party member additions from other clients
    socket.on('party_member_added', (data) => {
      // Get current character name for comparison
      const activeCharacter = getActiveCharacter();
      const currentCharacterName = activeCharacter?.name || currentPlayerRef.current?.name;

      // Add the party member to our local party store
      // Skip if this is our own data being broadcast back to us (check both player name and character name)
      const isOwnMember = data.member && (
        data.member.name === currentPlayerRef.current?.name ||
        data.member.name === currentCharacterName ||
        data.member.id === currentPlayerRef.current?.id ||
        data.member.id === 'current-player'
      );

      if (data.member && !isOwnMember) {
        addPartyMember(data.member);
      }
    });

    // PARTY INVITATION RESPONSE HANDLERS (fallback for when invite sent via multiplayer socket)
    // These mirror the handlers in presenceStore.js for cross-socket compatibility
    socket.on('invitation_sent', ({ invitationId, toUserId }) => {
      console.log('ðŸ“¤ [MultiplayerApp] invitation_sent received:', { invitationId, toUserId });
      import('../../../store/presenceStore').then(({ default: usePresenceStore }) => {
        usePresenceStore.setState(state => {
          const updatedInvites = state.sentPartyInvites.map(inv => {
            const isRecent = Date.now() - inv.sentAt < 5000;
            if (inv.targetUserId === toUserId || (inv.invitationId === null && isRecent)) {
              return { ...inv, invitationId };
            }
            return inv;
          });
          return { sentPartyInvites: updatedInvites };
        });
      });
    });

    socket.on('party_invitation_accepted', ({ invitationId, userId, userName }) => {
      console.log('âœ… [MultiplayerApp] party_invitation_accepted:', userName);
      // NOTE: Only update sentPartyInvites list. Notifications handled by presenceStore party_invite_accepted
      import('../../../store/presenceStore').then(({ default: usePresenceStore }) => {
        const store = usePresenceStore.getState();
        const updatedInvites = store.sentPartyInvites.map(inv => {
          const matches = inv.invitationId === invitationId ||
            inv.targetUserId === userId ||
            inv.targetName === userName;
          return matches ? { ...inv, outcome: 'accepted' } : inv;
        });
        usePresenceStore.setState({
          sentPartyInvites: updatedInvites
          // REMOVED: Duplicate toast - handled by presenceStore party_invite_accepted
        });
      });
    });

    socket.on('party_invitation_declined', ({ invitationId, userId, userName }) => {
      console.log('âŒ [MultiplayerApp] party_invitation_declined:', userName);
      // NOTE: Only update sentPartyInvites list. Notifications handled by presenceStore
      import('../../../store/presenceStore').then(({ default: usePresenceStore }) => {
        const store = usePresenceStore.getState();
        const updatedInvites = store.sentPartyInvites.map(inv => {
          const matches = inv.invitationId === invitationId ||
            inv.targetUserId === userId ||
            inv.targetName === userName;
          return matches ? { ...inv, outcome: 'declined' } : inv;
        });
        usePresenceStore.setState({
          sentPartyInvites: updatedInvites
          // REMOVED: Duplicate toast - handled by presenceStore
        });
      });
    });

    // Handle party updates
    socket.on('party_update', (data) => {
      // Import party store dynamically to avoid circular dependencies
      import('../../../store/partyStore').then(({ default: usePartyStore }) => {
        const partyStore = usePartyStore.getState();

        // Only process updates from other players (not our own)
        if (data.playerId !== currentPlayerRef.current?.id) {
          switch (data.type) {
            case 'member_added':
              // Add the new party member
              if (data.data && data.data.id) {
                const memberData = {
                  ...data.data,
                  status: 'online' // Assume online since they're active
                };
                partyStore.addPartyMember(memberData);
              }
              break;

            case 'member_removed':
              // Remove the party member
              if (data.data && data.data.memberId) {
                partyStore.removePartyMember(data.data.memberId);
              }
              break;

            case 'member_updated':
              // Update party member data - Pass true to indicate this is from sync
              if (data.data && data.data.memberId && data.data.updates) {
                partyStore.updatePartyMember(data.data.memberId, data.data.updates, true);
              }
              break;

            case 'leadership_transferred':
              // Update leader status across all clients
              // The setLeader function now handles GM mode toggle internally
              if (data.data && data.data.leaderId) {
                let resolvedLeaderId = data.data.leaderId;

                // CRITICAL: Translate the leaderId to 'current-player' if it matches our socket/player ID
                // This is needed because on the GM's side, the player is identified by their socket ID,
                // but on the player's own side, they're identified as 'current-player'.
                const mySocketId = socket?.id;
                const myPlayerId = currentPlayerRef.current?.id;
                const amITheNewLeader = resolvedLeaderId === mySocketId || resolvedLeaderId === myPlayerId;

                if (amITheNewLeader) {
                  resolvedLeaderId = 'current-player';
                  console.log('ðŸ‘‘ I am now the leader! Translating leaderId to current-player');
                }

                console.log('ðŸ‘‘ Leadership transferred via socket:', data.data.leaderId, 'â†’', resolvedLeaderId);

                // CRITICAL FIX: Clear any active drag states or interaction flags when leadership changes
                // to prevent the new leader from having blocked interactions due to stale state.
                if (window.multiplayerDragState) {
                  console.log('ðŸ§¹ Clearing multiplayerDragState due to leadership transfer');
                  window.multiplayerDragState.clear();
                }

                window.tokenInteractionActive = false;
                window.tokenInteractionTimestamp = null;
                window._isDraggingToken = false;
                window._isDraggingCamera = false;

                // CRITICAL FIX: Update isGM local state immediately
                setIsGM(amITheNewLeader);

                // Pass true as second arg to indicate this is from sync (prevents re-broadcast)
                partyStore.setLeader(resolvedLeaderId, true);
              }
              break;
          }
        }
      });
    });

    return () => {
      socket.off('party_member_added');
      socket.off('invitation_sent');
      socket.off('party_invitation_accepted');
      socket.off('party_invitation_declined');
      socket.off('party_update');
    };
}
