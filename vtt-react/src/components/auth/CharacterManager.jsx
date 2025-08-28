// Character management component with WoW-style interface
import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import useCharacterStore from '../../store/characterStore';
import './styles/CharacterManager.css';

const CharacterManager = ({ isOpen, onClose, onCreateCharacter }) => {
  const { user, userData, updateUserData } = useAuthStore();
  const { characterInfo } = useCharacterStore();
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    race: 'Human',
    subrace: '',
    class: 'Fighter',
    background: 'Acolyte',
    level: 1
  });

  // WoW-style class icons mapping
  const classIcons = {
    'Fighter': '⚔️',
    'Wizard': '🔮',
    'Rogue': '🗡️',
    'Cleric': '✨',
    'Ranger': '🏹',
    'Barbarian': '🪓',
    'Bard': '🎵',
    'Druid': '🌿',
    'Monk': '👊',
    'Paladin': '🛡️',
    'Sorcerer': '⚡',
    'Warlock': '👹'
  };

  // Race icons mapping
  const raceIcons = {
    'Human': '👤',
    'Elf': '🧝',
    'Dwarf': '🧔',
    'Halfling': '👶',
    'Dragonborn': '🐲',
    'Gnome': '🧙',
    'Half-Elf': '🧝‍♂️',
    'Half-Orc': '👹',
    'Tiefling': '😈',
    'Aasimar': '😇'
  };

  useEffect(() => {
    if (userData?.characters) {
      setCharacters(userData.characters);
    }
  }, [userData]);

  const handleCreateCharacter = async () => {
    if (!newCharacter.name.trim()) {
      alert('Please enter a character name');
      return;
    }

    const character = {
      id: Date.now().toString(),
      ...newCharacter,
      createdAt: new Date(),
      stats: {
        strength: 10,
        agility: 10,
        constitution: 10,
        intelligence: 10,
        spirit: 10,
        charisma: 10
      },
      health: { current: 100, max: 100 },
      experience: 0,
      equipment: [],
      inventory: [],
      spells: [],
      skills: []
    };

    const updatedCharacters = [...characters, character];
    setCharacters(updatedCharacters);

    // Update user data in database
    await updateUserData({
      characters: updatedCharacters
    });

    setShowCreateForm(false);
    setNewCharacter({
      name: '',
      race: 'Human',
      subrace: '',
      class: 'Fighter',
      background: 'Acolyte',
      level: 1
    });
  };

  const handleSelectCharacter = (character) => {
    setSelectedCharacter(character);
    if (onCreateCharacter) {
      onCreateCharacter(character);
    }
  };

  const handleDeleteCharacter = async (characterId) => {
    if (window.confirm('Are you sure you want to delete this character?')) {
      const updatedCharacters = characters.filter(char => char.id !== characterId);
      setCharacters(updatedCharacters);
      
      await updateUserData({
        characters: updatedCharacters
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="character-manager-overlay" onClick={onClose}>
      <div className="character-manager-modal" onClick={(e) => e.stopPropagation()}>
        <button className="character-manager-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="character-manager-header">
          <h2>Character Selection</h2>
          <p>Choose a character or create a new one</p>
        </div>

        <div className="character-manager-content">
          {!showCreateForm ? (
            <>
              {/* Character List */}
              <div className="character-grid">
                {characters.map((character) => (
                  <div
                    key={character.id}
                    className={`character-card-enhanced ${selectedCharacter?.id === character.id ? 'selected' : ''}`}
                    onClick={() => handleSelectCharacter(character)}
                  >
                    {/* Character Header */}
                    <div className="character-card-header">
                      <div className="character-portrait">
                        {character.image ? (
                          <img src={character.image} alt={character.name} />
                        ) : (
                          <i className="fas fa-user-circle"></i>
                        )}
                        <div className="character-level">
                          {character.level || 1}
                        </div>
                      </div>

                      <div className="character-header-info">
                        <h3 className="character-name">{character.name}</h3>
                        <p className="character-title">
                          {character.race} {character.class}
                        </p>
                        {character.subrace && (
                          <p className="character-subrace">{character.subrace}</p>
                        )}
                        <div className="character-class-icons">
                          <div className="race-icon" title={character.race}>
                            {raceIcons[character.race] || '👤'}
                          </div>
                          <div className="class-icon" title={character.class}>
                            {classIcons[character.class] || '⚔️'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Character Body */}
                    <div className="character-card-body">
                      {/* Primary Stats */}
                      <div className="character-primary-stats">
                        <div className="stat-group">
                          <div className="stat-item">
                            <span className="stat-label">Health</span>
                            <span className="stat-value">{character.hitPoints || 100}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Armor</span>
                            <span className="stat-value">{character.armorClass || 10}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Speed</span>
                            <span className="stat-value">{character.speed || 30}ft</span>
                          </div>
                        </div>
                      </div>

                      {/* Ability Scores */}
                      <div className="character-abilities">
                        <div className="abilities-grid">
                          {[
                            { key: 'strength', name: 'STR', icon: 'fas fa-fist-raised' },
                            { key: 'agility', name: 'AGI', icon: 'fas fa-running' },
                            { key: 'constitution', name: 'CON', icon: 'fas fa-heart' },
                            { key: 'intelligence', name: 'INT', icon: 'fas fa-brain' },
                            { key: 'spirit', name: 'SPI', icon: 'fas fa-dove' },
                            { key: 'charisma', name: 'CHA', icon: 'fas fa-comments' }
                          ].map(ability => {
                            const value = character.stats?.[ability.key] || character[ability.key] || 10;
                            const modifier = Math.floor((value - 10) / 2);
                            return (
                              <div key={ability.key} className="ability-score">
                                <i className={ability.icon} title={ability.name}></i>
                                <span className="ability-value">{value}</span>
                                <span className="ability-modifier">
                                  {modifier >= 0 ? '+' : ''}{modifier}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Character Actions */}
                      <div className="character-actions">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle play character
                          }}
                          className="btn btn-primary"
                          title="Play this character"
                        >
                          <i className="fas fa-play"></i>
                          Play
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle edit character
                          }}
                          className="btn btn-secondary"
                          title="Edit character"
                        >
                          <i className="fas fa-edit"></i>
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCharacter(character.id);
                          }}
                          className="btn btn-danger"
                          title="Delete character"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>

                      {/* Character Meta */}
                      {character.createdAt && (
                        <div className="character-meta">
                          <small>Created: {new Date(character.createdAt).toLocaleDateString()}</small>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {/* Create New Character Slot */}
                <div
                  className="character-slot create-new"
                  onClick={() => setShowCreateForm(true)}
                >
                  <div className="create-character-icon">
                    <i className="fas fa-plus"></i>
                  </div>
                  <div className="create-character-text">
                    <h3>Create New</h3>
                    <p>Character</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="character-actions">
                {selectedCharacter && (
                  <button
                    className="enter-world-btn"
                    onClick={() => {
                      handleSelectCharacter(selectedCharacter);
                      onClose();
                    }}
                  >
                    <i className="fas fa-play"></i>
                    Enter World
                  </button>
                )}
              </div>
            </>
          ) : (
            /* Character Creation Form */
            <div className="character-creation-form">
              <h3>Create New Character</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="characterName">Character Name</label>
                  <input
                    id="characterName"
                    type="text"
                    value={newCharacter.name}
                    onChange={(e) => setNewCharacter(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter character name"
                    maxLength={20}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="characterRace">Race</label>
                  <select
                    id="characterRace"
                    value={newCharacter.race}
                    onChange={(e) => setNewCharacter(prev => ({ ...prev, race: e.target.value }))}
                  >
                    <option value="Human">Human</option>
                    <option value="Elf">Elf</option>
                    <option value="Dwarf">Dwarf</option>
                    <option value="Halfling">Halfling</option>
                    <option value="Dragonborn">Dragonborn</option>
                    <option value="Gnome">Gnome</option>
                    <option value="Half-Elf">Half-Elf</option>
                    <option value="Half-Orc">Half-Orc</option>
                    <option value="Tiefling">Tiefling</option>
                    <option value="Aasimar">Aasimar</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="characterClass">Class</label>
                  <select
                    id="characterClass"
                    value={newCharacter.class}
                    onChange={(e) => setNewCharacter(prev => ({ ...prev, class: e.target.value }))}
                  >
                    <option value="Fighter">Fighter</option>
                    <option value="Wizard">Wizard</option>
                    <option value="Rogue">Rogue</option>
                    <option value="Cleric">Cleric</option>
                    <option value="Ranger">Ranger</option>
                    <option value="Barbarian">Barbarian</option>
                    <option value="Bard">Bard</option>
                    <option value="Druid">Druid</option>
                    <option value="Monk">Monk</option>
                    <option value="Paladin">Paladin</option>
                    <option value="Sorcerer">Sorcerer</option>
                    <option value="Warlock">Warlock</option>
                  </select>
                </div>
              </div>

              <div className="character-preview">
                <div className="preview-icon">
                  {classIcons[newCharacter.class]} {raceIcons[newCharacter.race]}
                </div>
                <p>{newCharacter.race} {newCharacter.class}</p>
              </div>

              <div className="form-actions">
                <button
                  className="create-btn"
                  onClick={handleCreateCharacter}
                  disabled={!newCharacter.name.trim()}
                >
                  <i className="fas fa-plus"></i>
                  Create Character
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CharacterManager;
