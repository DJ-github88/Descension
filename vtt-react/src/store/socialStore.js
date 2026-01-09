import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { CLASS_RESOURCE_TYPES } from '../data/classResources';
import { getBackgroundNames } from '../data/backgroundData';

// Sample data for initial state
const SAMPLE_FRIENDS = [
  {
    id: '1',
    name: 'Thordak',
    friendId: 'IronHammer7821',
    level: 12,
    class: 'Dreadnaught',
    background: 'Soldier',
    race: 'Grimheart',
    subrace: 'Delver Grimheart',
    note: 'Dwarven fortress defender',
    status: 'online',
    location: 'Dwarven Halls',
    isRealID: false
  },
  {
    id: '3',
    name: 'Elaria',
    friendId: 'MoonWhisper3492',
    level: 10,
    class: 'Chronarch',
    background: 'Sage',
    race: 'Thornkin',
    subrace: 'Courtly Thornkin',
    note: 'Elven time manipulator',
    status: 'online',
    location: 'Arcane Academy',
    isRealID: false
  },
  {
    id: '4',
    name: 'Grimjaw',
    friendId: 'ShadowBlade5678',
    level: 11,
    class: 'Bladedancer',
    background: 'Criminal',
    race: 'Wildkin',
    subrace: 'Wanderer Wildkin',
    note: 'Halfling shadow scout',
    status: 'away',
    location: 'Merchant Quarter',
    isRealID: false
  },
  {
    id: '5',
    name: 'Seraphina',
    friendId: 'HolyLight1234',
    level: 11,
    class: 'Exorcist',
    background: 'Folk Hero',
    race: 'Nordmark',
    subrace: 'Berserker',
    note: 'Human spirit guardian',
    status: 'offline',
    location: '',
    isRealID: false
  },
  {
    id: '6',
    name: 'Varis',
    friendId: 'ForestGuard9876',
    level: 8,
    class: 'Warden',
    background: 'Outlander',
    race: 'Wildkin',
    subrace: 'Guardian Wildkin',
    note: 'Forest guardian',
    status: 'away',
    location: 'Misty Forest',
    isRealID: false
  }
];

const SAMPLE_IGNORED = [
  {
    id: '7',
    name: 'Trollius',
    level: 3,
    class: 'Berserker',
    background: 'Outlander',
    note: 'Disruptive player'
  },
  {
    id: '8',
    name: 'GoldHawker',
    level: 1,
    class: 'Minstrel',
    background: 'Charlatan',
    note: 'Gold seller'
  }
];

// Initial state for the store
const initialState = {
  // Friends list
  friends: [...SAMPLE_FRIENDS],
  selectedFriend: null,

  // Ignore list
  ignored: [...SAMPLE_IGNORED],
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

      // Migration: Reset friends if they don't have friendId
      migrateFriends: () => {
        const { friends } = get();
        const needsMigration = (friends || []).some(f => !f.friendId);

        if (needsMigration) {
          set({ friends: [...SAMPLE_FRIENDS] });
        }
      },

      // Friend actions
      addFriend: (friend) => set(state => {
        // Check if friend already exists
        const exists = (state.friends || []).some(f => f.name.toLowerCase() === friend.name.toLowerCase());
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
        // Check if already ignored
        const exists = (state.ignored || []).some(i => i.name.toLowerCase() === ignored.name.toLowerCase());
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
