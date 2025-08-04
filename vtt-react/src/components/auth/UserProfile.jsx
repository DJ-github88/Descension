// User profile component with account management
import React, { useState } from 'react';
import useAuthStore from '../../store/authStore';
import './styles/UserProfile.css';

const UserProfile = ({ isOpen, onClose }) => {
  const { user, userData, signOut, updateUserData, isLoading } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    displayName: userData?.displayName || '',
    preferences: {
      theme: userData?.preferences?.theme || 'pathfinder',
      notifications: userData?.preferences?.notifications ?? true,
      autoSave: userData?.preferences?.autoSave ?? true
    }
  });

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
    const result = await updateUserData(editData);
    if (result.success) {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      displayName: userData?.displayName || '',
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
      </div>
    </div>
  );
};

export default UserProfile;
