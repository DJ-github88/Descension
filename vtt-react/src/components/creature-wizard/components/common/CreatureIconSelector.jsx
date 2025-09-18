import React, { useState, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../../styles/CreatureIconSelector.css';

const CreatureIconSelector = ({ isOpen, onClose, onSelect, currentIcon }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const modalRef = useRef(null);

  // Sample icons for creature tokens
  const sampleIcons = [
    'ability_warrior_savageblow', 'ability_druid_catform', 'ability_hunter_beasttaming',
    'ability_rogue_shadowstrike', 'ability_mage_firebolt', 'ability_priest_shadowword',
    'ability_paladin_shieldoftemplar', 'ability_warlock_demonbolt', 'ability_shaman_stormstrike',
    'spell_shadow_raisedead', 'spell_fire_fireball', 'spell_frost_frostbolt',
    'spell_nature_lightning', 'spell_holy_heal', 'spell_arcane_arcanetorrent',
    'inv_misc_bone_skull_01', 'inv_misc_bone_skull_02', 'inv_misc_head_dragon_01',
    'inv_misc_head_dragon_blue', 'inv_misc_head_dragon_bronze', 'inv_misc_head_dragon_green',
    'inv_misc_head_dragon_red', 'inv_misc_head_dragon_black', 'inv_misc_head_centaur_01',
    'inv_misc_head_murloc_01', 'inv_misc_head_orc_01', 'inv_misc_head_human_01',
    'inv_misc_head_elf_01', 'inv_misc_head_dwarf_01', 'inv_misc_head_gnome_01',
    'inv_misc_head_tauren_01', 'inv_misc_head_troll_01', 'inv_misc_head_undead_01',
    'inv_misc_head_bloodelf_male', 'inv_misc_head_draenei_male', 'inv_misc_head_worgen_male',
    'inv_misc_head_goblin_01', 'inv_misc_head_pandaren_male', 'inv_misc_head_nightelf_male',
    'achievement_boss_lichking', 'achievement_boss_ragnaros', 'achievement_boss_cthun',
    'achievement_boss_illidan', 'achievement_boss_kiljaedan', 'achievement_boss_archimonde',
    'achievement_boss_nefarian', 'achievement_boss_onyxia', 'achievement_boss_deathwing',
    'achievement_boss_algalon_01', 'achievement_boss_yoggsaron_01', 'achievement_boss_mimiron_01',
    'inv_misc_head_dragon_01', 'inv_misc_head_dragon_blue', 'inv_misc_head_dragon_bronze',
    'inv_misc_head_dragon_green', 'inv_misc_head_dragon_red', 'inv_misc_head_dragon_black',
    'inv_misc_head_dragon_nether', 'inv_misc_head_dragon_twilight', 'inv_misc_head_dragon_infinite'
  ];

  // Icon categories for filtering
  const iconCategories = [
    { id: 'all', name: 'All Icons', keywords: [] },
    { id: 'humanoid', name: 'Humanoid', keywords: ['human', 'elf', 'dwarf', 'orc', 'troll', 'gnome', 'tauren', 'undead', 'bloodelf', 'draenei', 'worgen', 'goblin', 'pandaren', 'nightelf'] },
    { id: 'dragon', name: 'Dragons', keywords: ['dragon'] },
    { id: 'undead', name: 'Undead', keywords: ['skull', 'bone', 'undead', 'shadow', 'raisedead', 'lichking'] },
    { id: 'beast', name: 'Beasts', keywords: ['beast', 'cat', 'hunter', 'murloc', 'centaur'] },
    { id: 'boss', name: 'Boss/Elite', keywords: ['boss', 'achievement'] },
    { id: 'magic', name: 'Magical', keywords: ['spell', 'mage', 'priest', 'warlock', 'shaman', 'paladin', 'fire', 'frost', 'arcane', 'holy', 'nature'] }
  ];

  // Filter icons based on search and category
  const filteredIcons = sampleIcons.filter(icon => {
    const matchesSearch = searchTerm === '' || icon.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (selectedCategory === 'all') {
      return matchesSearch;
    }
    
    const category = iconCategories.find(cat => cat.id === selectedCategory);
    const matchesCategory = category.keywords.some(keyword => icon.toLowerCase().includes(keyword));
    
    return matchesSearch && matchesCategory;
  });

  // Handle escape key and outside clicks
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Render the modal as a portal to document.body to avoid container constraints
  return ReactDOM.createPortal(
    <div className="creature-icon-selector-overlay">
      <div className="creature-icon-selector-modal" ref={modalRef}>
        <div className="creature-icon-selector-header">
          <h3>Select a Creature Icon</h3>
          <button className="creature-icon-selector-close-btn" onClick={onClose}>×</button>
        </div>

        <div className="creature-icon-selector-filters">
          <input
            type="text"
            placeholder="Search icons..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="creature-icon-selector-search"
          />

          <div className="creature-icon-selector-categories">
            {iconCategories.map(category => (
              <button
                key={category.id}
                className={`creature-icon-selector-category ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="creature-icon-selector-grid">
          {filteredIcons.map(icon => (
            <div
              key={icon}
              className={`creature-icon-selector-item ${currentIcon === icon ? 'selected' : ''}`}
              onClick={() => onSelect(icon)}
            >
              <div className="creature-icon-selector-image-container">
                <img
                  src={`https://wow.zamimg.com/images/wow/icons/large/${icon}.jpg`}
                  alt={icon}
                  className="creature-icon-selector-image"
                  onError={(e) => {
                    e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                  }}
                />
              </div>
              <div className="creature-icon-selector-name">{icon.replace(/_/g, ' ')}</div>
            </div>
          ))}

          {filteredIcons.length === 0 && (
            <div className="creature-icon-selector-no-results">
              No icons found matching your criteria
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default CreatureIconSelector;
