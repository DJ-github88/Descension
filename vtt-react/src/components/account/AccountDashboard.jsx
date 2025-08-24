// Account dashboard - main account management page
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useCharacterStore from '../../store/characterStore';
import RoomManager from './RoomManager';
import './styles/AccountDashboard.css';

const AccountDashboard = ({ user }) => {
  const navigate = useNavigate();
  const { userData, signOut, isDevelopmentBypass, disableDevelopmentBypass } = useAuthStore();
  const { characters, loadCharacters } = useCharacterStore();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('rooms');

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        await loadCharacters();
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadUserData();
    }
  }, [user, loadCharacters]);

  const handleSignOut = async () => {
    if (isDevelopmentBypass) {
      disableDevelopmentBypass();
    } else {
      await signOut();
    }
    navigate('/');
  };

  const handleManageCharacters = () => {
    navigate('/account/characters');
  };

  const handleCreateCharacter = () => {
    navigate('/account/characters/create');
  };

  const handleEnterGame = (characterId) => {
    // Set active character and navigate to game
    navigate('/game', { state: { characterId } });
  };

  if (isLoading) {
    return (
      <div className="account-dashboard loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="account-dashboard">
      {/* New Header Layout */}
      <header className="account-header-new">
        {/* Left: Account Icon */}
        <div className="account-icon-section">
          <div className="account-avatar-large">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Account" />
            ) : (
              <i className="fas fa-user-circle"></i>
            )}
          </div>
          <div className="account-welcome">
            <h2>Welcome to Mythrill!</h2>
            <div className="user-info-with-badge">
              <p>{user?.displayName || 'Adventurer'}</p>
              <span className="membership-tag">
                <i className="fas fa-crown"></i>
                Free Adventurer
              </span>
            </div>
            {isDevelopmentBypass && (
              <div className="dev-mode-badge">
                <i className="fas fa-code"></i>
                Preview Mode
              </div>
            )}
          </div>
        </div>

        {/* Center: Fan-style Tab Navigation */}
        <nav className="fan-tabs">
          <div className="fan-container">
            <button
              className={`fan-tab ${activeTab === 'rooms' ? 'active' : ''}`}
              onClick={() => setActiveTab('rooms')}
            >
              <span>Rooms</span>
            </button>
            <button
              className={`fan-tab ${activeTab === 'characters' ? 'active' : ''}`}
              onClick={() => setActiveTab('characters')}
            >
              <span>Characters</span>
            </button>
          </div>
        </nav>

        {/* Right: Action Buttons */}
        <div className="header-actions-new">
          <Link to="/" className="action-btn home-btn">
            <i className="fas fa-home"></i>
            <span>Home</span>
          </Link>
          <button onClick={handleSignOut} className="action-btn logout-btn">
            <i className={isDevelopmentBypass ? "fas fa-times" : "fas fa-sign-out-alt"}></i>
            <span>{isDevelopmentBypass ? 'Exit Preview' : 'Sign Out'}</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="account-main">
        {activeTab === 'rooms' && (
          <div className="tab-content">
            <RoomManager />
          </div>
        )}



        {activeTab === 'characters' && (
          <div className="tab-content">
            <div className="characters-full-view">
              <div className="characters-header">
                <h2>Character Management</h2>
                <button
                  className="create-character-btn"
                  onClick={handleCreateCharacter}
                >
                  Create Character
                </button>
              </div>

              {characters && characters.length > 0 ? (
                <div className="characters-grid-full">
                  {characters.map((character) => (
                    <div key={character.id} className="character-card-full">
                      <div className="character-card-header">
                        <div className="character-portrait">
                          {character.image ? (
                            <img src={character.image} alt={character.name} />
                          ) : (
                            <i className="fas fa-user-circle"></i>
                          )}
                        </div>
                        <div className="character-header-info">
                          <div className="character-details">
                            <h3>{character.name}</h3>
                            <p>{character.race} {character.class}</p>
                          </div>
                        </div>
                      </div>
                      <div className="character-card-body">
                        <div className="character-stats">
                          <div className="stat-item">
                            <span className="stat-label">Level</span>
                            <span className="stat-value">{character.level || 1}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Hit Points</span>
                            <span className="stat-value">{character.hitPoints || 100}</span>
                          </div>
                        </div>
                        <div className="character-actions">
                          <button
                            className="edit-btn"
                            onClick={() => navigate(`/account/characters/edit/${character.id}`)}
                          >
                            <i className="fas fa-edit"></i>
                            Edit Character
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-characters">
                  <h3>No Characters Yet</h3>
                  <p>Create your first character to begin your adventure!</p>
                  <button
                    className="create-first-character-btn"
                    onClick={handleCreateCharacter}
                  >
                    Create Your First Character
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AccountDashboard;
