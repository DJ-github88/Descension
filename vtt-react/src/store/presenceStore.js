/**
 * Presence Store
 * 
 * Manages online user presence and global chat state.
 * Integrates with Firebase presence service and socket.io for real-time updates.
 */

import { create } from 'zustand';
import { io } from 'socket.io-client';
import presenceService from '../services/firebase/presenceService';
import { v4 as uuidv4 } from 'uuid';

const CHAT_DEBUG = process.env.NODE_ENV === 'development' || process.env.REACT_APP_CHAT_DEBUG === 'true';
const chatDebug = (...args) => {
  if (CHAT_DEBUG) {
    console.log(...args);
  }
};

const safeLower = (v) => (typeof v === 'string' ? v.trim().toLowerCase() : '');

const findPartyMemberByAnyId = (partyMembers = [], id) => {
  if (!id) return null;
  return partyMembers.find((m) => m?.id === id || m?.socketId === id) || null;
};

const findPartyMemberByName = (partyMembers = [], nameCandidates = []) => {
  const normalized = nameCandidates
    .map(safeLower)
    .filter(Boolean);

  if (normalized.length === 0) return null;

  return (
    partyMembers.find((m) => {
      const memberNames = [m?.name, m?.characterName, m?.displayName]
        .map(safeLower)
        .filter(Boolean);
      return memberNames.some((n) => normalized.includes(n));
    }) || null
  );
};

const usePresenceStore = create((set, get) => ({
  // Online users state
  onlineUsers: new Map(), // userId -> UserPresenceData
  currentUserPresence: null,

  // Chat tabs state
  activeTab: 'global', // 'global', 'whisper_userId', 'party'
  whisperTabs: new Map(), // userId -> { user, messages: [], unreadCount: 0 }

  // Global chat state
  globalChatMessages: [],
  maxChatMessages: 100,
  isGlobalChatMuted: false,

  // Party chat state (integrated with partyStore)
  partyChatMessages: [],

  // Room invitations
  pendingInvitations: [],

  // Party invitations
  pendingPartyInvites: [],

  // GM session invitation (when GM with party joins a room)
  gmSessionInvitation: null,

  // Socket connection
  socket: null,
  isConnected: false,

  // Subscriptions
  presenceUnsubscribe: null,

  /**
   * Set the active chat tab
   */
  setActiveTab: (tabId) => {
    set({ activeTab: tabId });
  },

  /**
   * Initialize presence tracking for current user
   */
  initializePresence: async (userId, characterData, sessionData = {}, accountName = null, isGuest = false, friendId = null) => {
    const success = await presenceService.setOnline(userId, characterData, { ...sessionData, accountName, isGuest, friendId });

    // Always set local state, even if Firebase fails (for dev mode without Firebase)
    const presenceData = {
      userId,
      accountName,
      isGuest,
      ...characterData,
      ...sessionData,
      friendId,
      status: 'online',
      lastUpdated: Date.now()
    };

    set({
      currentUserPresence: presenceData
    });

    // Also add to onlineUsers map so user appears in the list
    const { onlineUsers, socket } = get();
    const newOnlineUsers = new Map(onlineUsers);
    newOnlineUsers.set(userId, presenceData);
    set({ onlineUsers: newOnlineUsers });

    // Register presence with socket server
    if (socket && socket.connected) {
      socket.emit('register_presence', {
        userId,
        name: characterData.name || characterData.characterName,
        characterClass: characterData.class || characterData.characterClass,
        characterLevel: characterData.level || characterData.characterLevel
      });
    }

    return true; // Always return true since local state is set
  },

  /**
   * Initialize mock users for testing - Removed
   */
  initializeMockUsers: () => {
    // Mock users initialization removed
  },

  /**
   * Subscribe to all online users
   */
  subscribeToOnlineUsers: () => {
    const unsubscribe = presenceService.subscribeToOnlineUsers((users) => {
      const usersMap = new Map();
      users.forEach(user => {
        usersMap.set(user.userId, user);
      });

      set({ onlineUsers: usersMap });
    });

    set({ presenceUnsubscribe: unsubscribe });
    return unsubscribe;
  },

  /**
   * Unsubscribe from online users
   */
  unsubscribeFromOnlineUsers: () => {
    const { presenceUnsubscribe } = get();
    if (presenceUnsubscribe) {
      presenceUnsubscribe();
      set({ presenceUnsubscribe: null });
    }
  },

  /**
   * Update current user's session information
   */
  updateSession: async (sessionData) => {
    const { currentUserPresence } = get();
    if (!currentUserPresence) return false;

    const success = await presenceService.updateSession(
      currentUserPresence.userId,
      sessionData
    );

    if (success) {
      set({
        currentUserPresence: {
          ...currentUserPresence,
          ...sessionData
        }
      });

      // Emit socket event if connected
      const { socket } = get();
      if (socket && socket.connected) {
        socket.emit('update_session', {
          userId: currentUserPresence.userId,
          ...sessionData
        });
      }
    }

    return success;
  },

  /**
   * Update current user's status (online/away/busy) and optional status comment
   */
  updateStatus: async (status, statusComment = null) => {
    const { currentUserPresence, onlineUsers } = get();

    if (!currentUserPresence) {
      console.error('❌ No currentUserPresence found!');
      return false;
    }

    // Try to update in Firebase (will fail gracefully if not configured)
    const success = await presenceService.updateStatus(
      currentUserPresence.userId,
      status,
      statusComment
    );

    // Always update local state, even if Firebase update failed (for demo mode)
    const updates = {
      ...currentUserPresence,
      status,
      lastUpdated: Date.now() // Add timestamp to ensure object is seen as changed
    };

    // Only update statusComment if provided
    if (statusComment !== null) {
      updates.statusComment = statusComment;
    }

    // Also update the user in the onlineUsers map so the UI reflects the change
    const newOnlineUsers = new Map(onlineUsers);
    const userExists = newOnlineUsers.has(currentUserPresence.userId);

    if (userExists) {
      newOnlineUsers.set(currentUserPresence.userId, updates);
    } else {
      console.warn('⚠️ User not found in onlineUsers map, adding them now');
      newOnlineUsers.set(currentUserPresence.userId, updates);
    }

    // Update both in a single set call to ensure atomic update
    set({
      currentUserPresence: updates,
      onlineUsers: newOnlineUsers
    });

    // Emit socket event if connected (for multiplayer sync)
    const { socket } = get();
    if (socket && socket.connected) {
      socket.emit('update_status', {
        userId: currentUserPresence.userId,
        status,
        statusComment: updates.statusComment
      });
    }

    return true; // Return true since we updated local state
  },

  /**
   * Set user as offline
   */
  setOffline: async () => {
    const { currentUserPresence } = get();
    if (!currentUserPresence) return false;

    const success = await presenceService.setOffline(currentUserPresence.userId);

    if (success) {
      set({ currentUserPresence: null });
    }

    return success;
  },

  /**
   * Add a global chat message
   */
  addGlobalMessage: (message) => {
    // Skip if global chat is muted
    if (get().isGlobalChatMuted) return;

    set((state) => {
      const incomingIds = [message?.id, message?.messageId].filter(Boolean);
      // Prevent duplicate messages (e.g. optimistic local add + socket echo)
      const alreadyExists = state.globalChatMessages.some(msg => {
        const existingIds = [msg?.id, msg?.messageId].filter(Boolean);
        return incomingIds.some(inId => existingIds.includes(inId));
      });

      const hasDuplicateBySignature = state.globalChatMessages.some(msg =>
        msg.senderId === message.senderId &&
        msg.content === message.content &&
        msg.timestamp === message.timestamp
      );

      if (alreadyExists || hasDuplicateBySignature) {
        return state;
      }

      const messages = [...state.globalChatMessages, message];

      // Keep only last maxChatMessages
      if (messages.length > state.maxChatMessages) {
        return {
          globalChatMessages: messages.slice(-state.maxChatMessages)
        };
      }

      return { globalChatMessages: messages };
    });
  },

  /**
   * Toggle global chat mute state
   */
  toggleGlobalChatMute: () => {
    set((state) => ({ isGlobalChatMuted: !state.isGlobalChatMuted }));
  },

  /**
   * Clear global chat messages
   */
  clearGlobalMessages: () => {
    set({ globalChatMessages: [] });
  },

  /**
   * Send a global chat message
   */
  sendGlobalMessage: (content) => {
    const { currentUserPresence, socket } = get();

    // Block guest users from sending global messages
    // Note: Party chat and whispers to party members are handled separately in TabbedChat
    if (!currentUserPresence || currentUserPresence?.isGuest) {
      console.warn('Authentication required to send global chat messages');
      chatDebug('🌐 [sendGlobalMessage] blocked', {
        hasPresence: !!currentUserPresence,
        isGuest: !!currentUserPresence?.isGuest
      });
      return false;
    }

    // Current user is required above; this keeps identity deterministic for routing/UI anchors
    const senderData = currentUserPresence;

    // Resolve a stable sender id for multiplayer + local fallback modes
    let fallbackPlayerId = null;
    try {
      const gameState = require('./gameStore').default.getState();
      fallbackPlayerId = gameState?.currentPlayer?.id || null;
    } catch (e) {
      // gameStore not available, continue with other fallbacks
    }

    // Prefer in-room multiplayer identity for cross-client HUD anchoring.
    // Firebase userId can differ from room player id/socket id.
    const senderId = fallbackPlayerId || socket?.id || senderData?.userId || 'current-player';

    // Format sender name: AccountName(CharacterName) or just AccountName
    let senderName = senderData.accountName || senderData.characterName || 'Unknown';
    if (senderData.characterName && senderData.accountName && senderData.characterName !== 'Guest') {
      senderName = `${senderData.accountName}(${senderData.characterName})`;
    }

    const messageId = uuidv4();
    const message = {
      id: messageId,
      messageId,
      senderId,
      playerId: senderId,
      senderName: senderName,
      playerName: senderName,
      senderClass: senderData.class,
      senderLevel: senderData.level,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      type: 'message'
    };

    // Always add locally first so sender immediately sees their message
    // (even if server does not echo this event back)
    const addGlobalMessage = get().addGlobalMessage;
    addGlobalMessage(message);

    // Resolve best available multiplayer socket (presence socket first, then game socket fallback)
    let fallbackGameSocket = null;
    try {
      const gameState = require('./gameStore').default.getState();
      fallbackGameSocket = gameState?.multiplayerSocket || null;
    } catch (e) {
      // gameStore unavailable in this context
    }

    const activeSocket = (socket && socket.connected)
      ? socket
      : (fallbackGameSocket && fallbackGameSocket.connected ? fallbackGameSocket : null);

    // Emit to server for party members when connected; keep local optimistic append either way
    if (activeSocket) {
      chatDebug('🌐 [sendGlobalMessage] emit', {
        socketId: activeSocket.id,
        senderId,
        messageId,
        contentLength: message.content.length
      });
      activeSocket.emit('global_chat_message', message);
    } else {
      console.warn('⚠️ Global chat sent locally only (no active multiplayer socket)');
      chatDebug('🌐 [sendGlobalMessage] no-active-socket', {
        senderId,
        messageId
      });
    }

    return true;
  },

  /**
   * Send a whisper message to a specific user
   */
  sendWhisper: (targetUserId, content) => {
    const { currentUserPresence, onlineUsers, socket } = get();

    // Check if target is a party member
    let allowWithoutAuth = false;
    try {
      const partyStore = require('./partyStore').default;
      const partyState = partyStore.getState();
      const isTargetInParty = partyState.partyMembers.some(m => m.id === targetUserId);
      const isCurrentUserInParty = partyState.isInParty;
      allowWithoutAuth = isTargetInParty && isCurrentUserInParty;
    } catch (e) {
      // Party store not available
    }

    // Only block if not whispering to party member
    if (!allowWithoutAuth && (!currentUserPresence || currentUserPresence?.isGuest)) {
      console.warn('Authentication required to send whispers');
      return false;
    }

    // Check if target is a known presence user
    const targetUser = onlineUsers.get(targetUserId);

    // Resolve game state synchronously so message payload is complete before emitting
    let gameStoreState = null;
    let currentPlayer = null;
    let multiplayerSocket = null;
    try {
      gameStoreState = require('./gameStore').default.getState();
      currentPlayer = gameStoreState?.currentPlayer || null;
      multiplayerSocket = gameStoreState?.multiplayerSocket || null;
    } catch (e) {
      // gameStore not available, continue with presence/socket data
    }

    // Resolve party state once for identity normalization
    let partyState = null;
    let partyMembers = [];
    try {
      const partyStore = require('./partyStore').default;
      partyState = partyStore.getState();
      partyMembers = partyState.partyMembers || [];
    } catch (e) {
      // Party store not available
    }

    // Stable sender identity (prefer in-room IDs for server routing)
    const senderId =
      currentPlayer?.id ||
      multiplayerSocket?.id ||
      socket?.id ||
      currentUserPresence?.userId ||
      'current-player';

    let senderName =
      currentUserPresence?.characterName ||
      currentUserPresence?.name ||
      currentPlayer?.characterName ||
      currentPlayer?.name ||
      'Unknown';

    let senderClass =
      currentUserPresence?.class ||
      currentPlayer?.character?.class ||
      'Unknown';

    let senderLevel =
      currentUserPresence?.level ||
      currentPlayer?.character?.level ||
      1;

    // If we can map sender to party member, prefer party metadata for consistency
    const senderPartyMember = findPartyMemberByAnyId(partyMembers, senderId);
    if (senderPartyMember) {
      senderName = senderPartyMember.name || senderName;
      senderClass = senderPartyMember.character?.class || senderClass;
      senderLevel = senderPartyMember.character?.level || senderLevel;
    }

    // CRITICAL: Normalize recipient to in-room ID (party member id/socketId)
    // Server whisper routing resolves recipientId against room player.id/socketId only.
    let recipientPartyMember = findPartyMemberByAnyId(partyMembers, targetUserId);
    if (!recipientPartyMember && targetUser) {
      recipientPartyMember = findPartyMemberByName(partyMembers, [
        targetUser.characterName,
        targetUser.name,
        targetUser.displayName,
        targetUser.accountName
      ]);
    }

    const normalizedRecipientId =
      recipientPartyMember?.id ||
      recipientPartyMember?.socketId ||
      targetUser?.playerId ||
      targetUser?.socketId ||
      targetUserId;

    // Try to get recipient name from normalized party metadata first
    let recipientName = targetUser?.characterName || targetUser?.name || 'Unknown';
    if (recipientPartyMember?.name) {
      recipientName = recipientPartyMember.name;
    }

    const message = {
      id: uuidv4(),
      senderId: senderId,
      senderName: senderName,
      senderClass: senderClass,
      senderLevel: senderLevel,
      recipientId: normalizedRecipientId,
      recipientName: recipientName,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      type: 'whisper_sent'
    };

    // Only skip local add when multiplayer socket is actively connected
    // (server will echo/confirm to avoid duplication)
    const hasMultiplayerSocketConnection =
      !!(gameStoreState?.isInMultiplayer && multiplayerSocket?.connected);

    // Only add locally if NOT in multiplayer mode (server will send confirmation)
    if (!hasMultiplayerSocketConnection) {
      // Single-player mode or no socket - add locally
      get().addWhisperMessage(normalizedRecipientId, message);
    }

    if (socket && socket.connected) {
      // Real user - send via socket (server will send confirmation)
      socket.emit('whisper_message', message);
    } else {
      // Use multiplayer socket when available
      if (multiplayerSocket && multiplayerSocket.connected) {
        multiplayerSocket.emit('whisper_message', message);
      }
    }

    return true;
  },

  /**
   * Send a room invitation to a user
   */
  sendRoomInvite: (targetUserId, roomId, roomName) => {
    const { currentUserPresence, socket } = get();

    if (!currentUserPresence) {
      return false;
    }

    if (socket && socket.connected) {
      // Real user - send via socket
      socket.emit('send_room_invite', {
        targetUserId,
        roomId,
        roomName,
        gmName: currentUserPresence.characterName
      });
    }

    return true;
  },

  /**
   * Respond to a room invitation
   */
  respondToInvite: (inviteId, accepted) => {
    const { socket } = get();

    if (!socket || !socket.connected) {
      return false;
    }

    socket.emit('respond_to_invite', {
      inviteId,
      accepted
    });

    // Remove from pending invitations
    set((state) => ({
      pendingInvitations: state.pendingInvitations.filter(
        inv => inv.id !== inviteId
      )
    }));

    return true;
  },

  /**
   * Add a pending invitation
   */
  addInvitation: (invitation) => {
    set((state) => ({
      pendingInvitations: [...state.pendingInvitations, invitation]
    }));
  },

  /**
   * Remove an invitation
   */
  removeInvitation: (inviteId) => {
    set((state) => ({
      pendingInvitations: state.pendingInvitations.filter(
        inv => inv.id !== inviteId
      )
    }));
  },

  /**
   * Initialize a global socket connection for social features
   */
  initializeGlobalSocket: async () => {
    const { socket, isConnected } = get();

    // If already connected, don't re-initialize
    if (socket && isConnected) {
      return socket;
    }

    const SOCKET_URL = process.env.REACT_APP_SOCKET_URL ||
      (process.env.NODE_ENV === 'production'
        ? 'https://descension-mythrill.up.railway.app'
        : 'http://localhost:3001');

    console.log('🔌 Initializing global socket at:', SOCKET_URL);

    // Get auth token
    let authToken = null;
    try {
      const authStore = require('./authStore').default;
      const authState = authStore.getState();
      if (authState.user && !authState.isDevelopmentBypass && !authState.user.isGuest && authState.user.getIdToken) {
        authToken = await authState.user.getIdToken();
      }
    } catch (error) {
      console.warn('Could not get auth token for global socket:', error);
    }

    const newSocket = io(SOCKET_URL, {
      auth: {
        token: authToken
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    get().setSocket(newSocket);

    // Add connection error handlers
    newSocket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
      get().setConnected(false);
    });

    newSocket.on('connect_timeout', () => {
      console.error('❌ Socket connection timeout');
      get().setConnected(false);
    });

    newSocket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });

    return newSocket;
  },

  /**
   * Send a party invitation to a user
   * Note: Party ID is resolved on the server from userToParty map
   */
  sendPartyInvite: (targetUserId, targetPlayerName) => {
    const { currentUserPresence, socket } = get();

    if (!currentUserPresence || !socket || !socket.connected) {
      return false;
    }

    // Server will look up the party from userToParty using fromUserId
    // If no party exists, server will auto-create one
    socket.emit('invite_to_party', {
      partyId: null, // Server resolves this from userToParty
      fromUserId: currentUserPresence.userId,
      toUserId: targetUserId
    });

    return true;
  },

  /**
   * Respond to a party invitation
   */
  respondToPartyInvite: (inviteId, accepted) => {
    const { socket } = get();

    if (!socket || !socket.connected) {
      return false;
    }

    if (accepted) {
      socket.emit('accept_party_invite', { invitationId: inviteId });
    } else {
      socket.emit('decline_party_invite', { invitationId: inviteId });
    }

    // Remove from pending
    set((state) => ({
      pendingPartyInvites: state.pendingPartyInvites.filter(
        inv => inv.id !== inviteId || inv.invitationId !== inviteId
      )
    }));

    return true;
  },

  /**
   * Add a pending party invitation
   */
  addPartyInvite: (invitation) => {
    set((state) => ({
      pendingPartyInvites: [...state.pendingPartyInvites, invitation]
    }));
  },

  /**
   * Remove a party invitation
   */
  removePartyInvite: (inviteId) => {
    set((state) => ({
      pendingPartyInvites: state.pendingPartyInvites.filter(
        inv => inv.id !== inviteId
      )
    }));
  },

  /**
   * Set socket connection
   */
  setSocket: (socket) => {
    if (socket) {
      // Register presence if already initialized
      const { currentUserPresence } = get();
      if (currentUserPresence) {
        socket.emit('register_presence', {
          userId: currentUserPresence.userId,
          name: currentUserPresence.name || currentUserPresence.characterName,
          characterClass: currentUserPresence.class || currentUserPresence.characterClass,
          characterLevel: currentUserPresence.level || currentUserPresence.characterLevel
        });
      }

      // Party was created successfully
      socket.on('party_created', (partyData) => {
        console.log('🎉 Party created:', partyData.name);

        const members = partyData.members ? Object.values(partyData.members) : [];
        set(state => ({
          currentParty: partyData,
          isInParty: true,
          partyMembers: members,
          partyChatMessages: []
        }));

        // Sync to partyStore so components reading from partyStore see the update
        try {
          const partyStore = require('./partyStore').default;
          partyStore.setState({
            currentParty: partyData,
            isInParty: true,
            partyMembers: members,
            partyChatMessages: [],
            leaderId: partyData.leaderId || null
          });
        } catch (e) {
          // partyStore not available
        }
      });

      // A member joined the party
      socket.on('party_member_joined', ({ partyId, memberId, memberData }) => {
        console.log(`👤 Party member joined: ${memberData.name} (Member ID: ${memberId || memberData.id}) to party: ${partyId}`);

        // Deduplicate: only add if not already present
        const existingMembers = get().partyMembers || [];
        const alreadyExists = existingMembers.some(m =>
          (m.id === memberId || m.id === memberData.id || m.userId === memberId || m.userId === memberData.id)
        );

        if (!alreadyExists) {
          const updatedMembers = [...existingMembers, memberData];
          console.log(`📊 Updating presenceStore members count: ${existingMembers.length} -> ${updatedMembers.length}`);
          set(state => ({ partyMembers: updatedMembers }));

          // Sync to partyStore
          try {
            const partyStore = require('./partyStore').default;
            const partyState = partyStore.getState();
            console.log(`📊 Syncing to partyStore. Current partyStore count: ${partyState.partyMembers.length}`);

            if (!partyState.partyMembers.some(m => (m.id === memberId || m.id === memberData.id))) {
              partyStore.getState().addPartyMember(memberData);
              console.log('✅ Called partyStore.addPartyMember');
            } else {
              console.log('ℹ️ Member already exists in partyStore');
            }
          } catch (e) {
            console.warn('⚠️ Failed to sync join to partyStore:', e);
          }
        } else {
          console.log('ℹ️ Member already exists in presenceStore');
        }

        // Add system message to party chat
        try {
          const chatStore = require('./chatStore').default;
          chatStore.getState().addSocialNotification({
            type: 'party_member_joined',
            sender: { name: memberData.name },
            content: `${memberData.name} joined the party.`
          });
        } catch (e) {
          // chatStore not available
        }
      });

      // A member left the party
      socket.on('party_member_left', ({ partyId, memberId, userName }) => {
        console.log('👤 Party member left:', userName);

        set(state => ({
          partyMembers: (state.partyMembers || []).filter(m => m.id !== memberId)
        }));

        // Sync to partyStore
        try {
          const partyStore = require('./partyStore').default;
          partyStore.setState(state => ({
            partyMembers: (state.partyMembers || []).filter(m => m.id !== memberId)
          }));
        } catch (e) {
          // partyStore not available
        }

        // Add system message to party chat
        try {
          const chatStore = require('./chatStore').default;
          chatStore.getState().addSocialNotification({
            type: 'party_member_left',
            sender: { name: userName },
            content: `${userName} left the party.`
          });
        } catch (e) {
          // chatStore not available
        }
      });

      // Party leadership changed (when leader leaves)
      socket.on('party_leader_changed', ({ partyId, newLeaderId, newLeaderName }) => {
        console.log('👑 Party leadership changed:', newLeaderName);

        const updater = state => ({
          partyMembers: (state.partyMembers || []).map(m => {
            if (m.id === newLeaderId) {
              return { ...m, isGM: true };
            } else {
              return { ...m, isGM: false };
            }
          })
        });

        set(updater);

        // Sync to partyStore
        try {
          const partyStore = require('./partyStore').default;
          partyStore.setState(state => ({
            ...updater(state),
            leaderId: newLeaderId
          }));
        } catch (e) {
          // partyStore not available
        }
      });

      // Party was disbanded
      socket.on('party_disbanded', ({ partyId, partyName, disbandedBy }) => {
        console.log('💥 Party disbanded:', partyName);

        const resetState = {
          currentParty: null,
          isInParty: false,
          partyMembers: [],
          partyChatMessages: []
        };

        set(state => resetState);

        // Sync to partyStore
        try {
          const partyStore = require('./partyStore').default;
          partyStore.setState({ ...resetState, leaderId: null, leaderMode: false });
        } catch (e) {
          // partyStore not available
        }
      });

      // Party was left (user perspective)
      socket.on('party_left', ({ partyId }) => {
        console.log('👤 Left party:', partyId);

        const resetState = {
          currentParty: null,
          isInParty: false,
          partyMembers: [],
          partyChatMessages: []
        };

        set(state => resetState);

        // Sync to partyStore
        try {
          const partyStore = require('./partyStore').default;
          partyStore.setState({ ...resetState, leaderId: null, leaderMode: false });
        } catch (e) {
          // partyStore not available
        }
      });

      // Party was updated (also sent to user who just joined via accept_party_invite)
      socket.on('party_updated', (partyData) => {
        console.log('🔄 Party updated:', partyData.name);

        const currentMembers = get().partyMembers || [];
        const newMembers = partyData.members ? Object.values(partyData.members) : [];

        // POTENTIAL FIX: Don't downgrade member count if we are the leader
        // Server might send a stale initial party state to the leader right after an invite accepts
        const isLeader = partyData.leaderId === get().currentUserPresence?.userId;

        if (isLeader && currentMembers.length > newMembers.length) {
          console.log('⚠️ Ignoring party_updated: Local member count is higher than server update');
          return;
        }

        set(state => ({
          currentParty: partyData,
          isInParty: true,
          partyMembers: newMembers
        }));

        // Also sync to partyStore
        try {
          const partyStore = require('./partyStore').default;
          partyStore.setState({
            currentParty: partyData,
            isInParty: true,
            partyMembers: newMembers,
            leaderId: partyData.leaderId || null
          });
        } catch (e) {
          // partyStore not available, presenceStore state is sufficient
        }
      });

      // Member removed from party (kick or self-leave via server)
      socket.on('member_removed', ({ partyId, targetUserId, userName }) => {
        console.log('👤 Member removed from party:', userName);

        const isSelf = get().currentUserPresence?.userId === targetUserId;

        if (isSelf) {
          const resetState = {
            currentParty: null,
            isInParty: false,
            partyMembers: [],
            partyChatMessages: []
          };
          set(resetState);

          try {
            const partyStore = require('./partyStore').default;
            partyStore.setState({
              ...resetState,
              leaderId: null,
              leaderMode: false
            });
          } catch (e) { }
        } else {
          set(state => ({
            partyMembers: (state.partyMembers || []).filter(m => m.id !== targetUserId)
          }));

          try {
            const partyStore = require('./partyStore').default;
            partyStore.setState(state => ({
              partyMembers: (state.partyMembers || []).filter(m => m.id !== targetUserId)
            }));
          } catch (e) { }
        }
      });

      // Party invitation received
      socket.on('party_invitation_received', (invitation) => {
        console.log('📩 Party invitation received:', invitation.partyName || 'New Party');

        set(state => ({
          pendingPartyInvites: [...state.pendingPartyInvites, invitation]
        }));

        // Show notification
        const chatStore = require('./chatStore').default;
        chatStore.getState().addSocialNotification({
          type: 'party_invitation_received',
          sender: { name: invitation.fromUserName },
          content: `${invitation.fromUserName} has invited you to join their party${invitation.partyName ? ` "${invitation.partyName}"` : ""}.`
        });
      });

      // Party invitation was accepted
      socket.on('party_invitation_accepted', ({ invitationId, userId, userName }) => {
        console.log('✅ Party invitation accepted:', userName);

        set(state => ({
          pendingPartyInvites: state.pendingPartyInvites.filter(inv => inv.id !== invitationId)
        }));

        // Show notification
        const chatStore = require('./chatStore').default;
        chatStore.getState().addSocialNotification({
          type: 'party_invitation_accepted',
          sender: { name: userName },
          content: `${userName} accepted your party invitation!`
        });
      });

      // Party invitation was declined
      socket.on('party_invitation_declined', ({ invitationId, userName }) => {
        console.log('❌ Party invitation declined:', userName);

        set(state => ({
          pendingPartyInvites: state.pendingPartyInvites.filter(inv => inv.id !== invitationId)
        }));

        // Show notification
        const chatStore = require('./chatStore').default;
        chatStore.getState().addSocialNotification({
          type: 'party_invitation_declined',
          sender: { name: userName },
          content: `${userName} declined your party invitation`
        });
      });

      // Party chat message received from server
      socket.on('party_chat_message', ({ partyId, fromId, message, timestamp, senderName }) => {
        // Skip messages from self — already optimistically appended by TabbedChat
        const { currentUserPresence } = get();
        if (fromId === currentUserPresence?.userId) return;

        console.log('💬 Party chat message:', senderName, message.substring(0, 30));

        // Store with schema that matches TabbedChat.renderMessage expectations
        set(state => ({
          partyChatMessages: [
            ...state.partyChatMessages,
            {
              id: `party_${Date.now()}_${fromId}`,
              type: 'party',
              senderId: fromId,
              senderName,
              content: message,
              timestamp: timestamp || Date.now()
            }
          ].slice(-100) // Keep last 100 messages
        }));
      });

      // Party error received
      socket.on('party_error', ({ error, partyId, ...rest }) => {
        console.error('❌ Party error:', error);

        // Show notification
        const chatStore = require('./chatStore').default;
        chatStore.getState().addSocialNotification({
          type: 'party_error',
          content: error || 'An error occurred'
        });
      });

      // GM session invitation received
      socket.on('gm_session_invitation', (invitation) => {
        console.log('🎭 GM session invitation received:', invitation.partyName);

        set(state => ({
          gmSessionInvitation: invitation
        }));
      });
    }

    set({ socket, isConnected: socket?.connected || false });
  },

  /**
   * Update connection status
   */
  setConnected: (isConnected) => {
    set({ isConnected });
  },

  /**
   * Get online users as array
   */
  getOnlineUsersArray: () => {
    const { onlineUsers } = get();
    return Array.from(onlineUsers.values());
  },

  // ==================== GM SESSION HANDLERS ====================

  /**
   * Accept GM session invitation
   */
  acceptGMSessionInvitation: () => {
    const { gmSessionInvitation, socket } = get();

    if (!gmSessionInvitation) {
      console.error('❌ No GM session invitation to accept');
      return;
    }

    if (!socket || !socket.connected) {
      console.error('❌ No socket connection for GM session invitation');
      return;
    }

    console.log('✅ Accepting GM session invitation:', gmSessionInvitation.partyName);
    socket.emit('respond_to_room_invitation', {
      invitationId: gmSessionInvitation.id,
      roomId: gmSessionInvitation.roomId,
      accepted: true
    });

    set({ gmSessionInvitation: null });
  },

  /**
   * Decline GM session invitation
   */
  declineGMSessionInvitation: () => {
    const { gmSessionInvitation, socket } = get();

    if (!gmSessionInvitation) {
      console.error('❌ No GM session invitation to decline');
      return;
    }

    if (!socket || !socket.connected) {
      console.error('❌ No socket connection for GM session invitation');
      return;
    }

    console.log('❌ Declining GM session invitation:', gmSessionInvitation.partyName);
    socket.emit('respond_to_room_invitation', {
      invitationId: gmSessionInvitation.id,
      roomId: gmSessionInvitation.roomId,
      accepted: false
    });

    set({ gmSessionInvitation: null });
  },

  /**
   * Open a whisper tab for a user
   */
  openWhisperTab: (user) => {
    if (!user) return;
    const userId = user.userId || user.uid || user.id;
    if (!userId) return;

    const { whisperTabs } = get();
    if (!whisperTabs.has(userId)) {
      // Create empty tab if it doesn't exist
      const newTabs = new Map(whisperTabs);
      newTabs.set(userId, {
        user,
        messages: [],
        unreadCount: 0
      });
      set({ whisperTabs: newTabs, activeTab: `whisper_${userId}` });
    } else {
      set({ activeTab: `whisper_${userId}` });
    }
  },

  /**
   * Close whisper tab
   */
  closeWhisperTab: (userId) => {
    const { whisperTabs, activeTab } = get();
    const newTabs = new Map(whisperTabs);
    newTabs.delete(userId);

    // If closing active tab, switch to global
    const newActiveTab = activeTab === `whisper_${userId}` ? 'global' : activeTab;

    set({ whisperTabs: newTabs, activeTab: newActiveTab });
  },

  /**
   * Add message to whisper tab
   */
  addWhisperMessage: (userId, message) => {
    const { whisperTabs, activeTab, onlineUsers } = get();
    const newTabs = new Map(whisperTabs);
    let tab = newTabs.get(userId);
    let resolvedUserId = userId;

    // If tab key is missing, try to reconcile to an existing tab by participant names.
    // This prevents split tabs when one side used presence userId and the other uses room playerId.
    if (!tab) {
      const normalizedSender = safeLower(message?.senderName);
      const normalizedRecipient = safeLower(message?.recipientName);

      for (const [existingUserId, existingTab] of newTabs.entries()) {
        const candidateNames = [
          existingTab?.user?.characterName,
          existingTab?.user?.name,
          existingTab?.user?.displayName,
          existingTab?.user?.accountName
        ].map(safeLower).filter(Boolean);

        if (
          (normalizedSender && candidateNames.includes(normalizedSender)) ||
          (normalizedRecipient && candidateNames.includes(normalizedRecipient))
        ) {
          resolvedUserId = existingUserId;
          tab = existingTab;
          break;
        }
      }
    }

    // Create tab if it doesn't exist
    if (!tab) {
      let user = onlineUsers.get(resolvedUserId) || onlineUsers.get(userId);

      // If user not found in onlineUsers, try to create from message data or party store
      if (!user) {
        // Try to get from party store synchronously (if already imported)
        try {
          const partyStore = require('./partyStore').default;
          const partyState = partyStore.getState();
          const partyMember = partyState.partyMembers.find(m => m.id === resolvedUserId || m.id === userId);
          if (partyMember) {
            user = {
              userId: partyMember.id,
              characterName: partyMember.name,
              name: partyMember.name,
              displayName: partyMember.name,
              class: partyMember.character?.class || 'Unknown',
              level: partyMember.character?.level || 1
            };
          }
        } catch (e) {
          // Party store not available, continue
        }

        // If still no user, create from message data
        if (!user) {
          // Determine which name to use based on whether this is a sent or received message
          // If userId matches senderId, this is a received message, use senderName
          // If userId matches recipientId, this is a sent message, use recipientName
          const isReceivedMessage = message.senderId === resolvedUserId || message.senderId === userId;
          const displayName = isReceivedMessage
            ? (message.senderName || 'Unknown')
            : (message.recipientName || 'Unknown');
          const displayClass = isReceivedMessage
            ? (message.senderClass || 'Unknown')
            : (message.recipientClass || 'Unknown');
          const displayLevel = isReceivedMessage
            ? (message.senderLevel || 1)
            : (message.recipientLevel || 1);

          user = {
            userId: userId,
            linkedUserId: resolvedUserId,
            characterName: displayName,
            name: displayName,
            displayName: displayName,
            class: displayClass,
            level: displayLevel
          };
        }
      }

      if (user) {
        tab = {
          user,
          messages: [],
          unreadCount: 0
        };
        newTabs.set(resolvedUserId, tab);
      } else {
        console.warn('Cannot add whisper message: user not found', resolvedUserId);
        return null;
      }
    }

    // CRITICAL FIX: Check for duplicate messages by ID to prevent duplication
    const existingMessage = tab.messages.find(m => m.id === message.id);
    if (existingMessage) {
      // Message already exists, don't add again
      return resolvedUserId;
    }

    // Add message to tab
    tab.messages.push(message);

    // Increment unread count if not on this tab
    if (activeTab !== `whisper_${resolvedUserId}`) {
      tab.unreadCount++;
    }

    set({ whisperTabs: newTabs });

    // Return resolved tab key so callers can switch to the correct whisper tab
    // even when sender/recipient identity was reconciled.
    return resolvedUserId;
  },

  /**
   * Clear unread count for whisper tab
   */
  clearWhisperUnread: (userId) => {
    const { whisperTabs } = get();
    const newTabs = new Map(whisperTabs);
    const tab = newTabs.get(userId);

    if (tab) {
      tab.unreadCount = 0;
      set({ whisperTabs: newTabs });
    }
  },

  /**
   * Clear messages for whisper tab
   */
  clearWhisperMessages: (userId) => {
    const { whisperTabs } = get();
    const newTabs = new Map(whisperTabs);
    const tab = newTabs.get(userId);

    if (tab) {
      tab.messages = [];
      set({ whisperTabs: newTabs });
    }
  },

  /**
   * Add party chat message
   */
  addPartyChatMessage: (message) => {
    set(state => {
      const incomingIds = [message?.id, message?.messageId].filter(Boolean);
      const hasDuplicateById = incomingIds.length > 0
        ? state.partyChatMessages.some(msg => {
          const existingIds = [msg?.id, msg?.messageId].filter(Boolean);
          return incomingIds.some(inId => existingIds.includes(inId));
        })
        : false;

      const hasDuplicateBySignature = state.partyChatMessages.some(msg =>
        msg.senderId === message.senderId &&
        msg.content === message.content &&
        msg.timestamp === message.timestamp
      );

      if (hasDuplicateById || hasDuplicateBySignature) {
        return state;
      }

      return {
        partyChatMessages: [...state.partyChatMessages, message].slice(-100)
      };
    });
  },

  /**
   * Clear party chat messages
   */
  clearPartyMessages: () => {
    set({ partyChatMessages: [] });
  },

  /**
   * Update user status (for online/offline simulation)
   */
  updateUserStatus: (userId, updatedUser, remove = false) => {
    const { onlineUsers } = get();
    const newUsers = new Map(onlineUsers);

    if (remove || !updatedUser) {
      // Remove user from online list
      newUsers.delete(userId);
    } else {
      // Update or add user
      newUsers.set(userId, updatedUser);
    }

    set({ onlineUsers: newUsers });
  },

  /**
   * Cleanup on unmount
   */
  cleanup: () => {
    const { presenceUnsubscribe } = get();

    if (presenceUnsubscribe) {
      presenceUnsubscribe();
    }

    presenceService.cleanup();

    set({
      onlineUsers: new Map(),
      currentUserPresence: null,
      activeTab: 'global',
      whisperTabs: new Map(),
      globalChatMessages: [],
      partyChatMessages: [],
      pendingInvitations: [],
      pendingPartyInvites: [],
      socket: null,
      isConnected: false,
      presenceUnsubscribe: null
    });
  }
}));

export default usePresenceStore;

