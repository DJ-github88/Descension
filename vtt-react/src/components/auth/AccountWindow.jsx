// Account window component for navigation integration
import React, { useState } from 'react';
import WowWindow from '../windows/WowWindow';
import AuthModal from './AuthModal';
import UserProfile from './UserProfile';
import CharacterManager from './CharacterManager';
import useAuthStore from '../../store/authStore';
import './styles/AccountWindow.css';

const AccountWindow = ({ isOpen, onClose }) => {
  const { isAuthenticated, user } = useAuthStore();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showCharacterManager, setShowCharacterManager] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const handleShowLogin = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleShowRegister = () => {
    setAuthMode('register');
    setShowAuthModal(true);
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
  };

  const handleCloseUserProfile = () => {
    setShowUserProfile(false);
  };

  const handleCloseCharacterManager = () => {
    setShowCharacterManager(false);
  };

  return (
    <>
      <WowWindow
        title="Welcome"
        isOpen={isOpen}
        onClose={onClose}
        defaultSize={{ width: 500, height: 400 }}
        defaultPosition={{ x: 200, y: 150 }}
      >
        <div className="account-window-content">
          {!isAuthenticated ? (
            /* Not Authenticated - Show Login/Register Options */
            <div className="auth-options">
              <div className="auth-header">
                <h2>Welcome to Mythrill</h2>
                <p>Sign in to save your characters and join multiplayer adventures</p>
              </div>

              <div className="auth-benefits">
                <h3>Account Benefits:</h3>
                <ul>
                  <li><i className="fas fa-save"></i> Save character progress</li>
                  <li><i className="fas fa-users"></i> Join multiplayer sessions</li>
                  <li><i className="fas fa-cloud"></i> Cloud synchronization</li>
                  <li><i className="fas fa-trophy"></i> Track achievements</li>
                  <li><i className="fas fa-history"></i> Campaign history</li>
                </ul>
              </div>

              <div className="auth-actions">
                <button
                  className="login-btn"
                  onClick={handleShowLogin}
                >
                  <i className="fas fa-sign-in-alt"></i>
                  Sign In
                </button>
                <button
                  className="register-btn"
                  onClick={handleShowRegister}
                >
                  <i className="fas fa-user-plus"></i>
                  Create Account
                </button>
              </div>

              <div className="guest-mode">
                <p>
                  <i className="fas fa-info-circle"></i>
                  Playing as guest? Your progress won't be saved.
                </p>
              </div>
            </div>
          ) : (
            /* Authenticated - Show Account Management */
            <div className="account-management">
              <div className="user-welcome">
                <div className="user-avatar">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="Profile" />
                  ) : (
                    <i className="fas fa-user-circle"></i>
                  )}
                </div>
                <div className="user-info">
                  <h3>Welcome, {user?.displayName || 'Adventurer'}!</h3>
                  <p>{user?.email}</p>
                </div>
              </div>

              <div className="account-features">
                <button 
                  className="feature-btn"
                  onClick={() => setShowCharacterManager(true)}
                >
                  <div className="feature-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <div className="feature-info">
                    <h4>Manage Characters</h4>
                    <p>Create, edit, and select characters</p>
                  </div>
                  <i className="fas fa-chevron-right"></i>
                </button>

                <button 
                  className="feature-btn"
                  onClick={() => setShowUserProfile(true)}
                >
                  <div className="feature-icon">
                    <i className="fas fa-cog"></i>
                  </div>
                  <div className="feature-info">
                    <h4>Account Settings</h4>
                    <p>Manage profile and preferences</p>
                  </div>
                  <i className="fas fa-chevron-right"></i>
                </button>

                <button className="feature-btn disabled">
                  <div className="feature-icon">
                    <i className="fas fa-trophy"></i>
                  </div>
                  <div className="feature-info">
                    <h4>Achievements</h4>
                    <p>Coming soon...</p>
                  </div>
                  <i className="fas fa-chevron-right"></i>
                </button>

                <button className="feature-btn disabled">
                  <div className="feature-icon">
                    <i className="fas fa-history"></i>
                  </div>
                  <div className="feature-info">
                    <h4>Campaign History</h4>
                    <p>Coming soon...</p>
                  </div>
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          )}
        </div>
      </WowWindow>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleCloseAuthModal}
        initialMode={authMode}
      />

      {/* User Profile Modal */}
      <UserProfile
        isOpen={showUserProfile}
        onClose={handleCloseUserProfile}
      />

      {/* Character Manager Modal */}
      <CharacterManager
        isOpen={showCharacterManager}
        onClose={handleCloseCharacterManager}
        onCreateCharacter={(character) => {
          console.log('Character selected:', character);
          setShowCharacterManager(false);
        }}
      />
    </>
  );
};

export default AccountWindow;
