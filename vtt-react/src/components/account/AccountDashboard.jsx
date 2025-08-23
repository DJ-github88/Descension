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
              <i className="fas fa-home"></i>
              Home
            </Link>
            <button onClick={handleSignOut} className="btn btn-outline">
              <i className="fas fa-sign-out-alt"></i>
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
          <i className="fas fa-home"></i>
          Overview
        </button>
        <button
          className={`tab-button ${activeTab === 'rooms' ? 'active' : ''}`}
          onClick={() => setActiveTab('rooms')}
        >
          <i className="fas fa-dungeon"></i>
          My Rooms
        </button>
        <button
          className={`tab-button ${activeTab === 'characters' ? 'active' : ''}`}
          onClick={() => setActiveTab('characters')}
        >
          <i className="fas fa-users"></i>
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
              <h2>
                <i className="fas fa-users"></i>
                Your Characters
              </h2>
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
                  <i className="fas fa-user-plus"></i>
                  <h3>No Characters Yet</h3>
                  <p>Create your first character to begin your adventure!</p>
                  <button onClick={handleCreateCharacter} className="btn btn-primary">
                    <i className="fas fa-plus"></i>
                    Create Character
                  </button>
                </div>
              )}
              <div className="card-footer">
                <div className="footer-actions">
                  {characters && characters.length > 0 && (
                    <>
                      <button onClick={handleCreateCharacter} className="btn btn-primary">
                        <i className="fas fa-plus"></i>
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
              <h2>
                <i className="fas fa-dice-d20"></i>
                Game Options
              </h2>
            </div>
            <div className="card-content">
              <div className="action-buttons">
                <Link to="/game" className="action-btn">
                  <i className="fas fa-dice-d20"></i>
                  <span>Single Player</span>
                </Link>
                <Link to="/multiplayer" className="action-btn">
                  <i className="fas fa-users"></i>
                  <span>Multiplayer</span>
                </Link>
                <Link to="/account/characters" className="action-btn">
                  <i className="fas fa-address-book"></i>
                  <span>Character Manager</span>
                </Link>
              </div>
            </div>
          </section>

          {/* Membership Info */}
          <section className="dashboard-card membership-card">
            <div className="card-header">
              <h2>
                <i className="fas fa-crown"></i>
                Membership
              </h2>
            </div>
            <div className="card-content">
              <div className="membership-info">
                <div className="membership-tier">
                  <div className="tier-badge">
                    <i className="fas fa-star"></i>
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
                    <li><i className="fas fa-check"></i> Unlimited characters</li>
                    <li><i className="fas fa-check"></i> Cloud synchronization</li>
                    <li><i className="fas fa-check"></i> Multiplayer access</li>
                    <li><i className="fas fa-check"></i> Character progression tracking</li>
                  </ul>
                </div>
                <div className="membership-since">
                  <p>
                    <i className="fas fa-calendar-alt"></i>
                    Member since {userData?.createdAt ?
                      new Date(userData.createdAt.seconds * 1000).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      }) :
                      new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long'
                      })
                    }
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Account Stats */}
          <section className="dashboard-card stats-card">
            <div className="card-header">
              <h2>
                <i className="fas fa-chart-bar"></i>
                Account Stats
              </h2>
            </div>
            <div className="card-content">
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-value">{characters?.length || 0}</div>
                  <div className="stat-label">Characters</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{userData?.gameData?.totalPlayTime || 0}h</div>
                  <div className="stat-label">Play Time</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{userData?.gameData?.achievements?.length || 0}</div>
                  <div className="stat-label">Achievements</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    {userData?.createdAt ? new Date(userData.createdAt.seconds * 1000).getFullYear() : new Date().getFullYear()}
                  </div>
                  <div className="stat-label">Member Since</div>
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
                  <i className="fas fa-plus"></i>
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
                          <i className="fas fa-edit"></i>
                          Edit
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-characters">
                  <i className="fas fa-user-plus"></i>
                  <h3>No Characters Yet</h3>
                  <p>Create your first character to begin your adventure!</p>
                  <button
                    className="create-first-character-btn"
                    onClick={handleCreateCharacter}
                  >
                    <i className="fas fa-plus"></i>
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
