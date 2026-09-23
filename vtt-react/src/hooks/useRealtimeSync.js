/**
 * Real-time Sync Hook with Conflict Resolution
 *
 * Provides real-time synchronization across devices with conflict resolution.
 * Uses Firebase real-time listeners to detect changes from other devices.
 */

import { useEffect, useCallback, useMemo, useRef, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';
import { logFirestoreSnapshot, trackListener } from '../utils/firestoreDiagnostics';

export const useRealtimeSync = (collection, documentId, onRemoteChange, options = {}) => {
  const useAuthStore = require('../store/authStore').default;
  // Select the raw user slice only; subscribing to the whole store re-renders
  // (and re-runs effects in) every consumer on unrelated auth changes.
  const user = useAuthStore((state) => state.user);
  const userId = user?.uid;
  const isGuest = user?.isGuest;
  const [isConnected, setIsConnected] = useState(false);
  const [lastRemoteUpdate, setLastRemoteUpdate] = useState(null);
  const [conflictDetected, setConflictDetected] = useState(false);
  const [conflictData, setConflictData] = useState(null);

  const unsubscribeRef = useRef(null);
  const localChangesRef = useRef(new Set());
  const lastLocalSaveRef = useRef(null);
  const lastLocalWriteTokenRef = useRef(null);
  const conflictDataRef = useRef(null);

  const {
    enabled = true,
    conflictResolution = 'remote-wins', // 'remote-wins', 'local-wins', 'ask-user'
  } = options;

  /**
   * Stop real-time listener
   */
  const stopSync = useCallback(() => {
    if (unsubscribeRef.current) {
      unsubscribeRef.current();
      unsubscribeRef.current = null;
      trackListener(-1);
      setIsConnected(false);
      console.log(`🛑 Stopped real-time sync for ${collection}/${documentId}`);
    }
  }, [collection, documentId]);

  /**
   * Mark that local changes have been made
   */
  const markLocalChange = useCallback((changeId) => {
    localChangesRef.current.add(changeId);
  }, []);

  /**
   * Mark that local changes have been saved.
   *
   * Pass the `writeToken` returned by the persistence service: the next
   * snapshot whose document carries the same token is our own echo and is
   * ignored. Comparing timestamps is not reliable (client/server clock skew,
   * and the services used to return no timestamp at all, which produced
   * Invalid Dates and disabled this guard entirely).
   */
  const markLocalSave = useCallback((writeToken = null) => {
    lastLocalSaveRef.current = new Date();
    lastLocalWriteTokenRef.current = typeof writeToken === 'string' ? writeToken : null;
    localChangesRef.current.clear();
    setConflictDetected(false);
    setConflictData(null);
  }, []);

  /**
   * Handle conflict resolution
   */
  const handleConflictResolution = useCallback((choice) => {
    // Read from a ref instead of the `conflictData` closure so this callback
    // has a stable identity. Otherwise every conflict detect/resolve changes
    // its identity, which cascades into `startSync` and tears down + re-creates
    // the Firestore listener (whose initial snapshot then re-triggers the
    // conflict, making it look like the modal never resolves).
    const data = conflictDataRef.current;
    if (!data) return;

    if (choice === 'remote') {
      // Accept remote changes
      onRemoteChange(data.remoteData, 'conflict-resolved-remote');
      localChangesRef.current.clear();
    } else if (choice === 'local') {
      // Keep local changes - don't call onRemoteChange.
      // The local changes will be saved on next auto-save, which will
      // overwrite the remote. We MUST clear localChangesRef so the next
      // snapshot doesn't immediately re-trigger the same conflict.
      localChangesRef.current.clear();
    }

    setConflictDetected(false);
    setConflictData(null);
    conflictDataRef.current = null;
  }, [onRemoteChange]);

  /**
   * Start real-time listener for the document
   */
  const startSync = useCallback(() => {
    if (!db || !userId || !documentId || !enabled) {
      // If conditions aren't met, ensure we stop any existing sync
      stopSync();
      return;
    }

    // Stop existing listener before starting a new one
    stopSync();

    // Build the document reference. Support both the legacy
    // "collection/documentId" signature and the new "users/{uid}/collection/documentId"
    // signature used by characterStates / roomStates subcollections.
    let docRef;
    if (collection && collection.startsWith('users/')) {
      const parts = collection.split('/');
      // Expect ["users", "{userId}", "{subcollection}"]
      const subcollection = parts[2];
      docRef = doc(db, 'users', userId, subcollection, documentId);
    } else {
      docRef = doc(db, collection, documentId);
    }

    unsubscribeRef.current = onSnapshot(
      docRef,
      (docSnapshot) => {
        if (!docSnapshot.exists()) {
          setIsConnected(true);
          return;
        }

        const remoteData = docSnapshot.data();
        const remoteTimestamp = remoteData.lastUpdated?.toDate?.() || new Date(remoteData.lastUpdated);
        const remoteVersion = remoteData.version || 1;

        logFirestoreSnapshot({
          collection,
          changes: [{ type: 'modified' }],
          total: 1
        });

        setLastRemoteUpdate(remoteTimestamp);
        setIsConnected(true);

        // Ignore our own write echo (identified by the write token, which is
        // immune to client/server clock skew).
        if (lastLocalWriteTokenRef.current && remoteData.lastWriteToken === lastLocalWriteTokenRef.current) {
          return;
        }

        // Check for conflicts
        const hasLocalChanges = localChangesRef.current.size > 0;

        if (hasLocalChanges) {
          // Conflict detected - we have local changes and remote changes
          const conflictInfo = {
            remoteData,
            remoteTimestamp,
            remoteVersion,
            localTimestamp: lastLocalSaveRef.current
          };

          // Sync the ref before any auto-resolve path calls handleConflictResolution
          // (the render-time sync at the bottom of the hook hasn't run yet).
          conflictDataRef.current = conflictInfo;
          setConflictDetected(true);
          setConflictData(conflictInfo);

          if (conflictResolution === 'remote-wins') {
            handleConflictResolution('remote');
          } else if (conflictResolution === 'local-wins') {
            handleConflictResolution('local');
          } else if (conflictResolution === 'ask-user') {
            // Show conflict resolution modal with convenience helpers
            const userConflictInfo = {
              ...conflictInfo,
              resolveWithRemote: () => handleConflictResolution('remote'),
              resolveWithLocal: () => handleConflictResolution('local')
            };
            conflictDataRef.current = userConflictInfo;
            setConflictData(userConflictInfo);
          }
        } else {
          // No local changes, accept remote update
          onRemoteChange(remoteData, 'remote-update');
        }
      },
      (error) => {
        console.error('Real-time sync error:', error);
        setIsConnected(false);
      }
    );

    console.log(`🔄 Started real-time sync for ${collection}/${documentId}`);
    trackListener(1);
  }, [collection, documentId, userId, enabled, onRemoteChange, conflictResolution, handleConflictResolution, stopSync]);

  // Start/stop sync based on enabled state and dependencies
  useEffect(() => {
    const uid = typeof userId === 'string' ? userId : '';
    const isMock = !uid || uid === 'admin-dev-user' || uid === 'dev-user-123' || uid.startsWith('guest-') || uid.startsWith('demo-');
    if (enabled && uid && documentId && !isMock && !isGuest) {
      startSync();
    } else {
      stopSync();
    }

    // Cleanup function to ensure listener is stopped on unmount or dependency changes
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
        trackListener(-1);
        setIsConnected(false);
        console.log(`🧹 Cleanup: Stopped real-time sync for ${collection}/${documentId} on unmount/dependency change`);
      }
    };
  }, [enabled, userId, isGuest, documentId, collection, startSync, stopSync]);

  // Keep a ref to the latest conflictData so the stable conflict resolver and
  // the snapshot callback can read the current value without depending on it
  // (depending on it would force listener re-subscriptions).
  conflictDataRef.current = conflictData;

  // Stable identity for the returned object: consumers use this object in
  // effect dependency arrays, and a fresh object literal every render caused
  // their effects to re-run (and re-subscribe Firestore listeners) constantly.
  return useMemo(
    () => ({
      // Status
      isConnected,
      conflictDetected,
      conflictData,
      lastRemoteUpdate,

      // Controls
      startSync,
      stopSync,
      markLocalChange,
      markLocalSave,

      // Conflict resolution
      resolveConflict: handleConflictResolution
    }),
    [
      isConnected,
      conflictDetected,
      conflictData,
      lastRemoteUpdate,
      startSync,
      stopSync,
      markLocalChange,
      markLocalSave,
      handleConflictResolution
    ]
  );
};
