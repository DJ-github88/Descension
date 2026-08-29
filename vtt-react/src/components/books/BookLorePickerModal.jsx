import React, { useState, useEffect, useMemo } from 'react';
import RichLoreText from '../common/RichLoreText';
import universalEntityService from '../../services/universalEntityService';
import useCustomLineageStore from '../../store/customLineageStore';
import useFamilyTreeStore from '../../store/familyTreeStore';
import './BookDocumentEditor.css';

const FILTER_CATEGORIES = [
  { key: 'all', label: 'All Archives', icon: 'fa-globe' },
  { key: 'world', label: 'World & Factions', icon: 'fa-landmark' },
  { key: 'lineage_dynasty', label: 'Lineages & Dynasties', icon: 'fa-dna' },
  { key: 'campaign_plots', label: 'Quests & Plot Threads', icon: 'fa-diagram-project' },
  { key: 'journal', label: 'Journal Notes & Orbs', icon: 'fa-book-bookmark' },
  { key: 'bestiary', label: 'Bestiary & NPCs', icon: 'fa-dragon' },
  { key: 'magic', label: 'Spells & Items', icon: 'fa-wand-magic-sparkles' }
];

const getCategoryColorClass = (type, category) => {
  const t = String(type || '').toLowerCase();
  const c = String(category || '').toLowerCase();
  if (t === 'lineage' || c.includes('lineage')) return 'cat-lineage';
  if (t === 'dynasty' || c.includes('dynasty')) return 'cat-dynasty';
  if (t === 'quest' || c.includes('quest')) return 'cat-quest';
  if (t === 'plot' || t === 'plot_thread' || c.includes('plot')) return 'cat-plot';
  if (t === 'creature' || t === 'monster' || t === 'npc' || c.includes('npc')) return 'cat-creature';
  if (t === 'spell' || t === 'item' || t === 'relic') return 'cat-magic';
  return 'cat-world';
};

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

    Promise.all([
      universalEntityService.getAllBookEmbeddables({ limit: 1000 }),
      Promise.resolve(useCustomLineageStore.getState().customLineages || []),
      Promise.resolve(useFamilyTreeStore.getState().trees || [])
    ])
      .then(([items, customLineages, familyTrees]) => {
        const enriched = [...(items || [])];

        // Enrich with custom lineages
        customLineages.forEach((lin) => {
          if (lin && !enriched.some((e) => e.type === 'lineage' && e.name === lin.name)) {
            enriched.push({
              id: lin.id || `lineage:${lin.name}`,
              type: 'lineage',
              name: lin.name,
              category: 'Custom Lineage',
              icon: 'fa-dna',
              summary: lin.cardFlavor || lin.description || 'Custom lineage created in Lineage Studio.',
              raw: lin
            });
          }
        });

        // Enrich with family trees
        familyTrees.forEach((tree) => {
          if (tree && !enriched.some((e) => e.type === 'dynasty' && e.name === tree.name)) {
            enriched.push({
              id: tree.id || `dynasty:${tree.name}`,
              type: 'dynasty',
              name: tree.name,
              category: 'Dynasty & Family Tree',
              icon: 'fa-sitemap',
              summary: tree.description || `${tree.nodes?.length || 0} Dynastic Members`,
              raw: tree
            });
          }
        });

        setEntities(enriched);
        if (enriched.length > 0 && !selectedEntity) {
          setSelectedEntity(enriched[0]);
        }
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
        if (!['region', 'location', 'faction', 'class'].includes(e.type)) return false;
      } else if (activeCategory === 'lineage_dynasty') {
        if (!['lineage', 'race', 'dynasty', 'family_tree'].includes(e.type)) return false;
      } else if (activeCategory === 'campaign_plots') {
        if (!['quest', 'plot', 'plot_thread', 'session'].includes(e.type)) return false;
      } else if (activeCategory === 'journal') {
        if (!['note', 'orb', 'user_defined'].includes(e.type)) return false;
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

  useEffect(() => {
    if (filteredEntities.length > 0) {
      if (!selectedEntity || !filteredEntities.some((e) => e.id === selectedEntity.id)) {
        setSelectedEntity(filteredEntities[0]);
      }
    } else {
      setSelectedEntity(null);
    }
  }, [filteredEntities]);

  if (!isOpen) return null;

  const handleConfirmImport = (entity = selectedEntity) => {
    if (!entity) return;

    const content = entity.raw?.content
      || entity.raw?.description
      || entity.raw?.summary
      || entity.raw?.cardFlavor
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

  const selectedContent = selectedEntity ? (
    selectedEntity.raw?.content
    || selectedEntity.raw?.description
    || selectedEntity.raw?.summary
    || selectedEntity.raw?.cardFlavor
    || selectedEntity.summary
    || `${selectedEntity.name} is recorded in the chronicles.`
  ) : '';

  return (
    <div className="book-modal-overlay" onClick={onClose}>
      <div className="book-lore-picker-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <i className="fas fa-feather-pointed"></i>
            <h3>Import Lore from World, Campaigns &amp; Lineages</h3>
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
              placeholder="Search world lore, factions, lineages, family trees, quests, plot threads..."
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
          {/* Left Cards List */}
          <div className="lore-list-column">
            {loading ? (
              <div className="lore-loading-state">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Retrieving lore dossiers from world, campaigns, and journals...</p>
              </div>
            ) : filteredEntities.length === 0 ? (
              <div className="lore-empty-state">
                <i className="fas fa-feather"></i>
                <p>No archives found matching "{searchQuery}".</p>
              </div>
            ) : (
              <div className="lore-cards-scroll">
                {filteredEntities.map((ent) => {
                  const isSelected = selectedEntity?.id === ent.id && selectedEntity?.type === ent.type;
                  const colorClass = getCategoryColorClass(ent.type, ent.category);
                  return (
                    <div
                      key={`${ent.type}-${ent.id}`}
                      className={`lore-entry-card ${colorClass} ${isSelected ? 'selected' : ''}`}
                      onClick={() => setSelectedEntity(ent)}
                      onDoubleClick={() => handleConfirmImport(ent)}
                    >
                      <div className="lore-card-left">
                        <div className={`lore-icon-badge ${colorClass}`}>
                          <i className={`fas ${ent.icon || 'fa-bookmark'}`}></i>
                        </div>
                        <div className="lore-meta-group">
                          <span className="lore-title">{ent.name}</span>
                          <span className={`lore-badge ${colorClass}`}>{ent.category || ent.type}</span>
                        </div>
                      </div>
                      {ent.summary && (
                        <p className="lore-snippet-text">{ent.summary}</p>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Preview Panel */}
          <div className="lore-preview-column">
            {selectedEntity ? (
              <div className="lore-inspect-panel">
                <div className="inspect-header-band">
                  <div className={`inspect-icon-slot ${getCategoryColorClass(selectedEntity.type, selectedEntity.category)}`}>
                    <i className={`fas ${selectedEntity.icon || 'fa-bookmark'}`}></i>
                  </div>
                  <div className="inspect-title-meta">
                    <h3 className="inspect-title">{selectedEntity.name}</h3>
                    <div className="inspect-tags-row">
                      <span className={`inspect-type-pill ${getCategoryColorClass(selectedEntity.type, selectedEntity.category)}`}>
                        {selectedEntity.category || selectedEntity.type}
                      </span>
                      {selectedEntity.raw?.status && (
                        <span className="inspect-sub-pill status-pill">
                          Status: {selectedEntity.raw.status}
                        </span>
                      )}
                      {selectedEntity.raw?.dangerLevel && (
                        <span className="inspect-sub-pill danger-pill">
                          Danger: {selectedEntity.raw.dangerLevel}
                        </span>
                      )}
                      {selectedEntity.raw?.region && (
                        <span className="inspect-sub-pill region-pill">
                          <i className="fas fa-location-dot"></i> {selectedEntity.raw.region}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Lore Body with Rich Parsing */}
                <div className="inspect-body-scroll">
                  {selectedEntity.raw?.essence && (
                    <div className="inspect-essence-callout">
                      <i className="fas fa-sparkles"></i>
                      <span>{selectedEntity.raw.essence}</span>
                    </div>
                  )}

                  <div className="inspect-rich-prose">
                    <RichLoreText text={selectedContent} className="parchment-theme" />
                  </div>
                </div>

                {/* Bottom Fixed Action Footer */}
                <div className="inspect-footer-bar">
                  <button
                    type="button"
                    className="btn-cancel-lore"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn-import-confirm"
                    onClick={() => handleConfirmImport(selectedEntity)}
                  >
                    <i className="fas fa-feather-pointed"></i>
                    <span>Import into Document</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="lore-inspect-placeholder">
                <i className="fas fa-book-open"></i>
                <h4>Select an Archive Entry</h4>
                <p>Choose any lore entry, lineage, quest, or plot thread to preview and import into your chronicle.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookLorePickerModal;
