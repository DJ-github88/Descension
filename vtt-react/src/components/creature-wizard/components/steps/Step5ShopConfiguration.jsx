import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCreatureWizard, useCreatureWizardDispatch, wizardActionCreators } from '../../context/CreatureWizardContext';
import useItemStore from '../../../../store/itemStore';
import ItemTooltip from '../../../item-generation/ItemTooltip';
import TooltipPortal from '../../../tooltips/TooltipPortal';
import { getIconUrl } from '../../../../utils/assetManager';
import '../../styles/WizardSteps.css';
import '../../styles/ShopConfiguration.css';

const Step5ShopConfiguration = () => {
  const wizardState = useCreatureWizard();
  const wizardDispatch = useCreatureWizardDispatch();
  const { items: itemLibrary } = useItemStore();

  // Quality color mapping
  const getQualityColor = (quality) => {
    const colors = {
      poor: '#9d9d9d',
      common: '#ffffff',
      uncommon: '#1eff00',
      rare: '#0070dd',
      epic: '#a335ee',
      legendary: '#ff8000'
    };
    return colors[quality] || colors.common;
  };
  
  // Local state for UI
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItemType, setSelectedItemType] = useState('all');
  const [selectedQuality, setSelectedQuality] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [tooltip, setTooltip] = useState({ show: false, item: null, x: 0, y: 0 });
  const [editingItemIndex, setEditingItemIndex] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]); // For multi-select in item selector
  
  // Handle shopkeeper status toggle
  const handleShopkeeperToggle = (isShopkeeper) => {
    wizardDispatch(wizardActionCreators.setShopkeeperStatus(isShopkeeper));
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedItemType('all');
    setSelectedQuality('all');
    setSortBy('name');
    setSortOrder('asc');
  };
  
  // Handle shop info changes
  const handleShopInfoChange = (field, value) => {
    wizardDispatch(wizardActionCreators.setShopInfo({
      [field]: value
    }));
  };

  // Handle buy rate changes
  const handleBuyRateChange = (field, value) => {
    const updatedBuyRates = {
      ...wizardState.shopInventory.buyRates,
      [field]: value
    };
    wizardDispatch(wizardActionCreators.setShopInfo({ buyRates: updatedBuyRates }));
  };

  // Handle category-specific buy rate changes
  const handleCategoryBuyRateChange = (category, value) => {
    const updatedBuyRates = {
      ...wizardState.shopInventory.buyRates,
      categories: {
        ...wizardState.shopInventory.buyRates.categories,
        [category]: value
      }
    };
    wizardDispatch(wizardActionCreators.setShopInfo({ buyRates: updatedBuyRates }));
  };
  
  // Filter and sort items
  const filteredAndSortedItems = itemLibrary
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedItemType === 'all' || item.type === selectedItemType;
      const matchesQuality = selectedQuality === 'all' || item.quality === selectedQuality;

      // Don't show items already in shop
      const alreadyInShop = wizardState.shopInventory.items.some(shopItem => shopItem.itemId === item.id);

      return matchesSearch && matchesType && matchesQuality && !alreadyInShop;
    })
    .sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'quality':
          const qualityOrder = ['poor', 'common', 'uncommon', 'rare', 'epic', 'legendary'];
          comparison = qualityOrder.indexOf(a.quality || 'common') - qualityOrder.indexOf(b.quality || 'common');
          break;
        case 'value':
          const aValue = calculateTotalCopper(a.value || { gold: 0, silver: 0, copper: 0 });
          const bValue = calculateTotalCopper(b.value || { gold: 0, silver: 0, copper: 0 });
          comparison = aValue - bValue;
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Get unique item types and qualities for filters
  const itemTypes = ['all', ...new Set(itemLibrary.map(item => item.type))];
  const itemQualities = ['all', ...new Set(itemLibrary.map(item => item.quality || 'common'))];

  // Helper function to calculate total copper value
  const calculateTotalCopper = (price) => {
    if (!price) return 0;
    return (price.platinum || 0) * 1000000 + (price.gold || 0) * 10000 + (price.silver || 0) * 100 + (price.copper || 0);
  };
  
  // Calculate merchant markup price (175% of base value to prevent exploitation)
  const calculateMerchantPrice = (item, markupPercent = 175) => {
    if (!item.value) return { platinum: 0, gold: 0, silver: 1, copper: 0 };

    const calculateTotalCopper = (currency) => {
      return (currency.platinum || 0) * 1000000 + (currency.gold || 0) * 10000 + (currency.silver || 0) * 100 + (currency.copper || 0);
    };

    const totalCopper = calculateTotalCopper(item.value);
    const merchantCopper = Math.floor(totalCopper * (markupPercent / 100));

    return {
      platinum: Math.floor(merchantCopper / 1000000),
      gold: Math.floor((merchantCopper % 1000000) / 10000),
      silver: Math.floor((merchantCopper % 10000) / 100),
      copper: merchantCopper % 100
    };
  };

  // Handle adding single item to shop (for direct clicks when not multi-selecting)
  const handleAddItem = (item) => {
    const shopItem = {
      itemId: item.id,
      iconId: item.iconId,
      customPrice: calculateMerchantPrice(item),
      quantity: 1
    };
    wizardDispatch(wizardActionCreators.addShopItem(shopItem));
    setShowItemSelector(false);
    setSelectedItems([]); // Clear selection
  };

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
      const shopItem = {
        itemId: item.id,
        iconId: item.iconId,
        customPrice: calculateMerchantPrice(item),
        quantity: 1
      };
      wizardDispatch(wizardActionCreators.addShopItem(shopItem));
    });
    setShowItemSelector(false);
    setSelectedItems([]);
  };

  // Check if an item is selected
  const isItemSelected = (item) => {
    return selectedItems.some(selectedItem => selectedItem.id === item.id);
  };
  
  // Handle updating shop item
  const handleUpdateShopItem = (index, field, value) => {
    const currentItem = wizardState.shopInventory.items[index];
    const updatedItem = { ...currentItem, [field]: value };
    wizardDispatch(wizardActionCreators.updateShopItem(index, updatedItem));
  };
  
  // Handle updating custom price
  const handlePriceChange = (index, currency, value) => {
    const currentItem = wizardState.shopInventory.items[index];
    const updatedPrice = {
      ...currentItem.customPrice,
      [currency]: Math.max(0, parseInt(value) || 0)
    };
    const updatedItem = { ...currentItem, customPrice: updatedPrice };
    wizardDispatch(wizardActionCreators.updateShopItem(index, updatedItem));
  };
  
  // Handle removing shop item
  const handleRemoveShopItem = (index) => {
    wizardDispatch(wizardActionCreators.removeShopItem(index));
  };
  
  // Get item from library by ID
  const getItemById = (itemId) => {
    return itemLibrary.find(item => item.id === itemId);
  };
  
  // Handle tooltip (immediate display like other working tooltips)
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
  
  // Format currency display
  const formatCurrency = (price) => {
    const parts = [];
    if (price.platinum > 0) parts.push(`${price.platinum}p`);
    if (price.gold > 0) parts.push(`${price.gold}g`);
    if (price.silver > 0) parts.push(`${price.silver}s`);
    if (price.copper > 0) parts.push(`${price.copper}c`);
    return parts.length > 0 ? parts.join(' ') : '0c';
  };
  


  return (
    <div className="wizard-step shop-configuration-step">
      <h2>Merchant Configuration</h2>
      <p>Configure this creature as a merchant with wares for sale.</p>
      <div style={{ marginBottom: '20px' }}></div>

      {/* Shopkeeper Toggle */}
      <div className="form-group">
        <label className="checkbox-label" style={{ fontSize: '15px', fontWeight: '500', color: '#6b5b47', marginBottom: '8px', display: 'flex', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={wizardState.isShopkeeper}
            onChange={(e) => handleShopkeeperToggle(e.target.checked)}
          />
          <span className="checkbox-custom"></span>
          <span className="checkbox-text">Make this creature a merchant</span>
        </label>
        <div style={{ marginLeft: '28px', marginBottom: '20px', marginTop: '4px' }}>
          <span style={{ fontSize: '14px', fontWeight: '400', color: '#6b5b47', lineHeight: '1.4' }}>
            Enable merchant functionality to allow this creature to buy and sell items with players
          </span>
        </div>
      </div>
      
      {wizardState.isShopkeeper && (
        <>
          {/* Shop Basic Info */}
          <div className="shop-info-section">
            <h3>Shop Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="shopName">Shop Name</label>
                <input
                  type="text"
                  id="shopName"
                  value={wizardState.shopInventory.shopName}
                  onChange={(e) => handleShopInfoChange('shopName', e.target.value)}
                  placeholder="e.g., Thorin's Armory"
                />
              </div>
              <div className="form-group">
                <label>
                  <input
                    type="checkbox"
                    checked={wizardState.shopInventory.restockOnLongRest}
                    onChange={(e) => handleShopInfoChange('restockOnLongRest', e.target.checked)}
                  />
                  Restock on Long Rest
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="shopDescription">Shop Description</label>
              <textarea
                id="shopDescription"
                value={wizardState.shopInventory.shopDescription}
                onChange={(e) => handleShopInfoChange('shopDescription', e.target.value)}
                placeholder="Describe the shop's atmosphere, specialties, or unique features..."
                rows={3}
              />
            </div>
          </div>

          {/* Buy Rates Configuration */}
          <div className="buy-rates-section">
            <h3>Buy Rates Configuration</h3>
            <p>Set how much this merchant pays for different item categories (as percentage of item value).</p>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="defaultBuyRate">Default Buy Rate (%)</label>
                <input
                  type="number"
                  id="defaultBuyRate"
                  min="0"
                  max="200"
                  value={wizardState.shopInventory.buyRates?.default || 50}
                  onChange={(e) => handleBuyRateChange('default', parseInt(e.target.value) || 0)}
                  placeholder="50"
                />
              </div>
            </div>

            <div className="category-rates">
              <h3>Category-Specific Rates</h3>
              <p>Set buy rates for each item category. These match the standard item types in the game.</p>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="weaponRate">Weapons (%)</label>
                  <input
                    type="number"
                    id="weaponRate"
                    min="0"
                    max="200"
                    value={wizardState.shopInventory.buyRates?.categories?.weapon || 50}
                    onChange={(e) => handleCategoryBuyRateChange('weapon', parseInt(e.target.value) || 0)}
                    placeholder="50"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="armorRate">Armor (%)</label>
                  <input
                    type="number"
                    id="armorRate"
                    min="0"
                    max="200"
                    value={wizardState.shopInventory.buyRates?.categories?.armor || 50}
                    onChange={(e) => handleCategoryBuyRateChange('armor', parseInt(e.target.value) || 0)}
                    placeholder="50"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="consumableRate">Consumables (%)</label>
                  <input
                    type="number"
                    id="consumableRate"
                    min="0"
                    max="200"
                    value={wizardState.shopInventory.buyRates?.categories?.consumable || 50}
                    onChange={(e) => handleCategoryBuyRateChange('consumable', parseInt(e.target.value) || 0)}
                    placeholder="50"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="accessoryRate">Accessories (%)</label>
                  <input
                    type="number"
                    id="accessoryRate"
                    min="0"
                    max="200"
                    value={wizardState.shopInventory.buyRates?.categories?.accessory || 50}
                    onChange={(e) => handleCategoryBuyRateChange('accessory', parseInt(e.target.value) || 0)}
                    placeholder="50"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="containerRate">Containers (%)</label>
                  <input
                    type="number"
                    id="containerRate"
                    min="0"
                    max="200"
                    value={wizardState.shopInventory.buyRates?.categories?.container || 50}
                    onChange={(e) => handleCategoryBuyRateChange('container', parseInt(e.target.value) || 0)}
                    placeholder="50"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="miscRate">Miscellaneous (%)</label>
                  <input
                    type="number"
                    id="miscRate"
                    min="0"
                    max="200"
                    value={wizardState.shopInventory.buyRates?.categories?.miscellaneous || 50}
                    onChange={(e) => handleCategoryBuyRateChange('miscellaneous', parseInt(e.target.value) || 0)}
                    placeholder="50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Merchant Wares */}
          <div className="shop-inventory-section">
            <div className="section-header">
              <h3>Merchant Wares</h3>
              <button
                type="button"
                className="add-item-btn"
                onClick={() => setShowItemSelector(true)}
              >
                <i className="fas fa-plus"></i> Add Item
              </button>
            </div>
            
            {wizardState.shopInventory.items.length === 0 ? (
              <div className="empty-inventory">
                <p>No items in shop inventory. Click "Add Item" to get started.</p>
              </div>
            ) : (
              <div className="shop-items-list">
                {wizardState.shopInventory.items.map((shopItem, index) => {
                  const item = getItemById(shopItem.itemId);
                  if (!item) return null;

                  const qualityColor = getQualityColor(item.quality || 'common');
                  const iconId = item.iconId || shopItem.iconId || item.imageUrl || 'Misc/Books/book-brown-teal-question-mark';
                  const iconUrl = getIconUrl(iconId, 'items');

                  return (
                    <div key={index} className="shop-item-row">
                      <div className="item-left-section">
                        <div
                          className="item-icon-wrapper"
                          onMouseEnter={(e) => handleMouseEnter(e, item)}
                          onMouseMove={(e) => handleMouseMove(e, item)}
                          onMouseLeave={handleMouseLeave}
                        >
                          <img
                            className="item-icon"
                            src={iconUrl}
                            alt={item.name || 'Item'}
                            style={{
                              borderColor: qualityColor
                            }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                            }}
                          />
                        </div>
                        <div className="item-info">
                          <div className="item-name-full">
                            {item.name}
                          </div>
                          <div className="item-secondary-info">
                            <span className="item-quality-badge" style={{ backgroundColor: qualityColor }}>
                              {item.quality?.charAt(0).toUpperCase() + item.quality?.slice(1) || 'Common'}
                            </span>
                            <span className="item-type-badge">
                              {item.type?.charAt(0).toUpperCase() + item.type?.slice(1) || 'Misc'}
                            </span>
                            {item.requiredLevel && item.requiredLevel > 1 && (
                              <span className="item-level-badge">
                                Lv.{item.requiredLevel}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="item-controls">
                        <div className="price-inputs">
                          <input
                            type="number"
                            min="0"
                            max="999999"
                            className="currency-input platinum-input"
                            value={shopItem.customPrice.platinum || 0}
                            onChange={(e) => handlePriceChange(index, 'platinum', e.target.value)}
                            placeholder="0"
                            title="Platinum"
                          />
                          <input
                            type="number"
                            min="0"
                            max="999999"
                            className="currency-input gold-input"
                            value={shopItem.customPrice.gold || 0}
                            onChange={(e) => handlePriceChange(index, 'gold', e.target.value)}
                            placeholder="0"
                            title="Gold"
                          />
                          <input
                            type="number"
                            min="0"
                            max="999999"
                            className="currency-input silver-input"
                            value={shopItem.customPrice.silver || 0}
                            onChange={(e) => handlePriceChange(index, 'silver', e.target.value)}
                            placeholder="0"
                            title="Silver"
                          />
                          <input
                            type="number"
                            min="0"
                            max="999999"
                            className="currency-input copper-input"
                            value={shopItem.customPrice.copper || 0}
                            onChange={(e) => handlePriceChange(index, 'copper', e.target.value)}
                            placeholder="0"
                            title="Copper"
                          />
                        </div>

                        <div className="quantity-input">
                          <input
                            type="number"
                            min="1"
                            value={shopItem.quantity}
                            onChange={(e) => handleUpdateShopItem(index, 'quantity', parseInt(e.target.value) || 1)}
                            placeholder="Qty"
                            title="Quantity"
                          />
                        </div>

                        <button
                          type="button"
                          className="remove-item-btn"
                          onClick={() => handleRemoveShopItem(index)}
                          title="Remove item"
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}
      
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
                <input
                  type="text"
                  placeholder="Search items..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />

                <select
                  value={selectedItemType}
                  onChange={(e) => setSelectedItemType(e.target.value)}
                  className="type-filter"
                >
                  {itemTypes.map(type => (
                    <option key={type} value={type}>
                      {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedQuality}
                  onChange={(e) => setSelectedQuality(e.target.value)}
                  className="quality-filter"
                >
                  {itemQualities.map(quality => (
                    <option key={quality} value={quality}>
                      {quality === 'all' ? 'All Qualities' : quality.charAt(0).toUpperCase() + quality.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-actions">
                <div className="sort-row">
                  <label>Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-filter"
                  >
                    <option value="name">Name</option>
                    <option value="type">Type</option>
                    <option value="quality">Quality</option>
                    <option value="value">Value</option>
                  </select>

                  <button
                    type="button"
                    className={`sort-order-btn ${sortOrder}`}
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    title={`Sort ${sortOrder === 'asc' ? 'Ascending' : 'Descending'}`}
                  >
                    <i className={`fas fa-sort-${sortOrder === 'asc' ? 'up' : 'down'}`}></i>
                  </button>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
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
                    <img
                      className="item-icon-only"
                      src={getIconUrl(item.iconId || item.imageUrl || 'Misc/Books/book-brown-teal-question-mark', 'items')}
                      alt={item.name || 'Item'}
                      style={{
                        borderColor: qualityColor
                      }}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
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
    </div>
  );
};

export default Step5ShopConfiguration;
