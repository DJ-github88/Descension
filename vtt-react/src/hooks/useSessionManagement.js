/**
 * Session Management Hook
 *
 * complete session management with:
 * - Session timeout and auto-logout
 * - Idle detection with warnings
 * - Session restoration on page refresh
 * - Remember me functionality
 */

import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useRoomContext } from '../contexts/RoomContext';
import useAuthStore from '../store/authStore';
import usePresenceStore from '../store/presenceStore';
import useSocialStore from '../store/socialStore';

// Session configuration
const SESSION_CONFIG = {
 // Session timeout (user will be logged out)
 SESSION_TIMEOUT: 8 * 60 * 60 * 1000, // 8 hours in milliseconds

 // Idle timeout (user gets warning before auto-logout)
 IDLE_TIMEOUT: 15 * 60 * 1000, // 15 minutes in milliseconds

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
 const location = useLocation();
 const { user, isAuthenticated, signOut, refreshAuthState } = useAuthStore();
 const { updateStatus } = usePresenceStore();
 const { isInRoom } = useRoomContext();

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

 // Track whether we've already logged the "bypass" message for the current
 // "off-landing-page" state so we don't spam the console on every mousemove.
 const hasLoggedBypassRef = useRef(false);

 // Refs to handle circular dependency between callbacks
 const showSessionWarningRef = useRef(null);
 const resetSessionTimersRef = useRef(null);

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
  * Handle session timeout (auto-logout)
  */
 const handleSessionTimeout = useCallback(async () => {
  console.log('Session timeout - auto-logging out user');

  // CRITICAL: Clean up Firestore subscriptions BEFORE signOut to prevent permission errors
  try {
   const { cleanup: socialCleanup } = useSocialStore.getState();
   if (socialCleanup) {
    console.log('🧹 Cleaning up social subscriptions before signOut...');
    socialCleanup();
   }
  } catch (e) {
   console.warn('Non-fatal: Could not cleanup social subscriptions:', e.message);
  }

  // Note: presence offline is handled by authStore.signOut() → presenceService.cleanup() → setOffline()
  // We do NOT call updateStatus('offline') here to avoid a race condition where
  // the async Firebase write hasn't completed before signOut() revokes auth.

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

  // CRITICAL FIX: Navigate to home page after logout
  setTimeout(() => {
   if (window.location.pathname !== '/') {
    window.location.href = '/';
   }
  }, 100);
  }, [signOut, clearTimers]);

 /**
  * Show session warning modal
  */
 const showSessionWarning = useCallback(() => {
  if (isWarningShownRef.current) return;

  // CRITICAL FIX: Don't show warning if user is not authenticated
  const { isAuthenticated: currentlyAuth, user: currentUser } = useAuthStore.getState();
  if (!currentlyAuth || !currentUser) {
   console.log('Session warning skipped - user is not authenticated');
   return;
  }

  isWarningShownRef.current = true;

  // Create and show warning modal
  const warningModal = document.createElement('div');
  warningModal.id = 'session-warning-modal';

  let remainingSeconds = Math.floor(SESSION_CONFIG.WARNING_PERIOD / 1000);

  const formatTime = (totalSeconds) => {
    const safeSec = Math.max(0, totalSeconds);
    const minutes = Math.floor(safeSec / 60);
    const seconds = safeSec % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  warningModal.innerHTML = `
    <div style="
      position: fixed;
      inset: 0;
      background: rgba(24, 16, 11, 0.72);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
      padding: 20px;
      box-sizing: border-box;
    ">
      <div style="
        background: #faf6ee;
        border: 1px solid rgba(182, 160, 128, 0.55);
        border-radius: 6px;
        padding: 28px 24px;
        max-width: 440px;
        width: 100%;
        color: #34251a;
        text-align: center;
        box-shadow: 0 16px 45px rgba(36, 26, 18, 0.35);
        box-sizing: border-box;
      ">
        <div style="
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border-radius: 4px;
          background: #f4efe6;
          border: 1px solid rgba(182, 160, 128, 0.45);
          color: #663c32;
          font-size: 1.25rem;
          margin-bottom: 16px;
        ">
          <i class="fas fa-hourglass-half" aria-hidden="true"></i>
        </div>
        <h3 style="
          margin: 0 0 10px 0;
          color: #34251a;
          font-family: 'Cinzel', serif;
          font-size: 1.25rem;
          font-weight: 700;
          letter-spacing: 0.6px;
          text-transform: uppercase;
        ">Session Expiring Soon</h3>
        <p style="
          margin: 0 0 14px 0;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 13px;
          line-height: 1.5;
          color: #5a4033;
        ">
          You will be automatically logged out due to inactivity in:
        </p>
        <div style="
          display: inline-block;
          padding: 8px 24px;
          margin-bottom: 16px;
          background: #fdfbf7;
          border: 1px solid rgba(182, 160, 128, 0.45);
          border-radius: 4px;
        ">
          <span id="session-time-display" style="
            font-family: 'Cinzel', serif;
            font-size: 2.2rem;
            font-weight: 700;
            color: #663c32;
            letter-spacing: 2px;
          ">${formatTime(remainingSeconds)}</span>
        </div>
        <p style="
          margin: 0 0 22px 0;
          font-family: system-ui, -apple-system, sans-serif;
          font-size: 12.5px;
          color: #7c6251;
        ">
          Click &ldquo;Stay Logged In&rdquo; to continue your session.
        </p>
        <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
          <button id="extend-session" type="button" style="
            background: #663c32;
            color: #faf6ee;
            border: 1px solid #663c32;
            padding: 9px 22px;
            border-radius: 4px;
            cursor: pointer;
            font-family: 'Cinzel', serif;
            font-size: 0.85rem;
            font-weight: 600;
            letter-spacing: 0.5px;
            box-shadow: 0 2px 4px rgba(36, 26, 18, 0.2);
            transition: background 0.15s ease, border-color 0.15s ease;
          ">Stay Logged In</button>
          <button id="logout-now" type="button" style="
            background: #fdfbf7;
            color: #5a4033;
            border: 1px solid rgba(182, 160, 128, 0.45);
            padding: 9px 18px;
            border-radius: 4px;
            cursor: pointer;
            font-family: 'Cinzel', serif;
            font-size: 0.85rem;
            font-weight: 600;
            letter-spacing: 0.5px;
            transition: background 0.15s ease, border-color 0.15s ease, color 0.15s ease;
          ">Log Out Now</button>
        </div>
      </div>
    </div>
  `;

  const timeDisplay = warningModal.querySelector('#session-time-display');
  const extendButton = warningModal.querySelector('#extend-session');
  const logoutButton = warningModal.querySelector('#logout-now');

  if (extendButton) {
    extendButton.onmouseenter = () => {
      extendButton.style.background = '#4a2820';
      extendButton.style.borderColor = '#4a2820';
    };
    extendButton.onmouseleave = () => {
      extendButton.style.background = '#663c32';
      extendButton.style.borderColor = '#663c32';
    };
    extendButton.onclick = () => {
      if (countdownInterval) clearInterval(countdownInterval);
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
        warningTimerRef.current = null;
      }
      if (document.body.contains(warningModal)) {
        document.body.removeChild(warningModal);
      }
      isWarningShownRef.current = false;
      if (resetSessionTimersRef.current) resetSessionTimersRef.current();
    };
  }

  if (logoutButton) {
    logoutButton.onmouseenter = () => {
      logoutButton.style.background = '#f4efe6';
      logoutButton.style.color = '#34251a';
      logoutButton.style.borderColor = 'rgba(182, 160, 128, 0.7)';
    };
    logoutButton.onmouseleave = () => {
      logoutButton.style.background = '#fdfbf7';
      logoutButton.style.color = '#5a4033';
      logoutButton.style.borderColor = 'rgba(182, 160, 128, 0.45)';
    };
    logoutButton.onclick = () => {
      if (countdownInterval) clearInterval(countdownInterval);
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current);
        warningTimerRef.current = null;
      }
      if (document.body.contains(warningModal)) {
        document.body.removeChild(warningModal);
      }
      handleSessionTimeout();
    };
  }

  document.body.appendChild(warningModal);

  const countdownInterval = setInterval(() => {
    remainingSeconds -= 1;
    if (remainingSeconds <= 0) {
      clearInterval(countdownInterval);
      if (document.body.contains(warningModal)) {
        document.body.removeChild(warningModal);
      }
      handleSessionTimeout();
    } else if (timeDisplay) {
      timeDisplay.textContent = formatTime(remainingSeconds);
    }
  }, 1000);

  warningTimerRef.current = setTimeout(() => {
    clearInterval(countdownInterval);
    if (document.body.contains(warningModal)) {
      document.body.removeChild(warningModal);
    }
    handleSessionTimeout();
  }, SESSION_CONFIG.WARNING_PERIOD);
 }, [handleSessionTimeout]);

 /**
  * Reset session timers on user activity
  */
 const resetSessionTimers = useCallback(() => {
  if (!isAuthenticated || !user) return;

  if (isWarningShownRef.current) return;

  // CRITICAL FIX: Don't start idle timers if user is in a room or game
  // OR if the user is not on the landing page
  if (isInRoom || location.pathname !== '/') {
   if (!hasLoggedBypassRef.current) {
    console.log('Session timers bypassed - user is in a room/game or not on landing page');
    hasLoggedBypassRef.current = true;
   }
   clearTimers();
   return;
  }

  // We've returned to the landing page; allow the bypass log to fire again
  // the next time the user navigates away.
  hasLoggedBypassRef.current = false;

  const now = Date.now();
  lastActivityRef.current = now;

  // Clear existing timers
  clearTimers();

  // Reset idle state
  isIdleRef.current = false;
  isWarningShownRef.current = false;

  // Update presence if user was away (idle)
  const currentPresence = usePresenceStore.getState().currentUserPresence;
  if (currentPresence?.status === 'away') {
   updateStatus('online', null);
  }

  // Set session timeout timer
  sessionTimerRef.current = setTimeout(() => {
   handleSessionTimeout();
  }, SESSION_CONFIG.SESSION_TIMEOUT);

  // Set idle warning timer
  idleTimerRef.current = setTimeout(() => {
   isIdleRef.current = true;
   updateStatus('away', 'User inactive');
   if (showSessionWarningRef.current) showSessionWarningRef.current();
  }, SESSION_CONFIG.IDLE_TIMEOUT);

 }, [isAuthenticated, user, clearTimers, updateStatus, handleSessionTimeout, isInRoom, location.pathname]);

 /**
  * Handle user activity events
  */
 const handleActivity = useCallback((event) => {
  if (activityThrottleRef.current) return;

  activityThrottleRef.current = setTimeout(() => {
   activityThrottleRef.current = null;
   resetSessionTimers();
  }, 1000);
 }, [resetSessionTimers]);

 /**
  * Restore session on page refresh
  */
 const restoreSession = useCallback(async () => {
  try {
   const storedUser = localStorage.getItem('auth-store');
   if (storedUser) {
    const authData = JSON.parse(storedUser);
    const rememberMe = authData.state?.rememberMe;
    if (rememberMe) {
     console.log('Restoring previous session...');
     await refreshAuthState();
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
   rememberMe: true
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

 // Keep refs updated for circular calls
 useEffect(() => {
  showSessionWarningRef.current = showSessionWarning;
  resetSessionTimersRef.current = resetSessionTimers;
 }, [showSessionWarning, resetSessionTimers]);

 // Initialize session management
 useEffect(() => {
  if (!isAuthenticated || !user) {
   clearTimers();
   const existingModal = document.getElementById('session-warning-modal');
   if (existingModal) {
    document.body.removeChild(existingModal);
    isWarningShownRef.current = false;
   }
   return;
  }

  restoreSession();

  SESSION_CONFIG.ACTIVITY_EVENTS.forEach(event => {
   window.addEventListener(event, handleActivity, { passive: true });
  });

  resetSessionTimers();

  const saveInterval = setInterval(saveSessionState, 30000);

  return () => {
   clearTimers();
   SESSION_CONFIG.ACTIVITY_EVENTS.forEach(event => {
    window.removeEventListener(event, handleActivity);
   });
   clearInterval(saveInterval);

   const warningModal = document.getElementById('session-warning-modal');
   if (warningModal) {
    document.body.removeChild(warningModal);
   }
  };
 }, [isAuthenticated, user, handleActivity, resetSessionTimers, restoreSession, saveSessionState, clearTimers]);

 // Reset timers when location changes
 useEffect(() => {
  if (isAuthenticated && user && location.pathname === '/') {
   console.log('User returned to landing page - restarting session timers');
   resetSessionTimers();
  } else if (location.pathname !== '/') {
   console.log('User navigated away from landing page - clearing session timers');
   clearTimers();
  }
 }, [location.pathname, isAuthenticated, user, resetSessionTimers, clearTimers]);

 // Save session state when user navigates away
 useEffect(() => {
  const handleBeforeUnload = () => {
   saveSessionState();
  };

  window.addEventListener('beforeunload', handleBeforeUnload);
  return () => window.removeEventListener('beforeunload', handleBeforeUnload);
 }, [saveSessionState]);

 return {
  getSessionInfo,
  extendSession: resetSessionTimers,
  forceLogout: handleSessionTimeout,
  isIdle: isIdleRef.current,
  isWarningShown: isWarningShownRef.current
 };
};

export default useSessionManagement;
