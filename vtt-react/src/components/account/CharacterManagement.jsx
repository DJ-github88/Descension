// Character management page - view and manage all characters
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCharacterStore from '../../store/characterStore';
import subscriptionService from '../../services/subscriptionService';
import { RACE_DATA } from '../../data/raceData';
import './styles/CharacterManagement.css';

const CharacterManagement = ({ user }) => {
  const navigate = useNavigate();
  const { characters, loadCharacters, deleteCharacter, setActiveCharacter, getActiveCharacter, currentCharacterId } = useCharacterStore();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sortBy, setSortBy] = useState('name'); // 'name', 'class', 'level', 'created'
  const [filterClass, setFilterClass] = useState('all');
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [characterLimitInfo, setCharacterLimitInfo] = useState(null);

  // Helper functions for icons
  const getRaceIcon = (race) => {
    const raceIcons = {
      'Human': 'H', 'Elf': 'E', 'Dwarf': 'D', 'Halfling': 'H',
      'Dragonborn': 'Dr', 'Gnome': 'G', 'Half-Elf': 'HE', 'Half-Orc': 'HO',
      'Tiefling': 'T', 'Aasimar': 'A'
    };
    return raceIcons[race] || 'H';
  };

  const getClassIcon = (characterClass) => {
    const classIcons = {
      'Fighter': 'F', 'Wizard': 'W', 'Rogue': 'R', 'Cleric': 'C',
      'Ranger': 'Ra', 'Paladin': 'P', 'Barbarian': 'B', 'Bard': 'Bd',
      'Druid': 'Dr', 'Monk': 'M', 'Sorcerer': 'S', 'Warlock': 'Wl'
    };
    return classIcons[characterClass] || 'F';
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await loadCharacters();

        // Load subscription status and character limits
        const status = await subscriptionService.getSubscriptionStatus(user?.uid);
        setSubscriptionStatus(status);

        const limitInfo = await subscriptionService.canCreateCharacter(characters.length, user?.uid);
        setCharacterLimitInfo(limitInfo);
      } catch (error) {
        console.error('Error loading characters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user, loadCharacters, characters.length]);

  const handleCreateCharacter = async () => {
    // Check character limits before allowing creation
    const limitInfo = await subscriptionService.canCreateCharacter(characters.length, user?.uid);

    if (!limitInfo.canCreate) {
      const tierName = limitInfo.tierName;
      const limit = limitInfo.limit;
      const isUnlimited = limitInfo.isUnlimited;

      if (isUnlimited) {
        // This shouldn't happen with unlimited, but just in case
        navigate('/account/characters/create');
        return;
      }

      alert(`Character limit reached!\n\nYour ${tierName} membership allows ${limit} character${limit === 1 ? '' : 's'}.\nYou currently have ${limitInfo.currentCount} character${limitInfo.currentCount === 1 ? '' : 's'}.\n\nUpgrade your membership to create more characters.`);
      return;
    }

    navigate('/account/characters/create');
  };

  const handleEditCharacter = (characterId) => {
    navigate(`/account/characters/edit/${characterId}`);
  };

  const handlePlayCharacter = (characterId) => {
    // Toggle this character as active (don't navigate)
    const character = setActiveCharacter(characterId);
    if (character) {
      console.log(`🎮 Selected character: ${character.name}`);
    } else {
      console.error(`❌ Failed to select character: ${characterId}`);
    }
  };

  const handleDeleteCharacter = async () => {
    if (selectedCharacter) {
      try {
        await deleteCharacter(selectedCharacter.id);
        setShowDeleteConfirm(false);
        setSelectedCharacter(null);
      } catch (error) {
        console.error('Error deleting character:', error);
      }
    }
  };

  const confirmDelete = (character) => {
    setSelectedCharacter(character);
    setShowDeleteConfirm(true);
  };

  // Filter and sort characters
  const filteredAndSortedCharacters = characters
    ?.filter(char => filterClass === 'all' || char.class === filterClass)
    ?.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'class':
          return a.class.localeCompare(b.class);
        case 'level':
          return (b.level || 1) - (a.level || 1);
        case 'created':
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        default:
          return 0;
      }
    }) || [];

  // Get unique classes for filter
  const availableClasses = [...new Set(characters?.map(char => char.class) || [])];

  if (isLoading) {
    return (
      <div className="character-management loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading your characters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="character-management">
      {/* Header */}
      <header className="page-header">
        <div className="header-content">
          <div className="header-title">
            <Link to="/account" className="back-link">
              <i className="fas fa-arrow-left"></i>
            </Link>
            <h1>Character Management</h1>
          </div>
          <div className="header-actions">
            <button onClick={handleCreateCharacter} className="btn btn-primary">
              <i className="fas fa-plus"></i>
              Create Character
            </button>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="character-controls">
        <div className="controls-left">
          <div className="sort-control">
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Name</option>
              <option value="class">Class</option>
              <option value="level">Level</option>
              <option value="created">Date Created</option>
            </select>
          </div>
          <div className="filter-control">
            <label>Filter by class:</label>
            <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)}>
              <option value="all">All Classes</option>
              {availableClasses.map(className => (
                <option key={className} value={className}>{className}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="controls-right">
          <span className="character-count">
            {filteredAndSortedCharacters.length} character{filteredAndSortedCharacters.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Characters Grid */}
      <main className="characters-main">
        {filteredAndSortedCharacters.length > 0 ? (
          <div className="characters-grid">
            {filteredAndSortedCharacters.map((character) => (
              <div key={character.id} className={`character-card ${currentCharacterId === character.id ? 'active-character' : ''}`}>
                {/* Character Header */}
                <div className="character-card-header">
                  <div className="character-portrait">
                    {character.image || character.lore?.characterImage ? (
                      <img src={character.image || character.lore?.characterImage} alt={character.name} />
                    ) : (
                      <div className="default-portrait-text">
                        {character.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="character-level">
                      {character.level || 1}
                    </div>
                  </div>

                  <div className="character-header-info">
                    {/* Top Row: Name and Class Icons */}
                    <div className="character-name-row">
                      <div className="character-name-section">
                        <h3 className="character-name">{character.name}</h3>
                      </div>
                      <div className="character-class-icons">
                        <div className="race-icon" title={character.race}>
                          {getRaceIcon(character.race)}
                        </div>
                        <div className="class-icon" title={character.class}>
                          {getClassIcon(character.class)}
                        </div>
                      </div>
                    </div>

                    {/* Middle Row: Race, Subrace, and Class */}
                    <div className="character-details-row">
                      <div className="character-race-class">
                        <span className="race-text">
                          {(() => {
                            // Get proper race display name
                            if (character.raceDisplayName) {
                              return character.raceDisplayName;
                            }

                            if (character.subrace && character.race) {
                              const raceData = RACE_DATA[character.race];
                              if (raceData && raceData.subraces) {
                                const subraceData = Object.values(raceData.subraces).find(sr => sr.id === character.subrace);
                                if (subraceData) {
                                  return subraceData.name;
                                }
                              }
                              return raceData ? raceData.name : character.race;
                            }

                            if (character.race) {
                              const raceData = RACE_DATA[character.race];
                              return raceData ? raceData.name : character.race;
                            }

                            return 'Unknown Race';
                          })()}
                        </span>
                        <span className="class-text">{character.class}</span>
                      </div>
                    </div>

                    {/* Bottom Row: Resource Bars */}
                    <div className="character-resources-row">
                      <div className="resource-bar health-bar">
                        <div className="resource-label">
                          <i className="fas fa-heart"></i>
                          <span>HP</span>
                        </div>
                        <div className="resource-value">{character.hitPoints || 100}/{character.maxHitPoints || 100}</div>
                      </div>
                      <div className="resource-bar mana-bar">
                        <div className="resource-label">
                          <i className="fas fa-tint"></i>
                          <span>MP</span>
                        </div>
                        <div className="resource-value">{character.mana || 50}/{character.maxMana || 50}</div>
                      </div>
                      <div className="resource-bar action-bar">
                        <div className="resource-label">
                          <i className="fas fa-zap"></i>
                          <span>AP</span>
                        </div>
                        <div className="resource-value">{character.actionPoints || 3}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Character Body */}
                <div className="character-card-body">
                  {/* Primary Resources - Most Important Info */}
                  <div className="character-resources">
                    <div className="resource-bar">
                      <div className="resource-label">
                        <i className="fas fa-heart"></i>
                        <span>Health</span>
                      </div>
                      <div className="resource-value">
                        <span className="current">{character.currentHealth || character.maxHealth || 100}</span>
                        <span className="separator">/</span>
                        <span className="max">{character.maxHealth || 100}</span>
                      </div>
                    </div>
                    <div className="resource-bar">
                      <div className="resource-label">
                        <i className="fas fa-magic"></i>
                        <span>Mana</span>
                      </div>
                      <div className="resource-value">
                        <span className="current">{character.currentMana || character.maxMana || 50}</span>
                        <span className="separator">/</span>
                        <span className="max">{character.maxMana || 50}</span>
                      </div>
                    </div>
                    <div className="resource-bar">
                      <div className="resource-label">
                        <i className="fas fa-zap"></i>
                        <span>Action Points</span>
                      </div>
                      <div className="resource-value">
                        <span className="current">{character.actionPoints || 3}</span>
                      </div>
                    </div>
                  </div>

                  {/* Ability Scores - Two Rows for Better Visibility */}
                  <div className="character-abilities-compact">
                    <div className="abilities-grid-compact">
                      {[
                        { key: 'strength', name: 'STR', icon: 'fas fa-fist-raised' },
                        { key: 'agility', name: 'AGI', icon: 'fas fa-running' },
                        { key: 'constitution', name: 'CON', icon: 'fas fa-heart' }
                      ].map(ability => {
                        const score = character.stats?.[ability.key] || character[ability.key] || 10;
                        const modifier = Math.floor((score - 10) / 2);
                        return (
                          <div key={ability.key} className="ability-score">
                            <div className="ability-name">{ability.name}</div>
                            <div className="ability-value">{score}</div>
                            <div className="ability-modifier">
                              {modifier >= 0 ? '+' : ''}{modifier}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="abilities-grid-compact">
                      {[
                        { key: 'intelligence', name: 'INT', icon: 'fas fa-brain' },
                        { key: 'spirit', name: 'SPI', icon: 'fas fa-dove' },
                        { key: 'charisma', name: 'CHA', icon: 'fas fa-comments' }
                      ].map(ability => {
                        const score = character.stats?.[ability.key] || character[ability.key] || 10;
                        const modifier = Math.floor((score - 10) / 2);
                        return (
                          <div key={ability.key} className="ability-score">
                            <div className="ability-name">{ability.name}</div>
                            <div className="ability-value">{score}</div>
                            <div className="ability-modifier">
                              {modifier >= 0 ? '+' : ''}{modifier}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Combat & Secondary Stats */}
                  <div className="character-combat-stats">
                    <div className="combat-stat-group">
                      <div className="combat-stat">
                        <i className="fas fa-shield-alt"></i>
                        <span className="stat-label">AC</span>
                        <span className="stat-value">{character.armorClass || 10}</span>
                      </div>
                      <div className="combat-stat">
                        <i className="fas fa-running"></i>
                        <span className="stat-label">Speed</span>
                        <span className="stat-value">{character.speed || 30}ft</span>
                      </div>
                      <div className="combat-stat">
                        <i className="fas fa-star"></i>
                        <span className="stat-label">XP</span>
                        <span className="stat-value">{character.experience || 0}</span>
                      </div>
                    </div>
                    <div className="combat-stat-group">
                      <div className="combat-stat">
                        <i className="fas fa-coins"></i>
                        <span className="stat-label">Gold</span>
                        <span className="stat-value">{character.gold || 0}</span>
                      </div>
                      <div className="combat-stat">
                        <i className="fas fa-dice-d20"></i>
                        <span className="stat-label">Initiative</span>
                        <span className="stat-value">{character.initiative || Math.floor(((character.stats?.agility || character.agility || 10) - 10) / 2)}</span>
                      </div>
                      <div className="combat-stat">
                        <i className="fas fa-eye"></i>
                        <span className="stat-label">Perception</span>
                        <span className="stat-value">{character.perception || Math.floor(((character.stats?.spirit || character.spirit || 10) - 10) / 2)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Equipment & Background - Condensed */}
                  <div className="character-extras">
                    {character.background && (
                      <div className="character-background">
                        <i className="fas fa-scroll"></i>
                        <span>{character.background}</span>
                      </div>
                    )}
                    {(character.equippedWeapon || character.equippedArmor) && (
                      <div className="character-equipment-preview">
                        {character.equippedWeapon && (
                          <div className="equipment-item">
                            <i className="fas fa-sword"></i>
                            <span>{character.equippedWeapon.name}</span>
                          </div>
                        )}
                        {character.equippedArmor && (
                          <div className="equipment-item">
                            <i className="fas fa-shield-alt"></i>
                            <span>{character.equippedArmor.name}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Character Actions */}
                  <div className="character-actions">
                    <button
                      onClick={() => handlePlayCharacter(character.id)}
                      className={`btn ${currentCharacterId === character.id ? 'btn-success' : 'btn-primary'}`}
                      title={currentCharacterId === character.id ? 'Active character' : 'Select this character'}
                    >
                      <i className={`fas ${currentCharacterId === character.id ? 'fa-check' : 'fa-play'}`}></i>
                      {currentCharacterId === character.id ? 'Active' : 'Select'}
                    </button>
                    <button
                      onClick={() => handleEditCharacter(character.id)}
                      className="btn btn-secondary"
                      title="Edit character"
                    >
                      <i className="fas fa-edit"></i>
                      Edit
                    </button>
                    <button
                      onClick={() => confirmDelete(character)}
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
          </div>
        ) : (
          <div className="empty-state">
            <i className="fas fa-user-plus"></i>
            <h3>
              {filterClass === 'all' ? 'No Characters Yet' : `No ${filterClass} Characters`}
            </h3>
            <p>
              {filterClass === 'all' 
                ? 'Create your first character to begin your adventure!'
                : `You don't have any ${filterClass} characters yet.`
              }
            </p>
            <button onClick={handleCreateCharacter} className="btn btn-primary">
              <i className="fas fa-plus"></i>
              Create New Character
            </button>
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && selectedCharacter && (
        <div className="modal-overlay">
          <div className="modal delete-confirm-modal">
            <div className="modal-header">
              <h3>Delete Character</h3>
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="modal-close"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-body">
              <p>Are you sure you want to delete <strong>{selectedCharacter.name}</strong>?</p>
              <p className="warning-text">This action cannot be undone.</p>
            </div>
            <div className="modal-footer">
              <button 
                onClick={() => setShowDeleteConfirm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteCharacter}
                className="btn btn-danger"
              >
                <i className="fas fa-trash"></i>
                Delete Character
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterManagement;
