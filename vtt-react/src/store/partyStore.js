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

  return ids;
};

const isSelfMemberId = (memberId) => {
  const selfIds = getSelfIdentifiers();
  return selfIds.has(memberId);
};

const ensureSelfMember = (members) => {
  const selfIds = getSelfIdentifiers();
  const hasSelf = (members || []).some(member =>
    selfIds.has(member.id) || selfIds.has(member.userId) || selfIds.has(member.uid)
  );
  if (hasSelf) return members || [];

  // Use presenceStore as primary source for social/lobby context
  let selfId = null;
  let selfName = 'Current Player';
  let selfClass = 'Unknown';
  let selfLevel = 1;

  try {
    const presenceStore = require('./presenceStore').default.getState();
    const presence = presenceStore.currentUserPresence;
    if (presence?.userId) {
      selfId = presence.userId;
      selfName = presence.characterName || presence.accountName || selfName;
      selfClass = presence.class || selfClass;
      selfLevel = presence.level || selfLevel;
    }
  } catch (e) { }

  // Fallback to gameStore if presenceStore didn't yield an ID
  if (!selfId) {
    try {
      const gameStore = require('./gameStore').default.getState();
      selfId = gameStore?.currentPlayer?.id || gameStore?.multiplayerSocket?.id;
      if (selfId) {
        selfName = gameStore?.currentPlayer?.name || selfName;
      }
    } catch (e) { }
  }

  if (!selfId) return members || []; // Still no identity — don't add phantom

  return [
    ...(members || []),
    {
      id: selfId,
      name: selfName,
      isGM: false,
      status: PARTY_STATUS.ONLINE,
      joinedAt: Date.now(),
      characterClass: selfClass,
      characterLevel: selfLevel,
      character: {
        class: selfClass,
        level: selfLevel,
        health: { current: 100, max: 100 },
        mana: { current: 100, max: 100 },
        actionPoints: { current: 3, max: 3 }
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

  // Leader and GM mode
  leaderId: null,
  leaderMode: false
};

// Create the store
const usePartyStore = create((set, get) => ({
  ...initialState,

  // ==================== PARTY MANAGEMENT ====================

  /**
   * Create a new party with user as leader
   * Returns a Promise that resolves when the party is created
   */
  createParty: (partyName = 'New Party', isGM = false, leaderData = null) => {
    return new Promise((resolve, reject) => {
      const socket = getSocket();

      const actualLeaderData = leaderData || {
        isGM,
        name: isGM ? 'Game Master' : 'Party Leader',
        characterName: isGM ? 'Game Master' : 'Party Leader',
        characterClass: 'Unknown',
        characterLevel: 1
      };

      if (!socket) {
        // ALLOW LOCAL PARTY CREATION WITHOUT SOCKET
        // This is critical for single-player/local-room modes or when server is unavailable
        if (partyName === 'Single Player Party' || partyName.includes('Local')) {
          console.log('📱 Creating local single-player party (no socket available)');
          const localParty = {
            id: 'local-party-' + Date.now(),
            name: partyName,
            members: {
              'current-player': actualLeaderData
            }
          };
          set({
            currentParty: localParty,
            isInParty: true,
            partyMembers: [actualLeaderData],
            partyChatMessages: []
          });
          resolve(localParty);
          return;
        }

        console.error('❌ Cannot create party: No socket connection');
        reject(new Error('No socket connection'));
        return;
      }

      console.log('🎉 Creating party:', { partyName, leaderData: actualLeaderData });

      // Set up one-time listener for party_created response
      const onPartyCreated = (partyData) => {
        socket.off('party_created', onPartyCreated);
        socket.off('party_error', onPartyError);

        set(state => ({
          currentParty: partyData,
          isInParty: true,
          partyMembers: Object.values(partyData.members) || [],
          partyChatMessages: []
        }));

        resolve(partyData);
      };

      const onPartyError = (error) => {
        socket.off('party_created', onPartyCreated);
        socket.off('party_error', onPartyError);

        // If error is "already in party", check if we have the party data and resolve
        if (error.error === 'You are already in a party' && error.party) {
          set(state => ({
            currentParty: error.party,
            isInParty: true,
            partyMembers: Object.values(error.party.members) || [],
            partyChatMessages: []
          }));
          resolve(error.party);
        } else {
          reject(new Error(error.error || 'Failed to create party'));
        }
      };

      socket.once('party_created', onPartyCreated);
      socket.once('party_error', onPartyError);

      // Set a timeout in case server doesn't respond
      setTimeout(() => {
        socket.off('party_created', onPartyCreated);
        socket.off('party_error', onPartyError);
        reject(new Error('Party creation timeout'));
      }, 10000);

      socket.emit('create_party', {
        partyName,
        leaderData: actualLeaderData
      });
    });
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
   */
  addPartyMember: (memberData) => {
    set(state => ({
      partyMembers: ensureSelfMember([...state.partyMembers, memberData])
    }));
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
   */
  updatePartyMember: (memberId, updates, silent = false) => {
    const isTargetSelf = isSelfMemberId(memberId);

    set(state => ({
      partyMembers: state.partyMembers.map(m => {
        const isMemberSelf = isSelfMemberId(m.id);
        if ((isTargetSelf && isMemberSelf) || m.id === memberId) {
          return { ...m, ...updates };
        }
        return m;
      })
    }));
  },

  /**
   * Get a specific party member
   */
  getPartyMember: (memberId) => {
    const state = get();
    return state.partyMembers.find(member => member.id === memberId);
  },

  /**
   * Check if a user is in the party
   */
  isUserInParty: (userId) => {
    const state = get();
    return state.partyMembers.some(member => member.id === userId);
  },

  // ==================== UTILITIES ====================

  /**
   * Get party size
   */
  getPartySize: () => {
    const state = get();
    return state.partyMembers.length;
  },

  /**
   * Get the current party ID
   */
  getCurrentPartyId: () => {
    const state = get();
    return state.currentParty?.id || null;
  },

  /**
   * Set the position of a party member frame in the HUD
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
   * Get the position of a party member frame
   */
  getMemberPosition: (memberId) => {
    const state = get();
    return state.memberPositions[memberId] || null;
  },

  /**
   * Set the leader of the party
   */
  setLeader: (leaderId, leaderMode = false) => {
    set({ leaderId, leaderMode });
  },

  /**
   * Check if current user is the party leader
   */
  isPartyLeader: () => {
    const { leaderId } = get();
    if (!leaderId) return false;

    // Check various identity forms
    try {
      const gameStore = require('./gameStore').default.getState();
      const myId = gameStore.currentPlayer?.id || gameStore.multiplayerSocket?.id;
      if (myId && leaderId === myId) return true;
    } catch (e) { }

    try {
      const presenceStore = require('./presenceStore').default.getState();
      const myPresenceId = presenceStore.currentUserPresence?.userId;
      if (myPresenceId && leaderId === myPresenceId) return true;
    } catch (e) { }

    return leaderId === 'current-player';
  },

  /**
   * Check if a specific user is the party leader
   */
  isUserLeader: (userId) => {
    const { leaderId } = get();
    return leaderId && userId === leaderId;
  }
}));

export default usePartyStore;
