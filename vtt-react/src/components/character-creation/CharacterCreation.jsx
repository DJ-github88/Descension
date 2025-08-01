import React, { useState } from 'react';
import { RACE_DATA } from '../../data/raceData';
import './styles/CharacterCreation.css';

const CharacterCreation = ({ onComplete, onCancel }) => {
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedRace, setSelectedRace] = useState(null);
  const [selectedSubrace, setSelectedSubrace] = useState(null);
  const [characterName, setCharacterName] = useState('');
  const [selectedGender, setSelectedGender] = useState('male');

  // Convert RACE_DATA to the format we need
  const getRaceList = () => {
    return Object.entries(RACE_DATA).map(([raceId, raceData]) => ({
      id: raceId,
      name: raceData.name,
      description: raceData.description,
      icon: getRaceIcon(raceData.name),
      subraces: Object.entries(raceData.subraces).map(([subraceId, subraceData]) => ({
        id: subraceId,
        name: subraceData.name,
        description: subraceData.description,
        statModifiers: subraceData.statModifiers,
        traits: subraceData.traits
      }))
    }));
  };

  const getRaceIcon = (raceName) => {
    const icons = {
      'Nordmark': 'fas fa-mountain',
      'Grimheart': 'fas fa-hammer',
      'Voidtouched': 'fas fa-eye',
      'Mirrorkin': 'fas fa-mask',
      'Thornkin': 'fas fa-leaf',
      'Stormcaller': 'fas fa-bolt',
      'Shadowmere': 'fas fa-moon',
      'Ironbound': 'fas fa-shield',
      'Flameborn': 'fas fa-fire',
      'Frostkin': 'fas fa-snowflake'
    };
    return icons[raceName] || 'fas fa-user';
  };

  const getRaceColor = (raceName) => {
    const colors = {
      'Nordmark': '#8B7355',
      'Grimheart': '#A0522D',
      'Voidtouched': '#4B0082',
      'Mirrorkin': '#C0C0C0',
      'Thornkin': '#228B22',
      'Stormcaller': '#4169E1',
      'Shadowmere': '#2F2F4F',
      'Ironbound': '#708090',
      'Flameborn': '#FF4500',
      'Frostkin': '#87CEEB'
    };
    return colors[raceName] || '#d4af37';
  };

  const getClassColor = (className) => {
    const colors = {
      'Pyrofiend': '#FF4500',
      'Minstrel': '#FF69B4',
      'Chronarch': '#4169E1',
      'Chaos Weaver': '#9932CC',
      'Gambler': '#DAA520',
      'Martyr': '#F5F5DC',
      'False Prophet': '#8B008B',
      'Exorcist': '#FFD700',
      'Plaguebringer': '#228B22',
      'Lichborne': '#800080',
      'Deathcaller': '#2F2F2F',
      'Spellguard': '#4682B4',
      'Inscriptor': '#B8860B',
      'Arcanoneer': '#FF6347',
      'Witch Doctor': '#32CD32',
      'Formbender': '#8FBC8F',
      'Primalist': '#228B22',
      'Berserker': '#DC143C',
      'Dreadnaught': '#708090',
      'Titan': '#8B7355',
      'Toxicologist': '#00CED1',
      'Covenbane': '#A0522D',
      'Bladedancer': '#8B0000',
      'Lunarch': '#87CEEB',
      'Huntress': '#228B22',
      'Warden': '#4682B4'
    };
    return colors[className] || '#d4af37';
  };

  // All 27 character classes organized by paths
  const characterClasses = {
    'Infernal Path': [
      { name: 'Pyrofiend', icon: 'fas fa-fire', description: 'Demonic fire wielder with ascending corruption stages', theme: 'fire' },
      { name: 'Minstrel', icon: 'fas fa-music', description: 'Musical spellcaster combining notes into powerful chords', theme: 'music' },
      { name: 'Chronarch', icon: 'fas fa-clock', description: 'Time manipulator building temporal energy', theme: 'time' },
      { name: 'Chaos Weaver', icon: 'fas fa-dice', description: 'Reality bender using chaos dice and entropy', theme: 'chaos' },
      { name: 'Gambler', icon: 'fas fa-coins', description: 'Fate manipulator balancing luck and risk', theme: 'luck' }
    ],
    'Zealot Path': [
      { name: 'Martyr', icon: 'fas fa-cross', description: 'Self-sacrificing warrior earning power through pain', theme: 'sacrifice' },
      { name: 'False Prophet', icon: 'fas fa-eye', description: 'Deceptive preacher spreading lies and corruption', theme: 'deception' },
      { name: 'Exorcist', icon: 'fas fa-ankh', description: 'Holy warrior banishing evil spirits', theme: 'holy' }
    ],
    'Harrow Path': [
      { name: 'Plaguebringer', icon: 'fas fa-skull', description: 'Disease spreader with contagious plague stacks', theme: 'disease' },
      { name: 'Lichborne', icon: 'fas fa-skull-crossbones', description: 'Undead spellcaster with phylactery power', theme: 'undead' },
      { name: 'Deathcaller', icon: 'fas fa-ghost', description: 'Necromancer harvesting souls for dark magic', theme: 'necromancy' }
    ],
    'Arcanist Path': [
      { name: 'Spellguard', icon: 'fas fa-shield-alt', description: 'Protective mage with magical ward layers', theme: 'protection' },
      { name: 'Inscriptor', icon: 'fas fa-scroll', description: 'Runic scholar creating magical glyph circuits', theme: 'runes' },
      { name: 'Arcanoneer', icon: 'fas fa-magic', description: 'Elemental cannon wielder with volatility risk', theme: 'elemental' }
    ],
    'Hexer Path': [
      { name: 'Witch Doctor', icon: 'fas fa-voodoo-doll', description: 'Spiritual invoker channeling loa spirits', theme: 'spiritual' },
      { name: 'Formbender', icon: 'fas fa-paw', description: 'Shapeshifter with primal instinct energy', theme: 'primal' },
      { name: 'Primalist', icon: 'fas fa-tree', description: 'Totem master resonating with elemental forces', theme: 'nature' }
    ],
    'Reaver Path': [
      { name: 'Berserker', icon: 'fas fa-axe-battle', description: 'Fury warrior with momentum thresholds', theme: 'rage' },
      { name: 'Dreadnaught', icon: 'fas fa-fortress', description: 'Fortress defender with siege capabilities', theme: 'fortress' },
      { name: 'Titan', icon: 'fas fa-mountain', description: 'Gravity manipulator with strain overload', theme: 'gravity' }
    ],
    'Mercenary Path': [
      { name: 'Toxicologist', icon: 'fas fa-flask', description: 'Poison crafter with alchemical vials', theme: 'alchemy' },
      { name: 'Covenbane', icon: 'fas fa-ban', description: 'Witch hunter with anti-magic seals', theme: 'anti-magic' },
      { name: 'Bladedancer', icon: 'fas fa-sword', description: 'Finesse fighter with edge and flourish', theme: 'finesse' }
    ],
    'Mercenary Path': [
      { name: 'Lunarch', icon: 'fas fa-moon', description: 'Lunar mage with phase-based energy', theme: 'lunar' },
      { name: 'Huntress', icon: 'fas fa-bow-arrow', description: 'Tracker with quarry marks and precision', theme: 'hunter' },
      { name: 'Warden', icon: 'fas fa-shield', description: 'Barrier guardian with protective bulwarks', theme: 'guardian' }
    ]
  };

  // Event handlers
  const handleRaceSelect = (raceId) => {
    setSelectedRace(raceId);
    setSelectedSubrace(null); // Reset subrace when race changes
  };

  const handleSubraceSelect = (subraceId) => {
    setSelectedSubrace(subraceId);
  };

  const handleClassSelect = (className) => {
    setSelectedClass(className);
  };

  const handleComplete = () => {
    if (characterName.trim() && selectedClass && selectedRace && selectedSubrace) {
      onComplete({
        name: characterName.trim(),
        class: selectedClass,
        race: selectedRace,
        subrace: selectedSubrace,
        gender: selectedGender
      });
    }
  };

  const getSelectedRaceData = () => {
    if (!selectedRace) return null;
    return getRaceList().find(race => race.id === selectedRace);
  };

  const getSelectedSubraceData = () => {
    if (!selectedRace || !selectedSubrace) return null;
    const raceData = getSelectedRaceData();
    return raceData?.subraces.find(subrace => subrace.id === selectedSubrace);
  };

  const getAllClasses = () => {
    const allClasses = [];
    Object.entries(characterClasses).forEach(([pathName, classes]) => {
      classes.forEach(classData => {
        allClasses.push({ ...classData, path: pathName });
      });
    });
    return allClasses;
  };

  const getClassThemeColor = (theme) => {
    const themeColors = {
      fire: '#FF4500', music: '#9370DB', time: '#4682B4', chaos: '#DC143C', luck: '#FFD700',
      sacrifice: '#8B0000', deception: '#2F4F4F', holy: '#F0E68C',
      disease: '#556B2F', undead: '#8A2BE2', necromancy: '#2F2F2F',
      protection: '#4169E1', runes: '#6A5ACD', elemental: '#FF6347',
      spiritual: '#8B4513', primal: '#228B22', nature: '#32CD32',
      rage: '#B22222', fortress: '#708090', gravity: '#483D8B',
      alchemy: '#DAA520', 'anti-magic': '#4B0082', finesse: '#C0C0C0',
      lunar: '#E6E6FA', hunter: '#8FBC8F', guardian: '#87CEEB'
    };
    return themeColors[theme] || '#d4af37';
  };

  const formatStatModifiers = (modifiers) => {
    if (!modifiers) return '';
    return Object.entries(modifiers)
      .filter(([stat, value]) => value !== 0)
      .map(([stat, value]) => `${stat.charAt(0).toUpperCase() + stat.slice(1)}: ${value > 0 ? '+' : ''}${value}`)
      .join(', ');
  };

  return (
    <div className="character-creation-page">
      {/* Left Sidebar - Race Selection */}
      <div className="creation-sidebar left-sidebar">
        <div className="sidebar-header">
          <h2>Race</h2>
        </div>
        <div className="race-grid">
          {getRaceList().map((race) => (
            <div
              key={race.id}
              className={`race-card ${selectedRace === race.id ? 'selected' : ''}`}
              onClick={() => handleRaceSelect(race.id)}
              style={{'--race-color': getRaceColor(race.name)}}
            >
              <div className="race-icon">
                <i className={race.icon}></i>
              </div>
              <span className="race-name">{race.name}</span>
            </div>
          ))}
        </div>

        {/* Subrace Selection */}
        {selectedRace && (
          <div className="subrace-section">
            <div className="sidebar-header">
              <h3>Subrace</h3>
            </div>
            <div className="subrace-grid">
              {getSelectedRaceData()?.subraces.map((subrace) => (
                <div
                  key={subrace.id}
                  className={`subrace-card ${selectedSubrace === subrace.id ? 'selected' : ''}`}
                  onClick={() => handleSubraceSelect(subrace.id)}
                  style={{'--race-color': getRaceColor(getSelectedRaceData()?.name)}}
                >
                  <span className="subrace-name">{subrace.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Class Selection */}
        <div className="class-section">
          <div className="sidebar-header">
            <h2>Class</h2>
          </div>
          <div className="class-grid">
            {Object.entries(characterClasses).flatMap(([pathName, classes]) =>
              classes.map((classInfo) => (
                <div
                  key={classInfo.name}
                  className={`class-card ${selectedClass === classInfo.name ? 'selected' : ''}`}
                  onClick={() => handleClassSelect(classInfo.name)}
                  style={{'--class-color': getClassColor(classInfo.name)}}
                >
                  <div className="class-icon">
                    <i className={classInfo.icon}></i>
                  </div>
                  <div className="class-name">{classInfo.name}</div>
                  <div className="class-path">{pathName}</div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Center - Character Preview */}
      <div className="character-preview">
        <div className="preview-header">
          <h1>Character Creation</h1>
        </div>

        <div className="character-model">
          <div className="model-placeholder">
            <i className="fas fa-user character-silhouette"></i>
            <div className="character-info">
              {selectedRace && selectedSubrace && (
                <div className="selected-race">
                  {getSelectedRaceData()?.name} - {getSelectedSubraceData()?.name}
                </div>
              )}
              {selectedClass && (
                <div className="selected-class">{selectedClass}</div>
              )}
            </div>
          </div>
        </div>

        <div className="character-customization">
          <div className="customization-row">
            <label>Gender:</label>
            <div className="gender-buttons">
              <button
                className={`gender-btn ${selectedGender === 'male' ? 'selected' : ''}`}
                onClick={() => setSelectedGender('male')}
              >
                Male
              </button>
              <button
                className={`gender-btn ${selectedGender === 'female' ? 'selected' : ''}`}
                onClick={() => setSelectedGender('female')}
              >
                Female
              </button>
            </div>
          </div>
        </div>

        <div className="character-name-section">
          <label htmlFor="characterName">Name:</label>
          <input
            id="characterName"
            type="text"
            value={characterName}
            onChange={(e) => setCharacterName(e.target.value)}
            placeholder="Enter character name"
            className="character-name-input"
            maxLength={30}
          />
        </div>
      </div>

      {/* Right Sidebar - Details */}
      <div className="creation-sidebar right-sidebar">
        <div className="sidebar-header">
          <h2>Details</h2>
        </div>

        {/* Race Details */}
        {getSelectedSubraceData() && (
          <div className="details-section">
            <h3>Racial Traits</h3>
            <div className="race-description">
              {getSelectedSubraceData().description}
            </div>

            {getSelectedSubraceData().statModifiers && (
              <div className="stat-modifiers">
                <h4>Stat Modifiers</h4>
                <div className="modifiers-list">
                  {formatStatModifiers(getSelectedSubraceData().statModifiers)}
                </div>
              </div>
            )}

            {getSelectedSubraceData().traits && getSelectedSubraceData().traits.length > 0 && (
              <div className="racial-traits">
                <h4>Special Traits</h4>
                {getSelectedSubraceData().traits.map((trait, index) => (
                  <div key={index} className="trait-item">
                    <div className="trait-name">{trait.name}</div>
                    <div className="trait-description">{trait.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Class Details */}
        {selectedClass && (
          <div className="details-section">
            <h3>Class Features</h3>
            <div className="class-description">
              {getAllClasses().find(c => c.name === selectedClass)?.description}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="creation-actions">
        <button className="cancel-btn" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="create-btn"
          onClick={handleComplete}
          disabled={!characterName.trim() || !selectedClass || !selectedRace || !selectedSubrace}
        >
          Create Character
        </button>
      </div>
    </div>
  );
};

export default CharacterCreation;
