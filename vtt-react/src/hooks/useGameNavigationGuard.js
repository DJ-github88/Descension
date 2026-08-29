import { useEffect } from 'react';

/**
 * useGameNavigationGuard
 *
 * Traps browser Back button / swipe-back navigation gestures during active game play
 * (/game and /multiplayer) to avoid accidentally leaving or destroying the game session.
 *
 * When a popstate (back navigation) is detected:
 * 1. Immediately re-pushes current state to keep URL in place.
 * 2. Emits a 'mythrill_request_exit_game' custom event so the game's confirmed exit dialog is shown.
 */
export function useGameNavigationGuard(enabled = true) {
  useEffect(() => {
    if (!enabled || typeof window === 'undefined') return;

    // Push a dummy state into history so the Back button triggers popstate without exiting
    const guardKey = 'mythrill_game_guard';
    const stateObj = { [guardKey]: true, ts: Date.now() };

    try {
      window.history.pushState(stateObj, document.title, window.location.href);
    } catch (err) {
      console.warn('Could not push history guard state:', err);
    }

    const handlePopState = (event) => {
      // Re-push history state immediately to stay on the game screen
      try {
        window.history.pushState(stateObj, document.title, window.location.href);
      } catch (err) {
        console.warn('Could not re-push guard state:', err);
      }

      // Dispatch event to show in-game exit confirmation dialog
      window.dispatchEvent(new CustomEvent('mythrill_request_exit_game'));
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [enabled]);
}

export default useGameNavigationGuard;
