import { getStore } from './storeRegistry';
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
import { tryAcquireCooldown } from '../utils/writeThrottle';
import { isProduction as isProductionBuild } from '../config/env';
import { createSocketReconnectAuth } from '../services/socketReconnectAuth';
import { getBootstrapGateState } from '../persistence/bootstrapPrivacyGate';
import { principalKeyOfAuthState } from '../persistence/handoff/socketPrincipalRetirement';

// Minimum gap between chat sends from one client. Mirrors the server-side
// cooldown documented in firestore.rules.
const CHAT_SEND_COOLDOWN_MS = 750;

const CHAT_DEBUG = process.env.NODE_ENV === 'development' || process.env.REACT_APP_CHAT_DEBUG === 'true';
const chatDebug = (...args) => {
  if (CHAT_DEBUG) {
    console.log(...args);
  }
};

const DEFAULT_SOCIAL_SOCKET_URL = 'https://descension-mythrill.up.railway.app';

// Owned socket subscriptions: detach only the callbacks this store installed,
// never another subsystem's listeners on the same socket.
const ownedSocketHandlers = new WeakMap();

const bindOwnedSocketHandler = (socket, event, handler) => {
  if (!socket || typeof socket.on !== 'function') return handler;
  socket.on(event, handler);
  const entries = ownedSocketHandlers.get(socket);
  if (entries) {
    entries.push({ event, handler });
  } else {
    ownedSocketHandlers.set(socket, [{ event, handler }]);
  }
  return handler;
};

const detachOwnedSocketHandlers = (socket) => {
  if (!socket) return;
  const entries = ownedSocketHandlers.get(socket);
  if (!entries) return;
  for (const { event, handler } of entries) {
    try {
      if (typeof socket.off === 'function') {
        socket.off(event, handler);
      } else if (typeof socket.removeListener === 'function') {
        socket.removeListener(event, handler);
      }
    } catch (e) {
      // Ignore detach errors; the socket is being replaced/closed.
    }
  }
  ownedSocketHandlers.delete(socket);
};

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

// Client-only reconciliation tombstones. They remember authoritative
// removals so a delayed event or response cannot restore obsolete state.
// They never grant server authority and never trigger a rejoin.
const PARTY_TOMBSTONE_TTL_MS = 5 * 60 * 1000;
const PARTY_TOMBSTONE_LIMIT = 200;

const normalizeInvitationIds = (invitationIds, invitationId = null) => {
  const raw = Array.isArray(invitationIds)
    ? invitationIds
    : (invitationIds ? [invitationIds] : []);
  if (typeof invitationId === 'string' && invitationId) {
    raw.push(invitationId);
  }
  return Array.from(new Set(raw.filter((id) => typeof id === 'string' && id.length > 0)));
};

const isSamePartyMemberId = (member, memberId) => Boolean(
  memberId && (member?.id === memberId || member?.userId === memberId)
);

const shouldSyncSocialPartyToPartyStore = () => {
  try {
    const gameStore = getStore('gameStore');
    if (gameStore?.getState?.()?.isInMultiplayer) {
      return false;
    }
  } catch (e) {
    // gameStore may not be registered
  }
  try {
    if (typeof sessionStorage !== 'undefined' &&
      sessionStorage.getItem('enteringMultiplayer') === 'true') {
      return false;
    }
  } catch (e) {
    // sessionStorage may be unavailable
  }
  return true;
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

  // Travel chat state
  travelChatUnreadCount: 0,

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
  _boundSocket: null, // Track the bound socket object across reconnect id changes

  // Event deduplication: Track recently processed events to prevent duplicate notifications
  // when multiple sockets receive the same event
  _processedEvents: new Map(), // Map<eventSignature, timestamp>

  // Reconciliation tombstones for authoritative party removals.
  _revokedPartyInvitationIds: new Map(), // invitationId -> timestamp
  _clearedPartySnapshots: new Map(), // partyId -> authoritative party.updatedAt

  // Helper to check if event was recently processed (within 2 seconds)
  _wasEventRecentlyProcessed: (eventType, ...identifiers) => {
    const key = `${eventType}:${identifiers.filter(Boolean).join(':')}`;
    const state = get();
    const lastProcessed = state._processedEvents.get(key);
    const now = Date.now();

    if (lastProcessed && (now - lastProcessed) < 2000) {
      console.log(`Ã°Å¸â€â€ž [Dedup] Skipping duplicate event: ${key}`);
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

  _prunePartyReconciliationTombstones: () => {
    const now = Date.now();
    const revoked = get()._revokedPartyInvitationIds;
    for (const [invitationId, at] of revoked.entries()) {
      if (!Number.isFinite(at) || now - at > PARTY_TOMBSTONE_TTL_MS) {
        revoked.delete(invitationId);
      }
    }

    const cleared = get()._clearedPartySnapshots;
    const oversized = cleared.size - PARTY_TOMBSTONE_LIMIT;
    if (oversized > 0) {
      const oldest = Array.from(cleared.entries())
        .sort((a, b) => a[1] - b[1])
        .slice(0, oversized);
      oldest.forEach(([partyId]) => cleared.delete(partyId));
    }
  },

  _rememberRevokedPartyInvitations: (invitationIds, invitationId = null) => {
    const ids = normalizeInvitationIds(invitationIds, invitationId);
    if (ids.length === 0) return;

    const now = Date.now();
    const next = new Map(get()._revokedPartyInvitationIds);
    ids.forEach((id) => next.set(id, now));
    for (const [id, at] of next.entries()) {
      if (!Number.isFinite(at) || now - at > PARTY_TOMBSTONE_TTL_MS) {
        next.delete(id);
      }
    }
    set({ _revokedPartyInvitationIds: next });
    get()._prunePartyReconciliationTombstones();
  },

  _rememberClearedPartySnapshot: (partyId, updatedAt) => {
    if (!partyId) return;
    const stamp = Number(updatedAt);
    if (!Number.isFinite(stamp)) {
      // Without an authoritative party.updatedAt there is no safe ordering
      // baseline; do not fabricate one from the local clock.
      return;
    }

    const next = new Map(get()._clearedPartySnapshots);
    const previous = next.get(partyId);
    next.set(partyId, previous == null ? stamp : Math.max(previous, stamp));
    set({ _clearedPartySnapshots: next });
    get()._prunePartyReconciliationTombstones();
  },

  _isPartySnapshotObsolete: (partyData) => {
    if (!partyData || !partyData.id) return false;

    const incomingUpdatedAt = Number(partyData.updatedAt);
    const clearedAt = get()._clearedPartySnapshots.get(partyData.id);
    if (Number.isFinite(clearedAt) &&
      (!Number.isFinite(incomingUpdatedAt) || incomingUpdatedAt <= clearedAt)) {
      return true;
    }

    const current = get().currentParty;
    const currentUpdatedAt = Number(current?.updatedAt);
    if (current && current.id && Number.isFinite(currentUpdatedAt) &&
      Number.isFinite(incomingUpdatedAt) && incomingUpdatedAt < currentUpdatedAt) {
      return true;
    }

    return false;
  },

  _isSocialPartyStoreTarget: () => shouldSyncSocialPartyToPartyStore(),

  // Subscriptions
  presenceUnsubscribe: null,

  /**
   * Set the active chat tab
   */
  setActiveTab: (tabId) => {
    const { partyChatUnreadCount, travelChatUnreadCount } = get();

    const updates = { activeTab: tabId };
    if (tabId === 'party' && partyChatUnreadCount > 0) {
      updates.partyChatUnreadCount = 0;
    }
    if (tabId === 'travel' && travelChatUnreadCount > 0) {
      updates.travelChatUnreadCount = 0;
    }
    set(updates);
  },

  /**
   * Initialize presence tracking for current user
   */
  initializePresence: async (userId, characterData, sessionData = {}, accountName = null, isGuest = false, friendId = null) => {
    await presenceService.setOnline(userId, characterData, { ...sessionData, accountName, isGuest, friendId });

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
   *
   * PERF: The Firestore onSnapshot fires on every field write including heartbeats.
   * Each write comes in two phases (pending local â†’ committed server), which causes
   * the online-user count to flicker 0â†’1â†’0â†’1 while server timestamps settle.
   * We fix this with two guards:
   *   1. Debounce: batch rapid Firestore events into a single update (500 ms window).
   *   2. Change-detection: skip set() if the serialized user list is identical.
   */
  subscribeToOnlineUsers: () => {
    // Idempotent: unsubscribe any previous listener before creating a new one.
    // Previously the new unsubscribe simply overwrote the stored one, leaking
    // every earlier full-collection presence listener.
    const existingUnsubscribe = get().presenceUnsubscribe;
    if (existingUnsubscribe) {
      existingUnsubscribe();
      set({ presenceUnsubscribe: null });
    }

    let debounceTimer = null;
    let lastSnapshot = ''; // Serialized key for change detection

    const unsubscribe = presenceService.subscribeToOnlineUsers((users) => {
      // Debounce: wait until Firestore stops firing for 500 ms before updating state
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        debounceTimer = null;

        const usersMap = new Map();
        users.forEach(user => {
          usersMap.set(user.userId, user);
        });

        // Always include current user in the map to ensure visibility
        const { currentUserPresence } = get();
        if (currentUserPresence && currentUserPresence.userId) {
          usersMap.set(currentUserPresence.userId, currentUserPresence);
        }

        // Change-detection: build a cheap fingerprint of userId+status pairs.
        // Skip the state update (and the re-render cascade) if nothing changed.
        const fingerprint = Array.from(usersMap.entries())
          .map(([id, u]) => `${id}:${u.status}`)
          .sort()
          .join('|');

        if (fingerprint === lastSnapshot) return;
        lastSnapshot = fingerprint;

        set({ onlineUsers: usersMap });
      }, 500);
    });

    const wrappedUnsubscribe = () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
        debounceTimer = null;
      }
      unsubscribe();
    };

    set({ presenceUnsubscribe: wrappedUnsubscribe });
    return wrappedUnsubscribe;
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

    if (get()._isPartySnapshotObsolete(partyData)) {
      console.log('Ignoring obsolete party snapshot', {
        partyId: partyData.id,
        updatedAt: partyData.updatedAt
      });
      return;
    }

    const previousParty = get().currentParty;
    const previousPartyId = previousParty?.id;
    const isPartyChange = Boolean(previousPartyId && previousPartyId !== partyData.id);
    if (isPartyChange) {
      // Remember the party this client is leaving so a delayed snapshot or
      // chat delivery for it cannot replace/pollute the new party.
      get()._rememberClearedPartySnapshot(previousPartyId, previousParty?.updatedAt);
    }

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
      partyMembers: enrichedMembers,
      // Party chat belongs to the party that produced it. A switch must not
      // carry the old party's conversation into the new party.
      ...(isPartyChange ? { partyChatMessages: [], partyChatUnreadCount: 0 } : {})
    }));

    // A newer authoritative snapshot for this party supersedes the removal
    // tombstone (for example, a fresh invitation was accepted after removal).
    if (get()._clearedPartySnapshots.has(partyData.id)) {
      const nextCleared = new Map(get()._clearedPartySnapshots);
      nextCleared.delete(partyData.id);
      set({ _clearedPartySnapshots: nextCleared });
    }

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
      if (get()._isSocialPartyStoreTarget()) {
        const partyStore = getStore('partyStore');
        partyStore.setState({
          currentParty: partyData,
          isInParty: true,
          partyMembers: enrichedMembers,
          leaderId: partyData.leaderId || null,
          ...(isPartyChange ? { partyChatMessages: [] } : {})
        });
      }
    } catch (e) {
      console.warn('Ã¢Å¡Â Ã¯Â¸Â Failed to sync party update to partyStore:', e);
    }
  },

  updateStatus: async (status, statusComment = null) => {
    const { currentUserPresence, onlineUsers } = get();

    if (!currentUserPresence) {
      console.error('Ã¢ÂÅ’ No currentUserPresence found!');
      return false;
    }

    // Try to update in Firebase (will fail gracefully if not configured)
    await presenceService.updateStatus(
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
      console.warn('Ã¢Å¡Â Ã¯Â¸Â User not found in onlineUsers map, adding them now');
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
      chatDebug('Ã°Å¸Å’Â [sendGlobalMessage] blocked - no presence');
      return false;
    }

    // Current user is required above; this keeps identity deterministic for routing/UI anchors
    const senderData = currentUserPresence;

    // Client-side rate limit: block rapid-fire sends before any local append
    // or socket emit happens.
    if (!tryAcquireCooldown(`chat-send:${senderData.userId || 'anon'}`, CHAT_SEND_COOLDOWN_MS)) {
      chatDebug('â³ [sendGlobalMessage] blocked by cooldown');
      return false;
    }

    // Resolve a stable sender id for multiplayer + local fallback modes
    let fallbackPlayerId = null;
    try {
      const gameState = getStore('gameStore').getState();
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
      const gameState = getStore('gameStore').getState();
      fallbackGameSocket = gameState?.multiplayerSocket || null;
    } catch (e) {
      // gameStore unavailable in this context
    }

    const activeSocket = (socket && socket.connected)
      ? socket
      : (fallbackGameSocket && fallbackGameSocket.connected ? fallbackGameSocket : null);

    // Emit to server for party members when connected; keep local optimistic append either way
    if (activeSocket) {
      chatDebug('Ã°Å¸Å’Â [sendGlobalMessage] emit', {
        socketId: activeSocket.id,
        senderId,
        messageId,
        contentLength: message.content.length
      });
      activeSocket.emit('global_chat_message', message);
    } else {
      console.warn('Ã¢Å¡Â Ã¯Â¸Â Global chat sent locally only (no active multiplayer socket)');
      chatDebug('Ã°Å¸Å’Â [sendGlobalMessage] no-active-socket', {
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

    // Client-side rate limit shared with global chat sends.
    if (!tryAcquireCooldown(`chat-send:${currentUserPresence.userId || 'anon'}`, CHAT_SEND_COOLDOWN_MS)) {
      chatDebug('â³ [sendWhisper] blocked by cooldown');
      return false;
    }

    // Check if target is a known presence user
    const targetUser = onlineUsers.get(targetUserId);

    // Resolve game state synchronously so message payload is complete before emitting
    let gameStoreState = null;
    let currentPlayer = null;
    let multiplayerSocket = null;
    try {
      gameStoreState = getStore('gameStore').getState();
      currentPlayer = gameStoreState?.currentPlayer || null;
      multiplayerSocket = gameStoreState?.multiplayerSocket || null;
    } catch (e) {
      // gameStore not available, continue with presence/socket data
    }

    // Resolve party state once for identity normalization
    let partyState = null;
    let partyMembers = [];
    try {
      const partyStore = getStore('partyStore');
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

    console.log('Ã°Å¸â€œÂ¤ Sending whisper:', {
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
        detachOwnedSocketHandlers(socket);
        socket.disconnect();
      } catch (e) {
        // Ignore cleanup errors
      }
      set({ socket: null, isConnected: false });
    }

    const socketUrlCandidates = getSocketUrlCandidates();
    if (socketUrlCandidates.length === 0) {
      console.error('Ã¢ÂÅ’ No socket URL candidates configured for social socket');
      return null;
    }

    let [primarySocketUrl, ...fallbackSocketUrls] = socketUrlCandidates;
    let fallbackAttempted = false;

    // Wave A (P5/S4): capture the exact principal and account generation before
    // any await. A token that resolves after logout / account switch belongs to
    // the OLD principal and must never open a socket for the new one.
    const readAuthState = () => getStore('authStore')?.getState?.() || {};
    // Fail closed: without a registered auth store there is no principal to bind
    // a socket to, so never open one (and never fall back to a tokenless guest).
    if (typeof getStore('authStore')?.getState !== 'function') {
      console.warn('ðŸ” [Auth] Auth store unavailable - not opening global socket');
      return null;
    }
    const principalAtStart = principalKeyOfAuthState(readAuthState());
    const generationAtStart = getBootstrapGateState().accountGeneration;
    const setupValid = () =>
      principalKeyOfAuthState(readAuthState()) === principalAtStart &&
      getBootstrapGateState().accountGeneration === generationAtStart;

    // Get auth token. Unverified dev tokens exist for local development only
    // (the server rejects them in production). A production guest has no
    // verifiable token and connects tokenless, which the server admits as a guest.
    let authToken = null;
    const allowDevToken = !isProductionBuild();
    // One token selection for the first handshake and every reconnect.
    const selectPresenceToken = async (authState) => {
      if (authState.user && !authState.isDevelopmentBypass && !authState.user.isGuest && typeof authState.user.getIdToken === 'function') {
        return authState.user.getIdToken();
      } else if (allowDevToken && authState.user && !authState.user?.isGuest) {
        return `dev-token-${authState.user.uid || 'admin-dev-user'}`;
      } else if (allowDevToken && !authState.user?.isGuest && (authState.isDevelopmentBypass || authState.isAdminBypass || authState.isAuthenticated)) {
        return `dev-token-${authState.user?.uid || 'admin-dev-user'}`;
      }
      return null;
    };
    try {
      authToken = await selectPresenceToken(readAuthState());
    } catch (error) {
      console.warn('Could not get auth token for global socket:', error);
    }

    if (!setupValid()) {
      console.warn('ðŸ” [Auth] Principal/generation changed during global socket setup - aborting connection');
      return null;
    }

    const socketOptions = {
      // Per-attempt handshake: a reconnect after ID-token expiry asks this same
      // principal/generation for a current token; otherwise, or on failure, it
      // settles once with this setup's own last token (see socketReconnectAuth).
      auth: createSocketReconnectAuth({
        initialToken: authToken,
        isCurrent: setupValid,
        resolveToken: () => selectPresenceToken(readAuthState())
      }),
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 5000
    };

    const wireConnectionHandlers = (activeSocket, socketUrl) => {
      // Handle (re)connection - re-register presence
      bindOwnedSocketHandler(activeSocket, 'connect', () => {
        console.log('Ã°Å¸â€Å’ Socket connected:', activeSocket.id, 'url:', socketUrl);
        get().setConnected(true);

        // Re-register presence on (re)connection
        const { currentUserPresence } = get();
        if (currentUserPresence) {
          console.log('Ã°Å¸â€œÂ Re-registering presence on connect for:', currentUserPresence.userId);
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

      bindOwnedSocketHandler(activeSocket, 'connect_error', (error) => {
        console.error('Ã¢ÂÅ’ Socket connection error:', error);
        get().setConnected(false);

        // Development fallback: if localhost is unreachable, retry once against production social server
        if (!fallbackAttempted && fallbackSocketUrls.length > 0) {
          const fallbackUrl = fallbackSocketUrls.shift();
          fallbackAttempted = true;

          console.warn(`Ã¢Å¡Â Ã¯Â¸Â Primary social socket unavailable (${socketUrl}). Retrying with fallback: ${fallbackUrl}`);

          try {
            detachOwnedSocketHandlers(activeSocket);
            activeSocket.disconnect();
          } catch (e) {
            // Ignore cleanup errors
          }

          set({ socket: null, isConnected: false });
          // The captured token belongs to the principal at setup time; never reuse it for another.
          if (!setupValid()) return;
          createSocket(fallbackUrl);
        }
      });

      bindOwnedSocketHandler(activeSocket, 'connect_timeout', () => {
        console.error('Ã¢ÂÅ’ Socket connection timeout');
        get().setConnected(false);
      });

      bindOwnedSocketHandler(activeSocket, 'error', (error) => {
        console.error('Ã¢ÂÅ’ Socket error:', error);
      });
    };

    const createSocket = (socketUrl) => {
      console.log('Ã°Å¸â€Å’ Initializing global socket at:', socketUrl);
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

    console.log(`Ã°Å¸â€œÂ¢ [presenceStore] sendPartyInvite called for target: ${targetUserId} (${targetPlayerName})`);

    let activeSocket = socket;
    if (!activeSocket || !activeSocket.connected) {
      try {
        const gameSocket = getStore('gameStore').getState()?.multiplayerSocket;
        if (gameSocket && gameSocket.connected) {
          activeSocket = gameSocket;
          console.log('Ã°Å¸â€œÂ¢ [presenceStore] Using game multiplayer socket as fallback');
        }
      } catch (e) {
        // gameStore might not be available
      }
    }

    if (!currentUserPresence || !activeSocket || !activeSocket.connected) {
      console.warn('Ã¢Å¡Â Ã¯Â¸Â Cannot send party invite: social socket is not connected', { currentUserPresence: !!currentUserPresence, socket: !!activeSocket, connected: activeSocket?.connected });
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

    console.log('Ã°Å¸â€œÂ¢ [presenceStore] Adding sentInviteEntry to state:', sentInviteEntry);
    set(state => ({
      sentPartyInvites: [...state.sentPartyInvites, sentInviteEntry]
    }));

    // Do not send partyStore.currentParty.id here: room entry stores the room
    // id in currentParty for the room HUD, and that display id is not a social
    // party id. The server derives the inviter's current social party from
    // userToParty, so the client sends no party hint.
    console.log('ï¿½ï¿½ï¿½ï¿½ï¿½?oï¿½ï¿½ [presenceStore] Emitting invite_to_party to server...', { partyId: null, toUserId: targetUserId });
    activeSocket.emit('invite_to_party', {
      partyId: null,
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
        const gameSocket = getStore('gameStore').getState()?.multiplayerSocket;
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
        inv => inv.id !== inviteId && inv.invitationId !== inviteId
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

    // The same live socket object can reconnect with a new id. Re-binding its
    // handlers would duplicate every party subscription, so track the object
    // as well as the id.
    if (socket && get()._boundSocket === socket) {
      set({ _boundSocketId: socket.id || null });
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

    // CRITICAL FIX: Track bound socket ID to prevent duplicate listener registration
    // If same socket is passed again, don't re-bind listeners
    const boundSocketId = get()._boundSocketId;
    if (socket && socket.id && boundSocketId === socket.id) {
      set({ _boundSocket: socket });
      console.log('Ã¢ÂÂ­Ã¯Â¸Â [setSocket] Socket already bound, skipping listener setup');
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
        const gameStore = getStore('gameStore');
        isInMultiplayer = gameStore.getState().isInMultiplayer;
      } catch (e) {
        // gameStore might not be available
      }

      const isEnteringMultiplayer = typeof sessionStorage !== 'undefined' &&
        sessionStorage.getItem('enteringMultiplayer') === 'true';

      if (isInMultiplayer || isEnteringMultiplayer) {
        console.log('Ã¢ÂÂ­Ã¯Â¸Â [setSocket] Skipping socket disconnect - in multiplayer mode');
        // Still remove listeners from old socket to prevent duplicates
        detachOwnedSocketHandlers(existingSocket);
      } else {
        console.log('Ã°Å¸Â§Â¹ [setSocket] Cleaning up previous socket before setting new one');
        detachOwnedSocketHandlers(existingSocket);
        if (existingSocket.connected) {
          try {
            existingSocket.disconnect();
          } catch (e) {
            // Ignore cleanup errors
          }
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
      bindOwnedSocketHandler(socket, 'party_created', (payload) => {
        const partyData = payload.party || payload;
        console.log('Ã°Å¸Å½â€° Party created:', partyData.name);

        // Add system message if not in multiplayer
        try {
          const chatStore = getStore('chatStore');
          chatStore.getState().addSocialNotification({
            type: 'party_created',
            sender: { name: 'Party System' },
            content: `Party "${partyData.name || 'New Party'}" has been created.`
          });
        } catch (e) { }

        // Don't overwrite room party if we're in a multiplayer room
        try {
          const gameStore = getStore('gameStore');
          const isInMultiplayerRoom = gameStore.getState().isInMultiplayer;
          const isEnteringMultiplayer = sessionStorage.getItem('enteringMultiplayer') === 'true';

          if (isInMultiplayerRoom || isEnteringMultiplayer) {
            console.log('Ã¢ÂÂ­Ã¯Â¸Â Skipping party_created sync - in multiplayer room');
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
      bindOwnedSocketHandler(socket, 'party_joined', (payload) => {
        const partyData = payload.party || payload;
        if (!partyData) return;
        console.log('Ã°Å¸â€â€ž Party joined:', partyData.name || partyData.id);

        // Update party state - notification will be shown by party_join_confirmed
        // This prevents duplicate notifications since both events fire on join
        get().handlePartyUpdate(partyData);
      });

      // A member joined the party
      bindOwnedSocketHandler(socket, 'party_member_joined', (payload) => {
        // SAFEGUARD: Ensure payload exists
        if (!payload) return;

        const partyId = payload.partyId || (payload.party?.id);
        const memberId = payload.memberId || payload.member?.id;
        const memberData = payload.memberData || payload.member;

        if (!memberData) {
          console.warn('Ã¢Å¡Â Ã¯Â¸Â Received party_member_joined with missing memberData:', payload);
          return;
        }

        const localPartyId = get().currentParty?.id;
        if (localPartyId && partyId && localPartyId !== partyId) {
          console.log('Ignoring party_member_joined for a different party', { partyId, localPartyId });
          return;
        }

        // DEDUPLICATION: Skip if this event was recently processed
        if (get()._wasEventRecentlyProcessed('party_member_joined', partyId, memberId || memberData.id)) {
          return;
        }

        console.log(`Ã°Å¸â€˜Â¤ Party member joined: ${memberData.name} (Member ID: ${memberId || memberData.id}) to party: ${partyId}`);

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
          console.log(`Ã°Å¸â€œÅ  Updating presenceStore members count: ${existingMembers.length} -> ${updatedMembers.length}`);
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
            console.log(`Ã°Å¸â€˜Â¤ [Dedup] Skipping "joined" toast for ${memberData.name} - already shown "accepted" toast.`);
          }
        } else {
          console.log('Ã¢â€žÂ¹Ã¯Â¸Â Member already exists in presenceStore');
        }

        // Sync to partyStore REGARDLESS of whether they were in presenceStore already,
        // but ONLY if not in multiplayer mode AND not entering multiplayer.
        // This ensures they show up in the specific "Your Party" UI.
        try {
          const gameStore = getStore('gameStore');
          const isInMultiplayerRoom = gameStore.getState().isInMultiplayer;
          const isEnteringMultiplayer = sessionStorage.getItem('enteringMultiplayer') === 'true';

          if (!isInMultiplayerRoom && !isEnteringMultiplayer) {
            const partyStore = getStore('partyStore');
            const partyState = partyStore.getState();

            // Deduplicate within partyStore specifically
            const inPartyStore = partyState.partyMembers.some(m =>
              (m.id === memberId || m.id === memberData.id || m.userId === memberId || m.userId === memberData.id)
            );

            if (!inPartyStore) {
              console.log(`Ã°Å¸â€œÅ  Syncing ${memberData.name} to partyStore.`);
              partyStore.getState().addPartyMember(enrichedMemberData);
            } else {
              console.log(`Ã¢â€žÂ¹Ã¯Â¸Â ${memberData.name} already exists in partyStore`);
            }
          } else {
            console.log('Ã¢â€žÂ¹Ã¯Â¸Â Skipping partyStore sync - in multiplayer room or entering multiplayer');
          }
        } catch (e) {
          console.warn('Ã¢Å¡Â Ã¯Â¸Â Failed to sync join to partyStore:', e);
        }

        // Add system message to party chat
        try {
          const chatStore = getStore('chatStore');
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
      bindOwnedSocketHandler(socket, 'party_invite_accepted', ({ partyId, memberId, memberName, memberData }) => {
        // DEDUPLICATION: Skip if this event was recently processed
        if (get()._wasEventRecentlyProcessed('party_invite_accepted', partyId, memberId || memberName)) {
          return;
        }

        console.log(`âœ… Your party invite was accepted by: ${memberName}`);

        // Show "accepted your invite" toast to the inviter
        get().addPartyEventNotification('accepted', {
          memberName: memberName,
          message: `${memberName} accepted your party invite`
        });

        // Add to chat notifications
        try {
          const chatStore = getStore('chatStore');
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
      bindOwnedSocketHandler(socket, 'party_join_confirmed', ({ partyId, partyName, memberCount }) => {
        const localPartyId = get().currentParty?.id;
        if (partyId && get()._clearedPartySnapshots.has(partyId)) return;
        if (partyId && localPartyId && partyId !== localPartyId) return;

        // DEDUPLICATION: Skip if this event was recently processed
        if (get()._wasEventRecentlyProcessed('party_join_confirmed', partyId)) {
          return;
        }

        console.log(`âœ… You joined party: ${partyName || partyId}`);

        // Show toast notification to the receiver
        get().addPartyEventNotification('you_joined', {
          partyName: partyName,
          message: partyName
            ? `You joined "${partyName}"`
            : 'You joined the party!'
        });

        // Add to chat notifications
        try {
          const chatStore = getStore('chatStore');
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
      bindOwnedSocketHandler(socket, 'party_member_left', ({ partyId, memberId, userName, memberName } = {}) => {
        const displayName = userName || memberName || 'Unknown';
        const localPartyId = get().currentParty?.id;
        if (localPartyId && partyId && localPartyId !== partyId) {
          console.log('Ignoring party_member_left for a different party', { partyId, localPartyId });
          return;
        }

        console.log('Ã°Å¸â€˜Â¤ Party member left:', displayName);

        set(state => ({
          partyMembers: (state.partyMembers || []).filter(m => !isSamePartyMemberId(m, memberId))
        }));

        // Sync to partyStore only when it currently represents the social
        // party, never the multiplayer room roster.
        try {
          if (get()._isSocialPartyStoreTarget()) {
            const partyStore = getStore('partyStore');
            const storePartyId = partyStore.getState()?.currentParty?.id;
            if (!storePartyId || !partyId || storePartyId === partyId) {
              partyStore.setState(state => ({
                partyMembers: (state.partyMembers || []).filter(m => !isSamePartyMemberId(m, memberId))
              }));
            }
          }
        } catch (e) {
          // partyStore not available
        }

        // Add system message to party chat
        try {
          const chatStore = getStore('chatStore');
          chatStore.getState().addSocialNotification({
            type: 'party_member_left',
            sender: { name: displayName },
            content: `${displayName} left the party.`
          });
        } catch (e) {
          // chatStore not available
        }
      });

      // Party leadership changed (when leader leaves)
      bindOwnedSocketHandler(socket, 'party_leader_changed', ({ partyId, newLeaderId, newLeaderName }) => {
        const localPartyId = get().currentParty?.id;
        if (partyId && (partyId !== localPartyId || get()._clearedPartySnapshots.has(partyId))) {
          return;
        }

        console.log('Ã°Å¸â€˜â€˜ Party leadership changed:', newLeaderName);

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
          const partyStore = getStore('partyStore');
          partyStore.setState(state => ({
            ...updater(state),
            leaderId: newLeaderId
          }));
        } catch (e) {
          // partyStore not available
        }
      });

      // Party now has only one member (offer to disband) - LEGACY: Now auto-disbanded
      bindOwnedSocketHandler(socket, 'party_single_member', ({ partyId, partyName, message }) => {
        console.log('Ã°Å¸â€˜Â¤ You are now the only party member');

        // Show notification
        try {
          const chatStore = getStore('chatStore');
          chatStore.getState().addSocialNotification({
            type: 'party_update',
            sender: { name: 'Party System' },
            content: message || 'You are now the only member of this party. Consider disbanding if you no longer need it.'
          });
        } catch (e) {
          // chatStore not available
        }
      });

      // Apply an authoritative social-party reset. The caller is responsible
      // for confirming that the event targets the locally displayed party.
      const applySocialPartyReset = ({ partyId = null, updatedAt = null } = {}) => {
        get()._rememberClearedPartySnapshot(partyId, updatedAt);

        const resetState = {
          currentParty: null,
          isInParty: false,
          partyMembers: [],
          partyChatMessages: []
        };

        set(resetState);

        // Clear party from Firestore presence
        const { currentUserPresence } = get();
        if (currentUserPresence) {
          presenceService.updateSession(currentUserPresence.userId, {
            partyId: null,
            partyName: null
          });
        }

        // The multiplayer room roster is not the social party. Never let a
        // social removal event clear the room HUD.
        try {
          if (get()._isSocialPartyStoreTarget()) {
            const partyStore = getStore('partyStore');
            partyStore.setState({ ...resetState, leaderId: null, leaderMode: false });
          }
        } catch (e) {
          // partyStore not available
        }
      };

      // Party auto-disbanded (only 1 member remaining)
      bindOwnedSocketHandler(socket, 'party_auto_disbanded', ({ partyId, partyName, message } = {}) => {
        const localPartyId = get().currentParty?.id;
        if (localPartyId && partyId && localPartyId !== partyId) {
          console.log('Ignoring stale party_auto_disbanded for a different party', {
            partyId,
            localPartyId
          });
          return;
        }

        console.log('Ã°Å¸â€™Â¥ Party auto-disbanded:', partyName);

        // Show notification
        try {
          const chatStore = getStore('chatStore');
          chatStore.getState().addSocialNotification({
            type: 'party_disbanded',
            sender: { name: 'Party System' },
            content: message || `${partyName} has been disbanded - all other members have left.`
          });
        } catch (e) {
          // chatStore not available
        }

        applySocialPartyReset({
          partyId: partyId || localPartyId,
          updatedAt: get().currentParty?.updatedAt
        });
      });

      // Party was disbanded
      bindOwnedSocketHandler(socket, 'party_disbanded', ({ partyId, partyName, disbandedBy, updatedAt } = {}) => {
        const localPartyId = get().currentParty?.id;
        if (localPartyId && partyId && localPartyId !== partyId) {
          // A delayed disband of a party this client already left must not
          // clear the current party.
          get()._rememberClearedPartySnapshot(partyId, updatedAt);
          return;
        }

        console.log('Ã°Å¸â€™Â¥ Party disbanded:', partyName);

        // Add system message if not in multiplayer
        try {
          const chatStore = getStore('chatStore');
          chatStore.getState().addSocialNotification({
            type: 'party_disbanded',
            sender: { name: 'Party System' },
            content: `The party "${partyName || 'Game Session'}" has been disbanded.`
          });
        } catch (e) { }

        applySocialPartyReset({
          partyId: partyId || localPartyId,
          updatedAt: Number.isFinite(Number(updatedAt))
            ? Number(updatedAt)
            : get().currentParty?.updatedAt
        });
      });

      // Party was left (user perspective)
      bindOwnedSocketHandler(socket, 'party_left', ({ partyId, updatedAt, reason } = {}) => {
        const localPartyId = get().currentParty?.id;
        if (localPartyId && partyId && localPartyId !== partyId) {
          // Another socket switched parties before this client processed the
          // old switch event. Record the removal and keep the newer party.
          get()._rememberClearedPartySnapshot(partyId, updatedAt);
          return;
        }

        console.log('Ã°Å¸â€˜Â¤ Left party:', partyId || localPartyId);

        // Add a system message unless this is reconnect state sync.
        if (reason !== 'reconnect_sync') {
          try {
            const chatStore = getStore('chatStore');
            chatStore.getState().addSocialNotification({
              type: 'party_left',
              sender: { name: 'Party System' },
              content: `You have left the party.`
            });
          } catch (e) { }
        }

        applySocialPartyReset({
          partyId: partyId || localPartyId,
          updatedAt: Number.isFinite(Number(updatedAt))
            ? Number(updatedAt)
            : get().currentParty?.updatedAt
        });
      });

      // Party was updated (also handled by party_joined)
      bindOwnedSocketHandler(socket, 'party_updated', (payload) => {
        if (!payload) return;
        const partyData = payload.party || payload;
        console.log('Ã°Å¸â€â€ž Party updated:', partyData.name);
        get().handlePartyUpdate(partyData);
      });

      // Member removed from party (kick or self-leave via server).
      // The server emits `removed_from_party` to the removed user and
      // `party_member_removed` to the rest, so normalize both here.
      const handleMemberRemoved = ({
        partyId,
        targetUserId,
        userName,
        memberId,
        invitationIds,
        invitationId,
        updatedAt,
        __self = false
      } = {}) => {
        const removedId = targetUserId || memberId;
        const exactInvitationIds = normalizeInvitationIds(invitationIds, invitationId);

        if (exactInvitationIds.length > 0) {
          get()._rememberRevokedPartyInvitations(exactInvitationIds);
          const idSet = new Set(exactInvitationIds);
          const removeRevokedInvites = (list) => (list || []).filter((inv) =>
            !idSet.has(inv?.id) && !idSet.has(inv?.invitationId)
          );

          set(state => ({
            pendingPartyInvites: removeRevokedInvites(state.pendingPartyInvites)
          }));

          try {
            const partyStore = getStore('partyStore');
            partyStore.setState(state => ({
              pendingPartyInvites: removeRevokedInvites(state.pendingPartyInvites)
            }));
          } catch (e) {
            // partyStore not available
          }
        }

        console.log('Ã°Å¸â€˜Â¤ Member removed from party:', userName || removedId);

        const isSelf = __self || (
          removedId != null && get().currentUserPresence?.userId === removedId
        );
        const localPartyId = get().currentParty?.id;
        const eventPartyId = partyId || null;
        const targetsLocalParty = !localPartyId || !eventPartyId || localPartyId === eventPartyId;

        if (!targetsLocalParty) {
          // A delayed removal from a party this client already left must not
          // clear the party the account has since joined.
          console.log('Ignoring stale party removal for a different party', {
            partyId: eventPartyId,
            localPartyId
          });
          return;
        }

        if (isSelf) {
          const baselineUpdatedAt = Number.isFinite(Number(updatedAt))
            ? Number(updatedAt)
            : get().currentParty?.updatedAt;

          try {
            const chatStore = getStore('chatStore');
            chatStore.getState().addSocialNotification({
              type: 'party_member_removed',
              sender: { name: 'Party System' },
              content: `You have been removed from the party.`
            });
          } catch (e) { }

          applySocialPartyReset({
            partyId: eventPartyId || localPartyId,
            updatedAt: baselineUpdatedAt
          });
          return;
        }

        set(state => {
          const updatedMembers = (state.partyMembers || [])
            .filter(m => !isSamePartyMemberId(m, removedId));
          return {
            partyMembers: updatedMembers,
            // Push a party event toast so remaining members see who left
            partyEventNotifications: [
              ...state.partyEventNotifications,
              { id: `left-${removedId}-${Date.now()}`, type: 'left', memberName: userName || 'A member' }
            ]
          };
        });

        // Never mutate the multiplayer room roster from a social-party event.
        try {
          if (get()._isSocialPartyStoreTarget()) {
            const partyStore = getStore('partyStore');
            const storePartyId = partyStore.getState()?.currentParty?.id;
            if (!storePartyId || !eventPartyId || storePartyId === eventPartyId) {
              partyStore.setState(state => {
                const updatedMembers = (state.partyMembers || [])
                  .filter(m => !isSamePartyMemberId(m, removedId));
                return { partyMembers: updatedMembers };
              });
            }
          }
        } catch (e) { }
      };

      bindOwnedSocketHandler(socket, 'removed_from_party', (data) => handleMemberRemoved({ ...data, __self: true }));
      bindOwnedSocketHandler(socket, 'party_member_removed', (data) => handleMemberRemoved({ ...data, targetUserId: data.memberId }));

      // Party invitation received
      bindOwnedSocketHandler(socket, 'party_invitation_received', (invitation) => {
        if (!invitation) return;
        const incomingInvitationId = invitation.id || invitation.invitationId;
        if (!incomingInvitationId) return;

        if (get()._revokedPartyInvitationIds.has(incomingInvitationId)) {
          console.log('Ignoring delivery of a revoked party invitation', {
            invitationId: incomingInvitationId
          });
          return;
        }

        const alreadyPending = (get().pendingPartyInvites || []).some((inv) =>
          (inv?.id || inv?.invitationId) === incomingInvitationId
        );
        if (alreadyPending) return;

        console.log('Ã°Å¸â€œÂ© Party invitation received:', invitation.partyName || 'New Party');

        set(state => ({
          pendingPartyInvites: [...state.pendingPartyInvites, invitation]
        }));

        // Show notification
        const chatStore = getStore('chatStore');
        chatStore.getState().addSocialNotification({
          type: 'party_invitation_received',
          sender: { name: invitation.fromUserName },
          content: `${invitation.fromUserName} has invited you to join their party${invitation.partyName ? ` "${invitation.partyName}"` : ""}.`
        });
      });

      // A pending party invitation was revoked (for example the party leader
      // removed a pending invitee, or the invitee's membership was removed).
      // Only the exact invitation identities supplied by the server are
      // cleared; unrelated notices stay untouched.
      bindOwnedSocketHandler(socket, 'party_invitation_revoked', (payload = {}) => {
        const { partyId, invitationType, invitationIds, invitationId } = payload;
        if (invitationType && invitationType !== 'party') return;

        const exactInvitationIds = normalizeInvitationIds(invitationIds, invitationId);
        if (exactInvitationIds.length === 0) {
          console.warn('party_invitation_revoked had no exact invitation identity; notice left in place', {
            partyId
          });
          return;
        }

        get()._rememberRevokedPartyInvitations(exactInvitationIds);
        const idSet = new Set(exactInvitationIds);
        const removeRevokedInvites = (list) => (list || []).filter((inv) =>
          !idSet.has(inv?.id) && !idSet.has(inv?.invitationId)
        );

        set(state => ({
          pendingPartyInvites: removeRevokedInvites(state.pendingPartyInvites)
        }));

        try {
          const partyStore = getStore('partyStore');
          partyStore.setState(state => ({
            pendingPartyInvites: removeRevokedInvites(state.pendingPartyInvites)
          }));
        } catch (e) {
          // partyStore not available
        }
      });

      // Server confirms invitation was sent (with real invitationId for matching)
      bindOwnedSocketHandler(socket, 'invitation_sent', ({ invitationId, toUserId }) => {
        console.log('Ã°Å¸â€œÂ¤ [invitation_sent] Server confirmed invite sent:', { invitationId, toUserId });

        // Update the matching sent invite entry with the real invitationId
        set(state => {
          const updatedInvites = state.sentPartyInvites.map(inv => {
            // Match by targetUserId (most reliable) or by recent timestamp (fallback)
            const isRecent = Date.now() - inv.sentAt < 5000; // Within last 5 seconds
            if (inv.targetUserId === toUserId || (inv.invitationId === null && isRecent)) {
              console.log(`Ã°Å¸â€œÂ¤ [invitation_sent] Updating invite for ${inv.targetName} with invitationId: ${invitationId}`);
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
      bindOwnedSocketHandler(socket, 'party_invitation_accepted', ({ invitationId, userId, userName }) => {
        console.log('âœ… Party invitation accepted (list update):', userName, 'userId:', userId, 'invitationId:', invitationId);

        set(state => ({
          pendingPartyInvites: state.pendingPartyInvites.filter(inv =>
            inv.id !== invitationId && inv.invitationId !== invitationId
          ),
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
      bindOwnedSocketHandler(socket, 'party_invitation_declined', ({ invitationId, userId, userName }) => {
        console.log('Ã¢ÂÅ’ Party invitation declined:', userName, 'invitationId:', invitationId);

        set(state => {
          const updatedInvites = state.sentPartyInvites.map(inv => {
            // Match by invitationId (most reliable) OR userId OR userName
            const matches = inv.invitationId === invitationId ||
              inv.targetUserId === userId ||
              inv.targetName === userName;
            return matches ? { ...inv, outcome: 'declined' } : inv;
          });

          return {
            pendingPartyInvites: state.pendingPartyInvites.filter(inv =>
              inv.id !== invitationId && inv.invitationId !== invitationId
            ),
            sentPartyInvites: updatedInvites,
            // Push a party event toast
            partyEventNotifications: [
              ...state.partyEventNotifications,
              { id: `decline-${invitationId || Date.now()}`, type: 'declined', memberName: userName }
            ]
          };
        });

        // Show notification in chat
        const chatStore = getStore('chatStore');
        chatStore.getState().addSocialNotification({
          type: 'party_invitation_declined',
          sender: { name: userName },
          content: `${userName} declined your party invitation`
        });
      });

      // Receiver confirmation - you declined an invite
      bindOwnedSocketHandler(socket, 'invitation_declined_confirmed', ({ invitationId }) => {
        console.log('âœ… Party invite declined');

        // Show toast notification to the decliner
        get().addPartyEventNotification('you_declined', {
          message: 'You declined the party invitation'
        });
      });

      // Party chat message received from server
      bindOwnedSocketHandler(socket, 'global_chat_message', (message) => {
        chatDebug('Ã°Å¸Å’Â [global_chat_message] received', {
          senderId: message.senderId,
          messageId: message.id,
          contentLength: message.content?.length
        });
        get().addGlobalMessage(message);
      });

      bindOwnedSocketHandler(socket, 'party_chat_message', (message) => {
        const { partyId, fromId, message: content, timestamp, senderName, fromSocketId } = message;

        const localPartyId = get().currentParty?.id;
        if (partyId && (partyId !== localPartyId || get()._clearedPartySnapshots.has(partyId))) {
          chatDebug('Ignoring party chat for a different party', { partyId, localPartyId });
          return;
        }

        chatDebug('Ã°Å¸â€™Â¬ [party_chat_message] received', {
          partyId,
          fromId,
          fromSocketId,
          senderName,
          contentLength: content?.length
        });

        // Skip messages from self â€” already optimistically appended by TabbedChat
        // CRITICAL: Use fromSocketId if available to allow cross-tab syncing for the same user
        const { currentUserPresence, socket: activeSocket } = get();

        let currentPlayerId = null;
        try {
          const gameStore = getStore('gameStore');
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
          chatDebug('Ã°Å¸â€™Â¬ Skipping self-echo for party message');
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
      bindOwnedSocketHandler(socket, 'party_error', ({ error, partyId, ...rest }) => {
        console.error('Ã¢ÂÅ’ Party error:', error);

        // Show notification
        const chatStore = getStore('chatStore');
        chatStore.getState().addSocialNotification({
          type: 'party_error',
          content: error || 'An error occurred'
        });
      });

      // GM session invitation received
      bindOwnedSocketHandler(socket, 'gm_session_invitation', (invitation) => {
        if (!invitation) return;

        console.log('Ã°Å¸Å½Â­ GM session invitation received:', {
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
          const partyStore = getStore('partyStore');
          const currentMembers = partyStore.getState().partyMembers || [];
          if (currentMembers.length > 0) {
            console.log('Ã°Å¸Â§Â¹ Clearing social party members on GM session invitation', {
              count: currentMembers.length,
              names: currentMembers.map(m => m.name)
            });
            partyStore.getState().clearPartyMembers();
          }
        } catch (e) {
          console.warn('Ã¢Å¡Â Ã¯Â¸Â Failed to clear party members on GM session invitation:', e);
        }

        // Set flag to trigger invitation UI
        set({
          gmSessionInvitation: invitation
        });
      });

      bindOwnedSocketHandler(socket, 'session_join_request', (request) => {
        if (!request) return;

        console.log('Ã°Å¸â€œÂ¨ Session join request received:', {
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

      bindOwnedSocketHandler(socket, 'join_request_accepted', (data) => {
        console.log('âœ… Join request accepted:', data);

        const { invitation } = data;

        sessionStorage.setItem('enteringMultiplayer', 'true');

        try {
          const partyStore = getStore('partyStore');
          const currentMembers = partyStore.getState().partyMembers || [];
          if (currentMembers.length > 0) {
            console.log('Ã°Å¸Â§Â¹ Clearing party members on join request acceptance');
            partyStore.getState().clearPartyMembers();
          }
        } catch (e) {
          console.warn('Ã¢Å¡Â Ã¯Â¸Â Failed to clear party members:', e);
        }

        set({
          gmSessionInvitation: invitation,
          sentJoinRequests: []
        });

        get().addPartyEventNotification('join_request_accepted', {
          message: 'Your join request was accepted!'
        });
      });

      bindOwnedSocketHandler(socket, 'join_request_declined', (data) => {
        console.log('Ã¢ÂÅ’ Join request declined:', data);

        set(state => ({
          sentJoinRequests: state.sentJoinRequests.filter(r => r.id !== data.requestId)
        }));

        get().addPartyEventNotification('join_request_declined', {
          message: 'Your join request was declined'
        });
      });

      bindOwnedSocketHandler(socket, 'party_invite_failed', (data) => {
        console.error('Ã¢ÂÅ’ Party invite failed:', data);

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

        const chatStore = getStore('chatStore');
        chatStore.getState().addSocialNotification({
          type: 'party_invite_failed',
          content: data.error || 'Failed to invite user'
        });
      });

      bindOwnedSocketHandler(socket, 'session_invitation_sent', (data) => {
        console.log('âœ… Session invitation sent:', data);

        get().addPartyEventNotification('session_invitation_sent', {
          message: 'Session invitation sent'
        });
      });

      bindOwnedSocketHandler(socket, 'invite_error', (data) => {
        console.error('Ã¢ÂÅ’ Invite error:', data);

        get().addPartyEventNotification('invite_error', {
          message: data.message || 'Failed to send invitation'
        });
      });

      // Whisper message received (for global/presence socket, outside game rooms)
      bindOwnedSocketHandler(socket, 'whisper_received', (message) => {
        console.log('Ã°Å¸â€™Â¬ Whisper received:', {
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
      bindOwnedSocketHandler(socket, 'whisper_sent', (message) => {
        console.log('âœ… Whisper sent confirmation:', {
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
      bindOwnedSocketHandler(socket, 'user_status_changed', ({ userId, status, statusComment }) => {
        console.log('Ã°Å¸â€â€ž User status changed:', { userId, status });

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

      // Re-register presence on every reconnect. The server answers with the
      // account's current party snapshot (or an authoritative absence), which
      // is the reconnect reconciliation path. One handler per live socket.
      if (typeof socket.on === 'function' && !socket.__partyReconnectPresenceBound) {
        socket.__partyReconnectPresenceBound = true;
        bindOwnedSocketHandler(socket, 'connect', () => {
          const { currentUserPresence } = get();
          if (!currentUserPresence) return;
          console.log('Re-registering presence on connect for:', currentUserPresence.userId);
          socket.emit('register_presence', {
            userId: currentUserPresence.userId,
            name: currentUserPresence.name || currentUserPresence.characterName,
            accountName: currentUserPresence.accountName || null,
            characterClass: currentUserPresence.class || currentUserPresence.characterClass,
            characterLevel: currentUserPresence.level || currentUserPresence.characterLevel,
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
        });
      }
    }

    set({
      socket,
      isConnected: socket?.connected || false,
      _boundSocketId: socket?.id || null,
      _boundSocket: socket || null
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
      console.error('Ã¢ÂÅ’ No GM session invitation to accept');
      return;
    }

    if (!socket || !socket.connected) {
      console.error('Ã¢ÂÅ’ No socket connection for GM session invitation');
      return;
    }

    console.log('âœ… Accepting GM session invitation:', gmSessionInvitation.partyName);

    // Set flag to prevent social party from syncing to partyStore during transition
    sessionStorage.setItem('enteringMultiplayer', 'true');

    // CRITICAL FIX: Store invitation details in sessionStorage for MultiplayerApp to pickup
    // This allows the join to be handled by the multiplayer socket correctly.
    sessionStorage.setItem('pendingGMSessionInvitation', JSON.stringify({
      invitationId: gmSessionInvitation.id,
      roomId: gmSessionInvitation.roomId,
      partyName: gmSessionInvitation.partyName
    }));

    console.log('Ã°Å¸â€™Â¾ [presenceStore] Saved pendingGMSessionInvitation to sessionStorage');

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
      console.error('Ã¢ÂÅ’ No socket connection for join request');
      return false;
    }

    console.log('Ã°Å¸â€œÂ¨ Sending join request to leader:', { leaderId, roomId, requesterId, requesterName });

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
      console.error('Ã¢ÂÅ’ No socket connection for join request response');
      return false;
    }

    console.log(`${accepted ? 'âœ…' : 'Ã¢ÂÅ’'} Responding to join request:`, { requestId, accepted });

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
      console.error('Ã¢ÂÅ’ No socket connection for session invitation');
      return false;
    }

    console.log('Ã°Å¸â€œÂ¨ Sending session invitation:', { memberId, roomId });

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
      console.error('Ã¢ÂÅ’ No GM session invitation to decline');
      return;
    }

    if (!socket || !socket.connected) {
      console.error('Ã¢ÂÅ’ No socket connection for GM session invitation');
      return;
    }

    console.log('Ã¢ÂÅ’ Declining GM session invitation:', gmSessionInvitation.partyName);
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
    // Prevent duplicate toast spam within 2.5 seconds
    const existing = get().partyEventNotifications.find(n =>
      n.type === type &&
      (n.message === data?.message || (n.name && n.name === data?.name)) &&
      (Date.now() - (n.timestamp || 0)) < 2500
    );
    if (existing) {
      return;
    }

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
          const partyStore = getStore('partyStore');
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

    // Add message to tab (bounded, same cap as global/party chat)
    tab.messages.push(message);
    const whisperCap = get().maxChatMessages || 100;
    if (tab.messages.length > whisperCap) {
      tab.messages = tab.messages.slice(-whisperCap);
    }

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
    const { presenceUnsubscribe, socket } = get();

    if (presenceUnsubscribe) {
      presenceUnsubscribe();
    }

    presenceService.cleanup();

    // Detach and close the underlying socket so it (and its ~40 handlers) cannot
    // outlive the store and duplicate events on the next login.
    try {
      detachOwnedSocketHandlers(socket);
      socket?.disconnect?.();
    } catch (_e) { /* ignore */ }

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
      sentPartyInvites: [],
      partyEventNotifications: [],
      _processedEvents: new Map(),
      _revokedPartyInvitationIds: new Map(),
      _clearedPartySnapshots: new Map(),
      socket: null,
      isConnected: false,
      presenceUnsubscribe: null,
      _boundSocketId: null,
      _boundSocket: null
    });
  }
}));

export default usePresenceStore;


