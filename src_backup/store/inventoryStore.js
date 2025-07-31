import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import useChatStore from './chatStore';
import '../styles/item-notification.css';

// Initial state
const initialState = {
  // Inventory grid size
  gridSize: { rows: 6, cols: 10 },
  
  // Items in inventory
  items: [],
  
  // Currency
  currency: {
    gold: 0,
    silver: 0,
    copper: 0
  },
  
  // Selected item
  selectedItem: null
};

// Create the inventory store
const useInventoryStore = create(
  persist(
    (set, get) => ({
      ...initialState,
      
      // Add an item to inventory from the item library
      addItemFromLibrary: (item, quantity = 1) => {
        const { items, gridSize } = get();
        const addLootNotification = useChatStore.getState().addLootNotification;
        
        // Check if we have space in the inventory
        if (items.length >= gridSize.rows * gridSize.cols) {
          console.error("Inventory is full!");
          
          // Create a notification to inform the user
          if (typeof window !== 'undefined') {
            const notification = document.createElement('div');
            notification.className = 'inventory-full-notification';
            notification.innerHTML = `
                <div class="inventory-full-notification-content">
                    <span>Inventory is full! Could not add ${item.name}.</span>
                </div>
            `;
            document.body.appendChild(notification);

            // Add animation class after a small delay to trigger the animation
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);

            // Remove the notification after animation completes
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 500);
            }, 3000);
          }
          
          return false;
        }
        
        // Create a new inventory item
        const newItem = {
          ...item,
          id: item.id || uuidv4(),
          quantity: quantity || 1,
          inventoryId: uuidv4() // Unique ID for this inventory instance
        };
        
        // Add notification to chat window
        addLootNotification({
          type: 'item_dropped',
          item: newItem,
          quantity: quantity
        });
        
        // Add the item to inventory
        set(state => ({
          items: [...state.items, newItem],
          selectedItem: newItem.inventoryId
        }));
        
        // Dispatch a custom event to notify other components
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('inventory-updated'));
        }
        
        return true;
      },
      
      // Remove an item from inventory
      removeItem: (inventoryId) => {
        const { items } = get();
        const item = items.find(i => i.inventoryId === inventoryId);
        
        if (!item) {
          console.error("Item not found in inventory:", inventoryId);
          return false;
        }
        
        // Add notification to chat window
        const addLootNotification = useChatStore.getState().addLootNotification;
        addLootNotification({
          type: 'item_dropped',
          item: item,
          quantity: item.quantity || 1
        });
        
        // Remove the item from inventory
        set(state => ({
          items: state.items.filter(i => i.inventoryId !== inventoryId),
          selectedItem: state.selectedItem === inventoryId ? null : state.selectedItem
        }));
        
        // Dispatch a custom event to notify other components
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('inventory-updated'));
        }
        
        return true;
      },
      
      // Select an item in inventory
      selectItem: (inventoryId) => set({ selectedItem: inventoryId }),
      
      // Add currency to inventory
      addCurrency: (type, amount) => {
        if (amount <= 0) return;
        
        set(state => {
          const newCurrency = { ...state.currency };
          
          switch (type) {
            case 'gold':
              newCurrency.gold += amount;
              break;
            case 'silver':
              newCurrency.silver += amount;
              // Convert if needed
              if (newCurrency.silver >= 100) {
                newCurrency.gold += Math.floor(newCurrency.silver / 100);
                newCurrency.silver %= 100;
              }
              break;
            case 'copper':
              newCurrency.copper += amount;
              // Convert if needed
              if (newCurrency.copper >= 100) {
                newCurrency.silver += Math.floor(newCurrency.copper / 100);
                newCurrency.copper %= 100;
                
                if (newCurrency.silver >= 100) {
                  newCurrency.gold += Math.floor(newCurrency.silver / 100);
                  newCurrency.silver %= 100;
                }
              }
              break;
            default:
              console.error("Invalid currency type:", type);
              return state;
          }
          
          return { currency: newCurrency };
        });
      },
      
      // Remove currency from inventory
      removeCurrency: (type, amount) => {
        if (amount <= 0) return false;
        
        const { currency } = get();
        let totalCopper = currency.copper + (currency.silver * 100) + (currency.gold * 10000);
        let amountInCopper = 0;
        
        switch (type) {
          case 'gold':
            amountInCopper = amount * 10000;
            break;
          case 'silver':
            amountInCopper = amount * 100;
            break;
          case 'copper':
            amountInCopper = amount;
            break;
          default:
            console.error("Invalid currency type:", type);
            return false;
        }
        
        if (totalCopper < amountInCopper) {
          console.error("Not enough currency!");
          return false;
        }
        
        totalCopper -= amountInCopper;
        
        const newGold = Math.floor(totalCopper / 10000);
        totalCopper %= 10000;
        
        const newSilver = Math.floor(totalCopper / 100);
        totalCopper %= 100;
        
        const newCopper = totalCopper;
        
        set({
          currency: {
            gold: newGold,
            silver: newSilver,
            copper: newCopper
          }
        });
        
        return true;
      },
      
      // Reset inventory to initial state
      resetInventory: () => set(initialState)
    }),
    {
      name: 'inventory-store',
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

export default useInventoryStore;
