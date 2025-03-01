import React, { useState, useEffect } from 'react';
import useSpellWizardStore from '../../../store/spellWizardStore';
import { IconSelector, SpellPreview } from '../common';
import '../styles/spell-wizard.css'; 
import '../styles/spell-wizard-layout.css'; 

// Class options for player character spells
const CLASS_OPTIONS = [
  { id: 'pyrofiend', name: 'Pyrofiend', resource: 'Inferno Levels', icon: 'spell_fire_flameshock' },
  { id: 'gambler', name: 'Gambler', resource: 'Fortune Points', icon: 'inv_misc_dice_01' },
  { id: 'fateweaver', name: 'Fate Weaver', resource: 'Destiny Charges', icon: 'ability_monk_forcesphere' },
  { id: 'berserker', name: 'Berserker', resource: 'Rage', icon: 'spell_nature_shamanrage' },
  { id: 'shadowdancer', name: 'Shadowdancer', resource: 'Shadow Energy', icon: 'ability_rogue_shadowdance' },
  { id: 'elementalist', name: 'Elementalist', resource: 'Elemental Harmony', icon: 'spell_nature_elementalabsorption' }
  // Add other class options if needed
];

// Monster/creature types
const MONSTER_TYPES = [
  { name: 'Aberration', icon: 'inv_misc_head_nerubian_01' },
  { name: 'Beast', icon: 'ability_hunter_pet_bear' },
  { name: 'Celestial', icon: 'spell_holy_heroism' },
  { name: 'Construct', icon: 'inv_10_engineering2_mechanicalwhelplingjeeves2_color1' },
  { name: 'Dragon', icon: 'inv_misc_head_dragon_01' },
  { name: 'Elemental', icon: 'spell_fire_elemental_totem' },
  { name: 'Fey', icon: 'inv_misc_herb_felblossom' },
  { name: 'Fiend', icon: 'spell_shadow_summonfelguard' },
  { name: 'Giant', icon: 'achievement_dungeon_ulduar77_25man' },
  { name: 'Humanoid', icon: 'achievement_character_human_male' },
  { name: 'Monstrosity', icon: 'inv_misc_head_murloc_01' },
  { name: 'Ooze', icon: 'inv_misc_slime_01' },
  { name: 'Plant', icon: 'inv_misc_herb_nightmarevine' },
  { name: 'Undead', icon: 'spell_shadow_chilltouch' }
];

// Spell types
const SPELL_TYPES = [
  { id: 'active', name: 'Active Ability', description: 'An ability that must be activated and typically has a cost and cooldown.', icon: 'spell_mage_flameorb' },
  { id: 'passive', name: 'Passive Ability', description: 'An ability that is always active and provides a constant benefit.', icon: 'spell_holy_devotionaura' },
  { id: 'aura', name: 'Aura', description: 'A persistent effect that radiates from the caster or target.', icon: 'spell_holy_auraoflight' },
  { id: 'ultimate', name: 'Ultimate Ability', description: 'A powerful ability with a significant impact but a long cooldown.', icon: 'spell_arcane_arcane03' },
  { id: 'reaction', name: 'Reaction', description: 'An ability that triggers in response to certain conditions.', icon: 'ability_warrior_revenge' },
  { id: 'ritual', name: 'Ritual', description: 'A complex ability that requires preparation and time to cast.', icon: 'spell_shadow_demonicempathy' }
];

const Step1OriginType = () => {
  const { spellData, updateSpellData, setStepValidation } = useSpellWizardStore();
  
  // Local state for form inputs
  const [source, setSource] = useState(spellData.source || '');
  const [selectedClass, setSelectedClass] = useState(spellData.class || '');
  const [selectedMonsterType, setSelectedMonsterType] = useState(spellData.monsterType || '');
  const [selectedSpellType, setSelectedSpellType] = useState(spellData.spellType || '');
  const [spellName, setSpellName] = useState(spellData.name || '');
  const [spellDescription, setSpellDescription] = useState(spellData.description || '');
  const [spellIcon, setSpellIcon] = useState(spellData.icon || '');
  
  // Local state for tracking validation
  const [isValid, setIsValid] = useState(false);
  const getClassName = (classId) => {
    if (!classId) return '';
    
    const classMap = {
      'pyrofiend': 'Pyrofiend',
      'gambler': 'Gambler',
      'fateweaver': 'Fate Weaver',
      'stormbringer': 'Stormbringer',
      'berserker': 'Berserker',
      'shadowdancer': 'Shadowdancer',
      'elementalist': 'Elementalist'
    };
    
    return classMap[classId] || classId;
  };
  
  const getSpellTypeName = (typeId) => {
    if (!typeId) return '';
    
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
  // Update validation status
  useEffect(() => {
    const valid = 
      source &&
      (
        (source === 'class' && selectedClass) || 
        (source === 'monster' && selectedMonsterType)
      ) &&
      selectedSpellType &&
      spellName.trim().length > 0;
    
    setIsValid(valid);
    setStepValidation(0, valid);
  }, [
    source, selectedClass, selectedMonsterType, selectedSpellType, 
    spellName, setStepValidation
  ]);
  
  // Update spell data separately from validation to avoid unnecessary updates
  useEffect(() => {
    updateSpellData({
      source,
      class: source === 'class' ? selectedClass : '',
      monsterType: source === 'monster' ? selectedMonsterType : '',
      spellType: selectedSpellType,
      name: spellName,
      description: spellDescription,
      icon: spellIcon
    });
  }, [
    source, selectedClass, selectedMonsterType, selectedSpellType,
    spellName, spellDescription, spellIcon, updateSpellData
  ]);
  
  // Handle source change
  const handleSourceChange = (newSource) => {
    setSource(newSource);
    
    // Reset other selections when switching source
    if (newSource === 'class') {
      setSelectedMonsterType('');
    } else if (newSource === 'monster') {
      setSelectedClass('');
    }
  };
  
  // Handle class selection
  const handleClassSelect = (classId) => {
    setSelectedClass(classId);
    
    // Added glow effect animation on selection
    const classOptions = document.querySelectorAll('.class-option');
    classOptions.forEach(option => {
      option.classList.remove('pulse-effect');
    });
    const selectedOption = document.querySelector(`.class-option[data-id="${classId}"]`);
    if (selectedOption) {
      selectedOption.classList.add('pulse-effect');
    }
    
    // Automatically set resource system based on class
    const selectedClassObj = CLASS_OPTIONS.find(c => c.id === classId);
    if (selectedClassObj) {
      updateSpellData({
        resourceSystem: selectedClassObj.resource
      });
    }
  };
  
  // Handle monster type selection
  const handleMonsterTypeSelect = (type) => {
    setSelectedMonsterType(type);
    
    // Added glow effect animation on selection
    const monsterOptions = document.querySelectorAll('.monster-option');
    monsterOptions.forEach(option => {
      option.classList.remove('pulse-effect');
    });
    const selectedOption = document.querySelector(`.monster-option[data-name="${type}"]`);
    if (selectedOption) {
      selectedOption.classList.add('pulse-effect');
    }
    
    // Set generic resource system for monsters
    updateSpellData({
      resourceSystem: 'Generic'
    });
  };
  
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

  return (
    <div className="wizard-layout">
      <div className="wizard-main-content">
        <div className="origin-identity-step">
          {/* Origin Selection Section */}
          <div className="section">
            <h4 className="section-title">
              <img src="https://wow.zamimg.com/images/wow/icons/medium/inv_ability_hellcallerwarlock_wither.jpg" alt="" className="section-icon" />
              Spell Origin
            </h4>
            <p className="section-description">
              Begin crafting your spell by selecting its origin.
            </p>
            
            <div className="origin-options">
              <div 
                className={`origin-option ${source === 'class' ? 'selected' : ''}`}
                onClick={() => handleSourceChange('class')}
                data-id="class"
              >
                <div className="option-icon">
                  <img src="https://wow.zamimg.com/images/wow/icons/medium/inv_helmet_96.jpg" alt="Class" />
                </div>
                <div className="option-content">
                  <div className="option-label">Player Class</div>
                  <div className="option-description">Create a spell for a specific player class</div>
                </div>
              </div>
              
              <div 
                className={`origin-option ${source === 'monster' ? 'selected' : ''}`}
                onClick={() => handleSourceChange('monster')}
                data-id="monster"
              >
                <div className="option-icon">
                  <img src="https://wow.zamimg.com/images/wow/icons/medium/ability_creature_cursed_05.jpg" alt="Monster" />
                </div>
                <div className="option-content">
                  <div className="option-label">Monster/Creature</div>
                  <div className="option-description">Design an ability for a specific creature type</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Class Selection Section - Show if class is selected as source */}
          {source === 'class' && (
            <div className="section">
              <h4 className="section-title">
                <img src="https://wow.zamimg.com/images/wow/icons/medium/inv_misc_book_11.jpg" alt="" className="section-icon" />
                Class Selection
              </h4>
              <p className="section-description">
                Choose a class to define the spell's resource system and thematic elements.
              </p>
              
              <div className="class-options">
                {CLASS_OPTIONS.map((classOption) => (
                  <div 
                    key={classOption.id}
                    className={`class-option ${selectedClass === classOption.id ? 'selected' : ''}`}
                    onClick={() => handleClassSelect(classOption.id)}
                    data-id={classOption.id}
                  >
                    <div className="class-icon">
                      <img src={`https://wow.zamimg.com/images/wow/icons/medium/${classOption.icon}.jpg`} alt={classOption.name} />
                    </div>
                    <div className="class-info">
                      <div className="class-name">{classOption.name}</div>
                      <div className="class-resource">{classOption.resource}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Monster Type Selection - Show if monster is selected as source */}
          {source === 'monster' && (
            <div className="section">
              <h4 className="section-title">
                <img src="https://wow.zamimg.com/images/wow/icons/medium/inv_misc_monstertail_03.jpg" alt="" className="section-icon" />
                Monster Type
              </h4>
              <p className="section-description">
                Select the creature type to align the ability with its natural characteristics.
              </p>
              
              <div className="monster-options">
                {MONSTER_TYPES.map((type) => (
                  <div 
                    key={type.name}
                    className={`monster-option ${selectedMonsterType === type.name ? 'selected' : ''}`}
                    onClick={() => handleMonsterTypeSelect(type.name)}
                    data-name={type.name}
                  >
                    <div className="monster-icon">
                      <img src={`https://wow.zamimg.com/images/wow/icons/medium/${type.icon}.jpg`} alt={type.name} />
                    </div>
                    <div className="monster-type">{type.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Spell Type Selection - Show after source and class/monster are selected */}
          {((source === 'class' && selectedClass) || 
             (source === 'monster' && selectedMonsterType)) && (
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
          )}
          
          {/* Spell Name and Description - Show after type is selected */}
          {selectedSpellType && (
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
            </div>
          )}
          
          {/* Icon Selection - Show after name and description */}
          {spellName && (
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
          )}
          
          {/* Validation message */}
          {!isValid && (
            <div className="validation-message">
              {!source ? (
                <p>Please select a spell origin (Class or Monster).</p>
              ) : source === 'class' && !selectedClass ? (
                <p>Please select a character class.</p>
              ) : source === 'monster' && !selectedMonsterType ? (
                <p>Please select a monster type.</p>
              ) : !selectedSpellType ? (
                <p>Please select an ability type.</p>
              ) : !spellName ? (
                <p>Please enter a name for your spell.</p>
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
  <div className="spell-header">
    {spellData.icon ? (
      <img 
        src={`https://wow.zamimg.com/images/wow/icons/medium/${spellData.icon}.jpg`} 
        alt=""
        className="spell-icon"
        onError={(e) => {
          e.target.src = 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
        }}
      />
    ) : (
      <img 
        src="https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg" 
        alt=""
        className="spell-icon"
      />
    )}
    <div className="spell-header-info">
      <h3 className="spell-name">{spellData.name || 'Unnamed Spell'}</h3>
      <div className="spell-subtitle">
        {spellData.source === 'class' && spellData.class && getClassName(spellData.class)}
        {spellData.source === 'monster' && spellData.monsterType}
        {spellData.spellType && ` · ${getSpellTypeName(spellData.spellType)}`}
      </div>
    </div>
  </div>
  <SpellPreview spellData={spellData} />
</div>
        
        <div className="wizard-help-panel">
          <h4>
            <img src="https://wow.zamimg.com/images/wow/icons/medium/inv_misc_note_05.jpg" alt="" />
            Step 1: Origin & Identity
          </h4>
          <p>In this step, you'll establish the basic identity of your spell by selecting:</p>
          <ul>
            <li>Whether it belongs to a player class or monster type</li>
            <li>The specific class or creature it's associated with</li>
            <li>The type of ability (active, passive, etc.)</li>
            <li>A name and description</li>
            <li>An icon to represent it visually</li>
          </ul>
          <div className="help-tip">
            <img src="https://wow.zamimg.com/images/wow/icons/medium/spell_frost_windwalkon.jpg" alt="Tip" />
            <p>Choose a descriptive name that reflects the spell's function and theme!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step1OriginType;