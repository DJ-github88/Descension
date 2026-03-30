/**
 * Journal Persistence Hook
 *
 * Automatically saves and loads player journal data to/from Firebase.
 * Handles knowledge, notes, boards, folders, and connections.
 */

import { useEffect, useCallback, useRef } from 'react';
import useAuthStore from '../store/authStore';
import useShareableStore from '../store/shareableStore';
import persistenceService from '../services/firebase/persistenceService';

export const useJournalPersistence = () => {
  const { user } = useAuthStore();

  // Auto-save timer refs
  const journalTimerRef = useRef(null);
  const lastSavedStateRef = useRef(null);

  // Debounced auto-save delay (2 seconds)
  const AUTO_SAVE_DELAY = 2000;

  /**
   * Collect current journal state for persistence
   */
  const collectJournalState = useCallback(() => {
    if (!user || user.isGuest) {
      return null;
    }

    const state = useShareableStore?.getState();
    if (!state) return null;

    return {
      // Player knowledge
      playerKnowledge: state.playerKnowledge || [],

      // Personal notes
      playerNotes: state.playerNotes || [],

      // Organization
      journalFolders: state.journalFolders || [],

      // Knowledge boards
      knowledgeBoards: state.knowledgeBoards || [],

      // Board elements
      knowledgeOrbs: state.knowledgeOrbs || [],
      knowledgeConnections: state.knowledgeConnections || [],

      // Current selections
      currentFolderId: state.currentFolderId || null,
      currentBoardId: state.currentBoardId || null,

      version: 1
    };
  }, [user]);

  /**
   * Save journal data to Firebase
   */
  const saveJournal = useCallback(async (journalData = null) => {
    if (!user || user.isGuest) {
      return { success: false, reason: 'No authenticated user' };
    }

    const dataToSave = journalData || collectJournalState();
    if (!dataToSave) {
      return { success: false, reason: 'No data to save' };
    }

    try {
      const result = await persistenceService.saveJournal(user.uid, dataToSave);

      if (result.success) {
        lastSavedStateRef.current = JSON.stringify(dataToSave);
        console.log(`💾 Journal saved for user ${user.uid}`);
      }

      return result;
    } catch (error) {
      console.error('Failed to save journal:', error);
      return { success: false, error: error.message };
    }
  }, [user, collectJournalState]);

  /**
   * Load journal data from Firebase
   */
  const loadJournal = useCallback(async () => {
    if (!user || user.isGuest) {
      return { success: false, reason: 'No authenticated user' };
    }

    try {
      const result = await persistenceService.loadJournal(user.uid);

      if (result) {
        // Update the shareable store with loaded data
        useShareableStore?.setState({
          // Player knowledge
          playerKnowledge: result.playerKnowledge || [],

          // Personal notes
          playerNotes: result.playerNotes || [],

          // Organization
          journalFolders: result.journalFolders || [],

          // Knowledge boards
          knowledgeBoards: result.knowledgeBoards || [],

          // Board elements
          knowledgeOrbs: result.knowledgeOrbs || [],
          knowledgeConnections: result.knowledgeConnections || [],

          // Current selections
          currentFolderId: result.currentFolderId || null,
          currentBoardId: result.currentBoardId || null
        });

        lastSavedStateRef.current = JSON.stringify(result);
        console.log(`📂 Journal loaded for user ${user.uid}`);
        return { success: true, data: result };
      } else {
        console.log(`📂 No saved journal found for user ${user.uid}, using defaults`);
        return { success: false, reason: 'No saved data found' };
      }
    } catch (error) {
      console.error('Failed to load journal:', error);
      return { success: false, error: error.message };
    }
  }, [user]);

  /**
   * Auto-save journal when it changes
   */
  const scheduleAutoSave = useCallback(() => {
    // Clear existing timer
    if (journalTimerRef.current) {
      clearTimeout(journalTimerRef.current);
    }

    // Set new auto-save timer
    journalTimerRef.current = setTimeout(async () => {
      const currentState = collectJournalState();
      if (currentState) {
        const currentStateStr = JSON.stringify(currentState);

        // Only save if state has actually changed
        if (currentStateStr !== lastSavedStateRef.current) {
          await saveJournal(currentState);
        }
      }
    }, AUTO_SAVE_DELAY);
  }, [collectJournalState, saveJournal]);

  /**
   * Force immediate save
   */
  const forceSave = useCallback(async () => {
    if (journalTimerRef.current) {
      clearTimeout(journalTimerRef.current);
      journalTimerRef.current = null;
    }

    return await saveJournal();
  }, [saveJournal]);

  // Load journal when user changes to authenticated user
  useEffect(() => {
    if (user && !user.isGuest) {
      loadJournal();
    }
  }, [user, loadJournal]);

  // Auto-save when journal state changes
  useEffect(() => {
    if (user && !user.isGuest) {
      scheduleAutoSave();
    }

    // Cleanup timer on unmount
    return () => {
      if (journalTimerRef.current) {
        clearTimeout(journalTimerRef.current);
      }
    };
  }, [
    // Watch for changes in journal state
    useShareableStore(state => state.playerKnowledge),
    useShareableStore(state => state.playerNotes),
    useShareableStore(state => state.journalFolders),
    useShareableStore(state => state.knowledgeBoards),
    useShareableStore(state => state.knowledgeOrbs),
    useShareableStore(state => state.knowledgeConnections),
    useShareableStore(state => state.currentFolderId),
    useShareableStore(state => state.currentBoardId),
    scheduleAutoSave,
    user
  ]);

  return {
    // State
    isGuestUser: user?.isGuest || false,
    isAuthenticated: !!user && !user.isGuest,

    // Actions
    saveJournal,
    loadJournal,
    forceSave,

    // Utilities
    collectJournalState
  };
};
