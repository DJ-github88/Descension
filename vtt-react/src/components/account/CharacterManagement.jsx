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
        // Load characters and get the result
        const loadedCharacters = await loadCharacters();
        const currentCharacterCount = loadedCharacters?.length || characters.length || 0;

        // Load subscription status and character limits
        const status = await subscriptionService.getSubscriptionStatus(user?.uid);
        setSubscriptionStatus(status);

        // Use the loaded character count instead of stale characters.length
        const limitInfo = await subscriptionService.canCreateCharacter(currentCharacterCount, user?.uid);
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
    // Use current characters from store to ensure accurate count
    const currentCharacterCount = characters.length || 0;
    const limitInfo = await subscriptionService.canCreateCharacter(currentCharacterCount, user?.uid);

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

  const handlePlayCharacter = async (characterId) => {
    // Toggle this character as active (don't navigate)
    const character = await setActiveCharacter(characterId);
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
                  {/* Portrait Section - Centered */}
                  <div className="character-portrait-section">
                    <div className="character-portrait">
                      {character.image || character.lore?.characterImage ? (
                        <img src={character.image || character.lore?.characterImage} alt={character.name} />
                      ) : character.characterIcon || character.lore?.characterIcon ? (
                        <>
                          <img 
                            src={`https://wow.zamimg.com/images/wow/icons/large/${character.characterIcon || character.lore?.characterIcon}.jpg`} 
                            alt={character.name}
                            onError={(e) => {
                              e.target.style.display = 'none';
                              const fallbackDiv = e.target.parentElement.querySelector('.default-portrait-text');
                              if (fallbackDiv) fallbackDiv.style.display = 'flex';
                            }}
                          />
                          <div className="default-portrait-text" style={{ display: 'none' }}>
                            {character.name.charAt(0).toUpperCase()}
                          </div>
                        </>
                      ) : (
                        <div className="default-portrait-text">
                          {character.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="character-level">
                        {character.level || 1}
                      </div>
                    </div>

                    {/* Character Name Below Portrait */}
                    <div className="character-name-section">
                      <h3 className="character-name">{character.name}</h3>
                    </div>
                  </div>

                  {/* Character Info Section */}
                  <div className="character-header-info">
                    {/* Race, Class, and Icons Row */}
                    <div className="character-details-row">
                      <div className="character-race-class">
                        <div className="race-class-text">
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
                        <div className="character-class-icons">
                          <div className="race-icon" title={character.race}>
                            {getRaceIcon(character.race)}
                          </div>
                          <div className="class-icon" title={character.class}>
                            {getClassIcon(character.class)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Resource Bars */}
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

                  {/* Enhanced Combat & Secondary Stats */}
                  <div className="character-combat-stats">
                    <div className="combat-stat-group">
                      <div className="combat-stat">
                        <i className="fas fa-shield-alt"></i>
                        <span className="stat-label">Armor</span>
                        <span className="stat-value">{character.armor || 10}</span>
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

                  {/* Enhanced Character Details - Show more comprehensive info */}
                  <div className="character-enhanced-details">
                    {/* Derived Stats */}
                    <div className="character-derived-stats">
                      <div className="derived-stat">
                        <i className="fas fa-heartbeat"></i>
                        <span className="stat-label">Health Regen</span>
                        <span className="stat-value">{Math.floor(((character.stats?.constitution || character.constitution || 10) - 10) / 2) || 0}/turn</span>
                      </div>
                      <div className="derived-stat">
                        <i className="fas fa-magic"></i>
                        <span className="stat-label">Mana Regen</span>
                        <span className="stat-value">{Math.floor(((character.stats?.intelligence || character.intelligence || 10) + (character.stats?.spirit || character.spirit || 10)) / 4) || 0}/turn</span>
                      </div>
                      <div className="derived-stat">
                        <i className="fas fa-hand-holding-heart"></i>
                        <span className="stat-label">Healing Power</span>
                        <span className="stat-value">{Math.floor((character.stats?.spirit || character.spirit || 10) / 2) || 0}</span>
                      </div>
                    </div>

                    {/* Combat Capabilities */}
                    <div className="character-combat-capabilities">
                      <div className="capability-section">
                        <h5>Combat Stats</h5>
                        <div className="capability-grid">
                          <div className="capability">
                            <i className="fas fa-dungeon"></i>
                            <span>Damage: {Math.floor((character.stats?.strength || character.strength || 10) / 2) || 0}</span>
                          </div>
                          <div className="capability">
                            <i className="fas fa-bullseye"></i>
                            <span>Ranged: {Math.floor((character.stats?.agility || character.agility || 10) / 2) || 0}</span>
                          </div>
                          <div className="capability">
                            <i className="fas fa-shield"></i>
                            <span>Defense: {Math.floor((character.stats?.agility || character.agility || 10) / 2) || 0}</span>
                          </div>
                        </div>
                      </div>

                      {/* Inventory & Equipment Summary */}
                      {(character.equipment || character.inventory) && (
                        <div className="capability-section">
                          <h5>Equipment</h5>
                          <div className="equipment-summary">
                            {character.equipment && Object.keys(character.equipment).length > 0 && (
                              <div className="equipment-count">
                                <i className="fas fa-tshirt"></i>
                                <span>{Object.keys(character.equipment).length} equipped</span>
                              </div>
                            )}
                            {character.inventory && character.inventory.length > 0 && (
                              <div className="inventory-count">
                                <i className="fas fa-backpack"></i>
                                <span>{character.inventory.length} items</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Spells & Skills Summary */}
                      {(character.spells || character.skills) && (
                        <div className="capability-section">
                          <h5>Abilities</h5>
                          <div className="abilities-summary">
                            {character.spells && character.spells.length > 0 && (
                              <div className="spells-count">
                                <i className="fas fa-magic"></i>
                                <span>{character.spells.length} spells</span>
                              </div>
                            )}
                            {character.skills && Object.keys(character.skills).length > 0 && (
                              <div className="skills-count">
                                <i className="fas fa-tools"></i>
                                <span>{Object.keys(character.skills).length} skills</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
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
              <div className="delete-warning">
                <i className="fas fa-exclamation-triangle"></i>
                <h4>Delete Character</h4>
              </div>
              <p>Are you sure you want to delete <strong>{selectedCharacter.name}</strong>?</p>
              <p className="warning-text">
                <i className="fas fa-exclamation-circle"></i>
                This action cannot be undone. All character data, including equipment, inventory, and progress will be permanently lost.
              </p>
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
                className="btn btn-danger delete-confirm-btn"
              >
                <i className="fas fa-trash"></i>
                Yes, Delete Character
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CharacterManagement;
