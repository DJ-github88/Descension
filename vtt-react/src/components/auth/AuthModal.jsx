// Authentication modal with login/register forms
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import { Analytics } from '../../services/analyticsService';
import './styles/AuthModal.css';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode); // 'login', 'register', 'forgot'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
    friendId: '',
    rememberMe: false
  });
  const [friendIdError, setFriendIdError] = useState('');

  const {
    signIn,
    signUp,
    signInWithGoogle,
    signInAsGuest,
    resetPassword,
    isLoading,
    error,
    clearError
  } = useAuthStore();

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle checkbox inputs
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      // Validate Friend ID format
      if (name === 'friendId') {
        // Only allow alphanumeric characters
        const cleanValue = value.replace(/[^a-zA-Z0-9]/g, '');
        setFormData(prev => ({
          ...prev,
          [name]: cleanValue
        }));

        // Validate length
        if (cleanValue.length > 0 && cleanValue.length < 3) {
          setFriendIdError('Friend ID must be at least 3 characters');
        } else if (cleanValue.length > 20) {
          setFriendIdError('Friend ID must be 20 characters or less');
        } else {
          setFriendIdError('');
        }
      } else {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    }

    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (mode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        return;
      }

      // Validate Friend ID if provided
      if (formData.friendId && (formData.friendId.length < 3 || formData.friendId.length > 20)) {
        setFriendIdError('Friend ID must be between 3 and 20 characters');
        return;
      }

      const result = await signUp(
        formData.email,
        formData.password,
        formData.displayName,
        formData.friendId || null
      );
      if (result.success) {
        onClose();
        navigate('/account');
      }
    } else if (mode === 'login') {
      const result = await signIn(formData.email, formData.password, formData.rememberMe);
      if (result.success) {
        Analytics.login('email');
        onClose();
        navigate('/account');
      }
    } else if (mode === 'forgot') {
      const result = await resetPassword(formData.email);
      if (result.success) {
        setMode('login');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    console.log('Starting Google sign-in process...');
    
    // If in register mode, validate and use form data
    let displayName = null;
    let friendId = null;
    
    if (mode === 'register') {
      // Validate Friend ID if provided
      if (formData.friendId && (formData.friendId.length < 3 || formData.friendId.length > 20)) {
        setFriendIdError('Friend ID must be between 3 and 20 characters');
        return;
      }
      
      // Use form data if provided (Display Name is optional - will use Google's if not provided)
      displayName = formData.displayName.trim() || null;
      friendId = formData.friendId.trim() || null;
    }
    
    const result = await signInWithGoogle(displayName, friendId, formData.rememberMe);
    if (result.success) {
      console.log('Google sign-in successful!');
      Analytics.login('google');
      onClose();
      navigate('/account');
    } else {
      console.error('Google sign-in failed:', result.error);
    }
  };

  const handleGuestLogin = async () => {
    console.log('Starting guest login...');
    const result = await signInAsGuest();
    if (result.success) {
      console.log('Guest login successful!');
      onClose();
      navigate('/account');
    } else {
      console.error('Guest login failed:', result.error);
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      displayName: '',
      friendId: ''
    });
    setFriendIdError('');
    clearError();
  };

  const switchMode = (newMode) => {
    setMode(newMode);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="auth-modal-header">
          <h2>
            {mode === 'login' && 'Welcome'}
            {mode === 'register' && 'Join Mythrill'}
            {mode === 'forgot' && 'Reset Password'}
          </h2>
          <p>
            {mode === 'login' && 'Sign in to continue your adventure'}
            {mode === 'register' && 'Create your account to begin'}
            {mode === 'forgot' && 'Enter your email to reset password'}
          </p>
        </div>

        <div className="auth-modal-content">
          {/* Google Sign In Button */}
          {mode !== 'forgot' && (
            <>
              <button
                className="google-signin-btn"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
              >
                <i className="fab fa-google"></i>
                Continue with Google
              </button>

              {/* Guest Login Button - Only show on login screen */}
              {mode === 'login' && (
                <button
                  className="guest-signin-btn"
                  onClick={handleGuestLogin}
                  disabled={isLoading}
                >
                  <i className="fas fa-user-secret"></i>
                  Continue as Guest
                </button>
              )}
            </>
          )}

          {mode !== 'forgot' && <div className="auth-divider">or</div>}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'register' && (
              <>
                <div className="form-group">
                  <label htmlFor="displayName">Display Name</label>
                  <input
                    id="displayName"
                    name="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={handleInputChange}
                    placeholder="Enter your display name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="friendId">
                    Friend ID <span className="optional-label">(Optional)</span>
                  </label>
                  <div className="friend-id-input-wrapper">
                    <span className="friend-id-prefix">#</span>
                    <input
                      id="friendId"
                      name="friendId"
                      type="text"
                      value={formData.friendId}
                      onChange={handleInputChange}
                      placeholder="e.g., WillburtTheGoat4"
                      maxLength={20}
                      className="friend-id-input"
                    />
                  </div>
                  <small className="field-hint">
                    Your unique ID for friends to find you. Leave blank to auto-generate.
                  </small>
                  {friendIdError && (
                    <span className="error-text">{friendIdError}</span>
                  )}
                </div>
              </>
            )}

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                required
              />
            </div>

            {mode !== 'forgot' && (
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  minLength={6}
                />
              </div>
            )}

            {mode === 'register' && (
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  required
                  minLength={6}
                />
                {formData.password !== formData.confirmPassword && formData.confirmPassword && (
                  <span className="error-text">Passwords do not match</span>
                )}
              </div>
            )}

            {error && <div className="error-message">{error}</div>}

            {mode === 'login' && (
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark"></span>
                  Remember me
                </label>
              </div>
            )}

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={isLoading || (mode === 'register' && formData.password !== formData.confirmPassword)}
            >
              {isLoading ? (
                <i className="fas fa-spinner fa-spin"></i>
              ) : (
                <>
                  {mode === 'login' && 'Sign In'}
                  {mode === 'register' && 'Create Account'}
                  {mode === 'forgot' && 'Send Reset Email'}
                </>
              )}
            </button>
          </form>

          {/* Mode Switching */}
          <div className="auth-mode-switch">
            {mode === 'login' && (
              <>
                <p>
                  Don't have an account?{' '}
                  <button onClick={() => switchMode('register')}>Sign up</button>
                </p>
                <p>
                  <button onClick={() => switchMode('forgot')}>Forgot password?</button>
                </p>
              </>
            )}
            
            {mode === 'register' && (
              <p>
                Already have an account?{' '}
                <button onClick={() => switchMode('login')}>Sign in</button>
              </p>
            )}
            
            {mode === 'forgot' && (
              <p>
                Remember your password?{' '}
                <button onClick={() => switchMode('login')}>Sign in</button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
