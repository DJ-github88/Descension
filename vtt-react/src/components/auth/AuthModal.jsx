// Authentication modal with login/register forms
import React, { useState } from 'react';
import useAuthStore from '../../store/authStore';
import './styles/AuthModal.css';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode); // 'login', 'register', 'forgot'
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: ''
  });

  const { 
    signIn, 
    signUp, 
    signInWithGoogle, 
    resetPassword, 
    isLoading, 
    error, 
    clearError 
  } = useAuthStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (mode === 'register') {
      if (formData.password !== formData.confirmPassword) {
        return;
      }
      
      const result = await signUp(formData.email, formData.password, formData.displayName);
      if (result.success) {
        onClose();
      }
    } else if (mode === 'login') {
      const result = await signIn(formData.email, formData.password);
      if (result.success) {
        onClose();
      }
    } else if (mode === 'forgot') {
      const result = await resetPassword(formData.email);
      if (result.success) {
        setMode('login');
      }
    }
  };

  const handleGoogleSignIn = async () => {
    const result = await signInWithGoogle();
    if (result.success) {
      onClose();
    }
  };

  const resetForm = () => {
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      displayName: ''
    });
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
            {mode === 'login' && 'Welcome Back'}
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
            <button 
              className="google-signin-btn"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <i className="fab fa-google"></i>
              Continue with Google
            </button>
          )}

          {mode !== 'forgot' && <div className="auth-divider">or</div>}

          {/* Form */}
          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'register' && (
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
