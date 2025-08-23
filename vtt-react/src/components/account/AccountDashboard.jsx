// Account dashboard - main account management page
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useCharacterStore from '../../store/characterStore';
import RoomManager from './RoomManager';
import './styles/AccountDashboard.css';

const AccountDashboard = ({ user }) => {
  const navigate = useNavigate();
  const { userData, signOut } = useAuthStore();
  const { characters, loadCharacters } = useCharacterStore();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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
    await signOut();
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
      {/* Header */}
      <header className="account-header">
        <div className="header-content">
          <div className="user-info">
            <div className="user-avatar">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" />
              ) : (
                <i className="fas fa-user-circle"></i>
              )}
            </div>
            <div className="user-details">
              <h1>Welcome to Mythrill!</h1>
              <p className="user-email">Your Adventure Awaits</p>
            </div>
          </div>
          <div className="header-actions">
            <Link to="/" className="btn btn-secondary">
              Home
            </Link>
            <button onClick={handleSignOut} className="btn btn-outline">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation */}
      <nav className="account-tabs">
        <button
          className={`tab-button ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'rooms' ? 'active' : ''}`}
          onClick={() => setActiveTab('rooms')}
        >
          My Rooms
        </button>
        <button
          className={`tab-button ${activeTab === 'characters' ? 'active' : ''}`}
          onClick={() => setActiveTab('characters')}
        >
          Characters
        </button>
      </nav>

      {/* Main Content */}
      <main className="account-main">
        {activeTab === 'overview' && (
          <div className="dashboard-grid">
          {/* Characters Section */}
          <section className="dashboard-card characters-card">
            <div className="card-header">
              <h2>Your Characters</h2>
            </div>
            <div className="card-content">
              {characters && characters.length > 0 ? (
                <div className="characters-grid">
                  {characters.slice(0, 3).map((character) => (
                    <div key={character.id} className="character-preview">
                      <div className="character-portrait">
                        {character.image ? (
                          <img src={character.image} alt={character.name} />
                        ) : (
                          <i className="fas fa-user-circle"></i>
                        )}
                      </div>
                      <div className="character-info">
                        <h3>{character.name}</h3>
                        <p>{character.race} {character.class}</p>
                      </div>
                      <div className="character-actions">
                        <button
                          onClick={() => handleEnterGame(character.id)}
                          className="btn btn-sm btn-primary"
                        >
                          Play
                        </button>
                      </div>
                    </div>
                  ))}
                  {characters.length > 3 && (
                    <div className="character-preview more-characters">
                      <div className="more-content">
                        <i className="fas fa-ellipsis-h"></i>
                        <p>+{characters.length - 3} more</p>
                        <button onClick={handleManageCharacters} className="btn btn-sm">
                          View All
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="empty-state">
                  <h3>No Characters Yet</h3>
                  <p>Create your first character to begin your adventure!</p>
                  <button onClick={handleCreateCharacter} className="btn btn-primary">
                    Create Character
                  </button>
                </div>
              )}
              <div className="card-footer">
                <div className="footer-actions">
                  {characters && characters.length > 0 && (
                    <>
                      <button onClick={handleCreateCharacter} className="btn btn-primary">
                        Create Character
                      </button>
                      <button onClick={handleManageCharacters} className="btn btn-link">
                        Manage All Characters →
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Game Actions */}
          <section className="dashboard-card game-actions-card">
            <div className="card-header">
              <h2>Game Options</h2>
            </div>
            <div className="card-content">
              <div className="action-buttons">
                <Link to="/game" className="action-btn">
                  <span>Single Player</span>
                </Link>
                <Link to="/multiplayer" className="action-btn">
                  <span>Multiplayer</span>
                </Link>
                <Link to="/account/characters" className="action-btn">
                  <span>Character Manager</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Account Stats */}
          <section className="dashboard-card stats-card">
            <div className="card-header">
              <h2>Account Stats</h2>
            </div>
            <div className="card-content">
              <div className="stats-grid">
                <div className="stat-item">
                  <span className="stat-value">{characters?.length || 0}</span>
                  <span className="stat-label">Characters</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">0</span>
                  <span className="stat-label">Play Time</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">0</span>
                  <span className="stat-label">Achievements</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">2025</span>
                  <span className="stat-label">Member Since</span>
                </div>
              </div>
            </div>
          </section>
        </div>
        )}

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
                      <div className="character-portrait">
                        {character.image ? (
                          <img src={character.image} alt={character.name} />
                        ) : (
                          <i className="fas fa-user-circle"></i>
                        )}
                      </div>
                      <div className="character-details">
                        <h3>{character.name}</h3>
                        <p>{character.race} {character.class}</p>
                        <div className="character-stats">
                          <span>Level {character.level || 1}</span>
                          <span>HP: {character.hitPoints || 100}</span>
                        </div>
                      </div>
                      <div className="character-actions">
                        <button
                          className="edit-btn"
                          onClick={() => navigate(`/account/characters/edit/${character.id}`)}
                        >
                          Edit
                        </button>
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
