import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import socialService from '../services/socialService';
import authService from '../services/authService';
import presenceService from '../services/firebase/presenceService';

// Initial state for the store
const initialState = {
  friends: [],
  friendPresence: {}, // userId -> presenceData
  pendingRequests: [],
  acceptanceNotifications: [], // { id, friendName } – shown to the sender when accepted
  ignored: [],
  selectedFriend: null,
  selectedIgnored: null,
  isLoading: false,
  error: null,
  activeTab: 'friends'
};

// Track presence subscriptions outside of state to avoid re-renders on every change
const presenceSubscriptions = new Map();

// Track processed accepted request IDs to prevent duplicate processing
const processedAcceptedRequestIds = new Set();

// Create the store
export const useSocialStore = create((set, get) => ({
  ...initialState,

  // Initialization and Listeners
  initialize: (userId) => {
    if (!userId) return () => { };

    set({ isLoading: true });

    // Load ignored from localStorage
    const savedIgnored = localStorage.getItem(`mythrill_ignored_${userId}`);
    if (savedIgnored) {
      try {
        set({ ignored: JSON.parse(savedIgnored) });
      } catch (e) {
        console.error('Error parsing ignored users:', e);
      }
    }

    // 1. Listen to incoming requests
    const unsubscribeIncoming = socialService.subscribeToRequests(userId, (requests) => {
      console.log('📩 Incoming friend requests updated:', requests);
      set(state => {
        const sent = state.pendingRequests.filter(r => r.type === 'sent');
        return {
          pendingRequests: [...sent, ...requests],
          isLoading: false
        };
      });
    });

    // 2. Listen to sent requests
    const unsubscribeSent = socialService.subscribeToSentRequests(userId, (requests) => {
      console.log('📤 Sent friend requests updated:', requests);
      set(state => {
        const received = state.pendingRequests.filter(r => r.type === 'received');
        return {
          pendingRequests: [...received, ...requests],
          isLoading: false
        };
      });
    });

    // 3. Listen to friends list updates
    const unsubscribeFriends = socialService.subscribeToFriends(userId, (friends) => {
      console.log('👥 Friends list updated:', friends);
      const previousFriends = get().friends;
      set({ friends: friends || [], isLoading: false });

      // Handle presence subscriptions for new friends
      const currentFriendIds = new Set((friends || []).map(f => f.id));
      const previousFriendIds = new Set(previousFriends.map(f => f.id));

      // Remove subscriptions for friends no longer in the list
      previousFriendIds.forEach(id => {
        if (!currentFriendIds.has(id)) {
          const unsub = presenceSubscriptions.get(id);
          if (unsub) {
            unsub();
            presenceSubscriptions.delete(id);
            set(state => {
              const newPresence = { ...state.friendPresence };
              delete newPresence[id];
              return { friendPresence: newPresence };
            });
          }
        }
      });

      // Add subscriptions for new friends
      currentFriendIds.forEach(id => {
        if (!presenceSubscriptions.has(id)) {
          console.log(`📡 Subscribing to presence for friend: ${id}`);
          const unsub = presenceService.subscribeToUser(id, (presence) => {
            if (presence) {
              set(state => ({
                friendPresence: {
                  ...state.friendPresence,
                  [id]: presence
                }
              }));
            } else {
              // Handle case where presence record is missing/null (offline)
              set(state => ({
                friendPresence: {
                  ...state.friendPresence,
                  [id]: { status: 'offline', lastSeen: Date.now() }
                }
              }));
            }
          });
          presenceSubscriptions.set(id, unsub);
        }
      });
    });

    // 4. Listen to sent requests that have been accepted
    const unsubscribeAccepted = socialService.subscribeToAcceptedRequests(userId, async (acceptedRequests) => {
      if (!acceptedRequests || acceptedRequests.length === 0) return;

      for (const req of acceptedRequests) {
        // Skip if already processed (idempotency check)
        if (processedAcceptedRequestIds.has(req.id)) {
          console.log('⏭️ Skipping already processed request:', req.id);
          continue;
        }
        processedAcceptedRequestIds.add(req.id);

        // Guard: Verify we are the sender of this request
        if (req.senderId !== userId) {
          console.warn('⚠️ Received accepted request where we are not the sender, skipping');
          continue;
        }

        // The friend to add is the RECEIVER of our request (the person who accepted)
        const friendId = req.receiverId;

        // Guard: Don't add yourself as a friend
        if (friendId === userId) {
          console.warn('⚠️ Cannot add yourself as friend, skipping');
          continue;
        }

        // Add this friend to MY list if they aren't there
        const currentFriends = get().friends;

        if (!currentFriends.some(f => f.id === friendId)) {
          console.log(`🤝 Adding friend ${req.receiverName} (${friendId}) to my document...`);
          const result = await socialService.addFriendToMyList({
            id: friendId,
            name: req.receiverName,
            friendId: req.receiverFriendId,
            photoURL: req.receiverPhotoURL || null
          });

          if (!result.success) {
            console.error('❌ Failed to add friend:', result.error);
          }
        } else {
          console.log(`✅ Friend ${req.receiverName} already in list`);
        }

        // Show a toast notification to the sender
        set(state => ({
          acceptanceNotifications: [
            ...state.acceptanceNotifications,
            { id: req.id, friendName: req.receiverName }
          ]
        }));

        // Cleanup: Delete the request now that both sides have processed it
        try {
          console.log(`🧹 Cleaning up accepted request: ${req.id}`);
          await socialService.deleteFriendRequest(req.id);
          // Remove from processed set after successful cleanup
          processedAcceptedRequestIds.delete(req.id);
        } catch (cleanupError) {
          console.warn('⚠️ Non-fatal: Could not delete friend request document:', cleanupError.message);
        }
      }
    });

    return () => {
      unsubscribeIncoming();
      unsubscribeSent();
      unsubscribeFriends();
      unsubscribeAccepted();
      // Clean up all presence subscriptions
      presenceSubscriptions.forEach(unsub => unsub());
      presenceSubscriptions.clear();
      // Clear processed request IDs
      processedAcceptedRequestIds.clear();
    };
  },

  setFriends: (friends) => set({ friends: friends || [] }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedFriend: (id) => set({ selectedFriend: id }),
  setSelectedIgnored: (id) => set({ selectedIgnored: id }),

  // Actions
  sendFriendRequest: async (targetFriendId) => {
    const { friends, pendingRequests } = get();
    const currentUser = authService.getCurrentUser();

    if (!currentUser) return { error: 'Not authenticated', success: false };

    set({ isLoading: true, error: null });

    try {
      // 1. Find the target user in Firestore
      console.log('🔍 Searching for friend ID:', targetFriendId);
      const targetUser = await authService.findUserByFriendId(targetFriendId);
      if (!targetUser) {
        console.warn('❌ User not found for ID:', targetFriendId);
        set({ isLoading: false });
        return { error: 'User not found', success: false };
      }
      console.log('👤 Target user found:', targetUser.id, targetUser.displayName);

      if (targetUser.id === currentUser.uid) {
        set({ isLoading: false });
        return { error: "You can't add yourself", success: false };
      }

      // 2. Check if already friends
      if (friends.some(f => f.friendId === targetFriendId || f.id === targetUser.id)) {
        set({ isLoading: false });
        return { error: 'Already friends', success: false };
      }

      // 3. Check if already sent
      if (pendingRequests.some(r => r.receiverId === targetUser.id && r.status === 'pending')) {
        set({ isLoading: false });
        return { error: 'Request already sent', success: false };
      }

      // 4. Get current user full data for the request
      const myData = await authService.getUserData(currentUser.uid);

      // 5. Send request via service
      const result = await socialService.sendFriendRequest(myData, targetUser);
      set({ isLoading: false });
      return result;
    } catch (error) {
      console.error('Store error sending friend request:', error);
      set({ isLoading: false, error: error.message });
      return { error: error.message, success: false };
    }
  },

  addFriend: (friend) => {
    set(state => ({
      friends: [...state.friends, { ...friend, addedAt: Date.now() }]
    }));
  },

  acceptFriendRequest: async (requestId) => {
    const { pendingRequests } = get();
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return;

    const request = pendingRequests.find(r => r.id === requestId);
    if (!request) return;

    set({ isLoading: true });
    try {
      const myData = await authService.getUserData(currentUser.uid);
      const result = await socialService.acceptFriendRequest(requestId, myData, request);

      if (result.success) {
        // Success! The listeners will update the lists
      }
      set({ isLoading: false });
      return result;
    } catch (error) {
      console.error('Store error accepting friend request:', error);
      set({ isLoading: false });
    }
  },

  declineFriendRequest: async (requestId) => {
    set({ isLoading: true });
    try {
      // Service now hard-deletes the document directly
      await socialService.declineFriendRequest(requestId);
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      console.error('Store error declining friend request:', error);
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },

  dismissAcceptanceNotification: (id) => {
    set(state => ({
      acceptanceNotifications: state.acceptanceNotifications.filter(n => n.id !== id)
    }));
  },

  removeFriend: async (friendId) => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) return;

    set({ isLoading: true });
    try {
      const myData = await authService.getUserData(currentUser.uid);
      await socialService.removeFriend(currentUser.uid, myData, friendId);
      set({ isLoading: false });
    } catch (error) {
      console.error('Store error removing friend:', error);
      set({ isLoading: false });
    }
  },

  // Ignored Users Actions
  addIgnored: (ignoredUser) => {
    set(state => {
      // Prevent duplicate ignores
      const exists = state.ignored.some(i => i.id === ignoredUser.id || (i.friendId && i.friendId === ignoredUser.friendId));
      if (exists) return state;

      const newIgnored = [...state.ignored, { ...ignoredUser, id: ignoredUser.id || uuidv4(), addedAt: Date.now() }];
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        localStorage.setItem(`mythrill_ignored_${currentUser.uid}`, JSON.stringify(newIgnored));
      }
      return { ignored: newIgnored };
    });
  },

  removeIgnored: (id) => {
    set(state => {
      const newIgnored = state.ignored.filter(i => i.id !== id);
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        localStorage.setItem(`mythrill_ignored_${currentUser.uid}`, JSON.stringify(newIgnored));
      }
      return { ignored: newIgnored };
    });
  },

  setFriendNote: (friendId, note) => {
    set(state => ({
      friends: state.friends.map(f => f.id === friendId ? { ...f, note } : f)
    }));
    // Note: In a real app, this should probably be saved to Firestore user doc
  },

  setIgnoredNote: (ignoredId, note) => {
    set(state => {
      const newIgnored = state.ignored.map(i => i.id === ignoredId ? { ...i, note } : i);
      const currentUser = authService.getCurrentUser();
      if (currentUser) {
        localStorage.setItem(`mythrill_ignored_${currentUser.uid}`, JSON.stringify(newIgnored));
      }
      return { ignored: newIgnored };
    });
  },

  // Migration Actions
  migrateFriends: async () => {
    const { friends } = get();
    const userId = authService.getCurrentUser()?.uid;
    if (!userId || !friends || friends.length === 0) return;

    // Find friends with missing data
    const friendsToMigrate = friends.filter(f => !f.name || !f.friendId);
    if (friendsToMigrate.length === 0) return;

    console.log(`🔄 SocialStore: Found ${friendsToMigrate.length} friends needing data migration`);

    try {
      let hasUpdates = false;
      const updatedFriends = [...friends];

      for (let i = 0; i < updatedFriends.length; i++) {
        const friend = updatedFriends[i];
        if (!friend.name || !friend.friendId) {
          console.log(`🔍 Fetching missing data for friend ID: ${friend.id}`);
          const fullData = await authService.getUserData(friend.id);

          if (fullData) {
            updatedFriends[i] = {
              ...friend,
              name: fullData.displayName || fullData.accountName || 'Unknown',
              friendId: fullData.friendId,
              photoURL: fullData.photoURL || friend.photoURL || null
            };
            hasUpdates = true;
          }
        }
      }

      if (hasUpdates) {
        console.log('✅ SocialStore: Migration complete, updating Firestore...');
        // Update the user's friends list in Firestore
        await authService.updateUserData({ friends: updatedFriends });
        // The subscriber will update the store state automatically
      }
    } catch (error) {
      console.error('❌ SocialStore: Error migrating friends:', error);
    }
  },

  migrateSocialData: () => {
    // Placeholder for migration logic if needed
    console.log('SocialStore: migrateSocialData called');
  },

  resetStore: () => {
    processedAcceptedRequestIds.clear();
    return set(initialState);
  }
}));

export default useSocialStore;
