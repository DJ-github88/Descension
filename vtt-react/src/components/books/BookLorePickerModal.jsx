import React, { useState, useEffect, useMemo } from 'react';
import universalEntityService from '../../services/universalEntityService';
import './BookDocumentEditor.css';

const FILTER_CATEGORIES = [
  { key: 'all', label: 'All Lore & Notes', icon: 'fa-globe' },
  { key: 'world', label: 'World & Factions', icon: 'fa-landmark' },
  { key: 'journal', label: 'Campaigns & Notes', icon: 'fa-book-bookmark' },
  { key: 'timeline', label: 'Timeline & Epochs', icon: 'fa-hourglass-half' },
  { key: 'bestiary', label: 'Creatures & NPCs', icon: 'fa-dragon' },
  { key: 'magic', label: 'Spells & Items', icon: 'fa-wand-magic-sparkles' }
];

const BookLorePickerModal = ({
  isOpen,
  onClose,
  onSelectLore
}) => {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedEntity, setSelectedEntity] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    setLoading(true);
    universalEntityService
      .getAllBookEmbeddables({ limit: 1000 })
      .then((items) => {
        setEntities(items || []);
      })
      .catch((err) => {
        console.error('Failed to load lore entities:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen]);

  const filteredEntities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return entities.filter((e) => {
      // Category filter
      if (activeCategory === 'world') {
        if (!['region', 'location', 'faction', 'lineage', 'class', 'dynasty'].includes(e.type)) return false;
      } else if (activeCategory === 'journal') {
        if (!['note', 'orb', 'quest'].includes(e.type)) return false;
      } else if (activeCategory === 'timeline') {
        if (!['timeline', 'epoch', 'event'].includes(e.type)) return false;
      } else if (activeCategory === 'bestiary') {
        if (!['creature', 'monster', 'npc'].includes(e.type)) return false;
      } else if (activeCategory === 'magic') {
        if (!['spell', 'item', 'equipment', 'relic'].includes(e.type)) return false;
      }

      // Query filter
      if (q) {
        const text = `${e.name || ''} ${e.category || ''} ${e.summary || ''} ${e.type || ''}`.toLowerCase();
        if (!text.includes(q)) return false;
      }

      return true;
    });
  }, [entities, searchQuery, activeCategory]);

  if (!isOpen) return null;

  const handleConfirmImport = (entity = selectedEntity) => {
    if (!entity) return;

    // Extract full content or summary
    const content = entity.raw?.content
      || entity.raw?.description
      || entity.raw?.history
      || entity.summary
      || `${entity.name} is documented within the realm archives.`;

    onSelectLore({
      id: entity.id,
      type: entity.type,
      name: entity.name,
      category: entity.category || entity.type,
      icon: entity.icon || 'fa-scroll',
      summary: entity.summary || '',
      content,
      raw: entity.raw
    });

    onClose();
  };

  return (
    <div className="book-modal-overlay" onClick={onClose}>
      <div className="book-lore-picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <i className="fas fa-feather-pointed"></i>
            <h3>Import Lore from World & Campaigns</h3>
          </div>
          <button type="button" className="close-modal-btn" onClick={onClose}>&times;</button>
        </div>

        {/* Filter Categories Bar */}
        <div className="lore-category-tabs">
          {FILTER_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              type="button"
              className={`lore-cat-btn ${activeCategory === cat.key ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.key)}
            >
              <i className={`fas ${cat.icon}`}></i>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="lore-search-strip">
          <div className="lore-search-input-wrap">
            <i className="fas fa-search"></i>
            <input
              type="text"
              value={searchQuery}
              placeholder="Search world lore, factions, session journals, NPCs, timeline events..."
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            {searchQuery && (
              <button type="button" className="clear-search-btn" onClick={() => setSearchQuery('')}>
                &times;
              </button>
            )}
          </div>
          <span className="results-count">
            {loading ? 'Searching archives…' : `${filteredEntities.length} matching lore entries`}
          </span>
        </div>

        {/* Main Explorer Grid */}
        <div className="lore-explorer-grid">
          <div className="lore-list-column">
            {loading ? (
              <div className="lore-loading-state">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Retrieving lore dossiers from world and journals...</p>
              </div>
            ) : filteredEntities.length === 0 ? (
              <div className="lore-empty-state">
                <i className="fas fa-scroll"></i>
                <p>No lore matches found for "{searchQuery}".</p>
              </div>
            ) : (
              <div className="lore-cards-scroll">
                {filteredEntities.map((ent) => {
                  const isSelected = selectedEntity?.id === ent.id && selectedEntity?.type === ent.type;
                  return (
                    <div
                      key={`${ent.type}:${ent.id}`}
                      className={`lore-entry-card ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedEntity(ent)}
                      onDoubleClick={() => handleConfirmImport(ent)}
                    >
                      <div className="lore-card-left">
                        <div className="lore-icon-badge">
                          <i className={`fas ${ent.icon || 'fa-bookmark'}`}></i>
                        </div>
                        <div className="lore-meta-group">
                          <strong className="lore-title">{ent.name}</strong>
                          <span className="lore-badge">{ent.category || ent.type}</span>
                        </div>
                      </div>
                      <p className="lore-snippet-text">{ent.summary || 'Click to inspect archive record.'}</p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Detail / Preview Pane */}
          <div className="lore-preview-column">
            {selectedEntity ? (
              <div className="lore-detail-pane">
                <div className="lore-detail-header">
                  <div className="detail-icon-wrap">
                    <i className={`fas ${selectedEntity.icon || 'fa-scroll'}`}></i>
                  </div>
                  <div>
                    <h4 className="detail-name">{selectedEntity.name}</h4>
                    <span className="detail-tag">{selectedEntity.category || selectedEntity.type}</span>
                  </div>
                </div>

                <div className="lore-preview-box">
                  <div className="preview-label">Content to Import:</div>
                  <div className="preview-lore-content">
                    {selectedEntity.raw?.content
                      || selectedEntity.raw?.description
                      || selectedEntity.raw?.history
                      || selectedEntity.summary
                      || 'No extended text available for this dossier.'}
                  </div>
                </div>

                <div className="lore-actions-bar">
                  <button
                    type="button"
                    className="btn-import-confirm"
                    onClick={() => handleConfirmImport(selectedEntity)}
                  >
                    <i className="fas fa-feather-pointed"></i>
                    <span>Import this Lore into Callout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="lore-no-selection">
                <i className="fas fa-hand-pointer"></i>
                <p>Select a lore record from the list to preview and import its historical records into your sourcebook.</p>
              </div>
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-confirm"
            disabled={!selectedEntity}
            onClick={() => handleConfirmImport(selectedEntity)}
          >
            <i className="fas fa-check"></i> Import Lore Record
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookLorePickerModal;
