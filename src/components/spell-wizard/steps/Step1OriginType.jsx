import React, { useState, useEffect } from 'react';
import useSpellWizardStore from '../../../store/spellWizardStore';
import { IconSelector } from '../common';
import '../styles/spell-wizard.css'; 
import '../styles/spell-wizard-layout.css'; 

// Class options for player character spells (from original Step1OriginType)
const CLASS_OPTIONS = [
  { id: 'pyrofiend', name: 'Pyrofiend', resource: 'Inferno Levels' },
  { id: 'gambler', name: 'Gambler', resource: 'Fortune Points' },
  // Other class options...
];

// Monster/creature types (from original Step1OriginType)
const MONSTER_TYPES = [
  'Aberration',
  'Beast',
  // Other monster types...
];

// Spell types (from original Step1OriginType)
const SPELL_TYPES = [
  { id: 'active', name: 'Active Ability', description: 'An ability that must be activated and typically has a cost and cooldown.' },
  { id: 'passive', name: 'Passive Ability', description: 'An ability that is always active and provides a constant benefit.' },
  // Other spell types...
];

// Thematic adjectives for spell flavor (from original Step3CoreMechanic)
const THEMATIC_ADJECTIVES = [
  { category: 'fire', adjectives: ['blazing', 'scorching', 'searing', 'incandescent', 'incinerating', 'fiery', 'smoldering'] },
  { category: 'frost', adjectives: ['frigid', 'chilling', 'freezing', 'glacial', 'icy', 'wintry', 'arctic'] },
  // Other thematic elements...
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
  const [flavorText, setFlavorText] = useState(spellData.flavorText || '');
  const [selectedThemes, setSelectedThemes] = useState(spellData.thematicElements || []);
  const [spellIcon, setSpellIcon] = useState(spellData.icon || '');
  
  // Local state for tracking validation
  const [isValid, setIsValid] = useState(false);
  
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
    
    // Use the index of the first step (0) instead of a string
    setStepValidation(0, valid);
    
  }, [
    source, selectedClass, selectedMonsterType, selectedSpellType, 
    spellName
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
      flavorText,
      thematicElements: selectedThemes,
      icon: spellIcon
    });
  }, [
    source, selectedClass, selectedMonsterType, selectedSpellType,
    spellName, spellDescription, flavorText, selectedThemes, spellIcon,
    updateSpellData
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
    const selectedOption = document.querySelector(`.monster-option[data-id="${type}"]`);
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
  
  // Toggle thematic adjective selection
  const toggleThematicAdjective = (adjective) => {
    setSelectedThemes(prev => {
      if (prev.includes(adjective)) {
        return prev.filter(adj => adj !== adjective);
      } else {
        // Limit to 3 adjectives
        if (prev.length < 3) {
          return [...prev, adjective];
        }
        return prev;
      }
    });
  };
  
  // Get recommended adjectives based on class/monster type
  const getRecommendedAdjectives = () => {
    let recommended = [];
    
    // Add class-specific recommendations
    if (source === 'class' && selectedClass) {
      switch (selectedClass) {
        case 'pyrofiend':
          recommended = ['blazing', 'scorching', 'fiery'];
          break;
        case 'gambler':
          recommended = ['chaotic', 'unpredictable', 'fortunate'];
          break;
        // Add more class-specific recommendations
        default:
          recommended = [];
      }
    }
    
    // Add monster-specific recommendations
    if (source === 'monster' && selectedMonsterType) {
      switch (selectedMonsterType) {
        case 'Elemental':
          recommended = ['primal', 'elemental', 'natural'];
          break;
        case 'Undead':
          recommended = ['dark', 'shadowy', 'gloomy'];
          break;
        // Add more monster-specific recommendations
        default:
          recommended = [];
      }
    }
    
    return recommended;
  };
  
  const recommendedAdjectives = getRecommendedAdjectives();
  
  return (
    <div className="origin-identity-step">
      {/* Origin Selection Section */}
      <div className="section">
        <h4 className="section-title">Spell Origin</h4>
        <p className="section-description">
          Begin crafting your spell by selecting its origin.
        </p>
        
        <div className="source-selection">
          <div 
            className={`source-option ${source === 'class' ? 'selected' : ''}`}
            onClick={() => handleSourceChange('class')}
            data-id="class"
            title="Create a spell for a specific player class"
          >
            <div className="option-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div className="option-content">
              <div className="option-label">Player Class</div>
              <div className="option-description">Create a spell for a specific player class</div>
            </div>
          </div>
          
          <div 
            className={`source-option ${source === 'monster' ? 'selected' : ''}`}
            onClick={() => handleSourceChange('monster')}
            data-id="monster"
            title="Design an ability for a specific creature type"
          >
            <div className="option-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M13 2.05v2.02c1.46.18 2.79.76 3.9 1.62l1.42-1.43a9.85 9.85 0 0 0-5.32-2.21zm-2 0a9.85 9.85 0 0 0-5.32 2.21l1.42 1.43a7.9 7.9 0 0 1 3.9-1.62V2.05zM4.05 7a9.85 9.85 0 0 0-2.21 5.32h2.02c.18-1.46.76-2.79 1.62-3.9L4.05 7zm0 10l1.43-1.42a7.9 7.9 0 0 1-1.62-3.9H2.05A9.85 9.85 0 0 0 4.05 17zM17 19.95l-1.42-1.43a7.9 7.9 0 0 1-3.9 1.62v2.02a9.85 9.85 0 0 0 5.32-2.21zM7 19.95a9.85 9.85 0 0 0 5.32 2.21v-2.02a7.9 7.9 0 0 1-3.9-1.62L7 19.95zm12.95-7c-.18 1.46-.76 2.79-1.62 3.9l1.43 1.42a9.85 9.85 0 0 0 2.21-5.32h-2.02zM19.95 7l-1.43 1.42a7.9 7.9 0 0 1 1.62 3.9h2.02A9.85 9.85 0 0 0 19.95 7z"/>
              </svg>
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
          <h4 className="section-title">Class Selection</h4>
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
                <div className="class-name">{classOption.name}</div>
                <div className="class-resource">{classOption.resource}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Monster Type Selection - Show if monster is selected as source */}
      {source === 'monster' && (
        <div className="section">
          <h4 className="section-title">Monster Type</h4>
          <p className="section-description">
            Select the creature type to align the ability with its natural characteristics.
          </p>
          
          <div className="monster-options">
            {MONSTER_TYPES.map((type) => (
              <div 
                key={type}
                className={`monster-option ${selectedMonsterType === type ? 'selected' : ''}`}
                onClick={() => handleMonsterTypeSelect(type)}
                data-id={type}
              >
                <div className="monster-type">{type}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Spell Type Selection - Show after source and class/monster are selected */}
      {((source === 'class' && selectedClass) || 
         (source === 'monster' && selectedMonsterType)) && (
        <div className="section">
          <h4 className="section-title">Ability Type</h4>
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
                <div className="spell-type-name">{type.name}</div>
                <div className="spell-type-description">{type.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Spell Name and Description - Show after type is selected */}
      {selectedSpellType && (
        <div className="section">
          <h4 className="section-title">Spell Identity</h4>
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
      
      {/* Thematic Elements - Show after basics are filled out */}
      {spellName && (
        <div className="section">
          <h4 className="section-title">Thematic Elements</h4>
          <p className="section-description">
            Select up to 3 thematic adjectives to give your spell flavor and personality.
          </p>
          
          {recommendedAdjectives.length > 0 && (
            <div className="recommended-adjectives">
              <h5>Recommended Themes</h5>
              <div className="adjective-tags">
                {recommendedAdjectives.map((adjective) => (
                  <div 
                    key={adjective}
                    className={`adjective-tag ${selectedThemes.includes(adjective) ? 'selected' : ''}`}
                    onClick={() => toggleThematicAdjective(adjective)}
                  >
                    {adjective}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="thematic-categories">
            {THEMATIC_ADJECTIVES.map((category) => (
              <div key={category.category} className="thematic-category">
                <h5>{category.category.charAt(0).toUpperCase() + category.category.slice(1)}</h5>
                <div className="adjective-tags">
                  {category.adjectives.map((adjective) => (
                    <div 
                      key={adjective}
                      className={`adjective-tag ${selectedThemes.includes(adjective) ? 'selected' : ''}`}
                      onClick={() => toggleThematicAdjective(adjective)}
                    >
                      {adjective}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Flavor Text */}
      {spellName && (
        <div className="section">
          <h4 className="section-title">Flavor Text</h4>
          <p className="section-description">
            Add descriptive text to give your spell narrative depth and character.
          </p>
          
          <textarea
            className="flavor-text-input"
            value={flavorText}
            onChange={(e) => setFlavorText(e.target.value)}
            placeholder="Enter flavor text for your spell..."
            rows={4}
          />
          
          <div className="flavor-text-examples">
            <h5>Examples:</h5>
            <ul>
              <li>"The air shimmers as arcane energy coalesces into deadly projectiles."</li>
              <li>"Drawing upon ancient pacts, the caster sacrifices vitality to unleash forbidden power."</li>
              <li>"Whispers of winter wind gather around the target, freezing them to the core."</li>
            </ul>
          </div>
        </div>
      )}
      
      {/* Icon */}
      {spellName && (
        <div className="section">
          <h4 className="section-title">Icon</h4>
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
  );
};

export default Step1OriginType;