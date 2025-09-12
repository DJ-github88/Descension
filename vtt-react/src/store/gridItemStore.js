import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import useItemStore from './itemStore';
import useInventoryStore from './inventoryStore';
import useChatStore from './chatStore';
import useGameStore from './gameStore';
import { ensureArray, safeLog, safeGet } from '../utils/prodDevParity';
// Removed enhancedMultiplayer import - service was removed
import '../styles/item-notification.css';

// Helper to generate a unique ID
const generateId = () => `grid-item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// Create the grid item store
const useGridItemStore = create(
  persist(
    (set, get) => ({
      // State
      gridItems: [], // Items placed on the grid
      lastUpdate: Date.now(), // Timestamp to help with re-renders

      // Actions
      addItemToGrid: (item, position, sendToServer = true) => set((state) => {
        // Check if we can stack this item with an existing one
        const isStackableType = item.type === 'consumable' || item.type === 'miscellaneous';
        if (isStackableType && item.stackable !== false) {
          const existingItemIndex = state.gridItems.findIndex(gridItem =>
            gridItem.name === item.name &&
            gridItem.type === item.type &&
            gridItem.quality === item.quality
          );

          if (existingItemIndex >= 0) {
            // Stack with existing item
            const updatedGridItems = [...state.gridItems];
            const existingItem = updatedGridItems[existingItemIndex];
            updatedGridItems[existingItemIndex] = {
              ...existingItem,
              quantity: (existingItem.quantity || 1) + (item.quantity || 1)
            };

            return {
              gridItems: updatedGridItems,
              lastUpdate: Date.now()
            };
          }
        }

        // Adding item to grid

        // IMPORTANT: Force currency properties if type is currency
        if (item.type === 'currency') {
          item.isCurrency = true;

          // Make sure currencyType is set
          if (!item.currencyType) {
            if (item.currencyValue && typeof item.currencyValue === 'object') {
              // Determine primary type based on highest value
              if (item.currencyValue.gold > 0) {
                item.currencyType = 'gold';
              } else if (item.currencyValue.silver > 0) {
                item.currencyType = 'silver';
              } else {
                item.currencyType = 'copper';
              }
            } else if (item.value && typeof item.value === 'object') {
              // Try to use value object if currencyValue is not set
              if (item.value.gold > 0) {
                item.currencyType = 'gold';
                item.currencyValue = item.value;
              } else if (item.value.silver > 0) {
                item.currencyType = 'silver';
                item.currencyValue = item.value;
              } else if (item.value.copper > 0) {
                item.currencyType = 'copper';
                item.currencyValue = item.value;
              } else {
                // Default to gold with empty values
                item.currencyType = 'gold';
                item.currencyValue = { gold: 0, silver: 0, copper: 0 };
              }
            } else {
              // Default to gold if no type is specified
              item.currencyType = 'gold';
              // Create a default currencyValue object
              item.currencyValue = { gold: 0, silver: 0, copper: 0 };
            }
          }

          // If currencyValue is still not set, create a default one
          if (!item.currencyValue) {
            item.currencyValue = { gold: 0, silver: 0, copper: 0 };
            // Set the value for the specified currency type
            if (item.currencyType) {
              item.currencyValue[item.currencyType] = 1;
            }
          }


        }

        // Create a new grid item with position information and preserve ALL item properties
        // Start with a copy of the original item to preserve all properties
        // IMPORTANT: First copy all properties from the original item
        const gridItem = {
          // Copy ALL properties from the original item to ensure nothing is lost
          ...item,

          // Then override with the critical grid item properties
          // This ensures these properties aren't overridden by the spread operator
          id: generateId(),
          itemId: item.id, // Reference to the original item
          // Store the original item store ID if available (for items from inventory)
          originalItemStoreId: item.originalItemStoreId || null,
          // IMPORTANT: Ensure position is set correctly and not overridden
          position: position, // { x, y } in pixels
          gridPosition: position.gridPosition, // { row, col } in grid coordinates
          addedAt: new Date().toISOString(),

          // Ensure critical properties are set correctly even if they weren't in the original item
          isContainer: item.type === 'container',
          containerProperties: item.type === 'container' ? {
            ...(item.containerProperties || {}),
            gridSize: item.containerProperties?.gridSize || { rows: 4, cols: 6 },
            isLocked: item.isLocked || false,
            isOpen: !item.isLocked
          } : null,

          // Ensure currency properties are set correctly
          isCurrency: item.isCurrency || item.type === 'currency' || false,
          currencyType: item.currencyType || (item.type === 'currency' ? 'gold' : null),
          currencyValue: item.currencyValue || null,

          // Ensure type and quality are set
          type: item.type || 'misc',
          quality: item.quality || item.rarity || 'common',

          // Ensure icon and name are set
          iconId: item.iconId || null,
          name: item.name || 'Unknown Item',

          // Ensure value is set for currency items
          value: item.value || null,

          // Preserve all stats and properties
          baseStats: item.baseStats || item.stats || null,
          combatStats: item.combatStats || null,
          utilityStats: item.utilityStats || null,
          weaponStats: item.weaponStats || null,
          description: item.description || null,

          // Preserve subtype and other important properties
          subtype: item.subtype || null,
          rarity: item.rarity || item.quality || 'common',

          // Preserve slot information
          slots: item.slots || null,
          slot: item.slot || null,
          weaponSlot: item.weaponSlot || null,

          // Preserve other important properties
          imageUrl: item.imageUrl || null,
          weight: item.weight || null,
          requiredLevel: item.requiredLevel || null,

          // IMPORTANT: Preserve quantity for stacked items
          quantity: item.quantity || 1
        };

        // Add the new grid item to the state
        const updatedGridItems = [...state.gridItems, gridItem];

        // Created grid item

        // Force a re-render by updating the state with a new array reference
        // This ensures React components properly detect the change
        const newState = {
          gridItems: updatedGridItems,
          // Add a timestamp to force re-renders if needed
          lastUpdate: Date.now()
        };

        // Send to multiplayer server if enabled
        if (sendToServer) {
          const gameStore = useGameStore.getState();
          if (gameStore.isInMultiplayer) {
            // Sending item drop to multiplayer server

            // Use regular socket system for item drops (server handles these properly)
            if (gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
              gameStore.multiplayerSocket.emit('item_dropped', {
                item: gridItem,
                position: position,
                gridPosition: position.gridPosition
              });
            }
          }
        }

        // Force a React re-render by dispatching a custom event
        setTimeout(() => {
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('grid-items-updated', {
              detail: { itemCount: updatedGridItems.length }
            }));
          }
        }, 0);

        return newState;
      }),

      removeItemFromGrid: (gridItemId) => set((state) => {
        const currentItems = Array.isArray(state.gridItems) ? state.gridItems : [];
        console.log(`🗑️ REMOVING LOOT ORB: ${gridItemId} from grid (had ${currentItems.length} items)`);

        const newItems = currentItems.filter(item => item?.id !== gridItemId);
        console.log(`🗑️ AFTER REMOVAL: ${newItems.length} items remaining`);

        return {
          gridItems: newItems,
          lastUpdate: Date.now()
        };
      }),

      // Loot an item from the grid and add it to inventory
      lootItem: (gridItemId, characterId = 'default', looterName = 'Player', sendToServer = true) => {
        try {
          console.log(`🎁 LOOT ITEM CALLED: ${gridItemId} by ${looterName}`);

          const { gridItems } = get();
          const { removeItemFromGrid } = get();
          const chatStore = useChatStore.getState();

          const currentItems = Array.isArray(gridItems) ? gridItems : [];
          console.log(`🎁 Current grid items count: ${currentItems.length}`);
          console.log(`🎁 Looking for grid item: ${gridItemId}`);

          // Find the grid item
          const gridItem = currentItems.find(item => item?.id === gridItemId);
          if (!gridItem) {
            console.log(`🎁 ERROR: Grid item ${gridItemId} not found!`);
            console.log(`🎁 Available grid items:`, currentItems.map(item => ({
              id: item?.id,
              name: item?.name
            })));
            return false;
          }

        console.log(`🎁 Found grid item:`, gridItem);

        // Get the original item from the item store
        const originalItem = useItemStore.getState().items.find(item => item.id === gridItem.itemId);

        // Try to find the original item from the item store using originalItemStoreId if available
        let originalItemFromStoreId = null;
        if (gridItem.originalItemStoreId) {
          originalItemFromStoreId = useItemStore.getState().items.find(item => item.id === gridItem.originalItemStoreId);
        }

        // If the original item doesn't exist, we can still use the grid item's properties
        // This handles items created directly in inventory (like test items or currency)
        // Use ALL properties from the grid item to ensure nothing is lost
        const itemToUse = originalItem || originalItemFromStoreId || {
          // Start with ALL properties from the grid item
          ...gridItem,

          // Override the ID to use the grid item's itemId
          id: gridItem.itemId,

          // IMPORTANT: Preserve the originalItemStoreId if it exists
          // This ensures items that came from inventory and were dropped on the grid
          // can be properly linked back to their original item store entry
          originalItemStoreId: gridItem.originalItemStoreId || null,
          originalItemId: gridItem.originalItemId || gridItem.originalItemStoreId || null,

          // Basic properties
          name: gridItem.name || 'Unknown Item',
          type: gridItem.type || 'misc',
          quality: gridItem.quality || 'common',
          rarity: gridItem.rarity || gridItem.quality || 'common',

          // Currency properties
          isCurrency: gridItem.isCurrency,
          currencyType: gridItem.currencyType,
          currencyValue: gridItem.currencyValue,
          value: gridItem.value || gridItem.currencyValue,

          // Visual properties
          iconId: gridItem.iconId,
          imageUrl: gridItem.imageUrl,

          // Description
          description: gridItem.description || (gridItem.isCurrency ? 'Currency that can be spent or traded.' : 'An item.'),

          // Stats and properties
          baseStats: gridItem.baseStats || gridItem.stats,
          combatStats: gridItem.combatStats,
          utilityStats: gridItem.utilityStats,
          weaponStats: gridItem.weaponStats,

          // Other important properties
          subtype: gridItem.subtype,
          slots: gridItem.slots,
          slot: gridItem.slot,
          weaponSlot: gridItem.weaponSlot,
          weight: gridItem.weight,
          requiredLevel: gridItem.requiredLevel,

          // IMPORTANT: Item dimensions - ensure these are preserved
          width: gridItem.width,
          height: gridItem.height,

          // Container properties
          containerProperties: gridItem.containerProperties,
          isContainer: gridItem.isContainer
        };



        // Get the inventory store
        const inventoryStore = useInventoryStore.getState();

        // Check if this is a currency item
        if (itemToUse.type === 'currency' && itemToUse.isCurrency) {
          // Add the currency to the player's inventory
          // Use currencyValue from the item, falling back to value if needed
          const currencyValue = itemToUse.currencyValue || itemToUse.value || { gold: 1, silver: 0, copper: 0 };



          // Handle both simple and combined currency items
          if (typeof currencyValue === 'object') {
            // Combined currency (has gold, silver, copper properties)
            const currentCurrency = inventoryStore.currency;
            const updatedCurrency = { ...currentCurrency };

            // Add each currency type, ensuring we handle all denominations
            if (currencyValue.platinum) {
              updatedCurrency.platinum = (updatedCurrency.platinum || 0) + currencyValue.platinum;
            }
            if (currencyValue.gold) {
              updatedCurrency.gold = (updatedCurrency.gold || 0) + currencyValue.gold;
            }
            if (currencyValue.silver) {
              updatedCurrency.silver = (updatedCurrency.silver || 0) + currencyValue.silver;
            }
            if (currencyValue.copper) {
              updatedCurrency.copper = (updatedCurrency.copper || 0) + currencyValue.copper;
            }


            // Update the currency in the inventory store
            inventoryStore.updateCurrency(updatedCurrency);
          } else {
            // Simple currency (just a number with a type)
            const currencyType = itemToUse.currencyType || 'gold';

            // Update the currency in the inventory
            const currentCurrency = inventoryStore.currency;
            const updatedCurrency = { ...currentCurrency };

            updatedCurrency[currencyType] = (updatedCurrency[currencyType] || 0) + currencyValue;


            // Update the currency in the inventory store
            inventoryStore.updateCurrency(updatedCurrency);
          }



          // Add notification to chat window
          if (typeof currencyValue === 'object') {
            // For mixed currency (platinum, gold, silver, copper)
            chatStore.addCurrencyLootedNotification(
              currencyValue.platinum || 0,
              currencyValue.gold || 0,
              currencyValue.silver || 0,
              currencyValue.copper || 0,
              gridItem.source || 'world',
              looterName
            );
          } else {
            // For simple currency
            const currencyType = itemToUse.currencyType || 'gold';
            const currencyMap = {
              'platinum': { platinum: currencyValue, gold: 0, silver: 0, copper: 0 },
              'gold': { platinum: 0, gold: currencyValue, silver: 0, copper: 0 },
              'silver': { platinum: 0, gold: 0, silver: currencyValue, copper: 0 },
              'copper': { platinum: 0, gold: 0, silver: 0, copper: currencyValue }
            };

            chatStore.addCurrencyLootedNotification(
              currencyMap[currencyType].platinum,
              currencyMap[currencyType].gold,
              currencyMap[currencyType].silver,
              currencyMap[currencyType].copper,
              gridItem.source || 'world',
              looterName
            );
          }

          // Show a notification to the player
          if (typeof window !== 'undefined') {
            const notification = document.createElement('div');
            notification.className = 'currency-notification';

            // Get the appropriate icon based on the highest denomination
            let iconId = itemToUse.iconId;
            if (!iconId) {
              if (typeof currencyValue === 'object') {
                if (currencyValue.platinum > 0) {
                  iconId = 'inv_misc_coin_04';
                } else if (currencyValue.gold > 0) {
                  iconId = 'inv_misc_coin_01';
                } else if (currencyValue.silver > 0) {
                  iconId = 'inv_misc_coin_03';
                } else {
                  iconId = 'inv_misc_coin_05';
                }
              } else {
                // Default to gold icon for simple currency
                iconId = 'inv_misc_coin_01';
              }
            }

            // Create appropriate notification content based on currency type
            if (typeof currencyValue === 'object') {
              // For combined currency with enhanced formatting
              let notificationHTML = '';
              const parts = [];

              if (currencyValue.platinum) {
                parts.push(`<span style="color: #ffffff; font-weight: 700; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);">+${currencyValue.platinum}</span><span style="color: #e5e4e2; font-weight: 700; margin-left: 2px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);">Platinum</span>`);
              }

              if (currencyValue.gold) {
                parts.push(`<span style="color: #ffffff; font-weight: 700; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);">+${currencyValue.gold}</span><span style="color: #ffd700; font-weight: 700; margin-left: 2px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);">Gold</span>`);
              }

              if (currencyValue.silver) {
                parts.push(`<span style="color: #ffffff; font-weight: 700; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);">+${currencyValue.silver}</span><span style="color: #c0c0c0; font-weight: 700; margin-left: 2px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);">Silver</span>`);
              }

              if (currencyValue.copper) {
                parts.push(`<span style="color: #ffffff; font-weight: 700; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);">+${currencyValue.copper}</span><span style="color: #cd7f32; font-weight: 700; margin-left: 2px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);">Copper</span>`);
              }

              notificationHTML = parts.join('<span style="margin: 0 4px;"> </span>');

              notification.innerHTML = `
                <div class="currency-notification-content">
                  <img src="https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg" alt="Currency" />
                  <span>${notificationHTML}</span>
                </div>
              `;
            } else {
              // For simple currency with enhanced formatting
              const currencyType = itemToUse.currencyType || 'gold';
              const currencyColors = {
                'platinum': '#e5e4e2',
                'gold': '#ffd700',
                'silver': '#c0c0c0',
                'copper': '#cd7f32'
              };

              const currencyColor = currencyColors[currencyType] || '#ffd700';

              notification.innerHTML = `
                <div class="currency-notification-content">
                  <img src="https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg" alt="Currency" />
                  <span>
                    <span style="color: #ffffff; font-weight: 700; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);">+${currencyValue}</span>
                    <span style="color: ${currencyColor}; font-weight: 700; margin-left: 2px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5); text-transform: capitalize;">${currencyType}</span>
                  </span>
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

          // Handle item removal from grid for currency items
          const gameStore = useGameStore.getState();
          console.log(`🎁 Currency loot handling: sendToServer=${sendToServer}, isInMultiplayer=${gameStore.isInMultiplayer}, socketConnected=${gameStore.multiplayerSocket?.connected}`);

          if (sendToServer && gameStore.isInMultiplayer) {
            // In multiplayer, send to server and let server handle authoritative removal
            if (gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
              console.log(`🎁 Sending currency loot to server:`, {
                item: itemToUse,
                quantity: 1,
                source: 'Grid Item',
                looter: looterName,
                gridItemId: gridItemId
              });

              gameStore.multiplayerSocket.emit('item_looted', {
                item: itemToUse,
                quantity: 1, // Currency is always quantity 1
                source: 'Grid Item',
                looter: looterName,
                gridItemId: gridItemId
              });

              // For currency, we rely on server confirmation for removal to prevent desync
              console.log(`🎁 Sent currency loot ${gridItemId} to server, waiting for confirmation`);

              // Add a fallback timeout to remove the item if server doesn't respond within 5 seconds
              setTimeout(() => {
                const currentItems = get().gridItems;
                const itemStillExists = currentItems.find(item => item.id === gridItemId);
                if (itemStillExists) {
                  console.warn(`🎁 Server confirmation timeout for ${gridItemId}, removing locally as fallback`);
                  removeItemFromGrid(gridItemId);
                }
              }, 5000);
            } else {
              console.warn(`🎁 Socket not connected, removing currency ${gridItemId} locally`);
              removeItemFromGrid(gridItemId);
            }
          } else {
            // In single player or when not sending to server, remove locally
            console.log(`🎯 SINGLE PLAYER: Removing currency loot orb ${gridItemId} locally`);
            removeItemFromGrid(gridItemId);
          }

          return true; // Currency was successfully looted
        } else {
          // For containers, we need to preserve the original ID to ensure container functionality works
          const preserveId = itemToUse.type === 'container';

          // Add the item to inventory, preserving all properties
          try {
            // Add the item to inventory with the correct quantity
            let quantity = gridItem.quantity || 1;

            // Handle quantity objects (e.g., {min: 1, max: 1}) by extracting a number
            if (typeof quantity === 'object' && quantity !== null) {
              if (quantity.min !== undefined && quantity.max !== undefined) {
                // For range objects, use a random value between min and max
                quantity = Math.floor(Math.random() * (quantity.max - quantity.min + 1)) + quantity.min;
              } else if (quantity.value !== undefined) {
                // For objects with a value property
                quantity = quantity.value;
              } else {
                // Default to 1 if we can't determine the quantity
                quantity = 1;
              }
            }

            // Ensure quantity is a positive number
            quantity = Math.max(1, parseInt(quantity) || 1);

            console.log(`🎁 ATTEMPTING TO ADD ITEM TO INVENTORY: ${itemToUse.name} (quantity: ${quantity})`);
            console.log(`🎁 Grid item quantity was:`, gridItem.quantity);
            console.log(`🎁 Item data:`, itemToUse);

            const newInventoryItemId = inventoryStore.addItemFromLibrary(itemToUse, {
              quantity: quantity,
              preserveId: preserveId,
              preserveProperties: true // Add a flag to ensure all properties are preserved
            });

            console.log(`🎁 INVENTORY ADD RESULT: ${newInventoryItemId}`);

            // Only remove the loot orb if the item was successfully added to inventory
            if (newInventoryItemId !== null) {
              console.log(`✅ ITEM SUCCESSFULLY ADDED TO INVENTORY: Removing loot orb ${gridItemId}`);

              const gameStore = useGameStore.getState();

              // Remove the loot orb from the grid
              removeItemFromGrid(gridItemId);

              // Send to multiplayer server if needed
              if (sendToServer && gameStore.isInMultiplayer) {
                if (gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
                  gameStore.multiplayerSocket.emit('item_looted', {
                    item: itemToUse,
                    quantity: gridItem.quantity || 1,
                    source: 'Grid Item',
                    looter: looterName,
                    gridItemId: gridItemId
                  });
                  console.log(`🎁 Sent loot notification to server for ${gridItemId}`);
                }
              }

              // Add notification to chat window
              chatStore.addItemLootedNotification(
                itemToUse,
                gridItem.quantity || 1,
                gridItem.source || 'world',
                looterName
              );

              // Force a state update to trigger a re-render of the inventory UI
              const currentState = useInventoryStore.getState();
              useInventoryStore.setState({
                ...currentState,
                items: [...currentState.items] // Create a new array reference to trigger re-render
              });

              return true;
            } else {
              // Item could not be added (inventory full) - keep the orb
              console.log(`🚫 INVENTORY FULL: Could not loot ${itemToUse.name} - keeping loot orb`);

              // Add a notification to chat about inventory being full
              chatStore.addItemLootedNotification(
                itemToUse,
                gridItem.quantity || 1,
                'Inventory Full',
                `${looterName} - No room in inventory!`
              );

              return false; // Return false because orb was not removed
            }
          } catch (error) {
            console.error('Error adding item to inventory:', error);
            return false;
          }
        }
        } catch (error) {
          console.error('Loot item failed:', error);
          return false;
        }
      },

      // Get all items at a specific grid position
      getItemsAtPosition: (gridPosition) => {
        const { gridItems } = get();
        const currentItems = ensureArray(gridItems);
        return currentItems.filter(
          item => safeGet(item, 'gridPosition.row') === safeGet(gridPosition, 'row') &&
                 safeGet(item, 'gridPosition.col') === safeGet(gridPosition, 'col')
        );
      },

      // Clear all items from the grid
      clearGrid: () => set({ gridItems: [] }),

      // Update item position on the grid
      updateItemPosition: (gridItemId, newPosition) => set((state) => {
        const currentItems = Array.isArray(state.gridItems) ? state.gridItems : [];
        const itemIndex = currentItems.findIndex(item => item?.id === gridItemId);

        if (itemIndex === -1) {
          console.warn(`Item with id ${gridItemId} not found in grid`);
          return state;
        }

        const updatedItems = [...currentItems];
        updatedItems[itemIndex] = {
          ...updatedItems[itemIndex],
          position: {
            x: newPosition.x,
            y: newPosition.y
          },
          gridPosition: {
            row: newPosition.gridPosition.row,
            col: newPosition.gridPosition.col
          }
        };

        console.log(`🎯 Updated item ${gridItemId} position to grid (${newPosition.gridPosition.col}, ${newPosition.gridPosition.row})`);

        return {
          gridItems: updatedItems,
          lastUpdate: Date.now()
        };
      }),
    }),
    {
      name: 'grid-items-storage',
      storage: {
        getItem: (name) => {
          try {
            const value = localStorage.getItem(name);
            if (!value) return null;

            // Check if value is already an object (corrupted state)
            if (typeof value === 'object') {
              safeLog('warn', 'Corrupted localStorage detected, clearing grid items store');
              localStorage.removeItem(name);
              return null;
            }

            const parsed = JSON.parse(value);
            // Ensure gridItems is always an array
            if (parsed && parsed.state && parsed.state.gridItems) {
              parsed.state.gridItems = ensureArray(parsed.state.gridItems);
            }
            return value; // Return original string for Zustand to parse
          } catch (error) {
            safeLog('error', 'Error retrieving grid items from localStorage, clearing corrupted data:', error);
            // Clear corrupted data to prevent repeated errors
            try {
              localStorage.removeItem(name);
            } catch (clearError) {
              safeLog('error', 'Failed to clear corrupted localStorage:', clearError);
            }
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            localStorage.setItem(name, value);
          } catch (error) {
            safeLog('error', 'Error storing grid items in localStorage:', error);
          }
        },
        removeItem: (name) => {
          try {
            localStorage.removeItem(name);
          } catch (error) {
            safeLog('error', 'Error removing grid items from localStorage:', error);
          }
        }
      },
      // Add these options to ensure proper persistence
      partialize: (state) => ({
        gridItems: state.gridItems
      }),
      onRehydrateStorage: (state) => {
        return (rehydratedState, error) => {
          if (error) {
            console.error('Error rehydrating grid items store:', error);
          }
        };
      }
    }
  )
);

export default useGridItemStore;
