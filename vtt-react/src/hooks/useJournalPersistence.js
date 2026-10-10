/**
 * Journal Persistence Hook
 *
 * Automatically saves and loads player journal data to/from Firebase.
 * Handles knowledge, notes, boards, folders, and connections.
 */

import { useEffect, useCallback, useRef } from 'react';
import { captureOwnerGuard, loadScopedDraft } from '../persistence/scopedConsumer';
import { whenHandoffIdle } from '../persistence/authBootstrapGateBinding';
import { getBootstrapGateState } from '../persistence/bootstrapPrivacyGate';
import { getScopedStoreEngine } from '../persistence/scopedStoreStorage';
export const useJournalPersistence = () => {
 const persistenceService = require('../services/firebase/persistenceService').default;
 // Use shifting require to break circular dependencies
 const useAuthStore = require('../store/authStore').default;
 const useShareableStore = require('../store/shareableStore').default;

 const { user } = useAuthStore();

 const playerKnowledge = useShareableStore(state => state.playerKnowledge);
 const playerNotes = useShareableStore(state => state.playerNotes);
 const journalFolders = useShareableStore(state => state.journalFolders);
 const knowledgeBoards = useShareableStore(state => state.knowledgeBoards);
 const knowledgeOrbs = useShareableStore(state => state.knowledgeOrbs);
 const knowledgeConnections = useShareableStore(state => state.knowledgeConnections);
 const currentFolderId = useShareableStore(state => state.currentFolderId);
 const currentBoardId = useShareableStore(state => state.currentBoardId);

 const journalTimerRef = useRef(null);
 const lastSavedStateRef = useRef(null);

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
   masterBoardBackground: state.masterBoardBackground ?? null,

   // Board elements
   knowledgeOrbs: state.knowledgeOrbs || [],
   knowledgeConnections: state.knowledgeConnections || [],

   // Current selections
   currentFolderId: state.currentFolderId || null,
   currentBoardId: state.currentBoardId || null,

   version: 1
  };
  }, [user, useShareableStore]);

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

  const usePersistenceStatusStore = require('../store/persistenceStatusStore').default;
  const useNotificationStore = require('../store/notificationStore').default;

  // P5-03 owner fence: capture the owner and account generation BEFORE any
  // asynchronous work. The captured scoped guard authorizes completing A's
  // already-started persistence operation, but mutating shared UI state
  // (status, saved-state reference, notifications) additionally requires the
  // live authentication principal to still be this operation's owner: during
  // handoff preservation the gate intentionally keeps the old scope/generation
  // current while the live principal has already changed, so the scoped guard
  // alone would let a stale A continuation overwrite B's UI.
  const startedForUid = user.uid;
  const ownerGuard = captureOwnerGuard(startedForUid);
  const canTouchSharedState = () => {
   if (!ownerGuard.ok || !ownerGuard.isCurrent()) return false;
   const liveUser = useAuthStore.getState().user;
   return !!liveUser && !liveUser.isGuest && liveUser.uid === startedForUid;
  };

  try {
   if (canTouchSharedState()) {
    usePersistenceStatusStore?.getState().setStatus('journal', 'saving');
   }
   const result = await persistenceService.saveJournal(startedForUid, dataToSave);

   if (!canTouchSharedState()) {
    // Account changed while the save was in flight: keep the honest A-owned
    // result for the caller but never apply it to the new owner's UI/data.
    return result;
   }

   if (result.success) {
    lastSavedStateRef.current = JSON.stringify(dataToSave);
    usePersistenceStatusStore?.getState().setStatus('journal', 'saved');
    console.log(`💾 Journal saved for user ${startedForUid}`);
   } else {
    const reason = result.error || result.reason || 'Unknown error';
    usePersistenceStatusStore?.getState().setStatus('journal', 'error', reason);
    useNotificationStore?.getState().showError(
     'Your journal changes could not be saved to the cloud. They are kept locally and will retry on your next edit.',
     { title: 'Journal save failed' }
    );
   }

   return result;
  } catch (error) {
   console.error('Failed to save journal:', error);
   if (canTouchSharedState()) {
    usePersistenceStatusStore?.getState().setStatus('journal', 'error', error.message);
    useNotificationStore?.getState().showError(
     'Your journal changes could not be saved to the cloud. They are kept locally and will retry on your next edit.',
     { title: 'Journal save failed' }
    );
   }
   return { success: false, error: error.message };
  }
  }, [user, collectJournalState, persistenceService, useAuthStore]);

  /**
   * Load journal data from Firebase
   */
  const loadJournal = useCallback(async () => {
   if (!user || user.isGuest) {
    return { success: false, reason: 'No authenticated user' };
   }

   const startedForUid = user.uid;
   // P5-04: a missing or invalid owner guard must NEVER authorize applying
   // private journal data. If no verified owner scope is active yet, wait for
   // the handoff to settle, then require the same live principal AND the same
   // account generation before capturing a guard and starting the read.
   // Otherwise refuse without touching private working state.
   const startedGeneration = getBootstrapGateState().accountGeneration;
   let ownerGuard = captureOwnerGuard(startedForUid);
   if (!ownerGuard.ok) {
    let handoffResult = null;
    try {
     handoffResult = await whenHandoffIdle();
    } catch (_error) {
     handoffResult = null;
    }
    if (handoffResult && handoffResult.blocked === true) {
     return { success: false, reason: 'owner-changed-during-load' };
    }
    const liveUser = useAuthStore.getState().user;
    const samePrincipal = !!liveUser && !liveUser.isGuest && liveUser.uid === startedForUid;
    const sameGeneration = getBootstrapGateState().accountGeneration === startedGeneration;
    ownerGuard = captureOwnerGuard(startedForUid);
    if (!samePrincipal || !sameGeneration || !ownerGuard.ok) {
     return { success: false, reason: 'owner-changed-during-load' };
    }
   }

   // P5-02: capture the owner-scoped local revision/identity and dirty state
   // before the cloud read. The same contract must be revalidated after the
   // read (synchronously, immediately before applying) so an older cloud
   // response can never replace newer authored work that arrives while the
   // read is pending.
   const engine = getScopedStoreEngine('journal.shareable');
   const captureLocalJournal = () => {
    const local = loadScopedDraft({ familyId: 'journal.shareable' });
    return {
     revision: local.status === 'OK' ? local.localRevision : null,
     draftId: local.status === 'OK' ? local.draftId : null,
     dirty: (local.status === 'OK' && !!local.envelope && local.envelope.dirty === true) ||
      (engine && typeof engine.__isDirty === 'function' && engine.__isDirty()),
     pending: !!(engine && typeof engine.__hasPendingWrites === 'function' && engine.__hasPendingWrites()),
     refused: !!(engine && typeof engine.__hasRefusedCandidate === 'function' && engine.__hasRefusedCandidate())
    };
   };
   const startedLocal = captureLocalJournal();

   try {
    const result = await persistenceService.loadJournal(startedForUid);

    const liveUser = useAuthStore.getState().user;
    const samePrincipal = !!liveUser && !liveUser.isGuest && liveUser.uid === startedForUid;
    const ownerCurrent = ownerGuard.ok && ownerGuard.isCurrent();
    if (!samePrincipal || !ownerCurrent) {
     return { success: false, reason: 'owner-changed-during-load' };
    }

    // P5-02: a valid owner-scoped dirty local journal (unsent authored work)
    // must never be overwritten by an older cloud hydration. Keep the authored
    // local version — it stays recoverable and is pushed by the owner's sync
    // path — and leave the cloud document intact; never report it as saved or
    // as empty. Newer local work is detected by dirty/pending/refused state
    // or by any revision/identity movement across the read.
    if (result) {
     const local = captureLocalJournal();
     const localDirty =
      startedLocal.dirty || startedLocal.pending || startedLocal.refused ||
      local.dirty || local.pending || local.refused ||
      local.revision !== startedLocal.revision ||
      local.draftId !== startedLocal.draftId;
     if (localDirty) {
      console.log(`📂 Journal local edits for user ${startedForUid} kept; cloud hydration skipped`);
      return { success: false, reason: 'local-dirty-preserved' };
     }
    }

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
     console.log(`📂 Journal loaded for user ${startedForUid}`);
     return { success: true, data: result };
    } else {
     console.log(`📂 No saved journal found for user ${startedForUid}, using defaults`);
     return { success: false, reason: 'No saved data found' };
    }
   } catch (error) {
    console.error('Failed to load journal:', error);
    return { success: false, error: error.message };
   }
  }, [user, persistenceService, useShareableStore, useAuthStore]);

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
   let cancelled = false;
   if (user && !user.isGuest) {
    const uid = user.uid;
    (async () => {
     let handoffResult = null;
     try {
      handoffResult = await whenHandoffIdle();
     } catch (_error) {
      handoffResult = null;
     }
     if (cancelled) return;
     // A blocked handoff leaves no verified owner scope; never start private
     // journal hydration for an ambiguous principal.
     if (handoffResult && handoffResult.blocked === true) return;
     const liveUser = useAuthStore.getState().user;
     if (!liveUser || liveUser.isGuest || liveUser.uid !== uid) return;
     loadJournal();
    })();
   }
   return () => { cancelled = true; };
  }, [user, loadJournal, useAuthStore]);

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
  playerKnowledge,
  playerNotes,
  journalFolders,
  knowledgeBoards,
  knowledgeOrbs,
  knowledgeConnections,
  currentFolderId,
  currentBoardId,
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
