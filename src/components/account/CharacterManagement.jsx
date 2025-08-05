// Character management page - view and manage all characters
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useCharacterStore from '../../store/characterStore';
import './styles/CharacterManagement.css';

const CharacterManagement = ({ user }) => {
  const navigate = useNavigate();
  const { characters, loadCharacters, deleteCharacter } = useCharacterStore();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [sortBy, setSortBy] = useState('name'); // 'name', 'class', 'level', 'created'
  const [filterClass, setFilterClass] = useState('all');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await loadCharacters();
      } catch (error) {
        console.error('Error loading characters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user, loadCharacters]);

  const handleCreateCharacter = () => {
    navigate('/account/characters/create');
  };

  const handleEditCharacter = (characterId) => {
    navigate(`/account/characters/edit/${characterId}`);
  };

  const handlePlayCharacter = (characterId) => {
    navigate('/game', { state: { characterId } });
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
              Create New Character
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
              <div key={character.id} className="character-card">
                <div className="character-portrait">
                  {character.image ? (
                    <img src={character.image} alt={character.name} />
                  ) : (
                    <i className="fas fa-user-circle"></i>
                  )}
                  <div className="character-level">
                    Lv. {character.level || 1}
                  </div>
                </div>
                
                <div className="character-info">
                  <h3 className="character-name">{character.name}</h3>
                  <p className="character-details">
                    {character.race} {character.class}
                  </p>
                  {character.subrace && (
                    <p className="character-subrace">{character.subrace}</p>
                  )}
                  <div className="character-stats">
                    <div className="stat">
                      <span className="stat-label">HP:</span>
                      <span className="stat-value">{character.hitPoints || 100}</span>
                    </div>
                    <div className="stat">
                      <span className="stat-label">AC:</span>
                      <span className="stat-value">{character.armorClass || 10}</span>
                    </div>
                  </div>
                </div>

                <div className="character-actions">
                  <button 
                    onClick={() => handlePlayCharacter(character.id)}
                    className="btn btn-primary btn-sm"
                    title="Play this character"
                  >
                    <i className="fas fa-play"></i>
                    Play
                  </button>
                  <button 
                    onClick={() => handleEditCharacter(character.id)}
                    className="btn btn-secondary btn-sm"
                    title="Edit character"
                  >
                    <i className="fas fa-edit"></i>
                    Edit
                  </button>
                  <button 
                    onClick={() => confirmDelete(character)}
                    className="btn btn-danger btn-sm"
                    title="Delete character"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </div>

                {character.createdAt && (
                  <div className="character-meta">
                    <small>Created: {new Date(character.createdAt).toLocaleDateString()}</small>
                  </div>
                )}
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
