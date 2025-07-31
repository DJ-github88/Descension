import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

// Initial state for the store
const initialState = {
  // Active tab
  activeTab: 'loot', // 'social', 'combat', 'loot'
  
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
  }
};

// Maximum number of notifications to keep per tab
const MAX_NOTIFICATIONS = 100;

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
        
        // Add to the beginning of the array (newest first)
        const tabNotifications = [
          newNotification,
          ...state.notifications[tab]
        ].slice(0, MAX_NOTIFICATIONS); // Keep only the most recent notifications
        
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
      
      // Clear all notifications
      clearAllNotifications: () => set({
        notifications: {
          social: [],
          combat: [],
          loot: []
        },
        unreadCounts: {
          social: 0,
          combat: 0,
          loot: 0
        }
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
          localStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: (name) => localStorage.removeItem(name)
      }
    }
  )
);

export default useChatStore;
