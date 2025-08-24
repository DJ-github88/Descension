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
              className={`fan-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <span>Overview</span>
            </button>
            <button
              className={`fan-tab ${activeTab === 'rooms' ? 'active' : ''}`}
              onClick={() => setActiveTab('rooms')}
            >
              <span>My Rooms</span>
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
        {activeTab === 'overview' && (
          <div className="overview-layout">
            {/* Hero Section */}
            <section className="hero-section">
              <div className="hero-content">
                <div className="hero-text">
                  <h1>Welcome to Your Adventure Hub</h1>
                  <p>Manage your characters, track your campaigns, and embark on epic journeys in the world of Mythrill.</p>
                  <div className="hero-actions">
                    <button
                      className="hero-btn primary"
                      onClick={() => setActiveTab('characters')}
                    >
                      <i className="fas fa-user-plus"></i>
                      Create Character
                    </button>
                    <button
                      className="hero-btn secondary"
                      onClick={() => setActiveTab('rooms')}
                    >
                      <i className="fas fa-dice-d20"></i>
                      Join Adventure
                    </button>
                  </div>
                </div>
                <div className="hero-visual">
                  <div className="adventure-compass">
                    <i className="fas fa-compass"></i>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats Overview */}
            <section className="stats-overview">
              <div className="stats-header">
                <h2>Your Adventure Statistics</h2>
                <p>Track your progress across the realms</p>
              </div>
              <div className="stats-grid-enhanced">
                <div className="stat-card characters">
                  <div className="stat-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="stat-info">
                    <span className="stat-number">{characters?.length || 0}</span>
                    <span className="stat-title">Characters Created</span>
                    <span className="stat-subtitle">Heroes ready for adventure</span>
                  </div>
                </div>
                <div className="stat-card campaigns">
                  <div className="stat-icon">
                    <i className="fas fa-map"></i>
                  </div>
                  <div className="stat-info">
                    <span className="stat-number">0</span>
                    <span className="stat-title">Campaigns Joined</span>
                    <span className="stat-subtitle">Epic stories in progress</span>
                  </div>
                </div>
                <div className="stat-card achievements">
                  <div className="stat-icon">
                    <i className="fas fa-trophy"></i>
                  </div>
                  <div className="stat-info">
                    <span className="stat-number">0</span>
                    <span className="stat-title">Achievements</span>
                    <span className="stat-subtitle">Legendary accomplishments</span>
                  </div>
                </div>
                <div className="stat-card playtime">
                  <div className="stat-icon">
                    <i className="fas fa-clock"></i>
                  </div>
                  <div className="stat-info">
                    <span className="stat-number">0h</span>
                    <span className="stat-title">Adventure Time</span>
                    <span className="stat-subtitle">Hours of epic gameplay</span>
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
