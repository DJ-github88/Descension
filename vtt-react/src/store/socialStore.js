import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { getBackgroundNames } from '../data/backgroundData';

const PLACEHOLDER_FRIEND_IDS = new Set([
  'ironhammer7821',
  'moonwhisper3492',
  'shadowblade5678',
  'holylight1234',
  'forestguard9876'
]);

const PLACEHOLDER_IGNORED_NAMES = new Set([
  'trollius',
  'goldhawker'
]);

// Initial state for the store
const initialState = {
  // Friends list
  friends: [],
  selectedFriend: null,

  // Ignore list
  ignored: [],
  selectedIgnored: null,

  // Who list
  whoResults: [],
  whoQuery: '',

  // Active tab
  activeTab: 'friends', // 'friends', 'ignored', 'who'

  // Pending friend requests
  pendingRequests: []
};

// Create the store
const useSocialStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // Tab actions
      setActiveTab: (tab) => set({ activeTab: tab }),

      // Migration: sanitize social data and remove legacy placeholder entries
      migrateSocialData: () => {
        const { friends, ignored } = get();
        const hasLegacyFriends = (friends || []).some(f => !f.friendId);
        const hasPlaceholderFriends = (friends || []).some(f => {
          const friendId = (f.friendId || '').toString().trim().toLowerCase();
          return (f.isRealID === false) || PLACEHOLDER_FRIEND_IDS.has(friendId);
        });
        const hasPlaceholderIgnored = (ignored || []).some(i => {
          const name = (i.name || '').toString().trim().toLowerCase();
          return PLACEHOLDER_IGNORED_NAMES.has(name);
        });

        if (!hasLegacyFriends && !hasPlaceholderFriends && !hasPlaceholderIgnored) {
          return;
        }

        const normalizedFriends = (friends || [])
          .filter(friend => {
            const friendId = (friend.friendId || '').toString().trim().toLowerCase();
            if (friend.isRealID === false) return false;
            if (PLACEHOLDER_FRIEND_IDS.has(friendId)) return false;
            return true;
          })
          .map(friend => ({
            ...friend,
            friendId: friend.friendId || null
          }));

        const normalizedIgnored = (ignored || []).filter(entry => {
          const name = (entry.name || '').toString().trim().toLowerCase();
          return !PLACEHOLDER_IGNORED_NAMES.has(name);
        });

        set({
          friends: normalizedFriends,
          ignored: normalizedIgnored
        });
      },

      // Backward-compatibility alias
      migrateFriends: () => {
        get().migrateSocialData();
      },

      // Friend actions
      addFriend: (friend) => set(state => {
        const normalizedFriendId = friend.friendId ? String(friend.friendId).trim() : null;
        const normalizedName = friend.name ? String(friend.name).trim().toLowerCase() : '';

        // Check if friend already exists (prefer Friend ID uniqueness)
        const exists = (state.friends || []).some(f => {
          if (normalizedFriendId && f.friendId) {
            return String(f.friendId).trim().toLowerCase() === normalizedFriendId.toLowerCase();
          }
          return (f.name || '').toLowerCase() === normalizedName;
        });

        if (exists) return state;

        const newFriend = {
          ...friend,
          id: friend.id || uuidv4(),
          status: friend.status || 'offline',
          note: friend.note || ''
        };

        return {
          friends: [...state.friends, newFriend],
          selectedFriend: newFriend.id
        };
      }),

      removeFriend: (id) => set(state => ({
        friends: (state.friends || []).filter(friend => friend.id !== id),
        selectedFriend: state.selectedFriend === id ? null : state.selectedFriend
      })),

      updateFriend: (id, updates) => set(state => ({
        friends: (state.friends || []).map(friend =>
          friend.id === id
            ? { ...friend, ...updates }
            : friend
        )
      })),

      setFriendNote: (id, note) => set(state => ({
        friends: (state.friends || []).map(friend =>
          friend.id === id
            ? { ...friend, note }
            : friend
        )
      })),

      setSelectedFriend: (id) => set({ selectedFriend: id }),

      // Ignore actions
      addIgnored: (ignored) => set(state => {
        const normalizedFriendId = ignored.friendId ? String(ignored.friendId).trim() : null;
        const normalizedName = ignored.name ? String(ignored.name).trim().toLowerCase() : '';

        // Check if already ignored (prefer Friend ID uniqueness)
        const exists = (state.ignored || []).some(i => {
          if (normalizedFriendId && i.friendId) {
            return String(i.friendId).trim().toLowerCase() === normalizedFriendId.toLowerCase();
          }
          return (i.name || '').toLowerCase() === normalizedName;
        });

        if (exists) return state;

        const newIgnored = {
          ...ignored,
          id: ignored.id || uuidv4(),
          note: ignored.note || ''
        };

        return {
          ignored: [...state.ignored, newIgnored],
          selectedIgnored: newIgnored.id
        };
      }),

      removeIgnored: (id) => {
        set(state => {
          const newIgnored = (state.ignored || []).filter(ignored => {
            return ignored.id !== id;
          });

          return {
            ignored: newIgnored,
            selectedIgnored: state.selectedIgnored === id ? null : state.selectedIgnored
          };
        });
      },

      setIgnoredNote: (id, note) => set(state => ({
        ignored: (state.ignored || []).map(ignored =>
          ignored.id === id
            ? { ...ignored, note }
            : ignored
        )
      })),

      setSelectedIgnored: (id) => set({ selectedIgnored: id }),

      // Who actions
      setWhoQuery: (query) => set({ whoQuery: query }),

      searchWho: (query) => {
        // In a real app, this would make an API call
        // For now, simulate results using actual class data from the character system
        const availableClasses = [
          'Pyrofiend', 'Minstrel', 'Chronarch', 'Chaos Weaver', 'Fate Weaver', 'Gambler',
          'Martyr', 'False Prophet', 'Exorcist', 'Plaguebringer', 'Lichborne', 'Deathcaller',
          'Spellguard', 'Inscriptor', 'Arcanoneer', 'Witch Doctor', 'Formbender', 'Primalist',
          'Berserker', 'Dreadnaught', 'Titan', 'Toxicologist', 'Covenbane', 'Bladedancer',
          'Lunarch', 'Huntress', 'Warden'
        ];
        const availableBackgrounds = getBackgroundNames();
        const locations = [
          'Town Square', 'Temple District', 'Merchant Quarter', 'Arcane Academy',
          'Tavern', 'Barracks', 'Library', 'Docks', 'Market', 'Guild Hall'
        ];

        const names = [
          'Aric', 'Elindra', 'Thorne', 'Maelis', 'Grommash', 'Seraphina',
          'Kael', 'Lyra', 'Darius', 'Zara', 'Finn', 'Nyx', 'Orion', 'Vera'
        ];

        const results = [];
        for (let i = 0; i < 8; i++) {
          const randomClass = availableClasses[Math.floor(Math.random() * availableClasses.length)];
          const randomBackground = availableBackgrounds[Math.floor(Math.random() * availableBackgrounds.length)];
          const randomName = names[Math.floor(Math.random() * names.length)];
          const randomLocation = locations[Math.floor(Math.random() * locations.length)];
          const randomLevel = Math.floor(Math.random() * 15) + 1;

          results.push({
            id: `w${i + 1}`,
            name: randomName,
            level: randomLevel,
            class: randomClass,
            background: randomBackground,
            location: randomLocation
          });
        }

        set({
          whoResults: results,
          whoQuery: query
        });
      },

      // Friend Request actions
      sendFriendRequest: async (targetFriendId) => {
        const { friends, pendingRequests } = get();

        // Check if already friends
        if (friends.some(f => f.friendId === targetFriendId)) {
          return { error: 'Already friends', success: false };
        }

        // Check if already sent
        if (pendingRequests.some(r => r.friendId === targetFriendId && r.type === 'sent')) {
          return { error: 'Request already sent', success: false };
        }

        const newRequest = {
          id: uuidv4(),
          friendId: targetFriendId,
          type: 'sent',
          status: 'pending',
          timestamp: Date.now()
        };

        set(state => ({
          pendingRequests: [...state.pendingRequests, newRequest]
        }));

        return { success: true };
      },

      receiveFriendRequest: (request) => set(state => ({
        pendingRequests: [...state.pendingRequests, {
          ...request,
          id: request.id || uuidv4(),
          type: 'received',
          status: 'pending',
          timestamp: Date.now()
        }]
      })),

      acceptFriendRequest: (requestId) => set(state => {
        const request = state.pendingRequests.find(r => r.id === requestId);
        if (!request) return state;

        const newFriend = {
          id: uuidv4(),
          name: request.name || 'New Friend',
          friendId: request.friendId,
          status: 'online', // Assume online when accepting
          isRealID: true
        };

        return {
          friends: [...state.friends, newFriend],
          pendingRequests: state.pendingRequests.filter(r => r.id !== requestId)
        };
      }),

      declineFriendRequest: (requestId) => set(state => ({
        pendingRequests: state.pendingRequests.filter(r => r.id !== requestId)
      })),

      // Reset store to initial state
      resetStore: () => set(initialState)
    }),
    {
      name: 'social-store',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          return JSON.parse(str);
        },
        setItem: (name, value) => {
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name)
      }
    }
  )
);

export default useSocialStore;
