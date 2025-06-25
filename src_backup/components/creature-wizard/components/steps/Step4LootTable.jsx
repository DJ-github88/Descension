import React, { useState, useEffect } from 'react';
import { useCreatureWizard, useCreatureWizardDispatch, wizardActionCreators } from '../../context/CreatureWizardContext';
import useItemStore from '../../../../store/itemStore';
import '../../styles/WizardSteps.css';

// Helper function to get icon URL
const getIconUrl = (iconId) => {
  if (!iconId) return 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
  return `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`;
};

// Helper function to get color based on item quality
const getQualityColor = (quality) => {
  switch (quality?.toLowerCase()) {
    case 'poor':
      return '#9d9d9d';
    case 'common':
      return '#ffffff';
    case 'uncommon':
      return '#1eff00';
    case 'rare':
      return '#0070dd';
    case 'epic':
      return '#a335ee';
    case 'legendary':
      return '#ff8000';
    case 'artifact':
      return '#e6cc80';
    case 'heirloom':
      return '#00ccff';
    default:
      return '#ffffff';
  }
};

const Step4LootTable = () => {
  const wizardState = useCreatureWizard();
  const dispatch = useCreatureWizardDispatch();
  const itemStore = useItemStore();

  const [showItemSelector, setShowItemSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [dropChance, setDropChance] = useState(100);
  const [minQuantity, setMinQuantity] = useState(1);
  const [maxQuantity, setMaxQuantity] = useState(1);

  // Handle currency change
  const handleCurrencyChange = (currency, field, value) => {
    const numValue = parseInt(value, 10) || 0;

    dispatch(wizardActionCreators.setLootTable({
      currency: {
        ...wizardState.lootTable.currency,
        [currency]: {
          ...wizardState.lootTable.currency[currency],
          [field]: numValue
        }
      }
    }));
  };

  // Handle adding an item to the loot table
  const handleAddItem = () => {
    if (!selectedItem) return;

    const newLootItem = {
      itemId: selectedItem.id,
      name: selectedItem.name,
      iconId: selectedItem.iconId,
      quality: selectedItem.quality,
      dropChance,
      quantity: {
        min: minQuantity,
        max: maxQuantity
      }
    };

    dispatch(wizardActionCreators.addLootItem(newLootItem));

    // Reset form
    setSelectedItem(null);
    setDropChance(100);
    setMinQuantity(1);
    setMaxQuantity(1);
    setShowItemSelector(false);
  };

  // Handle removing an item from the loot table
  const handleRemoveItem = (itemId) => {
    dispatch(wizardActionCreators.removeLootItem(itemId));
  };

  // Handle updating an item in the loot table
  const handleUpdateItem = (itemId, field, value) => {
    let updates = {};

    if (field === 'dropChance') {
      updates = { dropChance: parseInt(value, 10) || 0 };
    } else if (field === 'minQuantity') {
      const min = parseInt(value, 10) || 1;
      const item = wizardState.lootTable.items.find(i => i.itemId === itemId);
      const max = Math.max(min, item.quantity.max);

      updates = {
        quantity: {
          min,
          max
        }
      };
    } else if (field === 'maxQuantity') {
      const max = parseInt(value, 10) || 1;
      const item = wizardState.lootTable.items.find(i => i.itemId === itemId);
      const min = Math.min(max, item.quantity.min);

      updates = {
        quantity: {
          min,
          max
        }
      };
    }

    dispatch(wizardActionCreators.updateLootItem(itemId, updates));
  };

  // Get items from the store with fallback to empty array
  const items = itemStore?.items || [];

  // Filter items based on search query
  const filteredItems = searchQuery
    ? items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : items;

  return (
    <div className="wizard-step">
      <h2 className="step-title">Loot Table</h2>

      <div className="form-section">
        <h3 className="section-title">Currency Drops</h3>

        <div className="form-row three-columns">
          <div className="form-group">
            <label>Gold</label>
            <div className="range-inputs">
              <div className="range-input">
                <label>Min</label>
                <input
                  type="number"
                  min="0"
                  value={wizardState.lootTable.currency.gold.min}
                  onChange={(e) => handleCurrencyChange('gold', 'min', e.target.value)}
                />
              </div>
              <div className="range-input">
                <label>Max</label>
                <input
                  type="number"
                  min="0"
                  value={wizardState.lootTable.currency.gold.max}
                  onChange={(e) => handleCurrencyChange('gold', 'max', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Silver</label>
            <div className="range-inputs">
              <div className="range-input">
                <label>Min</label>
                <input
                  type="number"
                  min="0"
                  value={wizardState.lootTable.currency.silver.min}
                  onChange={(e) => handleCurrencyChange('silver', 'min', e.target.value)}
                />
              </div>
              <div className="range-input">
                <label>Max</label>
                <input
                  type="number"
                  min="0"
                  value={wizardState.lootTable.currency.silver.max}
                  onChange={(e) => handleCurrencyChange('silver', 'max', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>Copper</label>
            <div className="range-inputs">
              <div className="range-input">
                <label>Min</label>
                <input
                  type="number"
                  min="0"
                  value={wizardState.lootTable.currency.copper.min}
                  onChange={(e) => handleCurrencyChange('copper', 'min', e.target.value)}
                />
              </div>
              <div className="range-input">
                <label>Max</label>
                <input
                  type="number"
                  min="0"
                  value={wizardState.lootTable.currency.copper.max}
                  onChange={(e) => handleCurrencyChange('copper', 'max', e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="form-section">
        <div className="section-header">
          <h3 className="section-title">Item Drops</h3>
          <button
            className="add-item-button"
            onClick={() => setShowItemSelector(true)}
          >
            <i className="fas fa-plus"></i> Add Item
          </button>
        </div>

        {wizardState.lootTable.items.length === 0 ? (
          <div className="no-items">
            <p>No items in loot table yet.</p>
            <p>Click "Add Item" to add items that this creature can drop.</p>
          </div>
        ) : (
          <div className="loot-items-list">
            {wizardState.lootTable.items.map(item => (
              <div key={item.itemId} className="loot-item">
                <div className="loot-item-info">
                  <div
                    className="item-icon"
                    style={{ backgroundImage: `url(${getIconUrl(item.iconId)})` }}
                  ></div>
                  <div className="item-details">
                    <div className="item-name" style={{ color: getQualityColor(item.quality) }}>
                      {item.name}
                    </div>
                    <div className="item-quantity">
                      Quantity: {item.quantity.min === item.quantity.max
                        ? item.quantity.min
                        : `${item.quantity.min}-${item.quantity.max}`
                      }
                    </div>
                  </div>
                </div>

                <div className="loot-item-controls">
                  <div className="drop-chance">
                    <label>Drop Chance</label>
                    <div className="drop-chance-input">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={item.dropChance}
                        onChange={(e) => handleUpdateItem(item.itemId, 'dropChance', e.target.value)}
                      />
                      <span className="percentage">%</span>
                    </div>
                  </div>

                  <div className="quantity-controls">
                    <div className="quantity-input">
                      <label>Min</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity.min}
                        onChange={(e) => handleUpdateItem(item.itemId, 'minQuantity', e.target.value)}
                      />
                    </div>
                    <div className="quantity-input">
                      <label>Max</label>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity.max}
                        onChange={(e) => handleUpdateItem(item.itemId, 'maxQuantity', e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    className="remove-item-button"
                    onClick={() => handleRemoveItem(item.itemId)}
                  >
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {showItemSelector && (
          <div className="item-selector">
            <div className="item-selector-header">
              <h4>Select an Item</h4>
              <button
                className="close-selector-button"
                onClick={() => setShowItemSelector(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            <div className="item-search">
              <input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="items-grid">
              {filteredItems.length === 0 ? (
                <div className="no-items-found">
                  <p>No items match your search.</p>
                </div>
              ) : (
                filteredItems.map(item => (
                  <div
                    key={item.id}
                    className={`item-option ${selectedItem?.id === item.id ? 'selected' : ''}`}
                    onClick={() => setSelectedItem(item)}
                  >
                    <div
                      className="item-icon"
                      style={{ backgroundImage: `url(${getIconUrl(item.iconId)})` }}
                    ></div>
                    <div className="item-name" style={{ color: getQualityColor(item.quality) }}>
                      {item.name}
                    </div>
                  </div>
                ))
              )}
            </div>

            {selectedItem && (
              <div className="item-config">
                <div className="selected-item-info">
                  <div
                    className="item-icon"
                    style={{ backgroundImage: `url(${getIconUrl(selectedItem.iconId)})` }}
                  ></div>
                  <div className="item-name" style={{ color: getQualityColor(selectedItem.quality) }}>
                    {selectedItem.name}
                  </div>
                </div>

                <div className="item-config-controls">
                  <div className="config-group">
                    <label>Drop Chance (%)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={dropChance}
                      onChange={(e) => setDropChance(parseInt(e.target.value) || 1)}
                    />
                  </div>

                  <div className="config-group">
                    <label>Quantity</label>
                    <div className="quantity-inputs">
                      <div className="quantity-input">
                        <label>Min</label>
                        <input
                          type="number"
                          min="1"
                          value={minQuantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 1;
                            setMinQuantity(value);
                            if (value > maxQuantity) {
                              setMaxQuantity(value);
                            }
                          }}
                        />
                      </div>
                      <div className="quantity-input">
                        <label>Max</label>
                        <input
                          type="number"
                          min="1"
                          value={maxQuantity}
                          onChange={(e) => {
                            const value = parseInt(e.target.value) || 1;
                            setMaxQuantity(value);
                            if (value < minQuantity) {
                              setMinQuantity(value);
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  className="add-to-loot-button"
                  onClick={handleAddItem}
                >
                  Add to Loot Table
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get color based on item quality
const getQualityColor = (quality) => {
  switch (quality?.toLowerCase()) {
    case 'poor':
      return '#9d9d9d';
    case 'common':
      return '#ffffff';
    case 'uncommon':
      return '#1eff00';
    case 'rare':
      return '#0070dd';
    case 'epic':
      return '#a335ee';
    case 'legendary':
      return '#ff8000';
    case 'artifact':
      return '#e6cc80';
    case 'heirloom':
      return '#00ccff';
    default:
      return '#ffffff';
  }
};

export default Step4LootTable;
