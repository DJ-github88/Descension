import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import useItemStore from '../../store/itemStore';
import ItemTooltip from '../item-generation/ItemTooltip';
import TooltipPortal from '../tooltips/TooltipPortal';
import { WOW_ICON_BASE_URL } from '../item-generation/wowIcons';
import { RARITY_COLORS } from '../../constants/itemConstants';
import '../creature-wizard/styles/ShopConfiguration.css';

const ItemSelectionModal = ({ isOpen, onClose, onSelectItem }) => {
  const { items } = useItemStore(state => ({ items: state.items }));
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [qualityFilter, setQualityFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const modalRef = useRef(null);

  // Get unique item types and qualities for filters
  const itemTypes = ['all', ...new Set(items.map(item => item.type).filter(Boolean))];
  const itemQualities = ['all', ...new Set(items.map(item => item.quality).filter(Boolean))];

  // Filter and sort items
  const filteredItems = items
    .filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || item.type === typeFilter;
      const matchesQuality = qualityFilter === 'all' || item.quality === qualityFilter;
      return matchesSearch && matchesType && matchesQuality;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'type':
          return (a.type || '').localeCompare(b.type || '');
        case 'quality':
          const qualityOrder = { poor: 0, common: 1, uncommon: 2, rare: 3, epic: 4, legendary: 5 };
          return (qualityOrder[a.quality] || 0) - (qualityOrder[b.quality] || 0);
        default:
          return 0;
      }
    });

  // Handle click outside to close modal
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle item selection
  const handleSelectItem = (item) => {
    onSelectItem(item);
    onClose();
  };

  // Handle item hover for tooltips
  const handleMouseEnter = (e, item) => {
    setHoveredItem(item);
    setTooltipPosition({
      x: e.clientX,
      y: e.clientY
    });
  };

  const handleMouseMove = (e, item) => {
    if (hoveredItem && hoveredItem.id === item.id) {
      setTooltipPosition({
        x: e.clientX,
        y: e.clientY
      });
    }
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div className="item-selector-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Select Item to Add</h3>
          <button
            type="button"
            className="close-btn"
            onClick={onClose}
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
            </div>
            <div className="filter-group">
              <label>Type:</label>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="filter-select"
              >
                {itemTypes.map(type => (
                  <option key={type} value={type}>
                    {type === 'all' ? 'All Types' : type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label>Quality:</label>
              <select
                value={qualityFilter}
                onChange={(e) => setQualityFilter(e.target.value)}
                className="filter-select"
              >
                {itemQualities.map(quality => (
                  <option key={quality} value={quality}>
                    {quality === 'all' ? 'All Qualities' : quality.charAt(0).toUpperCase() + quality.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="filter-row">
            <div className="filter-group">
              <label>Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="name">Name</option>
                <option value="type">Type</option>
                <option value="quality">Quality</option>
              </select>
            </div>
            <div className="filter-group">
              <span className="item-count">Showing {filteredItems.length} items</span>
            </div>
          </div>
        </div>

        {!items || items.length === 0 ? (
          <div className="no-items-message">
            <p>No items available in the library.</p>
            <p style={{ fontSize: '12px', color: '#666' }}>
              Items count: {items ? items.length : 'undefined'}
            </p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="no-items-message">
            <p>No items found matching your criteria.</p>
            <p style={{ fontSize: '12px', color: '#666' }}>
              Total items: {items.length}, Filtered: {filteredItems.length}
            </p>
          </div>
        ) : (
          <div className="items-grid">
            {filteredItems.map((item, index) => {
              const qualityColor = RARITY_COLORS[item.quality?.toLowerCase() || 'common']?.text || '#a08c70';

              return (
                <div
                  key={`${item.id}-${index}`}
                  className="item-icon-card"
                  onClick={() => handleSelectItem(item)}
                  onMouseEnter={(e) => handleMouseEnter(e, item)}
                  onMouseMove={(e) => handleMouseMove(e, item)}
                  onMouseLeave={handleMouseLeave}
                  title={item.name}
                >
                  <div
                    className="item-icon-only"
                    style={{
                      backgroundImage: `url(${WOW_ICON_BASE_URL}${item.iconId || 'inv_misc_questionmark'}.jpg)`,
                      borderColor: qualityColor
                    }}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tooltip Portal */}
      {hoveredItem && (
        <TooltipPortal>
          <div
            style={{
              position: 'fixed',
              left: `${tooltipPosition.x + 15}px`,
              top: `${tooltipPosition.y - 10}px`,
              pointerEvents: 'none'
            }}
          >
            <ItemTooltip item={hoveredItem} />
          </div>
        </TooltipPortal>
      )}
    </div>,
    document.body
  );
};

export default ItemSelectionModal;
