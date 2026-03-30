import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCreatureWizard, useCreatureWizardDispatch, wizardActionCreators } from '../../context/CreatureWizardContext';
import useItemStore from '../../../../store/itemStore';
import { v4 as uuidv4 } from 'uuid';
import { getIconUrl } from '../../../../utils/assetManager';
import '../../styles/WizardSteps.css';
import './Step4LootTable.css';
import '../../styles/ShopConfiguration.css';
import ItemTooltip from '../../../../components/item-generation/ItemTooltip';
import TooltipPortal from '../../../tooltips/TooltipPortal';
import ClutterLootGenerator from '../loot/ClutterLootGenerator';




// Default loot item
const DEFAULT_LOOT_ITEM = {
  id: '',
  name: '',
  type: 'weapon',
  rarity: 'common',
  dropChance: 10
};

const Step4LootTable = () => {
  const wizardState = useCreatureWizard();
  const dispatch = useCreatureWizardDispatch();

  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [currentItem, setCurrentItem] = useState({ ...DEFAULT_LOOT_ITEM });
  const [showItemForm, setShowItemForm] = useState(false);

  const [showItemLibrary, setShowItemLibrary] = useState(false);
  const [itemSearchQuery, setItemSearchQuery] = useState('');
  const [tooltipItem, setTooltipItem] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const tooltipRef = useRef(null);

  // New state for shop-style item selector
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemType, setSelectedItemType] = useState('all');
  const [selectedQuality, setSelectedQuality] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [tooltip, setTooltip] = useState({ show: false, item: null, x: 0, y: 0 });

  // Parse currency string into platinum, gold, silver, copper values
  const parseCurrencyString = (currencyStr) => {
    // Default values
    let platinum = 0;
    let gold = 0;
    let silver = 0;
    let copper = 0;

    // Remove all spaces and make lowercase
    const cleanStr = currencyStr.toLowerCase().replace(/\s+/g, '');

    // Match patterns like "1p", "5g", "10s", "42c"
    const platinumMatch = cleanStr.match(/(\d+)p/);
    const goldMatch = cleanStr.match(/(\d+)g/);
    const silverMatch = cleanStr.match(/(\d+)s/);
    const copperMatch = cleanStr.match(/(\d+)c/);

    if (platinumMatch) platinum = parseInt(platinumMatch[1], 10) || 0;
    if (goldMatch) gold = parseInt(goldMatch[1], 10) || 0;
    if (silverMatch) silver = parseInt(silverMatch[1], 10) || 0;
    if (copperMatch) copper = parseInt(copperMatch[1], 10) || 0;

    return { platinum, gold, silver, copper };
  };

  // Format currency values into a string like "1p 3g 4s 52c"
  const formatCurrency = (platinum, gold, silver, copper) => {
    let result = '';
    if (platinum > 0) result += `${platinum}p `;
    if (gold > 0) result += `${gold}g `;
    if (silver > 0) result += `${silver}s `;
    if (copper > 0) result += `${copper}c`;

    // Trim trailing space
    return result.trim() || '0c';
  };

  // Handle currency change
  const handleCurrencyChange = (field, value) => {
    // Parse the currency string
    const { platinum, gold, silver, copper } = parseCurrencyString(value);

    dispatch(wizardActionCreators.setLootTable({
      ...wizardState.lootTable,
      currency: {
        ...wizardState.lootTable.currency,
        platinum: {
          ...wizardState.lootTable.currency.platinum,
          [field]: platinum
        },
        gold: {
          ...wizardState.lootTable.currency.gold,
          [field]: gold
        },
        silver: {
          ...wizardState.lootTable.currency.silver,
          [field]: silver
        },
        copper: {
          ...wizardState.lootTable.currency.copper,
          [field]: copper
        }
      }
    }));
  };

  // Currency randomizer presets - 7 tiers for more granular control
  // Note: 100 copper = 1 silver, 100 silver = 1 gold, 100 gold = 1 platinum
  const currencyPresets = {
    poor: {
      min: { platinum: 0, gold: 0, silver: 0, copper: Math.floor(Math.random() * 15) + 5 },
      max: { platinum: 0, gold: 0, silver: 0, copper: Math.floor(Math.random() * 20) + 20 }
    },
    common: {
      min: { platinum: 0, gold: 0, silver: Math.floor(Math.random() * 2) + 1, copper: Math.floor(Math.random() * 30) + 5 },
      max: { platinum: 0, gold: 0, silver: Math.floor(Math.random() * 5) + 2, copper: Math.floor(Math.random() * 40) + 30 }
    },
    uncommon: {
      min: { platinum: 0, gold: 0, silver: Math.floor(Math.random() * 8) + 3, copper: Math.floor(Math.random() * 50) + 10 },
      max: { platinum: 0, gold: 0, silver: Math.floor(Math.random() * 15) + 8, copper: Math.floor(Math.random() * 80) + 50 }
    },
    rare: {
      min: { platinum: 0, gold: Math.floor(Math.random() * 2) + 1, silver: Math.floor(Math.random() * 10) + 5, copper: Math.floor(Math.random() * 50) },
      max: { platinum: 0, gold: Math.floor(Math.random() * 3) + 3, silver: Math.floor(Math.random() * 20) + 10, copper: Math.floor(Math.random() * 100) + 50 }
    },
    epic: {
      min: { platinum: 0, gold: Math.floor(Math.random() * 3) + 4, silver: Math.floor(Math.random() * 15) + 10, copper: Math.floor(Math.random() * 50) },
      max: { platinum: 0, gold: Math.floor(Math.random() * 5) + 12, silver: Math.floor(Math.random() * 30) + 20, copper: Math.floor(Math.random() * 100) + 50 }
    },
    legendary: {
      min: { platinum: 0, gold: Math.floor(Math.random() * 5) + 13, silver: Math.floor(Math.random() * 25) + 15, copper: Math.floor(Math.random() * 80) },
      max: { platinum: 0, gold: Math.floor(Math.random() * 10) + 25, silver: Math.floor(Math.random() * 50) + 30, copper: Math.floor(Math.random() * 150) + 80 }
    },
    artifact: {
      min: { platinum: Math.floor(Math.random() * 1) + 1, gold: Math.floor(Math.random() * 10) + 26, silver: Math.floor(Math.random() * 40) + 25, copper: Math.floor(Math.random() * 100) },
      max: { platinum: Math.floor(Math.random() * 2) + 3, gold: Math.floor(Math.random() * 20) + 40, silver: Math.floor(Math.random() * 75) + 50, copper: Math.floor(Math.random() * 200) + 100 }
    }
  };

  // Normalize currency amounts (100 = 1 of next currency)
  const normalizeCurrency = (currency) => {
    let { platinum, gold, silver, copper } = currency;

    // Convert copper to silver if >= 100
    if (copper >= 100) {
      const silverFromCopper = Math.floor(copper / 100);
      silver += silverFromCopper;
      copper = copper % 100;
    }

    // Convert silver to gold if >= 100
    if (silver >= 100) {
      const goldFromSilver = Math.floor(silver / 100);
      gold += goldFromSilver;
      silver = silver % 100;
    }

    // Convert gold to platinum if >= 100
    if (gold >= 100) {
      const platinumFromGold = Math.floor(gold / 100);
      platinum += platinumFromGold;
      gold = gold % 100;
    }

    return { platinum, gold, silver, copper };
  };

  // Handle currency preset randomization
  const handleCurrencyRandomize = (preset) => {
    const { min, max } = currencyPresets[preset];

    dispatch(wizardActionCreators.setLootTable({
      ...wizardState.lootTable,
      currency: {
        platinum: {
          min: normalizeCurrency(min).platinum,
          max: normalizeCurrency(max).platinum
        },
        gold: {
          min: normalizeCurrency(min).gold,
          max: normalizeCurrency(max).gold
        },
        silver: {
          min: normalizeCurrency(min).silver,
          max: normalizeCurrency(max).silver
        },
        copper: {
          min: normalizeCurrency(min).copper,
          max: normalizeCurrency(max).copper
        }
      }
    }));
  };

  // Handle editing an existing loot item
  const handleEditItem = (index) => {
    // Clear tooltip when editing
    setTooltipItem(null);
    setTooltip({ show: false, item: null, x: 0, y: 0 });
    
    setEditingItemIndex(index);
    setCurrentItem({ ...wizardState.lootTable.items[index] });
    setShowItemForm(true);

  };

  // Handle removing a loot item
  const handleRemoveItem = (index) => {
    dispatch(wizardActionCreators.removeLootItem(index));
  };

  // Handle saving the current loot item
  const handleSaveItem = () => {
    if (editingItemIndex !== null) {
      // Update existing item
      dispatch(wizardActionCreators.updateLootItem(editingItemIndex, currentItem));
    }

    // Reset form
    setShowItemForm(false);
    setEditingItemIndex(null);
    setCurrentItem({ ...DEFAULT_LOOT_ITEM });
  };

  // Handle canceling the item form
  const handleCancelItemForm = () => {
    // Clear tooltip when canceling
    setTooltipItem(null);
    setTooltip({ show: false, item: null, x: 0, y: 0 });
    
    setShowItemForm(false);
    setEditingItemIndex(null);
    setCurrentItem({ ...DEFAULT_LOOT_ITEM });
  };

  // Handle item form field changes
  const handleItemChange = (field, value) => {
    // Convert dropChance to number
    if (field === 'dropChance') {
      value = parseInt(value, 10) || 0;
    }

    setCurrentItem({
      ...currentItem,
      [field]: value
    });
  };



  // Get items from the store
  const itemStore = useItemStore();
  const itemStoreData = itemStore || { items: [] };
  const storeItems = itemStoreData.items || [];

  // Filter items based on search query
  const filteredItems = storeItems.filter(item =>
    item.name.toLowerCase().includes(itemSearchQuery.toLowerCase()) ||
    (item.description && item.description.toLowerCase().includes(itemSearchQuery.toLowerCase()))
  );

  // Handle selecting an item from the library
  const handleSelectLibraryItem = (item) => {
    // Create a new item with all properties from the original item
    // plus specific properties needed for the loot table
    const newItem = {
      // Generate a unique ID for this loot item
      id: `item-${Date.now()}`,

      // Copy all properties from the original item
      ...item,

      // Ensure these specific properties are set correctly
      type: item.type || 'miscellaneous',
      rarity: item.rarity || 'common',
      quality: item.quality || item.rarity || 'common',

      // Set default drop chance
      dropChance: 10,

      // Store the original item ID for reference
      itemId: item.id,

      // Ensure weapon items have proper damage properties
      ...(item.type === 'weapon' && !item.weaponStats && {
        weaponStats: {
          baseDamage: {
            diceCount: 1,
            diceType: 6,
            damageType: 'slashing',
            bonusDamage: 0,
            bonusDamageType: null
          }
        }
      }),

      // Ensure these objects exist to prevent errors
      baseStats: item.baseStats || {},
      combatStats: item.combatStats || {},
      utilityStats: item.utilityStats || {}
    };

    dispatch(wizardActionCreators.addLootItem(newItem));
  };

  // Handle adding multiple items from the clutter generator
  const handleAddClutterItems = (items) => {
    items.forEach(item => {
      dispatch(wizardActionCreators.addLootItem(item));
    });
  };

  // Get color for rarity
  const getRarityColor = (rarity) => {
    const rarityColors = {
      poor: '#9d9d9d',
      common: '#ffffff',
      uncommon: '#1eff00',
      rare: '#0070dd',
      epic: '#a335ee',
      legendary: '#ff8000',
      artifact: '#e6cc80'
    };

    return rarityColors[rarity?.toLowerCase()] || '#ffffff';
  };

  // Calculate tooltip position
  const calculateTooltipPosition = (event) => {
    // Get mouse position
    const mouseX = event.clientX;
    const mouseY = event.clientY;

    // Get viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Tooltip dimensions (approximate)
    const tooltipWidth = 300;
    const tooltipHeight = 400;

    // Calculate position to ensure tooltip stays within viewport
    let x = mouseX + 15; // Offset from cursor
    let y = mouseY - 10;

    // Check if tooltip would go off the right edge
    if (x + tooltipWidth > viewportWidth) {
      x = mouseX - tooltipWidth - 15; // Position to the left of cursor
    }

    // Check if tooltip would go off the bottom edge
    if (y + tooltipHeight > viewportHeight) {
      y = viewportHeight - tooltipHeight - 10;
      if (y < 10) y = 10; // Ensure minimum top margin
    }

    return { x, y };
  };

  // Handle showing tooltip
  const handleShowTooltip = (item, event) => {
    if (!item) return;

    const position = calculateTooltipPosition(event);
    setTooltipItem(item);
    setTooltipPosition(position);
  };

  // Handle tooltip movement
  const handleTooltipMove = (event) => {
    if (!tooltipItem) return;

    const position = calculateTooltipPosition(event);
    setTooltipPosition(position);
  };

  // Handle hiding tooltip
  const handleHideTooltip = () => {
    setTooltipItem(null);
  };

  // Shop-style functions
  // Get quality color (same as shop interface)
  const getQualityColor = (quality) => {
    const qualityColors = {
      poor: '#9d9d9d',
      common: '#ffffff',
      uncommon: '#1eff00',
      rare: '#0070dd',
      epic: '#a335ee',
      legendary: '#ff8000',
      artifact: '#e6cc80'
    };
    return qualityColors[quality?.toLowerCase()] || '#ffffff';
  };

  // Filter and sort items for shop-style selector
  const filteredAndSortedItems = storeItems
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(itemSearchQuery.toLowerCase()) ||
                           item.description?.toLowerCase().includes(itemSearchQuery.toLowerCase());
      const matchesType = selectedItemType === 'all' || item.type === selectedItemType;
      const matchesQuality = selectedQuality === 'all' || item.quality === selectedQuality;

      // Don't show items already in loot table
      const alreadyInLoot = wizardState.lootTable.items.some(lootItem => lootItem.itemId === item.id);

      return matchesSearch && matchesType && matchesQuality && !alreadyInLoot;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });

  // Handle item selection for multi-select
  const handleItemSelect = (item) => {
    const isSelected = selectedItems.some(selectedItem => selectedItem.id === item.id);

    if (isSelected) {
      setSelectedItems(selectedItems.filter(selectedItem => selectedItem.id !== item.id));
    } else {
      setSelectedItems([...selectedItems, item]);
    }
  };

  // Handle confirming multiple selected items
  const handleConfirmSelection = () => {
    selectedItems.forEach(item => {
      const newItem = {
        id: `item-${Date.now()}-${Math.random()}`,
        ...item,
        type: item.type || 'miscellaneous',
        rarity: item.rarity || 'common',
        quality: item.quality || item.rarity || 'common',
        dropChance: 10,
        itemId: item.id,
        baseStats: item.baseStats || {},
        combatStats: item.combatStats || {},
        utilityStats: item.utilityStats || {}
      };
      dispatch(wizardActionCreators.addLootItem(newItem));
    });
    setShowItemSelector(false);
    setSelectedItems([]);
  };

  // Check if an item is selected
  const isItemSelected = (item) => {
    return selectedItems.some(selectedItem => selectedItem.id === item.id);
  };

  // Handle tooltip (same as shop interface)
  const handleMouseEnter = (e, item) => {
    setTooltip({
      show: true,
      item,
      x: e.clientX + 15,
      y: e.clientY - 10
    });
  };

  const handleMouseMove = (e, item) => {
    if (tooltip.show && tooltip.item && tooltip.item.id === item.id) {
      setTooltip({
        show: true,
        item,
        x: e.clientX + 15,
        y: e.clientY - 10
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, item: null, x: 0, y: 0 });
  };

  // Reset filters
  const resetFilters = () => {
    setItemSearchQuery('');
    setSelectedItemType('all');
    setSelectedQuality('all');
    setSortBy('name');
    setSortOrder('asc');
  };

  // Get appropriate icon path for item type
  const getItemIconPath = (item) => {
    // If item has imageUrl and it's not a WoW URL, use it directly
    if (item.imageUrl && !item.imageUrl.includes('wow.zamimg.com') && !item.imageUrl.includes('wow.zamimg')) {
      return item.imageUrl;
    }

    // If item has iconId, use it (getIconUrl will handle WoW ID conversion to local icons)
    if (item.iconId) {
      return getIconUrl(item.iconId, 'items');
    }

    // Map item types to appropriate custom icon paths
    const typeIconMap = {
      weapon: 'Weapons/Swords/sword-basic-straight-tan-blade-brown-hilt-simple',
      armor: 'Armor/Chest/chest-simple-tan-tunic',
      accessory: 'Armor/Finger/finger-simple-teal-diamond-ring',
      consumable: 'Misc/Profession Resources/Alchemy/Red/red-potion-bottle-classic-squat-bulbous-rounded-body-narrower-neck-diagonal-bright-deep-red-liquid-two-thirds-light-beige-cream-glass-dark-brown-cylindrical-cork',
      material: 'Misc/Profession Resources/resource-ore-cluster-orange-red-veins',
      miscellaneous: 'Misc/Profession Resources/resource-ore-cluster-orange-red-veins',
      tool: 'Misc/Profession Resources/resource-ore-cluster-orange-red-veins',
      quest: 'Misc/Books/book-folded-letter-envelope',
      container: 'Container/Pouch/pouch-01'
    };

    const iconPath = typeIconMap[item.type] || 'Misc/Books/book-brown-teal-question-mark';
    return getIconUrl(iconPath, 'items');
  };

  // Render the loot table
  const renderLootTable = () => {
    return (
      <div className="loot-table">
        {/* Currency section */}
        <div className="loot-section">
          <h3>Currency Drops</h3>
          <div className="currency-inputs">
              <label>Currency Range</label>
              <p className="currency-help">Format: "1p 3g 4s 52c" (platinum, gold, silver, copper)</p>

              {/* Currency Randomizer Buttons */}
              <div className="currency-randomizers">
                <label>Quick Randomize:</label>
                <div className="randomizer-buttons">
                  <button
                    className="randomizer-button poor"
                    onClick={() => handleCurrencyRandomize('poor')}
                    title="Poor value (5-55 copper only)"
                  >
                    Poor
                  </button>
                  <button
                    className="randomizer-button common"
                    onClick={() => handleCurrencyRandomize('common')}
                    title="Common value (1-11 silver, some copper)"
                  >
                    Common
                  </button>
                  <button
                    className="randomizer-button uncommon"
                    onClick={() => handleCurrencyRandomize('uncommon')}
                    title="Uncommon value (5-45 silver, copper mix)"
                  >
                    Uncommon
                  </button>
                  <button
                    className="randomizer-button rare"
                    onClick={() => handleCurrencyRandomize('rare')}
                    title="Rare value (1-6 gold, silver and copper)"
                  >
                    Rare
                  </button>
                  <button
                    className="randomizer-button epic"
                    onClick={() => handleCurrencyRandomize('epic')}
                    title="Epic value (4-17 gold, silver and copper)"
                  >
                    Epic
                  </button>
                  <button
                    className="randomizer-button legendary"
                    onClick={() => handleCurrencyRandomize('legendary')}
                    title="Legendary value (13-35 gold, silver and copper)"
                  >
                    Legendary
                  </button>
                  <button
                    className="randomizer-button artifact"
                    onClick={() => handleCurrencyRandomize('artifact')}
                    title="Artifact value (1-5 platinum, 26-60 gold)"
                  >
                    Artifact
                  </button>
                </div>
              </div>

              <div className="range-inputs">
                <div className="range-input">
                  <span>Min:</span>
                  <input
                    type="text"
                    placeholder="0c"
                    value={formatCurrency(
                      wizardState.lootTable.currency.platinum.min,
                      wizardState.lootTable.currency.gold.min,
                      wizardState.lootTable.currency.silver.min,
                      wizardState.lootTable.currency.copper.min
                    )}
                    onChange={(e) => handleCurrencyChange('min', e.target.value)}
                  />
                  <div className="currency-indicators">
                    <div className="currency-indicator platinum" title="Platinum"></div>
                    <div className="currency-indicator gold" title="Gold"></div>
                    <div className="currency-indicator silver" title="Silver"></div>
                    <div className="currency-indicator copper" title="Copper"></div>
                  </div>
                </div>
                <div className="range-input">
                  <span>Max:</span>
                  <input
                    type="text"
                    placeholder="0c"
                    value={formatCurrency(
                      wizardState.lootTable.currency.platinum.max,
                      wizardState.lootTable.currency.gold.max,
                      wizardState.lootTable.currency.silver.max,
                      wizardState.lootTable.currency.copper.max
                    )}
                    onChange={(e) => handleCurrencyChange('max', e.target.value)}
                  />
                  <div className="currency-indicators">
                    <div className="currency-indicator platinum" title="Platinum"></div>
                    <div className="currency-indicator gold" title="Gold"></div>
                    <div className="currency-indicator silver" title="Silver"></div>
                    <div className="currency-indicator copper" title="Copper"></div>
                  </div>
                </div>
              </div>
          </div>
        </div>

        {/* Items section */}
        <div className="loot-section">
          <h3>Item Drops</h3>

          <div className="loot-actions">
            <button
              type="button"
              className="add-item-btn"
              onClick={() => setShowItemSelector(true)}
            >
              <i className="fas fa-plus"></i> Add Item
            </button>
          </div>

          {/* Clutter Loot Generator */}
          <ClutterLootGenerator onAddItems={handleAddClutterItems} />



          {wizardState.lootTable.items.length === 0 ? (
            <div className="no-items-message">
              <p>No items added yet. Use the Item Library or Quick Clutter to add items to the loot table.</p>
            </div>
          ) : (
            <div className="loot-items-list">
              <table className="loot-items-table">
                <thead>
                  <tr>
                    <th className="item-icon-col"></th>
                    <th className="item-name-col">Name</th>
                    <th className="item-type-col">Type</th>
                    <th className="item-rarity-col">Rarity</th>
                    <th className="item-chance-col">Drop Chance</th>
                    <th className="item-actions-col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {wizardState.lootTable.items.map((item, index) => {
                    // Get the appropriate icon using custom icon system
                    const iconUrl = getItemIconPath(item);
                    const fallbackIcon = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');

                    return (
                      <tr
                        key={item.id || index}
                        className="loot-item-row"
                        onMouseEnter={(e) => handleShowTooltip(item, e)}
                        onMouseMove={(e) => handleTooltipMove(e)}
                        onMouseLeave={handleHideTooltip}
                      >
                        <td className="item-icon-col">
                          <img
                            src={iconUrl}
                            alt={item.name}
                            className="item-icon"
                            onError={(e) => {
                              e.target.src = fallbackIcon;
                            }}
                          />
                        </td>
                        <td className="item-name-col">
                          <span className={`item-name-text quality-${(item.rarity || 'common').toLowerCase()}`}>
                            {item.name}
                          </span>
                        </td>
                        <td className="item-type-col">
                          {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                          {item.subtype && <span className="item-subtype">{item.subtype}</span>}
                        </td>
                        <td className="item-rarity-col">
                          <span className={`rarity-badge rarity-${(item.rarity || 'common').toLowerCase()}`}>
                            {item.rarity?.charAt(0).toUpperCase() + item.rarity?.slice(1) || 'Common'}
                          </span>
                        </td>
                        <td className="item-chance-col">
                          <div className="chance-display">
                            <div
                              className="chance-bar"
                              style={{ width: `${Math.min(100, item.dropChance)}%` }}
                            ></div>
                            <span className="chance-text">{item.dropChance}%</span>
                          </div>
                        </td>
                        <td className="item-actions-col">
                          <div className="item-actions">
                            <button
                              type="button"
                              className="edit-item-button"
                              onClick={() => handleEditItem(index)}
                              title="Edit Item"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              type="button"
                              className="remove-item-button"
                              onClick={() => handleRemoveItem(index)}
                              title="Remove Item"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render the item form
  const renderItemForm = () => {
    return (
      <div className="item-form" onClick={(e) => e.stopPropagation()}>
        <h3>Edit Item</h3>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="item-name">Name</label>
            <input
              id="item-name"
              type="text"
              value={currentItem.name}
              onChange={(e) => handleItemChange('name', e.target.value)}
              placeholder="Enter item name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="item-drop-chance">Drop Chance (%)</label>
            <input
              id="item-drop-chance"
              type="number"
              min="0"
              max="100"
              value={currentItem.dropChance}
              onChange={(e) => handleItemChange('dropChance', e.target.value)}
            />
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-button"
            onClick={handleCancelItemForm}
          >
            Cancel
          </button>
          <button
            type="button"
            className="save-button"
            onClick={handleSaveItem}
            disabled={!currentItem.name}
          >
            Update Item
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="wizard-step">
      <h2 className="step-title">Loot Table</h2>

      {showItemForm && (
        <div className="item-form-backdrop" onClick={handleCancelItemForm}></div>
      )}
      
      {!showItemForm ? renderLootTable() : renderItemForm()}

      {/* Item Selector Modal */}
      {showItemSelector && createPortal(
        <div className="modal-overlay" onClick={() => setShowItemSelector(false)}>
          <div className="item-selector-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Select Item to Add</h3>
              <button
                type="button"
                className="close-btn"
                onClick={() => setShowItemSelector(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="modal-filters">
              <div className="filter-row">
                <div className="filter-group">
                  <label>Search:</label>
                  <input
                    type="text"
                    placeholder="Search items..."
                    value={itemSearchQuery}
                    onChange={(e) => setItemSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>

                <div className="filter-group">
                  <label>Type:</label>
                  <select
                    value={selectedItemType}
                    onChange={(e) => setSelectedItemType(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Types</option>
                    <option value="weapon">Weapon</option>
                    <option value="armor">Armor</option>
                    <option value="consumable">Consumable</option>
                    <option value="material">Material</option>
                    <option value="tool">Tool</option>
                    <option value="misc">Miscellaneous</option>
                    <option value="quest">Quest Item</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Quality:</label>
                  <select
                    value={selectedQuality}
                    onChange={(e) => setSelectedQuality(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Qualities</option>
                    <option value="poor">Poor</option>
                    <option value="common">Common</option>
                    <option value="uncommon">Uncommon</option>
                    <option value="rare">Rare</option>
                    <option value="epic">Epic</option>
                    <option value="legendary">Legendary</option>
                  </select>
                </div>

                <div className="filter-group">
                  <label>Sort:</label>
                  <select
                    value={`${sortBy}-${sortOrder}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-');
                      setSortBy(field);
                      setSortOrder(order);
                    }}
                    className="filter-select"
                  >
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="type-asc">Type (A-Z)</option>
                    <option value="quality-asc">Quality (Low-High)</option>
                    <option value="quality-desc">Quality (High-Low)</option>
                  </select>
                </div>
              </div>

              <div className="filter-actions">
                <div className="filter-info">
                  Showing {filteredAndSortedItems.length} items
                </div>
                <button
                  type="button"
                  className="reset-filters-btn"
                  onClick={resetFilters}
                  title="Reset all filters"
                >
                  <i className="fas fa-undo"></i> Reset
                </button>
              </div>
            </div>

            <div className="items-grid">
              {filteredAndSortedItems.length === 0 ? (
                <div className="no-items-message">
                  <p>No items match your current filters.</p>
                  <p>Try adjusting your search criteria or resetting the filters.</p>
                </div>
              ) : (
                filteredAndSortedItems.map((item, index) => {
                const qualityColor = getQualityColor(item.quality || 'common');
                const isSelected = isItemSelected(item);

                return (
                  <div
                    key={`${item.id}-${index}`}
                    className={`item-icon-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleItemSelect(item)}
                    onMouseEnter={(e) => handleMouseEnter(e, item)}
                    onMouseMove={(e) => handleMouseMove(e, item)}
                    onMouseLeave={handleMouseLeave}
                    title={item.name}
                  >
                    <div
                      className="item-icon-only"
                      style={{
                        backgroundImage: `url(${getItemIconPath(item)})`,
                        borderColor: qualityColor
                      }}
                    />
                    {isSelected && (
                      <div className="selection-indicator">
                        <i className="fas fa-check"></i>
                      </div>
                    )}
                  </div>
                );
              }))}
            </div>

            {/* Footer with selection info and buttons */}
            <div className="modal-footer">
              <div className="selection-info">
                <span>{selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected</span>
              </div>

              <div className="footer-buttons">
                <button
                  className="cancel-button"
                  onClick={() => {
                    setShowItemSelector(false);
                    setSelectedItems([]);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="confirm-button"
                  onClick={handleConfirmSelection}
                  disabled={selectedItems.length === 0}
                >
                  <i className="fas fa-check"></i> Add Selected Items
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
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
              zIndex: 9999999999
            }}
          >
            <ItemTooltip item={tooltip.item} />
          </div>
        </TooltipPortal>
      )}

      {/* Item Tooltip - Rendered at document level using createPortal */}
      {tooltipItem && createPortal(
        <div
          className="item-tooltip-wrapper"
          ref={tooltipRef}
          style={{
            position: 'fixed',
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            zIndex: 99999,
            pointerEvents: 'none'
          }}
        >
          {/* Pass dropChance as a prop to ItemTooltip to include it in the tooltip */}
          <ItemTooltip
            item={{
              ...tooltipItem,
              // Add any missing properties that might be needed for proper display
              quality: tooltipItem.quality || tooltipItem.rarity || 'common',
              // Ensure baseStats is an object if it doesn't exist
              baseStats: tooltipItem.baseStats || {},
              // Include drop chance as a custom property for the tooltip
              dropChanceDisplay: tooltipItem.dropChance
            }}
          />
        </div>,
        document.body
      )}
    </div>
  );
};

export default Step4LootTable;
