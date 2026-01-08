/**
 * usePresenceSync Hook
 * 
 * Automatically syncs user presence with game state.
 * Updates presence when entering/leaving local or multiplayer sessions.
 */

import { useEffect } from 'react';
import usePresenceStore from '../store/presenceStore';
import useAuthStore from '../store/authStore';
import useCharacterStore from '../store/characterStore';

const usePresenceSync = (sessionType = null, roomData = null) => {
  const { user } = useAuthStore();
  const character = useCharacterStore((state) => state.character);
  const updateSession = usePresenceStore((state) => state.updateSession);
  const currentUserPresence = usePresenceStore((state) => state.currentUserPresence);

  useEffect(() => {
    // Only update if user is logged in and has a character
    if (!user || !character || !currentUserPresence) {
      return;
    }

    // Build session data based on type
    let sessionData = {
      sessionType: sessionType
    };

    if (sessionType === 'multiplayer' && roomData) {
      sessionData = {
        ...sessionData,
        roomId: roomData.id || roomData.roomId,
        roomName: roomData.name || roomData.roomName,
        roomParticipants: roomData.participants || roomData.players || []
      };
    } else if (sessionType === 'local') {
      sessionData = {
        ...sessionData,
        roomId: null,
        roomName: null,
        roomParticipants: null
      };
    } else if (sessionType === null) {
      // User is idle (not in any session)
      sessionData = {
        sessionType: null,
        roomId: null,
        roomName: null,
        roomParticipants: null
      };
    }

    // Update presence
    updateSession(sessionData);

  }, [sessionType, roomData?.id, roomData?.name, user, character, currentUserPresence]);
};

export default usePresenceSync;

