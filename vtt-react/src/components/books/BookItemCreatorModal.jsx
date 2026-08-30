import React, { useState, useMemo } from 'react';
import useItemStore from '../../store/itemStore';
import { COMPREHENSIVE_ITEMS } from '../../data/items/index.js';
import ItemTooltip from '../item-generation/ItemTooltip';
import ItemWizard from '../item-generation/ItemWizard';
import { getIconUrl } from '../../utils/assetManager';
import { RARITY_COLORS } from '../../constants/itemConstants';
import { normalizeBookItemData } from './BookTtrpgBlocks';
import '../../styles/item-tooltip.css';
import './BookDocumentEditor.css';

const QUALITY_FILTERS = [
  { value: 'all', label: 'All Qualities' },
  { value: 'poor', label: 'Poor', color: '#9d9d9d' },
  { value: 'common', label: 'Common', color: '#f0e6d2' },
  { value: 'uncommon', label: 'Uncommon', color: '#4a934a' },
  { value: 'rare', label: 'Rare', color: '#0070dd' },
  { value: 'epic', label: 'Epic', color: '#a335ee' },
  { value: 'legendary', label: 'Legendary', color: '#ff8000' },
  { value: 'artifact', label: 'Artifact', color: '#e6cc80' }
];

const TYPE_FILTERS = [
  { value: 'all', label: 'All Categories' },
  { value: 'weapon', label: 'Weapons' },
  { value: 'armor', label: 'Armor & Shields' },
  { value: 'accessory', label: 'Accessories & Rings' },
  { value: 'consumable', label: 'Consumables & Potions' },
  { value: 'container', label: 'Containers & Bags' },
  { value: 'miscellaneous', label: 'Miscellaneous & Relics' },
  { value: 'currency', label: 'Currency' }
];

const BookItemCreatorModal = ({
  isOpen,
  onClose,
  initialData = {},
  onSave
}) => {
  const storeItems = useItemStore((state) => state.items);
  const allAvailableItems = useMemo(() => {
    if (storeItems && storeItems.length > 0) return storeItems;
    return COMPREHENSIVE_ITEMS || [];
  }, [storeItems]);

  const [searchQuery, setSearchQuery] = useState('');
  const [qualityFilter, setQualityFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedItem, setSelectedItem] = useState(() => {
    if (initialData && (initialData.name || initialData.id)) {
      return normalizeBookItemData(initialData);
    }
    return allAvailableItems[0] ? normalizeBookItemData(allAvailableItems[0]) : null;
  });

  const [mobileTab, setMobileTab] = useState('list');
  const [showItemWizard, setShowItemWizard] = useState(false);
  const [wizardInitialData, setWizardInitialData] = useState(null);

  // Filter items based on search and selected filters
  const filteredItems = useMemo(() => {
    return allAvailableItems.filter((item) => {
      const nameMatch = !searchQuery || 
        (item.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.subtype || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description || '').toLowerCase().includes(searchQuery.toLowerCase());

      const itemQuality = (item.quality || item.rarity || 'common').toLowerCase();
      const mappedQuality = itemQuality === 'very-rare' ? 'epic' : itemQuality;
      const qualityMatch = qualityFilter === 'all' || mappedQuality === qualityFilter;

      const itemType = (item.type || '').toLowerCase();
      const typeMatch = typeFilter === 'all' || itemType === typeFilter;

      return nameMatch && qualityMatch && typeMatch;
    });
  }, [allAvailableItems, searchQuery, qualityFilter, typeFilter]);

  if (!isOpen) return null;

  const handleLaunchCreateWizard = () => {
    setWizardInitialData({});
    setShowItemWizard(true);
  };

  const handleLaunchEditWizard = () => {
    setWizardInitialData(selectedItem || normalizeBookItemData(initialData));
    setShowItemWizard(true);
  };

  const handleWizardComplete = (formattedItem) => {
    setShowItemWizard(false);
    onSave(formattedItem);
    onClose();
  };

  const handleSelectAndConfirm = (item) => {
    const normalized = normalizeBookItemData(item);
    onSave(normalized);
    onClose();
  };

  const currentPreviewItem = selectedItem ? normalizeBookItemData(selectedItem) : null;

  return (
    <div className="book-modal-overlay" onClick={onClose}>
      <div className="book-item-creator-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <i className="fas fa-gem"></i>
            <h3>Item Library & Relic Studio</h3>
          </div>
          <button type="button" className="close-modal-btn" onClick={onClose}>&times;</button>
        </div>

        {/* Filter and Action Header */}
        <div className="book-item-studio-controls">
          <div className="search-wrap">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search items by name, type, lore..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="modal-input"
            />
          </div>

          <div className="filter-dropdowns">
            <select
              className="modal-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              {TYPE_FILTERS.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>

            <select
              className="modal-select"
              value={qualityFilter}
              onChange={(e) => setQualityFilter(e.target.value)}
            >
              {QUALITY_FILTERS.map((q) => (
                <option key={q.value} value={q.value}>{q.label}</option>
              ))}
            </select>
          </div>

          <button
            type="button"
            className="book-item-action-btn create-new-btn"
            onClick={handleLaunchCreateWizard}
          >
            <i className="fas fa-plus"></i>
            <span>Create New with Item Wizard</span>
          </button>
        </div>

        {/* Mobile View Switcher Tabs (Shown on small screens via CSS) */}
        <div className="lore-mobile-nav-tabs">
          <button
            type="button"
            className={`lore-mobile-tab-btn ${mobileTab === 'list' ? 'active' : ''}`}
            onClick={() => setMobileTab('list')}
          >
            <i className="fas fa-list-ul"></i>
            <span>Items ({filteredItems.length})</span>
          </button>
          <button
            type="button"
            className={`lore-mobile-tab-btn ${mobileTab === 'preview' ? 'active' : ''}`}
            onClick={() => setMobileTab('preview')}
          >
            <i className="fas fa-eye"></i>
            <span>Live Preview {selectedItem ? `(${selectedItem.name})` : ''}</span>
          </button>
        </div>

        {/* Modal Main Body */}
        <div className={`book-item-studio-body mobile-show-${mobileTab}`}>
          {/* Left Column: Item Grid / List */}
          <div className={`book-item-picker-list ${mobileTab === 'list' ? 'mobile-visible' : 'mobile-hidden'}`}>
            <div className="picker-list-header">
              <span>Matching Items ({filteredItems.length})</span>
            </div>

            <div className="picker-list-scroll">
              {filteredItems.length === 0 ? (
                <div className="empty-picker-state">
                  <i className="fas fa-box-open"></i>
                  <p>No items found matching your filters.</p>
                </div>
              ) : (
                filteredItems.map((item, idx) => {
                  const norm = normalizeBookItemData(item);
                  const isSelected = selectedItem && (selectedItem.id === item.id || selectedItem.name === item.name);
                  const qLower = norm.quality.toLowerCase();
                  const qColor = RARITY_COLORS[qLower]?.text || '#f0e6d2';

                  return (
                    <div
                      key={`${item.id || item.name}-${idx}`}
                      className={`book-item-list-row ${isSelected ? 'selected' : ''}`}
                      onClick={() => {
                        setSelectedItem(norm);
                        setMobileTab('preview');
                      }}
                      onDoubleClick={() => handleSelectAndConfirm(norm)}
                    >
                      <div className="row-icon-box" data-quality={qLower}>
                        <img
                          src={norm.iconId ? getIconUrl(norm.iconId, 'items', true) : getIconUrl('inv_misc_questionmark', 'items', true)}
                          alt={norm.name}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = getIconUrl('inv_misc_questionmark', 'items', true);
                          }}
                        />
                      </div>

                      <div className="row-info">
                        <div className="row-name" style={{ color: qColor }}>
                          {norm.name}
                        </div>
                        <div className="row-meta">
                          <span className="row-type">{norm.subtype || norm.type}</span>
                          <span className="row-quality" style={{ color: qColor }}>• {norm.quality}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="quick-select-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectAndConfirm(norm);
                        }}
                        title="Place this item directly into the book"
                      >
                        <i className="fas fa-check"></i>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Live ItemTooltip Preview */}
          <div className={`book-item-preview-pane ${mobileTab === 'preview' ? 'mobile-visible' : 'mobile-hidden'}`}>
            <div className="lore-mobile-back-row">
              <button
                type="button"
                className="lore-mobile-back-btn"
                onClick={() => setMobileTab('list')}
                title="Back to Items List"
              >
                <i className="fas fa-arrow-left"></i>
                <span>Back to Items ({filteredItems.length})</span>
              </button>
            </div>

            <div className="preview-pane-header">
              <i className="fas fa-eye"></i>
              <span>Live In-Game Item Layout</span>
            </div>

            <div className="preview-tooltip-container">
              {currentPreviewItem ? (
                <div className="embedded-tooltip-wrapper">
                  <ItemTooltip item={currentPreviewItem} />
                </div>
              ) : (
                <div className="empty-preview-state">
                  <p>Select an item to view its details</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>

          {currentPreviewItem && (
            <button
              type="button"
              className="book-item-action-btn edit-wizard-btn"
              onClick={handleLaunchEditWizard}
            >
              <i className="fas fa-wand-magic-sparkles"></i> Customize in Item Wizard
            </button>
          )}

          <button
            type="button"
            className="btn-confirm"
            disabled={!currentPreviewItem}
            onClick={() => currentPreviewItem && handleSelectAndConfirm(currentPreviewItem)}
          >
            <i className="fas fa-book-bookmark"></i> Place Item in Book
          </button>
        </div>

        {/* Sub-Modal: Full Item Wizard */}
        {showItemWizard && (
          <ItemWizard
            initialData={wizardInitialData || {}}
            isEditing={!!(wizardInitialData && wizardInitialData.name)}
            onComplete={handleWizardComplete}
            onClose={() => setShowItemWizard(false)}
          />
        )}
      </div>
    </div>
  );
};

export default BookItemCreatorModal;
