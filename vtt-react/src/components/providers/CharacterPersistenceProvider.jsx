/**
 * Character Persistence Provider
 *
 * Provides automatic character state persistence throughout the app.
 * Should be included high in the component tree to ensure persistence works.
 */

import React, { useEffect, useCallback } from 'react';
import ConflictResolutionModal from '../common/ConflictResolutionModal';

const CharacterPersistenceProvider = ({ children }) => {
  // Use dynamic require to break circular dependencies
  const useAuthStore = require('../../store/authStore').default;
  const useCharacterStore = require('../../store/characterStore').default;
  const { useCharacterPersistence } = require('../../hooks/useCharacterPersistence');

  const { user } = useAuthStore();
  const currentCharacterId = useCharacterStore(state => state.currentCharacterId);
  const {
    isAuthenticated,
    forceSave,
    conflictDetected,
    conflictData,
    resolveConflict
  } = useCharacterPersistence();

  const handleResolveWithLocal = useCallback(() => {
    resolveConflict('local');
  }, [resolveConflict]);

  const handleResolveWithRemote = useCallback(() => {
    resolveConflict('remote');
  }, [resolveConflict]);

  const handleConflictCancel = useCallback(() => {
    resolveConflict('remote');
  }, [resolveConflict]);

  // Force save on page unload for authenticated users
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isAuthenticated && currentCharacterId) {
        // Force synchronous save (though this won't actually be synchronous)
        forceSave();
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && isAuthenticated && currentCharacterId) {
        forceSave();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, currentCharacterId, forceSave]);

  // Log persistence status for debugging
  useEffect(() => {
    if (user) {
      if (user.isGuest) {
        console.log('👤 Guest user - character data will not persist');
      } else {
        console.log('💾 Authenticated user - character data will persist to Firebase');
      }
    }
  }, [user]);

  return (
    <>
      {children}
      <ConflictResolutionModal
        isOpen={conflictDetected}
        conflictType="character"
        localTimestamp={conflictData?.localTimestamp}
        remoteTimestamp={conflictData?.remoteTimestamp}
        onResolveWithLocal={handleResolveWithLocal}
        onResolveWithRemote={handleResolveWithRemote}
        onCancel={handleConflictCancel}
      />
    </>
  );
};

export default CharacterPersistenceProvider;
