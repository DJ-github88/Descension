// Account dashboard - main account management page
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useCharacterStore from '../../store/characterStore';
import './styles/AccountDashboard.css';

const AccountDashboard = ({ user }) => {
  const navigate = useNavigate();
  const { userData, signOut } = useAuthStore();
  const { characters, loadCharacters } = useCharacterStore();
  const [isLoading, setIsLoading] = useState(true);

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
              <h1>Welcome back, {userData?.displayName || user?.displayName || 'Adventurer'}!</h1>
              <p className="user-email">{user?.email}</p>
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

      {/* Main Content */}
      <main className="account-main">
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
                        <p className="character-level">Level {character.level || 1}</p>
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
                  <p>Visit the Character Manager to create your first character!</p>
                </div>
              )}
              {characters && characters.length > 0 && (
                <div className="card-footer">
                  <button onClick={handleManageCharacters} className="btn btn-link">
                    Manage All Characters →
                  </button>
                </div>
              )}
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
      </main>
    </div>
  );
};

export default AccountDashboard;
