// Account dashboard - main account management page
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useCharacterStore from '../../store/characterStore';
import subscriptionService from '../../services/subscriptionService';
import { RACE_DATA } from '../../data/raceData';
import { getClassResourceConfig, initializeClassResource } from '../../data/classResources';
import RoomManager from './RoomManager';
import './styles/AccountDashboard.css';
import './styles/AccountDashboardIsolation.css';

const AccountDashboard = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, signOut, isDevelopmentBypass, disableDevelopmentBypass } = useAuthStore();
  const { characters, loadCharacters, currentCharacterId } = useCharacterStore();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('rooms');
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [characterLimitInfo, setCharacterLimitInfo] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        await loadCharacters();

        // Load subscription status and character limits
        const status = await subscriptionService.getSubscriptionStatus(user?.uid);
        setSubscriptionStatus(status);

        const limitInfo = await subscriptionService.canCreateCharacter(characters.length, user?.uid);
        setCharacterLimitInfo(limitInfo);
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadUserData();
    }
  }, [user, loadCharacters, characters.length]);

  // Handle navigation state to set active tab
  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

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

  const handleSelectCharacter = (characterId) => {
    // Toggle this character as active (don't navigate)
    const { setActiveCharacter } = useCharacterStore.getState();
    const character = setActiveCharacter(characterId);
    if (character) {
      console.log(`🎮 Selected character: ${character.name}`);
    } else {
      console.error(`❌ Failed to select character: ${characterId}`);
    }
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
          <button onClick={handleSignOut} className={`action-btn ${isDevelopmentBypass ? 'exit-preview-btn' : 'logout-btn'}`}>
            <i className={isDevelopmentBypass ? "fas fa-times-circle" : "fas fa-sign-out-alt"}></i>
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
                <div className="characters-header-left">
                  <h2>Character Management</h2>
                  {characterLimitInfo && (
                    <div className="character-limit-info">
                      <span className="character-count">
                        {characterLimitInfo.currentCount} / {characterLimitInfo.isUnlimited ? '∞' : characterLimitInfo.limit} characters
                      </span>
                      {subscriptionStatus && (
                        <span className="tier-badge">
                          {subscriptionStatus.tier.name}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <button
                  className={`create-character-btn ${characterLimitInfo && !characterLimitInfo.canCreate ? 'disabled' : ''}`}
                  onClick={handleCreateCharacter}
                  disabled={characterLimitInfo && !characterLimitInfo.canCreate}
                  title={characterLimitInfo && !characterLimitInfo.canCreate ?
                    `Character limit reached (${characterLimitInfo.limit}). Upgrade your membership to create more characters.` :
                    'Create a new character'
                  }
                >
                  <i className="fas fa-plus"></i>
                  Create Character
                </button>
              </div>

              {characters && characters.length > 0 ? (
                <div className="characters-grid-full">
                  {characters.map((character) => {
                    // Helper function to get ability modifier
                    const getModifier = (score) => {
                      return Math.floor((score - 10) / 2);
                    };

                    // Helper function to format modifier
                    const formatModifier = (modifier) => {
                      return modifier >= 0 ? `+${modifier}` : `${modifier}`;
                    };

                    // Helper function to get proper race display name
                    const getRaceDisplayName = (character) => {
                      if (character.raceDisplayName) {
                        return character.raceDisplayName;
                      }

                      // Look up proper subrace name from race data
                      if (character.subrace && character.race) {
                        const raceData = RACE_DATA[character.race];
                        if (raceData && raceData.subraces) {
                          // Find the subrace by ID
                          const subraceData = Object.values(raceData.subraces).find(sr => sr.id === character.subrace);
                          if (subraceData) {
                            return subraceData.name;
                          }
                        }
                        // Fallback to race name if subrace not found
                        return raceData ? raceData.name : character.race;
                      }

                      // Just race name
                      if (character.race) {
                        const raceData = RACE_DATA[character.race];
                        return raceData ? raceData.name : character.race;
                      }

                      return 'Unknown Race';
                    };

                    // Helper function to get class display name
                    const getClassDisplayName = (character) => {
                      return character.class || 'Adventurer';
                    };

                    // Helper function to get character image
                    const getCharacterImage = (character) => {
                      if (character.lore?.characterImage) {
                        return character.lore.characterImage;
                      }
                      if (character.image) {
                        return character.image;
                      }
                      return null;
                    };

                    // Get character stats with defaults
                    const stats = character.stats || {
                      strength: 10,
                      agility: 10,
                      constitution: 10,
                      intelligence: 10,
                      spirit: 10,
                      charisma: 10
                    };

                    const health = character.health || { current: 100, max: 100 };
                    const mana = character.mana || { current: 50, max: 50 };
                    const actionPoints = character.actionPoints || { current: 3, max: 3 };

                    return (
                      <div key={character.id} className={`character-card-compact ${currentCharacterId === character.id ? 'active-character' : ''}`}>
                        {/* Character Header - Reorganized Layout */}
                        <div className="character-header">
                          {/* Portrait and Resources Row */}
                          <div className="character-main-row">
                            {/* Portrait Section with Name Above */}
                            <div className="character-portrait-section">
                              <h3 className="character-name">{character.name}</h3>
                              <div className="character-portrait">
                                {getCharacterImage(character) ? (
                                  <img
                                    src={getCharacterImage(character)}
                                    alt={character.name}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'flex';
                                    }}
                                  />
                                ) : null}
                                <div
                                  className="default-portrait-icon"
                                  style={{ display: getCharacterImage(character) ? 'none' : 'flex' }}
                                >
                                  {character.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="character-level-badge">
                                  {character.level || 1}
                                </div>
                              </div>
                            </div>

                            {/* Resources Section with Class/Race Above */}
                            <div className="character-resources-section">
                              <div className="character-class-race">
                                <span className="race-tag">{getRaceDisplayName(character)}</span>
                                <span className="class-tag">{getClassDisplayName(character)}</span>
                              </div>
                              <div className="character-resources">
                              <div className="resource-bar-item health-resource">
                                <div className="resource-header">
                                  <span className="resource-label">HP</span>
                                  <span className="resource-value">{health.current}/{health.max}</span>
                                </div>
                                <div className="resource-bar-container">
                                  <div
                                    className="resource-bar-fill health-fill"
                                    style={{ width: `${(health.current / health.max) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="resource-bar-item mana-resource">
                                <div className="resource-header">
                                  <span className="resource-label">MP</span>
                                  <span className="resource-value">{mana.current}/{mana.max}</span>
                                </div>
                                <div className="resource-bar-container">
                                  <div
                                    className="resource-bar-fill mana-fill"
                                    style={{ width: `${(mana.current / mana.max) * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                              <div className="resource-bar-item action-resource">
                                <div className="resource-header">
                                  <span className="resource-label">AP</span>
                                  <span className="resource-value">{actionPoints.current}/{actionPoints.max}</span>
                                </div>
                                <div className="ap-dots-container">
                                  {Array.from({ length: actionPoints.max }, (_, i) => (
                                    <div
                                      key={i}
                                      className={`ap-dot ${i < actionPoints.current ? 'filled' : 'empty'}`}
                                    ></div>
                                  ))}
                                </div>
                              </div>

                              {/* Class Resource Bar */}
                              {(() => {
                                const className = getClassDisplayName(character);
                                const classConfig = getClassResourceConfig(className);
                                if (!classConfig) return null;

                                let classResource = character.classResource || initializeClassResource(className, stats);
                                if (!classResource) return null;

                                // Add some test values for demonstration
                                if (classResource.current === 0 && classResource.max > 0) {
                                  classResource = {
                                    ...classResource,
                                    current: Math.floor(classResource.max * 0.6) // 60% filled for demo
                                  };
                                }

                                // Check for special effects
                                const hasChaoticWave = classConfig.visual.effects?.includes('chaotic-wave');

                                // Debug logging
                                console.log('AccountDashboard ClassResource Debug:', {
                                  className,
                                  hasChaoticWave,
                                  effects: classConfig.visual.effects,
                                  activeColor: classConfig.visual.activeColor,
                                  baseColor: classConfig.visual.baseColor
                                });

                                return (
                                  <div className="resource-bar-item class-resource">
                                    <div className="resource-header">
                                      <span className="resource-label">{classConfig.shortName}</span>
                                      <span className="resource-value">{classResource.current}/{classResource.max}</span>
                                    </div>
                                    <div className="resource-bar-container class-resource-container">
                                      <div
                                        className={`resource-bar-fill class-resource-fill class-resource ${hasChaoticWave ? 'chaotic-wave-bar' : ''}`}
                                        data-effect={hasChaoticWave ? 'chaotic-wave' : undefined}
                                        style={{
                                          width: `${(classResource.current / classResource.max) * 100}%`,
                                          background: hasChaoticWave ? undefined : `linear-gradient(90deg, ${classConfig.visual.baseColor}, ${classConfig.visual.activeColor})`
                                        }}
                                      ></div>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                            </div>
                          </div>
                        </div>

                        {/* Character Stats - Two Rows for Better Visibility */}
                        <div className="character-stats">
                          <div className="stats-grid">
                            <div className="stat-box">
                              <span className="stat-name">STR</span>
                              <span className="stat-value">{stats.strength}</span>
                              <span className="stat-mod">{formatModifier(getModifier(stats.strength))}</span>
                            </div>
                            <div className="stat-box">
                              <span className="stat-name">AGI</span>
                              <span className="stat-value">{stats.agility}</span>
                              <span className="stat-mod">{formatModifier(getModifier(stats.agility))}</span>
                            </div>
                            <div className="stat-box">
                              <span className="stat-name">CON</span>
                              <span className="stat-value">{stats.constitution}</span>
                              <span className="stat-mod">{formatModifier(getModifier(stats.constitution))}</span>
                            </div>
                          </div>
                          <div className="stats-grid">
                            <div className="stat-box">
                              <span className="stat-name">INT</span>
                              <span className="stat-value">{stats.intelligence}</span>
                              <span className="stat-mod">{formatModifier(getModifier(stats.intelligence))}</span>
                            </div>
                            <div className="stat-box">
                              <span className="stat-name">SPI</span>
                              <span className="stat-value">{stats.spirit}</span>
                              <span className="stat-mod">{formatModifier(getModifier(stats.spirit))}</span>
                            </div>
                            <div className="stat-box">
                              <span className="stat-name">CHA</span>
                              <span className="stat-value">{stats.charisma}</span>
                              <span className="stat-mod">{formatModifier(getModifier(stats.charisma))}</span>
                            </div>
                          </div>
                        </div>

                        {/* Character Actions - Compact */}
                        <div className="character-actions">
                          <button
                            className={`action-btn ${currentCharacterId === character.id ? 'active-btn' : 'play-btn'}`}
                            onClick={() => handleSelectCharacter(character.id)}
                            title={currentCharacterId === character.id ? 'Active character' : 'Select this character as active'}
                          >
                            <i className={`fas ${currentCharacterId === character.id ? 'fa-check' : 'fa-play'}`}></i>
                            {currentCharacterId === character.id ? 'Active' : 'Select'}
                          </button>
                          <button
                            className="action-btn edit-btn"
                            onClick={() => navigate(`/account/characters/edit/${character.id}`)}
                            title="Edit character details"
                          >
                            <i className="fas fa-edit"></i>
                            Edit
                          </button>
                          <button
                            className="action-btn view-btn"
                            onClick={() => navigate(`/account/characters/view/${character.id}`)}
                            title="View full character sheet"
                          >
                            <i className="fas fa-eye"></i>
                            View
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="no-characters">
                  <div className="no-characters-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <h3>No Characters Yet</h3>
                  <p>Create your first character to begin your adventure in the world of Mythrill!</p>
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
