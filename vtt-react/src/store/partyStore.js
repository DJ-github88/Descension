/**
 * Party Store
 * 
 * Manages party state including:
 * - Current party information
 * - Party members list
 * - Pending party invitations
 * - Party chat messages
 * - Party settings
 * - Integration with presence system for party HUD
 */

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import usePresenceStore from './presenceStore';

const getSocket = () => {
  const presenceState = usePresenceStore.getState();
  return presenceState?.socket;
};

// Party member status types
export const PARTY_STATUS = {
  ONLINE: 'online',
  AWAY: 'away',
  BUSY: 'busy',
  OFFLINE: 'offline'
};

const getSelfIdentifiers = () => {
  const ids = new Set(['current-player']);

  // Get from gameStore if available
  try {
    const gameStore = require('./gameStore').default.getState();
    if (gameStore?.currentPlayer?.id) ids.add(gameStore.currentPlayer.id);
    if (gameStore?.multiplayerSocket?.id) ids.add(gameStore.multiplayerSocket.id);
  } catch (e) {
    // gameStore might not be initialized or have circular dependency issues
  }

  // Get from presenceStore if available
  try {
    const presenceStore = require('./presenceStore').default.getState();
    if (presenceStore?.currentUserPresence?.userId) ids.add(presenceStore.currentUserPresence.userId);
  } catch (e) {
    // presenceStore might not be initialized
  }

  // Get from authStore if available
  try {
    const authStore = require('./authStore').default.getState();
    if (authStore?.user?.uid) ids.add(authStore.user.uid);
  } catch (e) {
    // authStore might not be initialized
  }

  // Get from sessionStorage as a last resort for cross-tab stability
  try {
    const storedUid = sessionStorage.getItem('firebaseUserId');
    if (storedUid) ids.add(storedUid);
  } catch (e) { }

  return ids;
};

const isSelfMemberId = (memberId, userId) => {
  const selfIds = getSelfIdentifiers();
  return selfIds.has(memberId) || (userId && selfIds.has(userId));
};

const ensureSelfMember = (members) => {
  const membersArray = members || [];

  // If there are already members being added, check if WE are one of them
  const selfIds = getSelfIdentifiers();
  const hasSelf = membersArray.some(member =>
    selfIds.has(member.id) || selfIds.has(member.userId) || selfIds.has(member.uid) || selfIds.has(member.socketId)
  );

  // If we already have a representation in the members list, don't inject a fallback
  if (hasSelf) {
    return membersArray;
  }

  // Only inject fallback when no members exist OR no self representation exists
  // Primary target for selfId is the Firebase UID if available
  let selfId = null;
  let selfName = 'Current Player';
  let selfClass = 'Unknown';
  let selfLevel = 1;
  let isGM = false;

  // Try authStore first for most stable identity
  try {
    const authStore = require('./authStore').default.getState();
    if (authStore?.user?.uid) {
      selfId = authStore.user.uid;
    }
  } catch (e) { }

  // Try presenceStore
  try {
    const presenceStore = require('./presenceStore').default.getState();
    const presence = presenceStore.currentUserPresence;
    if (presence?.userId) {
      selfId = selfId || presence.userId;
      selfName = presence.characterName || presence.accountName || selfName;
      selfClass = presence.class || selfClass;
      selfLevel = presence.level || selfLevel;
    }
  } catch (e) { }

  // Fallback to gameStore
  if (!selfId || selfName === 'Current Player') {
    try {
      const gameStore = require('./gameStore').default.getState();
      selfId = selfId || gameStore?.currentPlayer?.id || gameStore?.multiplayerSocket?.id;
      if (selfId && selfName === 'Current Player') {
        selfName = gameStore?.currentPlayer?.name || selfName;
      }
      isGM = gameStore?.isGMMode || false;
    } catch (e) { }
  }

  // Still no identity — don't add phantom member
  if (!selfId) return membersArray;

  // Try to get actual character data from characterStore instead of using defaults
  let healthData = { current: 45, max: 50 };
  let manaData = { current: 45, max: 50 };
  let apData = { current: 1, max: 3 };

  try {
    const characterStore = require('./characterStore').default.getState();
    if (characterStore?.health?.max > 0) {
      healthData = { current: characterStore.health.current || 0, max: characterStore.health.max };
    }
    if (characterStore?.mana?.max > 0) {
      manaData = { current: characterStore.mana.current || 0, max: characterStore.mana.max };
    }
    if (characterStore?.actionPoints?.max > 0) {
      apData = { current: characterStore.actionPoints.current || 0, max: characterStore.actionPoints.max };
    }
    // Also get class/level from characterStore if available
    if (characterStore?.class) selfClass = characterStore.class;
    if (characterStore?.level) selfLevel = characterStore.level;
    if (characterStore?.name && characterStore.name !== 'Character Name') {
      selfName = characterStore.name;
    }
    // Update selfId to UID if available from store logic
    const userId = characterStore.userId || characterStore.uid;
    if (userId) selfId = userId;
  } catch (e) { }

  return [
    ...membersArray,
    {
      id: selfId,
      userId: selfId, // Ensure both are identical for the self fallback
      name: selfName,
      isGM: isGM,
      isConnected: true, // Self is always connected
      status: PARTY_STATUS.ONLINE,
      joinedAt: Date.now(),
      characterClass: selfClass,
      characterLevel: selfLevel,
      character: {
        class: selfClass,
        level: selfLevel,
        health: healthData,
        mana: manaData,
        actionPoints: apData
      }
    }
  ];
};

// Initial state
const initialState = {
  // Current party information
  currentParty: null,
  isInParty: false,

  // Party members data
  partyMembers: [],
  partyChatMessages: [],

  // Pending invitations
  pendingPartyInvites: [], // Invitations I've received
  sentPartyInvites: [], // Invitations I've sent

  // Party settings
  partySettings: {
    maxMembers: 6
  },

  // HUD and UI state
  memberPositions: {}, // memberId -> { x, y }

  // Map assignments: playerId -> mapId
  playerMapAssignments: {},

  // Leader and GM mode
  leaderId: null,
  leaderMode: false,

  // Creation lock
  isCreatingParty: false,
  partyCreationPromise: null
};

// Create the store
const usePartyStore = create((set, get) => ({
  ...initialState,

  // ==================== PARTY MANAGEMENT ====================

  /**
   * Reset the store to initial state
   */
  resetStore: () => {
    set(initialState);
  },

  /**
   * Create a new party with user as leader
   * Returns a Promise that resolves when the party is created
   */
  createParty: (partyName = 'New Party', isGM = false, leaderData = null) => {
    const { isCreatingParty, partyCreationPromise } = get();

    // Return existing promise if already creating
    if (isCreatingParty && partyCreationPromise) {
      console.log('⚠️ Party creation already in progress, returning existing promise');
      return partyCreationPromise;
    }

    const creationPromise = new Promise((resolve, reject) => {
      set({ isCreatingParty: true });

      const socket = getSocket();

      const actualLeaderData = {
        id: leaderData?.id || 'current-player',
        userId: leaderData?.userId || (leaderData?.id || 'current-player'),
        isConnected: true,
        isGM,
        name: leaderData?.name || (isGM ? 'Game Master' : 'Party Leader'),
        characterName: leaderData?.characterName || (isGM ? 'Game Master' : 'Party Leader'),
        characterClass: leaderData?.characterClass || 'Unknown',
        characterLevel: leaderData?.characterLevel || 1,
        ...leaderData // Spread rest of data if available
      };

      // Check if socket is available AND connected
      const isSocketConnected = socket && socket.connected;

      if (!isSocketConnected) {
        // ALLOW LOCAL PARTY CREATION WITHOUT SOCKET
        // This is critical for single-player/local-room modes or when server is unavailable
        // Also allow when user explicitly wants a local party or socket is unreachable
        console.log('📱 Creating local party (no socket connection available)');

        const localParty = {
          id: 'local-party-' + Date.now(),
          name: partyName,
          members: {
            'current-player': actualLeaderData
          },
          isLocal: true // Mark as local-only party
        };

        set({
          currentParty: localParty,
          isInParty: true,
          partyMembers: [actualLeaderData],
          partyChatMessages: [],
          isCreatingParty: false,
          partyCreationPromise: null
        });

        console.log('✅ Local party created successfully:', partyName);
        resolve(localParty);
        return;
      }

      console.log('🎉 Creating party:', { partyName, leaderData: actualLeaderData });

      // Set up one-time listener for party_created response
      const onPartyCreated = (payload) => {
        socket.off('party_created', onPartyCreated);
        socket.off('party_error', onPartyError);

        const partyData = payload.party || payload;

        // MERGE members instead of replacing the whole array
        // This prevents losing local character data or "current-player" entry
        set(state => {
          let membersArray = [];

          if (Array.isArray(partyData.members)) {
            membersArray = partyData.members;
          } else if (partyData.members) {
            membersArray = Object.values(partyData.members);
          }

          let updatedMembers = [...state.partyMembers];

          membersArray.forEach(newMember => {
            const selfIds = getSelfIdentifiers();
            const isNewMemberSelf = selfIds.has(newMember.id) || (newMember.userId && selfIds.has(newMember.userId));

            const existingIndex = updatedMembers.findIndex(m => {
              if (isNewMemberSelf) {
                return selfIds.has(m.id) || (m.userId && selfIds.has(m.userId)) || m.id === 'current-player';
              }
              return m.id === newMember.id || m.userId === newMember.id || m.id === newMember.userId || (m.userId && m.userId === newMember.userId);
            });

            if (existingIndex >= 0) {
              updatedMembers[existingIndex] = { ...updatedMembers[existingIndex], ...newMember };
            } else {
              updatedMembers.push(newMember);
            }
          });

          return {
            currentParty: partyData,
            isInParty: true,
            partyMembers: updatedMembers,
            partyChatMessages: [],
            leaderId: partyData.leaderId || null,
            isCreatingParty: false,
            partyCreationPromise: null
          };
        });

        resolve(partyData);
      };

      const onPartyError = (error) => {
        socket.off('party_created', onPartyCreated);
        socket.off('party_error', onPartyError);

        // If error is "already in party", check if we have the party data and resolve
        if (error.error === 'You are already in a party' && error.party) {
          // MERGE members even on error case
          set(state => {
            let membersArray = [];
            if (Array.isArray(error.party.members)) {
              membersArray = error.party.members;
            } else if (error.party.members) {
              membersArray = Object.values(error.party.members);
            }
            let updatedMembers = [...state.partyMembers];

            membersArray.forEach(newMember => {
              const selfIds = getSelfIdentifiers();
              const isNewMemberSelf = selfIds.has(newMember.id) || (newMember.userId && selfIds.has(newMember.userId));

              const existingIndex = updatedMembers.findIndex(m => {
                if (isNewMemberSelf) {
                  return selfIds.has(m.id) || (m.userId && selfIds.has(m.userId)) || m.id === 'current-player';
                }
                return m.id === newMember.id || m.userId === newMember.id || m.id === newMember.userId || (m.userId && m.userId === newMember.userId);
              });

              if (existingIndex >= 0) {
                updatedMembers[existingIndex] = { ...updatedMembers[existingIndex], ...newMember };
              } else {
                updatedMembers.push(newMember);
              }
            });

            return {
              currentParty: error.party,
              isInParty: true,
              partyMembers: updatedMembers,
              partyChatMessages: [],
              leaderId: error.party.leaderId || null,
              isCreatingParty: false,
              partyCreationPromise: null
            };
          });
          resolve(error.party);
        } else {
          set({ isCreatingParty: false, partyCreationPromise: null });
          reject(new Error(error.error || 'Failed to create party'));
        }
      };

      socket.once('party_created', onPartyCreated);
      socket.once('party_error', onPartyError);

      // Set a timeout in case server doesn't respond
      setTimeout(() => {
        // Check if still creating before rejecting (to avoid race with success)
        const currentState = get();
        if (currentState.isCreatingParty && currentState.partyCreationPromise === creationPromise) {
          socket.off('party_created', onPartyCreated);
          socket.off('party_error', onPartyError);
          set({ isCreatingParty: false, partyCreationPromise: null });
          reject(new Error('Party creation timeout'));
        }
      }, 10000);

      socket.emit('create_party', {
        partyName,
        leaderData: actualLeaderData
      });
    });

    set({ isCreatingParty: true, partyCreationPromise: creationPromise });
    return creationPromise;
  },

  /**
   * Join an existing party
   */
  joinParty: (partyId) => {
    const socket = getSocket();

    if (!socket) {
      console.error('❌ Cannot join party: No socket connection');
      return;
    }

    console.log('📩 Joining party:', partyId);
    socket.emit('join_party', { partyId });
  },

  /**
   * Leave the current party
   */
  leaveParty: () => {
    const socket = getSocket();
    const { currentParty } = get();

    if (!socket) {
      console.error('❌ Cannot leave party: No socket connection');
      return;
    }

    if (!currentParty) {
      console.error('❌ Cannot leave party: Not in a party');
      return;
    }

    console.log('👤 Leaving party:', currentParty.id);
    socket.emit('leave_party');
  },

  /**
   * Invite another user to the party
   */
  inviteToParty: (targetUserId) => {
    const socket = getSocket();
    const { currentParty } = get();

    if (!socket) {
      console.error('❌ Cannot invite to party: No socket connection');
      return;
    }

    if (!currentParty) {
      console.error('❌ Cannot invite to party: Not in a party');
      return;
    }

    console.log('📩 Sending party invitation to:', targetUserId);
    const fromUserId = usePresenceStore.getState().currentUserPresence?.userId;
    socket.emit('invite_to_party', {
      partyId: currentParty.id,
      fromUserId,
      toUserId: targetUserId
    });
  },

  // ==================== INVITATION HANDLING ====================

  /**
   * Accept a party invitation
   */
  acceptPartyInvitation: (invitationId) => {
    const socket = getSocket();

    if (!socket) {
      console.error('❌ Cannot accept party invitation: No socket connection');
      return;
    }

    console.log('✅ Accepting party invitation:', invitationId);
    socket.emit('accept_party_invite', { invitationId });

    // Remove from pending
    set(state => ({
      pendingPartyInvites: state.pendingPartyInvites.filter(inv => inv.id !== invitationId)
    }));
  },

  /**
   * Decline a party invitation
   */
  declinePartyInvitation: (invitationId) => {
    const socket = getSocket();

    if (!socket) {
      console.error('❌ Cannot decline party invitation: No socket connection');
      return;
    }

    console.log('❌ Declining party invitation:', invitationId);
    socket.emit('decline_party_invite', { invitationId });

    // Remove from pending
    set(state => ({
      pendingPartyInvites: state.pendingPartyInvites.filter(inv => inv.id !== invitationId)
    }));
  },

  // ==================== PARTY CHAT ====================

  /**
   * Send a message to party chat
   */
  sendPartyMessage: (message) => {
    const socket = getSocket();
    const { currentParty } = get();

    if (!socket) {
      console.error('❌ Cannot send party message: No socket connection');
      return;
    }

    if (!currentParty) {
      console.error('❌ Cannot send party message: Not in a party');
      return;
    }

    console.log('💬 Sending party message:', message.substring(0, 50) + '...');
    socket.emit('party_message', {
      partyId: currentParty.id,
      message
    });
  },

  // ==================== GM SESSION ====================

  /**
   * Accept a GM session invitation (when GM with party joins a room)
   */
  acceptGMSessionInvitation: (invitationId, roomId) => {
    const socket = getSocket();

    if (!socket) {
      console.error('❌ Cannot accept GM session: No socket connection');
      return;
    }

    console.log('✅ Accepting GM session invitation:', { invitationId, roomId });
    socket.emit('respond_to_room_invitation', {
      invitationId,
      roomId,
      accepted: true
    });
  },

  /**
   * Decline a GM session invitation
   */
  declineGMSessionInvitation: (invitationId, roomId) => {
    const socket = getSocket();

    if (!socket) {
      console.error('❌ Cannot decline GM session: No socket connection');
      return;
    }

    console.log('❌ Declining GM session invitation:', { invitationId, roomId });
    socket.emit('respond_to_room_invitation', {
      invitationId,
      roomId,
      accepted: false
    });
  },

  // ==================== PARTY MEMBER MANAGEMENT ====================

  /**
   * Add a member to the party
   * Deduplicates by multiple fields (id, userId, name, socketId) to prevent duplicates
   * from different sources (social party vs multiplayer room)
   */
  addPartyMember: (memberData) => {
    set(state => {
      // Enhanced deduplication: check multiple fields
      const selfIds = getSelfIdentifiers();
      const isMemberNewSelf = selfIds.has(memberData.id) ||
        (memberData.userId && selfIds.has(memberData.userId)) ||
        (memberData.uid && selfIds.has(memberData.uid)) ||
        (memberData.socketId && selfIds.has(memberData.socketId));

      // CRITICAL FIX: If adding a GM and we are already GM in the party, don't add duplicate
      // This prevents GM from seeing their own HUD twice when creating a room
      if (memberData.isGM && !isMemberNewSelf) {
        const existingGM = state.partyMembers.find(m => m.isGM);
        if (existingGM) {
          // Check if the existing GM is actually us (current player)
          const isExistingGMSelf = selfIds.has(existingGM.id) ||
            (existingGM.userId && selfIds.has(existingGM.userId)) ||
            (existingGM.socketId && selfIds.has(existingGM.socketId));

          if (isExistingGMSelf) {
            console.log(`🚫 Skipping GM member add - current player is already GM: ${memberData.name || memberData.id}`);
            return state;
          }
        }
      }

      const existingIndex = state.partyMembers.findIndex(m => {
        // If we are adding ourselves, match any existing entry that is also self
        if (isMemberNewSelf) {
          const isExistingSelf = selfIds.has(m.id) ||
            (m.userId && selfIds.has(m.userId)) ||
            (m.uid && selfIds.has(m.uid)) ||
            (m.socketId && selfIds.has(m.socketId)) ||
            m.id === 'current-player';
          if (isExistingSelf) return true;
        }

        // Check by multiple ID forms
        const mIds = [m.id, m.userId, m.uid, m.socketId].filter(Boolean);
        const newDataIds = [memberData.id, memberData.userId, memberData.uid, memberData.socketId].filter(Boolean);

        // If any IDs match, it's the same person
        if (mIds.some(id => newDataIds.includes(id))) return true;

        // Check by name AND isGM (GM is usually unique in a room)
        if (m.isGM && memberData.isGM) return true;

        // Check by name (only if both have names and same class to avoid false positives)
        // This is a last resort fallback for cases where IDs might be missing (historical data)
        if (m.name && memberData.name && m.name === memberData.name) {
          const sameClass = m.character?.class === memberData.character?.class;
          const sameLevel = m.character?.level === memberData.character?.level;
          if (sameClass && sameLevel) return true;
        }
        return false;
      });

      if (existingIndex >= 0) {
        const updated = [...state.partyMembers];
        // Merge data, preferring new data but preserving any missing fields
        updated[existingIndex] = { ...updated[existingIndex], ...memberData };
        console.log(`🔄 Updated existing party member: ${memberData.name || memberData.id}`);
        return { partyMembers: updated };
      }

      console.log(`➕ Adding new party member: ${memberData.name || memberData.id}`);
      const newMembersList = [...state.partyMembers, memberData];
      return { partyMembers: newMembersList };
    });
  },

  /**
   * Remove a member from the party (local state update)
   */
  removePartyMember: (memberId) => {
    set(state => ({
      partyMembers: state.partyMembers.filter(m => !isSelfMemberId(m.id) && m.id !== memberId)
    }));
  },

  /**
   * Promote a member to leader
   */
  promotePartyMember: (memberId) => {
    const socket = getSocket();
    const { currentParty } = get();

    if (!socket || !currentParty) return;

    console.log('👑 Promoting member to leader:', memberId);
    socket.emit('promote_to_leader', {
      partyId: currentParty.id,
      newLeaderId: memberId
    });
  },

  /**
   * Kick a member from the party
   */
  kickPartyMember: (memberId) => {
    const socket = getSocket();
    const { currentParty } = get();

    if (!socket || !currentParty) return;

    console.log('🗑️ Kicking member from party:', memberId);
    socket.emit('remove_party_member', {
      partyId: currentParty.id,
      targetUserId: memberId
    });
  },

  /**
   * Disband the entire party
   */
  disbandParty: () => {
    const socket = getSocket();
    const { currentParty } = get();

    if (!socket || !currentParty) {
      console.warn('⚠️ Cannot disband: No socket or no party');
      return;
    }

    console.log('💥 Disbanding party:', currentParty.id);
    socket.emit('disband_party', {
      partyId: currentParty.id
    });
  },

  /**
   * Update a specific party member's data
   * CRITICAL FIX: Deep merge character object to preserve nested resources (health, mana, actionPoints)
   * CRITICAL FIX: Match by multiple ID types (id, userId, socketId) for reliable updates
   */
  updatePartyMember: (memberId, updates, silent = false) => {
    const isTargetSelf = isSelfMemberId(memberId, updates?.userId);
    
    // Debug logging for classResource updates
    if (updates?.character?.classResource) {
      console.log('🔄 partyStore.updatePartyMember - classResource update:', {
        memberId,
        isTargetSelf,
        classResource: updates.character.classResource
      });
    }

    set(state => ({
      partyMembers: state.partyMembers.map(m => {
        const isMemberSelf = isSelfMemberId(m.id, m.userId);
        // CRITICAL FIX: Match by multiple ID types for reliable identification
        const matchesById =
          m.id === memberId ||
          m.userId === memberId ||
          m.socketId === memberId ||
          (updates?.userId && (m.id === updates.userId || m.userId === updates.userId || m.socketId === updates.userId)) ||
          (updates?.socketId && (m.id === updates.socketId || m.userId === updates.socketId || m.socketId === updates.socketId));

        if ((isTargetSelf && isMemberSelf) || matchesById) {
          // Debug logging when match found
          if (updates?.character?.classResource) {
            console.log('✅ partyStore.updatePartyMember - Match found, updating:', {
              memberId: m.id,
              memberName: m.name,
              oldClassResource: m.character?.classResource,
              newClassResource: updates.character.classResource
            });
          }
          
          // Deep merge character object if present in updates
          if (updates.character && m.character) {
            const mergedCharacter = {
              ...m.character,
              ...updates.character,
              // Deep merge nested resources to prevent data loss
              ...(updates.character.health ? { health: { ...m.character.health, ...updates.character.health } } : {}),
              ...(updates.character.mana ? { mana: { ...m.character.mana, ...updates.character.mana } } : {}),
              ...(updates.character.actionPoints ? { actionPoints: { ...m.character.actionPoints, ...updates.character.actionPoints } } : {}),
              // Preserve classResource if not explicitly updated
              ...(m.character.classResource && !updates.character.classResource ? { classResource: m.character.classResource } : {}),
              // CRITICAL FIX: Replace classResource entirely when provided (not deep merge)
              // Deep merge was causing ghost properties from old class to persist when class changes
              // e.g., Berserker's rageStates persisting when changing to Chronarch
              ...(updates.character.classResource ? { classResource: updates.character.classResource } : {}),
              // CRITICAL FIX: Preserve display names if not explicitly in update
              race: updates.character.race ?? m.character.race,
              raceDisplayName: updates.character.raceDisplayName ?? m.character.raceDisplayName,
              class: updates.character.class ?? m.character.class,
              background: updates.character.background ?? m.character.background,
              backgroundDisplayName: updates.character.backgroundDisplayName ?? m.character.backgroundDisplayName,
              path: updates.character.path ?? m.character.path,
              pathDisplayName: updates.character.pathDisplayName ?? m.character.pathDisplayName,
              lore: updates.character.lore ?? m.character.lore,
              tokenSettings: updates.character.tokenSettings ?? m.character.tokenSettings
            };

            return { ...m, ...updates, character: mergedCharacter };
          }
          return { ...m, ...updates };
        }
        return m;
      })
    }));
  },

  /**
   * Set the party leader
   * @param {string} leaderId - ID of the leader (or 'current-player' for self)
   * @param {boolean} silent - If true, prevents re-broadcasting (legacy flag support)
   */
  setLeader: (leaderId, silent = false) => {
    const isSelf = leaderId === 'current-player' || isSelfMemberId(leaderId);
    set({
      leaderId,
      leaderMode: isSelf
    });
  },

  /**
   * Check if current user is the party leader
   * Uses the same self-identification logic as isSelfMemberId for consistency
   * @returns {boolean} true if current user is the party leader
   */
  isPartyLeader: () => {
    const { leaderId } = get();
    if (!leaderId) return false;
    const selfIds = getSelfIdentifiers();
    return selfIds.has(leaderId);
  },

  /**
   * Check if a specific user ID is the party leader
   * @param {string} userId - The user ID to check
   * @returns {boolean} true if the given userId is the party leader
   */
  isUserLeader: (userId) => {
    const { leaderId } = get();
    if (!leaderId || !userId) return false;
    return leaderId === userId;
  },

  /**
   * Update map assignment for a player
   */
  setPlayerMapAssignment: (playerId, mapId) => {
    if (!playerId) return;
    set(state => ({
      playerMapAssignments: {
        ...state.playerMapAssignments,
        [playerId]: mapId
      }
    }));
  },

  /**
   * Get a member's HUD position
   */
  getMemberPosition: (memberId) => {
    return get().memberPositions[memberId];
  },

  /**
   * Set a member's HUD position
   */
  setMemberPosition: (memberId, position) => {
    set(state => ({
      memberPositions: {
        ...state.memberPositions,
        [memberId]: position
      }
    }));
  },

  /**
   * Clear party members only (used when transitioning from social party to room party)
   * Prevents duplicate HUDs when entering a multiplayer room
   */
  clearPartyMembers: () => {
    set({
      partyMembers: [],
      isInParty: false,
      leaderId: null,
      leaderMode: false,
      memberPositions: {},
      playerMapAssignments: {}
    });
  },

  /**
   * Replace all party members with new list (used for room transitions)
   * More efficient than clear + add for each member
   */
  replacePartyMembers: (members) => {
    const membersList = Array.isArray(members) ? members : [];
    set({
      partyMembers: membersList,
      isInParty: membersList.length > 0
    });
  }
}));

export default usePartyStore;
