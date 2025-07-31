import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useItemStore from './itemStore';
import useInventoryStore from './inventoryStore';
import useChatStore from './chatStore';
import '../styles/item-notification.css';

// Helper to generate a unique ID
const generateId = () => `grid-item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// Create the grid item store
const useGridItemStore = create(
  persist(
    (set, get) => ({
      // State
      gridItems: [], // Items placed on the grid
      
      // Add an item to the grid
      addItemToGrid: (item, gridPosition) => set(state => {
        const gridItem = {
          id: generateId(),
          itemId: item.id,
          gridPosition,
          ...item
        };
        
        return {
          gridItems: [...state.gridItems, gridItem]
        };
      }),
      
      // Remove an item from the grid
      removeItemFromGrid: (gridItemId) => set(state => ({
        gridItems: state.gridItems.filter(item => item.id !== gridItemId)
      })),
      
      // Loot an item from the grid and add it to inventory
      lootItem: (gridItemId, characterId = 'default') => {
        const { gridItems } = get();
        const { removeItemFromGrid } = get();
        const addLootNotification = useChatStore.getState().addLootNotification;

        console.log("Attempting to loot grid item:", gridItemId);

        // Find the grid item
        const gridItem = gridItems.find(item => item.id === gridItemId);
        if (!gridItem) {
          console.error("Grid item not found:", gridItemId);
          return false;
        }
        
        // Get the item from the item store or use the grid item directly
        const itemStore = useItemStore.getState();
        const inventoryStore = useInventoryStore.getState();
        
        // Check if it's a currency item
        if (gridItem.type === 'currency') {
          // Add currency to inventory
          const currencyValue = gridItem.value || 1;
          const currencyType = gridItem.currencyType || 'gold';
          
          // Add currency to inventory
          inventoryStore.addCurrency(currencyType, currencyValue);
          
          // Add notification to chat window
          if (gridItem.currencyType === 'mixed') {
            // For mixed currency (gold, silver, copper)
            addLootNotification({
              type: 'currency_looted',
              gold: gridItem.gold || 0,
              silver: gridItem.silver || 0,
              copper: gridItem.copper || 0,
              source: gridItem.source || 'world'
            });
          } else {
            // For simple currency
            const currencyMap = {
              'gold': { gold: currencyValue, silver: 0, copper: 0 },
              'silver': { gold: 0, silver: currencyValue, copper: 0 },
              'copper': { gold: 0, silver: 0, copper: currencyValue }
            };
            
            addLootNotification({
              type: 'currency_looted',
              ...currencyMap[currencyType],
              source: gridItem.source || 'world'
            });
          }
          
          // Show a visual notification
          if (typeof window !== 'undefined') {
            const iconId = gridItem.iconId || 'inv_misc_coin_01';
            const notification = document.createElement('div');
            notification.className = 'currency-notification';
            
            if (gridItem.currencyType === 'mixed') {
              // For mixed currency
              let notificationText = '';
              if (gridItem.gold > 0) notificationText += `${gridItem.gold}g `;
              if (gridItem.silver > 0) notificationText += `${gridItem.silver}s `;
              if (gridItem.copper > 0) notificationText += `${gridItem.copper}c`;
              
              notification.innerHTML = `
                <div class="currency-notification-content">
                  <img src="https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg" alt="Currency" />
                  <span>${notificationText}</span>
                </div>
              `;
            } else {
              // For simple currency
              const currencyType = gridItem.currencyType || 'gold';
              notification.innerHTML = `
                <div class="currency-notification-content">
                  <img src="https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg" alt="Currency" />
                  <span>+${currencyValue} ${currencyType}</span>
                </div>
              `;
            }

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
            }, 2000);
          }
        } else {
          // For regular items, get the item from the store or use the grid item
          const itemToUse = itemStore.items.find(i => i.id === gridItem.itemId) || gridItem;
          
          // Add the item to inventory
          const quantity = gridItem.quantity || 1;
          const success = inventoryStore.addItemFromLibrary(itemToUse, quantity);
          
          if (!success) {
            console.error("Failed to add item to inventory:", itemToUse.name);
            return false;
          }
          
          // Add notification to chat window
          addLootNotification({
            type: 'item_looted',
            item: itemToUse,
            quantity: quantity,
            source: gridItem.source || 'world'
          });
          
          // Show a visual notification
          if (typeof window !== 'undefined') {
            // Get the item quality for styling
            const quality = itemToUse.quality?.toLowerCase() || 'common';

            const notification = document.createElement('div');
            notification.className = `item-notification ${quality}`;
            notification.innerHTML = `
              <div class="item-notification-content">
                <img src="https://wow.zamimg.com/images/wow/icons/large/${itemToUse.iconId || 'inv_misc_questionmark'}.jpg" alt="${itemToUse.name}" />
                <span class="${quality}">Looted: ${itemToUse.name}</span>
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
            }, 2000);
          }
        }

        // Remove the item from the grid
        removeItemFromGrid(gridItemId);

        return true;
      },

      // Get all items at a specific grid position
      getItemsAtPosition: (gridPosition) => {
        const { gridItems } = get();
        return gridItems.filter(
          item => item.gridPosition.row === gridPosition.row &&
                 item.gridPosition.col === gridPosition.col
        );
      },

      // Clear all items from the grid
      clearGrid: () => set({ gridItems: [] }),
    }),
    {
      name: 'grid-item-store',
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

export default useGridItemStore;
