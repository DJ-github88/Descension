import React, { useState } from 'react';
import { useCreatureWizard, useCreatureWizardDispatch, wizardActionCreators } from '../../context/CreatureWizardContext';
import { CREATURE_TYPES, CREATURE_SIZES } from '../../../../store/creatureStore';
import '../../styles/WizardSteps.css';

// Helper function to get icon URL
const getIconUrl = (iconId) => {
  return `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`;
};

// Sample icons for creatures
const SAMPLE_ICONS = [
  'inv_misc_head_dragon_01',
  'inv_misc_head_orc_01',
  'inv_misc_head_gnoll_01',
  'inv_misc_head_murloc_01',
  'inv_misc_head_tiger_01',
  'inv_misc_head_wolf_01',
  'inv_misc_head_troll_01',
  'inv_misc_head_tauren_01',
  'inv_misc_head_dwarf_01',
  'inv_misc_head_human_01',
  'inv_misc_head_elf_01',
  'inv_misc_head_undead_01',
  'inv_misc_monstertail_03',
  'inv_misc_monstertail_04',
  'inv_misc_monsterhorn_03',
  'inv_misc_monsterhorn_04',
  'inv_misc_monsterhorn_05',
  'inv_misc_monsterhorn_06',
  'inv_misc_monsterhorn_07',
  'inv_misc_bone_elfskull_01',
  'inv_misc_bone_skull_01',
  'inv_misc_bone_taurenskull_01',
  'ability_mount_whitetiger',
  'ability_mount_blackpanther',
  'ability_hunter_pet_bear',
  'ability_hunter_pet_wolf',
  'ability_hunter_pet_spider',
  'ability_hunter_pet_gorilla',
  'ability_hunter_pet_boar',
  'spell_shadow_summonsuccubus',
  'spell_shadow_summonvoidwalker',
  'spell_shadow_summonfelguard',
  'spell_fire_elemental_totem',
  'spell_frost_summonwaterelemental',
  'spell_nature_guardianward',
  'spell_holy_auraoflight',
  'spell_holy_sealofvengeance',
  'spell_fire_fire'
];

// Border color presets
const BORDER_COLORS = [
  '#ffffff', // White
  '#ffd100', // Gold
  '#ff6b6b', // Red
  '#4CAF50', // Green
  '#2196F3', // Blue
  '#9C27B0', // Purple
  '#FF9800', // Orange
  '#795548', // Brown
  '#607D8B', // Gray
  '#000000'  // Black
];

const Step1BasicInfo = () => {
  const wizardState = useCreatureWizard();
  const dispatch = useCreatureWizardDispatch();
  
  const [showIconSelector, setShowIconSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Handle name change
  const handleNameChange = (e) => {
    dispatch(wizardActionCreators.setBasicInfo({
      name: e.target.value
    }));
  };
  
  // Handle description change
  const handleDescriptionChange = (e) => {
    dispatch(wizardActionCreators.setBasicInfo({
      description: e.target.value
    }));
  };
  
  // Handle type change
  const handleTypeChange = (e) => {
    dispatch(wizardActionCreators.setBasicInfo({
      type: e.target.value
    }));
  };
  
  // Handle size change
  const handleSizeChange = (e) => {
    dispatch(wizardActionCreators.setBasicInfo({
      size: e.target.value
    }));
  };
  
  // Handle tags change
  const handleTagsChange = (e) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag);
    
    dispatch(wizardActionCreators.setBasicInfo({
      tags: tagsArray
    }));
  };
  
  // Handle icon selection
  const handleIconSelect = (iconId) => {
    dispatch(wizardActionCreators.setBasicInfo({
      tokenIcon: iconId
    }));
    setShowIconSelector(false);
  };
  
  // Handle border color selection
  const handleBorderColorSelect = (color) => {
    dispatch(wizardActionCreators.setBasicInfo({
      tokenBorder: color
    }));
  };
  
  // Filter icons based on search query
  const filteredIcons = searchQuery
    ? SAMPLE_ICONS.filter(icon => icon.toLowerCase().includes(searchQuery.toLowerCase()))
    : SAMPLE_ICONS;
  
  return (
    <div className="wizard-step">
      <h2 className="step-title">Basic Information</h2>
      
      <div className="form-section">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="creature-name">Name</label>
            <input
              id="creature-name"
              type="text"
              value={wizardState.name}
              onChange={handleNameChange}
              placeholder="Enter creature name"
              className={wizardState.validationErrors.name ? 'error' : ''}
            />
            {wizardState.validationErrors.name && (
              <div className="error-message">{wizardState.validationErrors.name}</div>
            )}
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="creature-description">Description</label>
            <textarea
              id="creature-description"
              value={wizardState.description}
              onChange={handleDescriptionChange}
              placeholder="Enter creature description and lore"
              rows={4}
            />
          </div>
        </div>
        
        <div className="form-row two-columns">
          <div className="form-group">
            <label htmlFor="creature-type">Type</label>
            <select
              id="creature-type"
              value={wizardState.type}
              onChange={handleTypeChange}
            >
              {Object.entries(CREATURE_TYPES).map(([key, value]) => (
                <option key={value} value={value}>
                  {key.charAt(0) + key.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="creature-size">Size</label>
            <select
              id="creature-size"
              value={wizardState.size}
              onChange={handleSizeChange}
            >
              {Object.entries(CREATURE_SIZES).map(([key, value]) => (
                <option key={value} value={value}>
                  {key.charAt(0) + key.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="creature-tags">Tags (comma-separated)</label>
            <input
              id="creature-tags"
              type="text"
              value={wizardState.tags.join(', ')}
              onChange={handleTagsChange}
              placeholder="e.g. undead, spellcaster, evil"
            />
          </div>
        </div>
      </div>
      
      <div className="form-section">
        <h3 className="section-title">Token Appearance</h3>
        
        <div className="token-preview-container">
          <div 
            className="token-preview"
            style={{
              backgroundImage: `url(${getIconUrl(wizardState.tokenIcon)})`,
              borderColor: wizardState.tokenBorder
            }}
          ></div>
          
          <div className="token-controls">
            <button
              className="token-button"
              onClick={() => setShowIconSelector(!showIconSelector)}
            >
              {showIconSelector ? 'Close Icon Selector' : 'Change Icon'}
            </button>
            
            <div className="border-color-selector">
              <label>Border Color</label>
              <div className="color-options">
                {BORDER_COLORS.map(color => (
                  <div
                    key={color}
                    className={`color-option ${wizardState.tokenBorder === color ? 'selected' : ''}`}
                    style={{ backgroundColor: color }}
                    onClick={() => handleBorderColorSelect(color)}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {showIconSelector && (
          <div className="icon-selector">
            <div className="icon-search">
              <input
                type="text"
                placeholder="Search icons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="icon-grid">
              {filteredIcons.map(iconId => (
                <div
                  key={iconId}
                  className={`icon-option ${wizardState.tokenIcon === iconId ? 'selected' : ''}`}
                  onClick={() => handleIconSelect(iconId)}
                >
                  <img src={getIconUrl(iconId)} alt={iconId} />
                </div>
              ))}
              
              {filteredIcons.length === 0 && (
                <div className="no-icons-found">
                  No icons match your search.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Step1BasicInfo;
