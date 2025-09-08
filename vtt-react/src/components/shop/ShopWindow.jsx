import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useItemStore from '../../store/itemStore';
import useInventoryStore from '../../store/inventoryStore';
import useCreatureStore from '../../store/creatureStore';
import useGameStore from '../../store/gameStore';
import ItemTooltip from '../item-generation/ItemTooltip';
import TooltipPortal from '../tooltips/TooltipPortal';
import { getSafePortalTarget } from '../../utils/portalUtils';
import './ShopWindow.css';

const ShopWindow = ({ isOpen, onClose, creature }) => {
  const { items: itemLibrary } = useItemStore();
  const { currency, updateCurrency, addItemFromLibrary, items: inventoryItems, removeItem } = useInventoryStore();
  const { updateCreature } = useCreatureStore();
  const windowScale = useGameStore(state => state.windowScale);

  // Local state
  const [selectedItems, setSelectedItems] = useState({}); // Changed to object to track quantities
  const [selectedSellItems, setSelectedSellItems] = useState({}); // Track items selected for selling
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [sellQuantity, setSellQuantity] = useState(1);
  const [tooltip, setTooltip] = useState({ show: false, item: null, x: 0, y: 0 });
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // Unified filter state for both inventories
  const [globalFilters, setGlobalFilters] = useState({
    searchQuery: '',
    selectedItemType: 'all',
    selectedQuality: 'all'
  });

  // Window position state
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [forceRender, setForceRender] = useState(0);
  
  // Refs
  const windowRef = useRef(null);
  const tooltipTimeoutRef = useRef(null);
  
  // Get shop info
  const shopName = creature.shopInventory?.shopName || `${creature.name}'s Shop`;
  const shopDescription = creature.shopInventory?.shopDescription || 'Welcome to our shop!';
  const shopItems = creature.shopInventory?.items || [];

  // Filter functions
  const doesItemMatchFilter = (item, filters) => {
    const matchesSearch = !filters.searchQuery ||
      item.name.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(filters.searchQuery.toLowerCase());
    const matchesType = filters.selectedItemType === 'all' || item.type === filters.selectedItemType;
    // Handle both 'quality' and 'rarity' properties for item quality filtering
    const itemQuality = item.quality || item.rarity || 'common';
    const matchesQuality = filters.selectedQuality === 'all' || itemQuality === filters.selectedQuality;

    return matchesSearch && matchesType && matchesQuality;
  };

  // Get unique item types and qualities for filter options
  const getFilterOptions = (items) => {
    const types = new Set();
    const qualities = new Set();

    items.forEach(item => {
      if (item.type) types.add(item.type);
      // Handle both 'quality' and 'rarity' properties
      const itemQuality = item.quality || item.rarity;
      if (itemQuality) qualities.add(itemQuality);
    });

    return {
      types: Array.from(types).sort(),
      qualities: Array.from(qualities).sort()
    };
  };


  
  // Handle window dragging
  const handleMouseDown = (e) => {
    // Only allow dragging from the header, but exclude filter controls
    const isHeaderElement = e.target.closest('.shop-window-header');
    const isFilterControl = e.target.closest('.header-filters') ||
                           e.target.closest('.header-filter-input') ||
                           e.target.closest('.header-filter-select') ||
                           e.target.closest('.header-reset-btn') ||
                           e.target.closest('.close-button');

    if (isHeaderElement && !isFilterControl) {
      setIsDragging(true);
      const rect = windowRef.current.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      e.preventDefault();
    }
  };
  
  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  // Setup drag listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'move';
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'default';
    };
  }, [isDragging, dragOffset]);
  
  // Get item from library
  const getItemById = (itemId) => {
    return itemLibrary.find(item => item.id === itemId);
  };

  // Combined filter options for both inventories
  const merchantItemsForFilters = shopItems.map(shopItem => getItemById(shopItem.itemId)).filter(Boolean);
  const allItemsForFilters = [...merchantItemsForFilters, ...inventoryItems];
  const globalFilterOptions = getFilterOptions(allItemsForFilters);
  
  // Calculate total price in copper
  const calculateTotalCopper = (price) => {
    return (price.platinum || 0) * 1000000 + (price.gold || 0) * 10000 + (price.silver || 0) * 100 + (price.copper || 0);
  };
  
  // Calculate player's total copper
  const playerTotalCopper = calculateTotalCopper(currency);
  
  // Check if player can afford item
  const canAfford = (price, quantity = 1) => {
    const totalCost = calculateTotalCopper(price) * quantity;
    return playerTotalCopper >= totalCost;
  };
  
  // Calculate sell price for an item using merchant buy rates
  const calculateSellPrice = (item) => {
    if (!item.value) return { gold: 0, silver: 0, copper: 1 };

    const totalCopper = calculateTotalCopper(item.value);

    // Get merchant buy rates
    const buyRates = creature.shopInventory?.buyRates || { default: 30, categories: {} };

    // Determine buy rate based on item type (use the standard item categories)
    let buyRate = buyRates.default;

    // Use the item's main type as the category
    if (item.type && buyRates.categories && buyRates.categories[item.type] !== undefined) {
      buyRate = buyRates.categories[item.type];
    }

    const sellCopper = Math.floor(totalCopper * (buyRate / 100));

    return {
      gold: Math.floor(sellCopper / 10000),
      silver: Math.floor((sellCopper % 10000) / 100),
      copper: sellCopper % 100
    };
  };

  // Calculate merchant markup price (typically 150-200% of value to prevent exploitation)
  const calculateMerchantPrice = (item, markupPercent = 175) => {
    if (!item.value) return { gold: 0, silver: 1, copper: 0 };

    const totalCopper = calculateTotalCopper(item.value);
    const merchantCopper = Math.floor(totalCopper * (markupPercent / 100));

    return {
      platinum: Math.floor(merchantCopper / 1000000),
      gold: Math.floor((merchantCopper % 1000000) / 10000),
      silver: Math.floor((merchantCopper % 10000) / 100),
      copper: merchantCopper % 100
    };
  };

  // Handle item selection for shopping cart
  const handleItemSelection = (shopItemIndex) => {
    const shopItem = shopItems[shopItemIndex];
    if (!shopItem) return;

    const newSelectedItems = { ...selectedItems };
    const currentSelected = newSelectedItems[shopItemIndex] || 0;
    const availableQuantity = shopItem.quantity;

    if (currentSelected < availableQuantity) {
      if (newSelectedItems[shopItemIndex]) {
        // Increase quantity if already selected and under limit
        newSelectedItems[shopItemIndex]++;
      } else {
        // Add new item with quantity 1
        newSelectedItems[shopItemIndex] = 1;
      }
      setSelectedItems(newSelectedItems);
    } else {
      // Show notification when trying to select more than available
      showNotification(`Only ${availableQuantity} available!`, 'error');
    }
  };

  // Remove item from selection or decrease quantity
  const handleItemDeselection = (shopItemIndex) => {
    const newSelectedItems = { ...selectedItems };

    if (newSelectedItems[shopItemIndex] > 1) {
      newSelectedItems[shopItemIndex]--;
    } else {
      delete newSelectedItems[shopItemIndex];
    }

    setSelectedItems(newSelectedItems);
  };

  // Calculate total cost of selected items
  const calculateTotalCost = () => {
    let totalCopper = 0;

    Object.entries(selectedItems).forEach(([shopItemIndex, quantity]) => {
      const shopItem = shopItems[parseInt(shopItemIndex)];
      if (shopItem) {
        totalCopper += calculateTotalCopper(shopItem.customPrice) * quantity;
      }
    });

    return {
      platinum: Math.floor(totalCopper / 1000000),
      gold: Math.floor((totalCopper % 1000000) / 10000),
      silver: Math.floor((totalCopper % 10000) / 100),
      copper: totalCopper % 100
    };
  };

  // Check if player can afford all selected items
  const canAffordSelection = () => {
    const totalCost = calculateTotalCost();
    return playerTotalCopper >= calculateTotalCopper(totalCost);
  };

  // Handle sell item selection
  const handleSellItemSelection = (item) => {
    const newSelectedSellItems = { ...selectedSellItems };

    if (newSelectedSellItems[item.id]) {
      // Increase quantity if already selected (up to available quantity)
      if (newSelectedSellItems[item.id] < (item.quantity || 1)) {
        newSelectedSellItems[item.id]++;
      }
    } else {
      // Add new item with quantity 1
      newSelectedSellItems[item.id] = 1;
    }

    setSelectedSellItems(newSelectedSellItems);
  };

  // Remove item from sell selection or decrease quantity
  const handleSellItemDeselection = (item) => {
    const newSelectedSellItems = { ...selectedSellItems };

    if (newSelectedSellItems[item.id] > 1) {
      newSelectedSellItems[item.id]--;
    } else {
      delete newSelectedSellItems[item.id];
    }

    setSelectedSellItems(newSelectedSellItems);
  };

  // Calculate total sell value of selected items
  const calculateTotalSellValue = () => {
    let totalCopper = 0;

    Object.entries(selectedSellItems).forEach(([itemId, quantity]) => {
      const item = inventoryItems.find(invItem => invItem.id === itemId);
      if (item) {
        const sellPrice = calculateSellPrice(item);
        totalCopper += calculateTotalCopper(sellPrice) * quantity;
      }
    });

    return {
      platinum: Math.floor(totalCopper / 1000000),
      gold: Math.floor((totalCopper % 1000000) / 10000),
      silver: Math.floor((totalCopper % 10000) / 100),
      copper: totalCopper % 100
    };
  };

  // Handle purchase
  const handlePurchase = (shopItem, quantity = 1) => {
    const item = getItemById(shopItem.itemId);
    if (!item) return;

    const totalCost = calculateTotalCopper(shopItem.customPrice) * quantity;

    if (!canAfford(shopItem.customPrice, quantity)) {
      showNotification('Not enough gold!', 'error');
      return;
    }

    // Deduct currency
    let remainingCost = totalCost;
    let newCurrency = { ...currency };

    // Convert player currency to copper, deduct cost, then convert back
    let totalPlayerCopper = calculateTotalCopper(newCurrency);
    totalPlayerCopper -= remainingCost;

    // Convert back to platinum/gold/silver/copper
    newCurrency.platinum = Math.floor(totalPlayerCopper / 1000000);
    totalPlayerCopper %= 1000000;
    newCurrency.gold = Math.floor(totalPlayerCopper / 10000);
    totalPlayerCopper %= 10000;
    newCurrency.silver = Math.floor(totalPlayerCopper / 100);
    newCurrency.copper = totalPlayerCopper % 100;

    updateCurrency(newCurrency);

    // Add item to inventory - restore original library value
    for (let i = 0; i < quantity; i++) {
      // Pass the original item directly to preserve all properties
      addItemFromLibrary(item, {
        preserveProperties: true,
        quantity: 1
      });
    }

    // Remove purchased items from merchant's inventory
    const updatedShopItems = [...(creature.shopInventory?.items || [])];
    const shopItemIndex = updatedShopItems.findIndex(item => item.itemId === shopItem.itemId);

    if (shopItemIndex !== -1) {
      const currentShopItem = updatedShopItems[shopItemIndex];
      if (currentShopItem.quantity > quantity) {
        // Reduce quantity if more than purchased amount
        updatedShopItems[shopItemIndex] = {
          ...currentShopItem,
          quantity: currentShopItem.quantity - quantity
        };
      } else {
        // Remove item completely if quantity is equal or less than purchased amount
        updatedShopItems.splice(shopItemIndex, 1);
      }

      // Update the creature's shop inventory
      const updatedShopInventory = {
        ...creature.shopInventory,
        items: updatedShopItems
      };
      updateCreature(creature.id, { shopInventory: updatedShopInventory });
    }

    showNotification(`Purchased ${quantity}x ${item.name}!`, 'success');
    setPurchaseQuantity(1);
  };

  // Handle purchasing all selected items
  const handlePurchaseAll = () => {
    if (Object.keys(selectedItems).length === 0) {
      showNotification('No items selected!', 'error');
      return;
    }

    if (!canAffordSelection()) {
      showNotification('Not enough gold for selected items!', 'error');
      return;
    }

    const totalCost = calculateTotalCost();
    let totalPlayerCopper = calculateTotalCopper(currency);
    totalPlayerCopper -= calculateTotalCopper(totalCost);

    // Convert back to platinum/gold/silver/copper
    const newCurrency = {
      platinum: Math.floor(totalPlayerCopper / 1000000),
      gold: Math.floor((totalPlayerCopper % 1000000) / 10000),
      silver: Math.floor((totalPlayerCopper % 10000) / 100),
      copper: totalPlayerCopper % 100
    };

    updateCurrency(newCurrency);

    // Add all items to inventory and remove from merchant inventory
    let purchasedItems = [];
    const updatedShopItems = [...(creature.shopInventory?.items || [])];

    // Process purchases in reverse order to avoid index shifting issues when removing items
    const sortedEntries = Object.entries(selectedItems).sort(([a], [b]) => parseInt(b) - parseInt(a));

    sortedEntries.forEach(([shopItemIndex, quantity]) => {
      const shopItem = shopItems[parseInt(shopItemIndex)];
      const item = getItemById(shopItem.itemId);
      if (item) {
        for (let i = 0; i < quantity; i++) {
          // Pass the original item directly to preserve all properties
          addItemFromLibrary(item, {
            preserveProperties: true,
            quantity: 1
          });
        }
        purchasedItems.push(`${quantity}x ${item.name}`);

        // Remove purchased items from merchant's inventory
        const merchantItemIndex = updatedShopItems.findIndex(merchantItem => merchantItem.itemId === shopItem.itemId);
        if (merchantItemIndex !== -1) {
          const currentMerchantItem = updatedShopItems[merchantItemIndex];
          if (currentMerchantItem.quantity > quantity) {
            // Reduce quantity if more than purchased amount
            updatedShopItems[merchantItemIndex] = {
              ...currentMerchantItem,
              quantity: currentMerchantItem.quantity - quantity
            };
          } else {
            // Remove item completely if quantity is equal or less than purchased amount
            updatedShopItems.splice(merchantItemIndex, 1);
          }
        }
      }
    });

    // Update the creature's shop inventory
    const updatedShopInventory = {
      ...creature.shopInventory,
      items: updatedShopItems
    };
    updateCreature(creature.id, { shopInventory: updatedShopInventory });

    showNotification(`Purchased: ${purchasedItems.join(', ')} for ${formatCurrency(totalCost)}!`, 'success');
    setSelectedItems({});
  };

  // Handle selling an item from inventory
  const handleSell = (inventoryItem, quantity = 1) => {
    if (!inventoryItem) return;

    const sellPrice = calculateSellPrice(inventoryItem);
    const totalEarnings = calculateTotalCopper(sellPrice) * quantity;

    // Add currency to player
    let newCurrency = { ...currency };
    let totalPlayerCopper = calculateTotalCopper(newCurrency);
    totalPlayerCopper += totalEarnings;

    // Convert back to platinum/gold/silver/copper
    newCurrency.platinum = Math.floor(totalPlayerCopper / 1000000);
    totalPlayerCopper %= 1000000;
    newCurrency.gold = Math.floor(totalPlayerCopper / 10000);
    totalPlayerCopper %= 10000;
    newCurrency.silver = Math.floor(totalPlayerCopper / 100);
    newCurrency.copper = totalPlayerCopper % 100;

    updateCurrency(newCurrency);

    // Add item to merchant's inventory
    const updatedShopItems = [...(creature.shopInventory?.items || [])];
    // Use the original library item ID, not the inventory item's UUID
    // If originalItemId is not available, try to find the item in the library by name and type
    let libraryItemId = inventoryItem.originalItemId || inventoryItem.id;

    // If we don't have originalItemId, try to find the matching library item
    if (!inventoryItem.originalItemId) {
      const matchingLibraryItem = itemLibrary.find(libItem =>
        libItem.name === inventoryItem.name &&
        libItem.type === inventoryItem.type &&
        libItem.iconId === inventoryItem.iconId
      );
      if (matchingLibraryItem) {
        libraryItemId = matchingLibraryItem.id;
      }
    }

    const existingShopItem = updatedShopItems.find(shopItem => shopItem.itemId === libraryItemId);

    if (existingShopItem) {
      // Increase quantity if item already exists in shop
      existingShopItem.quantity = (existingShopItem.quantity || 1) + quantity;
    } else {
      // Add new item to shop with proper merchant pricing
      // Get the original item from the library to ensure we have the correct value
      const originalItem = getItemById(libraryItemId);
      const basePrice = originalItem ? calculateMerchantPrice(originalItem) :
                       inventoryItem.value || { gold: 0, silver: 1, copper: 0 };

      updatedShopItems.push({
        itemId: libraryItemId,
        quantity: quantity,
        customPrice: basePrice // Use proper merchant markup price
      });
    }

    // Update the creature's shop inventory
    const updatedShopInventory = {
      ...creature.shopInventory,
      items: updatedShopItems
    };
    console.log('Updating creature shop inventory after selling:', {
      creatureId: creature.id,
      itemsSold: `${quantity}x ${inventoryItem.name}`,
      newShopItemsCount: updatedShopItems.length,
      libraryItemId: libraryItemId
    });
    updateCreature(creature.id, { shopInventory: updatedShopInventory });

    // Remove from inventory
    if (inventoryItem.quantity && inventoryItem.quantity > quantity) {
      // Reduce quantity if it's a stack
      // Note: This would need to be implemented in the inventory store
      removeItem(inventoryItem.id, quantity);
    } else {
      // Remove entire item
      removeItem(inventoryItem.id);
    }

    showNotification(`Sold ${quantity}x ${inventoryItem.name} for ${formatCurrency(sellPrice)}!`, 'success');
    setSellQuantity(1);
  };

  // Handle selling all selected items
  const handleSellAll = () => {
    if (Object.keys(selectedSellItems).length === 0) {
      showNotification('No items selected for sale!', 'error');
      return;
    }

    const totalValue = calculateTotalSellValue();
    let totalPlayerCopper = calculateTotalCopper(currency);
    totalPlayerCopper += calculateTotalCopper(totalValue);

    // Convert back to platinum/gold/silver/copper
    const newCurrency = {
      platinum: Math.floor(totalPlayerCopper / 1000000),
      gold: Math.floor((totalPlayerCopper % 1000000) / 10000),
      silver: Math.floor((totalPlayerCopper % 10000) / 100),
      copper: totalPlayerCopper % 100
    };

    updateCurrency(newCurrency);

    // Remove all items from inventory and add to merchant's shop
    let soldItems = [];
    const updatedShopItems = [...(creature.shopInventory?.items || [])];

    Object.entries(selectedSellItems).forEach(([itemId, quantity]) => {
      const item = inventoryItems.find(invItem => invItem.id === itemId);
      if (item) {
        removeItem(itemId, quantity);
        soldItems.push(`${quantity}x ${item.name}`);

        // Add item to merchant's inventory
        // Use the original library item ID, not the inventory item's UUID
        // If originalItemId is not available, try to find the item in the library by name and type
        let libraryItemId = item.originalItemId || itemId;

        // If we don't have originalItemId, try to find the matching library item
        if (!item.originalItemId) {
          const matchingLibraryItem = itemLibrary.find(libItem =>
            libItem.name === item.name &&
            libItem.type === item.type &&
            libItem.iconId === item.iconId
          );
          if (matchingLibraryItem) {
            libraryItemId = matchingLibraryItem.id;
          }
        }

        const existingShopItem = updatedShopItems.find(shopItem => shopItem.itemId === libraryItemId);
        if (existingShopItem) {
          // Increase quantity if item already exists in shop
          existingShopItem.quantity = (existingShopItem.quantity || 1) + quantity;
        } else {
          // Add new item to shop with proper merchant pricing
          // Get the original item from the library to ensure we have the correct value
          const originalItem = getItemById(libraryItemId);
          const basePrice = originalItem ? calculateMerchantPrice(originalItem) :
                           item.value || { gold: 0, silver: 1, copper: 0 };

          updatedShopItems.push({
            itemId: libraryItemId,
            quantity: quantity,
            customPrice: basePrice // Use proper merchant markup price
          });
        }
      }
    });

    // Update the creature's shop inventory
    const updatedShopInventory = {
      ...creature.shopInventory,
      items: updatedShopItems
    };
    updateCreature(creature.id, { shopInventory: updatedShopInventory });

    showNotification(`Sold: ${soldItems.join(', ')} for ${formatCurrency(totalValue)}!`, 'success');
    setSelectedSellItems({});
  };


  
  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: 'success' });
    }, 3000);
  };
  
  // Handle tooltip - consistent with inventory system, but include shop price
  const handleItemMouseEnter = (e, item, shopItem = null) => {
    // Create enhanced item with price info for tooltip
    const enhancedItem = shopItem ? {
      ...item,
      shopPrice: shopItem.customPrice,
      isShopItem: true
    } : item;

    setTooltip({
      show: true,
      item: enhancedItem,
      x: e.clientX + 15,
      y: e.clientY - 10
    });
  };

  const handleItemMouseMove = (e, item, shopItem = null) => {
    if (tooltip.show && tooltip.item) {
      const enhancedItem = shopItem ? {
        ...item,
        shopPrice: shopItem.customPrice,
        isShopItem: true
      } : item;

      setTooltip({
        ...tooltip,
        item: enhancedItem,
        x: e.clientX + 15,
        y: e.clientY - 10
      });
    }
  };

  const handleItemMouseLeave = () => {
    setTooltip({ show: false, item: null, x: 0, y: 0 });
  };
  
  // Format currency display with coin images
  const formatCurrency = (price) => {
    const parts = [];
    if (price.platinum > 0) {
      parts.push(
        <span key="platinum" className="currency-part">
          <span className="currency-number">{price.platinum}</span>
          <img
            src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_coin_04.jpg"
            alt="Platinum"
            className="currency-coin-small"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23e5e4e2"/></svg>';
            }}
          />
        </span>
      );
    }
    if (price.gold > 0) {
      parts.push(
        <span key="gold" className="currency-part">
          <span className="currency-number">{price.gold}</span>
          <img
            src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_coin_01.jpg"
            alt="Gold"
            className="currency-coin-small"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23ffd700"/></svg>';
            }}
          />
        </span>
      );
    }
    if (price.silver > 0) {
      parts.push(
        <span key="silver" className="currency-part">
          <span className="currency-number">{price.silver}</span>
          <img
            src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_coin_03.jpg"
            alt="Silver"
            className="currency-coin-small"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23c0c0c0"/></svg>';
            }}
          />
        </span>
      );
    }
    if (price.copper > 0) {
      parts.push(
        <span key="copper" className="currency-part">
          <span className="currency-number">{price.copper}</span>
          <img
            src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_coin_05.jpg"
            alt="Copper"
            className="currency-coin-small"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23cd7f32"/></svg>';
            }}
          />
        </span>
      );
    }

    if (parts.length === 0) {
      return (
        <span className="currency-part">
          <span className="currency-number">0</span>
          <img
            src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_coin_05.jpg"
            alt="Copper"
            className="currency-coin-small"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23cd7f32"/></svg>';
            }}
          />
        </span>
      );
    }

    return <span className="currency-display">{parts}</span>;
  };
  
  // Listen for window scale changes to force re-render
  useEffect(() => {
    const handleWindowScaleChange = () => {
      setForceRender(prev => prev + 1);
    };

    window.addEventListener('windowScaleChanged', handleWindowScaleChange);
    return () => window.removeEventListener('windowScaleChanged', handleWindowScaleChange);
  }, []);

  // Cleanup
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current);
      }
    };
  }, []);
  
  if (!isOpen) return null;
  
  // Get safe portal target
  const portalTarget = getSafePortalTarget();

  // Safety check - don't render if no portal target available
  if (!portalTarget) {
    console.error('ShopWindow: No portal target available, cannot render');
    return null;
  }

  return createPortal(
    <div className="shop-window-overlay">
      <div
        ref={windowRef}
        className="shop-window wow-style-window"
        style={{
          left: position.x,
          top: position.y,
          cursor: isDragging ? 'move' : 'default',
          transformOrigin: 'top left',
          transform: windowScale !== 1 ? `scale(${windowScale})` : undefined
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Window Header */}
        <div className="shop-window-header">
          <div className="shop-title">
            <div className="merchant-portrait">
              <img
                src={`https://wow.zamimg.com/images/wow/icons/large/${creature.tokenIcon || 'inv_misc_questionmark'}.jpg`}
                alt={creature.name}
                onError={(e) => {
                  e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                }}
              />
            </div>
            <div className="shop-info">
              <span className="shop-name">{shopName}</span>
              <div className="buy-rates-display">
                <span className="buy-rates-label">Buy Rates:</span>
                <div className="buy-rates-list">
                  {creature.shopInventory?.buyRates?.categories && Object.entries(creature.shopInventory.buyRates.categories)
                    .sort(([,a], [,b]) => b - a) // Sort by rate descending
                    .map(([category, rate]) => (
                    <span key={category} className="buy-rate-item">
                      {category.charAt(0).toUpperCase() + category.slice(1)}: {rate}%
                    </span>
                  ))}
                  {creature.shopInventory?.buyRates?.default && (
                    <span className="buy-rate-item default-rate">
                      Other: {creature.shopInventory?.buyRates?.default}%
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Global Filters - Centered */}
          <div className="header-filters">
            <input
              type="text"
              placeholder="Search..."
              value={globalFilters.searchQuery}
              onChange={(e) => setGlobalFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="header-filter-input"
            />
            <select
              value={globalFilters.selectedItemType}
              onChange={(e) => setGlobalFilters(prev => ({ ...prev, selectedItemType: e.target.value }))}
              className="header-filter-select"
            >
              <option value="all">All Types</option>
              {globalFilterOptions.types.map(type => (
                <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
              ))}
            </select>
            <select
              value={globalFilters.selectedQuality}
              onChange={(e) => setGlobalFilters(prev => ({ ...prev, selectedQuality: e.target.value }))}
              className="header-filter-select"
            >
              <option value="all">All Qualities</option>
              {globalFilterOptions.qualities.map(quality => (
                <option key={quality} value={quality}>{quality.charAt(0).toUpperCase() + quality.slice(1)}</option>
              ))}
            </select>
            <button
              onClick={() => setGlobalFilters({ searchQuery: '', selectedItemType: 'all', selectedQuality: 'all' })}
              className="header-reset-btn"
              title="Reset filters"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>



        {/* Shop Content */}
        <div className="shop-content">
          <div className="merchant-content">
              {/* Merchant Items Grid */}
              <div className="merchant-items">
                <div className="merchant-header">Merchant Inventory</div>
                <div className="merchant-grid">
                    {shopItems.map((shopItem, index) => {
                      const item = getItemById(shopItem.itemId);
                      if (!item) return null;

                      const affordable = canAfford(shopItem.customPrice);
                      const itemWidth = item.width || 1;
                      const itemHeight = item.height || 1;
                      const matchesFilter = doesItemMatchFilter(item, globalFilters);

                      return (
                        <div
                          key={index}
                          className={`item-slot ${!affordable ? 'unaffordable' : ''} ${selectedItems[index] ? 'selected' : ''} ${!matchesFilter ? 'filtered-out' : 'filtered-in'}`}
                          style={{
                            gridColumn: `span ${itemWidth}`,
                            gridRow: `span ${itemHeight}`,
                            width: `${itemWidth * 56 + (itemWidth - 1) * 2}px`,
                            height: `${itemHeight * 56 + (itemHeight - 1) * 2}px`
                          }}
                          onClick={(e) => {
                            if (e.ctrlKey || e.metaKey) {
                              handleItemDeselection(index);
                            } else {
                              handleItemSelection(index);
                            }
                          }}
                        >
                          <div
                            className="item-icon"
                            style={{
                              backgroundImage: `url(https://wow.zamimg.com/images/wow/icons/large/${item.iconId}.jpg)`
                            }}
                            onMouseEnter={(e) => handleItemMouseEnter(e, item, shopItem)}
                            onMouseMove={(e) => handleItemMouseMove(e, item, shopItem)}
                            onMouseLeave={handleItemMouseLeave}
                          />
                          {shopItem.quantity > 1 && (
                            <div className="item-quantity">{shopItem.quantity}</div>
                          )}
                          {selectedItems[index] && (
                            <div className="selected-quantity">{selectedItems[index]}</div>
                          )}
                        </div>
                      );
                    })}
                    {/* Fill remaining grid space with empty slots - 8x8 grid (64 slots) */}
                    {Array.from({ length: Math.max(0, 64 - shopItems.length) }).map((_, index) => (
                      <div key={`empty-${index}`} className="item-slot empty"></div>
                    ))}
                </div>
              </div>

              {/* Player Inventory for Selling */}
              <div className="player-inventory">
                <div className="inventory-header">Your Items</div>
                <div className="items-grid inventory-grid">
                    {inventoryItems.map((item, index) => {
                      const matchesFilter = doesItemMatchFilter(item, globalFilters);

                      return (
                        <div
                          key={item.id}
                          className={`item-slot ${selectedSellItems[item.id] ? 'selected' : ''} ${!matchesFilter ? 'filtered-out' : 'filtered-in'}`}
                          style={{
                            gridColumn: `span ${item.width || 1}`,
                            gridRow: `span ${item.height || 1}`,
                            width: `${(item.width || 1) * 56 + ((item.width || 1) - 1) * 2}px`,
                            height: `${(item.height || 1) * 56 + ((item.height || 1) - 1) * 2}px`
                          }}
                          onClick={(e) => {
                            if (e.ctrlKey || e.metaKey) {
                              handleSellItemDeselection(item);
                            } else {
                              handleSellItemSelection(item);
                            }
                          }}
                        >
                          <div
                            className="item-icon"
                            style={{
                              backgroundImage: `url(https://wow.zamimg.com/images/wow/icons/large/${item.iconId}.jpg)`
                            }}
                            onMouseEnter={(e) => handleItemMouseEnter(e, item)}
                            onMouseMove={(e) => handleItemMouseMove(e, item)}
                            onMouseLeave={handleItemMouseLeave}
                          />
                          {item.quantity > 1 && (
                            <div className="item-quantity">{item.quantity}</div>
                          )}
                          {selectedSellItems[item.id] && (
                            <div className="selected-quantity sell-quantity">{selectedSellItems[item.id]}</div>
                          )}
                        </div>
                      );
                    })}
                    {/* Fill remaining grid space with empty slots - 8x8 grid (64 slots) */}
                    {Array.from({ length: Math.max(0, 64 - inventoryItems.length) }).map((_, index) => (
                      <div key={`empty-inv-${index}`} className="item-slot empty"></div>
                    ))}
                </div>
              </div>
          </div>
        </div>

        {/* Player Currency Display */}
        <div className="player-currency-display">
          <div className="currency-display-simple">
            <div className="currency-coin">
              <img
                src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_coin_04.jpg"
                alt="Platinum"
                className="coin-icon"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23e5e4e2"/></svg>';
                }}
              />
              <span className="currency-number">{currency.platinum}</span>
            </div>
            <div className="currency-coin">
              <img
                src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_coin_01.jpg"
                alt="Gold"
                className="coin-icon"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23ffd700"/></svg>';
                }}
              />
              <span className="currency-number">{currency.gold}</span>
            </div>
            <div className="currency-coin">
              <img
                src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_coin_03.jpg"
                alt="Silver"
                className="coin-icon"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23c0c0c0"/></svg>';
                }}
              />
              <span className="currency-number">{currency.silver}</span>
            </div>
            <div className="currency-coin">
              <img
                src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_coin_05.jpg"
                alt="Copper"
                className="coin-icon"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23cd7f32"/></svg>';
                }}
              />
              <span className="currency-number">{currency.copper}</span>
            </div>
          </div>
        </div>
        
        {/* Notification */}
        {notification.show && (
          <div className={`shop-notification ${notification.type}`}>
            {notification.message}
          </div>
        )}

        {/* Tooltip */}
        {tooltip.show && tooltip.item && (
          <TooltipPortal>
            <div
              style={{
                position: 'fixed',
                left: tooltip.x,
                top: tooltip.y,
                transform: 'translate(10px, -50%)',
                pointerEvents: 'none',
                zIndex: 999999999
              }}
            >
              <ItemTooltip item={tooltip.item} />
            </div>
          </TooltipPortal>
        )}
      </div>

      {/* External Shopping Cart */}
      {Object.keys(selectedItems).length > 0 && (
        <div className="external-shopping-cart">
          <div className="cart-header">
            <i className="fas fa-shopping-cart"></i>
            Shopping Cart
          </div>
          <div className="cart-items">
            {Object.entries(selectedItems).map(([shopItemIndex, quantity]) => {
              const shopItem = shopItems[parseInt(shopItemIndex)];
              const item = getItemById(shopItem?.itemId);
              if (!item) return null;

              const totalItemPrice = {
                platinum: Math.floor(calculateTotalCopper(shopItem.customPrice) * quantity / 1000000),
                gold: Math.floor((calculateTotalCopper(shopItem.customPrice) * quantity % 1000000) / 10000),
                silver: Math.floor((calculateTotalCopper(shopItem.customPrice) * quantity % 10000) / 100),
                copper: (calculateTotalCopper(shopItem.customPrice) * quantity) % 100
              };

              return (
                <div key={shopItemIndex} className="cart-item">
                  <span className="cart-item-name">{quantity}x {item.name}</span>
                  <span className="cart-item-price">{formatCurrency(totalItemPrice)}</span>
                </div>
              );
            })}
          </div>
          <div className="cart-total">
            <strong>Total: {formatCurrency(calculateTotalCost())}</strong>
          </div>
          <div className="cart-actions">
            <button
              className="buy-all-button"
              onClick={handlePurchaseAll}
              disabled={!canAffordSelection()}
            >
              Buy All ({Object.keys(selectedItems).length} items)
            </button>
            <button
              className="clear-cart-button"
              onClick={() => setSelectedItems({})}
            >
              Clear Cart
            </button>
          </div>
        </div>
      )}

      {/* External Sell Cart */}
      {Object.keys(selectedSellItems).length > 0 && (
        <div className="external-sell-cart">
          <div className="cart-header">
            <i className="fas fa-coins"></i>
            Sell Items
          </div>
          <div className="cart-items">
            {Object.entries(selectedSellItems).map(([itemId, quantity]) => {
              const item = inventoryItems.find(invItem => invItem.id === itemId);
              if (!item) return null;

              const sellPrice = calculateSellPrice(item);

              return (
                <div key={itemId} className="cart-item">
                  <span className="cart-item-name">{quantity}x {item.name}</span>
                  <span className="cart-item-price sell-price">{formatCurrency({
                    platinum: Math.floor(calculateTotalCopper(sellPrice) * quantity / 1000000),
                    gold: Math.floor((calculateTotalCopper(sellPrice) * quantity % 1000000) / 10000),
                    silver: Math.floor((calculateTotalCopper(sellPrice) * quantity % 10000) / 100),
                    copper: (calculateTotalCopper(sellPrice) * quantity) % 100
                  })}</span>
                </div>
              );
            })}
          </div>
          <div className="cart-total">
            <strong>Total: {formatCurrency(calculateTotalSellValue())}</strong>
          </div>
          <div className="cart-actions">
            <button
              className="sell-all-button"
              onClick={handleSellAll}
            >
              Sell All ({Object.keys(selectedSellItems).length} items)
            </button>
            <button
              className="clear-sell-button"
              onClick={() => setSelectedSellItems({})}
            >
              Clear Selection
            </button>
          </div>
        </div>
      )}
    </div>,
    portalTarget
  );
};

export default ShopWindow;
