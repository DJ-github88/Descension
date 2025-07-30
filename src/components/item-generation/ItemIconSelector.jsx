import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import { WOW_ICONS, getIconUrl } from './wowIcons';
import { ITEM_TYPES } from './itemConstants';
import '../../styles/item-icon-selector.css';

/**
 * ItemIconSelector component for choosing item icons
 * Displays a modal with a grid of icons categorized by item type
 */
const ItemIconSelector = ({ onSelect, onClose, currentIcon, itemType = 'weapon' }) => {
  const [selectedCategory, setSelectedCategory] = useState(itemType);
  const [searchTerm, setSearchTerm] = useState('');
  const modalRef = useRef(null);

  // Get all available icons based on item type
  const getIconsForCategory = (category) => {
    switch (category) {
      case 'weapon':
        return [
          ...WOW_ICONS.weapons.swords,
          ...WOW_ICONS.weapons.axes,
          ...WOW_ICONS.weapons.maces,
          ...WOW_ICONS.weapons.staves,
          ...WOW_ICONS.weapons.bows,
          ...WOW_ICONS.weapons.daggers,
          ...WOW_ICONS.weapons.spears,
        ];
      case 'armor':
        return [
          ...WOW_ICONS.armor.plate,
          ...WOW_ICONS.armor.mail,
          ...WOW_ICONS.armor.leather,
          ...WOW_ICONS.armor.cloth,
          ...WOW_ICONS.cloaks,
        ];
      case 'accessory':
        return [
          ...WOW_ICONS.jewelry.rings,
          ...WOW_ICONS.jewelry.necklaces,
          ...WOW_ICONS.jewelry.trinkets,
          ...WOW_ICONS.cloaks,
        ];
      case 'consumable':
        return [
          ...WOW_ICONS.consumables.potions,
          ...WOW_ICONS.consumables.food,
          ...WOW_ICONS.consumables.scrolls,
        ];
      case 'container':
        return WOW_ICONS.containers;
      case 'miscellaneous':
        return [
          ...WOW_ICONS.quest,
          ...WOW_ICONS.misc,
        ];
      case 'currency':
        return [
          { id: 'inv_misc_coin_01', name: 'Gold Coin' },
          { id: 'inv_misc_coin_02', name: 'Silver Coin' },
          { id: 'inv_misc_coin_03', name: 'Copper Coin' },
          { id: 'inv_misc_coin_05', name: 'Coin Pouch' },
          { id: 'inv_misc_coin_06', name: 'Heavy Purse' },
        ];
      case 'all':
        return [
          ...getIconsForCategory('weapon'),
          ...getIconsForCategory('armor'),
          ...getIconsForCategory('accessory'),
          ...getIconsForCategory('consumable'),
          ...getIconsForCategory('container'),
          ...getIconsForCategory('miscellaneous'),
          ...getIconsForCategory('currency'),
        ];
      default:
        return [];
    }
  };

  // Get available categories
  const categories = [
    { id: 'all', name: 'All Icons' },
    ...Object.keys(ITEM_TYPES).map(type => ({
      id: type,
      name: ITEM_TYPES[type].name
    }))
  ];

  // Get icons for current category
  const availableIcons = getIconsForCategory(selectedCategory);

  // Filter icons based on search term
  const filteredIcons = availableIcons.filter(icon =>
    icon.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  // Render the modal as a portal
  return ReactDOM.createPortal(
    <div className="item-icon-selector-overlay">
      <div className="item-icon-selector-modal" ref={modalRef}>
        <div className="item-icon-selector-header">
          <h3>Select Item Icon</h3>
          <button className="item-icon-selector-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="item-icon-selector-filters">
          <input
            type="text"
            className="item-icon-selector-search"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="item-icon-selector-categories">
            {categories.map(category => (
              <button
                key={category.id}
                className={`item-icon-selector-category ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="item-icon-selector-grid">
          {filteredIcons.map(icon => (
            <div
              key={icon.id}
              className={`item-icon-selector-item ${currentIcon === icon.id ? 'selected' : ''}`}
              onClick={() => onSelect(icon.id)}
              title={icon.name}
            >
              <div className="item-icon-selector-image-container">
                <img
                  src={getIconUrl(icon.id)}
                  alt={icon.name}
                  className="item-icon-selector-image"
                  onError={(e) => {
                    e.target.src = getIconUrl('inv_misc_questionmark');
                  }}
                />
              </div>
              <div className="item-icon-selector-name">{icon.name}</div>
            </div>
          ))}

          {filteredIcons.length === 0 && (
            <div className="item-icon-selector-no-results">
              No icons found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ItemIconSelector;
