// User profile component with account management
import React, { useState, useRef, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import CharacterManager from './CharacterManager';
import { saveUserProfile, loadUserProfile, uploadAvatar, deleteAvatar, generateAvatarFromName } from '../../services/firebase/userProfileService';
import './styles/UserProfile.css';

const UserProfile = ({ isOpen, onClose }) => {
  const { user, userData, signOut, updateUserData, isLoading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showCharacterManager, setShowCharacterManager] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  const [editData, setEditData] = useState({
    displayName: '',
    bio: '',
    title: '',
    avatarType: 'default',
    avatarSettings: {
      style: 'fantasy',
      backgroundColor: '#2c3e50',
      textColor: '#ecf0f1'
    },
    favoriteClasses: [],
    favoriteRaces: [],
    playStyle: 'casual',
    gameMasterExperience: 'player',
    isPublic: true,
    showOnlineStatus: true,
    allowFriendRequests: true,
    allowDirectMessages: true,
    shareGameStats: false,
    profileTheme: 'default',
    website: '',
    discordTag: '',
    twitchChannel: '',
    youtubeChannel: '',
    preferences: {
      theme: 'pathfinder',
      notifications: true,
      autoSave: true
    }
  });

  // Load profile data on component mount
  useEffect(() => {
    const loadProfile = async () => {
      if (user && !user.isGuest) {
        try {
          const profile = await loadUserProfile(user.uid);
          setProfileData(profile);
          setEditData({
            displayName: profile.displayName || userData?.displayName || '',
            bio: profile.bio || '',
            title: profile.title || '',
            avatarType: profile.avatarType || 'default',
            avatarSettings: profile.avatarSettings || {
              style: 'fantasy',
              backgroundColor: '#2c3e50',
              textColor: '#ecf0f1'
            },
            favoriteClasses: profile.favoriteClasses || [],
            favoriteRaces: profile.favoriteRaces || [],
            playStyle: profile.playStyle || 'casual',
            gameMasterExperience: profile.gameMasterExperience || 'player',
            isPublic: profile.isPublic !== false,
            showOnlineStatus: profile.showOnlineStatus !== false,
            allowFriendRequests: profile.allowFriendRequests !== false,
            allowDirectMessages: profile.allowDirectMessages !== false,
            shareGameStats: profile.shareGameStats || false,
            profileTheme: profile.profileTheme || 'default',
            website: profile.website || '',
            discordTag: profile.discordTag || '',
            twitchChannel: profile.twitchChannel || '',
            youtubeChannel: profile.youtubeChannel || '',
            preferences: {
              theme: profile.preferences?.theme || userData?.preferences?.theme || 'pathfinder',
              notifications: profile.preferences?.notifications ?? userData?.preferences?.notifications ?? true,
              autoSave: profile.preferences?.autoSave ?? userData?.preferences?.autoSave ?? true
            }
          });
        } catch (error) {
          console.error('Failed to load profile:', error);
        }
      } else {
        // For guest users, just use basic data
        setEditData(prev => ({
          ...prev,
          displayName: userData?.displayName || '',
          preferences: {
            theme: userData?.preferences?.theme || 'pathfinder',
            notifications: userData?.preferences?.notifications ?? true,
            autoSave: userData?.preferences?.autoSave ?? true
          }
        }));
      }
      setLoading(false);
    };

    loadProfile();
  }, [user, userData]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('preferences.')) {
      const prefKey = name.split('.')[1];
      setEditData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [prefKey]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setEditData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSave = async () => {
    try {
      // Save basic user data for backward compatibility
      const basicResult = await updateUserData({
        displayName: editData.displayName,
        preferences: editData.preferences
      });

      if (!basicResult.success) {
        throw new Error(basicResult.error);
      }

      // Save extended profile data if user is authenticated
      if (user && !user.isGuest) {
        const profileResult = await saveUserProfile(user.uid, {
          displayName: editData.displayName,
          bio: editData.bio,
          title: editData.title,
          avatarType: editData.avatarType,
          avatarSettings: editData.avatarSettings,
          favoriteClasses: editData.favoriteClasses,
          favoriteRaces: editData.favoriteRaces,
          playStyle: editData.playStyle,
          gameMasterExperience: editData.gameMasterExperience,
          isPublic: editData.isPublic,
          showOnlineStatus: editData.showOnlineStatus,
          allowFriendRequests: editData.allowFriendRequests,
          allowDirectMessages: editData.allowDirectMessages,
          shareGameStats: editData.shareGameStats,
          profileTheme: editData.profileTheme,
          website: editData.website,
          discordTag: editData.discordTag,
          twitchChannel: editData.twitchChannel,
          youtubeChannel: editData.youtubeChannel
        });

        if (!profileResult.success) {
          console.warn('Profile save failed, but basic data was saved:', profileResult.error);
        }
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Failed to save profile:', error);
      // Still close editing mode even if there was an error
      setIsEditing(false);
    }
  };

  // Avatar handling functions
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file || !user || user.isGuest) return;

    try {
      const result = await uploadAvatar(user.uid, file);
      if (result.success) {
        setEditData(prev => ({
          ...prev,
          avatarType: 'uploaded'
        }));
        setProfileData(prev => ({
          ...prev,
          avatarUrl: result.avatarUrl,
          avatarType: 'uploaded'
        }));
      }
    } catch (error) {
      console.error('Avatar upload failed:', error);
    }
  };

  const handleGenerateAvatar = () => {
    const generated = generateAvatarFromName(editData.displayName || 'User', editData.avatarSettings);
    setEditData(prev => ({
      ...prev,
      avatarType: 'generated'
    }));
    setProfileData(prev => ({
      ...prev,
      avatarUrl: generated.avatarUrl,
      avatarType: 'generated'
    }));
  };

  const handleDeleteAvatar = async () => {
    if (!user || user.isGuest || !profileData?.avatarUrl) return;

    try {
      await deleteAvatar(user.uid, profileData.avatarUrl);
      setEditData(prev => ({
        ...prev,
        avatarType: 'default'
      }));
      setProfileData(prev => ({
        ...prev,
        avatarUrl: null,
        avatarType: 'default'
      }));
    } catch (error) {
      console.error('Avatar deletion failed:', error);
    }
  };

  const handleCancel = () => {
    setEditData({
      displayName: profileData?.displayName || userData?.displayName || '',
      bio: profileData?.bio || '',
      title: profileData?.title || '',
      avatarType: profileData?.avatarType || 'default',
      avatarSettings: profileData?.avatarSettings || {
        style: 'fantasy',
        backgroundColor: '#2c3e50',
        textColor: '#ecf0f1'
      },
      favoriteClasses: profileData?.favoriteClasses || [],
      favoriteRaces: profileData?.favoriteRaces || [],
      playStyle: profileData?.playStyle || 'casual',
      gameMasterExperience: profileData?.gameMasterExperience || 'player',
      isPublic: profileData?.isPublic !== false,
      showOnlineStatus: profileData?.showOnlineStatus !== false,
      allowFriendRequests: profileData?.allowFriendRequests !== false,
      allowDirectMessages: profileData?.allowDirectMessages !== false,
      shareGameStats: profileData?.shareGameStats || false,
      profileTheme: profileData?.profileTheme || 'default',
      website: profileData?.website || '',
      discordTag: profileData?.discordTag || '',
      twitchChannel: profileData?.twitchChannel || '',
      youtubeChannel: profileData?.youtubeChannel || '',
      preferences: {
        theme: userData?.preferences?.theme || 'pathfinder',
        notifications: userData?.preferences?.notifications ?? true,
        autoSave: userData?.preferences?.autoSave ?? true
      }
    });
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  if (!isOpen || !user) return null;

  return (
    <div className="user-profile-overlay" onClick={onClose}>
      <div className="user-profile-modal" onClick={(e) => e.stopPropagation()}>
        <button className="user-profile-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="user-profile-header">
          <div className="user-avatar">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" />
            ) : (
              <i className="fas fa-user"></i>
            )}
          </div>
          <div className="user-info">
            <h2>{userData?.displayName || user.displayName || 'Adventurer'}</h2>
            <p>{user.email}</p>
            {userData?.createdAt && (
              <p className="join-date">
                Joined {new Date(userData.createdAt.seconds * 1000).toLocaleDateString()}
              </p>
            )}
          </div>
        </div>

        <div className="user-profile-content">
          {/* Account Information */}
          <div className="profile-section">
            <div className="section-header">
              <h3>Account Information</h3>
              {!isEditing && (
                <button 
                  className="edit-btn"
                  onClick={() => setIsEditing(true)}
                >
                  <i className="fas fa-edit"></i>
                  Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <div className="edit-form">
                <div className="form-group">
                  <label htmlFor="displayName">Display Name</label>
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    value={editData.displayName}
                    onChange={handleInputChange}
                    placeholder="Enter display name"
                  />
                </div>

                <div className="form-actions">
                  <button 
                    className="save-btn"
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    {isLoading ? <i className="fas fa-spinner fa-spin"></i> : 'Save'}
                  </button>
                  <button 
                    className="cancel-btn"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="profile-info">
                <div className="info-item">
                  <label>Display Name:</label>
                  <span>{userData?.displayName || 'Not set'}</span>
                </div>
                <div className="info-item">
                  <label>Email:</label>
                  <span>{user.email}</span>
                </div>
                <div className="info-item">
                  <label>Account Type:</label>
                  <span>{user.providerData[0]?.providerId === 'google.com' ? 'Google' : 'Email'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Preferences */}
          <div className="profile-section">
            <h3>Preferences</h3>
            <div className="preferences-grid">
              <div className="preference-item">
                <label htmlFor="theme">Theme:</label>
                <select
                  id="theme"
                  name="preferences.theme"
                  value={editData.preferences.theme}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                >
                  <option value="pathfinder">Pathfinder</option>
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>

              <div className="preference-item">
                <label>
                  <input
                    type="checkbox"
                    name="preferences.notifications"
                    checked={editData.preferences.notifications}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                  Enable Notifications
                </label>
              </div>

              <div className="preference-item">
                <label>
                  <input
                    type="checkbox"
                    name="preferences.autoSave"
                    checked={editData.preferences.autoSave}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                  Auto-save Progress
                </label>
              </div>
            </div>
          </div>

          {/* Game Statistics */}
          {userData?.gameData && (
            <div className="profile-section">
              <h3>Game Statistics</h3>
              <div className="stats-grid">
                <div className="stat-item">
                  <label>Characters Created:</label>
                  <span>{userData.characters?.length || 0}</span>
                </div>
                <div className="stat-item">
                  <label>Skills Unlocked:</label>
                  <span>{userData.gameData.unlockedSkills?.length || 0}</span>
                </div>
                <div className="stat-item">
                  <label>Achievements:</label>
                  <span>{userData.gameData.achievements?.length || 0}</span>
                </div>
                <div className="stat-item">
                  <label>Total Play Time:</label>
                  <span>{Math.floor((userData.gameData.totalPlayTime || 0) / 60)} hours</span>
                </div>
              </div>
            </div>
          )}

          {/* Character Management */}
          <div className="profile-section">
            <h3>Character Management</h3>
            <div className="character-summary">
              <div className="character-count">
                <label>Characters Created:</label>
                <span>{userData?.characters?.length || 0}</span>
              </div>
              <button
                className="manage-characters-btn"
                onClick={() => setShowCharacterManager(true)}
              >
                <i className="fas fa-users"></i>
                Manage Characters
              </button>
            </div>
          </div>

          {/* Account Actions */}
          <div className="profile-section">
            <h3>Account Actions</h3>
            <div className="action-buttons">
              <button
                className="sign-out-btn"
                onClick={handleSignOut}
              >
                <i className="fas fa-sign-out-alt"></i>
                Sign Out
              </button>
            </div>
          </div>
        </div>

        {/* Character Manager Modal */}
        <CharacterManager
          isOpen={showCharacterManager}
          onClose={() => setShowCharacterManager(false)}
          onCreateCharacter={(character) => {
            console.log('Character selected:', character);
            setShowCharacterManager(false);
          }}
        />
      </div>
    </div>
  );
};

export default UserProfile;
