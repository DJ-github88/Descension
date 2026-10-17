import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useItemStore from '../../store/itemStore';
import useInventoryStore from '../../store/inventoryStore';
import useCreatureStore from '../../store/creatureStore';
import useSettingsStore from '../../store/settingsStore';
import ItemTooltip from '../item-generation/ItemTooltip';
import TooltipPortal from '../tooltips/TooltipPortal';
import { useTooltipPosition } from '../common/useTooltipPosition';
import QuantitySelector from '../common/QuantitySelector';
import { getSafePortalTarget } from '../../utils/portalUtils';
import { getIconUrl, getCreatureTokenIconUrl } from '../../utils/assetManager';
import './ShopWindow.css';

const ShopWindow = ({ isOpen, onClose, creature }) => {
 const { items: itemLibrary } = useItemStore();
 const { currency, updateCurrency, addItemFromLibrary, items: inventoryItems, removeItem } = useInventoryStore();
 const { updateCreature } = useCreatureStore();
 const windowScale = useSettingsStore(state => state.windowScale);

 // Local state
 const [selectedItems, setSelectedItems] = useState({}); // Changed to object to track quantities
 const [selectedSellItems, setSelectedSellItems] = useState({}); // Track items selected for selling
 const [purchaseQuantity, setPurchaseQuantity] = useState(1);
 const [sellQuantity, setSellQuantity] = useState(1);
 const [merchantQuantities, setMerchantQuantities] = useState({}); // Track quantities for merchant items
 const [playerQuantities, setPlayerQuantities] = useState({}); // Track quantities for player items
 const [tooltip, setTooltip] = useState({ show: false, item: null });
 const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
 const { adjustedPosition, tooltipRef } = useTooltipPosition(mousePosition, tooltip.show);
 const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

 // Unified filter state for both inventories
 const [globalFilters, setGlobalFilters] = useState({
  searchQuery: '',
  selectedItemType: 'all',
  selectedQuality: 'all'
 });
 const [showFilters, setShowFilters] = useState(false);

 // Dismiss filters popup on Escape key
 useEffect(() => {
  if (!showFilters) return;
  const handleKeyDown = (e) => {
   if (e.key === 'Escape') {
    setShowFilters(false);
   }
  };
  window.addEventListener('keydown', handleKeyDown);
  return () => window.removeEventListener('keydown', handleKeyDown);
 }, [showFilters]);

 // Window position state
 const [position, setPosition] = useState({ x: 100, y: 100 });
 const [isDragging, setIsDragging] = useState(false);
 const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
 const [forceRender, setForceRender] = useState(0);

 // Refs
 const windowRef = useRef(null);
 const tooltipTimeoutRef = useRef(null);
 const dragOffsetRef = useRef({ x: 0, y: 0 }); // Ref avoids stale closure in mousemove handler
 const shopDragRafRef = useRef(null);      // RAF handle for throttled position updates

 // Get shop info
 const shopName = creature?.shopInventory?.shopName || `${creature?.name || 'Merchant'}'s Shop`;
 const shopDescription = creature?.shopInventory?.shopDescription || creature?.description || 'Welcome to our shop!';
 const merchantRole = creature?.role || (creature?.type === 'shopkeeper' ? 'Frontier Outfitter & Merchant' : null);
 const shopItems = React.useMemo(() => {
  if (!creature) return [];
  if (creature.shopInventory?.items && creature.shopInventory.items.length > 0) {
   return creature.shopInventory.items;
  }
  // Fallback 1: Populate shop items from creature's lootTable if available
  if (creature.lootTable?.items && creature.lootTable.items.length > 0) {
   return creature.lootTable.items.map((lootItem, idx) => ({
    itemId: lootItem.itemId || lootItem.id || `shop-item-${idx}`,
    quantity: typeof lootItem.quantity === 'object'
     ? (lootItem.quantity.max || lootItem.quantity.min || 1)
     : (lootItem.quantity || 1),
    customPrice: lootItem.value || {
     gold: 0,
     silver: Math.floor(Math.random() * 8) + 1,
     copper: 0
    },
    fullItem: {
     id: lootItem.itemId || lootItem.id || `shop-item-${idx}`,
     name: lootItem.name,
     type: lootItem.type || 'miscellaneous',
     subtype: lootItem.subtype,
     quality: lootItem.quality || 'common',
     rarity: lootItem.quality || 'common',
     iconId: lootItem.iconId || lootItem.icon || 'inv_misc_questionmark',
     icon: lootItem.iconId || lootItem.icon || 'inv_misc_questionmark',
     description: lootItem.description,
     value: lootItem.value || { silver: 5 }
    }
   }));
  }
  // Fallback 2: Thematic outfitter provisions for merchants / shopkeepers
  const isMerchant = creature.isShopkeeper || creature.type === 'shopkeeper' ||
   (Array.isArray(creature.tags) && (creature.tags.includes('shopkeeper') || creature.tags.includes('merchant')));
  if (isMerchant) {
   return [
    {
     itemId: 'featherquill-survey-map',
     quantity: 3,
     customPrice: { platinum: 0, gold: 1, silver: 2, copper: 0 },
     fullItem: {
      id: 'featherquill-survey-map',
      name: "Regional Survey Chart",
      type: 'miscellaneous',
      subtype: 'MAP',
      quality: 'uncommon',
      rarity: 'uncommon',
      iconId: 'Misc/Books/book-scroll-rolled-red-wax-seal',
      icon: 'Misc/Books/book-scroll-rolled-red-wax-seal',
      description: 'A hand-inked topographical survey detailing creeks, ravines, and elevation contours of the surrounding frontier.',
      value: { gold: 1, silver: 2, copper: 0 },
      width: 1,
      height: 1
     }
    },
    {
     itemId: 'satchel',
     quantity: 2,
     customPrice: { platinum: 0, gold: 0, silver: 4, copper: 50 },
     fullItem: {
      id: 'satchel',
      name: "Surveyor's Satchel",
      type: 'container',
      subtype: 'BAG',
      quality: 'common',
      rarity: 'common',
      iconId: 'Container/Pouch/brown-backpack-satchel',
      icon: 'Container/Pouch/brown-backpack-satchel',
      description: 'A weather-treated waxed cloth satchel fitted with brass buckles and partitioned pockets.',
      value: { gold: 0, silver: 4, copper: 50 },
      width: 1,
      height: 1
     }
    },
    {
     itemId: 'outfitter-climbing-kit',
     quantity: 4,
     customPrice: { platinum: 0, gold: 0, silver: 6, copper: 0 },
     fullItem: {
      id: 'outfitter-climbing-kit',
      name: 'Braided Climbing Silk',
      type: 'miscellaneous',
      subtype: 'SURVIVAL',
      quality: 'uncommon',
      rarity: 'uncommon',
      iconId: 'Misc/Profession Resources/Tailoring/resource-spotted-fabric-leather-blue-dots',
      icon: 'Misc/Profession Resources/Tailoring/resource-spotted-fabric-leather-blue-dots',
      description: 'Fifty feet of braided silk rope with tempered iron pitons. Reliable on treacherous rock faces.',
      value: { gold: 0, silver: 6, copper: 0 },
      width: 1,
      height: 1
     }
    },
    {
     itemId: 'gathering-pickaxe',
     quantity: 2,
     customPrice: { platinum: 0, gold: 0, silver: 3, copper: 0 },
     fullItem: {
      id: 'gathering-pickaxe',
      name: "Prospector's Tamping Pick",
      type: 'miscellaneous',
      subtype: 'CRAFTING',
      quality: 'common',
      rarity: 'common',
      iconId: 'Misc/Profession Resources/Tools/pickaxe',
      icon: 'Misc/Profession Resources/Tools/pickaxe',
      description: 'Sturdy steel pickaxe for breaking rock samples and anchoring cliffline traverses.',
      value: { gold: 0, silver: 3, copper: 0 },
      width: 2,
      height: 1
     }
    },
    {
     itemId: 'frontier-field-rations',
     quantity: 12,
     customPrice: { platinum: 0, gold: 0, silver: 0, copper: 85 },
     fullItem: {
      id: 'frontier-field-rations',
      name: "Fortified Pemmican Rations",
      type: 'consumable',
      subtype: 'FOOD',
      quality: 'common',
      rarity: 'common',
      iconId: 'Misc/Profession Resources/Cooking/Food/Other/bread-loaf-rustic-artisan-slashes',
      icon: 'Misc/Profession Resources/Cooking/Food/Other/bread-loaf-rustic-artisan-slashes',
      description: 'Dense dried meat, berries, and tallow compressed into weather-sealed squares. Keeps for months.',
      value: { gold: 0, silver: 0, copper: 85 },
      width: 1,
      height: 1
     }
    },
    {
     itemId: 'brass-dowsing-needle',
     quantity: 1,
     customPrice: { platinum: 0, gold: 2, silver: 5, copper: 0 },
     fullItem: {
      id: 'brass-dowsing-needle',
      name: 'Brass Compass & Calipers',
      type: 'miscellaneous',
      subtype: 'NAVIGATION',
      quality: 'rare',
      rarity: 'rare',
      iconId: 'Misc/Profession Resources/Mining/resource-crystal-cluster-blue-teal-mineral',
      icon: 'Misc/Profession Resources/Mining/resource-crystal-cluster-blue-teal-mineral',
      description: 'A balanced needle mounted on a jeweled pivot to detect mineral lodes and true magnetic north.',
      value: { gold: 2, silver: 5, copper: 0 },
      width: 1,
      height: 1
     }
    },
    {
     itemId: 'scroll-of-warding',
     quantity: 2,
     customPrice: { platinum: 0, gold: 1, silver: 0, copper: 0 },
     fullItem: {
      id: 'scroll-of-warding',
      name: 'Scroll of Campfire Sanctuary',
      type: 'consumable',
      subtype: 'SCROLL',
      quality: 'uncommon',
      rarity: 'uncommon',
      iconId: 'Misc/Books/book-scroll-rolled-red-wax-seal',
      icon: 'Misc/Books/book-scroll-rolled-red-wax-seal',
      description: 'Wards a 20-foot campsite perimeter against creeping predators and sudden howling gusts.',
      value: { gold: 1, silver: 0, copper: 0 },
      width: 1,
      height: 1
     }
    },
    {
     itemId: 'antidote-of-last-resort',
     quantity: 3,
     customPrice: { platinum: 0, gold: 0, silver: 8, copper: 50 },
     fullItem: {
      id: 'antidote-of-last-resort',
      name: 'Herbal Viper & Spider Draught',
      type: 'consumable',
      subtype: 'POTION',
      quality: 'common',
      rarity: 'common',
      iconId: 'Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-bottle-classic-shape-beige-third-full',
      icon: 'Misc/Profession Resources/Alchemy/Dark Green/dark-green-potion-bottle-classic-shape-beige-third-full',
      description: 'A pungent bitter tincture brewed from prairie rue and serpent scales that neutralizes common venoms.',
      value: { gold: 0, silver: 8, copper: 50 },
      width: 1,
      height: 1
     }
    }
   ];
  }
  return [];
 }, [creature?.shopInventory?.items, creature?.lootTable?.items, creature?.isShopkeeper, creature?.type, creature?.tags]);

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
   const rect = windowRef.current.getBoundingClientRect();
   const offset = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top
   };
   setDragOffset(offset);
   dragOffsetRef.current = offset; // Keep ref in sync for mousemove handler
   setIsDragging(true);
   e.preventDefault();
  }
 };

 const handleMouseMove = (e) => {
  if (isDragging) {
   const offset = dragOffsetRef.current;
   const x = e.clientX - offset.x;
   const y = e.clientY - offset.y;

   // Throttle React state update to one per animation frame
   if (!shopDragRafRef.current) {
    shopDragRafRef.current = requestAnimationFrame(() => {
     shopDragRafRef.current = null;
     setPosition({ x, y });
    });
   }
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
  const libraryItem = itemLibrary.find(item => item.id === itemId);
  if (libraryItem) return libraryItem;

  // Check if the item is in the shop inventory as a full item (for custom/sold items)
  const shopItem = shopItems.find(si => si.itemId === itemId);
  if (shopItem?.fullItem) return shopItem.fullItem;

  // Also check player inventory as a fallback (for selling context)
  const playerItem = inventoryItems.find(item => item.id === itemId);
  return playerItem;
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

 // Calculate merchant markup price (usually 150-200% of value to prevent exploitation)
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

 // Helper to format currency to string for notifications
 const formatCurrencyToString = (price) => {
  if (!price) return '0c';
  if (typeof price !== 'object') return '0c'; // Safety check
  const parts = [];
  if (price.platinum > 0) parts.push(`${price.platinum}p`);
  if (price.gold > 0) parts.push(`${price.gold}g`);
  if (price.silver > 0) parts.push(`${price.silver}s`);
  if (price.copper > 0) parts.push(`${price.copper}c`);
  return parts.length > 0 ? parts.join(' ') : '0c';
 };

 // Helper to convert copper back to price object
 const copperToPrice = (totalCopper) => {
  return {
   platinum: Math.floor(totalCopper / 1000000),
   gold: Math.floor((totalCopper % 1000000) / 10000),
   silver: Math.floor((totalCopper % 10000) / 100),
   copper: totalCopper % 100
  };
 };

 // Handle item selection for shopping cart
 const handleItemSelection = (shopItemIndex) => {
  const shopItem = shopItems[shopItemIndex];
  if (!shopItem) return;

  const currentQuantity = merchantQuantities[shopItemIndex] || 1;
  const availableQuantity = shopItem.quantity;

  if (currentQuantity <= availableQuantity) {
   setSelectedItems(prev => ({
    ...prev,
    [shopItemIndex]: currentQuantity
   }));
  } else {
   // Show notification when trying to select more than available
   showNotification(`Only ${availableQuantity} available!`, 'error');
   // Adjust quantity to maximum available
   setMerchantQuantities(prev => ({ ...prev, [shopItemIndex]: availableQuantity }));
   setSelectedItems(prev => ({
    ...prev,
    [shopItemIndex]: availableQuantity
   }));
  }
 };

 // Handle quantity change for merchant items
 const handleMerchantQuantityChange = (shopItemIndex, newQuantity) => {
  const shopItem = shopItems[shopItemIndex];
  if (!shopItem) return;

  const availableQuantity = shopItem.quantity;
  const clampedQuantity = Math.max(1, Math.min(availableQuantity, newQuantity));

  setMerchantQuantities(prev => ({ ...prev, [shopItemIndex]: clampedQuantity }));

  // Update selected items if this item is already selected
  // Using functional update to ensure we use the most recent state
  setSelectedItems(prev => {
   if (prev[shopItemIndex]) {
    return { ...prev, [shopItemIndex]: clampedQuantity };
   }
   return prev;
  });
 };

 // Remove item from selection or decrease quantity
 const handleItemDeselection = (shopItemIndex) => {
  setSelectedItems(prev => {
   const newSelectedItems = { ...prev };
   if (newSelectedItems[shopItemIndex] > 1) {
    newSelectedItems[shopItemIndex]--;
   } else {
    delete newSelectedItems[shopItemIndex];
   }
   return newSelectedItems;
  });
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
  const currentQuantity = playerQuantities[item.id] || 1;
  const availableQuantity = item.quantity || 1;

  if (currentQuantity <= availableQuantity) {
   setSelectedSellItems(prev => ({
    ...prev,
    [item.id]: currentQuantity
   }));
  } else {
   // Show notification when trying to select more than available
   showNotification(`Only ${availableQuantity} available!`, 'error');
   // Adjust quantity to maximum available
   setPlayerQuantities(prev => ({ ...prev, [item.id]: availableQuantity }));
   setSelectedSellItems(prev => ({
    ...prev,
    [item.id]: availableQuantity
   }));
  }
 };

 // Handle quantity change for player items
 const handlePlayerQuantityChange = (itemId, newQuantity) => {
  const item = inventoryItems.find(invItem => invItem.id === itemId);
  if (!item) return;

  const availableQuantity = item.quantity || 1;
  const clampedQuantity = Math.max(1, Math.min(availableQuantity, newQuantity));

  setPlayerQuantities(prev => ({ ...prev, [itemId]: clampedQuantity }));

  // Update selected items if this item is already selected
  // Using functional update to ensure we use the most recent state
  setSelectedSellItems(prev => {
   const newSelected = { ...prev };
   if (newSelected[itemId] !== undefined) {
    newSelected[itemId] = clampedQuantity;
   }
   return newSelected;
  });
 };

 // Remove item from sell selection or decrease quantity
 const handleSellItemDeselection = (item) => {
  setSelectedSellItems(prev => {
   const newSelectedSellItems = { ...prev };
   if (newSelectedSellItems[item.id] > 1) {
    newSelectedSellItems[item.id]--;
   } else {
    delete newSelectedSellItems[item.id];
   }
   return newSelectedSellItems;
  });
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

  if (!canAfford(shopItem.customPrice, quantity)) {
   showNotification('Not enough gold!', 'error');
   return;
  }

  const unitCostCopper = calculateTotalCopper(shopItem.customPrice);

  let itemsAdded = 0;
  for (let i = 0; i < quantity; i++) {
   const newItemId = addItemFromLibrary(item, {
    preserveProperties: true,
    quantity: 1
   });
   if (!newItemId) {
    break;
   }
   itemsAdded++;
  }

  if (itemsAdded === 0) {
   showNotification('Inventory full! Could not add any items.', 'error');
   return;
  }

  const actualCost = unitCostCopper * itemsAdded;

  let remainingCost = actualCost;
  let newCurrency = { ...currency };

  let totalPlayerCopper = calculateTotalCopper(newCurrency);
  totalPlayerCopper -= remainingCost;

  newCurrency.platinum = Math.floor(totalPlayerCopper / 1000000);
  totalPlayerCopper %= 1000000;
  newCurrency.gold = Math.floor(totalPlayerCopper / 10000);
  totalPlayerCopper %= 10000;
  newCurrency.silver = Math.floor(totalPlayerCopper / 100);
  newCurrency.copper = totalPlayerCopper % 100;

  updateCurrency(newCurrency);

  // Remove purchased items from merchant's inventory
  const updatedShopItems = [...(creature.shopInventory?.items || shopItems || [])];
  const shopItemIndex = updatedShopItems.findIndex(item => item.itemId === shopItem.itemId);

  if (shopItemIndex !== -1) {
   const currentShopItem = updatedShopItems[shopItemIndex];
   if (currentShopItem.quantity > itemsAdded) {
    updatedShopItems[shopItemIndex] = {
     ...currentShopItem,
     quantity: currentShopItem.quantity - itemsAdded
    };
   } else {
    updatedShopItems.splice(shopItemIndex, 1);
   }

   const updatedShopInventory = {
    ...creature.shopInventory,
    items: updatedShopItems
   };
   updateCreature(creature.id, { shopInventory: updatedShopInventory });
  }

  const itemName = String(item.name || 'Unknown Item');
  if (itemsAdded < quantity) {
   showNotification(`Inventory full! Purchased ${itemsAdded}x ${itemName} for ${formatCurrencyToString(copperToPrice(actualCost))}.`, 'warning');
  } else {
   showNotification(`Purchased ${itemsAdded}x ${itemName} for ${formatCurrencyToString(copperToPrice(actualCost))}!`, 'success');
  }
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
  const updatedShopItems = [...(creature.shopInventory?.items || shopItems || [])];

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

  // 9. Show notification
  showNotification(`Purchased ${purchasedItems.length} items for ${formatCurrencyToString(totalCost)}!`, 'success');
  setSelectedItems({});
  setMerchantQuantities({});
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
  
  // Try to find the original library item ID to ensure it appears in the merchant's grid
  let libraryItemId = inventoryItem.originalItemId || 
            inventoryItem.itemId || 
            inventoryItem.itemLibraryId;

  // If not found, try to match by name and type in the library
  if (!libraryItemId) {
   const matchingLibraryItem = itemLibrary.find(libItem =>
    libItem.name.toLowerCase() === inventoryItem.name.toLowerCase() &&
    libItem.type === inventoryItem.type
   );
   if (matchingLibraryItem) {
    libraryItemId = matchingLibraryItem.id;
   } else {
    // As a last resort, use the inventory ID, but this might not render if not in library
    libraryItemId = inventoryItem.id;
   }
  }

  const existingShopItem = updatedShopItems.find(shopItem => shopItem.itemId === libraryItemId);

  if (existingShopItem) {
   // Increase quantity if item already exists in shop
   existingShopItem.quantity = (existingShopItem.quantity || 1) + quantity;
  } else {
   // Add new item to shop with proper merchant pricing
   const originalItem = getItemById(libraryItemId);
   const basePrice = originalItem ? calculateMerchantPrice(originalItem) :
    inventoryItem.value || { gold: 0, silver: 1, copper: 0 };

   updatedShopItems.push({
    itemId: libraryItemId,
    quantity: quantity,
    customPrice: basePrice, // Use proper merchant markup price
    fullItem: inventoryItem // Store full item data to ensure it persists
   });
  }

  // Update the creature's shop inventory
  const updatedShopInventory = {
   ...creature.shopInventory,
   items: updatedShopItems
  };
  
  updateCreature(creature.id, { shopInventory: updatedShopInventory });

  // Remove from inventory
  removeItem(inventoryItem.id, quantity);

  // 10. Show notification
  const itemName = String(inventoryItem.customName || inventoryItem.name || 'Unknown Item');
  showNotification(`Sold ${quantity}x ${itemName} for ${formatCurrencyToString(sellPrice)}!`, 'success');
  setSellQuantity(1);
  setForceRender(prev => prev + 1);
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
    // Try multiple fields for library ID discovery
    let libraryItemId = item.originalItemId || item.itemId || item.itemLibraryId;

    if (!libraryItemId) {
     const matchingLibraryItem = itemLibrary.find(libItem =>
      libItem.name.toLowerCase() === item.name.toLowerCase() &&
      libItem.type === item.type
     );
     if (matchingLibraryItem) {
      libraryItemId = matchingLibraryItem.id;
     } else {
      libraryItemId = item.id;
     }
    }

    const existingShopItem = updatedShopItems.find(shopItem => shopItem.itemId === libraryItemId);
    if (existingShopItem) {
     existingShopItem.quantity = (existingShopItem.quantity || 1) + quantity;
    } else {
     const originalItem = getItemById(libraryItemId);
     const basePrice = originalItem ? calculateMerchantPrice(originalItem) :
      item.value || { gold: 0, silver: 1, copper: 0 };

     updatedShopItems.push({
      itemId: libraryItemId,
      quantity: quantity,
      customPrice: basePrice,
      fullItem: item // Store full item data to ensure it persists
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

  // 10. Show notification
  showNotification(`Sold ${soldItems.length} items for ${formatCurrencyToString(totalValue)}!`, 'success');
  setSelectedSellItems({});
  setPlayerQuantities({});
  setForceRender(prev => prev + 1);
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

  setTooltip({ show: true, item: enhancedItem });
  setMousePosition({ x: e.clientX, y: e.clientY });
 };

 const handleItemMouseMove = (e, item, shopItem = null) => {
  if (tooltip.show && tooltip.item) {
   const enhancedItem = shopItem ? {
    ...item,
    shopPrice: shopItem.customPrice,
    isShopItem: true
   } : item;

   setTooltip({ ...tooltip, item: enhancedItem });
   setMousePosition({ x: e.clientX, y: e.clientY });
  }
 };

 const handleItemMouseLeave = () => {
  setTooltip({ show: false, item: null });
 };

 // Format currency display with coin images
 const formatCurrency = (price) => {
  if (!price) return null;
  const parts = [];
  if (price.platinum > 0) {
   parts.push(
    <span key="platinum" className="currency-part">
     <span className="currency-number">{price.platinum}</span>
     <img
      src={getIconUrl('Container/Coins/golden-coin-single-isometric', 'items')}
      alt="Platinum"
      className="currency-coin-small coin-platinum"
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
      src={getIconUrl('Container/Coins/golden-coin-single-isometric', 'items')}
      alt="Gold"
      className="currency-coin-small coin-gold"
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
      src={getIconUrl('Container/Coins/golden-coin-single-isometric', 'items')}
      alt="Silver"
      className="currency-coin-small coin-silver"
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
      src={getIconUrl('Container/Coins/golden-coin-single-isometric', 'items')}
      alt="Copper"
      className="currency-coin-small coin-copper"
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
      src={getIconUrl('Container/Coins/golden-coin-single-isometric', 'items')}
      alt="Copper"
      className="currency-coin-small coin-copper"
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

 if (!isOpen || !creature) return null;

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
    className="shop-window wow-style-window calm-shop-ledger"
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
        src={
         creature?.tokenIcon && String(creature.tokenIcon).startsWith('Bestiary/')
          ? getCreatureTokenIconUrl(creature.tokenIcon, creature.type)
          : (creature?.illustration || getIconUrl(creature?.tokenIcon || 'inv_misc_questionmark', 'items'))
        }
        alt={creature?.name || 'Merchant'}
        onError={(e) => {
         e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
        }}
       />
      </div>
      <div className="shop-info">
       <div className="shop-name-row">
        <span className="shop-name">{shopName}</span>
        {merchantRole && <span className="shop-merchant-role">{merchantRole}</span>}
       </div>
       {shopDescription && (
        <p className="shop-flavor-quote" title={shopDescription}>
         &ldquo;{shopDescription}&rdquo;
        </p>
       )}
       <div className="buy-rates-display">
        <span className="buy-rates-label">Appraisal Rates:</span>
        <div className="buy-rates-list">
         {creature.shopInventory?.buyRates?.categories && Object.entries(creature.shopInventory.buyRates.categories)
          .sort(([, a], [, b]) => b - a) // Sort by rate descending
          .map(([category, rate]) => (
           <span key={category} className="buy-rate-item">
            {category.charAt(0).toUpperCase() + category.slice(1)}: {rate}%
           </span>
          ))}
         <span className="buy-rate-item default-rate">
          Standard: {creature.shopInventory?.buyRates?.default || 30}%
         </span>
        </div>
       </div>
      </div>
     </div>

     <div className="header-actions">
      <button
       onClick={() => setShowFilters(!showFilters)}
       className={`filter-toggle-btn ${showFilters ? 'active' : ''} ${
        globalFilters.searchQuery || globalFilters.selectedItemType !== 'all' || globalFilters.selectedQuality !== 'all'
         ? 'has-active-filters'
         : ''
       }`}
       title="Search & Filter Items"
      >
       <i className="fas fa-filter"></i>
       <span className="filter-btn-label">Catalog</span>
      </button>
      <button className="shop-close-btn" onClick={onClose} title="Close Ledger">
       <i className="fas fa-times"></i>
      </button>
     </div>
    </div>

    {/* Global Filters Popout */}
    {showFilters && (
     <div className="filters-popout-overlay" onClick={() => setShowFilters(false)}>
      <div className="filters-popout" onClick={(e) => e.stopPropagation()}>
       <div className="filters-popout-header">
        <h4>
         <i className="fas fa-filter"></i>
         <span>Search & Filter Items</span>
        </h4>
        <button
         onClick={() => setShowFilters(false)}
         className="filters-close-btn"
         title="Close Filters (Esc)"
        >
         <i className="fas fa-times"></i>
        </button>
       </div>
       <div className="filters-popout-content">
        <div className="filter-group">
         <label className="filter-label">
          <i className="fas fa-search"></i>
          <span>Search Items:</span>
         </label>
         <input
          type="text"
          placeholder="Type to search..."
          value={globalFilters.searchQuery}
          onChange={(e) => setGlobalFilters(prev => ({ ...prev, searchQuery: e.target.value }))}
          className="popout-filter-input"
         />
        </div>
        <div className="filter-row">
         <div className="filter-group">
          <label className="filter-label">
           <i className="fas fa-tags"></i>
           <span>Item Type:</span>
          </label>
          <select
           value={globalFilters.selectedItemType}
           onChange={(e) => setGlobalFilters(prev => ({ ...prev, selectedItemType: e.target.value }))}
           className="popout-filter-select"
          >
           <option value="all">All Types</option>
           {globalFilterOptions.types.map(type => (
            <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
           ))}
          </select>
         </div>
         <div className="filter-group">
          <label className="filter-label">
           <i className="fas fa-gem"></i>
           <span>Quality:</span>
          </label>
          <select
           value={globalFilters.selectedQuality}
           onChange={(e) => setGlobalFilters(prev => ({ ...prev, selectedQuality: e.target.value }))}
           className="popout-filter-select"
          >
           <option value="all">All Qualities</option>
           {globalFilterOptions.qualities.map(quality => (
            <option key={quality} value={quality}>{quality.charAt(0).toUpperCase() + quality.slice(1)}</option>
           ))}
          </select>
         </div>
        </div>
        <div className="filters-popout-actions">
         <button
          onClick={() => setGlobalFilters({ searchQuery: '', selectedItemType: 'all', selectedQuality: 'all' })}
          className={`filters-reset-btn ${
           globalFilters.searchQuery || globalFilters.selectedItemType !== 'all' || globalFilters.selectedQuality !== 'all'
            ? 'has-active'
            : ''
          }`}
          title="Reset all search queries and filters"
         >
          <i className="fas fa-undo"></i>
          <span>Reset All</span>
         </button>
        </div>
       </div>
      </div>
     </div>
    )}



    {/* Shop Content */}
    <div className="shop-content">
     <div className="merchant-content">
      {/* Merchant Items Grid */}
      <div className="merchant-items">
       <div className="merchant-header">
        <div className="ledger-header-left">
         <i className="fas fa-store"></i>
         <span>Merchant&apos;s Wares</span>
        </div>
        <span className="item-count">({shopItems.length})</span>
       </div>
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
             // If already selected, clicking again should deselect
             if (selectedItems[index]) {
              handleItemDeselection(index);
             } else {
              handleItemSelection(index);
             }
            }
           }}
          >
           <div
            className="item-icon"
            style={{
             backgroundImage: `url(${getIconUrl(item.iconId, 'items')})`
            }}
            onMouseEnter={(e) => handleItemMouseEnter(e, item, shopItem)}
            onMouseMove={(e) => handleItemMouseMove(e, item, shopItem)}
            onMouseLeave={handleItemMouseLeave}
           />
           {shopItem.quantity > 1 && (
            <div className="item-quantity">{shopItem.quantity}</div>
           )}
           {selectedItems[index] && (
            <QuantitySelector
             quantity={merchantQuantities[index] || selectedItems[index] || 1}
             onQuantityChange={(newQuantity) => handleMerchantQuantityChange(index, newQuantity)}
             maxQuantity={shopItem.quantity}
             showTrigger={true}
             triggerClassName="shop-item-quantity-selector"
            />
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
       <div className="inventory-header">
        <div className="ledger-header-left">
         <i className="fas fa-sack-dollar"></i>
         <span>Adventurer&apos;s Pack</span>
        </div>
        <span className="item-count">({inventoryItems.length})</span>
       </div>
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
             // If already selected, clicking again should deselect
             if (selectedSellItems[item.id]) {
              handleSellItemDeselection(item);
             } else {
              handleSellItemSelection(item);
             }
            }
           }}
          >
           <div
            className="item-icon"
            style={{
             backgroundImage: `url(${getIconUrl(item.iconId, 'items')})`
            }}
            onMouseEnter={(e) => handleItemMouseEnter(e, item)}
            onMouseMove={(e) => handleItemMouseMove(e, item)}
            onMouseLeave={handleItemMouseLeave}
           />
           {item.quantity > 1 && (
            <div className="item-quantity">{item.quantity}</div>
           )}
           {selectedSellItems[item.id] && (
            <QuantitySelector
             quantity={playerQuantities[item.id] || selectedSellItems[item.id] || 1}
             onQuantityChange={(newQuantity) => handlePlayerQuantityChange(item.id, newQuantity)}
             maxQuantity={item.quantity || 1}
             showTrigger={true}
             triggerClassName="shop-item-quantity-selector sell-item-quantity-selector"
            />
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

    {/* Player Currency Footer Ribbon */}
    <div className="player-currency-display">
     <div className="currency-ledger-heading">
      <i className="fas fa-coins"></i>
      <span>Purse Balance</span>
     </div>
     <div className="currency-display-simple">
      <div className="currency-coin" title={`${currency.platinum || 0} Platinum Pieces`}>
       <img
        src={getIconUrl('Container/Coins/golden-coin-single-isometric', 'items')}
        alt="Platinum"
        className="coin-icon coin-platinum"
        onError={(e) => {
         e.target.onerror = null;
         e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23e5e4e2"/></svg>';
        }}
       />
       <span className="currency-number">{currency.platinum || 0}</span>
       <span className="currency-coin-label">pp</span>
      </div>
      <div className="currency-coin" title={`${currency.gold || 0} Gold Pieces`}>
       <img
        src={getIconUrl('Container/Coins/golden-coin-single-isometric', 'items')}
        alt="Gold"
        className="coin-icon coin-gold"
        onError={(e) => {
         e.target.onerror = null;
         e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23ffd700"/></svg>';
        }}
       />
       <span className="currency-number">{currency.gold || 0}</span>
       <span className="currency-coin-label">gp</span>
      </div>
      <div className="currency-coin" title={`${currency.silver || 0} Silver Pieces`}>
       <img
        src={getIconUrl('Container/Coins/golden-coin-single-isometric', 'items')}
        alt="Silver"
        className="coin-icon coin-silver"
        onError={(e) => {
         e.target.onerror = null;
         e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23c0c0c0"/></svg>';
        }}
       />
       <span className="currency-number">{currency.silver || 0}</span>
       <span className="currency-coin-label">sp</span>
      </div>
      <div className="currency-coin" title={`${currency.copper || 0} Copper Pieces`}>
       <img
        src={getIconUrl('Container/Coins/golden-coin-single-isometric', 'items')}
        alt="Copper"
        className="coin-icon coin-copper"
        onError={(e) => {
         e.target.onerror = null;
         e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="%23cd7f32"/></svg>';
        }}
       />
       <span className="currency-number">{currency.copper || 0}</span>
       <span className="currency-coin-label">cp</span>
      </div>
     </div>
    </div>

    {/* Notification */}
    {notification.show && (
     <div className={`shop-notification ${notification.type}`}>
      <i className={notification.type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-feather-pointed'}></i>
      <span>{notification.message}</span>
     </div>
    )}

    {/* Tooltip */}
    {tooltip.show && tooltip.item && (
     <TooltipPortal>
      <div
       ref={tooltipRef}
       style={{
        position: 'fixed',
        left: adjustedPosition.x,
        top: adjustedPosition.y,
        pointerEvents: 'none',
        zIndex: 999999999
       }}
      >
       <ItemTooltip item={tooltip.item} />
      </div>
     </TooltipPortal>
    )}
   </div>

   {/* External Shopping Cart (Purchase Ledger Docket) */}
   {Object.keys(selectedItems).length > 0 && (
    <div className="external-shopping-cart calm-cart-receipt">
     <div className="cart-header">
      <i className="fas fa-scroll"></i>
      <span>Purchase Order</span>
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

       const itemQuantity = selectedItems[shopItemIndex] || 1;
       return (
        <div key={shopItemIndex} className="cart-item">
         <span className="cart-item-name">{itemQuantity}&times; {item.name}</span>
         <span className="cart-item-price">{formatCurrency(totalItemPrice)}</span>
        </div>
       );
      })}
     </div>
     <div className="cart-total">
      <span className="total-label">Total Outlay:</span>
      <span className="total-val">{formatCurrency(calculateTotalCost())}</span>
     </div>
     <div className="cart-actions">
      <button
       className="buy-all-button"
       onClick={handlePurchaseAll}
       disabled={!canAffordSelection()}
      >
       <i className="fas fa-coins"></i>
       <span>Buy All ({Object.keys(selectedItems).length})</span>
      </button>
      <button
       className="clear-cart-button"
       onClick={() => setSelectedItems({})}
      >
       Clear Order
      </button>
     </div>
    </div>
   )}

   {/* External Sell Cart (Sale Ledger Docket) */}
   {Object.keys(selectedSellItems).length > 0 && (
    <div className="external-sell-cart calm-cart-receipt">
     <div className="cart-header">
      <i className="fas fa-scale-balanced"></i>
      <span>Appraisal &amp; Sale</span>
     </div>
     <div className="cart-items">
      {Object.entries(selectedSellItems).map(([itemId]) => {
       const item = inventoryItems.find(invItem => invItem.id === itemId);
       if (!item) return null;

       const quantity = playerQuantities[itemId] || 1;
       const sellPrice = calculateSellPrice(item);

       return (
        <div key={itemId} className="cart-item">
         <span className="cart-item-name">{quantity}&times; {item.name}</span>
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
      <span className="total-label">Merchant Payout:</span>
      <span className="total-val">{formatCurrency(calculateTotalSellValue())}</span>
     </div>
     <div className="cart-actions">
      <button
       className="sell-all-button"
       onClick={handleSellAll}
      >
       <i className="fas fa-hand-holding-dollar"></i>
       <span>Sell All ({Object.keys(selectedSellItems).length})</span>
      </button>
      <button
       className="clear-sell-button"
       onClick={() => setSelectedSellItems({})}
      >
       Clear Sale
      </button>
     </div>
    </div>
   )}
  </div>,
  portalTarget
 );
};

export default ShopWindow;
