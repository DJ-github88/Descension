import { useState } from 'react';
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
      <div className="character-creation">
        {/* Controls Header */}
        <div className="character-controls">
          <div className="controls-left">
            <button onClick={onCancel} className="back-button">
              <i className="fas fa-arrow-left"></i>
            </button>
            <h1 className="controls-title">CHARACTER MANAGEMENT</h1>
            <div className="sort-control">
              <label>SORT BY:</label>
              <select defaultValue="name">
                <option value="name">Name</option>
                <option value="class">Class</option>
                <option value="race">Race</option>
              </select>
            </div>
            <div className="filter-control">
              <label>FILTER BY CLASS:</label>
              <select defaultValue="all">
                <option value="all">ALL CLASSES</option>
                <option value="fighter">Fighter</option>
                <option value="wizard">Wizard</option>
                <option value="rogue">Rogue</option>
              </select>
            </div>
          </div>
          <div className="controls-right">
            <button
              onClick={() => {
                if (characterName && selectedRace && selectedClass) {
                  const characterData = {
                    name: characterName,
                    race: selectedRace,
                    subrace: selectedSubrace,
                    class: selectedClass,
                    gender: selectedGender
                  };
                  onComplete(characterData);
                }
              }}
              className="create-new-character-btn"
              disabled={!characterName || !selectedRace || !selectedClass}
            >
              CREATE NEW CHARACTER
            </button>
            <span className="character-count">1 CHARACTER</span>
          </div>
        </div>
        {/* Left Panel - Selections */}
        <div className="creation-column">
          {/* Race Selection */}
          <div className="selection-category">
            <h2 className="category-title">Choose Race</h2>
            <div className="race-grid">
              {getRaceList().map((race) => (
                <div
                  key={race.id}
                  className={`selection-card race-card ${selectedRace === race.id ? 'selected' : ''}`}
                  onClick={() => handleRaceSelect(race.id)}
                >
                  <div className="card-icon">
                    <i className={race.icon}></i>
                  </div>
                  <div className="card-title">{race.name}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Subrace Selection */}
          {selectedRace && getSelectedRaceData()?.subraces && (
            <div className="selection-category">
              <h2 className="category-title">Choose Subrace</h2>
              <div className="subrace-grid">
                {getSelectedRaceData().subraces.map((subrace) => (
                  <div
                    key={subrace.id}
                    className={`selection-card subrace-card ${selectedSubrace === subrace.id ? 'selected' : ''}`}
                    onClick={() => handleSubraceSelect(subrace.id)}
                  >
                    <div className="card-content">
                      <div className="card-title">{subrace.name}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Class Selection */}
          <div className="selection-category">
            <h2 className="category-title">Choose Class</h2>
            <div className="class-grid">
              {Object.entries(characterClasses).flatMap(([pathName, classes]) =>
                classes.map((classInfo) => (
                  <div
                    key={classInfo.name}
                    className={`selection-card class-card ${selectedClass === classInfo.name ? 'selected' : ''}`}
                    onClick={() => handleClassSelect(classInfo.name)}
                  >
                    <div className="card-icon">
                      <i className={classInfo.icon}></i>
                    </div>
                    <div className="card-title">{classInfo.name}</div>
                    <div className="card-subtitle">{pathName}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Gender Selection */}
          <div className="selection-category">
            <h2 className="category-title">Gender</h2>
            <div className="subrace-grid">
              <div
                className={`selection-card subrace-card ${selectedGender === 'male' ? 'selected' : ''}`}
                onClick={() => setSelectedGender('male')}
              >
                <div className="card-icon">
                  <i className="fas fa-mars"></i>
                </div>
                <div className="card-content">
                  <div className="card-title">Male</div>
                </div>
              </div>
              <div
                className={`selection-card subrace-card ${selectedGender === 'female' ? 'selected' : ''}`}
                onClick={() => setSelectedGender('female')}
              >
                <div className="card-icon">
                  <i className="fas fa-venus"></i>
                </div>
                <div className="card-content">
                  <div className="card-title">Female</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Center Panel - Character Preview */}
        <div className="character-preview">
          {/* Character Name Input */}
          <div className="character-name-section">
            <label className="name-label">Character Name:</label>
            <input
              type="text"
              className="name-input"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="Enter character name"
              maxLength={30}
            />
          </div>

          <div className="character-preview-image">
            <div className="preview-icon">
              <i className="fas fa-user"></i>
            </div>
          </div>

          <div className="preview-stats">
            <h3>Character Summary</h3>
            <div className="stat-summary">
              <div className="stat-item">
                <div className="stat-label">Race</div>
                <div className="stat-value">{selectedRace ? getSelectedRaceData()?.name : '—'}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Subrace</div>
                <div className="stat-value">{selectedSubrace ? getSelectedSubraceData()?.name : '—'}</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Class</div>
                <div className="stat-value">{selectedClass ? selectedClass : '—'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Information Boxes */}
        <div className="character-info-panel">
          <div className="character-info-boxes">
            {selectedRace && (
              <div className="info-box">
                <h3 className="info-box-title">Race: {getSelectedRaceData()?.name}</h3>
                <div className="info-box-content">
                  <p><strong>Description:</strong> {getSelectedRaceData()?.description || 'A proud and noble race.'}</p>
                  {getSelectedRaceData()?.traits && (
                    <>
                      <p><strong>Racial Traits:</strong></p>
                      <ul className="trait-list">
                        {getSelectedRaceData().traits.map((trait, index) => (
                          <li key={index}>
                            <strong>{trait.name}:</strong> {trait.description}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            )}

            {selectedSubrace && (
              <div className="info-box">
                <h3 className="info-box-title">Subrace: {getSelectedSubraceData()?.name}</h3>
                <div className="info-box-content">
                  <p><strong>Description:</strong> {getSelectedSubraceData()?.description || 'A unique variant of the race.'}</p>
                  {getSelectedSubraceData()?.traits && (
                    <>
                      <p><strong>Subrace Traits:</strong></p>
                      <ul className="trait-list">
                        {getSelectedSubraceData().traits.map((trait, index) => (
                          <li key={index}>
                            <strong>{trait.name}:</strong> {trait.description}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </div>
            )}

            {selectedClass && (
              <div className="info-box">
                <h3 className="info-box-title">Class: {selectedClass}</h3>
                <div className="info-box-content">
                  {(() => {
                    const classData = Object.values(characterClasses).flat().find(c => c.name === selectedClass);
                    return (
                      <>
                        <p><strong>Description:</strong> {classData?.description || 'A powerful class with unique abilities and specialized combat techniques.'}</p>
                        <p><strong>Theme:</strong> {classData?.theme || 'Versatile'}</p>
                        <p><strong>Path:</strong> {Object.keys(characterClasses).find(path =>
                          characterClasses[path].some(c => c.name === selectedClass)
                        )}</p>
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

            {!selectedRace && !selectedSubrace && !selectedClass && (
              <div className="info-box">
                <h3 className="info-box-title">Character Creation</h3>
                <div className="info-box-content">
                  <p><strong>Step 1:</strong> Choose your character's race from the available options.</p>
                  <p><strong>Step 2:</strong> Select a subrace to further customize your character.</p>
                  <p><strong>Step 3:</strong> Pick a class that matches your preferred playstyle.</p>
                  <p><strong>Step 4:</strong> Enter your character's name and select gender.</p>
                  <p>Each selection will provide detailed information about your choices.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="creation-actions">
          <button className="btn" onClick={onCancel}>
            Characters
          </button>
          <button className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="btn"
            onClick={handleComplete}
            disabled={!characterName.trim() || !selectedClass || !selectedRace || !selectedSubrace}
          >
            Create Character
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterCreation;
