import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

// Base category for items
const BASE_CATEGORY = {
  id: 'base',
  name: 'All Items',
  parentId: null
};

// Sample items for testing
const SAMPLE_ITEMS = [
  {
    id: 'health-potion',
    name: 'Health Potion',
    type: 'consumable',
    subtype: 'POTION',
    quality: 'common',
    iconId: 'inv_potion_51',
    description: 'Restores 50 health over 5 seconds.',
    value: { gold: 0, silver: 50, copper: 0 },
    effects: [
      {
        type: 'heal',
        amount: 50,
        duration: 5
      }
    ]
  },
  {
    id: 'rusty-sword',
    name: 'Rusty Sword',
    type: 'weapon',
    subtype: 'ONE_HAND_SWORD',
    quality: 'poor',
    iconId: 'inv_sword_04',
    description: 'An old, rusty sword that has seen better days.',
    value: { gold: 0, silver: 25, copper: 0 },
    damage: '1d6',
    damageType: 'slashing',
    baseStats: {
      strength: 1
    }
  },
  {
    id: 'gold-coin',
    name: 'Gold Coin',
    type: 'currency',
    currencyType: 'gold',
    quality: 'common',
    iconId: 'inv_misc_coin_01',
    value: 1
  }
];

const useItemStore = create(
  persist(
    (set, get) => ({
      // View state
      activeView: 'library', // 'library' or 'generation'

      // Item Library state
      items: [...SAMPLE_ITEMS],
      categories: [BASE_CATEGORY], // Initialize with base item category
      itemCategories: {}, // {itemId: Set(categoryIds)}
      selectedItem: null,
      selectedCategory: BASE_CATEGORY.id, // Initialize with base category selected
      openContainers: new Set(), // Track which containers are open

      // Item Generation state
      drawMode: false,
      editMode: false,
      selectedTiles: [], // Store as array for persistence
      previewItem: null,

      // Actions
      setActiveView: (view) => set({ activeView: view }),
      
      // Add a new item
      addItem: (item) => set(state => {
        const newItem = {
          ...item,
          id: item.id || uuidv4(),
          dateCreated: new Date().toISOString()
        };
        
        return {
          items: [...state.items, newItem],
          selectedItem: newItem.id
        };
      }),
      
      // Update an existing item
      updateItem: (itemId, updates) => set(state => ({
        items: state.items.map(item => 
          item.id === itemId ? { ...item, ...updates } : item
        )
      })),
      
      // Delete an item
      deleteItem: (itemId) => set(state => ({
        items: state.items.filter(item => item.id !== itemId),
        selectedItem: state.selectedItem === itemId ? null : state.selectedItem
      })),
      
      // Toggle container open/closed state
      toggleContainerOpen: (containerId) => set(state => {
        const newOpenContainers = new Set(state.openContainers);
        
        if (newOpenContainers.has(containerId)) {
          newOpenContainers.delete(containerId);
        } else {
          newOpenContainers.add(containerId);
        }
        
        return { openContainers: newOpenContainers };
      })
    }),
    {
      name: 'item-store',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;

          // Parse the stored data
          const parsed = JSON.parse(str);

          // Convert arrays back to Sets for specific properties
          if (parsed.state && parsed.state.openContainers) {
            // Ensure openContainers is a Set
            parsed.state.openContainers = new Set(parsed.state.openContainers);
          }

          return parsed;
        },
        setItem: (name, value) => {
          // Convert Sets to arrays for storage
          const serialized = {
            ...value,
            state: {
              ...value.state,
              openContainers: Array.from(value.state.openContainers || []),
              selectedTiles: Array.from(value.state.selectedTiles || [])
            }
          };
          localStorage.setItem(name, JSON.stringify(serialized));
        },
        removeItem: (name) => localStorage.removeItem(name)
      }
    }
  )
);

export default useItemStore;
