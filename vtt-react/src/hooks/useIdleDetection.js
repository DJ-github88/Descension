/**
 * Idle Detection Hook
 * 
 * Automatically detects user inactivity and updates their status to 'away' after 2 minutes.
 * Restores previous status when user becomes active again.
 */

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useRoomContext } from '../contexts/RoomContext';
import usePresenceStore from '../store/presenceStore';

const IDLE_TIMEOUT = 2 * 60 * 1000; // 2 minutes in milliseconds

const useIdleDetection = () => {
  const location = useLocation();
  const { isInRoom } = useRoomContext();
  const idleTimerRef = useRef(null);
  const previousStatusRef = useRef(null);
  const isIdleRef = useRef(false);

  const currentUserPresence = usePresenceStore((state) => state.currentUserPresence);
  const updateStatus = usePresenceStore((state) => state.updateStatus);

  const resetIdleTimer = () => {
    // Clear existing timer
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }

    // CRITICAL: Bypass idle status updates if user is in a room OR not on the landing page
    if (isInRoom || location.pathname !== '/') {
      // If user was previously idle, restore their status immediately upon entering a room or navigating away
      if (isIdleRef.current && previousStatusRef.current) {
        updateStatus(previousStatusRef.current, null);
        isIdleRef.current = false;
        previousStatusRef.current = null;
      }
      return;
    }

    // Get current status to check if we should restore
    const currentStatus = usePresenceStore.getState().currentUserPresence?.status;

    // If user was idle (away) and is now active, restore their previous status
    // BUT only if the current status is still 'away' (user hasn't manually changed it)
    if (isIdleRef.current && previousStatusRef.current && currentStatus === 'away') {
      updateStatus(previousStatusRef.current, null);
      isIdleRef.current = false;
      previousStatusRef.current = null;
    } else if (isIdleRef.current && currentStatus !== 'away') {
      // User manually changed status while idle, so clear idle state without restoring
      isIdleRef.current = false;
      previousStatusRef.current = null;
    }

    // Set new timer to mark user as away after 2 minutes
    idleTimerRef.current = setTimeout(() => {
      const currentStatus = usePresenceStore.getState().currentUserPresence?.status;

      // Only set to away if user is not already away or offline
      if (currentStatus && currentStatus !== 'away' && currentStatus !== 'offline') {
        previousStatusRef.current = currentStatus;
        isIdleRef.current = true;
        updateStatus('away', null);
      }
    }, IDLE_TIMEOUT);
  };

  useEffect(() => {
    // Only track idle if user is logged in and has presence
    if (!currentUserPresence) {
      return;
    }

    // Events that indicate user activity
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart',
      'click'
    ];

    // Throttle mousemove to avoid excessive resets
    let mouseMoveTimeout;
    const handleMouseMove = () => {
      if (mouseMoveTimeout) return;
      mouseMoveTimeout = setTimeout(() => {
        resetIdleTimer();
        mouseMoveTimeout = null;
      }, 1000); // Only reset once per second for mouse moves
    };

    const handleActivity = (e) => {
      if (e.type === 'mousemove') {
        handleMouseMove();
      } else {
        resetIdleTimer();
      }
    };

    // Add event listeners
    events.forEach(event => {
      window.addEventListener(event, handleActivity);
    });

    // Start the initial timer
    resetIdleTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });

      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }

      if (mouseMoveTimeout) {
        clearTimeout(mouseMoveTimeout);
      }
    };
  }, [currentUserPresence?.userId]); // Only re-run if user changes

  return null; // This hook doesn't return anything, it just manages state
};

export default useIdleDetection;

