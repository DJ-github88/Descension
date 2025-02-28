import React, { useState, useEffect } from 'react';
import useSpellWizardStore from '../../../store/spellWizardStore';
import { IconSelector } from '../common';
import '../styles/spell-wizard.css'; 
import '../styles/spell-wizard-layout.css'; 

// Class options for player character spells
const CLASS_OPTIONS = [
  { id: 'pyrofiend', name: 'Pyrofiend', resource: 'Inferno Levels' },
  { id: 'gambler', name: 'Gambler', resource: 'Fortune Points' },
  { id: 'fateweaver', name: 'Fate Weaver', resource: 'Destiny Charges' },
  { id: 'berserker', name: 'Berserker', resource: 'Rage' },
  { id: 'shadowdancer', name: 'Shadowdancer', resource: 'Shadow Energy' },
  { id: 'elementalist', name: 'Elementalist', resource: 'Elemental Harmony' }
  // Add other class options if needed
];

// Monster/creature types
const MONSTER_TYPES = [
  'Aberration', 'Beast', 'Celestial', 'Construct', 'Dragon',
  'Elemental', 'Fey', 'Fiend', 'Giant', 'Humanoid',
  'Monstrosity', 'Ooze', 'Plant', 'Undead'
];

// Spell types
const SPELL_TYPES = [
  { id: 'active', name: 'Active Ability', description: 'An ability that must be activated and typically has a cost and cooldown.' },
  { id: 'passive', name: 'Passive Ability', description: 'An ability that is always active and provides a constant benefit.' },
  { id: 'aura', name: 'Aura', description: 'A persistent effect that radiates from the caster or target.' },
  { id: 'ultimate', name: 'Ultimate Ability', description: 'A powerful ability with a significant impact but a long cooldown.' },
  { id: 'reaction', name: 'Reaction', description: 'An ability that triggers in response to certain conditions.' },
  { id: 'ritual', name: 'Ritual', description: 'A complex ability that requires preparation and time to cast.' }
];

// Thematic adjectives for spell flavor - we'll keep these for compatibility
// even though you mentioned disliking flavor text and tags
const THEMATIC_ADJECTIVES = [
  { category: 'fire', adjectives: ['blazing', 'scorching', 'searing', 'incandescent', 'incinerating', 'fiery', 'smoldering'] },
  { category: 'frost', adjectives: ['frigid', 'chilling', 'freezing', 'glacial', 'icy', 'wintry', 'arctic'] },
  { category: 'arcane', adjectives: ['mystical', 'arcane', 'enigmatic', 'magical', 'enchanted', 'ethereal', 'eldritch'] },
  { category: 'nature', adjectives: ['primal', 'wild', 'natural', 'verdant', 'flourishing', 'organic', 'thriving'] },
  { category: 'shadow', adjectives: ['dark', 'shadowy', 'gloomy', 'dusky', 'obscured', 'tenebrous', 'dim'] }
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
  
  return (
    <div className="origin-identity-step">
      {/* Origin Selection Section */}
      <div className="section">
        <h4 className="section-title">Spell Origin</h4>
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
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
      
      {/* Icon Selection - Show after name and description */}
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
      
      <style jsx>{`
        /* Improved styling for Step 1 */
        .origin-identity-step {
          font-family: 'Segoe UI', 'Open Sans', sans-serif;
          color: #e6e9f0;
        }
        
        .section {
          background-color: #272b40;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 16px;
          border: 1px solid #394263;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .section-title {
          color: #40c4ff;
          font-size: 18px;
          margin-bottom: 8px;
          font-weight: 600;
          position: relative;
          padding-bottom: 8px;
        }
        
        .section-title::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 40px;
          height: 2px;
          background: linear-gradient(to right, #00a8ff, #40c4ff);
          box-shadow: 0 0 8px rgba(0, 168, 255, 0.5);
        }
        
        .section-description {
          color: #a0a7c1;
          margin-bottom: 16px;
          font-size: 14px;
        }
        
        /* Origin options styling */
        .origin-options {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-bottom: 8px;
        }
        
        @media (min-width: 640px) {
          .origin-options {
            flex-direction: row;
          }
        }
        
        .origin-option {
          background-color: #2d334d;
          border: 1px solid #394263;
          border-radius: 6px;
          padding: 12px;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
          flex: 1;
        }
        
        .origin-option:hover {
          background-color: #323b4d;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .origin-option.selected {
          border-color: #00a8ff;
          background-color: rgba(0, 168, 255, 0.1);
          box-shadow: 0 0 10px rgba(0, 168, 255, 0.3);
        }
        
        .option-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background-color: #323b4d;
          border-radius: 20px;
          color: #40c4ff;
        }
        
        .option-content {
          flex: 1;
        }
        
        .option-label {
          font-weight: 600;
          margin-bottom: 4px;
          color: #e6e9f0;
        }
        
        .option-description {
          font-size: 12px;
          color: #a0a7c1;
        }
        
        /* Class options styling */
        .class-options {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 10px;
        }
        
        .class-option {
          background-color: #2d334d;
          border: 1px solid #394263;
          border-radius: 6px;
          padding: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .class-option:hover {
          background-color: #323b4d;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .class-option.selected {
          border-color: #00a8ff;
          background-color: rgba(0, 168, 255, 0.1);
          box-shadow: 0 0 10px rgba(0, 168, 255, 0.3);
        }
        
        .class-name {
          font-weight: 600;
          margin-bottom: 4px;
          color: #e6e9f0;
        }
        
        .class-resource {
          font-size: 12px;
          color: #a0a7c1;
        }
        
        /* Monster options styling */
        .monster-options {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 10px;
        }
        
        .monster-option {
          background-color: #2d334d;
          border: 1px solid #394263;
          border-radius: 6px;
          padding: 8px 10px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }
        
        .monster-option:hover {
          background-color: #323b4d;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .monster-option.selected {
          border-color: #00a8ff;
          background-color: rgba(0, 168, 255, 0.1);
          box-shadow: 0 0 10px rgba(0, 168, 255, 0.3);
        }
        
        .monster-type {
          font-weight: 500;
          color: #e6e9f0;
          font-size: 14px;
        }
        
        /* Spell type options styling */
        .spell-type-options {
          display: grid;
          grid-template-columns: 1fr;
          gap: 10px;
        }
        
        @media (min-width: 640px) {
          .spell-type-options {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        .spell-type-option {
          background-color: #2d334d;
          border: 1px solid #394263;
          border-radius: 6px;
          padding: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .spell-type-option:hover {
          background-color: #323b4d;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        
        .spell-type-option.selected {
          border-color: #00a8ff;
          background-color: rgba(0, 168, 255, 0.1);
          box-shadow: 0 0 10px rgba(0, 168, 255, 0.3);
        }
        
        .spell-type-name {
          font-weight: 600;
          margin-bottom: 4px;
          color: #e6e9f0;
        }
        
        .spell-type-description {
          font-size: 12px;
          color: #a0a7c1;
        }
        
        /* Name and description styling */
        .name-input, .description-input {
          margin-bottom: 16px;
        }
        
        .name-input label, .description-input label {
          display: block;
          margin-bottom: 6px;
          color: #a0a7c1;
          font-weight: 500;
        }
        
        .spell-name-input, .spell-description-input {
          width: 100%;
          padding: 10px;
          background-color: #202334;
          border: 1px solid #394263;
          border-radius: 4px;
          color: #e6e9f0;
          transition: all 0.2s ease;
        }
        
        .spell-name-input:focus, .spell-description-input:focus {
          border-color: #00a8ff;
          outline: none;
          box-shadow: 0 0 8px rgba(0, 168, 255, 0.3);
        }
        
        .spell-description-input {
          resize: vertical;
          min-height: 80px;
        }
        
        /* Validation message styling */
        .validation-message {
          background-color: rgba(255, 83, 112, 0.1);
          border-left: 4px solid #ff5370;
          padding: 12px;
          margin-top: 16px;
          border-radius: 4px;
          color: #ff5370;
          font-size: 14px;
        }
        
        /* Animation classes */
        .pulse-effect {
          animation: pulse 1s ease-in-out;
        }
        
        .glow-effect {
          animation: glow 2s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        @keyframes glow {
          0% { box-shadow: 0 0 5px rgba(0, 168, 255, 0.3); }
          50% { box-shadow: 0 0 15px rgba(0, 168, 255, 0.5); }
          100% { box-shadow: 0 0 5px rgba(0, 168, 255, 0.3); }
        }
      `}</style>
    </div>
  );
};

export default Step1OriginType;