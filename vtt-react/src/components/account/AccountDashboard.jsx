// Account dashboard - main account management page
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useCharacterStore from '../../store/characterStore';
import subscriptionService from '../../services/subscriptionService';
import { RACE_DATA } from '../../data/raceData';
import { getClassResourceConfig, initializeClassResource } from '../../data/classResources';
import { calculateDerivedStats, calculateEquipmentBonuses } from '../../utils/characterUtils';
import { applyRacialModifiers } from '../../data/raceData';
import { getWowIconUrl } from '../../utils/assetManager';
import RoomManager from './RoomManager';
import CampaignManager from './CampaignManager';
import AccountJournalManager from './AccountJournalManager';
import ProfileEditModal from './ProfileEditModal';
// Note: canAccessCampaignManager is available for future access control:
// import CampaignManager, { canAccessCampaignManager, CAMPAIGN_ACCESS_CONFIG } from './CampaignManager';
import ClassResourceBar from '../hud/ClassResourceBar';
import usePresenceStore from '../../store/presenceStore';
import useSocialStore from '../../store/socialStore';
import AccountSocialManager from './AccountSocialManager';
import './styles/AccountDashboard.css';
import './styles/AccountDashboardIsolation.css';
import './styles/RoomManager.css'; // Import existing modal styles

const AccountDashboard = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, signOut, isDevelopmentBypass, disableDevelopmentBypass } = useAuthStore();
  const { characters, loadCharacters, currentCharacterId, deleteCharacter } = useCharacterStore();
  const {
    initialize: initializeSocial,
    setFriends,
    pendingRequests,
    activeTab: socialTab,
    acceptFriendRequest,
    declineFriendRequest
  } = useSocialStore();
  const { initializePresence } = usePresenceStore();
  const [isLoading, setIsLoading] = useState(true);

  // Ensure proper body class for account pages (fixes styling issues after leaving game)
  useEffect(() => {
    document.body.classList.remove('game-mode');
    document.body.classList.add('landing-mode');

    return () => {
      // Cleanup handled by other components on navigation
    };
  }, []);

  // Initialize social listeners and presence tracking
  useEffect(() => {
    if (user?.uid) {
      console.log('🔄 Initializing social store for user:', user.uid);
      const unsubscribe = initializeSocial(user.uid);

      // Mark user as online in dashboard
      // Use userData if available, otherwise fallback to basic user info
      const characterData = {
        name: userData?.displayName || user.displayName || user.email?.split('@')[0] || 'Adventurer',
        photoURL: userData?.photoURL || user.photoURL || null
      };

      initializePresence(
        user.uid,
        characterData,
        { sessionType: 'dashboard' },
        userData?.displayName || user.displayName,
        user.isGuest,
        userData?.friendId
      ).then(() => {
        console.log('✅ Presence initialized for dashboard');
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user?.uid, userData, initializeSocial, initializePresence]);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const receivedRequests = (pendingRequests || []).filter(r => r.type === 'received' && r.status === 'pending');

  // Debug: Log all character data on component mount
  useEffect(() => {
    if (characters.length > 0) {
      console.log('🔍 All character data:', characters.map(char => ({
        name: char.name,
        stats: char.stats,
        health: char.health,
        mana: char.mana,
        resources: char.resources,
        rawData: char
      })));
    }
  }, [characters]);
  const isGuest = user?.isGuest || false;
  const [activeTab, setActiveTab] = useState('rooms');
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [characterLimitInfo, setCharacterLimitInfo] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      setIsLoading(true);
      try {
        // Load characters and get the result
        const loadedCharacters = await loadCharacters();
        const currentCharacterCount = loadedCharacters?.length || characters.length || 0;

        // Load subscription status and character limits (works for both guest and authenticated users)
        const status = await subscriptionService.getSubscriptionStatus(user?.uid);
        setSubscriptionStatus(status);

        // Use the loaded character count instead of stale characters.length
        const limitInfo = await subscriptionService.canCreateCharacter(currentCharacterCount, user?.uid);
        setCharacterLimitInfo(limitInfo);

        console.log('📊 Account Dashboard loaded:', {
          isGuest: user?.isGuest,
          tier: status?.tier?.name,
          characterLimit: limitInfo?.limit,
          currentCharacters: currentCharacterCount
        });
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

  const handleSelectCharacter = async (characterId) => {
    // Toggle this character as active (don't navigate)
    const { setActiveCharacter } = useCharacterStore.getState();
    const character = await setActiveCharacter(characterId);
    if (character) {
      console.log(`🎮 Selected character: ${character.name}`);
    } else {
      console.error(`❌ Failed to select character: ${characterId}`);
    }
  };

  const handleDeleteCharacter = (character) => {
    setSelectedCharacter(character);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteCharacter = async () => {
    if (!selectedCharacter) return;

    try {
      await deleteCharacter(selectedCharacter.id);
      console.log(`✅ Character deleted: ${selectedCharacter.name}`);

      // Reload characters to update the display
      await loadCharacters();

      // Close modal
      setShowDeleteConfirm(false);
      setSelectedCharacter(null);
    } catch (error) {
      console.error('❌ Failed to delete character:', error);
      alert(`Failed to delete character: ${error.message}`);
      setShowDeleteConfirm(false);
      setSelectedCharacter(null);
    }
  };

  const cancelDeleteCharacter = () => {
    setShowDeleteConfirm(false);
    setSelectedCharacter(null);
  };

  // Calculate correct health and mana values for a character
  const calculateCharacterResources = (character) => {
    if (!character || !character.stats) {
      return {
        health: { current: 100, max: 100 },
        mana: { current: 50, max: 50 }
      };
    }

    // If this is the current character, use the character store's calculated values
    if (character.id === currentCharacterId) {
      const { health, mana, derivedStats } = useCharacterStore.getState();

      // Use the character store's values if they exist and are properly calculated
      if (derivedStats && derivedStats.maxHealth && derivedStats.maxMana) {
        return {
          health: {
            current: health.current,
            max: Math.round(derivedStats.maxHealth)
          },
          mana: {
            current: mana.current,
            max: Math.round(derivedStats.maxMana)
          }
        };
      }
    }

    // For non-current characters or if store values aren't available, calculate manually
    // Apply racial modifiers to get effective stats
    const effectiveStats = character.race && character.subrace
      ? applyRacialModifiers(character.stats, character.race, character.subrace)
      : character.stats;

    // Calculate equipment bonuses
    const equipmentBonuses = calculateEquipmentBonuses(character.equipment || {});

    // Apply equipment bonuses to stats
    const totalStats = { ...effectiveStats };
    const statMapping = {
      str: 'strength',
      con: 'constitution',
      agi: 'agility',
      int: 'intelligence',
      spir: 'spirit',
      cha: 'charisma'
    };

    Object.entries(statMapping).forEach(([shortName, fullName]) => {
      if (equipmentBonuses[shortName]) {
        totalStats[fullName] = (totalStats[fullName] || 0) + equipmentBonuses[shortName];
      }
    });

    // Get encumbrance state
    const encumbranceState = character.inventory?.encumbranceState || 'normal';

    // Calculate derived stats
    const exhaustionLevel = character.exhaustionLevel || 0;
    const derivedStats = calculateDerivedStats(totalStats, equipmentBonuses, {}, encumbranceState, exhaustionLevel);

    // Calculate correct max values
    const maxHealth = Math.round(derivedStats.maxHealth);
    const maxMana = Math.round(derivedStats.maxMana);

    // Use stored current values but ensure they don't exceed new max values
    const storedHealth = character.health || character.resources?.health || { current: maxHealth, max: maxHealth };
    const storedMana = character.mana || character.resources?.mana || { current: maxMana, max: maxMana };

    // Debug logging for character resource calculation (temporary)
    if (character.name === 'YAD') {
      console.log('🔍 AccountDashboard character resource calculation:', {
        characterName: character.name,
        constitution: character.stats?.constitution,
        intelligence: character.stats?.intelligence,
        storedHealth,
        storedMana,
        calculatedMaxHealth: maxHealth,
        calculatedMaxMana: maxMana,
        finalHealth: {
          current: Math.min(storedHealth.current || maxHealth, maxHealth),
          max: maxHealth
        },
        finalMana: {
          current: Math.min(storedMana.current || maxMana, maxMana),
          max: maxMana
        }
      });
    }

    return {
      health: {
        current: Math.min(storedHealth.current || maxHealth, maxHealth),
        max: maxHealth
      },
      mana: {
        current: Math.min(storedMana.current || maxMana, maxMana),
        max: maxMana
      }
    };
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
    <div className="account-dashboard-container account-dashboard-page">
      {user?.isGuest && (
        <div className="guest-tooltip">
          <i className="fas fa-info-circle"></i>
          Guest Mode - Your progress won't be saved after logout
        </div>
      )}
      <div className="account-dashboard">
        {/* New Header Layout */}
        <header className="account-header-new">
          {/* Left: Account Icon */}
          <div
            className="account-icon-section clickable"
            onClick={() => setIsProfileEditOpen(true)}
            title="Edit Profile"
          >
            <div className="account-avatar-large">
              {userData?.photoURL || user?.photoURL ? (
                <img src={userData?.photoURL || user?.photoURL} alt="Account" width="50" height="50" />
              ) : (
                <i className="fas fa-user-circle"></i>
              )}
              <div className="avatar-edit-hint">
                <i className="fas fa-pen"></i>
              </div>
            </div>
            <div className="account-welcome">
              <div className="user-name-wrapper">
                <p className="user-display-name">{userData?.displayName || user?.displayName || 'Adventurer'}</p>
                {(userData?.friendId || user?.friendId) && (
                  <span className="user-account-id">#{userData?.friendId || user?.friendId}</span>
                )}
              </div>
              <span className="edit-link">Edit Profile</span>
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
              {/* Campaign Manager Tab - Hidden for guests */}
              {!isGuest && (
                <button
                  className={`fan-tab ${activeTab === 'campaigns' ? 'active' : ''}`}
                  onClick={() => setActiveTab('campaigns')}
                >
                  <span>Campaigns</span>
                </button>
              )}
              {/* Journal Tab - Hidden for guests */}
              {!isGuest && (
                <button
                  className={`fan-tab ${activeTab === 'journal' ? 'active' : ''}`}
                  onClick={() => setActiveTab('journal')}
                >
                  <span>Journal</span>
                </button>
              )}
              {/* Social Tab - Hidden for guests; interact via Community window instead */}
              {!isGuest && (
                <button
                  className={`fan-tab ${activeTab === 'social' ? 'active' : ''}`}
                  onClick={() => setActiveTab('social')}
                >
                  <span>Social</span>
                </button>
              )}
            </div>
          </nav>

          {/* Right: Action Buttons */}
          <div className="header-actions-new">
            {/* Notification Bell */}
            <div className="notification-wrapper">
              <button
                className={`notification-btn ${receivedRequests.length > 0 ? 'has-notifications' : ''}`}
                onClick={() => setShowNotifications(!showNotifications)}
                title="Friend Requests"
              >
                <i className="fas fa-bell"></i>
                {receivedRequests.length > 0 && (
                  <span className="notification-count">{receivedRequests.length}</span>
                )}
              </button>

              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="notification-header">
                    <h3>Friend Requests</h3>
                    <button onClick={() => setShowNotifications(false)}>&times;</button>
                  </div>
                  <div className="notification-list">
                    {receivedRequests.length === 0 ? (
                      <p className="no-notifications">No pending requests</p>
                    ) : (
                      receivedRequests.map(request => (
                        <div key={request.id} className="request-item">
                          <div className="request-info">
                            <span className="request-name">{request.senderName || 'Unknown User'}</span>
                            <span className="request-id">#{request.senderFriendId}</span>
                          </div>
                          <div className="request-actions">
                            <button
                              className="confirm-btn"
                              onClick={() => acceptFriendRequest(request.id)}
                            >
                              Confirm
                            </button>
                            <button
                              className="decline-btn"
                              onClick={() => declineFriendRequest(request.id)}
                            >
                              Decline
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log('AccountDashboard: Home button clicked - navigating to /');
                navigate('/', { replace: false });
              }}
              className="action-btn home-btn"
            >
              <i className="fas fa-home"></i>
              <span>Home</span>
            </button>
            <button onClick={handleSignOut} className="action-btn logout-btn">
              <i className="fas fa-sign-out-alt"></i>
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        {/* Guest Info Banner */}
        {isGuest && (
          <div className="guest-info-banner">
            <div className="guest-banner-icon">
              <i className="fas fa-user-secret"></i>
            </div>
            <div className="guest-banner-content">
              <h4>Playing as Guest</h4>
              <p>
                You can create rooms, build characters, and chat with other players via the{' '}
                <strong>Community</strong> window (the globe icon). To access Campaigns, Journal,
                and Social features — <button className="guest-signup-link" onClick={() => { window.location.href = '/'; }}>create a free account</button>.
              </p>
            </div>
          </div>
        )}

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
                  <div className="characters-header-actions">
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
                    <button
                      className={`create-character-btn ${characterLimitInfo && !characterLimitInfo.canCreate ? 'disabled' : ''}`}
                      onClick={handleCreateCharacter}
                      disabled={characterLimitInfo && !characterLimitInfo.canCreate}
                      title={characterLimitInfo && !characterLimitInfo.canCreate ?
                        `Character limit reached(${characterLimitInfo.limit}).Upgrade your membership to create more characters.` :
                        'Create a new character'
                      }
                    >
                      <i className="fas fa-plus"></i>
                      Create Character
                    </button>
                  </div>
                </div>

                {characters && characters.length > 0 ? (
                  <div className="characters-grid-full">
                    {characters.map((character) => {
                      const getModifier = (score) => Math.floor((score - 10) / 2);
                      const formatModifier = (modifier) => modifier >= 0 ? `+${modifier}` : `${modifier}`;
                      const getCharacterImage = (char) => {
                        if (char.lore?.characterImage) return char.lore.characterImage;
                        if (char.image) return char.image;
                        if (char.characterIcon) return getWowIconUrl(char.characterIcon);
                        if (char.lore?.characterIcon) return getWowIconUrl(char.lore.characterIcon);
                        return null;
                      };

                      const stats = character.stats || {
                        strength: 10, agility: 10, constitution: 10,
                        intelligence: 10, spirit: 10, charisma: 10
                      };

                      const { health, mana } = calculateCharacterResources(character);
                      const actionPoints = character.actionPoints || character.resources?.actionPoints || { current: 3, max: 3 };

                      return (
                        <div key={character.id} className={`character-card-compact ${currentCharacterId === character.id ? 'active-character' : ''}`}>
                          <div className="character-header">
                            <div className="character-header-top">
                              <div className="character-name-tags-section">
                                <h3 className="character-name">{character.name}</h3>
                                <div className="character-class-race">
                                  <span className="race-tag">{character.raceDisplayName || character.race || 'Unknown Race'}</span>
                                  <span className="class-tag">{character.class || 'Adventurer'}</span>
                                </div>
                              </div>
                              <div className="character-portrait-section">
                                <div className="character-portrait">
                                  {getCharacterImage(character) ? (
                                    <img src={getCharacterImage(character)} alt={character.name} width="65" height="65" />
                                  ) : (
                                    <div className="default-portrait-icon">{character.name.charAt(0).toUpperCase()}</div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="character-resources-section">
                              <div className="character-resources">
                                <div className="resource-bar-item health-resource">
                                  <div className="resource-header">
                                    <span className="resource-label">HP</span>
                                    <span className="resource-value">{health.current}/{health.max}</span>
                                  </div>
                                  <div className="resource-bar-container">
                                    <div className="resource-bar-fill health-fill" style={{ width: `${(health.current / health.max) * 100}%` }}></div>
                                  </div>
                                </div>
                                <div className="resource-bar-item mana-resource">
                                  <div className="resource-header">
                                    <span className="resource-label">MP</span>
                                    <span className="resource-value">{mana.current}/{mana.max}</span>
                                  </div>
                                  <div className="resource-bar-container">
                                    <div className="resource-bar-fill mana-fill" style={{ width: `${(mana.current / mana.max) * 100}%` }}></div>
                                  </div>
                                </div>
                                <div className="resource-bar-item action-resource">
                                  <div className="resource-header">
                                    <span className="resource-label">AP</span>
                                    <span className="resource-value">{actionPoints.current}/{actionPoints.max}</span>
                                  </div>
                                  <div className="resource-bar-container">
                                    <div className="resource-bar-fill ap-fill" style={{ width: `${(actionPoints.current / actionPoints.max) * 100}%` }}></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="character-stats-row">
                            {[
                              { key: 'strength', abbr: 'STR' },
                              { key: 'agility', abbr: 'AGI' },
                              { key: 'constitution', abbr: 'CON' },
                              { key: 'intelligence', abbr: 'INT' },
                              { key: 'spirit', abbr: 'SPI' },
                              { key: 'charisma', abbr: 'CHA' }
                            ].map(stat => (
                              <div key={stat.key} className="stat-pill">
                                <span className="stat-abbr">{stat.abbr}</span>
                                <span className="stat-score">{stats[stat.key]}</span>
                                <span className="stat-modifier">{formatModifier(getModifier(stats[stat.key]))}</span>
                              </div>
                            ))}
                          </div>

                          <div className="character-actions-bar">
                            <button
                              className={`action-icon-btn ${currentCharacterId === character.id ? 'active' : 'select'}`}
                              onClick={() => handleSelectCharacter(character.id)}
                            >
                              <i className={`fas ${currentCharacterId === character.id ? 'fa-check-circle' : 'fa-circle'}`}></i>
                              <span>{currentCharacterId === character.id ? 'Active' : 'Select'}</span>
                            </button>
                            <div className="action-divider"></div>
                            <button className="action-icon-btn edit" onClick={() => navigate(`/account/characters/edit/${character.id}`)}>
                              <i className="fas fa-pen"></i>
                            </button>
                            <button className="action-icon-btn view" onClick={() => navigate(`/account/characters/view/${character.id}`)}>
                              <i className="fas fa-eye"></i>
                            </button>
                            <button className="action-icon-btn delete" onClick={() => handleDeleteCharacter(character)}>
                              <i className="fas fa-trash-alt"></i>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="no-characters">
                    <div className="no-characters-icon"><i className="fas fa-users"></i></div>
                    <h3>No Characters Yet</h3>
                    <p>Create your first character to begin your adventure!</p>
                    <button className="create-character-btn" onClick={handleCreateCharacter}>
                      <i className="fas fa-plus"></i>
                      Create Your First Character
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div className="tab-content">
              <CampaignManager user={user} />
            </div>
          )}

          {activeTab === 'journal' && (
            <div className="tab-content">
              <AccountJournalManager user={user} />
            </div>
          )}

          {activeTab === 'social' && (
            <div className="tab-content">
              <AccountSocialManager />
            </div>
          )}
        </main>

        {showDeleteConfirm && selectedCharacter && (
          <div className="modal-overlay">
            <div className="delete-confirm-modal">
              <h3>Delete Character</h3>
              <p>Are you sure you want to delete <strong>{selectedCharacter.name}</strong>?</p>
              <p className="warning-text">This action cannot be undone. All character data will be permanently lost.</p>
              <div className="modal-actions">
                <button className="confirm-delete-btn" onClick={confirmDeleteCharacter}>
                  <i className="fas fa-trash"></i>
                  Delete
                </button>
                <button className="cancel-btn" onClick={cancelDeleteCharacter}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ProfileEditModal isOpen={isProfileEditOpen} onClose={() => setIsProfileEditOpen(false)} />
    </div>
  );
};

export default AccountDashboard;
