import React, { useState, useEffect } from 'react';
import useSpellWizardStore from '../../../store/spellWizardStore';
import { IconSelector, SpellPreview } from '../common';
import '../styles/spell-wizard.css'; 
import '../styles/spell-wizard-layout.css'; 

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
  { id: 'aura', name: 'Aura', description: 'A persistent effect that radiates from the caster or target.', icon: 'spell_holy_auraoflight' },
  { id: 'ultimate', name: 'Ultimate Ability', description: 'A powerful ability with a significant impact but a long cooldown.', icon: 'spell_arcane_arcane03' },
  { id: 'reaction', name: 'Reaction', description: 'An ability that triggers in response to certain conditions.', icon: 'ability_warrior_revenge' },
  { id: 'ritual', name: 'Ritual', description: 'A complex ability that requires preparation and time to cast.', icon: 'spell_shadow_demonicempathy' }
];

const Step1BasicInfo = () => {
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
        <div className="basic-info-step">
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
                rows={3}
              />
            </div>
            
            <div className="description-input">
              <label>Flavor Text (optional):</label>
              <textarea
                value={flavorText}
                onChange={(e) => setFlavorText(e.target.value)}
                placeholder="Add some flavor text or lore for your spell..."
                className="spell-description-input"
                rows={2}
              />
            </div>
          </div>
          
          {/* Custom Tags System */}
          <div className="section">
            <h4 className="section-title">
              <img src="https://wow.zamimg.com/images/wow/icons/medium/inv_misc_note_06.jpg" alt="" className="section-icon" />
              Spell Tags
            </h4>
            <p className="section-description">
              Add tags to categorize your spell. Add custom tags or select from common options.
            </p>
            
            <div className="tag-input-container">
              <div className="tag-input-group">
                <input 
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  placeholder="Add a custom tag..."
                  className="tag-input"
                />
                <button 
                  onClick={addTag}
                  className="tag-add-button"
                  disabled={!newTag.trim()}
                >
                  Add Tag
                </button>
              </div>
              
              <div className="common-tags">
                <h5>Common Tags:</h5>
                <div className="common-tags-grid">
                  {COMMON_TAGS.map((tag) => (
                    <div 
                      key={tag.id}
                      className={`common-tag ${tags.includes(tag.name) ? 'selected' : ''}`}
                      onClick={() => addCommonTag(tag.name)}
                    >
                      <img 
                        src={`https://wow.zamimg.com/images/wow/icons/small/${tag.icon}.jpg`} 
                        alt={tag.name} 
                        className="common-tag-icon"
                      />
                      <span>{tag.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {tags.length > 0 && (
                <div className="current-tags">
                  <h5>Current Tags:</h5>
                  <div className="tags-list">
                    {tags.map((tag, index) => (
                      <div key={index} className="tag-item">
                        {tag}
                        <button className="tag-remove" onClick={() => removeTag(tag)}>×</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Icon Selection */}
          <div className="section">
            <h4 className="section-title">
              <img src="https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg" alt="" className="section-icon" />
              Icon
            </h4>
            <p className="section-description">
              Choose an icon to represent your spell.
            </p>
            <IconSelector value={spellIcon} onChange={(icon) => setSpellIcon(icon)} />
          </div>
          
          {/* Validation message */}
          {!isValid && (
            <div className="validation-message">
              {!spellName ? (
                <p>Please enter a name for your spell.</p>
              ) : !spellDescription ? (
                <p>Please enter a description for your spell.</p>
              ) : !selectedSpellType ? (
                <p>Please select an ability type.</p>
              ) : !tags.length ? (
                <p>Please add at least one tag for your spell.</p>
              ) : (
                <p>Please complete all required fields to proceed.</p>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Side Preview Panel */}
      <div className="wizard-side-panel">
        <div className="spell-preview-container">
          <div className="preview-title">
            <img 
              src={spellIcon ? `https://wow.zamimg.com/images/wow/icons/medium/${spellIcon}.jpg` : "https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg"} 
              alt="Spell Icon" 
            />
            Spell Preview
          </div>
          
          <SpellPreview spellData={spellData} />
        </div>
        
        <div className="wizard-help-panel">
          <h4>
            <img src="https://wow.zamimg.com/images/wow/icons/medium/inv_misc_note_05.jpg" alt="" />
            Step 1: Basic Information
          </h4>
          <p>In this step, define the core identity of your spell by providing:</p>
          <ul>
            <li>A clear, descriptive name</li>
            <li>A thorough explanation of what the spell does</li>
            <li>Optional flavor text for lore or atmosphere</li>
            <li>Relevant tags to categorize your spell</li>
            <li>A distinctive icon to represent your spell</li>
            <li>The type of ability (active, passive, etc.)</li>
          </ul>
          <div className="help-tip">
            <img src="https://wow.zamimg.com/images/wow/icons/medium/spell_frost_windwalkon.jpg" alt="Tip" />
            <p>Adding specific tags will help organize your spells and make them easier to find later!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1BasicInfo;