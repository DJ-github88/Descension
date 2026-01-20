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
import { ensurePlaceholderCharacters } from '../../utils/createPlaceholderCharacters';
import RoomManager from './RoomManager';
import CampaignManager from './CampaignManager';
import AccountJournalManager from './AccountJournalManager';
import ProfileEditModal from './ProfileEditModal';
// Note: canAccessCampaignManager is available for future access control:
// import CampaignManager, { canAccessCampaignManager, CAMPAIGN_ACCESS_CONFIG } from './CampaignManager';
import ClassResourceBar from '../hud/ClassResourceBar';
import './styles/AccountDashboard.css';
import './styles/AccountDashboardIsolation.css';
import './styles/RoomManager.css'; // Import existing modal styles

const AccountDashboard = ({ user }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, signOut, isDevelopmentBypass, disableDevelopmentBypass } = useAuthStore();
  const { characters, loadCharacters, currentCharacterId, deleteCharacter } = useCharacterStore();
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isProfileEditOpen, setIsProfileEditOpen] = useState(false);

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

  const handleCreatePlaceholderCharacters = async () => {
    try {
      const created = await ensurePlaceholderCharacters();
      if (created && created.length > 0) {
        // Reload characters to show the new ones
        await loadCharacters();
        console.log(`✅ Created ${created.length} placeholder character(s) for testing!`);
        // Show success feedback without alert
        const btn = document.querySelector('[title*="placeholder characters"]');
        if (btn) {
          const originalText = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-check"></i> Created!';
          btn.style.backgroundColor = '#4CAF50';
          setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.backgroundColor = '';
          }, 2000);
        }
      } else {
        console.log('ℹ️ Placeholder characters already exist or could not be created.');
      }
    } catch (error) {
      console.error('Error creating placeholder characters:', error);
      // Show error feedback without alert
      const btn = document.querySelector('[title*="placeholder characters"]');
      if (btn) {
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-times"></i> Error!';
        btn.style.backgroundColor = '#F44336';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.backgroundColor = '';
        }, 2000);
      }
    }
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
    <div className="account-dashboard-container">
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
                <img src={userData?.photoURL || user?.photoURL} alt="Account" />
              ) : (
                <i className="fas fa-user-circle"></i>
              )}
              <div className="avatar-edit-hint">
                <i className="fas fa-pen"></i>
              </div>
            </div>
            <div className="account-welcome">
              <p className="user-display-name">{userData?.displayName || user?.displayName || 'Adventurer'}</p>
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
              {/* Campaign Manager Tab - Always shown for now, access control ready for future */}
              <button
                className={`fan-tab ${activeTab === 'campaigns' ? 'active' : ''}`}
                onClick={() => setActiveTab('campaigns')}
              >
                <span>Campaigns</span>
              </button>
              {/* Journal Tab - Player's knowledge organization */}
              <button
                className={`fan-tab ${activeTab === 'journal' ? 'active' : ''}`}
                onClick={() => setActiveTab('journal')}
              >
                <span>Journal</span>
              </button>
            </div>
          </nav>

          {/* Right: Action Buttons */}
          <div className="header-actions-new">
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
                        `Character limit reached (${characterLimitInfo.limit}). Upgrade your membership to create more characters.` :
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
                        // Use stored raceDisplayName if available and valid
                        if (character.raceDisplayName && character.raceDisplayName !== 'Unknown Race' && character.raceDisplayName !== 'Unknown') {
                          return character.raceDisplayName;
                        }

                        // Look up proper subrace name from race data
                        if (character.subrace && character.race) {
                          const raceData = RACE_DATA[character.race];
                          if (raceData && raceData.subraces) {
                            // Find the subrace by ID - check both object keys and subrace.id
                            let subraceData = null;
                            // First try finding by ID in values
                            subraceData = Object.values(raceData.subraces).find(sr => sr.id === character.subrace);
                            // If not found, try finding by object key
                            if (!subraceData && raceData.subraces[character.subrace]) {
                              subraceData = raceData.subraces[character.subrace];
                            }
                            // Also try finding by key that matches subrace ID pattern
                            if (!subraceData) {
                              for (const [key, subraceObj] of Object.entries(raceData.subraces)) {
                                if (subraceObj.id === character.subrace || key === character.subrace) {
                                  subraceData = subraceObj;
                                  break;
                                }
                              }
                            }
                            if (subraceData && subraceData.name) {
                              return subraceData.name; // Return subrace name (e.g., "Bloodhammer")
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
                        // Check for characterIcon and convert to URL (check root level first, then lore)
                        if (character.characterIcon) {
                          return getWowIconUrl(character.characterIcon);
                        }
                        if (character.lore?.characterIcon) {
                          return getWowIconUrl(character.lore.characterIcon);
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

                      // Calculate correct health and mana values
                      const calculatedResources = calculateCharacterResources(character);
                      const health = calculatedResources.health;
                      const mana = calculatedResources.mana;
                      const actionPoints = character.actionPoints || character.resources?.actionPoints || { current: 3, max: 3 };

                      return (
                        <div key={character.id} className={`character-card-compact ${currentCharacterId === character.id ? 'active-character' : ''}`}>
                          {/* Character Header - Reorganized Layout */}
                          <div className="character-header">
                            {/* Header Top: Name, Tags, and Portrait (portrait on right) */}
                            <div className="character-header-top">
                              <div className="character-name-tags-section">
                                <h3 className="character-name">{character.name}</h3>
                                <div className="character-class-race">
                                  <span className="race-tag">{getRaceDisplayName(character)}</span>
                                  <span className="class-tag">{getClassDisplayName(character)}</span>
                                </div>
                              </div>
                              <div className="character-portrait-section">
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
                                </div>
                              </div>
                            </div>
                            {/* Resources Section - Full Width */}
                            <div className="character-resources-section">
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
                                  <div className="resource-bar-container">
                                    <div
                                      className="resource-bar-fill ap-fill"
                                      style={{ width: `${(actionPoints.current / actionPoints.max) * 100}%` }}
                                    ></div>
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

                                  return (
                                    <div className="resource-bar-item class-resource-full">
                                      <ClassResourceBar
                                        characterClass={className}
                                        classResource={classResource}
                                        size="normal"
                                        isGMMode={false}
                                        context="account"
                                      />
                                    </div>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>

                          {/* Character Stats - Clean Single Row */}
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

                          {/* Character Actions - Clean Icon Bar */}
                          <div className="character-actions-bar">
                            <button
                              className={`action-icon-btn ${currentCharacterId === character.id ? 'active' : 'select'}`}
                              onClick={() => handleSelectCharacter(character.id)}
                              title={currentCharacterId === character.id ? 'Currently active' : 'Set as active character'}
                            >
                              <i className={`fas ${currentCharacterId === character.id ? 'fa-check-circle' : 'fa-circle'}`}></i>
                              <span>{currentCharacterId === character.id ? 'Active' : 'Select'}</span>
                            </button>
                            <div className="action-divider"></div>
                            <button
                              className="action-icon-btn edit"
                              onClick={() => navigate(`/account/characters/edit/${character.id}`)}
                              title="Edit character"
                            >
                              <i className="fas fa-pen"></i>
                            </button>
                            <button
                              className="action-icon-btn view"
                              onClick={() => navigate(`/account/characters/view/${character.id}`)}
                              title="View character sheet"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button
                              className="action-icon-btn delete"
                              onClick={() => handleDeleteCharacter(character)}
                              title="Delete character"
                            >
                              <i className="fas fa-trash-alt"></i>
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
                      className="create-character-btn create-placeholder-btn"
                      onClick={handleCreatePlaceholderCharacters}
                      title="Create placeholder characters for testing (with all data filled out)"
                    >
                      <i className="fas fa-magic"></i>
                      Create Placeholder Characters
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
        </main>

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && selectedCharacter && (
          <div className="modal-overlay">
            <div className="delete-confirm-modal">
              <h3>Delete Character</h3>
              <p>Are you sure you want to delete <strong>{selectedCharacter.name}</strong>?</p>
              <p className="warning-text">This action cannot be undone. All character data will be permanently lost.</p>
              <div className="modal-actions">
                <button
                  className="confirm-delete-btn"
                  onClick={confirmDeleteCharacter}
                >
                  <i className="fas fa-trash"></i>
                  Delete
                </button>
                <button
                  className="cancel-btn"
                  onClick={cancelDeleteCharacter}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <ProfileEditModal
        isOpen={isProfileEditOpen}
        onClose={() => setIsProfileEditOpen(false)}
      />
    </div>
  );
};

export default AccountDashboard;
