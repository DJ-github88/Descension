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
  initializePresence: async (userId, characterData, sessionData = {}) => {
    const success = await presenceService.setOnline(userId, characterData, sessionData);

    // Always set local state, even if Firebase fails (for dev mode without Firebase)
    const presenceData = {
      userId,
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

    console.log('✅ Presence initialized locally for user:', userId);
    console.log('✅ Firebase sync:', success ? 'enabled' : 'disabled (dev mode)');

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
      console.log('🎭 Mock users already initialized, skipping...');
      return;
    }

    console.log('🎭 Initializing mock users for testing...');
    const mockUsers = mockPresenceService.initializeMockUsers();

    const usersMap = new Map(get().onlineUsers);
    mockUsers.forEach(user => {
      usersMap.set(user.userId, user);
    });

    set({ onlineUsers: usersMap });

    // Start automated chat
    const addGlobalMessage = get().addGlobalMessage;
    mockPresenceService.startAutomatedChat(addGlobalMessage);

    // Start online/offline simulation
    const updateUserStatus = get().updateUserStatus;
    mockPresenceService.startOnlineOfflineSimulation(updateUserStatus, addGlobalMessage);

    console.log(`✅ Added ${mockUsers.length} mock users to online list`);
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
      console.log('📊 Online users updated:', users.length + mockUsers.length);
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

    console.log('🔍 updateStatus called with:', { status, statusComment });
    console.log('👤 currentUserPresence:', currentUserPresence);
    console.log('👥 onlineUsers size:', onlineUsers.size);

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

    console.log('🔥 Firebase update success:', success);

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

    console.log('📦 Updates object:', updates);
    console.log('📦 Old status:', currentUserPresence.status, '→ New status:', status);

    // Also update the user in the onlineUsers map so the UI reflects the change
    const newOnlineUsers = new Map(onlineUsers);
    const userExists = newOnlineUsers.has(currentUserPresence.userId);
    console.log('🔍 User exists in onlineUsers:', userExists, 'userId:', currentUserPresence.userId);

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

    console.log('✅ Updated currentUserPresence and onlineUsers');
    console.log('✅ New currentUserPresence status:', get().currentUserPresence?.status);

    // Emit socket event if connected (for multiplayer sync)
    const { socket } = get();
    if (socket && socket.connected) {
      socket.emit('update_status', {
        userId: currentUserPresence.userId,
        status,
        statusComment: updates.statusComment
      });
      console.log('📡 Emitted status update to socket');
    }

    console.log(`✅ Status updated to: ${status}${statusComment ? ` - "${statusComment}"` : ''}`);

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

    // For testing without login, use a default user
    const senderData = currentUserPresence || {
      userId: 'test_user',
      characterName: 'Yad',
      class: 'Adventurer',
      level: 1
    };

    const message = {
      id: uuidv4(),
      senderId: senderData.userId,
      senderName: senderData.characterName,
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

    // For testing without login, use a default user
    const senderData = currentUserPresence || {
      userId: 'test_user',
      characterName: 'Yad',
      class: 'Adventurer',
      level: 1
    };

    const message = {
      id: uuidv4(),
      senderId: senderData.userId,
      senderName: senderData.characterName,
      recipientId: targetUserId,
      recipientName: targetUser?.characterName || 'Unknown',
      content: content.trim(),
      timestamp: new Date().toISOString(),
      type: 'whisper_sent'
    };

    // Add to whisper tab instead of global chat
    get().addWhisperMessage(targetUserId, message);

    // If mock user, simulate response
    if (isMockUser) {
      mockPresenceService.simulateWhisperResponse(
        targetUserId,
        senderData.characterName,
        (userId, responseMessage) => {
          // Add response to whisper tab
          get().addWhisperMessage(userId, responseMessage);
        }
      );
    } else if (socket && socket.connected) {
      // Real user - send via socket
      socket.emit('whisper_message', message);
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
      const user = onlineUsers.get(userId);
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

