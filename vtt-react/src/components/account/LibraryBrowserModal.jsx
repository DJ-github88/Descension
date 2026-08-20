// LibraryBrowserModal - Browse and select creatures, items, spells from game libraries
import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { getIconUrl, getCreatureTokenIconUrl, getWowIconUrl, getCustomIconUrl } from '../../utils/assetManager';
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
  const [filterSecondary, setFilterSecondary] = useState('all'); // Class / School / Quality filter
  const [selectedItems, setSelectedItems] = useState([]);
  const [libraryData, setLibraryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [secondaryCategories, setSecondaryCategories] = useState([]);

  // Load library data based on type
  useEffect(() => {
    if (!isOpen) return;
    
    const loadLibraryData = async () => {
      setIsLoading(true);
      setSelectedItems([]);
      setFilterType('all');
      setFilterSecondary('all');
      
      try {
        switch (libraryType) {
          case LIBRARY_TYPES.CREATURES: {
            // Load from creature store
            const { default: useCreatureStore } = await import('../../store/creatureStore');
            const creatures = useCreatureStore.getState().creatures || [];
            
            setLibraryData(creatures.map(c => ({
              id: c.id,
              name: c.name,
              description: c.description || c.stats?.description || '',
              type: c.type || 'humanoid',
              size: c.size || 'medium',
              icon: c.tokenIcon || c.image || 'inv_misc_questionmark',
              cr: c.stats?.challengeRating || c.cr || '-',
              hp: c.stats?.maxHp || c.hp || c.health || 0,
              ac: c.stats?.armorClass || c.ac || 10,
              threat: c.threat || c.stats?.threat || 'Standard',
              tags: c.tags || []
            })));

            setCategories([
              { id: 'all', name: 'All Creature Families' },
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

            setSecondaryCategories([
              { id: 'all', name: 'All Threat Tiers' },
              { id: 'Minion', name: 'Minion' },
              { id: 'Standard', name: 'Standard' },
              { id: 'Elite', name: 'Elite' },
              { id: 'Boss', name: 'Boss / Legendary' }
            ]);
            break;
          }
          
          case LIBRARY_TYPES.ITEMS: {
            // Load items from equipment files
            const [classEquip, bgEquip, raceEquip] = await Promise.all([
              import('../../data/equipment/classEquipment'),
              import('../../data/equipment/backgroundEquipment'),
              import('../../data/equipment/raceEquipment')
            ]);
            
            const allItems = [
              ...(classEquip.ALL_CLASS_EQUIPMENT || []),
              ...(bgEquip.ALL_BACKGROUND_EQUIPMENT || []),
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
            
            setLibraryData(uniqueItems.map(item => ({
              ...item,
              icon: item.iconId || item.icon || 'inv_misc_questionmark',
              quality: item.quality || item.rarity || 'common',
              damageText: item.damage ? (typeof item.damage === 'object' ? `${item.damage.dice || ''} ${item.damage.type || ''}` : item.damage) : null,
              armorText: item.armorClass ? `+${item.armorClass} AC` : null,
              valueText: item.value ? (typeof item.value === 'object' ? `${item.value.amount || 0} ${item.value.currency || 'Gold'}` : `${item.value} Gold`) : null
            })));

            setCategories([
              { id: 'all', name: 'All Categories' },
              { id: 'weapon', name: 'Weapons' },
              { id: 'armor', name: 'Armor & Shields' },
              { id: 'consumable', name: 'Potions & Consumables' },
              { id: 'accessory', name: 'Accessories & Relics' },
              { id: 'wondrous', name: 'Wondrous Items' },
              { id: 'miscellaneous', name: 'Gear & Tools' }
            ]);

            setSecondaryCategories([
              { id: 'all', name: 'All Rarities' },
              { id: 'common', name: 'Common' },
              { id: 'uncommon', name: 'Uncommon' },
              { id: 'rare', name: 'Rare' },
              { id: 'epic', name: 'Epic' },
              { id: 'legendary', name: 'Legendary' }
            ]);
            break;
          }
          
          case LIBRARY_TYPES.SPELLS: {
            try {
              const { ALL_CLASSES_DATA } = await import('../../data/classes/index');
              const { UTILITY_SPELLS } = await import('../../data/spells/utilitySpells');
              const { GENERAL_CATEGORIES } = await import('../../data/generalSpellsData');
              
              const allSpells = [];
              const seenSpellIds = new Set();

              const addSpell = (spell, className = 'Universal', category = 'Class Ability') => {
                if (!spell || !spell.name) return;
                const spellId = spell.id || `${className.toLowerCase()}_${spell.name.toLowerCase().replace(/\s+/g, '_')}`;
                if (seenSpellIds.has(spellId)) return;
                seenSpellIds.add(spellId);

                const school = spell.typeConfig?.school || spell.school || spell.damageType || 'arcane';
                const level = spell.level !== undefined ? spell.level : (spell.tier ? Number(spell.tier) : 1);
                const icon = spell.typeConfig?.icon || spell.icon || 'spell_holy_magicalsentry';

                allSpells.push({
                  id: spellId,
                  name: spell.name,
                  description: spell.description || spell.effect || spell.customMechanic || '',
                  type: spell.spellType || spell.type || 'spell',
                  school: String(school).toLowerCase(),
                  level: level,
                  icon: icon,
                  className: className,
                  category: category,
                  resourceCost: spell.resourceCost || null,
                  damageConfig: spell.damageConfig || null,
                  tags: spell.tags || spell.typeConfig?.tags || [className.toLowerCase(), String(school).toLowerCase()]
                });
              };

              // 1. Iterate over all 21 classes
              Object.entries(ALL_CLASSES_DATA || {}).forEach(([clsName, clsData]) => {
                const spellList = clsData?.spells || clsData?.abilities || clsData?.exampleSpells || [];
                if (Array.isArray(spellList)) {
                  spellList.forEach(sp => addSpell(sp, clsName, `${clsName} Spells`));
                }
                if (Array.isArray(clsData?.specializations)) {
                  clsData.specializations.forEach(spec => {
                    (spec.spells || spec.abilities || []).forEach(sp => addSpell(sp, clsName, `${clsName} - ${spec.name}`));
                  });
                }
              });

              // 2. Add Utility Spells
              (UTILITY_SPELLS || []).forEach(sp => addSpell(sp, 'Utility', 'Utility Spells'));

              // 3. Add General Spells
              if (GENERAL_CATEGORIES) {
                Object.entries(GENERAL_CATEGORIES).forEach(([catId, cat]) => {
                  (cat.spells || []).forEach(sp => addSpell(sp, 'General', cat.name || 'General Actions'));
                });
              }

              setLibraryData(allSpells);

              // Class Filter (Primary)
              setCategories([
                { id: 'all', name: 'All Traditions & Classes (21)' },
                { id: 'arcanoneer', name: 'Arcanoneer' },
                { id: 'berserker', name: 'Berserker' },
                { id: 'crusader', name: 'Crusader' },
                { id: 'shaper', name: 'Shaper' },
                { id: 'chronarch', name: 'Chronarch' },
                { id: 'inquisitor', name: 'Inquisitor' },
                { id: 'revenant', name: 'Revenant' },
                { id: 'false prophet', name: 'False Prophet' },
                { id: 'gambit', name: 'Gambit' },
                { id: 'apex', name: 'Apex' },
                { id: 'animist', name: 'Animist' },
                { id: 'lunarch', name: 'Lunarch' },
                { id: 'martyr', name: 'Martyr' },
                { id: 'minstrel', name: 'Minstrel' },
                { id: 'plaguebringer', name: 'Plaguebringer' },
                { id: 'pyrofiend', name: 'Pyrofiend' },
                { id: 'spellguard', name: 'Spellguard' },
                { id: 'toxicologist', name: 'Toxicologist' },
                { id: 'warden', name: 'Warden' },
                { id: 'augur', name: 'Augur' },
                { id: 'utility', name: 'Utility & General' }
              ]);

              // School / Level Filter (Secondary)
              setSecondaryCategories([
                { id: 'all', name: 'All Schools & Elements' },
                { id: 'sacred', name: 'Sacred / Starlight' },
                { id: 'ember', name: 'Ember / Fire' },
                { id: 'rime', name: 'Rime / Frost' },
                { id: 'arcane', name: 'Arcane / Force' },
                { id: 'storm', name: 'Storm / Lightning' },
                { id: 'primal', name: 'Primal / Nature' },
                { id: 'blight', name: 'Blight / Miasma' },
                { id: 'wyrd', name: 'Wyrd / Cosmic' },
                { id: 'healing', name: 'Healing / Restoration' },
                { id: 'smashing', name: 'Martial / Physical' }
              ]);
            } catch (error) {
              console.error('Failed to load spell data:', error);
              setLibraryData([]);
              setCategories([{ id: 'all', name: 'All Spells' }]);
              setSecondaryCategories([{ id: 'all', name: 'All Schools' }]);
            }
            break;
          }
          
          default:
            setLibraryData([]);
            setCategories([]);
            setSecondaryCategories([]);
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
    
    // Primary Filter
    if (filterType !== 'all') {
      items = items.filter(item => {
        if (libraryType === LIBRARY_TYPES.CREATURES) {
          return (item.type || '').toLowerCase() === filterType.toLowerCase();
        }
        if (libraryType === LIBRARY_TYPES.ITEMS) {
          return (item.type || '').toLowerCase() === filterType.toLowerCase();
        }
        if (libraryType === LIBRARY_TYPES.SPELLS) {
          return (item.className || '').toLowerCase() === filterType.toLowerCase() ||
                 (item.tags || []).some(t => t.toLowerCase() === filterType.toLowerCase());
        }
        return true;
      });
    }

    // Secondary Filter
    if (filterSecondary !== 'all') {
      items = items.filter(item => {
        if (libraryType === LIBRARY_TYPES.CREATURES) {
          return (item.threat || '').toLowerCase() === filterSecondary.toLowerCase();
        }
        if (libraryType === LIBRARY_TYPES.ITEMS) {
          return (item.quality || item.rarity || '').toLowerCase() === filterSecondary.toLowerCase();
        }
        if (libraryType === LIBRARY_TYPES.SPELLS) {
          return (item.school || '').toLowerCase().includes(filterSecondary.toLowerCase()) ||
                 (item.tags || []).some(t => t.toLowerCase().includes(filterSecondary.toLowerCase()));
        }
        return true;
      });
    }
    
    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      items = items.filter(item => 
        (item.name || '').toLowerCase().includes(query) ||
        (item.description || '').toLowerCase().includes(query) ||
        (item.className || '').toLowerCase().includes(query) ||
        (item.type || '').toLowerCase().includes(query) ||
        (item.school || '').toLowerCase().includes(query)
      );
    }
    
    // Sort by name
    return items.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [libraryData, filterType, filterSecondary, searchQuery, libraryType]);

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
    const q = (quality || '').toLowerCase();
    const qualityMap = {
      common: 'quality-common',
      uncommon: 'quality-uncommon',
      rare: 'quality-rare',
      epic: 'quality-epic',
      legendary: 'quality-legendary'
    };
    return qualityMap[q] || 'quality-common';
  };

  // Resolve item/spell/creature icon URL
  const resolveIcon = (item) => {
    if (!item) return getIconUrl('inv_misc_questionmark', 'items');
    if (libraryType === LIBRARY_TYPES.CREATURES) {
      return getCreatureTokenIconUrl(item.icon, item.type);
    }
    if (item.icon && (item.icon.includes('/') || item.icon.includes('\\'))) {
      return getCustomIconUrl(item.icon, 'abilities');
    }
    return getWowIconUrl(item.icon || 'inv_misc_questionmark');
  };

  if (!isOpen) return null;

  const modalTitle = title || {
    [LIBRARY_TYPES.CREATURES]: 'Compendium: Creatures & Monsters',
    [LIBRARY_TYPES.ITEMS]: 'Compendium: Armory & Items',
    [LIBRARY_TYPES.SPELLS]: 'Compendium: Spells & Class Grimoire'
  }[libraryType] || 'Compendium Browser';

  return ReactDOM.createPortal(
    <div className="library-browser-overlay" onClick={onClose}>
      <div className="library-browser-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="library-browser-header">
          <div className="library-header-title-row">
            <h3><i className={`fas ${libraryType === LIBRARY_TYPES.CREATURES ? 'fa-dragon' : (libraryType === LIBRARY_TYPES.SPELLS ? 'fa-hat-wizard' : 'fa-shield-halved')}`}></i> {modalTitle}</h3>
            <span className="library-counter-badge">{filteredItems.length} Available</span>
          </div>

          <div className="library-search-bar">
            <div className="library-search-input-wrapper">
              <i className="fas fa-search library-search-icon"></i>
              <input
                type="text"
                className="library-search-input"
                placeholder="Search by name, tags, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  className="library-search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  title="Clear search"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>

            {/* Primary Category Select */}
            <select
              className="library-filter-select"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>

            {/* Secondary Filter Select */}
            {secondaryCategories.length > 0 && (
              <select
                className="library-filter-select secondary-filter"
                value={filterSecondary}
                onChange={(e) => setFilterSecondary(e.target.value)}
              >
                {secondaryCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            )}

            <button className="library-close-btn" onClick={onClose} title="Close">
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="library-browser-content">
          {isLoading ? (
            <div className="library-loading">
              <i className="fas fa-spinner fa-spin"></i>
              <span>Loading compendium entries...</span>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="library-empty">
              <i className="fas fa-search"></i>
              <p>No entries match your search criteria. Try adjusting your filters.</p>
            </div>
          ) : (
            <div className="library-items-grid">
              {filteredItems.map(item => {
                const isSelected = !!selectedItems.find(i => i.id === item.id);
                return (
                  <div
                    key={item.id}
                    className={`library-item ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleSelection(item)}
                  >
                    <div className="library-item-icon">
                      <img 
                        src={resolveIcon(item)} 
                        alt={item.name}
                        onError={(e) => { 
                          e.target.src = getIconUrl('inv_misc_questionmark', 'items');
                        }}
                      />
                      {libraryType === LIBRARY_TYPES.ITEMS && item.quality && (
                        <span className={`quality-border ${getQualityClass(item.quality)}`}></span>
                      )}
                    </div>

                    <div className="library-item-info">
                      <div className="library-item-title-row">
                        <span className={`library-item-name ${libraryType === LIBRARY_TYPES.ITEMS ? getQualityClass(item.quality) : ''}`}>
                          {item.name}
                        </span>
                        {item.quality && (
                          <span className={`compendium-rarity-chip ${getQualityClass(item.quality)}`}>
                            {item.quality}
                          </span>
                        )}
                      </div>

                      <div className="library-item-meta">
                        {libraryType === LIBRARY_TYPES.CREATURES && (
                          <>
                            <span className="library-item-tag type-tag">{item.type}</span>
                            <span className="library-item-tag size-tag">{item.size}</span>
                            {item.hp > 0 && <span className="library-item-tag hp-tag">HP {item.hp}</span>}
                            {item.cr !== '-' && <span className="library-item-tag cr-tag">CR {item.cr}</span>}
                          </>
                        )}

                        {libraryType === LIBRARY_TYPES.ITEMS && (
                          <>
                            <span className="library-item-tag type-tag">{item.type}</span>
                            {item.subtype && <span className="library-item-tag subtype-tag">{item.subtype}</span>}
                            {item.damageText && <span className="library-item-tag dmg-tag">{item.damageText}</span>}
                            {item.armorText && <span className="library-item-tag ac-tag">{item.armorText}</span>}
                            {item.valueText && <span className="library-item-tag val-tag">{item.valueText}</span>}
                          </>
                        )}

                        {libraryType === LIBRARY_TYPES.SPELLS && (
                          <>
                            {item.className && <span className="library-item-tag class-tag">{item.className}</span>}
                            <span className="library-item-tag school-tag">{item.school}</span>
                            {item.level !== undefined && (
                              <span className="library-item-tag lvl-tag">
                                {item.level === 0 ? 'Cantrip' : `Lvl ${item.level}`}
                              </span>
                            )}
                            {item.resourceCost && (
                              <span className="library-item-tag cost-tag">
                                {item.resourceCost.actionPoints || 2} AP {item.resourceCost.mana ? `• ${item.resourceCost.mana} Mana` : ''}
                              </span>
                            )}
                          </>
                        )}
                      </div>

                      {item.description && (
                        <p className="library-item-desc-snippet">
                          {item.description.slice(0, 110)}{item.description.length > 110 ? '...' : ''}
                        </p>
                      )}
                    </div>

                    {isSelected && (
                      <div className="library-item-check">
                        <i className="fas fa-check"></i>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="library-browser-footer">
          <div className="library-selected-count">
            {selectedItems.length > 0 ? (
              <span><strong>{selectedItems.length}</strong> selected for campaign import</span>
            ) : (
              <span>Click items to select and add to your active campaign</span>
            )}
          </div>
          <div className="library-actions">
            <button className="library-btn cancel" onClick={onClose}>Cancel</button>
            <button 
              className="library-btn confirm" 
              onClick={handleConfirm}
              disabled={selectedItems.length === 0}
            >
              Add Selected ({selectedItems.length})
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LibraryBrowserModal;
