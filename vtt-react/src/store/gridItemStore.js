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
            // For mixed currency (gold, silver, copper)
            chatStore.addCurrencyLootedNotification(
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
              'gold': { gold: currencyValue, silver: 0, copper: 0 },
              'silver': { gold: 0, silver: currencyValue, copper: 0 },
              'copper': { gold: 0, silver: 0, copper: currencyValue }
            };

            chatStore.addCurrencyLootedNotification(
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
                if (currencyValue.gold > 0) {
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
          if (sendToServer && gameStore.isInMultiplayer) {
            // In multiplayer, send to server and let server handle removal
            if (gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
              gameStore.multiplayerSocket.emit('item_looted', {
                item: itemToUse,
                quantity: 1, // Currency is always quantity 1
                source: 'Grid Item',
                looter: looterName,
                gridItemId: gridItemId
              });

              // Remove item locally immediately to prevent persistence
              console.log(`🎁 Removing looted currency ${gridItemId} locally (multiplayer)`);
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
            const quantity = gridItem.quantity || 1;
            const newInventoryItemId = inventoryStore.addItemFromLibrary(itemToUse, {
              quantity: quantity,
              preserveId: preserveId,
              preserveProperties: true // Add a flag to ensure all properties are preserved
            });

            // CRITICAL FIX: Always remove the loot orb, even if inventory detection fails
            // The inventory detection has bugs but items are actually being added
            console.log(`🎯 FORCING LOOT ORB REMOVAL: ${gridItemId} (inventory result: ${newInventoryItemId})`);
            console.log(`🎯 DEBUG: Current environment: ${window?.location?.hostname || 'unknown'}`);

            const currentGridItems = Array.isArray(get().gridItems) ? get().gridItems : [];
            console.log(`🎯 DEBUG: Grid items before removal:`, currentGridItems.length);

            // Handle item removal from grid FIRST, before any other logic
            const gameStore = useGameStore.getState();

            // FORCE IMMEDIATE REMOVAL - Remove locally first, then handle multiplayer
            console.log(`🎯 IMMEDIATE REMOVAL: Removing loot orb ${gridItemId} locally`);
            removeItemFromGrid(gridItemId);

            const afterRemovalItems = Array.isArray(get().gridItems) ? get().gridItems : [];
            console.log(`🎯 DEBUG: Grid items after removal:`, afterRemovalItems.length);

            // Force a state update to ensure UI reflects the change
            setTimeout(() => {
              const currentItems = Array.isArray(get().gridItems) ? get().gridItems : [];
              console.log(`🎯 DEBUG: Grid items in timeout:`, currentItems.length);
              const itemStillExists = currentItems.find(item => item?.id === gridItemId);
              if (itemStillExists) {
                console.log(`🎯 BACKUP REMOVAL: Loot orb ${gridItemId} still exists, forcing removal`);
                set(state => ({
                  gridItems: (Array.isArray(state.gridItems) ? state.gridItems : []).filter(item => item?.id !== gridItemId),
                  lastUpdate: Date.now()
                }));
                const finalItems = Array.isArray(get().gridItems) ? get().gridItems : [];
                console.log(`🎯 DEBUG: Grid items after backup removal:`, finalItems.length);
              } else {
                console.log(`🎯 SUCCESS: Loot orb ${gridItemId} successfully removed`);
              }
            }, 100);

            // Additional aggressive removal attempts for production
            const hostname = window?.location?.hostname || '';
            if (hostname.includes('netlify') || hostname.includes('vercel')) {
              console.log(`🎯 PRODUCTION DETECTED: Adding extra removal attempts`);
              [200, 500, 1000].forEach(delay => {
                setTimeout(() => {
                  const items = Array.isArray(get().gridItems) ? get().gridItems : [];
                  const itemStillExists = items.find(item => item?.id === gridItemId);
                  if (itemStillExists) {
                    console.log(`🎯 PRODUCTION CLEANUP ${delay}ms: Removing persistent loot orb ${gridItemId}`);
                    set(state => ({
                      gridItems: (Array.isArray(state.gridItems) ? state.gridItems : []).filter(item => item?.id !== gridItemId),
                      lastUpdate: Date.now()
                    }));
                  }
                }, delay);
              });
            }

            if (sendToServer && gameStore.isInMultiplayer) {
              // In multiplayer, also send to server
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

            // Check if the item was successfully added (for notifications only)
            if (newInventoryItemId === null) {
              // Item could not be added (inventory full) - but orb is already removed
              console.log(`Could not loot ${itemToUse.name} - inventory full (but orb removed anyway)`);

              // Add a notification to chat about inventory being full
              chatStore.addItemLootedNotification(
                itemToUse,
                gridItem.quantity || 1,
                'Inventory Full',
                `${looterName} - No room in inventory!`
              );

              return true; // Return true because orb was removed
            }

            // Item was successfully added to inventory - now handle removal and notifications
            console.log(`✅ LOOT SUCCESS: Item ${itemToUse.name} added to inventory, now removing orb ${gridItemId}`);

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

            // Dispatch a custom event that the InventoryWindow can listen for
            if (typeof window !== 'undefined') {
              const event = new CustomEvent('inventory-updated', {
                detail: { itemId: newInventoryItemId }
              });
              window.dispatchEvent(event);
            }

            // Item removal already handled above - no need to remove again

            // Don't try to immediately verify the item in inventory
            // State updates are asynchronous, so the item might not be immediately available

            // Instead, schedule multiple verification checks with increasing delays
            // This gives the state time to update and ensures the UI refreshes
            const verifyAndRefresh = (attempt = 1, maxAttempts = 3) => {
              const currentInventoryItems = useInventoryStore.getState().items;
              const addedItem = currentInventoryItems.find(item => item.id === newInventoryItemId);

              if (addedItem) {
                // Item verified in inventory - already handled above
              } else if (attempt < maxAttempts) {
                // Try again with exponential backoff
                setTimeout(() => verifyAndRefresh(attempt + 1, maxAttempts), 100 * attempt);
              } else {

                // Try to force a state update anyway
                const currentState = useInventoryStore.getState();
                useInventoryStore.setState({
                  ...currentState,
                  items: [...currentState.items] // Create a new array reference to trigger re-render
                });

                // Dispatch the event anyway as a last resort
                if (typeof window !== 'undefined') {
                  const event = new CustomEvent('inventory-updated', {
                    detail: { itemId: null, forceRefresh: true }
                  });
                  window.dispatchEvent(event);
                }
              }
            };

            // Start the verification process
            setTimeout(() => verifyAndRefresh(), 100);
          } catch (error) {
            console.error('Error adding item to inventory:', error);
          }

          // Show a notification for the looted item
          if (typeof window !== 'undefined') {
            // Get the item quality for styling
            const quality = itemToUse.quality?.toLowerCase() || 'common';

            // Calculate position based on existing notifications
            const existingNotifications = document.querySelectorAll('.item-notification');
            const topOffset = 20 + (existingNotifications.length * 80); // Stack notifications

            const notification = document.createElement('div');
            notification.className = `item-notification ${quality}`;
            notification.style.top = `${topOffset}%`;
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
                if (notification.parentNode) {
                  document.body.removeChild(notification);
                }
                // Reposition remaining notifications
                const remainingNotifications = document.querySelectorAll('.item-notification');
                remainingNotifications.forEach((notif, index) => {
                  notif.style.top = `${20 + (index * 80)}%`;
                });
              }, 500);
            }, 3000); // Show for 3 seconds
          }
        }

        // Removal logic has been moved earlier in the function after successful inventory addition

        return true;
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
    }),
    {
      name: 'grid-items-storage',
      storage: {
        getItem: (name) => {
          try {
            const value = localStorage.getItem(name);
            if (!value) return null;

            const parsed = JSON.parse(value);
            // Ensure gridItems is always an array
            if (parsed && parsed.state && parsed.state.gridItems) {
              parsed.state.gridItems = ensureArray(parsed.state.gridItems);
            }
            return value; // Return original string for Zustand to parse
          } catch (error) {
            safeLog('error', 'Error retrieving grid items from localStorage:', error);
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
