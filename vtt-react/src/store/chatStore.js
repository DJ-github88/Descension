import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

// Initial state for the store
const initialState = {
  // Active tab
  activeTab: 'social', // 'social', 'combat', 'loot'

  // Notifications for each tab
  notifications: {
    social: [],
    combat: [],
    loot: []
  },

  // Window state
  isOpen: false,

  // Unread counts
  unreadCounts: {
    social: 0,
    combat: 0,
    loot: 0
  },

  // Online users
  onlineUsers: [
    { id: '1', name: 'Thordak', class: 'warrior', level: 12, status: 'online' },
    { id: '2', name: 'Elaria', class: 'mage', level: 10, status: 'online' },
    { id: '3', name: 'Grimjaw', class: 'rogue', level: 11, status: 'away' },
    { id: '4', name: 'Lyra', class: 'cleric', level: 9, status: 'offline' }
  ],

  // Current user
  currentUser: { id: 'current', name: 'Player', class: 'paladin', level: 10 },

  // Multiplayer integration
  multiplayerSocket: null,
  sendMultiplayerMessage: null,

  // Typing indicators
  typingUsers: {} // userId -> { name, timestamp, isTyping }
};

// Maximum number of messages to keep per tab
const MAX_MESSAGES = 100;

// Create the store
const useChatStore = create(
  persist(
    (set, get) => ({
      ...initialState,

      // Tab actions
      setActiveTab: (tab) => set(state => {
        // Reset unread count for the selected tab
        const newUnreadCounts = {
          ...state.unreadCounts,
          [tab]: 0
        };

        return {
          activeTab: tab,
          unreadCounts: newUnreadCounts
        };
      }),

      // Open/close window
      setIsOpen: (isOpen) => set(state => {
        // If opening the window, reset unread count for active tab
        const newUnreadCounts = {...state.unreadCounts};
        if (isOpen) {
          newUnreadCounts[state.activeTab] = 0;
        }

        return {
          isOpen,
          unreadCounts: newUnreadCounts
        };
      }),

      // Add a notification to a specific tab
      addNotification: (tab, notification) => set(state => {
        // Create a new notification with ID and timestamp
        const newNotification = {
          id: uuidv4(),
          timestamp: new Date().toISOString(),
          ...notification
        };

        // Add to the end of the array (newest last)
        const tabNotifications = [
          ...state.notifications[tab],
          newNotification
        ].slice(-MAX_MESSAGES); // Keep only the most recent notifications

        // Increment unread count if the window is not open or if a different tab is active
        const shouldIncrementUnread = !state.isOpen || state.activeTab !== tab;
        const newUnreadCounts = {
          ...state.unreadCounts,
          [tab]: shouldIncrementUnread ? state.unreadCounts[tab] + 1 : 0
        };

        return {
          notifications: {
            ...state.notifications,
            [tab]: tabNotifications
          },
          unreadCounts: newUnreadCounts
        };
      }),

      // Add a loot notification
      addLootNotification: (notification) => {
        const { addNotification } = get();
        addNotification('loot', notification);
      },

      // Add a combat notification
      addCombatNotification: (notification) => {
        const { addNotification } = get();
        addNotification('combat', notification);
      },

      // Add a social notification
      addSocialNotification: (notification) => {
        const { addNotification } = get();
        addNotification('social', notification);
      },

      // Add a notification for item looted
      addItemLootedNotification: (item, quantity = 1, source = '', looter = 'Player') => {
        const { addNotification } = get();
        addNotification('loot', {
          type: 'item_looted',
          item,
          quantity,
          source,
          looter
        });
      },

      // Add a notification for currency looted
      addCurrencyLootedNotification: (platinum = 0, gold = 0, silver = 0, copper = 0, source = '', looter = 'Player') => {
        const { addNotification } = get();
        addNotification('loot', {
          type: 'currency_looted',
          platinum,
          gold,
          silver,
          copper,
          source,
          looter
        });
      },

      // Send a message to the social tab
      sendMessage: (tab, content) => {
        const { addNotification, currentUser, multiplayerSocket, sendMultiplayerMessage } = get();

        // If in multiplayer mode and sending to social tab, send through socket
        if (tab === 'social' && multiplayerSocket && multiplayerSocket.connected && sendMultiplayerMessage) {
          sendMultiplayerMessage(content);
          return; // Don't add locally, it will come back through the socket
        }

        // If socket is disconnected but we're in multiplayer mode, show error
        if (tab === 'social' && multiplayerSocket && !multiplayerSocket.connected) {
          console.error('Cannot send message: socket disconnected');
          addNotification('social', {
            sender: { name: 'System', class: 'system', level: 0 },
            content: 'Cannot send message: disconnected from server',
            type: 'system'
          });
          return;
        }

        // Create message object for local/single-player mode
        const message = {
          sender: currentUser,
          content,
          type: 'message'
        };

        // Add to the social tab
        addNotification('social', message);
      },

      // Clear all notifications for a specific tab
      clearNotifications: (tab) => set(state => ({
        notifications: {
          ...state.notifications,
          [tab]: []
        },
        unreadCounts: {
          ...state.unreadCounts,
          [tab]: 0
        }
      })),

      // Add a user to the online users list
      addUser: (user) => set(state => ({
        onlineUsers: [...state.onlineUsers, user]
      })),

      // Update a user's status
      updateUserStatus: (userId, status) => set(state => ({
        onlineUsers: state.onlineUsers.map(user =>
          user.id === userId ? { ...user, status } : user
        )
      })),

      // Set multiplayer socket and send function
      setMultiplayerIntegration: (socket, sendFunction) => set({
        multiplayerSocket: socket,
        sendMultiplayerMessage: sendFunction
      }),

      // Clear multiplayer integration
      clearMultiplayerIntegration: () => set({
        multiplayerSocket: null,
        sendMultiplayerMessage: null
      }),

      // Typing indicators
      setUserTyping: (userId, userName, isTyping) => set(state => {
        const typingUsers = { ...state.typingUsers };

        if (isTyping) {
          typingUsers[userId] = {
            name: userName,
            timestamp: Date.now(),
            isTyping: true
          };
        } else {
          delete typingUsers[userId];
        }

        return { typingUsers };
      }),

      // Clean up stale typing indicators (older than 10 seconds)
      cleanupTypingIndicators: () => set(state => {
        const now = Date.now();
        const typingUsers = { ...state.typingUsers };

        Object.keys(typingUsers).forEach(userId => {
          if (now - typingUsers[userId].timestamp > 10000) { // 10 seconds
            delete typingUsers[userId];
          }
        });

        return { typingUsers };
      }),

      // Clear all typing indicators
      clearTypingIndicators: () => set({
        typingUsers: {}
      }),

      // Reset store to initial state
      resetStore: () => set(initialState)
    }),
    {
      name: 'chat-store',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          return JSON.parse(str);
        },
        setItem: (name, value) => {
          try {
            // Comprehensive exclusion of non-serializable objects
            const cleanValue = JSON.parse(JSON.stringify(value, (key, val) => {
              // Exclude socket objects, functions, and other non-serializable types
              if (key === 'multiplayerSocket' ||
                  key === 'sendMultiplayerMessage' ||
                  typeof val === 'function' ||
                  (val && typeof val === 'object' && val.constructor &&
                   (val.constructor.name === 'Socket' || val.constructor.name.includes('Socket')))) {
                  return undefined;
              }
              return val;
            }));

            localStorage.setItem(name, JSON.stringify(cleanValue));
          } catch (error) {
            console.error('Error writing to localStorage:', error);
            // Don't throw error to prevent app crashes
          }
        },
        removeItem: (name) => localStorage.removeItem(name)
      }
    }
  )
);

export default useChatStore;
