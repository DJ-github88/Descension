/**
 * Presence Store
 * 
 * Manages online user presence and global chat state.
 * Integrates with Firebase presence service and socket.io for real-time updates.
 */

import { create } from 'zustand';
import presenceService from '../services/firebase/presenceService';
import mockPresenceService from '../services/mockPresenceService';
import { v4 as uuidv4 } from 'uuid';

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

  // Socket connection
  socket: null,
  isConnected: false,

  // Subscriptions
  presenceUnsubscribe: null,

  /**
   * Initialize presence tracking for current user
   */
  initializePresence: async (userId, characterData, sessionData = {}, accountName = null, isGuest = false) => {
    const success = await presenceService.setOnline(userId, characterData, { ...sessionData, accountName, isGuest });

    // Always set local state, even if Firebase fails (for dev mode without Firebase)
    const presenceData = {
      userId,
      accountName,
      isGuest,
      ...characterData,
      ...sessionData,
      status: 'online',
      lastUpdated: Date.now()
    };

    set({
      currentUserPresence: presenceData
    });

    // Also add to onlineUsers map so user appears in the list
    const { onlineUsers } = get();
    const newOnlineUsers = new Map(onlineUsers);
    newOnlineUsers.set(userId, presenceData);
    set({ onlineUsers: newOnlineUsers });

    return true; // Always return true since local state is set
  },

  /**
   * Initialize mock users for testing
   */
  initializeMockUsers: () => {
    // Check if mock users are already initialized
    const currentUsers = get().onlineUsers;
    const hasMockUsers = Array.from(currentUsers.keys()).some(key => key.startsWith('mock_user_'));

    if (hasMockUsers) {
      return;
    }
    const mockUsers = mockPresenceService.initializeMockUsers();

    const usersMap = new Map(get().onlineUsers);
    mockUsers.forEach(user => {
      usersMap.set(user.userId, user);
    });

    set({ onlineUsers: usersMap });

    // DISABLED: Remove automated chat test messages
    // const addGlobalMessage = get().addGlobalMessage;
    // mockPresenceService.startAutomatedChat(addGlobalMessage);

    // Start online/offline simulation
    const updateUserStatus = get().updateUserStatus;
    const addGlobalMessage = get().addGlobalMessage;
    mockPresenceService.startOnlineOfflineSimulation(updateUserStatus, addGlobalMessage);

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

      // Add mock users
      const mockUsers = mockPresenceService.getMockUsers();
      mockUsers.forEach(user => {
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
    if (currentUserPresence?.isGuest) {
      console.warn('Guest users cannot send global chat messages');
      return false;
    }

    // For testing without login, use a default user
    const senderData = currentUserPresence || {
      userId: 'test_user',
      characterName: 'Yad',
      accountName: 'Yad',
      class: 'Adventurer',
      level: 1
    };

    // Format sender name: AccountName(CharacterName) or just AccountName
    let senderName = senderData.accountName || senderData.characterName || 'Unknown';
    if (senderData.characterName && senderData.accountName && senderData.characterName !== 'Guest') {
      senderName = `${senderData.accountName}(${senderData.characterName})`;
    }

    const message = {
      id: uuidv4(),
      senderId: senderData.userId,
      senderName: senderName,
      senderClass: senderData.class,
      senderLevel: senderData.level,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      type: 'message'
    };

    // If socket connected, emit to server
    if (socket && socket.connected) {
      socket.emit('global_chat_message', message);
    } else {
      // For testing without socket, add directly to local state
      const addGlobalMessage = get().addGlobalMessage;
      addGlobalMessage(message);
    }

    return true;
  },

  /**
   * Send a whisper message to a specific user
   */
  sendWhisper: (targetUserId, content) => {
    const { currentUserPresence, socket, onlineUsers } = get();

    // Check if target is a mock user
    const targetUser = onlineUsers.get(targetUserId);
    const isMockUser = targetUserId.startsWith('mock_user_');

    // Get sender data - try character store first, then presence, then fallback
    let senderData = currentUserPresence;
    let senderName = senderData?.characterName || senderData?.name || 'Unknown';
    let senderClass = senderData?.class || 'Unknown';
    let senderLevel = senderData?.level || 1;
    let senderId = senderData?.userId || 'test_user';

    // Try to get from character store if in multiplayer
    import('./gameStore').then(({ default: useGameStore }) => {
      const gameStore = useGameStore.getState();
      if (gameStore.isInMultiplayer) {
        import('./characterStore').then(({ default: useCharacterStore }) => {
          const characterState = useCharacterStore.getState();
          if (characterState.name) {
            senderName = characterState.name;
            senderClass = characterState.class || 'Unknown';
            senderLevel = characterState.level || 1;
          }
        }).catch(() => {
          // Ignore if character store not available
        });
      }
    }).catch(() => {
      // Ignore if game store not available
    });

    // Try to get recipient name from party store if in multiplayer
    let recipientName = targetUser?.characterName || targetUser?.name || 'Unknown';
    try {
      const partyStore = require('./partyStore').default;
      const partyState = partyStore.getState();
      const partyMember = partyState.partyMembers.find(m => m.id === targetUserId);
      if (partyMember) {
        recipientName = partyMember.name;
      }
    } catch (e) {
      // Party store not available, continue
    }

    const message = {
      id: uuidv4(),
      senderId: senderId,
      senderName: senderName,
      senderClass: senderClass,
      senderLevel: senderLevel,
      recipientId: targetUserId,
      recipientName: recipientName,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      type: 'whisper_sent'
    };

    // CRITICAL FIX: Only add message locally for mock users or single-player mode
    // In multiplayer mode, wait for server confirmation to avoid duplication
    let isInMultiplayer = false;
    try {
      const gameStore = require('./gameStore').default.getState();
      isInMultiplayer = gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected;
    } catch (e) {
      // Ignore if gameStore not available
    }

    // Only add locally if NOT in multiplayer mode (server will send confirmation)
    if (!isInMultiplayer && !isMockUser) {
      // Single-player mode or no socket - add locally
      get().addWhisperMessage(targetUserId, message);
    }

    // If mock user, simulate response
    if (isMockUser) {
      // Add message locally for mock users
      get().addWhisperMessage(targetUserId, message);
      mockPresenceService.simulateWhisperResponse(
        targetUserId,
        senderData.characterName,
        (userId, responseMessage) => {
          // Add response to whisper tab
          get().addWhisperMessage(userId, responseMessage);
        }
      );
    } else if (socket && socket.connected) {
      // Real user - send via socket (server will send confirmation)
      socket.emit('whisper_message', message);
    } else {
      // Check if we're in multiplayer mode and use multiplayer socket
      import('./gameStore').then(({ default: useGameStore }) => {
        const gameStore = useGameStore.getState();
        if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
          // Use multiplayer socket for whispers (server will send confirmation)
          gameStore.multiplayerSocket.emit('whisper_message', message);
        } else {
          // Not in multiplayer and no socket - add locally
          get().addWhisperMessage(targetUserId, message);
        }
      }).catch(() => {
        // Ignore errors if gameStore not available - add locally as fallback
        get().addWhisperMessage(targetUserId, message);
      });
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

    const isMockUser = targetUserId.startsWith('mock_user_');

    // If mock user, simulate response
    if (isMockUser) {
      mockPresenceService.simulateInviteResponse(
        targetUserId,
        roomName,
        get().addGlobalMessage
      );

      // Add system message
      const targetUser = get().onlineUsers.get(targetUserId);
      get().addGlobalMessage({
        id: uuidv4(),
        content: `Sent room invitation to ${targetUser?.characterName || 'Unknown'} for ${roomName}`,
        timestamp: new Date().toISOString(),
        type: 'system'
      });
    } else if (socket && socket.connected) {
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
   * Set socket connection
   */
  setSocket: (socket) => {
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

  /**
   * Get user by ID
   */
  getUserById: (userId) => {
    const { onlineUsers } = get();
    return onlineUsers.get(userId);
  },

  /**
   * Check if user is online
   */
  isUserOnline: (userId) => {
    const { onlineUsers } = get();
    return onlineUsers.has(userId);
  },

  /**
   * Tab Management
   */
  setActiveTab: (tabId) => {
    set({ activeTab: tabId });
  },

  /**
   * Open whisper tab with a user
   */
  openWhisperTab: (user) => {
    const { whisperTabs } = get();
    const tabId = `whisper_${user.userId}`;

    if (!whisperTabs.has(user.userId)) {
      const newTabs = new Map(whisperTabs);
      newTabs.set(user.userId, {
        user,
        messages: [],
        unreadCount: 0
      });
      set({ whisperTabs: newTabs });
    }

    set({ activeTab: tabId });
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

    // Create tab if it doesn't exist
    if (!tab) {
      let user = onlineUsers.get(userId);

      // If user not found in onlineUsers, try to create from message data or party store
      if (!user) {
        // Try to get from party store synchronously (if already imported)
        try {
          const partyStore = require('../store/partyStore').default;
          const partyState = partyStore.getState();
          const partyMember = partyState.partyMembers.find(m => m.id === userId);
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
          const isReceivedMessage = message.senderId === userId;
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
        newTabs.set(userId, tab);
      } else {
        console.warn('Cannot add whisper message: user not found', userId);
        return;
      }
    }

    // CRITICAL FIX: Check for duplicate messages by ID to prevent duplication
    const existingMessage = tab.messages.find(m => m.id === message.id);
    if (existingMessage) {
      // Message already exists, don't add again
      return;
    }

    // Add message to tab
    tab.messages.push(message);

    // Increment unread count if not on this tab
    if (activeTab !== `whisper_${userId}`) {
      tab.unreadCount++;
    }

    set({ whisperTabs: newTabs });
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
    set(state => ({
      partyChatMessages: [...state.partyChatMessages, message].slice(-100)
    }));
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
      socket: null,
      isConnected: false,
      presenceUnsubscribe: null
    });
  }
}));

export default usePresenceStore;

