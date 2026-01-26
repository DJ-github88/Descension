import { create } from 'zustand';
import useItemStore from './itemStore';
import useInventoryStore from './inventoryStore';
import useChatStore from './chatStore';
import useGameStore from './gameStore';
import { ensureArray, safeLog, safeGet } from '../utils/prodDevParity';
import { getIconUrl } from '../utils/assetManager';
// Removed enhancedMultiplayer import - service was removed
import '../styles/item-notification.css';

// Helper to generate a unique ID
const generateId = () => `grid-item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// Simple queue so currency notifications never overlap
const currencyNotificationQueue = [];
let currencyNotificationActive = false;

const showNextCurrencyNotification = () => {
  if (typeof document === 'undefined') return;
  if (currencyNotificationQueue.length === 0) {
    currencyNotificationActive = false;
    return;
  }

  const { html, displayDuration } = currencyNotificationQueue.shift();
  currencyNotificationActive = true;

  const notification = document.createElement('div');
  notification.className = 'currency-notification';
  notification.innerHTML = html;

  document.body.appendChild(notification);

  const showTimer = setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  const hideTimer = setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
      currencyNotificationActive = false;
      showNextCurrencyNotification();
    }, 500);
  }, displayDuration);

  // Defensive cleanup in case the timeouts get canceled elsewhere
  notification.dataset.timers = JSON.stringify([showTimer, hideTimer]);
};

const enqueueCurrencyNotification = (html, displayDuration = 2000) => {
  if (typeof document === 'undefined') return;
  currencyNotificationQueue.push({ html, displayDuration });
  if (!currencyNotificationActive) {
    showNextCurrencyNotification();
  }
};

// Simple queue so item notifications never overlap
const itemNotificationQueue = [];
let itemNotificationActive = false;

const showNextItemNotification = () => {
  if (typeof document === 'undefined') return;
  if (itemNotificationQueue.length === 0) {
    itemNotificationActive = false;
    return;
  }

  const { html, quality, displayDuration } = itemNotificationQueue.shift();
  itemNotificationActive = true;

  const notification = document.createElement('div');
  notification.className = `item-notification ${quality || 'common'}`;
  notification.innerHTML = html;

  document.body.appendChild(notification);

  const showTimer = setTimeout(() => {
    notification.classList.add('show');
  }, 10);

  const hideTimer = setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
      itemNotificationActive = false;
      showNextItemNotification();
    }, 500);
  }, displayDuration);

  // Defensive cleanup in case the timeouts get canceled elsewhere
  notification.dataset.timers = JSON.stringify([showTimer, hideTimer]);
};

const enqueueItemNotification = (html, quality = 'common', displayDuration = 2500) => {
  if (typeof document === 'undefined') return;
  itemNotificationQueue.push({ html, quality, displayDuration });
  if (!itemNotificationActive) {
    showNextItemNotification();
  }
};

// Create the grid item store
// NOTE: localStorage persistence removed - grid items are now persisted to database via room gameState
const useGridItemStore = create((set, get) => ({
  // State
  gridItems: [], // Items placed on the grid
  temporaryItems: new Map(), // Store temporary items (like creature loot) by ID
  lastUpdate: Date.now(), // Timestamp to help with re-renders

  // Actions
  addItemToGrid: (item, position, sendToServer = true) => set((state) => {
    // Check if we can stack this item with an existing one
    const isStackableType = item.type === 'consumable' || item.type === 'miscellaneous' || item.type === 'material';

    // Check if item with this ID already exists (crucial for multiplayer sync)
    // If it exists and isn't a stackable type being consolidated, update it instead of adding
    const existingByIdIndex = item.id ? state.gridItems.findIndex(gi => gi.id === item.id) : -1;
    if (existingByIdIndex >= 0 && (!isStackableType || item.stackable === false)) {
      const updatedGridItems = [...state.gridItems];
      updatedGridItems[existingByIdIndex] = {
        ...updatedGridItems[existingByIdIndex],
        ...item,
        position: position,
        gridPosition: position.gridPosition
      };

      return {
        gridItems: updatedGridItems,
        lastUpdate: Date.now()
      };
    }

    // Check if we can stack this item with an existing one
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

    // Store temporary items (like creature loot) so they can be found later
    // Check if this item has a temporary ID (starts with inline_, gold_, silver_, etc.)
    const isTemporaryItem = item.id && (
      item.id.startsWith('inline_') ||
      item.id.startsWith('gold_') ||
      item.id.startsWith('silver_') ||
      item.id.startsWith('copper_') ||
      item.id.startsWith('platinum_')
    );

    if (isTemporaryItem) {
      // Store the complete item data so it can be found later
      set((state) => {
        const newTemporaryItems = new Map(state.temporaryItems);
        newTemporaryItems.set(item.id, item);
        return { temporaryItems: newTemporaryItems };
      });
    }

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
      // CRITICAL: Preserve ID if it already exists (important for multiplayer sync)
      id: item.addedAt ? item.id : generateId(),
      itemId: item.itemId || item.id, // Reference to the original item
      // Store the original item store ID if available (for items from inventory)
      originalItemStoreId: item.originalItemStoreId || null,
      // IMPORTANT: Ensure position is set correctly and not overridden
      position: item.position || position, // { x, y } in pixels - use item.position first
      gridPosition: item.gridPosition || position?.gridPosition, // { row, col } in grid coordinates
      addedAt: item.addedAt || new Date().toISOString(),

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

      // Ensure icon and name are set - use customName if available (for renamed items)
      iconId: item.iconId || null,
      name: item.customName || item.name || 'Unknown Item',

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
      quantity: item.quantity || 1,

      // CRITICAL FIX: Add mapId for map isolation - use current map if not specified
      // Priority: Use explicit position/gridPosition if provided
      // CRITICAL FIX: Use NEW position parameter first, not old item position
      gridPosition: position?.gridPosition || item.gridPosition || item.position?.gridPosition,

      // Priority: Use NEW explicit position if provided (fixes items reverting to old positions)
      position: position || item.position,

      mapId: item.mapId || (() => {
        try {
          const mapStore = require('./mapStore').default.getState();
          const mapId = mapStore.currentMapId || 'default';
          console.log('🗺️ [addItemToGrid] Setting mapId for item:', {
            itemName: item.name,
            itemId: item.id,
            mapId: mapId,
            hasProvidedMapId: !!item.mapId
          });
           return mapId;
         } catch (error) {
           return 'default';
         }
       })()
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

    // Sync with multiplayer using our new system
    // Sync with multiplayer using our new system
    if (sendToServer) {
      get().syncGridItemUpdate('grid_item_added', {
        item: gridItem,
        position: position,
        gridPosition: position.gridPosition,
        targetMapId: gridItem.mapId // Include targetMapId for isolation
      });
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

  removeItemFromGrid: (gridItemId, sendToServer = true) => set((state) => {
    const currentItems = Array.isArray(state.gridItems) ? state.gridItems : [];

    // Find the item being removed to check if it's a temporary item
    const itemBeingRemoved = currentItems.find(item => item?.id === gridItemId);

    // Clean up temporary items
    let newTemporaryItems = state.temporaryItems;
    if (itemBeingRemoved?.itemId && state.temporaryItems.has(itemBeingRemoved.itemId)) {
      newTemporaryItems = new Map(state.temporaryItems);
      newTemporaryItems.delete(itemBeingRemoved.itemId);
    }

    const newItems = currentItems.filter(item => item?.id !== gridItemId);

    // Sync with multiplayer
    if (sendToServer) {
      get().syncGridItemUpdate('grid_item_removed', {
        gridItemId,
        itemData: itemBeingRemoved
      });
    }

    return {
      gridItems: newItems,
      temporaryItems: newTemporaryItems,
      lastUpdate: Date.now()
    };
  }),

  // Loot an item from the grid and add it to inventory
  lootItem: (gridItemId, characterId = 'default', looterName = 'Player', sendToServer = true) => {
    try {
      const { gridItems } = get();
      const { removeItemFromGrid } = get();
      const chatStore = useChatStore.getState();

      const currentItems = Array.isArray(gridItems) ? gridItems : [];

      // Find the grid item
      const gridItem = currentItems.find(item => item?.id === gridItemId);
      if (!gridItem) {
        return false;
      }

      // Get the original item from the item store
      const originalItem = useItemStore.getState().items.find(item => item.id === gridItem.itemId);

      // Try to find the original item from the item store using originalItemStoreId if available
      let originalItemFromStoreId = null;
      if (gridItem.originalItemStoreId) {
        originalItemFromStoreId = useItemStore.getState().items.find(item => item.id === gridItem.originalItemStoreId);
      }

      // Check temporary items store for creature loot and other temporary items
      const temporaryItem = get().temporaryItems.get(gridItem.itemId);

      // If the original item doesn't exist, we can still use the grid item's properties
      // This handles items created directly in inventory (like test items or currency)
      // Use ALL properties from the grid item to ensure nothing is lost
      // Priority: main item store → temporary items → originalItemStoreId → grid item fallback
      // But preserve customName from grid item if it exists (for renamed items)
      const itemToUse = originalItem ? {
        ...originalItem,
        customName: gridItem.customName || originalItem.customName
      } : temporaryItem ? {
        ...temporaryItem,
        customName: gridItem.customName || temporaryItem.customName
      } : originalItemFromStoreId ? {
        ...originalItemFromStoreId,
        customName: gridItem.customName || originalItemFromStoreId.customName
      } : {
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

        // Show a notification to the player using a queue so they never overlap
        if (typeof window !== 'undefined') {
          // Use the correct coin icon path for all currency types
          const iconId = 'Container/Coins/golden-coin-single-isometric';

          let notificationHTML = '';

          // Create appropriate notification content based on currency type
          if (typeof currencyValue === 'object') {
            // For combined currency with enhanced formatting
            const parts = [];

            if (currencyValue.platinum) {
              parts.push(`<span style="color: #2d1810; font-weight: 700; text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);">+${currencyValue.platinum}</span><span style="color: #7a3b2e; font-weight: 700; margin-left: 2px; text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);">Platinum</span>`);
            }

            if (currencyValue.gold) {
              parts.push(`<span style="color: #2d1810; font-weight: 700; text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);">+${currencyValue.gold}</span><span style="color: #7a3b2e; font-weight: 700; margin-left: 2px; text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);">Gold</span>`);
            }

            if (currencyValue.silver) {
              parts.push(`<span style="color: #2d1810; font-weight: 700; text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);">+${currencyValue.silver}</span><span style="color: #7a3b2e; font-weight: 700; margin-left: 2px; text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);">Silver</span>`);
            }

            if (currencyValue.copper) {
              parts.push(`<span style="color: #2d1810; font-weight: 700; text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);">+${currencyValue.copper}</span><span style="color: #7a3b2e; font-weight: 700; margin-left: 2px; text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);">Copper</span>`);
            }

            // Determine primary currency type for icon coloring
            let primaryCurrencyType = 'gold';
            if (currencyValue.platinum > 0) {
              primaryCurrencyType = 'platinum';
            } else if (currencyValue.gold > 0) {
              primaryCurrencyType = 'gold';
            } else if (currencyValue.silver > 0) {
              primaryCurrencyType = 'silver';
            } else if (currencyValue.copper > 0) {
              primaryCurrencyType = 'copper';
            }

            notificationHTML = `
                <div class="currency-notification-content">
                  <img src="${getIconUrl(iconId, 'items')}" alt="Currency" class="currency-coin-icon coin-${primaryCurrencyType}" />
                  <span>${parts.join('<span style="margin: 0 4px;"> </span>')}</span>
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

            notificationHTML = `
                <div class="currency-notification-content">
                  <img src="${getIconUrl(iconId, 'items')}" alt="Currency" class="currency-coin-icon coin-${currencyType}" />
                  <span>
                    <span style="color: #2d1810; font-weight: 700; text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8);">+${currencyValue}</span>
                    <span style="color: #7a3b2e; font-weight: 700; margin-left: 2px; text-shadow: 0 1px 2px rgba(255, 255, 255, 0.8); text-transform: capitalize;">${currencyType}</span>
                  </span>
                </div>
              `;
          }

          enqueueCurrencyNotification(notificationHTML, 2000);
        }

        // Handle item removal from grid for currency items
        const gameStore = useGameStore.getState();

        // Immediately remove locally for responsive UI feedback
        removeItemFromGrid(gridItemId);

        if (sendToServer && gameStore.isInMultiplayer) {
          // In multiplayer, send to server to sync with other players
          if (gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
            gameStore.multiplayerSocket.emit('item_looted', {
              item: itemToUse,
              quantity: 1, // Currency is always quantity 1
              source: 'Grid Item',
              looter: looterName,
              gridItemId: gridItemId
            });
          }
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

          const newInventoryItemId = inventoryStore.addItemFromLibrary(itemToUse, {
            quantity: quantity,
            preserveId: preserveId,
            preserveProperties: true // Add a flag to ensure all properties are preserved
          });

          // Only remove the loot orb if the item was successfully added to inventory
          if (newInventoryItemId !== null) {
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
              }
            }

            // Add notification to chat window
            chatStore.addItemLootedNotification(
              itemToUse,
              gridItem.quantity || 1,
              gridItem.source || 'world',
              looterName
            );

            // Show a popup notification for the item
            if (typeof window !== 'undefined') {
              const itemQuality = (itemToUse.quality || itemToUse.rarity || 'common').toLowerCase();
              const itemName = itemToUse.customName || itemToUse.name || 'Unknown Item';
              const itemQuantity = quantity > 1 ? ` x${quantity}` : '';

              // Helper function to get icon based on item type and subtype (same as GridItem)
              const getItemIcon = (type, subtype) => {
                // Handle miscellaneous items with subtypes
                if (type === 'miscellaneous') {
                  const miscIcons = {
                    'TRADE_GOODS': 'Misc/Profession Resources/resource-ore-cluster-orange-red-veins',
                    'CRAFTING': 'Misc/Profession Resources/resource-bar-ingot-brick-brown-orange',
                    'TOOL': 'Tools/claw-hammer',
                    'QUEST': 'Misc/Books/book-folded-letter-envelope',
                    'MATERIAL': 'Misc/Profession Resources/resource-log-wood-grain-cut-end',
                    'REAGENT': 'Misc/Profession Resources/resource-crystal-gem-blue-teal-beige-star-glint',
                    'JUNK': 'Misc/Bones/bone-femur-long-bone-diagonal'
                  };
                  return miscIcons[subtype] || 'Misc/Profession Resources/resource-ore-cluster-orange-red-veins';
                }

                // Handle accessory items with subtypes
                if (type === 'accessory') {
                  const accessoryIcons = {
                    'NECKLACE': 'Armor/Neck/teal-crystal-pendant',
                    'RING': 'Armor/Finger/finger-simple-teal-diamond-ring',
                    'AMULET': 'Armor/Neck/fiery-orb-amulet'
                  };
                  return accessoryIcons[subtype] || 'Armor/Finger/finger-simple-teal-diamond-ring';
                }

                // Default local icons for different item types
                const typeIcons = {
                  weapon: 'Weapons/Swords/sword-basic-straight-tan-blade-brown-hilt-simple',
                  armor: 'Armor/Chest/chest-simple-tan-tunic',
                  accessory: 'Armor/Finger/finger-simple-teal-diamond-ring',
                  consumable: 'Misc/Profession Resources/Alchemy/Red/red-potion-bottle-classic-squat-bulbous-rounded-body-narrower-neck-diagonal-bright-deep-red-liquid-two-thirds-light-beige-cream-glass-dark-brown-cylindrical-cork',
                  miscellaneous: 'Misc/Profession Resources/resource-ore-cluster-orange-red-veins',
                  material: 'Misc/Profession Resources/First Aid/first-aid-bandage-rolled-fabric-beige-tan',
                  quest: 'Misc/Books/book-folded-letter-envelope',
                  container: 'Container/Pouch/pouch-01'
                };

                return typeIcons[type] || 'Misc/Profession Resources/resource-ore-cluster-orange-red-veins';
              };

              // Get the appropriate icon - use item's iconId, or fallback based on type/subtype
              const itemType = itemToUse.type || 'miscellaneous';
              const itemSubtype = itemToUse.subtype || null;
              const itemIconId = itemToUse.iconId || getItemIcon(itemType, itemSubtype);

              // Use getIconUrl to properly handle local icons (converts WoW IDs to local paths)
              const iconUrl = getIconUrl(itemIconId, 'items', true);
              const fallbackIconUrl = getIconUrl(getItemIcon(itemType, itemSubtype), 'items', true);

              const notificationHTML = `
                  <div class="item-notification-content">
                    <img src="${iconUrl}" alt="${itemName}" onerror="this.onerror=null; this.src='${fallbackIconUrl}';" />
                    <span class="${itemQuality}">
                      ${itemName}${itemQuantity}
                    </span>
                  </div>
                `;

              enqueueItemNotification(notificationHTML, itemQuality, 2500);
            }

            // Remove the grid item (this will also clean up temporary items)
            removeItemFromGrid(gridItemId);

            // Force a state update to trigger a re-render of the inventory UI
            const currentState = useInventoryStore.getState();
            useInventoryStore.setState({
              ...currentState,
              items: [...currentState.items] // Create a new array reference to trigger re-render
            });

            return true;
          } else {
            // Item could not be added (inventory full) - keep the orb
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

  // Load a grid item from saved state (bypasses position validation)
  loadGridItem: (item) => set((state) => {
    // Ensure the item has required properties
    if (!item.id) {
      console.warn('⚠️ Grid item missing ID, skipping:', item);
      return state;
    }

    // Check if item already exists (avoid duplicates)
    const existingItemIndex = state.gridItems.findIndex(gridItem => gridItem.id === item.id);
    if (existingItemIndex >= 0) {
      const updatedGridItems = [...state.gridItems];
      updatedGridItems[existingItemIndex] = item;
      return {
        gridItems: updatedGridItems,
        lastUpdate: Date.now()
      };
    }

    // Add new item
    return {
      gridItems: [...state.gridItems, item],
      lastUpdate: Date.now()
    };
  }),

  // Update item position on the grid
  updateItemPosition: (gridItemId, newPosition, sendToServer = true) => set((state) => {
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
      },
      mapId: newPosition.mapId || updatedItems[itemIndex].mapId || 'default'
    };

      if (sendToServer) {
      get().syncGridItemUpdate('grid_item_moved', {
        itemId: gridItemId, // Server expects itemId, not gridItemId
        position: newPosition, // Server expects position, not newPosition
        updateType: 'move', // Server expects updateType, not type
        targetMapId: updatedItems[itemIndex].mapId
      });
    }

    return {
      gridItems: updatedItems,
      lastUpdate: Date.now()
    };
  }),

  // Multiplayer Synchronization
  syncGridItemUpdate: (updateType, data, targetMapId = null) => {
    const gameStore = useGameStore.getState();
    if (gameStore.isInMultiplayer && gameStore.multiplayerSocket && gameStore.multiplayerSocket.connected) {
      // CRITICAL FIX: Use provided targetMapId or fallback to current map from store
      let currentMapId = targetMapId;
      if (!currentMapId) {
        try {
          // Dynamic import to avoid circular dependency
          const mapStoreModule = require('./mapStore');
          if (mapStoreModule && mapStoreModule.default) {
            const mapStore = mapStoreModule.default.getState();
            currentMapId = mapStore.currentMapId || 'default';
          }
        } catch (error) {
          console.warn('Could not get current map ID for grid item sync:', error);
        }
      }

      // CRITICAL FIX: Use correct event name based on update type
       // Server expects 'grid_item_update' for all operations (add, move, remove)
       if (updateType === 'grid_item_added') {
          // Server expects 'grid_item_update' with { updateType: 'add', itemId, itemData, position, gridPosition, targetMapId }
          gameStore.multiplayerSocket.emit('grid_item_update', {
           updateType: 'add',
           itemId: data.item.id,
           itemData: data.item,
           position: data.position,
           gridPosition: data.gridPosition,
           targetMapId: data.targetMapId || currentMapId
         });
      } else if (updateType === 'grid_item_moved') {
        // Server expects 'grid_item_update' with { updateType: 'move', itemId, position, targetMapId }
        gameStore.multiplayerSocket.emit('grid_item_update', {
          updateType: 'move',
          itemId: data.itemId || data.gridItemId, // Support both field names
          position: data.position || data.newPosition, // Support both field names
          targetMapId: data.targetMapId || currentMapId
        });
      } else {
        // For removes (and other updates), use the general update event
        gameStore.multiplayerSocket.emit('grid_item_update', {
          type: updateType === 'grid_item_removed' ? 'remove' : updateType,
          ...data,
          targetMapId: data.targetMapId || currentMapId
        });
      }
    }
  },
}));

export default useGridItemStore;
