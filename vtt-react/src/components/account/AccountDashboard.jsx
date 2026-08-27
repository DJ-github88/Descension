import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import useCharacterStore from '../../store/characterStore';
import subscriptionService, { SUBSCRIPTION_TIERS, TIER_ORDER, isCampaignManagerTier } from '../../services/subscriptionService';
import { calculateDerivedStats, calculateEquipmentBonuses } from '../../utils/characterUtils';
import { applyRacialModifiers } from '../../data/raceData';
import { getWowIconUrl, getCustomIconUrl } from '../../utils/assetManager';
import RoomManager from './RoomManager';
import CampaignManager from './CampaignManager';
import AccountJournalManager from './AccountJournalManager';
import ProfileEditModal from './ProfileEditModal';

import usePresenceStore from '../../store/presenceStore';
import useSocialStore from '../../store/socialStore';
import { useIsPhone } from '../../hooks/useIsPhone';
import AccountSocialManager from './AccountSocialManager';
import AccountMapManager from './AccountMapManager';
import WorldDashboard from '../world/WorldDashboard';
import StorageUsageWidget from './StorageUsageWidget';
import BookManager from '../books/BookManager';
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

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setMobileMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu on navigation
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Support location state tab changes and cross-app navigation events
  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  useEffect(() => {
    const handleNavJournal = () => setActiveTab('journal');
    const handleNavCampaign = () => setActiveTab('campaigns');
    const handleNavWorld = () => setActiveTab('maps');
    const handleNavBooks = () => setActiveTab('books');

    window.addEventListener('mythrill_navigate_journal', handleNavJournal);
    window.addEventListener('mythrill_navigate_campaign', handleNavCampaign);
    window.addEventListener('mythrill_open_world_dossier', handleNavWorld);
    window.addEventListener('mythrill_navigate_books', handleNavBooks);

    return () => {
      window.removeEventListener('mythrill_navigate_journal', handleNavJournal);
      window.removeEventListener('mythrill_navigate_campaign', handleNavCampaign);
      window.removeEventListener('mythrill_open_world_dossier', handleNavWorld);
      window.removeEventListener('mythrill_navigate_books', handleNavBooks);
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showAccountDeleteConfirm, setShowAccountDeleteConfirm] = useState(false);
  const [accountDeleteText, setAccountDeleteText] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);

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
  const isPhone = useIsPhone();
  // Phones default to Characters — Rooms leads into the desktop-only VTT grid.
  const [activeTab, setActiveTab] = useState(() => (isPhone ? 'characters' : 'rooms'));
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [characterLimitInfo, setCharacterLimitInfo] = useState(null);

  // Character Management Search, Filter & Sort State
  const [characterSearchQuery, setCharacterSearchQuery] = useState('');
  const [characterClassFilter, setCharacterClassFilter] = useState('all');
  const [characterSortBy, setCharacterSortBy] = useState('name'); // 'name', 'level', 'recent'

  const availableClasses = useMemo(() => {
    return Array.from(new Set((characters || []).map(c => c.class).filter(Boolean)));
  }, [characters]);

  const filteredCharacters = useMemo(() => {
    return (characters || [])
      .filter(char => {
        if (!char) return false;
        const q = characterSearchQuery.trim().toLowerCase();
        const matchesSearch = !q ||
          char.name?.toLowerCase().includes(q) ||
          char.class?.toLowerCase().includes(q) ||
          (char.raceDisplayName || char.race || '')?.toLowerCase().includes(q);
        const matchesClass = characterClassFilter === 'all' || char.class === characterClassFilter;
        return matchesSearch && matchesClass;
      })
      .sort((a, b) => {
        if (characterSortBy === 'name') {
          return (a.name || '').localeCompare(b.name || '');
        }
        if (characterSortBy === 'level') {
          return (b.level || 1) - (a.level || 1);
        }
        if (characterSortBy === 'recent') {
          return new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0);
        }
        return 0;
      });
  }, [characters, characterSearchQuery, characterClassFilter, characterSortBy]);

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

  const handleDeleteAccount = async () => {
    if (accountDeleteText !== 'DELETE') return;
    if (isGuest) return;
    setIsDeletingAccount(true);
    try {
      const persistenceService = (await import('../../services/firebase/persistenceService')).default;
      if (persistenceService?.deleteAllUserData) {
        await persistenceService.deleteAllUserData(user.uid);
      }
      const { deleteUser } = await import('firebase/auth');
      const { auth } = await import('../../config/firebase');
      if (auth?.currentUser) {
        await deleteUser(auth.currentUser);
      }
      await signOut();
      navigate('/', { replace: true });
    } catch (error) {
      if (error.code === 'auth/requires-recent-login') {
        alert('For security, please sign out and sign back in before deleting your account.');
      } else {
        alert(`Failed to delete account: ${error.message}`);
      }
    } finally {
      setIsDeletingAccount(false);
      setShowAccountDeleteConfirm(false);
      setAccountDeleteText('');
    }
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
              {!isGuest && (
                <button
                  className={`fan-tab ${activeTab === 'campaigns' ? 'active' : ''}`}
                  onClick={() => setActiveTab('campaigns')}
                >
                  <span>Campaigns</span>
                </button>
              )}
              {!isGuest && (
                <button
                  className={`fan-tab ${activeTab === 'journal' ? 'active' : ''}`}
                  onClick={() => setActiveTab('journal')}
                >
                  <span>Journal</span>
                </button>
              )}
              {!isGuest && (
                <button
                  className={`fan-tab ${activeTab === 'social' ? 'active' : ''}`}
                  onClick={() => setActiveTab('social')}
                >
                  <span>Social</span>
                </button>
              )}
              {!isGuest && (
                <button
                  className={`fan-tab ${activeTab === 'maps' ? 'active' : ''}`}
                  onClick={() => setActiveTab('maps')}
                >
                  <span>World</span>
                </button>
              )}
              {!isGuest && (
                <button
                  className={`fan-tab ${activeTab === 'books' ? 'active' : ''}`}
                  onClick={() => setActiveTab('books')}
                >
                  <span>Books</span>
                </button>
              )}
              <button
                className={`fan-tab ${activeTab === 'membership' ? 'active' : ''}`}
                onClick={() => setActiveTab('membership')}
              >
                <span>Membership</span>
              </button>
            </div>
          </nav>

          {/* Right: Action Buttons */}
          <div className="header-actions-new">
            {/* Quick Switcher Command Palette Trigger */}
            <button
              className="quick-search-trigger-btn"
              onClick={() => window.dispatchEvent(new CustomEvent('mythrill_toggle_quick_switcher'))}
              title="Universal Search & Command Palette (Ctrl+K)"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                color: '#d4af37',
                padding: '6px 12px',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: 600,
                transition: 'all 0.15s ease'
              }}
            >
              <i className="fas fa-search"></i>
              <span>Search (Ctrl+K)</span>
            </button>

            {/* Storage Cloud */}
            <StorageUsageWidget cloud={true} />

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

            {!isGuest && subscriptionStatus?.canUpgrade && (
              <button
                className="action-btn upgrade-plan-btn"
                onClick={() => setActiveTab('membership')}
                title="Upgrade your membership"
              >
                <i className="fas fa-crown"></i>
                <span>Upgrade</span>
              </button>
            )}

            <button
              onClick={() => navigate('/')}
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

          <button
            className={`account-mobile-hamburger ${mobileMenuOpen ? 'open' : ''}`}
            onClick={() => setMobileMenuOpen(prev => !prev)}
            aria-label="Menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </header>

        <div className={`account-mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
          <nav className="account-mobile-nav">
            <button
              className={`account-mobile-nav-item ${activeTab === 'rooms' ? 'active' : ''}`}
              onClick={() => { setActiveTab('rooms'); setMobileMenuOpen(false); }}
            >
              <i className="fas fa-door-open"></i>
              Rooms
            </button>
            <button
              className={`account-mobile-nav-item ${activeTab === 'characters' ? 'active' : ''}`}
              onClick={() => { setActiveTab('characters'); setMobileMenuOpen(false); }}
            >
              <i className="fas fa-user-friends"></i>
              Characters
            </button>
            {!isGuest && (
              <button
                className={`account-mobile-nav-item ${activeTab === 'campaigns' ? 'active' : ''}`}
                onClick={() => { setActiveTab('campaigns'); setMobileMenuOpen(false); }}
              >
                <i className="fas fa-map"></i>
                Campaigns
              </button>
            )}
            {!isGuest && (
              <button
                className={`account-mobile-nav-item ${activeTab === 'journal' ? 'active' : ''}`}
                onClick={() => { setActiveTab('journal'); setMobileMenuOpen(false); }}
              >
                <i className="fas fa-book"></i>
                Journal
              </button>
            )}
            {!isGuest && (
              <button
                className={`account-mobile-nav-item ${activeTab === 'social' ? 'active' : ''}`}
                onClick={() => { setActiveTab('social'); setMobileMenuOpen(false); }}
              >
                <i className="fas fa-heart"></i>
                Social
              </button>
            )}
            {!isGuest && (
              <button
                className={`account-mobile-nav-item ${activeTab === 'maps' ? 'active' : ''}`}
                onClick={() => { setActiveTab('maps'); setMobileMenuOpen(false); }}
              >
                <i className="fas fa-atlas"></i>
                World
              </button>
            )}
            {!isGuest && (
              <button
                className={`account-mobile-nav-item ${activeTab === 'books' ? 'active' : ''}`}
                onClick={() => { setActiveTab('books'); setMobileMenuOpen(false); }}
              >
                <i className="fas fa-book-bookmark"></i>
                Books
              </button>
            )}
            <button
              className={`account-mobile-nav-item ${activeTab === 'membership' ? 'active' : ''}`}
              onClick={() => { setActiveTab('membership'); setMobileMenuOpen(false); }}
            >
              <i className="fas fa-star"></i>
              Membership
            </button>
          </nav>
          <div className="account-mobile-divider"></div>
          <div className="account-mobile-actions">
            <button
              className="account-mobile-action-item"
              onClick={() => { navigate('/'); setMobileMenuOpen(false); }}
            >
              <i className="fas fa-home"></i>
              Home
            </button>
            {receivedRequests.length > 0 && (
              <button
                className="account-mobile-action-item"
                onClick={() => { setShowNotifications(true); setMobileMenuOpen(false); }}
              >
                <i className="fas fa-bell"></i>
                Friend Requests
                <span className="account-mobile-badge">{receivedRequests.length}</span>
              </button>
            )}
            {!isGuest && subscriptionStatus?.canUpgrade && (
              <button
                className="account-mobile-action-item upgrade"
                onClick={() => { setActiveTab('membership'); setMobileMenuOpen(false); }}
              >
                <i className="fas fa-crown"></i>
                Upgrade Plan
              </button>
            )}
            <button
              className="account-mobile-action-item danger"
              onClick={() => { handleSignOut(); setMobileMenuOpen(false); }}
            >
              <i className="fas fa-sign-out-alt"></i>
              Sign Out
            </button>
          </div>
        </div>

        {/* Guest Info Banner */}
          {isGuest && (
          <div className="guest-info-banner">
            <div className="guest-banner-icon">
              <i className="fas fa-user-secret"></i>
            </div>
            <div className="guest-banner-content">
              <h4>Playing as Guest</h4>
              <p>
                You can join other players' rooms and participate in games. To create your own rooms,
                save characters, and access all features: <button className="guest-signup-link" onClick={() => { window.location.href = '/'; }}>create a free account</button>.
              </p>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="account-main">
          {activeTab === 'rooms' && (
            <div className="tab-content">
              {isPhone && (
                <div className="account-phone-notice">
                  <i className="fas fa-info-circle"></i>
                  <span>
                    Rooms can be managed here, but the tactical grid needs a tablet or desktop.
                    Characters, rules, and the world map work great on your phone.
                  </span>
                </div>
              )}
              <RoomManager />
            </div>
          )}

          {activeTab === 'characters' && (
            <div className="tab-content">
              <div className="characters-full-view">
                {/* Management Header with Capacity & Action */}
                <div className="char-mgmt-header">
                  <div className="char-mgmt-title-group">
                    <div className="char-mgmt-icon-wrap">
                      <i className="fas fa-shield-halved"></i>
                    </div>
                    <div>
                      <h2>Character Vault</h2>
                      <p className="char-mgmt-subtitle">Manage, view, and select your active champions for play</p>
                    </div>
                  </div>

                  <div className="char-mgmt-header-actions">
                    {characterLimitInfo && (
                      <div className="char-capacity-badge" title={characterLimitInfo.isUnlimited ? 'Unlimited character slots' : `${characterLimitInfo.currentCount} of ${characterLimitInfo.limit} slots used`}>
                        <i className="fas fa-users"></i>
                        <span className="capacity-text">
                          <strong>{characterLimitInfo.currentCount}</strong> / {characterLimitInfo.isUnlimited ? '∞' : characterLimitInfo.limit} Slots
                        </span>
                        {subscriptionStatus?.tier?.name && (
                          <span className="capacity-tier-pill">{subscriptionStatus.tier.name}</span>
                        )}
                      </div>
                    )}

                    <button
                      className={`char-create-cta-btn ${characterLimitInfo && !characterLimitInfo.canCreate ? 'disabled' : ''}`}
                      onClick={handleCreateCharacter}
                      disabled={characterLimitInfo && !characterLimitInfo.canCreate}
                      title={characterLimitInfo && !characterLimitInfo.canCreate ?
                        `Character limit reached (${characterLimitInfo.limit}). Upgrade membership to forge more.` :
                        'Forge a new character'
                      }
                    >
                      <i className="fas fa-plus"></i>
                      <span>Create Character</span>
                    </button>
                  </div>
                </div>

                {/* Management Toolbar: Search, Class Filter, Sorting */}
                <div className="char-mgmt-toolbar">
                  <div className="char-search-box">
                    <i className="fas fa-search search-icon"></i>
                    <input
                      type="text"
                      className="char-search-input"
                      placeholder="Search characters by name, lineage, class..."
                      value={characterSearchQuery}
                      onChange={(e) => setCharacterSearchQuery(e.target.value)}
                    />
                    {characterSearchQuery && (
                      <button className="search-clear-btn" onClick={() => setCharacterSearchQuery('')} title="Clear search">
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>

                  <div className="char-filter-group">
                    <div className="filter-item">
                      <label htmlFor="char-class-filter"><i className="fas fa-filter"></i> Class:</label>
                      <select
                        id="char-class-filter"
                        className="char-filter-select"
                        value={characterClassFilter}
                        onChange={(e) => setCharacterClassFilter(e.target.value)}
                      >
                        <option value="all">All Classes ({characters.length})</option>
                        {availableClasses.map(cls => (
                          <option key={cls} value={cls}>{cls}</option>
                        ))}
                      </select>
                    </div>

                    <div className="filter-item">
                      <label htmlFor="char-sort-filter"><i className="fas fa-arrow-down-a-z"></i> Sort:</label>
                      <select
                        id="char-sort-filter"
                        className="char-filter-select"
                        value={characterSortBy}
                        onChange={(e) => setCharacterSortBy(e.target.value)}
                      >
                        <option value="name">Name (A–Z)</option>
                        <option value="level">Level (High–Low)</option>
                        <option value="recent">Recently Updated</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Characters Grid */}
                {filteredCharacters.length > 0 ? (
                  <div className="characters-grid-full">
                    {filteredCharacters.map((character) => {
                      const getModifier = (score) => Math.floor((score - 10) / 2);
                      const formatModifier = (modifier) => modifier >= 0 ? `+${modifier}` : `${modifier}`;
                      const getCharacterImage = (char) => {
                        if (char.lore?.characterImage) return char.lore.characterImage;
                        if (char.image) return char.image;
                        const icon = char.characterIcon || char.lore?.characterIcon;
                        if (icon) {
                          if (icon.includes('/')) {
                            return getCustomIconUrl(icon, 'creatures');
                          }
                          return getWowIconUrl(icon);
                        }
                        return null;
                      };

                      const stats = character.stats || {
                        strength: 10, agility: 10, constitution: 10,
                        intelligence: 10, spirit: 10, charisma: 10
                      };

                      const { health, mana } = calculateCharacterResources(character);
                      const actionPoints = character.actionPoints || character.resources?.actionPoints || { current: 3, max: 3 };

                      const bgImage = character.lore?.iconBackgroundImage || character.iconBackgroundImage;
                      const bgStyle = bgImage
                        ? {
                            backgroundImage: `linear-gradient(rgba(248, 245, 240, 0.88), rgba(240, 234, 214, 0.94)), url(/assets/Backgrounds/${encodeURIComponent(bgImage)})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                          }
                        : {};

                      const hpPercent = health.max > 0 ? Math.min(100, Math.max(0, (health.current / health.max) * 100)) : 0;
                      const mpPercent = mana.max > 0 ? Math.min(100, Math.max(0, (mana.current / mana.max) * 100)) : 0;
                      const apPercent = actionPoints.max > 0 ? Math.min(100, Math.max(0, (actionPoints.current / actionPoints.max) * 100)) : 0;
                      const isActive = currentCharacterId === character.id;

                      return (
                        <div 
                          key={character.id} 
                          className={`hero-card-compact ${isActive ? 'active-hero' : ''}`}
                          style={bgStyle}
                        >
                          {/* Active Hero Crown Ribbon */}
                          {isActive && (
                            <div className="hero-active-ribbon">
                              <i className="fas fa-crown"></i>
                              <span>ACTIVE HERO</span>
                            </div>
                          )}

                          {/* Card Header: Identity & Avatar */}
                          <div className="hero-card-header">
                            <div className="hero-identity-row">
                              <div className="hero-portrait-frame">
                                {getCharacterImage(character) ? (
                                  <img src={getCharacterImage(character)} alt={character.name} className="hero-portrait-img" />
                                ) : (
                                  <div className="hero-portrait-monogram">
                                    <span className="monogram-letter">{character.name ? character.name.charAt(0).toUpperCase() : 'A'}</span>
                                  </div>
                                )}
                                <span className="hero-level-chip" title={`Level ${character.level || 1}`}>
                                  Lv.{character.level || 1}
                                </span>
                              </div>

                              <div className="hero-info-section">
                                <h3 className="hero-name" title={character.name}>{character.name}</h3>
                                <div className="hero-badges-row">
                                  <span className="hero-badge race-badge" title="Lineage">
                                    <i className="fas fa-user-shield"></i>
                                    {character.raceDisplayName || character.race || 'Adventurer'}
                                  </span>
                                  <span className="hero-badge class-badge" title="Class">
                                    <i className="fas fa-hat-wizard"></i>
                                    {character.class || 'Adventurer'}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* High-Contrast Luminous Resource Gauges */}
                            <div className="hero-resources-block">
                              {/* HP Gauge */}
                              <div className="hero-resource-gauge hp-gauge">
                                <div className="gauge-label-row">
                                  <span className="gauge-name"><i className="fas fa-heart"></i> HP</span>
                                  <span className="gauge-value">{health.current} / {health.max}</span>
                                </div>
                                <div className="gauge-track">
                                  <div 
                                    className="gauge-fill hp-fill" 
                                    style={{ width: `${hpPercent}%` }}
                                  ></div>
                                </div>
                              </div>

                              {/* MP Gauge */}
                              <div className="hero-resource-gauge mp-gauge">
                                <div className="gauge-label-row">
                                  <span className="gauge-name"><i className="fas fa-droplet"></i> MP</span>
                                  <span className="gauge-value">{mana.current} / {mana.max}</span>
                                </div>
                                <div className="gauge-track">
                                  <div 
                                    className="gauge-fill mp-fill" 
                                    style={{ width: `${mpPercent}%` }}
                                  ></div>
                                </div>
                              </div>

                              {/* AP Gauge */}
                              <div className="hero-resource-gauge ap-gauge">
                                <div className="gauge-label-row">
                                  <span className="gauge-name"><i className="fas fa-bolt"></i> AP</span>
                                  <span className="gauge-value">{actionPoints.current} / {actionPoints.max}</span>
                                </div>
                                <div className="gauge-track">
                                  <div 
                                    className="gauge-fill ap-fill" 
                                    style={{ width: `${apPercent}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 6 Modular Ability Score Tiles */}
                          <div className="hero-stats-row">
                            {[
                              { key: 'strength', abbr: 'STR' },
                              { key: 'agility', abbr: 'AGI' },
                              { key: 'constitution', abbr: 'CON' },
                              { key: 'intelligence', abbr: 'INT' },
                              { key: 'spirit', abbr: 'SPI' },
                              { key: 'charisma', abbr: 'CHA' }
                            ].map(stat => {
                              const val = stats[stat.key] || 10;
                              const mod = getModifier(val);
                              return (
                                <div key={stat.key} className="hero-stat-card" title={`${stat.abbr}: ${val} (${formatModifier(mod)})`}>
                                  <span className="stat-card-abbr">{stat.abbr}</span>
                                  <span className="stat-card-value">{val}</span>
                                  <span className={`stat-card-mod ${mod >= 0 ? 'pos' : 'neg'}`}>{formatModifier(mod)}</span>
                                </div>
                              );
                            })}
                          </div>

                          {/* Action Footer */}
                          <div className="hero-actions-bar">
                            <button
                              className={`hero-action-btn select-btn ${isActive ? 'is-active' : ''}`}
                              onClick={() => handleSelectCharacter(character.id)}
                              title={isActive ? 'Currently active hero for gameplay' : 'Set this hero as active'}
                            >
                              <i className={`fas ${isActive ? 'fa-circle-check' : 'fa-circle-dot'}`}></i>
                              <span>{isActive ? 'Active Hero' : 'Select Hero'}</span>
                            </button>

                            <div className="hero-actions-group">
                              <button 
                                className="hero-action-icon-btn edit-btn" 
                                onClick={() => navigate(`/account/characters/edit/${character.id}`)}
                                title="Edit Character & Lore"
                              >
                                <i className="fas fa-pen-to-square"></i>
                              </button>
                              <button 
                                className="hero-action-icon-btn view-btn" 
                                onClick={() => navigate(`/account/characters/view/${character.id}`)}
                                title="View Full Character Sheet"
                              >
                                <i className="fas fa-eye"></i>
                              </button>
                              <button 
                                className="hero-action-icon-btn delete-btn" 
                                onClick={() => handleDeleteCharacter(character)}
                                title="Delete Character"
                              >
                                <i className="fas fa-trash-can"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* Invite Card: Forge New Hero Slot */}
                    {(!characterLimitInfo || characterLimitInfo.canCreate) && (
                      <div 
                        className="hero-slot-add-card" 
                        onClick={handleCreateCharacter} 
                        role="button" 
                        tabIndex={0}
                        title="Forge a new character"
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCreateCharacter(); }}
                      >
                        <div className="add-slot-inner">
                          <div className="add-slot-icon-ring">
                            <i className="fas fa-plus"></i>
                          </div>
                          <h4 className="add-slot-title">Forge New Hero</h4>
                          <p className="add-slot-subtitle">Select lineage, class, and custom abilities to begin your legend</p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : characters.length > 0 ? (
                  /* No filter matches state */
                  <div className="char-no-results">
                    <div className="no-results-icon"><i className="fas fa-magnifying-glass"></i></div>
                    <h3>No Matching Champions Found</h3>
                    <p>No characters match your search filter "{characterSearchQuery || characterClassFilter}".</p>
                    <button 
                      className="char-clear-filter-btn" 
                      onClick={() => { setCharacterSearchQuery(''); setCharacterClassFilter('all'); }}
                    >
                      <i className="fas fa-rotate-left"></i> Reset Filters
                    </button>
                  </div>
                ) : (
                  /* 0 Characters Empty State */
                  <div className="no-characters">
                    {characterLimitInfo && (
                      <div className="character-limit-info">
                        <i className="fas fa-users"></i>
                        <span className="character-count">
                          {characterLimitInfo.currentCount} / {characterLimitInfo.isUnlimited ? '∞' : characterLimitInfo.limit}
                        </span>
                      </div>
                    )}
                    <div className="no-characters-icon"><i className="fas fa-users-slash"></i></div>
                    <h3>No Characters Yet</h3>
                    <p>Create your first hero to explore dungeons, forge alliances, and embark on campaigns!</p>
                    <button className="create-first-character-btn" onClick={handleCreateCharacter}>
                      <i className="fas fa-plus"></i>
                      Forge Your First Hero
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'campaigns' && (
            <div className="tab-content">
              {subscriptionStatus && isCampaignManagerTier(subscriptionStatus.tier?.id || subscriptionStatus.tierKey || subscriptionStatus.tier) ? (
                <CampaignManager user={user} />
              ) : (
                <div className="upgrade-prompt-section">
                  <div className="upgrade-prompt-card">
                    <div className="upgrade-prompt-icon"><i className="fas fa-crown"></i></div>
                    <h3>Campaign Manager</h3>
                    <p>Organize your campaigns with session tracking, multi-room management, and more.</p>
                    <p className="upgrade-prompt-required">Requires <strong>Dungeon Master</strong> or above</p>
                    <button className="upgrade-prompt-btn" onClick={() => setActiveTab('membership')}>
                      <i className="fas fa-arrow-right"></i>
                      View Plans
                    </button>
                  </div>
                </div>
              )}
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

          {activeTab === 'maps' && (
            <div className="tab-content account-world-tab-content">
              <div className="account-world-lore-wrapper" style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #2a2a4a' }}>
                <WorldDashboard />
              </div>
            </div>
          )}

          {activeTab === 'books' && (
            <div className="tab-content account-books-tab-content" style={{ height: 'calc(100vh - 120px)', minHeight: '600px', display: 'flex', flexDirection: 'column' }}>
              <BookManager isGM={true} />
            </div>
          )}

          {activeTab === 'membership' && (
            <div className="tab-content">
              <div className="membership-plans-section">
                <div className="membership-plans-header">
                  <h2>Choose Your Plan</h2>
                  <p className="membership-plans-subtitle">
                    Unlock the full power of Mythrill VTT for your tabletop adventures
                  </p>
                  {subscriptionStatus && (
                    <div className="current-plan-indicator">
                      <span>Current plan: </span>
                      <span
                        className="current-plan-badge"
                        style={{ background: subscriptionStatus.color || '#888' }}
                      >
                        <i className={`fas ${subscriptionStatus.icon || 'fa-user'}`}></i>
                        {subscriptionStatus.displayName}
                      </span>
                    </div>
                  )}
                </div>

                <div className="membership-plans-grid">
                  {TIER_ORDER.map(tierKey => {
                    const tier = SUBSCRIPTION_TIERS[tierKey];
                    if (!tier) return null;
                    const isCurrentTier = subscriptionStatus?.tierKey === tierKey;
                    const isFree = tier.price === 0 && tierKey !== 'GUEST';

                    return (
                      <div
                        key={tierKey}
                        className={`membership-plan-card ${tierKey.toLowerCase()} ${isCurrentTier ? 'current' : ''} ${tier.highlight ? 'highlighted' : ''}`}
                      >
                        {tier.highlight && (
                          <div className="plan-popular-tag">Most Popular</div>
                        )}
                        {isCurrentTier && (
                          <div className="plan-current-tag">Current Plan</div>
                        )}

                        <div className="plan-icon" style={{ color: tier.color }}>
                          <i className={`fas ${tier.icon}`}></i>
                        </div>

                        <h3 className="plan-name">{tier.name}</h3>
                        <div className="plan-price">
                          {tier.price === 0 ? (
                            isFree ? <>Free<span>/forever</span></> : 'Free'
                          ) : (
                            <>${tier.price}<span>/month</span></>
                          )}
                        </div>
                        <p className="plan-description">{tier.description}</p>

                        <div className="plan-stats">
                          <div className="plan-stat">
                            <i className="fas fa-users"></i>
                            <span>{tier.characterLimit === -1 ? 'Unlimited' : tier.characterLimit} characters</span>
                          </div>
                          <div className="plan-stat">
                            <i className="fas fa-door-open"></i>
                            <span>{tier.roomLimit === 0 ? 'Join only' : `${tier.roomLimit} room${tier.roomLimit !== 1 ? 's' : ''}`}</span>
                          </div>
                          {tier.maxPlayersPerRoom > 0 && (
                            <div className="plan-stat">
                              <i className="fas fa-user-group"></i>
                              <span>Up to {tier.maxPlayersPerRoom} players/room</span>
                            </div>
                          )}
                          {tier.storageLimit > 0 && (
                            <div className="plan-stat">
                              <i className="fas fa-database"></i>
                              <span>{tier.storageLimit >= 1024 * 1024 * 1024
                                ? `${(tier.storageLimit / (1024 * 1024 * 1024)).toFixed(0)} GB`
                                : `${(tier.storageLimit / (1024 * 1024)).toFixed(0)} MB`} storage</span>
                            </div>
                          )}
                        </div>

                        <ul className="plan-features">
                          {tier.features.slice(0, 8).map((feature, idx) => (
                            <li key={idx}>
                              <i className="fas fa-check"></i>
                              {feature}
                            </li>
                          ))}
                          {tier.features.length > 8 && (
                            <li className="more-features">
                              +{tier.features.length - 8} more features
                            </li>
                          )}
                        </ul>

                        <div className="plan-action">
                          {isCurrentTier ? (
                            <button className="plan-btn current-btn" disabled>
                              Current Plan
                            </button>
                          ) : tier.price === 0 && tierKey === 'GUEST' ? (
                            <span className="plan-note">No account needed</span>
                          ) : tier.price === 0 ? (
                            <span className="plan-note">Free with account</span>
                          ) : (
                            <button className="plan-btn upgrade-btn" disabled>
                              Coming Soon
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
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

        {!isGuest && (
          <div className="account-danger-zone" style={{ marginTop: '2rem', padding: '1.5rem', borderTop: '2px solid #dc3545' }}>
            <h4 style={{ color: '#dc3545', marginBottom: '0.5rem' }}>Danger Zone</h4>
            <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1rem' }}>
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            {!showAccountDeleteConfirm ? (
              <button
                className="confirm-delete-btn"
                onClick={() => setShowAccountDeleteConfirm(true)}
                style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
              >
                <i className="fas fa-exclamation-triangle"></i> Delete Account
              </button>
            ) : (
              <div style={{ background: 'rgba(220,53,69,0.1)', padding: '1rem', borderRadius: '4px' }}>
                <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>This will permanently delete:</p>
                <ul style={{ fontSize: '0.85rem', marginLeft: '1rem', marginBottom: '1rem' }}>
                  <li>All your characters</li>
                  <li>All your rooms and campaigns</li>
                  <li>Your journals, friends, and settings</li>
                  <li>Your account credentials</li>
                </ul>
                <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  Type <strong>DELETE</strong> to confirm:
                </p>
                <input
                  type="text"
                  value={accountDeleteText}
                  onChange={(e) => setAccountDeleteText(e.target.value)}
                  placeholder="Type DELETE"
                  style={{ padding: '0.4rem', marginBottom: '0.75rem', width: '200px', display: 'block' }}
                />
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="confirm-delete-btn"
                    onClick={handleDeleteAccount}
                    disabled={accountDeleteText !== 'DELETE' || isDeletingAccount}
                    style={{ background: '#dc3545', color: '#fff', border: 'none', padding: '0.5rem 1rem', borderRadius: '4px', cursor: accountDeleteText === 'DELETE' ? 'pointer' : 'not-allowed', opacity: accountDeleteText === 'DELETE' ? 1 : 0.5 }}
                  >
                    {isDeletingAccount ? 'Deleting...' : 'Permanently Delete My Account'}
                  </button>
                  <button
                    className="cancel-btn"
                    onClick={() => { setShowAccountDeleteConfirm(false); setAccountDeleteText(''); }}
                    style={{ padding: '0.5rem 1rem', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <ProfileEditModal isOpen={isProfileEditOpen} onClose={() => setIsProfileEditOpen(false)} />
    </div>
  );
};

export default AccountDashboard;
