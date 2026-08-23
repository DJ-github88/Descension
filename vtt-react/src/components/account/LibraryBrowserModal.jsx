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

// Format currency / value text
export const formatItemValueText = (val) => {
  if (val === null || val === undefined) return null;
  
  if (typeof val === 'number') {
    if (val <= 0) return null;
    return `${val} Gold`;
  }
  
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed || trimmed === '0' || trimmed.toLowerCase() === '0g' || trimmed.toLowerCase() === '0 gold' || trimmed.toLowerCase() === '0c') {
      return null;
    }
    return trimmed;
  }
  
  if (typeof val === 'object') {
    if (val.amount !== undefined) {
      const num = Number(val.amount) || 0;
      if (num <= 0) return null;
      return `${num} ${val.currency || 'Gold'}`;
    }
    
    const p = Number(val.platinum) || 0;
    const g = Number(val.gold) || 0;
    const s = Number(val.silver) || 0;
    const c = Number(val.copper) || 0;
    
    if (p === 0 && g === 0 && s === 0 && c === 0) return null;
    
    const parts = [];
    if (p > 0) parts.push(`${p}p`);
    if (g > 0) parts.push(`${g}g`);
    if (s > 0) parts.push(`${s}s`);
    if (c > 0) parts.push(`${c}c`);
    
    if (p > 0 && g === 0 && s === 0 && c === 0) return `${p} Plat`;
    if (g > 0 && s === 0 && c === 0 && p === 0) return `${g} Gold`;
    if (s > 0 && g === 0 && c === 0 && p === 0) return `${s} Silver`;
    if (c > 0 && g === 0 && s === 0 && p === 0) return `${c} Copper`;
    
    return parts.join(' ');
  }
  
  return null;
};

// Format weapon damage text
export const getItemDamageText = (item) => {
  if (!item) return null;
  if (item.damageText) return item.damageText;
  if (typeof item.damage === 'string' && item.damage.trim()) return item.damage.trim();
  if (item.damage && typeof item.damage === 'object') {
    const dice = item.damage.dice || item.damage.diceString || '';
    const type = item.damage.type || '';
    if (dice || type) return `${dice} ${type}`.trim();
  }
  const baseDmg = item.weaponStats?.baseDamage;
  if (baseDmg) {
    if (baseDmg.display?.base) {
      return `${baseDmg.display.base}${baseDmg.damageType ? ` ${baseDmg.damageType}` : ''}`.trim();
    }
    const count = baseDmg.diceCount || 1;
    const type = String(baseDmg.diceType || 'd6').replace(/^d+/i, '');
    const bonus = baseDmg.bonusDamage ? ` +${baseDmg.bonusDamage}` : '';
    const dmgType = baseDmg.damageType ? ` ${baseDmg.damageType}` : '';
    return `${count}d${type}${bonus}${dmgType}`.trim();
  }
  return null;
};

// Format armor AC text
export const getItemArmorText = (item) => {
  if (!item) return null;
  if (item.armorText) return item.armorText;
  const ac = item.armorClass ?? item.ac ?? item.armorStats?.armorClass ?? item.baseStats?.armorClass?.value ?? item.baseStats?.armor?.value;
  if (ac !== undefined && ac !== null && Number(ac) > 0) {
    return `+${ac} AC`;
  }
  return null;
};

// Get visible page numbers with ellipsis
export const getPageNumbers = (current, total) => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', total];
  }
  if (current >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, '...', current - 1, current, current + 1, '...', total];
};

const LibraryBrowserModal = ({ 
  isOpen, 
  onClose, 
  libraryType = LIBRARY_TYPES.CREATURES,
  onSelect,
  multiSelect = false,
  title
}) => {
  const contentRef = React.useRef(null);
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
            // Load items from item store (comprehensive items & custom user homebrew items) + starting equipment
            const [classEquip, bgEquip, raceEquip, itemStoreModule] = await Promise.all([
              import('../../data/equipment/classEquipment'),
              import('../../data/equipment/backgroundEquipment'),
              import('../../data/equipment/raceEquipment'),
              import('../../store/itemStore')
            ]);
            
            const itemStore = itemStoreModule.default?.getState ? itemStoreModule.default.getState() : {};
            const storeItems = itemStore.items || [];
            
            const allItems = [
              ...storeItems,
              ...(classEquip.ALL_CLASS_EQUIPMENT || []),
              ...(bgEquip.ALL_BACKGROUND_EQUIPMENT || []),
              ...(raceEquip.ALL_RACE_EQUIPMENT || [])
            ];
            
            // Remove duplicates by id
            const uniqueItems = [];
            const seenIds = new Set();
            allItems.forEach(item => {
              if (item && item.id && !seenIds.has(item.id)) {
                seenIds.add(item.id);
                uniqueItems.push(item);
              }
            });
            
            setLibraryData(uniqueItems.map(item => {
              const quality = item.quality || item.rarity || 'common';
              const rawVal = item.value !== undefined ? item.value : (item.cost !== undefined ? item.cost : item.price);
              return {
                ...item,
                icon: item.iconId || item.icon || 'inv_misc_questionmark',
                quality: quality,
                damageText: getItemDamageText(item),
                armorText: getItemArmorText(item),
                valueText: formatItemValueText(rawVal)
              };
            }));

            setCategories([
              { id: 'all', name: 'All Categories' },
              { id: 'weapon', name: 'Weapons' },
              { id: 'armor', name: 'Armor & Shields' },
              { id: 'accessory', name: 'Accessories & Relics' },
              { id: 'consumable', name: 'Potions & Consumables' },
              { id: 'container', name: 'Containers & Bags' },
              { id: 'recipe', name: 'Recipes & Formulas' },
              { id: 'miscellaneous', name: 'Gear & Tools' }
            ]);

            setSecondaryCategories([
              { id: 'all', name: 'All Rarities' },
              { id: 'poor', name: 'Poor' },
              { id: 'common', name: 'Common' },
              { id: 'uncommon', name: 'Uncommon' },
              { id: 'rare', name: 'Rare' },
              { id: 'epic', name: 'Epic' },
              { id: 'legendary', name: 'Legendary' },
              { id: 'artifact', name: 'Artifact' }
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

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = libraryType === LIBRARY_TYPES.SPELLS ? 12 : 24;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterType, filterSecondary, libraryType]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Filter and search items
  const filteredItems = useMemo(() => {
    let items = libraryData;
    
    // Primary Filter
    if (filterType !== 'all') {
      const ft = filterType.toLowerCase();
      items = items.filter(item => {
        if (libraryType === LIBRARY_TYPES.CREATURES) {
          return (item.type || '').toLowerCase() === ft;
        }
        if (libraryType === LIBRARY_TYPES.ITEMS) {
          const t = (item.type || '').toLowerCase();
          const st = (item.subtype || '').toLowerCase();
          if (ft === 'weapon') {
            return t === 'weapon' || t === 'weapons' || !!item.weaponStats || ['sword', 'axe', 'mace', 'dagger', 'bow', 'crossbow', 'staff', 'wand', 'polearm', 'halberd', 'scythe', 'warhammer', 'flail', 'rapier', 'katana', 'saber', 'sickle', 'fist weapon', 'sling', 'blowgun', 'spear'].includes(st);
          }
          if (ft === 'armor') {
            return t === 'armor' || t === 'armors' || t === 'shield' || st === 'shield' || ['cloth', 'leather', 'mail', 'plate', 'shield', 'head', 'chest', 'legs', 'feet', 'hands', 'shoulders', 'waist', 'wrists'].includes(st);
          }
          if (ft === 'accessory') {
            return t === 'accessory' || t === 'accessories' || ['ring', 'amulet', 'necklace', 'trinket', 'cloak', 'belt', 'relic', 'crown', 'finger', 'neck'].includes(st);
          }
          if (ft === 'consumable') {
            return t === 'consumable' || t === 'consumables' || ['potion', 'potions', 'food', 'drink', 'scroll', 'scrolls', 'poison', 'poisons', 'utility', 'flask', 'elixir', 'bandage', 'herb'].includes(st);
          }
          if (ft === 'container') {
            return t === 'container' || t === 'containers' || ['bag', 'pouch', 'chest', 'box', 'backpack'].includes(st);
          }
          if (ft === 'recipe') {
            return t === 'recipe' || t === 'recipes' || st.includes('recipe') || st.includes('schematic') || st.includes('formula') || st.includes('pattern');
          }
          if (ft === 'miscellaneous') {
            const isKnownType = ['weapon', 'weapons', 'armor', 'armors', 'accessory', 'accessories', 'consumable', 'consumables', 'container', 'containers', 'recipe', 'recipes'].includes(t);
            return !isKnownType || t === 'miscellaneous' || t === 'misc' || ['tool', 'tools', 'trade_goods', 'trade-goods', 'crafting', 'reagent', 'reagents', 'quest', 'junk', 'currency', 'writing', 'material', 'materials'].includes(st);
          }
          return t === ft || st === ft;
        }
        if (libraryType === LIBRARY_TYPES.SPELLS) {
          return (item.className || '').toLowerCase() === ft ||
                 (item.tags || []).some(t => String(t).toLowerCase() === ft);
        }
        return true;
      });
    }

    // Secondary Filter
    if (filterSecondary !== 'all') {
      const fs = filterSecondary.toLowerCase();
      items = items.filter(item => {
        if (libraryType === LIBRARY_TYPES.CREATURES) {
          return (item.threat || '').toLowerCase() === fs;
        }
        if (libraryType === LIBRARY_TYPES.ITEMS) {
          const q = (item.quality || item.rarity || 'common').toLowerCase();
          return q === fs;
        }
        if (libraryType === LIBRARY_TYPES.SPELLS) {
          return (item.school || '').toLowerCase().includes(fs) ||
                 (item.tags || []).some(t => String(t).toLowerCase().includes(fs));
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
        (item.subtype || '').toLowerCase().includes(query) ||
        (item.school || '').toLowerCase().includes(query) ||
        (item.quality || item.rarity || '').toLowerCase().includes(query) ||
        (Array.isArray(item.tags) && item.tags.some(t => String(t).toLowerCase().includes(query)))
      );
    }
    
    // Sort by name
    return items.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  }, [libraryData, filterType, filterSecondary, searchQuery, libraryType]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / itemsPerPage));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(start, start + itemsPerPage);
  }, [filteredItems, currentPage, itemsPerPage]);

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
      poor: 'quality-poor',
      junk: 'quality-poor',
      common: 'quality-common',
      uncommon: 'quality-uncommon',
      rare: 'quality-rare',
      epic: 'quality-epic',
      legendary: 'quality-legendary',
      artifact: 'quality-artifact'
    };
    return qualityMap[q] || 'quality-common';
  };

  // Resolve item/spell/creature icon URL
  const resolveIcon = (item) => {
    if (!item) return getIconUrl('Utility/Utility', 'abilities');
    if (libraryType === LIBRARY_TYPES.CREATURES) {
      return getCreatureTokenIconUrl(item.icon, item.type);
    }
    if (libraryType === LIBRARY_TYPES.SPELLS) {
      if (item.icon && (item.icon.includes('/') || item.icon.includes('\\'))) {
        return getCustomIconUrl(item.icon, 'abilities');
      }
      return getIconUrl(item.icon || 'Utility/Utility', 'abilities');
    }
    if (item.icon && (item.icon.includes('/') || item.icon.includes('\\'))) {
      return getCustomIconUrl(item.icon, 'items');
    }
    return getWowIconUrl(item.icon || 'inv_misc_questionmark');
  };

  // Determine action badge type for spell
  const getSpellBadgeType = (item) => {
    const raw = (item.type || item.spellType || '').toUpperCase();
    if (raw === 'REACTION') return 'REACTION';
    if (raw === 'PASSIVE') return 'PASSIVE';
    if (raw === 'FREE_ACTION' || raw === 'FREE ACTION') return 'FREE ACTION';
    const desc = (item.description || '').toLowerCase();
    if (/^(as a )?reaction/i.test(desc) || /reaction\s*\(/i.test(desc)) return 'REACTION';
    if (/^passive/i.test(desc)) return 'PASSIVE';
    return 'ACTION';
  };

  if (!isOpen) return null;

  const modalTitle = title || {
    [LIBRARY_TYPES.CREATURES]: 'Compendium: Creatures & Monsters',
    [LIBRARY_TYPES.ITEMS]: 'Compendium: Armory & Items',
    [LIBRARY_TYPES.SPELLS]: 'Compendium: Spells & Class Grimoire'
  }[libraryType] || 'Compendium Browser';

  return ReactDOM.createPortal(
    <div className="library-browser-overlay" onClick={onClose}>
      <div className={`library-browser-modal ${libraryType === LIBRARY_TYPES.SPELLS ? 'spellbook-browser-modal' : ''}`} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="library-browser-header">
          <div className="library-header-title-row">
            <h3><i className={`fas ${libraryType === LIBRARY_TYPES.CREATURES ? 'fa-dragon' : (libraryType === LIBRARY_TYPES.SPELLS ? 'fa-book-sparkles' : 'fa-shield-halved')}`}></i> {modalTitle}</h3>
            <div className="library-header-meta-group">
              {totalPages > 1 && (
                <span className="library-page-top-badge">Page {currentPage} of {totalPages}</span>
              )}
              <span className="library-counter-badge">{filteredItems.length} Available</span>
            </div>
          </div>

          <div className="library-search-bar">
            <div className="library-search-input-wrapper">
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
              <i className="fas fa-search library-search-icon"></i>
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
        <div ref={contentRef} className={`library-browser-content ${libraryType === LIBRARY_TYPES.SPELLS ? 'spellbook-mode' : ''}`}>
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
          ) : libraryType === LIBRARY_TYPES.SPELLS ? (
            /* Open 2-Page Grimoire Spell Library Layout */
            <div className="wow-spellbook-modal-container">
              <div className="wow-spell-list-container">
                {paginatedItems.map(item => {
                  const isSelected = !!selectedItems.find(i => i.id === item.id);
                  const badgeType = getSpellBadgeType(item);

                  return (
                    <div
                      key={item.id}
                      className={`wow-spell-row ${isSelected ? 'selected' : ''}`}
                      onClick={() => toggleSelection(item)}
                    >
                      <div className="wow-spell-icon">
                        <img 
                          src={resolveIcon(item)} 
                          alt={item.name}
                          onError={(e) => { 
                            e.target.src = getIconUrl('Utility/Utility', 'abilities');
                          }}
                        />
                      </div>

                      <div className="wow-spell-info">
                        <p className="wow-spell-name">{item.name}</p>
                        <p className="wow-spell-rank" title={item.description}>
                          {item.description || `${item.className || 'Universal'} ability`}
                        </p>
                      </div>

                      <span className={`wow-spell-type ${badgeType.toLowerCase().replace(/\s+/g, '-')}`}>
                        {badgeType}
                      </span>

                      {isSelected && (
                        <div className="wow-spell-check">
                          <i className="fas fa-check"></i>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Empty slot placeholders to preserve the 2-page balance */}
                {Array.from({ length: Math.max(0, itemsPerPage - paginatedItems.length) }).map((_, idx) => (
                  <div key={`empty-slot-${idx}`} className="wow-spell-row empty" aria-hidden="true">
                    <div className="wow-empty-icon" />
                    <div className="wow-empty-name-box" />
                  </div>
                ))}
              </div>

              {/* Book Overlay Navigation: Left arrow on far left, Right arrow + Page info on far right */}
              {totalPages > 1 && (
                <>
                  <button
                    type="button"
                    className="wow-overlay-nav-btn wow-overlay-nav-left"
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    title="Previous Page"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </button>

                  <div className="wow-overlay-nav-right-group">
                    <span className="wow-page-info">
                      Page {currentPage} of {totalPages}
                    </span>
                    <button
                      type="button"
                      className="wow-overlay-nav-btn wow-overlay-nav-right"
                      disabled={currentPage >= totalPages}
                      onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                      title="Next Page"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Standard Grid for Items / Creatures */
            <>
              <div className="library-items-grid">
                {paginatedItems.map(item => {
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
                          <span 
                            className={`library-item-name ${libraryType === LIBRARY_TYPES.ITEMS ? getQualityClass(item.quality) : ''}`}
                            title={item.name}
                          >
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
                        </div>

                        {item.description && (
                          <p className="library-item-desc-snippet" title={item.description}>
                            {item.description.slice(0, 130)}{item.description.length > 130 ? '...' : ''}
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

              {/* Standard Grid Pagination Bar */}
              {totalPages > 1 && (
                <div className="library-pagination-bar">
                  <button
                    type="button"
                    className="library-page-btn"
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(1)}
                    title="First Page"
                  >
                    <i className="fas fa-angles-left"></i>
                  </button>
                  <button
                    type="button"
                    className="library-page-btn"
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    title="Previous Page"
                  >
                    <i className="fas fa-chevron-left"></i> Prev
                  </button>

                  <div className="library-page-numbers">
                    {getPageNumbers(currentPage, totalPages).map((pageNum, idx) => (
                      pageNum === '...' ? (
                        <span key={`ellipsis-${idx}`} className="library-page-ellipsis">…</span>
                      ) : (
                        <button
                          key={`page-${pageNum}`}
                          type="button"
                          className={`library-page-num-btn ${currentPage === pageNum ? 'active' : ''}`}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      )
                    ))}
                  </div>

                  <button
                    type="button"
                    className="library-page-btn"
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    title="Next Page"
                  >
                    Next <i className="fas fa-chevron-right"></i>
                  </button>
                  <button
                    type="button"
                    className="library-page-btn"
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(totalPages)}
                    title="Last Page"
                  >
                    <i className="fas fa-angles-right"></i>
                  </button>
                </div>
              )}
            </>
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
