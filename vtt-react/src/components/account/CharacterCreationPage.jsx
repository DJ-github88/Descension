// Character creation page - wrapper for character creation with routing
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CharacterCreation from '../character-creation/CharacterCreation';
import useCharacterStore from '../../store/characterStore';
import useAuthStore from '../../store/authStore';
import './styles/CharacterCreationPage.css';

const CharacterCreationPage = ({ user }) => {
  const navigate = useNavigate();
  const { createCharacter } = useCharacterStore();
  const { userData } = useAuthStore();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState(null);

  const handleCharacterCreationComplete = async (characterData) => {
    setIsCreating(true);
    setError(null);

    try {
      // Add user ID and creation timestamp to character data
      const completeCharacterData = {
        ...characterData,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        level: 1,
        experience: 0,
        hitPoints: characterData.hitPoints || 100,
        maxHitPoints: characterData.maxHitPoints || 100,
        armorClass: characterData.armorClass || 10,
        // Add default stats if not provided
        stats: characterData.stats || {
          strength: 10,
          dexterity: 10,
          constitution: 10,
          intelligence: 10,
          wisdom: 10,
          charisma: 10
        },
        // Add empty inventory and equipment
        inventory: [],
        equipment: {
          weapon: null,
          armor: null,
          shield: null,
          accessories: []
        },
        // Add empty spells and abilities
        spells: [],
        abilities: [],
        // Add character preferences
        preferences: {
          theme: userData?.preferences?.theme || 'pathfinder',
          autoSave: true
        }
      };

      // Save character to store/database
      const savedCharacter = await createCharacter(completeCharacterData);
      
      console.log('Character created successfully:', savedCharacter);
      
      // Navigate to character management page
      navigate('/account/characters', { 
        state: { 
          message: `${characterData.name} has been created successfully!`,
          newCharacterId: savedCharacter.id 
        } 
      });
      
    } catch (error) {
      console.error('Error creating character:', error);
      setError('Failed to create character. Please try again.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleCharacterCreationCancel = () => {
    navigate('/account/characters');
  };

  return (
    <div className="character-creation-page">
      {/* Header */}
      <header className="page-header">
        <div className="header-content">
          <div className="header-title">
            <Link to="/account/characters" className="back-link">
              <i className="fas fa-arrow-left"></i>
            </Link>
            <h1>Create New Character</h1>
          </div>
          <div className="header-info">
            <span className="user-name">
              <i className="fas fa-user"></i>
              {userData?.displayName || user?.displayName || 'Adventurer'}
            </span>
          </div>
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="error-banner">
          <div className="error-content">
            <i className="fas fa-exclamation-triangle"></i>
            <span>{error}</span>
            <button onClick={() => setError(null)} className="error-close">
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isCreating && (
        <div className="creation-overlay">
          <div className="creation-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <p>Creating your character...</p>
          </div>
        </div>
      )}

      {/* Character Creation Component */}
      <main className="creation-main">
        <div className="creation-container">
          <CharacterCreation
            onComplete={handleCharacterCreationComplete}
            onCancel={handleCharacterCreationCancel}
            isLoading={isCreating}
          />
        </div>
      </main>

      {/* Help Section */}
      <aside className="creation-help">
        <div className="help-card">
          <h3>
            <i className="fas fa-question-circle"></i>
            Character Creation Tips
          </h3>
          <ul>
            <li>Choose a class that matches your preferred playstyle</li>
            <li>Consider your race's bonuses when selecting stats</li>
            <li>Your character name should be unique and memorable</li>
            <li>You can always edit your character later</li>
          </ul>
        </div>

        <div className="help-card">
          <h3>
            <i className="fas fa-info-circle"></i>
            Available Options
          </h3>
          <div className="help-stats">
            <div className="help-stat">
              <span className="stat-number">27</span>
              <span className="stat-label">Classes</span>
            </div>
            <div className="help-stat">
              <span className="stat-number">10</span>
              <span className="stat-label">Races</span>
            </div>
            <div className="help-stat">
              <span className="stat-number">25+</span>
              <span className="stat-label">Subraces</span>
            </div>
          </div>
        </div>

        <div className="help-card">
          <h3>
            <i className="fas fa-gamepad"></i>
            Quick Actions
          </h3>
          <div className="quick-actions">
            <Link to="/account" className="quick-action">
              <i className="fas fa-home"></i>
              Account Dashboard
            </Link>
            <Link to="/account/characters" className="quick-action">
              <i className="fas fa-users"></i>
              My Characters
            </Link>
            <Link to="/game" className="quick-action">
              <i className="fas fa-dice-d20"></i>
              Play Game
            </Link>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default CharacterCreationPage;
