/**
 * Session Management Hook
 *
 * Comprehensive session management with:
 * - Session timeout and auto-logout
 * - Idle detection with warnings
 * - Session restoration on page refresh
 * - Remember me functionality
 */

import { useEffect, useRef, useCallback } from 'react';
import useAuthStore from '../store/authStore';
import usePresenceStore from '../store/presenceStore';

// Session configuration
const SESSION_CONFIG = {
  // Session timeout (user will be logged out)
  SESSION_TIMEOUT: 8 * 60 * 60 * 1000, // 8 hours in milliseconds

  // Idle timeout (user gets warning before auto-logout)
  IDLE_TIMEOUT: 30 * 60 * 1000, // 30 minutes in milliseconds

  // Warning period before auto-logout
  WARNING_PERIOD: 5 * 60 * 1000, // 5 minutes in milliseconds

  // Activity events that reset timers
  ACTIVITY_EVENTS: [
    'mousedown',
    'mousemove',
    'keypress',
    'scroll',
    'touchstart',
    'click',
    'wheel'
  ]
};

export const useSessionManagement = () => {
  const { user, isAuthenticated, signOut, refreshAuthState } = useAuthStore();
  const { updateStatus } = usePresenceStore();

  // Session timers
  const sessionTimerRef = useRef(null);
  const idleTimerRef = useRef(null);
  const warningTimerRef = useRef(null);

  // Session state
  const lastActivityRef = useRef(Date.now());
  const sessionStartRef = useRef(Date.now());
  const isIdleRef = useRef(false);
  const isWarningShownRef = useRef(false);

  // Activity tracking
  const activityThrottleRef = useRef(null);

  /**
   * Clear all session timers
   */
  const clearTimers = useCallback(() => {
    if (sessionTimerRef.current) {
      clearTimeout(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current);
      warningTimerRef.current = null;
    }
    if (activityThrottleRef.current) {
      clearTimeout(activityThrottleRef.current);
    }
  }, []);

  /**
   * Show session warning modal
   */
  const showSessionWarning = useCallback(() => {
    if (isWarningShownRef.current) return;

    isWarningShownRef.current = true;

    // Create and show warning modal
    const warningModal = document.createElement('div');
    warningModal.id = 'session-warning-modal';
    warningModal.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        font-family: 'Cinzel', serif;
      ">
        <div style="
          background: #ede4d3; /* Parchment beige */
          border: 2px solid #8b4513; /* Dark brown border */
          border-radius: 8px;
          padding: 2rem;
          max-width: 500px;
          color: #2c1810; /* Dark brown text */
          text-align: center;
          box-shadow: 0 10px 25px rgba(0,0,0,0.5), inset 0 0 50px rgba(139, 69, 19, 0.1);
        ">
          <h3 style="margin-bottom: 1rem; color: #c62828; font-size: 1.5rem; border-bottom: 1px solid rgba(139, 69, 19, 0.2); padding-bottom: 0.5rem;">Session Expiring Soon</h3>
          <p style="margin-bottom: 1.5rem; font-size: 1.1rem; line-height: 1.6;">
            You will be automatically logged out in 5 minutes due to inactivity.
            Click "Stay Logged In" to continue your session.
          </p>
          <div style="display: flex; gap: 1rem; justify-content: center;">
            <button id="extend-session" style="
              background: linear-gradient(to bottom, #8b4513, #5e2f0d);
              color: white;
              border: 1px solid #3e1f09;
              padding: 0.75rem 1.5rem;
              border-radius: 4px;
              cursor: pointer;
              font-weight: bold;
              font-family: 'Cinzel', serif;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            ">Stay Logged In</button>
            <button id="logout-now" style="
              background: linear-gradient(to bottom, #d32f2f, #b71c1c);
              color: white;
              border: 1px solid #7f0000;
              padding: 0.75rem 1.5rem;
              border-radius: 4px;
              cursor: pointer;
              font-family: 'Cinzel', serif;
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            ">Log Out Now</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(warningModal);

    // Handle button clicks
    const extendButton = warningModal.querySelector('#extend-session');
    const logoutButton = warningModal.querySelector('#logout-now');

    extendButton.onclick = () => {
      document.body.removeChild(warningModal);
      isWarningShownRef.current = false;
      resetSessionTimers();
    };

    logoutButton.onclick = () => {
      document.body.removeChild(warningModal);
      handleSessionTimeout();
    };

    // Auto-logout after warning period
    warningTimerRef.current = setTimeout(() => {
      if (document.body.contains(warningModal)) {
        document.body.removeChild(warningModal);
      }
      handleSessionTimeout();
    }, SESSION_CONFIG.WARNING_PERIOD);
  }, []);

  /**
   * Handle session timeout (auto-logout)
   */
  const handleSessionTimeout = useCallback(async () => {
    console.log('Session timeout - auto-logging out user');

    // Update presence status to offline
    if (updateStatus) {
      updateStatus('offline', 'Session expired');
    }

    // Clear all timers
    clearTimers();

    // Sign out user
    try {
      await signOut();
    } catch (error) {
      console.error('Error during auto-logout:', error);
    }

    // Show notification
    if (window.showNotification) {
      window.showNotification('Session Expired', 'You have been logged out due to inactivity.', 'warning');
    }
  }, [signOut, updateStatus, clearTimers]);

  /**
   * Reset session timers on user activity
   */
  const resetSessionTimers = useCallback(() => {
    if (!isAuthenticated || !user) return;

    const now = Date.now();
    lastActivityRef.current = now;

    // Clear existing timers
    clearTimers();

    // Reset idle state
    isIdleRef.current = false;
    isWarningShownRef.current = false;

    // Update presence if user was idle
    const currentPresence = usePresenceStore.getState().currentUserPresence;
    if (currentPresence?.status === 'idle') {
      updateStatus('online', null);
    }

    // Set session timeout timer (8 hours)
    sessionTimerRef.current = setTimeout(() => {
      handleSessionTimeout();
    }, SESSION_CONFIG.SESSION_TIMEOUT);

    // Set idle warning timer (30 minutes)
    idleTimerRef.current = setTimeout(() => {
      isIdleRef.current = true;
      updateStatus('idle', 'User inactive');
      showSessionWarning();
    }, SESSION_CONFIG.IDLE_TIMEOUT);

  }, [isAuthenticated, user, clearTimers, updateStatus, handleSessionTimeout, showSessionWarning]);

  /**
   * Handle user activity events
   */
  const handleActivity = useCallback((event) => {
    // Throttle activity events to avoid excessive processing
    if (activityThrottleRef.current) return;

    activityThrottleRef.current = setTimeout(() => {
      activityThrottleRef.current = null;
      resetSessionTimers();
    }, 1000); // Process activity at most once per second
  }, [resetSessionTimers]);

  /**
   * Restore session on page refresh
   */
  const restoreSession = useCallback(async () => {
    try {
      // Check if user was previously authenticated
      const storedUser = localStorage.getItem('auth-store');

      if (storedUser) {
        const authData = JSON.parse(storedUser);
        const rememberMe = authData.state?.rememberMe;

        // Only restore session if "remember me" was enabled
        if (rememberMe) {
          console.log('Restoring previous session...');
          await refreshAuthState();

          // Reset timers for restored session
          sessionStartRef.current = Date.now();
          resetSessionTimers();
        }
      }
    } catch (error) {
      console.error('Error restoring session:', error);
    }
  }, [refreshAuthState, resetSessionTimers]);

  /**
   * Save session state for restoration
   */
  const saveSessionState = useCallback(() => {
    if (!isAuthenticated || !user) return;

    const sessionState = {
      userId: user.uid,
      sessionStart: sessionStartRef.current,
      lastActivity: lastActivityRef.current,
      rememberMe: true // Enable remember me for all authenticated sessions
    };

    try {
      localStorage.setItem('mythrill-session-state', JSON.stringify(sessionState));
    } catch (error) {
      console.error('Error saving session state:', error);
    }
  }, [isAuthenticated, user]);

  /**
   * Get session information
   */
  const getSessionInfo = useCallback(() => {
    if (!isAuthenticated) return null;

    const now = Date.now();
    const sessionDuration = now - sessionStartRef.current;
    const timeSinceActivity = now - lastActivityRef.current;
    const timeUntilTimeout = SESSION_CONFIG.SESSION_TIMEOUT - sessionDuration;
    const timeUntilIdle = SESSION_CONFIG.IDLE_TIMEOUT - timeSinceActivity;

    return {
      sessionStart: sessionStartRef.current,
      lastActivity: lastActivityRef.current,
      sessionDuration,
      timeSinceActivity,
      timeUntilTimeout: Math.max(0, timeUntilTimeout),
      timeUntilIdle: Math.max(0, timeUntilIdle),
      isIdle: isIdleRef.current,
      isWarningShown: isWarningShownRef.current
    };
  }, [isAuthenticated]);

  // Initialize session management
  useEffect(() => {
    if (!isAuthenticated || !user) {
      clearTimers();
      return;
    }

    // Restore session on mount (page refresh)
    restoreSession();

    // Set up activity listeners
    SESSION_CONFIG.ACTIVITY_EVENTS.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Start session timers
    resetSessionTimers();

    // Save session state periodically
    const saveInterval = setInterval(saveSessionState, 30000); // Save every 30 seconds

    // Cleanup on unmount or auth change
    return () => {
      clearTimers();
      SESSION_CONFIG.ACTIVITY_EVENTS.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      clearInterval(saveInterval);

      // Remove any warning modals
      const warningModal = document.getElementById('session-warning-modal');
      if (warningModal) {
        document.body.removeChild(warningModal);
      }
    };
  }, [isAuthenticated, user, handleActivity, resetSessionTimers, restoreSession, saveSessionState, clearTimers]);

  // Save session state when user navigates away
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveSessionState();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [saveSessionState]);

  return {
    // Session information
    getSessionInfo,

    // Manual controls
    extendSession: resetSessionTimers,
    forceLogout: handleSessionTimeout,

    // Session state
    isIdle: isIdleRef.current,
    isWarningShown: isWarningShownRef.current
  };
};

export default useSessionManagement;
