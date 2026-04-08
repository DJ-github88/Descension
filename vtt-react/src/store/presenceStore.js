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

const DEFAULT_SOCIAL_SOCKET_URL = 'https://descension-mythrill.up.railway.app';

const getSocketUrlCandidates = () => {
  const envUrl = process.env.REACT_APP_SOCKET_URL;
  const isProduction = process.env.NODE_ENV === 'production';
  const candidates = [];

  if (envUrl) {
    candidates.push(envUrl);
  } else {
    candidates.push(isProduction ? DEFAULT_SOCIAL_SOCKET_URL : 'http://localhost:3001');
  }

  const primaryUrl = candidates[0] || '';
  const shouldAddProductionFallback = !isProduction && /localhost|127\.0\.0\.1/i.test(primaryUrl);

  if (shouldAddProductionFallback && !candidates.includes(DEFAULT_SOCIAL_SOCKET_URL)) {
    candidates.push(DEFAULT_SOCIAL_SOCKET_URL);
  }

  return candidates.filter(Boolean);
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
  partyChatUnreadCount: 0,

  // Community window state (for cross-component sync)
  isCommunityWindowOpen: false,

  // Party members (synced with partyStore for HUD display)
  partyMembers: [],

  // Room invitations
  pendingInvitations: [],

  // Party invitations
  pendingPartyInvites: [],

  // Sent party invites (for sender feedback notification)
  sentPartyInvites: [],

  // GM session invitation (when GM with party joins a room)
  gmSessionInvitation: null,

  // Party event toasts (member joined/left, invite outcomes)
  partyEventNotifications: [],

  // Session join requests (as leader)
  sessionJoinRequests: [],

  // Sent join requests (as member)
  sentJoinRequests: [],

  // Pending multiplayer join (after accepting GM session invitation)
  pendingMultiplayerJoin: null,

  // Socket connection
  socket: null,
  isConnected: false,
  _boundSocketId: null, // Track bound socket ID to prevent duplicate listeners

  // Event deduplication: Track recently processed events to prevent duplicate notifications
  // when multiple sockets receive the same event
  _processedEvents: new Map(), // Map<eventSignature, timestamp>

  // Helper to check if event was recently processed (within 2 seconds)
  _wasEventRecentlyProcessed: (eventType, ...identifiers) => {
    const key = `${eventType}:${identifiers.filter(Boolean).join(':')}`;
    const state = get();
    const lastProcessed = state._processedEvents.get(key);
    const now = Date.now();

    if (lastProcessed && (now - lastProcessed) < 2000) {
      console.log(`🔄 [Dedup] Skipping duplicate event: ${key}`);
      return true;
    }

    // Mark as processed
    state._processedEvents.set(key, now);

    // Cleanup old entries (keep only last 10 seconds)
    for (const [k, timestamp] of state._processedEvents.entries()) {
      if (now - timestamp > 10000) {
        state._processedEvents.delete(k);
      }
    }

    return false;
  },

  // Subscriptions
  presenceUnsubscribe: null,

  /**
   * Set the active chat tab
   */
  setActiveTab: (tabId) => {
    const { partyChatUnreadCount } = get();

    // Clear party unread when switching to party tab
    if (tabId === 'party' && partyChatUnreadCount > 0) {
      set({ activeTab: tabId, partyChatUnreadCount: 0 });
    } else {
      set({ activeTab: tabId });
    }
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
        accountName, // CRITICAL: Include account name for fallback when character name is generic
        characterClass: characterData.class || characterData.characterClass,
        characterLevel: characterData.level || characterData.characterLevel,
        // Include full character data for HUD display in party/rooms
        character: {
          class: characterData.class || characterData.characterClass || 'Unknown',
          level: characterData.level || characterData.characterLevel || 1,
        health: characterData.health || null,
        mana: characterData.mana || null,
          actionPoints: characterData.actionPoints || { current: 1, max: 3 },
          race: characterData.race || 'Unknown',
          raceDisplayName: characterData.raceDisplayName || 'Unknown'
        },
        health: characterData.health || { current: 45, max: 50 },
        mana: characterData.mana || { current: 45, max: 50 },
        actionPoints: characterData.actionPoints || { current: 1, max: 3 }
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

      // Always include current user in the map to ensure visibility
      const { currentUserPresence } = get();
      if (currentUserPresence && currentUserPresence.userId) {
        usersMap.set(currentUserPresence.userId, currentUserPresence);
      }

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
  // Helper for centralized party updates from various socket events
  handlePartyUpdate: (partyData) => {
    if (!partyData) return;

    const members = partyData.members ? (
      Array.isArray(partyData.members) ? partyData.members : Object.values(partyData.members)
    ) : [];

    // Enrich all members with character data if missing
    const enrichedMembers = members.map(m => ({
      ...m,
      character: m.character || {
        class: m.characterClass || 'Unknown',
        level: m.characterLevel || 1,
        health: null,
        mana: null,
        actionPoints: { current: 1, max: 3 }
      }
    }));

    set(state => ({
      currentParty: partyData,
      isInParty: true,
      partyMembers: enrichedMembers
    }));

    // Sync partyId to Firestore presence
    const { currentUserPresence } = get();
    if (currentUserPresence) {
      presenceService.updateSession(currentUserPresence.userId, {
        partyId: partyData.id,
        partyName: partyData.name
      });
    }

    // Sync to partyStore
    try {
      const gameStore = require('./gameStore').default;
      const isInMultiplayerRoom = gameStore.getState().isInMultiplayer;
      const isEnteringMultiplayer = sessionStorage.getItem('enteringMultiplayer') === 'true';

      if (!isInMultiplayerRoom && !isEnteringMultiplayer) {
        const partyStore = require('./partyStore').default;
        partyStore.setState({
          currentParty: partyData,
          isInParty: true,
          partyMembers: enrichedMembers,
          leaderId: partyData.leaderId || null
        });
      }
    } catch (e) {
      console.warn('⚠️ Failed to sync party update to partyStore:', e);
    }
  },

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
      // Use definitive ID check if available, otherwise fallback to signature
      const hasId = incomingIds.length > 0;
      const alreadyExistsById = hasId && state.globalChatMessages.some(msg => {
        const existingIds = [msg?.id, msg?.messageId].filter(Boolean);
        return incomingIds.some(inId => existingIds.includes(inId));
      });

      // Signature check only if no ID or as additional safeguard for fast identical messages
      // Reduce signature usage if we have IDs
      const hasDuplicateBySignature = !hasId && state.globalChatMessages.some(msg =>
        msg.senderId === message.senderId &&
        msg.content === message.content &&
        Math.abs((new Date(msg.timestamp).getTime() || 0) - (new Date(message.timestamp).getTime() || 0)) < 1000
      );

      if (alreadyExistsById || hasDuplicateBySignature) {
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

    // Allow guest users to send global chat messages (essential for trial interaction)
    if (!currentUserPresence) {
      console.warn('Authentication required to send global chat messages');
      chatDebug('🌐 [sendGlobalMessage] blocked - no presence');
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
      isGuest: !!senderData.isGuest,
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

    // Allow guests to send whispers (essential for trial interaction)
    if (!currentUserPresence) {
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
      targetUser?.userId ||
      recipientPartyMember?.userId || // Prefer social ID if member has it
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
      isGuest: !!currentUserPresence?.isGuest,
      content: content.trim(),
      timestamp: new Date().toISOString(),
      type: 'whisper_sent'
    };

    console.log('📤 Sending whisper:', {
      recipientId: normalizedRecipientId,
      recipientName: recipientName,
      targetUserFound: !!targetUser,
      recipientPartyMemberFound: !!recipientPartyMember,
      socketConnected: socket?.connected
    });

    // FIXED: Always rely on server confirmation to avoid duplicates
    // Server will send whisper_sent confirmation which adds to UI
    // Only add locally if there's NO socket connection at all (truly offline)
    const hasAnySocketConnection = (socket && socket.connected) || (multiplayerSocket && multiplayerSocket.connected);

    if (!hasAnySocketConnection) {
      // Truly offline - add locally only
      get().addWhisperMessage(normalizedRecipientId, message);
    }

    if (socket && socket.connected) {
      // Send via social socket (server will send confirmation)
      socket.emit('whisper_message', message);
    } else if (multiplayerSocket && multiplayerSocket.connected) {
      // Use multiplayer socket when available
      multiplayerSocket.emit('whisper_message', message);
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
    if (socket?.connected && isConnected) {
      return socket;
    }

    // Clean up stale disconnected socket before reinitializing
    if (socket && !socket.connected) {
      try {
        socket.removeAllListeners();
        socket.disconnect();
      } catch (e) {
        // Ignore cleanup errors
      }
      set({ socket: null, isConnected: false });
    }

    const socketUrlCandidates = getSocketUrlCandidates();
    if (socketUrlCandidates.length === 0) {
      console.error('❌ No socket URL candidates configured for social socket');
      return null;
    }

    let [primarySocketUrl, ...fallbackSocketUrls] = socketUrlCandidates;
    let fallbackAttempted = false;

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

    const socketOptions = {
      auth: {
        token: authToken
      },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 5000
    };

    const wireConnectionHandlers = (activeSocket, socketUrl) => {
      // Handle (re)connection - re-register presence
      activeSocket.on('connect', () => {
        console.log('🔌 Socket connected:', activeSocket.id, 'url:', socketUrl);
        get().setConnected(true);

        // Re-register presence on (re)connection
        const { currentUserPresence } = get();
        if (currentUserPresence) {
          console.log('📝 Re-registering presence on connect for:', currentUserPresence.userId);
          activeSocket.emit('register_presence', {
            userId: currentUserPresence.userId,
            name: currentUserPresence.name || currentUserPresence.characterName,
            accountName: currentUserPresence.accountName || null, // CRITICAL: Include account name for fallback
            characterClass: currentUserPresence.class || currentUserPresence.characterClass,
            characterLevel: currentUserPresence.level || currentUserPresence.characterLevel,
            // Include character data for HUD display
            character: {
              class: currentUserPresence.class || 'Unknown',
              level: currentUserPresence.level || 1,
              health: currentUserPresence.health || null,
              mana: currentUserPresence.mana || null,
              actionPoints: currentUserPresence.actionPoints || { current: 0, max: 0 },
              race: currentUserPresence.race || 'Unknown',
              raceDisplayName: currentUserPresence.raceDisplayName || 'Unknown'
            },
            health: currentUserPresence.health || null,
            mana: currentUserPresence.mana || null,
            actionPoints: currentUserPresence.actionPoints || { current: 0, max: 0 }
          });
        }
      });

      activeSocket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error);
        get().setConnected(false);

        // Development fallback: if localhost is unreachable, retry once against production social server
        if (!fallbackAttempted && fallbackSocketUrls.length > 0) {
          const fallbackUrl = fallbackSocketUrls.shift();
          fallbackAttempted = true;

          console.warn(`⚠️ Primary social socket unavailable (${socketUrl}). Retrying with fallback: ${fallbackUrl}`);

          try {
            activeSocket.removeAllListeners();
            activeSocket.disconnect();
          } catch (e) {
            // Ignore cleanup errors
          }

          set({ socket: null, isConnected: false });
          createSocket(fallbackUrl);
        }
      });

      activeSocket.on('connect_timeout', () => {
        console.error('❌ Socket connection timeout');
        get().setConnected(false);
      });

      activeSocket.on('error', (error) => {
        console.error('❌ Socket error:', error);
      });
    };

    const createSocket = (socketUrl) => {
      console.log('🔌 Initializing global socket at:', socketUrl);
      const nextSocket = io(socketUrl, socketOptions);
      get().setSocket(nextSocket);
      wireConnectionHandlers(nextSocket, socketUrl);
      return nextSocket;
    };

    return createSocket(primarySocketUrl);
  },

  /**
   * Ensure the global social socket is connected (with timeout)
   */
  ensureSocketConnected: async (timeoutMs = 5000) => {
    const state = get();
    if (state.socket?.connected || state.isConnected) {
      return true;
    }

    await state.initializeGlobalSocket();

    if (get().socket?.connected || get().isConnected) {
      return true;
    }

    const startTime = Date.now();
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        const latestState = get();
        if (latestState.socket?.connected || latestState.isConnected) {
          clearInterval(interval);
          resolve(true);
          return;
        }

        if (Date.now() - startTime >= timeoutMs) {
          clearInterval(interval);
          resolve(false);
        }
      }, 150);
    });
  },

  /**
   * Send a party invitation to a user
   * Note: Party ID is resolved on the server from userToParty map
   */
  sendPartyInvite: (targetUserId, targetPlayerName) => {
    const { currentUserPresence, socket } = get();

    console.log(`📢 [presenceStore] sendPartyInvite called for target: ${targetUserId} (${targetPlayerName})`);

    let activeSocket = socket;
    if (!activeSocket || !activeSocket.connected) {
      try {
        const gameSocket = require('./gameStore').default.getState()?.multiplayerSocket;
        if (gameSocket && gameSocket.connected) {
          activeSocket = gameSocket;
          console.log('📢 [presenceStore] Using game multiplayer socket as fallback');
        }
      } catch (e) {
        // gameStore might not be available
      }
    }

    if (!currentUserPresence || !activeSocket || !activeSocket.connected) {
      console.warn('⚠️ Cannot send party invite: social socket is not connected', { currentUserPresence: !!currentUserPresence, socket: !!activeSocket, connected: activeSocket?.connected });
      return false;
    }

    // Track this sent invite for sender feedback UI
    const sentInviteEntry = {
      id: Date.now().toString(),
      invitationId: null, // Will be updated when server confirms with invitation_sent event
      targetUserId,
      targetName: targetPlayerName || targetUserId,
      sentAt: Date.now(),
      outcome: null // 'accepted' | 'declined' | null
    };

    console.log('📢 [presenceStore] Adding sentInviteEntry to state:', sentInviteEntry);
    set(state => ({
      sentPartyInvites: [...state.sentPartyInvites, sentInviteEntry]
    }));

    // Try to explicitly get current partyId if we are in one
    let explicitPartyId = null;
    try {
      const partyStore = require('./partyStore').default;
      explicitPartyId = partyStore.getState().currentParty?.id || null;
      console.log('📢 [presenceStore] Fetched explicitPartyId:', explicitPartyId);
    } catch (e) {
      // partyStore not available
    }

    // Server will look up the party from userToParty using fromUserId if explicitPartyId is null
    console.log('📢 [presenceStore] Emitting invite_to_party to server...', { partyId: explicitPartyId, toUserId: targetUserId });
    activeSocket.emit('invite_to_party', {
      partyId: explicitPartyId,
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
    let activeSocket = socket;

    if (!activeSocket || !activeSocket.connected) {
      try {
        const gameSocket = require('./gameStore').default.getState()?.multiplayerSocket;
        if (gameSocket && gameSocket.connected) {
          activeSocket = gameSocket;
        }
      } catch (e) {
        // gameStore might not be available
      }
    }

    if (!activeSocket || !activeSocket.connected) {
      return false;
    }

    if (accepted) {
      activeSocket.emit('accept_party_invite', { invitationId: inviteId });
    } else {
      activeSocket.emit('decline_party_invite', { invitationId: inviteId });
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
   * Dismiss a sent invite notification
   */
  dismissSentPartyInvite: (inviteId) => {
    set((state) => ({
      sentPartyInvites: state.sentPartyInvites.filter(inv => inv.id !== inviteId)
    }));
  },

  /**
   * Dismiss a party event toast notification
   */
  dismissPartyEventNotification: (notifId) => {
    set((state) => ({
      partyEventNotifications: state.partyEventNotifications.filter(n => n.id !== notifId)
    }));
  },

  /**
   * Set socket connection
   */
  setSocket: (socket) => {
    const existingSocket = get().socket;

    // CRITICAL FIX: Track bound socket ID to prevent duplicate listener registration
    // If same socket is passed again, don't re-bind listeners
    const boundSocketId = get()._boundSocketId;
    if (socket && socket.id && boundSocketId === socket.id) {
      console.log('⏭️ [setSocket] Socket already bound, skipping listener setup');
      // Still re-register presence in case server restarted or lost the entry
      const { currentUserPresence } = get();
      if (currentUserPresence && socket.connected) {
        socket.emit('register_presence', {
          userId: currentUserPresence.userId,
          name: currentUserPresence.name || currentUserPresence.characterName,
          characterClass: currentUserPresence.class || currentUserPresence.characterClass,
          characterLevel: currentUserPresence.level || currentUserPresence.characterLevel
        });
      }
      return;
    }

    // CRITICAL: Clean up existing socket to prevent duplicate listeners
    // BUT: Don't disconnect if we're in multiplayer mode - the multiplayer socket
    // must stay connected to receive room events like player_joined
    if (existingSocket && existingSocket !== socket) {
      // Check if we're in multiplayer mode before disconnecting
      let isInMultiplayer = false;
      try {
        const gameStore = require('./gameStore').default;
        isInMultiplayer = gameStore.getState().isInMultiplayer;
      } catch (e) {
        // gameStore might not be available
      }

      const isEnteringMultiplayer = typeof sessionStorage !== 'undefined' &&
        sessionStorage.getItem('enteringMultiplayer') === 'true';

      if (isInMultiplayer || isEnteringMultiplayer) {
        console.log('⏭️ [setSocket] Skipping socket disconnect - in multiplayer mode');
        // Still remove listeners from old socket to prevent duplicates
        try {
          existingSocket.removeAllListeners();
        } catch (e) {
          // Ignore cleanup errors
        }
      } else if (existingSocket.connected) {
        console.log('🧹 [setSocket] Cleaning up previous socket before setting new one');
        try {
          existingSocket.removeAllListeners();
          existingSocket.disconnect();
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    }

    if (socket) {
      // Register presence if already initialized
      const { currentUserPresence } = get();
      if (currentUserPresence) {
        socket.emit('register_presence', {
          userId: currentUserPresence.userId,
          name: currentUserPresence.name || currentUserPresence.characterName,
          characterClass: currentUserPresence.class || currentUserPresence.characterClass,
          characterLevel: currentUserPresence.level || currentUserPresence.characterLevel,
          // Include character data for HUD display
          character: {
            class: currentUserPresence.class || 'Unknown',
            level: currentUserPresence.level || 1,
            health: currentUserPresence.health || null,
            mana: currentUserPresence.mana || null,
            actionPoints: currentUserPresence.actionPoints || { current: 0, max: 0 },
            race: currentUserPresence.race || 'Unknown',
            raceDisplayName: currentUserPresence.raceDisplayName || 'Unknown'
          },
          health: currentUserPresence.health || null,
          mana: currentUserPresence.mana || null,
          actionPoints: currentUserPresence.actionPoints || { current: 0, max: 0 }
        });
      }

      // Party was created successfully
      socket.on('party_created', (payload) => {
        const partyData = payload.party || payload;
        console.log('🎉 Party created:', partyData.name);

        // Add system message if not in multiplayer
        try {
          const chatStore = require('./chatStore').default;
          chatStore.getState().addSocialNotification({
            type: 'party_created',
            sender: { name: 'Party System' },
            content: `Party "${partyData.name || 'New Party'}" has been created.`
          });
        } catch (e) { }

        // Don't overwrite room party if we're in a multiplayer room
        try {
          const gameStore = require('./gameStore').default;
          const isInMultiplayerRoom = gameStore.getState().isInMultiplayer;
          const isEnteringMultiplayer = sessionStorage.getItem('enteringMultiplayer') === 'true';

          if (isInMultiplayerRoom || isEnteringMultiplayer) {
            console.log('⏭️ Skipping party_created sync - in multiplayer room');
            return;
          }
        } catch (e) {
          // gameStore might not be available
        }

        get().handlePartyUpdate(partyData);

        // Add visual feedback notification
        get().addPartyEventNotification('party_created', {
          name: partyData.name || 'New Party',
          message: `Party "${partyData.name || 'New Party'}" created successfully`
        });
      });

      // Party joined or updated (used for initial state sync)
      const handlePartySync = (payload) => {
        const partyData = payload.party || payload;
        if (!partyData) return;

        console.log('🔄 Party sync received:', partyData.name || partyData.id);

        const members = partyData.members ? (
          Array.isArray(partyData.members) ? partyData.members : Object.values(partyData.members)
        ) : [];

        set(state => ({
          currentParty: partyData,
          isInParty: true,
          partyMembers: members
        }));

        try {
          const gameStore = require('./gameStore').default;
          const isInMultiplayerRoom = gameStore.getState().isInMultiplayer;
          const isEnteringMultiplayer = sessionStorage.getItem('enteringMultiplayer') === 'true';

          if (!isInMultiplayerRoom && !isEnteringMultiplayer) {
            const partyStore = require('./partyStore').default;
            partyStore.setState({
              currentParty: partyData,
              isInParty: true,
              partyMembers: members,
              leaderId: partyData.leaderId || null
            });
          }
        } catch (e) {
          console.warn('⚠️ Failed to sync party update to partyStore:', e);
        }
      };

      socket.on('party_joined', (payload) => {
        const partyData = payload.party || payload;
        if (!partyData) return;
        console.log('🔄 Party joined:', partyData.name || partyData.id);

        // Update party state - notification will be shown by party_join_confirmed
        // This prevents duplicate notifications since both events fire on join
        get().handlePartyUpdate(partyData);
      });

      // A member joined the party
      socket.on('party_member_joined', (payload) => {
        // SAFEGUARD: Ensure payload exists
        if (!payload) return;

        const partyId = payload.partyId || (payload.party?.id);
        const memberId = payload.memberId || payload.member?.id;
        const memberData = payload.memberData || payload.member;

        if (!memberData) {
          console.warn('⚠️ Received party_member_joined with missing memberData:', payload);
          return;
        }

        // DEDUPLICATION: Skip if this event was recently processed
        if (get()._wasEventRecentlyProcessed('party_member_joined', partyId, memberId || memberData.id)) {
          return;
        }

        console.log(`👤 Party member joined: ${memberData.name} (Member ID: ${memberId || memberData.id}) to party: ${partyId}`);

        // Ensure memberData has character object with default resources if not provided
        const enrichedMemberData = {
          ...memberData,
          character: memberData.character || {
            class: memberData.characterClass || 'Unknown',
            level: memberData.characterLevel || 1,
            health: null,
            mana: null,
            actionPoints: { current: 0, max: 0 }
          }
        };

        // Deduplicate: only add if not already present in the global presence list
        const existingMembers = get().partyMembers || [];
        const alreadyExists = existingMembers.some(m =>
          (m.id === memberId || m.id === memberData.id || m.userId === memberId || m.userId === memberData.id)
        );

        if (!alreadyExists) {
          const updatedMembers = [...existingMembers, enrichedMemberData];
          console.log(`📊 Updating presenceStore members count: ${existingMembers.length} -> ${updatedMembers.length}`);
          set(state => ({ partyMembers: updatedMembers }));

          // Add visual feedback notification only when member is NEW (prevents duplicate notifications)
          // DEDUPLICATION: Skip if this member joining is current user's recently accepted invitee
          const wasRecentlyInvitedByMe = get()._wasEventRecentlyProcessed('party_invite_accepted', partyId, memberId || memberData.name);
          
          if (!wasRecentlyInvitedByMe) {
            get().addPartyEventNotification('joined', {
              memberName: memberData.name,
              message: `${memberData.name} joined the party`
            });
          } else {
            console.log(`👤 [Dedup] Skipping "joined" toast for ${memberData.name} - already shown "accepted" toast.`);
          }
        } else {
          console.log('ℹ️ Member already exists in presenceStore');
        }

        // Sync to partyStore REGARDLESS of whether they were in presenceStore already,
        // but ONLY if not in multiplayer mode AND not entering multiplayer.
        // This ensures they show up in the specific "Your Party" UI.
        try {
          const gameStore = require('./gameStore').default;
          const isInMultiplayerRoom = gameStore.getState().isInMultiplayer;
          const isEnteringMultiplayer = sessionStorage.getItem('enteringMultiplayer') === 'true';

          if (!isInMultiplayerRoom && !isEnteringMultiplayer) {
            const partyStore = require('./partyStore').default;
            const partyState = partyStore.getState();

            // Deduplicate within partyStore specifically
            const inPartyStore = partyState.partyMembers.some(m =>
              (m.id === memberId || m.id === memberData.id || m.userId === memberId || m.userId === memberData.id)
            );

            if (!inPartyStore) {
              console.log(`📊 Syncing ${memberData.name} to partyStore.`);
              partyStore.getState().addPartyMember(enrichedMemberData);
            } else {
              console.log(`ℹ️ ${memberData.name} already exists in partyStore`);
            }
          } else {
            console.log('ℹ️ Skipping partyStore sync - in multiplayer room or entering multiplayer');
          }
        } catch (e) {
          console.warn('⚠️ Failed to sync join to partyStore:', e);
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

      // Invite was accepted - specific notification for the inviter
      socket.on('party_invite_accepted', ({ partyId, memberId, memberName, memberData }) => {
        // DEDUPLICATION: Skip if this event was recently processed
        if (get()._wasEventRecentlyProcessed('party_invite_accepted', partyId, memberId || memberName)) {
          return;
        }

        console.log(`✅ Your party invite was accepted by: ${memberName}`);

        // Show "accepted your invite" toast to the inviter
        get().addPartyEventNotification('accepted', {
          memberName: memberName,
          message: `${memberName} accepted your party invite`
        });

        // Add to chat notifications
        try {
          const chatStore = require('./chatStore').default;
          chatStore.getState().addSocialNotification({
            type: 'party_invite_accepted',
            sender: { name: memberName },
            content: `${memberName} accepted your party invitation.`
          });
        } catch (e) {
          // chatStore not available
        }
      });

      // Receiver confirmation - you successfully joined a party
      socket.on('party_join_confirmed', ({ partyId, partyName, memberCount }) => {
        // DEDUPLICATION: Skip if this event was recently processed
        if (get()._wasEventRecentlyProcessed('party_join_confirmed', partyId)) {
          return;
        }

        console.log(`✅ You joined party: ${partyName || partyId}`);

        // Show toast notification to the receiver
        get().addPartyEventNotification('you_joined', {
          partyName: partyName,
          message: partyName
            ? `You joined "${partyName}"`
            : 'You joined the party!'
        });

        // Add to chat notifications
        try {
          const chatStore = require('./chatStore').default;
          chatStore.getState().addSocialNotification({
            type: 'party_joined',
            sender: { name: 'Party System' },
            content: partyName
              ? `You joined party "${partyName}" (${memberCount} members).`
              : `You joined the party (${memberCount} members).`
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

      // Party now has only one member (offer to disband) - LEGACY: Now auto-disbanded
      socket.on('party_single_member', ({ partyId, partyName, message }) => {
        console.log('👤 You are now the only party member');

        // Show notification
        try {
          const chatStore = require('./chatStore').default;
          chatStore.getState().addSocialNotification({
            type: 'party_update',
            sender: { name: 'Party System' },
            content: message || 'You are now the only member of this party. Consider disbanding if you no longer need it.'
          });
        } catch (e) {
          // chatStore not available
        }
      });

      // Party auto-disbanded (only 1 member remaining)
      socket.on('party_auto_disbanded', ({ partyId, partyName, message }) => {
        console.log('💥 Party auto-disbanded:', partyName);

        // Show notification
        try {
          const chatStore = require('./chatStore').default;
          chatStore.getState().addSocialNotification({
            type: 'party_disbanded',
            sender: { name: 'Party System' },
            content: message || `${partyName} has been disbanded - all other members have left.`
          });
        } catch (e) {
          // chatStore not available
        }

        const resetState = {
          currentParty: null,
          isInParty: false,
          partyMembers: [],
          partyChatMessages: []
        };

        set(state => resetState);

        // Clear party from Firestore presence
        const { currentUserPresence } = get();
        if (currentUserPresence) {
          presenceService.updateSession(currentUserPresence.userId, {
            partyId: null,
            partyName: null
          });
        }

        // Sync to partyStore
        try {
          const partyStore = require('./partyStore').default;
          partyStore.setState({ ...resetState, leaderId: null, leaderMode: false });
        } catch (e) {
          // partyStore not available
        }
      });

      // Party was disbanded
      socket.on('party_disbanded', ({ partyId, partyName, disbandedBy }) => {
        console.log('💥 Party disbanded:', partyName);

        // Add system message if not in multiplayer
        try {
          const chatStore = require('./chatStore').default;
          chatStore.getState().addSocialNotification({
            type: 'party_disbanded',
            sender: { name: 'Party System' },
            content: `The party "${partyName || 'Game Session'}" has been disbanded.`
          });
        } catch (e) { }

        const resetState = {
          currentParty: null,
          isInParty: false,
          partyMembers: [],
          partyChatMessages: []
        };

        set(state => resetState);

        // Clear party from Firestore presence
        const { currentUserPresence } = get();
        if (currentUserPresence) {
          presenceService.updateSession(currentUserPresence.userId, {
            partyId: null,
            partyName: null
          });
        }

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

        // Add system message if not in multiplayer
        try {
          const chatStore = require('./chatStore').default;
          chatStore.getState().addSocialNotification({
            type: 'party_left',
            sender: { name: 'Party System' },
            content: `You have left the party.`
          });
        } catch (e) { }

        const resetState = {
          currentParty: null,
          isInParty: false,
          partyMembers: [],
          partyChatMessages: []
        };

        set(state => resetState);

        // Clear party from Firestore presence
        const { currentUserPresence } = get();
        if (currentUserPresence) {
          presenceService.updateSession(currentUserPresence.userId, {
            partyId: null,
            partyName: null
          });
        }

        // Sync to partyStore
        try {
          const partyStore = require('./partyStore').default;
          partyStore.setState({ ...resetState, leaderId: null, leaderMode: false });
        } catch (e) {
          // partyStore not available
        }
      });

      // Party was updated (also handled by party_joined)
      socket.on('party_updated', (payload) => {
        if (!payload) return;
        const partyData = payload.party || payload;
        console.log('🔄 Party updated:', partyData.name);
        get().handlePartyUpdate(partyData);
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
            const chatStore = require('./chatStore').default;
            chatStore.getState().addSocialNotification({
              type: 'party_member_removed',
              sender: { name: 'Party System' },
              content: `You have been removed from the party.`
            });
          } catch (e) { }

          try {
            const partyStore = require('./partyStore').default;
            partyStore.setState({
              ...resetState,
              leaderId: null,
              leaderMode: false
            });
          } catch (e) { }
        } else {
          set(state => {
            const updatedMembers = (state.partyMembers || []).filter(m => m.id !== targetUserId);
            return {
              partyMembers: updatedMembers,
              // Push a party event toast so remaining members see who left
              partyEventNotifications: [
                ...state.partyEventNotifications,
                { id: `left-${targetUserId}-${Date.now()}`, type: 'left', memberName: userName || 'A member' }
              ]
            };
          });

          try {
            const partyStore = require('./partyStore').default;
            partyStore.setState(state => {
              const updatedMembers = (state.partyMembers || []).filter(m => m.id !== targetUserId);
              return { partyMembers: updatedMembers };
            });
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

      // Server confirms invitation was sent (with real invitationId for matching)
      socket.on('invitation_sent', ({ invitationId, toUserId }) => {
        console.log('📤 [invitation_sent] Server confirmed invite sent:', { invitationId, toUserId });

        // Update the matching sent invite entry with the real invitationId
        set(state => {
          const updatedInvites = state.sentPartyInvites.map(inv => {
            // Match by targetUserId (most reliable) or by recent timestamp (fallback)
            const isRecent = Date.now() - inv.sentAt < 5000; // Within last 5 seconds
            if (inv.targetUserId === toUserId || (inv.invitationId === null && isRecent)) {
              console.log(`📤 [invitation_sent] Updating invite for ${inv.targetName} with invitationId: ${invitationId}`);
              return { ...inv, invitationId };
            }
            return inv;
          });
          return { sentPartyInvites: updatedInvites };
        });

        // Add toast notification for the sender
        get().addPartyEventNotification('invitation_sent', {
          message: 'Invitation delivered'
        });
      });

      // Party invitation was accepted
      // NOTE: This event ONLY updates the sentPartyInvites list.
      // Notifications are handled by party_invite_accepted handler to prevent duplicates.
      socket.on('party_invitation_accepted', ({ invitationId, userId, userName }) => {
        console.log('✅ Party invitation accepted (list update):', userName, 'userId:', userId, 'invitationId:', invitationId);

        set(state => ({
          pendingPartyInvites: state.pendingPartyInvites.filter(inv => inv.id !== invitationId),
          sentPartyInvites: state.sentPartyInvites.map(inv => {
            const matches = inv.invitationId === invitationId ||
              inv.targetUserId === userId ||
              inv.targetName === userName ||
              inv.targetUserId === userName;
            return matches ? { ...inv, outcome: 'accepted' } : inv;
          })
          // REMOVED: Duplicate toast notification - handled by party_invite_accepted
        }));
      });

      // Party invitation was declined
      socket.on('party_invitation_declined', ({ invitationId, userId, userName }) => {
        console.log('❌ Party invitation declined:', userName, 'invitationId:', invitationId);

        set(state => {
          const updatedInvites = state.sentPartyInvites.map(inv => {
            // Match by invitationId (most reliable) OR userId OR userName
            const matches = inv.invitationId === invitationId ||
              inv.targetUserId === userId ||
              inv.targetName === userName;
            return matches ? { ...inv, outcome: 'declined' } : inv;
          });

          return {
            pendingPartyInvites: state.pendingPartyInvites.filter(inv => inv.id !== invitationId),
            sentPartyInvites: updatedInvites,
            // Push a party event toast
            partyEventNotifications: [
              ...state.partyEventNotifications,
              { id: `decline-${invitationId || Date.now()}`, type: 'declined', memberName: userName }
            ]
          };
        });

        // Show notification in chat
        const chatStore = require('./chatStore').default;
        chatStore.getState().addSocialNotification({
          type: 'party_invitation_declined',
          sender: { name: userName },
          content: `${userName} declined your party invitation`
        });
      });

      // Receiver confirmation - you declined an invite
      socket.on('invitation_declined_confirmed', ({ invitationId }) => {
        console.log('✅ Party invite declined');

        // Show toast notification to the decliner
        get().addPartyEventNotification('you_declined', {
          message: 'You declined the party invitation'
        });
      });

      // Party chat message received from server
      socket.on('global_chat_message', (message) => {
        chatDebug('🌐 [global_chat_message] received', {
          senderId: message.senderId,
          messageId: message.id,
          contentLength: message.content?.length
        });
        get().addGlobalMessage(message);
      });

      socket.on('party_chat_message', (message) => {
        const { partyId, fromId, message: content, timestamp, senderName, fromSocketId } = message;
        
        chatDebug('💬 [party_chat_message] received', {
          partyId,
          fromId,
          fromSocketId,
          senderName,
          contentLength: content?.length
        });

        // Skip messages from self — already optimistically appended by TabbedChat
        // CRITICAL: Use fromSocketId if available to allow cross-tab syncing for the same user
        const { currentUserPresence, socket: activeSocket } = get();

        let currentPlayerId = null;
        try {
          const gameStore = require('./gameStore').default;
          currentPlayerId = gameStore.getState().currentPlayer?.id;
        } catch (e) {}

        const isFromOurSocket = fromSocketId && activeSocket?.id === fromSocketId;
        const isFromOurIdNoSocket = !fromSocketId && (
          fromId === currentUserPresence?.userId || 
          fromId === activeSocket?.id ||
          fromId === currentPlayerId ||
          fromId === 'current-player'
        );

        if (isFromOurSocket || isFromOurIdNoSocket) {
          chatDebug('💬 Skipping self-echo for party message');
          return;
        }

        // Use centralized helper for deduplication and unread count logic
        get().addPartyChatMessage({
          id: message.id || `party_${Date.now()}_${fromId}`,
          messageId: message.messageId || message.id,
          type: 'party',
          senderId: fromId,
          senderName: senderName || 'Unknown',
          senderClass: message.senderClass || 'Unknown',
          senderLevel: message.senderLevel || 1,
          content: content,
          timestamp: timestamp || Date.now()
        });
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
        if (!invitation) return;

        console.log('🎭 GM session invitation received:', {
          partyName: invitation.partyName,
          gmName: invitation.gmName,
          roomId: invitation.roomId,
          invitationId: invitation.id,
          fullInvitation: invitation
        });

        // CRITICAL FIX: Set enteringMultiplayer flag to prevent social party sync
        sessionStorage.setItem('enteringMultiplayer', 'true');

        // CRITICAL FIX: Clear social party members from partyStore to prevent duplicate HUDs
        // When joining the GM's room, we'll get fresh party member data from the room
        try {
          const partyStore = require('./partyStore').default;
          const currentMembers = partyStore.getState().partyMembers || [];
          if (currentMembers.length > 0) {
            console.log('🧹 Clearing social party members on GM session invitation', {
              count: currentMembers.length,
              names: currentMembers.map(m => m.name)
            });
            partyStore.getState().clearPartyMembers();
          }
        } catch (e) {
          console.warn('⚠️ Failed to clear party members on GM session invitation:', e);
        }

        // Set flag to trigger invitation UI
        set({
          gmSessionInvitation: invitation
        });
      });

      socket.on('session_join_request', (request) => {
        if (!request) return;

        console.log('📨 Session join request received:', {
          requesterName: request.requesterName,
          requesterId: request.requesterId,
          roomId: request.roomId,
          requestId: request.id
        });

        set(state => ({
          sessionJoinRequests: [...state.sessionJoinRequests, request]
        }));

        get().addPartyEventNotification('join_request_received', {
          message: `${request.requesterName} wants to join your session`,
          requestId: request.id
        });

        setTimeout(() => {
          const currentRequests = get().sessionJoinRequests;
          const stillExists = currentRequests.some(r => r.id === request.id);
          if (stillExists) {
            set(state => ({
              sessionJoinRequests: state.sessionJoinRequests.filter(r => r.id !== request.id)
            }));
            get().addPartyEventNotification('join_request_expired', {
              message: 'Join request expired'
            });
          }
        }, 60000);
      });

      socket.on('join_request_accepted', (data) => {
        console.log('✅ Join request accepted:', data);

        const { invitation, roomId } = data;

        sessionStorage.setItem('enteringMultiplayer', 'true');

        try {
          const partyStore = require('./partyStore').default;
          const currentMembers = partyStore.getState().partyMembers || [];
          if (currentMembers.length > 0) {
            console.log('🧹 Clearing party members on join request acceptance');
            partyStore.getState().clearPartyMembers();
          }
        } catch (e) {
          console.warn('⚠️ Failed to clear party members:', e);
        }

        set({
          gmSessionInvitation: invitation,
          sentJoinRequests: []
        });

        get().addPartyEventNotification('join_request_accepted', {
          message: 'Your join request was accepted!'
        });
      });

      socket.on('join_request_declined', (data) => {
        console.log('❌ Join request declined:', data);

        set(state => ({
          sentJoinRequests: state.sentJoinRequests.filter(r => r.id !== data.requestId)
        }));

        get().addPartyEventNotification('join_request_declined', {
          message: 'Your join request was declined'
        });
      });

      socket.on('party_invite_failed', (data) => {
        console.error('❌ Party invite failed:', data);

        // Update the sent invite entry as failed
        set(state => ({
          sentPartyInvites: state.sentPartyInvites.map(inv => {
            // Match by targetUserId or recent timestamp
            const isRecent = Date.now() - inv.sentAt < 10000;
            if (inv.targetUserId === data.toUserId || (inv.outcome === null && isRecent)) {
              return { ...inv, outcome: 'failed', error: data.error };
            }
            return inv;
          })
        }));

        // Show toast notification
        get().addPartyEventNotification('invite_failed', {
          message: data.error || 'Failed to invite user'
        });

        const chatStore = require('./chatStore').default;
        chatStore.getState().addSocialNotification({
          type: 'party_invite_failed',
          content: data.error || 'Failed to invite user'
        });
      });

      socket.on('session_invitation_sent', (data) => {
        console.log('✅ Session invitation sent:', data);

        get().addPartyEventNotification('session_invitation_sent', {
          message: 'Session invitation sent'
        });
      });

      socket.on('invite_error', (data) => {
        console.error('❌ Invite error:', data);

        get().addPartyEventNotification('invite_error', {
          message: data.message || 'Failed to send invitation'
        });
      });

      // Whisper message received (for global/presence socket, outside game rooms)
      socket.on('whisper_received', (message) => {
        console.log('💬 Whisper received:', {
          senderId: message.senderId,
          senderName: message.senderName,
          recipientId: message.recipientId,
          recipientName: message.recipientName,
          content: message.content?.substring(0, 30)
        });

        // Add to whisper tab - use senderId as the key for received messages
        get().addWhisperMessage(message.senderId, {
          ...message,
          type: 'whisper_received'
        });
      });

      // Whisper sent confirmation (for global/presence socket)
      socket.on('whisper_sent', (message) => {
        console.log('✅ Whisper sent confirmation:', {
          recipientId: message.recipientId,
          recipientName: message.recipientName,
          content: message.content?.substring(0, 30)
        });

        // Add to whisper tab as sent message - use recipientId as the key
        get().addWhisperMessage(message.recipientId, {
          ...message,
          type: 'whisper_sent'
        });
      });

      // Another user's status changed (for real-time updates in Online Users list)
      socket.on('user_status_changed', ({ userId, status, statusComment }) => {
        console.log('🔄 User status changed:', { userId, status });

        const { onlineUsers, currentUserPresence } = get();

        // Don't update if this is the current user (we already updated locally)
        if (userId === currentUserPresence?.userId) return;

        // Update the user in the onlineUsers map
        const newOnlineUsers = new Map(onlineUsers);
        const user = newOnlineUsers.get(userId);

        if (user) {
          newOnlineUsers.set(userId, {
            ...user,
            status,
            statusComment: statusComment || null,
            lastUpdated: Date.now()
          });
          set({ onlineUsers: newOnlineUsers });
        }
      });
    }

    set({
      socket,
      isConnected: socket?.connected || false,
      _boundSocketId: socket?.id || null
    });
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
   * Stores invitation data and triggers navigation to /multiplayer
   * where MultiplayerApp will complete the join
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

    // Set flag to prevent social party from syncing to partyStore during transition
    sessionStorage.setItem('enteringMultiplayer', 'true');

    // CRITICAL FIX: Store invitation details in sessionStorage for MultiplayerApp to pickup
    // This allows the join to be handled by the multiplayer socket correctly.
    sessionStorage.setItem('pendingGMSessionInvitation', JSON.stringify({
      invitationId: gmSessionInvitation.id,
      roomId: gmSessionInvitation.roomId,
      partyName: gmSessionInvitation.partyName
    }));

    console.log('💾 [presenceStore] Saved pendingGMSessionInvitation to sessionStorage');

    // Set flag to trigger navigation to /multiplayer so MultiplayerApp mounts
    set({
      gmSessionInvitation: null,
      pendingPartyInvites: [], // CRITICAL: Clear regular party invites when joining a GM session
      pendingMultiplayerJoin: {
        roomId: gmSessionInvitation.roomId,
        partyName: gmSessionInvitation.partyName
      }
    });
  },

  /**
   * Clear pending multiplayer join (called after navigation completes)
   */
  clearPendingMultiplayerJoin: () => {
    set({ pendingMultiplayerJoin: null });
  },

  /**
   * Request to join a leader's session
   */
  requestToJoinSession: (leaderId, roomId, requesterId, requesterName) => {
    const { socket } = get();

    if (!socket || !socket.connected) {
      console.error('❌ No socket connection for join request');
      return false;
    }

    console.log('📨 Sending join request to leader:', { leaderId, roomId, requesterId, requesterName });

    const requestId = uuidv4();
    const request = {
      id: requestId,
      leaderId,
      roomId,
      requesterId,
      requesterName,
      createdAt: Date.now()
    };

    set(state => ({
      sentJoinRequests: [...state.sentJoinRequests, request]
    }));

    socket.emit('request_to_join_session', {
      leaderId,
      roomId,
      requesterId,
      requesterName
    });

    return true;
  },

  /**
   * Respond to a session join request (as leader)
   */
  respondToJoinRequest: (requestId, accepted) => {
    const { socket } = get();

    if (!socket || !socket.connected) {
      console.error('❌ No socket connection for join request response');
      return false;
    }

    console.log(`${accepted ? '✅' : '❌'} Responding to join request:`, { requestId, accepted });

    socket.emit('respond_to_join_request', {
      requestId,
      accepted
    });

    set(state => ({
      sessionJoinRequests: state.sessionJoinRequests.filter(r => r.id !== requestId)
    }));

    return true;
  },

  /**
   * Send session invitation to a party member (as leader in session)
   */
  sendSessionInvitation: (memberId, roomId) => {
    const { socket } = get();

    if (!socket || !socket.connected) {
      console.error('❌ No socket connection for session invitation');
      return false;
    }

    console.log('📨 Sending session invitation:', { memberId, roomId });

    socket.emit('invite_member_to_session', {
      memberId,
      roomId
    });

    return true;
  },

  /**
   * Dismiss a session join request
   */
  dismissSessionJoinRequest: (requestId) => {
    set(state => ({
      sessionJoinRequests: state.sessionJoinRequests.filter(r => r.id !== requestId)
    }));
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
   * Add a party event notification toast
   */
  addPartyEventNotification: (type, data) => {
    const notification = {
      id: uuidv4(),
      type,
      ...data,
      timestamp: Date.now()
    };

    set(state => ({
      partyEventNotifications: [...state.partyEventNotifications, notification]
    }));

    // Auto-remove after 6 seconds
    setTimeout(() => {
      get().clearPartyEventNotification(notification.id);
    }, 6000);
  },

  /**
   * Clear a specific party event notification
   */
  clearPartyEventNotification: (id) => {
    set(state => ({
      partyEventNotifications: state.partyEventNotifications.filter(n => n.id !== id)
    }));
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
      set({
        whisperTabs: newTabs,
        activeTab: `whisper_${userId}`,
        isCommunityWindowOpen: true
      });
    } else {
      set({
        activeTab: `whisper_${userId}`,
        isCommunityWindowOpen: true
      });
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

    // Increment unread count if community window is closed or not on this tab
    const { isCommunityWindowOpen } = get();
    if (!isCommunityWindowOpen || activeTab !== `whisper_${resolvedUserId}`) {
      tab.unreadCount++;
    }

    set({ whisperTabs: newTabs });

    // CRITICAL: When a new whisper is received from someone, automatically open the tab 
    // so the user sees it without having to click their name first.
    if (message.type === 'whisper_received' || message.type === 'whisper_sent') {
      const currentActive = get().activeTab;
      const isNewFirstMessage = tab.messages.length === 1;
      
      // Only auto-switch if we aren't currently focused on a GLOBAL or PARTY chat
      // or if it's the very first message in this tab.
      if (!currentActive || currentActive === 'global' || isNewFirstMessage) {
        get().setActiveTab(`whisper_${resolvedUserId}`);
      }
    }

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
    // Resolve sender info if missing or generic
    const onlineUsers = get().getOnlineUsersArray();
    const sender = onlineUsers.find(u => u.userId === message.senderId);
    
    const resolvedMessage = {
      ...message,
      senderName: (message.senderName && message.senderName !== 'PLAYER' && message.senderName !== 'Unknown') 
        ? message.senderName 
        : (sender?.characterName || sender?.accountName || message.playerName || message.senderName || 'Unknown'),
      senderClass: sender?.class || message.senderClass || 'Unknown',
      senderLevel: sender?.level || message.senderLevel || 1
    };

    set(state => {
      const incomingIds = [resolvedMessage?.id, resolvedMessage?.messageId].filter(Boolean);
      const hasId = incomingIds.length > 0;
      const hasDuplicateById = hasId && state.partyChatMessages.some(msg => {
        const existingIds = [msg?.id, msg?.messageId].filter(Boolean);
        return incomingIds.some(inId => existingIds.includes(inId));
      });

      // Signature matching ONLY if no reliable ID is found
      const hasDuplicateBySignature = !hasId && state.partyChatMessages.some(msg =>
        msg.senderId === resolvedMessage.senderId &&
        msg.content === resolvedMessage.content &&
        Math.abs((new Date(msg.timestamp).getTime() || 0) - (new Date(resolvedMessage.timestamp).getTime() || 0)) < 1000
      );

      if (hasDuplicateById || hasDuplicateBySignature) {
        return state;
      }

      // Increment unread count if community window is closed or not on party tab
      const shouldIncrementUnread = !state.isCommunityWindowOpen || state.activeTab !== 'party';

      return {
        partyChatMessages: [...state.partyChatMessages, resolvedMessage].slice(-100),
        partyChatUnreadCount: shouldIncrementUnread
          ? (state.partyChatUnreadCount || 0) + 1
          : state.partyChatUnreadCount
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
   * Clear party chat unread count
   */
  clearPartyChatUnread: () => {
    set({ partyChatUnreadCount: 0 });
  },

  /**
   * Set community window open state
   */
  setCommunityWindowOpen: (isOpen) => {
    set({ isCommunityWindowOpen: isOpen });
  },

  /**
   * Get total unread count for community (whispers + party chat)
   */
  getTotalCommunityUnread: () => {
    const { whisperTabs, partyChatUnreadCount } = get();
    let total = partyChatUnreadCount || 0;
    whisperTabs.forEach(tab => {
      total += tab.unreadCount || 0;
    });
    return total;
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
      partyChatUnreadCount: 0,
      isCommunityWindowOpen: false,
      partyMembers: [],
      pendingInvitations: [],
      pendingPartyInvites: [],
      socket: null,
      isConnected: false,
      presenceUnsubscribe: null
    });
  }
}));

export default usePresenceStore;

