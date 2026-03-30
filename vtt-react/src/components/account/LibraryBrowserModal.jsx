// LibraryBrowserModal - Browse and select creatures, items, spells from game libraries
import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { getIconUrl, getCreatureTokenIconUrl } from '../../utils/assetManager';
import './styles/LibraryBrowserModal.css';

// Library types
export const LIBRARY_TYPES = {
  CREATURES: 'creatures',
  ITEMS: 'items',
  SPELLS: 'spells'
};

const LibraryBrowserModal = ({ 
  isOpen, 
  onClose, 
  libraryType = LIBRARY_TYPES.CREATURES,
  onSelect,
  multiSelect = false,
  title
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedItems, setSelectedItems] = useState([]);
  const [libraryData, setLibraryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // Load library data based on type
  useEffect(() => {
    if (!isOpen) return;
    
    const loadLibraryData = async () => {
      setIsLoading(true);
      setSelectedItems([]);
      
      try {
        switch (libraryType) {
          case LIBRARY_TYPES.CREATURES: {
            // Load from creature store
            const { default: useCreatureStore } = await import('../../store/creatureStore');
            const creatures = useCreatureStore.getState().creatures || [];
            const creatureCategories = useCreatureStore.getState().categories || [];
            
            setLibraryData(creatures.map(c => ({
              id: c.id,
              name: c.name,
              description: c.description || '',
              type: c.type || 'humanoid',
              size: c.size || 'medium',
              icon: c.tokenIcon || 'inv_misc_questionmark',
              cr: c.stats?.challengeRating || '—',
              hp: c.stats?.maxHp || 0,
              tags: c.tags || []
            })));
            setCategories([
              { id: 'all', name: 'All Types' },
              { id: 'aberration', name: 'Aberration' },
              { id: 'beast', name: 'Beast' },
              { id: 'celestial', name: 'Celestial' },
              { id: 'construct', name: 'Construct' },
              { id: 'dragon', name: 'Dragon' },
              { id: 'elemental', name: 'Elemental' },
              { id: 'fey', name: 'Fey' },
              { id: 'fiend', name: 'Fiend' },
              { id: 'giant', name: 'Giant' },
              { id: 'humanoid', name: 'Humanoid' },
              { id: 'monstrosity', name: 'Monstrosity' },
              { id: 'ooze', name: 'Ooze' },
              { id: 'plant', name: 'Plant' },
              { id: 'undead', name: 'Undead' }
            ]);
            break;
          }
          
          case LIBRARY_TYPES.ITEMS: {
            // Load items from equipment files
            const [classEquip, bgEquip, pathEquip, raceEquip] = await Promise.all([
              import('../../data/equipment/classEquipment'),
              import('../../data/equipment/backgroundEquipment'),
              import('../../data/equipment/pathEquipment'),
              import('../../data/equipment/raceEquipment')
            ]);
            
            const allItems = [
              ...(classEquip.ALL_CLASS_EQUIPMENT || []),
              ...(bgEquip.ALL_BACKGROUND_EQUIPMENT || []),
              ...(pathEquip.ALL_PATH_EQUIPMENT || []),
              ...(raceEquip.ALL_RACE_EQUIPMENT || [])
            ];
            
            // Remove duplicates by id
            const uniqueItems = [];
            const seenIds = new Set();
            allItems.forEach(item => {
              if (!seenIds.has(item.id)) {
                seenIds.add(item.id);
                uniqueItems.push(item);
              }
            });
            
            // Store full item objects so tooltips can display complete data
            setLibraryData(uniqueItems.map(item => ({
              ...item, // Store full item object
              icon: item.iconId || 'inv_misc_questionmark' // Map iconId to icon for consistency
            })));
            setCategories([
              { id: 'all', name: 'All Items' },
              { id: 'weapon', name: 'Weapons' },
              { id: 'armor', name: 'Armor' },
              { id: 'consumable', name: 'Consumables' },
              { id: 'accessory', name: 'Accessories' },
              { id: 'miscellaneous', name: 'Miscellaneous' }
            ]);
            break;
          }
          
          case LIBRARY_TYPES.SPELLS: {
            // Load spells from spell library context or general data
            try {
              const { GENERAL_CATEGORIES } = await import('../../data/generalSpellsData');
              
              // Flatten all spells from categories
              const allSpells = [];
              if (GENERAL_CATEGORIES) {
                Object.entries(GENERAL_CATEGORIES).forEach(([catId, category]) => {
                  if (category.spells) {
                    category.spells.forEach(spell => {
                      allSpells.push({
                        id: spell.id,
                        name: spell.name,
                        description: spell.description || '',
                        type: spell.spellType || spell.type || 'spell',
                        school: spell.school || 'evocation',
                        level: spell.level || 0,
                        icon: spell.typeConfig?.icon || spell.icon || 'spell_holy_holybolt',
                        category: catId,
                        tags: spell.tags || []
                      });
                    });
                  }
                });
              }
              
              setLibraryData(allSpells);
              setCategories([
                { id: 'all', name: 'All Spells' },
                { id: 'evocation', name: 'Evocation' },
                { id: 'abjuration', name: 'Abjuration' },
                { id: 'conjuration', name: 'Conjuration' },
                { id: 'divination', name: 'Divination' },
                { id: 'enchantment', name: 'Enchantment' },
                { id: 'illusion', name: 'Illusion' },
                { id: 'necromancy', name: 'Necromancy' },
                { id: 'transmutation', name: 'Transmutation' }
              ]);
            } catch (error) {
              console.error('Failed to load spell data:', error);
              setLibraryData([]);
              setCategories([{ id: 'all', name: 'All Spells' }]);
            }
            break;
          }
          
          default:
            setLibraryData([]);
            setCategories([]);
        }
      } catch (error) {
        console.error('Failed to load library data:', error);
        setLibraryData([]);
      }
      
      setIsLoading(false);
    };
    
    loadLibraryData();
  }, [isOpen, libraryType]);

  // Filter and search items
  const filteredItems = useMemo(() => {
    let items = libraryData;
    
    // Filter by type/category
    if (filterType !== 'all') {
      items = items.filter(item => {
        if (libraryType === LIBRARY_TYPES.CREATURES) {
          return item.type?.toLowerCase() === filterType;
        }
        if (libraryType === LIBRARY_TYPES.ITEMS) {
          return item.type?.toLowerCase() === filterType;
        }
        if (libraryType === LIBRARY_TYPES.SPELLS) {
          return item.school?.toLowerCase() === filterType;
        }
        return true;
      });
    }
    
    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        item.name?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.type?.toLowerCase().includes(query)
      );
    }
    
    // Sort by name
    return items.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [libraryData, filterType, searchQuery, libraryType]);

  // Toggle item selection
  const toggleSelection = (item) => {
    if (multiSelect) {
      setSelectedItems(prev => {
        const exists = prev.find(i => i.id === item.id);
        if (exists) {
          return prev.filter(i => i.id !== item.id);
        }
        return [...prev, item];
      });
    } else {
      setSelectedItems([item]);
    }
  };

  // Confirm selection
  const handleConfirm = () => {
    if (selectedItems.length > 0 && onSelect) {
      onSelect(multiSelect ? selectedItems : selectedItems[0]);
    }
    onClose();
  };

  // Render quality badge for items
  const getQualityClass = (quality) => {
    const qualityMap = {
      common: 'quality-common',
      uncommon: 'quality-uncommon',
      rare: 'quality-rare',
      epic: 'quality-epic',
      legendary: 'quality-legendary'
    };
    return qualityMap[quality?.toLowerCase()] || 'quality-common';
  };

  if (!isOpen) return null;

  const modalTitle = title || {
    [LIBRARY_TYPES.CREATURES]: 'Select Creatures',
    [LIBRARY_TYPES.ITEMS]: 'Select Items',
    [LIBRARY_TYPES.SPELLS]: 'Select Spells'
  }[libraryType] || 'Library Browser';

  return ReactDOM.createPortal(
    <div className="library-browser-overlay" onClick={onClose}>
      <div className="library-browser-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="library-browser-header">
          <h3>{modalTitle}</h3>
          <div className="library-search-bar">
            <input
              type="text"
              className="library-search-input"
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
            <select
              className="library-filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
            <button className="library-close-btn" onClick={onClose}>
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="library-browser-content">
          {isLoading ? (
            <div className="library-loading">
              <i className="fas fa-spinner fa-spin"></i>
              <span>Loading library...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="library-empty">
              <i className="fas fa-search"></i>
              <p>No items found. Try adjusting your search or filters.</p>
            </div>
          ) : (
            <div className="library-items-grid">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className={`library-item ${selectedItems.find(i => i.id === item.id) ? 'selected' : ''}`}
                  onClick={() => toggleSelection(item)}
                >
                  <div className="library-item-icon">
                    <img 
                      src={libraryType === LIBRARY_TYPES.CREATURES 
                        ? getCreatureTokenIconUrl(item.icon, item.type)
                        : getIconUrl(item.icon, 'items')} 
                      alt={item.name}
                      onError={(e) => { 
                        e.target.src = libraryType === LIBRARY_TYPES.CREATURES
                          ? getCreatureTokenIconUrl(null, item.type)
                          : getIconUrl('inv_misc_questionmark', 'items');
                      }}
                    />
                    {libraryType === LIBRARY_TYPES.ITEMS && item.quality && (
                      <span className={`quality-border ${getQualityClass(item.quality)}`}></span>
                    )}
                  </div>
                  <div className="library-item-info">
                    <div className={`library-item-name ${libraryType === LIBRARY_TYPES.ITEMS ? getQualityClass(item.quality) : ''}`}>
                      {item.name}
                    </div>
                    <div className="library-item-meta">
                      {libraryType === LIBRARY_TYPES.CREATURES && (
                        <>
                          <span className="library-item-tag">{item.type}</span>
                          <span className="library-item-tag">{item.size}</span>
                          {item.cr !== '—' && <span className="library-item-tag">CR {item.cr}</span>}
                        </>
                      )}
                      {libraryType === LIBRARY_TYPES.ITEMS && (
                        <>
                          <span className="library-item-tag">{item.type}</span>
                          {item.subtype && <span className="library-item-tag">{item.subtype}</span>}
                        </>
                      )}
                      {libraryType === LIBRARY_TYPES.SPELLS && (
                        <>
                          <span className="library-item-tag">{item.school || 'Spell'}</span>
                          {item.level !== undefined && (
                            <span className="library-item-tag">
                              {item.level === 0 ? 'Cantrip' : `Lvl ${item.level}`}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  {selectedItems.find(i => i.id === item.id) && (
                    <div className="library-item-check">
                      <i className="fas fa-check"></i>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="library-browser-footer">
          <div className="library-selected-count">
            {selectedItems.length > 0 ? (
              <span>{selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected</span>
            ) : (
              <span>Select items to add</span>
            )}
          </div>
          <div className="library-actions">
            <button className="library-btn cancel" onClick={onClose}>Cancel</button>
            <button 
              className="library-btn confirm" 
              onClick={handleConfirm}
              disabled={selectedItems.length === 0}
            >
              Add Selected
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LibraryBrowserModal;

