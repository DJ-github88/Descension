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

            {/* Membership */}
            <section className="dashboard-card membership-card">
              <div className="card-header">
                <h2>Membership</h2>
              </div>
              <div className="card-content">
                <div className="membership-info">
                  <div className="membership-tier">
                    <div className="tier-badge">
                      <span>Free Adventurer</span>
                    </div>
                    <p className="tier-description">
                      Full access to all Mythrill features including character creation,
                      multiplayer rooms, and cloud save functionality.
                    </p>
                  </div>
                  <div className="membership-benefits">
                    <h4>Your Benefits:</h4>
                    <ul>
                      <li>Unlimited characters</li>
                      <li>Cloud synchronization</li>
                      <li>Multiplayer access</li>
                      <li>Character progression tracking</li>
                    </ul>
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
