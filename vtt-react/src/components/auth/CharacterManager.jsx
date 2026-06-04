// Character management component with WoW-style interface
import React, { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import useCharacterStore from '../../store/characterStore';
import { RACE_DATA } from '../../data/raceData';
import './styles/CharacterManager.css';

const CharacterManager = ({ isOpen, onClose, onCreateCharacter }) => {
  const { user, userData, updateUserData } = useAuthStore();
  const { characterInfo, setActiveCharacter, currentCharacterId } = useCharacterStore();
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCharacter, setNewCharacter] = useState({
    name: '',
    race: 'human',
    subrace: '',
    class: 'Dreadnaught',
    background: 'Acolyte',
    level: 1
  });

  // WoW-style class icons mapping
  const classIcons = {
    'Arcanoneer': '🔮', 'Berserker': '🪓', 'Bladedancer': '🗡️', 'Chaos Weaver': '🌀',
    'Chronarch': '⏳', 'Covenbane': '⚖️', 'Deathcaller': '💀', 'Dreadnaught': '⚔️',
    'Exorcist': '✨', 'False Prophet': '👁️', 'Fate Weaver': '🧵', 'Formbender': '🐻',
    'Gambler': '🎲', 'Huntress': '🏹', 'Inscriptor': '📜', 'Lichborne': '❄️',
    'Lunarch': '🌙', 'Martyr': '🛡️', 'Minstrel': '🎵', 'Oracle': '🔮',
    'Plaguebringer': '☠️', 'Primalist': '🐾', 'Pyrofiend': '🔥', 'Spellguard': '🛡️',
    'Titan': '⛰️', 'Toxicologist': '🧪', 'Warden': '⚡', 'Witch Doctor': '🎭',
    'Augur': '🔯', 'Doomsayer': '📣'
  };

  const raceIcons = {
    'human': '👤', 'Human': '👤',
    'astril': '⭐', 'Astril': '⭐',
    'briaran': '🦊', 'Briaran': '🦊',
    'emberth': '🔥', 'Emberth': '🔥',
    'fexrick': '⚙️', 'Fexrick': '⚙️',
    'groven': '💎', 'Groven': '💎',
    'mimir': '🎭', 'Mimir': '🎭',
    'morthel': '📜', 'Morthel': '📜', 'neth': '📜', 'Neth': '📜',

    'vreken': '🦎', 'Vreken': '🦎',
    'myrathil': '🌊', 'Myrathil': '🌊'
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
      health: { current: 50, max: 50 }, // Will be recalculated based on constitution
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
      race: 'human',
      subrace: '',
      class: 'Dreadnaught',
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
              <div className="character-manager-grid">
                {characters.map((character) => (
                  <div
                    key={character.id}
                    className={`character-card-enhanced ${selectedCharacter?.id === character.id ? 'selected' : ''} ${currentCharacterId === character.id ? 'active-character' : ''}`}
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
                          {RACE_DATA[character.race]?.name || character.race} {character.class}
                        </p>
                        {character.subrace && (
                          <p className="character-subrace">{character.subrace}</p>
                        )}
                        <div className="character-class-icons">
                          <div className="race-icon" title={RACE_DATA[character.race]?.name || character.race}>
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
                            <span className="stat-value">{character.armor || 10}</span>
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

                      {/* Enhanced Character Stats Summary */}
                      <div className="character-enhanced-summary">
                        <div className="character-derived-stats">
                          <div className="derived-stat">
                            <i className="fas fa-heartbeat"></i>
                            <span className="stat-label">Health Regen:</span>
                            <span className="stat-value">{Math.floor(((character.stats?.constitution || character.constitution || 10) - 10) / 2) || 0}/turn</span>
                          </div>
                          <div className="derived-stat">
                            <i className="fas fa-magic"></i>
                            <span className="stat-label">Mana Regen:</span>
                            <span className="stat-value">{Math.floor(((character.stats?.intelligence || character.intelligence || 10) + (character.stats?.spirit || character.spirit || 10)) / 4) || 0}/turn</span>
                          </div>
                          <div className="derived-stat">
                            <i className="fas fa-hand-holding-heart"></i>
                            <span className="stat-label">Healing Power:</span>
                            <span className="stat-value">{Math.floor((character.stats?.spirit || character.spirit || 10) / 2) || 0}</span>
                          </div>
                        </div>

                        <div className="character-capabilities">
                          <div className="capability-row">
                            <div className="capability">
                              <i className="fas fa-dungeon"></i>
                              <span>Melee Damage: {Math.floor((character.stats?.strength || character.strength || 10) / 2) || 0}</span>
                            </div>
                            <div className="capability">
                              <i className="fas fa-bullseye"></i>
                              <span>Ranged Damage: {Math.floor((character.stats?.agility || character.agility || 10) / 2) || 0}</span>
                            </div>
                          </div>
                          <div className="capability-row">
                            <div className="capability">
                              <i className="fas fa-shield"></i>
                              <span>Defense: {Math.floor((character.stats?.agility || character.agility || 10) / 2) || 0}</span>
                            </div>
                            <div className="capability">
                              <i className="fas fa-eye"></i>
                              <span>Perception: {Math.floor(((character.stats?.spirit || character.spirit || 10) - 10) / 2) || 0}</span>
                            </div>
                          </div>
                        </div>

                        {/* Equipment & Inventory Summary */}
                        {(character.equipment || character.inventory || character.spells) && (
                          <div className="character-inventory-summary">
                            {(character.equipment && Object.keys(character.equipment).length > 0) && (
                              <div className="summary-item">
                                <i className="fas fa-tshirt"></i>
                                <span>{Object.keys(character.equipment).length} equipped items</span>
                              </div>
                            )}
                            {(character.inventory && character.inventory.length > 0) && (
                              <div className="summary-item">
                                <i className="fas fa-backpack"></i>
                                <span>{character.inventory.length} inventory items</span>
                              </div>
                            )}
                            {(character.spells && character.spells.length > 0) && (
                              <div className="summary-item">
                                <i className="fas fa-magic"></i>
                                <span>{character.spells.length} spells known</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Character Actions */}
                      <div className="character-actions">
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            // Set this character as active (don't close modal)
                            const activeCharacter = await setActiveCharacter(character.id);
                            if (activeCharacter) {
                              console.log(`🎮 Selected character: ${activeCharacter.name}`);
                            } else {
                              console.error(`❌ Failed to select character: ${character.id}`);
                            }
                          }}
                          className={`btn ${currentCharacterId === character.id ? 'btn-success' : 'btn-primary'}`}
                          title={currentCharacterId === character.id ? 'Active character' : 'Select this character'}
                        >
                          <i className={`fas ${currentCharacterId === character.id ? 'fa-check' : 'fa-play'}`}></i>
                          {currentCharacterId === character.id ? 'Active' : 'Select'}
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
                    onClick={async () => {
                      // Set this character as active and close modal
                      const activeCharacter = await setActiveCharacter(selectedCharacter.id);
                      if (activeCharacter) {
                        console.log(`🎮 Selected character: ${activeCharacter.name}`);
                        handleSelectCharacter(selectedCharacter);
                        onClose();
                      } else {
                        console.error(`❌ Failed to select character: ${selectedCharacter.id}`);
                      }
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
                    <option value="human">Human</option>
                    <option value="astril">Astril</option>
                    <option value="briaran">Briaran</option>
                    <option value="emberth">Emberth</option>
                    <option value="fexrick">Fexrick</option>
                    <option value="groven">Groven</option>
                    <option value="mimir">Mimir</option>
                    <option value="morthel">Neth</option>
                    <option value="vreken">Vreken</option>
                    <option value="myrathil">Myrathil</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="characterClass">Class</label>
                  <select
                    id="characterClass"
                    value={newCharacter.class}
                    onChange={(e) => setNewCharacter(prev => ({ ...prev, class: e.target.value }))}
                  >
                    <option value="Arcanoneer">Arcanoneer</option>
                    <option value="Berserker">Berserker</option>
                    <option value="Bladedancer">Bladedancer</option>
                    <option value="Chaos Weaver">Chaos Weaver</option>
                    <option value="Chronarch">Chronarch</option>
                    <option value="Covenbane">Covenbane</option>
                    <option value="Deathcaller">Deathcaller</option>
                    <option value="Dreadnaught">Dreadnaught</option>
                    <option value="Exorcist">Exorcist</option>
                    <option value="False Prophet">False Prophet</option>
                    <option value="Fate Weaver">Fate Weaver</option>
                    <option value="Formbender">Formbender</option>
                    <option value="Gambler">Gambler</option>
                    <option value="Huntress">Huntress</option>
                    <option value="Inscriptor">Inscriptor</option>
                    <option value="Lichborne">Lichborne</option>
                    <option value="Lunarch">Lunarch</option>
                    <option value="Martyr">Martyr</option>
                    <option value="Minstrel">Minstrel</option>
                    <option value="Oracle">Oracle</option>
                    <option value="Plaguebringer">Plaguebringer</option>
                    <option value="Primalist">Primalist</option>
                    <option value="Pyrofiend">Pyrofiend</option>
                    <option value="Spellguard">Spellguard</option>
                    <option value="Titan">Titan</option>
                    <option value="Toxicologist">Toxicologist</option>
                    <option value="Warden">Warden</option>
                    <option value="Witch Doctor">Witch Doctor</option>
                    <option value="Augur">Augur</option>
                    <option value="Doomsayer">Doomsayer</option>
                  </select>
                </div>
              </div>

              <div className="character-preview">
                <div className="preview-icon">
                  {classIcons[newCharacter.class]} {raceIcons[newCharacter.race]}
                </div>
                <p>{RACE_DATA[newCharacter.race]?.name || newCharacter.race} {newCharacter.class}</p>
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
