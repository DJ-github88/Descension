import React, { useState, useEffect } from 'react';
import useSpellWizardStore from '../../../store/spellWizardStore';
import { IconSelector, SpellPreview } from '../common';
import '../styles/Pages/wizard-steps.css';
import '../styles/Layout/wizard-layout.css'; 

// Common spell tags to suggest
const COMMON_TAGS = [
  { id: 'damage', name: 'Damage', icon: 'spell_fire_flameshock' },
  { id: 'healing', name: 'Healing', icon: 'spell_holy_healingfocus' },
  { id: 'buff', name: 'Buff', icon: 'spell_holy_devotionaura' },
  { id: 'debuff', name: 'Debuff', icon: 'spell_shadow_curse' },
  { id: 'utility', name: 'Utility', icon: 'spell_mage_altertime' },
  { id: 'offensive', name: 'Offensive', icon: 'ability_rogue_ambush' },
  { id: 'defensive', name: 'Defensive', icon: 'ability_warrior_shieldwall' },
  { id: 'mobility', name: 'Mobility', icon: 'spell_frost_windwalkon' },
  { id: 'control', name: 'Control', icon: 'spell_nature_stun' },
  { id: 'acid', name: 'Acid', icon: 'spell_nature_acid_01' },
  { id: 'bludgeoning', name: 'Bludgeoning', icon: 'inv_mace_01' },
  { id: 'cold', name: 'Cold', icon: 'spell_frost_frostbolt02' },
  { id: 'fire', name: 'Fire', icon: 'spell_fire_fireball' },
  { id: 'force', name: 'Force', icon: 'spell_arcane_blast' },
  { id: 'lightning', name: 'Lightning', icon: 'spell_nature_lightning' },
  { id: 'necrotic', name: 'Necrotic', icon: 'spell_shadow_shadowbolt' },
  { id: 'piercing', name: 'Piercing', icon: 'inv_weapon_shortblade_05' },
  { id: 'poison', name: 'Poison', icon: 'ability_rogue_deadlybrew' },
  { id: 'psychic', name: 'Psychic', icon: 'spell_shadow_mindtwisting' },
  { id: 'radiant', name: 'Radiant', icon: 'spell_holy_holybolt' },
  { id: 'slashing', name: 'Slashing', icon: 'inv_sword_04' },
  { id: 'thunder', name: 'Thunder', icon: 'spell_nature_thunderclap' },
  { id: 'resistance', name: 'Resistance', icon: 'spell_holy_powerwordshield' }
];

// Spell types remain the same
const SPELL_TYPES = [
  { id: 'active', name: 'Active Ability', description: 'An ability that must be activated and typically has a cost and cooldown.', icon: 'spell_mage_flameorb' },
  { id: 'passive', name: 'Passive Ability', description: 'An ability that is always active and provides a constant benefit.', icon: 'spell_holy_devotionaura' },
  { id: 'reaction', name: 'Reaction', description: 'An ability that triggers in response to certain conditions.', icon: 'ability_warrior_revenge' },
  { id: 'channeled', name: 'Channeled', description: 'A Channeled ability that requires concentration over multiple rounds.', icon: 'spell_shadow_demonicempathy' }
];

const Step1OriginType = () => {
  const { spellData, updateSpellData, setStepValidation } = useSpellWizardStore();
  
  // Local state for form inputs
  const [spellName, setSpellName] = useState(spellData.name || '');
  const [spellDescription, setSpellDescription] = useState(spellData.description || '');
  const [flavorText, setFlavorText] = useState(spellData.flavorText || '');
  const [spellIcon, setSpellIcon] = useState(spellData.icon || '');
  const [selectedSpellType, setSelectedSpellType] = useState(spellData.spellType || '');
  const [tags, setTags] = useState(spellData.tags || []);
  const [newTag, setNewTag] = useState('');
  
  // Local state for tracking validation
  const [isValid, setIsValid] = useState(false);
  
  // Update validation status
  useEffect(() => {
    const valid = 
      spellName.trim().length > 0 &&
      spellDescription.trim().length > 0 &&
      selectedSpellType &&
      tags.length > 0;
    
    setIsValid(valid);
    setStepValidation(0, valid);
  }, [
    spellName, spellDescription, selectedSpellType, tags, setStepValidation
  ]);
  
  // Update spell data separately from validation to avoid unnecessary updates
  useEffect(() => {
    updateSpellData({
      name: spellName,
      description: spellDescription,
      flavorText: flavorText,
      icon: spellIcon,
      spellType: selectedSpellType,
      tags: tags
    });
  }, [
    spellName, spellDescription, flavorText, spellIcon, selectedSpellType, tags, updateSpellData
  ]);
  
  // Handle spell type selection
  const handleSpellTypeSelect = (typeId) => {
    setSelectedSpellType(typeId);
    
    // Added glow effect animation on selection
    const spellTypeOptions = document.querySelectorAll('.spell-type-option');
    spellTypeOptions.forEach(option => {
      option.classList.remove('glow-effect');
    });
    const selectedOption = document.querySelector(`.spell-type-option[data-id="${typeId}"]`);
    if (selectedOption) {
      selectedOption.classList.add('glow-effect');
    }
  };

  const getSpellTypeName = (typeId) => {
    const typeMap = {
      'active': 'Active Ability',
      'passive': 'Passive Ability',
      'aura': 'Aura',
      'ultimate': 'Ultimate Ability',
      'reaction': 'Reaction',
      'ritual': 'Ritual'
    };
    
    return typeMap[typeId] || typeId;
  };

  // Add a new tag
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };
  
  // Add a common tag
  const addCommonTag = (tag) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };
  
  // Remove a tag
  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // Handle tag input key press (add tag on Enter)
  const handleTagKeyPress = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="wizard-layout">
      <div className="wizard-main-content">
        {/* Spell Type Selection */}
        <div className="section">
          <h4 className="section-title">
            <img src="https://wow.zamimg.com/images/wow/icons/medium/inv_enchant_essencemagiclarge.jpg" alt="" className="section-icon" />
            Ability Type
          </h4>
          <p className="section-description">
            Define how this ability functions in terms of activation and usage.
          </p>
          
          <div className="spell-type-options">
            {SPELL_TYPES.map((type) => (
              <div 
                key={type.id}
                className={`spell-type-option ${selectedSpellType === type.id ? 'selected' : ''}`}
                onClick={() => handleSpellTypeSelect(type.id)}
                data-id={type.id}
              >
                <div className="spell-type-icon">
                  <img src={`https://wow.zamimg.com/images/wow/icons/medium/${type.icon}.jpg`} alt={type.name} />
                </div>
                <div className="spell-type-info">
                  <div className="spell-type-name">{type.name}</div>
                  <div className="spell-type-description">{type.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Spell Name and Description */}
        <div className="section">
          <h4 className="section-title">
            <img src="https://wow.zamimg.com/images/wow/icons/medium/inv_inscription_minorglyph01.jpg" alt="" className="section-icon" />
            Spell Identity
          </h4>
          <p className="section-description">
            Name your spell and provide a description of what it does.
          </p>
          
          <div className="name-input">
            <label>Spell Name:</label>
            <input 
              type="text"
              value={spellName}
              onChange={(e) => setSpellName(e.target.value)}
              placeholder="Enter a name for your spell..."
              className="spell-name-input"
            />
          </div>
          
          <div className="description-input">
            <label>Description:</label>
            <textarea
              value={spellDescription}
              onChange={(e) => setSpellDescription(e.target.value)}
              placeholder="Describe what your spell does..."
              className="spell-description-input"
            />
          </div>
          
          <div className="flavor-text-input">
            <label>Flavor Text (Optional):</label>
            <textarea
              value={flavorText}
              onChange={(e) => setFlavorText(e.target.value)}
              placeholder="Add some flavor text to make your spell more interesting..."
              className="flavor-text-input"
            />
          </div>
        </div>
        
        {/* Icon Selection */}
        <div className="section">
          <h4 className="section-title">
            <img src="https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg" alt="" className="section-icon" />
            Spell Icon
          </h4>
          <p className="section-description">
            Choose an icon that represents your spell.
          </p>
          
          <IconSelector
            value={spellIcon}
            onChange={setSpellIcon}
          />
        </div>
        
        {/* Tags Section */}
        <div className="section">
          <h4 className="section-title">
            <img src="https://wow.zamimg.com/images/wow/icons/medium/inv_misc_note_05.jpg" alt="" className="section-icon" />
            Spell Tags
          </h4>
          <p className="section-description">
            Add tags to categorize your spell.
          </p>
          
          <div className="tags-input">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={handleTagKeyPress}
              placeholder="Add a custom tag..."
              className="tag-input"
            />
            <button onClick={addTag} className="add-tag-btn">Add Tag</button>
          </div>
          
          <div className="common-tags">
            <h5>Common Tags:</h5>
            <div className="common-tags-grid">
              {COMMON_TAGS.map((tag) => (
                <div
                  key={tag.id}
                  className="common-tag"
                  onClick={() => addCommonTag(tag.id)}
                >
                  <img src={`https://wow.zamimg.com/images/wow/icons/medium/${tag.icon}.jpg`} alt={tag.name} />
                  <span>{tag.name}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="selected-tags">
            <h5>Selected Tags:</h5>
            <div className="tag-list">
              {tags.map((tag) => (
                <div key={tag} className="tag">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="remove-tag-btn">×</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Preview Panel */}
      <div className="wizard-side-panel">
        <h4 className="preview-title"></h4>
        <SpellPreview spellData={spellData} />
      </div>
    </div>
  );
};

export default Step1OriginType;